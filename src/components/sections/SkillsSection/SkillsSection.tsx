"use client"

import { SectionHeader } from "@/components/layout/SectionHeader/SectionHeader"
import { Text } from "@/components/ui/Text"
import { ServiceCard } from "@/components/ui/ServiceCard/ServiceCard"
import { ThemeIcon } from "@/components/ui/ThemeIcon"
import { m, Variants } from 'framer-motion'
import "./SkillsSection.css"
import { Monitor, Smartphone, Palette } from 'lucide-react'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
}

export const SkillsSection = () => {
  return (
    <section id='skills' className='skills'>
      <SectionHeader title="Skills" description="Lorem Ipsum is simply dummy text of the printing and typesetting industry." />
      <div className="flex skills-content">
        <m.div
          className="main-stack"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <Text as="h3" size="lg" variant="primary">Main Stack</Text>
          <div className="flex gap-5 collumns">
            <m.div className="flex flex-col" variants={itemVariants}>
              <Text as="h4" size="md" variant="primary">Web</Text>
              <div className="icon-stack">
                <div className="icon">
                  <ThemeIcon
                    lightSrc="/icons/light/next-skill-icon.svg"
                    darkSrc="/icons/dark/next-skill-icon.svg"
                    alt="Next.js"
                    width={60}
                    height={60}
                  />
                </div>
                <div className="icon">
                  <ThemeIcon
                    lightSrc="/icons/light/tailwind-skill-icon.svg"
                    darkSrc="/icons/dark/tailwind-skill-icon.svg"
                    alt="Tailwind"
                    width={60}
                    height={60}
                  />
                </div>
                <div className="icon">
                  <ThemeIcon
                    lightSrc="/icons/light/firebase-skill-icon.svg"
                    darkSrc="/icons/dark/firebase-skill-icon.svg"
                    alt="Firebase"
                    width={50}
                    height={69}
                  />
                </div>
              </div>
            </m.div>
            <m.div className="flex flex-col" variants={itemVariants}>
              <Text as="h4" size="md" variant="primary">Mobile</Text>
              <div className="icon-stack">
                <div className="icon">
                  <ThemeIcon
                    lightSrc="/icons/light/react-native-skill-icon.svg"
                    darkSrc="/icons/dark/react-native-skill-icon.svg"
                    alt="React Native"
                    width={92}
                    height={72}
                  />
                </div>
                <div className="icon">
                  <ThemeIcon
                    lightSrc="/icons/light/expo-skill-icon.svg"
                    darkSrc="/icons/dark/expo-skill-icon.svg"
                    alt="Expo"
                    width={50}
                    height={69}
                  />
                </div>
                <div className="icon">
                  <ThemeIcon
                    lightSrc="/icons/light/firebase-skill-icon.svg"
                    darkSrc="/icons/dark/firebase-skill-icon.svg"
                    alt="Firebase"
                    width={50}
                    height={69}
                  />
                </div>
              </div>
            </m.div>
          </div>
        </m.div>
        <m.div
          className="other-skills flex"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <m.div variants={itemVariants}>
            <ServiceCard
              icon={Monitor}
              title="Web Development"
              description="Desenvolvimento de aplicações web modernas, responsivas e performáticas usando as melhores tecnologias do mercado."
              skills={['Next.js', 'React', 'TypeScript', 'Tailwind CSS']}
            />
          </m.div>
          <m.div variants={itemVariants}>
            <ServiceCard
              icon={Smartphone}
              title="Mobile Development"
              description="Criação de aplicativos mobile nativos e cross-platform com foco em experiência do usuário e performance."
              skills={['React Native', 'Expo', 'Firebase', 'API Integration']}
            />
          </m.div>
          <m.div variants={itemVariants}>
            <ServiceCard
              icon={Palette}
              title="UI/UX Design"
              description="Design de interfaces modernas e intuitivas, focando em usabilidade e conversão para criar experiências memoráveis."
              skills={['Figma', 'Prototyping', 'Design Systems', 'User Research']}
            />
          </m.div>
        </m.div>
      </div>
    </section>
  )
}
