// Project Types
export interface Project {
  id: string
  slug: string
  title: string
  description: string
  fullDescription: string
  tags: string[]
  image: string
  gallery?: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  category: 'web' | 'mobile' | 'design'
  createdAt: string
}

// Blog Types
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  tags: string[]
  author: Author
  readTime: string
  publishedAt: string
  updatedAt?: string
}

export interface Author {
  name: string
  avatar: string
  bio?: string
}

// API Response Types (para quando migrar para backend)
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}
