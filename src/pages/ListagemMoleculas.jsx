import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Pagination from '../components/common/Pagination';
import MoleculesFilters from '../components/molecules/MoleculesFilters';

const normalize = (v) => v?.toString().toLowerCase().trim() || '';

const ListagemMoleculas = () => {
  const navigate = useNavigate();

  const [allMolecules, setAllMolecules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    database: [],
    origem: [],
    nome_planta: [],
    referencia: [],
    atividade: [''], // 🔹 múltiplas atividades (OR)
  });

  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchMolecules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/molecules/');
      setAllMolecules(response.data);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMolecules();
  }, []);

  // 🔹 FILTRO LOCAL
  const filteredMolecules = useMemo(() => {
    return allMolecules.filter((mol) => {
      if (
        searchTerm &&
        !(
          normalize(mol.nome_molecula).includes(normalize(searchTerm)) ||
          normalize(mol.nome_planta).includes(normalize(searchTerm)) ||
          normalize(mol.database).includes(normalize(searchTerm))
        )
      ) return false;

      if (
        filters.database.length &&
        !filters.database.some((db) =>
          normalize(mol.database) === normalize(db)
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

      // 🔹 ATIVIDADES — OR (apenas uma precisa bater)
      const atividadesValidas = filters.atividade.filter((a) => a.trim() !== '');

      if (
        atividadesValidas.length &&
        !atividadesValidas.some((a) =>
          normalize(mol.activity).includes(normalize(a))
        )
      ) return false;

      return true;
    });
  }, [allMolecules, filters, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm]);

  const currentMolecules = useMemo(() => {
    const first = (currentPage - 1) * itemsPerPage;
    return filteredMolecules.slice(first, first + itemsPerPage);
  }, [filteredMolecules, currentPage]);

  const totalPages = Math.ceil(filteredMolecules.length / itemsPerPage);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-160px)] p-6 sm:p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Listagem de Moléculas
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            ← Voltar ao Dashboard
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowFiltersModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            🔍 Filtros avançados
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por nome da molécula, planta ou database..."
            className="w-full px-4 py-3 border rounded-lg"
          />
        </div>

        {loading && <div className="text-center py-10">Carregando...</div>}
        {error && <div className="text-center py-10 text-red-600">{error}</div>}

        {!loading && !error && currentMolecules.length === 0 && (
          <div className="text-center py-10">Nenhuma molécula encontrada.</div>
        )}

        {!loading && !error && currentMolecules.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Nome</th>
                  <th className="px-4 py-3 text-left">SMILES</th>
                  <th className="px-4 py-3 text-left">Referência</th>
                  <th className="px-4 py-3 text-left">Planta</th>
                  <th className="px-4 py-3 text-left">Database</th>
                  <th className="px-4 py-3 text-left">Origem</th>
                  <th className="px-4 py-3 text-left">Atividade</th>
                  <th className="px-4 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentMolecules.map((mol) => (
                  <tr key={mol.id} className="border-t">
                    <td className="px-4 py-2">{mol.nome_molecula || '-'}</td>
                    <td className="px-4 py-2">{mol.smiles || '-'}</td>
                    <td className="px-4 py-2">{mol.referencia || '-'}</td>
                    <td className="px-4 py-2">{mol.nome_planta || '-'}</td>
                    <td className="px-4 py-2">{mol.database || '-'}</td>
                    <td className="px-4 py-2">{mol.origem || '-'}</td>
                    <td className="px-4 py-2">{mol.activity || '-'}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button className="text-indigo-600 hover:underline">Editar</button>
                      <button className="text-red-600 hover:underline">Apagar</button>
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

      {showFiltersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filtros avançados</h2>
              <button onClick={() => setShowFiltersModal(false)}>✕</button>
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
