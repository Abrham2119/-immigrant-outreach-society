import { ALL_LANGUAGES } from "../constants/languages.constants";

interface LanguageDropdownProps {
  showLanguageDropdown: boolean;
  isLoading: boolean;
  currentLanguage: string;
  currentLangName: string;
  currentLangFlag: string;
  t: (key: string, fallback: string) => string;
  handleLanguageChange: (languageCode: string) => void;
}

export const LanguageDropdown = ({
  showLanguageDropdown,
  isLoading,
  currentLanguage,
  currentLangName,
  currentLangFlag,
  t,
  handleLanguageChange
}: LanguageDropdownProps) => {
  if (!showLanguageDropdown) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
      <div className="p-2">
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {t('language', 'Language')}
        </div>
        {ALL_LANGUAGES.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-3 w-full p-2 rounded-md hover:bg-gray-100 transition-colors ${currentLanguage === language.code ? 'bg-blue-50 border-l-2 border-blue-500' : ''
              }`}
          >
            <span className="text-lg">{language.flag}</span>
            <div className="flex flex-col items-start flex-1">
              <span className="text-sm font-medium text-gray-700">{language.nativeName}</span>
              <span className="text-xs text-gray-500">{language.name}</span>
            </div>
            {currentLanguage === language.code && (
              <span className="text-blue-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};