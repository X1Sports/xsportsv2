import OpenAI from "openai"

// Explicitly set the runtime to nodejs
export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    console.log("API route called: /api/chat-llm")

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured")
      return Response.json(
        {
          error: "OpenAI API key not configured. Please add your API key to the environment variables.",
        },
        { status: 500 },
      )
    }

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

    console.log("Sending message to OpenAI:", message)

    // Initialize the OpenAI client with the API key
    // This is safe because we're in a server component (API route)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Create chat completion without streaming for simplicity
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant specialized in sports, athletics, coaching, and training. 
          Answer questions related to sports, athletics, coaching, training, NCAA, and related topics.
          Keep your answers concise (under 150 words), informative, and focused on providing accurate information.
          If you're unsure about specific statistics or current events, acknowledge the limitations of your knowledge.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    })

    console.log("Received response from OpenAI")

    // Return the response with explicit content type
    return new Response(
      JSON.stringify({
        response: response.choices[0].message.content,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error: any) {
    console.error("Error in chat API:", error)

    // Check for the specific browser environment error
    if (error.message && error.message.includes("browser-like environment")) {
      // Return a specific error message for this case
      return Response.json(
        {
          error: "Server configuration error. Using fallback API.",
          details: "The OpenAI client detected a browser-like environment.",
          fallback: true,
        },
        { status: 500 },
      )
    }

    // Return a more detailed error message
    return new Response(
      JSON.stringify({
        error: "An error occurred during your request.",
        details: error.message || "Unknown error",
        fallback: true,
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
