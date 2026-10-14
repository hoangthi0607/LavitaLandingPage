# Nguồn hướng dẫn Impeccable

Thư mục này lưu một phần hướng dẫn thiết kế từ [pbakaus/impeccable](https://github.com/pbakaus/impeccable), skill phiên bản 4.5.2, commit [`c63b8dd7dd5a5f3c32eaabe1af76d0694f863ed2`](https://github.com/pbakaus/impeccable/tree/c63b8dd7dd5a5f3c32eaabe1af76d0694f863ed2), để các lần chỉnh website Lavita sau có cùng cơ sở thiết kế.

Các file sau được sao chép nguyên bản từ nguồn:

- [SKILL.md](SKILL.md)
- [reference/craft-floor.md](reference/craft-floor.md)
- [reference/polish.md](reference/polish.md)
- [reference/critique.md](reference/critique.md), bổ sung ngày 14.10.2026 từ cùng bản nguồn để đối chiếu đánh giá giao diện.
- [LICENSE](LICENSE)
- [NOTICE.md](NOTICE.md)

Đây là tài liệu hướng dẫn được lưu cùng dự án. Chưa đăng ký thành Codex skill và chưa cài runtime CLI. Thư mục này không bao gồm launcher, engine, hook, detector hoặc toàn bộ các tài liệu được liên kết trong SKILL.md; các đường dẫn đến chúng trong bản nguồn không phải công cụ đã được cài tại đây. Giữ nguyên các file nguồn để dễ đối chiếu; quyết định áp dụng cho Lavita nằm tại [DESIGN.md](../../DESIGN.md).

Trong phiên chỉnh giao diện này, skill base directory là `.tmp/impeccable-source/.agents/skills/impeccable` của bản clone dùng tạm. Lệnh CLI `impeccable context` đã được thử nhưng không chạy thành công do quyền truy cập cache không khả dụng. Vì vậy, hướng dẫn nguồn được đọc và áp dụng trực tiếp; không tuyên bố đã chạy context hoặc detector. Thư mục `.tmp` được Git bỏ qua và không là phụ thuộc để build website.

Hướng dẫn Impeccable sử dụng Apache License 2.0; giữ bản LICENSE và NOTICE của upstream khi phân phối phần hướng dẫn này. Các giấy phép trên không tự thay thế giấy phép cho mã website, font hoặc tài sản thương hiệu Lavita.

Kết quả đánh giá giao diện ngày 14.10.2026: [design-review-2026-10-14.md](../design-review-2026-10-14.md). Review thực hiện hai đánh giá độc lập về thiết kế và bằng chứng trình duyệt. CLI detector được thử nhưng chưa chạy được do engine/cache không khả dụng; không có claim detector hoặc overlay đã chạy.
