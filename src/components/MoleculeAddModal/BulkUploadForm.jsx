import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import api from '../../services/api';

function getFieldLabel(field) {
  const key = `fields.${field}`;
  if (i18n.exists(key, { ns: 'molecules' })) {
    return i18n.t(`molecules:${key}`);
  }
  return field;
}

function flattenDrfMessages(value) {
  if (value == null) return [];
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap((v) => flattenDrfMessages(v));
  if (typeof value === 'object') return Object.values(value).flatMap((v) => flattenDrfMessages(v));
  return [String(value)];
}

function formatFieldLines(erros) {
  if (!erros || typeof erros !== 'object' || Array.isArray(erros)) return [];
  const lines = [];
  for (const [field, raw] of Object.entries(erros)) {
    const label = getFieldLabel(field);
    const msgs = flattenDrfMessages(raw);
    for (const m of msgs) {
      lines.push({ label, message: m });
    }
  }
  return lines;
}

function parseUploadError(err) {
  const data = err.response?.data;
  if (!data || typeof data !== 'object') {
    return { message: i18n.t('molecules:connectionError'), details: [], missingColumns: [] };
  }

  let message = typeof data.error === 'string' ? data.error : '';

  if (!message && data.status === 'falha' && Array.isArray(data.errors) && data.errors.length > 0) {
    message = i18n.t('molecules:rowProblems');
  }

  const missing = Array.isArray(data.missing_columns) ? data.missing_columns : [];
  if (!message && missing.length > 0) {
    message = i18n.t('molecules:missingColumns');
  }

  if (!message) {
    message = i18n.t('molecules:processFileError');
  }

  const missingColumns = missing.map((c) => getFieldLabel(c));

  const details = (Array.isArray(data.errors) ? data.errors : []).map((item) => {
    const row = item.linha_excel ?? item.row;
    const fieldErrors = item.erros ?? item.errors;
    return {
      row,
      lines: formatFieldLines(fieldErrors),
    };
  });

  return { message, details, missingColumns };
}

const BulkUploadForm = ({ onClose }) => {
  const { t } = useTranslation('molecules');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setSuccessMessage('');
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError({ message: t('selectFileError'), details: [], missingColumns: [] });
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post('molecules/upload_excel/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage(response.data.message);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Erro no upload em massa:', err.response?.data ?? err.message);
      setError(parseUploadError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {successMessage && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{successMessage}</div>}

      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          <p className="font-bold">{error.message}</p>
          {error.missingColumns && error.missingColumns.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-xs">
              {error.missingColumns.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          )}
          {error.details && error.details.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-xs space-y-2">
              {error.details.map((detail, index) => (
                <li key={index}>
                  <span className="font-semibold">{t('rowLabel', { row: detail.row ?? '?' })}</span>
                  {detail.lines && detail.lines.length > 0 ? (
                    <ul className="mt-1 ml-4 list-disc space-y-0.5">
                      {detail.lines.map((line, i) => (
                        <li key={i}>
                          <span className="font-medium">{line.label}:</span> {line.message}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="ml-1">{t('validationNoDetail')}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('bulkExcelLabel')}
            </label>
            <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>{t('uploadFile')}</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".xlsx" />
                  </label>
                  <p className="pl-1">{t('orDragDrop')}</p>
                </div>
                {selectedFile ? (
                  <p className="text-xs text-gray-500">{selectedFile.name}</p>
                ) : (
                  <p className="text-xs text-gray-500">{t('xlsxOnly')}</p>
                )}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              {t('columnsHint')} <br />
              <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">nome_molecula, smiles, referencia, nome_planta, database, origem, geolocalizacao, activity</code>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {t('optionalColumns')}
            </p>
            <a href="/path/to/template.xlsx" download className="text-indigo-600 hover:underline mt-1 inline-block">
              {t('downloadTemplate')}
            </a>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="bg-white dark:bg-gray-800 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            {t('common:cancel')}
          </button>
          <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
            {loading ? t('uploading') : t('uploadFileButton')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkUploadForm;
