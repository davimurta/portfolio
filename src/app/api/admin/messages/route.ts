import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/api-auth'

// GET - List all messages
export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(messages)
  })
}
