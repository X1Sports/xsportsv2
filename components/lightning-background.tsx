"use client"

import { useEffect, useRef } from "react"

export function LightningBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Lightning bolt parameters
    const bolts: any[] = []
    const maxBolts = 10

    // Create a new lightning bolt
    const createLightningBolt = () => {
      const startX = Math.random() * canvas.width
      const startY = 0
      const endX = Math.random() * canvas.width
      const endY = canvas.height
      const segments = 10 + Math.floor(Math.random() * 5)
      const width = 1 + Math.random() * 3
      const color = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.4})`
      const lifespan = 40 + Math.random() * 60
      const age = 0

      bolts.push({
        startX,
        startY,
        endX,
        endY,
        segments,
        width,
        color,
        lifespan,
        age,
        points: [],
      })
    }

    // Generate points for a lightning bolt
    const generatePoints = (bolt: any) => {
      bolt.points = []
      bolt.points.push({ x: bolt.startX, y: bolt.startY })

      const segmentHeight = (bolt.endY - bolt.startY) / bolt.segments

      for (let i = 1; i < bolt.segments; i++) {
        const y = bolt.startY + segmentHeight * i
        const deviation = 100 * (1 - i / bolt.segments) * Math.random()
        const direction = Math.random() > 0.5 ? 1 : -1
        const x = bolt.startX + (bolt.endX - bolt.startX) * (i / bolt.segments) + deviation * direction

        bolt.points.push({ x, y })
      }

      bolt.points.push({ x: bolt.endX, y: bolt.endY })
    }

    // Draw a lightning bolt
    const drawLightningBolt = (bolt: any) => {
      if (bolt.points.length === 0) {
        generatePoints(bolt)
      }

      const alpha = 1 - bolt.age / bolt.lifespan
      const boltColor = bolt.color.replace(/[\d.]+\)$/, `${alpha})`)

      ctx.beginPath()
      ctx.strokeStyle = boltColor
      ctx.lineWidth = bolt.width
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.moveTo(bolt.points[0].x, bolt.points[0].y)

      for (let i = 1; i < bolt.points.length; i++) {
        ctx.lineTo(bolt.points[i].x, bolt.points[i].y)
      }

      ctx.stroke()

      // Add glow effect
      ctx.shadowColor = "white"
      ctx.shadowBlur = 20 * alpha
      ctx.stroke()
      ctx.shadowBlur = 0

      bolt.age++
    }

    // Animation loop
    const animate = () => {
      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Randomly create new bolts
      if (bolts.length < maxBolts && Math.random() < 0.03) {
        createLightningBolt()
      }

      // Draw and update bolts
      for (let i = bolts.length - 1; i >= 0; i--) {
        drawLightningBolt(bolts[i])

        // Remove old bolts
        if (bolts[i].age >= bolts[i].lifespan) {
          bolts.splice(i, 1)
        }
      }

      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-black z-0" />
}
