import Select from 'react-select';
import { useState } from 'react';

const MoleculesFilters = ({ filters, onApply }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(localFilters);
  };

  const handleClear = () => {
    const cleared = {
      database: [],
      origem: [],
      nome_planta: [],
      referencia: [],
      atividade: '',
    };
    setLocalFilters(cleared);
    onApply(cleared);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

        <Select
          isMulti
          isSearchable
          placeholder="Database"
          value={localFilters.database}
          onChange={(v) => handleChange('database', v)}
          options={[
            { value: 'pubchem', label: 'PubChem' },
            { value: 'chembl', label: 'ChEMBL' },
          ]}
        />

        <Select
          isMulti
          isSearchable
          placeholder="Origem"
          value={localFilters.origem}
          onChange={(v) => handleChange('origem', v)}
          options={[
            { value: 'sementes', label: 'Sementes' },
            { value: 'extrato vegetal', label: 'Extrato vegetal' },
          ]}
        />

        <Select
          isMulti
          isSearchable
          placeholder="Planta"
          value={localFilters.nome_planta}
          onChange={(v) => handleChange('nome_planta', v)}
          options={[]}
        />

        <Select
          isMulti
          isSearchable
          placeholder="Referência"
          value={localFilters.referencia}
          onChange={(v) => handleChange('referencia', v)}
          options={[]}
        />

        <input
          type="text"
          placeholder="Atividade (palavra-chave)"
          value={localFilters.atividade}
          onChange={(e) => handleChange('atividade', e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />

        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
            Filtrar
          </button>
          <button type="button" onClick={handleClear} className="px-4 py-2 bg-gray-200 rounded-lg">
            Limpar
          </button>
        </div>
      </div>
    </form>
  );
};

export default MoleculesFilters;
