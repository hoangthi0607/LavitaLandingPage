# Proxy tin tức qua máy ở Việt Nam

API và CDN của canhsatpccc.gov.vn (Cục Cảnh sát PCCC và CNCH) chỉ nhận kết nối từ IP Việt Nam. Website chạy trên Vercel (máy chủ ở nước ngoài) nên không gọi trực tiếp được. Giải pháp: một proxy chỉ đọc chạy trên một máy Windows đặt tại Việt Nam, được đưa ra Internet bằng Cloudflare Tunnel (miễn phí, không cần mở port hay IP tĩnh).

```
Vercel ──https──▶ Cloudflare ──tunnel──▶ máy ở VN: proxy 127.0.0.1:8787 ──▶ api.canhsatpccc.gov.vn
```

- Proxy: `proxy/news-proxy.mjs` (Node.js, không cần cài thư viện). Chỉ chuyển tiếp 4 API đọc tin/văn bản với tham số đã kiểm tra, bắt buộc khóa bí mật `x-proxy-key`, chỉ nghe tại `127.0.0.1`, cache 10 phút.
- Ảnh tin tức không đi qua proxy: trình duyệt của người xem ở Việt Nam tải thẳng từ CDN của Cục.
- Máy tắt hoặc mất mạng: website vẫn chạy, mục Tin tức hiện thông báo kèm link sang canhsatpccc.gov.vn; tin đã lấy được Vercel giữ 1 giờ.

## 1. Chuẩn bị trên máy ở Việt Nam

1. Cài Node.js 22 trở lên.
2. Clone repo này về máy.
3. Tạo khóa bí mật: sao chép `proxy/.env.example` thành `proxy/.env`, thay `PROXY_KEY` bằng chuỗi ngẫu nhiên dài, ví dụ tạo bằng:
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```
   `proxy/.env` đã nằm trong `.gitignore`; không gửi khóa này qua chat hay commit lên git.
4. Chạy thử:
   ```powershell
   node --env-file=proxy/.env proxy/news-proxy.mjs
   ```
   Mở http://127.0.0.1:8787/health, thấy `{"ok":true}` là được. Nhấn Ctrl+C để dừng.
5. Cho proxy tự chạy khi bật máy (PowerShell **Run as Administrator**, tại thư mục repo):
   ```powershell
   powershell -ExecutionPolicy Bypass -File proxy\install-windows.ps1
   ```
   Script tạo tác vụ "Lavita News Proxy" chạy bằng tài khoản SYSTEM khi khởi động, tự chạy lại sau 1 phút nếu lỗi.
6. Trong Settings > System > Power, đặt **Sleep: Never** khi cắm điện để máy không ngủ.

## 2. Đưa tên miền lên Cloudflare (một lần)

Cloudflare Tunnel cần DNS của tên miền do Cloudflare quản lý. Tên miền vẫn đăng ký và gia hạn ở Mắt Bão như cũ.

1. Tạo tài khoản miễn phí tại https://dash.cloudflare.com, chọn **Add a domain**, nhập tên miền, chọn gói **Free**.
2. Cloudflare tự quét bản ghi DNS hiện có. **Kiểm tra kỹ** trước khi đổi nameserver:
   - Bản ghi trỏ website về Vercel (A `76.76.21.21` hoặc CNAME `cname.vercel-dns.com`), đặt **DNS only** (mây xám).
   - Bản ghi email (MX, TXT/SPF, DKIM) nếu công ty dùng email theo tên miền; thiếu là mất email.
3. Vào trang quản lý tên miền ở Mắt Bão, đổi **Nameserver** sang 2 nameserver Cloudflare cung cấp. Chờ Cloudflare báo **Active** (thường vài phút đến vài giờ).
4. Mở website và kiểm tra email vẫn bình thường.

## 3. Tạo Cloudflare Tunnel

1. Cài cloudflared (PowerShell):
   ```powershell
   winget install --id Cloudflare.cloudflared
   ```
2. Trên Cloudflare: **Zero Trust > Networks > Tunnels > Create a tunnel**, chọn **Cloudflared**, đặt tên `lavita-news`.
3. Chọn môi trường **Windows**, sao chép lệnh dạng `cloudflared.exe service install eyJ...` và chạy trong PowerShell **Run as Administrator**. Lệnh này cài cloudflared thành dịch vụ Windows tự chạy khi bật máy. Token trong lệnh là bí mật như mật khẩu.
4. Ở bước **Public Hostname**: Subdomain `tin`, Domain là tên miền của bạn, Service `HTTP` – `127.0.0.1:8787`. Lưu.
5. Kiểm tra từ bất kỳ đâu: mở `https://tin.<tên-miền>/health`, thấy `{"ok":true}`.

> Muốn thử ngay trước khi đổi nameserver: chạy `cloudflared tunnel --url http://127.0.0.1:8787` để có địa chỉ tạm dạng `https://xxx.trycloudflare.com`. Địa chỉ này đổi mỗi lần chạy, chỉ dùng để thử.

## 4. Cấu hình Vercel

Trong Vercel: **Project > Settings > Environment Variables** (Production và Preview):

| Biến | Giá trị |
| --- | --- |
| `NEWS_API_BASE` | `https://tin.<tên-miền>/api/cms` |
| `NEWS_PROXY_KEY` | đúng giá trị `PROXY_KEY` trong `proxy/.env` |

Sau đó **Redeploy**. Mở `/tin-tuc` trên website: có danh sách tin là xong.

Biến tùy chọn: `NEWS_SOURCE=off` để tạm tắt hẳn việc lấy tin (trang Tin tức hiện thông báo ngay, không chờ).

## 5. Vận hành và CI/CD

- **Website**: không đổi, push lên GitHub là Vercel tự build và deploy.
- **Proxy**: hiếm khi thay đổi. Khi có thay đổi trong thư mục `proxy/`, chạy trên máy ở VN:
  ```powershell
  powershell -ExecutionPolicy Bypass -File proxy\update-windows.ps1
  ```
  Script `git pull` và chỉ khởi động lại proxy khi file trong `proxy/` thay đổi. Có thể đặt Task Scheduler chạy script này hằng ngày để proxy tự cập nhật.
- **Đổi khóa**: sửa `PROXY_KEY` trong `proxy/.env`, khởi động lại tác vụ "Lavita News Proxy", cập nhật `NEWS_PROXY_KEY` trên Vercel rồi Redeploy.
- **Kiểm tra sự cố**: `/health` qua `https://tin.<tên-miền>/health`; tác vụ trong Task Scheduler; dịch vụ "Cloudflared agent" trong Services; trạng thái tunnel trên dashboard Cloudflare.
- **Gỡ**: `Unregister-ScheduledTask -TaskName "Lavita News Proxy"`, `cloudflared.exe service uninstall`, xóa tunnel trên dashboard, bỏ 2 biến môi trường trên Vercel.

Lưu ý: việc đăng lại toàn văn tin tức nên có sự đồng ý của Cục Cảnh sát PCCC và CNCH. Proxy chỉ làm cho máy chủ ở nước ngoài lấy được dữ liệu qua một máy thật sự đặt tại Việt Nam; nó không thay đổi điều kiện sử dụng nội dung.
