import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { EN } from "./translation/en";
import { AR } from "./translation/ar";
import { FR } from "./translation/fr";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  ar: {
    translation: AR,
  },
  fr: {
    translation: FR,
  },
  en: {
    translation: EN,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug: __DEV__,
    resources,
    supportedLngs: ["en", "fr", "ar"],
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
