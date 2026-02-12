import { prisma } from '@/lib/prisma'

export async function getBlogPostBySlug(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  })

  if (!post) return null

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    image: post.coverImage || '',
    category: post.tags[0] || 'General',
    tags: post.tags,
    author: {
      name: 'Davi Murta',
      avatar: '',
      bio: '',
    },
    readTime: `${Math.ceil(post.content.length / 1000)} min read`,
    publishedAt: post.createdAt.toISOString(),
  }
}

export async function getAllBlogSlugs() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return posts.map((p) => ({ slug: p.slug }))
}
