import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import MoleculeDetails from '../components/molecules/MoleculeDetails';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const MoleculeDetailsPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [molecule, setMolecule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoleculeData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/molecules/${id}/`);
        setMolecule(response.data);
      } catch (err) {
        console.error("Erro ao carregar detalhes:", err);
        setError("Molécula não encontrada ou erro na conexão.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMoleculeData();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={() => navigate('/')} className="text-indigo-600 hover:underline">
        Voltar para a busca
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Voltar para resultados
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <MoleculeDetails molecule={molecule} />
      </div>
    </div>
  );
};

export default MoleculeDetailsPage;