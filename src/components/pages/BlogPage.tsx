'use client'

import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import type { PageContent } from "@/types/content"

interface BlogPageProps {
  content: PageContent
}

export function BlogPage({ content }: BlogPageProps) {
  const { navigation, hero, featuredPost, categories, posts, caseStudies, resources, newsletter, contact, footer } = content

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
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item.text}
                </a>
              ))}
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

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {hero.headline}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-4xl mx-auto">
              {hero.subheadline}
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
              {hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{featuredPost.title}</h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 md:p-12"
            >
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-blue-600 text-white px-3 py-1 text-sm rounded-full">
                      {featuredPost.post.category}
                    </span>
                    <span className="text-sm text-gray-500">{featuredPost.post.readTime} lectura</span>
                    <span className="text-sm text-gray-500">{featuredPost.post.date}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {featuredPost.post.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    {featuredPost.post.excerpt}
                  </p>
                  <a
                    href={featuredPost.post.href}
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Leer Artículo Completo
                    <DynamicIcon name="ArrowRight" className="ml-2 h-4 w-4" />
                  </a>
                </div>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <DynamicIcon name="FileText" className="h-24 w-24 text-gray-400" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{categories.title}</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.items.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${category.color}`}>
                      {category.count}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Posts */}
      {posts && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{posts.title}</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.items.map((post, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <DynamicIcon name="FileText" className="h-16 w-16 text-gray-400" />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs text-blue-600 font-medium">{post.category}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{post.date}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                    <a href={post.href}>{post.title}</a>
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Por {post.author}</span>
                    <a
                      href={post.href}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      Leer más
                      <DynamicIcon name="ArrowRight" className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                  {post.tags && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Case Studies */}
      {caseStudies && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{caseStudies.title}</h2>
              <p className="text-lg text-gray-600">{caseStudies.description}</p>
            </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {caseStudies.studies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 mb-1">{study.company}</h3>
                  <p className="text-sm text-blue-600">{study.industry}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Desafío:</h4>
                    <p className="text-sm text-gray-600">{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Solución:</h4>
                    <p className="text-sm text-gray-600">{study.solution}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Resultados:</h4>
                  <ul className="space-y-1">
                    {study.results.map((result, resultIndex) => (
                      <li key={resultIndex} className="text-sm text-gray-600 flex items-center">
                        <DynamicIcon name="Check" className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mb-4">
                  <span>Duración: {study.duration}</span>
                  <span>{study.teamSize}</span>
                </div>
                
                <a
                  href={study.href}
                  className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm font-medium block"
                >
                  Ver Caso Completo
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Resources */}
      {resources && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{resources.title}</h2>
              <p className="text-lg text-gray-600">{resources.description}</p>
            </div>

          <div className="grid md:grid-cols-2 gap-6">
            {resources.items.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <DynamicIcon name="Download" className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600 font-medium">{resource.type}</span>
                      <a
                        href={resource.downloadLink}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Descargar
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Newsletter */}
      {newsletter && (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-4">{newsletter.title}</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                {newsletter.description}
              </p>
            
            <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
              <div>
                <ul className="space-y-2 text-left">
                  {newsletter.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-blue-100">
                      <DynamicIcon name="Check" className="h-4 w-4 text-blue-300 mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <form className="space-y-4">
                  <input
                    type="email"
                    placeholder={newsletter.form.emailPlaceholder}
                    className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    type="submit"
                    className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    {newsletter.form.submitText}
                  </button>
                  <p className="text-xs text-blue-200">{newsletter.form.privacyNote}</p>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      )}

      {/* Contact CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {contact.title}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {contact.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <DynamicButton 
              content={contact.primaryCta}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            />
            <DynamicButton 
              content={contact.secondaryCta}
              className="px-8 py-3 text-lg"
            />
          </div>
        </div>
      </section>

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