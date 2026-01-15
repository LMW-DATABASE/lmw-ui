import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import MoleculeCard from '../components/molecules/MoleculesCard.jsx';
import Pagination from '../components/common/Pagination';
import MoleculesFilters from '../components/molecules/MoleculesFilters';

const normalize = (v) => v?.toString().toLowerCase().trim() || '';

const Home = () => {
  const [allMolecules, setAllMolecules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    database: [],
    origem: [],
    nome_planta: [],
    referencia: [],
    atividade: [''],
  });

  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchMolecules = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/api/molecules/', {
          params: { search: query },
        });
        setAllMolecules(response.data); 
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os dados.');
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

  // Lógica de filtragem local (Frontend) integrada
  const filteredMolecules = useMemo(() => {
    return allMolecules.filter((mol) => {
      // Filtro por Database
      if (
        filters.database.length &&
        !filters.database.some((db) =>
          normalize(mol.database) === normalize(db)
        )
      ) return false;

      // Filtro por Origem
      if (
        filters.origem.length &&
        !filters.origem.some((o) =>
          normalize(mol.origem).includes(normalize(o.value))
        )
      ) return false;

      // Filtro por Nome da Planta
      if (
        filters.nome_planta.length &&
        !filters.nome_planta.some((p) =>
          normalize(mol.nome_planta).includes(normalize(p.value))
        )
      ) return false;

      // Filtro por Referência
      if (
        filters.referencia.length &&
        !filters.referencia.some((r) =>
          normalize(mol.referencia).includes(normalize(r.value))
        )
      ) return false;

      // Filtro por Atividade
      const atividadesValidas = filters.atividade.filter((a) => a.trim() !== '');
      if (
        atividadesValidas.length &&
        !atividadesValidas.some((a) =>
          normalize(mol.activity).includes(normalize(a))
        )
      ) return false;

      return true;
    });
  }, [allMolecules, filters]);

  // Resetar página ao mudar filtros ou busca
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, query]);

  // Paginação baseada nos resultados filtrados
  const currentMolecules = useMemo(() => {
    const firstItemIndex = (currentPage - 1) * itemsPerPage;
    const lastItemIndex = firstItemIndex + itemsPerPage;
    return filteredMolecules.slice(firstItemIndex, lastItemIndex);
  }, [filteredMolecules, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredMolecules.length / itemsPerPage);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); 
    setQuery(searchTerm);
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-160px)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* BUSCA */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Buscar Moléculas
          </h1>

          {/* Botão de Filtros */}
          <div className="flex justify-start mb-4">
            <button
              onClick={() => setShowFiltersModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              🔍 Filtros avançados
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome da molécula (ex: Cafeína)"
              className="flex-grow px-4 py-3 border rounded-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
        </div>

        {/* RESULTADOS */}
        {loading && <div className="text-center py-10">Carregando...</div>}
        {error && <div className="text-center py-10 text-red-600">{error}</div>}

        {!loading && !error && currentMolecules.length === 0 && (
          <div className="text-center py-10">
            {query ? 'Nenhuma molécula encontrada.' : 'Realize uma busca.'}
          </div>
        )}

        {!loading && !error && currentMolecules.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentMolecules.map((m) => (
              <MoleculeCard key={m.id} molecule={m} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* MODAL FILTROS */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filtros avançados</h2>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            <MoleculesFilters
              filters={filters}
              onApply={(newFilters) => {
                setFilters(newFilters);
                setShowFiltersModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;