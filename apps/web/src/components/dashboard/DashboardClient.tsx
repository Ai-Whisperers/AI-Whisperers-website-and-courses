'use client'

import { useEffect, useState } from 'react'
import { useLocalizedContent } from '@/hooks/use-localized-content'
import { DashboardLayout } from './DashboardLayout'
import { StatsCard } from './StatsCard'
import { CoursesEnrolled } from './CoursesEnrolled'
import { RecentActivity } from './RecentActivity'
import { useSecurityContext } from '@/contexts/security'
import type { LocalizedContent, PageContent } from '@/types/content'

interface DashboardClientProps {
  localizedContent: LocalizedContent<PageContent>
}

export function DashboardClient({ localizedContent }: DashboardClientProps) {
  const content = useLocalizedContent(localizedContent)
  const { user } = useSecurityContext()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/user/dashboard')
        const data = await res.json()
        setDashboardData(data)
      } catch (error) {
        console.error('Failed to load dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const hero = content.hero as any
  const overview = content.overview as any
  const courses = content.courses as any
  const recentActivity = content.recent_activity as any

  const stats = dashboardData?.stats || {
    coursesEnrolled: 0,
    hoursLearned: 0,
    achievements: 0,
    currentStreak: 0,
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {hero?.greeting}, {user?.name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{hero?.subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            label={overview?.stats?.[0]?.label || 'Courses Enrolled'}
            value={stats.coursesEnrolled}
            icon="BookOpen"
            color="blue"
          />
          <StatsCard
            label={overview?.stats?.[1]?.label || 'Hours Learned'}
            value={stats.hoursLearned}
            icon="Clock"
            color="green"
          />
          <StatsCard
            label={overview?.stats?.[2]?.label || 'Achievements'}
            value={stats.achievements}
            icon="Award"
            color="purple"
          />
          <StatsCard
            label={overview?.stats?.[3]?.label || 'Current Streak'}
            value={`${stats.currentStreak} days`}
            icon="Flame"
            color="orange"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {courses?.title || 'My Courses'}
            </h2>
            <CoursesEnrolled
              courses={dashboardData?.enrolledCourses || []}
              emptyMessage={courses?.empty?.message || 'No courses enrolled'}
              ctaText={courses?.empty?.cta?.text || 'Browse Courses'}
              ctaHref={courses?.empty?.cta?.href || '/courses'}
              continueLabel={courses?.continue_learning || 'Continue Learning'}
              progressLabel={courses?.progress_label || 'Progress'}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {recentActivity?.title || 'Recent Activity'}
            </h2>
            <RecentActivity
              activities={dashboardData?.recentActivity || []}
              emptyMessage={recentActivity?.empty || 'No recent activity'}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
