import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "./translations/en";
import { ur } from "./translations/ur";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: {
    en: { translation: en },
    ur: { translation: ur },
  },
  lng: "en",
  fallbackLng: "en",
});
