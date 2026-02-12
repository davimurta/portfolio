import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'
import { prisma } from './prisma'

export interface AuthenticatedRequest extends NextRequest {
  userId: string
}

// Verify auth and return result (for use in non-wrapped handlers)
export async function verifyAuth(request: NextRequest): Promise<{ authenticated: boolean; userId?: string }> {
  try {
    const token = request.cookies.get('session')?.value

    if (!token) {
      return { authenticated: false }
    }

    const payload = await verifyToken(token)
    if (!payload || !payload.mfaVerified) {
      return { authenticated: false }
    }

    // Verify session exists and is not expired
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
    })

    if (!session || session.expiresAt < new Date()) {
      return { authenticated: false }
    }

    return { authenticated: true, userId: payload.userId }

  } catch {
    return { authenticated: false }
  }
}

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const token = request.cookies.get('session')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Sessão inválida' },
        { status: 401 }
      )
    }

    // Check if MFA is verified
    if (!payload.mfaVerified) {
      return NextResponse.json(
        { error: 'Verificação MFA necessária' },
        { status: 403 }
      )
    }

    // Verify session exists and is not expired
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
    })

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Sessão expirada' },
        { status: 401 }
      )
    }

    return handler(request, payload.userId)

  } catch (error) {
    console.error('Auth middleware error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
