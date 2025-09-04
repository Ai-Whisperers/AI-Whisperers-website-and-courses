'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import { LanguageToggler } from "@/components/ui/LanguageToggler"
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

  const faqContent = content as unknown as FAQContent
  const { hero, categories, contact } = faqContent

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <DynamicIcon name="Brain" className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AI Paraguay</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/servicios" className="text-gray-600 hover:text-blue-600 transition-colors">Services</Link>
              <Link href="/sobre-nosotros" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link>
              <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</Link>
              <Link href="/contacto" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link>
              <Link href="/faq" className="text-blue-600 font-medium">FAQ</Link>
              <LanguageToggler />
              <DynamicButton 
                content={{
                  text: "Free Consultation",
                  variant: "default"
                }}
                className="bg-blue-600 hover:bg-blue-700"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {hero.title}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {hero.description}
            </p>
            <p className="text-lg text-gray-500 mb-8">
              {hero.subtitle}
            </p>

            {/* Search Bar */}
            <div className="max-w-lg mx-auto mb-8">
              <div className="relative">
                <DynamicIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category: FAQCategory) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                        activeCategory === category.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
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
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {categories.find((cat: FAQCategory) => cat.id === activeCategory)?.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredQuestions.length === 0 ? (
                    <div className="p-8 text-center">
                      <DynamicIcon name="Search" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                      <p className="text-gray-500">Try adjusting your search term or browse different categories.</p>
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
                          className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                            <DynamicIcon 
                              name={openQuestions.has(index) ? "ChevronUp" : "ChevronDown"} 
                              className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" 
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
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
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
      <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {contact.title}
            </h2>
            <p className="text-gray-600 mb-6">
              {contact.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
              <DynamicButton 
                content={{
                  text: contact.cta.primary.text,
                  variant: "default"
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5"
              />
              <DynamicButton 
                content={{
                  text: contact.cta.secondary.text,
                  variant: "outline"
                }}
                className="px-6 py-2.5 border-gray-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-gray-600 border-t pt-6">
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <DynamicIcon name="Brain" className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">AI Paraguay</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 AI Paraguay. Empowering businesses with artificial intelligence.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}