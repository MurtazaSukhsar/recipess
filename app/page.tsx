import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { TrendingRecipes } from '@/components/trending-recipes'
import { Categories } from '@/components/categories'
import { FeaturedDishes } from '@/components/featured-dishes'
import { CommunityStories } from '@/components/community-stories'
import { Footer } from '@/components/footer'
import { MobileNav } from '@/components/mobile-nav'

import { getRecipes } from '@/lib/recipes'
import { getCategories } from '@/lib/categories'
import { getApprovedStories } from '@/lib/stories'

export default async function Home() {
  const recipes = await getRecipes()
  const categories = await getCategories()
  const stories = await getApprovedStories()

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <TrendingRecipes recipes={recipes} />
      <Categories categories={categories} />
      <FeaturedDishes recipes={recipes} />
      <CommunityStories stories={stories} />
      <Footer />
      <MobileNav />
    </main>
  )
}
