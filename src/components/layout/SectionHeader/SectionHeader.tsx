'use client';

import { Text } from '../../ui/Text';
import { m } from 'framer-motion';
import './sectionHeader.css';

interface SectionHeaderProps {
  title: string;
  description: string;
}

export const SectionHeader = ({ title, description }: SectionHeaderProps) => {
  return (
    <m.div
      className='section-header'
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
    >
      <m.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" as const }}
      >
        <Text as="h2" size="xl" variant='primary'>{title}</Text>
      </m.div>
      <m.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" as const }}
      >
        <Text as="span" size="sm" variant='tertiary'>{description}</Text>
      </m.div>
    </m.div>
  )
}
