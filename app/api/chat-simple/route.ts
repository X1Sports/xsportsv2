export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json()
    const { message } = body

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    // Process the message locally instead of using OpenAI
    // This ensures responses are focused on X:1 Sports
    const response = processMessage(message)

    // Return the response
    return Response.json({
      response,
    })
  } catch (error: any) {
    console.error("Error in chat API:", error)

    // Return a more detailed error message
    return Response.json(
      {
        error: "An error occurred during your request.",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}

function processMessage(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Check if user wants to find a trainer
  if (
    lowerMessage.includes("find trainer") ||
    lowerMessage.includes("looking for trainer") ||
    lowerMessage.includes("need a trainer") ||
    lowerMessage.includes("find a coach")
  ) {
    return "I can help you find the perfect trainer. What city or location are you looking for a trainer in?"
  }

  // Check if user wants to find an athlete
  if (
    lowerMessage.includes("find athlete") ||
    lowerMessage.includes("looking for athlete") ||
    lowerMessage.includes("connect with athlete")
  ) {
    return "I'd be happy to help you connect with athletes. What location are you interested in?"
  }

  // Handle location input
  if (
    lowerMessage.includes("new york") ||
    lowerMessage.includes("los angeles") ||
    lowerMessage.includes("chicago") ||
    lowerMessage.includes("miami") ||
    lowerMessage.includes("boston")
  ) {
    return "Great! What sport or activity are you interested in?"
  }

  // Handle sport input
  if (
    lowerMessage.includes("basketball") ||
    lowerMessage.includes("soccer") ||
    lowerMessage.includes("football") ||
    lowerMessage.includes("tennis") ||
    lowerMessage.includes("swimming") ||
    lowerMessage.includes("mma") ||
    lowerMessage.includes("boxing")
  ) {
    return "Excellent choice! What are your specific goals or what are you looking to improve?"
  }

  // Handle general inquiries about X:1 Sports
  if (
    lowerMessage.includes("about x:1") ||
    lowerMessage.includes("what is x:1") ||
    lowerMessage.includes("tell me about x:1")
  ) {
    return "X:1 Sports is a platform that connects athletes with trainers and coaches. We help athletes of all levels find the perfect trainer for their specific needs, and we help trainers connect with athletes looking for their expertise. Our goal is to make sports training more accessible and personalized."
  }

  // Sports-related questions
  if (lowerMessage.includes("basketball technique") || lowerMessage.includes("shooting form")) {
    return "Proper basketball shooting form involves balanced stance, elbow alignment, follow-through, and consistent practice. Our trainers can help you perfect your technique through personalized drills and feedback."
  }

  if (lowerMessage.includes("workout") || lowerMessage.includes("training plan")) {
    return "Effective training plans should include a mix of sport-specific drills, strength training, conditioning, and recovery. Our trainers can create personalized plans based on your goals, sport, and current fitness level."
  }

  if (lowerMessage.includes("injury") || lowerMessage.includes("recover")) {
    return "Recovery from sports injuries typically involves rest, proper rehabilitation exercises, and gradual return to activity. Our trainers work with medical professionals to ensure safe recovery and prevent re-injury."
  }

  // Default response for unrecognized inputs
  return "I'm here to help you with sports-related questions and connect you with trainers. Could you provide more details about what you're looking for? You can ask about specific sports, training techniques, or finding a coach."
}
