'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { Play, Clock, Eye } from 'lucide-react'

const videoRecipes = [
  {
    id: 1,
    title: 'How to Make Perfect Biryani',
    thumbnail: '/images/biryani.jpg',
    duration: '12:45',
    views: '125K',
  },
  {
    id: 2,
    title: 'Traditional Haleem Recipe',
    thumbnail: '/images/haleem.jpg',
    duration: '18:20',
    views: '89K',
  },
  {
    id: 3,
    title: 'Crispy Samosa from Scratch',
    thumbnail: '/images/samosa.jpg',
    duration: '15:30',
    views: '67K',
  },
  {
    id: 4,
    title: 'Restaurant Style Kebabs',
    thumbnail: '/images/kebab.jpg',
    duration: '10:15',
    views: '98K',
  },
]

export function VideoRecipes() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="py-20 lg:py-32 bg-card/50" ref={ref}>
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
              Watch & Learn
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mt-2">
              Video Recipes
            </h2>
          </div>
          <motion.button
            whileHover={{ x: 5 }}
            className="text-sm font-medium text-primary dark:text-accent hover:underline underline-offset-4"
          >
            View all videos →
          </motion.button>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoRecipes.map((video, index) => (
            <motion.article
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-background/30 group-hover:bg-background/10 transition-colors" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 rounded-full bg-accent/90 flex items-center justify-center shadow-lg"
                  >
                    <Play className="w-6 h-6 text-accent-foreground ml-1" fill="currentColor" />
                  </motion.div>
                </div>

                {/* Duration */}
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground">
                  {video.duration}
                </div>
              </div>

              <h3 className="text-lg font-medium text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors line-clamp-2">
                {video.title}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {video.views} views
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
