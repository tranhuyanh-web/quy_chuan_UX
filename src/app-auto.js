/* ============================================================
   TRANG CHẤM TỰ ĐỘNG
   ============================================================ */
const AZ_UI = { src: 'url', mode: 'render', files: [], filter: 'fail', running: false };
let AZ_LAST = store.get('fx-az-last', null);

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
          <span class="muted" style="font-size:13.5px">Thử nhanh:</span><button type="button" class="try-chip" data-azsample="bad">Form ví dụ có nhiều lỗi</button><button type="button" class="try-chip" data-azsample="good">Form mẫu của bộ chuẩn</button></div>
      </form>
      <div class="az-progress" id="az-progress" hidden aria-live="polite"></div>
    </section>
    <div id="az-report">${AZ_LAST ? '' : azEmptyHTML()}</div>
  </div>`;
  const urlCtl = mountField({ id: 'az-url', label: 'Đường dẫn trang đăng ký', required: true, type: 'url', norm: 'url', v: 'url', emptyMsg: 'Nhập đường dẫn trang đăng ký' }, main);
  if (AZ_UI.lastUrl) urlCtl.set(AZ_UI.lastUrl);
  $$('[data-azsrc]', main).forEach((b) => b.addEventListener('click', () => {
    AZ_UI.src = b.dataset.azsrc;
    $$('[data-azsrc]', main).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $$('[data-azpane]', main).forEach((p) => { p.hidden = p.dataset.azpane !== AZ_UI.src; });
    $('#az-sum').hidden = true;
  }));
  $$('input[name="az-mode"]', main).forEach((r) => r.addEventListener('change', () => { AZ_UI.mode = r.value; }));
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
async function azCall(path, url) {
  const r = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
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
  const go = $('#az-go');
  const busy = (on) => { AZ_UI.running = on; go.disabled = on; go.innerHTML = on ? `<span class="spin" aria-hidden="true"></span>Đang chấm…` : `${ic('spark', 17)}Chấm điểm`; };
  try {
    if (AZ_UI.src === 'url') {
      const m = urlCtl.validate(true);
      if (m) { urlCtl.focus(); return; }
      const url = urlCtl.norm(); AZ_UI.lastUrl = url;
      busy(true);
      let data = null, note = '';
      if (AZ_UI.mode === 'render') {
        const steps = ['Mở trang bằng trình duyệt ẩn', 'Đo bố cục, cỡ chữ, vùng chạm, focus', `Chấm ${RULES.length} tiêu chí`];
        azProgress(steps, 0);
        const t = setTimeout(() => azProgress(steps, 1), 9000);
        try { data = await azCall('/api/render', url); }
        catch (e) {
          if (e.noApi) throw e;
          if (!e.fallback) throw e;
          note = 'Không mở được trang bằng trình duyệt ẩn, đã chuyển sang đọc HTML (chế độ Nhanh).';
        } finally { clearTimeout(t); }
        azProgress(steps, 2);
      }
      if (!data) {
        azProgress(['Đọc mã HTML của trang', `Chấm ${RULES.length} tiêu chí`], 0);
        data = await azCall('/api/fetch', url);
        azProgress(['Đọc mã HTML của trang', `Chấm ${RULES.length} tiêu chí`], 1);
      }
      await new Promise((r) => setTimeout(r, 30));
      const page = azAnalyzePage(data.html, { metrics: data.metrics, url: data.finalUrl, status: data.status });
      azFinish([page], { kind: 'url', url: data.finalUrl, mode: data.mode, shot: data.screenshot || '', ms: data.ms, truncated: data.truncated, note: [note, data.note].filter(Boolean).join(' ') });
    } else if (AZ_UI.src === 'file') {
      const ctl = { id: 'az-files', el: $('#fw-az-files'), inputs: () => [$('#az-files')] };
      if (!AZ_UI.files.length) { setErr(ctl, 'Chọn ít nhất một tệp HTML'); $('#az-files').focus(); return; }
      const bad = AZ_UI.files.find((f) => !/\.(html?|mhtml?|mht)$/i.test(f.name));
      if (bad) { setErr(ctl, `Tệp "${bad.name}" không phải HTML. Hãy lưu trang dạng .html hoặc .mhtml`); return; }
      const big = AZ_UI.files.find((f) => f.size > 15 * 1024 * 1024);
      if (big) { setErr(ctl, `Tệp "${big.name}" có dung lượng ${fmtMB(big.size)}, vượt giới hạn 15 MB`); return; }
      busy(true);
      azProgress([`Đọc ${AZ_UI.files.length} tệp`, `Chấm ${RULES.length} tiêu chí`], 0);
      const pages = [];
      for (const f of AZ_UI.files) {
        let txt = await f.text();
        if (/\.mht/i.test(f.name) || /^MIME-Version:/i.test(txt.slice(0, 200))) txt = azFromMhtml(txt);
        pages.push(azAnalyzePage(txt, { multi: AZ_UI.files.length > 1 }));
      }
      azProgress([`Đọc ${AZ_UI.files.length} tệp`, `Chấm ${RULES.length} tiêu chí`], 1);
      azFinish(pages, { kind: 'file', files: AZ_UI.files.map((f) => f.name), mode: 'static' });
    } else {
      const ta = $('#az-paste'), ctl = { id: 'az-paste', el: $('#fw-az-paste'), inputs: () => [ta] };
      const v = ta.value.trim();
      if (!v) { setErr(ctl, 'Dán mã HTML của form vào ô'); ta.focus(); return; }
      if (!/<(form|input|select|textarea|button)\b/i.test(v)) { setErr(ctl, 'Không thấy thẻ form, input, select hay textarea trong mã đã dán'); ta.focus(); return; }
      clearErr(ctl);
      busy(true);
      azFinish([azAnalyzePage(v, {})], { kind: 'paste', mode: 'static' });
    }
  } catch (e) {
    $('#az-progress').hidden = true;
    sum.innerHTML = `<div class="f-banner err" role="alert">${ic('alert', 20)}<div><b>${esc(e.message)}</b>${AZ_UI.src === 'url' ? 'Bạn có thể lưu trang thành tệp HTML (Ctrl+S) rồi dùng mục "Tệp HTML".' : ''}</div></div>`;
    sum.hidden = false;
  } finally { busy(false); }
}
function azRunSample(which) {
  let html, meta;
  if (which === 'bad') { html = SAMPLE_BAD_HTML; meta = { kind: 'sample', sample: 'Form ví dụ có nhiều lỗi', mode: 'static' }; }
  else { html = azGoodSample(); meta = { kind: 'sample', sample: 'Form mẫu của bộ chuẩn', mode: 'static' }; }
  azFinish([azAnalyzePage(html, {})], meta);
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
function azFinish(pages, meta) {
  const R = azMerge(pages);
  const fields = pages.flatMap((p, i) => p.info.fields.map((f) => ({ step: pages.length > 1 ? i + 1 : 0, n: azName(f), kind: AZ_KIND[f.kind] || f.kind, type: f.tag === 'input' ? f.type : f.tag === 'select' ? 'select' : f.tag, im: f.im, ac: f.ac, req: f.req, issues: [...f.issues] })));
  const info = { title: pages[0].info.title, N: fields.length, forms: pages.reduce((a, p) => a + p.info.forms, 0), steps: pages.length, blocked: pages.some((p) => p.info.blocked), http: pages[0].info.httpStatus || 0, vi: pages.some((p) => p.info.vi), iframes: pages.flatMap((p) => p.info.iframes).filter((s) => /form|survey|typeform|jotform|google/i.test(s)).slice(0, 3) };
  const rep = { R, fields, info, meta: { ...meta, ts: Date.now() } };
  AZ_LAST = rep;
  try { store.set('fx-az-last', rep); } catch (e) { /* bỏ qua */ }
  AZ_UI.filter = Object.values(R).some((x) => x.st === 'fail') ? 'fail' : 'all';
  const p = $('#az-progress'); if (p) p.hidden = true;
  azDrawReport(rep);
  const h = $('#az-rep-h'); if (h) { h.focus({ preventScroll: true }); h.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  const s = azSummary(R);
  announce(`Đã chấm xong: ${s.pass} đạt, ${s.fail} chưa đạt, ${s.warn} cần xem lại`);
}

/* ---------- Báo cáo ---------- */
function azDrawReport(rep) {
  const box = $('#az-report'); if (!box) return;
  const { R, info, meta } = rep;
  const s = azSummary(R);
  const verdict = !info.N && info.blocked ? { k: 'none', ic: 'alert', t: 'Trang chặn trình duyệt tự động', d: `Website trả về màn hình chống bot/CAPTCHA${info.http ? ` (mã ${info.http})` : ''} nên máy không thấy form. Mở trang bằng trình duyệt của bạn, lưu thành tệp (Ctrl+S, chọn "Trang web, toàn bộ" hoặc .mhtml) rồi dùng mục "Tệp HTML".` }
    : !info.N && info.http ? { k: 'none', ic: 'alert', t: `Trang trả về lỗi ${info.http}`, d: info.http === 404 ? 'Không tìm thấy trang. Kiểm tra lại đường dẫn.' : info.http === 401 || info.http === 403 ? 'Trang cần đăng nhập hoặc không cho truy cập từ bên ngoài. Hãy lưu trang thành tệp HTML rồi tải lên.' : 'Máy chủ của trang đang lỗi. Thử lại sau, hoặc lưu trang thành tệp HTML rồi tải lên.' }
    : !info.N ? { k: 'none', ic: 'info', t: 'Không tìm thấy trường nhập liệu nào', d: info.blocked ? 'Trang trả về màn hình chống bot hoặc yêu cầu xác minh. Hãy lưu trang thành tệp HTML rồi tải lên.' : 'Form có thể được tạo bằng JavaScript (thử chế độ Đầy đủ), nằm trong iframe, hoặc cần đăng nhập. Bạn cũng có thể lưu trang thành tệp HTML rồi tải lên.' }
    : s.mustFail ? { k: 'bad', ic: 'alert', t: `Chưa đạt chuẩn: ${s.mustFail} tiêu chí Bắt buộc chưa đạt`, d: 'Sửa các mục "Chưa đạt" mức Bắt buộc trước khi ra mắt.' }
      : s.fail ? { k: 'mid', ic: 'clock', t: 'Đạt mức tối thiểu, còn mục cần sửa', d: `${s.fail} tiêu chí mức Nên/Cân nhắc chưa đạt.` }
        : { k: 'good', ic: 'ok', t: 'Không phát hiện lỗi tự động', d: 'Tiếp tục thử tay các tiêu chí còn lại để kết luận.' };
  const src = meta.kind === 'url' ? `<a href="${esc(meta.url)}" target="_blank" rel="noopener">${esc(azCut(meta.url, 70))}</a>` : meta.kind === 'file' ? esc(meta.files.join(' → ')) : meta.kind === 'sample' ? esc(meta.sample) : 'Mã HTML đã dán';
  const modeN = { render: 'Đầy đủ · trình duyệt ẩn', fetch: 'Nhanh · đọc HTML', static: 'Đọc HTML' }[meta.mode] || '';
  const notes = [];
  if (meta.note) notes.push(meta.note);
  if (meta.truncated) notes.push('Trang quá lớn, chỉ phân tích 3 MB đầu.');
  if (info.N && info.vi === false) notes.push('Trang không viết bằng tiếng Việt. Các tiêu chí câu chữ (nhãn, thông báo lỗi, viết hoa) được soạn cho tiếng Việt nên chỉ mang tính tham khảo.');
  if (info.N && info.http) notes.push(`Trang trả về mã lỗi ${info.http}. Kiểm tra đây có đúng là trang form cần chấm không.`);
  if (info.iframes.length) notes.push(`Trang nhúng form từ nơi khác (${info.iframes.map((x) => azCut(x, 50)).join(', ')}). Hãy chấm trực tiếp đường dẫn đó.`);
  if (meta.mode !== 'render') notes.push('Chế độ đọc HTML không đo được cỡ chữ, vùng chạm, tương phản, focus và bố cục cột — các tiêu chí đó được đánh dấu "Cần thử tay".');
  const cnt = (k) => RULES.filter((r) => (R[r.id] || {}).st === k).length;
  box.innerHTML = `<section class="az-rep" aria-labelledby="az-rep-h">
    <div class="az-top">
      ${meta.shot ? `<img class="az-shot" src="${meta.shot}" alt="Ảnh chụp trang đã chấm, khung điện thoại 390px">` : ''}
      <div class="az-meta">
        <p class="eyebrow">Báo cáo chấm tự động · ${new Date(meta.ts).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
        <h2 class="h2" id="az-rep-h" tabindex="-1">${esc(info.title || 'Trang chưa có tiêu đề')}</h2>
        <p class="az-src">${src}</p>
        <div class="chips"><span class="tag">${ic('field', 14)}${info.N} trường</span>${info.steps > 1 ? `<span class="tag">${ic('layers', 14)}${info.steps} bước</span>` : ''}<span class="tag">${ic('form', 14)}${info.forms} thẻ form</span>${modeN ? `<span class="tag">${ic('eye', 14)}${modeN}</span>` : ''}${meta.ms ? `<span class="tag">${ic('clock', 14)}${(meta.ms / 1000).toFixed(1).replace('.', ',')} giây</span>` : ''}</div>
      </div>
    </div>
    <div class="au-score az-score">
      <div class="au-verdict ${verdict.k}">${ic(verdict.ic, 24)}<div><b>${esc(verdict.t)}</b><span>${esc(verdict.d)}</span></div></div>
      ${info.N ? `<div class="au-nums az-nums"><div class="au-num err"><b>${s.fail}</b><span>Chưa đạt</span></div><div class="au-num warnn"><b>${s.warn}</b><span>Cần xem lại</span></div><div class="au-num ok"><b>${s.pass}</b><span>Đạt</span></div><div class="au-num"><b>${s.manual}</b><span>Cần thử tay</span></div><div class="au-num"><b>${s.na}</b><span>Không áp dụng</span></div></div>
      <div><div class="au-bar-l"><span>Máy kết luận được ${s.auto + s.na}/${RULES.length} tiêu chí</span><span>${s.auto ? `Điểm tự động ${s.score}/100` : ''}</span></div>
        <div class="meter" aria-hidden="true"><i class="m-err" style="width:${s.fail / RULES.length * 100}%"></i><i class="m-warn" style="width:${s.warn / RULES.length * 100}%"></i><i class="m-ok" style="width:${s.pass / RULES.length * 100}%"></i><i class="m-na" style="width:${s.na / RULES.length * 100}%"></i></div></div>` : ''}
    </div>
    ${notes.length ? `<div class="f-banner info">${ic('info', 20)}<div>${notes.map((n) => `<p>${esc(n)}</p>`).join('')}</div></div>` : ''}
    ${info.N ? `<div class="au-actions"><div class="seg" role="group" aria-label="Lọc kết quả" id="az-f">${[['fail', 'Chưa đạt'], ['warn', 'Cần xem lại'], ['pass', 'Đạt'], ['manual', 'Cần thử tay'], ['all', 'Tất cả']].map(([k, n]) => `<button type="button" data-azf="${k}" aria-pressed="${AZ_UI.filter === k}">${n} <span class="n">${k === 'all' ? RULES.length : cnt(k)}</span></button>`).join('')}</div>
      <div class="btn-row" id="az-acts"><button type="button" class="btn btn-pri btn-sm" id="az-import">${ic('check', 15)}Đưa vào checklist</button><button type="button" class="btn btn-sec btn-sm" id="az-md">${ic('copy', 15)}Sao chép báo cáo</button></div></div>
    <div id="az-list"></div>` : ''}
    <details class="az-fields" ${info.N && info.N <= 30 ? '' : ''}><summary><h3>Các trường đã đọc được (${info.N})</h3>${ic('down', 18, 'chev')}</summary>
      <div class="qp-wrap"><table class="qp-table"><thead><tr><th scope="col">#</th><th scope="col">Nhãn</th><th scope="col">Nhận diện</th><th scope="col">type · inputmode</th><th scope="col">autocomplete</th><th scope="col">Bắt buộc</th><th scope="col">Vấn đề</th></tr></thead>
      <tbody>${rep.fields.map((f, i) => `<tr><td>${f.step ? `B${f.step}·` : ''}${i + 1}</td><td>${esc(f.n)}</td><td>${esc(f.kind)}</td><td><code>${esc(f.type)}</code>${f.im ? ` <code>${esc(f.im)}</code>` : ''}</td><td>${f.ac ? `<code>${esc(f.ac)}</code>` : '<span class="muted">—</span>'}</td><td>${f.req ? 'Có' : '<span class="muted">—</span>'}</td><td><span class="chips">${f.issues.map((id) => ruleChip(id)).join('')}</span></td></tr>`).join('') || `<tr><td colspan="7" class="muted" style="text-align:center;padding:20px">Không đọc được trường nào.</td></tr>`}</tbody></table></div>
    </details>
    <p class="muted az-limit">${ic('info', 15)}<span>Máy chỉ thấy những gì có trong mã trang (và trang hiển thị ở chế độ Đầy đủ). Hành vi khi gõ, báo lỗi, tải tệp, gửi hồ sơ, trang xác nhận phải thử tay — xem <a href="#kiem-thu">Kịch bản kiểm thử</a>. Công cụ không bấm gửi form thật.</span></p>
  </section>`;
  if (!info.N) return;
  azDrawList(rep);
  $('#az-f').addEventListener('click', (e) => { const b = e.target.closest('[data-azf]'); if (!b) return; AZ_UI.filter = b.dataset.azf; $$('#az-f [data-azf]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); azDrawList(rep); });
  $('#az-md').addEventListener('click', () => copyText(azMarkdown(rep), 'Đã sao chép báo cáo chấm tự động'));
  $('#az-import').addEventListener('click', () => azImport(rep));
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
        ${['fail', 'warn'].includes(x.st) ? `<p class="az-fix">${ic('bulb', 14)}<span>${fmt(r.s)}</span></p>` : ''}
        ${tests ? `<p class="az-fix">${ic('target', 14)}<span>${tests}</span></p>` : ''}
      </div></li>`;
  }).join('')}</ul>`;
  $$('[data-aztest]', el).forEach((a) => a.addEventListener('click', () => { PENDING = a.dataset.aztest; }));
}
function azMarkdown(rep) {
  const { R, info, meta } = rep, s = azSummary(R);
  const src = meta.kind === 'url' ? meta.url : meta.kind === 'file' ? meta.files.join(' → ') : meta.kind === 'sample' ? meta.sample : 'Mã HTML đã dán';
  const sec = (st) => RULES.filter((r) => (R[r.id] || {}).st === st).map((r) => { const x = R[r.id]; return `- [ ] **${r.id}** ${plain(r.t)} (${LEVELS[r.lv].n}) — ${x.msg}${(x.ev || []).slice(0, 6).map((e) => `\n  - ${e}`).join('')}`; }).join('\n') || '_Không có_';
  return `# Chấm tự động UX form: ${info.title || src}\nNguồn: ${src} · ${new Date(meta.ts).toLocaleString('vi-VN')} · ${info.N} trường${info.steps > 1 ? ` · ${info.steps} bước` : ''}\n\n**Kết quả:** Chưa đạt ${s.fail} · Cần xem lại ${s.warn} · Đạt ${s.pass} · Cần thử tay ${s.manual} · Không áp dụng ${s.na}${s.mustFail ? `\n**${s.mustFail} tiêu chí Bắt buộc chưa đạt.**` : ''}\n\n## Chưa đạt\n${sec('fail')}\n\n## Cần xem lại\n${sec('warn')}\n\n## Cần thử tay\n${RULES.filter((r) => (R[r.id] || {}).st === 'manual').map((r) => `${r.id}`).join(', ') || '_Không có_'}\n\n_Theo bộ Chuẩn UX Form Đăng ký — chấm tự động chỉ dựa trên mã trang; hành vi khi nhập và gửi cần thử tay._`;
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
