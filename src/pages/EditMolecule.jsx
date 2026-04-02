import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { normalizeMoleculeFormData } from "../utils/helpers";

export default function EditMolecule() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMolecule = async () => {
      try {
        const res = await api.get(`/api/molecules/${id}/`);
        setForm(res.data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar molécula.");
      } finally {
        setLoading(false);
      }
    };

    fetchMolecule();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.put(`/api/molecules/${id}/`, normalizeMoleculeFormData(form));
      alert("Molécula atualizada com sucesso!");
      navigate("/moleculas");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Erro ao atualizar molécula.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Carregando...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-160px)] p-6 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Editar Molécula
          </h1>
          <button
            onClick={() => navigate("/moleculas")}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            ← Voltar
          </button>
        </div>

        {/* Status RDKit */}
        {form.status_processamento === "erro" && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            <strong>Falha no processamento RDKit:</strong>
            <div className="mt-1 text-sm">
              {form.erro_processamento || "Erro desconhecido"}
            </div>
          </div>
        )}

        {form.status_processamento === "ok" && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
            Molécula processada corretamente.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Informações Básicas */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Informações Básicas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nome da Molécula
                </label>
                <input
                  name="nome_molecula"
                  value={form.nome_molecula || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Database
                </label>
                <input
                  name="database"
                  value={form.database || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Planta
                </label>
                <input
                  name="nome_planta"
                  value={form.nome_planta || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Origem
                </label>
                <input
                  name="origem"
                  value={form.origem || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

            </div>
          </div>

          {/* Estrutura */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Estrutura Química
            </h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                SMILES
              </label>
              <input
                name="smiles"
                value={form.smiles || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ao alterar o SMILES, o RDKit será reprocessado automaticamente.
              </p>
            </div>
          </div>

          {/* Referência e Atividade */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Referência e Atividade
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Referência
                </label>
                <input
                  name="referencia"
                  value={form.referencia || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Atividade
                </label>
                <textarea
                  name="activity"
                  value={form.activity || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/moleculas")}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}