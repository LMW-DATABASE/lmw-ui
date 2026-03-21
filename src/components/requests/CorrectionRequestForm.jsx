import { useEffect, useState } from "react";
import api from "../../services/api";

export default function CorrectionRequestForm() {
  const [form, setForm] = useState({
    molecule: "",
    campo: "",
    valor_sugerido: "",
    justificativa: "",
    database: ""
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
      const res = await api.get("/api/molecules/");
      setMolecules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDatabases = async () => {
    try {
      const res = await api.get("/api/molecules/databases/");
      setDatabases(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/community-requests/", {
        tipo: "correcao",
        ...form
      });

      alert("Solicitação enviada!");
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar");
    }
  };

  const filteredMolecules = molecules.filter(m =>
    m.nome_molecula?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* 🔍 Busca molécula */}
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

      {/* 📌 Select molécula */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Selecione a molécula
        </label>
        <select
          value={form.molecule}
          onChange={(e) =>
            setForm({ ...form, molecule: e.target.value })
          }
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Selecione...</option>
          {filteredMolecules.map(m => (
            <option key={m.id} value={m.id}>
              {m.nome_molecula}
            </option>
          ))}
        </select>
      </div>

      {/* 📊 Campo */}
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

      {/* 💾 Database */}
      <select
        value={form.database}
        onChange={(e) => setForm({ ...form, database: e.target.value })}
        className="w-full border p-2 rounded"
      >
        <option value="">Database (opcional)</option>
        {databases.map((db, i) => (
          <option key={i} value={db}>{db}</option>
        ))}
      </select>

      <input
        placeholder="Valor sugerido"
        value={form.valor_sugerido}
        onChange={(e) =>
          setForm({ ...form, valor_sugerido: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Justificativa"
        value={form.justificativa}
        onChange={(e) =>
          setForm({ ...form, justificativa: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      <button className="bg-indigo-600 text-white px-4 py-2 rounded">
        Enviar Correção
      </button>
    </form>
  );
}