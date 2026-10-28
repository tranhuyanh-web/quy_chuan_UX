/* ============================================================
   CHẤM TỰ ĐỘNG — đọc HTML của luồng đăng ký và chấm theo bộ nguyên tắc
   Kết quả mỗi nguyên tắc: pass (Đạt) · fail (Chưa đạt) · warn (Cần xem lại)
                           manual (Cần thử tay) · na (Không áp dụng)
   ============================================================ */
const AZ_ST = {
  fail: { n: 'Chưa đạt', ic: 'alert', o: 0 },
  warn: { n: 'Cần xem lại', ic: 'info', o: 1 },
  manual: { n: 'Cần thử tay', ic: 'pointer', o: 3 },
  pass: { n: 'Đạt', ic: 'ok', o: 2 },
  na: { n: 'Không áp dụng', ic: 'x', o: 4 },
};
const AZ_KIND = {
  name: 'Họ và tên', firstname: 'Tên', lastname: 'Họ', email: 'Email', confirmEmail: 'Nhập lại email', phone: 'Số điện thoại',
  dob: 'Ngày sinh', dobPart: 'Ngày sinh (ô con)', age: 'Tuổi', cccd: 'Số giấy tờ', otp: 'Mã OTP', password: 'Mật khẩu', confirmPassword: 'Nhập lại mật khẩu',
  province: 'Tỉnh/Thành', district: 'Quận/Huyện', ward: 'Phường/Xã', address: 'Địa chỉ', school: 'Trường/Đơn vị', gender: 'Giới tính',
  consent: 'Đồng ý điều khoản', marketing: 'Nhận tin', url: 'Đường dẫn', file: 'Tệp', longtext: 'Văn bản dài', sensitive: 'Thông tin nhạy cảm',
  choice: 'Lựa chọn', check: 'Hộp chọn', text: 'Ô chữ', number: 'Số', date: 'Ngày', search: 'Tìm kiếm', other: 'Khác',
};
const OLD_PROVINCES = ['Hà Giang', 'Yên Bái', 'Bắc Kạn', 'Vĩnh Phúc', 'Hòa Bình', 'Bắc Giang', 'Thái Bình', 'Hải Dương', 'Hà Nam', 'Nam Định', 'Quảng Bình', 'Quảng Nam', 'Kon Tum', 'Bình Định', 'Ninh Thuận', 'Đắk Nông', 'Bình Thuận', 'Phú Yên', 'Bình Phước', 'Bình Dương', 'Bà Rịa', 'Long An', 'Bến Tre', 'Trà Vinh', 'Tiền Giang', 'Bạc Liêu', 'Kiên Giang', 'Sóc Trăng', 'Hậu Giang'];

const azClean = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const azCut = (s, n = 60) => { s = azClean(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; };

/* ---------- Đọc tệp MHTML (Chrome "Một tệp duy nhất") ---------- */
function azFromMhtml(raw) {
  const m = raw.match(/boundary="?([^"\r\n;]+)"?/i);
  if (!m) return raw;
  const parts = raw.split('--' + m[1]);
  for (const p of parts) {
    const sep = p.search(/\r?\n\r?\n/);
    if (sep < 0) continue;
    const head = p.slice(0, sep), body = p.slice(sep).replace(/^\r?\n\r?\n/, '');
    if (!/content-type:\s*text\/html/i.test(head)) continue;
    const cs = (head.match(/charset="?([\w-]+)/i) || [])[1] || 'utf-8';
    let bytes;
    if (/quoted-printable/i.test(head)) {
      const s = body.replace(/=\r?\n/g, '');
      const out = []; for (let i = 0; i < s.length; i++) { if (s[i] === '=' && /^[0-9A-F]{2}$/i.test(s.substr(i + 1, 2))) { out.push(parseInt(s.substr(i + 1, 2), 16)); i += 2; } else out.push(s.charCodeAt(i) & 255); }
      bytes = new Uint8Array(out);
    } else if (/base64/i.test(head)) {
      const bin = atob(body.replace(/\s+/g, '')); bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    } else return body;
    try { return new TextDecoder(cs).decode(bytes); } catch (e) { return new TextDecoder().decode(bytes); }
  }
  return raw;
}

/* ---------- Màu và tương phản ---------- */
function azRgb(s) {
  const m = String(s || '').match(/rgba?\(([^)]+)\)/); if (!m) return null;
  const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
}
function azBlend(c, bg) { if (!c) return bg; const a = c.a; return { r: c.r * a + bg.r * (1 - a), g: c.g * a + bg.g * (1 - a), b: c.b * a + bg.b * (1 - a), a: 1 }; }
function azLum(c) { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); }
function azContrast(fg, bg) {
  const b = azBlend(azRgb(bg), { r: 255, g: 255, b: 255, a: 1 });
  const f = azBlend(azRgb(fg), b);
  if (!f || !b) return 21;
  const l1 = azLum(f), l2 = azLum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/* ---------- Thu thập điều khiển ---------- */
function azHidden(el) {
  if (el.getAttribute('data-fx-vis') === '0') return true;
  for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
    if (n.hasAttribute('hidden') || n.getAttribute('aria-hidden') === 'true') return true;
    const st = (n.getAttribute('style') || '').replace(/\s+/g, '').toLowerCase();
    if (/display:none|visibility:hidden/.test(st)) return true;
    if (n.tagName === 'TEMPLATE') return true;
  }
  return false;
}
function azOwnText(lab) {
  const c = lab.cloneNode(true);
  c.querySelectorAll('input,select,textarea,button,script,style').forEach((x) => x.remove());
  return azClean(c.textContent);
}
function azByIds(doc, ids) { return azClean(String(ids || '').split(/\s+/).filter(Boolean).map((id) => { const e = doc.getElementById(id); return e ? e.textContent : ''; }).join(' ')); }
function azLabel(doc, el) {
  if (el.id) {
    let l = null;
    try { l = doc.querySelector(`label[for="${CSS.escape(el.id)}"]`); } catch (e) { l = null; }
    if (l && azOwnText(l)) return { text: azOwnText(l), src: 'label', node: l };
  }
  const wrap = el.closest('label');
  if (wrap && azOwnText(wrap)) return { text: azOwnText(wrap), src: 'wrap', node: wrap };
  if (el.getAttribute('aria-labelledby')) { const t = azByIds(doc, el.getAttribute('aria-labelledby')); if (t) return { text: t, src: 'labelledby' }; }
  /* Nhãn đứng ngay trước ô nhưng không gắn for/id */
  const prev = el.previousElementSibling;
  if (prev && prev.tagName === 'LABEL' && !prev.getAttribute('for') && azOwnText(prev)) return { text: azOwnText(prev), src: 'orphan', node: prev };
  const par = el.parentElement;
  if (par) {
    const pl = Array.from(par.children).find((c) => c.tagName === 'LABEL' && !c.getAttribute('for') && !c.querySelector('input,select,textarea'));
    if (pl && azOwnText(pl)) return { text: azOwnText(pl), src: 'orphan', node: pl };
  }
  if (el.getAttribute('aria-label')) return { text: azClean(el.getAttribute('aria-label')), src: 'aria' };
  if (el.getAttribute('title')) return { text: azClean(el.getAttribute('title')), src: 'title' };
  if (el.getAttribute('placeholder')) return { text: azClean(el.getAttribute('placeholder')), src: 'placeholder' };
  return { text: '', src: 'none' };
}
function azHint(doc, el, labelNode) {
  let t = azByIds(doc, el.getAttribute('aria-describedby'));
  if (t) return t;
  /* Vùng chứa riêng của trường: đi lên tới khi gặp khối chứa nhiều ô khác */
  const nm = el.getAttribute('name');
  let box = null;
  for (let b = el.parentElement, k = 0; b && k < 4; b = b.parentElement, k++) {
    const ctrls = Array.from(b.querySelectorAll('input:not([type=hidden]),select,textarea'));
    if (ctrls.some((c) => c !== el && (!nm || c.getAttribute('name') !== nm))) break;
    box = b;
  }
  if (!box) return '';
  const cands = box.querySelectorAll('small,.hint,.help,.help-text,.form-text,.text-muted,.description,.note,.f-hint,p,span');
  for (const c of cands) {
    if (labelNode && labelNode.contains(c)) continue;
    if (c.querySelector('input,select,textarea')) continue;
    const s = azClean(c.textContent);
    if (s && s.length < 220 && /ví dụ|vd[:.]|định dạng|tối đa|tối thiểu|gồm|\bmb\b|\bkb\b|ký tự|chữ số|\btừ\b|pdf|jpg|png/i.test(s)) return s;
  }
  return '';
}
function azKindOf(f) {
  const t = fold([f.label, f.name, f.id, f.ph, f.ac].join(' '));
  const lab = fold(f.label);
  if (f.type === 'file') return 'file';
  if (f.type === 'password') return /nhap lai|xac nhan|confirm|re-?enter|repeat|again|lap lai/.test(t) ? 'confirmPassword' : 'password';
  if (/one-time-code|\botp\b|ma xac (thuc|nhan)|verification code|ma kich hoat/.test(t)) return 'otp';
  if (/e-?mail|thu dien tu/.test(t)) return /nhap lai|xac nhan|confirm|re-?enter|repeat|lap lai/.test(t) ? 'confirmEmail' : 'email';
  if (/thu nhap|muc luong|hon nhan|ton giao|nhom mau|suc khoe|benh ly|dang vien|chinh tri|income|salary|religion|marital/.test(t)) return 'sensitive';
  if (/cccd|cmnd|can cuoc|chung minh|so dinh danh|id ?card|ho chieu|passport|citizen/.test(t)) return 'cccd';
  if (/\bsdt\b|so dt|dien thoai|di dong|phone|mobile|\btel\b|hotline|zalo/.test(t) && !/telegram/.test(t)) return 'phone';
  if (f.type === 'checkbox') {
    if (/khuyen mai|quang cao|nhan tin|ban tin|newsletter|marketing|uu dai|doi tac/.test(t)) return /dieu khoan|the le|chinh sach|dong y voi/.test(t) ? 'consent' : 'marketing';
    if (/dong y|dieu khoan|the le|chinh sach|cam ket|agree|terms|policy|xac nhan thong tin/.test(t)) return 'consent';
    return 'check';
  }
  if (/gioi tinh|gender|\bsex\b/.test(t)) return 'gender';
  if (/ngay sinh|nam sinh|sinh nhat|birth|\bdob\b|bday/.test(t)) return (/^(ngay|thang|nam|day|month|year|dd|mm|yyyy)$/.test(lab) || /bday-(day|month|year)/.test(t)) ? 'dobPart' : 'dob';
  if (/^(ngay|thang|nam)$/.test(lab)) return 'dobPart';
  if (/^tuoi$|\btuoi\b|\bage\b/.test(t)) return 'age';
  if (/quan\s*\/?\s*huyen|quan huyen|\bhuyen\b|district/.test(t)) return 'district';
  if (/phuong\s*\/?\s*xa|phuong|\bxa\b|ward|commune|address-level2/.test(t)) return 'ward';
  if (/tinh\s*\/?\s*thanh|tinh thanh|\btinh\b|province|thanh pho|address-level1|\bcity\b/.test(t)) return 'province';
  if (/dia chi|so nha|ten duong|address|street/.test(t)) return 'address';
  if (/^ho$|last ?name|surname|family ?name|family-name/.test(lab + ' ' + fold(f.name) + ' ' + fold(f.ac))) return 'lastname';
  if (/^ten$|first ?name|given ?name|given-name/.test(lab + ' ' + fold(f.name) + ' ' + fold(f.ac))) return 'firstname';
  if (/ho (va )?ten|ho ten|full ?name|fullname|your name|^name$|\bname\b|\bten\b/.test(t) && !/ten (truong|don vi|doi|y tuong|tac pham|cong ty|du an|nhom|san pham|bai)/.test(t)) return 'name';
  if (/truong|school|university|dai hoc|don vi|co quan|cong ty|organization|to chuc/.test(t)) return 'school';
  if (f.type === 'url' || /link|duong dan|url|website|portfolio|facebook/.test(t)) return 'url';
  if (f.tag === 'textarea') return 'longtext';
  if (f.type === 'radio' || f.tag === 'select' || f.type === 'select') return 'choice';
  if (f.type === 'number') return 'number';
  if (f.type === 'date') return 'date';
  if (f.type === 'search') return 'search';
  return 'text';
}

function azCollect(doc, metrics) {
  const M = metrics ? metrics.controls || [] : [];
  const D = metrics ? metrics.desktop || [] : [];
  const mOf = (el) => { const i = el.getAttribute('data-fx-i'); return i != null ? { m: M[+i], d: D[+i] } : { m: null, d: null }; };
  const nodes = Array.from(doc.querySelectorAll('input, select, textarea, [role=combobox], [role=textbox], [role=radio], [role=checkbox], [role=switch], [role=listbox]'));
  const fields = [], radios = new Map(), boxes = [];
  for (const el of nodes) {
    const tag = el.tagName.toLowerCase();
    let type = tag === 'input' ? (el.getAttribute('type') || 'text').toLowerCase() : tag;
    const role = el.getAttribute('role');
    if (tag !== 'input' && tag !== 'select' && tag !== 'textarea') {
      if (el.querySelector('input,select,textarea')) continue;
      type = role === 'radio' ? 'radio' : role === 'checkbox' ? 'checkbox' : role === 'switch' ? 'switch' : role === 'combobox' || role === 'listbox' ? 'combobox' : 'text';
    }
    if (['hidden', 'submit', 'button', 'reset', 'image'].includes(type)) continue;
    const { m, d } = mOf(el);
    const hid = azHidden(el) && !(m && m.styled);
    if (hid) continue;
    const nm = (el.getAttribute('name') || '').toLowerCase();
    if (/honeypot|hp_|^bot|_gotcha/.test(nm)) continue;
    const lb = azLabel(doc, el);
    const f = {
      el, tag, type, role, name: el.getAttribute('name') || '', id: el.id || '', label: lb.text, labelSrc: lb.src, labelNode: lb.node,
      ph: el.getAttribute('placeholder') || '', ac: (el.getAttribute('autocomplete') || '').toLowerCase(), im: (el.getAttribute('inputmode') || '').toLowerCase(),
      maxlength: el.hasAttribute('maxlength') ? +el.getAttribute('maxlength') : null, pattern: el.getAttribute('pattern') || '',
      req: el.hasAttribute('required') || el.getAttribute('aria-required') === 'true', checked: el.hasAttribute('checked') || el.getAttribute('aria-checked') === 'true',
      onpaste: /return\s+false|preventdefault/i.test((el.getAttribute('onpaste') || '') + (el.getAttribute('oncopy') || '') + (el.getAttribute('oncut') || '')) || el.getAttribute('onpaste') !== null,
      disabled: el.hasAttribute('disabled'), ekh: el.getAttribute('enterkeyhint') || '', accept: el.getAttribute('accept') || '', m, d, issues: new Set(),
      form: el.closest('form'), fieldset: el.closest('fieldset'),
    };
    f.hint = azHint(doc, el, lb.node);
    if (tag === 'select') {
      const opts = Array.from(el.querySelectorAll('option')).map((o) => azClean(o.textContent));
      f.optsAll = opts;
      f.opts = opts.filter((o, i) => o && !/^[-–—\s]*(chọn|chon|select|--|vui lòng)/i.test(o) && !(i === 0 && /^[-–—.\s]*$/.test(o)));
    }
    if (type === 'radio') {
      const key = (el.getAttribute('name') || ('_' + fields.length)) + '|' + (el.closest('form') ? 'f' : '');
      if (radios.has(key)) { const g = radios.get(key); g.group.push(f); if (f.checked) g.checked = true; continue; }
      const gl = azGroupLabel(doc, el);
      f.group = [f]; f.optLabel = f.label; f.label = gl.text || f.label; f.groupSrc = gl.src;
      radios.set(key, f);
    }
    f.kind = azKindOf(f);
    fields.push(f);
  }
  fields.forEach((f, i) => { f.n = i + 1; });
  return fields;
}
function azGroupLabel(doc, el) {
  const fs = el.closest('fieldset');
  if (fs) { const lg = fs.querySelector('legend'); if (lg && azClean(lg.textContent)) return { text: azClean(lg.textContent), src: 'legend' }; }
  const rg = el.closest('[role=radiogroup],[role=group]');
  if (rg) {
    if (rg.getAttribute('aria-labelledby')) { const t = azByIds(doc, rg.getAttribute('aria-labelledby')); if (t) return { text: t, src: 'legend' }; }
    if (rg.getAttribute('aria-label')) return { text: azClean(rg.getAttribute('aria-label')), src: 'legend' };
  }
  /* Văn bản đứng trước nhóm (không có fieldset) */
  let box = el.closest('div,li,p,td');
  for (let k = 0; box && k < 3; k++, box = box.parentElement) {
    const t = Array.from(box.children).find((c) => !c.querySelector('input') && /^(LABEL|P|SPAN|DIV|STRONG|B|H\d)$/.test(c.tagName) && azClean(c.textContent).length > 1 && azClean(c.textContent).length < 120);
    if (t) return { text: azClean(t.textContent), src: 'nearby' };
  }
  return { text: '', src: 'none' };
}
const azName = (f) => azCut(f.label || f.ph || f.name || f.id || AZ_KIND[f.kind] || f.type, 48);

/* ---------- Chấm một trang ---------- */
function azAnalyzePage(html, opt = {}) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const metrics = opt.metrics || null;
  const fields = azCollect(doc, metrics);
  const R = {};
  const put = (id, st, msg, ev = [], fs = []) => { R[id] = { st, msg, ev }; fs.forEach((f) => f.issues.add(id)); };
  const names = (fs, extra) => fs.map((f) => azName(f) + (extra ? extra(f) : ''));
  const of = (...kinds) => fields.filter((f) => kinds.includes(f.kind));
  const bodyText = azClean((doc.body || doc.documentElement).textContent);
  const T = fold(bodyText);
  const css = Array.from(doc.querySelectorAll('style')).map((s) => s.textContent).join('\n') + '\n' + Array.from(doc.querySelectorAll('[style]')).map((e) => e.getAttribute('style')).join(';');
  const buttons = Array.from(doc.querySelectorAll('button, input[type=submit], input[type=button], input[type=reset], input[type=image], [role=button]')).filter((b) => !azHidden(b));
  const btnText = (b) => azClean(b.tagName === 'INPUT' ? (b.getAttribute('value') || (b.type === 'submit' ? 'Submit' : b.type === 'reset' ? 'Reset' : '')) : (b.textContent || b.getAttribute('aria-label') || ''));
  const submits = buttons.filter((b) => (b.tagName === 'BUTTON' && (!b.getAttribute('type') || b.getAttribute('type') === 'submit') && b.closest('form')) || (b.tagName === 'INPUT' && /submit|image/.test(b.type)));
  const primary = submits.length ? submits : buttons.filter((b) => /gui|dang ky|tiep|hoan tat|nop|xac nhan|submit|send|next|continue/.test(fold(btnText(b))));
  const resets = buttons.filter((b) => (b.getAttribute('type') || '').toLowerCase() === 'reset' || /^(nhap lai|lam lai|xoa (het|form|du lieu)|reset|clear)$/.test(fold(btnText(b))));
  const N = fields.length;
  const vp = (metrics && metrics.page && metrics.page.viewport) || ((doc.querySelector('meta[name=viewport]') || {}).getAttribute ? doc.querySelector('meta[name=viewport]').getAttribute('content') : '') || '';
  const info = { title: azClean(doc.title), fields, N, forms: doc.querySelectorAll('form').length, iframes: Array.from(doc.querySelectorAll('iframe')).map((f) => f.getAttribute('src') || '').filter(Boolean) };

  /* Trang chặn bot / trang trống */
  if (/just a moment|cf-chl|checking your browser|attention required|access denied|xac minh ban khong phai la robot/.test(fold(info.title + ' ' + bodyText.slice(0, 600)))) info.blocked = true;

  /* ===== F · Cấu trúc ===== */
  const prepHits = [/(\d+)\s*phut/.test(T) && 'thời gian điền', /chuan bi|can co|yeu cau (ho so|tai lieu)|tai lieu can/.test(T) && 'tài liệu cần chuẩn bị', /han (chot|cuoi|nop)|deadline|het han/.test(T) && 'hạn chót', /dieu kien|doi tuong (tham gia|du thi)/.test(T) && 'điều kiện tham gia'].filter(Boolean);
  if (prepHits.length >= 2) put('F1', 'pass', `Trang có thông tin: ${prepHits.join(', ')}.`);
  else if (N >= 8 || of('file').length) put('F1', 'warn', prepHits.length ? `Mới thấy: ${prepHits.join(', ')}. Thiếu thời gian điền hoặc tài liệu cần chuẩn bị trước khi bắt đầu.` : 'Không thấy thông tin thời gian điền, tài liệu cần chuẩn bị, điều kiện, hạn chót trên trang này. Có thể nằm ở trang giới thiệu — hãy kiểm tra.');
  else put('F1', 'manual', 'Form ngắn. Kiểm tra trang giới thiệu có nói thời gian, tài liệu, hạn chót không.');

  const sens = of('sensitive', 'cccd');
  const both = of('age').length && of('dob').length + of('dobPart').length;
  if (sens.length || both || N > 15) {
    const ev = [];
    if (sens.length) ev.push(`Thông tin nhạy cảm, cân nhắc bỏ hoặc hỏi sau: ${names(sens).join(', ')}`);
    if (both) ev.push('Hỏi cả Tuổi và Ngày sinh — tuổi suy ra được từ ngày sinh');
    if (N > 15) ev.push(`${N} trường trên một trang`);
    put('F2', 'warn', 'Có trường có thể không cần ở bước đăng ký.', ev, [...sens, ...of('age')]);
  } else put('F2', 'manual', `Có ${N} trường. Rà từng trường bằng công cụ "Có nên hỏi trường này?".`);

  const stepper = /buoc\s*\d+\s*(\/|tren|of|trong)\s*\d+|step\s*\d+\s*(of|\/)\s*\d+/.test(T) || doc.querySelector('[aria-current=step], [role=progressbar], progress, [class*=stepper], [class*=steps], [class*=step-indicator], [class*=wizard]');
  info.stepper = !!stepper;
  if (stepper) put('F3', 'pass', 'Form chia bước, có chỉ báo bước.');
  else if (N <= 10) put('F3', 'pass', `${N} trường — một trang là phù hợp.`);
  else if (N <= 14) put('F3', 'manual', `${N} trường trên một trang. Ổn nếu chia nhóm rõ ràng.`);
  else put('F3', 'warn', `${N} trường trên một trang, không chia bước. Cân nhắc chia 3–5 bước theo nhóm thông tin.`);

  const headings = doc.querySelectorAll('fieldset legend, form h2, form h3, form h4, [class*=section] h2, [class*=section] h3');
  if (N > 8 && !headings.length) put('F4', 'warn', `${N} trường nhưng không thấy tiêu đề nhóm (legend, h2, h3) trong form.`);
  else if (N > 8) put('F4', 'pass', `Có ${headings.length} tiêu đề nhóm trong form.`);
  else put('F4', 'manual', 'Form ngắn, kiểm tra thứ tự trường có tự nhiên không.');

  /* F5 · một cột — cần đo bố cục */
  const textLike = fields.filter((f) => !['radio', 'checkbox', 'switch', 'file'].includes(f.type) && f.d && f.d.vis);
  if (metrics && textLike.length > 1) {
    const pairs = [];
    for (let i = 0; i < textLike.length; i++) for (let j = i + 1; j < textLike.length; j++) {
      const a = textLike[i].d.r, b = textLike[j].d.r;
      const ov = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ov > Math.min(a.h, b.h) * 0.5 && Math.abs(a.x - b.x) > 40) {
        const short = a.w < 170 && b.w < 170;
        const dob = ['dobPart'].includes(textLike[i].kind) && ['dobPart'].includes(textLike[j].kind);
        if (!short && !dob) pairs.push([textLike[i], textLike[j]]);
      }
    }
    if (pairs.length) put('F5', 'fail', `${pairs.length} cặp trường nằm cạnh nhau trên màn hình máy tính (1280px).`, pairs.slice(0, 6).map(([a, b]) => `${azName(a)} | ${azName(b)}`), pairs.flat());
    else put('F5', 'pass', 'Các trường xếp thành một cột trên máy tính.');
  } else {
    const twoCol = doc.querySelector('[class*="col-md-6"], [class*="col-sm-6"], [class*="col-lg-6"], [class*="grid-cols-2"], [class*="w-1/2"], [class*="half"], .row .col-6');
    const flexRow = /\.row\s*\{[^}]*display\s*:\s*flex/i.test(css);
    if (twoCol || flexRow) put('F5', 'warn', 'Có dấu hiệu bố cục hai cột (class lưới chia đôi). Dùng chế độ Đầy đủ để đo chính xác.', twoCol ? [twoCol.getAttribute('class')] : ['.row { display: flex }']);
    else put('F5', 'manual', 'Chưa đo bố cục ở chế độ này. Mở form trên máy tính, kiểm tra các trường có xếp một cột không.');
  }

  if (stepper) {
    const named = /buoc\s*\d+\s*(\/|tren|of)\s*\d+\s*[·:.\-–]?\s*\p{L}{3,}/u.test(T);
    put('F6', named ? 'pass' : 'warn', named ? 'Có chỉ báo "Bước x/y" kèm tên bước.' : 'Có chỉ báo bước nhưng có thể thiếu tên bước. Kiểm tra hiển thị "Bước 2/4 · Thông tin liên hệ".');
  } else put('F6', opt.multi ? 'fail' : 'manual', opt.multi ? 'Luồng có nhiều trang nhưng không thấy chỉ báo bước.' : 'Không thấy chỉ báo bước. Nếu form có nhiều bước, cần hiển thị "Bước x/y".');

  const pw = of('password', 'confirmPassword');
  if (pw.length && N <= 3 && /dang nhap|login|sign in/.test(T)) put('F7', 'warn', 'Trang có vẻ yêu cầu đăng nhập trước khi đăng ký.');
  else if (pw.length) put('F7', 'warn', 'Form bắt tạo mật khẩu. Cân nhắc cho đăng ký không cần tài khoản, gửi liên kết quản lý hồ sơ qua email.', names(pw), pw);
  else put('F7', 'pass', 'Không bắt tạo tài khoản ngay trong form.');

  /* ===== L · Nhãn ===== */
  const noLabel = fields.filter((f) => ['placeholder', 'aria', 'title', 'none'].includes(f.type === 'radio' ? (f.groupSrc === 'none' ? 'none' : 'label') : f.labelSrc) && f.type !== 'checkbox');
  const cbNoLabel = fields.filter((f) => f.type === 'checkbox' && ['aria', 'title', 'none', 'placeholder'].includes(f.labelSrc));
  const missing = [...noLabel, ...cbNoLabel];
  if (!N) put('L1', 'na', 'Không tìm thấy trường nhập liệu.');
  else if (missing.length) put('L1', 'fail', `${missing.length}/${N} trường không có nhãn hiển thị.`, names(missing, (f) => ` (${f.labelSrc === 'placeholder' ? 'chỉ có placeholder' : f.labelSrc === 'aria' ? 'chỉ có aria-label, không nhìn thấy' : 'không có nhãn'})`), missing);
  else {
    let left = [];
    if (metrics) left = fields.filter((f) => f.d && f.m && f.m.lab && f.m.lab.x + f.m.lab.w <= f.m.r.x + 2 && Math.abs((f.m.lab.y + f.m.lab.h / 2) - (f.m.r.y + f.m.r.h / 2)) < f.m.r.h && !['radio', 'checkbox'].includes(f.type));
    if (left.length > N / 3) put('L1', 'warn', `Mọi trường có nhãn, nhưng ${left.length} nhãn nằm bên trái ô trên điện thoại — dễ bị cắt chữ.`, names(left), left);
    else put('L1', 'pass', `Cả ${N} trường đều có nhãn hiển thị.`);
  }
  const phOnly = fields.filter((f) => f.ph && f.labelSrc === 'placeholder');
  const phLong = fields.filter((f) => f.ph && f.labelSrc !== 'placeholder' && f.ph.length > 45);
  if (phOnly.length) put('L2', 'fail', `${phOnly.length} trường dùng placeholder thay nhãn.`, names(phOnly, (f) => ` — "${azCut(f.ph, 40)}"`), phOnly);
  else if (phLong.length) put('L2', 'warn', 'Có hướng dẫn dài nằm trong placeholder (biến mất khi gõ).', names(phLong, (f) => ` — "${azCut(f.ph, 50)}"`), phLong);
  else put('L2', N ? 'pass' : 'na', N ? 'Không dùng placeholder thay nhãn.' : '');

  const star = (f) => /\*|bắt buộc|\(\*\)/i.test(f.label + ' ' + (f.labelNode ? f.labelNode.textContent : ''));
  const reqF = fields.filter((f) => f.req);
  const starNote = /(dau|truong co( dau)?)\s*\*|\*\s*(la )?(truong )?bat buoc|bat buoc nhap|thong tin bat buoc/.test(T);
  if (!N) put('L3', 'na', '');
  else if (reqF.length) {
    const unmarked = reqF.filter((f) => !star(f));
    if (unmarked.length) put('L3', 'fail', `${unmarked.length}/${reqF.length} trường bắt buộc không có dấu * hay chữ "bắt buộc".`, names(unmarked), unmarked);
    else if (!starNote) put('L3', 'warn', 'Trường bắt buộc có dấu *, nhưng không thấy câu chú thích "Các trường có dấu * là bắt buộc".');
    else put('L3', 'pass', `${reqF.length} trường bắt buộc đều được đánh dấu, có chú thích.`);
  } else if (fields.some(star)) put('L3', starNote ? 'pass' : 'warn', starNote ? 'Có dấu * và chú thích ý nghĩa.' : 'Có dấu * nhưng không có chú thích ý nghĩa, và ô nhập không có thuộc tính required/aria-required.');
  else put('L3', 'warn', 'Không thấy cách đánh dấu trường bắt buộc (không dấu *, không thuộc tính required). Người dùng phải đoán.');

  const fmtF = fields.filter((f) => ['phone', 'cccd', 'otp', 'file', 'url', 'password'].includes(f.kind) || (f.kind === 'dob' && f.type !== 'date') || (f.kind === 'longtext'));
  const noHint = fmtF.filter((f) => !f.hint && !/ví dụ|vd|\d{3,}/i.test(f.label));
  if (!fmtF.length) put('L4', 'na', 'Không có trường cần gợi ý định dạng.');
  else if (noHint.length) put('L4', 'warn', `${noHint.length}/${fmtF.length} trường cần định dạng chưa có gợi ý hiển thị sẵn.`, names(noHint), noHint);
  else put('L4', 'pass', 'Các trường cần định dạng đều có gợi ý.');

  const abbr = fields.filter((f) => /(^|[\s(])(SĐT|SDT|ĐT|CMND|HKTT|MST|ĐVCQ|NS|DOB)([\s):]|$)/.test(f.label) && f.label.length < 30);
  const longLb = fields.filter((f) => f.label.length > 70);
  if (abbr.length || longLb.length) put('L5', 'warn', 'Có nhãn viết tắt hoặc quá dài.', [...names(abbr, () => ' — viết tắt'), ...names(longLb, () => ' — quá dài')], [...abbr, ...longLb]);
  else put('L5', N ? 'pass' : 'na', N ? 'Nhãn ngắn, không viết tắt.' : '');

  const sensNoWhy = fields.filter((f) => ['cccd', 'sensitive'].includes(f.kind) && !/de |dung de|nham|xac minh|vi sao|ly do/.test(fold(f.hint)));
  if (!of('cccd', 'sensitive').length) put('L6', 'na', 'Không hỏi thông tin nhạy cảm.');
  else if (sensNoWhy.length) put('L6', 'warn', 'Hỏi thông tin nhạy cảm mà không giải thích lý do.', names(sensNoWhy), sensNoWhy);
  else put('L6', 'pass', 'Thông tin nhạy cảm có giải thích lý do.');

  const caps = (s) => { const L = s.replace(/[^\p{L}]/gu, ''); return L.length >= 4 && L === L.toLocaleUpperCase('vi') && L !== L.toLocaleLowerCase('vi'); };
  const titleCase = (s) => { const w = s.split(/\s+/).filter((x) => /^\p{L}/u.test(x)); return w.length >= 3 && w.every((x) => x[0] === x[0].toLocaleUpperCase('vi')) && !caps(s); };
  const capItems = [...fields.map((f) => f.label), ...buttons.map(btnText), ...Array.from(doc.querySelectorAll('h1,h2,h3,legend')).map((h) => azClean(h.textContent))].filter(Boolean);
  const capsL = [...new Set(capItems.filter(caps))], titleL = [...new Set(capItems.filter(titleCase))];
  if (capsL.length) put('L7', 'fail', 'Có tiêu đề, nhãn hoặc nút viết IN HOA.', capsL.slice(0, 8).map((s) => `"${azCut(s, 40)}"`));
  else if (titleL.length) put('L7', 'warn', 'Có chữ viết hoa mỗi từ (Title Case) — tiếng Việt nên viết hoa kiểu câu.', titleL.slice(0, 8).map((s) => `"${azCut(s, 40)}"`));
  else put('L7', 'pass', 'Chữ viết hoa kiểu câu.');

  /* ===== I · Ô nhập ===== */
  const kb = [];
  of('email').forEach((f) => { if (f.type !== 'email' && f.tag === 'input') kb.push([f, `dùng type="${f.type}", nên là type="email"`]); });
  of('phone').forEach((f) => { if (f.type !== 'tel' && f.tag === 'input') kb.push([f, `dùng type="${f.type}", nên là type="tel"`]); });
  of('cccd', 'otp').forEach((f) => { if (f.type === 'number') kb.push([f, 'type="number" làm mất số 0 ở đầu']); else if (f.tag === 'input' && f.im !== 'numeric' && f.type !== 'tel') kb.push([f, 'thiếu inputmode="numeric"']); });
  const kbF = of('email', 'phone', 'cccd', 'otp');
  if (!kbF.length) put('I1', 'na', 'Không có trường email, điện thoại, mã số.');
  else if (kb.length) put('I1', kb.some(([, m]) => /type=/.test(m)) ? 'fail' : 'warn', `${kb.length} trường mở sai bàn phím trên điện thoại.`, kb.map(([f, m]) => `${azName(f)}: ${m}`), kb.map(([f]) => f));
  else put('I1', 'pass', 'Các trường email, điện thoại, mã số mở đúng bàn phím.');

  const AC = { name: ['name'], firstname: ['given-name'], lastname: ['family-name'], email: ['email'], phone: ['tel', 'tel-national', 'mobile tel'], dob: ['bday'], dobPart: ['bday-day', 'bday-month', 'bday-year'], address: ['street-address', 'address-line1', 'address-line2'], province: ['address-level1'], ward: ['address-level2', 'address-level3'], district: ['address-level2'], school: ['organization'], otp: ['one-time-code'], password: ['new-password', 'current-password'] };
  const acBad = [];
  fields.forEach((f) => {
    if (!AC[f.kind]) return;
    const formOff = f.form && (f.form.getAttribute('autocomplete') || '').toLowerCase() === 'off';
    if (!f.ac && formOff) acBad.push([f, 'bị tắt bởi <form autocomplete="off">']);
    else if (!f.ac) acBad.push([f, `thiếu autocomplete="${AC[f.kind][0]}"`]);
    else if (f.ac === 'off') acBad.push([f, 'autocomplete="off"']);
    else if (!AC[f.kind].some((a) => f.ac.split(/\s+/).includes(a.split(' ').pop()))) acBad.push([f, `autocomplete="${f.ac}", nên là "${AC[f.kind][0]}"`]);
  });
  const acF = fields.filter((f) => AC[f.kind]);
  if (!acF.length) put('I2', 'na', 'Không có trường thông tin cá nhân.');
  else if (acBad.length) put('I2', 'fail', `${acBad.length}/${acF.length} trường thông tin cá nhân chưa hỗ trợ tự động điền.`, acBad.map(([f, m]) => `${azName(f)}: ${m}`), acBad.map(([f]) => f));
  else put('I2', 'pass', `${acF.length} trường thông tin cá nhân có autocomplete đúng chuẩn.`);

  const strictPat = fields.filter((f) => ['phone', 'cccd', 'otp'].includes(f.kind) && f.pattern && !/\\s|\s|\+|\[[^\]]*[ .\-]/.test(f.pattern));
  if (strictPat.length) put('I3', 'fail', 'Mẫu kiểm tra (pattern) không chấp nhận dấu cách, dấu chấm, +84.', names(strictPat, (f) => ` — pattern="${azCut(f.pattern, 30)}"`), strictPat);
  else if (of('phone', 'cccd').length) put('I3', 'manual', 'Không thấy ràng buộc định dạng cứng trong HTML. Thử nhập "+84 912.345.678" để xác nhận hệ thống tự chuẩn hóa.');
  else put('I3', 'na', 'Không có trường cần chuẩn hóa định dạng.');

  const mlBad = fields.filter((f) => ['phone', 'cccd', 'otp'].includes(f.kind) && f.maxlength && !(f.kind === 'otp' && f.maxlength === 1));
  if (mlBad.length) put('I4', 'fail', 'maxlength cắt cụt chuỗi khi dán có dấu cách (ví dụ "0912 345 678").', names(mlBad, (f) => ` (maxlength=${f.maxlength})`), mlBad);
  else if (of('phone', 'cccd', 'otp').length) put('I4', 'manual', 'Thử dán "0912 345 678" và sửa giữa chuỗi để kiểm tra mặt nạ nhập.');
  else put('I4', 'na', '');

  const dobParts = of('dobPart');
  if (metrics && dobParts.length) {
    const wide = dobParts.filter((f) => f.d && f.d.r.w > 200);
    put('I5', wide.length ? 'warn' : 'pass', wide.length ? 'Ô ngày/tháng/năm quá rộng so với dữ liệu.' : 'Ô ngày/tháng/năm có độ rộng phù hợp.', names(wide, (f) => ` (${f.d.r.w}px)`), wide);
  } else put('I5', 'manual', 'Kiểm tra độ rộng ô tương ứng độ dài dữ liệu (năm, CCCD, họ tên).');

  const fn = of('firstname'), ln = of('lastname'), nm = of('name');
  const nameBad = [];
  if (fn.length && ln.length) nameBad.push('Tách "Họ" và "Tên" thành hai ô');
  [...nm, ...fn, ...ln].forEach((f) => {
    if (f.maxlength && f.maxlength < 50) nameBad.push(`${azName(f)}: maxlength=${f.maxlength} quá ngắn cho tên Việt`);
    if (f.pattern && /a-z/i.test(f.pattern) && !/\\p\{L\}|À|à|\\u00/.test(f.pattern)) nameBad.push(`${azName(f)}: pattern="${azCut(f.pattern, 24)}" từ chối chữ có dấu`);
  });
  if (!nm.length && !fn.length && !ln.length) put('I6', 'na', 'Không có trường họ tên.');
  else if (nameBad.length) put('I6', 'fail', 'Trường họ tên chưa phù hợp tên tiếng Việt.', nameBad, [...nm, ...fn, ...ln]);
  else put('I6', 'pass', 'Một ô "Họ và tên", không giới hạn ký tự.');

  const dobF = of('dob'), dobSel = dobParts.filter((f) => f.tag === 'select');
  if (!dobF.length && !dobParts.length) put('I7', 'na', 'Không hỏi ngày sinh.');
  else if (dobF.some((f) => f.type === 'date')) put('I7', 'warn', 'Ngày sinh dùng lịch chọn ngày (type="date"): phải lùi nhiều năm, khó nhập trên điện thoại.', names(dobF.filter((f) => f.type === 'date')), dobF);
  else if (dobSel.some((f) => (f.opts || []).length > 40) || dobF.some((f) => f.tag === 'select')) put('I7', 'warn', 'Năm sinh chọn từ danh sách dài.', names(dobSel), dobSel);
  else if (dobParts.length >= 3) put('I7', 'pass', 'Ngày sinh nhập bằng ba ô Ngày/Tháng/Năm.');
  else put('I7', 'pass', 'Ngày sinh nhập bằng bàn phím.');

  const tas = of('longtext');
  const counterText = /con\s*\d+\s*(tu|ky tu)|\d+\s*\/\s*\d+\s*(tu|ky tu)?|toi da\s*\d+\s*(tu|ky tu)/;
  if (!tas.length) put('I8', 'na', 'Không có ô văn bản dài.');
  else if (tas.some((f) => f.maxlength)) put('I8', 'fail', 'maxlength cắt cụt đoạn văn dán vào mà không báo.', names(tas.filter((f) => f.maxlength), (f) => ` (maxlength=${f.maxlength})`), tas.filter((f) => f.maxlength));
  else if (tas.every((f) => counterText.test(fold(f.hint + ' ' + f.label)))) put('I8', 'pass', 'Ô văn bản dài có giới hạn rõ, không cắt cụt.');
  else put('I8', 'warn', 'Ô văn bản dài chưa nêu giới hạn hoặc chưa có bộ đếm.', names(tas.filter((f) => !counterText.test(fold(f.hint + ' ' + f.label)))), tas);

  const paste = fields.filter((f) => f.onpaste);
  const confE = of('confirmEmail');
  if (paste.length || confE.length) put('I9', 'fail', 'Chặn dán hoặc bắt nhập lại thông tin.', [...names(paste, () => ' — chặn dán (onpaste)'), ...names(confE, () => ' — ô nhập lại email')], [...paste, ...confE]);
  else put('I9', N ? 'pass' : 'na', N ? 'Không chặn dán, không bắt nhập lại email.' : '');

  if (!pw.length) put('I10', 'na', 'Không có ô mật khẩu.');
  else {
    const ev = []; const p1 = of('password');
    if (of('confirmPassword').length) ev.push('Có ô "Nhập lại mật khẩu"');
    p1.forEach((f) => { if (!/new-password|current-password/.test(f.ac)) ev.push(`${azName(f)}: thiếu autocomplete="new-password"`); });
    const toggle = p1.some((f) => { const box = f.el.parentElement && f.el.parentElement.parentElement; return box && Array.from(box.querySelectorAll('button,[role=button],span,i')).some((b) => /hien|an mat khau|show|hide|xem|eye|toggle/.test(fold(b.textContent + ' ' + (b.getAttribute('aria-label') || '') + ' ' + (b.getAttribute('class') || '')))); });
    if (!toggle) ev.push('Không thấy nút Hiện/Ẩn mật khẩu');
    put('I10', ev.length ? (ev.length > 1 || of('confirmPassword').length ? 'fail' : 'warn') : 'pass', ev.length ? 'Ô mật khẩu chưa tối ưu.' : 'Ô mật khẩu có nút hiện/ẩn, hỗ trợ trình quản lý mật khẩu.', ev, pw);
  }

  /* ===== C · Lựa chọn ===== */
  const sels = fields.filter((f) => f.tag === 'select');
  const smallSel = sels.filter((f) => f.opts && f.opts.length >= 1 && f.opts.length <= 5 && !['dobPart', 'province', 'ward', 'district'].includes(f.kind));
  if (!sels.length) put('C1', of('choice').length ? 'pass' : 'na', of('choice').length ? 'Lựa chọn ít dùng radio.' : 'Không có câu hỏi lựa chọn.');
  else if (smallSel.length) put('C1', 'fail', 'Câu hỏi có ít lựa chọn bị giấu trong dropdown.', names(smallSel, (f) => ` (${f.opts.length} lựa chọn: ${azCut(f.opts.join(', '), 40)})`), smallSel);
  else put('C1', 'pass', 'Không có dropdown ít lựa chọn.');

  const longSel = sels.filter((f) => f.opts && f.opts.length > 15);
  const combos = fields.filter((f) => f.type === 'combobox' || f.role === 'combobox' || f.el.getAttribute('list'));
  if (longSel.length) put('C2', 'warn', 'Danh sách dài không gõ để tìm được (trừ khi giao diện tùy biến có ô tìm).', names(longSel, (f) => ` (${f.opts.length} mục)`), longSel);
  else if (combos.length) put('C2', 'pass', 'Danh sách dài dùng ô tìm kiếm gợi ý.');
  else put('C2', 'na', 'Không có danh sách dài.');

  const addrF = of('province', 'district', 'ward', 'address');
  if (!addrF.length) put('C3', 'na', 'Không hỏi địa chỉ.');
  else {
    const ev = [];
    of('district').forEach((f) => ev.push(`Còn ô "${azName(f)}" — từ 01/07/2025 không còn cấp huyện`));
    of('province').forEach((f) => {
      if (!f.opts) return;
      const old = OLD_PROVINCES.filter((p) => f.opts.some((o) => fold(o).includes(fold(p))));
      if (old.length) ev.push(`Danh mục tỉnh còn tên cũ: ${old.slice(0, 6).join(', ')}${old.length > 6 ? '…' : ''}`);
      if (f.opts.length >= 60) ev.push(`Danh mục có ${f.opts.length} tỉnh (cũ là 63, mới là 34)`);
    });
    if (ev.length) put('C3', 'fail', 'Địa chỉ chưa theo đơn vị hành chính mới.', ev, [...of('district'), ...of('province')]);
    else if (of('province').some((f) => f.opts)) put('C3', 'pass', 'Danh mục tỉnh/thành và cấu trúc địa chỉ đã cập nhật.');
    else put('C3', 'manual', 'Không đọc được danh mục tỉnh (có thể tải bằng JavaScript). Kiểm tra danh mục 34 tỉnh và không còn Quận/Huyện.');
  }

  const sw = fields.filter((f) => f.type === 'switch');
  put('C4', sw.length ? 'warn' : 'pass', sw.length ? 'Có công tắc (toggle) trong form có nút gửi.' : 'Không dùng công tắc trong form.', names(sw), sw);

  const pre = fields.filter((f) => (f.type === 'checkbox' && f.checked && ['consent', 'marketing'].includes(f.kind)) || (f.type === 'radio' && f.group && f.group.some((g) => g.checked) && f.kind === 'gender'));
  const preOther = fields.filter((f) => f.type === 'radio' && f.group && f.group.some((g) => g.checked) && f.kind !== 'gender');
  if (pre.length) put('C5', 'fail', 'Câu trả lời cá nhân hoặc ô đồng ý được chọn sẵn.', names(pre), pre);
  else if (preOther.length) put('C5', 'warn', 'Có lựa chọn được chọn sẵn — kiểm tra mặc định có an toàn, đúng với đa số.', names(preOther), preOther);
  else put('C5', N ? 'pass' : 'na', 'Không có lựa chọn cá nhân nào được chọn sẵn.');

  const rc = fields.filter((f) => ['radio', 'checkbox'].includes(f.type));
  const rcNoLab = [];
  rc.forEach((f) => (f.group || [f]).forEach((g) => { if (!['label', 'wrap'].includes(g.labelSrc)) rcNoLab.push(g); }));
  if (!rc.length) put('C6', 'na', 'Không có radio/checkbox.');
  else if (rcNoLab.length) put('C6', 'fail', 'Radio/checkbox không có nhãn bấm được (phải bấm trúng ô tròn/vuông nhỏ).', [...new Set(rcNoLab.map((g) => azCut(g.optLabel || g.label || g.name, 40)))].slice(0, 8), rcNoLab);
  else put('C6', 'pass', 'Mọi radio/checkbox có nhãn bấm được.');

  /* ===== V · Kiểm tra & lỗi (cần thử tay, trừ V6, V9) ===== */
  ['V1', 'V2', 'V3', 'V4', 'V5', 'V7', 'V8'].forEach((id) => put(id, N ? 'manual' : 'na', N ? 'Hành vi khi nhập và gửi — chỉ kiểm được bằng cách thử.' : ''));
  const disabledSubmit = primary.filter((b) => b.hasAttribute('disabled') || b.getAttribute('aria-disabled') === 'true');
  if (disabledSubmit.length) put('V6', 'fail', 'Nút gửi bị khóa sẵn khi form chưa hợp lệ.', disabledSubmit.map((b) => `"${azCut(btnText(b), 30)}" có thuộc tính disabled`));
  else put('V6', primary.length ? 'pass' : 'na', primary.length ? 'Nút gửi không bị khóa sẵn.' : 'Không tìm thấy nút gửi.');
  const descN = fields.filter((f) => f.el.getAttribute('aria-describedby')).length;
  put('V9', N ? 'manual' : 'na', N ? `${descN}/${N} trường có aria-describedby. Gây một lỗi rồi nghe bằng trình đọc màn hình để kiểm tra.` : '');

  /* ===== B · Nút ===== */
  const generic = /^(ok|submit|send|xac nhan|dong y|click|enter|go|gui di|chap nhan|yes|co)$/;
  if (!primary.length) put('B1', N ? 'warn' : 'na', N ? 'Không tìm thấy nút gửi (có thể dùng phần tử tùy biến).' : '');
  else {
    const bad = primary.filter((b) => generic.test(fold(btnText(b))) || !btnText(b));
    const meh = primary.filter((b) => /^gui$/.test(fold(btnText(b))));
    if (bad.length) put('B1', 'fail', 'Nhãn nút chung chung, không nói rõ hành động.', bad.map((b) => `"${btnText(b) || '(không có chữ)'}"`));
    else if (meh.length) put('B1', 'warn', 'Nút "Gửi" chưa nói rõ gửi gì.', ['Gợi ý: "Gửi hồ sơ đăng ký"']);
    else put('B1', 'pass', `Nhãn nút rõ hành động: ${primary.slice(0, 3).map((b) => `"${azCut(btnText(b), 30)}"`).join(', ')}.`);
  }
  if (resets.length) put('B2', 'fail', 'Có nút xóa toàn bộ form — bấm nhầm là mất hết dữ liệu.', resets.map((b) => `"${btnText(b)}"`));
  else put('B2', primary.length ? 'pass' : 'manual', primary.length ? 'Không có nút xóa/reset form.' : 'Kiểm tra mỗi màn hình chỉ có một nút chính.');
  if (metrics && primary.length && textLike.length) {
    const last = textLike.reduce((a, f) => (f.d.r.y > a.d.r.y ? f : a), textLike[0]);
    const pb = metrics.desktop[+primary[0].getAttribute('data-fx-i')];
    if (pb && pb.vis) { const gap = pb.r.y - (last.d.r.y + last.d.r.h); put('B3', gap > 320 ? 'warn' : 'pass', gap > 320 ? `Nút chính cách trường cuối ${gap}px.` : 'Nút chính nằm ngay sau trường cuối.'); }
    else put('B3', 'manual', 'Kiểm tra vị trí nút chính.');
  } else put('B3', 'manual', 'Kiểm tra nút chính nằm ngay sau trường cuối, rộng hết màn hình trên điện thoại.');
  put('B4', primary.length ? 'manual' : 'na', 'Bấm gửi 3–4 lần thật nhanh để kiểm tra trạng thái "Đang gửi…" và chống gửi trùng.');
  put('B5', 'manual', 'Kiểm tra hộp thoại xác nhận chỉ dùng cho hành động không hoàn tác được.');
  if (metrics) {
    const small = [], tiny = [];
    const tgts = [...fields.flatMap((f) => (f.group || [f]).map((g) => g)), ...primary.map((b) => ({ el: b, m: metrics.controls[+b.getAttribute('data-fx-i')], label: btnText(b), btn: true }))];
    tgts.forEach((t) => {
      const m = t.m; if (!m || (!m.vis && !m.styled)) return;
      const r = (['radio', 'checkbox'].includes(t.type) && m.tgt) ? m.tgt : m.r;
      const h = Math.min(r.h, r.w);
      if (h < 24) tiny.push([t, h]); else if (h < 44) small.push([t, h]);
    });
    const nm2 = ([t, h]) => `${t.btn ? 'Nút ' : ''}${azCut(t.optLabel || t.label || t.name || 'không tên', 36)} — ${Math.round(h)}px`;
    if (tiny.length) put('B6', 'fail', `${tiny.length} mục bấm nhỏ hơn 24px, ${small.length} mục dưới 44px (đo ở màn hình 390px).`, [...tiny, ...small].slice(0, 10).map(nm2), [...tiny, ...small].map(([t]) => t).filter((t) => t.issues));
    else if (small.length) put('B6', 'warn', `${small.length} mục bấm nhỏ hơn 44px (đo ở màn hình 390px).`, small.slice(0, 10).map(nm2), small.map(([t]) => t).filter((t) => t.issues));
    else put('B6', 'pass', 'Mọi ô và nút có vùng chạm từ 44px.');
  } else {
    const h = css.match(/(input|select|button)[^{]*\{[^}]*height\s*:\s*(\d+)px/i);
    if (h && +h[2] < 40) put('B6', 'warn', `CSS đặt chiều cao ô/nút ${h[2]}px. Dùng chế độ Đầy đủ để đo chính xác.`);
    else put('B6', 'manual', 'Chưa đo vùng chạm ở chế độ này.');
  }

  /* ===== U · Tệp ===== */
  const files = of('file');
  if (!files.length) ['U1', 'U2', 'U3', 'U4', 'U5'].forEach((id) => put(id, 'na', 'Không có trường tải tệp.'));
  else {
    const noReq = files.filter((f) => !/mb|kb|dinh dang|pdf|jpg|jpeg|png|doc|toi da|dung luong/.test(fold(f.hint + ' ' + f.label)));
    const noAcc = files.filter((f) => !f.accept);
    if (noReq.length) put('U1', 'fail', 'Chưa nêu định dạng và dung lượng tệp trước khi chọn.', names(noReq), noReq);
    else if (noAcc.length) put('U1', 'warn', 'Đã nêu yêu cầu, nhưng ô chọn tệp chưa có thuộc tính accept để lọc tệp.', names(noAcc), noAcc);
    else put('U1', 'pass', 'Yêu cầu tệp hiển thị sẵn, có accept.');
    put('U2', 'manual', 'Thử chọn tệp sai định dạng và tệp quá lớn: lỗi phải hiện ngay, nêu tên tệp.');
    put('U3', 'manual', 'Thử tải tệp lớn qua mạng chậm: có tiến trình, cho hủy và thử lại.');
    put('U4', 'manual', 'Sau khi tải lên: có xem trước, thay tệp, xóa tệp.');
    const photo = files.filter((f) => /anh|photo|image|chan dung|avatar/.test(fold(f.label + f.name)));
    put('U5', photo.length && photo.every((f) => /image/.test(f.accept)) ? 'pass' : 'manual', photo.length && photo.every((f) => /image/.test(f.accept)) ? 'Ô ảnh dùng accept="image/…", điện thoại sẽ đề xuất máy ảnh.' : 'Kiểm tra hệ thống có tự nén ảnh lớn, cho chụp trực tiếp không.');
  }

  /* ===== D · Lưu nháp & hạn chót ===== */
  put('D1', N > 10 || files.length || tas.length ? 'manual' : 'na', 'Điền một nửa rồi tải lại trang: dữ liệu còn không?');
  put('D2', N > 10 ? 'manual' : 'na', 'Kiểm tra có cách tiếp tục trên thiết bị khác.');
  put('D3', 'manual', 'Để form mở 30 phút rồi gửi: có cảnh báo hết phiên, giữ dữ liệu không?');
  put('D4', 'manual', 'Nhập dữ liệu rồi bấm Back: có cảnh báo khi chưa lưu?');
  const dl = bodyText.match(/(hạn chót|hạn cuối|hạn nộp|hạn đăng ký|deadline|hết hạn|hạn)[^.\n]{0,60}/i);
  if (dl) {
    const s = dl[0];
    const hasTime = /\d{1,2}[:h]\d{2}|\d{1,2}\s*giờ/i.test(s), hasYear = /\d{1,2}\/\d{1,2}\/\d{4}|năm \d{4}/i.test(s);
    if (hasTime && hasYear) put('D5', 'pass', `Hạn chót có giờ và ngày đầy đủ: "${azCut(s, 70)}".`);
    else put('D5', 'warn', `Hạn chót thiếu ${[!hasTime && 'giờ', !hasYear && 'năm'].filter(Boolean).join(' và ')}: "${azCut(s, 70)}".`);
  } else put('D5', 'manual', 'Không thấy hạn chót trên trang này (có thể ở trang giới thiệu).');

  /* ===== R · Xem lại & gửi ===== */
  put('R1', opt.multi || N > 10 ? 'manual' : 'na', 'Kiểm tra có trang xem lại với "Sửa" về đúng trường trước khi gửi.');
  const cons = of('consent'), mkt = of('marketing');
  const combined = cons.filter((f) => /khuyen mai|quang cao|nhan tin|ban tin|newsletter|marketing|uu dai|doi tac/.test(fold(f.label)));
  const preC = [...cons, ...mkt].filter((f) => f.checked);
  if (preC.length || combined.length) put('R2', 'fail', 'Ô đồng ý chưa đúng: chọn sẵn hoặc gộp nhiều mục đích.', [...names(preC, () => ' — đã tích sẵn'), ...names(combined, () => ' — gộp điều khoản với nhận quảng cáo')], [...preC, ...combined]);
  else if (cons.length) put('R2', 'pass', 'Ô đồng ý không chọn sẵn, tách theo mục đích.');
  else put('R2', 'manual', 'Không thấy ô đồng ý điều khoản trên trang này (có thể ở bước cuối).');
  const boxesRow = []; let run = [];
  fields.forEach((f) => { if (f.tag === 'input' && f.maxlength === 1) run.push(f); else { if (run.length >= 4) boxesRow.push(run); run = []; } });
  if (run.length >= 4) boxesRow.push(run);
  const otp = of('otp');
  if (!otp.length && !boxesRow.length) put('R3', 'na', 'Không có ô nhập mã OTP.');
  else {
    const ev = [];
    if (boxesRow.length) ev.push(`Mã OTP chia thành ${boxesRow[0].length} ô riêng — kiểm tra dán cả chuỗi`);
    otp.filter((f) => f.ac !== 'one-time-code').forEach((f) => ev.push(`${azName(f)}: thiếu autocomplete="one-time-code"`));
    put('R3', ev.length ? 'warn' : 'pass', ev.length ? 'Ô OTP chưa tối ưu.' : 'Ô OTP hỗ trợ tự điền từ SMS.', ev, otp);
  }

  /* ===== K, T: sau gửi và tình huống đặc thù ===== */
  ['K1', 'K2', 'K3'].forEach((id) => put(id, 'manual', 'Gửi thử một hồ sơ để kiểm tra trang xác nhận, email, trạng thái hồ sơ.'));
  ['T1', 'T2', 'T3', 'T5'].forEach((id) => put(id, 'manual', 'Kiểm tra bằng cách thử các nhánh của form.'));
  put('T4', 'manual', 'Kiểm tra màn hình khi cổng chưa mở, sắp đóng, đã đóng, hết suất.');

  /* ===== M · Điện thoại ===== */
  const noZoom = /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/i.test(vp);
  if (metrics) {
    const smallFs = fields.flatMap((f) => (f.group || [f])).filter((f) => f.m && f.m.vis && f.m.fs && f.m.fs < 16 && !['radio', 'checkbox'].includes(f.type));
    const ev = [];
    if (noZoom) ev.push(`Chặn phóng to: viewport "${azCut(vp, 70)}"`);
    if (smallFs.length) ev.push(...names(smallFs.slice(0, 8), (f) => ` — chữ ${f.m.fs}px`));
    put('M1', ev.length ? 'fail' : 'pass', ev.length ? `${smallFs.length} ô có chữ nhỏ hơn 16px${noZoom ? ', trang chặn phóng to' : ''}.` : 'Chữ trong ô từ 16px, không chặn phóng to.', ev, smallFs);
  } else {
    const fsm = css.match(/(input|select|textarea)[^{]*\{[^}]*font-size\s*:\s*(\d+(\.\d+)?)px/i);
    const ev = [];
    if (noZoom) ev.push(`Chặn phóng to: viewport "${azCut(vp, 70)}"`);
    if (fsm && +fsm[2] < 16) ev.push(`CSS đặt cỡ chữ ô nhập ${fsm[2]}px`);
    put('M1', ev.length ? 'fail' : 'manual', ev.length ? 'Ô nhập chưa phù hợp điện thoại.' : 'Chưa đo cỡ chữ ở chế độ này. Viewport không chặn phóng to.', ev);
  }
  put('M2', 'manual', 'Trên điện thoại thật: chạm ô cuối, kiểm tra bàn phím không che ô và lỗi.');
  const ekh = fields.filter((f) => f.ekh).length;
  put('M3', !N ? 'na' : ekh ? 'pass' : 'warn', ekh ? `${ekh} trường có enterkeyhint.` : 'Chưa dùng enterkeyhint — phím Enter trên bàn phím điện thoại không gợi ý "Tiếp".');
  if (metrics && metrics.page) {
    const p = metrics.page, ev = [];
    if (p.scrollW > p.innerW + 2) ev.push(`Trang rộng ${p.scrollW}px ở màn hình ${p.innerW}px — phải cuộn ngang`);
    if (p.requests > 120) ev.push(`${p.requests} yêu cầu mạng khi tải trang`);
    if (html.length > 1500000) ev.push(`HTML nặng ${(html.length / 1048576).toFixed(1)} MB`);
    put('M4', ev.some((e) => /cuộn ngang/.test(e)) ? 'fail' : ev.length ? 'warn' : 'pass', ev.length ? 'Trang chưa tối ưu cho màn hình nhỏ hoặc mạng chậm.' : `Không cuộn ngang ở 390px, ${p.requests} yêu cầu mạng.`, ev);
  } else put('M4', html.length > 1500000 ? 'warn' : 'manual', html.length > 1500000 ? `HTML nặng ${(html.length / 1048576).toFixed(1)} MB.` : 'Thu cửa sổ còn 360px để kiểm tra cuộn ngang.');

  /* ===== A · Tiếp cận ===== */
  if (metrics && metrics.focus && metrics.focus.length) {
    const byI = Object.fromEntries((metrics.controls || []).map((c) => [String(c.i), c]));
    const none = metrics.focus.filter((f) => { const b = byI[f.i] && byI[f.i].base; if (!b) return false; const ring = f.os !== 'none' && f.ow >= 1; return !ring && f.sh === b.sh && f.bc === b.bc && f.bg === b.bg; });
    const nm3 = (f) => { const el = doc.querySelector(`[data-fx-i="${f.i}"]`); const fd = fields.find((x) => x.el === el); return fd ? azName(fd) : (el ? azCut(btnText(el) || el.getAttribute('name') || f.tag, 36) : f.tag); };
    if (none.length) put('A1', 'fail', `${none.length}/${metrics.focus.length} điều khiển không hiện dấu focus khi dùng phím Tab.`, [...new Set(none.map(nm3))].slice(0, 8));
    else put('A1', 'pass', `Thử Tab qua ${metrics.focus.length} điều khiển: đều có dấu focus.`);
  } else if (/outline\s*:\s*(none|0)/i.test(css) && !/:focus-visible/.test(css)) put('A1', 'warn', 'CSS có "outline: none" mà không có kiểu :focus-visible thay thế.', [azCut((css.match(/[^;{}]*outline\s*:\s*(none|0)[^;}]*/i) || [''])[0], 70)]);
  else put('A1', 'manual', 'Rút chuột, dùng phím Tab qua toàn bộ form.');
  const rgNo = fields.filter((f) => f.type === 'radio' && f.group && f.group.length > 1 && f.groupSrc !== 'legend');
  const orphan = fields.filter((f) => ['orphan'].includes(f.labelSrc));
  const fake = Array.from(doc.querySelectorAll('div[onclick],span[onclick]')).filter((e) => !e.getAttribute('role') && azClean(e.textContent).length < 40).length;
  if (rgNo.length || orphan.length) put('A2', 'fail', 'Cấu trúc HTML chưa đúng cho trình đọc màn hình.', [...names(orphan, () => ' — nhãn không gắn với ô (thiếu for/id)'), ...names(rgNo, () => ' — nhóm radio thiếu fieldset/legend')], [...orphan, ...rgNo]);
  else if (fake) put('A2', 'warn', `${fake} phần tử div/span có onclick nhưng không có role — có thể là nút giả.`);
  else put('A2', N ? 'pass' : 'na', 'Nhãn gắn đúng ô, nhóm radio có fieldset/legend.');
  if (metrics) {
    const lowT = [], lowB = [], lowP = [];
    fields.forEach((f) => {
      const m = f.m; if (!m || !m.vis) return;
      if (m.lc && m.lbg) { const c = azContrast(m.lc, m.lbg); if (c < 4.5 && (m.lfs || 16) < 24) lowT.push([f, c]); }
      if (!['radio', 'checkbox'].includes(f.type)) {
        const edge = m.bw >= 1 ? azContrast(m.bc, m.pbg) : azContrast(m.bg, m.pbg);
        if (edge < 3) lowB.push([f, edge]);
        if (f.ph && m.ph) { const c = azContrast(m.ph, m.bg); if (c < 4.5) lowP.push([f, c]); }
      }
    });
    const r1 = (c) => (Math.floor(c * 10) / 10).toFixed(1).replace('.', ',');
    const ev = [...lowT.slice(0, 4).map(([f, c]) => `Nhãn "${azName(f)}": ${r1(c)}:1 (cần 4,5:1)`), ...lowB.slice(0, 4).map(([f, c]) => `Viền ô "${azName(f)}": ${r1(c)}:1 (cần 3:1)`), ...lowP.slice(0, 3).map(([f, c]) => `Placeholder "${azName(f)}": ${r1(c)}:1`)];
    if (lowT.length || lowB.length) put('A3', 'fail', `${lowT.length} nhãn và ${lowB.length} viền ô không đủ tương phản.`, ev, [...lowT, ...lowB].map(([f]) => f));
    else if (lowP.length) put('A3', 'warn', 'Placeholder có tương phản thấp.', ev, lowP.map(([f]) => f));
    else put('A3', N ? 'pass' : 'na', 'Nhãn và viền ô đủ tương phản.');
  } else put('A3', 'manual', 'Chưa đo tương phản ở chế độ này. Dùng chế độ Đầy đủ hoặc công cụ kiểm tra tương phản.');
  put('A4', 'manual', 'Chọn thử các lựa chọn: trang không được tự chuyển bước hay tự gửi.');
  const html2 = html.toLowerCase();
  const v2 = doc.querySelector('.g-recaptcha:not([data-size="invisible"]), .h-captcha, [data-hcaptcha-widget-id]') || /captcha/.test(Array.from(doc.querySelectorAll('img')).map((i) => (i.getAttribute('src') || '') + (i.getAttribute('alt') || '')).join(' ').toLowerCase());
  const inv = /recaptcha\/api\.js\?render=|challenges\.cloudflare\.com\/turnstile|data-size="invisible"/.test(html2);
  if (v2) put('A5', 'fail', 'Có CAPTCHA bắt người dùng giải đố (reCAPTCHA hộp kiểm, hCaptcha hoặc ảnh chữ méo).');
  else if (inv) put('A5', 'pass', 'Dùng CAPTCHA không tương tác.');
  else put('A5', 'pass', 'Không thấy CAPTCHA giải đố.');
  put('A6', 'manual', 'Bật trình đọc màn hình, tải tệp và thêm thành viên: trạng thái có được đọc lên?');

  /* ===== P · Tin cậy ===== */
  const links = Array.from(doc.querySelectorAll('a')).map((a) => fold(a.textContent + ' ' + (a.getAttribute('href') || '')));
  if (links.some((l) => /chinh sach (bao mat|quyen rieng tu|du lieu)|privacy|bao mat thong tin|bao ve du lieu/.test(l)) || /chinh sach bao mat|chinh sach quyen rieng tu/.test(T)) put('P1', 'pass', 'Có liên kết chính sách bảo mật.');
  else put('P1', 'fail', 'Không thấy liên kết chính sách bảo mật hay mục đích thu thập dữ liệu.');
  const contact = /[\w.+-]+@[\w-]+\.[\w.]+/.test(bodyText) || /hotline|tong dai|ho tro|lien he/.test(T) && /\d{4}[\s.]?\d{3,4}/.test(bodyText);
  const http = opt.url && /^http:/i.test(opt.url);
  if (http) put('P2', 'fail', 'Trang chạy trên http:// (không mã hóa) mà lại thu thập thông tin cá nhân.');
  else put('P2', contact ? 'pass' : 'warn', contact ? 'Có kênh liên hệ hỗ trợ trên trang.' : 'Không thấy email hoặc hotline hỗ trợ trên trang.');
  put('P3', 'manual', 'Kiểm tra trang xác nhận và email che bớt CCCD, số điện thoại.');

  return { R, info };
}

/* ---------- Gộp nhiều trang (nhiều bước) ---------- */
const AZ_ANY_PASS = new Set(['F1', 'F6', 'P1', 'P2', 'D5', 'R2', 'F3', 'F4']);
function azMerge(pages) {
  if (pages.length === 1) return pages[0].R;
  const out = {};
  const ord = { fail: 0, warn: 1, pass: 2, manual: 3, na: 4 };
  RULES.forEach((r) => {
    const rs = pages.map((p, i) => ({ ...(p.R[r.id] || { st: 'na', msg: '', ev: [] }), i }));
    let pick;
    if (AZ_ANY_PASS.has(r.id) && rs.some((x) => x.st === 'pass')) pick = rs.find((x) => x.st === 'pass');
    else pick = rs.slice().sort((a, b) => ord[a.st] - ord[b.st])[0];
    const ev = [];
    if (['fail', 'warn'].includes(pick.st)) rs.filter((x) => x.st === pick.st).forEach((x) => (x.ev.length ? x.ev : [x.msg]).forEach((e) => ev.push(`Bước ${x.i + 1}: ${e}`)));
    out[r.id] = { st: pick.st, msg: pick.msg, ev: ev.length ? ev : pick.ev };
  });
  return out;
}

/* ---------- Điểm tổng ---------- */
function azSummary(R) {
  const c = { pass: 0, fail: 0, warn: 0, manual: 0, na: 0 };
  let mustFail = 0;
  RULES.forEach((r) => { const s = (R[r.id] || {}).st || 'manual'; c[s]++; if (s === 'fail' && r.lv === 'm') mustFail++; });
  const auto = c.pass + c.fail + c.warn;
  const score = auto ? Math.round(c.pass / (c.pass + c.fail + c.warn * 0.5) * 100) : 0;
  return { ...c, auto, mustFail, score };
}
