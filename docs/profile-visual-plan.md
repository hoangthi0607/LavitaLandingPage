# Kế hoạch thiết kế hồ sơ năng lực bằng hình ảnh

Ngày 16/11/2026. Bố cục này đã được người dùng yêu cầu áp dụng vào `/ho-so-nang-luc`, với ba tiêu đề đã chốt: **Đội ngũ thi công công trình**, **Hồ sơ pháp lý**, **Bằng cấp, chứng chỉ nhân sự**.

Cập nhật sau triển khai: phần bằng cấp/chứng chỉ đang ẩn. Toàn website đã bỏ mô tả dẫn nguồn, số trang và link đối chiếu PDF; chỉ nút tải cuối trang nhắc PDF. Số trang và nguồn ảnh dưới đây dùng nội bộ, không là chú thích hiển thị cho khách truy cập. Trình xem ảnh giữ tên tài liệu và thứ tự ảnh.

## Hướng thiết kế

Trang cần có cảm giác đang xem một bộ hồ sơ doanh nghiệp được biên tập cho web: thấy công trình, người thực hiện và tài liệu chứng minh ngay trên trang. Ảnh mang nội dung chính; chữ dùng để gọi tên, giải thích phạm vi và dẫn người đọc. Giữ màu đỏ/cam Lavita, Manrope và nền ivory hiện có.

Không dàn toàn bộ 32 trang PDF thành một dải ảnh: chữ sẽ nhỏ trên điện thoại, trang rất nặng và có thể đưa lại các nội dung người dùng đã gỡ. Tách ảnh gốc và bản scan ra khỏi nền/trang trí PDF, biên tập lại cho từng khối web. Tài liệu giữ đủ mép, dấu, chữ ký và nội dung; không chỉnh sửa thông tin hoặc xóa watermark.

## Ảnh thực tế đã kiểm tra

Đã đọc PDF `public/documents/ho-so-nang-luc-lavita.pdf` gồm 32 trang và thử trích xuất trực tiếp các ảnh nhúng. Các số dưới đây là **trang PDF**, không phải số trang in trên từng nửa trang đôi. Tệp thử nằm trong `.tmp/profile-visual-plan/extracted/`.

| Nguồn | Tệp thử và kích thước gốc | Vai trò dự kiến |
| --- | --- | --- |
| Trang 21 | `p21-1.jpg`, 3307 × 2204 | Ảnh mở đầu: đường ống PCCC, đủ chi tiết cho khung rộng |
| Trang 10 | `p10-1.jpg`, 720 × 1020 | Ảnh dọc kỹ thuật viên thao tác hệ thống; dùng ở cột vừa, tránh phóng toàn màn hình |
| Trang 23 | `p23-1.jpg`, 1181 × 664 | Ảnh tập thể đội thi công tại Chung cư C2 Bình Dương; giữ đủ người trong khung |
| Trang 6 | `p6-5.jpg`, 643 × 916; `p6-4.jpg`, 791 × 1128 | Hai trang đăng ký doanh nghiệp; cần kiểm tra thứ tự nội dung khi lập album |
| Trang 7 | `p7-4.jpg`, `p7-5.jpg`, cùng 730 × 1025 | Giấy xác nhận điều kiện kinh doanh dịch vụ PCCC và phần kèm theo |
| Trang 11 | `p11-3.jpg`, 1050 × 738; `p11-4.jpg`, 1259 × 874; còn hai ảnh khác | Bộ chứng chỉ/bằng cấp nhân sự, minh họa cho thư viện chứng minh chuyên môn |
| Trang 18 | `p18-1.jpg`, 3307 × 2338 | Phối cảnh Đại Nhật; ảnh lớn cho phạm vi thiết kế PCCC |
| Trang 25 | `p25-5.jpg` đến `p25-8.jpg`, khoảng 555 × 858 | Bốn ảnh thao tác bảo trì; dùng cặp ảnh dọc ở cỡ vừa, giữ đúng công trình theo chú thích nguồn |

Trang 23 còn có ảnh sinh hoạt an toàn tại công trường (`p23-3.jpg`); không dùng cho trang này để tránh gợi lại phần đào tạo/huấn luyện đã gỡ. Các ảnh trang trí dạng dải 1653 × 403 và nền PDF không đưa vào bộ ảnh nội dung.

Trang 11–15 còn các tài liệu nhân sự khác. Bước triển khai sẽ kiểm tra từng ảnh và chọn một nhóm ngắn, không mặc định đưa toàn bộ lên trang hoặc suy diễn thành chứng nhận mới của doanh nghiệp.

## Bố cục từ trên xuống

Tên hiển thị của hai phần tài liệu dùng đúng **Hồ sơ pháp lý** và **Bằng cấp, chứng chỉ nhân sự**. Không thêm các câu “Nhìn thấy ngay trên trang”, “Chuyên môn có minh chứng” hoặc đoạn diễn giải bên cạnh hai tiêu đề này.

| Khối | Desktop | Mobile | Chữ và tương tác |
| --- | --- | --- | --- |
| Mở đầu | Ảnh hệ thống PCCC rộng, tiêu đề Hồ sơ năng lực Lavita rõ; ảnh kỹ thuật viên ở khối tiếp theo tạo nhịp chuyển từ hệ thống sang con người | Khung ảnh 4:3, tiêu đề và phần mô tả không đè lên chi tiết quan trọng | Một đoạn giới thiệu tối đa 2–3 dòng; mục lục gọn |
| Đội ngũ thi công công trình | Ảnh đội thi công chiếm khoảng 2/3 chiều rộng; thông tin công ty là dải dữ kiện ngắn ở bên cạnh hoặc dưới ảnh | Ảnh toàn đội giữ nguyên tỷ lệ, thông tin xếp dưới | Tên công ty, năm thành lập, mã số thuế; thông tin liên hệ dùng dữ liệu hiện tại |
| Hồ sơ pháp lý | Hai nhóm tài liệu với bản scan nhìn thấy ngay, mỗi nhóm có ảnh đầu và số trang trong album | Hai cột thumbnail ở 390 px; một cột khi quá hẹp | Nhãn đúng tên tài liệu, bấm ảnh mở bản lớn ngay trên web; bỏ accordion chỉ có chữ |
| Bằng cấp, chứng chỉ nhân sự | Một ảnh kỹ thuật viên dọc đi cùng 4 thumbnail bằng cấp/chứng chỉ đã chọn; sơ đồ tổ chức nằm dưới với Ban giám đốc và ba khối có đường nối | Ảnh trước, thumbnail sau; sơ đồ chuyển thành cây dọc đọc được | Chú thích ngắn cho từng tài liệu; không hiển thị các con số nhân sự chưa có nguồn |
| Năng lực qua dự án | Ba cụm theo thiết kế, thi công, bảo trì. Mỗi cụm có ảnh công trình chủ đạo và ảnh thực hiện khi nguồn đủ rõ; tỷ lệ khối thay đổi để tránh lặp lưới thẻ | Từng cụm xếp dọc, ảnh công trình trên và ảnh thao tác dưới; giữ tên/phạm vi sát ảnh | Ví dụ Đại Nhật/Crescent Mall cho thiết kế, C2 cho thi công, Pegasuite cho bảo trì; bấm công trình vào chi tiết |
| Kết thúc | Một khối liên hệ ngắn, nút tải toàn bộ hồ sơ PDF là hành động phụ | Nút rõ, không bắt tải để xem nội dung | Ghi PDF khoảng 67 MB và ngày bản hồ sơ; giữ liên hệ hiện tại |

Phần dịch vụ được thể hiện cùng bằng chứng dự án theo đúng ba phạm vi hiện có. Không lặp một bảng mô tả dịch vụ dài rồi một lưới dự án giống trang khác. Giá trị cốt lõi có thể rút còn một lời dẫn ngắn trong phần con người; trang Về Lavita tiếp tục giữ nội dung giới thiệu đầy đủ.

## Xem ảnh và tài liệu ngay trên web

- Thumbnail tài liệu là nút có tên cụ thể, ví dụ “Xem giấy đăng ký doanh nghiệp, trang 1”. Khung chứa dùng `object-fit: contain`, không cắt dấu hoặc chữ trên giấy.
- Mở trình xem ảnh với tên tài liệu, ảnh lớn, chỉ báo trang và nút trước/sau. Có thể phóng về độ phân giải gốc; ảnh độ phân giải thấp không thể hứa đọc rõ mọi dòng.
- Bàn phím: Tab tới ảnh, Enter mở, Escape đóng, mũi tên chuyển ảnh; quản lý focus trong trình xem và trả về thumbnail khi đóng. Có cách mở ảnh gốc khi JavaScript không hoạt động.
- Ảnh hoạt động/công trình dùng crop theo từng khung, ưu tiên giữ người và thiết bị. Ảnh đội nhóm dùng tỷ lệ gốc để không mất người ở mép.
- Chỉ có một nút tải toàn bộ PDF ở cuối. Người đọc không phải mở PDF để xem ảnh chứng minh chính.

## Cách chuẩn bị tài nguyên

1. Tách ảnh nhúng trực tiếp bằng PDF.js; dùng render/crop ở độ phân giải cao chỉ với phần không có ảnh gốc độc lập. Việc thử đã xác nhận có thể lấy ảnh sạch, không dính tiêu đề và nền PDF.
2. Đặt tên theo nội dung, lưu nguồn trang và kích thước trong dữ liệu. Ảnh đưa vào `public/images/profile/`, dữ liệu nội dung vẫn ở `src/data/home.ts`, tách khỏi layout.
3. Ảnh chụp xuất WebP ở các cỡ phù hợp khung; bản scan dùng định dạng giữ được chữ nhỏ, so sánh PNG/WebP chất lượng cao trước khi chọn. Không tăng kích thước để tạo cảm giác sắc nét giả.
4. Thumbnail tải trước khi cần, ảnh lớn chỉ tải lúc mở trình xem. Khai báo kích thước/tỷ lệ để không nhảy bố cục; ảnh dưới màn hình tải lazy.
5. Giữ tên tài liệu đúng bản gốc và không tự gắn nhãn “còn hiệu lực”. Thông tin liên hệ cũ in trên bản gốc không dùng thay dữ liệu hiện tại của website. Giữ nguyên các nội dung đã gỡ: đào tạo, tư vấn nghiệm thu và dịch vụ vật tư/thiết bị không được đưa trở lại.

## Thứ tự thực hiện và tiêu chí duyệt

Trước hết chọn bộ ảnh cuối và kiểm tra chú thích/công trình. Sau đó dựng bố cục có ảnh thực tế trên desktop lẫn mobile; hoàn thiện trình xem tài liệu, rồi mới tinh chỉnh chữ, khoảng cách và chuyển động nếu cần. Không viết lại toàn trang bằng các đoạn mô tả trước khi chọn ảnh.

Kết quả cần đạt: mở trang thấy ngay chất liệu Lavita; hồ sơ pháp lý và chuyên môn có hình ảnh đọc được trên web; dự án thể hiện đúng phạm vi; nội dung ngắn hơn bản đầu. Kiểm tra crop, thứ tự tài liệu, chất lượng đọc khi phóng, mạng di động, bàn phím, reduced motion, tương phản và tràn nội dung. Bản phác bố cục ở `.tmp/profile-visual-plan/` chỉ minh họa hướng sắp xếp, chưa phải trang hoàn thiện hoặc kết quả QA của giao diện mới.

## Bản đã áp dụng

Giao diện thật tại `src/app/ho-so-nang-luc/page.tsx`, CSS tại `profile.css`, nội dung và tham chiếu nguồn trong `companyProfile` ở `src/data/home.ts`. Tài nguyên tại `public/images/profile/` gồm sáu ảnh chụp/phối cảnh WebP và tám bản scan WebP lossless. Giữ ảnh C2 hiện có cho cụm thi công; giữ bốn đường vào chi tiết dự án với đúng phạm vi.

Hai album pháp lý có hai ảnh mỗi album, thư viện nhân sự có bốn ảnh từ trang PDF 11. `DocumentGallery` chỉ tải bản đầy đủ khi mở, dùng native `dialog` với chuyển ảnh, phóng lớn, vòng Tab, Escape và trả focus. Khi không có JavaScript, mở link ảnh gốc. Không đưa toàn bộ trang 12–15 vào bản đầu này.

Ngày 16/11/2026: typecheck/build thành công. Kiểm tra Chromium ở bảy viewport từ 320 đến 1440 px và landscape không thấy tràn ngang; ảnh đội thi công giữ tỷ lệ gốc, tài liệu mở vừa khung. Axe không phát hiện vi phạm WCAG A/AA trên trang và dialog ở 1440/390 px. Đã kiểm tra menu, anchor, album, zoom, bàn phím, khôi phục cuộn/focus, fallback không JavaScript và reduced motion. Không có lỗi JavaScript trong luồng kiểm tra; không tự tải PDF/ảnh scan đầy đủ trước khi chọn. Báo cáo và ảnh giao diện thật nằm ở `.tmp/profile-image-qa/`. Chưa kiểm tra trên thiết bị vật lý, trình duyệt khác hoặc mạng di động thực tế. Ảnh tài liệu không thể nét hơn nguồn trích từ PDF.
