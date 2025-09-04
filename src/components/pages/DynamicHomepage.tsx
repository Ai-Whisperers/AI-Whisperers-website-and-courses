'use client'

import { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import { LanguageToggler } from "@/components/ui/LanguageToggler"
import { AnimatedBackground, FloatingElements, TypewriterText } from "@/components/ui/AnimatedBackground"
import { NewsletterSignup } from "@/components/interactive/NewsletterSignup"
import { FloatingThemeSelector } from "@/components/ui/ThemeSelector"
import { useLanguage } from '@/lib/i18n/context'
import { getCachedPageContent } from '@/lib/content/client'
import type { PageContent } from "@/types/content"

interface DynamicHomepageProps {
  content: PageContent
}

export function DynamicHomepage({ content: initialContent }: DynamicHomepageProps) {
  const { language, isLoading: languageLoading } = useLanguage()
  const [content, setContent] = useState<PageContent>(initialContent)
  const [isLoadingContent, setIsLoadingContent] = useState(false)

  useEffect(() => {
    if (languageLoading) return

    // If the current content language matches the selected language, no need to reload
    if (content.meta.language === language) return

    setIsLoadingContent(true)

    getCachedPageContent('homepage', language)
      .then(newContent => {
        setContent(newContent)
      })
      .catch(error => {
        console.error('Failed to load content for language:', language, error)
        // Keep current content if loading fails
      })
      .finally(() => {
        setIsLoadingContent(false)
      })
  }, [language, languageLoading, content.meta.language])

  // Show loading state while language is being determined or content is loading
  if (languageLoading || isLoadingContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Henyhẽhína tetepy... / Cargando contenido... / Loading content...</p>
        </div>
      </div>
    )
  }
  const { navigation, hero, features, stats, contact, footer } = content

  // Add safety checks for navigation
  if (!navigation || !hero || !features || !stats || !contact || !footer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content structure...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <DynamicIcon name="Brain" className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">{navigation.brand?.text || 'AI Paraguay'}</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {navigation.items?.map((item, index) => (
                <a 
                  key={index}
                  href={item.href} 
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item.text}
                </a>
              ))}
              <LanguageToggler />
              {navigation.cta && (
                <DynamicButton 
                  content={{
                    ...navigation.cta,
                    variant: 'default'
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <AnimatedBackground />
        <FloatingElements />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <TypewriterText 
              text={hero.headline}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            />
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-4xl mx-auto">
              {hero.subheadline}
            </p>
            <p className="text-lg text-gray-500 mb-8 max-w-3xl mx-auto">
              {hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <DynamicButton 
                content={hero.primaryCta}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              />
              <DynamicButton 
                content={hero.secondaryCta}
                className="px-8 py-3 text-lg"
              />
            </div>

            <div className="text-sm text-gray-500 mb-8">
              <DynamicIcon name="Globe" className="inline h-4 w-4 mr-2" />
              {hero.location}
            </div>

            {/* Hero Benefits */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {hero.benefits?.map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + (index * 0.2) }}
                  className="bg-white p-6 rounded-lg shadow-sm border"
                >
                  <DynamicIcon name={benefit.icon} className="h-8 w-8 text-blue-600 mb-3 mx-auto" />
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Makes Us Different */}
      {features?.differentiators && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{features.differentiators.title}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {features.differentiators.description}
              </p>
            </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Nuestro Enfoque</h3>
              <div className="space-y-4">
                {features.differentiators?.items?.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <DynamicIcon name={item.icon} className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Cada equipo se va con herramientas que puede usar <span className="text-blue-600">inmediatamente</span>, no solo conocimiento teórico.
              </h3>
              <p className="text-gray-600">
                Nuestro enfoque prioritiza la habilitación de productividad práctica y el ahorro de tiempo inmediato con aplicaciones personalizadas para cada departamento.
              </p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Services Section */}
      {Array.isArray(content.services) && (
        <section className="py-16 bg-gray-50" id="servicios">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
              <p className="text-lg text-gray-600">Comprehensive AI solutions tailored to your business needs</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.services.map((service, index) => {
                const icons = ['Briefcase', 'TrendingUp', 'Calculator', 'Users']
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500']
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all text-center"
                >
                    <div className={`w-16 h-16 ${colors[index % colors.length]} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <DynamicIcon name={icons[index % icons.length]} className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{service.shortDescription}</p>
                    <div className="text-blue-600 font-semibold text-sm">{service.price}</div>
                    <div className="text-gray-500 text-xs mt-1">{service.duration}</div>
                  </motion.div>
              )
            })}
          </div>
        </div>
      </section>
      )}

      {/* Tools We Specialize In */}
      {features?.tools && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{features.tools.title}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.tools?.items?.map((tool, index) => {
              // Define tool URLs
              const toolUrls: Record<string, string | { primary: string; secondary: string; primaryLabel: string; secondaryLabel: string }> = {
                'ChatGPT & Gemini': {
                  primary: 'https://chat.openai.com',
                  secondary: 'https://gemini.google.com',
                  primaryLabel: 'ChatGPT',
                  secondaryLabel: 'Gemini'
                },
                'Windsurf': 'https://codeium.com/windsurf',
                'Cursor': 'https://cursor.sh',
                'Claude': 'https://claude.ai'
              }
              
              const toolUrl = toolUrls[tool.title]
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-6 rounded-lg border hover:shadow-md transition-shadow group"
                >
                  <div className={`w-16 h-16 ${tool.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <DynamicIcon name="Brain" className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                  <p className="text-gray-600 text-sm">{tool.description}</p>
                  
                  {toolUrl ? (
                    typeof toolUrl === 'string' ? (
                      <a
                        href={toolUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Visitar {tool.title.split(' ')[0]}
                      </a>
                    ) : (
                      <div className="mt-4 space-y-2">
                        <a
                          href={toolUrl.primary}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Visitar {toolUrl.primaryLabel}
                        </a>
                        <a
                          href={toolUrl.secondary}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Visitar {toolUrl.secondaryLabel}
                        </a>
                      </div>
                    )
                  ) : (
                    <div className="mt-4">
                      <span className="text-sm text-gray-500">Learn more about {tool.title}</span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
      )}

      {/* Paraguay Focus */}
      {stats && (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-4">{stats.title}</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                {stats.description}
              </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {stats.company?.map((metric, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold text-blue-200 mb-2">{metric.value}</div>
                  <p className="text-blue-100">{metric.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      )}

      {/* Newsletter Signup */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Ahead with AI Insights</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get weekly AI industry updates, business implementation guides, and exclusive content delivered to your inbox.
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <NewsletterSignup />
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {contact.title}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {contact.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <DynamicButton 
              content={contact.primaryCta}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            />
            <DynamicButton 
              content={contact.secondaryCta}
              className="px-8 py-3 text-lg"
            />
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            {Array.isArray(contact.info) ? contact.info.map((info, index) => (
              <p key={index}>
                {info.type === 'email' && '📧'} 
                {info.type === 'whatsapp' && '📱'} 
                {info.type === 'address' && '📍'} 
                {info.type === 'web' && '🌐'} 
                {' '}{info.label}: {info.value}
              </p>
            )) : null}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <DynamicIcon name="Brain" className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">{footer.brand?.text || 'AI Paraguay'}</span>
            </div>
            <div className="text-sm text-gray-400">
              {footer.copyright || '© 2025 AI Paraguay'}
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Theme Selector for Testing */}
      <FloatingThemeSelector />
    </div>
  )
}