import { useEffect, useState } from 'react';
import Select from 'react-select';
import api from '../../services/api';

const MoleculesFilters = ({ filters, onApply }) => {
  const [plantasOptions, setPlantasOptions] = useState([]);
  const [referenciasOptions, setReferenciasOptions] = useState([]);

  /* 🔹 Carrega opções dinâmicas */
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const res = await api.get('/api/molecules/');

        const plantas = [
          ...new Set(
            res.data
              .map(m => m.nome_planta)
              .filter(Boolean)
          ),
        ].map(p => ({ value: p, label: p }));

        const refs = [
          ...new Set(
            res.data
              .map(m => m.referencia)
              .filter(Boolean)
          ),
        ].map(r => ({ value: r, label: r }));

        setPlantasOptions(plantas);
        setReferenciasOptions(refs);
      } catch (err) {
        console.error('Erro ao carregar filtros:', err);
      }
    };

    loadOptions();
  }, []);

  const handleSubmit = (e) => {
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
      onSubmit={handleSubmit}
      className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6"
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
              { value: 'PubChem', label: 'PubChem' },
              { value: 'ChEMBL', label: 'ChEMBL' },
              { value: 'DrugBank', label: 'DrugBank' },
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
            options={plantasOptions}
            noOptionsMessage={() => 'Nenhuma planta encontrada'}
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
            options={referenciasOptions}
            noOptionsMessage={() => 'Nenhuma referência encontrada'}
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
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Limpar
          </button>
        </div>

      </div>
    </form>
  );
};

export default MoleculesFilters;
