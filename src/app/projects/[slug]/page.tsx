import { notFound } from 'next/navigation'
import { getProjectBySlug, projectsData } from '@/data'
import { ProjectDetail } from './ProjectDetail'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

// Gera as rotas estáticas para os projetos
export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }))
}

// Metadata dinâmica para SEO
export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const { data: project } = await getProjectBySlug(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} | Davi Murta`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const { data: project } = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return <ProjectDetail project={project} />
}
