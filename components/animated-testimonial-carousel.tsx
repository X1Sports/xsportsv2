"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

type Testimonial = {
  id: number
  name: string
  role: string
  avatar: string
  rating: number
  text: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Michael Johnson",
    role: "College Basketball Player",
    avatar: "/placeholder.svg?height=60&width=60&text=MJ",
    rating: 5,
    text: "Working with my X:1 trainer has completely transformed my game. My shooting percentage has improved by 15% and my defensive footwork is at a whole new level.",
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "High School Soccer Player",
    avatar: "/placeholder.svg?height=60&width=60&text=SW",
    rating: 5,
    text: "I've been training with Coach Miller for 6 months and have already received three college scholarship offers. The personalized training program made all the difference.",
  },
  {
    id: 3,
    name: "David Chen",
    role: "Amateur MMA Fighter",
    avatar: "/placeholder.svg?height=60&width=60&text=DC",
    rating: 4,
    text: "The specialized MMA training I received helped me win my last three fights. My striking technique and ground game have improved tremendously.",
  },
  {
    id: 4,
    name: "Jessica Rodriguez",
    role: "Track & Field Athlete",
    avatar: "/placeholder.svg?height=60&width=60&text=JR",
    rating: 5,
    text: "After just 3 months of training, I shaved 2 seconds off my 400m time. My trainer's focus on technique and conditioning was exactly what I needed.",
  },
]

export function AnimatedTestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<"left" | "right">("right")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    if (isAnimating) return
    setDirection("right")
    setIsAnimating(true)
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setDirection("left")
    setIsAnimating(true)
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-advance slides
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      nextSlide()
    }, 6000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [activeIndex, isAnimating])

  // Reset animation state after transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [activeIndex])

  return (
    <div className="relative overflow-hidden py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">What Our Athletes Say</h2>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${activeIndex * 100}%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-white">{testimonial.name}</h3>
                          <p className="text-sm text-gray-400">{testimonial.role}</p>
                          <div className="flex mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 italic">"{testimonial.text}"</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800 z-10"
            onClick={prevSlide}
            disabled={isAnimating}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800 z-10"
            onClick={nextSlide}
            disabled={isAnimating}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === activeIndex ? "bg-blue-600" : "bg-gray-600"
                }`}
                onClick={() => {
                  if (isAnimating) return
                  setDirection(index > activeIndex ? "right" : "left")
                  setIsAnimating(true)
                  setActiveIndex(index)
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
