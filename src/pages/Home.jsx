import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import MoleculeCard from '../components/molecules/MoleculesCard.jsx';
import Pagination from '../components/common/Pagination';

const Home = () => {
  const [allMolecules, setAllMolecules] = useState([]); // Guarda TODAS as moléculas da busca
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchMolecules = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/api/molecules/', {
          params: { search: query }
        });
        setAllMolecules(response.data); 
      } catch (err) {
        console.error("Erro ao buscar moléculas:", err);
        setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchMolecules();
    } else {
      setAllMolecules([]); 
    }
  }, [query]);

  const currentMolecules = useMemo(() => {
    const firstItemIndex = (currentPage - 1) * itemsPerPage;
    const lastItemIndex = firstItemIndex + itemsPerPage;
    return allMolecules.slice(firstItemIndex, lastItemIndex);
  }, [allMolecules, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(allMolecules.length / itemsPerPage);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); 
    setQuery(searchTerm);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-160px)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Seção de Busca */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Buscar Moléculas</h1>
          <form onSubmit={handleSearch} className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome da molécula (ex: Cafeína)"
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 shadow-sm disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
        </div>

        {/* Contagem de Resultados */}
        <div className="mb-4 text-sm text-gray-600">
          {allMolecules.length > 0 && `Mostrando de ${ (currentPage - 1) * itemsPerPage + 1 } a ${Math.min(currentPage * itemsPerPage, allMolecules.length)} de ${allMolecules.length} resultados.`}
        </div>

        {/* Seção de Resultados */}
        <div>
          {loading && <div className="text-center py-10"><p className="text-gray-600">Carregando moléculas...</p></div>}
          {error && <div className="text-center py-10"><p className="text-red-600">{error}</p></div>}
          {!loading && !error && currentMolecules.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-600">{query ? 'Nenhuma molécula encontrada para sua busca.' : 'Realize uma busca para ver os resultados.'}</p>
            </div>
          )}
          {!loading && !error && currentMolecules.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentMolecules.map(molecule => (
                <MoleculeCard key={molecule.id} molecule={molecule} />
              ))}
            </div>
          )}
        </div>

        {/* Renderiza a Paginação */}
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

