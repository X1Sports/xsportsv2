import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured")
      return new Response(
        JSON.stringify({
          error: "OpenAI API key not configured. Please add your API key to the environment variables.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }

    // Parse the request body
    const { message } = await req.json()

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    console.log("Sending message to OpenAI via AI SDK:", message)

    // Initialize the OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Create chat completion
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant for X:1 Sports, a platform that connects athletes with trainers. 
          Respond in a friendly, helpful manner. Keep responses concise (under 150 words) and focused on helping 
          athletes find trainers, book sessions, or learn about sports training. If asked about specific trainers, 
          suggest they browse the trainer profiles on the platform. If asked about pricing, mention that prices 
          vary by trainer and sport, typically ranging from $50-150 per hour.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      stream: true,
    })

    // Convert the response to a readable stream
    const stream = OpenAIStream(response)

    // Return a streaming response
    return new StreamingTextResponse(stream)
  } catch (error: any) {
    console.error("Error in chat API:", error)

    // Return a more detailed error message
    return new Response(
      JSON.stringify({
        error: "An error occurred during your request.",
        details: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
