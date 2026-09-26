# peter_tdn
# An app for Peter to learn and practice English

Trang web luyện thi tuyển sinh lớp 6 Trường Trần Đại Nghĩa — môn Tiếng Anh (phần tự luận).
Chạy hoàn toàn trên **gói Spark (miễn phí)** của Firebase: Hosting + Authentication + Firestore, không dùng Cloud Functions.

## Tính năng

- **Writing — viết câu từ gợi ý** (66 câu từ 60 đề của bộ đề 8020 Education, Quyển 1 & 2)
  - **Learn**: 17 bài ngữ pháp có ví dụ lấy từ đề thi (bài cuối: biến đổi từ loại).
  - **Practice**: làm từng câu, bấm Check để chấm và xem giải thích. Đúng 1 câu +1 ★, đúng 5 câu liên tiếp thưởng thêm +5 ★.
  - Chấm linh hoạt theo mẫu câu: chấp nhận mọi cách viết đúng ngữ pháp, đúng nghĩa.
- **Reading — đọc hiểu**, chia 3 phần, mỗi phần có Learn + Practice như Writing:
  - **Read a letter**: 60 thư từ 60 đề của 2 quyển; 4 bài học (bố cục thư, True/False, ý chính, câu hỏi chi tiết); câu 1–4 của đề.
  - **Read a text**: 60 đoạn văn; 5 bài học (cách làm, tính từ cảm xúc, từ nối, thời gian, danh từ); câu 5–8 điền khuyết.
  - **Read a passage**: bài đọc dài từ đề thi thật 2023–2026 và sách Stemhouse (10 đề thi thử + tuyển tập); 8 bài học.
    Ngoài True/False và trắc nghiệm (3–4 phương án) còn có các câu phải **tự gõ** đáp án, chấm như đề thi
    (`public/js/reading-grader.js`): **tìm từ** theo định nghĩa (sai chính tả / đổi dạng từ / thừa từ là sai),
    **điền khuyết tự viết từ** (có 3 lựa chọn hoặc khung từ) và **câu hỏi tự viết** chấm theo ý (mỗi ý có vài cách diễn đạt).
  - Practice: làm từng câu cạnh bài đọc; sau khi Check, chỗ chứa đáp án trong bài được tô vàng kèm giải thích vi/en.
    Luyện theo đề, theo dạng câu hỏi, tất cả, ôn câu sai, luyện mỗi ngày. Sao và chuỗi đúng dùng chung với Writing.
  - Đáp án theo sách; giải thích và câu bằng chứng là phần soạn thêm.
- **Mock Test — Thi thử** (`#/mock`): đề đủ 3 phần làm trong 45 phút, nộp bài (hoặc hết giờ) mới chấm.
  Đề: 5 đề thật 2022–2026, 10 đề Stemhouse (`exams/mock-*`, seed.js ghép Reading + Writing của đúng đề đó,
  bỏ câu ví dụ `example: true`) và đề ngẫu nhiên từ sách 8020 (1 thư + 1 đoạn văn + 2 câu Writing).
  Điểm theo đúng bảng điểm trong đáp án của từng đề (`MOCK_POINTS` trong seed.js; tổng 20, 22 hoặc 30), ghi kèm %;
  Listening (chưa có file nghe) và câu sắp xếp từ của Stemhouse tính vào tổng nhưng chưa làm được trên app. Kết quả các lần thi lưu trên máy (localStorage), từng câu vẫn được chấm và lưu như Practice.
- **Listening — nghe điền từ** (`#/listening`): 14 bài nghe có file mp3, 3 bài học; nghe rồi điền từ (chấm như câu tự gõ,
  giới hạn số từ) hoặc chọn A/B/C; chấm xong hiện lời thoại và tô chỗ chứa đáp án. Đáp án soạn từ lời thoại (Whisper), không có đáp án gốc.
  File nghe: `public/audio/lNN.mp3` — không lên repo (.gitignore), chỉ deploy lên Firebase Hosting; bản GitHub Pages lấy file từ web.app.
  Dữ liệu: `scripts/source/listening-*.js` (bài nghe) và `listening-ref.js` (câu nghe của đề thật / Stemhouse, chưa có file nghe:
  hiện để tham khảo trong Thi thử). Đề ngẫu nhiên của Thi thử có một bài nghe thật, có chấm.
- **Dùng thử không cần đăng nhập**: khách xem được 2 bài học đầu mỗi phần, làm 5 câu Writing và bài đọc đầu tiên của
  mỗi phần Reading (`exams/trial`); sao chỉ lưu trên máy.
  Đổi số lượng ở `window.TRIAL` trong `public/js/lessons.js` / `lessons-reading.js` rồi chạy lại `seed.js`.
- Mỗi thí sinh đăng nhập bằng **username** + mật khẩu riêng (username được tra ra email ngầm); giao diện tiếng Việt / English.

## Kiến trúc

```
public/                   Firebase Hosting
  js/app.js               giao diện, điều hướng
  js/api.js               Auth + Firestore; api.checkAnswer = mở khoá → lấy đáp án → chấm → lưu
  js/grader.js            bộ chấm theo mẫu câu (dùng chung cho trình duyệt và scripts/seed.js)
  js/reading-grader.js    bộ chấm câu Reading tự gõ: tìm từ, điền khuyết tự viết, câu hỏi tự viết (chấm theo ý)
  js/scoring.js           tính sao, chuỗi đúng, chi tiết bài nộp
  js/firebase-config.js   cấu hình web app
  js/lessons*.js, i18n.js bài giảng (Writing: lessons.js, Reading: lessons-reading.js) và chuỗi giao diện
scripts/
  seed.js                 tách scripts/source/data.js vào questions + answers + exams
  sync-users.js           tạo tài khoản từ users.json: Auth user + users/{uid} + usernames/{username}
  users.example.json      mẫu danh sách tài khoản (users.json thật có email nên không lên repo)
  source/data.js          dữ liệu gốc Writing có đáp án — chỉ để trên máy (.gitignore), không lên repo / web
  source/reading.js       dữ liệu gốc Reading (bài đọc, đáp án, giải thích) — cũng chỉ để trên máy
  source/passages/*.js    bài đọc dài (Read a passage): đề thật, Stemhouse — cũng chỉ để trên máy; định dạng ở seed.js
tests/run.js              test logic chấm điểm: node tests/run.js
firestore.rules           quyền truy cập
```

### Firestore

| Collection | Nội dung | Client |
|---|---|---|
| `questions/{id}` | Writing: `type`, `cues`, `topics`, `source [{book, test}]`, `order` · Reading: thêm `part`, `passage`, `num`, `prompt`, `options` | thành viên đọc; khách chỉ `get` các câu trong `exams/trial` |
| `passages/{id}` | bài đọc Reading: `part` (`letter`/`text`/`passage`), `title`, `paragraphs` / `text`, `questionIds` (bài dài thêm `genre`, `intro`, `box`, `source {kind…}`) | thành viên đọc; khách chỉ `get` các bài trong `exams/trial.passageIds` |
| `answers/{id}` | Writing: `answer`, `accept`, `defs`, `explanation {vi, en}`, `cues` · Reading: `choice`, `answer`, `evidence`, `explanation` (câu tự gõ: `kind` word/gap/open, `answers` hoặc `ideas`) | đọc **từng câu**, chỉ sau khi đã nộp câu đó; không `list` được. Câu làm thử: ai cũng `get` được |
| `answerUnlocks/{uid}_{qid}` | câu trả lời đầu tiên của thí sinh | tạo một lần, không sửa / xoá |
| `usernames/{username}` | `email` — để đăng nhập bằng username | ai cũng `get` được từng username; không `list`, không ghi |
| `exams/{id}` | `questionIds`, `kind` (`test` / `all` / `topic` / `trial`), `title` | thành viên đọc; khách chỉ `get` được `exams/trial` |
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
`data.js`, `reading.js` và thư mục `source/passages/` không nằm trong repo (repo public) — hãy tự sao lưu.

Tài liệu PDF gốc (thư mục `resources/`) không được đưa lên repo.
