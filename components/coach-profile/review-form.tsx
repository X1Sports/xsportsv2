"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Check, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function ReviewForm({ onBack, formData, updateFormData, onSubmit }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError("")

    try {
      // In a real implementation, this would submit to Firebase
      await onSubmit(formData)
      router.push("/dashboard")
    } catch (err) {
      console.error("Error submitting profile:", err)
      setError("There was an error creating your profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Review Your Profile</CardTitle>
        <CardDescription>Please review your information before submitting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">Basic Information</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{formData.fullName || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{formData.email || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{formData.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{formData.location || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Institution</p>
                <p className="font-medium">{formData.institution || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bio</p>
                <p className="font-medium">{formData.bio || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Experience Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">Coaching Experience</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            {formData.experiences && formData.experiences.length > 0 ? (
              <div className="space-y-4">
                {formData.experiences.map((exp, index) => (
                  <div key={index} className="p-3 bg-white rounded border">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{exp.institution || "Unknown Institution"}</p>
                        <p className="text-sm text-gray-600">{exp.position || "Position not specified"}</p>
                      </div>
                      <div className="text-sm text-gray-500">{exp.years || "Years not specified"}</div>
                    </div>
                    {exp.achievements && <p className="text-sm mt-2">{exp.achievements}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No experience information provided</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Teams Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">Teams & Recruitment</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            {formData.teams && formData.teams.length > 0 ? (
              <div className="space-y-4">
                {formData.teams.map((team, index) => (
                  <div key={index} className="p-3 bg-white rounded border">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{team.name || "Team name not specified"}</p>
                        <p className="text-sm text-gray-600">{team.sport || "Sport not specified"}</p>
                      </div>
                      <div className="text-sm text-gray-500">{team.level || "Level not specified"}</div>
                    </div>
                    <div className="mt-2 flex items-center">
                      {team.lookingForAthletes ? (
                        <div className="flex items-center text-green-600 text-sm">
                          <Check className="w-4 h-4 mr-1" />
                          Currently recruiting athletes
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">Not currently recruiting</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No team information provided</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Media Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">Media & Social</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Profile Image</p>
                {formData.media?.profileImage ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden border">
                    <img
                      src={formData.media.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No profile image provided</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Team Photos</p>
                {formData.media?.teamPhotos && formData.media.teamPhotos.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.media.teamPhotos.map((photo, index) => (
                      <div key={index} className="w-16 h-16 rounded overflow-hidden border">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Team photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No team photos provided</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Video Links</p>
              {formData.media?.videos && formData.media.videos.length > 0 ? (
                <div className="space-y-1">
                  {formData.media.videos.map((video, index) => (
                    <div key={index} className="text-sm text-blue-600 truncate">
                      {video}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No videos provided</p>
              )}
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Social Media</p>
              {formData.media?.socialLinks ? (
                <div className="space-y-2">
                  {formData.media.socialLinks.twitter && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">X</span>
                      </div>
                      <span className="text-sm truncate">{formData.media.socialLinks.twitter}</span>
                    </div>
                  )}
                  {formData.media.socialLinks.instagram && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">IG</span>
                      </div>
                      <span className="text-sm truncate">{formData.media.socialLinks.instagram}</span>
                    </div>
                  )}
                  {formData.media.socialLinks.linkedin && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">in</span>
                      </div>
                      <span className="text-sm truncate">{formData.media.socialLinks.linkedin}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">No social media links provided</p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
          {isSubmitting ? "Submitting..." : "Submit Profile"}
        </Button>
      </CardFooter>
    </Card>
  )
}
