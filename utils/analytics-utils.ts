import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

// Interface for user growth data
export interface UserGrowthData {
  date: string
  total: number
  athletes: number
  trainers: number
  coaches: number
}

// Interface for user distribution data
export interface UserDistributionData {
  name: string
  value: number
  color: string
}

// Interface for activity data
export interface ActivityData {
  date: string
  sessions: number
  pageViews: number
  interactions: number
}

// Interface for engagement metrics
export interface EngagementData {
  metric: string
  value: number
  change: number
}

// Fetch user growth data
export async function fetchUserGrowthData(timeRange: string): Promise<UserGrowthData[]> {
  try {
    // Calculate the start date based on the time range
    const now = new Date()
    const startDate = new Date()

    switch (timeRange) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // For demo purposes, generate sample data
    // In production, you would query Firestore for actual user creation dates
    const data: UserGrowthData[] = []
    const dayCount = Math.round((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    let totalUsers = 800 // Starting count
    let athletes = 500
    let trainers = 200
    let coaches = 100

    for (let i = 0; i <= dayCount; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      // Add some random growth
      totalUsers += Math.floor(Math.random() * 10)
      athletes += Math.floor(Math.random() * 6)
      trainers += Math.floor(Math.random() * 3)
      coaches += Math.floor(Math.random() * 1)

      data.push({
        date: date.toISOString().split("T")[0],
        total: totalUsers,
        athletes,
        trainers,
        coaches,
      })
    }

    return data
  } catch (error) {
    console.error("Error fetching user growth data:", error)
    return []
  }
}

// Fetch user distribution data
export async function fetchUserDistributionData(): Promise<UserDistributionData[]> {
  try {
    // In production, you would query Firestore to count users by role
    // For now, return sample data with explicit, vibrant colors
    return [
      { name: "Athletes", value: 650, color: "#4f46e5" }, // Indigo
      { name: "Trainers", value: 230, color: "#06b6d4" }, // Cyan
      { name: "Coaches", value: 120, color: "#ec4899" }, // Pink
    ]
  } catch (error) {
    console.error("Error fetching user distribution data:", error)
    return []
  }
}

// Fetch activity data
export async function fetchActivityData(timeRange: string): Promise<ActivityData[]> {
  try {
    // Calculate the start date based on the time range
    const now = new Date()
    const startDate = new Date()

    switch (timeRange) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // For demo purposes, generate sample data
    const data: ActivityData[] = []
    const dayCount = Math.round((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    for (let i = 0; i <= dayCount; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      data.push({
        date: date.toISOString().split("T")[0],
        sessions: 100 + Math.floor(Math.random() * 150),
        pageViews: 500 + Math.floor(Math.random() * 700),
        interactions: 200 + Math.floor(Math.random() * 300),
      })
    }

    return data
  } catch (error) {
    console.error("Error fetching activity data:", error)
    return []
  }
}

// Fetch engagement metrics
export async function fetchEngagementMetrics(): Promise<EngagementData[]> {
  try {
    // In production, you would calculate these metrics from actual user data
    return [
      { metric: "Avg. Session Duration", value: 4.5, change: 12.5 }, // 4.5 minutes, up 12.5%
      { metric: "Pages per Session", value: 3.2, change: 8.7 },
      { metric: "Bounce Rate", value: 24.8, change: -3.4 }, // Down is good for bounce rate
      { metric: "Returning Users", value: 42.3, change: 5.1 },
    ]
  } catch (error) {
    console.error("Error fetching engagement metrics:", error)
    return []
  }
}

// Function to get real-time user counts
export async function fetchUserCounts() {
  try {
    const usersRef = collection(db, "users")
    const usersSnapshot = await getDocs(usersRef)
    const totalUsers = usersSnapshot.size

    // Count users by role
    let athletes = 0
    let trainers = 0
    let coaches = 0

    usersSnapshot.forEach((doc) => {
      const userData = doc.data()
      if (userData.userRole === "athlete") athletes++
      else if (userData.userRole === "trainer") trainers++
      else if (userData.userRole === "coach") coaches++
    })

    return {
      total: totalUsers,
      athletes,
      trainers,
      coaches,
    }
  } catch (error) {
    console.error("Error fetching user counts:", error)
    return {
      total: 0,
      athletes: 0,
      trainers: 0,
      coaches: 0,
    }
  }
}
