import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import api from '../services/api';
import MoleculeCard from '../components/molecules/MoleculesCard.jsx';
import Pagination from '../components/common/Pagination';
import MoleculesFilters from '../components/molecules/MoleculesFilters';
import { filterMolecules } from '../utils/helpers';

const Home = () => {
  const { t } = useTranslation('molecules');
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
    geolocalizacao: [],
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
        const response = await api.get('molecules/', {
          params: query ? { search: query } : {},
        });
        setAllMolecules(response.data);
      } catch (err) {
        console.error(err);
        setError(i18n.t('molecules:loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchMolecules();
  }, [query]);

  const filteredMolecules = useMemo(() => {
    return filterMolecules(allMolecules, filters, query);
  }, [allMolecules, filters, query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, query]);

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

  const hasActiveFilters =
    query ||
    filters.database.length ||
    filters.origem.length ||
    filters.nome_planta.length ||
    filters.referencia.length ||
    filters.geolocalizacao.length ||
    filters.atividade.some((a) => a.trim() !== '');

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-[calc(100vh-160px)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-transparent dark:border-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('searchTitle')}
          </h1>

          <div className="flex justify-start mb-4">
            <button
              onClick={() => setShowFiltersModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {t('advancedFilters')}
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? t('searching') : t('searchButton')}
            </button>
          </form>
        </div>

        {loading && <div className="text-center py-10">{t('common:loading')}</div>}
        {error && <div className="text-center py-10 text-red-600">{error}</div>}

        {!loading && !error && currentMolecules.length === 0 && (
          <div className="text-center py-10">
            {hasActiveFilters ? t('noResults') : t('noMolecules')}
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

      {showFiltersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 border border-transparent dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('advancedFilters')}</h2>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="text-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                aria-label={t('common:close')}
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
