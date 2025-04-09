"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, X, Send, Minimize2, Maximize2, AlertCircle, HelpCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

type SuggestionButton = {
  id: string
  text: string
  query: string
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi there! I'm your X:1 Sports assistant. I can help you with sports-related questions. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useFallback, setUseFallback] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showBubble, setShowBubble] = useState(true)

  const suggestionButtons: SuggestionButton[] = [
    { id: "what-is", text: "What is X1 Sports?", query: "What is X1 Sports?" },
    { id: "how-help", text: "How can X1 Sports help me?", query: "How can X1 Sports help me?" },
    { id: "features", text: "What features does X1 offer?", query: "What features does X1 Sports offer?" },
    { id: "get-started", text: "How do I get started?", query: "How do I get started with X1 Sports?" },
  ]

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle suggestion click
  const handleSuggestionClick = (query: string) => {
    handleUserMessage(query)
  }

  // Handle user message submission
  const handleUserMessage = async (messageText: string) => {
    if (!messageText.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      // Try the OpenAI API first, then fall back to the simple API if needed
      let response
      let data

      try {
        // Try the fixed OpenAI API route
        response = await fetch("/api/chat-openai-fixed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: messageText }),
        })

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`)
        }

        data = await response.json()
        setUseFallback(false)
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError)
        setUseFallback(true)

        // Fall back to the simple API
        response = await fetch("/api/chat-simple", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: messageText }),
        })

        if (!response.ok) {
          throw new Error(`Fallback API request failed with status: ${response.status}`)
        }

        data = await response.json()
        setError("Using simplified responses due to API limitations.")
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.response || "I'm not sure how to respond to that.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error("Error processing message:", error)

      // Add error message to the chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your message. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])

      // Set the error state for the alert
      setError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleUserMessage(input)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end">
        {showBubble && (
          <div className="mb-3 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg animate-bounce relative">
            Hey! Got Questions? I Got Answers!
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowBubble(false)
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
              aria-label="Close message"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Chat button */}
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center transition-transform hover:scale-110 relative"
        >
          <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8" />
          <span className="absolute w-full h-full rounded-full bg-blue-500 opacity-70 animate-ping"></span>
        </Button>
      </div>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-4 sm:right-6 w-[calc(100%-2rem)] sm:w-96 md:w-[420px] max-w-[420px] shadow-xl z-50 transition-all duration-300 bg-gray-900 border-gray-700 ${
        isMinimized ? "h-16" : "h-[520px]"
      }`}
    >
      <CardHeader className="p-3 border-b border-gray-800 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon.jpg-QGTgWSMVxQlQkQ2iIshw6PyXl7HnRs.jpeg" />
            <AvatarFallback className="bg-gray-700">X1</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm text-white">X:1 Sports Assistant</h3>
            {!isMinimized && <p className="text-xs text-gray-400">{useFallback ? "Basic Mode" : "AI-Powered Chat"}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => {
              setIsOpen(false)
              setShowBubble(true) // Reset bubble when chat is closed
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="p-3 overflow-y-auto flex-1 h-[300px] bg-gray-900">
            {error && (
              <Alert variant="warning" className="mb-4 bg-gray-800 border-amber-800 text-amber-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-slideIn`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-blue-900 text-white" : "bg-gray-800 text-gray-200"
                    }`}
                  >
                    {message.content}
                    <div className={`text-xs mt-1 ${message.role === "user" ? "text-blue-300" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-slideIn">
                  <div className="max-w-[80%] rounded-lg p-3 bg-gray-800">
                    <div className="flex space-x-2">
                      <div
                        className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Suggestion buttons */}
          <div className="px-3 py-1 bg-gray-900">
            <p className="text-xs text-gray-400 mb-1 flex items-center">
              <HelpCircle className="h-3 w-3 mr-1" />
              Suggested questions:
            </p>
            <div className="flex flex-wrap gap-1.5 mb-1">
              {suggestionButtons.map((button) => (
                <button
                  key={button.id}
                  onClick={() => handleSuggestionClick(button.query)}
                  disabled={isLoading}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full transition-colors"
                >
                  {button.text}
                </button>
              ))}
            </div>
          </div>

          {/* X1 Sports info banner */}
          <div className="px-3 py-1 bg-blue-900/30 border-t border-blue-800/50">
            <p className="text-xs text-blue-200 text-center">
              X1 Sports connects trainers, athletes & coaches for networking, classes & opportunities
            </p>
          </div>

          <CardFooter className="p-3 pt-2 pb-3 border-t border-gray-800 bg-gray-900">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                placeholder="Ask about sports..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
