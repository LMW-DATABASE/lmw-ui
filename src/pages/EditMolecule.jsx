import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EditMolecule() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/molecules/${id}/`)
      .then(res => {
        setForm(res.data);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/api/molecules/${id}/`, form);
      alert("Molécula atualizada!");
      navigate("/moleculas");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar");
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Editar Molécula
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input name="nome_molecula"
          value={form.nome_molecula || ""}
          onChange={handleChange}
          placeholder="Nome"
          className="w-full border p-2"
        />

        <input name="smiles"
          value={form.smiles || ""}
          onChange={handleChange}
          placeholder="SMILES"
          className="w-full border p-2"
        />

        <input name="nome_planta"
          value={form.nome_planta || ""}
          onChange={handleChange}
          placeholder="Planta"
          className="w-full border p-2"
        />

        <input name="database"
          value={form.database || ""}
          onChange={handleChange}
          placeholder="Database"
          className="w-full border p-2"
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Salvar
        </button>

      </form>
    </div>
  );
}