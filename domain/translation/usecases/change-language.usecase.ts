
import { SupportedLanguage } from '../entities/translation.entity';
import { TranslationRepository } from '../repositories/translation.repository';

export class ChangeLanguageUseCase {
  constructor(private translationRepository: TranslationRepository) {}

  async execute(language: SupportedLanguage): Promise<void> {
    await this.translationRepository.setCurrentLanguage(language);
  }
}