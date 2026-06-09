import React from 'react';
import { useTranslation } from 'react-i18next';
import { BeakerIcon, InformationCircleIcon, ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { NOT_INFORMED } from '@/utils/helpers';

const hasMetadataValue = (value) => {
  if (!value) return false;
  const trimmed = String(value).trim();
  return trimmed && trimmed !== NOT_INFORMED;
};

const isLink = (value) => /^https?:\/\//i.test(String(value).trim());

const MoleculeDetails = ({ molecule }) => {
  const { t } = useTranslation('molecules');

  if (!molecule) return null;

  const displayValue = (value) => {
    if (!value) return 'N/A';
    const str = String(value).trim();
    return str === NOT_INFORMED ? t('notInformed') : value;
  };

  const metadataFields = [
    { labelKey: 'reference', value: molecule.referencia, isReference: true },
    { labelKey: 'filterDatabase', value: molecule.database },
    { labelKey: 'origin', value: molecule.origem },
    { labelKey: 'geolocation', value: molecule.geolocalizacao },
  ].filter((field) => hasMetadataValue(field.value));

  const DataRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <span className="text-gray-500 dark:text-gray-400 font-medium">{label}:</span>
      <span className="text-gray-900 dark:text-gray-100 break-all ml-4 text-right font-mono text-sm">
        {displayValue(value)}
      </span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 self-start">
            {molecule.nome_molecula}
          </h1>
          <div
            className="molecule-svg-container w-full aspect-square flex items-center justify-center p-4 bg-white dark:bg-gray-800 border border-indigo-50 dark:border-indigo-900 rounded-xl"
            dangerouslySetInnerHTML={{ __html: molecule.estrutura_svg }}
          />
          <p className="mt-4 text-sm text-indigo-600 font-semibold uppercase tracking-wider">
            {molecule.nome_planta}
          </p>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4 text-indigo-600">
            <InformationCircleIcon className="w-5 h-5" />
            <h2 className="text-lg font-bold">{t('identifiers')}</h2>
          </div>
          <div className="space-y-1">
            <DataRow label={t('molecularFormula')} value={molecule.formula_molecular} />
            <DataRow label={t('fields.smiles')} value={molecule.smiles} />
            <DataRow label="InChI" value={molecule.inchi} />
            <DataRow label="InChI Key" value={molecule.inchikey} />
          </div>
        </div>
      </div>

      {metadataFields.length > 0 && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4 text-slate-600">
            <DocumentTextIcon className="w-5 h-5" />
            <h2 className="text-lg font-bold">{t('metadata')}</h2>
          </div>
          <div className="space-y-3">
            {metadataFields.map((field) => (
              <div key={field.labelKey} className="py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">{t(field.labelKey)}</span>
                {field.isReference && isLink(field.value) ? (
                  <a
                    href={field.value.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-1 text-indigo-600 hover:underline break-all text-sm"
                  >
                    {field.value}
                  </a>
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 mt-1 break-all text-sm">{displayValue(field.value)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4 text-emerald-600">
            <BeakerIcon className="w-5 h-5" />
            <h2 className="text-lg font-bold">{t('physicochemical')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <div>
              <DataRow label={t('averageMass')} value={molecule.mw_average?.toFixed(2)} />
              <DataRow label={t('exactMass')} value={molecule.mw_exact?.toFixed(4)} />
              <DataRow label={t('logp')} value={molecule.logp?.toFixed(2)} />
              <DataRow label={t('tpsa')} value={molecule.tpsa?.toFixed(2)} />
            </div>
            <div>
              <DataRow label={t('hBondDonors')} value={molecule.h_bond_donors} />
              <DataRow label={t('hBondAcceptors')} value={molecule.h_bond_acceptors} />
              <DataRow label={t('heavyAtoms')} value={molecule.heavy_atom_count} />
              <DataRow label={t('aromaticRings')} value={molecule.aromatic_ring_count} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4 text-amber-600">
            <ChartBarIcon className="w-5 h-5" />
            <h2 className="text-lg font-bold">{t('druglikenessScores')}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('qedScore')}</span>
                <span className="text-sm font-bold text-indigo-600">{molecule.qed_score?.toFixed(3)}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${(molecule.qed_score || 0) * 100}%` }}
                ></div>
              </div>
            </div>
            <DataRow label={t('npLikeness')} value={molecule.np_likeness_score?.toFixed(3)} />
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-xs font-bold text-gray-400 uppercase">{t('biologicalActivity')}</span>
              <p className="text-gray-700 dark:text-gray-300 mt-1">{molecule.activity || t('noActivity')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoleculeDetails;
