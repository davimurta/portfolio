'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Text } from '@/components'
import {
  LayoutDashboard,
  MessageSquare,
  LogOut,
  Sun,
  Moon,
  Plus,
  List
} from 'lucide-react'
import { ProjectForm } from './components/ProjectForm'
import { BlogForm } from './components/BlogForm'
import { ProjectsList } from './components/ProjectsList'
import { BlogsList } from './components/BlogsList'
import { MessagesView } from './components/MessagesView'
import './dashboard.css'

type Tab = 'projects-list' | 'projects-create' | 'blogs-list' | 'blogs-create' | 'messages'

interface EditingProject {
  id: string
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

interface EditingBlog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  tags?: string[]
  coverImage?: string | null
  published: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('projects-list')
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [editingProject, setEditingProject] = useState<EditingProject | null>(null)
  const [editingBlog, setEditingBlog] = useState<EditingBlog | null>(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboard-theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('dashboard-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const navItems = [
    {
      group: 'Projetos',
      items: [
        { id: 'projects-list' as Tab, label: 'Ver Projetos', icon: List },
        { id: 'projects-create' as Tab, label: 'Novo Projeto', icon: Plus },
      ]
    },
    {
      group: 'Blog',
      items: [
        { id: 'blogs-list' as Tab, label: 'Ver Posts', icon: List },
        { id: 'blogs-create' as Tab, label: 'Novo Post', icon: Plus },
      ]
    },
    {
      group: 'Outros',
      items: [
        { id: 'messages' as Tab, label: 'Mensagens', icon: MessageSquare },
      ]
    }
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/abacaxi')
    } catch {
      console.error('Logout failed')
    }
  }

  const handleEditProject = (project: EditingProject) => {
    setEditingProject(project)
    setActiveTab('projects-create')
  }

  const handleEditBlog = (post: EditingBlog) => {
    setEditingBlog(post)
    setActiveTab('blogs-create')
  }

  const handleCancelEdit = () => {
    if (editingProject) {
      setEditingProject(null)
      setActiveTab('projects-list')
    }
    if (editingBlog) {
      setEditingBlog(null)
      setActiveTab('blogs-list')
    }
  }

  const handleSuccess = () => {
    if (editingProject) {
      setEditingProject(null)
      setActiveTab('projects-list')
    }
    if (editingBlog) {
      setEditingBlog(null)
      setActiveTab('blogs-list')
    }
  }

  const getPageTitle = () => {
    if (editingProject) return `Editar: ${editingProject.title}`
    if (editingBlog) return `Editar: ${editingBlog.title}`

    switch (activeTab) {
      case 'projects-list': return 'Projetos'
      case 'projects-create': return 'Novo Projeto'
      case 'blogs-list': return 'Blog Posts'
      case 'blogs-create': return 'Novo Post'
      case 'messages': return 'Mensagens'
      default: return 'Dashboard'
    }
  }

  // Reset editing state when changing tabs
  const handleTabChange = (tab: Tab) => {
    if (tab !== 'projects-create') setEditingProject(null)
    if (tab !== 'blogs-create') setEditingBlog(null)
    setActiveTab(tab)
  }

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <LayoutDashboard size={24} />
          </div>
          <Text as="span" size="md" weight="semibold">
            Admin
          </Text>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((group) => (
            <div key={group.group} className="nav-group">
              <Text size="xs" variant="tertiary" className="nav-group-label">
                {group.group}
              </Text>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleTabChange(item.id)}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme} title={`Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span>{theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}</span>
          </button>
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-content">
        <header className="dashboard-header">
          <Text as="h1" size="xl" weight="bold" font="fraunces">
            {getPageTitle()}
          </Text>
        </header>

        <div className="dashboard-main">
          {activeTab === 'projects-list' && (
            <ProjectsList onEdit={handleEditProject} />
          )}
          {activeTab === 'projects-create' && (
            <ProjectForm
              initialData={editingProject}
              onSuccess={handleSuccess}
              onCancel={editingProject ? handleCancelEdit : undefined}
            />
          )}
          {activeTab === 'blogs-list' && (
            <BlogsList onEdit={handleEditBlog} />
          )}
          {activeTab === 'blogs-create' && (
            <BlogForm
              initialData={editingBlog}
              onSuccess={handleSuccess}
              onCancel={editingBlog ? handleCancelEdit : undefined}
            />
          )}
          {activeTab === 'messages' && <MessagesView />}
        </div>
      </div>
    </main>
  )
}
