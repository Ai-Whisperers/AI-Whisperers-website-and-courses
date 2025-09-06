'use client'

import { motion } from "framer-motion"
import { DynamicGraphMap } from './DynamicGraphMap'
import { systemStats, criticalComponents } from './RealArchitectureData'
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import { LanguageToggler } from "@/components/ui/LanguageToggler"
import { useLanguage } from '@/lib/i18n/context'
import type { PageContent } from "@/types/content"

interface ArchitecturePageProps {
  content: PageContent
}

export function ArchitecturePage({ content }: ArchitecturePageProps) {
  const { language, isLoading: languageLoading } = useLanguage()

  // Show loading state while language is being determined
  if (languageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Henyhẽhína tetepy... / Cargando contenido... / Loading content...</p>
        </div>
      </div>
    )
  }

  const { navigation, hero, methodology, benefits, statistics, navigation_help, footer } = content

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <DynamicIcon name="Brain" className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">{navigation.brand.text}</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {navigation.items.map((item, index) => (
                <a 
                  key={index}
                  href={item.href} 
                  className={`text-gray-600 hover:text-blue-600 transition-colors ${
                    item.href === '/architecture' ? 'text-blue-600 font-medium' : ''
                  }`}
                >
                  {item.text}
                </a>
              ))}
              <LanguageToggler />
              <DynamicButton 
                content={{
                  ...navigation.cta,
                  variant: 'default'
                }}
                className="bg-blue-600 hover:bg-blue-700"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <DynamicIcon name="GitGraph" className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {hero.headline}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              {hero.subheadline}
            </p>
            <p className="text-lg text-gray-500 max-w-4xl mx-auto mb-6">
              {hero.description}
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <DynamicIcon name="Files" className="h-4 w-4" />
                <span>{systemStats.totalFiles} Archivos</span>
              </div>
              <div className="flex items-center space-x-1">
                <DynamicIcon name="GitBranch" className="h-4 w-4" />
                <span>{systemStats.totalDependencies} Dependencias</span>
              </div>
              <div className="flex items-center space-x-1">
                <DynamicIcon name="Award" className="h-4 w-4" />
                <span>Grado {systemStats.architectureGrade}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DynamicIcon name="Layers" className="h-4 w-4" />
                <span>4 Niveles de Jerarquía</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* EC4RO-HGN Overview */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-lg shadow-lg border p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{methodology.title}</h2>
            <p className="text-gray-600 mb-8">{methodology.description}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {methodology.levels.map((level, index) => (
                <motion.div
                  key={level.level}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`text-center p-4 bg-gradient-to-br ${level.color.replace('from-', 'from-').replace('to-', 'to-').replace('-500', '-50').replace('-600', '-100')} rounded-lg`}
                >
                  <div className={`text-2xl font-bold mb-2 bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                    Nivel {level.level === -1 ? '-1' : level.level}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{level.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{level.description}</p>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {level.components} componentes
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Dynamic Interactive Graph Map */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <DynamicGraphMap />
        </motion.section>

        {/* Architecture Benefits */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{benefits.title}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.items.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg border p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <DynamicIcon name={benefit.icon} className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                  </div>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* System Statistics */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">{statistics.title}</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0 * 0.1 }}
              >
                <div className="text-3xl font-bold text-blue-200 mb-2">{systemStats.totalFiles}</div>
                <p className="text-blue-100">Archivos Totales</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 * 0.1 }}
              >
                <div className="text-3xl font-bold text-blue-200 mb-2">{systemStats.circularDependencies}</div>
                <p className="text-blue-100">Dependencias Circulares</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2 * 0.1 }}
              >
                <div className="text-3xl font-bold text-blue-200 mb-2">{systemStats.architectureGrade}</div>
                <p className="text-blue-100">Calificación de Arquitectura</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 3 * 0.1 }}
              >
                <div className="text-3xl font-bold text-blue-200 mb-2">{systemStats.qualityScore}%</div>
                <p className="text-blue-100">Puntuación de Calidad</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Navigation Help */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-lg shadow-lg border p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">{navigation_help.title}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {navigation_help.sections.map((section, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-800 mb-3">{section.title}</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <DynamicIcon name="ChevronRight" className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <DynamicIcon name="Brain" className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">{footer.brand.text}</span>
            </div>
            <div className="text-sm text-gray-400">
              {footer.copyright}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}