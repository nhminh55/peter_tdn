# peter_tdn
# An app for Peter to learn and practice English

Trang web luyện thi tuyển sinh lớp 6 Trường Trần Đại Nghĩa — môn Tiếng Anh (phần tự luận).
Chạy hoàn toàn trên **gói Spark (miễn phí)** của Firebase: Hosting + Authentication + Firestore, không dùng Cloud Functions.

## Tính năng

- **Writing — viết câu từ gợi ý** (66 câu từ 60 đề của bộ đề 8020 Education, Quyển 1 & 2)
  - **Learn**: 16 bài ngữ pháp có ví dụ lấy từ đề thi.
  - **Practice**: làm từng câu, bấm Check để chấm và xem giải thích. Đúng 1 câu +1 ★, đúng 5 câu liên tiếp thưởng thêm +5 ★.
  - Chấm linh hoạt theo mẫu câu: chấp nhận mọi cách viết đúng ngữ pháp, đúng nghĩa.
- **Listening, Reading**: sắp ra mắt.
- Mỗi thí sinh đăng nhập bằng **username** + mật khẩu riêng (username được tra ra email ngầm); giao diện tiếng Việt / English.

## Kiến trúc

```
public/                   Firebase Hosting
  js/app.js               giao diện, điều hướng
  js/api.js               Auth + Firestore; api.checkAnswer = mở khoá → lấy đáp án → chấm → lưu
  js/grader.js            bộ chấm theo mẫu câu (dùng chung cho trình duyệt và scripts/seed.js)
  js/scoring.js           tính sao, chuỗi đúng, chi tiết bài nộp
  js/firebase-config.js   cấu hình web app
  js/lessons*.js, i18n.js bài giảng và chuỗi giao diện
scripts/
  seed.js                 tách scripts/source/data.js vào questions + answers + exams
  sync-users.js           tạo tài khoản từ users.json: Auth user + users/{uid} + usernames/{username}
  users.example.json      mẫu danh sách tài khoản (users.json thật có email nên không lên repo)
  source/data.js          dữ liệu gốc có đáp án — chỉ để trên máy (.gitignore), không lên repo / web
tests/run.js              test logic chấm điểm: node tests/run.js
firestore.rules           quyền truy cập
```

### Firestore

| Collection | Nội dung | Client |
|---|---|---|
| `questions/{id}` | `type`, `cues`, `topics`, `source [{book, test}]`, `order` | thành viên đọc |
| `answers/{id}` | `answer`, `accept`, `defs`, `explanation {vi, en}`, `cues` | đọc **từng câu**, chỉ sau khi đã nộp câu đó; không `list` được |
| `answerUnlocks/{uid}_{qid}` | câu trả lời đầu tiên của thí sinh | tạo một lần, không sửa / xoá |
| `usernames/{username}` | `email` — để đăng nhập bằng username | ai cũng `get` được từng username; không `list`, không ghi |
| `exams/{id}` | `questionIds`, `kind` (`test` / `all` / `topic`), `title` | thành viên đọc |
| `users/{uid}` | `email`, `name`, `stars`, `streak`, `qstats`… — có document = là thành viên | chủ tài khoản đọc / ghi, rules giới hạn mức cộng sao |
| `submissions/{id}` | `userId`, `examId`, `score`, `total`, `details[]` | chủ tài khoản ghi / đọc, mỗi lần thêm đúng 1 câu |

**Bảo mật trên gói Spark:** thí sinh chỉ xem được đáp án của câu mình đã nộp ("nộp trước, xem sau"),
không tải được cả bộ đáp án. Vì chấm ở client nên người rành kỹ thuật vẫn có thể tự báo đúng cho câu sai;
rules giới hạn mỗi lần trả lời tối đa +6 ★ và đúng +1 lượt. Muốn chấm chống gian lận hoàn toàn thì cần server
(Cloud Functions — gói Blaze).

## Cài đặt & deploy

1. Firebase console: bật **Authentication → Email/Password**, tạo **Firestore** (location `asia-southeast1`).
   Không cần tạo tài khoản bằng tay — `sync-users.js` làm việc đó.
2. `.firebaserc` và `public/js/firebase-config.js` đã trỏ vào project `peter-tdn`.
3. Tải khoá admin: *Project settings → Service accounts → Generate new private key* → lưu thành
   `scripts/service-account.json` (đã được `.gitignore` bỏ qua). Không cần gói Blaze.
4. Đẩy dữ liệu và cấp quyền:
   ```bash
   cd scripts && npm install
   node seed.js --dry-run
   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json node seed.js --project peter-tdn
   cp users.example.json users.json    # sửa danh sách: username, email, name, password (không bắt buộc)
   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json node sync-users.js --project peter-tdn --dry-run
   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json node sync-users.js --project peter-tdn
   ```
   `sync-users.js` tạo Auth user nếu chưa có (không ghi `password` thì sinh mật khẩu ngẫu nhiên và in ra một lần),
   cấp quyền làm bài (`users/{uid}`) và ghi `usernames/{username}`. Tài khoản đã có giữ nguyên mật khẩu, sao, lịch sử;
   muốn đổi mật khẩu thì ghi `password` rồi chạy thêm `--reset-passwords`. Thêm thí sinh mới: thêm một dòng vào
   `users.json` rồi chạy lại. Chạy lại nhiều lần vẫn an toàn.
5. Deploy rules + index, rồi thử ở máy: `firebase deploy --only firestore` → `firebase serve --only hosting`
   → mở `http://localhost:5000`.
6. Đưa web lên (chạy được ở cả hai địa chỉ):
   - Firebase Hosting: `firebase deploy --only hosting` → `https://peter-tdn.web.app`
   - GitHub Pages: push lên `main` → GitHub Actions (`.github/workflows/pages.yml`) đăng `public/` lên
     `https://peter-tdn.github.io`. Lần đầu: *repo Settings → Pages → Source: GitHub Actions*.
     Domain `peter-tdn.github.io` phải có trong *Firebase Authentication → Settings → Authorized domains*.

Muốn chấp nhận thêm một cách viết đúng: thêm mẫu vào `accept` của câu trong `scripts/source/data.js` rồi chạy lại `seed.js`.
`data.js` không nằm trong repo (repo public) — hãy tự sao lưu file này.

Tài liệu PDF gốc (thư mục `resources/`) không được đưa lên repo.
