"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { TranslationRepositoryImpl } from '@/data/translation/repositories/translation.repository.impl';
import { LocalStorageTranslationDataSource } from '@/data/translation/datasources/local-storage.datasource';
import { GetTranslationsUseCase } from '@/domain/translation/usecases/get-translations.usecase';
import { ChangeLanguageUseCase } from '@/domain/translation/usecases/change-language.usecase';
import { LanguageTranslations, SupportedLanguage } from '@/domain/translation/entities/translation.entity';

interface TranslationContextType {
  translations: LanguageTranslations | null;
  currentLanguage: SupportedLanguage;
  isLoading: boolean;
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  t: (key: string, defaultValue?: string) => string;
  getAvailableLanguages: () => Promise<Array<{ code: string; name: string; flag: string }>>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Initialize repository and use cases
const dataSource = new LocalStorageTranslationDataSource();
const repository = new TranslationRepositoryImpl(dataSource);
const getTranslationsUseCase = new GetTranslationsUseCase(repository);
const changeLanguageUseCase = new ChangeLanguageUseCase(repository);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [translations, setTranslations] = useState<LanguageTranslations | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeTranslations();
  }, []);

  const initializeTranslations = async () => {
    setIsLoading(true);
    try {
      const lang = await repository.getCurrentLanguage();
      setCurrentLanguage(lang);
      
      const trans = await getTranslationsUseCase.execute(lang);
      setTranslations(trans);
    } catch (error) {
      console.error('Failed to initialize translations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (language: SupportedLanguage) => {
    setIsLoading(true);
    try {
      await changeLanguageUseCase.execute(language);
      const trans = await getTranslationsUseCase.execute(language);
      
      setCurrentLanguage(language);
      setTranslations(trans);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const t = (key: string, defaultValue: string = ''): string => {
    if (!translations) return defaultValue;
    
    const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
    return translations[normalizedKey] || defaultValue || key;
  };

  const getAvailableLanguages = async () => {
    return repository.getAvailableLanguages();
  };

  return (
    <TranslationContext.Provider
      value={{
        translations,
        currentLanguage,
        isLoading,
        changeLanguage,
        t,
        getAvailableLanguages,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};