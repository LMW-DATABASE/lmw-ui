import { useEffect, useState } from "react";
import api from "../../services/api";

export default function NewMoleculeRequestForm() {
  const [form, setForm] = useState({
    nome_editor: "",
    email: "",
    nome_molecula: "",
    smiles: "",
    referencia: "",
    nome_planta: "",
    database: "",
    origem: "",
    activity: "",
  });

  const [databases, setDatabases] = useState([]);

  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = async () => {
    try {
      const res = await api.get("/molecules/databases/");
      setDatabases(res.data);
    } catch (err) {
      console.error("Erro ao buscar databases:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/molecules/requests/public/create/", {
        tipo: "nova",
        nome_editor: form.nome_editor,
        email: form.email,
        payload: {
          nome_molecula: form.nome_molecula,
          smiles: form.smiles,
          referencia: form.referencia,
          nome_planta: form.nome_planta,
          ...(form.database && { database: form.database }),
          ...(form.origem && { origem: form.origem }),
          ...(form.activity && { activity: form.activity }),
        },
      });

      alert("Solicitação enviada!");
      setForm({
        nome_editor: "",
        email: "",
        nome_molecula: "",
        smiles: "",
        referencia: "",
        nome_planta: "",
        database: "",
        origem: "",
        activity: "",
      });
    } catch (err) {
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
      alert(JSON.stringify(err.response?.data));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        placeholder="Seu nome"
        value={form.nome_editor}
        onChange={(e) => setForm({ ...form, nome_editor: e.target.value })}
        className="w-full border p-2 rounded"
        required
      />

      <input
        placeholder="Seu email"
        value={form.email}
        type="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border p-2 rounded"
        required
      />

      <input
        placeholder="Nome da molécula"
        value={form.nome_molecula}
        onChange={(e) => setForm({ ...form, nome_molecula: e.target.value })}
        className="w-full border p-2 rounded"
        required
      />

      <input
        placeholder="SMILES"
        value={form.smiles}
        onChange={(e) => setForm({ ...form, smiles: e.target.value })}
        className="w-full border p-2 rounded"
        required
      />

      <input
        placeholder="Referência"
        value={form.referencia}
        onChange={(e) => setForm({ ...form, referencia: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <input
        placeholder="Nome da planta"
        value={form.nome_planta}
        onChange={(e) => setForm({ ...form, nome_planta: e.target.value })}
        className="w-full border p-2 rounded"
      />

      {/* DATABASE */}
      <select
        value={form.database}
        onChange={(e) => setForm({ ...form, database: e.target.value })}
        className="w-full border p-2 rounded"
      >
        <option value="">Selecione um database</option>
        {databases.map((db) => (
          <option key={db} value={db}>
            {db}
          </option>
        ))}
      </select>

      <input
        placeholder="Origem"
        value={form.origem}
        onChange={(e) => setForm({ ...form, origem: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Atividade"
        value={form.activity}
        onChange={(e) => setForm({ ...form, activity: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Solicitar Nova Molécula
      </button>
    </form>
  );
}