"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/firebase-context"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Upload, X, Plus, Video } from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"
import { sportsList } from "@/data/mock-profiles"
import Image from "next/image"

export default function EditProfilePage() {
  const { user, userRole } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)

  // Basic info
  const [basicInfo, setBasicInfo] = useState({
    displayName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    sports: [] as string[],
    specialty: "",
    price: 0,
    experience: "",
    level: "",
  })

  // Media
  const [media, setMedia] = useState({
    photoURL: "",
    headerImageURL: "", // Add this line
    galleryImages: [] as string[],
    videoLinks: [] as string[],
    socialLinks: {
      twitter: "",
      instagram: "",
      tiktok: "",
      youtube: "",
    },
  })

  // Achievements & Credentials
  const [achievements, setAchievements] = useState({
    certifications: [] as string[],
    awards: [] as string[],
    education: [] as string[],
    teams: [] as string[],
  })

  // Availability
  const [availability, setAvailability] = useState({
    days: [] as string[],
    hours: "",
    timeZone: "",
    preferredLocations: [] as string[],
  })

  // NCAA Details
  const [ncaaDetails, setNcaaDetails] = useState({
    eligibilityStatus: "",
    division: "",
    college: "",
    sport: "",
    yearsParticipated: "",
    scholarshipType: "",
    achievements: [] as string[],
    recruitingStatus: "",
  })

  // New fields
  const [newCertification, setNewCertification] = useState("")
  const [newAward, setNewAward] = useState("")
  const [newEducation, setNewEducation] = useState("")
  const [newTeam, setNewTeam] = useState("")
  const [newVideoLink, setNewVideoLink] = useState("")
  const [newPreferredLocation, setNewPreferredLocation] = useState("")
  const [newNcaaAchievement, setNewNcaaAchievement] = useState("")

  const sportOptions = sportsList.map((sport) => ({
    value: sport,
    label: sport,
  }))

  const days = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
  ]

  // Add a reference for the header image file input
  const headerImageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || !userRole) return

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
          setProfileData(data)

          // Set basic info
          setBasicInfo({
            displayName: user.displayName || "",
            email: user.email || "",
            phone: data.phone || "",
            location: data.location || "",
            bio: data.bio || "",
            sports: data.sports || [],
            specialty: data.specialty || "",
            price: data.price || 0,
            experience: data.experience || "",
            level: data.level || "",
          })

          // Set media
          setMedia({
            photoURL: user.photoURL || data.photoURL || "",
            headerImageURL: data.headerImageURL || "", // Add this line
            galleryImages: data.galleryImages || [],
            videoLinks: data.videoLinks || [],
            socialLinks: data.socialLinks || {
              twitter: "",
              instagram: "",
              tiktok: "",
              youtube: "",
            },
          })

          // Set achievements
          setAchievements({
            certifications: data.certifications || [],
            awards: data.awards || [],
            education: data.education || [],
            teams: data.teams || [],
          })

          // Set availability
          setAvailability({
            days: data.availability?.days || [],
            hours: data.availability?.hours || "",
            timeZone: data.timeZone || "EST",
            preferredLocations: data.preferredLocations || [],
          })

          // Set NCAA details
          setNcaaDetails({
            eligibilityStatus: data.ncaaDetails?.eligibilityStatus || "",
            division: data.ncaaDetails?.division || "",
            college: data.ncaaDetails?.college || "",
            sport: data.ncaaDetails?.sport || "",
            yearsParticipated: data.ncaaDetails?.yearsParticipated || "",
            scholarshipType: data.ncaaDetails?.scholarshipType || "",
            achievements: data.ncaaDetails?.achievements || [],
            recruitingStatus: data.ncaaDetails?.recruitingStatus || "",
          })
        } else {
          // If no profile exists, use basic user data
          setBasicInfo({
            displayName: user.displayName || "",
            email: user.email || "",
            phone: "",
            location: "",
            bio: "",
            sports: [],
            specialty: "",
            price: 0,
            experience: "",
            level: "",
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

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBasicInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setMedia((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }))
  }

  const handleDayToggle = (day: string) => {
    const currentDays = [...availability.days]
    const updatedDays = currentDays.includes(day) ? currentDays.filter((d) => d !== day) : [...currentDays, day]

    setAvailability((prev) => ({
      ...prev,
      days: updatedDays,
    }))
  }

  const handleNcaaDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNcaaDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Add a function to handle header image changes
  const handleHeaderImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, upload to Firebase Storage
      // For now, create a local URL
      const reader = new FileReader()
      reader.onload = () => {
        setMedia((prev) => ({ ...prev, headerImageURL: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Add new items
  const addCertification = () => {
    if (newCertification.trim()) {
      setAchievements((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }))
      setNewCertification("")
    }
  }

  const addAward = () => {
    if (newAward.trim()) {
      setAchievements((prev) => ({
        ...prev,
        awards: [...prev.awards, newAward.trim()],
      }))
      setNewAward("")
    }
  }

  const addEducation = () => {
    if (newEducation.trim()) {
      setAchievements((prev) => ({
        ...prev,
        education: [...prev.education, newEducation.trim()],
      }))
      setNewEducation("")
    }
  }

  const addTeam = () => {
    if (newTeam.trim()) {
      setAchievements((prev) => ({
        ...prev,
        teams: [...prev.teams, newTeam.trim()],
      }))
      setNewTeam("")
    }
  }

  const addVideoLink = () => {
    if (newVideoLink.trim()) {
      setMedia((prev) => ({
        ...prev,
        videoLinks: [...prev.videoLinks, newVideoLink.trim()],
      }))
      setNewVideoLink("")
    }
  }

  const addPreferredLocation = () => {
    if (newPreferredLocation.trim()) {
      setAvailability((prev) => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, newPreferredLocation.trim()],
      }))
      setNewPreferredLocation("")
    }
  }

  const addNcaaAchievement = () => {
    if (newNcaaAchievement.trim()) {
      setNcaaDetails((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newNcaaAchievement.trim()],
      }))
      setNewNcaaAchievement("")
    }
  }

  // Remove items
  const removeCertification = (index: number) => {
    setAchievements((prev) => {
      const updated = [...prev.certifications]
      updated.splice(index, 1)
      return { ...prev, certifications: updated }
    })
  }

  const removeAward = (index: number) => {
    setAchievements((prev) => {
      const updated = [...prev.awards]
      updated.splice(index, 1)
      return { ...prev, awards: updated }
    })
  }

  const removeEducation = (index: number) => {
    setAchievements((prev) => {
      const updated = [...prev.education]
      updated.splice(index, 1)
      return { ...prev, education: updated }
    })
  }

  const removeTeam = (index: number) => {
    setAchievements((prev) => {
      const updated = [...prev.teams]
      updated.splice(index, 1)
      return { ...prev, teams: updated }
    })
  }

  const removeVideoLink = (index: number) => {
    setMedia((prev) => {
      const updated = [...prev.videoLinks]
      updated.splice(index, 1)
      return { ...prev, videoLinks: updated }
    })
  }

  const removePreferredLocation = (index: number) => {
    setAvailability((prev) => {
      const updated = [...prev.preferredLocations]
      updated.splice(index, 1)
      return { ...prev, preferredLocations: updated }
    })
  }

  const removeNcaaAchievement = (index: number) => {
    setNcaaDetails((prev) => {
      const updated = [...prev.achievements]
      updated.splice(index, 1)
      return { ...prev, achievements: updated }
    })
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
        // Combine all data
        const updatedData = {
          // Basic info
          phone: basicInfo.phone,
          location: basicInfo.location,
          bio: basicInfo.bio,
          sports: basicInfo.sports,
          specialty: basicInfo.specialty,
          price: basicInfo.price,
          experience: basicInfo.experience,
          level: basicInfo.level,

          // Media
          photoURL: media.photoURL,
          headerImageURL: media.headerImageURL, // Add this line
          galleryImages: media.galleryImages,
          videoLinks: media.videoLinks,
          socialLinks: media.socialLinks,

          // Achievements
          certifications: achievements.certifications,
          awards: achievements.awards,
          education: achievements.education,
          teams: achievements.teams,

          // Availability
          availability: {
            days: availability.days,
            hours: availability.hours,
          },
          timeZone: availability.timeZone,
          preferredLocations: availability.preferredLocations,

          ncaaDetails: {
            eligibilityStatus: ncaaDetails.eligibilityStatus,
            division: ncaaDetails.division,
            college: ncaaDetails.college,
            sport: ncaaDetails.sport,
            yearsParticipated: ncaaDetails.yearsParticipated,
            scholarshipType: ncaaDetails.scholarshipType,
            achievements: ncaaDetails.achievements,
            recruitingStatus: ncaaDetails.recruitingStatus,
          },

          // Metadata
          updatedAt: new Date(),
        }

        // Update profile in the appropriate collection
        await updateDoc(doc(db, collectionName, user.uid), updatedData)

        toast({
          title: "Success",
          description: "Your profile has been updated successfully.",
        })

        // Redirect to profile view
        router.push("/dashboard/profile")
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Your Profile</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard/profile")}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media & Social</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="ncaa">NCAA Details</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic">
              <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: "#333333" }}>
                <h2 className="text-xl font-bold mb-4 text-white">Basic Information</h2>

                <div className="grid gap-6 md:grid-cols-2 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-white">
                      Full Name
                    </Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      value={basicInfo.displayName}
                      onChange={handleBasicInfoChange}
                      disabled
                      className="bg-gray-700 text-white border-gray-600"
                    />
                    <p className="text-xs text-gray-400">Name cannot be changed here. Please contact support.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      value={basicInfo.email}
                      onChange={handleBasicInfoChange}
                      disabled
                      className="bg-gray-700 text-white border-gray-600"
                    />
                    <p className="text-xs text-gray-400">Email cannot be changed here. Please contact support.</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={basicInfo.phone}
                      onChange={handleBasicInfoChange}
                      placeholder="Enter your phone number"
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={basicInfo.location}
                      onChange={handleBasicInfoChange}
                      placeholder="City, State"
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <Label htmlFor="sports" className="text-white">
                    Sports
                  </Label>
                  <MultiSelect
                    options={sportOptions}
                    selected={basicInfo.sports}
                    onChange={(selected) => setBasicInfo((prev) => ({ ...prev, sports: selected }))}
                    placeholder="Select sports..."
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>

                {userRole === "trainer" && (
                  <div className="grid gap-6 md:grid-cols-2 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="specialty" className="text-white">
                        Specialty
                      </Label>
                      <Input
                        id="specialty"
                        name="specialty"
                        value={basicInfo.specialty}
                        onChange={handleBasicInfoChange}
                        placeholder="Your training specialty"
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-white">
                        Hourly Rate ($)
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={basicInfo.price || ""}
                        onChange={handleBasicInfoChange}
                        placeholder="Your hourly rate"
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  </div>
                )}

                {userRole === "athlete" && (
                  <div className="space-y-2 mb-6">
                    <Label htmlFor="level" className="text-white">
                      Current Level
                    </Label>
                    <select
                      id="level"
                      name="level"
                      value={basicInfo.level}
                      onChange={(e) => setBasicInfo((prev) => ({ ...prev, level: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select your level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="High School">High School</option>
                      <option value="College (D1)">College (D1)</option>
                      <option value="College (D2)">College (D2)</option>
                      <option value="College (D3)">College (D3)</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={basicInfo.bio}
                    onChange={handleBasicInfoChange}
                    placeholder="Tell us about yourself"
                    rows={5}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Media & Social Tab */}
            <TabsContent value="media">
              <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: "#333333" }}>
                <h2 className="text-xl font-bold mb-4 text-white">Media & Social Media</h2>

                {/* Profile Photo */}
                <div className="mb-6">
                  <Label className="text-white mb-2 block">Profile Photo</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-600">
                      {media.photoURL ? (
                        <Image src={media.photoURL || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No photo</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <Button type="button" variant="outline" className="mb-1 bg-gray-700 text-white border-gray-600">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                      <p className="text-xs text-gray-400">Recommended: Square image, at least 400x400px</p>
                    </div>
                  </div>
                </div>

                {/* Header Image */}
                <div className="mb-6">
                  <Label className="text-white mb-2 block">Profile Header/Banner Image</Label>
                  <div className="flex flex-col gap-4">
                    <div className="relative w-full h-32 rounded-md overflow-hidden border-2 border-gray-600">
                      {media.headerImageURL ? (
                        <Image
                          src={media.headerImageURL || "/placeholder.svg"}
                          alt="Header"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No header image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        ref={headerImageInputRef}
                        onChange={handleHeaderImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => headerImageInputRef.current?.click()}
                        className="mb-1 bg-gray-700 text-white border-gray-600"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Header Image
                      </Button>
                      <p className="text-xs text-gray-400">Recommended: 1200x300px banner image</p>
                    </div>
                  </div>
                </div>

                {/* Gallery Images */}
                <div className="mb-6">
                  <Label className="text-white mb-2 block">Gallery Images</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-2">
                    {media.galleryImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-md overflow-hidden border border-gray-600"
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Gallery ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...media.galleryImages]
                            updated.splice(index, 1)
                            setMedia((prev) => ({ ...prev, galleryImages: updated }))
                          }}
                          className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-black/70"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    <div className="aspect-square rounded-md border-2 border-dashed border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                      <Plus className="h-8 w-8 text-gray-400" />
                      <span className="text-xs text-gray-400 mt-1">Add Image</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Add photos of your training sessions, facilities, or action shots
                  </p>
                </div>

                {/* Video Links */}
                <div className="mb-6">
                  <Label className="text-white mb-2 block">Video Links</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newVideoLink}
                      onChange={(e) => setNewVideoLink(e.target.value)}
                      placeholder="YouTube or Vimeo URL"
                      className="bg-gray-700 text-white border-gray-600"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addVideoLink()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addVideoLink}
                      variant="outline"
                      className="bg-gray-700 text-white border-gray-600"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {media.videoLinks.length > 0 ? (
                    <div className="space-y-2 mt-3">
                      {media.videoLinks.map((link, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                          <div className="flex items-center">
                            <Video className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-white truncate max-w-[250px] sm:max-w-md">{link}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeVideoLink(index)}
                            className="text-gray-400 hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2">
                      No videos added yet. Add links to your videos to showcase your expertise.
                    </p>
                  )}
                </div>

                {/* Social Media Links */}
                <div>
                  <h3 className="text-lg font-medium mb-3 text-white">Social Media Links</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="text-white">
                        Twitter/X
                      </Label>
                      <Input
                        id="twitter"
                        value={media.socialLinks.twitter}
                        onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                        placeholder="https://twitter.com/yourusername"
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="text-white">
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        value={media.socialLinks.instagram}
                        onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                        placeholder="https://instagram.com/yourusername"
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tiktok" className="text-white">
                        TikTok
                      </Label>
                      <Input
                        id="tiktok"
                        value={media.socialLinks.tiktok}
                        onChange={(e) => handleSocialLinkChange("tiktok", e.target.value)}
                        placeholder="https://tiktok.com/@yourusername"
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="youtube" className="text-white">
                        YouTube
                      </Label>
                      <Input
                        id="youtube"
                        value={media.socialLinks.youtube}
                        onChange={(e) => handleSocialLinkChange("youtube", e.target.value)}
                        placeholder="https://youtube.com/c/yourchannel"
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: "#333333" }}>
                <h2 className="text-xl font-bold mb-4 text-white">Achievements & Credentials</h2>

                {/* Experience */}
                <div className="mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-white">
                      Years of Experience
                    </Label>
                    <Input
                      id="experience"
                      name="experience"
                      value={basicInfo.experience}
                      onChange={handleBasicInfoChange}
                      placeholder="e.g., 5 years, 3 seasons, etc."
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>

                {/* Certifications */}
                <div className="mb-6">
                  <Label className="text-white mb-2 block">Certifications & Credentials</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="Add a certification or credential"
                      className="bg-gray-700 text-white border-gray-600"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addCertification()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addCertification}
                      variant="outline"
                      className="bg-gray-700 text-white border-gray-600"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {achievements.certifications.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {achievements.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="pl-3 pr-2 py-1.5 bg-gray-700 text-white">
                          {cert}
                          <button
                            type="button"
                            onClick={() => removeCertification(index)}
                            className="ml-1 text-gray-400 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2">
                      No certifications added yet. Add your credentials to build trust.
                    </p>
                  )}
                </div>

                {/* Awards */}
                <div className="mb-6">
                  <Label className="text-white mb-2 block">Awards & Honors</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newAward}
                      onChange={(e) => setNewAward(e.target.value)}
                      placeholder="Add an award or honor"
                      className="bg-gray-700 text-white border-gray-600"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addAward()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addAward}
                      variant="outline"
                      className="bg-gray-700 text-white border-gray-600"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {achievements.awards.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {achievements.awards.map((award, index) => (
                        <Badge key={index} variant="secondary" className="pl-3 pr-2 py-1.5 bg-gray-700 text-white">
                          {award}
                          <button
                            type="button"
                            onClick={() => removeAward(index)}
                            className="ml-1 text-gray-400 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2">
                      No awards added yet. Add your achievements to showcase your success.
                    </p>
                  )}
                </div>

                {/* Education */}
                <div className="mb-6">
                  <Label className="text-white mb-2 block">Education & Training</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newEducation}
                      onChange={(e) => setNewEducation(e.target.value)}
                      placeholder="Add education or training"
                      className="bg-gray-700 text-white border-gray-600"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addEducation()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addEducation}
                      variant="outline"
                      className="bg-gray-700 text-white border-gray-600"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {achievements.education.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {achievements.education.map((edu, index) => (
                        <Badge key={index} variant="secondary" className="pl-3 pr-2 py-1.5 bg-gray-700 text-white">
                          {edu}
                          <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="ml-1 text-gray-400 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2">
                      No education added yet. Add your educational background and training.
                    </p>
                  )}
                </div>

                {/* Teams */}
                <div>
                  <Label className="text-white mb-2 block">Teams & Organizations</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTeam}
                      onChange={(e) => setNewTeam(e.target.value)}
                      placeholder="Add a team or organization"
                      className="bg-gray-700 text-white border-gray-600"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTeam()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addTeam}
                      variant="outline"
                      className="bg-gray-700 text-white border-gray-600"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {achievements.teams.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {achievements.teams.map((team, index) => (
                        <Badge key={index} variant="secondary" className="pl-3 pr-2 py-1.5 bg-gray-700 text-white">
                          {team}
                          <button
                            type="button"
                            onClick={() => removeTeam(index)}
                            className="ml-1 text-gray-400 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2">
                      No teams added yet. List current and past teams or organizations you've been part of.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability">
              <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: "#333333" }}>
                <h2 className="text-xl font-bold mb-4 text-white">Availability & Preferences</h2>

                {/* Days Available */}
                <div className="mb-6">
                  <Label className="text-white mb-3 block">Days Available</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {days.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={day.id}
                          checked={availability.days.includes(day.label)}
                          onChange={() => handleDayToggle(day.label)}
                          className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary"
                        />
                        <Label htmlFor={day.id} className="text-sm font-normal cursor-pointer text-white">
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hours Available */}
                <div className="mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="hours" className="text-white">
                      Hours Available
                    </Label>
                    <Input
                      id="hours"
                      name="hours"
                      value={availability.hours}
                      onChange={(e) => setAvailability((prev) => ({ ...prev, hours: e.target.value }))}
                      placeholder="e.g., 9AM-5PM, Afternoons only, etc."
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>

                {/* Time Zone */}
                <div className="mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="timeZone" className="text-white">
                      Time Zone
                    </Label>
                    <select
                      id="timeZone"
                      value={availability.timeZone}
                      onChange={(e) => setAvailability((prev) => ({ ...prev, timeZone: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="EST">Eastern Time (EST)</option>
                      <option value="CST">Central Time (CST)</option>
                      <option value="MST">Mountain Time (MST)</option>
                      <option value="PST">Pacific Time (PST)</option>
                      <option value="AKST">Alaska Time (AKST)</option>
                      <option value="HST">Hawaii Time (HST)</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Locations */}
                <div>
                  <Label className="text-white mb-2 block">Preferred Training Locations</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newPreferredLocation}
                      onChange={(e) => setNewPreferredLocation(e.target.value)}
                      placeholder="Add a preferred location"
                      className="bg-gray-700 text-white border-gray-600"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addPreferredLocation()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addPreferredLocation}
                      variant="outline"
                      className="bg-gray-700 text-white border-gray-600"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {availability.preferredLocations.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {availability.preferredLocations.map((location, index) => (
                        <Badge key={index} variant="secondary" className="pl-3 pr-2 py-1.5 bg-gray-700 text-white">
                          {location}
                          <button
                            type="button"
                            onClick={() => removePreferredLocation(index)}
                            className="ml-1 text-gray-400 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2">
                      No preferred locations added yet. Add locations where you prefer to train or coach.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* NCAA Details Tab */}
            <TabsContent value="ncaa">
              <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: "#333333" }}>
                <h2 className="text-xl font-bold mb-4 text-white">NCAA Details</h2>

                <div className="grid gap-6 md:grid-cols-2 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="eligibilityStatus" className="text-white">
                      Eligibility Status
                    </Label>
                    <select
                      id="eligibilityStatus"
                      name="eligibilityStatus"
                      value={ncaaDetails.eligibilityStatus}
                      onChange={handleNcaaDetailsChange}
                      className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select eligibility status</option>
                      <option value="Eligible">Eligible</option>
                      <option value="Redshirt">Redshirt</option>
                      <option value="Medical Redshirt">Medical Redshirt</option>
                      <option value="Transfer Year">Transfer Year</option>
                      <option value="Graduated">Graduated</option>
                      <option value="Exhausted Eligibility">Exhausted Eligibility</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="division" className="text-white">
                      NCAA Division
                    </Label>
                    <select
                      id="division"
                      name="division"
                      value={ncaaDetails.division}
                      onChange={handleNcaaDetailsChange}
                      className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select division</option>
                      <option value="Division I">Division I</option>
                      <option value="Division II">Division II</option>
                      <option value="Division III">Division III</option>
                      <option value="NAIA">NAIA</option>
                      <option value="NJCAA">NJCAA</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="college" className="text-white">
                      College/University
                    </Label>
                    <Input
                      id="college"
                      name="college"
                      value={ncaaDetails.college}
                      onChange={handleNcaaDetailsChange}
                      placeholder="Enter your college or university"
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sport" className="text-white">
                      NCAA Sport
                    </Label>
                    <Input
                      id="sport"
                      name="sport"
                      value={ncaaDetails.sport}
                      onChange={handleNcaaDetailsChange}
                      placeholder="Enter your NCAA sport"
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="yearsParticipated" className="text-white">
                      Years Participated
                    </Label>
                    <Input
                      id="yearsParticipated"
                      name="yearsParticipated"
                      value={ncaaDetails.yearsParticipated}
                      onChange={handleNcaaDetailsChange}
                      placeholder="e.g., 2018-2022"
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scholarshipType" className="text-white">
                      Scholarship Type
                    </Label>
                    <select
                      id="scholarshipType"
                      name="scholarshipType"
                      value={ncaaDetails.scholarshipType}
                      onChange={handleNcaaDetailsChange}
                      className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select scholarship type</option>
                      <option value="Full Athletic">Full Athletic</option>
                      <option value="Partial Athletic">Partial Athletic</option>
                      <option value="Academic">Academic</option>
                      <option value="Walk-On">Walk-On</option>
                      <option value="Preferred Walk-On">Preferred Walk-On</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <Label htmlFor="recruitingStatus" className="text-white">
                    Recruiting Status
                  </Label>
                  <select
                    id="recruitingStatus"
                    name="recruitingStatus"
                    value={ncaaDetails.recruitingStatus}
                    onChange={handleNcaaDetailsChange}
                    className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select recruiting status</option>
                    <option value="Actively Recruiting">Actively Recruiting</option>
                    <option value="Committed">Committed</option>
                    <option value="Signed">Signed</option>
                    <option value="Transfer Portal">Transfer Portal</option>
                    <option value="Not Recruiting">Not Recruiting</option>
                  </select>
                </div>

                {/* NCAA Achievements */}
                <div>
                  <Label className="text-white mb-2 block">NCAA Achievements & Records</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newNcaaAchievement}
                      onChange={(e) => setNewNcaaAchievement(e.target.value)}
                      placeholder="Add an NCAA achievement or record"
                      className="bg-gray-700 text-white border-gray-600"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addNcaaAchievement()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addNcaaAchievement}
                      variant="outline"
                      className="bg-gray-700 text-white border-gray-600"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {ncaaDetails.achievements.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {ncaaDetails.achievements.map((achievement, index) => (
                        <Badge key={index} variant="secondary" className="pl-3 pr-2 py-1.5 bg-gray-700 text-white">
                          {achievement}
                          <button
                            type="button"
                            onClick={() => removeNcaaAchievement(index)}
                            className="ml-1 text-gray-400 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2">
                      No NCAA achievements added yet. Add your athletic achievements, records, or honors.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/profile")}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </AuthGuard>
  )
}
