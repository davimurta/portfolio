"use client"

import { useEffect, useState, useCallback, useRef } from 'react'

export type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'theme'
const THEME_CHANGE_EVENT = 'themeChange'

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)
  const isUpdatingRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialTheme: Theme = prefersDark ? 'dark' : 'light'
      setTheme(initialTheme)
      document.documentElement.setAttribute('data-theme', initialTheme)
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue) {
        const newTheme = e.newValue
        if (newTheme === 'light' || newTheme === 'dark') {
          setTheme(newTheme)
          document.documentElement.setAttribute('data-theme', newTheme)
        }
      }
    }

    const handleThemeChange = (e: Event) => {
      // Ignorar eventos que nós mesmos disparamos
      if (isUpdatingRef.current) return

      const customEvent = e as CustomEvent<Theme>
      if (customEvent.detail === 'light' || customEvent.detail === 'dark') {
        setTheme(customEvent.detail)
        document.documentElement.setAttribute('data-theme', customEvent.detail)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme => {
      const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light'
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)

      // Marcar que estamos atualizando para evitar loop
      isUpdatingRef.current = true
      window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: newTheme }))
      // Reset após o event loop
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 0)

      return newTheme
    })
  }, [])

  return { theme, toggleTheme, mounted }
}
