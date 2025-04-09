"use client"

import { useEffect } from "react"

export function EnsureVideoPlays() {
  useEffect(() => {
    // Function to ensure videos play
    const ensureVideoPlays = () => {
      const videos = document.querySelectorAll("video")

      videos.forEach((video) => {
        // Make video visible
        video.style.display = "block"
        video.style.visibility = "visible"
        video.style.opacity = "1"

        // Ensure parent containers don't have black backgrounds
        let parent = video.parentElement
        for (let i = 0; i < 5 && parent; i++) {
          if (parent instanceof HTMLElement) {
            parent.style.backgroundColor = "transparent"
          }
          parent = parent.parentElement
        }

        // Try to play if paused
        if (video.paused) {
          video.muted = true // Ensure muted for autoplay
          video.play().catch((e) => {
            console.log("Will retry video play later")
          })
        }
      })
    }

    // Run immediately and frequently
    ensureVideoPlays()
    const timeouts = [
      setTimeout(ensureVideoPlays, 500),
      setTimeout(ensureVideoPlays, 1000),
      setTimeout(ensureVideoPlays, 2000),
      setTimeout(ensureVideoPlays, 3000),
      setTimeout(ensureVideoPlays, 5000),
    ]

    // Run periodically
    const interval = setInterval(ensureVideoPlays, 2000)

    return () => {
      timeouts.forEach(clearTimeout)
      clearInterval(interval)
    }
  }, [])

  return null // This component doesn't render anything
}
