import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params
    const supabaseServer = await createClient()
    const { data: { user } } = await supabaseServer.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    
    // Omit id from updates if present
    if (updates.id) {
      delete updates.id
    }

    const { data, error } = await supabaseServer
      .from('recipes')
      .update(updates)
      .eq('id', resolvedParams.slug) // using slug param as ID because we pass ID in URL
      .select()
      .single()

    if (error) {
      console.error('Supabase Error on PUT:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, recipe: data })
  } catch (error) {
    console.error('Error updating recipe:', error)
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params
    const supabaseServer = await createClient()
    const { data: { user } } = await supabaseServer.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabaseServer
      .from('recipes')
      .delete()
      .eq('id', resolvedParams.slug) // using slug param as ID because we pass ID in URL

    if (error) {
      console.error('Supabase Error on DELETE:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 })
  }
}
