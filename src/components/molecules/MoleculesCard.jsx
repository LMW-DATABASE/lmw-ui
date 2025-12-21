import React from 'react';
import { Link } from 'react-router-dom';

const MoleculeCard = ({ molecule }) => {
  return (
    <Link to={`/molecules/${molecule.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:border-indigo-500">

        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Imagem 2D da Molécula</span>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 truncate" title={molecule.nome_molecula}>
            {molecule.nome_molecula}
          </h3>
          <p className="text-sm text-gray-500 mt-1 truncate" title={molecule.smiles}>
            {molecule.smiles}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MoleculeCard;
