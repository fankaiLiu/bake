import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardPage } from '@/pages/DashboardPage'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    // 检查用户是否已登录
    const storedUser = localStorage.getItem('bake-auth-user')
    if (!storedUser) {
      throw redirect({
        to: '/login'
      })
    }
  },
  component: DashboardPage,
})
