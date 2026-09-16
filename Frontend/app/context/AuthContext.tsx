"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type User = {
  id: string
  name: string
  email: string
  avatar?: string
  provider?: "email" | "facebook"
}

type AuthContextType = {
  user: User | null
  isLoggedIn: boolean
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  loginWithFacebook: () => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "tokoku_user_session"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY)
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  const saveUserSession = (userData: User | null) => {
    setUser(userData)
    if (userData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  const login = async (email: string, password: string): Promise<boolean> => {
    // FE Mock Login
    const nameFromEmail = email.split("@")[0]
    const formattedName =
      nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)

    const userData: User = {
      id: `usr_${Date.now()}`,
      name: formattedName || "Pengguna TokoKu",
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      provider: "email"
    }

    saveUserSession(userData)
    closeAuthModal()
    return true
  }

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    // FE Mock Register
    const userData: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      provider: "email"
    }

    saveUserSession(userData)
    closeAuthModal()
    return true
  }

  const loginWithFacebook = async (): Promise<boolean> => {
    // FE Mock Facebook Login
    const userData: User = {
      id: `fb_${Date.now()}`,
      name: "Pengguna Facebook",
      email: "user.facebook@example.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
      provider: "facebook"
    }

    saveUserSession(userData)
    closeAuthModal()
    return true
  }

  const logout = () => {
    saveUserSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginWithFacebook,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam <AuthProvider>")
  }
  return context
}
