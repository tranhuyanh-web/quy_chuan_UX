#!/usr/bin/env bash
# Ghép các phần trong src/ thành:
#   site/index.html  — bản chạy độc lập (Vercel phục vụ thư mục này)
#   dist/chuan-ux-form.html — bản dùng cho claude.ai Artifact (không có khung html/head/body)
#   dist/test.html   — bản test cục bộ có khung HTML
set -e
cd "$(dirname "$0")"
mkdir -p dist
OUT=dist/chuan-ux-form.html
{
  cat src/head.html
  cat src/body.html
  echo '<script>'
  echo '"use strict";'
  cat src/util.js src/data-rules.js src/data-content.js src/engine.js src/app-views.js src/app-more.js
  echo '</script>'
} > "$OUT"
{
  echo '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
  echo '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>'
  cat "$OUT"
  echo '</body></html>'
} > dist/test.html
# Bản độc lập cho Vercel / hosting tĩnh
mkdir -p site
FAVICON="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 34'%3E%3Crect x='1' y='1' width='32' height='32' rx='9' fill='%23131720'/%3E%3Crect x='7' y='15' width='20' height='10' rx='2.5' fill='none' stroke='white' stroke-width='2'/%3E%3Crect x='7' y='9' width='12' height='2.6' rx='1.3' fill='white' opacity='.75'/%3E%3Ccircle cx='26.5' cy='9.5' r='4' fill='%23FFE15C'/%3E%3C/svg%3E"
{
  echo '<!doctype html>'
  echo '<html lang="vi"><head><meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
  echo "<link rel=\"icon\" href=\"$FAVICON\">"
  echo '<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#161A21" media="(prefers-color-scheme: dark)">'
  echo '<meta property="og:title" content="Chuẩn UX Form Đăng ký"><meta property="og:description" content="Nguyên tắc, form mẫu, thư viện trường, câu chữ tiếng Việt và checklist cho form đăng ký cuộc thi, hồ sơ, sự kiện."><meta property="og:type" content="website">'
  echo '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>'
  grep -v 'claude:viewport-fit-sides' src/head.html
  echo '</head><body>'
  cat src/body.html
  echo '<script>'
  echo '"use strict";'
  cat src/util.js src/data-rules.js src/data-content.js src/engine.js src/app-views.js src/app-more.js
  echo '</script>'
  echo '</body></html>'
} > site/index.html
wc -c "$OUT" site/index.html
