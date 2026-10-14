# Đánh giá giao diện Lavita — 14.10.2026

Phương pháp: hai đánh giá độc lập, A về thiết kế (`visual_assessment_a`) và B về bằng chứng trình duyệt (`evidence_assessment_b`). A hoàn tất trước khi kết quả B được đọc để tổng hợp. Mục tiêu: `src/app/page.tsx` và luồng dịch vụ → dự án cùng phạm vi → liên hệ, tại commit `5b2485b`.

Áp dụng [Impeccable](impeccable/SKILL.md), [critique](impeccable/reference/critique.md), [craft floor](impeccable/reference/craft-floor.md) và kiến trúc thông tin đã ghi trong [information-architecture.md](../information-architecture.md). Đây là đánh giá giao diện hiện có; các đề xuất bên dưới chưa được áp dụng vào UI.

## Nhận định chính

Nhận diện Lavita và cấu trúc nội dung đã rõ: đỏ/ivory/charcoal, Manrope tiếng Việt, ảnh hệ thống PCCC và nhân sự từ hồ sơ, tên dự án kèm phạm vi thực hiện. Menu, breadcrumb và liên kết dịch vụ–dự án tạo đường đi nhất quán. Điểm cần ưu tiên là bảo toàn nội dung tư vấn chưa gửi, rút đoạn cuộn đến hành động trên điện thoại và đưa bằng chứng lên trước phần chuẩn bị liên hệ.

Thiết kế cần được tinh chỉnh trong nhận diện đang có. Giữ ảnh thật, thông tin doanh nghiệp và cách công bố phạm vi PCCC trung thực; dùng nội dung có nguồn để làm trang dịch vụ cụ thể hơn.

## Điểm nên giữ

- Hero có hành động chính “Tìm dịch vụ phù hợp”, gắn với mục tiêu của người đọc.
- Dự án ghi rõ thiết kế, thi công hoặc bảo trì PCCC; đường dẫn PDF có trang đối chiếu. Không diễn đạt Lavita là tổng thầu toàn bộ công trình.
- Các trang dùng chung type, token, container, breadcrumb và điều hướng; email nháp phân biệt dịch vụ cần hỏi với dự án tham khảo và giải thích việc tự gửi.

## Năm ưu tiên

### P1 — Mất nội dung email nháp khi quay lại

**Quan sát xác nhận:** nhập người liên hệ, công trình và nhu cầu; preview/mailto chứa đúng nội dung. Tải lại trang làm ba trường rỗng. Nhập lại rồi chọn “Xem lại các dịch vụ PCCC”, dùng browser Back: các trường đã nhập cũng rỗng. Dịch vụ/dự án vẫn được khôi phục từ URL. Không thấy đường khôi phục bản nháp.

**Tác động:** người đọc đang cân nhắc dịch vụ có thể mất phần nhu cầu đã viết khi quay lại xem thông tin. Đây là lỗi trạng thái đã quan sát, không phải số liệu về tỷ lệ bỏ cuộc.

**Đề xuất:** phục hồi bản nháp trong phiên trình duyệt, giữ ngữ cảnh đúng khi chuyển dịch vụ; có thao tác xóa rõ ràng và thông báo phù hợp. Tránh đưa tên/nội dung nhu cầu vào URL. Có thể bổ sung cảnh báo trước khi rời trang nếu chưa có phục hồi.

**Vị trí:** [contact-composer.tsx](../src/components/contact/contact-composer.tsx), state tại dòng 14–18 và các link điều hướng trên trang liên hệ.

### P2 — Hành động email theo ngữ cảnh quá thấp trên mobile

**Bằng chứng:** ở 390 × 844, khối soạn email bắt đầu khoảng document y=1091 px; nút “Mở email tư vấn” tại y=2064 px. Tại 320 px, nút bắt đầu khoảng y=2236 px. Dịch vụ/dự án đã chọn nằm sau khối thông tin liên hệ chung. Điện thoại và email trực tiếp vẫn có trong màn hình đầu; vấn đề nằm ở đường tiếp tục có ngữ cảnh.

**Đề xuất:** đặt tóm tắt dịch vụ/dự án ngay dưới intro cùng hành động gọi hoặc mở email nháp. Trên mobile, ưu tiên phần soạn nội dung trước địa chỉ; đưa các trường tùy chọn vào phần bổ sung có thể mở. Giữ lời giải thích rằng người đọc tự gửi từ ứng dụng email.

**Vị trí:** [trang liên hệ](../src/app/lien-he/page.tsx), [contact.css](../src/app/contact.css), [contact-composer.tsx](../src/components/contact/contact-composer.tsx).

### P2 — Trang dịch vụ đưa chuẩn bị tư vấn lên trước bằng chứng

**Bằng chứng:** dịch vụ thiết kế lặp mô tả ở intro và “Bắt đầu từ nhu cầu công trình”, tiếp theo là thông tin nên chuẩn bị. Nút “Xem dự án phù hợp” khoảng y=1192 px trên mobile; section dự án khoảng y=1496 px. Ở desktop, nút khoảng y=1063 px, dưới viewport 900 px.

**Đề xuất:** bỏ mô tả lặp; đưa phạm vi có nguồn và đường đến dự án lên gần tiêu đề. Đặt phần chuẩn bị tư vấn sau bằng chứng hoặc thu gọn. Nội dung bổ sung phải lấy từ hồ sơ/doanh nghiệp; không tự viết đầu việc, chứng nhận hoặc cam kết chưa có nguồn.

**Vị trí:** [chi tiết dịch vụ](../src/app/dich-vu/[slug]/page.tsx), [PageIntro](../src/components/content/page-intro.tsx), [content.css](../src/app/content.css).

### P2 — Trang chủ có hai cách chọn dịch vụ cạnh nhau

**Bằng chứng:** section dịch vụ chứa sáu hàng dịch vụ, ba link nhóm nhu cầu và “Xem tất cả dịch vụ”: mười lựa chọn chính, thêm link chi tiết trong hàng đang mở. Trên mobile, người đọc gặp nhóm nhu cầu trước, rồi danh sách dịch vụ.

**Đề xuất:** dùng sáu dịch vụ làm lối vào chính ở trang chủ, kèm một link danh mục. Giữ lựa chọn theo ba nhóm tại `/dich-vu`; có thể dùng nhóm làm nhãn tổ chức thay vì thêm một hệ link cạnh hàng dịch vụ. Đây là đề xuất chuyên gia; chưa có first-click test chứng minh cách nhóm được khách hàng hiểu tốt hơn.

**Vị trí:** [Services trong sections.tsx](../src/components/home/sections.tsx), các lớp `.service-entry` và `.service-list`.

### P2 — Một số link PDF thiếu dung lượng tại điểm bấm

**Bằng chứng:** card dự án trang chủ có “Mở hồ sơ PDF” nhưng không nhắc 67 MB ngay cạnh link. Những phần khác và trang chi tiết có thông tin dung lượng. PDF HEAD xác nhận 67.549.898 byte, không tải toàn tệp trong review.

**Đề xuất:** hiển thị “PDF · khoảng 67 MB · mở tab mới” gần link bằng chứng hoặc một ghi chú rõ trong section dự án. Giữ link mở đúng trang; không tự tải hoặc nhúng PDF vào trang chủ.

**Vị trí:** [Projects trong sections.tsx](../src/components/home/sections.tsx) và [ProjectCards](../src/components/content/project-cards.tsx).

## Quan sát nhỏ

- Tagline logo đang ở 9,6 px desktop và 8,8 px mobile, line-height bằng font-size. Đỏ trên nền header đạt 5,02:1; đây là vấn đề dễ đọc, không phải lỗi tương phản đã đo. Nên thử cỡ 11–12 px và line-height thoáng hơn, giữ nguyên nội dung thương hiệu.
- Ảnh Đại Nhật lặp ở phần giới thiệu dịch vụ, card bằng chứng và trang dự án. Nên giữ ảnh công trình cho phần bằng chứng và dùng ảnh kỹ thuật phù hợp từ hồ sơ ở phần giải thích dịch vụ nếu có.
- PageIntro của các hub có chiều cao 372–488 px desktop và 235–363 px mobile. Có thể thu gọn tùy mục đích trang để lựa chọn thực và thông tin phạm vi xuất hiện sớm hơn, giữ nhịp chữ/khoảng thở.

## Nielsen — điểm chuyên gia tổng hợp

Điểm dưới đây là đánh giá theo rubric, không phải kết quả nghiên cứu người dùng hay chứng nhận WCAG. Tổng hợp bổ sung vấn đề mất bản nháp vào đánh giá quyền điều khiển và phục hồi.

| Tiêu chí | Điểm /4 | Căn cứ |
| --- | ---: | --- |
| Trạng thái hệ thống | 3 | Active nav/breadcrumb/preview rõ; xác nhận lựa chọn mobile thấp. |
| Ngôn ngữ thực tế | 3 | Tiếng Việt và scope PCCC rõ; mô tả dịch vụ chung/lặp. |
| Quyền điều khiển | 2 | Menu/đường quay lại tốt; nội dung nháp mất khi quay lại hoặc reload. |
| Nhất quán | 4 | Token, type, navigation và CTA thống nhất. |
| Ngăn lỗi | 3 | Ngữ cảnh query được xác thực, không báo đã gửi giả. |
| Nhận biết thay vì ghi nhớ | 3 | Mang scope theo, nhưng cần đưa xác nhận lựa chọn lên sớm. |
| Linh hoạt cho người dùng chuyên sâu | n/a | Bề mặt giới thiệu dịch vụ này không có tác vụ expert/bulk để chấm. |
| Thẩm mỹ/tối giản | 3 | Bố cục sạch; lựa chọn tương đương và nội dung lặp cần giảm. |
| Phục hồi | 2 | Có gọi/email thay thế; chưa có phục hồi nội dung nháp đã mất. |
| Trợ giúp/ngữ cảnh | 3 | Có gợi ý, preview, giải thích email; phạm vi dịch vụ cần cụ thể hơn. |
| **Tổng** | **26/36** | Một tiêu chí không áp dụng. |

## Người đọc và hành trình

Người mới có thể phân vân giữa link nhóm và hàng dịch vụ. Người dùng điện thoại bị ngắt quãng có thể phải cuộn lại và nhập lại nội dung; mức tải PDF cần được báo gần link. Người đánh giá đối tác có thể cần phạm vi dịch vụ cụ thể hơn để quyết định trước khi mở hồ sơ. Đây là walkthrough theo giả thuyết từ mục tiêu/hồ sơ, không phải nhận xét từ người tham gia nghiên cứu.

Hero và các công trình tạo điểm tin cậy tốt. Phần mô tả lặp/chuẩn bị trước bằng chứng làm chậm bước đánh giá; đoạn kết soạn email cần xuất hiện sớm hơn và bảo toàn nháp.

## Bằng chứng và giới hạn

- Source đối chiếu với production QA sau chuẩn hóa CRLF, không có khác biệt nội dung. A và B dùng browser context/tab riêng; A không xem detector/Axe/B. Parent chỉ đọc B sau khi A hoàn tất.
- A xem bảy route ở 1440 × 900 và 390 × 844, cùng viewport/crop ở các section chính. B chụp 21 trường hợp ở 1440/390/320 px, không thấy tràn ngang; kiểm tra thêm phóng chữ 200% bằng CSS ở ba trường hợp 390 px không thấy tràn ngang.
- B kiểm tra keyboard journey, skip link/menu/Escape, reduced motion, query và email preview. PDF HEAD đúng; không mở ứng dụng email, gửi mail/gọi thật hay thử PDF viewer.
- Mini-Axe ở tám trường hợp, một bộ quy tắc giới hạn, không báo violation. Contrast của tám node homepage ở mỗi viewport còn incomplete vì ảnh/gradient; không coi đó là bằng chứng chúng đều đạt tương phản. Không thay thế audit đầy đủ hoặc screen reader test.
- Một lần thử CLI `impeccable detect --json src` thất bại vì engine 0.1.14 chưa có và launcher không tạo được cache trong `C:\Users\FPTSHOP\.impeccable\bin\0.1.14`. Không chạy detector Impeccable hoặc overlay; dùng browser measurements/Axe làm evidence thay thế. Không có snapshot/trend từ helper CLI; báo cáo lưu dạng Markdown thông thường.
- Đã dừng server production QA riêng tại cổng 3001 và đóng các browser context. Không sửa UI, build lại hoặc cài dependency trong lần đánh giá này. Tài liệu critique nguồn được bổ sung cùng license/NOTICE hiện có.
- Các report/screenshot/raw JSON của A/B nằm trong `.tmp/design-review/`, được Git bỏ qua. Chưa có card sort/tree test, dữ liệu conversion, đo hiệu năng mạng chậm, physical touch, native browser zoom hoặc kiểm tra Safari/Firefox/Edge thực tế.

## Thứ tự hành động đề xuất

1. Bảo toàn email nháp và rút luồng liên hệ mobile.
2. Đưa scope/bằng chứng và hành động theo ngữ cảnh lên sớm ở trang chi tiết.
3. Thống nhất cách chọn dịch vụ trên trang chủ.
4. Hoàn thiện thông báo PDF, cỡ tagline và giảm lặp ảnh.

Hai quyết định cho lượt chỉnh tiếp theo: ưu tiên luồng tư vấn mobile hay bố cục/nội dung trang dịch vụ; trang chủ dùng sáu dịch vụ hay ba nhóm nhu cầu làm lối vào chính. Đề xuất hiện tại là ưu tiên mobile và dùng sáu dịch vụ, với nhóm nhu cầu nằm tại hub.
