'use client'

import { motion } from 'framer-motion'
import { DynamicIcon } from '@/components/content/DynamicIcon'

interface Activity {
  id: string
  type: 'lesson_completed' | 'quiz_passed' | 'certificate_earned' | 'course_enrolled'
  title: string
  courseName: string
  timestamp: string
}

interface RecentActivityProps {
  activities: Activity[]
  emptyMessage: string
}

const activityIcons = {
  lesson_completed: 'CheckCircle',
  quiz_passed: 'Award',
  certificate_earned: 'Trophy',
  course_enrolled: 'BookOpen',
}

const activityColors = {
  lesson_completed: 'text-green-600',
  quiz_passed: 'text-blue-600',
  certificate_earned: 'text-purple-600',
  course_enrolled: 'text-orange-600',
}

export function RecentActivity({ activities, emptyMessage }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 dark:text-gray-400">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className={`mt-1 ${activityColors[activity.type]}`}>
            <DynamicIcon name={activityIcons[activity.type]} className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{activity.courseName}</p>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {activity.timestamp}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
