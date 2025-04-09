import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-48 bg-gray-700" />
          <Skeleton className="h-4 w-64 mt-2 bg-gray-700" />
        </div>
        <Skeleton className="h-10 w-[180px] bg-gray-700" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-[300px] bg-gray-700" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-4">
                <Skeleton className="h-5 w-24 bg-gray-700" />
                <Skeleton className="h-8 w-20 bg-gray-700" />
                <Skeleton className="h-4 w-32 bg-gray-700" />
                <Skeleton className="h-[80px] w-full bg-gray-700" />
              </div>
            ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-4">
            <Skeleton className="h-6 w-40 bg-gray-700" />
            <Skeleton className="h-4 w-56 bg-gray-700" />
            <Skeleton className="h-[300px] w-full bg-gray-700" />
          </div>

          <div className="col-span-3 bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-4">
            <Skeleton className="h-6 w-40 bg-gray-700" />
            <Skeleton className="h-4 w-56 bg-gray-700" />
            <Skeleton className="h-[300px] w-full bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  )
}
