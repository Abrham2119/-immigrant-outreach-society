import { Am } from "../infrastructure/locales/am";
import { En } from "../infrastructure/locales/en";

type TranslationDictionary = Record<string, string>;
type LanguageDictionary = Record<string, TranslationDictionary>;

const lang: LanguageDictionary = {};

const dictionaries: Record<string, TranslationDictionary> = {
  am: Am,
  en: En,
};

Object.keys(dictionaries).forEach((k) => {
  const v = dictionaries[k];
  const trans: { [key: string]: string } = {};
  Object.keys(v).forEach((key) => {
    trans[key.replace(/\s+/g, "")] = v[key];
  });
  lang[k] = trans;
});

export default lang;
