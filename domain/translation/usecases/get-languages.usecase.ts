import { Language } from '../entities/translation.entity';
import { TranslationRepository } from '../repositories/translation.repository';

export class GetLanguagesUseCase {
  constructor(private translationRepository: TranslationRepository) {}

  async execute(): Promise<Language[]> {
    return this.translationRepository.getAvailableLanguages();
  }
}