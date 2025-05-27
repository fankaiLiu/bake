import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 翻译资源
const resources = {
  en: {
    translation: {
      // 登录页面
      'Welcome back to Bake': 'Welcome back to Bake',
      'Sign in with your account to start your AI-friendly development journey': 'Sign in with your account to start your AI-friendly development journey',
      'Sign in with Apple': 'Sign in with Apple',
      'Sign in with Google': 'Sign in with Google',
      'Or sign in with email': 'Or sign in with email',
      'Email address': 'Email address',
      'Password': 'Password',
      'Forgot password?': 'Forgot password?',
      'Sign in': 'Sign in',
      'Loading...': 'Loading...',
      'Don\'t have an account?': 'Don\'t have an account?',
      'Sign up now': 'Sign up now',
      'By continuing, you agree to our': 'By continuing, you agree to our',
      'Terms of Service': 'Terms of Service',
      'and': 'and',
      'Privacy Policy': 'Privacy Policy',
      
      // 错误信息
      'Email and password cannot be empty': 'Email and password cannot be empty',
      'Password must be at least 6 characters long': 'Password must be at least 6 characters long',
      'Login successful': 'Login successful',
      'Login demo completed': 'Login demo completed',
      'Login failed, please check your email and password': 'Login failed, please check your email and password',
      'apple login is under development': 'Apple login is under development',
      'google login is under development': 'Google login is under development',
      'apple login failed': 'Apple login failed',
      'google login failed': 'Google login failed',
      
      // 语言切换
      'Language': 'Language',
      'Chinese': '中文',
      'English': 'English'
    }
  },
  zh: {
    translation: {
      // 登录页面
      'Welcome back to Bake': '欢迎回到 Bake',
      'Sign in with your account to start your AI-friendly development journey': '使用您的账户登录，开始 AI 友好的开发之旅',
      'Sign in with Apple': '使用 Apple 登录',
      'Sign in with Google': '使用 Google 登录',
      'Or sign in with email': '或使用邮箱登录',
      'Email address': '邮箱地址',
      'Password': '密码',
      'Forgot password?': '忘记密码？',
      'Sign in': '登录',
      'Loading...': '加载中...',
      'Don\'t have an account?': '还没有账户？',
      'Sign up now': '立即注册',
      'By continuing, you agree to our': '点击继续即表示您同意我们的',
      'Terms of Service': '服务条款',
      'and': '和',
      'Privacy Policy': '隐私政策',
      
      // 错误信息
      'Email and password cannot be empty': '邮箱和密码不能为空',
      'Password must be at least 6 characters long': '密码长度至少为6位',
      'Login successful': '登录成功',
      'Login demo completed': '登录功能演示完成',
      'Login failed, please check your email and password': '登录失败，请检查邮箱和密码',
      'apple login is under development': 'Apple 登录功能正在开发中',
      'google login is under development': 'Google 登录功能正在开发中',
      'apple login failed': 'Apple 登录失败',
      'google login failed': 'Google 登录失败',
      
      // 语言切换
      'Language': '语言',
      'Chinese': '中文',
      'English': 'English'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('preferred-language') || 'zh', // 从localStorage读取首选语言，默认为中文
    fallbackLng: 'en', // 备用语言
    
    interpolation: {
      escapeValue: false // React 已经安全处理了 XSS
    },
    
    // 调试模式（生产环境可设为 false）
    debug: process.env.NODE_ENV === 'development'
  });

export default i18n;
