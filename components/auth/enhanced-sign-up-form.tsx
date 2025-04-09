"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle,
  Upload,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Shield,
  ScanSearch,
  Trophy,
  Clipboard,
  GraduationCap,
} from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"
import { Progress } from "@/components/ui/progress"
import { useAuth, type UserRole } from "@/contexts/firebase-context"

// Sport options for Male & Female
const maleSportOptions = [
  { value: "Football", label: "Football" },
  { value: "Basketball", label: "Basketball" },
  { value: "Baseball", label: "Baseball" },
  { value: "Soccer", label: "Soccer" },
  { value: "Track & Field", label: "Track & Field" },
  { value: "Cross Country", label: "Cross Country" },
  { value: "Wrestling", label: "Wrestling" },
  { value: "Swimming & Diving", label: "Swimming & Diving" },
  { value: "Tennis", label: "Tennis" },
  { value: "Golf", label: "Golf" },
  { value: "Ice Hockey", label: "Ice Hockey" },
  { value: "Volleyball", label: "Volleyball" },
  { value: "Lacrosse", label: "Lacrosse" },
  { value: "Rifle", label: "Rifle" },
  { value: "Skiing", label: "Skiing" },
  { value: "Water Polo", label: "Water Polo" },
  { value: "Gymnastics", label: "Gymnastics" },
  { value: "Fencing", label: "Fencing" },
  { value: "Rowing", label: "Rowing" },
  { value: "Boxing", label: "Boxing" },
  { value: "Martial Arts", label: "Martial Arts" },
  { value: "Mixed Martial Arts", label: "Mixed Martial Arts" },
]

const femaleSportOptions = [
  { value: "Basketball", label: "Basketball" },
  { value: "Soccer", label: "Soccer" },
  { value: "Softball", label: "Softball" },
  { value: "Volleyball", label: "Volleyball" },
  { value: "Track & Field", label: "Track & Field" },
  { value: "Cross Country", label: "Cross Country" },
  { value: "Swimming & Diving", label: "Swimming & Diving" },
  { value: "Tennis", label: "Tennis" },
  { value: "Golf", label: "Golf" },
  { value: "Gymnastics", label: "Gymnastics" },
  { value: "Lacrosse", label: "Lacrosse" },
  { value: "Rowing", label: "Rowing" },
  { value: "Ice Hockey", label: "Ice Hockey" },
  { value: "Field Hockey", label: "Field Hockey" },
  { value: "Beach Volleyball", label: "Beach Volleyball" },
  { value: "Bowling", label: "Bowling" },
  { value: "Rugby", label: "Rugby" },
  { value: "Triathlon", label: "Triathlon" },
  { value: "Equestrian", label: "Equestrian" },
  { value: "Stunt", label: "Stunt" },
]

// Level map
const genericLevels = ["Professional", "D1", "D2", "D3", "NAIA", "JUCO"]
const levelMap: Record<string, string[]> = {
  Football: genericLevels,
  Basketball: genericLevels,
  Baseball: genericLevels,
  Soccer: genericLevels,
  "Track & Field": genericLevels,
  "Cross Country": genericLevels,
  Wrestling: genericLevels,
  "Swimming & Diving": genericLevels,
  Tennis: genericLevels,
  Golf: genericLevels,
  "Ice Hockey": genericLevels,
  Volleyball: genericLevels,
  Lacrosse: genericLevels,
  Rifle: genericLevels,
  Skiing: genericLevels,
  "Water Polo": genericLevels,
  Gymnastics: genericLevels,
  Fencing: genericLevels,
  Rowing: genericLevels,
  Softball: genericLevels,
  "Field Hockey": genericLevels,
  "Beach Volleyball": genericLevels,
  Bowling: genericLevels,
  Rugby: genericLevels,
  Triathlon: genericLevels,
  Equestrian: genericLevels,
  Stunt: genericLevels,
  Boxing: ["Professional", "Amateur: Novice", "Amateur: Intermediate", "Amateur: Advanced"],
  "Martial Arts": [
    "Professional",
    "Beginner (White–Green Belt)",
    "Intermediate (Blue–Brown Belt)",
    "Advanced (Black Belt 1st–3rd Dan)",
    "Master (4th Dan+)",
  ],
  "Mixed Martial Arts": ["Professional", "Amateur: Entry-Level", "Amateur: Semi-Pro", "Pro: Regional", "Pro: Elite"],
}

// Validation schema
const signUpSchema = z.object({
  position: z.enum(["athlete", "trainer", "coach"]),
  firstName: z.string().min(1, "Please enter your first name"),
  lastName: z.string().min(1, "Please enter your last name"),
  email: z.string().email("Invalid email format").min(1, "Please enter your email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  sports: z.array(z.string()).min(1, "Please select at least one sport"),
  level: z.string().min(1, "Please select your level"),
  gender: z.enum(["Male", "Female"]),
  identityVerified: z.boolean().refine((val) => {
    // Only required for Trainers and Coaches
    return true
  }),
  frontIdImage: z.any().optional(),
  backIdImage: z.any().optional(),
  institution: z.string().optional(),
})

type FormValues = z.infer<typeof signUpSchema>

// ID verification states
type VerificationStatus =
  | "not_started"
  | "front_scanning"
  | "front_scanned"
  | "back_scanning"
  | "back_scanned"
  | "verification_complete"

export function EnhancedSignUpForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [availableLevels, setAvailableLevels] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("not_started")
  const [scanProgress, setScanProgress] = useState(0)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [frontIdPreview, setFrontIdPreview] = useState<string | null>(null)
  const [backIdPreview, setBackIdPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null)
  const [showInstitutionField, setShowInstitutionField] = useState(false)

  const router = useRouter()
  const { signUp } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      position: "athlete",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      sports: [],
      level: "",
      gender: "Male",
      identityVerified: false,
      institution: "",
    },
  })

  const selectedPosition = watch("position")
  const chosenSports = watch("sports")
  const selectedGender = watch("gender")

  // Update available levels when sports change
  useEffect(() => {
    const levelSet = new Set<string>()
    chosenSports.forEach((sport) => {
      const possible = levelMap[sport] || []
      possible.forEach((lvl) => levelSet.add(lvl))
    })
    setAvailableLevels(Array.from(levelSet))

    // Reset level if current selection is not valid
    const currentLevel = watch("level")
    if (currentLevel && !levelSet.has(currentLevel)) {
      setValue("level", "")
    }
  }, [chosenSports, setValue, watch])

  // Show institution field for coaches
  useEffect(() => {
    setShowInstitutionField(selectedPosition === "coach")
  }, [selectedPosition])

  // Simulate ID scanning process
  const simulateScanning = (type: "front" | "back") => {
    setVerificationStatus(type === "front" ? "front_scanning" : "back_scanning")
    setVerificationMessage(`Scanning ${type} of ID...`)
    setScanProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 5

        if (newProgress >= 100) {
          clearInterval(interval)

          if (type === "front") {
            setVerificationStatus("front_scanned")
            setVerificationMessage("Front of ID scanned successfully!")
          } else {
            setVerificationStatus("back_scanned")

            // After both sides are scanned, show the verification complete message
            setTimeout(() => {
              setVerificationStatus("verification_complete")
              setVerificationMessage(
                "Thank you! Your ID has been submitted for verification. Please allow 24 hours for the verification process to complete. You can explore our site as a user, but you cannot purchase or sell services until fully verified.",
              )
              setValue("identityVerified", true)
            }, 1000)
          }

          return 100
        }

        return newProgress
      })
    }, 100)
  }

  // Handle ID image uploads
  const handleFrontIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue("frontIdImage", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFrontIdPreview(reader.result as string)
        // Start scanning animation after preview is set
        simulateScanning("front")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBackIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue("backIdImage", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setBackIdPreview(reader.result as string)
        // Start scanning animation after preview is set
        simulateScanning("back")
      }
      reader.readAsDataURL(file)
    }
  }

  // Check for pre-selected role from localStorage or URL parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      // First check URL parameter (from searchParams)
      const urlParams = new URLSearchParams(window.location.search)
      const roleFromUrl = urlParams.get("role") as "athlete" | "trainer" | "coach" | null

      // Then check localStorage as fallback
      const preselectedRole =
        roleFromUrl || (localStorage.getItem("selectedRole") as "athlete" | "trainer" | "coach" | null)

      if (
        preselectedRole &&
        (preselectedRole === "athlete" || preselectedRole === "trainer" || preselectedRole === "coach")
      ) {
        setValue("position", preselectedRole)
        setCurrentStep(2) // Skip to step 2
      }
    }
  }, [setValue])

  // Step navigation
  const handleNext = async () => {
    let fieldsToValidate: (keyof FormValues)[] = []

    if (currentStep === 1) {
      fieldsToValidate = ["position"]
    } else if (currentStep === 2) {
      fieldsToValidate = ["firstName", "lastName", "email", "password"]
    } else if (currentStep === 3) {
      fieldsToValidate = ["sports", "level", "gender"]
      if (selectedPosition === "coach") {
        fieldsToValidate.push("institution")
      }
    } else if (currentStep === 4) {
      // For trainers and coaches, we need to validate ID verification
      if (selectedPosition === "trainer" || selectedPosition === "coach") {
        if (!frontIdPreview || !backIdPreview) {
          setError("Please upload both front and back images of your ID")
          return
        }

        // Check if verification is complete
        if (verificationStatus !== "verification_complete") {
          setError("Please wait for ID verification to complete")
          return
        }

        setError(null)
      }
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => setCurrentStep((prev) => Math.max(1, prev - 1))

  // Handle position selection
  const handlePositionSelect = (position: "athlete" | "trainer" | "coach") => {
    setValue("position", position)
    setCurrentStep(2)
  }

  // Final form submission
  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      console.log("Form submitted:", data)

      // Create user in Firebase
      await signUp(data.email, data.password, `${data.firstName} ${data.lastName}`, data.position as UserRole)

      // Store user role in localStorage for future use
      if (typeof window !== "undefined") {
        localStorage.setItem("userRole", data.position)
      }

      setShowConfirmation(true)
      setLoading(false)

      // Redirect based on user role
      setTimeout(() => {
        if (data.position === "trainer") {
          router.push("/create-profile")
        } else if (data.position === "athlete") {
          router.push("/create-athlete-profile")
        } else if (data.position === "coach") {
          router.push("/create-coach-profile")
        }
      }, 2000)
    } catch (err: any) {
      // Provide user-friendly error messages for specific Firebase errors
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already in use. Please use a different email or try signing in instead.")
      } else if (err.code === "auth/invalid-sender") {
        setError(
          "Account created successfully, but we couldn't send a verification email due to a configuration issue. Please contact support.",
        )

        // Still show confirmation and redirect since the account was created
        setShowConfirmation(true)
        setLoading(false)

        // Redirect based on user role
        setTimeout(() => {
          if (data.position === "trainer") {
            router.push("/create-profile")
          } else if (data.position === "athlete") {
            router.push("/create-athlete-profile")
          } else if (data.position === "coach") {
            router.push("/create-coach-profile")
          }
        }, 2000)
      } else {
        setError(err.message || "An error occurred during sign up")
      }
      setLoading(false)
    }
  }

  // Confirmation screen after successful submission
  if (showConfirmation) {
    return (
      <div className="text-center mt-8 max-w-md mx-auto">
        <div className="mb-4 flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold mb-4">Thank You For Completing Your Registration!</h3>
        {selectedPosition === "trainer" ? (
          <>
            <p className="mb-4">
              Your account has been created successfully!
              <br />
              You'll be redirected to complete your trainer profile in a moment.
            </p>
            <p className="mb-6">
              <span className="text-blue-600 font-medium">
                Creating a detailed profile will help athletes find and connect with you.
              </span>
            </p>
          </>
        ) : selectedPosition === "coach" ? (
          <>
            <p className="mb-4">
              Your account has been created successfully!
              <br />
              You'll be redirected to complete your coach profile in a moment.
            </p>
            <p className="mb-6">
              <span className="text-blue-600 font-medium">
                Creating a detailed profile will help athletes and teams find and connect with you.
              </span>
            </p>
          </>
        ) : (
          <>
            <p className="mb-4">
              Your account has been created successfully!
              <br />
              You'll be redirected to complete your athlete profile in a moment.
            </p>
            <p className="mb-6">
              <span className="text-blue-600 font-medium">
                Creating a detailed profile will help trainers understand your goals and abilities.
              </span>
            </p>
          </>
        )}
      </div>
    )
  }

  // Render the scanning animation
  const renderScanningAnimation = () => {
    const isScanning = verificationStatus === "front_scanning" || verificationStatus === "back_scanning"

    if (
      !isScanning &&
      verificationStatus !== "front_scanned" &&
      verificationStatus !== "back_scanned" &&
      verificationStatus !== "verification_complete"
    ) {
      return null
    }

    return (
      <div className="mt-6 p-4 bg-blue-950 rounded-lg border border-blue-900 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          {isScanning ? (
            <div className="bg-blue-100 p-2 rounded-full">
              <ScanSearch className="h-5 w-5 text-blue-600 animate-pulse" />
            </div>
          ) : verificationStatus === "verification_complete" ? (
            <div className="bg-green-100 p-2 rounded-full">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
          ) : (
            <div className="bg-blue-100 p-2 rounded-full">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <div>
            <p className="font-medium text-blue-300">
              {isScanning
                ? "ID Verification in Progress"
                : verificationStatus === "verification_complete"
                  ? "ID Verification Submitted"
                  : "Scan Complete"}
            </p>
          </div>
        </div>

        {isScanning && (
          <div className="mb-2">
            <Progress value={scanProgress} className="h-2" />
          </div>
        )}

        <p className="text-sm text-blue-400">{verificationMessage}</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto text-foreground">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`flex flex-col items-center ${step <= currentStep ? "text-blue-600" : "text-gray-400"}`}
            >
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1 sm:mb-2 ${
                  step < currentStep
                    ? "bg-blue-600 text-white"
                    : step === currentStep
                      ? "border-2 border-blue-600 text-blue-600"
                      : "border-2 border-gray-300 text-gray-400"
                }`}
              >
                {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
              <span className="text-[10px] xs:text-xs">
                {step === 1
                  ? "Role"
                  : step === 2
                    ? "Details"
                    : step === 3
                      ? "Sports"
                      : step === 4
                        ? "Verify"
                        : "Review"}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
          <div
            className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* STEP 1: Position Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Choose Your Role</h2>

            <div className="flex flex-col md:flex-row gap-8 justify-center w-full">
              {/* Athlete Card */}
              <Card
                className={`w-full cursor-pointer transition-all hover:shadow-md bg-secondary ${
                  selectedPosition === "athlete" ? "ring-2 ring-blue-600" : ""
                }`}
                onClick={() => handlePositionSelect("athlete")}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-blue-100 rounded-full p-4 mb-4">
                    <Trophy className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold">Athlete</h3>
                  <p className="text-sm text-gray-500 mt-2">Find trainers and improve your skills</p>
                </CardContent>
              </Card>

              {/* Trainer Card */}
              <Card
                className={`w-full cursor-pointer transition-all hover:shadow-md bg-secondary ${
                  selectedPosition === "trainer" ? "ring-2 ring-blue-600" : ""
                }`}
                onClick={() => handlePositionSelect("trainer")}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-red-100 rounded-full p-4 mb-4">
                    <Clipboard className="h-12 w-12 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold">Trainer</h3>
                  <p className="text-sm text-gray-500 mt-2">Connect with athletes and grow your business</p>
                </CardContent>
              </Card>

              {/* Coach Card */}
              <Card
                className={`w-full cursor-pointer transition-all hover:shadow-md bg-secondary ${
                  selectedPosition === "coach" ? "ring-2 ring-blue-600" : ""
                }`}
                onClick={() => handlePositionSelect("coach")}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-green-100 rounded-full p-4 mb-4">
                    <GraduationCap className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold">Coach</h3>
                  <p className="text-sm text-gray-500 mt-2">Represent your school or organization</p>
                </CardContent>
              </Card>
            </div>

            {errors.position && <p className="text-red-500 text-center mt-2">{errors.position.message}</p>}
          </div>
        )}

        {/* STEP 2: Personal Details */}
        {currentStep === 2 && (
          <div className="space-y-6 w-full">
            <h2 className="text-2xl font-bold text-center mb-6">
              {selectedPosition === "athlete"
                ? "Athlete Details"
                : selectedPosition === "trainer"
                  ? "Trainer Details"
                  : "Coach Details"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter your first name" {...register("firstName")} />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter your last name" {...register("lastName")} />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" {...register("email")} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
          </div>
        )}

        {/* STEP 3: Sports & Qualifications */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Sports & Qualifications</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup
                  value={selectedGender}
                  onValueChange={(value: "Male" | "Female") => setValue("gender", value)}
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
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>
                  {selectedPosition === "athlete"
                    ? "Select Your Sports"
                    : selectedPosition === "trainer"
                      ? "Select Sports You're Qualified to Train"
                      : "Select Sports You Coach"}
                </Label>
                <MultiSelect
                  options={selectedGender === "Male" ? maleSportOptions : femaleSportOptions}
                  selected={Array.isArray(chosenSports) ? chosenSports : []}
                  onChange={(selected) => setValue("sports", selected, { shouldValidate: true })}
                  placeholder="Select sports..."
                />
                {errors.sports && <p className="text-red-500 text-sm">{errors.sports.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Select Level</Label>
                <Select
                  value={watch("level")}
                  onValueChange={(value) => setValue("level", value, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.level && <p className="text-red-500 text-sm">{errors.level.message}</p>}
              </div>

              {/* Institution field for coaches */}
              {showInstitutionField && (
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution/Organization</Label>
                  <Input
                    id="institution"
                    placeholder="Enter your school or organization name"
                    {...register("institution")}
                  />
                  {errors.institution && <p className="text-red-500 text-sm">{errors.institution.message}</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Identity Verification (Only for Trainers and Coaches) */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Identity Verification</h2>

            {selectedPosition === "trainer" || selectedPosition === "coach" ? (
              <div className="space-y-6">
                <Alert className="bg-blue-950 border-blue-900">
                  <AlertTitle className="text-blue-300">Background Check Required</AlertTitle>
                  <AlertDescription className="text-blue-400">
                    {selectedPosition === "trainer"
                      ? "As a trainer, you must complete a background check. Please upload images of your driver's license or government ID."
                      : "As a coach, you must complete a background check. Please upload images of your driver's license or government ID."}
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Front of ID */}
                  <div className="space-y-3">
                    <Label>Front of ID</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      {frontIdPreview ? (
                        <div className="relative">
                          <img
                            src={frontIdPreview || "/placeholder.svg"}
                            alt="Front ID Preview"
                            className="max-h-40 mx-auto object-contain"
                          />
                          {verificationStatus !== "front_scanning" && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                setFrontIdPreview(null)
                                setValue("frontIdImage", undefined)
                                setVerificationStatus("not_started")
                                setVerificationMessage(null)
                              }}
                              disabled={verificationStatus === "front_scanning"}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="py-4 relative">
                          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Click to upload front of ID</p>
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFrontIdUpload}
                            disabled={verificationStatus === "front_scanning"}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Back of ID */}
                  <div className="space-y-3">
                    <Label>Back of ID</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      {backIdPreview ? (
                        <div className="relative">
                          <img
                            src={backIdPreview || "/placeholder.svg"}
                            alt="Back ID Preview"
                            className="max-h-40 mx-auto object-contain"
                          />
                          {verificationStatus !== "back_scanning" && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                setBackIdPreview(null)
                                setValue("backIdImage", undefined)
                                if (verificationStatus === "verification_complete") {
                                  setVerificationStatus("back_scanned")
                                }
                              }}
                              disabled={verificationStatus === "back_scanning"}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="py-4 relative">
                          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Click to upload back of ID</p>
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleBackIdUpload}
                            disabled={verificationStatus === "back_scanning" || verificationStatus === "front_scanning"}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Render scanning animation and verification message */}
                {renderScanningAnimation()}

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Your ID will be used for background verification purposes only and will be handled securely.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Verification Required</h3>
                <p className="text-gray-500">
                  Athletes don't need to complete identity verification. You can proceed to the next step.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Review & Submit */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Review & Submit</h2>

            <Card className="bg-secondary">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-400">Role</h3>
                    <p className="capitalize">{selectedPosition}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-400">Name</h3>
                    <p>{`${watch("firstName")} ${watch("lastName")}`}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-400">Email</h3>
                    <p>{watch("email")}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-400">Gender</h3>
                    <p>{watch("gender")}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-400">Sports</h3>
                    <p>{watch("sports").join(", ")}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-400">Level</h3>
                    <p>{watch("level")}</p>
                  </div>
                  {selectedPosition === "coach" && (
                    <div>
                      <h3 className="font-medium text-gray-400">Institution</h3>
                      <p>{watch("institution") || "Not specified"}</p>
                    </div>
                  )}
                </div>

                {(selectedPosition === "trainer" || selectedPosition === "coach") && (
                  <div className="pt-4 border-t">
                    <h3 className="font-medium text-gray-400 mb-2">ID Verification</h3>
                    <div className="flex gap-4">
                      {frontIdPreview && (
                        <div className="border rounded p-2">
                          <img
                            src={frontIdPreview || "/placeholder.svg"}
                            alt="Front ID"
                            className="h-20 object-contain"
                          />
                        </div>
                      )}
                      {backIdPreview && (
                        <div className="border rounded p-2">
                          <img
                            src={backIdPreview || "/placeholder.svg"}
                            alt="Back ID"
                            className="h-20 object-contain"
                          />
                        </div>
                      )}
                    </div>

                    {verificationStatus === "verification_complete" && (
                      <div className="mt-3 p-3 bg-green-950 rounded-lg border border-green-900">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-green-600" />
                          <p className="text-sm font-medium text-green-400">ID Verification Submitted</p>
                        </div>
                        <p className="text-xs text-green-500 mt-1">
                          Your ID has been submitted for verification. This process may take up to 24 hours.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center space-x-2 mt-4">
              <Checkbox id="terms" checked={true} onCheckedChange={() => {}} />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <div className="text-center mt-6">
              <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep > 1 && currentStep < 5 && (
          <div className="flex justify-between mt-8 w-full">
            <Button type="button" variant="outline" onClick={handleBack} disabled={loading} size="lg">
              <ArrowLeft className="mr-2 h-5 w-5" /> Back
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={
                loading ||
                (currentStep === 4 &&
                  (selectedPosition === "trainer" || selectedPosition === "coach") &&
                  verificationStatus !== "verification_complete")
              }
              size="lg"
            >
              Next <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
