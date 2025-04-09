import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FeaturedTrainers() {
  const trainers = [
    {
      id: 1,
      name: "John Davis",
      image: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?q=80&w=400&auto=format",
      sports: ["Basketball", "Track & Field"],
      location: "New York, NY",
      hours: "Mon-Fri, 7AM-7PM",
      price: 75,
      isNew: true,
      rating: 4.9,
      reviews: 124,
      specialty: "Shooting Coach",
    },
    {
      id: 2,
      name: "Sarah Miller",
      image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400&auto=format",
      sports: ["Mixed Martial Arts", "Boxing"],
      location: "Los Angeles, CA",
      hours: "Mon-Sat, 6AM-6PM",
      price: 65,
      isNew: true,
      rating: 4.8,
      reviews: 98,
      specialty: "Fighting Technique",
    },
    {
      id: 3,
      name: "Mike Thompson",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format",
      sports: ["Brazilian Jiu-jitsu", "Wrestling"],
      location: "Chicago, IL",
      hours: "Tue-Sun, 8AM-8PM",
      price: 90,
      isNew: true,
      rating: 4.7,
      reviews: 56,
      specialty: "Ground Work",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Trainers</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-300">Sort by:</span>
          <select className="text-sm border rounded p-1.5 bg-gray-800 border-gray-700 text-white flex-1 sm:flex-none">
            <option>Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {trainers.map((trainer) => (
          <Link href={`/trainers/${trainer.id}`} key={trainer.id} className="block group">
            <Card className="overflow-hidden transition-all hover:shadow-xl border-0 shadow-lg bg-gray-900 border-gray-800">
              <div className="relative h-72">
                <img
                  src={trainer.image || "/placeholder.svg"}
                  alt={trainer.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-0 right-0 p-2 flex gap-2">
                  {trainer.isNew && (
                    <Badge className="bg-blue-700 text-white">
                      <Star className="w-3 h-3 mr-1 fill-current" /> New
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-gray-900/80 backdrop-blur-sm rounded-full h-8 w-8 hover:bg-gray-800"
                  >
                    <Heart className="h-4 w-4 text-white" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <Badge className="bg-blue-700 text-white">{trainer.specialty}</Badge>
                </div>
              </div>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">{trainer.name}</h3>
                  <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-white">{trainer.rating}</span>
                    <span className="text-xs text-gray-400">({trainer.reviews})</span>
                  </div>
                </div>
                <p className="text-sm text-blue-400 font-medium mt-1">{trainer.sports.join(", ")}</p>
                <div className="flex items-center mt-3 text-sm text-gray-300">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {trainer.location}
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-300">
                  <Clock className="w-4 h-4 mr-1 text-gray-400" />
                  {trainer.hours}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-800">
                  <p className="font-bold text-lg text-white">
                    ${trainer.price} <span className="text-xs font-normal text-gray-400">/ hour</span>
                  </p>
                  <Button variant="outline" className="border-blue-700 text-blue-400 hover:bg-gray-800">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="outline" className="px-8 border-blue-700 text-blue-400 hover:bg-gray-800">
          View All Trainers
        </Button>
      </div>
    </div>
  )
}
