import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabaseServer = await createClient()
  const { data: { user } } = await supabaseServer.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const newCategory = await request.json()

    if (!newCategory.name || !newCategory.slug || !newCategory.image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    newCategory.count = newCategory.count || 0
    delete newCategory.id

    const { data, error } = await supabaseServer.from('categories').insert([newCategory]).select().single()

    if (error) {
      console.error('Supabase Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, category: data })
  } catch (error) {
    console.error('Error saving category:', error)
    return NextResponse.json({ error: 'Failed to save category' }, { status: 500 })
  }
}
