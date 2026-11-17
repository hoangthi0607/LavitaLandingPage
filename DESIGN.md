# Thiết kế website Lavita

## Mục tiêu và nguồn nội dung

Trang chủ giúp chủ đầu tư và đơn vị quản lý công trình hiểu phạm vi dịch vụ PCCC của Lavita, kiểm tra năng lực qua công trình thực tế và liên hệ tư vấn. Đây là bước tinh chỉnh giao diện hiện có; giữ nhận diện, nội dung doanh nghiệp và các luồng liên hệ.

Thông tin doanh nghiệp, dịch vụ, năm thành lập, phạm vi dự án và hình ảnh lấy từ hồ sơ năng lực Lavita do người dùng cung cấp. Nội dung tập trung tại `src/data/home.ts`. Không biến kế hoạch tăng trưởng thành doanh thu thực tế, không bổ sung chứng nhận, số lượng dự án hoặc cam kết chưa có nguồn. Nhãn dự án phải ghi rõ thiết kế, thi công hoặc bảo trì PCCC, tránh thể hiện Lavita là tổng thầu toàn bộ công trình.

## Nhận diện và bố cục

- Giữ đỏ và cam của Lavita. Đỏ làm điểm nhấn cho hành động chính; cam dùng có chọn lọc cho chi tiết thương hiệu. Nền trắng và ivory tạo cảm giác thoáng; warm charcoal dành cho phần năng lực và lớp phủ ảnh.
- Ảnh thật từ hồ sơ dẫn dắt câu chuyện: hệ thống kỹ thuật ở hero, con người ở giới thiệu, công trình ở dự án. Không thay ảnh bằng minh họa trang trí hoặc hình tạo sinh.
- Banner trang chủ ưu tiên ảnh sáng, rõ: lớp phủ charcoal giảm dần sang phía phải trên desktop, tập trung độ đậm tại vùng chữ và điều khiển. Mobile dùng lớp phủ theo chiều dọc để giữ chữ dễ đọc trên cả ba ảnh. Mô tả và chữ phụ trên banner dùng `--color-on-dark`.
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
| Meta | Nhãn phạm vi, địa điểm và chú thích ảnh nhỏ hơn body nhưng vẫn đủ tương phản. |

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
- Luồng chính là chọn dịch vụ, đối chiếu dự án cùng phạm vi rồi trao đổi nhu cầu. CTA tư vấn mang slug dịch vụ/dự án vào `/lien-he`; trang này soạn email có subject/body tương ứng và mở ứng dụng email để người đọc tự gửi. Gọi điện và email dùng thông tin thật. Không báo đã gửi yêu cầu hoặc tạo backend giả.
- Dự án có nhãn phạm vi PCCC rõ ràng. Thông tin nguồn và số trang đối chiếu chỉ lưu nội bộ trong dữ liệu/tài liệu; không hiển thị câu dẫn nguồn hoặc link PDF trên thẻ và chi tiết công trình.
- Chỉ nút “Tải hồ sơ PDF” tại trang hồ sơ được nhắc đến định dạng PDF; không nhắc số trang, dung lượng hoặc nguồn hồ sơ ở các khu vực khác. Dung lượng khoảng 67 MB được giữ trong tên truy cập của nút tải. Không nhúng hoặc tự tải PDF.

## Responsive và khả năng tiếp cận

Trang `/ve-lavita` hiển thị nội dung chi tiết trong `aboutCompany` tại `src/data/home.ts`: giới thiệu doanh nghiệp, tầm nhìn, đủ năm nội dung sứ mệnh, năm giá trị cốt lõi kèm diễn giải và kế hoạch tăng trưởng 2023–2027. Nội dung được đối chiếu với các trang PDF 2–5; các giá trị cốt lõi được đọc trực tiếp từ ảnh vì không có trong lớp text. Giới thiệu được biên tập theo nội dung gốc, không chuyển lời tự nhận vị thế hàng đầu thành kết quả đã được xác minh. Tầm nhìn giữ ở dạng mục tiêu. Kế hoạch có năm mốc 25/35/55/85/105 tỷ đồng và ghi rõ là mục tiêu, không gán thành doanh thu hay số liệu thực hiện. Không hiện tham chiếu PDF trên giao diện. Bố cục kết hợp ảnh kỹ thuật viên, ảnh đội thi công, hai cột tầm nhìn/sứ mệnh, danh sách giá trị và biểu đồ cột chuyển thành thanh ngang trên mobile; mục lục giúp chuyển tới từng phần. Nội dung vẫn render trên server; dùng chung hiệu ứng cuộn, hỗ trợ giảm chuyển động.

Theo yêu cầu ngày 17/11/2026, trang Dự án PCCC dùng cấu trúc [Solutions](https://solutions.com.vn/vi/trang-du-an/): banner ảnh rộng không chữ, dải breadcrumb nền ivory ngay dưới banner, khối H1 + form tìm kiếm GET (tên dự án, khu vực), thanh tab hạng mục dạng phân đoạn (tab đang chọn nền charcoal, viền dưới đỏ) và khung trắng chứa lưới ba cột: ảnh tỷ lệ 1,72 bo 8 px, tên công trình in hoa căn giữa, dưới là phạm vi PCCC (đỏ) và khu vực. Tab và form giữ các tham số `dich-vu`, `khu-vuc`, `q`; tìm kiếm không phân biệt dấu. Chưa có phân trang vì mới có bốn dự án; thêm khi danh sách vượt một màn hình. CSS tại `src/app/du-an/projects.css`; giữ token Manrope và nhận diện đỏ–cam. Không dùng ảnh, logo, nội dung hoặc dữ liệu doanh nghiệp của Solutions.

Breadcrumb toàn site: chữ in hoa 12 px, đậm 650, giãn chữ nhẹ, phân cách "/" mờ, không gạch chân; trang hiện tại dùng `--color-brand` (đạt 4,54:1 trên ivory) như mục menu đang chọn. Trên hero tối, link dùng `--color-muted-on-dark`, trang hiện tại dùng `--color-on-dark`. Component `Breadcrumbs` dùng chung vừa hiển thị vừa xuất JSON-LD `BreadcrumbList`.

Theo yêu cầu mới nhất ngày 17/11/2026, trang Về Lavita dùng bố cục [Delta](https://deltagroup.vn/gioi-thieu/): banner ảnh thật với tiêu đề, mô tả và CTA căn giữa; khối Giới thiệu chung nền đỏ đậm chồng lên cuối banner; hai hàng ảnh–chữ xen kẽ cho tầm nhìn và sứ mệnh; giá trị cốt lõi có heading căn giữa và năm nội dung mở. Dùng ảnh PCCC, kỹ thuật viên và đội thi công đã có; không thêm video, giải thưởng, lãnh đạo hoặc đơn vị thành viên chưa được cung cấp. Nút hồ sơ dẫn tới trang HTML. Kế hoạch tăng trưởng và bốn thông tin doanh nghiệp vẫn hiển thị; các mốc vẫn là mục tiêu. Bố cục dùng CSS riêng tại `src/app/ve-lavita/about.css`, không phụ thuộc CSS portfolio. Mobile chuyển một cột theo thứ tự nội dung; hero giãn theo chữ, CTA không bị phần giới thiệu che. Giữ hiệu ứng cuộn và hỗ trợ giảm chuyển động.

`/du-an` hiển thị tất cả dự án; chọn tab hạng mục lọc dự án đúng dịch vụ. Không thêm chủ đầu tư, quy mô hoặc tình trạng dự án khi chưa có dữ liệu; khu vực lấy từ mô tả công trình đã có. Thẻ liên quan ở trang chi tiết giữ hành vi hiện có. Trang chủ dùng bản ảnh Đại Nhật 1800 px đã trích thay cho bản nhỏ của cùng công trình. Mục lục và bộ lọc dùng link thật; nội dung render trên server, mobile chuyển một cột, giảm chuyển động tắt zoom ảnh. Canonical và 14 URL trong sitemap giữ nguyên.

Cập nhật mới nhất: phần bằng cấp/chứng chỉ nhân sự trên hồ sơ đang ẩn theo yêu cầu người dùng, qua `companyProfile.showCredentials = false`. Không render tiêu đề, ảnh kỹ thuật viên, gallery hoặc mục lục tương ứng. Cây tổ chức vẫn hiển thị riêng, có heading và khoảng cách phù hợp khi khối tài liệu nhân sự bị ẩn.

Nội dung công khai dùng mô tả trực tiếp, không có các câu “được giới thiệu trong hồ sơ Lavita”, “theo hồ sơ năng lực”, nhãn “trang PDF” hoặc lời dẫn nguồn tương tự, kể cả alt, metadata và footer. Trình xem tài liệu chỉ có tên và số thứ tự ảnh. Tên trang “Hồ sơ năng lực” và liên kết nội bộ đến trang này vẫn giữ.

“Hồ sơ năng lực” dẫn tới trang HTML `/ho-so-nang-luc` trong cùng tab ở header, footer và CTA tổng quan. Bố cục dùng ảnh gốc từ PDF: hero hệ thống, “Đội ngũ thi công công trình”, “Hồ sơ pháp lý”, “Bằng cấp, chứng chỉ nhân sự”, cây tổ chức và ba cụm dự án theo phạm vi PCCC. Hai tiêu đề tài liệu không có câu diễn giải bên cạnh. Nội dung, ảnh và trang nguồn tại `companyProfile` trong `src/data/home.ts`; ảnh tại `public/images/profile/`. Bản scan hiển thị đủ nội dung, không crop mất dấu/chữ; thumbnail tối ưu riêng, ảnh đầy đủ chỉ mount khi mở trình xem. Gallery là Client Component dùng native `dialog`, hỗ trợ chuyển ảnh, phóng lớn, Tab, Escape và trả focus về ảnh đã chọn; khi không có JavaScript, link mở ảnh gốc. Layout vẫn là Server Component; hiệu ứng cuộn dùng wrapper `ScrollReveal` chung với trang chủ. PDF chỉ có nút tải riêng cuối trang; không tự nhúng hoặc đặt link đối chiếu ở dự án. Không biến kế hoạch tăng trưởng thành thành tích hoặc suy diễn hiệu lực giấy tờ.

“Sản phẩm” là mục riêng sau “Dự án PCCC”, dẫn tới `/san-pham`. Trang dùng danh mục bên trái trên desktop, các lựa chọn xuống dòng trên mobile, form tìm kiếm GET và vùng danh sách. Dữ liệu tại `src/data/products.ts`; hiện chưa có sản phẩm thực tế nên hiển thị đang cập nhật, không tạo thẻ hàng/giá/ảnh/thông số giả. Bốn nhóm ban đầu là cấu trúc để bổ sung sau, không thay đổi ba dịch vụ PCCC. Liên hệ giữ nhóm sản phẩm và chỉ soạn email để người xem tự gửi. Xem [docs/products.md](docs/products.md). Header có sáu mục và không có nút CTA riêng; liên kết Liên hệ vẫn hiển thị. Thay vị trí CTA là năm cờ ngôn ngữ theo thứ tự Anh, Việt, Trung, Hàn, Nhật (SVG tự vẽ trong `src/components/layout/language-flags.tsx`, không dùng emoji; danh sách tại `languages` trong `src/data/home.ts`). Từ 1280 px cờ nằm cuối thanh menu; dưới 1280 px chuyển lên dải tiện ích cạnh số điện thoại để menu không xuống dòng. Hiện chỉ có nội dung tiếng Việt: cờ Việt được đánh dấu đang dùng (gạch đỏ, `aria-pressed`), các cờ khác là `aria-disabled` với chú thích “sắp có” và chưa đổi trang. Khi có bản dịch, gắn hành vi đổi ngôn ngữ vào các nút này. Trên desktop (960–1440 px), chữ menu và logo co giãn cùng nhau theo tỷ lệ cố định: logo bằng 2,25 lần cỡ chữ menu (14–16 px).

Desktop dùng bố cục rộng để cân bằng ảnh và chữ; mobile chuyển thành một cột khi cần, giữ thứ tự đọc và CTA rõ ràng. Hero phải chứa đủ nội dung và điều khiển ở màn hình hẹp hoặc thấp; không dùng chiều cao cố định để che phần tràn. Tên dự án, email và địa chỉ dài được xuống dòng an toàn.

Vùng chạm điều khiển nên đạt ít nhất 44 × 44 px. Menu mobile có tên, trạng thái mở/đóng và đóng bằng Escape; sau khi đóng bằng bàn phím, focus trở về nút menu. “Dịch vụ PCCC” dẫn thẳng tới một trang mô tả ba dịch vụ công ty cung cấp, không có menu con. “Dự án PCCC” giữ liên kết tới trang hạng mục và có nút mũi tên riêng mở ba hạng mục theo dịch vụ từ `src/data/home.ts`; không đưa tên từng công trình vào menu. Số dự án tăng không làm dài menu. Chọn hạng mục mở danh sách dự án cùng `serviceSlug`; chọn công trình trong danh sách mới mở trang chi tiết. Mục navigation đang chọn dùng màu đỏ, không gạch dưới. Chữ và mũi tên cùng đổi màu theo trạng thái mở menu hoặc khi ở nhóm trang dự án. Desktop hỗ trợ rê chuột và bấm nút; mobile mở danh sách ngay trong menu có thể cuộn ở màn hình thấp. Menu con đóng khi bấm bên ngoài, focus rời nhóm trên desktop, chọn liên kết, đổi breakpoint, quay lại lịch sử trình duyệt hoặc nhấn Escape; Escape trả focus về nút mở menu con trước khi đóng toàn bộ menu mobile ở lần nhấn tiếp theo. Skip link dẫn đến nội dung chính. Focus ring rõ trên cả nền sáng và tối; hover không là cách duy nhất để biết một phần tử tương tác được.

Carousel tự chuyển ảnh sau mỗi 3 giây và quay vòng, chỉ hiển thị nút trước/sau với vùng chạm ít nhất 44 px. Khi rê chuột trên hero, tạm dừng và chạy lại sau khi chuột rời đi; khi focus vào nội dung/điều khiển, tạm dừng và chạy lại khi focus rời hero. Sau khi vuốt ảnh, tự chuyển tiếp tục theo chu kỳ. Tab trình duyệt bị ẩn cũng tạm dừng tự chuyển. Trạng thái slide hiện tại phải nhận biết được; chỉ thông báo thay đổi slide cho trình đọc màn hình khi không tự chạy. Slide không hoạt động dùng `inert`. H1 và CTA nằm ngoài các slide để heading luôn hiển thị; hero dùng bố cục có thể giãn theo nội dung khi phóng chữ. Với `prefers-reduced-motion`, tắt tự chuyển ảnh, chuyển động carousel, hover phóng ảnh và cuộn mượt; nút trước/sau vẫn dùng được. Nội dung vẫn hiển thị đầy đủ khi giảm chuyển động.

Trang chủ, `/ve-lavita` và `/ho-so-nang-luc` dùng chung hiệu ứng hiện dần một lần khi cuộn tới: dịch lên 24 px trong 650 ms, lệch nhịp tối đa 210 ms trong cùng nhóm. Trang chủ áp dụng cho dải giới thiệu, dịch vụ, dự án, giới thiệu công ty, giá trị cốt lõi và liên hệ; hero hiển thị ngay. `/ve-lavita` áp dụng cho ảnh, các đoạn giới thiệu, từng giá trị cốt lõi và CTA. Phần đang trong vùng nhìn khi tải trang giữ nguyên. Nội dung render trên server mặc định hiển thị; chỉ bật hiệu ứng sau khi có JavaScript và IntersectionObserver. Khi bật giảm chuyển động hoặc focus bằng bàn phím, nội dung liên quan hiển thị ngay. `/ho-so-nang-luc` áp dụng cho ảnh đội thi công, thông tin doanh nghiệp, các album pháp lý, cây tổ chức, từng cụm dự án và liên hệ; hero và mục lục hiển thị ngay. Nếu bật lại khối chứng chỉ nhân sự, khối này cũng dùng cùng hiệu ứng. Không áp dụng hiệu ứng này lên các trang khác.

Ảnh có kích thước hoặc khung tỷ lệ ổn định để tránh nhảy bố cục. Ảnh nội dung có alt mô tả đúng; icon trang trí ẩn khỏi trình đọc màn hình. Chỉ có một heading cấp 1 cho mỗi trang; cấp heading còn lại phản ánh cấu trúc nội dung.

Trang chủ ưu tiên dịch vụ và dự án trước phần giới thiệu chi tiết. `/dich-vu` mô tả đầy đủ ba dịch vụ theo hai nhóm nhu cầu; các link dịch vụ ở trang chủ, footer và dự án dẫn tới anchor tương ứng tại trang này. Giữ các URL `/dich-vu/[slug]` cũ làm trang thông tin bổ sung, không nhúng danh sách công trình vào trang dịch vụ. `/du-an` hiển thị tất cả dự án; `/du-an?dich-vu=[slug]` lọc danh sách đúng phạm vi PCCC; `/du-an/[slug]` là chi tiết công trình. Breadcrumb chi tiết có đủ dự án → hạng mục dịch vụ → công trình. Header đánh dấu mục hiện tại; footer nhóm link dịch vụ và thông tin công ty. Giữ các section anchor cũ trên trang chủ để các liên kết đã chia sẻ tiếp tục dùng được. Xem [information-architecture.md](information-architecture.md) cho sơ đồ và quy tắc nội dung. Hạng mục chưa có dự án mẫu phải có thông báo rõ, hướng đi qua hồ sơ hoặc liên hệ; không gắn nhầm dự án của nhóm khác.

## Kiểm tra trước khi bàn giao

Kiểm tra desktop và mobile cùng một lượt, gồm bàn phím, menu, slide, CTA, liên kết PDF, gọi điện và email. Xem thêm màn hình hẹp và landscape, nội dung dài, tương phản và chế độ giảm chuyển động. Sửa các lỗi tìm được trong một lượt rồi xác nhận tối đa thêm một lượt. Chạy typecheck và build theo README; không coi build thành công là bằng chứng đã kiểm tra trực quan.

## Hướng dẫn thiết kế được áp dụng

Banner sáng hơn ngày 17/11/2026 đã được kiểm tra trên bản production bằng Chromium ở độ rộng 1440, 844, 390 và 320 px, đủ ba ảnh. Không tràn ngang hoặc có lỗi JavaScript; nút chuyển ảnh dùng được bằng bàn phím và giảm chuyển động tắt tự chạy. Đo tương phản trên vùng nền ảnh phía sau chữ đạt tối thiểu 3,72:1 với H1 và 4,85:1 với chữ thường; Axe không phát hiện vi phạm WCAG A/AA trong banner. Build gồm TypeScript thành công. Chưa kiểm tra thiết bị vật lý/trình duyệt khác; ảnh và báo cáo ở `.tmp/hero-brightness-qa/`.

Trang hồ sơ được áp dụng theo [docs/profile-visual-plan.md](docs/profile-visual-plan.md) và ba tiêu đề người dùng đã sửa ngày 16/11/2026. Bản phác lưu ở `.tmp/profile-visual-plan/`; giao diện thật và ảnh bàn giao được kiểm tra riêng.

Tham khảo [Impeccable của Paul Bakaus](https://github.com/pbakaus/impeccable), phiên bản skill 4.5.2 tại commit [`c63b8dd7dd5a5f3c32eaabe1af76d0694f863ed2`](https://github.com/pbakaus/impeccable/tree/c63b8dd7dd5a5f3c32eaabe1af76d0694f863ed2). Các hướng dẫn đã đọc và áp dụng trực tiếp:

- [SKILL.md](docs/impeccable/SKILL.md): tinh chỉnh phải giữ nhận diện, nội dung và hành vi; kiểm tra trong số lượt giới hạn.
- [craft-floor.md](docs/impeccable/reference/craft-floor.md): typography, tương phản, focus, nội dung thật và tránh khuôn mẫu trang trí.
- [polish.md](docs/impeccable/reference/polish.md): ưu tiên hoàn thiện luồng, khả năng tiếp cận và responsive trước chi tiết thị giác.

Nguồn hướng dẫn và tình trạng launcher được ghi tại [docs/impeccable/README.md](docs/impeccable/README.md). Tài liệu này ghi lại quyết định cho Lavita; không thay thế hồ sơ doanh nghiệp hoặc tạo thêm claim sản phẩm.
