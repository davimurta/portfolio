'use client';

import { Button, Text } from '@/components';
import { ArrowUpRight, Keyboard, Leaf, ArrowDownLeft } from 'lucide-react';
import { m, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import "./aboutSection.css";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  });

  const leftX = useTransform(scrollYProgress, [0, 1], [-100, 0]);
  const rightX = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);

  return (
    <section id='about' className='about' ref={sectionRef}>
      <m.div
        className='about-content on'
        style={{ x: leftX, opacity }}
      >
        <div className='about-title'>
          <div className='title-row'>
            <Keyboard strokeWidth={1.5} aria-hidden="true" />
            <h2 className='about-title-text fraunces'>ON</h2>
          </div>
          <h2 className='about-title-text'>KEYBOARD</h2>
        </div>
        <Text size='sm' as='p' variant='tertiary' className='about-description'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Text>
        <Button className='about-button' variant='primary' icon={ArrowDownLeft}></Button>
      </m.div>
      <m.div
        className='about-content off'
        style={{ x: rightX, opacity }}
      >
        <div className='about-title'>
          <div className='title-row'>
            <h2 className='about-title-text fraunces'>OFF</h2>
            <Leaf strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h2 className='about-title-text'>KEYBOARD</h2>
        </div>
        <Text size='sm' as='p' variant='tertiary' className='about-description'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Text>
        <Button className='about-button' variant='primary' icon={ArrowUpRight}></Button>
      </m.div>
    </section>
  );
}
