# Lavita — kiểm tra giao diện

Ngày: 12/10/2026. Kiểm tra bản production phục vụ bằng Next.js, Chromium headless và Playwright.

## Kết quả

- `npm run typecheck`: thành công.
- `npm run build`: thành công, trang chủ prerender thành static content.
- 30 kiểm tra hành vi: đạt.
- Không phát hiện lỗi JavaScript trong các lượt truy cập.
- Tất cả ảnh tải thành công; font Manrope được áp dụng.
- Không tràn ngang ở 1440 × 1000, 390 × 844, 320 × 740, 900 × 1000 và 844 × 390.
- Axe, nhóm quy tắc WCAG 2 A/AA và WCAG 2.1 A/AA: không phát hiện vi phạm ở desktop 1440 × 1000 và mobile 390 × 844.

Đã kiểm tra slider trước/sau, loại CTA của slide ẩn khỏi thứ tự tab, mở mô tả dịch vụ, subject email theo dịch vụ, fragment trang PDF, menu mobile, Escape và focus quay về nút menu, đóng menu sau điều hướng, giảm chuyển động, không tự chạy slider và skip link tới nội dung chính.

Đã xem ảnh chụp desktop toàn trang và hero mobile. Ảnh và báo cáo máy nằm tại `.tmp/design-qa/` (không theo dõi bằng Git). Công cụ QA là công cụ cục bộ, không thêm vào dependencies của website.

## Giới hạn

Kiểm tra tự động không chứng nhận tuân thủ đầy đủ WCAG. Chưa thử bằng trình đọc màn hình hoặc thiết bị vật lý/Safari. Liên kết `tel:` và `mailto:` đã kiểm tra đích; không thực hiện cuộc gọi hay gửi email. Fragment `#page=` phụ thuộc trình đọc PDF. Không triển khai hosting.
