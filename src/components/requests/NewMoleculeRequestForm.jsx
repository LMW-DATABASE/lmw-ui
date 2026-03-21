import { useEffect, useState } from "react";
import api from "../../services/api";

export default function NewMoleculesRequestForm() {
  const [form, setForm] = useState({
    nome_molecula: "",
    smiles: "",
    referencia: "",
    nome_planta: "",
    database: "",
    origem: "",
    activity: ""
  });

  const [databases, setDatabases] = useState([]);

  useEffect(() => {
    fetchDatabases();
  }, []);

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
        tipo: "nova_molecula",
        payload: form
      });

      alert("Solicitação enviada!");
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        placeholder="Nome da molécula"
        value={form.nome_molecula}
        onChange={(e) =>
          setForm({ ...form, nome_molecula: e.target.value })
        }
        className="w-full border p-2 rounded"
        required
      />

      <input
        placeholder="SMILES"
        value={form.smiles}
        onChange={(e) =>
          setForm({ ...form, smiles: e.target.value })
        }
        className="w-full border p-2 rounded"
        required
      />

      <input
        placeholder="Referência"
        value={form.referencia}
        onChange={(e) =>
          setForm({ ...form, referencia: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      <input
        placeholder="Nome da planta"
        value={form.nome_planta}
        onChange={(e) =>
          setForm({ ...form, nome_planta: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      {/* 📊 Database */}
      <select
        value={form.database}
        onChange={(e) =>
          setForm({ ...form, database: e.target.value })
        }
        className="w-full border p-2 rounded"
      >
        <option value="">Selecione um database</option>
        {databases.map((db, i) => (
          <option key={i} value={db}>{db}</option>
        ))}
      </select>

      <input
        placeholder="Origem"
        value={form.origem}
        onChange={(e) =>
          setForm({ ...form, origem: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Atividade"
        value={form.activity}
        onChange={(e) =>
          setForm({ ...form, activity: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Solicitar Nova Molécula
      </button>
    </form>
  );
}