# Quy ước Design (Figma) — Ant Design v6

Dự án này thiết kế trong **Figma**. Design system (Variables, Styles, Components) **đã được dựng và tùy chỉnh sẵn trong file Figma**, và đã có **layout mẫu** cho app. Công việc hiện tại: dựng **tính năng mới** dựa trên design mẫu + design system sẵn có. Cơ bản chỉ dùng lại component đã tạo và layout giống các màn đã dựng.

## Nguồn chân lý & tái sử dụng (QUAN TRỌNG NHẤT)
- **File Figma là nguồn chân lý.** Luôn dùng lại **Variables / Styles / Components đã có sẵn** trong file. KHÔNG tạo mới màu, style hay component nếu đã có cái dùng được.
- **Quét file trước khi dựng:** kiểm tra xem có component / pattern / layout nào sẵn phù hợp rồi tái sử dụng — đừng vẽ lại từ đầu.
- **Layout tính năng mới bám theo layout mẫu đã dựng:** cùng cấu trúc trang, grid, spacing, vị trí header / nav / sidebar. Tính năng mới phải nhìn như "cùng một app", không phải màn hình lạc lõng.
- **Nếu thiếu component cho nhu cầu:** ưu tiên ghép từ component có sẵn. Chỉ khi buộc phải tạo mới thì **hỏi tôi trước**, rồi tạo đúng chuẩn hệ thống (dùng variable, auto-layout, có variants) và thêm vào thư viện — không vẽ rời tùy tiện.
- **Đặt tên & tổ chức layer** nhất quán với quy ước đang có trong file.
- Các giá trị hex / số trong tài liệu này chỉ là **tham khảo gốc Ant Design**. Nếu file Figma đã tùy chỉnh khác đi → **lấy theo file Figma**. Token gốc chi tiết xem `design.md`.

## 4 giá trị định hướng (tie-breaker khi phân vân)
- **Natural:** theo quy ước quen thuộc, không gây bất ngờ.
- **Certain:** người dùng luôn biết đang ở trạng thái nào; hover / focus / loading / error rõ ràng, nhất quán.
- **Meaningful:** nhấn mạnh thị giác chỉ dành cho hành động; bỏ trang trí không truyền tải thông tin.
- **Growing:** từ form nhỏ đến bảng dữ liệu dày vẫn nhất quán.

→ Khi hai phương án mâu thuẫn, chọn cái tạo ra trạng thái **rõ ràng, dễ đọc hơn**.

## Màu sắc (dùng Color Variables sẵn có, không dán hex)
- **Primary** — chỉ cho hành động quan trọng nhất, link, focus, tab/nav đang chọn. Mỗi màn hình **chỉ một** hành động primary.
- **Semantic:** success / warning / error / info — dùng cho trạng thái.
- **Bảng màu preset** (blue, purple, cyan, green, magenta, red, orange...): chỉ cho tag, chart, phân loại. KHÔNG dùng cho nút / UI chính.
- **Surface 3 lớp:** nền trang (Layout) → card / panel / table / form (Container) → modal / dropdown / popover (Elevated — phân biệt bằng **shadow**, không phải màu).
- KHÔNG tự chế màu ngoài palette đã có. Nếu thấy cần màu lạ thì thường là layout cần sửa.

## Typography (dùng Text Styles sẵn có)
- **Cỡ chữ gốc 14px** — ưu tiên mật độ thông tin.
- **Chỉ 2 độ đậm:** Regular 400 (body, control, menu, tab) và Semibold 600 (heading, header bảng, tiêu đề). KHÔNG dùng thin, bold 700+, italic trong UI.
- Nhấn mạnh trạng thái active / selected bằng **màu và nét** (viền, gạch chân), không bằng độ đậm.

## Khoảng cách & Layout
- Mọi khoảng cách bám **lưới 4px** (4 / 8 / 16 / 24 / 32). Dùng **auto-layout** cho mọi khung có thể.
- Chiều cao control chuẩn: **32px**.
- KHÔNG dùng số lẻ (11px, 13px). Thang thiếu bước cần dùng → xem lại design, không override 1px.

## Bo góc
- Control (button, input, select): **6px**. Surface (card, modal, drawer): **8px**. Tag / tooltip / popover: **4px**.
- Pill (bo tròn hoàn toàn): chỉ cho avatar, badge, dot. Vuông (0px): cho bảng và segmented control.
- Không trộn nhiều bán kính trên các phần tử kề nhau.

## Elevation
- **Flat-first:** phân cấp bằng viền và tương phản tông màu. Shadow chỉ cho bề mặt **thật sự nổi** (modal, dropdown, popover, card cần tách nền). Dùng Effect Styles sẵn có.

## Component (ưu tiên dùng lại component có sẵn)
Khi cần state, dùng đúng variants đã định nghĩa (default / hover / active / focus / disabled).
- **Button primary:** cao 32px, bo 6px. Không xếp 2 primary cạnh nhau.
- **Button default:** nền trong suốt, chữ đậm, viền 1px.
- **Input / Select:** cao 32px, viền 1px, focus dày viền + glow primary. Placeholder màu disabled.
- **Card:** bo 8px, padding 24px, gap nội bộ 16px.
- **Modal:** shadow đậm hơn card, mask nền `rgba(0,0,0,0.45)`, padding 20 × 24px.
- **Menu item đang chọn:** nền nhạt primary + chữ primary.
- **Tab active:** chữ primary + gạch chân primary 2px, không nền.
- **Table header:** nền surface-container nhạt, chữ 14px/600. Không kẻ sọc ngựa vằn mặc định.
- **Tag:** bo 4px, chữ 12px, nền pastel nhạt. Không dùng tag cho trạng thái quan trọng (dùng Alert / Badge).
- **Tooltip:** nền đen mờ, chữ trắng.

## Do's & Don'ts
- ✅ Tái sử dụng Variables / Styles / Components sẵn có; layout bám mẫu đã dựng.
- ✅ Mỗi màn hình một hành động primary; còn lại hạ xuống default.
- ✅ Auto-layout, mọi gap/padding snap lưới 4px.
- ✅ Cần component mới → hỏi trước, dựng đúng chuẩn rồi thêm vào thư viện.
- ❌ Không tạo mới màu / style / component khi đã có cái dùng được.
- ❌ Không tự chế màu ngoài palette, không dùng magic number.
- ❌ Không xếp 2 nút primary trên cùng một bề mặt.
- ❌ Không dùng độ đậm chữ để phân biệt trạng thái (dùng màu/nét).