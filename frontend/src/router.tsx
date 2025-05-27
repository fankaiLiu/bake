import { createBrowserRouter, Navigate, Outlet } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { ErrorBoundary } from "./components/ErrorBoundary"

// Root layout component that provides auth context for all routes
function RootLayout() {
  return (
      <Outlet />
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ],
  },
]) 