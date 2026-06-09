import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/services/api';
import { normalizeMoleculeFormData } from '@/utils/helpers';

const SingleAddForm = ({ onClose }) => {
  const { t } = useTranslation('molecules');
  const [formData, setFormData] = useState({
    nome_molecula: '',
    smiles: '',
    referencia: '',
    nome_planta: '',
    database: '',
    origem: '',
    geolocalizacao: '',
    activity: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name] || serverError) {
      setErrors(prev => ({ ...prev, [name]: '' }));
      setServerError('');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome_molecula?.trim()) newErrors.nome_molecula = t('moleculeNameRequired');
    if (!formData.smiles?.trim()) newErrors.smiles = t('smilesRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccessMessage('');
    setServerError('');

    try {
      await api.post('molecules/', normalizeMoleculeFormData(formData));

      setSuccessMessage(t('registerSuccess'));
      setTimeout(() => {
        setFormData({ nome_molecula: '', smiles: '', referencia: '', nome_planta: '', database: '', origem: '', geolocalizacao: '', activity: '' });
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Erro ao cadastrar molécula:', error);
      if (error.response && error.response.data) {
        setServerError(t('registerFailed'));
        setErrors(error.response.data);
      } else {
        setServerError(t('connectionError'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {successMessage && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{successMessage}</div>}
      {serverError && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{serverError}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nome_molecula" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('moleculeNameLabel')}</label>
          <input type="text" name="nome_molecula" id="nome_molecula" value={formData.nome_molecula} onChange={handleChange} className={`mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 ${errors.nome_molecula ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.nome_molecula && <p className="mt-1 text-xs text-red-600">{errors.nome_molecula}</p>}
        </div>

        <div>
          <label htmlFor="smiles" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('smilesLabel')}</label>
          <input type="text" name="smiles" id="smiles" value={formData.smiles} onChange={handleChange} className={`mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 ${errors.smiles ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.smiles && <p className="mt-1 text-xs text-red-600">{errors.smiles}</p>}
        </div>

        <div>
          <label htmlFor="referencia" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('reference')}</label>
          <input type="text" name="referencia" id="referencia" value={formData.referencia} onChange={handleChange} className={`mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 ${errors.referencia ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.referencia && <p className="mt-1 text-xs text-red-600">{errors.referencia}</p>}
        </div>

        <div>
          <label htmlFor="nome_planta" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('plantNameLabel')}</label>
          <input type="text" name="nome_planta" id="nome_planta" value={formData.nome_planta} onChange={handleChange} className={`mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 ${errors.nome_planta ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.nome_planta && <p className="mt-1 text-xs text-red-600">{errors.nome_planta}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="database" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('filterDatabase')}</label>
          <input type="text" name="database" id="database" value={formData.database} onChange={handleChange} className={`mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 ${errors.database ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.database && <p className="mt-1 text-xs text-red-600">{errors.database}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="origem" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('origin')}</label>
          <input type="text" name="origem" id="origem" value={formData.origem} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100" />
        </div>

        <div>
          <label htmlFor="geolocalizacao" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('geolocation')}</label>
          <input type="text" name="geolocalizacao" id="geolocalizacao" value={formData.geolocalizacao} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100" />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="activity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('activity')}</label>
          <textarea name="activity" id="activity" rows="3" value={formData.activity} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"></textarea>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="bg-white dark:bg-gray-800 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {t('common:cancel')}
        </button>
        <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          {loading ? t('saving') : t('saveMolecule')}
        </button>
      </div>
    </form>
  );
};

export default SingleAddForm;
