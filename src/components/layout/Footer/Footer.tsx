'use client';

import { ArrowUp } from 'lucide-react';
import { Button, Text } from '@/components';
import Image from 'next/image';
import { m } from 'framer-motion';
import './footer.css';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <m.footer
      className="footer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
    >
      <div className="footer-content">
        <m.div
          className="footer-logo"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" as const }}
        >
          <Image
            src="/images/logo.svg"
            alt="Davi Murta Logo"
            width={40}
            height={40}
          />
        </m.div>

        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" as const }}
        >
          <Text size="sm" variant="primary" className="footer-text">
            © 2026 Davi Murta. All rights reserved.
          </Text>
        </m.div>

        <m.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" as const }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="primary"
            icon={ArrowUp}
            onClick={scrollToTop}
            aria-label="Scroll to top"
          />
        </m.div>
      </div>
    </m.footer>
  );
}
