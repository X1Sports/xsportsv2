"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sportsList } from "@/data/mock-profiles"
import { MultiSelect } from "@/components/ui/multi-select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type BasicInfoFormData = {
  name: string
  email: string
  institution: string
  position: string
  sports: string[]
  location: string
}

type BasicInfoFormProps = {
  data: BasicInfoFormData
  updateData: (data: Partial<BasicInfoFormData>) => void
}

export function BasicInfoForm({ data, updateData }: BasicInfoFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const sportOptions = sportsList.map((sport) => ({
    value: sport,
    label: sport,
  }))

  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors }

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Name is required"
        } else {
          delete newErrors.name
        }
        break

      case "institution":
        if (!value.trim()) {
          newErrors.institution = "Institution is required"
        } else {
          delete newErrors.institution
        }
        break

      case "position":
        if (!value.trim()) {
          newErrors.position = "Position is required"
        } else {
          delete newErrors.position
        }
        break

      case "sports":
        if (!value.length) {
          newErrors.sports = "Please select at least one sport"
        } else {
          delete newErrors.sports
        }
        break

      case "location":
        if (!value.trim()) {
          newErrors.location = "Location is required"
        } else {
          delete newErrors.location
        }
        break
    }

    setErrors(newErrors)
  }

  const handleChange = (name: string, value: any) => {
    updateData({ [name]: value })
    validateField(name, value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <p className="text-gray-600 mb-6">
          Let's start with the essential details about you and your coaching position.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Your full name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Your email address"
            disabled
          />
          <p className="text-xs text-gray-500">Email cannot be changed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="institution">Institution/Organization</Label>
          <Input
            id="institution"
            value={data.institution}
            onChange={(e) => handleChange("institution", e.target.value)}
            placeholder="School, university, or organization name"
          />
          {errors.institution && <p className="text-red-500 text-sm">{errors.institution}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Coaching Position</Label>
          <Input
            id="position"
            value={data.position}
            onChange={(e) => handleChange("position", e.target.value)}
            placeholder="e.g., Head Coach, Assistant Coach, etc."
          />
          {errors.position && <p className="text-red-500 text-sm">{errors.position}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sports">Sports You Coach</Label>
        <MultiSelect
          options={sportOptions}
          selected={data.sports}
          onChange={(selected) => handleChange("sports", selected)}
          placeholder="Select sports..."
        />
        {errors.sports && <p className="text-red-500 text-sm">{errors.sports}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={data.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="City, State"
        />
        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          This information will be displayed publicly on your profile to help athletes and teams find you.
        </AlertDescription>
      </Alert>
    </div>
  )
}
