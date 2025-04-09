"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon, Video } from "lucide-react"

export function MediaForm({ onNext, onBack, formData, updateFormData }) {
  const [media, setMedia] = useState(
    formData.media || {
      profileImage: "",
      teamPhotos: [],
      videos: [],
      socialLinks: { twitter: "", instagram: "", linkedin: "" },
    },
  )

  const handleProfileImageChange = (e) => {
    // In a real implementation, this would upload to Firebase Storage
    // For now, we'll just simulate it
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Simulate upload and get URL
      const fakeUrl = URL.createObjectURL(file)
      setMedia({
        ...media,
        profileImage: fakeUrl,
      })
    }
  }

  const handleTeamPhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Simulate upload and get URL
      const fakeUrl = URL.createObjectURL(file)
      setMedia({
        ...media,
        teamPhotos: [...media.teamPhotos, fakeUrl],
      })
    }
  }

  const removeTeamPhoto = (index) => {
    const updatedPhotos = [...media.teamPhotos]
    updatedPhotos.splice(index, 1)
    setMedia({
      ...media,
      teamPhotos: updatedPhotos,
    })
  }

  const handleVideoLinkChange = (e) => {
    if (e.target.value) {
      setMedia({
        ...media,
        videos: [...media.videos, e.target.value],
      })
      e.target.value = ""
    }
  }

  const removeVideoLink = (index) => {
    const updatedVideos = [...media.videos]
    updatedVideos.splice(index, 1)
    setMedia({
      ...media,
      videos: updatedVideos,
    })
  }

  const handleSocialLinkChange = (platform, value) => {
    setMedia({
      ...media,
      socialLinks: {
        ...media.socialLinks,
        [platform]: value,
      },
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateFormData({ media })
    onNext()
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Media & Social</CardTitle>
        <CardDescription>Add photos, videos, and social media links to enhance your profile</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Profile Image */}
          <div className="space-y-4">
            <Label>Profile Image</Label>
            <div className="flex items-center gap-4">
              {media.profileImage ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border">
                  <img
                    src={media.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 w-6 h-6 rounded-full"
                    onClick={() => setMedia({ ...media, profileImage: "" })}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div>
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Upload className="w-4 h-4" />
                    Upload profile image
                  </div>
                </Label>
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: Square image, at least 400x400px</p>
              </div>
            </div>
          </div>

          {/* Team Photos */}
          <div className="space-y-4">
            <Label>Team Photos</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {media.teamPhotos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Team photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 w-6 h-6 rounded-full"
                    onClick={() => removeTeamPhoto(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="aspect-square rounded-md bg-gray-100 flex flex-col items-center justify-center border">
                <Label htmlFor="team-photo" className="cursor-pointer flex flex-col items-center">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">Add photo</span>
                </Label>
                <Input
                  id="team-photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleTeamPhotoChange}
                />
              </div>
            </div>
          </div>

          {/* Video Links */}
          <div className="space-y-4">
            <Label>Video Links</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  id="video-link"
                  placeholder="Paste YouTube or Vimeo URL"
                  onBlur={handleVideoLinkChange}
                  onKeyDown={(e) => e.key === "Enter" && handleVideoLinkChange(e)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("video-link").dispatchEvent(new Event("blur"))}
                >
                  Add
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {media.videos.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-gray-500" />
                      <span className="text-sm truncate max-w-[300px]">{video}</span>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeVideoLink(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <Label>Social Media Links</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold">X</span>
                </div>
                <Input
                  placeholder="Twitter/X profile URL"
                  value={media.socialLinks.twitter}
                  onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold">IG</span>
                </div>
                <Input
                  placeholder="Instagram profile URL"
                  value={media.socialLinks.instagram}
                  onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                  <span className="text-white font-bold">in</span>
                </div>
                <Input
                  placeholder="LinkedIn profile URL"
                  value={media.socialLinks.linkedin}
                  onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Next</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
