import { useEffect, useState } from "react";

const AdminMoleculeRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [filter, setFilter] = useState("todos");

  // Carregar solicitações
  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8001/api/molecules/requests/admin/list/");
      const data = await res.json();
      setRequests(data.results || data);
    } catch (err) {
      console.error("Erro ao carregar requests:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const approveRequest = async (id) => {
    await fetch(`/api/molecules/requests/admin/${id}/approve/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    loadRequests();
    setSelected(null);
  };

  const rejectRequest = async (id) => {
    await fetch(`/api/molecules/requests/admin/${id}/reject/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ motivo: rejectReason }),
    });
    loadRequests();
    setRejectReason("");
    setSelected(null);
  };

  const filtered =
    filter === "todos" ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-160px)] p-6 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Solicitações da Comunidade
        </h1>

        <p className="text-gray-600 mb-6">
          Aqui você pode revisar, aprovar ou rejeitar solicitações enviadas pelos
          pesquisadores.
        </p>

        {/* Filtro */}
        <div className="flex gap-4 mb-6">
          <select
            className="border rounded-lg px-4 py-2 bg-gray-100"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="pendente">Pendentes</option>
            <option value="aprovado">Aprovados</option>
            <option value="rejeitado">Rejeitados</option>
          </select>
        </div>

        {/* Tabela */}
        {loading ? (
          <p className="text-gray-700">Carregando solicitações...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg bg-white">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  <th className="p-3">ID</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Editor</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Data</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((req) => (
                  <tr key={req.id} className="border-t">
                    <td className="p-3">{req.id}</td>
                    <td className="p-3 capitalize">{req.tipo}</td>
                    <td className="p-3">{req.nome_editor}</td>
                    <td className="p-3">{req.email}</td>
                    <td className="p-3 capitalize">{req.status}</td>
                    <td className="p-3">
                      {new Date(req.data_requisicao).toLocaleString()}
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelected(req)}
                        className="px-4 py-1 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
            <div className="bg-white p-6 rounded-xl shadow w-full max-w-2xl relative">

              <h2 className="text-xl font-bold mb-4">
                Solicitação #{selected.id}
              </h2>

              <p><strong>Tipo:</strong> {selected.tipo}</p>
              <p><strong>Status:</strong> {selected.status}</p>
              <p><strong>Editor:</strong> {selected.nome_editor}</p>
              <p><strong>Email:</strong> {selected.email}</p>

              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Dados enviados</h3>
                <pre className="bg-gray-100 p-3 rounded-xl text-sm overflow-auto">
                  {JSON.stringify(selected.payload, null, 2)}
                </pre>
              </div>

              {/* Botões para pendentes */}
              {selected.status === "pendente" && (
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => approveRequest(selected.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
                  >
                    Aprovar solicitação
                  </button>

                  <textarea
                    className="border rounded-lg p-2"
                    placeholder="Motivo da rejeição (opcional)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />

                  <button
                    onClick={() => rejectRequest(selected.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
                  >
                    Rejeitar solicitação
                  </button>
                </div>
              )}

              <button
                onClick={() => setSelected(null)}
                className="mt-6 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminMoleculeRequests;