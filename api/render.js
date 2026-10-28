/* Mở trang bằng trình duyệt ẩn (chế độ Đầy đủ): chạy JavaScript của trang, đo cỡ chữ,
   kích thước vùng chạm, tương phản, bố cục cột, focus khi dùng phím Tab, chụp màn hình. */
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { checkUrl, checkCaller, readBody, targetFrom, send, hostIsPublic, UserError, MAX_HTML, UA_DESKTOP } from '../lib/guard.js';

/* Hàm chạy trong trang: đánh số các điều khiển và đo kích thước, màu sắc */
function measure(pass) {
  const SEL = 'input, select, textarea, button, [role=combobox], [role=radio], [role=checkbox], [role=textbox], [role=listbox], [role=switch], [contenteditable=""], [contenteditable="true"]';
  const isVis = (el) => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 1 && r.height > 1 && cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.05;
  };
  const bgOf = (el) => {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return c;
    }
    return 'rgb(255, 255, 255)';
  };
  const labelFor = (el) => {
    if (el.labels && el.labels.length) return el.labels[0];
    const ids = (el.getAttribute('aria-labelledby') || '').split(/\s+/).filter(Boolean);
    return ids.length ? document.getElementById(ids[0]) : null;
  };
  const R = (r) => ({ x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) });
  const els = Array.from(document.querySelectorAll(SEL));
  return els.map((el, i) => {
    el.setAttribute('data-fx-i', String(i));
    const vis = isVis(el);
    const cs = getComputedStyle(el);
    const o = { i, vis, r: R(el.getBoundingClientRect()) };
    if (pass === 'desktop') return o;
    el.setAttribute('data-fx-vis', vis ? '1' : '0');
    o.fs = parseFloat(cs.fontSize);
    o.color = cs.color; o.bg = bgOf(el); o.pbg = bgOf(el.parentElement || el);
    const bw = ['Top', 'Right', 'Bottom', 'Left'].map((s) => [parseFloat(cs['border' + s + 'Width']) || 0, cs['border' + s + 'Color']]).sort((a, b) => b[0] - a[0])[0];
    o.bw = bw[0]; o.bc = bw[1];
    o.shadow = cs.boxShadow;
    try { o.ph = getComputedStyle(el, '::placeholder').color; } catch (e) { o.ph = ''; }
    const lab = labelFor(el);
    if (lab && isVis(lab)) {
      const lcs = getComputedStyle(lab);
      o.lab = R(lab.getBoundingClientRect()); o.lc = lcs.color; o.lbg = bgOf(lab); o.lfs = parseFloat(lcs.fontSize);
      const wraps = lab.contains(el);
      if (wraps || /^(radio|checkbox)$/.test(el.type || '')) o.tgt = R(lab.getBoundingClientRect());
    }
    if (!vis && /^(radio|checkbox)$/.test(el.type || '') && lab && isVis(lab)) o.styled = true;
    o.base = { os: cs.outlineStyle, ow: parseFloat(cs.outlineWidth) || 0, oc: cs.outlineColor, sh: cs.boxShadow, bc: cs.borderColor, bg: cs.backgroundColor };
    return o;
  });
}

function focusStyle() {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const cs = getComputedStyle(el);
  return { i: el.getAttribute('data-fx-i'), tag: el.tagName.toLowerCase(), os: cs.outlineStyle, ow: parseFloat(cs.outlineWidth) || 0, oc: cs.outlineColor, sh: cs.boxShadow, bc: cs.borderColor, bg: cs.backgroundColor };
}

export default async function handler(req, res) {
  const t0 = Date.now();
  let browser;
  const killer = setTimeout(() => { try { browser && browser.close(); } catch (e) { /* bỏ qua */ } }, 52000);
  try {
    const body = req.method === 'POST' ? await readBody(req) : {};
    const url = await checkUrl(targetFrom(req, body));
    checkCaller(req, url);
    const local = process.env.CHROME_PATH;
    const viewport = { width: 1280, height: 900, deviceScaleFactor: 1 };
    browser = await puppeteer.launch(local
      ? { executablePath: local, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'], defaultViewport: viewport }
      : { args: chromium.args, executablePath: await chromium.executablePath(), headless: 'shell', defaultViewport: viewport });
    const page = await browser.newPage();
    await page.setUserAgent(UA_DESKTOP);
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.6' });
    await page.setRequestInterception(true);
    let reqCount = 0, blocked = 0;
    page.on('request', async (r) => {
      try {
        const u = new URL(r.url());
        if (u.protocol === 'data:' || u.protocol === 'blob:') return r.continue();
        if (!/^https?:$/.test(u.protocol) || ['media', 'websocket', 'eventsource', 'manifest'].includes(r.resourceType())) { blocked++; return r.abort(); }
        if (!(await hostIsPublic(u.hostname))) { blocked++; return r.abort(); }
        reqCount++;
        return r.continue();
      } catch (e) { try { r.abort(); } catch (x) { /* bỏ qua */ } }
    });
    page.on('dialog', (d) => d.dismiss().catch(() => {}));
    let navNote = '';
    let resp = null;
    try {
      resp = await page.goto(url.href, { waitUntil: 'networkidle2', timeout: 22000 });
    } catch (e) {
      const code = (String(e.message).match(/net::(ERR_[A-Z_]+)/) || [])[1];
      if (code) throw new UserError(`Không mở được trang (${code}). Kiểm tra lại đường dẫn, http hay https.`);
      navNote = 'Trang tải chưa xong sau 22 giây, kết quả dựa trên phần đã hiển thị.';
    }
    const finalUrl = page.url();
    if (/^(chrome-error|about:blank)/.test(finalUrl)) throw new UserError('Không mở được trang. Kiểm tra lại đường dẫn, http hay https.');
    try { if (!(await hostIsPublic(new URL(finalUrl).hostname))) throw new UserError('Trang chuyển hướng tới địa chỉ không được phép'); } catch (e) { if (e.user) throw e; }
    await new Promise((r) => setTimeout(r, 900));
    const desktop = await page.evaluate(measure, 'desktop');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    await new Promise((r) => setTimeout(r, 600));
    const controls = await page.evaluate(measure, 'mobile');
    const pageInfo = await page.evaluate(() => ({
      title: document.title,
      scrollW: document.documentElement.scrollWidth, innerW: innerWidth,
      viewport: (document.querySelector('meta[name="viewport"]') || {}).content || '',
      iframes: Array.from(document.querySelectorAll('iframe')).map((f) => f.src).filter(Boolean).slice(0, 10),
      loadMs: Math.round(performance.getEntriesByType('navigation')[0] ? performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd : 0),
    }));
    const shot = await page.screenshot({ type: 'jpeg', quality: 58, encoding: 'base64' });
    /* Thử phím Tab: focus có nhìn thấy không */
    await page.evaluate(() => { if (document.activeElement) document.activeElement.blur(); window.scrollTo(0, 0); });
    const focus = [];
    for (let k = 0; k < 14; k++) {
      await page.keyboard.press('Tab');
      const f = await page.evaluate(focusStyle);
      if (f && f.i != null) focus.push(f);
    }
    let html = await page.evaluate(() => {
      document.querySelectorAll('script:not([src])').forEach((s) => { s.textContent = ''; });
      return '<!DOCTYPE html>' + document.documentElement.outerHTML;
    });
    let truncated = false;
    if (html.length > MAX_HTML) { html = html.slice(0, MAX_HTML); truncated = true; }
    send(res, 200, {
      ok: true, mode: 'render', finalUrl, status: resp ? resp.status() : 0, note: navNote, truncated,
      html, screenshot: 'data:image/jpeg;base64,' + shot,
      metrics: { controls, desktop, focus, page: { ...pageInfo, requests: reqCount, blocked } },
      ms: Date.now() - t0,
    });
  } catch (e) {
    const msg = e.user ? e.message : 'Không mở được trang bằng trình duyệt ẩn. Hệ thống sẽ thử đọc HTML ở chế độ Nhanh.';
    if (!e.user) console.error('render error', e && e.stack);
    send(res, e.status || 502, { ok: false, error: msg, fallback: !e.user });
  } finally {
    clearTimeout(killer);
    if (browser) { try { await browser.close(); } catch (e) { /* bỏ qua */ } }
  }
}
