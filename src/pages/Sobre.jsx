import React from 'react';

const SobrePage = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">LMW</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              LMW DataBase
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              Plataforma de Estruturas Químicas Moleculares
            </p>

            <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
              Plataforma digital desenvolvida por estudantes da UTFPR para armazenamento,
              visualização e busca de estruturas químicas de compostos moleculares,
              promovendo a interdisciplinaridade entre computação, química e biotecnologia.
            </p>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recursos da Plataforma
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ferramentas avançadas para pesquisa e análise de estruturas químicas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2M5 9V7a2 2 0 012-2h10a2 2 0 012 2v2M5 9h14"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Armazenamento de Estruturas</h3>
              <p className="text-gray-600">
                Base de dados robusta para armazenar e organizar estruturas químicas moleculares
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Busca Avançada</h3>
              <p className="text-gray-600">
                Sistema de busca inteligente para encontrar compostos específicos por propriedades químicas
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visualização Interativa</h3>
              <p className="text-gray-600">
                Interface intuitiva para visualizar estruturas moleculares em 2D e 3D
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sobre o Projeto
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              O projeto LMW DataBase foi desenvolvido por estudantes da Universidade Tecnológica Federal do Paraná (UTFPR)
              com o objetivo de criar uma plataforma digital voltada ao armazenamento, visualização e busca de
              estruturas químicas de compostos moleculares. A iniciativa surge da crescente demanda por ferramentas
              digitais que integrem recursos interativos à pesquisa e ao ensino de química, promovendo a
              interdisciplinaridade entre áreas como computação, química e biotecnologia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SobrePage;
