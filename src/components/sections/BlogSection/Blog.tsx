'use client'

import { SectionHeader, BlogCard, Slider } from '@/components'
import { blogPostsData } from '@/data'
import { m } from 'framer-motion'
import './blog.css'

export const Blog = () => {
  return (
    <section id="blog" className='blog'>
      <SectionHeader title='Latest Articles' description='Thoughts, ideas, and insights about design, development, and technology.' />
      <m.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
      >
        <Slider className='blog-list' gap={30} sensitivity={1} ariaLabel="Blog articles slider">
          {blogPostsData.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              category={post.category}
              date={new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
