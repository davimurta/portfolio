'use client'

import { useState, useEffect } from 'react'
import { SectionHeader, Card, Slider } from '@/components'
import { m } from 'framer-motion'
import './projects.css'

interface ProjectFromDB {
  id: string
  title: string
  slug: string
  description: string
  coverImage: string | null
  technologies: string[]
  featured: boolean
}

export const Projects = () => {
  const [projects, setProjects] = useState<ProjectFromDB[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/public/projects')
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            setProjects(data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      }
    }

    fetchProjects()
  }, [])

  const displayProjects = projects.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    tags: p.technologies,
    image: p.coverImage || '',
    slug: p.slug,
  }))

  return (
    <section id="projects" className='projects'>
      <SectionHeader title='Selected Projects' description='A few projects that show how I think, design, and build.' />
      <m.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
      >
        <Slider className='projects-list' gap={30} ariaLabel="Projects slider">
          {displayProjects.map((project) => (
            <Card
              key={project.id}
              title={project.title}
              description={project.description}
              tags={project.tags}
              image={project.image}
              link={`/projects/${project.slug}`}
            />
          ))}
        </Slider>
      </m.div>
    </section>
  )
}
