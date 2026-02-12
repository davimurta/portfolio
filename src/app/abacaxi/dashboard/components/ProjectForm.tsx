'use client'

import { useState, useRef, useEffect } from 'react'
import { Button, Text } from '@/components'
import { X, Plus, Trash2, Check, Upload, Loader2, ImagePlus, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface ProjectData {
  id?: string
  title: string
  slug: string
  description: string
  fullDescription?: string | null
  coverImage?: string | null
  gallery?: string[]
  technologies?: string[]
  liveUrl?: string | null
  githubUrl?: string | null
  featured: boolean
  published: boolean
}

interface ProjectFormProps {
  initialData?: ProjectData | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProjectForm({ initialData, onSuccess, onCancel }: ProjectFormProps) {
  const isEditing = !!initialData?.id

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    fullDescription: initialData?.fullDescription || '',
    coverImage: initialData?.coverImage || '',
    liveUrl: initialData?.liveUrl || '',
    githubUrl: initialData?.githubUrl || '',
    featured: initialData?.featured || false,
    published: initialData?.published || false
  })
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || [])
  const [technologies, setTechnologies] = useState<string[]>(
    Array.isArray(initialData?.technologies) ? initialData.technologies : []
  )
  const [newTech, setNewTech] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadingGallery, setIsUploadingGallery] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        fullDescription: initialData.fullDescription || '',
        coverImage: initialData.coverImage || '',
        liveUrl: initialData.liveUrl || '',
        githubUrl: initialData.githubUrl || '',
        featured: initialData.featured || false,
        published: initialData.published || false
      })
      setGallery(initialData.gallery || [])
      setTechnologies(Array.isArray(initialData.technologies) ? initialData.technologies : [])
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

  const uploadImage = async (file: File): Promise<string | null> => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Tipo de arquivo inválido. Use JPEG, PNG, GIF, WebP ou AVIF.' })
      return null
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Arquivo muito grande. Máximo: 5MB' })
      return null
    }

    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formDataUpload,
    })

    const data = await response.json()

    if (!response.ok) {
      setMessage({ type: 'error', text: data.error || 'Erro ao fazer upload' })
      return null
    }

    return data.url
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setMessage(null)

    try {
      const url = await uploadImage(file)
      if (url) {
        setFormData(prev => ({ ...prev, coverImage: url }))
        setMessage({ type: 'success', text: 'Imagem enviada com sucesso!' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao fazer upload. Tente novamente.' })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploadingGallery(true)
    setMessage(null)

    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file))
      const urls = await Promise.all(uploadPromises)
      const validUrls = urls.filter((url): url is string => url !== null)

      if (validUrls.length > 0) {
        setGallery(prev => [...prev, ...validUrls])
        setMessage({ type: 'success', text: `${validUrls.length} imagem(ns) adicionada(s) à galeria!` })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao fazer upload. Tente novamente.' })
    } finally {
      setIsUploadingGallery(false)
      if (galleryInputRef.current) {
        galleryInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, coverImage: '' }))
  }

  const handleRemoveGalleryImage = (index: number) => {
    setGallery(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddTech = () => {
    const trimmed = newTech.trim()
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies(prev => [...prev, trimmed])
      setNewTech('')
    }
  }

  const handleRemoveTech = (index: number) => {
    setTechnologies(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const url = isEditing ? `/api/admin/project/${initialData?.id}` : '/api/admin/project'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          technologies,
          gallery,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Erro ao salvar projeto' })
        return
      }

      setMessage({ type: 'success', text: isEditing ? 'Projeto atualizado com sucesso!' : 'Projeto criado com sucesso!' })

      if (!isEditing) {
        handleClear()
      }

      if (onSuccess) {
        setTimeout(onSuccess, 1000)
      }

    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar projeto. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      fullDescription: '',
      coverImage: '',
      liveUrl: '',
      githubUrl: '',
      featured: false,
      published: false
    })
    setTechnologies([])
    setGallery([])
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
          <label htmlFor="title">Nome do Projeto</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Meu Projeto Incrível"
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
            placeholder="meu-projeto-incrivel"
            maxLength={100}
            pattern="[a-z0-9-]+"
            title="Apenas letras minúsculas, números e hífens"
            required
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="description">Descrição Curta</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Uma breve descrição do projeto..."
          rows={2}
          maxLength={500}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="fullDescription">Descrição Completa (Markdown)</label>
        <textarea
          id="fullDescription"
          name="fullDescription"
          value={formData.fullDescription}
          onChange={handleChange}
          placeholder="Descrição detalhada do projeto em Markdown..."
          rows={8}
          maxLength={50000}
        />
      </div>

      <div className="form-field">
        <label>Tecnologias</label>
        <div className="tech-list">
          {technologies.map((tech, index) => (
            <div key={index} className="tech-tag">
              <span>{tech}</span>
              <button type="button" onClick={() => handleRemoveTech(index)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="tech-input-row">
          <input
            type="text"
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            placeholder="Nome da tecnologia"
            maxLength={50}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
          />
          <button type="button" className="add-tech-btn" onClick={handleAddTech}>
            <Plus size={20} />
          </button>
        </div>
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

      <div className="form-field">
        <label>Galeria de Imagens</label>
        <div className="gallery-container">
          <div className="gallery-grid">
            {gallery.map((img, index) => (
              <div key={index} className="gallery-item">
                <Image
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  width={150}
                  height={100}
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
                <button
                  type="button"
                  className="image-remove-btn"
                  onClick={() => handleRemoveGalleryImage(index)}
                  aria-label="Remover imagem"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <label className="gallery-add-btn">
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
                onChange={handleGalleryUpload}
                disabled={isUploadingGallery}
                multiple
                hidden
              />
              {isUploadingGallery ? (
                <Loader2 size={24} className="spin" />
              ) : (
                <>
                  <ImagePlus size={24} />
                  <span>Adicionar</span>
                </>
              )}
            </label>
          </div>
          <Text as="span" size="sm" variant="tertiary">
            Você pode selecionar múltiplas imagens de uma vez
          </Text>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="liveUrl">URL do Projeto</label>
          <input
            type="url"
            id="liveUrl"
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleChange}
            placeholder="https://meu-projeto.com"
            maxLength={500}
          />
        </div>

        <div className="form-field">
          <label htmlFor="githubUrl">URL do GitHub</label>
          <input
            type="url"
            id="githubUrl"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            placeholder="https://github.com/user/repo"
            maxLength={500}
          />
        </div>
      </div>

      <div className="form-field checkbox-field">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
          <span className="checkbox-custom"></span>
          <span>Projeto em destaque</span>
        </label>
        <Text as="span" size="sm" variant="tertiary">
          Projetos em destaque aparecem primeiro na página inicial
        </Text>
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
                  {formData.published ? 'Publicar Projeto' : 'Salvar Rascunho'}
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </form>
  )
}
