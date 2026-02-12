'use client'

import { useState } from 'react'
import { Project } from '@/types'
import { Button, Text, Navigation, Footer } from '@/components'
import { ArrowLeft, ExternalLink, Github, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import './projectDetail.css'

interface ProjectDetailProps {
  project: Project
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }

  const goToPrevious = () => {
    if (project.gallery) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? project.gallery!.length - 1 : prev - 1
      )
    }
  }

  const goToNext = () => {
    if (project.gallery) {
      setCurrentImageIndex((prev) =>
        prev === project.gallery!.length - 1 ? 0 : prev + 1
      )
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
  }

  return (
    <>
      <Navigation />
      <main className="project-detail">
        <motion.article
          className="project-article"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <header className="project-header">
            <Link href="/#projects" className="back-link">
              <ArrowLeft size={20} aria-hidden="true" />
              <Text size="sm" variant="secondary">Back to projects</Text>
            </Link>

            <div className="project-tags">
              {project.tags.map((tag, index) => (
                <span key={index} className="project-tag">
                  <Text size="sm" variant="primary">{tag}</Text>
                </span>
              ))}
            </div>

            <Text size="3xl" as="h1" variant="primary" className="project-title">
              {project.title}
            </Text>

            <Text size="md" as="p" variant="tertiary" className="project-description">
              {project.description}
            </Text>

            <div className="project-actions">
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
          </header>

          <motion.div
            className="project-image-container"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            {project.image && (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="project-cover-image"
              />
            )}
          </motion.div>

          {project.fullDescription && (
            <motion.div
              className="project-content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <div className="project-content-text">
                <ReactMarkdown>{project.fullDescription}</ReactMarkdown>
              </div>
            </motion.div>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <motion.div
              className="project-gallery"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
              <Text size="xl" as="h2" variant="primary" className="gallery-title">
                Gallery
              </Text>
              <div className="gallery-grid">
                {project.gallery.map((image, index) => (
                  <button
                    key={index}
                    className="gallery-item"
                    onClick={() => openLightbox(index)}
                    aria-label={`Open image ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`${project.title} - Image ${index + 1}`}
                      fill
                      className="gallery-image"
                    />
                    <div className="gallery-item-overlay">
                      <span>Click to enlarge</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.article>
      </main>
      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && project.gallery && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery"
          >
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Close gallery"
            >
              <X size={24} />
            </button>

            {project.gallery.length > 1 && (
              <>
                <button
                  className="lightbox-nav lightbox-prev"
                  onClick={(e) => { e.stopPropagation(); goToPrevious() }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  className="lightbox-nav lightbox-next"
                  onClick={(e) => { e.stopPropagation(); goToNext() }}
                  aria-label="Next image"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            <motion.div
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={project.gallery[currentImageIndex]}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                fill
                className="lightbox-image"
                sizes="90vw"
              />
            </motion.div>

            {project.gallery.length > 1 && (
              <div className="lightbox-counter">
                <Text size="sm" variant="primary">
                  {currentImageIndex + 1} / {project.gallery.length}
                </Text>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
