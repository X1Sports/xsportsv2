"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, MapPin, Loader2, AlertCircle, X, Sparkles } from "lucide-react"
import { format, addDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Trainer } from "@/data/mock-profiles"

// Custom hook for detecting mobile screens
function useMobileDetect() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

export function SearchTrainers() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [location, setLocation] = useState("")
  const [locationLoading, setLocationLoading] = useState(false)
  const [geolocationDisabled, setGeolocationDisabled] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [mockLocationUsed, setMockLocationUsed] = useState(false)
  const initialRender = useRef(true)
  const [selectedSchools, setSelectedSchools] = useState<string[]>([])
  const [isMockLocationActive, setIsMockLocationActive] = useState(false)
  const [usingMockLocation, setUsingMockLocation] = useState(false)
  const [isInitialMockLocationSet, setIsInitialMockLocationSet] = useState(false)
  const [attemptedGeolocation, setAttemptedGeolocation] = useState(false)
  const [shouldUseMockLocation, setShouldUseMockLocation] = useState(false)
  const [hasCalledUseMockLocation, setHasCalledUseMockLocation] = useState(false)
  const [hasMockLocationBeenCalled, setHasMockLocationBeenCalled] = useState(false)

  // AI search states
  const [aiSearchQuery, setAiSearchQuery] = useState("")
  const [isAiSearchActive, setIsAiSearchActive] = useState(false)
  const [aiSearchResults, setAiSearchResults] = useState<Trainer[]>([])
  const [aiSearchLoading, setAiSearchLoading] = useState(false)
  const [aiSearchError, setAiSearchError] = useState<string | null>(null)
  const [aiSearchExplanation, setAiSearchExplanation] = useState<string | null>(null)
  const [aiSearchParameters, setAiSearchParameters] = useState<any>(null)
  const [aiSearchSuggestions, setAiSearchSuggestions] = useState<string[]>([
    // Search queries
    "Basketball trainers in New York",
    "Affordable MMA coaches near me",
    "Tennis trainers available on weekends",
    "Experienced swimming coaches for beginners",
    // General sports questions
    "What are the best exercises for basketball conditioning?",
    "How to improve my sprint technique?",
    "NCAA eligibility requirements for Division I",
    "Recovery tips after intense training",
  ])

  // Add these new state variables near the other state declarations (around line 70-80)
  const [streamingResponse, setStreamingResponse] = useState<string>("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [fullResponse, setFullResponse] = useState<string>("")
  const [streamingComplete, setStreamingComplete] = useState(false)
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [scrollPosition, setScrollPosition] = useState(0)
  const logoContainerRef = useRef<HTMLDivElement>(null)

  // Replace the existing isMobile state with the hook
  const isMobile = useMobileDetect()

  // Use a mock location as a fallback
  const useMockLocation = useCallback(() => {
    setLocationLoading(true)
    setUsingMockLocation(true)
    // Simulate a delay to make it feel like it's doing something
    const delay = 800

    const timeoutId = setTimeout(() => {
      setLocation("New York, NY") // Default to a popular location
      setLocationLoading(false)
      setMockLocationUsed(true)
      setIsMockLocationActive(true)
      setUsingMockLocation(false)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [])

  // Call useMockLocation unconditionally to satisfy the Rules of Hooks
  useEffect(() => {
    if (shouldUseMockLocation && !hasCalledUseMockLocation) {
      useMockLocation()
      setShouldUseMockLocation(false)
      setHasCalledUseMockLocation(true)
    }
  }, [shouldUseMockLocation, useMockLocation, hasCalledUseMockLocation])

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      if (!isInitialMockLocationSet) {
        setShouldUseMockLocation(true)
        setIsInitialMockLocationSet(true)
      }
    }
  }, [isInitialMockLocationSet])

  useEffect(() => {
    if (!location && !mockLocationUsed && !usingMockLocation && !attemptedGeolocation) {
      setShouldUseMockLocation(true)
    }
  }, [location, mockLocationUsed, usingMockLocation, attemptedGeolocation])

  useEffect(() => {
    if (shouldUseMockLocation && !hasCalledUseMockLocation) {
      setShouldUseMockLocation(false)
      setHasCalledUseMockLocation(true)
    }
  }, [shouldUseMockLocation, useMockLocation, hasCalledUseMockLocation])

  const handleTabClick = (tab: string) => {
    if (activeTab === tab) {
      setActiveTab(null)
      setSearchOpen(false)
    } else {
      setActiveTab(tab)
      setSearchOpen(true)
    }
  }

  // Check if geolocation is available
  const isGeolocationAvailable = () => {
    return typeof navigator !== "undefined" && "geolocation" in navigator
  }

  const handleLocationSelection = useCallback((newLocation: string) => {
    setLocation(newLocation)
    setActiveTab(null)
    setSearchOpen(false)
  }, [])

  // We've replaced the JavaScript scrolling with CSS animation

  // Try to use geolocation, but with better error handling
  const tryUseGeolocation = useCallback(() => {
    setLocationLoading(true)
    setAttemptedGeolocation(true)

    if (!isGeolocationAvailable()) {
      setGeolocationDisabled(true)
      setLocationLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success - we'll use a mock location since we can't actually do reverse geocoding
        // in this environment, but in a real app you would use the coordinates
        setLocation("Current Location (New York, NY)")
        setLocationLoading(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        setGeolocationDisabled(true)
        setLocationLoading(false)
      },
      { timeout: 5000 },
    )
  }, [])

  // Handle AI search
  const handleAiSearch = async () => {
    // Validate the query before proceeding
    if (!aiSearchQuery || typeof aiSearchQuery !== "string" || !aiSearchQuery.trim() || aiSearchLoading) {
      return
    }

    // Add the user message to the chat history
    const userMessage = { role: "user" as const, content: aiSearchQuery }
    setMessages((prev) => [...prev, userMessage])

    setAiSearchLoading(true)
    setAiSearchError(null)
    setIsAiSearchActive(true)

    try {
      // Show a temporary message while waiting for the response
      setStreamingResponse("Thinking...")
      setIsStreaming(true)

      // Use the sports-qa endpoint for all queries
      const response = await fetch("/api/sports-qa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: aiSearchQuery.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get an answer")
      }

      const data = await response.json()

      // Clear the search query
      setAiSearchQuery("")

      // Clear any previous search-related data
      setAiSearchExplanation("")
      setAiSearchResults([])
      setAiSearchParameters(null)

      // Check if data.answer exists before using it
      if (data && data.answer) {
        // Add the assistant message to the chat history
        const assistantMessage = { role: "assistant" as const, content: data.answer }
        setMessages((prev) => [...prev, assistantMessage])

        // Use the streaming function with the response
        simulateStreamingResponse(data.answer)
      } else {
        // Handle the case where answer is missing
        const fallbackMessage = "I don't have an answer for that question right now."
        const assistantMessage = { role: "assistant" as const, content: fallbackMessage }
        setMessages((prev) => [...prev, assistantMessage])

        simulateStreamingResponse(fallbackMessage)
      }
    } catch (error: any) {
      console.error("Sports Q&A error:", error)
      setAiSearchError("Failed to get an answer to your sports question. Please try again.")
      setIsStreaming(false)
      setStreamingResponse("")
    } finally {
      setAiSearchLoading(false)
    }
  }

  // Helper function to check if a query is sports-related
  const checkIfSportsRelated = (query: string): boolean => {
    if (!query || typeof query !== "string") return false

    const sportsKeywords = [
      "sport",
      "athlete",
      "coach",
      "training",
      "workout",
      "fitness",
      "game",
      "match",
      "tournament",
      "basketball",
      "football",
      "soccer",
      "baseball",
      "tennis",
      "golf",
      "swimming",
      "running",
      "track",
      "field",
      "volleyball",
      "hockey",
      "rugby",
      "cricket",
      "boxing",
      "mma",
      "martial arts",
      "wrestling",
      "gymnastics",
      "cycling",
      "skiing",
      "snowboarding",
      "skateboarding",
      "surfing",
      "team",
      "player",
      "league",
      "championship",
      "olympic",
      "ncaa",
      "nba",
      "nfl",
      "mlb",
      "nhl",
      "trainer",
      "exercise",
      "drill",
      "technique",
      "strategy",
      "performance",
      "conditioning",
      "strength",
      "agility",
      "speed",
      "endurance",
      "flexibility",
      "nutrition",
      "injury",
      "recovery",
      "competition",
      "practice",
      "skill",
      "talent",
      "recruit",
      "scholarship",
      "division",
    ]

    const lowerQuery = query.toLowerCase()

    // Check if any sports keyword is in the query
    return sportsKeywords.some((keyword) => lowerQuery.includes(keyword))
  }

  // Helper function to determine if a query is a search query or a general question
  function checkIfSearchQuery(query: string): boolean {
    if (!query || typeof query !== "string") return false

    const lowerQuery = query.toLowerCase()

    // Strong search indicators - if these patterns are found, it's likely a search
    const strongSearchPatterns = [
      /find (me )?(a |an )?trainer/i,
      /looking for (a |an )?trainer/i,
      /search for (a |an )?trainer/i,
      /trainers (in|near|around|at|close to)/i,
      /coaches (in|near|around|at|close to)/i,
      /(find|show|get) (me )?(trainers|coaches)/i,
    ]

    for (const pattern of strongSearchPatterns) {
      if (pattern.test(lowerQuery)) {
        return true
      }
    }

    // Check if it's a question pattern (starts with what, how, why, when, where, who, can, could, would, is, are, do, does, did, should, will)
    const questionPattern = /^(what|how|why|when|where|who|can|could|would|is|are|do|does|did|should|will)\s/i
    if (questionPattern.test(lowerQuery)) {
      return false // It's likely a general question, not a search
    }

    // Also check for question marks, which indicate a question rather than a search
    if (lowerQuery.includes("?")) {
      return false
    }

    // Check for common question phrases anywhere in the query
    const questionPhrases = [
      "what is",
      "how to",
      "how do",
      "why is",
      "when should",
      "where can",
      "who is",
      "can i",
      "should i",
      "tell me about",
      "explain",
      "get into",
      "join",
      "become",
      "qualify for",
      "requirements for",
    ]

    if (questionPhrases.some((phrase) => lowerQuery.includes(phrase))) {
      return false
    }

    // Special case for NCAA-related questions
    if (lowerQuery.includes("ncaa") || lowerQuery.includes("college") || lowerQuery.includes("university")) {
      return false
    }

    // Location-based search indicators
    const locationPatterns = [/(in|near|around|at|close to) [a-z\s]+/i, /[a-z\s]+ area/i]

    // Sport-specific search indicators
    const sportPatterns = [
      /(basketball|football|soccer|baseball|tennis|swimming|golf|mma|boxing) (trainer|coach|instructor)/i,
    ]

    // Check for location or sport patterns that indicate a search
    for (const pattern of [...locationPatterns, ...sportPatterns]) {
      if (pattern.test(lowerQuery)) {
        return true
      }
    }

    // Search keywords - less reliable but still useful indicators
    const searchKeywords = [
      "find",
      "search",
      "looking for",
      "need",
      "want",
      "recommend",
      "suggestion",
      "best",
      "trainer",
      "coach",
      "instructor",
      "teacher",
      "mentor",
      "expert",
      "professional",
      "near",
      "around",
      "in",
      "at",
      "location",
      "area",
      "city",
      "state",
      "country",
      "available",
      "schedule",
      "appointment",
      "session",
      "class",
      "lesson",
      "program",
    ]

    // Count search keywords in the query
    const searchKeywordCount = searchKeywords.filter((keyword) => lowerQuery.includes(keyword)).length

    // If multiple search keywords are found, it's likely a search query
    return searchKeywordCount >= 2
  }

  // Add this function after the checkIfSearchQuery function (around line 400)
  // This simulates streaming text responses word by word
  const simulateStreamingResponse = (response: string) => {
    // Ensure response is a valid string
    if (!response || typeof response !== "string") {
      response = "I don't have an answer for that question right now."
    }

    setIsStreaming(true)
    setStreamingComplete(false)
    setStreamingResponse("")
    setFullResponse(response)

    const words = response.split(" ")
    let currentIndex = 0

    const streamInterval = setInterval(() => {
      if (currentIndex < words.length) {
        setStreamingResponse((prev) => prev + (prev ? " " : "") + words[currentIndex])
        currentIndex++
      } else {
        clearInterval(streamInterval)
        setIsStreaming(false)
        setStreamingComplete(true)
      }
    }, 50) // Adjust speed as needed

    return () => clearInterval(streamInterval)
  }

  const popularLocations = [
    { name: "New York", state: "NY", image: "bg-gradient-to-br from-blue-500 to-blue-600" },
    { name: "Los Angeles", state: "CA", image: "bg-gradient-to-br from-red-500 to-red-600" },
    { name: "Chicago", state: "IL", image: "bg-gradient-to-br from-green-500 to-green-600" },
    { name: "Miami", state: "FL", image: "bg-gradient-to-br from-purple-500 to-purple-600" },
  ]

  // Call useMockLocation conditionally based on shouldUseMockLocation
  useEffect(() => {
    if (shouldUseMockLocation && !hasCalledUseMockLocation) {
      useMockLocation()
      setShouldUseMockLocation(false)
      setHasCalledUseMockLocation(true)
    }
  }, [shouldUseMockLocation, useMockLocation, hasCalledUseMockLocation])

  const handleSuggestionClick = (suggestion: string) => {
    setAiSearchQuery(suggestion)
    handleAiSearch()
  }

  return (
    <div className="w-full relative z-10">
      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="standard" className="flex-1">
            Trainer Search
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex-1">
            <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
            Advanced AI Search
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="mt-0">
          {/* Main Search Bar */}
          <div
            className={`bg-gray-900 rounded-xl sm:rounded-full shadow-lg border border-gray-800 transition-all duration-300 ${searchOpen ? "rounded-t-xl sm:rounded-t-full rounded-b-none border-b-0" : ""}`}
          >
            <div className="flex flex-col sm:flex-row relative">
              {/* Where */}
              <button
                onClick={() => {
                  handleTabClick("where")
                  if (activeTab !== "where") {
                    setLocation("") // Clear location when opening
                  }
                }}
                className={`flex-1 flex flex-col items-start text-left py-3 px-4 sm:py-3.5 sm:pl-8 sm:pr-6 ${
                  activeTab === "where" ? "bg-gray-800" : "hover:bg-gray-800/50"
                } transition-colors ${
                  searchOpen && activeTab === "where"
                    ? "rounded-t-xl sm:rounded-t-full"
                    : "rounded-t-xl sm:rounded-l-full"
                }`}
              >
                <span className="text-xs font-bold text-white">Where</span>
                <div className="flex items-center">
                  {locationLoading ? (
                    <div className="flex items-center text-white/70">
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      <span className="text-sm">Setting location...</span>
                    </div>
                  ) : (
                    <span className={location && activeTab !== "where" ? "text-sm text-white" : "text-sm text-white/70"}>
                      {(location && activeTab !== "where") ? location : "Search destinations"}
                    </span>
                  )}
                </div>
              </button>

              <span className="hidden sm:block h-8 w-px bg-gray-700 self-center"></span>

              {/* What (Sports) */}
              <button
                onClick={() => handleTabClick("what")}
                className={`flex-1 flex flex-col items-start text-left py-3 px-4 sm:py-3.5 sm:px-6 ${
                  activeTab === "what" ? "bg-gray-800" : "hover:bg-gray-800/50"
                } transition-colors`}
              >
                <span className="text-xs font-bold text-white">Sports</span>
                <span className="text-sm text-white/70">Baseball, Football, Soccer...</span>
              </button>

              <span className="hidden sm:block h-8 w-px bg-gray-700 self-center"></span>

              {/* When */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    onClick={() => handleTabClick("when")}
                    className={`flex-1 flex flex-col items-start text-left py-3 px-4 sm:py-3.5 sm:px-6 ${
                      activeTab === "when" ? "bg-gray-800" : "hover:bg-gray-800/50"
                    } transition-colors ${searchOpen && activeTab === "when" ? "" : "sm:rounded-r-full"}`}
                  >
                    <span className="text-xs font-bold text-white">When</span>
                    <span className={dateRange?.from ? "text-sm text-white" : "text-sm text-white/70"}>
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM d, yyyy")
                        )
                      ) : (
                        "Add dates"
                      )}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-white border border-gray-200 shadow-lg relative z-20"
                  align="start"
                >
                  <div className="relative">
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-gray-100"
                        onClick={() => {
                          setActiveTab(null)
                          setSearchOpen(false)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      numberOfMonths={isMobile ? 1 : 2}
                      className="bg-white p-3"
                    />
                  </div>
                </PopoverContent>
              </Popover>

              {/* Search Button */}
              <div className="absolute right-2 top-2 sm:relative sm:right-auto sm:top-auto sm:flex sm:items-center sm:pr-2">
                <Button
                  className="rounded-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 h-10 w-10 sm:h-12 sm:w-12 p-0 flex items-center justify-center"
                  onClick={() => console.log("Search clicked")}
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded Search Content */}
          {searchOpen && activeTab === "where" && (
            <div className="bg-gray-900 p-4 sm:p-6 rounded-b-xl sm:rounded-b-3xl shadow-lg border border-gray-800 border-t-0 relative z-30 max-h-[400px] overflow-y-auto">
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-gray-100"
                  onClick={() => {
                    setActiveTab(null)
                    setSearchOpen(false)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-base sm:text-lg text-white">Search by location</h3>

                {geolocationDisabled && (
                  <Alert
                    variant="warning"
                    className="bg-amber-50 text-amber-800 border-amber-200 mb-4 py-2 text-xs sm:text-sm"
                  >
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <AlertTitle className="text-xs sm:text-sm">Location services unavailable</AlertTitle>
                    <AlertDescription className="text-xs sm:text-sm">
                      Please select a location from the options below or enter your location manually.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <Input
                    placeholder="City, neighborhood, or address"
                    className="pl-9 sm:pl-10 py-5 sm:py-6 border-gray-300 rounded-lg sm:rounded-xl text-gray-800 text-sm sm:text-base"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    autoFocus={activeTab === "where"}
                  />
                </div>

                <div className="mt-3 sm:mt-4">
                  <h4 className="font-medium text-xs sm:text-sm text-white/70 mb-2 sm:mb-3">POPULAR LOCATIONS</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {popularLocations.map((loc) => (
                      <div
                        key={loc.name}
                        className="bg-gray-800 hover:bg-gray-700 p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-pointer transition-colors"
                        onClick={() => {
                          setLocation(`${loc.name}, ${loc.state}`)
                          setActiveTab(null)
                          setSearchOpen(false)
                        }}
                      >
                        <div
                          className={`w-full h-16 sm:h-24 ${loc.image} rounded-md sm:rounded-lg mb-2 flex items-center justify-center text-white`}
                        >
                          <MapPin className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <p className="font-medium text-center text-white text-xs sm:text-base">
                          {loc.name}, {loc.state}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 sm:mt-4">
                  <h4 className="font-medium text-xs sm:text-sm text-white/70 mb-2 sm:mb-3">LOCATION OPTIONS</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      className="w-full flex items-center p-2 sm:p-3 rounded-lg hover:bg-gray-800 transition-colors bg-gray-800/50"
                      onClick={() => {
                        setShouldUseMockLocation(true)
                        setActiveTab(null)
                        setSearchOpen(false)
                      }}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-900 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white text-xs sm:text-base">New York, NY</p>
                        <p className="text-xs sm:text-sm text-white/70">Popular training destination</p>
                      </div>
                    </button>

                    {!geolocationDisabled && (
                      <button
                        className="w-full flex items-center p-2 sm:p-3 rounded-lg hover:bg-gray-800 transition-colors bg-gray-800/50"
                        onClick={() => {
                          tryUseGeolocation()
                          setActiveTab(null)
                          setSearchOpen(false)
                        }}
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-900 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-white text-xs sm:text-base">Use current location</p>
                          <p className="text-xs sm:text-sm text-white/70">Find trainers near you</p>
                        </div>
                      </button>
                    )}

                    <button
                      className="w-full flex items-center p-2 sm:p-3 rounded-lg hover:bg-gray-800 transition-colors bg-gray-800/50"
                      onClick={() => {
                        setLocation("Los Angeles, CA")
                        setActiveTab(null)
                        setSearchOpen(false)
                      }}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-900 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white text-xs sm:text-base">Los Angeles, CA</p>
                        <p className="text-xs sm:text-sm text-white/70">Elite training hub</p>
                      </div>
                    </button>

                    <button
                      className="w-full flex items-center p-2 sm:p-3 rounded-lg hover:bg-gray-800 transition-colors bg-gray-800/50"
                      onClick={() => {
                        setLocation("Chicago, IL")
                        setActiveTab(null)
                        setSearchOpen(false)
                      }}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-900 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white text-xs sm:text-base">Chicago, IL</p>
                        <p className="text-xs sm:text-sm text-white/70">Midwest training center</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sports Selection */}
          {searchOpen && activeTab === "what" && (
            <div className="bg-gray-900 p-4 sm:p-6 rounded-b-xl sm:rounded-b-3xl shadow-lg border border-gray-800 border-t-0 relative z-30 max-h-[400px] overflow-y-auto">
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-gray-700 text-white"
                  onClick={() => {
                    setActiveTab(null)
                    setSearchOpen(false)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <h3 className="font-semibold text-base sm:text-lg text-white">Select Sports</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Popular Sports */}
                  <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                    <input type="checkbox" id="baseball" className="rounded text-blue-500" />
                    <label htmlFor="baseball" className="text-white">Baseball</label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                    <input type="checkbox" id="football" className="rounded text-blue-500" />
                    <label htmlFor="football" className="text-white">Football</label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                    <input type="checkbox" id="soccer" className="rounded text-blue-500" />
                    <label htmlFor="soccer" className="text-white">Soccer</label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                    <input type="checkbox" id="basketball" className="rounded text-blue-500" />
                    <label htmlFor="basketball" className="text-white">Basketball</label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                    <input type="checkbox" id="volleyball" className="rounded text-blue-500" />
                    <label htmlFor="volleyball" className="text-white">Volleyball</label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                    <input type="checkbox" id="tennis" className="rounded text-blue-500" />
                    <label htmlFor="tennis" className="text-white">Tennis</label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                    <input type="checkbox" id="golf" className="rounded text-blue-500" />
                    <label htmlFor="golf" className="text-white">Golf</label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                    <input type="checkbox" id="hockey" className="rounded text-blue-500" />
                    <label htmlFor="hockey" className="text-white">Hockey</label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                    <input type="checkbox" id="boxing" className="rounded text-blue-500" />
                    <label htmlFor="boxing" className="text-white">Boxing</label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                    <input type="checkbox" id="mma" className="rounded text-blue-500" />
                    <label htmlFor="mma" className="text-white">MMA</label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                    <input type="checkbox" id="swimming" className="rounded text-blue-500" />
                    <label htmlFor="swimming" className="text-white">Swimming</label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                    <input type="checkbox" id="track" className="rounded text-blue-500" />
                    <label htmlFor="track" className="text-white">Track & Field</label>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-white/70 mb-3">Division Level</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                      <input type="checkbox" id="d1" className="rounded text-blue-500" />
                      <label htmlFor="d1" className="text-white">D1</label>
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                      <input type="checkbox" id="d2" className="rounded text-blue-500" />
                      <label htmlFor="d2" className="text-white">D2</label>
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                      <input type="checkbox" id="d3" className="rounded text-blue-500" />
                      <label htmlFor="d3" className="text-white">D3</label>
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                      <input type="checkbox" id="pro" className="rounded text-blue-500" />
                      <label htmlFor="pro" className="text-white">Professional</label>
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                      <input type="checkbox" id="highschool" className="rounded text-blue-500" />
                      <label htmlFor="highschool" className="text-white">High School</label>
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                      <input type="checkbox" id="youth" className="rounded text-blue-500" />
                      <label htmlFor="youth" className="text-white">Youth</label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-white/70 mb-3">Gender</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                      <input type="checkbox" id="male" className="rounded text-blue-500" />
                      <label htmlFor="male" className="text-white">Male</label>
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                      <input type="checkbox" id="female" className="rounded text-blue-500" />
                      <label htmlFor="female" className="text-white">Female</label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-4 sm:mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSchools([])}
                    className="text-white border-gray-700 hover:bg-gray-800 text-xs sm:text-sm h-8 sm:h-10"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={() => {
                      setActiveTab(null)
                      setSearchOpen(false)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm h-8 sm:h-10"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* University Logos - Only show when search is not open */}
          {!searchOpen && !isAiSearchActive && (
            <div className="mt-8 overflow-x-auto pb-4 -mx-4 px-4 logo-container" style={{ backgroundColor: "transparent" }}>
              <div ref={logoContainerRef} className="flex space-x-6 min-w-max" style={{ backgroundColor: "transparent" }}>
                <img src="/images/logos/wsu-updated.png" alt="Washington State University" className="h-14 sm:h-18 w-auto logo-transparent" style={{ backgroundColor: "transparent", mixBlendMode: "multiply" }} />
                <img src="/images/logos/duke-logo-new.png" alt="Duke University" className="h-14 sm:h-18 w-auto logo-transparent" style={{ backgroundColor: "transparent", mixBlendMode: "multiply" }} />
                <img src="/images/logos/virginia-tech-logo-new.png" alt="Virginia Tech" className="h-14 sm:h-18 w-auto logo-transparent" style={{ backgroundColor: "transparent", mixBlendMode: "multiply" }} />
                <img src="/images/logos/fsu-updated.png" alt="Florida State University" className="h-14 sm:h-18 w-auto logo-transparent" style={{ backgroundColor: "transparent", mixBlendMode: "multiply" }} />
                <img src="/images/logos/ohio-state-updated.png" alt="Ohio State University" className="h-14 sm:h-18 w-auto logo-transparent" style={{ backgroundColor: "transparent", mixBlendMode: "multiply" }} />
                <img src="/images/logos/penn-state-updated.png" alt="Penn State University" className="h-14 sm:h-18 w-auto logo-transparent" style={{ backgroundColor: "transparent", mixBlendMode: "multiply" }} />
                <img src="/images/logos/michigan-updated.png" alt="University of Michigan" className="h-14 sm:h-18 w-auto logo-transparent" style={{ backgroundColor: "transparent", mixBlendMode: "multiply" }} />
                <img src="/images/logos/alabama-updated.png" alt="University of Alabama" className="h-14 sm:h-18 w-auto logo-transparent" style={{ backgroundColor: "transparent", mixBlendMode: "multiply" }} />
                <img src="/images/logos/clemson-updated.png" alt="Clemson University" className="h-14 sm:h-18 w-auto logo-transparent" style={{ backgroundColor: "transparent", mixBlendMode: "multiply" }} />
                <img src="/images/logos/lsu-updated.png" alt="Louisiana State University" className="h-14 sm:h-18 w-auto logo-transparent" style={{ backgroundColor: "transparent", mixBlendMode: "multiply" }} />
                <img src="/images/logos/oregon-updated.png" alt="University of Oregon" className="h-14 sm:h-18 w-auto logo-transparent" style={{ backgroundColor: "transparent", mixBlendMode: "multiply" }} />
                <img src="/images/logos/texas-updated.png" alt="University of Texas" className="h-14 sm:h-18 w-auto logo-transparent" style={{ backgroundColor: "transparent", mixBlendMode: "multiply" }} />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ai" className="mt-0">
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Title and description */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold text-base sm:text-lg text-white">Advanced AI Assistant</h3>
                </div>
                <p className="text-xs text-gray-500 ml-7">Ask questions about sports, training, coaching, and more</p>
              </div>

              {/* Chat messages area - only show when there are messages */}
              {messages.length > 0 && (
                <div className="mt-2 border border-gray-700 rounded-lg p-3 sm:p-4 max-h-[400px] overflow-y-auto bg-gray-800">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === "user"
                              ? "bg-blue-600 text-white rounded-tr-none"
                              : "bg-gray-700 text-white rounded-tl-none"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}

                    {/* Show streaming response if active */}
                    {isStreaming && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-lg bg-gray-700 text-white rounded-tl-none">
                          <p className="text-sm">
                            {streamingResponse}
                            <span className="inline-block w-1.5 h-4 ml-0.5 bg-blue-600 animate-pulse"></span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Input area */}
              <div className="relative">
                <Textarea
                  placeholder="Ask me about sports, training, coaching, or athletic development..."
                  className="min-h-20 sm:min-h-24 pl-3 pr-10 py-2 sm:pl-4 sm:pr-12 sm:py-3 resize-none text-white bg-gray-800 border-gray-700 text-sm sm:text-base"
                  value={aiSearchQuery}
                  onChange={(e) => setAiSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleAiSearch()
                    }
                  }}
                />
                <Button
                  className="absolute right-2 bottom-2 rounded-full bg-blue-600 hover:bg-blue-700 h-7 w-7 sm:h-8 sm:w-8 p-0 flex items-center justify-center"
                  onClick={handleAiSearch}
                  disabled={aiSearchLoading || !aiSearchQuery.trim()}
                >
                  {aiSearchLoading ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>

              {/* Example queries - only show when there are no messages */}
              {messages.length === 0 && (
                <div className="mt-1 sm:mt-2">
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">Try asking about:</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {aiSearchSuggestions
                      .filter(
                        (s) =>
                          s.includes("?") || s.toLowerCase().startsWith("how") || s.toLowerCase().startsWith("what"),
                      )
                      .slice(0, 6)
                      .map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs sm:text-sm bg-gray-800 border-gray-700 hover:bg-gray-700 text-white h-auto py-1 px-2"
                          onClick={() => {
                            setAiSearchQuery(suggestion)
                            handleAiSearch()
                          }}
                        >
                          {suggestion}
                        </Button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Show error alert if there's an error */}
          {aiSearchError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{aiSearchError}</AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}