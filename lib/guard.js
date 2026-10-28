/* Kiểm soát an toàn cho các hàm đọc trang: chỉ http/https, chặn mạng nội bộ,
   chỉ nhận yêu cầu từ chính trang (hoặc kèm khóa kiểm thử). */
import { lookup } from 'node:dns/promises';
import net from 'node:net';

export const MAX_HTML = 3 * 1024 * 1024;

const PRIVATE_V4 = [
  ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8], ['169.254.0.0', 16],
  ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.168.0.0', 16], ['198.18.0.0', 15], ['224.0.0.0', 4], ['240.0.0.0', 4],
];
const v4num = (ip) => ip.split('.').reduce((a, b) => (a << 8) + (+b), 0) >>> 0;
function isPrivateV4(ip) {
  const n = v4num(ip);
  return PRIVATE_V4.some(([base, bits]) => (n >>> (32 - bits)) === (v4num(base) >>> (32 - bits)));
}
export function isPrivateIp(ip) {
  if (net.isIPv4(ip)) return isPrivateV4(ip);
  const x = ip.toLowerCase();
  if (x === '::' || x === '::1') return true;
  if (x.startsWith('fc') || x.startsWith('fd') || x.startsWith('fe8') || x.startsWith('fe9') || x.startsWith('fea') || x.startsWith('feb')) return true;
  const m = x.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (m) return isPrivateV4(m[1]);
  return false;
}

const allowPrivate = () => process.env.FX_ALLOW_PRIVATE === '1';
const dnsCache = new Map();
export async function hostIsPublic(host) {
  if (allowPrivate()) return true;
  const h = host.replace(/^\[|\]$/g, '');
  if (/^localhost$/i.test(h) || h.endsWith('.local') || h.endsWith('.internal')) return false;
  if (net.isIP(h)) return !isPrivateIp(h);
  if (dnsCache.has(h)) return dnsCache.get(h);
  try {
    const addrs = await lookup(h, { all: true });
    const ok = addrs.length > 0 && addrs.every((a) => !isPrivateIp(a.address));
    dnsCache.set(h, ok);
    return ok;
  } catch (e) {
    return false;
  }
}

/* Chuẩn hóa và kiểm tra đường dẫn người dùng nhập. Trả về URL hoặc ném lỗi tiếng Việt. */
export async function checkUrl(raw) {
  let s = String(raw || '').trim();
  if (!s) throw new UserError('Nhập đường dẫn trang đăng ký');
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) s = 'https://' + s;
  let u;
  try { u = new URL(s); } catch (e) { throw new UserError('Đường dẫn chưa đúng định dạng, ví dụ: https://tencuocthi.vn/dang-ky'); }
  if (!/^https?:$/.test(u.protocol)) throw new UserError('Chỉ hỗ trợ đường dẫn bắt đầu bằng http:// hoặc https://');
  if (u.username || u.password) throw new UserError('Đường dẫn không được chứa tên đăng nhập hoặc mật khẩu');
  if (u.port && !['80', '443'].includes(u.port) && !allowPrivate()) throw new UserError('Chỉ hỗ trợ cổng web tiêu chuẩn (80, 443)');
  if (!(await hostIsPublic(u.hostname))) throw new UserError('Không thể đọc địa chỉ nội bộ hoặc không tồn tại. Kiểm tra lại tên miền.');
  return u;
}

export class UserError extends Error {
  constructor(msg, status = 400) { super(msg); this.status = status; this.user = true; }
}

/* Chỉ nhận yêu cầu POST từ chính trang, hoặc GET kèm khóa kiểm thử, hoặc GET đọc tệp mẫu của chính trang. */
export function checkCaller(req, url) {
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').toLowerCase();
  if (req.method === 'POST') {
    const origin = req.headers.origin || '';
    let oh = '';
    try { oh = new URL(origin).host.toLowerCase(); } catch (e) { oh = ''; }
    if (!oh || oh !== host) throw new UserError('Yêu cầu không hợp lệ', 403);
    return;
  }
  if (req.method === 'GET') {
    const token = process.env.FX_TEST_TOKEN;
    const q = new URL(req.url, 'http://x').searchParams;
    if (token && q.get('token') === token) return;
    if (url && url.host.toLowerCase() === host) return;
    throw new UserError('Yêu cầu không hợp lệ', 403);
  }
  throw new UserError('Phương thức không được hỗ trợ', 405);
}

export async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (e) { return {}; } }
  const chunks = []; let n = 0;
  for await (const c of req) { n += c.length; if (n > 64 * 1024) break; chunks.push(c); }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch (e) { return {}; }
}

export function targetFrom(req, body) {
  if (req.method === 'GET') return new URL(req.url, 'http://x').searchParams.get('url');
  return body && body.url;
}

export function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}

export const UA_DESKTOP = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
export const UA_MOBILE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1';
