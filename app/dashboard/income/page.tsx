"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, DollarSign, TrendingUp, Users } from "lucide-react"

export default function IncomeAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month")

  // Mock data for monthly income
  const monthlyIncomeData = [
    { name: "Jan", income: 2400 },
    { name: "Feb", income: 1398 },
    { name: "Mar", income: 3200 },
    { name: "Apr", income: 2780 },
    { name: "May", income: 1890 },
    { name: "Jun", income: 2390 },
    { name: "Jul", income: 3490 },
    { name: "Aug", income: 2000 },
    { name: "Sep", income: 2780 },
    { name: "Oct", income: 1890 },
    { name: "Nov", income: 2390 },
    { name: "Dec", income: 3490 },
  ]

  // Mock data for weekly income
  const weeklyIncomeData = [
    { name: "Mon", income: 400 },
    { name: "Tue", income: 300 },
    { name: "Wed", income: 550 },
    { name: "Thu", income: 500 },
    { name: "Fri", income: 600 },
    { name: "Sat", income: 450 },
    { name: "Sun", income: 300 },
  ]

  // Mock data for income by sport
  const incomeBySourceData = [
    { name: "Basketball", value: 4000 },
    { name: "Football", value: 3000 },
    { name: "Swimming", value: 2000 },
    { name: "Tennis", value: 2780 },
    { name: "Other", value: 1890 },
  ]

  // Mock data for session types
  const sessionTypeData = [
    { name: "One-on-One", value: 65 },
    { name: "Group", value: 25 },
    { name: "Virtual", value: 10 },
  ]

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  // Get the appropriate data based on the selected time range
  const incomeData = timeRange === "week" ? weeklyIncomeData : monthlyIncomeData

  // Calculate total income
  const totalIncome = incomeData.reduce((sum, item) => sum + item.income, 0)

  // Calculate average income
  const averageIncome = Math.round(totalIncome / incomeData.length)

  // Calculate highest income
  const highestIncome = Math.max(...incomeData.map((item) => item.income))

  // Calculate total clients
  const totalClients = 24

  return (
    <AuthGuard>
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Income Analytics</h1>
            <p className="text-gray-600">Track your earnings and financial performance</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Year (Monthly)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-none shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Income</p>
                  <p className="text-3xl font-bold">${totalIncome}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12% from previous {timeRange}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Average Income</p>
                  <p className="text-3xl font-bold">${averageIncome}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+5% from previous {timeRange}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Highest Income</p>
                  <p className="text-3xl font-bold">${highestIncome}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <span>in {incomeData.find((item) => item.income === highestIncome)?.name}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Clients</p>
                  <p className="text-3xl font-bold">{totalClients}</p>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+3 new clients this {timeRange}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 border-none shadow-md">
            <CardHeader>
              <CardTitle>Income Overview</CardTitle>
              <CardDescription>
                Your earnings over time ({timeRange === "week" ? "this week" : "this year"})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  income: {
                    label: "Income ($)",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={incomeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#0088FE" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#0088FE"
                      fillOpacity={1}
                      fill="url(#colorIncome)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Income by Sport</CardTitle>
              <CardDescription>Distribution of earnings by sport category</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeBySourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {incomeBySourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, "Income"]} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Session Types</CardTitle>
              <CardDescription>Breakdown of income by session format</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sessionTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sessionTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Sessions per Day</CardTitle>
              <CardDescription>Number of sessions conducted each day</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sessions: {
                    label: "Sessions",
                    color: "#8884d8",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyIncomeData.map((item) => ({
                      name: item.name,
                      sessions: Math.round(item.income / 100),
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, "Sessions"]} />
                    <Bar dataKey="sessions" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
