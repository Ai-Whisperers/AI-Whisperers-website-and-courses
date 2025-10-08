// Courses Page
// Complete course catalog with filtering and search

import { CourseCatalog } from '@/components/course/course-catalog'
import { getMockCoursesAsClientObjects } from '@/lib/data/mock-courses'

export const metadata = {
  title: 'AI Courses - Master Artificial Intelligence | AI Whisperers',
  description: 'Comprehensive AI courses from beginner to expert. Learn artificial intelligence through hands-on projects and real-world applications.'
}

// ISR: Revalidate every 30 minutes
// Course catalog updates more frequently than individual courses
export const revalidate = 1800

export default async function CoursesPage() {
  // Get courses from centralized mock data
  const coursesData = getMockCoursesAsClientObjects({ published: true })

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
        courses={coursesData} 
        showFilters={true}
      />
      
      {coursesData.length === 0 && (
        <div className="text-center py-24">
          <h2 className="text-2xl font-semibold mb-4">
            Courses Coming Soon
          </h2>
          <p className="text-muted-foreground mb-8">
            We&apos;re preparing amazing AI courses for you. Check back soon!
          </p>
        </div>
      )}
    </div>
  )
}