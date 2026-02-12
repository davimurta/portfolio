import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/api-auth'
import { sanitizeText, sanitizeMarkdown, sanitizeSlug, sanitizeArray, isValidLocalImagePath } from '@/lib/sanitize'

// GET - Get single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async () => {
    const { id } = await params

    const post = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  })
}

// PUT - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req) => {
    try {
      const { id } = await params
      const body = await req.json()
      const { title, slug, excerpt, content, tags, coverImage, published } = body

      // Check if post exists
      const existingPost = await prisma.blogPost.findUnique({
        where: { id },
      })

      if (!existingPost) {
        return NextResponse.json(
          { error: 'Post não encontrado' },
          { status: 404 }
        )
      }

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

      // Check if slug is taken by another post
      const slugTaken = await prisma.blogPost.findFirst({
        where: {
          slug: sanitizedSlug,
          NOT: { id },
        },
      })

      if (slugTaken) {
        return NextResponse.json(
          { error: 'Já existe outro post com este slug' },
          { status: 400 }
        )
      }

      // Validate cover image
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

      const post = await prisma.blogPost.update({
        where: { id },
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

      return NextResponse.json(post)

    } catch (error) {
      console.error('Update blog error:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar post' },
        { status: 500 }
      )
    }
  })
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async () => {
    try {
      const { id } = await params

      const post = await prisma.blogPost.findUnique({
        where: { id },
      })

      if (!post) {
        return NextResponse.json(
          { error: 'Post não encontrado' },
          { status: 404 }
        )
      }

      await prisma.blogPost.delete({
        where: { id },
      })

      return NextResponse.json({ success: true })

    } catch (error) {
      console.error('Delete blog error:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar post' },
        { status: 500 }
      )
    }
  })
}
