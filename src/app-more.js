/* ============================================================
   FORM MẪU — đăng ký dự thi, có chú thích nguyên tắc
   ============================================================ */
const PG_STEPS = [
  { n: 'Thông tin thí sinh', s: 'Thí sinh' },
  { n: 'Thông tin liên hệ', s: 'Liên hệ' },
  { n: 'Bài dự thi', s: 'Bài dự thi' },
  { n: 'Xem lại và gửi', s: 'Xem lại' },
];
const pgFresh = () => ({ v: {}, savedAt: 0, maxStep: 0, code: '', submittedAt: 0 });
const PG = {
  d: Object.assign(pgFresh(), store.get('fx-pg', {})),
  ui: Object.assign({ ann: true, device: 'desk' }, store.get('fx-pgui', {})),
  returnTo: false, focusField: null, form: null, team: null, step: 0, busy: false,
};
const pgStore = () => store.set('fx-pg', PG.d);
const PG_TITLE = 'Cuộc thi Ý tưởng Sáng tạo Trẻ 2026';

function viewPlayground(main, h) {
  let step = 0;
  if (h === 'form-mau-xong') step = 5; else { const m = /^form-mau-(\d)$/.exec(h); if (m) step = +m[1]; }
  if (step === 5 && !PG.d.code) step = PG.d.maxStep || 0;
  if (step >= 1 && step <= 4 && step > Math.max(1, PG.d.maxStep)) { location.replace(`#form-mau-${Math.max(1, PG.d.maxStep)}`); return; }
  if (step >= 1 && step <= 4 && PG.d.code) { /* đã gửi: xem lại bằng trang xác nhận */ }
  PG.step = step;
  const already = $('#pg-inner');
  if (!already) {
    main.innerHTML = `<div class="view">
      <div class="page-head"><p class="eyebrow">Ví dụ hoàn chỉnh</p><h1 class="h1">Form mẫu: đăng ký dự thi</h1>
        <p class="lead">Một form áp dụng trọn bộ nguyên tắc. Bật chú thích để thấy nguyên tắc nào nằm ở đâu, chuyển sang khung điện thoại, hoặc mô phỏng mất mạng để thử các tình huống lỗi.</p></div>
      <div class="pg-bar" role="group" aria-label="Điều khiển form mẫu">
        <div class="pg-bar-g">
          <label class="switch"><input type="checkbox" id="pg-ann" ${PG.ui.ann ? 'checked' : ''}><span class="sw"></span>Hiện chú thích nguyên tắc</label>
          <div class="seg pg-devseg" role="group" aria-label="Khung hiển thị"><button type="button" data-dev="desk" aria-pressed="${PG.ui.device === 'desk'}">${ic('monitor', 15)}Máy tính</button><button type="button" data-dev="phone" aria-pressed="${PG.ui.device === 'phone'}">${ic('phone', 15)}Điện thoại</button></div>
          <label class="switch"><input type="checkbox" class="sim-offline" ${SIM.offline ? 'checked' : ''}><span class="sw"></span>Mô phỏng mất mạng</label>
        </div>
        <div class="pg-bar-g" id="pg-tools">
          <button type="button" class="btn btn-sec btn-sm" id="pg-fill">${ic('spark', 15)}Điền dữ liệu mẫu</button>
          <button type="button" class="btn btn-ghost btn-sm btn-danger" id="pg-reset">Xóa dữ liệu, làm lại</button>
        </div>
      </div>
      <div class="pg-stage"><div class="pg-frame ${PG.ui.device === 'phone' ? 'phone' : ''} ${PG.ui.ann ? 'show-ann' : ''}" id="pg-frame">
        <div class="pg-org"><span><b>${PG_TITLE}</b> · Ban tổ chức (mẫu) ${annHTML('P2')}</span><span class="pg-saved" id="pg-saved" aria-live="polite"></span></div>
        <div class="pg-inner" id="pg-inner"></div>
      </div></div>
      <div class="pg-annlist" id="pg-annlist" ${PG.ui.ann ? '' : 'hidden'}></div>
      <p class="muted" style="font-size:13px;text-align:center;margin-top:14px">Form mẫu: dữ liệu không được gửi đi đâu, bản nháp chỉ lưu trên trình duyệt của bạn.</p>
    </div>`;
    bindPgBar();
  }
  renderPgStep();
}
function bindPgBar() {
  $('#pg-ann').addEventListener('change', (e) => { PG.ui.ann = e.target.checked; store.set('fx-pgui', PG.ui); $('#pg-frame').classList.toggle('show-ann', PG.ui.ann); $('#pg-annlist').hidden = !PG.ui.ann; });
  $$('[data-dev]').forEach((b) => b.addEventListener('click', () => {
    PG.ui.device = b.dataset.dev; store.set('fx-pgui', PG.ui);
    $$('[data-dev]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.dev === PG.ui.device)));
    $('#pg-frame').classList.toggle('phone', PG.ui.device === 'phone');
  }));
  bindSimToggles($('.pg-bar'));
  const tools = $('#pg-tools');
  const toolsHTML = tools.innerHTML;
  tools.addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.id === 'pg-fill') pgFill();
    else if (t.id === 'pg-reset') {
      tools.innerHTML = `<span class="confirm-inline" role="group" aria-label="Xác nhận xóa"><span>Xóa toàn bộ dữ liệu đã nhập?</span><button type="button" class="btn btn-sec btn-sm btn-danger" id="pg-reset-yes">Xóa</button><button type="button" class="btn btn-ghost btn-sm" id="pg-reset-no">Hủy</button></span>`;
      $('#pg-reset-no').focus();
    } else if (t.id === 'pg-reset-no') { tools.innerHTML = toolsHTML; $('#pg-reset').focus(); }
    else if (t.id === 'pg-reset-yes') {
      PG.d = pgFresh(); store.del('fx-pg'); PG.returnTo = false; tools.innerHTML = toolsHTML;
      toast('Đã xóa dữ liệu form mẫu');
      if (location.hash === '#form-mau') renderPgStep(); else location.hash = 'form-mau';
    }
  });
}
function pgSavedText() {
  const el = $('#pg-saved'); if (!el) return;
  if (PG.d.code) { el.innerHTML = `${ic('ok', 15)}Đã gửi lúc ${fmtTime(PG.d.submittedAt)}`; return; }
  el.innerHTML = PG.d.savedAt ? `${ic('save', 15)}Đã lưu nháp lúc ${fmtTime(PG.d.savedAt)} ${annHTML('D1')}` : `${ic('save', 15)}Tự động lưu nháp ${annHTML('D1')}`;
}
const pgSaveSoon = debounce(() => pgSave(), 700);
function pgSave() {
  if (!PG.form || PG.d.code) return;
  PG.form.ctls.forEach((c) => {
    if (!c.id.startsWith('pg-')) return;
    const k = c.id.slice(3);
    PG.d.v[k] = c.raw ? c.raw() : c.get();
  });
  if (PG.team) PG.d.v.members = PG.team.get();
  PG.d.savedAt = Date.now(); pgStore(); pgSavedText();
}
function pgMarkSaving() { const el = $('#pg-saved'); if (el && !PG.d.code) el.innerHTML = `<span class="spin" style="width:13px;height:13px;border-width:2px" aria-hidden="true"></span>Đang lưu…`; }

function stepperHTML(step) {
  return `<div class="pg-steps">
    <div class="pg-steps-top"><span class="eyebrow">Bước ${step}/4</span>${annHTML('F6')}</div>
    <div class="pg-bars" aria-hidden="true">${PG_STEPS.map((s, i) => `<i class="${i + 1 < step ? 'done' : i + 1 === step ? 'cur' : ''}"></i>`).join('')}</div>
    <ol class="pg-stepnames" aria-label="Các bước">${PG_STEPS.map((s, i) => {
      const n = i + 1;
      if (n === step) return `<li class="cur" aria-current="step"><span>${s.s}</span></li>`;
      if (n <= PG.d.maxStep && !PG.d.code) return `<li><a href="#form-mau-${n}">${ic('ok', 13)} ${s.s}</a></li>`;
      return `<li><span>${s.s}</span></li>`;
    }).join('')}</ol>
  </div>`;
}

function drawAnnList() {
  const el = $('#pg-annlist'); if (!el) return;
  const ids = [...new Set($$('#pg-frame .ann').map((b) => b.dataset.ann))].filter((id) => RULE_BY_ID[id]);
  const where = PG.step === 0 ? 'trang giới thiệu' : PG.step === 5 ? 'trang xác nhận' : `bước ${PG.step}`;
  el.innerHTML = `<h2 class="h3" style="font-size:15px">Nguyên tắc áp dụng ở ${where} <span class="muted" style="font-weight:500">(${ids.length})</span></h2><div class="rel-list">${ids.map((id) => ruleChip(id, true)).join('')}</div>`;
}
function renderPgStep() {
  const box = $('#pg-inner'); if (!box) return;
  setTimeout(drawAnnList, 0);
  PG.form = makeForm(); PG.team = null;
  const st = PG.step, v = PG.d.v;
  pgSavedText();
  if (st === 0) return pgIntro(box);
  if (st === 5) return pgDone(box);
  const backHref = PG.returnTo ? '#form-mau-4' : (st === 1 ? '#form-mau' : `#form-mau-${st - 1}`);
  const primary = PG.returnTo && st < 4 ? 'Lưu và quay lại trang xem lại' : (st === 4 ? 'Gửi hồ sơ đăng ký' : 'Tiếp tục');
  let body = '';
  if (st === 1) {
    body = `${fieldHTML({ ...DC.name('pg'), ann: 'I6 L1' })}
      ${fieldHTML({ ...DC.dob('pg'), ann: 'I7 T3' })}
      <div class="f-reveal" id="pg-guard" hidden>
        <div class="f-reveal-note">${ic('info', 16)}<span>Vì bạn chưa đủ 18 tuổi tính đến hạn chót, cần thông tin của cha, mẹ hoặc người giám hộ hợp pháp. ${annHTML('T3 T1')}</span></div>
        ${fieldHTML({ id: 'pg-gname', label: 'Họ và tên người giám hộ', required: true, autocomplete: 'off', norm: 'name', v: 'name', emptyMsg: 'Nhập họ và tên người giám hộ' })}
        ${fieldHTML({ id: 'pg-grel', kind: 'radio', inline: true, label: 'Quan hệ với thí sinh', required: true, emptyMsg: 'Chọn quan hệ với thí sinh', options: [{ v: 'cha', n: 'Cha' }, { v: 'me', n: 'Mẹ' }, { v: 'khac', n: 'Người giám hộ khác' }] })}
        ${fieldHTML({ ...DC.phone('pg'), id: 'pg-gphone', label: 'Số điện thoại người giám hộ', emptyMsg: 'Nhập số điện thoại người giám hộ' })}
      </div>
      ${fieldHTML({ ...DC.photo('pg'), ann: 'U1 U2 U5' })}
      <div class="ann-note">${annHTML('F2')}<span>Không hỏi ở vòng này: số căn cước, địa chỉ chi tiết, giới tính. Chỉ cần khi trao giải.</span></div>`;
  } else if (st === 2) {
    body = `${fieldHTML({ ...DC.email('pg', true), hint: 'Xác nhận và kết quả sẽ gửi qua email này', ann: 'I9 V1' })}
      ${fieldHTML({ ...DC.phone('pg'), ann: 'I3 I1' })}
      ${fieldHTML({ ...DC.province('pg'), ann: 'C2 C3' })}
      ${fieldHTML({ ...DC.school('pg'), ann: 'C2 L3' })}
      <div class="ann-note">${annHTML('I9')}<span>Không có ô "Nhập lại email": thay bằng gợi ý sửa tên miền và trang xem lại.</span></div>`;
  } else if (st === 3) {
    body = `${fieldHTML({ ...DC.category('pg'), ann: 'C6' })}
      ${fieldHTML({ ...DC.mode('pg'), ann: 'C1 T1', after: `<div class="f-reveal" id="pg-teambox" hidden>${fieldHTML({ ...DC.team('pg'), ann: 'T2' })}<div id="pg-team"></div></div>` })}
      ${fieldHTML({ id: 'pg-title', label: 'Tên ý tưởng', hint: 'Tối đa 120 ký tự', required: true, autocomplete: 'off', v: 'title', emptyMsg: 'Nhập tên ý tưởng' })}
      ${fieldHTML({ ...DC.desc('pg'), ann: 'I8' })}
      ${fieldHTML({ ...DC.entry('pg'), ann: 'U3 U4' })}`;
  } else if (st === 4) {
    body = pgReviewHTML() + `
      <div class="pg-consents">
        ${fieldHTML({ id: 'pg-agree', kind: 'check', label: 'Tôi đã đọc và đồng ý với Thể lệ cuộc thi', required: true, emptyMsg: 'Bạn cần đồng ý với Thể lệ cuộc thi để gửi hồ sơ', ann: 'R2', extra: `<p class="f-hint" style="margin:-4px 0 0 34px">Tóm tắt: tác phẩm do bạn sở hữu; Ban tổ chức được dùng để quảng bá cuộc thi. <button type="button" class="f-linkbtn" id="pg-rules">Đọc thể lệ</button></p>` })}
        ${isMinor() ? fieldHTML({ id: 'pg-gagree', kind: 'check', label: 'Người giám hộ đã đọc và đồng ý cho thí sinh tham gia cuộc thi', required: true, emptyMsg: 'Cần sự đồng ý của người giám hộ vì thí sinh chưa đủ 18 tuổi', ann: 'T3' }) : ''}
        ${fieldHTML({ id: 'pg-news', kind: 'check', label: 'Tôi muốn nhận tin về các cuộc thi tiếp theo', required: false, ann: 'C5' })}
        <p class="muted" style="font-size:13.5px;margin:-8px 0 20px">Dữ liệu chỉ dùng để tổ chức cuộc thi và được xóa sau 12 tháng. <a href="#nt-p1">Chính sách bảo mật</a> ${annHTML('P1')}</p>
      </div>
      <div id="pg-neterr"></div>`;
  }
  box.innerHTML = `
    <a class="pg-back" href="${backHref}">${ic('left', 16)}${PG.returnTo && st < 4 ? 'Quay lại trang xem lại' : 'Quay lại'}</a>
    ${stepperHTML(st)}
    <h2 class="pg-h" id="pg-h" tabindex="-1">${PG_STEPS[st - 1].n}</h2>
    ${st < 4 ? `<p class="pg-req-note">Các trường có dấu * là bắt buộc. ${annHTML('L3')}</p>` : `<p class="pg-req-note">Kiểm tra lại thông tin trước khi gửi. Bạn vẫn sửa được hồ sơ đến ${DEADLINE_STR}. ${annHTML('R1 K3')}</p>`}
    <div id="pg-sum" hidden></div>
    <form id="pg-form" novalidate>${body}
      <div class="pg-nav"><button type="submit" class="btn btn-pri" id="pg-next">${primary}</button>${annHTML(st === 4 ? 'B1 B4' : 'B2 V6')}</div>
    </form>`;
  pgMount(st, box, v);
  $('#pg-form').addEventListener('submit', (e) => { e.preventDefault(); pgSubmit(st); });
  box.addEventListener('input', () => { pgMarkSaving(); pgSaveSoon(); });
  box.addEventListener('change', () => { pgMarkSaving(); pgSaveSoon(); });
  if (st === 4) { const r = $('#pg-rules'); r && r.addEventListener('click', openRulesDialog); }
  // focus
  const ff = PG.focusField; PG.focusField = null;
  setTimeout(() => {
    if (ff) { const c = PG.form.by(ff); if (c) { c.focus(); return; } }
    if (PG._navFocus) { $('#pg-h').focus({ preventScroll: true }); PG._navFocus = false; }
  }, 30);
}
function isMinor() {
  const d = PG.d.v.dob; if (!d) return false;
  const r = checkDob(d.d || '', d.m || '', d.y || '', {});
  return r.date ? ageAt(r.date, DEADLINE) < 18 : false;
}
function pgMount(st, box, v) {
  const F = PG.form;
  const add = (cfg) => { const c = F.add(mountField(cfg, box)); const k = cfg.id.slice(3); if (v[k] != null && v[k] !== '') c.set(v[k]); return c; };
  if (st === 1) {
    add(DC.name('pg'));
    const guard = () => { const g = $('#pg-guard'); const was = !g.hidden; PG.d.v.dob = dob.get(); const on = isMinor(); g.hidden = !on; if (on && !was) announce('Đã hiện thêm phần thông tin người giám hộ'); };
    const dob = add({ ...DC.dob('pg'), onChange: guard, onInput: () => {} });
    add({ id: 'pg-gname', label: 'Họ và tên người giám hộ', required: true, autocomplete: 'off', norm: 'name', v: 'name', emptyMsg: 'Nhập họ và tên người giám hộ' });
    add({ id: 'pg-grel', kind: 'radio', inline: true, label: 'Quan hệ với thí sinh', required: true, emptyMsg: 'Chọn quan hệ với thí sinh', options: [{ v: 'cha', n: 'Cha' }, { v: 'me', n: 'Mẹ' }, { v: 'khac', n: 'Người giám hộ khác' }] });
    add({ ...DC.phone('pg'), id: 'pg-gphone', label: 'Số điện thoại người giám hộ', emptyMsg: 'Nhập số điện thoại người giám hộ' });
    add({ ...DC.photo('pg'), onChange: () => pgSaveSoon() });
    $('#pg-guard').hidden = !isMinor();
  } else if (st === 2) {
    add(DC.email('pg', true)); add(DC.phone('pg')); add(DC.province('pg')); add(DC.school('pg'));
  } else if (st === 3) {
    add(DC.category('pg'));
    const showTeam = (c) => {
      const on = c.get() === 'doi', tb = $('#pg-teambox'), was = !tb.hidden;
      tb.hidden = !on;
      if (on && !PG.team) {
        PG.team = teamWidget($('#pg-team'), { pre: 'pgt', min: 2, max: 5, lead: { name: NORM.name(PG.d.v.name || ''), email: NORM.email(PG.d.v.email || '') }, members: PG.d.v.members || [], onChange: () => pgSaveSoon() });
      }
      if (on && !was) announce('Đã hiện thêm phần thông tin đội');
      if (!on && was) announce('Đã ẩn phần thông tin đội');
    };
    const mode = add({ ...DC.mode('pg'), onChange: showTeam });
    add(DC.team('pg'));
    add({ id: 'pg-title', label: 'Tên ý tưởng', hint: 'Tối đa 120 ký tự', required: true, autocomplete: 'off', v: 'title', emptyMsg: 'Nhập tên ý tưởng' });
    add(DC.desc('pg'));
    add({ ...DC.entry('pg'), onChange: () => pgSaveSoon() });
    showTeam(mode);
  } else if (st === 4) {
    add({ id: 'pg-agree', kind: 'check', label: 'Tôi đã đọc và đồng ý với Thể lệ cuộc thi', required: true, emptyMsg: 'Bạn cần đồng ý với Thể lệ cuộc thi để gửi hồ sơ' });
    if (isMinor()) add({ id: 'pg-gagree', kind: 'check', label: 'Người giám hộ đã đọc và đồng ý cho thí sinh tham gia cuộc thi', required: true, emptyMsg: 'Cần sự đồng ý của người giám hộ vì thí sinh chưa đủ 18 tuổi' });
    add({ id: 'pg-news', kind: 'check', label: 'Tôi muốn nhận tin về các cuộc thi tiếp theo', required: false });
    $$('[data-edit]', box).forEach((a) => a.addEventListener('click', () => { PG.returnTo = true; PG.focusField = a.dataset.edit; }));
    const fx = $('#pg-fixmail', box);
    if (fx) fx.addEventListener('click', () => { const nv = emailSuggest(NORM.email(PG.d.v.email || '')); PG.d.v.email = nv; pgStore(); const agree = PG.form.by('pg-agree').get(); renderPgStep(); PG.form.by('pg-agree').set(agree); announce('Đã sửa email thành ' + nv); toast('Đã sửa email'); const e = box.querySelector('[data-edit="pg-email"]'); e && e.focus(); });
  }
}
function pgReviewHTML() {
  const v = PG.d.v, dash = '<span class="muted">Chưa có</span>';
  const row = (label, val, step, fid) => `<div class="review-row"><dt>${label}</dt><dd>${val || dash}</dd><a class="edit" href="#form-mau-${step}" data-edit="${fid}">Sửa<span class="vh"> ${label.toLowerCase()}</span></a></div>`;
  const dob = v.dob && v.dob.y ? `${pad2(v.dob.d)}/${pad2(v.dob.m)}/${v.dob.y}` : '';
  const file = (m) => (m ? `${m.thumb ? `<img src="${m.thumb}" alt="" style="width:36px;height:36px;object-fit:cover;border-radius:6px;vertical-align:middle;margin-right:8px">` : ''}${esc(m.name)} <span class="muted">· ${fmtMB(m.size)}</span>` : '');
  const cat = (CATEGORY_OPTS.find((o) => o.v === v.cat) || {}).n;
  const mode = v.mode === 'doi' ? 'Theo đội' : v.mode === 'canhan' ? 'Cá nhân' : '';
  const rel = { cha: 'Cha', me: 'Mẹ', khac: 'Người giám hộ khác' }[v.grel] || '';
  const desc = v.desc ? esc(v.desc.length > 180 ? v.desc.slice(0, 180).trim() + '…' : v.desc) + ` <span class="muted">(${countWords(v.desc)} từ)</span>` : '';
  const members = (v.members || []).filter((m) => m.name || m.email).map((m) => `${esc(m.name)} <span class="muted">· ${esc(m.email)}</span>`).join('<br>');
  return `
    <section class="review-sec"><h3>Thông tin thí sinh</h3><dl class="review-dl">
      ${row('Họ và tên', esc(NORM.name(v.name || '')), 1, 'pg-name')}
      ${row('Ngày sinh', dob, 1, 'pg-dob')}
      ${isMinor() ? row('Người giám hộ', v.gname ? `${esc(NORM.name(v.gname))}${rel ? ` · ${rel}` : ''}<br><span class="muted">${esc(NORM.phoneFmt(NORM.phone(v.gphone || '')))}</span>` : '', 1, 'pg-gname') : ''}
      ${row('Ảnh chân dung', file(v.photo), 1, 'pg-photo')}
    </dl></section>
    <section class="review-sec"><h3>Liên hệ</h3><dl class="review-dl">
      ${row('Email', esc(NORM.email(v.email || '')) + (emailSuggest(NORM.email(v.email || '')) ? `<span class="f-suggest" style="margin-top:6px">${ic('bulb', 16)}<span>Có thể gõ nhầm. Ý bạn là <b>${esc(emailSuggest(NORM.email(v.email || '')))}</b>?</span> <button type="button" class="f-linkbtn" id="pg-fixmail">Dùng địa chỉ này</button> ${annHTML('I9')}</span>` : ''), 2, 'pg-email')}
      ${row('Số điện thoại', esc(NORM.phoneFmt(NORM.phone(v.phone || ''))), 2, 'pg-phone')}
      ${row('Tỉnh/Thành phố', esc(v.province || ''), 2, 'pg-province')}
      ${row('Trường hoặc đơn vị', v.school ? esc(v.school) : '<span class="muted">Không điền</span>', 2, 'pg-school')}
    </dl></section>
    <section class="review-sec"><h3>Bài dự thi</h3><dl class="review-dl">
      ${row('Hạng mục', esc(cat || ''), 3, 'pg-cat')}
      ${row('Hình thức', mode, 3, 'pg-mode')}
      ${v.mode === 'doi' ? row('Tên đội', esc(v.teamname || ''), 3, 'pg-teamname') : ''}
      ${v.mode === 'doi' ? row('Thành viên', `${esc(NORM.name(v.name || ''))} <span class="muted">· trưởng nhóm</span>${members ? '<br>' + members : ''}`, 3, 'pg-mode') : ''}
      ${row('Tên ý tưởng', esc(v.title || ''), 3, 'pg-title')}
      ${row('Mô tả', desc, 3, 'pg-desc')}
      ${row('Tệp bài dự thi', file(v.file), 3, 'pg-file')}
    </dl></section>`;
}
function pgSubmit(st) {
  if (PG.busy) return;
  const F = PG.form;
  let errs = F.validate();
  if (st === 3 && PG.team && !$('#pg-teambox').hidden) errs = errs.concat(PG.team.validate());
  if (st === 4) {
    const v = PG.d.v; const miss = [];
    const need = [['name', 1, 'Thông tin thí sinh'], ['photo', 1, 'Thông tin thí sinh'], ['email', 2, 'Liên hệ'], ['phone', 2, 'Liên hệ'], ['province', 2, 'Liên hệ'], ['cat', 3, 'Bài dự thi'], ['title', 3, 'Bài dự thi'], ['file', 3, 'Bài dự thi']];
    need.forEach(([k, s, n]) => { if (!v[k]) miss.push({ s, n }); });
    if (miss.length) { const s = miss[0]; errs.push({ ctl: { id: 'x', focusId: () => `form-mau-${s.s}`, focus: () => { location.hash = `form-mau-${s.s}`; } }, msg: `Phần "${s.n}" còn thiếu thông tin. Bấm để bổ sung` }); }
  }
  const sum = $('#pg-sum');
  if (errs.length) { showSummary(sum, errs, F, st === 4 ? `Cần sửa ${errs.length} mục trước khi gửi hồ sơ` : undefined); announce(`Cần sửa ${errs.length} mục`); return; }
  sum.hidden = true; sum.innerHTML = '';
  pgSave();
  if (st < 4) {
    PG.d.maxStep = Math.max(PG.d.maxStep, st + 1); pgStore();
    const to = PG.returnTo ? 4 : st + 1;
    if (PG.returnTo) PG.d.maxStep = Math.max(PG.d.maxStep, 4);
    PG.returnTo = false; PG._navFocus = true;
    location.hash = `form-mau-${to}`;
    return;
  }
  // Gửi
  const btn = $('#pg-next'); PG.busy = true;
  btn.disabled = true; btn.innerHTML = `<span class="spin" aria-hidden="true"></span>Đang gửi hồ sơ…`; announce('Đang gửi hồ sơ');
  $('#pg-neterr').innerHTML = '';
  setTimeout(() => {
    PG.busy = false;
    if (SIM.offline) {
      btn.disabled = false; btn.textContent = 'Gửi hồ sơ đăng ký';
      $('#pg-neterr').innerHTML = `<div class="f-banner err" role="alert" tabindex="-1">${ic('wifioff', 20)}<div><b>Chưa gửi được hồ sơ do mất kết nối</b>Dữ liệu của bạn vẫn được giữ nguyên. Kiểm tra mạng rồi bấm "Gửi hồ sơ đăng ký" lần nữa. ${annHTML('V8 V5')}</div></div>`;
      $('#pg-neterr .f-banner').focus();
      return;
    }
    PG.d.code = `YT26-${String(Math.floor(10000 + Math.random() * 89999))}`;
    PG.d.submittedAt = Date.now(); pgStore();
    PG._navFocus = true;
    location.hash = 'form-mau-xong';
  }, 1400);
}
function pgIntro(box) {
  const hasDraft = PG.d.savedAt && !PG.d.code;
  const left = daysLeft();
  box.innerHTML = `
    <p class="pg-status" style="font-size:14px;font-weight:600;color:var(--ok)">Đang nhận hồ sơ · còn ${left} ngày ${annHTML('T4')}</p>
    <h2 class="pg-h" id="pg-h" tabindex="-1" style="margin-top:8px">Đăng ký dự thi</h2>
    <p style="font-size:16px;color:var(--ink-2);margin-top:8px;max-width:58ch">Cuộc thi dành cho người trẻ có ý tưởng giải quyết một vấn đề cụ thể trong cộng đồng. Giải nhất 100 triệu đồng.</p>
    <div class="pg-intro-grid" aria-label="Trước khi bắt đầu">
      <div class="pg-intro-row"><span class="ic-wrap">${ic('clock', 18)}</span><div><b>Mất khoảng 8 phút, gồm 4 bước ${annHTML('F1')}</b><span>Thông tin thí sinh · Liên hệ · Bài dự thi · Xem lại và gửi</span></div></div>
      <div class="pg-intro-row"><span class="ic-wrap">${ic('file', 18)}</span><div><b>Bạn cần chuẩn bị</b><span>Ảnh chân dung: JPG/PNG, tỷ lệ 3:4 (ảnh lớn được tự tối ưu)<br>Bài dự thi: 1 tệp PDF, tối đa 20 MB, không ghi tên thí sinh</span></div></div>
      <div class="pg-intro-row"><span class="ic-wrap">${ic('users', 18)}</span><div><b>Điều kiện tham gia</b><span>Từ 15 đến 30 tuổi tính đến ${fmtDate(DEADLINE)}. Dưới 18 tuổi cần thông tin người giám hộ. Dự thi cá nhân hoặc đội 2–5 người.</span></div></div>
      <div class="pg-intro-row"><span class="ic-wrap">${ic('calendar', 18)}</span><div><b>Hạn chót: ${DEADLINE_STR} ${annHTML('D5')}</b><span>Giờ Việt Nam (GMT+7). Bạn sửa được hồ sơ đến hạn chót.</span></div></div>
      <div class="pg-intro-row"><span class="ic-wrap">${ic('save', 18)}</span><div><b>Tự động lưu nháp</b><span>Bạn có thể dừng giữa chừng và quay lại sau trên trình duyệt này.</span></div></div>
    </div>
    ${hasDraft ? `<div class="f-banner info">${ic('save', 20)}<div><b>Bạn có bản nháp lưu lúc ${fmtTime(PG.d.savedAt)}, ngày ${fmtDate(new Date(PG.d.savedAt))}</b>Tiếp tục từ chỗ đã dừng, hoặc bắt đầu lại từ đầu.</div></div>
      <div class="btn-row"><a class="btn btn-pri" href="#form-mau-${Math.max(1, PG.d.maxStep)}" id="pg-start">Tiếp tục điền</a><button type="button" class="btn btn-sec" id="pg-restart">Bắt đầu lại</button></div>`
    : (PG.d.code ? `<div class="f-banner info">${ic('ok', 20)}<div><b>Bạn đã gửi hồ sơ ${esc(PG.d.code)}</b>Xem lại trang xác nhận, hoặc xóa dữ liệu để thử lại từ đầu.</div></div><div class="btn-row"><a class="btn btn-pri" href="#form-mau-xong">Xem trang xác nhận</a></div>`
    : `<div class="btn-row"><a class="btn btn-pri" href="#form-mau-1" id="pg-start">Bắt đầu đăng ký</a></div>`)}
    <p class="muted" style="font-size:13.5px;margin-top:22px">Cần hỗ trợ? <span style="user-select:all">hotro@example.com</span> · 1900 xxxx (8:00–17:00, thứ Hai – thứ Sáu)</p>`;
  const s = $('#pg-start'); if (s) s.addEventListener('click', () => { PG._navFocus = true; if (!PG.d.maxStep) { PG.d.maxStep = 1; pgStore(); } });
  const r = $('#pg-restart');
  if (r) r.addEventListener('click', () => {
    r.parentElement.innerHTML = `<span class="confirm-inline"><span>Xóa bản nháp và bắt đầu lại?</span><button type="button" class="btn btn-sec btn-sm btn-danger" id="pg-rs-y">Xóa bản nháp</button><button type="button" class="btn btn-ghost btn-sm" id="pg-rs-n">Giữ lại</button></span>`;
    $('#pg-rs-n').focus();
    $('#pg-rs-n').addEventListener('click', () => pgIntro(box));
    $('#pg-rs-y').addEventListener('click', () => { PG.d = pgFresh(); store.del('fx-pg'); pgSavedText(); pgIntro(box); toast('Đã xóa bản nháp'); });
  });
  if (PG._navFocus) { $('#pg-h').focus({ preventScroll: true }); PG._navFocus = false; }
}
function pgDone(box) {
  const v = PG.d.v, y = DEADLINE.getFullYear();
  const ph = NORM.phone(v.phone || '');
  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Hạn chót sửa hồ sơ – ' + PG_TITLE)}&dates=${y}${pad2(DEADLINE.getMonth() + 1)}${pad2(DEADLINE.getDate())}T150000Z/${y}${pad2(DEADLINE.getMonth() + 1)}${pad2(DEADLINE.getDate())}T165900Z&details=${encodeURIComponent('Mã hồ sơ ' + PG.d.code)}`;
  box.innerHTML = `
    <div class="done-hero">${ic('ok', 40)}<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><h2 id="pg-h" tabindex="-1">Đăng ký thành công</h2>${annHTML('K1')}</div>
      <div class="done-code"><span>Mã hồ sơ</span><b>${esc(PG.d.code)}</b><button type="button" class="btn btn-sec btn-sm" id="pg-copycode">${ic('copy', 15)}Sao chép</button></div>
      <p>Chúng tôi đã gửi email xác nhận tới <b>${esc(NORM.email(v.email || ''))}</b>. Nếu không thấy, hãy kiểm tra thư mục Spam hoặc Quảng cáo. ${annHTML('K2')}</p></div>
    <h3 style="font-size:18px;margin-bottom:6px">Tiếp theo</h3>
    <ol class="timeline">
      <li class="now"><time>Hôm nay</time><div><b>Đã nhận hồ sơ</b><br><span class="muted">${esc(NORM.name(v.name || ''))} · ${esc(NORM.phoneFmt(ph).replace(/^(\d{4}) (\d{3}) (\d{3})$/, '$1 *** $3'))} ${annHTML('P3')}</span></div></li>
      <li><time>${fmtDate(DEADLINE).slice(0, 5)}</time><div><b>Hạn chót nộp và sửa hồ sơ</b><br><span class="muted">Bạn sửa được hồ sơ đến ${DEADLINE_STR}</span></div></li>
      <li><time>15/12</time><div><b>Công bố danh sách vào vòng 2</b><br><span class="muted">Thông báo qua email và trên trang cuộc thi</span></div></li>
      <li><time>10/01</time><div><b>Chung kết</b><br><span class="muted">Tại Đà Nẵng, Ban tổ chức hỗ trợ đi lại</span></div></li>
    </ol>
    <div class="btn-row"><a class="btn btn-pri" href="${gcal}" target="_blank" rel="noopener">${ic('calendar', 16)}Thêm hạn chót vào Google Lịch</a><button type="button" class="btn btn-sec" id="pg-again">Đăng ký hồ sơ khác</button></div>
    <p class="muted" style="font-size:13.5px;margin-top:20px">Cần hỗ trợ? <span style="user-select:all">hotro@example.com</span> · 1900 xxxx · Nhớ ghi mã hồ sơ khi liên hệ.</p>`;
  $('#pg-copycode').addEventListener('click', () => copyText(PG.d.code, 'Đã sao chép mã hồ sơ'));
  $('#pg-again').addEventListener('click', () => { PG.d = pgFresh(); store.del('fx-pg'); location.hash = 'form-mau'; toast('Đã xóa dữ liệu, bắt đầu hồ sơ mới'); });
  if (PG._navFocus) { $('#pg-h').focus({ preventScroll: true }); PG._navFocus = false; }
}
function openRulesDialog() {
  openDialog({
    title: 'Thể lệ cuộc thi (tóm tắt)', wide: true,
    body: `<div class="rules-dlg"><p class="muted">Đọc xong, đóng hộp này — dữ liệu bạn đã nhập vẫn được giữ nguyên.</p>
      <h3>Đối tượng</h3><ul><li>Công dân Việt Nam từ 15 đến 30 tuổi tính đến ${fmtDate(DEADLINE)}.</li><li>Dự thi cá nhân hoặc theo đội 2–5 người; mỗi người chỉ thuộc một đội.</li></ul>
      <h3>Bài dự thi</h3><ul><li>Một tệp PDF, tối đa 20 MB, không ghi tên thí sinh (chấm ẩn danh).</li><li>Ý tưởng chưa đoạt giải ở cuộc thi khác.</li></ul>
      <h3>Quyền và dữ liệu</h3><ul><li>Tác giả giữ quyền sở hữu ý tưởng. Ban tổ chức được dùng tên, ảnh, tóm tắt ý tưởng để quảng bá cuộc thi.</li><li>Dữ liệu cá nhân chỉ dùng để tổ chức cuộc thi, xóa sau 12 tháng.</li></ul></div>`,
    actions: `<button type="button" class="btn btn-pri" data-dlg-close>Đã đọc, quay lại form</button>`,
  });
}
function pgFill() {
  const st = PG.step;
  if (st === 0 || st === 5) { PG.d.maxStep = Math.max(PG.d.maxStep, 1); pgStore(); PG._navFocus = true; location.hash = 'form-mau-1'; setTimeout(pgFill, 120); return; }
  const F = PG.form; const by = (id) => F.by(id);
  const put = (id, val) => { const c = by(id); if (!c) return; c.set(val); clearErr(c); const i = c.inputs()[0]; if (i && (c.c.kind || 'text') === 'text' && val) fireBlur(i); };
  if (st === 1) {
    put('pg-name', 'Nguyễn  Minh Anh');
    const d = by('pg-dob'); d.set({ d: '14', m: '08', y: '2009' }); clearErr(d); d.touched = true; d.validate(); PG.d.v.dob = d.get(); $('#pg-guard').hidden = !isMinor();
    put('pg-gname', 'Nguyễn Văn Hùng'); by('pg-grel').set('cha'); put('pg-gphone', '0903.456.789');
    sampleImage().then((f) => by('pg-photo').choose(f));
  } else if (st === 2) {
    put('pg-email', 'minh.anh@gmial.com'); put('pg-phone', '+84 912.345.678');
    by('pg-province').set('Đà Nẵng'); by('pg-school').set('Trường THPT chuyên Lê Quý Đôn (Đà Nẵng)');
  } else if (st === 3) {
    by('pg-cat').set('tech'); by('pg-mode').set('doi');
    $('#pg-teambox').hidden = false;
    if (!PG.team) PG.team = teamWidget($('#pg-team'), { pre: 'pgt', min: 2, max: 5, lead: { name: NORM.name(PG.d.v.name || ''), email: NORM.email(PG.d.v.email || '') }, members: [{ name: 'Trần Bảo Châu', email: 'bao.chau@gmail.com' }], onChange: () => pgSaveSoon() });
    else { PG.d.v.members = [{ name: 'Trần Bảo Châu', email: 'bao.chau@gmail.com' }]; }
    put('pg-teamname', 'Mây Xanh'); put('pg-title', 'Trợ lý nộp hồ sơ cho học sinh vùng cao');
    by('pg-desc').set(LONG_TEXT.split('\n\n')[0]);
    by('pg-file').choose(samplePdf('y-tuong-tro-ly-ho-so.pdf', 1.6 * 1024 * 1024));
  } else if (st === 4) {
    by('pg-agree').set(true); const g = by('pg-gagree'); if (g) g.set(true);
  }
  pgMarkSaving(); pgSaveSoon();
  toast('Đã điền dữ liệu mẫu cho bước này');
}

/* ============================================================
   THƯ VIỆN TRƯỜNG
   ============================================================ */
const FIELD_GROUPS = [
  ['personal', 'Thông tin cá nhân'], ['contact', 'Liên hệ & địa chỉ'], ['org', 'Học tập & đơn vị'],
  ['entry', 'Bài dự thi & tệp'], ['account', 'Tài khoản & xác thực'], ['consent', 'Lựa chọn & cam kết'],
];
const SIZE_TABLE = `<details class="more"><summary>${ic('down', 15)}Xem bảng size</summary><table class="spec" style="margin-top:6px"><tr><th>S</th><td>Cao 155–163 cm · 45–55 kg</td></tr><tr><th>M</th><td>Cao 163–170 cm · 55–63 kg</td></tr><tr><th>L</th><td>Cao 170–176 cm · 63–72 kg</td></tr><tr><th>XL</th><td>Cao 176–182 cm · 72–82 kg</td></tr><tr><th>XXL</th><td>Cao trên 182 cm · trên 82 kg</td></tr></table></details>`;
const FIELD_LIB = [
  { k: 'name', g: 'personal', cfg: () => DC.name('fl'), r: ['I6', 'I2', 'L1'], other: 'autocapitalize="words" spellcheck="false"', check: ['Bắt buộc', '2–100 ký tự', 'Có chữ cái, không chứa chữ số'], norm: ['Gộp khoảng trắng thừa', 'Chuẩn hóa Unicode NFC'], errs: ['Nhập họ và tên', 'Họ và tên cần có ít nhất 2 ký tự', 'Họ và tên không chứa chữ số'], notes: ['Một ô duy nhất, không tách Họ/Tên', "Chấp nhận dấu nháy, dấu gạch: H'Lan Niê, Anh-Thư"], tries: ['Tôn Nữ Hoàng Bảo Ngọc Phương Thảo', '  Lê   Văn  An '] },
  { k: 'dob', g: 'personal', cfg: () => DC.dob('fl'), r: ['I7', 'I5', 'A2'], check: ['Ngày có thật', 'Không ở tương lai', 'Trong độ tuổi điều kiện (ví dụ 15–30 tuổi tính đến hạn chót)'], norm: ['Thêm số 0: 3 → 03'], errs: ['Nhập ngày sinh', 'Ngày sinh cần có năm', 'Ngày sinh phải là một ngày có thật', 'Thí sinh cần sinh trong khoảng …'], notes: ['Thứ tự ngày/tháng/năm kiểu Việt Nam', 'Không tự nhảy ô', 'Lỗi chỉ tô đỏ phần sai'], dobTries: [['30', '02', '2008'], ['27', '03', '']] },
  { k: 'gender', g: 'personal', cfg: () => ({ id: 'fl-gender', kind: 'radio', inline: true, label: 'Giới tính', required: false, options: [{ v: 'nam', n: 'Nam' }, { v: 'nu', n: 'Nữ' }, { v: 'khac', n: 'Khác' }] }), r: ['F2', 'C1', 'C5'], check: ['Thường không bắt buộc'], errs: ['Chọn giới tính (chỉ khi bắt buộc)'], notes: ['Chỉ hỏi khi thật sự dùng, ví dụ chia giải nam/nữ', 'Không chọn sẵn'] },
  { k: 'cccd', g: 'personal', cfg: () => DC.cccd('fl'), r: ['I1', 'I3', 'L6', 'P3'], check: ['Đúng 12 chữ số sau khi bỏ khoảng trắng'], norm: ['Bỏ khoảng trắng, dấu chấm, gạch'], errs: ['Nhập số căn cước', 'Số căn cước gồm 12 chữ số. Bạn đã nhập {n} chữ số', 'Số căn cước chỉ gồm chữ số'], notes: ['Không dùng type="number": mất số 0 ở đầu (001…)', 'Không dùng maxlength: chuỗi dán có khoảng trắng bị cắt', 'Thường nên hỏi sau, khi trao giải (F2)', 'Hiển thị lại dạng ********4567'], tries: ['001 203 004 567', '0012030045'] },
  { k: 'photo', g: 'personal', cfg: () => DC.photo('fl'), r: ['U1', 'U2', 'U4', 'U5'], check: ['Định dạng JPG/PNG', 'Dung lượng (tự nén nếu vượt)', 'Từ chối HEIC kèm hướng dẫn đổi định dạng'], errs: ['Tải lên ảnh chân dung', 'Tệp "…" không đúng định dạng. Hãy tải lên tệp JPG hoặc PNG', 'Ảnh "…" ở định dạng HEIC…'], notes: ['Tải lên ngay khi chọn', 'Điện thoại tự đề xuất máy ảnh hoặc thư viện ảnh', 'Cân nhắc cho cắt khung 3:4'], files: true },
  { k: 'email', g: 'contact', cfg: () => DC.email('fl', true), r: ['I1', 'I2', 'I9', 'V1'], other: 'spellcheck="false" autocapitalize="none"', check: ['Có @ và tên miền', 'Kiểm tra trùng với máy chủ khi rời ô'], norm: ['Bỏ khoảng trắng', 'Tên miền về chữ thường'], errs: ['Nhập email', 'Email cần có ký tự @, ví dụ: ten@gmail.com', 'Nhập email đúng định dạng, ví dụ: ten@gmail.com'], notes: ['Gợi ý sửa tên miền gõ nhầm: gmial.com → gmail.com', 'Không có ô "Nhập lại email"'], tries: ['minh.anh@gmial.com', ' Lan.Pham@Gmail.COM '] },
  { k: 'phone', g: 'contact', cfg: () => DC.phone('fl'), r: ['I1', 'I3', 'I4'], check: ['10 chữ số sau chuẩn hóa', 'Đầu số di động 03, 05, 07, 08, 09'], norm: ['+84 / 84 → 0', 'Thêm 0 nếu thiếu (912… → 0912…)', 'Bỏ dấu chấm, gạch, khoảng trắng', 'Hiển thị 0912 345 678'], errs: ['Nhập số điện thoại', 'Số điện thoại cần có 10 chữ số. Bạn đã nhập {n} chữ số', 'Số điện thoại di động cần bắt đầu bằng 03, 05, 07, 08 hoặc 09'], notes: ['Số máy bàn (02x, 11 số): chỉ chấp nhận khi thật sự cần'], tries: ['+84 912.345.678', '912345678'] },
  { k: 'province', g: 'contact', cfg: () => DC.province('fl', true), r: ['C2', 'C3'], check: ['Chọn một trong 34 tỉnh/thành'], norm: ['Khớp không dấu, viết tắt, tên tỉnh cũ'], errs: ['Chọn tỉnh/thành phố', 'Chọn một tỉnh/thành phố trong danh sách gợi ý'], notes: ['Từ 01/07/2025: 34 tỉnh/thành, không còn cấp huyện', 'Gõ "Bình Dương" → TP. Hồ Chí Minh'], comboTries: ['binh duong', 'hcm'] },
  { k: 'ward', g: 'contact', cfg: () => ({ id: 'fl-ward', label: 'Phường/Xã', hint: 'Chọn tỉnh/thành trước. Trong sản phẩm thật: danh sách lọc theo tỉnh.', required: true, autocomplete: 'address-level2', emptyMsg: 'Chọn phường/xã', w: 'w-md' }), r: ['C3', 'C2'], type: 'combobox (lọc theo tỉnh)', check: ['Thuộc tỉnh/thành đã chọn'], errs: ['Chọn phường/xã'], notes: ['Đổi tỉnh → xóa phường/xã đã chọn và báo cho người dùng', 'Gồm cả đặc khu'] },
  { k: 'street', g: 'contact', cfg: () => ({ id: 'fl-street', label: 'Số nhà, tên đường', hint: 'Ví dụ: 12 ngõ 34 phố Huế', required: true, autocomplete: 'street-address', emptyMsg: 'Nhập số nhà, tên đường' }), r: ['F2', 'I2'], check: ['Không để trống'], errs: ['Nhập số nhà, tên đường'], notes: ['Chỉ hỏi khi cần gửi đồ (giải thưởng, vé giấy)'] },
  { k: 'school', g: 'org', cfg: () => DC.school('fl'), r: ['C2', 'L3'], check: ['Không bắt buộc khớp danh sách'], errs: ['Nhập tên trường hoặc đơn vị (nếu bắt buộc)'], notes: ['Hiểu tên viết tắt: bk, neu, ams', 'Có lựa chọn "Dùng tên bạn nhập" khi không có trong danh sách'], comboTries: ['ams', 'THPT Nguyễn Du'] },
  { k: 'mssv', g: 'org', cfg: () => ({ id: 'fl-mssv', label: 'Mã số sinh viên', hint: 'In trên thẻ sinh viên', required: false, autocomplete: 'off', spellcheck: false, autocapitalize: 'characters', w: 'w-id' }), r: ['F2', 'I3'], check: ['Không áp định dạng cứng — mỗi trường một kiểu'], errs: [], notes: ['Chỉ hỏi khi cần xác minh là sinh viên'] },
  { k: 'cat', g: 'entry', cfg: () => DC.category('fl'), r: ['C6', 'C1'], type: 'radio (thẻ lựa chọn)', check: ['Bắt buộc chọn', 'Không cho chọn hạng mục hết suất hoặc không đủ điều kiện'], errs: ['Chọn hạng mục dự thi'], notes: ['Hiển thị số suất còn lại', 'Không đủ điều kiện: hiện mờ kèm lý do, không ẩn'] },
  { k: 'title', g: 'entry', cfg: () => ({ id: 'fl-title', label: 'Tên ý tưởng', hint: 'Tối đa 120 ký tự', required: true, autocomplete: 'off', v: 'title', emptyMsg: 'Nhập tên ý tưởng' }), r: ['I8', 'V3'], check: ['Tối đa 120 ký tự (kiểm tra, không dùng maxlength)'], errs: ['Nhập tên ý tưởng', 'Tên ý tưởng tối đa 120 ký tự. Hiện có {n} ký tự'] },
  { k: 'desc', g: 'entry', cfg: () => DC.desc('fl'), r: ['I8', 'D1'], type: 'textarea', other: 'Bộ đếm có aria-live="polite", cập nhật có độ trễ', check: ['Tối đa 300 từ'], errs: ['Nhập mô tả ý tưởng', 'Mô tả tối đa 300 từ. Hiện có {n} từ'], notes: ['Đếm từ, không cắt cụt nội dung', 'Tự lưu nháp'] },
  { k: 'file', g: 'entry', cfg: () => DC.entry('fl'), r: ['U1', 'U2', 'U3'], check: ['Định dạng PDF', 'Tối đa 20 MB', 'Không rỗng'], errs: ['Tải lên tệp bài dự thi (PDF)', 'Tệp "…" không đúng định dạng. Hãy tải lên tệp PDF', 'Tệp "…" có dung lượng … MB, vượt giới hạn 20 MB'], files: true },
  { k: 'url', g: 'entry', cfg: () => ({ id: 'fl-url', label: 'Đường dẫn sản phẩm', hint: 'Ví dụ: behance.net/ten-ban', required: false, type: 'url', inputmode: 'url', autocomplete: 'url', spellcheck: false, autocapitalize: 'none', norm: 'url', v: 'url' }), r: ['I3', 'I1'], check: ['Đường dẫn hợp lệ, có tên miền'], norm: ['Tự thêm https:// nếu thiếu'], errs: ['Nhập đường dẫn đầy đủ, ví dụ: behance.net/ten-ban'], tries: ['behance.net/minhanh'] },
  { k: 'password', g: 'account', custom: 'password', n: 'Mật khẩu', r: ['I10', 'I9', 'F7'], type: 'password', auto: 'new-password', check: ['Ít nhất 8 ký tự', 'Ưu tiên độ dài hơn quy tắc phức tạp'], errs: ['Nhập mật khẩu', 'Mật khẩu cần ít nhất 8 ký tự'], notes: ['Một ô + nút Hiện/Ẩn, không ô nhập lại', 'Cho dán, hỗ trợ trình quản lý mật khẩu', 'Cuộc thi chỉ đăng ký một lần: cân nhắc bỏ mật khẩu'],
    snippet: `<div class="field">\n  <label for="password">Mật khẩu <span aria-hidden="true">*</span></label>\n  <p class="hint" id="password-hint">Ít nhất 8 ký tự</p>\n  <div class="password">\n    <input id="password" name="password" type="password"\n           autocomplete="new-password" aria-describedby="password-hint">\n    <button type="button" aria-controls="password" aria-pressed="false">Hiện</button>\n  </div>\n</div>` },
  { k: 'otp', g: 'account', custom: 'otp', n: 'Mã xác thực (OTP)', r: ['R3', 'I1', 'A5'], type: 'text', mode: 'numeric', auto: 'one-time-code', check: ['6 chữ số; tự kiểm tra khi đủ'], norm: ['Bỏ khoảng trắng khi dán'], errs: ['Mã chưa đúng. Kiểm tra lại tin nhắn hoặc gửi lại mã', 'Mã đã hết hạn. Gửi lại mã mới'], notes: ['Một ô, nhận dán cả chuỗi', 'Đếm ngược "Gửi lại mã sau 60 giây"', 'Cho sửa số điện thoại ngay tại chỗ'],
    snippet: `<div class="field">\n  <label for="otp">Mã xác thực</label>\n  <p class="hint" id="otp-hint">Mã gồm 6 chữ số đã gửi tới 0912 *** 678.\n    <button type="button">Sửa số</button></p>\n  <input id="otp" name="otp" type="text" inputmode="numeric"\n         autocomplete="one-time-code" aria-describedby="otp-hint">\n  <p class="hint" aria-live="polite">Gửi lại mã sau 60 giây</p>\n</div>` },
  { k: 'agree', g: 'consent', cfg: () => ({ id: 'fl-agree', kind: 'check', label: 'Tôi đã đọc và đồng ý với Thể lệ cuộc thi', required: true, emptyMsg: 'Bạn cần đồng ý với Thể lệ cuộc thi để gửi hồ sơ' }), r: ['R2', 'C5', 'P1'], check: ['Bắt buộc tích'], errs: ['Bạn cần đồng ý với Thể lệ cuộc thi để gửi hồ sơ'], notes: ['Không chọn sẵn', 'Liên kết đọc thể lệ không làm mất dữ liệu', 'Lưu thời điểm và phiên bản thể lệ đã đồng ý'] },
  { k: 'news', g: 'consent', cfg: () => ({ id: 'fl-news', kind: 'check', label: 'Tôi muốn nhận tin về các cuộc thi tiếp theo', required: false }), r: ['R2', 'C5'], check: ['Không bắt buộc'], errs: [], notes: ['Tách riêng khỏi ô đồng ý thể lệ', 'Không chọn sẵn'] },
  { k: 'size', g: 'consent', cfg: () => ({ id: 'fl-size', kind: 'radio', inline: true, label: 'Size áo', hint: 'Áo thun unisex, phát khi nhận số báo danh', required: true, emptyMsg: 'Chọn size áo', options: ['S', 'M', 'L', 'XL', 'XXL'].map((x) => ({ v: x, n: x })), after: SIZE_TABLE }), r: ['C1', 'F2'], check: ['Bắt buộc chọn (nếu có phát áo)'], errs: ['Chọn size áo'], notes: ['Chỉ hỏi khi thật sự phát áo', 'Bảng size xem ngay tại chỗ, không mở trang khác'] },
];
function fieldMeta(f) {
  const c = f.cfg ? f.cfg() : null;
  const type = f.type || (c ? ({ dob: 'text × 3 (fieldset)', radio: 'radio (fieldset)', check: 'checkbox', combo: 'combobox (text + listbox)', file: 'file' }[c.kind] || (c.multiline ? 'textarea' : (c.type || 'text'))) : '');
  return { c, n: f.n || (c ? stripTags(c.label) : ''), type, mode: f.mode || (c && c.inputmode) || '', auto: f.auto || (c && c.autocomplete) || '', accept: c && c.accept };
}
function viewFields(main) {
  main.innerHTML = `<div class="view">
    <div class="page-head"><p class="eyebrow">Bàn giao thiết kế và phát triển</p><h1 class="h1">Thư viện trường</h1><p class="lead">${FIELD_LIB.length} trường hay gặp trong form đăng ký ở Việt Nam. Mỗi trường có bản chạy thật, thông số HTML, quy tắc kiểm tra, câu lỗi và mã mẫu để sao chép.</p></div>
    <div class="filters">
      <div class="filter-row"><div class="search-in"><label class="vh" for="fl-q">Lọc trường</label>${ic('search', 18)}<input id="fl-q" type="search" placeholder="Lọc: email, ngày sinh, tệp…" autocomplete="off"></div></div>
      <div class="catbar" id="fl-g"><button type="button" data-g="all" aria-pressed="true">Tất cả</button>${FIELD_GROUPS.map(([k, n]) => `<button type="button" data-g="${k}" aria-pressed="false">${n}</button>`).join('')}</div>
    </div>
    <div class="fl" id="fl-list">${FIELD_LIB.map(fieldCard).join('')}</div>
    <div class="empty" id="fl-empty" hidden><b>Không có trường nào khớp</b>Thử từ khóa khác.</div>
  </div>`;
  FIELD_LIB.forEach((f) => mountFieldCard(f, main));
  let g = 'all';
  const apply = () => {
    const q = fold($('#fl-q').value); let n = 0;
    FIELD_LIB.forEach((f) => { const m = fieldMeta(f); const ok = (g === 'all' || f.g === g) && (!q || fold([m.n, f.k, m.type, m.auto, ...(f.notes || []), ...(f.errs || [])].join(' ')).includes(q)); $(`#fc-${f.k}`).hidden = !ok; if (ok) n++; });
    $('#fl-empty').hidden = n > 0;
  };
  $('#fl-q').addEventListener('input', debounce(apply, 120));
  $('#fl-g').addEventListener('click', (e) => { const b = e.target.closest('[data-g]'); if (!b) return; g = b.dataset.g; $$('#fl-g [data-g]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); apply(); });
}
function fieldCard(f) {
  const m = fieldMeta(f);
  const rows = [
    ['Loại', `<code>${esc(m.type)}</code>`],
    m.mode && ['inputmode', `<code>${esc(m.mode)}</code>`],
    m.auto && ['autocomplete', `<code>${esc(m.auto)}</code>`],
    m.accept && ['accept', `<code>${esc(m.accept)}</code>`],
    f.other && ['Thuộc tính khác', esc(f.other)],
    f.check && f.check.length && ['Kiểm tra', `<ul>${f.check.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`],
    f.norm && f.norm.length && ['Chuẩn hóa', `<ul>${f.norm.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`],
    f.errs && f.errs.length && ['Câu lỗi', `<ul>${f.errs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`],
    f.notes && f.notes.length && ['Lưu ý', `<ul>${f.notes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`],
  ].filter(Boolean);
  const snip = f.snippet || snippetFor(m.c);
  const live = f.custom === 'password' ? pwLiveHTML() : f.custom === 'otp' ? otpLiveHTML() : fieldHTML(m.c);
  const tries = [
    ...(f.tries || []).map((t, i) => `<button type="button" class="try-chip" data-try="${f.k}:${i}">“${esc(t)}”</button>`),
    ...(f.comboTries || []).map((t, i) => `<button type="button" class="try-chip" data-ctry="${f.k}:${i}">“${esc(t)}”</button>`),
    ...(f.dobTries || []).map((t, i) => `<button type="button" class="try-chip" data-dtry="${f.k}:${i}"><code>${t.map((x) => x || '__').join(' ')}</code></button>`),
    ...(f.files ? [`<button type="button" class="try-chip" data-ftry="${f.k}:ok">Tệp mẫu</button>`, `<button type="button" class="try-chip" data-ftry="${f.k}:bad">Tệp sai định dạng</button>`] : []),
  ].join('');
  return `<article class="fcard" id="fc-${f.k}">
    <div class="fcard-h"><h2>${esc(m.n)}</h2><div class="chips">${f.r.map((id) => ruleChip(id)).join('')}</div></div>
    <div class="fcard-b">
      <div class="fcard-live"><p class="eyebrow">${ic('play', 12)}Chạy thật</p><div id="fl-live-${f.k}">${live}</div>${tries ? `<div class="chips" style="margin:-6px 0 14px;align-items:center"><span class="muted" style="font-size:13px">Thử:</span>${tries}</div>` : ''}</div>
      <div class="fcard-spec"><table class="spec">${rows.map(([a, b]) => `<tr><th scope="row">${a}</th><td>${b}</td></tr>`).join('')}</table>
        <div class="code"><div class="code-h"><span id="snip-${f.k}">HTML · ${esc(m.n)}</span><button type="button" class="btn btn-ghost btn-sm" data-snip="${f.k}">${ic('copy', 14)}Sao chép</button></div><pre tabindex="0" aria-labelledby="snip-${f.k}"><code>${esc(snip)}</code></pre></div></div>
    </div>
  </article>`;
}
function pwLiveHTML() {
  return `<div class="f-field" id="fw-fl-pw"><label class="f-label" for="fl-pw">Mật khẩu <span class="f-req" aria-hidden="true">*</span></label><p class="f-hint" id="fl-pw-hint">Ít nhất 8 ký tự</p>
    <div class="pw-wrap"><input class="f-input" id="fl-pw" type="password" autocomplete="new-password" aria-describedby="fl-pw-hint"><button type="button" class="btn btn-sec pw-toggle" id="fl-pw-tg" aria-pressed="false" aria-controls="fl-pw">Hiện</button></div></div>`;
}
function otpLiveHTML() {
  return `<div class="f-field" id="fw-fl-otp"><label class="f-label" for="fl-otp">Mã xác thực</label><p class="f-hint" id="fl-otp-hint">Mã gồm 6 chữ số đã gửi tới 0912 *** 678. Mã mẫu: 123456</p>${errP('fl-otp')}
    <input class="f-input otp-in" id="fl-otp" inputmode="numeric" autocomplete="one-time-code" aria-describedby="fl-otp-hint"><div class="f-note" id="fl-otp-note" aria-live="polite"></div></div>`;
}
function mountFieldCard(f, main) {
  const host = $(`#fl-live-${f.k}`, main);
  let ctl = null;
  if (f.custom === 'password') {
    const inp = $('#fl-pw', host), tg = $('#fl-pw-tg', host);
    tg.addEventListener('click', () => { const s = inp.type === 'password'; inp.type = s ? 'text' : 'password'; tg.textContent = s ? 'Ẩn' : 'Hiện'; tg.setAttribute('aria-pressed', String(s)); inp.focus(); });
  } else if (f.custom === 'otp') {
    const inp = $('#fl-otp', host), note = $('#fl-otp-note', host); const c = { id: 'fl-otp', el: $('#fw-fl-otp', host), inputs: () => [inp] };
    inp.addEventListener('input', () => { const d = inp.value.replace(/\D/g, ''); if (d.length < 6) { clearErr(c); note.innerHTML = ''; return; } if (d === '123456') { clearErr(c); note.innerHTML = `${ic('ok', 16)}<span>Đã xác thực</span>`; } else { note.innerHTML = ''; setErr(c, 'Mã chưa đúng. Kiểm tra lại tin nhắn hoặc gửi lại mã'); } });
  } else ctl = mountField(fieldMeta(f).c, host);
  const card = $(`#fc-${f.k}`, main);
  card.addEventListener('click', async (e) => {
    const t = e.target.closest('[data-try],[data-ctry],[data-dtry],[data-ftry],[data-snip]'); if (!t) return;
    if (t.dataset.snip) { copyText(f.snippet || snippetFor(fieldMeta(f).c), 'Đã sao chép mã HTML'); return; }
    if (t.dataset.try) typeInto(ctl, f.tries[+t.dataset.try.split(':')[1]]);
    if (t.dataset.ctry) { const i = ctl.inputs()[0]; i.focus(); i.value = f.comboTries[+t.dataset.ctry.split(':')[1]]; i.dispatchEvent(new Event('input')); }
    if (t.dataset.dtry) { const [d, m, y] = f.dobTries[+t.dataset.dtry.split(':')[1]]; ctl.set({ d, m, y }); clearErr(ctl); ctl.touched = true; ctl.validate(); }
    if (t.dataset.ftry) {
      const bad = t.dataset.ftry.endsWith('bad');
      if (f.k === 'photo') ctl.choose(bad ? new File(['x'], 'IMG_0412.HEIC', { type: 'image/heic' }) : await sampleImage());
      else ctl.choose(bad ? new File(['docx'], 'bai-du-thi.docx', { type: 'application/msword' }) : samplePdf());
    }
  });
}

/* ============================================================
   CÂU CHỮ MẪU
   ============================================================ */
const varHL = (s) => esc(s).replace(/\{([^}]+)\}/g, '<span class="var">{$1}</span>');
function viewCopy(main) {
  main.innerHTML = `<div class="view">
    <div class="page-head"><p class="eyebrow">Microcopy tiếng Việt</p><h1 class="h1">Câu chữ mẫu</h1><p class="lead">Câu lỗi, gợi ý, nhãn nút, trạng thái, thông báo thành công — viết sẵn theo cùng một giọng. Phần trong <span class="cp-t"><span class="var">{ngoặc}</span></span> là chỗ thay thế.</p></div>
    <div class="cp-layout">
      <nav class="cp-toc" aria-label="Các nhóm câu chữ"><a href="#cau-chu" data-cp="cp-tone">Giọng văn</a><a href="#cau-chu" data-cp="cp-formula">Công thức câu lỗi</a>${COPY.map((g) => `<a href="#cau-chu" data-cp="cp-${g.id}">${g.n}</a>`).join('')}</nav>
      <div>
        <div class="filters" style="padding-top:0"><div class="filter-row"><div class="search-in"><label class="vh" for="cp-q">Lọc câu chữ</label>${ic('search', 18)}<input id="cp-q" type="search" placeholder="Lọc: tệp, email, hạn chót, nút…" autocomplete="off"></div></div></div>
        <section class="cp-group" id="cp-tone"><h2>Giọng văn: 6 quy tắc</h2><p>Áp dụng cho mọi câu chữ trong form.</p>
          <div class="tone">${TONE.map((t) => `<div class="tone-row"><b>${esc(t.t)}</b><span class="tone-bad">${ic('x', 15)}<span>${esc(t.bad)}</span></span><span class="tone-good">${ic('ok', 15)}<span>${esc(t.good)}</span></span></div>`).join('')}</div>
        </section>
        <section class="cp-group" id="cp-formula"><h2>Công thức câu lỗi</h2><p>Mỗi câu lỗi trả lời hai câu hỏi: chuyện gì sai, và sửa thế nào.</p>
          <div class="formula"><div><b>Vấn đề cụ thể</b>Số điện thoại cần có 10 chữ số</div><div class="plus" aria-hidden="true">+</div><div><b>Cách sửa / ví dụ</b>ví dụ 0912 345 678</div><div class="plus" aria-hidden="true">=</div><div class="res"><b>Câu lỗi</b>Số điện thoại cần có 10 chữ số, ví dụ 0912 345 678</div></div>
          <p class="muted" style="font-size:14px">Không dấu chấm cuối câu lỗi một câu. Không "Vui lòng" ở mọi câu. Xem {V3}.</p>
        </section>
        <div id="cp-groups">${COPY.map((g) => `<section class="cp-group" id="cp-${g.id}" data-g="${g.id}"><div class="sec-head" style="margin-bottom:4px"><h2>${g.n}</h2><button type="button" class="btn btn-ghost btn-sm" data-cpall="${g.id}">${ic('copy', 14)}Chép cả nhóm</button></div><p>${esc(g.d)}</p>
          <ul class="cp-items">${g.items.map((it, i) => `<li class="cp-item" id="cp-${g.id}-${i}" data-txt="${esc(fold(it.t + ' ' + (it.ex || '') + ' ' + (it.ctx || '')))}"><div><span class="cp-t">${varHL(it.t)}</span>${it.ex ? `<span class="cp-ex">Ví dụ: <b>${esc(it.ex)}</b></span>` : ''}${it.ctx ? `<span class="cp-ctx">${esc(it.ctx)}</span>` : ''}</div><button type="button" class="btn btn-ghost btn-sm" data-cp1="${g.id}:${i}" aria-label="Sao chép: ${esc(it.t)}">${ic('copy', 15)}<span class="only-fine">Chép</span></button></li>`).join('')}</ul>
          ${g.avoid ? `<div class="cp-avoid"><span class="muted">Tránh:</span>${g.avoid.map((a) => `<s>${esc(a)}</s>`).join('')}</div>` : ''}</section>`).join('')}</div>
        <div class="empty" id="cp-empty" hidden><b>Không có câu nào khớp</b>Thử từ khóa khác, gõ không dấu cũng được.</div>
      </div>
    </div>
  </div>`;
  $('.cp-group#cp-formula p.muted').innerHTML = `Không dấu chấm cuối câu lỗi một câu. Không mở đầu mọi câu bằng "Vui lòng". Xem ${ruleChip('V3', true)}.`;
  main.addEventListener('click', (e) => {
    const one = e.target.closest('[data-cp1]'), all = e.target.closest('[data-cpall]'), toc = e.target.closest('[data-cp]');
    if (one) { const [g, i] = one.dataset.cp1.split(':'); const it = COPY.find((x) => x.id === g).items[+i]; copyText(it.t, 'Đã sao chép câu chữ'); }
    if (all) { const g = COPY.find((x) => x.id === all.dataset.cpall); copyText(`${g.n}\n` + g.items.map((it) => `- ${it.t}`).join('\n'), `Đã sao chép nhóm "${g.n}"`); }
    if (toc) { e.preventDefault(); const t = document.getElementById(toc.dataset.cp); t && t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
  $('#cp-q').addEventListener('input', debounce(() => {
    const q = fold($('#cp-q').value); let any = 0;
    $$('.cp-item', main).forEach((li) => { const ok = !q || q.split(' ').every((w) => li.dataset.txt.includes(w)); li.hidden = !ok; if (ok) any++; });
    $$('#cp-groups .cp-group', main).forEach((s) => { s.hidden = !$$('.cp-item', s).some((li) => !li.hidden); });
    $('#cp-tone').hidden = !!q; $('#cp-formula').hidden = !!q;
    $('#cp-empty').hidden = any > 0;
  }, 120));
}

/* ============================================================
   ĐÁNH GIÁ FORM
   ============================================================ */
const AU_UI = { f: 'all' };
function verdictOf(a) {
  if (!a.done) return { k: 'none', ic: 'info', t: 'Chưa chấm tiêu chí nào', s: `Chấm từng tiêu chí bên dưới. Gợi ý: lọc "Bắt buộc" để kiểm tra nhanh ${a.mustTotal} tiêu chí quan trọng nhất trước.` };
  const mustLeft = a.mustTotal - a.mustPass - RULES.filter((r) => r.lv === 'm' && S.audit.items[r.id] === 'na').length - a.mustFail;
  if (a.mustFail) return { k: 'bad', ic: 'alert', t: `Chưa đạt chuẩn: ${a.mustFail} tiêu chí Bắt buộc chưa đạt`, s: 'Sửa các tiêu chí Bắt buộc trước khi ra mắt. Danh sách nằm đầu báo cáo khi sao chép.' };
  if (mustLeft > 0) return { k: 'mid', ic: 'clock', t: `Đang tốt, còn ${mustLeft} tiêu chí Bắt buộc chưa chấm`, s: 'Chưa có tiêu chí Bắt buộc nào trượt. Chấm nốt để có kết luận.' };
  const rate = a.pass / Math.max(1, a.pass + a.fail);
  if (rate >= 0.85) return { k: 'good', ic: 'ok', t: 'Đạt chuẩn', s: `Đạt toàn bộ tiêu chí Bắt buộc và ${Math.round(rate * 100)}% các tiêu chí đã chấm.` };
  return { k: 'mid', ic: 'clock', t: 'Đạt mức tối thiểu', s: `Đạt toàn bộ tiêu chí Bắt buộc, nhưng mới ${Math.round(rate * 100)}% tiêu chí đã chấm. Ưu tiên các mục "Nên".` };
}
function viewAudit(main, tab) {
  tab = tab || 'list';
  main.innerHTML = `<div class="view">
    <div class="page-head"><p class="eyebrow">Review</p><h1 class="h1">Đánh giá form</h1><p class="lead">Chấm form của bạn theo ${RULES.length} tiêu chí, ghi chú chỗ chưa đạt, rồi sao chép báo cáo dán vào Jira, Confluence hay Slack. Kết quả lưu trên trình duyệt này.</p></div>
    <div class="au-top">
      <div class="au-score" id="au-score"></div>
      <div class="au-meta">
        <div class="f-field"><label class="f-label" for="au-name">Tên form đang đánh giá</label><input class="f-input" id="au-name" autocomplete="off" value="${esc(S.audit.name)}" placeholder="Ví dụ: Đăng ký giải chạy 2026"></div>
        <div class="f-field"><label class="f-label" for="au-who">Người đánh giá <span class="f-opt">(không bắt buộc)</span></label><input class="f-input" id="au-who" autocomplete="name" value="${esc(S.audit.who)}"></div>
      </div>
    </div>
    <nav class="subtabs" aria-label="Loại đánh giá"><a href="#danh-gia" ${tab === 'list' ? 'aria-current="page"' : ''}>${ic('check', 16)}Checklist nguyên tắc</a><a href="#kiem-thu" ${tab === 'tests' ? 'aria-current="page"' : ''}>${ic('target', 16)}Kịch bản kiểm thử <span class="nav-count" style="margin-left:0">${TESTS.length}</span></a></nav>
    <div id="au-body"></div>
  </div>`;
  const nm = $('#au-name'), who = $('#au-who');
  nm.addEventListener('input', () => { S.audit.name = nm.value; saveAudit(); refreshNavAudit(); });
  who.addEventListener('input', () => { S.audit.who = who.value; saveAudit(); });
  drawScore();
  if (tab === 'tests') drawTests(); else drawChecklist();
}
function drawScore() {
  const a = auditStats(), v = verdictOf(a), el = $('#au-score'); if (!el) return;
  const m = auditStats('m');
  el.innerHTML = `<div class="au-verdict ${v.k}">${ic(v.ic, 24)}<div><b>${esc(v.t)}</b><span>${esc(v.s)}</span></div></div>
    <div class="au-nums"><div class="au-num ok"><b>${a.pass}</b><span>Đạt</span></div><div class="au-num err"><b>${a.fail}</b><span>Chưa đạt</span></div><div class="au-num"><b>${a.na}</b><span>Không áp dụng</span></div><div class="au-num"><b>${a.total - a.done}</b><span>Chưa chấm</span></div></div>
    <div><div class="au-bar-l"><span>Tất cả tiêu chí</span><span>${a.done}/${a.total} đã chấm</span></div>${meterHTML(a)}</div>
    <div><div class="au-bar-l"><span>Bắt buộc</span><span>${m.pass} đạt · ${m.fail} chưa đạt · ${m.total - m.done} chưa chấm</span></div>${meterHTML(m)}</div>`;
}
function drawChecklist() {
  const body = $('#au-body'); const f = AU_UI.f;
  const vis = (r) => f === 'all' || (f === 'm' && r.lv === 'm') || (f === 'todo' && !S.audit.items[r.id]) || (f === 'fail' && S.audit.items[r.id] === 'fail');
  const list = RULES.filter(vis);
  body.innerHTML = `<div class="au-actions">
      <div class="seg" role="group" aria-label="Lọc tiêu chí" id="au-f">${[['all', 'Tất cả'], ['m', 'Bắt buộc'], ['todo', 'Chưa chấm'], ['fail', 'Chưa đạt']].map(([k, n]) => `<button type="button" data-f="${k}" aria-pressed="${f === k}">${n}</button>`).join('')}</div>
      <div class="btn-row" id="au-btns"><button type="button" class="btn btn-pri btn-sm" id="au-md">${ic('copy', 15)}Sao chép báo cáo</button><button type="button" class="btn btn-sec btn-sm" id="au-csv">Sao chép CSV</button><button type="button" class="btn btn-ghost btn-sm btn-danger" id="au-reset">Đặt lại</button></div>
    </div>
    ${list.length ? CATS.filter((c) => list.some((r) => r.c === c.id)).map((c) => {
      const rs = list.filter((r) => r.c === c.id);
      const done = RULES.filter((r) => r.c === c.id && S.audit.items[r.id]).length, tot = RULES.filter((r) => r.c === c.id).length;
      return `<details class="au-group" open><summary><span class="cat-ic">${ic(c.ic, 18)}</span><h2>${c.n}</h2><span class="muted" style="font-size:13px">${done}/${tot}</span>${ic('down', 18, 'chev')}</summary>
        <ul class="au-items">${rs.map((r) => `<li class="au-item" id="au-${r.id}"><a class="rid" href="#nt-${r.id.toLowerCase()}" title="Xem nguyên tắc ${r.id}">${r.id}</a><div class="au-q">${fmt(r.chk)}<small>${lvPill(r.lv)} ${fmt(r.t)}</small></div>${statusSeg(r.id)}
          <div class="au-note" ${S.audit.items[r.id] === 'fail' ? '' : 'hidden'}><label for="au-n-${r.id}">Ghi chú: chưa đạt ở đâu?</label><textarea id="au-n-${r.id}" data-note="${r.id}" placeholder="Ví dụ: Bước 2, ô số điện thoại báo lỗi khi có dấu cách">${esc(S.audit.notes[r.id] || '')}</textarea></div></li>`).join('')}</ul></details>`;
    }).join('') : `<div class="empty"><b>${f === 'fail' ? 'Chưa có tiêu chí nào "Chưa đạt"' : 'Đã chấm hết'}</b>${f === 'todo' ? 'Bạn đã chấm toàn bộ tiêu chí. Sao chép báo cáo ở trên.' : 'Đổi bộ lọc để xem các tiêu chí khác.'}</div>`}`;
  $('#au-f').addEventListener('click', (e) => { const b = e.target.closest('[data-f]'); if (b) { AU_UI.f = b.dataset.f; drawChecklist(); $(`#au-f [data-f="${AU_UI.f}"]`).focus(); } });
  body.addEventListener('input', (e) => { const t = e.target.closest('[data-note]'); if (t) { S.audit.notes[t.dataset.note] = t.value; saveAudit(); } });
  $('#au-md').addEventListener('click', () => copyText(auditMarkdown(), 'Đã sao chép báo cáo Markdown'));
  $('#au-csv').addEventListener('click', () => copyText(auditCSV(), 'Đã sao chép CSV — dán vào Google Sheets/Excel'));
  bindAuditReset();
}
function bindAuditReset() {
  const btn = $('#au-reset'); if (!btn) return;
  btn.addEventListener('click', () => {
    const g = $('#au-btns'); const keep = g.innerHTML;
    g.innerHTML = `<span class="confirm-inline"><span>Xóa toàn bộ kết quả và ghi chú?</span><button type="button" class="btn btn-sec btn-sm btn-danger" id="au-rs-y">Xóa</button><button type="button" class="btn btn-ghost btn-sm" id="au-rs-n">Hủy</button></span>`;
    $('#au-rs-n').focus();
    $('#au-rs-n').addEventListener('click', () => { drawChecklistOrTests(); });
    $('#au-rs-y').addEventListener('click', () => { S.audit = { name: S.audit.name, who: S.audit.who, items: {}, notes: {}, tests: {} }; store.set('fx-audit', S.audit); refreshNavAudit(); drawScore(); drawChecklistOrTests(); toast('Đã đặt lại kết quả đánh giá'); });
  });
}
function drawChecklistOrTests() { if (location.hash === '#kiem-thu') drawTests(); else drawChecklist(); }
function drawTests() {
  const body = $('#au-body');
  const t = S.audit.tests;
  const n = { pass: 0, fail: 0 }; TESTS.forEach((x) => { const v = t[x.id] && t[x.id].v; if (v === 'pass') n.pass++; if (v === 'fail') n.fail++; });
  body.innerHTML = `<div class="au-actions"><p class="muted" style="font-size:14px">Làm như một người dùng thật, trên sản phẩm thật. ${n.pass} đạt · ${n.fail} lỗi · ${TESTS.length - n.pass - n.fail} chưa thử.</p>
      <div class="btn-row" id="au-btns"><button type="button" class="btn btn-pri btn-sm" id="au-md">${ic('copy', 15)}Sao chép báo cáo</button><button type="button" class="btn btn-ghost btn-sm btn-danger" id="au-reset">Đặt lại</button></div></div>
    <div class="tests">${TESTS.map((x, i) => {
      const v = (t[x.id] && t[x.id].v) || '';
      const b = (val, lb, icn) => `<button type="button" data-test="${x.id}" data-v="${val}" aria-pressed="${v === val}">${ic(icn, 15)}${lb}</button>`;
      return `<article class="test" id="test-${x.id}"><div><h2 class="test-t"><span class="rid">${i + 1}</span>${esc(x.t)}</h2><dl><dt>Làm</dt><dd>${esc(x.how)}</dd><dt>Mong đợi</dt><dd>${esc(x.exp)}</dd><dt>Liên quan</dt><dd><span class="chips">${x.r.map((id) => ruleChip(id)).join('')}</span></dd></dl></div>
        <div style="display:grid;gap:8px;align-content:start"><div class="statusseg" role="group" aria-label="Kết quả kịch bản ${i + 1}">${b('pass', 'Đạt', 'ok')}${b('fail', 'Lỗi', 'alert')}${b('na', 'Bỏ qua', 'x').replace('<button', '<button class="na"')}</div>
        <div ${v === 'fail' ? '' : 'hidden'} data-tnotebox="${x.id}"><label class="vh" for="tn-${x.id}">Mô tả lỗi</label><textarea id="tn-${x.id}" data-tnote="${x.id}" class="f-input f-textarea" style="min-height:70px;font-size:15px" placeholder="Mô tả lỗi gặp phải">${esc((t[x.id] && t[x.id].n) || '')}</textarea></div></div></article>`;
    }).join('')}</div>`;
  body.addEventListener('click', (e) => {
    const b = e.target.closest('[data-test]'); if (!b) return;
    const id = b.dataset.test, val = b.dataset.v;
    const cur = S.audit.tests[id] || {}; cur.v = cur.v === val ? '' : val; S.audit.tests[id] = cur; saveAudit();
    $$(`[data-test="${id}"]`).forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.v === cur.v)));
    const nb = $(`[data-tnotebox="${id}"]`); nb.hidden = cur.v !== 'fail'; if (!nb.hidden) $(`#tn-${id}`).focus();
  });
  body.addEventListener('input', (e) => { const ta = e.target.closest('[data-tnote]'); if (ta) { const cur = S.audit.tests[ta.dataset.tnote] || {}; cur.n = ta.value; S.audit.tests[ta.dataset.tnote] = cur; saveAudit(); } });
  $('#au-md').addEventListener('click', () => copyText(auditMarkdown(), 'Đã sao chép báo cáo Markdown'));
  bindAuditReset();
}
function auditMarkdown() {
  const a = auditStats(), v = verdictOf(a), m = auditStats('m');
  const name = S.audit.name || 'Form chưa đặt tên';
  const fails = (lv) => RULES.filter((r) => S.audit.items[r.id] === 'fail' && (lv === 'm' ? r.lv === 'm' : r.lv !== 'm'));
  const line = (r) => `- [ ] **${r.id}** ${plain(r.t)} — ${plain(r.chk)}${S.audit.notes[r.id] ? `\n  - Ghi chú: ${S.audit.notes[r.id].replace(/\n/g, ' ')}` : ''}`;
  const todo = RULES.filter((r) => !S.audit.items[r.id]).map((r) => r.id);
  const tests = TESTS.map((x, i) => { const t = S.audit.tests[x.id] || {}; const mark = t.v === 'pass' ? '✅' : t.v === 'fail' ? '❌' : t.v === 'na' ? '➖' : '⬜'; return `${mark} ${i + 1}. ${x.t}${t.v === 'fail' && t.n ? ` — ${t.n.replace(/\n/g, ' ')}` : ''}`; });
  return `# Đánh giá UX form: ${name}\n${S.audit.who ? `Người đánh giá: ${S.audit.who} · ` : ''}Ngày: ${fmtDate(new Date())}\n\n**Kết luận:** ${v.t}\n\n- Đạt ${a.pass} · Chưa đạt ${a.fail} · Không áp dụng ${a.na} · Chưa chấm ${a.total - a.done} (trên ${a.total} tiêu chí)\n- Bắt buộc: ${m.pass}/${m.total} đạt, ${m.fail} chưa đạt\n\n## Cần sửa — Bắt buộc (${fails('m').length})\n${fails('m').map(line).join('\n') || '_Không có_'}\n\n## Cần sửa — Nên / Cân nhắc (${fails('o').length})\n${fails('o').map(line).join('\n') || '_Không có_'}\n\n## Kịch bản kiểm thử\n${tests.join('\n')}\n${todo.length ? `\n## Chưa chấm (${todo.length})\n${todo.join(', ')}\n` : ''}\n_Theo bộ Chuẩn UX Form Đăng ký._`;
}
function auditCSV() {
  const q = (s) => `"${String(s || '').replace(/"/g, '""')}"`;
  const map = { pass: 'Đạt', fail: 'Chưa đạt', na: 'Không áp dụng' };
  return ['ID,Nhóm,Mức,Tiêu chí,Kết quả,Ghi chú'].concat(RULES.map((r) => [r.id, q(CAT_BY_ID[r.c].n), LEVELS[r.lv].n, q(plain(r.chk)), map[S.audit.items[r.id]] || 'Chưa chấm', q(S.audit.notes[r.id])].join(','))).join('\n');
}

/* ============================================================
   CÔNG CỤ
   ============================================================ */
const TOOLS_UI = { bp: 'contest' };
const DEC = Object.assign({ n: 14, files: 'yes', groups: '2', cond: 'yes', long: 'yes', mobile: 'yes' }, store.get('fx-dec', {}));
const QP_EX = [
  { f: 'Họ và tên', p: 'contact', now: 'yes', der: 'no', has: 'yes', ex: true },
  { f: 'Số căn cước', p: 'legal', now: 'no', der: 'no', has: 'lookup', ex: true },
  { f: 'Tuổi', p: 'review', now: 'yes', der: 'yes', has: 'yes', ex: true },
  { f: 'Bạn biết cuộc thi qua đâu?', p: 'stats', now: 'yes', der: 'no', has: 'yes', ex: true },
  { f: 'Nghề nghiệp của bố mẹ', p: 'unknown', now: 'yes', der: 'no', has: 'yes', ex: true },
];
let QP = store.get('fx-qp', null) || QP_EX.slice();
const QP_P = { review: 'xét duyệt, chấm thi', contact: 'liên hệ với người đăng ký', legal: 'trao giải, thủ tục pháp lý', stats: 'thống kê, báo cáo', mkt: 'tiếp thị, gửi tin', unknown: 'chưa rõ ai dùng' };
function qpVerdict(x) {
  if (x.p === 'unknown') return { k: 'drop', n: 'Bỏ', why: 'Chưa ai dùng dữ liệu này thì không hỏi.' };
  if (x.der === 'yes') return { k: 'derive', n: 'Suy ra, không hỏi', why: 'Tính từ dữ liệu khác hoặc lấy từ hệ thống (ví dụ tuổi từ ngày sinh).' };
  if (x.now === 'no') return { k: 'later', n: 'Hỏi sau', why: 'Chỉ hỏi khi thật sự cần (vòng sau, khi trao giải), form đăng ký ngắn hơn.' };
  if (x.p === 'mkt') return { k: 'opt', n: 'Không bắt buộc', why: 'Tách thành ô đồng ý riêng, không bắt buộc, không chọn sẵn ({R2}).' };
  if (x.p === 'stats') return { k: 'opt', n: 'Không bắt buộc', why: 'Ghi "(không bắt buộc)", hoặc chuyển sang khảo sát sau khi gửi.' };
  let why = `Cần cho ${QP_P[x.p]} ngay khi đăng ký.`;
  if (x.has === 'lookup') why += ' Người dùng phải tra cứu: báo trước trong "Trước khi bắt đầu" ({F1}).';
  if (x.has === 'no') why += ' Nhiều người chưa có: cho phép "Chưa có" hoặc bổ sung sau.';
  return { k: 'keep', n: 'Giữ, bắt buộc', why };
}
function viewTools(main, h) {
  const tab = h === 'cong-cu-mo-hinh' ? 'dec' : h === 'cong-cu-truong' ? 'qp' : h === 'cong-cu-do-luong' ? 'kpi' : 'bp';
  main.innerHTML = `<div class="view">
    <div class="page-head"><p class="eyebrow">Ra quyết định nhanh</p><h1 class="h1">Công cụ</h1><p class="lead">Chọn cấu trúc theo loại form, quyết định một trang hay nhiều bước, cắt bớt trường thừa — và đo xem form có thật sự tốt sau khi ra mắt.</p></div>
    <nav class="subtabs" aria-label="Công cụ"><a href="#cong-cu" ${tab === 'bp' ? 'aria-current="page"' : ''}>${ic('layers', 16)}Bản mẫu cấu trúc</a><a href="#cong-cu-mo-hinh" ${tab === 'dec' ? 'aria-current="page"' : ''}>${ic('branch', 16)}Một trang hay nhiều bước?</a><a href="#cong-cu-truong" ${tab === 'qp' ? 'aria-current="page"' : ''}>${ic('scissors', 16)}Có nên hỏi trường này?</a><a href="#cong-cu-do-luong" ${tab === 'kpi' ? 'aria-current="page"' : ''}>${ic('chart', 16)}Đo lường hiệu quả</a></nav>
    <div id="tool-body"></div>
  </div>`;
  ({ bp: toolBlueprint, dec: toolDecision, qp: toolQP, kpi: toolKPI })[tab]($('#tool-body'));
}
function toolBlueprint(body) {
  const draw = () => {
    const b = BLUEPRINTS.find((x) => x.id === TOOLS_UI.bp);
    const lvN = { req: 'Bắt buộc', opt: 'Không bắt buộc', cond: 'Có điều kiện', later: 'Hỏi sau', derive: 'Suy ra' };
    body.innerHTML = `<div class="bp-pick" role="group" aria-label="Loại form">${BLUEPRINTS.map((x) => `<button type="button" data-bp="${x.id}" aria-pressed="${x.id === b.id}"><b>${ic(x.ic, 17)}${x.n}</b><span>${x.ex}</span></button>`).join('')}</div>
      <div class="bp-sum"><div><b>Mô hình</b>${esc(b.model)}</div><div><b>Thời gian điền</b>${esc(b.time)}</div><div><b>Ví dụ</b>${esc(b.ex)}</div></div>
      <div class="legend-row">${Object.entries(lvN).map(([k, n]) => `<span class="bp-f ${k}" style="padding:2px 8px"><i>${n}</i></span>`).join('')}</div>
      <h2 class="vh">Các bước của form ${esc(b.n)}</h2>
      <ol class="bp-flow">${b.steps.map((s) => `<li class="bp-step"><div><h3>${esc(s.n)}</h3>${s.note ? `<p>${esc(s.note)}</p>` : ''}${s.f.length ? `<div class="bp-fields">${s.f.map(([n, lv, note]) => `<span class="bp-f ${lv}"><i>${lvN[lv]}</i>${esc(n)}${note ? ` <small>· ${esc(note)}</small>` : ''}</span>`).join('')}</div>` : ''}</div></li>`).join('')}</ol>
      <div class="two-col">
        <div class="box"><h3>Nguyên tắc then chốt</h3><div class="rel-list">${b.keys.map((id) => ruleChip(id, true)).join('')}</div></div>
        <div class="box"><h3>Bẫy hay gặp</h3><ul class="trap" style="margin:0;padding-left:18px;font-size:14.5px">${b.traps.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
      </div>
      <div class="btn-row" style="margin-top:18px"><button type="button" class="btn btn-sec" id="bp-copy">${ic('copy', 16)}Sao chép cấu trúc (Markdown)</button><a class="btn btn-ghost" href="#form-mau">Xem form mẫu đăng ký dự thi ${ic('right', 15)}</a></div>`;
    $('#bp-copy').addEventListener('click', () => copyText(`## Cấu trúc form: ${b.n}\nMô hình: ${b.model} · Thời gian: ${b.time}\n\n${b.steps.map((s, i) => `${i + 1}. **${s.n}**${s.note ? ` — ${s.note}` : ''}${s.f.map(([n, lv, note]) => `\n   - ${n} (${lvN[lv]}${note ? `; ${note}` : ''})`).join('')}`).join('\n')}\n\nNguyên tắc then chốt: ${b.keys.join(', ')}\nBẫy hay gặp:\n${b.traps.map((t) => `- ${t}`).join('\n')}`, 'Đã sao chép cấu trúc'));
  };
  body.addEventListener('click', (e) => { const x = e.target.closest('[data-bp]'); if (x) { TOOLS_UI.bp = x.dataset.bp; draw(); $(`[data-bp="${TOOLS_UI.bp}"]`).focus(); } });
  draw();
}
function decCompute(d) {
  const n = +d.n, files = d.files === 'yes', groups = +d.groups, cond = d.cond === 'yes', long = d.long === 'yes', mobile = d.mobile === 'yes';
  let model, sub, steps = 1; const why = [], need = [];
  if (n <= 3 && !files && !long) { model = 'Một trang, đặt ngay trong nội dung'; sub = 'Đăng ký nhanh: không cần trang riêng, thay form bằng lời xác nhận tại chỗ.'; why.push('Chỉ 1–3 trường: chia bước hay mở trang mới đều là thừa.'); need.push(['B4', 'Phản hồi khi gửi, chặn gửi trùng'], ['K1', 'Xác nhận ngay tại chỗ']); }
  else if (n <= 10 && groups === 1 && !files && !long) { model = 'Một trang'; sub = 'Một cột, nhãn trên ô, một nút chính.'; why.push('Ít trường, cùng một chủ đề: nhìn toàn cảnh và sửa nhanh trên một trang.'); need.push(['F5', 'Bố cục một cột'], ['V4', 'Tóm tắt lỗi khi gửi']); }
  else if (n <= 14 && groups <= 2 && !files && !long) { model = 'Một trang, chia nhóm có tiêu đề'; sub = 'Gom trường theo nhóm, tiêu đề rõ, khoảng cách giữa các nhóm lớn hơn.'; why.push('Còn vừa một trang nếu chia nhóm rõ ràng.'); need.push(['F4', 'Nhóm trường có tiêu đề'], ['V4', 'Tóm tắt lỗi khi gửi']); }
  else {
    steps = Math.min(6, Math.max(groups >= 3 ? 3 : 2, Math.ceil(n / 6)));
    model = `Nhiều bước: ${steps} bước + trang xem lại`; sub = 'Mỗi bước một nhóm thông tin, 3–7 trường, tên bước là danh từ dễ hiểu.';
    if (groups >= 3) why.push('Có từ 3 nhóm thông tin tách biệt: mỗi nhóm thành một bước.');
    if (n > 14) why.push(`${n} trường là quá dài cho một trang, nhất là trên điện thoại.`);
    if (files) why.push('Có tải tệp: tách riêng để tệp tải lên trong lúc người dùng điền phần khác.');
    if (long) why.push('Có bài viết dài hoặc phải tra cứu: người dùng cần lưu và quay lại.');
    need.push(['F6', 'Thanh tiến trình có tên bước'], ['R1', 'Trang xem lại có "Sửa" về đúng trường'], ['V4', 'Tóm tắt lỗi ở mỗi bước']);
  }
  if (files) need.push(['U3', 'Tải tệp ngay khi chọn, có tiến trình']);
  if (files || long || n > 15) need.push(['D1', 'Tự động lưu nháp']);
  if (long) need.push(['D3', 'Không để phiên hết hạn âm thầm']);
  if (cond) why.push('Có câu hỏi phụ thuộc: hiện ngay dưới câu kích hoạt; nhánh dài thì tách thành bước riêng.'), need.push(['T1', 'Câu hỏi điều kiện hiện đúng chỗ']);
  if (mobile && (n > 20 || (cond && n > 12))) why.push('Đa số dùng điện thoại và form phức tạp: cân nhắc "mỗi trang một câu hỏi" cho các nhánh khó.');
  if (mobile) need.push(['M1', 'Ô cao 48px, chữ 16px']);
  const lo = Math.round((n * 6 + (files ? 40 : 0) + (long ? 180 : 0)) / 60), hi = Math.round((n * 12 + (files ? 120 : 0) + (long ? 480 : 0)) / 60);
  return { model, sub, why, need, time: `${Math.max(1, lo)}–${Math.max(2, hi)} phút` };
}
function toolDecision(body) {
  const radio = (k, label, opts) => `<fieldset class="f-field f-fs"><legend class="f-label">${label}</legend><div class="f-choices inline">${opts.map(([v, n]) => `<label class="f-choice"><input type="radio" name="dec-${k}" value="${v}" ${DEC[k] === v ? 'checked' : ''}><span>${n}</span></label>`).join('')}</div></fieldset>`;
  body.innerHTML = `<div class="dec"><form id="dec-form" class="box" style="padding:20px" novalidate>
      <div class="f-field"><label class="f-label" for="dec-n">Số trường cần hỏi</label><p class="f-hint" id="dec-n-hint">Đếm sau khi đã rà bằng công cụ "Có nên hỏi trường này?"</p><div class="range-row"><input type="range" id="dec-n" min="1" max="40" value="${DEC.n}" aria-describedby="dec-n-hint"><output id="dec-n-o" for="dec-n">${DEC.n}</output></div></div>
      ${radio('groups', 'Số nhóm thông tin tách biệt', [['1', '1 nhóm'], ['2', '2–3 nhóm'], ['3', 'Từ 4 nhóm']])}
      ${radio('files', 'Có tải tệp lên không?', [['yes', 'Có'], ['no', 'Không']])}
      ${radio('long', 'Có bài viết dài hoặc phải tra cứu giấy tờ?', [['yes', 'Có'], ['no', 'Không']])}
      ${radio('cond', 'Có câu hỏi phụ thuộc câu trả lời trước?', [['yes', 'Có'], ['no', 'Không']])}
      ${radio('mobile', 'Đa số người dùng dùng điện thoại?', [['yes', 'Có'], ['no', 'Không']])}
    </form><div class="dec-out" id="dec-out" aria-live="polite"></div></div>`;
  const draw = () => {
    const r = decCompute(DEC);
    $('#dec-out').innerHTML = `<h2 class="eyebrow">Khuyến nghị</h2><h3>${esc(r.model)}</h3><p style="color:var(--ink-2)">${esc(r.sub)}</p>
      <div class="dec-time">${ic('clock', 18)}<span>Thời gian điền ước tính: <b>${r.time}</b> <span class="muted">(ước lượng thô — hãy đo với 5 người dùng thật)</span></span></div>
      <div><b style="font-size:14px">Vì sao</b><ul style="margin-top:6px">${r.why.map((w) => `<li>${esc(w)}</li>`).join('')}</ul></div>
      <div><b style="font-size:14px">Cần có kèm theo</b><div class="rel-list" style="margin-top:8px">${r.need.map(([id]) => ruleChip(id, true)).join('')}</div></div>`;
    store.set('fx-dec', DEC);
  };
  const nIn = $('#dec-n');
  nIn.addEventListener('input', () => { DEC.n = +nIn.value; $('#dec-n-o').textContent = DEC.n; draw(); });
  $('#dec-form').addEventListener('change', (e) => { const t = e.target; if (t.name && t.name.startsWith('dec-')) { DEC[t.name.slice(4)] = t.value; draw(); } });
  draw();
}
function toolQP(body) {
  const purposeOpts = Object.entries(QP_P).map(([v, n]) => ({ v, n: n.charAt(0).toUpperCase() + n.slice(1) }));
  body.innerHTML = `<form class="qp-form" id="qp-form" novalidate>
      <p class="muted" style="margin-bottom:16px;font-size:14.5px">Dựa trên "question protocol" của Caroline Jarrett: mỗi trường phải trả lời được ai dùng, dùng làm gì, cần lúc nào. ${ruleChip('F2', true)}</p>
      <div id="qp-sum" hidden></div>
      ${fieldHTML({ id: 'qp-f', label: 'Tên trường', hint: 'Ví dụ: Số căn cước, Size áo, Trường đang học', required: true, autocomplete: 'off', emptyMsg: 'Nhập tên trường cần rà' })}
      <div class="qp-grid">
        ${fieldHTML({ id: 'qp-p', kind: 'radio', label: 'Dữ liệu này dùng để làm gì?', required: true, emptyMsg: 'Chọn mục đích sử dụng', options: purposeOpts })}
        <div>
          ${fieldHTML({ id: 'qp-now', kind: 'radio', inline: true, label: 'Có cần ngay lúc đăng ký không?', required: true, emptyMsg: 'Chọn có cần ngay hay không', options: [{ v: 'yes', n: 'Có' }, { v: 'no', n: 'Không, cần ở vòng sau' }] })}
          ${fieldHTML({ id: 'qp-der', kind: 'radio', inline: true, label: 'Suy ra hoặc lấy từ nguồn khác được không?', required: true, emptyMsg: 'Chọn có suy ra được không', options: [{ v: 'yes', n: 'Được' }, { v: 'no', n: 'Không' }] })}
          ${fieldHTML({ id: 'qp-has', kind: 'radio', label: 'Người dùng có sẵn câu trả lời không?', required: true, emptyMsg: 'Chọn mức độ có sẵn câu trả lời', options: [{ v: 'yes', n: 'Có ngay' }, { v: 'lookup', n: 'Phải tra cứu, tìm giấy tờ' }, { v: 'no', n: 'Nhiều người không có' }] })}
        </div>
      </div>
      <button type="submit" class="btn btn-pri">${ic('plus', 16)}Thêm vào danh sách</button>
    </form>
    <div class="sec-head" style="margin-bottom:10px"><div><h2 class="h3">Danh sách trường</h2><p id="qp-count" style="margin-top:2px"></p></div><div class="btn-row"><button type="button" class="btn btn-sec btn-sm" id="qp-copy">${ic('copy', 15)}Sao chép bảng</button><button type="button" class="btn btn-ghost btn-sm" id="qp-clearex">Xóa các dòng ví dụ</button></div></div>
    <div class="qp-wrap"><table class="qp-table"><thead><tr><th scope="col">Trường</th><th scope="col">Mục đích</th><th scope="col">Kết luận</th><th scope="col">Lý do</th><th scope="col"><span class="vh">Thao tác</span></th></tr></thead><tbody id="qp-rows"></tbody></table></div>`;
  const form = makeForm();
  const cf = { id: 'qp-f', label: 'Tên trường', hint: 'Ví dụ: Số căn cước, Size áo, Trường đang học', required: true, autocomplete: 'off', emptyMsg: 'Nhập tên trường cần rà' };
  form.add(mountField(cf, body));
  form.add(mountField({ id: 'qp-p', kind: 'radio', label: 'Dữ liệu này dùng để làm gì?', required: true, emptyMsg: 'Chọn mục đích sử dụng', options: purposeOpts }, body));
  form.add(mountField({ id: 'qp-now', kind: 'radio', inline: true, label: 'Có cần ngay lúc đăng ký không?', required: true, emptyMsg: 'Chọn có cần ngay hay không', options: [{ v: 'yes', n: 'Có' }, { v: 'no', n: 'Không, cần ở vòng sau' }] }, body));
  form.add(mountField({ id: 'qp-der', kind: 'radio', inline: true, label: 'Suy ra hoặc lấy từ nguồn khác được không?', required: true, emptyMsg: 'Chọn có suy ra được không', options: [{ v: 'yes', n: 'Được' }, { v: 'no', n: 'Không' }] }, body));
  form.add(mountField({ id: 'qp-has', kind: 'radio', label: 'Người dùng có sẵn câu trả lời không?', required: true, emptyMsg: 'Chọn mức độ có sẵn câu trả lời', options: [{ v: 'yes', n: 'Có ngay' }, { v: 'lookup', n: 'Phải tra cứu, tìm giấy tờ' }, { v: 'no', n: 'Nhiều người không có' }] }, body));
  const draw = () => {
    store.set('fx-qp', QP);
    const cnt = {}; QP.forEach((x) => { const v = qpVerdict(x); cnt[v.n] = (cnt[v.n] || 0) + 1; });
    $('#qp-count').innerHTML = QP.length ? Object.entries(cnt).map(([k, n]) => `${n} ${k.toLowerCase()}`).join(' · ') : 'Chưa có trường nào';
    $('#qp-rows').innerHTML = QP.length ? QP.map((x, i) => { const v = qpVerdict(x); return `<tr><td><b>${esc(x.f)}</b>${x.ex ? '<span class="ex-badge">Ví dụ</span>' : ''}</td><td>${esc(QP_P[x.p])}</td><td><span class="verdict v-${v.k}">${esc(v.n)}</span></td><td>${fmt(v.why)}</td><td><button type="button" class="btn btn-ghost btn-sm btn-danger" data-qpdel="${i}">Xóa<span class="vh"> ${esc(x.f)}</span></button></td></tr>`; }).join('') : `<tr><td colspan="5" class="muted" style="text-align:center;padding:24px">Thêm trường đầu tiên bằng form phía trên.</td></tr>`;
    $('#qp-clearex').hidden = !QP.some((x) => x.ex);
  };
  $('#qp-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const errs = form.validate();
    if (errs.length) { showSummary($('#qp-sum'), errs, form); return; }
    $('#qp-sum').hidden = true;
    const x = { f: form.by('qp-f').get(), p: form.by('qp-p').get(), now: form.by('qp-now').get(), der: form.by('qp-der').get(), has: form.by('qp-has').get() };
    QP.unshift(x); draw();
    const v = qpVerdict(x); announce(`Đã thêm ${x.f}: ${v.n}`); toast(`${x.f}: ${v.n}`);
    form.ctls.forEach((c) => { c.set(c.c.kind === 'radio' ? '' : ''); clearErr(c); });
    $('#qp-f').focus();
  });
  body.addEventListener('click', (e) => {
    const d = e.target.closest('[data-qpdel]'); if (d) { const x = QP.splice(+d.dataset.qpdel, 1)[0]; draw(); toast(`Đã xóa ${x.f}`); }
  });
  $('#qp-clearex').addEventListener('click', () => { QP = QP.filter((x) => !x.ex); draw(); });
  $('#qp-copy').addEventListener('click', () => copyText(`| Trường | Mục đích | Kết luận | Lý do |\n|---|---|---|---|\n${QP.map((x) => { const v = qpVerdict(x); return `| ${x.f} | ${QP_P[x.p]} | ${v.n} | ${mdText(v.why)} |`; }).join('\n')}`, 'Đã sao chép bảng Markdown'));
  draw();
}

/* ---------- Đo lường hiệu quả ---------- */
const METRICS = [
  { id: 'complete', k: 'Tỷ lệ hoàn thành', out: true, f: 'Hồ sơ gửi thành công ÷ Người bắt đầu điền', why: 'Thước đo tổng: form có "chạy" hay không. Không kéo trực tiếp được — cải thiện nó bằng các chỉ số đầu vào bên dưới.', r: ['F2', 'K1'] },
  { id: 'start', k: 'Tỷ lệ bắt đầu', out: true, f: 'Người bấm "Bắt đầu đăng ký" ÷ Người xem trang giới thiệu', why: 'Thấp: trang giới thiệu chưa rõ lợi ích, điều kiện, hoặc yêu cầu chuẩn bị làm người dùng nản.', r: ['F1', 'T4'] },
  { id: 'drop', k: 'Tỷ lệ rơi theo bước', f: 'Người rời ở bước N ÷ Người vào bước N', why: 'Chỉ ra bước rò rỉ nhất để tập trung sửa. Bước có tải tệp và bước cuối thường rơi nhiều nhất.', r: ['F3', 'U3'] },
  { id: 'ferr', k: 'Tỷ lệ lỗi theo trường', f: 'Người thấy lỗi ở trường ÷ Người điền trường đó', why: 'Chỉ số đầu vào quan trọng nhất: trường lỗi nhiều là trường cần sửa nhãn, gợi ý, hoặc chuẩn hóa thêm.', r: ['I3', 'L4', 'V3'] },
  { id: 'msg', k: 'Câu lỗi xuất hiện nhiều nhất', f: 'Đếm field_error theo trường + câu lỗi', why: 'Biết chính xác người dùng sai ở đâu: thiếu số 0, gõ nhầm tên miền, tệp quá lớn, ảnh HEIC…', r: ['V3', 'I9'] },
  { id: 'time', k: 'Thời gian hoàn thành (trung vị)', f: 'Trung vị của (gửi thành công − bắt đầu), bỏ các phiên lưu nháp qua ngày', why: 'So với thời gian đã hứa ở "Trước khi bắt đầu". Lệch nhiều thì sửa form, hoặc sửa lời hứa.', r: ['F1', 'F2'] },
  { id: 'upload', k: 'Tỷ lệ tải tệp thất bại', f: 'Lần tải thất bại ÷ Lần tải, tách theo lý do', why: 'Lý do: sai định dạng, quá dung lượng, HEIC, mất mạng. Mỗi lý do có một cách sửa khác nhau.', r: ['U2', 'U5'] },
  { id: 'submitfail', k: 'Tỷ lệ gửi thất bại', f: 'Lần gửi thất bại ÷ Lần bấm gửi', why: 'Lỗi máy chủ, mất mạng, hết phiên. Mỗi lần thất bại là một nguy cơ mất hồ sơ.', r: ['V8', 'D3'] },
  { id: 'dup', k: 'Tỷ lệ hồ sơ trùng', f: 'Hồ sơ trùng email/SĐT ÷ Tổng hồ sơ', why: 'Dấu hiệu thiếu phản hồi khi gửi, hoặc trang xác nhận chưa đủ rõ.', r: ['B4', 'K1'] },
  { id: 'support', k: 'Yêu cầu hỗ trợ trên 100 hồ sơ', f: 'Số email, cuộc gọi hỗ trợ ÷ Số hồ sơ × 100', why: 'Trải nghiệm tốt nhất là người dùng không cần hỏi. Phân loại câu hỏi để biết sửa chỗ nào trong form.', r: ['K2', 'P2'] },
  { id: 'fix', k: 'Tỷ lệ hồ sơ cần bổ sung', f: 'Hồ sơ bị yêu cầu bổ sung ÷ Hồ sơ đã xét', why: 'Chất lượng dữ liệu đầu vào: hướng dẫn chưa rõ, hoặc kiểm tra chưa đủ ngay trong form.', r: ['U1', 'L4'] },
];
const EVENTS = [
  ['form_view', 'Xem trang giới thiệu hoặc form', 'form_id, nguồn truy cập'],
  ['form_start', 'Bấm "Bắt đầu đăng ký" hoặc chạm trường đầu tiên', 'form_id'],
  ['step_view', 'Vào một bước', 'step'],
  ['field_error', 'Một lỗi hiển thị tại trường', 'field, error_type, trigger (blur | submit)'],
  ['step_complete', 'Qua bước thành công', 'step, seconds_on_step'],
  ['file_upload', 'Kết quả tải tệp', 'field, result (success | fail), reason, size_mb'],
  ['draft_restore', 'Khôi phục bản nháp', 'step, draft_age_hours'],
  ['submit_attempt', 'Bấm gửi hồ sơ', 'errors_left'],
  ['submit_result', 'Kết quả gửi', 'result (success | fail), reason'],
  ['support_click', 'Bấm liên hệ hỗ trợ', 'step'],
];
const FUNNEL = [['Xem trang giới thiệu', 10000], ['Bắt đầu điền', 4300], ['Qua bước 1 · Thí sinh', 3950], ['Qua bước 2 · Liên hệ', 3720], ['Qua bước 3 · Bài dự thi', 2460], ['Gửi thành công', 2290]];
function toolKPI(body) {
  const max = FUNNEL[0][1];
  let worst = 2, wr = 1;
  FUNNEL.forEach(([, v], i) => { if (i >= 2) { const r = v / FUNNEL[i - 1][1]; if (r < wr) { wr = r; worst = i; } } });
  const num = (n) => n.toLocaleString('vi-VN');
  body.innerHTML = `
    <div class="kpi-intro"><p class="lead" style="font-size:16px">Tỷ lệ hoàn thành là chỉ số <b>đầu ra</b>: không thể kéo trực tiếp. Hãy theo dõi các chỉ số <b>đầu vào</b> — lỗi theo trường, rơi theo bước, tải tệp thất bại — vì đó là thứ đội sản phẩm sửa được trong sprint tới.</p></div>
    <section class="sec" style="margin-top:28px" aria-labelledby="fn-h">
      <div class="sec-head"><div><h2 class="h3" id="fn-h">Đọc phễu để tìm bước rò rỉ</h2><p>Số liệu minh họa cho form đăng ký dự thi 4 bước — không phải dữ liệu thật.</p></div><span class="pill pill-mute">Ví dụ minh họa</span></div>
      <div class="funnel" role="table" aria-label="Phễu đăng ký minh họa">
        <div class="fn-row fn-head" role="row"><span role="columnheader">Bước</span><span role="columnheader"><span class="vh">Biểu đồ</span></span><span role="columnheader">Người dùng</span><span role="columnheader">So với bước trước</span></div>
        ${FUNNEL.map(([n, v], i) => {
          const prev = i ? FUNNEL[i - 1][1] : 0, r = i ? v / prev : 1;
          return `<div class="fn-row ${i === worst ? 'worst' : ''}" role="row" title="${esc(n)}: ${num(v)} người${i ? ` · giữ lại ${Math.round(r * 100)}% so với bước trước` : ''}">
            <span role="cell" class="fn-n">${esc(n)}</span>
            <span role="cell" class="fn-bar" aria-hidden="true"><i style="width:${(v / max * 100).toFixed(1)}%"></i></span>
            <span role="cell" class="fn-v">${num(v)}</span>
            <span role="cell" class="fn-r">${i ? `${Math.round(r * 100)}%${i === worst ? ` <span class="pill pill-warn">${ic('alert', 13)}Rơi nhiều nhất</span>` : ''}` : '—'}</span>
          </div>`;
        }).join('')}
      </div>
      <div class="f-banner info" style="margin-top:16px">${ic('bulb', 20)}<div><b>Cách đọc</b>Tỷ lệ hoàn thành = ${num(FUNNEL[5][1])} ÷ ${num(FUNNEL[1][1])} = ${Math.round(FUNNEL[5][1] / FUNNEL[1][1] * 100)}%. Bước 3 chỉ giữ lại ${Math.round(wr * 100)}% người dùng: xem ngay tỷ lệ tải tệp thất bại và câu lỗi nhiều nhất ở bước này (${ruleChip('U2')} ${ruleChip('U5')}) trước khi sửa chỗ khác.</div></div>
    </section>
    <section class="sec" style="margin-top:36px" aria-labelledby="mt-h">
      <div class="sec-head"><div><h2 class="h3" id="mt-h">11 chỉ số nên theo dõi</h2><p>Hai chỉ số đầu ra để báo cáo, chín chỉ số đầu vào để hành động.</p></div><button type="button" class="btn btn-sec btn-sm" id="kpi-copy">${ic('copy', 15)}Sao chép bộ chỉ số</button></div>
      <div class="kpis">${METRICS.map((m) => `<article class="kpi" id="kpi-${m.id}"><div class="kpi-h"><h3>${esc(m.k)}</h3><span class="pill ${m.out ? 'pill-mute' : 'pill-ok'}">${m.out ? 'Đầu ra' : 'Đầu vào'}</span></div><p class="kpi-f"><code>${esc(m.f)}</code></p><p class="kpi-w">${esc(m.why)}</p><div class="chips">${m.r.map((id) => ruleChip(id)).join('')}</div></article>`).join('')}</div>
    </section>
    <section class="sec" style="margin-top:36px" aria-labelledby="ev-h">
      <div class="sec-head"><div><h2 class="h3" id="ev-h">Sự kiện cần gắn tracking</h2><p>Đủ để tính toàn bộ chỉ số trên. Đặt tên theo quy ước tracking nội bộ của bạn.</p></div><button type="button" class="btn btn-sec btn-sm" id="ev-copy">${ic('copy', 15)}Sao chép tracking plan</button></div>
      <div class="qp-wrap"><table class="qp-table"><thead><tr><th scope="col">Sự kiện</th><th scope="col">Khi nào</th><th scope="col">Thuộc tính</th></tr></thead><tbody>${EVENTS.map(([e, w, a]) => `<tr><td><code>${e}</code></td><td>${esc(w)}</td><td><code>${esc(a)}</code></td></tr>`).join('')}</tbody></table></div>
      <div class="f-banner err" style="margin-top:16px;border-width:1px">${ic('lock', 20)}<div><b>Không gửi dữ liệu người dùng nhập vào công cụ phân tích</b>Chỉ gửi tên trường và loại lỗi (ví dụ <code>field=phone, error_type=length</code>), không gửi họ tên, số điện thoại, email hay nội dung bài. ${ruleChip('P1')}</div></div>
    </section>`;
  $('#kpi-copy').addEventListener('click', () => copyText(`## Chỉ số đo lường form đăng ký\n${METRICS.map((m) => `- **${m.k}** (${m.out ? 'đầu ra' : 'đầu vào'}): ${m.f}. ${m.why}`).join('\n')}`, 'Đã sao chép bộ chỉ số'));
  $('#ev-copy').addEventListener('click', () => copyText(`| Sự kiện | Khi nào | Thuộc tính |\n|---|---|---|\n${EVENTS.map(([e, w, a]) => `| ${e} | ${w} | ${a} |`).join('\n')}\n\nLưu ý: không gửi giá trị người dùng nhập (họ tên, SĐT, email, nội dung bài).`, 'Đã sao chép tracking plan'));
}

/* ============================================================
   TÌM KIẾM NHANH (/ hoặc Ctrl/⌘ + K)
   ============================================================ */
let PAL_INDEX = null, PENDING = null;
function buildIndex() {
  const idx = [];
  NAV.forEach((n) => idx.push({ g: 'Trang', t: n.n, s: '', href: '#' + n.h, badge: ic(n.ic, 16) }));
  idx.push({ g: 'Trang', t: 'Kịch bản kiểm thử', s: 'Thử như người dùng thật', href: '#kiem-thu', badge: ic('target', 16) });
  idx.push({ g: 'Trang', t: 'Một trang hay nhiều bước?', s: 'Công cụ', href: '#cong-cu-mo-hinh', badge: ic('branch', 16) });
  idx.push({ g: 'Trang', t: 'Có nên hỏi trường này?', s: 'Công cụ', href: '#cong-cu-truong', badge: ic('scissors', 16) });
  idx.push({ g: 'Trang', t: 'Đo lường hiệu quả form', s: 'Chỉ số, sự kiện tracking, phễu', href: '#cong-cu-do-luong', badge: ic('chart', 16) });
  METRICS.forEach((m) => idx.push({ g: 'Đo lường', t: m.k, s: m.f, href: '#cong-cu-do-luong', target: 'kpi-' + m.id, badge: ic('chart', 16) }));
  RULES.forEach((r) => idx.push({ g: 'Nguyên tắc', id: r.id, t: plain(r.t), s: plain(r.s), href: '#nt-' + r.id.toLowerCase(), badge: r.id, key: fold(r.id + ' ' + plain(r.t) + ' ' + plain(r.s) + ' ' + CAT_BY_ID[r.c].n) }));
  FIELD_LIB.forEach((f) => { const m = fieldMeta(f); idx.push({ g: 'Thư viện trường', t: m.n, s: [m.type, m.auto].filter(Boolean).join(' · '), href: '#truong', target: 'fc-' + f.k, badge: ic('field', 16) }); });
  COPY.forEach((g) => g.items.forEach((it, i) => idx.push({ g: 'Câu chữ mẫu', t: it.t, s: g.n + (it.ctx ? ' · ' + it.ctx : ''), href: '#cau-chu', target: `cp-${g.id}-${i}`, badge: ic('quote', 16), key: fold(it.t + ' ' + (it.ex || '') + ' ' + g.n + ' ' + (it.ctx || '')) })));
  TESTS.forEach((x, i) => idx.push({ g: 'Kịch bản kiểm thử', t: x.t, s: x.how, href: '#kiem-thu', target: 'test-' + x.id, badge: String(i + 1) }));
  BLUEPRINTS.forEach((b) => idx.push({ g: 'Bản mẫu cấu trúc', t: b.n, s: b.ex, href: '#cong-cu', bp: b.id, badge: ic(b.ic, 16) }));
  idx.forEach((x) => { if (!x.key) x.key = fold(x.t + ' ' + x.s); });
  return idx;
}
function openPalette() {
  if (!PAL_INDEX) PAL_INDEX = buildIndex();
  const p = $('#palette');
  if (!p.hidden) return;
  const ret = document.activeElement;
  p.innerHTML = `<div class="palette-back" data-pal-close></div><div class="palette-box" role="dialog" aria-modal="true" aria-label="Tìm kiếm">
    <div class="palette-in">${ic('search', 20)}<label class="vh" for="pal-q">Tìm nguyên tắc, trường, câu chữ</label><input id="pal-q" type="text" role="combobox" aria-expanded="true" aria-controls="pal-res" aria-autocomplete="list" autocomplete="off" spellcheck="false" placeholder="Ví dụ: lỗi tệp, ngày sinh, V3, nút gửi…"><button type="button" class="icon-btn" data-pal-close aria-label="Đóng">${ic('x', 18)}</button></div>
    <div class="palette-res" id="pal-res" role="listbox" aria-label="Kết quả"></div>
    <div class="palette-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> chọn</span><span><kbd>Enter</kbd> mở</span><span><kbd>Esc</kbd> đóng</span><span>Gõ không dấu cũng được</span></div></div>`;
  p.hidden = false; document.body.classList.add('no-scroll');
  const q = $('#pal-q'), res = $('#pal-res');
  let items = [], act = 0;
  const run = () => {
    const s = fold(q.value);
    if (!s) items = PAL_INDEX.filter((x) => x.g === 'Trang' || (x.g === 'Nguyên tắc' && GOLDEN.includes(x.id)));
    else {
      const ws = s.split(' ');
      items = PAL_INDEX.map((x) => {
        if (!ws.every((w) => x.key.includes(w))) return null;
        let sc = 10; if (x.id && fold(x.id) === s) sc = 0; else if (fold(x.t).startsWith(s)) sc = 1; else if (fold(x.t).includes(s)) sc = 2; else sc = 4;
        if (x.g === 'Nguyên tắc') sc -= 0.5;
        return { ...x, sc };
      }).filter(Boolean).sort((a, b) => a.sc - b.sc);
      const cap = { 'Nguyên tắc': 8, 'Câu chữ mẫu': 6, 'Thư viện trường': 4, 'Kịch bản kiểm thử': 3, 'Trang': 3, 'Bản mẫu cấu trúc': 2, 'Đo lường': 3 }; const seen = {};
      items = items.filter((x) => { seen[x.g] = (seen[x.g] || 0) + 1; return seen[x.g] <= (cap[x.g] || 4); });
      const best = {}; items.forEach((x) => { best[x.g] = Math.min(best[x.g] ?? 99, x.sc); });
      const order = ['Nguyên tắc', 'Thư viện trường', 'Câu chữ mẫu', 'Kịch bản kiểm thử', 'Đo lường', 'Bản mẫu cấu trúc', 'Trang'];
      items.sort((a, b) => (best[a.g] - best[b.g]) || (order.indexOf(a.g) - order.indexOf(b.g)) || (a.sc - b.sc));
    }
    act = 0; draw();
  };
  const draw = () => {
    if (!items.length) { res.innerHTML = `<div class="palette-empty">Không tìm thấy “${esc(q.value)}”.<br>Thử từ khác, ví dụ "lỗi", "tệp", "điện thoại".</div>`; q.removeAttribute('aria-activedescendant'); return; }
    let g = '', html = '';
    items.forEach((x, i) => {
      if (x.g !== g) { g = x.g; html += `<div class="palette-g" role="presentation">${esc(g)}</div>`; }
      html += `<div role="option" id="pal-o${i}" class="${i === act ? 'active' : ''}" aria-selected="${i === act}" data-i="${i}"><span class="p-ic">${x.badge}</span><span class="p-t">${esc(x.t)}</span>${x.s ? `<span class="p-s">${esc(x.s)}</span>` : ''}</div>`;
    });
    res.innerHTML = html;
    q.setAttribute('aria-activedescendant', `pal-o${act}`);
    const a = res.querySelector('.active'); a && a.scrollIntoView({ block: 'nearest' });
  };
  const go = (x) => {
    closePalette(false);
    if (x.bp) TOOLS_UI.bp = x.bp;
    PENDING = x.target || null;
    if (location.hash === x.href) route(); else location.hash = x.href.slice(1);
  };
  q.addEventListener('input', run);
  q.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); act = Math.min(items.length - 1, act + 1); draw(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); act = Math.max(0, act - 1); draw(); }
    else if (e.key === 'Enter') { e.preventDefault(); if (items[act]) go(items[act]); }
    else if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
  });
  res.addEventListener('click', (e) => { const o = e.target.closest('[data-i]'); if (o) go(items[+o.dataset.i]); });
  p._ret = ret;
  run(); q.focus();
}
function closePalette(restore = true) {
  const p = $('#palette'); if (p.hidden) return;
  p.hidden = true; p.innerHTML = ''; document.body.classList.remove('no-scroll');
  if (restore && p._ret && p._ret.focus) p._ret.focus();
}

/* ============================================================
   CHÚ THÍCH (popover)
   ============================================================ */
function openPop(btn) {
  const id = btn.dataset.ann, r = RULE_BY_ID[id]; if (!r) return;
  const pop = $('#pop');
  pop.innerHTML = `<div class="pop-h"><span class="rid">${r.id}</span>${lvPill(r.lv)}<button type="button" class="icon-btn" style="margin-left:auto;width:32px;height:32px" data-pop-close aria-label="Đóng">${ic('x', 16)}</button></div><div class="pop-t">${fmt(r.t)}</div><p>${fmt(r.s)}</p><a href="#nt-${r.id.toLowerCase()}">Xem nguyên tắc ${ic('right', 14)}</a>`;
  pop.hidden = false;
  pop.setAttribute('aria-label', `Nguyên tắc ${r.id}`);
  const b = btn.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
  let left = b.left + window.scrollX + b.width / 2 - pw / 2;
  left = Math.max(window.scrollX + 16, Math.min(left, window.scrollX + document.documentElement.clientWidth - pw - 16));
  let top = b.bottom + window.scrollY + 8;
  if (b.bottom + ph + 16 > window.innerHeight && b.top > ph + 80) top = b.top + window.scrollY - ph - 8;
  pop.style.left = left + 'px'; pop.style.top = top + 'px';
  pop._btn = btn;
  pop.querySelector('a').focus();
}
function closePop(restore) { const p = $('#pop'); if (p.hidden) return; p.hidden = true; if (restore && p._btn) p._btn.focus(); }

/* ============================================================
   ĐIỀU HƯỚNG + KHỞI ĐỘNG
   ============================================================ */
let _lastView = '';
function route() {
  const h = decodeURIComponent(location.hash.slice(1)) || 'tong-quan';
  let key = 'tong-quan', run = viewHome, viewId = h;
  const main = $('#main');
  if (/^nt-[a-z]\d{1,2}$/.test(h) && RULE_BY_ID[h.slice(3).toUpperCase()]) { key = 'nguyen-tac'; run = (m) => viewRule(m, h.slice(3).toUpperCase()); }
  else if (/^form-mau(-\d|-xong)?$/.test(h)) { key = 'form-mau'; run = (m) => viewPlayground(m, h); viewId = 'form-mau'; }
  else if (h === 'kiem-thu') { key = 'danh-gia'; run = (m) => viewAudit(m, 'tests'); }
  else if (/^cong-cu(-mo-hinh|-truong|-do-luong)?$/.test(h)) { key = 'cong-cu'; run = (m) => viewTools(m, h); }
  else if (h === 'nguyen-tac') { key = h; run = viewRules; }
  else if (h === 'truong') { key = h; run = viewFields; }
  else if (h === 'cau-chu') { key = h; run = viewCopy; }
  else if (h === 'danh-gia') { key = h; run = (m) => viewAudit(m, 'list'); }
  else viewId = 'tong-quan';
  closePop(false); closeDialog();
  const sameView = viewId === 'form-mau' && _lastView === 'form-mau';
  if (!sameView) main.innerHTML = '';
  renderNav(key);
  run(main);
  const first = !_lastView; _lastView = viewId;
  if (PENDING) {
    const id = PENDING; PENDING = null;
    setTimeout(() => { const el = document.getElementById(id); if (el) { el.hidden = false; el.scrollIntoView({ block: 'center' }); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); const f = el.querySelector('button, a, input'); f && f.focus({ preventScroll: true }); } }, 60);
  } else if (sameView) {
    const fr = $('#pg-frame'); if (fr) { const y = fr.getBoundingClientRect().top + window.scrollY - 90; if (window.scrollY > y + 10 || fr.getBoundingClientRect().top < 0) window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' }); }
  } else if (!first) {
    window.scrollTo(0, 0);
    const hh = main.querySelector('h1'); if (hh) { hh.setAttribute('tabindex', '-1'); hh.style.outline = 'none'; hh.focus({ preventScroll: true }); }
  }
}
function themeIcon() {
  const t = document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const b = $('#theme-btn'); b.innerHTML = ic(t === 'dark' ? 'sun' : 'moon', 20);
  b.setAttribute('aria-label', t === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
}
function boot() {
  document.documentElement.lang = 'vi';
  const th = store.get('fx-theme', null); if (th) document.documentElement.setAttribute('data-theme', th);
  themeIcon();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeIcon);
  $('#theme-btn').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const nx = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nx); store.set('fx-theme', nx); themeIcon();
  });
  $('#search-btn').addEventListener('click', openPalette);
  document.addEventListener('keydown', (e) => {
    const t = e.target, typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openPalette(); return; }
    if (e.key === '/' && !typing && $('#palette').hidden && $('#dlg').hidden) { e.preventDefault(); openPalette(); return; }
    if (e.key === 'Escape') { if (!$('#dlg').hidden) closeDialog(); else if (!$('#pop').hidden) closePop(true); else closePalette(); }
  });
  document.addEventListener('click', (e) => {
    const sk = e.target.closest('[data-skip]'); if (sk) { e.preventDefault(); const m = $('#main'); const h = m.querySelector('h1') || m; h.setAttribute('tabindex', '-1'); h.focus(); return; }
    const an = e.target.closest('.ann'); if (an) { e.preventDefault(); const p = $('#pop'); if (!p.hidden && p._btn === an) closePop(false); else openPop(an); return; }
    if (e.target.closest('[data-pop-close]')) { closePop(true); return; }
    if (!e.target.closest('#pop')) closePop(false);
    if (e.target.closest('[data-dlg-close]')) closeDialog();
    if (e.target.closest('[data-pal-close]')) closePalette();
    const st = e.target.closest('[data-st]');
    if (st) {
      const id = st.dataset.st, now = setAudit(id, st.dataset.v);
      $$(`[data-st="${id}"]`).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === now)));
      const note = $(`#au-${id} .au-note`); if (note) { note.hidden = now !== 'fail'; if (now === 'fail') $(`#au-n-${id}`).focus(); }
      drawScore();
      if (!$('#au-body')) toast(now ? `Đã ghi ${id}: ${{ pass: 'Đạt', fail: 'Chưa đạt', na: 'Không áp dụng' }[now]}` : `Đã bỏ đánh giá ${id}`);
    }
  });
  window.addEventListener('hashchange', route);
  window.addEventListener('resize', () => closePop(false));
  route();
}
try { window.claude && window.claude.hot && window.claude.hot.snapshot && window.claude.hot.snapshot(() => ({ hash: location.hash })); } catch (e) { /* bỏ qua */ }
if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(boot); else boot();
