"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import {
  fetchUserGrowthData,
  fetchUserDistributionData,
  fetchActivityData,
  fetchEngagementMetrics,
  fetchUserCounts,
  type UserGrowthData,
  type UserDistributionData,
  type ActivityData,
  type EngagementData,
} from "@/utils/analytics-utils"

// Define explicit colors for charts
const COLORS = {
  total: "#4f46e5", // Indigo
  athletes: "#06b6d4", // Cyan
  trainers: "#ec4899", // Pink
  coaches: "#f59e0b", // Amber
  sessions: "#10b981", // Emerald
  pageViews: "#8b5cf6", // Violet
  interactions: "#f43f5e", // Rose
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([])
  const [userDistributionData, setUserDistributionData] = useState<UserDistributionData[]>([])
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementData[]>([])
  const [userCounts, setUserCounts] = useState({ total: 0, athletes: 0, trainers: 0, coaches: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [growthData, distributionData, activity, engagement, counts] = await Promise.all([
          fetchUserGrowthData(timeRange),
          fetchUserDistributionData(),
          fetchActivityData(timeRange),
          fetchEngagementMetrics(),
          fetchUserCounts(),
        ])

        setUserGrowthData(growthData)
        setUserDistributionData(distributionData)
        setActivityData(activity)
        setEngagementMetrics(engagement)
        setUserCounts(counts)
      } catch (error) {
        console.error("Error fetching analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up a refresh interval (every 5 minutes)
    const intervalId = setInterval(
      () => {
        fetchData()
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(intervalId)
  }, [timeRange])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Analytics</h1>
          <p className="text-muted-foreground">Platform usage and performance metrics.</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{userCounts.total.toLocaleString()}</div>
                <p className="text-xs text-green-400">+12.5% from last month</p>
                <div className="mt-4 h-[80px]">
                  {!loading && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={userGrowthData.slice(-14)}>
                        <defs>
                          <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="total"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#totalGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">324</div>
                <p className="text-xs text-green-400">+18.2% from last month</p>
                <div className="mt-4 h-[80px]">
                  {!loading && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData.slice(-14)}>
                        <defs>
                          <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="sessions"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#sessionsGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Avg. Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">4m 32s</div>
                <p className="text-xs text-green-400">+2.3% from last month</p>
                <div className="mt-4 h-[80px]">
                  {!loading && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData.slice(-14)}>
                        <defs>
                          <linearGradient id="interactionsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="interactions"
                          stroke="#8b5cf6"
                          fillOpacity={1}
                          fill="url(#interactionsGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">Bounce Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">24.8%</div>
                <p className="text-xs text-green-400">-3.4% from last month</p>
                <div className="mt-4 h-[80px]">
                  {!loading && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={activityData.slice(-14)}>
                        <Line type="monotone" dataKey="pageViews" stroke="#ec4899" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">User Growth</CardTitle>
                <CardDescription className="text-gray-400">New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {!loading ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          dataKey="date"
                          stroke="#9ca3af"
                          tickFormatter={(value) => {
                            const date = new Date(value)
                            return `${date.getMonth() + 1}/${date.getDate()}`
                          }}
                        />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "white" }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="total"
                          name="Total Users"
                          stroke={COLORS.total}
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="athletes"
                          name="Athletes"
                          stroke={COLORS.athletes}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="trainers"
                          name="Trainers"
                          stroke={COLORS.trainers}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="coaches"
                          name="Coaches"
                          stroke={COLORS.coaches}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-400">Loading chart data...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">User Distribution</CardTitle>
                <CardDescription className="text-gray-400">Breakdown by user role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {!loading ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {userDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value} users`, "Count"]}
                          contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "white" }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-400">Loading chart data...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Platform Activity</CardTitle>
                <CardDescription className="text-gray-400">Sessions, page views, and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {!loading ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityData.slice(-14)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          dataKey="date"
                          stroke="#9ca3af"
                          tickFormatter={(value) => {
                            const date = new Date(value)
                            return `${date.getMonth() + 1}/${date.getDate()}`
                          }}
                        />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "white" }}
                        />
                        <Legend />
                        <Bar dataKey="sessions" name="Sessions" fill={COLORS.sessions} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="pageViews" name="Page Views" fill={COLORS.pageViews} radius={[4, 4, 0, 0]} />
                        <Bar
                          dataKey="interactions"
                          name="Interactions"
                          fill={COLORS.interactions}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-400">Loading chart data...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Engagement Metrics</CardTitle>
                <CardDescription className="text-gray-400">Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {!loading ? (
                    engagementMetrics.map((metric) => (
                      <div key={metric.metric} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-200">{metric.metric}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-white">{metric.value}</p>
                            <span className={`text-xs ${metric.change > 0 ? "text-green-400" : "text-red-400"}`}>
                              {metric.change > 0 ? "+" : ""}
                              {metric.change}%
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              metric.metric === "Bounce Rate"
                                ? metric.change < 0
                                  ? "bg-green-500"
                                  : "bg-red-500"
                                : metric.change > 0
                                  ? "bg-blue-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${Math.min(100, Math.abs(metric.value * 2))}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-[250px] flex items-center justify-center">
                      <p className="text-gray-400">Loading metrics...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">User Analytics</CardTitle>
              <CardDescription className="text-gray-400">Detailed user statistics and demographics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="h-[300px]">
                    {!loading ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Male", value: 58, color: "#3b82f6" },
                              { name: "Female", value: 42, color: "#ec4899" },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: "Male", value: 58, color: "#3b82f6" },
                              { name: "Female", value: 42, color: "#ec4899" },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value}%`, "Percentage"]}
                            contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "white" }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-400">Loading chart data...</p>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-white text-center">Gender Distribution</h3>
                </div>

                <div className="space-y-4">
                  <div className="h-[300px]">
                    {!loading ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { age: "18-24", value: 22 },
                            { age: "25-34", value: 38 },
                            { age: "35-44", value: 25 },
                            { age: "45-54", value: 10 },
                            { age: "55+", value: 5 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="age" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip
                            formatter={(value) => [`${value}%`, "Percentage"]}
                            contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "white" }}
                          />
                          <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-400">Loading chart data...</p>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-white text-center">Age Distribution</h3>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-white mb-4">User Retention</h3>
                <div className="h-[300px]">
                  {!loading ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: "Jan", retention: 100 },
                          { month: "Feb", retention: 85 },
                          { month: "Mar", retention: 76 },
                          { month: "Apr", retention: 68 },
                          { month: "May", retention: 62 },
                          { month: "Jun", retention: 58 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Retention Rate"]}
                          contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "white" }}
                        />
                        <Line type="monotone" dataKey="retention" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-400">Loading chart data...</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Activity Analytics</CardTitle>
              <CardDescription className="text-gray-400">User engagement and platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Popular Features</h3>
                  <div className="h-[300px]">
                    {!loading ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={[
                            { feature: "Trainer Search", usage: 85 },
                            { feature: "Messaging", usage: 72 },
                            { feature: "Scheduling", usage: 68 },
                            { feature: "Profile Viewing", usage: 63 },
                            { feature: "Reviews", usage: 45 },
                            { feature: "Payment", usage: 38 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis type="number" stroke="#9ca3af" />
                          <YAxis dataKey="feature" type="category" stroke="#9ca3af" width={100} />
                          <Tooltip
                            formatter={(value) => [`${value}%`, "Usage"]}
                            contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "white" }}
                          />
                          <Bar dataKey="usage" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-400">Loading chart data...</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Daily Active Users</h3>
                  <div className="h-[300px]">
                    {!loading ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={activityData.slice(-14)}>
                          <defs>
                            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis
                            dataKey="date"
                            stroke="#9ca3af"
                            tickFormatter={(value) => {
                              const date = new Date(value)
                              return `${date.getMonth() + 1}/${date.getDate()}`
                            }}
                          />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip
                            formatter={(value) => [`${value}`, "Users"]}
                            contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "white" }}
                          />
                          <Area
                            type="monotone"
                            dataKey="sessions"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorSessions)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-400">Loading chart data...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-white mb-4">User Engagement by Time of Day</h3>
                <div className="h-[300px]">
                  {!loading ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { time: "6am-9am", sessions: 120 },
                          { time: "9am-12pm", sessions: 240 },
                          { time: "12pm-3pm", sessions: 180 },
                          { time: "3pm-6pm", sessions: 260 },
                          { time: "6pm-9pm", sessions: 350 },
                          { time: "9pm-12am", sessions: 190 },
                          { time: "12am-6am", sessions: 80 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          formatter={(value) => [`${value}`, "Sessions"]}
                          contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "white" }}
                        />
                        <Bar dataKey="sessions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-400">Loading chart data...</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Revenue Analytics</CardTitle>
              <CardDescription className="text-gray-400">Financial performance and revenue streams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Monthly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">$24,580</div>
                    <p className="text-xs text-green-400">+15.3% from last month</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Avg. Transaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">$85.40</div>
                    <p className="text-xs text-green-400">+2.5% from last month</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Active Subscriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">287</div>
                    <p className="text-xs text-green-400">+12.8% from last month</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Churn Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">3.2%</div>
                    <p className="text-xs text-green-400">-0.8% from last month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Revenue Trends</h3>
                  <div className="h-[300px]">
                    {!loading ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { month: "Jan", revenue: 12500 },
                            { month: "Feb", revenue: 14800 },
                            { month: "Mar", revenue: 16200 },
                            { month: "Apr", revenue: 18900 },
                            { month: "May", revenue: 21300 },
                            { month: "Jun", revenue: 24580 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip
                            formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                            contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "white" }}
                          />
                          <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-400">Loading chart data...</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Revenue Sources</h3>
                  <div className="h-[300px]">
                    {!loading ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Subscriptions", value: 65, color: "#3b82f6" },
                              { name: "One-time Sessions", value: 20, color: "#10b981" },
                              { name: "Premium Features", value: 10, color: "#8b5cf6" },
                              { name: "Other", value: 5, color: "#f59e0b" },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: "Subscriptions", value: 65, color: "#3b82f6" },
                              { name: "One-time Sessions", value: 20, color: "#10b981" },
                              { name: "Premium Features", value: 10, color: "#8b5cf6" },
                              { name: "Other", value: 5, color: "#f59e0b" },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value}%`, "Percentage"]}
                            contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "white" }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-400">Loading chart data...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
