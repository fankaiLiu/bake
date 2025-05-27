import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleProvider } from '@douyinfe/semi-ui';

// 导入Semi-UI的语言包
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import en_US from '@douyinfe/semi-ui/lib/es/locale/source/en_US';

// Semi-UI语言包映射
const semiLocaleMap = {
  zh: zh_CN,
  en: en_US,
} as const;

type SupportedLanguage = keyof typeof semiLocaleMap;

interface SemiLocaleContextProps {
  children: ReactNode;
}

/**
 * Semi-UI国际化上下文提供者
 * 根据react-i18next的当前语言自动切换Semi-UI组件的语言包
 */
export function SemiLocaleProvider({ children }: SemiLocaleContextProps) {
  const { i18n } = useTranslation();
  
  // 获取当前语言对应的Semi-UI语言包
  const currentLanguage = i18n.language as SupportedLanguage;
  const locale = semiLocaleMap[currentLanguage] || semiLocaleMap.zh;

  return (
    <LocaleProvider locale={locale}>
      {children}
    </LocaleProvider>
  );
}

// 导出默认值以便其他地方使用
export const DEFAULT_SEMI_LOCALE = zh_CN;
export { semiLocaleMap };