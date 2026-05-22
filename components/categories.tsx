'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Category } from '@/lib/categories'

interface CategoriesProps {
  categories: Category[];
}

export function Categories({ categories }: CategoriesProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="categories" className="py-20 lg:py-32 bg-muted/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent uppercase tracking-wider">
            Explore by type
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mt-2">
            Recipe Categories
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            From aromatic biryanis to delicate desserts, explore our curated collection 
            of authentic Bohra recipes organized by category.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 * index }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative aspect-square rounded-2xl overflow-hidden block"
            >
              <Link href={`/categories/${category.slug}`} className="block w-full h-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                
                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} via-background/40 to-background/70 group-hover:via-background/50 transition-all duration-300`} />
                
                {/* Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-white">
                    {category.name}
                  </h3>
                  <p className="text-white/70 text-sm mt-1">
                    {category.count} recipes
                  </p>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent/50 transition-colors duration-300 pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
