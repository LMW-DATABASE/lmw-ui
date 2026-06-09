import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import api from "../services/api";
import { normalizeMoleculeFormData } from "../utils/helpers";

export default function EditMolecule() {
  const { t } = useTranslation('molecules');
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMolecule = async () => {
      try {
        const res = await api.get(`molecules/${id}/`);
        setForm(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || err.response?.data?.error || i18n.t('molecules:loadMoleculeError'));
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
      await api.put(`molecules/${id}/`, normalizeMoleculeFormData(form));
      alert(t('updateSuccess'));
      navigate("/moleculas");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data && typeof err.response.data === "object") {
        setError(t('validationError'));
      } else {
        setError(t('updateError'));
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">{t('common:loading')}</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-[calc(100vh-160px)] p-6 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-xl shadow border border-transparent dark:border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('editTitle')}
          </h1>
          <button
            onClick={() => navigate("/moleculas")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {t('common:back')}
          </button>
        </div>

        {form.status_processamento === "erro" && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            <strong>{t('rdkitFailure')}</strong>
            <div className="mt-1 text-sm">
              {form.erro_processamento || t('unknownError')}
            </div>
          </div>
        )}

        {form.status_processamento === "ok" && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
            {t('processedOk')}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
              {t('basicInfo')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t('moleculeName')}
                </label>
                <input
                  name="nome_molecula"
                  value={form.nome_molecula || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t('filterDatabase')}
                </label>
                <input
                  name="database"
                  value={form.database || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t('plant')}
                </label>
                <input
                  name="nome_planta"
                  value={form.nome_planta || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t('origin')}
                </label>
                <input
                  name="origem"
                  value={form.origem || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t('geolocation')}
                </label>
                <input
                  name="geolocalizacao"
                  value={form.geolocalizacao || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
              {t('chemicalStructure')}
            </h2>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                {t('fields.smiles')}
              </label>
              <input
                name="smiles"
                value={form.smiles || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('smilesReprocess')}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
              {t('referenceAndActivity')}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t('reference')}
                </label>
                <input
                  name="referencia"
                  value={form.referencia || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t('activity')}
                </label>
                <textarea
                  name="activity"
                  value={form.activity || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/moleculas")}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {t('common:cancel')}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? t('saving') : t('saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
