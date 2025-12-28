import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import translationEN from './locales/en.json';
import translationHI from './locales/hi.json';
import translationUR from './locales/ur.json';
import translationBN from './locales/bn.json';
import translationTA from './locales/ta.json';

const resources = {
  en: { translation: translationEN },
  hi: { translation: translationHI },
  ur: { translation: translationUR },
  bn: { translation: translationBN },
  ta: { translation: translationTA }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: localStorage.getItem('selectedLanguage') || 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
