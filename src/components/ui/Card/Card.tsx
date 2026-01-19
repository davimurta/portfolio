"use client"

import { ArrowUpRight } from 'lucide-react'
import { Button } from '../Button'
import Text from '../Text'
import Image from 'next/image'
import Link from 'next/link'
import { m } from 'framer-motion'
import './card.css'

interface CardProps {
  title?: string
  description?: string
  image?: string
  tags?: string[]
  link?: string
}

export const Card = ({
  title = 'Project Title',
  description = 'A brief description of the project goes here.',
  image,
  tags = [],
  link
}: CardProps) => {
  const cardContent = (
    <m.div
      className='card'
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <m.div
        className='card-image'
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {image && <Image src={image} alt={title} fill className='card-image-element' />}
      </m.div>
      <div className='card-content'>
        <Text size='lg' as='h3' variant='primary'>{title}</Text>
        <Text size='sm' as='p' variant='tertiary'>{description}</Text>
        <div className='card-tags'>
          {tags.map((tag, index) => (
            <span key={index} className='card-tag'>
              <Text size='sm' as='span' variant='secondary'>{tag}</Text>
            </span>
          ))}
        </div>
        <Button variant='primary' icon={ArrowUpRight} className='card-button'>View case</Button>
      </div>
    </m.div>
  )

  if (link) {
    return <Link href={link}>{cardContent}</Link>
  }

  return cardContent
}
