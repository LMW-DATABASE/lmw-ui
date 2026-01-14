import React from 'react';
import { BeakerIcon, InformationCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const MoleculeDetails = ({ molecule }) => {
  if (!molecule) return null;

  const DataRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 font-medium">{label}:</span>
      <span className="text-gray-900 break-all ml-4 text-right font-mono text-sm">
        {value || 'N/A'}
      </span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Cabeçalho e Imagem Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 self-start">
            {molecule.nome_molecula}
          </h1>
          <div 
            className="w-full aspect-square flex items-center justify-center p-4 bg-white border border-indigo-50 rounded-xl"
            dangerouslySetInnerHTML={{ __html: molecule.estrutura_svg }} 
          />
          <p className="mt-4 text-sm text-indigo-600 font-semibold uppercase tracking-wider">
            {molecule.nome_planta}
          </p>
        </div>

        {/* Identificadores Estruturais */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-indigo-600">
            <InformationCircleIcon className="w-5 h-5" />
            <h2 className="text-lg font-bold">Identificadores</h2>
          </div>
          <div className="space-y-1">
            <DataRow label="Fórmula Molecular" value={molecule.formula_molecular} />
            <DataRow label="SMILES" value={molecule.smiles} />
            <DataRow label="InChI" value={molecule.inchi} />
            <DataRow label="InChI Key" value={molecule.inchikey} />
            <DataRow label="Scaffold (Murcko)" value={molecule.murcko_scaffold} />
          </div>
        </div>
      </div>

      {/* Grid de Propriedades Técnicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Propriedades Físico-Químicas */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-emerald-600">
            <BeakerIcon className="w-5 h-5" />
            <h2 className="text-lg font-bold">Propriedades Físico-Químicas</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <div>
              <DataRow label="Massa Média" value={molecule.mw_average?.toFixed(2)} />
              <DataRow label="Massa Exata" value={molecule.mw_exact?.toFixed(4)} />
              <DataRow label="LogP (Lipofilicidade)" value={molecule.logp?.toFixed(2)} />
              <DataRow label="TPSA" value={molecule.tpsa?.toFixed(2)} />
            </div>
            <div>
              <DataRow label="H-Bond Donors" value={molecule.h_bond_donors} />
              <DataRow label="H-Bond Acceptors" value={molecule.h_bond_acceptors} />
              <DataRow label="Átomos Pesados" value={molecule.heavy_atom_count} />
              <DataRow label="Anéis Aromáticos" value={molecule.aromatic_ring_count} />
            </div>
          </div>
        </div>

        {/* Scores e Qualidade */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-amber-600">
            <ChartBarIcon className="w-5 h-5" />
            <h2 className="text-lg font-bold">Scores de Druglikeness</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">QED Score (Qualidade)</span>
                <span className="text-sm font-bold text-indigo-600">{molecule.qed_score?.toFixed(3)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${(molecule.qed_score || 0) * 100}%` }}
                ></div>
              </div>
            </div>
            <DataRow label="NP-Likeness Score" value={molecule.np_likeness_score?.toFixed(3)} />
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-xs font-bold text-gray-400 uppercase">Atividade Biológica</span>
              <p className="text-gray-700 mt-1">{molecule.activity || 'Nenhuma atividade registrada.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoleculeDetails;