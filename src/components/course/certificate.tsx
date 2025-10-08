'use client'

// Certificate Component
// Displays and generates course completion certificates

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CertificateProps {
  studentName: string
  courseTitle: string
  completionDate: string
  certificateId: string
  instructorName?: string
}

export function Certificate({
  studentName,
  courseTitle,
  completionDate,
  certificateId,
  instructorName = 'AI Whisperers Team'
}: CertificateProps) {
  const handleDownload = () => {
    // TODO: Implement PDF generation
    console.log('Downloading certificate...')
  }

  const handleShare = () => {
    // TODO: Implement social sharing
    console.log('Sharing certificate...')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-4 border-primary/20 shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-primary/5 to-primary/10 pb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold mb-2">Certificate of Completion</h1>
          <p className="text-muted-foreground">AI Whisperers Learning Platform</p>
        </CardHeader>
        <CardContent className="p-12 text-center space-y-8">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              This certifies that
            </p>
            <h2 className="text-4xl font-bold text-primary">
              {studentName}
            </h2>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              has successfully completed the course
            </p>
            <h3 className="text-2xl font-semibold">
              {courseTitle}
            </h3>
          </div>

          <div className="flex items-center justify-center gap-16 py-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase mb-1">Completion Date</p>
              <p className="text-sm font-medium">{new Date(completionDate).toLocaleDateString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase mb-1">Certificate ID</p>
              <p className="text-sm font-medium font-mono">{certificateId}</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground mb-1">Instructor</p>
            <p className="font-semibold">{instructorName}</p>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Button onClick={handleDownload} size="lg">
              <span className="mr-2">📥</span> Download PDF
            </Button>
            <Button onClick={handleShare} variant="outline" size="lg">
              <span className="mr-2">🔗</span> Share
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Verify this certificate at aiwhisperers.com/verify/{certificateId}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
