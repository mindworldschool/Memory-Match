
/* Memory Match — Drum Version */
const SFX = {
  scroll: new Audio('assets/sfx/scroll.wav'),
  correct: new Audio('assets/sfx/correct.wav'),
  wrong: new Audio('assets/sfx/wrong_user.mp3'),
  finish: new Audio('assets/sfx/finish.wav'),
  drop: new Audio('assets/sfx/drop.wav'),
};
Object.values(SFX).forEach(a=>{ a.volume = 0.35; });

let audioUnlocked = false;
function unlockAudio(){
  if(audioUnlocked) return;
  audioUnlocked = true;
  Object.values(SFX).forEach(a=>{ try{ a.play().then(()=>a.pause()).catch(()=>{}); }catch(e){} });
}

function removeMascot(){
  const m=document.getElementById('leoMascot'); if(m) m.remove();
  const t=document.getElementById('leoMessage'); if(t) t.remove();
  const p=document.getElementById('leoPraise'); if(p) p.remove();
}

const UI = {
  screens: {
    start: document.getElementById('screen-start'),
    memory: document.getElementById('screen-memory'),
    play: document.getElementById('screen-play'),
    results: document.getElementById('screen-results'),
  },
  start: {
    mode: document.getElementById('mode'),
    pairCount: document.getElementById('pairCount'),
    timeMode: document.getElementById('timeMode'),
    timeGroup: document.getElementById('timeGroup'),
    roundSeconds: document.getElementById('roundSeconds'),
    btnStart: document.getElementById('btnStart'),
  },
  memory: {
    left: document.getElementById('memoryLeft'),
    right: document.getElementById('memoryRight'),
    meta: document.getElementById('memoryMeta'),
    btnPrev: document.getElementById('btnMemPrev'),
    btnNext: document.getElementById('btnMemNext'),
    btnDone: document.getElementById('btnMemoryDone'),
    btnExit: document.getElementById('btnExitMemory'),
  },
  play: {
    left: document.getElementById('playLeft'),
    right: document.getElementById('playRight'),
    meta: document.getElementById('playMeta'),
    btnPrev: document.getElementById('btnPlayPrev'),
    btnNext: document.getElementById('btnPlayNext'),
    options: document.getElementById('optionsTray'),
    timerBox: document.getElementById('timerBox'),
    btnExit: document.getElementById('btnExitPlay'),
  },
  results: {
    correct: document.getElementById('statCorrect'),
    wrong: document.getElementById('statWrong'),
    btnRepeat: document.getElementById('btnRepeat'),
    btnNew: document.getElementById('btnNew'),
  }
};
// startGame wrapper (minimal, auto-added)
async function startGame(){
  try{
    State.mode = UI.start.mode.value;
    State.count = parseInt(UI.start.pairCount.value,10)||2;
    State.timed = UI.start.timeMode.value==='with-time';
    State.seconds = parseInt(UI.start.roundSeconds.value,10)||60;
  }catch(_){}
  try{ if(typeof loadPools==='function') await loadPools(); }catch(_){}
  try{ if(typeof buildPairs==='function') buildPairs(); }catch(_){}
  try{ if(typeof renderMemory==='function') renderMemory(); }catch(_){}
  try{ if(typeof showScreen==='function') showScreen('memory'); }catch(_){}
}


// Fallback inline lists for file://
const INLINE_IMAGES = ["bear", "bee", "cat", "crocodile", "goat", "hare", "hedgehog", "leopard", "lion", "panda", "parrot", "penguin", "rabbit", "stork", "turtle", "zebra"];
const INLINE_WORDS = ["airport", "apple", "baby", "bag", "banana", "bathroom", "bear", "bed", "bike", "bird", "board", "boat", "book", "boots", "boy", "bread", "bridge", "brother", "bus", "car", "cat", "chair", "cheese", "chicken", "child", "clock", "cloud", "coat", "computer", "cow", "cup", "desk", "dog", "door", "dress", "egg", "elephant", "family", "father", "fire", "fish", "flower", "fridge", "friend", "frog", "garden", "girl", "gloves", "hat", "horse", "house", "jacket", "juice", "kitchen", "lamp", "lion", "man", "map", "meat", "metro", "milk", "monkey", "moon", "mother", "mountain", "notebook", "orange", "paper", "pasta", "pen", "pencil", "people", "phone", "picture", "pig", "plane", "plate", "rabbit", "rain", "rice", "river", "road", "room", "ruler", "scarf", "school", "sea", "sheep", "ship", "shirt", "shoes", "shorts", "sister", "skirt", "sky", "snow", "socks", "sofa", "soup", "spoon", "star", "station", "street", "student", "sun", "sweater", "t-shirt", "table", "taxi", "teacher", "tiger", "train", "tree", "trousers", "truck", "water", "wind", "window", "woman"];

const FALLBACK = {
  imageIds: ["bear", "bee", "cat", "crocodile", "goat", "hare", "hedgehog", "leopard", "lion", "panda", "parrot", "penguin", "rabbit", "stork", "turtle", "zebra"],
  words: ["airport", "apple", "baby", "bag", "banana", "bathroom", "bear", "bed", "bike", "bird", "board", "boat", "book", "boots", "boy", "bread", "bridge", "brother", "bus", "car", "cat", "chair", "cheese", "chicken", "child", "clock", "cloud", "coat", "computer", "cow", "cup", "desk", "dog", "door", "dress", "egg", "elephant", "family", "father", "fire", "fish", "flower", "fridge", "friend", "frog", "garden", "girl", "gloves", "hat", "horse", "house", "jacket", "juice", "kitchen", "lamp", "lion", "man", "map", "meat", "metro", "milk", "monkey", "moon", "mother", "mountain", "notebook", "orange", "paper", "pasta", "pen", "pencil", "people", "phone", "picture", "pig", "plane", "plate", "rabbit", "rain", "rice", "river", "road", "room", "ruler", "scarf", "school", "sea", "sheep", "ship", "shirt", "shoes", "shorts", "sister", "skirt", "sky", "snow", "socks", "sofa", "soup", "spoon", "star", "station", "street", "student", "sun", "sweater", "t-shirt", "table", "taxi", "teacher", "tiger", "train", "tree", "trousers", "truck", "water", "wind", "window", "woman"]
};

const ASSETS = {
  imagesIndexUrl: "assets/images/images.json",
  wordsUrl: "assets/words/words.json",
  imagePath: (id)=>`assets/images/${id}.png`
};
// ---- Sounds (final screen) ----
const SOUNDS = {
  triumph: new Audio('assets/sounds/triumf.mp3')
};
// Prime audio on first user gesture to avoid autoplay restrictions
document.addEventListener('click', function _mw_primeOnce(){
  try { SOUNDS.triumph.play().then(()=>{SOUNDS.triumph.pause();SOUNDS.triumph.currentTime=0;}).catch(()=>{}); } catch(_){}
  document.removeEventListener('click', _mw_primeOnce);
}, {once:true});


const State = {
  mode: "img-img",
  count: 6,
  timed: false,
  seconds: 60,
  images: [],
  words: [],
  pairs: [],
  index: 0,
  answeredRightByIndex: {},
  correct: 0,
  wrong: 0,
  tray: [],
  timer: { id: null, remaining: 0 },
  praiseFlip: 0,
};

const sleep = (ms)=> new Promise(r=>setTimeout(r,ms));
const clamp = (n,min,max)=> Math.max(min, Math.min(max,n));
const shuffle = (a)=> { for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a };
const sample = (arr, k) => shuffle(arr.slice()).slice(0, k);
const keyOf = (card)=> `${card.type}:${card.value}`;

function createElement(tag, props={}, children){
  const el = document.createElement(tag);
  Object.entries(props||{}).forEach(([k,v])=>{
    if(k === "class") el.className = v;
    else if(k === "dataset") Object.assign(el.dataset, v||{});
    else if(k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
    else if(v!=null) el.setAttribute(k, v);
  });
  const list = Array.isArray(children) ? children : (children!=null ? [children] : []);
  list.forEach(ch=>{
    if(ch==null) return;
    if(typeof ch === "string") el.appendChild(document.createTextNode(ch));
    else el.appendChild(ch);
  });
  return el;
}

function renderCard(card){
  if(card.type === "img"){
    return createElement("img",{src: ASSETS.imagePath(card.value), alt: card.value});
  } else {
    return createElement("div",{class:"word"}, card.value);
  }
}
function renderFrame(targetEl, card){ targetEl.innerHTML = ""; if(card) targetEl.appendChild(renderCard(card)); }

// Fit helpers
function computeFitFontSize(el, frame){
  if(!el || !frame) return 16;
  const maxW = frame.clientWidth * 0.9;
  const maxH = frame.clientHeight * 0.9;
  let lo = 8, hi = 300;
  el.style.fontSize = hi + 'px';
  for(let i=0;i<18;i++){
    const mid = Math.floor((lo+hi)/2);
    el.style.fontSize = mid + 'px';
    const ok = el.scrollWidth <= maxW && el.scrollHeight <= maxH;
    if(ok) lo = mid; else hi = mid-1;
  }
  return lo;
}
function applyEqualWordSize(leftWordEl, leftFrame, rightWordEl, rightFrame){
  const fsL = computeFitFontSize(leftWordEl, leftFrame);
  const fsR = computeFitFontSize(rightWordEl, rightFrame);
  const fs = Math.min(fsL, fsR);
  leftWordEl.style.fontSize = fs + 'px';
  rightWordEl.style.fontSize = fs + 'px';
}

function updateMemoryMeta(){ UI.memory.meta.textContent = `Пара ${State.index+1}/${State.pairs.length}`; }
function updatePlayMeta(){
  const modeLabel = {"img-img":"Картинка–Картинка","word-word":"Слово–Слово","img-word":"Картинка–Слово"}[State.mode];
  UI.play.meta.textContent = `Пара ${State.index+1}/${State.pairs.length} • Режим: ${modeLabel}`;
}

function showScreen(name){
  if (name==='results') {
    try { SOUNDS.triumph.currentTime = 0; SOUNDS.triumph.play().catch(()=>{}); } catch(_) {}
  }
 for(const [k,el] of Object.entries(UI.screens)){ el.classList.toggle("hidden", k!==name); } }

async function loadAssetsJson(url, fallback){
  try{ const res = await fetch(url, {cache:"no-cache"}); if(!res.ok) throw new Error(); return await res.json(); }
  catch{ return fallback; }
}


async function loadPools(){
  if (location.protocol === 'file:' || location.protocol === 'file') {
    State.images = INLINE_IMAGES;
    State.words  = INLINE_WORDS;
    return;
  }
  try{
    const [images, words] = await Promise.all([
      fetch(ASSETS.imagesIndexUrl, {cache:'no-cache'}).then(r=>r.ok?r.json():INLINE_IMAGES).catch(()=>INLINE_IMAGES),
      fetch(ASSETS.wordsUrl,   {cache:'no-cache'}).then(r=>r.ok?r.json():INLINE_WORDS).catch(()=>INLINE_WORDS),
    ]);
    State.images = Array.isArray(images)? images : INLINE_IMAGES;
    State.words  = Array.isArray(words) ? words  : INLINE_WORDS;
  }catch(_){
    State.images = INLINE_IMAGES;
    State.words  = INLINE_WORDS;
  }
}


function makeDerangement(list){
  const n = list.length; if(n<=1) return list.slice().reverse();
  let perm = [...Array(n).keys()];
  do { shuffle(perm); } while(perm.some((v,i)=>v===i));
  return perm.map(i => list[i]);
}

function buildPairs(){
  const mode = State.mode, count = State.count;
  if(mode === "img-img"){
    const items = sample(State.images, clamp(count, 2, State.images.length));
    const rightOrder = makeDerangement(items);
    State.pairs = items.map((leftId, i)=> ({ left:{type:"img", value:leftId}, right:{type:"img", value:rightOrder[i]} }));
  } else if(mode === "word-word"){
    const items = sample(State.words, clamp(count, 2, State.words.length));
    const rightOrder = makeDerangement(items);
    State.pairs = items.map((left, i)=> ({ left:{type:"word", value:left}, right:{type:"word", value:rightOrder[i]} }));
  } else {
    const k = clamp(count, 2, Math.min(State.images.length, State.words.length));
    const lefts = sample(State.images, k);
    const rights = sample(State.words, k);
    const shuffledRights = shuffle(rights.slice());
    State.pairs = lefts.map((lid, i)=> ({ left:{type:"img", value:lid}, right:{type:"word", value:shuffledRights[i]} }));
  }
  State.tray = shuffle(State.pairs.map(p => p.right));
  State.index = 0; State.answeredRightByIndex = {}; State.correct = 0; State.wrong = 0;
}

function renderMemory(){
  updateMemoryMeta();
  const pair = State.pairs[State.index];
  renderFrame(UI.memory.left, pair.left);
  renderFrame(UI.memory.right, pair.right);
  requestAnimationFrame(()=>{
    const lw = UI.memory.left.querySelector('.word');
    const rw = UI.memory.right.querySelector('.word');
    if(lw && rw){ applyEqualWordSize(lw, UI.memory.left, rw, UI.memory.right); }
    else if(lw){ lw.style.fontSize = computeFitFontSize(lw, UI.memory.left)+'px'; }
    else if(rw){ rw.style.fontSize = computeFitFontSize(rw, UI.memory.right)+'px'; }
  });
}

function formatTime(sec){ const m = Math.floor(sec/60).toString().padStart(2,"0"); const s=(sec%60).toString().padStart(2,"0"); return `${m}:${s}`; }
function startTimer(){
  if(!State.timed) return;
  UI.play.timerBox.classList.remove("hidden");
  State.timer.remaining = State.seconds; UI.play.timerBox.textContent = formatTime(State.timer.remaining);
  State.timer.id = setInterval(()=>{
    State.timer.remaining--; UI.play.timerBox.textContent = formatTime(State.timer.remaining);
    if(State.timer.remaining<=0){ clearInterval(State.timer.id); finishRound(); SFX.finish.currentTime=0; SFX.finish.play().catch(()=>{}); }
  }, 1000);
}
function stopTimer(){ if(State.timer.id){ clearInterval(State.timer.id); State.timer.id = null; } UI.play.timerBox.classList.add("hidden"); }

function renderPlay(){
  updatePlayMeta();
  const i = State.index, pair = State.pairs[i];
  renderFrame(UI.play.left, pair.left);
  UI.play.right.innerHTML = "";
  if(State.answeredRightByIndex[i]) UI.play.right.appendChild(renderCard(pair.right));
  UI.play.options.innerHTML = "";
  const used = new Set(Object.values(State.answeredRightByIndex));
  State.tray.forEach(card=>{
    const key = keyOf(card); if(used.has(key)) return;
    const el = createElement('div', {class:"option", draggable:"true"});
    if(card.type==="img"){ el.appendChild(createElement("img",{src:ASSETS.imagePath(card.value),alt:card.value})); }
    else { el.appendChild(createElement("div",{class:"word"}, card.value)); }
    el.dataset.key = key;
    el.addEventListener("dragstart", e=> e.dataTransfer.setData("text/plain", key));
    UI.play.options.appendChild(el);
  });
  requestAnimationFrame(()=>{
    const lw = UI.play.left.querySelector('.word');
    const rw = UI.play.right.querySelector('.word');
    if(lw && rw){ applyEqualWordSize(lw, UI.play.left, rw, UI.play.right); }
    else if(lw){ lw.style.fontSize = computeFitFontSize(lw, UI.play.left)+'px'; }
    else if(rw){ rw.style.fontSize = computeFitFontSize(rw, UI.play.right)+'px'; }
  });
}

function nextIndex(){ State.index = (State.index+1) % State.pairs.length; }
function prevIndex(){ State.index = (State.index-1+State.pairs.length) % State.pairs.length; }

function attachDnD(){
  const drop = UI.play.right;
  drop.addEventListener("dragover",(e)=>{ if(State.answeredRightByIndex[State.index]) return; e.preventDefault(); drop.classList.add("over"); });
  drop.addEventListener("dragleave",()=> drop.classList.remove("over"));
  drop.addEventListener("drop", async (e)=>{
    if(State.answeredRightByIndex[State.index]) return;
    e.preventDefault(); drop.classList.remove("over");
    const givenKey = e.dataTransfer.getData("text/plain");
    const correctKey = keyOf(State.pairs[State.index].right);
    SFX.drop.currentTime=0; SFX.drop.play().catch(()=>{});
    if(givenKey === correctKey){
      State.answeredRightByIndex[State.index] = correctKey;
      State.correct++; SFX.correct.currentTime=0; SFX.correct.play().catch(()=>{});
      renderPlay(); await sleep(250);
      if(Object.keys(State.answeredRightByIndex).length === State.pairs.length){
        finishRound(); SFX.finish.currentTime=0; SFX.finish.play().catch(()=>{});
      } else { nextIndex(); renderPlay(); }
    } else {
      State.wrong++; SFX.wrong.currentTime=0; SFX.wrong.play().catch(()=>{});
      const overlay = createElement('div', {class:'bad-overlay'},
        createElement('img',{class:'bad-img', src:'assets/ui/wrong_overlay.png', alt:'wrong'})
      );
      drop.appendChild(overlay);
      await sleep(2000); // 2 seconds as requested
      overlay.remove();
      nextIndex(); renderPlay();
    }
  });
}

function finishRound(){
  stopTimer();
  UI.results.correct.textContent = State.correct.toString();
  UI.results.wrong.textContent = State.wrong.toString();
  showScreen("results");
  removeMascot();
  const container = document.querySelector('.container');
  const mascot = document.createElement('img');
  mascot.id='leoMascot'; mascot.src='assets/leo_mascot.png'; mascot.className='leo-mascot';
  container.appendChild(mascot);
  const phrases = ['Well done!','You are great!'];
  const pText = phrases[ State.praiseFlip % 2 ];
  State.praiseFlip++;
  const praise = document.createElement('div');
  praise.id='leoPraise'; praise.className='leo-praise'; praise.textContent = pText;
  container.appendChild(praise);
  setTimeout(()=>{ const p=document.getElementById('leoPraise'); if(p) p.remove(); }, 3000);
}

UI.start.timeMode.addEventListener("change", ()=>{
  const timed = UI.start.timeMode.value === "with-time";
  UI.start.timeGroup.style.display = timed ? "" : "none";
});
UI.start.btnStart.addEventListener("click", async ()=>{
  removeMascot(); unlockAudio();
  State.mode = UI.start.mode.value;
  State.count = parseInt(UI.start.pairCount.value,10)||2;
  State.timed = UI.start.timeMode.value === "with-time";
  State.seconds = parseInt(UI.start.roundSeconds.value,10)||60;
  await loadPools(); buildPairs(); renderMemory(); showScreen("memory");
});
UI.memory.btnPrev.addEventListener("click", ()=>{ SFX.scroll.currentTime=0; SFX.scroll.play().catch(()=>{}); prevIndex(); renderMemory(); });
UI.memory.btnNext.addEventListener("click", ()=>{ SFX.scroll.currentTime=0; SFX.scroll.play().catch(()=>{}); nextIndex(); renderMemory(); });
UI.memory.btnDone.addEventListener("click", ()=>{ removeMascot(); State.index=0; renderPlay(); showScreen("play"); startTimer(); });
UI.play.btnPrev.addEventListener("click", ()=>{ SFX.scroll.currentTime=0; SFX.scroll.play().catch(()=>{}); prevIndex(); renderPlay(); });
UI.play.btnNext.addEventListener("click", ()=>{ SFX.scroll.currentTime=0; SFX.scroll.play().catch(()=>{}); nextIndex(); renderPlay(); });
UI.results.btnRepeat.addEventListener("click", ()=>{ removeMascot(); buildPairs(); renderMemory(); showScreen("memory"); });
UI.results.btnNew.addEventListener("click", ()=>{ removeMascot(); showScreen("start"); });

// Exit confirmation modal
function askExitConfirm(){
  return new Promise((resolve)=>{
    const modal = document.getElementById('exitModal');
    const yes = document.getElementById('exitYes');
    const no = document.getElementById('exitNo');
    function cleanup(){ modal.classList.add('hidden'); yes.onclick = no.onclick = null; modal.onclick=null; document.removeEventListener('keydown', onKey); }
    function onKey(e){ if(e.key==='Escape'){ cleanup(); resolve(false);} }
    modal.classList.remove('hidden');
    document.addEventListener('keydown', onKey);
    yes.onclick = ()=>{ cleanup(); resolve(true); };
    no.onclick = ()=>{ cleanup(); resolve(false); };
    modal.onclick = (e)=>{ if(e.target===modal){ cleanup(); resolve(false);} };
  });
}
function bindExitButtons(){
  const e1 = document.getElementById('btnExitMemory');
  if(e1){ e1.onclick = async ()=>{ if(await askExitConfirm()){ stopTimer(); removeMascot(); showScreen('start'); } }; }
  const e2 = document.getElementById('btnExitPlay');
  if(e2){ e2.onclick = async ()=>{ if(await askExitConfirm()){ stopTimer(); removeMascot(); showScreen('start'); } }; }
}
bindExitButtons();

// DnD setup
attachDnD();

try{ window.startGame = startGame; }catch(_){ }
