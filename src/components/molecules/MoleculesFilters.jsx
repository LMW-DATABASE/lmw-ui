import Select from 'react-select';

const MoleculesFilters = ({ filters, onApply }) => {
  const handleApply = (e) => {
    e.preventDefault();
    onApply(filters);
  };

  const handleClear = () => {
    onApply({
      database: [],
      origem: [],
      nome_planta: [],
      referencia: [],
      atividade: '',
    });
  };

  return (
    <form
      onSubmit={handleApply}
      className="bg-gray-50 border rounded-lg p-4 mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">

        {/* DATABASE */}
        <div>
          <label className="text-sm font-medium">Database</label>
          <Select
            isMulti
            isSearchable
            value={filters.database}
            onChange={(v) =>
              onApply({ ...filters, database: v || [] })
            }
            placeholder="Selecione..."
            options={[
              { value: 'pubchem', label: 'PubChem' },
              { value: 'chembl', label: 'ChEMBL' },
              { value: 'drugbank', label: 'DrugBank' },
            ]}
          />
        </div>

        {/* ORIGEM */}
        <div>
          <label className="text-sm font-medium">Origem</label>
          <Select
            isMulti
            isSearchable
            value={filters.origem}
            onChange={(v) =>
              onApply({ ...filters, origem: v || [] })
            }
            placeholder="Selecione..."
            options={[
              { value: 'sementes', label: 'Sementes' },
              { value: 'rizoma', label: 'Rizoma' },
              { value: 'extrato vegetal', label: 'Extrato vegetal' },
            ]}
          />
        </div>

        {/* PLANTA */}
        <div>
          <label className="text-sm font-medium">Planta</label>
          <Select
            isMulti
            isSearchable
            value={filters.nome_planta}
            onChange={(v) =>
              onApply({ ...filters, nome_planta: v || [] })
            }
            placeholder="Buscar planta..."
            options={[]}
            noOptionsMessage={() => 'Digite para buscar'}
          />
        </div>

        {/* REFERÊNCIA */}
        <div>
          <label className="text-sm font-medium">Referência</label>
          <Select
            isMulti
            isSearchable
            value={filters.referencia}
            onChange={(v) =>
              onApply({ ...filters, referencia: v || [] })
            }
            placeholder="Buscar referência..."
            options={[]}
            noOptionsMessage={() => 'Digite para buscar'}
          />
        </div>

        {/* ATIVIDADE */}
        <div>
          <label className="text-sm font-medium">Atividade</label>
          <input
            type="text"
            value={filters.atividade}
            onChange={(e) =>
              onApply({ ...filters, atividade: e.target.value })
            }
            placeholder="Palavra-chave"
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* BOTÕES */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-200 px-4 py-2 rounded-lg"
          >
            Limpar
          </button>
        </div>

      </div>
    </form>
  );
};

export default MoleculesFilters;
