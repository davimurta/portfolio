'use client'

import { useState, useEffect } from 'react'
import { Text } from '@/components'
import { Edit2, Trash2, Eye, EyeOff, Star, Loader2, RefreshCw, ExternalLink } from 'lucide-react'
import Image from 'next/image'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  coverImage: string | null
  technologies: string[]
  featured: boolean
  published: boolean
  createdAt: string
}

interface ProjectsListProps {
  onEdit: (project: Project) => void
}

export function ProjectsList({ onEdit }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchProjects = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/project')
      if (!response.ok) throw new Error('Falha ao carregar projetos')
      const data = await response.json()
      setProjects(data)
    } catch {
      setError('Erro ao carregar projetos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/admin/project/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Falha ao excluir')
      setProjects(prev => prev.filter(p => p.id !== id))
    } catch {
      alert('Erro ao excluir projeto')
    } finally {
      setDeletingId(null)
    }
  }

  const handleTogglePublish = async (project: Project) => {
    try {
      const response = await fetch(`/api/admin/project/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...project,
          published: !project.published,
        }),
      })
      if (!response.ok) throw new Error('Falha ao atualizar')
      const updated = await response.json()
      setProjects(prev => prev.map(p => p.id === project.id ? updated : p))
    } catch {
      alert('Erro ao atualizar projeto')
    }
  }

  const handleToggleFeatured = async (project: Project) => {
    try {
      const response = await fetch(`/api/admin/project/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...project,
          featured: !project.featured,
        }),
      })
      if (!response.ok) throw new Error('Falha ao atualizar')
      const updated = await response.json()
      setProjects(prev => prev.map(p => p.id === project.id ? updated : p))
    } catch {
      alert('Erro ao atualizar projeto')
    }
  }

  if (isLoading) {
    return (
      <div className="list-loading">
        <Loader2 size={32} className="spin" />
        <Text variant="tertiary">Carregando projetos...</Text>
      </div>
    )
  }

  if (error) {
    return (
      <div className="list-error">
        <Text variant="tertiary">{error}</Text>
        <button className="retry-btn" onClick={fetchProjects}>
          <RefreshCw size={16} />
          Tentar novamente
        </button>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="list-empty">
        <Text variant="tertiary">Nenhum projeto encontrado</Text>
      </div>
    )
  }

  return (
    <div className="items-list">
      <div className="list-header">
        <Text size="sm" variant="tertiary">
          {projects.length} projeto{projects.length !== 1 ? 's' : ''}
        </Text>
        <button className="refresh-btn" onClick={fetchProjects}>
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="list-items">
        {projects.map((project) => (
          <div key={project.id} className="list-item">
            <div className="item-image">
              {project.coverImage ? (
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <div className="item-image-placeholder" />
              )}
            </div>

            <div className="item-content">
              <div className="item-header">
                <Text size="md" weight="semibold" className="item-title">
                  {project.title}
                </Text>
                <div className="item-badges">
                  {project.featured && (
                    <span className="badge badge-featured">
                      <Star size={12} />
                      Destaque
                    </span>
                  )}
                  <span className={`badge ${project.published ? 'badge-published' : 'badge-draft'}`}>
                    {project.published ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
              </div>

              <Text size="sm" variant="tertiary" className="item-description">
                {project.description}
              </Text>

              {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                <div className="item-tags">
                  {project.technologies.slice(0, 4).map((tech, i) => (
                    <span key={i} className="item-tag">{tech}</span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="item-tag">+{project.technologies.length - 4}</span>
                  )}
                </div>
              )}
            </div>

            <div className="item-actions">
              <button
                className="action-btn"
                onClick={() => handleToggleFeatured(project)}
                title={project.featured ? 'Remover destaque' : 'Destacar'}
              >
                <Star size={18} className={project.featured ? 'filled' : ''} />
              </button>
              <button
                className="action-btn"
                onClick={() => handleTogglePublish(project)}
                title={project.published ? 'Despublicar' : 'Publicar'}
              >
                {project.published ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <a
                href={`/projects/${project.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn"
                title="Ver projeto"
              >
                <ExternalLink size={18} />
              </a>
              <button
                className="action-btn"
                onClick={() => onEdit(project)}
                title="Editar"
              >
                <Edit2 size={18} />
              </button>
              <button
                className="action-btn action-btn-danger"
                onClick={() => handleDelete(project.id)}
                disabled={deletingId === project.id}
                title="Excluir"
              >
                {deletingId === project.id ? (
                  <Loader2 size={18} className="spin" />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
