"use client"

import { useEffect } from "react"

export function FixWashingtonState() {
  useEffect(() => {
    const fixWashingtonState = () => {
      // Find all Washington State logo images
      const washingtonStateImages = Array.from(document.querySelectorAll("img")).filter((img) => {
        const src = img.getAttribute("src") || ""
        const alt = img.getAttribute("alt") || ""
        return src.includes("washington-state") || alt.includes("Washington State")
      })

      washingtonStateImages.forEach((img) => {
        // Set the image background to transparent
        if (img instanceof HTMLElement) {
          img.style.setProperty("background-color", "transparent", "important")
        }

        // Find all parent divs and set their background to black
        let currentElement = img.parentElement
        while (currentElement) {
          if (currentElement.tagName === "DIV") {
            if (currentElement instanceof HTMLElement) {
              currentElement.style.setProperty("background-color", "#000000", "important")

              // Also add a class for CSS targeting
              currentElement.classList.add("washington-state-container")
            }
          }
          currentElement = currentElement.parentElement
        }
      })
    }

    // Run immediately
    fixWashingtonState()

    // Run multiple times to catch any dynamic changes
    const timeouts = [100, 500, 1000, 2000, 5000].map((delay) => setTimeout(fixWashingtonState, delay))

    // Also set up an interval for continuous checking
    const intervalId = setInterval(fixWashingtonState, 1000)

    // Clean up
    return () => {
      timeouts.forEach(clearTimeout)
      clearInterval(intervalId)
    }
  }, [])

  return null
}
