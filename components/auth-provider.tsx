"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  name: string
  email: string
  isAdmin: boolean
  balance: number
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call to authenticate
    // For demo purposes, we'll use mock data
    if (email === "admin@example.com" && password === "password") {
      const adminUser = {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        isAdmin: true,
        balance: 1000,
      }
      setUser(adminUser)
      localStorage.setItem("user", JSON.stringify(adminUser))
    } else if (email === "user@example.com" && password === "password") {
      const regularUser = {
        id: "2",
        name: "Regular User",
        email: "user@example.com",
        isAdmin: false,
        balance: 100,
      }
      setUser(regularUser)
      localStorage.setItem("user", JSON.stringify(regularUser))
    } else if (email === "ross@example.com" && password === "password") {
      const rossUser = {
        id: "5",
        name: 'Ross "Yellow" Jacobs',
        email: "ross@example.com",
        isAdmin: false,
        balance: 100,
      }
      setUser(rossUser)
      localStorage.setItem("user", JSON.stringify(rossUser))
    } else if (email === "lyu@example.com" && password === "password") {
      const lyuUser = {
        id: "6",
        name: "Lyu Dias",
        email: "lyu@example.com",
        isAdmin: false,
        balance: 100,
      }
      setUser(lyuUser)
      localStorage.setItem("user", JSON.stringify(lyuUser))
    } else if (email === "aaron@example.com" && password === "password") {
      const aaronUser = {
        id: "7",
        name: "Aaron Bird",
        email: "aaron@example.com",
        isAdmin: false,
        balance: 100,
      }
      setUser(aaronUser)
      localStorage.setItem("user", JSON.stringify(aaronUser))
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const register = async (name: string, email: string, password: string) => {
    // In a real app, this would be an API call to register
    // For demo purposes, we'll create a new user with 100 coins
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      isAdmin: false,
      balance: 100,
    }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, register }}>{children}</AuthContext.Provider>
}
