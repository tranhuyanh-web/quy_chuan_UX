# Chuẩn UX Form Đăng ký

Bộ nguyên tắc thiết kế form đăng ký (dự thi, hồ sơ xét tuyển, sự kiện, đăng ký nhanh…) cho đội sản phẩm: PM, UX/UI, Dev, QA. Tập trung vào thao tác cơ bản để người dùng điền nhanh, ít sai, hiểu ngay phải làm gì.

- **Phiên bản:** 1.0 · 10/2026 · xuất ngày 28/10/2026
- **Quy mô:** 79 nguyên tắc · 14 nhóm · 40 Bắt buộc · 35 Nên · 4 Cân nhắc
- **Bản web tương tác:** https://chuan-ux-form.vercel.app (demo chạy thật, form mẫu, chấm form tự động từ link hoặc tệp HTML)
- **Cơ sở:** Laws of UX, nguyên tắc Watkinson, WCAG 2.2 mức AA, GOV.UK Design System, NN/g, Baymard, web.dev

<a id="muc-luc"></a>
## Mục lục

1. [Áp dụng vào dự án](#ap-dung)
2. [Mức độ và cách trích dẫn](#muc-do)
3. [10 nguyên tắc vàng](#nguyen-tac-vang)
4. [Hành trình người dùng](#hanh-trinh)
5. [Nguyên tắc chi tiết (79)](#nguyen-tac-chi-tiet)
6. [Checklist review](#checklist)
7. [Kịch bản kiểm thử (18)](#kiem-thu)
8. [Câu chữ mẫu](#cau-chu)
9. [Thư viện trường (22)](#thu-vien-truong)
10. [Mẫu cấu trúc form theo loại](#mau-cau-truc)
11. [Đo lường sau ra mắt](#do-luong)
12. [Nguồn tham khảo](#nguon)

<a id="ap-dung"></a>
## 1. Áp dụng vào dự án

| Giai đoạn | Ai | Làm gì | Dùng phần |
| --- | --- | --- | --- |
| Khởi động | PM | Chọn mẫu cấu trúc gần nhất. Rà từng trường theo F2: Ai dùng? Dùng để làm gì? Không có thì sao? Hỏi sau được không? Quyết định một trang hay nhiều bước theo F3. | §10, F2, F3 |
| Viết PRD | PM | Chép tiêu chí kiểm tra của các nguyên tắc liên quan vào Acceptance criteria, ghi kèm mã nguyên tắc. | §6 |
| Thiết kế | UX/UI | Áp nguyên tắc, ghi mã (ví dụ "V3") vào chú thích trên file thiết kế. Dùng câu chữ mẫu cho nhãn, gợi ý, lỗi. | §5, §8 |
| Phát triển | Dev | Dùng thông số HTML (type, inputmode, autocomplete), quy tắc kiểm tra, chuẩn hóa và mã mẫu của từng trường. | §9 |
| Kiểm thử | QA | Chạy 18 kịch bản, ưu tiên bàn phím, điện thoại thật, mạng chậm. | §7 |
| Trước ra mắt | Cả nhóm | Review theo checklist. Chấm tự động trên https://chuan-ux-form.vercel.app/#cham-tu-dong để bắt lỗi kỹ thuật nhanh. | §6 |
| Sau ra mắt | PM, Data | Gắn sự kiện, theo dõi tỷ lệ hoàn thành, tỷ lệ lỗi theo trường, rơi theo bước. Sửa trường lỗi nhiều nhất trước. | §11 |

**Quy ước ra quyết định (đề xuất):**

- **Definition of Done:** đạt toàn bộ nguyên tắc **Bắt buộc** có áp dụng cho form đó.
- **Bỏ qua một nguyên tắc Bắt buộc:** ghi lý do và người duyệt trong PRD, để đó là ngoại lệ có chủ đích chứ không phải bị quên.
- **Nguyên tắc Nên:** áp dụng mặc định; không áp dụng thì ghi lý do.
- **Khi review, trích mã:** "Vi phạm V3: câu lỗi chỉ nói sai, không nói cách sửa" — nhanh, rõ, tra được.

<a id="muc-do"></a>
## 2. Mức độ và cách trích dẫn

| Mức | Ý nghĩa | Số nguyên tắc |
| --- | --- | --- |
| **Bắt buộc** | Thiếu là lỗi trải nghiệm hoặc lỗi tiếp cận. Phải làm. | 40 |
| **Nên** | Thực hành tốt. Áp dụng, trừ khi có lý do rõ ràng. | 35 |
| **Cân nhắc** | Nâng cao. Áp dụng khi phù hợp ngữ cảnh và nguồn lực. | 4 |

Mỗi nguyên tắc có mã gồm chữ cái của nhóm và số thứ tự (F1, L2, V3…). Mã ổn định giữa các phiên bản để dùng trong ticket, PRD, chú thích thiết kế.

| Mã | Nhóm | Phạm vi | Số nguyên tắc |
| --- | --- | --- | --- |
| **F** | [Cấu trúc & luồng](#nhom-f) | Hỏi gì, theo thứ tự nào, một trang hay nhiều bước. | 7 |
| **L** | [Nhãn & câu chữ](#nhom-l) | Nhãn, gợi ý, đánh dấu bắt buộc và giọng văn. | 7 |
| **I** | [Ô nhập liệu](#nhom-i) | Bàn phím, tự động điền, định dạng, họ tên, ngày sinh. | 10 |
| **C** | [Lựa chọn](#nhom-c) | Radio, checkbox, danh sách tìm kiếm, địa chỉ hành chính. | 6 |
| **V** | [Kiểm tra & báo lỗi](#nhom-v) | Kiểm tra lúc nào, báo lỗi ở đâu, viết lỗi thế nào. | 9 |
| **B** | [Nút & hành động](#nhom-b) | Nhãn nút, thứ bậc, vị trí, trạng thái đang gửi. | 6 |
| **U** | [Tải tệp lên](#nhom-u) | Yêu cầu tệp, kiểm tra, tiến trình, xem trước. | 5 |
| **D** | [Lưu nháp & thời hạn](#nhom-d) | Tự lưu, tiếp tục sau, hết phiên, hạn chót. | 5 |
| **R** | [Xem lại & gửi](#nhom-r) | Trang xem lại, đồng ý điều khoản, xác thực OTP. | 3 |
| **K** | [Sau khi gửi](#nhom-k) | Trang xác nhận, email, theo dõi hồ sơ. | 3 |
| **T** | [Tình huống đặc thù](#nhom-t) | Câu hỏi điều kiện, đội nhóm, người giám hộ, đóng/mở cổng. | 5 |
| **M** | [Trên điện thoại](#nhom-m) | Cỡ chữ, bàn phím ảo, phím Enter, mạng chậm. | 4 |
| **A** | [Tiếp cận](#nhom-a) | Bàn phím, trình đọc màn hình, tương phản, CAPTCHA. | 6 |
| **P** | [Tin cậy & dữ liệu cá nhân](#nhom-p) | Thu thập tối thiểu, đồng ý, tín hiệu tin cậy. | 3 |

<a id="nguyen-tac-vang"></a>
## 3. 10 nguyên tắc vàng

Nếu chỉ có thời gian làm một số việc, làm những việc này trước.

1. **[F2](#f2) · Chỉ hỏi những gì thật sự cần** — Mỗi trường phải trả lời được: ai dùng dữ liệu này, dùng để làm gì, có cần ngay lúc đăng ký không.
2. **[F1](#f1) · Nói trước những gì cần chuẩn bị** — Trước khi vào form, cho biết thời gian ước tính, giấy tờ/tệp cần có, điều kiện tham gia và hạn chót.
3. **[L1](#l1) · Mọi trường đều có nhãn hiển thị, đặt trên ô** — Nhãn luôn nhìn thấy, nằm ngay trên ô nhập, căn trái. Bấm vào nhãn thì con trỏ vào ô.
4. **[F5](#f5) · Bố cục một cột** — Xếp các trường thành một cột dọc. Chỉ đặt cạnh nhau những ô ngắn thuộc cùng một thông tin.
5. **[I1](#i1) · Mở đúng bàn phím trên điện thoại** — Dùng `type` và `inputmode` phù hợp. Không dùng `type="number"` cho số giấy tờ, số điện thoại, mã OTP.
6. **[I3](#i3) · Chấp nhận nhiều cách nhập, hệ thống tự chuẩn hóa** — Cho phép khoảng trắng, dấu chấm, gạch ngang, +84. Hệ thống tự làm sạch thay vì bắt người dùng sửa.
7. **[V1](#v1) · Kiểm tra đúng lúc: khi rời ô; sửa đúng là hết lỗi ngay** — Không báo lỗi khi người dùng đang gõ dở. Kiểm tra khi rời ô; khi ô đang báo lỗi, cập nhật ngay khi sửa đúng.
8. **[V3](#v3) · Thông báo lỗi nói rõ sai gì và sửa thế nào** — Công thức: [vấn đề cụ thể] + [cách sửa hoặc ví dụ]. Lịch sự, không đổ lỗi, không mã lỗi kỹ thuật.
9. **[V5](#v5) · Không bao giờ làm mất dữ liệu đã nhập** — Lỗi, tải lại trang, mất mạng, quay lại bước trước: dữ liệu phải còn nguyên.
10. **[K1](#k1) · Trang xác nhận rõ ràng: mã hồ sơ và bước tiếp theo** — "Đăng ký thành công" + mã hồ sơ + tóm tắt + mốc thời gian tiếp theo + kênh hỗ trợ.

<a id="hanh-trinh"></a>
## 4. Hành trình người dùng

Mỗi chặng có một nỗi lo riêng. Nguyên tắc tương ứng giải quyết nỗi lo đó.

| Chặng | Người dùng làm gì | Họ lo điều gì | Nguyên tắc chính |
| --- | --- | --- | --- |
| **Tìm hiểu** | Đọc thể lệ, xem còn hạn không, mình có đủ điều kiện không. | "Đây có phải trang chính thức không?" | T4, D5, P2 |
| **Chuẩn bị** | Biết cần những gì, mất bao lâu, gom giấy tờ và tệp. | "Mình có đủ thứ cần thiết chưa?" | F1, F2, F7 |
| **Điền thông tin** | Nhập từng trường, chọn lựa chọn, sửa lỗi tại chỗ. | "Ô này hỏi gì? Nhập thế nào cho đúng?" | F5, L1, I1, I3, V1 |
| **Tải tệp** | Chọn ảnh, bài thi; chờ tải lên; kiểm tra đúng tệp. | "Tệp này có bị từ chối không?" | U1, U2, U3 |
| **Xem lại** | Rà lại toàn bộ, sửa nhanh chỗ sai, đọc cam kết. | "Mình có nhập nhầm gì không?" | R1, R2 |
| **Gửi** | Bấm gửi, chờ phản hồi, xử lý lỗi nếu có. | "Đã gửi được chưa? Có bị gửi trùng?" | B4, V4, V8 |
| **Xác nhận & theo dõi** | Nhận mã hồ sơ, email xác nhận, biết bước tiếp theo. | "Bao giờ có kết quả? Hỏi ai?" | K1, K2, K3 |

<a id="nguyen-tac-chi-tiet"></a>
## 5. Nguyên tắc chi tiết

- **[F · Cấu trúc & luồng](#nhom-f)** — [F1](#f1) [F2](#f2) [F3](#f3) [F4](#f4) [F5](#f5) [F6](#f6) [F7](#f7)
- **[L · Nhãn & câu chữ](#nhom-l)** — [L1](#l1) [L2](#l2) [L3](#l3) [L4](#l4) [L5](#l5) [L6](#l6) [L7](#l7)
- **[I · Ô nhập liệu](#nhom-i)** — [I1](#i1) [I2](#i2) [I3](#i3) [I4](#i4) [I5](#i5) [I6](#i6) [I7](#i7) [I8](#i8) [I9](#i9) [I10](#i10)
- **[C · Lựa chọn](#nhom-c)** — [C1](#c1) [C2](#c2) [C3](#c3) [C4](#c4) [C5](#c5) [C6](#c6)
- **[V · Kiểm tra & báo lỗi](#nhom-v)** — [V1](#v1) [V2](#v2) [V3](#v3) [V4](#v4) [V5](#v5) [V6](#v6) [V7](#v7) [V8](#v8) [V9](#v9)
- **[B · Nút & hành động](#nhom-b)** — [B1](#b1) [B2](#b2) [B3](#b3) [B4](#b4) [B5](#b5) [B6](#b6)
- **[U · Tải tệp lên](#nhom-u)** — [U1](#u1) [U2](#u2) [U3](#u3) [U4](#u4) [U5](#u5)
- **[D · Lưu nháp & thời hạn](#nhom-d)** — [D1](#d1) [D2](#d2) [D3](#d3) [D4](#d4) [D5](#d5)
- **[R · Xem lại & gửi](#nhom-r)** — [R1](#r1) [R2](#r2) [R3](#r3)
- **[K · Sau khi gửi](#nhom-k)** — [K1](#k1) [K2](#k2) [K3](#k3)
- **[T · Tình huống đặc thù](#nhom-t)** — [T1](#t1) [T2](#t2) [T3](#t3) [T4](#t4) [T5](#t5)
- **[M · Trên điện thoại](#nhom-m)** — [M1](#m1) [M2](#m2) [M3](#m3) [M4](#m4)
- **[A · Tiếp cận](#nhom-a)** — [A1](#a1) [A2](#a2) [A3](#a3) [A4](#a4) [A5](#a5) [A6](#a6)
- **[P · Tin cậy & dữ liệu cá nhân](#nhom-p)** — [P1](#p1) [P2](#p2) [P3](#p3)

<a id="nhom-f"></a>
### F · Cấu trúc & luồng

_Hỏi gì, theo thứ tự nào, một trang hay nhiều bước._

<a id="f1"></a>
#### F1 · Nói trước những gì cần chuẩn bị

**Bắt buộc** · Cấu trúc & luồng

> Trước khi vào form, cho biết thời gian ước tính, giấy tờ/tệp cần có, điều kiện tham gia và hạn chót.

**Vì sao:** Người dùng bỏ dở nhiều nhất khi đến giữa form mới phát hiện mình thiếu thứ gì đó: ảnh chân dung, bản scan có chữ ký, bài thi đúng định dạng. Biết trước giúp họ chọn "điền ngay" hay "chuẩn bị rồi quay lại", và họ quay lại thật. Đây là cách đặt đúng kỳ vọng ngay từ đầu.

**Cách làm:**

1. Đặt khối **Trước khi bắt đầu** ở trang giới thiệu hoặc đầu form.
2. Liệt kê điều kiện tham gia (độ tuổi, đối tượng) và tài liệu cần có, kèm quy cách: định dạng, dung lượng, kích thước.
3. Ghi thời gian điền ước tính và số bước, tên từng bước.
4. Ghi hạn chót có giờ, ngày, múi giờ. Xem [D5](#d5).
5. Nếu có lưu nháp, nói rõ: "Bạn có thể lưu và tiếp tục sau."

**✅ Nên**

- "Mất khoảng 8 phút · Cần: ảnh chân dung (JPG/PNG, tối đa 5 MB), bài dự thi (PDF, tối đa 20 MB) · Hạn chót 23:59, 30/11/2026"

**❌ Không nên**

- Mở đầu ngay bằng ô "Họ và tên", đến bước 3 mới đòi bản PDF có chữ ký.

**Tiêu chí kiểm tra:** Người dùng biết trước thời gian, tài liệu cần chuẩn bị và hạn chót trước khi bắt đầu điền?

**Cơ sở:** Watkinson #4 · Kỳ vọng  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [D5](#d5) · [F3](#f3) · [T4](#t4)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="f2"></a>
#### F2 · Chỉ hỏi những gì thật sự cần

**Bắt buộc** · Cấu trúc & luồng

> Mỗi trường phải trả lời được: ai dùng dữ liệu này, dùng để làm gì, có cần ngay lúc đăng ký không.

**Vì sao:** Mỗi trường thêm vào là thêm thời gian, thêm khả năng sai, thêm một lý do để bỏ cuộc. Dữ liệu "cứ hỏi cho chắc" còn tạo rủi ro khi lưu trữ dữ liệu cá nhân. Câu hỏi tốt nhất là câu không cần hỏi: hệ thống gánh độ phức tạp thay người dùng.

**Cách làm:**

1. Lập danh sách trường. Với mỗi trường, hỏi: **Ai dùng? Dùng để làm gì? Không có thì sao? Hỏi sau được không?**
2. Bỏ trường không ai dùng. Trường "để thống kê" chuyển thành không bắt buộc hoặc khảo sát sau khi gửi.
3. Dời thông tin chỉ cần ở vòng sau (CCCD để trao giải, tài khoản ngân hàng, size áo) đến lúc người dùng được chọn.
4. Suy ra thay vì hỏi: tuổi từ ngày sinh, tỉnh từ phường/xã, trưởng nhóm từ người đăng ký.
5. Dùng công cụ [Có nên hỏi trường này?](https://chuan-ux-form.vercel.app/#cong-cu-truong) để rà từng trường.

**✅ Nên**

- Vòng sơ loại chỉ hỏi 8 trường. Thông tin nhận giải hỏi khi thí sinh vào chung kết.

**❌ Không nên**

- Hỏi "Thu nhập hàng tháng", "Tình trạng hôn nhân" trong form đăng ký cuộc thi ý tưởng.
- Hỏi "Tuổi" trong khi đã có "Ngày sinh".

**Tiêu chí kiểm tra:** Mọi trường đều có mục đích sử dụng rõ ràng và cần thiết ngay tại thời điểm đăng ký?

**Cơ sở:** [Luật Tesler](https://lawsofux.com/teslers-law/); Watkinson #5 · Không tốn sức  
**Nguồn:** [Caroline Jarrett · The question protocol](https://www.uxmatters.com/mt/archives/2010/06/the-question-protocol-how-to-make-sure-every-form-field-is-necessary.php); [GOV.UK · Question pages](https://design-system.service.gov.uk/patterns/question-pages/)  
**Liên quan:** [P1](#p1) · [F3](#f3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="f3"></a>
#### F3 · Chọn đúng mô hình: một trang hay nhiều bước

**Nên** · Cấu trúc & luồng

> Form ngắn, một chủ đề: một trang. Form dài, nhiều nhóm thông tin, có tải tệp: chia bước có tên rõ ràng.

**Vì sao:** Một trang giúp nhìn toàn cảnh và sửa nhanh. Nhiều bước giảm cảm giác quá tải, cho phép lưu theo bước và bắt lỗi sớm. Chia sai (mỗi bước một trường, hoặc một trang 40 trường) đều làm tăng tỷ lệ bỏ dở.

**Cách làm:**

1. Dưới khoảng 8–10 trường, một chủ đề: một trang.
2. Có 2–3 nhóm thông tin tách biệt (thí sinh, liên hệ, bài dự thi) hoặc có tải tệp: chia bước, mỗi bước một nhóm.
3. Mỗi bước nên có 3–7 trường. Tên bước là danh từ dễ hiểu, ví dụ "Thông tin liên hệ".
4. Form nhiều bước luôn có trang xem lại trước khi gửi ([R1](#r1)).
5. Dùng công cụ [Một trang hay nhiều bước?](https://chuan-ux-form.vercel.app/#cong-cu-mo-hinh) để quyết định nhanh.

**✅ Nên**

- Đăng ký sự kiện 6 trường: một trang. Hồ sơ học bổng 25 trường, 3 tệp: 4 bước + xem lại.

**❌ Không nên**

- Wizard 9 bước, mỗi bước 1–2 trường.
- Một trang dài 35 trường kèm 3 ô tải tệp.

**Tiêu chí kiểm tra:** Mô hình một trang hay nhiều bước phù hợp với số lượng và tính chất thông tin cần hỏi?

**Cơ sở:** [Luật Miller](https://lawsofux.com/millers-law/); [Luật Hick](https://lawsofux.com/hicks-law/)  
**Nguồn:** [GOV.UK · Question pages](https://design-system.service.gov.uk/patterns/question-pages/); [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/)  
**Liên quan:** [F6](#f6) · [R1](#r1) · [D1](#d1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="f4"></a>
#### F4 · Nhóm trường theo chủ đề, sắp theo thứ tự tự nhiên

**Nên** · Cấu trúc & luồng

> Gom trường liên quan dưới một tiêu đề, xếp theo thứ tự người dùng nghĩ: dễ trước khó sau, chung trước riêng sau.

**Vì sao:** Thứ tự quen thuộc (họ tên → ngày sinh → liên hệ → địa chỉ) giúp người dùng điền theo quán tính. Đặt câu hỏi khó hoặc nhạy cảm lên đầu khiến họ chùn bước trước khi kịp "đầu tư" vào form.

**Cách làm:**

1. Thứ tự gợi ý: Thông tin cá nhân → Liên hệ → Học vấn/Đơn vị → Bài dự thi/Hồ sơ → Cam kết.
2. Dùng tiêu đề nhóm (`fieldset` + `legend` hoặc heading). Khoảng cách giữa các nhóm lớn hơn khoảng cách giữa các trường.
3. Câu dễ trả lời lên trước. Câu cần suy nghĩ (bài luận, mô tả) để sau.
4. Họ tên, ngày sinh đi liền nhau; số điện thoại và email đi liền nhau.

**✅ Nên**

- Nhóm "Liên hệ": Email, Số điện thoại, Tỉnh/Thành phố.

**❌ Không nên**

- Hỏi "Mô tả ý tưởng (500 từ)" ngay trường đầu tiên.
- Email ở bước 1, số điện thoại ở bước 3.

**Tiêu chí kiểm tra:** Các trường liên quan được nhóm dưới tiêu đề rõ ràng và sắp xếp theo thứ tự tự nhiên?

**Cơ sở:** [Luật Miller](https://lawsofux.com/millers-law/); [Luật Gần nhau](https://lawsofux.com/law-of-proximity/)  
**Nguồn:** [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/)  
**Liên quan:** [F3](#f3) · [F5](#f5)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="f5"></a>
#### F5 · Bố cục một cột

**Bắt buộc** · Cấu trúc & luồng

> Xếp các trường thành một cột dọc. Chỉ đặt cạnh nhau những ô ngắn thuộc cùng một thông tin.

**Vì sao:** Hai cột khiến mắt đi zíc-zắc, người dùng dễ sót trường ở cột phải, thứ tự Tab không còn hiển nhiên. Một cột có một đường đọc duy nhất từ trên xuống. Kiểm thử của Baymard và CXL đều cho thấy form một cột được hoàn thành nhanh hơn, ít sót hơn.

**Cách làm:**

1. Mỗi hàng một trường, nhãn nằm trên ô.
2. Ngoại lệ: Ngày/Tháng/Năm; Mã vùng + Số điện thoại.
3. Chiều rộng vùng form trên máy tính khoảng 560–640px; không kéo ô dài hết màn hình 1440px.

**✅ Nên**

- Một cột, nhãn trên ô, nút chính thẳng hàng với cạnh trái các ô.

**❌ Không nên**

- Hai cột "Họ tên | Email", "Số điện thoại | Trường học" trên máy tính.

**Tiêu chí kiểm tra:** Form có bố cục một cột (trừ các ô ngắn cùng một thông tin như Ngày/Tháng/Năm)?

**Cơ sở:** [Luật Gần nhau](https://lawsofux.com/law-of-proximity/)  
**Nguồn:** [Baymard Institute · Checkout usability](https://baymard.com/research/checkout-usability); [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/)  
**Kiểm thử:** [Kịch bản 10 · Màn hình 360px và phóng to 200%](#kich-ban-10)  
**Liên quan:** [F4](#f4) · [I5](#i5) · [B3](#b3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="f6"></a>
#### F6 · Cho biết đang ở bước nào, còn bao nhiêu bước

**Nên** · Cấu trúc & luồng

> Form nhiều bước hiển thị tên bước hiện tại, tổng số bước, và cho quay lại bước trước mà không mất dữ liệu.

**Vì sao:** Không biết còn bao lâu là nguồn lo lắng lớn. Thanh tiến trình có tên bước còn báo trước loại thông tin sắp hỏi, nên người dùng chuẩn bị tinh thần tốt hơn.

**Cách làm:**

1. Hiển thị bằng chữ: "Bước 2/4 · Thông tin liên hệ", không chỉ chấm tròn.
2. Trên điện thoại dùng dạng rút gọn "Bước 2/4" + tên bước; tránh stepper ngang 5–6 mục bị cắt chữ.
3. Bước đã xong bấm được để quay lại. Không cho nhảy tới bước chưa tới nếu bước đó phụ thuộc dữ liệu trước.
4. Không tính trang xác nhận là một bước.
5. Nút "Quay lại" và nút Back của trình duyệt đều giữ nguyên dữ liệu.

**✅ Nên**

- "Bước 2/4 · Thông tin liên hệ" + thanh 4 đoạn + tên các bước.

**❌ Không nên**

- 4 chấm tròn không chữ.
- Bấm Back của trình duyệt thì thoát khỏi form và mất dữ liệu.

**Tiêu chí kiểm tra:** Người dùng luôn biết mình ở bước nào, còn bao nhiêu bước, và quay lại được mà không mất dữ liệu?

**Cơ sở:** Watkinson #6 · Không gây stress; Watkinson #9 · Quyền kiểm soát  
**Nguồn:** [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/)  
**Kiểm thử:** [Kịch bản 9 · Nút Back của trình duyệt](#kich-ban-9)  
**Liên quan:** [F3](#f3) · [V5](#v5) · [R1](#r1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="f7"></a>
#### F7 · Cho đăng ký trước, tạo tài khoản sau

**Cân nhắc** · Cấu trúc & luồng

> Không chặn bằng bước đăng nhập/tạo tài khoản ngay đầu. Nếu cần tài khoản, tạo từ email/SĐT đã nhập.

**Vì sao:** Bức tường đăng nhập ở đầu là điểm rơi lớn. Đây là mục tiêu đối nghịch điển hình: người dùng muốn đăng ký nhanh, tổ chức muốn có tài khoản. Trong khảo sát của Baymard về mua hàng trực tuyến, "bị bắt tạo tài khoản" luôn nằm trong nhóm lý do bỏ dở hàng đầu, khoảng 1/4 số người bỏ dở.

**Cách làm:**

1. Cho điền form trước. Cuối form đề xuất "Tạo mật khẩu để theo dõi hồ sơ" (không bắt buộc), hoặc gửi liên kết quản lý hồ sơ qua email.
2. Nếu bắt buộc đăng nhập (cuộc thi nội bộ), cho đăng nhập nhanh bằng tài khoản sẵn có hoặc SĐT + OTP, rồi quay lại đúng chỗ trong form.
3. Người dùng đã đăng nhập: điền sẵn họ tên, email, SĐT ([T5](#t5)).

**✅ Nên**

- Gửi hồ sơ xong, trang xác nhận có nút "Tạo mật khẩu để theo dõi hồ sơ".

**❌ Không nên**

- Trang đầu tiên là form đăng ký tài khoản 8 trường, sau đó mới tới form dự thi.

**Tiêu chí kiểm tra:** Người dùng bắt đầu điền được mà không bị chặn bởi bước tạo tài khoản bắt buộc?

**Cơ sở:** Watkinson #2 · Mục tiêu đối nghịch; Watkinson #5 · Không tốn sức  
**Nguồn:** [Baymard Institute · Checkout usability](https://baymard.com/research/checkout-usability); [web.dev · Sign-up form best practices](https://web.dev/articles/sign-up-form-best-practices)  
**Liên quan:** [T5](#t5) · [K3](#k3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="nhom-l"></a>
### L · Nhãn & câu chữ

_Nhãn, gợi ý, đánh dấu bắt buộc và giọng văn._

<a id="l1"></a>
#### L1 · Mọi trường đều có nhãn hiển thị, đặt trên ô

**Bắt buộc** · Nhãn & câu chữ

> Nhãn luôn nhìn thấy, nằm ngay trên ô nhập, căn trái. Bấm vào nhãn thì con trỏ vào ô.

**Vì sao:** Nhãn trên ô cho tốc độ quét nhanh nhất và chạy tốt ở mọi kích thước màn hình (nhãn dài không bị cắt như nhãn đặt bên trái). Nhãn hiển thị cũng là yêu cầu WCAG 3.3.2.

**Cách làm:**

1. Thứ tự cố định: Nhãn → Gợi ý → Thông báo lỗi → Ô nhập. Nhất quán cả sản phẩm.
2. Khoảng cách nhãn–ô nhỏ hơn khoảng cách giữa hai trường, để nhãn "dính" đúng ô của nó.
3. Gắn nhãn bằng `<label for="id">`.
4. Nhãn nổi (floating label) chỉ chấp nhận khi nhãn vẫn rõ và đủ tương phản sau khi đã có giá trị.

**✅ Nên**

- Nhãn "Số điện thoại" in đậm, ngay trên ô, gợi ý "Ví dụ: 0912 345 678" ở giữa.

**❌ Không nên**

- Nhãn bên trái ô, bị cắt thành "Số điện thoại liên h…" trên điện thoại.

**Tiêu chí kiểm tra:** Mọi trường đều có nhãn hiển thị phía trên ô, và bấm vào nhãn sẽ đưa con trỏ vào ô?

**Cơ sở:** [Luật Gần nhau](https://lawsofux.com/law-of-proximity/); [WCAG 3.3.2 · Nhãn hoặc hướng dẫn](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html); [WCAG 1.3.1 · Thông tin và quan hệ](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)  
**Nguồn:** [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/); [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [L2](#l2) · [L4](#l4) · [A2](#a2)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="l2"></a>
#### L2 · Không dùng placeholder thay cho nhãn

**Bắt buộc** · Nhãn & câu chữ

> Chữ mờ trong ô biến mất khi gõ, khó đọc, và dễ bị tưởng là đã điền sẵn.

**Vì sao:** Khi bắt đầu gõ, placeholder biến mất: người dùng quên ô này hỏi gì, nhất là khi quay lại kiểm tra. Placeholder thường có tương phản thấp, người lớn tuổi khó đọc. Ô có placeholder trông như đã có dữ liệu nên dễ bị bỏ qua.

**Cách làm:**

1. Dùng nhãn thật cho tên trường. Ví dụ và định dạng đặt ở dòng gợi ý dưới nhãn ([L4](#l4)).
2. Nếu vẫn dùng placeholder, chỉ để ví dụ ngắn, không chứa thông tin quan trọng.

**✅ Nên**

- Nhãn "Email" + gợi ý "Ví dụ: ten@gmail.com".

**❌ Không nên**

- Ô không nhãn, chỉ có chữ mờ "Nhập email của bạn (bắt buộc, dùng để nhận kết quả)".

**Tiêu chí kiểm tra:** Không có trường nào dùng placeholder làm nhãn hoặc giấu hướng dẫn quan trọng trong placeholder?

**Cơ sở:** [WCAG 3.3.2 · Nhãn hoặc hướng dẫn](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html); [WCAG 1.4.3 · Tương phản tối thiểu](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)  
**Nguồn:** [NN/g · Placeholders in form fields are harmful](https://www.nngroup.com/articles/form-design-placeholders/)  
**Liên quan:** [L1](#l1) · [L4](#l4)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="l3"></a>
#### L3 · Đánh dấu bắt buộc và không bắt buộc nhất quán

**Bắt buộc** · Nhãn & câu chữ

> Dấu * kèm chú thích ở đầu form, và ghi "(không bắt buộc)" cạnh trường tùy chọn.

**Vì sao:** Người dùng không nên phải đoán, hay phải bấm Gửi mới biết trường nào bắt buộc. Dấu * là quy ước người dùng Việt Nam quen thuộc, nhưng chỉ có dấu * thì trình đọc màn hình và người mới chưa chắc hiểu.

**Cách làm:**

1. Câu chú thích ở đầu form: "Các trường có dấu * là bắt buộc."
2. Dấu * đặt sau nhãn, có `aria-hidden="true"`; ô nhập có `aria-required="true"` hoặc `required`.
3. Trường tùy chọn ghi rõ "(không bắt buộc)" để người dùng mạnh dạn bỏ qua.
4. Nếu gần như mọi trường đều tùy chọn, xem lại: có nên hỏi chúng không? ([F2](#f2))

**✅ Nên**

- "Họ và tên *" và "Trường đang học (không bắt buộc)", có chú thích dấu * ở đầu form.

**❌ Không nên**

- Không đánh dấu gì; bấm Gửi mới hiện "Vui lòng điền đầy đủ thông tin".

**Tiêu chí kiểm tra:** Trường bắt buộc và không bắt buộc được đánh dấu rõ, có chú thích ý nghĩa dấu *?

**Cơ sở:** [Luật Jakob](https://lawsofux.com/jakobs-law/); [WCAG 3.3.2 · Nhãn hoặc hướng dẫn](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)  
**Nguồn:** [NN/g · Marking required fields](https://www.nngroup.com/articles/required-fields/)  
**Liên quan:** [F2](#f2) · [A2](#a2)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="l4"></a>
#### L4 · Gợi ý định dạng luôn hiển thị

**Nên** · Nhãn & câu chữ

> Ví dụ và yêu cầu nằm dưới nhãn, hiện sẵn trước khi gõ, không giấu trong tooltip.

**Vì sao:** Đoán sai định dạng là nguyên nhân hàng đầu gây lỗi. Gợi ý trước là phòng lỗi, tốt hơn báo lỗi sau. Tooltip (?) không có hover trên điện thoại, và người dùng hiếm khi bấm vào.

**Cách làm:**

1. Viết bằng ví dụ cụ thể: "Ví dụ: 0912 345 678", không viết "Nhập đúng định dạng".
2. Nêu giới hạn trước: "Tối đa 300 từ", "PDF, tối đa 20 MB".
3. Gắn gợi ý vào ô bằng `aria-describedby`.

**✅ Nên**

- "Số căn cước — 12 chữ số in trên thẻ căn cước".

**❌ Không nên**

- Biểu tượng (?) nhỏ, rê chuột mới hiện "Nhập 12 số".

**Tiêu chí kiểm tra:** Yêu cầu định dạng và ví dụ hiển thị sẵn (không ẩn trong tooltip) cho các trường cần?

**Cơ sở:** Watkinson #6 · Không gây stress; [WCAG 3.3.2 · Nhãn hoặc hướng dẫn](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [L2](#l2) · [V3](#v3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="l5"></a>
#### L5 · Nhãn ngắn, rõ, bằng ngôn ngữ của người dùng

**Nên** · Nhãn & câu chữ

> Nhãn 1–4 từ, dùng từ người dùng hiểu ngay. Không viết tắt, không dùng thuật ngữ nội bộ.

**Vì sao:** Mỗi chữ thừa là thêm thời gian đọc. Thuật ngữ hệ thống ("Mã định danh đối tượng", "Đơn vị chủ quản") khiến người dùng dừng lại suy nghĩ, đúng là chỗ cần đơn giản hóa.

**Cách làm:**

1. "Số điện thoại", không phải "SĐT liên hệ của thí sinh".
2. "Trường đang học", không phải "Đơn vị chủ quản".
3. Viết đầy đủ lần đầu: "Số căn cước (CCCD)".
4. Dùng câu hỏi khi cần ngữ cảnh: "Bạn đã từng tham gia cuộc thi này chưa?"

**✅ Nên**

- Email · Số điện thoại · Tỉnh/Thành phố · Trường đang học

**❌ Không nên**

- ĐỊA CHỈ THƯỜNG TRÚ (THEO HKTT) · SĐT LH · Đơn vị chủ quản

**Tiêu chí kiểm tra:** Nhãn ngắn gọn, không viết tắt, không dùng thuật ngữ nội bộ?

**Cơ sở:** Watkinson #5 · Không tốn sức  
**Nguồn:** [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/)  
**Liên quan:** [L7](#l7)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="l6"></a>
#### L6 · Giải thích lý do khi hỏi thông tin nhạy cảm

**Cân nhắc** · Nhãn & câu chữ

> Với CCCD, ngày sinh, sức khỏe, thu nhập: một câu ngắn nói vì sao cần và sẽ dùng thế nào.

**Vì sao:** Người dùng do dự trước thông tin nhạy cảm. Một câu giải thích đúng chỗ tăng niềm tin và tỷ lệ hoàn thành. Giải thích lý do khi nhiệm vụ không hiển nhiên là cách giảm stress đơn giản nhất.

**Cách làm:**

1. Đặt ở dòng gợi ý: "Dùng để xác minh danh tính khi trao giải. Không chia sẻ cho bên thứ ba."
2. Hoặc liên kết "Vì sao cần thông tin này?" mở rộng ngay tại chỗ (không mở trang mới).

**✅ Nên**

- Ngày sinh — "Để xác định bảng thi theo độ tuổi."

**❌ Không nên**

- Hỏi số CCCD không một lời giải thích, ngay bước đầu tiên.

**Tiêu chí kiểm tra:** Các trường nhạy cảm có giải thích ngắn về lý do thu thập?

**Cơ sở:** Watkinson #6 · Không gây stress  
**Nguồn:** [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/)  
**Liên quan:** [P1](#p1) · [F2](#f2)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="l7"></a>
#### L7 · Giọng văn nhất quán, viết hoa kiểu câu

**Nên** · Nhãn & câu chữ

> Xưng hô thống nhất ("bạn"), câu ngắn, chủ động. Tiêu đề, nhãn, nút chỉ viết hoa chữ cái đầu.

**Vì sao:** Giọng văn nhất quán tạo cảm giác sản phẩm chỉn chu, đáng tin. Viết hoa mỗi chữ ("Thông Tin Liên Hệ") hoặc IN HOA vừa khó đọc vừa sai quy tắc chính tả tiếng Việt.

**Cách làm:**

1. "Thông tin liên hệ", không viết "Thông Tin Liên Hệ" hay "THÔNG TIN LIÊN HỆ".
2. Một sản phẩm một cách xưng hô: "bạn". Không lẫn "quý khách", "thí sinh", "anh/chị".
3. Định dạng Việt Nam: ngày dd/mm/yyyy, giờ 24h (23:59), số "1.000.000 đ".
4. Không dùng dấu chấm than trong thông báo lỗi. Xem [Câu chữ mẫu](#cau-chu).

**✅ Nên**

- "Gửi hồ sơ đăng ký" · "Đã lưu lúc 14:32" · "Hạn chót 23:59, 30/11/2026"

**❌ Không nên**

- "GỬI HỒ SƠ!" · "Quý Khách Vui Lòng Nhập Đầy Đủ" · "Deadline: 11/30"

**Tiêu chí kiểm tra:** Câu chữ nhất quán về xưng hô, viết hoa kiểu câu, định dạng ngày giờ Việt Nam?

**Cơ sở:** [Luật Jakob](https://lawsofux.com/jakobs-law/)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [L5](#l5) · [V3](#v3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="nhom-i"></a>
### I · Ô nhập liệu

_Bàn phím, tự động điền, định dạng, họ tên, ngày sinh._

<a id="i1"></a>
#### I1 · Mở đúng bàn phím trên điện thoại

**Bắt buộc** · Ô nhập liệu

> Dùng `type` và `inputmode` phù hợp. Không dùng `type="number"` cho số giấy tờ, số điện thoại, mã OTP.

**Vì sao:** Bàn phím đúng giúp gõ nhanh và giảm lỗi rõ rệt trên điện thoại. `type="number"` làm mất số 0 ở đầu (số căn cước của người đăng ký khai sinh ở Hà Nội bắt đầu bằng 001), thêm nút tăng/giảm, đổi giá trị khi cuộn chuột, và cho gõ chữ "e".

**Cách làm:**

1. Email: `type="email"` — bàn phím có @ và dấu chấm.
2. Số điện thoại: `type="tel"`.
3. CCCD, OTP, số báo danh, mã bưu chính: `type="text" inputmode="numeric"`.
4. Đường dẫn: `type="url"`.
5. Chỉ dùng `type="number"` cho số lượng thực sự có thể cộng trừ (số người, số năm kinh nghiệm), và cân nhắc kỹ.

**✅ Nên**

- `<input type="text" inputmode="numeric" autocomplete="off">` cho số căn cước.

**❌ Không nên**

- `<input type="number">` cho CCCD: "001203004567" bị lưu thành 1203004567.

**Tiêu chí kiểm tra:** Mỗi trường mở đúng loại bàn phím trên điện thoại (email, số, điện thoại) và không dùng type="number" cho mã số?

**Cơ sở:** Watkinson #5 · Không tốn sức  
**Nguồn:** [MDN · inputmode](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode); [web.dev · Sign-up form best practices](https://web.dev/articles/sign-up-form-best-practices)  
**Kiểm thử:** [Kịch bản 13 · Trên điện thoại thật](#kich-ban-13)  
**Liên quan:** [I2](#i2) · [M1](#m1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="i2"></a>
#### I2 · Hỗ trợ tự động điền (autocomplete)

**Bắt buộc** · Ô nhập liệu

> Gắn thuộc tính `autocomplete` chuẩn để trình duyệt và trình quản lý mật khẩu điền giúp người dùng.

**Vì sao:** Tự động điền rút ngắn đáng kể thời gian hoàn thành; Google cho biết người dùng điền form nhanh hơn khoảng 30% nhờ autofill. Đây cũng là yêu cầu WCAG 1.3.5, giúp người khó khăn về vận động hoặc nhận thức.

**Cách làm:**

1. Họ và tên: `name` · Email: `email` · Số điện thoại: `tel`
2. Ngày sinh: `bday-day`, `bday-month`, `bday-year`
3. Tỉnh/Thành: `address-level1` · Phường/Xã: `address-level2` · Số nhà, đường: `street-address`
4. Mã OTP: `one-time-code` · Mật khẩu mới: `new-password`
5. Đặt `name`/`id` có nghĩa (`name="email"`, không phải `name="field_7"`).
6. Không đặt `autocomplete="off"` cho trường thông tin cá nhân. Thử autofill thật trên Chrome và Safari.

**✅ Nên**

- `<input type="email" name="email" autocomplete="email">`

**❌ Không nên**

- `<input name="txt_3" autocomplete="off">` cho ô email.

**Tiêu chí kiểm tra:** Các trường thông tin cá nhân có autocomplete đúng chuẩn và autofill hoạt động khi thử thật?

**Cơ sở:** [Luật Tesler](https://lawsofux.com/teslers-law/); Watkinson #5 · Không tốn sức; [WCAG 1.3.5 · Xác định mục đích ô nhập](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html)  
**Nguồn:** [MDN · autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete); [web.dev · Sign-up form best practices](https://web.dev/articles/sign-up-form-best-practices)  
**Kiểm thử:** [Kịch bản 12 · Tự động điền của trình duyệt](#kich-ban-12)  
**Liên quan:** [I1](#i1) · [T5](#t5)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="i3"></a>
#### I3 · Chấp nhận nhiều cách nhập, hệ thống tự chuẩn hóa

**Bắt buộc** · Ô nhập liệu

> Cho phép khoảng trắng, dấu chấm, gạch ngang, +84. Hệ thống tự làm sạch thay vì bắt người dùng sửa.

**Vì sao:** Luật Postel: cởi mở với đầu vào. Người dùng gõ số điện thoại theo nhiều cách ("0912.345.678", "+84 912 345 678") và dán từ nhiều nguồn có khoảng trắng thừa. Báo lỗi vì định dạng là đẩy việc của hệ thống sang người dùng.

**Cách làm:**

1. Cắt khoảng trắng đầu/cuối ở mọi trường.
2. Số điện thoại: bỏ ký tự không phải số, đổi +84/84 thành 0, thêm 0 nếu người dùng gõ thiếu.
3. CCCD: bỏ khoảng trắng, dấu chấm.
4. Email: bỏ khoảng trắng, chuyển phần tên miền về chữ thường.
5. Đường dẫn: tự thêm `https://` nếu thiếu.
6. Hiển thị lại giá trị đã chuẩn hóa để người dùng thấy và yên tâm.

**✅ Nên**

- Nhập "+84 912.345.678" → hiển thị "0912 345 678", không báo lỗi.

**❌ Không nên**

- "Số điện thoại không hợp lệ" chỉ vì có dấu cách.

**Tiêu chí kiểm tra:** Hệ thống tự chuẩn hóa khoảng trắng, dấu chấm, +84… thay vì báo lỗi định dạng?

**Cơ sở:** [Luật Postel](https://lawsofux.com/postels-law/); [Luật Tesler](https://lawsofux.com/teslers-law/)  
**Nguồn:** [Adam Silver · Form Design Patterns](https://adamsilver.io/)  
**Kiểm thử:** [Kịch bản 3 · Dán dữ liệu "bẩn"](#kich-ban-3)  
**Liên quan:** [I4](#i4) · [V3](#v3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="i4"></a>
#### I4 · Định dạng hiển thị nhưng không cản trở

**Nên** · Ô nhập liệu

> Nhóm chữ số cho dễ đọc (0912 345 678) nhưng không chặn dán, không làm nhảy con trỏ, không chặn sửa giữa chuỗi.

**Vì sao:** Chia nhóm giúp dễ kiểm tra bằng mắt. Nhưng input mask cứng thường gây lỗi: không dán được, con trỏ nhảy về cuối, không xóa được ký tự định dạng.

**Cách làm:**

1. Ưu tiên định dạng khi rời ô, thay vì trong lúc gõ.
2. Nếu định dạng khi gõ: giữ đúng vị trí con trỏ, cho dán chuỗi có hoặc không có khoảng trắng.
3. Không dùng `maxlength` để chặn độ dài: chuỗi dán có khoảng trắng sẽ bị cắt cụt. Kiểm tra độ dài sau khi chuẩn hóa.
4. Không dùng mặt nạ "___ ___ ___" thay cho nhãn.

**✅ Nên**

- Gõ tự do; rời ô thì hiển thị "0912 345 678".

**❌ Không nên**

- Mask cứng: dán "0912 345 678" chỉ nhận "0912 34" vì maxlength=10.

**Tiêu chí kiểm tra:** Định dạng hiển thị không cản trở việc dán, sửa giữa chuỗi và vị trí con trỏ?

**Cơ sở:** [Luật Miller](https://lawsofux.com/millers-law/); [Luật Postel](https://lawsofux.com/postels-law/)  
**Nguồn:** [Adam Silver · Form Design Patterns](https://adamsilver.io/)  
**Liên quan:** [I3](#i3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="i5"></a>
#### I5 · Độ rộng ô phản ánh độ dài dữ liệu

**Nên** · Ô nhập liệu

> Ô ngày, tháng ngắn; ô năm vừa 4 số; ô họ tên, email rộng. Trên điện thoại, ô dài chiếm hết chiều ngang.

**Vì sao:** Độ rộng là gợi ý ngầm về lượng ký tự cần nhập. Ô "Năm" rộng cả hàng khiến người dùng ngập ngừng: có phải nhập thêm gì không?

**Cách làm:**

1. Ngày, tháng: khoảng 4ch; năm: khoảng 6ch; CCCD, SĐT: khoảng 16ch.
2. Họ tên, email, địa chỉ: hết chiều rộng cột form.
3. Dùng đơn vị `ch` trong CSS: `width: 6ch`.

**✅ Nên**

- Ngày sinh: [ 27 ] [ 03 ] [ 2008 ] với ô năm rộng hơn một chút.

**❌ Không nên**

- Ba ô ngày, tháng, năm đều rộng 100%.

**Tiêu chí kiểm tra:** Độ rộng các ô tương ứng với độ dài dữ liệu cần nhập?

**Cơ sở:** [Luật Jakob](https://lawsofux.com/jakobs-law/)  
**Nguồn:** [Baymard Institute · Checkout usability](https://baymard.com/research/checkout-usability)  
**Liên quan:** [F5](#f5) · [I7](#i7)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="i6"></a>
#### I6 · Họ và tên: một ô, chấp nhận mọi tên Việt

**Bắt buộc** · Ô nhập liệu

> Một ô "Họ và tên", chấp nhận dấu tiếng Việt, khoảng trắng, dấu gạch, dấu nháy. Không giới hạn quá ngắn, không ép IN HOA.

**Vì sao:** Tách "Họ" và "Tên" gây bối rối vì thứ tự tên Việt khác phương Tây và nhiều người có tên đệm dài. Kiểm tra kiểu ` [a-zA-Z] ` sẽ từ chối "Nguyễn Thị Ánh Tuyết". Từ chối tên của một người là trải nghiệm tồi có thể xóa sạch mọi điểm tốt khác.

**Cách làm:**

1. Một ô, `autocomplete="name"`, độ dài tối đa ít nhất 100 ký tự.
2. Chấp nhận mọi chữ cái Unicode, khoảng trắng, dấu gạch, dấu nháy (tên dân tộc như "H'Lan Niê").
3. Tự gộp khoảng trắng thừa. Chuẩn hóa Unicode về **NFC** trước khi lưu: cùng một chữ "Tuyết" có thể được gõ bằng ký tự dựng sẵn hoặc tổ hợp, nếu không chuẩn hóa sẽ lỗi khi tìm kiếm, so trùng.
4. Cần in giấy chứng nhận: thêm ô "Tên in trên giấy chứng nhận", điền sẵn từ họ tên.
5. Không tự chuyển IN HOA trong ô; định dạng khi xuất bản.

**✅ Nên**

- Chấp nhận "Tôn Nữ Hoàng Bảo Ngọc Phương Thảo" (33 ký tự).

**❌ Không nên**

- Hai ô "Họ" và "Tên", regex chỉ nhận chữ không dấu, tối đa 20 ký tự.

**Tiêu chí kiểm tra:** Ô họ tên chấp nhận đầy đủ tên tiếng Việt có dấu, tên dài, tên có dấu nháy, và không tách Họ/Tên?

**Cơ sở:** [Luật Postel](https://lawsofux.com/postels-law/)  
**Nguồn:** [Adam Silver · Form Design Patterns](https://adamsilver.io/)  
**Kiểm thử:** [Kịch bản 4 · Tên dài, có dấu, có dấu nháy](#kich-ban-4)  
**Liên quan:** [I3](#i3) · [V3](#v3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="i7"></a>
#### I7 · Ngày sinh: ba ô Ngày/Tháng/Năm

**Nên** · Ô nhập liệu

> Nhập bằng bàn phím số theo thứ tự ngày/tháng/năm. Tránh lịch chọn ngày cho ngày quá khứ xa.

**Vì sao:** Lịch chọn ngày bắt người dùng bấm lùi hàng chục năm. Dropdown năm có 80 mục rất mệt trên điện thoại. Ba ô số cho phép gõ nhanh, quen thuộc, rõ thứ tự kiểu Việt Nam.

**Cách làm:**

1. Ba ô: Ngày (2 số), Tháng (2 số), Năm (4 số); `inputmode="numeric"`; nhóm trong `fieldset` với `legend` "Ngày sinh".
2. Gợi ý: "Ví dụ: 27 03 2008". Chấp nhận "3" và "03".
3. Không tự nhảy ô khi gõ đủ ký tự (khó sửa, dễ mất kiểm soát), trừ khi đã kiểm thử kỹ.
4. Kiểm tra: ngày có thật (30/02 không hợp lệ), không ở tương lai, đúng độ tuổi điều kiện. Lỗi chỉ rõ phần nào sai.
5. Ngày gần (ngày thi, ngày bắt đầu) thì lịch chọn ngày lại phù hợp.

**✅ Nên**

- [ Ngày ] [ Tháng ] [ Năm ] — lỗi "Ngày sinh cần có năm" và chỉ tô đỏ ô Năm.

**❌ Không nên**

- Dropdown năm bắt đầu từ 1940; lịch chọn ngày mở ở tháng hiện tại.

**Tiêu chí kiểm tra:** Ngày sinh nhập được bằng bàn phím theo thứ tự ngày/tháng/năm, không phải cuộn lịch qua nhiều năm?

**Cơ sở:** Watkinson #5 · Không tốn sức  
**Nguồn:** [GOV.UK · Dates](https://design-system.service.gov.uk/patterns/dates/)  
**Liên quan:** [I5](#i5) · [T3](#t3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="i8"></a>
#### I8 · Văn bản dài có bộ đếm, không cắt cụt

**Nên** · Ô nhập liệu

> Báo giới hạn trước khi gõ, đếm khi gõ, cho phép gõ quá và báo rõ thay vì cắt mất nội dung.

**Vì sao:** `maxlength` cắt cụt đoạn văn dán vào mà người dùng không hề hay biết. Bộ đếm giúp họ tự biên tập trước khi gửi.

**Cách làm:**

1. Gợi ý ban đầu: "Tối đa 300 từ". Nói rõ đếm từ hay đếm ký tự.
2. Khi gõ: "Còn 42 từ". Khi vượt: "Vượt quá 12 từ" (màu lỗi) — không chặn gõ.
3. Thông báo cho trình đọc màn hình bằng `aria-live="polite"`, có độ trễ, không đọc theo từng phím.
4. Chiều cao ô tương xứng nội dung mong đợi (5–8 dòng).

**✅ Nên**

- "Còn 42 từ" → "Vượt quá 12 từ", nội dung vẫn nguyên vẹn.

**❌ Không nên**

- `maxlength="1000"`: dán bài 1.300 ký tự, mất đoạn cuối, không có thông báo.

**Tiêu chí kiểm tra:** Ô văn bản dài có giới hạn rõ, có bộ đếm, và không cắt cụt nội dung khi dán?

**Cơ sở:** Watkinson #6 · Không gây stress; [WCAG 4.1.3 · Thông báo trạng thái](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)  
**Nguồn:** [GOV.UK · Character count](https://design-system.service.gov.uk/components/character-count/)  
**Liên quan:** [V3](#v3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="i9"></a>
#### I9 · Không chặn dán, không bắt nhập lại

**Bắt buộc** · Ô nhập liệu

> Cho dán ở mọi ô. Không thêm ô "Nhập lại email": thay bằng gợi ý sửa lỗi chính tả và trang xem lại.

**Vì sao:** Chặn dán buộc người dùng gõ tay chuỗi dài, tăng lỗi và cản trở trình quản lý mật khẩu. Ô nhập lại tăng gấp đôi công sức, và người dùng thường copy từ ô trên nên lỗi vẫn bị sao chép. WCAG 2.2 (3.3.7) yêu cầu không bắt nhập lại thông tin đã cung cấp.

**Cách làm:**

1. Không dùng `onpaste="return false"`.
2. Thay "Nhập lại email" bằng: gợi ý sửa tên miền gõ sai (gmial.com → gmail.com), hiển thị lại email trên trang xem lại, gửi email xác nhận.
3. Mật khẩu: một ô + nút Hiện/Ẩn ([I10](#i10)).

**✅ Nên**

- "Có phải ý bạn là minh.anh@gmail.com?" [Dùng địa chỉ này]

**❌ Không nên**

- Ô "Nhập lại email" chặn dán, báo "Không được phép dán".

**Tiêu chí kiểm tra:** Mọi ô đều cho dán, và không có ô "nhập lại" email/mật khẩu bắt buộc?

**Cơ sở:** Watkinson #5 · Không tốn sức; [WCAG 3.3.7 · Không bắt nhập lại](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html)  
**Nguồn:** [web.dev · Sign-up form best practices](https://web.dev/articles/sign-up-form-best-practices)  
**Kiểm thử:** [Kịch bản 3 · Dán dữ liệu "bẩn"](#kich-ban-3); [Kịch bản 14 · Gõ nhầm tên miền email](#kich-ban-14)  
**Liên quan:** [I10](#i10) · [T5](#t5) · [R1](#r1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="i10"></a>
#### I10 · Mật khẩu: hiện/ẩn, nêu yêu cầu từ đầu

**Bắt buộc** · Ô nhập liệu

> Có nút Hiện/Ẩn, liệt kê yêu cầu trước khi gõ, cho dán, hỗ trợ trình quản lý mật khẩu. Chỉ áp dụng khi thật sự cần tài khoản.

**Vì sao:** Gõ "mù" trên điện thoại rất dễ sai. Yêu cầu chỉ hiện sau khi bấm Gửi buộc người dùng làm lại nhiều lần. WCAG 2.2 (3.3.8) yêu cầu không bắt người dùng ghi nhớ hay giải đố khi xác thực: phải cho dán và dùng trình quản lý mật khẩu.

**Cách làm:**

1. `autocomplete="new-password"` khi tạo, `current-password` khi đăng nhập.
2. Nút "Hiện" có chữ (không chỉ biểu tượng con mắt), có `aria-pressed`.
3. Yêu cầu tối thiểu hợp lý, ví dụ ít nhất 8 ký tự. Ưu tiên độ dài hơn quy tắc phức tạp.
4. Cuộc thi chỉ đăng ký một lần: cân nhắc bỏ mật khẩu, dùng OTP hoặc liên kết qua email ([F7](#f7)).

**✅ Nên**

- Một ô mật khẩu, nút "Hiện", danh sách yêu cầu tích xanh dần khi đạt.

**❌ Không nên**

- Hai ô mật khẩu, không nút hiện, bấm Gửi mới báo "Mật khẩu phải có chữ hoa, chữ thường, số, ký tự đặc biệt".

**Tiêu chí kiểm tra:** Ô mật khẩu (nếu có) có nút hiện/ẩn, yêu cầu hiển thị trước, cho dán và hỗ trợ trình quản lý mật khẩu?

**Cơ sở:** [WCAG 3.3.8 · Xác thực dễ tiếp cận](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html)  
**Nguồn:** [web.dev · Sign-up form best practices](https://web.dev/articles/sign-up-form-best-practices)  
**Liên quan:** [I9](#i9) · [F7](#f7)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="nhom-c"></a>
### C · Lựa chọn

_Radio, checkbox, danh sách tìm kiếm, địa chỉ hành chính._

<a id="c1"></a>
#### C1 · Ít lựa chọn thì dùng radio, đừng giấu trong dropdown

**Bắt buộc** · Lựa chọn

> Từ 2 đến khoảng 6 lựa chọn: hiển thị hết bằng radio (chọn một) hoặc checkbox (chọn nhiều).

**Vì sao:** Dropdown giấu lựa chọn, cần hai lần chạm, khó so sánh. Radio cho thấy toàn bộ phương án ngay lập tức, quyết định nhanh hơn.

**Cách làm:**

1. 2–6 lựa chọn: radio xếp dọc, mỗi lựa chọn một dòng.
2. 7–15 lựa chọn: dropdown, hoặc radio có nhóm.
3. Trên 15 (tỉnh/thành, trường học): ô tìm kiếm gợi ý ([C2](#c2)).
4. Câu hỏi Có/Không: hai radio, không dùng một checkbox đơn.

**✅ Nên**

- "Hình thức tham gia" — ( ) Cá nhân  ( ) Theo đội

**❌ Không nên**

- Dropdown 2 mục "Cá nhân / Theo đội".

**Tiêu chí kiểm tra:** Câu hỏi có ít lựa chọn (≤ 6) hiển thị bằng radio/checkbox thay vì dropdown?

**Cơ sở:** [Luật Hick](https://lawsofux.com/hicks-law/)  
**Nguồn:** [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/); [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [C2](#c2) · [C4](#c4)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="c2"></a>
#### C2 · Danh sách dài: ô tìm kiếm, gõ không dấu vẫn ra

**Nên** · Lựa chọn

> Tỉnh/thành, trường học, quốc gia: cho gõ để lọc, tìm không phân biệt dấu, hiểu tên viết tắt.

**Vì sao:** Cuộn dropdown 34 tỉnh hay hàng nghìn trường rất mất thời gian. Người Việt thường gõ không dấu hoặc viết tắt ("hcm", "hn", "bk"). Ô tìm kiếm phải hiểu điều đó.

**Cách làm:**

1. Chuẩn hóa khi so khớp: bỏ dấu, đổi đ → d, không phân biệt hoa thường.
2. Thêm bí danh: "hcm", "tphcm", "sài gòn" → TP. Hồ Chí Minh; "hn" → Hà Nội.
3. Khớp ở bất kỳ vị trí nào, ưu tiên khớp đầu từ. Tô đậm phần khớp.
4. Dùng được bằng phím ↑ ↓ Enter Esc, theo mẫu ARIA combobox.
5. Danh sách có thể thiếu (trường học): có lựa chọn "Dùng tên bạn nhập".

**✅ Nên**

- Gõ "da nang" → "Đà Nẵng"; gõ "bk" → "Đại học Bách khoa Hà Nội".

**❌ Không nên**

- Dropdown 34 tỉnh xếp theo mã hành chính, phải cuộn tìm.

**Tiêu chí kiểm tra:** Danh sách dài cho gõ để tìm, tìm được khi gõ không dấu/viết tắt, và dùng được bằng bàn phím?

**Cơ sở:** [Luật Hick](https://lawsofux.com/hicks-law/); [Luật Postel](https://lawsofux.com/postels-law/); [WCAG 2.1.1 · Bàn phím](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html); [WCAG 4.1.2 · Tên, vai trò, giá trị](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)  
**Nguồn:** [W3C ARIA APG · Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)  
**Kiểm thử:** [Kịch bản 17 · Tìm tỉnh không dấu, tên cũ](#kich-ban-17)  
**Liên quan:** [C3](#c3) · [C1](#c1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="c3"></a>
#### C3 · Địa chỉ theo đơn vị hành chính mới: Tỉnh → Phường/Xã

**Nên** · Lựa chọn

> Từ 01/07/2025, Việt Nam có 34 tỉnh/thành và chính quyền địa phương 2 cấp. Bỏ ô Quận/Huyện, cập nhật danh mục.

**Vì sao:** Form còn ô "Quận/Huyện" hoặc danh sách 63 tỉnh khiến người dùng bối rối, dữ liệu thu về không dùng được. Nhiều người vẫn quen tên tỉnh cũ, nên ô tìm kiếm cần hiểu cả tên cũ.

**Cách làm:**

1. Cấu trúc: Tỉnh/Thành phố → Phường/Xã/Đặc khu → Số nhà, tên đường.
2. Phường/Xã lọc theo tỉnh đã chọn. Đổi tỉnh thì xóa phường/xã đã chọn và báo cho người dùng biết.
3. Ô tìm tỉnh nhận tên cũ: gõ "Bình Dương" → gợi ý "TP. Hồ Chí Minh (gồm Bình Dương cũ)".
4. Chỉ cần biết khu vực (thống kê, chia vùng) thì chỉ hỏi Tỉnh/Thành, đừng hỏi địa chỉ đầy đủ ([F2](#f2)).

**✅ Nên**

- Tỉnh/Thành phố (34) → Phường/Xã → Số nhà, tên đường.

**❌ Không nên**

- Tỉnh (63) → Quận/Huyện → Phường/Xã.

**Tiêu chí kiểm tra:** Địa chỉ dùng danh mục 34 tỉnh/thành và cấp Phường/Xã mới, không còn ô Quận/Huyện?

**Cơ sở:** [Luật Jakob](https://lawsofux.com/jakobs-law/); [Luật Tesler](https://lawsofux.com/teslers-law/)  
**Nguồn:** [web.dev · Address form best practices](https://web.dev/articles/payment-and-address-form-best-practices)  
**Kiểm thử:** [Kịch bản 17 · Tìm tỉnh không dấu, tên cũ](#kich-ban-17)  
**Liên quan:** [C2](#c2) · [F2](#f2)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="c4"></a>
#### C4 · Đúng điều khiển cho đúng việc

**Bắt buộc** · Lựa chọn

> Radio: chọn một. Checkbox: chọn nhiều hoặc một xác nhận độc lập. Công tắc (toggle): chỉ cho cài đặt có hiệu lực ngay.

**Vì sao:** Người dùng mang kỳ vọng từ các sản phẩm khác (Luật Jakob). Dùng sai điều khiển, như checkbox cho câu chọn một hay toggle trong form phải bấm Gửi, khiến họ hiểu sai hệ quả.

**Cách làm:**

1. Radio: luôn có ít nhất 2 lựa chọn, chọn đúng một.
2. Checkbox: chọn 0 đến nhiều, hoặc một xác nhận (đồng ý điều khoản).
3. Toggle: không dùng trong form có nút Gửi.
4. Nêu rõ trong legend hoặc gợi ý: "Chọn tất cả phù hợp", "Chọn tối đa 3".

**✅ Nên**

- "Lĩnh vực quan tâm (chọn tối đa 3)" — các checkbox.

**❌ Không nên**

- Toggle "Nhận email" trong form đăng ký, khiến người dùng tưởng đã lưu ngay.

**Tiêu chí kiểm tra:** Radio, checkbox, toggle được dùng đúng ngữ nghĩa?

**Cơ sở:** [Luật Jakob](https://lawsofux.com/jakobs-law/); [WCAG 4.1.2 · Tên, vai trò, giá trị](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)  
**Nguồn:** [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/)  
**Liên quan:** [C1](#c1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="c5"></a>
#### C5 · Không chọn sẵn câu trả lời cá nhân

**Nên** · Lựa chọn

> Giới tính, đồng ý điều khoản, nhận tin quảng cáo: để trống. Quốc tịch Việt Nam, năm học hiện tại: có thể chọn sẵn.

**Vì sao:** Chọn sẵn câu trả lời cá nhân dễ bị bỏ qua và tạo dữ liệu sai. Với đồng ý xử lý dữ liệu, chọn sẵn còn trái nguyên tắc đồng ý tự nguyện của pháp luật bảo vệ dữ liệu cá nhân. Ngược lại, mặc định đúng với đa số giúp tiết kiệm công sức.

**Cách làm:**

1. Không chọn sẵn: giới tính, ô đồng ý, nhận marketing, hạng mục dự thi.
2. Có thể chọn sẵn: quốc tịch "Việt Nam"; điền sẵn từ tài khoản đã đăng nhập nhưng cho sửa.

**✅ Nên**

- ☐ Tôi muốn nhận tin về các cuộc thi tiếp theo (không bắt buộc)

**❌ Không nên**

- ☑ Tôi đồng ý nhận thông tin khuyến mãi (đã tích sẵn)

**Tiêu chí kiểm tra:** Không có lựa chọn cá nhân hay ô đồng ý nào được chọn sẵn; mặc định đều an toàn và đúng với đa số?

**Cơ sở:** [Luật Tesler](https://lawsofux.com/teslers-law/)  
**Nguồn:** [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/)  
**Liên quan:** [R2](#r2) · [P1](#p1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="c6"></a>
#### C6 · Vùng chạm lớn; lựa chọn quan trọng dùng thẻ có mô tả

**Nên** · Lựa chọn

> Cả nhãn là vùng bấm. Hạng mục dự thi, bảng thi, cự ly: dùng thẻ lựa chọn có mô tả, điều kiện, số suất còn lại.

**Vì sao:** Mục tiêu lớn dễ chạm (Luật Fitts). Chọn hạng mục là quyết định quan trọng: người dùng cần đủ thông tin để chọn đúng ngay tại chỗ, không phải mở tab khác đọc thể lệ.

**Cách làm:**

1. Mỗi dòng radio/checkbox cao tối thiểu 44px, bấm cả dòng được.
2. Thẻ lựa chọn: tên, mô tả 1–2 dòng, điều kiện, trạng thái ("Còn 12 suất", "Hết suất").
3. Lựa chọn không đủ điều kiện: hiển thị mờ kèm lý do ("Dành cho thí sinh dưới 18 tuổi"), đừng ẩn đi.

**✅ Nên**

- Thẻ "Công nghệ & AI — Giải pháp ứng dụng công nghệ cho đời sống · Còn 120 suất".

**❌ Không nên**

- Dropdown "Chọn hạng mục" chỉ có tên, điều kiện nằm ở trang thể lệ.

**Tiêu chí kiểm tra:** Mọi lựa chọn có vùng bấm đủ lớn; lựa chọn quan trọng có mô tả điều kiện ngay tại chỗ?

**Cơ sở:** [Luật Fitts](https://lawsofux.com/fittss-law/); [Luật Hick](https://lawsofux.com/hicks-law/); [WCAG 2.5.8 · Kích thước vùng chạm](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)  
**Nguồn:** [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/)  
**Liên quan:** [B6](#b6) · [C1](#c1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="nhom-v"></a>
### V · Kiểm tra & báo lỗi

_Kiểm tra lúc nào, báo lỗi ở đâu, viết lỗi thế nào._

<a id="v1"></a>
#### V1 · Kiểm tra đúng lúc: khi rời ô; sửa đúng là hết lỗi ngay

**Bắt buộc** · Kiểm tra & báo lỗi

> Không báo lỗi khi người dùng đang gõ dở. Kiểm tra khi rời ô; khi ô đang báo lỗi, cập nhật ngay khi sửa đúng.

**Vì sao:** Báo lỗi ngay ký tự đầu tiên ("Email không hợp lệ" khi mới gõ "m") vừa phiền vừa như bị mắng. Chờ tới lúc bấm Gửi mới báo thì người dùng phải quay lại nhiều chỗ. Nghiên cứu của Luke Wroblewski cho thấy kiểm tra trực tiếp đúng cách giúp tỷ lệ thành công tăng 22%, lỗi giảm 22%, thời gian hoàn thành giảm 42%.

**Cách làm:**

1. Ô chưa chạm: không báo lỗi.
2. Rời ô với dữ liệu sai: báo lỗi.
3. Ô đang báo lỗi: kiểm tra lại mỗi lần gõ, xóa lỗi ngay khi đúng. **"Khen sớm, chê muộn."**
4. Ô bắt buộc để trống: chỉ báo khi bấm Gửi/Tiếp tục, tránh báo lỗi khi người dùng chỉ Tab qua.
5. Kiểm tra trùng với máy chủ (email đã đăng ký) ngay khi rời ô.

**✅ Nên**

- Gõ "minh@" → chưa báo. Rời ô → báo lỗi. Gõ tiếp "gmail.com" → lỗi biến mất ngay.

**❌ Không nên**

- Gõ chữ "m" đã hiện đỏ "Email không hợp lệ".

**Tiêu chí kiểm tra:** Lỗi chỉ xuất hiện khi rời ô hoặc khi gửi, và biến mất ngay khi người dùng sửa đúng?

**Cơ sở:** Watkinson #6 · Không gây stress; [Ngưỡng Doherty](https://lawsofux.com/doherty-threshold/); [WCAG 3.3.1 · Xác định lỗi](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)  
**Nguồn:** [Luke Wroblewski · Inline validation in web forms](https://alistapart.com/article/inline-validation-in-web-forms/); [NN/g · Error-message guidelines](https://www.nngroup.com/articles/errors-forms-design-guidelines/)  
**Kiểm thử:** [Kịch bản 16 · Đăng ký lần hai cùng email](#kich-ban-16)  
**Liên quan:** [V2](#v2) · [V3](#v3) · [V4](#v4)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="v2"></a>
#### V2 · Lỗi hiện ngay tại trường, bằng chữ + biểu tượng + màu

**Bắt buộc** · Kiểm tra & báo lỗi

> Thông báo lỗi nằm sát trường bị lỗi, viền ô đổi màu, có biểu tượng. Không chỉ dựa vào màu đỏ.

**Vì sao:** Khoảng 1/12 nam giới có rối loạn sắc giác; chỉ đổi viền đỏ thì nhiều người không nhận ra (WCAG 1.4.1). Lỗi ở xa trường (đầu trang, popup) bắt người dùng ghi nhớ rồi đi tìm.

**Cách làm:**

1. Vị trí: ngay dưới nhãn/gợi ý, phía trên ô (vẫn thấy khi bàn phím mở), hoặc ngay dưới ô — chọn một, nhất quán cả sản phẩm.
2. Ô lỗi: viền đỏ dày hơn + biểu tượng + chữ đỏ đủ tương phản (≥ 4.5:1) + vạch đỏ bên trái trường.
3. `aria-invalid="true"` và `aria-describedby` trỏ đến thông báo lỗi.
4. Không dùng popup, toast hay `alert()` để báo lỗi trường. Không xóa nội dung trong ô lỗi.

**✅ Nên**

- Vạch đỏ bên trái + "⚠ Số điện thoại cần có 10 chữ số" + viền ô đỏ.

**❌ Không nên**

- Chỉ viền ô đổi đỏ; toast "Có lỗi xảy ra" ở góc màn hình rồi biến mất.

**Tiêu chí kiểm tra:** Lỗi hiển thị cạnh trường, có chữ và biểu tượng, không chỉ dựa vào màu?

**Cơ sở:** [Luật Gần nhau](https://lawsofux.com/law-of-proximity/); [WCAG 1.4.1 · Không chỉ dùng màu](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html); [WCAG 3.3.1 · Xác định lỗi](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)  
**Nguồn:** [GOV.UK · Error message](https://design-system.service.gov.uk/components/error-message/)  
**Liên quan:** [V3](#v3) · [V9](#v9) · [A4](#a4)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="v3"></a>
#### V3 · Thông báo lỗi nói rõ sai gì và sửa thế nào

**Bắt buộc** · Kiểm tra & báo lỗi

> Công thức: [vấn đề cụ thể] + [cách sửa hoặc ví dụ]. Lịch sự, không đổ lỗi, không mã lỗi kỹ thuật.

**Vì sao:** "Dữ liệu không hợp lệ" buộc người dùng tự đoán. Lỗi cụ thể giúp sửa đúng ngay lần đầu, giảm căng thẳng ở đúng khoảnh khắc tiêu cực của hành trình.

**Cách làm:**

1. Bỏ trống: "Nhập số điện thoại", "Chọn tỉnh/thành phố" — động từ hợp với loại trường.
2. Sai định dạng: "Số điện thoại cần có 10 chữ số, ví dụ 0912 345 678".
3. Ngoài phạm vi: "Thí sinh cần sinh trong khoảng 01/12/1995 – 30/11/2011".
4. Nêu giá trị cụ thể khi giúp ích: "Số căn cước gồm 12 chữ số. Bạn đã nhập 11 chữ số".
5. Tránh: "Lỗi!", "Sai", "Bạn đã nhập sai", "Error 422", IN HOA, dấu chấm than.
6. Thư viện mẫu: [Câu chữ mẫu → Lỗi](#cau-chu).

**✅ Nên**

- "Tệp "bai-thi.docx" không đúng định dạng. Hãy tải lên tệp PDF"

**❌ Không nên**

- "Định dạng không hợp lệ!"
- "ERR_INVALID_FILE_TYPE"

**Tiêu chí kiểm tra:** Mọi thông báo lỗi nêu cụ thể vấn đề và cách sửa, không đổ lỗi, không có mã kỹ thuật?

**Cơ sở:** [Quy tắc Peak–End](https://lawsofux.com/peak-end-rule/); Watkinson #6 · Không gây stress; [WCAG 3.3.3 · Gợi ý sửa lỗi](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html)  
**Nguồn:** [NN/g · Error-message guidelines](https://www.nngroup.com/articles/errors-forms-design-guidelines/); [GOV.UK · Error message](https://design-system.service.gov.uk/components/error-message/)  
**Kiểm thử:** [Kịch bản 2 · Bấm gửi khi form trống](#kich-ban-2)  
**Liên quan:** [V2](#v2) · [L7](#l7)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="v4"></a>
#### V4 · Bấm gửi còn lỗi: tóm tắt lỗi ở đầu, có liên kết tới từng ô

**Bắt buộc** · Kiểm tra & báo lỗi

> Hiện khối "Cần sửa 3 mục" ở đầu form/bước và đưa focus vào đó; mỗi lỗi là liên kết nhảy tới đúng ô.

**Vì sao:** Form dài, lỗi nằm ngoài màn hình, người dùng không hiểu vì sao bấm Gửi mà "không có gì xảy ra". Tóm tắt lỗi cho biết số lượng và vị trí, đồng thời giúp trình đọc màn hình thông báo ngay.

**Cách làm:**

1. Khối tóm tắt ở đầu form, nhận focus (`tabindex="-1"`), `role="alert"`.
2. Nội dung từng liên kết giống hệt thông báo lỗi tại trường.
3. Bấm liên kết → focus vào ô (nhóm radio: radio đầu tiên), cuộn ô vào giữa màn hình.
4. Đồng thời hiển thị lỗi tại từng trường ([V2](#v2)).
5. Form chỉ 2–3 trường: có thể bỏ tóm tắt, chỉ focus vào ô lỗi đầu tiên.

**✅ Nên**

- "Cần sửa 2 mục trước khi tiếp tục: · Nhập họ và tên · Chọn hạng mục dự thi"

**❌ Không nên**

- Bấm Gửi, trang đứng yên; lỗi đỏ nằm ở ô đầu form, ngoài màn hình.

**Tiêu chí kiểm tra:** Khi gửi còn lỗi, có khối tóm tắt lỗi nhận focus, liên kết tới từng ô lỗi?

**Cơ sở:** [WCAG 3.3.1 · Xác định lỗi](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html); [WCAG 2.4.3 · Thứ tự focus](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)  
**Nguồn:** [GOV.UK · Error summary](https://design-system.service.gov.uk/components/error-summary/)  
**Kiểm thử:** [Kịch bản 2 · Bấm gửi khi form trống](#kich-ban-2)  
**Liên quan:** [V2](#v2) · [V9](#v9) · [V6](#v6)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="v5"></a>
#### V5 · Không bao giờ làm mất dữ liệu đã nhập

**Bắt buộc** · Kiểm tra & báo lỗi

> Lỗi, tải lại trang, mất mạng, quay lại bước trước: dữ liệu phải còn nguyên.

**Vì sao:** Mất dữ liệu là trải nghiệm tồi nhất của một form. Người dùng gần như chắc chắn bỏ cuộc, và nhớ mãi. Trải nghiệm tiêu cực luôn được nhớ mạnh hơn trải nghiệm tốt.

**Cách làm:**

1. Lỗi máy chủ: giữ toàn bộ giá trị (trừ mật khẩu nếu chính sách yêu cầu).
2. Tệp đã tải lên: vẫn giữ khi trang báo lỗi ở trường khác.
3. Form dài: lưu nháp cục bộ hoặc trên máy chủ, khôi phục khi tải lại ([D1](#d1)).
4. Mất mạng khi gửi: báo rõ, giữ dữ liệu, có nút "Thử lại" ([V8](#v8)).
5. Nút Back của trình duyệt không xóa dữ liệu bước trước.

**✅ Nên**

- Mất mạng khi gửi → "Chưa gửi được do mất kết nối. Dữ liệu vẫn được giữ. [Thử lại]"

**❌ Không nên**

- Lỗi máy chủ → trang tải lại, form trắng trơn.

**Tiêu chí kiểm tra:** Dữ liệu được giữ nguyên khi có lỗi, tải lại trang, mất mạng hoặc quay lại bước trước?

**Cơ sở:** [Quy tắc Peak–End](https://lawsofux.com/peak-end-rule/); Watkinson #6 · Không gây stress  
**Nguồn:** [NN/g · Error-message guidelines](https://www.nngroup.com/articles/errors-forms-design-guidelines/)  
**Kiểm thử:** [Kịch bản 5 · Tải lại trang giữa chừng](#kich-ban-5); [Kịch bản 6 · Mất mạng khi bấm gửi](#kich-ban-6); [Kịch bản 9 · Nút Back của trình duyệt](#kich-ban-9)  
**Liên quan:** [D1](#d1) · [V8](#v8) · [F6](#f6)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="v6"></a>
#### V6 · Đừng khóa nút Gửi khi form chưa hợp lệ

**Nên** · Kiểm tra & báo lỗi

> Cho bấm Gửi/Tiếp tục bất cứ lúc nào, rồi chỉ ra lỗi. Phòng lỗi ở từng trường, không phải ở nút.

**Vì sao:** Nút mờ không giải thích vì sao không bấm được, người dùng phải dò từng ô. Nút bị vô hiệu hóa thường có tương phản thấp và bị trình đọc màn hình bỏ qua. Phòng lỗi (poka-yoke) hiệu quả hơn khi đặt ở từng trường: đúng bàn phím, chọn từ danh sách, gợi ý định dạng, tự chuẩn hóa. **Lưu ý:** điều này khác với ví dụ "khóa nút khi form chưa hợp lệ" hay được dẫn khi nói về poka-yoke.

**Cách làm:**

1. Nút luôn bấm được; bấm khi còn lỗi → tóm tắt lỗi ([V4](#v4)).
2. Chỉ khóa tạm thời trong lúc đang gửi ([B4](#b4)).
3. Nếu nghiệp vụ buộc phải khóa: thêm dòng chữ ngay cạnh nút nêu điều kiện còn thiếu, ví dụ "Hoàn thành 2 trường bắt buộc còn lại để gửi".

**✅ Nên**

- Nút "Tiếp tục" luôn sáng; bấm → "Cần sửa 2 mục".

**❌ Không nên**

- Nút xám, không có lời giải thích; người dùng bấm mãi không được.

**Tiêu chí kiểm tra:** Nút gửi/tiếp tục không bị vô hiệu hóa chỉ vì form chưa hợp lệ?

**Cơ sở:** Watkinson #6 · Không gây stress  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/); [Adam Silver · Form Design Patterns](https://adamsilver.io/)  
**Liên quan:** [V4](#v4) · [B4](#b4)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="v7"></a>
#### V7 · Xác nhận "hợp lệ" tại chỗ cho trường dễ sai

**Cân nhắc** · Kiểm tra & báo lỗi

> Dấu ✓ khi email, mã giới thiệu, mã trường đã hợp lệ hoặc đã được xác minh. Dùng tiết chế.

**Vì sao:** Phản hồi tích cực giảm lo lắng ở trường dễ sai hoặc phải kiểm tra với máy chủ. Gắn ✓ cho mọi ô (kể cả họ tên) thì thành nhiễu.

**Cách làm:**

1. Chỉ dùng cho trường có quy tắc rõ hoặc kiểm tra máy chủ: email, SĐT, mã giới thiệu, mã trường.
2. Hiện sau khi rời ô, không nhấp nháy khi đang gõ.
3. Kèm chữ khi có ý nghĩa: "Mã hợp lệ: Trường THPT Chu Văn An".

**✅ Nên**

- Nhập mã giới thiệu → "✓ Mã hợp lệ: CLB Sáng tạo Trẻ Đà Nẵng".

**❌ Không nên**

- ✓ xanh ở cả ô "Họ và tên" vừa gõ chữ "A".

**Tiêu chí kiểm tra:** Phản hồi "hợp lệ" chỉ dùng cho trường dễ sai hoặc cần xác minh, không gây nhiễu?

**Cơ sở:** Watkinson #6 · Không gây stress  
**Nguồn:** [Luke Wroblewski · Inline validation in web forms](https://alistapart.com/article/inline-validation-in-web-forms/)  
**Liên quan:** [V1](#v1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="v8"></a>
#### V8 · Lỗi từ máy chủ: cụ thể, đúng chỗ, có lối thoát

**Bắt buộc** · Kiểm tra & báo lỗi

> Email đã đăng ký, hết suất, mất kết nối: hiển thị tại đúng trường hoặc đầu form, nói rõ và chỉ bước tiếp theo.

**Vì sao:** Lỗi máy chủ hay bị hiện chung chung ("Đã có lỗi xảy ra"). Người dùng không biết sửa gì, không biết hồ sơ đã gửi hay chưa, nên mất niềm tin hoặc gửi trùng.

**Cách làm:**

1. Đã tồn tại: "Email này đã được dùng để đăng ký. Đăng nhập để xem hồ sơ, hoặc dùng email khác."
2. Hết suất khi đang điền: báo ngay khi biết, giữ dữ liệu, gợi ý hạng mục khác hoặc danh sách chờ.
3. Mất kết nối: "Chưa gửi được hồ sơ do mất kết nối. Dữ liệu của bạn vẫn được giữ." + "Thử lại".
4. Lỗi hệ thống: thêm hotline/email hỗ trợ. Mã lỗi kỹ thuật ghi log cho đội phát triển; nếu hiện cho người dùng thì để cỡ nhỏ, chỉ để đối chiếu khi cần hỗ trợ.

**✅ Nên**

- "Chưa gửi được hồ sơ do mất kết nối. Dữ liệu vẫn được giữ. [Thử lại]"

**❌ Không nên**

- "Error 500. Something went wrong."

**Tiêu chí kiểm tra:** Lỗi từ máy chủ được hiển thị cụ thể, đúng chỗ, và luôn có hướng xử lý tiếp theo?

**Cơ sở:** Watkinson #6 · Không gây stress; [Quy tắc Peak–End](https://lawsofux.com/peak-end-rule/)  
**Nguồn:** [NN/g · Error-message guidelines](https://www.nngroup.com/articles/errors-forms-design-guidelines/)  
**Kiểm thử:** [Kịch bản 6 · Mất mạng khi bấm gửi](#kich-ban-6); [Kịch bản 16 · Đăng ký lần hai cùng email](#kich-ban-16)  
**Liên quan:** [V5](#v5) · [V3](#v3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="v9"></a>
#### V9 · Trình đọc màn hình đọc được lỗi

**Bắt buộc** · Kiểm tra & báo lỗi

> Gắn lỗi vào ô bằng `aria-describedby`, đặt `aria-invalid`; tóm tắt lỗi dùng `role="alert"`.

**Vì sao:** Người dùng trình đọc màn hình không "thấy" viền đỏ. Lỗi không được gắn vào ô thì họ không biết vì sao không gửi được.

**Cách làm:**

1. `<input aria-invalid="true" aria-describedby="phone-hint phone-error">`
2. Thông báo lỗi có tiền tố ẩn "Lỗi:" (visually hidden) để đọc rõ.
3. Không dùng `aria-live` cho từng lỗi trường khi đang gõ (gây ồn); dùng cho tóm tắt lỗi và trạng thái gửi.

**✅ Nên**

- VoiceOver đọc: "Số điện thoại, bắt buộc, không hợp lệ. Lỗi: Số điện thoại cần có 10 chữ số".

**❌ Không nên**

- Lỗi là một `div` đỏ không gắn với ô nào.

**Tiêu chí kiểm tra:** Lỗi được gắn với ô (aria-describedby, aria-invalid) và được trình đọc màn hình đọc khi xuất hiện?

**Cơ sở:** [WCAG 3.3.1 · Xác định lỗi](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html); [WCAG 4.1.3 · Thông báo trạng thái](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html); [WCAG 1.3.1 · Thông tin và quan hệ](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)  
**Nguồn:** [GOV.UK · Error message](https://design-system.service.gov.uk/components/error-message/)  
**Kiểm thử:** [Kịch bản 11 · Trình đọc màn hình](#kich-ban-11)  
**Liên quan:** [V2](#v2) · [A2](#a2) · [A6](#a6)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="nhom-b"></a>
### B · Nút & hành động

_Nhãn nút, thứ bậc, vị trí, trạng thái đang gửi._

<a id="b1"></a>
#### B1 · Nhãn nút nói rõ hành động

**Bắt buộc** · Nút & hành động

> "Gửi hồ sơ đăng ký", "Tiếp tục", "Lưu nháp": động từ + đối tượng. Không dùng "OK", "Submit", "Xác nhận" chung chung.

**Vì sao:** Người dùng đọc nút để biết điều gì sẽ xảy ra khi bấm. Nhãn cụ thể giảm do dự ở bước có hệ quả, như gửi hồ sơ chính thức.

**Cách làm:**

1. Nút cuối: "Gửi hồ sơ đăng ký" hoặc "Hoàn tất đăng ký".
2. Nút giữa các bước: "Tiếp tục". Trên máy tính có thể thêm tên bước sau.
3. Viết hoa chữ đầu, không IN HOA, không dấu chấm than. Nhãn nút nhất quán giữa các bước.

**✅ Nên**

- [ Gửi hồ sơ đăng ký ]

**❌ Không nên**

- [ OK ]  [ SUBMIT ]  [ Xác nhận ]

**Tiêu chí kiểm tra:** Nhãn nút là động từ cụ thể mô tả kết quả, không chung chung?

**Cơ sở:** Watkinson #4 · Kỳ vọng  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [B2](#b2) · [L7](#l7)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="b2"></a>
#### B2 · Một nút chính mỗi màn hình; bỏ nút Xóa form

**Bắt buộc** · Nút & hành động

> Nút chính nổi bật nhất; nút phụ (Quay lại, Lưu nháp) dạng thứ cấp. Không có nút "Nhập lại"/"Reset".

**Vì sao:** Thứ khác biệt sẽ được chú ý (Von Restorff). Hai nút cùng nổi bật làm người dùng phân vân. Nút Reset gần như không ai cần, nhưng bấm nhầm là mất hết dữ liệu.

**Cách làm:**

1. Nút chính: nền màu nhấn. Nút phụ: viền hoặc dạng liên kết.
2. "Quay lại": nút phụ phía trên form hoặc bên trái nút chính.
3. Hành động phá hủy (Xóa hồ sơ, Hủy đăng ký): tách xa nút chính, có xác nhận hoặc hoàn tác ([B5](#b5)).

**✅ Nên**

- [ Tiếp tục ] (nền xanh) · Lưu nháp (liên kết)

**❌ Không nên**

- [ Gửi ] [ Nhập lại ] cùng màu, cạnh nhau.

**Tiêu chí kiểm tra:** Mỗi màn hình chỉ có một nút chính nổi bật và không có nút xóa/reset form?

**Cơ sở:** [Hiệu ứng Von Restorff](https://lawsofux.com/von-restorff-effect/); [Luật Hick](https://lawsofux.com/hicks-law/)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [B1](#b1) · [B5](#b5)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="b3"></a>
#### B3 · Đặt nút ở nơi mắt và ngón tay đang ở

**Nên** · Nút & hành động

> Nút chính ngay sau trường cuối, căn trái theo cột form trên máy tính, rộng hết màn hình trên điện thoại.

**Vì sao:** Nút gần trường cuối giảm quãng di chuyển (Luật Fitts). Căn trái theo đường đọc thẳng của form một cột giúp không bị bỏ sót.

**Cách làm:**

1. Máy tính: nút chính căn trái, thẳng hàng cạnh trái các ô nhập.
2. Điện thoại: nút chính rộng 100%, cao ít nhất 48px.
3. Thanh nút dính đáy (sticky) chỉ dùng khi form dài, và không được che ô đang nhập hay thông báo lỗi (WCAG 2.4.11).

**✅ Nên**

- Nút "Tiếp tục" nằm ngay dưới trường cuối.

**❌ Không nên**

- Nút căn phải, cách trường cuối 400px khoảng trắng; thanh sticky che mất ô đang nhập.

**Tiêu chí kiểm tra:** Nút chính nằm ngay sau trường cuối, dễ chạm trên điện thoại, không che nội dung?

**Cơ sở:** [Luật Fitts](https://lawsofux.com/fittss-law/); [WCAG 2.4.11 · Focus không bị che](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)  
**Nguồn:** [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/)  
**Liên quan:** [B6](#b6) · [M2](#m2)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="b4"></a>
#### B4 · Phản hồi khi đang gửi và chặn gửi trùng

**Bắt buộc** · Nút & hành động

> Sau khi bấm, nút hiện "Đang gửi…" kèm vòng xoay và tạm khóa. Máy chủ cũng phải chống tạo hồ sơ trùng.

**Vì sao:** Không có phản hồi trong khoảng một giây, người dùng tưởng chưa bấm và bấm tiếp, tạo nhiều hồ sơ trùng. Hệ thống nên phản hồi dưới 400ms (ngưỡng Doherty).

**Cách làm:**

1. Phản hồi thị giác ngay khi bấm (dưới 100ms).
2. Nút: vòng xoay + "Đang gửi…", tạm khóa, giữ nguyên kích thước (không xô lệch bố cục).
3. Máy chủ: khóa chống trùng (idempotency key) theo phiên/hồ sơ.
4. Quá 10 giây: "Vẫn đang gửi, vui lòng không đóng trang".
5. Lỗi: mở lại nút, giữ dữ liệu, báo rõ ([V8](#v8)).

**✅ Nên**

- Bấm 4 lần liên tiếp → chỉ 1 hồ sơ được tạo.

**❌ Không nên**

- Nút không đổi trạng thái; bấm 4 lần → 4 hồ sơ, 4 email xác nhận.

**Tiêu chí kiểm tra:** Nút gửi có trạng thái đang xử lý và không thể tạo hồ sơ trùng khi bấm nhiều lần?

**Cơ sở:** [Ngưỡng Doherty](https://lawsofux.com/doherty-threshold/)  
**Nguồn:** [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/)  
**Kiểm thử:** [Kịch bản 7 · Bấm gửi liên tục](#kich-ban-7)  
**Liên quan:** [V6](#v6) · [V8](#v8)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="b5"></a>
#### B5 · Xác nhận đúng mức: chỉ khi không thể hoàn tác

**Nên** · Nút & hành động

> Gửi hồ sơ chính thức cần bước xem lại; đừng hỏi "Bạn có chắc?" cho mọi hành động. Ưu tiên cho hoàn tác.

**Vì sao:** Hộp thoại xác nhận lặp đi lặp lại khiến người dùng bấm "Đồng ý" theo phản xạ, mất tác dụng đúng lúc quan trọng. Cho hoàn tác là cách tha thứ lỗi tốt hơn.

**Cách làm:**

1. Gửi hồ sơ không sửa được: trang xem lại + câu nói rõ "Sau khi gửi, bạn không thể chỉnh sửa hồ sơ".
2. Xóa thành viên, xóa tệp: cho "Hoàn tác" trong vài giây thay vì popup.
3. Rời trang khi có dữ liệu chưa lưu: cảnh báo ([D4](#d4)).

**✅ Nên**

- "Đã xóa thành viên Trần Bảo Châu. [Hoàn tác]"

**❌ Không nên**

- Popup "Bạn có chắc muốn xóa?" mỗi lần xóa một tệp.

**Tiêu chí kiểm tra:** Hộp thoại xác nhận chỉ dùng cho hành động không thể hoàn tác; các hành động khác cho phép hoàn tác?

**Cơ sở:** Watkinson #6 · Không gây stress; Watkinson #9 · Quyền kiểm soát; [WCAG 3.3.4 · Phòng lỗi (pháp lý, tài chính)](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html)  
**Nguồn:** [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/)  
**Liên quan:** [R1](#r1) · [T2](#t2)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="b6"></a>
#### B6 · Vùng chạm tối thiểu 44 × 44px, cách nhau ít nhất 8px

**Bắt buộc** · Nút & hành động

> Nút, radio, checkbox, liên kết "Sửa", nút xóa tệp đều đủ lớn để chạm chính xác bằng ngón tay.

**Vì sao:** Mục tiêu nhỏ gây bấm nhầm, nhất là với người lớn tuổi (Luật Fitts). WCAG 2.2 yêu cầu tối thiểu 24 × 24px; Apple khuyến nghị 44pt, Material 48dp.

**Cách làm:**

1. Ô nhập và nút cao 44–48px.
2. Checkbox/radio: biểu tượng 20–24px nhưng vùng bấm (cả nhãn) ít nhất 44px.
3. Nút biểu tượng (xóa tệp, hiện mật khẩu): vùng bấm 44 × 44px dù biểu tượng nhỏ.

**✅ Nên**

- Cả dòng "( ) Cá nhân" cao 44px, bấm vào chữ cũng chọn được.

**❌ Không nên**

- Radio 14px, chỉ bấm trúng vòng tròn mới chọn được.

**Tiêu chí kiểm tra:** Mọi mục bấm được có vùng chạm ≥ 44 × 44px và cách nhau ≥ 8px?

**Cơ sở:** [Luật Fitts](https://lawsofux.com/fittss-law/); [WCAG 2.5.8 · Kích thước vùng chạm](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)  
**Nguồn:** [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/)  
**Liên quan:** [C6](#c6) · [M1](#m1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="nhom-u"></a>
### U · Tải tệp lên

_Yêu cầu tệp, kiểm tra, tiến trình, xem trước._

<a id="u1"></a>
#### U1 · Nêu yêu cầu tệp trước khi chọn

**Bắt buộc** · Tải tệp lên

> Định dạng, dung lượng tối đa, số lượng, kích thước/tỷ lệ ảnh, quy cách nội dung: ghi ngay dưới nhãn.

**Vì sao:** Chỉ biết tệp sai sau khi chờ tải lên xong là lãng phí và bực bội, nhất là với tệp lớn qua mạng di động.

**Cách làm:**

1. "Ảnh chân dung: JPG hoặc PNG, tối đa 5 MB, tỷ lệ 3:4, nền sáng."
2. "Bài dự thi: 1 tệp PDF, tối đa 20 MB, không ghi tên thí sinh trong bài."
3. Dùng `accept` để lọc tệp trong hộp chọn, nhưng vẫn kiểm tra lại.
4. Đơn vị dễ hiểu: "20 MB", không viết "20480 KB".

**✅ Nên**

- Nhãn "Bài dự thi" + "PDF, tối đa 20 MB. Không ghi tên thí sinh trong bài."

**❌ Không nên**

- Chỉ có nút "Choose file"; tải xong mới báo "File không hợp lệ".

**Tiêu chí kiểm tra:** Yêu cầu định dạng, dung lượng, số lượng và quy cách tệp hiển thị trước khi chọn tệp?

**Cơ sở:** Watkinson #4 · Kỳ vọng  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Kiểm thử:** [Kịch bản 8 · Tệp sai và tệp quá lớn](#kich-ban-8)  
**Liên quan:** [U2](#u2) · [F1](#f1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="u2"></a>
#### U2 · Kiểm tra tệp ngay khi chọn, báo lỗi cụ thể

**Bắt buộc** · Tải tệp lên

> Kiểm tra định dạng, dung lượng ngay trên trình duyệt trước khi tải lên. Lỗi nêu tên tệp, lý do, cách khắc phục.

**Vì sao:** Tải lên 18 MB rồi mới bị từ chối vì sai định dạng là lãng phí thời gian và dữ liệu di động.

**Cách làm:**

1. "Tệp "bai-du-thi.docx" không đúng định dạng. Hãy lưu thành PDF rồi tải lên lại."
2. "Tệp "anh.jpg" có dung lượng 8,4 MB, vượt giới hạn 5 MB."
3. Ảnh HEIC từ iPhone: giải thích cách đổi sang JPG.
4. Máy chủ vẫn kiểm tra lại (bảo mật).

**✅ Nên**

- Chọn tệp .docx → lỗi hiện ngay, chưa tốn một byte tải lên.

**❌ Không nên**

- Thanh tiến trình chạy hết 100% rồi mới báo "Sai định dạng".

**Tiêu chí kiểm tra:** Tệp được kiểm tra ngay khi chọn và lỗi nêu tên tệp, lý do, cách khắc phục?

**Cơ sở:** Watkinson #6 · Không gây stress; [Ngưỡng Doherty](https://lawsofux.com/doherty-threshold/); [WCAG 3.3.1 · Xác định lỗi](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html); [WCAG 3.3.3 · Gợi ý sửa lỗi](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Kiểm thử:** [Kịch bản 8 · Tệp sai và tệp quá lớn](#kich-ban-8)  
**Liên quan:** [U1](#u1) · [U3](#u3) · [V3](#v3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="u3"></a>
#### U3 · Hiển thị tiến trình, cho hủy và thử lại

**Nên** · Tải tệp lên

> Thanh tiến trình theo phần trăm, nút Hủy, thử lại khi mạng chập chờn; vẫn cho điền phần khác trong lúc tải.

**Vì sao:** Tải tệp lớn qua mạng di động có thể mất hàng chục giây. Không có tiến trình, người dùng tưởng treo và tải lại trang — mất hết.

**Cách làm:**

1. Tải lên ngay khi chọn tệp, không đợi bấm Gửi cuối form.
2. "Đang tải lên 45% · 9 / 20 MB" + nút "Hủy".
3. Lỗi mạng: "Tải lên bị gián đoạn. [Thử lại]" — giữ tệp đã chọn.
4. Bấm Gửi khi tệp đang tải: báo "Đợi tệp tải lên xong rồi tiếp tục".

**✅ Nên**

- Thanh tiến trình + "Hủy"; mất mạng → "Thử lại".

**❌ Không nên**

- Tệp chỉ được tải khi bấm "Gửi hồ sơ", màn hình đứng im 40 giây.

**Tiêu chí kiểm tra:** Tải tệp có tiến trình, cho hủy/thử lại và không chặn điền các phần khác?

**Cơ sở:** [Ngưỡng Doherty](https://lawsofux.com/doherty-threshold/); Watkinson #9 · Quyền kiểm soát; [WCAG 4.1.3 · Thông báo trạng thái](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [U2](#u2) · [U4](#u4) · [V5](#v5)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="u4"></a>
#### U4 · Sau khi tải lên: xem lại, thay, xóa

**Nên** · Tải tệp lên

> Hiển thị tên tệp, dung lượng, ảnh thu nhỏ; có "Thay tệp" và "Xóa" rõ ràng; xóa có hoàn tác.

**Vì sao:** Người dùng cần chắc mình đã chọn đúng tệp — đúng bài, đúng ảnh — nhất là khi trong máy có nhiều phiên bản.

**Cách làm:**

1. Ảnh: ảnh thu nhỏ. PDF: tên tệp + dung lượng.
2. "Thay tệp" mở lại hộp chọn. "Xóa" cho hoàn tác ([B5](#b5)).
3. Trang xem lại: hiển thị tệp đã tải.

**✅ Nên**

- [ảnh] chan-dung.jpg · 1,2 MB · Đã tải lên · Thay tệp · Xóa

**❌ Không nên**

- Chỉ hiện "1 file selected".

**Tiêu chí kiểm tra:** Sau khi tải lên, người dùng xem lại được tệp và thay/xóa dễ dàng?

**Cơ sở:** Watkinson #9 · Quyền kiểm soát  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [U3](#u3) · [R1](#r1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="u5"></a>
#### U5 · Giúp người dùng đạt yêu cầu thay vì từ chối

**Cân nhắc** · Tải tệp lên

> Tự nén ảnh quá lớn, cho cắt ảnh đúng tỷ lệ 3:4, cho chụp trực tiếp bằng điện thoại.

**Vì sao:** Hệ thống hấp thụ độ phức tạp (Luật Tesler). Ảnh chụp điện thoại thường 3–8 MB; bắt người dùng tự tìm cách nén là đẩy việc kỹ thuật sang họ.

**Cách làm:**

1. Ảnh vượt dung lượng: nén ngay trên trình duyệt (canvas) xuống dưới giới hạn, báo "Đã tối ưu ảnh còn 1,2 MB".
2. Cắt ảnh theo khung 3:4 ngay trong form.
3. `accept="image/*"` để điện thoại đề xuất máy ảnh hoặc thư viện.
4. Kéo-thả trên máy tính chỉ là bổ sung; luôn có nút "Chọn tệp".

**✅ Nên**

- Chọn ảnh 6,2 MB → "Ảnh đã được tối ưu từ 6,2 MB còn 0,9 MB".

**❌ Không nên**

- "Ảnh vượt quá 2 MB. Vui lòng nén ảnh trước khi tải lên."

**Tiêu chí kiểm tra:** Hệ thống hỗ trợ nén/cắt ảnh, chụp trực tiếp, thay vì chỉ từ chối tệp chưa đạt?

**Cơ sở:** [Luật Tesler](https://lawsofux.com/teslers-law/)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Kiểm thử:** [Kịch bản 8 · Tệp sai và tệp quá lớn](#kich-ban-8)  
**Liên quan:** [U2](#u2)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="nhom-d"></a>
### D · Lưu nháp & thời hạn

_Tự lưu, tiếp tục sau, hết phiên, hạn chót._

<a id="d1"></a>
#### D1 · Tự động lưu nháp cho form dài

**Bắt buộc** · Lưu nháp & thời hạn

> Form nhiều bước hoặc có bài viết dài phải tự lưu, và hiển thị "Đã lưu lúc 14:32".

**Vì sao:** Bị gián đoạn — cuộc gọi, hết pin, mất mạng — là chuyện thường. Không có lưu nháp thì mọi công sức mất trắng ([V5](#v5)).

**Cách làm:**

1. Lưu khi chuyển bước và sau vài giây ngừng gõ.
2. Trạng thái nhỏ, bình tĩnh: "Đang lưu…" → "Đã lưu lúc 14:32".
3. Quay lại: "Bạn có bản nháp lưu lúc 14:32. [Tiếp tục điền] [Bắt đầu lại]".
4. Không lưu mật khẩu, mã OTP trong bản nháp.
5. Xem cách làm trong [Form mẫu](#mau-cau-truc).

**✅ Nên**

- "Đã lưu nháp lúc 14:32" ở đầu form; tải lại trang vẫn còn dữ liệu.

**❌ Không nên**

- Viết bài luận 20 phút, lỡ vuốt Back, mất hết.

**Tiêu chí kiểm tra:** Form dài tự lưu nháp, hiển thị trạng thái lưu, và khôi phục khi quay lại?

**Cơ sở:** Watkinson #6 · Không gây stress; [Quy tắc Peak–End](https://lawsofux.com/peak-end-rule/)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Kiểm thử:** [Kịch bản 5 · Tải lại trang giữa chừng](#kich-ban-5)  
**Liên quan:** [V5](#v5) · [D2](#d2)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="d2"></a>
#### D2 · Cho phép tiếp tục trên thiết bị khác

**Nên** · Lưu nháp & thời hạn

> Liên kết tiếp tục qua email/SMS hoặc đăng nhập; nói rõ bản nháp được giữ đến khi nào.

**Vì sao:** Nhiều người bắt đầu trên điện thoại, rồi tìm tệp và hoàn tất trên máy tính.

**Cách làm:**

1. Nút "Lưu và tiếp tục sau" → nhập email → gửi liên kết tiếp tục.
2. Nói rõ: "Bản nháp được giữ đến hết hạn đăng ký, 30/11/2026."
3. Liên kết có thời hạn, an toàn, không chứa dữ liệu cá nhân trong URL.

**✅ Nên**

- "Đã gửi liên kết tiếp tục tới minh.anh@gmail.com. Bản nháp giữ đến 30/11/2026."

**❌ Không nên**

- Bản nháp chỉ nằm trên trình duyệt điện thoại, người dùng không hề biết.

**Tiêu chí kiểm tra:** Người dùng lưu và tiếp tục được trên thiết bị khác, biết bản nháp được giữ bao lâu?

**Cơ sở:** Watkinson #9 · Quyền kiểm soát  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [D1](#d1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="d3"></a>
#### D3 · Phiên làm việc không được âm thầm hết hạn

**Bắt buộc** · Lưu nháp & thời hạn

> Nếu giới hạn thời gian, cảnh báo trước ít nhất 2 phút, cho gia hạn bằng một thao tác; hết hạn vẫn giữ dữ liệu.

**Vì sao:** Viết bài 20 phút rồi bấm Gửi và bị đăng xuất là thất bại tệ nhất. WCAG 2.2.1 yêu cầu cho người dùng điều chỉnh thời gian.

**Cách làm:**

1. Hộp cảnh báo: "Phiên làm việc sẽ hết hạn sau 2 phút. [Tiếp tục làm việc]".
2. Tự gia hạn khi người dùng đang thao tác.
3. Hết hạn: lưu nháp; đăng nhập lại thì quay về đúng chỗ.

**✅ Nên**

- Còn 2 phút → hộp cảnh báo có nút "Tiếp tục làm việc".

**❌ Không nên**

- Bấm Gửi sau 30 phút → "Phiên đã hết hạn", về trang đăng nhập, form trống.

**Tiêu chí kiểm tra:** Không có hết phiên âm thầm: có cảnh báo, cho gia hạn, giữ dữ liệu khi hết phiên?

**Cơ sở:** Watkinson #6 · Không gây stress; [WCAG 2.2.1 · Điều chỉnh thời gian](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Kiểm thử:** [Kịch bản 15 · Để form mở thật lâu](#kich-ban-15)  
**Liên quan:** [V5](#v5) · [D1](#d1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="d4"></a>
#### D4 · Cảnh báo khi rời trang có dữ liệu chưa lưu

**Nên** · Lưu nháp & thời hạn

> Chỉ cảnh báo khi thật sự có thay đổi chưa lưu; đã tự lưu thì không cần.

**Vì sao:** Bấm nhầm Back hoặc đóng tab là lỗi "trượt tay" phổ biến. Cảnh báo đúng lúc cứu dữ liệu; cảnh báo thừa gây phiền.

**Cách làm:**

1. Dùng sự kiện `beforeunload` khi có dữ liệu chưa lưu.
2. Điều hướng trong ứng dụng: hộp thoại tự thiết kế, hai lựa chọn rõ: "Ở lại" / "Rời đi, bỏ thay đổi".

**✅ Nên**

- Có thay đổi chưa lưu → hỏi; đã tự lưu → không hỏi.

**❌ Không nên**

- Hỏi "Bạn có chắc muốn rời trang?" kể cả khi chưa nhập gì.

**Tiêu chí kiểm tra:** Có cảnh báo khi rời trang với dữ liệu chưa lưu, và không cảnh báo thừa?

**Cơ sở:** Watkinson #6 · Không gây stress  
**Nguồn:** [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/)  
**Liên quan:** [D1](#d1) · [B5](#b5)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="d5"></a>
#### D5 · Hạn chót rõ ràng: giờ, ngày, múi giờ

**Bắt buộc** · Lưu nháp & thời hạn

> "Hạn chót: 23:59 ngày 30/11/2026 (giờ Việt Nam)". Nhắc khi còn ít thời gian.

**Vì sao:** "Hạn chót 30/11" khiến người dùng không rõ là 00:00 hay 23:59. Người ở nước ngoài cần múi giờ. Nhắc sớm giúp họ chủ động.

**Cách làm:**

1. Ghi đủ: giờ, ngày, múi giờ (GMT+7) nếu có người dự thi quốc tế.
2. Còn dưới 24 giờ: "Còn 5 giờ để nộp hồ sơ".
3. Cho thêm vào lịch (Google Calendar, tệp .ics).
4. Máy chủ chấp nhận hồ sơ đang gửi dở tại thời điểm hết hạn (biên độ vài phút).

**✅ Nên**

- "Hạn chót 23:59, 30/11/2026 (giờ Việt Nam) · Còn 33 ngày"

**❌ Không nên**

- "Deadline: 30/11"

**Tiêu chí kiểm tra:** Hạn chót ghi rõ giờ, ngày, múi giờ, và có nhắc khi sắp hết hạn?

**Cơ sở:** Watkinson #4 · Kỳ vọng  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [F1](#f1) · [T4](#t4)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="nhom-r"></a>
### R · Xem lại & gửi

_Trang xem lại, đồng ý điều khoản, xác thực OTP._

<a id="r1"></a>
#### R1 · Trang xem lại trước khi gửi

**Nên** · Xem lại & gửi

> Tóm tắt câu trả lời theo nhóm; mỗi dòng có "Sửa" về đúng trường; sửa xong quay lại trang xem lại.

**Vì sao:** Đây là cơ hội cuối để bắt lỗi chính tả email, nhầm hạng mục. "Sửa" mà đưa về đầu form, bắt đi lại từng bước, thì người dùng sẽ lười sửa.

**Cách làm:**

1. Dạng danh sách: nhãn – giá trị – "Sửa".
2. "Sửa" đưa đến đúng bước, focus đúng trường; nút chính đổi thành "Lưu và quay lại trang xem lại".
3. Hiển thị tệp đã tải lên.
4. Che bớt thông tin nhạy cảm nếu màn hình có thể bị người khác nhìn ([P3](#p3)).

**✅ Nên**

- "Email · minh.anh@gmail.com · Sửa" → sửa xong → quay lại trang xem lại.

**❌ Không nên**

- Không có trang xem lại; hoặc "Sửa" quay về bước 1.

**Tiêu chí kiểm tra:** Có trang xem lại với "Sửa" về đúng trường, và quay lại trang xem lại sau khi sửa?

**Cơ sở:** Watkinson #9 · Quyền kiểm soát; Watkinson #6 · Không gây stress; [WCAG 3.3.4 · Phòng lỗi (pháp lý, tài chính)](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html)  
**Nguồn:** [GOV.UK · Check answers](https://design-system.service.gov.uk/patterns/check-answers/)  
**Liên quan:** [R2](#r2) · [F3](#f3) · [P3](#p3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="r2"></a>
#### R2 · Đồng ý điều khoản: không chọn sẵn, ngắn gọn, tách theo mục đích

**Bắt buộc** · Xem lại & gửi

> Mỗi mục đích một ô riêng: thể lệ cuộc thi (bắt buộc), nhận tin (không bắt buộc). Không chọn sẵn.

**Vì sao:** Gộp "đồng ý thể lệ + nhận quảng cáo" vào một ô là ép buộc, trái yêu cầu đồng ý rõ ràng, tự nguyện, theo từng mục đích của pháp luật bảo vệ dữ liệu cá nhân Việt Nam. Văn bản dài trong ô cuộn nhỏ thì không ai đọc.

**Cách làm:**

1. "Tôi đã đọc và đồng ý với Thể lệ cuộc thi" — liên kết mở trong bảng phụ hoặc tab mới, không làm mất dữ liệu.
2. Tóm tắt 2–3 điểm chính (quyền sử dụng tác phẩm, xử lý dữ liệu) ngay cạnh ô.
3. Ô nhận tin: riêng, không bắt buộc, không chọn sẵn.
4. Lưu bằng chứng đồng ý: thời điểm, phiên bản điều khoản.

**✅ Nên**

- ☐ Đồng ý thể lệ (bắt buộc)  ☐ Nhận tin cuộc thi tiếp theo (không bắt buộc)

**❌ Không nên**

- ☑ Tôi đồng ý với điều khoản và nhận thông tin khuyến mãi (đã tích sẵn)

**Tiêu chí kiểm tra:** Ô đồng ý không chọn sẵn, tách theo mục đích, có liên kết đọc đầy đủ mà không mất dữ liệu?

**Cơ sở:** Watkinson #9 · Quyền kiểm soát; [WCAG 3.3.4 · Phòng lỗi (pháp lý, tài chính)](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [C5](#c5) · [P1](#p1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="r3"></a>
#### R3 · Xác thực OTP ít ma sát

**Nên** · Xem lại & gửi

> Một ô 6 số, `autocomplete="one-time-code"`, tự điền từ SMS, cho dán, đếm ngược gửi lại, cho sửa số điện thoại.

**Vì sao:** OTP là điểm rơi quen thuộc: SMS đến chậm, 6 ô riêng không dán được, không có cách sửa số đã nhập nhầm.

**Cách làm:**

1. Một ô (hoặc 6 ô nhưng nhận dán cả chuỗi), `inputmode="numeric"`, `autocomplete="one-time-code"`.
2. "Mã đã gửi tới 0912 \*\*\* 678. Sửa số" — cho sửa ngay.
3. "Gửi lại mã sau 60 giây" đếm ngược; có phương án dự phòng (gọi thoại, email).
4. Đủ 6 số thì tự kiểm tra, nhưng không chuyển trang bất ngờ nếu sai.
5. Mã sai: "Mã chưa đúng. Kiểm tra lại tin nhắn hoặc gửi lại mã" — không xóa ô.

**✅ Nên**

- Một ô nhận dán "123456", tự xác thực.

**❌ Không nên**

- 6 ô, dán chỉ vào được ô đầu; không có nút gửi lại.

**Tiêu chí kiểm tra:** OTP (nếu có) tự điền được, cho dán, có đếm ngược gửi lại, và cho sửa số điện thoại?

**Cơ sở:** Watkinson #5 · Không tốn sức; [WCAG 3.3.8 · Xác thực dễ tiếp cận](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html)  
**Nguồn:** [web.dev · SMS OTP form best practices](https://web.dev/articles/sms-otp-form)  
**Liên quan:** [I1](#i1) · [A5](#a5)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="nhom-k"></a>
### K · Sau khi gửi

_Trang xác nhận, email, theo dõi hồ sơ._

<a id="k1"></a>
#### K1 · Trang xác nhận rõ ràng: mã hồ sơ và bước tiếp theo

**Bắt buộc** · Sau khi gửi

> "Đăng ký thành công" + mã hồ sơ + tóm tắt + mốc thời gian tiếp theo + kênh hỗ trợ.

**Vì sao:** Đây là khoảnh khắc kết thúc — theo quy tắc Peak–End, người dùng sẽ nhớ cảm giác ở đây. Không có mã hồ sơ và bước tiếp theo, họ lo lắng, gọi hotline, hoặc đăng ký thêm lần nữa.

**Cách làm:**

1. Tiêu đề lớn: "Đăng ký thành công". Không chỉ là một toast vài giây.
2. Mã hồ sơ lớn, dễ sao chép: "YT26-04821".
3. "Chúng tôi đã gửi email xác nhận tới minh.anh@gmail.com."
4. Các bước tiếp theo theo mốc thời gian: "15/12: Công bố danh sách vòng 2".
5. Hành động: thêm vào lịch, xem hồ sơ. Kênh hỗ trợ hiển thị dạng chữ.

**✅ Nên**

- Mã hồ sơ + 3 mốc thời gian + "Thêm hạn chót vào lịch".

**❌ Không nên**

- Toast "Thành công!" 3 giây, rồi form trắng hiện lại.

**Tiêu chí kiểm tra:** Trang xác nhận có thông điệp thành công, mã hồ sơ, bước tiếp theo và kênh hỗ trợ?

**Cơ sở:** [Quy tắc Peak–End](https://lawsofux.com/peak-end-rule/); Watkinson #4 · Kỳ vọng  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [K2](#k2) · [K3](#k3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="k2"></a>
#### K2 · Gửi email/SMS xác nhận ngay

**Bắt buộc** · Sau khi gửi

> Email trong vài phút, có mã hồ sơ, tóm tắt thông tin, liên kết xem/sửa hồ sơ.

**Vì sao:** Email xác nhận là bằng chứng người dùng giữ lại. Không nhận được ngay, họ nghi ngờ hồ sơ đã gửi hay chưa.

**Cách làm:**

1. Tiêu đề: "[Tên cuộc thi] Xác nhận đăng ký – Mã hồ sơ YT26-04821".
2. Nội dung: tóm tắt, mốc thời gian, liên kết xem hồ sơ, hướng dẫn nếu cần sửa.
3. Trang xác nhận nhắc kiểm tra thư mục Spam/Quảng cáo.
4. Che bớt dữ liệu nhạy cảm trong email ([P3](#p3)).

**✅ Nên**

- Email đến sau 1 phút, tiêu đề có mã hồ sơ.

**❌ Không nên**

- Không có email; hoặc email "no-reply" tiêu đề "Thông báo" không rõ nội dung.

**Tiêu chí kiểm tra:** Email/SMS xác nhận được gửi ngay với mã hồ sơ, tóm tắt và liên kết xem hồ sơ?

**Cơ sở:** [Quy tắc Peak–End](https://lawsofux.com/peak-end-rule/); Watkinson #4 · Kỳ vọng  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [K1](#k1) · [P3](#p3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="k3"></a>
#### K3 · Cho xem trạng thái và sửa trong thời hạn

**Nên** · Sau khi gửi

> Trang hồ sơ hiển thị trạng thái (Đã nhận → Đang xét → Hợp lệ / Cần bổ sung) và cho sửa đến hạn chót.

**Vì sao:** Trao quyền kiểm soát cho người dùng. "Cần bổ sung" mà không có cách bổ sung trực tuyến thì cả hai phía phải email, gọi điện qua lại.

**Cách làm:**

1. Trạng thái dạng dòng thời gian, có ngày giờ.
2. "Cần bổ sung": nêu rõ thiếu gì, hạn bổ sung, nút đưa thẳng tới trường cần sửa.
3. Gửi email khi trạng thái thay đổi.

**✅ Nên**

- "Cần bổ sung: Ảnh chân dung chưa đúng tỷ lệ 3:4. Hạn bổ sung 05/12. [Bổ sung ngay]"

**❌ Không nên**

- Hồ sơ "Không hợp lệ", không lý do, không cách sửa.

**Tiêu chí kiểm tra:** Người dùng xem được trạng thái hồ sơ và sửa/bổ sung trực tuyến trong thời hạn?

**Cơ sở:** Watkinson #9 · Quyền kiểm soát  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [K1](#k1) · [F7](#f7)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="nhom-t"></a>
### T · Tình huống đặc thù

_Câu hỏi điều kiện, đội nhóm, người giám hộ, đóng/mở cổng._

<a id="t1"></a>
#### T1 · Câu hỏi điều kiện hiện ngay dưới câu kích hoạt

**Nên** · Tình huống đặc thù

> Chỉ hiện câu hỏi phụ khi cần, ngay dưới lựa chọn kích hoạt, thụt lề để thấy quan hệ.

**Vì sao:** Tiết lộ dần (progressive disclosure) giảm số trường người dùng phải nhìn. Nhưng hiện câu hỏi phụ ở chỗ khác (cuối trang, bước sau) khiến họ không thấy quan hệ nhân quả.

**Cách làm:**

1. "Hình thức tham gia?" Cá nhân / Theo đội → chọn Theo đội thì hiện "Tên đội" ngay bên dưới.
2. Thụt lề + vạch bên trái để thể hiện "thuộc về" lựa chọn.
3. Ẩn lại khi đổi lựa chọn: không gửi dữ liệu của phần bị ẩn.
4. Không lồng điều kiện quá một cấp; cần hơn thì tách bước.

**✅ Nên**

- Chọn "Theo đội" → ô "Tên đội" hiện ngay dưới, thụt lề.

**❌ Không nên**

- Chọn "Theo đội" ở bước 1, đến bước 4 mới hỏi tên thành viên.

**Tiêu chí kiểm tra:** Câu hỏi điều kiện hiện ngay dưới câu kích hoạt, và dữ liệu phần bị ẩn không được gửi đi?

**Cơ sở:** [Luật Hick](https://lawsofux.com/hicks-law/); [Luật Gần nhau](https://lawsofux.com/law-of-proximity/); [WCAG 3.2.2 · Khi nhập liệu](https://www.w3.org/WAI/WCAG22/Understanding/on-input.html)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [T2](#t2) · [A4](#a4)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="t2"></a>
#### T2 · Đăng ký theo đội: rõ số lượng, thêm/xóa dễ, có hoàn tác

**Nên** · Tình huống đặc thù

> Nêu "Đội gồm 2–5 thành viên", nút "Thêm thành viên", mỗi người một khối gọn; xóa có hoàn tác.

**Vì sao:** Danh sách thành viên là phần dài và dễ sai nhất của form đội. Người dùng cần biết giới hạn trước và không sợ xóa nhầm.

**Cách làm:**

1. Thành viên 1 là người đăng ký, điền sẵn ([T5](#t5)).
2. Mỗi thành viên chỉ hỏi tối thiểu: họ tên, email (để mời xác nhận).
3. Đạt tối đa: ẩn nút thêm, hiện "Đã đủ 5 thành viên".
4. Xóa: "Đã xóa Trần Bảo Châu. [Hoàn tác]" thay vì popup.
5. Cân nhắc mời thành viên tự điền thông tin của họ qua email.

**✅ Nên**

- "3/5 thành viên" + [Thêm thành viên] + hoàn tác khi xóa.

**❌ Không nên**

- Bảng 5 dòng × 6 cột trống sẵn, bắt điền đủ cả 5.

**Tiêu chí kiểm tra:** Form đội nêu rõ số lượng thành viên, thêm/xóa dễ, và có hoàn tác khi xóa?

**Cơ sở:** Watkinson #6 · Không gây stress; Watkinson #9 · Quyền kiểm soát  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [T1](#t1) · [B5](#b5)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="t3"></a>
#### T3 · Chưa đủ 18 tuổi: hỏi người giám hộ đúng lúc

**Nên** · Tình huống đặc thù

> Dựa vào ngày sinh để hiện phần người giám hộ, chỉ khi cần, kèm lý do.

**Vì sao:** Hỏi người giám hộ với mọi người là thừa; không hỏi thì hồ sơ thiếu tính pháp lý. Suy ra từ ngày sinh giúp bỏ được câu "Bạn dưới 18 tuổi?".

**Cách làm:**

1. Ngày sinh hợp lệ và dưới 18 tuổi tính đến ngày tham chiếu (ví dụ hạn chót) → hiện "Thông tin người giám hộ".
2. Giải thích: "Vì bạn chưa đủ 18 tuổi, cần thông tin của cha, mẹ hoặc người giám hộ hợp pháp."
3. Hỏi: họ tên, quan hệ, số điện thoại; ô đồng ý của người giám hộ ở bước cuối.

**✅ Nên**

- Nhập ngày sinh 2010 → phần người giám hộ hiện ra ngay bên dưới.

**❌ Không nên**

- Mọi thí sinh đều phải điền "Thông tin phụ huynh".

**Tiêu chí kiểm tra:** Phần người giám hộ chỉ xuất hiện khi thí sinh chưa đủ tuổi theo ngày sinh, kèm lý do?

**Cơ sở:** [Luật Tesler](https://lawsofux.com/teslers-law/)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [T1](#t1) · [I7](#i7)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="t4"></a>
#### T4 · Trạng thái cổng đăng ký rõ ràng

**Bắt buộc** · Tình huống đặc thù

> Chưa mở: ngày mở + nút nhắc. Sắp đóng: thời gian còn lại. Đã đóng hoặc hết suất: nói rõ, không hiện form.

**Vì sao:** Cho người dùng điền form rồi mới báo "đã hết hạn" là lãng phí và gây ức chế. Thiết lập đúng kỳ vọng ngay khi vào trang.

**Cách làm:**

1. Chưa mở: "Cổng đăng ký mở lúc 08:00 ngày 01/11/2026." + "Nhắc tôi qua email".
2. Đang mở: hạn chót luôn hiển thị ở đầu form.
3. Hết suất: "Hạng mục A đã đủ số lượng" + danh sách chờ hoặc hạng mục khác.
4. Đã đóng: "Đã hết hạn đăng ký lúc 23:59 ngày 30/11/2026." + lịch các vòng tiếp theo.

**✅ Nên**

- Màn hình "Đã hết hạn đăng ký" + lịch chung kết.

**❌ Không nên**

- Form vẫn hiện; bấm Gửi mới báo "Hết hạn".

**Tiêu chí kiểm tra:** Các trạng thái chưa mở, đang mở, sắp đóng, đã đóng, hết suất đều có màn hình và thông điệp rõ?

**Cơ sở:** Watkinson #4 · Kỳ vọng  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [D5](#d5) · [F1](#f1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="t5"></a>
#### T5 · Không bắt nhập lại thông tin đã có

**Nên** · Tình huống đặc thù

> Điền sẵn từ tài khoản, từ bước trước; dùng "Giống địa chỉ thường trú" thay vì bắt nhập lần hai.

**Vì sao:** Nhập lại cùng thông tin vừa tốn công vừa dễ sai lệch (WCAG 3.3.7).

**Cách làm:**

1. Đã đăng nhập: điền sẵn họ tên, email, SĐT — cho sửa.
2. "Địa chỉ liên hệ giống địa chỉ thường trú" (checkbox).
3. Trưởng nhóm là thành viên 1: điền sẵn từ người đăng ký.
4. Đăng ký mùa sau: đề xuất dùng lại hồ sơ cũ.

**✅ Nên**

- Thành viên 1 tự điền từ thông tin người đăng ký.

**❌ Không nên**

- Bước 3 hỏi lại họ tên, email của trưởng nhóm đã nhập ở bước 1.

**Tiêu chí kiểm tra:** Thông tin đã cung cấp (tài khoản, bước trước) được điền sẵn, không bắt nhập lại?

**Cơ sở:** [Luật Tesler](https://lawsofux.com/teslers-law/); Watkinson #5 · Không tốn sức; [WCAG 3.3.7 · Không bắt nhập lại](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html)  
**Nguồn:** [web.dev · Sign-up form best practices](https://web.dev/articles/sign-up-form-best-practices)  
**Liên quan:** [I9](#i9) · [I2](#i2) · [T2](#t2)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="nhom-m"></a>
### M · Trên điện thoại

_Cỡ chữ, bàn phím ảo, phím Enter, mạng chậm._

<a id="m1"></a>
#### M1 · Chữ trong ô ≥ 16px, ô cao ≥ 44px

**Bắt buộc** · Trên điện thoại

> Cỡ chữ ô nhập tối thiểu 16px để iOS không tự phóng to; ô và nút cao 44–48px; không chặn người dùng phóng to.

**Vì sao:** Safari trên iOS tự phóng to khi chạm vào ô có chữ nhỏ hơn 16px, làm vỡ bố cục, người dùng phải thu nhỏ thủ công.

**Cách làm:**

1. `font-size: 16px` cho input, select, textarea.
2. Không dùng `maximum-scale=1` hay `user-scalable=no` (vi phạm tiếp cận).
3. Khoảng cách giữa các trường 16–24px.

**✅ Nên**

- Ô cao 48px, chữ 16px.

**❌ Không nên**

- Ô cao 32px, chữ 13px; chạm vào là màn hình phóng to.

**Tiêu chí kiểm tra:** Ô nhập có cỡ chữ ≥ 16px, cao ≥ 44px, và không chặn người dùng phóng to?

**Cơ sở:** [Luật Fitts](https://lawsofux.com/fittss-law/); [WCAG 2.5.8 · Kích thước vùng chạm](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)  
**Nguồn:** [web.dev · Sign-up form best practices](https://web.dev/articles/sign-up-form-best-practices)  
**Kiểm thử:** [Kịch bản 13 · Trên điện thoại thật](#kich-ban-13)  
**Liên quan:** [B6](#b6) · [M2](#m2)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="m2"></a>
#### M2 · Bàn phím ảo không che ô đang nhập

**Nên** · Trên điện thoại

> Khi chạm vào ô, ô và thông báo lỗi của nó phải nằm trong vùng nhìn thấy phía trên bàn phím.

**Vì sao:** Bàn phím chiếm 40–50% màn hình. Thanh nút dính đáy, banner, nút chat nổi dễ che mất ô đang nhập.

**Cách làm:**

1. Cuộn ô vào giữa vùng nhìn thấy khi focus (`scrollIntoView({block:'center'})`).
2. Ẩn thanh dính đáy, nút chat nổi khi bàn phím mở.
3. Thử trên máy thật iOS và Android, không chỉ trình giả lập.

**✅ Nên**

- Chạm ô cuối → ô cuộn lên giữa màn hình, nút chat ẩn đi.

**❌ Không nên**

- Nút chat nổi và thanh "Gửi" dính đáy che ô "Mô tả".

**Tiêu chí kiểm tra:** Khi bàn phím mở, ô đang nhập và lỗi của nó luôn nhìn thấy được?

**Cơ sở:** [WCAG 2.4.11 · Focus không bị che](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)  
**Nguồn:** [web.dev · Sign-up form best practices](https://web.dev/articles/sign-up-form-best-practices)  
**Kiểm thử:** [Kịch bản 13 · Trên điện thoại thật](#kich-ban-13)  
**Liên quan:** [B3](#b3) · [M1](#m1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="m3"></a>
#### M3 · Phím Enter trên bàn phím làm đúng việc

**Nên** · Trên điện thoại

> `enterkeyhint="next"` để chuyển ô, `done`/`send` ở ô cuối; Enter không gửi form khi chưa xong.

**Vì sao:** Người dùng điện thoại hay bấm phím xanh trên bàn phím để đi tiếp. Gửi form sớm ngoài ý muốn là lỗi "trượt tay" phổ biến.

**Cách làm:**

1. `enterkeyhint="next"` cho ô giữa, `done` cho ô cuối của bước, `send` cho ô cuối của form.
2. Trong textarea, Enter xuống dòng.
3. Ở bước giữa, Enter = Tiếp tục (sau khi kiểm tra), không phải gửi hồ sơ.

**✅ Nên**

- Phím Enter hiện chữ "Tiếp" ở các ô giữa.

**❌ Không nên**

- Bấm Enter ở ô Email → hồ sơ bị gửi đi khi chưa điền phần còn lại.

**Tiêu chí kiểm tra:** Phím Enter/Next trên bàn phím chuyển ô hoặc hoàn tất bước đúng như mong đợi?

**Cơ sở:** Watkinson #5 · Không tốn sức  
**Nguồn:** [MDN · enterkeyhint](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/enterkeyhint)  
**Liên quan:** [M1](#m1) · [A4](#a4)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="m4"></a>
#### M4 · Chạy tốt trên mạng chậm và màn hình nhỏ

**Nên** · Trên điện thoại

> Form tải nhanh, không phụ thuộc thư viện nặng; không có bảng ngang phải cuộn.

**Vì sao:** Nhiều người đăng ký bằng 4G ở nơi sóng yếu. Phản hồi chậm làm người dùng mất tập trung (ngưỡng Doherty).

**Cách làm:**

1. Form dùng được trong dưới 3 giây trên 4G.
2. Tối ưu ảnh; trì hoãn script không cần (chat, quảng cáo, tracking).
3. Bảng so sánh hạng mục: chuyển thành thẻ xếp dọc trên điện thoại.
4. Kiểm thử ở chiều rộng 360px và phóng to 200%.

**✅ Nên**

- Form hiện đầy đủ ở 360px, không cuộn ngang.

**❌ Không nên**

- Bảng 6 cột hạng mục phải cuộn ngang trên điện thoại.

**Tiêu chí kiểm tra:** Form tải nhanh trên mạng di động và hiển thị tốt ở màn hình 360px?

**Cơ sở:** [Ngưỡng Doherty](https://lawsofux.com/doherty-threshold/)  
**Nguồn:** [web.dev · Sign-up form best practices](https://web.dev/articles/sign-up-form-best-practices)  
**Kiểm thử:** [Kịch bản 10 · Màn hình 360px và phóng to 200%](#kich-ban-10); [Kịch bản 13 · Trên điện thoại thật](#kich-ban-13)  
**Liên quan:** [M1](#m1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="nhom-a"></a>
### A · Tiếp cận

_Bàn phím, trình đọc màn hình, tương phản, CAPTCHA._

<a id="a1"></a>
#### A1 · Dùng được hoàn toàn bằng bàn phím, focus luôn nhìn thấy

**Bắt buộc** · Tiếp cận

> Tab theo đúng thứ tự đọc, focus có viền rõ, mọi điều khiển tự dựng (dropdown, tải tệp, thẻ chọn) dùng được bằng phím.

**Vì sao:** Người dùng bàn phím, trình đọc màn hình và người dùng thành thạo đều dựa vào thứ tự Tab. Ẩn focus (`outline: none`) khiến họ lạc trong form.

**Cách làm:**

1. Không xóa outline khi chưa có kiểu focus thay thế; viền focus ≥ 2px, tương phản ≥ 3:1.
2. Thứ tự DOM = thứ tự hiển thị; không dùng `tabindex` dương.
3. Radio: phím mũi tên. Checkbox: Space. Combobox: ↑ ↓ Enter Esc.
4. Vùng tải tệp phải là nút bấm thật (button hoặc label của input file).

**✅ Nên**

- Tab qua toàn bộ form, mọi ô và nút đều có viền focus xanh dày.

**❌ Không nên**

- `*:focus { outline: none }`; dropdown tự dựng chỉ mở bằng chuột.

**Tiêu chí kiểm tra:** Toàn bộ form thao tác được chỉ bằng bàn phím, focus luôn hiển thị rõ?

**Cơ sở:** [WCAG 2.1.1 · Bàn phím](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html); [WCAG 2.4.7 · Focus hiển thị](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Kiểm thử:** [Kịch bản 1 · Chỉ dùng bàn phím](#kich-ban-1)  
**Liên quan:** [A2](#a2) · [A3](#a3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="a2"></a>
#### A2 · Ngữ nghĩa HTML đúng: label, fieldset, legend

**Bắt buộc** · Tiếp cận

> Mỗi ô có `<label for>`; nhóm radio/checkbox và Ngày/Tháng/Năm dùng `fieldset` + `legend`; gợi ý và lỗi gắn bằng `aria-describedby`.

**Vì sao:** Trình đọc màn hình đọc nhãn, nhóm, gợi ý, lỗi dựa vào cấu trúc này. `div` giả làm radio, nhãn không gắn với ô khiến form "câm".

**Cách làm:**

1. Ưu tiên phần tử gốc (input, select, button) trước khi tự dựng.
2. Câu hỏi của nhóm radio là `legend`, không phải `label` riêng.
3. Trường bắt buộc: `required` hoặc `aria-required="true"`.
4. Tự dựng thì đủ role và trạng thái (`aria-checked`, `aria-expanded`).

**✅ Nên**

- `<fieldset><legend>Hình thức tham gia</legend> …radio… </fieldset>`

**❌ Không nên**

- `<div class="radio" onclick=…>` không có role, không focus được.

**Tiêu chí kiểm tra:** Mọi trường có label gắn đúng; nhóm dùng fieldset/legend; gợi ý và lỗi gắn aria-describedby?

**Cơ sở:** [WCAG 1.3.1 · Thông tin và quan hệ](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html); [WCAG 4.1.2 · Tên, vai trò, giá trị](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Kiểm thử:** [Kịch bản 1 · Chỉ dùng bàn phím](#kich-ban-1); [Kịch bản 11 · Trình đọc màn hình](#kich-ban-11)  
**Liên quan:** [L1](#l1) · [V9](#v9) · [A1](#a1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="a3"></a>
#### A3 · Tương phản đủ: chữ ≥ 4.5:1, viền ô ≥ 3:1

**Bắt buộc** · Tiếp cận

> Nhãn, gợi ý, lỗi, viền ô nhập, checkbox, radio đều phải đủ tương phản với nền — ở cả giao diện sáng và tối.

**Vì sao:** Viền ô xám nhạt khiến người dùng không thấy đâu là ô nhập, nhất là ngoài nắng hoặc trên màn hình kém.

**Cách làm:**

1. Chữ thường ≥ 4.5:1; chữ lớn (từ 24px, hoặc 18.66px đậm) ≥ 3:1.
2. Viền ô, checkbox, radio ≥ 3:1 so với nền.
3. Kiểm tra cả giao diện tối và trạng thái vô hiệu hóa.

**✅ Nên**

- Viền ô #7D8696 trên nền trắng (≈ 3,7:1).

**❌ Không nên**

- Viền ô #E5E7EB trên nền trắng (≈ 1,2:1) — gần như vô hình.

**Tiêu chí kiểm tra:** Chữ đạt tương phản ≥ 4.5:1, viền ô/điều khiển ≥ 3:1 ở cả giao diện sáng và tối?

**Cơ sở:** [WCAG 1.4.3 · Tương phản tối thiểu](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html); [WCAG 1.4.11 · Tương phản phi văn bản](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Kiểm thử:** [Kịch bản 18 · Giao diện tối, tương phản cao](#kich-ban-18)  
**Liên quan:** [A1](#a1) · [L2](#l2)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="a4"></a>
#### A4 · Không thay đổi bất ngờ khi người dùng đang nhập

**Nên** · Tiếp cận

> Chọn một mục hay gõ đủ ký tự không được tự chuyển trang, tự gửi, hay tự nhảy ô khó kiểm soát.

**Vì sao:** Thay đổi ngữ cảnh ngoài ý muốn làm người dùng mất phương hướng, nhất là người dùng trình đọc màn hình.

**Cách làm:**

1. Chọn trong dropdown không tự chuyển bước — người dùng bấm "Tiếp tục".
2. Tự nhảy ô (OTP, ngày sinh) chỉ khi đã kiểm thử và vẫn sửa được bằng Backspace.
3. Hiện câu hỏi điều kiện ngay dưới câu kích hoạt là chấp nhận được ([T1](#t1)).

**✅ Nên**

- Chọn tỉnh xong, người dùng tự bấm "Tiếp tục".

**❌ Không nên**

- Chọn hạng mục → trang tự chuyển sang bước sau.

**Tiêu chí kiểm tra:** Không có hành vi tự chuyển trang hay tự gửi khi người dùng chọn hoặc nhập?

**Cơ sở:** [WCAG 3.2.2 · Khi nhập liệu](https://www.w3.org/WAI/WCAG22/Understanding/on-input.html)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [T1](#t1) · [M3](#m3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="a5"></a>
#### A5 · Chống spam không bắt người dùng giải đố

**Bắt buộc** · Tiếp cận

> Tránh CAPTCHA chữ méo, chọn hình. Dùng biện pháp vô hình: honeypot, giới hạn tần suất, CAPTCHA không tương tác.

**Vì sao:** CAPTCHA hình/chữ là rào cản lớn với người khiếm thị, người lớn tuổi, và làm chậm tất cả mọi người. WCAG 2.2 (3.3.8) yêu cầu có phương án không dựa vào giải đố nhận thức.

**Cách làm:**

1. Honeypot (ô ẩn mà bot hay điền), kiểm tra thời gian điền, giới hạn số lần gửi theo IP/thiết bị.
2. CAPTCHA không tương tác (ví dụ Cloudflare Turnstile, reCAPTCHA v3) — chỉ thử thách khi điểm rủi ro cao.
3. OTP qua SMS/email đã là một lớp chống spam.

**✅ Nên**

- Không thấy CAPTCHA nào; bot bị chặn ở phía máy chủ.

**❌ Không nên**

- "Chọn tất cả ô có đèn giao thông" ở cuối form đăng ký.

**Tiêu chí kiểm tra:** Form chống spam bằng biện pháp vô hình, không bắt mọi người dùng giải CAPTCHA?

**Cơ sở:** [WCAG 3.3.8 · Xác thực dễ tiếp cận](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [R3](#r3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="a6"></a>
#### A6 · Trạng thái động được thông báo

**Nên** · Tiếp cận

> "Đang lưu", "Đã tải lên", "Đã thêm thành viên", số kết quả tìm kiếm: thông báo qua vùng `aria-live`.

**Vì sao:** Thay đổi chỉ hiển thị bằng hình ảnh thì người dùng trình đọc màn hình không biết (WCAG 4.1.3).

**Cách làm:**

1. Một vùng `aria-live="polite"` dùng chung cho thông báo trạng thái.
2. `role="alert"` chỉ cho lỗi quan trọng (tóm tắt lỗi, gửi thất bại).
3. Combobox: thông báo "5 kết quả" khi gõ.

**✅ Nên**

- Tải tệp xong → trình đọc màn hình đọc "Đã tải lên chan-dung.jpg".

**❌ Không nên**

- Thanh tiến trình chạy, trình đọc màn hình im lặng.

**Tiêu chí kiểm tra:** Thông báo trạng thái (lưu, tải lên, kết quả tìm kiếm) được trình đọc màn hình đọc lên?

**Cơ sở:** [WCAG 4.1.3 · Thông báo trạng thái](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Kiểm thử:** [Kịch bản 11 · Trình đọc màn hình](#kich-ban-11)  
**Liên quan:** [V9](#v9) · [U3](#u3)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="nhom-p"></a>
### P · Tin cậy & dữ liệu cá nhân

_Thu thập tối thiểu, đồng ý, tín hiệu tin cậy._

<a id="p1"></a>
#### P1 · Thu thập tối thiểu, nói rõ mục đích, xin đồng ý tách bạch

**Bắt buộc** · Tin cậy & dữ liệu cá nhân

> Chỉ thu thập dữ liệu cá nhân cần cho mục đích đã nêu; có chính sách bảo mật; dữ liệu nhạy cảm cần đồng ý riêng.

**Vì sao:** Luật Bảo vệ dữ liệu cá nhân (có hiệu lực từ 01/01/2026) yêu cầu đồng ý rõ ràng, tự nguyện, theo từng mục đích, và hạn chế thu thập dữ liệu không cần thiết. Thu thập thừa vừa làm form dài vừa tăng rủi ro pháp lý khi rò rỉ. _Nội dung mang tính định hướng UX, không thay thế tư vấn pháp lý._

**Cách làm:**

1. Rà từng trường với [F2](#f2); mỗi dữ liệu nhạy cảm (sức khỏe, CCCD…) phải có mục đích rõ.
2. Đặt liên kết "Chính sách bảo mật" gần nút gửi và ô đồng ý.
3. Nói rõ thời gian lưu trữ và cách yêu cầu xóa dữ liệu.
4. Tham vấn bộ phận pháp chế cho câu chữ đồng ý.

**✅ Nên**

- "Dữ liệu chỉ dùng để tổ chức cuộc thi và được xóa sau 12 tháng. Chính sách bảo mật"

**❌ Không nên**

- Hỏi nhóm máu, tôn giáo trong form đăng ký cuộc thi viết.

**Tiêu chí kiểm tra:** Dữ liệu cá nhân được thu thập tối thiểu, có mục đích rõ, và đồng ý tách bạch theo mục đích?

**Cơ sở:** Watkinson #9 · Quyền kiểm soát  
**Nguồn:** [Caroline Jarrett · The question protocol](https://www.uxmatters.com/mt/archives/2010/06/the-question-protocol-how-to-make-sure-every-form-field-is-necessary.php)  
**Liên quan:** [F2](#f2) · [R2](#r2) · [C5](#c5)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="p2"></a>
#### P2 · Tín hiệu tin cậy ngay trong form

**Nên** · Tin cậy & dữ liệu cá nhân

> Tên đơn vị tổ chức, kênh hỗ trợ, chính sách bảo mật hiển thị trong form; chạy trên tên miền chính thức, HTTPS.

**Vì sao:** Lừa đảo giả mạo cuộc thi, giả mạo thông báo trúng giải rất phổ biến. Người dùng cần chắc mình đang ở trang chính chủ trước khi nhập CCCD, số điện thoại.

**Cách làm:**

1. Đầu form: tên cuộc thi, đơn vị tổ chức.
2. Cuối form hoặc cột bên: "Cần hỗ trợ? Email … · Hotline … (giờ làm việc)" dạng chữ có thể sao chép.
3. Không hỏi thông tin tài chính (số thẻ, mật khẩu ngân hàng) trong form đăng ký.
4. Cuộc thi lớn: cảnh báo giả mạo, nêu kênh liên hệ chính thức duy nhất.

**✅ Nên**

- "Cần hỗ trợ? hotro@example.com · 1900 xxxx (8:00–17:00, thứ Hai – thứ Sáu)"

**❌ Không nên**

- Không có thông tin liên hệ; form nằm trên tên miền lạ.

**Tiêu chí kiểm tra:** Form hiển thị đơn vị tổ chức, kênh hỗ trợ, chính sách bảo mật, và chạy trên tên miền chính thức?

**Cơ sở:** Watkinson #6 · Không gây stress  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [P1](#p1) · [K1](#k1)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="p3"></a>
#### P3 · Che bớt dữ liệu nhạy cảm khi hiển thị lại

**Nên** · Tin cậy & dữ liệu cá nhân

> Số CCCD, số điện thoại trên trang xác nhận, email, danh sách công khai hiển thị dạng che bớt.

**Vì sao:** Trang xác nhận và email có thể bị người khác nhìn thấy hoặc chuyển tiếp. Danh sách thí sinh công bố không được lộ thông tin liên hệ.

**Cách làm:**

1. CCCD: chỉ hiện 4 số cuối — "\*\*\*\*\*\*\*\*4567".
2. Số điện thoại: "0912 \*\*\* 678".
3. Danh sách công khai: họ tên + đơn vị; không hiện ngày sinh đầy đủ, SĐT, email.

**✅ Nên**

- "Số căn cước: \*\*\*\*\*\*\*\*4567"

**❌ Không nên**

- Email xác nhận chứa đầy đủ số CCCD, ngày sinh, số điện thoại.

**Tiêu chí kiểm tra:** Dữ liệu nhạy cảm được che bớt khi hiển thị lại trên xác nhận, email, danh sách công khai?

**Cơ sở:** Watkinson #6 · Không gây stress  
**Nguồn:** [GOV.UK Design System](https://design-system.service.gov.uk/)  
**Liên quan:** [R1](#r1) · [K2](#k2)

[↑ Về mục lục nhóm](#nguyen-tac-chi-tiet)

<a id="checklist"></a>
## 6. Checklist review

Chép vào PRD, ticket hoặc mô tả pull request. Đánh dấu `[x]` khi đạt; mục không áp dụng thì ghi "(không áp dụng)".

<a id="checklist-bat-buoc"></a>
### Checklist nhanh: 40 nguyên tắc Bắt buộc

- [ ] **F1** Người dùng biết trước thời gian, tài liệu cần chuẩn bị và hạn chót trước khi bắt đầu điền?
- [ ] **F2** Mọi trường đều có mục đích sử dụng rõ ràng và cần thiết ngay tại thời điểm đăng ký?
- [ ] **F5** Form có bố cục một cột (trừ các ô ngắn cùng một thông tin như Ngày/Tháng/Năm)?
- [ ] **L1** Mọi trường đều có nhãn hiển thị phía trên ô, và bấm vào nhãn sẽ đưa con trỏ vào ô?
- [ ] **L2** Không có trường nào dùng placeholder làm nhãn hoặc giấu hướng dẫn quan trọng trong placeholder?
- [ ] **L3** Trường bắt buộc và không bắt buộc được đánh dấu rõ, có chú thích ý nghĩa dấu *?
- [ ] **I1** Mỗi trường mở đúng loại bàn phím trên điện thoại (email, số, điện thoại) và không dùng type="number" cho mã số?
- [ ] **I2** Các trường thông tin cá nhân có autocomplete đúng chuẩn và autofill hoạt động khi thử thật?
- [ ] **I3** Hệ thống tự chuẩn hóa khoảng trắng, dấu chấm, +84… thay vì báo lỗi định dạng?
- [ ] **I6** Ô họ tên chấp nhận đầy đủ tên tiếng Việt có dấu, tên dài, tên có dấu nháy, và không tách Họ/Tên?
- [ ] **I9** Mọi ô đều cho dán, và không có ô "nhập lại" email/mật khẩu bắt buộc?
- [ ] **I10** Ô mật khẩu (nếu có) có nút hiện/ẩn, yêu cầu hiển thị trước, cho dán và hỗ trợ trình quản lý mật khẩu?
- [ ] **C1** Câu hỏi có ít lựa chọn (≤ 6) hiển thị bằng radio/checkbox thay vì dropdown?
- [ ] **C4** Radio, checkbox, toggle được dùng đúng ngữ nghĩa?
- [ ] **V1** Lỗi chỉ xuất hiện khi rời ô hoặc khi gửi, và biến mất ngay khi người dùng sửa đúng?
- [ ] **V2** Lỗi hiển thị cạnh trường, có chữ và biểu tượng, không chỉ dựa vào màu?
- [ ] **V3** Mọi thông báo lỗi nêu cụ thể vấn đề và cách sửa, không đổ lỗi, không có mã kỹ thuật?
- [ ] **V4** Khi gửi còn lỗi, có khối tóm tắt lỗi nhận focus, liên kết tới từng ô lỗi?
- [ ] **V5** Dữ liệu được giữ nguyên khi có lỗi, tải lại trang, mất mạng hoặc quay lại bước trước?
- [ ] **V8** Lỗi từ máy chủ được hiển thị cụ thể, đúng chỗ, và luôn có hướng xử lý tiếp theo?
- [ ] **V9** Lỗi được gắn với ô (aria-describedby, aria-invalid) và được trình đọc màn hình đọc khi xuất hiện?
- [ ] **B1** Nhãn nút là động từ cụ thể mô tả kết quả, không chung chung?
- [ ] **B2** Mỗi màn hình chỉ có một nút chính nổi bật và không có nút xóa/reset form?
- [ ] **B4** Nút gửi có trạng thái đang xử lý và không thể tạo hồ sơ trùng khi bấm nhiều lần?
- [ ] **B6** Mọi mục bấm được có vùng chạm ≥ 44 × 44px và cách nhau ≥ 8px?
- [ ] **U1** Yêu cầu định dạng, dung lượng, số lượng và quy cách tệp hiển thị trước khi chọn tệp?
- [ ] **U2** Tệp được kiểm tra ngay khi chọn và lỗi nêu tên tệp, lý do, cách khắc phục?
- [ ] **D1** Form dài tự lưu nháp, hiển thị trạng thái lưu, và khôi phục khi quay lại?
- [ ] **D3** Không có hết phiên âm thầm: có cảnh báo, cho gia hạn, giữ dữ liệu khi hết phiên?
- [ ] **D5** Hạn chót ghi rõ giờ, ngày, múi giờ, và có nhắc khi sắp hết hạn?
- [ ] **R2** Ô đồng ý không chọn sẵn, tách theo mục đích, có liên kết đọc đầy đủ mà không mất dữ liệu?
- [ ] **K1** Trang xác nhận có thông điệp thành công, mã hồ sơ, bước tiếp theo và kênh hỗ trợ?
- [ ] **K2** Email/SMS xác nhận được gửi ngay với mã hồ sơ, tóm tắt và liên kết xem hồ sơ?
- [ ] **T4** Các trạng thái chưa mở, đang mở, sắp đóng, đã đóng, hết suất đều có màn hình và thông điệp rõ?
- [ ] **M1** Ô nhập có cỡ chữ ≥ 16px, cao ≥ 44px, và không chặn người dùng phóng to?
- [ ] **A1** Toàn bộ form thao tác được chỉ bằng bàn phím, focus luôn hiển thị rõ?
- [ ] **A2** Mọi trường có label gắn đúng; nhóm dùng fieldset/legend; gợi ý và lỗi gắn aria-describedby?
- [ ] **A3** Chữ đạt tương phản ≥ 4.5:1, viền ô/điều khiển ≥ 3:1 ở cả giao diện sáng và tối?
- [ ] **A5** Form chống spam bằng biện pháp vô hình, không bắt mọi người dùng giải CAPTCHA?
- [ ] **P1** Dữ liệu cá nhân được thu thập tối thiểu, có mục đích rõ, và đồng ý tách bạch theo mục đích?

<a id="checklist-day-du"></a>
### Checklist đầy đủ: 79 nguyên tắc

**F · Cấu trúc & luồng**

- [ ] **F1** (Bắt buộc) Người dùng biết trước thời gian, tài liệu cần chuẩn bị và hạn chót trước khi bắt đầu điền?
- [ ] **F2** (Bắt buộc) Mọi trường đều có mục đích sử dụng rõ ràng và cần thiết ngay tại thời điểm đăng ký?
- [ ] **F3** (Nên) Mô hình một trang hay nhiều bước phù hợp với số lượng và tính chất thông tin cần hỏi?
- [ ] **F4** (Nên) Các trường liên quan được nhóm dưới tiêu đề rõ ràng và sắp xếp theo thứ tự tự nhiên?
- [ ] **F5** (Bắt buộc) Form có bố cục một cột (trừ các ô ngắn cùng một thông tin như Ngày/Tháng/Năm)?
- [ ] **F6** (Nên) Người dùng luôn biết mình ở bước nào, còn bao nhiêu bước, và quay lại được mà không mất dữ liệu?
- [ ] **F7** (Cân nhắc) Người dùng bắt đầu điền được mà không bị chặn bởi bước tạo tài khoản bắt buộc?

**L · Nhãn & câu chữ**

- [ ] **L1** (Bắt buộc) Mọi trường đều có nhãn hiển thị phía trên ô, và bấm vào nhãn sẽ đưa con trỏ vào ô?
- [ ] **L2** (Bắt buộc) Không có trường nào dùng placeholder làm nhãn hoặc giấu hướng dẫn quan trọng trong placeholder?
- [ ] **L3** (Bắt buộc) Trường bắt buộc và không bắt buộc được đánh dấu rõ, có chú thích ý nghĩa dấu *?
- [ ] **L4** (Nên) Yêu cầu định dạng và ví dụ hiển thị sẵn (không ẩn trong tooltip) cho các trường cần?
- [ ] **L5** (Nên) Nhãn ngắn gọn, không viết tắt, không dùng thuật ngữ nội bộ?
- [ ] **L6** (Cân nhắc) Các trường nhạy cảm có giải thích ngắn về lý do thu thập?
- [ ] **L7** (Nên) Câu chữ nhất quán về xưng hô, viết hoa kiểu câu, định dạng ngày giờ Việt Nam?

**I · Ô nhập liệu**

- [ ] **I1** (Bắt buộc) Mỗi trường mở đúng loại bàn phím trên điện thoại (email, số, điện thoại) và không dùng type="number" cho mã số?
- [ ] **I2** (Bắt buộc) Các trường thông tin cá nhân có autocomplete đúng chuẩn và autofill hoạt động khi thử thật?
- [ ] **I3** (Bắt buộc) Hệ thống tự chuẩn hóa khoảng trắng, dấu chấm, +84… thay vì báo lỗi định dạng?
- [ ] **I4** (Nên) Định dạng hiển thị không cản trở việc dán, sửa giữa chuỗi và vị trí con trỏ?
- [ ] **I5** (Nên) Độ rộng các ô tương ứng với độ dài dữ liệu cần nhập?
- [ ] **I6** (Bắt buộc) Ô họ tên chấp nhận đầy đủ tên tiếng Việt có dấu, tên dài, tên có dấu nháy, và không tách Họ/Tên?
- [ ] **I7** (Nên) Ngày sinh nhập được bằng bàn phím theo thứ tự ngày/tháng/năm, không phải cuộn lịch qua nhiều năm?
- [ ] **I8** (Nên) Ô văn bản dài có giới hạn rõ, có bộ đếm, và không cắt cụt nội dung khi dán?
- [ ] **I9** (Bắt buộc) Mọi ô đều cho dán, và không có ô "nhập lại" email/mật khẩu bắt buộc?
- [ ] **I10** (Bắt buộc) Ô mật khẩu (nếu có) có nút hiện/ẩn, yêu cầu hiển thị trước, cho dán và hỗ trợ trình quản lý mật khẩu?

**C · Lựa chọn**

- [ ] **C1** (Bắt buộc) Câu hỏi có ít lựa chọn (≤ 6) hiển thị bằng radio/checkbox thay vì dropdown?
- [ ] **C2** (Nên) Danh sách dài cho gõ để tìm, tìm được khi gõ không dấu/viết tắt, và dùng được bằng bàn phím?
- [ ] **C3** (Nên) Địa chỉ dùng danh mục 34 tỉnh/thành và cấp Phường/Xã mới, không còn ô Quận/Huyện?
- [ ] **C4** (Bắt buộc) Radio, checkbox, toggle được dùng đúng ngữ nghĩa?
- [ ] **C5** (Nên) Không có lựa chọn cá nhân hay ô đồng ý nào được chọn sẵn; mặc định đều an toàn và đúng với đa số?
- [ ] **C6** (Nên) Mọi lựa chọn có vùng bấm đủ lớn; lựa chọn quan trọng có mô tả điều kiện ngay tại chỗ?

**V · Kiểm tra & báo lỗi**

- [ ] **V1** (Bắt buộc) Lỗi chỉ xuất hiện khi rời ô hoặc khi gửi, và biến mất ngay khi người dùng sửa đúng?
- [ ] **V2** (Bắt buộc) Lỗi hiển thị cạnh trường, có chữ và biểu tượng, không chỉ dựa vào màu?
- [ ] **V3** (Bắt buộc) Mọi thông báo lỗi nêu cụ thể vấn đề và cách sửa, không đổ lỗi, không có mã kỹ thuật?
- [ ] **V4** (Bắt buộc) Khi gửi còn lỗi, có khối tóm tắt lỗi nhận focus, liên kết tới từng ô lỗi?
- [ ] **V5** (Bắt buộc) Dữ liệu được giữ nguyên khi có lỗi, tải lại trang, mất mạng hoặc quay lại bước trước?
- [ ] **V6** (Nên) Nút gửi/tiếp tục không bị vô hiệu hóa chỉ vì form chưa hợp lệ?
- [ ] **V7** (Cân nhắc) Phản hồi "hợp lệ" chỉ dùng cho trường dễ sai hoặc cần xác minh, không gây nhiễu?
- [ ] **V8** (Bắt buộc) Lỗi từ máy chủ được hiển thị cụ thể, đúng chỗ, và luôn có hướng xử lý tiếp theo?
- [ ] **V9** (Bắt buộc) Lỗi được gắn với ô (aria-describedby, aria-invalid) và được trình đọc màn hình đọc khi xuất hiện?

**B · Nút & hành động**

- [ ] **B1** (Bắt buộc) Nhãn nút là động từ cụ thể mô tả kết quả, không chung chung?
- [ ] **B2** (Bắt buộc) Mỗi màn hình chỉ có một nút chính nổi bật và không có nút xóa/reset form?
- [ ] **B3** (Nên) Nút chính nằm ngay sau trường cuối, dễ chạm trên điện thoại, không che nội dung?
- [ ] **B4** (Bắt buộc) Nút gửi có trạng thái đang xử lý và không thể tạo hồ sơ trùng khi bấm nhiều lần?
- [ ] **B5** (Nên) Hộp thoại xác nhận chỉ dùng cho hành động không thể hoàn tác; các hành động khác cho phép hoàn tác?
- [ ] **B6** (Bắt buộc) Mọi mục bấm được có vùng chạm ≥ 44 × 44px và cách nhau ≥ 8px?

**U · Tải tệp lên**

- [ ] **U1** (Bắt buộc) Yêu cầu định dạng, dung lượng, số lượng và quy cách tệp hiển thị trước khi chọn tệp?
- [ ] **U2** (Bắt buộc) Tệp được kiểm tra ngay khi chọn và lỗi nêu tên tệp, lý do, cách khắc phục?
- [ ] **U3** (Nên) Tải tệp có tiến trình, cho hủy/thử lại và không chặn điền các phần khác?
- [ ] **U4** (Nên) Sau khi tải lên, người dùng xem lại được tệp và thay/xóa dễ dàng?
- [ ] **U5** (Cân nhắc) Hệ thống hỗ trợ nén/cắt ảnh, chụp trực tiếp, thay vì chỉ từ chối tệp chưa đạt?

**D · Lưu nháp & thời hạn**

- [ ] **D1** (Bắt buộc) Form dài tự lưu nháp, hiển thị trạng thái lưu, và khôi phục khi quay lại?
- [ ] **D2** (Nên) Người dùng lưu và tiếp tục được trên thiết bị khác, biết bản nháp được giữ bao lâu?
- [ ] **D3** (Bắt buộc) Không có hết phiên âm thầm: có cảnh báo, cho gia hạn, giữ dữ liệu khi hết phiên?
- [ ] **D4** (Nên) Có cảnh báo khi rời trang với dữ liệu chưa lưu, và không cảnh báo thừa?
- [ ] **D5** (Bắt buộc) Hạn chót ghi rõ giờ, ngày, múi giờ, và có nhắc khi sắp hết hạn?

**R · Xem lại & gửi**

- [ ] **R1** (Nên) Có trang xem lại với "Sửa" về đúng trường, và quay lại trang xem lại sau khi sửa?
- [ ] **R2** (Bắt buộc) Ô đồng ý không chọn sẵn, tách theo mục đích, có liên kết đọc đầy đủ mà không mất dữ liệu?
- [ ] **R3** (Nên) OTP (nếu có) tự điền được, cho dán, có đếm ngược gửi lại, và cho sửa số điện thoại?

**K · Sau khi gửi**

- [ ] **K1** (Bắt buộc) Trang xác nhận có thông điệp thành công, mã hồ sơ, bước tiếp theo và kênh hỗ trợ?
- [ ] **K2** (Bắt buộc) Email/SMS xác nhận được gửi ngay với mã hồ sơ, tóm tắt và liên kết xem hồ sơ?
- [ ] **K3** (Nên) Người dùng xem được trạng thái hồ sơ và sửa/bổ sung trực tuyến trong thời hạn?

**T · Tình huống đặc thù**

- [ ] **T1** (Nên) Câu hỏi điều kiện hiện ngay dưới câu kích hoạt, và dữ liệu phần bị ẩn không được gửi đi?
- [ ] **T2** (Nên) Form đội nêu rõ số lượng thành viên, thêm/xóa dễ, và có hoàn tác khi xóa?
- [ ] **T3** (Nên) Phần người giám hộ chỉ xuất hiện khi thí sinh chưa đủ tuổi theo ngày sinh, kèm lý do?
- [ ] **T4** (Bắt buộc) Các trạng thái chưa mở, đang mở, sắp đóng, đã đóng, hết suất đều có màn hình và thông điệp rõ?
- [ ] **T5** (Nên) Thông tin đã cung cấp (tài khoản, bước trước) được điền sẵn, không bắt nhập lại?

**M · Trên điện thoại**

- [ ] **M1** (Bắt buộc) Ô nhập có cỡ chữ ≥ 16px, cao ≥ 44px, và không chặn người dùng phóng to?
- [ ] **M2** (Nên) Khi bàn phím mở, ô đang nhập và lỗi của nó luôn nhìn thấy được?
- [ ] **M3** (Nên) Phím Enter/Next trên bàn phím chuyển ô hoặc hoàn tất bước đúng như mong đợi?
- [ ] **M4** (Nên) Form tải nhanh trên mạng di động và hiển thị tốt ở màn hình 360px?

**A · Tiếp cận**

- [ ] **A1** (Bắt buộc) Toàn bộ form thao tác được chỉ bằng bàn phím, focus luôn hiển thị rõ?
- [ ] **A2** (Bắt buộc) Mọi trường có label gắn đúng; nhóm dùng fieldset/legend; gợi ý và lỗi gắn aria-describedby?
- [ ] **A3** (Bắt buộc) Chữ đạt tương phản ≥ 4.5:1, viền ô/điều khiển ≥ 3:1 ở cả giao diện sáng và tối?
- [ ] **A4** (Nên) Không có hành vi tự chuyển trang hay tự gửi khi người dùng chọn hoặc nhập?
- [ ] **A5** (Bắt buộc) Form chống spam bằng biện pháp vô hình, không bắt mọi người dùng giải CAPTCHA?
- [ ] **A6** (Nên) Thông báo trạng thái (lưu, tải lên, kết quả tìm kiếm) được trình đọc màn hình đọc lên?

**P · Tin cậy & dữ liệu cá nhân**

- [ ] **P1** (Bắt buộc) Dữ liệu cá nhân được thu thập tối thiểu, có mục đích rõ, và đồng ý tách bạch theo mục đích?
- [ ] **P2** (Nên) Form hiển thị đơn vị tổ chức, kênh hỗ trợ, chính sách bảo mật, và chạy trên tên miền chính thức?
- [ ] **P3** (Nên) Dữ liệu nhạy cảm được che bớt khi hiển thị lại trên xác nhận, email, danh sách công khai?

<a id="kiem-thu"></a>
## 7. Kịch bản kiểm thử

Chạy trên bản dựng thật, không chỉ trên thiết kế. Mỗi kịch bản ghi rõ nguyên tắc được kiểm.

<a id="kich-ban-1"></a>
### Kịch bản 1 · Chỉ dùng bàn phím

- **Cách làm:** Rút chuột ra. Tab qua toàn bộ form, chọn radio bằng phím mũi tên, mở danh sách bằng phím, gửi bằng Enter.
- **Kết quả mong đợi:** Focus luôn nhìn thấy, thứ tự hợp lý, không bị kẹt ở điều khiển nào.
- **Nguyên tắc:** [A1](#a1), [A2](#a2)

<a id="kich-ban-2"></a>
### Kịch bản 2 · Bấm gửi khi form trống

- **Cách làm:** Mở form, không nhập gì, bấm Tiếp tục/Gửi.
- **Kết quả mong đợi:** Có tóm tắt lỗi nhận focus; mỗi liên kết đưa tới đúng ô; lỗi tại từng trường nói rõ cách sửa.
- **Nguyên tắc:** [V4](#v4), [V3](#v3)

<a id="kich-ban-3"></a>
### Kịch bản 3 · Dán dữ liệu "bẩn"

- **Cách làm:** Dán SĐT "+84 912.345.678", email có khoảng trắng ở cuối, CCCD "001 203 004 567".
- **Kết quả mong đợi:** Được chấp nhận và tự chuẩn hóa, không báo lỗi định dạng.
- **Nguyên tắc:** [I3](#i3), [I9](#i9)

<a id="kich-ban-4"></a>
### Kịch bản 4 · Tên dài, có dấu, có dấu nháy

- **Cách làm:** Nhập "Tôn Nữ Hoàng Bảo Ngọc Phương Thảo", "H'Lan Niê", "Nguyễn  Văn   An" (thừa khoảng trắng).
- **Kết quả mong đợi:** Chấp nhận tất cả; khoảng trắng thừa được gộp; hiển thị đúng ở trang xem lại và email.
- **Nguyên tắc:** [I6](#i6)

<a id="kich-ban-5"></a>
### Kịch bản 5 · Tải lại trang giữa chừng

- **Cách làm:** Điền tới bước 3, nhấn F5 hoặc vuốt tải lại.
- **Kết quả mong đợi:** Dữ liệu còn nguyên hoặc được hỏi khôi phục bản nháp.
- **Nguyên tắc:** [D1](#d1), [V5](#v5)

<a id="kich-ban-6"></a>
### Kịch bản 6 · Mất mạng khi bấm gửi

- **Cách làm:** Bật chế độ máy bay (hoặc DevTools → Offline) rồi bấm Gửi.
- **Kết quả mong đợi:** Thông báo rõ chưa gửi được, dữ liệu vẫn còn, có nút Thử lại.
- **Nguyên tắc:** [V8](#v8), [V5](#v5)

<a id="kich-ban-7"></a>
### Kịch bản 7 · Bấm gửi liên tục

- **Cách làm:** Bấm nút Gửi 4–5 lần thật nhanh.
- **Kết quả mong đợi:** Nút chuyển "Đang gửi…" ngay; chỉ một hồ sơ, một email xác nhận được tạo.
- **Nguyên tắc:** [B4](#b4)

<a id="kich-ban-8"></a>
### Kịch bản 8 · Tệp sai và tệp quá lớn

- **Cách làm:** Chọn tệp .docx thay cho PDF; ảnh 12 MB; tệp 0 byte; ảnh HEIC từ iPhone.
- **Kết quả mong đợi:** Lỗi hiện ngay khi chọn, nêu tên tệp, lý do, cách khắc phục; ảnh lớn được tự tối ưu nếu có thể.
- **Nguyên tắc:** [U1](#u1), [U2](#u2), [U5](#u5)

<a id="kich-ban-9"></a>
### Kịch bản 9 · Nút Back của trình duyệt

- **Cách làm:** Ở bước 3, bấm Back của trình duyệt, rồi Forward.
- **Kết quả mong đợi:** Về bước 2 với dữ liệu còn nguyên; không thoát khỏi form.
- **Nguyên tắc:** [F6](#f6), [V5](#v5)

<a id="kich-ban-10"></a>
### Kịch bản 10 · Màn hình 360px và phóng to 200%

- **Cách làm:** Thu cửa sổ còn 360px; hoặc phóng to trình duyệt 200%.
- **Kết quả mong đợi:** Không cắt chữ, không cuộn ngang, nút vẫn bấm được.
- **Nguyên tắc:** [M4](#m4), [F5](#f5)

<a id="kich-ban-11"></a>
### Kịch bản 11 · Trình đọc màn hình

- **Cách làm:** Bật VoiceOver (iOS/macOS) hoặc TalkBack (Android). Đi qua từng trường, gây một lỗi.
- **Kết quả mong đợi:** Đọc đúng nhãn, "bắt buộc", gợi ý; lỗi được đọc khi xuất hiện; tóm tắt lỗi được thông báo.
- **Nguyên tắc:** [V9](#v9), [A2](#a2), [A6](#a6)

<a id="kich-ban-12"></a>
### Kịch bản 12 · Tự động điền của trình duyệt

- **Cách làm:** Dùng autofill của Chrome/Safari với hồ sơ đã lưu.
- **Kết quả mong đợi:** Họ tên, email, SĐT, địa chỉ được điền đúng ô.
- **Nguyên tắc:** [I2](#i2)

<a id="kich-ban-13"></a>
### Kịch bản 13 · Trên điện thoại thật

- **Cách làm:** Mở trên iPhone và một máy Android tầm trung, dùng 4G.
- **Kết quả mong đợi:** Bàn phím đúng loại; ô không bị che; không tự phóng to; tải nhanh.
- **Nguyên tắc:** [I1](#i1), [M1](#m1), [M2](#m2), [M4](#m4)

<a id="kich-ban-14"></a>
### Kịch bản 14 · Gõ nhầm tên miền email

- **Cách làm:** Nhập "minh.anh@gmial.com", "lan@yahoo.con".
- **Kết quả mong đợi:** Có gợi ý sửa "gmail.com", "yahoo.com", bấm một lần là sửa.
- **Nguyên tắc:** [I9](#i9)

<a id="kich-ban-15"></a>
### Kịch bản 15 · Để form mở thật lâu

- **Cách làm:** Điền một nửa, để yên 30 phút, rồi gửi.
- **Kết quả mong đợi:** Có cảnh báo trước khi hết phiên; không mất dữ liệu.
- **Nguyên tắc:** [D3](#d3)

<a id="kich-ban-16"></a>
### Kịch bản 16 · Đăng ký lần hai cùng email

- **Cách làm:** Gửi hồ sơ, rồi đăng ký lại với cùng email/SĐT.
- **Kết quả mong đợi:** Báo đã đăng ký ngay khi rời ô email, có đường dẫn đăng nhập/xem hồ sơ.
- **Nguyên tắc:** [V8](#v8), [V1](#v1)

<a id="kich-ban-17"></a>
### Kịch bản 17 · Tìm tỉnh không dấu, tên cũ

- **Cách làm:** Gõ "da nang", "hcm", "binh duong" vào ô Tỉnh/Thành phố.
- **Kết quả mong đợi:** Ra đúng kết quả; tên tỉnh cũ gợi ý tỉnh/thành mới.
- **Nguyên tắc:** [C2](#c2), [C3](#c3)

<a id="kich-ban-18"></a>
### Kịch bản 18 · Giao diện tối, tương phản cao

- **Cách làm:** Bật giao diện tối của hệ điều hành; bật chế độ tương phản cao (Windows).
- **Kết quả mong đợi:** Viền ô, lỗi, focus vẫn nhìn rõ; không có chữ "biến mất".
- **Nguyên tắc:** [A3](#a3)

<a id="cau-chu"></a>
## 8. Câu chữ mẫu

<a id="giong-van"></a>
### Giọng văn

| Nguyên tắc | ❌ Không nên | ✅ Nên |
| --- | --- | --- |
| **Hướng dẫn, đừng ra lệnh như máy** | Trường SĐT là bắt buộc. | Nhập số điện thoại |
| **Nói cách sửa, đừng chỉ nói là sai** | Số điện thoại không hợp lệ. | Số điện thoại cần có 10 chữ số, ví dụ 0912 345 678 |
| **Không đổ lỗi cho người dùng** | Bạn đã nhập sai ngày sinh! | Ngày sinh phải là một ngày có thật |
| **Không mã lỗi, không thuật ngữ kỹ thuật** | Error 413: Payload too large | Tệp có dung lượng 24 MB, vượt giới hạn 20 MB |
| **Không IN HOA, không dấu chấm than** | VUI LÒNG ĐIỀN ĐẦY ĐỦ THÔNG TIN!!! | Cần sửa 3 mục trước khi tiếp tục |
| **Xin lỗi khi lỗi do hệ thống, ngắn gọn** | Rất xin lỗi quý khách vì sự bất tiện này, chúng tôi đang… | Xin lỗi, hệ thống đang gặp sự cố. Dữ liệu của bạn vẫn được giữ |

<a id="cau-chu-empty"></a>
### Lỗi: bỏ trống

Động từ đi theo loại trường: Nhập (ô chữ), Chọn (lựa chọn), Tải lên (tệp), Đồng ý (cam kết).

| Mẫu câu | Ví dụ / ngữ cảnh |
| --- | --- |
| Nhập {tên trường} | Nhập họ và tên |
| Chọn {tên trường} | Chọn tỉnh/thành phố |
| Chọn {tên trường} | Chọn hình thức tham gia · _Nhóm radio_ |
| Tải lên {tên tệp} | Tải lên bài dự thi (PDF) |
| Nhập ngày sinh | _Cả ba ô ngày, tháng, năm đều trống_ |
| Bạn cần đồng ý với {tên văn bản} để gửi hồ sơ | Bạn cần đồng ý với Thể lệ cuộc thi để gửi hồ sơ |

<a id="cau-chu-format"></a>
### Lỗi: sai định dạng

Nói định dạng đúng và cho một ví dụ.

| Mẫu câu | Ví dụ / ngữ cảnh |
| --- | --- |
| Nhập email đúng định dạng, ví dụ: ten@gmail.com | — |
| Email cần có ký tự @, ví dụ: ten@gmail.com | _Thiếu @_ |
| Số điện thoại cần có 10 chữ số. Bạn đã nhập {n} chữ số | Số điện thoại cần có 10 chữ số. Bạn đã nhập 9 chữ số |
| Số điện thoại di động cần bắt đầu bằng 03, 05, 07, 08 hoặc 09 | — |
| Số căn cước gồm 12 chữ số. Bạn đã nhập {n} chữ số | Số căn cước gồm 12 chữ số. Bạn đã nhập 11 chữ số |
| Ngày sinh phải là một ngày có thật | _Ví dụ 30/02_ |
| Ngày sinh cần có {phần còn thiếu} | Ngày sinh cần có năm |
| Năm sinh cần có 4 chữ số, ví dụ 2008 | — |
| Nhập đường dẫn đầy đủ, ví dụ: behance.net/ten-ban | — |
| Họ và tên không chứa chữ số | — |

<a id="cau-chu-range"></a>
### Lỗi: giới hạn & phạm vi

Nêu giới hạn và giá trị hiện tại để người dùng biết cần sửa bao nhiêu.

| Mẫu câu | Ví dụ / ngữ cảnh |
| --- | --- |
| {Tên trường} tối đa {n} ký tự. Hiện có {m} ký tự | Tên ý tưởng tối đa 120 ký tự. Hiện có 134 ký tự |
| {Tên trường} tối đa {n} từ. Hiện có {m} từ | Mô tả tối đa 300 từ. Hiện có 327 từ |
| {Tên trường} cần ít nhất {n} từ | Mô tả cần ít nhất 30 từ |
| Thí sinh cần sinh trong khoảng {từ ngày} – {đến ngày} (từ {min} đến {max} tuổi tính đến {ngày tham chiếu}) | Thí sinh cần sinh trong khoảng 01/12/1995 – 30/11/2011 (từ 15 đến 30 tuổi tính đến 30/11/2026) |
| Ngày sinh phải trước hôm nay | — |
| Chọn tối đa {n} {mục} | Chọn tối đa 3 lĩnh vực |
| Đội cần ít nhất {n} thành viên. Hiện có {m} | Đội cần ít nhất 2 thành viên. Hiện có 1 |

<a id="cau-chu-file"></a>
### Lỗi: tệp

Luôn nêu tên tệp người dùng đã chọn, để họ biết tệp nào có vấn đề.

| Mẫu câu | Ví dụ / ngữ cảnh |
| --- | --- |
| Tệp "{tên tệp}" không đúng định dạng. Hãy tải lên tệp {định dạng} | Tệp "bai-du-thi.docx" không đúng định dạng. Hãy tải lên tệp PDF |
| Tệp "{tên tệp}" có dung lượng {x} MB, vượt giới hạn {y} MB | Tệp "chan-dung.jpg" có dung lượng 8,4 MB, vượt giới hạn 5 MB |
| Tệp "{tên tệp}" trống (0 byte). Hãy kiểm tra tệp mở được trên máy rồi tải lên lại | — |
| Ảnh "{tên tệp}" ở định dạng HEIC. Hãy chọn ảnh JPG/PNG, hoặc trên iPhone vào Cài đặt > Camera > Định dạng > Tương thích nhất | — |
| Bạn chỉ có thể tải lên tối đa {n} tệp | — |
| Tải lên bị gián đoạn do mất kết nối. Thử lại | _Kèm nút "Thử lại"_ |
| Đợi tệp tải lên xong rồi tiếp tục | _Bấm Tiếp tục khi tệp đang tải_ |

<a id="cau-chu-server"></a>
### Lỗi: hệ thống & máy chủ

Nói rõ dữ liệu có còn không, hồ sơ đã gửi hay chưa, và bước tiếp theo.

| Mẫu câu | Ví dụ / ngữ cảnh |
| --- | --- |
| Email này đã được dùng để đăng ký. Đăng nhập để xem hồ sơ, hoặc dùng email khác | — |
| Hạng mục {tên} vừa đủ số lượng. Bạn có thể chọn hạng mục khác, dữ liệu đã nhập vẫn được giữ | — |
| Chưa gửi được hồ sơ do mất kết nối. Dữ liệu của bạn vẫn được giữ. Thử lại | — |
| Xin lỗi, hệ thống đang gặp sự cố nên hồ sơ chưa được gửi. Dữ liệu vẫn được giữ. Thử lại sau ít phút hoặc liên hệ {hotline} | — |
| Phiên làm việc sẽ hết hạn sau 2 phút. Bấm Tiếp tục làm việc để không mất dữ liệu | — |
| Mã xác thực chưa đúng. Kiểm tra lại tin nhắn hoặc gửi lại mã | — |
| Mã đã hết hạn. Gửi lại mã mới | — |

<a id="cau-chu-summary"></a>
### Tóm tắt lỗi

Tiêu đề nói số lượng; danh sách dùng lại đúng câu lỗi tại từng trường.

| Mẫu câu | Ví dụ / ngữ cảnh |
| --- | --- |
| Cần sửa {n} mục trước khi tiếp tục | Cần sửa 3 mục trước khi tiếp tục |
| Cần sửa {n} mục trước khi gửi hồ sơ | — |

<a id="cau-chu-hint"></a>
### Gợi ý dưới nhãn

Ngắn, cụ thể, ưu tiên ví dụ. Hiển thị sẵn, không giấu trong tooltip.

| Mẫu câu | Ví dụ / ngữ cảnh |
| --- | --- |
| Ví dụ: 0912 345 678 | _Số điện thoại_ |
| Dùng email bạn thường xuyên kiểm tra. Xác nhận và kết quả sẽ được gửi qua email này | _Email_ |
| Ví dụ: 27 03 2008 | _Ngày sinh_ |
| 12 chữ số in trên thẻ căn cước | _Số căn cước_ |
| JPG hoặc PNG, tối đa 5 MB, tỷ lệ 3:4, nền sáng | _Ảnh chân dung_ |
| PDF, tối đa 20 MB. Không ghi tên thí sinh trong bài | _Bài dự thi_ |
| Tối đa 300 từ | _Mô tả_ |
| Dùng để xác minh danh tính khi trao giải. Không chia sẻ cho bên thứ ba | _Trường nhạy cảm_ |
| Gõ tên trường hoặc tên viết tắt, ví dụ: bk, neu, ams | _Ô tìm trường_ |

<a id="cau-chu-button"></a>
### Nút

Động từ + đối tượng. Viết hoa chữ đầu. Một nút chính mỗi màn hình.

| Mẫu câu | Ví dụ / ngữ cảnh |
| --- | --- |
| Bắt đầu đăng ký | _Trang giới thiệu_ |
| Tiếp tục | _Giữa các bước_ |
| Quay lại | _Nút phụ_ |
| Lưu và tiếp tục sau | _Nút phụ, form dài_ |
| Lưu và quay lại trang xem lại | _Khi sửa từ trang xem lại_ |
| Gửi hồ sơ đăng ký | _Nút cuối_ |
| Sửa | _Trên trang xem lại, kèm chữ ẩn "họ và tên" cho trình đọc màn hình_ |
| Chọn tệp · Thay tệp · Xóa | _Tải tệp_ |
| Thêm thành viên | _Đăng ký theo đội_ |
| Thử lại | _Sau lỗi mạng_ |

<a id="cau-chu-status"></a>
### Trạng thái

Bình tĩnh, ngắn. Có giờ cụ thể khi nói về việc lưu.

| Mẫu câu | Ví dụ / ngữ cảnh |
| --- | --- |
| Đang lưu… | — |
| Đã lưu nháp lúc {giờ} | Đã lưu nháp lúc 14:32 |
| Chưa lưu được, đang thử lại… | — |
| Đang tải lên {x}% · {a} / {b} MB | Đang tải lên 45% · 9 / 20 MB |
| Đang gửi hồ sơ… | — |
| Vẫn đang gửi, vui lòng không đóng trang | — |
| Đã gửi lại mã. Gửi lại sau {n} giây | Đã gửi lại mã. Gửi lại sau 60 giây |
| Đã xóa {tên}. Hoàn tác | Đã xóa Trần Bảo Châu. Hoàn tác |

<a id="cau-chu-success"></a>
### Thành công & xác nhận

Khoảnh khắc kết thúc — thứ người dùng sẽ nhớ. Cho họ mã hồ sơ và bước tiếp theo.

| Mẫu câu | Ví dụ / ngữ cảnh |
| --- | --- |
| Đăng ký thành công | _Tiêu đề trang xác nhận_ |
| Mã hồ sơ của bạn: {mã} | Mã hồ sơ của bạn: YT26-04821 |
| Chúng tôi đã gửi email xác nhận tới {email}. Nếu không thấy, hãy kiểm tra thư mục Spam hoặc Quảng cáo | — |
| Tiếp theo: Ban tổ chức công bố danh sách vào vòng 2 ngày {ngày} | — |
| Bạn có thể sửa hồ sơ đến {giờ}, {ngày} | Bạn có thể sửa hồ sơ đến 23:59, 30/11/2026 |
| [{Tên cuộc thi}] Xác nhận đăng ký – Mã hồ sơ {mã} | _Tiêu đề email_ |

<a id="cau-chu-portal"></a>
### Trạng thái cổng đăng ký

Nói rõ trạng thái trước khi người dùng bắt đầu điền.

| Mẫu câu | Ví dụ / ngữ cảnh |
| --- | --- |
| Cổng đăng ký mở lúc {giờ} ngày {ngày} | Cổng đăng ký mở lúc 08:00 ngày 01/11/2026 |
| Hạn chót: {giờ}, {ngày} (giờ Việt Nam) | Hạn chót: 23:59, 30/11/2026 (giờ Việt Nam) |
| Còn {n} giờ để nộp hồ sơ | — |
| Đã hết hạn đăng ký lúc {giờ} ngày {ngày} | — |
| Hạng mục {tên} đã đủ số lượng. Đăng ký danh sách chờ | — |

<a id="cau-chu-consent"></a>
### Đồng ý & cam kết

Mỗi mục đích một ô. Không chọn sẵn. Ghi rõ "(không bắt buộc)" khi tùy chọn.

| Mẫu câu | Ví dụ / ngữ cảnh |
| --- | --- |
| Tôi đã đọc và đồng ý với Thể lệ cuộc thi | — |
| Tôi đồng ý để Ban tổ chức xử lý dữ liệu cá nhân theo Chính sách bảo mật, cho mục đích tổ chức cuộc thi | — |
| Tôi muốn nhận tin về các cuộc thi và sự kiện tiếp theo (không bắt buộc) | — |
| Tôi cam kết tác phẩm là sáng tạo của tôi/đội tôi và chưa đoạt giải ở cuộc thi khác | — |
| Tôi là cha, mẹ hoặc người giám hộ hợp pháp và đồng ý cho thí sinh tham gia cuộc thi | _Thí sinh dưới 18 tuổi_ |

<a id="cau-chu-intro"></a>
### Trước khi bắt đầu

Đặt kỳ vọng: thời gian, tài liệu, điều kiện, hạn chót.

| Mẫu câu | Ví dụ / ngữ cảnh |
| --- | --- |
| Mất khoảng {n} phút, gồm {k} bước | Mất khoảng 8 phút, gồm 4 bước |
| Bạn cần chuẩn bị: {danh sách tài liệu kèm quy cách} | — |
| Dành cho {đối tượng} từ {min} đến {max} tuổi | — |
| Bản nháp được tự động lưu. Bạn có thể tạm dừng và quay lại sau | — |
| Các trường có dấu * là bắt buộc | — |

<a id="thu-vien-truong"></a>
## 9. Thư viện trường

Thông số bàn giao cho thiết kế và phát triển. Mã HTML là khung tối thiểu đúng chuẩn tiếp cận; thêm lớp CSS và JavaScript kiểm tra theo hệ thống của dự án.

### Thông tin cá nhân

<a id="truong-name"></a>
#### Họ và tên

Nguyên tắc: [I6](#i6), [I2](#i2), [L1](#l1)

| Thông số | Giá trị |
| --- | --- |
| Loại | `text` |
| autocomplete | `name` |
| Thuộc tính khác | autocapitalize="words" spellcheck="false" |

**Kiểm tra:**

- Bắt buộc
- 2–100 ký tự
- Có chữ cái, không chứa chữ số

**Chuẩn hóa:**

- Gộp khoảng trắng thừa
- Chuẩn hóa Unicode NFC

**Câu lỗi:**

- Nhập họ và tên
- Họ và tên cần có ít nhất 2 ký tự
- Họ và tên không chứa chữ số

**Lưu ý:**

- Một ô duy nhất, không tách Họ/Tên
- Chấp nhận dấu nháy, dấu gạch: H'Lan Niê, Anh-Thư

```html
<div class="field">
  <label for="name">Họ và tên <span aria-hidden="true">*</span></label>
  <p class="hint" id="name-hint">Ghi đầy đủ, có dấu</p>
  <p class="error" id="name-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <input id="name" name="name" type="text" autocomplete="name"
         spellcheck="false" autocapitalize="words" enterkeyhint="next"
         aria-required="true" aria-describedby="name-hint">
</div>
```

<a id="truong-dob"></a>
#### Ngày sinh

Nguyên tắc: [I7](#i7), [I5](#i5), [A2](#a2)

| Thông số | Giá trị |
| --- | --- |
| Loại | `text × 3 (fieldset)` |

**Kiểm tra:**

- Ngày có thật
- Không ở tương lai
- Trong độ tuổi điều kiện (ví dụ 15–30 tuổi tính đến hạn chót)

**Chuẩn hóa:**

- Thêm số 0: 3 → 03

**Câu lỗi:**

- Nhập ngày sinh
- Ngày sinh cần có năm
- Ngày sinh phải là một ngày có thật
- Thí sinh cần sinh trong khoảng …

**Lưu ý:**

- Thứ tự ngày/tháng/năm kiểu Việt Nam
- Không tự nhảy ô
- Lỗi chỉ tô đỏ phần sai

```html
<fieldset class="field" aria-describedby="dob-hint">
  <legend>Ngày sinh <span aria-hidden="true">*</span></legend>
  <p class="hint" id="dob-hint">Ví dụ: 27 03 2008</p>
  <p class="error" id="dob-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <div class="date">
    <label for="dob-d">Ngày</label>
    <input id="dob-d" name="dob-d" inputmode="numeric" autocomplete="bday-day" class="w-2">
    <label for="dob-m">Tháng</label>
    <input id="dob-m" name="dob-m" inputmode="numeric" autocomplete="bday-month" class="w-2">
    <label for="dob-y">Năm</label>
    <input id="dob-y" name="dob-y" inputmode="numeric" autocomplete="bday-year" class="w-4">
  </div>
</fieldset>
```

<a id="truong-gender"></a>
#### Giới tính

Nguyên tắc: [F2](#f2), [C1](#c1), [C5](#c5)

| Thông số | Giá trị |
| --- | --- |
| Loại | `radio (fieldset)` |

**Kiểm tra:**

- Thường không bắt buộc

**Câu lỗi:**

- Chọn giới tính (chỉ khi bắt buộc)

**Lưu ý:**

- Chỉ hỏi khi thật sự dùng, ví dụ chia giải nam/nữ
- Không chọn sẵn

```html
<fieldset class="field">
  <legend>Giới tính <span class="opt">(không bắt buộc)</span></legend>
  <p class="error" id="gender-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <label><input type="radio" name="gender" value="nam"> Nam</label>
  <label><input type="radio" name="gender" value="nu"> Nữ</label>
  <label><input type="radio" name="gender" value="khac"> Khác</label>
</fieldset>
```

<a id="truong-cccd"></a>
#### Số căn cước (CCCD)

Nguyên tắc: [I1](#i1), [I3](#i3), [L6](#l6), [P3](#p3)

| Thông số | Giá trị |
| --- | --- |
| Loại | `text` |
| inputmode | `numeric` |
| autocomplete | `off` |

**Kiểm tra:**

- Đúng 12 chữ số sau khi bỏ khoảng trắng

**Chuẩn hóa:**

- Bỏ khoảng trắng, dấu chấm, gạch

**Câu lỗi:**

- Nhập số căn cước
- Số căn cước gồm 12 chữ số. Bạn đã nhập {n} chữ số
- Số căn cước chỉ gồm chữ số

**Lưu ý:**

- Không dùng type="number": mất số 0 ở đầu (001…)
- Không dùng maxlength: chuỗi dán có khoảng trắng bị cắt
- Thường nên hỏi sau, khi trao giải (F2)
- Hiển thị lại dạng \*\*\*\*\*\*\*\*4567

```html
<div class="field">
  <label for="cccd">Số căn cước (CCCD) <span aria-hidden="true">*</span></label>
  <p class="hint" id="cccd-hint">12 chữ số in trên thẻ căn cước</p>
  <p class="error" id="cccd-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <input id="cccd" name="cccd" type="text" inputmode="numeric"
         autocomplete="off" aria-required="true"
         aria-describedby="cccd-hint">
</div>
```

<a id="truong-photo"></a>
#### Ảnh chân dung

Nguyên tắc: [U1](#u1), [U2](#u2), [U4](#u4), [U5](#u5)

| Thông số | Giá trị |
| --- | --- |
| Loại | `file` |
| accept | `image/jpeg,image/png,.jpg,.jpeg,.png` |

**Kiểm tra:**

- Định dạng JPG/PNG
- Dung lượng (tự nén nếu vượt)
- Từ chối HEIC kèm hướng dẫn đổi định dạng

**Câu lỗi:**

- Tải lên ảnh chân dung
- Tệp "…" không đúng định dạng. Hãy tải lên tệp JPG hoặc PNG
- Ảnh "…" ở định dạng HEIC…

**Lưu ý:**

- Tải lên ngay khi chọn
- Điện thoại tự đề xuất máy ảnh hoặc thư viện ảnh
- Cân nhắc cho cắt khung 3:4

```html
<div class="field">
  <label for="photo">Ảnh chân dung <span aria-hidden="true">*</span></label>
  <p class="hint" id="photo-hint">JPG hoặc PNG, tối đa 2 MB, tỷ lệ 3:4, nền sáng. Ảnh lớn hơn sẽ được tự động tối ưu.</p>
  <p class="error" id="photo-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <input type="file" id="photo" name="photo" accept="image/jpeg,image/png,.jpg,.jpeg,.png" aria-describedby="photo-hint">
</div>
```

### Liên hệ & địa chỉ

<a id="truong-email"></a>
#### Email

Nguyên tắc: [I1](#i1), [I2](#i2), [I9](#i9), [V1](#v1)

| Thông số | Giá trị |
| --- | --- |
| Loại | `email` |
| inputmode | `email` |
| autocomplete | `email` |
| Thuộc tính khác | spellcheck="false" autocapitalize="none" |

**Kiểm tra:**

- Có @ và tên miền
- Kiểm tra trùng với máy chủ khi rời ô

**Chuẩn hóa:**

- Bỏ khoảng trắng
- Tên miền về chữ thường

**Câu lỗi:**

- Nhập email
- Email cần có ký tự @, ví dụ: ten@gmail.com
- Nhập email đúng định dạng, ví dụ: ten@gmail.com

**Lưu ý:**

- Gợi ý sửa tên miền gõ nhầm: gmial.com → gmail.com
- Không có ô "Nhập lại email"

```html
<div class="field">
  <label for="email">Email <span aria-hidden="true">*</span></label>
  <p class="hint" id="email-hint">Ví dụ: ten@gmail.com</p>
  <p class="error" id="email-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <input id="email" name="email" type="email" inputmode="email"
         autocomplete="email" spellcheck="false" autocapitalize="none"
         enterkeyhint="next" aria-required="true"
         aria-describedby="email-hint">
</div>
```

<a id="truong-phone"></a>
#### Số điện thoại

Nguyên tắc: [I1](#i1), [I3](#i3), [I4](#i4)

| Thông số | Giá trị |
| --- | --- |
| Loại | `tel` |
| inputmode | `tel` |
| autocomplete | `tel` |

**Kiểm tra:**

- 10 chữ số sau chuẩn hóa
- Đầu số di động 03, 05, 07, 08, 09

**Chuẩn hóa:**

- +84 / 84 → 0
- Thêm 0 nếu thiếu (912… → 0912…)
- Bỏ dấu chấm, gạch, khoảng trắng
- Hiển thị 0912 345 678

**Câu lỗi:**

- Nhập số điện thoại
- Số điện thoại cần có 10 chữ số. Bạn đã nhập {n} chữ số
- Số điện thoại di động cần bắt đầu bằng 03, 05, 07, 08 hoặc 09

**Lưu ý:**

- Số máy bàn (02x, 11 số): chỉ chấp nhận khi thật sự cần

```html
<div class="field">
  <label for="phone">Số điện thoại <span aria-hidden="true">*</span></label>
  <p class="hint" id="phone-hint">Ví dụ: 0912 345 678</p>
  <p class="error" id="phone-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <input id="phone" name="phone" type="tel" inputmode="tel"
         autocomplete="tel" enterkeyhint="next" aria-required="true"
         aria-describedby="phone-hint">
</div>
```

<a id="truong-province"></a>
#### Tỉnh/Thành phố

Nguyên tắc: [C2](#c2), [C3](#c3)

| Thông số | Giá trị |
| --- | --- |
| Loại | `combobox (text + listbox)` |
| autocomplete | `address-level1` |

**Kiểm tra:**

- Chọn một trong 34 tỉnh/thành

**Chuẩn hóa:**

- Khớp không dấu, viết tắt, tên tỉnh cũ

**Câu lỗi:**

- Chọn tỉnh/thành phố
- Chọn một tỉnh/thành phố trong danh sách gợi ý

**Lưu ý:**

- Từ 01/07/2025: 34 tỉnh/thành, không còn cấp huyện
- Gõ "Bình Dương" → TP. Hồ Chí Minh

```html
<div class="field">
  <label for="province">Tỉnh/Thành phố <span aria-hidden="true">*</span></label>
  <p class="hint" id="province-hint">Gõ để tìm, không cần dấu. Tên tỉnh cũ cũng được.</p>
  <p class="error" id="province-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <input id="province" type="text" role="combobox" aria-autocomplete="list"
         aria-expanded="false" aria-controls="province-list" autocomplete="address-level1" aria-describedby="province-hint">
  <ul id="province-list" role="listbox" hidden></ul>
</div>
```

<a id="truong-ward"></a>
#### Phường/Xã

Nguyên tắc: [C3](#c3), [C2](#c2)

| Thông số | Giá trị |
| --- | --- |
| Loại | `combobox (lọc theo tỉnh)` |
| autocomplete | `address-level2` |

**Kiểm tra:**

- Thuộc tỉnh/thành đã chọn

**Câu lỗi:**

- Chọn phường/xã

**Lưu ý:**

- Đổi tỉnh → xóa phường/xã đã chọn và báo cho người dùng
- Gồm cả đặc khu

```html
<div class="field">
  <label for="ward">Phường/Xã <span aria-hidden="true">*</span></label>
  <p class="hint" id="ward-hint">Chọn tỉnh/thành trước. Trong sản phẩm thật: danh sách lọc theo tỉnh.</p>
  <p class="error" id="ward-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <input id="ward" name="ward" type="text"
         autocomplete="address-level2" aria-required="true"
         aria-describedby="ward-hint">
</div>
```

<a id="truong-street"></a>
#### Số nhà, tên đường

Nguyên tắc: [F2](#f2), [I2](#i2)

| Thông số | Giá trị |
| --- | --- |
| Loại | `text` |
| autocomplete | `street-address` |

**Kiểm tra:**

- Không để trống

**Câu lỗi:**

- Nhập số nhà, tên đường

**Lưu ý:**

- Chỉ hỏi khi cần gửi đồ (giải thưởng, vé giấy)

```html
<div class="field">
  <label for="street">Số nhà, tên đường <span aria-hidden="true">*</span></label>
  <p class="hint" id="street-hint">Ví dụ: 12 ngõ 34 phố Huế</p>
  <p class="error" id="street-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <input id="street" name="street" type="text"
         autocomplete="street-address" aria-required="true"
         aria-describedby="street-hint">
</div>
```

### Học tập & đơn vị

<a id="truong-school"></a>
#### Trường hoặc đơn vị

Nguyên tắc: [C2](#c2), [L3](#l3)

| Thông số | Giá trị |
| --- | --- |
| Loại | `combobox (text + listbox)` |
| autocomplete | `organization` |

**Kiểm tra:**

- Không bắt buộc khớp danh sách

**Câu lỗi:**

- Nhập tên trường hoặc đơn vị (nếu bắt buộc)

**Lưu ý:**

- Hiểu tên viết tắt: bk, neu, ams
- Có lựa chọn "Dùng tên bạn nhập" khi không có trong danh sách

```html
<div class="field">
  <label for="school">Trường hoặc đơn vị <span class="opt">(không bắt buộc)</span></label>
  <p class="hint" id="school-hint">Gõ tên hoặc tên viết tắt, ví dụ: bk, neu, ams</p>
  <p class="error" id="school-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <input id="school" type="text" role="combobox" aria-autocomplete="list"
         aria-expanded="false" aria-controls="school-list" autocomplete="organization" aria-describedby="school-hint">
  <ul id="school-list" role="listbox" hidden></ul>
</div>
```

<a id="truong-mssv"></a>
#### Mã số sinh viên

Nguyên tắc: [F2](#f2), [I3](#i3)

| Thông số | Giá trị |
| --- | --- |
| Loại | `text` |
| autocomplete | `off` |

**Kiểm tra:**

- Không áp định dạng cứng — mỗi trường một kiểu

**Lưu ý:**

- Chỉ hỏi khi cần xác minh là sinh viên

```html
<div class="field">
  <label for="mssv">Mã số sinh viên <span class="opt">(không bắt buộc)</span></label>
  <p class="hint" id="mssv-hint">In trên thẻ sinh viên</p>
  <p class="error" id="mssv-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <input id="mssv" name="mssv" type="text" autocomplete="off"
         spellcheck="false" autocapitalize="characters"
         aria-describedby="mssv-hint">
</div>
```

### Bài dự thi & tệp

<a id="truong-cat"></a>
#### Hạng mục dự thi

Nguyên tắc: [C6](#c6), [C1](#c1)

| Thông số | Giá trị |
| --- | --- |
| Loại | `radio (thẻ lựa chọn)` |

**Kiểm tra:**

- Bắt buộc chọn
- Không cho chọn hạng mục hết suất hoặc không đủ điều kiện

**Câu lỗi:**

- Chọn hạng mục dự thi

**Lưu ý:**

- Hiển thị số suất còn lại
- Không đủ điều kiện: hiện mờ kèm lý do, không ẩn

```html
<fieldset class="field">
  <legend>Hạng mục dự thi <span aria-hidden="true">*</span></legend>
  <p class="error" id="cat-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <label><input type="radio" name="cat" value="tech"> Công nghệ & AI</label>
  <label><input type="radio" name="cat" value="env"> Môi trường & Đô thị</label>
  <label><input type="radio" name="cat" value="edu"> Giáo dục & Cộng đồng</label>
</fieldset>
```

<a id="truong-title"></a>
#### Tên ý tưởng

Nguyên tắc: [I8](#i8), [V3](#v3)

| Thông số | Giá trị |
| --- | --- |
| Loại | `text` |
| autocomplete | `off` |

**Kiểm tra:**

- Tối đa 120 ký tự (kiểm tra, không dùng maxlength)

**Câu lỗi:**

- Nhập tên ý tưởng
- Tên ý tưởng tối đa 120 ký tự. Hiện có {n} ký tự

```html
<div class="field">
  <label for="title">Tên ý tưởng <span aria-hidden="true">*</span></label>
  <p class="hint" id="title-hint">Tối đa 120 ký tự</p>
  <p class="error" id="title-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <input id="title" name="title" type="text" autocomplete="off"
         aria-required="true" aria-describedby="title-hint">
</div>
```

<a id="truong-desc"></a>
#### Mô tả ý tưởng

Nguyên tắc: [I8](#i8), [D1](#d1)

| Thông số | Giá trị |
| --- | --- |
| Loại | `textarea` |
| Thuộc tính khác | Bộ đếm có aria-live="polite", cập nhật có độ trễ |

**Kiểm tra:**

- Tối đa 300 từ

**Câu lỗi:**

- Nhập mô tả ý tưởng
- Mô tả tối đa 300 từ. Hiện có {n} từ

**Lưu ý:**

- Đếm từ, không cắt cụt nội dung
- Tự lưu nháp

```html
<div class="field">
  <label for="desc">Mô tả ý tưởng <span aria-hidden="true">*</span></label>
  <p class="hint" id="desc-hint">Tối đa 300 từ. Nêu vấn đề, giải pháp, người hưởng lợi.</p>
  <p class="error" id="desc-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <textarea id="desc" name="desc" rows="7" autocomplete="off"
            aria-required="true" aria-describedby="desc-hint"></textarea>
  <p class="count" aria-live="polite">Còn 300 từ</p>
</div>
```

<a id="truong-file"></a>
#### Tệp bài dự thi

Nguyên tắc: [U1](#u1), [U2](#u2), [U3](#u3)

| Thông số | Giá trị |
| --- | --- |
| Loại | `file` |
| accept | `application/pdf,.pdf` |

**Kiểm tra:**

- Định dạng PDF
- Tối đa 20 MB
- Không rỗng

**Câu lỗi:**

- Tải lên tệp bài dự thi (PDF)
- Tệp "…" không đúng định dạng. Hãy tải lên tệp PDF
- Tệp "…" có dung lượng … MB, vượt giới hạn 20 MB

```html
<div class="field">
  <label for="file">Tệp bài dự thi <span aria-hidden="true">*</span></label>
  <p class="hint" id="file-hint">PDF, tối đa 20 MB. Không ghi tên thí sinh trong bài.</p>
  <p class="error" id="file-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <input type="file" id="file" name="file" accept="application/pdf,.pdf" aria-describedby="file-hint">
</div>
```

<a id="truong-url"></a>
#### Đường dẫn sản phẩm

Nguyên tắc: [I3](#i3), [I1](#i1)

| Thông số | Giá trị |
| --- | --- |
| Loại | `url` |
| inputmode | `url` |
| autocomplete | `url` |

**Kiểm tra:**

- Đường dẫn hợp lệ, có tên miền

**Chuẩn hóa:**

- Tự thêm https:// nếu thiếu

**Câu lỗi:**

- Nhập đường dẫn đầy đủ, ví dụ: behance.net/ten-ban

```html
<div class="field">
  <label for="url">Đường dẫn sản phẩm <span class="opt">(không bắt buộc)</span></label>
  <p class="hint" id="url-hint">Ví dụ: behance.net/ten-ban</p>
  <p class="error" id="url-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <input id="url" name="url" type="url" inputmode="url"
         autocomplete="url" spellcheck="false" autocapitalize="none"
         aria-describedby="url-hint">
</div>
```

### Tài khoản & xác thực

<a id="truong-password"></a>
#### Mật khẩu

Nguyên tắc: [I10](#i10), [I9](#i9), [F7](#f7)

| Thông số | Giá trị |
| --- | --- |
| Loại | `password` |
| autocomplete | `new-password` |

**Kiểm tra:**

- Ít nhất 8 ký tự
- Ưu tiên độ dài hơn quy tắc phức tạp

**Câu lỗi:**

- Nhập mật khẩu
- Mật khẩu cần ít nhất 8 ký tự

**Lưu ý:**

- Một ô + nút Hiện/Ẩn, không ô nhập lại
- Cho dán, hỗ trợ trình quản lý mật khẩu
- Cuộc thi chỉ đăng ký một lần: cân nhắc bỏ mật khẩu

```html
<div class="field">
  <label for="password">Mật khẩu <span aria-hidden="true">*</span></label>
  <p class="hint" id="password-hint">Ít nhất 8 ký tự</p>
  <div class="password">
    <input id="password" name="password" type="password"
           autocomplete="new-password" aria-describedby="password-hint">
    <button type="button" aria-controls="password" aria-pressed="false">Hiện</button>
  </div>
</div>
```

<a id="truong-otp"></a>
#### Mã xác thực (OTP)

Nguyên tắc: [R3](#r3), [I1](#i1), [A5](#a5)

| Thông số | Giá trị |
| --- | --- |
| Loại | `text` |
| inputmode | `numeric` |
| autocomplete | `one-time-code` |

**Kiểm tra:**

- 6 chữ số; tự kiểm tra khi đủ

**Chuẩn hóa:**

- Bỏ khoảng trắng khi dán

**Câu lỗi:**

- Mã chưa đúng. Kiểm tra lại tin nhắn hoặc gửi lại mã
- Mã đã hết hạn. Gửi lại mã mới

**Lưu ý:**

- Một ô, nhận dán cả chuỗi
- Đếm ngược "Gửi lại mã sau 60 giây"
- Cho sửa số điện thoại ngay tại chỗ

```html
<div class="field">
  <label for="otp">Mã xác thực</label>
  <p class="hint" id="otp-hint">Mã gồm 6 chữ số đã gửi tới 0912 *** 678.
    <button type="button">Sửa số</button></p>
  <input id="otp" name="otp" type="text" inputmode="numeric"
         autocomplete="one-time-code" aria-describedby="otp-hint">
  <p class="hint" aria-live="polite">Gửi lại mã sau 60 giây</p>
</div>
```

### Lựa chọn & cam kết

<a id="truong-agree"></a>
#### Tôi đã đọc và đồng ý với Thể lệ cuộc thi

Nguyên tắc: [R2](#r2), [C5](#c5), [P1](#p1)

| Thông số | Giá trị |
| --- | --- |
| Loại | `checkbox` |

**Kiểm tra:**

- Bắt buộc tích

**Câu lỗi:**

- Bạn cần đồng ý với Thể lệ cuộc thi để gửi hồ sơ

**Lưu ý:**

- Không chọn sẵn
- Liên kết đọc thể lệ không làm mất dữ liệu
- Lưu thời điểm và phiên bản thể lệ đã đồng ý

```html
<div class="field">
  <p class="error" id="agree-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <label><input type="checkbox" id="agree" name="agree" aria-required="true"> Tôi đã đọc và đồng ý với Thể lệ cuộc thi</label>
</div>
```

<a id="truong-news"></a>
#### Tôi muốn nhận tin về các cuộc thi tiếp theo

Nguyên tắc: [R2](#r2), [C5](#c5)

| Thông số | Giá trị |
| --- | --- |
| Loại | `checkbox` |

**Kiểm tra:**

- Không bắt buộc

**Lưu ý:**

- Tách riêng khỏi ô đồng ý thể lệ
- Không chọn sẵn

```html
<div class="field">
  <p class="error" id="news-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <label><input type="checkbox" id="news" name="news"> Tôi muốn nhận tin về các cuộc thi tiếp theo</label>
</div>
```

<a id="truong-size"></a>
#### Size áo

Nguyên tắc: [C1](#c1), [F2](#f2)

| Thông số | Giá trị |
| --- | --- |
| Loại | `radio (fieldset)` |

**Kiểm tra:**

- Bắt buộc chọn (nếu có phát áo)

**Câu lỗi:**

- Chọn size áo

**Lưu ý:**

- Chỉ hỏi khi thật sự phát áo
- Bảng size xem ngay tại chỗ, không mở trang khác

```html
<fieldset class="field" aria-describedby="size-hint">
  <legend>Size áo <span aria-hidden="true">*</span></legend>
  <p class="hint" id="size-hint">Áo thun unisex, phát khi nhận số báo danh</p>
  <p class="error" id="size-error" hidden><span class="visually-hidden">Lỗi:</span> …</p>
  <label><input type="radio" name="size" value="S"> S</label>
  <label><input type="radio" name="size" value="M"> M</label>
  <label><input type="radio" name="size" value="L"> L</label>
  <label><input type="radio" name="size" value="XL"> XL</label>
  <label><input type="radio" name="size" value="XXL"> XXL</label>
</fieldset>
```

<a id="mau-cau-truc"></a>
## 10. Mẫu cấu trúc form theo loại

Điểm xuất phát khi lên khung form. Cột "Hỏi gì" phân loại: Bắt buộc · Không bắt buộc · Có điều kiện · Hỏi sau · Suy ra, không hỏi.

<a id="mau-contest"></a>
### Đăng ký dự thi

- **Ví dụ:** Cuộc thi ý tưởng, sáng tác, khởi nghiệp, viết
- **Mô hình:** Nhiều bước: 4 bước + trang xem lại
- **Thời gian điền:** 8–12 phút
- **Nguyên tắc then chốt:** [F1](#f1), [F2](#f2), [D1](#d1), [U2](#u2), [R1](#r1), [K1](#k1), [T3](#t3)

| Bước | Trường | Hỏi gì | Ghi chú |
| --- | --- | --- | --- |
| 1. Trang giới thiệu | — | — | Trạng thái cổng, hạn chót, điều kiện, tài liệu cần chuẩn bị |
| 2. Thông tin thí sinh | Họ và tên | Bắt buộc |  |
|  | Ngày sinh | Bắt buộc | Kiểm tra độ tuổi |
|  | Người giám hộ | Có điều kiện | Chỉ khi dưới 18 tuổi |
|  | Ảnh chân dung | Bắt buộc | Tự nén, cho cắt 3:4 |
|  | Số căn cước | Hỏi sau | Hỏi khi trao giải |
|  | Tuổi | Suy ra, không hỏi | Tính từ ngày sinh |
| 3. Liên hệ | Email | Bắt buộc | Gợi ý sửa tên miền |
|  | Số điện thoại | Bắt buộc |  |
|  | Tỉnh/Thành phố | Bắt buộc | 34 tỉnh, tìm không dấu |
|  | Trường/Đơn vị | Không bắt buộc |  |
|  | Địa chỉ chi tiết | Hỏi sau | Hỏi khi gửi giải thưởng |
| 4. Bài dự thi | Hạng mục | Bắt buộc | Thẻ lựa chọn có mô tả |
|  | Hình thức: cá nhân/đội | Bắt buộc |  |
|  | Thành viên đội | Có điều kiện | 2–5 người |
|  | Tên ý tưởng | Bắt buộc |  |
|  | Mô tả | Bắt buộc | Đếm từ |
|  | Tệp bài dự thi | Bắt buộc | PDF |
| 5. Xem lại và gửi | Đồng ý thể lệ | Bắt buộc |  |
|  | Nhận tin | Không bắt buộc |  |
|  | Đồng ý của người giám hộ | Có điều kiện |  |
| 6. Xác nhận | — | — | Mã hồ sơ, email xác nhận, các mốc tiếp theo, thêm vào lịch |

**Bẫy hay gặp:**

- Hỏi CCCD và địa chỉ đầy đủ ngay vòng sơ loại.
- Bài dự thi chỉ tải lên khi bấm Gửi cuối cùng.
- Không nói rõ bài thi có được ghi tên thí sinh hay không (chấm ẩn danh).
- Không có trang xác nhận, chỉ có toast "Thành công".

<a id="mau-apply"></a>
### Hồ sơ xét tuyển, ứng tuyển

- **Ví dụ:** Học bổng, chương trình đào tạo, tuyển dụng, tài trợ
- **Mô hình:** Nhiều bước + lưu nháp bắt buộc + theo dõi trạng thái
- **Thời gian điền:** 20–45 phút, có thể chia nhiều lần
- **Nguyên tắc then chốt:** [F1](#f1), [D1](#d1), [D2](#d2), [D3](#d3), [U3](#u3), [K3](#k3), [R1](#r1)

| Bước | Trường | Hỏi gì | Ghi chú |
| --- | --- | --- | --- |
| 1. Kiểm tra điều kiện nhanh | — | — | 3–5 câu Có/Không trước khi vào form dài. Không đủ điều kiện thì báo ngay, đừng để điền 30 phút |
| 2. Thông tin cá nhân | Họ và tên | Bắt buộc |  |
|  | Ngày sinh | Bắt buộc |  |
|  | Email | Bắt buộc |  |
|  | Số điện thoại | Bắt buộc |  |
|  | Tỉnh/Thành phố | Bắt buộc |  |
| 3. Học vấn & kinh nghiệm | Trường/Đơn vị | Bắt buộc | Tìm kiếm, cho nhập tự do |
|  | Quá trình học tập | Bắt buộc | Lặp lại nhiều mục, thêm/xóa |
|  | Kinh nghiệm | Không bắt buộc |  |
| 4. Tài liệu | CV | Bắt buộc | PDF |
|  | Bảng điểm | Bắt buộc |  |
|  | Thư giới thiệu | Không bắt buộc | Hoặc gửi lời mời người giới thiệu tự nộp |
| 5. Câu hỏi tự luận | Bài luận 1 | Bắt buộc | Đếm từ, tự lưu |
|  | Bài luận 2 | Bắt buộc |  |
| 6. Xem lại và gửi | Cam kết thông tin trung thực | Bắt buộc |  |
|  | Đồng ý xử lý dữ liệu | Bắt buộc |  |
| 7. Theo dõi hồ sơ | — | — | Trạng thái: Đã nhận → Đang xét → Phỏng vấn → Kết quả; cho bổ sung khi "Cần bổ sung" |

**Bẫy hay gặp:**

- Không có lưu nháp cho bài luận 500 từ.
- Phiên đăng nhập hết hạn sau 15 phút, mất bài luận.
- Cho điền hết rồi mới báo "không đủ điều kiện".
- Bắt người dùng nhập lại thông tin đã có trong CV.

<a id="mau-event"></a>
### Đăng ký sự kiện, giải chạy

- **Ví dụ:** Workshop, hội thảo, giải chạy, triển lãm
- **Mô hình:** Một trang (hoặc 2 bước nếu có thanh toán)
- **Thời gian điền:** 2–5 phút
- **Nguyên tắc then chốt:** [F3](#f3), [C6](#c6), [C1](#c1), [B4](#b4), [K1](#k1), [T4](#t4)

| Bước | Trường | Hỏi gì | Ghi chú |
| --- | --- | --- | --- |
| 1. Chọn hạng mục | Cự ly / phiên / loại vé | Bắt buộc | Thẻ lựa chọn: giá, số suất còn lại, điều kiện |
| 2. Thông tin người tham gia | Họ và tên | Bắt buộc |  |
|  | Email | Bắt buộc |  |
|  | Số điện thoại | Bắt buộc |  |
|  | Ngày sinh | Có điều kiện | Chỉ khi chia nhóm tuổi |
|  | Giới tính | Có điều kiện | Chỉ khi chia giải nam/nữ |
|  | Size áo | Có điều kiện | Có bảng size ngay tại chỗ |
|  | Liên hệ khẩn cấp | Có điều kiện | Giải chạy, hoạt động thể chất |
| 3. Thanh toán (nếu có) | — | — | Tổng tiền rõ ràng trước khi bấm; giữ suất trong thời gian thanh toán, có đếm ngược |
| 4. Xác nhận | — | — | Vé/mã QR, thêm vào lịch, chỉ đường, những gì cần mang |

**Bẫy hay gặp:**

- Hết suất nhưng vẫn cho điền form.
- Hỏi giới tính, ngày sinh khi không chia giải theo nhóm.
- Không cho thêm vào lịch, không có mã vé trên email.

<a id="mau-quick"></a>
### Đăng ký nhanh

- **Ví dụ:** Nhận bản tin, bình chọn, nhận quà, danh sách chờ
- **Mô hình:** Một trang, 1–3 trường, đặt ngay trong nội dung
- **Thời gian điền:** dưới 30 giây
- **Nguyên tắc then chốt:** [F2](#f2), [B1](#b1), [B4](#b4), [P1](#p1)

| Bước | Trường | Hỏi gì | Ghi chú |
| --- | --- | --- | --- |
| 1. Form ngắn | Email hoặc Số điện thoại | Bắt buộc | Chỉ một kênh liên hệ |
|  | Họ và tên | Không bắt buộc |  |
|  | Nhận tin | Bắt buộc | Chính là mục đích của form, nói rõ tần suất |
| 2. Xác nhận tại chỗ | — | — | Thay form bằng thông điệp thành công ngay tại vị trí đó; email xác nhận (double opt-in nếu là bản tin) |

**Bẫy hay gặp:**

- Popup đăng ký bản tin che nội dung ngay khi vào trang.
- Hỏi 6 trường chỉ để gửi bản tin.

<a id="do-luong"></a>
## 11. Đo lường sau ra mắt

Chỉ số đầu ra cho biết form có "chạy" không; chỉ số đầu vào cho biết phải sửa ở đâu.

| Chỉ số | Loại | Công thức | Ý nghĩa | Nguyên tắc |
| --- | --- | --- | --- | --- |
| **Tỷ lệ hoàn thành** | Đầu ra | Hồ sơ gửi thành công ÷ Người bắt đầu điền | Thước đo tổng: form có "chạy" hay không. Không kéo trực tiếp được — cải thiện nó bằng các chỉ số đầu vào bên dưới. | F2, K1 |
| **Tỷ lệ bắt đầu** | Đầu ra | Người bấm "Bắt đầu đăng ký" ÷ Người xem trang giới thiệu | Thấp: trang giới thiệu chưa rõ lợi ích, điều kiện, hoặc yêu cầu chuẩn bị làm người dùng nản. | F1, T4 |
| **Tỷ lệ rơi theo bước** | Đầu vào | Người rời ở bước N ÷ Người vào bước N | Chỉ ra bước rò rỉ nhất để tập trung sửa. Bước có tải tệp và bước cuối thường rơi nhiều nhất. | F3, U3 |
| **Tỷ lệ lỗi theo trường** | Đầu vào | Người thấy lỗi ở trường ÷ Người điền trường đó | Chỉ số đầu vào quan trọng nhất: trường lỗi nhiều là trường cần sửa nhãn, gợi ý, hoặc chuẩn hóa thêm. | I3, L4, V3 |
| **Câu lỗi xuất hiện nhiều nhất** | Đầu vào | Đếm field_error theo trường + câu lỗi | Biết chính xác người dùng sai ở đâu: thiếu số 0, gõ nhầm tên miền, tệp quá lớn, ảnh HEIC… | V3, I9 |
| **Thời gian hoàn thành (trung vị)** | Đầu vào | Trung vị của (gửi thành công − bắt đầu), bỏ các phiên lưu nháp qua ngày | So với thời gian đã hứa ở "Trước khi bắt đầu". Lệch nhiều thì sửa form, hoặc sửa lời hứa. | F1, F2 |
| **Tỷ lệ tải tệp thất bại** | Đầu vào | Lần tải thất bại ÷ Lần tải, tách theo lý do | Lý do: sai định dạng, quá dung lượng, HEIC, mất mạng. Mỗi lý do có một cách sửa khác nhau. | U2, U5 |
| **Tỷ lệ gửi thất bại** | Đầu vào | Lần gửi thất bại ÷ Lần bấm gửi | Lỗi máy chủ, mất mạng, hết phiên. Mỗi lần thất bại là một nguy cơ mất hồ sơ. | V8, D3 |
| **Tỷ lệ hồ sơ trùng** | Đầu vào | Hồ sơ trùng email/SĐT ÷ Tổng hồ sơ | Dấu hiệu thiếu phản hồi khi gửi, hoặc trang xác nhận chưa đủ rõ. | B4, K1 |
| **Yêu cầu hỗ trợ trên 100 hồ sơ** | Đầu vào | Số email, cuộc gọi hỗ trợ ÷ Số hồ sơ × 100 | Trải nghiệm tốt nhất là người dùng không cần hỏi. Phân loại câu hỏi để biết sửa chỗ nào trong form. | K2, P2 |
| **Tỷ lệ hồ sơ cần bổ sung** | Đầu vào | Hồ sơ bị yêu cầu bổ sung ÷ Hồ sơ đã xét | Chất lượng dữ liệu đầu vào: hướng dẫn chưa rõ, hoặc kiểm tra chưa đủ ngay trong form. | U1, L4 |

<a id="su-kien"></a>
### Sự kiện cần gắn

| Sự kiện | Khi nào | Tham số |
| --- | --- | --- |
| `form_view` | Xem trang giới thiệu hoặc form | form_id, nguồn truy cập |
| `form_start` | Bấm "Bắt đầu đăng ký" hoặc chạm trường đầu tiên | form_id |
| `step_view` | Vào một bước | step |
| `field_error` | Một lỗi hiển thị tại trường | field, error_type, trigger (blur \| submit) |
| `step_complete` | Qua bước thành công | step, seconds_on_step |
| `file_upload` | Kết quả tải tệp | field, result (success \| fail), reason, size_mb |
| `draft_restore` | Khôi phục bản nháp | step, draft_age_hours |
| `submit_attempt` | Bấm gửi hồ sơ | errors_left |
| `submit_result` | Kết quả gửi | result (success \| fail), reason |
| `support_click` | Bấm liên hệ hỗ trợ | step |

<a id="nguon"></a>
## 12. Nguồn tham khảo

- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [GOV.UK · Error summary](https://design-system.service.gov.uk/components/error-summary/)
- [GOV.UK · Error message](https://design-system.service.gov.uk/components/error-message/)
- [GOV.UK · Check answers](https://design-system.service.gov.uk/patterns/check-answers/)
- [GOV.UK · Dates](https://design-system.service.gov.uk/patterns/dates/)
- [GOV.UK · Character count](https://design-system.service.gov.uk/components/character-count/)
- [GOV.UK · Question pages](https://design-system.service.gov.uk/patterns/question-pages/)
- [NN/g · Placeholders in form fields are harmful](https://www.nngroup.com/articles/form-design-placeholders/)
- [NN/g · Error-message guidelines](https://www.nngroup.com/articles/errors-forms-design-guidelines/)
- [NN/g · Marking required fields](https://www.nngroup.com/articles/required-fields/)
- [NN/g · Website forms usability](https://www.nngroup.com/articles/web-form-design/)
- [Luke Wroblewski · Inline validation in web forms](https://alistapart.com/article/inline-validation-in-web-forms/)
- [Baymard Institute · Checkout usability](https://baymard.com/research/checkout-usability)
- [Caroline Jarrett · The question protocol](https://www.uxmatters.com/mt/archives/2010/06/the-question-protocol-how-to-make-sure-every-form-field-is-necessary.php)
- [MDN · autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
- [MDN · inputmode](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode)
- [MDN · enterkeyhint](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/enterkeyhint)
- [web.dev · Sign-up form best practices](https://web.dev/articles/sign-up-form-best-practices)
- [web.dev · SMS OTP form best practices](https://web.dev/articles/sms-otp-form)
- [web.dev · Address form best practices](https://web.dev/articles/payment-and-address-form-best-practices)
- [W3C ARIA APG · Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [Adam Silver · Form Design Patterns](https://adamsilver.io/)

**Luật UX:**

- [Luật Postel](https://lawsofux.com/postels-law/)
- [Luật Hick](https://lawsofux.com/hicks-law/)
- [Luật Fitts](https://lawsofux.com/fittss-law/)
- [Luật Miller](https://lawsofux.com/millers-law/)
- [Luật Jakob](https://lawsofux.com/jakobs-law/)
- [Luật Tesler](https://lawsofux.com/teslers-law/)
- [Ngưỡng Doherty](https://lawsofux.com/doherty-threshold/)
- [Quy tắc Peak–End](https://lawsofux.com/peak-end-rule/)
- [Hiệu ứng Von Restorff](https://lawsofux.com/von-restorff-effect/)
- [Luật Gần nhau](https://lawsofux.com/law-of-proximity/)

---
_Tệp này được sinh tự động từ dữ liệu của bản web https://chuan-ux-form.vercel.app. Muốn sửa nội dung, sửa trong mã nguồn rồi xuất lại để hai bản luôn khớp._
