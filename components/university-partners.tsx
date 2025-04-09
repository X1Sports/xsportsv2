"use client"

import { useState } from "react"
import Image from "next/image"

export function UniversityPartners() {
  const [mounted, setMounted] = useState(false)

  useState(() => {
    setMounted(true)
  }, [])

  const logos = [
    { src: "/images/logos/fsu-logo.png", alt: "Florida State University" },
    { src: "/images/logos/michigan-logo.webp", alt: "Michigan State University" },
    { src: "/images/logos/duke-logo.png", alt: "Duke University" },
    { src: "/images/logos/lsu-logo-black.png", alt: "Louisiana State University" },
    { src: "/images/logos/ohio-state-logo.png", alt: "Ohio State University" },
    { src: "/images/logos/penn-logo.png", alt: "University of Pennsylvania" },
    { src: "/images/logos/virginia-logo.png", alt: "University of Virginia" },
    { src: "/images/logos/washington-state-logo-black.png", alt: "Washington State University" },
    { src: "/images/logos/harvard-logo-black.png", alt: "Harvard University" },
  ]

  if (!mounted) return null

  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold text-center mb-8">Our University Partners</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {logos.map((logo) => (
          <div
            key={logo.alt}
            className="university-logo-container flex items-center justify-center bg-black rounded-full p-2 shadow-sm"
          >
            <Image
              src={logo.src || "/placeholder.svg"}
              alt={logo.alt}
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
