import { trainers } from "@/data/mock-profiles"

// Explicitly set the runtime to nodejs
export const runtime = "nodejs"

// Define the structure for search parameters
type SearchParams = {
  location?: string
  sports?: string[]
  keywords?: string[]
  priceRange?: { min?: number; max?: number }
  availability?: string[]
  experience?: string
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { query } = await req.json()

    if (!query) {
      return Response.json({ error: "Search query is required" }, { status: 400 })
    }

    console.log("Processing search query with server-side implementation:", query)

    // Extract parameters using our own implementation instead of OpenAI
    const extractedParams = {
      location: extractLocation(query),
      sports: extractSports(query),
      keywords: extractKeywords(query),
      priceRange: extractPriceRange(query),
    }

    // Filter trainers based on extracted parameters
    let filteredTrainers = [...trainers]

    // Filter by location if provided
    if (extractedParams.location) {
      filteredTrainers = filteredTrainers.filter((trainer) =>
        trainer.location.toLowerCase().includes(extractedParams.location!.toLowerCase()),
      )
    }

    // Filter by sports if provided
    if (extractedParams.sports && extractedParams.sports.length > 0) {
      filteredTrainers = filteredTrainers.filter((trainer) =>
        trainer.sports.some((sport) =>
          extractedParams.sports!.some((s) => sport.toLowerCase().includes(s.toLowerCase())),
        ),
      )
    }

    // Filter by price range
    if (extractedParams.priceRange) {
      if (extractedParams.priceRange.min !== undefined) {
        filteredTrainers = filteredTrainers.filter((trainer) => trainer.price >= extractedParams.priceRange!.min!)
      }
      if (extractedParams.priceRange.max !== undefined) {
        filteredTrainers = filteredTrainers.filter((trainer) => trainer.price <= extractedParams.priceRange!.max!)
      }
    }

    // Generate an explanation
    const explanation = generateExplanation(query, filteredTrainers.length)

    // Return the filtered trainers and explanation
    return Response.json({
      trainers: filteredTrainers,
      parameters: extractedParams,
      explanation: explanation,
    })
  } catch (error: any) {
    console.error("Error in AI search API:", error)

    return Response.json(
      {
        error: "An error occurred during your search request.",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Helper functions for parameter extraction
function extractLocation(query: string): string | undefined {
  const commonLocations = ["new york", "los angeles", "chicago", "miami", "boston", "seattle", "dallas", "houston"]
  const lowerQuery = query.toLowerCase()

  for (const location of commonLocations) {
    if (lowerQuery.includes(location)) {
      return location
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    }
  }

  return undefined
}

function extractSports(query: string): string[] {
  const commonSports = ["basketball", "soccer", "football", "baseball", "tennis", "swimming", "golf", "mma", "boxing"]
  const lowerQuery = query.toLowerCase()
  const foundSports: string[] = []

  for (const sport of commonSports) {
    if (lowerQuery.includes(sport)) {
      foundSports.push(sport.charAt(0).toUpperCase() + sport.slice(1))
    }
  }

  return foundSports
}

function extractKeywords(query: string): string[] {
  const qualityKeywords = ["experienced", "certified", "professional", "affordable", "best", "top", "elite"]
  const lowerQuery = query.toLowerCase()
  const foundKeywords: string[] = []

  for (const keyword of qualityKeywords) {
    if (lowerQuery.includes(keyword)) {
      foundKeywords.push(keyword)
    }
  }

  return foundKeywords
}

function extractPriceRange(query: string): { min?: number; max?: number } | undefined {
  const lowerQuery = query.toLowerCase()
  const priceRange: { min?: number; max?: number } = {}

  // Look for patterns like "under $100" or "less than $100"
  const maxMatch = lowerQuery.match(/(?:under|less than|below|max|maximum)\s*\$?(\d+)/i)
  if (maxMatch) {
    priceRange.max = Number.parseInt(maxMatch[1])
  }

  // Look for patterns like "over $50" or "more than $50"
  const minMatch = lowerQuery.match(/(?:over|more than|above|min|minimum)\s*\$?(\d+)/i)
  if (minMatch) {
    priceRange.min = Number.parseInt(minMatch[1])
  }

  // Look for range like "$50-$100" or "between $50 and $100"
  const rangeMatch = lowerQuery.match(/\$?(\d+)\s*(?:-|to|and)\s*\$?(\d+)/i)
  if (rangeMatch) {
    priceRange.min = Number.parseInt(rangeMatch[1])
    priceRange.max = Number.parseInt(rangeMatch[2])
  }

  return Object.keys(priceRange).length > 0 ? priceRange : undefined
}

function generateExplanation(query: string, resultCount: number): string {
  if (resultCount === 0) {
    return `I couldn't find any trainers matching your search for "${query}". Try broadening your search terms for more results.`
  }

  if (resultCount === 1) {
    return `I found 1 trainer that matches your search for "${query}". This trainer seems to be a perfect fit based on your criteria.`
  }

  if (resultCount <= 3) {
    return `I found ${resultCount} trainers that match your search for "${query}". These trainers are the best matches based on your criteria.`
  }

  return `I found ${resultCount} trainers that match your search for "${query}". I've selected the top matches based on your criteria, but you can refine your search for more specific results.`
}
