// Course Component: CourseCatalog
// Responsible for displaying a collection of courses with filtering

'use client'

import { useState, useMemo } from 'react'
import { Course, Difficulty } from '@/domain/entities/course'

// Type for plain course data that can be serialized
type CourseData = {
  id: { value: string }
  title: string
  description: string
  slug: string
  price: {
    amount: number
    currency: string
    formatted: string
  }
  duration: {
    minutes: number
    formatted: string
  }
  difficulty: Difficulty
  published: boolean
  featured: boolean
  learningObjectives: string[]
  prerequisites: string[]
  difficultyLevel: string
}
import { CourseCard } from './course-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export interface CourseCatalogProps {
  courses: CourseData[]
  onEnroll?: (courseId: string) => void
  showFilters?: boolean
  className?: string
}

type FilterType = 'all' | Difficulty
type PriceFilter = 'all' | 'free' | 'paid'

export function CourseCatalog({
  courses,
  onEnroll,
  showFilters = true,
  className = ''
}: CourseCatalogProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Difficulty filter
      if (activeFilter !== 'all' && course.difficulty !== activeFilter) {
        return false
      }

      // Price filter
      if (priceFilter === 'free' && course.price.amount > 0) {
        return false
      }
      if (priceFilter === 'paid' && course.price.amount === 0) {
        return false
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return (
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.learningObjectives.some(obj => obj.toLowerCase().includes(query))
        )
      }

      return true
    })
  }, [courses, activeFilter, priceFilter, searchQuery])

  const difficultyOptions = [
    { value: 'all' as const, label: 'All Levels', count: courses.length },
    { value: Difficulty.BEGINNER, label: 'Beginner', count: courses.filter(c => c.difficulty === Difficulty.BEGINNER).length },
    { value: Difficulty.INTERMEDIATE, label: 'Intermediate', count: courses.filter(c => c.difficulty === Difficulty.INTERMEDIATE).length },
    { value: Difficulty.ADVANCED, label: 'Advanced', count: courses.filter(c => c.difficulty === Difficulty.ADVANCED).length },
    { value: Difficulty.EXPERT, label: 'Expert', count: courses.filter(c => c.difficulty === Difficulty.EXPERT).length }
  ].filter(option => option.count > 0)

  const priceOptions = [
    { value: 'all' as const, label: 'All Prices', count: courses.length },
    { value: 'free' as const, label: 'Free', count: courses.filter(c => c.price.amount === 0).length },
    { value: 'paid' as const, label: 'Paid', count: courses.filter(c => c.price.amount > 0).length }
  ].filter(option => option.count > 0)

  const handleResetFilters = () => {
    setActiveFilter('all')
    setPriceFilter('all')
    setSearchQuery('')
  }

  const hasActiveFilters = activeFilter !== 'all' || priceFilter !== 'all' || searchQuery.trim() !== ''

  return (
    <div className={`space-y-6 ${className}`}>
      {showFilters && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Input
              type="search"
              placeholder="Search courses by title, description, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <Separator />

          {/* Difficulty Filters */}
          <div>
            <h3 className="text-sm font-medium mb-3">Difficulty Level</h3>
            <div className="flex flex-wrap gap-2">
              {difficultyOptions.map(option => (
                <Button
                  key={option.value}
                  variant={activeFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(option.value)}
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
          </div>

          {/* Price Filters */}
          <div>
            <h3 className="text-sm font-medium mb-3">Price</h3>
            <div className="flex flex-wrap gap-2">
              {priceOptions.map(option => (
                <Button
                  key={option.value}
                  variant={priceFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriceFilter(option.value)}
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
          </div>

          {/* Active Filters & Results */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <strong>{filteredCourses.length}</strong> of <strong>{courses.length}</strong> courses
            </p>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
              >
                Clear all filters
              </Button>
            )}
          </div>
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