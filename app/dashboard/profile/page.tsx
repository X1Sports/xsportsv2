"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/firebase-context"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  Loader2,
  ExternalLink,
  MapPin,
  Calendar,
  Clock,
  Globe,
  DollarSign,
  CreditCard,
  Wallet,
  BarChart,
} from "lucide-react"
import { ProfileHeader } from "@/components/profile/profile-header"
import Image from "next/image"
import { getProfileImageUrl } from "@/utils/image-utils"

export default function ProfilePage() {
  const { user, userRole } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  })

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || !userRole) return

      console.log("Dashboard Profile - User data:", user)
      console.log("Dashboard Profile - User photoURL:", user?.photoURL)

      try {
        setLoading(true)
        let profileDoc

        // Fetch the appropriate profile based on user role
        if (userRole === "athlete") {
          profileDoc = await getDoc(doc(db, "athletes", user.uid))
        } else if (userRole === "trainer") {
          profileDoc = await getDoc(doc(db, "trainers", user.uid))
        } else if (userRole === "coach") {
          profileDoc = await getDoc(doc(db, "coaches", user.uid))
        }

        if (profileDoc && profileDoc.exists()) {
          const data = profileDoc.data()
          console.log("Profile data from Firestore:", data)

          // Check for profile image in the profile data
          const profileImageUrl = getProfileImageUrl(user, data)
          console.log("Resolved profile image URL:", profileImageUrl)

          setProfileData(data)
          setFormData({
            displayName: user.displayName || "",
            email: user.email || "",
            phone: data.phone || "",
            location: data.location || "",
            bio: data.bio || "",
          })
        } else {
          // If no profile exists, use basic user data
          setFormData({
            displayName: user.displayName || "",
            email: user.email || "",
            phone: "",
            location: "",
            bio: "",
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [user, userRole])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !userRole) return

    try {
      setSaving(true)
      let collectionName = ""

      // Determine which collection to update
      if (userRole === "athlete") {
        collectionName = "athletes"
      } else if (userRole === "trainer") {
        collectionName = "trainers"
      } else if (userRole === "coach") {
        collectionName = "coaches"
      }

      if (collectionName) {
        // Update profile in the appropriate collection
        await updateDoc(doc(db, collectionName, user.uid), {
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          updatedAt: new Date(),
        })

        toast({
          title: "Success",
          description: "Your profile has been updated successfully.",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getRoleLabel = () => {
    switch (userRole) {
      case "athlete":
        return "Athlete"
      case "trainer":
        return "Trainer"
      case "coach":
        return "Coach"
      case "admin":
        return "Administrator"
      default:
        return "User"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="edit">Edit Profile</TabsTrigger>
            {userRole === "trainer" && <TabsTrigger value="billing">Billing & Payments</TabsTrigger>}
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Profile Header */}
              <ProfileHeader user={user} profileData={profileData} userRole={userRole || ""} isOwnProfile={true} />

              {/* Profile Details */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column - Achievements & Credentials */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Achievements & Credentials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profileData ? (
                      <div className="space-y-6">
                        {profileData.certifications && profileData.certifications.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium mb-2">Certifications</h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {profileData.certifications.map((cert: string, index: number) => (
                                <li key={index}>{cert}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {profileData.awards && profileData.awards.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium mb-2">Awards</h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {profileData.awards.map((award: string, index: number) => (
                                <li key={index}>{award}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {profileData.education && profileData.education.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium mb-2">Education</h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {profileData.education.map((edu: string, index: number) => (
                                <li key={index}>{edu}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {profileData.teams && profileData.teams.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium mb-2">Teams</h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {profileData.teams.map((team: string, index: number) => (
                                <li key={index}>{team}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Experience */}
                        {profileData.experience && (
                          <div>
                            <h3 className="text-lg font-medium mb-2">Experience</h3>
                            <p>{profileData.experience}</p>
                          </div>
                        )}

                        {/* Level for Athletes */}
                        {userRole === "athlete" && profileData.level && (
                          <div>
                            <h3 className="text-lg font-medium mb-2">Current Level</h3>
                            <p>{profileData.level}</p>
                          </div>
                        )}

                        {/* Specialty for Trainers */}
                        {userRole === "trainer" && profileData.specialty && (
                          <div>
                            <h3 className="text-lg font-medium mb-2">Specialty</h3>
                            <p>{profileData.specialty}</p>
                          </div>
                        )}

                        {/* Price for Trainers */}
                        {userRole === "trainer" && profileData.price && (
                          <div>
                            <h3 className="text-lg font-medium mb-2">Hourly Rate</h3>
                            <p>${profileData.price}</p>
                          </div>
                        )}

                        {!profileData.certifications?.length &&
                          !profileData.awards?.length &&
                          !profileData.education?.length &&
                          !profileData.teams?.length &&
                          !profileData.experience &&
                          !profileData.level &&
                          !profileData.specialty &&
                          !profileData.price && (
                            <p className="text-muted-foreground italic">No achievements or credentials added yet.</p>
                          )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No profile information available.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Middle Column - Media & Availability */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Availability */}
                      <div>
                        {profileData?.availability?.days && profileData.availability.days.length > 0 ? (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium flex items-center gap-1 mb-2">
                                <Calendar className="h-4 w-4" /> Days Available
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {profileData.availability.days.map((day: string, index: number) => (
                                  <Badge key={index} variant="outline">
                                    {day}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {profileData.availability.hours && (
                              <div>
                                <h4 className="font-medium flex items-center gap-1 mb-2">
                                  <Clock className="h-4 w-4" /> Hours
                                </h4>
                                <p>{profileData.availability.hours}</p>
                              </div>
                            )}

                            {profileData.timeZone && (
                              <div>
                                <h4 className="font-medium flex items-center gap-1 mb-2">
                                  <Globe className="h-4 w-4" /> Time Zone
                                </h4>
                                <p>{profileData.timeZone}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground italic">No availability information added yet.</p>
                        )}
                      </div>

                      {/* Preferred Locations */}
                      {profileData?.preferredLocations && profileData.preferredLocations.length > 0 && (
                        <div>
                          <h4 className="font-medium flex items-center gap-1 mb-2">
                            <MapPin className="h-4 w-4" /> Preferred Locations
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {profileData.preferredLocations.map((location: string, index: number) => (
                              <Badge key={index} variant="outline">
                                {location}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Right Column - Social & Media */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Social & Media</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Social Media Links */}
                      {profileData?.socialLinks && Object.values(profileData.socialLinks).some((link) => link) && (
                        <div>
                          <h3 className="text-lg font-medium mb-3">Social Media</h3>
                          <div className="space-y-2">
                            {profileData.socialLinks.twitter && (
                              <div className="flex items-center">
                                <span className="font-medium mr-2">Twitter:</span>
                                <a
                                  href={profileData.socialLinks.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  {new URL(profileData.socialLinks.twitter).pathname.replace(/^\/+/, "")}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            )}
                            {profileData.socialLinks.instagram && (
                              <div className="flex items-center">
                                <span className="font-medium mr-2">Instagram:</span>
                                <a
                                  href={profileData.socialLinks.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  {new URL(profileData.socialLinks.instagram).pathname.replace(/^\/+/, "")}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            )}
                            {profileData.socialLinks.tiktok && (
                              <div className="flex items-center">
                                <span className="font-medium mr-2">TikTok:</span>
                                <a
                                  href={profileData.socialLinks.tiktok}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  {new URL(profileData.socialLinks.tiktok).pathname.replace(/^\/+/, "")}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            )}
                            {profileData.socialLinks.youtube && (
                              <div className="flex items-center">
                                <span className="font-medium mr-2">YouTube:</span>
                                <a
                                  href={profileData.socialLinks.youtube}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  {new URL(profileData.socialLinks.youtube).pathname.split("/").pop() || "Channel"}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Video Links */}
                      {profileData?.videoLinks && profileData.videoLinks.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-3">Videos</h3>
                          <div className="space-y-2">
                            {profileData.videoLinks.map((link: string, index: number) => (
                              <div key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
                                <div className="flex-1 truncate">{link}</div>
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                >
                                  View
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Gallery Images */}
                      {profileData?.galleryImages && profileData.galleryImages.length > 0 ? (
                        <div>
                          <h3 className="text-lg font-medium mb-3">Gallery</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {profileData.galleryImages.map((image: string, index: number) => (
                              <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`Gallery ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Gallery</h3>
                          <p className="text-muted-foreground italic">No gallery images added yet.</p>
                        </div>
                      )}

                      {!profileData?.socialLinks &&
                        !profileData?.videoLinks?.length &&
                        !profileData?.galleryImages?.length && (
                          <p className="text-muted-foreground italic">No social media or media content added yet.</p>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* NCAA Details if available */}
              {profileData &&
                profileData.ncaaDetails &&
                Object.values(profileData.ncaaDetails).some(
                  (value) => value && (typeof value === "string" || (Array.isArray(value) && value.length > 0)),
                ) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>NCAA Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          {profileData.ncaaDetails.college && (
                            <div>
                              <h4 className="font-medium">College/University</h4>
                              <p>{profileData.ncaaDetails.college}</p>
                            </div>
                          )}

                          {profileData.ncaaDetails.division && (
                            <div>
                              <h4 className="font-medium">Division</h4>
                              <p>{profileData.ncaaDetails.division}</p>
                            </div>
                          )}

                          {profileData.ncaaDetails.sport && (
                            <div>
                              <h4 className="font-medium">Sport</h4>
                              <p>{profileData.ncaaDetails.sport}</p>
                            </div>
                          )}

                          {profileData.ncaaDetails.yearsParticipated && (
                            <div>
                              <h4 className="font-medium">Years Participated</h4>
                              <p>{profileData.ncaaDetails.yearsParticipated}</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          {profileData.ncaaDetails.eligibilityStatus && (
                            <div>
                              <h4 className="font-medium">Eligibility Status</h4>
                              <p>{profileData.ncaaDetails.eligibilityStatus}</p>
                            </div>
                          )}

                          {profileData.ncaaDetails.scholarshipType && (
                            <div>
                              <h4 className="font-medium">Scholarship Type</h4>
                              <p>{profileData.ncaaDetails.scholarshipType}</p>
                            </div>
                          )}

                          {profileData.ncaaDetails.recruitingStatus && (
                            <div>
                              <h4 className="font-medium">Recruiting Status</h4>
                              <p>{profileData.ncaaDetails.recruitingStatus}</p>
                            </div>
                          )}
                        </div>

                        {profileData.ncaaDetails.achievements && profileData.ncaaDetails.achievements.length > 0 && (
                          <div className="md:col-span-2">
                            <h4 className="font-medium mb-2">NCAA Achievements</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {profileData.ncaaDetails.achievements.map((achievement: string, index: number) => (
                                <li key={index}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>
          </TabsContent>

          {/* Edit Profile Tab */}
          <TabsContent value="edit">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Use our comprehensive profile editor to update all aspects of your profile:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Basic information (name, contact details, bio)</li>
                  <li>Media (profile photos, gallery images, videos)</li>
                  <li>Achievements (certifications, awards, education)</li>
                  <li>Availability and preferences</li>
                  <li>Social media links</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button onClick={() => router.push("/dashboard/profile/edit")}>Go to Profile Editor</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Billing & Payments Tab - Only for Trainers */}
          {userRole === "trainer" && (
            <TabsContent value="billing">
              <div className="space-y-6">
                {/* Payment Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage how you receive payments from clients</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <CreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Direct Deposit</h3>
                          <p className="text-sm text-gray-500">Payments go directly to your bank account</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <Wallet className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">PayPal</h3>
                          <p className="text-sm text-gray-500">Connect your PayPal account</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Stripe</h3>
                          <p className="text-sm text-gray-500">Connect your Stripe account</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>

                    <Button className="w-full">Add Payment Method</Button>
                  </CardContent>
                </Card>

                {/* Pricing & Packages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing & Packages</CardTitle>
                    <CardDescription>Set up your pricing structure and session packages</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Base Hourly Rate</h3>
                          <p className="text-sm text-gray-500">Your standard rate for a 1-hour session</p>
                        </div>
                        <div className="font-medium">${profileData?.price || 0}</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">5-Session Package</h3>
                          <p className="text-sm text-gray-500">Discounted rate for 5 sessions</p>
                        </div>
                        <div className="font-medium">${(profileData?.price || 0) * 4.5}</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">10-Session Package</h3>
                          <p className="text-sm text-gray-500">Discounted rate for 10 sessions</p>
                        </div>
                        <div className="font-medium">${(profileData?.price || 0) * 8.5}</div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      Edit Pricing & Packages
                    </Button>
                  </CardContent>
                </Card>

                {/* Transaction History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View your recent payments and earnings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">Session with Alex Johnson</h4>
                          <p className="text-sm text-gray-500">Mar 15, 2025 • 1 hour • Basketball</p>
                        </div>
                        <div className="text-green-600 font-medium">${profileData?.price || 75}</div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">Session with Sarah Williams</h4>
                          <p className="text-sm text-gray-500">Mar 12, 2025 • 1 hour • Basketball</p>
                        </div>
                        <div className="text-green-600 font-medium">${profileData?.price || 75}</div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">5-Session Package - Mike Davis</h4>
                          <p className="text-sm text-gray-500">Mar 10, 2025 • 5 hours • Basketball</p>
                        </div>
                        <div className="text-green-600 font-medium">${(profileData?.price || 75) * 4.5}</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button variant="outline" className="w-full">
                        View All Transactions
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Earnings Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Earnings Overview</CardTitle>
                    <CardDescription>Summary of your earnings and financial performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-blue-600">$1,275</div>
                        <p className="text-sm text-gray-600">This Month</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-600">$4,850</div>
                        <p className="text-sm text-gray-600">Year to Date</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium flex items-center gap-1 mb-2">
                          <BarChart className="h-4 w-4" /> Monthly Trend
                        </h3>
                        <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">Earnings chart will appear here</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Top Earning Services</h3>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Basketball Training</span>
                              <span className="text-sm font-medium">75%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Strength & Conditioning</span>
                              <span className="text-sm font-medium">15%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Group Sessions</span>
                              <span className="text-sm font-medium">10%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "10%" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button onClick={() => router.push("/dashboard/income")} className="w-full">
                        View Detailed Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Account Settings Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Account Type</h3>
                  <div className="flex items-center space-x-2">
                    <Badge>{getRoleLabel()}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Account type cannot be changed. Please contact support.
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Password</h3>
                  <Button variant="outline" onClick={() => router.push("/reset-password")}>
                    Reset Password
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  )
}
