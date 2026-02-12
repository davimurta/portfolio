import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/api-auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'

// Allowed image types
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
]

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Magic bytes for image validation
const IMAGE_SIGNATURES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header (WebP starts with RIFF)
}

function validateImageSignature(buffer: Buffer, mimeType: string): boolean {
  const signatures = IMAGE_SIGNATURES[mimeType]

  if (!signatures) {
    // For avif, we'll trust the mime type as it's complex to validate
    if (mimeType === 'image/avif') return true
    return false
  }

  return signatures.some(signature =>
    signature.every((byte, index) => buffer[index] === byte)
  )
}

function generateSafeFilename(originalName: string): string {
  // Get extension from original name
  const ext = path.extname(originalName).toLowerCase()

  // Generate random filename
  const randomName = crypto.randomBytes(16).toString('hex')
  const timestamp = Date.now()

  return `${timestamp}-${randomName}${ext}`
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const formData = await req.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, AVIF' },
          { status: 400 }
        )
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File too large. Maximum size: 5MB' },
          { status: 400 }
        )
      }

      // Read file buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Validate magic bytes to prevent disguised files
      if (!validateImageSignature(buffer, file.type)) {
        return NextResponse.json(
          { error: 'Invalid file content. File does not match declared type.' },
          { status: 400 }
        )
      }

      // Check for embedded scripts in file content
      const content = buffer.toString('utf8', 0, Math.min(buffer.length, 1000))
      const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<\?php/i,
        /<%/,
      ]

      if (dangerousPatterns.some(pattern => pattern.test(content))) {
        return NextResponse.json(
          { error: 'File contains potentially dangerous content' },
          { status: 400 }
        )
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      // Generate safe filename
      const safeFilename = generateSafeFilename(file.name)
      const filePath = path.join(uploadsDir, safeFilename)

      // Write file
      await writeFile(filePath, buffer)

      // Return the public URL
      const publicUrl = `/uploads/${safeFilename}`

      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename: safeFilename,
      })

    } catch (error) {
      console.error('Upload error:', error)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }
  })
}
