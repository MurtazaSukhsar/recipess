'use client'

import { motion } from 'framer-motion'
import { Home, Search, Heart, User, BookOpen } from 'lucide-react'

const navItems = [
  { name: 'Home', icon: Home, href: '#' },
  { name: 'Search', icon: Search, href: '#' },
  { name: 'Recipes', icon: BookOpen, href: '#recipes' },
  { name: 'Saved', icon: Heart, href: '#' },
  { name: 'Profile', icon: User, href: '#' },
]

export function MobileNav() {
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/95 backdrop-blur-xl border-t border-border"
    >
      <div className="flex items-center justify-around py-2 safe-bottom">
        {navItems.map((item) => (
          <motion.a
            key={item.name}
            href={item.href}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-primary dark:hover:text-accent transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.name}</span>
          </motion.a>
        ))}
      </div>
    </motion.nav>
  )
}
