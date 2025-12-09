import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import { NAVY_BLUE, ORANGE } from "@/app/constants"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Bucking Broncos App",
  description: "Place bets on races and compete on the leaderboard",
  generator: 'v0.dev',
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&display=swap" rel="stylesheet" />
        <style>{`
          @media (max-width: 768px) {
            body {
              background-repeat: repeat !important;
            }
          }
        `}</style>
      </head>
      <body className={inter.className} style={{ background: `url('/full-logo.png') center center / 100% 100% no-repeat`, minHeight: '100vh', position: 'relative' }} suppressHydrationWarning>
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.75)', pointerEvents: 'none', zIndex: 0 }} suppressHydrationWarning />
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
          <AuthProvider>
            <div className="min-h-screen flex flex-col" style={{ position: 'relative', zIndex: 1 }}>
              <Header />
              <main className="flex-1 container mx-auto py-6 px-4">{children}</main>
              <footer className="border-t py-4" style={{ background: NAVY_BLUE }} suppressHydrationWarning>
                <div className="container mx-auto text-center text-sm" style={{ color: ORANGE }} suppressHydrationWarning>
                  © {new Date().getFullYear()} Bucking Broncos App
                </div>
              </footer>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
