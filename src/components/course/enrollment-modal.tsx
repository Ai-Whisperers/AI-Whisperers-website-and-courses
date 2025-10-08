'use client'

// Enrollment Modal Component
// Handles course enrollment flow with payment options

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

interface EnrollmentModalProps {
  courseId: string
  courseTitle: string
  price: number
  isFree: boolean
  onClose: () => void
  isOpen: boolean
}

export function EnrollmentModal({
  courseId,
  courseTitle,
  price,
  isFree,
  onClose,
  isOpen
}: EnrollmentModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [enrolled, setEnrolled] = useState(false)

  const handleEnrollment = async () => {
    setLoading(true)
    try {
      // TODO: Implement actual enrollment API call
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      })

      if (response.ok) {
        setEnrolled(true)
        setTimeout(() => {
          router.push(`/dashboard`)
        }, 2000)
      }
    } catch (error) {
      console.error('Enrollment error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  if (enrolled) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-green-600">Enrollment Successful!</CardTitle>
            <CardDescription className="text-center">
              You've been enrolled in {courseTitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-muted-foreground mb-4">
              Redirecting to your dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>Enroll in Course</CardTitle>
          <CardDescription>{courseTitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Course Price</span>
              <span className="text-2xl font-bold">
                {isFree ? 'Free' : `$${price}`}
              </span>
            </div>
            {!isFree && (
              <>
                <Separator className="my-2" />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lifetime Access</span>
                    <Badge variant="secondary">✓</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificate</span>
                    <Badge variant="secondary">✓</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">30-Day Guarantee</span>
                    <Badge variant="secondary">✓</Badge>
                  </div>
                </div>
              </>
            )}
          </div>

          {!isFree && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Payment Method</p>
              <div className="grid gap-2">
                <Button variant="outline" className="justify-start" disabled>
                  <span className="mr-2">💳</span> Credit/Debit Card (Coming Soon)
                </Button>
                <Button variant="outline" className="justify-start" disabled>
                  <span className="mr-2">💰</span> PayPal (Coming Soon)
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Payment integration coming soon. For now, courses can be accessed for free.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEnrollment}
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Enrolling...' : isFree ? 'Enroll Free' : 'Enroll Now'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
