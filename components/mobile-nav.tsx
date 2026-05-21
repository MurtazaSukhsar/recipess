'use client'

import { motion } from 'framer-motion'
import { Home, Search, Heart, User, BookOpen } from 'lucide-react'
import { useSearch } from '@/components/search-provider'
import { toast } from 'sonner'

const navItems = [
  { name: 'Home', icon: Home, href: '#' },
  { name: 'Search', icon: Search, href: '#' },
  { name: 'Recipes', icon: BookOpen, href: '#recipes' },
  { name: 'Saved', icon: Heart, href: '#' },
  { name: 'Profile', icon: User, href: '#' },
]

export function MobileNav() {
  const { setIsSearchOpen } = useSearch()

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/95 backdrop-blur-xl border-t border-border"
    >
      <div className="flex items-center justify-around py-2 safe-bottom">
        {navItems.map((item) => {
          const isSearch = item.name === 'Search'
          const isToast = item.name === 'Saved' || item.name === 'Profile'
          
          return (
            <motion.button
              key={item.name}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                if (isSearch) {
                  e.preventDefault()
                  setIsSearchOpen(true)
                } else if (isToast) {
                  e.preventDefault()
                  toast.info(`${item.name} coming soon!`)
                } else if (item.href) {
                  window.location.href = item.href
                }
              }}
              className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-primary dark:hover:text-accent transition-colors bg-transparent border-none"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.name}</span>
            </motion.button>
          )
        })}
      </div>
    </motion.nav>
  )
}
