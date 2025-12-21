import React, { useState } from 'react';
import api from '../../services/api';

const BulkUploadForm = ({ onClose }) => {
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
      setError({ message: 'Por favor, selecione um arquivo para enviar.' });
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post('/api/molecules/upload_excel/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage(response.data.message);
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (err) {
      console.error('Erro no upload em massa:', err);
      if (err.response?.data) {
        setError({
          message: err.response.data.error || 'Ocorreram erros de validação no seu arquivo.',
          details: err.response.data.errors || [],
        });
      } else {
        setError({ message: 'Ocorreu um erro de conexão. Tente novamente.' });
      }
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
          {error.details && error.details.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-xs">
              {error.details.map((detail, index) => (
                <li key={index}>
                  Linha {detail.row}: {Object.values(detail.errors).join(', ')}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
              Arquivo Excel (.xlsx)
            </label>
            <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Carregar um arquivo</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".xlsx" />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                {selectedFile ? (
                  <p className="text-xs text-gray-500">{selectedFile.name}</p>
                ) : (
                  <p className="text-xs text-gray-500">Apenas arquivos .xlsx</p>
                )}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>As colunas do arquivo devem seguir o padrão: <br />
              <code className="text-xs bg-gray-100 p-1 rounded">nome_molecula, smiles, referencia, nome_planta, database, origem, activity</code>
            </p>
            <a href="/path/to/template.xlsx" download className="text-indigo-600 hover:underline mt-1 inline-block">Baixar template de exemplo</a>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Enviando...' : 'Enviar Arquivo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkUploadForm;
