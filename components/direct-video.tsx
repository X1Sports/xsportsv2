"use client"

import { useEffect, useRef, useState } from "react"

interface DirectVideoProps {
  src: string
  className?: string
}

export function DirectVideo({ src, className = "" }: DirectVideoProps) {
  const [videoFailed, setVideoFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleError = () => {
      console.error("Video failed to load")
      setVideoFailed(true)
    }

    const handleCanPlay = () => {
      console.log("Video can play")
      video.play().catch((e) => {
        console.error("Play failed:", e)
        setVideoFailed(true)
      })
    }

    video.addEventListener("error", handleError)
    video.addEventListener("canplay", handleCanPlay)

    // Try to play immediately
    video.play().catch((e) => console.log("Initial play failed, waiting for canplay event"))

    return () => {
      video.removeEventListener("error", handleError)
      video.removeEventListener("canplay", handleCanPlay)
    }
  }, [])

  if (videoFailed) {
    // Fallback to a dark background
    return <div className={`absolute inset-0 w-full h-full bg-gradient-to-b from-gray-900 to-black ${className}`} />
  }

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        poster="/abstract-sports-energy.png"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}
