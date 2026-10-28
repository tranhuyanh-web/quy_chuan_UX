/* ============================================================
   TIỆN ÍCH CHUNG
   ============================================================ */
const ICONS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  book: 'M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3M9 7h6',
  form: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM8.5 8h7M8.5 12h7M8.5 16h4',
  field: 'M3 7.5h18v9H3zM7 10v4',
  quote: 'M4 5h16v11H10l-4 4v-4H4zM8 9h8M8 12h5',
  check: 'M9 11.5l2.5 2.5L20 5.5M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9',
  tool: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z',
  search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-4-4',
  sun: 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  left: 'M15 18l-6-6 6-6',
  right: 'M9 18l6-6-6-6',
  down: 'M6 9l6 6 6-6',
  x: 'M6 6l12 12M18 6 6 18',
  upload: 'M12 16V4M7 9l5-5 5 5M4 16v4h16v-4',
  file: 'M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h4',
  alert: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 7.5v5.5M12 16.5h.01',
  ok: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM8 12.2l2.8 2.8L16.2 9',
  info: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 11v6M12 7.5h.01',
  clock: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 7v5l3 2',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 12 0v1M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6',
  lock: 'M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 7 0V11',
  layers: 'M12 3 2 8l10 5 10-5zM2 13l10 5 10-5',
  tag: 'M3 12V3h9l9 9-9 9zM7.5 7.5h.01',
  type: 'M4 7V5h16v2M9 19h6M12 5v14',
  choice: 'M4 6.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0M12 6.5h8M4 17.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0M12 17.5h8',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5',
  pointer: 'M5 3l14 7-6 2-2 6zM13 12l6 6',
  save: 'M5 3h11l3 3v15H5zM8 3v5h7V3M8 21v-7h8v7',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
  flag: 'M5 21V4M5 4h12l-2.5 4L17 12H5',
  branch: 'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9',
  phone: 'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 18h2',
  a11y: 'M12 2.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM4 8.5l8 2 8-2M12 10.5v4.5M8.5 21l3.5-6 3.5 6',
  ext: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  plus: 'M12 5v14M5 12h14',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14',
  undo: 'M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3',
  play: 'M7 4l13 8-13 8z',
  monitor: 'M3 4h18v12H3zM8 20h8M12 16v4',
  image: 'M4 4h16v16H4zM4 16l5-5 4 4 2-2 5 5M15 8.5a1.5 1.5 0 1 0 0 .01',
  calendar: 'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4',
  target: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM12 12h.01',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  scissors: 'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12',
  keyboard: 'M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M7 14h10',
  wifi: 'M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01',
  wifioff: 'M2 2l20 20M8.5 15.5a5 5 0 0 1 7 0M5 12a10 10 0 0 1 5-2.6M14.5 9.5A10 10 0 0 1 19 12M2 8.5a15 15 0 0 1 4.5-2.8M10.5 5.1A15 15 0 0 1 22 8.5M12 19h.01',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
};
function ic(name, size = 18, cls = '') {
  const d = ICONS[name] || ICONS.info;
  return `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
}

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/* Bỏ dấu tiếng Việt để tìm kiếm: "Đà Nẵng" → "da nang" */
const fold = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase().replace(/\s+/g, ' ').trim();
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const pad2 = (n) => String(n).padStart(2, '0');
const fmtTime = (ts) => { const d = new Date(ts); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
const fmtDate = (d) => `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
const fmtMB = (b) => {
  if (b < 1024 * 1024) return `${Math.max(1, Math.round(b / 1024)).toLocaleString('vi-VN')} KB`;
  return `${(b / 1024 / 1024).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} MB`;
};
let _uid = 0;
const uid = (p = 'u') => `${p}${++_uid}`;

/* Định dạng chữ trong dữ liệu: [[code]] · **đậm** · %%nghiêng%% · {V3} · [chữ](#hash) */
function fmt(s) {
  let h = esc(s);
  h = h.replace(/\[\[(.+?)\]\]/g, (m, c) => `<code>${c}</code>`);
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/%%(.+?)%%/g, '<em>$1</em>');
  h = h.replace(/\[([^\]]+?)\]\((#[a-z0-9-]+)\)/g, '<a href="$2">$1</a>');
  h = h.replace(/\{([A-Z]\d{1,2})\}/g, (m, id) => ruleChip(id));
  return h;
}
function ruleChip(id, withTitle = false) {
  const r = RULE_BY_ID[id];
  if (!r) return esc(id);
  return `<a class="rchip" href="#nt-${id.toLowerCase()}" title="${esc(r.t)}"><span class="rchip-id">${id}</span>${withTitle ? `<span class="rchip-t">${esc(r.t)}</span>` : ''}</a>`;
}

/* Lưu trữ cục bộ — luôn bọc try/catch */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* bỏ qua */ } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { /* bỏ qua */ } },
};

/* Thông báo trạng thái */
let _toastT;
function toast(msg, kind = '') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.className = `toast show ${kind}`;
  t.innerHTML = `${ic(kind === 'err' ? 'alert' : 'ok', 18)}<span>${esc(msg)}</span>`;
  clearTimeout(_toastT);
  _toastT = setTimeout(() => { t.className = 'toast'; }, 2600);
}
function announce(msg) {
  const a = document.getElementById('sr-live');
  if (!a) return;
  a.textContent = '';
  setTimeout(() => { a.textContent = msg; }, 60);
}

/* Sao chép: gọi ngay trong sự kiện click; nếu bị từ chối thì mở hộp chọn sẵn văn bản */
function copyText(text, label = 'Đã sao chép') {
  const done = () => toast(label);
  const fallback = () => openDialog({
    title: 'Sao chép thủ công',
    body: `<p class="muted">Trình duyệt chặn sao chép tự động. Văn bản đã được chọn sẵn, nhấn <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>C</kbd>.</p><textarea class="copy-area" id="copy-area" readonly>${esc(text)}</textarea>`,
    onOpen: () => { const a = $('#copy-area'); a.focus(); a.select(); },
  });
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else fallback();
  } catch (e) { fallback(); }
}

/* Hộp thoại chung */
let _dlgReturn = null;
function openDialog({ title, body, actions = '', onOpen, wide = false }) {
  const d = document.getElementById('dlg');
  _dlgReturn = document.activeElement;
  d.innerHTML = `<div class="dlg-back" data-dlg-close></div>
    <div class="dlg-box ${wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="dlg-t">
      <div class="dlg-head"><h2 id="dlg-t">${esc(title)}</h2><button class="icon-btn" type="button" data-dlg-close aria-label="Đóng">${ic('x', 20)}</button></div>
      <div class="dlg-body">${body}</div>
      ${actions ? `<div class="dlg-foot">${actions}</div>` : ''}
    </div>`;
  d.hidden = false;
  document.body.classList.add('no-scroll');
  if (onOpen) onOpen(d); else { const f = d.querySelector('button, [href], input, textarea'); f && f.focus(); }
}
function closeDialog() {
  const d = document.getElementById('dlg');
  if (d.hidden) return;
  d.hidden = true; d.innerHTML = '';
  document.body.classList.remove('no-scroll');
  if (_dlgReturn && _dlgReturn.focus) _dlgReturn.focus();
}
