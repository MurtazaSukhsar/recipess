'use client'

import { motion } from 'framer-motion'
import { ChefHat } from 'lucide-react'

const footerLinks = {
  recipes: [
    { name: 'All Recipes', href: '/recipes' },
    { name: 'Trending', href: '/#recipes' },
    { name: 'Featured', href: '/#recipes' },
  ],
  categories: [
    { name: 'Biryani & Rice', href: '/categories/biryani-rice' },
    { name: 'Curries', href: '/categories/non-veg-curries' },
    { name: 'Desserts', href: '/categories/desserts' },
    { name: 'Dawoodi Bohra Special', href: '/categories/dawoodi-bohra-special' },
  ],
  community: [
    { name: 'Share a Story', href: '/#stories' },
  ],
  about: [
    { name: 'Home', href: '/' },
    { name: 'All Recipes', href: '/recipes' },
    { name: 'Categories', href: '/#categories' },
  ],
}



export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-primary-foreground/10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="w-8 h-8 text-accent" />
              <span className="text-2xl font-serif font-bold">
                Bohra Recipes
              </span>
            </div>
            <p className="text-primary-foreground/70 text-sm max-w-xs">
              Preserving the authentic flavors of Dawoodi Bohra cuisine, 
              one recipe at a time.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Recipes</h4>
            <ul className="space-y-3">
              {footerLinks.recipes.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigate</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Bohra Recipes. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  )
}
