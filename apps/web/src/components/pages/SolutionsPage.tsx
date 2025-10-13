'use client'

import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import type { PageContent } from "@/types/content"

interface SolutionsPageProps {
  content: PageContent
}

export function SolutionsPage({ content }: SolutionsPageProps) {
  const { hero, departments, contact } = content as any

  // Extract departments from content with design token colors
  const departmentsList = departments ? [
    { id: 'marketing', ...departments.marketing, icon: 'TrendingUp', colorVar: 'var(--color-primary-500)' },
    { id: 'hr', ...departments.hr, icon: 'Users', colorVar: 'var(--color-secondary-500)' },
    { id: 'finance', ...departments.finance, icon: 'DollarSign', colorVar: 'var(--color-success)' },
    { id: 'operations', ...departments.operations, icon: 'Settings', colorVar: 'var(--color-accent-500)' },
  ] : []

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
              {hero?.headline || 'AI Solutions by Department'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              {hero?.subheadline || 'Tailored AI implementations for every business function'}
            </p>
            <p className="text-lg mb-8 max-w-3xl mx-auto" style={{ color: 'var(--color-text-tertiary)' }}>
              {hero?.description}
            </p>
            {hero?.primaryCta && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <DynamicButton
                  content={hero.primaryCta}
                  className="text-white px-8 py-3 text-lg"
                  style={{ background: 'var(--color-primary-600)' }}
                />
                {hero.secondaryCta && (
                  <DynamicButton
                    content={hero.secondaryCta}
                    className="border-2 px-8 py-3 text-lg"
                    style={{ borderColor: 'var(--color-primary-600)', color: 'var(--color-primary-600)' }}
                  />
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-16" style={{ background: 'var(--color-surface-base)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {departmentsList.map((dept, index) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-2xl p-8 shadow-sm border hover:shadow-md transition-shadow"
                style={{
                  background: `linear-gradient(to bottom right, var(--color-bg-secondary), var(--color-surface-base))`,
                  borderColor: 'var(--color-border-default)'
                }}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: dept.colorVar }}>
                  <DynamicIcon name={dept.icon} className="h-8 w-8 text-white" />
                </div>

                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>{dept.title}</h2>
                <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>{dept.description}</p>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Solutions:</h3>
                    <ul className="space-y-2">
                      {dept.solutions?.map((solution: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <DynamicIcon name="Check" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-success)' }} />
                          <span style={{ color: 'var(--color-text-secondary)' }}>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Benefits:</h3>
                    <ul className="space-y-2">
                      {dept.benefits?.map((benefit: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <DynamicIcon name="ArrowRight" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary-500)' }} />
                          <span style={{ color: 'var(--color-text-secondary)' }}>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      {contact && (
        <section
          className="py-16"
          style={{
            background: `linear-gradient(to right, var(--color-primary-600), var(--color-primary-700))`,
            color: 'var(--color-text-inverse)'
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-inverse)' }}>
              {contact.title}
            </h2>
            <p className="text-xl mb-8" style={{ color: 'var(--color-neutral-100)' }}>
              {contact.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {contact.primaryCta && (
                <DynamicButton
                  content={contact.primaryCta}
                  className="px-8 py-3 text-lg"
                  style={{
                    background: 'var(--color-surface-base)',
                    color: 'var(--color-primary-600)'
                  }}
                />
              )}
              {contact.secondaryCta && (
                <DynamicButton
                  content={contact.secondaryCta}
                  className="border-2 px-8 py-3 text-lg"
                  style={{
                    borderColor: 'var(--color-text-inverse)',
                    color: 'var(--color-text-inverse)'
                  }}
                />
              )}
            </div>

            {contact.info && contact.info.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8 pt-8 border-t" style={{ borderColor: 'var(--color-primary-400)' }}>
                {contact.info.map((info: any, idx: number) => (
                  <div key={idx} style={{ color: 'var(--color-neutral-100)' }}>
                    <div className="font-medium">{info.label}</div>
                    <div>{info.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
