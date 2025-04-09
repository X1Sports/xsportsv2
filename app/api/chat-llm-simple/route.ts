import OpenAI from "openai"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          error: "OpenAI API key not configured. Please add your API key to the environment variables.",
        },
        { status: 500 },
      )
    }

    // Parse the request body
    const body = await req.json()
    const { message } = body

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("Sending message to OpenAI:", message)

    // Initialize the OpenAI client with the API key
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
          Only answer questions related to sports, athletics, coaching, training, NCAA, and related topics.
          If a question is not related to these topics, politely explain that you can only answer sports-related questions.
          Keep your answers concise (under 150 words), informative, and focused on providing accurate information.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    })

    console.log("Received response from OpenAI")

    // Return the response
    return Response.json({
      response: response.choices[0].message.content,
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
