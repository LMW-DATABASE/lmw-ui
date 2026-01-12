import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Pagination from '../components/common/Pagination';
import MoleculesFilters from '../components/molecules/MoleculesFilters';

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
    atividade: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const normalize = (v) => v?.toString().toLowerCase() || '';

  // 🔹 BUSCA TODAS AS MOLÉCULAS (SEM FILTRO NO BACKEND)
  const fetchMolecules = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/api/molecules/');
      setAllMolecules(response.data);
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

  // 🔹 FILTRO COMPLETO (FRONTEND)
  const filteredMolecules = useMemo(() => {
    return allMolecules.filter((mol) => {
      // busca geral
      if (
        searchTerm &&
        !(
          normalize(mol.nome_molecula).includes(normalize(searchTerm)) ||
          normalize(mol.nome_planta).includes(normalize(searchTerm)) ||
          normalize(mol.database).includes(normalize(searchTerm))
        )
      ) {
        return false;
      }

      // database
      if (
        filters.database.length &&
        !filters.database.some((d) =>
          normalize(mol.database).includes(d.value)
        )
      ) return false;

      // origem
      if (
        filters.origem.length &&
        !filters.origem.some((o) =>
          normalize(mol.origem).includes(o.value)
        )
      ) return false;

      // planta
      if (
        filters.nome_planta.length &&
        !filters.nome_planta.some((p) =>
          normalize(mol.nome_planta).includes(p.value)
        )
      ) return false;

      // referencia
      if (
        filters.referencia.length &&
        !filters.referencia.some((r) =>
          normalize(mol.referencia).includes(r.value)
        )
      ) return false;

      // atividade (palavra-chave)
      if (
        filters.atividade &&
        !normalize(mol.activity).includes(normalize(filters.atividade))
      ) return false;

      return true;
    });
  }, [allMolecules, filters, searchTerm]);

  const currentMolecules = useMemo(() => {
    const first = (currentPage - 1) * itemsPerPage;
    return filteredMolecules.slice(first, first + itemsPerPage);
  }, [filteredMolecules, currentPage]);

  const totalPages = Math.ceil(filteredMolecules.length / itemsPerPage);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-160px)] p-6">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Listagem de Moléculas</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            ← Voltar ao Dashboard
          </button>
        </div>

        <MoleculesFilters filters={filters} onApply={handleApplyFilters} />

        <input
          type="text"
          placeholder="Filtrar por nome, planta ou database..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 mb-6 border rounded-lg"
        />

        {loading && <p className="text-center">Carregando...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && currentMolecules.length === 0 && (
          <p className="text-center">Nenhuma molécula encontrada.</p>
        )}

        {!loading && !error && currentMolecules.length > 0 && (
          <>
            <table className="w-full border rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Nome</th>
                  <th className="px-4 py-2 text-left">Planta</th>
                  <th className="px-4 py-2 text-left">Database</th>
                  <th className="px-4 py-2 text-left">Origem</th>
                  <th className="px-4 py-2 text-left">Atividade</th>
                </tr>
              </thead>
              <tbody>
                {currentMolecules.map((mol) => (
                  <tr key={mol.id} className="border-t">
                    <td className="px-4 py-2">{mol.nome_molecula}</td>
                    <td className="px-4 py-2">{mol.nome_planta}</td>
                    <td className="px-4 py-2">{mol.database}</td>
                    <td className="px-4 py-2">{mol.origem}</td>
                    <td className="px-4 py-2">{mol.activity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ListagemMoleculas;
