"use client"

import { useEffect, useRef } from "react"

export function AnimatedTrainerIcon() {
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

    // Define trainer silhouette points
    const trainerPoints = [
      // Head
      { x: 0, y: -0.8 * radius },
      // Shoulders
      { x: -0.4 * radius, y: -0.5 * radius },
      { x: 0.4 * radius, y: -0.5 * radius },
      // Arms
      { x: -0.6 * radius, y: -0.2 * radius }, // Left arm pointing
      { x: 0.6 * radius, y: 0 * radius }, // Right arm with clipboard
      // Torso
      { x: -0.3 * radius, y: 0.1 * radius },
      { x: 0.3 * radius, y: 0.1 * radius },
      // Legs
      { x: -0.25 * radius, y: 0.8 * radius },
      { x: 0.25 * radius, y: 0.8 * radius },
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

      // Draw rotating ring
      const ringRotation = progress * Math.PI * 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 1.05, ringRotation, ringRotation + Math.PI * 1.5)
      ctx.strokeStyle = "rgba(220, 38, 38, 0.7)"
      ctx.lineWidth = 4
      ctx.stroke()

      // Draw X:1 text
      ctx.font = "bold 24px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillStyle = "#fff"
      ctx.fillText("X:1", centerX, centerY - radius * 0.1)

      // Draw "TRAINER" text
      ctx.font = "bold 14px Arial"
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fillText("TRAINER", centerX, centerY + radius * 0.2)

      // Draw trainer silhouette
      ctx.beginPath()

      // Draw head
      ctx.arc(centerX, centerY + trainerPoints[0].y, radius * 0.15, 0, Math.PI * 2)

      // Draw body (simplified)
      ctx.moveTo(centerX + trainerPoints[1].x, centerY + trainerPoints[1].y)
      ctx.lineTo(centerX + trainerPoints[5].x, centerY + trainerPoints[5].y)
      ctx.lineTo(centerX + trainerPoints[6].x, centerY + trainerPoints[6].y)
      ctx.lineTo(centerX + trainerPoints[2].x, centerY + trainerPoints[2].y)
      ctx.closePath()

      // Draw arms
      ctx.moveTo(centerX + trainerPoints[1].x, centerY + trainerPoints[1].y)

      // Left arm with pointing motion
      const pointingOffset = Math.sin(progress * Math.PI * 2) * 0.05 * radius
      ctx.lineTo(centerX + trainerPoints[3].x - pointingOffset, centerY + trainerPoints[3].y)

      // Right arm holding clipboard
      ctx.moveTo(centerX + trainerPoints[2].x, centerY + trainerPoints[2].y)
      ctx.lineTo(centerX + trainerPoints[4].x, centerY + trainerPoints[4].y)

      // Draw legs
      ctx.moveTo(centerX + trainerPoints[5].x, centerY + trainerPoints[5].y)
      ctx.lineTo(centerX + trainerPoints[7].x, centerY + trainerPoints[7].y)

      ctx.moveTo(centerX + trainerPoints[6].x, centerY + trainerPoints[6].y)
      ctx.lineTo(centerX + trainerPoints[8].x, centerY + trainerPoints[8].y)

      // Style and stroke the silhouette
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)"
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw clipboard in hand
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fillRect(
        centerX + trainerPoints[4].x - radius * 0.15,
        centerY + trainerPoints[4].y - radius * 0.1,
        radius * 0.3,
        radius * 0.4,
      )

      // Draw lines on clipboard
      ctx.beginPath()
      for (let i = 0; i < 3; i++) {
        const lineY = centerY + trainerPoints[4].y - radius * 0.05 + i * radius * 0.1
        ctx.moveTo(centerX + trainerPoints[4].x - radius * 0.12, lineY)
        ctx.lineTo(centerX + trainerPoints[4].x + radius * 0.12, lineY)
      }
      ctx.strokeStyle = "rgba(0, 0, 0, 0.7)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw instructional lines/arrows
      const arrowCount = 5
      for (let i = 0; i < arrowCount; i++) {
        const arrowAngle = Math.PI * 0.7 + (i / arrowCount) * Math.PI * 0.6
        const arrowStart = (progress * 2) % 1
        const arrowLength = 0.2 + (i / arrowCount) * 0.3

        if (arrowStart < arrowLength) {
          const startX = centerX + trainerPoints[3].x - pointingOffset
          const startY = centerY + trainerPoints[3].y
          const endX = startX - Math.cos(arrowAngle) * radius * arrowLength
          const endY = startY - Math.sin(arrowAngle) * radius * arrowLength

          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.lineTo(endX, endY)
          ctx.strokeStyle = `rgba(220, 38, 38, ${0.8 - (arrowStart / arrowLength) * 0.8})`
          ctx.lineWidth = 2
          ctx.stroke()

          // Arrow head
          ctx.beginPath()
          ctx.arc(endX, endY, 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(220, 38, 38, ${0.8 - (arrowStart / arrowLength) * 0.8})`
          ctx.fill()
        }
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
