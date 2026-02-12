import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/api-auth'

// GET - Get single message
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async () => {
    const { id } = await params

    const message = await prisma.message.findUnique({
      where: { id },
    })

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(message)
  })
}

// PATCH - Mark message as read/unread
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req) => {
    try {
      const { id } = await params
      const body = await req.json()
      const { read } = body

      const message = await prisma.message.update({
        where: { id },
        data: { read: read ?? true },
      })

      return NextResponse.json(message)

    } catch (error) {
      console.error('Update message error:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar mensagem' },
        { status: 500 }
      )
    }
  })
}

// DELETE - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async () => {
    try {
      const { id } = await params

      await prisma.message.delete({
        where: { id },
      })

      return NextResponse.json({ success: true })

    } catch (error) {
      console.error('Delete message error:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar mensagem' },
        { status: 500 }
      )
    }
  })
}
