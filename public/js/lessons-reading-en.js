/*
 * English version of the Reading lessons, keyed by lesson id (see lessons-reading.js).
 */
Object.assign(window.LESSONS_EN, {
  'letter-method': {
    title: 'How to read a letter',
    short: 'Parts of a letter, who "I" is, 4 steps',
    body: `
<p>The test says: <i>Read the following letter carefully. Do the tasks below the letter.</i> There are <b>4 questions</b>:</p>
<ul>
  <li><b>Questions 1–2</b>: True / False — does the sentence match the letter?</li>
  <li><b>Question 3</b>: <i>The letter is mainly about ___</i> — the main idea of the whole letter.</li>
  <li><b>Question 4</b>: a detail question — <i>Who…? How did … feel? According to the letter…</i></li>
</ul>

<h3>The parts of a test letter</h3>
<table class="tbl">
  <tr><th>Part</th><th>Example from the tests</th><th>It tells you</th></tr>
  <tr><td>Greeting</td><td><b>Dear</b> Mai Phuong,</td><td>The <b>reader</b> (= <i>you</i>)</td></tr>
  <tr><td>Opening</td><td>Last weekend, our school held <b>the Talent Show</b>, and I really want to tell you all about it.</td><td>The <b>topic</b> → question 3</td></tr>
  <tr><td>Paragraph 2</td><td>The school yard was crowded and noisy in a happy way…</td><td>The atmosphere and the activities</td></tr>
  <tr><td>Paragraph 3</td><td>As a volunteer, I helped prepare the stage… I started the show with a magic trick.</td><td>What the writer <b>did</b></td></tr>
  <tr><td>Paragraph 4</td><td>… made me really happy. Now I believe more than ever that…</td><td>The writer's <b>feelings</b> and <b>opinion</b></td></tr>
  <tr><td>Closing</td><td>Write back soon and tell me your news.</td><td>—</td></tr>
  <tr><td>Signature</td><td><b>Your friend,</b> Anh Khoa</td><td>The <b>writer</b> (= <i>I</i>)</td></tr>
</table>

<div class="warn"><b>The most common trap: who is "I"?</b>
  <p><b>I / my / me</b> in the letter is always <b>the person who signs at the end</b> (after <i>Your friend,</i>), not the person after <i>Dear</i>.</p>
  <ul>
    <li>Dear <b>Gia Han</b>, … I even started the fashion show … Your friend, <b>Minh Chau</b></li>
    <li>→ <i>Who started the fashion show?</i> — <b>Minh Chau</b> (not Gia Han).</li>
  </ul>
</div>

<h3>4 steps</h3>
<ol class="steps">
  <li><b>Find the two names</b>: who reads it (Dear …) and who writes it (Your friend, …).</li>
  <li><b>Skim the whole letter</b> once to see which event it is about.</li>
  <li><b>Read each question</b>, underline the <b>key words</b> (the event, <i>volunteer, excited, believe, started…</i>) and find the sentence with those words in the letter.</li>
  <li><b>Compare carefully</b> before you choose. The right answer often <b>says the same thing in other words</b> (<i>everyone was excited</i> = <i>full of energy</i>).</li>
</ol>
<div class="tip">The test letters always have the same shape: they tell a friend about <b>an event at school</b> (a fair, a festival, a contest, a special day…). Know the shape and you can answer all 4 questions quickly.</div>`
  },
  'letter-tf': {
    title: 'True / False questions',
    short: 'Compare with the letter; traps: nobody, all, exactly the same',
    body: `
<p>The test says: <i>Decide whether this sentence is True or False.</i> Write <b>True</b> if the sentence <b>matches the letter</b>, <b>False</b> if the letter says something different.</p>

<h3>How to do it</h3>
<ol class="steps">
  <li>Underline the <b>key words</b>: <i>Nobody … excited</i>, <i>volunteer</i>, <i>believes</i>, <i>presentation skills</i>…</li>
  <li>Find the sentence with those words (or words with the same meaning) in the letter.</li>
  <li>Check every part: <b>who</b>, <b>did what</b>, <b>how</b>. If <b>one part is wrong</b>, the whole sentence is <b>False</b>.</li>
</ol>

<h3>Sentences that come up in the tests</h3>
<table class="tbl">
  <tr><th>Test sentence</th><th>The letter says</th><th>Answer</th></tr>
  <tr><td>Nobody at the Charity Fair was excited.</td><td>The atmosphere was lively, and <b>everyone</b> was excited.</td><td><b>False</b></td></tr>
  <tr><td>All of the story corners were exactly the same.</td><td><b>some</b> of them were quiet, and <b>the rest</b> were very exciting</td><td><b>False</b></td></tr>
  <tr><td>The atmosphere at the Sports Day was quiet and boring.</td><td>The whole school was <b>busy and colorful</b>… nobody felt bored.</td><td><b>False</b></td></tr>
  <tr><td>Minh Chau worked as a volunteer at the Culture Festival.</td><td>I joined <b>as a volunteer</b> … Your friend, <b>Minh Chau</b></td><td><b>True</b></td></tr>
  <tr><td>Many pupils showed excellent presentation skills.</td><td>their presentation skills were <b>excellent</b></td><td><b>True</b></td></tr>
  <tr><td>Anh Khoa believes that everyone has a special talent.</td><td>Now I <b>believe</b> more than ever that everyone has a special talent.</td><td><b>True</b></td></tr>
</table>

<div class="warn"><b>Trap words — check twice when you see them</b>
  <ul>
    <li><b>nobody / no one</b>, <b>never</b> — the letter usually says <i>everyone</i>, <i>many pupils</i>.</li>
    <li><b>all … exactly the same</b> — the letter usually says <i>some … others …</i></li>
    <li><b>only</b> — the letter usually tells about more than one thing.</li>
    <li><b>quiet, boring, empty</b> — the opposite of <i>lively, busy, full of energy, exciting</i>.</li>
  </ul>
</div>
<div class="tip"><b>Same meaning, different words</b>: <i>took part in = participated in = joined in = played a part in</i> · <i>excellent = incredible = impressed everyone</i> · <i>happy = glad = proud</i>.</div>`
  },
  'letter-main': {
    title: 'The main idea of the letter',
    short: 'The letter is mainly about ___',
    body: `
<p>Question 3 always asks: <i>The letter is mainly about ______.</i></p>
<div class="formula">
  <div>The main idea = what <b>the whole letter</b> tells about, usually said in the <b>opening paragraph</b>.</div>
</div>
<div class="ex">
  <div class="ex-cue">Today I want to tell you about <b>the Culture Festival at our school</b>. I joined as a volunteer, and I enjoyed every minute of it.</div>
  <div class="ex-ans">→ The letter is mainly about <mark>an interesting school event</mark>.</div>
</div>

<h3>Wrong options</h3>
<table class="tbl">
  <tr><th>Option</th><th>Why it is wrong</th></tr>
  <tr><td>the work of the teachers <b>only</b></td><td>The letter does not talk about the teachers, and <b>only</b> makes it even more wrong.</td></tr>
  <tr><td>the importance of world cultures / reading habits / charity work…</td><td>This is only the writer's <b>opinion in the last paragraph</b> (<i>I truly believe that…</i>), not what the whole letter is about.</td></tr>
  <tr><td><b>an interesting school event</b></td><td>✔ All 4 paragraphs are about the event at school.</td></tr>
</table>
<div class="tip"><b>Tip</b>: the right main idea is usually the most <b>general</b> option that covers the whole letter. An option that is too narrow (one detail) or has <b>only</b> is usually wrong.</div>`
  },
  'letter-detail': {
    title: 'Detail questions: Who, How, According to',
    short: 'Who did it, how they felt, what the event was like',
    body: `
<p>Question 4 asks about <b>one detail</b>. Find the exact sentence first, then choose.</p>

<h3>1. Who started …?</h3>
<div class="ex">
  <div class="ex-cue">Dear Gia Han, … I even started the fashion show with a beautiful ao dai. … Your friend, Minh Chau</div>
  <div class="ex-ans">Who started the fashion show? → <mark>Minh Chau</mark> (<i>I</i> = the writer)</div>
</div>
<div class="warn">The options often include <b>the reader's name</b> (after Dear) and <b>The head teacher</b> — both wrong, because the letter says <b>I</b> started.</div>

<h3>2. How did … feel about …?</h3>
<p>Look for the writer's feeling words: <i>made me really happy, I am so glad, I feel proud, I will never forget…</i></p>
<table class="tbl">
  <tr><th>Positive ✔</th><th>Negative ✘</th></tr>
  <tr><td><b>proud</b>, <b>happy</b>, <b>glad</b>, <b>excited</b>, <b>interested</b></td><td><b>tired</b>, <b>bored</b>, <b>worried</b>, <b>sad</b>, <b>angry</b></td></tr>
</table>

<h3>3. According to the letter, the … was ___.</h3>
<p>Find the sentence that describes the event, usually in paragraph 2.</p>
<table class="tbl">
  <tr><th>The letter says</th><th>Right answer</th><th>Wrong options</th></tr>
  <tr><td>The event was full of energy. The atmosphere was lively…</td><td><b>full of energy</b></td><td>quiet and empty · only for the teachers</td></tr>
</table>
<div class="tip">Read all 3 options before you choose. The right one often uses <b>different words with the same meaning</b>: <i>lively, busy and colorful, everyone was excited</i> → <b>full of energy</b>.</div>`
  },
  'text-method': {
    title: 'How to do a gap-fill text',
    short: 'Read it all, find the word type, try each option',
    body: `
<p>The test says: <i>Read the following text carefully. Choose the best answer A, B, or C to fill in the blank.</i> The text has <b>4 blanks (5)–(8)</b>, each with 3 options.</p>
<p>The texts usually describe <b>a place</b> (a museum, a park, a nature reserve) or <b>a festival</b>. The blanks are usually one of 4 kinds:</p>
<table class="tbl">
  <tr><th>Kind of blank</th><th>Signal</th><th>Example from the tests</th></tr>
  <tr><td>Feeling adjective</td><td>after <i>feel, were, are really</i></td><td>Many pupils feel <b>excited</b> when they step inside…</td></tr>
  <tr><td>Linking word</td><td>between two parts of a sentence</td><td>… ready to help, <b>so</b> you can ask them anything.</td></tr>
  <tr><td>Time phrase</td><td>after a verb, before a comma / <i>in May</i></td><td>School groups usually visit <b>in the morning</b>…</td></tr>
  <tr><td>Noun</td><td>after <i>a / by / have a</i></td><td>have a <b>snack</b> · by <b>boat</b> · a <b>bus</b> trip</td></tr>
</table>

<h3>4 steps</h3>
<ol class="steps">
  <li><b>Read the whole text</b> once to see what place or event it is about.</li>
  <li>At each blank, look at the <b>words before and after</b> to see what <b>kind of word</b> you need.</li>
  <li><b>Find the clue</b> in the sentence: <i>because…</i> (reason), <i>when…</i> (time), <i>in the small café</i> (place)…</li>
  <li><b>Try each option</b> in the blank and read the sentence again. Choose the one that makes sense with the clue.</li>
</ol>
<div class="warn">Do not look only at the word next to the blank. Example: <i>some people were (5)___ about visiting <b>because the paths were steep</b></i> — read the whole reason to see that it is <b>worried</b>, not <i>excited</i>.</div>`
  },
  'text-feelings': {
    title: 'Feeling adjectives',
    short: 'excited, worried, funny… — look at the reason',
    body: `
<div class="formula">
  <div><span class="tag">S</span> feel / be + <b>feeling adjective</b> + because / when …</div>
</div>
<p>A feeling always comes with a <b>reason</b> or a <b>situation</b> — that is your clue.</p>
<table class="tbl">
  <tr><th>Test sentence</th><th>Clue</th><th>Answer</th></tr>
  <tr><td>Many pupils feel ___ when they step inside</td><td>because there are so many <b>interesting</b> things to see</td><td><b>excited</b></td></tr>
  <tr><td>some people were ___ about visiting</td><td>because the mountain paths were <b>steep</b> / the lions might <b>not be safe</b></td><td><b>worried</b></td></tr>
  <tr><td>Children always feel ___</td><td>when they see the <b>colorful lights</b> at night</td><td><b>excited</b></td></tr>
  <tr><td>visitors think the monkeys are really ___</td><td>when they <b>copy the visitors</b> / <b>climb on the cars</b></td><td><b>funny</b></td></tr>
</table>

<h3>Feeling words in the tests</h3>
<div class="chips">
  <span><b>excited</b></span><span><b>happy</b></span><span><b>worried</b></span><span><b>frightened</b></span>
  <span><b>bored</b></span><span><b>sleepy</b></span><span><b>angry</b></span><span><b>sad</b></span><span><b>funny</b></span>
</div>
<div class="tip"><b>worried about</b> + something — <i>worried about visiting</i>. When the reason is something <b>dangerous or difficult</b> (steep, dark, not safe, changed quickly), choose a <b>negative</b> feeling.</div>
<div class="warn"><b>funny</b> is for <b>animals or actions that make people laugh</b> (monkeys copy the visitors). For <b>your own</b> feelings use <i>excited, happy, worried</i>…</div>`
  },
  'text-linking': {
    title: 'Linking words: because, so, but, although, or',
    short: 'Reason, result or contrast?',
    body: `
<table class="tbl">
  <tr><th>Linking word</th><th>Meaning</th><th>Example from the tests</th></tr>
  <tr><td><b>because</b></td><td>the next part is the <b>reason</b></td><td>Now it welcomes thousands of visitors each year <b>because</b> people love the wild animals.</td></tr>
  <tr><td><b>so</b></td><td>the next part is the <b>result</b></td><td>Tickets are quite cheap, <b>so</b> most families can easily afford a visit.</td></tr>
  <tr><td><b>but</b></td><td>two <b>opposite</b> ideas</td><td>Visitors should try the local dishes, <b>but</b> they should be careful with very spicy food.</td></tr>
  <tr><td><b>although</b></td><td>even though</td><td><i>Although</i> it was raining, we went out.</td></tr>
  <tr><td><b>or</b></td><td>a <b>choice</b></td><td>You can go by bus <i>or</i> by bike.</td></tr>
</table>

<h3>Choose quickly</h3>
<ol class="steps">
  <li>Read the part <b>before</b> and the part <b>after</b> the blank.</li>
  <li>Ask: is the second part the <b>reason</b>? → <b>because</b>. The <b>result</b>? → <b>so</b>. The <b>opposite</b>? → <b>but</b>.</li>
  <li>Put it in and read the sentence in your head.</li>
</ol>
<div class="ex">
  <div class="ex-cue">Local people prepare for weeks (5)___ they want everything to be perfect.</div>
  <div class="ex-ans">Wanting everything to be perfect is the <b>reason</b> they prepare for weeks → <mark>because</mark></div>
</div>
<div class="ex">
  <div class="ex-cue">You can also enjoy a car trip around the area, (8)___ you should arrive early on busy days.</div>
  <div class="ex-ans">A nice trip (good) ↔ arrive early (a warning) — <b>opposite</b> ideas → <mark>but</mark></div>
</div>
<div class="warn"><b>because</b> and <b>so</b> are easy to mix up: <i>A because B</i> = <i>B, so A</i>.<br>Guides are ready to help, <b>so</b> you can ask them anything. (they help → you can ask)</div>`
  },
  'text-time': {
    title: 'Time phrases',
    short: 'in the morning, annually, daily…',
    body: `
<p>For a time blank, choose the time that <b>makes sense in real life</b> and fits the clue in the sentence.</p>
<table class="tbl">
  <tr><th>Test sentence</th><th>Clue</th><th>Answer</th><th>Not</th></tr>
  <tr><td>School groups usually visit ___, when the rooms are not crowded.</td><td>pupils on a school visit; the museum is open</td><td><b>in the morning</b></td><td><i>at midnight</i>, <i>after bedtime</i> — the museum is closed</td></tr>
  <tr><td>The festival takes place ___ in December.</td><td><i>Every year</i> at the start; <i>in December</i></td><td><b>annually</b></td><td><i>daily</i>, <i>hourly</i> — a festival does not happen every day</td></tr>
</table>
<h3>How often</h3>
<div class="chips">
  <span><b>hourly</b> every hour</span><span><b>daily</b> every day</span><span><b>weekly</b> every week</span><span><b>monthly</b> every month</span><span><b>annually / yearly</b> every year</span>
</div>
<div class="tip">Festival texts usually start with <b>Every year, … holds the famous … Festival</b>. That is the clue for <b>annually</b> at the end.</div>`
  },
  'text-words': {
    title: 'Nouns: transport and activities',
    short: 'by bus, a boat trip, have a snack',
    body: `
<h3>1. Transport: by + ___ · a ___ trip</h3>
<p>Check whether the place has <b>a river, a lake or the sea</b>, or <b>roads and mountains</b>:</p>
<table class="tbl">
  <tr><th>Transport</th><th>When it fits</th></tr>
  <tr><td><b>boat</b></td><td>rivers, lakes, the sea, islands, water caves — <i>Boat Racing Festival, Trang An, Ha Long Bay…</i></td></tr>
  <tr><td><b>bus / car</b></td><td>roads, mountain roads, big parks — <i>the monkeys climb on the cars</i></td></tr>
  <tr><td><b>bicycle</b></td><td>getting around a small town, cheap and fun — <i>cheap and fun</i></td></tr>
  <tr><td><b>train</b></td><td>needs a railway; rarely used to go around one area</td></tr>
  <tr><td><b>plane</b></td><td>long journeys; not for <i>travelling around</i> a town or a park</td></tr>
</table>
<div class="warn"><i>You can travel around easily by ___, which is <b>cheap and fun</b>.</i> — cross out <b>plane</b> at once (not cheap, not for going around town). Then look for clues about water or streets in the text.</div>

<h3>2. have a + noun</h3>
<table class="tbl">
  <tr><th>Phrase</th><th>Meaning</th><th>Where</th></tr>
  <tr><td>have a <b>snack</b></td><td>eat a little food</td><td>in the small <b>café</b> ✔</td></tr>
  <tr><td>have a shower</td><td>wash your body</td><td>at home</td></tr>
  <tr><td>have a haircut</td><td>get your hair cut</td><td>at the hairdresser's</td></tr>
</table>
<div class="tip">For a noun blank, read on <b>after the blank</b> to see <b>where</b> (<i>in the small café</i>) or <b>what it is like</b> (<i>cheap and fun</i>) — that is the clue.</div>`
  }
});
