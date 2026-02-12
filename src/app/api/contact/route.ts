import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendContactNotification } from '@/lib/email'

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const maxRequests = 5

  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown'

    // Rate limiting
    if (!checkRateLimit(ipAddress)) {
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

    // Sanitize inputs (basic XSS prevention)
    const sanitize = (str: string) => str.replace(/<[^>]*>/g, '').trim()

    const sanitizedData = {
      name: sanitize(name).substring(0, 100),
      email: sanitize(email).substring(0, 100),
      projectType: projectType ? sanitize(projectType).substring(0, 50) : null,
      message: sanitize(message).substring(0, 2000),
    }

    // Save to database
    const newMessage = await prisma.message.create({
      data: sanitizedData,
    })

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      await sendContactNotification(adminEmail, {
        name: sanitizedData.name,
        email: sanitizedData.email,
        projectType: sanitizedData.projectType || 'Não especificado',
        message: sanitizedData.message,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso!',
      id: newMessage.id,
    }, { status: 201 })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem. Tente novamente.' },
      { status: 500 }
    )
  }
}
