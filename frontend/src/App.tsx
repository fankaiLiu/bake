import "./styles/globals.css"
import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { GlobalErrorBoundary } from "./components/GlobalErrorBoundary"

const App = () => {
  return (
    <GlobalErrorBoundary>
      <RouterProvider router={router} />
    </GlobalErrorBoundary>
  )
}

export default App
