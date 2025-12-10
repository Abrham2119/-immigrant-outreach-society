import { LanguageTranslations, SupportedLanguage } from '../entities/translation.entity';
import { TranslationRepository } from '../repositories/translation.repository';

export class GetTranslationsUseCase {
  constructor(private translationRepository: TranslationRepository) {}

  async execute(language: SupportedLanguage): Promise<LanguageTranslations | null> {
    return this.translationRepository.getTranslations(language);
  }
}