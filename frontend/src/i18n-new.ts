import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 支持的语言列表
const SUPPORTED_LANGUAGES = ['en', 'zh'] as const;

// 动态加载翻译资源
const loadResources = async (): Promise<Record<string, any>> => {
  const resources: Record<string, any> = {};
  
  // 并行加载所有语言文件
  const loadPromises = SUPPORTED_LANGUAGES.map(async (lang) => {
    try {
      // 从 /locales 目录通过 fetch 加载翻译文件
      const response = await fetch(`/locales/${lang}.json`);
      if (response.ok) {
        const data = await response.json();
        return { lang, data };
      } else {
        console.warn(`Failed to fetch translation for language: ${lang} (${response.status})`);
        return null;
      }
    } catch (error) {
      console.warn(`Failed to load translation for language: ${lang}`, error);
      return null;
    }
  });

  // 等待所有加载完成
  const results = await Promise.all(loadPromises);
  
  // 处理加载结果
  results.forEach((result) => {
    if (result) {
      resources[result.lang] = result.data;
    }
  });
  
  return resources;
};

// 初始化 i18n
const initI18n = async (): Promise<void> => {
  try {
    const resources = await loadResources();
    
    // 检查是否成功加载了资源
    const loadedLanguages = Object.keys(resources);
    if (loadedLanguages.length === 0) {
      console.error('No translation resources loaded! Check if locales files are accessible.');
      // 可以在这里添加一些基本的备用翻译
      throw new Error('Failed to load any translation resources');
    }
    
    console.log(`Successfully loaded translations for: ${loadedLanguages.join(', ')}`);
    
    // 获取用户首选语言
    const preferredLang = localStorage.getItem('preferred-language') || 'zh';
    const initialLang = loadedLanguages.includes(preferredLang) ? preferredLang : loadedLanguages[0];
    
    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: initialLang,
        fallbackLng: 'en', // 备用语言
        
        interpolation: {
          escapeValue: false // React 已经安全处理了 XSS
        },
        
        // 调试模式（生产环境可设为 false）
        debug: process.env.NODE_ENV === 'development',
        
        // 其他配置
        react: {
          useSuspense: false // 禁用 Suspense，避免在异步加载时出现问题
        }
      });
      
    console.log(`i18n initialized with language: ${initialLang}`);
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
    // 即使失败也要初始化一个基本的 i18n 实例
    await i18n
      .use(initReactI18next)
      .init({
        resources: {},
        lng: 'zh',
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false
        },
        react: {
          useSuspense: false
        }
      });
  }
};

// 立即初始化
initI18n();

export default i18n;
