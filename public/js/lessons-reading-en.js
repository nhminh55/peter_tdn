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
<div class="warn"><b>because</b> and <b>so</b> are easy to mix up: <i>A because B</i> = <i>B, so A</i>.<br>Guides are ready to help, <b>so</b> you can ask them anything. (they help → you can ask)</div>

<h3>Sentence linkers: However, Therefore, Moreover</h3>
<p>These three words come at the <b>start of a sentence</b>, with a <b>comma</b> after them, and link it to the <b>sentence before</b>.</p>
<table class="tbl">
  <tr><th>Linking word</th><th>Meaning</th><th>Example</th></tr>
  <tr><td><b>However,</b></td><td>the <b>opposite</b> of what came before</td><td>The test was hard. <b>However</b>, everyone passed.</td></tr>
  <tr><td><b>Therefore,</b></td><td>the <b>result</b> of the sentence before</td><td>It was raining. <b>Therefore</b>, we stayed at home.</td></tr>
  <tr><td><b>Moreover,</b></td><td><b>adds</b> another similar idea</td><td>The park is big. <b>Moreover</b>, it is free.</td></tr>
</table>
<div class="ex">
  <div class="ex-cue">2026 exam: <i>Khang jumped back in shock and let out a loud scream, which surprised everyone. (8)______, Ms. Thao just smiled and gave us a big thumbs-up.</i> — A. Therefore B. Moreover C. However</div>
  <div class="ex-ans">Everyone was shocked ↔ she just smiled: <b>opposite</b> ideas → <mark>However</mark></div>
</div>`
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
  },

  // Read a passage
  'passage-method': {
    title: 'How to do a long reading passage',
    short: 'Test format, order of work, marking',
    body: `
<p>The test says: <i>Read the following passage carefully. Do the tasks below the passage.</i> The passage is longer than a letter, has several paragraphs and sometimes <b>small headings</b> (<i># Switzerland</i>) or paragraphs labelled <b>A, B, C, D</b>.</p>
<h3>What does the test look like?</h3>
<table class="tbl">
  <tr><th>Test</th><th>Reading</th><th>Questions</th></tr>
  <tr><td><b>2023, 2024 exams</b></td><td>1 long passage: <i>Recycling around the World</i>, <i>The Moon and its folktales</i></td><td><b>6 questions</b>: 2 True/False, 2 multiple choice A/B/C, 1 written reason, 1 find-the-word</td></tr>
  <tr><td><b>Stemhouse tests 1–10</b></td><td>1 long passage (tests 7, 9: 2 short ones)</td><td><b>8 questions</b>: Q1–3 multiple choice, Q4–6 True/False, Q7 written answer, Q8 find the word</td></tr>
  <tr><td><b>2025, 2026 exams</b></td><td>1 letter / text + 1 gap-fill text</td><td><b>4 questions</b> (True/False, main idea, detail) + <b>4 gaps</b> (5)–(8)</td></tr>
</table>

<h3>6 steps</h3>
<ol class="steps">
  <li><b>Read the questions first</b>. Underline the <b>keywords</b> in each one: names, numbers, and important words like <b>NOT, only, why, THREE</b>.</li>
  <li><b>Skim the whole passage</b> once to see what it is about. Make a quick note of what each paragraph says, e.g. <i>A: Geneva turns off its lights</i>.</li>
  <li>For each question, <b>find the part with the keyword</b>. Names, numbers and capital letters are the easiest to spot.</li>
  <li><b>Read 1–2 sentences</b> around it carefully. That is your <b>evidence</b> — underline it.</li>
  <li><b>Answer from the evidence</b> in the passage, not from what you know about the world.</li>
  <li><b>Check</b>: spelling, number of words, True/False written in full, no blank answers.</li>
</ol>
<div class="tip"><b>Order:</b> detail and True/False questions usually follow <b>the order of the passage</b>. Leave <i>mainly about / best title</i> until <b>last</b>: once you have read everything, the main idea is clearer.</div>
<div class="tip"><b>Time:</b> do not get stuck on one question. If you cannot find it, mark it, move on and come back. Keep the <b>last 2–3 minutes</b> to check spelling.</div>

<h3>The marking is strict</h3>
<p>According to the Stemhouse marking guide, small mistakes cost points:</p>
<table class="tbl">
  <tr><th>Mistake</th><th>Mark</th></tr>
  <tr><td>Writing <s>T</s> / <s>F</s> instead of <b>True</b> / <b>False</b></td><td>minus <b>1 point</b></td></tr>
  <tr><td>A spelling mistake in the word you write</td><td><b>0 points</b></td></tr>
  <tr><td>Find the word: <b>changing the form</b> — <s>priorities</s> instead of <b>priority</b>, <s>collides</s> instead of <b>collide</b></td><td><b>0 points</b> or minus 1</td></tr>
  <tr><td><b>Extra words</b> — <s>a</s> priority, <s>an</s> advantage, <s>is</s> essential</td><td>minus <b>1 point for each extra word</b></td></tr>
  <tr><td>Written answer: different words but the <b>right idea</b></td><td>still correct ✔</td></tr>
  <tr><td>Written answer: grammar / spelling mistake</td><td>minus <b>0.5</b> each</td></tr>
  <tr><td>Missing ideas (<b>THREE</b> things asked, only 2 written)</td><td>only <b>part</b> of the points</td></tr>
</table>
<div class="warn">The safest way: <b>copy the words exactly from the passage</b>. Copying means no spelling mistakes and no wrong word forms. When you finish, count your words and compare with the question.</div>`
  },
  'passage-main': {
    title: 'Main idea, best title, paragraph headline',
    short: 'mainly about, best title, paragraph B',
    body: `
<p>The ways the tests ask for the main idea:</p>
<ul>
  <li><i>The passage is <b>mainly about</b> ______.</i> (2023 exam, Stemhouse test 5)</li>
  <li><i>The <b>best title</b> for the passage might be ______.</i> (2024 exam, Stemhouse tests 3, 8)</li>
  <li><i>The <b>second paragraph</b> is mainly about ______.</i> (2026 exam)</li>
  <li><i>Choose the best <b>headline for paragraph B</b>.</i> (Stemhouse test 10)</li>
</ul>
<div class="formula">
  <div>Main idea = what <b>the whole passage</b> (or <b>the whole paragraph</b> asked about) is about — not bigger, not smaller.</div>
</div>

<h3>How to find it</h3>
<ol class="steps">
  <li>Read the <b>first sentence of the passage</b> (or of the paragraph asked about) carefully — the topic is usually there.</li>
  <li>Skim the first sentences of the other paragraphs: are they all about that topic?</li>
  <li>For each option ask: <b>"Does it cover the whole passage?"</b></li>
  <li>Cross out the trap options (table below) and choose the one left.</li>
</ol>

<h3>3 kinds of trap options</h3>
<table class="tbl">
  <tr><th>Trap</th><th>Example from the tests</th></tr>
  <tr><td><b>Only one part</b> of the passage</td><td>2023 exam: <s>industrial waste in Senegal</s>, <s>Swiss people and recycling</s> — each is only 1 of the 3 countries.</td></tr>
  <tr><td><b>Too general</b></td><td>Stemhouse test 8: <s>Fun Holidays</s>, <s>A Good Trip</s> — the right topic, but they do not say the passage gives <b>tips</b>.</td></tr>
  <tr><td><b>Wrong / not in the passage</b></td><td>2024 exam: <s>Important Scientific Facts about the Moon</s> — the passage tells <b>folktales</b>, not science.</td></tr>
</table>

<h3>Examples</h3>
<div class="ex">
  <div class="ex-cue">2023 exam: <i>New statistics give a view of recycling <b>around the world</b>. Here are <b>three of the countries</b> in the report.</i></div>
  <div class="ex-ans">The passage covers all 3 countries → <mark>a quick view of how nations recycle</mark></div>
</div>
<div class="ex">
  <div class="ex-cue">2026 exam — paragraph 2: <i>People have <b>celebrated</b> the summer solstice for thousands of years. The most famous celebration happens at Stonehenge… thousands of people gather there to watch this magical sunrise.</i></div>
  <div class="ex-ans">The paragraph is about <b>celebrating and watching the sunrise</b> → <mark>the most popular activity on the June solstice</mark> (not <s>the beauty of the ancient stones</s>)</div>
</div>
<div class="ex">
  <div class="ex-cue">Stemhouse test 3: the passage is about 4 skills (the 4Cs) for <i>future success</i>.</div>
  <div class="ex-ans"><mark>Essential skills for a successful life</mark> — not <s>How to become a responsible citizen</s> (a small part) or <s>Skills for bad citizens</s> (wrong).</div>
</div>
<div class="ex">
  <div class="ex-cue">Stemhouse test 10 — headline for <b>paragraph B</b>: lights make animals sleep less, birds cannot navigate, insects and birds hit tall buildings and die.</div>
  <div class="ex-ans">The whole paragraph is about harm to <b>nature</b> → <mark>A threat to nature</mark></div>
</div>
<div class="tip">In paragraph headline questions the other options are often <b>headlines for other paragraphs</b>. Stemhouse test 10: <i>What humans are missing out</i> is paragraph <b>C</b>, <i>Actions that should be taken</i> is paragraph <b>D</b>. Read the right paragraph!</div>`
  },
  'passage-detail': {
    title: 'Detail questions and NOT questions',
    short: 'According to…, Wh-, Which is NOT…',
    body: `
<p>A detail question asks for <b>one specific piece of information</b>. Common forms:</p>
<ul>
  <li><i><b>According to</b> the passage / the first paragraph, …</i></li>
  <li><b>Wh-</b> questions: <i>How many…? Why…? What…?</i></li>
  <li>Complete the sentence: <i>People in Senegal ______.</i> (2023 exam)</li>
  <li><b>NOT</b> questions: <i>Which of the following is <b>NOT</b>…?</i></li>
</ul>

<h3>4 steps</h3>
<ol class="steps">
  <li>Underline the <b>keywords</b> in the question: <i>Senegal, self-driving cars, 26 September 2019</i>…</li>
  <li><b>Find</b> the keyword in the passage and read that sentence and the next one carefully.</li>
  <li>Compare each option with the passage. The right answer often <b>says the same thing in different words</b>.</li>
  <li>Cross out options that use words from the passage but have the <b>wrong meaning</b>.</li>
</ol>

<h3>Answers in different words</h3>
<table class="tbl">
  <tr><th>In the passage</th><th>Answer</th><th>Test</th></tr>
  <tr><td>people don’t throw away any items that they can use for something else</td><td><b>make good use of old products</b></td><td>2023 exam</td></tr>
  <tr><td>guide pupils to choose the best ones for them</td><td>books were <b>suitable</b></td><td>2025 exam</td></tr>
  <tr><td>the sun rises perfectly in line with these ancient stones</td><td><b>observe the positioning of the sun</b></td><td>2026 exam</td></tr>
  <tr><td>these vehicles will help reduce traffic jams and accidents</td><td>They help reduce <b>car accidents and traffic jams</b></td><td>Stemhouse test 4</td></tr>
</table>
<div class="warn"><b>Trap: in the passage but the wrong meaning</b>
  <ul>
    <li>2026 exam: <s>see 4,000 giant circles</s> — 4,000 is the <b>age</b> (<i>4,000-year-old</i>), and there is only one circle.</li>
    <li>Stemhouse test 10: <i>Why was the light turned off?</i> — <s>There was a problem with the electricity</s>: that is what <b>usually</b> happens, <b>but this time</b> the lights went off <b>to allow people to go outside and observe the stars</b>.</li>
  </ul>
</div>

<h3>NOT questions: check and cross out each option</h3>
<p>A <b>NOT</b> question asks for the thing that is <b>not</b> in the passage. Do not look for one sentence — <b>check all 3 options</b> and <b>cross out</b> each one you find in the passage.</p>
<div class="ex">
  <div class="ex-cue">2024 exam: <i>Which of the following tales does <b>NOT</b> include any animals?</i></div>
  <div class="ex-ans">A. <s>The Mexican tale</s> — has a rabbit<br>C. <s>The Native American tale</s> — has a frog and a wolf<br>B. The Hawaiian tale — only a woman and a rainbow bridge → <mark>B</mark></div>
</div>
<div class="ex">
  <div class="ex-cue">Stemhouse test 3: <i>Which of the following is <b>NOT</b> one of the "4Cs"?</i> — A. Communication B. Creativity C. Calculation</div>
  <div class="ex-ans">The passage lists <s>Communication</s>, Collaboration, Critical Thinking, <s>Creativity</s> → <mark>C. Calculation</mark></div>
</div>
<div class="tip"><b>Circle the word NOT</b> when you read the question. Many pupils find one option in the passage and pick it straight away — but in a NOT question that is the <b>wrong</b> answer!</div>`
  },
  'passage-tf': {
    title: 'True / False with long passages',
    short: 'only, all, never; numbers; paraphrase',
    body: `
<p>Each True/False sentence says something about the passage. Find the part about the same thing and compare every detail.</p>
<div class="warn">Always write the <b>full word True / False</b>. Writing <s>T</s> / <s>F</s> loses <b>1 point</b> (Stemhouse marking guide).</div>

<h3>1. Paraphrase: same idea, different words → True</h3>
<table class="tbl">
  <tr><th>Sentence</th><th>In the passage</th><th>Answer</th></tr>
  <tr><td>No other objects are as bright as the Moon in the night sky.</td><td>The Moon is the biggest and <b>brightest</b> object in the night sky.</td><td><b>True</b> (2024 exam)</td></tr>
  <tr><td>In Switzerland people recycle a lot of household items.</td><td>local people only have to <b>throw away a few</b> household items</td><td><b>True</b> (2023 exam)</td></tr>
</table>

<h3>2. Compare the numbers</h3>
<div class="ex">
  <div class="ex-cue">2023 exam: <i>The United States recycled a <b>higher</b> percentage of its paper than that of its cans.</i><br>Passage: <i>it recycled <b>48%</b> of its paper, 40% of its plastic bottles and <b>55%</b> of its cans.</i></div>
  <div class="ex-ans">48% &lt; 55% → paper is <b>lower</b> than cans → <mark>False</mark></div>
</div>
<div class="ex">
  <div class="ex-cue">Stemhouse test 9: <i>Cheetahs can reach speeds of up to <b>80</b> miles per hour.</i> — Passage: <i>up to <b>60 to 70</b> miles per hour</i></div>
  <div class="ex-ans">The number is different → <mark>False</mark></div>
</div>
<div class="tip">When the sentence has a <b>number, percentage or year</b>, find that number in the passage and check <b>what it goes with</b> (paper or cans? children or parents?).</div>

<h3>3. "Absolute" words: only, all, every, never…</h3>
<p>Sentences with <b>only, all, everybody, every, never, always</b> are often <b>False</b>, because the passage says "not only" or "not all". Check carefully:</p>
<table class="tbl">
  <tr><th>Sentence</th><th>The passage says</th><th>Answer</th></tr>
  <tr><td><b>Only</b> children like Baby Three dolls in Vietnam.</td><td>adored by children <b>and adults alike</b></td><td><b>False</b> (Stemhouse test 2)</td></tr>
  <tr><td>the 4Cs are relevant <b>only</b> for students pursuing careers in the arts</td><td>success in <b>any</b> occupation</td><td><b>False</b> (Stemhouse test 3)</td></tr>
  <tr><td><b>Everybody</b> has to renew their passports every ten years.</td><td><b>Children</b> need a new passport every <b>five</b> years</td><td><b>False</b> (Stemhouse test 8)</td></tr>
  <tr><td>Light pollution <b>only</b> causes minor issues for humans…</td><td>we also <b>cannot see</b> the Milky Way</td><td><b>False</b> (Stemhouse test 10)</td></tr>
</table>

<h3>4. Opposites: one word changed</h3>
<ul>
  <li>2026 exam: <i>daytime was <b>longer</b>… south of the equator</i> ↔ passage: the Southern Hemisphere had <i>the <b>shortest</b> day</i> → <b>False</b>.</li>
  <li>2024 exam: <i>an <b>original</b> tale of Japan</i> ↔ passage: <i>the Japanese <b>version</b> of an <b>Indian</b> tale</i> → <b>False</b>.</li>
</ul>

<h3>5. "The passage suggests / implies / indicates…"</h3>
<p>This means "the passage <b>shows</b>…". Find the part about that idea and see what the passage <b>advises</b>.</p>
<div class="ex">
  <div class="ex-cue">Stemhouse test 2: <i>The passage suggests that parents should <b>avoid</b> talking about the environmental impact of toys.</i></div>
  <div class="ex-ans">The tip in the passage: <i><b>Talk about</b> how making too many toys is bad for the Earth</i> — the opposite → <mark>False</mark></div>
</div>
<div class="warn">Changing just <b>one word</b> makes a sentence false: <i>avoid ↔ talk about, longer ↔ shortest, only ↔ and adults</i>. Read every word of the sentence slowly.</div>`
  },
  'passage-infer': {
    title: 'Inference questions',
    short: 'implies, most likely, calculations',
    body: `
<p>Inference questions ask about something the passage does <b>not say directly</b>, but gives <b>clues</b> for.</p>
<ul>
  <li><i>The passage <b>implies / suggests</b> that…</i></li>
  <li><i>What is <b>most likely</b> to happen next?</i></li>
  <li><i><b>You can tell that</b>… because…</i></li>
  <li><i>Why is Jamie daydreaming?</i> — a reason or feeling that is not said.</li>
</ul>

<h3>3 steps</h3>
<ol class="steps">
  <li>Find the <b>clues</b>: what the characters do, say and feel.</li>
  <li>Put the clues together: "If this… then probably…".</li>
  <li>Choose the answer the <b>clues support</b>. Cross out answers that <b>go too far</b> with no evidence.</li>
</ol>

<h3>"The Big Interview" (Stemhouse collection)</h3>
<table class="tbl">
  <tr><th>Question</th><th>Clue</th><th>Answer</th></tr>
  <tr><td>What is most likely to happen next?</td><td>Last line: Ms. Swanson calls <i>"Charles Locke?"</i></td><td><b>Charles will talk to Ms. Swanson.</b></td></tr>
  <tr><td>You can tell that the girl is nervous because ______.</td><td><i>she tore a card into tiny pieces</i></td><td><b>she tears up one of her index cards</b></td></tr>
  <tr><td>The student who gets the job will be working ______.</td><td>the <b>science</b> teacher needs <i>a <b>lab</b> helper</i></td><td><b>in the science lab</b></td></tr>
</table>
<div class="warn">Trap: <i>her face turns red</i>, <i>her palms are sweaty</i> describe <b>Charles</b>, not the girl. Check <b>whose</b> clue it is.</div>

<h3>"A Long Day" (Stemhouse collection)</h3>
<table class="tbl">
  <tr><th>Question</th><th>Clue</th><th>Answer</th></tr>
  <tr><td>Why is Jamie daydreaming?</td><td>Jamie had wanted to go to the festival; she <i>thought about all of the food stalls at the festival</i></td><td><b>She wants to be somewhere else.</b></td></tr>
  <tr><td>What is most likely to happen next?</td><td><i>The customers just kept coming!</i></td><td><b>Jamie will become busy again.</b></td></tr>
  <tr><td>What will Jamie most likely do when she gets home?</td><td>she really wanted to go to the festival</td><td><b>see if the festival is still going on</b></td></tr>
</table>
<div class="tip">Cross out answers that <b>go too far</b>: <s>Jamie will leave and go to the festival</s> — her mom needs her (<i>I need your help</i>), so she will not just leave.</div>

<h3>Inference with a calculation</h3>
<div class="ex">
  <div class="ex-cue">Stemhouse test 8: <i>Children need a new passport <b>every five years</b>…</i><br>Question: <i>Now, Daisy is ten. Her passport was made in <b>2021</b>. Which year is she going to change her new passport?</i></div>
  <div class="ex-ans">Daisy is 10 → a child → every 5 years: 2021 + 5 = <mark>She is going to change her passport in 2026.</mark></div>
</div>

<h3>"The passage implies…" as True/False</h3>
<ul>
  <li>Stemhouse test 10: <i>The writer thinks that it is a pity that people today can’t enjoy the night sky.</i> — passage: <i>we almost <b>never</b> witness one of the <b>greatest sights</b> in the world</i> → a pity → <b>True</b>.</li>
  <li>Stemhouse test 5: <i>people are <b>born with</b> the natural ability to go back to the "resilient zone"</i> — passage: <i>We can <b>learn</b> to find our resilient zone</i> → we learn it, we are not born with it → <b>False</b>.</li>
</ul>`
  },
  'passage-word': {
    title: 'Find the word from its meaning',
    short: 'Write down ONE word which means…',
    body: `
<p>This question is in every test:</p>
<ul>
  <li><i>Write down <b>ONE word</b> that you find in the passage which means "…".</i></li>
  <li><i>Write down <b>two words</b>… / Find <b>TWO words</b> in the passage that mean "…".</i></li>
  <li><i>Write down <b>NO MORE THAN TWO WORDS</b>…</i> — 1 or 2 words are allowed.</li>
</ul>

<h3>5 steps</h3>
<ol class="steps">
  <li>Read the meaning and work out the <b>word type</b> you need (table below).</li>
  <li>Guess the <b>topic</b> of the word and find the <b>part of the passage about it</b>. "a small waterproof bag… when you are travelling" → the part about things to pack.</li>
  <li>Test it: put the meaning in place of the word — does the sentence still make sense?</li>
  <li><b>Copy it exactly</b> — same singular/plural, same <i>-s, -ed, -ing</i> as in the passage.</li>
  <li><b>Count the words</b>: ONE = 1 word, TWO = exactly 2. Do not add <i>a, the, is</i>.</li>
</ol>

<h3>Word type from the meaning</h3>
<table class="tbl">
  <tr><th>The meaning starts with</th><th>Word type</th><th>Examples</th></tr>
  <tr><td><b>to</b> + verb: <i>to exchange…, to hit…, to handle…</i></td><td>verb</td><td>trade, collide, deal with</td></tr>
  <tr><td><b>a / an / the</b> + noun: <i>a thing…, an animal…</i></td><td>noun</td><td>priority, advantage, prey</td></tr>
  <tr><td>adjectives: <i>kind, calm and mild; completely necessary</i></td><td>adjective</td><td>gentle, essential</td></tr>
  <tr><td>V-ing: <i>putting something in a place…</i></td><td><b>-ing</b> form</td><td>displaying</td></tr>
</table>

<h3>Examples from the tests</h3>
<table class="tbl">
  <tr><th>Meaning</th><th>Word</th><th>Test</th></tr>
  <tr><td>an important thing that needs to be done before other things</td><td><b>priority</b></td><td>Stemhouse test 1</td></tr>
  <tr><td>to exchange something you have for something someone else has</td><td><b>trade</b></td><td>Stemhouse test 2</td></tr>
  <tr><td>putting something in a place where people can see it easily</td><td><b>displaying</b></td><td>Stemhouse test 2</td></tr>
  <tr><td>a thing that helps you to be better or more successful than other people</td><td><b>advantage</b></td><td>Stemhouse test 3</td></tr>
  <tr><td>completely necessary and extremely important</td><td><b>essential</b></td><td>Stemhouse test 4</td></tr>
  <tr><td>to handle, manage negative feelings or solve problems (TWO words)</td><td><b>deal with</b></td><td>Stemhouse test 5</td></tr>
  <tr><td>the hard work and effort that somebody puts into an activity</td><td><b>dedication</b></td><td>Stemhouse test 6</td></tr>
  <tr><td>kind, calm and mild</td><td><b>gentle</b></td><td>Stemhouse test 7</td></tr>
  <tr><td>a small waterproof bag… (NO MORE THAN TWO WORDS)</td><td><b>washbag</b> / <b>wash bag</b></td><td>Stemhouse test 8</td></tr>
  <tr><td>an animal that is hunted and killed for food by another animal</td><td><b>prey</b></td><td>Stemhouse test 9</td></tr>
  <tr><td>to hit something or someone by accident</td><td><b>collide</b></td><td>Stemhouse test 10</td></tr>
  <tr><td>get away</td><td><b>escape</b></td><td>2024 exam</td></tr>
  <tr><td>things people use in their home (two words)</td><td><b>household items</b></td><td>2023 exam</td></tr>
  <tr><td>the reason why Sakra did not let the rabbit die (two words only)</td><td><b>its generosity</b></td><td>2024 exam</td></tr>
</table>

<div class="warn"><b>Strict marking</b> (Stemhouse marking guide):
  <ul>
    <li>A spelling mistake → <b>0 points</b>.</li>
    <li>A changed form: <s>priorities</s> (passage: priority), <s>collides</s> (passage: collide) → <b>0 points</b> or minus 1.</li>
    <li>Extra words: <s>a</s> washbag, <s>an</s> advantage, <s>is</s> essential → minus <b>1 point for each extra word</b>.</li>
  </ul>
</div>
<div class="tip">If the question wants <b>two words</b>, write both: the 2024 exam needs <b>its generosity</b> — just <i>generosity</i> is not enough. The word <b>for</b> in <i>saved the rabbit <b>for</b> its generosity</i> means "because of" — a clue for the reason.</div>`
  },
  'passage-open': {
    title: 'Written answer questions',
    short: 'Why…? What…? Copy the key phrase',
    body: `
<p>Here you <b>write the answer yourself</b>. Examples from the tests:</p>
<ul>
  <li><i>Write down the reason why the record in the US is improving quickly.</i> (2023 exam)</li>
  <li><i>According to the passage, what should critical thinkers avoid doing?</i> (Stemhouse test 3)</li>
  <li><i>How can wearable devices with AI help us take care of our health?</i> (Stemhouse test 4)</li>
  <li><i>What <b>THREE</b> things can we do to find our resilient zone? Write NO MORE THAN fifteen words.</i> (Stemhouse test 5)</li>
</ul>

<h3>6 steps</h3>
<ol class="steps">
  <li>Underline the <b>question word</b> (why, what, how) and the <b>keywords</b> (record, critical thinkers, wearable devices).</li>
  <li>Find the <b>key sentence</b> in the passage with those keywords.</li>
  <li>Answer <b>the kind of question</b> asked (table below).</li>
  <li><b>Copy the key phrase</b> from the passage so you make no spelling mistakes.</li>
  <li>Keep it <b>short</b>, within the word limit if there is one (<i>NO MORE THAN fifteen words</i>).</li>
  <li>Give <b>all</b> the ideas asked for: <b>THREE</b> things → 3 ideas.</li>
</ol>

<h3>Match the question</h3>
<table class="tbl">
  <tr><th>Question</th><th>Start your answer with</th></tr>
  <tr><td><b>Why</b>… / the reason why…</td><td><b>Because</b> + reason</td></tr>
  <tr><td>What should … <b>avoid doing</b>?</td><td>They should avoid + <b>V-ing</b></td></tr>
  <tr><td><b>How</b> can … help us?</td><td>They help (us) + verb…</td></tr>
  <tr><td>What <b>THREE</b> things…?</td><td>idea 1, idea 2, <b>and</b> idea 3</td></tr>
  <tr><td>What is the <b>purpose</b> of…?</td><td>They serve as… / They are used to…</td></tr>
  <tr><td><b>Which year</b>…?</td><td>… in + year</td></tr>
</table>

<h3>Examples</h3>
<div class="ex">
  <div class="ex-cue">2023 exam: <i>it has introduced a lot of new projects in recent years <b>and so</b> its record is really improving quickly</i></div>
  <div class="ex-ans">The reason is <b>before "so"</b> → <mark>Because it has introduced a lot of new projects in recent years.</mark></div>
</div>
<div class="ex">
  <div class="ex-cue">Stemhouse test 3: <i>Critical thinking… is about moving beyond <b>blind acceptance</b></i></div>
  <div class="ex-ans"><mark>Critical thinkers should avoid blindly accepting information.</mark></div>
</div>
<div class="ex">
  <div class="ex-cue">Stemhouse test 4: <i>Wearable devices… will help <b>monitor our health</b>, <b>alerting us to any potential issues</b> before they become serious as well as <b>give useful advice</b>.</i></div>
  <div class="ex-ans"><b>3 ideas</b> → <mark>They help monitor our health, alert us to any potential issues before they become serious and give useful advice.</mark></div>
</div>
<div class="ex">
  <div class="ex-cue">Stemhouse test 5: <i>We can try <b>breathing slowly</b>, <b>thinking of good things</b>, or <b>talking to someone we trust</b>.</i></div>
  <div class="ex-ans"><mark>Breathing slowly, thinking of good things, and talking to someone we trust.</mark> (12 words ✔ under 15)</div>
</div>
<div class="ex">
  <div class="ex-cue">Stemhouse test 9: <i>What is the purpose of the unique black spots on a cheetah’s golden fur?</i></div>
  <div class="ex-ans">Passage: <i>which serve as camouflage in tall grass</i> → <mark>They serve as camouflage in tall grass.</mark></div>
</div>
<div class="tip">If the question says <b>Write one way</b> (Stemhouse test 10: <i>how does light pollution harm animals?</i>), one idea is enough, e.g. <i>Animals sleep less because they think it is still daytime.</i></div>
<div class="warn"><b>Marking</b>: different words with the <b>right idea</b> are accepted; each grammar / spelling mistake loses <b>0.5</b>; missing ideas get only <b>part</b> of the points. Copying the key phrase from the passage is the best way to keep your points.</div>`
  },
  'passage-cloze': {
    title: 'Gap fill: choose and write the word',
    short: 'However, where, over; spell it right',
    body: `
<p>There are <b>3 kinds</b> of gap fill in the tests:</p>
<table class="tbl">
  <tr><th>Kind</th><th>Test</th><th>What you do</th></tr>
  <tr><td>Choose 1 of 3 words and <b>write it</b> in the gap</td><td>Stemhouse tests 7, 9 (Task 1)</td><td>Spell it correctly</td></tr>
  <tr><td>Word box</td><td>Stemhouse collection</td><td>Use each word <b>once</b></td></tr>
  <tr><td>Multiple choice A/B/C</td><td>2025, 2026 exams (questions 5–8)</td><td>Choose the letter</td></tr>
</table>

<h3>4 steps</h3>
<ol class="steps">
  <li><b>Read the whole text</b> once to know what it is about.</li>
  <li>Look at the <b>words before and after</b> the gap to see what <b>word type</b> you need (verb, noun, linking word, preposition).</li>
  <li>Find the <b>clue</b> in the sentence (<i>because…, in a large lake, in pairs</i>).</li>
  <li>Try each word and read the whole sentence again.</li>
</ol>

<h3>1. Choose and write (Stemhouse tests 7, 9)</h3>
<table class="tbl">
  <tr><th>Sentence</th><th>Answer</th><th>Why</th></tr>
  <tr><td>if we want to (1)___ global warming and pollution</td><td><b>reduce</b></td><td>make pollution smaller; <i>reuse, recycle</i> are for things</td></tr>
  <tr><td>in isolated places and also in the (2)___</td><td><b>oceans</b></td><td>wind turbines out at sea</td></tr>
  <tr><td>colder countries (3)___ there is not enough sunshine</td><td><b>where</b></td><td>after a <b>place</b> (countries)</td></tr>
  <tr><td>All (4)___ the world</td><td><b>over</b></td><td>fixed phrase <i>all over the world</i></td></tr>
  <tr><td>one must (1)___ effective study habits</td><td><b>develop</b></td><td>build up a habit</td></tr>
  <tr><td>distractions… should be (2)___ during studying</td><td><b>avoided</b></td><td>should be + past participle: <b>keep away from</b> phones and TV</td></tr>
  <tr><td>Engaging with peers (3)___ participating in group discussions</td><td><b>and</b></td><td>two good things, <b>same direction</b></td></tr>
  <tr><td>essential (4)___ achieving personal growth</td><td><b>for</b></td><td><i>essential for</i></td></tr>
</table>
<div class="warn">You must <b>write</b> the word, not circle a letter. Copy every letter: a spelling mistake gets <b>0 points</b> (<s>avoidded</s>, <s>ocean</s> without -s).</div>

<h3>2. Word box (Stemhouse collection)</h3>
<p><i>Jack studies many different (1)___ at school… Jack has seven (2)___ every school day.</i> → <b>subjects</b>, <b>lessons</b>.</p>
<ul>
  <li>Use each word in the box <b>exactly once</b>. <b>Cross out</b> each word when you use it: <s>subjects</s> <s>lessons</s> Maths…</li>
  <li>Do the <b>easy gaps first</b> — the fewer words are left, the easier the hard gaps become.</li>
</ul>

<h3>3. Multiple choice (2025, 2026 exams)</h3>
<p>2025 exam: <b>worried</b> (<i>because they might not be safe</i>), <b>because</b>, <b>boat</b> (<i>in a large lake</i>), <b>daily</b> (<i>from 10 am to 4 pm</i>).<br>
2026 exam: <b>feel</b> (<i>feel like an adventure</i>), <b>lab</b> (<i>lab partner</i>), <b>liquid</b> (mixed with a powder), <b>However</b>.</p>

<h3>Common linking words</h3>
<table class="tbl">
  <tr><th>Linking word</th><th>Meaning</th><th>Example</th></tr>
  <tr><td><b>However,</b></td><td>the <b>opposite</b> of the sentence before</td><td>Khang let out a loud scream… <b>However</b>, Ms. Thao just smiled. (2026 exam)</td></tr>
  <tr><td><b>Therefore,</b></td><td>the <b>result</b> of the sentence before</td><td>It was raining. <b>Therefore</b>, we stayed at home.</td></tr>
  <tr><td><b>Moreover,</b></td><td><b>adds</b> a similar idea</td><td>The park is big. <b>Moreover</b>, it is free.</td></tr>
  <tr><td><b>because</b></td><td>a <b>reason</b></td><td>… visitors each year <b>because</b> people love the animals. (2025 exam)</td></tr>
  <tr><td><b>so</b></td><td>a <b>result</b></td><td>… new projects <b>and so</b> its record is improving. (2023 exam)</td></tr>
  <tr><td><b>although</b></td><td>even though</td><td><b>Although</b> it was cold, we swam.</td></tr>
  <tr><td><b>and</b></td><td>two ideas in the same direction</td><td>Engaging with peers <b>and</b> participating… (Stemhouse test 9)</td></tr>
  <tr><td><b>but</b></td><td>two opposite ideas</td><td>Travelling is fun, <b>but</b> lots of things can go wrong. (Stemhouse test 8)</td></tr>
</table>

<h3>Words for places, times and people</h3>
<table class="tbl">
  <tr><th>Word</th><th>Comes after</th><th>Example</th></tr>
  <tr><td><b>where</b></td><td>a <b>place</b></td><td>colder countries <b>where</b> there is not enough sunshine</td></tr>
  <tr><td><b>when</b></td><td>a <b>time</b></td><td>the moment <b>when</b> the sun rises</td></tr>
  <tr><td><b>who</b></td><td>a <b>person</b></td><td>the best rider <b>who</b> climbs fastest</td></tr>
</table>
<div class="tip">However, Therefore and Moreover come at the <b>start of a sentence</b> with a <b>comma</b> after them: <i>(8)___, Ms. Thao just smiled</i> — a gap at the start of a sentence, before a comma → think of these three words.</div>`
  }
});
