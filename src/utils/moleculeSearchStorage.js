import {
  createDefaultMoleculeFilters,
  MOLECULE_RANGE_FIELDS,
} from './moleculeFilters';

export const MOLECULE_SEARCH_STORAGE_KEYS = {
  public: 'lmw.moleculeSearch.public',
  admin: 'lmw.moleculeSearch.admin',
};

export const mergeStoredFilters = (stored) => {
  const defaults = createDefaultMoleculeFilters();
  if (!stored || typeof stored !== 'object') {
    return defaults;
  }

  const merged = {
    ...defaults,
    database: Array.isArray(stored.database) ? stored.database : defaults.database,
    origem: Array.isArray(stored.origem) ? stored.origem : defaults.origem,
    nome_planta: Array.isArray(stored.nome_planta) ? stored.nome_planta : defaults.nome_planta,
    referencia: Array.isArray(stored.referencia) ? stored.referencia : defaults.referencia,
    geolocalizacao: Array.isArray(stored.geolocalizacao) ? stored.geolocalizacao : defaults.geolocalizacao,
    atividade: Array.isArray(stored.atividade) && stored.atividade.length
      ? stored.atividade
      : defaults.atividade,
  };

  MOLECULE_RANGE_FIELDS.forEach((field) => {
    const range = stored[field];
    merged[field] = {
      min: range?.min ?? null,
      max: range?.max ?? null,
    };
  });

  return merged;
};

export const loadMoleculeSearchState = (storageKey) => {
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveMoleculeSearchState = (storageKey, state) => {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // quota exceeded or private mode
  }
};

export const createInitialSearchState = (storageKey, extra = {}) => {
  const saved = loadMoleculeSearchState(storageKey);
  const defaultExtra = Object.fromEntries(
    Object.entries(extra).map(([key, defaultValue]) => [key, defaultValue])
  );

  if (!saved) {
    return {
      searchTerm: '',
      query: '',
      filters: createDefaultMoleculeFilters(),
      currentPage: 1,
      ...defaultExtra,
    };
  }

  return {
    searchTerm: saved.searchTerm ?? saved.query ?? '',
    query: saved.query ?? '',
    filters: mergeStoredFilters(saved.filters),
    currentPage: saved.currentPage ?? 1,
    ...Object.fromEntries(
      Object.keys(defaultExtra).map((key) => [key, saved[key] ?? defaultExtra[key]])
    ),
  };
};
