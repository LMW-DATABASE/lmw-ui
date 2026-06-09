import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">LMW</span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('appTitle')}</span>
          </div>

          <div>
            <Link
              to="/sobre"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
            >
              {t('footerAbout')}
            </Link>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {t('footerTagline')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
