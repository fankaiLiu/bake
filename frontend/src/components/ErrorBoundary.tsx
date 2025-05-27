import { useRouteError, isRouteErrorResponse } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ErrorBoundary() {
  const error = useRouteError()

  let errorMessage: string
  let errorStatus: string | number = "Error"
  let isContextError = false

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText
    errorStatus = error.status
  } else if (error instanceof Error) {
    errorMessage = error.message
    // 检查是否为 Context 相关错误
    if (error.message.includes('useContext') || error.message.includes('AuthProvider')) {
      isContextError = true
      console.log(error);
      errorMessage = "应用程序初始化失败，请刷新页面重试"
    }
  } else if (typeof error === "string") {
    errorMessage = error
  } else {
    errorMessage = "Unknown error occurred"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">
            {errorStatus}
          </CardTitle>
          <CardDescription>
            Something went wrong
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            {errorMessage}
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
            <Button 
              className="flex-1"
              onClick={() => {
                if (isContextError) {
                  window.location.reload()
                } else {
                  window.location.href = "/dashboard"
                }
              }}
            >
              {isContextError ? "Refresh Page" : "Go Home"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 