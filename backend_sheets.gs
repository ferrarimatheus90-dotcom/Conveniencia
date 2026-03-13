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
