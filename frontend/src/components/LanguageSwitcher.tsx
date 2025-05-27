import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from '@douyinfe/semi-ui';
import { IconLanguage } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();

  const languages = [
    { value: 'zh', label: t('Chinese'), flag: '🇨🇳' },
    { value: 'en', label: t('English'), flag: '🇺🇸' }
  ];

  const handleLanguageChange = (value: string | number | any[] | Record<string, any> | undefined) => {
    if (typeof value === 'string') {
      // 切换react-i18next语言，Semi-UI会通过SemiLocaleProvider自动跟随切换
      i18n.changeLanguage(value);
      
      // 可选：保存语言设置到localStorage
      localStorage.setItem('preferred-language', value);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <IconLanguage className="h-4 w-4" />
      <Select
        value={i18n.language}
        placeholder="选择语言"
        style={{ width: 120 }}
        optionList={languages.map(lang => ({
          value: lang.value,
          label: (
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </div>
          )
        }))}
        onChange={handleLanguageChange}
      />
    </div>
  );
}
