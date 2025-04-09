"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"
import { sportsList } from "@/data/mock-profiles"

type GoalsFormData = {
  sports: string[]
  level: string
  goals: string
  interests: string[]
}

type GoalsFormProps = {
  data: GoalsFormData
  updateData: (data: Partial<GoalsFormData>) => void
}

export function GoalsForm({ data, updateData }: GoalsFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newInterest, setNewInterest] = useState("")

  const sportOptions = sportsList.map((sport) => ({
    value: sport,
    label: sport,
  }))

  const levelOptions = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "High School",
    "College (D1)",
    "College (D2)",
    "College (D3)",
    "College (NAIA)",
    "College (JUCO)",
    "Professional",
  ]

  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors }

    switch (name) {
      case "sports":
        if (!value.length) {
          newErrors.sports = "Please select at least one sport"
        } else {
          delete newErrors.sports
        }
        break

      case "level":
        if (!value.trim()) {
          newErrors.level = "Level is required"
        } else {
          delete newErrors.level
        }
        break

      case "goals":
        if (!value.trim()) {
          newErrors.goals = "Goals are required"
        } else {
          delete newErrors.goals
        }
        break
    }

    setErrors(newErrors)
  }

  const handleChange = (name: string, value: any) => {
    updateData({ [name]: value })
    validateField(name, value)
  }

  const addInterest = () => {
    if (newInterest.trim()) {
      const updatedInterests = [...data.interests, newInterest.trim()]
      updateData({ interests: updatedInterests })
      setNewInterest("")
    }
  }

  const removeInterest = (index: number) => {
    const updatedInterests = [...data.interests]
    updatedInterests.splice(index, 1)
    updateData({ interests: updatedInterests })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Sports & Goals</h2>
        <p className="text-gray-600 mb-6">Tell us about your sports, current level, and what you want to achieve.</p>
      </div>

      <div className="space-y-2">
        <Label>Sports You Play</Label>
        <MultiSelect
          options={sportOptions}
          selected={data.sports}
          onChange={(selected) => handleChange("sports", selected)}
          placeholder="Select sports..."
        />
        {errors.sports && <p className="text-red-500 text-sm">{errors.sports}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="level">Current Level</Label>
        <select
          id="level"
          value={data.level}
          onChange={(e) => handleChange("level", e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select your level</option>
          {levelOptions.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        {errors.level && <p className="text-red-500 text-sm">{errors.level}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="goals">Your Athletic Goals</Label>
        <Textarea
          id="goals"
          value={data.goals}
          onChange={(e) => handleChange("goals", e.target.value)}
          placeholder="What do you want to achieve? E.g., Improve shooting technique, increase speed, prepare for college recruitment..."
          className="min-h-[100px]"
        />
        {errors.goals && <p className="text-red-500 text-sm">{errors.goals}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests">Other Interests & Activities</Label>
        <div className="flex gap-2">
          <Input
            id="interests"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add an interest or activity"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addInterest()
              }
            }}
          />
          <Button type="button" onClick={addInterest} variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {data.interests.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {data.interests.map((interest, index) => (
              <Badge key={index} variant="secondary" className="pl-3 pr-2 py-1.5">
                {interest}
                <button onClick={() => removeInterest(index)} className="ml-1 text-gray-500 hover:text-gray-700">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">
            No interests added yet. These could include other sports, hobbies, or activities you enjoy.
          </p>
        )}
      </div>
    </div>
  )
}
