import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

// Import file dịch
import en from './locales/en.json';
import vi from './locales/vi.json';

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

// const languageDetector = {
//   type: 'languageDetector',
//   async: true,
//   detect: (callback) => {
//     const locales = RNLocalize.getLocales();
//     callback(locales[0].languageCode);
//   },
//   init: () => {},
//   cacheUserLanguage: () => {},
// };

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng:'vi',
    fallbackLng: 'en', 
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
