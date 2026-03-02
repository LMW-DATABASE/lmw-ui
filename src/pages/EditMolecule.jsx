import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

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
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.put(`/api/molecules/${id}/`, form);
      alert("Molécula atualizada com sucesso!");
      navigate("/moleculas");
    } catch (err) {
      console.error(err);

      // 🔹 Mostra erro vindo da API (ex: falha RDKit)
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Erro ao atualizar molécula.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Editar Molécula
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          name="nome_molecula"
          value={form.nome_molecula || ""}
          onChange={handleChange}
          placeholder="Nome"
          className="w-full border p-2 rounded"
        />

        <input
          name="smiles"
          value={form.smiles || ""}
          onChange={handleChange}
          placeholder="SMILES"
          className="w-full border p-2 rounded"
        />

        <input
          name="nome_planta"
          value={form.nome_planta || ""}
          onChange={handleChange}
          placeholder="Planta"
          className="w-full border p-2 rounded"
        />

        <input
          name="database"
          value={form.database || ""}
          onChange={handleChange}
          placeholder="Database"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={saving}
          className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>

      </form>
    </div>
  );
}