'use client'

import { BlogPost } from '@/types'
import { Text, Navigation, Footer } from '@/components'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import './blogPostDetail.css'

interface BlogPostDetailProps {
  post: BlogPost
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <>
      <Navigation />
      <main className="blog-post-detail">
        <motion.article
          className="blog-post-article"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <header className="blog-post-header">
            <Link href="/#blog" className="back-link">
              <ArrowLeft size={20} aria-hidden="true" />
              <Text size="sm" variant="secondary">Back to blog</Text>
            </Link>

            <span className="blog-post-category">
              <Text size="sm" variant="primary">{post.category}</Text>
            </span>

            <Text size="3xl" as="h1" variant="primary" className="blog-post-title">
              {post.title}
            </Text>

            <div className="blog-post-meta">
              <div className="blog-post-author">
                <div className="author-avatar">
                  {post.author.avatar && (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="avatar-image"
                    />
                  )}
                </div>
                <Text size="sm" variant="primary">{post.author.name}</Text>
              </div>
              <div className="blog-post-info">
                <div className="info-item">
                  <Calendar size={14} aria-hidden="true" />
                  <Text size="sm" variant="tertiary">{formattedDate}</Text>
                </div>
                <div className="info-item">
                  <Clock size={14} aria-hidden="true" />
                  <Text size="sm" variant="tertiary">{post.readTime}</Text>
                </div>
              </div>
            </div>
          </header>

          <motion.div
            className="blog-post-image"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            {post.image && (
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="post-image"
              />
            )}
          </motion.div>

          <motion.div
            className="blog-post-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <div className="blog-content-text">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </motion.div>

          <motion.div
            className="blog-post-tags"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            <Text size="sm" variant="secondary">Tags:</Text>
            <div className="tags-list">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag-item">
                  <Text size="sm" variant="tertiary">#{tag}</Text>
                </span>
              ))}
            </div>
          </motion.div>
        </motion.article>
      </main>
      <Footer />
    </>
  )
}
