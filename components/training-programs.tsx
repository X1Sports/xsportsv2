import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight } from "lucide-react"

export function TrainingPrograms() {
  const programs = [
    {
      id: 1,
      title: "Beginner Program",
      description: "Perfect for athletes just starting their training journey. Build foundational skills and fitness.",
      duration: "4 weeks",
      price: 199,
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
      features: ["Fundamentals Training", "Basic Conditioning", "Form Development"],
    },
    {
      id: 2,
      title: "Intermediate Program",
      description: "Take your skills to the next level with advanced techniques and personalized coaching.",
      duration: "8 weeks",
      price: 349,
      color: "bg-gradient-to-br from-purple-500 to-indigo-700",
      popular: true,
      features: ["Advanced Techniques", "Strength Building", "Performance Analysis"],
    },
    {
      id: 3,
      title: "Elite Program",
      description: "Comprehensive training solution for competitive athletes looking to excel in their sport.",
      duration: "12 weeks",
      price: 499,
      color: "bg-gradient-to-br from-amber-500 to-orange-700",
      features: ["Professional Training", "Competition Prep", "Nutrition Planning"],
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800">Training Programs</h2>
        <p className="mt-4 text-slate-600">
          Structured training programs designed to help you achieve your athletic goals, no matter your starting point
          or ambition.
        </p>
      </div>

      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {programs.map((program) => (
          <Card
            key={program.id}
            className={`overflow-hidden border-0 shadow-xl relative ${program.popular ? "ring-2 ring-blue-500" : ""}`}
          >
            {program.popular && (
              <Badge className="absolute top-0 right-0 m-4 bg-blue-600 text-white">Most Popular</Badge>
            )}
            <div className={`p-6 text-white ${program.color}`}>
              <h3 className="text-2xl font-bold">{program.title}</h3>
              <p className="mt-2 text-white/80 text-sm">{program.duration}</p>
              <p className="mt-4 text-3xl font-bold">${program.price}</p>
            </div>
            <CardContent className="p-6">
              <p className="text-slate-600 mb-6">{program.description}</p>

              <div className="mt-6 space-y-4">
                {program.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 mr-3 text-emerald-500 shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700">
                Enroll Now <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
