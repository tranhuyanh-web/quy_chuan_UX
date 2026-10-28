/* Xuất UX_form.md từ bản build (site/index.html) bằng chính hàm guideMarkdown() của trang.
   Chạy: bash build.sh && node scripts/export-md.cjs && bash build.sh
   Cần Playwright (đã có sẵn trong môi trường phát triển); đặt CHROME_PATH nếu muốn dùng Chrome khác. */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const root = path.join(__dirname, '..');
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('file://' + path.join(root, 'site/index.html'));
  await page.waitForFunction(() => typeof guideMarkdown === 'function');
  const md = await page.evaluate(() => guideMarkdown());
  await browser.close();
  if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
  fs.writeFileSync(path.join(root, 'UX_form.md'), md);
  console.log(`UX_form.md: ${md.length.toLocaleString()} ký tự, ${md.split('\n').length.toLocaleString()} dòng`);
})();
