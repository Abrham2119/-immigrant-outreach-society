import { LanguageTranslations, SupportedLanguage } from "@/domain/translation/entities/translation.entity";

export interface TranslationDataSource {
  fetchTranslations(language: SupportedLanguage): Promise<LanguageTranslations>;
  getStoredLanguage(): Promise<SupportedLanguage>;
  storeLanguage(language: SupportedLanguage): Promise<void>;
}