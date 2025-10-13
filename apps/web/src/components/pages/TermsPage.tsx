'use client'

import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import type { PageContent } from "@/types/content"

interface TermsPageProps {
  content: PageContent
}

interface Section {
  id: string
  title: string
  content: string
}

interface TermsContent {
  hero: {
    title: string
    description: string
    lastUpdated: string
    effectiveDate: string
  }
  sections: Section[]
  contact: {
    title: string
    description: string
    methods: {
      email: string
      phone: string
      address: string
      business_hours: string
    }
  }
  updates: {
    title: string
    content: string
  }
}

export function TermsPage({ content }: TermsPageProps) {
  // Safe content validation instead of unsafe casting
  const isValidTermsContent = (content: any): content is TermsContent => {
    return content &&
           content.hero &&
           content.sections &&
           Array.isArray(content.sections) &&
           content.contact &&
           content.updates
  }

  if (!isValidTermsContent(content)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Content Loading Error</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Terms content structure is invalid. Please check content configuration.</p>
        </div>
      </div>
    )
  }

  const { hero, sections, contact, updates } = content as TermsContent

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{ background: 'var(--color-primary-600)' }}
            >
              <DynamicIcon name="FileText" className="h-8 w-8 text-white" />
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {hero.title}
            </h1>
            <p
              className="text-xl mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {hero.description}
            </p>
            <div
              className="flex flex-col sm:flex-row gap-2 justify-center text-sm"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              <span>Last Updated: {hero.lastUpdated}</span>
              <span className="hidden sm:inline">•</span>
              <span>Effective Date: {hero.effectiveDate}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8" style={{ background: 'var(--color-surface-base)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-lg p-6"
            style={{ background: 'var(--color-surface-raised)' }}
          >
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Table of Contents
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {sections.map((section: Section, index: number) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="hover:underline text-sm"
                  style={{ color: 'var(--color-primary-600)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-700)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary-600)'}
                >
                  {index + 1}. {section.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-16">
            {sections.map((section: Section, index: number) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="scroll-mt-24"
              >
                <div
                  className="rounded-xl shadow-sm border p-8"
                  style={{
                    background: 'var(--color-surface-base)',
                    borderColor: 'var(--color-border-default)'
                  }}
                >
                  <h2
                    className="text-2xl font-bold mb-6"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {section.title}
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <div
                      className="leading-relaxed whitespace-pre-wrap"
                      style={{ color: 'var(--color-text-secondary)' }}
                      dangerouslySetInnerHTML={{ __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="py-16"
        style={{ background: 'var(--color-bg-secondary)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-xl shadow-sm border p-8 text-center"
            style={{
              background: 'var(--color-surface-base)',
              borderColor: 'var(--color-border-default)'
            }}
          >
            <DynamicIcon
              name="MessageSquare"
              className="h-12 w-12 mx-auto mb-4"
              style={{ color: 'var(--color-primary-600)' }}
            />
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {contact.title}
            </h2>
            <p
              className="mb-6"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {contact.description}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div
                  className="text-sm mb-1"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Email
                </div>
                <div
                  className="font-medium"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {contact.methods.email}
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-sm mb-1"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Phone
                </div>
                <div
                  className="font-medium"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {contact.methods.phone}
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-sm mb-1"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Address
                </div>
                <div
                  className="font-medium"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {contact.methods.address}
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-sm mb-1"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Business Hours
                </div>
                <div
                  className="font-medium"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {contact.methods.business_hours}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <DynamicButton
                content={{
                  text: "Contact Legal Team",
                  variant: "default"
                }}
                className="text-white px-6 py-2.5"
                style={{
                  background: 'var(--color-primary-600)',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.background = 'var(--color-primary-700)'
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.background = 'var(--color-primary-600)'
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Updates Section */}
      <section
        className="py-16"
        style={{ background: 'var(--color-surface-base)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {updates.title}
            </h2>
            <div className="prose prose-lg max-w-none text-left">
              <div
                className="leading-relaxed whitespace-pre-wrap"
                style={{ color: 'var(--color-text-secondary)' }}
                dangerouslySetInnerHTML={{ __html: updates.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
