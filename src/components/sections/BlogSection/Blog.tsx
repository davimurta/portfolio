'use client'

import { useState, useEffect } from 'react'
import { SectionHeader, BlogCard, Slider } from '@/components'
import { m } from 'framer-motion'
import './blog.css'

interface BlogPostFromDB {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string | null
  tags: string[]
  createdAt: string
}

// Estimate read time based on content length (approx 200 words per minute)
function estimateReadTime(excerpt: string): string {
  const words = excerpt.split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPostFromDB[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/public/blog')
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            setPosts(data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error)
      }
    }

    fetchPosts()
  }, [])

  const displayPosts = posts.map(p => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
        category: p.tags[0] || 'General',
        date: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: estimateReadTime(p.excerpt),
        image: p.coverImage || '',
        slug: p.slug,
      }))
    

  return (
    <section id="blog" className='blog'>
      <SectionHeader title='Latest Articles' description='Thoughts, ideas, and insights about design, development, and technology.' />
      <m.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
      >
        <Slider className='blog-list' gap={30} ariaLabel="Blog articles slider">
          {displayPosts.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              category={post.category}
              date={post.date}
              readTime={post.readTime}
              image={post.image}
              link={`/blog/${post.slug}`}
            />
          ))}
        </Slider>
      </m.div>
    </section>
  )
}
