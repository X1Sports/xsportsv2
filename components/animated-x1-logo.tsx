"use client"

import { useEffect, useRef } from "react"

type AnimatedX1LogoProps = {
  variant?: "blue" | "red" | "white"
  size?: number
  animationSpeed?: number // Add this new property
}

export function AnimatedX1Logo({ variant = "blue", size = 100, animationSpeed = 1 }: AnimatedX1LogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

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
    const centerX = size / 2
    const centerY = size / 2
    const radius = Math.min(centerX, centerY) * 0.8

    // Color based on variant
    const getColor = (opacity = 1) => {
      switch (variant) {
        case "blue":
          return `rgba(59, 130, 246, ${opacity})`
        case "red":
          return `rgba(239, 68, 68, ${opacity})`
        case "white":
        default:
          return `rgba(255, 255, 255, ${opacity})`
      }
    }

    // Animation function
    const animate = () => {
      const elapsed = Date.now() - startTime
      // Adjust progress based on animation speed
      const progress = ((elapsed * animationSpeed) % 3000) / 3000 // 3-second loop

      // Clear canvas
      ctx.clearRect(0, 0, size, size)

      // Draw circular background
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = "#000"
      ctx.fill()

      // Draw X
      const xSize = radius * 0.7
      const strokeWidth = radius * 0.12
      const xProgress = Math.min(progress * 2, 1) // First half of animation

      // First stroke of X (top-left to bottom-right)
      if (xProgress > 0) {
        ctx.beginPath()
        ctx.moveTo(centerX - xSize, centerY - xSize)

        // Calculate end point based on progress
        const endX1 = centerX - xSize + xSize * 2 * xProgress
        const endY1 = centerY - xSize + xSize * 2 * xProgress

        ctx.lineTo(endX1, endY1)
        ctx.lineCap = "round"
        ctx.lineWidth = strokeWidth

        // Create gradient for stroke
        const gradient1 = ctx.createLinearGradient(centerX - xSize, centerY - xSize, centerX + xSize, centerY + xSize)
        gradient1.addColorStop(0, getColor(0.7))
        gradient1.addColorStop(0.5, getColor(1))
        gradient1.addColorStop(1, getColor(0.7))

        ctx.strokeStyle = gradient1
        ctx.stroke()
      }

      // Second stroke of X (top-right to bottom-left)
      const secondStrokeProgress = progress > 0.5 ? (progress - 0.5) * 2 : 0 // Second half of animation

      if (secondStrokeProgress > 0) {
        ctx.beginPath()
        ctx.moveTo(centerX + xSize, centerY - xSize)

        // Calculate end point based on progress
        const endX2 = centerX + xSize - xSize * 2 * secondStrokeProgress
        const endY2 = centerY - xSize + xSize * 2 * secondStrokeProgress

        ctx.lineTo(endX2, endY2)
        ctx.lineCap = "round"
        ctx.lineWidth = strokeWidth

        // Create gradient for stroke
        const gradient2 = ctx.createLinearGradient(centerX + xSize, centerY - xSize, centerX - xSize, centerY + xSize)
        gradient2.addColorStop(0, getColor(0.7))
        gradient2.addColorStop(0.5, getColor(1))
        gradient2.addColorStop(1, getColor(0.7))

        ctx.strokeStyle = gradient2
        ctx.stroke()
      }

      // Draw "1" after X is complete
      if (progress > 0.9) {
        const oneOpacity = (progress - 0.9) * 10 // Fade in during last 10% of animation

        ctx.font = `bold ${radius * 0.6}px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = getColor(oneOpacity)
        ctx.fillText("1", centerX + radius * 0.4, centerY)
      }

      // Draw pulsing ring
      const ringProgress = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * (1 + ringProgress * 0.05), 0, Math.PI * 2)
      ctx.strokeStyle = getColor(0.2 + ringProgress * 0.2)
      ctx.lineWidth = 2
      ctx.stroke()

      // Continue animation
      animationFrame = requestAnimationFrame(animate)
    }

    // Start animation
    animationFrame = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [variant, size, animationSpeed])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ width: `${size}px`, height: `${size}px` }} />
}
