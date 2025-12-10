export const ALL_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', direction: 'ltr' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', flag: '🇪🇷', direction: 'ltr' },
  { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo', flag: '🇪🇹', direction: 'ltr' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴', direction: 'ltr' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', direction: 'ltr' },
];

export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://appointment-figma.onrender.com";