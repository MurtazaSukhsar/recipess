'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Plus, Trash2, Save, Loader2, Edit, ListTree, ChefHat, BookOpen, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Recipe } from '@/lib/recipes'
import { Category } from '@/lib/categories'
import { Story } from '@/lib/stories'

interface AdminDashboardProps {
  initialRecipes: Recipe[]
  initialCategories: Category[]
  initialStories?: Story[]
}

export function AdminDashboard({ initialRecipes, initialCategories, initialStories = [] }: AdminDashboardProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [stories, setStories] = useState<Story[]>(initialStories)
  const [activeTab, setActiveTab] = useState<'recipes' | 'recipe-form' | 'categories' | 'category-form' | 'stories'>('recipes')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Recipe Form State
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null)
  const [recipeImageFile, setRecipeImageFile] = useState<File | null>(null)
  const [recipeImagePreview, setRecipeImagePreview] = useState<string | null>(null)
  
  const [recipeFormData, setRecipeFormData] = useState({
    title: '',
    description: '',
    time: '',
    difficulty: 'Easy',
    category: categories.length > 0 ? categories[0].slug : '',
    ingredients: '',
    instructions: '',
  })

  // Category Form State
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null)
  const [categoryImagePreview, setCategoryImagePreview] = useState<string | null>(null)
  
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    color: 'from-amber-500/20',
  })

  // === RECIPE HANDLERS ===
  const resetRecipeForm = () => {
    setEditingRecipeId(null)
    setRecipeFormData({
      title: '',
      description: '',
      time: '',
      difficulty: 'Easy',
      category: categories.length > 0 ? categories[0].slug : '',
      ingredients: '',
      instructions: '',
    })
    setRecipeImageFile(null)
    setRecipeImagePreview(null)
  }

  const handleEditRecipeClick = (recipe: Recipe) => {
    setEditingRecipeId(recipe.id)
    setRecipeFormData({
      title: recipe.title,
      description: recipe.description,
      time: recipe.time,
      difficulty: recipe.difficulty,
      category: recipe.category,
      ingredients: recipe.ingredients.join('\n'),
      instructions: recipe.instructions.join('\n'),
    })
    setRecipeImagePreview(recipe.image)
    setActiveTab('recipe-form')
  }

  const handleDeleteRecipeClick = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return
    try {
      const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setRecipes(recipes.filter(r => r.id !== id))
      toast.success('Recipe deleted successfully')
    } catch (error) {
      toast.error('Failed to delete recipe')
    }
  }

  const handleToggleFeatured = async (recipe: Recipe) => {
    try {
      const updatedFeatured = !recipe.featured
      const res = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: updatedFeatured }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setRecipes(recipes.map(r => r.id === recipe.id ? { ...r, featured: updatedFeatured } : r))
      toast.success(`Recipe ${updatedFeatured ? 'added to' : 'removed from'} featured`)
    } catch (error) {
      toast.error('Failed to update featured status')
    }
  }

  const handleToggleTrending = async (recipe: Recipe) => {
    try {
      const updatedTrending = !recipe.trending
      const res = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trending: updatedTrending }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setRecipes(recipes.map(r => r.id === recipe.id ? { ...r, trending: updatedTrending } : r))
      toast.success(`Recipe ${updatedTrending ? 'added to' : 'removed from'} trending`)
    } catch (error) {
      toast.error('Failed to update trending status')
    }
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  const handleRecipeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipeFormData.title || !recipeFormData.description || !recipeFormData.ingredients || !recipeFormData.instructions) {
      toast.error('Please fill in all required text fields')
      return
    }

    setIsSubmitting(true)
    try {
      let imagePath = recipeImagePreview || '/images/curry.jpg'

      if (recipeImageFile) {
        const uploadData = new FormData()
        uploadData.append('file', recipeImageFile)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData })
        if (!uploadRes.ok) throw new Error('Failed to upload image')
        const uploadResult = await uploadRes.json()
        imagePath = uploadResult.imageUrl
      } else if (!recipeImagePreview && !editingRecipeId) {
        toast.error('Please upload an image')
        setIsSubmitting(false)
        return
      }

      const payload = {
        title: recipeFormData.title,
        slug: generateSlug(recipeFormData.title),
        description: recipeFormData.description,
        time: recipeFormData.time,
        difficulty: recipeFormData.difficulty,
        category: recipeFormData.category,
        image: imagePath,
        ingredients: recipeFormData.ingredients.split('\n').filter(i => i.trim() !== ''),
        instructions: recipeFormData.instructions.split('\n').filter(i => i.trim() !== ''),
      }

      let res;
      if (editingRecipeId) {
        res = await fetch(`/api/recipes/${editingRecipeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) throw new Error('Failed to save recipe')
      const { recipe } = await res.json()
      
      if (editingRecipeId) {
        setRecipes(recipes.map(r => r.id === editingRecipeId ? recipe : r))
        toast.success('Recipe updated successfully!')
      } else {
        setRecipes([...recipes, recipe])
        toast.success('Recipe added successfully!')
      }
      
      resetRecipeForm()
      setActiveTab('recipes')
    } catch (error) {
      toast.error('An error occurred while saving the recipe')
    } finally {
      setIsSubmitting(false)
    }
  }

  // === CATEGORY HANDLERS ===
  const resetCategoryForm = () => {
    setEditingCategoryId(null)
    setCategoryFormData({ name: '', color: 'from-amber-500/20' })
    setCategoryImageFile(null)
    setCategoryImagePreview(null)
  }

  const handleEditCategoryClick = (category: Category) => {
    setEditingCategoryId(category.id)
    setCategoryFormData({ name: category.name, color: category.color })
    setCategoryImagePreview(category.image)
    setActiveTab('category-form')
  }

  const handleDeleteCategoryClick = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setCategories(categories.filter(c => c.id !== id))
      toast.success('Category deleted successfully')
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryFormData.name || !categoryFormData.color) {
      toast.error('Please fill in all required text fields')
      return
    }

    setIsSubmitting(true)
    try {
      let imagePath = categoryImagePreview || '/images/curry.jpg'

      if (categoryImageFile) {
        const uploadData = new FormData()
        uploadData.append('file', categoryImageFile)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData })
        if (!uploadRes.ok) throw new Error('Failed to upload image')
        const uploadResult = await uploadRes.json()
        imagePath = uploadResult.imageUrl
      } else if (!categoryImagePreview && !editingCategoryId) {
        toast.error('Please upload an image')
        setIsSubmitting(false)
        return
      }

      const payload = {
        name: categoryFormData.name,
        slug: generateSlug(categoryFormData.name),
        image: imagePath,
        color: categoryFormData.color,
      }

      let res;
      if (editingCategoryId) {
        res = await fetch(`/api/categories/${editingCategoryId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) throw new Error('Failed to save category')
      const { category } = await res.json()
      
      if (editingCategoryId) {
        setCategories(categories.map(c => c.id === editingCategoryId ? category : c))
        toast.success('Category updated successfully!')
      } else {
        setCategories([...categories, category])
        toast.success('Category added successfully!')
      }
      
      resetCategoryForm()
      setActiveTab('categories')
    } catch (error) {
      toast.error('An error occurred while saving the category')
    } finally {
      setIsSubmitting(false)
    }
  }

  // === STORY HANDLERS ===
  const handleUpdateStoryStatus = async (id: string, status: 'approved' | 'pending') => {
    try {
      const res = await fetch(`/api/stories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (!res.ok) throw new Error('Failed to update story status')
      setStories(stories.map(s => s.id === id ? { ...s, status } : s))
      toast.success(`Story ${status === 'approved' ? 'approved' : 'moved to pending'}`)
    } catch (error) {
      toast.error('Failed to update story status')
    }
  }

  const handleDeleteStoryClick = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story submission?')) return
    try {
      const res = await fetch(`/api/stories/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setStories(stories.filter(s => s.id !== id))
      toast.success('Story deleted successfully')
    } catch (error) {
      toast.error('Failed to delete story')
    }
  }

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-border pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => { setActiveTab('recipes'); resetRecipeForm(); resetCategoryForm(); }}
          className={`pb-2 px-1 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'recipes' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <ChefHat className="w-4 h-4" /> Manage Recipes
        </button>
        <button
          onClick={() => { setActiveTab('recipe-form'); resetRecipeForm(); resetCategoryForm(); }}
          className={`pb-2 px-1 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'recipe-form' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Plus className="w-4 h-4" /> Add Recipe
        </button>
        <button
          onClick={() => { setActiveTab('categories'); resetRecipeForm(); resetCategoryForm(); }}
          className={`pb-2 px-1 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'categories' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <ListTree className="w-4 h-4" /> Manage Categories
        </button>
        <button
          onClick={() => { setActiveTab('category-form'); resetRecipeForm(); resetCategoryForm(); }}
          className={`pb-2 px-1 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'category-form' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
        <button
          onClick={() => { setActiveTab('stories'); resetRecipeForm(); resetCategoryForm(); }}
          className={`pb-2 px-1 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'stories' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Manage Stories
          {stories.filter(s => s.status === 'pending').length > 0 && (
            <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
              {stories.filter(s => s.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {/* RECIPES LIST VIEW */}
      {activeTab === 'recipes' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {recipes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl">No recipes found. Add your first recipe!</div>
          ) : (
            <div className="grid gap-4">
              {recipes.map(recipe => (
                <div key={recipe.id} className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-background border border-border/50 rounded-xl shadow-sm">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1 w-full text-center sm:text-left">
                    <h3 className="font-semibold text-lg">{recipe.title}</h3>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{recipe.category.replace('-', ' ')}</span>
                      <span>•</span>
                      <span>{recipe.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 sm:ml-auto w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-4 flex-wrap justify-end">
                      <div className="flex items-center gap-2">
                        <Switch checked={!!recipe.trending} onCheckedChange={() => handleToggleTrending(recipe)} />
                        <span className="text-sm font-medium text-amber-500">Trending</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={!!recipe.featured} onCheckedChange={() => handleToggleFeatured(recipe)} />
                        <span className="text-sm font-medium">Featured</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditRecipeClick(recipe)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteRecipeClick(recipe.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* RECIPE FORM VIEW */}
      {activeTab === 'recipe-form' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 sm:p-8 border border-border/50 shadow-xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            {editingRecipeId ? <Edit className="w-5 h-5 text-accent" /> : <Plus className="w-5 h-5 text-accent" />}
            {editingRecipeId ? 'Edit Recipe' : 'Add New Recipe'}
          </h2>

          <form onSubmit={handleRecipeSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Recipe Image</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors overflow-hidden relative">
                  {recipeImagePreview ? (
                    <img src={recipeImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setRecipeImageFile(e.target.files[0])
                      setRecipeImagePreview(URL.createObjectURL(e.target.files[0]))
                    }
                  }} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Title</label>
                <input name="title" value={recipeFormData.title} onChange={e => setRecipeFormData({...recipeFormData, title: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <label className="block text-sm font-medium">Time</label>
                  <input name="time" value={recipeFormData.time} onChange={e => setRecipeFormData({...recipeFormData, time: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Difficulty</label>
                  <select name="difficulty" value={recipeFormData.difficulty} onChange={e => setRecipeFormData({...recipeFormData, difficulty: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50">
                    <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Category</label>
              <select name="category" value={recipeFormData.category} onChange={e => setRecipeFormData({...recipeFormData, category: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50">
                {categories.map(cat => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
                {categories.length === 0 && <option value="">No categories found</option>}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Description</label>
              <textarea name="description" value={recipeFormData.description} onChange={e => setRecipeFormData({...recipeFormData, description: e.target.value})} rows={3} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50 resize-none" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Ingredients (One per line)</label>
                <textarea name="ingredients" value={recipeFormData.ingredients} onChange={e => setRecipeFormData({...recipeFormData, ingredients: e.target.value})} rows={8} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50 resize-none whitespace-pre-wrap" required />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Instructions (One step per line)</label>
                <textarea name="instructions" value={recipeFormData.instructions} onChange={e => setRecipeFormData({...recipeFormData, instructions: e.target.value})} rows={8} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50 resize-none whitespace-pre-wrap" required />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {editingRecipeId ? 'Update Recipe' : 'Save Recipe'}
            </Button>
          </form>
        </motion.div>
      )}

      {/* CATEGORIES LIST VIEW */}
      {activeTab === 'categories' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {categories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl">No categories found.</div>
          ) : (
            <div className="grid gap-4">
              {categories.map(category => (
                <div key={category.id} className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-background border border-border/50 rounded-xl shadow-sm">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1 w-full text-center sm:text-left">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-muted-foreground">
                      <span>Slug: {category.slug}</span>
                      <span>•</span>
                      <span>Color: {category.color}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto justify-center sm:justify-end">
                    <Button variant="outline" size="icon" onClick={() => handleEditCategoryClick(category)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteCategoryClick(category.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* CATEGORY FORM VIEW */}
      {activeTab === 'category-form' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 sm:p-8 border border-border/50 shadow-xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            {editingCategoryId ? <Edit className="w-5 h-5 text-accent" /> : <Plus className="w-5 h-5 text-accent" />}
            {editingCategoryId ? 'Edit Category' : 'Add New Category'}
          </h2>

          <form onSubmit={handleCategorySubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category Image</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors overflow-hidden relative">
                  {categoryImagePreview ? (
                    <img src={categoryImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCategoryImageFile(e.target.files[0])
                      setCategoryImagePreview(URL.createObjectURL(e.target.files[0]))
                    }
                  }} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Category Name</label>
                <input name="name" value={categoryFormData.name} onChange={e => setCategoryFormData({...categoryFormData, name: e.target.value})} placeholder="e.g., Authentic Curries" className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50" required />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Background Color (Tailwind class)</label>
                <input name="color" value={categoryFormData.color} onChange={e => setCategoryFormData({...categoryFormData, color: e.target.value})} placeholder="e.g., from-amber-500/20" className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50" required />
                <p className="text-xs text-muted-foreground mt-1">Example: from-red-600/20</p>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {editingCategoryId ? 'Update Category' : 'Save Category'}
            </Button>
          </form>
        </motion.div>
      )}

      {/* STORIES LIST VIEW */}
      {activeTab === 'stories' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b border-border pb-2">Pending Submissions</h3>
            {stories.filter(s => s.status === 'pending').length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending stories.</p>
            ) : (
              <div className="grid gap-4">
                {stories.filter(s => s.status === 'pending').map(story => (
                  <div key={story.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 border border-amber-500/30 rounded-xl shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                    <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
                      <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold">{story.recipe}</h4>
                      <p className="text-xs text-muted-foreground">By {story.name} • {story.location}</p>
                      <p className="text-sm italic line-clamp-2">"{story.story}"</p>
                    </div>
                    <div className="flex items-center gap-2 sm:flex-col sm:justify-center mt-2 sm:mt-0">
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 w-full" onClick={() => handleUpdateStoryStatus(story.id, 'approved')}>
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="w-full" onClick={() => handleDeleteStoryClick(story.id)}>
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 pt-6">
            <h3 className="font-semibold text-lg border-b border-border pb-2">Approved Stories</h3>
            {stories.filter(s => s.status === 'approved').length === 0 ? (
              <p className="text-sm text-muted-foreground">No approved stories.</p>
            ) : (
              <div className="grid gap-4">
                {stories.filter(s => s.status === 'approved').map(story => (
                  <div key={story.id} className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-background border border-border/50 rounded-xl shadow-sm">
                    <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-muted">
                      <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1 w-full text-center sm:text-left">
                      <h4 className="font-medium">{story.name}</h4>
                      <p className="text-xs text-muted-foreground">{story.recipe} • {story.likes} likes</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleUpdateStoryStatus(story.id, 'pending')}>
                        Move to Pending
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteStoryClick(story.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </motion.div>
      )}

    </div>
  )
}
