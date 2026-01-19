"use client"

import { SectionHeader } from "@/components/layout/SectionHeader/SectionHeader"
import { Text } from "@/components/ui/Text"
import { ContactForm, ThemeIcon } from "@/components"
import { m, Variants } from 'framer-motion'
import "./contactSection.css"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const leftVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
}

const rightVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
}

const ContactSection = () => {
  return (
    <section id="contact">
      <SectionHeader title="Let's work together" description="Feel free to reach out if you have a project, an idea, or just want to talk." />
      <m.div
        className="contact-section-content"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Left Column */}
        <m.div className="contact-column" variants={leftVariants}>
          <div className="flex flex-col gap-5">
            <div>
              <Text as="h4" size="md" variant="primary">Prefer email?</Text>
              <div className="flex gap-2 align-center">
                <ThemeIcon
                  lightSrc="/icons/light/mail-contact-icon.svg"
                  darkSrc="/icons/dark/mail-contact-icon.svg"
                  alt="Email icon"
                  width={30}
                  height={30}
                />
                <Text as="h4" size="md" variant="link">davimurta@gmail.com</Text>
              </div>
            </div>
            <div>
              <Text as="h4" size="md" variant="primary">View my GitHub:</Text>
              <div className="flex gap-2 align-center">
                <ThemeIcon
                  lightSrc="/icons/github-contact-icon.svg"
                  darkSrc="/icons/github-contact-icon.svg"
                  alt="Github icon"
                  width={30}
                  height={30}
                />
                <Text as="h4" size="md" variant="link">@davimurta</Text>
              </div>
            </div>
            <div>
              <Text as="h4" size="md" variant="primary">Let's connect on LinkedIn:</Text>
              <div className="flex gap-2 align-center">
                <ThemeIcon
                  lightSrc="/icons/light/linkedin-contact-icon.svg"
                  darkSrc="/icons/dark/linkedin-contact-icon.svg"
                  alt="Linkedin icon"
                  width={30}
                  height={30}
                />
                <Text as="h4" size="md" variant="link">@davimurta</Text>
              </div>
            </div>
          </div>
        </m.div>

        {/* Right Column */}
        <m.div className="contact-column" variants={rightVariants}>
          <ContactForm />
        </m.div>
      </m.div>
    </section>
  )
}

export default ContactSection
