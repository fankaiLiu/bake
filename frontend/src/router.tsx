import { createBrowserRouter, Navigate } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { DashboardPage } from "./pages/DashboardPage"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { AuthProvider } from "./contexts/AuthContext"

// Root layout component that provides auth context
function RootLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout><Navigate to="/dashboard" replace /></RootLayout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    element: <RootLayout><LoginPage /></RootLayout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: (
      <RootLayout>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </RootLayout>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "*",
    element: <RootLayout><Navigate to="/dashboard" replace /></RootLayout>,
    errorElement: <ErrorBoundary />,
  },
]) 