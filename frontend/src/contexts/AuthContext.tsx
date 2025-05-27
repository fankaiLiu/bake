import { createContext, useContext, useState, ReactNode, useEffect } from "react"

/**
 * Bake 框架用户接口
 * AI/LLM 友好的用户数据结构
 */
interface User {
  id: string
  email: string
  name: string
  avatar: string
  role?: 'admin' | 'developer' | 'user'
  preferences?: {
    theme: 'light' | 'dark' | 'auto'
    language: string
  }
}

/**
 * Bake 框架认证上下文类型定义
 * 提供完整的认证功能接口
 */
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>(null as any)

/**
 * Bake 框架认证提供者组件
 * 
 * 功能特性:
 * - 用户认证状态管理
 * - 持久化登录状态 (localStorage)
 * - 模拟 API 调用 (可替换为真实 API)
 * - 错误处理和加载状态
 * - AI/LLM 友好的代码结构
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 组件挂载时检查本地存储的认证状态
  useEffect(() => {
    const checkAuthState = () => {
      try {
        const storedUser = localStorage.getItem('bake_user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error)
        localStorage.removeItem('bake_user')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthState()
  }, [])

  /**
   * 用户登录函数
   * 
   * @param email - 用户邮箱
   * @param password - 用户密码
   * @throws {Error} 登录失败时抛出错误
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    try {
      // 模拟 API 调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 简单的模拟认证逻辑
      // TODO: 替换为真实的 Bake API 认证
      if (!email || !password) {
        throw new Error('邮箱和密码不能为空')
      }
      
      if (password.length < 6) {
        throw new Error('密码长度至少为6位')
      }

      // 创建模拟用户数据
      const mockUser: User = {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0] || 'Bake User',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: 'developer',
        preferences: {
          theme: 'auto',
          language: 'zh-CN'
        }
      }
      
      // 保存用户状态
      setUser(mockUser)
      localStorage.setItem('bake_user', JSON.stringify(mockUser))
      
    } catch (error) {
      // 确保错误被正确抛出
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 用户登出函数
   * 清理用户状态和本地存储
   */
  const logout = () => {
    setUser(null)
    localStorage.removeItem('bake_user')
  }

  // 计算认证状态
  const isAuthenticated = !!user

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Bake 框架认证 Hook
 * 
 * 用于在组件中访问认证状态和功能
 * 
 * @returns {AuthContextType} 认证上下文对象
 * @throws {Error} 必须在 AuthProvider 内部使用
 * 
 * 使用示例:
 * ```tsx
 * const { user, login, logout, isAuthenticated } = useAuth()
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用')
  }
  return context
} 