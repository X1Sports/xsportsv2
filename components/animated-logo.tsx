"use client"

import { useEffect, useRef, useState } from "react"

type AnimationEffect = "reveal" | "fade" | "pulse" | "glint" | "particles" | "rotate" | "bounce" | "edgeGlow" | "trace"

type AnimatedLogoProps = {
  variant?: "silver" | "blue" | "red"
  size?: number
  className?: string
  effect?: AnimationEffect
  duration?: number
}

export function AnimatedLogo({
  variant = "silver",
  size = 120,
  className = "",
  effect = "reveal",
  duration = 3000,
}: AnimatedLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const logoImage = useRef<HTMLImageElement | null>(null)

  // Preload the image
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Silver%20X%20White%201-NbEH17hhDYEXjoZeTd6CbZrJvquxQC.png"

    img.onload = () => {
      logoImage.current = img
      setImageLoaded(true)
    }

    img.onerror = () => {
      console.error("Failed to load logo image")
      // Create a fallback canvas with a drawn X
      const fallbackCanvas = document.createElement("canvas")
      fallbackCanvas.width = size
      fallbackCanvas.height = size
      const ctx = fallbackCanvas.getContext("2d")
      if (ctx) {
        // Draw a black background circle
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
        ctx.fillStyle = "#000"
        ctx.fill()

        // Draw a white curved X
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = size / 10
        ctx.lineCap = "round"

        // First stroke (curved)
        ctx.beginPath()
        ctx.moveTo(size * 0.2, size * 0.2)
        ctx.bezierCurveTo(
          size * 0.35,
          size * 0.4, // control point 1
          size * 0.65,
          size * 0.6, // control point 2
          size * 0.8,
          size * 0.8, // end point
        )
        ctx.stroke()

        // Second stroke (curved)
        ctx.beginPath()
        ctx.moveTo(size * 0.8, size * 0.2)
        ctx.bezierCurveTo(
          size * 0.65,
          size * 0.4, // control point 1
          size * 0.35,
          size * 0.6, // control point 2
          size * 0.2,
          size * 0.8, // end point
        )
        ctx.stroke()

        // Create an image from the canvas
        const fallbackImg = new Image()
        fallbackImg.src = fallbackCanvas.toDataURL()
        fallbackImg.onload = () => {
          logoImage.current = fallbackImg
          setImageLoaded(true)
        }
      }
    }

    return () => {
      logoImage.current = null
    }
  }, [size])

  // Animation effect
  useEffect(() => {
    if (!imageLoaded || !canvasRef.current || !logoImage.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with higher resolution for sharper rendering
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    // Animation variables
    let animationFrame: number
    const startTime = Date.now()
    const animationDuration = duration

    // Get color based on variant
    const getColor = (opacity = 1) => {
      switch (variant) {
        case "blue":
          return `rgba(59, 130, 246, ${opacity})`
        case "red":
          return `rgba(239, 68, 68, ${opacity})`
        case "silver":
        default:
          return `rgba(180, 180, 180, ${opacity})`
      }
    }

    // Particle system for particle effect
    const particles: { x: number; y: number; size: number; speed: number; angle: number; opacity: number }[] = []

    if (effect === "particles") {
      // Create particles
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: size / 2,
          y: size / 2,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 0.5,
          angle: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.7 + 0.3,
        })
      }
    }

    // Animation function
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / animationDuration, 1)

      // Clear canvas
      ctx.clearRect(0, 0, size, size)

      // Apply different animation effects
      switch (effect) {
        case "edgeGlow":
          // Draw base logo first
          ctx.drawImage(logoImage.current!, 0, 0, size, size)

          // Add pulsing edge glow effect with increased intensity
          ctx.save()

          // Create a glowing edge effect with increased size and opacity
          const glowSize = 15 + Math.sin(elapsed / 300) * 8
          const glowOpacity = 0.7 + Math.sin(elapsed / 500) * 0.3

          // Draw the logo again with a glow
          ctx.shadowColor =
            variant === "blue"
              ? `rgba(59, 130, 246, ${glowOpacity})`
              : variant === "red"
                ? `rgba(239, 68, 68, ${glowOpacity})`
                : `rgba(220, 220, 220, ${glowOpacity})`
          ctx.shadowBlur = glowSize
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0

          // Draw the logo with glow
          ctx.globalCompositeOperation = "source-over"
          ctx.drawImage(logoImage.current!, 0, 0, size, size)

          // Add extra glow to bottom right of the X
          const bottomRightGlow = Math.sin(elapsed / 700) * 0.5 + 0.5
          ctx.shadowColor =
            variant === "blue"
              ? `rgba(59, 130, 246, ${bottomRightGlow * 1.2})`
              : variant === "red"
                ? `rgba(239, 68, 68, ${bottomRightGlow * 1.2})`
                : `rgba(220, 220, 220, ${bottomRightGlow * 1.2})`
          ctx.shadowBlur = glowSize * 2.5

          // Draw a partial section of the logo to create the bottom-right glow
          ctx.globalAlpha = 0.8
          ctx.drawImage(
            logoImage.current!,
            size / 2,
            size / 2,
            size / 2,
            size / 2, // Source rectangle (bottom right quarter)
            size / 2,
            size / 2,
            size / 2,
            size / 2, // Destination rectangle
          )

          ctx.restore()
          break

        case "trace":
          // Tracing effect that follows the exact curved X shape

          // First draw a faded version of the logo as background
          ctx.globalAlpha = 0.3
          ctx.drawImage(logoImage.current!, 0, 0, size, size)
          ctx.globalAlpha = 1.0

          // Define the curved X shape paths
          const xPaths = [
            // First diagonal (top-left to bottom-right) with curve
            [
              { x: size * 0.2, y: size * 0.2 }, // Start
              { x: size * 0.35, y: size * 0.35 }, // First curve point
              { x: size * 0.5, y: size * 0.5 }, // Center
              { x: size * 0.65, y: size * 0.65 }, // Second curve point
              { x: size * 0.8, y: size * 0.8 }, // End
            ],
            // Second diagonal (top-right to bottom-left) with curve
            [
              { x: size * 0.8, y: size * 0.2 }, // Start
              { x: size * 0.65, y: size * 0.35 }, // First curve point
              { x: size * 0.5, y: size * 0.5 }, // Center
              { x: size * 0.35, y: size * 0.65 }, // Second curve point
              { x: size * 0.2, y: size * 0.8 }, // End
            ],
          ]

          // Calculate which segment to highlight based on time
          const cycleTime = 2000 // ms for a complete cycle
          const cycleProgress = (elapsed % cycleTime) / cycleTime

          // Determine which diagonal and segment to highlight
          const diagonalIndex = cycleProgress < 0.5 ? 0 : 1
          const segmentProgress = (cycleProgress % 0.5) * 2 // 0-1 within the current diagonal

          const currentPath = xPaths[diagonalIndex]

          // Draw the glowing segment
          ctx.save()

          // Set up the glow effect
          ctx.shadowColor =
            variant === "blue"
              ? "rgba(59, 130, 246, 0.8)"
              : variant === "red"
                ? "rgba(239, 68, 68, 0.8)"
                : "rgba(220, 220, 220, 0.8)"
          ctx.shadowBlur = 15

          // Determine which segment of the path to draw based on progress
          const segmentCount = currentPath.length - 1
          const segmentIndex = Math.min(Math.floor(segmentProgress * segmentCount), segmentCount - 1)
          const segmentT = (segmentProgress * segmentCount) % 1

          const startPoint = currentPath[segmentIndex]
          const endPoint = currentPath[segmentIndex + 1]

          // Calculate the current endpoint based on progress within this segment
          const currentEndX = startPoint.x + (endPoint.x - startPoint.x) * segmentT
          const currentEndY = startPoint.y + (endPoint.y - startPoint.y) * segmentT

          // Draw the path segment - use bezier curves for curved style
          ctx.beginPath()

          // For standard style, use straight lines
          ctx.moveTo(startPoint.x, startPoint.y)
          ctx.lineTo(currentEndX, currentEndY)

          // Style the path
          ctx.strokeStyle =
            variant === "blue"
              ? "rgba(59, 130, 246, 1)"
              : variant === "red"
                ? "rgba(239, 68, 68, 1)"
                : "rgba(255, 255, 255, 1)"
          ctx.lineWidth = 8
          ctx.lineCap = "round"
          ctx.stroke()

          // Draw glow points at the joints
          const glowPoint = (x: number, y: number, size: number, opacity: number) => {
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
            gradient.addColorStop(
              0,
              variant === "blue"
                ? `rgba(59, 130, 246, ${opacity})`
                : variant === "red"
                  ? `rgba(239, 68, 68, ${opacity})`
                  : `rgba(255, 255, 255, ${opacity})`,
            )
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(x, y, size, 0, Math.PI * 2)
            ctx.fill()
          }

          // Add glow points at the corners with varying intensity
          // Highlight the current segment's points more intensely
          currentPath.forEach((point, index) => {
            const isActive = index === segmentIndex || index === segmentIndex + 1
            const opacity = isActive ? 0.8 : 0.3
            const pointSize = isActive ? 12 : 6
            glowPoint(point.x, point.y, pointSize, opacity)
          })

          // Add an extra glow at the current position
          glowPoint(currentEndX, currentEndY, 15, 1.0)

          ctx.restore()

          // Draw the full logo with higher opacity to make it visible
          ctx.globalAlpha = 0.7
          ctx.drawImage(logoImage.current!, 0, 0, size, size)
          break

        case "reveal":
          // Horizontal reveal effect
          ctx.save()
          ctx.beginPath()
          ctx.rect(0, 0, size * progress, size)
          ctx.clip()
          ctx.drawImage(logoImage.current!, 0, 0, size, size)

          // Add shine effect
          if (progress > 0.7) {
            const shineProgress = (progress - 0.7) / 0.3
            const gradient = ctx.createLinearGradient(size * (1 - shineProgress), 0, size, size * shineProgress)

            gradient.addColorStop(0, "rgba(255, 255, 255, 0)")
            gradient.addColorStop(0.4, "rgba(255, 255, 255, 0)")
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.3 * Math.sin(shineProgress * Math.PI)})`)
            gradient.addColorStop(0.6, "rgba(255, 255, 255, 0)")
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

            ctx.globalCompositeOperation = "overlay"
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, size, size)
          }
          ctx.restore()
          break

        case "fade":
          // Simple fade in
          ctx.globalAlpha = progress
          ctx.drawImage(logoImage.current!, 0, 0, size, size)
          break

        case "pulse":
          // Pulsing effect
          const scale = 0.5 + progress * 0.5 + (progress === 1 ? Math.sin(elapsed / 300) * 0.05 : 0)
          ctx.save()
          ctx.translate(size / 2, size / 2)
          ctx.scale(scale, scale)
          ctx.translate(-size / 2, -size / 2)
          ctx.drawImage(logoImage.current!, 0, 0, size, size)

          // Add glow effect when fully revealed
          if (progress > 0.9) {
            const glowOpacity = ((progress - 0.9) / 0.1) * 0.3
            ctx.shadowColor = getColor(glowOpacity)
            ctx.shadowBlur = 15
            ctx.drawImage(logoImage.current!, 0, 0, size, size)
          }
          ctx.restore()
          break

        case "glint":
          // Draw base logo
          ctx.drawImage(logoImage.current!, 0, 0, size, size)

          // Add moving glint effect
          const glintPos = (progress * 2) % 1 // Loops twice during animation
          const glintWidth = size * 0.2

          ctx.save()
          const glintGradient = ctx.createLinearGradient(
            size * glintPos - glintWidth,
            0,
            size * glintPos + glintWidth,
            size,
          )

          glintGradient.addColorStop(0, "rgba(255, 255, 255, 0)")
          glintGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.7)")
          glintGradient.addColorStop(1, "rgba(255, 255, 255, 0)")

          ctx.globalCompositeOperation = "overlay"
          ctx.fillStyle = glintGradient
          ctx.fillRect(0, 0, size, size)
          ctx.restore()
          break

        case "particles":
          // Draw base logo
          ctx.drawImage(logoImage.current!, 0, 0, size, size)

          // Update and draw particles
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i]

            // Only start showing particles as the animation progresses
            if (Math.random() < progress * 2) {
              // Update particle position
              p.x += Math.cos(p.angle) * p.speed
              p.y += Math.sin(p.angle) * p.speed

              // Draw particle
              ctx.beginPath()
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
              ctx.fillStyle = getColor(p.opacity * (1 - progress))
              ctx.fill()

              // Reset particles that go off screen
              if (p.x < 0 || p.x > size || p.y < 0 || p.y > size) {
                p.x = size / 2
                p.y = size / 2
                p.angle = Math.random() * Math.PI * 2
              }
            }
          }
          break

        case "rotate":
          // Rotation effect
          const rotationAngle = progress * Math.PI * 2 // Full 360 rotation

          ctx.save()
          ctx.translate(size / 2, size / 2)
          ctx.rotate(rotationAngle)
          ctx.translate(-size / 2, -size / 2)
          ctx.drawImage(logoImage.current!, 0, 0, size, size)
          ctx.restore()
          break

        case "bounce":
          // Bounce in effect
          let yOffset = 0
          if (progress < 0.6) {
            // Bounce down
            yOffset = Math.sin(progress * Math.PI) * 50 * (1 - progress)
          } else if (progress < 0.8) {
            // Small bounce
            yOffset = Math.sin((progress - 0.6) * 5 * Math.PI) * 20 * (0.8 - progress)
          }

          ctx.save()
          ctx.translate(0, yOffset)
          ctx.drawImage(logoImage.current!, 0, 0, size, size)

          // Add shadow
          ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
          ctx.shadowBlur = 10
          ctx.shadowOffsetY = 5
          ctx.restore()
          break

        default:
          // Default just draw the logo
          ctx.drawImage(logoImage.current!, 0, 0, size, size)
      }

      // Continue animation if not complete or if effect needs continuous animation
      if (progress < 1 || ["pulse", "glint", "particles", "edgeGlow", "trace"].includes(effect)) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    // Start animation
    animationFrame = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [imageLoaded, size, variant, effect, duration])

  return (
    <div className={`relative ${className}`} style={{ width: `${size}px`, height: `${size}px` }}>
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          opacity: imageLoaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  )
}
