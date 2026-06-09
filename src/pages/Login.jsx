import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name] || errors.submit) {
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await login(formData.email, formData.senha);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ submit: result.error });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center"><span className="text-white font-bold text-xl">LMW</span></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('loginTitle')}</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('loginSubtitle')}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 py-8 px-6 shadow-lg rounded-lg border border-transparent dark:border-gray-800">
          {errors.submit && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded">{errors.submit}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('email')}</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 ${errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'}`} placeholder={t('emailPlaceholder')}/>
            </div>
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('password')}</label>
              <input id="senha" name="senha" type="password" value={formData.senha} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 ${errors.senha ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'}`} placeholder={t('passwordPlaceholder')}/>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200">
              {loading ? t('submittingLogin') : t('submitLogin')}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('forgotPassword')}{' '}
              <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">{t('recoverPassword')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
