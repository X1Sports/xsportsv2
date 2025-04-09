import { Skeleton } from "@/components/ui/skeleton"

export default function EditProfileLoading() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="mb-8">
        <Skeleton className="h-12 w-full" />
      </div>

      <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: "#333333" }}>
        <Skeleton className="h-8 w-48 mb-6 bg-gray-700" />

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
            <Skeleton className="h-4 w-48 bg-gray-700" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
            <Skeleton className="h-4 w-48 bg-gray-700" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <Skeleton className="h-5 w-24 bg-gray-700" />
          <Skeleton className="h-10 w-full bg-gray-700" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-5 w-24 bg-gray-700" />
          <Skeleton className="h-32 w-full bg-gray-700" />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}
