# React Components Rules

## 组件设计原则

### 组件分类
- **UI 组件**: 无状态的展示组件（来自 shadcn/ui）
- **业务组件**: 包含业务逻辑的组件
- **布局组件**: 页面布局和结构组件
- **功能组件**: 提供特定功能的组件

### 组件命名
- 使用 PascalCase
- 名称要描述组件的功能
- 避免缩写和模糊命名

## 组件结构

### 文件组织
```tsx
// 导入顺序
import React from 'react'           // React 相关
import { useState } from 'react'    // React hooks
import { Button } from '@/components/ui/button'  // UI 组件
import { useAuth } from '@/hooks/use-auth'       // 自定义 hooks
import { cn } from '@/lib/utils'    // 工具函数
import type { User } from '@/types' // 类型定义

// 类型定义
interface ComponentProps {
  // props 定义
}

// 组件实现
export function Component(props: ComponentProps) {
  // 组件逻辑
}
```

### Props 设计
- 使用 TypeScript 接口定义 Props
- 提供默认值
- 使用解构赋值
- 保持 Props 简洁

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  children,
  onClick 
}: ButtonProps) {
  // 组件实现
}
```

## Hooks 使用

### 状态管理
- 使用 `useState` 管理本地状态
- 使用 `useReducer` 管理复杂状态
- 将状态尽可能靠近使用它的组件

### 副作用处理
- 使用 `useEffect` 处理副作用
- 正确设置依赖数组
- 清理副作用（取消订阅、清除定时器等）

### 性能优化
- 使用 `useMemo` 缓存昂贵计算
- 使用 `useCallback` 缓存函数引用
- 使用 `React.memo` 包装纯组件

## 样式处理

### Tailwind CSS
- 使用 Tailwind 工具类
- 创建自定义组件类
- 使用 `cn` 工具函数合并类名

```tsx
import { cn } from '@/lib/utils'

export function Button({ className, variant, ...props }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md font-medium',
        variant === 'primary' && 'bg-blue-600 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-900',
        className
      )}
      {...props}
    />
  )
}
```

### 响应式设计
- 使用 Tailwind 的响应式前缀
- 考虑移动端优先的设计
- 测试不同屏幕尺寸

## 表单处理

### 表单组件
- 实现受控组件
- 提供验证和错误处理
- 使用适当的输入类型

```tsx
interface FormInputProps {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
}

export function FormInput({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  required 
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full px-3 py-2 border rounded-md',
          error ? 'border-red-500' : 'border-gray-300'
        )}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
```

## 错误处理

### 错误边界
- 使用 Error Boundary 捕获组件错误
- 提供优雅的错误界面
- 记录错误信息

### 异步错误
- 处理 API 调用错误
- 提供重试机制
- 显示用户友好的错误信息

## 可访问性

### ARIA 属性
- 使用适当的 ARIA 标签
- 提供 alt 文本
- 确保键盘导航

### 语义化 HTML
- 使用正确的 HTML 元素
- 提供合适的标题层次
- 使用 landmark 元素

## 国际化

### 文本国际化
- 使用 i18n 函数包装所有用户可见文本
- 支持动态内容的国际化
- 考虑文本长度变化

```tsx
import { useTranslation } from 'react-i18next'

export function WelcomeMessage({ userName }: { userName: string }) {
  const { t } = useTranslation()
  
  return (
    <h1>{t('welcome.message', { name: userName })}</h1>
  )
}
```