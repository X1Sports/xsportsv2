"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/firebase-context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (user) {
        try {
          // Check if user has a profile
          const userDoc = await getDoc(doc(db, "users", user.uid))
          const userData = userDoc.data()

          if (userData?.userType === "trainer") {
            // Check if trainer profile exists
            const trainerSnapshot = await getDoc(doc(db, "trainers", user.uid))

            if (!trainerSnapshot.exists()) {
              // Redirect to profile creation if no trainer profile exists
              router.push("/create-profile")
            }
          } else if (userData?.userType === "athlete") {
            // Check if athlete profile exists
            const athleteSnapshot = await getDoc(doc(db, "athletes", user.uid))

            if (!athleteSnapshot.exists()) {
              // Redirect to athlete profile creation if no athlete profile exists
              router.push("/create-athlete-profile")
            }
          }
        } catch (error) {
          console.error("Error checking profile completion:", error)
        }
      }
    }

    checkProfileCompletion()
  }, [user, router])

  return <div>{children}</div>
}
