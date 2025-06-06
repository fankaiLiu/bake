import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  loader: () => {
    // 检查用户是否已登录
    const storedUser = localStorage.getItem('bake-auth-user')
    if (storedUser) {
      throw redirect({
        to: '/dashboard'
      })
    } else {
      throw redirect({
        to: '/login'
      })
    }
  },
})
