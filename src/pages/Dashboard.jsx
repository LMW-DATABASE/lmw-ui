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

  return (
    <>
      <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-160px)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2M5 9V7a2 2 0 012-2h10a2 2 0 012 2v2M5 9h14"/></svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Estruturas</h3>
                    <p className="text-2xl font-bold text-blue-600">1,245</p>
                    <p className="text-sm text-gray-500">Compostos cadastrados</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Buscas</h3>
                    <p className="text-2xl font-bold text-green-600">89</p>
                    <p className="text-sm text-gray-500">Realizadas hoje</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Usuários</h3>
                    <p className="text-2xl font-bold text-purple-600">45</p>
                    <p className="text-sm text-gray-500">Ativos no sistema</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setIsUserModalOpen(true)}
                    className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                      <span className="font-medium">Adicionar Novo Usuário</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setIsMoleculeModalOpen(true)}
                    className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                      <span className="font-medium">Adicionar Nova Estrutura</span>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/moleculas')}
                    className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200"
                  >
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-indigo-600 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span className="font-medium">Listar Moléculas</span>
                    </div>
                  </button>

                  <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                      <span className="font-medium">Gerar Relatório</span>
                    </div>
                  </button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm"><div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div><span className="text-gray-600">Nova estrutura adicionada: Benzeno</span></div>
                  <div className="flex items-center text-sm"><div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div><span className="text-gray-600">Busca realizada: Compostos orgânicos</span></div>
                  <div className="flex items-center text-sm"><div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div><span className="text-gray-600">Novo usuário cadastrado</span></div>
                  <div className="flex items-center text-sm"><div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div><span className="text-gray-600">Relatório gerado: Análise mensal</span></div>
                </div>
              </div>
            </div>
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