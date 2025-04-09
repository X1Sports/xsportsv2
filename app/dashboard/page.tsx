"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/firebase-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarClock, Users, Dumbbell, Settings, DollarSign, UserCircle, BarChart3 } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth/auth-guard"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardCard } from "@/components/dashboard/dashboard-card"

export default function Dashboard() {
  const { user, userRole, setUserRole, getLinkedProviders, linkGoogleAccount, unlinkGoogleAccount } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    upcomingSessions: 0,
    income: 0,
    completedSessions: 0,
    profileViews: 0,
  })

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.uid) return

      try {
        // Fetch user profile to determine role
        const userProfilesRef = collection(db, "userProfiles")
        const q = query(userProfilesRef, where("userId", "==", user.uid))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data()
          setUserRole(userData.role || "athlete")

          // Set mock stats based on role
          if (userData.role === "trainer" || userData.role === "coach") {
            setStats({
              upcomingSessions: Math.floor(Math.random() * 10),
              income: Math.floor(Math.random() * 5000),
              completedSessions: Math.floor(Math.random() * 50),
              profileViews: Math.floor(Math.random() * 200),
            })
          } else {
            setStats({
              upcomingSessions: Math.floor(Math.random() * 5),
              income: 0,
              completedSessions: Math.floor(Math.random() * 20),
              profileViews: 0,
            })
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserRole()
  }, [user, setUserRole])

  const isTrainerOrCoach = userRole === "trainer" || userRole === "coach"

  return (
    <AuthGuard>
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.displayName || "Athlete"}</h1>
          <p className="text-gray-600">
            {isTrainerOrCoach
              ? "Manage your training sessions, view analytics, and update your profile."
              : "Track your training progress, find coaches, and manage your athletic journey."}
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-transparent h-auto p-0">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-2.5"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="sessions"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-2.5"
            >
              Sessions
            </TabsTrigger>
            {isTrainerOrCoach && (
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-2.5"
              >
                Analytics
              </TabsTrigger>
            )}
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-2.5"
            >
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="Upcoming Sessions"
                description="View your scheduled training"
                icon={CalendarClock}
                iconColor="text-blue-600"
                iconBgColor="bg-blue-100"
                value={stats.upcomingSessions}
                ctaText="View Schedule"
                ctaLink="/dashboard/bookings"
                ctaBgColor="bg-blue-600"
                ctaHoverColor="bg-blue-700"
              />

              <DashboardCard
                title={isTrainerOrCoach ? "Find Athletes" : "Find Trainers"}
                description={isTrainerOrCoach ? "Connect with potential clients" : "Discover top coaches in your area"}
                icon={Users}
                iconColor="text-green-600"
                iconBgColor="bg-green-100"
                value="100+"
                ctaText={isTrainerOrCoach ? "Browse Athletes" : "Browse Trainers"}
                ctaLink={isTrainerOrCoach ? "/athletes/search" : "/trainers/search"}
                ctaBgColor="bg-green-600"
                ctaHoverColor="bg-green-700"
              />

              <DashboardCard
                title={isTrainerOrCoach ? "Your Programs" : "Training Programs"}
                description={isTrainerOrCoach ? "Manage your training offerings" : "Structured plans for your goals"}
                icon={Dumbbell}
                iconColor="text-purple-600"
                iconBgColor="bg-purple-100"
                value="3"
                ctaText={isTrainerOrCoach ? "Manage Programs" : "View Programs"}
                ctaLink="/programs"
                ctaBgColor="bg-purple-600"
                ctaHoverColor="bg-purple-700"
              />

              <DashboardCard
                title="Account Settings"
                description="Manage your profile and preferences"
                icon={Settings}
                iconColor="text-gray-600"
                iconBgColor="bg-gray-100"
                value={user?.emailVerified ? "✓" : "!"}
                ctaText="Edit Profile"
                ctaLink="/dashboard/profile"
                ctaBgColor="bg-gray-600"
                ctaHoverColor="bg-gray-700"
              />
            </div>

            {isTrainerOrCoach && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-blue-100">Total Income</p>
                          <p className="text-3xl font-bold">${stats.income}</p>
                        </div>
                        <div className="bg-blue-400/20 p-3 rounded-full">
                          <DollarSign className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-blue-100">
                        <span className="font-medium">↗ 12%</span> from last month
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-green-100">Completed Sessions</p>
                          <p className="text-3xl font-bold">{stats.completedSessions}</p>
                        </div>
                        <div className="bg-green-400/20 p-3 rounded-full">
                          <CalendarClock className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-green-100">
                        <span className="font-medium">↗ 8%</span> from last month
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-amber-100">Profile Views</p>
                          <p className="text-3xl font-bold">{stats.profileViews}</p>
                        </div>
                        <div className="bg-amber-400/20 p-3 rounded-full">
                          <UserCircle className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-amber-100">
                        <span className="font-medium">↗ 23%</span> from last month
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-purple-100">Conversion Rate</p>
                          <p className="text-3xl font-bold">18.2%</p>
                        </div>
                        <div className="bg-purple-400/20 p-3 rounded-full">
                          <BarChart3 className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-purple-100">
                        <span className="font-medium">↗ 5%</span> from last month
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>View and manage your scheduled training sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.upcomingSessions > 0 ? (
                  <div className="space-y-4">
                    {[...Array(stats.upcomingSessions)].map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">
                            {isTrainerOrCoach ? "Session with Alex Johnson" : "Training with Coach Mike"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(Date.now() + (index + 1) * 86400000).toLocaleDateString()} •
                            {index % 2 === 0 ? " 10:00 AM" : " 2:00 PM"} •
                            {index % 3 === 0
                              ? " Basketball"
                              : index % 3 === 1
                                ? " Strength Training"
                                : " Speed & Agility"}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarClock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No upcoming sessions</h3>
                    <p className="text-gray-500 mb-4">You don't have any training sessions scheduled yet.</p>
                    <Button asChild>
                      <Link href={isTrainerOrCoach ? "/dashboard/availability" : "/trainers/search"}>
                        {isTrainerOrCoach ? "Set Your Availability" : "Find a Trainer"}
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Past Sessions</CardTitle>
                  <CardDescription>Review your training history</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.completedSessions > 0 ? (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {[...Array(Math.min(stats.completedSessions, 5))].map((_, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">
                              {isTrainerOrCoach ? "Session with Chris Miller" : "Training with Coach Sarah"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(Date.now() - (index + 1) * 86400000 * 3).toLocaleDateString()} •
                              {index % 2 === 0 ? " 9:00 AM" : " 4:00 PM"}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No past sessions to display</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{isTrainerOrCoach ? "Client Requests" : "Training Requests"}</CardTitle>
                  <CardDescription>
                    {isTrainerOrCoach ? "Manage incoming training requests" : "Check the status of your requests"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-gray-500">No pending requests</p>
                    {isTrainerOrCoach ? (
                      <p className="text-sm text-gray-400 mt-2">New requests will appear here</p>
                    ) : (
                      <Button asChild className="mt-4">
                        <Link href="/trainers/search">Request a Session</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {isTrainerOrCoach && (
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Income Analytics</CardTitle>
                  <CardDescription>Track your earnings over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      We're working on detailed analytics for trainers and coaches. Check back soon for insights on your
                      income, client retention, and more.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Retention</CardTitle>
                    <CardDescription>Track repeat bookings and client loyalty</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px] flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-500">Analytics coming soon</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Session Breakdown</CardTitle>
                    <CardDescription>Analysis by sport and session type</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px] flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-500">Analytics coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Management</CardTitle>
                <CardDescription>Update your information and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Profile Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Name:</span>
                        <span className="font-medium">{user?.displayName || "Not set"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium">{user?.email || "Not set"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Role:</span>
                        <span className="font-medium capitalize">{userRole || "Athlete"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Verified:</span>
                        <span className="font-medium">{user?.emailVerified ? "Yes" : "No"}</span>
                      </div>
                    </div>
                    <Button asChild className="mt-4 w-full">
                      <Link href="/dashboard/profile">Edit Profile</Link>
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Account Settings</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Password:</span>
                        <span className="font-medium">••••••••</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Two-factor:</span>
                        <span className="font-medium">Not enabled</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Notifications:</span>
                        <span className="font-medium">Enabled</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Privacy:</span>
                        <span className="font-medium">Public profile</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Google Account:</span>
                        <span className="font-medium">
                          {getLinkedProviders().includes("google.com") ? "Connected" : "Not connected"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Button variant="outline" className="w-full">
                        Manage Settings
                      </Button>
                      {getLinkedProviders().includes("google.com") ? (
                        <Button
                          variant="outline"
                          className="w-full text-red-500 border-red-200 hover:bg-red-50"
                          onClick={unlinkGoogleAccount}
                        >
                          Disconnect Google Account
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2"
                          onClick={linkGoogleAccount}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                              <path
                                fill="#4285F4"
                                d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                              />
                              <path
                                fill="#34A853"
                                d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                              />
                              <path
                                fill="#FBBC05"
                                d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                              />
                              <path
                                fill="#EA4335"
                                d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                              />
                            </g>
                          </svg>
                          Connect Google Account
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Public Profile</CardTitle>
                  <CardDescription>How others see your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <UserCircle className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <h3 className="font-medium text-lg">{user?.displayName || "Your Name"}</h3>
                    <p className="text-gray-500 mb-4 capitalize">{userRole || "Athlete"}</p>
                    <Button asChild variant="outline" size="sm">
                      <Link href={isTrainerOrCoach ? `/trainers/${user?.uid}` : `/athletes/${user?.uid}`}>
                        View Public Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>Manage your membership plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <h3 className="font-medium text-lg mb-1">Free Plan</h3>
                    <p className="text-gray-500 mb-4">Basic features and limited access</p>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Upgrade to Pro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  )
}
