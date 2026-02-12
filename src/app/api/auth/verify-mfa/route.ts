import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, updateSessionMFA } from '@/lib/auth'
import { verifyMFAToken } from '@/lib/mfa'
import { sendLoginNotification } from '@/lib/email'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: 'Código inválido' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Sessão não encontrada. Faça login novamente.' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Sessão inválida. Faça login novamente.' },
        { status: 401 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user || !user.mfaSecret) {
      return NextResponse.json(
        { error: 'Usuário não encontrado ou MFA não configurado' },
        { status: 400 }
      )
    }

    // Verify MFA code
    const isValidCode = verifyMFAToken(code, user.mfaSecret)
    if (!isValidCode) {
      return NextResponse.json(
        { error: 'Código inválido ou expirado' },
        { status: 401 }
      )
    }

    // Update session to mark MFA as verified
    const newToken = await updateSessionMFA(payload.sessionId)

    // Update cookie with new token
    cookieStore.set('session', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    })

    // Send login notification
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      null
    await sendLoginNotification(user.email, ipAddress)

    return NextResponse.json({
      success: true,
      message: 'Verificação concluída',
    })

  } catch (error) {
    console.error('MFA verification error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
