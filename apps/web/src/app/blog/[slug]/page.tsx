// Blog Post Detail Page
// Production-ready placeholder with dynamic routing

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { routes } from '@/config/routes'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  return {
    title: `${params.slug} | AI Whisperers Blog`,
    description: 'Blog post coming soon.',
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  // Since we don't have blog posts yet, show coming soon message
  // In production, this would fetch the post data and show 404 if not found

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-dashed">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl">
                Blog Post: {params.slug}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-lg text-muted-foreground">
                This blog post is not yet available. We're working on creating valuable content for you.
              </p>

              <div className="pt-4">
                <Button asChild>
                  <Link href={routes.public.blog}>
                    Back to Blog
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
