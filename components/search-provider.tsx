'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Search, Loader2 } from 'lucide-react'

interface SearchContextType {
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

interface RecipeSearchItem {
  id: string
  slug: string
  title: string
  category: string
}

export function SearchProvider({ children, recipes: initialRecipes }: { children: React.ReactNode, recipes: any[] }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [recipes, setRecipes] = useState<RecipeSearchItem[]>(initialRecipes || [])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsSearchOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Fetch fresh recipes from API whenever search dialog opens
  const fetchRecipes = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/recipes', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setRecipes(data)
      }
    } catch (err) {
      console.error('Failed to fetch recipes for search:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isSearchOpen) {
      fetchRecipes()
    }
  }, [isSearchOpen, fetchRecipes])

  const handleSelect = (slug: string) => {
    setIsSearchOpen(false)
    router.push(`/recipes/${slug}`)
  }

  return (
    <SearchContext.Provider value={{ isSearchOpen, setIsSearchOpen }}>
      {children}
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput placeholder="Search for biryani, kebabs, desserts..." />
        <CommandList>
          {isLoading ? (
            <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading recipes...
            </div>
          ) : (
            <>
              <CommandEmpty>No recipes found.</CommandEmpty>
              <CommandGroup heading="Recipes">
                {recipes.map((recipe) => (
                  <CommandItem
                    key={recipe.id}
                    value={recipe.title}
                    onSelect={() => handleSelect(recipe.slug)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span>{recipe.title}</span>
                    {recipe.category && (
                      <span className="ml-auto text-xs text-muted-foreground">{recipe.category}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </SearchContext.Provider>
  )
}
