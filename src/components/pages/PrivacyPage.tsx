'use client'

import Link from 'next/link'
import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import { LanguageToggler } from "@/components/ui/LanguageToggler"
import type { PageContent } from "@/types/content"

interface PrivacyPageProps {
  content: PageContent
}

interface Section {
  id: string
  title: string
  content: string
}

interface PrivacyContent {
  hero: {
    title: string
    description: string
    lastUpdated: string
  }
  sections: Section[]
  contact: {
    title: string
    description: string
    methods: {
      email: string
      phone: string
      address: string
      response_time: string
    }
  }
  compliance: {
    title: string
    content: string
  }
}

export function PrivacyPage({ content }: PrivacyPageProps) {
  const privacyContent = content as unknown as PrivacyContent
  const { hero, sections, contact, compliance } = privacyContent

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
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <DynamicIcon name="Shield" className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {hero.title}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {hero.description}
            </p>
            <p className="text-sm text-gray-500">
              Last Updated: {hero.lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {sections.map((section: Section, index: number) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-blue-600 hover:text-blue-700 hover:underline text-sm"
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
                <div className="bg-white rounded-xl shadow-sm border p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {section.title}
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <div 
                      className="text-gray-600 leading-relaxed whitespace-pre-wrap"
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-sm border p-8 text-center"
          >
            <DynamicIcon name="Mail" className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {contact.title}
            </h2>
            <p className="text-gray-600 mb-6">
              {contact.description}
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Email</div>
                <div className="font-medium text-gray-900">{contact.methods.email}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Phone</div>
                <div className="font-medium text-gray-900">{contact.methods.phone}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Address</div>
                <div className="font-medium text-gray-900">{contact.methods.address}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Response Time</div>
                <div className="font-medium text-gray-900">{contact.methods.response_time}</div>
              </div>
            </div>

            <div className="mt-6">
              <DynamicButton 
                content={{
                  text: "Contact Privacy Team",
                  variant: "default"
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {compliance.title}
            </h2>
            <div className="prose prose-lg max-w-none text-left">
              <div 
                className="text-gray-600 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: compliance.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
              />
            </div>
          </motion.div>
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