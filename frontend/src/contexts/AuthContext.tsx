import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from '@tanstack/react-router'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock 用户数据
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@bake.dev',
    password: 'password123',
    name: 'Admin User',
    avatar: '/avatars/admin.jpg',
    role: 'admin' as const
  },
  {
    id: '2',
    email: 'user@bake.dev',
    password: 'password123',
    name: 'Regular User',
    avatar: '/avatars/user.jpg',
    role: 'user' as const
  },
  {
    id: '3',
    email: 'demo@bake.dev',
    password: '123456',
    name: 'Demo User',
    avatar: '/avatars/demo.jpg',
    role: 'user' as const
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 检查本地存储中的用户信息
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('bake-auth-user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('bake-auth-user')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password)
    
    if (!mockUser) {
      setIsLoading(false)
      throw new Error('邮箱或密码错误')
    }

    const { password: _, ...userWithoutPassword } = mockUser
    setUser(userWithoutPassword)
    localStorage.setItem('bake-auth-user', JSON.stringify(userWithoutPassword))
    setIsLoading(false)
    
    // 登录成功后跳转到 dashboard
    router.navigate({ to: '/dashboard' })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('bake-auth-user')
    router.navigate({ to: '/login' })
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
