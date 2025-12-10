import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/domain/translation/entities/translation.entity';
import { TranslationDataSource } from './translation.datasource';

export class LocalStorageTranslationDataSource implements TranslationDataSource {
  private readonly LANGUAGE_STORAGE_KEY = 'app_language';
  private readonly DEFAULT_LANGUAGE: SupportedLanguage = SUPPORTED_LANGUAGES.ENGLISH;

  async fetchTranslations(language: SupportedLanguage): Promise<{ [key: string]: string }> {
    try {
      // Dynamic import based on language
      const module = await import(`@/data/dictionaries/${language}.ts`);
      return module.default || module;
    } catch (error) {
      console.warn(`Translations not found for ${language}, falling back to English`);
      const module = await import(`@/data/dictionaries/en`);
      return module.default || module;
    }
  }

  async getStoredLanguage(): Promise<SupportedLanguage> {
    if (typeof window === 'undefined') return this.DEFAULT_LANGUAGE;
    
    try {
      const stored = localStorage.getItem(this.LANGUAGE_STORAGE_KEY);
      if (stored && Object.values(SUPPORTED_LANGUAGES).includes(stored as SupportedLanguage)) {
        return stored as SupportedLanguage;
      }
    } catch (error) {
      console.error('Error reading language from localStorage:', error);
    }
    
    return this.DEFAULT_LANGUAGE;
  }

  async storeLanguage(language: SupportedLanguage): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.LANGUAGE_STORAGE_KEY, language);
      
      // Update HTML lang attribute
      document.documentElement.lang = language;
      
      // Update HTML direction for RTL languages
      const isRTL = language === 'ar';
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    } catch (error) {
      console.error('Error storing language to localStorage:', error);
    }
  }
}