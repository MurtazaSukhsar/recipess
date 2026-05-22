import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  // Public endpoint for submitting stories, but we'll use server client for inserts
  const supabaseServer = await createClient()

  try {
    const newStory = await request.json()

    if (!newStory.name || !newStory.location || !newStory.story || !newStory.recipe) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // New stories are pending by default
    newStory.status = 'pending'
    newStory.likes = 0
    // Generate a simple href if they didn't provide one
    if (!newStory.href) {
      newStory.href = `/recipes/${newStory.recipe.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`
    }
    
    // Default image if they didn't upload one
    if (!newStory.image) {
      newStory.image = '/images/family-cooking.jpg'
    }

    const { data, error } = await supabaseServer.from('stories').insert([newStory]).select().single()

    if (error) {
      console.error('Supabase Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, story: data })
  } catch (error) {
    console.error('Error saving story:', error)
    return NextResponse.json({ error: 'Failed to save story' }, { status: 500 })
  }
}
