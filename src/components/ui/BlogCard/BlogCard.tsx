"use client"

import { ArrowUpRight, Calendar } from 'lucide-react'
import Text from '../Text'
import Image from 'next/image'
import Link from 'next/link'
import { m } from 'framer-motion'
import './blogCard.css'

interface BlogCardProps {
  title?: string
  excerpt?: string
  image?: string
  category?: string
  date?: string
  readTime?: string
  link?: string
}

export const BlogCard = ({
  title = 'Article Title',
  excerpt = 'A brief excerpt of the article content goes here...',
  image,
  category = 'Development',
  date = 'Jan 15, 2026',
  readTime = '5 min read',
  link
}: BlogCardProps) => {
  const cardContent = (
    <m.article
      className='blog-card'
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className='blog-card-image'>
        {image && <Image src={image} alt={title} fill className='blog-card-image-element' />}
        <span className='blog-card-category'>
          <Text size='sm' as='span' variant='primary'>{category}</Text>
        </span>
      </div>
      <div className='blog-card-content'>
        <div className='blog-card-meta'>
          <div className='blog-card-date'>
            <Calendar size={14} aria-hidden="true" />
            <Text size='sm' as='span' variant='tertiary'>{date}</Text>
          </div>
          <Text size='sm' as='span' variant='tertiary'>{readTime}</Text>
        </div>
        <Text size='lg' as='h3' variant='primary' className='blog-card-title'>{title}</Text>
        <Text size='sm' as='p' variant='tertiary' className='blog-card-excerpt'>{excerpt}</Text>
        <m.div
          className='blog-card-link'
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Text size='sm' as='span' variant='link'>Read article</Text>
          <ArrowUpRight size={16} aria-hidden="true" />
        </m.div>
      </div>
    </m.article>
  )

  if (link) {
    return <Link href={link}>{cardContent}</Link>
  }

  return cardContent
}
