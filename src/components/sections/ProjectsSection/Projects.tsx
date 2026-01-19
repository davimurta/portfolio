'use client'

import { SectionHeader, Card, Slider } from '@/components'
import { projectsData } from '@/data'
import { m } from 'framer-motion'
import './projects.css'

export const Projects = () => {
  return (
    <section id="projects" className='projects'>
      <SectionHeader title='Selected Projects' description='A few projects that show how I think, design, and build.' />
      <m.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
      >
        <Slider className='projects-list' gap={60} sensitivity={1} ariaLabel="Projects slider">
          {projectsData.map((project) => (
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
