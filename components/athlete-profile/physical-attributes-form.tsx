"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type PhysicalAttributesFormData = {
  height: string
  weight: string
  dominantHand: string
}

type PhysicalAttributesFormProps = {
  data: PhysicalAttributesFormData
  updateData: (data: Partial<PhysicalAttributesFormData>) => void
}

export function PhysicalAttributesForm({ data, updateData }: PhysicalAttributesFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors }

    switch (name) {
      case "height":
        if (!value.trim()) {
          newErrors.height = "Height is required"
        } else {
          delete newErrors.height
        }
        break

      case "weight":
        if (!value.trim()) {
          newErrors.weight = "Weight is required"
        } else {
          delete newErrors.weight
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
        <h2 className="text-xl font-semibold mb-4">Physical Attributes</h2>
        <p className="text-gray-600 mb-6">
          These details help trainers customize their approach to your physical attributes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            value={data.height}
            onChange={(e) => handleChange("height", e.target.value)}
            placeholder="e.g., 5&#39;10\&quot; or 178 cm"
          />
          {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            value={data.weight}
            onChange={(e) => handleChange("weight", e.target.value)}
            placeholder="e.g., 165 lbs or 75 kg"
          />
          {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Dominant Hand/Foot</Label>
        <RadioGroup
          value={data.dominantHand}
          onValueChange={(value) => handleChange("dominantHand", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Right" id="right-handed" />
            <Label htmlFor="right-handed">Right</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Left" id="left-handed" />
            <Label htmlFor="left-handed">Left</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Ambidextrous" id="ambidextrous" />
            <Label htmlFor="ambidextrous">Ambidextrous</Label>
          </div>
        </RadioGroup>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Your physical attributes help trainers develop personalized training plans that account for your body type and
          natural tendencies.
        </AlertDescription>
      </Alert>
    </div>
  )
}
