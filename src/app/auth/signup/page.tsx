// Sign Up Page
// Full signup form with validation following clean architecture

import type { Metadata } from 'next'
import { Suspense } from 'react'
import SignUpClient from './SignUpClient'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Sign Up | AI Whisperers',
  description: 'Create your AI Whisperers account to access world-class AI courses and exclusive content.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto max-w-md py-12">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <SignUpClient />
    </Suspense>
  )
}
