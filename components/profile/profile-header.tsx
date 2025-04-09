"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Briefcase, Edit, Award, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface ProfileHeaderProps {
  user: any
  profileData: any
  userRole: string
  isOwnProfile?: boolean
}

export function ProfileHeader({ user, profileData, userRole, isOwnProfile = false }: ProfileHeaderProps) {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)

  useEffect(() => {
    // Log user data for debugging
    console.log("ProfileHeader - User data:", user)
    console.log("ProfileHeader - User photoURL:", user?.photoURL)
    console.log("ProfileHeader - Profile data:", profileData)

    // Set profile image URL with priority order:
    // 1. User's photoURL from Firebase Auth
    // 2. Profile data photoURL from Firestore
    // 3. Default to null (will show fallback)
    if (user?.photoURL) {
      setProfileImageUrl(user.photoURL)
    } else if (profileData?.photoURL) {
      setProfileImageUrl(profileData.photoURL)
    } else {
      setProfileImageUrl(null)
    }
  }, [user, profileData])

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

  return (
    <div className="w-full rounded-xl overflow-hidden bg-white shadow-md">
      {/* Header Image */}
      <div className="relative w-full h-48 md:h-64 bg-gradient-to-r from-gray-800 to-gray-900">
        {profileData?.headerImageURL ? (
          <Image
            src={profileData.headerImageURL || "/placeholder.svg"}
            alt="Profile Header"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-sm font-medium">No header image</span>
          </div>
        )}

        {/* Edit button for own profile - Updated to be more visible */}
        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <Button asChild variant="default" size="sm" className="bg-black text-white hover:bg-gray-800">
              <Link href="/dashboard/profile/edit">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 left-6 border-4 border-white rounded-full shadow-lg">
          <Avatar className="h-32 w-32">
            {profileImageUrl ? (
              <AvatarImage
                src={profileImageUrl}
                alt={user?.displayName || "User"}
                className="object-cover"
                onError={() => {
                  console.error("Error loading profile image:", profileImageUrl)
                  setProfileImageUrl(null)
                }}
              />
            ) : null}
            <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Profile Details */}
        <div className="pt-20 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{user?.displayName}</h1>
              <Badge className="ml-1 bg-blue-600 hover:bg-blue-700 text-white">{getRoleLabel()}</Badge>
            </div>

            {profileData?.specialty && <p className="text-gray-800 mt-1 font-medium">{profileData.specialty}</p>}

            {profileData?.price && <p className="text-gray-800 mt-1 font-medium">${profileData.price}/hour</p>}

            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-700" />
                <span className="text-gray-900">{user?.email}</span>
              </div>

              {profileData?.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-700" />
                  <span className="text-gray-900">{profileData.phone}</span>
                </div>
              )}

              {profileData?.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-700" />
                  <span className="text-gray-900">{profileData.location}</span>
                </div>
              )}

              {profileData?.experience && (
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-700" />
                  <span className="text-gray-900">{profileData.experience} Experience</span>
                </div>
              )}

              {profileData?.level && (
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-gray-700" />
                  <span className="text-gray-900">Level: {profileData.level}</span>
                </div>
              )}

              {profileData?.teams && profileData.teams.length > 0 && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-700" />
                  <span className="text-gray-900">
                    Teams: {profileData.teams.slice(0, 2).join(", ")}
                    {profileData.teams.length > 2 ? "..." : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {profileData?.sports &&
              profileData.sports.length > 0 &&
              profileData.sports.map((sport: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 font-medium">
                  {sport}
                </Badge>
              ))}
          </div>
        </div>

        {/* Bio */}
        {profileData?.bio && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Bio</h3>
            <p className="text-gray-800">{profileData.bio}</p>
          </div>
        )}
      </div>
    </div>
  )
}
