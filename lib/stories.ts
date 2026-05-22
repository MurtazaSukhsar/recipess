import { supabase } from './supabase'

export interface Story {
  id: string;
  name: string;
  location: string;
  image: string;
  story: string;
  recipe: string;
  href: string;
  likes: number;
  status: 'pending' | 'approved';
}

export async function getApprovedStories() {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('status', 'approved')
    .order('likes', { ascending: false })

  if (error) {
    console.error('Error fetching approved stories:', error)
    return []
  }
  return data as Story[]
}

export async function getAllStories() {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('status', { ascending: false }) // 'pending' comes before 'approved' alphabetically

  if (error) {
    console.error('Error fetching all stories:', error)
    return []
  }
  return data as Story[]
}
