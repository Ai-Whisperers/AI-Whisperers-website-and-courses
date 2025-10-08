// Individual Course Page
// Detailed course information with enrollment

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDuration } from '@/lib/utils'
import { AuthGuard } from '@/components/auth/auth-guard'
import { getMockCourseBySlug, courseToPlainObjectWithMethods, getMockCourses } from '@/lib/data/mock-courses'
import { routes } from '@/config/routes'

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

async function getCourseBySlug(slug: string) {
  const course = getMockCourseBySlug(slug)
  return course ? courseToPlainObjectWithMethods(course) : null
}

// Static Site Generation (SSG) with Incremental Static Regeneration (ISR)
// Pre-generate all published course pages at build time for optimal performance
export async function generateStaticParams() {
  const courses = getMockCourses({ published: true })

  return courses.map((course) => ({
    slug: course.slug,
  }))
}

// ISR: Revalidate every hour (3600 seconds)
// Course content doesn't change frequently, so hourly updates are sufficient
export const revalidate = 3600

// Allow dynamic params for new courses without rebuild
export const dynamicParams = true

export async function generateMetadata({ params }: CoursePageProps) {
  const resolvedParams = await params
  const course = await getCourseBySlug(resolvedParams.slug)

  if (!course) {
    return {
      title: 'Course Not Found | AI Whisperers',
      description: 'The requested course could not be found.'
    }
  }

  return {
    title: `${course.title} - AI Course | AI Whisperers`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      type: 'website'
    }
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const resolvedParams = await params
  const course = await getCourseBySlug(resolvedParams.slug)
  
  if (!course || !course.canEnroll()) {
    notFound()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'advanced':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200'
      case 'expert':
        return 'bg-red-100 text-red-800 hover:bg-red-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href={routes.public.courses}
            className="text-primary hover:text-primary/80 font-medium"
          >
            ← Back to Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getDifficultyColor(course.difficulty)}>
                  {course.getDifficultyLevel()}
                </Badge>
                {course.featured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              
              <div className="flex items-center gap-6 text-muted-foreground mb-6">
                <span>{formatDuration(course.duration.minutes)}</span>
                <span className="font-semibold text-primary">
                  {course.isFree() ? 'Free' : formatCurrency(course.price.amount)}
                </span>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </div>

            <Separator className="my-8" />

            {/* Learning Objectives */}
            {course.learningObjectives.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.learningObjectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-muted-foreground">{objective}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {course.prerequisites.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>
                <ul className="space-y-2">
                  {course.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary mt-1.5">•</span>
                      <span className="text-muted-foreground">{prerequisite}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-center">
                  {course.isFree() ? 'Free Course' : formatCurrency(course.price.amount)}
                </CardTitle>
                {!course.isFree() && (
                  <CardDescription className="text-center">
                    One-time payment • Lifetime access
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{formatDuration(course.duration.minutes)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level:</span>
                    <span className="font-medium">{course.getDifficultyLevel()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Access:</span>
                    <span className="font-medium">Lifetime</span>
                  </div>
                </div>

                <Separator />

                <AuthGuard
                  requireAuth={true}
                  requireEmailVerified={true}
                  fallback={
                    <div className="space-y-3">
                      <Button asChild className="w-full" size="lg">
                        <Link href={routes.auth.signin}>
                          Sign In to Enroll
                        </Link>
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Create a free account to get started
                      </p>
                    </div>
                  }
                >
                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      {course.isFree() ? 'Enroll Free' : `Enroll for ${formatCurrency(course.price.amount)}`}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      30-day money-back guarantee
                    </p>
                  </div>
                </AuthGuard>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}