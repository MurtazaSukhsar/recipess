import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { TrendingRecipes } from '@/components/trending-recipes'
import { Categories } from '@/components/categories'
import { FeaturedDishes } from '@/components/featured-dishes'
import { CommunityStories } from '@/components/community-stories'
import { Newsletter } from '@/components/newsletter'
import { Footer } from '@/components/footer'
import { MobileNav } from '@/components/mobile-nav'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <TrendingRecipes />
      <Categories />
      <FeaturedDishes />
      <CommunityStories />
      <Newsletter />
      <Footer />
      <MobileNav />
    </main>
  )
}
