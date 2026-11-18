# Lavita — Website giới thiệu doanh nghiệp

Next.js App Router + TypeScript + Tailwind CSS v4. Swiper cho slider, Lucide cho icon, Next Image cho tối ưu ảnh. Dữ kiện và cấu trúc tại `src/data/home.ts`, chữ hiển thị theo ngôn ngữ tại `src/i18n/dictionaries/` (xem mục Đa ngôn ngữ); bố cục và section độc lập trong `src/components`.

## Chạy dự án

HTTPS local làm theo [hướng dẫn chính thức của Vercel](https://vercel.com/kb/guide/access-nextjs-localhost-https-certificate-self-signed): để Next.js tạo chứng chỉ được ký bởi CA local của mkcert.

```sh
npm install
npm run dev
```

Truy cập https://localhost:3000. Lệnh `dev` sử dụng HTTPS local của Next.js (`--experimental-https`). Nếu đang chạy server HTTP, dừng bằng Ctrl+C rồi chạy lại `npm run dev`.

Lần đầu, Next.js tải `mkcert`, tạo chứng chỉ cho `localhost`, `127.0.0.1` và `::1`, đồng thời cài CA local để trình duyệt tin cậy. Windows có thể yêu cầu xác nhận cài chứng chỉ. Các chứng chỉ nằm trong `certificates/` và được Git bỏ qua. Nếu bước tạo chứng chỉ thất bại, Next.js có thể quay về HTTP; kiểm tra dòng `Local:` phải bắt đầu bằng `https://` và xử lý lỗi `mkcert` trước khi tiếp tục.

Mỗi máy tạo chứng chỉ riêng. Trên máy mới, chạy `npm run dev` một lần, chờ URL HTTPS xuất hiện rồi dừng bằng Ctrl+C nếu muốn chạy bản build. Những lần chạy sau dùng lại chứng chỉ; không cần tạo lại khi build.

## Chạy bản build bằng HTTPS

Tên miền public `lavitacons.vn` dùng CA công khai qua Caddy. Xem [hướng dẫn HTTPS public](docs/public-https.md); chứng chỉ mkcert bên dưới dành cho localhost/LAN và kết nối backend.

```sh
npm run build
npm run start
```

Mở https://localhost:3000. `build` biên dịch website; `start` chạy Next.js ở production mode qua server HTTPS trong `scripts/start-https.mjs`. Server dùng lại `certificates/localhost-key.pem` và `certificates/localhost.pem` đã tạo khi chạy `npm run dev`. Nếu thiếu, hết hạn hoặc chứng chỉ không hợp lệ, server dừng và báo lỗi; không chuyển sang HTTP.

Theo bài Vercel, `--experimental-https` chỉ áp dụng cho `next dev`. Server Node.js HTTPS dùng cùng key/cert để phục vụ bản production build trên máy local. Không thêm cờ này vào `next build` hoặc `next start`.

Nếu trình duyệt vẫn báo lỗi chứng chỉ, kiểm tra CA mkcert đã được tin cậy và URL đúng hostname của chứng chỉ. Với một tiến trình Node.js khác cần gọi HTTPS local, đặt `NODE_EXTRA_CA_CERTS` tới `rootCA.pem` trước khi khởi động tiến trình; dùng thư mục CA mà Next.js in ra khi tạo chứng chỉ. Không tắt kiểm tra TLS để bỏ qua lỗi.

Để đổi cổng: `npm run start -- --port 3001`. Có thể dùng `--hostname`/`-H` và `--port`/`-p`.

### Truy cập bằng IP trong mạng LAN

`npm run start` mặc định lắng nghe trên `0.0.0.0` để nhận kết nối qua localhost và IP mạng. Terminal in URL `Network:` ứng với IP hiện tại. Nếu file `.env.production.local` có `HTTPS_HOST=localhost`, đổi thành `HTTPS_HOST=0.0.0.0`; hoặc chạy `npm run start -- --hostname 0.0.0.0` để ghi đè.

Chứng chỉ cũng phải bao gồm IP bạn dùng. Với mkcert, tạo chứng chỉ có cả localhost và IP LAN (thay `192.168.1.208` bằng IP hiện tại nếu thay đổi):

```sh
mkcert -key-file certificates/localhost-key.pem -cert-file certificates/localhost.pem localhost 127.0.0.1 ::1 192.168.1.208
```

Dùng cùng CA local đã tạo trước đó. Nếu mkcert chưa có trong PATH, dùng đường dẫn đầy đủ tới executable của mkcert. Khởi động lại server sau khi tạo chứng chỉ; không cần build lại khi chỉ đổi chứng chỉ hoặc script server.

Trên máy này, mở https://192.168.1.208:3000. Nếu truy cập từ máy/điện thoại khác, thiết bị đó cần tin cậy CA `rootCA.pem` theo [hướng dẫn Vercel về HTTPS từ thiết bị khác](https://vercel.com/kb/guide/access-nextjs-localhost-https-certificate-self-signed#how-to-test-local-https-from-a-phone-or-another-device). Chỉ chia sẻ chứng chỉ CA công khai; giữ private key trên máy tạo chứng chỉ. Nếu thiết bị khác vẫn không kết nối được, kiểm tra firewall Windows cho TCP cổng 3000 trong mạng đang dùng.

Khi chạy trên tên miền thật, cung cấp chứng chỉ hợp lệ cho tên miền bằng biến môi trường hoặc file `.env.production.local`:

```dotenv
PORT=3000
HTTPS_HOST=0.0.0.0
HTTPS_KEY_FILE=certificates/privkey.pem
HTTPS_CERT_FILE=certificates/fullchain.pem
```

Đường dẫn chứng chỉ có thể là tuyệt đối hoặc tương đối với thư mục dự án. `HTTPS_CERT_FILE` chứa chứng chỉ máy chủ và chuỗi chứng chỉ trung gian (fullchain). Chứng chỉ localhost chỉ hợp lệ cho máy local, không thay thế chứng chỉ tên miền. Private key và file `.env.production.local` được Git bỏ qua khi đặt trong các đường dẫn như ví dụ.

Server này cần Node.js và bản build Next.js thông thường cùng `node_modules`, `public`, `scripts` và `.next`. Không sử dụng `output: 'standalone'` hoặc static export với lệnh start này. Tham khảo [Next.js: Custom Server](https://nextjs.org/docs/app/guides/custom-server).

Kiểm tra bằng `npm run typecheck` và `npm run build`. Tham khảo [Next.js: HTTPS during development](https://nextjs.org/docs/app/api-reference/cli/next#using-https-during-development).

`typecheck` tạo lại kiểu route bằng `next typegen` trước khi chạy TypeScript. Cấu hình TypeScript kiểm tra mã nguồn và `.next/types`, đồng thời loại trừ cache `.next/dev` để các route cũ từ lần chạy dev trước không làm lỗi bản build sau khi đổi cấu trúc thư mục.

## Nguồn nội dung

Dựa trên `HSNL- LAVITA- CHUẨN 10.07.25 (3) (1).pdf` do người dùng cung cấp, gồm 32 trang PDF dạng trang đôi:

- Giới thiệu và năm thành lập: trang PDF 2.
- Giá trị cốt lõi: trang PDF 4.
- Sáu lĩnh vực kinh doanh: trang PDF 16.
- Chung cư Đại Nhật và Crescent Mall — thiết kế PCCC: trang PDF 18–19.
- Chung cư C2 Bình Dương — thi công PCCC: trang PDF 22.
- The Pegasuite — bảo trì PCCC: trang PDF 25.
- Đào tạo và huấn luyện: trang PDF 27.
- Hotline, email, địa chỉ, mã số thuế: trang PDF 32.

Hình ảnh tại `public/images` được trích từ hồ sơ; biểu tượng lấy từ `image.png`. Bản PDF có thể mở qua `/documents/ho-so-nang-luc-lavita.pdf` (khoảng 67 MB). Website chỉ tải PDF khi truy cập liên kết; không nhúng PDF vào trang chủ. Nội dung kế hoạch tăng trưởng không được dùng làm doanh thu thực tế.

### File lớn không đưa lên GitHub

PDF nguồn `HSNL-*.pdf`, ảnh gốc `image.png` và các PDF trong `public/documents/` được Git bỏ qua để repository nhẹ hơn. Các ảnh, font và icon đang dùng trên website vẫn được quản lý trong Git.

Khi clone sang máy/server khác, chép hồ sơ năng lực vào `public/documents/ho-so-nang-luc-lavita.pdf` trước khi phục vụ website. File này cần có trên server để các liên kết hồ sơ và dự án mở được PDF. Nếu đã chép PDF nguồn vào thư mục gốc, dùng PowerShell:

```powershell
New-Item -ItemType Directory -Path public/documents -Force | Out-Null
Copy-Item -LiteralPath 'HSNL- LAVITA- CHUẨN 10.07.25 (3) (1).pdf' -Destination 'public/documents/ho-so-nang-luc-lavita.pdf'
```

Giữ bản gốc ngoài Git hoặc sao lưu riêng; `.gitignore` không xóa file trên máy. Khi push, chỉ đưa nhánh mã nguồn cần dùng lên GitHub.

## Phạm vi

Website Lavita có trang chủ, một trang mô tả ba dịch vụ, trang chọn hạng mục dự án, danh sách dự án theo từng hạng mục và bốn trang chi tiết công trình, giới thiệu công ty và liên hệ. Menu “Dự án PCCC” chỉ liệt kê hạng mục dịch vụ; chọn hạng mục mới xem danh sách, chọn công trình mới xem chi tiết. Ba URL thông tin dịch vụ chi tiết cũ vẫn hoạt động; các lối vào dịch vụ chính dẫn tới phần mô tả tương ứng trên `/dich-vu`. Trang liên hệ giữ lựa chọn và hỗ trợ soạn email. Menu responsive, slider, liên kết hồ sơ, gọi điện và email có thể sử dụng. Dự án ghi rõ phạm vi PCCC, không thể hiện Lavita là tổng thầu toàn bộ công trình. Chưa có CMS/backend nhận yêu cầu; người đọc tự gửi nội dung qua ứng dụng email. Thông tin liên hệ hiện tại lấy từ `src/data/home.ts` theo cập nhật của người dùng: hotline **0962 381 114** và địa chỉ **Số 26 - 28 Nguyễn Hoàng, Khu phố 1, Phường Bình Trưng, Thành phố Hồ Chí Minh, Việt Nam**.

Website được phục vụ trên máy Windows qua Next.js và Caddy cho tên miền public `lavitacons.vn`; xem [hướng dẫn vận hành HTTPS](docs/public-https.md).

## Trang Về Lavita

`/ve-lavita` trình bày giới thiệu, tầm nhìn, đủ năm nội dung sứ mệnh, năm giá trị cốt lõi với diễn giải và kế hoạch tăng trưởng 2023–2027. Chữ tại `about` trong `src/i18n/dictionaries/*.ts`, ảnh và mốc kế hoạch (`aboutImages`, `growthMilestones`) trong `src/data/home.ts`; bố cục Server Component ở `src/components/content/company-story.tsx`, CSS riêng tại `src/app/ve-lavita/about.css`. Trang chủ tiếp tục hiển thị bản tổng quan. Biểu đồ thể hiện các mục tiêu 25/35/55/85/105 tỷ đồng, có chú thích rõ là kế hoạch; không gọi các giá trị này là doanh thu thực hiện.

Kiểm tra ngày 17/11/2026: build gồm TypeScript thành công; Chromium ở 1440/960/390/320 px và landscape 844 × 390 không tràn ngang, đủ nội dung và ảnh. Các mốc kế hoạch được đối chiếu với text nguồn, các giá trị được đối chiếu với ảnh gốc. Đã kiểm tra mục lục, bàn phím, hiệu ứng hiện dần, giảm chuyển động, tắt JavaScript và cỡ chữ gấp đôi. Axe không phát hiện vi phạm WCAG A/AA ở 1440/390 px. Chưa kiểm tra thiết bị vật lý hoặc trình duyệt khác; báo cáo/ảnh ở `.tmp/about-detail-qa/`.

Bố cục Về Lavita theo yêu cầu mới nhất ngày 17/11/2026 tham khảo [Delta](https://deltagroup.vn/gioi-thieu/): banner căn giữa, khối Giới thiệu chung màu đỏ chồng lên banner, ảnh–nội dung xen kẽ cho tầm nhìn/sứ mệnh và phần giá trị cốt lõi căn giữa. Dùng ảnh thật sẵn có; CTA dẫn đến trang hồ sơ HTML và hạng mục dự án. Không thêm video, giải thưởng hoặc đơn vị thành viên. Trang dùng riêng `src/app/ve-lavita/about.css`; trang Dự án tiếp tục dùng phong cách ảnh lớn từ [Dcons](https://dcons.vn/du-an), CSS `src/components/content/portfolio.css` và `src/app/du-an/projects.css`. Dữ liệu dự án ở `projectBase` (`src/data/home.ts`) và `projectsPage`/`projects` trong từ điển, nội dung doanh nghiệp ở `about` trong từ điển. Metadata/canonical và 14 URL sitemap giữ nguyên.

Kiểm tra bố cục Delta: build gồm TypeScript thành công; Chromium ở 1440/960/390/320 px và landscape 844 × 390 không tràn ngang. Khối giới thiệu chồng đúng vào banner và không che CTA. Nội dung sứ mệnh/giá trị/kế hoạch được giữ đầy đủ, có ảnh thật; đã kiểm tra bàn phím, mục lục, giảm chuyển động, không JavaScript và cỡ chữ gấp đôi. Axe không phát hiện vi phạm WCAG A/AA ở 1440/390 px; đo nền ảnh phía sau chữ hero đạt tối thiểu 5,02:1. Trang chủ và luồng hạng mục dự án giữ hành vi hiện có. Chưa kiểm tra thiết bị vật lý hoặc trình duyệt khác; ảnh/báo cáo tại `.tmp/about-delta-qa/`, tham khảo trực quan ở `.tmp/delta-reference/`.

Kiểm tra bản portfolio: build gồm TypeScript thành công; Chromium đi qua hai trang và ba query hạng mục ở 1440/960/390/320 px và landscape 844 × 390 (25 lượt), không tràn ngang hoặc có lỗi JavaScript. Axe không phát hiện vi phạm WCAG A/AA ở cả hai trang và danh sách thiết kế tại 1440/390 px. Đã kiểm tra bàn phím từ bộ lọc → chi tiết → liên hệ đúng ngữ cảnh, menu mobile, cỡ chữ gấp đôi, giảm chuyển động và không JavaScript; các mốc mục tiêu đối chiếu với dữ liệu gốc. Chưa kiểm tra thiết bị vật lý/trình duyệt khác. Báo cáo/ảnh tại `.tmp/portfolio-redesign-qa/`; tham khảo trực quan nội bộ ở `.tmp/dcons-reference/`.

## Trang hồ sơ năng lực

Kiểm tra hiệu ứng cuộn ngày 16/11/2026: build gồm TypeScript thành công. Chromium ở 1440 × 900, 390 × 844, 320 × 740 và landscape 844 × 390 xác nhận nội dung hiện dần một lần, không tràn ngang. Đã kiểm tra mục lục, focus bàn phím, trình xem ảnh/Escape/trả focus, chế độ giảm chuyển động, tắt JavaScript và thiếu IntersectionObserver. Axe không phát hiện vi phạm WCAG A/AA ở 1440/390 px; không có lỗi JavaScript. Trang chủ và Về Lavita giữ hiệu ứng hiện có. Chưa kiểm tra thiết bị vật lý hoặc trình duyệt khác. Báo cáo/ảnh tại `.tmp/profile-reveal-qa/`.

Theo yêu cầu mới nhất, toàn website chỉ nhắc PDF ở nút **Tải hồ sơ PDF** trên `/ho-so-nang-luc`. Đã bỏ câu dẫn nguồn, số trang, ghi chú ngày bản hồ sơ, link đối chiếu trong dịch vụ/dự án và chú thích nguồn ở footer; gallery chỉ hiển thị tên và thứ tự ảnh. Các trường `sourcePage`/`profilePage` và nguồn trong tài liệu phát triển là tham chiếu nội bộ, không đưa lên giao diện. Liên kết điều hướng **Hồ sơ năng lực** vẫn dẫn tới trang HTML.

Đã kiểm tra bản dọn nội dung ngày 16/11/2026: build gồm kiểm tra TypeScript thành công. Chromium đi qua 14 trang chuẩn và ba query hạng mục ở cả 1440/390 px, không tràn ngang hoặc có dẫn nguồn PDF ngoài nút tải; tên ảnh/metadata đã được rà. Trình xem tài liệu giữ chuyển ảnh/Escape/focus; CTA dự án giữ đúng ngữ cảnh liên hệ. Axe không phát hiện vi phạm WCAG A/AA trên trang hồ sơ và chi tiết Đại Nhật ở 390 px. Tệp tải trả 200 qua HEAD. Chưa kiểm tra thiết bị vật lý/trình duyệt khác. Báo cáo/ảnh ở `.tmp/pdf-copy-qa/`.

Theo cập nhật mới nhất, `profileBase.showCredentials = false` (`src/data/home.ts`) ẩn khối bằng cấp/chứng chỉ (gồm tiêu đề, ảnh kỹ thuật viên, gallery và mục lục tương ứng) ngay từ render server. Dữ liệu được giữ để có thể bật lại; cây tổ chức và hồ sơ pháp lý tiếp tục hiển thị.

`/ho-so-nang-luc` áp dụng [bố cục đã chốt](docs/profile-visual-plan.md): ảnh hệ thống và đội thi công, hai album pháp lý, bốn bằng cấp/chứng chỉ nhân sự, cây tổ chức và ba cụm dự án theo phạm vi PCCC. Tiêu đề dùng đúng **Đội ngũ thi công công trình**, **Hồ sơ pháp lý**, **Bằng cấp, chứng chỉ nhân sự**. Header, footer và CTA tổng quan dẫn vào trang trong cùng tab. Ảnh/trang nguồn nằm trong `profileBase` tại `src/data/home.ts`, chữ trong `profile` của từ điển; tài nguyên WebP tại `public/images/profile/` được trích từ PDF. Giữ thông tin liên hệ hiện tại trong `company` và không khôi phục dịch vụ đã gỡ.

`DocumentGallery` xử lý tương tác xem ảnh trong nội dung hồ sơ: thumbnail mở native `dialog`, có trước/sau, phóng lớn, ảnh gốc, Escape và trả focus về thumbnail. Bản đầy đủ không tải trước khi mở; các bản scan dùng WebP lossless để không giảm thêm chất lượng tệp trích. Khi tắt JavaScript, link mở thẳng ảnh gốc. Layout vẫn render trên server; wrapper `ScrollReveal` dùng chung với trang chủ giúp các nhóm nội dung hiện dần một lần khi cuộn tới, còn hero và mục lục hiển thị ngay. Hiệu ứng tắt khi giảm chuyển động; nội dung vẫn hiện khi không có JavaScript hoặc IntersectionObserver. PDF gốc nằm ở nút tải cuối trang; server vẫn cần `public/documents/ho-so-nang-luc-lavita.pdf`. Không gắn nhãn hiệu lực hiện tại cho tài liệu trong bản hồ sơ 10/07/2025.

Kiểm tra bản dùng ảnh ngày 16/11/2026: typecheck/build thành công; Chromium ở bảy viewport 320–1440 px, gồm landscape, không tràn ngang. Đã kiểm tra ảnh, menu mobile, anchor, ba album/tám bản scan, chuyển ảnh, zoom, vòng Tab, Escape, trả focus và khôi phục cuộn trang. Axe không phát hiện vi phạm WCAG A/AA ở 1440 và 390 px trên cả trang và dialog. Bản đầy đủ/PDF không tự tải trước khi chọn; PDF trả 200 qua HEAD. Nội dung/ảnh hoạt động khi tắt JavaScript và ở cả hai chế độ chuyển động. Chưa kiểm tra thiết bị vật lý hoặc trình duyệt khác; độ rõ tài liệu bị giới hạn bởi ảnh gốc. Báo cáo/ảnh QA nằm ở `.tmp/profile-image-qa/` được Git bỏ qua.


## Danh mục sản phẩm

Mục **Sản phẩm** tại `/san-pham` có nhóm sản phẩm, tìm kiếm theo tên/mã và liên hệ giữ ngữ cảnh. Người dùng chưa cung cấp danh sách thực tế nên danh mục hiển thị đang cập nhật. Bổ sung dữ liệu đã xác nhận trong `src/data/products.ts`; không tự điền thương hiệu, giá hoặc thông số. Xem [hướng dẫn sản phẩm](docs/products.md). Ba dịch vụ PCCC hiện có được giữ riêng.

## Đa ngôn ngữ

Website có năm ngôn ngữ theo thứ tự cờ trên header: tiếng Anh, tiếng Việt, tiếng Trung (giản thể), tiếng Hàn, tiếng Nhật. Tiếng Việt là ngôn ngữ mặc định và giữ nguyên URL cũ (`/dich-vu`); các ngôn ngữ khác thêm tiền tố `/en`, `/zh`, `/ko`, `/ja` (`/en/dich-vu`). Slug, anchor và query (`?dich-vu=`, `?trang=`) giống nhau ở mọi ngôn ngữ. `/vi/...` chuyển hướng 308 về URL không tiền tố. Không tự chuyển ngôn ngữ theo trình duyệt: người xem và công cụ tìm kiếm luôn nhận đúng ngôn ngữ mà URL ghi.

- **Định tuyến:** mọi trang nằm trong `src/app/[lang]/` (root layout đặt `<html lang>` theo ngôn ngữ). `rewrites()` trong `next.config.ts` phục vụ URL không tiền tố bằng `lang = "vi"` (định tuyến nội bộ, không phụ thuộc Host của Caddy). Danh sách ngôn ngữ nằm trong `src/i18n/config.ts`; nếu thêm ngôn ngữ, cập nhật cả `prefixedLocales` trong `next.config.ts`.
- **Nội dung:** dữ kiện và cấu trúc (slug, ảnh, liên hệ, mã số thuế, mốc kế hoạch) ở `src/data/home.ts` và `src/data/products.ts`, khai báo một lần cho mọi ngôn ngữ. Chữ hiển thị ở `src/i18n/dictionaries/`: `vi.ts` là bản gốc và định nghĩa kiểu `Dictionary`, TypeScript báo lỗi nếu bản dịch thiếu hoặc thừa khóa. `getContent()` (`src/i18n/content.ts`) ghép hai phần theo ngôn ngữ của request qua `next/root-params`; từ điển chỉ chạy trên server.
- **Liên kết:** dùng `Link` từ `@/i18n/link` thay cho `next/link` để tự thêm tiền tố ngôn ngữ; form GET dùng `localizeHref()`. Nút cờ (`language-flags.tsx`) dẫn tới cùng trang ở ngôn ngữ khác, giữ query và anchor.
- **SEO:** mỗi trang có canonical theo ngôn ngữ và `hreflang` cho cả năm bản cùng `x-default` (tiếng Việt); sitemap liệt kê mọi trang × ngôn ngữ kèm alternates. JSON-LD dùng `inLanguage` theo trang; `availableLanguage` của kênh tư vấn vẫn là `vi`.
- **Phạm vi chưa dịch:** tin tức và văn bản từ Cục Cảnh sát PCCC và CNCH chỉ có tiếng Việt; phần giao diện được dịch, nội dung bài giữ `lang="vi"` và có ghi chú ngôn ngữ. Địa chỉ trụ sở, tên riêng công trình/nhân sự và file PDF hồ sơ năng lực giữ tiếng Việt (nút tải ghi rõ bản tiếng Việt). Ảnh chia sẻ `/opengraph-image` dùng chung bản tiếng Việt. Khi thêm sản phẩm, điền `translations` cho các ngôn ngữ khác; thiếu bản dịch sẽ hiển thị tiếng Việt.
- **Bản dịch** tiếng Anh, Trung, Hàn, Nhật do AI soạn từ nội dung tiếng Việt hiện có, giữ nguyên dữ kiện, phạm vi PCCC và nhãn “kế hoạch, không phải doanh thu thực hiện”. Nên nhờ người bản ngữ rà soát trước khi quảng bá rộng.

Kiểm tra ngày 18/11/2026: typecheck và build thành công (81 trang tĩnh cho 5 ngôn ngữ). Chromium xác nhận cờ chuyển đúng trang và giữ query/anchor (vi→en→ja→vi), liên kết header/CTA/form tìm kiếm giữ ngôn ngữ, ngữ cảnh liên hệ và tiêu đề email theo ngôn ngữ, 404 trả mã 404 với nội dung đã dịch, `/vi/...` chuyển hướng 308. Không tràn ngang ở 9 trang × 5 ngôn ngữ × 1440/1100/390/320 px, menu desktop không tràn. Axe không phát hiện vi phạm WCAG A/AA trên 4 trang × 5 ngôn ngữ ở 1440/390 px; cờ truy cập được bằng bàn phím. Giới hạn: trang 404 (URL lạ và slug sai) chỉ hiển thị nội dung sau khi JavaScript chạy, như hành vi sẵn có của trang slug sai; chưa kiểm tra thiết bị vật lý, Safari/Firefox hoặc phông CJK trên macOS/iOS. Script/ảnh QA ở `.tmp/i18n-qa*`.

## SEO

Trang chủ có metadata, canonical `https://lavitacons.vn/`, robots/sitemap, JSON-LD và ảnh chia sẻ 1200 × 630. Dữ liệu trung tâm nằm tại `src/data/home.ts`; H1 giữ nguyên khi đổi slide. Xem [hướng dẫn SEO và Search Console](docs/seo.md) để cập nhật nội dung, xác minh domain và gửi sitemap. Chưa thực hiện xác minh Search Console hoặc kiểm tra Rich Results Test live của Google.

## Hướng dẫn thiết kế

### Kiến trúc thông tin

Trang dịch vụ mô tả công ty cung cấp những gì. Khu vực dự án đi theo luồng **hạng mục dịch vụ → danh sách dự án cùng hạng mục → chi tiết dự án → liên hệ giữ ngữ cảnh**. [information-architecture.md](information-architecture.md) ghi sitemap, taxonomy, navigation, quy tắc URL/query và các trường hợp chưa có dự án mẫu. Hướng dẫn [RampStack Information Architecture](docs/information-architecture/README.md) được lưu cùng nguồn/license; không cài thành runtime hoặc skill toàn cục. Các giả thuyết về người đọc và nhãn nhóm chưa được kiểm chứng bằng nghiên cứu người dùng.

[DESIGN.md](DESIGN.md) ghi nhận bảng màu, typography, bố cục, CTA, responsive và khả năng tiếp cận của Lavita. Khi chỉnh giao diện, giữ thông tin theo hồ sơ và đối chiếu các quy tắc này.

Thiết kế áp dụng hướng dẫn từ [Impeccable](https://github.com/pbakaus/impeccable); bản tham khảo tại [docs/impeccable/SKILL.md](docs/impeccable/SKILL.md). Nguồn, commit, giấy phép và tình trạng CLI được ghi trong [docs/impeccable/README.md](docs/impeccable/README.md).
