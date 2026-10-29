/* ============================================================
   BỘ MÁY FORM — chính bộ máy này áp dụng các nguyên tắc
   (kiểm tra khi rời ô, khen sớm chê muộn, chuẩn hóa, tóm tắt lỗi…)
   ============================================================ */
const SIM = { offline: false };

/* ---------- Chuẩn hóa ---------- */
const NORM = {
  trim: (v) => String(v || '').replace(/\s+/g, ' ').trim(),
  name: (v) => String(v || '').normalize('NFC').replace(/\s+/g, ' ').trim(),
  digits: (v) => String(v || '').replace(/\D/g, ''),
  phone(v) {
    let d = String(v || '').replace(/[^\d+]/g, '');
    if (d.startsWith('+84')) d = '0' + d.slice(3);
    else if (d.startsWith('0084')) d = '0' + d.slice(4);
    else if (d.startsWith('84') && d.length === 11) d = '0' + d.slice(2);
    d = d.replace(/\D/g, '');
    if (d.length === 9 && /^[35789]/.test(d)) d = '0' + d;
    return d;
  },
  phoneFmt: (d) => (/^\d{10}$/.test(d) ? d.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3') : d),
  email: (v) => String(v || '').replace(/\s+/g, '').replace(/@(.*)$/, (m, dom) => '@' + dom.toLowerCase()),
  url(v) { v = String(v || '').trim(); if (v && !/^https?:\/\//i.test(v)) v = 'https://' + v; return v; },
};

/* ---------- Kiểm tra (trả về câu lỗi hoặc '') ---------- */
const VALID = {
  name(v) {
    if (v.length < 2) return 'Họ và tên cần có ít nhất 2 ký tự';
    if (v.length > 100) return `Họ và tên tối đa 100 ký tự. Hiện có ${v.length} ký tự`;
    if (/\d/.test(v)) return 'Họ và tên không chứa chữ số';
    if (!/\p{L}/u.test(v)) return 'Họ và tên cần có chữ cái';
    return '';
  },
  email(v) {
    if (!v.includes('@')) return 'Email cần có ký tự @, ví dụ: ten@gmail.com';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Nhập email đúng định dạng, ví dụ: ten@gmail.com';
    return '';
  },
  phone(d, raw) {
    if (/[a-zA-ZÀ-ỹ]/.test(raw || '')) return 'Số điện thoại chỉ gồm chữ số';
    if (!d.startsWith('0')) return 'Số điện thoại cần bắt đầu bằng 0 hoặc +84';
    if (d.length !== 10) return `Số điện thoại cần có 10 chữ số. Bạn đã nhập ${d.length} chữ số`;
    if (!/^0[35789]/.test(d)) return 'Số điện thoại di động cần bắt đầu bằng 03, 05, 07, 08 hoặc 09';
    return '';
  },
  cccd(d, raw) {
    if (/[a-zA-ZÀ-ỹ]/.test(raw || '')) return 'Số căn cước chỉ gồm chữ số';
    if (d.length !== 12) return `Số căn cước gồm 12 chữ số. Bạn đã nhập ${d.length} chữ số`;
    return '';
  },
  url(v) {
    try { const u = new URL(v); if (!u.hostname.includes('.')) throw 0; return ''; }
    catch (e) { return 'Nhập đường dẫn đầy đủ, ví dụ: behance.net/ten-ban'; }
  },
  title(v) { return v.length > 120 ? `Tên ý tưởng tối đa 120 ký tự. Hiện có ${v.length} ký tự` : ''; },
  free() { return ''; },
};

/* Gợi ý sửa tên miền email gõ nhầm */
const MAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'yahoo.com.vn', 'ymail.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'live.com'];
function lev(a, b) {
  const m = a.length, n = b.length, dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[m][n];
}
function emailSuggest(v) {
  const at = v.lastIndexOf('@');
  if (at < 1) return '';
  const local = v.slice(0, at), dom = v.slice(at + 1).toLowerCase();
  if (!dom || MAIL_DOMAINS.includes(dom)) return '';
  let best = '', bd = 3;
  for (const d of MAIL_DOMAINS) { const x = lev(dom, d); if (x < bd) { bd = x; best = d; } }
  return best && bd <= 2 ? `${local}@${best}` : '';
}

/* Đếm từ (tiếng Việt: tách theo khoảng trắng) */
const countWords = (v) => (String(v || '').trim().match(/\S+/g) || []).length;

/* Ngày sinh */
function checkDob(d, m, y, o = {}) {
  const parts = { d: !!d, m: !!m, y: !!y };
  if (!d && !m && !y) return { msg: o.emptyMsg || 'Nhập ngày sinh', bad: ['d', 'm', 'y'] };
  const miss = ['d', 'm', 'y'].filter((k) => !parts[k]);
  if (miss.length) {
    const nm = { d: 'ngày', m: 'tháng', y: 'năm' };
    return { msg: `Ngày sinh cần có ${miss.map((k) => nm[k]).join(' và ')}`, bad: miss };
  }
  if (!/^\d+$/.test(d + m + y)) return { msg: 'Ngày sinh chỉ gồm chữ số', bad: ['d', 'm', 'y'].filter((k) => !/^\d+$/.test({ d, m, y }[k])) };
  if (y.length !== 4) return { msg: 'Năm sinh cần có 4 chữ số, ví dụ 2008', bad: ['y'] };
  const dn = +d, mn = +m, yn = +y;
  if (mn < 1 || mn > 12) return { msg: 'Tháng sinh phải từ 1 đến 12', bad: ['m'] };
  const dt = new Date(yn, mn - 1, dn);
  if (dn < 1 || dt.getMonth() !== mn - 1 || dt.getDate() !== dn) return { msg: 'Ngày sinh phải là một ngày có thật', bad: ['d'] };
  const today = new Date();
  if (dt > today) return { msg: 'Ngày sinh phải trước hôm nay', bad: ['d', 'm', 'y'] };
  if (yn < 1900) return { msg: 'Năm sinh phải từ 1900 trở về sau', bad: ['y'] };
  if (o.ref && (o.min != null || o.max != null)) {
    const ref = o.ref, age = ageAt(dt, ref);
    const from = new Date(ref.getFullYear() - o.max - 1, ref.getMonth(), ref.getDate() + 1);
    const to = new Date(ref.getFullYear() - o.min, ref.getMonth(), ref.getDate());
    if (age < o.min || age > o.max) return { msg: `Thí sinh cần sinh trong khoảng ${fmtDate(from)} – ${fmtDate(to)} (từ ${o.min} đến ${o.max} tuổi tính đến ${fmtDate(ref)})`, bad: ['d', 'm', 'y'] };
  }
  return { msg: '', bad: [], date: dt };
}
function ageAt(b, ref) {
  let a = ref.getFullYear() - b.getFullYear();
  if (ref.getMonth() < b.getMonth() || (ref.getMonth() === b.getMonth() && ref.getDate() < b.getDate())) a--;
  return a;
}

/* ============================================================
   THÀNH PHẦN TRƯỜNG
   cfg: { id, label, hint, required, emptyMsg, kind, ... , ann: 'V1 I3' }
   Mỗi controller: { id, el, get(), set(v), validate(force), focus(), visible() }
   ============================================================ */
/* Không làm xê dịch bố cục khi người dùng đang nhấn chuột hoặc chạm: câu lỗi, ghi chú hiện ra lúc rời ô
   sẽ chờ tới khi cú bấm xong. Nếu không, nút bên dưới bị đẩy đi giữa lúc nhấn và thả, cú bấm trượt. */
let PTR_DOWN = false;
const PTR_Q = [];
const ptrFlush = () => { PTR_DOWN = false; setTimeout(() => { while (PTR_Q.length) PTR_Q.shift()(); }, 0); };
if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', () => { PTR_DOWN = true; }, true);
  document.addEventListener('pointerup', ptrFlush, true);
  document.addEventListener('pointercancel', ptrFlush, true);
}
const afterPointer = (fn) => (PTR_DOWN ? PTR_Q.push(fn) : fn());

function annHTML(ann) {
  if (!ann) return '';
  return ann.split(/\s+/).map((id) => `<button type="button" class="ann" data-ann="${id}" tabindex="-1" aria-label="Nguyên tắc ${id}">${id}</button>`).join('');
}
function labelHTML(c, tag = 'label') {
  const req = c.required ? ' <span class="f-req" aria-hidden="true">*</span>' : (c.optional !== false ? ' <span class="f-opt">(không bắt buộc)</span>' : '');
  const inner = `<span class="f-label-t">${c.label}${req}</span>`;
  /* Huy hiệu chú thích nằm ngoài label/legend để không lọt vào tên của ô nhập */
  if (tag === 'legend') return `<legend class="f-label ${c.ann ? 'has-ann' : ''}">${inner}</legend>${c.ann ? `<span class="f-anns abs">${annHTML(c.ann)}</span>` : ''}`;
  return c.ann ? `<div class="f-label-row"><label class="f-label" for="${c.id}">${inner}</label><span class="f-anns">${annHTML(c.ann)}</span></div>` : `<label class="f-label" for="${c.id}">${inner}</label>`;
}
const errP = (id) => `<p class="f-error" id="${id}-err" hidden></p>`;
const hintP = (c) => (c.hint ? `<p class="f-hint" id="${c.id}-hint">${c.hint}</p>` : '');

function setErr(ctl, msg, inputs) {
  const e = ctl.el.querySelector(`#${CSS.escape(ctl.id)}-err`);
  ctl.el.classList.add('is-err');
  e.innerHTML = `${ic('alert', 18)}<span><span class="vh">Lỗi: </span>${esc(msg)}</span>`;
  e.hidden = false;
  (inputs || ctl.inputs()).forEach((i) => {
    i.setAttribute('aria-invalid', 'true');
    const ids = new Set((i.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
    ids.add(`${ctl.id}-err`);
    i.setAttribute('aria-describedby', [...ids].join(' '));
  });
  ctl.errShown = msg;
}
function clearErr(ctl) {
  const e = ctl.el.querySelector(`#${CSS.escape(ctl.id)}-err`);
  ctl.el.classList.remove('is-err');
  if (e) { e.hidden = true; e.innerHTML = ''; }
  ctl.inputs().forEach((i) => {
    i.removeAttribute('aria-invalid');
    const ids = (i.getAttribute('aria-describedby') || '').split(' ').filter((x) => x && x !== `${ctl.id}-err`);
    if (ids.length) i.setAttribute('aria-describedby', ids.join(' ')); else i.removeAttribute('aria-describedby');
  });
  ctl.errShown = '';
}
function baseCtl(c, el) {
  return {
    id: c.id, c, el, errShown: '',
    visible() { return !this.el.closest('[hidden]'); },
    focusId() { return c.id; },
    focus() { const i = this.inputs()[0]; if (i) { i.focus({ preventScroll: true }); i.scrollIntoView({ block: 'center', behavior: 'smooth' }); } },
  };
}

/* ---------- Ô văn bản (text, email, tel, url, textarea) ---------- */
function textHTML(c) {
  const desc = c.hint ? `${c.id}-hint` : '';
  const a = [
    `id="${c.id}"`, `name="${c.name || c.id}"`,
    c.multiline ? '' : `type="${c.type || 'text'}"`,
    c.inputmode ? `inputmode="${c.inputmode}"` : '',
    `autocomplete="${c.autocomplete || 'off'}"`,
    c.spellcheck === false ? 'spellcheck="false"' : '',
    c.autocapitalize ? `autocapitalize="${c.autocapitalize}"` : '',
    c.enterkeyhint ? `enterkeyhint="${c.enterkeyhint}"` : '',
    c.required ? 'aria-required="true"' : '',
    desc ? `aria-describedby="${desc}"` : '',
    c.rows ? `rows="${c.rows}"` : '',
  ].filter(Boolean).join(' ');
  const input = c.multiline
    ? `<textarea class="f-input f-textarea" ${a}></textarea>`
    : (c.prefix ? `<div class="f-affix"><span class="f-prefix" aria-hidden="true">${c.prefix}</span><input class="f-input ${c.w || ''}" ${a}></div>` : `<input class="f-input ${c.w || ''}" ${a}>`);
  return `<div class="f-field" id="fw-${c.id}" data-fid="${c.id}">
    ${labelHTML(c)}${hintP(c)}${errP(c.id)}${input}
    ${c.counter ? `<p class="f-count" id="${c.id}-count"></p><p class="vh" aria-live="polite" id="${c.id}-countlive"></p>` : ''}
    <div class="f-note" id="${c.id}-note" aria-live="polite"></div>
  </div>`;
}
function mountText(c, root) {
  const el = root.querySelector(`#fw-${CSS.escape(c.id)}`);
  const inp = el.querySelector(`#${CSS.escape(c.id)}`);
  const note = el.querySelector(`#${CSS.escape(c.id)}-note`);
  const ctl = baseCtl(c, el);
  ctl.inputs = () => [inp];
  ctl.raw = () => inp.value;
  ctl.norm = () => (c.norm ? NORM[c.norm](inp.value) : NORM.trim(inp.value));
  ctl.get = () => {
    const n = ctl.norm();
    return c.norm === 'phone' ? NORM.phoneFmt(n) : n;
  };
  ctl.set = (v) => { inp.value = v ?? ''; updCount(); };
  ctl.check = () => {
    const raw = inp.value, n = ctl.norm();
    if (!n) return c.required ? (c.emptyMsg || `Nhập ${String(c.label).toLowerCase()}`) : '';
    if (c.counter) {
      const w = countWords(raw);
      if (c.counter.max && w > c.counter.max) return `${c.counter.what || c.label} tối đa ${c.counter.max} từ. Hiện có ${w} từ`;
      if (c.counter.min && w < c.counter.min) return `${c.counter.what || c.label} cần ít nhất ${c.counter.min} từ. Hiện có ${w} từ`;
    }
    return c.v ? VALID[c.v](n, raw) : '';
  };
  ctl.validate = (force) => {
    const msg = ctl.check();
    if (msg) { if (force || ctl.errShown || ctl.touched) setErr(ctl, msg); } else clearErr(ctl);
    return msg;
  };
  function showNote(rawArg) {
    note.innerHTML = '';
    const raw = String(rawArg ?? inp.value).trim(), n = ctl.norm();
    if (!raw || ctl.errShown) return;
    if (c.norm === 'phone') {
      const f = NORM.phoneFmt(n);
      if (f !== raw) note.innerHTML = `${ic('ok', 16)}<span>Đã chuẩn hóa thành <b>${esc(f)}</b></span>`;
    } else if (c.norm === 'url' && n !== raw) {
      note.innerHTML = `${ic('ok', 16)}<span>Đã thêm <b>https://</b></span>`;
    } else if (c.norm === 'name' && n !== raw) {
      note.innerHTML = `${ic('ok', 16)}<span>Đã bỏ khoảng trắng thừa</span>`;
    }
    if (c.suggest) {
      const s = emailSuggest(n);
      if (s) {
        note.innerHTML = `<span class="f-suggest">${ic('bulb', 16)}<span>Có phải ý bạn là <b>${esc(s)}</b>?</span> <button type="button" class="f-linkbtn" data-use="${esc(s)}">Dùng địa chỉ này</button></span>`;
        note.querySelector('[data-use]').addEventListener('click', (e) => {
          inp.value = e.currentTarget.dataset.use; note.innerHTML = ''; ctl.validate(); inp.focus(); c.onChange && c.onChange(ctl);
          announce('Đã sửa email thành ' + inp.value);
        });
      }
    }
    if (c.okNote && !ctl.check()) note.innerHTML = `${ic('ok', 16)}<span>${c.okNote}</span>`;
  }
  ctl.showNote = showNote;
  const updCount = () => {
    if (!c.counter) return;
    const w = countWords(inp.value), max = c.counter.max, cnt = el.querySelector(`#${CSS.escape(c.id)}-count`);
    const left = max - w;
    cnt.classList.toggle('over', left < 0);
    cnt.innerHTML = left >= 0 ? `Còn <b>${left}</b> từ` : `${ic('alert', 15)} Vượt quá <b>${-left}</b> từ`;
    liveCount();
  };
  const liveCount = debounce(() => {
    if (!c.counter) return;
    const w = countWords(inp.value), left = c.counter.max - w;
    el.querySelector(`#${CSS.escape(c.id)}-countlive`).textContent = left >= 0 ? `Còn ${left} từ` : `Vượt quá ${-left} từ`;
  }, 900);
  ctl.updCount = updCount;
  inp.addEventListener('input', () => {
    ctl.dirty = true;
    if (ctl.errShown) { const m = ctl.check(); if (!m) { clearErr(ctl); } else setErr(ctl, m); }
    else if (note.innerHTML) note.innerHTML = '';
    updCount();
    c.onInput && c.onInput(ctl);
  });
  inp.addEventListener('blur', () => afterPointer(() => {
    if (!inp.value.trim()) { if (ctl.errShown) ctl.validate(); return; }
    ctl.touched = true;
    const rawBefore = inp.value;
    if (c.norm && c.norm !== 'name' && c.norm !== 'trim') {
      const n = ctl.norm();
      const disp = c.norm === 'phone' ? NORM.phoneFmt(n) : n;
      if (!ctl.check() && disp !== inp.value) inp.value = disp;
    } else if (c.norm === 'name') {
      const n = ctl.norm(); if (n !== inp.value) { inp.value = n; note.innerHTML = `${ic('ok', 16)}<span>Đã bỏ khoảng trắng thừa</span>`; }
    }
    ctl.validate();
    if (c.norm !== 'name') showNote(rawBefore);
    c.onChange && c.onChange(ctl);
  }));
  updCount();
  return ctl;
}

/* ---------- Ngày sinh: 3 ô ---------- */
function dobHTML(c) {
  const part = (k, lb, w, ac) => `<div class="f-dob-part"><label class="f-sub" for="${c.id}-${k}">${lb}</label><input class="f-input ${w}" id="${c.id}-${k}" name="${c.id}-${k}" inputmode="numeric" autocomplete="${ac}" ${c.hint ? `aria-describedby="${c.id}-hint"` : ''}></div>`;
  return `<fieldset class="f-field f-fs" id="fw-${c.id}" data-fid="${c.id}">
    ${labelHTML(c, 'legend')}${hintP(c)}${errP(c.id)}
    <div class="f-dob">${part('d', 'Ngày', 'w-day', 'bday-day')}${part('m', 'Tháng', 'w-day', 'bday-month')}${part('y', 'Năm', 'w-year', 'bday-year')}</div>
    <div class="f-note" id="${c.id}-note" aria-live="polite"></div>
  </fieldset>`;
}
function mountDob(c, root) {
  const el = root.querySelector(`#fw-${CSS.escape(c.id)}`);
  const ins = { d: el.querySelector(`#${c.id}-d`), m: el.querySelector(`#${c.id}-m`), y: el.querySelector(`#${c.id}-y`) };
  const ctl = baseCtl(c, el);
  ctl.inputs = () => [ins.d, ins.m, ins.y];
  ctl.focusId = () => `${c.id}-d`;
  const vals = () => ({ d: ins.d.value.trim(), m: ins.m.value.trim(), y: ins.y.value.trim() });
  ctl.get = () => vals();
  ctl.set = (v) => { v = v || {}; ins.d.value = v.d || ''; ins.m.value = v.m || ''; ins.y.value = v.y || ''; };
  ctl.result = () => { const v = vals(); return checkDob(v.d, v.m, v.y, c.range || {}); };
  ctl.check = () => {
    const v = vals();
    if (!v.d && !v.m && !v.y && !c.required) return '';
    return ctl.result().msg;
  };
  ctl.validate = (force) => {
    const v = vals();
    if (!v.d && !v.m && !v.y && !c.required) { clearErr(ctl); return ''; }
    const r = ctl.result();
    if (r.msg) {
      if (force || ctl.errShown || ctl.touched) { clearErr(ctl); setErr(ctl, r.msg, r.bad.map((k) => ins[k])); }
    } else clearErr(ctl);
    return r.msg;
  };
  ctl.focus = () => {
    const r = ctl.result(); const k = (r.bad && r.bad[0]) || 'd';
    ins[k].focus({ preventScroll: true }); ins[k].scrollIntoView({ block: 'center', behavior: 'smooth' });
  };
  Object.values(ins).forEach((i) => {
    i.addEventListener('input', () => { if (ctl.errShown) { const r = ctl.result(); if (!r.msg) clearErr(ctl); } c.onInput && c.onInput(ctl); });
  });
  el.addEventListener('focusout', (e) => {
    if (el.contains(e.relatedTarget)) return;
    afterPointer(() => {
      const v = vals();
      if (!v.d && !v.m && !v.y) { if (ctl.errShown) ctl.validate(); return; }
      ctl.touched = true;
      if (v.d.length === 1) ins.d.value = '0' + v.d;
      if (v.m.length === 1) ins.m.value = '0' + v.m;
      ctl.validate();
      c.onChange && c.onChange(ctl);
    });
  });
  return ctl;
}

/* ---------- Radio / thẻ lựa chọn ---------- */
function radioHTML(c) {
  const opts = c.options.map((o, i) => {
    const id = `${c.id}-${i}`;
    if (c.cards) {
      return `<label class="f-card ${o.disabled ? 'is-dis' : ''}" for="${id}">
        <input type="radio" id="${id}" name="${c.id}" value="${esc(o.v)}" ${o.disabled ? 'disabled' : ''} ${o.disabled ? `aria-describedby="${id}-why"` : ''}>
        <span class="f-card-body"><span class="f-card-t">${esc(o.n)}</span>${o.d ? `<span class="f-card-d">${esc(o.d)}</span>` : ''}${o.meta ? `<span class="f-card-m ${o.disabled ? '' : 'ok'}" ${o.disabled ? `id="${id}-why"` : ''}>${esc(o.meta)}</span>` : ''}</span>
      </label>`;
    }
    return `<label class="f-choice" for="${id}"><input type="radio" id="${id}" name="${c.id}" value="${esc(o.v)}"><span>${esc(o.n)}${o.d ? `<span class="f-choice-d">${esc(o.d)}</span>` : ''}</span></label>`;
  }).join('');
  return `<fieldset class="f-field f-fs" id="fw-${c.id}" data-fid="${c.id}" ${c.hint ? `aria-describedby="${c.id}-hint"` : ''}>
    ${labelHTML(c, 'legend')}${hintP(c)}${errP(c.id)}
    <div class="${c.cards ? 'f-cards' : 'f-choices'} ${c.inline ? 'inline' : ''}">${opts}</div>
    ${c.after || ''}
  </fieldset>`;
}
function mountRadio(c, root) {
  const el = root.querySelector(`#fw-${CSS.escape(c.id)}`);
  const ins = $$(`input[name="${c.id}"]`, el);
  const ctl = baseCtl(c, el);
  ctl.inputs = () => ins;
  ctl.focusId = () => (ins.find((i) => !i.disabled) || ins[0]).id;
  ctl.get = () => { const x = ins.find((i) => i.checked); return x ? x.value : ''; };
  ctl.label = () => { const v = ctl.get(); const o = c.options.find((o) => o.v === v); return o ? o.n : ''; };
  ctl.set = (v) => ins.forEach((i) => { i.checked = i.value === v; });
  ctl.check = () => (!ctl.get() && c.required ? (c.emptyMsg || `Chọn ${String(c.label).toLowerCase()}`) : '');
  ctl.validate = (force) => { const m = ctl.check(); if (m) { if (force || ctl.errShown) setErr(ctl, m, [el]); } else clearErr(ctl); return m; };
  ctl.inputs = () => [el];
  ctl.focus = () => { const i = document.getElementById(ctl.focusId()); i.focus({ preventScroll: true }); i.scrollIntoView({ block: 'center', behavior: 'smooth' }); };
  ins.forEach((i) => i.addEventListener('change', () => { if (ctl.errShown) clearErr(ctl); c.onChange && c.onChange(ctl); }));
  return ctl;
}

/* ---------- Checkbox đơn (đồng ý) ---------- */
function checkHTML(c) {
  return `<div class="f-field" id="fw-${c.id}" data-fid="${c.id}">
    ${errP(c.id)}
    <div class="f-check-row"><label class="f-choice f-check" for="${c.id}"><input type="checkbox" id="${c.id}" name="${c.id}" ${c.required ? 'aria-required="true"' : ''}><span>${c.label}${c.required ? ' <span class="f-req" aria-hidden="true">*</span>' : ' <span class="f-opt">(không bắt buộc)</span>'}</span></label>${annHTML(c.ann)}</div>
    ${c.extra || ''}
  </div>`;
}
function mountCheck(c, root) {
  const el = root.querySelector(`#fw-${CSS.escape(c.id)}`);
  const inp = el.querySelector(`#${CSS.escape(c.id)}`);
  const ctl = baseCtl(c, el);
  ctl.inputs = () => [inp];
  ctl.get = () => inp.checked;
  ctl.set = (v) => { inp.checked = !!v; };
  ctl.check = () => (c.required && !inp.checked ? c.emptyMsg : '');
  ctl.validate = (force) => { const m = ctl.check(); if (m) { if (force || ctl.errShown) setErr(ctl, m); } else clearErr(ctl); return m; };
  inp.addEventListener('change', () => { if (ctl.errShown && inp.checked) clearErr(ctl); c.onChange && c.onChange(ctl); });
  return ctl;
}

/* ---------- Ô tìm kiếm gợi ý (combobox) ---------- */
function comboHTML(c) {
  return `<div class="f-field" id="fw-${c.id}" data-fid="${c.id}">
    ${labelHTML(c)}${hintP(c)}${errP(c.id)}
    <div class="f-combo">
      <input class="f-input f-combo-in" id="${c.id}" name="${c.id}" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${c.id}-lb" autocomplete="${c.autocomplete || 'off'}" spellcheck="false" ${c.required ? 'aria-required="true"' : ''} ${c.hint ? `aria-describedby="${c.id}-hint"` : ''}>
      <span class="f-combo-ic" aria-hidden="true">${ic('down', 18)}</span>
      <ul class="f-lb" id="${c.id}-lb" role="listbox" aria-label="${esc(c.label)}" hidden></ul>
    </div>
    <p class="vh" aria-live="polite" id="${c.id}-live"></p>
    <div class="f-note" id="${c.id}-note" aria-live="polite"></div>
  </div>`;
}
function mountCombo(c, root) {
  const el = root.querySelector(`#fw-${CSS.escape(c.id)}`);
  const inp = el.querySelector(`#${CSS.escape(c.id)}`);
  const lb = el.querySelector(`#${CSS.escape(c.id)}-lb`);
  const live = el.querySelector(`#${CSS.escape(c.id)}-live`);
  const note = el.querySelector(`#${CSS.escape(c.id)}-note`);
  const ctl = baseCtl(c, el);
  const opts = c.options.map((o) => ({ ...o, f: fold(o.n), fa: (o.a || []).map(fold), fo: (o.o || []).map((x) => ({ n: x, f: fold(x) })) }));
  let results = [], active = -1, selected = null, free = false;
  ctl.inputs = () => [inp];
  ctl.get = () => inp.value.trim();
  ctl.set = (v) => { inp.value = v || ''; selected = opts.find((o) => o.n === v) || null; free = !!(v && !selected); };
  ctl.check = () => {
    const v = inp.value.trim();
    if (!v) return c.required ? c.emptyMsg : '';
    if (!selected && !c.allowFree) {
      const ex = exact(v);
      if (ex) return '';
      return c.pickMsg || 'Chọn một mục trong danh sách gợi ý';
    }
    return '';
  };
  ctl.validate = (force) => { const m = ctl.check(); if (m) { if (force || ctl.errShown || ctl.touched) setErr(ctl, m); } else clearErr(ctl); return m; };
  function exact(v) {
    const q = fold(v);
    return opts.find((o) => o.f === q || o.fa.includes(q)) || null;
  }
  function search(v) {
    const q = fold(v);
    if (!q) return opts.map((o) => ({ o, s: 0 }));
    const out = [];
    for (const o of opts) {
      let s = 99, via = '';
      if (o.f.startsWith(q)) s = 0;
      else if (o.f.split(/[\s.–-]+/).some((w) => w.startsWith(q))) s = 1;
      else if (o.fa.some((a) => a === q)) s = 1.2;
      else if (o.fa.some((a) => a.startsWith(q))) s = 1.5;
      else if (o.f.includes(q)) s = 2;
      if (s === 99) { const ho = o.fo.find((x) => x.f.startsWith(q) || x.f.split(' ').some((w) => w.startsWith(q))); if (ho && q.length >= 2) { s = 3; via = ho.n; } }
      if (s < 99) out.push({ o, s, via });
    }
    return out.sort((a, b) => a.s - b.s || a.o.n.localeCompare(b.o.n, 'vi'));
  }
  function hl(name, v) {
    const q = fold(v);
    if (!q) return esc(name);
    const f = fold(name);
    let i = f.indexOf(q);
    if (i < 0) return esc(name);
    // giữ nguyên độ dài khi bỏ dấu (NFC → mỗi ký tự 1 đơn vị) để cắt đúng vị trí
    return esc(name.slice(0, i)) + '<mark>' + esc(name.slice(i, i + q.length)) + '</mark>' + esc(name.slice(i + q.length));
  }
  function render() {
    const v = inp.value;
    results = search(v).slice(0, c.max || 40);
    let html = results.map((r, i) => `<li role="option" id="${c.id}-o${i}" class="f-opt-li ${i === active ? 'active' : ''}" aria-selected="${i === active}" data-i="${i}">
      <span class="f-opt-n">${hl(r.o.n, v)}</span>${r.via ? `<span class="f-opt-m">Gồm ${esc(r.via)} cũ</span>` : (r.o.o && r.o.o.length && c.showOld ? `<span class="f-opt-m">Gồm ${r.o.o.map(esc).join(', ')} cũ</span>` : '')}</li>`).join('');
    const vt = v.trim();
    if (c.allowFree && vt && !exact(vt)) {
      html += `<li role="option" id="${c.id}-ofree" class="f-opt-li free ${active === results.length ? 'active' : ''}" aria-selected="${active === results.length}" data-free="1"><span class="f-opt-n">Dùng “${esc(vt)}”</span><span class="f-opt-m">Không có trong danh sách</span></li>`;
    }
    if (!results.length && !c.allowFree) html = `<li class="f-opt-empty" role="option" aria-disabled="true">Không tìm thấy “${esc(vt)}”. Thử gõ không dấu hoặc tên khác.</li>`;
    lb.innerHTML = html;
    live.textContent = results.length ? `${results.length} kết quả` : 'Không có kết quả';
    const a = lb.querySelector('.active');
    inp.setAttribute('aria-activedescendant', a ? a.id : '');
    if (a) a.scrollIntoView({ block: 'nearest' });
  }
  function open() { lb.hidden = false; inp.setAttribute('aria-expanded', 'true'); render(); }
  function close() { lb.hidden = true; inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); active = -1; }
  function pick(o, via) {
    selected = o; free = false; inp.value = o.n; close();
    if (ctl.errShown) clearErr(ctl);
    note.innerHTML = via ? `${ic('info', 16)}<span>Từ 01/07/2025, ${esc(via)} thuộc <b>${esc(o.n)}</b>.</span>` : '';
    c.onChange && c.onChange(ctl);
  }
  function pickFree() {
    const v = inp.value.trim(); selected = null; free = true; close();
    if (ctl.errShown) clearErr(ctl);
    note.innerHTML = `${ic('info', 16)}<span>Sẽ dùng tên bạn nhập: <b>${esc(v)}</b></span>`;
    c.onChange && c.onChange(ctl);
  }
  inp.addEventListener('focus', () => { if (!c.noOpenOnFocus) open(); });
  inp.addEventListener('click', () => { if (lb.hidden) open(); });
  inp.addEventListener('input', () => { selected = null; free = false; active = inp.value.trim() ? 0 : -1; note.innerHTML = ''; open(); if (ctl.errShown && !ctl.check()) clearErr(ctl); });
  inp.addEventListener('keydown', (e) => {
    const n = results.length + (c.allowFree && inp.value.trim() && !exact(inp.value.trim()) ? 1 : 0);
    if (e.key === 'ArrowDown') { e.preventDefault(); if (lb.hidden) open(); active = Math.min(n - 1, active + 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(0, active - 1); render(); }
    else if (e.key === 'Enter') {
      if (!lb.hidden && active >= 0) { e.preventDefault(); if (active < results.length) pick(results[active].o, results[active].via); else pickFree(); }
    } else if (e.key === 'Escape') { if (!lb.hidden) { e.preventDefault(); close(); } }
    else if (e.key === 'Tab') { close(); }
  });
  lb.addEventListener('mousedown', (e) => e.preventDefault());
  lb.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-i], li[data-free]');
    if (!li) return;
    if (li.dataset.free) pickFree(); else { const r = results[+li.dataset.i]; pick(r.o, r.via); }
    inp.focus();
  });
  inp.addEventListener('blur', () => {
    setTimeout(() => afterPointer(() => {
      if (document.activeElement === inp) return;
      close();
      const v = inp.value.trim();
      if (!v) { if (ctl.errShown) ctl.validate(); return; }
      if (!selected) {
        const ex = exact(v);
        if (ex) pick(ex);
        else if (!c.allowFree) {
          const r = search(v);
          if (r.length === 1) pick(r[0].o, r[0].via);
        } else if (!free) pickFree();
      }
      ctl.touched = true;
      ctl.validate();
    }), 120);
  });
  return ctl;
}

/* ---------- Tải tệp ---------- */
function fileHTML(c) {
  return `<div class="f-field" id="fw-${c.id}" data-fid="${c.id}">
    ${labelHTML(c)}${hintP(c)}${errP(c.id)}
    <div class="f-file" data-state="idle">
      <input type="file" class="f-file-in" id="${c.id}" name="${c.id}" accept="${c.accept}" ${c.hint ? `aria-describedby="${c.id}-hint"` : ''} ${c.required ? 'aria-required="true"' : ''}>
      <div class="f-drop">
        <span class="f-drop-ic" aria-hidden="true">${ic('upload', 22)}</span>
        <span class="f-drop-t"><span class="only-fine">Kéo thả tệp vào đây hoặc</span></span>
        <label class="btn btn-sec btn-sm f-file-btn" for="${c.id}">Chọn tệp</label>
      </div>
      <div class="f-filecard" hidden></div>
    </div>
    <p class="vh" aria-live="polite" id="${c.id}-live"></p>
  </div>`;
}
function mountFile(c, root) {
  const el = root.querySelector(`#fw-${CSS.escape(c.id)}`);
  const inp = el.querySelector(`#${CSS.escape(c.id)}`);
  const box = el.querySelector('.f-file');
  const drop = el.querySelector('.f-drop');
  const card = el.querySelector('.f-filecard');
  const live = el.querySelector(`#${CSS.escape(c.id)}-live`);
  const ctl = baseCtl(c, el);
  let st = { status: 'idle', file: null, meta: null, pct: 0, timer: null, url: null, note: '' };
  ctl.inputs = () => [inp];
  ctl.get = () => (st.status === 'done' ? st.meta : null);
  ctl.status = () => st.status;
  ctl.set = (meta) => { if (meta) { st.meta = meta; st.status = 'done'; st.note = ''; draw(); } };
  ctl.check = () => {
    if (st.status === 'uploading') return 'Đợi tệp tải lên xong rồi tiếp tục';
    if (st.status === 'failed') return 'Tệp chưa tải lên được. Bấm Thử lại hoặc chọn tệp khác';
    if (st.status !== 'done' && c.required) return c.emptyMsg;
    return '';
  };
  ctl.validate = (force) => { const m = ctl.check(); if (m) { if (force || ctl.errShown) setErr(ctl, m); } else clearErr(ctl); return m; };
  const ext = (n) => (n.split('.').pop() || '').toLowerCase();
  function reject(f, msg) { st.status = 'idle'; draw(); setErr(ctl, msg); announce(msg); inp.value = ''; }
  async function choose(f) {
    if (!f) return;
    clearErr(ctl);
    const e = ext(f.name);
    if (f.size === 0) return reject(f, `Tệp "${f.name}" trống (0 byte). Hãy kiểm tra tệp mở được trên máy rồi tải lên lại`);
    if (c.fileKind === 'image' && (e === 'heic' || e === 'heif' || /heic|heif/.test(f.type))) return reject(f, `Ảnh "${f.name}" ở định dạng HEIC. Hãy chọn ảnh JPG/PNG, hoặc trên iPhone vào Cài đặt > Camera > Định dạng > Tương thích nhất`);
    if (!c.exts.includes(e)) return reject(f, `Tệp "${f.name}" không đúng định dạng. Hãy tải lên tệp ${c.extLabel}`);
    let file = f, note = '';
    if (f.size > c.maxMB * 1024 * 1024) {
      if (c.fileKind === 'image' && c.compress) {
        try {
          const out = await compressImage(f, c.maxMB);
          if (out && out.size <= c.maxMB * 1024 * 1024) { note = `Ảnh đã được tối ưu từ ${fmtMB(f.size)} còn ${fmtMB(out.size)}`; file = new File([out], f.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }); }
          else return reject(f, `Tệp "${f.name}" có dung lượng ${fmtMB(f.size)}, vượt giới hạn ${c.maxMB} MB`);
        } catch (err) { return reject(f, `Tệp "${f.name}" có dung lượng ${fmtMB(f.size)}, vượt giới hạn ${c.maxMB} MB`); }
      } else return reject(f, `Tệp "${f.name}" có dung lượng ${fmtMB(f.size)}, vượt giới hạn ${c.maxMB} MB`);
    }
    st.file = file; st.note = note;
    let thumb = '';
    if (c.fileKind === 'image') { try { thumb = await makeThumb(file); } catch (err) { thumb = ''; } }
    st.meta = { name: file.name, size: file.size, type: file.type, thumb };
    upload();
  }
  function upload() {
    clearInterval(st.timer);
    st.status = 'uploading'; st.pct = 0; draw();
    announce(`Đang tải lên ${st.meta.name}`);
    const total = Math.min(3200, Math.max(900, st.meta.size / (3 * 1024 * 1024) * 1000));
    const t0 = Date.now();
    st.timer = setInterval(() => {
      st.pct = Math.min(100, Math.round((Date.now() - t0) / total * 100));
      if (SIM.offline && st.pct >= 55) { clearInterval(st.timer); st.status = 'failed'; draw(); announce('Tải lên bị gián đoạn do mất kết nối'); return; }
      if (st.pct >= 100) { clearInterval(st.timer); st.status = 'done'; draw(); announce(`Đã tải lên ${st.meta.name}`); if (ctl.errShown) clearErr(ctl); c.onChange && c.onChange(ctl); return; }
      drawProgress();
    }, 120);
  }
  function drawProgress() {
    const bar = card.querySelector('.f-prog i'); const tx = card.querySelector('.f-prog-t');
    if (bar) bar.style.width = st.pct + '%';
    if (tx) tx.textContent = `Đang tải lên ${st.pct}% · ${fmtMB(st.meta.size * st.pct / 100)} / ${fmtMB(st.meta.size)}`;
  }
  function draw() {
    box.dataset.state = st.status;
    if (st.status === 'idle') { drop.hidden = false; card.hidden = true; card.innerHTML = ''; return; }
    drop.hidden = true; card.hidden = false;
    const m = st.meta;
    const th = m.thumb ? `<img class="f-thumb" src="${m.thumb}" alt="Ảnh thu nhỏ của ${esc(m.name)}">` : `<span class="f-thumb f-thumb-ic" aria-hidden="true">${ic(c.fileKind === 'image' ? 'image' : 'file', 22)}</span>`;
    let status = '', actions = '';
    if (st.status === 'uploading') {
      status = `<div class="f-prog" role="progressbar" aria-label="Tiến trình tải lên" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${st.pct}"><i style="width:${st.pct}%"></i></div><span class="f-prog-t">Đang tải lên ${st.pct}%</span>`;
      actions = `<button type="button" class="btn btn-ghost btn-sm" data-act="cancel">Hủy</button>`;
    } else if (st.status === 'failed') {
      status = `<span class="f-file-st err">${ic('wifioff', 15)} Tải lên bị gián đoạn do mất kết nối</span>`;
      actions = `<button type="button" class="btn btn-sec btn-sm" data-act="retry">Thử lại</button><button type="button" class="btn btn-ghost btn-sm" data-act="remove">Xóa</button>`;
    } else {
      status = `<span class="f-file-st ok">${ic('ok', 15)} Đã tải lên · ${fmtMB(m.size)}</span>${st.note ? `<span class="f-file-note">${esc(st.note)}</span>` : ''}`;
      actions = `<label class="btn btn-sec btn-sm" for="${c.id}">Thay tệp</label><button type="button" class="btn btn-ghost btn-sm" data-act="remove">Xóa<span class="vh"> tệp ${esc(m.name)}</span></button>`;
    }
    card.innerHTML = `${th}<div class="f-file-main"><span class="f-file-n">${esc(m.name)}</span>${status}</div><div class="f-file-acts">${actions}</div>`;
  }
  function remove() {
    const prev = { ...st, timer: null };
    clearInterval(st.timer);
    st = { status: 'idle', file: null, meta: null, pct: 0, timer: null, note: '' };
    inp.value = '';
    draw();
    const u = document.createElement('div');
    u.className = 'f-undo';
    u.innerHTML = `<span>Đã xóa tệp ${esc(prev.meta.name)}.</span> <button type="button" class="f-linkbtn">Hoàn tác</button>`;
    el.querySelector('.f-file').after(u);
    announce(`Đã xóa tệp ${prev.meta.name}`);
    const kill = setTimeout(() => u.remove(), 6000);
    u.querySelector('button').addEventListener('click', () => {
      clearTimeout(kill); u.remove();
      st = { ...prev, status: prev.status === 'uploading' ? 'idle' : prev.status };
      if (st.status === 'idle') { draw(); } else draw();
      c.onChange && c.onChange(ctl);
      inp.focus();
    });
    c.onChange && c.onChange(ctl);
  }
  card.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    if (b.dataset.act === 'cancel') { clearInterval(st.timer); st.status = 'idle'; inp.value = ''; draw(); announce('Đã hủy tải lên'); inp.focus(); }
    if (b.dataset.act === 'retry') upload();
    if (b.dataset.act === 'remove') remove();
  });
  inp.addEventListener('change', () => choose(inp.files[0]));
  ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', (e) => { const f = e.dataTransfer && e.dataTransfer.files[0]; if (f) choose(f); });
  ctl.choose = choose;
  return ctl;
}
function loadImg(file) {
  return new Promise((res, rej) => { const u = URL.createObjectURL(file); const im = new Image(); im.onload = () => { res(im); setTimeout(() => URL.revokeObjectURL(u), 1000); }; im.onerror = rej; im.src = u; });
}
async function compressImage(file, maxMB) {
  const im = await loadImg(file);
  const scale = Math.min(1, 1600 / Math.max(im.width, im.height));
  const cv = document.createElement('canvas');
  cv.width = Math.round(im.width * scale); cv.height = Math.round(im.height * scale);
  cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
  for (const q of [0.85, 0.72, 0.6]) {
    const b = await new Promise((r) => cv.toBlob(r, 'image/jpeg', q));
    if (b && b.size <= maxMB * 1024 * 1024) return b;
  }
  return null;
}
async function makeThumb(file) {
  const im = await loadImg(file);
  const s = 120 / Math.max(im.width, im.height);
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, Math.round(im.width * s)); cv.height = Math.max(1, Math.round(im.height * s));
  cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
  return cv.toDataURL('image/jpeg', 0.8);
}
/* Tệp mẫu để thử khi không có sẵn tệp */
function sampleImage(w = 600, h = 800, label = 'Ảnh mẫu') {
  return new Promise((res) => {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const g = cv.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#dfe6f7'); gr.addColorStop(1, '#b9c5ea');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#5b6b9a'; g.beginPath(); g.arc(w / 2, h * 0.38, w * 0.2, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(w / 2, h * 0.92, w * 0.38, h * 0.3, 0, Math.PI, 0); g.fill();
    g.fillStyle = '#2b3a66'; g.font = `600 ${Math.round(w / 16)}px sans-serif`; g.textAlign = 'center'; g.fillText(label, w / 2, h * 0.08);
    cv.toBlob((b) => res(new File([b], 'chan-dung-mau.jpg', { type: 'image/jpeg' })), 'image/jpeg', 0.9);
  });
}
function samplePdf(name = 'bai-du-thi.pdf', bytes = 420 * 1024) {
  const head = '%PDF-1.4\n% Tep mau\n';
  const buf = new Uint8Array(bytes); for (let i = 0; i < head.length; i++) buf[i] = head.charCodeAt(i);
  return new File([buf], name, { type: 'application/pdf' });
}

/* ---------- Bộ điều phối form ---------- */
const KINDS = {
  text: [textHTML, mountText], dob: [dobHTML, mountDob], radio: [radioHTML, mountRadio],
  check: [checkHTML, mountCheck], combo: [comboHTML, mountCombo], file: [fileHTML, mountFile],
};
const fieldHTML = (c) => KINDS[c.kind || 'text'][0](c);
const mountField = (c, root) => KINDS[c.kind || 'text'][1](c, root);

function makeForm() {
  const ctls = [];
  return {
    ctls,
    add(c) { ctls.push(c); return c; },
    by(id) { return ctls.find((c) => c.id === id); },
    validate() {
      const errs = [];
      ctls.forEach((c) => { if (!c.visible()) { clearErr(c); return; } const m = c.validate(true); if (m) errs.push({ ctl: c, msg: m }); });
      return errs;
    },
  };
}
function summaryHTML(errs, title) {
  return `<div class="f-summary" role="alert" tabindex="-1">
    <h3 class="f-summary-t">${ic('alert', 20)}${esc(title || `Cần sửa ${errs.length} mục trước khi tiếp tục`)}</h3>
    <ul>${errs.map((e, i) => `<li><a href="#${esc(e.ctl.focusId())}" data-err-i="${i}">${esc(e.msg)}</a></li>`).join('')}</ul>
  </div>`;
}
function showSummary(box, errs, form, title) {
  if (!errs.length) { box.innerHTML = ''; box.hidden = true; return; }
  box.innerHTML = summaryHTML(errs, title);
  box.hidden = false;
  const s = box.querySelector('.f-summary');
  s.focus({ preventScroll: true });
  s.scrollIntoView({ block: 'start', behavior: 'smooth' });
  s.addEventListener('click', (e) => {
    const a = e.target.closest('[data-err-i]'); if (!a) return;
    e.preventDefault();
    const er = errs[+a.dataset.errI]; er && er.ctl.focus && er.ctl.focus();
  });
}

/* Đoạn mã HTML chuẩn cho thư viện trường */
function snippetFor(c) {
  const at = (k, v) => (v ? ` ${k}="${v}"` : '');
  const hintId = c.hint ? `${c.id}-hint` : '';
  const req = c.required ? ' <span aria-hidden="true">*</span>' : ' <span class="opt">(không bắt buộc)</span>';
  const hint = c.hint ? `\n  <p class="hint" id="${c.id}-hint">${stripTags(c.hint)}</p>` : '';
  const err = `\n  <p class="error" id="${c.id}-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>`;
  if (c.kind === 'dob') {
    return `<fieldset class="field" aria-describedby="${hintId}">\n  <legend>${stripTags(c.label)}${req}</legend>${hint}${err}\n  <div class="date">\n    <label for="${c.id}-d">Ngày</label>\n    <input id="${c.id}-d" name="${c.id}-d" inputmode="numeric" autocomplete="bday-day" class="w-2">\n    <label for="${c.id}-m">Tháng</label>\n    <input id="${c.id}-m" name="${c.id}-m" inputmode="numeric" autocomplete="bday-month" class="w-2">\n    <label for="${c.id}-y">Năm</label>\n    <input id="${c.id}-y" name="${c.id}-y" inputmode="numeric" autocomplete="bday-year" class="w-4">\n  </div>\n</fieldset>`;
  }
  if (c.kind === 'radio') {
    return `<fieldset class="field"${at('aria-describedby', hintId)}>\n  <legend>${stripTags(c.label)}${req}</legend>${hint}${err}\n${c.options.map((o, i) => `  <label><input type="radio" name="${c.id}" value="${o.v}"${o.disabled ? ' disabled' : ''}> ${o.n}</label>`).join('\n')}\n</fieldset>`;
  }
  if (c.kind === 'check') {
    return `<div class="field">${err}\n  <label><input type="checkbox" id="${c.id}" name="${c.id}"${c.required ? ' aria-required="true"' : ''}> ${stripTags(c.label)}</label>\n</div>`;
  }
  if (c.kind === 'combo') {
    return `<div class="field">\n  <label for="${c.id}">${stripTags(c.label)}${req}</label>${hint}${err}\n  <input id="${c.id}" type="text" role="combobox" aria-autocomplete="list"\n         aria-expanded="false" aria-controls="${c.id}-list"${at('autocomplete', c.autocomplete || 'off')}${at('aria-describedby', hintId)}>\n  <ul id="${c.id}-list" role="listbox" hidden></ul>\n</div>`;
  }
  if (c.kind === 'file') {
    return `<div class="field">\n  <label for="${c.id}">${stripTags(c.label)}${req}</label>${hint}${err}\n  <input type="file" id="${c.id}" name="${c.id}" accept="${c.accept}"${at('aria-describedby', hintId)}>\n</div>`;
  }
  const tag = c.multiline ? 'textarea' : 'input';
  const attrs = [
    `id="${c.id}"`, `name="${c.name || c.id}"`, c.multiline ? `rows="${c.rows || 6}"` : `type="${c.type || 'text'}"`,
    c.inputmode ? `inputmode="${c.inputmode}"` : '', `autocomplete="${c.autocomplete || 'off'}"`,
    c.spellcheck === false ? 'spellcheck="false"' : '', c.autocapitalize ? `autocapitalize="${c.autocapitalize}"` : '',
    c.enterkeyhint ? `enterkeyhint="${c.enterkeyhint}"` : '', c.required ? 'aria-required="true"' : '', hintId ? `aria-describedby="${hintId}"` : '',
  ].filter(Boolean);
  const lines = []; let line = '  <' + tag;
  attrs.forEach((a) => { if ((line + ' ' + a).length > 74) { lines.push(line); line = '    ' + ' '.repeat(tag.length) + a; } else line += ' ' + a; });
  lines.push(line + (c.multiline ? '></textarea>' : '>'));
  return `<div class="field">\n  <label for="${c.id}">${stripTags(c.label)}${req}</label>${hint}${err}\n${lines.join('\n')}${c.counter ? `\n  <p class="count" aria-live="polite">Còn ${c.counter.max} từ</p>` : ''}\n</div>`;
}
function stripTags(s) { return String(s).replace(/<[^>]+>/g, ''); }
