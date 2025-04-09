"use client"
import { Badge } from "@/components/ui/badge"
import { MapPin, Award, CheckCircle } from "lucide-react"
import Image from "next/image"

type ReviewFormProps = {
  data: {
    name: string
    email: string
    age: string
    gender: string
    location: string
    height: string
    weight: string
    dominantHand: string
    sports: string[]
    level: string
    goals: string
    interests: string[]
    experience: string
    achievements: string[]
    teams: string[]
    photoURL: string
    galleryImages: string[]
    videoLinks: string[]
  }
}

export function ReviewForm({ data }: ReviewFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Review Your Profile</h2>
        <p className="text-gray-600 mb-6">
          Review your profile information before finalizing. This is how trainers will see your profile.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md">
            {data.photoURL ? (
              <Image src={data.photoURL || "/placeholder.svg"} alt={data.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xs">No photo</span>
              </div>
            )}
          </div>

          <div className="space-y-4 flex-1 text-center sm:text-left">
            <div>
              <h3 className="text-2xl font-bold">{data.name || "Your Name"}</h3>
              <p className="text-blue-600 font-medium">{data.sports.join(", ") || "Your Sports"}</p>

              <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  {data.level || "Your Level"}
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                  {data.age ? `${data.age} years old` : "Age"}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
              <div className="flex items-center justify-center sm:justify-start">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                {data.location || "Your Location"}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold mb-2">Physical Attributes</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-500">Height</p>
              <p className="font-medium">{data.height || "Not specified"}</p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-500">Weight</p>
              <p className="font-medium">{data.weight || "Not specified"}</p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-500">Dominant Hand/Foot</p>
              <p className="font-medium">{data.dominantHand || "Not specified"}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold mb-2">Goals</h4>
          <p className="text-gray-700">
            {data.goals ||
              "Your goals will appear here. Make sure to write about what you want to achieve with training."}
          </p>

          {data.interests.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-500 mb-2">Other Interests</h5>
              <div className="flex flex-wrap gap-2">
                {data.interests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold mb-2">Experience</h4>
          <p className="text-gray-700">{data.experience || "Your experience"}</p>

          {data.teams.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-500 mb-2">Teams & Organizations</h5>
              <div className="flex flex-wrap gap-2">
                {data.teams.map((team, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                    {team}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {data.achievements.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold mb-2">Achievements</h4>
            <div className="space-y-2">
              {data.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start">
                  <Award className="w-5 h-5 mr-2 text-blue-600 mt-0.5" />
                  <span>{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.galleryImages.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold mb-3">Gallery</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {data.galleryImages.map((image, index) => (
                <div key={index} className="aspect-video rounded-md overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Gallery ${index + 1}`}
                    width={200}
                    height={150}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {data.videoLinks.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold mb-3">Videos</h4>
            <div className="space-y-2">
              {data.videoLinks.map((link, index) => (
                <div key={index} className="flex items-center text-blue-600 hover:text-blue-800">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm">
                    {link}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <h3 className="font-medium text-green-800 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          Ready to Complete Your Profile?
        </h3>
        <p className="text-green-700 text-sm mt-1">
          Once you submit, your profile will be live and visible to trainers. You can edit your profile anytime from
          your dashboard.
        </p>
      </div>
    </div>
  )
}
