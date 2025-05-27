import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { GlobalErrorBoundary } from '@/components/GlobalErrorBoundary'
import '@/styles/globals.css'

// Root layout component that provides auth context for all routes
function RootComponent() {
  return (
    <GlobalErrorBoundary>
      <Outlet />
      <TanStackRouterDevtools />
    </GlobalErrorBoundary>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
