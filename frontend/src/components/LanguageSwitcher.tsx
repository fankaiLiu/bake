import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconLanguage, IconChevronDown } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'zh', name: t('Chinese'), flag: '🇨🇳' },
    { code: 'en', name: t('English'), flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn(
            "gap-2 h-9 px-3 text-sm font-medium",
            "border-border/50 hover:border-border",
            "bg-background/50 hover:bg-background",
            className
          )}
        >
          <IconLanguage className="h-4 w-4" />
          <span className="hidden sm:inline-flex items-center gap-1">
            {currentLanguage.flag}
            {currentLanguage.name}
          </span>
          <IconChevronDown className={cn(
            "h-3 w-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              i18n.language === language.code && "bg-accent text-accent-foreground"
            )}
          >
            <span className="text-base">{language.flag}</span>
            <span className="text-sm">{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
