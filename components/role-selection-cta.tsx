"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Clipboard, GraduationCap } from "lucide-react"

export function RoleSelectionCTA() {
  const router = useRouter()

  const handleRoleSelect = (role: "athlete" | "trainer" | "coach") => {
    router.push(`/sign-up?role=${role}`)
  }

  return (
    <div className="py-16 md:py-24 bg-gray-50 border-t border-gray-200">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Join X:1 Sports Today</h2>
          <div className="h-1 w-24 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-center text-gray-600 max-w-2xl mx-auto text-lg">
            Connect with elite trainers, find dedicated athletes, or represent your institution as a coach. X:1 Sports
            brings together the best in sports training and athletic talent.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center max-w-7xl mx-auto">
          {/* Athlete Card */}
          <Card className="w-full sm:w-64 cursor-pointer transition-all hover:shadow-md bg-secondary">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <Trophy className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">For Athletes</h3>
                <p className="text-gray-600 mb-6">
                  Find the perfect trainer to take your skills to the next level. Get personalized training and reach
                  your athletic goals faster.
                </p>
                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                  onClick={() => handleRoleSelect("athlete")}
                >
                  Become an Athlete
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trainer Card */}
          <Card className="w-full sm:w-64 cursor-pointer transition-all hover:shadow-md bg-secondary">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-red-100 rounded-full p-4 mb-4">
                  <Clipboard className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">For Trainers</h3>
                <p className="text-gray-600 mb-6">
                  Connect with motivated athletes looking for your expertise. Grow your training business and make a
                  bigger impact.
                </p>
                <Button
                  size="lg"
                  className="w-full bg-red-600 hover:bg-red-700 py-6 text-lg"
                  onClick={() => handleRoleSelect("trainer")}
                >
                  Become a Trainer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Coach Card */}
          <Card className="w-full sm:w-64 cursor-pointer transition-all hover:shadow-md bg-secondary">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 rounded-full p-4 mb-4">
                  <GraduationCap className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">For Coaches</h3>
                <p className="text-gray-600 mb-6">
                  Represent your school or organization. Connect with talented athletes and build championship-caliber
                  teams.
                </p>
                <Button
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
                  onClick={() => handleRoleSelect("coach")}
                >
                  Become a Coach
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
