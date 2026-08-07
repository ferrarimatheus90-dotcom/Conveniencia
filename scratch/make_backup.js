const fs = require('fs');
const https = require('https');
const path = require('path');

const options = {
  hostname: 'ryizqbbjxjrxcortkshv.supabase.co',
  path: '/rest/v1/config_app?select=json_db',
  method: 'GET',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aXpxYmJqeGpyeGNvcnRrc2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDk3MzQsImV4cCI6MjA5MTkyNTczNH0.nhb-bPiPN_q29-LfdrnjtYLq4k38hFwuuYu6bjuDCUM',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aXpxYmJqeGpyeGNvcnRrc2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDk3MzQsImV4cCI6MjA5MTkyNTczNH0.nhb-bPiPN_q29-LfdrnjtYLq4k38hFwuuYu6bjuDCUM'
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      if (data && data[0] && data[0].json_db) {
        const jsonDb = data[0].json_db;
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const yyyy = now.getFullYear();
        const filename = `backup_conveniencia_${dd}-${mm}-${yyyy}.json`;
        
        const path1 = path.join('c:\\Users\\ferra\\.gemini\\antigravity\\scratch\\Conveniencia', filename);
        const path2 = path.join('C:\\Users\\ferra\\Downloads', filename);
        
        const content = JSON.stringify(jsonDb, null, 2);
        fs.writeFileSync(path1, content, 'utf8');
        fs.writeFileSync(path2, content, 'utf8');
        
        console.log(`GERADO_SUCESSO: ${filename}`);
        console.log(`Produtos: ${jsonDb.produtos ? jsonDb.produtos.length : 0}`);
        console.log(`Vendas: ${jsonDb.vendas ? jsonDb.vendas.length : 0}`);
      } else {
        console.error('Resposta invalida do Supabase:', body);
      }
    } catch(e) {
      console.error('Erro de parse:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('Erro de conexao:', e.message);
});

req.end();
