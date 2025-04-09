"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type BasicInfoFormData = {
  name: string
  email: string
  age: string
  gender: string
  location: string
}

type BasicInfoFormProps = {
  data: BasicInfoFormData
  updateData: (data: Partial<BasicInfoFormData>) => void
}

export function BasicInfoForm({ data, updateData }: BasicInfoFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

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

      case "age":
        if (!value.trim()) {
          newErrors.age = "Age is required"
        } else if (isNaN(value) || Number.parseInt(value) < 8 || Number.parseInt(value) > 80) {
          newErrors.age = "Please enter a valid age between 8 and 80"
        } else {
          delete newErrors.age
        }
        break

      case "gender":
        if (!value.trim()) {
          newErrors.gender = "Gender is required"
        } else {
          delete newErrors.gender
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
        <p className="text-gray-600 mb-6">Let's start with some basic information about you.</p>
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
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={data.age}
            onChange={(e) => handleChange("age", e.target.value)}
            placeholder="Your age"
            min="8"
            max="80"
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup
            value={data.gender}
            onValueChange={(value) => handleChange("gender", value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Male" id="gender-male" />
              <Label htmlFor="gender-male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Female" id="gender-female" />
              <Label htmlFor="gender-female">Female</Label>
            </div>
          </RadioGroup>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
        </div>
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
          This information helps trainers understand who you are and if they can work with you based on your location.
        </AlertDescription>
      </Alert>
    </div>
  )
}
