import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-me')

interface TokenPayload {
  sessionId: string
  userId: string
  mfaVerified: boolean
}

async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect admin dashboard routes
  if (pathname.startsWith('/abacaxi/dashboard')) {
    const token = request.cookies.get('session')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/abacaxi', request.url))
    }

    const payload = await verifyToken(token)

    if (!payload) {
      const response = NextResponse.redirect(new URL('/abacaxi', request.url))
      response.cookies.delete('session')
      return response
    }

    // If not MFA verified, redirect to MFA page
    if (!payload.mfaVerified) {
      return NextResponse.redirect(new URL('/abacaxi/mfa', request.url))
    }

    return NextResponse.next()
  }

  // Protect MFA page - must have session but not be MFA verified
  if (pathname === '/abacaxi/mfa') {
    const token = request.cookies.get('session')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/abacaxi', request.url))
    }

    const payload = await verifyToken(token)

    if (!payload) {
      const response = NextResponse.redirect(new URL('/abacaxi', request.url))
      response.cookies.delete('session')
      return response
    }

    // If already MFA verified, redirect to dashboard
    if (payload.mfaVerified) {
      return NextResponse.redirect(new URL('/abacaxi/dashboard', request.url))
    }

    return NextResponse.next()
  }

  // Login page - redirect to dashboard if already authenticated
  if (pathname === '/abacaxi') {
    const token = request.cookies.get('session')?.value

    if (token) {
      const payload = await verifyToken(token)

      if (payload) {
        if (payload.mfaVerified) {
          return NextResponse.redirect(new URL('/abacaxi/dashboard', request.url))
        } else {
          return NextResponse.redirect(new URL('/abacaxi/mfa', request.url))
        }
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/abacaxi', '/abacaxi/:path*'],
}
