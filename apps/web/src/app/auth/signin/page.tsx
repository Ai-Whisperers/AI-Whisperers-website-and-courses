// Sign In Page
// Custom authentication page following clean architecture

import type { Metadata } from 'next'
import { Suspense } from 'react'
import SignInClient from './SignInClient'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Sign In | AI Whisperers',
  description: 'Sign in to your AI Whisperers account to access courses and exclusive content.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function SignInPage() {
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
      <SignInClient />
    </Suspense>
  )
}
