import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { TrendingRecipes } from '@/components/trending-recipes'
import { Categories } from '@/components/categories'
import { FeaturedDishes } from '@/components/featured-dishes'
import { CommunityStories } from '@/components/community-stories'
import { Newsletter } from '@/components/newsletter'
import { Footer } from '@/components/footer'
import { MobileNav } from '@/components/mobile-nav'

import { getRecipes } from '@/lib/recipes'

export default async function Home() {
  const recipes = await getRecipes()

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <TrendingRecipes recipes={recipes} />
      <Categories />
      <FeaturedDishes recipes={recipes} />
      <CommunityStories />
      <Newsletter />
      <Footer />
      <MobileNav />
    </main>
  )
}
