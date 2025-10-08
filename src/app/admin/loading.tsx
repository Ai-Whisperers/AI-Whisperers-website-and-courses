// Admin Panel Loading State
// Displays while admin panel is being loaded

export default function AdminLoading() {
  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded-md animate-pulse w-48" />
            <div className="h-4 bg-muted rounded-md animate-pulse w-64" />
          </div>
          <div className="h-10 bg-muted rounded-md animate-pulse w-32" />
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-2 border-b border-border pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-muted rounded-md animate-pulse w-24" />
          ))}
        </div>

        {/* Content area skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-muted rounded-md animate-pulse w-32" />
            <div className="h-10 bg-muted rounded-md animate-pulse w-40" />
          </div>

          {/* Table skeleton */}
          <div className="border rounded-lg">
            <div className="p-4 border-b bg-muted/50">
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-muted rounded-md animate-pulse" />
                ))}
              </div>
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 border-b">
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 bg-muted rounded-md animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
