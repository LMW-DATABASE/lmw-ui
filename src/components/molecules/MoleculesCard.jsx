import React from 'react';
import { Link } from 'react-router-dom';

const MoleculeCard = ({ molecule }) => {
  return (
    <Link to={`/molecules/${molecule.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:border-indigo-500">
        
        {/* Área da Imagem 2D */}
        <div className="w-full h-48 bg-white flex items-center justify-center border-b border-gray-100 p-2">
          {molecule.estrutura_svg ? (
            <div 
              className="w-full h-full flex items-center justify-center molecule-svg-container"
              dangerouslySetInnerHTML={{ __html: molecule.estrutura_svg }} 
            />
          ) : (
            <span className="text-gray-400 text-sm italic">Imagem não disponível</span>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 truncate" title={molecule.nome_molecula}>
            {molecule.nome_molecula}
          </h3>
          
          <div className="mt-2 space-y-1">
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
              {molecule.nome_planta || 'Planta não informada'}
            </p>
            <p className="text-sm text-gray-500 truncate" title={molecule.smiles}>
              <span className="font-semibold text-gray-700">SMILES:</span> {molecule.smiles}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MoleculeCard;