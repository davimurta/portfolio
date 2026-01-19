"use client"

import { LucideIcon } from 'lucide-react'
import Text from '../Text'
import { m } from 'framer-motion'
import './serviceCard.css'

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  skills: string[]
}

export const ServiceCard = ({ icon: Icon, title, description, skills }: ServiceCardProps) => {
  return (
    <m.div
      className='service-card'
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
    >
      <m.div
        className='service-card-icon'
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.3 }}
      >
        <Icon size={32} strokeWidth={1.5} aria-hidden="true" />
      </m.div>
      <Text size='lg' as='h3' variant='primary'>{title}</Text>
      <Text size='sm' as='p' variant='tertiary'>{description}</Text>
      <div className='service-skills'>
        {skills.map((skill, index) => (
          <m.span
            key={index}
            className='skill-tag'
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Text size='sm' as='span' variant='secondary'>{skill}</Text>
          </m.span>
        ))}
      </div>
    </m.div>
  )
}
