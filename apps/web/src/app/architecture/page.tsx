import { Metadata } from 'next'
import { getPageContent } from '@/lib/content/server-compiled'
import { ArchitecturePage } from '@/components/architecture/ArchitecturePage'

export const metadata: Metadata = {
  title: 'System Architecture | AI Whisperers',
  description: 'Interactive EC4RO-HGN architecture visualization showing our complete system design from deployment to implementation.',
  openGraph: {
    title: 'System Architecture - AI Whisperers',
    description: 'Explore our comprehensive system architecture using the EC4RO-HGN methodology.',
    type: 'website',
  },
}

export default async function Page() {
  const content = await getPageContent('architecture')
  
  return <ArchitecturePage content={content} />
}