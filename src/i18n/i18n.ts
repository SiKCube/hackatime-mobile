import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import en from "./locales/en.json"
// import ja from "./locales/ja.json"
import es from "./locales/es.json"

const translations = {
  en,
  // ...ja,
  es,
};
const Appi18n = new I18n(translations);

const defaultLang = getLocales()[0].languageCode ?? "en"

Appi18n.locale = defaultLang

Appi18n.enableFallback = true;

export default Appi18n;

