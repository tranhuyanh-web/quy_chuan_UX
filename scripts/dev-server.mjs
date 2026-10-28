/* Máy chủ thử cục bộ: phục vụ site/ và chạy các hàm trong api/ như trên Vercel.
   Dùng: bash build.sh && CHROME_PATH=/đường/dẫn/chrome FX_ALLOW_PRIVATE=1 node scripts/dev-server.mjs */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = +process.env.PORT || 3000;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };

http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  try {
    if (u.pathname.startsWith('/api/')) {
      const name = u.pathname.slice(5).replace(/[^a-z-]/g, '');
      const mod = await import(path.join(root, 'api', name + '.js'));
      return mod.default(req, res);
    }
    let p = path.join(root, 'site', decodeURIComponent(u.pathname));
    if (u.pathname.endsWith('/')) p = path.join(p, 'index.html');
    const data = await readFile(p);
    res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' });
    res.end(data);
  } catch (e) {
    res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Không tìm thấy');
  }
}).listen(PORT, () => console.log(`http://127.0.0.1:${PORT}`));
