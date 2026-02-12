import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/api-auth'
import { sanitizeText, sanitizeMarkdown, sanitizeSlug, sanitizeArray, sanitizeUrl, isValidLocalImagePath } from '@/lib/sanitize'

// GET - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async () => {
    const { id } = await params

    const project = await prisma.project.findUnique({
      where: { id },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  })
}

// PUT - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req) => {
    try {
      const { id } = await params
      const body = await req.json()
      const {
        title,
        slug,
        description,
        fullDescription,
        coverImage,
        gallery,
        technologies,
        liveUrl,
        githubUrl,
        featured,
        published,
      } = body

      // Check if project exists
      const existingProject = await prisma.project.findUnique({
        where: { id },
      })

      if (!existingProject) {
        return NextResponse.json(
          { error: 'Projeto não encontrado' },
          { status: 404 }
        )
      }

      // Sanitize all inputs
      const sanitizedTitle = sanitizeText(title)
      const sanitizedSlug = sanitizeSlug(slug)
      const sanitizedDescription = sanitizeText(description)
      const sanitizedFullDescription = fullDescription ? sanitizeMarkdown(fullDescription) : null
      const sanitizedTechnologies = sanitizeArray(technologies)

      // Validate required fields after sanitization
      if (!sanitizedTitle || !sanitizedSlug || !sanitizedDescription) {
        return NextResponse.json(
          { error: 'Título, slug e descrição são obrigatórios' },
          { status: 400 }
        )
      }

      // Check if slug is taken by another project
      const slugTaken = await prisma.project.findFirst({
        where: {
          slug: sanitizedSlug,
          NOT: { id },
        },
      })

      if (slugTaken) {
        return NextResponse.json(
          { error: 'Já existe outro projeto com este slug' },
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

      // Validate gallery images
      const validGallery: string[] = []
      if (Array.isArray(gallery)) {
        for (const img of gallery) {
          if (typeof img === 'string' && isValidLocalImagePath(img)) {
            validGallery.push(img)
          }
        }
      }

      // Sanitize URLs
      const validLiveUrl = liveUrl ? sanitizeUrl(liveUrl) : null
      const validGithubUrl = githubUrl ? sanitizeUrl(githubUrl) : null

      const project = await prisma.project.update({
        where: { id },
        data: {
          title: sanitizedTitle,
          slug: sanitizedSlug,
          description: sanitizedDescription,
          fullDescription: sanitizedFullDescription,
          coverImage: validCoverImage,
          gallery: validGallery,
          technologies: sanitizedTechnologies,
          liveUrl: validLiveUrl,
          githubUrl: validGithubUrl,
          featured: featured === true,
          published: published === true,
        },
      })

      return NextResponse.json(project)

    } catch (error) {
      console.error('Update project error:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar projeto' },
        { status: 500 }
      )
    }
  })
}

// DELETE - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async () => {
    try {
      const { id } = await params

      const project = await prisma.project.findUnique({
        where: { id },
      })

      if (!project) {
        return NextResponse.json(
          { error: 'Projeto não encontrado' },
          { status: 404 }
        )
      }

      await prisma.project.delete({
        where: { id },
      })

      return NextResponse.json({ success: true })

    } catch (error) {
      console.error('Delete project error:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar projeto' },
        { status: 500 }
      )
    }
  })
}
