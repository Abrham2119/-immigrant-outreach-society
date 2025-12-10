import { LanguageTranslations } from '@/domain/translation/entities/translation.entity';

export class TranslationHelper {
  static normalizeKey(key: string): string {
    return key.toLowerCase().replace(/\s+/g, '');
  }

  static getTranslation(
    translations: LanguageTranslations | null,
    key: string,
    defaultValue: string = ''
  ): string {
    if (!translations) return defaultValue;
    
    const normalizedKey = this.normalizeKey(key);
    return translations[normalizedKey] || defaultValue || key;
  }

  static hasTranslation(
    translations: LanguageTranslations | null,
    key: string
  ): boolean {
    if (!translations) return false;
    
    const normalizedKey = this.normalizeKey(key);
    return normalizedKey in translations;
  }
}