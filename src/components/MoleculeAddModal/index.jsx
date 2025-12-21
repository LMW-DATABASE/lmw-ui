import React, { useState } from 'react';

// Vamos importar os componentes das abas que ainda vamos criar
import SingleAddForm from './SingleAddForm';
import BulkUploadForm from './BulkUploadForm';

const MoleculeAddModal = ({ isOpen, onClose }) => {
  // Estado para controlar qual aba está ativa: 'single' ou 'bulk'
  const [activeTab, setActiveTab] = useState('single');

  // Se o modal não estiver aberto, não renderiza nada.
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Adicionar Moléculas</h2>

          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('single')}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'single'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cadastro Individual
              </button>
              <button
                onClick={() => setActiveTab('bulk')}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bulk'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cadastro em Massa (Excel)
              </button>
            </nav>
          </div>
          <div>
            {activeTab === 'single' && <SingleAddForm onClose={onClose} />}
            {activeTab === 'bulk' && <BulkUploadForm onClose={onClose} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoleculeAddModal;