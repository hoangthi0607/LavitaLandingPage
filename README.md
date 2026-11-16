# Lavita — Website giới thiệu doanh nghiệp

Next.js App Router + TypeScript + Tailwind CSS v4. Swiper cho slider, Lucide cho icon, Next Image cho tối ưu ảnh. Dữ liệu tại `src/data/home.ts`; bố cục và section độc lập trong `src/components`.

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

## Trang hồ sơ năng lực

Kiểm tra hiệu ứng cuộn ngày 16/11/2026: build gồm TypeScript thành công. Chromium ở 1440 × 900, 390 × 844, 320 × 740 và landscape 844 × 390 xác nhận nội dung hiện dần một lần, không tràn ngang. Đã kiểm tra mục lục, focus bàn phím, trình xem ảnh/Escape/trả focus, chế độ giảm chuyển động, tắt JavaScript và thiếu IntersectionObserver. Axe không phát hiện vi phạm WCAG A/AA ở 1440/390 px; không có lỗi JavaScript. Trang chủ và Về Lavita giữ hiệu ứng hiện có. Chưa kiểm tra thiết bị vật lý hoặc trình duyệt khác. Báo cáo/ảnh tại `.tmp/profile-reveal-qa/`.

Theo yêu cầu mới nhất, toàn website chỉ nhắc PDF ở nút **Tải hồ sơ PDF** trên `/ho-so-nang-luc`. Đã bỏ câu dẫn nguồn, số trang, ghi chú ngày bản hồ sơ, link đối chiếu trong dịch vụ/dự án và chú thích nguồn ở footer; gallery chỉ hiển thị tên và thứ tự ảnh. Các trường `sourcePage`/`profilePage` và nguồn trong tài liệu phát triển là tham chiếu nội bộ, không đưa lên giao diện. Liên kết điều hướng **Hồ sơ năng lực** vẫn dẫn tới trang HTML.

Đã kiểm tra bản dọn nội dung ngày 16/11/2026: build gồm kiểm tra TypeScript thành công. Chromium đi qua 14 trang chuẩn và ba query hạng mục ở cả 1440/390 px, không tràn ngang hoặc có dẫn nguồn PDF ngoài nút tải; tên ảnh/metadata đã được rà. Trình xem tài liệu giữ chuyển ảnh/Escape/focus; CTA dự án giữ đúng ngữ cảnh liên hệ. Axe không phát hiện vi phạm WCAG A/AA trên trang hồ sơ và chi tiết Đại Nhật ở 390 px. Tệp tải trả 200 qua HEAD. Chưa kiểm tra thiết bị vật lý/trình duyệt khác. Báo cáo/ảnh ở `.tmp/pdf-copy-qa/`.

Theo cập nhật mới nhất, `companyProfile.showCredentials = false` ẩn khối bằng cấp/chứng chỉ (gồm tiêu đề, ảnh kỹ thuật viên, gallery và mục lục tương ứng) ngay từ render server. Dữ liệu được giữ để có thể bật lại; cây tổ chức và hồ sơ pháp lý tiếp tục hiển thị.

`/ho-so-nang-luc` áp dụng [bố cục đã chốt](docs/profile-visual-plan.md): ảnh hệ thống và đội thi công, hai album pháp lý, bốn bằng cấp/chứng chỉ nhân sự, cây tổ chức và ba cụm dự án theo phạm vi PCCC. Tiêu đề dùng đúng **Đội ngũ thi công công trình**, **Hồ sơ pháp lý**, **Bằng cấp, chứng chỉ nhân sự**. Header, footer và CTA tổng quan dẫn vào trang trong cùng tab. Nội dung/ảnh/trang nguồn nằm trong `companyProfile` tại `src/data/home.ts`; tài nguyên WebP tại `public/images/profile/` được trích từ PDF. Giữ thông tin liên hệ hiện tại trong `company` và không khôi phục dịch vụ đã gỡ.

`DocumentGallery` xử lý tương tác xem ảnh trong nội dung hồ sơ: thumbnail mở native `dialog`, có trước/sau, phóng lớn, ảnh gốc, Escape và trả focus về thumbnail. Bản đầy đủ không tải trước khi mở; các bản scan dùng WebP lossless để không giảm thêm chất lượng tệp trích. Khi tắt JavaScript, link mở thẳng ảnh gốc. Layout vẫn render trên server; wrapper `ScrollReveal` dùng chung với trang chủ giúp các nhóm nội dung hiện dần một lần khi cuộn tới, còn hero và mục lục hiển thị ngay. Hiệu ứng tắt khi giảm chuyển động; nội dung vẫn hiện khi không có JavaScript hoặc IntersectionObserver. PDF gốc nằm ở nút tải cuối trang; server vẫn cần `public/documents/ho-so-nang-luc-lavita.pdf`. Không gắn nhãn hiệu lực hiện tại cho tài liệu trong bản hồ sơ 10/07/2025.

Kiểm tra bản dùng ảnh ngày 16/11/2026: typecheck/build thành công; Chromium ở bảy viewport 320–1440 px, gồm landscape, không tràn ngang. Đã kiểm tra ảnh, menu mobile, anchor, ba album/tám bản scan, chuyển ảnh, zoom, vòng Tab, Escape, trả focus và khôi phục cuộn trang. Axe không phát hiện vi phạm WCAG A/AA ở 1440 và 390 px trên cả trang và dialog. Bản đầy đủ/PDF không tự tải trước khi chọn; PDF trả 200 qua HEAD. Nội dung/ảnh hoạt động khi tắt JavaScript và ở cả hai chế độ chuyển động. Chưa kiểm tra thiết bị vật lý hoặc trình duyệt khác; độ rõ tài liệu bị giới hạn bởi ảnh gốc. Báo cáo/ảnh QA nằm ở `.tmp/profile-image-qa/` được Git bỏ qua.


## Danh mục sản phẩm

Mục **Sản phẩm** tại `/san-pham` có nhóm sản phẩm, tìm kiếm theo tên/mã và liên hệ giữ ngữ cảnh. Người dùng chưa cung cấp danh sách thực tế nên danh mục hiển thị đang cập nhật. Bổ sung dữ liệu đã xác nhận trong `src/data/products.ts`; không tự điền thương hiệu, giá hoặc thông số. Xem [hướng dẫn sản phẩm](docs/products.md). Ba dịch vụ PCCC hiện có được giữ riêng.

## SEO

Trang chủ có metadata, canonical `https://lavitacons.vn/`, robots/sitemap, JSON-LD và ảnh chia sẻ 1200 × 630. Dữ liệu trung tâm nằm tại `src/data/home.ts`; H1 giữ nguyên khi đổi slide. Xem [hướng dẫn SEO và Search Console](docs/seo.md) để cập nhật nội dung, xác minh domain và gửi sitemap. Chưa thực hiện xác minh Search Console hoặc kiểm tra Rich Results Test live của Google.

## Hướng dẫn thiết kế

### Kiến trúc thông tin

Trang dịch vụ mô tả công ty cung cấp những gì. Khu vực dự án đi theo luồng **hạng mục dịch vụ → danh sách dự án cùng hạng mục → chi tiết dự án → liên hệ giữ ngữ cảnh**. [information-architecture.md](information-architecture.md) ghi sitemap, taxonomy, navigation, quy tắc URL/query và các trường hợp chưa có dự án mẫu. Hướng dẫn [RampStack Information Architecture](docs/information-architecture/README.md) được lưu cùng nguồn/license; không cài thành runtime hoặc skill toàn cục. Các giả thuyết về người đọc và nhãn nhóm chưa được kiểm chứng bằng nghiên cứu người dùng.

[DESIGN.md](DESIGN.md) ghi nhận bảng màu, typography, bố cục, CTA, responsive và khả năng tiếp cận của Lavita. Khi chỉnh giao diện, giữ thông tin theo hồ sơ và đối chiếu các quy tắc này.

Thiết kế áp dụng hướng dẫn từ [Impeccable](https://github.com/pbakaus/impeccable); bản tham khảo tại [docs/impeccable/SKILL.md](docs/impeccable/SKILL.md). Nguồn, commit, giấy phép và tình trạng CLI được ghi trong [docs/impeccable/README.md](docs/impeccable/README.md).
