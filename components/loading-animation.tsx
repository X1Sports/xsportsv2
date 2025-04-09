"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"

export function LoadingAnimation() {
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  useEffect(() => {
    // Only show loading on home page
    if (!isHomePage) {
      setIsLoading(false)
      return
    }

    // Set loading state
    setIsLoading(true)

    // Set timeout to hide loading screen after animation completes
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500) // 2.5 seconds for the animation

    return () => {
      clearTimeout(timer)
    }
  }, [isHomePage])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="animate-logo-grow">
        <Image
          src="/images/silver-x-logo.png"
          alt="X Logo"
          width={300}
          height={300}
          className="w-auto h-auto"
          priority
        />
      </div>

      <style jsx global>{`
        @keyframes logo-grow {
          0% {
            transform: scale(0.2);
            opacity: 0;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
          80% {
            transform: scale(20);
            opacity: 0;
          }
          100% {
            transform: scale(30);
            opacity: 0;
          }
        }
        
        .animate-logo-grow {
          animation: logo-grow 2.5s forwards cubic-bezier(0.19, 1, 0.22, 1);
        }
      `}</style>
    </div>
  )
}
