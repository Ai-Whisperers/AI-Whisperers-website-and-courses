'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { DynamicIcon } from '@/components/content/DynamicIcon'
import { Button } from '@/components/ui/button'

interface Course {
  id: string
  title: string
  description: string
  progress: number
  thumbnail?: string
  instructor: string
  nextLesson?: string
}

interface CoursesEnrolledProps {
  courses: Course[]
  emptyMessage: string
  ctaText: string
  ctaHref: string
  continueLabel: string
  progressLabel: string
}

export function CoursesEnrolled({ 
  courses, 
  emptyMessage, 
  ctaText, 
  ctaHref,
  continueLabel,
  progressLabel 
}: CoursesEnrolledProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <DynamicIcon name="BookOpen" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">{emptyMessage}</p>
        <Button asChild>
          <Link href={ctaHref}>{ctaText}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, index) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-6">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {course.instructor}
            </p>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">{progressLabel}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {course.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            <Button className="w-full" asChild>
              <Link href={`/courses/${course.id}`}>
                {continueLabel}
              </Link>
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
