'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Quote, Heart, X, Upload, Loader2 } from 'lucide-react'
import { Story } from '@/lib/stories'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface CommunityStoriesProps {
  stories: Story[];
}

export function CommunityStories({ stories }: CommunityStoriesProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    story: '',
    recipe: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imagePath = ''
      
      if (imageFile) {
        const uploadData = new FormData()
        uploadData.append('file', imageFile)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData })
        if (!uploadRes.ok) throw new Error('Failed to upload image')
        const uploadResult = await uploadRes.json()
        imagePath = uploadResult.imageUrl
      }

      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image: imagePath || '/images/family-cooking.jpg'
        }),
      })

      if (!res.ok) throw new Error('Failed to submit story')

      toast.success('Your story has been submitted and is pending review!')
      setIsModalOpen(false)
      setFormData({ name: '', location: '', story: '', recipe: '' })
      setImageFile(null)
      setImagePreview(null)
    } catch (error) {
      console.error(error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-accent/50 transition-all flex flex-col h-full"
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
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start gap-4 mb-4 flex-1">
                  <Quote className="w-8 h-8 text-accent/50 flex-shrink-0" />
                  <p className="text-foreground/90 italic leading-relaxed">
                    &ldquo;{story.story}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
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

                <Link href={story.href || '#'} className="w-full mt-4 block">
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
          {stories.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No stories available right now. Be the first to share one!
            </div>
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Share Your Family Recipe Story
          </motion.button>
        </motion.div>
      </div>

      {/* Submit Story Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card w-full max-w-2xl rounded-2xl shadow-xl border border-border p-6 sm:p-8 relative my-8"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-2xl font-serif font-bold mb-2">Share Your Story</h3>
            <p className="text-muted-foreground mb-6">Submit your family recipe story. It will be reviewed before appearing on the site.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <input required name="location" placeholder="e.g., Mumbai, India" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Which recipe is this about?</label>
                <input required name="recipe" placeholder="e.g., My Grandmother's Biryani" value={formData.recipe} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Your Story</label>
                <textarea required name="story" rows={4} value={formData.story} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50 resize-none" placeholder="Tell us the memories behind this recipe..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Photo (Optional)</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 overflow-hidden relative">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Click to upload image</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Submit Story
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  )
}
