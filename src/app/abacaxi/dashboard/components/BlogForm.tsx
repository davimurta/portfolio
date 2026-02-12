'use client'

import { useState, useRef, useEffect } from 'react'
import { Button, Text } from '@/components'
import { X, Check, Upload, Loader2, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface BlogData {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  tags?: string[]
  coverImage?: string | null
  published: boolean
}

interface BlogFormProps {
  initialData?: BlogData | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function BlogForm({ initialData, onSuccess, onCancel }: BlogFormProps) {
  const isEditing = !!initialData?.id

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : '',
    coverImage: initialData?.coverImage || '',
    published: initialData?.published || false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
        coverImage: initialData.coverImage || '',
        published: initialData.published || false
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    if (name === 'title' && !isEditing) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }

    setMessage(null)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Tipo de arquivo inválido. Use JPEG, PNG, GIF, WebP ou AVIF.' })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Arquivo muito grande. Máximo: 5MB' })
      return
    }

    setIsUploading(true)
    setMessage(null)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Erro ao fazer upload' })
        return
      }

      setFormData(prev => ({ ...prev, coverImage: data.url }))
      setMessage({ type: 'success', text: 'Imagem enviada com sucesso!' })

    } catch {
      setMessage({ type: 'error', text: 'Erro ao fazer upload. Tente novamente.' })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, coverImage: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const url = isEditing ? `/api/admin/blog/${initialData?.id}` : '/api/admin/blog'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Erro ao salvar post' })
        return
      }

      setMessage({ type: 'success', text: isEditing ? 'Post atualizado com sucesso!' : 'Post criado com sucesso!' })

      if (!isEditing) {
        handleClear()
      }

      if (onSuccess) {
        setTimeout(onSuccess, 1000)
      }

    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar post. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      tags: '',
      coverImage: '',
      published: false
    })
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {isEditing && onCancel && (
        <button type="button" className="back-to-list" onClick={onCancel}>
          <ArrowLeft size={18} />
          <span>Voltar para lista</span>
        </button>
      )}

      {message && (
        <div className={`form-message ${message.type}`}>
          <Text size="sm">{message.text}</Text>
        </div>
      )}

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Título do post"
            maxLength={200}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="slug">Slug</label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="url-do-post"
            maxLength={100}
            pattern="[a-z0-9-]+"
            title="Apenas letras minúsculas, números e hífens"
            required
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="excerpt">Resumo</label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          placeholder="Breve descrição do post..."
          rows={2}
          maxLength={500}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="content">Conteúdo (Markdown)</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Escreva o conteúdo do post em Markdown..."
          rows={12}
          maxLength={50000}
          required
        />
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="react, nextjs, typescript"
            maxLength={200}
          />
          <Text as="span" size="sm" variant="tertiary">
            Separe as tags por vírgula
          </Text>
        </div>

        <div className="form-field">
          <label>Imagem de Capa</label>
          <div className="image-upload-container">
            {formData.coverImage ? (
              <div className="image-preview">
                <Image
                  src={formData.coverImage}
                  alt="Preview"
                  width={200}
                  height={120}
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
                <button
                  type="button"
                  className="image-remove-btn"
                  onClick={handleRemoveImage}
                  aria-label="Remover imagem"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="image-upload-area">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  hidden
                />
                {isUploading ? (
                  <div className="upload-loading">
                    <Loader2 size={24} className="spin" />
                    <span>Enviando...</span>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <Upload size={24} />
                    <span>Clique para enviar imagem</span>
                    <Text as="span" size="sm" variant="tertiary">
                      JPEG, PNG, GIF, WebP ou AVIF (máx. 5MB)
                    </Text>
                  </div>
                )}
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="form-field checkbox-field">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
          />
          <span className="checkbox-custom"></span>
          <span>Publicar imediatamente</span>
        </label>
      </div>

      <div className="form-actions">
        {isEditing ? (
          <>
            <Button type="button" variant="secondary" onClick={onCancel}>
              <X size={18} />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : (
                <>
                  <Check size={18} />
                  Salvar Alterações
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="secondary" onClick={handleClear}>
              <X size={18} />
              Limpar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : (
                <>
                  <Check size={18} />
                  {formData.published ? 'Publicar Post' : 'Salvar Rascunho'}
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </form>
  )
}
