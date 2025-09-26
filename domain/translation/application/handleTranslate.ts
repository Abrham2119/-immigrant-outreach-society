import lang from "../entities/translation";

export interface LanguageTranslations {
  [key: string]: string;
}

export function handleTranslate(pathname: string): LanguageTranslations | null {
  const language = pathname !== "/am" ? "en" : "am";
  return lang[language] || null;
}
