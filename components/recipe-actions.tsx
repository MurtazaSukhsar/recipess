'use client'

import { useState } from 'react'
import { Share2, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface RecipeActionsProps {
  title: string
  slug: string
}

export function RecipeActions({ title, slug }: RecipeActionsProps) {
  const [isLiked, setIsLiked] = useState(false)
  const router = useRouter()

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Recipe: ${title}`,
          text: `Check out this recipe for ${title}!`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const handleLike = async () => {
    if (isLiked) return // Prevent multiple likes in same session for now
    
    setIsLiked(true)
    toast.success('Added to your favorites!')
    
    try {
      await fetch(`/api/recipes/${slug}/like`, { method: 'POST' })
      router.refresh()
    } catch (error) {
      console.error('Failed to update likes', error)
    }
  }

  return (
    <div className="flex items-center justify-center gap-4 mb-16 pb-12 border-b border-border">
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          "rounded-full transition-colors",
          isLiked ? "text-red-500 hover:text-red-600 hover:bg-red-500/10" : "hover:text-accent"
        )}
        onClick={handleLike}
        aria-label="Like recipe"
      >
        <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full hover:text-accent"
        onClick={handleShare}
        aria-label="Share recipe"
      >
        <Share2 className="w-5 h-5" />
      </Button>
    </div>
  )
}
