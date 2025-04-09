"use client"

import { useEffect, useRef } from "react"

export function AnimatedAthleteIcon() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with higher resolution for sharper rendering
    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)

    // Animation variables
    let animationFrame: number
    const startTime = Date.now()
    const centerX = canvas.width / (2 * dpr)
    const centerY = canvas.height / (2 * dpr)
    const radius = Math.min(centerX, centerY) * 0.7

    // Define athlete silhouette points
    const athletePoints = [
      // Head
      { x: 0, y: -0.8 * radius },
      // Shoulders
      { x: -0.4 * radius, y: -0.5 * radius },
      { x: 0.4 * radius, y: -0.5 * radius },
      // Arms raised in victory
      { x: -0.7 * radius, y: -0.9 * radius },
      { x: 0.7 * radius, y: -0.9 * radius },
      // Torso
      { x: -0.3 * radius, y: 0.1 * radius },
      { x: 0.3 * radius, y: 0.1 * radius },
      // Legs
      { x: -0.4 * radius, y: 0.8 * radius },
      { x: 0.4 * radius, y: 0.8 * radius },
    ]

    // Animation function
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = (elapsed % 5000) / 5000 // 5-second loop

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

      // Draw circular background
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = "#000"
      ctx.fill()

      // Draw pulsing ring
      const ringProgress = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * (1 + ringProgress * 0.1), 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 + ringProgress * 0.4})`
      ctx.lineWidth = 3 + ringProgress * 3
      ctx.stroke()

      // Draw X:1 text
      ctx.font = "bold 24px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillStyle = "#fff"
      ctx.fillText("X:1", centerX, centerY - radius * 0.1)

      // Draw "ATHLETE" text
      ctx.font = "bold 14px Arial"
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fillText("ATHLETE", centerX, centerY + radius * 0.2)

      // Draw athlete silhouette
      ctx.beginPath()

      // Draw head
      ctx.arc(centerX, centerY + athletePoints[0].y, radius * 0.15, 0, Math.PI * 2)

      // Draw body (simplified)
      ctx.moveTo(centerX + athletePoints[1].x, centerY + athletePoints[1].y)
      ctx.lineTo(centerX + athletePoints[5].x, centerY + athletePoints[5].y)
      ctx.lineTo(centerX + athletePoints[6].x, centerY + athletePoints[6].y)
      ctx.lineTo(centerX + athletePoints[2].x, centerY + athletePoints[2].y)
      ctx.closePath()

      // Draw arms
      ctx.moveTo(centerX + athletePoints[1].x, centerY + athletePoints[1].y)

      // Left arm with dynamic movement
      const armOffset = Math.sin(progress * Math.PI * 4) * 0.1 * radius
      ctx.lineTo(centerX + athletePoints[3].x, centerY + athletePoints[3].y + armOffset)

      // Right arm with dynamic movement
      ctx.moveTo(centerX + athletePoints[2].x, centerY + athletePoints[2].y)
      ctx.lineTo(centerX + athletePoints[4].x, centerY + athletePoints[4].y + armOffset)

      // Draw legs
      ctx.moveTo(centerX + athletePoints[5].x, centerY + athletePoints[5].y)
      ctx.lineTo(centerX + athletePoints[7].x, centerY + athletePoints[7].y)

      ctx.moveTo(centerX + athletePoints[6].x, centerY + athletePoints[6].y)
      ctx.lineTo(centerX + athletePoints[8].x, centerY + athletePoints[8].y)

      // Style and stroke the silhouette
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)"
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw energy particles around the athlete
      const particleCount = 20
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + progress * Math.PI * 2
        const distance = radius * (0.5 + Math.sin(angle * 3 + progress * Math.PI * 10) * 0.2)
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance
        const size = 2 + Math.sin(angle * 5 + progress * Math.PI * 8) * 2

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + Math.sin(angle + progress * Math.PI * 6) * 0.3})`
        ctx.fill()
      }

      // Continue animation
      animationFrame = requestAnimationFrame(animate)
    }

    // Start animation
    animationFrame = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100px", height: "100px" }} />
}
