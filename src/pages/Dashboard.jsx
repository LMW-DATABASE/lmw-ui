import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import CadastroUsuarioModal from '../components/Auth/CadastroUsuarioModal';
import MoleculeAddModal from '../components/MoleculeAddModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMoleculeModalOpen, setIsMoleculeModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const displayName = user?.first_name || user?.username || user?.email || 'utilizador';

  return (
    <>
      <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-160px)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Olá, {displayName}. Acesse rapidamente as principais operações do sistema.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-left transition-all duration-200 hover:shadow-md hover:border-indigo-300"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Cadastrar usuário</h2>
              <p className="mt-2 text-sm text-gray-600">
                Abra o modal de cadastro para adicionar um novo utilizador ao sistema.
              </p>
            </button>

            <button
              onClick={() => setIsMoleculeModalOpen(true)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-left transition-all duration-200 hover:shadow-md hover:border-indigo-300"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Adicionar molécula</h2>
              <p className="mt-2 text-sm text-gray-600">
                Cadastre uma nova estrutura individualmente ou por ficheiro Excel.
              </p>
            </button>

            <button
              onClick={() => navigate('/moleculas')}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-left transition-all duration-200 hover:shadow-md hover:border-indigo-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Gerenciar moléculas</h2>
              <p className="mt-2 text-sm text-gray-600">
                Consulte, edite e acompanhe o estado de processamento das moléculas.
              </p>
            </button>
          </div>
        </div>
      </div>
      <CadastroUsuarioModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      />
      <MoleculeAddModal
        isOpen={isMoleculeModalOpen}
        onClose={() => setIsMoleculeModalOpen(false)}
      />
    </>
  );
};

export default Dashboard;