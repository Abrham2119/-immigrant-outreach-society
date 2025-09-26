
"use client";


import { useEffect, useState } from "react";
import useStore from '@/domain/state/useStore';
import { handleTranslate, LanguageTranslations } from "../application/handleTranslate";

export const useTranslatedText   = () => {
  const { currentLang } = useStore();
  const [translations, setTranslations] = useState<LanguageTranslations | null>(
    () => handleTranslate(currentLang)
  );

  useEffect(() => {
    const translatedText = handleTranslate(currentLang);
    setTranslations(translatedText);
  }, [currentLang]);


  return translations;
};
