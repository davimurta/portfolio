"use client"

import { useRef, useState, useCallback, ReactNode } from 'react'
import './slider.css'

interface SliderProps {
  children: ReactNode
  className?: string
  gap?: number
  sensitivity?: number
  ariaLabel?: string
}

export const Slider = ({
  children,
  className = '',
  gap = 60,
  sensitivity = 2,
  ariaLabel = 'Content slider'
}: SliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const getItemWidth = useCallback(() => {
    if (!sliderRef.current) return 0
    return sliderRef.current.querySelector('.card')?.clientWidth || 300
  }, [])

  const slideNext = useCallback(() => {
    if (!sliderRef.current) return
    const itemWidth = getItemWidth()
    sliderRef.current.scrollBy({ left: itemWidth + gap, behavior: 'smooth' })
  }, [gap, getItemWidth])

  const slidePrev = useCallback(() => {
    if (!sliderRef.current) return
    const itemWidth = getItemWidth()
    sliderRef.current.scrollBy({ left: -(itemWidth + gap), behavior: 'smooth' })
  }, [gap, getItemWidth])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - sliderRef.current.offsetLeft)
    setScrollLeft(sliderRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return
    e.preventDefault()
    const x = e.pageX - sliderRef.current.offsetLeft
    const walk = (x - startX) * sensitivity
    sliderRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        slidePrev()
        break
      case 'ArrowRight':
        e.preventDefault()
        slideNext()
        break
    }
  }

  return (
    <div
      ref={sliderRef}
      className={`slider ${isDragging ? 'dragging' : ''} ${className}`}
      style={{ gap: `${gap}px` }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      {children}
    </div>
  )
}
