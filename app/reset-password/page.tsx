"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAuth, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validatingCode, setValidatingCode] = useState(true)
  const [email, setEmail] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const oobCode = searchParams.get("oobCode")

  const auth = getAuth()

  useEffect(() => {
    if (!oobCode) {
      setError("Invalid password reset link. Please request a new one.")
      setValidatingCode(false)
      return
    }

    // Verify the password reset code
    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        setEmail(email)
        setValidatingCode(false)
      })
      .catch((error) => {
        console.error("Error verifying reset code:", error)
        setError("This password reset link is invalid or has expired. Please request a new one.")
        setValidatingCode(false)
      })
  }, [oobCode, auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!oobCode) {
      setError("Invalid password reset link.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    setLoading(true)
    setError("")

    try {
      await confirmPasswordReset(auth, oobCode, password)
      setSuccess(true)

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/sign-in")
      }, 3000)
    } catch (error: any) {
      console.error("Error resetting password:", error)
      setError(error.message || "Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (validatingCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-xl text-center">Verifying your request...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-xl text-center">Password Reset Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <p className="text-center text-sm text-gray-400">Redirecting to sign in page...</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <a href="/sign-in">Sign In Now</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-xl">Reset Your Password</CardTitle>
          <CardDescription className="text-gray-400">
            {email ? `Create a new password for ${email}` : "Create a new password for your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-900 border-red-800">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
