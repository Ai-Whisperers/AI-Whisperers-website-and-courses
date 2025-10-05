'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { logger } from '@/lib/logger'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to our logging service
    logger.error('Application Error', error, {
      digest: error.digest,
      message: error.message,
    })
  }, [error])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Something went wrong!</CardTitle>
            </div>
            <CardDescription>
              An unexpected error occurred while loading this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.env.NODE_ENV === 'development' && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-mono text-muted-foreground break-words">
                  {error.message}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Button onClick={() => reset()} className="w-full">
                Try again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Go to homepage
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {error.digest && `Error ID: ${error.digest}`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
