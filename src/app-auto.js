/* ============================================================
   TRANG CHẤM TỰ ĐỘNG
   ============================================================ */
const AZ_UI = { src: 'url', mode: 'render', files: [], filter: 'fail', running: false };
let AZ_LAST = store.get('fx-az-last', null);
/* Chế độ gửi thật: nhớ lựa chọn và thông tin thử trên máy người dùng */
let AZ_SUB = store.get('fx-az-sub', { on: false, name: '', email: '', phone: '', ok: false });
const AZ_PCFG = {
  name: { id: 'azp-name', label: 'Họ và tên dùng để thử', required: false, autocomplete: 'name', autocapitalize: 'words', spellcheck: false, norm: 'name' },
  email: { ...DC.email('azp'), label: 'Email nhận xác nhận', hint: 'Email của bạn, để nhận email xác nhận của form' },
  phone: { ...DC.phone('azp'), label: 'Số điện thoại nhận OTP, SMS', hint: 'Số của bạn. Công cụ dừng lại nếu form đòi mã OTP' },
  ok: { id: 'azp-ok', kind: 'check', label: 'Tôi có quyền kiểm thử form này và đồng ý tạo một hồ sơ thử trên hệ thống của form', required: true, emptyMsg: 'Xác nhận bạn có quyền kiểm thử form này để gửi thật' },
};

/* Kịch bản kiểm thử liên quan tới từng nguyên tắc */
const AZ_TESTS = {};
TESTS.forEach((t, i) => t.r.forEach((id) => { (AZ_TESTS[id] = AZ_TESTS[id] || []).push([t, i + 1]); }));

function viewAuto(main) {
  main.innerHTML = `<div class="view">
    <div class="page-head"><p class="eyebrow">Mới · Review nhanh</p><h1 class="h1">Chấm tự động</h1>
      <p class="lead">Dán đường dẫn trang đăng ký hoặc tải tệp HTML từng bước. Công cụ đọc form và chấm theo ${RULES.length} nguyên tắc: tiêu chí nào máy kiểm được thì kết luận ngay, tiêu chí cần thao tác thì chỉ cách thử tay.</p></div>
    <nav class="subtabs" aria-label="Loại đánh giá"><a href="#cham-tu-dong" aria-current="page">${ic('spark', 16)}Chấm tự động</a><a href="#danh-gia">${ic('check', 16)}Checklist nguyên tắc</a><a href="#kiem-thu">${ic('target', 16)}Kịch bản kiểm thử</a></nav>
    <section class="az-input" aria-labelledby="az-in-h">
      <h2 class="vh" id="az-in-h">Nguồn cần chấm</h2>
      <div class="seg az-src" role="group" aria-label="Nguồn">${[['url', 'link', 'Đường dẫn'], ['file', 'file', 'Tệp HTML'], ['paste', 'quote', 'Dán mã HTML']].map(([k, icn, n]) => `<button type="button" data-azsrc="${k}" aria-pressed="${AZ_UI.src === k}">${ic(icn, 15)}${n}</button>`).join('')}</div>
      <form id="az-form" novalidate>
        <div id="az-sum" hidden></div>
        <div data-azpane="url" ${AZ_UI.src === 'url' ? '' : 'hidden'}>
          ${fieldHTML({ id: 'az-url', label: 'Đường dẫn trang đăng ký', hint: 'Trang công khai, không cần đăng nhập. Ví dụ: https://tencuocthi.vn/dang-ky', required: true, type: 'url', inputmode: 'url', autocomplete: 'url', spellcheck: false, autocapitalize: 'none', norm: 'url', v: 'url', emptyMsg: 'Nhập đường dẫn trang đăng ký', enterkeyhint: 'go' })}
          <fieldset class="f-field f-fs"><legend class="f-label">Cách đọc trang</legend>
            <div class="f-choices">
              <label class="f-choice" for="az-mode-r"><input type="radio" id="az-mode-r" name="az-mode" value="render" ${AZ_UI.mode === 'render' ? 'checked' : ''}><span>Đầy đủ (khuyến nghị)<span class="f-choice-d">Mở trang như trình duyệt: chạy JavaScript, đo cỡ chữ, vùng chạm, tương phản, bố cục, focus. Mất 15–40 giây.</span></span></label>
              <label class="f-choice" for="az-mode-f"><input type="radio" id="az-mode-f" name="az-mode" value="fetch" ${AZ_UI.mode === 'fetch' ? 'checked' : ''}><span>Nhanh<span class="f-choice-d">Chỉ đọc mã HTML, 2–5 giây. Không thấy form tạo bằng JavaScript.</span></span></label>
            </div></fieldset>
          <div id="az-sub-box" ${AZ_UI.mode === 'render' ? '' : 'hidden'}>
            <fieldset class="f-field f-fs"><legend class="f-label">Khi tới bước phải gửi dữ liệu lên máy chủ</legend>
              <div class="f-choices">
                <label class="f-choice" for="az-sub-0"><input type="radio" id="az-sub-0" name="az-sub" value="0" ${AZ_SUB.on ? '' : 'checked'}><span>Dừng lại, không gửi<span class="f-choice-d">An toàn với mọi trang. Chỉ chấm được các bước trước khi gửi dữ liệu.</span></span></label>
                <label class="f-choice" for="az-sub-1"><input type="radio" id="az-sub-1" name="az-sub" value="1" ${AZ_SUB.on ? 'checked' : ''}><span>Gửi thật như người đăng ký<span class="f-choice-d">Đi hết các bước tới trang xác nhận và chấm cả trang xác nhận. Tạo một hồ sơ thử thật trên hệ thống của form. Dừng trước bước thanh toán, OTP và CAPTCHA. Mất 30–100 giây.</span></span></label>
              </div></fieldset>
            <div class="az-profile" id="az-profile" ${AZ_SUB.on ? '' : 'hidden'}>
              <p class="az-profile-h">${ic('info', 16)}<span>Thông tin dùng để đăng ký thử, chỉ lưu trên máy của bạn. Mỗi lần chấm tạo một hồ sơ; nếu form không cho đăng ký trùng email, lần sau dùng dạng <b>ten+2@gmail.com</b>. Nhớ xóa hồ sơ thử trong trang quản trị.</span></p>
              ${fieldHTML(AZ_PCFG.name)}${fieldHTML(AZ_PCFG.email)}${fieldHTML(AZ_PCFG.phone)}${fieldHTML(AZ_PCFG.ok)}
            </div>
          </div>
        </div>
        <div data-azpane="file" ${AZ_UI.src === 'file' ? '' : 'hidden'}>
          <div class="f-field" id="fw-az-files"><label class="f-label" for="az-files">Tệp HTML của luồng đăng ký</label>
            <p class="f-hint" id="az-files-hint">Mỗi tệp là một bước, theo thứ tự chọn. Trong Chrome: mở từng bước, nhấn Ctrl+S (⌘+S), chọn "Trang web, chỉ HTML" hoặc "Trang web, một tệp duy nhất" (.mhtml).</p>
            ${errP('az-files')}
            <div class="f-file"><input type="file" class="f-file-in" id="az-files" accept=".html,.htm,.mhtml,.mht,text/html" multiple aria-describedby="az-files-hint"><div class="f-drop" id="az-drop"><span class="f-drop-ic" aria-hidden="true">${ic('upload', 22)}</span><span class="f-drop-t"><span class="only-fine">Kéo thả tệp vào đây hoặc</span></span><label class="btn btn-sec btn-sm f-file-btn" for="az-files">Chọn tệp</label></div></div>
            <ol class="az-filelist" id="az-filelist"></ol>
          </div>
        </div>
        <div data-azpane="paste" ${AZ_UI.src === 'paste' ? '' : 'hidden'}>
          <div class="f-field" id="fw-az-paste"><label class="f-label" for="az-paste">Mã HTML</label><p class="f-hint" id="az-paste-hint">Trong DevTools: chuột phải vào thẻ &lt;form&gt; hoặc &lt;body&gt; → Copy → Copy outerHTML, rồi dán vào đây.</p>${errP('az-paste')}
            <textarea class="f-input f-textarea az-paste" id="az-paste" spellcheck="false" aria-describedby="az-paste-hint" placeholder="<form> … </form>"></textarea></div>
        </div>
        <div class="btn-row"><button type="submit" class="btn btn-pri" id="az-go">${ic('spark', 17)}Chấm điểm</button>
          <span class="muted" style="font-size:13.5px">Thử nhanh:</span><button type="button" class="try-chip" data-azsample="bad">Form ví dụ có nhiều lỗi</button><button type="button" class="try-chip" data-azsample="good">Form mẫu của bộ chuẩn</button><button type="button" class="try-chip" data-azsample="flow">Luồng 3 bước (chạy thật)</button></div>
      </form>
      <div class="az-progress" id="az-progress" hidden aria-live="polite"></div>
    </section>
    <div id="az-report">${AZ_LAST ? '' : azEmptyHTML()}</div>
  </div>`;
  const urlCtl = mountField({ id: 'az-url', label: 'Đường dẫn trang đăng ký', required: true, type: 'url', norm: 'url', v: 'url', emptyMsg: 'Nhập đường dẫn trang đăng ký' }, main);
  if (AZ_UI.lastUrl) urlCtl.set(AZ_UI.lastUrl);
  AZ_UI.p = { name: mountField(AZ_PCFG.name, main), email: mountField(AZ_PCFG.email, main), phone: mountField(AZ_PCFG.phone, main), ok: mountField(AZ_PCFG.ok, main) };
  AZ_UI.p.name.set(AZ_SUB.name || 'Nguyễn Văn Kiểm Thử'); if (AZ_SUB.email) AZ_UI.p.email.set(AZ_SUB.email); if (AZ_SUB.phone) AZ_UI.p.phone.set(AZ_SUB.phone);
  if (AZ_SUB.ok) { const cb = $('#azp-ok', main); if (cb) cb.checked = true; }
  $$('input[name="az-sub"]', main).forEach((r) => r.addEventListener('change', () => { AZ_SUB.on = r.value === '1'; $('#az-profile', main).hidden = !AZ_SUB.on; store.set('fx-az-sub', AZ_SUB); }));
  $$('[data-azsrc]', main).forEach((b) => b.addEventListener('click', () => {
    AZ_UI.src = b.dataset.azsrc;
    $$('[data-azsrc]', main).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $$('[data-azpane]', main).forEach((p) => { p.hidden = p.dataset.azpane !== AZ_UI.src; });
    $('#az-sum').hidden = true;
  }));
  $$('input[name="az-mode"]', main).forEach((r) => r.addEventListener('change', () => { AZ_UI.mode = r.value; $('#az-sub-box', main).hidden = AZ_UI.mode !== 'render'; }));
  const fin = $('#az-files', main), drop = $('#az-drop', main);
  const addFiles = (list) => { Array.from(list).forEach((f) => { if (!AZ_UI.files.some((x) => x.name === f.name && x.size === f.size)) AZ_UI.files.push(f); }); drawFiles(); fin.value = ''; };
  fin.addEventListener('change', () => addFiles(fin.files));
  ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', (e) => e.dataTransfer && addFiles(e.dataTransfer.files));
  const drawFiles = () => {
    $('#az-filelist').innerHTML = AZ_UI.files.map((f, i) => `<li><span class="rid">Bước ${i + 1}</span><span class="az-fn">${esc(f.name)}</span><span class="muted">${fmtMB(f.size)}</span><button type="button" class="btn btn-ghost btn-sm" data-azup="${i}" ${i ? '' : 'disabled'} aria-label="Đưa ${esc(f.name)} lên trước">${ic('left', 14, 'rot90')}</button><button type="button" class="btn btn-ghost btn-sm btn-danger" data-azdel="${i}">Xóa<span class="vh"> ${esc(f.name)}</span></button></li>`).join('');
    if (AZ_UI.files.length) clearErr({ id: 'az-files', el: $('#fw-az-files'), inputs: () => [fin] });
  };
  $('#az-filelist').addEventListener('click', (e) => {
    const d = e.target.closest('[data-azdel]'), u = e.target.closest('[data-azup]');
    if (d) { AZ_UI.files.splice(+d.dataset.azdel, 1); drawFiles(); }
    if (u) { const i = +u.dataset.azup; [AZ_UI.files[i - 1], AZ_UI.files[i]] = [AZ_UI.files[i], AZ_UI.files[i - 1]]; drawFiles(); }
  });
  drawFiles();
  $('#az-form', main).addEventListener('submit', (e) => { e.preventDefault(); azRun(urlCtl); });
  $$('[data-azsample]', main).forEach((b) => b.addEventListener('click', () => azRunSample(b.dataset.azsample)));
  if (AZ_LAST) azDrawReport(AZ_LAST);
}
function azEmptyHTML() {
  return `<div class="az-empty"><div class="az-empty-ic">${ic('spark', 26)}</div><div><b>Chưa có báo cáo</b><p>Dán đường dẫn ở trên, hoặc bấm "Form ví dụ có nhiều lỗi" để xem một báo cáo mẫu. Kết quả gồm: tiêu chí đạt, chưa đạt kèm bằng chứng, danh sách trường đã đọc được, và các bước cần thử tay.</p></div></div>`;
}

/* ---------- Chạy ---------- */
function azProgress(steps, cur) {
  const p = $('#az-progress'); if (!p) return;
  p.hidden = false;
  p.innerHTML = `<ol class="az-steps">${steps.map((s, i) => `<li class="${i < cur ? 'done' : i === cur ? 'cur' : ''}">${i < cur ? ic('ok', 16) : i === cur ? '<span class="spin" aria-hidden="true"></span>' : '<span class="az-dot"></span>'}<span>${esc(s)}</span></li>`).join('')}</ol>`;
}
async function azCall(path, url, extra) {
  const r = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url, ...(extra || {}) }) });
  let j = null;
  try { j = await r.json(); } catch (e) { j = null; }
  if (!j) throw Object.assign(new Error('Dịch vụ đọc trang chưa sẵn sàng ở bản này. Hãy dùng "Tệp HTML" hoặc "Dán mã HTML".'), { noApi: true });
  if (!j.ok) throw Object.assign(new Error(j.error || 'Không đọc được trang'), { fallback: j.fallback });
  return j;
}
async function azRun(urlCtl) {
  if (AZ_UI.running) return;
  const sum = $('#az-sum');
  sum.hidden = true;
  try {
    if (AZ_UI.src === 'url') {
      const m = urlCtl.validate(true);
      if (m) { urlCtl.focus(); return; }
      const url = urlCtl.norm(); AZ_UI.lastUrl = url;
      let extra = null;
      if (AZ_UI.mode === 'render' && AZ_SUB.on && AZ_UI.p) {
        const bad = ['email', 'phone', 'ok'].map((k) => AZ_UI.p[k]).filter((c) => c.validate(true));
        if (bad.length) { bad[0].focus(); return; }
        AZ_SUB = { on: true, name: AZ_UI.p.name.get() || 'Nguyễn Văn Kiểm Thử', email: AZ_UI.p.email.get(), phone: AZ_UI.p.phone.get(), ok: true };
        store.set('fx-az-sub', AZ_SUB);
        extra = { submit: true, profile: { name: AZ_SUB.name, email: AZ_SUB.email, phone: AZ_SUB.phone } };
      }
      azBusy(true);
      await azRunUrl(url, AZ_UI.mode, extra);
    } else if (AZ_UI.src === 'file') {
      const ctl = { id: 'az-files', el: $('#fw-az-files'), inputs: () => [$('#az-files')] };
      if (!AZ_UI.files.length) { setErr(ctl, 'Chọn ít nhất một tệp HTML'); $('#az-files').focus(); return; }
      const bad = AZ_UI.files.find((f) => !/\.(html?|mhtml?|mht)$/i.test(f.name));
      if (bad) { setErr(ctl, `Tệp "${bad.name}" không phải HTML. Hãy lưu trang dạng .html hoặc .mhtml`); return; }
      const big = AZ_UI.files.find((f) => f.size > 15 * 1024 * 1024);
      if (big) { setErr(ctl, `Tệp "${big.name}" có dung lượng ${fmtMB(big.size)}, vượt giới hạn 15 MB`); return; }
      azBusy(true);
      azProgress([`Đọc ${AZ_UI.files.length} tệp`, `Chấm ${RULES.length} tiêu chí cho từng trường`], 0);
      const pages = [];
      for (const f of AZ_UI.files) {
        let txt = await f.text();
        if (/\.mht/i.test(f.name) || /^MIME-Version:/i.test(txt.slice(0, 200))) txt = azFromMhtml(txt);
        pages.push(azAnalyzePage(txt, { multi: AZ_UI.files.length > 1, preview: true }));
      }
      azFinish(pages, { kind: 'file', files: AZ_UI.files.map((f) => f.name), mode: 'static' });
    } else {
      const ta = $('#az-paste'), ctl = { id: 'az-paste', el: $('#fw-az-paste'), inputs: () => [ta] };
      const v = ta.value.trim();
      if (!v) { setErr(ctl, 'Dán mã HTML của form vào ô'); ta.focus(); return; }
      if (!/<(form|input|select|textarea|button)\b/i.test(v)) { setErr(ctl, 'Không thấy thẻ form, input, select hay textarea trong mã đã dán'); ta.focus(); return; }
      clearErr(ctl);
      azBusy(true);
      azFinish([azAnalyzePage(v, { preview: true })], { kind: 'paste', mode: 'static' });
    }
  } catch (e) {
    azFail(e);
  } finally { azBusy(false); }
}
function azBusy(on) {
  AZ_UI.running = on;
  const go = $('#az-go'); if (!go) return;
  go.disabled = on; go.innerHTML = on ? `<span class="spin" aria-hidden="true"></span>Đang chấm…` : `${ic('spark', 17)}Chấm điểm`;
  $$('[data-azsample]').forEach((b) => { b.disabled = on; });
}
function azFail(e) {
  const p = $('#az-progress'); if (p) p.hidden = true;
  const sum = $('#az-sum'); if (!sum) return;
  sum.innerHTML = `<div class="f-banner err" role="alert">${ic('alert', 20)}<div><b>${esc(e.message)}</b>${AZ_UI.src === 'url' && !e.noApi ? 'Bạn có thể lưu trang thành tệp HTML (Ctrl+S) rồi dùng mục "Tệp HTML".' : ''}</div></div>`;
  sum.hidden = false;
}
async function azRunUrl(url, mode, extra) {
  let data = null, note = '';
  const sub = !!(extra && extra.submit);
  if (mode === 'render') {
    const steps = sub ? ['Mở trang, chờ form hiện ra', 'Điền thông tin thử, đi qua từng bước và gửi hồ sơ thật', 'Đo cỡ chữ, vùng chạm, tương phản; chụp từng bước và trang xác nhận', `Chấm ${RULES.length} tiêu chí cho từng trường`]
      : ['Mở trang, chờ form hiện ra', 'Đi qua từng bước: điền dữ liệu thử, bấm Tiếp (không gửi thật)', 'Đo cỡ chữ, vùng chạm, tương phản; chụp từng bước', `Chấm ${RULES.length} tiêu chí cho từng trường`];
    azProgress(steps, 0);
    const t1 = setTimeout(() => azProgress(steps, 1), 6000), t2 = setTimeout(() => azProgress(steps, 2), sub ? 40000 : 18000);
    try { data = await azCall('/api/render', url, extra); }
    catch (e) {
      if (e.noApi || !e.fallback) throw e;
      note = 'Không mở được trang bằng trình duyệt ẩn, đã chuyển sang đọc HTML (chế độ Nhanh).';
    } finally { clearTimeout(t1); clearTimeout(t2); }
    azProgress(steps, 3);
  }
  if (!data) {
    azProgress(['Đọc mã HTML của trang', `Chấm ${RULES.length} tiêu chí cho từng trường`], 0);
    data = await azCall('/api/fetch', url);
    azProgress(['Đọc mã HTML của trang', `Chấm ${RULES.length} tiêu chí cho từng trường`], 1);
  }
  await new Promise((r) => setTimeout(r, 30));
  const notes = [note, data.note].filter(Boolean).join(' ');
  if (data.steps && data.steps.length) {
    const forms = data.steps.filter((x) => x.kind !== 'landing').length;
    const probeAt = data.steps.findIndex((x) => x.kind === 'form');
    const pages = data.steps.map((x, i) => azAnalyzePage(x.html, { metrics: x.metrics, url: x.url, status: i === 0 ? data.status : 0, multi: forms > 1, probe: i === probeAt ? data.probe : null, done: x.kind === 'done', success: x.success, profile: sub ? extra.profile : null }));
    azFinish(pages, {
      kind: 'url', url: data.finalUrl, mode: 'render', ms: data.ms, truncated: data.truncated, note: notes, stop: data.stop, submit: sub, submitted: !!data.submitted, email: sub ? extra.profile.email : '',
      probe: data.probe ? { clicked: data.probe.clicked, n: (data.probe.errors || []).length, advanced: !!data.probe.advanced, summary: !!data.probe.summary, native: (data.probe.native || []).length, dialogs: (data.probe.dialogs || []).length } : null,
      steps: data.steps.map((x) => ({ kind: x.kind, url: x.url, heading: x.heading, title: x.title, shot: x.shot, shotW: x.shotW, shotH: x.shotH })),
    });
  } else {
    azFinish([azAnalyzePage(data.html, { url: data.finalUrl, status: data.status, preview: true })], { kind: 'url', url: data.finalUrl, mode: data.mode, ms: data.ms, truncated: data.truncated, note: notes });
  }
}
async function azRunSample(which) {
  if (AZ_UI.running) return;
  if (which === 'flow') {
    azBusy(true);
    const extra = AZ_SUB.on && AZ_SUB.ok && AZ_SUB.email && AZ_SUB.phone ? { submit: true, profile: { name: AZ_SUB.name || 'Nguyễn Văn Kiểm Thử', email: AZ_SUB.email, phone: AZ_SUB.phone } } : null;
    try { await azRunUrl(location.origin + '/samples/landing', 'render', extra); } catch (e) { azFail(e); } finally { azBusy(false); }
    return;
  }
  let html, meta;
  if (which === 'bad') { html = SAMPLE_BAD_HTML; meta = { kind: 'sample', sample: 'Form ví dụ có nhiều lỗi', mode: 'static' }; }
  else { html = azGoodSample(); meta = { kind: 'sample', sample: 'Form mẫu của bộ chuẩn', mode: 'static' }; }
  azFinish([azAnalyzePage(html, { preview: true })], meta);
}
function azGoodSample() {
  const cfgs = [DC.name('gs'), DC.dob('gs'), DC.email('gs', true), DC.phone('gs'), DC.province('gs'), DC.school('gs'), DC.category('gs'), DC.mode('gs'), DC.desc('gs'), DC.photo('gs'), DC.entry('gs'),
    { id: 'gs-agree', kind: 'check', label: 'Tôi đã đọc và đồng ý với Thể lệ cuộc thi', required: true }, { id: 'gs-news', kind: 'check', label: 'Tôi muốn nhận tin về các cuộc thi tiếp theo', required: false }];
  return `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Đăng ký dự thi</title></head><body>
    <p>Mất khoảng 8 phút. Bạn cần chuẩn bị ảnh chân dung và bài dự thi (PDF). Hạn chót: 23:59, 30/11/2026 (giờ Việt Nam).</p>
    <p>Bước 1/4 · Thông tin thí sinh</p><p>Các trường có dấu * là bắt buộc.</p>
    <form><fieldset><legend>Thông tin thí sinh</legend>${cfgs.map(fieldHTML).join('')}</fieldset>
    <a href="/chinh-sach-bao-mat">Chính sách bảo mật</a><p>Cần hỗ trợ? hotro@example.com</p>
    <button type="submit">Gửi hồ sơ đăng ký</button></form></body></html>`;
}
const AZ_IFRAME_FORM = /docs\.google\.com\/forms|forms\.gle|typeform|jotform|surveymonkey|form(stack|site|assembly)|\/forms?\//i;
const AZ_IFRAME_SKIP = /recaptcha|hcaptcha|captcha|turnstile|doubleclick|googletagmanager|googlesyndication|youtube|vimeo|facebook\.com\/plugins|maps/i;
function azFinish(pages, meta) {
  const ms = meta.steps || [];
  const R = azMerge(pages, azStepLabels(pages.map((p, i) => ({ kind: (ms[i] || {}).kind || 'form' }))));
  let gn = 0;
  const steps = pages.map((p, i) => {
    const m = ms[i] || {};
    return {
      n: i + 1, kind: m.kind || 'form', heading: m.heading || '', title: p.info.title || m.title || '', url: m.url || '',
      shot: m.shot || '', shotW: m.shotW || 390, shotH: m.shotH || 0, preview: m.shot ? '' : (p.info.preview || ''),
      /* Trang không có ô nhập vẫn có tiêu chí riêng: trang giới thiệu (chuẩn bị, hạn chót, liên hệ), trang xác nhận (K1–K3, P3) */
      checks: (m.kind === 'done' ? ['K1', 'K2', 'K3', 'P3'] : m.kind === 'landing' ? ['F1', 'D5', 'P2', 'T4'] : []).map((id) => ({ id, ...(p.R[id] || {}) })).filter((c) => c.st && c.st !== 'na'),
      fields: p.info.fields.map((f) => ({
        gn: ++gn, n: f.n, name: azCut(f.label ? azLabText(f) : azName(f), 48), kind: AZ_KIND[f.kind] || f.kind, type: f.tag === 'input' ? f.type : f.tag === 'select' ? 'select' : f.tag,
        im: f.im, ac: f.ac, req: f.req, rect: azFieldRect(f), code: azFixCode(f), errs: (f.errTexts || []).slice(0, 2),
        probs: f.probs.slice().sort((a, b) => AZ_ST[a.st].o - AZ_ST[b.st].o || RULES.indexOf(RULE_BY_ID[a.id]) - RULES.indexOf(RULE_BY_ID[b.id])),
      })),
    };
  });
  const fields = steps.flatMap((s) => s.fields.map((f) => ({ step: steps.length > 1 ? s.n : 0, n: f.gn, kind: f.kind, type: f.type, im: f.im, ac: f.ac, req: f.req, issues: f.probs.map((x) => x.id) })));
  const info = {
    title: (pages.find((p, i) => steps[i].kind !== 'landing') || pages[0]).info.title, N: fields.length, forms: pages.reduce((a, p) => a + p.info.forms, 0), steps: pages.length,
    formSteps: steps.filter((s) => s.kind !== 'landing').length, blocked: pages.some((p) => p.info.blocked), closed: (pages.find((p) => p.info.closed) || { info: {} }).info.closed || '', http: pages[0].info.httpStatus || 0, vi: pages.some((p) => p.info.vi),
    iframes: meta.mode === 'render' ? [] : pages.flatMap((p) => p.info.iframes).filter((x) => AZ_IFRAME_FORM.test(x) && !AZ_IFRAME_SKIP.test(x)).slice(0, 3),
  };
  /* Vị trí từng tiêu chí trên ảnh: ô bị gắn lỗi + nút (V6, B1…) do bộ chấm ghi lại */
  const locs = {};
  steps.forEach((x, si) => {
    x.fields.forEach((f) => f.probs.forEach((pb) => { if (f.rect) (locs[pb.id] = locs[pb.id] || []).push({ s: si, r: f.rect, gn: f.gn, name: f.name }); }));
    RULES.forEach((r) => { const at = (pages[si].R[r.id] || {}).at; if (at) at.forEach((rc) => (locs[r.id] = locs[r.id] || []).push({ s: si, r: rc, name: 'nút bấm' })); });
  });
  /* Gửi thật: máy chủ trả lỗi hay không phản hồi → chấm V8 */
  if (meta.stop && ['server', 'noreply'].includes(meta.stop.kind)) {
    const errs = meta.stop.errors || [];
    const gen = errs.some((e) => /co loi|loi xay ra|error|that bai|khong thanh cong|thu lai sau|something went wrong/.test(fold(e)) && e.length < 60);
    R.V8 = !errs.length ? { st: 'fail', msg: `Bấm "${meta.stop.text}" xong không có phản hồi trong 14 giây: không chuyển trang, không báo lỗi.`, ev: [] }
      : { st: gen ? 'fail' : 'pass', msg: gen ? 'Máy chủ từ chối hồ sơ thử bằng câu lỗi chung chung, không nói cách xử lý.' : 'Máy chủ từ chối hồ sơ thử và nói rõ lý do.', ev: errs.map((e) => `"${azCut(e, 90)}"`) };
  }
  const rep = { v: 3, R, fields, steps, locs, info, meta: { ...meta, steps: undefined, ts: Date.now() } };
  AZ_LAST = rep;
  azSave(rep);
  AZ_UI.filter = Object.values(R).some((x) => x.st === 'fail') ? 'fail' : 'all';
  const p = $('#az-progress'); if (p) p.hidden = true;
  azDrawReport(rep);
  const h = $('#az-rep-h'); if (h) { h.focus({ preventScroll: true }); h.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  const s = azSummary(R);
  announce(`Đã chấm xong ${fields.length} trường: ${s.fail} tiêu chí chưa đạt, ${s.warn} cần xem lại, ${s.pass} đạt`);
}
/* Lưu báo cáo gần nhất: bỏ bản xem trước (HTML lớn); ảnh chụp chỉ giữ khi còn nhỏ */
function azSave(rep) {
  try {
    const slim = JSON.parse(JSON.stringify(rep, (k, v) => (k === 'preview' ? undefined : v)));
    if (JSON.stringify(slim).length > 2400000) slim.steps.forEach((x) => { x.shot = ''; });
    slim.meta.saved = true;
    store.set('fx-az-last', slim);
  } catch (e) { /* bỏ qua */ }
}

/* ---------- Báo cáo ---------- */
const AZ_STOP = {
  submit: (x, m) => ({ ok: true, act: !m.submit, t: `Đã đọc hết các bước, dừng ở nút "${x.text}"`, d: `Chế độ an toàn nên công cụ không bấm gửi${x.off ? '. Nút này đang bị khóa sẵn (xem V6)' : ''}. Muốn chấm cả trang xác nhận, chấm lại ở chế độ "Gửi thật như người đăng ký".` }),
  end: () => ({ ok: true, t: 'Đã đọc hết các bước hiển thị', d: 'Không thấy nút sang bước tiếp theo.' }),
  post: (x, m) => ({ ok: false, act: !m.submit, t: `Dừng ở nút "${x.text}": bước sau cần gửi dữ liệu lên máy chủ`, d: 'Chế độ an toàn nên công cụ dừng lại, không tạo hồ sơ. Muốn đi hết luồng tới trang xác nhận, chấm lại ở chế độ "Gửi thật như người đăng ký".' }),
  invalid: (x) => ({ ok: false, t: `Dừng ở nút "${x.text}": form không nhận dữ liệu thử`, d: `${x.off ? 'Nút vẫn bị khóa sau khi điền dữ liệu thử.' : x.errors && x.errors.length ? `Form báo: ${x.errors.map((e) => `"${azCut(e, 60)}"`).join(', ')}.` : ''} Các bước sau chưa đọc được: lưu từng bước thành tệp HTML để chấm tiếp.` }),
  nochange: (x) => ({ ok: false, t: `Bấm "${x.text || 'Tiếp'}" nhưng trang không đổi`, d: 'Các bước sau chưa đọc được: lưu từng bước thành tệp HTML để chấm tiếp.' }),
  time: () => ({ ok: false, t: 'Hết thời gian cho phép', d: 'Các bước sau chưa đọc được: lưu từng bước thành tệp HTML để chấm tiếp.' }),
  limit: () => ({ ok: false, t: 'Đã đọc số bước tối đa', d: 'Nếu form còn bước sau, lưu các bước đó thành tệp HTML để chấm tiếp.' }),
  nofields: () => ({ ok: false, t: 'Không tìm thấy ô nhập nào', d: '' }),
  done: (x, m) => ({ ok: true, t: 'Đã đăng ký thành công, tới trang xác nhận', d: `Hồ sơ thử đã được gửi bằng email ${m.email || ''}${x.success ? `; trang báo "${azCut(x.success, 90)}"` : ''}. Kiểm tra hộp thư để chấm email xác nhận (K2), rồi xóa hồ sơ thử trong trang quản trị.` }),
  payment: (x) => ({ ok: false, t: `Dừng trước bước thanh toán${x.text ? ` (nút "${x.text}")` : ''}`, d: `Công cụ không thanh toán${x.gateway ? `; trang đã chuyển sang cổng ${x.gateway}` : ''}. Hồ sơ có thể đã được tạo ở trạng thái chờ thanh toán — nhớ xóa trong trang quản trị.` }),
  captcha: (x) => ({ ok: false, t: `Dừng ở CAPTCHA trước nút "${x.text}"`, d: 'Công cụ không vượt CAPTCHA. Tắt CAPTCHA trên bản thử nghiệm rồi chấm lại, hoặc thử tay bước cuối. CAPTCHA giải đố cũng là lỗi tiếp cận (A5).' }),
  otp: () => ({ ok: false, t: 'Dừng ở bước nhập mã OTP', d: 'Mã đã được gửi tới số điện thoại hoặc email bạn nhập. Công cụ không đọc được tin nhắn nên dừng ở đây; hãy thử tay bước này.' }),
  server: (x) => ({ ok: false, t: `Bấm "${x.text}": máy chủ từ chối hồ sơ thử`, d: x.errors && x.errors.length ? `Trang báo: ${x.errors.map((e) => `"${azCut(e, 80)}"`).join(', ')}.` : '' }),
  noreply: (x) => ({ ok: false, t: `Bấm "${x.text}" nhưng không có phản hồi trong 14 giây`, d: 'Không chuyển trang, không báo lỗi, không báo thành công (xem V8).' }),
};
const azWorst = (f) => (f.probs && f.probs.length ? f.probs[0].st : 'pass');
function azStepLabels(steps) { let k = 0; return steps.map((x) => (x.kind === 'landing' ? 'Trang giới thiệu' : x.kind === 'done' ? 'Trang xác nhận' : x.kind === 'page' ? 'Trang tiếp theo' : `Bước ${++k}`)); }
function azFlowHTML(rep) {
  const { meta, steps } = rep;
  const labels = azStepLabels(steps);
  const st = meta.stop ? (AZ_STOP[meta.stop.kind] || AZ_STOP.end)(meta.stop, meta) : null;
  const pr = meta.probe;
  const prLine = pr ? (pr.advanced ? `Đã thử bấm "${pr.clicked}" khi để trống: form vẫn chuyển bước.` : `Đã thử bấm "${pr.clicked}" khi để trống: ${pr.dialogs ? 'form báo lỗi bằng hộp thoại của trình duyệt' : pr.n ? `form hiện ${pr.n} câu lỗi${pr.summary ? ', có tóm tắt lỗi' : ', không có tóm tắt lỗi'}` : pr.native ? 'chỉ có bong bóng báo lỗi của trình duyệt' : 'không thấy báo lỗi'}.`) : '';
  if (!rep.info.N || (steps.length < 2 && !st && !prLine)) return '';
  return `<div class="az-flow ${st && !st.ok ? 'part' : 'ok'}">
    ${st ? `<p class="az-flow-h">${ic(st.ok ? 'ok' : 'alert', 18)}<span><b>${esc(st.t)}</b>${st.d ? ` ${esc(st.d)}` : ''}</span></p>${st.act ? `<div class="btn-row"><button type="button" class="btn btn-sec btn-sm" data-azresub>${ic('spark', 15)}Chấm lại ở chế độ gửi thật</button></div>` : ''}` : ''}
    <ol class="az-flow-steps">${steps.map((x, i) => { const bad = x.fields.filter((f) => ['fail', 'warn'].includes(azWorst(f))).length; return `<li><button type="button" data-azstep="${x.n}"><b>${labels[i]}</b><span>${x.kind === 'landing' && !x.fields.length ? 'không có ô nhập' : `${x.fields.length} trường${bad ? ` · ${bad} cần sửa` : ''}`}</span></button></li>`; }).join('')}${st && !st.ok ? `<li class="az-flow-stop">${ic('x', 14)}Chưa đọc được</li>` : ''}</ol>
    ${prLine ? `<p class="az-flow-d">${ic('target', 14)}<span>${esc(prLine)} ${meta.submit ? `Lần bấm thử này không gửi gì; sau đó công cụ điền thông tin của bạn (${esc(meta.email || '')}) và gửi thật.` : 'Từ lúc này công cụ chặn mọi yêu cầu gửi dữ liệu, dùng email @example.com.'}</span></p>` : ''}
  </div>`;
}
function azDrawReport(rep) {
  const box = $('#az-report'); if (!box) return;
  const { R, info, meta } = rep;
  const s = azSummary(R);
  const verdict = !info.N && info.blocked ? { k: 'none', ic: 'alert', t: 'Trang chặn trình duyệt tự động', d: `Website trả về màn hình chống bot/CAPTCHA${info.http ? ` (mã ${info.http})` : ''} nên máy không thấy form. Mở trang bằng trình duyệt của bạn, lưu thành tệp (Ctrl+S, chọn "Trang web, toàn bộ" hoặc .mhtml) rồi dùng mục "Tệp HTML".` }
    : !info.N && info.closed ? { k: 'none', ic: 'clock', t: 'Form đã đóng, không còn nhận đăng ký', d: `Trang hiển thị: "${info.closed}". Không còn ô nhập nào để chấm. Muốn chấm, hãy mở lại form tạm thời hoặc chấm một bản sao.` }
    : !info.N && info.http ? { k: 'none', ic: 'alert', t: `Trang trả về lỗi ${info.http}`, d: info.http === 404 ? 'Không tìm thấy trang. Kiểm tra lại đường dẫn.' : info.http === 401 || info.http === 403 ? 'Trang cần đăng nhập hoặc không cho truy cập từ bên ngoài. Hãy lưu trang thành tệp HTML rồi tải lên.' : 'Máy chủ của trang đang lỗi. Thử lại sau, hoặc lưu trang thành tệp HTML rồi tải lên.' }
    : !info.N ? { k: 'none', ic: 'info', t: 'Không tìm thấy trường nhập liệu nào', d: info.blocked ? 'Trang trả về màn hình chống bot hoặc yêu cầu xác minh. Hãy lưu trang thành tệp HTML rồi tải lên.' : 'Form có thể được tạo bằng JavaScript (thử chế độ Đầy đủ), nằm trong iframe, hoặc cần đăng nhập. Bạn cũng có thể lưu trang thành tệp HTML rồi tải lên.' }
      : s.mustFail ? { k: 'bad', ic: 'alert', t: `Chưa đạt chuẩn: ${s.mustFail} tiêu chí Bắt buộc chưa đạt`, d: 'Sửa các mục "Chưa đạt" mức Bắt buộc trước khi ra mắt.' }
        : s.fail ? { k: 'mid', ic: 'clock', t: 'Đạt mức tối thiểu, còn mục cần sửa', d: `${s.fail} tiêu chí mức Nên/Cân nhắc chưa đạt.` }
          : { k: 'good', ic: 'ok', t: 'Không phát hiện lỗi tự động', d: 'Tiếp tục thử tay các tiêu chí còn lại để kết luận.' };
  const src = meta.kind === 'url' ? `<a href="${esc(meta.url)}" target="_blank" rel="noopener">${esc(azCut(meta.url, 70))}</a>` : meta.kind === 'file' ? esc(meta.files.join(' → ')) : meta.kind === 'sample' ? esc(meta.sample) : 'Mã HTML đã dán';
  const modeN = { render: 'Đầy đủ · trình duyệt ẩn', fetch: 'Nhanh · đọc HTML', static: 'Đọc HTML' }[meta.mode] || '';
  const notes = [];
  if (meta.note) notes.push(meta.note);
  if (meta.truncated) notes.push('Trang quá lớn, chỉ phân tích phần đầu.');
  if (info.N && info.vi === false) notes.push('Trang không viết bằng tiếng Việt. Các tiêu chí câu chữ (nhãn, thông báo lỗi, viết hoa) được soạn cho tiếng Việt nên chỉ mang tính tham khảo.');
  if (info.N && info.http) notes.push(`Trang trả về mã lỗi ${info.http}. Kiểm tra đây có đúng là trang form cần chấm không.`);
  if (info.iframes && info.iframes.length) notes.push(`Trang nhúng form từ nơi khác (${info.iframes.map((x) => azCut(x, 50)).join(', ')}). Dùng chế độ Đầy đủ để công cụ tự mở khung đó, hoặc chấm trực tiếp đường dẫn đó.`);
  if (meta.mode !== 'render' && info.N) notes.push('Chế độ đọc HTML không đo được cỡ chữ, vùng chạm, tương phản, focus, bố cục cột và không thử bấm gửi — các tiêu chí đó được đánh dấu "Cần thử tay".');
  const hasSteps = !!(rep.steps && rep.steps.length);
  const view = hasSteps ? AZ_UI.view || 'fields' : 'rules';
  AZ_UI.view = view;
  box.innerHTML = `<section class="az-rep" aria-labelledby="az-rep-h">
    <div class="az-meta">
      <p class="eyebrow">Báo cáo chấm tự động · ${new Date(meta.ts).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
      <h2 class="h2" id="az-rep-h" tabindex="-1">${esc(info.title || 'Trang chưa có tiêu đề')}</h2>
      <p class="az-src">${src}</p>
      <div class="chips"><span class="tag">${ic('field', 14)}${info.N} trường</span>${(info.formSteps || info.steps) > 1 ? `<span class="tag">${ic('layers', 14)}${info.formSteps || info.steps} bước</span>` : ''}${modeN ? `<span class="tag">${ic('eye', 14)}${modeN}</span>` : ''}${meta.ms ? `<span class="tag">${ic('clock', 14)}${(meta.ms / 1000).toFixed(1).replace('.', ',')} giây</span>` : ''}</div>
    </div>
    <div class="au-score az-score">
      <div class="au-verdict ${verdict.k}">${ic(verdict.ic, 24)}<div><b>${esc(verdict.t)}</b><span>${esc(verdict.d)}</span></div></div>
      ${info.N ? `<div class="au-nums az-nums"><div class="au-num err"><b>${s.fail}</b><span>Chưa đạt</span></div><div class="au-num warnn"><b>${s.warn}</b><span>Cần xem lại</span></div><div class="au-num ok"><b>${s.pass}</b><span>Đạt</span></div><div class="au-num"><b>${s.manual}</b><span>Cần thử tay</span></div><div class="au-num"><b>${s.na}</b><span>Không áp dụng</span></div></div>
      <div><div class="au-bar-l"><span>Máy kết luận được ${s.auto + s.na}/${RULES.length} tiêu chí</span><span>${s.auto ? `Điểm tự động ${s.score}/100` : ''}</span></div>
        <div class="meter" aria-hidden="true"><i class="m-err" style="width:${s.fail / RULES.length * 100}%"></i><i class="m-warn" style="width:${s.warn / RULES.length * 100}%"></i><i class="m-ok" style="width:${s.pass / RULES.length * 100}%"></i><i class="m-na" style="width:${s.na / RULES.length * 100}%"></i></div></div>` : ''}
    </div>
    ${notes.length ? `<div class="f-banner info">${ic('info', 20)}<div>${notes.map((n) => `<p>${esc(n)}</p>`).join('')}</div></div>` : ''}
    ${hasSteps ? azFlowHTML(rep) : ''}
    ${info.N ? `<div class="au-actions az-bar">
      ${hasSteps ? `<div class="seg" role="group" aria-label="Cách xem báo cáo" id="az-view">${[['fields', 'field', 'Theo trường'], ['rules', 'list', 'Theo tiêu chí']].map(([k, icn, n]) => `<button type="button" data-azv="${k}" aria-pressed="${view === k}">${ic(icn, 15)}${n}</button>`).join('')}</div>` : '<span></span>'}
      <div class="btn-row" id="az-acts"><button type="button" class="btn btn-pri btn-sm" id="az-import">${ic('check', 15)}Đưa vào checklist</button><button type="button" class="btn btn-sec btn-sm" id="az-md">${ic('copy', 15)}Sao chép báo cáo</button></div></div>
    <div id="az-pane"></div>` : ''}
    <p class="muted az-limit">${ic('info', 15)}<span>Máy chỉ thấy những gì hiển thị và có trong mã trang. Công cụ điền dữ liệu thử để sang bước sau nhưng không bấm gửi và chặn mọi yêu cầu gửi dữ liệu, nên không tạo hồ sơ thật. Hành vi khi tải tệp, lỗi từ máy chủ, trang xác nhận, email phải thử tay — xem <a href="#kiem-thu">Kịch bản kiểm thử</a>.</span></p>
  </section>`;
  if (!info.N) return;
  const rs = $('[data-azresub]', box);
  if (rs) rs.addEventListener('click', () => {
    const r1 = $('#az-sub-1'); if (r1) { r1.checked = true; r1.dispatchEvent(new Event('change')); }
    const mr = $('#az-mode-r'); if (mr && !mr.checked) { mr.checked = true; mr.dispatchEvent(new Event('change')); }
    const pf = $('#az-profile'); if (pf) { pf.scrollIntoView({ behavior: 'smooth', block: 'center' }); const first = ['azp-email', 'azp-phone'].map((id) => $('#' + id)).find((i) => i && !i.value) || $('#azp-ok'); if (first) setTimeout(() => first.focus({ preventScroll: true }), 350); }
    toast('Nhập email, số điện thoại của bạn, đánh dấu xác nhận rồi bấm Chấm điểm');
  });
  $$('[data-azstep]', box).forEach((b) => b.addEventListener('click', () => {
    if (AZ_UI.view !== 'fields') { AZ_UI.view = 'fields'; $$('[data-azv]', box).forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.azv === 'fields'))); azDrawPane(rep); }
    const t = $(`#az-step-${b.dataset.azstep}`); if (t) { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); const h = $('.az-step-h', t); if (h) h.focus({ preventScroll: true }); }
  }));
  const vw = $('#az-view');
  if (vw) vw.addEventListener('click', (e) => { const b = e.target.closest('[data-azv]'); if (!b) return; AZ_UI.view = b.dataset.azv; $$('[data-azv]', vw).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); azDrawPane(rep); });
  $('#az-md').addEventListener('click', () => copyText(azMarkdown(rep), 'Đã sao chép báo cáo chấm tự động'));
  $('#az-import').addEventListener('click', () => azImport(rep));
  azDrawPane(rep);
}
function azDrawPane(rep) {
  const pane = $('#az-pane'); if (!pane) return;
  if (AZ_UI.view === 'fields' && rep.steps) { pane.innerHTML = azFieldsHTML(rep); azWireFields(rep, pane); return; }
  const cnt = (k) => RULES.filter((r) => (rep.R[r.id] || {}).st === k).length;
  pane.innerHTML = `<div class="seg az-filter" role="group" aria-label="Lọc kết quả" id="az-f">${[['fail', 'Chưa đạt'], ['warn', 'Cần xem lại'], ['pass', 'Đạt'], ['manual', 'Cần thử tay'], ['all', 'Tất cả']].map(([k, n]) => `<button type="button" data-azf="${k}" aria-pressed="${AZ_UI.filter === k}">${n} <span class="n">${k === 'all' ? RULES.length : cnt(k)}</span></button>`).join('')}</div>
    <div id="az-list"></div>
    <details class="az-fields"><summary><h3>Các trường đã đọc được (${rep.info.N})</h3>${ic('down', 18, 'chev')}</summary>
      <div class="qp-wrap"><table class="qp-table"><thead><tr><th scope="col">#</th><th scope="col">Nhãn</th><th scope="col">Nhận diện</th><th scope="col">type · inputmode</th><th scope="col">autocomplete</th><th scope="col">Bắt buộc</th><th scope="col">Vấn đề</th></tr></thead>
      <tbody>${rep.fields.map((f, i) => `<tr><td>${f.step ? `B${f.step}·` : ''}${f.n || i + 1}</td><td>${esc((rep.steps ? rep.steps.flatMap((x) => x.fields).find((y) => y.gn === f.n) || {} : f).name || f.n)}</td><td>${esc(f.kind)}</td><td><code>${esc(f.type)}</code>${f.im ? ` <code>${esc(f.im)}</code>` : ''}</td><td>${f.ac ? `<code>${esc(f.ac)}</code>` : '<span class="muted">—</span>'}</td><td>${f.req ? 'Có' : '<span class="muted">—</span>'}</td><td><span class="chips">${[...new Set(f.issues)].map((id) => ruleChip(id)).join('')}</span></td></tr>`).join('')}</tbody></table></div>
    </details>`;
  azDrawList(rep);
  $('#az-f').addEventListener('click', (e) => { const b = e.target.closest('[data-azf]'); if (!b) return; AZ_UI.filter = b.dataset.azf; $$('#az-f [data-azf]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); azDrawList(rep); });
}
function azPinHTML(f, W, H) {
  const r = f.rect, st = azWorst(f);
  const pc = (v, t) => `${Math.max(0, Math.min(100, (v / t) * 100)).toFixed(3)}%`;
  const nF = f.probs.filter((x) => x.st === 'fail').length, nW = f.probs.filter((x) => x.st === 'warn').length;
  const lab = `Trường ${f.gn}: ${f.name} — ${nF || nW ? [nF && `${nF} chưa đạt`, nW && `${nW} cần xem lại`].filter(Boolean).join(', ') : 'không phát hiện lỗi'}`;
  return `<span class="az-box st-${st}" data-azbox="${f.gn}" style="left:${pc(r.x, W)};top:${pc(r.y, H)};width:${pc(Math.min(r.w, W - r.x), W)};height:${pc(r.h, H)}"></span><button type="button" class="az-pin st-${st}" data-azpin="${f.gn}" style="left:${pc(Math.min(r.x + r.w, W - 14), W)};top:${pc(r.y, H)}" aria-label="${esc(lab)}" title="${esc(lab)}">${f.gn}</button>`;
}
function azCardHTML(f, rep, si) {
  const st = azWorst(f);
  const crop = rep && f.rect && rep.steps[si] && rep.steps[si].shot ? azCropHTML(rep, si, [f.rect], '', st) : '';
  const nF = f.probs.filter((x) => x.st === 'fail').length, nW = f.probs.filter((x) => x.st === 'warn').length;
  const badge = nF || nW ? [nF && `${nF} chưa đạt`, nW && `${nW} cần xem lại`].filter(Boolean).join(' · ') : 'Không phát hiện lỗi';
  return `<article class="az-fc st-${st}" id="az-fc-${f.gn}" data-azfc="${f.gn}" tabindex="-1" aria-labelledby="az-fc-t-${f.gn}">
    <div class="az-fc-h"><button type="button" class="az-num st-${st}" data-azgo="${f.gn}" aria-label="Xem vị trí trường ${f.gn} trên ảnh" ${f.rect || f.n ? '' : 'disabled'}>${f.gn}</button>
      <div class="az-fc-t"><h4 id="az-fc-t-${f.gn}">${esc(f.name)}</h4><p>${esc(f.kind)} · <code>${esc(f.type)}</code>${f.req ? ' · bắt buộc' : ''}</p></div>
      <span class="az-fc-badge st-${st}">${badge}</span></div>
    ${crop && f.probs.length ? `<div class="az-fc-crop">${crop}</div>` : ''}
    ${f.probs.length ? `<ul class="az-probs">${f.probs.map((x) => { const r = RULE_BY_ID[x.id]; return `<li class="st-${x.st}"><div class="az-pt"><span class="az-st">${ic(AZ_ST[x.st].ic, 14)}${AZ_ST[x.st].n}</span>${ruleChip(x.id)}<b>${fmt(r.t)}</b></div>
      <p class="az-pp"><span class="az-lb">Vấn đề</span><span>${fmt(x.msg)}</span></p><p class="az-pp"><span class="az-lb">Cách sửa</span><span>${fmt(x.fix)}</span></p>
      ${rep ? `<details class="az-g-more"><summary>${ic('down', 15, 'chev')}Hướng dẫn chi tiết, minh họa đúng</summary>${azGuideHTML(rep, r, x.st, { noActual: true })}</details>` : ''}</li>`; }).join('')}</ul>` : ''}
    ${f.errs && f.errs.length ? `<p class="az-errs">${ic('alert', 14)}<span>Khi để trống, form báo: ${f.errs.map((t) => `"${esc(t)}"`).join(', ')}</span></p>` : ''}
    ${f.code ? `<details class="az-code"><summary>${ic('down', 16, 'chev')}Mã gợi ý: hiện tại → nên sửa</summary><div class="az-code-g"><div><p class="az-code-l">Hiện tại</p><pre tabindex="0"><code>${esc(f.code.cur)}</code></pre></div><div><p class="az-code-l">Nên sửa thành <button type="button" class="btn btn-ghost btn-sm" data-azcopy="${f.gn}">${ic('copy', 14)}Sao chép</button></p><pre tabindex="0"><code>${esc(f.code.rec)}</code></pre></div></div></details>` : ''}
  </article>`;
}
function azFormIssues(rep) {
  const tied = new Set(rep.steps.flatMap((x) => x.fields.flatMap((f) => f.probs.map((p) => p.id))));
  const lvO = { m: 0, s: 1, c: 2 };
  const list = RULES.filter((r) => ['fail', 'warn'].includes((rep.R[r.id] || {}).st) && !tied.has(r.id)).sort((a, b) => AZ_ST[rep.R[a.id].st].o - AZ_ST[rep.R[b.id].st].o || lvO[a.lv] - lvO[b.lv]);
  const manual = RULES.filter((r) => (rep.R[r.id] || {}).st === 'manual').length;
  return `<section class="az-gl" aria-labelledby="az-gl-h"><h3 class="az-gl-hd" id="az-gl-h">Vấn đề chung của form <span class="muted">(${list.length})</span></h3>
    <p class="muted">Không gắn với một ô cụ thể: cấu trúc, nút bấm, câu chữ, cách báo lỗi, thông tin tin cậy.</p>
    ${list.length ? `<div class="az-gl-list">${list.map((r) => { const x = rep.R[r.id]; return `<article class="az-gc st-${x.st}"><div class="az-pt"><span class="az-st">${ic(AZ_ST[x.st].ic, 14)}${AZ_ST[x.st].n}</span>${ruleChip(r.id)}<b>${fmt(r.t)}</b>${lvPill(r.lv)}</div>
      <p class="az-pp"><span class="az-lb">Vấn đề</span><span>${esc(x.msg)}</span></p>
      ${x.ev && x.ev.length ? `<ul class="az-ev">${x.ev.slice(0, 5).map((e) => `<li>${esc(e)}</li>`).join('')}${x.ev.length > 5 ? `<li class="muted">… và ${x.ev.length - 5} mục khác</li>` : ''}</ul>` : ''}
      ${azGuideHTML(rep, r, x.st)}</article>`; }).join('')}</div>` : '<p class="muted">Không có.</p>'}
    ${manual ? `<p class="az-manual">${ic('pointer', 15)}<span>Còn ${manual} tiêu chí máy không tự kết luận được (hành vi khi gõ, tải tệp, lỗi máy chủ, trang xác nhận…). <button type="button" class="f-linkbtn" data-azv2="rules">Xem danh sách cần thử tay</button></span></p>` : ''}
  </section>`;
}
function azFieldsHTML(rep) {
  const only = !!AZ_UI.onlyBad;
  const labels = azStepLabels(rep.steps);
  const stepsHTML = rep.steps.map((x, i) => {
    const list = x.fields.filter((f) => !only || ['fail', 'warn'].includes(azWorst(f)));
    const bad = x.fields.filter((f) => ['fail', 'warn'].includes(azWorst(f))).length;
    const pins = x.shot && x.shotH ? x.fields.filter((f) => f.rect && f.rect.y < x.shotH).map((f) => azPinHTML(f, x.shotW, x.shotH)).join('') : '';
    const media = x.shot ? `<img class="az-shot-img" src="${x.shot}" alt="Ảnh chụp ${labels[i].toLowerCase()} trên điện thoại (390px), các ô được đánh số theo thẻ bên cạnh">`
      : x.preview ? `<iframe class="az-prev" sandbox="allow-same-origin" referrerpolicy="no-referrer" tabindex="-1" aria-hidden="true" title="Bản xem trước ${labels[i].toLowerCase()}" data-azprev="${x.n}"></iframe>`
        : `<div class="az-noshot">${ic('image', 22)}<span>${rep.meta.saved ? 'Ảnh chụp không được lưu lại sau khi tải lại trang. Chấm lại để xem ảnh có đánh số.' : 'Không có ảnh cho bước này.'}</span></div>`;
    const checks = (x.checks || []).length ? `<p class="az-g-h">${ic('check', 15)}${x.kind === 'done' ? 'Chấm trang xác nhận' : 'Chấm trang giới thiệu'}</p>${x.checks.map((c) => { const r = RULE_BY_ID[c.id]; return `<article class="az-gc st-${c.st}"><div class="az-pt"><span class="az-st">${ic(AZ_ST[c.st].ic, 14)}${AZ_ST[c.st].n}</span>${ruleChip(c.id)}<b>${fmt(r.t)}</b>${lvPill(r.lv)}</div><p class="az-pp"><span class="az-lb">${c.st === 'pass' ? 'Kết quả' : 'Vấn đề'}</span><span>${esc(c.msg || '')}</span></p>${c.ev && c.ev.length ? `<ul class="az-ev">${c.ev.slice(0, 4).map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}${['fail', 'warn'].includes(c.st) ? `<details class="az-g-more"><summary>${ic('down', 15, 'chev')}Hướng dẫn sửa, minh họa đúng</summary>${azGuideHTML(rep, r, c.st, { noActual: true })}</details>` : c.st === 'manual' ? azManualHTML(r) : ''}</article>`; }).join('')}` : '';
    const empty = x.fields.length ? '<p class="muted az-allok">Các trường ở bước này không có lỗi tự động.</p>' : checks || `<p class="muted">${x.kind === 'landing' ? 'Trang giới thiệu, không có ô nhập.' : 'Không có ô nhập.'}</p>`;
    return `<section class="az-step" id="az-step-${x.n}" aria-labelledby="az-step-h-${x.n}">
      <h3 class="az-step-h" id="az-step-h-${x.n}" tabindex="-1"><span class="az-step-n">${labels[i]}</span><span class="az-step-t">${esc(x.heading || x.title || '')}</span><span class="muted az-step-c">${x.fields.length} trường${bad ? ` · ${bad} cần sửa` : ''}</span></h3>
      <div class="az-step-g">
        <div class="az-shotcol"><div class="az-shotwrap${x.shot ? '' : x.preview ? ' is-prev' : ' is-none'}" ${x.shot && x.shotH ? `style="aspect-ratio:${x.shotW} / ${x.shotH}"` : ''}>${media}<div class="az-pins">${pins}</div></div></div>
        <div class="az-cards">${list.map((f) => azCardHTML(f, rep, i)).join('') || empty}</div>
      </div></section>`;
  }).join('');
  return `<div class="az-fbar"><label class="toggle-chip"><input type="checkbox" id="az-onlybad" ${only ? 'checked' : ''}> Chỉ hiện trường cần sửa</label>
    <span class="az-legend" aria-hidden="true"><i class="st-fail"></i>Chưa đạt<i class="st-warn"></i>Cần xem lại<i class="st-pass"></i>Không phát hiện lỗi</span></div>
    ${stepsHTML}${azFormIssues(rep)}`;
}
function azScrollPin(pin) {
  const col = pin.closest('.az-shotcol');
  if (col && col.scrollHeight > col.clientHeight + 4) {
    const cr = col.getBoundingClientRect(), pr = pin.getBoundingClientRect();
    col.scrollTo({ top: col.scrollTop + pr.top - cr.top - col.clientHeight / 3, behavior: 'smooth' });
    if (cr.top < 0 || cr.bottom > innerHeight) col.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else pin.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function azWireFields(rep, pane) {
  const all = rep.steps.flatMap((x) => x.fields);
  const hl = (gn, on) => $$(`[data-azpin="${gn}"], [data-azbox="${gn}"]`, pane).forEach((e) => e.classList.toggle('hl', on));
  pane.addEventListener('click', (e) => {
    const pin = e.target.closest('[data-azpin]');
    if (pin) {
      const c = $(`#az-fc-${pin.dataset.azpin}`);
      if (!c) { toast('Trường này không có lỗi (đang ẩn vì bật "Chỉ hiện trường cần sửa")'); return; }
      c.scrollIntoView({ behavior: 'smooth', block: 'center' }); c.focus({ preventScroll: true });
      c.classList.remove('flash'); void c.offsetWidth; c.classList.add('flash');
      return;
    }
    const go = e.target.closest('[data-azgo]');
    if (go) { const p = $(`[data-azpin="${go.dataset.azgo}"]`, pane); if (p) { azScrollPin(p); hl(go.dataset.azgo, true); setTimeout(() => hl(go.dataset.azgo, false), 1800); } else toast('Không xác định được vị trí trường này trên ảnh'); return; }
    const cp = e.target.closest('[data-azcopy]');
    if (cp) { const f = all.find((x) => String(x.gn) === cp.dataset.azcopy); if (f && f.code) copyText(f.code.rec, 'Đã sao chép mã gợi ý'); return; }
    const v2 = e.target.closest('[data-azv2]');
    if (v2) { AZ_UI.view = 'rules'; AZ_UI.filter = 'manual'; $$('[data-azv]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.azv === 'rules'))); azDrawPane(rep); const v = $('#az-view'); if (v) v.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
  ['mouseover', 'focusin'].forEach((ev) => pane.addEventListener(ev, (e) => { const c = e.target.closest('[data-azfc]'); if (c) hl(c.dataset.azfc, true); }));
  ['mouseout', 'focusout'].forEach((ev) => pane.addEventListener(ev, (e) => { const c = e.target.closest('[data-azfc]'); if (c && !c.contains(e.relatedTarget)) hl(c.dataset.azfc, false); }));
  const ob = $('#az-onlybad', pane);
  if (ob) ob.addEventListener('change', () => { AZ_UI.onlyBad = ob.checked; azDrawPane(rep); const n = $('#az-onlybad'); if (n) n.focus(); });
  $$('iframe[data-azprev]', pane).forEach((fr) => azMountPreview(fr, rep.steps[+fr.dataset.azprev - 1]));
}
/* Bản xem trước (tệp HTML, mã dán, chế độ Nhanh): khung sandbox không chạy script, đặt ghim theo vị trí thật của ô */
function azMountPreview(fr, x) {
  const wrap = fr.closest('.az-shotwrap'), pins = $('.az-pins', wrap), W = 390;
  fr.addEventListener('load', () => {
    let d; try { d = fr.contentDocument; } catch (e) { d = null; }
    if (!d || !d.documentElement) return;
    fr.style.height = '10px'; /* đo chiều cao thật của nội dung, không bị khung hiện tại kéo dài */
    const H = Math.min(Math.max(d.documentElement.scrollHeight, d.body ? d.body.scrollHeight : 0, 320), 9000);
    fr.style.height = H + 'px';
    wrap.style.aspectRatio = `${W} / ${H}`;
    const fit = () => { fr.style.transform = `scale(${wrap.clientWidth / W})`; };
    fit();
    if (window.ResizeObserver) new ResizeObserver(fit).observe(wrap);
    const box = (el) => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top + (d.defaultView ? d.defaultView.scrollY : 0), w: r.width, h: r.height }; };
    const by = {};
    d.querySelectorAll('[data-az-i]').forEach((el) => {
      let r = box(el);
      if (r.w < 2 || r.h < 2) { const lab = el.closest('label') || (el.id ? d.querySelector(`label[for="${CSS.escape(el.id)}"]`) : null); if (lab) r = box(lab); }
      if (r.w < 2 || r.h < 2) return;
      (by[el.getAttribute('data-az-i')] = by[el.getAttribute('data-az-i')] || []).push(r);
    });
    pins.innerHTML = x.fields.map((f) => {
      const rs = by[String(f.n)]; if (!rs) return '';
      const x0 = Math.min(...rs.map((r) => r.x)), y0 = Math.min(...rs.map((r) => r.y));
      const rect = { x: x0, y: y0, w: Math.max(...rs.map((r) => r.x + r.w)) - x0, h: Math.max(...rs.map((r) => r.y + r.h)) - y0 };
      return azPinHTML({ ...f, rect }, W, H);
    }).join('');
  });
  fr.srcdoc = x.preview;
}
/* ---------- Ảnh cắt từ trang thật + hướng dẫn sửa ---------- */
/* Ảnh chụp từng bước đổi sang blob URL để nhiều ảnh cắt dùng chung, không nhân bản chuỗi base64 */
const AZ_BLOBS = new Map();
function azShotUrl(rep, si) {
  const x = rep.steps && rep.steps[si]; if (!x || !x.shot) return '';
  const key = `${rep.meta.ts}:${si}`;
  if (!AZ_BLOBS.has(key)) {
    try {
      const [head, b64] = x.shot.split(','); const bin = atob(b64); const u8 = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      AZ_BLOBS.forEach((u, k) => { if (!k.startsWith(rep.meta.ts + ':')) { URL.revokeObjectURL(u); AZ_BLOBS.delete(k); } });
      AZ_BLOBS.set(key, URL.createObjectURL(new Blob([u8], { type: (head.match(/data:([^;]+)/) || [])[1] || 'image/jpeg' })));
    } catch (e) { return x.shot; }
  }
  return AZ_BLOBS.get(key);
}
/* Cắt một vùng của ảnh chụp quanh các ô/nút, khoanh đỏ chỗ có lỗi */
function azCropHTML(rep, si, rects, cap, st, top) {
  const x = rep.steps[si]; const src = azShotUrl(rep, si);
  if (!src || !x.shotH) return '';
  const W = x.shotW || 390, H = x.shotH;
  const rs = (rects || []).filter((r) => r && r.y < H && r.w > 0);
  let x0, y0, x1, y1;
  if (top || !rs.length) { x0 = 0; y0 = 0; x1 = W; y1 = Math.min(H, 380); }
  else {
    x0 = Math.min(...rs.map((r) => r.x)) - 14; y0 = Math.min(...rs.map((r) => r.y)) - 58; x1 = Math.max(...rs.map((r) => r.x + r.w)) + 14; y1 = Math.max(...rs.map((r) => r.y + r.h)) + 22;
    if (x1 - x0 < 300) { const c = (x0 + x1) / 2; x0 = c - 150; x1 = c + 150; }
    if (y1 - y0 < 120) { const c = (y0 + y1) / 2; y0 = c - 60; y1 = c + 60; }
    y1 = Math.min(y1, y0 + 440);
    if (x0 < 0) { x1 -= x0; x0 = 0; } if (x1 > W) { x0 = Math.max(0, x0 - (x1 - W)); x1 = W; }
    y0 = Math.max(0, y0); y1 = Math.min(H, y1);
  }
  const cw = x1 - x0, ch = y1 - y0;
  const pc = (v, t) => `${((v / t) * 100).toFixed(3)}%`;
  const hl = top ? '' : rs.filter((r) => r.y < y1).map((r) => `<span class="az-crop-hl st-${st}" style="left:${pc(r.x - x0, cw)};top:${pc(r.y - y0, ch)};width:${pc(Math.min(r.w, x1 - r.x), cw)};height:${pc(Math.min(r.h, y1 - r.y), ch)}"></span>`).join('');
  return `<figure class="az-crop-f"><div class="az-crop" style="aspect-ratio:${Math.round(cw)} / ${Math.round(ch)};max-width:${Math.round(cw * 1.35)}px"><img src="${src}" alt="" loading="lazy" style="width:${pc(W, cw)};left:${pc(-x0, cw)};top:${pc(-y0, ch)}">${hl}</div>${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
}
/* Ảnh minh họa cho một tiêu chí: tối đa 2 vùng cắt; tiêu chí cấp trang thì lấy phần đầu trang */
function azCropsFor(rep, id, st) {
  if (!rep.steps || !rep.steps.some((x) => x.shot)) return '';
  const labels = azStepLabels(rep.steps);
  const L = ((rep.locs || {})[id] || []).filter((l) => rep.steps[l.s] && rep.steps[l.s].shot);
  const groups = [];
  L.forEach((l) => { const g = groups.find((x) => x.s === l.s && Math.abs(x.y - l.r.y) < 260); if (g) { g.items.push(l); } else if (groups.length < 2) groups.push({ s: l.s, y: l.r.y, items: [l] }); });
  if (groups.length) return groups.map((g) => azCropHTML(rep, g.s, g.items.map((l) => l.r), `${labels[g.s]} · ${g.items.map((l) => (l.gn ? `trường ${l.gn} "${esc(azCut(l.name, 30))}"` : esc(l.name))).filter((v, i, a) => a.indexOf(v) === i).join(', ')}`, st)).join('');
  const si = rep.steps.findIndex((x) => x.kind === 'form' && x.shot);
  return si < 0 ? '' : azCropHTML(rep, si, [], `${labels[si]} · phần đầu trang (tiêu chí áp dụng cho cả trang)`, st, true);
}
/* Khối hướng dẫn cho tiêu chí chưa đạt / cần xem lại: ảnh trên trang của bạn, minh họa làm đúng, các bước sửa */
function azGuideHTML(rep, r, st, opt = {}) {
  const mock = r.mock && MOCKS[r.mock];
  const crops = opt.noActual ? '' : azCropsFor(rep, r.id, st);
  const hasShots = rep.steps && rep.steps.some((x) => x.shot);
  const actual = opt.noActual ? '' : `<div class="az-g-col"><p class="az-g-h">${ic('eye', 15)}Trên trang của bạn</p>${crops || `<p class="muted az-g-none">${hasShots ? 'Lỗi này không gắn với một vị trí cụ thể trên ảnh.' : 'Chưa có ảnh: chấm bằng đường dẫn ở chế độ Đầy đủ để thấy vị trí lỗi trên ảnh chụp.'}</p>`}</div>`;
  const good = `<div class="az-g-col"><p class="az-g-h ok">${ic('ok', 15)}Nên làm thế này</p>${mock ? `<div class="dd-mock mk az-g-mock" role="img" aria-label="Minh họa cách làm đúng">${mock.do}</div>` : ''}<ul class="az-g-do">${r.do.slice(0, 2).map((d) => `<li>${fmt(d)}</li>`).join('')}</ul></div>`;
  return `<div class="az-guide">
    <div class="az-g-grid${opt.noActual ? ' one' : ''}">${actual}${good}</div>
    <div class="az-g-how"><p class="az-g-h">${ic('list', 15)}Cách sửa từng bước</p><ol class="az-g-ol">${r.how.map((h) => `<li>${fmt(h)}</li>`).join('')}</ol>
      <p class="az-g-chk">${ic('check', 14)}<span><b>Kiểm tra lại:</b> ${fmt(r.chk)}</span></p>
      <a class="az-more" href="#nt-${r.id.toLowerCase()}">${r.demo ? 'Xem nguyên tắc và thử demo chạy thật' : 'Xem đầy đủ nguyên tắc'} ${r.id}${ic('right', 14)}</a></div>
  </div>`;
}
/* Tiêu chí cần thử tay: kịch bản thử từng bước + kết quả đúng */
function azManualHTML(r) {
  const tests = (AZ_TESTS[r.id] || []).slice(0, 2);
  return `<div class="az-guide az-guide-m">${tests.length ? tests.map(([t, n]) => `<div class="az-g-test"><p class="az-g-h">${ic('target', 15)}Cách thử · Kịch bản ${n}: ${esc(t.t)}</p><p>${fmt(t.how)}</p><p class="az-g-exp"><b>Kết quả đúng:</b> ${fmt(t.exp)}</p></div>`).join('') : `<div class="az-g-test"><p class="az-g-h">${ic('target', 15)}Cách thử</p><p>${fmt(r.chk)}</p></div>`}
    <details class="az-g-more"><summary>${ic('down', 15, 'chev')}Cách làm đúng theo bộ chuẩn</summary><ol class="az-g-ol">${r.how.map((h) => `<li>${fmt(h)}</li>`).join('')}</ol></details></div>`;
}
function azDrawList(rep) {
  const { R } = rep, f = AZ_UI.filter;
  const lvO = { m: 0, s: 1, c: 2 };
  const list = RULES.filter((r) => f === 'all' || (R[r.id] || {}).st === f).sort((a, b) => (f === 'all' ? AZ_ST[(R[a.id] || {}).st || 'manual'].o - AZ_ST[(R[b.id] || {}).st || 'manual'].o : 0) || lvO[a.lv] - lvO[b.lv] || RULES.indexOf(a) - RULES.indexOf(b));
  const el = $('#az-list');
  if (!list.length) { el.innerHTML = `<div class="empty"><b>Không có tiêu chí nào ở mục này</b>Đổi bộ lọc để xem mục khác.</div>`; return; }
  el.innerHTML = `<ul class="az-items">${list.map((r) => {
    const x = R[r.id] || { st: 'manual', msg: '', ev: [] }, st = AZ_ST[x.st];
    const tests = x.st === 'manual' && AZ_TESTS[r.id] ? AZ_TESTS[r.id].slice(0, 2).map(([t, n]) => `<a href="#kiem-thu" data-aztest="test-${t.id}">Kịch bản ${n}: ${esc(t.t)}</a>`).join(' · ') : '';
    return `<li class="az-item st-${x.st}"><span class="az-st">${ic(st.ic, 15)}${st.n}</span>
      <div class="az-body"><div class="az-t"><a class="rid" href="#nt-${r.id.toLowerCase()}">${r.id}</a> <a href="#nt-${r.id.toLowerCase()}">${fmt(r.t)}</a> ${lvPill(r.lv)}</div>
        ${x.msg ? `<p class="az-msg">${esc(x.msg)}</p>` : ''}
        ${x.ev && x.ev.length ? `<ul class="az-ev">${x.ev.slice(0, 10).map((e) => `<li>${esc(e)}</li>`).join('')}${x.ev.length > 10 ? `<li class="muted">… và ${x.ev.length - 10} mục khác</li>` : ''}</ul>` : ''}
        ${['fail', 'warn'].includes(x.st) ? azGuideHTML(rep, r, x.st) : x.st === 'manual' ? azManualHTML(r) : ''}
      </div></li>`;
  }).join('')}</ul>`;
  $$('[data-aztest]', el).forEach((a) => a.addEventListener('click', () => { PENDING = a.dataset.aztest; }));
}
function azMarkdown(rep) {
  const { R, info, meta } = rep, s = azSummary(R);
  const src = meta.kind === 'url' ? meta.url : meta.kind === 'file' ? meta.files.join(' → ') : meta.kind === 'sample' ? meta.sample : 'Mã HTML đã dán';
  const sym = { fail: '✕', warn: '!', pass: '✓' };
  const sec = (st) => RULES.filter((r) => (R[r.id] || {}).st === st).map((r) => { const x = R[r.id]; return `- [ ] **${r.id}** ${plain(r.t)} (${LEVELS[r.lv].n}) — ${x.msg}${(x.ev || []).slice(0, 6).map((e) => `\n  - ${e}`).join('')}`; }).join('\n') || '_Không có_';
  let byField = '';
  if (rep.steps) {
    const labels = azStepLabels(rep.steps);
    byField = rep.steps.map((x, i) => {
      const fs = x.fields.filter((f) => f.probs.length);
      if (!fs.length) return '';
      return `### ${labels[i]}${x.heading ? ` · ${x.heading}` : ''}\n\n${fs.map((f) => `**#${f.gn} ${f.name}** (${f.kind}, \`${f.type}\`${f.req ? ', bắt buộc' : ''})\n${f.probs.map((p) => `- ${sym[p.st] || '·'} **${p.id}** ${plain(RULE_BY_ID[p.id].t)}\n  - Vấn đề: ${mdText(p.msg)}\n  - Cách sửa: ${mdText(p.fix)}`).join('\n')}${f.errs && f.errs.length ? `\n- Khi để trống, form báo: ${f.errs.map((t) => `"${t}"`).join(', ')}` : ''}${f.code ? `\n\n\`\`\`html\n${f.code.rec}\n\`\`\`` : ''}`).join('\n\n')}`;
    }).filter(Boolean).join('\n\n');
  }
  const st = meta.stop ? (AZ_STOP[meta.stop.kind] || AZ_STOP.end)(meta.stop, meta) : null;
  return `# Chấm tự động UX form: ${info.title || src}\nNguồn: ${src} · ${new Date(meta.ts).toLocaleString('vi-VN')} · ${info.N} trường${(info.formSteps || info.steps) > 1 ? ` · ${info.formSteps || info.steps} bước` : ''}${st ? `\nLuồng: ${st.t}. ${st.d}` : ''}\n\n**Kết quả:** Chưa đạt ${s.fail} · Cần xem lại ${s.warn} · Đạt ${s.pass} · Cần thử tay ${s.manual} · Không áp dụng ${s.na}${s.mustFail ? `\n**${s.mustFail} tiêu chí Bắt buộc chưa đạt.**` : ''}${byField ? `\n\n## Theo từng trường\n\n${byField}` : ''}\n\n## Theo tiêu chí: chưa đạt\n${sec('fail')}\n\n## Theo tiêu chí: cần xem lại\n${sec('warn')}\n\n## Cần thử tay\n${RULES.filter((r) => (R[r.id] || {}).st === 'manual').map((r) => `${r.id}`).join(', ') || '_Không có_'}\n\n_Theo bộ Chuẩn UX Form Đăng ký — ${MD_SITE}_`;
}
function azImport(rep) {
  const acts = $('#az-acts'); const keep = acts.innerHTML;
  const auto = RULES.filter((r) => ['pass', 'fail', 'na'].includes((rep.R[r.id] || {}).st));
  const fresh = auto.filter((r) => !S.audit.items[r.id]);
  const conflict = auto.length - fresh.length;
  acts.innerHTML = `<span class="confirm-inline az-confirm" role="group" aria-label="Đưa kết quả vào checklist"><span>Điền ${fresh.length} tiêu chí vào checklist${conflict ? `; ${conflict} tiêu chí đã chấm trước đó` : ''}.</span><button type="button" class="btn btn-pri btn-sm" id="az-imp-new">Điền ${fresh.length} tiêu chí</button>${conflict ? `<button type="button" class="btn btn-sec btn-sm" id="az-imp-all">Ghi đè cả ${auto.length}</button>` : ''}<button type="button" class="btn btn-ghost btn-sm" id="az-imp-no">Hủy</button></span>`;
  const done = (list) => {
    list.forEach((r) => { const x = rep.R[r.id]; S.audit.items[r.id] = x.st; if (x.st === 'fail') S.audit.notes[r.id] = `[Tự động] ${x.msg}${(x.ev || []).length ? ' — ' + x.ev.slice(0, 4).join('; ') : ''}`; });
    if (!S.audit.name) S.audit.name = rep.info.title || (rep.meta.url || '');
    store.set('fx-audit', S.audit); refreshNavAudit();
    acts.innerHTML = keep; $('#az-import').addEventListener('click', () => azImport(rep)); $('#az-md').addEventListener('click', () => copyText(azMarkdown(rep), 'Đã sao chép báo cáo chấm tự động'));
    toast(`Đã điền ${list.length} tiêu chí vào checklist`);
    acts.insertAdjacentHTML('afterbegin', `<a class="btn btn-ghost btn-sm" href="#danh-gia">Mở checklist ${ic('right', 14)}</a>`);
  };
  $('#az-imp-new').focus();
  $('#az-imp-new').addEventListener('click', () => done(fresh));
  const all = $('#az-imp-all'); if (all) all.addEventListener('click', () => done(auto));
  $('#az-imp-no').addEventListener('click', () => { acts.innerHTML = keep; $('#az-import').addEventListener('click', () => azImport(rep)); $('#az-md').addEventListener('click', () => copyText(azMarkdown(rep), 'Đã sao chép báo cáo chấm tự động')); $('#az-import').focus(); });
}
