/*
 * Bài giảng cho phần Reading, chia 2 mảng: Read a letter (đọc thư) và Read a text (đọc đoạn văn
 * điền khuyết). `id` của mỗi bài trùng với `topics` của câu hỏi trong scripts/source/reading.js
 * để nút "Luyện chủ điểm này" lọc đúng câu. Bản tiếng Anh: lessons-reading-en.js.
 */
window.READING_LESSONS = {
  letter: [
    {
      id: 'letter-method',
      title: 'Cách đọc một bức thư',
      icon: '🧭',
      short: 'Bố cục thư, ai là "I", 4 bước làm bài',
      body: `
<p>Đề thi: <i>Read the following letter carefully. Do the tasks below the letter.</i> Sau bức thư có <b>4 câu</b>:</p>
<ul>
  <li><b>Câu 1–2</b>: True / False — câu cho sẵn đúng hay sai so với thư.</li>
  <li><b>Câu 3</b>: <i>The letter is mainly about ___</i> — ý chính của cả bức thư.</li>
  <li><b>Câu 4</b>: câu hỏi chi tiết — <i>Who…? How did … feel? According to the letter…</i></li>
</ul>

<h3>Bố cục một bức thư trong đề</h3>
<table class="tbl">
  <tr><th>Phần</th><th>Ví dụ trong đề</th><th>Cho bạn biết</th></tr>
  <tr><td>Lời chào</td><td><b>Dear</b> Mai Phuong,</td><td><b>Người nhận</b> thư (= <i>you</i>)</td></tr>
  <tr><td>Đoạn mở đầu</td><td>Last weekend, our school held <b>the Talent Show</b>, and I really want to tell you all about it.</td><td><b>Chủ đề</b> của thư → câu 3</td></tr>
  <tr><td>Đoạn 2</td><td>The school yard was crowded and noisy in a happy way…</td><td>Không khí sự kiện, các hoạt động</td></tr>
  <tr><td>Đoạn 3</td><td>As a volunteer, I helped prepare the stage… I started the show with a magic trick.</td><td>Người viết <b>đã làm gì</b></td></tr>
  <tr><td>Đoạn 4</td><td>… made me really happy. Now I believe more than ever that…</td><td><b>Cảm xúc</b> và <b>suy nghĩ</b> của người viết</td></tr>
  <tr><td>Lời chúc cuối thư</td><td>Write back soon and tell me your news.</td><td>—</td></tr>
  <tr><td>Chữ ký</td><td><b>Your friend,</b> Anh Khoa</td><td><b>Người viết</b> thư (= <i>I</i>)</td></tr>
</table>

<div class="warn"><b>Bẫy hay gặp nhất: ai là "I"?</b>
  <p>Chữ <b>I / my / me</b> trong thư luôn là <b>người ký tên ở cuối</b> (sau <i>Your friend,</i>), không phải người sau chữ <i>Dear</i>.</p>
  <ul>
    <li>Dear <b>Gia Han</b>, … I even started the fashion show … Your friend, <b>Minh Chau</b></li>
    <li>→ <i>Who started the fashion show?</i> — <b>Minh Chau</b> (không phải Gia Han).</li>
  </ul>
</div>

<h3>4 bước làm bài</h3>
<ol class="steps">
  <li><b>Xem tên hai bạn</b>: ai nhận (Dear …), ai viết (Your friend, …).</li>
  <li><b>Đọc lướt cả thư</b> một lần để biết thư kể về sự kiện gì.</li>
  <li><b>Đọc từng câu hỏi</b>, gạch chân <b>từ khoá</b> (tên sự kiện, <i>volunteer, excited, believe, started…</i>) rồi tìm câu có từ đó trong thư.</li>
  <li><b>So thật kỹ</b> câu hỏi với câu trong thư rồi mới chọn. Đáp án đúng thường <b>diễn đạt lại</b> bằng từ khác (<i>everyone was excited</i> = <i>full of energy</i>).</li>
</ol>
<div class="tip">Đề thi nhiều năm giống nhau về bố cục: các bức thư đều kể về <b>một sự kiện ở trường</b> (hội chợ, lễ hội, cuộc thi, ngày hội…). Nắm chắc bố cục là bạn làm nhanh được cả 4 câu.</div>`
    },
    {
      id: 'letter-tf',
      title: 'Câu True / False',
      icon: '✅',
      short: 'So câu với thư; bẫy nobody, all, exactly the same',
      body: `
<p>Đề: <i>Decide whether this sentence is True or False.</i> Bạn viết <b>True</b> nếu câu <b>đúng với nội dung thư</b>, <b>False</b> nếu thư nói ngược lại.</p>

<h3>Cách làm</h3>
<ol class="steps">
  <li>Gạch chân <b>từ khoá</b> trong câu: <i>Nobody … excited</i>, <i>volunteer</i>, <i>believes</i>, <i>presentation skills</i>…</li>
  <li>Tìm câu có từ đó (hoặc từ cùng nghĩa) trong thư.</li>
  <li>So từng ý: <b>ai</b>, <b>làm gì</b>, <b>thế nào</b>. Chỉ cần <b>một ý sai</b> là cả câu <b>False</b>.</li>
</ol>

<h3>Các dạng câu thường gặp trong đề</h3>
<table class="tbl">
  <tr><th>Câu trong đề</th><th>Thư viết</th><th>Đáp án</th></tr>
  <tr><td>Nobody at the Charity Fair was excited.</td><td>The atmosphere was lively, and <b>everyone</b> was excited.</td><td><b>False</b></td></tr>
  <tr><td>All of the story corners were exactly the same.</td><td><b>some</b> of them were quiet, and <b>the rest</b> were very exciting</td><td><b>False</b></td></tr>
  <tr><td>The atmosphere at the Sports Day was quiet and boring.</td><td>The whole school was <b>busy and colorful</b>… nobody felt bored.</td><td><b>False</b></td></tr>
  <tr><td>Minh Chau worked as a volunteer at the Culture Festival.</td><td>I joined <b>as a volunteer</b> … Your friend, <b>Minh Chau</b></td><td><b>True</b></td></tr>
  <tr><td>Many pupils showed excellent presentation skills.</td><td>their presentation skills were <b>excellent</b></td><td><b>True</b></td></tr>
  <tr><td>Anh Khoa believes that everyone has a special talent.</td><td>Now I <b>believe</b> more than ever that everyone has a special talent.</td><td><b>True</b></td></tr>
</table>

<div class="warn"><b>Từ "bẫy" — thấy là phải kiểm tra kỹ</b>
  <ul>
    <li><b>nobody / no one</b> (không ai), <b>never</b> (không bao giờ) — thư thường nói <i>everyone</i>, <i>many pupils</i>.</li>
    <li><b>all … exactly the same</b> (tất cả giống hệt nhau) — thư thường nói <i>some … others …</i> (có cái thế này, có cái thế kia).</li>
    <li><b>only</b> (chỉ) — thư thường kể nhiều hơn một điều.</li>
    <li><b>quiet, boring, empty</b> — trái nghĩa với <i>lively, busy, full of energy, exciting</i>.</li>
  </ul>
</div>
<div class="tip"><b>Từ cùng nghĩa</b> hay dùng để diễn đạt lại: <i>took part in = participated in = joined in = played a part in</i> (tham gia) · <i>excellent = incredible = impressed everyone</i> (rất giỏi) · <i>happy = glad = proud</i> (vui, tự hào).</div>`
    },
    {
      id: 'letter-main',
      title: 'Ý chính của bức thư',
      icon: '🎯',
      short: 'The letter is mainly about ___',
      body: `
<p>Câu 3 luôn hỏi: <i>The letter is mainly about ______.</i> (Bức thư chủ yếu nói về…)</p>
<div class="formula">
  <div>Ý chính = điều mà <b>cả bức thư</b> kể, thường nói ngay ở <b>đoạn mở đầu</b>.</div>
</div>
<div class="ex">
  <div class="ex-cue">Today I want to tell you about <b>the Culture Festival at our school</b>. I joined as a volunteer, and I enjoyed every minute of it.</div>
  <div class="ex-ans">→ The letter is mainly about <mark>an interesting school event</mark>.</div>
</div>

<h3>Loại đáp án sai</h3>
<table class="tbl">
  <tr><th>Phương án</th><th>Vì sao sai</th></tr>
  <tr><td>the work of the teachers <b>only</b></td><td>Thư không kể về thầy cô; chữ <b>only</b> (chỉ) càng làm câu sai.</td></tr>
  <tr><td>the importance of world cultures / reading habits / charity work…</td><td>Đây chỉ là <b>suy nghĩ ở đoạn cuối</b> (<i>I truly believe that…</i>), không phải điều cả thư kể.</td></tr>
  <tr><td><b>an interesting school event</b></td><td>✔ Cả 4 đoạn đều kể về sự kiện ở trường.</td></tr>
</table>
<div class="tip"><b>Mẹo</b>: đáp án đúng cho câu ý chính thường <b>chung</b> nhất, bao được cả bức thư. Phương án quá hẹp (một chi tiết) hoặc có <b>only</b> thường sai.</div>`
    },
    {
      id: 'letter-detail',
      title: 'Câu hỏi chi tiết: Who, How, According to',
      icon: '🔍',
      short: 'Ai làm, cảm thấy thế nào, sự kiện ra sao',
      body: `
<p>Câu 4 hỏi <b>một chi tiết</b> trong thư. Tìm đúng câu chứa chi tiết đó rồi mới chọn.</p>

<h3>1. Who started …?</h3>
<div class="ex">
  <div class="ex-cue">Dear Gia Han, … I even started the fashion show with a beautiful ao dai. … Your friend, Minh Chau</div>
  <div class="ex-ans">Who started the fashion show? → <mark>Minh Chau</mark> (<i>I</i> = người viết)</div>
</div>
<div class="warn">Phương án thường có cả <b>tên người nhận</b> (sau Dear) và <b>The head teacher</b> — đều sai, vì thư viết <b>I</b> started.</div>

<h3>2. How did … feel about …?</h3>
<p>Tìm các từ chỉ cảm xúc của người viết: <i>made me really happy, I am so glad, I feel proud, I will never forget…</i></p>
<table class="tbl">
  <tr><th>Tích cực ✔</th><th>Tiêu cực ✘</th></tr>
  <tr><td><b>proud</b> (tự hào), <b>happy</b> (vui), <b>glad</b> (vui mừng), <b>excited</b> (háo hức), <b>interested</b> (thích thú)</td><td><b>tired</b> (mệt), <b>bored</b> (chán), <b>worried</b> (lo lắng), <b>sad</b> (buồn), <b>angry</b> (giận)</td></tr>
</table>

<h3>3. According to the letter, the … was ___.</h3>
<p><i>According to the letter</i> = theo bức thư. Tìm câu mô tả sự kiện ở đoạn 2.</p>
<table class="tbl">
  <tr><th>Thư viết</th><th>Đáp án đúng</th><th>Phương án sai</th></tr>
  <tr><td>The event was full of energy. The atmosphere was lively…</td><td><b>full of energy</b> (tràn đầy năng lượng, sôi nổi)</td><td>quiet and empty (yên ắng, vắng tanh) · only for the teachers (chỉ dành cho thầy cô)</td></tr>
</table>
<div class="tip">Đọc hết cả 3 phương án trước khi chọn. Phương án đúng thường dùng <b>từ khác nhưng cùng nghĩa</b> với thư: <i>lively, busy and colorful, everyone was excited</i> → <b>full of energy</b>.</div>`
    }
  ],

  text: [
    {
      id: 'text-method',
      title: 'Cách làm bài đọc điền khuyết',
      icon: '🧭',
      short: 'Đọc cả đoạn, xác định loại từ, thử từng phương án',
      body: `
<p>Đề thi: <i>Read the following text carefully. Choose the best answer A, B, or C to fill in the blank.</i> Đoạn văn có <b>4 chỗ trống (5)–(8)</b>, mỗi chỗ có 3 phương án.</p>
<p>Các đoạn văn trong đề thường giới thiệu <b>một địa điểm</b> (bảo tàng, công viên, khu bảo tồn) hoặc <b>một lễ hội</b>. Chỗ trống hay rơi vào 4 loại:</p>
<table class="tbl">
  <tr><th>Loại chỗ trống</th><th>Dấu hiệu</th><th>Ví dụ trong đề</th></tr>
  <tr><td>Tính từ cảm xúc</td><td>sau <i>feel, were, are really</i></td><td>Many pupils feel <b>excited</b> when they step inside…</td></tr>
  <tr><td>Từ nối</td><td>giữa hai vế câu</td><td>… ready to help, <b>so</b> you can ask them anything.</td></tr>
  <tr><td>Cụm thời gian</td><td>sau động từ, trước dấu phẩy / <i>in May</i></td><td>School groups usually visit <b>in the morning</b>…</td></tr>
  <tr><td>Danh từ</td><td>sau <i>a / by / have a</i></td><td>have a <b>snack</b> · by <b>boat</b> · a <b>bus</b> trip</td></tr>
</table>

<h3>4 bước làm bài</h3>
<ol class="steps">
  <li><b>Đọc cả đoạn</b> một lượt để biết đoạn văn nói về đâu, về cái gì.</li>
  <li>Ở mỗi chỗ trống, nhìn <b>từ đứng trước và sau</b> để biết cần <b>loại từ</b> gì.</li>
  <li><b>Tìm manh mối</b> trong câu: <i>because…</i> (lý do), <i>when…</i> (lúc nào), <i>in the small café</i> (ở đâu)…</li>
  <li><b>Thử từng phương án</b> vào chỗ trống, đọc lại cả câu: câu nào hợp nghĩa, hợp với manh mối thì chọn.</li>
</ol>
<div class="warn">Đừng chỉ nhìn một từ sát chỗ trống. Ví dụ: <i>some people were (5)___ about visiting <b>because the paths were steep</b></i> — phải đọc hết lý do phía sau mới biết là <b>worried</b> (lo lắng) chứ không phải <i>excited</i>.</div>`
    },
    {
      id: 'text-feelings',
      title: 'Tính từ chỉ cảm xúc',
      icon: '😊',
      short: 'excited, worried, funny… — nhìn lý do đi kèm',
      body: `
<div class="formula">
  <div><span class="tag">S</span> feel / be + <b>tính từ cảm xúc</b> + because / when …</div>
</div>
<p>Cảm xúc luôn đi kèm <b>lý do</b> hoặc <b>tình huống</b> — đó chính là manh mối.</p>
<table class="tbl">
  <tr><th>Câu trong đề</th><th>Manh mối</th><th>Đáp án</th></tr>
  <tr><td>Many pupils feel ___ when they step inside</td><td>because there are so many <b>interesting</b> things to see</td><td><b>excited</b> (háo hức)</td></tr>
  <tr><td>some people were ___ about visiting</td><td>because the mountain paths were <b>steep</b> / the lions might <b>not be safe</b></td><td><b>worried</b> (lo lắng)</td></tr>
  <tr><td>Children always feel ___</td><td>when they see the <b>colorful lights</b> at night</td><td><b>excited</b></td></tr>
  <tr><td>visitors think the monkeys are really ___</td><td>when they <b>copy the visitors</b> / <b>climb on the cars</b></td><td><b>funny</b> (buồn cười)</td></tr>
</table>

<h3>Từ vựng cảm xúc trong đề</h3>
<div class="chips">
  <span><b>excited</b> háo hức</span><span><b>happy</b> vui</span><span><b>worried</b> lo lắng</span><span><b>frightened</b> sợ hãi</span>
  <span><b>bored</b> chán</span><span><b>sleepy</b> buồn ngủ</span><span><b>angry</b> tức giận</span><span><b>sad</b> buồn</span><span><b>funny</b> buồn cười, vui nhộn</span>
</div>
<div class="tip"><b>worried about</b> + việc gì: lo lắng về việc gì — <i>worried about visiting</i>. Khi thấy lý do là điều <b>nguy hiểm, khó khăn</b> (steep, dark, not safe, changed quickly) → chọn cảm xúc <b>tiêu cực</b>.</div>
<div class="warn"><b>funny</b> dùng cho <b>con vật / việc làm người khác cười</b> (monkeys copy the visitors). Còn cảm xúc <b>của chính mình</b> thì dùng <i>excited, happy, worried</i>…</div>`
    },
    {
      id: 'text-linking',
      title: 'Từ nối: because, so, but, although, or',
      icon: '🔗',
      short: 'Lý do, kết quả hay trái ngược?',
      body: `
<table class="tbl">
  <tr><th>Từ nối</th><th>Nghĩa</th><th>Ví dụ trong đề</th></tr>
  <tr><td><b>because</b></td><td>bởi vì — vế sau là <b>lý do</b></td><td>Now it welcomes thousands of visitors each year <b>because</b> people love the wild animals.</td></tr>
  <tr><td><b>so</b></td><td>vì vậy — vế sau là <b>kết quả</b></td><td>Tickets are quite cheap, <b>so</b> most families can easily afford a visit.</td></tr>
  <tr><td><b>but</b></td><td>nhưng — hai ý <b>trái ngược</b></td><td>Visitors should try the local dishes, <b>but</b> they should be careful with very spicy food.</td></tr>
  <tr><td><b>although</b></td><td>mặc dù</td><td><i>Although</i> it was raining, we went out.</td></tr>
  <tr><td><b>or</b></td><td>hoặc — <b>lựa chọn</b></td><td>You can go by bus <i>or</i> by bike.</td></tr>
</table>

<h3>Cách chọn nhanh</h3>
<ol class="steps">
  <li>Đọc <b>vế trước</b> và <b>vế sau</b> chỗ trống.</li>
  <li>Hỏi: vế sau là <b>lý do</b> của vế trước? → <b>because</b>. Là <b>kết quả</b>? → <b>so</b>. <b>Ngược ý</b>? → <b>but</b>.</li>
  <li>Đặt thử vào câu, đọc thành tiếng trong đầu.</li>
</ol>
<div class="ex">
  <div class="ex-cue">Local people prepare for weeks (5)___ they want everything to be perfect.</div>
  <div class="ex-ans">Muốn mọi thứ hoàn hảo là <b>lý do</b> chuẩn bị nhiều tuần → <mark>because</mark></div>
</div>
<div class="ex">
  <div class="ex-cue">You can also enjoy a car trip around the area, (8)___ you should arrive early on busy days.</div>
  <div class="ex-ans">Được đi chơi (tốt) ↔ phải đến sớm (lưu ý) — hai ý <b>ngược nhau</b> → <mark>but</mark></div>
</div>
<div class="warn"><b>because</b> và <b>so</b> dễ nhầm: <i>A because B</i> = <i>B, so A</i>.<br>Guides are ready to help, <b>so</b> you can ask them anything. (giúp đỡ → nên hỏi được)</div>

<h3>Từ nối đầu câu: However, Therefore, Moreover</h3>
<p>Ba từ này đứng <b>đầu câu</b>, có <b>dấu phẩy</b> theo sau, và nối câu đó với <b>câu trước</b>.</p>
<table class="tbl">
  <tr><th>Từ nối</th><th>Nghĩa</th><th>Ví dụ</th></tr>
  <tr><td><b>However,</b></td><td>tuy nhiên — ý <b>ngược lại</b> câu trước</td><td>The test was hard. <b>However</b>, everyone passed.</td></tr>
  <tr><td><b>Therefore,</b></td><td>vì vậy — <b>kết quả</b> của câu trước</td><td>It was raining. <b>Therefore</b>, we stayed at home.</td></tr>
  <tr><td><b>Moreover,</b></td><td>hơn nữa — <b>thêm một ý</b> cùng chiều</td><td>The park is big. <b>Moreover</b>, it is free.</td></tr>
</table>
<div class="ex">
  <div class="ex-cue">Đề thi 2026: <i>Khang jumped back in shock and let out a loud scream, which surprised everyone. (8)______, Ms. Thao just smiled and gave us a big thumbs-up.</i> — A. Therefore B. Moreover C. However</div>
  <div class="ex-ans">Mọi người giật mình ↔ cô chỉ mỉm cười: hai ý <b>ngược nhau</b> → <mark>However</mark></div>
</div>`
    },
    {
      id: 'text-time',
      title: 'Cụm từ chỉ thời gian',
      icon: '⏰',
      short: 'in the morning, annually, daily…',
      body: `
<p>Chỗ trống chỉ thời gian: chọn thời điểm <b>hợp lý với thực tế</b> và với manh mối trong câu.</p>
<table class="tbl">
  <tr><th>Câu trong đề</th><th>Manh mối</th><th>Đáp án</th><th>Loại vì</th></tr>
  <tr><td>School groups usually visit ___, when the rooms are not crowded.</td><td>học sinh đi tham quan; bảo tàng mở cửa</td><td><b>in the morning</b> (vào buổi sáng)</td><td><i>at midnight</i> (nửa đêm), <i>after bedtime</i> (sau giờ ngủ) — bảo tàng đóng cửa</td></tr>
  <tr><td>The festival takes place ___ in December.</td><td><i>Every year</i> ở đầu đoạn; <i>in December</i></td><td><b>annually</b> (hằng năm)</td><td><i>daily</i> (hằng ngày), <i>hourly</i> (hằng giờ) — lễ hội không diễn ra mỗi ngày</td></tr>
</table>
<h3>Trạng từ tần suất theo thời gian</h3>
<div class="chips">
  <span><b>hourly</b> mỗi giờ</span><span><b>daily</b> mỗi ngày</span><span><b>weekly</b> mỗi tuần</span><span><b>monthly</b> mỗi tháng</span><span><b>annually / yearly</b> mỗi năm</span>
</div>
<div class="tip">Đoạn văn về lễ hội thường mở đầu bằng <b>Every year, … holds the famous … Festival</b>. Đó là manh mối cho <b>annually</b> ở cuối đoạn.</div>`
    },
    {
      id: 'text-words',
      title: 'Danh từ: phương tiện và hoạt động',
      icon: '🚌',
      short: 'by bus, a boat trip, have a snack',
      body: `
<h3>1. Phương tiện: by + ___ · a ___ trip</h3>
<p>Nhìn xem nơi đó có <b>sông, hồ, biển</b> hay <b>đường bộ, núi</b>:</p>
<table class="tbl">
  <tr><th>Phương tiện</th><th>Khi nào hợp</th></tr>
  <tr><td><b>boat</b> (thuyền)</td><td>có sông, hồ, biển, đảo, hang nước — <i>Boat Racing Festival, Trang An, Ha Long Bay…</i></td></tr>
  <tr><td><b>bus / car</b> (xe buýt / ô tô)</td><td>đi đường bộ, đường núi, trong công viên lớn — <i>the monkeys climb on the cars</i></td></tr>
  <tr><td><b>bicycle</b> (xe đạp)</td><td>đi quanh thành phố nhỏ, rẻ và vui — <i>cheap and fun</i></td></tr>
  <tr><td><b>train</b> (tàu hoả)</td><td>cần có đường ray; hiếm khi dùng để đi quanh một khu</td></tr>
  <tr><td><b>plane</b> (máy bay)</td><td>đi xa; không dùng để <i>travel around</i> một thành phố hay một khu tham quan</td></tr>
</table>
<div class="warn"><i>You can travel around easily by ___, which is <b>cheap and fun</b>.</i> — loại ngay <b>plane</b> (không rẻ, không đi vòng quanh phố được). Sau đó tìm manh mối về sông nước hay đường phố trong đoạn.</div>

<h3>2. have a + danh từ</h3>
<table class="tbl">
  <tr><th>Cụm từ</th><th>Nghĩa</th><th>Ở đâu</th></tr>
  <tr><td>have a <b>snack</b></td><td>ăn nhẹ</td><td>in the small <b>café</b> ✔</td></tr>
  <tr><td>have a shower</td><td>tắm</td><td>ở nhà</td></tr>
  <tr><td>have a haircut</td><td>cắt tóc</td><td>ở tiệm cắt tóc</td></tr>
</table>
<div class="tip">Chỗ trống danh từ: đọc tiếp <b>sau chỗ trống</b> để biết <b>ở đâu</b> (<i>in the small café</i>) hoặc <b>như thế nào</b> (<i>cheap and fun</i>) — đó là manh mối.</div>`
    }
  ]
};

// Read a passage: bài đọc dài kiểu đề thật 2023–2026 và Stemhouse (8 câu: trắc nghiệm, True/False,
// tìm từ, câu tự viết, điền khuyết). `id` trùng với `topics` của câu hỏi trong scripts/source/passages/.
window.READING_LESSONS.passage = [
  {
    id: 'passage-method',
    title: 'Cách làm bài đọc dài',
    icon: '🧭',
    short: 'Bố cục đề, thứ tự làm bài, cách chấm',
    body: `
<p>Đề thi: <i>Read the following passage carefully. Do the tasks below the passage.</i> Bài đọc dài hơn bức thư, có nhiều đoạn, đôi khi có <b>tiêu đề nhỏ</b> (<i># Switzerland</i>) hoặc đoạn đánh chữ <b>A, B, C, D</b>.</p>
<h3>Đề trông như thế nào?</h3>
<table class="tbl">
  <tr><th>Đề</th><th>Bài đọc</th><th>Câu hỏi</th></tr>
  <tr><td><b>Đề thi 2023, 2024</b></td><td>1 bài dài: <i>Recycling around the World</i>, <i>The Moon and its folktales</i></td><td><b>6 câu</b>: 2 True/False, 2 trắc nghiệm A/B/C, 1 câu viết lý do, 1 câu tìm từ</td></tr>
  <tr><td><b>Stemhouse đề 1–10</b></td><td>1 bài dài (đề 7, 9: 2 bài ngắn)</td><td><b>8 câu</b>: Q1–3 trắc nghiệm, Q4–6 True/False, Q7 tự viết câu trả lời, Q8 tìm từ</td></tr>
  <tr><td><b>Đề thi 2025, 2026</b></td><td>1 thư / đoạn văn + 1 đoạn điền khuyết</td><td><b>4 câu</b> (True/False, ý chính, chi tiết) + <b>4 chỗ trống</b> (5)–(8)</td></tr>
</table>

<h3>6 bước làm bài</h3>
<ol class="steps">
  <li><b>Đọc câu hỏi trước</b>. Gạch chân <b>từ khóa</b> của từng câu: tên riêng, con số, và các chữ quan trọng như <b>NOT, only, why, THREE</b>.</li>
  <li><b>Đọc lướt cả bài</b> một lượt để biết bài nói về gì. Ghi nhanh bên lề mỗi đoạn nói gì, ví dụ: <i>đoạn A: Geneva tắt đèn</i>.</li>
  <li>Với mỗi câu, <b>tìm đoạn có từ khóa</b>. Tên riêng, con số, chữ in hoa là dễ tìm nhất.</li>
  <li><b>Đọc kỹ 1–2 câu</b> quanh chỗ đó. Đó là <b>bằng chứng</b> — gạch chân nó.</li>
  <li><b>Trả lời theo bằng chứng</b> trong bài, không theo điều mình biết ngoài đời.</li>
  <li><b>Kiểm tra</b>: chính tả, số từ, True/False viết đủ, câu nào còn bỏ trống.</li>
</ol>
<div class="tip"><b>Thứ tự làm:</b> câu chi tiết, True/False thường đi <b>theo thứ tự bài đọc</b> (câu trước ở đoạn đầu, câu sau ở đoạn sau). Câu <i>mainly about / best title</i> nên làm <b>sau cùng</b>: đọc xong cả bài mới thấy rõ ý chính.</div>
<div class="tip"><b>Thời gian:</b> đừng "đứng" quá lâu ở một câu. Chưa tìm ra thì đánh dấu, làm câu khác, rồi quay lại. Chừa <b>2–3 phút cuối</b> để soát chính tả.</div>

<h3>Cách chấm rất chặt</h3>
<p>Theo hướng dẫn chấm của Stemhouse, những lỗi nhỏ cũng làm mất điểm:</p>
<table class="tbl">
  <tr><th>Lỗi</th><th>Bị chấm</th></tr>
  <tr><td>Viết tắt <s>T</s> / <s>F</s> thay vì <b>True</b> / <b>False</b></td><td>trừ <b>1 điểm</b></td></tr>
  <tr><td>Sai chính tả từ phải viết</td><td><b>0 điểm</b></td></tr>
  <tr><td>Tìm từ: <b>đổi dạng từ</b> — <s>priorities</s> thay vì <b>priority</b>, <s>collides</s> thay vì <b>collide</b></td><td><b>0 điểm</b> hoặc trừ 1</td></tr>
  <tr><td>Viết <b>thừa từ</b> — <s>a</s> priority, <s>an</s> advantage, <s>is</s> essential</td><td>trừ <b>1 điểm mỗi từ thừa</b></td></tr>
  <tr><td>Câu tự viết: diễn đạt khác nhưng <b>đúng ý</b></td><td>vẫn được điểm ✔</td></tr>
  <tr><td>Câu tự viết: sai ngữ pháp / chính tả</td><td>trừ <b>0,5</b> mỗi lỗi</td></tr>
  <tr><td>Thiếu ý (đề hỏi <b>THREE</b> things mà chỉ viết 2)</td><td>chỉ được <b>một phần</b> điểm</td></tr>
</table>
<div class="warn">Cách an toàn nhất: <b>chép đúng từng chữ trong bài</b>. Chép thì không sai chính tả, không đổi dạng từ. Viết xong, đếm lại số từ và so với đề.</div>`
  },
  {
    id: 'passage-main',
    title: 'Ý chính, tựa bài, tựa đoạn',
    icon: '🎯',
    short: 'mainly about, best title, paragraph B',
    body: `
<p>Các kiểu hỏi ý chính trong đề:</p>
<ul>
  <li><i>The passage is <b>mainly about</b> ______.</i> (Đề thi 2023, Stemhouse đề 5)</li>
  <li><i>The <b>best title</b> for the passage might be ______.</i> (Đề thi 2024, Stemhouse đề 3, 8)</li>
  <li><i>The <b>second paragraph</b> is mainly about ______.</i> (Đề thi 2026)</li>
  <li><i>Choose the best <b>headline for paragraph B</b>.</i> (Stemhouse đề 10)</li>
</ul>
<div class="formula">
  <div>Ý chính = điều mà <b>cả bài</b> (hoặc <b>cả đoạn</b> được hỏi) nói tới — không lớn hơn, không nhỏ hơn.</div>
</div>

<h3>Cách tìm</h3>
<ol class="steps">
  <li>Đọc kỹ <b>câu đầu của bài</b> (hoặc câu đầu của đoạn được hỏi) — chủ đề thường nằm ở đó.</li>
  <li>Đọc lướt câu đầu các đoạn sau: chúng có cùng nói về chủ đề đó không?</li>
  <li>Với mỗi phương án, hỏi: <b>"Nó có bao được cả bài không?"</b></li>
  <li>Loại các phương án bẫy (bảng dưới), chọn cái còn lại.</li>
</ol>

<h3>3 loại phương án bẫy</h3>
<table class="tbl">
  <tr><th>Bẫy</th><th>Ví dụ trong đề</th></tr>
  <tr><td><b>Chỉ một phần</b> của bài</td><td>Đề thi 2023: <s>industrial waste in Senegal</s>, <s>Swiss people and recycling</s> — mỗi cái chỉ nói về 1 trong 3 nước.</td></tr>
  <tr><td><b>Quá chung chung</b></td><td>Stemhouse đề 8: <s>Fun Holidays</s>, <s>A Good Trip</s> — đúng chủ đề du lịch nhưng không nói bài là <b>lời khuyên</b>.</td></tr>
  <tr><td><b>Sai ý / không có trong bài</b></td><td>Đề thi 2024: <s>Important Scientific Facts about the Moon</s> — bài kể <b>truyện dân gian</b>, không phải sự thật khoa học.</td></tr>
</table>

<h3>Ví dụ</h3>
<div class="ex">
  <div class="ex-cue">Đề thi 2023: <i>New statistics give a view of recycling <b>around the world</b>. Here are <b>three of the countries</b> in the report.</i></div>
  <div class="ex-ans">Bài nói cả 3 nước → <mark>a quick view of how nations recycle</mark></div>
</div>
<div class="ex">
  <div class="ex-cue">Đề thi 2026 — đoạn 2: <i>People have <b>celebrated</b> the summer solstice for thousands of years. The most famous celebration happens at Stonehenge… thousands of people gather there to watch this magical sunrise.</i></div>
  <div class="ex-ans">Cả đoạn nói về việc <b>ăn mừng, ngắm mặt trời mọc</b> → <mark>the most popular activity on the June solstice</mark> (không phải <s>the beauty of the ancient stones</s>)</div>
</div>
<div class="ex">
  <div class="ex-cue">Stemhouse đề 3: bài nói về 4 kỹ năng (4Cs) giúp <i>future success</i>.</div>
  <div class="ex-ans"><mark>Essential skills for a successful life</mark> — loại <s>How to become a responsible citizen</s> (chỉ một phần nhỏ) và <s>Skills for bad citizens</s> (sai ý).</div>
</div>
<div class="ex">
  <div class="ex-cue">Stemhouse đề 10 — tựa cho <b>đoạn B</b>: đèn làm động vật ngủ ít, chim lạc đường, côn trùng và chim đâm vào nhà cao tầng rồi chết.</div>
  <div class="ex-ans">Cả đoạn nói về hại cho <b>thiên nhiên</b> → <mark>A threat to nature</mark></div>
</div>
<div class="tip">Câu hỏi tựa đoạn: hai phương án còn lại thường là <b>tựa của đoạn khác</b>. Stemhouse đề 10: <i>What humans are missing out</i> là đoạn <b>C</b>, <i>Actions that should be taken</i> là đoạn <b>D</b>. Nhớ đọc đúng đoạn đề hỏi!</div>`
  },
  {
    id: 'passage-detail',
    title: 'Câu hỏi chi tiết và câu NOT',
    icon: '🔍',
    short: 'According to…, Wh-, Which is NOT…',
    body: `
<p>Câu chi tiết hỏi <b>một thông tin cụ thể</b> trong bài. Các kiểu thường gặp:</p>
<ul>
  <li><i><b>According to</b> the passage / the first paragraph, …</i> — theo bài đọc / theo đoạn 1…</li>
  <li>Câu hỏi <b>Wh-</b>: <i>How many…? Why…? What…?</i></li>
  <li>Câu hoàn thành: <i>People in Senegal ______.</i> (Đề thi 2023)</li>
  <li>Câu <b>NOT</b>: <i>Which of the following is <b>NOT</b>…?</i></li>
</ul>

<h3>4 bước</h3>
<ol class="steps">
  <li>Gạch chân <b>từ khóa</b> trong câu hỏi: <i>Senegal, self-driving cars, 26 September 2019</i>…</li>
  <li><b>Tìm</b> từ khóa đó trong bài, đọc kỹ câu chứa nó và câu sau.</li>
  <li>So từng phương án với câu trong bài. Đáp án đúng thường <b>nói lại bằng từ khác</b>.</li>
  <li>Loại phương án có từ giống bài nhưng <b>sai ý</b>.</li>
</ol>

<h3>Đáp án "nói lại bằng từ khác"</h3>
<table class="tbl">
  <tr><th>Trong bài</th><th>Đáp án</th><th>Đề</th></tr>
  <tr><td>people don’t throw away any items that they can use for something else</td><td><b>make good use of old products</b></td><td>Đề thi 2023</td></tr>
  <tr><td>guide pupils to choose the best ones for them</td><td>books were <b>suitable</b></td><td>Đề thi 2025</td></tr>
  <tr><td>the sun rises perfectly in line with these ancient stones</td><td><b>observe the positioning of the sun</b></td><td>Đề thi 2026</td></tr>
  <tr><td>these vehicles will help reduce traffic jams and accidents</td><td>They help reduce <b>car accidents and traffic jams</b></td><td>Stemhouse đề 4</td></tr>
</table>
<div class="warn"><b>Bẫy "có trong bài nhưng sai ý"</b>
  <ul>
    <li>Đề thi 2026: <s>see 4,000 giant circles</s> — 4,000 là <b>số năm tuổi</b> (<i>4,000-year-old</i>), chỉ có một vòng đá.</li>
    <li>Stemhouse đề 10: <i>Why was the light turned off?</i> — <s>There was a problem with the electricity</s>: bài nói đó là chuyện <b>thường</b> xảy ra, <b>nhưng lần này</b> (<i>but this time</i>) tắt đèn <b>to allow people to go outside and observe the stars</b>.</li>
  </ul>
</div>

<h3>Câu NOT: kiểm tra và gạch từng phương án</h3>
<p>Câu có <b>NOT</b> hỏi cái <b>không có</b> trong bài. Đừng tìm một câu — hãy <b>kiểm tra cả 3 phương án</b>: cái nào tìm thấy trong bài thì <b>gạch đi</b>.</p>
<div class="ex">
  <div class="ex-cue">Đề thi 2024: <i>Which of the following tales does <b>NOT</b> include any animals?</i></div>
  <div class="ex-ans">A. <s>The Mexican tale</s> — có con thỏ (<i>a rabbit</i>)<br>C. <s>The Native American tale</s> — có con ếch và con sói (<i>a frog, a wolf</i>)<br>B. The Hawaiian tale — chỉ có một người phụ nữ và cây cầu cầu vồng → <mark>B</mark></div>
</div>
<div class="ex">
  <div class="ex-cue">Stemhouse đề 3: <i>Which of the following is <b>NOT</b> one of the "4Cs"?</i> — A. Communication B. Creativity C. Calculation</div>
  <div class="ex-ans">Bài kể: <s>Communication</s>, Collaboration, Critical Thinking, <s>Creativity</s> → <mark>C. Calculation</mark></div>
</div>
<div class="tip">Khi đọc đề, <b>khoanh tròn chữ NOT</b> để không quên. Nhiều bạn tìm thấy một phương án trong bài là chọn luôn — đó lại chính là đáp án <b>sai</b>!</div>`
  },
  {
    id: 'passage-tf',
    title: 'True / False với bài dài',
    icon: '✅',
    short: 'only, all, never; so số; diễn đạt lại',
    body: `
<p>Mỗi câu True/False là một câu nói về bài. Tìm chỗ trong bài nói về cùng chuyện đó rồi so từng chi tiết.</p>
<div class="warn">Luôn viết <b>đủ chữ True / False</b>. Viết tắt <s>T</s> / <s>F</s> bị trừ <b>1 điểm</b> (hướng dẫn chấm Stemhouse).</div>

<h3>1. Diễn đạt lại: cùng ý, khác từ → True</h3>
<table class="tbl">
  <tr><th>Câu đề</th><th>Trong bài</th><th>Đáp án</th></tr>
  <tr><td>No other objects are as bright as the Moon in the night sky.</td><td>The Moon is the biggest and <b>brightest</b> object in the night sky.</td><td><b>True</b> (Đề thi 2024)</td></tr>
  <tr><td>In Switzerland people recycle a lot of household items.</td><td>local people only have to <b>throw away a few</b> household items</td><td><b>True</b> (Đề thi 2023)</td></tr>
</table>

<h3>2. So con số</h3>
<div class="ex">
  <div class="ex-cue">Đề thi 2023: <i>The United States recycled a <b>higher</b> percentage of its paper than that of its cans.</i><br>Bài: <i>it recycled <b>48%</b> of its paper, 40% of its plastic bottles and <b>55%</b> of its cans.</i></div>
  <div class="ex-ans">48% &lt; 55% → giấy <b>thấp hơn</b> lon → <mark>False</mark></div>
</div>
<div class="ex">
  <div class="ex-cue">Stemhouse đề 9: <i>Cheetahs can reach speeds of up to <b>80</b> miles per hour.</i> — Bài: <i>up to <b>60 to 70</b> miles per hour</i></div>
  <div class="ex-ans">Số khác bài → <mark>False</mark></div>
</div>
<div class="tip">Thấy câu có <b>số, phần trăm, năm</b> → tìm đúng con số đó trong bài, và xem nó đi với <b>cái gì</b> (paper hay cans? children hay parents?).</div>

<h3>3. Từ "tuyệt đối": only, all, every, never…</h3>
<p>Câu đề có <b>only, all, everybody, every, never, always</b> thường là <b>False</b>, vì bài hay nói "không phải chỉ", "không phải tất cả". Kiểm tra kỹ:</p>
<table class="tbl">
  <tr><th>Câu đề</th><th>Bài nói</th><th>Đáp án</th></tr>
  <tr><td><b>Only</b> children like Baby Three dolls in Vietnam.</td><td>adored by children <b>and adults alike</b></td><td><b>False</b> (Stemhouse đề 2)</td></tr>
  <tr><td>the 4Cs are relevant <b>only</b> for students pursuing careers in the arts</td><td>success in <b>any</b> occupation</td><td><b>False</b> (Stemhouse đề 3)</td></tr>
  <tr><td><b>Everybody</b> has to renew their passports every ten years.</td><td><b>Children</b> need a new passport every <b>five</b> years</td><td><b>False</b> (Stemhouse đề 8)</td></tr>
  <tr><td>Light pollution <b>only</b> causes minor issues for humans…</td><td>còn làm ta <b>không thấy được</b> dải Ngân Hà (<i>the Milky Way</i>)</td><td><b>False</b> (Stemhouse đề 10)</td></tr>
</table>

<h3>4. Từ trái nghĩa, đổi một chữ</h3>
<ul>
  <li>Đề thi 2026: <i>daytime was <b>longer</b>… south of the equator</i> ↔ bài: Nam bán cầu là <i>the <b>shortest</b> day</i> → <b>False</b>.</li>
  <li>Đề thi 2024: <i>an <b>original</b> tale of Japan</i> ↔ bài: <i>the Japanese <b>version</b> of an <b>Indian</b> tale</i> → <b>False</b>.</li>
</ul>

<h3>5. "The passage suggests / implies / indicates…"</h3>
<p>Nghĩa là "bài đọc <b>cho thấy</b>…". Tìm đoạn nói về ý đó và xem bài <b>khuyên gì</b>.</p>
<div class="ex">
  <div class="ex-cue">Stemhouse đề 2: <i>The passage suggests that parents should <b>avoid</b> talking about the environmental impact of toys.</i></div>
  <div class="ex-ans">Lời khuyên trong bài: <i><b>Talk about</b> how making too many toys is bad for the Earth</i> — ngược lại → <mark>False</mark></div>
</div>
<div class="warn">Đổi đúng <b>một chữ</b> là câu sai rồi: <i>avoid ↔ talk about, longer ↔ shortest, only ↔ and adults</i>. Đọc chậm từng chữ trong câu đề.</div>`
  },
  {
    id: 'passage-infer',
    title: 'Câu suy luận',
    icon: '💭',
    short: 'implies, most likely, tính toán',
    body: `
<p>Câu suy luận hỏi điều bài <b>không nói thẳng</b>, nhưng <b>có manh mối</b> để đoán ra.</p>
<ul>
  <li><i>The passage <b>implies / suggests</b> that…</i> — bài ngụ ý rằng…</li>
  <li><i>What is <b>most likely</b> to happen next?</i> — điều gì <b>nhiều khả năng</b> xảy ra tiếp?</li>
  <li><i><b>You can tell that</b>… because…</i> — bạn biết được… vì…</li>
  <li><i>Why is Jamie daydreaming?</i> — hỏi lý do/cảm xúc không được nói ra.</li>
</ul>

<h3>3 bước</h3>
<ol class="steps">
  <li>Tìm <b>manh mối</b> trong bài: hành động, lời nói, cảm xúc của nhân vật.</li>
  <li>Ghép các manh mối lại: "Nếu thế này… thì chắc là…".</li>
  <li>Chọn đáp án <b>được manh mối ủng hộ</b>. Loại đáp án <b>đi quá xa</b>, không có chứng cứ.</li>
</ol>

<h3>Truyện "The Big Interview" (Stemhouse tuyển tập)</h3>
<table class="tbl">
  <tr><th>Câu hỏi</th><th>Manh mối</th><th>Đáp án</th></tr>
  <tr><td>What is most likely to happen next?</td><td>Câu cuối: Ms. Swanson gọi <i>"Charles Locke?"</i></td><td><b>Charles will talk to Ms. Swanson.</b></td></tr>
  <tr><td>You can tell that the girl is nervous because ______.</td><td><i>she tore a card into tiny pieces</i></td><td><b>she tears up one of her index cards</b></td></tr>
  <tr><td>The student who gets the job will be working ______.</td><td>cô giáo <b>khoa học</b> cần <i>a <b>lab</b> helper</i></td><td><b>in the science lab</b></td></tr>
</table>
<div class="warn">Bẫy: <i>her face turns red</i>, <i>her palms are sweaty</i> là của <b>Charles</b>, không phải cô bạn. Đọc kỹ xem manh mối là của <b>ai</b>.</div>

<h3>Truyện "A Long Day" (Stemhouse tuyển tập)</h3>
<table class="tbl">
  <tr><th>Câu hỏi</th><th>Manh mối</th><th>Đáp án</th></tr>
  <tr><td>Why is Jamie daydreaming?</td><td>Jamie đã muốn đi lễ hội; cô <i>thought about all of the food stalls at the festival</i></td><td><b>She wants to be somewhere else.</b></td></tr>
  <tr><td>What is most likely to happen next?</td><td><i>The customers just kept coming!</i></td><td><b>Jamie will become busy again.</b></td></tr>
  <tr><td>What will Jamie most likely do when she gets home?</td><td>cô rất muốn đi lễ hội</td><td><b>see if the festival is still going on</b></td></tr>
</table>
<div class="tip">Loại đáp án <b>đi quá xa</b>: <s>Jamie will leave and go to the festival</s> — mẹ đang cần Jamie giúp (<i>I need your help</i>), bạn ấy sẽ không bỏ đi.</div>

<h3>Suy luận bằng phép tính</h3>
<div class="ex">
  <div class="ex-cue">Stemhouse đề 8: <i>Children need a new passport <b>every five years</b>…</i><br>Câu hỏi: <i>Now, Daisy is ten. Her passport was made in <b>2021</b>. Which year is she going to change her new passport?</i></div>
  <div class="ex-ans">Daisy 10 tuổi → là trẻ em → 5 năm đổi một lần: 2021 + 5 = <mark>She is going to change her passport in 2026.</mark></div>
</div>

<h3>"The passage implies…" dạng True/False</h3>
<ul>
  <li>Stemhouse đề 10: <i>The writer thinks that it is a pity that people today can’t enjoy the night sky.</i> — bài: <i>we almost <b>never</b> witness one of the <b>greatest sights</b> in the world</i> → tiếc thật → <b>True</b>.</li>
  <li>Stemhouse đề 5: <i>people are <b>born with</b> the natural ability to go back to the "resilient zone"</i> — bài: <i>We can <b>learn</b> to find our resilient zone</i> → phải học, không phải sinh ra đã có → <b>False</b>.</li>
</ul>`
  },
  {
    id: 'passage-word',
    title: 'Tìm từ theo định nghĩa',
    icon: '🔤',
    short: 'Write down ONE word which means…',
    body: `
<p>Kiểu câu này có trong mọi đề:</p>
<ul>
  <li><i>Write down <b>ONE word</b> that you find in the passage which means "…".</i></li>
  <li><i>Write down <b>two words</b>… / Find <b>TWO words</b> in the passage that mean "…".</i></li>
  <li><i>Write down <b>NO MORE THAN TWO WORDS</b>…</i> — được viết 1 hoặc 2 từ.</li>
</ul>

<h3>5 bước</h3>
<ol class="steps">
  <li>Đọc định nghĩa, đoán <b>loại từ</b> cần tìm (bảng dưới).</li>
  <li>Đoán <b>chủ đề</b> của từ và tìm <b>đoạn nói về chủ đề đó</b>. "a small waterproof bag… when you are travelling" → đoạn nói về đồ mang theo.</li>
  <li>Thay thử từ tìm được vào định nghĩa: câu trong bài có còn đúng nghĩa không?</li>
  <li><b>Chép y nguyên</b> — đúng dạng số ít/số nhiều, đúng đuôi <i>-s, -ed, -ing</i> như trong bài.</li>
  <li><b>Đếm số từ</b>: ONE = 1 từ, TWO = đúng 2 từ. Không thêm <i>a, the, is</i>.</li>
</ol>

<h3>Đoán loại từ từ định nghĩa</h3>
<table class="tbl">
  <tr><th>Định nghĩa bắt đầu bằng</th><th>Loại từ</th><th>Ví dụ</th></tr>
  <tr><td><b>to</b> + động từ: <i>to exchange…, to hit…, to handle…</i></td><td>động từ</td><td>trade, collide, deal with</td></tr>
  <tr><td><b>a / an / the</b> + danh từ: <i>a thing…, an animal…</i></td><td>danh từ</td><td>priority, advantage, prey</td></tr>
  <tr><td>tính từ: <i>kind, calm and mild; completely necessary</i></td><td>tính từ</td><td>gentle, essential</td></tr>
  <tr><td>V-ing: <i>putting something in a place…</i></td><td>dạng <b>-ing</b></td><td>displaying</td></tr>
</table>

<h3>Ví dụ trong đề</h3>
<table class="tbl">
  <tr><th>Định nghĩa</th><th>Từ</th><th>Đề</th></tr>
  <tr><td>an important thing that needs to be done before other things</td><td><b>priority</b></td><td>Stemhouse đề 1</td></tr>
  <tr><td>to exchange something you have for something someone else has</td><td><b>trade</b></td><td>Stemhouse đề 2</td></tr>
  <tr><td>putting something in a place where people can see it easily</td><td><b>displaying</b></td><td>Stemhouse đề 2</td></tr>
  <tr><td>a thing that helps you to be better or more successful than other people</td><td><b>advantage</b></td><td>Stemhouse đề 3</td></tr>
  <tr><td>completely necessary and extremely important</td><td><b>essential</b></td><td>Stemhouse đề 4</td></tr>
  <tr><td>to handle, manage negative feelings or solve problems (TWO words)</td><td><b>deal with</b></td><td>Stemhouse đề 5</td></tr>
  <tr><td>the hard work and effort that somebody puts into an activity</td><td><b>dedication</b></td><td>Stemhouse đề 6</td></tr>
  <tr><td>kind, calm and mild</td><td><b>gentle</b></td><td>Stemhouse đề 7</td></tr>
  <tr><td>a small waterproof bag… (NO MORE THAN TWO WORDS)</td><td><b>washbag</b> / <b>wash bag</b></td><td>Stemhouse đề 8</td></tr>
  <tr><td>an animal that is hunted and killed for food by another animal</td><td><b>prey</b></td><td>Stemhouse đề 9</td></tr>
  <tr><td>to hit something or someone by accident</td><td><b>collide</b></td><td>Stemhouse đề 10</td></tr>
  <tr><td>get away</td><td><b>escape</b></td><td>Đề thi 2024</td></tr>
  <tr><td>things people use in their home (two words)</td><td><b>household items</b></td><td>Đề thi 2023</td></tr>
  <tr><td>the reason why Sakra did not let the rabbit die (two words only)</td><td><b>its generosity</b></td><td>Đề thi 2024</td></tr>
</table>

<div class="warn"><b>Chấm rất chặt</b> (hướng dẫn chấm Stemhouse):
  <ul>
    <li>Sai chính tả → <b>0 điểm</b>.</li>
    <li>Đổi dạng từ: <s>priorities</s> (bài: priority), <s>collides</s> (bài: collide) → <b>0 điểm</b> hoặc trừ 1.</li>
    <li>Thừa từ: <s>a</s> washbag, <s>an</s> advantage, <s>is</s> essential → trừ <b>1 điểm mỗi từ thừa</b>.</li>
  </ul>
</div>
<div class="tip">Đề cần <b>hai từ</b> thì phải đủ hai: Đề thi 2024 cần <b>its generosity</b> — chỉ viết <i>generosity</i> là thiếu. Chữ <b>for</b> trong <i>saved the rabbit <b>for</b> its generosity</i> nghĩa là "vì" — manh mối cho lý do.</div>`
  },
  {
    id: 'passage-open',
    title: 'Câu hỏi tự viết',
    icon: '✍️',
    short: 'Why…? What…? Chép đúng cụm từ trong bài',
    body: `
<p>Ở câu này bạn phải <b>tự viết câu trả lời</b>. Ví dụ trong đề:</p>
<ul>
  <li><i>Write down the reason why the record in the US is improving quickly.</i> (Đề thi 2023)</li>
  <li><i>According to the passage, what should critical thinkers avoid doing?</i> (Stemhouse đề 3)</li>
  <li><i>How can wearable devices with AI help us take care of our health?</i> (Stemhouse đề 4)</li>
  <li><i>What <b>THREE</b> things can we do to find our resilient zone? Write NO MORE THAN fifteen words.</i> (Stemhouse đề 5)</li>
</ul>

<h3>6 bước</h3>
<ol class="steps">
  <li>Gạch chân <b>từ để hỏi</b> (why, what, how) và <b>từ khóa</b> (record, critical thinkers, wearable devices).</li>
  <li>Tìm <b>câu chìa khóa</b> trong bài có từ khóa đó.</li>
  <li>Trả lời <b>đúng kiểu câu hỏi</b> (bảng dưới).</li>
  <li><b>Chép cụm từ chính</b> từ bài để không sai chính tả.</li>
  <li>Viết <b>ngắn gọn</b>, đúng giới hạn số từ nếu đề có (<i>NO MORE THAN fifteen words</i>).</li>
  <li>Đề hỏi mấy ý thì viết <b>đủ</b> mấy ý: <b>THREE</b> things → 3 ý.</li>
</ol>

<h3>Trả lời đúng kiểu câu hỏi</h3>
<table class="tbl">
  <tr><th>Câu hỏi</th><th>Bắt đầu câu trả lời</th></tr>
  <tr><td><b>Why</b>… / the reason why…</td><td><b>Because</b> + lý do</td></tr>
  <tr><td>What should … <b>avoid doing</b>?</td><td>They should avoid + <b>V-ing</b></td></tr>
  <tr><td><b>How</b> can … help us?</td><td>They help (us) + động từ…</td></tr>
  <tr><td>What <b>THREE</b> things…?</td><td>ý 1, ý 2, <b>and</b> ý 3</td></tr>
  <tr><td>What is the <b>purpose</b> of…?</td><td>They serve as… / They are used to…</td></tr>
  <tr><td><b>Which year</b>…?</td><td>… in + năm</td></tr>
</table>

<h3>Ví dụ</h3>
<div class="ex">
  <div class="ex-cue">Đề thi 2023: <i>it has introduced a lot of new projects in recent years <b>and so</b> its record is really improving quickly</i></div>
  <div class="ex-ans">Lý do nằm <b>trước chữ so</b> → <mark>Because it has introduced a lot of new projects in recent years.</mark></div>
</div>
<div class="ex">
  <div class="ex-cue">Stemhouse đề 3: <i>Critical thinking… is about moving beyond <b>blind acceptance</b></i></div>
  <div class="ex-ans"><mark>Critical thinkers should avoid blindly accepting information.</mark></div>
</div>
<div class="ex">
  <div class="ex-cue">Stemhouse đề 4: <i>Wearable devices… will help <b>monitor our health</b>, <b>alerting us to any potential issues</b> before they become serious as well as <b>give useful advice</b>.</i></div>
  <div class="ex-ans">Có <b>3 ý</b> → <mark>They help monitor our health, alert us to any potential issues before they become serious and give useful advice.</mark></div>
</div>
<div class="ex">
  <div class="ex-cue">Stemhouse đề 5: <i>We can try <b>breathing slowly</b>, <b>thinking of good things</b>, or <b>talking to someone we trust</b>.</i></div>
  <div class="ex-ans"><mark>Breathing slowly, thinking of good things, and talking to someone we trust.</mark> (12 từ ✔ dưới 15)</div>
</div>
<div class="ex">
  <div class="ex-cue">Stemhouse đề 9: <i>What is the purpose of the unique black spots on a cheetah’s golden fur?</i></div>
  <div class="ex-ans">Bài: <i>which serve as camouflage in tall grass</i> → <mark>They serve as camouflage in tall grass.</mark></div>
</div>
<div class="tip">Đề nói <b>Write one way</b> (Stemhouse đề 10: <i>how does light pollution harm animals?</i>) thì chỉ cần 1 ý, ví dụ: <i>Animals sleep less because they think it is still daytime.</i></div>
<div class="warn"><b>Cách chấm</b>: diễn đạt khác mà <b>đúng ý</b> vẫn được điểm; mỗi lỗi ngữ pháp / chính tả trừ <b>0,5</b>; thiếu ý chỉ được <b>một phần</b> điểm. Chép cụm từ trong bài là cách giữ điểm tốt nhất.</div>`
  },
  {
    id: 'passage-cloze',
    title: 'Điền khuyết: chọn và viết từ',
    icon: '🧩',
    short: 'However, where, over; viết đúng từ',
    body: `
<p>Có <b>3 kiểu</b> điền khuyết trong đề:</p>
<table class="tbl">
  <tr><th>Kiểu</th><th>Đề</th><th>Bạn phải làm gì</th></tr>
  <tr><td>Chọn 1 trong 3 từ rồi <b>viết từ đó</b> vào chỗ trống</td><td>Stemhouse đề 7, 9 (Task 1)</td><td>Viết đúng chính tả</td></tr>
  <tr><td>Khung từ (word box)</td><td>Stemhouse tuyển tập</td><td>Mỗi từ dùng <b>một lần</b></td></tr>
  <tr><td>Trắc nghiệm A/B/C</td><td>Đề thi 2025, 2026 (câu 5–8)</td><td>Chọn chữ cái</td></tr>
</table>

<h3>4 bước</h3>
<ol class="steps">
  <li><b>Đọc cả đoạn</b> một lượt để biết đoạn nói về gì.</li>
  <li>Nhìn <b>từ trước và sau</b> chỗ trống để biết cần <b>loại từ</b> gì (động từ, danh từ, từ nối, giới từ).</li>
  <li>Tìm <b>manh mối</b> trong câu (<i>because…, in a large lake, in pairs</i>).</li>
  <li>Thử từng từ, đọc lại cả câu.</li>
</ol>

<h3>1. Chọn và viết từ (Stemhouse đề 7, 9)</h3>
<table class="tbl">
  <tr><th>Câu</th><th>Đáp án</th><th>Vì sao</th></tr>
  <tr><td>if we want to (1)___ global warming and pollution</td><td><b>reduce</b></td><td>giảm ô nhiễm; <i>reuse, recycle</i> dùng cho đồ vật</td></tr>
  <tr><td>in isolated places and also in the (2)___</td><td><b>oceans</b></td><td>tua-bin gió đặt ngoài biển</td></tr>
  <tr><td>colder countries (3)___ there is not enough sunshine</td><td><b>where</b></td><td>sau <b>nơi chốn</b> (countries)</td></tr>
  <tr><td>All (4)___ the world</td><td><b>over</b></td><td>cụm cố định <i>all over the world</i></td></tr>
  <tr><td>one must (1)___ effective study habits</td><td><b>develop</b></td><td>phát triển, tạo thói quen</td></tr>
  <tr><td>distractions… should be (2)___ during studying</td><td><b>avoided</b></td><td>should be + V3: <b>tránh</b> điện thoại, TV</td></tr>
  <tr><td>Engaging with peers (3)___ participating in group discussions</td><td><b>and</b></td><td>hai việc tốt <b>cùng chiều</b></td></tr>
  <tr><td>essential (4)___ achieving personal growth</td><td><b>for</b></td><td><i>essential for</i></td></tr>
</table>
<div class="warn">Phải <b>viết</b> từ, không khoanh chữ cái. Chép đúng từng chữ cái: sai chính tả là <b>0 điểm</b> (<s>avoidded</s>, <s>ocean</s> thiếu -s).</div>

<h3>2. Khung từ (Stemhouse tuyển tập)</h3>
<p><i>Jack studies many different (1)___ at school… Jack has seven (2)___ every school day.</i> → <b>subjects</b>, <b>lessons</b>.</p>
<ul>
  <li>Mỗi từ trong khung dùng <b>đúng một lần</b>. Điền xong từ nào thì <b>gạch</b> từ đó: <s>subjects</s> <s>lessons</s> Maths…</li>
  <li>Làm <b>câu dễ trước</b>, câu khó sau — càng về cuối càng ít từ để chọn.</li>
</ul>

<h3>3. Trắc nghiệm (Đề thi 2025, 2026)</h3>
<p>Đề thi 2025: <b>worried</b> (<i>because they might not be safe</i>), <b>because</b>, <b>boat</b> (<i>in a large lake</i>), <b>daily</b> (<i>from 10 am to 4 pm</i>).<br>
Đề thi 2026: <b>feel</b> (<i>feel like an adventure</i>), <b>lab</b> (<i>lab partner</i>), <b>liquid</b> (trộn với bột), <b>However</b>.</p>

<h3>Từ nối hay gặp</h3>
<table class="tbl">
  <tr><th>Từ nối</th><th>Nghĩa</th><th>Ví dụ</th></tr>
  <tr><td><b>However,</b></td><td>tuy nhiên — ý <b>ngược lại</b> câu trước</td><td>Khang let out a loud scream… <b>However</b>, Ms. Thao just smiled. (Đề thi 2026)</td></tr>
  <tr><td><b>Therefore,</b></td><td>vì vậy — <b>kết quả</b> của câu trước</td><td>It was raining. <b>Therefore</b>, we stayed at home.</td></tr>
  <tr><td><b>Moreover,</b></td><td>hơn nữa — <b>thêm ý</b> cùng chiều</td><td>The park is big. <b>Moreover</b>, it is free.</td></tr>
  <tr><td><b>because</b></td><td>bởi vì — <b>lý do</b></td><td>… visitors each year <b>because</b> people love the animals. (Đề thi 2025)</td></tr>
  <tr><td><b>so</b></td><td>nên — <b>kết quả</b></td><td>… new projects <b>and so</b> its record is improving. (Đề thi 2023)</td></tr>
  <tr><td><b>although</b></td><td>mặc dù</td><td><b>Although</b> it was cold, we swam.</td></tr>
  <tr><td><b>and</b></td><td>và — hai ý cùng chiều</td><td>Engaging with peers <b>and</b> participating… (Stemhouse đề 9)</td></tr>
  <tr><td><b>but</b></td><td>nhưng — hai ý ngược nhau</td><td>Travelling is fun, <b>but</b> lots of things can go wrong. (Stemhouse đề 8)</td></tr>
</table>

<h3>Từ nối chỉ nơi chốn, thời gian, người</h3>
<table class="tbl">
  <tr><th>Từ</th><th>Đứng sau</th><th>Ví dụ</th></tr>
  <tr><td><b>where</b></td><td><b>nơi chốn</b></td><td>colder countries <b>where</b> there is not enough sunshine</td></tr>
  <tr><td><b>when</b></td><td><b>thời gian</b></td><td>the moment <b>when</b> the sun rises</td></tr>
  <tr><td><b>who</b></td><td><b>người</b></td><td>the best rider <b>who</b> climbs fastest</td></tr>
</table>
<div class="tip">However, Therefore, Moreover đứng <b>đầu câu</b> và có <b>dấu phẩy</b> theo sau: <i>(8)___, Ms. Thao just smiled</i> — thấy chỗ trống ở đầu câu, trước dấu phẩy → nghĩ ngay tới 3 từ này.</div>`
  }
];

// Dùng thử không cần đăng nhập: mỗi mảng Reading mở TRIAL.lessons bài đầu và TRIAL.passages bài đọc đầu tiên
// (scripts/seed.js chọn các bài này vào exams/trial).
window.TRIAL = Object.assign(window.TRIAL || {}, { passages: 1 });
