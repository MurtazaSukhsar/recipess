'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Quote, Heart } from 'lucide-react'

const stories = [
  {
    id: 1,
    name: 'Sakina Bai',
    location: 'Mumbai, India',
    image: '/images/family-cooking.jpg',
    story: 'My grandmother taught me to make biryani when I was just eight years old. Every grain of rice holds a memory of our family gatherings during Eid.',
    recipe: 'Family Biryani Recipe',
    href: '/recipes/mutton-biryani',
    likes: 234,
  },
  {
    id: 2,
    name: 'Fatima Ben',
    location: 'Dubai, UAE',
    image: '/images/haleem-new.png',
    story: 'Haleem is more than food in our family — it is the taste of Ramadan, of waiting for maghrib, of breaking fast together.',
    recipe: 'Traditional Haleem',
    href: '/recipes/haleem',
    likes: 189,
  },
  {
    id: 3,
    name: 'Zahra Auntie',
    location: 'Karachi, Pakistan',
    image: '/images/sheer-khurma.jpg',
    story: 'Every Eid morning, my kitchen fills with the sweet aroma of sheer khurma. It is my way of keeping my mother\'s traditions alive.',
    recipe: 'Eid Sheer Khurma',
    href: '/recipes/sheer-khurma',
    likes: 312,
  },
]

export function CommunityStories() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="stories" className="py-20 lg:py-32 bg-muted/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent uppercase tracking-wider">
            From our community
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mt-2">
            Family Recipe Stories
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Every recipe has a story. Discover the heartwarming tales behind 
            our community&apos;s most treasured family recipes.
          </p>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.article
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -6 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-accent/50 transition-all"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={story.image}
                  alt={story.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Quote className="w-8 h-8 text-accent/50 flex-shrink-0" />
                  <p className="text-foreground/90 italic leading-relaxed">
                    &ldquo;{story.story}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <h4 className="font-medium text-foreground">{story.name}</h4>
                    <p className="text-sm text-muted-foreground">{story.location}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    {story.likes}
                  </motion.button>
                </div>

                <Link href={story.href} className="w-full mt-4 block">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full py-3 rounded-xl bg-muted hover:bg-accent/10 text-sm font-medium text-foreground transition-colors"
                  >
                    View {story.recipe} →
                  </motion.button>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Share Your Family Recipe Story
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
