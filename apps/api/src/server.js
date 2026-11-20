/**
 * PhishNet REST API Server (Node.js)
 * Port: 3000
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../../');

const scenariosPath = path.join(ROOT_DIR, 'data/fixtures/scenarios.json');
const scenarios = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/v1/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      version: '1.0.0',
      network: 'Circle Arc Testnet',
      chainId: '5042002',
      engine: 'deterministic-policy-v1',
      mode: process.env.PHISHNET_MODE || 'enforcement'
    }));
    return;
  }

  if (url.pathname === '/v1/scenarios') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(scenarios));
    return;
  }

  // Serve static UI if requested
  if (url.pathname === '/' || url.pathname === '/index.html') {
    const indexPath = path.join(ROOT_DIR, 'apps/web/index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(indexPath, 'utf8'));
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`PhishNet API server running on http://127.0.0.1:${PORT}`);
});
