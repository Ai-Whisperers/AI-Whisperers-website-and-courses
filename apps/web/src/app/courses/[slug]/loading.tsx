export default function CourseLoading() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="h-4 bg-muted animate-pulse rounded-md w-32"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-6 bg-muted animate-pulse rounded-md w-24"></div>
                <div className="h-6 bg-muted animate-pulse rounded-md w-20"></div>
              </div>
              <div className="h-10 bg-muted animate-pulse rounded-md w-3/4"></div>
              <div className="h-5 bg-muted animate-pulse rounded-md w-full"></div>
              <div className="h-5 bg-muted animate-pulse rounded-md w-5/6"></div>
            </div>

            <div className="space-y-3">
              <div className="h-6 bg-muted animate-pulse rounded-md w-48"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-muted animate-pulse rounded-md"></div>
              ))}
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded-md w-32 mx-auto"></div>
              <div className="h-4 bg-muted animate-pulse rounded-md w-48 mx-auto"></div>
              <div className="border-t pt-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-muted animate-pulse rounded-md w-20"></div>
                    <div className="h-4 bg-muted animate-pulse rounded-md w-24"></div>
                  </div>
                ))}
              </div>
              <div className="h-12 bg-muted animate-pulse rounded-md w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
