"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  name: string
  username: string
  isAdmin: boolean
  balance: number
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, password: string) => Promise<void>
  updateUserBalance: (newBalance: number) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  updateUserBalance: () => {}
})

export const useAuth = () => useContext(AuthContext)

// Helper function to generate a username from name
const generateUsername = (name: string): string => {
  // Convert name to lowercase and replace spaces with underscores
  const baseUsername = name.toLowerCase().replace(/\s+/g, '_');
  
  // Remove any non-alphanumeric characters
  const cleanUsername = baseUsername.replace(/[^a-z0-9_]/g, '');
  
  // Add a random suffix to make it unique
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${cleanUsername}_${randomSuffix}`;
}

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

  const updateUserBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  }

  const login = async (email: string, password: string) => {
    try {
      // For backward compatibility, keep the existing login for demo users
      if (
        (email === "admin@example.com" && password === "password") ||
        (email === "user@example.com" && password === "password") ||
        (email === "ross@example.com" && password === "password") ||
        (email === "lyu@example.com" && password === "password") ||
        (email === "aaron@example.com" && password === "password")
      ) {
        // Use the existing mock login for these demo accounts
        if (email === "admin@example.com" && password === "password") {
          const adminUser = {
            id: "1",
            name: "Admin User",
            username: "admin_user",
            isAdmin: true,
            balance: 1000,
          }
          setUser(adminUser)
          localStorage.setItem("user", JSON.stringify(adminUser))
          return;
        } else if (email === "user@example.com" && password === "password") {
          const regularUser = {
            id: "2",
            name: "Regular User",
            username: "regular_user",
            isAdmin: false,
            balance: 1000,
          }
          setUser(regularUser)
          localStorage.setItem("user", JSON.stringify(regularUser))
          return;
        } else if (email === "ross@example.com" && password === "password") {
          const rossUser = {
            id: "5",
            name: 'Ross "Yellow" Jacobs',
            username: "ross_yellow",
            isAdmin: false,
            balance: 1000,
          }
          setUser(rossUser)
          localStorage.setItem("user", JSON.stringify(rossUser))
          return;
        } else if (email === "lyu@example.com" && password === "password") {
          const lyuUser = {
            id: "6",
            name: "Lyu Dias",
            username: "lyu_dias",
            isAdmin: false,
            balance: 1000,
          }
          setUser(lyuUser)
          localStorage.setItem("user", JSON.stringify(lyuUser))
          return;
        } else if (email === "aaron@example.com" && password === "password") {
          const aaronUser = {
            id: "7",
            name: "Aaron Bird",
            username: "aaron_bird",
            isAdmin: false,
            balance: 1000,
          }
          setUser(aaronUser)
          localStorage.setItem("user", JSON.stringify(aaronUser))
          return;
        }
      }
      
      // For new users, use the API
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      const userData = await response.json();
      
      // Set the user in the state and localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  const register = async (name: string, password: string) => {
    try {
      // Call our API endpoint to register the user in PostgreSQL
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
      
      const newUser = await response.json();
      
      // Set the user in the state and localStorage
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, register, updateUserBalance }}>{children}</AuthContext.Provider>
}
