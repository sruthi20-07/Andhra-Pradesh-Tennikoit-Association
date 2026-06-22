import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './en.json';
import translationTE from './te.json';

const resources = {
  en: {
    translation: translationEN
  },
  te: {
    translation: translationTE
  }
};

// Retrieve stored language or default to English
const storedLanguage = localStorage.getItem('aptamp_lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: storedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes string contents to prevent XSS
    }
  });

export default i18n;
