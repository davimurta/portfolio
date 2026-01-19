"use client"

import { useState, useRef, useEffect } from 'react'
import { useLanguage, type Language } from '@/hooks/useLanguage'
import './languageSelector.css'

const languages = {
  'pt-BR': { label: 'PT', flag: '🇧🇷' },
  'en': { label: 'EN', flag: '🇺🇸' },
  'es': { label: 'ES', flag: '🇪🇸' },
}

export const LanguageSelector = () => {
  const { language, changeLanguage, mounted } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!mounted) {
    return <div className="language-selector-skeleton" />
  }

  const handleLanguageChange = (lang: Language) => {
    changeLanguage(lang)
    setIsOpen(false)
  }

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button
        className="language-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Selecionar idioma"
        aria-expanded={isOpen}
      >
        <span className="language-flag">{languages[language].flag}</span>
        <span className="language-label">{languages[language].label}</span>
        <svg
          className={`language-arrow ${isOpen ? 'open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {Object.entries(languages).map(([lang, { label, flag }]) => (
            <button
              key={lang}
              className={`language-option ${language === lang ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang as Language)}
            >
              <span className="language-flag">{flag}</span>
              <span className="language-label">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
