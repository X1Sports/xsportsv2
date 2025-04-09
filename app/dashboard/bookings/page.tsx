"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, Clock, MapPin, User, Video, X } from "lucide-react"
import Link from "next/link"

export default function BookingsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Mock data for upcoming bookings
  const upcomingBookings = [
    {
      id: 1,
      title: "Basketball Training",
      trainer: "Coach Michael Johnson",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      time: "10:00 AM - 11:30 AM",
      location: "Downtown Sports Center",
      type: "In Person",
      status: "confirmed",
    },
    {
      id: 2,
      title: "Strength & Conditioning",
      trainer: "Sarah Williams",
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      time: "3:00 PM - 4:00 PM",
      location: "Online Session",
      type: "Virtual",
      status: "confirmed",
    },
    {
      id: 3,
      title: "Speed Training",
      trainer: "Coach David Chen",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      time: "9:00 AM - 10:30 AM",
      location: "City Track & Field",
      type: "In Person",
      status: "pending",
    },
  ]

  // Mock data for past bookings
  const pastBookings = [
    {
      id: 101,
      title: "Basketball Skills",
      trainer: "Coach Michael Johnson",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      time: "10:00 AM - 11:30 AM",
      location: "Downtown Sports Center",
      type: "In Person",
      status: "completed",
    },
    {
      id: 102,
      title: "Nutrition Consultation",
      trainer: "Dr. Lisa Thompson",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      time: "2:00 PM - 3:00 PM",
      location: "Online Session",
      type: "Virtual",
      status: "completed",
    },
  ]

  // Function to highlight dates with bookings on the calendar
  const isDayWithBooking = (day: Date) => {
    return upcomingBookings.some(
      (booking) =>
        booking.date.getDate() === day.getDate() &&
        booking.date.getMonth() === day.getMonth() &&
        booking.date.getFullYear() === day.getFullYear(),
    )
  }

  return (
    <AuthGuard>
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Training Schedule</h1>
            <p className="text-gray-600">Manage your upcoming and past training sessions</p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link href="/trainers/search">Book New Session</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="upcoming" className="space-y-6">
              <TabsList className="grid grid-cols-2 w-full max-w-md">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-6">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="overflow-hidden border-l-4 rounded-lg shadow-md"
                      style={{
                        backgroundColor: "#333333",
                        borderLeftColor: booking.status === "confirmed" ? "#22c55e" : "#f59e0b",
                      }}
                    >
                      <div className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div
                            className="p-6 md:w-1/4 flex flex-col justify-center items-center text-center"
                            style={{ backgroundColor: "#444444" }}
                          >
                            <p className="text-lg font-bold text-white">
                              {booking.date.toLocaleDateString("en-US", { weekday: "short" })}
                            </p>
                            <p className="text-3xl font-bold my-1 text-white">{booking.date.getDate()}</p>
                            <p className="text-lg text-white">
                              {booking.date.toLocaleDateString("en-US", { month: "short" })}
                            </p>
                            <Badge
                              className={`mt-2 ${booking.status === "confirmed" ? "bg-green-500" : "bg-amber-500"}`}
                            >
                              {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                            </Badge>
                          </div>

                          <div className="p-6 md:w-3/4">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                              <div>
                                <h3 className="text-xl font-bold mb-2 text-white">{booking.title}</h3>
                                <div className="flex items-center text-gray-300 mb-1">
                                  <User className="h-4 w-4 mr-2" />
                                  <span>{booking.trainer}</span>
                                </div>
                                <div className="flex items-center text-gray-300 mb-1">
                                  <Clock className="h-4 w-4 mr-2" />
                                  <span>{booking.time}</span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                  {booking.type === "Virtual" ? (
                                    <Video className="h-4 w-4 mr-2" />
                                  ) : (
                                    <MapPin className="h-4 w-4 mr-2" />
                                  )}
                                  <span>{booking.location}</span>
                                </div>
                              </div>

                              <div className="mt-4 md:mt-0 flex flex-col gap-2">
                                <Button size="sm">Reschedule</Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center text-white border-gray-600 hover:bg-gray-700"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 rounded-lg" style={{ backgroundColor: "#333333" }}>
                    <CalendarClock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-white">No upcoming sessions</h3>
                    <p className="text-gray-300 mb-4">You don't have any training sessions scheduled yet.</p>
                    <Button asChild>
                      <Link href="/trainers/search">Find a Trainer</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-6">
                {pastBookings.length > 0 ? (
                  pastBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="overflow-hidden border-l-4 rounded-lg shadow-md"
                      style={{
                        backgroundColor: "#333333",
                        borderLeftColor: "#6b7280",
                      }}
                    >
                      <div className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div
                            className="p-6 md:w-1/4 flex flex-col justify-center items-center text-center"
                            style={{ backgroundColor: "#444444" }}
                          >
                            <p className="text-lg font-bold text-white">
                              {booking.date.toLocaleDateString("en-US", { weekday: "short" })}
                            </p>
                            <p className="text-3xl font-bold my-1 text-white">{booking.date.getDate()}</p>
                            <p className="text-lg text-white">
                              {booking.date.toLocaleDateString("en-US", { month: "short" })}
                            </p>
                            <Badge className="mt-2 bg-gray-500">Completed</Badge>
                          </div>

                          <div className="p-6 md:w-3/4">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                              <div>
                                <h3 className="text-xl font-bold mb-2 text-white">{booking.title}</h3>
                                <div className="flex items-center text-gray-300 mb-1">
                                  <User className="h-4 w-4 mr-2" />
                                  <span>{booking.trainer}</span>
                                </div>
                                <div className="flex items-center text-gray-300 mb-1">
                                  <Clock className="h-4 w-4 mr-2" />
                                  <span>{booking.time}</span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                  {booking.type === "Virtual" ? (
                                    <Video className="h-4 w-4 mr-2" />
                                  ) : (
                                    <MapPin className="h-4 w-4 mr-2" />
                                  )}
                                  <span>{booking.location}</span>
                                </div>
                              </div>

                              <div className="mt-4 md:mt-0 flex flex-col gap-2">
                                <Button size="sm">Leave Review</Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-white border-gray-600 hover:bg-gray-700"
                                >
                                  Book Again
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 rounded-lg" style={{ backgroundColor: "#333333" }}>
                    <CalendarClock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-white">No past sessions</h3>
                    <p className="text-gray-300">Your completed training sessions will appear here.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <div className="rounded-lg shadow-md p-4 mb-6" style={{ backgroundColor: "#333333" }}>
              <div className="p-2">
                <h2 className="text-xl font-bold mb-2 text-white">Calendar</h2>
                <p className="text-gray-300 text-sm mb-4">View your schedule at a glance</p>
              </div>
              <div className="p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border border-gray-600"
                  modifiers={{
                    booked: (date) => isDayWithBooking(date),
                  }}
                  modifiersStyles={{
                    booked: { backgroundColor: "#1e40af", color: "white", fontWeight: "bold" },
                  }}
                />

                <div className="mt-4">
                  <h4 className="font-medium mb-2 text-white">Legend</h4>
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
                    <span className="text-sm text-gray-300">Booked Session</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-800 mr-2"></div>
                    <span className="text-sm text-gray-300">Selected Date</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow-md p-4" style={{ backgroundColor: "#333333" }}>
              <div className="p-2">
                <h2 className="text-xl font-bold mb-4 text-white">Quick Actions</h2>
              </div>
              <div className="p-2 space-y-2">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/trainers/search" className="text-white border-gray-600 hover:bg-gray-700">
                    <User className="mr-2 h-4 w-4" />
                    Find New Trainer
                  </Link>
                </Button>
                <Button className="w-full justify-start text-white border-gray-600 hover:bg-gray-700" variant="outline">
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Set Availability
                </Button>
                <Button className="w-full justify-start text-white border-gray-600 hover:bg-gray-700" variant="outline">
                  <Video className="mr-2 h-4 w-4" />
                  Join Virtual Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
