import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; // Import i18n instance

export type Language = 'en' | 'hi';

// Mock or basic translations interface to satisfy type checker if needed,
// but effectively unused as we delegate to i18next
interface Translations {
  [key: string]: any;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t: i18nT, i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>((i18n.language as Language) || 'en');
  // We keep translations state empty or basic as consumers should use `t`
  const [translations] = useState<Translations>({});

  // Sync state when i18n language changes
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setLanguageState(lng as Language);
    };
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
  };

  // Bridge t function
  const t = (key: string): string => {
    return i18nT(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
