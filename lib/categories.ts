import { supabase } from './supabase'

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  color: string;
  count: number;
}

export async function getCategories(): Promise<Category[]> {
  // Fetch categories
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (catError) {
    console.error('Error fetching categories:', catError)
    return []
  }

  // Count actual recipes per category from the recipes table
  const { data: recipes, error: recError } = await supabase
    .from('recipes')
    .select('category')

  if (recError) {
    console.error('Error counting recipes per category:', recError)
    // Fall back to stored count if recipe fetch fails
    return categories as Category[]
  }

  // Build a map of category name -> real count
  const countMap: Record<string, number> = {}
  for (const recipe of recipes) {
    if (recipe.category) {
      countMap[recipe.category] = (countMap[recipe.category] || 0) + 1
    }
  }

  // Merge real counts into categories
  // NOTE: recipes store category as the slug (e.g. "biryani-rice"), not the display name
  return (categories as Category[]).map((cat) => ({
    ...cat,
    count: countMap[cat.slug] ?? 0,
  }))
}
