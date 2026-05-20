'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { Sparkles, Calendar, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RamadanBanner() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="ramadan" className="py-20 lg:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/ramadan.jpg"
              alt="Ramadan iftar spread"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative py-16 lg:py-24 px-8 lg:px-16 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-accent uppercase tracking-wider">
                  Special Collection
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6 text-balance">
                Ramadan & Eid
                <br />
                <span className="text-amber-500 animate-pulse">Celebrations</span>
              </h2>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg text-pretty">
                Discover our exclusive collection of traditional recipes perfect for 
                Iftar, Suhoor, and Eid festivities. From hearty Haleem to sweet 
                Sheer Khurma.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 group">
                  Explore Ramadan Recipes
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" className="rounded-full px-8 border-foreground/20 text-foreground hover:bg-foreground/10">
                  <Calendar className="w-4 h-4 mr-2" />
                  Meal Planner
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 grid grid-cols-3 gap-6"
            >
              {[
                { value: '50+', label: 'Iftar Recipes' },
                { value: '30+', label: 'Eid Specials' },
                { value: '20+', label: 'Desserts' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl lg:text-3xl font-serif font-bold text-accent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>


        </motion.div>
      </div>
    </section>
  )
}
