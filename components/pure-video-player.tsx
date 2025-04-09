"use client"

import { useEffect, useRef } from "react"

export function PureVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Function to play video with retry
    const playVideo = () => {
      console.log("Attempting to play video...")
      video.muted = true // Must be muted for autoplay

      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video playing successfully")
          })
          .catch((error) => {
            console.error("Error playing video:", error)
            // Retry after a delay
            setTimeout(playVideo, 1000)
          })
      }
    }

    // Play video when component mounts
    playVideo()

    // Also try to play when video data is loaded
    video.addEventListener("loadeddata", playVideo)

    // And when canplay event fires
    video.addEventListener("canplay", playVideo)

    return () => {
      video.removeEventListener("loadeddata", playVideo)
      video.removeEventListener("canplay", playVideo)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    >
      <source
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20%283%29-ZyR55LfxbLszsSvFRTw49yTP96scbq.mp4"
        type="video/mp4"
      />
    </video>
  )
}
