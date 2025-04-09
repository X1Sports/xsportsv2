"use client"

import { useEffect, useRef } from "react"

export function DebugVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Log to help debug
    console.log("DebugVideoBackground mounted")

    const video = videoRef.current
    if (!video) {
      console.error("Video element not found")
      return
    }

    console.log("Video element found:", video)
    console.log("Video source:", video.src)

    // Force video to be visible
    video.style.display = "block"
    video.style.visibility = "visible"
    video.style.opacity = "1"

    // Try to play the video
    const playPromise = video.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Video playback started successfully")
        })
        .catch((error) => {
          console.error("Error playing video:", error)

          // Try again with a delay
          setTimeout(() => {
            console.log("Trying to play video again after delay")
            video.play().catch((e) => console.error("Second play attempt failed:", e))
          }, 1000)
        })
    }

    // Check video status periodically
    const interval = setInterval(() => {
      if (video) {
        console.log("Video status check:", {
          paused: video.paused,
          ended: video.ended,
          readyState: video.readyState,
          networkState: video.networkState,
          error: video.error,
          currentSrc: video.currentSrc,
          style: {
            display: window.getComputedStyle(video).display,
            visibility: window.getComputedStyle(video).visibility,
            opacity: window.getComputedStyle(video).opacity,
            zIndex: window.getComputedStyle(video).zIndex,
          },
        })
      }
    }, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden bg-black" style={{ zIndex: 1 }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          display: "block",
          visibility: "visible",
          opacity: 1,
          zIndex: 2,
        }}
      >
        <source src="/videos/hero-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
