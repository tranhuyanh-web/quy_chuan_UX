# Chuẩn UX Form Đăng ký

Bộ tiêu chuẩn UX cho form đăng ký cuộc thi, hồ sơ, sự kiện: 79 nguyên tắc có demo chạy thật, form mẫu có chú thích, thư viện trường, câu chữ tiếng Việt, checklist đánh giá, kịch bản kiểm thử và công cụ ra quyết định.

Trang tĩnh thuần HTML/CSS/JS, không dùng framework, không cần cài thư viện.

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
| `build.sh` | Ghép `src/` thành `site/index.html` |
| `vercel.json` | Cấu hình build và header cho Vercel |

## Sửa nội dung

- Thêm/sửa nguyên tắc: `src/data-rules.js`, mảng `RULES`. Định dạng chữ: `[[code]]`, `**đậm**`, `%%nghiêng%%`, `{V3}` (liên kết tới nguyên tắc V3), `[chữ](#hash)`.
- Thêm câu chữ mẫu: `src/data-content.js`, mảng `COPY`.
- Thêm kịch bản kiểm thử: `src/data-content.js`, mảng `TESTS`.

## Chạy thử trên máy

```bash
bash build.sh
```

Mở `site/index.html` bằng trình duyệt.

## Triển khai

Repo được nối với Vercel: mỗi lần đẩy code lên nhánh `main`, Vercel tự chạy `bash build.sh` và phục vụ thư mục `site/`. Không cần build tay trước khi đẩy.

Dữ liệu người dùng (kết quả đánh giá, bản nháp form mẫu) chỉ lưu trong trình duyệt của từng người (localStorage), không gửi về máy chủ.
