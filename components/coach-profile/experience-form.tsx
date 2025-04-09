"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ExperienceForm({ onNext, onBack, formData, updateFormData }) {
  const [experiences, setExperiences] = useState(
    formData.experiences || [{ institution: "", position: "", years: "", achievements: "" }],
  )

  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...experiences]
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    }
    setExperiences(updatedExperiences)
  }

  const addExperience = () => {
    setExperiences([...experiences, { institution: "", position: "", years: "", achievements: "" }])
  }

  const removeExperience = (index) => {
    const updatedExperiences = [...experiences]
    updatedExperiences.splice(index, 1)
    setExperiences(updatedExperiences)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateFormData({ experiences })
    onNext()
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Coaching Experience</CardTitle>
        <CardDescription>Tell us about your coaching experience and achievements</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Experience {index + 1}</h3>
                {experiences.length > 1 && (
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeExperience(index)}>
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`institution-${index}`}>Institution/Team</Label>
                  <Input
                    id={`institution-${index}`}
                    value={exp.institution}
                    onChange={(e) => handleExperienceChange(index, "institution", e.target.value)}
                    placeholder="University of Florida"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`position-${index}`}>Position</Label>
                  <Input
                    id={`position-${index}`}
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                    placeholder="Head Coach"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`years-${index}`}>Years of Experience</Label>
                  <Select value={exp.years} onValueChange={(value) => handleExperienceChange(index, "years", value)}>
                    <SelectTrigger id={`years-${index}`}>
                      <SelectValue placeholder="Select years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">Less than 1 year</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`achievements-${index}`}>Key Achievements</Label>
                <Textarea
                  id={`achievements-${index}`}
                  value={exp.achievements}
                  onChange={(e) => handleExperienceChange(index, "achievements", e.target.value)}
                  placeholder="Conference championships, player development successes, etc."
                  rows={3}
                />
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addExperience} className="w-full">
            + Add Another Experience
          </Button>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Next</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
