"use client"

import Link from "next/link"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"
import { Trophy, Home, User, LogOut, Settings } from "lucide-react"

export default function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          Race Betting
        </Link>

        <nav className="flex items-center gap-6">
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

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-sm">
                <span className="text-muted-foreground mr-1">Balance:</span>
                <span className="font-medium">{user.balance} coins</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{user.name}</span>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
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
    </header>
  )
}
