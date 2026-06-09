import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import api from '../../services/api';
import { NOT_INFORMED } from '@/utils/helpers';

const MoleculesFilters = ({ filters, onApply }) => {
  const { t } = useTranslation('molecules');
  const [options, setOptions] = useState({
    database: [],
    origem: [],
    nome_planta: [],
    referencia: [],
    geolocalizacao: [],
  });

  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get('molecules/');
        const data = res.data;

        const unique = (key) =>
          [...new Set(
            data
              .map((i) => i[key])
              .filter((v) => v && v !== NOT_INFORMED)
          )].map((v) => ({
            label: v,
            value: v,
          }));

        setOptions({
          database: unique('database'),
          origem: unique('origem'),
          nome_planta: unique('nome_planta'),
          referencia: unique('referencia'),
          geolocalizacao: unique('geolocalizacao'),
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchOptions();
  }, []);

  const toggleDatabase = (value) => {
    setLocalFilters((prev) => {
      const exists = prev.database.includes(value);
      return {
        ...prev,
        database: exists
          ? prev.database.filter((v) => v !== value)
          : [...prev.database, value],
      };
    });
  };

  const addAtividade = () => {
    setLocalFilters((p) => ({
      ...p,
      atividade: [...p.atividade, ''],
    }));
  };

  const updateAtividade = (index, value) => {
    setLocalFilters((p) => {
      const copy = [...p.atividade];
      copy[index] = value;
      return { ...p, atividade: copy };
    });
  };

  const removeAtividade = (index) => {
    setLocalFilters((p) => ({
      ...p,
      atividade: p.atividade.filter((_, i) => i !== index),
    }));
  };

  const clearFilters = () => {
    setLocalFilters({
      database: [],
      origem: [],
      nome_planta: [],
      referencia: [],
      geolocalizacao: [],
      atividade: [''],
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-semibold mb-3">{t('filterDatabase')}</label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            {options.database.map((db) => (
              <label key={db.value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={localFilters.database.includes(db.value)}
                  onChange={() => toggleDatabase(db.value)}
                />
                {db.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">{t('filterOrigin')}</label>
          <Select
            isMulti
            options={options.origem}
            value={localFilters.origem}
            onChange={(v) =>
              setLocalFilters((p) => ({ ...p, origem: v }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">{t('filterPlantName')}</label>
          <Select
            isMulti
            options={options.nome_planta}
            value={localFilters.nome_planta}
            onChange={(v) =>
              setLocalFilters((p) => ({ ...p, nome_planta: v }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">{t('filterReference')}</label>
          <Select
            isMulti
            options={options.referencia}
            value={localFilters.referencia}
            onChange={(v) =>
              setLocalFilters((p) => ({ ...p, referencia: v }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">{t('filterGeolocation')}</label>
          <Select
            isMulti
            options={options.geolocalizacao}
            value={localFilters.geolocalizacao}
            onChange={(v) =>
              setLocalFilters((p) => ({ ...p, geolocalizacao: v }))
            }
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">
            {t('filterActivities')}
          </label>

          <div className="space-y-3">
            {localFilters.atividade.map((a, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={a}
                  onChange={(e) => updateAtividade(i, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder={t('activityPlaceholder')}
                />
                {localFilters.atividade.length > 1 && (
                  <button
                    onClick={() => removeAtividade(i)}
                    className="px-3 bg-red-100 rounded-lg"
                    aria-label={t('common:close')}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addAtividade}
              className="text-indigo-600 text-sm hover:underline"
            >
              {t('addActivity')}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {t('clearFilters')}
        </button>

        <button
          onClick={() => onApply(localFilters)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
        >
          {t('applyFilters')}
        </button>
      </div>
    </div>
  );
};

export default MoleculesFilters;
