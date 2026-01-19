"use client"

import { useEffect, useState } from 'react'

export type Language = 'pt-BR' | 'en' | 'es'

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('pt-BR')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
      document.documentElement.lang = savedLanguage
    }
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
    document.documentElement.lang = newLanguage
  }

  return { language, changeLanguage, mounted }
}
