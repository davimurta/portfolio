import { notFound } from 'next/navigation'
import { getBlogPostBySlug, blogPostsData } from '@/data'
import { BlogPostDetail } from './BlogPostDetail'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

// Gera as rotas estáticas para os posts
export async function generateStaticParams() {
  return blogPostsData.map((post) => ({
    slug: post.slug,
  }))
}

// Metadata dinâmica para SEO
export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params
  const { data: post } = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Davi Murta Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  const { data: post } = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <BlogPostDetail post={post} />
}
