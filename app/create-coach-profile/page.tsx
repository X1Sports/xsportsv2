"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/firebase-context"
import { Check, ArrowLeft, ArrowRight } from "lucide-react"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { BasicInfoForm } from "@/components/coach-profile/basic-info-form"
import { ExperienceForm } from "@/components/coach-profile/experience-form"
import { TeamsForm } from "@/components/coach-profile/teams-form"
import { MediaForm } from "@/components/coach-profile/media-form"
import { ReviewForm } from "@/components/coach-profile/review-form"

export default function CreateCoachProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileData, setProfileData] = useState({
    // Basic Info
    name: user?.displayName || "",
    email: user?.email || "",
    institution: "",
    position: "",
    sports: [] as string[],
    location: "",

    // Experience
    bio: "",
    experience: "",
    certifications: [] as string[],
    achievements: [] as string[],

    // Teams
    teams: [] as {
      name: string
      level: string
      gender: string
      sport: string
    }[],

    // Media
    photoURL: user?.photoURL || "",
    galleryImages: [] as string[],
    videoLinks: [] as string[],

    // System fields
    userId: user?.uid || "",
    createdAt: null,
    updatedAt: null,
  })

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const updateProfileData = (data: Partial<typeof profileData>) => {
    setProfileData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Create the coach profile in Firestore
      const coachData = {
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await setDoc(doc(db, "coaches", user?.uid || ""), coachData)

      // Redirect to the coach's dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">Create Your Coach Profile</h1>
      <p className="text-center text-gray-600 mb-8">Complete your profile to connect with athletes and teams</p>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`flex flex-col items-center ${step <= currentStep ? "text-blue-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 sm:mb-2 ${
                  step < currentStep
                    ? "bg-blue-600 text-white"
                    : step === currentStep
                      ? "border-2 border-blue-600 text-blue-600"
                      : "border-2 border-gray-300 text-gray-400"
                }`}
              >
                {step < currentStep ? <Check className="h-4 w-4" /> : step}
              </div>
              <span className="text-[10px] xs:text-xs">
                {step === 1
                  ? "Basic Info"
                  : step === 2
                    ? "Experience"
                    : step === 3
                      ? "Teams"
                      : step === 4
                        ? "Media"
                        : "Review"}
              </span>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2 mt-2" />
      </div>

      <Card className="p-6 w-full">
        {currentStep === 1 && <BasicInfoForm data={profileData} updateData={updateProfileData} />}

        {currentStep === 2 && <ExperienceForm data={profileData} updateData={updateProfileData} />}

        {currentStep === 3 && <TeamsForm data={profileData} updateData={updateProfileData} />}

        {currentStep === 4 && <MediaForm data={profileData} updateData={updateProfileData} />}

        {currentStep === 5 && <ReviewForm data={profileData} />}

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? "Creating Profile..." : "Complete Profile"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
