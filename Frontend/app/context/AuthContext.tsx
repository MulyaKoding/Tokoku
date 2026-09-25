"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react"
import {
  loginApi,
  registerApi,
  requestRegisterApi,
  verifyRegisterApi,
  resendCodeApi,
  getMeApi
} from "../lib/api"
import type { User } from "../lib/types"

export type { User }

type AuthContextType = {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>
  requestRegister: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string; debugOtp?: string }>
  verifyRegister: (
    email: string,
    code: string
  ) => Promise<{ success: boolean; message?: string }>
  resendCode: (
    email: string
  ) => Promise<{ success: boolean; message?: string; debugOtp?: string }>
  loginWithFacebook: () => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_USER_KEY = "tokoku_user_session"
const STORAGE_TOKEN_KEY = "tokoku_jwt_token"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_USER_KEY)
      const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY)
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      if (savedToken) {
        setToken(savedToken)
        getMeApi(savedToken)
          .then((freshUser) => {
            if (freshUser) {
              setUser(freshUser)
              localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(freshUser))
            }
          })
          .catch(() => {
            // Keep saved user
          })
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  const saveUserSession = (
    userData: User | null,
    jwtToken: string | null = null
  ) => {
    setUser(userData)
    setToken(jwtToken)
    if (userData && jwtToken) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData))
      localStorage.setItem(STORAGE_TOKEN_KEY, jwtToken)
    } else if (userData) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData))
    } else {
      localStorage.removeItem(STORAGE_USER_KEY)
      localStorage.removeItem(STORAGE_TOKEN_KEY)
    }
  }

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    const res = await loginApi(email, password)
    if (res.success && res.data) {
      saveUserSession(res.data.user, res.data.token)
      closeAuthModal()
      return { success: true }
    }

    return {
      success: false,
      message: res.message || "Email atau password yang Anda masukkan salah."
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    const res = await registerApi(name, email, password)
    if (res.success && res.data) {
      saveUserSession(res.data.user, res.data.token)
      closeAuthModal()
      return { success: true }
    }

    return {
      success: false,
      message: res.message || "Gagal melakukan registrasi pengguna."
    }
  }

  const requestRegister = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string; debugOtp?: string }> => {
    return await requestRegisterApi(name, email, password)
  }

  const verifyRegister = async (
    email: string,
    code: string
  ): Promise<{ success: boolean; message?: string }> => {
    const res = await verifyRegisterApi(email, code)
    if (res.success && res.data) {
      saveUserSession(res.data.user, res.data.token)
      closeAuthModal()
      return { success: true }
    }
    return {
      success: false,
      message: res.message || "Kode verifikasi salah atau sudah kadaluarsa."
    }
  }

  const resendCode = async (
    email: string
  ): Promise<{ success: boolean; message?: string; debugOtp?: string }> => {
    return await resendCodeApi(email)
  }

  const loginWithFacebook = async (): Promise<boolean> => {
    const userData: User = {
      id: `fb_${Date.now()}`,
      name: "Pengguna Facebook",
      email: "user.facebook@example.com",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
      provider: "facebook"
    }

    saveUserSession(userData, "mock_fb_token")
    closeAuthModal()
    return true
  }

  const logout = () => {
    saveUserSession(null, null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!user,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        requestRegister,
        verifyRegister,
        resendCode,
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
