/*
 * English version of the grammar lessons, keyed by lesson id (see lessons.js).
 */
window.LESSONS_EN = {
  method: {
    title: 'How to write sentences from cues',
    short: '6 steps and the mistakes that cost marks',
    body: `
<p>The test says: <i>Write complete sentences with the given cues. You must write <b>NO MORE THAN fifteen words</b> for each sentence.</i></p>
<div class="ex">
  <div class="ex-cue">Katie / teacher / English / nice / kind //</div>
  <div class="ex-ans">→ Katie<mark>'s</mark> teacher <mark>of</mark> English <mark>is very</mark> nice <mark>and</mark> kind.</div>
</div>
<p>The highlighted words are the ones <b>you must add</b>. The examiner checks that you add the right small words and use the right verb forms.</p>

<h3>6 steps</h3>
<ol class="steps">
  <li><b>Read all the cues</b>. Find the subject (who/what) and the main verb.</li>
  <li><b>Look for time words</b> to choose the tense (see the table below).</li>
  <li><b>Change the verb</b> to match the subject: add -s/-es, use is/are, was/were, did…</li>
  <li><b>Add the missing grammar words</b>: articles (a/an/the), prepositions (in/at/on/to/for), auxiliaries (<i>be</i>, do/does, have), <i>to</i>, conjunctions (<i>and</i>, but…), and a possessive when grammar needs one (wash <b>their</b> hands).</li>
  <li><b>Keep the order of the cues</b>. Do not leave out any cue and do not change the meaning.</li>
  <li><b>Check</b>: capital letter at the start, a full stop (.) or question mark (?) at the end, 15 words or fewer.</li>
</ol>

<div class="warn"><b>Marking rules: add small grammar words only, never new information</b>
  <p><b>Hard rules</b> (break one and the whole sentence is wrong):</p>
  <ul>
    <li><b>15 words or fewer</b>, counting articles, prepositions and linking words.</li>
    <li><b>Keep every cue word</b> — you may change the tense, the word form or make it plural, but never leave a cue out.</li>
    <li><b>Do not invent time or frequency words</b> the cues do not give: <i>yesterday, every day, usually, often, always, now…</i> Without <i>now, at the moment, Look!</i> do not use the present continuous either.</li>
  </ul>
  <p><b>You may freely add:</b></p>
  <ul>
    <li>Grammar words: articles (a/an/the), prepositions (in/on/at/of/to/for…), conjunctions (and/but/because/so…), auxiliaries (do/does/did, am/is/are, was/were, will, have/has), <i>to</i> + verb.</li>
    <li>Object pronouns when the verb needs an object: if you need <b>it</b>, give <b>them</b> to poor children.</li>
    <li>Possessives before a bare noun, especially family and body parts: <b>my</b> sister, wash <b>their</b> hands, on <b>my</b> last birthday.</li>
    <li><b>very</b> with an adjective, as in the test example: Katie's teacher of English is <b>very</b> nice and kind.</li>
  </ul>
  <ul>
    <li>She / visit / grandparents / twice / month → <s>She usually visits her grandparents twice a month.</s> → She visits her grandparents twice a month.</li>
    <li>Nam / not go / school / because / he / be / sick → <s>Nam did not go to school yesterday because…</s> → Nam does not go to school because he is sick.</li>
    <li>We / collect / old books… → <s>We are collecting old books…</s> → We <b>collect</b> old books…</li>
  </ul>
</div>

<h3>Time words → tense</h3>
<table class="tbl">
  <tr><th>If the cues have…</th><th>Use</th><th>Example from the tests</th></tr>
  <tr><td>every day, often, usually, twice a month, facts</td><td>Present simple</td><td>She <b>visits</b> her grandparents twice a month.</td></tr>
  <tr><td>now, at the moment</td><td>Present continuous</td><td>My grandfather <b>is watering</b> the flowers at the moment.</td></tr>
  <tr><td>yesterday, last…, this morning, when I was small</td><td>Past simple</td><td>They <b>watched</b> an interesting film on TV last night.</td></tr>
  <tr><td>tomorrow, next…, if…</td><td>Future (will)</td><td>If it rains tomorrow, we <b>will stay</b> at home.</td></tr>
  <tr><td>ever, the first time</td><td>Present perfect</td><td><b>Have</b> you ever <b>been</b> to Phu Quoc?</td></tr>
  <tr><td>than / the …est / as … as</td><td>Comparison</td><td>This book is <b>more interesting than</b> that one.</td></tr>
</table>

<div class="warn"><b>Common mistakes</b>
  <ul>
    <li>Forgetting <b>-s/-es</b> after a singular subject: <s>She visit</s> → She visit<b>s</b>.</li>
    <li>Forgetting <b>be</b> before an adjective: <s>Mai not as tall as</s> → Mai <b>is</b> not as tall as.</li>
    <li>Forgetting <b>a/an/the</b>: <s>keep small dog</s> → keep <b>a</b> small dog.</li>
    <li>Forgetting the <b>possessive</b>: <s>wash hands</s> → wash <b>their</b> hands.</li>
    <li>Forgetting the <b>preposition</b>: <s>late school</s> → late <b>for</b> school.</li>
    <li>No capital letter at the start, no full stop / question mark at the end.</li>
  </ul>
</div>
<div class="tip">A sentence can have <b>a few correct versions</b> (another preposition or article, a synonym…), but always <b>follow the order of the cues</b>, use all the cues and <b>add no new information</b> (time, frequency…).</div>`
  },
  'present-simple': {
    title: 'Present simple',
    short: 'Habits and facts; -s/-es; do/does',
    body: `
<p>Use it for <b>habits</b>, things that <b>happen again and again</b>, and <b>facts</b>.</p>
<div class="formula">
  <div><span class="tag">+</span> S + V(s/es)</div>
  <div><span class="tag">−</span> S + do/does + not + V</div>
  <div><span class="tag">?</span> Do/Does + S + V?</div>
</div>
<p><b>I / you / we / they</b> / plural nouns → V (no change), use <b>do</b>.<br>
<b>he / she / it</b> / singular nouns (Nam, my father, the Earth, nobody) → V<b>-s/-es</b>, use <b>does</b>.</p>

<h3>Adding -s/-es</h3>
<table class="tbl">
  <tr><th>Verb ends in</th><th>Add</th><th>Examples</th></tr>
  <tr><td>-o, -s, -sh, -ch, -x, -z</td><td>-es</td><td>go → go<b>es</b>, brush → brush<b>es</b>, watch → watch<b>es</b></td></tr>
  <tr><td>consonant + y</td><td>y → -ies</td><td>study → stud<b>ies</b></td></tr>
  <tr><td>anything else</td><td>-s</td><td>visit<b>s</b>, cook<b>s</b>, like<b>s</b></td></tr>
  <tr><td>have</td><td colspan="2">→ <b>has</b> (My school <b>has</b> a big library.)</td></tr>
</table>

<h3>Signal words</h3>
<p>every day / every morning, once / twice / three times a day/week/month, always, usually, often, sometimes, never, in the evening, facts (The Earth goes around the Sun).</p>
<div class="tip"><b>Where frequency adverbs go</b>: <b>before a normal verb</b>, <b>after be</b>.<br>
He <b>often</b> helps his mother. — Lan <b>usually</b> does her homework. — She is <b>always</b> late.</div>

<h3>Examples from the tests</h3>
<ul class="exlist">
  <li>She / brush / teeth / twice / day → She <b>brushes</b> her teeth twice a day.</li>
  <li>My father / not drink / coffee / every morning → My father <b>does not drink</b> coffee every morning.</li>
  <li>The Earth / go / around / Sun → The Earth <b>goes</b> around the Sun.</li>
</ul>
<div class="warn"><b>Common mistakes</b>
  <ul>
    <li><s>My father not drinks coffee.</s> → you need <b>does not</b>.</li>
    <li><s>He doesn't drinks.</s> → after does/doesn't use the base verb: doesn't <b>drink</b>.</li>
    <li><s>How much does this schoolbag costs?</s> → does … <b>cost</b>.</li>
  </ul>
</div>`
  },
  'present-continuous': {
    title: 'Present continuous',
    short: 'Happening now: am/is/are + V-ing',
    body: `
<p>Use it for things <b>happening right now</b>, and for <b>fixed plans</b> in the near future.</p>
<div class="formula">
  <div><span class="tag">+</span> S + am/is/are + V-ing</div>
  <div><span class="tag">−</span> S + am/is/are + not + V-ing</div>
  <div><span class="tag">?</span> Am/Is/Are + S + V-ing?</div>
</div>
<p>I → <b>am</b> · he/she/it/singular → <b>is</b> · you/we/they/plural → <b>are</b></p>

<h3>Signal words</h3>
<p><b>now</b>, <b>right now</b>, <b>at the moment</b>, Look!, Listen!</p>

<h3>Adding -ing</h3>
<table class="tbl">
  <tr><th>Rule</th><th>Examples</th></tr>
  <tr><td>Add -ing</td><td>water → water<b>ing</b>, play → play<b>ing</b>, build → build<b>ing</b></td></tr>
  <tr><td>Ends in -e: drop the e</td><td>make → mak<b>ing</b>, come → com<b>ing</b></td></tr>
  <tr><td>1 vowel + 1 consonant (one syllable): double it</td><td>swim → swim<b>ming</b>, run → run<b>ning</b></td></tr>
  <tr><td>-ie → -ying</td><td>lie → l<b>ying</b></td></tr>
</table>

<h3>Examples from the tests</h3>
<ul class="exlist">
  <li>My grandfather / water / flowers / moment → My grandfather <b>is watering</b> the flowers at the moment.</li>
  <li>They / build / new bridge / my town / now → They <b>are building</b> a new bridge in my town now.</li>
  <li>My class / go / camping / next Sunday → My class <b>is going</b> camping next Sunday. <i>(future plan)</i></li>
</ul>
<div class="warn"><b>Common mistake</b>: forgetting <b>be</b> — <s>My grandfather watering</s> → My grandfather <b>is</b> watering.</div>`
  },
  'past-simple': {
    title: 'Past simple',
    short: 'yesterday, last…; -ed and irregular verbs',
    body: `
<p>Use it for actions that <b>happened and finished</b> in the past.</p>
<div class="formula">
  <div><span class="tag">be</span> I/he/she/it + <b>was</b> · you/we/they + <b>were</b></div>
  <div><span class="tag">+</span> S + V-ed / V2</div>
  <div><span class="tag">−</span> S + did not + V</div>
  <div><span class="tag">?</span> Did + S + V? · Wh- + did + S + V?</div>
</div>

<h3>Signal words</h3>
<p><b>yesterday</b>, <b>last</b> night/week/summer/weekend, this morning (when it is over), … <b>ago</b>, <b>when we were small</b>.</p>

<h3>Adding -ed</h3>
<p>visit → visit<b>ed</b> · live → liv<b>ed</b> · stop → stop<b>ped</b> · study → stud<b>ied</b> · play → play<b>ed</b></p>

<h3>Irregular verbs in the tests</h3>
<table class="tbl irr">
  <tr><th>V1</th><th>V2 (past)</th><th>V3 (participle)</th></tr>
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

<h3>Examples from the tests</h3>
<ul class="exlist">
  <li>Yesterday / sister / I / go / mall / and / buy / new clothes → Yesterday my sister and I <b>went</b> to the mall and <b>bought</b> new clothes.</li>
  <li>Nam / not go / school / yesterday / because / he / be / sick → Nam <b>did not go</b> to school yesterday because he <b>was</b> sick.</li>
  <li>What / you / do / last weekend? → What <b>did</b> you <b>do</b> last weekend?</li>
</ul>
<div class="warn"><b>Common mistakes</b>: <s>did not went</s>, <s>What did you did</s> — after <b>did</b> always use the base verb.</div>`
  },
  'past-continuous': {
    title: 'Past continuous',
    short: 'was/were + V-ing … when + past simple',
    body: `
<p>Use it for an action that was <b>in progress</b> at a time in the past, often <b>interrupted</b> by another action.</p>
<div class="formula">
  <div>S + <b>was/were + V-ing</b> + <b>when</b> + S + V2 (past simple)</div>
</div>
<div class="diagram">
  <div class="bar">━━━━━━━ cleaning the classroom (were cleaning) ━━━━━━━</div>
  <div class="hit">⬆ the teacher came in (came)</div>
</div>
<h3>Example from the tests</h3>
<ul class="exlist">
  <li>The students / clean / classroom / when / teacher / come → The students <b>were cleaning</b> the classroom when the teacher <b>came</b>.</li>
</ul>
<div class="tip">The <b>long</b> action in progress → past continuous. The <b>short</b> action that interrupts → past simple.</div>`
  },
  'present-perfect': {
    title: 'Present perfect',
    short: 'have/has + V3: ever, the first time',
    body: `
<div class="formula">
  <div><span class="tag">+</span> S + have/has + V3</div>
  <div><span class="tag">?</span> Have/Has + S + (ever) + V3?</div>
</div>
<p>I/you/we/they → <b>have</b> · he/she/it → <b>has</b>. V3 is the third column (visited, been, seen…).</p>
<h3>Two patterns in the tests</h3>
<table class="tbl">
  <tr><th>Pattern</th><th>Meaning</th><th>Example</th></tr>
  <tr><td>Have you <b>ever</b> + V3?</td><td>at any time in your life</td><td>Have you ever <b>been to</b> Phu Quoc?</td></tr>
  <tr><td>This is <b>the first time</b> + S + have/has + V3</td><td>never before now</td><td>This is the first time I <b>have visited</b> Ha Noi.</td></tr>
</table>
<div class="tip"><b>have been to</b> + place = have visited (and come back).</div>`
  },
  future: {
    title: 'Future & first conditional',
    short: 'will + V; If + present simple, will + V',
    body: `
<div class="formula">
  <div><span class="tag">will</span> S + will + V (base form)</div>
  <div><span class="tag">if</span> If + S + V (present simple), S + will + V</div>
</div>
<p>Use <b>will</b> for things that will happen, plans and dreams: My dream house <b>will have</b> a swimming pool and a big garden.</p>
<h3>First conditional</h3>
<p>For things that <b>may happen</b> in the future. The <b>If-clause uses the present simple</b> (not will); the other clause uses <b>will</b>.</p>
<div class="ex"><div class="ex-cue">If / it / rain / tomorrow / we / stay / home</div>
<div class="ex-ans">→ If it <mark>rains</mark> tomorrow, we <mark>will stay</mark> at home.</div></div>
<div class="tip">Fixed plans can use the <b>present continuous</b>: My class <b>is going</b> camping next Sunday.</div>
<div class="warn"><b>Common mistakes</b>: <s>will has</s> → will <b>have</b>; <s>If it will rain</s> → If it <b>rains</b>.</div>`
  },
  modals: {
    title: 'Modal verbs & imperatives',
    short: 'should, must, could + V; Remember…, Don\'t…',
    body: `
<div class="formula">
  <div>S + <b>should / must / can / could</b> + V (base form)</div>
  <div>S + should <b>not</b> + V (shouldn't)</div>
</div>
<table class="tbl">
  <tr><th>Word</th><th>Meaning</th><th>Example from the tests</th></tr>
  <tr><td>should</td><td>advice</td><td>Children <b>should wash</b> their hands before meals.</td></tr>
  <tr><td>should not</td><td>advice not to</td><td>We <b>should not throw</b> rubbish in the street.</td></tr>
  <tr><td>must</td><td>a rule</td><td>Students <b>must wear</b> uniforms at school.</td></tr>
  <tr><td>Could you…?</td><td>polite request</td><td><b>Could you show</b> me the way to the post office?</td></tr>
</table>
<div class="warn"><b>Three common mistakes</b>
  <ul>
    <li><s>should to wash</s>, <s>must wears</s> → after a modal use the <b>base verb</b>.</li>
    <li><s>We not should throw</s> → <b>not goes after</b> the modal: should not.</li>
    <li>The cues may write "not should" on purpose to test you — correct it.</li>
  </ul>
</div>
<h3>Imperatives</h3>
<div class="formula">
  <div><span class="tag">+</span> V + … (Remember to…, Turn off…)</div>
  <div><span class="tag">−</span> Don't + V + …</div>
</div>
<ul class="exlist">
  <li>Remember / turn off / lights / before / go out → <b>Remember to turn off</b> the lights before going out.</li>
  <li>Don't / make / noise / library → <b>Don't make</b> noise in the library.</li>
</ul>`
  },
  'there-be': {
    title: 'There is / There are, much / many',
    short: 'Saying what exists; How many / How much',
    body: `
<table class="tbl">
  <tr><th>Pattern</th><th>Used with</th><th>Example</th></tr>
  <tr><td>There <b>is</b></td><td>singular / uncountable nouns</td><td>There is not much <b>milk</b> in the fridge.</td></tr>
  <tr><td>There <b>are</b></td><td>plural nouns</td><td>There are many tall <b>trees</b> in front of my house.</td></tr>
</table>
<h3>much / many</h3>
<p><b>many</b> + plural countable nouns (trees, students) · <b>much</b> + uncountable nouns (milk, water, time, money).</p>
<div class="tip">Common <b>uncountable</b> nouns: milk, water, coffee, rubbish, homework, money, time, news, noise. No "a", no "-s".</div>
<h3>Questions</h3>
<div class="formula">
  <div><b>How many</b> + plural N + are there + …?</div>
  <div><b>How much</b> + uncountable N + is there + …?</div>
  <div>Price: <b>How much</b> + does/do + S + cost?</div>
</div>
<ul class="exlist">
  <li>How many / student / there / your class? → How many <b>students are there</b> in your class?</li>
  <li>How much / this schoolbag / cost? → How much <b>does</b> this schoolbag <b>cost</b>?</li>
</ul>`
  },
  comparison: {
    title: 'Comparatives, superlatives, as … as',
    short: '-er / more, the -est / the most, as … as',
    body: `
<h3>1. Comparatives (with <i>than</i>)</h3>
<div class="formula">
  <div>Short adjectives: S + be + <b>adj-er</b> + than …</div>
  <div>Long adjectives: S + be + <b>more</b> + adj + than …</div>
</div>
<h3>2. Superlatives (in the world / in my class / of all)</h3>
<div class="formula">
  <div>Short adjectives: S + be + <b>the adj-est</b> + N + in …</div>
  <div>Long adjectives: S + be + <b>the most</b> + adj + N + in …</div>
  <div><b>one of the</b> + superlative + <b>plural N</b></div>
</div>
<h3>3. Equal comparison</h3>
<div class="formula"><div>S + be + (not) <b>as + adj + as</b> … · S + V + <b>as + adv + as</b> …</div></div>

<h3>Spelling rules</h3>
<table class="tbl">
  <tr><th>Adjective</th><th>Comparative</th><th>Superlative</th><th>Remember</th></tr>
  <tr><td>tall, high</td><td>taller, higher</td><td>the tallest, the highest</td><td>add -er / -est</td></tr>
  <tr><td>hot, big</td><td>hotter, bigger</td><td>the hottest, the biggest</td><td>double the last consonant</td></tr>
  <tr><td>nice, large</td><td>nicer</td><td>the nicest</td><td>ends in e: add -r/-st</td></tr>
  <tr><td>happy, easy</td><td>happier</td><td>the happiest</td><td>y → i</td></tr>
  <tr><td>interesting, beautiful</td><td>more …</td><td>the most …</td><td>long adjectives</td></tr>
  <tr><td><b>good / well</b></td><td><b>better</b></td><td><b>the best</b></td><td>irregular</td></tr>
  <tr><td><b>bad</b></td><td><b>worse</b></td><td><b>the worst</b></td><td>irregular</td></tr>
</table>
<h3>Comparing adverbs (describing verbs)</h3>
<p>sing beautifully → sings <b>more beautifully than</b> · cook well → cooks <b>better than</b> · sing well → sings <b>as well as</b></p>

<h3>Examples from the tests</h3>
<ul class="exlist">
  <li>The weather today is <b>hotter than</b> yesterday.</li>
  <li>My brother is <b>the tallest</b> student in his class.</li>
  <li>Da Nang is <b>one of the most beautiful cities</b> in Vietnam.</li>
  <li>Mai is <b>not as tall as</b> her brother.</li>
  <li>My mother cooks <b>better than</b> I do.</li>
</ul>
<div class="warn"><b>Common mistakes</b>: <s>more hot</s>, <s>interestinger</s>, <s>more well</s>, <s>one of the best singer</s> (missing plural -s).</div>`
  },
  'verb-patterns': {
    title: 'to V, V-ing or base verb?',
    short: 'want to, like doing, let sb do, good at doing…',
    body: `
<p>When two verbs come together, the second one needs the right form. This is where students <b>lose the most marks</b>.</p>
<table class="tbl">
  <tr><th>Form</th><th>After</th><th>Examples from the tests</th></tr>
  <tr><td><b>to V</b></td><td>want, remember (to do a task), hope, decide, learn</td><td>My sister wants <b>to become</b> a doctor.<br>Remember <b>to turn off</b> the lights.</td></tr>
  <tr><td><b>to V</b> (purpose = in order to)</td><td>after an action</td><td>We collect old books <b>to give</b> to poor children.</td></tr>
  <tr><td><b>V-ing</b></td><td>like, love, enjoy, finish, spend + time</td><td>Hoa likes <b>reading</b> comic books.<br>Tom spends two hours <b>doing</b> his homework.</td></tr>
  <tr><td><b>V-ing</b> after prepositions</td><td>before, after, at, about, good at, look forward to</td><td>before <b>going</b> out · good at <b>playing</b> chess<br>I am looking forward to <b>seeing</b> you.</td></tr>
  <tr><td><b>go + V-ing</b></td><td>free-time activities</td><td>go <b>camping</b>, go <b>swimming</b></td></tr>
  <tr><td><b>base verb</b></td><td>let / make / help + someone</td><td>My parents let me <b>keep</b> a small dog.<br>He helps his mother <b>wash</b> the dishes.</td></tr>
  <tr><td><b>base verb</b></td><td>should, must, can, will, do/does/did</td><td>should <b>plant</b>, did not <b>go</b></td></tr>
</table>
<h3>Special patterns</h3>
<div class="formula">
  <div><b>It takes</b> + someone + time + <b>to V</b> — It takes me 15 minutes to walk to school.</div>
  <div><b>used to</b> + V — My father used to work as a farmer.</div>
  <div><b>spend</b> + time + <b>V-ing</b> — Tom spends two hours doing his homework.</div>
</div>
<div class="warn"><b>The "to" trap</b>: in <i>look forward <b>to</b></i>, "to" is a preposition, so use V-ing: <s>look forward to see</s> → look forward to <b>seeing</b>.</div>`
  },
  passive: {
    title: 'The passive',
    short: 'be + V3: is sold, is spoken',
    body: `
<p>Use it when the subject <b>does not do</b> the action but <b>receives</b> it.</p>
<div class="formula">
  <div>Present: S + <b>am/is/are + V3</b></div>
  <div>Past: S + <b>was/were + V3</b></div>
</div>
<div class="tip"><b>How to spot it</b>: ask "can the subject do this by itself?". Milk tea cannot <i>sell</i> → milk tea <b>is sold</b>.</div>
<h3>Examples from the tests</h3>
<ul class="exlist">
  <li>Milk tea / sell / at / school canteen → Milk tea <b>is sold</b> at the school canteen.</li>
  <li>English / speak / many countries / around / world → English <b>is spoken</b> in many countries around the world.</li>
</ul>
<p>V3 of irregular verbs: sell → <b>sold</b>, speak → <b>spoken</b>, make → <b>made</b>, write → <b>written</b>, build → <b>built</b>.</p>`
  },
  'articles-possessives': {
    title: 'Articles a/an/the & possessives',
    short: 'When to add a, an, the, my, his, her, their',
    body: `
<h3>a / an</h3>
<p>Before a <b>singular countable noun</b> that is not specific. <b>an</b> before a vowel sound (a, e, i, o, u): <b>an</b> interesting film, <b>an</b> apple; <b>a</b> small dog, <b>a</b> doctor, <b>a</b> new bicycle.</p>
<h3>the</h3>
<ul>
  <li>Things there is <b>only one</b> of: the Sun, the Earth, the world.</li>
  <li><b>Specific</b> things the listener knows: the lights, the fridge, the library, the post office.</li>
  <li>Before <b>superlatives</b>: the tallest, the most beautiful.</li>
  <li>Fixed phrases: at the moment, in the future, in the evening, watch the news, wash the dishes.</li>
</ul>
<h3>No article</h3>
<ul>
  <li>Meals: after <b>dinner</b>, before <b>meals</b>.</li>
  <li>School subjects, sports and games: math, English, play <b>football</b>, play <b>chess</b>.</li>
  <li>Transport with by: by <b>car</b>.</li>
  <li>go to <b>school</b>, late for <b>school</b>, at <b>school</b>, at <b>home</b>.</li>
  <li>Uncountable nouns in general: coffee, rubbish, milk.</li>
</ul>
<h3>Possessive adjectives</h3>
<table class="tbl">
  <tr><th>Subject</th><td>I</td><td>you</td><td>he</td><td>she</td><td>it</td><td>we</td><td>they</td></tr>
  <tr><th>Possessive</th><td>my</td><td>your</td><td>his</td><td>her</td><td>its</td><td>our</td><td>their</td></tr>
</table>
<div class="tip">Body parts, belongings, family and homework <b>of someone</b> need that person's possessive:<br>
Children wash <b>their</b> hands · She brushes <b>her</b> teeth · He does <b>his</b> homework · He helps <b>his</b> mother.</div>`
  },
  prepositions: {
    title: 'Prepositions in / on / at / for / to',
    short: 'Preposition phrases that appear in the tests',
    body: `
<h3>Time</h3>
<table class="tbl">
  <tr><th>Preposition</th><th>Used with</th><th>Examples</th></tr>
  <tr><td>at</td><td>clock times, points in time</td><td>at 7 o'clock, <b>at the moment</b>, at night</td></tr>
  <tr><td>on</td><td>days, dates, special days</td><td>on Sunday, <b>on my last birthday</b></td></tr>
  <tr><td>in</td><td>parts of the day, months, years, long periods</td><td><b>in the evening</b>, in May, <b>in the future</b>, <b>in her free time</b></td></tr>
  <tr><td>for</td><td>how long</td><td><b>for three hours</b></td></tr>
  <tr><td>(none)</td><td>next, last, every, this, yesterday, tomorrow</td><td>next Sunday, last night, every day</td></tr>
</table>
<h3>Place</h3>
<table class="tbl">
  <tr><th>Preposition</th><th>Examples from the tests</th></tr>
  <tr><td>in</td><td>in the fridge, in my town, in the world, in his class, in my village, in the library, in the back yard, in the street</td></tr>
  <tr><td>at</td><td>at school, at home, at the school canteen</td></tr>
  <tr><td>in front of</td><td>in front of my house</td></tr>
  <tr><td>to</td><td>go to the mall, go to school, walk to school, the way to the post office, have been to Phu Quoc</td></tr>
  <tr><td>around</td><td>go around the Sun, around the world</td></tr>
</table>
<h3>Fixed phrases to learn</h3>
<div class="chips">
  <span>late <b>for</b></span><span>good <b>at</b></span><span>bad <b>at</b></span><span>excited <b>about</b></span>
  <span>look forward <b>to</b></span><span>work <b>as</b></span><span><b>by</b> car</span><span><b>on</b> TV</span>
  <span>give … <b>to</b></span><span>show … the way <b>to</b></span><span>twice <b>a</b> day</span>
</div>`
  },
  questions: {
    title: 'Yes/No and Wh- questions',
    short: 'Put the helping verb first: Why were…, What did…',
    body: `
<p>In a question the <b>helping verb</b> (be, do/does/did, have, could…) comes <b>before the subject</b>. End with a <b>?</b></p>
<div class="formula">
  <div>With be: (Wh-) + <b>am/is/are/was/were</b> + S + …?</div>
  <div>Normal verbs: (Wh-) + <b>do/does/did</b> + S + base verb …?</div>
  <div>Present perfect: (Wh-) + <b>have/has</b> + S + V3 …?</div>
  <div>Modals: (Wh-) + <b>could/can/should</b> + S + V …?</div>
</div>
<h3>Question words</h3>
<table class="tbl">
  <tr><th>Word</th><th>Asks about</th><th>Examples from the tests</th></tr>
  <tr><td>What</td><td>things</td><td>What <b>did</b> you do last weekend? · What <b>is</b> your favorite subject at school?</td></tr>
  <tr><td>Why</td><td>reasons</td><td>Why <b>were</b> you late for school this morning?</td></tr>
  <tr><td>How often</td><td>frequency</td><td>How often <b>do</b> you go swimming?</td></tr>
  <tr><td>How many</td><td>number (countable)</td><td>How many students <b>are</b> there in your class?</td></tr>
  <tr><td>How much</td><td>amount (uncountable) / price</td><td>How much <b>does</b> this schoolbag cost?</td></tr>
  <tr><td>(Yes/No)</td><td>yes or no</td><td><b>Have</b> you ever been to Phu Quoc? · <b>Could</b> you show me …?</td></tr>
</table>
<div class="warn"><b>Common mistakes</b>: <s>Why you were late?</s> (no inversion) · <s>What you did?</s> (missing did) · <s>How often you go?</s> (missing do).</div>`
  },
  conjunctions: {
    title: 'Linking words: and, but, because, so…that, when, if',
    short: 'Joining words and clauses',
    body: `
<table class="tbl">
  <tr><th>Word</th><th>Meaning</th><th>Examples from the tests</th></tr>
  <tr><td>and</td><td>adds</td><td>My school has a big library <b>and</b> a modern gym.</td></tr>
  <tr><td>but</td><td>contrast</td><td>Hoang is good at math <b>but</b> bad at English.</td></tr>
  <tr><td>because</td><td>reason</td><td>Nam did not go to school yesterday <b>because</b> he was sick.</td></tr>
  <tr><td>so + adj + that</td><td>result</td><td>The film was <b>so boring that</b> we left early.</td></tr>
  <tr><td>when</td><td>time</td><td>My grandmother told us stories <b>when</b> we were small.</td></tr>
  <tr><td>if</td><td>condition</td><td><b>If</b> it rains tomorrow, we will stay at home.</td></tr>
  <tr><td>before / after</td><td>order</td><td>… <b>before</b> going out · <b>After</b> finishing dinner, …</td></tr>
</table>
<div class="tip"><b>Same tense</b>: when <i>and</i> joins two actions, both verbs use the same tense — went … <b>and</b> bought.</div>
<div class="tip"><b>Commas</b>: when an <i>If / After / When</i> clause comes first, put a comma before the second part.<br>If it rains tomorrow<b>,</b> we will stay at home.</div>
<div class="warn">The cues may <b>not include</b> the linking word — you must add it: My dream house / have / swimming pool / big garden → … a swimming pool <b>and</b> a big garden.</div>`
  },
  'word-forms': {
    title: 'Word forms',
    short: 'decide → decision, usual → usually, danger → dangerous',
    body: `
<p>The cues often give a word in its <b>base form</b>. Look at <b>where it goes in the sentence</b>, then change it to the right <b>word class</b>: noun, adjective or adverb. The 2026 exam has three of these.</p>
<table class="tbl">
  <tr><th>Cue</th><th>In the sentence</th><th>Test</th></tr>
  <tr><td>quick / <b>decide</b></td><td>make a quick <b>decision</b></td><td>Exam 2026 (example)</td></tr>
  <tr><td>save / <b>electric</b></td><td>to save <b>electricity</b></td><td>Exam 2026</td></tr>
  <tr><td><b>usual</b> / go / jog</td><td>Lan <b>usually</b> went jogging</td><td>Exam 2026</td></tr>
  <tr><td><b>Lucky</b> / enough</td><td><b>Luckily</b> enough, no-one was injured</td><td>Exam 2024</td></tr>
  <tr><td>act / <b>kind</b></td><td>acts <b>kindly</b> to the students</td><td>Exam 2024 (example)</td></tr>
  <tr><td>be / <b>danger</b></td><td>it's <b>dangerous</b> for children</td><td>Stemhouse test 10</td></tr>
  <tr><td>speak / <b>fluent</b> / <b>clear</b></td><td>speaking English <b>fluently</b> and <b>clearly</b></td><td>Stemhouse test 2</td></tr>
  <tr><td>play / <b>very good</b></td><td>plays badminton <b>very well</b></td><td>Stemhouse test 8</td></tr>
  <tr><td><b>Vietnam</b> / people</td><td><b>Vietnamese</b> people</td><td>Stemhouse test 6</td></tr>
</table>

<h3>Step 1: which word class does the slot need?</h3>
<table class="tbl">
  <tr><th>Place in the sentence</th><th>Needs</th><th>Example</th></tr>
  <tr><td>after <b>a / an / the / my…</b>, after an adjective, after a verb (as its object)</td><td><b>noun</b></td><td>a quick <b>decision</b> · save <b>electricity</b></td></tr>
  <tr><td>after <b>be / feel / look / become</b>, or before a noun</td><td><b>adjective</b></td><td>it is <b>dangerous</b> · <b>Vietnamese</b> people</td></tr>
  <tr><td>describing a <b>verb</b> (how?)</td><td><b>adverb</b></td><td>acts <b>kindly</b> · speaks <b>fluently</b></td></tr>
  <tr><td>before a main verb, saying how often</td><td><b>adverb</b></td><td>Lan <b>usually</b> went…</td></tr>
  <tr><td>at the start, commenting on the whole sentence</td><td><b>adverb</b></td><td><b>Luckily</b>, … · <b>Sadly</b>, …</td></tr>
</table>

<h3>Step 2: add the ending</h3>
<div class="formula">
  <div><span class="tag">Noun</span> -tion / -sion: decide → deci<b>sion</b>, invite → invita<b>tion</b>, pollute → pollu<b>tion</b></div>
  <div><span class="tag">Noun</span> -ity: electric → electric<b>ity</b>, able → abil<b>ity</b> · -ment: develop → develop<b>ment</b> · -ness: kind → kind<b>ness</b>, happy → happi<b>ness</b></div>
  <div><span class="tag">Adjective</span> -ous: danger → danger<b>ous</b> · -ful: care → care<b>ful</b>, beauty → beauti<b>ful</b> · -y: sun → sun<b>ny</b>, rain → rain<b>y</b></div>
  <div><span class="tag">Adjective</span> nationality: Vietnam → Vietnam<b>ese</b>, Japan → Japan<b>ese</b>, Italy → Ital<b>ian</b>, England → <b>English</b></div>
  <div><span class="tag">Adverb</span> adjective + <b>-ly</b>: quick → quick<b>ly</b>, kind → kind<b>ly</b>, usual → usual<b>ly</b>, fluent → fluent<b>ly</b></div>
</div>
<h3>Spelling with -ly</h3>
<ul>
  <li>-y → <b>-ily</b>: lucky → luck<b>ily</b>, happy → happ<b>ily</b>, easy → eas<b>ily</b>.</li>
  <li>-le → <b>-ly</b>: gentle → gent<b>ly</b>, simple → simp<b>ly</b>.</li>
  <li>-ic → <b>-ically</b>: basic → basic<b>ally</b>.</li>
</ul>
<div class="warn"><b>Irregular adverbs</b>: good → <b>well</b> (plays <s>very good</s> → plays <b>very well</b>); fast → <b>fast</b>, hard → <b>hard</b>, late → <b>late</b>.
  <p><i>hardly</i> means "almost not", not "with effort": He works <b>hard</b>.</p></div>
<div class="tip"><b>Tip</b>: read the sentence again and ask "is this slot <i>a thing</i> (noun), <i>what it is like</i> (adjective) or <i>how it is done</i> (adverb)?". Then check the spelling of the ending — one wrong letter loses the mark.</div>`
  }
};
