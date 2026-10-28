/* ============================================================
   NỘI DUNG: danh mục địa giới, câu chữ, trường, kiểm thử, bản mẫu
   ============================================================ */
const RULE_BY_ID = Object.fromEntries(RULES.map((r) => [r.id, r]));
const CAT_BY_ID = Object.fromEntries(CATS.map((c) => [c.id, c]));

/* 34 tỉnh/thành từ 01/07/2025 — kèm bí danh và tên tỉnh cũ đã sáp nhập */
const PROVINCES = [
  { n: 'Hà Nội', a: ['hn', 'ha noi', 'hanoi', 'thu do'] },
  { n: 'TP. Hồ Chí Minh', a: ['hcm', 'tphcm', 'tp hcm', 'ho chi minh', 'sai gon', 'saigon', 'sg', 'thanh pho ho chi minh'], o: ['Bình Dương', 'Bà Rịa – Vũng Tàu'] },
  { n: 'Hải Phòng', a: ['hp'], o: ['Hải Dương'] },
  { n: 'Đà Nẵng', a: ['dn', 'danang'], o: ['Quảng Nam'] },
  { n: 'Cần Thơ', a: ['ct'], o: ['Sóc Trăng', 'Hậu Giang'] },
  { n: 'Huế', a: ['thua thien hue', 'tt hue'] },
  { n: 'Lai Châu' }, { n: 'Điện Biên' }, { n: 'Sơn La' }, { n: 'Lạng Sơn' },
  { n: 'Quảng Ninh', a: ['qn', 'ha long'] }, { n: 'Thanh Hóa' }, { n: 'Nghệ An', a: ['vinh'] }, { n: 'Hà Tĩnh' }, { n: 'Cao Bằng' },
  { n: 'Tuyên Quang', o: ['Hà Giang'] },
  { n: 'Lào Cai', o: ['Yên Bái'] },
  { n: 'Thái Nguyên', o: ['Bắc Kạn'] },
  { n: 'Phú Thọ', o: ['Vĩnh Phúc', 'Hòa Bình'] },
  { n: 'Bắc Ninh', o: ['Bắc Giang'] },
  { n: 'Hưng Yên', o: ['Thái Bình'] },
  { n: 'Ninh Bình', o: ['Hà Nam', 'Nam Định'] },
  { n: 'Quảng Trị', o: ['Quảng Bình'] },
  { n: 'Quảng Ngãi', o: ['Kon Tum'] },
  { n: 'Gia Lai', o: ['Bình Định'] },
  { n: 'Khánh Hòa', a: ['nha trang'], o: ['Ninh Thuận'] },
  { n: 'Lâm Đồng', a: ['da lat'], o: ['Đắk Nông', 'Bình Thuận'] },
  { n: 'Đắk Lắk', a: ['daklak', 'dac lac'], o: ['Phú Yên'] },
  { n: 'Đồng Nai', o: ['Bình Phước'] },
  { n: 'Tây Ninh', o: ['Long An'] },
  { n: 'Vĩnh Long', o: ['Bến Tre', 'Trà Vinh'] },
  { n: 'Đồng Tháp', o: ['Tiền Giang'] },
  { n: 'Cà Mau', o: ['Bạc Liêu'] },
  { n: 'An Giang', o: ['Kiên Giang'] },
].sort((a, b) => a.n.replace('TP. ', '').localeCompare(b.n.replace('TP. ', ''), 'vi'));

/* Danh sách trường (mẫu, rút gọn) */
const SCHOOLS = [
  { n: 'Đại học Bách khoa Hà Nội', a: ['bk', 'bkhn', 'dhbk', 'hust', 'bach khoa'] },
  { n: 'Trường Đại học Bách khoa – ĐHQG TP.HCM', a: ['bk', 'bkhcm', 'hcmut', 'bach khoa'] },
  { n: 'Trường Đại học Bách khoa – Đại học Đà Nẵng', a: ['bk', 'bkdn', 'dut', 'bach khoa'] },
  { n: 'Trường Đại học Kinh tế Quốc dân', a: ['neu', 'ktqd'] },
  { n: 'Trường Đại học Ngoại thương', a: ['ftu', 'ngoai thuong'] },
  { n: 'Học viện Công nghệ Bưu chính Viễn thông', a: ['ptit', 'buu chinh'] },
  { n: 'Trường Đại học FPT', a: ['fpt'] },
  { n: 'Trường Đại học Khoa học Tự nhiên – ĐHQG Hà Nội', a: ['khtn', 'hus'] },
  { n: 'Trường Đại học Công nghệ – ĐHQG Hà Nội', a: ['uet'] },
  { n: 'Trường Đại học Kinh tế TP.HCM', a: ['ueh'] },
  { n: 'Trường Đại học Cần Thơ', a: ['ctu'] },
  { n: 'Trường Đại học RMIT Việt Nam', a: ['rmit'] },
  { n: 'Trường THPT chuyên Hà Nội – Amsterdam', a: ['ams', 'amsterdam'] },
  { n: 'Trường THPT Chu Văn An (Hà Nội)', a: ['cva', 'chu van an'] },
  { n: 'Trường THPT chuyên Lê Hồng Phong (TP.HCM)', a: ['lhp'] },
  { n: 'Trường Phổ thông Năng khiếu – ĐHQG TP.HCM', a: ['ptnk', 'nang khieu'] },
  { n: 'Trường THPT chuyên Lê Quý Đôn (Đà Nẵng)', a: ['lqd'] },
  { n: 'Trường THPT chuyên Phan Bội Châu (Nghệ An)', a: ['pbc'] },
];

/* ------------------------------------------------------------
   CÂU CHỮ MẪU
   {biến} là phần thay thế
   ------------------------------------------------------------ */
const TONE = [
  { t: `Hướng dẫn, đừng ra lệnh như máy`, bad: `Trường SĐT là bắt buộc.`, good: `Nhập số điện thoại` },
  { t: `Nói cách sửa, đừng chỉ nói là sai`, bad: `Số điện thoại không hợp lệ.`, good: `Số điện thoại cần có 10 chữ số, ví dụ 0912 345 678` },
  { t: `Không đổ lỗi cho người dùng`, bad: `Bạn đã nhập sai ngày sinh!`, good: `Ngày sinh phải là một ngày có thật` },
  { t: `Không mã lỗi, không thuật ngữ kỹ thuật`, bad: `Error 413: Payload too large`, good: `Tệp có dung lượng 24 MB, vượt giới hạn 20 MB` },
  { t: `Không IN HOA, không dấu chấm than`, bad: `VUI LÒNG ĐIỀN ĐẦY ĐỦ THÔNG TIN!!!`, good: `Cần sửa 3 mục trước khi tiếp tục` },
  { t: `Xin lỗi khi lỗi do hệ thống, ngắn gọn`, bad: `Rất xin lỗi quý khách vì sự bất tiện này, chúng tôi đang…`, good: `Xin lỗi, hệ thống đang gặp sự cố. Dữ liệu của bạn vẫn được giữ` },
];

const COPY = [
  { id: 'empty', n: 'Lỗi: bỏ trống', d: `Động từ đi theo loại trường: Nhập (ô chữ), Chọn (lựa chọn), Tải lên (tệp), Đồng ý (cam kết).`, items: [
    { t: `Nhập {tên trường}`, ex: `Nhập họ và tên` },
    { t: `Chọn {tên trường}`, ex: `Chọn tỉnh/thành phố` },
    { t: `Chọn {tên trường}`, ex: `Chọn hình thức tham gia`, ctx: `Nhóm radio` },
    { t: `Tải lên {tên tệp}`, ex: `Tải lên bài dự thi (PDF)` },
    { t: `Nhập ngày sinh`, ctx: `Cả ba ô ngày, tháng, năm đều trống` },
    { t: `Bạn cần đồng ý với {tên văn bản} để gửi hồ sơ`, ex: `Bạn cần đồng ý với Thể lệ cuộc thi để gửi hồ sơ` },
  ] },
  { id: 'format', n: 'Lỗi: sai định dạng', d: `Nói định dạng đúng và cho một ví dụ.`, items: [
    { t: `Nhập email đúng định dạng, ví dụ: ten@gmail.com` },
    { t: `Email cần có ký tự @, ví dụ: ten@gmail.com`, ctx: `Thiếu @` },
    { t: `Số điện thoại cần có 10 chữ số. Bạn đã nhập {n} chữ số`, ex: `Số điện thoại cần có 10 chữ số. Bạn đã nhập 9 chữ số` },
    { t: `Số điện thoại di động cần bắt đầu bằng 03, 05, 07, 08 hoặc 09` },
    { t: `Số căn cước gồm 12 chữ số. Bạn đã nhập {n} chữ số`, ex: `Số căn cước gồm 12 chữ số. Bạn đã nhập 11 chữ số` },
    { t: `Ngày sinh phải là một ngày có thật`, ctx: `Ví dụ 30/02` },
    { t: `Ngày sinh cần có {phần còn thiếu}`, ex: `Ngày sinh cần có năm` },
    { t: `Năm sinh cần có 4 chữ số, ví dụ 2008` },
    { t: `Nhập đường dẫn đầy đủ, ví dụ: behance.net/ten-ban` },
    { t: `Họ và tên không chứa chữ số` },
  ] },
  { id: 'range', n: 'Lỗi: giới hạn & phạm vi', d: `Nêu giới hạn và giá trị hiện tại để người dùng biết cần sửa bao nhiêu.`, items: [
    { t: `{Tên trường} tối đa {n} ký tự. Hiện có {m} ký tự`, ex: `Tên ý tưởng tối đa 120 ký tự. Hiện có 134 ký tự` },
    { t: `{Tên trường} tối đa {n} từ. Hiện có {m} từ`, ex: `Mô tả tối đa 300 từ. Hiện có 327 từ` },
    { t: `{Tên trường} cần ít nhất {n} từ`, ex: `Mô tả cần ít nhất 30 từ` },
    { t: `Thí sinh cần sinh trong khoảng {từ ngày} – {đến ngày} (từ {min} đến {max} tuổi tính đến {ngày tham chiếu})`, ex: `Thí sinh cần sinh trong khoảng 01/12/1995 – 30/11/2011 (từ 15 đến 30 tuổi tính đến 30/11/2026)` },
    { t: `Ngày sinh phải trước hôm nay` },
    { t: `Chọn tối đa {n} {mục}`, ex: `Chọn tối đa 3 lĩnh vực` },
    { t: `Đội cần ít nhất {n} thành viên. Hiện có {m}`, ex: `Đội cần ít nhất 2 thành viên. Hiện có 1` },
  ] },
  { id: 'file', n: 'Lỗi: tệp', d: `Luôn nêu tên tệp người dùng đã chọn, để họ biết tệp nào có vấn đề.`, items: [
    { t: `Tệp "{tên tệp}" không đúng định dạng. Hãy tải lên tệp {định dạng}`, ex: `Tệp "bai-du-thi.docx" không đúng định dạng. Hãy tải lên tệp PDF` },
    { t: `Tệp "{tên tệp}" có dung lượng {x} MB, vượt giới hạn {y} MB`, ex: `Tệp "chan-dung.jpg" có dung lượng 8,4 MB, vượt giới hạn 5 MB` },
    { t: `Tệp "{tên tệp}" trống (0 byte). Hãy kiểm tra tệp mở được trên máy rồi tải lên lại` },
    { t: `Ảnh "{tên tệp}" ở định dạng HEIC. Hãy chọn ảnh JPG/PNG, hoặc trên iPhone vào Cài đặt > Camera > Định dạng > Tương thích nhất` },
    { t: `Bạn chỉ có thể tải lên tối đa {n} tệp` },
    { t: `Tải lên bị gián đoạn do mất kết nối. Thử lại`, ctx: `Kèm nút "Thử lại"` },
    { t: `Đợi tệp tải lên xong rồi tiếp tục`, ctx: `Bấm Tiếp tục khi tệp đang tải` },
  ] },
  { id: 'server', n: 'Lỗi: hệ thống & máy chủ', d: `Nói rõ dữ liệu có còn không, hồ sơ đã gửi hay chưa, và bước tiếp theo.`, items: [
    { t: `Email này đã được dùng để đăng ký. Đăng nhập để xem hồ sơ, hoặc dùng email khác` },
    { t: `Hạng mục {tên} vừa đủ số lượng. Bạn có thể chọn hạng mục khác, dữ liệu đã nhập vẫn được giữ` },
    { t: `Chưa gửi được hồ sơ do mất kết nối. Dữ liệu của bạn vẫn được giữ. Thử lại` },
    { t: `Xin lỗi, hệ thống đang gặp sự cố nên hồ sơ chưa được gửi. Dữ liệu vẫn được giữ. Thử lại sau ít phút hoặc liên hệ {hotline}` },
    { t: `Phiên làm việc sẽ hết hạn sau 2 phút. Bấm Tiếp tục làm việc để không mất dữ liệu` },
    { t: `Mã xác thực chưa đúng. Kiểm tra lại tin nhắn hoặc gửi lại mã` },
    { t: `Mã đã hết hạn. Gửi lại mã mới` },
  ] },
  { id: 'summary', n: 'Tóm tắt lỗi', d: `Tiêu đề nói số lượng; danh sách dùng lại đúng câu lỗi tại từng trường.`, items: [
    { t: `Cần sửa {n} mục trước khi tiếp tục`, ex: `Cần sửa 3 mục trước khi tiếp tục` },
    { t: `Cần sửa {n} mục trước khi gửi hồ sơ` },
  ] },
  { id: 'hint', n: 'Gợi ý dưới nhãn', d: `Ngắn, cụ thể, ưu tiên ví dụ. Hiển thị sẵn, không giấu trong tooltip.`, items: [
    { t: `Ví dụ: 0912 345 678`, ctx: `Số điện thoại` },
    { t: `Dùng email bạn thường xuyên kiểm tra. Xác nhận và kết quả sẽ được gửi qua email này`, ctx: `Email` },
    { t: `Ví dụ: 27 03 2008`, ctx: `Ngày sinh` },
    { t: `12 chữ số in trên thẻ căn cước`, ctx: `Số căn cước` },
    { t: `JPG hoặc PNG, tối đa 5 MB, tỷ lệ 3:4, nền sáng`, ctx: `Ảnh chân dung` },
    { t: `PDF, tối đa 20 MB. Không ghi tên thí sinh trong bài`, ctx: `Bài dự thi` },
    { t: `Tối đa 300 từ`, ctx: `Mô tả` },
    { t: `Dùng để xác minh danh tính khi trao giải. Không chia sẻ cho bên thứ ba`, ctx: `Trường nhạy cảm` },
    { t: `Gõ tên trường hoặc tên viết tắt, ví dụ: bk, neu, ams`, ctx: `Ô tìm trường` },
  ] },
  { id: 'button', n: 'Nút', d: `Động từ + đối tượng. Viết hoa chữ đầu. Một nút chính mỗi màn hình.`, items: [
    { t: `Bắt đầu đăng ký`, ctx: `Trang giới thiệu` },
    { t: `Tiếp tục`, ctx: `Giữa các bước` },
    { t: `Quay lại`, ctx: `Nút phụ` },
    { t: `Lưu và tiếp tục sau`, ctx: `Nút phụ, form dài` },
    { t: `Lưu và quay lại trang xem lại`, ctx: `Khi sửa từ trang xem lại` },
    { t: `Gửi hồ sơ đăng ký`, ctx: `Nút cuối` },
    { t: `Sửa`, ctx: `Trên trang xem lại, kèm chữ ẩn "họ và tên" cho trình đọc màn hình` },
    { t: `Chọn tệp · Thay tệp · Xóa`, ctx: `Tải tệp` },
    { t: `Thêm thành viên`, ctx: `Đăng ký theo đội` },
    { t: `Thử lại`, ctx: `Sau lỗi mạng` },
  ], avoid: [`OK`, `Submit`, `Xác nhận`, `Click vào đây`, `GỬI NGAY!`, `Nhập lại`] },
  { id: 'status', n: 'Trạng thái', d: `Bình tĩnh, ngắn. Có giờ cụ thể khi nói về việc lưu.`, items: [
    { t: `Đang lưu…` },
    { t: `Đã lưu nháp lúc {giờ}`, ex: `Đã lưu nháp lúc 14:32` },
    { t: `Chưa lưu được, đang thử lại…` },
    { t: `Đang tải lên {x}% · {a} / {b} MB`, ex: `Đang tải lên 45% · 9 / 20 MB` },
    { t: `Đang gửi hồ sơ…` },
    { t: `Vẫn đang gửi, vui lòng không đóng trang` },
    { t: `Đã gửi lại mã. Gửi lại sau {n} giây`, ex: `Đã gửi lại mã. Gửi lại sau 60 giây` },
    { t: `Đã xóa {tên}. Hoàn tác`, ex: `Đã xóa Trần Bảo Châu. Hoàn tác` },
  ] },
  { id: 'success', n: 'Thành công & xác nhận', d: `Khoảnh khắc kết thúc — thứ người dùng sẽ nhớ. Cho họ mã hồ sơ và bước tiếp theo.`, items: [
    { t: `Đăng ký thành công`, ctx: `Tiêu đề trang xác nhận` },
    { t: `Mã hồ sơ của bạn: {mã}`, ex: `Mã hồ sơ của bạn: YT26-04821` },
    { t: `Chúng tôi đã gửi email xác nhận tới {email}. Nếu không thấy, hãy kiểm tra thư mục Spam hoặc Quảng cáo` },
    { t: `Tiếp theo: Ban tổ chức công bố danh sách vào vòng 2 ngày {ngày}` },
    { t: `Bạn có thể sửa hồ sơ đến {giờ}, {ngày}`, ex: `Bạn có thể sửa hồ sơ đến 23:59, 30/11/2026` },
    { t: `[{Tên cuộc thi}] Xác nhận đăng ký – Mã hồ sơ {mã}`, ctx: `Tiêu đề email` },
  ] },
  { id: 'portal', n: 'Trạng thái cổng đăng ký', d: `Nói rõ trạng thái trước khi người dùng bắt đầu điền.`, items: [
    { t: `Cổng đăng ký mở lúc {giờ} ngày {ngày}`, ex: `Cổng đăng ký mở lúc 08:00 ngày 01/11/2026` },
    { t: `Hạn chót: {giờ}, {ngày} (giờ Việt Nam)`, ex: `Hạn chót: 23:59, 30/11/2026 (giờ Việt Nam)` },
    { t: `Còn {n} giờ để nộp hồ sơ` },
    { t: `Đã hết hạn đăng ký lúc {giờ} ngày {ngày}` },
    { t: `Hạng mục {tên} đã đủ số lượng. Đăng ký danh sách chờ` },
  ] },
  { id: 'consent', n: 'Đồng ý & cam kết', d: `Mỗi mục đích một ô. Không chọn sẵn. Ghi rõ "(không bắt buộc)" khi tùy chọn.`, items: [
    { t: `Tôi đã đọc và đồng ý với Thể lệ cuộc thi` },
    { t: `Tôi đồng ý để Ban tổ chức xử lý dữ liệu cá nhân theo Chính sách bảo mật, cho mục đích tổ chức cuộc thi` },
    { t: `Tôi muốn nhận tin về các cuộc thi và sự kiện tiếp theo (không bắt buộc)` },
    { t: `Tôi cam kết tác phẩm là sáng tạo của tôi/đội tôi và chưa đoạt giải ở cuộc thi khác` },
    { t: `Tôi là cha, mẹ hoặc người giám hộ hợp pháp và đồng ý cho thí sinh tham gia cuộc thi`, ctx: `Thí sinh dưới 18 tuổi` },
  ] },
  { id: 'intro', n: 'Trước khi bắt đầu', d: `Đặt kỳ vọng: thời gian, tài liệu, điều kiện, hạn chót.`, items: [
    { t: `Mất khoảng {n} phút, gồm {k} bước`, ex: `Mất khoảng 8 phút, gồm 4 bước` },
    { t: `Bạn cần chuẩn bị: {danh sách tài liệu kèm quy cách}` },
    { t: `Dành cho {đối tượng} từ {min} đến {max} tuổi` },
    { t: `Bản nháp được tự động lưu. Bạn có thể tạm dừng và quay lại sau` },
    { t: `Các trường có dấu * là bắt buộc` },
  ] },
];

/* ------------------------------------------------------------
   KỊCH BẢN KIỂM THỬ — thử như người dùng thật
   ------------------------------------------------------------ */
const TESTS = [
  { id: 't1', t: `Chỉ dùng bàn phím`, how: `Rút chuột ra. Tab qua toàn bộ form, chọn radio bằng phím mũi tên, mở danh sách bằng phím, gửi bằng Enter.`, exp: `Focus luôn nhìn thấy, thứ tự hợp lý, không bị kẹt ở điều khiển nào.`, r: ['A1', 'A2'] },
  { id: 't2', t: `Bấm gửi khi form trống`, how: `Mở form, không nhập gì, bấm Tiếp tục/Gửi.`, exp: `Có tóm tắt lỗi nhận focus; mỗi liên kết đưa tới đúng ô; lỗi tại từng trường nói rõ cách sửa.`, r: ['V4', 'V3'] },
  { id: 't3', t: `Dán dữ liệu "bẩn"`, how: `Dán SĐT "+84 912.345.678", email có khoảng trắng ở cuối, CCCD "001 203 004 567".`, exp: `Được chấp nhận và tự chuẩn hóa, không báo lỗi định dạng.`, r: ['I3', 'I9'] },
  { id: 't4', t: `Tên dài, có dấu, có dấu nháy`, how: `Nhập "Tôn Nữ Hoàng Bảo Ngọc Phương Thảo", "H'Lan Niê", "Nguyễn  Văn   An" (thừa khoảng trắng).`, exp: `Chấp nhận tất cả; khoảng trắng thừa được gộp; hiển thị đúng ở trang xem lại và email.`, r: ['I6'] },
  { id: 't5', t: `Tải lại trang giữa chừng`, how: `Điền tới bước 3, nhấn F5 hoặc vuốt tải lại.`, exp: `Dữ liệu còn nguyên hoặc được hỏi khôi phục bản nháp.`, r: ['D1', 'V5'] },
  { id: 't6', t: `Mất mạng khi bấm gửi`, how: `Bật chế độ máy bay (hoặc DevTools → Offline) rồi bấm Gửi.`, exp: `Thông báo rõ chưa gửi được, dữ liệu vẫn còn, có nút Thử lại.`, r: ['V8', 'V5'] },
  { id: 't7', t: `Bấm gửi liên tục`, how: `Bấm nút Gửi 4–5 lần thật nhanh.`, exp: `Nút chuyển "Đang gửi…" ngay; chỉ một hồ sơ, một email xác nhận được tạo.`, r: ['B4'] },
  { id: 't8', t: `Tệp sai và tệp quá lớn`, how: `Chọn tệp .docx thay cho PDF; ảnh 12 MB; tệp 0 byte; ảnh HEIC từ iPhone.`, exp: `Lỗi hiện ngay khi chọn, nêu tên tệp, lý do, cách khắc phục; ảnh lớn được tự tối ưu nếu có thể.`, r: ['U1', 'U2', 'U5'] },
  { id: 't9', t: `Nút Back của trình duyệt`, how: `Ở bước 3, bấm Back của trình duyệt, rồi Forward.`, exp: `Về bước 2 với dữ liệu còn nguyên; không thoát khỏi form.`, r: ['F6', 'V5'] },
  { id: 't10', t: `Màn hình 360px và phóng to 200%`, how: `Thu cửa sổ còn 360px; hoặc phóng to trình duyệt 200%.`, exp: `Không cắt chữ, không cuộn ngang, nút vẫn bấm được.`, r: ['M4', 'F5'] },
  { id: 't11', t: `Trình đọc màn hình`, how: `Bật VoiceOver (iOS/macOS) hoặc TalkBack (Android). Đi qua từng trường, gây một lỗi.`, exp: `Đọc đúng nhãn, "bắt buộc", gợi ý; lỗi được đọc khi xuất hiện; tóm tắt lỗi được thông báo.`, r: ['V9', 'A2', 'A6'] },
  { id: 't12', t: `Tự động điền của trình duyệt`, how: `Dùng autofill của Chrome/Safari với hồ sơ đã lưu.`, exp: `Họ tên, email, SĐT, địa chỉ được điền đúng ô.`, r: ['I2'] },
  { id: 't13', t: `Trên điện thoại thật`, how: `Mở trên iPhone và một máy Android tầm trung, dùng 4G.`, exp: `Bàn phím đúng loại; ô không bị che; không tự phóng to; tải nhanh.`, r: ['I1', 'M1', 'M2', 'M4'] },
  { id: 't14', t: `Gõ nhầm tên miền email`, how: `Nhập "minh.anh@gmial.com", "lan@yahoo.con".`, exp: `Có gợi ý sửa "gmail.com", "yahoo.com", bấm một lần là sửa.`, r: ['I9'] },
  { id: 't15', t: `Để form mở thật lâu`, how: `Điền một nửa, để yên 30 phút, rồi gửi.`, exp: `Có cảnh báo trước khi hết phiên; không mất dữ liệu.`, r: ['D3'] },
  { id: 't16', t: `Đăng ký lần hai cùng email`, how: `Gửi hồ sơ, rồi đăng ký lại với cùng email/SĐT.`, exp: `Báo đã đăng ký ngay khi rời ô email, có đường dẫn đăng nhập/xem hồ sơ.`, r: ['V8', 'V1'] },
  { id: 't17', t: `Tìm tỉnh không dấu, tên cũ`, how: `Gõ "da nang", "hcm", "binh duong" vào ô Tỉnh/Thành phố.`, exp: `Ra đúng kết quả; tên tỉnh cũ gợi ý tỉnh/thành mới.`, r: ['C2', 'C3'] },
  { id: 't18', t: `Giao diện tối, tương phản cao`, how: `Bật giao diện tối của hệ điều hành; bật chế độ tương phản cao (Windows).`, exp: `Viền ô, lỗi, focus vẫn nhìn rõ; không có chữ "biến mất".`, r: ['A3'] },
];

/* ------------------------------------------------------------
   BẢN MẪU CẤU TRÚC theo loại form
   lv: req = bắt buộc · opt = không bắt buộc · cond = có điều kiện · later = hỏi sau · derive = suy ra, không hỏi
   ------------------------------------------------------------ */
const BLUEPRINTS = [
  { id: 'contest', n: 'Đăng ký dự thi', ic: 'flag', ex: `Cuộc thi ý tưởng, sáng tác, khởi nghiệp, viết`,
    model: `Nhiều bước: 4 bước + trang xem lại`, time: `8–12 phút`,
    steps: [
      { n: 'Trang giới thiệu', note: `Trạng thái cổng, hạn chót, điều kiện, tài liệu cần chuẩn bị`, f: [] },
      { n: 'Thông tin thí sinh', f: [['Họ và tên', 'req'], ['Ngày sinh', 'req', 'Kiểm tra độ tuổi'], ['Người giám hộ', 'cond', 'Chỉ khi dưới 18 tuổi'], ['Ảnh chân dung', 'req', 'Tự nén, cho cắt 3:4'], ['Số căn cước', 'later', 'Hỏi khi trao giải'], ['Tuổi', 'derive', 'Tính từ ngày sinh']] },
      { n: 'Liên hệ', f: [['Email', 'req', 'Gợi ý sửa tên miền'], ['Số điện thoại', 'req'], ['Tỉnh/Thành phố', 'req', '34 tỉnh, tìm không dấu'], ['Trường/Đơn vị', 'opt'], ['Địa chỉ chi tiết', 'later', 'Hỏi khi gửi giải thưởng']] },
      { n: 'Bài dự thi', f: [['Hạng mục', 'req', 'Thẻ lựa chọn có mô tả'], ['Hình thức: cá nhân/đội', 'req'], ['Thành viên đội', 'cond', '2–5 người'], ['Tên ý tưởng', 'req'], ['Mô tả', 'req', 'Đếm từ'], ['Tệp bài dự thi', 'req', 'PDF']] },
      { n: 'Xem lại và gửi', f: [['Đồng ý thể lệ', 'req'], ['Nhận tin', 'opt'], ['Đồng ý của người giám hộ', 'cond']] },
      { n: 'Xác nhận', note: `Mã hồ sơ, email xác nhận, các mốc tiếp theo, thêm vào lịch`, f: [] },
    ],
    keys: ['F1', 'F2', 'D1', 'U2', 'R1', 'K1', 'T3'],
    traps: [`Hỏi CCCD và địa chỉ đầy đủ ngay vòng sơ loại.`, `Bài dự thi chỉ tải lên khi bấm Gửi cuối cùng.`, `Không nói rõ bài thi có được ghi tên thí sinh hay không (chấm ẩn danh).`, `Không có trang xác nhận, chỉ có toast "Thành công".`] },
  { id: 'apply', n: 'Hồ sơ xét tuyển, ứng tuyển', ic: 'file', ex: `Học bổng, chương trình đào tạo, tuyển dụng, tài trợ`,
    model: `Nhiều bước + lưu nháp bắt buộc + theo dõi trạng thái`, time: `20–45 phút, có thể chia nhiều lần`,
    steps: [
      { n: 'Kiểm tra điều kiện nhanh', note: `3–5 câu Có/Không trước khi vào form dài. Không đủ điều kiện thì báo ngay, đừng để điền 30 phút`, f: [] },
      { n: 'Thông tin cá nhân', f: [['Họ và tên', 'req'], ['Ngày sinh', 'req'], ['Email', 'req'], ['Số điện thoại', 'req'], ['Tỉnh/Thành phố', 'req']] },
      { n: 'Học vấn & kinh nghiệm', f: [['Trường/Đơn vị', 'req', 'Tìm kiếm, cho nhập tự do'], ['Quá trình học tập', 'req', 'Lặp lại nhiều mục, thêm/xóa'], ['Kinh nghiệm', 'opt']] },
      { n: 'Tài liệu', f: [['CV', 'req', 'PDF'], ['Bảng điểm', 'req'], ['Thư giới thiệu', 'opt', 'Hoặc gửi lời mời người giới thiệu tự nộp']] },
      { n: 'Câu hỏi tự luận', f: [['Bài luận 1', 'req', 'Đếm từ, tự lưu'], ['Bài luận 2', 'req']] },
      { n: 'Xem lại và gửi', f: [['Cam kết thông tin trung thực', 'req'], ['Đồng ý xử lý dữ liệu', 'req']] },
      { n: 'Theo dõi hồ sơ', note: `Trạng thái: Đã nhận → Đang xét → Phỏng vấn → Kết quả; cho bổ sung khi "Cần bổ sung"`, f: [] },
    ],
    keys: ['F1', 'D1', 'D2', 'D3', 'U3', 'K3', 'R1'],
    traps: [`Không có lưu nháp cho bài luận 500 từ.`, `Phiên đăng nhập hết hạn sau 15 phút, mất bài luận.`, `Cho điền hết rồi mới báo "không đủ điều kiện".`, `Bắt người dùng nhập lại thông tin đã có trong CV.`] },
  { id: 'event', n: 'Đăng ký sự kiện, giải chạy', ic: 'calendar', ex: `Workshop, hội thảo, giải chạy, triển lãm`,
    model: `Một trang (hoặc 2 bước nếu có thanh toán)`, time: `2–5 phút`,
    steps: [
      { n: 'Chọn hạng mục', f: [['Cự ly / phiên / loại vé', 'req', 'Thẻ lựa chọn: giá, số suất còn lại, điều kiện']] },
      { n: 'Thông tin người tham gia', f: [['Họ và tên', 'req'], ['Email', 'req'], ['Số điện thoại', 'req'], ['Ngày sinh', 'cond', 'Chỉ khi chia nhóm tuổi'], ['Giới tính', 'cond', 'Chỉ khi chia giải nam/nữ'], ['Size áo', 'cond', 'Có bảng size ngay tại chỗ'], ['Liên hệ khẩn cấp', 'cond', 'Giải chạy, hoạt động thể chất']] },
      { n: 'Thanh toán (nếu có)', note: `Tổng tiền rõ ràng trước khi bấm; giữ suất trong thời gian thanh toán, có đếm ngược`, f: [] },
      { n: 'Xác nhận', note: `Vé/mã QR, thêm vào lịch, chỉ đường, những gì cần mang`, f: [] },
    ],
    keys: ['F3', 'C6', 'C1', 'B4', 'K1', 'T4'],
    traps: [`Hết suất nhưng vẫn cho điền form.`, `Hỏi giới tính, ngày sinh khi không chia giải theo nhóm.`, `Không cho thêm vào lịch, không có mã vé trên email.`] },
  { id: 'quick', n: 'Đăng ký nhanh', ic: 'spark', ex: `Nhận bản tin, bình chọn, nhận quà, danh sách chờ`,
    model: `Một trang, 1–3 trường, đặt ngay trong nội dung`, time: `dưới 30 giây`,
    steps: [
      { n: 'Form ngắn', f: [['Email hoặc Số điện thoại', 'req', 'Chỉ một kênh liên hệ'], ['Họ và tên', 'opt'], ['Nhận tin', 'req', 'Chính là mục đích của form, nói rõ tần suất']] },
      { n: 'Xác nhận tại chỗ', note: `Thay form bằng thông điệp thành công ngay tại vị trí đó; email xác nhận (double opt-in nếu là bản tin)`, f: [] },
    ],
    keys: ['F2', 'B1', 'B4', 'P1'],
    traps: [`Popup đăng ký bản tin che nội dung ngay khi vào trang.`, `Hỏi 6 trường chỉ để gửi bản tin.`] },
];

/* Mẫu văn bản dài để thử bộ đếm (~320 từ) */
const LONG_TEXT = (() => {
  const p = `Ý tưởng của nhóm là một ứng dụng giúp học sinh vùng cao đăng ký học bổng và cuộc thi bằng điện thoại cũ, sóng yếu. Ứng dụng lưu nháp khi mất mạng, nén ảnh giấy tờ trước khi gửi, đọc to hướng dẫn bằng tiếng Việt và tiếng dân tộc, đồng thời nhắc hạn chót qua tin nhắn. Chúng tôi đã thử nghiệm với ba mươi học sinh tại hai trường và ghi nhận thời gian hoàn thành hồ sơ giảm gần một nửa.`;
  return Array(4).fill(p).join('\n\n') + '\n\n' + p.split(' ').slice(0, 20).join(' ') + '.';
})();

/* ------------------------------------------------------------
   MINH HỌA TĨNH "Nên / Không nên"
   ------------------------------------------------------------ */
const MK = {
  f: (l, v = '', o = {}) => `<div class="mk-f ${o.err ? 'err' : ''}"><div class="mk-l">${l}${o.req ? ' <b class="mk-req">*</b>' : ''}${o.opt ? ' <span class="mk-opt">(không bắt buộc)</span>' : ''}</div>${o.hint ? `<div class="mk-h">${o.hint}</div>` : ''}${o.err ? `<div class="mk-e">${ic('alert', 14)}${o.err}</div>` : ''}<div class="mk-i ${o.ph ? 'ph' : ''} ${o.w || ''}">${v}</div></div>`,
  btn: (t, k = '') => `<span class="mk-b ${k}">${t}</span>`,
};
const MOCKS = {
  prepare: {
    do: `<div class="mk-card"><div class="mk-t">Trước khi bắt đầu</div>
      <ul class="mk-ul"><li>${ic('clock', 14)} Khoảng 8 phút, gồm 4 bước</li><li>${ic('image', 14)} Ảnh chân dung: JPG/PNG, tối đa 5 MB</li><li>${ic('file', 14)} Bài dự thi: PDF, tối đa 20 MB</li><li>${ic('calendar', 14)} Hạn chót: 23:59, 30/11/2026</li></ul>${MK.btn('Bắt đầu đăng ký')}</div>`,
    dont: `<div class="mk-card"><div class="mk-cap">Bước 3/4</div>${MK.f('Bản scan đơn có chữ ký (PDF)', '', { req: true })}<div class="mk-note">Người dùng chỉ biết cần tệp này khi đã điền xong 2 bước.</div></div>`,
  },
  onecol: {
    do: `<div class="mk-card mk-path">${MK.f('<i>1</i> Họ và tên')}${MK.f('<i>2</i> Email')}${MK.f('<i>3</i> Số điện thoại')}${MK.f('<i>4</i> Tỉnh/Thành phố')}</div>`,
    dont: `<div class="mk-card mk-path"><div class="mk-2col">${MK.f('<i>1</i> Họ và tên')}${MK.f('<i>2</i> Email')}${MK.f('<i>3</i> Số điện thoại')}${MK.f('<i>4</i> Tỉnh/Thành phố')}</div><div class="mk-note">Mắt đi zíc-zắc; cột phải dễ bị bỏ sót.</div></div>`,
  },
  stepper: {
    do: `<div class="mk-card"><div class="mk-cap">Bước 2/4</div><div class="mk-t" style="margin:2px 0 8px">Thông tin liên hệ</div><div class="mk-bar"><i class="on"></i><i class="on"></i><i></i><i></i></div><div class="mk-steps"><span class="done">Thí sinh</span><span class="cur">Liên hệ</span><span>Bài dự thi</span><span>Xem lại</span></div></div>`,
    dont: `<div class="mk-card"><div class="mk-dots"><i class="on"></i><i class="on"></i><i></i><i></i></div><div class="mk-note">Bốn chấm không tên: còn bao lâu, bước sau hỏi gì?</div></div>`,
  },
  required: {
    do: `<div class="mk-card"><div class="mk-cap">Các trường có dấu * là bắt buộc.</div>${MK.f('Họ và tên', '', { req: true })}${MK.f('Trường đang học', '', { opt: true })}</div>`,
    dont: `<div class="mk-card">${MK.f('Họ và tên')}${MK.f('Trường đang học')}<div class="mk-banner">Vui lòng điền đầy đủ thông tin!</div></div>`,
  },
  labels: {
    do: `<div class="mk-card">${MK.f('Số điện thoại')}${MK.f('Trường đang học')}${MK.f('Số căn cước (CCCD)')}</div>`,
    dont: `<div class="mk-card">${MK.f('SĐT LH CỦA THÍ SINH')}${MK.f('Đơn vị chủ quản')}${MK.f('Mã định danh đối tượng')}</div>`,
  },
  errfield: {
    do: `<div class="mk-card">${MK.f('Số điện thoại', '0912 345', { err: 'Số điện thoại cần có 10 chữ số. Bạn đã nhập 7 chữ số', hint: 'Ví dụ: 0912 345 678' })}</div>`,
    dont: `<div class="mk-card"><div class="mk-toast">Có lỗi xảy ra</div><div class="mk-f"><div class="mk-l">Số điện thoại</div><div class="mk-i red">0912 345</div></div></div>`,
  },
  errcopy: {
    do: `<ul class="mk-list good"><li>Nhập số điện thoại</li><li>Số điện thoại cần có 10 chữ số, ví dụ 0912 345 678</li><li>Tệp "bai-thi.docx" không đúng định dạng. Hãy tải lên tệp PDF</li><li>Ngày sinh phải là một ngày có thật</li></ul>`,
    dont: `<ul class="mk-list bad"><li>Trường này là bắt buộc!</li><li>Số điện thoại không hợp lệ</li><li>ERR_INVALID_FILE_TYPE</li><li>Bạn đã nhập sai ngày sinh</li></ul>`,
  },
  buttons: {
    do: `<div class="mk-card mk-row">${MK.btn('Gửi hồ sơ đăng ký')}${MK.btn('Tiếp tục')}${MK.btn('Lưu nháp', 'sec')}</div>`,
    dont: `<div class="mk-card mk-row">${MK.btn('OK')}${MK.btn('SUBMIT')}${MK.btn('Xác nhận')}</div>`,
  },
  hierarchy: {
    do: `<div class="mk-card mk-row">${MK.btn('Tiếp tục')}<span class="mk-link">Lưu nháp</span></div>`,
    dont: `<div class="mk-card mk-row">${MK.btn('Gửi')}${MK.btn('Nhập lại')}</div><div class="mk-note">Hai nút ngang nhau; bấm nhầm "Nhập lại" là mất hết.</div>`,
  },
  cards: {
    do: `<div class="mk-card"><div class="mk-l">Hạng mục dự thi <b class="mk-req">*</b></div><div class="mk-cards"><div class="mk-cardopt on"><b>Công nghệ & AI</b><span>Giải pháp ứng dụng công nghệ cho đời sống</span><em>Còn 120 suất</em></div><div class="mk-cardopt"><b>Môi trường & Đô thị</b><span>Sống xanh, giao thông, nước sạch</span><em>Còn 64 suất</em></div><div class="mk-cardopt dis"><b>Ý tưởng nhí</b><span>Dành cho thí sinh dưới 15 tuổi</span><em>Không phù hợp độ tuổi của bạn</em></div></div></div>`,
    dont: `<div class="mk-card">${MK.f('Hạng mục', 'Chọn hạng mục ▾', { ph: true })}<div class="mk-note">Điều kiện từng hạng mục nằm ở trang thể lệ khác.</div></div>`,
  },
  upreq: {
    do: `<div class="mk-card"><div class="mk-l">Bài dự thi <b class="mk-req">*</b></div><div class="mk-h">PDF, tối đa 20 MB. Không ghi tên thí sinh trong bài.</div><div class="mk-drop">${ic('upload', 16)} Kéo thả tệp vào đây hoặc ${MK.btn('Chọn tệp', 'sec')}</div></div>`,
    dont: `<div class="mk-card"><div class="mk-l">File</div><div class="mk-row"><span class="mk-b sec">Choose file</span><span class="mk-h">No file chosen</span></div><div class="mk-banner">File không hợp lệ</div></div>`,
  },
  review: {
    do: `<div class="mk-card"><div class="mk-t">Liên hệ</div><dl class="mk-dl"><dt>Email</dt><dd>minh.anh@gmail.com</dd><a>Sửa</a><dt>Số điện thoại</dt><dd>0912 345 678</dd><a>Sửa</a><dt>Tỉnh/Thành phố</dt><dd>Đà Nẵng</dd><a>Sửa</a></dl></div>`,
    dont: `<div class="mk-card"><div class="mk-t">Bạn có chắc chắn muốn gửi?</div><div class="mk-row">${MK.btn('Có')}${MK.btn('Không', 'sec')}</div><div class="mk-note">Không có gì để rà lại.</div></div>`,
  },
  consent: {
    do: `<div class="mk-card"><label class="mk-chk"><i></i>Tôi đã đọc và đồng ý với <u>Thể lệ cuộc thi</u> <b class="mk-req">*</b></label><label class="mk-chk"><i></i>Tôi muốn nhận tin về các cuộc thi tiếp theo <span class="mk-opt">(không bắt buộc)</span></label></div>`,
    dont: `<div class="mk-card"><label class="mk-chk"><i class="on"></i>Tôi đồng ý với điều khoản sử dụng, chính sách bảo mật và nhận thông tin khuyến mãi từ đối tác</label></div>`,
  },
  confirm: {
    do: `<div class="mk-card"><div class="mk-success">${ic('ok', 22)}<b>Đăng ký thành công</b></div><div class="mk-h">Mã hồ sơ</div><div class="mk-code">YT26-04821</div><ul class="mk-ul"><li>15/12 · Công bố vòng 2</li><li>10/01 · Chung kết</li></ul></div>`,
    dont: `<div class="mk-card"><div class="mk-toast ok">Thành công!</div>${MK.f('Họ và tên')}${MK.f('Email')}<div class="mk-note">Toast biến mất sau 3 giây, form trống hiện lại.</div></div>`,
  },
  portal: {
    do: `<div class="mk-card"><div class="mk-pill">Đã đóng</div><div class="mk-t" style="margin-top:6px">Đã hết hạn đăng ký</div><div class="mk-h">Cổng đã đóng lúc 23:59 ngày 30/11/2026. Chung kết diễn ra ngày 10/01/2027.</div></div>`,
    dont: `<div class="mk-card">${MK.f('Họ và tên', 'Nguyễn Minh Anh')}${MK.btn('Gửi')}<div class="mk-banner">Đã hết thời gian đăng ký</div></div>`,
  },
  deadline: {
    do: `<div class="mk-card"><div class="mk-row">${ic('calendar', 16)}<b>Hạn chót: 23:59, 30/11/2026</b></div><div class="mk-h">Giờ Việt Nam (GMT+7) · Còn 33 ngày</div></div>`,
    dont: `<div class="mk-card"><b>Deadline: 30/11</b></div>`,
  },
  mask: {
    do: `<div class="mk-card"><dl class="mk-dl two"><dt>Số căn cước</dt><dd>********4567</dd><dt>Số điện thoại</dt><dd>0912 *** 678</dd></dl></div>`,
    dont: `<div class="mk-card"><dl class="mk-dl two"><dt>Số căn cước</dt><dd>001203004567</dd><dt>Số điện thoại</dt><dd>0912345678</dd></dl></div>`,
  },
};
