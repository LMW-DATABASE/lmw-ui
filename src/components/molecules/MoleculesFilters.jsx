import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import api from '../../services/api';
import { NOT_INFORMED } from '@/utils/helpers';
import { createDefaultMoleculeFilters } from '@/utils/moleculeFilters';
import RangeFilter from './RangeFilter';

const MoleculesFilters = ({ filters, onApply }) => {
  const { t } = useTranslation('molecules');
  const [activeTab, setActiveTab] = useState('metadata');
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

  const updateRange = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setLocalFilters(createDefaultMoleculeFilters());
  };

  const rangePlaceholders = {
    min: t('rangeMin'),
    max: t('rangeMax'),
  };

  const renderMetadataTab = () => (
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
  );

  const renderMolecularTab = () => {
    const sectionClass = 'text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-2.5';
    const stackClass = 'flex flex-col gap-2.5';

    const rangeProps = {
      minPlaceholder: rangePlaceholders.min,
      maxPlaceholder: rangePlaceholders.max,
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-0 max-h-[50vh] overflow-y-auto pr-1">
        <div className="space-y-4 md:pr-6">
          <div>
            <h3 className={sectionClass}>{t('filterSectionMass')}</h3>
            <div className={stackClass}>
              <RangeFilter
                label={t('averageMass')}
                value={localFilters.mw_average}
                onChange={(value) => updateRange('mw_average', value)}
                step="0.01"
                {...rangeProps}
              />
              <RangeFilter
                label={t('exactMass')}
                value={localFilters.mw_exact}
                onChange={(value) => updateRange('mw_exact', value)}
                step="0.0001"
                {...rangeProps}
              />
            </div>
          </div>

          <div>
            <h3 className={sectionClass}>{t('filterSectionStructure')}</h3>
            <div className={stackClass}>
              <RangeFilter
                label={t('heavyAtoms')}
                value={localFilters.heavy_atom_count}
                onChange={(value) => updateRange('heavy_atom_count', value)}
                step="1"
                {...rangeProps}
              />
              <RangeFilter
                label={t('rotatableBonds')}
                value={localFilters.rotatable_bonds}
                onChange={(value) => updateRange('rotatable_bonds', value)}
                step="1"
                {...rangeProps}
              />
              <RangeFilter
                label={t('totalRings')}
                value={localFilters.ring_count}
                onChange={(value) => updateRange('ring_count', value)}
                step="1"
                {...rangeProps}
              />
              <RangeFilter
                label={t('aromaticRings')}
                value={localFilters.aromatic_ring_count}
                onChange={(value) => updateRange('aromatic_ring_count', value)}
                step="1"
                {...rangeProps}
              />
              <RangeFilter
                label={t('fractionCsp3')}
                value={localFilters.fraction_csp3}
                onChange={(value) => updateRange('fraction_csp3', value)}
                step="0.01"
                {...rangeProps}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 md:border-l md:border-gray-200 md:dark:border-gray-700 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 border-gray-200 dark:border-gray-700">
          <div>
            <h3 className={sectionClass}>{t('filterSectionPhysicochemical')}</h3>
            <div className={stackClass}>
              <RangeFilter
                label={t('logp')}
                value={localFilters.logp}
                onChange={(value) => updateRange('logp', value)}
                step="0.1"
                {...rangeProps}
              />
              <RangeFilter
                label={t('tpsa')}
                value={localFilters.tpsa}
                onChange={(value) => updateRange('tpsa', value)}
                step="0.1"
                {...rangeProps}
              />
              <RangeFilter
                label={t('hBondDonors')}
                value={localFilters.h_bond_donors}
                onChange={(value) => updateRange('h_bond_donors', value)}
                step="1"
                {...rangeProps}
              />
              <RangeFilter
                label={t('hBondAcceptors')}
                value={localFilters.h_bond_acceptors}
                onChange={(value) => updateRange('h_bond_acceptors', value)}
                step="1"
                {...rangeProps}
              />
            </div>
          </div>

          <div>
            <h3 className={sectionClass}>{t('filterSectionScores')}</h3>
            <div className={stackClass}>
              <RangeFilter
                label={t('qedScore')}
                value={localFilters.qed_score}
                onChange={(value) => updateRange('qed_score', value)}
                step="0.01"
                {...rangeProps}
              />
              <RangeFilter
                label={t('npLikeness')}
                value={localFilters.np_likeness_score}
                onChange={(value) => updateRange('np_likeness_score', value)}
                step="0.01"
                {...rangeProps}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab('metadata')}
          className={`px-3 py-1.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            activeTab === 'metadata'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {t('filtersTabMetadata')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('molecular')}
          className={`px-3 py-1.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            activeTab === 'molecular'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {t('filtersTabMolecular')}
        </button>
      </div>

      {activeTab === 'metadata' ? renderMetadataTab() : renderMolecularTab()}

      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={clearFilters}
          className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {t('clearFilters')}
        </button>

        <button
          onClick={() => onApply(localFilters)}
          className="px-5 py-1.5 text-sm bg-indigo-600 text-white rounded-lg"
        >
          {t('applyFilters')}
        </button>
      </div>
    </div>
  );
};

export default MoleculesFilters;
