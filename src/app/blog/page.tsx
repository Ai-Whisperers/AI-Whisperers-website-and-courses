// Blog Listing Page
// Production-ready placeholder following clean architecture

import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { routes } from '@/config/routes'

export const metadata: Metadata = {
  title: 'Blog | AI Whisperers',
  description: 'Insights, tutorials, and updates from AI Whisperers. Learn about AI, machine learning, and digital transformation.',
  openGraph: {
    title: 'Blog | AI Whisperers',
    description: 'Insights, tutorials, and updates from AI Whisperers.',
  },
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              AI Whisperers Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Insights, tutorials, and the latest updates in AI and machine learning
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-dashed">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl">
                Blog Coming Soon
              </CardTitle>
              <CardDescription className="text-lg">
                We're working hard to bring you valuable content about AI, machine learning, and digital transformation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Get notified when we publish our first articles:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1"
                    aria-label="Email address"
                  />
                  <Button className="sm:w-auto">
                    Notify Me
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-semibold text-foreground mb-3 text-center">
                  What to expect:
                </h3>
                <ul className="space-y-2 text-muted-foreground max-w-2xl mx-auto">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>In-depth tutorials on AI implementation and best practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Case studies from real-world AI transformations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Industry insights and emerging AI trends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Expert interviews and thought leadership</span>
                  </li>
                </ul>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  In the meantime, explore our courses and services:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="outline">
                    <Link href={routes.public.courses}>
                      Browse Courses
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={routes.public.services}>
                      View Services
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
