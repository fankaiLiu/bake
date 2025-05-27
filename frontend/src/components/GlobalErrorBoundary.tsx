import React, { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * 全局错误边界组件
 * 用于捕获 React 应用中的 JavaScript 错误，特别是 Context 相关错误
 */
export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Global Error Boundary caught an error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  private handleRefresh = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      const isContextError = this.state.error?.message.includes('useContext') || 
                            this.state.error?.message.includes('AuthProvider') ||
                            this.state.error?.message.includes('Context')

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-red-600">
                应用程序错误
              </CardTitle>
              <CardDescription>
                {isContextError ? "应用程序初始化失败" : "Something went wrong"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {isContextError 
                  ? "应用程序在初始化时遇到了问题，请刷新页面重试"
                  : this.state.error?.message || "发生了未知错误"
                }
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={this.handleReset}
                >
                  重试
                </Button>
                <Button 
                  className="flex-1"
                  onClick={this.handleRefresh}
                >
                  刷新页面
                </Button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                  <summary className="cursor-pointer font-medium">错误详情 (开发模式)</summary>
                  <pre className="mt-2 whitespace-pre-wrap text-red-600">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
