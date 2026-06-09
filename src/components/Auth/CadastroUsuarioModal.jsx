import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const CadastroUsuarioModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation('auth');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const resetForm = () => {
    setFormData({ nome: '', email: '', senha: '', confirmarSenha: '' });
    setErrors({});
    setSuccessMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = t('nameRequired');
    if (!formData.email.trim()) newErrors.email = t('emailRequired');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('emailInvalid');
    if (formData.senha.length < 6) newErrors.senha = t('passwordMinLength');
    if (formData.senha !== formData.confirmarSenha) newErrors.confirmarSenha = t('passwordMismatch');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage('');
    setErrors({});

    try {
      await api.post('/users/register/', {
        username: formData.email,
        email: formData.email,
        password: formData.senha,
        first_name: formData.nome.split(' ')[0],
        last_name: formData.nome.split(' ').slice(1).join(' ') || ''
      });

      setSuccessMessage(t('registerSuccess'));

      setTimeout(() => {
        setFormData({ nome: '', email: '', senha: '', confirmarSenha: '' });
        setSuccessMessage('');
      }, 2000);

    } catch (error) {
      console.error('Erro no cadastro:', error);
      const errorMsg = error.response?.data?.email?.[0] || error.response?.data?.username?.[0] || t('serverError');
      setErrors({ submit: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-sm w-full p-6 border border-transparent dark:border-gray-700">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('registerTitle')}</h2>
        </div>
        <div className="space-y-4">
          {successMessage && <div className="p-3 bg-green-100 text-green-700 rounded">{successMessage}</div>}
          {errors.submit && <div className="p-3 bg-red-100 text-red-700 rounded">{errors.submit}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('name')}</label>
              <input name="nome" value={formData.nome} onChange={handleChange} className={`w-full p-2 border rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 ${errors.nome ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
              {errors.nome && <p className="text-xs text-red-600 mt-1">{errors.nome}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('email')}</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className={`w-full p-2 border rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('password')}</label>
              <input name="senha" type="password" value={formData.senha} onChange={handleChange} className={`w-full p-2 border rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 ${errors.senha ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
              {errors.senha && <p className="text-xs text-red-600 mt-1">{errors.senha}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('confirmPassword')}</label>
              <input name="confirmarSenha" type="password" value={formData.confirmarSenha} onChange={handleChange} className={`w-full p-2 border rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 ${errors.confirmarSenha ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
              {errors.confirmarSenha && <p className="text-xs text-red-600 mt-1">{errors.confirmarSenha}</p>}
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {t('common:cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? t('registering') : t('register')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroUsuarioModal;
