import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const newRecipe = await request.json()

    if (!newRecipe.title || !newRecipe.slug || !newRecipe.image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Ensure default values
    newRecipe.saves = newRecipe.saves || 0
    newRecipe.rating = newRecipe.rating || 5.0
    
    // Insert into Supabase
    // Omit ID to let Supabase generate a UUID (if ID is passed as a string from the form, delete it)
    delete newRecipe.id;
    
    const { data, error } = await supabase.from('recipes').insert([newRecipe]).select().single()

    if (error) {
      console.error('Supabase Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, recipe: data })
  } catch (error) {
    console.error('Error saving recipe:', error)
    return NextResponse.json({ error: 'Failed to save recipe' }, { status: 500 })
  }
}
