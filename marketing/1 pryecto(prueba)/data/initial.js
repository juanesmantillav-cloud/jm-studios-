// TODAY = 2026-05-27  (COT = UTC-5)

export const INITIAL_HORSES = [
  // ── Preñadas ───────────────────────────────────────────────────
  {
    id: 'h1', name: 'Perla', sex: 'mare', breed: 'Paso Fino', color: '#e8d5c0',
    birthDate: '2018-03-12', status: 'preñada', gestMonth: 10,
    lastService: '2025-07-20', confirmDate: '2025-08-14',
    expectedFoaling: '2026-06-05', sire: 'Relámpago',
    initial: 'P', tile: 'mare',
  },
  {
    id: 'h2', name: 'Luna', sex: 'mare', breed: 'Cuarto de Milla', color: '#c8b89a',
    birthDate: '2019-08-04', status: 'preñada', gestMonth: 8,
    lastService: '2025-09-18', confirmDate: '2025-10-13',
    expectedFoaling: '2026-08-01', sire: 'Tornado',
    initial: 'L', tile: 'mare',
  },
  {
    id: 'h3', name: 'Canela', sex: 'mare', breed: 'Criollo Colombiano', color: '#c97d4e',
    birthDate: '2020-11-21', status: 'preñada', gestMonth: 5,
    lastService: '2025-12-10', confirmDate: '2026-01-08',
    expectedFoaling: '2026-11-14', sire: 'Relámpago',
    initial: 'C', tile: 'mare',
  },
  // ── Lactando ───────────────────────────────────────────────────
  {
    id: 'h4', name: 'Diamante', sex: 'mare', breed: 'Paso Fino', color: '#8a7560',
    birthDate: '2017-06-30', status: 'lactando',
    foalingDate: '2026-04-18',
    initial: 'D', tile: 'mare',
  },
  {
    id: 'h5', name: 'Rocío', sex: 'mare', breed: 'Cuarto de Milla', color: '#b0c4b1',
    birthDate: '2018-09-15', status: 'lactando',
    foalingDate: '2026-05-03',
    initial: 'R', tile: 'mare',
  },
  // ── Celo / inseminada ──────────────────────────────────────────
  {
    id: 'h6', name: 'Estrella', sex: 'mare', breed: 'Criollo Colombiano', color: '#d4a574',
    birthDate: '2021-02-08', status: 'celo', heatDayOfCycle: 3,
    initial: 'E', tile: 'mare',
  },
  {
    id: 'h7', name: 'Paloma', sex: 'mare', breed: 'Paso Fino', color: '#f0e6d3',
    birthDate: '2020-05-17', status: 'inseminada',
    lastService: '2026-05-12', confirmDate: '2026-06-06', sire: 'Tornado',
    initial: 'P', tile: 'mare',
  },
  // ── Vacías ─────────────────────────────────────────────────────
  {
    id: 'h8', name: 'Brisa', sex: 'mare', breed: 'Paso Fino', color: '#a8c5da',
    birthDate: '2022-01-19', status: 'vacía', nextHeat: '2026-06-10',
    initial: 'B', tile: 'mare',
  },
  {
    id: 'h9', name: 'Azabache', sex: 'mare', breed: 'Criollo Colombiano', color: '#2a2a2a',
    birthDate: '2021-07-03', status: 'vacía', nextHeat: '2026-06-18',
    initial: 'A', tile: 'mare',
  },
  // ── Padrillos ──────────────────────────────────────────────────
  {
    id: 'h10', name: 'Relámpago', sex: 'stallion', breed: 'Paso Fino', color: '#4a3728',
    birthDate: '2015-04-22', status: 'reproductor', covers: 12,
    initial: 'R', tile: 'stallion',
  },
  {
    id: 'h11', name: 'Tornado', sex: 'stallion', breed: 'Cuarto de Milla', color: '#1a1a1a',
    birthDate: '2016-11-09', status: 'reproductor', covers: 4,
    initial: 'T', tile: 'stallion',
  },
  // ── Crías ──────────────────────────────────────────────────────
  {
    id: 'h12', name: 'Copito', sex: 'foal', breed: 'Paso Fino', color: '#f5f0e8',
    birthDate: '2026-04-18', status: 'cría', motherId: 'h4',
    initial: 'C', tile: 'foal',
  },
  {
    id: 'h13', name: 'Niebla', sex: 'foal', breed: 'Cuarto de Milla', color: '#d0ccc8',
    birthDate: '2026-05-03', status: 'cría', motherId: 'h5',
    initial: 'N', tile: 'foal',
  },
];

export const INITIAL_STOCK = [
  {
    id: 'heno',
    name: 'Heno',
    kind: 'heno',
    unit: 'pacas',
    stock: 45,
    capacity: 100,
    dailyUse: 7,
    lastEntry: { date: '2026-05-20', qty: 30, price: 420000 },
  },
  {
    id: 'alfalfa',
    name: 'Alfalfa',
    kind: 'alfalfa',
    unit: 'kg',
    stock: 310,
    capacity: 1000,
    dailyUse: 22,
    lastEntry: { date: '2026-05-18', qty: 200, price: 580000 },
  },
  {
    id: 'concentrado',
    name: 'Concentrado equino',
    kind: 'pellet',
    unit: 'kg',
    stock: 185,
    capacity: 500,
    dailyUse: 13,
    lastEntry: { date: '2026-05-15', qty: 100, price: 310000 },
  },
];

export const INITIAL_VITAMINS = [
  { id: 'v1', name: 'Vitamina E + Selenio', qty: 6, unit: 'frascos', note: 'Refuerzo reproductivo', low: 2 },
  { id: 'v2', name: 'Biotina equina',        qty: 3, unit: 'frascos', note: 'Cascos y pelaje',       low: 2 },
  { id: 'v3', name: 'Electrolitos Plus',     qty: 12, unit: 'sobres', note: 'Hidratación temporada seca', low: 4 },
  { id: 'v4', name: 'Pasta desparasitante',  qty: 4, unit: 'tubos',  note: 'Ivermectina 1.87%',     low: 2 },
];

export const INITIAL_PURCHASES = [
  { id: 'p1', stockId: 'heno',        name: 'Heno',              qty: 30,  unit: 'pacas', price: 420000, date: '2026-05-20', note: 'Proveedor El Pinar' },
  { id: 'p2', stockId: 'alfalfa',     name: 'Alfalfa',           qty: 200, unit: 'kg',   price: 580000, date: '2026-05-18', note: '10 bultos × 20 kg' },
  { id: 'p3', stockId: 'concentrado', name: 'Concentrado equino', qty: 100, unit: 'kg',  price: 310000, date: '2026-05-15', note: '5 bultos × 20 kg' },
  { id: 'p4', stockId: 'heno',        name: 'Heno',              qty: 40,  unit: 'pacas', price: 560000, date: '2026-04-28', note: '' },
  { id: 'p5', stockId: 'alfalfa',     name: 'Alfalfa',           qty: 300, unit: 'kg',   price: 870000, date: '2026-04-22', note: '15 bultos × 20 kg' },
  { id: 'p6', stockId: 'concentrado', name: 'Concentrado equino', qty: 150, unit: 'kg',  price: 465000, date: '2026-04-10', note: '' },
  { id: 'p7', stockId: 'heno',        name: 'Heno',              qty: 50,  unit: 'pacas', price: 700000, date: '2026-03-30', note: 'Lote especial sin polvo' },
  { id: 'p8', stockId: 'alfalfa',     name: 'Alfalfa',           qty: 250, unit: 'kg',   price: 725000, date: '2026-03-15', note: '' },
  { id: 'p9', stockId: 'concentrado', name: 'Concentrado equino', qty: 200, unit: 'kg',  price: 620000, date: '2026-03-05', note: 'Precio mayorista' },
];

export const INITIAL_EVENTS = [
  { id: 'ev1', date: '2026-06-05', kind: 'parto',   horse: 'Perla',   title: 'Parto esperado — Perla',   note: 'Mes 10, vigilar de cerca' },
  { id: 'ev2', date: '2026-06-06', kind: 'confirm', horse: 'Paloma',  title: 'Ecografía confirmación — Paloma', note: '25 días post-servicio' },
  { id: 'ev3', date: '2026-06-10', kind: 'celo',    horse: 'Brisa',   title: 'Celo esperado — Brisa',    note: 'Ciclo 21 días' },
  { id: 'ev4', date: '2026-06-18', kind: 'celo',    horse: 'Azabache',title: 'Celo esperado — Azabache', note: '' },
  { id: 'ev5', date: '2026-08-01', kind: 'parto',   horse: 'Luna',    title: 'Parto esperado — Luna',    note: 'Mes 8, monitorear' },
];

export const INITIAL_CONSUMPTION = [18, 24, 21, 19, 27, 22, 25, 20, 23, 21, 26, 19, 24, 22];

// ── Consumption log: May 1–27 2026 ────────────────────────────────
// Times stored as local (no Z) so date grouping is timezone-agnostic.
// 3 daily feedings: 06:00 mañana, 12:00 mediodía, 18:00 tarde.

function buildConsumptionLog() {
  const log = [];
  let counter = 1;

  // [heno_am, alfalfa_am, conc_noon, heno_pm, alfalfa_pm]  — realistic daily variation
  const dailyData = [
    [4, 12, 7, 3, 10],  // 1
    [3, 11, 6, 4, 11],  // 2
    [4, 13, 7, 3, 12],  // 3
    [3, 10, 6, 4, 10],  // 4
    [4, 12, 8, 3, 11],  // 5
    [4, 14, 7, 4, 12],  // 6
    [3, 11, 6, 3, 10],  // 7
    [4, 12, 7, 4, 11],  // 8
    [3, 13, 6, 3, 12],  // 9
    [4, 11, 8, 4, 10],  // 10
    [3, 12, 7, 3, 11],  // 11
    [4, 14, 6, 4, 13],  // 12
    [3, 11, 7, 3, 10],  // 13
    [4, 12, 8, 4, 11],  // 14
    [4, 13, 7, 3, 12],  // 15
    [3, 10, 6, 4, 10],  // 16
    [4, 12, 7, 3, 11],  // 17
    [3, 11, 8, 4, 12],  // 18
    [4, 13, 7, 3, 11],  // 19
    [4, 14, 6, 4, 13],  // 20
    [3, 11, 7, 3, 10],  // 21
    [4, 12, 8, 4, 11],  // 22
    [3, 13, 7, 3, 12],  // 23
    [4, 11, 6, 4, 10],  // 24
    [4, 12, 7, 3, 11],  // 25
    [3, 14, 8, 4, 12],  // 26
    [4, 12, 7, 3, 11],  // 27
  ];

  for (let dayIndex = 0; dayIndex < 27; dayIndex++) {
    const day = dayIndex + 1;
    const d = `2026-05-${String(day).padStart(2, '0')}`;
    const [henoAm, alfAm, concNoon, henoPm, alfPm] = dailyData[dayIndex];

    log.push({ id: `cl${counter++}`, stockId: 'heno',        itemName: 'Heno',               kg: henoAm,   datetime: `${d}T06:03:00` });
    log.push({ id: `cl${counter++}`, stockId: 'alfalfa',     itemName: 'Alfalfa',            kg: alfAm,    datetime: `${d}T06:08:00` });
    log.push({ id: `cl${counter++}`, stockId: 'concentrado', itemName: 'Concentrado equino',  kg: concNoon, datetime: `${d}T12:10:00` });
    log.push({ id: `cl${counter++}`, stockId: 'heno',        itemName: 'Heno',               kg: henoPm,   datetime: `${d}T18:02:00` });
    log.push({ id: `cl${counter++}`, stockId: 'alfalfa',     itemName: 'Alfalfa',            kg: alfPm,    datetime: `${d}T18:07:00` });
  }

  return log;
}

export const INITIAL_CONSUMPTION_LOG = buildConsumptionLog();
