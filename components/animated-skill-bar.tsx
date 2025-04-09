"use client"

import { useEffect, useState, useRef } from "react"
import { Progress } from "@/components/ui/progress"

type AnimatedSkillBarProps = {
  skill: string
  value: number
  maxValue?: number
  color?: string
  className?: string
}

export function AnimatedSkillBar({
  skill,
  value,
  maxValue = 100,
  color = "bg-blue-600",
  className = "",
}: AnimatedSkillBarProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const skillRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          setIsVisible(true)
          hasAnimated.current = true
        }
      },
      { threshold: 0.1 },
    )

    if (skillRef.current) {
      observer.observe(skillRef.current)
    }

    return () => {
      if (skillRef.current) {
        observer.unobserve(skillRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const percentage = (value / maxValue) * 100
    let startTime: number | null = null
    let animationFrame: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / 1500, 1)

      // Use easeOutQuart for a nice deceleration effect
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      setProgress(easeOutQuart * percentage)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      }
    }

    animationFrame = requestAnimationFrame(step)

    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, value, maxValue])

  return (
    <div ref={skillRef} className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="font-medium text-white">{skill}</span>
        <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2 bg-gray-700" indicatorClassName={color} />
    </div>
  )
}
