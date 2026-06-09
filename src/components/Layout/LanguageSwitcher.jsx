import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n, { LANGUAGE_STORAGE_KEY } from '@/i18n';

const LANGUAGES = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
];

const LanguageSwitcher = () => {
  const { i18n: i18nInstance } = useTranslation();
  const currentLang = i18nInstance.language?.startsWith('en') ? 'en' : 'pt';

  const handleChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  };

  return (
    <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => handleChange(code)}
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            currentLang === code
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          aria-pressed={currentLang === code}
          aria-label={code === 'pt' ? 'Português' : 'English'}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
