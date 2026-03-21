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

  const [showOnlyErrors, setShowOnlyErrors] = useState(false); // 🔔 NOVO

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

  const fetchMolecules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('molecules/');
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

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja excluir esta molécula?"))
      return;

    try {
      await api.delete(`/api/molecules/${id}/`);
      setAllMolecules(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir molécula");
    }
  };

  // 🔔 CONTADOR DE ERROS
  const errorCount = useMemo(() => {
    return allMolecules.filter(
      (m) => m.status_processamento === "erro"
    ).length;
  }, [allMolecules]);

  const hasErrors = errorCount > 0;

  // 🔹 FILTRO LOCAL + FILTRO DE ERRO
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

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-160px)] p-6 sm:p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Listagem de Moléculas
            </h1>

            {/* 🔔 BOTÃO INTELIGENTE */}
            {hasErrors && (
              <button
                onClick={() => setShowOnlyErrors(!showOnlyErrors)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
                  ${showOnlyErrors
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-orange-100 text-orange-600 hover:bg-orange-200"}`}
                title={`${errorCount} molécula(s) com erro`}
              >
                ⚠
                <span className="font-semibold">{errorCount}</span>
              </button>
            )}
          </div>

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
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentMolecules.map((mol) => (
                  <tr
                    key={mol.id}
                    className={`border-t ${
                      mol.status_processamento === "erro"
                        ? "bg-red-50"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-2">{mol.nome_molecula || '-'}</td>
                    <td className="px-4 py-2">{mol.smiles || '-'}</td>
                    <td className="px-4 py-2">{mol.referencia || '-'}</td>
                    <td className="px-4 py-2">{mol.nome_planta || '-'}</td>
                    <td className="px-4 py-2">{mol.database || '-'}</td>
                    <td className="px-4 py-2">{mol.origem || '-'}</td>
                    <td className="px-4 py-2">{mol.activity || '-'}</td>

                    {/* 🔴 APENAS ERRO */}
                    <td className="px-4 py-2 text-center">
                      {mol.status_processamento === "erro" && (
                        <span
                          title={mol.erro_processamento || "Erro RDKit"}
                          className="text-orange-600 text-lg"
                        >
                          ⚠
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => navigate(`/moleculas/edit/${mol.id}`)}
                        className="text-indigo-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(mol.id)}
                        className="text-red-600 hover:underline"
                      >
                        Apagar
                      </button>
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