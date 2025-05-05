"use client"

import Link from "next/link"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"
import { Trophy, Home, User, LogOut, Settings } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        {/* Title container with min width */}
        <div className="flex flex-col md:min-w-[300px]">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <Trophy className="h-6 w-6" /> 
            Wacky Race
          </Link>
          {/* Mobile: User info under the title */}
          <div className="md:hidden mt-1">
            {user?.isAdmin && (
              <div className="text-xs font-semibold text-primary">Admin User</div>
            )}
            {user && (
              <div className="text-xs text-muted-foreground">
                Balance: <span className="font-medium text-black">{user.balance}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: Log out/login and menu button side by side, top right */}
        <div className="flex items-center gap-2 md:hidden">
          {user ? (
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="icon" className="flex items-center justify-center">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <button
            className="flex items-center px-2 py-1"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 w-full max-w-2xl justify-center">
          <Link
            href="/"
            className={`flex items-center gap-1 ${
              pathname === "/" ? "text-primary font-medium" : "text-muted-foreground"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Races</span>
          </Link>
          <Link
            href="/leaderboard"
            className={`flex items-center gap-1 ${
              pathname === "/leaderboard" ? "text-primary font-medium" : "text-muted-foreground"
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>Leaderboard</span>
          </Link>
          {user?.isAdmin && (
            <Link
              href="/admin"
              className={`flex items-center gap-1 ${
                pathname.startsWith("/admin") ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* User info (desktop only) with min width */}
        <div className="hidden md:flex items-center gap-4 min-w-[300px] justify-end">
          {user ? (
            <>
              <div className="text-sm">
                <span className="text-muted-foreground mr-1">Balance:</span>
                <span className="font-medium">{user.balance} coins</span>
              </div>
              {user.isAdmin && (
                <span className="text-sm font-semibold">Admin User</span>
              )}
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t px-4 py-2 flex flex-col gap-2">
          <Link
            href="/"
            className={`flex items-center gap-1 py-2 ${
              pathname === "/" ? "text-primary font-medium" : "text-muted-foreground"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <Home className="h-4 w-4" />
            <span>Races</span>
          </Link>
          <Link
            href="/leaderboard"
            className={`flex items-center gap-1 py-2 ${
              pathname === "/leaderboard" ? "text-primary font-medium" : "text-muted-foreground"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <Trophy className="h-4 w-4" />
            <span>Leaderboard</span>
          </Link>
          {user?.isAdmin && (
            <Link
              href="/admin"
              className={`flex items-center gap-1 py-2 ${
                pathname.startsWith("/admin") ? "text-primary font-medium" : "text-muted-foreground"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}
