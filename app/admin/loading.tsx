import React from 'react'
import { Loader2 } from 'lucide-react'

export default function AdminLoading() {
  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading Admin Dashboard...</p>
      </div>
    </div>
  )
}
