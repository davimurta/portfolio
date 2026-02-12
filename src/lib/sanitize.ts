// Sanitization utilities to prevent XSS and script injection

// Remove all HTML tags and script content
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return ''

  return input
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers (onclick, onerror, onload, etc.)
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\bon\w+\s*=\s*[^\s>]*/gi, '')
    // Remove javascript: and data: URLs
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:/gi, '')
    // Remove all HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove potential template injection
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\$\{[^}]*\}/g, '')
    // Trim whitespace
    .trim()
}

// Sanitize for markdown content (allows basic formatting but removes scripts)
export function sanitizeMarkdown(input: string): string {
  if (!input || typeof input !== 'string') return ''

  return input
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove style tags and their content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove event handlers
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\bon\w+\s*=\s*[^\s>]*/gi, '')
    // Remove javascript: and data: URLs
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:/gi, '')
    // Remove iframe, object, embed tags
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    // Remove form elements
    .replace(/<form[^>]*>.*?<\/form>/gi, '')
    .replace(/<input[^>]*>/gi, '')
    .replace(/<button[^>]*>.*?<\/button>/gi, '')
    // Remove potential template injection
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\$\{[^}]*\}/g, '')
    .trim()
}

// Sanitize array of strings (like tags)
export function sanitizeArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return []

  return arr
    .filter((item): item is string => typeof item === 'string')
    .map(item => sanitizeText(item))
    .filter(item => item.length > 0)
    .slice(0, 20) // Limit number of items
}

// Sanitize slug (only allow alphanumeric, hyphens)
export function sanitizeSlug(input: string): string {
  if (!input || typeof input !== 'string') return ''

  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)
}

// Validate and sanitize URL (only allow http/https)
export function sanitizeUrl(input: string): string | null {
  if (!input || typeof input !== 'string') return null

  try {
    const url = new URL(input.trim())
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null
    }
    // Check for javascript in URL
    if (url.href.toLowerCase().includes('javascript:')) {
      return null
    }
    return url.href
  } catch {
    return null
  }
}

// Validate that a path is a safe local image path
export function isValidLocalImagePath(path: string): boolean {
  if (!path || typeof path !== 'string') return false

  // Must start with /uploads/
  if (!path.startsWith('/uploads/')) return false

  // No directory traversal
  if (path.includes('..') || path.includes('//')) return false

  // Only allow specific image extensions
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']
  const ext = path.toLowerCase().slice(path.lastIndexOf('.'))

  return allowedExtensions.includes(ext)
}
