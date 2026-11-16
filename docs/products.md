# Danh mục sản phẩm Lavita

Theo yêu cầu người dùng, mục **Sản phẩm** dẫn tới `/san-pham`. Người dùng chưa có danh sách, hình ảnh hoặc mã sản phẩm thực tế, nên đây là khung danh mục để bổ sung sau.

## Nội dung và giới hạn

- Dữ liệu tại `src/data/products.ts`, tách khỏi ba dịch vụ PCCC hiện có.
- Bốn nhóm khởi tạo: thiết bị báo cháy, thiết bị chữa cháy, đầu phun sprinkler, van và phụ kiện. Đây là cấu trúc biên tập tham khảo từ [PCCC.vn](https://pccc.vn/san-pham/), cần rà soát theo danh mục thực tế khi bổ sung dữ liệu.
- `products` đang rỗng. Giao diện hiển thị đang cập nhật, không giả lập thương hiệu, sản phẩm, giá, tồn kho, chứng nhận hoặc bảo hành.
- Không sao chép ảnh, mô tả riêng hoặc thông tin thương mại của website tham khảo.
- Không có giỏ hàng, thanh toán hoặc backend tiếp nhận đơn hàng.

## Bổ sung sản phẩm

Thêm bản ghi thực tế vào `products`: `slug`, `title`, `categorySlug` và `description`. Có thể bổ sung `image`, `sku` và `specifications` khi có nguồn xác nhận. Ảnh dùng đường dẫn trong `public/`, thường đặt dưới `public/images/products/`; không dùng ảnh dự án để giả làm ảnh sản phẩm.

Danh sách và `/san-pham/[slug]` dùng chung dữ liệu này. Tìm kiếm hỗ trợ tên, mã và mô tả, không phân biệt dấu tiếng Việt; kết hợp với nhóm sản phẩm. Khi chưa có dữ liệu, không hiển thị thẻ hàng hoặc thông số mẫu. Slug không có sản phẩm trả 404.

Sau khi thêm dữ liệu hoặc ảnh, chạy typecheck/build và kiểm tra danh sách, trang chi tiết, ảnh, trạng thái không tìm thấy và email nháp. Sitemap thêm sản phẩm từ dữ liệu đã nhập.

## Điều hướng và liên hệ

Header và footer có link Sản phẩm. Danh sách nhóm nằm bên trái ở desktop và chuyển thành các lựa chọn xuống dòng trên mobile. Form tìm kiếm dùng GET, hoạt động khi tắt JavaScript. Query `danh-muc` và `q` giữ lựa chọn; canonical luôn là `/san-pham`.

CTA liên hệ giữ `nhom-san-pham` và, khi đã có dữ liệu, `san-pham`. Trang liên hệ kiểm tra slug trước khi hiển thị và đưa nhóm/sản phẩm vào email nháp. Người xem tự gửi qua ứng dụng email. Query sai hoặc lặp bị bỏ qua.

## Giới hạn kiểm chứng

Với dữ liệu hiện rỗng, chỉ kiểm tra được danh mục, lọc/tìm kiếm rỗng, điều hướng, ngữ cảnh nhóm sản phẩm trong liên hệ và 404. Chưa kiểm chứng ảnh, thông số hoặc trang chi tiết cho sản phẩm thực tế tới khi được cung cấp. Kết quả QA thực tế ghi trong bàn giao và `.tmp/`.

Kiểm tra ngày 14/11/2026 trên production build bằng Chromium: typecheck/build thành công; bảy viewport từ 320 đến 1440 px, gồm landscape, không tràn ngang; menu mobile có focus bàn phím và Escape trả về nút mở. Axe không phát hiện vi phạm WCAG A/AA ở 1440 và 390 px. Đã kiểm tra tìm kiếm GET khi tắt JavaScript, giới hạn từ khóa, query không hợp lệ, nhóm sản phẩm trong email nháp và luồng liên hệ dịch vụ/dự án cũ. Không gửi email trong quá trình kiểm tra. Chưa kiểm tra trên thiết bị vật lý hoặc trình duyệt khác.
