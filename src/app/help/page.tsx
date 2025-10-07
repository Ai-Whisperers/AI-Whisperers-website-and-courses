// Help Center Page
// Production-ready help center with FAQ categories

import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { routes } from '@/config/routes'

export const metadata: Metadata = {
  title: 'Help Center | AI Whisperers',
  description: 'Get help with AI Whisperers courses, account management, billing, and technical support.',
  openGraph: {
    title: 'Help Center | AI Whisperers',
    description: 'Find answers to common questions and get support.',
  },
}

export default function HelpPage() {
  const faqCategories = [
    {
      title: 'Getting Started',
      description: 'New to AI Whisperers? Start here',
      topics: [
        'How do I create an account?',
        'How do I enroll in a course?',
        'What are the system requirements?',
        'Can I access courses on mobile devices?',
      ],
    },
    {
      title: 'Courses & Learning',
      description: 'Questions about our educational content',
      topics: [
        'How long do I have access to a course?',
        'Can I download course materials?',
        'Are there prerequisites for courses?',
        'How do I earn a certificate?',
      ],
    },
    {
      title: 'Account & Billing',
      description: 'Manage your account and payments',
      topics: [
        'How do I update my payment method?',
        'Can I get a refund?',
        'How do I change my password?',
        'Can I share my account?',
      ],
    },
    {
      title: 'Technical Support',
      description: 'Troubleshooting and technical issues',
      topics: [
        'Videos won\'t play',
        'I can\'t access my course',
        'Code examples aren\'t working',
        'Browser compatibility issues',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-b border-border bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              How Can We Help?
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Search for answers or browse our help topics below
            </p>

            <div className="flex gap-3 max-w-2xl mx-auto">
              <Input
                type="search"
                placeholder="Search for help articles..."
                className="flex-1 h-12 text-base"
                aria-label="Search help articles"
              />
              <Button size="lg" className="px-8">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Browse by Category
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {faqCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.topics.map((topic, topicIndex) => (
                      <li key={topicIndex}>
                        <Link
                          href="#"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-start gap-2"
                        >
                          <span className="text-primary mt-1">→</span>
                          <span>{topic}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Quick Links
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Refund Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn about our 30-day money-back guarantee and how to request a refund.
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={routes.public.refund}>
                    View Policy
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Privacy & Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Review our privacy policy and terms of service.
                </p>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={routes.public.privacy}>
                      Privacy
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={routes.public.terms}>
                      Terms
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                Still Need Help?
              </CardTitle>
              <CardDescription className="text-base">
                Can't find what you're looking for? Get in touch with our support team
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                We typically respond within 24 hours on business days
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <Link href={routes.public.contact}>
                    Contact Support
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={routes.public.courses}>
                    Browse Courses
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
