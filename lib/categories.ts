import { supabase } from './supabase'

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  color: string;
  count: number;
}

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true })
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data as Category[]
}
