import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import api from '../services/api';
import Pagination from '../components/common/Pagination';
import MoleculesFilters from '../components/molecules/MoleculesFilters';
import MoleculeDetails from '../components/molecules/MoleculeDetails';
import {
  formatMoleculeDatabasesByActiveFilter,
  moleculeDatabaseSearchText,
  moleculeMatchesDatabase,
} from '../utils/helpers';

const normalize = (v) => v?.toString().toLowerCase().trim() || '';

const ListagemMoleculas = () => {
  const { t } = useTranslation('molecules');
  const navigate = useNavigate();

  const [allMolecules, setAllMolecules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showOnlyErrors, setShowOnlyErrors] = useState(false);

  const [filters, setFilters] = useState({
    database: [],
    origem: [],
    nome_planta: [],
    referencia: [],
    geolocalizacao: [],
    atividade: [''],
  });

  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [selectedMolecule, setSelectedMolecule] = useState(null);
  const [detailsMolecule, setDetailsMolecule] = useState(null);
  const optionsMenuRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchMolecules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('molecules/');
      setAllMolecules(response.data);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError(i18n.t('molecules:loadErrorRetry'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMolecules();
  }, []);

  useEffect(() => {
    if (!selectedMolecule) return undefined;

    const handleClickOutside = (event) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setSelectedMolecule(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedMolecule]);

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete')))
      return;

    try {
      await api.delete(`molecules/${id}/`);
      setAllMolecules(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      alert(t('deleteError'));
    }
  };

  const errorCount = useMemo(() => {
    return allMolecules.filter(
      (m) => m.status_processamento === "erro"
    ).length;
  }, [allMolecules]);

  const hasErrors = errorCount > 0;

  const filteredMolecules = useMemo(() => {
    return allMolecules
      .filter((mol) => {
        if (showOnlyErrors && mol.status_processamento !== "erro")
          return false;

        if (
          searchTerm &&
          !(
            normalize(mol.nome_molecula).includes(normalize(searchTerm)) ||
            normalize(mol.nome_planta).includes(normalize(searchTerm)) ||
            normalize(moleculeDatabaseSearchText(mol)).includes(normalize(searchTerm))
          )
        ) return false;

        if (
          filters.database.length &&
          !filters.database.some((db) =>
            moleculeMatchesDatabase(mol, db)
          )
        ) return false;

        if (
          filters.origem.length &&
          !filters.origem.some((o) =>
            normalize(mol.origem).includes(normalize(o.value))
          )
        ) return false;

        if (
          filters.nome_planta.length &&
          !filters.nome_planta.some((p) =>
            normalize(mol.nome_planta).includes(normalize(p.value))
          )
        ) return false;

        if (
          filters.referencia.length &&
          !filters.referencia.some((r) =>
            normalize(mol.referencia).includes(normalize(r.value))
          )
        ) return false;

        if (
          filters.geolocalizacao.length &&
          !filters.geolocalizacao.some((l) =>
            normalize(mol.geolocalizacao).includes(normalize(l.value))
          )
        ) return false;

        const atividadesValidas = filters.atividade.filter((a) => a.trim() !== '');

        if (
          atividadesValidas.length &&
          !atividadesValidas.some((a) =>
            normalize(mol.activity).includes(normalize(a))
          )
        ) return false;

        return true;
      });
  }, [allMolecules, filters, searchTerm, showOnlyErrors]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm, showOnlyErrors]);

  const currentMolecules = useMemo(() => {
    const first = (currentPage - 1) * itemsPerPage;
    return filteredMolecules.slice(first, first + itemsPerPage);
  }, [filteredMolecules, currentPage]);

  const totalPages = Math.ceil(filteredMolecules.length / itemsPerPage);
  const closeOptionsModal = () => setSelectedMolecule(null);
  const closeDetailsModal = () => setDetailsMolecule(null);

  const openDetailsPreview = () => {
    if (!selectedMolecule) return;
    setDetailsMolecule(selectedMolecule);
    setSelectedMolecule(null);
  };

  const toggleOptionsMenu = (molecule) => {
    setSelectedMolecule((current) => (current?.id === molecule.id ? null : molecule));
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-[calc(100vh-160px)] p-6 sm:p-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-transparent dark:border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('listTitle')}
            </h1>

            {hasErrors && (
              <button
                onClick={() => setShowOnlyErrors(!showOnlyErrors)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
                  ${showOnlyErrors
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-orange-100 text-orange-600 hover:bg-orange-200"}`}
                title={t('errorCountTitle', { count: errorCount })}
              >
                ⚠
                <span className="font-semibold">{errorCount}</span>
              </button>
            )}
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {t('backToDashboard')}
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowFiltersModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            {t('advancedFilters')}
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('filterPlaceholder')}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        {loading && <div className="text-center py-10">{t('common:loading')}</div>}
        {error && <div className="text-center py-10 text-red-600">{error}</div>}

        {!loading && !error && currentMolecules.length === 0 && (
          <div className="text-center py-10">{t('noResults')}</div>
        )}

        {!loading && !error && currentMolecules.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left">{t('tableName')}</th>
                  <th className="px-4 py-3 text-left">{t('tableDatabase')}</th>
                  <th className="px-4 py-3 text-left">{t('tableSmiles')}</th>
                  <th className="px-4 py-3 text-center">{t('tableStatus')}</th>
                  <th className="px-4 py-3 text-center">{t('tableOptions')}</th>
                </tr>
              </thead>
              <tbody>
                {currentMolecules.map((mol) => (
                  <tr
                    key={mol.id}
                    className={`border-t border-gray-200 dark:border-gray-700 ${
                      mol.status_processamento === "erro"
                        ? "bg-red-50 dark:bg-red-900/20"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-2">{mol.nome_molecula || '-'}</td>
                    <td className="px-4 py-2">
                      <div
                        className="max-w-xs truncate text-sm font-medium text-indigo-700 dark:text-indigo-300"
                        title={formatMoleculeDatabasesByActiveFilter(mol, filters.database, '-')}
                      >
                        {formatMoleculeDatabasesByActiveFilter(mol, filters.database, '-')}
                      </div>
                    </td>
                    <td className="px-4 py-2 max-w-sm">
                      <div className="truncate text-sm text-gray-700 dark:text-gray-300" title={mol.smiles || '-'}>
                        {mol.smiles || '-'}
                      </div>
                    </td>

                    <td className="px-4 py-2 text-center">
                      {mol.status_processamento === "erro" && (
                        <span
                          title={mol.erro_processamento || t('rdkitError')}
                          className="text-orange-600 text-lg"
                        >
                          ⚠
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-2 text-center relative">
                      <button
                        onClick={() => toggleOptionsMenu(mol)}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title={t('openOptions')}
                      >
                        ⋯
                      </button>

                      {selectedMolecule?.id === mol.id && (
                        <div
                          ref={optionsMenuRef}
                          className="absolute right-4 top-full z-20 mt-2 w-52 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 text-left shadow-lg"
                        >
                          <button
                            onClick={openDetailsPreview}
                            className="block w-full rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            {t('viewDetails')}
                          </button>
                          <button
                            onClick={() => {
                              closeOptionsModal();
                              navigate(`/moleculas/edit/${mol.id}`);
                            }}
                            className="mt-1 block w-full rounded-lg px-3 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                          >
                            {t('edit')}
                          </button>
                          <button
                            onClick={() => {
                              closeOptionsModal();
                              handleDelete(mol.id);
                            }}
                            className="mt-1 block w-full rounded-lg px-3 py-2 text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                          >
                            {t('delete')}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {detailsMolecule && (
        <div
          className="fixed inset-0 z-50 bg-black/50 overflow-y-auto"
          onClick={closeDetailsModal}
        >
          <div className="min-h-full flex items-center justify-center p-4 py-8">
            <div
              className="w-full max-w-6xl rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl max-h-[90vh] overflow-y-auto border border-transparent dark:border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('detailsTitle')}</h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t('detailsPreview')}
                  </p>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {t('common:close')}
                </button>
              </div>

              <MoleculeDetails molecule={detailsMolecule} />
            </div>
          </div>
        </div>
      )}

      {showFiltersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 border border-transparent dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('advancedFilters')}</h2>
              <button onClick={() => setShowFiltersModal(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" aria-label={t('common:close')}>✕</button>
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

export default ListagemMoleculas;
