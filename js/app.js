// ===================== CONFIGURAÇÃO SUPABASE =====================
const SUPABASE_URL = 'https://ryizqbbjxjrxcortkshv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aXpxYmJqeGpyeGNvcnRrc2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDk3MzQsImV4cCI6MjA5MTkyNTczNH0.nhb-bPiPN_q29-LfdrnjtYLq4k38hFwuuYu6bjuDCUM'; 
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===================== THEME =====================
let currentTheme = localStorage.getItem('convpro_theme') || 'dark';
if(currentTheme === 'light') document.documentElement.classList.add('light-mode');

window.toggleTheme = function() {
  const isLight = document.documentElement.classList.toggle('light-mode');
  currentTheme = isLight ? 'light' : 'dark';
  localStorage.setItem('convpro_theme', currentTheme);
  
  const icon = isLight ? '🌙' : '☀️';
  const btn = document.getElementById('btnThemeToggle');
  if (btn) btn.innerHTML = icon;
  const btnLogin = document.getElementById('btnThemeToggleLogin');
  if (btnLogin) btnLogin.innerHTML = icon;
}
window.addEventListener('DOMContentLoaded', async () => {
  const icon = currentTheme === 'light' ? '🌙' : '☀️';
  const btn = document.getElementById('btnThemeToggle');
  if (btn) btn.innerHTML = icon;
  const btnLogin = document.getElementById('btnThemeToggleLogin');
  if (btnLogin) btnLogin.innerHTML = icon;

  // AUTO-REPARO DE IDs DUPLICADOS
  try {
    const idsCache = new Set();
    let fixedCount = 0;
    DB.produtos.forEach(p => {
      if (idsCache.has(String(p.id))) {
        p.id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
        fixedCount++;
      }
      idsCache.add(String(p.id));
    });
    if (fixedCount > 0) {
        console.warn(`[REPARO] ${fixedCount} IDs duplicados foram corrigidos.`);
        saveDB();
    }
  } catch(e) { console.error("Erro no auto-reparo:", e); }

  // Verifica sessão Supabase ativa (sem precisar de credenciais salvas)
  try {
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
      const meta = session.user.user_metadata || {};
      const user = {
        id: session.user.id,
        username: session.user.email,
        email: session.user.email,
        role: meta.role || 'funcionario',
        name: meta.name || session.user.email
      };
      finishLogin(user, false);
      return;
    }
  } catch(e) { console.warn("Erro ao verificar sessão:", e); }

  // Sem sessão ativa: restaura apenas o email/usuário (nunca a senha)
  const savedUser = localStorage.getItem('convpro_savedUser');
  if (savedUser) {
    if (document.getElementById('loginUser')) document.getElementById('loginUser').value = savedUser;
    if (document.getElementById('loginRemember')) document.getElementById('loginRemember').checked = true;
  }
});


let DB = JSON.parse(localStorage.getItem('convpro_db') || 'null') || {
  produtos: [
    // ── ESPETINHOS / PRODUÇÃO ──────────────────────────────────
    {id:1,nome:'Espetinho de Frango',categoria:'Espetinho',operacao:'Espetinho',unidade:'un',custo:3.5,preco:8,estoque:0,estoqueMin:5,status:'ativo',tipo:'produzido'},
    {id:2,nome:'Espetinho de Carne',categoria:'Espetinho',operacao:'Espetinho',unidade:'un',custo:4,preco:9,estoque:0,estoqueMin:5,status:'ativo',tipo:'produzido'},
    {id:3,nome:'Caldinho de Feijão',categoria:'Caldinho',operacao:'Espetinho',unidade:'un',custo:2.5,preco:6,estoque:0,estoqueMin:3,status:'ativo',tipo:'produzido'},
    // ── REFRIGERANTES 2L ──────────────────────────────────────
    {id:10,nome:'Coca-Cola 2L',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:7,preco:12,estoque:9,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:11,nome:'Fanta Laranja 2L',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:6,preco:11,estoque:10,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:12,nome:'Guaraná 2L',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:5.5,preco:10,estoque:11,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:13,nome:'Pepsi 2L',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:5.5,preco:10,estoque:4,estoqueMin:2,status:'ativo',tipo:'pronto'},
    {id:14,nome:'Pepsi Black 2L',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:5.5,preco:10,estoque:4,estoqueMin:2,status:'ativo',tipo:'pronto'},
    // ── REFRIGERANTES 1L ──────────────────────────────────────
    {id:15,nome:'Coca-Cola 1L',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:4.5,preco:8,estoque:17,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:16,nome:'Coca-Cola 1L Zero',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:4.5,preco:8,estoque:2,estoqueMin:2,status:'ativo',tipo:'pronto'},
    {id:17,nome:'Coca-Cola KS 1L',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:5,preco:9,estoque:11,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:18,nome:'Guaraná 1L',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:4,preco:7,estoque:4,estoqueMin:2,status:'ativo',tipo:'pronto'},
    // ── REFRIGERANTES PEQUENOS / LATAS ────────────────────────
    {id:20,nome:'Coca-Cola Lata Normal',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2.5,preco:5,estoque:5,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:21,nome:'Coca-Cola Lata Zero',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2.5,preco:5,estoque:10,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:22,nome:'Coca-Cola 250ml',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:9,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:23,nome:'Pepsi 250ml',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:1,estoqueMin:2,status:'ativo',tipo:'pronto'},
    {id:24,nome:'Guaraná Lata',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:14,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:25,nome:'Fanta Laranja Lata',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:4,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:26,nome:'Fanta Caju Lata',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:2,estoqueMin:2,status:'ativo',tipo:'pronto'},
    // ── CERVEJAS (UNIDADES) ───────────────────────────────────
    {id:30,nome:'Heineken 350ml',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:4,preco:8,estoque:13,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:31,nome:'Skol Lata',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:2.5,preco:5,estoque:2,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:32,nome:'Skol Beats',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:4,preco:7,estoque:7,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:33,nome:'Original',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:4.5,preco:8,estoque:2,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:34,nome:'Petra',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:4,preco:7,estoque:2,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:35,nome:'Eisenbahn',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:5,preco:9,estoque:8,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:36,nome:'Budweiser 250ml',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:3.5,preco:6,estoque:10,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:37,nome:'Brahma Chopp Latão',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:3.5,preco:6,estoque:6,estoqueMin:4,status:'ativo',tipo:'pronto'},
    // ── CERVEJAS (CONVERTIDAS / CAIXAS) ──────────────────────
    {id:40,nome:'Itaipava (unit)',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:2.5,preco:4.5,estoque:71,estoqueMin:24,status:'ativo',tipo:'pronto'},
    {id:41,nome:'Spaten (unit)',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:3.5,preco:6,estoque:24,estoqueMin:12,status:'ativo',tipo:'pronto'},
    {id:42,nome:'Itaipava Premium (unit)',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:3,preco:5.5,estoque:12,estoqueMin:6,status:'ativo',tipo:'pronto'},
    // ── ENERGÉTICOS ───────────────────────────────────────────
    {id:50,nome:'TNT 269ml Original',categoria:'Energético',operacao:'Bebidas',unidade:'un',custo:3.5,preco:7,estoque:2,estoqueMin:2,status:'ativo',tipo:'pronto'},
    {id:51,nome:'TNT Açaí c/ Guaraná',categoria:'Energético',operacao:'Bebidas',unidade:'un',custo:3.5,preco:7,estoque:4,estoqueMin:2,status:'ativo',tipo:'pronto'},
    {id:52,nome:'TNT Maçã Verde',categoria:'Energético',operacao:'Bebidas',unidade:'un',custo:3.5,preco:7,estoque:2,estoqueMin:2,status:'ativo',tipo:'pronto'},
    {id:53,nome:'Energético 2L',categoria:'Energético',operacao:'Bebidas',unidade:'un',custo:12,preco:22,estoque:3,estoqueMin:1,status:'ativo',tipo:'pronto'},
    // ── CACHAÇAS ──────────────────────────────────────────────
    {id:60,nome:'Matuta Umburana 3L',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:45,preco:80,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:61,nome:'Matuta Bálsamo 1L',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:25,preco:45,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:62,nome:'Matuta Tradicional',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:20,preco:35,estoque:2,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:63,nome:'Matuta Mel e Limão',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:22,preco:38,estoque:2,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:64,nome:'Caninha do Brejo Umburana',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:18,preco:30,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:65,nome:'Caninha do Brejo Cristal',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:15,preco:25,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:66,nome:'Cachaça 51',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:12,preco:20,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:67,nome:'Cachaça Gostosa 480ml',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:8,preco:15,estoque:10,estoqueMin:3,status:'ativo',tipo:'pronto'},
    {id:68,nome:'Cachaça Saliente 480ml',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:8,preco:15,estoque:9,estoqueMin:3,status:'ativo',tipo:'pronto'},
    // ── WHISKY / GIN / OUTROS ────────────────────────────────
    {id:70,nome:'Passport 1L',categoria:'Whisky',operacao:'Bebidas',unidade:'un',custo:35,preco:60,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:71,nome:'Black & White',categoria:'Whisky',operacao:'Bebidas',unidade:'un',custo:30,preco:55,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:72,nome:'Red Label',categoria:'Whisky',operacao:'Bebidas',unidade:'un',custo:50,preco:90,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:73,nome:'Jinrock',categoria:'Whisky',operacao:'Bebidas',unidade:'un',custo:28,preco:50,estoque:2,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:74,nome:'Dreher',categoria:'Conhaque',operacao:'Bebidas',unidade:'un',custo:20,preco:35,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:75,nome:'Fogo Paulista',categoria:'Aguardente',operacao:'Bebidas',unidade:'un',custo:12,preco:22,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    // ── OUTROS / ÁGUA ─────────────────────────────────────────
    {id:80,nome:'Del Valle 1L',categoria:'Suco',operacao:'Bebidas',unidade:'un',custo:4,preco:7,estoque:4,estoqueMin:2,status:'ativo',tipo:'pronto'},
    {id:81,nome:'Água Mineral 510ml',categoria:'Água',operacao:'Bebidas',unidade:'un',custo:1,preco:2.5,estoque:86,estoqueMin:24,status:'ativo',tipo:'pronto'},
    {id:82,nome:'Água Tônica',categoria:'Água',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:9,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:83,nome:'Citrus 330ml',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:10,estoqueMin:4,status:'ativo',tipo:'pronto'},
    // ── GELO ──────────────────────────────────────────────────
    {id:85,nome:'Gelo Comum (saco)',categoria:'Gelo',operacao:'Bebidas',unidade:'saco',custo:3,preco:6,estoque:3.5,estoqueMin:2,status:'ativo',tipo:'pronto'},
    {id:86,nome:'Gelo Saborizado Morango',categoria:'Gelo',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:16,estoqueMin:5,status:'ativo',tipo:'pronto'},
    {id:87,nome:'Gelo Saborizado Melancia',categoria:'Gelo',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:12,estoqueMin:5,status:'ativo',tipo:'pronto'},
    {id:88,nome:'Gelo Saborizado Maçã Verde',categoria:'Gelo',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:10,estoqueMin:5,status:'ativo',tipo:'pronto'},
    {id:89,nome:'Gelo Saborizado Maracujá',categoria:'Gelo',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:10,estoqueMin:5,status:'ativo',tipo:'pronto'},
    {id:90,nome:'Gelo Saborizado Água de Coco',categoria:'Gelo',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:11,estoqueMin:5,status:'ativo',tipo:'pronto'},
    // ── DOCES / CONVENIÊNCIA ──────────────────────────────────
    {id:91,nome:'Halls',categoria:'Doces',operacao:'Bebidas',unidade:'pct',custo:1,preco:2,estoque:50,estoqueMin:20,status:'ativo',tipo:'pronto'},
    {id:92,nome:'Trident',categoria:'Doces',operacao:'Bebidas',unidade:'un',custo:1,preco:2,estoque:12,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:93,nome:'Fini 15g',categoria:'Doces',operacao:'Bebidas',unidade:'un',custo:1,preco:2,estoque:13,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:94,nome:'Jujuba',categoria:'Doces',operacao:'Bebidas',unidade:'un',custo:1,preco:2,estoque:4,estoqueMin:4,status:'ativo',tipo:'pronto'},
    // ── ACESSÓRIOS ────────────────────────────────────────────
    {id:95,nome:'Seda Natural',categoria:'Acessórios',operacao:'Bebidas',unidade:'pct',custo:3,preco:5,estoque:13,estoqueMin:5,status:'ativo',tipo:'pronto'},
  ],
  vendas: [],
  compras: [],
  producoes: [],
  consumos: [],
  caixas: [],
  auditoria: [],
  config: { lastSyncDiario: null, lastBackupSync: null },
  nextId: {produto:100,venda:1,compra:1,producao:1,consumo:1,caixa:1}
};

let currentUser = null;
let syncPending = false;
let retrySyncTimeout = null;
let currentPage = 'dashboard';
const _GOOGLE_SHEETS_URL_DEFAULT = 'https://script.google.com/macros/s/AKfycbw2-zau41VnCdOV0-HxcmDOeQSaSlciv4Cs8dOnxCkrP2MWTJYNXoHVtDVL9vEgo_wkGw/exec';
function _isAllowedGSUrl(url) {
  try { return new URL(url).hostname === 'script.google.com'; } catch { return false; }
}
let GOOGLE_SHEETS_URL = (() => {
  const s = localStorage.getItem('convpro_gs_url');
  return (s && _isAllowedGSUrl(s)) ? s : _GOOGLE_SHEETS_URL_DEFAULT;
})();

// Token de acesso ao backend Google Sheets.
// Deve ser idêntico ao valor da propriedade "API_TOKEN" configurada no Apps Script.
// Configure via Configurações > Integração Google Sheets na interface do sistema.
let GOOGLE_SHEETS_TOKEN = localStorage.getItem('convpro_gs_token') || '';

function _gsGet(action) {
  const sep = GOOGLE_SHEETS_TOKEN ? '&token=' + encodeURIComponent(GOOGLE_SHEETS_TOKEN) : '';
  return fetch(GOOGLE_SHEETS_URL + '?action=' + action + sep);
}

function _gsPost(payload) {
  const body = GOOGLE_SHEETS_TOKEN ? Object.assign({ token: GOOGLE_SHEETS_TOKEN }, payload) : payload;
  return fetch(GOOGLE_SHEETS_URL, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }
  });
}

async function saveDB(){
  repairDB(); // Garante integridade antes de salvar
  localStorage.setItem('convpro_db',JSON.stringify(DB)); // Backup local rápido
  
  updateCloudIcon('loading');

  // Sincronização com Supabase (Nuvem) com Retentativa Automática
  try {
    const { error } = await sb
      .from('config_app') 
      .upsert({ id: 1, json_db: DB, updated_at: new Date().toISOString() });
    
    if (error) throw error;
    
    console.log("✅ Sincronizado com Supabase!");
    syncPending = false;
    updateCloudIcon('success');
  } catch(e) {
    console.warn("⚠️ Falha ao salvar no Supabase. Tentará novamente em 30s.", e);
    syncPending = true;
    updateCloudIcon('error', e.message || "Erro de conexão (Offline?)");

    // Agenda retentativa automática se já não houver uma agendada
    if (!retrySyncTimeout) {
      retrySyncTimeout = setTimeout(() => {
        retrySyncTimeout = null;
        if (syncPending) {
          console.log("🔄 Tentando re-sincronizar dados pendentes...");
          saveDB();
        }
      }, 30000);
    }
  }

  syncToGoogleSheets();
}

function updateCloudIcon(status, errorMsg = '') {
  let iconEl = document.getElementById('cloudStatusIcon');
  if (!iconEl) {
    // Cria o ícone se não existir na topbar
    const topBar = document.getElementById('topbar');
    if (!topBar) return;
    iconEl = document.createElement('div');
    iconEl.id = 'cloudStatusIcon';
    iconEl.style.cssText = 'margin-right:15px; font-size:18px; cursor:help; transition: all 0.3s;';
    // Insere antes da data
    const dateEl = document.getElementById('topbarDate');
    topBar.insertBefore(iconEl, dateEl);
  }

  if (status === 'loading') {
    iconEl.innerHTML = '⏳';
    iconEl.title = 'Sincronizando com Supabase...';
    iconEl.style.opacity = '0.5';
  } else if (status === 'success') {
    iconEl.innerHTML = '☁️';
    iconEl.title = 'Tudo sincronizado na Nuvem';
    iconEl.style.opacity = '1';
    iconEl.style.color = '#4CAF50';
    iconEl.style.filter = 'drop-shadow(0 0 2px #4CAF50)';
    setTimeout(() => { iconEl.style.color = ''; iconEl.style.filter = ''; }, 2000);
  } else {
    iconEl.innerHTML = '❌';
    iconEl.title = 'Erro ao sincronizar com a Nuvem: ' + (errorMsg || 'Verifique a conexão');
    iconEl.style.opacity = '1';
    iconEl.style.color = '#ff5252';
    // Se for erro, mostra um toast com o erro técnico se não for apenas falha de rede comum
    if(errorMsg && errorMsg !== 'Failed to fetch') {
       console.error("ERRO_NUVEM:", errorMsg);
    }
  }
}

function mergeRemoteDB(remote) {
  if (!remote) return false;
  let hasUpdates = false;
  console.log("🛠️ Iniciando Smart Merge de dados remotos...");

  // 1. Produtos: Adiciona novos, mas mantém estoque local de existentes (local wins for stock)
  if (remote.produtos && Array.isArray(remote.produtos)) {
    remote.produtos.forEach(rp => {
      const localP = DB.produtos.find(p => p.id === rp.id);
      if (!localP) {
        DB.produtos.push(rp);
        hasUpdates = true;
        console.log(`[Smart Merge] Novo produto remoto adicionado: ${rp.nome}`);
      }
    });
  }

  // 2. Mesas Abertas: União baseada em ID ou Nome
  if (remote.mesas_abertas && Array.isArray(remote.mesas_abertas)) {
    remote.mesas_abertas.forEach(rm => {
      // Busca mesa local por ID ou por Nome (se ID não existir ainda)
      const localM = DB.mesas_abertas.find(lm => 
        (rm.id && lm.id === rm.id) || 
        (lm.cliente.toLowerCase() === rm.cliente.toLowerCase())
      );
      
      if (!localM) {
        // Se a mesa remota não existe aqui, adiciona para garantir que nada se perca
        DB.mesas_abertas.push(rm);
        hasUpdates = true;
        console.log(`[Smart Merge] Mesa aberta recuperada da nuvem: ${rm.cliente}`);
      } else {
        // Se já existe local, preservamos a LOCAL (que é a que o usuário está mexendo agora)
        // O próximo saveDB() vai mandar a versão local atualizada para a nuvem.
      }
    });
  }

  // 3. Vendas e Histórico: Adiciona o que não existe localmente (baseado em data/hora ou ID)
  ['vendas', 'compras', 'producoes', 'consumos', 'auditoria'].forEach(key => {
    if (remote[key] && Array.isArray(remote[key])) {
      remote[key].forEach(ri => {
        const uniqueKey = ri.id || ri.dt || ri.data + ri.hora;
        const localItems = DB[key];
        const exists = localItems.some(li => (li.id && ri.id && li.id === ri.id) || (li.dt === ri.dt));
        if (!exists) {
          localItems.push(ri);
          hasUpdates = true;
        }
      });
      // Ordena por data (opcional, mas bom para UI)
      DB[key].sort((a,b) => new Date(b.dt || b.data) - new Date(a.dt || a.data));
    }
  });

  // 4. Integridade de IDs: Sincroniza os contadores para o maior valor
  if (remote.nextId) {
    Object.keys(remote.nextId).forEach(k => {
      DB.nextId[k] = Math.max(DB.nextId[k] || 0, remote.nextId[k] || 0);
    });
  }

  // 4. Configurações (A configuração mais recente ou existente vence)
  if (remote.config) {
    if (!DB.config) {
      DB.config = remote.config;
      hasUpdates = true;
    } else {
      // Se o remoto tem um sync mais recente, atualiza o local
      if (remote.config.lastSyncDiario > (DB.config.lastSyncDiario || '')) {
        DB.config.lastSyncDiario = remote.config.lastSyncDiario;
        hasUpdates = true;
      }
      if (remote.config.lastBackupSync > (DB.config.lastBackupSync || '')) {
        DB.config.lastBackupSync = remote.config.lastBackupSync;
        hasUpdates = true;
      }
    }
  }

  if (hasUpdates) {
    saveDB();
    repairDB();
  }
  return hasUpdates;
}

async function loadDBFromCloud() {
  try {
    const { data, error } = await sb
      .from('config_app')
      .select('json_db')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (data && data.json_db) {
      console.log("📥 Dados recebidos do Supabase. Iniciando merge...");
      const updated = mergeRemoteDB(data.json_db);
      if (updated) {
        console.log("✨ Banco de dados atualizado com informações da nuvem.");
      }
      return true;
    }
  } catch(e) {
    console.error("❌ Falha ao carregar do Supabase:", e);
  }
  return false;
}


function repairDB() {
  if (!DB) return;
  
  const fix = (list) => {
    if (!Array.isArray(list)) return;
    list.forEach(item => {
      if (item.data) item.data = normData(item.data);
    });
  };

  fix(DB.vendas);
  fix(DB.consumos);
  fix(DB.compras);
  fix(DB.producoes);
  
  // Garantir ordenação decrescente (mais recentes primeiro) em todas as listas cronológicas
  const sortDesc = (list) => {
    if (!Array.isArray(list)) return;
    list.sort((a, b) => {
      const dateA = new Date(a.dt || a.data + 'T' + (a.hora || '00:00:00'));
      const dateB = new Date(b.dt || b.data + 'T' + (b.hora || '00:00:00'));
      return dateB - dateA;
    });
  };

  sortDesc(DB.vendas);
  sortDesc(DB.consumos);
  sortDesc(DB.compras);
  sortDesc(DB.producoes);
  sortDesc(DB.auditoria);

  // Reparo de custo/total em vendas se estiverem corrompidos
  DB.vendas.forEach(v => {
    if (v.itens && Array.isArray(v.itens)) {
      if (!v.total || v.total <= 0) v.total = v.itens.reduce((s,i) => s + (i.subtotal || 0), 0);
      if (!v.custo || v.custo <= 0) v.custo = v.itens.reduce((s,i) => s + (i.custo || 0) * (i.qtd || 1), 0);
    }
  });

  // Garantir objeto de config
  if (!DB.config) DB.config = { lastSyncDiario: null, lastBackupSync: null };
}


async function syncToGoogleSheets() {
  if (!GOOGLE_SHEETS_URL) return;
  try {
    await _gsPost({ action: 'sincronizar', db: DB });
    DB.config.lastSyncDiario = new Date().toISOString();
    saveDB();
  } catch(e) {
    console.error("Erro no background ao sincronizar com Google Sheets", e);
  }
}

window.forceSync = function() {
  if (!GOOGLE_SHEETS_URL) {
    showToast('URL da planilha não configurada!', 'error');
    return;
  }
  showToast('Enviando todos os dados para a Planilha...', 'info');
  const btn = document.getElementById('btnSyncCloud');
  if(btn) btn.innerHTML = '⏳ Enviando...';
  
  _gsPost({ action: 'sincronizar', db: DB }).then(r => r.json()).then(res => {
    if(btn) btn.innerHTML = '☁️ Sincronizar';
    if(res.success) {
      showToast('A Planilha foi atualizada com sucesso!', 'success');
    } else {
      showToast('Erro na planilha: ' + res.error, 'error');
    }
  }).catch(e => {
    if(btn) btn.innerHTML = '☁️ Sincronizar';
    if(e.message.includes('Failed to fetch')) {
      showToast('Erro: Verifique se a Implantação no Google está como "Qualquer pessoa"', 'error');
    } else {
      showToast('Erro de conexão: ' + e.message, 'error');
    }
  });
}

function auditLog(acao,detalhes){
  DB.auditoria.push({id:Date.now(),usuario:currentUser?.name,acao,detalhes,dt:getLocalISODate()});
  saveDB();
}

let orderCheckInterval = null;
let orderNotifications = []; // fila de notificações

function startPollingOrders() {
  if (orderCheckInterval) clearInterval(orderCheckInterval);
  orderCheckInterval = setInterval(checkPedidosDigitais, 15000);
  requestNotificationPermission();
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

async function checkPedidosDigitais() {
  if (!GOOGLE_SHEETS_URL) return;
  try {
    const res = await _gsGet('get_pedidos');
    const data = await res.json();
    if(data && data.pedidos_novos && data.pedidos_novos.length > 0) {
      let notify = false;
      const idsRecebidos = [];
      DB.mesas_abertas = DB.mesas_abertas || [];

      data.pedidos_novos.forEach(ped => {
        idsRecebidos.push(ped.id);
        const idx = DB.mesas_abertas.findIndex(x => x.cliente.toLowerCase() === ped.cliente.toLowerCase());
        
        let obsStr = ped.obs ? `[APP] ${ped.obs}` : '[APP] Novo Pedido';

        if(idx >= 0) {
          const mesa = DB.mesas_abertas[idx];
          ped.itens.forEach(ni => {
            const ex = mesa.itens.find(mi => mi.id === ni.id);
            if(ex) { ex.qtd += ni.qtd; } else { mesa.itens.push(ni); }
          });
          mesa.dtAtualizacao = ped.dtAtualizacao;
          if(mesa.obs) mesa.obs += ' | ' + obsStr; else mesa.obs = obsStr;
        } else {
          DB.mesas_abertas.push({
            cliente: ped.cliente,
            obs: obsStr,
            itens: ped.itens,
            dtAtualizacao: ped.dtAtualizacao
          });
        }

        // Adicionar à fila de notificações
        let totalPed = 0;
        ped.itens.forEach(i => totalPed += (i.preco || 0) * (i.qtd || 1));
        orderNotifications.unshift({
          id: ped.id,
          mesa: ped.cliente,
          itens: ped.itens,
          obs: ped.obs || '',
          total: totalPed,
          dt: ped.dtAtualizacao || new Date().toISOString(),
          unread: true
        });
        notify = true;
      });

      if(notify) {
         saveDB();
         dispararAlertaPedido(data.pedidos_novos);
         if(currentPage === 'vendas' && document.getElementById('modalOverlay').classList.contains('open') && document.querySelector('.modal-title')?.textContent.includes('Mesas')) {
             abrirModalMesas();
         }
      }

      if(idsRecebidos.length > 0) {
         _gsPost({ action: 'marcar_pedidos_recebidos', ids: idsRecebidos });
      }
    }
  } catch(e) {
    console.error("❌ Erro ao puxar pedidos digitais:", e);
    // Fallback: se o admin não configurou a URL, avisa
    if (!GOOGLE_SHEETS_URL) {
      console.warn("⚠️ URL do Google Sheets não configurada no Admin. Notificações desativadas.");
    }
  }
}

// ==================== SISTEMA DE ALERTA COMPLETO ====================

function dispararAlertaPedido(pedidos) {
  console.log("🔔 Novo pedido detectado! Disparando alertas...");
  
  // 1. Som forte (isolar erro para não travar o resto)
  try {
    tocarSomNotificacaoForte();
  } catch(e) { 
    console.warn("🔇 Áudio bloqueado pelo navegador ou erro no som:", e); 
  }

  // 2. Flash visual na tela
  try { triggerOrderFlash(); } catch(e){}

  // 3. Atualizar badge e sininho
  try { updateNotifBadge(); } catch(e){}

  // 4. Toast especial grande
  try {
    const qtdPed = pedidos.length;
    const mesas = pedidos.map(p => escapeHTML(p.cliente)).join(', ');
    showOrderToast(`🔔 ${qtdPed} novo(s) pedido(s)!`, `Mesa/Cliente: ${mesas} — Clique no sininho para ver detalhes`);
  } catch(e){}

  // 5. Notificação nativa do navegador
  try { sendBrowserNotification(pedidos); } catch(e){}

  // 6. Mudar título da aba para chamar atenção
  try { flashTabTitle(pedidos.length); } catch(e){}
}

function tocarSomNotificacaoForte() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [880, 1100, 880, 1100]; // 4 bips alternados
    const noteDuration = 0.12;
    const noteGap = 0.08;
    
    notes.forEach((freq, i) => {
      const startTime = ctx.currentTime + i * (noteDuration + noteGap);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.4, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + noteDuration + 0.02);
    });

    // Segundo round de bips depois de 1 segundo (para insistir)
    setTimeout(() => {
      try {
        const ctx2 = new (window.AudioContext || window.webkitAudioContext)();
        notes.forEach((freq, i) => {
          const startTime = ctx2.currentTime + i * (noteDuration + noteGap);
          const osc = ctx2.createOscillator();
          const gain = ctx2.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.35, startTime);
          gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);
          osc.connect(gain);
          gain.connect(ctx2.destination);
          osc.start(startTime);
          osc.stop(startTime + noteDuration + 0.02);
        });
      } catch(e){}
    }, 1200);
  } catch(e) {}
}

function triggerOrderFlash() {
  const el = document.getElementById('orderFlashOverlay');
  if (!el) return;
  el.classList.remove('active');
  void el.offsetWidth; // force reflow
  el.classList.add('active');
  setTimeout(() => el.classList.remove('active'), 2500);
}

function showOrderToast(title, sub) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'toast order-toast';
  const titleEl = document.createElement('div');
  titleEl.textContent = title;
  const subEl = document.createElement('div');
  subEl.className = 'toast-sub';
  subEl.textContent = sub;
  div.appendChild(titleEl);
  div.appendChild(subEl);
  div.onclick = () => { div.remove(); toggleNotifPanel(); };
  div.style.cursor = 'pointer';
  container.appendChild(div);
  setTimeout(() => { if(div.parentNode) div.remove(); }, 8000);
}

function sendBrowserNotification(pedidos) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const qtd = pedidos.length;
    const mesas = pedidos.map(p => p.cliente).join(', ');
    const n = new Notification('🔔 Novo Pedido - Conveniência', {
      body: `${qtd} pedido(s) recebido(s)\nMesa: ${mesas}`,
      icon: '🛒',
      tag: 'order-notif',
      requireInteraction: true
    });
    n.onclick = () => {
      window.focus();
      toggleNotifPanel();
      n.close();
    };
  } catch(e) {}
}

let tabFlashInterval = null;
const originalTitle = document.title;

function flashTabTitle(count) {
  if (tabFlashInterval) clearInterval(tabFlashInterval);
  let isAlt = false;
  tabFlashInterval = setInterval(() => {
    document.title = isAlt ? `🔔 (${count}) NOVO PEDIDO!` : originalTitle;
    isAlt = !isAlt;
  }, 800);
  
  // Para de piscar quando o usuário focar na aba
  const stopFlash = () => {
    if (tabFlashInterval) clearInterval(tabFlashInterval);
    tabFlashInterval = null;
    document.title = originalTitle;
    window.removeEventListener('focus', stopFlash);
  };
  window.addEventListener('focus', stopFlash);
  
  // Para depois de 30 segundos de qualquer forma
  setTimeout(() => {
    if (tabFlashInterval) {
      clearInterval(tabFlashInterval);
      tabFlashInterval = null;
      document.title = originalTitle;
    }
  }, 30000);
}

// ==================== PAINEL DE NOTIFICAÇÕES ====================

function updateNotifBadge() {
  const badge = document.getElementById('notifBadge');
  const bell = document.getElementById('btnNotifBell');
  const unreadCount = orderNotifications.filter(n => n.unread).length;
  
  if (unreadCount > 0) {
    badge.textContent = unreadCount;
    badge.style.display = 'flex';
    bell.classList.add('has-notif');
  } else {
    badge.style.display = 'none';
    bell.classList.remove('has-notif');
  }
}

function toggleNotifPanel() {
  const panel = document.getElementById('notifPanel');
  const overlay = document.getElementById('notifPanelOverlay');
  const isOpen = panel.classList.contains('open');
  
  if (isOpen) {
    closeNotifPanel();
  } else {
    panel.classList.add('open');
    overlay.classList.add('open');
    renderNotifPanel();
    // Marcar como lidas
    orderNotifications.forEach(n => n.unread = false);
    updateNotifBadge();
  }
}

function closeNotifPanel() {
  document.getElementById('notifPanel').classList.remove('open');
  document.getElementById('notifPanelOverlay').classList.remove('open');
}

function renderNotifPanel() {
  const list = document.getElementById('notifPanelList');
  if (!list) return;
  
  if (orderNotifications.length === 0) {
    list.innerHTML = '<div class="notif-empty">🔕 Nenhum pedido pendente<br><span style="font-size:12px; color:var(--text3)">Pedidos do cardápio digital aparecerão aqui</span></div>';
    return;
  }
  
  list.innerHTML = orderNotifications.map((n, idx) => {
    const dt = n.dt ? new Date(n.dt) : new Date();
    const timeStr = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const itensHtml = (n.itens || []).map(i => 
      `<strong>${i.qtd || 1}x</strong> ${escapeHTML(i.nome)}`
    ).join('<br>');
    
    const totalStr = n.total > 0 ? fmt(n.total) : '';
    
    return `
      <div class="notif-card ${n.unread ? 'unread' : ''}">
        <button class="notif-dismiss" onclick="dismissNotif(${idx})" title="Remover">✕</button>
        <div class="notif-header">
          <div class="notif-mesa">📍 ${escapeHTML(n.mesa)}</div>
          <div class="notif-time">${timeStr}</div>
        </div>
        <div class="notif-itens">${itensHtml}</div>
        ${n.obs ? `<div class="notif-obs">💬 ${escapeHTML(n.obs)}</div>` : ''}
        ${totalStr ? `<div class="notif-total">Total: ${totalStr}</div>` : ''}
      </div>
    `;
  }).join('');
}

function dismissNotif(idx) {
  orderNotifications.splice(idx, 1);
  updateNotifBadge();
  renderNotifPanel();
}

function clearAllNotifications() {
  orderNotifications = [];
  updateNotifBadge();
  renderNotifPanel();
}

// ===================== AUTH =====================
async function doLogin(){
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  const rem = document.getElementById('loginRemember') ? document.getElementById('loginRemember').checked : false;

  const btn = document.querySelector('.login-btn');
  if(btn) { btn.innerHTML = 'Entrando...'; btn.disabled = true; }

  const { data, error } = await sb.auth.signInWithPassword({ email: u, password: p });

  if(btn) { btn.innerHTML = 'Entrar'; btn.disabled = false; }

  if(error || !data.user) {
    document.getElementById('loginError').style.display='block';
    return;
  }

  document.getElementById('loginError').style.display='none';

  const meta = data.user.user_metadata || {};
  const user = {
    id: data.user.id,
    username: data.user.email,
    email: data.user.email,
    role: meta.role || 'funcionario',
    name: meta.name || data.user.email
  };

  finishLogin(user, rem);

  // Sincronização em background
  loadDBFromCloud().then(success => {
    if (success) {
      console.log("Banco de dados sincronizado via Supabase.");
      if (currentPage === 'caixa') document.getElementById('content').innerHTML = renderCaixa();
      if (currentPage === 'dashboard') document.getElementById('content').innerHTML = renderDashboard();
    } else if (GOOGLE_SHEETS_URL) {
      _gsGet('carregar')
        .then(r => r.json())
        .then(remoteDb => {
            const hasUpdates = mergeRemoteDB(remoteDb);
            if (hasUpdates) {
                if (currentPage === 'caixa') document.getElementById('content').innerHTML = renderCaixa();
                if (currentPage === 'dashboard') document.getElementById('content').innerHTML = renderDashboard();
            }
        });
    }
  });
}

function finishLogin(user, rem){
  const btn = document.querySelector('.login-btn');
  if(btn) { btn.innerHTML = 'Entrar'; btn.disabled = false; }
  
  if(rem) {
    localStorage.setItem('convpro_savedUser', user.email || user.username);
  } else {
    localStorage.removeItem('convpro_savedUser');
  }
  currentUser=user;
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('app').style.display='flex';
  document.getElementById('sidebarUser').textContent=user.name+' · '+user.role;
  buildSidebar();
  updateDate();
  setInterval(updateDate,60000);
  startPollingOrders();

  // Sincronização Automática Background via Supabase (Rápido e leve)
  if (!window.bgSyncInterval) {
    window.bgSyncInterval = setInterval(async () => {
      const hasUpdates = await loadDBFromCloud();
      if (hasUpdates) {
        if (currentPage === 'caixa') document.getElementById('content').innerHTML = renderCaixa();
        if (currentPage === 'dashboard') document.getElementById('content').innerHTML = renderDashboard();
        if (currentPage === 'vendas') renderProdutos_venda();
      }
    }, 20000); // Verificar a cada 20 segundos
  }

  // Sincronização Automática para Planilha (a cada 5 minutos, silenciosa)
  if (!window.autoSyncInterval && GOOGLE_SHEETS_URL) {
    window.autoSyncInterval = setInterval(() => {
      syncToGoogleSheets();
    }, 5 * 60 * 1000); // 5 minutos
  }

  // Sincronização Diária às 03:00 (garante que ambos os dispositivos ficam iguais)
  if (GOOGLE_SHEETS_URL) {
    agendarSyncDiario();
    
    // Verifica se perdeu o sync de hoje (ex: computador estava desligado às 03:00)
    const hojeStr = getBusinessDay();
    const ultimoSyncStr = DB.config?.lastSyncDiario ? normData(DB.config.lastSyncDiario) : '';
    
    // Se o último sync não foi hoje e já passou das 06:00 (início do expediente), faz agora
    if (ultimoSyncStr !== hojeStr) {
      console.log('[Sync] Backup diário pendente detectado. Executando agora...');
      executarSyncDiario();
    }
  }

  navigate('dashboard');
  auditLog('LOGIN','Acesso ao sistema');
  
  // Sincronização ao fechar o navegador
  window.addEventListener('beforeunload', () => {
    if (GOOGLE_SHEETS_URL) {
      navigator.sendBeacon(GOOGLE_SHEETS_URL, JSON.stringify({ action: 'sincronizar', db: DB }));
    }
  });
}

async function doLogout(){
  auditLog('LOGOUT','Saiu do sistema');
  await sb.auth.signOut();
  currentUser=null;
  if(orderCheckInterval) clearInterval(orderCheckInterval);
  if(window.bgSyncInterval) clearInterval(window.bgSyncInterval);
  if(window.autoSyncInterval) clearInterval(window.autoSyncInterval);
  if(window.dailySyncTimeout) clearTimeout(window.dailySyncTimeout);
  window.dailySyncTimeout = null;
  localStorage.removeItem('convpro_savedLogin'); // limpar chave legada
  document.getElementById('loginScreen').style.display='flex';
  document.getElementById('app').style.display='none';
  document.getElementById('loginPass').value='';
  if(!localStorage.getItem('convpro_savedUser')) {
    document.getElementById('loginUser').value='';
  }
}

// =================== SYNC DIÁRIO ÀS 03:00 ===================
function agendarSyncDiario() {
  const agora = new Date();
  const proximo = new Date();
  proximo.setHours(3, 0, 0, 0); // 03:00:00 de hoje

  // Se já passou das 03:00 de hoje, agenda para amanhã
  if (agora >= proximo) {
    proximo.setDate(proximo.getDate() + 1);
  }

  const msAte03 = proximo.getTime() - agora.getTime();
  const horasAte = Math.round(msAte03 / 1000 / 60 / 60 * 10) / 10;
  console.log(`[Sync Diário] Próxima sincronização em ${horasAte}h (às 03:00 de ${proximo.toLocaleDateString('pt-BR')})`);

  window.dailySyncTimeout = setTimeout(() => {
    executarSyncDiario();
  }, msAte03);
}

async function executarSyncDiario() {
  console.log('[Sync Diário] Executando sincronização das 03:00...');
  try {
    // 1. Envia dados locais para a planilha
    await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'sincronizar', db: DB }),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    });

    // 2. Puxa os dados remotos e faz merge
    const res = await fetch(GOOGLE_SHEETS_URL + '?action=carregar');
    const remoteDb = await res.json();
    const hasUpdates = mergeRemoteDB(remoteDb);

    showToast('✅ Sincronização diária (03:00) concluída!', 'success');
    console.log('[Sync Diário] Concluída.', hasUpdates ? 'Dados atualizados.' : 'Sem novidades.');

    // Refresca a tela se necessário
    if (hasUpdates) {
      if (currentPage === 'caixa') document.getElementById('content').innerHTML = renderCaixa();
      if (currentPage === 'dashboard') document.getElementById('content').innerHTML = renderDashboard();
    }

    // ✅ Salva backup JSON no Google Drive após o sync
    await salvarBackupGoogleDrive();

    DB.config.lastSyncDiario = new Date().toISOString();
    saveDB();
  } catch(e) {
    console.error('[Sync Diário] Erro:', e);
    showToast('⚠️ Falha na sincronização das 03:00. Verifique a conexão.', 'error');
  }

  // Agenda o próximo sync (daqui 24h)
  window.dailySyncTimeout = null;
  agendarSyncDiario();
}

async function salvarBackupGoogleDrive() {
  if (!GOOGLE_SHEETS_URL) return;
  try {
    const dataHoje = new Date().toLocaleDateString('pt-BR').replace(/\//g,'-');
    const nomeArquivo = `backup_conveniencia_${dataHoje}.json`;
    const payload = JSON.stringify({ action: 'salvar_backup_drive', nomeArquivo, db: DB });

    const res = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    });
    const data = await res.json();
    if (data.success) {
      console.log(`[Backup Drive] ✅ Backup salvo: ${data.nomeArquivo}`);
      DB.config.lastBackupSync = new Date().toISOString();
      saveDB();
      showToast(`☁️ Backup salvo no Drive: ${nomeArquivo}`, 'success');
    } else {
      console.warn('[Backup Drive] ⚠️ Erro ao salvar:', data.error);
    }
  } catch(e) {
    console.error('[Backup Drive] Falha:', e);
  }
}

async function testarBackupDrive() {
  if (!GOOGLE_SHEETS_URL) {
    showToast('Configure a URL do Google Sheets primeiro!', 'error');
    return;
  }
  const btn = document.getElementById('btnBackupDrive');
  const status = document.getElementById('backupDriveStatus');
  if (btn) { btn.innerHTML = '⏳ Salvando...'; btn.disabled = true; }
  if (status) status.textContent = 'Aguarde...';

  try {
    const dataHoje = new Date().toLocaleDateString('pt-BR').replace(/\//g,'-');
    const nomeArquivo = `backup_conveniencia_${dataHoje}.json`;
    const payload = JSON.stringify({ action: 'salvar_backup_drive', nomeArquivo, db: DB });

    const res = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    });
    const data = await res.json();
    if (data.success) {
      if (btn) { btn.innerHTML = '✅ Backup Salvo!'; btn.disabled = false; }
      if (status) status.textContent = `✅ Arquivo "${data.nomeArquivo}" salvo na pasta "Backups Conveniencia" do Drive.`;
      showToast('☁️ Backup salvo no Google Drive!', 'success');
    } else {
      throw new Error(data.error);
    }
  } catch(e) {
    if (btn) { btn.innerHTML = '☁️ Salvar Backup Agora no Drive'; btn.disabled = false; }
    if (status) status.textContent = `❌ Erro: ${e.message}`;
    showToast('Erro ao salvar backup: ' + e.message, 'error');
  }
}

function updateDate(){
  const d=new Date();
  document.getElementById('topbarDate').textContent=
    d.toLocaleDateString('pt-BR')+' '+d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
}

// ===================== SIDEBAR =====================
const NAV_DEV = [
  {section:'Geral'},
  {id:'dashboard',icon:'📊',label:'Dashboard'},
  {id:'caixa',icon:'🏦',label:'Caixa do Dia'},
  {section:'Operações'},
  {id:'vendas',icon:'🛒',label:'Registrar Venda'},
  {id:'producao',icon:'🔥',label:'Produção'},
  {id:'consumo',icon:'📦',label:'Consumo Interno'},
  {section:'Estoque'},
  {id:'estoque',icon:'🗄️',label:'Estoque'},
  {id:'compras',icon:'🧾',label:'Compras'},
  {section:'Cadastros'},
  {id:'produtos',icon:'🏷️',label:'Produtos'},
  {id:'usuarios',icon:'👥',label:'Usuários'},
  {section:'Relatórios'},
  {id:'relatorios',icon:'📈',label:'Relatórios'},
  {id:'auditoria',icon:'🔍',label:'Auditoria'},
  {section:'Sistema'},
  {id:'backup',icon:'💾',label:'Backup'},
];
const NAV_ADMIN = [
  {section:'Geral'},
  {id:'dashboard',icon:'📊',label:'Dashboard'},
  {id:'caixa',icon:'🏦',label:'Caixa do Dia'},
  {section:'Operações'},
  {id:'vendas',icon:'🛒',label:'Registrar Venda'},
  {id:'producao',icon:'🔥',label:'Produção'},
  {id:'consumo',icon:'📦',label:'Consumo Interno'},
  {section:'Estoque'},
  {id:'estoque',icon:'🗄️',label:'Estoque'},
  {id:'compras',icon:'🧾',label:'Compras'},
  {section:'Cadastros'},
  {id:'produtos',icon:'🏷️',label:'Produtos'},
  {section:'Relatórios'},
  {id:'relatorios',icon:'📈',label:'Relatórios'},
  {id:'auditoria',icon:'🔍',label:'Auditoria'},
];
const NAV_FUNC = [
  {section:'Venda'},
  {id:'vendas',icon:'🛒',label:'Registrar Venda'},
];

function buildSidebar(){
  let nav = NAV_FUNC;
  if(currentUser.role === 'dev') nav = NAV_DEV;
  else if(currentUser.role === 'admin') nav = NAV_ADMIN;
  
  const el=document.getElementById('sidebarNav');
  el.innerHTML=nav.map(n=>n.section?
    `<div class="nav-section">${n.section}</div>`:
    `<div class="nav-item" id="nav-${n.id}" onclick="navigate('${n.id}')"><span class="icon">${n.icon}</span>${n.label}</div>`
  ).join('');
}

function setActiveNav(page){
  document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));
  const el=document.getElementById('nav-'+page);
  if(el)el.classList.add('active');
}

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

// ===================== NAVIGATE =====================
const PAGE_TITLES={
  dashboard:'Dashboard',vendas:'Registrar Venda',producao:'Produção',
  consumo:'Consumo Interno',estoque:'Estoque',compras:'Compras',
  produtos:'Produtos',usuarios:'Usuários',relatorios:'Relatórios',
  auditoria:'Auditoria',caixa:'Caixa do Dia',backup:'Backup de Dados'
};
function navigate(page){
  if(currentUser.role==='funcionario'&&page!=='vendas')page='vendas';
  if(currentUser.role==='admin'&&(page==='usuarios'||page==='backup'))page='dashboard';
  currentPage=page;
  setActiveNav(page);
  document.getElementById('topbarTitle').textContent=PAGE_TITLES[page]||page;
  closeSidebar();
  const c=document.getElementById('content');
  switch(page){
    case 'dashboard': c.innerHTML=renderDashboard();break;
    case 'vendas': c.innerHTML=renderVendas();initVendas();break;
    case 'producao': c.innerHTML=renderProducao();break;
    case 'consumo': c.innerHTML=renderConsumo();break;
    case 'estoque': c.innerHTML=renderEstoque();break;
    case 'compras': c.innerHTML=renderCompras();break;
    case 'produtos': c.innerHTML=renderProdutos();break;
    case 'usuarios': c.innerHTML=renderUsuarios();break;
    case 'relatorios': c.innerHTML=renderRelatorios();break;
    case 'auditoria': c.innerHTML=renderAuditoria();break;
    case 'caixa': c.innerHTML=renderCaixa();break;
    case 'backup': c.innerHTML=renderBackup();break;
    default: c.innerHTML='<p>Página não encontrada</p>';
  }
}

// ===================== HELPERS =====================
function fmt(v){return 'R$ '+parseFloat(v||0).toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.')}
function fmtDate(iso){
  if(!iso) return '';
  // Evita o bug de fuso horário do JS que subtrai 1 dia ao dar parse em strings YYYY-MM-DD
  const raw = String(iso).split('T')[0].split('-');
  if (raw.length !== 3) return iso;
  return `${raw[2]}/${raw[1]}/${raw[0]}`;
}
function fmtDT(iso){
  if(!iso) return '';
  const d = new Date(iso);
  if(isNaN(d.getTime())) return iso;
  return d.toLocaleString('pt-BR');
}
function getLocalISODate() {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, -1);
}
function today(){return getLocalISODate().slice(0,10)}

// =================== DIA COMERCIAL (TURNO NOTURNO) ===================
// Se passar da meia-noite mas ainda for antes de 06:00, considera o dia anterior
// pois o turno noturno (qui 18h → sex 01h) ainda pertence ao dia de quinta.
const BUSINESS_DAY_CUTOFF_HOUR = 6; // Horas após meia-noite que ainda são "turno da noite"
let _nightModeOverride = null; // null = auto, string 'auto' = forçado auto, string 'YYYY-MM-DD' = forçado manual

function getBusinessDay() {
  const d = new Date();
  const hour = d.getHours();
  // Se for entre meia-noite e 06:00 (exclusive), voltamos 1 dia
  if (hour >= 0 && hour < BUSINESS_DAY_CUTOFF_HOUR) {
    const yesterday = new Date(d);
    yesterday.setDate(d.getDate() - 1);
    const tzOffset = yesterday.getTimezoneOffset() * 60000;
    return new Date(yesterday.getTime() - tzOffset).toISOString().slice(0, 10);
  }
  return today();
}

function isNightShift() {
  const hour = new Date().getHours();
  return hour >= 0 && hour < BUSINESS_DAY_CUTOFF_HOUR;
}

// Retorna o dia a usar nas vendas e no caixa
function getEffectiveDay() {
  if (_nightModeOverride && _nightModeOverride !== 'auto') return _nightModeOverride;
  return getBusinessDay();
}

function normData(d) {
  if (!d) return '';
  d = String(d).split('T')[0];
  if (d.includes('/')) {
    const p = d.split('/');
    if (p.length === 3) return p[2] + '-' + p[1].padStart(2, '0') + '-' + p[0].padStart(2, '0');
  }
  return d.slice(0, 10);
}
function uid(prefix){
  return Date.now().toString() + Math.random().toString(36).substring(2, 6);
}
function escapeHTML(str){
  if(!str)return '';
  return String(str).replace(/[&<>'"]/g, t => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[t]));
}

function showToast(msg,type='success'){
  const t=document.createElement('div');
  t.className='toast '+type;
  t.textContent=msg;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(()=>t.remove(),3500);
}

function openModal(html){
  document.getElementById('modalContent').innerHTML=html;
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal(){
  document.getElementById('modalOverlay').classList.remove('open');
}
document.getElementById('modalOverlay').addEventListener('click',function(e){
  if(e.target===this)closeModal();
});

function opTag(op){
  if(op==='Espetinho')return '<span class="tag op1">🔥 Espetinho</span>';
  return '<span class="tag op2">🍺 Bebidas</span>';
}

// ===================== DASHBOARD =====================
// ===================== DASHBOARD =====================
function renderDashboard(){
  const hoje = getEffectiveDay(); 
  const mesAtual = hoje.slice(0, 7);
  
  // Dados de Hoje
  const vendasHoje = DB.vendas.filter(v => {
    const d = normData(v.data || v.dt);
    return d === hoje;
  });
  const totalHoje = vendasHoje.reduce((s, v) => s + (v.total || 0), 0);
  const custoHoje = vendasHoje.reduce((s, v) => s + (v.custo || 0), 0);
  const consumoHoje = (DB.consumos || []).filter(c => normData(c.data) === hoje);
  const custoConsumoHoje = consumoHoje.reduce((s, c) => {
    const p = DB.produtos.find(x => x.id === c.produtoId);
    return s + (p && p.custo ? p.custo * c.qtd : 0);
  }, 0);
  const lucroHoje = totalHoje - custoHoje - custoConsumoHoje;
  const abertos = (DB.mesas_abertas || []).length;
  const pedidosHoje = vendasHoje.length + abertos;

  // Dados do Mês
  const vendasMes = DB.vendas.filter(v => normData(v.data).slice(0, 7) === mesAtual);
  const totalVendasMes = vendasMes.reduce((s, v) => s + v.total, 0);
  const custoVendasMes = vendasMes.reduce((s, v) => s + v.custo, 0);
  const consumoMes = (DB.consumos || []).filter(c => normData(c.data).slice(0, 7) === mesAtual);
  const custoConsumoMes = consumoMes.reduce((s, c) => {
    const p = DB.produtos.find(x => x.id === c.produtoId);
    return s + (p && p.custo ? p.custo * c.qtd : 0);
  }, 0);
  const comprasMes = (DB.compras || []).filter(c => normData(c.data).slice(0, 7) === mesAtual);
  const totalComprasMes = comprasMes.reduce((s, c) => s + c.total, 0);
  const lucroMes = totalVendasMes - custoVendasMes - custoConsumoMes;
  const ticketMedioMes = totalVendasMes / (vendasMes.length || 1);

  // Pico de Horário (Hoje)
  const horasMap = {};
  vendasHoje.forEach(v => {
    if (v.dtAtualizacao) {
      const h = new Date(v.dtAtualizacao).getHours();
      if (!isNaN(h)) horasMap[h] = (horasMap[h] || 0) + 1;
    }
  });
  let picoHora = '--';
  let maxVendasHora = 0;
  for (const [h, qtd] of Object.entries(horasMap)) {
    if (qtd > maxVendasHora) { maxVendasHora = qtd; picoHora = `${h}h`; }
  }

  // Totais por Operação (Hoje)
  const totEsp = vendasHoje.reduce((s,v)=>s+v.itens.filter(i=>{const p=DB.produtos.find(x=>x.id==i.produtoId);return p?.operacao==='Espetinho'}).reduce((a,i)=>a+i.subtotal,0),0);
  const totBeb = vendasHoje.reduce((s,v)=>s+v.itens.filter(i=>{const p=DB.produtos.find(x=>x.id==i.produtoId);return p?.operacao==='Bebidas'}).reduce((a,i)=>a+i.subtotal,0),0);

  // Ranking (Hoje)
  const rankMap={};
  vendasHoje.forEach(v=>v.itens.forEach(i=>{
    rankMap[i.nome]=(rankMap[i.nome]||0)+i.qtd;
  }));
  const rank=Object.entries(rankMap).sort((a,b)=>b[1]-a[1]).slice(0,5);

  const produtosAlerta = DB.produtos.filter(p=>p.status==='ativo' && p.estoque<=p.estoqueMin);

  return `
  ${produtosAlerta.length ? `<div class="alert warning">⚠️ <strong>Estoque Baixo:</strong> ${produtosAlerta.length} produtos precisam de atenção.</div>` : ''}

  <div class="section-header">
    <div class="topbar-title">📊 Resumo de Hoje</div>
    <div class="topbar-badge">${fmtDate(hoje)}</div>
  </div>

  <div class="grid-4 mb-4">
    <div class="stat-card amber">
      <div class="stat-label">Pedidos Hoje</div>
      <div class="stat-value text-amber">${pedidosHoje}</div>
      <div class="stat-sub">${vendasHoje.length} concluídos, ${abertos} abertos</div>
    </div>
    <div class="stat-card blue">
      <div class="stat-label">Vendas Hoje</div>
      <div class="stat-value text-blue">${fmt(totalHoje)}</div>
      <div class="stat-sub">Faturamento bruto do dia</div>
    </div>
    <div class="stat-card green">
      <div class="stat-label">Lucro Hoje</div>
      <div class="stat-value text-green">${fmt(lucroHoje)}</div>
      <div class="stat-sub">Pico de vendas: <strong>${picoHora}</strong></div>
    </div>
    <div class="stat-card red">
      <div class="stat-label">Perdas (Hoje)</div>
      <div class="stat-value text-red">${fmt(custoConsumoHoje)}</div>
      <div class="stat-sub">Custo de consumo interno</div>
    </div>
  </div>

  <div class="section-header">
    <div class="topbar-title">🗓️ Resumo do Mês (${new Date().toLocaleString('pt-BR',{month:'long'})})</div>
    <div class="topbar-badge">${mesAtual}</div>
  </div>

  <div class="grid-4 mb-4">
    <div class="stat-card blue">
      <div class="stat-label">Ganhos (Mês)</div>
      <div class="stat-value text-blue">${fmt(totalVendasMes)}</div>
      <div class="stat-sub">Total faturado no mês</div>
    </div>
    <div class="stat-card red">
      <div class="stat-label">Gastos (Mês)</div>
      <div class="stat-value text-red">${fmt(totalComprasMes)}</div>
      <div class="stat-sub">Total em compras de estoque</div>
    </div>
    <div class="stat-card green">
      <div class="stat-label">Lucro Real</div>
      <div class="stat-value text-green">${fmt(lucroMes)}</div>
      <div class="stat-sub">Margem: ${totalVendasMes?((lucroMes/totalVendasMes)*100).toFixed(1):0}%</div>
    </div>
    <div class="stat-card purple">
      <div class="stat-label">Ticket Médio</div>
      <div class="stat-value" style="color:var(--purple)">${fmt(ticketMedioMes)}</div>
      <div class="stat-sub">Média mensal por venda</div>
    </div>
  </div>

  <div class="grid-2 mb-4">
    <div class="card">
      <div class="card-title">🚀 Top 5 – Hoje</div>
      <div style="display:flex; flex-direction:column; gap:8px">
        ${rank.length ? rank.map(([n, q]) => `
          <div class="flex justify-between items-center">
            <span style="font-size:13px; color:var(--text2)">${n}</span>
            <span class="badge blue">${q} un</span>
          </div>`).join('') : '<div class="text-muted" style="text-align:center; padding:10px">Sem vendas ainda</div>'}
      </div>
    </div>
    <div class="card">
      <div class="card-title">💳 Totais por Operação – Hoje</div>
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2"><span class="op-dot op1"></span><span style="font-size:13px">Espetinho</span></div>
        <span class="text-amber mono" style="font-weight:600">${fmt(totEsp)}</span>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2"><span class="op-dot op2"></span><span style="font-size:13px">Bebidas/Geral</span></div>
        <span class="text-blue mono" style="font-weight:600">${fmt(totBeb)}</span>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="section-header" style="margin-bottom:12px">
      <div class="card-title" style="margin:0">🛍️ Últimas Vendas</div>
      <button class="btn btn-ghost btn-sm" onclick="currentPage='caixa'; navigate('caixa')">Ver Tudo →</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Data/Hora</th>
            <th>Cliente</th>
            <th>Pagamento</th>
            <th style="text-align:right">Total</th>
            <th style="text-align:center">Ação</th>
          </tr>
        </thead>
        <tbody>
          ${[...DB.vendas].sort((a,b) => new Date(b.dt || b.data) - new Date(a.dt || a.data)).slice(0, 10).map(v => `
            <tr>
              <td class="mono" style="font-size:11px">${v.dt ? v.dt.split('T')[0].split('-').slice(1).reverse().join('/') + ' ' + v.dt.split('T')[1].slice(0,5) : '-'}</td>
              <td style="font-weight:600">${v.cliente || 'Consumidor'}</td>
              <td><span class="badge green">${v.pagamento}</span></td>
              <td class="text-amber mono" style="text-align:right; font-weight:700">${fmt(v.total)}</td>
              <td style="text-align:center">
                <button class="btn btn-danger btn-sm" onclick="estornarVenda('${v.id}')" title="Estornar Venda" style="padding:2px 6px; font-size:10px;">Estornar</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

// ===================== QR CODE CARDÁPIO =====================
function gerarQRCodeMesa(){
  const mesas = [1,2,3,4,5,6,7,8,9,10];
  const currentUrl = window.location.href.split('index.html')[0] + 'cardapio.html';
  const gsParam = '';
  
  openModal(`
    <div class="modal-title">📱 Gerar QR Code - Cardápio Digital</div>
    <p class="text-muted" style="margin-bottom: 20px;">
      O cardápio digital lê os produtos do seu sistema. Compartilhe o link abaixo ou imprima os QR Codes para as mesas.<br><br>
      <small><strong>Dica:</strong> Para que o celular do cliente leia o cardápio, seu sistema precisa ter rede habilitada (LiveServer) ou IP acessível.</small>
    </p>

    <div class="table-wrap mb-4">
      <table>
        <thead><tr><th>Mesa</th><th>Link Público</th><th>Ação</th></tr></thead>
        <tbody>
          ${mesas.map(m => {
            const link = currentUrl + '?mesa=' + m + gsParam;
            return `
            <tr>
              <td><strong>Mesa ${m}</strong></td>
              <td class="mono" style="font-size: 11px; max-width: 200px; overflow: hidden; text-overflow: ellipsis;">
                <a href="${link}" target="_blank" style="color:var(--text2)">${link}</a>
              </td>
              <td>
                <button class="btn btn-ghost btn-sm" onclick="window.open('${link}', '_blank')">Visualizar</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="modal-footer"><button class="btn btn-primary" onclick="closeModal()">Fechar</button></div>
  `);
}

// ===================== VENDAS =====================
let cart=[];
let selectedOp='todos';

function renderVendas(){
  return `
  <div class="grid-2" style="gap:16px">
    <div>
      <div class="card mb-3">
        <div class="flex gap-2 mb-3">
          <button class="btn btn-ghost btn-sm" id="opBtn-todos">Todos</button>
          <button class="btn btn-ghost btn-sm" id="opBtn-Espetinho">🔥 Espetinho</button>
          <button class="btn btn-ghost btn-sm" id="opBtn-Bebidas">🍺 Bebidas</button>
        </div>
        <div class="mb-3">
          <input type="text" id="vendaSearch" class="form-control" placeholder="🔍 Pesquisar produto por nome..." oninput="renderProdutos_venda()">
        </div>
        <div class="produto-grid" id="produtoGrid"></div>
      </div>
    </div>
    <div>
      <div class="card mb-3">
        <div class="flex items-center justify-between mb-3">
          <div class="card-title" style="margin:0">🛒 Carrinho</div>
          <button class="btn btn-ghost btn-sm" style="font-size:12px; border:1px solid var(--border); position:relative" onclick="abrirModalMesas()">
            <span class="icon">📝</span> Mesas Abertas
            ${DB.mesas_abertas?.length ? `<span style="position:absolute; top:-8px; right:-8px; background:var(--red); color:white; font-size:10px; padding:2px 6px; border-radius:10px; font-weight:bold; border:2px solid var(--surface1)">${DB.mesas_abertas.length}</span>` : ''}
          </button>
        </div>
        <div id="cartItems"><div class="empty-state" style="padding:16px"><div class="icon">🛒</div>Adicione produtos</div></div>
        <div class="divider"></div>
        <div class="flex items-center justify-between mb-3">
          <strong style="font-size:16px">Total</strong>
          <strong class="mono text-amber" style="font-size:20px" id="cartTotal">R$ 0,00</strong>
        </div>
      </div>
      <div class="card">
        <div class="form-row cols-2 mb-3">
          <div class="form-group" style="margin:0">
            <label class="form-label">Tipo de Venda</label>
            <select class="form-control" id="vendaTipo">
              <option>Mesa</option><option>Balcão</option><option>Carro/Moto</option>
              <option>Retirada</option><option>Delivery</option><option>Evento</option>
            </select>
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label">Status Receb.</label>
            <div class="text-muted" style="padding-top:10px; font-size:13px;">Pagamento no Menu (Checkout)</div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Mesa / Nome do Cliente</label>
          <input class="form-control" id="vendaCliente" placeholder="Ex: Mesa 04 ou João">
        </div>
        <div class="form-group">
          <label class="form-label">Observação</label>
          <input class="form-control" id="vendaObs" placeholder="opcional">
        </div>
        <div class="form-group flex items-center" style="gap:8px; margin-bottom: 12px; cursor: pointer;" onclick="document.getElementById('vendaImprimir').click()">
          <input type="checkbox" id="vendaImprimir" checked style="cursor: pointer; transform: scale(1.1);" onclick="event.stopPropagation()">
          <label for="vendaImprimir" style="margin:0; cursor: pointer; user-select: none; font-size: 13px;">Imprimir comprovante (80mm)</label>
        </div>
        <div class="flex" style="gap:8px; margin-top:15px">
          <button class="btn btn-ghost" style="flex:1; background:var(--surface2); color:var(--text1); padding:13px; font-size:14px" onclick="salvarMesaAberta()">⏳ Deixar em Aberto</button>
          <button class="btn btn-primary" style="flex:1; padding:13px; font-size:14px" onclick="prepararFechamento()">💳 Pagar e Finalizar</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card mt-4">
    <div class="card-title">🛍️ Vendas Recentes (Hoje)</div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Hora</th>
            <th>Cliente</th>
            <th>Total</th>
            <th style="text-align:center">Ação</th>
          </tr>
        </thead>
        <tbody id="vendasRecentesVenda">
          <!-- Preenchido pelo initVendas -->
        </tbody>
      </table>
    </div>
  </div>`;
}

function initVendas(){
  cart=[];
  selectedOp='todos';
  renderProdutos_venda();
  updateCart();
  renderVendasRecentes_venda(); // <--- Adicionado
  ['todos','Espetinho','Bebidas'].forEach(op=>{
    const btn=document.getElementById('opBtn-'+op);
    if(btn){
      btn.addEventListener('click',()=>{
        selectedOp=op;
        ['todos','Espetinho','Bebidas'].forEach(o=>{
          const b=document.getElementById('opBtn-'+o);
          if(b){b.className='btn btn-ghost btn-sm'+(o===op?' btn-primary':'')}
        });
        renderProdutos_venda();
      });
    }
  });
}

function renderVendasRecentes_venda() {
  const el = document.getElementById('vendasRecentesVenda');
  if(!el) return;
  const hoje = getEffectiveDay();
  const vendas = DB.vendas.filter(v => normData(v.data) === hoje)
                          .sort((a,b) => new Date(b.dt || b.data) - new Date(a.dt || a.data))
                          .slice(0, 5);
  
  if (vendas.length === 0) {
    el.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 15px;">Nenhuma venda hoje.</td></tr>';
    return;
  }
  
  el.innerHTML = vendas.map(v => `
    <tr>
      <td class="mono" style="font-size:12px">${v.hora || (v.dt ? v.dt.split('T')[1].slice(0,5) : '-')}</td>
      <td class="fw-bold">${v.cliente || 'Consumidor'}</td>
      <td class="text-amber fw-bold">${fmt(v.total)}</td>
      <td style="text-align:center">
        <button class="btn btn-danger btn-sm" onclick="estornarVenda('${v.id}')" style="padding: 2px 8px; font-size: 10px;">Estornar</button>
      </td>
    </tr>
  `).join('');
}

function renderProdutos_venda(){
  const grid=document.getElementById('produtoGrid');
  if(!grid)return;
  let prods=DB.produtos.filter(p=>p.status==='ativo');
  if(selectedOp!=='todos')prods=prods.filter(p=>p.operacao===selectedOp);
  
  const searchInput = document.getElementById('vendaSearch');
  if (searchInput && searchInput.value) {
    const term = searchInput.value.toLowerCase().trim();
    prods = prods.filter(p => p.nome.toLowerCase().includes(term));
  }

  grid.innerHTML=prods.map(p=>`
    <div class="produto-btn" id="pbtn-${p.id}" onclick="addToCart('${p.id}')">
      <div class="p-op">${p.operacao==='Espetinho'?'🔥':'🍺'} ${p.operacao}</div>
      <div class="p-name">${p.nome}</div>
      <div class="p-price">${fmt(p.preco)}</div>
    </div>`).join('');
}

function addToCart(pid){
  const p=DB.produtos.find(x=>x.id==pid);
  if(!p)return;
  const ex=cart.find(x=>x.produtoId==pid);
  if(ex)ex.qtd++;
  else cart.push({produtoId:pid,nome:p.nome,preco:p.preco,custo:p.custo,qtd:1,operacao:p.operacao});
  updateCart();
}

function updateCart(){
  const el=document.getElementById('cartItems');
  const tot=document.getElementById('cartTotal');
  if(!el)return;
  if(cart.length===0){el.innerHTML='<div class="empty-state" style="padding:16px"><div class="icon">🛒</div>Adicione produtos</div>';if(tot)tot.textContent='R$ 0,00';return;}
  el.innerHTML=cart.map((item,i)=>`
    <div class="cart-item">
      <div>
        <div style="font-weight:600;font-size:13px">${item.nome}</div>
        <div class="mono text-amber" style="font-size:12px">${fmt(item.preco)} un</div>
      </div>
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="changeQty(${i},-1)">−</button>
        <span class="mono" style="min-width:24px;text-align:center">${item.qtd}</span>
        <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
        <button class="qty-btn" onclick="removeFromCart(${i})" style="color:var(--red);border-color:var(--red-dim)">×</button>
      </div>
    </div>`).join('');
  const total=cart.reduce((s,i)=>s+i.preco*i.qtd,0);
  if(tot)tot.textContent=fmt(total);
}

function changeQty(i,d){
  cart[i].qtd+=d;
  if(cart[i].qtd<=0)cart.splice(i,1);
  updateCart();
}
function removeFromCart(i){cart.splice(i,1);updateCart();}

function prepararFechamento() {
  if (cart.length === 0) { showToast('Carrinho vazio!', 'error'); return; }
  const total = cart.reduce((s,i) => s + i.preco * i.qtd, 0);

  openModal(`
    <style>
      .split-input { width:60px; text-align:center; margin:0 10px; padding:5px; border-radius:5px; border:1px solid var(--border); background:var(--surface3); color:var(--text); font-weight:bold; }
      .calc-result { color: var(--amber); font-weight:bold; font-size:18px; margin-top:5px; display:block; }
      .misto-val { background: var(--surface) !important; color: var(--text) !important; }
    </style>
    <div class="modal-title">💳 Finalizar Pagamento</div>
    
    <div style="font-size:24px; font-weight:800; text-align:center; margin-bottom:15px; background:var(--surface2); padding:10px; border-radius:10px;">
      Total: <span class="text-amber mono">${fmt(total)}</span>
    </div>
    
    <div class="card mb-3" style="background:var(--surface2)">
      <div style="font-weight:600; margin-bottom:10px;">👤 Dividir Conta (Balcão)</div>
      <div style="display:flex; align-items:center;">
        Pessoas: 
        <button class="btn btn-ghost btn-sm" onclick="mudarSplit(-1)">-</button>
        <input type="number" id="splitQtd" class="split-input" value="1" min="1" readonly>
        <button class="btn btn-ghost btn-sm" onclick="mudarSplit(1)">+</button>
      </div>
      <span class="calc-result" id="splitResult">${fmt(total)} por pessoa</span>
    </div>

    <div class="card mb-3" style="background:var(--surface2)">
      <div style="font-weight:600; margin-bottom:10px;">💰 Forma de Pagamento</div>
      
      <div class="form-group" style="margin:0;">
        <select class="form-control mb-2" id="vendaPagModal" onchange="togglePagamentoMisto()">
          <option value="Pix">Pix</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão Débito">Cartão Débito</option>
          <option value="Cartão Crédito">Cartão Crédito</option>
          <option value="Fiado/Pendente">Fiado (Anotado)</option>
          <option value="Misto">Misto (Dividido em várias formas)</option>
        </select>
      </div>
      
      <div id="mistoContainer" style="display:none; margin-top:15px;">
        <div class="form-row cols-2 mb-2">
            <div>
              <label class="form-label" style="font-size:11px">Pix</label>
              <input type="number" step="0.01" class="form-control form-control-sm misto-val" id="mistoPix" placeholder="0.00" oninput="calcMisto()">
            </div>
            <div>
              <label class="form-label" style="font-size:11px">Dinheiro</label>
              <input type="number" step="0.01" class="form-control form-control-sm misto-val" id="mistoDinheiro" placeholder="0.00" oninput="calcMisto()">
            </div>
        </div>
        <div class="form-row cols-2">
            <div>
              <label class="form-label" style="font-size:11px">C. Débito</label>
              <input type="number" step="0.01" class="form-control form-control-sm misto-val" id="mistoDebito" placeholder="0.00" oninput="calcMisto()">
            </div>
            <div>
              <label class="form-label" style="font-size:11px">C. Crédito</label>
              <input type="number" step="0.01" class="form-control form-control-sm misto-val" id="mistoCredito" placeholder="0.00" oninput="calcMisto()">
            </div>
        </div>
        <div style="text-align:right; margin-top:5px; font-size:14px;" id="mistoFalta">Falta: <span class="text-amber text-bold">${fmt(total)}</span></div>
      </div>
    </div>
    
    <div class="modal-footer" style="margin-top:20px;">
       <button class="btn btn-ghost" onclick="closeModal()">Voltar</button>
       <button class="btn btn-primary" onclick="finalizarVendaDoModal(${total})">✅ Confirmar Recebimento</button>
    </div>
  `);
  
  window.currentTotalFechamento = total;
}

window.mudarSplit = function(delta) {
  const el = document.getElementById('splitQtd');
  let val = parseInt(el.value) + delta;
  if (val < 1) val = 1;
  el.value = val;
  const perPerson = window.currentTotalFechamento / val;
  document.getElementById('splitResult').textContent = fmt(perPerson) + ' por pessoa';
}

window.togglePagamentoMisto = function() {
  const pag = document.getElementById('vendaPagModal').value;
  const c = document.getElementById('mistoContainer');
  c.style.display = pag === 'Misto' ? 'block' : 'none';
  if(pag === 'Misto') calcMisto();
}

window.calcMisto = function() {
  const p = parseFloat(document.getElementById('mistoPix').value||0);
  const d = parseFloat(document.getElementById('mistoDinheiro').value||0);
  const c = parseFloat(document.getElementById('mistoCredito').value||0);
  const b = parseFloat(document.getElementById('mistoDebito').value||0);
  const sum = p + d + c + b;
  const falta = window.currentTotalFechamento - sum;
  const fEl = document.getElementById('mistoFalta');
  if(falta > 0) {
    fEl.innerHTML = `Falta: <span class="text-amber">` + fmt(Math.abs(falta)) + `</span>`;
  } else if (falta < 0) {
    fEl.innerHTML = `Troco a devolver: <span class="text-green text-bold" style="font-weight:bold;">` + fmt(Math.abs(falta)) + `</span>`;
  } else {
    fEl.innerHTML = `<span class="text-green text-bold" style="font-weight:bold;">Valor exato!</span>`;
  }
}

function finalizarVendaDoModal(totalEsperado) {
  // Proteção contra clique duplo
  const btn = document.querySelector('.modal-footer .btn-primary');
  if(btn) {
    if(btn.disabled) return;
    btn.disabled = true;
    btn.innerHTML = '🕒 Processando...';
  }

  const pag = document.getElementById('vendaPagModal').value;
  let formatedPag = pag;
  let mistoJson = null;

  if (pag === 'Misto') {
      const p = parseFloat(document.getElementById('mistoPix').value||0);
      const d = parseFloat(document.getElementById('mistoDinheiro').value||0);
      const c = parseFloat(document.getElementById('mistoCredito').value||0);
      const b = parseFloat(document.getElementById('mistoDebito').value||0);
      const sum = p + d + c + b;
      
      // permitimos passar com troco, mas se sum for menor que o esperado, avisa
      if (sum < (totalEsperado - 0.05)) { // margem de erro
         showToast('Cobre o valor total da mesa!', 'error');
         if(btn) { btn.disabled = false; btn.innerHTML = '✅ Confirmar Recebimento'; }
         return;
      }
      mistoJson = { pix: p, dinheiro: d, credito: c, debito: b, troco: (sum - totalEsperado) };
      
      const arrDesc = [];
      if(p>0) arrDesc.push('Pix '+fmt(p));
      if(d>0) arrDesc.push('Din '+fmt(d));
      if(c>0) arrDesc.push('Cred '+fmt(c));
      if(b>0) arrDesc.push('Deb '+fmt(b));
      formatedPag = 'Misto (' + arrDesc.join(', ') + ')';
  }

  closeModal();
  finalizarVenda(formatedPag, mistoJson);
}

function finalizarVenda(OverridePag, mistoJson){
  if(cart.length===0){showToast('Carrinho vazio!','error');return;}
  const tipo=document.getElementById('vendaTipo')?.value;
  const pag=OverridePag || 'Não Informado';
  const obs=escapeHTML(document.getElementById('vendaObs')?.value);
  const cliente=escapeHTML(document.getElementById('vendaCliente')?.value);
  const total=cart.reduce((s,i)=>s+i.preco*i.qtd,0);
  const custo=cart.reduce((s,i)=>s+i.custo*i.qtd,0);
  const venda={
    id:uid('venda'),data:getEffectiveDay(),hora:new Date().toLocaleTimeString('pt-BR'),
    tipo,pagamento:pag,obs,total,custo,cliente,
    itens:cart.map(i=>({produtoId:i.produtoId,nome:i.nome,preco:i.preco,custo:i.custo,qtd:i.qtd,subtotal:i.preco*i.qtd})),
    usuario:currentUser.name,dt:getLocalISODate(),
    misto: mistoJson
  };

  // baixar estoque
  cart.forEach(item=>{
    const p=DB.produtos.find(x=>x.id===item.produtoId);
    if(p&&p.tipo==='pronto')p.estoque=Math.max(0,p.estoque-item.qtd);
  });
  DB.vendas.push(venda);
  
  // Se finalizou e havia mesa aberta com esse nome, tira das mesas abertas
  const clienteFinalizado = cliente.trim();
  if(clienteFinalizado){
     DB.mesas_abertas = DB.mesas_abertas || [];
     const idxA = DB.mesas_abertas.findIndex(x => x.cliente.toLowerCase() === clienteFinalizado.toLowerCase());
     if(idxA >= 0) DB.mesas_abertas.splice(idxA, 1);
  }

  saveDB();
  auditLog('VENDA',`#${venda.id} – ${fmt(total)} – ${pag}`);
  showToast('Venda registrada com sucesso! '+fmt(total),'success');
  
  if (document.getElementById('vendaImprimir')?.checked) {
    imprimirCupom(venda);
  }
  
  cart=[];
  updateCart();
  document.getElementById('vendaObs').value='';
  const cliNode = document.getElementById('vendaCliente');
  if(cliNode) cliNode.value='';
}

// ===================== MESAS ABERTAS =====================
function salvarMesaAberta(){
  if(cart.length===0) { showToast('O carrinho está vazio!', 'error'); return; }
  let cliente = document.getElementById('vendaCliente')?.value.trim();
  if(!cliente){
    cliente = prompt('Digite o número da Mesa ou Nome do Cliente:');
    if(!cliente) return;
    document.getElementById('vendaCliente').value = cliente;
  }

  DB.mesas_abertas = DB.mesas_abertas || [];
  
  // Busca por nome (case insensitive)
  const idx = DB.mesas_abertas.findIndex(x => x.cliente.toLowerCase() === cliente.toLowerCase());
  
  const obs = document.getElementById('vendaObs')?.value || '';
  const cartClone = JSON.parse(JSON.stringify(cart));
  
  let mesaFinal = null;

  if(idx >= 0){
    // Se a mesa já existe, perguntar se quer mesclar ou substituir
    const mesaExistente = DB.mesas_abertas[idx];
    if (confirm(`Já existe uma conta aberta para "${mesaExistente.cliente}".\nDeseja ADICIONAR estes novos itens aos itens já existentes nela?`)) {
       // Mescla itens
       mesaExistente.itens = [...mesaExistente.itens, ...cartClone];
       mesaExistente.dtAtualizacao = getLocalISODate();
       mesaExistente.obs = (mesaExistente.obs ? mesaExistente.obs + ' | ' : '') + obs;
       mesaFinal = mesaExistente;
       auditLog('MESA_UPDATE', `Adicionados itens à mesa: ${cliente}`);
    } else {
       if (!confirm("Deseja SUBSTITUIR os itens atuais da mesa por este novo carrinho? (Ação irreversível)")) {
          return;
       }
       mesaExistente.itens = cartClone;
       mesaExistente.dtAtualizacao = getLocalISODate();
       mesaExistente.obs = obs;
       mesaFinal = mesaExistente;
       auditLog('MESA_OVERWRITE', `Itens da mesa ${cliente} foram substituídos`);
    }
  } else {
    // Nova mesa
    mesaFinal = {
      id: Date.now(), // ID único
      cliente: cliente,
      obs: obs,
      itens: cartClone,
      dtCriacao: getLocalISODate(),
      dtAtualizacao: getLocalISODate()
    };
    DB.mesas_abertas.push(mesaFinal);
    auditLog('MESA_OPEN', `Aberta nova mesa: ${cliente}`);
  }
  
  saveDB();
  
  // Imprimir comanda de cozinha (parcial)
  if (document.getElementById('vendaImprimir')?.checked) {
    imprimirComandaParcial(mesaFinal);
  } else {
    showToast(`Pedido salvo na comanda: ${cliente}`, 'success');
  }
  
  cart = [];
  // Atualiza a UI principal para mostrar o badge atualizado
  if(currentPage === 'vendas') {
    document.getElementById('content').innerHTML = renderVendas();
    initVendas();
  } else {
    updateCart();
    document.getElementById('vendaObs').value='';
    document.getElementById('vendaCliente').value='';
  }
}

function abrirModalMesas(filtro = ''){
  DB.mesas_abertas = DB.mesas_abertas || [];
  
  let mesas = [...DB.mesas_abertas];
  if(filtro) {
    const f = filtro.toLowerCase().trim();
    mesas = mesas.filter(m => m.cliente.toLowerCase().includes(f));
  }

  // Ordenar: as atualizadas recentemente primeiro
  mesas.sort((a,b) => new Date(b.dtAtualizacao) - new Date(a.dtAtualizacao));

  const totalAbertas = DB.mesas_abertas.length;

  const html = `
    <style>
      .mesa-card {
        background: var(--surface2);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 16px;
        position: relative;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 120px;
      }
      .mesa-card:hover {
        border-color: var(--accent);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        background: var(--surface3);
      }
      .mesa-card.warning { border-color: var(--amber); box-shadow: 0 0 10px rgba(245, 158, 11, 0.1); }
      .mesa-card.danger { border-color: var(--red); box-shadow: 0 0 10px rgba(239, 68, 68, 0.1); }
      
      .mesa-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 12px;
        max-height: 60vh;
        overflow-y: auto;
        padding: 4px;
        margin-top: 10px;
      }
      /* Custom scrollbar para o grid */
      .mesa-grid::-webkit-scrollbar { width: 6px; }
      .mesa-grid::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
      
      .btn-delete-mesa {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(239, 68, 68, 0.1);
        border: none;
        color: var(--red);
        cursor: pointer;
        font-size: 16px;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s;
      }
      .mesa-card:hover .btn-delete-mesa { opacity: 1; }
      .btn-delete-mesa:hover { background: var(--red); color: white; }

      .mesa-badge {
        font-size: 10px;
        font-weight: bold;
        padding: 2px 6px;
        border-radius: 4px;
        text-transform: uppercase;
      }
    </style>

    <div class="modal-header-custom" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
       <div>
         <div class="modal-title" style="margin:0">📝 Comandas em Aberto</div>
         <div class="text-muted" style="font-size:12px;">Gerencie as contas ativas do estabelecimento</div>
       </div>
       <div style="text-align:right">
         <div style="background:var(--accent); color:#000; padding:4px 12px; border-radius:20px; font-weight:bold; font-size:13px; display:inline-block">
           ${totalAbertas} Mesas
         </div>
       </div>
    </div>

    <div class="search-wrap" style="position:relative; margin-bottom:15px;">
      <input type="text" id="inputBuscaMesa" class="form-control" placeholder="🔍 Buscar por mesa ou nome..." value="${filtro}" 
             oninput="window._timerBuscaMesa && clearTimeout(window._timerBuscaMesa); window._timerBuscaMesa = setTimeout(() => abrirModalMesas(this.value), 300)"
             style="background:var(--surface2); border-color:var(--border); padding-left:35px">
      <script>setTimeout(()=> { 
        const inp = document.getElementById('inputBuscaMesa'); 
        if(inp) { 
          inp.focus(); 
          inp.setSelectionRange(inp.value.length, inp.value.length); 
        } 
      }, 50);</script>
    </div>

    ${mesas.length === 0 ? `
      <div class="empty-state" style="padding:60px 0; border: 2px dashed var(--border); border-radius:12px; margin-top:10px">
        <div class="icon" style="font-size:48px; margin-bottom:15px; opacity:0.5">📝</div>
        <div style="font-weight:600; font-size:16px; color:var(--text1)">
          ${filtro ? 'Nenhuma mesa encontrada para esta busca' : 'Nenhuma mesa aberta no momento'}
        </div>
        <p class="text-muted" style="font-size:13px; margin-top:5px">
          ${filtro ? 'Tente outro nome ou limpe a busca.' : 'Use o botão "Deixar em Aberto" no carrinho para salvar uma comanda.'}
        </p>
        ${filtro ? `<button class="btn btn-ghost btn-sm mt-3" onclick="abrirModalMesas('')">Limpar Busca</button>` : ''}
      </div>
    ` : `
      <div class="mesa-grid">
        ${mesas.map(m => {
          const totalValue = m.itens.reduce((s,i) => s + (i.preco * i.qtd), 0);
          const totalQtd = m.itens.reduce((s,i) => s + i.qtd, 0);
          const diffMs = (new Date() - new Date(m.dtAtualizacao));
          const diffMin = Math.floor(diffMs / 60000);
          
          let timeMsg = diffMin < 1 ? 'Agora' : `Há ${diffMin} min`;
          if(diffMin >= 60) timeMsg = `Há ${Math.floor(diffMin/60)}h ${diffMin%60}m`;
          
          let alertClass = '';
          if(diffMin > 60) alertClass = 'danger';
          else if(diffMin > 30) alertClass = 'warning';

          return `
            <div class="mesa-card ${alertClass}" onclick="carregarMesaAbertaById(${m.id})">
              
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px">
                <span class="mesa-badge" style="background:${alertClass==='danger'?'rgba(239,68,68,0.2)':(alertClass==='warning'?'rgba(245,158,11,0.2)':'rgba(76,175,80,0.2)')}; color:${alertClass==='danger'?'var(--red)':(alertClass==='warning'?'var(--amber)':'#81c784')}">
                  ${timeMsg}
                </span>
                <button class="btn-delete-mesa" onclick="event.stopPropagation(); excluirMesaAbertaById(${m.id})">×</button>
              </div>

              <div class="mesa-name" style="font-weight:bold; font-size:17px; line-height:1.2; color:var(--text1); margin-bottom:12px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                ${m.cliente}
              </div>
              
              <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1px solid rgba(255,255,255,0.05); padding-top:10px">
                <div style="font-size:11px; color:var(--text2)">
                  <span style="display:block">📦 ${totalQtd} itens</span>
                </div>
                <div class="mono" style="font-weight:bold; font-size:15px; color:${totalValue > 100 ? 'var(--amber)' : 'var(--text1)'}">
                  ${fmt(totalValue)}
                </div>
              </div>

            </div>
          `;
        }).join('')}
      </div>
    `}

    <div class="modal-footer" style="margin-top:20px; border-top:1px solid var(--border); padding-top:15px; display:flex; justify-content:space-between; align-items:center">
      <div class="text-muted" style="font-size:11px">
        Dica: Clique em uma mesa para carregá-la no carrinho.
      </div>
      <button class="btn btn-ghost" onclick="closeModal()">Fechar</button>
    </div>
  `;
  
  openModal(html);
}

function carregarMesaAbertaById(id){
  const m = DB.mesas_abertas.find(x => x.id == id);
  if(!m) { 
    showToast('Mesa não encontrada. Pode ter sido fechada em outro terminal.', 'error');
    return; 
  }
  cart = JSON.parse(JSON.stringify(m.itens));
  document.getElementById('vendaCliente').value = m.cliente;
  document.getElementById('vendaObs').value = m.obs || '';
  updateCart();
  closeModal();
  showToast(`Mesa ${m.cliente} carregada para o caixa!`, 'info');
}

function excluirMesaAbertaById(id){
  const m = DB.mesas_abertas.find(x => x.id == id);
  if(!m) return;
  if(!confirm(`Deseja excluir permanentemente a conta de "${m.cliente}"?`)) return;
  
  DB.mesas_abertas = DB.mesas_abertas.filter(x => x.id != id);
  auditLog('MESA_DELETE', `Mesa excluída: ${m.cliente}`);
  saveDB();
  
  if(currentPage === 'vendas') {
    document.getElementById('content').innerHTML = renderVendas();
    initVendas();
  }
  
  abrirModalMesas();
}

function imprimirComandaParcial(mesa){
  const total = mesa.itens.reduce((s,i) => s + (i.preco * i.qtd), 0);
  const mockupVenda = {
    id: 'ABERTA',
    data: today(),
    hora: new Date(mesa.dtAtualizacao).toLocaleTimeString('pt-BR'),
    tipo: 'Comanda / Parcial',
    usuario: currentUser?.name || 'Vendedor',
    cliente: mesa.cliente,
    obs: mesa.obs,
    itens: mesa.itens.map(i => ({...i, subtotal: i.preco * i.qtd})),
    total: total,
    pagamento: 'A PAGAR'
  };
  imprimirCupom(mockupVenda);
}

// ===================== PRODUÇÃO =====================
function renderProducao(){
  const produzidos=DB.produtos.filter(p=>p.tipo==='produzido'&&p.status==='ativo');
  
  // calcular saldos do dia
  const hoje=today();
  const vendasHoje=DB.vendas.filter(v=>(v.data||'').slice(0,10)===hoje);
  
  const rows=produzidos.map(p=>{
    const prodHoje=DB.producoes.filter(x=>x.data===hoje&&x.produtoId==p.id).reduce((s,x)=>s+x.qtd,0);
    const vendHoje=vendasHoje.reduce((s,v)=>s+v.itens.filter(i=>i.produtoId==p.id).reduce((a,i)=>a+i.qtd,0),0);
    const saldoInicial=p.estoque-prodHoje+vendHoje; // estoque atual = saldo_ini + produzido - vendido
    const disponivel=saldoInicial+prodHoje;
    const sobra=disponivel-vendHoje;
    return {p,prodHoje,vendHoje,saldoInicial:Math.max(0,saldoInicial),disponivel,sobra:Math.max(0,sobra)};
  });

  return `
  <div class="section-header">
    <div></div>
    <button class="btn btn-primary" onclick="modalProducao()">+ Registrar Produção</button>
  </div>
  <div class="card mb-4">
    <div class="card-title">📊 Produção do Dia – ${new Date().toLocaleDateString('pt-BR')}</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Produto</th><th>Saldo Inicial</th><th>Produzido Hoje</th><th>Disponível</th><th>Vendido</th><th>Sobra Final</th><th>Ações</th></tr></thead>
        <tbody>${rows.map(r=>`
          <tr>
            <td><strong>${r.p.nome}</strong></td>
            <td class="mono">${r.saldoInicial}</td>
            <td class="mono text-green">${r.prodHoje}</td>
            <td class="mono text-amber">${r.disponivel}</td>
            <td class="mono text-blue">${r.vendHoje}</td>
            <td class="mono ${r.sobra<r.p.estoqueMin?'text-red':''}">${r.sobra}</td>
            <td>
              <button class="btn btn-ghost btn-sm" onclick="modalProducaoEdicao('${r.p.id}', ${r.prodHoje})" title="Editar Produção de Hoje">📝</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Histórico de Produções</div>
    ${DB.producoes.length===0?'<div class="empty-state"><div class="icon">🔥</div>Nenhuma produção registrada</div>':''}
    ${DB.producoes.length?`<div class="table-wrap"><table>
      <thead><tr><th>Data</th><th>Produto</th><th>Quantidade</th><th>Usuário</th><th>Obs</th><th>Ações</th></tr></thead>
      <tbody>${DB.producoes.slice(-30).reverse().map(p=>`
        <tr>
          <td>${fmtDate(p.data)}</td>
          <td>${p.produto}</td>
          <td class="mono text-green">${p.qtd}</td>
          <td>${p.usuario}</td>
          <td class="text-muted">${p.obs||'-'}</td>
          <td>
            <button class="btn btn-ghost btn-sm" onclick="modalProducaoEdicao('${p.produtoId}', ${p.qtd}, '${p.id}')" title="Editar">📝</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table></div>`:''}
  </div>`;
}

function modalProducao(producaoId = null, qtdExistente = 0, produtoId = null){
  const prods=DB.produtos.filter(p=>p.tipo==='produzido'&&p.status==='ativo');
  const isEdit = !!producaoId;
  
  openModal(`
    <div class="modal-title">${isEdit ? '📝 Editar Produção' : '🔥 Registrar Produção'}</div>
    <div class="form-group">
      <label class="form-label">Produto</label>
      <select class="form-control" id="mpProd" ${isEdit ? 'disabled' : ''}>
        ${prods.map(p=>`<option value="${p.id}" ${isEdit && p.id === produtoId ? 'selected' : ''}>${p.nome}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Quantidade Produzida</label>
      <input type="number" class="form-control" id="mpQtd" value="${isEdit ? qtdExistente : 10}" min="1">
    </div>
    <div class="form-group">
      <label class="form-label">Observação</label>
      <input class="form-control" id="mpObs" placeholder="opcional">
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="salvarProducao('${producaoId || ''}', ${isEdit ? qtdExistente : 0}, ${isEdit ? produtoId : 'null'})">${isEdit ? 'Atualizar Produção' : 'Salvar Produção'}</button>
    </div>`);
}

window.modalProducaoEdicao = function(produtoId, qtd, producaoId = null) {
  modalProducao(producaoId, qtd, produtoId);
}

function salvarProducao(producaoId = '', qtdAntiga = 0, produtoId = null){
  const pid = producaoId ? produtoId : parseInt(document.getElementById('mpProd').value);
  const qtd = parseInt(document.getElementById('mpQtd').value)||0;
  const obs = escapeHTML(document.getElementById('mpObs').value);
  
  if(!qtd){showToast('Informe a quantidade','error');return;}
  
  const p = DB.produtos.find(x=>x.id===pid);
  if(!p) return;

  // Se for edição, primeiro removemos a quantidade antiga do estoque
  if (producaoId) {
    const idx = DB.producoes.findIndex(x => x.id == producaoId || (x.produtoId === pid && normData(x.data) === today()));

    if (idx !== -1) {
      p.estoque -= DB.producoes[idx].qtd;
      DB.producoes.splice(idx, 1);
    }
  }

  const prod = {id: producaoId || uid('producao'), produtoId: pid, produto: p.nome, qtd, obs, data: today(), usuario: currentUser.name, dt: getLocalISODate()};
  DB.producoes.push(prod);
  p.estoque += qtd;
  
  saveDB();
  auditLog('PRODUCAO',`${p.nome} – ${qtd} un`);
  closeModal();
  showToast(producaoId ? 'Produção atualizada!' : `Produção registrada: ${qtd} ${p.nome}`,'success');
  navigate('producao');
}

// ===================== CONSUMO INTERNO =====================
function renderConsumo(){
  const consumos = (DB.consumos || []).slice().reverse();
  
  // Agendar criação do gráfico após renderizar o HTML
  setTimeout(() => initChartConsumo(), 100);

  return `
  <div class="section-header">
    <div class="section-title">📉 Consumo Interno / Perdas</div>
    <button class="btn btn-primary" onclick="modalConsumo()">+ Registrar Consumo</button>
  </div>

  <div class="grid-2 mb-4">
    <div class="card">
        <div class="card-title">📊 Evolução nos Últimos 15 Dias</div>
        <div style="height: 250px; position: relative;">
            <canvas id="chartConsumo"></canvas>
        </div>
    </div>
    <div class="card">
        <div class="card-title">🔍 Resumo por Motivo</div>
        <div style="height: 250px; position: relative;">
            <canvas id="chartMotivo"></canvas>
        </div>
    </div>
  </div>
  
  <div class="card mb-4">
    <div class="card-title">📋 Últimos Registros</div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Data/Hora</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Motivo</th>
            <th>Usuário</th>
          </tr>
        </thead>
        <tbody>
          ${consumos.length === 0 ? '<tr><td colspan="5" style="text-align:center; padding: 20px;">Nenhum consumo registrado ainda.</td></tr>' : 
            consumos.map(c => `
              <tr>
                <td style="font-size:12px;">${new Date(c.dt || c.data).toLocaleString('pt-BR')}</td>
                <td class="fw-bold">${c.produto}</td>
                <td><span class="badge ${c.motivo === 'Perda' || c.motivo === 'Quebra' || c.motivo === 'Vencimento' ? 'bg-danger' : 'bg-warning'}">${c.qtd}</span></td>
                <td>${c.motivo || '-'}</td>
                <td><small>${c.usuario || c.user || '-'}</small></td>
              </tr>
            `).join('')
          }
        </tbody>
      </table>
    </div>
  </div>
  `;
}

function initChartConsumo() {
    const ctxTotal = document.getElementById('chartConsumo');
    const ctxMotivo = document.getElementById('chartMotivo');
    if (!ctxTotal || !ctxMotivo || typeof Chart === 'undefined') return;

    // 1. Processar dados para gráfico de barras por dia (últimos 15 dias)
    const ultimos15Dias = [];
    for (let i = 14; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        ultimos15Dias.push(d.toISOString().slice(0, 10));
    }

    const dataConsumo = ultimos15Dias.map(dia => {
        return DB.consumos.filter(c => normData(c.data) === dia && !['Perda', 'Quebra', 'Vencimento'].includes(c.motivo))
                          .reduce((s, c) => s + c.qtd, 0);
    });

    const dataPerdas = ultimos15Dias.map(dia => {
        return DB.consumos.filter(c => normData(c.data) === dia && ['Perda', 'Quebra', 'Vencimento'].includes(c.motivo))
                          .reduce((s, c) => s + c.qtd, 0);
    });

    new Chart(ctxTotal, {
        type: 'bar',
        data: {
            labels: ultimos15Dias.map(d => d.split('-').reverse().slice(0, 2).join('/')),
            datasets: [
                { label: 'Consumo', data: dataConsumo, backgroundColor: '#f59e0b' },
                { label: 'Perdas/Quebras', data: dataPerdas, backgroundColor: '#ef4444' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } },
            plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
        }
    });

    // 2. Gráfico de Pizza por Motivo
    const motivosMap = {};
    DB.consumos.forEach(c => motivosMap[c.motivo] = (motivosMap[c.motivo] || 0) + c.qtd);
    
    new Chart(ctxMotivo, {
        type: 'doughnut',
        data: {
            labels: Object.keys(motivosMap),
            datasets: [{
                data: Object.values(motivosMap),
                backgroundColor: ['#f59e0b', '#ef4444', '#10b981', '#6366f1', '#ec4899', '#8b5cf6']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right', labels: { color: '#94a3b8' } } }
        }
    });
}


function modalConsumo(){
  const prods=DB.produtos.filter(p=>p.status==='ativo');
  openModal(`
    <div class="modal-title">📦 Registrar Consumo/Saída</div>
    <div class="form-group">
      <label class="form-label">Produto</label>
      <select class="form-control" id="mcProd">
        ${prods.map(p=>`<option value="${p.id}">${p.nome} (estoque: ${p.estoque})</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Quantidade</label>
      <input type="number" class="form-control" id="mcQtd" value="1" min="1">
    </div>
    <div class="form-group">
      <label class="form-label">Motivo</label>
      <select class="form-control" id="mcMotivo">
        <option>Consumo interno</option><option>Cortesia</option><option>Perda</option>
        <option>Quebra</option><option>Vencimento</option><option>Uso na produção</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Observação</label>
      <input class="form-control" id="mcObs" placeholder="opcional">
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-danger" onclick="salvarConsumo()">Registrar Saída</button>
    </div>`);
}

function salvarConsumo(){
  const pid=document.getElementById('mcProd').value;
  const qtd=parseFloat(document.getElementById('mcQtd').value)||0;
  const motivo=document.getElementById('mcMotivo').value;
  const obs=escapeHTML(document.getElementById('mcObs').value);
  if(!qtd){showToast('Informe a quantidade','error');return;}
  const p=DB.produtos.find(x=>x.id==pid);
  if(['Perda','Quebra','Vencimento'].includes(motivo)){
    if(!confirm(`Confirma o registro de ${qtd} un de ${p.nome} como ${motivo}? Isso baixa o estoque e representa prejuízo.`)) return;
  }
  const c={id:uid('consumo'),produtoId:pid,produto:p.nome,qtd,motivo,obs,operacao:p.operacao,data:getEffectiveDay(),usuario:currentUser.name,dt:getLocalISODate()};
  DB.consumos.push(c);
  p.estoque=Math.max(0,p.estoque-qtd);
  saveDB();
  auditLog('CONSUMO',`${p.nome} – ${qtd} un – ${motivo}`);
  closeModal();
  showToast(`Saída registrada: ${qtd} ${p.nome}`,'info');
  navigate('consumo');
}

// ===================== ESTOQUE =====================
function renderEstoque(){
  const prods=DB.produtos.filter(p=>p.status==='ativo');
  const baixo=prods.filter(p=>p.estoque<=p.estoqueMin);
  return `
  ${baixo.length?`<div class="alert warning">⚠️ ${baixo.length} produto(s) com estoque abaixo do mínimo</div>`:''}
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; flex-wrap:wrap; gap:10px;">
    <div class="tabs" style="margin:0;">
      <div class="tab active" onclick="estoqueTab(this,'todos')">Todos (${prods.length})</div>
      <div class="tab" onclick="estoqueTab(this,'Espetinho')">🔥 Espetinho</div>
      <div class="tab" onclick="estoqueTab(this,'Bebidas')">🍺 Bebidas</div>
      <div class="tab" onclick="estoqueTab(this,'baixo')">⚠️ Baixo (${baixo.length})</div>
    </div>
    <button class="btn btn-primary" onclick="imprimirListaCompras()">🖨️ Relatório de Compras</button>
  </div>
  <div class="card">
    <div class="table-wrap">
      <table id="tabelaEstoque">
        <thead><tr><th>Produto</th><th>Operação</th><th>Unidade</th><th>Tipo</th><th>Estoque</th><th>Mínimo</th><th>Status</th></tr></thead>
        <tbody>${prods.map(p=>`
          <tr data-op="${p.operacao}" data-baixo="${p.estoque<=p.estoqueMin}">
            <td><strong>${p.nome}</strong></td>
            <td>${opTag(p.operacao)}</td>
            <td class="mono">${p.unidade}</td>
            <td><span class="badge ${p.tipo==='produzido'?'amber':'blue'}">${p.tipo==='produzido'?'Produzido':'Pronto'}</span></td>
            <td class="mono ${p.estoque<=p.estoqueMin?'text-red':'text-green'}">${p.estoque}</td>
            <td class="mono text-muted">${p.estoqueMin}</td>
            <td><span class="badge ${p.estoque>p.estoqueMin?'green':'red'}">${p.estoque>p.estoqueMin?'OK':'Baixo'}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function estoqueTab(el,filtro){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('#tabelaEstoque tbody tr').forEach(tr=>{
    let show=true;
    if(filtro==='Espetinho')show=tr.dataset.op==='Espetinho';
    else if(filtro==='Bebidas')show=tr.dataset.op==='Bebidas';
    else if(filtro==='baixo')show=tr.dataset.baixo==='true';
    tr.style.display=show?'':'none';
  });
}

function imprimirListaCompras() {
  const baixo = DB.produtos.filter(p => p.status === 'ativo' && p.estoque <= p.estoqueMin);
  if (baixo.length === 0) {
    showToast('Nenhum produto com estoque abaixo do mínimo.', 'info');
    return;
  }

  let printFrame = document.getElementById('printFrame');
  if (!printFrame) {
    printFrame = document.createElement('iframe');
    printFrame.id = 'printFrame';
    printFrame.style.position = 'absolute';
    printFrame.style.width = '0px';
    printFrame.style.height = '0px';
    printFrame.style.border = 'none';
    document.body.appendChild(printFrame);
  }

  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const horaAtual = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});

  let itensHtml = '';
  baixo.forEach((p, index) => {
    itensHtml += `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${p.nome}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${p.estoque}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${p.estoqueMin}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;"></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"></td>
      </tr>
    `;
  });

  const content = `
    <html>
      <head>
        <title>Relatório de Compras - Conveniência Oliveira</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; margin: 0; }
          h2 { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .meta-info { font-size: 14px; font-weight: normal; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
          th { background-color: #f5f5f5; padding: 10px 8px; text-align: left; border-bottom: 2px solid #ddd; font-weight: bold; }
          .center { text-align: center; }
          .footer { text-align: center; font-size: 12px; color: #777; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 10px; }
          @media print {
            body { padding: 0; }
            @page { margin: 1cm; }
          }
        </style>
      </head>
      <body>
        <h2>
          <span>Lista de Compras (Estoque Baixo)</span>
          <span class="meta-info">Data: ${dataAtual} às ${horaAtual}</span>
        </h2>
        
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th class="center" style="width: 12%">Estoque</th>
              <th class="center" style="width: 12%">Mínimo</th>
              <th class="center" style="width: 15%">Qtd Comprada</th>
              <th style="width: 25%">Verificado / Preço</th>
            </tr>
          </thead>
          <tbody>
            ${itensHtml}
          </tbody>
        </table>

        <div class="footer">
          Gerado pelo Sistema Conveniência Oliveira
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
    </html>
  `;

  const doc = printFrame.contentWindow.document;
  doc.open();
  doc.write(content);
  doc.close();
  showToast('Gerando relatório de impressão...', 'success');
}

// ===================== COMPRAS =====================
function renderCompras(){
  return `
  <div class="section-header">
    <div></div>
    <button class="btn btn-primary" onclick="modalCompra()">+ Registrar Compra</button>
  </div>
  <div class="card">
    <div class="card-title">Histórico de Compras</div>
    ${DB.compras.length===0?'<div class="empty-state"><div class="icon">🧾</div>Nenhuma compra registrada</div>':''}
    ${DB.compras.length?`<div class="table-wrap"><table>
      <thead><tr><th>Data</th><th>Fornecedor</th><th>Operação</th><th>Pagamento</th><th>Itens</th><th>Total</th><th>Ações</th></tr></thead>
      <tbody>${DB.compras.slice(-30).reverse().map(c=>`
        <tr>
          <td>${fmtDate(c.data)}</td>
          <td>${c.fornecedor}</td>
          <td>${opTag(c.operacao)}</td>
          <td><span class="badge blue">${c.pagamento}</span></td>
          <td class="text-muted">${c.itens.length} item(s)</td>
          <td class="mono text-amber">${fmt(c.total)}</td>
          <td>
            <div class="flex gap-1">
              <button class="btn btn-ghost btn-sm" onclick="verCompra(${c.id})" title="Ver Detalhes">👁️</button>
              <button class="btn btn-ghost btn-sm" onclick="editarCompra(${c.id})" title="Editar Compra">📝</button>
              <button class="btn btn-ghost btn-sm text-red" onclick="confirmaExcluirCompra(${c.id})" title="Excluir Compra">🗑️</button>
            </div>
          </td>
        </tr>`).join('')}
      </tbody>
    </table></div>`:''}
  </div>`;
}

function editarCompra(id) {
  const c = DB.compras.find(x => x.id === id);
  if (!c) return;
  modalCompra(c);
}

function confirmaExcluirCompra(id) {
  const c = DB.compras.find(x => x.id === id);
  if (!c) return;
  if (!confirm(`⚠️ Atenção: Deseja realmente EXCLUIR a compra do fornecedor "${c.fornecedor}" no valor de ${fmt(c.total)}?\n\nIsso irá SUBTRAIR as quantidades compradas do estoque atual dos produtos.`)) return;

  // Reverter estoque
  c.itens.forEach(item => {
    const p = DB.produtos.find(x => x.id === item.produtoId);
    if (p) {
      p.estoque = Math.max(0, p.estoque - item.qtd);
    }
  });

  DB.compras = DB.compras.filter(x => x.id !== id);
  saveDB();
  auditLog('EXCLUSÃO COMPRA', `${c.fornecedor} – ${fmt(c.total)}`);
  showToast('Compra excluída e estoque ajustado!', 'info');
  navigate('compras');
}

let compraItens=[];

function modalCompra(compraParaEditar = null){
  compraItens = compraParaEditar ? JSON.parse(JSON.stringify(compraParaEditar.itens)) : [];
  const isEdit = !!compraParaEditar;

  openModal(`
    <div class="modal-title">${isEdit ? '📝 Editar Compra #' + compraParaEditar.id : '🧾 Registrar Compra'}</div>
    <div class="form-row cols-2 mb-3">
      <div class="form-group" style="margin:0">
        <label class="form-label">Fornecedor</label>
        <input class="form-control" id="cpFornec" placeholder="Nome do fornecedor" value="${isEdit ? compraParaEditar.fornecedor : ''}">
      </div>
      <div class="form-group" style="margin:0">
        <label class="form-label">Data</label>
        <input type="date" class="form-control" id="cpData" value="${isEdit ? compraParaEditar.data : today()}">
      </div>
    </div>
    <div class="form-row cols-2 mb-3">
      <div class="form-group" style="margin:0">
        <label class="form-label">Operação</label>
        <select class="form-control" id="cpOp">
          <option ${isEdit && compraParaEditar.operacao === 'Espetinho' ? 'selected' : ''}>Espetinho</option>
          <option ${isEdit && compraParaEditar.operacao === 'Bebidas' ? 'selected' : ''}>Bebidas</option>
        </select>
      </div>
      <div class="form-group" style="margin:0">
        <label class="form-label">Pagamento</label>
        <select class="form-control" id="cpPag">
          <option ${isEdit && compraParaEditar.pagamento === 'Pix' ? 'selected' : ''}>Pix</option>
          <option ${isEdit && compraParaEditar.pagamento === 'Dinheiro' ? 'selected' : ''}>Dinheiro</option>
          <option ${isEdit && compraParaEditar.pagamento === 'Cartão Débito' ? 'selected' : ''}>Cartão Débito</option>
          <option ${isEdit && compraParaEditar.pagamento === 'Cartão Crédito' ? 'selected' : ''}>Cartão Crédito</option>
        </select>
      </div>
    </div>
    <div class="divider"></div>
    <div class="card-title" style="font-size:13px;margin-bottom:10px">Itens da Compra</div>
    <div id="cpItensArea"></div>
    <div class="form-row cols-3 mb-2" style="gap:8px">
      <select class="form-control" id="cpItemProd" style="font-size:13px">
        ${DB.produtos.map(p=>`<option value="${p.id}">${p.nome}</option>`).join('')}
      </select>
      <input type="number" class="form-control" id="cpItemQtd" placeholder="Qtd" min="1" value="1">
      <input type="number" class="form-control" id="cpItemCusto" placeholder="Custo un" step="0.01">
    </div>
    <button class="btn btn-ghost btn-sm mb-3" onclick="addCompraItem()">+ Adicionar Item</button>
    <div class="form-group">
      <label class="form-label">Observação</label>
      <input class="form-control" id="cpObs" placeholder="opcional" value="${isEdit ? compraParaEditar.obs || '' : ''}">
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="salvarCompra(${isEdit ? compraParaEditar.id : 'null'})">${isEdit ? 'Atualizar Compra' : 'Salvar Compra'}</button>
    </div>`);
  if (isEdit) renderCompraItens();
}

function addCompraItem(){
  const pid=parseInt(document.getElementById('cpItemProd').value);
  const qtd=parseFloat(document.getElementById('cpItemQtd').value)||0;
  const custo=parseFloat(document.getElementById('cpItemCusto').value)||0;
  if(!qtd||!custo){showToast('Informe quantidade e custo','error');return;}
  const p=DB.produtos.find(x=>x.id===pid);
  compraItens.push({produtoId:pid,produto:p.nome,qtd,custo,total:qtd*custo});
  renderCompraItens();
  document.getElementById('cpItemQtd').value='1';
  document.getElementById('cpItemCusto').value='';
}

function renderCompraItens(){
  const el=document.getElementById('cpItensArea');
  if(!el)return;
  if(compraItens.length===0){el.innerHTML='';return;}
  el.innerHTML=`<div class="table-wrap mb-2"><table>
    <thead><tr><th>Produto</th><th>Qtd</th><th>Custo Un</th><th>Total</th><th></th></tr></thead>
    <tbody>${compraItens.map((i,idx)=>`
      <tr>
        <td>${i.produto}</td>
        <td class="mono">${i.qtd}</td>
        <td class="mono">${fmt(i.custo)}</td>
        <td class="mono text-amber">${fmt(i.total)}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeCompraItem(${idx})">×</button></td>
      </tr>`).join('')}
    </tbody>
  </table></div>`;
}
function removeCompraItem(i){compraItens.splice(i,1);renderCompraItens();}

function salvarCompra(idEdicao = null){
  if(compraItens.length===0){showToast('Adicione pelo menos um item','error');return;}
  const fornec=escapeHTML(document.getElementById('cpFornec').value||'Sem fornecedor');
  const data=document.getElementById('cpData').value||today();
  const op=document.getElementById('cpOp').value;
  const pag=document.getElementById('cpPag').value;
  const obs=escapeHTML(document.getElementById('cpObs').value);
  const total=compraItens.reduce((s,i)=>s+i.total,0);
  
  // Se for edição, primeiro revertemos o estoque da versão ANTIGA
  if (idEdicao) {
    const compraAntiga = DB.compras.find(x => x.id === idEdicao);
    if (compraAntiga) {
      compraAntiga.itens.forEach(item => {
        const p = DB.produtos.find(x => x.id === item.produtoId);
        if (p) {
          p.estoque = Math.max(0, p.estoque - item.qtd);
        }
      });
    }
  }

  const compra = {
    id: idEdicao || uid('compra'),
    fornecedor: fornec,
    data,
    operacao: op,
    pagamento: pag,
    obs,
    total,
    itens: compraItens,
    usuario: currentUser.name,
    dt: getLocalISODate()
  };

  // Atualizar estoque e custo com os itens novos
  compraItens.forEach(item=>{
    const p=DB.produtos.find(x=>x.id===item.produtoId);
    if(p){
      p.estoque += item.qtd;
      p.custo = item.custo;
    }
  });

  if (idEdicao) {
    const idx = DB.compras.findIndex(x => x.id === idEdicao);
    DB.compras[idx] = compra;
    auditLog('EDIÇÃO COMPRA', `${fornec} – ${fmt(total)}`);
  } else {
    DB.compras.push(compra);
    auditLog('COMPRA',`${fornec} – ${fmt(total)}`);
  }

  saveDB();
  closeModal();
  showToast(idEdicao ? 'Compra atualizada!' : 'Compra registrada! '+fmt(total), 'success');
  navigate('compras');
}

function verCompra(id){
  const c=DB.compras.find(x=>x.id===id);
  if(!c)return;
  openModal(`
    <div class="modal-title">🧾 Compra #${c.id}</div>
    <div class="grid-2 mb-3">
      <div><span class="form-label">Fornecedor</span><br>${c.fornecedor}</div>
      <div><span class="form-label">Data</span><br>${fmtDate(c.data)}</div>
      <div><span class="form-label">Operação</span><br>${opTag(c.operacao)}</div>
      <div><span class="form-label">Pagamento</span><br><span class="badge blue">${c.pagamento}</span></div>
    </div>
    <div class="table-wrap mb-3"><table>
      <thead><tr><th>Produto</th><th>Qtd</th><th>Custo Un</th><th>Total</th></tr></thead>
      <tbody>${c.itens.map(i=>`
        <tr><td>${i.produto}</td><td class="mono">${i.qtd}</td><td class="mono">${fmt(i.custo)}</td><td class="mono text-amber">${fmt(i.total)}</td></tr>`).join('')}
      </tbody>
    </table></div>
    <div class="flex items-center justify-between">
      <strong>Total</strong><strong class="mono text-amber">${fmt(c.total)}</strong>
    </div>
    ${c.obs?`<div class="mt-3 text-muted">Obs: ${c.obs}</div>`:''}
    <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Fechar</button></div>`);
}

// ===================== PRODUTOS =====================
function renderProdutos(){
  return `
  <div class="section-header">
    <div></div>
    <button class="btn btn-primary" onclick="modalProduto()">+ Novo Produto</button>
  </div>
  <div class="card mb-3">
    <input type="text" id="produtoSearch" class="form-control" placeholder="🔍 Pesquisar produto por nome ou categoria..." oninput="renderProdutosTable()">
  </div>
  <div class="card">
    <div class="table-wrap" id="produtoTableWrap">
      <table>
        <thead><tr><th>Nome</th><th>Categoria</th><th>Operação</th><th>Tipo</th><th>Custo</th><th>Preço</th><th>Estoque</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>${DB.produtos.map(p=>`
          <tr>
            <td><strong>${p.nome}</strong></td>
            <td class="text-muted">${p.categoria}</td>
            <td>${opTag(p.operacao)}</td>
            <td><span class="badge ${p.tipo==='produzido'?'amber':'blue'}">${p.tipo==='produzido'?'Produzido':'Pronto'}</span></td>
            <td class="mono text-muted">${fmt(p.custo)}</td>
            <td class="mono text-amber">${fmt(p.preco)}</td>
            <td class="mono ${p.estoque<=p.estoqueMin?'text-red':''}">${p.estoque}</td>
            <td><span class="badge ${p.status==='ativo'?'green':'red'}">${p.status}</span></td>
            <td>
              <button class="btn btn-ghost btn-sm" onclick="modalProduto('${p.id}')" title="Editar">✏️</button>
              <button class="btn btn-ghost btn-sm" onclick="toggleProduto('${p.id}')" title="${p.status==='ativo'?'Inativar':'Ativar'}">${p.status==='ativo'?'⛔':'✅'}</button>
              <button class="btn btn-danger btn-sm" onclick="excluirProduto('${p.id}')" title="Excluir Permanentemente">🗑️</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderProdutosTable(){
  const term = (document.getElementById('produtoSearch')?.value || '').toLowerCase().trim();
  const prods = DB.produtos.filter(p => p.nome.toLowerCase().includes(term) || p.categoria.toLowerCase().includes(term));
  
  const html = prods.map(p=>`
    <tr>
      <td><strong>${p.nome}</strong></td>
      <td class="text-muted">${p.categoria}</td>
      <td>${opTag(p.operacao)}</td>
      <td><span class="badge ${p.tipo==='produzido'?'amber':'blue'}">${p.tipo==='produzido'?'Produzido':'Pronto'}</span></td>
      <td class="mono text-muted">${fmt(p.custo)}</td>
      <td class="mono text-amber">${fmt(p.preco)}</td>
      <td class="mono ${p.estoque<=p.estoqueMin?'text-red':''}">${p.estoque}</td>
      <td><span class="badge ${p.status==='ativo'?'green':'red'}">${p.status}</span></td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="modalProduto('${p.id}')" title="Editar">✏️</button>
        <button class="btn btn-ghost btn-sm" onclick="toggleProduto('${p.id}')" title="${p.status==='ativo'?'Inativar':'Ativar'}">${p.status==='ativo'?'⛔':'✅'}</button>
        <button class="btn btn-danger btn-sm" onclick="excluirProduto('${p.id}')" title="Excluir Permanentemente">🗑️</button>
      </td>
    </tr>`).join('');
    
  document.getElementById('produtoTableWrap').innerHTML = `<table><thead><tr><th>Nome</th><th>Categoria</th><th>Operação</th><th>Tipo</th><th>Custo</th><th>Preço</th><th>Estoque</th><th>Status</th><th>Ações</th></tr></thead><tbody>${html}</tbody></table>`;
}

function modalProduto(id){
  const p=id?DB.produtos.find(x=>x.id==id):{};
  openModal(`
    <div class="modal-title">${id?'Editar':'Novo'} Produto</div>
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">Nome</label>
        <input class="form-control" id="ppNome" value="${p.nome||''}"></div>
      <div class="form-group"><label class="form-label">Categoria</label>
        <input class="form-control" id="ppCat" value="${p.categoria||''}"></div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">Operação</label>
        <select class="form-control" id="ppOp">
          <option ${p.operacao==='Espetinho'?'selected':''}>Espetinho</option>
          <option ${p.operacao==='Bebidas'?'selected':''}>Bebidas</option>
        </select></div>
      <div class="form-group"><label class="form-label">Tipo</label>
        <select class="form-control" id="ppTipo">
          <option value="produzido" ${p.tipo==='produzido'?'selected':''}>Produzido no local</option>
          <option value="pronto" ${p.tipo==='pronto'?'selected':''}>Produto pronto</option>
        </select></div>
    </div>
    <div class="form-row cols-3">
      <div class="form-group"><label class="form-label">Unidade</label>
        <input class="form-control" id="ppUn" value="${p.unidade||'un'}"></div>
      <div class="form-group"><label class="form-label">Custo (R$)</label>
        <input type="number" class="form-control" id="ppCusto" value="${p.custo||0}" step="0.01"></div>
      <div class="form-group"><label class="form-label">Preço (R$)</label>
        <input type="number" class="form-control" id="ppPreco" value="${p.preco||0}" step="0.01"></div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group"><label class="form-label">Estoque Atual</label>
        <input type="number" class="form-control" id="ppEstoque" value="${p.estoque||0}"></div>
      <div class="form-group"><label class="form-label">Estoque Mínimo</label>
        <input type="number" class="form-control" id="ppMin" value="${p.estoqueMin||5}"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      ${id ? `<button class="btn btn-danger" onclick="excluirProduto('${id}')">Excluir Produto</button>` : ''}
      <button class="btn btn-primary" onclick="salvarProduto('${id||0}')">Salvar</button>
    </div>`);
}

function salvarProduto(id){
  const data={
    nome:escapeHTML(document.getElementById('ppNome').value),
    categoria:escapeHTML(document.getElementById('ppCat').value),
    operacao:document.getElementById('ppOp').value,
    tipo:document.getElementById('ppTipo').value,
    unidade:document.getElementById('ppUn').value,
    custo:parseFloat(document.getElementById('ppCusto').value)||0,
    preco:parseFloat(document.getElementById('ppPreco').value)||0,
    estoque:parseFloat(document.getElementById('ppEstoque').value)||0,
    estoqueMin:parseFloat(document.getElementById('ppMin').value)||0,
  };
  if(!data.nome){showToast('Informe o nome','error');return;}
  if(id && id !== '0'){
    const p=DB.produtos.find(x=>x.id==id);
    if(p){
      Object.assign(p,data);
      auditLog('PRODUTO_EDIT',data.nome);
    } else {
      showToast('Produto não encontrado para edição','error');
      return;
    }
  } else {
    DB.produtos.push({id:uid(),status:'ativo',...data});
    auditLog('PRODUTO_ADD',data.nome);
  }
  saveDB();
  closeModal();
  showToast('Produto salvo!','success');
  navigate('produtos');
}

function toggleProduto(id){
  const p=DB.produtos.find(x=>String(x.id)===String(id));
  if(!p) return;
  const acao = p.status === 'ativo' ? 'INATIVAR' : 'ATIVAR';
  if(!confirm(`Tem certeza que deseja ${acao} o produto ${p.nome}?`)) return;
  p.status=p.status==='ativo'?'inativo':'ativo';
  saveDB();
  navigate('produtos');
}

function excluirProduto(id){
  const p=DB.produtos.find(x=>String(x.id)===String(id));
  if(!p) return;
  if(!confirm(`🚨 ATENÇÃO: Tem certeza que deseja EXCLUIR DEFINITIVAMENTE o produto "${p.nome}"?\n\nEsta ação não pode ser desfeita e removerá o item da lista de estoque.`)) return;
  
  const idx = DB.produtos.findIndex(x=>String(x.id)===String(id));
  if(idx===-1) return;
  DB.produtos.splice(idx, 1);
  auditLog('PRODUTO_DELETE', p.nome);
  saveDB();
  showToast('Produto removido permanentemente!', 'info');
  navigate('produtos');
}

// ===================== USUÁRIOS =====================
function renderUsuarios(){
  return `
  <div class="card">
    <div class="card-title">👥 Usuários do Sistema</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Nome</th><th>Usuário</th><th>Perfil</th><th>Acesso</th></tr></thead>
        <tbody>${USERS.map(u=>`
          <tr>
            <td class="mono">#${u.id}</td>
            <td><strong>${u.name}</strong></td>
            <td class="mono">${u.username}</td>
            <td><span class="badge ${u.role==='admin'?'purple':'blue'}">${u.role}</span></td>
            <td class="text-muted" style="font-size:12px">${u.role==='admin'?'Acesso completo':'Somente vendas'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="alert warning mt-3">ℹ️ Para adicionar usuários, edite o array USERS no código-fonte. Em versão futura, este módulo permitirá CRUD completo de usuários.</div>
  </div>`;
}

// ===================== CAIXA =====================
let currentCaixaDate = null;
window.mudarDataCaixa = function() {
  currentCaixaDate = document.getElementById('caixaData').value;
  document.getElementById('content').innerHTML = renderCaixa();
};

function renderCaixa(){
  if (!currentCaixaDate) currentCaixaDate = getEffectiveDay();
  
  // Banner turno noturno
  const isNight = isNightShift();
  const effectiveDay = getEffectiveDay();
  const nightBannerHtml = isNight ? `
  <div onclick="window._toggleNightMode && window._toggleNightMode()" style="
    background: linear-gradient(135deg, rgba(234,179,8,0.12), rgba(234,179,8,0.05));
    border: 1px solid rgba(234,179,8,0.35); border-radius: 10px;
    padding: 10px 14px; margin-bottom: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
  ">
    <div style="display:flex; align-items:center; gap: 10px;">
      <span style="font-size:20px;">🌙</span>
      <div>
        <div style="font-size:12px; font-weight:700; color: var(--amber);">TURNO NOTURNO ATIVO</div>
        <div style="font-size:11px; color: var(--text2);">Registrando vendas em <strong>${new Date(effectiveDay + 'T12:00').toLocaleDateString('pt-BR')}</strong>. Passando da meia-noite — data mantida até 06h.</div>
      </div>
    </div>
    <button style="
      font-size:10px; padding:4px 10px; border-radius:6px; border:1px solid rgba(234,179,8,0.5);
      background: rgba(234,179,8,0.1); color: var(--amber); cursor:pointer; white-space:nowrap;
      font-weight:600;
    " onclick="event.stopPropagation();window._toggleNightMode && window._toggleNightMode()">
      ${_nightModeOverride === today() ? '🔄 Voltar ao auto' : '📅 Usar data real (' + new Date().toLocaleDateString('pt-BR', {day:'2-digit',month:'2-digit'}) + ')'}
    </button>
  </div>` : '';

  const targetDate = normData(currentCaixaDate);

  const vendasHoje = DB.vendas.filter(v => normData(v.data) === targetDate);

  const totEsp=calcOpTotal(vendasHoje,'Espetinho');
  const totBeb=calcOpTotal(vendasHoje,'Bebidas');
  const totalGeral=vendasHoje.reduce((s,v)=>s+v.total,0);
  const custoVendas=vendasHoje.reduce((s,v)=>s+v.custo,0);

  // Calcular Consumo do Dia selecionado
  const consumosHoje = (DB.consumos || []).filter(v => normData(v.data) === targetDate);
  const custoConsumo = consumosHoje.reduce((s, c) => {
    const p = DB.produtos.find(x => x.id === c.produtoId);
    return s + (p && p.custo ? p.custo * c.qtd : 0);
  }, 0);

  const lucroFinal = totalGeral - custoVendas - custoConsumo;

  const pagMap={Pix:0,Dinheiro:0,'Cartão Débito':0,'Cartão Crédito':0};
  vendasHoje.forEach(v=>pagMap[v.pagamento]=(pagMap[v.pagamento]||0)+v.total);

  const rankMap={};
  vendasHoje.forEach(v=>v.itens.forEach(i=>rankMap[i.nome]=(rankMap[i.nome]||0)+i.qtd));
  const rank=Object.entries(rankMap).sort((a,b)=>b[1]-a[1]);

  // === RESUMO SEMANAL (Quinta a Segunda-feira) ===
  // Semana de trabalho: Qui(4) → Seg(1), considerando que Seg pertence à semana anterior
  // Ex: se hoje é Segunda (1), a semana atual vai de Qui passada até Segunda de hoje
  // Ex: se hoje é Quinta (4), a semana atual vai de Qui de hoje até próxima Segunda
  const dateParts = targetDate.split('-');
  const targetDateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 12, 0, 0);
  const diaSemana = targetDateObj.getDay(); // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb

  // Dias desde o início da semana (Quinta=0, Sex=1, Sáb=2, Dom=3, Seg=4, Ter=5, Qua=6)
  // Mapeamento: [Dom(0)=3, Seg(1)=4, Ter(2)=5, Qua(3)=6, Qui(4)=0, Sex(5)=1, Sáb(6)=2]
  const diasDesdeQuinta = [3, 4, 5, 6, 0, 1, 2][diaSemana];

  const semanaStart = new Date(targetDateObj);
  semanaStart.setDate(targetDateObj.getDate() - diasDesdeQuinta);
  const semanaStartStr = normData(semanaStart.toISOString());

  const semanaEnd = new Date(semanaStart);
  semanaEnd.setDate(semanaStart.getDate() + 4); // Qui + 4 = Seg
  const semanaEndStr = normData(semanaEnd.toISOString());

  // Dias da semana para o calendário
  const diasSemana = [];
  const nomesDias = ['Qui', 'Sex', 'Sáb', 'Dom', 'Seg'];
  for (let i = 0; i < 5; i++) {
    const d = new Date(semanaStart);
    d.setDate(semanaStart.getDate() + i);
    const dStr = normData(d.toISOString());
    const vendasDia = DB.vendas.filter(v => normData(v.data) === dStr);
    const totalDia = vendasDia.reduce((s, v) => s + v.total, 0);
    diasSemana.push({ nome: nomesDias[i], data: dStr, total: totalDia, isActive: dStr === targetDate });
  }

  const vendasSemana = DB.vendas.filter(v => {
    const vDate = normData(v.data);
    return vDate >= semanaStartStr && vDate <= semanaEndStr;
  });

  const totalSemana = vendasSemana.reduce((s, v) => s + v.total, 0);
  const custoSemana = vendasSemana.reduce((s, v) => s + v.itens.reduce((si, i) => si + (i.custo || 0) * i.qtd, 0), 0);
  
  // Calcular Consumo da Semana (para debitar no lucro semanal)
  const consumosSemana = (DB.consumos || []).filter(c => {
    const cDate = normData(c.data);
    return cDate >= semanaStartStr && cDate <= semanaEndStr;
  });
  const custoConsumoSemana = consumosSemana.reduce((s, c) => {
    const p = DB.produtos.find(x => x.id === c.produtoId);
    return s + (p && p.custo ? p.custo * c.qtd : 0);
  }, 0);

  const lucroSemana = totalSemana - custoSemana - custoConsumoSemana;
  const margemSemana = totalSemana > 0 ? (lucroSemana / totalSemana * 100) : 0;
  const rankSemanaMap = {};
  vendasSemana.forEach(v => v.itens.forEach(i => {
    rankSemanaMap[i.nome] = (rankSemanaMap[i.nome] || 0) + i.qtd;
  }));
  const rankSemana = Object.entries(rankSemanaMap).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return `
  ${nightBannerHtml}
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center gap-2">
      <h2 style="font-family:'Syne',sans-serif;font-size:20px;margin:0">Caixa do Dia</h2>
      <input type="date" id="caixaData" class="form-control" style="width: auto; padding: 4px; font-weight: bold;" value="${currentCaixaDate}" onchange="mudarDataCaixa()">
    </div>
    <button class="btn btn-primary" onclick="imprimirCaixa()">Imprimir</button>
  </div>

  <!-- Calendário Semanal (Qui-Seg) -->
  <div class="card mb-4" style="padding: 12px 16px; background: var(--surface2); border: 1px solid var(--border);">
    <div style="font-size: 11px; color: var(--text3); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">📅 Semana de Trabalho — ${semanaStart.toLocaleDateString('pt-BR', {day:'2-digit',month:'short'})} a ${semanaEnd.toLocaleDateString('pt-BR', {day:'2-digit',month:'short'})}</div>
    <div style="display: flex; gap: 8px; overflow-x: auto;">
      ${diasSemana.map(d => `
        <button onclick="currentCaixaDate='${d.data}';mudarDataCaixa()" style="
          flex: 1; min-width: 70px; padding: 10px 6px; border-radius: 10px; border: 2px solid ${d.isActive ? 'var(--purple)' : 'var(--border)'};
          background: ${d.isActive ? 'rgba(168,85,247,0.15)' : 'var(--surface)'};
          cursor: pointer; transition: all 0.15s; text-align: center;
        ">
          <div style="font-size: 10px; font-weight: 700; color: ${d.isActive ? 'var(--purple)' : 'var(--text3)'}; text-transform: uppercase; letter-spacing: 1px;">${d.nome}</div>
          <div style="font-size: 11px; color: var(--text2); margin: 2px 0;">${d.data.slice(8)}</div>
          <div style="font-size: 12px; font-weight: 700; color: ${d.total > 0 ? (d.isActive ? 'var(--purple)' : 'var(--green)') : 'var(--text3)'};">R$ ${d.total.toFixed(0)}</div>
        </button>
      `).join('')}
    </div>
  </div>

  <div class="grid-2 mb-4">
    <div class="card">
      <div class="flex items-center gap-2 mb-3"><span class="op-dot op1"></span><strong style="font-family:'Syne',sans-serif">Espetinho</strong></div>
      <div class="flex justify-between mb-2"><span class="text-muted">Total Vendido</span><span class="mono text-amber">${fmt(totEsp.total)}</span></div>
      <div class="flex justify-between mb-2"><span class="text-muted">Custo Estimado</span><span class="mono text-red">${fmt(totEsp.custo)}</span></div>
      <div class="flex justify-between mb-2"><span class="text-muted">Lucro Bruto</span><span class="mono text-green">${fmt(totEsp.total-totEsp.custo)}</span></div>
      <div class="divider"></div>
      <div class="flex justify-between"><span class="text-muted">Qtd Transações</span><span class="mono">${vendasHoje.filter(v=>v.itens.some(i=>{const p=DB.produtos.find(x=>x.id==i.produtoId);return p?.operacao==='Espetinho'})).length}</span></div>
    </div>
    <div class="card">
      <div class="flex items-center gap-2 mb-3"><span class="op-dot op2"></span><strong style="font-family:'Syne',sans-serif">Bebidas/Bomboniere</strong></div>
      <div class="flex justify-between mb-2"><span class="text-muted">Total Vendido</span><span class="mono text-amber">${fmt(totBeb.total)}</span></div>
      <div class="flex justify-between mb-2"><span class="text-muted">Custo Estimado</span><span class="mono text-red">${fmt(totBeb.custo)}</span></div>
      <div class="flex justify-between mb-2"><span class="text-muted">Lucro Bruto</span><span class="mono text-green">${fmt(totBeb.total-totBeb.custo)}</span></div>
      <div class="divider"></div>
      <div class="flex justify-between"><span class="text-muted">Qtd Transações</span><span class="mono">${vendasHoje.filter(v=>v.itens.some(i=>{const p=DB.produtos.find(x=>x.id==i.produtoId);return p?.operacao==='Bebidas'})).length}</span></div>
    </div>
  </div>

  <div class="grid-2 mb-4">
    <div class="card">
      <div class="card-title">Por Forma de Pagamento</div>
      ${Object.entries(pagMap).map(([k,v])=>`
        <div class="flex justify-between mb-2">
          <span>${k}</span><span class="mono text-amber">${fmt(v)}</span>
        </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-title">Itens Vendidos Hoje</div>
      ${rank.slice(0,8).map(([n,q])=>`
        <div class="flex justify-between mb-2">
          <span style="font-size:13px">${n}</span><span class="badge amber">${q} un</span>
        </div>`).join('') || '<div class="text-muted">Sem vendas hoje</div>'}
    </div>
  </div>

  <div class="card">
    <div class="flex justify-between items-center mb-3">
      <div class="card-title" style="margin:0">Resumo Geral do Dia</div>
    </div>
    <div class="grid-3">
      <div><div class="stat-label">Total Vendido</div><div class="stat-value text-amber">${fmt(totalGeral)}</div></div>
      <div><div class="stat-label">Custo Vendas + Consumo</div><div class="stat-value text-red">${fmt(custoVendas + custoConsumo)}</div></div>
      <div><div class="stat-label">Lucro Líquido</div><div class="stat-value text-green">${fmt(lucroFinal)}</div></div>
    </div>
    <div style="font-size: 11px; color: var(--text3); margin-top: 5px;">
        (Custo Vendas: ${fmt(custoVendas)} | Despesa Consumo: ${fmt(custoConsumo)})
    </div>
    ${totalGeral > 0 ? `<div class="progress-bar mt-3"><div class="progress-fill" style="width:${Math.min(100, (lucroFinal / totalGeral * 100)).toFixed(0)}%;background:var(--green)"></div></div>
    <div class="text-muted mt-1" style="font-size:12px">Margem real: ${(lucroFinal / totalGeral * 100).toFixed(1)}%</div>` : ''}
  </div>
  
  <div class="card mt-4" style="border-top: 4px solid var(--purple); background: linear-gradient(to bottom right, var(--surface), var(--surface2));">
    <div class="section-header" style="margin-bottom: 20px;">
      <div class="card-title" style="margin:0; display:flex; align-items:center; gap:10px;">
        <span style="font-size:20px;">📅</span> 
        <div>
          Resumo da Semana
          <div style="font-weight:normal; font-size:11px; color:var(--text3); margin-top:2px;">
            Período: ${fmtDate(semanaStartStr)} até ${fmtDate(semanaEndStr)} (Qui → Seg)
          </div>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <div class="badge purple">Qui → Seg</div>
        <button class="btn btn-ghost btn-sm" onclick="imprimirResumoSemana()" style="font-size:12px; padding:4px 10px;">🖨️ Imprimir</button>
      </div>
    </div>

    <div class="grid-2">
      <div class="stat-card" style="background:var(--purple-dim); border:1px solid rgba(168,85,247,0.2); padding: 20px;">
        <div class="stat-label" style="color:var(--purple)">Total Vendido (7d)</div>
        <div class="stat-value" style="color:var(--purple); font-size: 32px;">${fmt(totalSemana)}</div>
        <div class="stat-sub" style="color:var(--text2)">${vendasSemana.length} vendas concluídas</div>
        <div class="progress-bar" style="background:rgba(168,85,247,0.1); margin-top:15px;">
          <div class="progress-fill" style="width:100%; background:var(--purple)"></div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; padding-top:12px; border-top:1px solid rgba(168,85,247,0.2);">
          <div>
            <div class="stat-label" style="color:var(--text3); font-size:10px;">LUCRO SEMANAL</div>
            <div style="font-size:18px; font-weight:700; color:${lucroSemana>=0?'var(--green)':'var(--red)'};">${fmt(lucroSemana)}</div>
          </div>
          <div style="text-align:right;">
            <div class="stat-label" style="color:var(--text3); font-size:10px;">MARGEM</div>
            <div style="font-size:18px; font-weight:700; color:${margemSemana>=30?'var(--green)':margemSemana>=15?'var(--amber)':'var(--red)'};">${margemSemana.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <div class="card" style="background:rgba(255,255,255,0.02); border:1px solid var(--border)">
        <div class="card-title" style="font-size:13px; text-transform:uppercase; letter-spacing:0.5px; color:var(--text2);">
          🚀 Top 10 Mais Vendidos
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${rankSemana.length ? rankSemana.map(([n, q], idx) => `
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2" style="font-size:13px;">
                <span style="color:var(--text3); width:18px; font-weight:bold;">${idx+1}º</span>
                <span style="color:var(--text2)">${n}</span>
              </div>
              <span class="badge purple" style="font-size:10px;">${q} un</span>
            </div>`).join('') : '<div class="text-muted" style="padding:20px; text-align:center;">Nenhuma venda no período</div>'}
        </div>
      </div>
    </div>
    
    <div class="alert info mt-3" style="background:rgba(168,85,247,0.05); border-left:4px solid var(--purple); display:flex; align-items:center; gap:12px; padding:15px;">
      <span style="font-size:24px;">💡</span>
      <div style="font-size:13px; line-height:1.4;">
        <strong>Dica de Reabastecimento:</strong> Os produtos acima são os seus campeões de vendas na última semana. 
        Considere aumentar o estoque destes itens para garantir que não faltem nos próximos dias.
      </div>
    </div>
  </div>
  
  <div class="card mt-4">
    <div class="card-title">📝 Lista de Vendas do Dia</div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Hora</th>
            <th>Cliente</th>
            <th>Pagamento</th>
            <th style="text-align:right">Total</th>
            <th style="text-align:center">Ação</th>
          </tr>
        </thead>
        <tbody>
          ${vendasHoje.length === 0 ? '<tr><td colspan="5" style="text-align:center; padding: 20px;">Nenhuma venda registrada neste dia.</td></tr>' : 
            vendasHoje.sort((a,b) => new Date(b.dt || b.data) - new Date(a.dt || a.data)).map(v => `
              <tr>
                <td class="mono" style="font-size:12px">${v.hora || (v.dt ? v.dt.split('T')[1].slice(0,5) : '-')}</td>
                <td style="font-weight:600">${v.cliente || 'Consumidor'}</td>
                <td><span class="badge green" style="font-size:10px">${v.pagamento}</span></td>
                <td class="text-amber mono" style="text-align:right; font-weight:700">${fmt(v.total)}</td>
                <td style="text-align:center">
                  <button class="btn btn-ghost btn-sm" onclick="estornarVenda('${v.id}')" title="Estornar Venda" style="color:var(--red); border-color:transparent; padding:0 5px;">✖</button>
                </td>
              </tr>
            `).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function calcOpTotal(vendas,op){
  let total=0,custo=0;
  vendas.forEach(v=>{
    v.itens.forEach(i=>{
      const p=DB.produtos.find(x=>x.id==i.produtoId);
      if(p?.operacao===op){total+=i.subtotal;custo+=i.custo*i.qtd;}
    });
  });
  return {total,custo};
}

function imprimirCaixa(){window.print();}

function imprimirResumoSemana() {
  // Recalcula os dados da semana atual (mesma lógica do renderCaixa)
  const targetDate = normData(currentCaixaDate || getEffectiveDay());

  const dateParts = targetDate.split('-');
  const targetDateObj = new Date(dateParts[0], dateParts[1]-1, dateParts[2], 12, 0, 0);
  const diaSemana = targetDateObj.getDay();
  const diasDesdeQuinta = [3,4,5,6,0,1,2][diaSemana];
  const semanaStart = new Date(targetDateObj);
  semanaStart.setDate(targetDateObj.getDate() - diasDesdeQuinta);
  const semanaEnd = new Date(semanaStart);
  semanaEnd.setDate(semanaStart.getDate() + 4);
  const semanaStartStr = normData(semanaStart.toISOString());
  const semanaEndStr = normData(semanaEnd.toISOString());

  const vendasSemana = DB.vendas.filter(v => {
    const vDate = normData(v.data);
    return vDate >= semanaStartStr && vDate <= semanaEndStr;
  });

  const totalSemana = vendasSemana.reduce((s,v) => s+v.total, 0);
  const custoSemana = vendasSemana.reduce((s,v) => s+v.itens.reduce((si,i)=>si+(i.custo||0)*i.qtd,0), 0);

  const consumosSemana = (DB.consumos||[]).filter(c => {
    const cDate = normData(c.data);
    return cDate >= semanaStartStr && cDate <= semanaEndStr;
  });
  const custoConsumoSemana = consumosSemana.reduce((s,c) => {
    const p = DB.produtos.find(x => x.id === c.produtoId);
    return s + (p && p.custo ? p.custo * c.qtd : 0);
  }, 0);

  const lucroSemana = totalSemana - custoSemana - custoConsumoSemana;
  const margemSemana = totalSemana > 0 ? (lucroSemana / totalSemana * 100) : 0;

  // Totais por dia
  const nomesDias = ['Qui','Sex','Sáb','Dom','Seg'];
  const diasHtml = nomesDias.map((nome, i) => {
    const d = new Date(semanaStart);
    d.setDate(semanaStart.getDate() + i);
    const dStr = normData(d.toISOString());
    const vendasDia = vendasSemana.filter(v => normData(v.data) === dStr);
    const totalDia = vendasDia.reduce((s,v)=>s+v.total,0);
    const custoDia = vendasDia.reduce((s,v)=>s+v.itens.reduce((si,i)=>si+(i.custo||0)*i.qtd,0),0);
    const lucroDia = totalDia - custoDia;
    return `<tr>
      <td><strong>${nome}</strong> ${d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}</td>
      <td class="num">${vendasDia.length}</td>
      <td class="num amber">R$ ${totalDia.toFixed(2).replace('.',',')}</td>
      <td class="num red">R$ ${custoDia.toFixed(2).replace('.',',')}</td>
      <td class="num green">R$ ${lucroDia.toFixed(2).replace('.',',')}</td>
    </tr>`;
  }).join('');

  // Top 10 produtos
  const rankMap = {};
  vendasSemana.forEach(v => v.itens.forEach(i => {
    rankMap[i.nome] = (rankMap[i.nome]||0) + i.qtd;
  }));
  const rankSemana = Object.entries(rankMap).sort((a,b)=>b[1]-a[1]).slice(0,10);
  const rankHtml = rankSemana.map(([n,q],idx) =>
    `<tr><td>${idx+1}º</td><td>${n}</td><td class="num">${q} un</td></tr>`
  ).join('');

  const periodoStr = semanaStart.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'})
    + ' a ' + semanaEnd.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'});

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório Semanal – Conveniência Oliveira</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Arial, sans-serif; padding: 24px; color: #1a1a1a; font-size: 14px; }
    h1 { font-size: 20px; border-bottom: 3px solid #8b5cf6; padding-bottom: 8px; margin-bottom: 4px; }
    .sub { font-size: 12px; color: #666; margin-bottom: 20px; }
    .grid3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 20px; }
    .stat { border: 1px solid #ddd; border-radius: 8px; padding: 12px; text-align: center; }
    .stat .label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat .value { font-size: 22px; font-weight: 800; margin-top: 4px; }
    .amber { color: #d97706; } .green { color: #16a34a; } .red { color: #dc2626; } .purple { color: #7c3aed; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #f3f4f6; padding: 8px 10px; text-align: left; font-size: 12px; border-bottom: 2px solid #ddd; }
    td { padding: 7px 10px; border-bottom: 1px solid #eee; font-size: 13px; }
    .num { text-align: right; font-family: monospace; }
    h2 { font-size: 14px; font-weight: 700; margin-bottom: 10px; color: #4c1d95; text-transform: uppercase; letter-spacing: 0.5px; }
    tfoot td { font-weight: 800; background: #f9f9f9; border-top: 2px solid #ddd; }
    .footer { text-align: center; font-size: 11px; color: #aaa; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; }
    @media print { body { padding: 10px; } @page { margin: 1cm; } }
  </style>
</head>
<body>
  <h1>📅 Relatório Semanal – Conveniência Oliveira</h1>
  <div class="sub">Período: ${periodoStr} (Qui → Seg) &nbsp;|&nbsp; Gerado em ${new Date().toLocaleString('pt-BR')}</div>

  <div class="grid3">
    <div class="stat">
      <div class="label">Total Vendido</div>
      <div class="value amber">R$ ${totalSemana.toFixed(2).replace('.',',')}</div>
      <div class="label" style="margin-top:4px">${vendasSemana.length} vendas</div>
    </div>
    <div class="stat">
      <div class="label">Custo Total</div>
      <div class="value red">R$ ${(custoSemana+custoConsumoSemana).toFixed(2).replace('.',',')}</div>
      <div class="label" style="margin-top:4px">vendas + consumo</div>
    </div>
    <div class="stat">
      <div class="label">Lucro Líquido</div>
      <div class="value ${lucroSemana>=0?'green':'red'}">R$ ${lucroSemana.toFixed(2).replace('.',',')}</div>
      <div class="label" style="margin-top:4px">Margem: ${margemSemana.toFixed(1)}%</div>
    </div>
  </div>

  <h2>📊 Resultado por Dia</h2>
  <table>
    <thead><tr><th>Dia</th><th style="text-align:right">Vendas</th><th style="text-align:right">Faturamento</th><th style="text-align:right">Custo</th><th style="text-align:right">Lucro</th></tr></thead>
    <tbody>${diasHtml}</tbody>
    <tfoot><tr>
      <td><strong>TOTAL</strong></td>
      <td class="num">${vendasSemana.length}</td>
      <td class="num amber">R$ ${totalSemana.toFixed(2).replace('.',',')}</td>
      <td class="num red">R$ ${(custoSemana+custoConsumoSemana).toFixed(2).replace('.',',')}</td>
      <td class="num green">R$ ${lucroSemana.toFixed(2).replace('.',',')}</td>
    </tr></tfoot>
  </table>

  <h2>🏆 Top 10 Produtos Mais Vendidos</h2>
  <table>
    <thead><tr><th>#</th><th>Produto</th><th style="text-align:right">Qtd</th></tr></thead>
    <tbody>${rankHtml || '<tr><td colspan="3" style="text-align:center;color:#aaa">Sem vendas no período</td></tr>'}</tbody>
  </table>

  <div class="footer">Conveniência Oliveira – Sistema de Gestão</div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
}

// Alterna entre modo noturno automático e data real do relógio
window._toggleNightMode = function() {
  if (_nightModeOverride === today()) {
    // Estava forçado para data real → volta ao automático
    _nightModeOverride = null;
    showToast('🌙 Modo automático: usando data do turno noturno', 'info');
  } else {
    // Estava no automático → força data de hoje real
    _nightModeOverride = today();
    showToast('📅 Data real ativada: ' + new Date().toLocaleDateString('pt-BR'), 'info');
  }
  // Reset da data do caixa para refletir a mudança
  currentCaixaDate = getEffectiveDay();
  document.getElementById('content').innerHTML = renderCaixa();
};

// ===================== RELATÓRIOS =====================
function renderRelatorios(){
  const periodo=document.getElementById('relPeriodo')?.value||'hoje';
  let vendas=[];
  const hoje=today();
  const semanaAgo=new Date();semanaAgo.setDate(semanaAgo.getDate()-7);
  vendas=DB.vendas.filter(v=>{
    const d=new Date(v.data);
    if(periodo==='hoje')return (v.data||'').slice(0,10)===hoje;
    if(periodo==='semana')return d>=semanaAgo;
    if(periodo==='mes')return (v.data||'').slice(0,7)===hoje.slice(0,7);
    return true;
  });

  const consumosPeriodo = DB.consumos.filter(c => {
    const d = new Date(c.data);
    if (periodo === 'hoje') return (c.data || '').slice(0, 10) === hoje;
    if (periodo === 'semana') return d >= semanaAgo;
    if (periodo === 'mes') return (c.data || '').slice(0, 7) === hoje.slice(0, 7);
    return true;
  });

  const custoConsumo = consumosPeriodo.reduce((s, c) => {
    const p = DB.produtos.find(x => x.id == c.produtoId);
    return s + (p && p.custo ? p.custo * c.qtd : 0);
  }, 0);

  const totalVendas=vendas.reduce((s,v)=>s+v.total,0);
  const custoVendas=vendas.reduce((s,v)=>s+v.custo,0);
  const custo = custoVendas + custoConsumo; // Inclui perda por consumo interno no custo real
  const lucro=totalVendas-custo;

  const tipoMap={};
  vendas.forEach(v=>tipoMap[v.tipo]=(tipoMap[v.tipo]||0)+v.total);
  const pagMap2={};
  vendas.forEach(v=>pagMap2[v.pagamento]=(pagMap2[v.pagamento]||0)+v.total);
  const rankAll={};
  vendas.forEach(v=>v.itens.forEach(i=>rankAll[i.nome]=(rankAll[i.nome]||0)+i.qtd));

  const totalCompras=DB.compras.reduce((s,c)=>s+c.total,0);
  const comprasEsp=DB.compras.filter(c=>c.operacao==='Espetinho').reduce((s,c)=>s+c.total,0);
  const comprasBeb=DB.compras.filter(c=>c.operacao==='Bebidas').reduce((s,c)=>s+c.total,0);

  return `
  <div class="flex gap-2 mb-4 flex-wrap">
    <select class="form-control" style="width:auto" id="relPeriodo" onchange="navigate('relatorios')">
      <option value="hoje">Hoje</option>
      <option value="semana">Últimos 7 dias</option>
      <option value="mes">Este Mês</option>
      <option value="todos">Tudo</option>
    </select>
    <button class="btn btn-ghost" onclick="window.print()">Imprimir</button>
  </div>

  <div class="grid-3 mb-4">
    <div class="stat-card amber"><div class="stat-label">Total Vendas</div><div class="stat-value text-amber">${fmt(totalVendas)}</div><div class="stat-sub">${vendas.length} transações</div></div>
    <div class="stat-card red"><div class="stat-label">Custo Total</div><div class="stat-value text-red">${fmt(custo)}</div></div>
    <div class="stat-card green"><div class="stat-label">Lucro Bruto</div><div class="stat-value text-green">${fmt(lucro)}</div><div class="stat-sub">Margem: ${totalVendas?((lucro/totalVendas)*100).toFixed(1):0}%</div></div>
  </div>

  <div class="grid-2 mb-4">
    <div class="card">
      <div class="card-title">Por Tipo de Venda</div>
      ${Object.entries(tipoMap).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`
        <div class="flex justify-between mb-2">
          <span>${k}</span><span class="mono text-amber">${fmt(v)}</span>
        </div>`).join('') || '<div class="text-muted">Sem dados</div>'}
    </div>
    <div class="card">
      <div class="card-title">Por Pagamento</div>
      ${Object.entries(pagMap2).map(([k,v])=>`
        <div class="flex justify-between mb-2">
          <span>${k}</span><span class="mono text-blue">${fmt(v)}</span>
        </div>`).join('') || '<div class="text-muted">Sem dados</div>'}
    </div>
  </div>

  <div class="grid-2 mb-4">
    <div class="card">
      <div class="card-title">Ranking de Produtos</div>
      ${Object.entries(rankAll).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([n,q],i)=>`
        <div class="flex justify-between mb-2">
          <span style="font-size:13px">${i+1}. ${n}</span><span class="badge ${i===0?'amber':i===1?'blue':'green'}">${q} un</span>
        </div>`).join('') || '<div class="text-muted">Sem dados</div>'}
    </div>
    <div class="card">
      <div class="card-title">Investimento em Compras</div>
      <div class="flex justify-between mb-2"><span>Total Geral</span><span class="mono text-amber">${fmt(totalCompras)}</span></div>
      <div class="flex justify-between mb-2"><span>Espetinho</span><span class="mono text-op1">${fmt(comprasEsp)}</span></div>
      <div class="flex justify-between mb-2"><span>Bebidas</span><span class="mono text-blue">${fmt(comprasBeb)}</span></div>
      <div class="divider"></div>
      <div class="flex justify-between"><span class="text-muted">Nº de compras</span><span class="mono">${DB.compras.length}</span></div>
    </div>
  </div>

  <div class="card mb-4">
    <div class="card-title">Consumo Interno</div>
    ${DB.consumos.length===0?'<div class="text-muted">Nenhum registro</div>':
    `<div class="table-wrap"><table>
      <thead><tr><th>Data</th><th>Produto</th><th>Qtd</th><th>Motivo</th></tr></thead>
      <tbody>${DB.consumos.map(c=>`
        <tr><td>${fmtDate(c.data)}</td><td>${c.produto}</td><td class="mono">-${c.qtd}</td><td><span class="badge amber">${c.motivo}</span></td></tr>`).join('')}
      </tbody>
    </table></div>`}
  </div>`;
}

// ===================== AUDITORIA =====================
function renderAuditoria(){
  return `
  <div class="card">
    <div class="card-title">🔍 Log de Auditoria</div>
    ${DB.auditoria.length===0?'<div class="empty-state"><div class="icon">🔍</div>Nenhuma ação registrada</div>':''}
    ${DB.auditoria.length?`<div class="table-wrap"><table>
      <thead><tr><th>Data/Hora</th><th>Usuário</th><th>Ação</th><th>Detalhes</th></tr></thead>
      <tbody>${DB.auditoria.slice(-50).reverse().map(a=>`
        <tr>
          <td class="mono" style="font-size:12px">${fmtDT(a.dt)}</td>
          <td>${a.usuario}</td>
          <td><span class="badge blue">${a.acao}</span></td>
          <td class="text-muted">${a.detalhes||'-'}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>`:''}
  </div>`;
}

// ===================== BACKUP =====================
function renderBackup(){
  return `
  <div class="card">
    <div class="card-title">💾 Backup e Restauração</div>
    <div class="alert warning mb-4">
      ⚠️ <strong>Atenção:</strong> Como o sistema armazena os dados no navegador (localStorage), é altamente recomendado fazer o backup diário ou semanal. Limpar os dados do navegador (ou formatar o PC/celular) sem um backup resultará na perda irreversível das informações.
    </div>
    
    <div class="grid-2" style="gap:16px">
      <div class="card" style="border-color:var(--border);background:var(--surface2)">
        <h3 style="font-family:'Syne',sans-serif;font-size:16px;margin-bottom:10px">📤 Exportar Dados (Backup)</h3>
        <p class="text-muted mb-4" style="font-size:13px">Baixe todos os dados do sistema em um arquivo .json seguro para poder carregar futuramente.</p>
        <button class="btn btn-primary" onclick="exportarBackup()">💾 Baixar Backup Manual</button>
      </div>
      
      <div class="card" style="border-color:var(--border);background:var(--surface2)">
        <h3 style="font-family:'Syne',sans-serif;font-size:16px;margin-bottom:10px">📥 Importar Dados (Restaurar)</h3>
        <p class="text-muted mb-4" style="font-size:13px">Restaure o sistema utilizando um arquivo .json de backup anterior. <strong>Isto substituirá os dados atuais.</strong></p>
        <div class="flex" style="gap:10px;align-items:center">
          <input type="file" id="inputFileBackup" accept=".json" class="form-control" style="padding:6px;width:100%">
          <button class="btn btn-danger" onclick="importarBackup()">Restaurar</button>
        </div>
      </div>
      
      <div class="card" style="border-color:var(--border);background:var(--surface2);grid-column: 1 / -1;">
        <h3 style="font-family:'Syne',sans-serif;font-size:16px;margin-bottom:10px">☁️ Banco de Dados no Google Sheets</h3>
        <p class="text-muted mb-4" style="font-size:13px">Integre o sistema com o Google Planilhas. Cada venda efetuada e alteração irá alimentar sua planilha de estoque na nuvem de forma invisível.</p>
        <div class="form-row cols-2" style="align-items: flex-end;">
          <div class="form-group" style="margin:0;">
            <label class="form-label">Web App URL (Apps Script)</label>
            <input type="text" id="gsUrlInput" class="form-control" value="${GOOGLE_SHEETS_URL}" placeholder="https://script.google.com/macros/s/...">
          </div>
          <div class="flex" style="gap:10px">
            <button class="btn btn-primary" onclick="salvarConfigGS()">Vincular URL</button>
            <button class="btn btn-ghost" onclick="puxarDoGoogleSheets()"><span class="icon">🔄</span> Puxar (Planilha ➞ Sistema)</button>
          </div>
        </div>
        <p class="text-muted mt-3" style="font-size:11px; margin-top:10px">
          <em>Nota: O botão "Puxar" substitui os dados locais pelos dados que estiverem salvos lá no seu Google planilhas. Use caso altere valores lá e queira trazer pra cá.</em>
        </p>
      </div>

      <div class="card" style="border-color: #22c55e; background:var(--surface2); grid-column: 1 / -1;">
        <h3 style="font-family:'Syne',sans-serif;font-size:16px;margin-bottom:6px">☁️ Backup Diário no Google Drive</h3>
        <p class="text-muted mb-4" style="font-size:13px">Todo dia às <strong>03:00</strong> o sistema salva automaticamente um arquivo <code>backup_conveniencia_DD-MM-AAAA.json</code> na pasta <strong>"Backups Conveniencia"</strong> do seu Google Drive. Você pode também forçar um backup agora para testar.</p>
        <div class="flex" style="gap:10px; align-items:center; flex-wrap:wrap">
          <button class="btn btn-primary" style="background:#22c55e; border-color:#22c55e" id="btnBackupDrive" onclick="testarBackupDrive()">☁️ Salvar Backup Agora no Drive</button>
          <span id="backupDriveStatus" style="font-size:13px; color:var(--text2)">
            ${DB.config?.lastBackupSync ? `✅ Último backup automático: ${new Date(DB.config.lastBackupSync).toLocaleString('pt-BR')}` : '⚠️ Nenhum backup automático registrado recentemente.'}
          </span>
        </div>
      </div>

      <div class="card" style="border-color:#f59e0b;background:var(--surface2);grid-column: 1 / -1;">
        <h3 style="font-family:'Syne',sans-serif;font-size:16px;margin-bottom:10px">🏪 Importar Estoque Real da Conveniência</h3>
        <p class="text-muted mb-4" style="font-size:13px">Carrega todos os produtos reais da Conveniência (refrigerantes, cervejas, cachaças, gelo, doces etc.) com as quantidades do último inventário. <strong>⚠️ Substitui apenas a lista de produtos — vendas e histórico são preservados.</strong></p>
        <button class="btn btn-primary" style="background:#f59e0b;border-color:#f59e0b" onclick="importarEstoqueInicial()">📦 Carregar Estoque Real</button>
      </div>
    </div>
  </div>`;
}

window.importarEstoqueInicial = function() {
  if (!confirm('⚠️ Isso vai substituir a lista de produtos pelo estoque real da Conveniência.\n\nVendas, compras e histórico ficam intactos.\n\nConfirma?')) return;

  const ESTOQUE_REAL = [
    {id:1,nome:'Espetinho de Frango',categoria:'Espetinho',operacao:'Espetinho',unidade:'un',custo:3.5,preco:8,estoque:0,estoqueMin:5,status:'ativo',tipo:'produzido'},
    {id:2,nome:'Espetinho de Carne',categoria:'Espetinho',operacao:'Espetinho',unidade:'un',custo:4,preco:9,estoque:0,estoqueMin:5,status:'ativo',tipo:'produzido'},
    {id:3,nome:'Caldinho de Feijão',categoria:'Caldinho',operacao:'Espetinho',unidade:'un',custo:2.5,preco:6,estoque:0,estoqueMin:3,status:'ativo',tipo:'produzido'},
    // Refrigerantes 2L
    {id:10,nome:'Coca-Cola 2L',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:7,preco:12,estoque:9,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:11,nome:'Fanta Laranja 2L',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:6,preco:11,estoque:10,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:12,nome:'Guaraná 2L',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:5.5,preco:10,estoque:11,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:13,nome:'Pepsi 2L',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:5.5,preco:10,estoque:4,estoqueMin:2,status:'ativo',tipo:'pronto'},
    {id:14,nome:'Pepsi Black 2L',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:5.5,preco:10,estoque:4,estoqueMin:2,status:'ativo',tipo:'pronto'},
    // Refrigerantes 1L
    {id:15,nome:'Coca-Cola 1L',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:4.5,preco:8,estoque:17,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:16,nome:'Coca-Cola 1L Zero',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:4.5,preco:8,estoque:2,estoqueMin:2,status:'ativo',tipo:'pronto'},
    {id:17,nome:'Coca-Cola KS 1L',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:5,preco:9,estoque:11,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:18,nome:'Guaraná 1L',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:4,preco:7,estoque:4,estoqueMin:2,status:'ativo',tipo:'pronto'},
    // Latas pequenas
    {id:20,nome:'Coca-Cola Lata Normal',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2.5,preco:5,estoque:5,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:21,nome:'Coca-Cola Lata Zero',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2.5,preco:5,estoque:10,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:22,nome:'Coca-Cola 250ml',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:9,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:23,nome:'Pepsi 250ml',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:1,estoqueMin:2,status:'ativo',tipo:'pronto'},
    {id:24,nome:'Guaraná Lata',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:14,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:25,nome:'Fanta Laranja Lata',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:4,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:26,nome:'Fanta Caju Lata',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:2,estoqueMin:2,status:'ativo',tipo:'pronto'},
    // Cervejas unidades
    {id:30,nome:'Heineken 350ml',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:4,preco:8,estoque:13,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:31,nome:'Skol Lata',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:2.5,preco:5,estoque:2,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:32,nome:'Skol Beats',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:4,preco:7,estoque:7,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:33,nome:'Original',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:4.5,preco:8,estoque:2,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:34,nome:'Petra',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:4,preco:7,estoque:2,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:35,nome:'Eisenbahn',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:5,preco:9,estoque:8,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:36,nome:'Budweiser 250ml',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:3.5,preco:6,estoque:10,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:37,nome:'Brahma Chopp Latão',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:3.5,preco:6,estoque:6,estoqueMin:4,status:'ativo',tipo:'pronto'},
    // Cervejas convertidas
    {id:40,nome:'Itaipava (unit)',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:2.5,preco:4.5,estoque:71,estoqueMin:24,status:'ativo',tipo:'pronto'},
    {id:41,nome:'Spaten (unit)',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:3.5,preco:6,estoque:24,estoqueMin:12,status:'ativo',tipo:'pronto'},
    {id:42,nome:'Itaipava Premium (unit)',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:3,preco:5.5,estoque:12,estoqueMin:6,status:'ativo',tipo:'pronto'},
    // Energéticos
    {id:50,nome:'TNT 269ml Original',categoria:'Energético',operacao:'Bebidas',unidade:'un',custo:3.5,preco:7,estoque:2,estoqueMin:2,status:'ativo',tipo:'pronto'},
    {id:51,nome:'TNT Açaí c/ Guaraná',categoria:'Energético',operacao:'Bebidas',unidade:'un',custo:3.5,preco:7,estoque:4,estoqueMin:2,status:'ativo',tipo:'pronto'},
    {id:52,nome:'TNT Maçã Verde',categoria:'Energético',operacao:'Bebidas',unidade:'un',custo:3.5,preco:7,estoque:2,estoqueMin:2,status:'ativo',tipo:'pronto'},
    {id:53,nome:'Energético 2L',categoria:'Energético',operacao:'Bebidas',unidade:'un',custo:12,preco:22,estoque:3,estoqueMin:1,status:'ativo',tipo:'pronto'},
    // Cachaças
    {id:60,nome:'Matuta Umburana 3L',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:45,preco:80,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:61,nome:'Matuta Bálsamo 1L',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:25,preco:45,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:62,nome:'Matuta Tradicional',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:20,preco:35,estoque:2,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:63,nome:'Matuta Mel e Limão',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:22,preco:38,estoque:2,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:64,nome:'Caninha do Brejo Umburana',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:18,preco:30,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:65,nome:'Caninha do Brejo Cristal',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:15,preco:25,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:66,nome:'Cachaça 51',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:12,preco:20,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:67,nome:'Cachaça Gostosa 480ml',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:8,preco:15,estoque:10,estoqueMin:3,status:'ativo',tipo:'pronto'},
    {id:68,nome:'Cachaça Saliente 480ml',categoria:'Cachaça',operacao:'Bebidas',unidade:'un',custo:8,preco:15,estoque:9,estoqueMin:3,status:'ativo',tipo:'pronto'},
    // Whisky / Gin
    {id:70,nome:'Passport 1L',categoria:'Whisky',operacao:'Bebidas',unidade:'un',custo:35,preco:60,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:71,nome:'Black & White',categoria:'Whisky',operacao:'Bebidas',unidade:'un',custo:30,preco:55,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:72,nome:'Red Label',categoria:'Whisky',operacao:'Bebidas',unidade:'un',custo:50,preco:90,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:73,nome:'Jinrock',categoria:'Whisky',operacao:'Bebidas',unidade:'un',custo:28,preco:50,estoque:2,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:74,nome:'Dreher',categoria:'Conhaque',operacao:'Bebidas',unidade:'un',custo:20,preco:35,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    {id:75,nome:'Fogo Paulista',categoria:'Aguardente',operacao:'Bebidas',unidade:'un',custo:12,preco:22,estoque:1,estoqueMin:1,status:'ativo',tipo:'pronto'},
    // Outros / Água
    {id:80,nome:'Del Valle 1L',categoria:'Suco',operacao:'Bebidas',unidade:'un',custo:4,preco:7,estoque:4,estoqueMin:2,status:'ativo',tipo:'pronto'},
    {id:81,nome:'Água Mineral 510ml',categoria:'Água',operacao:'Bebidas',unidade:'un',custo:1,preco:2.5,estoque:86,estoqueMin:24,status:'ativo',tipo:'pronto'},
    {id:82,nome:'Água Tônica',categoria:'Água',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:9,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:83,nome:'Citrus 330ml',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:10,estoqueMin:4,status:'ativo',tipo:'pronto'},
    // Gelo
    {id:85,nome:'Gelo Comum (saco)',categoria:'Gelo',operacao:'Bebidas',unidade:'saco',custo:3,preco:6,estoque:3.5,estoqueMin:2,status:'ativo',tipo:'pronto'},
    {id:86,nome:'Gelo Saborizado Morango',categoria:'Gelo',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:16,estoqueMin:5,status:'ativo',tipo:'pronto'},
    {id:87,nome:'Gelo Saborizado Melancia',categoria:'Gelo',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:12,estoqueMin:5,status:'ativo',tipo:'pronto'},
    {id:88,nome:'Gelo Saborizado Maçã Verde',categoria:'Gelo',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:10,estoqueMin:5,status:'ativo',tipo:'pronto'},
    {id:89,nome:'Gelo Saborizado Maracujá',categoria:'Gelo',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:10,estoqueMin:5,status:'ativo',tipo:'pronto'},
    {id:90,nome:'Gelo Saborizado Água de Coco',categoria:'Gelo',operacao:'Bebidas',unidade:'un',custo:2,preco:4,estoque:11,estoqueMin:5,status:'ativo',tipo:'pronto'},
    // Doces / Conveniência
    {id:91,nome:'Halls',categoria:'Doces',operacao:'Bebidas',unidade:'pct',custo:1,preco:2,estoque:50,estoqueMin:20,status:'ativo',tipo:'pronto'},
    {id:92,nome:'Trident',categoria:'Doces',operacao:'Bebidas',unidade:'un',custo:1,preco:2,estoque:12,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:93,nome:'Fini 15g',categoria:'Doces',operacao:'Bebidas',unidade:'un',custo:1,preco:2,estoque:13,estoqueMin:6,status:'ativo',tipo:'pronto'},
    {id:94,nome:'Jujuba',categoria:'Doces',operacao:'Bebidas',unidade:'un',custo:1,preco:2,estoque:4,estoqueMin:4,status:'ativo',tipo:'pronto'},
    // Acessórios
    {id:95,nome:'Seda Natural',categoria:'Acessórios',operacao:'Bebidas',unidade:'pct',custo:3,preco:5,estoque:13,estoqueMin:5,status:'ativo',tipo:'pronto'},
  ];

  DB.produtos = ESTOQUE_REAL;
  DB.nextId.produto = 100;
  saveDB();
  auditLog('IMPORTAR_ESTOQUE', `Estoque real carregado: ${ESTOQUE_REAL.length} produtos`);
  showToast(`✅ ${ESTOQUE_REAL.length} produtos importados com sucesso!`, 'success');
  navigate('backup');
};

function salvarConfigGS() {
   const val = document.getElementById('gsUrlInput').value.trim();
   if (val && !_isAllowedGSUrl(val)) {
     showToast('URL inválida. Apenas URLs do script.google.com são permitidas.', 'error');
     return;
   }
   GOOGLE_SHEETS_URL = val || _GOOGLE_SHEETS_URL_DEFAULT;
   localStorage.setItem('convpro_gs_url', GOOGLE_SHEETS_URL);
   showToast('URL do Google associada com sucesso!', 'success');
   if (val !== '') {
     syncToGoogleSheets();
     showToast('Subindo base local para a planilha pela 1ª vez...', 'info');
   }
}

async function puxarDoGoogleSheets() {
   if (!GOOGLE_SHEETS_URL) {
      showToast('Nenhuma URL inserida.', 'error'); return;
   }
   showToast('Buscando dados na planilha... aguarde', 'info');
   try {
      const res = await fetch(GOOGLE_SHEETS_URL + "?action=carregar");
      const remoteDb = await res.json();
      if(remoteDb && remoteDb.produtos) {
         // Mescla em vez de substituir cegamente para segurança
         mergeRemoteDB(remoteDb);
         showToast('Sincronização concluída! Atualizando sistema...', 'success');
         setTimeout(() => location.reload(), 1500);
      } else {
         showToast('Carga não reconheceu Produtos. A planilha existe?', 'error');
      }
   } catch (e) {
      showToast('Erro ao ler a Planilha: ' + e.message, 'error');
   }
}

function exportarBackup(){
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(DB));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "conveniencia_oliveira_backup_" + getLocalISODate().slice(0,10) + ".json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  auditLog('BACKUP_EXPORT', 'Exportou backup dos dados em JSON');
  showToast('Backup iniciado com sucesso!', 'success');
}

function importarBackup(){
  const input = document.getElementById('inputFileBackup');
  if(!input.files || input.files.length === 0){
    showToast('Selecione um arquivo de backup (.json)', 'error');
    return;
  }
  
  if(!confirm('🚨 ALERTA CRÍTICO: Você está prestes a substituir TODOS os dados atuais por este arquivo de backup. Dados mais recentes que o backup serão perdidos para sempre. Deseja continuar?')) return;
  
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = function(e){
    try {
      const dbParsed = JSON.parse(e.target.result);
      if(!dbParsed || !dbParsed.produtos || !dbParsed.vendas){
        showToast('Arquivo de backup inválido ou corrompido.', 'error');
        return;
      }
      DB = dbParsed;
      saveDB();
      auditLog('BACKUP_IMPORT', 'Restauração de backup realizada');
      showToast('Banco de dados restaurado. Atualizando...', 'success');
      setTimeout(() => location.reload(), 1500);
    } catch(err) {
      showToast('Erro ao ler arquivo: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

// ===================== IMPRESSÃO TÉRMICA (80mm) =====================
function reimprimirVenda(vendaId) {
  const venda = DB.vendas.find(v => v.id == vendaId);
  if (venda) {
    imprimirCupom(venda);
  } else {
    showToast('Venda não encontrada.', 'error');
  }
}

function estornarVenda(id){
  if(!confirm('🚨 ATENÇÃO: Tem certeza que deseja estornar e cancelar esta venda? Os produtos voltarão para o estoque e o valor será removido do caixa. Esta ação é irreversível.')) return;
  const idx = DB.vendas.findIndex(v=>v.id==id);
  if(idx===-1) return;
  const v = DB.vendas[idx];
  
  // Devolver estoque 
  v.itens.forEach(item => {
    const p = DB.produtos.find(x => x.id === item.produtoId);
    if(p && p.tipo === 'pronto') {
      p.estoque += item.qtd; // Devolve o item que foi vendido pro saldo 
    }
  });
  
  auditLog('ESTORNO', `Venda #${v.id} estornada. Valor de ${fmt(v.total)}`);
  
  DB.vendas.splice(idx, 1);
  saveDB();
  showToast('Venda estornada com sucesso.', 'info');
  
  // Recarrega a tela atual para refletir as mudanças
  if(currentPage==='dashboard') {
    document.getElementById('content').innerHTML = renderDashboard();
  } else if(currentPage==='caixa') {
    document.getElementById('content').innerHTML = renderCaixa();
  } else {
    navigate(currentPage);
  }
}

function imprimirCupom(venda) {
  let printFrame = document.getElementById('printFrame');
  if (!printFrame) {
    printFrame = document.createElement('iframe');
    printFrame.id = 'printFrame';
    printFrame.style.position = 'absolute';
    printFrame.style.width = '0px';
    printFrame.style.height = '0px';
    printFrame.style.border = 'none';
    document.body.appendChild(printFrame);
  }

  const nomeLoja = "CONVENIÊNCIA OLIVEIRA";
  // O usuário pode mudar aqui depois
  const cnpj = "63.530.569/0001-89"; 
  const endereco = "Rua Cícero Faustino da Silva 407, Lagoa Seca PB"; 
  const telefone = "-";

  const dataParts = venda.data.split('-');
  const dataFormatada = `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}`;
  const horaFormatada = venda.hora || (venda.dt ? venda.dt.split('T')[1].substring(0, 5) : '');

  let itensHtml = '';
  venda.itens.forEach(item => {
    itensHtml += `
      <tr>
        <td class="col-qtd">${item.qtd}</td>
        <td class="col-desc">${item.nome}</td>
        <td class="col-valor">${fmt(item.subtotal)}</td>
      </tr>
    `;
  });

  const content = `
    <html>
      <head>
        <title>Cupom #${venda.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
          @page { margin: 0; size: 80mm auto; }
          body {
            font-family: 'DM Mono', monospace, sans-serif;
            font-size: 11px;
            color: #000;
            width: 76mm;
            margin: 0 auto;
            padding: 2mm 0;
            background: #fff;
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .header { margin-bottom: 5px; }
          .loja-nome { font-size: 14px; font-weight: bold; margin-bottom: 2px; }
          .divider { border-top: 1px dashed #000; margin: 4px 0; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; border-bottom: 1px dashed #000; padding-bottom: 2px; }
          td { padding-top: 2px; vertical-align: top; }
          .col-qtd { width: 10%; text-align: center; }
          .col-desc { width: 65%; }
          .col-valor { width: 25%; text-align: right; }
          .total-row { font-size: 13px; font-weight: bold; }
          .footer { text-align: center; margin-top: 10px; font-size: 10px; }
          @media print { body { width: 100%; } }
        </style>
      </head>
      <body>
        <div class="header center">
          <div class="loja-nome">${nomeLoja}</div>
          <div>CNPJ: ${cnpj}</div>
          <div>${endereco}</div>
          <div>Tel: ${telefone}</div>
        </div>
        <div class="divider"></div>
        <div style="display:flex; justify-content:space-between">
          <span>Data: ${dataFormatada} ${horaFormatada}</span>
          <span>Op: ${venda.usuario || 'Caixa'}</span>
        </div>
        <div><strong>Pedido #${venda.id}</strong> - ${venda.tipo}</div>
        ${venda.cliente ? `<div style="margin-top:2px; font-size:13px;"><strong>Mesa/Cliente:</strong> ${venda.cliente}</div>` : ''}
        <div class="divider"></div>
        <table>
          <thead>
            <tr>
              <th class="col-qtd">Q</th>
              <th class="col-desc">Descricao</th>
              <th class="col-valor" style="text-align:right">Valor</th>
            </tr>
          </thead>
          <tbody>${itensHtml}</tbody>
        </table>
        <div class="divider"></div>
        <table style="margin-top: 5px;">
          <tr class="total-row">
            <td style="text-align: left;">TOTAL:</td>
            <td style="text-align: right;">${fmt(venda.total)}</td>
          </tr>
          <tr>
            <td style="text-align: left;">Pagamento:</td>
            <td style="text-align: right;">${venda.pagamento}</td>
          </tr>
        </table>
        ${venda.obs ? `<div class="divider"></div><div><strong>Obs:</strong> ${venda.obs}</div>` : ''}
        <div class="divider"></div>
        <div class="footer">
          <div>Volte sempre!</div>
          <div style="font-size: 9px; margin-top: 5px;">Desenvolvido por Conveniência Oliveira</div>
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
    </html>
  `;

  const doc = printFrame.contentWindow.document;
  doc.open();
  doc.write(content);
  doc.close();
}

// ===================== INIT =====================
document.getElementById('loginPass').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});
document.getElementById('loginUser').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('loginPass').focus();});

// ===================== MIGRATION: RECOVERY 02/04 (SMART MERGE) =====================
/**
 * Script de emergência para recuperar dados de ontem (02/04/2026) 
 * injetando-os no localStorage sem apagar as vendas de hoje (03/04/2026).
 */
(function smartMergeBackup() {
  const MERGE_KEY = 'convpro_merged_recovery_v3';
  if (localStorage.getItem(MERGE_KEY)) return; // Já executou uma vez

  console.log("🚀 Iniciando Recuperação Inteligente de Dados (02/04)...");

  const backupData = {
    "produtos": [{"id":1,"nome":"Espetinho de Frango","categoria":"Espetinho","operacao":"Espetinho","unidade":"un","custo":4.9,"preco":7,"estoque":5,"estoqueMin":5,"status":"ativo","tipo":"produzido"},{"id":2,"nome":"Espetinho de Carne","categoria":"Espetinho","operacao":"Espetinho","unidade":"un","custo":6.08,"preco":8,"estoque":18,"estoqueMin":5,"status":"ativo","tipo":"produzido"},{"id":3,"nome":"Caldinho de Feijão","categoria":"Caldinho","operacao":"Espetinho","unidade":"un","custo":2.5,"preco":6,"estoque":0,"estoqueMin":3,"status":"inativo","tipo":"produzido"},{"id":10,"nome":"Coca-Cola 2L","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":9.26,"preco":12,"estoque":9,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":11,"nome":"Fanta Laranja 2L","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":7.52,"preco":10,"estoque":10,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":12,"nome":"Guaraná 2L","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":7.12,"preco":10,"estoque":11,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":13,"nome":"Pepsi 2L","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":6.88,"preco":10,"estoque":4,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":14,"nome":"Pepsi Black 2L","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":6.88,"preco":10,"estoque":4,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":15,"nome":"Coca-Cola 1L","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":6.01,"preco":8,"estoque":17,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":16,"nome":"Coca-Cola 1L Zero","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":5.84,"preco":8,"estoque":1,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":17,"nome":"Coca-Cola KS 1L","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":4.77,"preco":8,"estoque":10,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":18,"nome":"Guaraná 1L","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":4.32,"preco":8,"estoque":2,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":20,"nome":"Coca-Cola Lata Normal","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":3.06,"preco":5,"estoque":5,"estoqueMin":6,"status":"ativo","tipo":"pronto"},{"id":21,"nome":"Coca-Cola Lata Zero","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":2.98,"preco":5,"estoque":9,"estoqueMin":6,"status":"ativo","tipo":"pronto"},{"id":22,"nome":"Coca-Cola 250ml","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":2.57,"preco":4,"estoque":9,"estoqueMin":6,"status":"ativo","tipo":"pronto"},{"id":23,"nome":"Pepsi 200ml","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":1.52,"preco":3,"estoque":1,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":24,"nome":"Guaraná Lata","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":2.57,"preco":5,"estoque":14,"estoqueMin":6,"status":"ativo","tipo":"pronto"},{"id":25,"nome":"Fanta Laranja Lata","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":2.42,"preco":5,"estoque":4,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":26,"nome":"Fanta Caju Lata","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":2.42,"preco":5,"estoque":2,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":30,"nome":"Heineken 350ml","categoria":"Cerveja","operacao":"Bebidas","unidade":"un","custo":5,"preco":7,"estoque":13,"estoqueMin":6,"status":"ativo","tipo":"pronto"},{"id":31,"nome":"Skol Lata","categoria":"Cerveja","operacao":"Bebidas","unidade":"un","custo":2.91,"preco":5,"estoque":2,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":32,"nome":"Skol Beats","categoria":"Cerveja","operacao":"Bebidas","unidade":"un","custo":5,"preco":8,"estoque":7,"estoqueMin":3,"status":"ativo","tipo":"pronto"},{"id":33,"nome":"Original","categoria":"Cerveja","operacao":"Bebidas","unidade":"un","custo":4.5,"preco":8,"estoque":2,"estoqueMin":4,"status":"inativo","tipo":"pronto"},{"id":34,"nome":"Petra","categoria":"Cerveja","operacao":"Bebidas","unidade":"un","custo":3.27,"preco":5,"estoque":2,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":35,"nome":"Eisenbahn","categoria":"Cerveja","operacao":"Bebidas","unidade":"un","custo":3.64,"preco":5,"estoque":8,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":36,"nome":"Budweiser 350ml","categoria":"Cerveja","operacao":"Bebidas","unidade":"un","custo":3.4,"preco":5,"estoque":5,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":37,"nome":"Brahma Chopp Latão","categoria":"Cerveja","operacao":"Bebidas","unidade":"un","custo":4.16,"preco":6,"estoque":6,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":40,"nome":"Itaipava (unit)","categoria":"Cerveja","operacao":"Bebidas","unidade":"un","custo":3.21,"preco":5,"estoque":68,"estoqueMin":12,"status":"ativo","tipo":"pronto"},{"id":41,"nome":"Spaten (unit)","categoria":"Cerveja","operacao":"Bebidas","unidade":"un","custo":3.66,"preco":6,"estoque":24,"estoqueMin":5,"status":"ativo","tipo":"pronto"},{"id":42,"nome":"Itaipava Premium (unit)","categoria":"Cerveja","operacao":"Bebidas","unidade":"un","custo":3.43,"preco":5,"estoque":12,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":50,"nome":"TNT 269ml Original","categoria":"Energético","operacao":"Bebidas","unidade":"un","custo":5.53,"preco":8,"estoque":2,"estoqueMin":2,"status":"ativo","tipo":"pronto"},{"id":51,"nome":"TNT Açaí c/ Guaraná","categoria":"Energético","operacao":"Bebidas","unidade":"un","custo":7.16,"preco":10,"estoque":4,"estoqueMin":2,"status":"ativo","tipo":"pronto"},{"id":52,"nome":"TNT Maçã Verde","categoria":"Energético","operacao":"Bebidas","unidade":"un","custo":7.16,"preco":10,"estoque":2,"estoqueMin":2,"status":"ativo","tipo":"pronto"},{"id":53,"nome":"Energético 2L - Bally","categoria":"Energético","operacao":"Bebidas","unidade":"un","custo":10,"preco":15,"estoque":3,"estoqueMin":2,"status":"ativo","tipo":"pronto"},{"id":60,"nome":"Matuta Umburana 1L","categoria":"Cachaça","operacao":"Bebidas","unidade":"un","custo":26.66,"preco":0,"estoque":3,"estoqueMin":1,"status":"ativo","tipo":"pronto"},{"id":61,"nome":"Matuta Bálsamo 1L","categoria":"Cachaça","operacao":"Bebidas","unidade":"un","custo":26.66,"preco":0,"estoque":1,"estoqueMin":1,"status":"ativo","tipo":"pronto"},{"id":62,"nome":"Matuta Cristal 1L","categoria":"Cachaça","operacao":"Bebidas","unidade":"un","custo":19.5,"preco":0,"estoque":2,"estoqueMin":1,"status":"ativo","tipo":"pronto"},{"id":63,"nome":"Matuta Mel e Limão","categoria":"Cachaça","operacao":"Bebidas","unidade":"un","custo":31.5,"preco":0,"estoque":2,"estoqueMin":1,"status":"ativo","tipo":"pronto"},{"id":64,"nome":"Caninha do Brejo Umburana","categoria":"Cachaça","operacao":"Bebidas","unidade":"un","custo":18,"preco":0,"estoque":1,"estoqueMin":1,"status":"ativo","tipo":"pronto"},{"id":65,"nome":"Caninha do Brejo Cristal","categoria":"Cachaça","operacao":"Bebidas","unidade":"un","custo":15,"preco":0,"estoque":1,"estoqueMin":1,"status":"ativo","tipo":"pronto"},{"id":66,"nome":"Cachaça 51","categoria":"Cachaça","operacao":"Bebidas","unidade":"un","custo":0,"preco":0,"estoque":1,"estoqueMin":1,"status":"ativo","tipo":"pronto"},{"id":67,"nome":"Cachaça Gostosa 480ml","categoria":"Cachaça","operacao":"Bebidas","unidade":"un","custo":2,"preco":3,"estoque":10,"estoqueMin":3,"status":"ativo","tipo":"pronto"},{"id":68,"nome":"Cachaça Saliente 480ml","categoria":"Cachaça","operacao":"Bebidas","unidade":"un","custo":2,"preco":3,"estoque":9,"estoqueMin":3,"status":"ativo","tipo":"pronto"},{"id":70,"nome":"Passport 1L","categoria":"Whisky","operacao":"Bebidas","unidade":"un","custo":40.9,"preco":50,"estoque":1,"estoqueMin":1,"status":"ativo","tipo":"pronto"},{"id":71,"nome":"Black & White","categoria":"Whisky","operacao":"Bebidas","unidade":"un","custo":62.83,"preco":70,"estoque":1,"estoqueMin":1,"status":"ativo","tipo":"pronto"},{"id":72,"nome":"Red Label","categoria":"Whisky","operacao":"Bebidas","unidade":"un","custo":87.84,"preco":100,"estoque":1,"estoqueMin":1,"status":"ativo","tipo":"pronto"},{"id":73,"nome":"Jinrock","categoria":"Whisky","operacao":"Bebidas","unidade":"un","custo":25,"preco":35,"estoque":2,"estoqueMin":1,"status":"ativo","tipo":"pronto"},{"id":74,"nome":"Dreher","categoria":"Conhaque","operacao":"Bebidas","unidade":"un","custo":18,"preco":22,"estoque":1,"estoqueMin":1,"status":"ativo","tipo":"pronto"},{"id":75,"nome":"Fogo Paulista","categoria":"Aguardente","operacao":"Bebidas","unidade":"un","custo":0,"preco":0,"estoque":1,"estoqueMin":1,"status":"ativo","tipo":"pronto"},{"id":80,"nome":"Del Valle 1L","categoria":"Suco","operacao":"Bebidas","unidade":"un","custo":6.78,"preco":10,"estoque":4,"estoqueMin":2,"status":"ativo","tipo":"pronto"},{"id":81,"nome":"Água Mineral 510ml","categoria":"Água","operacao":"Bebidas","unidade":"un","custo":0.72,"preco":2.5,"estoque":82,"estoqueMin":24,"status":"ativo","tipo":"pronto"},{"id":82,"nome":"Água Tônica","categoria":"Água","operacao":"Bebidas","unidade":"un","custo":2.65,"preco":5,"estoque":9,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":83,"nome":"Citrus 330ml","categoria":"Refrigerante","operacao":"Bebidas","unidade":"un","custo":1.65,"preco":3.5,"estoque":10,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":85,"nome":"Gelo Comum (saco)","categoria":"Gelo","operacao":"Bebidas","unidade":"saco","custo":2,"preco":5,"estoque":2,"estoqueMin":2,"status":"ativo","tipo":"pronto"},{"id":86,"nome":"Gelo Saborizado Morango","categoria":"Gelo","operacao":"Bebidas","unidade":"un","custo":2,"preco":4,"estoque":16,"estoqueMin":5,"status":"ativo","tipo":"pronto"},{"id":87,"nome":"Gelo Saborizado Melancia","categoria":"Gelo","operacao":"Bebidas","unidade":"un","custo":2,"preco":4,"estoque":12,"estoqueMin":5,"status":"ativo","tipo":"pronto"},{"id":88,"nome":"Gelo Saborizado Maçã Verde","categoria":"Gelo","operacao":"Bebidas","unidade":"un","custo":2,"preco":4,"estoque":10,"estoqueMin":5,"status":"ativo","tipo":"pronto"},{"id":89,"nome":"Gelo Saborizado Maracujá","categoria":"Gelo","operacao":"Bebidas","unidade":"un","custo":2,"preco":4,"estoque":10,"estoqueMin":5,"status":"ativo","tipo":"pronto"},{"id":90,"nome":"Gelo Saborizado Água de Coco","categoria":"Gelo","operacao":"Bebidas","unidade":"un","custo":2,"preco":4,"estoque":11,"estoqueMin":5,"status":"ativo","tipo":"pronto"},{"id":91,"nome":"Halls","categoria":"Doces","operacao":"Bebidas","unidade":"pct","custo":1.46,"preco":2,"estoque":50,"estoqueMin":10,"status":"ativo","tipo":"pronto"},{"id":92,"nome":"Trident","categoria":"Doces","operacao":"Bebidas","unidade":"un","custo":2.08,"preco":2.5,"estoque":11,"estoqueMin":6,"status":"ativo","tipo":"pronto"},{"id":93,"nome":"Fini 15g","categoria":"Doces","operacao":"Bebidas","unidade":"un","custo":0.91,"preco":2,"estoque":13,"estoqueMin":6,"status":"ativo","tipo":"pronto"},{"id":94,"nome":"Jujuba","categoria":"Doces","operacao":"Bebidas","unidade":"un","custo":1,"preco":2,"estoque":4,"estoqueMin":4,"status":"ativo","tipo":"pronto"},{"id":95,"nome":"Seda Natural","categoria":"Acessórios","operacao":"Bebidas","unidade":"pct","custo":3,"preco":4,"estoque":13,"estoqueMin":5,"status":"ativo","tipo":"pronto"},{"id":100,"status":"ativo","nome":"Sub-zero latão","categoria":"Cerveja","operacao":"Bebidas","tipo":"pronto","unidade":"un","custo":3.92,"preco":6,"estoque":32,"estoqueMin":4},{"id":101,"status":"ativo","nome":"Espetinho de Linguiça","categoria":"Espetinho","operacao":"Espetinho","tipo":"produzido","unidade":"un","custo":4.7,"preco":7,"estoque":22,"estoqueMin":5},{"id":102,"status":"ativo","nome":"Espetinho de queijo com mel","categoria":"Espetinho","operacao":"Espetinho","tipo":"produzido","unidade":"un","custo":6,"preco":9,"estoque":3,"estoqueMin":5},{"id":103,"status":"ativo","nome":"Espetinho Romeu e Julieta","categoria":"Espetinho","operacao":"Espetinho","tipo":"produzido","unidade":"un","custo":6,"preco":10,"estoque":1,"estoqueMin":5},{"id":104,"status":"ativo","nome":"Espetinho de Frango com Bacon","categoria":"Espetinho","operacao":"Espetinho","tipo":"produzido","unidade":"un","custo":6.36,"preco":8,"estoque":0,"estoqueMin":5},{"id":105,"status":"ativo","nome":"Espetinho de Carne com Queijo","categoria":"Espetinho","operacao":"Espetinho","tipo":"produzido","unidade":"un","custo":6,"preco":12,"estoque":0,"estoqueMin":5},{"id":106,"status":"ativo","nome":"Espetinho de Coração","categoria":"Espetinho","operacao":"Espetinho","tipo":"produzido","unidade":"un","custo":5,"preco":7,"estoque":0,"estoqueMin":5},{"id":107,"status":"ativo","nome":"Espetinho de Coração com Bacon","categoria":"Espetinho","operacao":"Espetinho","tipo":"produzido","unidade":"un","custo":0,"preco":8,"estoque":0,"estoqueMin":5},{"id":108,"status":"ativo","nome":"Espetinho de Pão de alho","categoria":"Espetinho","operacao":"Espetinho","tipo":"produzido","unidade":"un","custo":3.87,"preco":7,"estoque":0,"estoqueMin":5},{"id":109,"status":"ativo","nome":"dose brejeira","categoria":"dose","operacao":"Bebidas","tipo":"pronto","unidade":"dose","custo":0.6,"preco":2,"estoque":117,"estoqueMin":10},{"id":110,"status":"ativo","nome":"vinho quinta do morgado 750ml","categoria":"bebidas","operacao":"Bebidas","tipo":"pronto","unidade":"un","custo":13.17,"preco":18,"estoque":0,"estoqueMin":1},{"id":111,"status":"ativo","nome":"vinho pergola 1l","categoria":"vinho","operacao":"Bebidas","tipo":"produzido","unidade":"un","custo":20.32,"preco":25,"estoque":1,"estoqueMin":5},{"id":112,"status":"ativo","nome":"dose red label","categoria":"dose","operacao":"Bebidas","tipo":"pronto","unidade":"dose","custo":4.88,"preco":8,"estoque":5,"estoqueMin":5},{"id":113,"status":"ativo","nome":"Copão red label","categoria":"copão","operacao":"Bebidas","tipo":"produzido","unidade":"un","custo":19.15,"preco":30,"estoque":0,"estoqueMin":5}],
    "vendas": [{"id":3,"data":"2026-04-02","hora":"19:29:41","tipo":"Retirada","pagamento":"Dinheiro","obs":"","total":16,"custo":12.72,"cliente":"","itens":[{"produtoId":104,"nome":"Espetinho de Frango com Bacon","preco":8,"custo":6.36,"qtd":2,"subtotal":16}],"usuario":"Administrador","dt":"2026-04-02T19:29:41.376"},{"id":4,"data":"2026-04-02","hora":"19:34:11","tipo":"Mesa","pagamento":"Dinheiro","obs":"","total":4,"custo":1.2,"cliente":"","itens":[{"produtoId":109,"nome":"dose brejeira","preco":2,"custo":0.6,"qtd":2,"subtotal":4}],"usuario":"Vendedor","dt":"2026-04-02T19:34:11.273"},{"id":5,"data":"2026-04-02","hora":"19:34:55","tipo":"Mesa","pagamento":"Dinheiro","obs":"","total":31,"custo":23.14,"cliente":"MESA 02","itens":[{"produtoId":1,"nome":"Espetinho de Frango","preco":7,"custo":4.9,"qtd":1,"subtotal":7},{"produtoId":2,"nome":"Espetinho de Carne","preco":8,"custo":6.08,"qtd":3,"subtotal":24}],"usuario":"Vendedor","dt":"2026-04-02T19:34:55.409"},{"id":6,"data":"2026-04-02","hora":"19:38:24","tipo":"Retirada","pagamento":"Dinheiro","obs":"","total":8,"custo":6.08,"cliente":"","itens":[{"produtoId":2,"nome":"Espetinho de Carne","preco":8,"custo":6.08,"qtd":1,"subtotal":8}],"usuario":"Vendedor","dt":"2026-04-02T19:38:24.590"},{"id":7,"data":"2026-04-02","hora":"19:42:34","tipo":"Retirada","pagamento":"Pix","obs":"","total":106,"custo":66.78,"cliente":"wanderlei","itens":[{"produtoId":105,"nome":"Espetinho de Carne com Queijo","preco":12,"custo":6,"qtd":2,"subtotal":24},{"produtoId":2,"nome":"Espetinho de Carne","preco":8,"custo":6.08,"qtd":1,"subtotal":8},{"produtoId":18,"nome":"Guaraná 1L","preco":8,"custo":4.32,"qtd":2,"subtotal":16},{"produtoId":1,"nome":"Espetinho de Frango","preco":7,"custo":4.9,"qtd":4,"subtotal":28},{"produtoId":104,"nome":"Espetinho de Frango com Bacon","preco":8,"custo":6.36,"qtd":2,"subtotal":16},{"produtoId":108,"nome":"Espetinho de Pão de alho","preco":7,"custo":3.87,"qtd":2,"subtotal":14}],"usuario":"Vendedor","dt":"2026-04-02T19:42:34.457"},{"id":8,"data":"2026-04-02","hora":"19:55:25","tipo":"Retirada","pagamento":"Dinheiro","obs":"subzero vendida a 5 reais ","total":47,"custo":32.74,"cliente":"","itens":[{"produtoId":2,"nome":"Espetinho de Carne","preco":8,"custo":6.08,"qtd":2,"subtotal":16},{"produtoId":1,"nome":"Espetinho de Frango","preco":7,"custo":4.9,"qtd":1,"subtotal":7},{"produtoId":100,"nome":"Sub-zero latão","preco":6,"custo":3.92,"qtd":4,"subtotal":24}],"usuario":"Vendedor","dt":"2026-04-02T19:55:25.191"},{"id":9,"data":"2026-04-02","hora":"20:01:54","tipo":"Retirada","pagamento":"Dinheiro","obs":"","total":16,"custo":12.16,"cliente":"","itens":[{"produtoId":2,"nome":"Espetinho de Carne","preco":8,"custo":6.08,"qtd":2,"subtotal":16}],"usuario":"Vendedor","dt":"2026-04-02T20:01:54.601"},{"id":10,"data":"2026-04-02","hora":"20:47:19","tipo":"Retirada","pagamento":"Pix","obs":"","total":18,"custo":12.76,"cliente":"","itens":[{"produtoId":2,"nome":"Espetinho de Carne","preco":8,"custo":6.08,"qtd":2,"subtotal":16},{"produtoId":109,"nome":"dose brejeira","preco":2,"custo":0.6,"qtd":1,"subtotal":2}],"usuario":"Vendedor","dt":"2026-04-02T20:47:19.891"},{"id":11,"data":"2026-04-02","hora":"20:49:06","tipo":"Retirada","pagamento":"Dinheiro","obs":"","total":45,"custo":31.4,"cliente":"mesa 3","itens":[{"produtoId":108,"nome":"Espetinho de Pão de alho","preco":7,"custo":3.87,"qtd":1,"subtotal":7},{"produtoId":104,"nome":"Espetinho de Frango com Bacon","preco":8,"custo":6.36,"qtd":1,"subtotal":8},{"produtoId":36,"nome":"Budweiser 350ml","preco":5,"custo":3.4,"qtd":3,"subtotal":15},{"produtoId":2,"nome":"Espetinho de Carne","preco":8,"custo":6.08,"qtd":1,"subtotal":8},{"produtoId":1,"nome":"Espetinho de Frango","preco":7,"custo":4.9,"qtd":1,"subtotal":7}],"usuario":"Vendedor","dt":"2026-04-02T20:49:06.008"},{"id":12,"data":"2026-04-02","hora":"20:50:23","tipo":"Carro/Moto","pagamento":"Dinheiro","obs":"","total":5,"custo":2,"cliente":"","itens":[{"produtoId":85,"nome":"Gelo Comum (saco)","preco":5,"custo":2,"qtd":1,"subtotal":5}],"usuario":"Vendedor","dt":"2026-04-02T20:50:23.401"},{"id":13,"data":"2026-04-02","hora":"20:54:45","tipo":"Mesa","pagamento":"Pix","obs":"","total":25,"custo":20.32,"cliente":"mesa 1 rita","itens":[{"produtoId":111,"nome":"vinho pergola 1l","preco":25,"custo":20.32,"qtd":1,"subtotal":25}],"usuario":"Vendedor","dt":"2026-04-02T20:54:45.113"},{"id":14,"data":"2026-04-02","hora":"21:02:46","tipo":"Retirada","pagamento":"Fiado/Pendente","obs":"","total":8,"custo":5.84,"cliente":"juliete","itens":[{"produtoId":16,"nome":"Coca-Cola 1L Zero","preco":8,"custo":5.84,"qtd":1,"subtotal":8}],"usuario":"Vendedor","dt":"2026-04-02T21:02:46.948"},{"id":15,"data":"2026-04-02","hora":"21:17:36","tipo":"Retirada","pagamento":"Pix","obs":"","total":17.5,"custo":12.03,"cliente":"Pedro","itens":[{"produtoId":2,"nome":"Espetinho de Carne","preco":8,"custo":6.08,"qtd":1,"subtotal":8},{"produtoId":108,"nome":"Espetinho de Pão de alho","preco":7,"custo":3.87,"qtd":1,"subtotal":7},{"produtoId":92,"nome":"Trident","preco":2.5,"custo":2.08,"qtd":1,"subtotal":2.5}],"usuario":"Vendedor","dt":"2026-04-02T21:17:36.012"},{"id":16,"data":"2026-04-02","hora":"21:21:17","tipo":"Retirada","pagamento":"Pix","obs":"","total":20,"custo":13.96,"cliente":"","itens":[{"produtoId":21,"nome":"Coca-Cola Lata Zero","preco":5,"custo":2.98,"qtd":1,"subtotal":5},{"produtoId":1,"nome":"Espetinho de Frango","preco":7,"custo":4.9,"qtd":1,"subtotal":7},{"produtoId":2,"nome":"Espetinho de Carne","preco":8,"custo":6.08,"qtd":1,"subtotal":8}],"usuario":"Vendedor","dt":"2026-04-02T21:21:17.993"},{"id":17,"data":"2026-04-02","hora":"21:43:31","tipo":"Retirada","pagamento":"Pix","obs":"","total":8,"custo":6.08,"cliente":"","itens":[{"produtoId":2,"nome":"Espetinho de Carne","preco":8,"custo":6.08,"qtd":1,"subtotal":8}],"usuario":"Vendedor","dt":"2026-04-02T21:43:31.488"},{"id":18,"data":"2026-04-02","hora":"22:08:56","tipo":"Retirada","pagamento":"Pix","obs":"","total":83,"custo":59.86,"cliente":"mesa 2","itens":[{"produtoId":2,"nome":"Espetinho de Carne","preco":8,"custo":6.08,"qtd":2,"subtotal":16},{"produtoId":104,"nome":"Espetinho de Frango com Bacon","preco":8,"custo":6.36,"qtd":2,"subtotal":16},{"produtoId":108,"nome":"Espetinho de Pão de alho","preco":7,"custo":3.87,"qtd":1,"subtotal":7},{"produtoId":110,"nome":"vinho quinta do morgado 750ml","preco":18,"custo":13.17,"qtd":2,"subtotal":36},{"produtoId":17,"nome":"Coca-Cola KS 1L","preco":8,"custo":4.77,"qtd":1,"subtotal":8}],"usuario":"Vendedor","dt":"2026-04-02T22:08:56.920"},{"id":19,"data":"2026-04-02","hora":"22:40:19","tipo":"Mesa","pagamento":"Dinheiro","obs":"","total":5,"custo":3.21,"cliente":"mesa","itens":[{"produtoId":40,"nome":"Itaipava (unit)","preco":5,"custo":3.21,"qtd":1,"subtotal":5}],"usuario":"Vendedor","dt":"2026-04-02T22:40:19.660"},{"id":20,"data":"2026-04-02","hora":"22:50:18","tipo":"Mesa","pagamento":"Dinheiro","obs":"","total":30,"custo":19.15,"cliente":"galego","itens":[{"produtoId":113,"nome":"Copão red label","preco":30,"custo":19.15,"qtd":1,"subtotal":30}],"usuario":"Vendedor","dt":"2026-04-02T22:50:18.652"},{"id":21,"data":"2026-04-02","hora":"22:58:49","tipo":"Mesa","pagamento":"Dinheiro","obs":"","total":15,"custo":10.01,"cliente":"","itens":[{"produtoId":40,"nome":"Itaipava (unit)","preco":5,"custo":3.21,"qtd":1,"subtotal":5},{"produtoId":36,"nome":"Budweiser 350ml","preco":5,"custo":3.4,"qtd":2,"subtotal":10}],"usuario":"Vendedor","dt":"2026-04-02T22:58:49.499"},{"id":22,"data":"2026-04-02","hora":"23:57:33","tipo":"Mesa","pagamento":"Dinheiro","obs":"","total":8,"custo":6.36,"cliente":"eliane","itens":[{"produtoId":104,"nome":"Espetinho de Frango com Bacon","preco":8,"custo":6.36,"qtd":1,"subtotal":8}],"usuario":"Vendedor","dt":"2026-04-02T23:57:33.080"},{"id":23,"data":"2026-04-03","hora":"00:10:16","tipo":"Mesa","pagamento":"Pix","obs":"","total":5,"custo":3.21,"cliente":"","itens":[{"produtoId":40,"nome":"Itaipava (unit)","preco":5,"custo":3.21,"qtd":1,"subtotal":5}],"usuario":"Vendedor","dt":"2026-04-03T00:10:16.698"}],
    "compras": [{"id":1,"fornecedor":"Ajaz","data":"2026-03-22","operacao":"Bebidas","pagamento":"Pix","obs":"","total":57.5,"itens":[{"produtoId":5,"produto":"Skol 600ml","qtd":10,"custo":5.75,"total":57.5}],"usuario":"Administrador","dt":"2026-03-22T16:55:16.310"}],
    "consumos": [{"id":1,"produtoId":1,"produto":"Espetinho de Frango","qtd":2,"motivo":"Consumo interno","obs":"janta","operacao":"Espetinho","data":"2026-04-02","usuario":"Administrador","dt":"2026-04-02T22:14:42.614"},{"id":2,"produtoId":81,"produto":"Água Mineral 510ml","qtd":4,"motivo":"Consumo interno","obs":"","operacao":"Bebidas","data":"2026-04-03","usuario":"Administrador","dt":"2026-04-03T00:27:30.284"},{"id":3,"produtoId":104,"produto":"Espetinho de Frango com Bacon","qtd":1,"motivo":"Consumo interno","obs":"","operacao":"Espetinho","data":"2026-04-03","usuario":"Administrador","dt":"2026-04-03T00:27:55.361"}],
    "producoes": [{"id":1,"produtoId":1,"produto":"Espetinho de Frango","qtd":10,"obs":"","data":"2026-03-22","usuario":"Administrador","dt":"2026-03-22T16:53:04.299"},{"id":2,"produtoId":2,"produto":"Espetinho de Carne","qtd":4,"obs":"","data":"2026-03-22","usuario":"Administrador","dt":"2026-03-22T16:53:12.766"}],
    "nextId": {"produto":114,"venda":24,"compra":2,"producao":3,"consumo":4,"caixa":1}
  };

  try {
    let currentDB = JSON.parse(localStorage.getItem('convpro_db') || '{}');
    if (!currentDB.produtos) currentDB = { produtos:[], vendas:[], compras:[], producoes:[], consumos:[], auditoria:[], nextId:{} };

    // 1. Atualizar Produtos (Preços e Custos de ontem)
    backupData.produtos.forEach(bp => {
      const idx = currentDB.produtos.findIndex(p => p.id == bp.id);
      if (idx !== -1) {
        currentDB.produtos[idx].custo = bp.custo;
        currentDB.produtos[idx].preco = bp.preco;
        currentDB.produtos[idx].estoque = bp.estoque;
      } else {
        currentDB.produtos.push(bp);
      }
    });

    // 2. Mesclar Vendas (Evita duplicados pelo timestamp 'dt')
    backupData.vendas.forEach(bv => {
      if (!currentDB.vendas.some(v => v.dt === bv.dt)) {
        currentDB.vendas.push(bv);
      }
    });

    // 3. Mesclar Compras, Produções e Consumos
    ['compras', 'producoes', 'consumos'].forEach(key => {
      if (backupData[key]) {
        backupData[key].forEach(item => {
          if (!currentDB[key].some(i => i.dt === item.dt)) {
            currentDB[key].push(item);
          }
        });
      }
    });

    // 4. Atualizar nextId
    if (backupData.nextId) {
      Object.keys(backupData.nextId).forEach(key => {
        currentDB.nextId[key] = Math.max(currentDB.nextId[key] || 0, backupData.nextId[key]);
      });
    }

    // 5. Salvar e Marcar como concluído
    localStorage.setItem('convpro_db', JSON.stringify(currentDB));
    localStorage.setItem(MERGE_KEY, 'true');

    currentDB.auditoria.push({
      id: Date.now(),
      usuario: 'Sistema',
      acao: 'RECUPERACAO_BACKUP',
      detalhes: 'Restauração inteligente de dados de 02/04 realizada com sucesso.',
      dt: new Date().toISOString()
    });
    localStorage.setItem('convpro_db', JSON.stringify(currentDB));

    console.log("✅ Recuperação concluída! Recarregue a página para ver as mudanças.");
    
    if (window.DB) {
      window.DB = currentDB;
      if (typeof renderDashboard === 'function' && document.getElementById('content')) {
        setTimeout(() => { location.reload(); }, 2000);
      }
    }
  } catch (e) {
    console.error("❌ Erro na migração:", e);
  }
})();