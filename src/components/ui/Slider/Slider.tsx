"use client"

import { useRef, useEffect, ReactNode } from 'react'
import './slider.css'

interface SliderProps {
  children: ReactNode
  className?: string
  gap?: number
  ariaLabel?: string
}

export const Slider = ({
  children,
  className = '',
  gap = 60,
  ariaLabel = 'Content slider'
}: SliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollStart = useRef(0)
  const hasDragged = useRef(false)
  const velocity = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    const stopMomentum = () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current)
        rafId.current = null
      }
    }

    const applyMomentum = () => {
      if (Math.abs(velocity.current) < 0.5) return

      const friction = 0.92

      const tick = () => {
        velocity.current *= friction
        slider.scrollLeft -= velocity.current

        if (Math.abs(velocity.current) > 0.5) {
          rafId.current = requestAnimationFrame(tick)
        } else {
          rafId.current = null
        }
      }

      rafId.current = requestAnimationFrame(tick)
    }

    // --- Mouse ---
    const onMouseDown = (e: MouseEvent) => {
      stopMomentum()
      isDragging.current = true
      hasDragged.current = false
      startX.current = e.clientX
      scrollStart.current = slider.scrollLeft
      velocity.current = 0
      lastX.current = e.clientX
      lastTime.current = performance.now()
      slider.classList.add('dragging')
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return

      const dx = e.clientX - startX.current
      if (Math.abs(dx) > 5) hasDragged.current = true

      slider.scrollLeft = scrollStart.current - dx

      const now = performance.now()
      const dt = now - lastTime.current
      if (dt > 0) {
        velocity.current = ((e.clientX - lastX.current) / dt) * 16
      }
      lastX.current = e.clientX
      lastTime.current = now
    }

    const onMouseUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      slider.classList.remove('dragging')

      if (hasDragged.current) {
        applyMomentum()
        requestAnimationFrame(() => {
          hasDragged.current = false
        })
      }
    }

    // --- Touch ---
    const onTouchStart = (e: TouchEvent) => {
      stopMomentum()
      isDragging.current = true
      hasDragged.current = false
      startX.current = e.touches[0].clientX
      scrollStart.current = slider.scrollLeft
      velocity.current = 0
      lastX.current = e.touches[0].clientX
      lastTime.current = performance.now()
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return

      const dx = e.touches[0].clientX - startX.current
      if (Math.abs(dx) > 5) hasDragged.current = true

      slider.scrollLeft = scrollStart.current - dx

      const now = performance.now()
      const dt = now - lastTime.current
      if (dt > 0) {
        velocity.current = ((e.touches[0].clientX - lastX.current) / dt) * 16
      }
      lastX.current = e.touches[0].clientX
      lastTime.current = now
    }

    const onTouchEnd = () => {
      if (!isDragging.current) return
      isDragging.current = false

      if (hasDragged.current) {
        applyMomentum()
        requestAnimationFrame(() => {
          hasDragged.current = false
        })
      }
    }

    // --- Click prevention ---
    const onClick = (e: MouseEvent) => {
      if (hasDragged.current) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    // --- Keyboard ---
    const onKeyDown = (e: KeyboardEvent) => {
      const card = slider.querySelector('.card, .blog-card')
      const scrollAmount = (card?.clientWidth || 300) + gap

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        stopMomentum()
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        stopMomentum()
        slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      }
    }

    slider.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    slider.addEventListener('touchstart', onTouchStart, { passive: true })
    slider.addEventListener('touchmove', onTouchMove, { passive: true })
    slider.addEventListener('touchend', onTouchEnd)
    slider.addEventListener('click', onClick, true)
    slider.addEventListener('keydown', onKeyDown)

    return () => {
      stopMomentum()
      slider.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      slider.removeEventListener('touchstart', onTouchStart)
      slider.removeEventListener('touchmove', onTouchMove)
      slider.removeEventListener('touchend', onTouchEnd)
      slider.removeEventListener('click', onClick, true)
      slider.removeEventListener('keydown', onKeyDown)
    }
  }, [gap])

  return (
    <div
      ref={sliderRef}
      className={`slider ${className}`}
      style={{ gap: `${gap}px` }}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      {children}
    </div>
  )
}
