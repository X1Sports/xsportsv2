"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { EnhancedSignUpForm } from "@/components/auth/enhanced-sign-up-form"

export default function SignUpPage() {
  const searchParams = useSearchParams()

  // Handle role parameter from URL
  useEffect(() => {
    const role = searchParams.get("role")
    if (role && ["athlete", "trainer", "coach"].includes(role)) {
      localStorage.setItem("selectedRole", role)
    }
  }, [searchParams])

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-8 text-center text-foreground">Join X:1 Sports</h1>
          <EnhancedSignUpForm />
        </div>
      </div>
    </div>
  )
}
