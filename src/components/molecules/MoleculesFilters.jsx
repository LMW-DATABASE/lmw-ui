import { useState } from "react";

const MoleculesFilters = ({ filters, onApply }) => {
  const [database, setDatabase] = useState(filters.database || []);
  const [nomePlanta, setNomePlanta] = useState(filters.nome_planta || "");
  const [referencia, setReferencia] = useState(filters.referencia || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    onApply({
      database: database ? [database] : [],
      nome_planta: nomePlanta ? [nomePlanta] : [],
      referencia: referencia ? [referencia] : [],
    });
  };

  const handleClear = () => {
    setDatabase("");
    setNomePlanta("");
    setReferencia("");

    onApply({
      database: [],
      nome_planta: [],
      referencia: [],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

        {/* Database */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Database
          </label>
          <select
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todas</option>
            <option value="PubChem">PubChem</option>
            <option value="ChEMBL">ChEMBL</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Nome da Planta */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Planta
          </label>
          <input
            type="text"
            placeholder="Nome da planta"
            value={nomePlanta}
            onChange={(e) => setNomePlanta(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Referência */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Referência
          </label>
          <input
            type="text"
            placeholder="Referência"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Botões */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Limpar
          </button>
        </div>
      </div>
    </form>
  );
};

export default MoleculesFilters;
