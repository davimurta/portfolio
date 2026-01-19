"use client"

import { useTheme } from '@/hooks/useTheme'
import Image from 'next/image'

interface ThemeIconProps {
  lightSrc: string
  darkSrc: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

export const ThemeIcon = ({
  lightSrc,
  darkSrc,
  alt,
  width,
  height,
  className,
  priority = false
}: ThemeIconProps) => {
  const { theme, mounted } = useTheme()

  if (!mounted) {
    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: 'var(--color-background-tertiary)',
          borderRadius: '4px'
        }}
      />
    )
  }

  const src = theme === 'dark' ? darkSrc : lightSrc

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  )
}
