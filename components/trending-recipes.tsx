'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ChefHat, Heart, Bookmark, Star } from 'lucide-react'

interface TrendingRecipesProps {
  recipes: any[]; // Or use Recipe type if available
}

export function TrendingRecipes({ recipes }: TrendingRecipesProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="recipes" className="py-20 lg:py-32 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              What&apos;s cooking
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mt-2">
              Trending Recipes
            </h2>
          </div>
          <Link href="/recipes">
            <motion.span
              whileHover={{ x: 5 }}
              className="inline-block text-sm font-medium text-primary dark:text-accent hover:underline underline-offset-4"
            >
              View all recipes →
            </motion.span>
          </Link>
        </motion.div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recipes.filter(r => !r.featured).map((recipe, index) => (
              <motion.article
                key={recipe.id}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -8 }}
                className="group flex-shrink-0 w-72 sm:w-80 snap-start"
              >
                <Link href={`/recipes/${recipe.slug}`} className="block relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 288px, 320px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  
                  {/* Save Button */}
                  <div
                    className="absolute top-4 right-4 p-2.5 rounded-full glass hover:bg-accent/20 transition-colors z-10"
                    aria-label="Save recipe"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Bookmark className="w-5 h-5 text-white" />
                  </div>

                  {/* Recipe Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-serif font-semibold text-white mb-2 group-hover:text-accent transition-colors">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center gap-4 text-white/80 text-sm flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-white">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        {recipe.rating || 4.5}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {recipe.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <ChefHat className="w-4 h-4" />
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Engagement */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Heart className="w-4 h-4 text-accent" />
                    <span className="text-sm">{recipe.saves.toLocaleString()} saves</span>
                  </div>
                  <Link
                    href={`/recipes/${recipe.slug}`}
                    className="text-sm font-medium text-primary dark:text-accent hover:underline"
                  >
                    View Recipe
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
