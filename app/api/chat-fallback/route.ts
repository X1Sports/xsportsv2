export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    console.log("Fallback API route called")

    // Parse the request body
    let body
    try {
      body = await req.json()
    } catch (error) {
      console.error("Error parsing request body:", error)
      return Response.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { message } = body

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    // Generate a simple response based on the message
    const response = generateSimpleResponse(message)

    // Return the response with explicit content type
    return new Response(
      JSON.stringify({
        response: response,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error: any) {
    console.error("Error in fallback API:", error)

    // Return a more detailed error message
    return new Response(
      JSON.stringify({
        error: "An error occurred during your request.",
        details: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

function generateSimpleResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Sports-related responses
  if (lowerMessage.includes("basketball")) {
    return "Basketball is a team sport where two teams of five players each try to score by shooting a ball through a hoop. It requires skills like dribbling, passing, shooting, and teamwork."
  }

  if (lowerMessage.includes("soccer") || lowerMessage.includes("football")) {
    return "Soccer (or football) is the world's most popular sport, played between two teams of eleven players with a spherical ball. The objective is to score by getting the ball into the opposing goal."
  }

  if (lowerMessage.includes("training") || lowerMessage.includes("workout")) {
    return "Effective training combines sport-specific skills, strength conditioning, proper nutrition, and adequate recovery. The best approach depends on your specific goals and current fitness level."
  }

  if (lowerMessage.includes("coach") || lowerMessage.includes("trainer")) {
    return "A good coach or trainer should have expertise in your sport, strong communication skills, and the ability to create personalized training plans. They should also provide constructive feedback and motivation."
  }

  if (lowerMessage.includes("ncaa") || lowerMessage.includes("college")) {
    return "The NCAA (National Collegiate Athletic Association) governs student-athletes across three divisions in the United States. They establish eligibility rules, competition standards, and provide opportunities for college athletes to compete while pursuing their education."
  }

  if (lowerMessage.includes("injury") || lowerMessage.includes("recover")) {
    return "Recovery from sports injuries typically involves rest, proper rehabilitation exercises, and gradual return to activity. Always consult with a healthcare professional for personalized advice on injury recovery."
  }

  // Default response
  return "I'm a sports assistant that can answer questions about various sports, training techniques, coaching, and athletic development. Feel free to ask me anything sports-related!"
}
