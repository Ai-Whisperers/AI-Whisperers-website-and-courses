// Sign Up Page
// Full signup form with validation following clean architecture

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | AI Whisperers',
  description: 'Create your AI Whisperers account to access world-class AI courses and exclusive content.',
  robots: {
    index: false,
    follow: true,
  },
}

'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { routes } from '@/config/routes'

function SignUpForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || routes.protected.dashboard

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number'
    }
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your name')
      return
    }

    if (!formData.email.trim()) {
      setError('Please enter your email')
      return
    }

    if (!formData.password) {
      setError('Please enter a password')
      return
    }

    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      // In production, this would call a registration API endpoint
      // For now, we'll use the email sign-in flow
      const result = await signIn('email', {
        email: formData.email,
        callbackUrl,
        redirect: false,
      })

      if (result?.ok) {
        setEmailSent(true)
      } else {
        setError('Failed to send verification email. Please try again.')
      }
    } catch (err) {
      console.error('Sign up error:', err)
      setError('An error occurred during sign up. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleProviderSignUp = async (provider: string) => {
    await signIn(provider, { callbackUrl })
  }

  if (emailSent) {
    return (
      <div className="container mx-auto max-w-md py-12">
        <Card>
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We've sent a verification link to {formData.email}. Click the link to complete your registration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => setEmailSent(false)}
              className="w-full"
            >
              Back to sign up
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Join AI Whisperers and start your AI learning journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={() => handleProviderSignUp('google')}
              variant="outline"
              className="w-full"
              type="button"
            >
              Continue with Google
            </Button>

            <Button
              onClick={() => handleProviderSignUp('github')}
              variant="outline"
              className="w-full"
              type="button"
            >
              Continue with GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign up with email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                At least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="text-xs text-muted-foreground text-center">
            By signing up, you agree to our{' '}
            <Link href={routes.public.terms} className="text-primary hover:underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href={routes.public.privacy} className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
            Already have an account?{' '}
            <Link href={routes.auth.signin} className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
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
      <SignUpForm />
    </Suspense>
  )
}
