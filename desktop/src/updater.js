'use strict';

// Atualizador OTA: baixa os arquivos do app direto do GitHub (branch principal).
// Como o sistema é HTML/CSS/JS puro, basta trocar os arquivos - não precisa
// reinstalar nada. O instalador só é refeito se mudar o próprio shell Electron.

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const https = require('https');

const UA = 'ConvenienciaOliveiraDesktop';

function request(url, { json = false, timeout = 20000 } = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { 'User-Agent': UA, Accept: json ? 'application/vnd.github+json' : '*/*' } },
      (res) => {
        // segue redirecionamentos (raw.githubusercontent às vezes redireciona)
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          resolve(request(res.headers.location, { json, timeout }));
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode} em ${url}`));
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const buf = Buffer.concat(chunks);
          if (!json) return resolve(buf);
          try {
            resolve(JSON.parse(buf.toString('utf8')));
          } catch (e) {
            reject(new Error('Resposta inválida do GitHub'));
          }
        });
      }
    );
    req.setTimeout(timeout, () => req.destroy(new Error('Tempo esgotado ao contatar o GitHub')));
    req.on('error', reject);
  });
}

class Updater {
  /**
   * @param {object} opts
   * @param {object} opts.config     conteúdo de config.json
   * @param {string} opts.webappDir  pasta gravável onde o app roda
   * @param {string} opts.bundledDir pasta somente-leitura que veio no instalador
   * @param {string} opts.stateFile  json com o estado da última atualização
   */
  constructor({ config, webappDir, bundledDir, stateFile }) {
    this.cfg = config;
    this.webappDir = webappDir;
    this.bundledDir = bundledDir;
    this.stateFile = stateFile;
    this.state = { sha: null, files: {}, updatedAt: null };
  }

  get repoBase() {
    const g = this.cfg.github;
    return `https://api.github.com/repos/${g.owner}/${g.repo}`;
  }

  async loadState() {
    try {
      this.state = JSON.parse(await fsp.readFile(this.stateFile, 'utf8'));
      this.state.files = this.state.files || {};
    } catch {
      /* primeira execução */
    }
    return this.state;
  }

  async saveState() {
    await fsp.mkdir(path.dirname(this.stateFile), { recursive: true });
    await fsp.writeFile(this.stateFile, JSON.stringify(this.state, null, 2), 'utf8');
  }

  /** Copia os arquivos que vieram no instalador para a pasta gravável (1ª execução). */
  async ensureWebapp() {
    const index = path.join(this.webappDir, 'index.html');
    if (fs.existsSync(index)) return;
    await fsp.mkdir(this.webappDir, { recursive: true });
    await fsp.cp(this.bundledDir, this.webappDir, { recursive: true });
  }

  isAllowed(p) {
    if (p.includes('..')) return false;
    return this.cfg.update.paths.some((a) => (a.endsWith('/') ? p.startsWith(a) : p === a));
  }

  /**
   * Verifica e aplica atualizações.
   * @param {(msg: string, pct: number|null) => void} onProgress
   * @returns {Promise<{updated:boolean, sha:string|null, changed:number, offline:boolean, error?:string}>}
   */
  async check(onProgress = () => {}) {
    const g = this.cfg.github;
    try {
      onProgress('Procurando atualizações...', null);
      const commit = await request(`${this.repoBase}/commits/${g.branch}`, { json: true });
      const sha = commit.sha;

      if (sha === this.state.sha) {
        return { updated: false, sha, changed: 0, offline: false };
      }

      const tree = await request(`${this.repoBase}/git/trees/${sha}?recursive=1`, { json: true });
      const maxBytes = (this.cfg.update.maxFileSizeMB || 25) * 1024 * 1024;

      const wanted = (tree.tree || []).filter(
        (n) => n.type === 'blob' && this.isAllowed(n.path) && (n.size || 0) <= maxBytes
      );
      if (!wanted.length) throw new Error('Nenhum arquivo do app encontrado no repositório');

      const stale = wanted.filter((n) => this.state.files[n.path] !== n.sha || !fs.existsSync(path.join(this.webappDir, n.path)));

      if (!stale.length) {
        // Só mudaram arquivos fora do app (docs, backups...). Marca como atualizado.
        this.state.sha = sha;
        this.state.updatedAt = new Date().toISOString();
        await this.saveState();
        return { updated: false, sha, changed: 0, offline: false };
      }

      // Baixa tudo para .tmp antes de aplicar, para não deixar o app pela metade.
      const tmpDir = path.join(this.webappDir, '.update-tmp');
      await fsp.rm(tmpDir, { recursive: true, force: true });
      await fsp.mkdir(tmpDir, { recursive: true });

      let done = 0;
      for (const node of stale) {
        onProgress(
          `Baixando ${node.path} (${done + 1}/${stale.length})`,
          Math.round((done / stale.length) * 100)
        );
        const url = `https://raw.githubusercontent.com/${g.owner}/${g.repo}/${sha}/${node.path
          .split('/')
          .map(encodeURIComponent)
          .join('/')}`;
        const data = await request(url);
        const dest = path.join(tmpDir, node.path);
        await fsp.mkdir(path.dirname(dest), { recursive: true });
        await fsp.writeFile(dest, data);
        done++;
      }

      onProgress('Aplicando atualização...', 100);
      for (const node of stale) {
        const from = path.join(tmpDir, node.path);
        const to = path.join(this.webappDir, node.path);
        await fsp.mkdir(path.dirname(to), { recursive: true });
        await fsp.copyFile(from, to);
        this.state.files[node.path] = node.sha;
      }
      await fsp.rm(tmpDir, { recursive: true, force: true });

      // Remove do estado arquivos que não existem mais no repositório
      const validPaths = new Set(wanted.map((n) => n.path));
      for (const p of Object.keys(this.state.files)) {
        if (!validPaths.has(p)) delete this.state.files[p];
      }

      this.state.sha = sha;
      this.state.updatedAt = new Date().toISOString();
      await this.saveState();

      return { updated: true, sha, changed: stale.length, offline: false };
    } catch (err) {
      // Sem internet / GitHub fora do ar: segue com a cópia local.
      return {
        updated: false,
        sha: this.state.sha,
        changed: 0,
        offline: true,
        error: err.message,
      };
    }
  }
}

module.exports = { Updater };
