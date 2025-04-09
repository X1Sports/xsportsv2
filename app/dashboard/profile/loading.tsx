import { Loader2 } from "lucide-react"

export default function ProfileLoading() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading your profile...</p>
      </div>
    </div>
  )
}
