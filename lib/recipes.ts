export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  rating?: number;
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  chef?: string;
  saves: number;
  featured?: boolean;
  trending?: boolean;
  ingredients: string[];
  instructions: string[];
  category: string;
}

import { supabase } from './supabase'

export async function getRecipes() {
  const { data, error } = await supabase.from('recipes').select('*')
  if (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
  return data
}

export async function getRecipeBySlug(slug: string) {
  const { data, error } = await supabase.from('recipes').select('*').eq('slug', slug).single()
  if (error) {
    console.error('Error fetching recipe by slug:', error)
    return null
  }
  return data
}

export async function getRecipesByCategory(category: string) {
  const { data, error } = await supabase.from('recipes').select('*').eq('category', category)
  if (error) {
    console.error('Error fetching recipes by category:', error)
    return []
  }
  return data
}

export async function getTrendingRecipes() {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('trending', true)
    .order('saves', { ascending: false })
  if (error) {
    console.error('Error fetching trending recipes:', error)
    return []
  }
  return data
}
