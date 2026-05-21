import { getRecipesByCategory } from '@/lib/recipes'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ChefHat, Star, ChevronLeft } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default async function CategoryPage(
  props: {
    params: Promise<{ slug: string }>
  }
) {
  const params = await props.params;
  const categorySlug = params.slug;
  const categoryRecipes = await getRecipesByCategory(categorySlug);

  // Format the category name for display
  const categoryName = categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (!categoryRecipes || categoryRecipes.length === 0) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center pt-32">
          <h1 className="text-4xl font-serif font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8 text-lg">We couldn't find any recipes for "{categoryName}".</p>
          <Link 
            href="/"
            className="px-6 py-3 rounded-full bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
          >
            Back to Home
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-32">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-accent transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Categories
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground">
            {categoryName} Recipes
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Explore our curated collection of {categoryRecipes.length} traditional {categoryName.toLowerCase()} {categoryRecipes.length === 1 ? 'recipe' : 'recipes'}.
          </p>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryRecipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.slug}`} className="group block">
              <div className="relative rounded-2xl overflow-hidden bg-card border border-border transition-all hover:border-accent/50 hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {recipe.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-accent/90 backdrop-blur-sm text-accent-foreground text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="text-sm font-medium text-accent">{recipe.rating || 4.5}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-card-foreground group-hover:text-primary transition-colors mb-2">
                    {recipe.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {recipe.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {recipe.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <ChefHat className="w-4 h-4" />
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
