"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/firebase-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dumbbell, Clock, Calendar, Star, Filter, Search } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth/auth-guard"

// Sample program data
const trainingPrograms = [
  {
    id: "p1",
    title: "Speed & Agility Fundamentals",
    description: "Improve your acceleration, top speed, and change of direction with this 8-week program.",
    duration: "8 weeks",
    sessions: 24,
    level: "Beginner to Intermediate",
    category: "Speed",
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg?height=200&width=300",
    price: 149,
    featured: true,
  },
  {
    id: "p2",
    title: "Strength Foundation",
    description: "Build functional strength with this comprehensive program designed for athletes of all sports.",
    duration: "12 weeks",
    sessions: 36,
    level: "All Levels",
    category: "Strength",
    rating: 4.9,
    reviews: 89,
    image: "/placeholder.svg?height=200&width=300",
    price: 199,
    featured: true,
  },
  {
    id: "p3",
    title: "Basketball Skills Elite",
    description: "Take your basketball skills to the next level with drills used by professional players.",
    duration: "10 weeks",
    sessions: 30,
    level: "Intermediate to Advanced",
    category: "Basketball",
    rating: 4.7,
    reviews: 56,
    image: "/placeholder.svg?height=200&width=300",
    price: 179,
    featured: false,
  },
  {
    id: "p4",
    title: "Endurance Builder",
    description: "Increase your stamina and cardiovascular fitness with this progressive endurance program.",
    duration: "6 weeks",
    sessions: 18,
    level: "All Levels",
    category: "Endurance",
    rating: 4.6,
    reviews: 42,
    image: "/placeholder.svg?height=200&width=300",
    price: 129,
    featured: false,
  },
  {
    id: "p5",
    title: "Football Technique Mastery",
    description: "Master essential football techniques with position-specific training modules.",
    duration: "8 weeks",
    sessions: 24,
    level: "Intermediate",
    category: "Football",
    rating: 4.8,
    reviews: 67,
    image: "/placeholder.svg?height=200&width=300",
    price: 159,
    featured: false,
  },
  {
    id: "p6",
    title: "Injury Prevention & Recovery",
    description: "Learn techniques to prevent injuries and optimize recovery between training sessions.",
    duration: "4 weeks",
    sessions: 12,
    level: "All Levels",
    category: "Recovery",
    rating: 4.9,
    reviews: 38,
    image: "/placeholder.svg?height=200&width=300",
    price: 99,
    featured: false,
  },
]

// Program Card Component
function ProgramCard({ program, isTrainer }) {
  return (
    <div
      className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
      style={{ backgroundColor: "#333333", color: "white" }}
    >
      <div className="relative">
        <img src={program.image || "/placeholder.svg"} alt={program.title} className="w-full h-48 object-cover" />
        {program.featured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold mb-2">{program.title}</h3>
        <p className="text-gray-300 text-sm mb-4">{program.description}</p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-blue-400" />
            <span className="text-sm text-gray-300">{program.duration}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-green-400" />
            <span className="text-sm text-gray-300">{program.sessions} sessions</span>
          </div>
          <div className="flex items-center">
            <Dumbbell className="h-4 w-4 mr-2 text-purple-400" />
            <span className="text-sm text-gray-300">{program.level}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-400" />
            <span className="text-sm text-gray-300">
              {program.rating} ({program.reviews})
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">${program.price}</div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/programs/${program.id}`}>{isTrainer ? "Edit Program" : "View Details"}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ProgramsPage() {
  const { userRole } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const isTrainer = userRole === "trainer" || userRole === "coach"

  // Filter programs based on active tab
  const filteredPrograms =
    activeTab === "all"
      ? trainingPrograms
      : trainingPrograms.filter((program) => program.category.toLowerCase() === activeTab)

  return (
    <AuthGuard>
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Training Programs</h1>
            <p className="text-gray-600">
              {isTrainer
                ? "Manage your training programs and create new offerings"
                : "Discover structured training programs to achieve your athletic goals"}
            </p>
          </div>

          {isTrainer && (
            <Button className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700">
              <Link href="/programs/create">Create New Program</Link>
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: "#333333", color: "white" }}>
              <h3 className="font-bold text-lg mb-4">Search & Filter</h3>

              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search programs..."
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Categories
                </h4>
                <div className="space-y-1">
                  {["Speed", "Strength", "Basketball", "Football", "Endurance", "Recovery"].map((category) => (
                    <div key={category} className="flex items-center">
                      <input type="checkbox" id={category} className="mr-2" />
                      <label htmlFor={category} className="text-sm text-gray-300">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Level</h4>
                <div className="space-y-1">
                  {["Beginner", "Intermediate", "Advanced", "All Levels"].map((level) => (
                    <div key={level} className="flex items-center">
                      <input type="checkbox" id={level} className="mr-2" />
                      <label htmlFor={level} className="text-sm text-gray-300">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Duration</h4>
                <div className="space-y-1">
                  {["1-4 weeks", "5-8 weeks", "9-12 weeks", "12+ weeks"].map((duration) => (
                    <div key={duration} className="flex items-center">
                      <input type="checkbox" id={duration} className="mr-2" />
                      <label htmlFor={duration} className="text-sm text-gray-300">
                        {duration}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {isTrainer && (
              <div className="rounded-lg p-5" style={{ backgroundColor: "#333333", color: "white" }}>
                <h3 className="font-bold text-lg mb-4">Program Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Programs:</span>
                    <span className="font-bold">{trainingPrograms.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Active Enrollments:</span>
                    <span className="font-bold">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Avg. Rating:</span>
                    <span className="font-bold">4.8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Revenue:</span>
                    <span className="font-bold">$3,240</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="bg-transparent h-auto p-0 space-x-2">
                <TabsTrigger
                  value="all"
                  onClick={() => setActiveTab("all")}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2"
                >
                  All Programs
                </TabsTrigger>
                <TabsTrigger
                  value="speed"
                  onClick={() => setActiveTab("speed")}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2"
                >
                  Speed
                </TabsTrigger>
                <TabsTrigger
                  value="strength"
                  onClick={() => setActiveTab("strength")}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2"
                >
                  Strength
                </TabsTrigger>
                <TabsTrigger
                  value="basketball"
                  onClick={() => setActiveTab("basketball")}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2"
                >
                  Basketball
                </TabsTrigger>
                <TabsTrigger
                  value="football"
                  onClick={() => setActiveTab("football")}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2"
                >
                  Football
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} isTrainer={isTrainer} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="speed" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} isTrainer={isTrainer} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="strength" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} isTrainer={isTrainer} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="basketball" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} isTrainer={isTrainer} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="football" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} isTrainer={isTrainer} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {filteredPrograms.length === 0 && (
              <div className="text-center py-12 rounded-lg" style={{ backgroundColor: "#333333", color: "white" }}>
                <Dumbbell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium mb-2">No programs found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search criteria</p>
                <Button onClick={() => setActiveTab("all")}>View All Programs</Button>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg p-6 mt-8" style={{ backgroundColor: "#333333", color: "white" }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Need a Custom Training Program?</h2>
              <p className="text-gray-300 mb-4 md:mb-0">
                Work with our expert trainers to create a personalized program tailored to your specific goals.
              </p>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Request Custom Program
            </Button>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
