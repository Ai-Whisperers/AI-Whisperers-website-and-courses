// Course Component: CourseCard
// Single responsibility - display course information in card format

'use client'

import Link from 'next/link'
import { Course } from '@/domain/entities/course'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDuration, truncateText } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export interface CourseCardProps {
  course: Course
  showEnrollButton?: boolean
  onEnroll?: (courseId: string) => void
  className?: string
}

export function CourseCard({ 
  course, 
  showEnrollButton = true, 
  onEnroll,
  className 
}: CourseCardProps) {
  const handleEnrollClick = () => {
    if (onEnroll) {
      onEnroll(course.id.value)
    }
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
    <Card className={`h-full flex flex-col transition-shadow hover:shadow-lg ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className={getDifficultyColor(course.difficulty)}>
            {course.getDifficultyLevel()}
          </Badge>
          {course.featured && (
            <Badge variant="secondary">Featured</Badge>
          )}
        </div>
        
        <CardTitle className="line-clamp-2">
          <Link 
            href={`/courses/${course.slug}`}
            className="hover:text-primary transition-colors"
          >
            {course.title}
          </Link>
        </CardTitle>
        
        <CardDescription className="line-clamp-3">
          {truncateText(course.description, 150)}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatDuration(course.duration.minutes)}</span>
            <span className="font-semibold text-primary">
              {course.isFree() ? 'Free' : formatCurrency(course.price.amount)}
            </span>
          </div>

          {course.learningObjectives.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">What you'll learn:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {course.learningObjectives.slice(0, 3).map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    {truncateText(objective, 80)}
                  </li>
                ))}
                {course.learningObjectives.length > 3 && (
                  <li className="text-xs italic">
                    +{course.learningObjectives.length - 3} more objectives
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <div className="w-full space-y-2">
          {showEnrollButton && course.canEnroll() && (
            <Button 
              onClick={handleEnrollClick}
              className="w-full"
              size="lg"
            >
              {course.isFree() ? 'Enroll Free' : `Enroll for ${formatCurrency(course.price.amount)}`}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            asChild 
            className="w-full"
          >
            <Link href={`/courses/${course.slug}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}