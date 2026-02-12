import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createSession, logLoginAttempt, checkRateLimit } from '@/lib/auth'
import { generateMFAToken } from '@/lib/mfa'
import { sendMFACode } from '@/lib/email'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown'

    // Rate limiting
    const canAttempt = await checkRateLimit(email, ipAddress)
    if (!canAttempt) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
        { status: 429 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      await logLoginAttempt(email, ipAddress, false)
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      await logLoginAttempt(email, ipAddress, false)
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Create session (not MFA verified yet)
    const token = await createSession(user.id, false)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    // Generate and send MFA code via email
    if (user.mfaSecret) {
      const mfaCode = generateMFAToken(user.mfaSecret)
      await sendMFACode(user.email, mfaCode)
    }

    await logLoginAttempt(email, ipAddress, true)

    return NextResponse.json({
      success: true,
      requiresMFA: true,
      message: 'Código de verificação enviado para seu email',
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
