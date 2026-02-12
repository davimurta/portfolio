import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/api-auth'
import { sanitizeText, sanitizeMarkdown, sanitizeSlug, sanitizeArray, sanitizeUrl, isValidLocalImagePath } from '@/lib/sanitize'

// GET - List all projects
export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(projects)
  })
}

// POST - Create new project
export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
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

      // Validate gallery images are all local upload paths
      const validGallery: string[] = []
      if (Array.isArray(gallery)) {
        for (const img of gallery) {
          if (typeof img === 'string' && isValidLocalImagePath(img)) {
            validGallery.push(img)
          }
        }
      }

      // Sanitize URLs (allow only http/https)
      const validLiveUrl = liveUrl ? sanitizeUrl(liveUrl) : null
      const validGithubUrl = githubUrl ? sanitizeUrl(githubUrl) : null

      // Check if slug already exists
      const existingProject = await prisma.project.findUnique({
        where: { slug: sanitizedSlug },
      })

      if (existingProject) {
        return NextResponse.json(
          { error: 'Já existe um projeto com este slug' },
          { status: 400 }
        )
      }

      const project = await prisma.project.create({
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

      return NextResponse.json(project, { status: 201 })

    } catch (error) {
      console.error('Create project error:', error)
      return NextResponse.json(
        { error: 'Erro ao criar projeto' },
        { status: 500 }
      )
    }
  })
}
