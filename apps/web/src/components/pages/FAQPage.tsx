'use client'

import { useState } from 'react'
import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import type { PageContent } from "@/types/content"

interface FAQPageProps {
  content: PageContent
}

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  id: string
  title: string
  icon: string
  questions: FAQItem[]
}

interface FAQContent {
  hero: {
    title: string
    description: string
    subtitle: string
  }
  categories: FAQCategory[]
  contact: {
    title: string
    description: string
    cta: {
      primary: { text: string }
      secondary: { text: string }
    }
    info: {
      email: string
      phone: string
      hours: string
    }
  }
}

export function FAQPage({ content }: FAQPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('general')
  const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  // Safe content validation instead of unsafe casting
  const isValidFAQContent = (content: any): content is FAQContent => {
    return content &&
           content.hero &&
           content.categories &&
           Array.isArray(content.categories) &&
           content.contact
  }

  if (!isValidFAQContent(content)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Content Loading Error</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>FAQ content structure is invalid. Please check content configuration.</p>
        </div>
      </div>
    )
  }

  const { hero, categories, contact } = content as FAQContent

  const toggleQuestion = (index: number) => {
    const newOpenQuestions = new Set(openQuestions)
    if (newOpenQuestions.has(index)) {
      newOpenQuestions.delete(index)
    } else {
      newOpenQuestions.add(index)
    }
    setOpenQuestions(newOpenQuestions)
  }

  const filteredQuestions = categories
    .find((cat: FAQCategory) => cat.id === activeCategory)
    ?.questions.filter((q: FAQItem) =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
              {hero.title}
            </h1>
            <p className="text-xl mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              {hero.description}
            </p>
            <p className="text-lg mb-8" style={{ color: 'var(--color-text-tertiary)' }}>
              {hero.subtitle}
            </p>

            {/* Search Bar */}
            <div className="max-w-lg mx-auto mb-8">
              <div className="relative">
                <DynamicIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
                <input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: 'var(--color-border-default)',
                    background: 'var(--color-surface-base)',
                    color: 'var(--color-text-primary)'
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">

            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-lg shadow-sm border p-6 sticky top-24" style={{ background: 'var(--color-surface-base)', borderColor: 'var(--color-border-default)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Categories</h3>
                <div className="space-y-2">
                  {categories.map((category: FAQCategory) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors`}
                      style={{
                        background: activeCategory === category.id ? 'var(--color-primary-50)' : 'transparent',
                        color: activeCategory === category.id ? 'var(--color-primary-700)' : 'var(--color-text-primary)',
                        borderColor: activeCategory === category.id ? 'var(--color-primary-200)' : 'transparent',
                        border: activeCategory === category.id ? '1px solid' : '1px solid transparent'
                      }}
                    >
                      <DynamicIcon name={category.icon} className="h-5 w-5" />
                      <span className="font-medium">{category.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Questions Content */}
            <div className="lg:col-span-3">
              <div className="rounded-lg shadow-sm border" style={{ background: 'var(--color-surface-base)', borderColor: 'var(--color-border-default)' }}>
                <div className="p-6 border-b" style={{ borderColor: 'var(--color-border-default)' }}>
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {categories.find((cat: FAQCategory) => cat.id === activeCategory)?.title}
                  </h2>
                  <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                <div className="divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
                  {filteredQuestions.length === 0 ? (
                    <div className="p-8 text-center">
                      <DynamicIcon name="Search" className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--color-border-default)' }} />
                      <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>No questions found</h3>
                      <p style={{ color: 'var(--color-text-tertiary)' }}>Try adjusting your search term or browse different categories.</p>
                    </div>
                  ) : (
                    filteredQuestions.map((faq: FAQItem, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <button
                          onClick={() => toggleQuestion(index)}
                          className="w-full p-6 text-left hover:bg-opacity-50 transition-colors"
                          style={{ background: openQuestions.has(index) ? 'var(--color-surface-raised)' : 'transparent' }}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold pr-4" style={{ color: 'var(--color-text-primary)' }}>{faq.question}</h3>
                            <DynamicIcon
                              name={openQuestions.has(index) ? "ChevronUp" : "ChevronDown"}
                              className="h-5 w-5 flex-shrink-0 mt-0.5"
                              style={{ color: 'var(--color-text-tertiary)' }}
                            />
                          </div>
                        </button>

                        <motion.div
                          initial={false}
                          animate={{
                            height: openQuestions.has(index) ? "auto" : 0,
                            opacity: openQuestions.has(index) ? 1 : 0
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{faq.answer}</p>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12" style={{ background: `linear-gradient(to bottom right, var(--color-primary-50), var(--color-accent-50))` }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl shadow-lg p-8 text-center" style={{ background: 'var(--color-surface-base)' }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
              {contact.title}
            </h2>
            <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              {contact.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
              <DynamicButton
                content={{
                  text: contact.cta.primary.text,
                  variant: "default"
                }}
                className="text-white px-6 py-2.5"
                style={{ background: 'var(--color-primary-600)' }}
              />
              <DynamicButton
                content={{
                  text: contact.cta.secondary.text,
                  variant: "outline"
                }}
                className="px-6 py-2.5 border"
                style={{ borderColor: 'var(--color-border-default)', color: 'var(--color-text-primary)' }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm border-t pt-6" style={{ color: 'var(--color-text-secondary)', borderColor: 'var(--color-border-default)' }}>
              <div className="flex items-center justify-center gap-2">
                <span>📧</span>
                <span>{contact.info.email}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span>📱</span>
                <span>{contact.info.phone}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span>🕒</span>
                <span>{contact.info.hours}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
