import React from 'react'
import { ChevronLeft, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { logout } from '@/app/login/actions'
import { AdminDashboard } from '@/components/admin-dashboard'
import { getRecipes } from '@/lib/recipes'
import { getCategories } from '@/lib/categories'
import { getAllStories } from '@/lib/stories'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const recipes = await getRecipes()
  const categories = await getCategories()
  const stories = await getAllStories()

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-serif font-bold text-primary flex-1">Admin Dashboard</h1>
        
        <form action={logout}>
          <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </form>
      </div>

      <AdminDashboard initialRecipes={recipes} initialCategories={categories} initialStories={stories} />
    </div>
  )
}
