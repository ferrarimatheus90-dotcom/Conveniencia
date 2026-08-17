'use strict';

// Servidor HTTP local (127.0.0.1). Serve o app a partir de uma origem fixa
// (http://127.0.0.1:47821) para que localStorage, sessão e cache do Supabase
// continuem funcionando igual à versão web.

const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

function startServer({ root, host = '127.0.0.1', port = 47821 }) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let urlPath = (req.url || '/').split('?')[0];
      if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

      let filePath;
      try {
        filePath = path.normalize(path.join(root, decodeURIComponent(urlPath)));
      } catch {
        res.writeHead(400);
        return res.end('Bad request');
      }
      if (!filePath.startsWith(root)) {
        res.writeHead(403);
        return res.end('Forbidden');
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end('Arquivo não encontrado');
        }
        res.writeHead(200, {
          'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
          'Cache-Control': 'no-store',
        });
        res.end(data);
      });
    });

    server.on('error', reject);
    server.listen(port, host, () => resolve({ server, url: `http://${host}:${port}` }));
  });
}

module.exports = { startServer };
