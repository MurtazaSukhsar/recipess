import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const slug = params.slug;

    // Fetch the current saves count
    const { data: recipe, error: fetchError } = await supabase
      .from('recipes')
      .select('saves')
      .eq('slug', slug)
      .single()

    if (fetchError || !recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    // Increment saves
    const newSaves = (recipe.saves || 0) + 1

    const { error: updateError } = await supabase
      .from('recipes')
      .update({ saves: newSaves })
      .eq('slug', slug)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }

    return NextResponse.json({ success: true, saves: newSaves })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
