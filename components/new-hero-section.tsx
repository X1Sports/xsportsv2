"use client"

import { useState, useEffect } from "react"
import { AnimatedCatchphrase } from "./animated-catchphrase"
import { SearchTrainers } from "./search-trainers"
import { PureVideoPlayer } from "./pure-video-player"
import { IframeVideoFallback } from "./iframe-video-fallback"

export function NewHeroSection() {
  const [useIframeFallback, setUseIframeFallback] = useState(false)

  useEffect(() => {
    // Check if video is playing after a delay
    const checkVideoPlaying = () => {
      const videos = document.querySelectorAll("video")
      let anyVideoPlaying = false

      videos.forEach((video) => {
        if (!video.paused) {
          anyVideoPlaying = true
        }
      })

      // If no videos are playing, use iframe fallback
      if (!anyVideoPlaying) {
        setUseIframeFallback(true)
      }
    }

    // Check after a reasonable delay
    const timeout = setTimeout(checkVideoPlaying, 3000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <section className="relative w-full h-[700px] overflow-hidden">
      {/* Video container with no styling that could interfere */}
      <div className="absolute inset-0 w-full h-full">
        {useIframeFallback ? <IframeVideoFallback /> : <PureVideoPlayer />}
      </div>

      {/* Overlay for text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80 z-10" />

      {/* Content */}
      <div className="container relative z-20 flex flex-col items-center justify-center h-full px-4 mx-auto text-center text-white">
        <AnimatedCatchphrase />

        <div className="w-full max-w-5xl mt-8 relative">
          <SearchTrainers />
        </div>
      </div>
    </section>
  )
}