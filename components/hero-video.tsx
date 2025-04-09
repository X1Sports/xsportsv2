"use client"

import { useEffect, useRef } from "react"

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Function to attempt playing the video
    const attemptPlay = () => {
      video.play().catch((error) => {
        console.error("Video play failed:", error)
        // Try again after a short delay
        setTimeout(attemptPlay, 1000)
      })
    }

    // Try to play as soon as possible
    video.muted = true // Ensure muted for autoplay
    attemptPlay()

    // Also try to play when the video can actually play
    video.addEventListener("canplay", attemptPlay)

    return () => {
      video.removeEventListener("canplay", attemptPlay)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover z-0"
      autoPlay
      muted
      loop
      playsInline
      controls={false}
    >
      <source
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20%283%29-154N7xu2bD5wdNCsqeC5N7IyCowXed.mp4"
        type="video/mp4"
      />
    </video>
  )
}
