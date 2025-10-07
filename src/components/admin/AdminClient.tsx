'use client'

import { useEffect, useState } from 'react'
import { useLocalizedContent } from '@/hooks/use-localized-content'
import { AdminLayout } from './AdminLayout'
import { StatsCard } from '../dashboard/StatsCard'
import type { LocalizedContent, PageContent } from '@/types/content'

interface AdminClientProps {
  localizedContent: LocalizedContent<PageContent>
}

export function AdminClient({ localizedContent }: AdminClientProps) {
  const content = useLocalizedContent(localizedContent)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats')
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to load admin stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading admin panel...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const hero = content.hero as any
  const statsConfig = content.stats as any

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {hero?.title || 'Admin Dashboard'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{hero?.subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            label={statsConfig?.metrics?.[0]?.label || 'Total Users'}
            value={stats?.totalUsers || 0}
            icon="Users"
            color="blue"
          />
          <StatsCard
            label={statsConfig?.metrics?.[1]?.label || 'Active Courses'}
            value={stats?.activeCourses || 0}
            icon="BookOpen"
            color="green"
          />
          <StatsCard
            label={statsConfig?.metrics?.[2]?.label || 'Total Revenue'}
            value={`$${stats?.totalRevenue || 0}`}
            icon="DollarSign"
            color="purple"
          />
          <StatsCard
            label={statsConfig?.metrics?.[3]?.label || 'Completion Rate'}
            value={`${stats?.completionRate || 0}%`}
            icon="TrendingUp"
            color="orange"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Admin panel foundation is ready. Additional features can be implemented as needed.
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
