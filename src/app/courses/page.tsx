// Courses Page
// Complete course catalog with filtering and search

import { CourseCatalog } from '@/components/course/course-catalog'
import { Course, Difficulty } from '@/domain/entities/course'
import { CourseId } from '@/domain/value-objects/course-id'
import { Money } from '@/domain/value-objects/money'
import { Duration } from '@/domain/value-objects/duration'

export const metadata = {
  title: 'AI Courses - Master Artificial Intelligence | AI Whisperers',
  description: 'Comprehensive AI courses from beginner to expert. Learn artificial intelligence through hands-on projects and real-world applications.'
}

export default async function CoursesPage() {
  // Mock data for initial deployment
  const courses = [
    new Course({
      id: new CourseId('course-1'),
      title: 'AI Foundations',
      description: 'Learn the fundamentals of artificial intelligence with hands-on projects.',
      slug: 'ai-foundations',
      price: new Money(29900, 'USD'),
      duration: new Duration(720, 'minutes'),
      difficulty: Difficulty.BEGINNER,
      published: true,
      featured: true,
      learningObjectives: ['Understand AI fundamentals', 'Build basic AI models'],
      prerequisites: ['Basic programming knowledge'],
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new Course({
      id: new CourseId('course-2'),
      title: 'Applied AI', 
      description: 'Build practical AI applications using modern tools and APIs.',
      slug: 'applied-ai',
      price: new Money(59900, 'USD'),
      duration: new Duration(900, 'minutes'),
      difficulty: Difficulty.INTERMEDIATE,
      published: true,
      featured: true,
      learningObjectives: ['Build AI applications', 'Use modern AI APIs'],
      prerequisites: ['Completed AI Foundations', 'Python knowledge'],
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  ]

  // Convert Course entities to plain objects for client component
  const coursesData = courses.map(course => ({
    id: { value: course.id.value },
    title: course.title,
    description: course.description,
    slug: course.slug,
    price: {
      amount: course.price.amount,
      currency: course.price.currency,
      formatted: course.price.formatUSD()
    },
    duration: {
      minutes: course.duration.minutes,
      formatted: course.duration.formatHumanReadable()
    },
    difficulty: course.difficulty,
    published: course.published,
    featured: course.featured,
    learningObjectives: course.learningObjectives,
    prerequisites: course.prerequisites,
    difficultyLevel: course.getDifficultyLevel()
  }))

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
            We're preparing amazing AI courses for you. Check back soon!
          </p>
        </div>
      )}
    </div>
  )
}