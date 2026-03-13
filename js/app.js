// ===================== DATA STORE =====================
const USERS = [
  {id:1,username:'admin',password:'admin123',role:'admin',name:'Administrador'},
  {id:2,username:'vendedor',password:'venda123',role:'funcionario',name:'Vendedor'}
];

let DB = JSON.parse(localStorage.getItem('convpro_db') || 'null') || {
  produtos: [
    {id:1,nome:'Espetinho de Frango',categoria:'Espetinho',operacao:'Espetinho',unidade:'un',custo:3.5,preco:8,estoque:0,estoqueMin:5,status:'ativo',tipo:'produzido'},
    {id:2,nome:'Espetinho de Carne',categoria:'Espetinho',operacao:'Espetinho',unidade:'un',custo:4,preco:9,estoque:0,estoqueMin:5,status:'ativo',tipo:'produzido'},
    {id:3,nome:'Caldinho de Feijão',categoria:'Caldinho',operacao:'Espetinho',unidade:'un',custo:2.5,preco:6,estoque:0,estoqueMin:3,status:'ativo',tipo:'produzido'},
    {id:4,nome:'Coca-Cola Lata',categoria:'Refrigerante',operacao:'Bebidas',unidade:'un',custo:2.5,preco:5,estoque:24,estoqueMin:12,status:'ativo',tipo:'pronto'},
    {id:5,nome:'Skol 600ml',categoria:'Cerveja',operacao:'Bebidas',unidade:'un',custo:3.5,preco:7,estoque:18,estoqueMin:10,status:'ativo',tipo:'pronto'},
    {id:6,nome:'Red Bull',categoria:'Energético',operacao:'Bebidas',unidade:'un',custo:8,preco:15,estoque:10,estoqueMin:4,status:'ativo',tipo:'pronto'},
    {id:7,nome:'Pipus Salgado',categoria:'Salgados',operacao:'Bebidas',unidade:'un',custo:1.5,preco:3,estoque:30,estoqueMin:10,status:'ativo',tipo:'pronto'},
    {id:8,nome:'Bala Fini',categoria:'Doces',operacao:'Bebidas',unidade:'pct',custo:0.8,preco:2,estoque:50,estoqueMin:20,status:'ativo',tipo:'pronto'},
  ],
  vendas: [],
  compras: [],
  producoes: [],
  consumos: [],
  caixas: [],
  auditoria: [],
  nextId: {produto:9,venda:1,compra:1,producao:1,consumo:1,caixa:1}
};

let currentUser = null;
let currentPage = 'dashboard';
let GOOGLE_SHEETS_URL = localStorage.getItem('convpro_gs_url') || '';

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

function auditLog(acao,detalhes){
  DB.auditoria.push({id:Date.now(),usuario:currentUser?.name,acao,detalhes,dt:new Date().toISOString()});
  saveDB();
}

// ===================== AUTH =====================
function doLogin(){
  const u=document.getElementById('loginUser').value.trim();
  const p=document.getElementById('loginPass').value;
  const user=USERS.find(x=>x.username===u&&x.password===p);
  if(!user){document.getElementById('loginError').style.display='block';return}
  currentUser=user;
  document.getElementById('loginError').style.display='none';
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('app').style.display='flex';
  document.getElementById('sidebarUser').textContent=user.name+' · '+user.role;
  buildSidebar();
  updateDate();
  setInterval(updateDate,60000);
  navigate('dashboard');
  auditLog('LOGIN','Acesso ao sistema');
}

function doLogout(){
  auditLog('LOGOUT','Saiu do sistema');
  currentUser=null;
  document.getElementById('loginScreen').style.display='flex';
  document.getElementById('app').style.display='none';
  document.getElementById('loginUser').value='';
  document.getElementById('loginPass').value='';
}

function updateDate(){
  const d=new Date();
  document.getElementById('topbarDate').textContent=
    d.toLocaleDateString('pt-BR')+' '+d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
}

// ===================== SIDEBAR =====================
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
  {id:'usuarios',icon:'👥',label:'Usuários'},
  {section:'Relatórios'},
  {id:'relatorios',icon:'📈',label:'Relatórios'},
  {id:'auditoria',icon:'🔍',label:'Auditoria'},
  {section:'Sistema'},
  {id:'backup',icon:'💾',label:'Backup'},
];
const NAV_FUNC = [
  {section:'Venda'},
  {id:'vendas',icon:'🛒',label:'Registrar Venda'},
];

function buildSidebar(){
  const nav=currentUser.role==='admin'?NAV_ADMIN:NAV_FUNC;
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
function today(){return new Date().toISOString().slice(0,10)}
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
  const vendasHoje=DB.vendas.filter(v=>v.data===today());
  const totalHoje=vendasHoje.reduce((s,v)=>s+v.total,0);
  const custoHoje=vendasHoje.reduce((s,v)=>s+v.custo,0);
  const lucroHoje=totalHoje-custoHoje;
  const totalVendasMes=DB.vendas.filter(v=>v.data.slice(0,7)===today().slice(0,7)).reduce((s,v)=>s+v.total,0);

  const produtosAlerta=DB.produtos.filter(p=>p.status==='ativo'&&p.estoque<=p.estoqueMin);

  const rankMap={};
  vendasHoje.forEach(v=>v.itens.forEach(i=>{
    rankMap[i.nome]=(rankMap[i.nome]||0)+i.qtd;
  }));
  const rank=Object.entries(rankMap).sort((a,b)=>b[1]-a[1]).slice(0,5);

  const vendasEsp=vendasHoje.filter(v=>v.operacao==='Espetinho'||v.itens.some(i=>{const p=DB.produtos.find(x=>x.id===i.produtoId);return p?.operacao==='Espetinho'}));
  const vendasBeb=vendasHoje.filter(v=>!vendasEsp.includes(v));
  const totEsp=vendasHoje.reduce((s,v)=>s+v.itens.filter(i=>{const p=DB.produtos.find(x=>x.id===i.produtoId);return p?.operacao==='Espetinho'}).reduce((a,i)=>a+i.subtotal,0),0);
  const totBeb=vendasHoje.reduce((s,v)=>s+v.itens.filter(i=>{const p=DB.produtos.find(x=>x.id===i.produtoId);return p?.operacao==='Bebidas'}).reduce((a,i)=>a+i.subtotal,0),0);

  return `
  ${produtosAlerta.length?`<div class="alert warning">⚠️ ${produtosAlerta.length} produto(s) com estoque baixo: ${produtosAlerta.map(p=>p.nome).join(', ')}</div>`:''}
  <div class="grid-4 mb-4">
    <div class="stat-card amber">
      <div class="stat-label">Vendas Hoje</div>
      <div class="stat-value text-amber">${fmt(totalHoje)}</div>
      <div class="stat-sub">${vendasHoje.length} transações</div>
    </div>
    <div class="stat-card green">
      <div class="stat-label">Lucro Bruto</div>
      <div class="stat-value text-green">${fmt(lucroHoje)}</div>
      <div class="stat-sub">Margem: ${totalHoje?((lucroHoje/totalHoje)*100).toFixed(1):0}%</div>
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
          <td><button class="btn btn-ghost btn-sm" onclick="reimprimirVenda(${v.id})" title="Imprimir Cupom">🖨️</button></td>
        </tr>`).join('')}
      </tbody>
    </table></div>`:''}
  </div>`;
}

// ===================== QR CODE CARDÁPIO =====================
function gerarQRCodeMesa(){
  const mesas = [1,2,3,4,5,6,7,8,9,10];
  const currentUrl = window.location.href.split('index.html')[0] + 'cardapio.html';
  
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
            const link = currentUrl + '?mesa=' + m;
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
        <div class="flex items-center gap-2 mb-3">
          <button class="btn btn-ghost btn-sm ${selectedOp==='todos'?'btn-primary':''}" onclick="filterOp('todos')">Todos</button>
          <button class="btn btn-ghost btn-sm ${selectedOp==='Espetinho'?'':''}">
          </button>
        </div>
        <div class="flex gap-2 mb-3">
          <button class="btn btn-ghost btn-sm" onclick="filterOp('todos')" id="opBtn-todos">Todos</button>
          <button class="btn btn-ghost btn-sm" onclick="filterOp('Espetinho')" id="opBtn-Espetinho">🔥 Espetinho</button>
          <button class="btn btn-ghost btn-sm" onclick="filterOp('Bebidas')" id="opBtn-Bebidas">🍺 Bebidas</button>
        </div>
        <div class="produto-grid" id="produtoGrid"></div>
      </div>
    </div>
    <div>
      <div class="card mb-3">
        <div class="card-title">🛒 Carrinho</div>
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
            <label class="form-label">Pagamento</label>
            <select class="form-control" id="vendaPag">
              <option>Pix</option><option>Dinheiro</option>
              <option>Cartão Débito</option><option>Cartão Crédito</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Observação</label>
          <input class="form-control" id="vendaObs" placeholder="opcional">
        </div>
        <div class="form-group flex items-center" style="gap:8px; margin-bottom: 12px; cursor: pointer;" onclick="document.getElementById('vendaImprimir').click()">
          <input type="checkbox" id="vendaImprimir" checked style="cursor: pointer; transform: scale(1.1);" onclick="event.stopPropagation()">
          <label for="vendaImprimir" style="margin:0; cursor: pointer; user-select: none; font-size: 13px;">Imprimir comprovante (80mm)</label>
        </div>
        <button class="btn btn-primary" style="width:100%;padding:13px;font-size:15px" onclick="finalizarVenda()">✅ Finalizar Venda</button>
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

function finalizarVenda(){
  if(cart.length===0){showToast('Carrinho vazio!','error');return;}
  const tipo=document.getElementById('vendaTipo')?.value;
  const pag=document.getElementById('vendaPag')?.value;
  const obs=escapeHTML(document.getElementById('vendaObs')?.value);
  const total=cart.reduce((s,i)=>s+i.preco*i.qtd,0);
  const custo=cart.reduce((s,i)=>s+i.custo*i.qtd,0);
  const venda={
    id:uid('venda'),data:today(),hora:new Date().toLocaleTimeString('pt-BR'),
    tipo,pagamento:pag,obs,total,custo,
    itens:cart.map(i=>({produtoId:i.produtoId,nome:i.nome,preco:i.preco,custo:i.custo,qtd:i.qtd,subtotal:i.preco*i.qtd})),
    usuario:currentUser.name,dt:new Date().toISOString()
  };
  // baixar estoque
  cart.forEach(item=>{
    const p=DB.produtos.find(x=>x.id===item.produtoId);
    if(p&&p.tipo==='pronto')p.estoque=Math.max(0,p.estoque-item.qtd);
  });
  DB.vendas.push(venda);
  saveDB();
  auditLog('VENDA',`#${venda.id} – ${fmt(total)} – ${pag}`);
  showToast('Venda registrada com sucesso! '+fmt(total),'success');
  
  if (document.getElementById('vendaImprimir')?.checked) {
    imprimirCupom(venda);
  }
  
  cart=[];
  updateCart();
  document.getElementById('vendaObs').value='';
}

// ===================== PRODUÇÃO =====================
function renderProducao(){
  const produzidos=DB.produtos.filter(p=>p.tipo==='produzido'&&p.status==='ativo');
  
  // calcular saldos do dia
  const hoje=today();
  const vendasHoje=DB.vendas.filter(v=>v.data===hoje);
  
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
        <thead><tr><th>Produto</th><th>Saldo Inicial</th><th>Produzido Hoje</th><th>Disponível</th><th>Vendido</th><th>Sobra Final</th></tr></thead>
        <tbody>${rows.map(r=>`
          <tr>
            <td><strong>${r.p.nome}</strong></td>
            <td class="mono">${r.saldoInicial}</td>
            <td class="mono text-green">${r.prodHoje}</td>
            <td class="mono text-amber">${r.disponivel}</td>
            <td class="mono text-blue">${r.vendHoje}</td>
            <td class="mono ${r.sobra<r.p.estoqueMin?'text-red':''}">${r.sobra}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Histórico de Produções</div>
    ${DB.producoes.length===0?'<div class="empty-state"><div class="icon">🔥</div>Nenhuma produção registrada</div>':''}
    ${DB.producoes.length?`<div class="table-wrap"><table>
      <thead><tr><th>Data</th><th>Produto</th><th>Quantidade</th><th>Usuário</th><th>Obs</th></tr></thead>
      <tbody>${DB.producoes.slice(-30).reverse().map(p=>`
        <tr>
          <td>${fmtDate(p.data)}</td>
          <td>${p.produto}</td>
          <td class="mono text-green">${p.qtd}</td>
          <td>${p.usuario}</td>
          <td class="text-muted">${p.obs||'-'}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>`:''}
  </div>`;
}

function modalProducao(){
  const prods=DB.produtos.filter(p=>p.tipo==='produzido'&&p.status==='ativo');
  openModal(`
    <div class="modal-title">🔥 Registrar Produção</div>
    <div class="form-group">
      <label class="form-label">Produto</label>
      <select class="form-control" id="mpProd">
        ${prods.map(p=>`<option value="${p.id}">${p.nome}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Quantidade Produzida</label>
      <input type="number" class="form-control" id="mpQtd" value="10" min="1">
    </div>
    <div class="form-group">
      <label class="form-label">Observação</label>
      <input class="form-control" id="mpObs" placeholder="opcional">
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="salvarProducao()">Salvar</button>
    </div>`);
}

function salvarProducao(){
  const pid=parseInt(document.getElementById('mpProd').value);
  const qtd=parseInt(document.getElementById('mpQtd').value)||0;
  const obs=escapeHTML(document.getElementById('mpObs').value);
  if(!qtd){showToast('Informe a quantidade','error');return;}
  const p=DB.produtos.find(x=>x.id===pid);
  const prod={id:uid('producao'),produtoId:pid,produto:p.nome,qtd,obs,data:today(),usuario:currentUser.name,dt:new Date().toISOString()};
  DB.producoes.push(prod);
  p.estoque+=qtd;
  saveDB();
  auditLog('PRODUCAO',`${p.nome} – ${qtd} un`);
  closeModal();
  showToast(`Produção registrada: ${qtd} ${p.nome}`,'success');
  navigate('producao');
}

// ===================== CONSUMO INTERNO =====================
function renderConsumo(){
  return `
  <div class="section-header">
    <div></div>
    <button class="btn btn-primary" onclick="modalConsumo()">+ Registrar Saída</button>
  </div>
  <div class="card">
    <div class="card-title">Histórico de Consumo/Saídas Não Comerciais</div>
    ${DB.consumos.length===0?'<div class="empty-state"><div class="icon">📦</div>Nenhuma saída registrada</div>':''}
    ${DB.consumos.length?`<div class="table-wrap"><table>
      <thead><tr><th>Data</th><th>Produto</th><th>Qtd</th><th>Motivo</th><th>Operação</th><th>Usuário</th></tr></thead>
      <tbody>${DB.consumos.slice(-30).reverse().map(c=>`
        <tr>
          <td>${fmtDate(c.data)}</td>
          <td>${c.produto}</td>
          <td class="mono text-red">-${c.qtd}</td>
          <td><span class="badge amber">${c.motivo}</span></td>
          <td>${opTag(c.operacao)}</td>
          <td>${c.usuario}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>`:''}
  </div>`;
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
  const c={id:uid('consumo'),produtoId:pid,produto:p.nome,qtd,motivo,obs,operacao:p.operacao,data:today(),usuario:currentUser.name,dt:new Date().toISOString()};
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
  <div class="tabs">
    <div class="tab active" onclick="estoqueTab(this,'todos')">Todos (${prods.length})</div>
    <div class="tab" onclick="estoqueTab(this,'Espetinho')">🔥 Espetinho</div>
    <div class="tab" onclick="estoqueTab(this,'Bebidas')">🍺 Bebidas</div>
    <div class="tab" onclick="estoqueTab(this,'baixo')">⚠️ Baixo (${baixo.length})</div>
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
          <td><button class="btn btn-ghost btn-sm" onclick="verCompra(${c.id})">Ver</button></td>
        </tr>`).join('')}
      </tbody>
    </table></div>`:''}
  </div>`;
}

let compraItens=[];

function modalCompra(){
  compraItens=[];
  openModal(`
    <div class="modal-title">🧾 Registrar Compra</div>
    <div class="form-row cols-2 mb-3">
      <div class="form-group" style="margin:0">
        <label class="form-label">Fornecedor</label>
        <input class="form-control" id="cpFornec" placeholder="Nome do fornecedor">
      </div>
      <div class="form-group" style="margin:0">
        <label class="form-label">Data</label>
        <input type="date" class="form-control" id="cpData" value="${today()}">
      </div>
    </div>
    <div class="form-row cols-2 mb-3">
      <div class="form-group" style="margin:0">
        <label class="form-label">Operação</label>
        <select class="form-control" id="cpOp">
          <option>Espetinho</option><option>Bebidas</option>
        </select>
      </div>
      <div class="form-group" style="margin:0">
        <label class="form-label">Pagamento</label>
        <select class="form-control" id="cpPag">
          <option>Pix</option><option>Dinheiro</option><option>Cartão Débito</option><option>Cartão Crédito</option>
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
      <input class="form-control" id="cpObs" placeholder="opcional">
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="salvarCompra()">Salvar Compra</button>
    </div>`);
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

function salvarCompra(){
  if(compraItens.length===0){showToast('Adicione pelo menos um item','error');return;}
  const fornec=escapeHTML(document.getElementById('cpFornec').value||'Sem fornecedor');
  const data=document.getElementById('cpData').value||today();
  const op=document.getElementById('cpOp').value;
  const pag=document.getElementById('cpPag').value;
  const obs=escapeHTML(document.getElementById('cpObs').value);
  const total=compraItens.reduce((s,i)=>s+i.total,0);
  const compra={id:uid('compra'),fornecedor:fornec,data,operacao:op,pagamento:pag,obs,total,itens:compraItens,usuario:currentUser.name,dt:new Date().toISOString()};
  // atualizar estoque e custo
  compraItens.forEach(item=>{
    const p=DB.produtos.find(x=>x.id===item.produtoId);
    if(p){p.estoque+=item.qtd;p.custo=item.custo;}
  });
  DB.compras.push(compra);
  saveDB();
  auditLog('COMPRA',`${fornec} – ${fmt(total)}`);
  closeModal();
  showToast('Compra registrada! '+fmt(total),'success');
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
  <div class="card">
    <div class="table-wrap">
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
              <button class="btn btn-ghost btn-sm" onclick="modalProduto(${p.id})">✏️</button>
              <button class="btn btn-danger btn-sm" onclick="toggleProduto(${p.id})">${p.status==='ativo'?'⛔':'✅'}</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
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
    estoque:parseInt(document.getElementById('ppEstoque').value)||0,
    estoqueMin:parseInt(document.getElementById('ppMin').value)||0,
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
function renderCaixa(){
  const vendasHoje=DB.vendas.filter(v=>v.data===today());

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
    <h2 style="font-family:'Syne',sans-serif;font-size:20px">🏦 Fechamento – ${new Date().toLocaleDateString('pt-BR')}</h2>
    <button class="btn btn-primary" onclick="imprimirCaixa()">🖨️ Imprimir</button>
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
      <div class="card-title">💳 Por Forma de Pagamento</div>
      ${Object.entries(pagMap).map(([k,v])=>`
        <div class="flex justify-between mb-2">
          <span>${k}</span><span class="mono text-amber">${fmt(v)}</span>
        </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-title">📦 Itens Vendidos</div>
      ${rank.slice(0,8).map(([n,q])=>`
        <div class="flex justify-between mb-2">
          <span style="font-size:13px">${n}</span><span class="badge amber">${q} un</span>
        </div>`).join('') || '<div class="text-muted">Sem vendas hoje</div>'}
    </div>
  </div>

  <div class="card">
    <div class="flex justify-between items-center mb-3">
      <div class="card-title" style="margin:0">📊 Resumo Geral</div>
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
    if(periodo==='hoje')return v.data===hoje;
    if(periodo==='semana')return d>=semanaAgo;
    if(periodo==='mes')return v.data.slice(0,7)===hoje.slice(0,7);
    return true;
  });

  const totalVendas=vendas.reduce((s,v)=>s+v.total,0);
  const custo=vendas.reduce((s,v)=>s+v.custo,0);
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
    <button class="btn btn-ghost" onclick="window.print()">🖨️ Imprimir</button>
  </div>

  <div class="grid-3 mb-4">
    <div class="stat-card amber"><div class="stat-label">Total Vendas</div><div class="stat-value text-amber">${fmt(totalVendas)}</div><div class="stat-sub">${vendas.length} transações</div></div>
    <div class="stat-card red"><div class="stat-label">Custo Total</div><div class="stat-value text-red">${fmt(custo)}</div></div>
    <div class="stat-card green"><div class="stat-label">Lucro Bruto</div><div class="stat-value text-green">${fmt(lucro)}</div><div class="stat-sub">Margem: ${totalVendas?((lucro/totalVendas)*100).toFixed(1):0}%</div></div>
  </div>

  <div class="grid-2 mb-4">
    <div class="card">
      <div class="card-title">📍 Por Tipo de Venda</div>
      ${Object.entries(tipoMap).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`
        <div class="flex justify-between mb-2">
          <span>${k}</span><span class="mono text-amber">${fmt(v)}</span>
        </div>`).join('') || '<div class="text-muted">Sem dados</div>'}
    </div>
    <div class="card">
      <div class="card-title">💳 Por Pagamento</div>
      ${Object.entries(pagMap2).map(([k,v])=>`
        <div class="flex justify-between mb-2">
          <span>${k}</span><span class="mono text-blue">${fmt(v)}</span>
        </div>`).join('') || '<div class="text-muted">Sem dados</div>'}
    </div>
  </div>

  <div class="grid-2 mb-4">
    <div class="card">
      <div class="card-title">🏆 Ranking de Produtos</div>
      ${Object.entries(rankAll).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([n,q],i)=>`
        <div class="flex justify-between mb-2">
          <span style="font-size:13px">${i+1}. ${n}</span><span class="badge ${i===0?'amber':i===1?'blue':'green'}">${q} un</span>
        </div>`).join('') || '<div class="text-muted">Sem dados</div>'}
    </div>
    <div class="card">
      <div class="card-title">🧾 Investimento em Compras</div>
      <div class="flex justify-between mb-2"><span>Total Geral</span><span class="mono text-amber">${fmt(totalCompras)}</span></div>
      <div class="flex justify-between mb-2"><span>🔥 Espetinho</span><span class="mono text-op1">${fmt(comprasEsp)}</span></div>
      <div class="flex justify-between mb-2"><span>🍺 Bebidas</span><span class="mono text-blue">${fmt(comprasBeb)}</span></div>
      <div class="divider"></div>
      <div class="flex justify-between"><span class="text-muted">Nº de compras</span><span class="mono">${DB.compras.length}</span></div>
    </div>
  </div>

  <div class="card mb-4">
    <div class="card-title">📋 Consumo Interno</div>
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
    </div>
  </div>`;
}

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
  downloadAnchorNode.setAttribute("download", "conveniencia_oliveira_backup_" + new Date().toISOString().slice(0,10) + ".json");
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
  const cnpj = "00.000.000/0001-00"; 
  const endereco = "Endereço da Loja, 123"; 
  const telefone = "(00) 0000-0000";

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