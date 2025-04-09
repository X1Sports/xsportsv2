"use client"

import { FeaturedTrainers } from "@/components/featured-trainers"
import { UpcomingClasses } from "@/components/upcoming-classes"
import { TrainingHighlights } from "@/components/training-highlights"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { AnimatedLogo } from "@/components/animated-logo"
import { NewsSection } from "@/components/news-section"
import { NewHeroSection } from "@/components/new-hero-section"
import { useEffect, useState, useRef } from "react"

export default function Home() {
  const [showDirectVideo, setShowDirectVideo] = useState(false)
  const videoContainerRef = useRef<HTMLDivElement>(null)

  // Add direct DOM manipulation to ensure video plays
  useEffect(() => {
    const ensureVideoPlays = () => {
      const videos = document.querySelectorAll("video")
      let anyVideoPlaying = false

      videos.forEach((video) => {
        // Make video visible
        video.style.display = "block"
        video.style.visibility = "visible"
        video.style.opacity = "1"

        // Try to play if paused
        if (video.paused) {
          video.muted = true
          video.play().catch((e) => console.log("Will retry video play"))
        } else {
          anyVideoPlaying = true
        }
      })

      // If no videos are playing after 5 seconds, show direct video
      if (!anyVideoPlaying && !showDirectVideo) {
        setTimeout(() => {
          setShowDirectVideo(true)
        }, 5000)
      }
    }

    // Run immediately and frequently
    ensureVideoPlays()
    const timeouts = [100, 500, 1000, 2000, 5000].map((delay) => setTimeout(ensureVideoPlays, delay))

    // Run periodically
    const interval = setInterval(ensureVideoPlays, 2000)

    return () => {
      timeouts.forEach(clearTimeout)
      clearInterval(interval)
    }
  }, [showDirectVideo])

  // Fix video container to only show in hero section
  useEffect(() => {
    if (videoContainerRef.current) {
      videoContainerRef.current.style.clipPath = "polygon(0 0, 100% 0, 100% 100vh, 0 100vh)";
    }
  }, [showDirectVideo]);

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      {/* Direct video element as a last resort */}
      {showDirectVideo && (
        <div ref={videoContainerRef} className="fixed inset-0 z-[-1]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100vh, 0 100vh)" }}>
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20%283%29-ZyR55LfxbLszsSvFRTw49yTP96scbq.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
        </div>
      )}

      {/* Use the new hero section */}
      <NewHeroSection />

      <section className="bg-[#1a1a1a] py-16 md:py-24 border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-white">Join X:1 Sports Today</h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-center text-gray-300 max-w-2xl mx-auto text-lg">
              Connect with elite trainers or find dedicated athletes. X:1 Sports brings together the best in sports
              training and athletic talent.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center max-w-4xl mx-auto">
            {/* Athlete Card */}
            <div className="w-full md:w-1/2 hover:shadow-lg transition-shadow bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex items-center justify-center logo-glow-container">
                  <AnimatedLogo variant="blue" size={120} effect="edgeGlow" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">For Athletes</h3>
                <p className="text-gray-300 mb-6">
                  Find the perfect trainer to take your skills to the next level. Get personalized training and reach
                  your athletic goals faster.
                </p>
                <Button size="lg" className="w-full bg-blue-900 hover:bg-blue-800 text-white" asChild>
                  <Link href="/sign-up?role=athlete">Become an Athlete</Link>
                </Button>
              </div>
            </div>

            {/* Trainer Card */}
            <div className="w-full md:w-1/2 hover:shadow-lg transition-shadow bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex items-center justify-center logo-glow-container">
                  <AnimatedLogo variant="red" size={120} effect="edgeGlow" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">For Trainers</h3>
                <p className="text-gray-300 mb-6">
                  Connect with motivated athletes looking for your expertise. Grow your training business and make a
                  bigger impact.
                </p>
                <Button size="lg" className="w-full bg-gray-800 hover:bg-gray-700 text-white" asChild>
                  <Link href="/sign-up?role=trainer">Become a Trainer</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 py-12 mx-auto md:px-6 bg-[#121212]">
        <FeaturedTrainers />
      </section>

      <section className="container px-4 py-12 mx-auto md:px-6 bg-[#1a1a1a]">
        <UpcomingClasses />
      </section>

      <section className="relative py-16 my-12 overflow-hidden bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container relative z-10 px-4 mx-auto md:px-6">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Ready to Elevate Your Performance?</h2>
              <p className="mt-4 text-lg opacity-90">
                Join thousands of athletes who have transformed their skills with our network of expert trainers.
              </p>
              <Button size="lg" className="mt-8 bg-gray-800 text-white hover:bg-gray-700" asChild>
                <Link href="/sign-up">
                  Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
            <div className="flex justify-end">
              <div className="relative w-full max-w-xl mx-auto">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20%28800%20x%20700%20px%29-RpAgx2yyJrRpDHjcGvSJpRzlQTsH58.png"
                  alt="Baseball coaches discussing strategy"
                  className="w-full h-auto transform scale-120 md:scale-130 rotate-3 origin-bottom-right"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 py-12 mx-auto md:px-6 bg-[#121212]">
        <TrainingHighlights />
      </section>

      {/* Add a dark background to cover any gaps */}
      <div className="bg-[#0a0a0a] pt-8 w-full"></div>
      
      {/* News Section - Now as the very last section */}
      <NewsSection />
    </div>
  )
}