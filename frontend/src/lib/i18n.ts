import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// 直接导入翻译资源
const enTranslations = {
  // Auth
  auth: {
    login: {
      title: "Welcome to Bake",
      subtitle: "Sign in to your account and start your AI-friendly development journey",
      email: "Email",
      password: "Password",
      email_placeholder: "example@bake.dev",
      password_placeholder: "Enter your password",
      submit: "Sign In",
      apple_login: "Sign in with Apple",
      google_login: "Sign in with Google",
      or_email: "or sign in with email",
      no_account: "Don't have an account?",
      register: "Sign up now",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      terms_notice: "By continuing, you agree to our {{terms}} and {{privacy}}.",
      errors: {
        invalid_credentials: "Invalid email or password",
        login_failed: "Login failed, please check your email and password",
        apple_development: "Apple login is under development",
        google_development: "Google login is under development",
        apple_failed: "Apple login failed",
        google_failed: "Google login failed"
      }
    }
  },
  // Common
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    language: "Language",
    switch_language: "Switch Language"
  }
}

const zhCNTranslations = {
  // Auth
  auth: {
    login: {
      title: "欢迎回到 Bake",
      subtitle: "使用您的账户登录，开始 AI 友好的开发之旅",
      email: "邮箱地址",
      password: "密码",
      email_placeholder: "example@bake.dev",
      password_placeholder: "请输入密码",
      submit: "登录",
      apple_login: "使用 Apple 登录",
      google_login: "使用 Google 登录",
      or_email: "或使用邮箱登录",
      no_account: "还没有账户？",
      register: "立即注册",
      terms: "服务条款",
      privacy: "隐私政策",
      terms_notice: "点击继续即表示您同意我们的 {{terms}} 和 {{privacy}}。",
      errors: {
        invalid_credentials: "邮箱或密码错误",
        login_failed: "登录失败，请检查邮箱和密码",
        apple_development: "Apple 登录功能正在开发中",
        google_development: "Google 登录功能正在开发中",
        apple_failed: "Apple 登录失败",
        google_failed: "Google 登录失败"
      }
    }
  },
  // Common
  common: {
    loading: "加载中...",
    error: "错误",
    success: "成功",
    cancel: "取消",
    confirm: "确认",
    save: "保存",
    delete: "删除",
    edit: "编辑",
    add: "添加",
    search: "搜索",
    language: "语言",
    switch_language: "切换语言"
  }
}

// 初始化 i18n
export const initI18n = async () => {
  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: enTranslations },
        'zh-CN': { translation: zhCNTranslations },
      },
      lng: localStorage.getItem('language') || 'zh-CN',
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false,
      },
      // 命名空间配置
      defaultNS: 'translation',
      ns: ['translation'],
    })

  return i18n
}

export default i18n
