/*
 * Bài giảng phần Listening (nghe điền từ). `id` trùng với `topics` của câu hỏi trong
 * scripts/source/listening.js để nút "Luyện chủ điểm này" lọc đúng câu. Bản tiếng Anh ở cuối file.
 */
window.LISTENING_LESSONS = [
  {
    id: 'listen-method',
    title: 'Cách làm bài nghe điền từ',
    icon: '🎧',
    short: 'Đọc trước câu hỏi, nghe từ khoá, viết đúng số từ',
    body: `
<p>Đề thi: <i>You will hear … Supply the missing information. You should write <b>NO MORE THAN FOUR words</b> in each blank. An example is done for you.</i> Có <b>4 câu</b>, mỗi câu một (đôi khi hai) chỗ trống. Bài nghe thường được phát <b>2 lần</b> (có năm 3 lần).</p>
<h3>5 bước làm bài</h3>
<ol class="steps">
  <li><b>Đọc câu ví dụ</b> để biết bài nói về gì và giọng nói bắt đầu từ đâu.</li>
  <li><b>Đọc trước cả 4 câu</b> trước khi nghe. Gạch chân <b>từ khoá</b> ngay trước và sau chỗ trống.</li>
  <li><b>Đoán loại từ</b> cần điền: danh từ, động từ, số, giờ… (xem bài "Đoán từ cần điền").</li>
  <li><b>Lần nghe 1</b>: viết nhanh từ nghe được. Câu hỏi đi <b>theo thứ tự</b> bài nghe — lỡ một câu thì bỏ qua, nghe câu tiếp.</li>
  <li><b>Lần nghe 2</b>: kiểm tra lại, sửa chính tả, <b>đếm số từ</b>.</li>
</ol>
<div class="tip">Câu hỏi thường <b>diễn đạt lại</b> lời trong bài: bài nói <i>I can't imagine a day without music</i>, câu hỏi viết <i>Music is an essential part of his day</i>. Hãy nghe ý, rồi chép đúng <b>những từ người nói dùng</b> vào chỗ trống.</div>
<div class="warn"><b>Viết đúng những gì nghe được</b>, không tự đổi từ. Đáp án phải khớp với câu hỏi về ngữ pháp: nếu trước chỗ trống là <i>to</i> thì chỗ trống thường bắt đầu bằng động từ nguyên mẫu.</div>`
  },
  {
    id: 'listen-predict',
    title: 'Đoán từ cần điền',
    icon: '🔮',
    short: 'Nhìn từ trước / sau chỗ trống để đoán loại từ',
    body: `
<p>Trước khi nghe, nhìn từ <b>ngay trước và sau</b> chỗ trống để đoán cần loại từ gì. Đoán đúng thì nghe dễ bắt được đáp án hơn nhiều.</p>
<table class="tbl">
  <tr><th>Trước chỗ trống</th><th>Cần điền</th><th>Ví dụ</th></tr>
  <tr><td>a / an / the / some / my…</td><td>danh từ (có thể kèm tính từ)</td><td>an interesting <b>documentary</b></td></tr>
  <tr><td>to / can / will / should / don't</td><td>động từ nguyên mẫu</td><td>you really have to live it and don't <b>waste it</b></td></tr>
  <tr><td>is / are / was / feel / be</td><td>tính từ hoặc cụm danh từ</td><td>Professional acting can be <b>very challenging at times</b></td></tr>
  <tr><td>and / or (trong danh sách)</td><td>cùng loại với các từ trong danh sách</td><td>a raincoat, <b>a packed lunch</b>, your workbook…</td></tr>
  <tr><td>at / on / until / by / before</td><td>thời gian, ngày, giờ</td><td>until <b>4:30</b> · on <b>Saturday</b></td></tr>
  <tr><td>in / at / to (nơi chốn)</td><td>địa điểm</td><td>moved to <b>a safe place</b></td></tr>
</table>
<div class="tip">Đọc cả phần <b>sau</b> chỗ trống: <i>… and other ______ non-stop</i> → sau đó là <i>non-stop</i>, nên chỗ trống là một danh từ số nhiều (<i>kids' shows</i>).</div>`
  },
  {
    id: 'listen-limit',
    title: 'Giới hạn số từ và chính tả',
    icon: '✏️',
    short: 'NO MORE THAN FOUR words, số, giờ, số nhiều',
    body: `
<p>Bài nghe chấm rất chặt: <b>viết quá số từ</b> hay <b>sai chính tả</b> là mất điểm cả câu.</p>
<h3>Đếm số từ</h3>
<ul>
  <li><b>NO MORE THAN FOUR words</b> = được viết 1, 2, 3 hoặc 4 từ. <b>EXACTLY FOUR words</b> = phải đúng 4 từ.</li>
  <li><i>a, the, and</i> cũng tính là một từ: <i>a packed lunch</i> = 3 từ.</li>
  <li>Số viết bằng chữ số (<i>3</i>, <i>4:30</i>) tính là một từ.</li>
</ul>
<h3>Những lỗi hay gặp</h3>
<table class="tbl">
  <tr><th>Lỗi</th><th>Sửa</th></tr>
  <tr><td>Quên <b>-s</b> số nhiều</td><td>other <s>kid's show</s> → other <b>kids' shows</b></td></tr>
  <tr><td>Quên đuôi <b>-ed / -ing</b></td><td>have been <b>practising</b> for 3 months</td></tr>
  <tr><td>Viết sai giờ, ngày</td><td>4:30 p.m. · Saturday · July 15</td></tr>
  <tr><td>Chép thừa từ đã có trong câu</td><td>… is an important part of <s>of</s> <b>our lives</b></td></tr>
</table>
<div class="warn">Sau lần nghe thứ hai, <b>đọc lại cả câu</b> có từ bạn điền: câu phải đúng ngữ pháp và đúng nghĩa.</div>`
  }
];

// Bản tiếng Anh (window.LESSONS_EN do lessons-en.js tạo; khi seed.js đọc file này thì chưa có).
window.LESSONS_EN = Object.assign(window.LESSONS_EN || {}, {
  'listen-method': {
    title: 'How to do a listening gap-fill',
    short: 'Read the questions first, listen for keywords, keep to the word limit',
    body: `
<p>The test says: <i>You will hear … Supply the missing information. You should write <b>NO MORE THAN FOUR words</b> in each blank. An example is done for you.</i> There are <b>4 questions</b>, each with one (sometimes two) blanks. The recording is usually played <b>twice</b> (some years three times).</p>
<h3>5 steps</h3>
<ol class="steps">
  <li><b>Read the example</b> to learn the topic and where the speaker starts.</li>
  <li><b>Read all 4 questions</b> before listening. Underline the <b>keywords</b> just before and after each blank.</li>
  <li><b>Guess the kind of word</b>: noun, verb, number, time… (see "Predict the missing word").</li>
  <li><b>First listening</b>: note what you hear. The questions follow <b>the order</b> of the recording — if you miss one, move on to the next.</li>
  <li><b>Second listening</b>: check, fix the spelling and <b>count the words</b>.</li>
</ol>
<div class="tip">Questions often <b>paraphrase</b> the recording: the speaker says <i>I can't imagine a day without music</i>, the question says <i>Music is an essential part of his day</i>. Listen for the meaning, then copy <b>the speaker's words</b> into the blank.</div>
<div class="warn"><b>Write exactly what you hear</b>. The answer must also fit the grammar of the sentence: after <i>to</i> the blank usually starts with a base verb.</div>`
  },
  'listen-predict': {
    title: 'Predict the missing word',
    short: 'Use the words before and after the blank',
    body: `
<p>Before you listen, look at the words <b>just before and after</b> the blank and guess what kind of word is missing. A good guess makes the answer much easier to catch.</p>
<table class="tbl">
  <tr><th>Before the blank</th><th>You need</th><th>Example</th></tr>
  <tr><td>a / an / the / some / my…</td><td>a noun (maybe with an adjective)</td><td>an interesting <b>documentary</b></td></tr>
  <tr><td>to / can / will / should / don't</td><td>a base verb</td><td>you really have to live it and don't <b>waste it</b></td></tr>
  <tr><td>is / are / was / feel / be</td><td>an adjective or a noun phrase</td><td>Professional acting can be <b>very challenging at times</b></td></tr>
  <tr><td>and / or (in a list)</td><td>the same kind of word as the list</td><td>a raincoat, <b>a packed lunch</b>, your workbook…</td></tr>
  <tr><td>at / on / until / by / before</td><td>a time, day or date</td><td>until <b>4:30</b> · on <b>Saturday</b></td></tr>
  <tr><td>in / at / to (place)</td><td>a place</td><td>moved to <b>a safe place</b></td></tr>
</table>
<div class="tip">Read what comes <b>after</b> the blank too: <i>… and other ______ non-stop</i> → a plural noun (<i>kids' shows</i>).</div>`
  },
  'listen-limit': {
    title: 'Word limits and spelling',
    short: 'NO MORE THAN FOUR words, numbers, times, plurals',
    body: `
<p>Listening is marked strictly: <b>too many words</b> or <b>a spelling mistake</b> loses the whole mark.</p>
<h3>Counting words</h3>
<ul>
  <li><b>NO MORE THAN FOUR words</b> = 1, 2, 3 or 4 words. <b>EXACTLY FOUR words</b> = exactly 4.</li>
  <li><i>a, the, and</i> count as words: <i>a packed lunch</i> = 3 words.</li>
  <li>A number written in figures (<i>3</i>, <i>4:30</i>) counts as one word.</li>
</ul>
<h3>Common mistakes</h3>
<table class="tbl">
  <tr><th>Mistake</th><th>Fix</th></tr>
  <tr><td>Missing plural <b>-s</b></td><td>other <s>kid's show</s> → other <b>kids' shows</b></td></tr>
  <tr><td>Missing <b>-ed / -ing</b></td><td>have been <b>practising</b> for 3 months</td></tr>
  <tr><td>Wrong times and dates</td><td>4:30 p.m. · Saturday · July 15</td></tr>
  <tr><td>Copying words already in the sentence</td><td>… is an important part of <s>of</s> <b>our lives</b></td></tr>
</table>
<div class="warn">After the second listening, <b>read the whole sentence</b> with your answer: it must be grammatical and make sense.</div>`
  }
});
