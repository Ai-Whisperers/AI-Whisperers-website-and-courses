'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { useLocalizedRoutes } from '@/hooks/useLocalizedRoutes'
import { DynamicIcon } from '@/components/content/DynamicIcon'
import { useSecurityContext } from '@/contexts/security'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { routes } = useLocalizedRoutes()
  const { user } = useSecurityContext()

  const dashboardBase = routes.protected.dashboard
  const navItems = [
    { label: 'Overview', href: dashboardBase, icon: 'LayoutDashboard' },
    { label: 'My Courses', href: dashboardBase + '/courses', icon: 'BookOpen' },
    { label: 'Progress', href: dashboardBase + '/progress', icon: 'TrendingUp' },
    { label: 'Achievements', href: dashboardBase + '/achievements', icon: 'Award' },
    { label: 'Settings', href: dashboardBase + '/settings', icon: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || 'User'}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {user?.name || 'User'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Student</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <DynamicIcon name={item.icon} className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
