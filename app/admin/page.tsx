'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Plus, Trash2, ChevronLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AdminPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    difficulty: 'Easy',
    category: 'curries',
    ingredients: '',
    instructions: '',
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.ingredients || !formData.instructions) {
      toast.error('Please fill in all required text fields')
      return
    }

    setIsSubmitting(true)

    try {
      let imagePath = '/images/curry.jpg' // default fallback

      if (imageFile) {
        const uploadData = new FormData()
        uploadData.append('image', imageFile)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        })

        if (!uploadRes.ok) throw new Error('Failed to upload image')
        const uploadResult = await uploadRes.json()
        imagePath = uploadResult.imageUrl
      } else {
        toast.error('Please upload an image')
        setIsSubmitting(false)
        return
      }

      const recipeData = {
        title: formData.title,
        slug: generateSlug(formData.title),
        description: formData.description,
        time: formData.time,
        difficulty: formData.difficulty as 'Easy' | 'Medium' | 'Hard',
        category: formData.category,
        image: imagePath,
        ingredients: formData.ingredients.split('\n').filter(i => i.trim() !== ''),
        instructions: formData.instructions.split('\n').filter(i => i.trim() !== ''),
      }

      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData),
      })

      if (!res.ok) throw new Error('Failed to save recipe')

      toast.success('Recipe added successfully!')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        time: '',
        difficulty: 'Easy',
        category: 'curries',
        ingredients: '',
        instructions: '',
      })
      setImageFile(null)
      setImagePreview(null)
      
    } catch (error) {
      console.error(error)
      toast.error('An error occurred while saving the recipe')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-serif font-bold text-primary">Admin Dashboard</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 sm:p-8 border border-border/50 shadow-xl"
      >
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-accent" />
          Add New Recipe
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Recipe Image</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors overflow-hidden relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            {imagePreview && (
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                className="mt-2"
                onClick={() => { setImageFile(null); setImagePreview(null); }}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Remove Image
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Authentic Mutton Biryani"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="block text-sm font-medium">Time</label>
                <input
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g., 45 min"
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="A short description of the recipe..."
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="biryani-rice">Biryani & Rice</option>
              <option value="curries">Curries</option>
              <option value="kebabs-tikka">Kebabs & Tikka</option>
              <option value="lentils-dal">Lentils & Dal</option>
              <option value="breads">Breads</option>
              <option value="snacks">Snacks</option>
              <option value="desserts">Desserts</option>
              <option value="drinks">Drinks</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Ingredients (One per line)</label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="1 cup Rice&#10;2 tbsp Oil&#10;Salt to taste"
                rows={8}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none whitespace-pre-wrap"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Instructions (One step per line)</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="Wash the rice.&#10;Boil water.&#10;Cook for 20 minutes."
                rows={8}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none whitespace-pre-wrap"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full sm:w-auto px-8" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Loader2 className="w-4 h-4" /> 
                </motion.div>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Recipe
              </span>
            )}
          </Button>

        </form>
      </motion.div>
    </div>
  )
}
