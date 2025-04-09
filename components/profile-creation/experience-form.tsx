"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

type ExperienceFormData = {
  bio: string
  experience: string
  certifications: string[]
}

type ExperienceFormProps = {
  data: ExperienceFormData
  updateData: (data: Partial<ExperienceFormData>) => void
}

export function ExperienceForm({ data, updateData }: ExperienceFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newCertification, setNewCertification] = useState("")

  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors }

    switch (name) {
      case "bio":
        if (!value.trim()) {
          newErrors.bio = "Bio is required"
        } else if (value.length < 50) {
          newErrors.bio = "Bio should be at least 50 characters"
        } else {
          delete newErrors.bio
        }
        break

      case "experience":
        if (!value.trim()) {
          newErrors.experience = "Experience is required"
        } else {
          delete newErrors.experience
        }
        break
    }

    setErrors(newErrors)
  }

  const handleChange = (name: string, value: any) => {
    updateData({ [name]: value })
    validateField(name, value)
  }

  const addCertification = () => {
    if (newCertification.trim()) {
      const updatedCertifications = [...data.certifications, newCertification.trim()]
      updateData({ certifications: updatedCertifications })
      setNewCertification("")
    }
  }

  const removeCertification = (index: number) => {
    const updatedCertifications = [...data.certifications]
    updatedCertifications.splice(index, 1)
    updateData({ certifications: updatedCertifications })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Experience & Qualifications</h2>
        <p className="text-gray-600 mb-6">Tell athletes about your background, experience, and qualifications.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">
          Bio <span className="text-gray-500 text-sm">(min. 50 characters)</span>
        </Label>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          placeholder="Tell athletes about yourself, your coaching philosophy, and what makes you unique..."
          className="min-h-[150px]"
        />
        {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
        <p className="text-xs text-gray-500 mt-1">{data.bio.length} characters (minimum 50)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Years of Experience</Label>
        <Input
          id="experience"
          value={data.experience}
          onChange={(e) => handleChange("experience", e.target.value)}
          placeholder="e.g., 5+ years, 10 years, etc."
        />
        {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="certifications">Certifications & Credentials</Label>
        <div className="flex gap-2">
          <Input
            id="certifications"
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            placeholder="Add a certification or credential"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addCertification()
              }
            }}
          />
          <Button type="button" onClick={addCertification} variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {data.certifications.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {data.certifications.map((cert, index) => (
              <Badge key={index} variant="secondary" className="pl-3 pr-2 py-1.5">
                {cert}
                <button onClick={() => removeCertification(index)} className="ml-1 text-gray-500 hover:text-gray-700">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">
            No certifications added yet. Add your credentials to build trust with athletes.
          </p>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-6">
        <h3 className="font-medium text-amber-800 mb-2">Pro Tip</h3>
        <p className="text-amber-700 text-sm">
          Athletes are more likely to book trainers with detailed bios and verified credentials. Be specific about your
          experience and qualifications to stand out.
        </p>
      </div>
    </div>
  )
}
