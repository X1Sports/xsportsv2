"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

type ExperienceFormData = {
  experience: string
  achievements: string[]
  teams: string[]
}

type ExperienceFormProps = {
  data: ExperienceFormData
  updateData: (data: Partial<ExperienceFormData>) => void
}

export function ExperienceForm({ data, updateData }: ExperienceFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newAchievement, setNewAchievement] = useState("")
  const [newTeam, setNewTeam] = useState("")

  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors }

    switch (name) {
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

  const addAchievement = () => {
    if (newAchievement.trim()) {
      const updatedAchievements = [...data.achievements, newAchievement.trim()]
      updateData({ achievements: updatedAchievements })
      setNewAchievement("")
    }
  }

  const removeAchievement = (index: number) => {
    const updatedAchievements = [...data.achievements]
    updatedAchievements.splice(index, 1)
    updateData({ achievements: updatedAchievements })
  }

  const addTeam = () => {
    if (newTeam.trim()) {
      const updatedTeams = [...data.teams, newTeam.trim()]
      updateData({ teams: updatedTeams })
      setNewTeam("")
    }
  }

  const removeTeam = (index: number) => {
    const updatedTeams = [...data.teams]
    updatedTeams.splice(index, 1)
    updateData({ teams: updatedTeams })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Experience & Achievements</h2>
        <p className="text-gray-600 mb-6">Share your athletic background and accomplishments.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Years of Experience</Label>
        <Input
          id="experience"
          value={data.experience}
          onChange={(e) => handleChange("experience", e.target.value)}
          placeholder="e.g., 5 years, 3 seasons, etc."
        />
        {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="achievements">Achievements & Awards</Label>
        <div className="flex gap-2">
          <Input
            id="achievements"
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            placeholder="Add an achievement or award"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addAchievement()
              }
            }}
          />
          <Button type="button" onClick={addAchievement} variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {data.achievements.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {data.achievements.map((achievement, index) => (
              <Badge key={index} variant="secondary" className="pl-3 pr-2 py-1.5">
                {achievement}
                <button onClick={() => removeAchievement(index)} className="ml-1 text-gray-500 hover:text-gray-700">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">
            No achievements added yet. These could include awards, records, championships, etc.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="teams">Teams & Organizations</Label>
        <div className="flex gap-2">
          <Input
            id="teams"
            value={newTeam}
            onChange={(e) => setNewTeam(e.target.value)}
            placeholder="Add a team or organization"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addTeam()
              }
            }}
          />
          <Button type="button" onClick={addTeam} variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {data.teams.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {data.teams.map((team, index) => (
              <Badge key={index} variant="secondary" className="pl-3 pr-2 py-1.5">
                {team}
                <button onClick={() => removeTeam(index)} className="ml-1 text-gray-500 hover:text-gray-700">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">
            No teams added yet. List current and past teams or organizations you've been part of.
          </p>
        )}
      </div>
    </div>
  )
}
