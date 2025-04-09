"use client"

import { useEffect, useState, useRef } from "react"

type AnimatedStatCounterProps = {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  title: string
  description?: string
  className?: string
}

export function AnimatedStatCounter({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  title,
  description,
  className = "",
}: AnimatedStatCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)
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

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    let animationFrame: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Use easeOutExpo for a nice deceleration effect
      const easeOutExpo = 1 - Math.pow(2, -10 * progress)

      setCount(Math.floor(easeOutExpo * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      }
    }

    animationFrame = requestAnimationFrame(step)

    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, end, duration])

  return (
    <div ref={counterRef} className={`text-center ${className}`}>
      <div className="text-3xl md:text-4xl font-bold text-white">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <h3 className="text-lg font-semibold mt-2 text-white">{title}</h3>
      {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
    </div>
  )
}
