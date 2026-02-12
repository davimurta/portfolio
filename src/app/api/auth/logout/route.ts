import { NextResponse } from 'next/server'
import { verifyToken, deleteSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (token) {
      const payload = await verifyToken(token)
      if (payload) {
        await deleteSession(payload.sessionId)
      }
    }

    cookieStore.delete('session')

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
