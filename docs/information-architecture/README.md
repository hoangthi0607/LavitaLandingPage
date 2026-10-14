# Nguồn hướng dẫn Information Architecture

Thư mục này lưu hướng dẫn từ [rampstackco/claude-skills](https://github.com/rampstackco/claude-skills/tree/main/skills/information-architecture), do người dùng yêu cầu áp dụng cho cấu trúc website Lavita.

Bản snapshot được tải từ GitHub ngày **14/10/2026**, pin tại commit [`482c9bf74697fc1e311bd4dca5ce301f046c4b76`](https://github.com/rampstackco/claude-skills/commit/482c9bf74697fc1e311bd4dca5ce301f046c4b76), lấy commit từ GitHub API của nhánh main trước khi tải file. Chỉ tải ba tài liệu và LICENSE, không clone toàn repository.

| File local | File upstream tại commit đã pin |
| --- | --- |
| [SKILL.md](SKILL.md) | [skills/information-architecture/SKILL.md](https://github.com/rampstackco/claude-skills/blob/482c9bf74697fc1e311bd4dca5ce301f046c4b76/skills/information-architecture/SKILL.md) |
| [references/ia-document-template.md](references/ia-document-template.md) | [Template](https://github.com/rampstackco/claude-skills/blob/482c9bf74697fc1e311bd4dca5ce301f046c4b76/skills/information-architecture/references/ia-document-template.md) |
| [references/url-pattern-library.md](references/url-pattern-library.md) | [URL pattern library](https://github.com/rampstackco/claude-skills/blob/482c9bf74697fc1e311bd4dca5ce301f046c4b76/skills/information-architecture/references/url-pattern-library.md) |
| [LICENSE](LICENSE) | [LICENSE của repository](https://github.com/rampstackco/claude-skills/blob/482c9bf74697fc1e311bd4dca5ce301f046c4b76/LICENSE) |

Các file trên là bản nguyên gốc, giữ cấu trúc đường dẫn tương đối của skill. SHA-256 của bản local:

| File | SHA-256 |
| --- | --- |
| `SKILL.md` | `B61E91C357C58EED1A12AAD57BEB1660D59D5CB598D2FD54BEAB7BEB208BC969` |
| `references/ia-document-template.md` | `74C09120E7D6C2CDCD4F7BC1253A6234310F450E7E8ACAAA5086FAF672F88127` |
| `references/url-pattern-library.md` | `235A35A3703A3F94A691343CDE949BEE543550650952EA1A911EB0FA07C61353` |
| `LICENSE` | `7957F4B291988F21BE7CB75637D2EFB6EDD0369A95D3814CAC7EF931F7F10B7C` |

## Cách áp dụng cho Lavita

Đã đọc SKILL.md và hai reference để ghi nhận sáu lớp IA: nhiệm vụ/mental model, sitemap, URL, navigation, taxonomy và labeling. Quyết định cho dự án nằm tại [information-architecture.md](../../information-architecture.md); các snapshot nguồn giữ nguyên để đối chiếu.

Skill loại trừ thiết kế một trang đơn lẻ. Công việc ở đây là tổ chức website nhiều route theo ưu tiên dịch vụ → dự án → liên hệ nên thuộc phạm vi tái cấu trúc site. Các hướng dẫn về số category/tag được xem theo quy mô dữ liệu hiện có, không tạo nhóm hoặc tag không có nội dung.

Chưa có dữ liệu card sorting, tree testing, first-click testing hoặc sign-off nghiên cứu. Đầu vào thực là ưu tiên của người dùng, hồ sơ và dữ liệu công ty hiện có; audience/mental models là giả thuyết được ghi rõ, không là kết quả khảo sát. Áp dụng quy tắc của skill về dữ liệu chưa có bằng cách ghi khoảng trống, không tự dựng phép đo hay kết quả.

Đây là **tài liệu được vendored cùng dự án**, không là dependency chạy website, không được cài toàn cục hoặc đăng ký thành runtime/agent skill. Không cài công cụ, plugin, hook hoặc các skill khác được nhắc tới trong nguồn. License MIT, Copyright © 2026 RampStack Co., được giữ nguyên trong LICENSE; giấy phép này áp dụng phần hướng dẫn nguồn và không tự thay giấy phép của mã/ảnh doanh nghiệp Lavita.
