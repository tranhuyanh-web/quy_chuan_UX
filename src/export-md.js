/* ============================================================
   XUẤT TOÀN BỘ BỘ CHUẨN THÀNH MARKDOWN (UX_form.md)
   Dùng chung dữ liệu với bản web nên luôn khớp. Nút "Tải UX_form.md" và
   scripts/export-md.cjs đều gọi guideMarkdown().
   ============================================================ */
const MD_SITE = 'https://chuan-ux-form.vercel.app';
const MD_VERSION = '1.0 · 10/2026';

/* Liên kết trong dữ liệu trỏ tới trang của bản web: đổi sang mục tương ứng trong tệp nếu có,
   còn lại (công cụ tương tác) trỏ ra bản web. */
const MD_LOCAL = { 'cau-chu': 'cau-chu', 'form-mau': 'mau-cau-truc', 'kiem-thu': 'kiem-thu', truong: 'thu-vien-truong', 'nguyen-tac': 'nguyen-tac-chi-tiet', 'danh-gia': 'checklist', 'cong-cu-do-luong': 'do-luong' };
const MD_OWN = /^(nhom-|kich-ban-|truong-|mau-|cau-chu-|checklist|muc-|su-kien|giong-van|[a-z]\d{1,2}$)/;
function mdHash(h) {
  const nt = h.match(/^nt-([a-z]\d{1,2})$/);
  if (nt) return '#' + nt[1];
  if (MD_LOCAL[h]) return '#' + MD_LOCAL[h];
  return MD_OWN.test(h) ? '#' + h : `${MD_SITE}/#${h}`;
}
function mdInline(s) {
  return String(s == null ? '' : s)
    .replace(/\*{3,}/g, (m) => m.replace(/\*/g, '\\*')) /* số bị che: ********4567 */
    .replace(/\[\[(.+?)\]\]/g, '`$1`')
    .replace(/%%(.+?)%%/g, '_$1_')
    .replace(/\[([^\]]+?)\]\(#([a-z0-9-]+)\)/g, (m, t, hh) => `[${t}](${mdHash(hh)})`)
    .replace(/\{([A-Z]\d{1,2})\}/g, (m, id) => `[${id}](#${id.toLowerCase()})`);
}
const mdCell = (s) => mdInline(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const mdRef = (id) => `[${id}](#${id.toLowerCase()})`;
const mdTable = (head, rows) => [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.map(mdCell).join(' | ')} |`)].join('\n');
const mdList = (arr, pre = '- ') => arr.map((x) => pre + mdInline(x)).join('\n');

function mdRule(r) {
  const cat = CAT_BY_ID[r.c];
  const basis = [
    ...(r.law || []).map((k) => (LAWS[k].u ? `[${LAWS[k].n}](${LAWS[k].u})` : LAWS[k].n)),
    ...(r.wcag || []).map((w) => `[WCAG ${w} · ${WCAG[w][0]}](https://www.w3.org/WAI/WCAG22/Understanding/${WCAG[w][1]}.html)`),
  ];
  const tests = TESTS.map((t, i) => [t, i]).filter(([t]) => t.r.includes(r.id));
  const out = [
    `<a id="${r.id.toLowerCase()}"></a>`,
    `#### ${r.id} · ${mdInline(r.t)}`,
    '',
    `**${LEVELS[r.lv].n}** · ${cat.n}`,
    '',
    `> ${mdInline(r.s)}`,
    '',
    `**Vì sao:** ${mdInline(r.why)}`,
    '',
    '**Cách làm:**',
    '',
    r.how.map((h, i) => `${i + 1}. ${mdInline(h)}`).join('\n'),
    '',
    '**✅ Nên**',
    '',
    mdList(r.do),
    '',
    '**❌ Không nên**',
    '',
    mdList(r.dont),
    '',
    `**Tiêu chí kiểm tra:** ${mdInline(r.chk)}`,
    '',
  ];
  if (basis.length) out.push(`**Cơ sở:** ${basis.join('; ')}  `);
  if (r.src && r.src.length) out.push(`**Nguồn:** ${r.src.map((k) => `[${SRC[k][0]}](${SRC[k][1]})`).join('; ')}  `);
  if (tests.length) out.push(`**Kiểm thử:** ${tests.map(([t, i]) => `[Kịch bản ${i + 1} · ${t.t}](#kich-ban-${i + 1})`).join('; ')}  `);
  if (r.rel && r.rel.length) out.push(`**Liên quan:** ${r.rel.map(mdRef).join(' · ')}`);
  out.push('', `[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)`, '');
  return out.join('\n');
}

function guideMarkdown() {
  const cnt = (lv) => RULES.filter((r) => r.lv === lv).length;
  const today = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const L = [];
  const h = (lvl, text, id) => { if (id) L.push(`<a id="${id}"></a>`); L.push(`${'#'.repeat(lvl)} ${text}`, ''); };
  const p = (...lines) => { L.push(...lines, ''); };

  /* ---------- Mở đầu ---------- */
  h(1, 'Chuẩn UX Form Đăng ký');
  p('Bộ nguyên tắc thiết kế form đăng ký (dự thi, hồ sơ xét tuyển, sự kiện, đăng ký nhanh…) cho đội sản phẩm: PM, UX/UI, Dev, QA. Tập trung vào thao tác cơ bản để người dùng điền nhanh, ít sai, hiểu ngay phải làm gì.');
  p(
    `- **Phiên bản:** ${MD_VERSION} · xuất ngày ${today}`,
    `- **Quy mô:** ${RULES.length} nguyên tắc · ${CATS.length} nhóm · ${cnt('m')} Bắt buộc · ${cnt('s')} Nên · ${cnt('c')} Cân nhắc`,
    `- **Bản web tương tác:** ${MD_SITE} (demo chạy thật, form mẫu, chấm form tự động từ link hoặc tệp HTML)`,
    '- **Cơ sở:** Laws of UX, nguyên tắc Watkinson, WCAG 2.2 mức AA, GOV.UK Design System, NN/g, Baymard, web.dev',
  );

  h(2, 'Mục lục', 'muc-luc');
  p([
    ['ap-dung', 'Áp dụng vào dự án'], ['muc-do', 'Mức độ và cách trích dẫn'], ['nguyen-tac-vang', `${GOLDEN.length} nguyên tắc vàng`],
    ['hanh-trinh', 'Hành trình người dùng'], ['nguyen-tac-chi-tiet', `Nguyên tắc chi tiết (${RULES.length})`], ['checklist', 'Checklist review'],
    ['kiem-thu', `Kịch bản kiểm thử (${TESTS.length})`], ['cau-chu', 'Câu chữ mẫu'], ['thu-vien-truong', `Thư viện trường (${FIELD_LIB.length})`],
    ['mau-cau-truc', 'Mẫu cấu trúc form theo loại'], ['do-luong', 'Đo lường sau ra mắt'], ['nguon', 'Nguồn tham khảo'],
  ].map(([id, n], i) => `${i + 1}. [${n}](#${id})`).join('\n'));

  /* ---------- 1. Áp dụng ---------- */
  h(2, '1. Áp dụng vào dự án', 'ap-dung');
  p(mdTable(['Giai đoạn', 'Ai', 'Làm gì', 'Dùng phần'], [
    ['Khởi động', 'PM', 'Chọn mẫu cấu trúc gần nhất. Rà từng trường theo F2: Ai dùng? Dùng để làm gì? Không có thì sao? Hỏi sau được không? Quyết định một trang hay nhiều bước theo F3.', '§10, F2, F3'],
    ['Viết PRD', 'PM', 'Chép tiêu chí kiểm tra của các nguyên tắc liên quan vào Acceptance criteria, ghi kèm mã nguyên tắc.', '§6'],
    ['Thiết kế', 'UX/UI', 'Áp nguyên tắc, ghi mã (ví dụ "V3") vào chú thích trên file thiết kế. Dùng câu chữ mẫu cho nhãn, gợi ý, lỗi.', '§5, §8'],
    ['Phát triển', 'Dev', 'Dùng thông số HTML (type, inputmode, autocomplete), quy tắc kiểm tra, chuẩn hóa và mã mẫu của từng trường.', '§9'],
    ['Kiểm thử', 'QA', `Chạy ${TESTS.length} kịch bản, ưu tiên bàn phím, điện thoại thật, mạng chậm.`, '§7'],
    ['Trước ra mắt', 'Cả nhóm', `Review theo checklist. Chấm tự động trên ${MD_SITE}/#cham-tu-dong để bắt lỗi kỹ thuật nhanh.`, '§6'],
    ['Sau ra mắt', 'PM, Data', 'Gắn sự kiện, theo dõi tỷ lệ hoàn thành, tỷ lệ lỗi theo trường, rơi theo bước. Sửa trường lỗi nhiều nhất trước.', '§11'],
  ]));
  p('**Quy ước ra quyết định (đề xuất):**');
  p(
    '- **Definition of Done:** đạt toàn bộ nguyên tắc **Bắt buộc** có áp dụng cho form đó.',
    '- **Bỏ qua một nguyên tắc Bắt buộc:** ghi lý do và người duyệt trong PRD, để đó là ngoại lệ có chủ đích chứ không phải bị quên.',
    '- **Nguyên tắc Nên:** áp dụng mặc định; không áp dụng thì ghi lý do.',
    '- **Khi review, trích mã:** "Vi phạm V3: câu lỗi chỉ nói sai, không nói cách sửa" — nhanh, rõ, tra được.',
  );

  /* ---------- 2. Mức độ ---------- */
  h(2, '2. Mức độ và cách trích dẫn', 'muc-do');
  p(mdTable(['Mức', 'Ý nghĩa', 'Số nguyên tắc'], Object.entries(LEVELS).map(([k, v]) => [`**${v.n}**`, v.d, String(cnt(k))])));
  p('Mỗi nguyên tắc có mã gồm chữ cái của nhóm và số thứ tự (F1, L2, V3…). Mã ổn định giữa các phiên bản để dùng trong ticket, PRD, chú thích thiết kế.');
  p(mdTable(['Mã', 'Nhóm', 'Phạm vi', 'Số nguyên tắc'], CATS.map((c) => [`**${c.k}**`, `[${c.n}](#nhom-${c.k.toLowerCase()})`, c.d, String(RULES.filter((r) => r.c === c.id).length)])));

  /* ---------- 3. Nguyên tắc vàng ---------- */
  h(2, `3. ${GOLDEN.length} nguyên tắc vàng`, 'nguyen-tac-vang');
  p('Nếu chỉ có thời gian làm một số việc, làm những việc này trước.');
  p(GOLDEN.map((id, i) => { const r = RULE_BY_ID[id]; return `${i + 1}. **${mdRef(id)} · ${mdInline(r.t)}** — ${mdInline(r.s)}`; }).join('\n'));

  /* ---------- 4. Hành trình ---------- */
  h(2, '4. Hành trình người dùng', 'hanh-trinh');
  p('Mỗi chặng có một nỗi lo riêng. Nguyên tắc tương ứng giải quyết nỗi lo đó.');
  p(mdTable(['Chặng', 'Người dùng làm gì', 'Họ lo điều gì', 'Nguyên tắc chính'], JOURNEY.map((j) => [`**${j.n}**`, j.d, `"${j.f}"`, j.r.join(', ')])));

  /* ---------- 5. Nguyên tắc chi tiết ---------- */
  h(2, `5. Nguyên tắc chi tiết`, 'nguyen-tac-chi-tiet');
  p(CATS.map((c) => `- **[${c.k} · ${c.n}](#nhom-${c.k.toLowerCase()})** — ${RULES.filter((r) => r.c === c.id).map((r) => mdRef(r.id)).join(' ')}`).join('\n'));
  CATS.forEach((c) => {
    h(3, `${c.k} · ${c.n}`, `nhom-${c.k.toLowerCase()}`);
    p(`_${mdInline(c.d)}_`);
    RULES.filter((r) => r.c === c.id).forEach((r) => L.push(mdRule(r)));
  });

  /* ---------- 6. Checklist ---------- */
  h(2, '6. Checklist review', 'checklist');
  p('Chép vào PRD, ticket hoặc mô tả pull request. Đánh dấu `[x]` khi đạt; mục không áp dụng thì ghi "(không áp dụng)".');
  h(3, `Checklist nhanh: ${cnt('m')} nguyên tắc Bắt buộc`, 'checklist-bat-buoc');
  p(RULES.filter((r) => r.lv === 'm').map((r) => `- [ ] **${r.id}** ${mdInline(r.chk)}`).join('\n'));
  h(3, `Checklist đầy đủ: ${RULES.length} nguyên tắc`, 'checklist-day-du');
  CATS.forEach((c) => {
    p(`**${c.k} · ${c.n}**`);
    p(RULES.filter((r) => r.c === c.id).map((r) => `- [ ] **${r.id}** (${LEVELS[r.lv].n}) ${mdInline(r.chk)}`).join('\n'));
  });

  /* ---------- 7. Kiểm thử ---------- */
  h(2, `7. Kịch bản kiểm thử`, 'kiem-thu');
  p('Chạy trên bản dựng thật, không chỉ trên thiết kế. Mỗi kịch bản ghi rõ nguyên tắc được kiểm.');
  TESTS.forEach((t, i) => {
    h(3, `Kịch bản ${i + 1} · ${mdInline(t.t)}`, `kich-ban-${i + 1}`);
    p(`- **Cách làm:** ${mdInline(t.how)}`, `- **Kết quả mong đợi:** ${mdInline(t.exp)}`, `- **Nguyên tắc:** ${t.r.map(mdRef).join(', ')}`);
  });

  /* ---------- 8. Câu chữ ---------- */
  h(2, '8. Câu chữ mẫu', 'cau-chu');
  h(3, 'Giọng văn', 'giong-van');
  p(mdTable(['Nguyên tắc', '❌ Không nên', '✅ Nên'], TONE.map((x) => [`**${x.t}**`, x.bad, x.good])));
  COPY.forEach((g) => {
    h(3, mdInline(g.n), `cau-chu-${g.id}`);
    if (g.d) p(mdInline(g.d));
    p(mdTable(['Mẫu câu', 'Ví dụ / ngữ cảnh'], g.items.map((it) => [it.t, [it.ex, it.ctx && `_${it.ctx}_`].filter(Boolean).join(' · ') || '—'])));
  });

  /* ---------- 9. Thư viện trường ---------- */
  h(2, '9. Thư viện trường', 'thu-vien-truong');
  p('Thông số bàn giao cho thiết kế và phát triển. Mã HTML là khung tối thiểu đúng chuẩn tiếp cận; thêm lớp CSS và JavaScript kiểm tra theo hệ thống của dự án.');
  FIELD_GROUPS.forEach(([gk, gn]) => {
    const fs = FIELD_LIB.filter((f) => f.g === gk);
    if (!fs.length) return;
    h(3, gn);
    fs.forEach((f) => {
      const m = fieldMeta(f);
      L.push(`<a id="truong-${f.k}"></a>`, `#### ${m.n}`, '', `Nguyên tắc: ${f.r.map(mdRef).join(', ')}`, '');
      const spec = [['Loại', `[[${m.type}]]`], m.mode && ['inputmode', `[[${m.mode}]]`], m.auto && ['autocomplete', `[[${m.auto}]]`], m.accept && ['accept', `[[${m.accept}]]`], f.other && ['Thuộc tính khác', f.other]].filter(Boolean);
      p(mdTable(['Thông số', 'Giá trị'], spec));
      [['Kiểm tra', f.check], ['Chuẩn hóa', f.norm], ['Câu lỗi', f.errs], ['Lưu ý', f.notes]].forEach(([n, a]) => { if (a && a.length) p(`**${n}:**`, '', mdList(a)); });
      const snip = (f.snippet || (m.c ? snippetFor(m.c) : '')).replace(/\bfl-/g, '');
      if (snip) p('```html', snip, '```');
    });
  });

  /* ---------- 10. Mẫu cấu trúc ---------- */
  h(2, '10. Mẫu cấu trúc form theo loại', 'mau-cau-truc');
  const tagN = { req: 'Bắt buộc', opt: 'Không bắt buộc', cond: 'Có điều kiện', later: 'Hỏi sau', derive: 'Suy ra, không hỏi' };
  p(`Điểm xuất phát khi lên khung form. Cột "Hỏi gì" phân loại: ${Object.values(tagN).join(' · ')}.`);
  BLUEPRINTS.forEach((b) => {
    h(3, mdInline(b.n), `mau-${b.id}`);
    p(`- **Ví dụ:** ${mdInline(b.ex)}`, `- **Mô hình:** ${mdInline(b.model)}`, `- **Thời gian điền:** ${mdInline(b.time)}`, `- **Nguyên tắc then chốt:** ${b.keys.map(mdRef).join(', ')}`);
    const rows = [];
    b.steps.forEach((s, i) => {
      if (!s.f.length) rows.push([`${i + 1}. ${s.n}`, '—', '—', s.note || '']);
      s.f.forEach((f, j) => rows.push([j ? '' : `${i + 1}. ${s.n}`, f[0], tagN[f[1]] || f[1], [j ? '' : s.note, f[2]].filter(Boolean).join(' · ')]));
    });
    p(mdTable(['Bước', 'Trường', 'Hỏi gì', 'Ghi chú'], rows));
    if (b.traps && b.traps.length) p('**Bẫy hay gặp:**', '', mdList(b.traps));
  });

  /* ---------- 11. Đo lường ---------- */
  h(2, '11. Đo lường sau ra mắt', 'do-luong');
  p('Chỉ số đầu ra cho biết form có "chạy" không; chỉ số đầu vào cho biết phải sửa ở đâu.');
  p(mdTable(['Chỉ số', 'Loại', 'Công thức', 'Ý nghĩa', 'Nguyên tắc'], METRICS.map((x) => [`**${x.k}**`, x.out ? 'Đầu ra' : 'Đầu vào', x.f, x.why, x.r.join(', ')])));
  h(3, 'Sự kiện cần gắn', 'su-kien');
  p(mdTable(['Sự kiện', 'Khi nào', 'Tham số'], EVENTS.map((e) => [`[[${e[0]}]]`, e[1], e[2]])));

  /* ---------- 12. Nguồn ---------- */
  h(2, '12. Nguồn tham khảo', 'nguon');
  p(Object.values(SRC).map(([n, u]) => `- [${n}](${u})`).join('\n'));
  p('**Luật UX:**', '', Object.values(LAWS).filter((x) => x.u).map((x) => `- [${x.n}](${x.u})`).join('\n'));
  p('---', `_Tệp này được sinh tự động từ dữ liệu của bản web ${MD_SITE}. Muốn sửa nội dung, sửa trong mã nguồn rồi xuất lại để hai bản luôn khớp._`);
  return L.join('\n').replace(/\n{3,}/g, '\n\n');
}

function downloadGuideMd() {
  const blob = new Blob([guideMarkdown()], { type: 'text/markdown;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'UX_form.md';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  toast('Đã tải UX_form.md');
}
