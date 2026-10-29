/* Máy chủ giả cho form mẫu /samples/multi-step: nhận hồ sơ, trả mã hồ sơ. Không lưu gì. */
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.statusCode = 405; return res.end(JSON.stringify({ ok: false, error: 'Chỉ nhận POST' })); }
  for await (const c of req) { if (c.length > 25 * 1024 * 1024) break; } /* đọc hết rồi bỏ */
  const code = 'YT26-' + String(Math.floor(10000 + Math.random() * 89999));
  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true, code }));
}
