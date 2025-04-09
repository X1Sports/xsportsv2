"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Calendar, Clock, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"

export default function ConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")

  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) {
        toast({
          title: "Error",
          description: "Missing booking information",
          variant: "destructive",
        })
        router.push("/")
        return
      }

      try {
        setLoading(true)
        // Fetch the booking data from Firestore
        const bookingDoc = await getDoc(doc(db, "bookings", bookingId))

        if (bookingDoc.exists()) {
          setBooking(bookingDoc.data())
        } else {
          // If no data found, use mock data
          toast({
            title: "Booking not found",
            description: "Using sample data instead",
            variant: "destructive",
          })

          // Use mock data
          setBooking({
            id: bookingId,
            trainerId: "t1",
            trainerName: "John Davis",
            date: new Date().toISOString(),
            timeSlot: "10:00 AM",
            package: "Single",
            price: 75,
            status: "confirmed",
            createdAt: new Date().toISOString(),
          })
        }
      } catch (error) {
        console.error("Error fetching booking data:", error)
        toast({
          title: "Error",
          description: "Failed to load booking data",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    fetchBookingData()
  }, [bookingId, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const bookingDate = booking?.date ? new Date(booking.date) : new Date()

  return (
    <div className="container max-w-2xl px-4 py-12 mx-auto text-center">
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
        <p className="text-muted-foreground mt-2">
          Your session with {booking?.trainerName} has been successfully booked.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>Reference ID: {booking?.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm">{format(bookingDate, "EEEE, MMMM d, yyyy")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm">{booking?.timeSlot}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Trainer</span>
              <span className="font-medium">{booking?.trainerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Package</span>
              <span>{booking?.package}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className="text-green-600 font-medium capitalize">{booking?.status}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total Paid</span>
              <span>${booking?.price.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/dashboard/bookings">View My Bookings</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
