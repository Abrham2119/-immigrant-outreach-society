import { Language, LANGUAGES, LanguageTranslations, SupportedLanguage } from '@/domain/translation/entities/translation.entity';
import { TranslationRepository } from '@/domain/translation/repositories/translation.repository';
import { TranslationDataSource } from '../datasources/translation.datasource';

export class TranslationRepositoryImpl implements TranslationRepository {
  private cache: Map<SupportedLanguage, LanguageTranslations> = new Map();
  private isPreloaded = false;

  constructor(private dataSource: TranslationDataSource) {}

  async getTranslations(language: SupportedLanguage): Promise<LanguageTranslations | null> {
    // Check cache first
    if (this.cache.has(language)) {
      return this.cache.get(language)!;    }

    try {
      const translations = await this.dataSource.fetchTranslations(language);
      const normalizedTranslations = this.normalizeTranslations(translations);
      this.cache.set(language, normalizedTranslations);
      return normalizedTranslations;
    } catch (error) {
      console.error(`Failed to load translations for ${language}:`, error);
      
      // Fallback to English
      if (language !== 'en') {
        return this.getTranslations('en' as SupportedLanguage);
      }
      
      return null;
    }
  }

  async setCurrentLanguage(language: SupportedLanguage): Promise<void> {
    await this.dataSource.storeLanguage(language);
    
    // Clear cache to force reload
    this.cache.delete(language);
  }

  async getCurrentLanguage(): Promise<SupportedLanguage> {
    return this.dataSource.getStoredLanguage();
  }

  async getAvailableLanguages(): Promise<Language[]> {
    return LANGUAGES;
  }

  async getLanguageByCode(code: SupportedLanguage): Promise<Language | undefined> {
    return LANGUAGES.find(lang => lang.code === code);
  }

  async preloadLanguages(): Promise<void> {
    if (this.isPreloaded) return;
    
    try {
      // Preload English translations by default
      await this.getTranslations('en' as SupportedLanguage);
      
      // Optionally preload other languages in background
      this.preloadOtherLanguages();
      
      this.isPreloaded = true;
    } catch (error) {
      console.error('Failed to preload languages:', error);
    }
  }

  private normalizeTranslations(translations: any): LanguageTranslations {
    const normalized: LanguageTranslations = {};
    
    Object.keys(translations).forEach(key => {
      const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
      normalized[normalizedKey] = translations[key];
    });

    return normalized;
  }

  private async preloadOtherLanguages(): Promise<void> {
    // Preload other languages in background
    const languagesToPreload = LANGUAGES.filter(lang => lang.code !== 'en');
    
    languagesToPreload.forEach(async (language) => {
      try {
        await this.getTranslations(language.code);
      } catch (error) {
        // Silent fail for background preloading
      }
    });
  }
}