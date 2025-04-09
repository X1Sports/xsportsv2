"use client"

import type React from "react"

import { useAuth } from "@/contexts/firebase-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  fallbackUrl?: string
}

export function AuthGuard({ children, fallbackUrl = "/sign-in" }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Redirect if not logged in (only on client side)
  useEffect(() => {
    if (isClient && !loading && !user) {
      router.push(fallbackUrl)
    }
  }, [user, loading, router, isClient, fallbackUrl])

  // Show loading state while checking authentication
  if (loading || !isClient) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 py-12 flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // If not authenticated and on client side, return null (will redirect in useEffect)
  if (!user && isClient) {
    return null
  }

  // User is authenticated, render children
  return <>{children}</>
}
