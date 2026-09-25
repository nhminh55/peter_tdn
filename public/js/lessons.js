/*
 * Bài giảng ngữ pháp cho phần Writing. Mỗi bài có `id` trùng với `topics`
 * trong data.js để nút "Luyện chủ điểm này" lọc đúng câu.
 */
window.LESSONS = [
  {
    id: 'method',
    title: 'Cách làm bài viết câu từ gợi ý',
    icon: '🧭',
    short: '6 bước làm bài và những lỗi dễ mất điểm',
    body: `
<p>Đề thi: <i>Write complete sentences with the given cues. You must write <b>NO MORE THAN fifteen words</b> for each sentence.</i></p>
<div class="ex">
  <div class="ex-cue">Katie / teacher / English / nice / kind //</div>
  <div class="ex-ans">→ Katie<mark>'s</mark> teacher <mark>of</mark> English <mark>is very</mark> nice <mark>and</mark> kind.</div>
</div>
<p>Những chữ được tô màu là chữ em phải <b>tự thêm vào</b>. Bài này chấm xem em có thêm đúng các chữ đó và chia đúng động từ không.</p>

<h3>6 bước làm bài</h3>
<ol class="steps">
  <li><b>Đọc hết gợi ý</b>, tìm chủ ngữ (ai/cái gì) và động từ chính.</li>
  <li><b>Tìm dấu hiệu thời gian</b> để chọn thì (xem bảng bên dưới).</li>
  <li><b>Chia động từ</b> theo chủ ngữ: thêm s/es, dùng is/are, was/were, did…</li>
  <li><b>Thêm các từ ngữ pháp còn thiếu</b>: mạo từ (a/an/the), giới từ (in/at/on/to/for), trợ động từ (<i>be</i>, do/does, have), <i>to</i>, liên từ (<i>and</i>, but…), tính từ sở hữu khi ngữ pháp bắt buộc (wash <b>their</b> hands).</li>
  <li><b>Giữ đúng thứ tự gợi ý</b>, không bỏ chữ nào, không đổi nghĩa.</li>
  <li><b>Kiểm tra lại</b>: viết hoa chữ đầu câu, có dấu chấm (.) hoặc dấu chấm hỏi (?), không quá 15 từ.</li>
</ol>

<div class="warn"><b>Quy tắc chấm: chỉ thêm hư từ, không tự chế thêm thông tin</b>
  <p><b>Ràng buộc cứng</b> (sai một điều là mất điểm cả câu):</p>
  <ul>
    <li><b>Tối đa 15 từ</b>, tính cả mạo từ, giới từ, từ nối.</li>
    <li><b>Giữ đủ mọi từ gợi ý</b> — chỉ được chia thì, đổi dạng từ hoặc thêm số nhiều, không được bỏ từ nào.</li>
    <li><b>Không bịa thêm thời gian / tần suất</b> khi đề không có: <i>yesterday, every day, usually, often, always, now…</i> Không có <i>now, at the moment, Look!</i> thì cũng đừng tự dùng hiện tại tiếp diễn.</li>
  </ul>
  <p><b>Được tự do thêm:</b></p>
  <ul>
    <li>Từ ngữ pháp: mạo từ (a/an/the), giới từ (in/on/at/of/to/for…), liên từ (and/but/because/so…), trợ động từ (do/does/did, am/is/are, was/were, will, have/has), <i>to</i> + V.</li>
    <li>Đại từ tân ngữ khi động từ cần tân ngữ: if you need <b>it</b>, give <b>them</b> to poor children.</li>
    <li>Tính từ sở hữu trước danh từ đứng trơ trọi, nhất là người thân / bộ phận cơ thể: <b>my</b> sister, wash <b>their</b> hands, on <b>my</b> last birthday.</li>
    <li><b>very</b> đi kèm tính từ, như câu mẫu của đề: Katie's teacher of English is <b>very</b> nice and kind.</li>
  </ul>
  <ul>
    <li>She / visit / grandparents / twice / month → <s>She usually visits her grandparents twice a month.</s> → She visits her grandparents twice a month.</li>
    <li>Nam / not go / school / because / he / be / sick → <s>Nam did not go to school yesterday because…</s> → Nam does not go to school because he is sick.</li>
    <li>We / collect / old books… → <s>We are collecting old books…</s> → We <b>collect</b> old books…</li>
  </ul>
</div>

<h3>Dấu hiệu → chọn thì</h3>
<table class="tbl">
  <tr><th>Nếu gợi ý có…</th><th>Dùng</th><th>Ví dụ trong đề</th></tr>
  <tr><td>every day, often, usually, twice a month, sự thật</td><td>Hiện tại đơn</td><td>She <b>visits</b> her grandparents twice a month.</td></tr>
  <tr><td>now, at the moment</td><td>Hiện tại tiếp diễn</td><td>My grandfather <b>is watering</b> the flowers at the moment.</td></tr>
  <tr><td>yesterday, last…, this morning, when I was small</td><td>Quá khứ đơn</td><td>They <b>watched</b> an interesting film on TV last night.</td></tr>
  <tr><td>tomorrow, next…, if…</td><td>Tương lai (will)</td><td>If it rains tomorrow, we <b>will stay</b> at home.</td></tr>
  <tr><td>ever, the first time</td><td>Hiện tại hoàn thành</td><td><b>Have</b> you ever <b>been</b> to Phu Quoc?</td></tr>
  <tr><td>than / the …est / as … as</td><td>So sánh</td><td>This book is <b>more interesting than</b> that one.</td></tr>
</table>

<div class="warn"><b>Lỗi hay mất điểm</b>
  <ul>
    <li>Quên <b>s/es</b> sau chủ ngữ số ít: <s>She visit</s> → She visit<b>s</b>.</li>
    <li>Quên <b>be</b> trước tính từ: <s>Mai not as tall as</s> → Mai <b>is</b> not as tall as.</li>
    <li>Quên <b>a/an/the</b>: <s>keep small dog</s> → keep <b>a</b> small dog.</li>
    <li>Quên <b>tính từ sở hữu</b>: <s>wash hands</s> → wash <b>their</b> hands.</li>
    <li>Quên <b>giới từ</b>: <s>late school</s> → late <b>for</b> school.</li>
    <li>Không viết hoa chữ đầu câu, quên dấu chấm/chấm hỏi.</li>
  </ul>
</div>
<div class="tip">Một câu thường có <b>nhiều cách viết đúng</b>. Đổi vị trí cụm thời gian (<i>Last summer, …</i> / <i>… last summer</i>) hay dùng từ đồng nghĩa đúng đều được chấp nhận, miễn là đúng ngữ pháp, dùng đủ các gợi ý và <b>không bịa thêm thông tin</b> (thời gian, tần suất…).</div>`
  },
  {
    id: 'present-simple',
    title: 'Thì hiện tại đơn',
    icon: '🔁',
    short: 'Thói quen, sự thật; thêm s/es; do/does',
    body: `
<p>Dùng để nói về <b>thói quen</b>, việc <b>lặp đi lặp lại</b> và <b>sự thật hiển nhiên</b>.</p>
<div class="formula">
  <div><span class="tag">+</span> S + V(s/es)</div>
  <div><span class="tag">−</span> S + do/does + not + V</div>
  <div><span class="tag">?</span> Do/Does + S + V?</div>
</div>
<p><b>I / you / we / they</b> / danh từ số nhiều → V (giữ nguyên), dùng <b>do</b>.<br>
<b>he / she / it</b> / danh từ số ít (Nam, my father, the Earth, nobody) → V<b>s/es</b>, dùng <b>does</b>.</p>

<h3>Cách thêm s/es</h3>
<table class="tbl">
  <tr><th>Động từ tận cùng bằng</th><th>Thêm</th><th>Ví dụ</th></tr>
  <tr><td>-o, -s, -sh, -ch, -x, -z</td><td>-es</td><td>go → go<b>es</b>, brush → brush<b>es</b>, watch → watch<b>es</b></td></tr>
  <tr><td>phụ âm + y</td><td>bỏ y, thêm -ies</td><td>study → stud<b>ies</b></td></tr>
  <tr><td>còn lại</td><td>-s</td><td>visit<b>s</b>, cook<b>s</b>, like<b>s</b></td></tr>
  <tr><td>have</td><td colspan="2">→ <b>has</b> (My school <b>has</b> a big library.)</td></tr>
</table>

<h3>Dấu hiệu nhận biết</h3>
<p>every day / every morning, once / twice / three times a day/week/month, always, usually, often, sometimes, never, in the evening, sự thật (The Earth goes around the Sun).</p>
<div class="tip"><b>Vị trí trạng từ tần suất</b>: đứng <b>trước động từ thường</b>, <b>sau động từ be</b>.<br>
He <b>often</b> helps his mother. — Lan <b>usually</b> does her homework. — She is <b>always</b> late.</div>

<h3>Ví dụ từ đề</h3>
<ul class="exlist">
  <li>She / brush / teeth / twice / day → She <b>brushes</b> her teeth twice a day.</li>
  <li>My father / not drink / coffee / every morning → My father <b>does not drink</b> coffee every morning.</li>
  <li>The Earth / go / around / Sun → The Earth <b>goes</b> around the Sun.</li>
</ul>
<div class="warn"><b>Sai thường gặp</b>
  <ul>
    <li><s>My father not drinks coffee.</s> → phải có <b>does not</b>.</li>
    <li><s>He doesn't drinks.</s> → sau does/doesn't động từ về nguyên mẫu: doesn't <b>drink</b>.</li>
    <li><s>How much does this schoolbag costs?</s> → does … <b>cost</b>.</li>
  </ul>
</div>`
  },
  {
    id: 'present-continuous',
    title: 'Thì hiện tại tiếp diễn',
    icon: '⏳',
    short: 'Đang xảy ra lúc nói: am/is/are + V-ing',
    body: `
<p>Dùng cho việc <b>đang xảy ra ngay lúc nói</b>, và cho <b>kế hoạch đã sắp xếp</b> trong tương lai gần.</p>
<div class="formula">
  <div><span class="tag">+</span> S + am/is/are + V-ing</div>
  <div><span class="tag">−</span> S + am/is/are + not + V-ing</div>
  <div><span class="tag">?</span> Am/Is/Are + S + V-ing?</div>
</div>
<p>I → <b>am</b> · he/she/it/số ít → <b>is</b> · you/we/they/số nhiều → <b>are</b></p>

<h3>Dấu hiệu</h3>
<p><b>now</b>, <b>right now</b>, <b>at the moment</b>, Look!, Listen!</p>

<h3>Cách thêm -ing</h3>
<table class="tbl">
  <tr><th>Quy tắc</th><th>Ví dụ</th></tr>
  <tr><td>Thêm -ing</td><td>water → water<b>ing</b>, play → play<b>ing</b>, build → build<b>ing</b></td></tr>
  <tr><td>Tận cùng -e: bỏ e</td><td>make → mak<b>ing</b>, come → com<b>ing</b></td></tr>
  <tr><td>1 nguyên âm + 1 phụ âm (1 âm tiết): gấp đôi phụ âm</td><td>swim → swim<b>ming</b>, run → run<b>ning</b></td></tr>
  <tr><td>-ie → -ying</td><td>lie → l<b>ying</b></td></tr>
</table>

<h3>Ví dụ từ đề</h3>
<ul class="exlist">
  <li>My grandfather / water / flowers / moment → My grandfather <b>is watering</b> the flowers at the moment.</li>
  <li>They / build / new bridge / my town / now → They <b>are building</b> a new bridge in my town now.</li>
  <li>My class / go / camping / next Sunday → My class <b>is going</b> camping next Sunday. <i>(kế hoạch tương lai)</i></li>
</ul>
<div class="warn"><b>Sai thường gặp</b>: quên <b>be</b> — <s>My grandfather watering</s> → My grandfather <b>is</b> watering.</div>`
  },
  {
    id: 'past-simple',
    title: 'Thì quá khứ đơn',
    icon: '📅',
    short: 'yesterday, last…; V-ed & động từ bất quy tắc',
    body: `
<p>Dùng cho việc <b>đã xảy ra và kết thúc</b> trong quá khứ.</p>
<div class="formula">
  <div><span class="tag">be</span> I/he/she/it + <b>was</b> · you/we/they + <b>were</b></div>
  <div><span class="tag">+</span> S + V-ed / V2 (cột 2)</div>
  <div><span class="tag">−</span> S + did not + V</div>
  <div><span class="tag">?</span> Did + S + V? · Wh- + did + S + V?</div>
</div>

<h3>Dấu hiệu</h3>
<p><b>yesterday</b>, <b>last</b> night/week/summer/weekend, this morning (khi đã qua), … <b>ago</b>, <b>when we were small</b>.</p>

<h3>Thêm -ed</h3>
<p>visit → visit<b>ed</b> · live → liv<b>ed</b> · stop → stop<b>ped</b> · study → stud<b>ied</b> · play → play<b>ed</b></p>

<h3>Động từ bất quy tắc hay gặp trong đề</h3>
<table class="tbl irr">
  <tr><th>V1</th><th>V2 (quá khứ)</th><th>V3 (phân từ)</th></tr>
  <tr><td>be</td><td>was / were</td><td>been</td></tr>
  <tr><td>go</td><td>went</td><td>gone</td></tr>
  <tr><td>buy</td><td>bought</td><td>bought</td></tr>
  <tr><td>tell</td><td>told</td><td>told</td></tr>
  <tr><td>leave</td><td>left</td><td>left</td></tr>
  <tr><td>come</td><td>came</td><td>come</td></tr>
  <tr><td>sell</td><td>sold</td><td>sold</td></tr>
  <tr><td>speak</td><td>spoke</td><td>spoken</td></tr>
  <tr><td>take</td><td>took</td><td>taken</td></tr>
  <tr><td>do</td><td>did</td><td>done</td></tr>
  <tr><td>have</td><td>had</td><td>had</td></tr>
  <tr><td>make</td><td>made</td><td>made</td></tr>
  <tr><td>see</td><td>saw</td><td>seen</td></tr>
  <tr><td>spend</td><td>spent</td><td>spent</td></tr>
  <tr><td>let</td><td>let</td><td>let</td></tr>
</table>

<h3>Ví dụ từ đề</h3>
<ul class="exlist">
  <li>Yesterday / sister / I / go / mall / and / buy / new clothes → Yesterday my sister and I <b>went</b> to the mall and <b>bought</b> new clothes.</li>
  <li>Nam / not go / school / yesterday / because / he / be / sick → Nam <b>did not go</b> to school yesterday because he <b>was</b> sick.</li>
  <li>What / you / do / last weekend? → What <b>did</b> you <b>do</b> last weekend?</li>
</ul>
<div class="warn"><b>Sai thường gặp</b>: <s>did not went</s>, <s>What did you did</s> — sau <b>did</b> động từ luôn ở nguyên mẫu.</div>`
  },
  {
    id: 'past-continuous',
    title: 'Thì quá khứ tiếp diễn',
    icon: '🎞️',
    short: 'was/were + V-ing … when + quá khứ đơn',
    body: `
<p>Diễn tả một việc <b>đang xảy ra</b> tại một thời điểm trong quá khứ, thường bị <b>một việc khác xen vào</b>.</p>
<div class="formula">
  <div>S + <b>was/were + V-ing</b> + <b>when</b> + S + V2 (quá khứ đơn)</div>
</div>
<div class="diagram">
  <div class="bar">━━━━━━━ đang lau lớp (were cleaning) ━━━━━━━</div>
  <div class="hit">⬆ cô giáo bước vào (came)</div>
</div>
<h3>Ví dụ từ đề</h3>
<ul class="exlist">
  <li>The students / clean / classroom / when / teacher / come → The students <b>were cleaning</b> the classroom when the teacher <b>came</b>.</li>
</ul>
<div class="tip">Việc <b>dài</b>, đang diễn ra → quá khứ tiếp diễn. Việc <b>ngắn</b>, xen vào → quá khứ đơn.</div>`
  },
  {
    id: 'present-perfect',
    title: 'Thì hiện tại hoàn thành',
    icon: '✅',
    short: 'have/has + V3: ever, the first time',
    body: `
<div class="formula">
  <div><span class="tag">+</span> S + have/has + V3</div>
  <div><span class="tag">?</span> Have/Has + S + (ever) + V3?</div>
</div>
<p>I/you/we/they → <b>have</b> · he/she/it → <b>has</b>. V3 là cột 3 (visited, been, seen…).</p>
<h3>Hai cấu trúc trong đề</h3>
<table class="tbl">
  <tr><th>Cấu trúc</th><th>Nghĩa</th><th>Ví dụ</th></tr>
  <tr><td>Have you <b>ever</b> + V3?</td><td>Bạn đã từng … chưa?</td><td>Have you ever <b>been to</b> Phu Quoc?</td></tr>
  <tr><td>This is <b>the first time</b> + S + have/has + V3</td><td>Đây là lần đầu tiên …</td><td>This is the first time I <b>have visited</b> Ha Noi.</td></tr>
</table>
<div class="tip"><b>have been to</b> + nơi chốn = đã từng đến (và đã về).</div>`
  },
  {
    id: 'future',
    title: 'Tương lai & câu điều kiện loại 1',
    icon: '🔮',
    short: 'will + V; If + hiện tại đơn, will + V',
    body: `
<div class="formula">
  <div><span class="tag">will</span> S + will + V (nguyên mẫu)</div>
  <div><span class="tag">if</span> If + S + V (hiện tại đơn), S + will + V</div>
</div>
<p>Dùng <b>will</b> để nói về điều sẽ xảy ra, một dự định, mơ ước: My dream house <b>will have</b> a swimming pool and a big garden.</p>
<h3>Câu điều kiện loại 1</h3>
<p>Nói về điều <b>có thể xảy ra</b> ở tương lai. Vế <b>If dùng hiện tại đơn</b> (không dùng will), vế còn lại dùng <b>will</b>.</p>
<div class="ex"><div class="ex-cue">If / it / rain / tomorrow / we / stay / home</div>
<div class="ex-ans">→ If it <mark>rains</mark> tomorrow, we <mark>will stay</mark> at home.</div></div>
<div class="tip">Kế hoạch đã sắp xếp có thể dùng <b>hiện tại tiếp diễn</b>: My class <b>is going</b> camping next Sunday.</div>
<div class="warn"><b>Sai thường gặp</b>: <s>will has</s> → will <b>have</b>; <s>If it will rain</s> → If it <b>rains</b>.</div>`
  },
  {
    id: 'modals',
    title: 'Động từ khuyết thiếu & câu mệnh lệnh',
    icon: '🚦',
    short: 'should, must, could + V; Remember…, Don\'t…',
    body: `
<div class="formula">
  <div>S + <b>should / must / can / could</b> + V (nguyên mẫu)</div>
  <div>S + should <b>not</b> + V (shouldn't)</div>
</div>
<table class="tbl">
  <tr><th>Từ</th><th>Nghĩa</th><th>Ví dụ trong đề</th></tr>
  <tr><td>should</td><td>nên</td><td>Children <b>should wash</b> their hands before meals.</td></tr>
  <tr><td>should not</td><td>không nên</td><td>We <b>should not throw</b> rubbish in the street.</td></tr>
  <tr><td>must</td><td>phải (bắt buộc)</td><td>Students <b>must wear</b> uniforms at school.</td></tr>
  <tr><td>Could you…?</td><td>nhờ vả lịch sự</td><td><b>Could you show</b> me the way to the post office?</td></tr>
</table>
<div class="warn"><b>Ba lỗi hay gặp</b>
  <ul>
    <li><s>should to wash</s>, <s>must wears</s> → sau modal là <b>V nguyên mẫu</b>.</li>
    <li><s>We not should throw</s> → <b>not đứng sau</b> modal: should not.</li>
    <li>Đề có thể cố tình ghi "not should" để thử em — hãy sửa lại cho đúng.</li>
  </ul>
</div>
<h3>Câu mệnh lệnh</h3>
<div class="formula">
  <div><span class="tag">+</span> V + … (Remember to…, Turn off…)</div>
  <div><span class="tag">−</span> Don't + V + …</div>
</div>
<ul class="exlist">
  <li>Remember / turn off / lights / before / go out → <b>Remember to turn off</b> the lights before going out.</li>
  <li>Don't / make / noise / library → <b>Don't make</b> noise in the library.</li>
</ul>`
  },
  {
    id: 'there-be',
    title: 'There is / There are, much / many',
    icon: '📦',
    short: 'Có cái gì ở đâu; How many / How much',
    body: `
<table class="tbl">
  <tr><th>Cấu trúc</th><th>Đi với</th><th>Ví dụ</th></tr>
  <tr><td>There <b>is</b></td><td>danh từ số ít / không đếm được</td><td>There is not much <b>milk</b> in the fridge.</td></tr>
  <tr><td>There <b>are</b></td><td>danh từ số nhiều</td><td>There are many tall <b>trees</b> in front of my house.</td></tr>
</table>
<h3>much / many</h3>
<p><b>many</b> + danh từ đếm được số nhiều (trees, students) · <b>much</b> + danh từ không đếm được (milk, water, time, money).</p>
<div class="tip">Danh từ <b>không đếm được</b> hay gặp: milk, water, coffee, rubbish, homework, money, time, news, noise. Không thêm "a", không thêm "s".</div>
<h3>Câu hỏi</h3>
<div class="formula">
  <div><b>How many</b> + N số nhiều + are there + …?</div>
  <div><b>How much</b> + N không đếm được + is there + …?</div>
  <div>Hỏi giá: <b>How much</b> + does/do + S + cost?</div>
</div>
<ul class="exlist">
  <li>How many / student / there / your class? → How many <b>students are there</b> in your class?</li>
  <li>How much / this schoolbag / cost? → How much <b>does</b> this schoolbag <b>cost</b>?</li>
</ul>`
  },
  {
    id: 'comparison',
    title: 'So sánh hơn, nhất, ngang bằng',
    icon: '📏',
    short: '-er / more, the -est / the most, as … as',
    body: `
<h3>1. So sánh hơn (có <i>than</i>)</h3>
<div class="formula">
  <div>Tính từ ngắn: S + be + <b>adj-er</b> + than …</div>
  <div>Tính từ dài: S + be + <b>more</b> + adj + than …</div>
</div>
<h3>2. So sánh nhất (in the world / in my class / of all)</h3>
<div class="formula">
  <div>Tính từ ngắn: S + be + <b>the adj-est</b> + N + in …</div>
  <div>Tính từ dài: S + be + <b>the most</b> + adj + N + in …</div>
  <div><b>one of the</b> + so sánh nhất + <b>N số nhiều</b></div>
</div>
<h3>3. So sánh ngang bằng</h3>
<div class="formula"><div>S + be + (not) <b>as + adj + as</b> … · S + V + <b>as + adv + as</b> …</div></div>

<h3>Quy tắc chính tả</h3>
<table class="tbl">
  <tr><th>Tính từ</th><th>Hơn</th><th>Nhất</th><th>Ghi nhớ</th></tr>
  <tr><td>tall, high</td><td>taller, higher</td><td>the tallest, the highest</td><td>thêm -er / -est</td></tr>
  <tr><td>hot, big</td><td>hotter, bigger</td><td>the hottest, the biggest</td><td>gấp đôi phụ âm cuối</td></tr>
  <tr><td>nice, large</td><td>nicer</td><td>the nicest</td><td>tận cùng e: chỉ thêm -r/-st</td></tr>
  <tr><td>happy, easy</td><td>happier</td><td>the happiest</td><td>y → i</td></tr>
  <tr><td>interesting, beautiful</td><td>more …</td><td>the most …</td><td>tính từ dài</td></tr>
  <tr><td><b>good / well</b></td><td><b>better</b></td><td><b>the best</b></td><td>bất quy tắc</td></tr>
  <tr><td><b>bad</b></td><td><b>worse</b></td><td><b>the worst</b></td><td>bất quy tắc</td></tr>
</table>
<h3>So sánh với trạng từ (bổ nghĩa cho động từ)</h3>
<p>sing beautifully → sings <b>more beautifully than</b> · cook well → cooks <b>better than</b> · sing well → sings <b>as well as</b></p>

<h3>Ví dụ từ đề</h3>
<ul class="exlist">
  <li>The weather today is <b>hotter than</b> yesterday.</li>
  <li>My brother is <b>the tallest</b> student in his class.</li>
  <li>Da Nang is <b>one of the most beautiful cities</b> in Vietnam.</li>
  <li>Mai is <b>not as tall as</b> her brother.</li>
  <li>My mother cooks <b>better than</b> I do.</li>
</ul>
<div class="warn"><b>Sai thường gặp</b>: <s>more hot</s>, <s>interestinger</s>, <s>more well</s>, <s>one of the best singer</s> (quên s số nhiều).</div>`
  },
  {
    id: 'verb-patterns',
    title: 'to V, V-ing hay V nguyên mẫu?',
    icon: '🧩',
    short: 'want to, like doing, let sb do, good at doing…',
    body: `
<p>Khi có hai động từ đứng gần nhau, động từ thứ hai phải có dạng đúng. Đây là phần <b>dễ mất điểm nhất</b> của bài viết câu.</p>
<table class="tbl">
  <tr><th>Dạng</th><th>Sau các từ</th><th>Ví dụ trong đề</th></tr>
  <tr><td><b>to V</b></td><td>want, remember (nhớ phải làm), hope, decide, learn</td><td>My sister wants <b>to become</b> a doctor.<br>Remember <b>to turn off</b> the lights.</td></tr>
  <tr><td><b>to V</b> (mục đích = để)</td><td>sau một hành động</td><td>We collect old books <b>to give</b> to poor children.</td></tr>
  <tr><td><b>V-ing</b></td><td>like, love, enjoy, finish, spend + thời gian</td><td>Hoa likes <b>reading</b> comic books.<br>Tom spends two hours <b>doing</b> his homework.</td></tr>
  <tr><td><b>V-ing</b> sau giới từ</td><td>before, after, at, about, good at, look forward to</td><td>before <b>going</b> out · good at <b>playing</b> chess<br>I am looking forward to <b>seeing</b> you.</td></tr>
  <tr><td><b>go + V-ing</b></td><td>hoạt động vui chơi</td><td>go <b>camping</b>, go <b>swimming</b></td></tr>
  <tr><td><b>V nguyên mẫu</b></td><td>let / make / help + ai</td><td>My parents let me <b>keep</b> a small dog.<br>He helps his mother <b>wash</b> the dishes.</td></tr>
  <tr><td><b>V nguyên mẫu</b></td><td>should, must, can, will, do/does/did</td><td>should <b>plant</b>, did not <b>go</b></td></tr>
</table>
<h3>Cấu trúc đặc biệt</h3>
<div class="formula">
  <div><b>It takes</b> + ai + thời gian + <b>to V</b> — It takes me 15 minutes to walk to school.</div>
  <div><b>used to</b> + V — My father used to work as a farmer.</div>
  <div><b>spend</b> + thời gian + <b>V-ing</b> — Tom spends two hours doing his homework.</div>
</div>
<div class="warn"><b>Bẫy "to"</b>: trong <i>look forward <b>to</b></i>, "to" là giới từ nên sau đó là V-ing: <s>look forward to see</s> → look forward to <b>seeing</b>.</div>`
  },
  {
    id: 'passive',
    title: 'Câu bị động',
    icon: '🔄',
    short: 'be + V3: is sold, is spoken',
    body: `
<p>Dùng khi chủ ngữ <b>không tự làm</b> hành động mà <b>được / bị</b> làm.</p>
<div class="formula">
  <div>Hiện tại: S + <b>am/is/are + V3</b></div>
  <div>Quá khứ: S + <b>was/were + V3</b></div>
</div>
<div class="tip"><b>Cách nhận ra</b>: tự hỏi "chủ ngữ có tự làm việc đó được không?". Trà sữa không tự <i>bán</i> → trà sữa <b>được bán</b> → is sold.</div>
<h3>Ví dụ từ đề</h3>
<ul class="exlist">
  <li>Milk tea / sell / at / school canteen → Milk tea <b>is sold</b> at the school canteen.</li>
  <li>English / speak / many countries / around / world → English <b>is spoken</b> in many countries around the world.</li>
</ul>
<p>V3 của động từ bất quy tắc: sell → <b>sold</b>, speak → <b>spoken</b>, make → <b>made</b>, write → <b>written</b>, build → <b>built</b>.</p>`
  },
  {
    id: 'articles-possessives',
    title: 'Mạo từ a/an/the & tính từ sở hữu',
    icon: '🏷️',
    short: 'Khi nào thêm a, an, the, my, his, her, their',
    body: `
<h3>a / an</h3>
<p>Trước <b>danh từ đếm được số ít</b> chưa xác định. <b>an</b> trước âm nguyên âm (a, e, i, o, u): <b>an</b> interesting film, <b>an</b> apple; <b>a</b> small dog, <b>a</b> doctor, <b>a</b> new bicycle.</p>
<h3>the</h3>
<ul>
  <li>Vật <b>duy nhất</b>: the Sun, the Earth, the world.</li>
  <li>Vật <b>đã xác định</b>, người nghe biết là cái nào: the lights, the fridge, the library, the post office.</li>
  <li>Trước <b>so sánh nhất</b>: the tallest, the most beautiful.</li>
  <li>Cụm cố định: at the moment, in the future, in the evening, watch the news, wash the dishes.</li>
</ul>
<h3>Không dùng mạo từ</h3>
<ul>
  <li>Bữa ăn: after <b>dinner</b>, before <b>meals</b>.</li>
  <li>Môn học, môn thể thao, trò chơi: math, English, play <b>football</b>, play <b>chess</b>.</li>
  <li>Phương tiện với by: by <b>car</b>.</li>
  <li>go to <b>school</b>, late for <b>school</b>, at <b>school</b>, at <b>home</b>.</li>
  <li>Danh từ không đếm được nói chung: coffee, rubbish, milk.</li>
</ul>
<h3>Tính từ sở hữu</h3>
<table class="tbl">
  <tr><th>Chủ ngữ</th><td>I</td><td>you</td><td>he</td><td>she</td><td>it</td><td>we</td><td>they</td></tr>
  <tr><th>Sở hữu</th><td>my</td><td>your</td><td>his</td><td>her</td><td>its</td><td>our</td><td>their</td></tr>
</table>
<div class="tip">Bộ phận cơ thể, đồ dùng, người thân, bài tập <b>của ai</b> thì phải có tính từ sở hữu của người đó:<br>
Children wash <b>their</b> hands · She brushes <b>her</b> teeth · He does <b>his</b> homework · He helps <b>his</b> mother.</div>`
  },
  {
    id: 'prepositions',
    title: 'Giới từ in / on / at / for / to',
    icon: '📍',
    short: 'Những cụm giới từ hay xuất hiện trong đề',
    body: `
<h3>Thời gian</h3>
<table class="tbl">
  <tr><th>Giới từ</th><th>Dùng với</th><th>Ví dụ</th></tr>
  <tr><td>at</td><td>giờ, thời điểm</td><td>at 7 o'clock, <b>at the moment</b>, at night</td></tr>
  <tr><td>on</td><td>ngày, thứ, ngày cụ thể</td><td>on Sunday, <b>on my last birthday</b></td></tr>
  <tr><td>in</td><td>buổi, tháng, năm, khoảng dài</td><td><b>in the evening</b>, in May, <b>in the future</b>, <b>in her free time</b></td></tr>
  <tr><td>for</td><td>khoảng thời gian (bao lâu)</td><td><b>for three hours</b></td></tr>
  <tr><td>(không có)</td><td>next, last, every, this, yesterday, tomorrow</td><td>next Sunday, last night, every day</td></tr>
</table>
<h3>Nơi chốn</h3>
<table class="tbl">
  <tr><th>Giới từ</th><th>Ví dụ trong đề</th></tr>
  <tr><td>in</td><td>in the fridge, in my town, in the world, in his class, in my village, in the library, in the back yard, in the street</td></tr>
  <tr><td>at</td><td>at school, at home, at the school canteen</td></tr>
  <tr><td>in front of</td><td>in front of my house</td></tr>
  <tr><td>to</td><td>go to the mall, go to school, walk to school, the way to the post office, have been to Phu Quoc</td></tr>
  <tr><td>around</td><td>go around the Sun, around the world</td></tr>
</table>
<h3>Cụm cố định cần thuộc</h3>
<div class="chips">
  <span>late <b>for</b></span><span>good <b>at</b></span><span>bad <b>at</b></span><span>excited <b>about</b></span>
  <span>look forward <b>to</b></span><span>work <b>as</b></span><span><b>by</b> car</span><span><b>on</b> TV</span>
  <span>give … <b>to</b></span><span>show … the way <b>to</b></span><span>twice <b>a</b> day</span>
</div>`
  },
  {
    id: 'questions',
    title: 'Câu hỏi Yes/No và Wh-',
    icon: '❓',
    short: 'Đảo trợ động từ: Why were…, What did…, How often do…',
    body: `
<p>Trong câu hỏi, <b>trợ động từ</b> (be, do/does/did, have, could…) phải đứng <b>trước chủ ngữ</b>. Nhớ kết thúc bằng dấu <b>?</b></p>
<div class="formula">
  <div>Có be: (Wh-) + <b>am/is/are/was/were</b> + S + …?</div>
  <div>Động từ thường: (Wh-) + <b>do/does/did</b> + S + V nguyên mẫu …?</div>
  <div>Hiện tại hoàn thành: (Wh-) + <b>have/has</b> + S + V3 …?</div>
  <div>Modal: (Wh-) + <b>could/can/should</b> + S + V …?</div>
</div>
<h3>Từ để hỏi</h3>
<table class="tbl">
  <tr><th>Từ</th><th>Hỏi về</th><th>Ví dụ trong đề</th></tr>
  <tr><td>What</td><td>cái gì</td><td>What <b>did</b> you do last weekend? · What <b>is</b> your favorite subject at school?</td></tr>
  <tr><td>Why</td><td>tại sao</td><td>Why <b>were</b> you late for school this morning?</td></tr>
  <tr><td>How often</td><td>bao lâu một lần</td><td>How often <b>do</b> you go swimming?</td></tr>
  <tr><td>How many</td><td>bao nhiêu (đếm được)</td><td>How many students <b>are</b> there in your class?</td></tr>
  <tr><td>How much</td><td>bao nhiêu (không đếm được) / giá</td><td>How much <b>does</b> this schoolbag cost?</td></tr>
  <tr><td>(Yes/No)</td><td>có … không</td><td><b>Have</b> you ever been to Phu Quoc? · <b>Could</b> you show me …?</td></tr>
</table>
<div class="warn"><b>Sai thường gặp</b>: <s>Why you were late?</s> (chưa đảo) · <s>What you did?</s> (thiếu did) · <s>How often you go?</s> (thiếu do).</div>`
  },
  {
    id: 'conjunctions',
    title: 'Liên từ: and, but, because, so…that, when, if',
    icon: '🔗',
    short: 'Nối hai từ hoặc hai mệnh đề',
    body: `
<table class="tbl">
  <tr><th>Liên từ</th><th>Nghĩa</th><th>Ví dụ trong đề</th></tr>
  <tr><td>and</td><td>và</td><td>My school has a big library <b>and</b> a modern gym.</td></tr>
  <tr><td>but</td><td>nhưng (trái ngược)</td><td>Hoang is good at math <b>but</b> bad at English.</td></tr>
  <tr><td>because</td><td>bởi vì (lý do)</td><td>Nam did not go to school yesterday <b>because</b> he was sick.</td></tr>
  <tr><td>so + adj + that</td><td>quá … đến nỗi</td><td>The film was <b>so boring that</b> we left early.</td></tr>
  <tr><td>when</td><td>khi</td><td>My grandmother told us stories <b>when</b> we were small.</td></tr>
  <tr><td>if</td><td>nếu</td><td><b>If</b> it rains tomorrow, we will stay at home.</td></tr>
  <tr><td>before / after</td><td>trước / sau khi</td><td>… <b>before</b> going out · <b>After</b> finishing dinner, …</td></tr>
</table>
<div class="tip"><b>Hai vế cùng thì</b>: khi nối hai hành động bằng <i>and</i>, cả hai động từ chia cùng thì — went … <b>and</b> bought.</div>
<div class="tip"><b>Dấu phẩy</b>: khi mệnh đề <i>If / After / When</i> đứng đầu câu, đặt dấu phẩy trước vế sau.<br>If it rains tomorrow<b>,</b> we will stay at home.</div>
<div class="warn">Gợi ý có thể <b>không có sẵn</b> liên từ, em phải tự thêm: My dream house / have / swimming pool / big garden → … a swimming pool <b>and</b> a big garden.</div>`
  }
];

// Dùng thử không cần đăng nhập: xem được TRIAL.lessons bài đầu, làm TRIAL.questions câu
// (scripts/seed.js chọn các câu này vào exams/trial; firestore.rules chỉ mở đúng các câu đó).
window.TRIAL = { lessons: 2, questions: 5 };
