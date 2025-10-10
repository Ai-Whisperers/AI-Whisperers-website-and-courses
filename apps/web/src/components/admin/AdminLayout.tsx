'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { useLocalizedRoutes } from '@/hooks/useLocalizedRoutes'
import { DynamicIcon } from '@/components/content/DynamicIcon'
import { useSecurityContext } from '@/contexts/security'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { routes } = useLocalizedRoutes()
  const { user } = useSecurityContext()

  const adminBase = routes.admin?.main || '/admin'
  const navItems = [
    { label: 'Dashboard', href: adminBase, icon: 'LayoutDashboard' },
    { label: 'Users', href: adminBase + '/users', icon: 'Users' },
    { label: 'Courses', href: adminBase + '/courses', icon: 'BookOpen' },
    { label: 'Content', href: adminBase + '/content', icon: 'FileText' },
    { label: 'Analytics', href: adminBase + '/analytics', icon: 'BarChart' },
    { label: 'Settings', href: adminBase + '/settings', icon: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <DynamicIcon name="Shield" className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user?.name || 'Administrator'}</p>
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
