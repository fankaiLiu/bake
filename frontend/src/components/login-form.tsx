import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { cn } from "@/lib/utils"
import { 
  IconAlertTriangle, 
  IconLoader2, 
  IconBrandApple, 
  IconBrandGoogle 
} from "@tabler/icons-react"

/**
 * BakeLoginForm - AI/LLM 友好的登录表单组件
 * 
 * 特性:
 * - 集成 Bake 框架认证系统
 * - 支持多种登录方式 (邮箱/密码, Apple, Google)
 * - 完整的状态管理和错误处理
 * - 响应式设计和加载状态
 * - 自动路由重定向
 * - 多语言支持 (中文/英文)
 * 
 * 用法:
 * <LoginForm className="custom-styles" />
 */
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();
  
  // 状态管理
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState<string | null>(null)

  /**
   * 处理表单输入变化
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    // 清除错误状态
    if (error) setError(null)
  }

  /**
   * 处理邮箱密码登录
   */
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (!formData.email || !formData.password) {
        throw new Error('邮箱和密码不能为空')
      }
      
      if (formData.password.length < 6) {
        throw new Error('密码至少需要6位字符')
      }

      await login(formData.email, formData.password)
      // 登录成功后会自动跳转到 dashboard
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请检查邮箱和密码')
    }
  }

  /**
   * 处理第三方登录 (Apple/Google)
   * TODO: 集成真实的第三方认证 API
   */
  const handleSocialLogin = async (provider: 'apple' | 'google') => {
    setError(null)

    try {
      // 模拟第三方登录流程
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // TODO: 替换为真实的第三方认证逻辑
      console.log(`Initiating ${provider} login...`)
      
      // 暂时显示提示信息
      setError(`${provider} 登录功能正在开发中`)
    } catch (err) {
      setError(`${provider} 登录失败`)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* 语言切换器 */}
      <div className="flex justify-end">
        <LanguageSwitcher />
      </div>
      
      <Card className="shadow-lg border-border/50">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            {t('Welcome back to Bake')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('Sign in with your account to start your AI-friendly development journey')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 错误提示 */}
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-md">
              <IconAlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            {/* 第三方登录选项 */}
            <div className="grid gap-3">
              <Button 
                type="button"
                variant="outline" 
                className="w-full h-11 relative"
                onClick={() => handleSocialLogin('apple')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <IconBrandApple className="h-5 w-5" />
                )}
                <span className="ml-2">{t('Sign in with Apple')}</span>
              </Button>
              
              <Button 
                type="button"
                variant="outline" 
                className="w-full h-11 relative"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <IconBrandGoogle className="h-5 w-5" />
                )}
                <span className="ml-2">{t('Sign in with Google')}</span>
              </Button>
            </div>

            {/* 分隔线 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('Or sign in with email')}
                </span>
              </div>
            </div>

            {/* 邮箱密码登录表单 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t('Email address')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@bake.dev"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t('Password')}
                  </Label>
                  <a
                    href="#"
                    className="text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
                  >
                    {t('Forgot password?')}
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder={t('Password')}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-medium transition-all duration-200"
                disabled={isLoading || !formData.email || !formData.password}
              >
                {isLoading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('Loading...')}
                  </>
                ) : (
                  t('Sign in')
                )}
              </Button>
            </div>

            {/* 注册链接 */}
            <div className="text-center text-sm text-muted-foreground">
              {t("Don't have an account?")}{" "}
              <a 
                href="#" 
                className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium transition-colors"
              >
                {t('Sign up now')}
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* 服务条款和隐私政策 */}
      <div className="text-center text-xs text-muted-foreground">
        {t('By continuing, you agree to our')}{" "}
        <a 
          href="#" 
          className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        >
          {t('Terms of Service')}
        </a>{" "}
        {t('and')}{" "}
        <a 
          href="#" 
          className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        >
          {t('Privacy Policy')}
        </a>
        。
      </div>
    </div>
  )
}
