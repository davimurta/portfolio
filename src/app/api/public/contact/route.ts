import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Simple rate limiting in memory (per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5 // max requests
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

// Basic input sanitization
function sanitize(input: string): string {
  return input
    .trim()
    .slice(0, 5000) // Limit length
    .replace(/<[^>]*>/g, '') // Remove HTML tags
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Muitas mensagens enviadas. Tente novamente mais tarde.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, projectType, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nome, email e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitize(name),
      email: sanitize(email).toLowerCase(),
      projectType: projectType ? sanitize(projectType) : null,
      message: sanitize(message),
    }

    // Save to database
    await prisma.message.create({
      data: sanitizedData,
    })

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso!',
    })

  } catch (error) {
    console.error('Error saving message:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem. Tente novamente.' },
      { status: 500 }
    )
  }
}
