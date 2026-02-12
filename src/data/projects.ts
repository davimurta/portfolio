import { prisma } from '@/lib/prisma'

export async function getProjectBySlug(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug, published: true },
  })

  if (!project) return null

  const technologies = Array.isArray(project.technologies)
    ? project.technologies as string[]
    : []

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.description,
    fullDescription: project.fullDescription || '',
    tags: technologies,
    image: project.coverImage || '',
    gallery: Array.isArray(project.gallery) && project.gallery.length > 0
      ? project.gallery
      : (project.coverImage ? [project.coverImage] : []),
    liveUrl: project.liveUrl || undefined,
    githubUrl: project.githubUrl || undefined,
    featured: project.featured,
    category: 'web' as const,
    createdAt: project.createdAt.toISOString(),
  }
}

export async function getAllProjectSlugs() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return projects.map((p) => ({ slug: p.slug }))
}
