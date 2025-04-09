import { Skeleton } from "@/components/ui/skeleton"

export default function BookingsLoading() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-10 w-40 mt-4 md:mt-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-10 w-64 mb-6" />

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow-md" style={{ backgroundColor: "#333333" }}>
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 md:w-1/4" style={{ backgroundColor: "#444444" }}>
                    <Skeleton className="h-6 w-16 mb-2 mx-auto" />
                    <Skeleton className="h-10 w-10 mb-2 mx-auto" />
                    <Skeleton className="h-6 w-16 mb-2 mx-auto" />
                    <Skeleton className="h-6 w-20 mx-auto" />
                  </div>

                  <div className="p-6 md:w-3/4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div className="w-full md:w-2/3">
                        <Skeleton className="h-7 w-48 mb-4" />
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-5 w-36" />
                      </div>

                      <div className="mt-4 md:mt-0 flex flex-col gap-2 w-full md:w-1/3">
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="rounded-lg shadow-md p-4 mb-6" style={{ backgroundColor: "#333333" }}>
            <Skeleton className="h-7 w-32 mb-2" />
            <Skeleton className="h-5 w-48 mb-4" />
            <Skeleton className="h-64 w-full mb-4" />
            <Skeleton className="h-6 w-24 mb-2" />
            <div className="space-y-2">
              <div className="flex items-center">
                <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center">
                <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>

          <div className="rounded-lg shadow-md p-4" style={{ backgroundColor: "#333333" }}>
            <Skeleton className="h-7 w-36 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
