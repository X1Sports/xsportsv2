"use client"

import { motion } from "framer-motion"

export function AnimatedCatchphrase() {
  return (
    <div className="mb-8 text-center">
      <motion.h1
        className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span className="block text-white">Every Athlete Deserves A Shot.</span>
      </motion.h1>
      <motion.p
        className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        X:1 Sports Makes Sure They Get One.
      </motion.p>
      <motion.p
        className="mt-2 text-lg md:text-xl text-blue-400 font-semibold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        Defy The Odds... Be The :1
      </motion.p>
    </div>
  )
}
