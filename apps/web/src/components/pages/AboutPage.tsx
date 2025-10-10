'use client'

import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"
import { DynamicButton } from "@/components/content/DynamicButton"
import { useLanguage } from '@/contexts/i18n'
// Removed client-side content loading - now uses server-side compiled content
import type { PageContent } from "@/types/content"

interface AboutPageProps {
  content: PageContent
}

export function AboutPage({ content }: AboutPageProps) {
  const { isLoading: languageLoading } = useLanguage()
  // Note: Content is now server-side compiled and provided via props
  // Language switching would require page navigation to different routes

  // Show loading state while language is being determined
  if (languageLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Henyhẽhína tetepy... / Cargando contenido... / Loading content...</p>
        </div>
      </div>
    )
  }
  const { hero, story, mission, vision, values, team, stats, contact } = content

  // Handle both array and object structures defensively
  const valuesArray = Array.isArray(values) ? values : (values as any)?.items || []
  const teamArray = Array.isArray(team) ? team : (team as any)?.members || []
  const valuesTitle = (values as any)?.title || "Our Values"
  const teamTitle = (team as any)?.title || "Meet Our Team"

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {hero.headline}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-4xl mx-auto">
              {hero.subheadline}
            </p>
            <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
              {hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      {story && mission && vision && (
        <section className="py-16 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">{story.title}</h2>
                <div className="text-lg text-muted-foreground space-y-4">
                  {story.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{mission.title}</h3>
                    <p className="text-muted-foreground">{mission.description}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{vision.title}</h3>
                    <p className="text-muted-foreground">{vision.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Values */}
      {values && valuesArray.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">{valuesTitle}</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {valuesArray.map((value: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card p-6 rounded-lg shadow-sm text-center"
                >
                  {value.icon && <DynamicIcon name={value.icon} className="h-12 w-12 text-primary mb-4 mx-auto" />}
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-foreground/70 text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {team && teamArray.length > 0 && (
        <section className="py-16 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">{teamTitle}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {teamArray.map((member: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-card border rounded-lg p-6 text-center shadow-sm"
                >
                  <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                    <DynamicIcon name="User" className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-foreground/70 text-sm mb-4">{member.bio}</p>
                  {member.expertise && member.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.expertise.map((skill: string, skillIndex: number) => (
                        <span
                          key={skillIndex}
                          className="bg-primary/10 text-primary text-xs px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      {stats && (
        <section className="py-16 glass text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-4">{(stats as any).title || "Our Impact"}</h2>

              <div className="grid md:grid-cols-4 gap-8 mt-12">
                {(stats as any).metrics ? (
                  (stats as any).metrics.map((metric: any, index: number) => (
                    <div key={index}>
                      <div className="text-4xl font-bold text-primary-foreground/90 mb-2">{metric.value}</div>
                      <p className="text-primary-foreground/80">{metric.description}</p>
                    </div>
                  ))
                ) : (
                  Object.entries(stats).map(([key, value], index) => (
                    <div key={index}>
                      <div className="text-4xl font-bold text-primary-foreground/90 mb-2">{value as string}</div>
                      <p className="text-primary-foreground/80">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      {contact && (
        <section className="py-16 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {(contact as any).title || "Get in Touch"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {(contact as any).description || "Ready to start your AI learning journey?"}
            </p>

            {(contact as any).primaryCta && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <DynamicButton
                  content={(contact as any).primaryCta}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
                />
                {(contact as any).secondaryCta && (
                  <DynamicButton
                    content={(contact as any).secondaryCta}
                    className="px-8 py-3 text-lg"
                  />
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}