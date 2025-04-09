import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Play } from "lucide-react"

export function TrainingHighlights() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="relative aspect-video overflow-hidden rounded-xl shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=800&auto=format"
          alt="Training session"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center justify-center w-20 h-20 bg-white/90 rounded-full shadow-lg cursor-pointer hover:bg-white transition-colors">
            <Play className="w-10 h-10 text-blue-600 ml-1" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <h3 className="text-xl font-bold">Advanced Training Techniques</h3>
          <p className="text-white/80 text-sm">Duration: 6:42</p>
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-gray-900 border-gray-800">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-white">Latest Training Session</h2>
          <p className="mt-4 text-white">
            Watch highlights from our recent training sessions and see the techniques and methods we use to help
            athletes achieve their goals. Our comprehensive approach combines strength training, skill development, and
            mental preparation.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-400" />
              <div>
                <h4 className="font-semibold text-white">Advanced Techniques</h4>
                <p className="text-sm text-gray-300">Pro-level drills for experienced athletes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-400" />
              <div>
                <h4 className="font-semibold text-white">Form Correction</h4>
                <p className="text-sm text-gray-300">Precise adjustments for optimal performance</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-400" />
              <div>
                <h4 className="font-semibold text-white">Mental Conditioning</h4>
                <p className="text-sm text-gray-300">Strategies to build focus and resilience</p>
              </div>
            </div>
          </div>

          <Button className="w-full mt-8 bg-blue-700 hover:bg-blue-600 text-white">Browse All Training Videos</Button>
        </CardContent>
      </Card>
    </div>
  )
}
