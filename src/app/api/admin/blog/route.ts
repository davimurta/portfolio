import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/api-auth'
import { sanitizeText, sanitizeMarkdown, sanitizeSlug, sanitizeArray, isValidLocalImagePath } from '@/lib/sanitize'

// GET - List all blog posts
export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(posts)
  })
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await req.json()
      const { title, slug, excerpt, content, tags, coverImage, published } = body

      // Sanitize all inputs
      const sanitizedTitle = sanitizeText(title)
      const sanitizedSlug = sanitizeSlug(slug)
      const sanitizedExcerpt = sanitizeText(excerpt)
      const sanitizedContent = sanitizeMarkdown(content)
      const sanitizedTags = sanitizeArray(tags)

      // Validate required fields after sanitization
      if (!sanitizedTitle || !sanitizedSlug || !sanitizedExcerpt || !sanitizedContent) {
        return NextResponse.json(
          { error: 'Título, slug, resumo e conteúdo são obrigatórios' },
          { status: 400 }
        )
      }

      // Validate cover image is a local upload path (not external URL)
      let validCoverImage: string | null = null
      if (coverImage) {
        if (isValidLocalImagePath(coverImage)) {
          validCoverImage = coverImage
        } else {
          return NextResponse.json(
            { error: 'Imagem inválida. Use apenas imagens enviadas pelo upload.' },
            { status: 400 }
          )
        }
      }

      // Check if slug already exists
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug: sanitizedSlug },
      })

      if (existingPost) {
        return NextResponse.json(
          { error: 'Já existe um post com este slug' },
          { status: 400 }
        )
      }

      const post = await prisma.blogPost.create({
        data: {
          title: sanitizedTitle,
          slug: sanitizedSlug,
          excerpt: sanitizedExcerpt,
          content: sanitizedContent,
          tags: sanitizedTags,
          coverImage: validCoverImage,
          published: published === true,
        },
      })

      return NextResponse.json(post, { status: 201 })

    } catch (error) {
      console.error('Create blog error:', error)
      return NextResponse.json(
        { error: 'Erro ao criar post' },
        { status: 500 }
      )
    }
  })
}
