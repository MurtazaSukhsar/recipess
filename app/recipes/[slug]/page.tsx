import { getRecipeBySlug } from '@/lib/recipes'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Clock, ChefHat, Heart, Star, Share2, Printer, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SmokeEffect } from '@/components/smoke-effect'

export default async function RecipePage(
  props: {
    params: Promise<{ slug: string }>
  }
) {
  const params = await props.params;
  const recipe = getRecipeBySlug(params.slug)

  if (!recipe) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-accent mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>

        {/* Recipe Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
              Authentic Recipe
            </span>
            {recipe.rating && (
              <span className="flex items-center text-sm font-medium text-foreground">
                <Star className="w-4 h-4 text-accent fill-accent mr-1" />
                {recipe.rating}
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
            {recipe.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
            {recipe.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-sm text-foreground">
            <div className="flex flex-col items-center gap-2">
              <Clock className="w-6 h-6 text-accent" />
              <div>
                <p className="font-semibold">{recipe.time}</p>
                <p className="text-muted-foreground">Total Time</p>
              </div>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block" />
            <div className="flex flex-col items-center gap-2">
              <ChefHat className="w-6 h-6 text-accent" />
              <div>
                <p className="font-semibold">{recipe.difficulty}</p>
                <p className="text-muted-foreground">Skill Level</p>
              </div>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block" />
            <div className="flex flex-col items-center gap-2">
              <Heart className="w-6 h-6 text-accent" />
              <div>
                <p className="font-semibold">{recipe.saves.toLocaleString()}</p>
                <p className="text-muted-foreground">People loved this</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-16 shadow-2xl group">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
          />
          {/* Subtle vignette for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
          
          {/* The Live Smoking Effect */}
          <SmokeEffect />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mb-16 pb-12 border-b border-border">
          <Button variant="outline" className="rounded-full px-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            <Heart className="w-4 h-4 mr-2" />
            Save Recipe
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:text-accent">
            <Share2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:text-accent">
            <Printer className="w-5 h-5" />
          </Button>
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 lg:gap-24">
          
          {/* Ingredients Sidebar */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-2">
              Ingredients
            </h2>
            <ul className="space-y-4">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">
                    {ingredient}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions Main */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
              Instructions
            </h2>
            <div className="space-y-8">
              {recipe.instructions.map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full glass flex items-center justify-center font-serif font-bold text-accent">
                    {index + 1}
                  </div>
                  <p className="text-muted-foreground leading-relaxed pt-1.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </main>
  )
}
