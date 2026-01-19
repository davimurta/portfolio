'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { LazyMotion, domAnimation, m, Variants } from 'framer-motion';
import { Button, Navigation, ScrollDownIndicator, Text } from '@/components';

// Lazy load de seções pesadas
const IPhone3D = dynamic(() => import('@/components/ui/IPhone3D/index'), {
  ssr: false,
  loading: () => <div className="hero-iphone-skeleton" aria-hidden="true" />
});

const Projects = dynamic(() => import('@/components/sections/ProjectsSection/Projects').then(mod => ({ default: mod.Projects })));
const AboutSection = dynamic(() => import('@/components/sections/AboutSection/AboutSection').then(mod => ({ default: mod.AboutSection })));
const SkillsSection = dynamic(() => import('@/components/sections/SkillsSection/SkillsSection').then(mod => ({ default: mod.SkillsSection })));
const ContactSection = dynamic(() => import('@/components/sections/ContactSection/ContactSection'));
const Blog = dynamic(() => import('@/components/sections/BlogSection/Blog').then(mod => ({ default: mod.Blog })));
const Footer = dynamic(() => import('@/components/layout/Footer').then(mod => ({ default: mod.Footer })));

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

export default function Home() {
  return (
    <LazyMotion features={domAnimation} strict>
      <Navigation />
      <main id='home' className='hero'>
        <div className='hero-container'>
          <m.div
            className='hero-content'
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <m.div variants={itemVariants}>
              <Text size="lg" as="h2">Web & Mobile developer</Text>
            </m.div>
            <m.div variants={itemVariants}>
              <Text size="xl" as="h1" variant='primary'>Building clean digital products.</Text>
            </m.div>
            <m.div variants={itemVariants}>
              <Text size="sm" as="span" variant='tertiary'>I build modern websites and applications with attention to design, usability, and code quality.</Text>
            </m.div>
            <m.div
              className='flex gap-10 hero-cta'
              variants={buttonVariants}
            >
              <m.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="#contact">
                  <Button variant='primary'>Let's talk</Button>
                </Link>
              </m.div>
              <m.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="#projects">
                  <Button variant='secondary'>View projects</Button>
                </Link>
              </m.div>
            </m.div>
          </m.div>
          <m.div
            className='hero-iphone'
            initial={{ opacity: 0, x: 100, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" as const }}
          >
            <IPhone3D />
          </m.div>
        </div>
      </main>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <ScrollDownIndicator />
      </m.div>
      <Projects />
      <AboutSection />
      <SkillsSection />
      <ContactSection />
      <Blog />
      <Footer />
    </LazyMotion>
  );
}
