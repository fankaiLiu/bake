import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { GlobalErrorBoundary } from '@/components/GlobalErrorBoundary'
import { AuthProvider } from '@/contexts/AuthContext'
import '@/styles/globals.css'

// Root layout component that provides auth context for all routes
function RootComponent() {
  return (
    <GlobalErrorBoundary>
      <AuthProvider>
        <Outlet />
        <TanStackRouterDevtools />
      </AuthProvider>
    </GlobalErrorBoundary>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
