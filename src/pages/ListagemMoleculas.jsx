import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Pagination from '../components/common/Pagination';
import MoleculesFilters from '../components/molecules/MoleculesFilters';

const ListagemMoleculas = () => {
  const navigate = useNavigate();

  const [allMolecules, setAllMolecules] = useState([]);
  const [filteredMolecules, setFilteredMolecules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    database: [],
    referencia: [],
    nome_planta: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchMolecules = async (appliedFilters = filters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      appliedFilters.database.forEach((db) =>
        params.append('database', db)
      );
      appliedFilters.referencia.forEach((ref) =>
        params.append('referencia', ref)
      );
      appliedFilters.nome_planta.forEach((planta) =>
        params.append('nome_planta', planta)
      );

      const response = await api.get(`/api/molecules/?${params.toString()}`);

      setAllMolecules(response.data);
      setFilteredMolecules(response.data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Erro ao buscar moléculas:', err);
      setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // carga inicial
  useEffect(() => {
    fetchMolecules();
  }, []);

  // filtro por texto (local)
  useEffect(() => {
    if (!searchTerm) {
      setFilteredMolecules(allMolecules);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      setFilteredMolecules(
        allMolecules.filter(
          (mol) =>
            mol.nome_molecula?.toLowerCase().includes(lowerSearch) ||
            mol.nome_planta?.toLowerCase().includes(lowerSearch) ||
            mol.database?.toLowerCase().includes(lowerSearch)
        )
      );
    }
    setCurrentPage(1);
  }, [searchTerm, allMolecules]);

  const currentMolecules = useMemo(() => {
    const first = (currentPage - 1) * itemsPerPage;
    const last = first + itemsPerPage;
    return filteredMolecules.slice(first, last);
  }, [filteredMolecules, currentPage]);

  const totalPages = Math.ceil(filteredMolecules.length / itemsPerPage);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    fetchMolecules(newFilters);
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-160px)] p-6 sm:p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Listagem de Moléculas
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            ← Voltar ao Dashboard
          </button>
        </div>

        {/* 🔹 FILTROS AVANÇADOS */}
        <MoleculesFilters
          filters={filters}
          onApply={handleApplyFilters}
        />

        {/* 🔹 BUSCA TEXTO */}
        <div className="mb-6 mt-4 flex items-center gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por nome da molécula, planta ou database..."
            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {loading && (
          <div className="text-center py-10 text-gray-600">
            Carregando moléculas...
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && currentMolecules.length === 0 && (
          <div className="text-center py-10 text-gray-600">
            Nenhuma molécula encontrada.
          </div>
        )}

        {!loading && !error && currentMolecules.length > 0 && (
          <div className="w-full overflow-hidden">
            <table className="w-full border border-gray-200 rounded-lg table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nome</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">SMILES</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Referência</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Planta</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Database</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Origem</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Atividade</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentMolecules.map((mol) => (
                  <tr key={mol.id} className="border-t hover:bg-gray-50">
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

        {!loading && !error && filteredMolecules.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListagemMoleculas;
