import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import SingleAddForm from './SingleAddForm';
import BulkUploadForm from './BulkUploadForm';

const MoleculeAddModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation('molecules');
  const [activeTab, setActiveTab] = useState('single');

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 overflow-y-auto"
      onClick={onClose}
      role="presentation"
    >
      <div className="min-h-full flex items-center justify-center p-4 py-8">
        <div
          className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-transparent dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="molecule-add-modal-title"
        >
          <div className="flex-shrink-0 flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <h2 id="molecule-add-modal-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100 pr-2">
              {t('addModalTitle')}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 z-10 p-1 -m-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={t('common:close')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-shrink-0 px-6 pt-4 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                type="button"
                onClick={() => setActiveTab('single')}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'single'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {t('tabSingle')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bulk')}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bulk'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {t('tabBulk')}
              </button>
            </nav>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 pb-6">
            {activeTab === 'single' && <SingleAddForm onClose={onClose} />}
            {activeTab === 'bulk' && <BulkUploadForm onClose={onClose} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoleculeAddModal;
