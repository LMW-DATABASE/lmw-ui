const emptyRange = () => ({ min: null, max: null });

export const MOLECULE_RANGE_FIELDS = [
  'mw_average',
  'mw_exact',
  'logp',
  'tpsa',
  'h_bond_donors',
  'h_bond_acceptors',
  'heavy_atom_count',
  'rotatable_bonds',
  'ring_count',
  'aromatic_ring_count',
  'fraction_csp3',
  'qed_score',
  'np_likeness_score',
];

export const createDefaultMoleculeFilters = () => ({
  database: [],
  origem: [],
  nome_planta: [],
  referencia: [],
  geolocalizacao: [],
  atividade: [''],
  mw_average: emptyRange(),
  mw_exact: emptyRange(),
  logp: emptyRange(),
  tpsa: emptyRange(),
  h_bond_donors: emptyRange(),
  h_bond_acceptors: emptyRange(),
  heavy_atom_count: emptyRange(),
  rotatable_bonds: emptyRange(),
  ring_count: emptyRange(),
  aromatic_ring_count: emptyRange(),
  fraction_csp3: emptyRange(),
  qed_score: emptyRange(),
  np_likeness_score: emptyRange(),
});

export const DEFAULT_MOLECULE_FILTERS = createDefaultMoleculeFilters();

const normalize = (v) => v?.toString().toLowerCase().trim() || '';

const hasRangeValue = (range) =>
  range?.min !== null && range?.min !== '' && range?.min !== undefined
  || range?.max !== null && range?.max !== '' && range?.max !== undefined;

export const hasActiveMoleculeFilters = (query, filters) =>
  Boolean(query?.trim())
  || filters.database?.length > 0
  || filters.origem?.length > 0
  || filters.nome_planta?.length > 0
  || filters.referencia?.length > 0
  || filters.geolocalizacao?.length > 0
  || filters.atividade?.some((a) => a.trim() !== '')
  || MOLECULE_RANGE_FIELDS.some((field) => hasRangeValue(filters[field]));

export const buildMoleculeApiParams = (query, filters) => {
  const params = {};

  if (query?.trim()) {
    params.search = query.trim();
  }

  MOLECULE_RANGE_FIELDS.forEach((field) => {
    const range = filters[field];
    if (!range) return;

    if (range.min !== null && range.min !== '' && range.min !== undefined) {
      params[`${field}_min`] = range.min;
    }
    if (range.max !== null && range.max !== '' && range.max !== undefined) {
      params[`${field}_max`] = range.max;
    }
  });

  return params;
};

export const filterMolecules = (molecules, filters, options = {}) => {
  const { showOnlyErrors = false } = options;

  return molecules.filter((mol) => {
    if (showOnlyErrors && mol.status_processamento !== 'erro') {
      return false;
    }

    if (
      filters.database?.length
      && !filters.database.some((db) =>
        normalize(mol.database) === normalize(db)
      )
    ) return false;

    if (
      filters.origem?.length
      && !filters.origem.some((o) =>
        normalize(mol.origem).includes(normalize(o.value))
      )
    ) return false;

    if (
      filters.nome_planta?.length
      && !filters.nome_planta.some((p) =>
        normalize(mol.nome_planta).includes(normalize(p.value))
      )
    ) return false;

    if (
      filters.referencia?.length
      && !filters.referencia.some((r) =>
        normalize(mol.referencia).includes(normalize(r.value))
      )
    ) return false;

    if (
      filters.geolocalizacao?.length
      && !filters.geolocalizacao.some((l) =>
        normalize(mol.geolocalizacao).includes(normalize(l.value))
      )
    ) return false;

    const atividadesValidas = filters.atividade?.filter(
      (a) => a.trim() !== ''
    );

    if (
      atividadesValidas?.length
      && !atividadesValidas.some((a) =>
        normalize(mol.activity).includes(normalize(a))
      )
    ) return false;

    return true;
  });
};
