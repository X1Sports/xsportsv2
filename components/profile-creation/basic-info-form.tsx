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
  sports: string[]
  specialty: string
  location: string
  price: number
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

      case "sports":
        if (!value.length) {
          newErrors.sports = "Please select at least one sport"
        } else {
          delete newErrors.sports
        }
        break

      case "specialty":
        if (!value.trim()) {
          newErrors.specialty = "Specialty is required"
        } else {
          delete newErrors.specialty
        }
        break

      case "location":
        if (!value.trim()) {
          newErrors.location = "Location is required"
        } else {
          delete newErrors.location
        }
        break

      case "price":
        if (isNaN(value) || value <= 0) {
          newErrors.price = "Please enter a valid price"
        } else {
          delete newErrors.price
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
          Let's start with the essential details about you and your training services.
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
        <Label htmlFor="specialty">Your Specialty</Label>
        <Input
          id="specialty"
          value={data.specialty}
          onChange={(e) => handleChange("specialty", e.target.value)}
          placeholder="e.g., Shooting Coach, Strength Trainer, etc."
        />
        {errors.specialty && <p className="text-red-500 text-sm">{errors.specialty}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div className="space-y-2">
          <Label htmlFor="price">Hourly Rate ($)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={data.price || ""}
            onChange={(e) => handleChange("price", Number.parseFloat(e.target.value))}
            placeholder="Your hourly rate"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          This information will be displayed publicly on your profile to help athletes find you.
        </AlertDescription>
      </Alert>
    </div>
  )
}
