export const SUPPORTED_LANGUAGES = {
  ENGLISH: 'en',
  AMHARIC: 'am',
  TIGRINYA: 'ti',
  OROMO: 'om',
  SOMALI: 'so',
  SWAHILI: 'sw',
  ARABIC: 'ar',
  ITALIAN: 'it'
} as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[keyof typeof SUPPORTED_LANGUAGES];

export interface Language {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  locale: string;
}

export const LANGUAGES: Language[] = [
  { code: SUPPORTED_LANGUAGES.ENGLISH, name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr', locale: 'en-US' },
  { code: SUPPORTED_LANGUAGES.AMHARIC, name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', direction: 'ltr', locale: 'am-ET' },
  { code: SUPPORTED_LANGUAGES.TIGRINYA, name: 'Tigrinya', nativeName: 'ትግርኛ', flag: '🇪🇷', direction: 'ltr', locale: 'ti-ER' },
  { code: SUPPORTED_LANGUAGES.OROMO, name: 'Oromo', nativeName: 'Afaan Oromoo', flag: '🇪🇹', direction: 'ltr', locale: 'om-ET' },
  { code: SUPPORTED_LANGUAGES.SOMALI, name: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴', direction: 'ltr', locale: 'so-SO' },
  { code: SUPPORTED_LANGUAGES.SWAHILI, name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿', direction: 'ltr', locale: 'sw-TZ' },
  { code: SUPPORTED_LANGUAGES.ARABIC, name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl', locale: 'ar-SA' },
  { code: SUPPORTED_LANGUAGES.ITALIAN, name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', direction: 'ltr', locale: 'it-IT' }
];

export interface TranslationKey {
  key: string;
  value: string;
}

export interface LanguageTranslations {
  [key: string]: string;
}