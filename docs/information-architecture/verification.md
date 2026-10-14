# Kiểm tra luồng website Lavita

Ngày 14.10.2026, luồng ưu tiên là **dịch vụ → dự án cùng phạm vi PCCC → liên hệ giữ ngữ cảnh**. Cấu trúc và nguồn hướng dẫn tại [information-architecture.md](../../information-architecture.md) và [README nguồn IA](README.md).

## Bản kiểm thử

- `npm run typecheck` tại workspace đã thành công.
- `npm run build` trên bản sao mã nguồn trong `.tmp/ia-build` đã thành công với Next.js 16.4.0/Turbopack. Các trang chi tiết được prerender theo sáu dịch vụ và bốn dự án; danh mục dự án và liên hệ render server theo query.
- Bản sao dùng cùng dependency qua junction `node_modules`, cùng ảnh/font, và hard link PDF hiện có; cấu hình TLS local chỉ dùng cho QA. Next.js cảnh báo có hai lockfile do bản sao nằm dưới workspace; không thêm cấu hình hoặc dependency này vào mã sản phẩm.
- HTTPS production QA chạy tại `127.0.0.1:3001`. Kiểm thử trình duyệt Chromium dùng `ignoreHTTPSErrors` riêng cho chứng chỉ local; không dùng đây làm bằng chứng HTTPS public.
- Công cụ, bản build, báo cáo và ảnh chụp nằm trong `.tmp/`, được Git bỏ qua. Server QA được dừng khi hoàn tất.

## Kết quả

**71/71 kiểm tra đạt**, gồm:

- 15 trang có HTTP 200, HTML server có một H1 và canonical riêng; sitemap có đúng 15 URL chuẩn, không có query/fragment thay trang.
- Dịch vụ thiết kế chỉ gợi ý Đại Nhật/Crescent Mall; thi công và bảo trì gắn dự án đúng scope. Ba dịch vụ chưa có ví dụ hiển thị hướng đi tiếp trung thực.
- Luồng click từ trang chủ đến dịch vụ, dự án và liên hệ giữ đúng slug; thông tin nhập được đưa vào email nháp, đổi dịch vụ cập nhật subject, bỏ tham khảo bỏ dự án khỏi body.
- Query không hợp lệ hoặc giá trị lặp được xử lý; unknown slug trả 404 tiếng Việt có đường đi tiếp.
- PDF vẫn trả HTTP 200 với kích thước 67.549.898 byte; liên kết dự án giữ trang bằng chứng, giới thiệu công ty có PDF trang 2.
- Có một header/main/footer ở các trang đại diện; không tràn ngang tại 1440, 390, 320 px. Kiểm tra thêm tablet 900 px và landscape 844 × 390 px.
- Danh mục dịch vụ/dự án và trang liên hệ không tràn ngang khi phóng chữ 200% ở 320 px.
- Skip link, menu Escape/refocus, đóng menu sau điều hướng logo, carousel reduced motion và H1 sau đổi slide hoạt động. Điện thoại/email vẫn có trong trang liên hệ khi tắt JavaScript.
- Các anchor trang chủ trước đây tiếp tục có đích; link nhóm dịch vụ dùng anchor `#group-*` trên danh mục.

14 lần scan Axe trên bảy trang đại diện ở desktop/mobile không phát hiện vi phạm trong nhóm WCAG 2 A/AA và 2.1 A/AA. Đã xem trực tiếp ảnh chụp danh mục dịch vụ, dự án và liên hệ, đối chiếu nhận diện, khoảng cách và nội dung.

## Giới hạn

Đây là kiểm tra kỹ thuật và review giao diện, không phải nghiên cứu người dùng. Chưa có card sorting, tree testing, first-click test với khách hàng, đo Core Web Vitals thực tế hoặc thử gửi email bằng ứng dụng email của người đọc. Không có backend nhận yêu cầu; nút cuối chỉ mở email nháp để người đọc tự gửi.

Không triển khai hoặc khởi động lại server của người dùng ở cổng 3000 trong lần QA. Khi dùng production từ workspace chính, dừng server hiện tại, chạy `npm run build`, rồi `npm run start`. PDF ngoài Git cần được bổ sung riêng khi clone sang server khác theo README.
