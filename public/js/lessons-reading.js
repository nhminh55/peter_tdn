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
<div class="warn"><b>because</b> và <b>so</b> dễ nhầm: <i>A because B</i> = <i>B, so A</i>.<br>Guides are ready to help, <b>so</b> you can ask them anything. (giúp đỡ → nên hỏi được)</div>`
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

// Dùng thử không cần đăng nhập: mỗi mảng Reading mở TRIAL.lessons bài đầu và TRIAL.passages bài đọc đầu tiên
// (scripts/seed.js chọn các bài này vào exams/trial).
window.TRIAL = Object.assign(window.TRIAL || {}, { passages: 1 });
