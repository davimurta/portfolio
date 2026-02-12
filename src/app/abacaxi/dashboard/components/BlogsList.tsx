'use client'

import { useState, useEffect } from 'react'
import { Text } from '@/components'
import { Edit2, Trash2, Eye, EyeOff, Loader2, RefreshCw, ExternalLink } from 'lucide-react'
import Image from 'next/image'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string | null
  tags: string[]
  published: boolean
  createdAt: string
}

interface BlogsListProps {
  onEdit: (post: BlogPost) => void
}

export function BlogsList({ onEdit }: BlogsListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchPosts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/blog')
      if (!response.ok) throw new Error('Falha ao carregar posts')
      const data = await response.json()
      setPosts(data)
    } catch {
      setError('Erro ao carregar posts')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Falha ao excluir')
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch {
      alert('Erro ao excluir post')
    } finally {
      setDeletingId(null)
    }
  }

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          published: !post.published,
        }),
      })
      if (!response.ok) throw new Error('Falha ao atualizar')
      const updated = await response.json()
      setPosts(prev => prev.map(p => p.id === post.id ? updated : p))
    } catch {
      alert('Erro ao atualizar post')
    }
  }

  if (isLoading) {
    return (
      <div className="list-loading">
        <Loader2 size={32} className="spin" />
        <Text variant="tertiary">Carregando posts...</Text>
      </div>
    )
  }

  if (error) {
    return (
      <div className="list-error">
        <Text variant="tertiary">{error}</Text>
        <button className="retry-btn" onClick={fetchPosts}>
          <RefreshCw size={16} />
          Tentar novamente
        </button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="list-empty">
        <Text variant="tertiary">Nenhum post encontrado</Text>
      </div>
    )
  }

  return (
    <div className="items-list">
      <div className="list-header">
        <Text size="sm" variant="tertiary">
          {posts.length} post{posts.length !== 1 ? 's' : ''}
        </Text>
        <button className="refresh-btn" onClick={fetchPosts}>
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="list-items">
        {posts.map((post) => (
          <div key={post.id} className="list-item">
            <div className="item-image">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
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
                  {post.title}
                </Text>
                <div className="item-badges">
                  <span className={`badge ${post.published ? 'badge-published' : 'badge-draft'}`}>
                    {post.published ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
              </div>

              <Text size="sm" variant="tertiary" className="item-description">
                {post.excerpt}
              </Text>

              {post.tags && post.tags.length > 0 && (
                <div className="item-tags">
                  {post.tags.slice(0, 4).map((tag, i) => (
                    <span key={i} className="item-tag">{tag}</span>
                  ))}
                  {post.tags.length > 4 && (
                    <span className="item-tag">+{post.tags.length - 4}</span>
                  )}
                </div>
              )}
            </div>

            <div className="item-actions">
              <button
                className="action-btn"
                onClick={() => handleTogglePublish(post)}
                title={post.published ? 'Despublicar' : 'Publicar'}
              >
                {post.published ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <a
                href={`/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn"
                title="Ver post"
              >
                <ExternalLink size={18} />
              </a>
              <button
                className="action-btn"
                onClick={() => onEdit(post)}
                title="Editar"
              >
                <Edit2 size={18} />
              </button>
              <button
                className="action-btn action-btn-danger"
                onClick={() => handleDelete(post.id)}
                disabled={deletingId === post.id}
                title="Excluir"
              >
                {deletingId === post.id ? (
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
