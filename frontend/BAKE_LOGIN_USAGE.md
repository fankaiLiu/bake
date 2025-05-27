# Bake 登录组件使用指南

## 概览

更新后的 `LoginForm` 组件已经完全适配 Bake 框架，提供了 AI/LLM 友好的设计和完整的功能。

## 主要特性

### 🚀 核心功能
- **多种登录方式**: 支持邮箱/密码、Apple、Google 登录
- **状态管理**: 完整的加载状态、错误处理和用户反馈
- **自动路由**: 登录成功后自动重定向到目标页面
- **持久化**: 支持本地存储的登录状态持久化
- **响应式设计**: 适配移动端和桌面端

### 🎨 UI/UX 改进
- **Bake 品牌**: 使用 Bake 框架的品牌色彩（翠绿渐变）
- **中文本地化**: 完整的中文界面和提示信息
- **现代化设计**: 阴影、渐变、过渡效果
- **无障碍支持**: 语义化 HTML 和键盘导航

### 🤖 AI/LLM 友好特性
- **清晰的代码结构**: 模块化设计和详细注释
- **类型安全**: 完整的 TypeScript 类型定义
- **文档化**: JSDoc 注释和使用示例
- **错误处理**: 完善的错误边界和用户反馈

## 使用方法

### 基本用法

```tsx
import { LoginForm } from "@/components/login-form"

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
```

### 自定义样式

```tsx
<LoginForm className="max-w-lg mx-auto" />
```

### 在路由中使用

```tsx
// 在 router.tsx 中
{
  path: "/login",
  element: (
    <RootLayout>
      <LoginPage />
    </RootLayout>
  ),
  errorElement: <ErrorBoundary />,
}
```

## 认证上下文

### 使用认证状态

```tsx
import { useAuth } from "@/contexts/AuthContext"

function MyComponent() {
  const { user, isAuthenticated, logout, isLoading } = useAuth()

  if (isLoading) {
    return <div>加载中...</div>
  }

  if (!isAuthenticated) {
    return <div>请先登录</div>
  }

  return (
    <div>
      <h1>欢迎，{user?.name}!</h1>
      <button onClick={logout}>登出</button>
    </div>
  )
}
```

### 用户数据结构

```tsx
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
```

## 自定义配置

### 环境变量

创建 `.env.local` 文件：

```env
# API 端点
REACT_APP_API_URL=http://localhost:8080
REACT_APP_AUTH_ENDPOINT=/api/auth/login

# 第三方登录配置
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_APPLE_CLIENT_ID=your_apple_client_id
```

### API 集成

替换模拟登录逻辑：

```tsx
// 在 AuthContext.tsx 中
const login = async (email: string, password: string) => {
  setIsLoading(true)
  
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error('登录失败')
    }

    const userData = await response.json()
    setUser(userData.user)
    localStorage.setItem('bake_user', JSON.stringify(userData.user))
    localStorage.setItem('bake_token', userData.token)
    
  } catch (error) {
    throw error
  } finally {
    setIsLoading(false)
  }
}
```

## 第三方登录集成

### Google 登录

```tsx
// 安装依赖
npm install @google-cloud/local-auth google-auth-library

// 在 LoginForm.tsx 中更新
const handleSocialLogin = async (provider: 'apple' | 'google') => {
  if (provider === 'google') {
    try {
      // 使用 Google Auth Library
      const auth = new GoogleAuth({
        // 配置参数
      })
      
      // 处理 Google 登录流程
      const result = await auth.authenticate()
      // 处理登录结果
      
    } catch (error) {
      setError('Google 登录失败')
    }
  }
}
```

### Apple 登录

```tsx
// 安装依赖
npm install apple-auth

// 集成 Apple Sign In
const handleAppleLogin = async () => {
  try {
    // 使用 Apple Auth SDK
    const result = await AppleAuth.performRequest({
      requestedOperation: AppleAuth.Operation.LOGIN,
      requestedScopes: [AppleAuth.Scope.EMAIL, AppleAuth.Scope.FULL_NAME],
    })
    
    // 处理登录结果
    
  } catch (error) {
    setError('Apple 登录失败')
  }
}
```

## 安全建议

### 1. Token 管理
- 使用 HttpOnly cookies 存储敏感 token
- 实现 token 刷新机制
- 添加 CSRF 保护

### 2. 输入验证
- 前端和后端双重验证
- 防止 XSS 和注入攻击
- 实现速率限制

### 3. 密码策略
```tsx
const validatePassword = (password: string) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
}
```

## 测试

### 单元测试示例

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from './login-form'
import { AuthProvider } from '@/contexts/AuthContext'

test('renders login form', () => {
  render(
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
  
  expect(screen.getByText('欢迎回到 Bake')).toBeInTheDocument()
  expect(screen.getByLabelText('邮箱地址')).toBeInTheDocument()
  expect(screen.getByLabelText('密码')).toBeInTheDocument()
})

test('handles form submission', async () => {
  render(
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
  
  fireEvent.change(screen.getByLabelText('邮箱地址'), {
    target: { value: 'test@example.com' }
  })
  fireEvent.change(screen.getByLabelText('密码'), {
    target: { value: 'password123' }
  })
  
  fireEvent.click(screen.getByRole('button', { name: '登录' }))
  
  await waitFor(() => {
    expect(screen.getByText('登录中...')).toBeInTheDocument()
  })
})
```

## 故障排除

### 常见问题

1. **登录按钮无响应**
   - 检查表单验证：邮箱和密码都需要填写
   - 确认 AuthProvider 正确包装组件

2. **第三方登录失败**
   - 检查客户端 ID 配置
   - 确认回调 URL 设置正确

3. **样式问题**
   - 确认 Tailwind CSS 正确配置
   - 检查 CSS 变量是否定义

4. **TypeScript 错误**
   - 确认所有依赖项已安装
   - 检查类型定义文件

### 调试技巧

```tsx
// 启用调试模式
const DEBUG = process.env.NODE_ENV === 'development'

const login = async (email: string, password: string) => {
  if (DEBUG) {
    console.log('Login attempt:', { email, passwordLength: password.length })
  }
  
  // 登录逻辑...
}
```

## 贡献指南

如果您想为 Bake 登录组件贡献代码：

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add some amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 打开 Pull Request

## 许可证

本项目遵循 Bake 框架的许可证条款。
