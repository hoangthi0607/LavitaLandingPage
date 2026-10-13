# SEO cho website Lavita

## Dữ liệu và nguồn chuẩn

`src/data/home.ts` tập trung cấu hình `site` và thông tin `company`. Tiêu đề, mô tả, canonical, metadata chia sẻ và structured data dùng các dữ liệu này để giữ thông tin nhất quán với nội dung hiển thị.

Thông tin liên hệ hiện tại theo cập nhật của người dùng:

- Hotline: **0962 381 114**, liên kết gọi điện `tel:+84962381114`.
- Email: **sales@lavitacons.vn**.
- Địa chỉ: **Số 26 - 28 Nguyễn Hoàng, Khu phố 1, Phường Bình Trưng, Thành phố Hồ Chí Minh, Việt Nam**.
- Mã số thuế: **0318182111**.

Khi thay đổi thông tin, sửa dữ liệu trung tâm và đồng bộ số điện thoại hiển thị với liên kết `tel:`. Giữ nội dung dịch vụ, phạm vi PCCC của dự án và các dữ liệu thực đã được cung cấp; không chuyển kế hoạch tăng trưởng thành thành tích doanh thu.

## Metadata, canonical và crawler

`src/app/layout.tsx` khai báo metadata bằng API của Next.js: title, description, tên website, Open Graph, Twitter Card và chỉ dẫn `index, follow`. Origin chuẩn là **https://lavitacons.vn**; canonical của trang chủ là **https://lavitacons.vn/**. Metadata dùng origin public này cả khi xem bản build qua localhost/LAN.

`src/app/robots.ts` tạo `/robots.txt`, cho phép crawler truy cập và chỉ ra sitemap. `src/app/sitemap.ts` tạo `/sitemap.xml` với trang chủ cùng ảnh công trình. Website hiện có một trang; các anchor `#services`, `#projects`, `#contact` là section, không phải URL trang riêng trong sitemap. Không tạo thời điểm sửa đổi giả mỗi lần build.

Canonical, sitemap, URL trong schema và metadata chia sẻ phải cùng origin. Khi bổ sung trang mới, khai báo canonical của trang đó thay vì kế thừa canonical trang chủ. Việc cấu hình DNS hoặc redirect `www` thuộc phần vận hành domain; xem [hướng dẫn HTTPS public](public-https.md). [Google hướng dẫn canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

## Nội dung và structured data

H1 có nội dung rõ về Lavita và phòng cháy chữa cháy, nằm ngoài trạng thái slide của carousel. Đổi slide không làm H1 biến mất hoặc trở thành `inert`. Nội dung dịch vụ và dự án vẫn có trong HTML trang; tên, mô tả, scope và liên kết hồ sơ phục vụ người đọc trước.

`src/data/structured-data.ts` tạo một graph JSON-LD được render bằng native `<script type="application/ld+json">` trong Server Component `src/app/page.tsx`. Chuỗi được escape ký tự `<` trước khi đưa vào HTML.

| Node | Nội dung |
| --- | --- |
| `Organization` | Tên thương hiệu/pháp lý, URL, logo, điện thoại, email, mã số thuế, địa chỉ `PostalAddress` và thông tin liên hệ. |
| `WebSite` | Tên Lavita, URL trang chủ, ngôn ngữ tiếng Việt và publisher. |
| `WebPage` | Tiêu đề/mô tả trang chủ, liên kết với website, doanh nghiệp và các dịch vụ. |
| Sáu `Service` | Tên/mô tả lấy từ danh sách dịch vụ đang hiển thị; provider trỏ về Lavita. |

Các node dùng `@id` tuyệt đối và nhất quán với canonical. Không thêm giờ mở cửa, tọa độ, ratings, reviews, giá, chứng nhận hoặc tài khoản mạng xã hội chưa có nguồn. Structured data hỗ trợ Google hiểu nội dung; không bảo đảm rich result hoặc thứ hạng. [Google Organization](https://developers.google.com/search/docs/appearance/structured-data/organization), [Google site names](https://developers.google.com/search/docs/appearance/site-names).

## Ảnh chia sẻ

`src/app/opengraph-image.tsx` tạo ảnh PNG **1200 × 630** tại `/opengraph-image`, dùng logo và ảnh hệ thống PCCC có trong hồ sơ. Next.js cung cấp metadata ảnh Open Graph theo file convention; Twitter Card dùng cùng ảnh.

Ảnh dùng font static Manrope Semibold 600 được lưu tại `public/fonts/manrope-semibold.ttf`. Nguồn là [aaronbell/manrope, file fonts/ttf/manrope-semibold.ttf](https://github.com/aaronbell/manrope/blob/6f81ebecdf65e4463b798cc07b16a4f8d5216917/fonts/ttf/manrope-semibold.ttf), commit `6f81ebecdf65e4463b798cc07b16a4f8d5216917`; giấy phép OFL hiện có tại `public/fonts/OFL-Manrope.txt`. Font variable dùng cho giao diện vẫn nằm tại `public/fonts/manrope-variable.ttf`.

Ảnh công trình được mã hóa lại thành `public/images/installation-og.png` để bộ tạo ảnh đọc đúng, giữ nguyên nội dung và kích thước ảnh nguồn. Bản WebP vẫn dùng cho giao diện. Ảnh chia sẻ được tạo sẵn khi build.

Kiểm tra ảnh render thực tế sau khi thay nội dung/font, gồm dấu tiếng Việt, xuống dòng, logo và ảnh. Các nền tảng chia sẻ có cache riêng; metadata trong HTML cần khớp với URL ảnh public.

## Google Search Console

Các bước dưới đây do chủ domain thực hiện trong tài khoản Google; chưa có thao tác xác minh tài khoản hoặc gửi sitemap trong phiên chỉnh mã.

1. Mở [Google Search Console](https://search.google.com/search-console) và thêm property dạng **URL prefix** với URL chính xác `https://lavitacons.vn/`.
2. Chọn phương thức xác minh HTML tag. Lấy giá trị `content` của tag `google-site-verification` và đặt vào biến `GOOGLE_SITE_VERIFICATION` trước khi build, qua môi trường hoặc thêm vào `.env.production.local` đang sử dụng:

   ```dotenv
   GOOGLE_SITE_VERIFICATION=gia_tri_content_do_google_cung_cap
   ```

   Chỉ đặt giá trị token, không đặt toàn bộ thẻ `<meta>`. Giữ các biến TLS hiện có. Sau khi build và khởi động lại Next.js, kiểm tra HTML public có tag mới rồi bấm Verify trong Search Console. Metadata này được tạo ở build time; đổi biến rồi chỉ restart server sẽ không cập nhật bản HTML đã build.
3. Có thể chọn phương thức DNS do Search Console hướng dẫn nếu có quyền quản lý DNS. Chỉ thêm record xác minh được Google cung cấp; cách này không cần token trong mã website. Xem [hướng dẫn xác minh quyền sở hữu của Google](https://support.google.com/webmasters/answer/9008080).
4. Sau khi xác minh, gửi sitemap **https://lavitacons.vn/sitemap.xml**.
5. Dùng URL Inspection cho **https://lavitacons.vn/**, kiểm tra trang live và yêu cầu indexing khi trang public đã sẵn sàng.

Không cần đưa mã xác minh thật vào Git. Xác minh property, gửi sitemap và yêu cầu indexing không bảo đảm Google sẽ index ngay hoặc đạt một thứ hạng cụ thể.

## Kiểm tra và giới hạn

Chạy `npm run typecheck` và `npm run build` khi thay metadata hoặc schema. Khởi động lại tiến trình Next.js để phục vụ bản build mới; Caddy tiếp tục xử lý HTTPS public theo [hướng dẫn vận hành](public-https.md).

Kiểm tra HTML production có title, description, canonical, robots, H1 và JSON-LD; kiểm tra `/robots.txt`, `/sitemap.xml`, `/opengraph-image` trả nội dung đúng. Kiểm tra H1 và CTA trên desktop/mobile, sau khi đổi slide, ở màn hình hẹp và khi phóng chữ.

Đã kiểm tra ngày 13.10.2026:

- `npm run typecheck` và `npm run build` thành công; trang chủ và các route SEO được tạo tĩnh.
- 34 kiểm tra production đạt: metadata trong HTML, canonical, schema, số gọi điện, robots, sitemap, PNG 1200 × 630, nội dung khi tắt JavaScript, H1 sau đổi slide, keyboard, menu Escape và reduced motion.
- Không tràn ngang hoặc chồng nội dung hero ở 1440, 900, 844, 390 và 320 px; kiểm tra thêm chữ phóng 200% ở 320 px. Xem trực tiếp ảnh OG và các ảnh chụp hero.
- Axe không phát hiện vi phạm WCAG 2 A/AA và 2.1 A/AA trên desktop/mobile trong phạm vi scan tự động.
- Qua `https://lavitacons.vn`, trang chủ, `/robots.txt`, `/sitemap.xml` và `/opengraph-image` trả HTTP 200; Node xác nhận chứng chỉ được tin cậy với TLS 1.3. Bản mới đang được phục vụ qua Next.js cổng 3000 và Caddy.

Công cụ và báo cáo QA nằm trong `.tmp/seo-qa*`, được Git bỏ qua và không phải dependency của website. Chưa kiểm tra Rich Results Test live của Google, chưa xác minh Search Console, chưa xác nhận trạng thái crawl/index thực tế hoặc đo Core Web Vitals ngoài thực tế. Có thể dùng [Rich Results Test](https://search.google.com/test/rich-results) cho tính năng Google hỗ trợ và [Schema Markup Validator](https://validator.schema.org/) cho graph đầy đủ; site names không nằm trong phạm vi kiểm tra của Rich Results Test.
