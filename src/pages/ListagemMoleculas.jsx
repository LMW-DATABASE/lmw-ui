import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Pagination from '../components/common/Pagination';

const ListagemMoleculas = () => {
  const navigate = useNavigate();
  const [allMolecules, setAllMolecules] = useState([]);
  const [filteredMolecules, setFilteredMolecules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchAllMolecules = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/api/molecules/');
        setAllMolecules(response.data);
        setFilteredMolecules(response.data);
      } catch (err) {
        console.error("Erro ao buscar moléculas:", err);
        setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllMolecules();
  }, []);

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
  }, [filteredMolecules, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredMolecules.length / itemsPerPage);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-160px)] p-6 sm:p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Listagem de Moléculas</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            ← Voltar ao Dashboard
          </button>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por nome da molécula, planta ou database..."
            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {loading && (
          <div className="text-center py-10 text-gray-600">Carregando moléculas...</div>
        )}

        {error && (
          <div className="text-center py-10 text-red-600">{error}</div>
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SMILES</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Referência</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Planta</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Database</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Origem</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Atividade</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Ações</th>
              </tr>
              </thead>
              <tbody>
              {currentMolecules.map((mol) => (
                <tr key={mol.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 break-words whitespace-normal max-w-[200px]">{mol.nome_molecula || '-'}</td>
                  <td className="px-4 py-2 break-words whitespace-normal max-w-[200px]">{mol.smiles || '-'}</td>
                  <td className="px-4 py-2 break-words whitespace-normal max-w-[200px]">{mol.referencia || '-'}</td>
                  <td className="px-4 py-2 break-words whitespace-normal max-w-[200px]">{mol.nome_planta || '-'}</td>
                  <td className="px-4 py-2 break-words whitespace-normal max-w-[150px]">{mol.database || '-'}</td>
                  <td className="px-4 py-2 break-words whitespace-normal max-w-[150px]">{mol.origem || '-'}</td>
                  <td className="px-4 py-2 break-words whitespace-normal max-w-[150px]">{mol.activity || '-'}</td>

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

        {/* Paginação */}
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
