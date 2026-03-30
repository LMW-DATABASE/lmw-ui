import { useState } from "react";
import NewMoleculeRequestForm from "../components/requests/NewMoleculeRequestForm";
import CorrectionRequestForm from "../components/requests/CorrectionRequestForm";

const CommunityRequests = () => {
  const [mode, setMode] = useState("new");

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-160px)] p-6 sm:p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Contribuições da Comunidade
        </h1>

        <p className="text-gray-600 mb-6">
          Pesquisadores podem sugerir novas moléculas ou solicitar correções nos dados existentes.
          Todas as contribuições serão revisadas antes de serem adicionadas ao sistema.
        </p>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode("new")}
            className={`px-4 py-2 rounded-lg ${mode === "new" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
          >
            Nova Molécula
          </button>

          <button
            onClick={() => setMode("correction")}
            className={`px-4 py-2 rounded-lg ${mode === "correction" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
          >
            Corrigir Dados
          </button>
        </div>

        {mode === "new" && <NewMoleculeRequestForm />}
        {mode === "correction" && <CorrectionRequestForm />}

      </div>
    </div>
  );
};

export default CommunityRequests;