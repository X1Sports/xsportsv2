"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function TeamsForm({ onNext, onBack, formData, updateFormData }) {
  const [teams, setTeams] = useState(formData.teams || [{ name: "", level: "", sport: "", lookingForAthletes: false }])

  const handleTeamChange = (index, field, value) => {
    const updatedTeams = [...teams]
    updatedTeams[index] = {
      ...updatedTeams[index],
      [field]: value,
    }
    setTeams(updatedTeams)
  }

  const addTeam = () => {
    setTeams([...teams, { name: "", level: "", sport: "", lookingForAthletes: false }])
  }

  const removeTeam = (index) => {
    const updatedTeams = [...teams]
    updatedTeams.splice(index, 1)
    setTeams(updatedTeams)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateFormData({ teams })
    onNext()
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Teams & Recruitment</CardTitle>
        <CardDescription>Tell us about the teams you coach and your recruitment needs</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {teams.map((team, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Team {index + 1}</h3>
                {teams.length > 1 && (
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeTeam(index)}>
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`team-name-${index}`}>Team Name</Label>
                  <Input
                    id={`team-name-${index}`}
                    value={team.name}
                    onChange={(e) => handleTeamChange(index, "name", e.target.value)}
                    placeholder="Florida Gators"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`sport-${index}`}>Sport</Label>
                  <Select value={team.sport} onValueChange={(value) => handleTeamChange(index, "sport", value)}>
                    <SelectTrigger id={`sport-${index}`}>
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="football">Football</SelectItem>
                      <SelectItem value="baseball">Baseball</SelectItem>
                      <SelectItem value="soccer">Soccer</SelectItem>
                      <SelectItem value="volleyball">Volleyball</SelectItem>
                      <SelectItem value="track">Track & Field</SelectItem>
                      <SelectItem value="swimming">Swimming</SelectItem>
                      <SelectItem value="tennis">Tennis</SelectItem>
                      <SelectItem value="golf">Golf</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`level-${index}`}>Competition Level</Label>
                  <Select value={team.level} onValueChange={(value) => handleTeamChange(index, "level", value)}>
                    <SelectTrigger id={`level-${index}`}>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youth">Youth</SelectItem>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="college-d1">College (D1)</SelectItem>
                      <SelectItem value="college-d2">College (D2)</SelectItem>
                      <SelectItem value="college-d3">College (D3)</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="amateur">Amateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`recruiting-${index}`}
                  checked={team.lookingForAthletes}
                  onCheckedChange={(checked) => handleTeamChange(index, "lookingForAthletes", checked)}
                />
                <Label
                  htmlFor={`recruiting-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Currently looking for athletes
                </Label>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addTeam} className="w-full">
            + Add Another Team
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
