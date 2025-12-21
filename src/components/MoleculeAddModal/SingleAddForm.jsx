import React, { useState } from 'react';
import api from '@/services/api'; // Importa nossa instância configurada do Axios

const SingleAddForm = ({ onClose }) => {
  // Estado para guardar os dados do formulário
  const [formData, setFormData] = useState({
    nome_molecula: '',
    smiles: '',
    referencia: '',
    nome_planta: '',
    database: '',
    origem: '',
    activity: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');

  // Função para atualizar o estado quando o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpa os erros ao começar a digitar
    if (errors[name] || serverError) {
      setErrors(prev => ({ ...prev, [name]: '' }));
      setServerError('');
    }
  };

  // Função para validar o formulário antes do envio
  const validate = () => {
    const newErrors = {};
    if (!formData.nome_molecula) newErrors.nome_molecula = 'Nome da molécula é obrigatório.';
    if (!formData.smiles) newErrors.smiles = 'SMILES é obrigatório.';
    if (!formData.referencia) newErrors.referencia = 'Referência é obrigatória.';
    if (!formData.nome_planta) newErrors.nome_planta = 'Nome da planta é obrigatório.';
    if (!formData.database) newErrors.database = 'Database é obrigatória.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccessMessage('');
    setServerError('');

    try {
      await api.post('/api/molecules/', formData);

      setSuccessMessage('Molécula cadastrada com sucesso!');
      setTimeout(() => {
        setFormData({ nome_molecula: '', smiles: '', referencia: '', nome_planta: '', database: '', origem: '', activity: '' });
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Erro ao cadastrar molécula:', error);
      if (error.response && error.response.data) {
        setServerError('Falha no cadastro. Verifique os erros abaixo.');
        setErrors(error.response.data);
      } else {
        setServerError('Ocorreu um erro de conexão. Tente novamente.');
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
          <label htmlFor="nome_molecula" className="block text-sm font-medium text-gray-700">Nome da Molécula *</label>
          <input type="text" name="nome_molecula" id="nome_molecula" value={formData.nome_molecula} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.nome_molecula ? 'border-red-500' : ''}`} />
          {errors.nome_molecula && <p className="mt-1 text-xs text-red-600">{errors.nome_molecula}</p>}
        </div>

        <div>
          <label htmlFor="smiles" className="block text-sm font-medium text-gray-700">SMILES *</label>
          <input type="text" name="smiles" id="smiles" value={formData.smiles} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.smiles ? 'border-red-500' : ''}`} />
          {errors.smiles && <p className="mt-1 text-xs text-red-600">{errors.smiles}</p>}
        </div>

        <div>
          <label htmlFor="referencia" className="block text-sm font-medium text-gray-700">Referência *</label>
          <input type="text" name="referencia" id="referencia" value={formData.referencia} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.referencia ? 'border-red-500' : ''}`} />
          {errors.referencia && <p className="mt-1 text-xs text-red-600">{errors.referencia}</p>}
        </div>

        <div>
          <label htmlFor="nome_planta" className="block text-sm font-medium text-gray-700">Nome da Planta *</label>
          <input type="text" name="nome_planta" id="nome_planta" value={formData.nome_planta} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.nome_planta ? 'border-red-500' : ''}`} />
          {errors.nome_planta && <p className="mt-1 text-xs text-red-600">{errors.nome_planta}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="database" className="block text-sm font-medium text-gray-700">Database *</label>
          <input type="text" name="database" id="database" value={formData.database} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.database ? 'border-red-500' : ''}`} />
          {errors.database && <p className="mt-1 text-xs text-red-600">{errors.database}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="origem" className="block text-sm font-medium text-gray-700">Origem</label>
          <input type="text" name="origem" id="origem" value={formData.origem} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="activity" className="block text-sm font-medium text-gray-700">Activity</label>
          <textarea name="activity" id="activity" rows="3" value={formData.activity} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          {loading ? 'Salvando...' : 'Salvar Molécula'}
        </button>
      </div>
    </form>
  );
};

export default SingleAddForm;
