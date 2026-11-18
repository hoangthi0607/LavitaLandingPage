# Danh mục sản phẩm Lavita

Mục **Sản phẩm** dẫn tới `/san-pham`. Từ 18/11/2026, dữ liệu lấy từ bản backup WordPress của lavitacons.vn (`lavitacons.vn_20260912_033642.zip` và dump MySQL ngày 12/09/2026, cả hai nằm ở thư mục gốc và đã được git ignore).

## Nguồn và cách nhập

- Script nhập nằm trong `.tmp/wp-import/tools/` (ignored, không phải dependency): `parse.mjs` đọc dump SQL, `extract.mjs` chuẩn hóa sản phẩm WooCommerce và dự án Pods, `resolve.mjs` tìm file ảnh/PDF trong zip, `build.mjs` chuyển ảnh sang WebP (tối đa 1400 px) vào `public/images/products/`, copy PDF vào `public/documents/products/` và sinh `src/data/product-catalog.ts`.
- `build.mjs` chứa bảng tiêu đề đã làm sạch (bỏ tiền tố "Mã sản phẩm:", hậu tố kích thước ảnh, sửa lỗi chính tả rõ ràng như Golbe → Globe, Value → Valve) và gộp 5 bản trùng cũ (Gate/Globe/Butterfly/Check Valve) vào bản mới hơn.
- 102 sản phẩm đã đăng → 97 sản phẩm, 303 ảnh, 11 tài liệu kỹ thuật. Không nhập giá, tồn kho, đánh giá hay đơn hàng.
- Mô tả, thông số và nội dung giữ nguyên chữ tiếng Việt của site cũ; nhãn thông số tiếng Anh của cửa gió (Height, Finish…) được dịch sang tiếng Việt, bỏ "Discovery"/"Packaging Type". 75 sản phẩm không có chữ mô tả ở site cũ, nên chỉ hiện ảnh và mô tả nhóm.
- Các ngôn ngữ khác dùng lại chữ tiếng Việt của sản phẩm (chưa dịch); tên nhóm và nhãn giao diện đã dịch trong từ điển.

## Nhóm sản phẩm

Mười nhóm theo cây danh mục site cũ, PCCC trước rồi HVAC: Van PCCC, Đầu phun sprinkler, Phụ kiện đường ống, Cửa gió & miệng gió, Van gió & van ngăn cháy, Ống gió, Tiêu âm, VAV & CAV, Quạt thông gió, Tủ điện – máng cáp – giá treo. Slug tại `productCategorySlugs` trong `src/data/products.ts`, tên và mô tả trong `productCategories` của từ điển.

## Giao diện

- Danh sách: tab nhóm, tìm kiếm GET (không phân biệt dấu), 12 sản phẩm mỗi trang (`?trang=N`, `productPageSize`). Thẻ hiện ảnh đầu tiên, mã, tên và mô tả nếu có.
- Chi tiết: ảnh lớn + hàng ảnh nhỏ dùng `DocumentGallery` (biến thể `product`, cùng trình xem dialog với hồ sơ năng lực: phím mũi tên, Escape, trả focus); mã sản phẩm, "Thông số kỹ thuật", nút trao đổi; bên dưới là "Mô tả sản phẩm" và "Tài liệu kỹ thuật" (mở tab mới). CSS chung của gallery/viewer tại `src/components/content/document-gallery.css`.
- Không có giỏ hàng, thanh toán hoặc backend; CTA giữ `nhom-san-pham`/`san-pham` sang `/lien-he` để soạn email.

## Bổ sung hoặc sửa

Sửa tay `src/data/product-catalog.ts` cho thay đổi nhỏ, hoặc chỉnh `build.mjs` rồi chạy lại `node .tmp/wp-import/tools/build.mjs` (xóa và tạo lại toàn bộ ảnh/PDF sản phẩm). Thêm bản dịch qua trường `translations` của từng sản phẩm.

## Kiểm chứng

18/11/2026: typecheck và build thành công (485 trang sản phẩm cho 5 ngôn ngữ). Chromium trên production build, 1440 px, iPhone 13 và 320 px: 205/205 kiểm tra đạt — trạng thái 200, không tràn ngang, ảnh tải đủ, Axe WCAG A/AA không vi phạm trên trang sản phẩm/dự án, trình xem ảnh dùng bàn phím, PDF trả về đúng, tìm kiếm không dấu, ngữ cảnh sản phẩm trong liên hệ. Báo cáo tại `.tmp/wp-import-qa/`. Chưa kiểm tra thiết bị thật/trình duyệt khác; bản dịch AI cần người bản ngữ rà soát.
