# Chuẩn UX Form Đăng ký

Bộ tiêu chuẩn UX cho form đăng ký cuộc thi, hồ sơ, sự kiện: 79 nguyên tắc có demo chạy thật, form mẫu có chú thích, thư viện trường, câu chữ tiếng Việt, checklist đánh giá, kịch bản kiểm thử và công cụ ra quyết định.

Giao diện là trang tĩnh thuần HTML/CSS/JS, không dùng framework. Tính năng **Chấm tự động** dùng hai hàm Vercel trong `api/`.

## Cấu trúc

| Tệp | Nội dung |
|---|---|
| `src/head.html` | Tiêu đề trang, font, toàn bộ CSS (token màu sáng/tối ở đầu tệp) |
| `src/body.html` | Khung trang: thanh trên, điều hướng, vùng nội dung |
| `src/util.js` | Biểu tượng, hàm tiện ích, sao chép, hộp thoại |
| `src/data-rules.js` | **Nguyên tắc** (79 mục), nhóm, mức độ, nguồn tham khảo, 10 nguyên tắc vàng, hành trình |
| `src/data-content.js` | Danh mục tỉnh/thành, trường học, **câu chữ mẫu**, kịch bản kiểm thử, bản mẫu cấu trúc, minh họa Nên/Không nên |
| `src/engine.js` | Bộ máy form dùng chung: chuẩn hóa, kiểm tra, các loại trường, tóm tắt lỗi |
| `src/app-views.js` | Trang chủ, danh sách và chi tiết nguyên tắc, các demo |
| `src/app-more.js` | Form mẫu, thư viện trường, câu chữ, đánh giá, công cụ, tìm kiếm, điều hướng |
| `src/analyzer.js` | **Bộ chấm tự động**: đọc HTML, nhận diện trường, chấm từng nguyên tắc (Đạt / Chưa đạt / Cần xem lại / Cần thử tay) |
| `src/app-auto.js` | Trang Chấm tự động: nhập đường dẫn, tệp HTML, mã HTML; báo cáo; đưa vào checklist |
| `src/samples/bad-form.html` | Form ví dụ có nhiều lỗi (dùng cho nút "Thử nhanh" và để kiểm thử) |
| `api/fetch.js` | Hàm Vercel: đọc HTML của một đường dẫn (chế độ Nhanh) |
| `api/render.js` | Hàm Vercel: mở trang bằng Chromium ẩn, đo cỡ chữ, vùng chạm, tương phản, bố cục, focus, chụp màn hình (chế độ Đầy đủ) |
| `lib/guard.js` | An toàn cho hai hàm trên: chỉ http/https, chặn địa chỉ nội bộ, chỉ nhận yêu cầu từ chính trang |
| `scripts/dev-server.mjs` | Máy chủ thử cục bộ, chạy cả trang và hàm `api/` |
| `build.sh` | Ghép `src/` thành `site/index.html` |
| `vercel.json` | Cấu hình build và header cho Vercel |

## Sửa nội dung

- Thêm/sửa nguyên tắc: `src/data-rules.js`, mảng `RULES`. Định dạng chữ: `[[code]]`, `**đậm**`, `%%nghiêng%%`, `{V3}` (liên kết tới nguyên tắc V3), `[chữ](#hash)`.
- Thêm câu chữ mẫu: `src/data-content.js`, mảng `COPY`.
- Thêm kịch bản kiểm thử: `src/data-content.js`, mảng `TESTS`.

## Chạy thử trên máy

```bash
npm install
bash build.sh
CHROME_PATH=/đường/dẫn/tới/chrome FX_ALLOW_PRIVATE=1 node scripts/dev-server.mjs
```

Mở http://127.0.0.1:3000. `FX_ALLOW_PRIVATE=1` cho phép chấm các trang chạy trên máy (chỉ dùng khi thử cục bộ).

## Chấm tự động hoạt động thế nào

- **Đường dẫn, chế độ Đầy đủ:** `api/render` mở trang bằng Chromium ở khung máy tính (1280px) để đo bố cục cột, rồi khung điện thoại (390px) để đo cỡ chữ, vùng chạm, tương phản, thử phím Tab và chụp màn hình. Nếu không mở được, trang tự chuyển sang chế độ Nhanh.
- **Đường dẫn, chế độ Nhanh:** `api/fetch` chỉ tải mã HTML, không chạy JavaScript của trang.
- **Tệp HTML / dán mã:** phân tích ngay trên trình duyệt, không gửi đi đâu. Hỗ trợ nhiều tệp (mỗi tệp một bước) và tệp `.mhtml`.
- Công cụ **không bao giờ bấm gửi form**. Các tiêu chí về hành vi (báo lỗi khi gõ, gửi trùng, trang xác nhận…) được đánh dấu "Cần thử tay" kèm kịch bản kiểm thử.
- Biến môi trường tùy chọn `FX_TEST_TOKEN`: cho phép gọi `GET /api/render?url=…&token=…` để kiểm thử từ ngoài trình duyệt.

## Triển khai

Repo được nối với Vercel: mỗi lần đẩy code lên nhánh `main`, Vercel tự chạy `bash build.sh` và phục vụ thư mục `site/`. Không cần build tay trước khi đẩy.

Dữ liệu người dùng (kết quả đánh giá, bản nháp form mẫu) chỉ lưu trong trình duyệt của từng người (localStorage), không gửi về máy chủ.
