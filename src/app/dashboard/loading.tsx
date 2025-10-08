// Dashboard Loading State
// Displays while dashboard is being loaded

export default function DashboardLoading() {
  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded-md animate-pulse w-1/3" />
          <div className="h-4 bg-muted rounded-md animate-pulse w-1/4" />
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border rounded-lg space-y-3">
              <div className="h-4 bg-muted rounded-md animate-pulse w-1/2" />
              <div className="h-8 bg-muted rounded-md animate-pulse w-2/3" />
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded-md animate-pulse w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 border rounded-lg space-y-3">
                <div className="h-32 bg-muted rounded-md animate-pulse" />
                <div className="h-4 bg-muted rounded-md animate-pulse" />
                <div className="h-4 bg-muted rounded-md animate-pulse w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
