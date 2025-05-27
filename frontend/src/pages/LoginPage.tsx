import { LoginForm } from "@/components/login-form"

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6">
        <LoginForm />
      </div>
    </div>
  )
} 