# Frontend Bun + React Rules

## 前端技术栈
- **运行时**: Bun
- **框架**: React 18+ with TypeScript
- **路由**: TanStack Router
- **构建工具**: Rsbuild
- **样式**: Tailwind CSS + shadcn/ui
- **状态管理**: React Context + Hooks
- **国际化**: React i18n

## 代码风格

### TypeScript
- 始终使用 TypeScript，避免 `any` 类型
- 优先使用接口定义而不是类型别名
- 使用严格的 TypeScript 配置
- 为 props 和状态定义明确的类型

### React 组件
- 优先使用函数组件和 Hooks
- 使用 PascalCase 命名组件
- 单个文件单个组件（除非是紧密相关的小组件）
- 使用 TypeScript 接口定义 Props

### 文件组织
```
src/
  components/     # 可复用组件
    ui/          # shadcn/ui 组件
  contexts/      # React Context
  hooks/         # 自定义 Hooks
  pages/         # 页面组件
  routes/        # 路由定义
  lib/           # 工具函数
  styles/        # 全局样式
```

### 命名规范
- 组件文件：PascalCase (`UserProfile.tsx`)
- Hook 文件：kebab-case (`use-auth.ts`)
- 工具文件：kebab-case (`api-client.ts`)
- 常量：SCREAMING_SNAKE_CASE

## Bun 特定规则

### 包管理
- 使用 `bun add` 安装依赖
- 保持 `bun.lockb` 文件在版本控制中
- 优先使用 bun 内置的模块解析

### 脚本执行
- 使用 `bun run` 执行脚本
- 利用 bun 的快速启动特性
- 使用 bun 的内置测试运行器

## 性能优化

### 组件优化
- 使用 `React.memo` 包装纯组件
- 使用 `useMemo` 和 `useCallback` 优化昂贵计算
- 避免在渲染函数中创建新对象
- 实现适当的 key 属性

### 代码分割
- 使用动态导入进行路由级别的代码分割
- 延迟加载非关键组件
- 优化打包体积

### 状态管理
- 将状态尽可能靠近使用它的组件
- 使用 Context 进行全局状态管理
- 避免不必要的重新渲染

## 用户体验

### 加载状态
- 为异步操作提供加载指示器
- 实现骨架屏加载
- 处理错误状态

### 表单处理
- 实现客户端验证
- 提供实时反馈
- 处理表单提交状态

### 响应式设计
- 使用 Tailwind CSS 的响应式类
- 测试不同屏幕尺寸
- 考虑移动端体验

## 国际化

### i18n 实践
- 所有用户可见文本都要国际化
- 使用命名空间组织翻译
- 支持动态语言切换
- 考虑 RTL 语言支持

## 安全性

### 前端安全
- 验证用户输入
- 安全地处理敏感数据
- 实现 CSP 策略
- 避免 XSS 攻击

### 认证和授权
- 安全地存储认证令牌
- 实现路由保护
- 处理认证过期

## 测试

### 测试策略
- 为关键组件编写单元测试
- 使用 React Testing Library
- 测试用户交互
- 模拟 API 调用

## 可访问性

### A11y 规范
- 使用语义化 HTML
- 提供适当的 ARIA 属性
- 确保键盘导航
- 测试屏幕阅读器兼容性
