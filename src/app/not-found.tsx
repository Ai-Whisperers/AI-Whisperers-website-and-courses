// Custom 404 Not Found Page
// Displays when a page or resource cannot be found

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { routes } from '@/config/routes'

export const metadata = {
  title: '404 - Page Not Found | AI Whisperers',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card>
        <CardHeader className="text-center">
          <div className="mb-4">
            <span className="text-8xl font-bold text-primary">404</span>
          </div>
          <CardTitle className="text-3xl">Page Not Found</CardTitle>
          <CardDescription className="text-lg">
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href={routes.public.home}>
                Go to Homepage
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={routes.public.courses}>
                Browse Courses
              </Link>
            </Button>
          </div>

          <div className="pt-6 border-t border-border">
            <h3 className="font-semibold mb-3 text-center">Popular Pages</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Link
                href={routes.public.courses}
                className="p-3 rounded-md hover:bg-muted transition-colors text-sm"
              >
                <span className="font-medium">AI Courses</span>
                <p className="text-xs text-muted-foreground">
                  Browse our course catalog
                </p>
              </Link>
              <Link
                href={routes.public.about}
                className="p-3 rounded-md hover:bg-muted transition-colors text-sm"
              >
                <span className="font-medium">About Us</span>
                <p className="text-xs text-muted-foreground">
                  Learn about AI Whisperers
                </p>
              </Link>
              <Link
                href={routes.public.services}
                className="p-3 rounded-md hover:bg-muted transition-colors text-sm"
              >
                <span className="font-medium">Services</span>
                <p className="text-xs text-muted-foreground">
                  Explore our AI services
                </p>
              </Link>
              <Link
                href={routes.public.contact}
                className="p-3 rounded-md hover:bg-muted transition-colors text-sm"
              >
                <span className="font-medium">Contact</span>
                <p className="text-xs text-muted-foreground">
                  Get in touch with us
                </p>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
