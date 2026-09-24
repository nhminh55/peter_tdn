# peter_tdn
# An app for Peter to learn and practice English

Trang web luyện thi tuyển sinh lớp 6 Trường Trần Đại Nghĩa — môn Tiếng Anh (phần tự luận).

## Cách dùng

Mở file `index.html` bằng trình duyệt (Chrome, Edge…). Không cần cài đặt hay chạy server.

## Tính năng

- **Writing — viết câu từ gợi ý** (66 câu từ 60 đề của bộ đề 8020 Education, Quyển 1 & 2)
  - **Learn**: 16 bài ngữ pháp có ví dụ lấy từ đề thi.
  - **Practice**: làm từng câu, bấm Check để chấm và xem giải thích. Đúng 1 câu +1 ★, đúng 5 câu liên tiếp thưởng thêm +5 ★.
  - Chấm linh hoạt: chấp nhận mọi cách viết đúng ngữ pháp, đúng nghĩa (đổi vị trí trạng ngữ, từ đồng nghĩa, viết tắt…), không bắt buộc giống hệt sách.
- **Listening, Reading**: sắp ra mắt.
- Giao diện tiếng Việt / English (bấm cờ trên thanh tiêu đề).
- Kết quả lưu trên trình duyệt của máy (localStorage), có thể tải file kết quả để sao lưu.

## Cấu trúc

| File | Nội dung |
|---|---|
| `js/data.js` | Ngân hàng câu hỏi, mẫu câu đúng (`accept`), giải thích Việt/Anh |
| `js/grader.js` | Bộ chấm điểm |
| `js/lessons.js`, `js/lessons-en.js` | Bài giảng ngữ pháp (Việt, Anh) |
| `js/i18n.js` | Chuỗi giao diện hai ngôn ngữ |
| `js/app.js` | Điều hướng, giao diện, tính sao, lưu kết quả |
| `css/style.css` | Giao diện |

Muốn chấp nhận thêm một cách viết đúng cho câu nào, thêm mẫu vào mảng `accept` của câu đó trong `js/data.js` (cú pháp mẫu được mô tả ở đầu file).

Tài liệu PDF gốc (thư mục `resources/`) không được đưa lên repo.
