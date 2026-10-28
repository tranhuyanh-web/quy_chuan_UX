/* Mở trang bằng trình duyệt ẩn (chế độ Đầy đủ) và đi qua cả luồng đăng ký:
   - chờ form hiện ra (không chờ mạng "im lặng" — trang có reCAPTCHA, analytics không bao giờ im)
   - tìm form trong khung nhúng (iframe) hoặc sau nút "Đăng ký ngay" của trang giới thiệu
   - ở bước đầu: bấm Tiếp/Gửi khi để trống để xem form báo lỗi thế nào
   - điền dữ liệu thử, bấm "Tiếp" để sang bước sau; KHÔNG bấm nút gửi cuối cùng
   - từ lúc điền dữ liệu, chặn mọi yêu cầu gửi dữ liệu (POST, PUT…) nên không tạo hồ sơ thật
   Mỗi bước: đo cỡ chữ, vùng chạm, tương phản, bố cục cột; chụp toàn trang khung điện thoại. */
import { writeFileSync, existsSync } from 'node:fs';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { checkUrl, checkCaller, readBody, targetFrom, send, hostIsPublic, UserError, UA_DESKTOP } from '../lib/guard.js';

const MAX_STEPS = 6;
const BUDGET_MS = 49000;
const STEP_HTML = 1200 * 1024;
const TOTAL_BYTES = 3600 * 1024;
const MOBILE = { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true };
/* Giữ nguyên isMobile/hasTouch khi đổi khung hình: đổi hai cờ này thì Puppeteer tải lại trang (mất bước đang đứng) */
const DESKTOP = { width: 1280, height: 900, deviceScaleFactor: 1, isMobile: true, hasTouch: true };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Tệp mẫu để thử ô tải lên (PDF và JPEG nhỏ nhất hợp lệ) */
const PDF_PATH = '/tmp/kiem-thu.pdf', JPG_PATH = '/tmp/kiem-thu.jpg';
function ensureSampleFiles() {
  try {
    if (!existsSync(PDF_PATH)) writeFileSync(PDF_PATH, '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 200 200]/Parent 2 0 R>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n');
    if (!existsSync(JPG_PATH)) writeFileSync(JPG_PATH, Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64'));
  } catch (e) { /* bỏ qua */ }
}

/* ================= Các hàm chạy trong trang (không dùng biến bên ngoài) ================= */
const SEL = 'input, select, textarea, button, [role=combobox], [role=radio], [role=checkbox], [role=textbox], [role=listbox], [role=switch], [contenteditable=""], [contenteditable="true"]';

function countControls() {
  const q = 'input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=image]):not([type=reset]), select, textarea, [role=combobox], [role=radio], [role=checkbox], [role=textbox]';
  return Array.from(document.querySelectorAll(q)).filter((el) => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return false;
    if (r.width > 1 && r.height > 1) return true;
    /* radio/checkbox tùy biến: ô thật bị ẩn, nhãn hiển thị */
    return /^(radio|checkbox)$/.test(el.type || '') && el.labels && el.labels[0] && el.labels[0].getBoundingClientRect().width > 1;
  }).length;
}

/* Đánh dấu ô đã thấy ở bước trước (để bước sau không đếm lại) và trả về chữ ký các ô đang hiển thị */
function markOld(seen) {
  const set = new Set(seen);
  const q = 'input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=image]):not([type=reset]), select, textarea, [role=combobox], [role=radio], [role=checkbox], [role=textbox]';
  const lab = (el) => ((el.labels && el.labels[0] && el.labels[0].innerText) || el.getAttribute('aria-label') || '').trim().slice(0, 40);
  const out = []; let fresh = 0;
  document.querySelectorAll(q).forEach((el, i) => {
    const r = el.getBoundingClientRect();
    const visible = r.width > 1 && r.height > 1 && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none';
    const shown = visible || (/^(radio|checkbox)$/.test(el.type || '') && el.labels && el.labels[0] && el.labels[0].getBoundingClientRect().width > 1);
    const sig = [el.tagName, el.type || '', el.name || '', el.id || '', el.getAttribute('placeholder') || '', lab(el), (el.name || el.id) ? '' : i].join('|');
    if (set.has(sig)) el.setAttribute('data-fx-old', '1'); else { el.removeAttribute('data-fx-old'); if (shown) fresh++; }
    if (shown) out.push(sig);
  });
  return { sigs: out, fresh };
}

/* Đánh số các điều khiển và đo kích thước, màu sắc */
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
    if (el.tagName === 'BUTTON') el.setAttribute('data-fx-txt', (el.innerText || '').trim().slice(0, 120));
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

function pageInfo() {
  const h = document.querySelector('h1, [role=heading][aria-level="1"], h2');
  return {
    title: document.title, heading: h ? h.innerText.trim().slice(0, 120) : '',
    scrollW: document.documentElement.scrollWidth, innerW: innerWidth, docH: document.documentElement.scrollHeight,
    viewport: (document.querySelector('meta[name="viewport"]') || {}).content || '',
    iframes: Array.from(document.querySelectorAll('iframe')).map((f) => f.src).filter(Boolean).slice(0, 10),
    loadMs: Math.round(performance.getEntriesByType('navigation')[0] ? performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd : 0),
  };
}

/* Bản chụp HTML gọn: bỏ nội dung script nội tuyến, ảnh base64, ruột SVG, chú thích */
function snapshot() {
  const root = document.documentElement.cloneNode(true);
  root.querySelectorAll('script').forEach((s) => { s.textContent = ''; });
  root.querySelectorAll('noscript, template').forEach((s) => s.remove());
  root.querySelectorAll('svg').forEach((s) => { s.innerHTML = ''; });
  root.querySelectorAll('img[src^="data:"], source[srcset^="data:"]').forEach((i) => { i.setAttribute('src', ''); i.removeAttribute('srcset'); });
  const w = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT); const cm = [];
  while (w.nextNode()) cm.push(w.currentNode);
  cm.forEach((c) => c.remove());
  return '<!DOCTYPE html>' + root.outerHTML;
}

/* Chữ ký trạng thái: các ô đang hiển thị + địa chỉ + tiêu đề — đổi nghĩa là đã sang bước khác */
function stateSig() {
  const q = 'input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea, [role=radio], [role=checkbox], [role=combobox]';
  const v = Array.from(document.querySelectorAll(q)).filter((el) => { const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1 && getComputedStyle(el).visibility !== 'hidden'; })
    .map((el) => [el.tagName, el.type || '', el.name || '', el.id || ''].join(':'));
  return location.href.split('#')[0] + '§' + v.join(',');
}

/* Tìm nút sang bước tiếp theo (không bao giờ chọn nút gửi cuối) và nút gửi */
function findButtons() {
  const fold = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/\s+/g, ' ').trim();
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 1 && r.height > 1 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const txt = (el) => (el.tagName === 'INPUT' ? el.value || (el.type === 'submit' ? 'Submit' : '') : (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '')).trim();
  const NEXT = /^(tiep|tiep tuc|tiep theo|buoc tiep|buoc sau|sang buoc|qua buoc|next|continue|proceed)(\s|$|[›»>→])|^[›»>→]$/;
  const BACK = /^(quay lai|tro lai|back|previous|prev|lui|huy|dong|close|cancel)/;
  const SUBMIT = /(gui|nop|dang ky|hoan tat|hoan thanh|xac nhan|submit|send|register|sign ?up|finish|done|thanh toan|\bpay\b|dat cho|dat ve|tham gia)/;
  const q = 'input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=image]):not([type=reset]), select, textarea, [role=radio], [role=checkbox]';
  const fieldsBottom = Math.max(0, ...Array.from(document.querySelectorAll(q)).filter(vis).map((el) => el.getBoundingClientRect().bottom + scrollY));
  const cands = Array.from(document.querySelectorAll('button, input[type=submit], input[type=button], input[type=image], [role=button], a[href]')).filter(vis);
  const off = (el) => el.disabled || el.getAttribute('aria-disabled') === 'true';
  let next = null, submit = null, nScore = -1e9, sScore = -1e9;
  cands.forEach((el, k) => {
    const t = fold(txt(el)); if (!t || t.length > 48 || BACK.test(t)) return;
    const inForm = !!el.closest('form, [role=form], fieldset');
    const y = el.getBoundingClientRect().top + scrollY;
    const near = -Math.abs(y - fieldsBottom) / 20 + (y >= fieldsBottom - 40 ? 20 : 0) - (off(el) ? 50 : 0);
    const isLink = el.tagName === 'A';
    if (NEXT.test(t) && (!isLink || inForm)) { const sc = (inForm ? 100 : 0) + near; if (sc > nScore) { nScore = sc; next = el; } }
    else if ((SUBMIT.test(t) || el.type === 'submit') && !isLink && (inForm || y >= fieldsBottom - 40)) { const sc = (inForm ? 100 : 0) + near; if (sc > sScore) { sScore = sc; submit = el; } }
  });
  document.querySelectorAll('[data-fx-b]').forEach((e) => e.removeAttribute('data-fx-b'));
  if (next) next.setAttribute('data-fx-b', 'next');
  if (submit) submit.setAttribute('data-fx-b', 'submit');
  return { next: next ? txt(next).slice(0, 60) : '', nextOff: !!(next && off(next)), submit: submit ? txt(submit).slice(0, 60) : '', submitOff: !!(submit && off(submit)) };
}

/* Nút/link "Đăng ký ngay" của trang giới thiệu */
function findCta() {
  const fold = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/\s+/g, ' ').trim();
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1 && getComputedStyle(el).visibility !== 'hidden'; };
  const CTA = /^(dang ky|dang ky ngay|dang ky tham gia|dang ky du thi|dang ky thi|tham gia ngay|tham gia|bat dau|bat dau dang ky|nop ho so|nop bai|ung tuyen|register|register now|apply|apply now|sign up|join|join now)(\s|$|[›»>→!])/;
  const els = Array.from(document.querySelectorAll('a[href], button, [role=button]')).filter(vis);
  const hit = els.find((el) => CTA.test(fold(el.innerText || el.getAttribute('aria-label'))) && !/dang nhap|login|sign in/.test(fold(el.innerText)));
  if (!hit) return null;
  document.querySelectorAll('[data-fx-cta]').forEach((e) => e.removeAttribute('data-fx-cta'));
  hit.setAttribute('data-fx-cta', '1');
  const href = hit.tagName === 'A' ? hit.href : '';
  return { text: (hit.innerText || '').trim().slice(0, 60), href: /^https?:/.test(href) && !/#$/.test(href) && !href.startsWith(location.href.split('#')[0] + '#') ? href : '' };
}

/* Chữ đang hiển thị (để so trước/sau khi bấm) */
function visibleTexts() {
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) {
    const t = w.currentNode.textContent.replace(/\s+/g, ' ').trim();
    if (!t || t.length > 240) continue;
    const el = w.currentNode.parentElement; if (!el) continue;
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    if (r.width < 1 || r.height < 1 || cs.visibility === 'hidden' || cs.display === 'none') continue;
    out.push(t);
  }
  return out;
}

/* Sau khi bấm Tiếp/Gửi lúc để trống: form báo lỗi thế nào? */
function readErrors(before) {
  const old = new Set(before);
  const q = 'input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=image]):not([type=reset]), select, textarea, [role=radio], [role=checkbox], [role=combobox]';
  const ctrls = Array.from(document.querySelectorAll(q));
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 1 && r.height > 1 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const ERRC = /error|invalid|danger|warning|help-block|feedback|validation|message|alert|err-|-err|loi/i;
  const red = (c) => { const m = c.match(/\d+(\.\d+)?/g); if (!m) return false; const [r, g, b] = m.map(Number); return r > 150 && r > g * 1.6 && r > b * 1.6; };
  /* ô gần nhất với một phần tử báo lỗi */
  const nearest = (el) => {
    const by = ctrls.find((c) => (c.getAttribute('aria-describedby') || '').split(/\s+/).some((id) => id && (el.id === id || (document.getElementById(id) && document.getElementById(id).contains(el)))));
    if (by) return by;
    for (let b = el.parentElement, k = 0; b && k < 5; b = b.parentElement, k++) {
      const inside = ctrls.filter((c) => b.contains(c) && (vis(c) || (c.labels && c.labels[0])));
      if (inside.length) { const names = new Set(inside.map((c) => c.name || c.id || c)); if (names.size === 1) return inside[0]; break; }
    }
    return null;
  };
  const errs = []; const seenEl = new Set();
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) {
    const t = w.currentNode.textContent.replace(/\s+/g, ' ').trim();
    if (!t || t.length < 3 || t.length > 200) continue;
    const el = w.currentNode.parentElement; if (!el || seenEl.has(el) || !vis(el)) continue;
    if (el.closest('label, legend, button, option, select, script, style, h1, h2, h3')) continue;
    const cs = getComputedStyle(el);
    const isNew = !old.has(t);
    let looks = false;
    for (let n = el, k = 0; n && k < 3; n = n.parentElement, k++) { if (ERRC.test((n.className && n.className.baseVal !== undefined ? n.className.baseVal : n.className) || '') || ERRC.test(n.id || '') || /alert/.test(n.getAttribute('role') || '') || n.getAttribute('aria-live')) { looks = true; break; } }
    if (!isNew && !looks) continue;
    if (!looks && !red(cs.color)) continue;
    seenEl.add(el);
    const c = nearest(el);
    errs.push({ text: t, i: c ? c.getAttribute('data-fx-i') : null, y: Math.round(el.getBoundingClientRect().top + scrollY), red: red(cs.color), isNew });
  }
  const native = ctrls.filter((c) => c.willValidate && c.validity && !c.validity.valid).map((c) => ({ i: c.getAttribute('data-fx-i'), msg: c.validationMessage }));
  const firstY = Math.min(1e9, ...ctrls.filter(vis).map((c) => c.getBoundingClientRect().top + scrollY));
  const sumEl = Array.from(document.querySelectorAll('[role=alert], [aria-live], [class*=summary], [class*=error], [class*=alert]')).find((el) => vis(el) && el.getBoundingClientRect().top + scrollY < firstY && (el.querySelectorAll('a, li').length >= 1) && el.innerText.trim().length > 5);
  const a = document.activeElement;
  const focus = !a || a === document.body ? 'none' : a.matches(q) ? 'field' : sumEl && (sumEl === a || sumEl.contains(a)) ? 'summary' : a.matches('button, input[type=submit]') ? 'button' : 'other';
  return {
    errors: errs.slice(0, 40), native: native.slice(0, 30),
    summary: sumEl ? { text: sumEl.innerText.trim().slice(0, 300), links: sumEl.querySelectorAll('a').length } : null,
    focus, focusI: a && a.getAttribute ? a.getAttribute('data-fx-i') : null,
    ariaInvalid: ctrls.filter((c) => c.getAttribute('aria-invalid') === 'true').length,
    described: ctrls.filter((c) => c.getAttribute('aria-invalid') === 'true' && (c.getAttribute('aria-describedby') || '').split(/\s+/).some((id) => { const e = id && document.getElementById(id); return e && e.innerText.trim(); })).length,
  };
}

/* Điền dữ liệu thử vào các ô đang hiển thị và còn trống. Trả về danh sách ô tải tệp cần chọn tệp. */
function fillVisible() {
  const fold = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 1 && r.height > 1 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const labOf = (el) => [(el.labels && el.labels[0] && el.labels[0].innerText) || '', el.getAttribute('aria-label') || '', el.getAttribute('placeholder') || '', el.name || '', el.id || '', el.getAttribute('autocomplete') || ''].join(' ');
  const setVal = (el, v) => {
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    const d = Object.getOwnPropertyDescriptor(proto, 'value');
    el.focus();
    if (d && d.set) d.set.call(el, v); else el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new FocusEvent('blur', { bubbles: false })); el.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
  };
  const files = [], done = [];
  let pw = 'KiemThu#2026!x';
  const radiosDone = new Set();
  Array.from(document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=image]):not([type=reset]), select, textarea')).forEach((el) => {
    const t = (el.type || el.tagName).toLowerCase();
    const shown = vis(el) || (/^(radio|checkbox)$/.test(t) && el.labels && el.labels[0] && vis(el.labels[0]));
    if (!shown || el.disabled || el.readOnly || el.getAttribute('data-fx-old') === '1') return;
    const L = fold(labOf(el));
    if (t === 'file') { files.push({ i: el.getAttribute('data-fx-i'), img: /image|jpe?g|png|anh|photo/.test(fold((el.accept || '') + ' ' + L)) }); return; }
    if (t === 'checkbox') {
      if (!el.checked && (el.required || el.getAttribute('aria-required') === 'true' || /dong y|dieu khoan|the le|cam ket|chinh sach|agree|terms|xac nhan/.test(L)) && !/quang cao|khuyen mai|nhan tin|ban tin|newsletter|marketing/.test(L)) { el.click(); done.push(el.name); }
      return;
    }
    if (t === 'radio') {
      const key = el.name || el.id; if (radiosDone.has(key)) return; radiosDone.add(key);
      const group = el.name ? Array.from(document.querySelectorAll(`input[type=radio][name="${CSS.escape(el.name)}"]`)) : [el];
      if (!group.some((g) => g.checked)) { const pick = group.find((g) => !g.disabled); if (pick) { pick.click(); done.push(key); } }
      return;
    }
    if (el.tagName === 'SELECT') {
      if (el.value && el.selectedIndex > 0) return;
      const opts = Array.from(el.options).filter((o) => !o.disabled && o.value !== '' && !/^[-–—\s]*(chon|select|vui long|--)/.test(fold(o.text)));
      if (!opts.length) return;
      const pref = opts.find((o) => /ha noi/.test(fold(o.text))) || (/nam|year/.test(L) ? opts[Math.min(opts.length - 1, Math.floor(opts.length / 2))] : opts[0]);
      setVal(el, pref.value); done.push(el.name); return;
    }
    if (el.value) return;
    let v = 'Kiểm thử';
    const ac = (el.getAttribute('autocomplete') || '').toLowerCase();
    if (t === 'email' || /e-?mail/.test(L)) v = 'kiemthu.tudong@example.com';
    else if (t === 'password') v = pw;
    else if (t === 'tel' || /dien thoai|\bsdt\b|so dt|phone|mobile|di dong|zalo/.test(L)) v = '0912345678';
    else if (t === 'date') v = '2004-05-20';
    else if (t === 'month') v = '2004-05';
    else if (t === 'time') v = '09:00';
    else if (t === 'url' || /website|duong dan|link|url|portfolio/.test(L)) v = 'https://example.com';
    else if (t === 'number' || t === 'range') { const mn = +el.min || 0, mx = el.max ? +el.max : mn + 10; v = String(Math.min(mx, Math.max(mn, /tuoi|age/.test(L) ? 20 : mn || 1))); }
    else if (/otp|ma xac|one-time/.test(L + ac)) return;
    else if (/cccd|cmnd|can cuoc|chung minh|dinh danh|passport|ho chieu/.test(L)) v = '001203004567';
    else if (/bday-day|^\s*ngay\b|\bday\b|\bdd\b/.test(L + ' ' + ac) && !/ngay sinh .*thang/.test(L)) v = '20';
    else if (/bday-month|thang|month|\bmm\b/.test(L + ' ' + ac)) v = '05';
    else if (/bday-year|nam sinh|\bnam\b|year|yyyy/.test(L + ' ' + ac)) v = '2004';
    else if (/ngay sinh|birth|dob|bday/.test(L)) v = '20/05/2004';
    else if (/ho (va )?ten|ho ten|full ?name|\bname\b|ten thi sinh|ten ban/.test(L)) v = 'Nguyễn Văn An';
    else if (/^\s*ho\b|last ?name|family/.test(L)) v = 'Nguyễn';
    else if (/^\s*ten\b|first ?name|given/.test(L)) v = 'Văn An';
    else if (/dia chi|so nha|duong|address|street/.test(L)) v = '12 Phố Huế';
    else if (/truong|school|don vi|cong ty|organization/.test(L)) v = 'Trường THPT Kiểm Thử';
    else if (/tinh|thanh pho|province|city/.test(L)) v = 'Hà Nội';
    else if (/phuong|xa|ward/.test(L)) v = 'Phường Hoàn Kiếm';
    if (el.tagName === 'TEXTAREA') { const need = Math.max(60, +el.minLength || 0); v = 'Nội dung kiểm thử tự động. '; while (v.length < need) v += 'Nội dung kiểm thử tự động. '; }
    if (el.maxLength > 0 && v.length > el.maxLength) v = v.replace(/\s+/g, '').slice(0, el.maxLength);
    if (el.minLength > 0 && v.length < el.minLength) v = v.padEnd(el.minLength, 'a');
    setVal(el, v); done.push(el.name || el.id);
  });
  /* Radio/checkbox tùy biến (role=radio, role=checkbox) */
  document.querySelectorAll('[role=radiogroup]').forEach((g) => { if (!vis(g) || g.querySelector('[role=radio][aria-checked=true]')) return; const r = g.querySelector('[role=radio]:not([aria-disabled=true])'); if (r) { r.click(); done.push('radiogroup'); } });
  document.querySelectorAll('[role=checkbox][aria-required=true][aria-checked=false]').forEach((c) => { if (vis(c)) { c.click(); done.push('checkbox'); } });
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  return { files, count: done.length };
}

/* ================= Phía máy chủ ================= */
async function settle(page, max = 8000) {
  const t0 = Date.now();
  try { await page.waitForFunction(() => document.readyState === 'complete', { timeout: Math.min(4000, max) }); } catch (e) { /* trang vẫn tải tài nguyên phụ: đi tiếp */ }
  let last = -1, stable = 0;
  while (Date.now() - t0 < max) {
    const n = await page.evaluate(countControls).catch(() => -1);
    if (n === last && n >= 0) { stable++; if (stable >= 3 && (n > 0 || Date.now() - t0 > max * 0.7)) break; } else { stable = 0; last = n; }
    await sleep(350);
  }
}
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const H = Math.min(document.documentElement.scrollHeight, 16000);
    for (let y = 0; y < H; y += 800) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
    window.scrollTo(0, 0);
  }).catch(() => {});
}
async function fullShot(page) {
  const H = await page.evaluate(() => Math.min(document.documentElement.scrollHeight, 6000)).catch(() => 844);
  const shoot = (q) => page.screenshot({ type: 'jpeg', quality: q, encoding: 'base64', captureBeyondViewport: true, clip: { x: 0, y: 0, width: MOBILE.width, height: Math.max(200, H) } });
  let b64 = await shoot(52);
  if (b64.length > 700 * 1024) b64 = await shoot(32);
  return { data: 'data:image/jpeg;base64,' + b64, w: MOBILE.width, h: Math.max(200, H) };
}
async function tabTest(page) {
  await page.evaluate(() => { if (document.activeElement) document.activeElement.blur(); window.scrollTo(0, 0); });
  const focus = [];
  for (let k = 0; k < 14; k++) {
    await page.keyboard.press('Tab');
    const f = await page.evaluate(focusStyle).catch(() => null);
    if (f && f.i != null) focus.push(f);
  }
  await page.evaluate(() => { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); window.scrollTo(0, 0); }).catch(() => {});
  return focus;
}
/* Ghi lại một bước: đo ở điện thoại, chụp toàn trang, đo bố cục máy tính, chụp HTML */
async function capture(page, seen, kind, opts = {}) {
  const { sigs, fresh } = await page.evaluate(markOld, [...seen]);
  const controls = await page.evaluate(measure, 'mobile');
  const info = await page.evaluate(pageInfo);
  const shot = await fullShot(page);
  await page.setViewport(DESKTOP); await sleep(450);
  const desktop = await page.evaluate(measure, 'desktop');
  await page.setViewport(MOBILE); await sleep(450);
  await page.evaluate(measure, 'mobile');
  const focus = opts.focus ? await tabTest(page) : [];
  const html = await page.evaluate(snapshot);
  sigs.forEach((s) => seen.add(s));
  return { kind, fresh, url: page.url(), title: info.title, heading: info.heading, html, shot: shot.data, shotW: shot.w, shotH: shot.h, metrics: { controls, desktop, focus, page: info } };
}
const sigChanged = (a, b) => a !== b;
async function waitChange(page, before, ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    await sleep(300);
    const url = page.url();
    if (/^chrome-error:/.test(url)) return 'error';
    const now = await page.evaluate(stateSig).catch(() => null);
    if (now && sigChanged(now, before)) { await sleep(500); return 'changed'; }
  }
  return '';
}

export default async function handler(req, res) {
  const t0 = Date.now();
  const left = () => BUDGET_MS - (Date.now() - t0);
  let browser;
  const killer = setTimeout(() => { try { browser && browser.close(); } catch (e) { /* bỏ qua */ } }, 57000);
  try {
    const body = req.method === 'POST' ? await readBody(req) : {};
    let url = await checkUrl(targetFrom(req, body));
    checkCaller(req, url);
    ensureSampleFiles();
    const local = process.env.CHROME_PATH;
    browser = await puppeteer.launch(local
      ? { executablePath: local, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'], defaultViewport: MOBILE }
      : { args: chromium.args, executablePath: await chromium.executablePath(), headless: 'shell', defaultViewport: MOBILE });
    const page = await browser.newPage();
    await page.setUserAgent(UA_DESKTOP);
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.6' });
    await page.setRequestInterception(true);
    const net = { reqs: 0, blocked: 0, writes: [], block: false };
    page.on('request', async (r) => {
      try {
        const u = new URL(r.url());
        if (u.protocol === 'data:' || u.protocol === 'blob:') return r.continue();
        if (!/^https?:$/.test(u.protocol) || ['media', 'websocket', 'eventsource', 'manifest'].includes(r.resourceType())) { net.blocked++; return r.abort(); }
        if (net.block && !['GET', 'HEAD', 'OPTIONS'].includes(r.method())) { net.writes.push(`${r.method()} ${u.host}${u.pathname}`.slice(0, 120)); return r.abort(); }
        if (!(await hostIsPublic(u.hostname))) { net.blocked++; return r.abort(); }
        net.reqs++;
        return r.continue();
      } catch (e) { try { r.abort(); } catch (x) { /* bỏ qua */ } }
    });
    const dialogs = [];
    page.on('dialog', (d) => { dialogs.push(d.message().slice(0, 200)); d.dismiss().catch(() => {}); });

    const notes = [];
    const go = async (u) => {
      let resp = null;
      try { resp = await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 20000 }); }
      catch (e) {
        const code = (String(e.message).match(/net::(ERR_[A-Z_]+)/) || [])[1];
        if (code) throw new UserError(`Không mở được trang (${code}). Kiểm tra lại đường dẫn, http hay https.`);
        notes.push('Trang phản hồi chậm (quá 20 giây), kết quả dựa trên phần đã hiển thị.');
      }
      const fu = page.url();
      if (/^(chrome-error|about:blank)/.test(fu)) throw new UserError('Không mở được trang. Kiểm tra lại đường dẫn, http hay https.');
      if (!(await hostIsPublic(new URL(fu).hostname))) throw new UserError('Trang chuyển hướng tới địa chỉ không được phép');
      await settle(page, 9000);
      await scrollThrough(page);
      return resp;
    };
    const resp = await go(url.href);
    const status = resp ? resp.status() : 0;
    const seen = new Set();
    const steps = [];

    /* Tìm form: khung nhúng, rồi nút "Đăng ký ngay" */
    const formFrame = async () => {
      for (const f of page.frames()) {
        if (f === page.mainFrame()) continue;
        const fu = f.url();
        if (!/^https?:/.test(fu) || /recaptcha|hcaptcha|captcha|turnstile|challenges\.cloudflare|doubleclick|googlesyndication|facebook\.com\/plugins|youtube|vimeo|maps\.google|google\.com\/maps/.test(fu)) continue;
        const n = await f.evaluate(countControls).catch(() => 0);
        if (n >= 2) return fu;
      }
      return '';
    };
    let n = await page.evaluate(countControls).catch(() => 0);
    if (n < 2) {
      const fu = await formFrame();
      if (fu && (await hostIsPublic(new URL(fu).hostname))) {
        notes.push(`Form nằm trong khung nhúng từ ${new URL(fu).host}. Công cụ đã mở thẳng khung đó để chấm.`);
        await go(fu); n = await page.evaluate(countControls).catch(() => 0);
      }
    }
    if (n < 2) {
      const cta = await page.evaluate(findCta).catch(() => null);
      if (cta) {
        steps.push(await capture(page, seen, 'landing'));
        if (cta.href && (await hostIsPublic(new URL(cta.href).hostname))) await go(cta.href);
        else {
          const before = await page.evaluate(stateSig);
          await page.evaluate(() => { const b = document.querySelector('[data-fx-cta]'); if (b) b.click(); });
          await waitChange(page, before, 5000); await settle(page, 5000);
        }
        n = await page.evaluate(countControls).catch(() => 0);
        if (n < 2) { const fu = await formFrame(); if (fu && (await hostIsPublic(new URL(fu).hostname))) { notes.push(`Form nằm trong khung nhúng từ ${new URL(fu).host}. Công cụ đã mở thẳng khung đó để chấm.`); await go(fu); } }
        notes.push(`Trang giới thiệu có nút "${cta.text}". Công cụ đã bấm để mở form.`);
      }
    }

    /* Đi qua các bước */
    let stop = null, probe = null, probed = false, probeAt = -1;
    for (let s = 0; s < MAX_STEPS; s++) {
      const cnt = await page.evaluate(countControls).catch(() => 0);
      const cap = await capture(page, seen, cnt ? 'form' : 'page', { focus: !probed && cnt > 0 });
      if (cnt && !cap.fresh && steps.some((x) => x.kind === 'form')) { stop = { kind: 'nochange', text: '' }; break; }
      steps.push(cap);
      if (!cnt) { stop = { kind: steps.some((x) => x.kind === 'form') ? 'end' : 'nofields' }; break; }
      if (left() < 9000) { stop = { kind: 'time' }; break; }
      let btn = await page.evaluate(findButtons);
      /* Bước đầu: bấm khi để trống để xem cách báo lỗi (đã chặn gửi dữ liệu) */
      if (!probed && ((btn.next && !btn.nextOff) || (!btn.next && btn.submit && !btn.submitOff))) {
        probed = true; probeAt = s; net.block = true;
        const before = await page.evaluate(visibleTexts).catch(() => []);
        const sig0 = await page.evaluate(stateSig);
        const nd = dialogs.length, nw = net.writes.length;
        await page.evaluate((k) => { const b = document.querySelector(`[data-fx-b="${k}"]`); if (b) b.click(); }, btn.next ? 'next' : 'submit');
        const ch = await waitChange(page, sig0, 1600);
        if (ch === 'error') { stop = { kind: 'post', text: btn.next || btn.submit }; break; }
        await page.evaluate(measure, 'mobile').catch(() => {});
        probe = await page.evaluate(readErrors, before).catch(() => null);
        if (probe) {
          probe.clicked = btn.next || btn.submit; probe.dialogs = dialogs.slice(nd); probe.advanced = ch === 'changed'; probe.writes = net.writes.length - nw;
          /* Thử gõ dở email để xem có báo lỗi khi đang gõ không */
          if (!probe.advanced) {
            const em = await page.$('input[type=email]:not([data-fx-old]), input[autocomplete=email]:not([data-fx-old])');
            if (em && (await em.boundingBox())) {
              const b2 = await page.evaluate(visibleTexts).catch(() => []);
              await em.click({ clickCount: 3 }).catch(() => {}); await page.keyboard.type('kiemthu', { delay: 25 }); await sleep(700);
              const e2 = await page.evaluate(readErrors, b2).catch(() => null);
              probe.typing = e2 ? e2.errors.filter((e) => e.isNew).map((e) => e.text).slice(0, 3) : [];
              await em.click({ clickCount: 3 }).catch(() => {}); await page.keyboard.press('Backspace').catch(() => {});
            }
          }
        }
        if (probe && probe.advanced) { notes.push(`Bấm "${probe.clicked}" khi để trống: form vẫn chuyển bước, không báo lỗi.`); continue; }
        btn = await page.evaluate(findButtons);
      }
      if (!btn.next) { stop = btn.submit ? { kind: 'submit', text: btn.submit, off: btn.submitOff } : { kind: 'end' }; break; }
      /* Điền dữ liệu thử rồi bấm Tiếp */
      net.block = true;
      const fill = await page.evaluate(fillVisible);
      for (const f of fill.files) {
        const h = await page.$(`[data-fx-i="${f.i}"]`);
        if (h) await h.uploadFile(f.img ? JPG_PATH : PDF_PATH).catch(() => {});
      }
      await sleep(500);
      if (probe && s === probeAt && probe.errors.length) {
        const still = await page.evaluate(readErrors, []).catch(() => null);
        if (still) probe.stale = still.errors.filter((e) => probe.errors.some((p) => p.text === e.text && p.i === e.i)).map((e) => e.text).slice(0, 5);
      }
      btn = await page.evaluate(findButtons);
      if (!btn.next) { stop = { kind: 'end' }; break; }
      if (btn.nextOff) { stop = { kind: 'invalid', text: btn.next, off: true, errors: [] }; break; }
      const sig = await page.evaluate(stateSig);
      const nw = net.writes.length;
      const bt = btn.next;
      await page.evaluate(() => { const b = document.querySelector('[data-fx-b="next"]'); if (b) b.click(); });
      const ch = await waitChange(page, sig, 5000);
      if (ch === 'error') { stop = { kind: 'post', text: bt }; break; }
      if (!ch) {
        const er = await page.evaluate(readErrors, []).catch(() => null);
        const msgs = er ? [...er.errors.map((e) => e.text), ...er.native.map((x) => x.msg)].filter(Boolean) : [];
        stop = net.writes.length > nw ? { kind: 'post', text: bt } : msgs.length ? { kind: 'invalid', text: bt, errors: [...new Set(msgs)].slice(0, 5) } : { kind: 'nochange', text: bt };
        break;
      }
      await settle(page, 6000);
    }
    if (!stop) stop = { kind: 'limit' };

    /* Giới hạn dung lượng trả về */
    let total = 0, truncated = false;
    steps.forEach((st) => {
      if (st.html.length > STEP_HTML) { st.html = st.html.slice(0, STEP_HTML); truncated = true; }
      total += st.html.length + st.shot.length;
    });
    for (let i = steps.length - 1; i > 0 && total > TOTAL_BYTES; i--) { total -= steps[i].shot.length; steps[i].shot = ''; }
    const first = steps.find((x) => x.kind === 'form') || steps[0];
    send(res, 200, {
      ok: true, mode: 'render', finalUrl: first.url, status, note: notes.join(' '), truncated,
      steps, probe, stop, net: { requests: net.reqs, blocked: net.blocked, writes: net.writes.length },
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
