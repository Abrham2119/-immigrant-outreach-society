import { Language, LanguageTranslations, SupportedLanguage } from "../entities/translation.entity";

export interface TranslationRepository {
  getTranslations(language: SupportedLanguage): Promise<LanguageTranslations | null>;
  setCurrentLanguage(language: SupportedLanguage): Promise<void>;
  getCurrentLanguage(): Promise<SupportedLanguage>;
  getAvailableLanguages(): Promise<Language[]>;
  getLanguageByCode(code: SupportedLanguage): Promise<Language | undefined>;
  preloadLanguages(): Promise<void>;
}