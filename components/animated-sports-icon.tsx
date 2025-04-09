"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"

type SportIconProps = {
  icon: React.ReactNode
  name: string
  color: string
  onClick?: () => void
  isActive?: boolean
}

export function AnimatedSportsIcon({ icon, name, color, onClick, isActive = false }: SportIconProps) {
  const controls = useAnimation()
  const [isHovered, setIsHovered] = useState(false)
  const iconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive) {
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.5 },
      })
    }
  }, [isActive, controls])

  return (
    <motion.div
      ref={iconRef}
      className="flex flex-col items-center gap-2 cursor-pointer"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={controls}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`w-16 h-16 rounded-full flex items-center justify-center ${isActive ? "bg-opacity-100" : "bg-opacity-80"}`}
        style={{ backgroundColor: color }}
        animate={{
          boxShadow: isHovered || isActive ? `0 0 20px ${color}80` : `0 0 0px transparent`,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{
            rotate: isHovered ? [0, 10, -10, 0] : 0,
            scale: isActive ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
            repeatDelay: 1,
          }}
        >
          {icon}
        </motion.div>
      </motion.div>
      <p className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-300"}`}>{name}</p>
    </motion.div>
  )
}
