import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-me')
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export interface TokenPayload {
  sessionId: string
  userId: string
  mfaVerified: boolean
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: string, mfaVerified: boolean = false): Promise<string> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  const session = await prisma.session.create({
    data: {
      userId,
      token: crypto.randomUUID(),
      mfaVerified,
      expiresAt,
    },
  })

  const token = await new SignJWT({
    sessionId: session.id,
    userId,
    mfaVerified,
  } satisfies TokenPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(JWT_SECRET)

  return token
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<{ userId: string; mfaVerified: boolean } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload) return null

  const session = await prisma.session.findUnique({
    where: { id: payload.sessionId },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    return null
  }

  return {
    userId: session.userId,
    mfaVerified: session.mfaVerified,
  }
}

export async function updateSessionMFA(sessionId: string): Promise<string> {
  const session = await prisma.session.update({
    where: { id: sessionId },
    data: { mfaVerified: true },
  })

  const token = await new SignJWT({
    sessionId: session.id,
    userId: session.userId,
    mfaVerified: true,
  } satisfies TokenPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(session.expiresAt)
    .sign(JWT_SECRET)

  return token
}

export async function deleteSession(sessionId: string): Promise<void> {
  await prisma.session.delete({
    where: { id: sessionId },
  }).catch(() => {})
}

export async function cleanExpiredSessions(): Promise<void> {
  await prisma.session.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  })
}

export async function logLoginAttempt(email: string, ipAddress: string | null, success: boolean): Promise<void> {
  await prisma.loginAttempt.create({
    data: { email, ipAddress, success },
  })
}

export async function checkRateLimit(email: string, ipAddress: string | null): Promise<boolean> {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)

  const attempts = await prisma.loginAttempt.count({
    where: {
      OR: [
        { email },
        ...(ipAddress ? [{ ipAddress }] : []),
      ],
      success: false,
      createdAt: { gte: fifteenMinutesAgo },
    },
  })

  return attempts < 5
}
