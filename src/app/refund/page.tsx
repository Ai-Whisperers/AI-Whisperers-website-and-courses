// Refund Policy Page
// Production-ready refund policy page

import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { routes } from '@/config/routes'

export const metadata: Metadata = {
  title: 'Refund Policy | AI Whisperers',
  description: 'Learn about AI Whisperers 30-day money-back guarantee and refund policy for courses and services.',
  openGraph: {
    title: 'Refund Policy | AI Whisperers',
    description: '30-day money-back guarantee on all courses.',
  },
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Refund Policy
          </h1>
          <p className="text-xl text-muted-foreground">
            Your satisfaction is our priority
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 30-Day Guarantee */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <span className="text-3xl">✓</span>
                30-Day Money-Back Guarantee
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-muted-foreground">
                We stand behind the quality of our courses. If you're not completely satisfied with your purchase,
                you can request a full refund within 30 days of your purchase date.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-foreground mb-2">
                  No questions asked. No hassle.
                </p>
                <p className="text-sm text-muted-foreground">
                  We want you to feel confident in your investment in AI education.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Refund Eligibility
            </h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">✓</span>
                    <div>
                      <p className="font-semibold text-foreground">Individual Course Purchases</p>
                      <p className="text-sm text-muted-foreground">
                        Full refund available within 30 days of purchase
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">✓</span>
                    <div>
                      <p className="font-semibold text-foreground">Course Bundles</p>
                      <p className="text-sm text-muted-foreground">
                        Eligible for refund if less than 25% of content accessed
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">✓</span>
                    <div>
                      <p className="font-semibold text-foreground">Subscription Plans</p>
                      <p className="text-sm text-muted-foreground">
                        Pro-rated refunds available within first 14 days
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Exclusions */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Refund Exclusions
            </h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  The following are not eligible for refunds:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">•</span>
                    <span>Purchases made more than 30 days ago</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">•</span>
                    <span>Certificate fees (once certificate is issued)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">•</span>
                    <span>Custom enterprise training programs (separate terms apply)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">•</span>
                    <span>Promotional or discounted purchases (some restrictions may apply)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* How to Request */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              How to Request a Refund
            </h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-primary">1.</span>
                    <div>
                      <p className="font-semibold text-foreground">Contact Support</p>
                      <p className="text-sm text-muted-foreground">
                        Email us at support@aiwhisperers.com or use our contact form
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-primary">2.</span>
                    <div>
                      <p className="font-semibold text-foreground">Provide Details</p>
                      <p className="text-sm text-muted-foreground">
                        Include your order number, email address, and reason for refund (optional)
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-primary">3.</span>
                    <div>
                      <p className="font-semibold text-foreground">Receive Confirmation</p>
                      <p className="text-sm text-muted-foreground">
                        We'll process your request within 2-3 business days
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-primary">4.</span>
                    <div>
                      <p className="font-semibold text-foreground">Get Your Refund</p>
                      <p className="text-sm text-muted-foreground">
                        Refunds are issued to your original payment method within 5-10 business days
                      </p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Additional Information
            </h2>
            <Card>
              <CardContent className="pt-6 space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Processing Time:</strong> Refunds are typically processed within 2-3 business days.
                  Please allow 5-10 business days for the refund to appear in your account.
                </p>
                <p>
                  <strong className="text-foreground">Course Access:</strong> Upon requesting a refund, your access to the course
                  will be immediately revoked.
                </p>
                <p>
                  <strong className="text-foreground">Multiple Refunds:</strong> We reserve the right to limit refund requests
                  to prevent abuse. Accounts with excessive refund requests may be flagged.
                </p>
                <p>
                  <strong className="text-foreground">Enterprise Clients:</strong> Custom training programs and enterprise
                  agreements may have different refund terms as specified in your contract.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="pt-8">
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Have questions about our refund policy or need to request a refund?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg">
                    <Link href={routes.public.contact}>
                      Contact Support
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href={routes.public.help}>
                      Help Center
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Last Updated */}
          <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
            <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
