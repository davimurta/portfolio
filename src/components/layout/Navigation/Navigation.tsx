"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import "./navigation.css"
import { Button } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { LanguageSelector } from "@/components/ui/LanguageSelector"

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className={`header ${isScrolled ? "header--scrolled" : ""} ${isMobileMenuOpen ? "header--menu-open" : ""}`}>
      <Link href="/" onClick={scrollToTop}>
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={50}
          height={50}
          priority
        />
      </Link>

      <nav className={`nav ${isMobileMenuOpen ? "nav--open" : ""}`}>
        <Link href="/" onClick={scrollToTop}><Text size='sm'>Home</Text></Link>
        <Link href="#projects" onClick={handleNavClick}><Text size='sm'>Projects</Text></Link>
        <Link href="#about" onClick={handleNavClick}><Text size='sm'>About me</Text></Link>
        <Link href="#skills" onClick={handleNavClick}><Text size='sm'>Skills</Text></Link>
        <Link href="#contact" onClick={handleNavClick}><Text size='sm'>Contact</Text></Link>
        <Link href="#blog" onClick={handleNavClick}><Text size='sm'>Blog</Text></Link>

        <div className="nav-mobile-actions">
          <div>
            <ThemeToggle />
            <LanguageSelector />
          </div>
          <Link href="#contact" onClick={handleNavClick}>
            <Button>Let's talk</Button>
          </Link>
        </div>
      </nav>

      <div className="header-actions">
        <ThemeToggle />
        <LanguageSelector />
        <Link href="#contact">
          <Button>Let's talk</Button>
        </Link>
      </div>

      <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
    </header>
  )
}
