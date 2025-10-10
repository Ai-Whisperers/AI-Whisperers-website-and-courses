// Careers Page
// Production-ready careers page with company mission

import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { routes } from '@/config/routes'

export const metadata: Metadata = {
  title: 'Careers | AI Whisperers',
  description: 'Join the AI Whisperers team. Help us democratize AI education and empower organizations with AI transformation.',
  openGraph: {
    title: 'Careers | AI Whisperers',
    description: 'Join the AI Whisperers team and shape the future of AI education.',
  },
}

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Join Our Mission
            </h1>
            <p className="text-xl text-muted-foreground">
              Help us democratize AI education and transform how organizations adopt artificial intelligence
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why AI Whisperers?
            </h2>
            <p className="text-lg text-muted-foreground">
              We're building the future of AI education, one learner at a time. Our mission is to make AI accessible, practical, and transformative for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Innovation First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We embrace cutting-edge AI technologies and push the boundaries of what's possible in education.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Impact Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every course, every project, every interaction is designed to create real-world value for our learners.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Remote-First Culture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Work from anywhere while collaborating with a global team of AI enthusiasts and educators.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl">
                Current Openings
              </CardTitle>
              <CardDescription className="text-lg">
                We're not hiring at the moment, but we're always looking for exceptional talent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  While we don't have any open positions right now, we'd love to hear from passionate individuals who want to make an impact in AI education.
                </p>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">We typically look for:</p>
                  <ul className="space-y-1 max-w-md mx-auto text-left">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>AI/ML Engineers and Researchers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Course Creators and Technical Writers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Full-Stack Developers (Next.js, TypeScript)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>DevOps and Infrastructure Engineers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Product and Business Development</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-border text-center space-y-4">
                <p className="text-muted-foreground">
                  Send us your resume and a brief introduction. We'll keep it on file for future opportunities.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href={routes.public.contact}>
                      Get in Touch
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={routes.public.about}>
                      Learn More About Us
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">🌍</div>
              <h3 className="font-semibold text-foreground">Remote Work</h3>
              <p className="text-sm text-muted-foreground">Work from anywhere in the world</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">📚</div>
              <h3 className="font-semibold text-foreground">Learning Budget</h3>
              <p className="text-sm text-muted-foreground">Continuous education and development</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">⚖️</div>
              <h3 className="font-semibold text-foreground">Work-Life Balance</h3>
              <p className="text-sm text-muted-foreground">Flexible hours and time off</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">🚀</div>
              <h3 className="font-semibold text-foreground">Growth Opportunities</h3>
              <p className="text-sm text-muted-foreground">Advance your career in AI</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
