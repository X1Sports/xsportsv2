"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Trophy, Calendar, Clock, BarChart, Loader2 } from "lucide-react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "@/components/ui/use-toast"

export default function AthleteProfile({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [athlete, setAthlete] = useState<any>(null)

  useEffect(() => {
    const fetchAthleteData = async () => {
      try {
        setLoading(true)
        // Fetch the athlete data from Firestore
        const athleteDoc = await getDoc(doc(db, "athletes", params.id))

        if (athleteDoc.exists()) {
          const data = athleteDoc.data()

          // Merge the fetched data with default values for any missing fields
          setAthlete({
            id: params.id,
            name: data.name || "Unknown Athlete",
            sport: data.sports?.[0] || "Sport not specified",
            position: data.position || "Position not specified",
            location: data.location || "Location not specified",
            age: data.age || 0,
            height: data.height || "Height not specified",
            weight: data.weight || "Weight not specified",
            school: data.school || data.education || "School not specified",
            stats: data.stats || {
              ppg: 0,
              apg: 0,
              rpg: 0,
              spg: 0,
            },
            achievements: data.achievements || [],
            upcomingTraining: data.upcomingTraining || [],
            profileImageURL: data.profileImageURL || data.photoURL || "/placeholder.svg?height=128&width=128",
            headerImageURL: data.headerImageURL || null,
            sports: data.sports || [],
            bio: data.bio || "",
            goals: data.goals || "",
            experience: data.experience || [],
            media: data.media || [],
            trainingHistory: data.trainingHistory || [],
          })
        } else {
          // If no data found, use mock data
          toast({
            title: "Athlete not found",
            description: "Using sample data instead",
            variant: "destructive",
          })

          // Use mock data similar to what was previously hardcoded
          setAthlete({
            id: params.id,
            name: "Alex Johnson",
            sport: "Basketball",
            position: "Point Guard",
            location: "Chicago, IL",
            age: 19,
            height: "6'2\"",
            weight: "185 lbs",
            school: "University of Illinois",
            stats: {
              ppg: 18.5,
              apg: 6.2,
              rpg: 4.1,
              spg: 1.8,
            },
            achievements: [
              "All-Conference First Team (2024)",
              "State Championship MVP (2023)",
              "McDonald's All-American (2022)",
            ],
            upcomingTraining: [
              {
                id: 1,
                title: "Shooting Workout with Coach Davis",
                date: "Mar 18, 2025",
                time: "3:00 PM - 4:30 PM",
              },
              {
                id: 2,
                title: "Team Practice",
                date: "Mar 20, 2025",
                time: "10:00 AM - 12:00 PM",
              },
            ],
            profileImageURL: "/placeholder.svg?height=128&width=128",
            sports: ["Basketball"],
            bio: "Point guard at University of Illinois looking to improve technical skills during off-season.",
            goals: "Improve shooting accuracy and defensive footwork",
            experience: [
              { title: "Varsity Basketball", organization: "Lincoln High School", years: "2020-2022" },
              { title: "AAU Basketball", organization: "Chicago Elite", years: "2019-2022" },
            ],
            media: [
              { type: "image", url: "/placeholder.svg?height=180&width=320&text=Highlight+1" },
              { type: "image", url: "/placeholder.svg?height=180&width=320&text=Highlight+2" },
              { type: "image", url: "/placeholder.svg?height=180&width=320&text=Highlight+3" },
              { type: "image", url: "/placeholder.svg?height=180&width=320&text=Highlight+4" },
              { type: "image", url: "/placeholder.svg?height=180&width=320&text=Highlight+5" },
              { type: "image", url: "/placeholder.svg?height=180&width=320&text=Highlight+6" },
            ],
            trainingHistory: [
              {
                id: 1,
                title: "Shooting Session with Coach Davis",
                date: "Mar 10, 2025",
                coachName: "Coach Davis",
                coachImage: "/placeholder.svg?height=40&width=40",
              },
              {
                id: 2,
                title: "Agility Training with Coach Miller",
                date: "Mar 5, 2025",
                coachName: "Coach Miller",
                coachImage: "/placeholder.svg?height=40&width=40",
              },
              {
                id: 3,
                title: "Strength Training with Coach Thompson",
                date: "Feb 28, 2025",
                coachName: "Coach Thompson",
                coachImage: "/placeholder.svg?height=40&width=40",
              },
            ],
          })
        }
      } catch (error) {
        console.error("Error fetching athlete data:", error)
        toast({
          title: "Error",
          description: "Failed to load athlete data. Using sample data instead.",
          variant: "destructive",
        })

        // Use mock data as fallback
        setAthlete({
          id: params.id,
          name: "Alex Johnson",
          // ... (same mock data as above)
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAthleteData()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto md:px-6">
      {/* Hero Section - Add if athlete has a header image */}
      {athlete.headerImageURL && (
        <div className="relative w-full h-56 sm:h-64 md:h-80 rounded-xl overflow-hidden mb-8">
          <Image
            src={athlete.headerImageURL || "/placeholder.svg"}
            alt={`${athlete.name} header image`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
      )}

      <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative w-32 h-32 overflow-hidden rounded-full border-4 border-primary">
              <Image
                src={athlete.profileImageURL || "/placeholder.svg"}
                alt={athlete.name}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold">{athlete.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {athlete.sports && athlete.sports.map((sport: string) => <Badge key={sport}>{sport}</Badge>)}
                {athlete.position && <Badge variant="outline">{athlete.position}</Badge>}
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {athlete.location}
                </div>
                {athlete.age > 0 && <div>{athlete.age} years old</div>}
                {athlete.height && <div>{athlete.height}</div>}
                {athlete.weight && <div>{athlete.weight}</div>}
                {athlete.school && <div>{athlete.school}</div>}
              </div>

              {athlete.bio && (
                <div className="mt-4">
                  <p className="text-gray-700">{athlete.bio}</p>
                </div>
              )}
            </div>
          </div>

          <Tabs defaultValue="stats">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="p-4 border rounded-md mt-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Points Per Game</p>
                    <p className="text-3xl font-bold">{athlete.stats.ppg}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Assists Per Game</p>
                    <p className="text-3xl font-bold">{athlete.stats.apg}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Rebounds Per Game</p>
                    <p className="text-3xl font-bold">{athlete.stats.rpg}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Steals Per Game</p>
                    <p className="text-3xl font-bold">{athlete.stats.spg}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-4">Performance Trends</h3>
                <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                  <BarChart className="w-12 h-12 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Performance chart would go here</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="achievements" className="p-4 border rounded-md mt-2">
              {athlete.achievements && athlete.achievements.length > 0 ? (
                <div className="space-y-4">
                  {athlete.achievements.map((achievement: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <Trophy className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{achievement}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No achievements listed yet.</p>
              )}
            </TabsContent>
            <TabsContent value="training" className="p-4 border rounded-md mt-2">
              <div className="space-y-4">
                <h3 className="font-semibold">Upcoming Training Sessions</h3>
                {athlete.upcomingTraining && athlete.upcomingTraining.length > 0 ? (
                  athlete.upcomingTraining.map((session: any) => (
                    <Card key={session.id}>
                      <CardContent className="p-4">
                        <h4 className="font-medium">{session.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {session.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {session.time}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground italic">No upcoming training sessions scheduled.</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="media" className="p-4 border rounded-md mt-2">
              {athlete.media && athlete.media.length > 0 ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4">
                  {athlete.media.map((item: any, index: number) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-md">
                      <Image
                        src={item.url || `/placeholder.svg?height=180&width=320&text=Highlight+${index + 1}`}
                        alt={`Highlight ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5 text-primary"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No media content available yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {athlete.trainingHistory && athlete.trainingHistory.length > 0 ? (
                athlete.trainingHistory.map((session: any) => (
                  <div key={session.id} className="p-4 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          src={session.coachImage || "/placeholder.svg"}
                          alt={session.coachName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{session.title}</p>
                        <p className="text-sm text-muted-foreground">{session.date}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground italic">No training history available yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Trainers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 overflow-hidden rounded-full">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Coach Williams"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Coach Williams</p>
                    <p className="text-sm text-muted-foreground">Basketball, Shooting Specialist</p>
                  </div>
                  <Button size="sm">View</Button>
                </div>
              </div>

              <div className="p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 overflow-hidden rounded-full">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Coach Johnson"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Coach Johnson</p>
                    <p className="text-sm text-muted-foreground">Basketball, Defense Specialist</p>
                  </div>
                  <Button size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {athlete.goals && (
            <Card>
              <CardHeader>
                <CardTitle>Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{athlete.goals}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
