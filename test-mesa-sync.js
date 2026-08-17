const fs = require('fs');
const vm = require('vm');

const appSource = fs.readFileSync('js/app.js', 'utf8');
const start = appSource.indexOf('function normalizeMesaKey');
const end = appSource.indexOf('async function loadDBFromCloud');

if (start < 0 || end < 0 || end <= start) {
  throw new Error('Não foi possível localizar o núcleo de sincronização de mesas.');
}

function emptyDB(mesas = []) {
  return {
    produtos: [],
    vendas: [],
    compras: [],
    producoes: [],
    consumos: [],
    auditoria: [],
    mesas_abertas: JSON.parse(JSON.stringify(mesas)),
    mesas_fechadas: [],
    config: {},
    nextId: {}
  };
}

function mesa(overrides = {}) {
  return {
    id: 10,
    cliente: 'Mesa 10',
    itens: [{ id: 1, nome: 'Produto', qtd: 2, preco: 5 }],
    dtCriacao: '2026-08-16T18:00:00.000Z',
    dtAtualizacao: '2026-08-16T18:00:00.000Z',
    ...overrides
  };
}

const context = {
  DB: emptyDB(),
  localStorage: { setItem() {} },
  repairDB() {},
  saveDB() {},
  getLocalISODate: () => '2026-08-16T20:00:00.000Z',
  console: { log() {}, warn() {}, error() {} },
  Date,
  JSON,
  Map,
  Set,
  Math
};

vm.createContext(context);
vm.runInContext(appSource.slice(start, end), context);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// Snapshot remoto vazio não pode apagar uma mesa local ativa.
context.DB = emptyDB([mesa()]);
context.mergeRemoteDB({ mesas_abertas: [], mesas_fechadas: [] }, true);
assert(context.DB.mesas_abertas.length === 1, 'Snapshot vazio apagou uma mesa ativa.');

// Snapshot remoto mais novo, porém sem itens, não pode zerar a comanda local.
context.DB = emptyDB([mesa()]);
context.mergeRemoteDB({
  mesas_abertas: [mesa({ itens: [], dtAtualizacao: '2026-08-16T19:00:00.000Z' })],
  mesas_fechadas: []
}, true);
assert(context.DB.mesas_abertas[0].itens.length === 1, 'Snapshot vazio zerou os itens da mesa.');

// Fechamento explícito deve remover a mesa em outros terminais.
context.DB = emptyDB([mesa()]);
context.mergeRemoteDB({
  mesas_abertas: [],
  mesas_fechadas: [{ id: '10', clienteKey: 'mesa 10', dtFechamento: '2026-08-16T20:00:00.000Z' }]
}, true);
assert(context.DB.mesas_abertas.length === 0, 'Tombstone não fechou a mesa.');

// Uma cópia antiga não pode ressuscitar uma mesa já finalizada.
context.DB = emptyDB([mesa()]);
context.registerMesaFechada(context.DB.mesas_abertas[0], 'venda_finalizada');
context.DB.mesas_abertas = [];
context.mergeRemoteDB({ mesas_abertas: [mesa()], mesas_fechadas: [] }, true);
assert(context.DB.mesas_abertas.length === 0, 'Snapshot antigo ressuscitou uma mesa finalizada.');

// Reabrir a mesma mesa após o fechamento continua permitido.
context.mergeRemoteDB({
  mesas_abertas: [mesa({ id: 11, dtCriacao: '2026-08-16T21:00:00.000Z', dtAtualizacao: '2026-08-16T21:00:00.000Z' })],
  mesas_fechadas: []
}, true);
assert(context.DB.mesas_abertas.length === 1, 'Uma nova abertura legítima foi bloqueada.');

console.log('OK: 5 cenários críticos de sincronização de mesas passaram.');
