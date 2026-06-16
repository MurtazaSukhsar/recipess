import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { SearchProvider } from '@/components/search-provider'
import { Toaster } from 'sonner'
import Script from 'next/script'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bohra Recipes | Authentic Dawoodi Bohra Cuisine',
  description: 'Discover authentic Bohra recipes passed down through generations. Premium collection of traditional Dawoodi Bohra dishes for Ramadan, Eid, and everyday cooking.',
  keywords: ['Bohra recipes', 'Dawoodi Bohra cuisine', 'Islamic food', 'Ramadan recipes', 'Eid dishes', 'Indian Muslim food'],
  generator: 'v0.app',
  other: {
    'google-adsense-account': 'ca-pub-9639003866744122',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f0e8' },
    { media: '(prefers-color-scheme: dark)', color: '#1a2e1a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

import { getRecipes } from '@/lib/recipes'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const recipes = await getRecipes()

  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9639003866744122"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SearchProvider recipes={recipes}>
            {children}
          </SearchProvider>
        </ThemeProvider>
        <Toaster position="top-center" />
        <Analytics />
      </body>
    </html>
  )
}
