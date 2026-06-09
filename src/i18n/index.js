import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptCommon from '../locales/pt/common.json';
import ptAuth from '../locales/pt/auth.json';
import ptMolecules from '../locales/pt/molecules.json';
import ptDashboard from '../locales/pt/dashboard.json';
import ptAbout from '../locales/pt/about.json';
import ptValidators from '../locales/pt/validators.json';

import enCommon from '../locales/en/common.json';
import enAuth from '../locales/en/auth.json';
import enMolecules from '../locales/en/molecules.json';
import enDashboard from '../locales/en/dashboard.json';
import enAbout from '../locales/en/about.json';
import enValidators from '../locales/en/validators.json';

export const LANGUAGE_STORAGE_KEY = 'lmw-lang';

const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
const initialLang = savedLang && ['pt', 'en'].includes(savedLang) ? savedLang : 'pt';

i18n.use(initReactI18next).init({
  resources: {
    pt: {
      common: ptCommon,
      auth: ptAuth,
      molecules: ptMolecules,
      dashboard: ptDashboard,
      about: ptAbout,
      validators: ptValidators,
    },
    en: {
      common: enCommon,
      auth: enAuth,
      molecules: enMolecules,
      dashboard: enDashboard,
      about: enAbout,
      validators: enValidators,
    },
  },
  lng: initialLang,
  fallbackLng: 'pt',
  supportedLngs: ['pt', 'en'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

document.documentElement.lang = initialLang;

export default i18n;
