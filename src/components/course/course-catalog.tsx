// Course Component: CourseCatalog
// Responsible for displaying a collection of courses with filtering

'use client'

import { useState } from 'react'
import { Course, Difficulty } from '@/domain/entities/course'
import { CourseCard } from './course-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface CourseCatalogProps {
  courses: Course[]
  onEnroll?: (courseId: string) => void
  showFilters?: boolean
  className?: string
}

type FilterType = 'all' | Difficulty

export function CourseCatalog({ 
  courses, 
  onEnroll, 
  showFilters = true,
  className = ''
}: CourseCatalogProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const filteredCourses = courses.filter(course => {
    if (activeFilter === 'all') return true
    return course.difficulty === activeFilter
  })

  const filterOptions = [
    { value: 'all' as const, label: 'All Courses', count: courses.length },
    { value: Difficulty.BEGINNER, label: 'Beginner', count: courses.filter(c => c.difficulty === Difficulty.BEGINNER).length },
    { value: Difficulty.INTERMEDIATE, label: 'Intermediate', count: courses.filter(c => c.difficulty === Difficulty.INTERMEDIATE).length },
    { value: Difficulty.ADVANCED, label: 'Advanced', count: courses.filter(c => c.difficulty === Difficulty.ADVANCED).length },
    { value: Difficulty.EXPERT, label: 'Expert', count: courses.filter(c => c.difficulty === Difficulty.EXPERT).length }
  ].filter(option => option.count > 0)

  return (
    <div className={`space-y-6 ${className}`}>
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(option => (
            <Button
              key={option.value}
              variant={activeFilter === option.value ? 'default' : 'outline'}
              onClick={() => setActiveFilter(option.value)}
              className="relative"
            >
              {option.label}
              <Badge 
                variant="secondary" 
                className="ml-2 px-1.5 py-0.5 text-xs"
              >
                {option.count}
              </Badge>
            </Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <CourseCard
            key={course.id.value}
            course={course}
            onEnroll={onEnroll}
            showEnrollButton={true}
          />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No courses found
          </h3>
          <p className="text-sm text-muted-foreground">
            {activeFilter === 'all' 
              ? 'No courses are currently available.' 
              : `No courses found for ${activeFilter.toLowerCase()} difficulty level.`
            }
          </p>
          {activeFilter !== 'all' && (
            <Button 
              variant="outline" 
              onClick={() => setActiveFilter('all')}
              className="mt-4"
            >
              View All Courses
            </Button>
          )}
        </div>
      )}
    </div>
  )
}