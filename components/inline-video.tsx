"use client"

import { useEffect, useRef } from "react"

export function InlineVideo() {
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
    attemptPlay()

    // Also try to play when the video can actually play
    video.addEventListener("canplay", attemptPlay)

    // Make sure video is visible
    video.style.display = "block"
    video.style.visibility = "visible"
    video.style.opacity = "1"
    video.style.zIndex = "1"

    return () => {
      video.removeEventListener("canplay", attemptPlay)
    }
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
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
    </div>
  )
}
