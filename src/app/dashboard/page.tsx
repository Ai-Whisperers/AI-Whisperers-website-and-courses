/**
 * Dashboard Page
 * Protected route - requires authentication
 *
 * PHASE 0.6C: Migrated to NextAuth v5
 * - Replaced getServerSession(authOptions) with auth()
 */

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/auth.config'
import { getLocalizedPageContent } from '@/lib/content/server-compiled'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export const metadata = {
  title: 'Dashboard | AI Whisperers',
  description: 'Your personal learning dashboard',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DashboardPage() {
  const session = await auth()

  // Redirect to signin if not authenticated
  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard')
  }

  // Load localized content
  const localizedContent = await getLocalizedPageContent('dashboard')

  return <DashboardClient localizedContent={localizedContent} />
}
