'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, ChefHat, Bookmark } from 'lucide-react'
import { recipes } from '@/lib/recipes'

export function FeaturedDishes() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const featuredDishes = recipes.filter(r => r.featured)

  return (
    <section className="py-20 lg:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent uppercase tracking-wider">
            Editor&apos;s Choice
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mt-2">
            Featured Bohra Dishes
          </h2>
        </motion.div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Large Featured Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative rounded-3xl overflow-hidden block h-full w-full"
          >
            <Link href={`/recipes/${featuredDishes[0]?.slug || ''}`} className="block h-full w-full">
              <div className="aspect-[4/5] lg:aspect-auto lg:h-full w-full h-full">
                <Image
                  src={featuredDishes[0]?.image || ''}
                  alt={featuredDishes[0]?.title || ''}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              
              {/* Featured Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                  Featured
                </span>
              </div>

              {/* Save Button */}
              <div
                className="absolute top-6 right-6 p-3 rounded-full glass hover:bg-white/20 transition-colors z-10 cursor-pointer"
                aria-label="Save recipe"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <Bookmark className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="text-accent font-medium">{featuredDishes[0]?.rating}</span>
                </div>
                <h3 className="text-3xl font-serif font-bold text-white mb-2 group-hover:text-accent transition-colors">
                  {featuredDishes[0]?.title}
                </h3>
                <p className="text-white/80 mb-4 max-w-md line-clamp-2">
                  {featuredDishes[0]?.description}
                </p>
                <div className="flex items-center gap-6 text-white/70 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredDishes[0]?.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <ChefHat className="w-4 h-4" />
                    {featuredDishes[0]?.difficulty}
                  </span>
                  <span>by {featuredDishes[0]?.chef}</span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Smaller Cards */}
          <div className="grid gap-6">
            {featuredDishes.slice(1).map((dish, index) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + 0.1 * index }}
                whileHover={{ x: 6 }}
                className="group flex gap-6 p-4 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all cursor-pointer block"
              >
                <Link href={`/recipes/${dish.slug}`} className="block w-full">
                  <div className="flex gap-6 w-full">
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 rounded-xl overflow-hidden">
                      <Image
                        src={dish.image}
                        alt={dish.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="160px"
                      />
                    </div>
                    <div className="flex flex-col justify-center py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-sm text-accent font-medium">{dish.rating}</span>
                      </div>
                      <h3 className="text-xl font-serif font-semibold text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors">
                        {dish.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {dish.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {dish.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <ChefHat className="w-3 h-3" />
                          {dish.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
