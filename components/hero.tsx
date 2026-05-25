'use client'

import { motion } from 'framer-motion'
import { Search, Play, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useSearch } from '@/components/search-provider'

export function Hero() {
  const { setIsSearchOpen } = useSearch()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Bohra cuisine spread"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">


          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 text-balance"
          >
            Discover the Art of
            <br />
            <span className="bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 bg-clip-text text-transparent inline-block animate-pulse">Bohra Cuisine</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty"
          >
            Explore authentic Dawoodi Bohra recipes passed down through generations. 
            From festive Eid delicacies to everyday family favorites.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-2xl mx-auto mb-10"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
              <div className="relative flex items-center glass rounded-full overflow-hidden cursor-pointer" onClick={() => setIsSearchOpen(true)}>
                <Search className="absolute left-5 w-5 h-5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search for biryani, kebabs, desserts..."
                  className="w-full py-4 pl-14 pr-32 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none cursor-pointer"
                  readOnly
                />
                <Button className="absolute right-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 pointer-events-none">
                  Search
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              variant="ghost"
              className="rounded-full px-6 text-foreground hover:text-accent"
              asChild
            >
              <a href="#categories">Browse Categories</a>
            </Button>
          </motion.div>

          {/* Popular Searches */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-3"
          >
            <span className="text-sm text-muted-foreground">Popular:</span>
            {[
              { name: 'Biryani', slug: 'mutton-biryani' },
              { name: 'Haleem', slug: 'haleem' },
              { name: 'Sheer Khurma', slug: 'sheer-khurma' },
              { name: 'Samosa', slug: 'crispy-samosa' },
              { name: 'Kebabs', slug: 'seekh-kebab' }
            ].map((tag) => (
              <Link key={tag.slug} href={`/recipes/${tag.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 rounded-full text-sm bg-card/50 hover:bg-card text-foreground border border-border hover:border-accent transition-all cursor-pointer block"
                >
                  {tag.name}
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
