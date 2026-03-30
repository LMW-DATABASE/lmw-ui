import { useEffect, useState } from "react";
import api from "../../services/api";

export default function CorrectionRequestForm() {
  const [form, setForm] = useState({
    nome_editor: "",
    email: "",
    molecule: "",
    campo: "",
    valor_sugerido: "",
    justificativa: "",
    database: "",
  });

  const [molecules, setMolecules] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMolecules();
    fetchDatabases();
  }, []);

  const fetchMolecules = async () => {
    try {
      const res = await api.get("/molecules/");
      setMolecules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDatabases = async () => {
    try {
      const res = await api.get("/molecules/databases"); // ✔ sem barra
      setDatabases(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/molecules/requests/public/create/", {
        tipo: "correcao",
        nome_editor: form.nome_editor,
        email: form.email,
        molecula_alvo: form.molecule,
        payload: {
          campo: form.campo,
          valor_sugerido: form.valor_sugerido,
          justificativa: form.justificativa,
          novo_database: form.database,
        },
      });

      alert("Correção enviada!");
    } catch (err) {
      console.error("Erro:", err.response?.data || err);
      alert("Erro ao enviar");
    }
  };

  const filteredMolecules = molecules.filter((m) =>
    m.nome_molecula?.toLowerCase().includes(search.toLowerCase())
  );

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
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border p-2 rounded"
        required
      />

      <div>
        <label className="block text-sm font-medium mb-1">
          Buscar Molécula
        </label>
        <input
          type="text"
          placeholder="Digite o nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Selecione a molécula
        </label>
        <select
          value={form.molecule}
          onChange={(e) => setForm({ ...form, molecule: e.target.value })}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Selecione...</option>
          {filteredMolecules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome_molecula}
            </option>
          ))}
        </select>
      </div>

      <select
        value={form.campo}
        onChange={(e) => setForm({ ...form, campo: e.target.value })}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Campo a corrigir</option>
        <option value="nome_molecula">Nome</option>
        <option value="smiles">SMILES</option>
        <option value="referencia">Referência</option>
        <option value="nome_planta">Planta</option>
        <option value="database">Database</option>
        <option value="origem">Origem</option>
        <option value="activity">Atividade</option>
      </select>

      <select
        value={form.database}
        onChange={(e) => setForm({ ...form, database: e.target.value })}
        className="w-full border p-2 rounded"
      >
        <option value="">Database (opcional)</option>
        {databases.map((db) => (
          <option key={db.id} value={db.id}>
            {db.nome}
          </option>
        ))}
      </select>

      <input
        placeholder="Valor sugerido"
        value={form.valor_sugerido}
        onChange={(e) => setForm({ ...form, valor_sugerido: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Justificativa"
        value={form.justificativa}
        onChange={(e) => setForm({ ...form, justificativa: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <button className="bg-indigo-600 text-white px-4 py-2 rounded">
        Enviar Correção
      </button>
    </form>
  );
}