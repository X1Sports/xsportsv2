import { Loader2 } from "lucide-react"

export default function SettingsLoading() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  )
}
