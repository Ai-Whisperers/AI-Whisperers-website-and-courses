// Dashboard Page
// Protected route - requires authentication

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
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
  const session = await getServerSession(authOptions)

  // Redirect to signin if not authenticated
  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard')
  }

  // Load localized content
  const localizedContent = await getLocalizedPageContent('dashboard')

  return <DashboardClient localizedContent={localizedContent} />
}
