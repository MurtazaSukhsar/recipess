'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function SmokeEffect() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Create multiple smoke particles
  const particles = Array.from({ length: 15 })

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex justify-center items-end pb-10">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/20 rounded-full"
          style={{
            width: Math.random() * 60 + 40 + 'px',
            height: Math.random() * 60 + 40 + 'px',
            filter: 'blur(20px)',
            bottom: '-20%',
            left: `${Math.random() * 60 + 20}%`,
          }}
          animate={{
            y: [0, -200 - Math.random() * 200],
            x: [0, (Math.random() - 0.5) * 150],
            scale: [1, Math.random() * 3 + 2],
            opacity: [0, Math.random() * 0.4 + 0.1, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}
