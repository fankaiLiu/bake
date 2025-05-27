import { useAuth } from '@/contexts/AuthContext'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  IconUser, 
  IconMail, 
  IconSettings, 
  IconLogout,
  IconDashboard,
  IconChartBar,
  IconUsers,
  IconBell
} from '@tabler/icons-react'

export function DashboardPage() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <IconDashboard className="h-5 w-5" />
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <IconBell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <IconLogout className="h-4 w-4 mr-2" />
              退出登录
            </Button>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {/* 用户信息卡片 */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      欢迎回来，{user.name}！
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? '管理员' : '用户'}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <IconMail className="h-4 w-4" />
                      {user.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  您已成功登录到 Bake 开发平台。这是一个演示的 dashboard 页面，展示了完整的登录验证流程。
                </p>
              </CardContent>
            </Card>

            {/* 快速操作 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconSettings className="h-5 w-5" />
                  快速操作
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <IconUser className="h-4 w-4 mr-2" />
                  个人设置
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <IconSettings className="h-4 w-4 mr-2" />
                  系统配置
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <IconBell className="h-4 w-4 mr-2" />
                  通知中心
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 统计卡片 */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总用户数</CardTitle>
                <IconUsers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,354</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% 较上月
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
                <IconChartBar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +15.3% 较上月
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">项目数量</CardTitle>
                <IconDashboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">456</div>
                <p className="text-xs text-muted-foreground">
                  +12.5% 较上月
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">系统状态</CardTitle>
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">正常</div>
                <p className="text-xs text-muted-foreground">
                  所有服务运行正常
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 最近活动 */}
          <Card>
            <CardHeader>
              <CardTitle>最近活动</CardTitle>
              <CardDescription>
                查看系统的最新动态和用户活动
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <IconUser className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">新用户注册</p>
                    <p className="text-xs text-muted-foreground">用户 demo@bake.dev 刚刚注册了账户</p>
                  </div>
                  <div className="text-xs text-muted-foreground">2分钟前</div>
                </div>
                
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <IconSettings className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">系统配置更新</p>
                    <p className="text-xs text-muted-foreground">管理员更新了邮件服务配置</p>
                  </div>
                  <div className="text-xs text-muted-foreground">5分钟前</div>
                </div>
                
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <IconDashboard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">新项目创建</p>
                    <p className="text-xs text-muted-foreground">项目 "AI助手开发" 已成功创建</p>
                  </div>
                  <div className="text-xs text-muted-foreground">10分钟前</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
