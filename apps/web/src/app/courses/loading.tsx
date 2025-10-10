export default function CoursesLoading() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="h-12 bg-muted animate-pulse rounded-md w-64 mx-auto mb-4"></div>
        <div className="h-6 bg-muted animate-pulse rounded-md w-96 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            <div className="h-6 bg-muted animate-pulse rounded-md w-3/4"></div>
            <div className="h-4 bg-muted animate-pulse rounded-md"></div>
            <div className="h-4 bg-muted animate-pulse rounded-md w-5/6"></div>
            <div className="flex gap-2 pt-4">
              <div className="h-8 bg-muted animate-pulse rounded-md w-20"></div>
              <div className="h-8 bg-muted animate-pulse rounded-md w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
