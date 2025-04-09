"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type AvailabilityFormProps = {
  data: {
    availability: {
      days: string[]
      hours: string
    }
  }
  updateData: (data: Partial<{ availability: { days: string[]; hours: string } }>) => void
}

export function AvailabilityForm({ data, updateData }: AvailabilityFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const days = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
  ]

  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors }

    switch (name) {
      case "days":
        if (!value.length) {
          newErrors.days = "Please select at least one day"
        } else {
          delete newErrors.days
        }
        break

      case "hours":
        if (!value.trim()) {
          newErrors.hours = "Hours are required"
        } else {
          delete newErrors.hours
        }
        break
    }

    setErrors(newErrors)
  }

  const handleDayToggle = (day: string) => {
    const currentDays = [...data.availability.days]
    const updatedDays = currentDays.includes(day) ? currentDays.filter((d) => d !== day) : [...currentDays, day]

    updateData({
      availability: {
        ...data.availability,
        days: updatedDays,
      },
    })

    validateField("days", updatedDays)
  }

  const handleHoursChange = (hours: string) => {
    updateData({
      availability: {
        ...data.availability,
        hours,
      },
    })

    validateField("hours", hours)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Availability</h2>
        <p className="text-gray-600 mb-6">Let athletes know when you're available for training sessions.</p>
      </div>

      <div className="space-y-4">
        <Label>Days Available</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {days.map((day) => (
            <div key={day.id} className="flex items-center space-x-2">
              <Checkbox
                id={day.id}
                checked={data.availability.days.includes(day.label)}
                onCheckedChange={() => handleDayToggle(day.label)}
              />
              <Label htmlFor={day.id} className="text-sm font-normal cursor-pointer">
                {day.label}
              </Label>
            </div>
          ))}
        </div>
        {errors.days && <p className="text-red-500 text-sm">{errors.days}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="hours">Hours Available</Label>
        <Input
          id="hours"
          value={data.availability.hours}
          onChange={(e) => handleHoursChange(e.target.value)}
          placeholder="e.g., 9AM-5PM, Afternoons only, etc."
        />
        {errors.hours && <p className="text-red-500 text-sm">{errors.hours}</p>}
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Your availability will be displayed on your profile. Athletes will be able to book sessions during these
          times.
        </AlertDescription>
      </Alert>

      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-4">
        <h3 className="font-medium mb-2">Coming Soon</h3>
        <p className="text-sm text-gray-600">
          In the future, you'll be able to set specific time slots and manage your calendar directly through the
          platform.
        </p>
      </div>
    </div>
  )
}
