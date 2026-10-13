# HTTPS public cho lavitacons.vn trên Windows

## Chẩn đoán

Trước khi sửa ngày 13/10/2026: `lavitacons.vn:443` phục vụ chứng chỉ mkcert chỉ có SAN localhost, loopback và `192.168.1.208`. Chứng chỉ không chứa tên miền public và không có chuỗi CA công khai được các trình duyệt tin cậy. `www.lavitacons.vn` trỏ tới IP khác; cấu hình này chỉ xử lý apex `lavitacons.vn`.

## Kết quả xác minh ngày 13/10/2026

Caddy đã cấp chứng chỉ Let's Encrypt cho `lavitacons.vn`, có hiệu lực đến 11/01/2027 và được Caddy quản lý gia hạn khi process tiếp tục chạy. Kiểm tra HTTPS public với xác thực chứng chỉ mặc định: HTTP 200, TLS 1.3, hostname khớp và trang Lavita đúng nội dung. Chromium cũng mở trang thành công với `ignoreHTTPSErrors: false`, không có lỗi JavaScript.

ACME HTTP-01 trên cổng 80 thất bại; Caddy đã xác thực thành công bằng TLS-ALPN-01 trên cổng 443. Kiểm tra HTTP local trả về 308 sang HTTPS; HTTP public cổng 80 vẫn trả về connection reset. Vì vậy HTTPS public đã hoạt động, còn chuyển hướng HTTP từ Internet cần kiểm tra lại rule TCP 80/router/ISP. Không tuyên bố đã xác minh HTTP redirect public hoặc sửa DNS `www`.

## Cấu hình được chuẩn bị

```text
Internet HTTPS :443 → router → Caddy :443 → Next.js HTTPS :3000
Internet HTTP  :80  → router → Caddy :80 (xác thực ACME và chuyển sang HTTPS)
```

`Caddyfile` dùng Automatic HTTPS của Caddy để cấp/gia hạn chứng chỉ public. Caddy xác thực kết nối tới Next.js bằng CA mkcert công khai trong `certificates/rootCA.pem` và server name `localhost`; không bỏ kiểm tra TLS. Header Host public được giữ nguyên cho Next.js. Dữ liệu ACME/private keys của Caddy nằm trong `.runtime/caddy/`; giữ thư mục này giữa các lần chạy và không commit. Admin API chỉ lắng nghe trên loopback.

## Chuẩn bị một lần

1. Tải binary Windows amd64 từ [Caddy Releases](https://github.com/caddyserver/caddy/releases), đối chiếu SHA256/SHA512 theo checksums của cùng release và giải nén vào `.tools/caddy/` để có `.tools/caddy/caddy.exe`. Hoặc đặt `CADDY_BIN` tới binary đã cài. Thư mục `.tools/` được Git bỏ qua.
2. Sao chép **CA công khai**, không phải private key:

```powershell
Copy-Item -LiteralPath "$env:LOCALAPPDATA/mkcert/rootCA.pem" -Destination certificates/rootCA.pem
```

3. Kiểm tra cấu hình: `npm run https:check`. Lệnh này không chạy listener public và không chứng minh chứng chỉ public đã được cấp.

## Router, DNS và firewall

DNS A của `lavitacons.vn` phải trỏ đúng IP WAN của router. Tại thời điểm kiểm tra, DNS là `27.64.53.60`; cần kiểm tra lại nếu WAN thay đổi. Chỉ thêm `www` sau khi sửa DNS của nó về cùng server.

Đổi chuyển tiếp TCP:

| Cổng public | IP máy Windows | Cổng đích |
| --- | --- | --- |
| 80 | 192.168.1.208 | 80 |
| 443 | 192.168.1.208 | 443 |

Thay chuyển tiếp 443 tới cổng 3000 nếu đang có. Sau khi xác nhận Caddy phục vụ thành công, bỏ chuyển tiếp public trực tiếp tới 3000. Giữ IP LAN này ổn định trong router. Caddy phải nhận được kết nối xác thực từ Internet; chỉ mở website từ chính máy qua NAT loopback không chứng minh xác thực ACME đã hoạt động.

Windows Firewall phải cho Caddy nhận TCP 80/443. Nếu cần thêm rule, chạy PowerShell với quyền Administrator từ thư mục dự án:

```powershell
$lavitaCaddyPath = (Resolve-Path '.tools/caddy/caddy.exe').Path
New-NetFirewallRule -DisplayName 'Lavita Caddy HTTPS public' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 80,443 -Program $lavitaCaddyPath -Profile Any
```

Rule này chỉ dành cho Caddy trên hai cổng public. Không tắt firewall. Chưa tự tạo rule hoặc đổi NAT trong quy trình chuẩn bị.

## Chạy

Terminal 1, giữ Next.js đang chạy:

```sh
npm run build
npm run start
```

Terminal 2:

```sh
npm run https:public
```

Chờ log Caddy xác nhận cấp được chứng chỉ rồi mở `https://lavitacons.vn`. Nếu xác thực thất bại, kiểm tra DNS và chuyển tiếp 80/443 trước khi chạy lại để tránh nhiều lần yêu cầu chứng chỉ. Không xem việc process Caddy đã khởi động là bằng chứng cấp chứng chỉ thành công. Caddy và Next.js đều phải tiếp tục chạy để phục vụ website; chưa cài Windows service trong bước này. Khi Caddy đã chạy, không mở thêm process chiếm cùng cổng; khi process dừng, chạy lại `npm run https:public` từ thư mục dự án để dùng lại chứng chỉ đã lưu.

Để kiểm tra từ máy ngoài LAN, dùng trình duyệt mới chưa từng chấp nhận ngoại lệ TLS. Không yêu cầu người truy cập public cài CA mkcert. Nếu router/ISP chặn cổng xác thực, cần phương án DNS-01 với nhà cung cấp DNS thay cho quy trình này.

## Nguồn

- [Caddy Automatic HTTPS](https://caddyserver.com/docs/automatic-https)
- [Caddy HTTPS upstream trust](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy)
- [Let’s Encrypt challenge types](https://letsencrypt.org/docs/challenge-types/)
