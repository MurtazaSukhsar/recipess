import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const supabaseServer = await createClient()
    const { data: { user } } = await supabaseServer.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    
    if (updates.id) {
      delete updates.id
    }

    const { data, error } = await supabaseServer
      .from('categories')
      .update(updates)
      .eq('id', resolvedParams.id)
      .select()
      .single()

    if (error) {
      console.error('Supabase Error on PUT:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, category: data })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const supabaseServer = await createClient()
    const { data: { user } } = await supabaseServer.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabaseServer
      .from('categories')
      .delete()
      .eq('id', resolvedParams.id)

    if (error) {
      console.error('Supabase Error on DELETE:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
