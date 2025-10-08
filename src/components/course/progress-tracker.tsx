'use client'

// Progress Tracker Component
// Displays course progress with lessons and checkpoints

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface Lesson {
  id: string
  title: string
  completed: boolean
  duration: number
  locked: boolean
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
  completed: boolean
}

interface ProgressTrackerProps {
  courseTitle: string
  modules: Module[]
  overallProgress: number
  onLessonClick?: (lessonId: string) => void
}

export function ProgressTracker({
  courseTitle,
  modules,
  overallProgress,
  onLessonClick
}: ProgressTrackerProps) {
  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0)
  const completedLessons = modules.reduce(
    (acc, module) => acc + module.lessons.filter(l => l.completed).length,
    0
  )

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>{courseTitle}</CardTitle>
          <CardDescription>
            {completedLessons} of {totalLessons} lessons completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-semibold">{overallProgress}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            {overallProgress === 100 && (
              <Badge variant="default" className="mt-2">
                <span className="mr-1">🎉</span> Course Completed!
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Module List */}
      <div className="space-y-4">
        {modules.map((module, moduleIndex) => {
          const moduleProgress = Math.round(
            (module.lessons.filter(l => l.completed).length / module.lessons.length) * 100
          )

          return (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      Module {moduleIndex + 1}: {module.title}
                    </CardTitle>
                    <CardDescription>
                      {module.lessons.filter(l => l.completed).length} / {module.lessons.length} lessons
                    </CardDescription>
                  </div>
                  {module.completed && (
                    <Badge variant="secondary" className="ml-2">
                      <span className="mr-1">✓</span> Completed
                    </Badge>
                  )}
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-primary/70 transition-all duration-300"
                    style={{ width: `${moduleProgress}%` }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lesson.id}>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              lesson.completed
                                ? 'bg-green-100 text-green-600'
                                : lesson.locked
                                ? 'bg-muted text-muted-foreground'
                                : 'bg-primary/10 text-primary'
                            }`}
                          >
                            {lesson.completed ? (
                              <span className="text-sm">✓</span>
                            ) : lesson.locked ? (
                              <span className="text-sm">🔒</span>
                            ) : (
                              <span className="text-xs font-semibold">{lessonIndex + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${lesson.locked ? 'text-muted-foreground' : ''}`}>
                              {lesson.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{lesson.duration} min</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={lesson.completed ? 'outline' : 'default'}
                          onClick={() => onLessonClick?.(lesson.id)}
                          disabled={lesson.locked}
                        >
                          {lesson.completed ? 'Review' : lesson.locked ? 'Locked' : 'Start'}
                        </Button>
                      </div>
                      {lessonIndex < module.lessons.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
