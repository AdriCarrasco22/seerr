import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User } from '../types/auth'
import api from '../services/api'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  loginAsDemo: (type: 'user' | 'admin') => Promise<void>
  updateProfile: (name: string, currentPassword?: string, newPassword?: string) => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // Al arrancar la app, si hay token guardado recuperamos el usuario
  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
    setUser(res.data.user)
  }

  const register = async (email: string, password: string, name: string) => {
    const res = await api.post('/auth/register', { email, password, name })
    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
    setUser(res.data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const loginAsDemo = async (type: 'user' | 'admin') => {
    const credentials = {
      user: { email: 'demo@seerr.com', password: 'demo1234' },
      admin: { email: 'admin@seerr.com', password: 'admin1234' },
    }
    const { email, password } = credentials[type]
    await login(email, password)
  }

  const updateProfile = async (name: string, currentPassword?: string, newPassword?: string) => {
    const res = await api.patch('/auth/profile', { name, currentPassword, newPassword })
    setUser(res.data)
  }


  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      loginAsDemo,
      updateProfile,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}