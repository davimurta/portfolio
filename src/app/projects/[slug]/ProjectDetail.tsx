'use client'

import { Project } from '@/types'
import { Button, Text, Navigation, Footer } from '@/components'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import './projectDetail.css'

interface ProjectDetailProps {
  project: Project
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <>
      <Navigation />
      <main className="project-detail">
        <motion.div
          className="project-detail-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link href="/#projects" className="back-link">
            <ArrowLeft size={20} aria-hidden="true" />
            <Text size="sm" variant="secondary">Back to projects</Text>
          </Link>

          <div className="project-detail-title">
            <Text size="3xl" as="h1" variant="primary">{project.title}</Text>
            <Text size="md" as="p" variant="tertiary">{project.description}</Text>
          </div>

          <div className="project-detail-tags">
            {project.tags.map((tag, index) => (
              <span key={index} className="project-tag">
                <Text size="sm" variant="secondary">{tag}</Text>
              </span>
            ))}
          </div>

          <div className="project-detail-actions">
            {project.liveUrl && (
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" icon={ExternalLink}>
                  View Live
                </Button>
              </Link>
            )}
            {project.githubUrl && (
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" icon={Github}>
                  View Code
                </Button>
              </Link>
            )}
          </div>
        </motion.div>

        <motion.div
          className="project-detail-image"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {project.image && (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="project-image"
            />
          )}
        </motion.div>

        <motion.div
          className="project-detail-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <div className="project-content-text">
            <ReactMarkdown>{project.fullDescription}</ReactMarkdown>
          </div>
        </motion.div>

        {project.gallery && project.gallery.length > 1 && (
          <motion.div
            className="project-detail-gallery"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            <Text size="xl" as="h2" variant="primary">Gallery</Text>
            <div className="gallery-grid">
              {project.gallery.map((image, index) => (
                <div key={index} className="gallery-item">
                  <Image
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    className="gallery-image"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </>
  )
}
