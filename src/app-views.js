/* ============================================================
   TRẠNG THÁI + ĐIỀU HƯỚNG
   ============================================================ */
const DEADLINE = (() => {
  const now = new Date();
  let d = new Date(2026, 10, 30, 23, 59, 0);
  if (now > d) d = new Date(now.getFullYear() + (now.getMonth() >= 10 ? 1 : 0), 10, 30, 23, 59, 0);
  return d;
})();
const DEADLINE_STR = `23:59, ${fmtDate(DEADLINE)}`;
const daysLeft = () => Math.max(0, Math.ceil((DEADLINE - new Date()) / 86400000));

const S = {
  audit: Object.assign({ name: '', who: '', items: {}, notes: {}, tests: {} }, store.get('fx-audit', {})),
  rf: Object.assign({ q: '', lv: 'all', cat: 'all', demo: false }, store.get('fx-rf', {})),
};
const saveAudit = debounce(() => store.set('fx-audit', S.audit), 250);

const NAV = [
  { h: 'tong-quan', n: 'Tổng quan', ic: 'home' },
  { h: 'nguyen-tac', n: 'Nguyên tắc', ic: 'book', count: RULES.length },
  { h: 'form-mau', n: 'Form mẫu', ic: 'form' },
  { h: 'truong', n: 'Thư viện trường', ic: 'field' },
  { h: 'cau-chu', n: 'Câu chữ mẫu', ic: 'quote' },
  { h: 'danh-gia', n: 'Đánh giá form', ic: 'check' },
  { h: 'cong-cu', n: 'Công cụ', ic: 'tool' },
];
function renderNav(active) {
  const items = NAV.map((n) => `<li><a href="#${n.h}" ${n.h === active ? 'aria-current="page"' : ''}>${ic(n.ic, 18)}<span>${n.n}</span>${n.count ? `<span class="nav-count">${n.count}</span>` : ''}</a></li>`).join('');
  const a = auditStats();
  $('#sidenav').innerHTML = `<div><div class="nav-label">Bộ chuẩn</div><ul class="nav-list">${items}</ul></div>
    <a class="nav-audit" href="#danh-gia" id="nav-audit">${navAuditInner(a)}</a>
    <div class="muted" style="font-size:12.5px;padding:0 6px;margin-top:auto">Phiên bản 1.0 · ${pad2(new Date().getMonth() + 1)}/${new Date().getFullYear()}<br>Nhấn <kbd>/</kbd> để tìm nhanh</div>`;
  $('#tabstrip').innerHTML = NAV.map((n) => `<a href="#${n.h}" ${n.h === active ? 'aria-current="page"' : ''}>${ic(n.ic, 16)}${n.n}</a>`).join('');
  const cur = $('#tabstrip [aria-current]');
  if (cur) cur.scrollIntoView({ inline: 'center', block: 'nearest' });
}
function navAuditInner(a) {
  const name = S.audit.name ? esc(S.audit.name) : 'Form của bạn';
  return `<div class="nav-audit-t"><span>Đánh giá: ${name}</span><span class="muted">${a.done}/${a.total}</span></div>
    <div class="nav-audit-s">${a.done ? `${a.pass} đạt · ${a.fail} chưa đạt` : 'Chưa bắt đầu — chấm theo checklist'}</div>
    ${meterHTML(a)}`;
}
function meterHTML(a) {
  const t = a.total || 1;
  return `<div class="meter" aria-hidden="true"><i class="m-ok" style="width:${a.pass / t * 100}%"></i><i class="m-err" style="width:${a.fail / t * 100}%"></i><i class="m-na" style="width:${a.na / t * 100}%"></i></div>`;
}
function refreshNavAudit() { const el = $('#nav-audit'); if (el) el.innerHTML = navAuditInner(auditStats()); }

function auditStats(filterLv) {
  let pass = 0, fail = 0, na = 0, total = 0, mustFail = 0, mustTotal = 0, mustPass = 0;
  RULES.forEach((r) => {
    if (filterLv && r.lv !== filterLv) return;
    total++;
    const v = S.audit.items[r.id];
    if (v === 'pass') pass++; else if (v === 'fail') fail++; else if (v === 'na') na++;
    if (r.lv === 'm') { mustTotal++; if (v === 'fail') mustFail++; if (v === 'pass') mustPass++; }
  });
  return { pass, fail, na, total, done: pass + fail + na, mustFail, mustTotal, mustPass };
}
function setAudit(id, v) {
  if (S.audit.items[id] === v) delete S.audit.items[id]; else S.audit.items[id] = v;
  saveAudit(); refreshNavAudit();
  return S.audit.items[id];
}
function statusSeg(id) {
  const v = S.audit.items[id];
  const b = (val, label, icn, cls = '') => `<button type="button" class="${cls}" data-st="${id}" data-v="${val}" aria-pressed="${v === val}">${ic(icn, 15)}${label}</button>`;
  return `<div class="statusseg" role="group" aria-label="Kết quả đánh giá ${id}">${b('pass', 'Đạt', 'ok')}${b('fail', 'Chưa đạt', 'alert')}${b('na', 'Không áp dụng', 'x', 'na')}</div>`;
}
const PG_RULES = new Set('P2 D1 T4 F1 D5 F6 L3 I6 L1 I7 T3 T1 U1 U2 U5 F2 I9 V1 I3 I1 C2 C3 C6 C1 T2 I8 U3 U4 R2 C5 P1 B1 B4 B2 V6 R1 K3 K1 K2 P3 V8 V5'.split(' '));
const lvPill = (lv) => `<span class="lv lv-${lv}" title="${esc(LEVELS[lv].d)}">${LEVELS[lv].n}</span>`;

/* ============================================================
   TRANG CHỦ
   ============================================================ */
function viewHome(main) {
  const cnt = { m: 0, s: 0, c: 0 }; RULES.forEach((r) => cnt[r.lv]++);
  const demoCount = new Set(RULES.filter((r) => r.demo).map((r) => r.demo)).size;
  const copyCount = COPY.reduce((a, g) => a + g.items.length, 0);
  main.innerHTML = `<div class="view">
    <section class="hero">
      <div class="hero-text">
        <p class="eyebrow">Bộ tiêu chuẩn UX · Form đăng ký cuộc thi, hồ sơ, sự kiện</p>
        <h1 class="display">Form đăng ký <span class="hl">nhanh gọn, dễ hiểu, ít lỗi</span></h1>
        <p class="lead">Nguyên tắc có ví dụ chạy thật, form mẫu có chú thích, thư viện trường kèm mã HTML, câu chữ tiếng Việt và checklist để chấm điểm form của bạn.</p>
        <div class="btn-row">
          <a class="btn btn-pri" href="#nguyen-tac">${ic('book', 18)}Xem nguyên tắc</a>
          <a class="btn btn-sec" href="#form-mau">${ic('play', 16)}Thử form mẫu</a>
          <a class="btn btn-ghost" href="#danh-gia">Đánh giá form của tôi ${ic('right', 16)}</a>
        </div>
        <div class="hero-stats"><span><b>${RULES.length}</b>nguyên tắc</span><span><b>${demoCount}</b>demo chạy thật</span><span><b>${FIELD_LIB.length}</b>mẫu trường</span><span><b>${copyCount}</b>mẫu câu</span><span><b>${TESTS.length}</b>kịch bản kiểm thử</span></div>
      </div>
      <figure class="anat" aria-labelledby="anat-cap">
        <div class="anat-top"><p class="eyebrow" id="anat-cap">${ic('target', 16)}Giải phẫu một trường chuẩn</p><span class="pill pill-mute">Thử gõ vào ô</span></div>
        <div class="anat-field" id="anat-field">
          <span class="anat-pin" data-pin="1">1</span><span class="anat-pin" data-pin="2">2</span><span class="anat-pin" data-pin="3" hidden>3</span><span class="anat-pin" data-pin="4">4</span><span class="anat-pin" data-pin="5" hidden>5</span>
          ${fieldHTML(ANAT_CFG)}
        </div>
        <div class="anat-try"><button type="button" class="try-chip" data-anat="+84 912.345.678">Gõ <code>+84 912.345.678</code></button><button type="button" class="try-chip" data-anat="0912 345">Gõ <code>0912 345</code></button><button type="button" class="try-chip" data-anat="">Xóa</button></div>
        <ol class="anat-legend">
          <li><span class="anat-pin">1</span><span><b>Nhãn</b> luôn hiển thị, đặt trên ô; dấu * cho trường bắt buộc</span><span>${ruleChip('L1')}</span></li>
          <li><span class="anat-pin">2</span><span><b>Gợi ý</b> bằng ví dụ, hiện sẵn trước khi gõ</span><span>${ruleChip('L4')}</span></li>
          <li><span class="anat-pin">3</span><span><b>Lỗi</b> sát trường, có chữ + biểu tượng, nói cách sửa <span class="muted" id="anat-l3">(hiện khi rời ô với dữ liệu sai)</span></span><span>${ruleChip('V3')}</span></li>
          <li><span class="anat-pin">4</span><span><b>Ô nhập</b> cao 48px, chữ 16px; <code>type="tel"</code> mở bàn phím số, <code>autocomplete="tel"</code></span><span>${ruleChip('I1')}</span></li>
          <li><span class="anat-pin">5</span><span><b>Tự chuẩn hóa</b> +84, dấu chấm, khoảng trắng — không bắt người dùng sửa</span><span>${ruleChip('I3')}</span></li>
        </ol>
      </figure>
    </section>

    <section class="sec" aria-labelledby="g-h">
      <div class="sec-head"><div><h2 class="h2" id="g-h">Nếu chỉ nhớ 10 điều</h2><p>Mười nguyên tắc tạo khác biệt lớn nhất cho form đăng ký. Bấm vào để xem lý do, cách làm và ví dụ.</p></div><a class="btn btn-ghost" href="#nguyen-tac">Tất cả ${RULES.length} nguyên tắc ${ic('right', 16)}</a></div>
      <div class="golden">${GOLDEN.map((id) => { const r = RULE_BY_ID[id]; return `<a href="#nt-${id.toLowerCase()}"><span class="rid">${id}</span><span class="g-t">${fmt(r.t)}</span><span class="g-s">${fmt(r.s)}</span></a>`; }).join('')}</div>
    </section>

    <section class="sec" aria-labelledby="j-h">
      <div class="sec-head"><div><h2 class="h2" id="j-h">Hành trình đăng ký</h2><p>Bảy chặng người dùng đi qua, điều họ lo lắng ở mỗi chặng, và nguyên tắc giải quyết nỗi lo đó.</p></div></div>
      <ol class="journey" style="list-style:none;margin:0;padding:0">${JOURNEY.map((j, i) => `<li class="j-step"><div class="j-num"><b>${i + 1}</b></div><div class="j-n">${j.n}</div><p class="j-d">${j.d}</p><p class="j-f">“${j.f}”</p><div class="chips">${j.r.map((id) => ruleChip(id)).join('')}</div></li>`).join('')}</ol>
    </section>

    <section class="sec" aria-labelledby="t-h">
      <div class="sec-head"><div><h2 class="h2" id="t-h">Bắt đầu từ việc bạn cần làm</h2></div></div>
      <div class="tasks">
        ${taskCard('#form-mau', 'play', 'Xem một form chuẩn', 'Form đăng ký dự thi hoàn chỉnh, bật chú thích để thấy từng nguyên tắc nằm ở đâu.', 'Form mẫu')}
        ${taskCard('#cong-cu', 'layers', 'Thiết kế form mới', 'Chọn loại form, nhận sẵn cấu trúc các bước, trường nào bắt buộc, trường nào hỏi sau.', 'Bản mẫu cấu trúc')}
        ${taskCard('#cong-cu-truong', 'scissors', 'Cắt bớt trường thừa', 'Rà từng trường bằng 4 câu hỏi: ai dùng, để làm gì, cần ngay không, suy ra được không.', 'Có nên hỏi trường này?')}
        ${taskCard('#danh-gia', 'check', 'Review một form có sẵn', `Chấm ${RULES.length} tiêu chí, ghi chú chỗ chưa đạt, xuất báo cáo dán vào Jira/Slack.`, 'Đánh giá form')}
        ${taskCard('#cau-chu', 'quote', 'Viết lỗi, nhãn, nút', `${copyCount} mẫu câu tiếng Việt theo tình huống, sao chép một chạm.`, 'Câu chữ mẫu')}
        ${taskCard('#truong', 'field', 'Bàn giao cho dev', 'Thông số từng trường: type, inputmode, autocomplete, kiểm tra, lỗi, mã HTML.', 'Thư viện trường')}
        ${taskCard('#cong-cu-do-luong', 'chart', 'Đo sau khi ra mắt', '11 chỉ số đầu vào và đầu ra, danh sách sự kiện tracking, cách đọc phễu để tìm bước rò rỉ.', 'Đo lường hiệu quả')}
        ${taskCard('#kiem-thu', 'target', 'Test trước khi ra mắt', `${TESTS.length} kịch bản thử như người dùng thật: bàn phím, mất mạng, dán dữ liệu, điện thoại.`, 'Kịch bản kiểm thử')}
      </div>
    </section>

    <section class="sec" aria-labelledby="l-h">
      <div class="sec-head"><div><h2 class="h2" id="l-h">Ba mức áp dụng</h2><p>Mỗi nguyên tắc có một mức. Khi thiếu thời gian, làm hết mức Bắt buộc trước.</p></div></div>
      <div class="levels">${['m', 's', 'c'].map((lv) => `<a class="level" href="#nguyen-tac" data-setlv="${lv}" style="text-decoration:none;color:inherit"><div class="level-n">${lvPill(lv)}<b>${cnt[lv]}</b></div><p class="muted" style="font-size:14px">${LEVELS[lv].d}</p></a>`).join('')}</div>
    </section>

    <section class="sec" aria-labelledby="s-h">
      <div class="sec-head"><div><h2 class="h2" id="s-h">Nguồn tham khảo</h2><p>Bộ chuẩn tổng hợp từ các nghiên cứu và hệ thống thiết kế dưới đây, điều chỉnh cho người dùng và quy định Việt Nam.</p></div></div>
      <ul class="sources">
        ${['govuk', 'nngForm', 'baymard', 'lukew', 'qp', 'silver', 'webSign', 'apgCombo'].map((k) => `<li><a href="${SRC[k][1]}" target="_blank" rel="noopener">${esc(SRC[k][0])}</a></li>`).join('')}
        <li><a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noopener">W3C · WCAG 2.2</a></li>
        <li><a href="https://lawsofux.com/" target="_blank" rel="noopener">Jon Yablonski · Laws of UX</a></li>
        <li>Matt Watkinson · The Ten Principles Behind Great Customer Experiences</li>
        <li>Luật Bảo vệ dữ liệu cá nhân (hiệu lực 01/01/2026); sắp xếp đơn vị hành chính 2 cấp (từ 01/07/2025)</li>
      </ul>
      <p class="footnote"><span>Nội dung pháp lý mang tính định hướng UX, không thay thế tư vấn pháp lý.</span><span>Dữ liệu đánh giá và bản nháp chỉ lưu trên trình duyệt của bạn.</span></p>
    </section>
  </div>`;
  mountAnatomy(main);
  $$('[data-setlv]', main).forEach((a) => a.addEventListener('click', () => { S.rf.lv = a.dataset.setlv; S.rf.cat = 'all'; S.rf.q = ''; store.set('fx-rf', S.rf); }));
}
function taskCard(h, icn, t, s, go) {
  return `<a class="task" href="${h}">${ic(icn, 24)}<span class="task-t">${t}</span><span class="task-s">${s}</span><span class="task-go">${go} ${ic('right', 15)}</span></a>`;
}
const ANAT_CFG = { id: 'anat-phone', label: 'Số điện thoại', hint: 'Ví dụ: 0912 345 678', required: true, type: 'tel', inputmode: 'tel', autocomplete: 'tel', norm: 'phone', v: 'phone', emptyMsg: 'Nhập số điện thoại', enterkeyhint: 'done' };
function mountAnatomy(main) {
  const wrap = $('#anat-field', main);
  const ctl = mountField(ANAT_CFG, wrap);
  const el = ctl.el;
  const pins = Object.fromEntries($$('[data-pin]', wrap).map((p) => [p.dataset.pin, p]));
  const place = () => {
    const base = wrap.getBoundingClientRect().top;
    const at = (node) => node.getBoundingClientRect().top - base + node.getBoundingClientRect().height / 2 - 11;
    const lab = el.querySelector('.f-label'), hint = el.querySelector('.f-hint'), err = el.querySelector('.f-error'), inp = el.querySelector('.f-input'), note = el.querySelector('.f-note');
    pins[1].style.top = at(lab) + 'px';
    pins[2].style.top = at(hint) + 'px';
    pins[3].hidden = err.hidden; if (!err.hidden) pins[3].style.top = at(err) + 'px';
    pins[4].style.top = at(inp) + 'px';
    const hasNote = note.innerHTML.trim() !== '';
    pins[5].hidden = !hasNote; if (hasNote) pins[5].style.top = at(note) + 'px';
    const l3 = $('#anat-l3'); if (l3) l3.hidden = !err.hidden;
  };
  const ro = new ResizeObserver(place); ro.observe(el);
  new MutationObserver(place).observe(el, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden'] });
  place();
  $$('[data-anat]', main).forEach((b) => b.addEventListener('click', () => {
    const inp = $('#anat-phone');
    ctl.set(b.dataset.anat);
    clearErr(ctl); el.querySelector('.f-note').innerHTML = '';
    if (b.dataset.anat) { inp.dispatchEvent(new Event('blur')); }
    inp.focus();
    setTimeout(place, 30);
  }));
}

/* ============================================================
   DANH SÁCH NGUYÊN TẮC
   ============================================================ */
function ruleMatches(r, q) {
  if (!q) return true;
  const hay = fold([r.id, r.t, r.s, r.why, (r.how || []).join(' '), CAT_BY_ID[r.c].n].join(' '));
  return q.split(' ').every((w) => hay.includes(w));
}
function viewRules(main) {
  const f = S.rf;
  main.innerHTML = `<div class="view">
    <div class="page-head"><p class="eyebrow">Thư viện</p><h1 class="h1">Nguyên tắc</h1><p class="lead">${RULES.length} nguyên tắc chia theo ${CATS.length} nhóm. Mỗi nguyên tắc có lý do, cách làm, ví dụ Nên/Không nên, nhiều cái có demo chạy thật.</p></div>
    <div class="filters" role="search">
      <div class="filter-row">
        <div class="search-in"><label class="vh" for="rf-q">Lọc nguyên tắc</label>${ic('search', 18)}<input id="rf-q" type="search" value="${esc(f.q)}" placeholder="Lọc theo từ khóa: lỗi, tệp, ngày sinh, mobile…" autocomplete="off" enterkeyhint="search"><button type="button" class="icon-btn clear" id="rf-clear" aria-label="Xóa từ khóa" ${f.q ? '' : 'hidden'}>${ic('x', 18)}</button></div>
        <div class="seg" role="group" aria-label="Mức áp dụng" id="rf-lv"></div>
        <label class="toggle-chip"><input type="checkbox" id="rf-demo" ${f.demo ? 'checked' : ''}> Có demo</label>
      </div>
      <div class="catbar" id="rf-cat" role="group" aria-label="Nhóm nguyên tắc"></div>
    </div>
    <p class="res-count" id="rf-count" aria-live="polite"></p>
    <div id="rf-list"></div>
  </div>`;
  const draw = () => {
    store.set('fx-rf', f);
    const q = fold(f.q);
    const list = RULES.filter((r) => (f.lv === 'all' || r.lv === f.lv) && (f.cat === 'all' || r.c === f.cat) && (!f.demo || r.demo) && ruleMatches(r, q));
    const base = RULES.filter((r) => (f.cat === 'all' || r.c === f.cat) && (!f.demo || r.demo) && ruleMatches(r, q));
    const lvn = (lv) => base.filter((r) => lv === 'all' || r.lv === lv).length;
    $('#rf-lv').innerHTML = [['all', 'Tất cả'], ['m', 'Bắt buộc'], ['s', 'Nên'], ['c', 'Cân nhắc']].map(([k, n]) => `<button type="button" data-lv="${k}" aria-pressed="${f.lv === k}">${n} <span class="n">${lvn(k)}</span></button>`).join('');
    $('#rf-cat').innerHTML = `<button type="button" data-cat="all" aria-pressed="${f.cat === 'all'}">Tất cả nhóm</button>` + CATS.map((c) => `<button type="button" data-cat="${c.id}" aria-pressed="${f.cat === c.id}">${ic(c.ic, 15)}${c.n}</button>`).join('');
    $('#rf-count').textContent = list.length === RULES.length ? `Đang hiện tất cả ${RULES.length} nguyên tắc` : `Đang hiện ${list.length}/${RULES.length} nguyên tắc`;
    $('#rf-clear').hidden = !f.q;
    if (!list.length) {
      $('#rf-list').innerHTML = `<div class="empty"><b>Không có nguyên tắc nào khớp</b>Thử từ khóa khác, gõ không dấu cũng được. <button type="button" class="f-linkbtn" id="rf-reset">Xóa bộ lọc</button></div>`;
      $('#rf-reset').addEventListener('click', () => { Object.assign(f, { q: '', lv: 'all', cat: 'all', demo: false }); $('#rf-q').value = ''; $('#rf-demo').checked = false; draw(); });
      return;
    }
    $('#rf-list').innerHTML = CATS.filter((c) => list.some((r) => r.c === c.id)).map((c) => `
      <section class="cat-sec" aria-labelledby="cat-${c.id}">
        <div class="cat-head"><span class="cat-ic">${ic(c.ic, 20)}</span><div><h2 id="cat-${c.id}">${c.n} <span class="muted" style="font-weight:500;font-size:14px">· ${c.k}</span></h2><p>${c.d}</p></div></div>
        <ul class="rlist">${list.filter((r) => r.c === c.id).map(ruleRow).join('')}</ul>
      </section>`).join('');
  };
  draw();
  const qIn = $('#rf-q');
  qIn.addEventListener('input', debounce(() => { f.q = qIn.value; draw(); }, 120));
  $('#rf-clear').addEventListener('click', () => { f.q = ''; qIn.value = ''; draw(); qIn.focus(); });
  $('#rf-demo').addEventListener('change', (e) => { f.demo = e.target.checked; draw(); });
  $('#rf-lv').addEventListener('click', (e) => { const b = e.target.closest('[data-lv]'); if (b) { f.lv = b.dataset.lv; draw(); $(`#rf-lv [data-lv="${f.lv}"]`).focus(); } });
  $('#rf-cat').addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (b) { f.cat = b.dataset.cat; draw(); const nb = $(`#rf-cat [data-cat="${f.cat}"]`); nb.focus(); nb.scrollIntoView({ inline: 'nearest', block: 'nearest' }); } });
}
function ruleRow(r) {
  const st = S.audit.items[r.id];
  const stl = { pass: 'Đạt', fail: 'Chưa đạt', na: 'Không áp dụng' }[st];
  return `<li><a class="rrow" href="#nt-${r.id.toLowerCase()}"><span class="rid">${r.id}</span><span><span class="rrow-t">${fmt(r.t)}</span><span class="rrow-s">${fmt(r.s)}</span></span>
    <span class="rrow-meta">${r.demo ? `<span class="demo-badge">${ic('play', 12)}Demo</span>` : ''}${lvPill(r.lv)}<span class="st-dot ${st || ''}" title="${stl ? 'Đánh giá: ' + stl : 'Chưa đánh giá'}"><span class="vh">${stl ? 'Đánh giá: ' + stl : 'Chưa đánh giá'}</span></span></span></a></li>`;
}

/* ============================================================
   CHI TIẾT NGUYÊN TẮC
   ============================================================ */
function viewRule(main, id) {
  const r = RULE_BY_ID[id], c = CAT_BY_ID[r.c];
  const i = RULES.indexOf(r), prev = RULES[i - 1], next = RULES[i + 1];
  const mock = r.mock && MOCKS[r.mock];
  const tags = [
    ...(r.law || []).map((k) => LAWS[k] && (LAWS[k].u ? `<a class="tag" href="${LAWS[k].u}" target="_blank" rel="noopener">${esc(LAWS[k].n)}</a>` : `<span class="tag">${esc(LAWS[k].n)}</span>`)),
    ...(r.wcag || []).map((w) => WCAG[w] && `<a class="tag" href="https://www.w3.org/WAI/WCAG22/Understanding/${WCAG[w][1]}.html" target="_blank" rel="noopener" title="${esc(WCAG[w][0])}">WCAG ${w}</a>`),
  ].filter(Boolean).join('');
  main.innerHTML = `<div class="view">
    <nav class="crumbs" aria-label="Vị trí"><a href="#nguyen-tac">Nguyên tắc</a>${ic('right', 14)}<span>${c.n}</span></nav>
    <div class="rd">
      <article>
        <header class="rd-head">
          <div class="rd-meta"><span class="rid">${r.id}</span>${lvPill(r.lv)}<span class="tag">${ic(c.ic, 14)}${c.n}</span></div>
          <h1 class="h1">${fmt(r.t)}</h1>
          <p class="rd-sum">${fmt(r.s)}</p>
          ${tags ? `<div class="chips">${tags}</div>` : ''}
        </header>
        <section class="rd-block"><h2>${ic('bulb', 16)}Vì sao</h2><p class="rd-why">${fmt(r.why)}</p></section>
        <section class="rd-block"><h2>${ic('list', 16)}Cách làm</h2><ol class="steps">${r.how.map((h) => `<li>${fmt(h)}</li>`).join('')}</ol></section>
        ${r.demo ? `<section class="rd-block"><h2>${ic('play', 14)}Thử ngay</h2><div class="demo" id="demo-mount" data-demo="${r.demo}"></div></section>` : ''}
        <section class="rd-block"><h2>${ic('eye', 16)}Nên và không nên</h2>
          <div class="dd">
            <div class="dd-col do"><div class="dd-h">${ic('ok', 18)}Nên</div>${mock ? `<div class="dd-mock mk" role="img" aria-label="Minh họa cách làm nên theo">${mock.do}</div>` : ''}<ul class="dd-list">${r.do.map((x) => `<li>${fmt(x)}</li>`).join('')}</ul></div>
            <div class="dd-col dont"><div class="dd-h">${ic('x', 18)}Không nên</div>${mock ? `<div class="dd-mock mk" role="img" aria-label="Minh họa cách làm không nên">${mock.dont}</div>` : ''}<ul class="dd-list">${r.dont.map((x) => `<li>${fmt(x)}</li>`).join('')}</ul></div>
          </div>
        </section>
        <nav class="pn" aria-label="Nguyên tắc trước và sau">
          ${prev ? `<a href="#nt-${prev.id.toLowerCase()}"><small>${ic('left', 14)}Trước · ${prev.id}</small><b>${fmt(prev.t)}</b></a>` : '<span></span>'}
          ${next ? `<a class="next" href="#nt-${next.id.toLowerCase()}"><small>Sau · ${next.id}${ic('right', 14)}</small><b>${fmt(next.t)}</b></a>` : '<span></span>'}
        </nav>
      </article>
      <aside class="rd-aside" aria-label="Công cụ cho nguyên tắc này">
        <div class="box"><h3>Kiểm tra form của bạn</h3><p class="chk-q">${fmt(r.chk)}</p>${statusSeg(r.id)}<p class="muted" style="font-size:12.5px;margin-top:10px">Kết quả được ghi vào <a href="#danh-gia">Đánh giá form</a>.</p></div>
        ${PG_RULES.has(r.id) ? `<div class="box"><h3>Xem trong form mẫu</h3><p style="font-size:14px;margin-bottom:10px">Nguyên tắc này được áp dụng trong form mẫu đăng ký dự thi. Bật "Hiện chú thích" và tìm huy hiệu <span class="ann" style="display:inline-flex;cursor:default">${r.id}</span>.</p><a class="btn btn-sec btn-sm" href="#form-mau">${ic('play', 14)}Mở form mẫu</a></div>` : ''}
        <div class="box"><h3>Dùng trong tài liệu</h3><div class="btn-row"><button type="button" class="btn btn-sec btn-sm" id="copy-md">${ic('copy', 16)}Sao chép dạng Markdown</button></div><p class="muted" style="font-size:12.5px;margin-top:8px">Dán vào PRD, Jira, Confluence, Slack.</p></div>
        ${r.rel && r.rel.length ? `<div class="box"><h3>Liên quan</h3><div class="rel-list">${r.rel.map((x) => ruleChip(x, true)).join('')}</div></div>` : ''}
        ${r.src && r.src.length ? `<div class="box"><h3>Tham khảo</h3><ul class="src-list">${r.src.map((k) => SRC[k] ? `<li><a href="${SRC[k][1]}" target="_blank" rel="noopener">${ic('ext', 14)}<span>${esc(SRC[k][0])}</span></a></li>` : '').join('')}</ul></div>` : ''}
      </aside>
    </div>
  </div>`;
  if (r.demo) DEMOS[r.demo]($('#demo-mount'));
  $('#copy-md').addEventListener('click', () => copyText(ruleMarkdown(r), 'Đã sao chép nguyên tắc dạng Markdown'));
}
function plain(s) { return stripTags(fmt(s)).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'); }
function mdText(s) { return String(s).replace(/\[\[(.+?)\]\]/g, '`$1`').replace(/%%(.+?)%%/g, '_$1_').replace(/\[([^\]]+?)\]\(#[a-z0-9-]+\)/g, '$1').replace(/\{([A-Z]\d{1,2})\}/g, '$1'); }
function ruleMarkdown(r) {
  return `### ${r.id} · ${mdText(r.t)} (${LEVELS[r.lv].n})\n\n${mdText(r.s)}\n\n**Vì sao:** ${mdText(r.why)}\n\n**Cách làm:**\n${r.how.map((h, i) => `${i + 1}. ${mdText(h)}`).join('\n')}\n\n**Nên:** ${r.do.map(mdText).join('; ')}\n**Không nên:** ${r.dont.map(mdText).join('; ')}\n\n**Tiêu chí kiểm tra:** ${mdText(r.chk)}${r.wcag ? `\n**WCAG:** ${r.wcag.join(', ')}` : ''}`;
}

/* ============================================================
   DEMO CHẠY THẬT
   ============================================================ */
function demoShell(el, o) {
  const one = !o.dont;
  const chipsHTML = o.chips ? `<div class="demo-chips ${o.chipsTop ? 'top' : ''}"><span>Thử nhanh:</span>${o.chips.map((c, i) => `<button type="button" class="try-chip" data-chip="${i}">${c.label}</button>`).join('')}</div>` : '';
  el.innerHTML = `
    <div class="demo-head"><b>${ic('play', 14)}${o.title}</b>${o.headExtra || ''}</div>
    ${o.tip ? `<div class="demo-try">${ic('bulb', 16)}<span>${o.tip}</span></div>` : ''}
    ${o.chips && o.chipsTop ? chipsHTML : ''}
    <div class="demo-grid ${one ? 'one' : ''}">
      ${o.dont ? `<div class="demo-pane" data-pane="dont"><div class="demo-tag dont">${ic('x', 14)}Không nên</div>${o.dont}</div>` : ''}
      <div class="demo-pane" data-pane="do">${one ? '' : `<div class="demo-tag do">${ic('ok', 14)}Nên</div>`}${o.do}</div>
    </div>
    ${o.chips && !o.chipsTop ? chipsHTML : ''}`;
  if (o.chips) el.querySelectorAll('[data-chip]').forEach((b) => b.addEventListener('click', () => o.chips[+b.dataset.chip].run()));
  return { dont: el.querySelector('[data-pane="dont"]'), do: el.querySelector('[data-pane="do"]') };
}
function fireBlur(inp) { inp.dispatchEvent(new Event('blur')); }
function typeInto(ctl, v) { ctl.set(v); clearErr(ctl); const n = ctl.el.querySelector('.f-note'); if (n) n.innerHTML = ''; const i = ctl.inputs()[0]; if (v) fireBlur(i); }

const DEMOS = {
  placeholder(el) {
    const p = demoShell(el, {
      title: 'Nhãn thật và placeholder',
      tip: 'Gõ vào ô thứ hai bên "Không nên". Yêu cầu "10 số, bắt đầu bằng 0" biến mất ngay khi bạn bắt đầu gõ.',
      dont: `<div style="display:grid;gap:12px;margin-bottom:12px"><input class="bad-input" aria-label="Họ và tên (ví dụ không nên)" placeholder="Họ và tên"><input class="bad-input" aria-label="Số điện thoại (ví dụ không nên)" placeholder="Số điện thoại (10 số, bắt đầu bằng 0)"><input class="bad-input" aria-label="Email (ví dụ không nên)" placeholder="Email nhận kết quả"></div><p class="demo-foot">Chữ mờ khó đọc, trông như đã điền, và biến mất khi gõ.</p>`,
      do: [fieldHTML(DC.name('pl')), fieldHTML(DC.phone('pl')), fieldHTML(DC.email('pl'))].join(''),
      chips: [{ label: 'Điền cả hai bên', run: () => { const vals = ['Nguyễn Minh Anh', '0912345678', 'minh.anh@gmail.com']; $$('.bad-input', p.dont).forEach((x, i) => { x.value = vals[i]; }); [c1, c2, c3].forEach((c, i) => typeInto(c, vals[i])); } }],
    });
    const c1 = mountField(DC.name('pl'), p.do), c2 = mountField(DC.phone('pl'), p.do), c3 = mountField(DC.email('pl'), p.do);
  },
  keyboard(el) {
    const p = demoShell(el, {
      title: 'Số căn cước với type="number"',
      tip: 'Số căn cước của người đăng ký khai sinh ở Hà Nội bắt đầu bằng 001. Bấm "Thử nhanh" rồi xem máy chủ nhận được gì.',
      dont: `<label class="bad-label" for="kb-bad">Số căn cước <code>type="number"</code></label><input class="bad-input" id="kb-bad" type="number"><div class="server-log" id="kb-bad-log">Máy chủ nhận: —</div><p class="demo-foot" style="margin-top:8px">Còn nữa: có nút tăng/giảm, cuộn chuột trên ô là đổi số, cho gõ chữ "e".</p>`,
      do: `${fieldHTML(DC.cccd('kb'))}<div class="server-log" id="kb-good-log">Máy chủ nhận: —</div>
        <table class="spec" style="margin:14px 0 12px"><tr><th>Email</th><td><code>type="email"</code></td></tr><tr><th>Số điện thoại</th><td><code>type="tel"</code></td></tr><tr><th>CCCD, OTP</th><td><code>inputmode="numeric"</code></td></tr><tr><th>Đường dẫn</th><td><code>type="url"</code></td></tr></table>`,
      chips: [{ label: 'Nhập <code>001203004567</code>', run: () => fill('001203004567') }, { label: 'Nhập <code>001 203 004 567</code>', run: () => fill('001 203 004 567') }],
    });
    const bad = $('#kb-bad'), badLog = $('#kb-bad-log'), goodLog = $('#kb-good-log');
    const ctl = mountField({ ...DC.cccd('kb'), onInput: () => logGood(), onChange: () => logGood() }, p.do);
    const logBad = () => { const v = bad.value; badLog.innerHTML = v === '' ? 'Máy chủ nhận: — <span class="muted">(trình duyệt trả về chuỗi rỗng nếu có ký tự lạ)</span>' : `Máy chủ nhận: <b>${esc(String(Number(v)))}</b>${/^0/.test(v) ? ' <span style="color:var(--err)">← mất số 0 ở đầu</span>' : ''}`; };
    const logGood = () => { const v = ctl.norm(); goodLog.innerHTML = v ? `Máy chủ nhận: <b>"${esc(v)}"</b> <span style="color:var(--ok)">← giữ nguyên</span>` : 'Máy chủ nhận: —'; };
    bad.addEventListener('input', logBad);
    function fill(v) { bad.value = v.replace(/\s/g, ''); logBad(); typeInto(ctl, v); logGood(); }
  },
  phone(el) {
    const p = demoShell(el, {
      title: 'Số điện thoại nhập theo nhiều cách',
      tip: 'Bấm các mẫu bên dưới: người dùng thật gõ số điện thoại theo đủ kiểu.',
      dont: `<label class="bad-label" for="ph-bad">Số điện thoại</label><input class="bad-input" id="ph-bad" type="tel"><div class="bad-err" id="ph-bad-err" hidden>Số điện thoại không hợp lệ</div><p class="demo-foot" style="margin-top:8px">Chỉ chấp nhận đúng 10 chữ số liền nhau.</p>`,
      do: fieldHTML(DC.phone('ph')),
      chips: ['+84 912.345.678', '0912-345-678', '912345678', '84912345678', '0912 345'].map((v) => ({ label: `<code>${v}</code>`, run: () => { const b = $('#ph-bad'); b.value = v; b.dispatchEvent(new Event('blur')); typeInto(ctl, v); } })),
    });
    const ctl = mountField(DC.phone('ph'), p.do);
    $('#ph-bad').addEventListener('blur', (e) => { $('#ph-bad-err').hidden = !e.target.value || /^0\d{9}$/.test(e.target.value); });
  },
  name(el) {
    const p = demoShell(el, {
      title: 'Họ và tên tiếng Việt',
      tip: 'Thử các tên thật dưới đây. Bên trái dùng kiểm tra [A-Za-z] và giới hạn 20 ký tự — rất hay gặp.',
      dont: `<label class="bad-label" for="nm-bad">Họ tên</label><input class="bad-input" id="nm-bad" maxlength="20"><div class="bad-err" id="nm-bad-err" hidden>Họ tên không hợp lệ</div>`,
      do: fieldHTML(DC.name('nm')),
      chips: ['Nguyễn Thị Ánh Tuyết', 'Tôn Nữ Hoàng Bảo Ngọc Phương Thảo', "H'Lan Niê", '  Lê   Văn  An '].map((v) => ({ label: esc(v.trim() === v ? v : '“' + v + '”'), run: () => { const b = $('#nm-bad'); b.value = v.slice(0, 20); b.dispatchEvent(new Event('blur')); typeInto(ctl, v); } })),
    });
    const ctl = mountField(DC.name('nm'), p.do);
    $('#nm-bad').addEventListener('blur', (e) => { $('#nm-bad-err').hidden = !e.target.value || /^[A-Za-z ]+$/.test(e.target.value); });
  },
  dob(el) {
    const years = []; for (let y = 1940; y <= new Date().getFullYear(); y++) years.push(y);
    const sel = (id, lb, arr) => `<div style="display:grid;gap:4px"><label class="bad-label" for="${id}">${lb}</label><select class="bad-input" id="${id}" style="width:auto"><option>--</option>${arr.map((x) => `<option>${x}</option>`).join('')}</select></div>`;
    const p = demoShell(el, {
      title: 'Ngày sinh',
      tip: `Bên trái: chọn năm 2008 phải cuộn qua ${2008 - 1940} mục. Bên phải: gõ thẳng, lỗi chỉ đúng phần sai.`,
      dont: `<p class="bad-label">Ngày sinh</p><div style="display:flex;gap:8px;flex-wrap:wrap">${sel('db-d', 'Ngày', Array.from({ length: 31 }, (_, i) => i + 1))}${sel('db-m', 'Tháng', Array.from({ length: 12 }, (_, i) => i + 1))}${sel('db-y', 'Năm', years)}</div>`,
      do: fieldHTML(DC.dob('db')),
      chips: [['27', '03', '2008'], ['30', '02', '2008'], ['15', '06', ''], ['01', '01', '1990']].map(([d, m, y]) => ({ label: `<code>${d} ${m} ${y || '____'}</code>`, run: () => { ctl.set({ d, m, y }); clearErr(ctl); ctl.touched = true; ctl.validate(); } })),
    });
    const ctl = mountField(DC.dob('db'), p.do);
  },
  counter(el) {
    const p = demoShell(el, {
      title: 'Mô tả dài khi dán vào',
      tip: `Bấm "Dán đoạn văn mẫu": ${countWords(LONG_TEXT)} từ được dán vào cả hai bên. Giới hạn bên phải là 300 từ.`,
      dont: `<label class="bad-label" for="ct-bad">Mô tả (tối đa 1.000 ký tự)</label><textarea class="bad-input" id="ct-bad" maxlength="1000" style="height:150px;padding:8px"></textarea><div class="server-log" id="ct-bad-log">Đã nhận: 0 ký tự</div>`,
      do: fieldHTML(DC.desc('ct')),
      chips: [{ label: `Dán đoạn văn mẫu (${countWords(LONG_TEXT)} từ)`, run: () => { const b = $('#ct-bad'); b.value = LONG_TEXT.slice(0, 1000); upd(); ctl.set(LONG_TEXT); ctl.touched = true; ctl.validate(); } }, { label: 'Xóa', run: () => { $('#ct-bad').value = ''; upd(); ctl.set(''); clearErr(ctl); } }],
    });
    const ctl = mountField(DC.desc('ct'), p.do);
    const upd = () => { const v = $('#ct-bad').value; $('#ct-bad-log').innerHTML = `Đã nhận: <b>${v.length.toLocaleString('vi-VN')}</b> ký tự${v.length >= 1000 ? ` <span style="color:var(--err)">← đã cắt mất ${(LONG_TEXT.length - 1000).toLocaleString('vi-VN')} ký tự, không một lời báo</span>` : ''}`; };
    $('#ct-bad').addEventListener('input', upd);
  },
  emailtypo(el) {
    const p = demoShell(el, {
      title: 'Email: nhập lại hay gợi ý sửa?',
      tip: 'Thử dán vào ô "Nhập lại email" bên trái. Bên phải, bấm một mẫu gõ nhầm tên miền rồi bấm "Dùng địa chỉ này".',
      dont: `<div style="display:grid;gap:10px"><div><label class="bad-label" for="em-b1">Email</label><input class="bad-input" id="em-b1" type="email"></div><div><label class="bad-label" for="em-b2">Nhập lại email</label><input class="bad-input" id="em-b2" type="email"><div class="bad-err" id="em-b2-err" hidden>Không được phép dán. Vui lòng gõ lại email.</div></div></div><p class="demo-foot" style="margin-top:10px">Gấp đôi công sức, và lỗi gõ nhầm vẫn lọt qua.</p>`,
      do: fieldHTML(DC.email('em', true)),
      chips: ['minh.anh@gmial.com', 'lan@yahoo.con', 'an@hotmial.com', 'duc@gmail.co'].map((v) => ({ label: `<code>${v}</code>`, run: () => { $('#em-b1').value = v; typeInto(ctl, v); } })),
    });
    const ctl = mountField(DC.email('em', true), p.do);
    $('#em-b2').addEventListener('paste', (e) => { e.preventDefault(); $('#em-b2-err').hidden = false; });
  },
  password(el) {
    const p = demoShell(el, {
      title: 'Tạo mật khẩu',
      tip: 'Bên trái: bấm "Tạo tài khoản" để thấy yêu cầu chỉ hiện sau cùng. Bên phải: yêu cầu hiện sẵn, tích dần khi đạt.',
      dont: `<div style="display:grid;gap:10px"><div><label class="bad-label" for="pw-b1">Mật khẩu</label><input class="bad-input" id="pw-b1" type="password" autocomplete="off"></div><div><label class="bad-label" for="pw-b2">Nhập lại mật khẩu</label><input class="bad-input" id="pw-b2" type="password" autocomplete="off"></div><button type="button" class="btn btn-sec btn-sm" id="pw-bbtn" style="width:fit-content">Tạo tài khoản</button><div class="bad-err" id="pw-berr" hidden>Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt. Mật khẩu không khớp.</div></div>`,
      do: `<div class="f-field" id="fw-pw-good"><label class="f-label" for="pw-good">Mật khẩu <span class="f-req" aria-hidden="true">*</span></label><p class="f-hint" id="pw-good-hint">Dùng để theo dõi hồ sơ. Có thể dán từ trình quản lý mật khẩu.</p>
        <div class="pw-wrap"><input class="f-input" id="pw-good" type="password" autocomplete="new-password" aria-describedby="pw-good-hint pw-rules" aria-required="true"><button type="button" class="btn btn-sec pw-toggle" id="pw-tg" aria-pressed="false" aria-controls="pw-good">Hiện</button></div>
        <ul class="pw-rules" id="pw-rules"><li data-r="len"><span class="dot">${ic('ok', 10)}</span>Ít nhất 8 ký tự</li><li data-r="num"><span class="dot">${ic('ok', 10)}</span>Có ít nhất 1 chữ số</li></ul></div>`,
    });
    $('#pw-bbtn').addEventListener('click', () => { $('#pw-berr').hidden = false; });
    const inp = $('#pw-good'), tg = $('#pw-tg');
    tg.addEventListener('click', () => { const show = inp.type === 'password'; inp.type = show ? 'text' : 'password'; tg.textContent = show ? 'Ẩn' : 'Hiện'; tg.setAttribute('aria-pressed', String(show)); inp.focus(); });
    inp.addEventListener('input', () => { const v = inp.value; $('#pw-rules [data-r="len"]').classList.toggle('ok', v.length >= 8); $('#pw-rules [data-r="num"]').classList.toggle('ok', /\d/.test(v)); });
  },
  radioselect(el) {
    const p = demoShell(el, {
      title: 'Hai lựa chọn: dropdown hay radio?',
      tip: 'Đếm số lần chạm để chọn "Theo đội" ở mỗi bên.',
      dont: `<label class="bad-label" for="rs-bad">Hình thức tham gia</label><select class="bad-input" id="rs-bad"><option>-- Chọn --</option><option>Cá nhân</option><option>Theo đội</option></select><p class="demo-foot" style="margin-top:8px">2 lần chạm; phải mở ra mới biết có gì.</p>`,
      do: fieldHTML(DC.mode('rs')) + '<p class="demo-foot">1 lần chạm; thấy hết lựa chọn ngay.</p>',
    });
    mountField(DC.mode('rs'), p.do);
  },
  combobox(el) {
    const p = demoShell(el, {
      title: 'Tìm tỉnh/thành và trường học',
      tip: 'Gõ không dấu, viết tắt, hoặc tên tỉnh cũ. Dùng được bằng phím ↑ ↓ Enter Esc.',
      chipsTop: true,
      do: fieldHTML(DC.province('cb', true)) + fieldHTML(DC.school('cb')),
      chips: [['hcm', 'p'], ['da nang', 'p'], ['binh duong', 'p'], ['ha giang', 'p'], ['bk', 's'], ['ams', 's'], ['THPT Nguyễn Du', 's']].map(([v, k]) => ({ label: `<code>${v}</code>`, run: () => { const i = $(k === 'p' ? '#cb-province' : '#cb-school'); i.focus(); i.value = v; i.dispatchEvent(new Event('input')); } })),
    });
    mountField(DC.province('cb', true), p.do); mountField(DC.school('cb'), p.do);
  },
  timing(el) {
    const p = demoShell(el, {
      title: 'Lúc nào thì báo lỗi?',
      tip: 'Gõ từ từ "minh.anh@gmail.com" vào cả hai ô, rồi bấm Tab để rời ô.',
      dont: `<label class="bad-label" for="tm-bad">Email</label><input class="bad-input" id="tm-bad" type="email" autocomplete="off"><div class="bad-err" id="tm-bad-err" hidden>Email không hợp lệ!</div><p class="demo-foot" style="margin-top:8px">Báo lỗi ngay từ ký tự đầu tiên.</p>`,
      do: fieldHTML(DC.email('tm')) + '<p class="demo-foot">Chưa báo khi đang gõ. Rời ô mới kiểm tra. Đang lỗi mà sửa đúng thì lỗi biến mất ngay.</p>',
    });
    mountField(DC.email('tm'), p.do);
    $('#tm-bad').addEventListener('input', (e) => { $('#tm-bad-err').hidden = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.target.value); });
  },
  summary(el) {
    const p = demoShell(el, {
      title: 'Bấm gửi khi còn lỗi',
      tip: 'Bấm "Gửi" ở cả hai bên mà không nhập gì.',
      dont: `<div style="display:grid;gap:10px"><div><label class="bad-label" for="sm-b1">Họ và tên</label><input class="bad-input" id="sm-b1"></div><div><label class="bad-label" for="sm-b2">Email</label><input class="bad-input" id="sm-b2"></div><div><label class="bad-label" for="sm-b3">Hạng mục</label><select class="bad-input" id="sm-b3"><option></option><option>Công nghệ</option></select></div><button type="button" class="btn btn-sec btn-sm" id="sm-bbtn" style="width:fit-content">Gửi</button><div class="bad-err" id="sm-berr" hidden style="font-size:13px">Vui lòng kiểm tra lại thông tin!</div></div>`,
      do: `<div id="sm-sum" hidden></div><form id="sm-form" novalidate>${fieldHTML(DC.name('sm'))}${fieldHTML(DC.email('sm'))}${fieldHTML(DC.category('sm'))}<button class="btn btn-pri" type="submit">Gửi</button></form>`,
    });
    $('#sm-bbtn').addEventListener('click', () => { $('#sm-berr').hidden = false; });
    const form = makeForm();
    [DC.name('sm'), DC.email('sm'), DC.category('sm')].forEach((c) => form.add(mountField(c, p.do)));
    $('#sm-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const errs = form.validate();
      if (errs.length) showSummary($('#sm-sum'), errs, form);
      else { $('#sm-sum').hidden = true; toast('Hợp lệ — trong form thật, hồ sơ sẽ được gửi'); }
    });
  },
  disabled(el) {
    const p = demoShell(el, {
      title: 'Nút Tiếp tục bị khóa',
      tip: 'Nhập họ tên "A" và số điện thoại "0912". Bên trái, bạn có biết vì sao không bấm được không?',
      dont: `<div style="display:grid;gap:10px"><div><label class="bad-label" for="ds-b1">Họ và tên</label><input class="bad-input" id="ds-b1"></div><div><label class="bad-label" for="ds-b2">Số điện thoại</label><input class="bad-input" id="ds-b2" type="tel"></div><button type="button" class="btn btn-pri btn-sm" id="ds-bbtn" disabled style="width:fit-content;opacity:.4">Tiếp tục</button></div>`,
      do: `<form id="ds-form" novalidate>${fieldHTML(DC.name('ds'))}${fieldHTML(DC.phone('ds'))}<button class="btn btn-pri" type="submit">Tiếp tục</button></form>`,
      chips: [{ label: 'Nhập "A" và "0912"', run: () => { $('#ds-b1').value = 'A'; $('#ds-b2').value = '0912'; chk(); c1.set('A'); c2.set('0912'); } }],
    });
    const chk = () => { $('#ds-bbtn').disabled = !($('#ds-b1').value.trim().length >= 2 && /^0\d{9}$/.test($('#ds-b2').value.replace(/\D/g, ''))); $('#ds-bbtn').style.opacity = $('#ds-bbtn').disabled ? '.4' : '1'; };
    $('#ds-b1').addEventListener('input', chk); $('#ds-b2').addEventListener('input', chk);
    const form = makeForm();
    const c1 = form.add(mountField(DC.name('ds'), p.do)), c2 = form.add(mountField(DC.phone('ds'), p.do));
    $('#ds-form').addEventListener('submit', (e) => { e.preventDefault(); const errs = form.validate(); if (errs.length) errs[0].ctl.focus(); else toast('Hợp lệ — chuyển sang bước tiếp theo'); });
  },
  submit(el) {
    let nBad = 0, nGood = 0, busy = false;
    const p = demoShell(el, {
      title: 'Bấm gửi nhiều lần',
      tip: 'Bấm liên tục 3–4 lần vào nút ở mỗi bên. Máy chủ giả lập mất khoảng 1,5 giây để xử lý.',
      dont: `<button type="button" class="btn btn-pri" id="sb-bad">Gửi hồ sơ</button><div class="counter-box">Hồ sơ trên máy chủ: <b id="sb-bad-n">0</b></div><div class="server-log" id="sb-bad-log">Chưa có yêu cầu</div>`,
      do: `<button type="button" class="btn btn-pri" id="sb-good" style="min-width:190px">Gửi hồ sơ</button><div class="counter-box">Hồ sơ trên máy chủ: <b id="sb-good-n">0</b></div><div class="server-log" id="sb-good-log">Chưa có yêu cầu</div>`,
      chips: [{ label: 'Làm lại', run: () => { nBad = 0; nGood = 0; busy = false; $('#sb-bad-n').textContent = '0'; $('#sb-good-n').textContent = '0'; $('#sb-bad-log').textContent = 'Chưa có yêu cầu'; $('#sb-good-log').textContent = 'Chưa có yêu cầu'; const g = $('#sb-good'); g.disabled = false; g.innerHTML = 'Gửi hồ sơ'; } }],
    });
    $('#sb-bad').addEventListener('click', () => { setTimeout(() => { nBad++; $('#sb-bad-n').textContent = nBad; $('#sb-bad-log').innerHTML = `Đã tạo hồ sơ #${nBad} · đã gửi ${nBad} email xác nhận`; }, 1500); });
    $('#sb-good').addEventListener('click', (e) => {
      const b = e.currentTarget;
      if (busy || nGood) return;
      busy = true; b.disabled = true; b.innerHTML = `<span class="spin" aria-hidden="true"></span>Đang gửi…`; announce('Đang gửi hồ sơ');
      setTimeout(() => { nGood = 1; busy = false; $('#sb-good-n').textContent = '1'; $('#sb-good-log').textContent = 'Đã tạo hồ sơ #1 · 1 email xác nhận'; b.innerHTML = `${ic('ok', 18)}Đã gửi`; announce('Đã gửi hồ sơ'); }, 1500);
    });
  },
  upload(el) {
    const p = demoShell(el, {
      title: 'Tải ảnh chân dung và bài dự thi',
      headExtra: `<label class="switch"><input type="checkbox" class="sim-offline" ${SIM.offline ? 'checked' : ''}><span class="sw"></span>Mô phỏng mất mạng</label>`,
      tip: 'Dùng tệp của bạn hoặc tệp mẫu. Thử tệp sai định dạng, tệp quá lớn, ảnh HEIC; bật "Mô phỏng mất mạng" để thấy nút Thử lại.',
      do: fieldHTML(DC.photo('up')) + fieldHTML(DC.entry('up')),
      chips: [
        { label: 'Ảnh mẫu', run: async () => photo.choose(await sampleImage()) },
        { label: 'Ảnh lớn 6 MB', run: async () => { toast('Đang tạo ảnh mẫu 6 MB…'); photo.choose(await bigImage()); } },
        { label: 'Ảnh HEIC', run: () => photo.choose(new File(['heic'], 'IMG_0412.HEIC', { type: 'image/heic' })) },
        { label: 'PDF mẫu', run: () => entry.choose(samplePdf('bai-du-thi.pdf', 2.4 * 1024 * 1024)) },
        { label: 'Tệp .docx', run: () => entry.choose(new File(['docx'], 'bai-du-thi.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })) },
        { label: 'PDF 25 MB', run: () => entry.choose(samplePdf('bai-du-thi-ban-full.pdf', 25 * 1024 * 1024)) },
      ],
    });
    const photo = mountField(DC.photo('up'), p.do), entry = mountField(DC.entry('up'), p.do);
    bindSimToggles(el);
  },
  conditional(el) {
    const p = demoShell(el, {
      title: 'Câu hỏi phụ thuộc lựa chọn',
      tip: 'Chọn "Theo đội" rồi đổi lại "Cá nhân".',
      dont: `<div style="display:grid;gap:10px"><div><label class="bad-label" for="cd-b1">Hình thức tham gia</label><select class="bad-input" id="cd-b1"><option>Cá nhân</option><option>Theo đội</option></select></div><div><label class="bad-label" for="cd-b2">Tên đội (nếu đăng ký theo đội)</label><input class="bad-input" id="cd-b2"></div><div><label class="bad-label" for="cd-b3">Số thành viên (nếu theo đội)</label><input class="bad-input" id="cd-b3"></div></div><p class="demo-foot" style="margin-top:8px">Ai cũng phải đọc và tự quyết có cần điền không.</p>`,
      do: fieldHTML({ ...DC.mode('cd'), after: `<div class="f-reveal" id="cd-reveal" hidden><div class="f-reveal-note">${ic('info', 16)}<span>Bạn là trưởng nhóm. Thành viên khác sẽ được mời qua email sau khi gửi.</span></div>${fieldHTML(DC.team('cd'))}</div>` }),
    });
    const team = mountField(DC.team('cd'), p.do);
    mountField({ ...DC.mode('cd'), onChange: (c) => { const on = c.get() === 'doi'; const rv = $('#cd-reveal'); if (!on && !rv.hidden) { team.set(''); clearErr(team); announce('Đã ẩn phần thông tin đội'); } rv.hidden = !on; if (on) announce('Đã hiện thêm câu hỏi: Tên đội'); } }, p.do);
  },
  team(el) {
    const p = demoShell(el, {
      title: 'Danh sách thành viên đội',
      tip: 'Thêm thành viên, xóa thử một người rồi bấm Hoàn tác. Bấm "Kiểm tra" khi đội chưa đủ 2 người.',
      do: `<div id="tm-sum" hidden></div><div id="tm-box"></div><button type="button" class="btn btn-pri" id="tm-check">Kiểm tra</button>`,
    });
    const t = teamWidget($('#tm-box', p.do), { pre: 'tmd', min: 2, max: 5, lead: { name: 'Nguyễn Minh Anh', email: 'minh.anh@gmail.com' }, members: [] });
    $('#tm-check').addEventListener('click', () => { const errs = t.validate(); const box = $('#tm-sum'); if (errs.length) showSummary(box, errs, t.form, `Cần sửa ${errs.length} mục`); else { box.hidden = true; toast('Danh sách đội hợp lệ'); } });
  },
  otp(el) {
    const p = demoShell(el, {
      title: 'Nhập mã xác thực',
      tip: 'Mã mẫu là 123456. Bấm "Dán 123456" để thấy khác biệt giữa 6 ô riêng và một ô.',
      dont: `<p class="bad-label" id="otp-bl">Mã OTP</p><div class="otp-boxes" role="group" aria-labelledby="otp-bl">${Array.from({ length: 6 }, (_, i) => `<input maxlength="1" inputmode="numeric" aria-label="Chữ số ${i + 1}" data-ob="${i}">`).join('')}</div><p class="demo-foot" style="margin-top:10px">Không có nút gửi lại, không sửa được số điện thoại.</p>`,
      do: `<div class="f-field" id="fw-otp-good"><label class="f-label" for="otp-good">Mã xác thực</label><p class="f-hint" id="otp-good-hint">Mã gồm 6 chữ số đã gửi tới <b id="otp-num">0912 *** 678</b>. <button type="button" class="f-linkbtn" id="otp-edit">Sửa số</button></p>
        <div id="otp-editbox" hidden></div>
        ${errP('otp-good')}
        <input class="f-input otp-in" id="otp-good" inputmode="numeric" autocomplete="one-time-code" maxlength="10" aria-describedby="otp-good-hint">
        <div class="f-note" id="otp-good-note" aria-live="polite"></div>
        <p class="f-hint" id="otp-resend"></p></div>`,
      chips: [{ label: 'Dán <code>123456</code>', run: () => pasteBoth('123456') }, { label: 'Dán <code>123 465</code>', run: () => pasteBoth('123 465') }],
    });
    const boxes = $$('[data-ob]', p.dont);
    boxes.forEach((b, i) => {
      b.addEventListener('input', () => { if (b.value && boxes[i + 1]) boxes[i + 1].focus(); });
      b.addEventListener('paste', (e) => { e.preventDefault(); const t = (e.clipboardData.getData('text') || '').trim(); b.value = t.charAt(0); });
    });
    const inp = $('#otp-good'), note = $('#otp-good-note');
    const ctl = { id: 'otp-good', el: $('#fw-otp-good'), inputs: () => [inp] };
    const check = () => {
      const d = inp.value.replace(/\D/g, '');
      if (d.length < 6) { clearErr(ctl); note.innerHTML = ''; return; }
      if (d === '123456') { clearErr(ctl); note.innerHTML = `${ic('ok', 16)}<span>Đã xác thực số điện thoại</span>`; announce('Đã xác thực số điện thoại'); }
      else { note.innerHTML = ''; setErr(ctl, 'Mã chưa đúng. Kiểm tra lại tin nhắn hoặc gửi lại mã'); inp.select(); }
    };
    inp.addEventListener('input', check);
    function pasteBoth(v) { boxes.forEach((b) => { b.value = ''; }); boxes[0].value = v.charAt(0); inp.value = v.replace(/\D/g, ''); check(); inp.focus(); }
    let left = 30, timer;
    const tick = () => {
      const r = $('#otp-resend'); if (!r || !document.body.contains(r)) { clearInterval(timer); return; }
      if (left > 0) { r.textContent = `Gửi lại mã sau ${left} giây`; left--; }
      else { clearInterval(timer); r.innerHTML = `Chưa nhận được mã? <button type="button" class="f-linkbtn" id="otp-re">Gửi lại mã</button>`; $('#otp-re').addEventListener('click', () => { left = 30; announce('Đã gửi lại mã'); toast('Đã gửi lại mã'); timer = setInterval(tick, 1000); tick(); }); }
    };
    timer = setInterval(tick, 1000); tick();
    $('#otp-edit').addEventListener('click', () => {
      const box = $('#otp-editbox'); box.hidden = false;
      box.innerHTML = `<div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;margin:6px 0 12px">${fieldHTML({ ...DC.phone('otp'), label: 'Số điện thoại mới' })}<button type="button" class="btn btn-sec" id="otp-send" style="margin-bottom:24px">Gửi mã</button></div>`;
      const ph = mountField({ ...DC.phone('otp'), label: 'Số điện thoại mới' }, box);
      $('#otp-phone').focus();
      $('#otp-send').addEventListener('click', () => {
        const m = ph.validate(true); if (m) { ph.focus(); return; }
        const d = ph.norm(); $('#otp-num').textContent = `${d.slice(0, 4)} *** ${d.slice(7)}`; box.hidden = true; box.innerHTML = '';
        left = 30; clearInterval(timer); timer = setInterval(tick, 1000); tick(); inp.value = ''; inp.focus(); announce('Đã gửi mã tới số mới');
      });
    });
  },
};
async function bigImage() {
  const w = 2400, h = 3200, cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const g = cv.getContext('2d'); const img = g.createImageData(w, h); const d = img.data;
  let s = 7; for (let i = 0; i < d.length; i += 4) { s = (s * 1103515245 + 12345) & 0x7fffffff; const v = s & 255; d[i] = v; d[i + 1] = (v * 7) & 255; d[i + 2] = (v * 13) & 255; d[i + 3] = 255; }
  g.putImageData(img, 0, 0);
  g.fillStyle = 'rgba(40,60,120,.55)'; g.beginPath(); g.arc(w / 2, h * 0.4, w * 0.22, 0, 7); g.fill();
  const b = await new Promise((r) => cv.toBlob(r, 'image/jpeg', 0.97));
  return new File([b], 'IMG_2041.jpg', { type: 'image/jpeg' });
}
function bindSimToggles(scope) {
  $$('.sim-offline', scope).forEach((t) => t.addEventListener('change', () => { SIM.offline = t.checked; $$('.sim-offline').forEach((x) => { x.checked = SIM.offline; }); toast(SIM.offline ? 'Đang mô phỏng mất mạng' : 'Đã có mạng trở lại'); }));
}

/* Cấu hình trường dùng lại cho demo và form mẫu (pre = tiền tố id) */
const DC = {
  name: (pre) => ({ id: `${pre}-name`, label: 'Họ và tên', hint: 'Ghi đầy đủ, có dấu', required: true, autocomplete: 'name', autocapitalize: 'words', spellcheck: false, norm: 'name', v: 'name', emptyMsg: 'Nhập họ và tên', enterkeyhint: 'next' }),
  phone: (pre) => ({ id: `${pre}-phone`, label: 'Số điện thoại', hint: 'Ví dụ: 0912 345 678', required: true, type: 'tel', inputmode: 'tel', autocomplete: 'tel', norm: 'phone', v: 'phone', emptyMsg: 'Nhập số điện thoại', enterkeyhint: 'next', w: 'w-id' }),
  email: (pre, suggest) => ({ id: `${pre}-email`, label: 'Email', hint: 'Ví dụ: ten@gmail.com', required: true, type: 'email', inputmode: 'email', autocomplete: 'email', spellcheck: false, autocapitalize: 'none', norm: 'email', v: 'email', suggest: !!suggest, emptyMsg: 'Nhập email', enterkeyhint: 'next' }),
  cccd: (pre) => ({ id: `${pre}-cccd`, label: 'Số căn cước (CCCD)', hint: '12 chữ số in trên thẻ căn cước', required: true, inputmode: 'numeric', autocomplete: 'off', norm: 'digits', v: 'cccd', emptyMsg: 'Nhập số căn cước', w: 'w-id' }),
  dob: (pre) => ({ id: `${pre}-dob`, kind: 'dob', label: 'Ngày sinh', hint: 'Ví dụ: 27 03 2008', required: true, emptyMsg: 'Nhập ngày sinh', range: { min: 15, max: 30, ref: DEADLINE } }),
  desc: (pre) => ({ id: `${pre}-desc`, label: 'Mô tả ý tưởng', hint: 'Tối đa 300 từ. Nêu vấn đề, giải pháp, người hưởng lợi.', required: true, multiline: true, rows: 7, counter: { max: 300, what: 'Mô tả' }, emptyMsg: 'Nhập mô tả ý tưởng' }),
  mode: (pre) => ({ id: `${pre}-mode`, kind: 'radio', label: 'Hình thức tham gia', required: true, emptyMsg: 'Chọn hình thức tham gia', options: [{ v: 'canhan', n: 'Cá nhân' }, { v: 'doi', n: 'Theo đội', d: 'Từ 2 đến 5 thành viên' }] }),
  team: (pre) => ({ id: `${pre}-teamname`, label: 'Tên đội', required: true, autocomplete: 'off', emptyMsg: 'Nhập tên đội', w: 'w-md' }),
  category: (pre) => ({ id: `${pre}-cat`, kind: 'radio', cards: true, label: 'Hạng mục dự thi', required: true, emptyMsg: 'Chọn hạng mục dự thi', options: CATEGORY_OPTS }),
  province: (pre, showOld) => ({ id: `${pre}-province`, kind: 'combo', label: 'Tỉnh/Thành phố', hint: 'Gõ để tìm, không cần dấu. Tên tỉnh cũ cũng được.', required: true, autocomplete: 'address-level1', options: PROVINCES, showOld: !!showOld, emptyMsg: 'Chọn tỉnh/thành phố', pickMsg: 'Chọn một tỉnh/thành phố trong danh sách gợi ý' }),
  school: (pre) => ({ id: `${pre}-school`, kind: 'combo', label: 'Trường hoặc đơn vị', hint: 'Gõ tên hoặc tên viết tắt, ví dụ: bk, neu, ams', required: false, allowFree: true, noOpenOnFocus: true, options: SCHOOLS, autocomplete: 'organization' }),
  photo: (pre) => ({ id: `${pre}-photo`, kind: 'file', label: 'Ảnh chân dung', hint: 'JPG hoặc PNG, tối đa 2 MB, tỷ lệ 3:4, nền sáng. Ảnh lớn hơn sẽ được tự động tối ưu.', required: true, accept: 'image/jpeg,image/png,.jpg,.jpeg,.png', exts: ['jpg', 'jpeg', 'png'], extLabel: 'JPG hoặc PNG', maxMB: 2, fileKind: 'image', compress: true, emptyMsg: 'Tải lên ảnh chân dung' }),
  entry: (pre) => ({ id: `${pre}-file`, kind: 'file', label: 'Tệp bài dự thi', hint: 'PDF, tối đa 20 MB. Không ghi tên thí sinh trong bài.', required: true, accept: 'application/pdf,.pdf', exts: ['pdf'], extLabel: 'PDF', maxMB: 20, emptyMsg: 'Tải lên tệp bài dự thi (PDF)' }),
};
const CATEGORY_OPTS = [
  { v: 'tech', n: 'Công nghệ & AI', d: 'Giải pháp ứng dụng công nghệ cho đời sống, học tập, y tế', meta: 'Còn 120 suất' },
  { v: 'env', n: 'Môi trường & Đô thị', d: 'Sống xanh, giao thông, nước sạch, rác thải', meta: 'Còn 64 suất' },
  { v: 'edu', n: 'Giáo dục & Cộng đồng', d: 'Học tập suốt đời, hỗ trợ vùng khó khăn', meta: 'Còn 87 suất' },
];

/* ---------- Thành phần danh sách thành viên đội (T2) ---------- */
function teamWidget(box, o) {
  let members = (o.members || []).map((m) => ({ ...m, k: uid('m') }));
  const form = makeForm();
  const draw = () => {
    form.ctls.length = 0;
    const n = members.length + 1;
    box.innerHTML = `<p class="team-count" aria-live="polite">${ic('users', 16)}<span><b>${n}/${o.max}</b> thành viên · tối thiểu ${o.min}</span></p>
      <div class="member"><div class="member-h"><b>Thành viên 1 · Trưởng nhóm (bạn)</b></div><p style="margin:-4px 0 12px;font-size:14.5px">${esc(o.lead.name || 'Người đăng ký')}${o.lead.email ? ` · <span class="muted">${esc(o.lead.email)}</span>` : ''}</p></div>
      ${members.map((m, i) => `<div class="member" data-k="${m.k}"><div class="member-h"><b>Thành viên ${i + 2}</b><button type="button" class="btn btn-ghost btn-sm btn-danger" data-del="${m.k}">${ic('trash', 15)}Xóa<span class="vh"> thành viên ${i + 2}</span></button></div>
        ${fieldHTML(mcfg(m, 'name'))}${fieldHTML(mcfg(m, 'email'))}</div>`).join('')}
      <div id="${o.pre}-undo"></div>
      ${n < o.max ? `<button type="button" class="btn btn-sec" data-add>${ic('plus', 16)}Thêm thành viên</button>` : `<p class="muted" style="font-size:14px">${ic('ok', 15)} Đã đủ ${o.max} thành viên.</p>`}
      <div style="height:16px"></div>`;
    members.forEach((m) => {
      const cn = form.add(mountField({ ...mcfg(m, 'name'), onInput: (c) => { m.name = c.raw(); o.onChange && o.onChange(); } }, box));
      const ce = form.add(mountField({ ...mcfg(m, 'email'), onInput: (c) => { m.email = c.raw(); o.onChange && o.onChange(); }, onChange: (c) => { m.email = c.raw(); o.onChange && o.onChange(); } }, box));
      cn.set(m.name || ''); ce.set(m.email || '');
    });
  };
  const mcfg = (m, f) => (f === 'name'
    ? { id: `${o.pre}-${m.k}-name`, label: 'Họ và tên', required: true, autocomplete: 'off', norm: 'name', v: 'name', emptyMsg: 'Nhập họ và tên thành viên' }
    : { id: `${o.pre}-${m.k}-email`, label: 'Email', hint: 'Để gửi lời mời xác nhận tham gia', required: true, type: 'email', inputmode: 'email', autocomplete: 'off', spellcheck: false, autocapitalize: 'none', norm: 'email', v: 'email', suggest: true, emptyMsg: 'Nhập email thành viên' });
  box.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    const del = e.target.closest('[data-del]');
    if (add) {
      members.push({ k: uid('m'), name: '', email: '' }); draw(); o.onChange && o.onChange();
      const last = members[members.length - 1]; const i = document.getElementById(`${o.pre}-${last.k}-name`); i && i.focus();
      announce(`Đã thêm thành viên ${members.length + 1}`);
    }
    if (del) {
      const idx = members.findIndex((m) => m.k === del.dataset.del); const gone = members[idx];
      members.splice(idx, 1); draw(); o.onChange && o.onChange();
      const u = document.getElementById(`${o.pre}-undo`);
      const nm = gone.name ? gone.name : `thành viên ${idx + 2}`;
      u.innerHTML = `<div class="f-undo" style="margin-bottom:12px"><span>Đã xóa ${esc(nm)}.</span> <button type="button" class="f-linkbtn" data-undo>Hoàn tác</button></div>`;
      announce(`Đã xóa ${nm}`);
      const btn = u.querySelector('[data-undo]'); btn.focus();
      const kill = setTimeout(() => { u.innerHTML = ''; }, 7000);
      btn.addEventListener('click', () => { clearTimeout(kill); members.splice(idx, 0, gone); draw(); o.onChange && o.onChange(); announce(`Đã khôi phục ${nm}`); });
    }
  });
  draw();
  const cnt = { ctl: { id: `${o.pre}-count`, focusId: () => `${o.pre}-count`, focus: () => { const b = box.querySelector('[data-add]'); b && b.focus(); } } };
  return {
    form,
    get: () => members.map((m) => ({ name: NORM.name(m.name), email: NORM.email(m.email) })),
    validate() {
      const errs = form.validate();
      if (members.length + 1 < o.min) errs.unshift({ ctl: { id: `${o.pre}-add`, focusId: () => `${o.pre}-add`, focus: cnt.ctl.focus }, msg: `Đội cần ít nhất ${o.min} thành viên. Hiện có ${members.length + 1}` });
      return errs;
    },
    by: (id) => form.by(id),
  };
}
