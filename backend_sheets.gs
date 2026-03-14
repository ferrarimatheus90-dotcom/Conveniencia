// ==========================================
// BACKEND GOOGLE SHEETS - CONVENIÊNCIA OLIVEIRA
// ==========================================

function doGet(e) {
  if (!e || !e.parameter) {
    return ContentService.createTextOutput(JSON.stringify({status: "Por favor, não execute esta função diretamente. Use a URL gerada na implantação ou execute configurarPlanilhaInicial()."})).setMimeType(ContentService.MimeType.JSON);
  }
  var action = e.parameter.action;
  
  if (action === 'carregar') {
    var db = {
      produtos: getSheetData('Produtos'),
      vendas: getSheetData('Vendas'),
      producoes: getSheetData('Producoes'),
      consumos: getSheetData('Consumos'),
      compras: getSheetData('Compras'),
      caixas: getSheetData('Caixas'),
      auditoria: getSheetData('Auditoria'),
      mesas_abertas: getSheetData('MesasAbertas'),
      nextId: getSheetConfig('Config', 'nextId') || {produto:9,venda:1,compra:1,producao:1,consumo:1,caixa:1}
    };
    return ContentService.createTextOutput(JSON.stringify(db)).setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === 'carregar_cardapio') {
    var db = {
      produtos: getSheetData('Produtos')
    };
    return ContentService.createTextOutput(JSON.stringify(db)).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'get_pedidos') {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PedidosDigitais');
    if (!sheet) return ContentService.createTextOutput(JSON.stringify({pedidos_novos: []})).setMimeType(ContentService.MimeType.JSON);
    var data = sheet.getDataRange().getValues();
    var pedidos = [];
    for(var i=1; i<data.length; i++){
      if(data[i][4] === 'pendente'){
        var p = {
           id: data[i][0],
           cliente: data[i][1],
           obs: data[i][2],
           status: data[i][4],
           dtAtualizacao: data[i][5]
        };
        try { p.itens = JSON.parse(data[i][6]); } catch(e){ p.itens = []; }
        pedidos.push(p);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({pedidos_novos: pedidos})).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({status: "Servidor Google Sheets Ativo"})).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: "Nenhum dado enviado."})).setMimeType(ContentService.MimeType.JSON);
  }
  try {
    var payload = JSON.parse(e.postData.contents);
    
    if (payload.action === 'sincronizar') {
      var db = payload.db;
      
      // Atualiza todas as planilhas com os dados que vieram do sistema
      setSheetData('Produtos', db.produtos);
      setSheetData('Vendas', db.vendas);
      setSheetData('Producoes', db.producoes);
      setSheetData('Consumos', db.consumos);
      setSheetData('Compras', db.compras);
      setSheetData('Caixas', db.caixas);
      setSheetData('Auditoria', db.auditoria);
      if(db.mesas_abertas) setSheetData('MesasAbertas', db.mesas_abertas);
      setSheetConfig('Config', 'nextId', db.nextId);
      
      return ContentService.createTextOutput(JSON.stringify({success: true, message: "Sincronizado com sucesso!"})).setMimeType(ContentService.MimeType.JSON);
    }

    if (payload.action === 'novo_pedido') {
      var pedido = payload.pedido;
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss.getSheetByName('PedidosDigitais');
      if (!sheet) {
        sheet = ss.insertSheet('PedidosDigitais');
        sheet.appendRow(['id', 'cliente', 'obs', 'itens', 'status', 'dt', '_itens_json']);
        sheet.getRange(1, 1, 1, 7).setBackground('#1a1510').setFontColor('#d4af37').setFontWeight('bold');
      }
      var itensStr = pedido.itens.map(function(item) { return item.qtd + "x " + item.nome; }).join(', ');
      var id = 'ped_' + new Date().getTime();
      sheet.appendRow([id, pedido.cliente, pedido.obs, itensStr, 'pendente', pedido.dtAtualizacao, JSON.stringify(pedido.itens)]);
      
      return ContentService.createTextOutput(JSON.stringify({success: true, message: "Pedido enviado!"})).setMimeType(ContentService.MimeType.JSON);
    }

    if (payload.action === 'marcar_pedidos_recebidos') {
      var ids = payload.ids;
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss.getSheetByName('PedidosDigitais');
      if (sheet) {
        var data = sheet.getDataRange().getValues();
        for(var i=1; i<data.length; i++){
          if(ids.indexOf(data[i][0]) !== -1){
            sheet.getRange(i+1, 5).setValue('recebido');
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
    }

  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

// === FUNÇÕES AUXILIARES DE LEITURA E ESCRITA NAS ABAS ===

function getSheetData(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  
  var headers = data[0];
  var rows = [];
  
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var val = data[i][j];
      if (typeof val === 'string' && (val.indexOf('[') === 0 || val.indexOf('{') === 0)) {
        try { val = JSON.parse(val); } catch(e){}
      }
      obj[headers[j]] = val !== "" ? val : null;
    }
    // Restaura o array de itens a partir da coluna oculta, ignorando a coluna de texto legível
    if (obj['_itens_json']) {
      try { 
        obj.itens = (typeof obj['_itens_json'] === 'string') ? JSON.parse(obj['_itens_json']) : obj['_itens_json']; 
      } catch(e){}
      delete obj['_itens_json'];
    }
    rows.push(obj);
  }
  return rows;
}

function setSheetData(sheetName, rows) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  // Se a aba não existir, cria ela
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  sheet.clear();
  
  if (!rows || rows.length === 0) return;
  
  // Pre-process rows to create readable strings for 'itens' but save JSON in '_itens_json'
  for (var k = 0; k < rows.length; k++) {
    if (rows[k].itens && typeof rows[k].itens === 'object' && Array.isArray(rows[k].itens)) {
      rows[k]['_itens_json'] = JSON.stringify(rows[k].itens);
      rows[k].itens = rows[k].itens.map(function(item) { return item.qtd + "x " + item.nome; }).join(', ');
    }
  }
  
  // Extrai cabeçalhos (pegando as chaves do primeiro objeto)
  var headers = Object.keys(rows[0]);
  var dataRow = [headers];
  
  for (var i = 0; i < rows.length; i++) {
    var rowData = [];
    for (var j = 0; j < headers.length; j++) {
      var val = rows[i][headers[j]];
      // Se for um array ou objeto, converte para string para caber na célula
      if (typeof val === 'object' && val !== null) {
        val = JSON.stringify(val);
      }
      if (val === null || val === undefined) val = "";
      rowData.push(val);
    }
    dataRow.push(rowData);
  }
  
  // Escreve de uma vez só na planilha (muito mais rápido)
  sheet.getRange(1, 1, dataRow.length, dataRow[0].length).setValues(dataRow);
  
  // Opcional: formata a primeira linha como cabeçalho
  sheet.getRange(1, 1, 1, dataRow[0].length).setFontWeight("bold").setBackground("#f3f3f3");
}

function getSheetConfig(sheetName, key) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return null;
  var data = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === key) {
      try { return JSON.parse(data[i][1]); } catch(e) { return data[i][1]; }
    }
  }
  return null;
}

function setSheetConfig(sheetName, key, value) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  
  var data = sheet.getDataRange().getValues();
  var found = false;
  var valStr = typeof value === 'object' ? JSON.stringify(value) : value;
  
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i+1, 2).setValue(valStr);
      found = true;
      break;
    }
  }
  if (!found) {
    sheet.appendRow([key, valStr]);
  }
}

// ==========================================
// FUNÇÃO PARA CRIAR E CONFIGURAR A PLANILHA DO CLIENTE
// ==========================================
function configurarPlanilhaInicial() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var abasConfig = [
    { 
      nome: 'Produtos', 
      headers: ['id', 'nome', 'categoria', 'operacao', 'unidade', 'custo', 'preco', 'estoque', 'estoqueMin', 'status', 'tipo'],
      exemplo: [1, 'Skol 600ml', 'Cerveja', 'Bebidas', 'un', 3.50, 7.00, 24, 10, 'ativo', 'pronto']
    },
    { 
      nome: 'Vendas', 
      headers: ['id', 'data', 'hora', 'tipo', 'pagamento', 'cliente', 'obs', 'total', 'custo', 'itens', 'usuario', 'dt', '_itens_json'],
      exemplo: ['venda_1', '13-03-2026', '14:30', 'Mesa', 'Pix', 'Mesa 04', 'Sem gelo', 14.00, 7.00, '2x Skol 600ml', 'Vendedor', new Date().toISOString(), '[{"nome":"Skol 600ml","qtd":2}]']
    },
    {
      nome: 'MesasAbertas',
      headers: ['cliente', 'obs', 'itens', 'dtAtualizacao', '_itens_json'],
      exemplo: ['Mesa 04', '', '1x Coca-Cola', new Date().toISOString(), '[{"nome":"Coca-Cola","qtd":1}]']
    },
    {
      nome: 'Compras',
      headers: ['id', 'data', 'hora', 'fornecedor', 'itens', 'total', 'usuario', 'dt', '_itens_json'],
      exemplo: ['compra_1', '13-03-2026', '10:00', 'Ambev', '24x Skol', 84.00, 'Admin', '', '[{"nome":"Skol","qtd":24}]']
    },
    {
      nome: 'Caixas',
      headers: ['id', 'openedAt', 'closedAt', 'openedBy', 'closedBy', 'saldoInicial', 'saldoFinal', 'dif', 'vendas', 'dinheiro', 'cartao', 'pix', 'sangrias', 'suprimentos'],
      exemplo: []
    },
    {
      nome: 'Producoes',
      headers: ['id', 'data', 'hora', 'usuario', 'itens', 'notas', 'status', '_itens_json'],
      exemplo: []
    },
    {
      nome: 'Consumos',
      headers: ['id', 'data', 'hora', 'usuario', 'itens', 'motivo', 'dt', '_itens_json'],
      exemplo: []
    },
    {
      nome: 'Auditoria',
      headers: ['id', 'usuario', 'acao', 'detalhes', 'dt'],
      exemplo: []
    },
    {
      nome: 'Config',
      headers: ['Chave', 'Valor'],
      exemplo: ['nextId', '{"produto":9,"venda":1,"compra":1,"producao":1,"consumo":1,"caixa":1}']
    }
  ];

  // Remove abas vazias padrões se existir ('Página1') apenas no fim, para evitar apagar a última
  
  abasConfig.forEach(function(aba) {
    var sheet = ss.getSheetByName(aba.nome);
    if (!sheet) {
      sheet = ss.insertSheet(aba.nome);
    }
    
    // Limpa a página
    sheet.clear();
    
    // Insere o Cabeçalho
    sheet.getRange(1, 1, 1, aba.headers.length).setValues([aba.headers]);
    
    // Formata o Cabeçalho com as cores do logo (Fundo Preto Escuro e Texto Dourado)
    var headerRange = sheet.getRange(1, 1, 1, aba.headers.length);
    headerRange.setBackground('#1a1510'); 
    headerRange.setFontColor('#d4af37'); 
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    
    // Se tiver linha de exemplo, insere
    if (aba.exemplo && aba.exemplo.length > 0) {
      sheet.getRange(2, 1, 1, aba.exemplo.length).setValues([aba.exemplo]);
    }
    
    // Auto-ajusta as colunas para ficar visualmente bonito
    for (var i = 1; i <= aba.headers.length; i++) {
        sheet.autoResizeColumn(i);
    }
  });
  
  // Opcional: Remover "Página1" se ela sobrou em branco
  var sheetPadrao = ss.getSheetByName('Página1') || ss.getSheetByName('Sheet1');
  if (sheetPadrao && ss.getSheets().length > 1) {
    ss.deleteSheet(sheetPadrao);
  }
}
