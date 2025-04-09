"use client"

import { useEffect, useRef } from "react"

interface VideoBackgroundProps {
  src: string
  fallbackImage?: string
}

export function VideoBackground({ src, fallbackImage }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Try to play the video
    const playPromise = video.play()

    // Handle autoplay restrictions
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error("Video autoplay failed:", error)
        // If autoplay fails, we could show a fallback image or a play button
      })
    }

    // Add event listeners
    const handleCanPlay = () => {
      video.play().catch((e) => console.error("Play failed after canplay:", e))
    }

    video.addEventListener("canplay", handleCanPlay)

    return () => {
      video.removeEventListener("canplay", handleCanPlay)
    }
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full bg-black">
      {fallbackImage && (
        <img
          src={fallbackImage || "/placeholder.svg"}
          alt="Background"
          className="object-cover w-full h-full absolute inset-0"
          style={{ opacity: videoRef.current?.readyState >= 3 ? 0 : 1 }}
        />
      )}
      <video ref={videoRef} className="object-cover w-full h-full" muted loop playsInline preload="auto">
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}
