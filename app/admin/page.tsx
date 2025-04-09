"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
import { BarChart, DollarSign, Users, Activity } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    athletes: 0,
    trainers: 0,
    coaches: 0,
    recentUsers: [],
    loading: true,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total users count
        const usersRef = collection(db, "users")
        const usersSnapshot = await getDocs(usersRef)
        const totalUsers = usersSnapshot.size

        // Get athletes count
        const athletesQuery = query(usersRef, where("userRole", "==", "athlete"))
        const athletesSnapshot = await getDocs(athletesQuery)
        const athletes = athletesSnapshot.size

        // Get trainers count
        const trainersQuery = query(usersRef, where("userRole", "==", "trainer"))
        const trainersSnapshot = await getDocs(trainersQuery)
        const trainers = trainersSnapshot.size

        // Get coaches count
        const coachesQuery = query(usersRef, where("userRole", "==", "coach"))
        const coachesSnapshot = await getDocs(coachesQuery)
        const coaches = coachesSnapshot.size

        // Get recent users
        const recentUsersQuery = query(usersRef, orderBy("createdAt", "desc"), limit(5))
        const recentUsersSnapshot = await getDocs(recentUsersQuery)
        const recentUsers = recentUsersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setStats({
          totalUsers,
          athletes,
          trainers,
          coaches,
          recentUsers,
          loading: false,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        setStats((prev) => ({ ...prev, loading: false }))
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-gray-400">Overview of your platform statistics and recent activity.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-700">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-gray-700">
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Total Users</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.loading ? "Loading..." : stats.totalUsers}</div>
                <p className="text-xs text-gray-400">All registered users</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Athletes</CardTitle>
                <Activity className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.loading ? "Loading..." : stats.athletes}</div>
                <p className="text-xs text-gray-400">
                  {stats.loading ? "" : `${((stats.athletes / stats.totalUsers) * 100).toFixed(1)}% of users`}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Trainers</CardTitle>
                <BarChart className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.loading ? "Loading..." : stats.trainers}</div>
                <p className="text-xs text-gray-400">
                  {stats.loading ? "" : `${((stats.trainers / stats.totalUsers) * 100).toFixed(1)}% of users`}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Coaches</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.loading ? "Loading..." : stats.coaches}</div>
                <p className="text-xs text-gray-400">
                  {stats.loading ? "" : `${((stats.coaches / stats.totalUsers) * 100).toFixed(1)}% of users`}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-200">Recent Signups</CardTitle>
                <CardDescription className="text-gray-400">The latest users who joined the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : stats.recentUsers.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentUsers.map((user: any) => (
                      <div key={user.id} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-gray-200">{user.displayName || "Unnamed User"}</p>
                          <p className="text-sm text-gray-400 truncate">{user.email}</p>
                        </div>
                        <div className="text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                            {user.userRole || "Unknown"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-400">No recent users found</p>
                )}
              </CardContent>
            </Card>
            <Card className="col-span-3 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-200">User Distribution</CardTitle>
                <CardDescription className="text-gray-400">Breakdown of user types on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-200">Athletes</p>
                        <p className="text-sm text-gray-400">{stats.athletes}</p>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(stats.athletes / stats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-200">Trainers</p>
                        <p className="text-sm text-gray-400">{stats.trainers}</p>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(stats.trainers / stats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-200">Coaches</p>
                        <p className="text-sm text-gray-400">{stats.coaches}</p>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${(stats.coaches / stats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-200">Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Detailed platform analytics will be displayed here.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-gray-400">Analytics dashboard coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-200">Reports</CardTitle>
              <CardDescription className="text-gray-400">Generate and view platform reports.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-gray-400">Reports dashboard coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
