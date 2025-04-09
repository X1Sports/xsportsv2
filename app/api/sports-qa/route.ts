import OpenAI from "openai"

// Explicitly set the runtime to nodejs
export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    // Parse the request body with better error handling
    let body
    try {
      body = await req.json()
    } catch (error) {
      console.error("Error parsing request body:", error)
      return Response.json(
        {
          error: "Invalid request body. Expected JSON.",
        },
        { status: 400 },
      )
    }

    // Validate that query exists and is a string
    if (!body || typeof body !== "object") {
      return Response.json(
        {
          error: "Invalid request body. Expected an object.",
        },
        { status: 400 },
      )
    }

    const query = body.query

    // Explicitly check if query is a string and not empty
    if (typeof query !== "string" || query.trim() === "") {
      return Response.json(
        {
          error: "Query is required and must be a non-empty string",
        },
        { status: 400 },
      )
    }

    console.log("Processing sports Q&A query:", query)

    try {
      // Check if API key is available
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API key not configured")
      }

      // Initialize the OpenAI client inside the request handler
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true, // Add this flag to address the error
      })

      // Use OpenAI to answer the sports-related question
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant specialized in sports, athletics, coaching, and training. 
            Only answer questions related to sports, athletics, coaching, training, NCAA, and related topics.
            If a question is not related to these topics, politely explain that you can only answer sports-related questions.
            Keep your answers concise (under 150 words), informative, and focused on providing accurate information.
            If you're unsure about specific statistics or current events, acknowledge the limitations of your knowledge.`,
          },
          {
            role: "user",
            content: query,
          },
        ],
        temperature: 0.7,
        max_tokens: 250,
      })

      // Return the answer
      return Response.json({
        answer: response.choices[0].message.content,
      })
    } catch (openaiError: any) {
      console.error("OpenAI API error:", openaiError)

      // Return a fallback response
      return Response.json(
        {
          answer:
            "I'm having trouble connecting to my knowledge base right now. Let me try a simpler response: Sports and athletics involve physical exertion and skill where individuals or teams compete. Training typically includes conditioning, skill development, and strategy. If you have a more specific question about a particular sport or training method, please ask again and I'll do my best to help.",
          error: openaiError.message || "Unknown OpenAI error",
        },
        { status: 200 }, // Return 200 with fallback answer instead of error
      )
    }
  } catch (error: any) {
    console.error("Error in sports Q&A API:", error)

    return Response.json(
      {
        answer:
          "I'm sorry, I couldn't process your question. Please try asking in a different way or ask another sports-related question.",
        error: error.message || "Unknown error",
      },
      { status: 200 }, // Return 200 with fallback answer instead of error
    )
  }
}
