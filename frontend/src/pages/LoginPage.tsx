import { LoginForm } from "@/components/login-form"
import { Pagination, DatePicker, Button as SemiButton, Space } from '@douyinfe/semi-ui';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6">
        <LoginForm />
        
        {/* Semi-UI国际化演示组件 */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
            Semi-UI 国际化演示
          </h3>
          <Space vertical className="w-full">
            <Pagination 
              total={100} 
              showTotal 
              showSizeChanger 
              size="small"
            />
            <DatePicker placeholder="请选择日期" />
            <SemiButton theme="solid" type="primary" size="small">
              Semi-UI 按钮
            </SemiButton>
          </Space>
        </div>
      </div>
    </div>
  )
} 