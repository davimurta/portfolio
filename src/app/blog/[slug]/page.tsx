import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getAllBlogSlugs } from '@/data'
import { BlogPostDetail } from './BlogPostDetail'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return await getAllBlogSlugs()
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

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
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <BlogPostDetail post={post} />
}
