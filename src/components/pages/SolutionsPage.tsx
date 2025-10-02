'use client'

import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import type { PageContent } from "@/types/content"

interface SolutionsPageProps {
  content: PageContent
}

interface Department {
  title: string
  description: string
  solutions: string[]
  benefits: string[]
}

export function SolutionsPage({ content }: SolutionsPageProps) {
  const { hero, departments, contact } = content as any

  // Extract departments from content
  const departmentsList = departments ? [
    { id: 'marketing', ...departments.marketing, icon: 'TrendingUp', color: 'bg-blue-500' },
    { id: 'hr', ...departments.hr, icon: 'Users', color: 'bg-purple-500' },
    { id: 'finance', ...departments.finance, icon: 'DollarSign', color: 'bg-green-500' },
    { id: 'operations', ...departments.operations, icon: 'Settings', color: 'bg-orange-500' },
  ] : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {hero?.headline || 'AI Solutions by Department'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              {hero?.subheadline || 'Tailored AI implementations for every business function'}
            </p>
            <p className="text-lg text-gray-500 mb-8 max-w-3xl mx-auto">
              {hero?.description}
            </p>
            {hero?.primaryCta && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <DynamicButton
                  content={hero.primaryCta}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                />
                {hero.secondaryCta && (
                  <DynamicButton
                    content={hero.secondaryCta}
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
                  />
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {departmentsList.map((dept, index) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className={`w-16 h-16 ${dept.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <DynamicIcon name={dept.icon} className="h-8 w-8 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">{dept.title}</h2>
                <p className="text-gray-600 mb-6">{dept.description}</p>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Solutions:</h3>
                    <ul className="space-y-2">
                      {dept.solutions?.map((solution: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <DynamicIcon name="Check" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Benefits:</h3>
                    <ul className="space-y-2">
                      {dept.benefits?.map((benefit: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <DynamicIcon name="ArrowRight" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{benefit}</span>
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
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {contact.title}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {contact.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {contact.primaryCta && (
                <DynamicButton
                  content={contact.primaryCta}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
                />
              )}
              {contact.secondaryCta && (
                <DynamicButton
                  content={contact.secondaryCta}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
                />
              )}
            </div>

            {contact.info && contact.info.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8 pt-8 border-t border-blue-400">
                {contact.info.map((info: any, idx: number) => (
                  <div key={idx} className="text-blue-100">
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
