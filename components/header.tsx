"use client"

import Link from "next/link"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"
import { Trophy, Home, User, LogOut, Settings } from "lucide-react"
import { useState } from "react"
import { NAVY_BLUE, GREY, ORANGE, GREEN } from "@/lib/colors"

export default function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b" style={{ background: NAVY_BLUE, color: GREY }}>
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        {/* Title container with min width */}
        <div className="flex flex-col md:min-w-[300px]">
          <Link href="/" className="font-bold text-xl flex items-center gap-2" style={{ color: GREY }}>
            <Trophy className="h-6 w-6" style={{ color: ORANGE }} /> 
            Wacky Race
          </Link>
          {/* Mobile: User info under the title */}
          <div className="md:hidden mt-1 text-xs">
            {user && (
              <>
                <div className="font-semibold flex items-center gap-1">
                  <span style={{ color: ORANGE }}>User:</span>
                  <span style={{ color: GREY, textTransform: 'capitalize' }}>{user.username}</span>
                  {user.isAdmin && <span style={{ color: GREY }}> (Admin)</span>}
                </div>
                <div className="text-xs" style={{ color: GREY }}>
                  <span style={{ color: ORANGE }}>Balance:</span> <span className="font-medium" style={{ color: GREY }}>{user.balance} coins</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile: Log out/login and menu button side by side, top right */}
        <div className="flex items-center gap-2 md:hidden">
          {user ? (
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-4 w-4" style={{ color: ORANGE }} />
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="icon" className="flex items-center justify-center" style={{ background: GREEN, borderColor: GREEN, color: '#fff' }}>
                <User className="h-4 w-4" style={{ color: '#fff' }} />
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
            className={`flex items-center gap-1 font-medium`}
            style={{ color: GREY }}
          >
            <Home className="h-4 w-4" style={{ color: ORANGE }} />
            <span>Races</span>
          </Link>
          <Link
            href="/leaderboard"
            className={`flex items-center gap-1 font-medium`}
            style={{ color: GREY }}
          >
            <Trophy className="h-4 w-4" style={{ color: ORANGE }} />
            <span>Leaderboard</span>
          </Link>
          {user?.isAdmin && (
            <Link
              href="/admin"
              className={`flex items-center gap-1 font-medium`}
              style={{ color: GREY }}
            >
              <Settings className="h-4 w-4" style={{ color: ORANGE }} />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* User info (desktop only) with min width */}
        <div className="hidden md:flex items-center gap-4 min-w-[300px] justify-end">
          {user ? (
            <>
              <div className="text-sm flex flex-col items-end" style={{ color: GREY }}>
                <span className="text-lg font-semibold flex items-center gap-1">
                  <span style={{ color: ORANGE }}>User:</span>
                  <span style={{ color: GREY, textTransform: 'capitalize' }}>{user.username}</span>
                  {user.isAdmin && <span style={{ color: GREY }}> (Admin)</span>}
                </span>
                <div>
                  <span className="mr-1" style={{ color: ORANGE }}>Balance:</span>
                  <span className="font-medium" style={{ color: GREY }}>{user.balance} coins</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-4 w-4" style={{ color: ORANGE }} />
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="flex items-center gap-1" style={{ background: GREEN, borderColor: GREEN, color: '#fff' }}>
                <User className="h-4 w-4" style={{ color: '#fff' }} />
                <span>Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <nav className="md:hidden border-t px-4 py-2 flex flex-col gap-2" style={{ color: GREY, background: NAVY_BLUE }}>
          <Link
            href="/"
            className={`flex items-center gap-1 py-2 font-medium`}
            style={{ color: GREY }}
            onClick={() => setMenuOpen(false)}
          >
            <Home className="h-4 w-4" style={{ color: ORANGE }} />
            <span>Races</span>
          </Link>
          <Link
            href="/leaderboard"
            className={`flex items-center gap-1 py-2 font-medium`}
            style={{ color: GREY }}
            onClick={() => setMenuOpen(false)}
          >
            <Trophy className="h-4 w-4" style={{ color: ORANGE }} />
            <span>Leaderboard</span>
          </Link>
          {user?.isAdmin && (
            <Link
              href="/admin"
              className={`flex items-center gap-1 py-2 font-medium`}
              style={{ color: GREY }}
              onClick={() => setMenuOpen(false)}
            >
              <Settings className="h-4 w-4" style={{ color: ORANGE }} />
              <span>Admin</span>
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}
