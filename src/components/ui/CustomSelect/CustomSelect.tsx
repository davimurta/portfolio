"use client"

import { useState, useRef, useEffect } from 'react'
import './customSelect.css'

interface CustomSelectProps {
  id: string
  name: string
  value: string
  onChange: (name: string, value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  required?: boolean
}

export const CustomSelect = ({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false
}: CustomSelectProps) => {
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

  const handleSelect = (optionValue: string) => {
    onChange(name, optionValue)
    setIsOpen(false)
  }

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="custom-select" ref={dropdownRef}>
      <button
        type="button"
        id={id}
        className={`custom-select-button ${value ? 'has-value' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-required={required}
      >
        <span className={value ? 'custom-select-value' : 'custom-select-placeholder'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`custom-select-arrow ${isOpen ? 'open' : ''}`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className="custom-select-dropdown">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`custom-select-option ${value === option.value ? 'active' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
