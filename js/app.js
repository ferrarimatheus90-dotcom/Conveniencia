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
window.addEventListener('DOMContentLoaded', () => {
  const icon = currentTheme === 'light' ? '🌙' : '☀️';
  const btn = document.getElementById('btnThemeToggle');
  if (btn) btn.innerHTML = icon;
  const btnLogin = document.getElementById('btnThemeToggleLogin');
  if (btnLogin) btnLogin.innerHTML = icon;

  const savedLogin = localStorage.getItem('convpro_savedLogin');
  if (savedLogin) {
    try {
      const data = JSON.parse(savedLogin);
      if (document.getElementById('loginUser')) document.getElementById('loginUser').value = data.u || '';
      if (document.getElementById('loginPass')) document.getElementById('loginPass').value = data.p || '';
      if (document.getElementById('loginRemember')) document.getElementById('loginRemember').checked = true;
      setTimeout(doLogin, 300); // Auto login para puxar atualizado assim que abrir!
    } catch(e) {}
  }
});

const USERS = [
  {id:0,username:'dev',password:'dev@2026',role:'dev',name:'Desenvolvedor'},
  {id:1,username:'admin',password:'Conveniencia@2005#',role:'admin',name:'Administrador'},
  {id:2,username:'vendedor',password:'vendedor@2026',role:'funcionario',name:'Vendedor'}
];

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
  nextId: {produto:100,venda:1,compra:1,producao:1,consumo:1,caixa:1}
};

let currentUser = null;
let currentPage = 'dashboard';
let GOOGLE_SHEETS_URL = localStorage.getItem('convpro_gs_url') || 'https://script.google.com/macros/s/AKfycbw2-zau41VnCdOV0-HxcmDOeQSaSlciv4Cs8dOnxCkrP2MWTJYNXoHVtDVL9vEgo_wkGw/exec';

function saveDB(){
  localStorage.setItem('convpro_db',JSON.stringify(DB));
  syncToGoogleSheets(); // Envia para a nuvem de forma invisível
}

async function syncToGoogleSheets() {
  if (!GOOGLE_SHEETS_URL) return;
  try {
    fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'sincronizar', db: DB }),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' } // 'text/plain' evita erro de CORS no Apps Script
    });
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
  
  fetch(GOOGLE_SHEETS_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'sincronizar', db: DB }),
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }
  }).then(r => r.json()).then(res => {
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
    const res = await fetch(GOOGLE_SHEETS_URL + '?action=get_pedidos');
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
         fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'marcar_pedidos_recebidos', ids: idsRecebidos }),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }
         });
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
    const mesas = pedidos.map(p => p.cliente).join(', ');
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
  div.innerHTML = `<div>${title}</div><div class="toast-sub">${sub}</div>`;
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
function doLogin(){
  const u=document.getElementById('loginUser').value.trim();
  const p=document.getElementById('loginPass').value;
  const rem=document.getElementById('loginRemember') ? document.getElementById('loginRemember').checked : false;
  const user=USERS.find(x=>x.username===u&&x.password===p);
  if(!user){document.getElementById('loginError').style.display='block';return}
  
  document.getElementById('loginError').style.display='none';
  const btn = document.querySelector('.login-btn');
  if(btn) { btn.innerHTML = 'Sincronizando Nuvem...'; btn.disabled = true; }
  
  if (GOOGLE_SHEETS_URL) {
      fetch(GOOGLE_SHEETS_URL + '?action=carregar')
        .then(r => r.json())
        .then(remoteDb => {
            if (remoteDb && remoteDb.produtos) {
                DB = remoteDb;
                localStorage.setItem('convpro_db', JSON.stringify(DB));
            }
            finishLogin(user, rem);
        })
        .catch(e => {
            console.error("Erro ao puxar dados na nuvem:", e);
            finishLogin(user, rem);
        });
  } else {
      finishLogin(user, rem);
  }
}

function finishLogin(user, rem){
  const btn = document.querySelector('.login-btn');
  if(btn) { btn.innerHTML = 'Entrar'; btn.disabled = false; }
  
  if(rem) {
    localStorage.setItem('convpro_savedLogin', JSON.stringify({u: user.username, p: user.password}));
  } else {
    localStorage.removeItem('convpro_savedLogin');
  }
  currentUser=user;
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('app').style.display='flex';
  document.getElementById('sidebarUser').textContent=user.name+' · '+user.role;
  buildSidebar();
  updateDate();
  setInterval(updateDate,60000);
  startPollingOrders();

  // Sincronização Automática Background (para manter 3 PCs com os mesmos dados)
  if (!window.bgSyncInterval && GOOGLE_SHEETS_URL) {
    window.bgSyncInterval = setInterval(async () => {
      try {
        const res = await fetch(GOOGLE_SHEETS_URL + '?action=carregar');
        const remoteDb = await res.json();
        if (remoteDb && remoteDb.produtos) {
          let updated = false;
          // Puxando vendas que outros PCs fizeram
          (remoteDb.vendas || []).forEach(rv => {
            if (!DB.vendas.find(v => v.id === rv.id)) { DB.vendas.push(rv); updated = true; }
          });
          // Se tiver atualização importante da nuvem
          if (updated) {
            DB.produtos = remoteDb.produtos; // Sincroniza estoque e produtos novos
            DB.compras = remoteDb.compras;

            // LOGICA INTELIGENTE PARA MESAS: Mesclar em vez de substituir cegamente
            // para não perder pedidos que acabaram de chegar via Polling
            if (remoteDb.mesas_abertas) {
              const mesasAtuais = DB.mesas_abertas || [];
              remoteDb.mesas_abertas.forEach(rm => {
                const ex = mesasAtuais.find(m => m.cliente === rm.cliente);
                if (!ex) { mesasAtuais.push(rm); }
              });
              DB.mesas_abertas = mesasAtuais;
            }

            localStorage.setItem('convpro_db', JSON.stringify(DB));
            if (currentPage === 'caixa') document.getElementById('content').innerHTML = renderCaixa();
            if (currentPage === 'dashboard') document.getElementById('content').innerHTML = renderDashboard();
            if (currentPage === 'vendas') renderProdutos_venda();
          }
        }
      } catch(e){}
    }, 20000); // Verificar a cada 20 segundos
  }

  // Sincronização Automática para Planilha (a cada 30 minutos)
  if (!window.autoSyncInterval && GOOGLE_SHEETS_URL) {
    window.autoSyncInterval = setInterval(() => {
      console.log('Sincronização automática a cada 30 minutos iniciada...');
      syncToGoogleSheets(); // Envia dados para a nuvem automaticamente
      showToast('Sincronização automática realizada com a planilha.', 'info');
    }, 30 * 60 * 1000); // 30 minutos
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

function doLogout(){
  auditLog('LOGOUT','Saiu do sistema');
  currentUser=null;
  if(orderCheckInterval) clearInterval(orderCheckInterval);
  if(window.bgSyncInterval) clearInterval(window.bgSyncInterval);
  if(window.autoSyncInterval) clearInterval(window.autoSyncInterval);
  document.getElementById('loginScreen').style.display='flex';
  document.getElementById('app').style.display='none';
  const savedLogin = localStorage.getItem('convpro_savedLogin');
  if(!savedLogin) {
    document.getElementById('loginUser').value='';
    document.getElementById('loginPass').value='';
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
function fmtDate(iso){return iso?new Date(iso).toLocaleDateString('pt-BR'):''}
function fmtDT(iso){return iso?new Date(iso).toLocaleString('pt-BR'):''}
function getLocalISODate() {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, -1);
}
function today(){return getLocalISODate().slice(0,10)}
function normData(d) {
  if (!d) return '';
  d = String(d).split('T')[0];
  if (d.includes('/')) {
    const p = d.split('/');
    if (p.length === 3) return p[2] + '-' + p[1].padStart(2, '0') + '-' + p[0].padStart(2, '0');
  }
  return d.slice(0, 10);
}
function uid(key){const id=DB.nextId[key]||1;DB.nextId[key]=id+1;return id}
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
function renderDashboard(){
  const vendasHoje=DB.vendas.filter(v=>(v.data||'').slice(0,10)===today());
  const totalHoje=vendasHoje.reduce((s,v)=>s+v.total,0);
  const custoHoje=vendasHoje.reduce((s,v)=>s+v.custo,0);
  const lucroHoje=totalHoje-custoHoje;
  const totalVendasMes=DB.vendas.filter(v=>(v.data||'').slice(0,7)===today().slice(0,7)).reduce((s,v)=>s+v.total,0);

  const produtosAlerta=DB.produtos.filter(p=>p.status==='ativo'&&p.estoque<=p.estoqueMin);

  // === Novas Métricas: Ticket Médio & Pico de Horário ===
  const ticketMedio = vendasHoje.length ? (totalHoje / vendasHoje.length) : 0;
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

  // === Novas Métricas: Consumo/Quebra do Dia ===
  const consumoHoje = (DB.consumos || []).filter(c => c.data === today());
  const custoConsumoHoje = consumoHoje.reduce((s, c) => {
    const p = DB.produtos.find(x => x.id === c.produtoId);
    return s + (p && p.custo ? p.custo * c.qtd : 0);
  }, 0);
  const qtdConsumo = consumoHoje.reduce((s, c) => s + c.qtd, 0);

  const rankMap={};
  vendasHoje.forEach(v=>v.itens.forEach(i=>{
    rankMap[i.nome]=(rankMap[i.nome]||0)+i.qtd;
  }));
  const rank=Object.entries(rankMap).sort((a,b)=>b[1]-a[1]).slice(0,5);

  const vendasEsp=vendasHoje.filter(v=>v.operacao==='Espetinho'||v.itens.some(i=>{const p=DB.produtos.find(x=>x.id===i.produtoId);return p?.operacao==='Espetinho'}));
  const vendasBeb=vendasHoje.filter(v=>!vendasEsp.includes(v));
  const totEsp=vendasHoje.reduce((s,v)=>s+v.itens.filter(i=>{const p=DB.produtos.find(x=>x.id===i.produtoId);return p?.operacao==='Espetinho'}).reduce((a,i)=>a+i.subtotal,0),0);
  const totBeb=vendasHoje.reduce((s,v)=>s+v.itens.filter(i=>{const p=DB.produtos.find(x=>x.id===i.produtoId);return p?.operacao==='Bebidas'}).reduce((a,i)=>a+i.subtotal,0),0);
  const abertos = (DB.mesas_abertas || []).length;
  const qtdPedidosHoje = vendasHoje.length + abertos;

  return `
  ${produtosAlerta.length?`<div class="alert warning">⚠️ ${produtosAlerta.length} produto(s) com estoque baixo: ${produtosAlerta.map(p=>p.nome).join(', ')}</div>`:''}
  <div class="grid-5 mb-4" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
    <div class="stat-card blue">
      <div class="stat-label">Pedidos Hoje</div>
      <div class="stat-value text-blue">${qtdPedidosHoje}</div>
      <div class="stat-sub">${vendasHoje.length} concluídos, ${abertos} abertos</div>
    </div>
    <div class="stat-card amber">
      <div class="stat-label">Vendas Hoje</div>
      <div class="stat-value text-amber">${fmt(totalHoje)}</div>
      <div class="stat-sub">R$ finalizados hoje</div>
    </div>
    <div class="stat-card green">
      <div class="stat-label">Lucro Bruto</div>
      <div class="stat-value text-green">${fmt(lucroHoje)}</div>
      <div class="stat-sub">Margem: ${totalHoje?((lucroHoje/totalHoje)*100).toFixed(1):0}%</div>
    </div>
    
    <div class="stat-card" style="border-left: 4px solid #8b5cf6;">
      <div class="stat-label">Ticket Médio</div>
      <div class="stat-value" style="color:#8b5cf6">${fmt(ticketMedio)}</div>
      <div class="stat-sub">Pico de vendas às: <strong>${picoHora}</strong></div>
    </div>
    <div class="stat-card red" style="border-left: 4px solid #ef4444;">
      <div class="stat-label">Perdas / Consumo (Hoje)</div>
      <div class="stat-value" style="color:#ef4444">${fmt(custoConsumoHoje)}</div>
      <div class="stat-sub">${qtdConsumo} un. baixadas</div>
    </div>

    <div class="stat-card blue">
      <div class="stat-label">Vendas no Mês</div>
      <div class="stat-value text-blue">${fmt(totalVendasMes)}</div>
      <div class="stat-sub">${new Date().toLocaleString('pt-BR',{month:'long'})}</div>
    </div>
    <div class="stat-card purple">
      <div class="stat-label">Produtos</div>
      <div class="stat-value" style="color:var(--purple)">${DB.produtos.filter(p=>p.status==='ativo').length}</div>
      <div class="stat-sub">${produtosAlerta.length} alertas</div>
    </div>
  </div>

  <div class="grid-2 mb-4">
    <div class="card">
      <div class="card-title">Por Operação – Hoje</div>
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2"><span class="op-dot op1"></span><span>Espetinho</span></div>
        <span class="text-amber mono">${fmt(totEsp)}</span>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2"><span class="op-dot op2"></span><span>Bebidas/Bomboniere</span></div>
        <span class="text-blue mono">${fmt(totBeb)}</span>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Ranking de Hoje</div>
      ${rank.length?rank.map(([n,q])=>`
        <div class="flex items-center justify-between mb-2">
          <span style="font-size:13px">${n}</span>
          <span class="badge amber">${q} un</span>
        </div>`).join(''):'<div class="empty-state" style="padding:20px"><div class="icon">📊</div>Sem vendas ainda</div>'}
    </div>
  </div>

  <div class="card">
    <div class="section-header">
      <div class="card-title" style="margin:0">Últimas Vendas</div>
      <div class="flex gap-2">
        <button class="btn btn-ghost btn-sm" onclick="gerarQRCodeMesa()">📱 QR Code Mesas</button>
        <button class="btn btn-ghost btn-sm" onclick="navigate('vendas')">Nova Venda +</button>
      </div>
    </div>
    ${DB.vendas.length===0?'<div class="empty-state"><div class="icon">🛒</div>Nenhuma venda registrada</div>':''}
    ${DB.vendas.length?`<div class="table-wrap"><table>
      <thead><tr><th>#</th><th>Data</th><th>Itens</th><th>Tipo</th><th>Pagamento</th><th>Total</th><th>Ação</th></tr></thead>
      <tbody>${DB.vendas.slice(-10).reverse().map(v=>`
        <tr>
          <td class="mono">#${v.id}</td>
          <td>${fmtDate(v.data)}</td>
          <td>${v.itens.map(i=>i.nome+' x'+i.qtd).join(', ')}</td>
          <td><span class="badge blue">${v.tipo}</span></td>
          <td><span class="badge green">${v.pagamento}</span></td>
          <td class="text-amber mono">${fmt(v.total)}</td>
          <td>
            <div class="flex" style="gap:4px">
              <button class="btn btn-ghost btn-sm" onclick="reimprimirVenda(${v.id})" title="Imprimir Cupom">🖨️</button>
              ${currentUser.role==='admin'||currentUser.role==='dev'?`<button class="btn btn-danger btn-sm" onclick="estornarVenda(${v.id})" title="Estornar/Cancelar Venda">✖</button>`:''}
            </div>
          </td>
        </tr>`).join('')}
      </tbody>
    </table></div>`:''}
  </div>`;
}

// ===================== QR CODE CARDÁPIO =====================
function gerarQRCodeMesa(){
  const mesas = [1,2,3,4,5,6,7,8,9,10];
  const currentUrl = window.location.href.split('index.html')[0] + 'cardapio.html';
  const gsParam = GOOGLE_SHEETS_URL ? '&gs=' + encodeURIComponent(GOOGLE_SHEETS_URL) : '';
  
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
          <button class="btn btn-ghost btn-sm" style="font-size:12px; border:1px solid var(--border)" onclick="abrirModalMesas()"><span class="icon">📝</span> Mesas Abertas</button>
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
  </div>`;
}

function initVendas(){
  cart=[];
  selectedOp='todos';
  renderProdutos_venda();
  updateCart();
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
    <div class="produto-btn" id="pbtn-${p.id}" onclick="addToCart(${p.id})">
      <div class="p-op">${p.operacao==='Espetinho'?'🔥':'🍺'} ${p.operacao}</div>
      <div class="p-name">${p.nome}</div>
      <div class="p-price">${fmt(p.preco)}</div>
    </div>`).join('');
}

function addToCart(pid){
  const p=DB.produtos.find(x=>x.id===pid);
  if(!p)return;
  const ex=cart.find(x=>x.produtoId===pid);
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
    id:uid('venda'),data:today(),hora:new Date().toLocaleTimeString('pt-BR'),
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
  const idx = DB.mesas_abertas.findIndex(x => x.cliente.toLowerCase() === cliente.toLowerCase());
  
  const obs = document.getElementById('vendaObs')?.value || '';
  
  const novaMesa = {
    cliente: cliente,
    obs: obs,
    itens: JSON.parse(JSON.stringify(cart)), // clona os itens
    dtAtualizacao: getLocalISODate()
  };
  
  if(idx >= 0){
    DB.mesas_abertas[idx] = novaMesa;
  } else {
    DB.mesas_abertas.push(novaMesa);
  }
  
  saveDB();
  
  // Imprimir comanda de cozinha (parcial)
  if (document.getElementById('vendaImprimir')?.checked) {
    imprimirComandaParcial(novaMesa);
  } else {
    showToast(`Pedido salvo na comanda: ${cliente}`, 'success');
  }
  
  cart = [];
  updateCart();
  document.getElementById('vendaObs').value='';
  document.getElementById('vendaCliente').value='';
}

function abrirModalMesas(){
  DB.mesas_abertas = DB.mesas_abertas || [];
  openModal(`
    <div class="modal-title">📝 Mesas / Contas em Aberto</div>
    <div class="text-muted" style="margin-bottom:15px; font-size:13px;">Selecione uma mesa para adicionar mais itens ou para realizar a cobrança final.</div>
    ${DB.mesas_abertas.length === 0 ? '<div class="empty-state"><div class="icon">📝</div>Nenhuma mesa em aberto no momento</div>' : ''}
    ${DB.mesas_abertas.length ? `<div class="table-wrap"><table>
      <thead><tr><th>Mesa/Cliente</th><th>Qtd Itens</th><th>Total Atual</th><th>Ações</th></tr></thead>
      <tbody>${DB.mesas_abertas.map((m, idx) => `
        <tr>
          <td><strong>${m.cliente}</strong><br><small class="text-muted">${new Date(m.dtAtualizacao).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}</small></td>
          <td class="mono">${m.itens.reduce((s,i) => s + i.qtd, 0)} un</td>
          <td class="text-amber mono">${fmt(m.itens.reduce((s,i) => s + (i.preco * i.qtd), 0))}</td>
          <td>
             <button class="btn btn-primary btn-sm" onclick="carregarMesaAberta(${idx})">Abrir</button>
             <button class="btn btn-danger btn-sm" onclick="excluirMesaAberta(${idx})">×</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table></div>` : ''}
    <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Fechar</button></div>
  `);
}

function carregarMesaAberta(idx){
  const m = DB.mesas_abertas[idx];
  if(!m) return;
  cart = JSON.parse(JSON.stringify(m.itens));
  document.getElementById('vendaCliente').value = m.cliente;
  document.getElementById('vendaObs').value = m.obs || '';
  updateCart();
  closeModal();
  showToast(`Mesa ${m.cliente} carregada para o caixa!`, 'info');
}

function excluirMesaAberta(idx){
  if(confirm('Tem certeza que deseja apagar essa comanda? Os itens não foram cobrados do cliente.')){
    DB.mesas_abertas.splice(idx, 1);
    saveDB();
    abrirModalMesas();
  }
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
    const prodHoje=DB.producoes.filter(x=>x.data===hoje&&x.produtoId===p.id).reduce((s,x)=>s+x.qtd,0);
    const vendHoje=vendasHoje.reduce((s,v)=>s+v.itens.filter(i=>i.produtoId===p.id).reduce((a,i)=>a+i.qtd,0),0);
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
            <button class="btn btn-ghost btn-sm" onclick="modalProducaoEdicao(${p.produtoId}, ${p.qtd}, '${p.id}')" title="Editar">📝</button>
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
    const idx = DB.producoes.findIndex(x => x.id == producaoId || (x.produtoId === pid && x.data === today()));
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
  const consumos = (DB.consumos || []).slice().reverse(); // Mais recentes primeiro
  
  return `
  <div class="section-header">
    <div class="section-title">📉 Consumo Interno / Perdas</div>
    <button class="btn btn-primary" onclick="modalConsumo()">+ Registrar Consumo</button>
  </div>
  
  <div class="card mb-4">
    <div class="card-title">📋 Últimos Registros de Consumo</div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Data</th>
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
                <td>${new Date(c.data).toLocaleString('pt-BR')}</td>
                <td class="fw-bold">${c.produto}</td>
                <td><span class="badge bg-warning">${c.qtd}</span></td>
                <td>${c.motivo || '-'}</td>
                <td><small>${c.user || 'Desconhecido'}</small></td>
              </tr>
            `).join('')
          }
        </tbody>
      </table>
    </div>
  </div>
  `;
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
  const pid=parseInt(document.getElementById('mcProd').value);
  const qtd=parseInt(document.getElementById('mcQtd').value)||0;
  const motivo=document.getElementById('mcMotivo').value;
  const obs=escapeHTML(document.getElementById('mcObs').value);
  if(!qtd){showToast('Informe a quantidade','error');return;}
  const p=DB.produtos.find(x=>x.id===pid);
  if(['Perda','Quebra','Vencimento'].includes(motivo)){
    if(!confirm(`Confirma o registro de ${qtd} un de ${p.nome} como ${motivo}? Isso baixa o estoque e representa prejuízo.`)) return;
  }
  const c={id:uid('consumo'),produtoId:pid,produto:p.nome,qtd,motivo,obs,operacao:p.operacao,data:today(),usuario:currentUser.name,dt:getLocalISODate()};
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
              <button class="btn btn-ghost btn-sm" onclick="modalProduto(${p.id})" title="Editar">✏️</button>
              <button class="btn btn-ghost btn-sm" onclick="toggleProduto(${p.id})" title="${p.status==='ativo'?'Inativar':'Ativar'}">${p.status==='ativo'?'⛔':'✅'}</button>
              <button class="btn btn-danger btn-sm" onclick="excluirProduto(${p.id})" title="Excluir Permanentemente">🗑️</button>
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
        <button class="btn btn-ghost btn-sm" onclick="modalProduto(${p.id})" title="Editar">✏️</button>
        <button class="btn btn-ghost btn-sm" onclick="toggleProduto(${p.id})" title="${p.status==='ativo'?'Inativar':'Ativar'}">${p.status==='ativo'?'⛔':'✅'}</button>
        <button class="btn btn-danger btn-sm" onclick="excluirProduto(${p.id})" title="Excluir Permanentemente">🗑️</button>
      </td>
    </tr>`).join('');
    
  document.getElementById('produtoTableWrap').innerHTML = `<table><thead><tr><th>Nome</th><th>Categoria</th><th>Operação</th><th>Tipo</th><th>Custo</th><th>Preço</th><th>Estoque</th><th>Status</th><th>Ações</th></tr></thead><tbody>${html}</tbody></table>`;
}

function modalProduto(id){
  const p=id?DB.produtos.find(x=>x.id===id):{};
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
      <button class="btn btn-primary" onclick="salvarProduto(${id||0})">Salvar</button>
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
  if(id){
    const p=DB.produtos.find(x=>x.id===id);
    Object.assign(p,data);
    auditLog('PRODUTO_EDIT',data.nome);
  } else {
    DB.produtos.push({id:uid('produto'),status:'ativo',...data});
    auditLog('PRODUTO_ADD',data.nome);
  }
  saveDB();
  closeModal();
  showToast('Produto salvo!','success');
  navigate('produtos');
}

function toggleProduto(id){
  const p=DB.produtos.find(x=>x.id===id);
  const acao = p.status === 'ativo' ? 'INATIVAR' : 'ATIVAR';
  if(!confirm(`Tem certeza que deseja ${acao} o produto ${p.nome}?`)) return;
  p.status=p.status==='ativo'?'inativo':'ativo';
  saveDB();
  navigate('produtos');
}

function excluirProduto(id){
  const p=DB.produtos.find(x=>x.id===id);
  if(!p) return;
  if(!confirm(`🚨 ATENÇÃO: Tem certeza que deseja EXCLUIR DEFINITIVAMENTE o produto "${p.nome}"?\n\nEsta ação não pode ser desfeita e removerá o item da lista de estoque.`)) return;
  
  const idx = DB.produtos.findIndex(x=>x.id===id);
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
  if (!currentCaixaDate) currentCaixaDate = today();
  
  function normData(d) {
    if (!d) return '';
    d = String(d).split('T')[0];
    if (d.includes('/')) {
      const p = d.split('/');
      if (p.length === 3) return p[2] + '-' + p[1].padStart(2, '0') + '-' + p[0].padStart(2, '0');
    }
    return d.slice(0, 10);
  }

  const targetDate = normData(currentCaixaDate);
  const vendasHoje = DB.vendas.filter(v => normData(v.data) === targetDate);

  const totEsp=calcOpTotal(vendasHoje,'Espetinho');
  const totBeb=calcOpTotal(vendasHoje,'Bebidas');
  const totalGeral=vendasHoje.reduce((s,v)=>s+v.total,0);
  const custoGeral=vendasHoje.reduce((s,v)=>s+v.custo,0);

  const pagMap={Pix:0,Dinheiro:0,'Cartão Débito':0,'Cartão Crédito':0};
  vendasHoje.forEach(v=>pagMap[v.pagamento]=(pagMap[v.pagamento]||0)+v.total);

  const rankMap={};
  vendasHoje.forEach(v=>v.itens.forEach(i=>rankMap[i.nome]=(rankMap[i.nome]||0)+i.qtd));
  const rank=Object.entries(rankMap).sort((a,b)=>b[1]-a[1]);

  return `
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center gap-2">
      <h2 style="font-family:'Syne',sans-serif;font-size:20px;margin:0">Caixa do Dia</h2>
      <input type="date" id="caixaData" class="form-control" style="width: auto; padding: 4px; font-weight: bold;" value="${currentCaixaDate}" onchange="mudarDataCaixa()">
    </div>
    <button class="btn btn-primary" onclick="imprimirCaixa()">Imprimir</button>
  </div>

  <div class="grid-2 mb-4">
    <div class="card">
      <div class="flex items-center gap-2 mb-3"><span class="op-dot op1"></span><strong style="font-family:'Syne',sans-serif">Espetinho</strong></div>
      <div class="flex justify-between mb-2"><span class="text-muted">Total Vendido</span><span class="mono text-amber">${fmt(totEsp.total)}</span></div>
      <div class="flex justify-between mb-2"><span class="text-muted">Custo Estimado</span><span class="mono text-red">${fmt(totEsp.custo)}</span></div>
      <div class="flex justify-between mb-2"><span class="text-muted">Lucro Bruto</span><span class="mono text-green">${fmt(totEsp.total-totEsp.custo)}</span></div>
      <div class="divider"></div>
      <div class="flex justify-between"><span class="text-muted">Qtd Transações</span><span class="mono">${vendasHoje.filter(v=>v.itens.some(i=>{const p=DB.produtos.find(x=>x.id===i.produtoId);return p?.operacao==='Espetinho'})).length}</span></div>
    </div>
    <div class="card">
      <div class="flex items-center gap-2 mb-3"><span class="op-dot op2"></span><strong style="font-family:'Syne',sans-serif">Bebidas/Bomboniere</strong></div>
      <div class="flex justify-between mb-2"><span class="text-muted">Total Vendido</span><span class="mono text-amber">${fmt(totBeb.total)}</span></div>
      <div class="flex justify-between mb-2"><span class="text-muted">Custo Estimado</span><span class="mono text-red">${fmt(totBeb.custo)}</span></div>
      <div class="flex justify-between mb-2"><span class="text-muted">Lucro Bruto</span><span class="mono text-green">${fmt(totBeb.total-totBeb.custo)}</span></div>
      <div class="divider"></div>
      <div class="flex justify-between"><span class="text-muted">Qtd Transações</span><span class="mono">${vendasHoje.filter(v=>v.itens.some(i=>{const p=DB.produtos.find(x=>x.id===i.produtoId);return p?.operacao==='Bebidas'})).length}</span></div>
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
      <div class="card-title">Itens Vendidos</div>
      ${rank.slice(0,8).map(([n,q])=>`
        <div class="flex justify-between mb-2">
          <span style="font-size:13px">${n}</span><span class="badge amber">${q} un</span>
        </div>`).join('') || '<div class="text-muted">Sem vendas hoje</div>'}
    </div>
  </div>

  <div class="card">
    <div class="flex justify-between items-center mb-3">
      <div class="card-title" style="margin:0">Resumo Geral</div>
    </div>
    <div class="grid-3">
      <div><div class="stat-label">Total Vendido</div><div class="stat-value text-amber">${fmt(totalGeral)}</div></div>
      <div><div class="stat-label">Custo Total</div><div class="stat-value text-red">${fmt(custoGeral)}</div></div>
      <div><div class="stat-label">Lucro Bruto</div><div class="stat-value text-green">${fmt(totalGeral-custoGeral)}</div></div>
    </div>
    ${totalGeral>0?`<div class="progress-bar mt-3"><div class="progress-fill" style="width:${Math.min(100,((totalGeral-custoGeral)/totalGeral*100)).toFixed(0)}%;background:var(--green)"></div></div>
    <div class="text-muted mt-1" style="font-size:12px">Margem bruta: ${((totalGeral-custoGeral)/totalGeral*100).toFixed(1)}%</div>`:''}
  </div>`;
}

function calcOpTotal(vendas,op){
  let total=0,custo=0;
  vendas.forEach(v=>{
    v.itens.forEach(i=>{
      const p=DB.produtos.find(x=>x.id===i.produtoId);
      if(p?.operacao===op){total+=i.subtotal;custo+=i.custo*i.qtd;}
    });
  });
  return {total,custo};
}

function imprimirCaixa(){window.print();}

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
    const p = DB.produtos.find(x => x.id === c.produtoId);
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
   GOOGLE_SHEETS_URL = val;
   localStorage.setItem('convpro_gs_url', val);
   showToast('URL do Google associada com sucesso!', 'success');
   // Sincroniza logo de cara as variáveis para criar as planilhas pra ele
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
      if(remoteDb && remoteDb.produtos && remoteDb.produtos.length >= 0) {
         // Salva dados baixados ignorando o sync original na rodada (pra não subir de volta o vazio enquanto desce)
         DB = remoteDb;
         localStorage.setItem('convpro_db',JSON.stringify(DB));
         showToast('Carga concluída! Atualizando sistema...', 'success');
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
  const venda = DB.vendas.find(v => v.id === vendaId);
  if (venda) {
    imprimirCupom(venda);
  } else {
    showToast('Venda não encontrada.', 'error');
  }
}

function estornarVenda(id){
  if(!confirm('🚨 ATENÇÃO: Tem certeza que deseja estornar e cancelar esta venda? Os produtos voltarão para o estoque e o valor será removido do caixa. Esta ação é irreversível.')) return;
  const idx = DB.vendas.findIndex(v=>v.id===id);
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
  // Se estiver na tela do Dashboard, recarrega
  if(currentPage==='dashboard') {
    document.getElementById('content').innerHTML = renderDashboard();
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
      const idx = currentDB.produtos.findIndex(p => p.id === bp.id);
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