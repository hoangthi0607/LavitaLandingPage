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

Trang chủ Lavita gồm hero, giới thiệu, dịch vụ, dự án, năng lực, huấn luyện và liên hệ. Menu responsive, slider, liên kết hồ sơ, gọi điện và email có thể sử dụng. Dự án ghi rõ phạm vi PCCC, không thể hiện Lavita là tổng thầu toàn bộ công trình. Chưa có CMS/backend, trang chi tiết hoặc biểu mẫu gửi yêu cầu. Thông tin liên hệ hiện tại lấy từ `src/data/home.ts` theo cập nhật của người dùng: hotline **0962 381 114** và địa chỉ **Số 26 - 28 Nguyễn Hoàng, Khu phố 1, Phường Bình Trưng, Thành phố Hồ Chí Minh, Việt Nam**.

Website được phục vụ trên máy Windows qua Next.js và Caddy cho tên miền public `lavitacons.vn`; xem [hướng dẫn vận hành HTTPS](docs/public-https.md).

## SEO

Trang chủ có metadata, canonical `https://lavitacons.vn/`, robots/sitemap, JSON-LD và ảnh chia sẻ 1200 × 630. Dữ liệu trung tâm nằm tại `src/data/home.ts`; H1 giữ nguyên khi đổi slide. Xem [hướng dẫn SEO và Search Console](docs/seo.md) để cập nhật nội dung, xác minh domain và gửi sitemap. Chưa thực hiện xác minh Search Console hoặc kiểm tra Rich Results Test live của Google.

## Hướng dẫn thiết kế

[DESIGN.md](DESIGN.md) ghi nhận bảng màu, typography, bố cục, CTA, responsive và khả năng tiếp cận của Lavita. Khi chỉnh giao diện, giữ thông tin theo hồ sơ và đối chiếu các quy tắc này.

Thiết kế áp dụng hướng dẫn từ [Impeccable](https://github.com/pbakaus/impeccable); bản tham khảo tại [docs/impeccable/SKILL.md](docs/impeccable/SKILL.md). Nguồn, commit, giấy phép và tình trạng CLI được ghi trong [docs/impeccable/README.md](docs/impeccable/README.md).
