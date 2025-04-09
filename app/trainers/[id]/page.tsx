"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  MessageCircle,
  MapPin,
  Clock,
  Star,
  Check,
  Award,
  Play,
  Share2,
  Heart,
  CheckCircle,
  Clock8,
  Users,
  Trophy,
  ThumbsUp,
  Loader2,
} from "lucide-react"
import { format, isSameDay } from "date-fns"
import { FaBasketballBall, FaRunning, FaUniversity, FaRegCalendarCheck } from "react-icons/fa"
import { Calendar } from "@/components/ui/calendar"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function TrainerProfile({ params }: { params: { id: string } }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [trainer, setTrainer] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        setLoading(true)
        // Fetch the trainer data from Firestore
        const trainerDoc = await getDoc(doc(db, "trainers", params.id))

        if (trainerDoc.exists()) {
          const data = trainerDoc.data()

          // Merge the fetched data with default values for any missing fields
          setTrainer({
            id: params.id,
            name: data.name || "Unknown Trainer",
            title: data.title || data.specialty || "Trainer",
            level: data.level || "Professional",
            levelScore: data.levelScore || 85,
            sports: data.sports || [],
            divisions: data.divisions || [],
            location: data.location || "Location not specified",
            hours: data.hours || data.availability?.hours || "Hours not specified",
            price: data.price || 50,
            description: data.description || "Professional trainer",
            features: data.features || ["1-hour personalized session", "Training plan"],
            packages: data.packages || [
              { name: "Single", price: data.price || 50, isActive: true, description: "Single training session" },
            ],
            bio: data.bio || "No bio provided",
            philosophy: data.philosophy || "",
            education: data.education || [],
            certifications: data.certifications || [],
            experience: data.experience || [],
            accomplishments: data.accomplishments || [],
            awards: data.awards || [],
            videos: data.videos || [],
            rating: data.rating || 4.5,
            reviewCount: data.reviewCount || 0,
            reviews: data.reviews || [],
            availability: data.availability || {
              timeSlots: [{ day: new Date(), slots: ["9:00 AM", "11:00 AM", "2:00 PM"] }],
            },
            headerImageURL:
              data.headerImageURL ||
              "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1920&auto=format",
            profileImageURL:
              data.profileImageURL ||
              data.photoURL ||
              "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?q=80&w=400&auto=format",
          })
        } else {
          // If no data found, use mock data
          toast({
            title: "Trainer not found",
            description: "Using sample data instead",
            variant: "destructive",
          })

          // Use mock data similar to what was previously hardcoded
          setTrainer({
            id: params.id,
            name: "John Davis",
            title: "Elite Performance Coach",
            level: "Professional",
            levelScore: 95,
            sports: ["Basketball", "Track & Field"],
            divisions: ["Division I", "Division I"],
            location: "New York, NY",
            hours: "Mon-Fri, 7AM-7PM",
            price: 75,
            description: "Perfect for trying out or occasional training",
            features: ["1-hour personalized session", "Video analysis", "Training plan"],
            packages: [
              {
                name: "Single",
                price: 75,
                isActive: true,
                description: "Perfect for trying out or occasional training",
              },
              { name: "5 Pack", price: 350, isActive: false, description: "Save $25 with our 5 session package" },
              { name: "10 Pack", price: 650, isActive: false, description: "Our best value - save $100" },
            ],
            bio: "John Davis is a certified professional trainer with over 10 years of experience working with athletes of all levels. Specializing in basketball and track & field, John has helped numerous athletes reach their full potential and achieve their goals.",
            philosophy:
              "His training philosophy focuses on developing fundamental skills, improving athletic performance, and building mental toughness. Each session is tailored to the individual athlete's needs and goals.",
            education: [
              "B.S. in Exercise Science, University of Michigan",
              "M.S. in Sports Performance, Ohio State University",
            ],
            certifications: [
              "NSCA Certified Strength and Conditioning Specialist",
              "USA Track & Field Level 2 Coach",
              "USA Basketball Gold License",
            ],
            experience: [
              { role: "Assistant Coach", organization: "New York University", period: "2018-2022" },
              { role: "Performance Coach", organization: "Elite Athletics Academy", period: "2015-2018" },
            ],
            accomplishments: [
              "Coached 12+ athletes to Division I scholarships",
              "Developed training programs for 3 NBA draft picks",
              "Published author in Journal of Strength and Conditioning Research",
              "Featured speaker at National Coaching Conference 2023",
            ],
            awards: [
              { title: "Coach of the Year", organization: "NYC Basketball Association", year: "2021" },
              {
                title: "Excellence in Athletic Development",
                organization: "Sports Performance Institute",
                year: "2019",
              },
            ],
            videos: [
              {
                id: 1,
                title: "Advanced Shooting Techniques",
                thumbnail: "https://images.unsplash.com/photo-1546519638-68e109acd27d?q=80&w=400&auto=format",
                duration: "12:45",
              },
              {
                id: 2,
                title: "Explosive Speed Training",
                thumbnail: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=400&auto=format",
                duration: "8:30",
              },
              {
                id: 3,
                title: "Basketball Footwork Drills",
                thumbnail: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format",
                duration: "15:20",
              },
            ],
            rating: 4.9,
            reviewCount: 124,
            reviews: [
              {
                id: 1,
                author: "Michael J.",
                avatar: "/placeholder.svg?height=40&width=40&text=MJ",
                rating: 5,
                text: "John is an exceptional trainer. His attention to detail and personalized approach helped me improve my game significantly in just a few sessions.",
              },
              {
                id: 2,
                author: "Sarah T.",
                avatar: "/placeholder.svg?height=40&width=40&text=ST",
                rating: 5,
                text: "Working with John has been transformative for my track performance. His knowledge and coaching style are top-notch.",
              },
              {
                id: 3,
                author: "David K.",
                avatar: "/placeholder.svg?height=40&width=40&text=DK",
                rating: 4,
                text: "Great coach who really understands how to develop athletes. My only wish is that he had more availability on weekends.",
              },
            ],
            availability: {
              timeSlots: [
                // Current dates (using dynamic dates relative to today)
                { day: new Date(Date.now()), slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"] },
                {
                  day: new Date(Date.now() + 86400000),
                  slots: ["8:00 AM", "10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
                },
                { day: new Date(Date.now() + 86400000 * 2), slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
                { day: new Date(Date.now() + 86400000 * 3), slots: ["8:00 AM", "10:00 AM", "1:00 PM", "3:00 PM"] },
                { day: new Date(Date.now() + 86400000 * 4), slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"] },
                { day: new Date(Date.now() + 86400000 * 5), slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
                { day: new Date(Date.now() + 86400000 * 6), slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },

                // Next week
                {
                  day: new Date(Date.now() + 86400000 * 7),
                  slots: ["8:00 AM", "10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
                },
                { day: new Date(Date.now() + 86400000 * 8), slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
                { day: new Date(Date.now() + 86400000 * 9), slots: ["8:00 AM", "10:00 AM", "1:00 PM", "3:00 PM"] },
                { day: new Date(Date.now() + 86400000 * 10), slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"] },
                { day: new Date(Date.now() + 86400000 * 11), slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
                { day: new Date(Date.now() + 86400000 * 12), slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
                { day: new Date(Date.now() + 86400000 * 13), slots: ["8:00 AM", "10:00 AM", "1:00 PM", "3:00 PM"] },

                // Two weeks from now
                { day: new Date(Date.now() + 86400000 * 14), slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"] },
                {
                  day: new Date(Date.now() + 86400000 * 15),
                  slots: ["8:00 AM", "10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
                },
                { day: new Date(Date.now() + 86400000 * 16), slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
              ],
            },
            headerImageURL: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1920&auto=format",
            profileImageURL: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?q=80&w=400&auto=format",
          })
        }
      } catch (error) {
        console.error("Error fetching trainer data:", error)
        toast({
          title: "Error",
          description: "Failed to load trainer data. Using sample data instead.",
          variant: "destructive",
        })

        // Use mock data as fallback
        setTrainer({
          id: params.id,
          name: "John Davis",
          title: "Elite Performance Coach",
          // ... (same mock data as above)
          level: "Professional",
          levelScore: 95,
          sports: ["Basketball", "Track & Field"],
          divisions: ["Division I", "Division I"],
          location: "New York, NY",
          hours: "Mon-Fri, 7AM-7PM",
          price: 75,
          description: "Perfect for trying out or occasional training",
          features: ["1-hour personalized session", "Video analysis", "Training plan"],
          packages: [
            {
              name: "Single",
              price: 75,
              isActive: true,
              description: "Perfect for trying out or occasional training",
            },
            { name: "5 Pack", price: 350, isActive: false, description: "Save $25 with our 5 session package" },
            { name: "10 Pack", price: 650, isActive: false, description: "Our best value - save $100" },
          ],
          bio: "John Davis is a certified professional trainer with over 10 years of experience working with athletes of all levels. Specializing in basketball and track & field, John has helped numerous athletes reach their full potential and achieve their goals.",
          philosophy:
            "His training philosophy focuses on developing fundamental skills, improving athletic performance, and building mental toughness. Each session is tailored to the individual athlete's needs and goals.",
          education: [
            "B.S. in Exercise Science, University of Michigan",
            "M.S. in Sports Performance, Ohio State University",
          ],
          certifications: [
            "NSCA Certified Strength and Conditioning Specialist",
            "USA Track & Field Level 2 Coach",
            "USA Basketball Gold License",
          ],
          experience: [
            { role: "Assistant Coach", organization: "New York University", period: "2018-2022" },
            { role: "Performance Coach", organization: "Elite Athletics Academy", period: "2015-2018" },
          ],
          accomplishments: [
            "Coached 12+ athletes to Division I scholarships",
            "Developed training programs for 3 NBA draft picks",
            "Published author in Journal of Strength and Conditioning Research",
            "Featured speaker at National Coaching Conference 2023",
          ],
          awards: [
            { title: "Coach of the Year", organization: "NYC Basketball Association", year: "2021" },
            {
              title: "Excellence in Athletic Development",
              organization: "Sports Performance Institute",
              year: "2019",
            },
          ],
          videos: [
            {
              id: 1,
              title: "Advanced Shooting Techniques",
              thumbnail: "https://images.unsplash.com/photo-1546519638-68e109acd27d?q=80&w=400&auto=format",
              duration: "12:45",
            },
            {
              id: 2,
              title: "Explosive Speed Training",
              thumbnail: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=400&auto=format",
              duration: "8:30",
            },
            {
              id: 3,
              title: "Basketball Footwork Drills",
              thumbnail: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format",
              duration: "15:20",
            },
          ],
          rating: 4.9,
          reviewCount: 124,
          reviews: [
            {
              id: 1,
              author: "Michael J.",
              avatar: "/placeholder.svg?height=40&width=40&text=MJ",
              rating: 5,
              text: "John is an exceptional trainer. His attention to detail and personalized approach helped me improve my game significantly in just a few sessions.",
            },
            {
              id: 2,
              author: "Sarah T.",
              avatar: "/placeholder.svg?height=40&width=40&text=ST",
              rating: 5,
              text: "Working with John has been transformative for my track performance. His knowledge and coaching style are top-notch.",
            },
            {
              id: 3,
              author: "David K.",
              avatar: "/placeholder.svg?height=40&width=40&text=DK",
              rating: 4,
              text: "Great coach who really understands how to develop athletes. My only wish is that he had more availability on weekends.",
            },
          ],
          availability: {
            timeSlots: [
              // Current dates (using dynamic dates relative to today)
              { day: new Date(Date.now()), slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"] },
              { day: new Date(Date.now() + 86400000), slots: ["8:00 AM", "10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"] },
              { day: new Date(Date.now() + 86400000 * 2), slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
              { day: new Date(Date.now() + 86400000 * 3), slots: ["8:00 AM", "10:00 AM", "1:00 PM", "3:00 PM"] },
              { day: new Date(Date.now() + 86400000 * 4), slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"] },
              { day: new Date(Date.now() + 86400000 * 5), slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
              { day: new Date(Date.now() + 86400000 * 6), slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },

              // Next week
              {
                day: new Date(Date.now() + 86400000 * 7),
                slots: ["8:00 AM", "10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
              },
              { day: new Date(Date.now() + 86400000 * 8), slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
              { day: new Date(Date.now() + 86400000 * 9), slots: ["8:00 AM", "10:00 AM", "1:00 PM", "3:00 PM"] },
              { day: new Date(Date.now() + 86400000 * 10), slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"] },
              { day: new Date(Date.now() + 86400000 * 11), slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
              { day: new Date(Date.now() + 86400000 * 12), slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
              { day: new Date(Date.now() + 86400000 * 13), slots: ["8:00 AM", "10:00 AM", "1:00 PM", "3:00 PM"] },

              // Two weeks from now
              { day: new Date(Date.now() + 86400000 * 14), slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"] },
              {
                day: new Date(Date.now() + 86400000 * 15),
                slots: ["8:00 AM", "10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
              },
              { day: new Date(Date.now() + 86400000 * 16), slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
            ],
          },
          headerImageURL: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1920&auto=format",
          profileImageURL: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?q=80&w=400&auto=format",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTrainerData()
  }, [params.id])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTimeSlot(null)
  }

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot)
  }

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !trainer) return []

    const dayData = trainer.availability.timeSlots.find((day: any) => isSameDay(day.day, selectedDate))

    return dayData ? dayData.slots : []
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto md:px-6">
      {/* Hero Section */}
      <div className="relative w-full h-56 sm:h-64 md:h-80 rounded-xl overflow-hidden mb-8">
        <Image
          src={
            trainer.headerImageURL ||
            "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1920&auto=format" ||
            "/placeholder.svg" ||
            "/placeholder.svg" ||
            "/placeholder.svg"
          }
          alt="Trainer hero image"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
          <div>
            <Badge className="mb-2 bg-blue-600">{trainer.level} Trainer</Badge>
            <h1 className="text-3xl font-bold text-white">{trainer.name}</h1>
            <p className="text-white/80">{trainer.title}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Content - 2/3 width */}
        <div className="md:col-span-2 space-y-8">
          {/* Trainer Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={
                      trainer.profileImageURL ||
                      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?q=80&w=400&auto=format" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={trainer.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= Math.round(trainer.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {trainer.rating} ({trainer.reviewCount} reviews)
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{trainer.clientCount || "320+"} clients</span>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {trainer.sports.map((sport: string, index: number) => (
                        <div key={sport} className="flex items-center gap-1">
                          {index === 0 ? (
                            <FaBasketballBall className="text-orange-500" />
                          ) : (
                            <FaRunning className="text-purple-500" />
                          )}
                          <span className="text-sm font-medium">{sport}</span>
                          {trainer.divisions && trainer.divisions[index] && (
                            <Badge variant="outline" className="text-xs font-normal ml-1">
                              {trainer.divisions[index]}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {trainer.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-gray-400" />
                      {trainer.hours}
                    </div>
                    {trainer.education && trainer.education.length > 0 && (
                      <div className="flex items-center">
                        <FaUniversity className="w-4 h-4 mr-1 text-gray-400" />
                        {trainer.education[0].split(",")[1] || trainer.education[0]}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Experience Level</span>
                      <span className="text-sm font-bold">{trainer.levelScore}%</span>
                    </div>
                    <Progress value={trainer.levelScore} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different sections */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 gap-1">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="accomplishments">Accomplishments</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="mt-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About {trainer.name}</h3>
                    <p className="text-gray-700">{trainer.bio}</p>
                    {trainer.philosophy && <p className="text-gray-700 mt-4">{trainer.philosophy}</p>}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Training Approach</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Personalized Programs</h4>
                          <p className="text-sm text-gray-600">
                            Customized training plans based on your specific goals and needs
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Video Analysis</h4>
                          <p className="text-sm text-gray-600">
                            Detailed breakdown of your technique with actionable feedback
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Mental Conditioning</h4>
                          <p className="text-sm text-gray-600">Strategies to build focus, confidence, and resilience</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Performance Tracking</h4>
                          <p className="text-sm text-gray-600">
                            Regular assessments to measure progress and adjust training
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="mt-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {trainer.education && trainer.education.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Education</h3>
                      <div className="space-y-3">
                        {trainer.education.map((edu: string, index: number) => (
                          <div key={index} className="flex items-start">
                            <FaUniversity className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                            <span>{edu}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {trainer.education && trainer.education.length > 0 && <Separator />}

                  {trainer.certifications && trainer.certifications.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Certifications</h3>
                      <div className="space-y-3">
                        {trainer.certifications.map((cert: string, index: number) => (
                          <div key={index} className="flex items-start">
                            <Award className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                            <span>{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {trainer.certifications && trainer.certifications.length > 0 && <Separator />}

                  {trainer.experience && trainer.experience.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Professional Experience</h3>
                      <div className="space-y-4">
                        {trainer.experience.map((exp: any, index: number) => (
                          <div key={index} className="flex items-start">
                            <div className="bg-blue-100 rounded-full p-2 mr-3 shrink-0">
                              <Clock8 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{exp.role}</h4>
                              <p className="text-sm text-gray-600">
                                {exp.organization} • {exp.period}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accomplishments Tab */}
            <TabsContent value="accomplishments" className="mt-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {trainer.accomplishments && trainer.accomplishments.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Key Accomplishments</h3>
                      <div className="space-y-3">
                        {trainer.accomplishments.map((accomplishment: string, index: number) => (
                          <div key={index} className="flex items-start">
                            <ThumbsUp className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                            <span>{accomplishment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {trainer.accomplishments && trainer.accomplishments.length > 0 && <Separator />}

                  {trainer.awards && trainer.awards.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Awards & Recognition</h3>
                      <div className="space-y-4">
                        {trainer.awards.map((award: any, index: number) => (
                          <div key={index} className="flex items-start">
                            <div className="bg-yellow-100 rounded-full p-2 mr-3 shrink-0">
                              <Trophy className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{award.title}</h4>
                              <p className="text-sm text-gray-600">
                                {award.organization} • {award.year}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {trainer.awards && trainer.awards.length > 0 && <Separator />}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-blue-600">10+</div>
                      <p className="text-sm text-gray-600">Years Experience</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-blue-600">320+</div>
                      <p className="text-sm text-gray-600">Athletes Trained</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-blue-600">12+</div>
                      <p className="text-sm text-gray-600">D1 Scholarships</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-blue-600">3</div>
                      <p className="text-sm text-gray-600">Pro Athletes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="mt-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-lg font-semibold mb-3">Training Videos</h3>
                  {trainer.videos && trainer.videos.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {trainer.videos.map((video: any) => (
                        <div key={video.id} className="group relative rounded-xl overflow-hidden">
                          <div className="aspect-video relative">
                            <Image
                              src={video.thumbnail || "/placeholder.svg"}
                              alt={video.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-white/90 rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform">
                                <Play className="h-6 w-6 text-blue-600 fill-blue-600" />
                              </div>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {video.duration}
                            </div>
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium">{video.title}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No training videos available yet.</p>
                  )}

                  {trainer.videos && trainer.videos.length > 0 && (
                    <div className="text-center mt-6">
                      <Button variant="outline">View All Videos</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Client Reviews</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${star <= Math.round(trainer.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">
                        {trainer.rating} ({trainer.reviewCount} reviews)
                      </span>
                    </div>
                  </div>

                  {trainer.reviews && trainer.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {trainer.reviews.map((review: any) => (
                        <div key={review.id} className="p-4 border rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar>
                              <AvatarImage src={review.avatar} alt={review.author} />
                              <AvatarFallback>
                                {review.author
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{review.author}</div>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No reviews available yet.</p>
                  )}

                  {trainer.reviews && trainer.reviews.length > 0 && (
                    <div className="text-center mt-6">
                      <Button variant="outline">View All Reviews</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Booking Card */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>${trainer.price}</span>
                <span className="text-sm text-gray-500">per hour</span>
              </CardTitle>
              <CardDescription>{trainer.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Package Selection */}
              <div>
                <h3 className="text-sm font-medium mb-3">Choose Package:</h3>
                <div className="flex gap-2">
                  {trainer.packages.map((pkg: any) => (
                    <Badge
                      key={pkg.name}
                      variant={pkg.isActive ? "default" : "outline"}
                      className="cursor-pointer py-1.5 px-3"
                    >
                      {pkg.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                {trainer.features.map((feature: string) => (
                  <div key={feature} className="flex items-center">
                    <Check className="w-5 h-5 mr-2 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Full Calendar */}
              <div className="border rounded-xl p-2">
                <h3 className="font-medium mb-2">Select Date & Time</h3>

                <div className="mb-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate || undefined}
                    onSelect={(date) => date && handleDateSelect(date)}
                    className="rounded-md border-0 p-0 w-full [&_.rdp-months]:w-full [&_.rdp-month]:w-full [&_.rdp-table]:w-full"
                    modifiers={{
                      available: (date) => {
                        // Check if this date has available slots
                        const dayData = trainer.availability.timeSlots.find((day: any) => isSameDay(day.day, date))
                        return dayData ? dayData.slots.length > 0 : false
                      },
                    }}
                    modifiersClassNames={{
                      available: "bg-blue-50 font-medium text-blue-600 hover:bg-blue-100",
                    }}
                    disabled={(date) => {
                      // Disable dates that have no available slots
                      const dayData = trainer.availability.timeSlots.find((day: any) => isSameDay(day.day, date))
                      // Also disable past dates
                      return date < new Date() || !dayData || dayData.slots.length === 0
                    }}
                  />
                </div>

                {selectedDate && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Available Times for {format(selectedDate, "EEE, MMM d")}:
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {getAvailableTimeSlots().map((timeSlot: string) => (
                        <button
                          key={timeSlot}
                          className={`py-1.5 px-2 text-sm border rounded-md text-center
                            ${selectedTimeSlot === timeSlot ? "bg-blue-600 text-white border-blue-600" : "hover:bg-blue-50"}
                          `}
                          onClick={() => handleTimeSlotSelect(timeSlot)}
                        >
                          {timeSlot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Button */}
              <Button
                className="w-full"
                size="lg"
                disabled={!selectedDate || !selectedTimeSlot}
                onClick={() => {
                  if (selectedDate && selectedTimeSlot) {
                    // Navigate to checkout page with booking details
                    router.push(
                      `/checkout?trainerId=${params.id}&date=${selectedDate.toISOString()}&timeSlot=${selectedTimeSlot}&package=${
                        trainer.packages.find((pkg: any) => pkg.isActive)?.name || "Single"
                      }`,
                    )
                  }
                }}
              >
                {selectedDate && selectedTimeSlot
                  ? `Book for ${format(selectedDate, "MMM d")} at ${selectedTimeSlot}`
                  : "Select Date & Time"}
              </Button>

              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat with {trainer.name.split(" ")[0]}
              </Button>
            </CardContent>

            <CardFooter className="flex justify-between text-sm text-gray-500 border-t pt-4">
              <div className="flex items-center">
                <FaRegCalendarCheck className="mr-1" />
                <span>Usually responds within 1 hour</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
