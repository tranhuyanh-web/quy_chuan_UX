/* Đọc HTML của một trang (chế độ Nhanh): không chạy JavaScript của trang. */
import { checkUrl, checkCaller, readBody, targetFrom, send, hostIsPublic, UserError, MAX_HTML, UA_DESKTOP } from '../lib/guard.js';

export default async function handler(req, res) {
  const t0 = Date.now();
  try {
    const body = req.method === 'POST' ? await readBody(req) : {};
    let url = await checkUrl(targetFrom(req, body));
    checkCaller(req, url);
    let resp, hops = 0;
    for (;;) {
      resp = await fetch(url, {
        redirect: 'manual',
        signal: AbortSignal.timeout(15000),
        headers: { 'User-Agent': UA_DESKTOP, Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.5', 'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.6' },
      });
      if (resp.status >= 300 && resp.status < 400 && resp.headers.get('location')) {
        if (++hops > 5) throw new UserError('Trang chuyển hướng quá nhiều lần');
        const next = new URL(resp.headers.get('location'), url);
        if (!/^https?:$/.test(next.protocol) || !(await hostIsPublic(next.hostname))) throw new UserError('Trang chuyển hướng tới địa chỉ không được phép');
        url = next;
        continue;
      }
      break;
    }
    const type = resp.headers.get('content-type') || '';
    if (!/html|xml/i.test(type)) throw new UserError(`Đường dẫn không trả về trang HTML (nhận được "${type.split(';')[0] || 'không rõ'}")`);
    const reader = resp.body.getReader();
    const chunks = []; let size = 0, cut = false;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_HTML) { cut = true; await reader.cancel(); break; }
      chunks.push(value);
    }
    const buf = Buffer.concat(chunks);
    const cs = (type.match(/charset=([\w-]+)/i) || [])[1] || 'utf-8';
    let html;
    try { html = new TextDecoder(cs).decode(buf); } catch (e) { html = buf.toString('utf8'); }
    send(res, 200, { ok: true, mode: 'fetch', finalUrl: url.href, status: resp.status, bytes: size, truncated: cut, ms: Date.now() - t0, html });
  } catch (e) {
    const msg = e.user ? e.message : (e.name === 'TimeoutError' || e.name === 'AbortError') ? 'Trang phản hồi quá chậm (quá 15 giây)' : 'Không đọc được trang. Kiểm tra đường dẫn, hoặc tải tệp HTML lên thay thế.';
    if (!e.user) console.error('fetch error', e && e.message);
    send(res, e.status || 502, { ok: false, error: msg });
  }
}
