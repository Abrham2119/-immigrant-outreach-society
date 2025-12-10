"use client";

import { useTranslation } from "@/components/providers/translation.provider";

export const useTranslatedText = () => {
  const { t, translations } = useTranslation();
  
  return {
    t,
    translations,
    getText: (key: string, defaultValue?: string) => t(key, defaultValue),
    hasTranslation: (key: string) => {
      if (!translations) return false;
      const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
      return normalizedKey in translations;
    }
  };
};