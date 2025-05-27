import "./styles/globals.css"
import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { useEffect, useState } from "react"
import { initI18n } from "./lib/i18n"
import { GlobalErrorBoundary } from "./components/GlobalErrorBoundary"

const App = () => {
  const [i18nReady, setI18nReady] = useState(false)

  useEffect(() => {
    initI18n().then(() => {
      setI18nReady(true)
    })
  }, [])

  if (!i18nReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <GlobalErrorBoundary>
      <RouterProvider router={router} />
    </GlobalErrorBoundary>
  )
}

export default App
