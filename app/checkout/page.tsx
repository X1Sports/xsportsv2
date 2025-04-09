"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Loader2, Calendar, Clock, CheckCircle2, CreditCard } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const trainerId = searchParams.get("trainerId")
  const dateParam = searchParams.get("date")
  const timeSlot = searchParams.get("timeSlot")
  const packageName = searchParams.get("package")

  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [trainer, setTrainer] = useState<any>(null)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    paypalEmail: "",
    paypalPassword: "",
  })

  const date = dateParam ? new Date(dateParam) : null

  useEffect(() => {
    const fetchTrainerData = async () => {
      if (!trainerId) {
        toast({
          title: "Error",
          description: "Missing trainer information",
          variant: "destructive",
        })
        router.push("/trainers")
        return
      }

      try {
        setLoading(true)
        // Fetch the trainer data from Firestore
        const trainerDoc = await getDoc(doc(db, "trainers", trainerId))

        if (trainerDoc.exists()) {
          const data = trainerDoc.data()
          setTrainer({
            id: trainerId,
            name: data.name || "Unknown Trainer",
            title: data.title || data.specialty || "Trainer",
            price: data.price || 50,
            profileImageURL: data.profileImageURL || data.photoURL || "/placeholder.svg",
            packages: data.packages || [
              { name: "Single", price: data.price || 50, isActive: true, description: "Single training session" },
            ],
          })

          // Find the selected package
          const pkg = data.packages?.find((p: any) => p.name === packageName) || {
            name: "Single",
            price: data.price || 50,
            description: "Single training session",
          }
          setSelectedPackage(pkg)
        } else {
          // If no data found, use mock data
          toast({
            title: "Trainer not found",
            description: "Using sample data instead",
            variant: "destructive",
          })

          // Use mock data
          const mockTrainer = {
            id: trainerId,
            name: "John Davis",
            title: "Elite Performance Coach",
            price: 75,
            profileImageURL: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?q=80&w=400&auto=format",
            packages: [
              {
                name: "Single",
                price: 75,
                description: "Perfect for trying out or occasional training",
              },
              { name: "5 Pack", price: 350, description: "Save $25 with our 5 session package" },
              { name: "10 Pack", price: 650, description: "Our best value - save $100" },
            ],
          }
          setTrainer(mockTrainer)

          // Find the selected package
          const pkg = mockTrainer.packages.find((p: any) => p.name === packageName) || mockTrainer.packages[0]
          setSelectedPackage(pkg)
        }
      } catch (error) {
        console.error("Error fetching trainer data:", error)
        toast({
          title: "Error",
          description: "Failed to load trainer data",
          variant: "destructive",
        })
        router.push("/trainers")
      } finally {
        setLoading(false)
      }
    }

    fetchTrainerData()
  }, [trainerId, packageName, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!trainer || !date || !timeSlot || !selectedPackage) {
      toast({
        title: "Error",
        description: "Missing booking information",
        variant: "destructive",
      })
      return
    }

    try {
      setProcessing(true)

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a booking ID
      const bookingId = uuidv4()

      // In a real app, you would process payment here
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Save booking to Firestore
      await setDoc(doc(db, "bookings", bookingId), {
        id: bookingId,
        trainerId: trainer.id,
        trainerName: trainer.name,
        date: date.toISOString(),
        timeSlot,
        package: selectedPackage.name,
        price: selectedPackage.price,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      })

      // Navigate to confirmation page
      router.push(`/checkout/confirmation?bookingId=${bookingId}`)
    } catch (error) {
      console.error("Error processing payment:", error)
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
      setProcessing(false)
    }
  }

  const processPayment = async () => {
    if (paymentMethod === "apple-pay") {
      setProcessing(true)
      // Simulate redirect to Apple Pay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a booking ID
      const bookingId = uuidv4()

      // In a real app, you would process payment here
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Save booking to Firestore
      await setDoc(doc(db, "bookings", bookingId), {
        id: bookingId,
        trainerId: trainer.id,
        trainerName: trainer.name,
        date: date.toISOString(),
        timeSlot,
        package: selectedPackage.name,
        price: selectedPackage.price,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      })

      // Navigate to confirmation page
      router.push(`/checkout/confirmation?bookingId=${bookingId}`)
    } else {
      handleSubmit
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Calculate taxes and total
  const subtotal = selectedPackage?.price || 0
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">Complete your booking with {trainer?.name}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main checkout form - 2/3 width */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Review your session details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={trainer?.profileImageURL || "/placeholder.svg"}
                    alt={trainer?.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{trainer?.name}</h3>
                  <p className="text-sm text-muted-foreground">{trainer?.title}</p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm">{date ? format(date, "EEEE, MMMM d, yyyy") : "Not selected"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm">{timeSlot || "Not selected"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Package</p>
                    <p className="text-sm">{selectedPackage?.name || "Single Session"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Select your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <div className="flex items-center space-x-2 border p-3 rounded-lg">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-5 w-5" />
                    <span>Credit / Debit Card</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-lg">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082h-2.19a1.87 1.87 0 0 0-1.846 1.582l-1.187 7.527h5.47a.641.641 0 0 0 .633-.74l.44-2.78a.641.641 0 0 1 .633-.739h1.497c4.299 0 6.855-2.09 7.744-6.222.382-1.775.196-3.281-.988-4.423z" />
                    </svg>
                    <span>PayPal</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-lg">
                  <RadioGroupItem value="apple-pay" id="apple-pay" />
                  <Label htmlFor="apple-pay" className="flex items-center gap-2 cursor-pointer">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.0007 0C8.8217 0 5.9887 2.343 5.9887 5.234C5.9887 7.243 7.1867 8.883 9.0267 10.312C9.3347 10.56 9.3997 10.719 9.4007 10.729C7.7517 12.308 7.0207 13.957 7.0207 16.026C7.0207 19.546 9.8497 21.999 13.0007 21.999C15.1797 21.999 17.1577 20.57 17.8887 18.881C17.8897 18.871 17.8907 18.861 17.8907 18.851C19.6607 17.282 20.3917 15.633 20.3917 13.564C20.3917 10.044 17.5627 7.591 14.4117 7.591C12.2327 7.591 10.2547 9.02 9.5237 10.709C9.5227 10.719 9.5217 10.729 9.5217 10.739C11.1707 9.16 11.9017 7.511 11.9017 5.442C11.9017 1.922 9.0727 0 12.0007 0ZM13.0007 20.62C10.5817 20.62 8.6417 18.68 8.6417 16.261C8.6417 14.212 9.8397 12.883 11.6797 11.314C11.9877 11.066 12.0527 10.907 12.0537 10.897C13.7027 12.476 14.4337 14.125 14.4337 16.194C14.4337 18.243 13.2357 19.572 11.3967 21.141C11.0887 21.389 11.0227 21.548 11.0227 21.558C12.6717 20.03 13.4027 18.381 13.4027 16.312C13.4027 14.263 12.2047 12.934 10.3647 11.365C10.0567 11.117 10.0017 10.958 10.0007 10.948C11.6497 12.527 12.3807 14.176 12.3807 16.245C12.3807 18.664 14.3207 20.62 17.0007 20.62C19.0597 20.62 20.9997 18.68 20.9997 16.261C20.9997 14.212 19.8017 12.883 17.9617 11.314C17.6537 11.066 17.5887 10.907 17.5877 10.897C19.2367 12.476 19.9677 14.176 19.9677 16.245C19.9677 18.664 17.9147 20.62 15.0007 20.62Z" />
                    </svg>
                    <span>Apple Pay</span>
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "credit-card" && (
                <div className="space-y-4 mt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      placeholder="John Smith"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        name="cvc"
                        placeholder="123"
                        value={formData.cvc}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "paypal" && (
                <div className="space-y-4 mt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="paypalEmail">PayPal Email</Label>
                    <Input
                      id="paypalEmail"
                      name="paypalEmail"
                      placeholder="your.email@paypal.com"
                      value={formData.paypalEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="paypalPassword">PayPal Password</Label>
                    <Input
                      id="paypalPassword"
                      name="paypalPassword"
                      type="password"
                      placeholder="Enter your PayPal password"
                      value={formData.paypalPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You will be redirected to PayPal to complete your payment
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" size="lg" disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${total.toFixed(2)}`
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Order summary - 1/3 width */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{selectedPackage?.name || "Training Session"}</span>
                <span>${selectedPackage?.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="mt-6 text-sm text-muted-foreground">
                <p>By completing this purchase you agree to our</p>
                <div className="flex gap-1">
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>
                  <span>and</span>
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
