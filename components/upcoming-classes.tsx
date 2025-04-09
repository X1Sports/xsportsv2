import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Users, Clock, Calendar, CheckCircle } from "lucide-react"

export function UpcomingClasses() {
  const classes = [
    {
      id: 1,
      title: "Group Training Session",
      description: "Build strength and conditioning with our expert trainers in a motivating group environment.",
      date: "Mar 15 at 10:00 AM",
      duration: "60 mins",
      spotsRemaining: 5,
      price: 30,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500&auto=format",
      features: ["Live instruction & feedback", "Recording available after class"],
    },
    {
      id: 2,
      title: "Advanced Techniques Workshop",
      description: "Refine your skills with advanced training techniques designed for competitive athletes.",
      date: "Mar 17 at 2:00 PM",
      duration: "90 mins",
      spotsRemaining: 3,
      price: 45,
      image: "https://images.unsplash.com/photo-1518644961665-ed172691aaa1?q=80&w=500&auto=format",
      features: ["Live instruction & feedback", "Recording available after class"],
    },
    {
      id: 3,
      title: "Recovery & Mobility Session",
      description: "Learn essential recovery techniques to prevent injury and improve athletic performance.",
      date: "Mar 20 at 9:00 AM",
      duration: "75 mins",
      spotsRemaining: 8,
      price: 35,
      image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=500&auto=format",
      features: ["Live instruction & feedback", "Recording available after class"],
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Upcoming Live Classes</h2>
        <Button variant="outline" className="gap-2 border-gray-700 text-white hover:bg-gray-800 w-full sm:w-auto">
          <Calendar className="h-4 w-4" />
          Filter Classes
        </Button>
      </div>

      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <Card
            key={classItem.id}
            className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow group bg-gray-900 border-gray-800"
          >
            <div className="relative h-48">
              <img
                src={classItem.image || "/placeholder.svg"}
                alt={classItem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-bold">{classItem.title}</h3>
                <p className="text-white/80 text-sm mt-1">{classItem.date}</p>
              </div>
            </div>
            <CardContent className="p-5">
              <p className="text-sm text-gray-300 line-clamp-2">{classItem.description}</p>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1 text-sm bg-gray-800 px-2 py-1 rounded-md text-white">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>{classItem.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-sm bg-gray-800 px-2 py-1 rounded-md text-white">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>{classItem.spotsRemaining} spots left</span>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {classItem.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 mr-2 text-blue-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-5 pt-0">
              <p className="font-bold text-lg text-white">${classItem.price}</p>
              <Button className="px-6 bg-blue-700 hover:bg-blue-600 text-white">Join Class</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
