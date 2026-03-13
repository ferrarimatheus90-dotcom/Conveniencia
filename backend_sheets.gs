// ==========================================
// BACKEND GOOGLE SHEETS - CONVENIÊNCIA OLIVEIRA
// ==========================================

function doGet(e) {
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
  
  return ContentService.createTextOutput(JSON.stringify({status: "Servidor Google Sheets Ativo"})).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
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
      // Tenta converter strings JSON de volta para array/objeto (ex: itens da venda)
      if (typeof val === 'string' && (val.indexOf('[') === 0 || val.indexOf('{') === 0)) {
        try { val = JSON.parse(val); } catch(e){}
      }
      obj[headers[j]] = val !== "" ? val : null;
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
  
  // Extrai cabeçalhos (pegando as chaves do primeiro objeto)
  var headers = Object.keys(rows[0]);
  var dataRow = [headers];
  
  for (var i = 0; i < rows.length; i++) {
    var rowData = [];
    for (var j = 0; j < headers.length; j++) {
      var val = rows[i][headers[j]];
      // Se for um array ou objeto, converte para string para caber na célula (ex: os itens do carrinho)
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
      headers: ['id', 'data', 'hora', 'tipo', 'pagamento', 'cliente', 'obs', 'total', 'custo', 'itens', 'usuario', 'dt'],
      exemplo: ['venda_1', '13-03-2026', '14:30', 'Mesa', 'Pix', 'Mesa 04', 'Sem gelo', 14.00, 7.00, '[{"nome":"Skol 600ml","qtd":2}]', 'Vendedor', new Date().toISOString()]
    },
    {
      nome: 'MesasAbertas',
      headers: ['cliente', 'obs', 'itens', 'dtAtualizacao'],
      exemplo: ['Mesa 04', '', '[{"nome":"Coca-Cola","qtd":1}]', new Date().toISOString()]
    },
    {
      nome: 'Compras',
      headers: ['id', 'data', 'hora', 'fornecedor', 'itens', 'total', 'usuario', 'dt'],
      exemplo: ['compra_1', '13-03-2026', '10:00', 'Ambev', '[{"nome":"Skol","qtd":24}]', 84.00, 'Admin', '']
    },
    {
      nome: 'Caixas',
      headers: ['id', 'openedAt', 'closedAt', 'openedBy', 'closedBy', 'saldoInicial', 'saldoFinal', 'dif', 'vendas', 'dinheiro', 'cartao', 'pix', 'sangrias', 'suprimentos'],
      exemplo: []
    },
    {
      nome: 'Producoes',
      headers: ['id', 'data', 'hora', 'usuario', 'itens', 'notas', 'status'],
      exemplo: []
    },
    {
      nome: 'Consumos',
      headers: ['id', 'data', 'hora', 'usuario', 'itens', 'motivo', 'dt'],
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
