"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

// Update the news articles with reliable image URLs
const newsArticles = [
  {
    id: 1,
    title: "Top College Basketball Prospects to Watch This Season",
    excerpt: "Our scouts break down the most promising young talent in college basketball and their NBA potential.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/maryland-basketball-derik-queen.jpg-Vs3c2ZkXdzB0dqZ5smJG4SlQ10DgBK.jpeg",
    category: "Basketball",
    date: "March 15, 2025",
    featured: true,
  },
  {
    id: 2,
    title: "New Training Techniques Revolutionizing Track & Field",
    excerpt: "How innovative training methods are helping athletes break records and prevent injuries.",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1470&auto=format&fit=crop",
    category: "Track & Field",
    date: "March 12, 2025",
  },
  {
    id: 3,
    title: "College Football Conference Realignment: What It Means for Athletes",
    excerpt: "The latest conference shifts and how they impact recruiting, travel, and competition levels.",
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=1470&auto=format&fit=crop",
    category: "Football",
    date: "March 10, 2025",
  },
  {
    id: 4,
    title: "Mental Health Resources Expanding for Student Athletes",
    excerpt: "Universities are investing more in mental health support for their athletes. Here's what's available.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop",
    category: "Wellness",
    date: "March 8, 2025",
  },
  {
    id: 5,
    title: "Swimming Championships Preview: Stars to Watch",
    excerpt: "The upcoming national championships will showcase these rising stars in collegiate swimming.",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1470&auto=format&fit=crop",
    category: "Swimming",
    date: "March 5, 2025",
  },
  {
    id: 6,
    title: "NIL Deals Changing the Landscape for College Athletes",
    excerpt: "How name, image, and likeness opportunities are creating new revenue streams for student athletes.",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1470&auto=format&fit=crop",
    category: "Business",
    date: "March 3, 2025",
  },
]

export function NewsSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading delay for animation
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Get featured article
  const featuredArticle = newsArticles.find((article) => article.featured)
  // Get remaining articles
  const regularArticles = newsArticles.filter((article) => !article.featured).slice(0, 5)

  return (
    <div className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Latest News & Updates</h2>
            <p className="text-gray-400 mt-2">Stay informed with the latest in sports training and athletics</p>
          </div>
          <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-950">
            View All Articles <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Article - New Layout */}
          {featuredArticle && (
            <div
              className={`lg:col-span-2 transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: "100ms" }}
            >
              <Card className="overflow-hidden border-0 shadow-lg bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Image Section */}
                  <div className="h-64 md:h-full overflow-hidden">
                    <img
                      src={featuredArticle.image || "/placeholder.svg"}
                      alt="Maryland basketball players celebrating"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col">
                    <Badge className="self-start mb-2 bg-blue-600">{featuredArticle.category}</Badge>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{featuredArticle.title}</h3>
                    <p className="text-gray-300 mb-4 flex-grow">{featuredArticle.excerpt}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-gray-400 text-sm">{featuredArticle.date}</span>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Read More
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Regular Articles Grid */}
          <div className="lg:col-span-1 space-y-6">
            {regularArticles.map((article, index) => (
              <div
                key={article.id}
                className={`transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                <Card className="overflow-hidden border-0 shadow-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/3 h-24 sm:h-auto">
                        <img
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="sm:w-2/3 p-4">
                        <Badge className="mb-1 bg-blue-600/80 text-xs">{article.category}</Badge>
                        <h4 className="font-semibold text-white text-sm mb-1 line-clamp-2">{article.title}</h4>
                        <span className="text-gray-400 text-xs">{article.date}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

            <Button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white">Load More Articles</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
