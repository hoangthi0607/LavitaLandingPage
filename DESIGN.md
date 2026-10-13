# Thiết kế website Lavita

## Mục tiêu và nguồn nội dung

Trang chủ giúp chủ đầu tư và đơn vị quản lý công trình hiểu phạm vi dịch vụ PCCC của Lavita, kiểm tra năng lực qua công trình thực tế và liên hệ tư vấn. Đây là bước tinh chỉnh giao diện hiện có; giữ nhận diện, nội dung doanh nghiệp và các luồng liên hệ.

Thông tin doanh nghiệp, dịch vụ, năm thành lập, phạm vi dự án và hình ảnh lấy từ hồ sơ năng lực Lavita do người dùng cung cấp. Nội dung tập trung tại `src/data/home.ts`. Không biến kế hoạch tăng trưởng thành doanh thu thực tế, không bổ sung chứng nhận, số lượng dự án hoặc cam kết chưa có nguồn. Nhãn dự án phải ghi rõ thiết kế, thi công hoặc bảo trì PCCC, tránh thể hiện Lavita là tổng thầu toàn bộ công trình.

## Nhận diện và bố cục

- Giữ đỏ và cam của Lavita. Đỏ làm điểm nhấn cho hành động chính; cam dùng có chọn lọc cho chi tiết thương hiệu. Nền trắng và ivory tạo cảm giác thoáng; warm charcoal dành cho phần năng lực và lớp phủ ảnh.
- Ảnh thật từ hồ sơ dẫn dắt câu chuyện: hệ thống kỹ thuật ở hero, con người ở giới thiệu và huấn luyện, công trình ở dự án. Không thay ảnh bằng minh họa trang trí hoặc hình tạo sinh.
- Các nhóm nội dung có khoảng cách rộng; nội dung trong cùng nhóm đặt gần nhau. Căn lề section, heading, ảnh và liên kết theo cùng một container.
- Dịch vụ là các hàng mở có đường phân cách, không phải một loạt thẻ icon cùng kích thước. Dùng `details`/`summary` để mở mô tả khi cần; hai dịch vụ đầu mở mặc định ở cả desktop và mobile. Tên dịch vụ và dấu hiệu mở/đóng luôn thấy được; mô tả và CTA nằm trong cùng nhóm.
- Không dùng nhãn trang trí phía trên heading, số thứ tự vô nghĩa, gradient chữ hoặc hiệu ứng kính. Phân cấp bằng cỡ chữ, trọng lượng, khoảng cách và ảnh.

## Typography và token

Manrope được lưu trong `public/fonts/manrope-variable.ttf`, tải bằng `next/font/local` qua biến `--font-manrope` và hỗ trợ dấu tiếng Việt. Giấy phép font nằm tại `public/fonts/OFL-Manrope.txt`. Không phụ thuộc dịch vụ font bên ngoài khi mở trang hoặc build.

| Vai trò | Quy tắc |
| --- | --- |
| Display | Hero và heading lớn có trọng lượng rõ, dòng ngắn, xuống dòng có chủ đích; cỡ tối đa 6rem. |
| Heading | Cùng cấp dùng cùng mức chữ; khoảng cách phía trên lớn hơn phía dưới. |
| Body | Dễ đọc với chiều cao dòng thoáng; đoạn dài giữ độ rộng khoảng 45–75 ký tự tùy cột. |
| Meta | Nhãn phạm vi, địa điểm và nguồn PDF nhỏ hơn body nhưng vẫn đủ tương phản. |

Tracking của heading không nhỏ hơn `-0.04em`; không dùng monospace để tạo vẻ kỹ thuật. Kiểm tra dấu tiếng Việt, độ dài tên công trình và xuống dòng ở từng breakpoint.

CSS trong `src/app/globals.css` là nguồn chuẩn cho các token theo vai trò: màu thương hiệu, nền sáng/tối, chữ chính/phụ, đường phân cách, màu focus, chiều rộng container và khoảng cách. Dùng lại token khi cùng ý nghĩa; không rải giá trị màu mới vào từng component. Chữ thường cần tương phản tối thiểu 4.5:1; chữ lớn và chỉ báo điều khiển cần tối thiểu 3:1.

| Token | Giá trị | Vai trò |
| --- | --- | --- |
| `--color-brand` | `#cf3030` | Hành động chính, đỏ thương hiệu |
| `--color-brand-hover` | `#af2626` | Trạng thái hover của hành động chính |
| `--color-accent` | `#bf5726` | Cam đậm dùng cho chữ trên nền sáng |
| `--color-ink` | `#292321` | Chữ chính |
| `--color-muted` | `#6c5f58` | Chữ phụ trên nền sáng |
| `--color-surface` | `#fffdf9` | Nền sáng chính |
| `--color-surface-soft` | `#f7f1e9` | Nền ivory giữa các section |
| `--color-line` | `#ded5cb` | Đường phân cách trên nền sáng |
| `--color-dark` | `#302824` | Nền warm charcoal |
| `--color-on-dark` | `#fff6ec` | Chữ chính trên nền tối |
| `--color-muted-on-dark` | `#d5c5b6` | Chữ phụ trên nền tối |
| `--content-width` | `1280px` | Chiều rộng nội dung tối đa |
| `--gutter` | `clamp(20px,5vw,80px)` | Khoảng lề responsive |

## Hành động và bằng chứng

- Nút primary: nền đỏ, chữ trắng, dẫn tới hành động tư vấn quan trọng nhất trong ngữ cảnh.
- Nút secondary: cùng chiều cao và nhịp khoảng cách, trọng lượng nhẹ hơn; dùng cho hồ sơ hoặc hành động khám phá.
- Liên kết nội dung có tên hành động cụ thể và dấu hiệu tương tác nhất quán. Icon dùng Lucide, không thay bằng ký tự Unicode.
- CTA dịch vụ tạo email có subject mang tên dịch vụ được chọn; gọi điện và email dùng thông tin thật trong hồ sơ. Không tạo form gửi yêu cầu khi chưa có backend xử lý.
- Dự án có nhãn phạm vi PCCC và liên kết ghi rõ mở hồ sơ PDF. Dùng fragment `#page=` để tới trang chứng minh dự án: Đại Nhật 18, Crescent Mall 19, C2 Bình Dương 22, Pegasuite 25. Đây là số trang PDF, không phải số trang in trong tài liệu dạng trang đôi.
- PDF khoảng 67 MB chỉ tải khi người xem chủ động mở; không nhúng toàn bộ vào trang chủ. Việc mở đúng trang phụ thuộc trình đọc PDF của trình duyệt.

## Responsive và khả năng tiếp cận

Desktop dùng bố cục rộng để cân bằng ảnh và chữ; mobile chuyển thành một cột khi cần, giữ thứ tự đọc và CTA rõ ràng. Hero phải chứa đủ nội dung và điều khiển ở màn hình hẹp hoặc thấp; không dùng chiều cao cố định để che phần tràn. Tên dự án, email và địa chỉ dài được xuống dòng an toàn.

Vùng chạm điều khiển nên đạt ít nhất 44 × 44 px. Menu mobile có tên, trạng thái mở/đóng và đóng bằng Escape; sau khi đóng bằng bàn phím, focus trở về nút menu. Skip link dẫn đến nội dung chính. Focus ring rõ trên cả nền sáng và tối; hover không là cách duy nhất để biết một phần tử tương tác được.

Carousel không tự chạy. Người xem chủ động chọn slide bằng nút trước/sau có vùng chạm ít nhất 44 px hoặc điều hướng bàn phím; trạng thái slide hiện tại phải nhận biết được. Slide không hoạt động dùng `inert`. H1 và CTA nằm ngoài các slide để heading luôn hiển thị; hero dùng bố cục có thể giãn theo nội dung khi phóng chữ. Với `prefers-reduced-motion`, tắt chuyển động carousel, hover phóng ảnh và cuộn mượt. Nội dung vẫn hiển thị đầy đủ khi giảm chuyển động.

Ảnh có kích thước hoặc khung tỷ lệ ổn định để tránh nhảy bố cục. Ảnh nội dung có alt mô tả đúng; icon trang trí ẩn khỏi trình đọc màn hình. Chỉ có một heading cấp 1 cho trang; cấp heading còn lại phản ánh cấu trúc nội dung.

## Kiểm tra trước khi bàn giao

Kiểm tra desktop và mobile cùng một lượt, gồm bàn phím, menu, slide, CTA, liên kết PDF, gọi điện và email. Xem thêm màn hình hẹp và landscape, nội dung dài, tương phản và chế độ giảm chuyển động. Sửa các lỗi tìm được trong một lượt rồi xác nhận tối đa thêm một lượt. Chạy typecheck và build theo README; không coi build thành công là bằng chứng đã kiểm tra trực quan.

## Hướng dẫn thiết kế được áp dụng

Tham khảo [Impeccable của Paul Bakaus](https://github.com/pbakaus/impeccable), phiên bản skill 4.5.2 tại commit [`c63b8dd7dd5a5f3c32eaabe1af76d0694f863ed2`](https://github.com/pbakaus/impeccable/tree/c63b8dd7dd5a5f3c32eaabe1af76d0694f863ed2). Các hướng dẫn đã đọc và áp dụng trực tiếp:

- [SKILL.md](docs/impeccable/SKILL.md): tinh chỉnh phải giữ nhận diện, nội dung và hành vi; kiểm tra trong số lượt giới hạn.
- [craft-floor.md](docs/impeccable/reference/craft-floor.md): typography, tương phản, focus, nội dung thật và tránh khuôn mẫu trang trí.
- [polish.md](docs/impeccable/reference/polish.md): ưu tiên hoàn thiện luồng, khả năng tiếp cận và responsive trước chi tiết thị giác.

Nguồn hướng dẫn và tình trạng launcher được ghi tại [docs/impeccable/README.md](docs/impeccable/README.md). Tài liệu này ghi lại quyết định cho Lavita; không thay thế hồ sơ doanh nghiệp hoặc tạo thêm claim sản phẩm.
