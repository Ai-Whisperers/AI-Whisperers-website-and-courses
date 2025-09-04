// Courses Page
// Complete course catalog with filtering and search

import { CourseCatalog } from '@/components/course/course-catalog'

export const metadata = {
  title: 'AI Courses - Master Artificial Intelligence | AI Whisperers',
  description: 'Comprehensive AI courses from beginner to expert. Learn artificial intelligence through hands-on projects and real-world applications.'
}

export default async function CoursesPage() {
  // Mock data for initial deployment
  const courses = [
    {
      id: 'course-1',
      title: 'AI Foundations',
      description: 'Learn the fundamentals of artificial intelligence with hands-on projects.',
      slug: 'ai-foundations',
      price: { amount: 29900, currency: 'USD', formatted: '$299.00' },
      duration: { minutes: 720, formatted: '12 hours' },
      difficulty: 'BEGINNER',
      published: true,
      featured: true,
    },
    {
      id: 'course-2',
      title: 'Applied AI', 
      description: 'Build practical AI applications using modern tools and APIs.',
      slug: 'applied-ai',
      price: { amount: 59900, currency: 'USD', formatted: '$599.00' },
      duration: { minutes: 900, formatted: '15 hours' },
      difficulty: 'INTERMEDIATE',
      published: true,
      featured: true,
    }
  ]

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          AI Courses
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Master AI with our comprehensive courses designed to take you from beginner to expert. 
          Choose your learning path and start building the future today.
        </p>
      </div>
      
      <CourseCatalog 
        courses={courses} 
        showFilters={true}
      />
      
      {courses.length === 0 && (
        <div className="text-center py-24">
          <h2 className="text-2xl font-semibold mb-4">
            Courses Coming Soon
          </h2>
          <p className="text-muted-foreground mb-8">
            We're preparing amazing AI courses for you. Check back soon!
          </p>
        </div>
      )}
    </div>
  )
}