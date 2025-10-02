// === Translations ===
const translations = {
  ru: {
    start_title: "Настройка игры",
    pairs_count: "Количество пар:",
    mode: "Тип пар:",
    time_mode: "Режим:",
    no_time: "Без времени",
    with_time: "Время раунда",
    seconds: "Секунды:",
    start_game: "Начать игру",
    exit: "Выход",
    memory_screen: "Экран запоминания",
    memorized_start: "Запомнил все — начать игру",
    results: "Результаты",
    correct: "Правильно:",
    mistakes: "Ошибки:",
    repeat_round: "Повторить раунд",
    new_game: "Новая игра",
    confirm_end: "Завершить игру?",
    unsaved: "Текущий прогресс не сохранится.",
    yes_exit: "Да, выйти",
    cancel: "Отмена",
    modes: {
      "img-img": "Картинка–Картинка",
      "word-word": "Слово–Слово",
      "img-word": "Картинка–Слово"
    }
  },
  uk: {
    start_title: "Налаштування гри",
    pairs_count: "Кількість пар:",
    mode: "Тип пар:",
    time_mode: "Режим:",
    no_time: "Без часу",
    with_time: "Час раунду",
    seconds: "Секунди:",
    start_game: "Почати гру",
    exit: "Вихід",
    memory_screen: "Екран запам’ятовування",
    memorized_start: "Запам’ятав усе — почати гру",
    results: "Результати",
    correct: "Правильно:",
    mistakes: "Помилки:",
    repeat_round: "Повторити раунд",
    new_game: "Нова гра",
    confirm_end: "Завершити гру?",
    unsaved: "Поточний процес не збережеться.",
    yes_exit: "Так, вийти",
    cancel: "Скасувати",
    modes: {
      "img-img": "Зображення–Зображення",
      "word-word": "Слово–Слово",
      "img-word": "Зображення–Слово"
    }
  },
  en: {
    start_title: "Game Settings",
    pairs_count: "Number of pairs:",
    mode: "Pair type:",
    time_mode: "Mode:",
    no_time: "No time",
    with_time: "Round time",
    seconds: "Seconds:",
    start_game: "Start game",
    exit: "Exit",
    memory_screen: "Memory screen",
    memorized_start: "Memorized all — start game",
    results: "Results",
    correct: "Correct:",
    mistakes: "Mistakes:",
    repeat_round: "Repeat round",
    new_game: "New game",
    confirm_end: "End game?",
    unsaved: "Current progress will not be saved.",
    yes_exit: "Yes, exit",
    cancel: "Cancel",
    modes: {
      "img-img": "Image–Image",
      "word-word": "Word–Word",
      "img-word": "Image–Word"
    }
  }
};

let currentLang = "uk";

function applyTranslations() {
  const t = translations[currentLang];

  document.querySelector("h2.section-title").textContent = t.start_title;
  document.querySelector("label[for='mode']").textContent = t.mode;
  document.querySelector("label[for='pairCount']").textContent = t.pairs_count;
  document.querySelector("label[for='timeMode']").textContent = t.time_mode;
  document.querySelector("#timeMode option[value='no-time']").textContent = t.no_time;
  document.querySelector("#timeMode option[value='with-time']").textContent = t.with_time;
  document.querySelector("label[for='roundSeconds']").textContent = t.seconds;
  document.querySelector("#btnStart").textContent = t.start_game;

  const modeSelect = document.getElementById("mode");
  if (modeSelect) {
    [...modeSelect.options].forEach(opt => {
      opt.textContent = translations[currentLang].modes[opt.value];
    });
  }

  document.querySelector("#btnExitMemory").textContent = t.exit;
  document.querySelector("#btnMemoryDone").textContent = t.memorized_start;
  const memBadge = document.querySelector("#screen-memory .badge");
  if (memBadge) memBadge.textContent = t.memory_screen;

  document.querySelector("#btnExitPlay").textContent = t.exit;

  document.querySelector("#screen-results h2").textContent = t.results;
  document.querySelector("#screen-results .stat:nth-child(1)").childNodes[0].textContent = t.correct + " ";
  document.querySelector("#screen-results .stat:nth-child(2)").childNodes[0].textContent = t.mistakes + " ";
  document.querySelector("#btnRepeat").textContent = t.repeat_round;
  document.querySelector("#btnNew").textContent = t.new_game;

  document.querySelector("#exitModal h3").textContent = t.confirm_end;
  const meta = document.querySelector("#exitModal p.meta");
  if (meta) meta.textContent = t.unsaved;
  document.querySelector("#exitYes").textContent = t.yes_exit;
  document.querySelector("#exitNo").textContent = t.cancel;
}

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("langSelect");
  if (select) {
    select.value = currentLang;
    select.addEventListener("change", (e) => {
      currentLang = e.target.value;
      applyTranslations();
    });
  }
  applyTranslations();
});
// === End Translations ===


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
  Object.values(SFX).forEach(a=>{
    try{ a.play().then(()=>a.pause()).catch(()=>{}); }catch(e){}
  });
  try {
    SOUNDS.triumph.play().then(()=>{SOUNDS.triumph.pause();SOUNDS.triumph.currentTime=0;}).catch(()=>{});
  } catch(_){}
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
const INLINE_IMAGES = ["airport",
  "apple",
  "armchair",
  "baby",
  "bag",
  "ball",
  "banana",
  "bathroom",
  "bear",
  "bed",
  "bee",
  "bike",
  "bird",
  "board",
  "boat",
  "book",
  "boots",
  "box",
  "boy",
  "bread",
  "bridge",
  "bus",
  "cake",
  "camel",
  "car",
  "carrot",
  "cat",
  "chair",
  "cheese",
  "chicken",
  "child",
  "childboy",
  "children",
  "climbingframe",
  "cloud",
  "clown",
  "coat",
  "computer",
  "cow",
  "crown",
  "cup",
  "dancer",
  "dog",
  "doll",
  "door",
  "dress",
  "drums",
  "duck",
  "egg",
  "elephant",
  "family",
  "fire",
  "fireman",
  "fish",
  "fishh",
  "flower",
  "fridge",
  "frog",
  "garden",
  "gglass",
  "girafe",
  "girl",
  "glass",
  "glass_of_juic",
  "glass_of_milk",
  "gloves",
  "goat",
  "grandma",
  "grandpa",
  "grapes",
  "guitar",
  "hare",
  "hat",
  "hedgehog",
  "hippo",
  "horse",
  "house",
  "housee",
  "jacket",
  "kangaroo",
  "king",
  "kitchen",
  "lamp",
  "laptop",
  "leopard",
  "lion",
  "lion_simba",
  "man",
  "meat",
  "mobile",
  "monkey",
  "monkeyy",
  "moon",
  "mountain",
  "mouse",
  "objec",
  "octopus",
  "orange",
  "park",
  "parrot",
  "pasta",
  "pen",
  "pencil",
  "penguin",
  "people",
  "pig",
  "pizza",
  "plane",
  "plate",
  "platee",
  "police",
  "potato",
  "pplate",
  "queen",
  "rabbit",
  "rabbitt",
  "rain",
  "rainbow",
  "rhino",
  "river",
  "road",
  "ruler",
  "scarf",
  "school",
  "schooll",
  "sea",
  "shark",
  "sheep",
  "ship",
  "shirt",
  "shoes",
  "shorts",
  "skirt",
  "sky",
  "slide",
  "snow",
  "socks",
  "sofa",
  "sofaa",
  "soup",
  "spoon",
  "spoonn",
  "squarrel",
  "star",
  "station",
  "street",
  "student",
  "sun",
  "sunglasses",
  "swan",
  "sweater",
  "swing",
  "t-shirt",
  "table",
  "taxi",
  "teacher",
  "ticket",
  "tiger",
  "tomato",
  "tortule",
  "toucan",
  "train",
  "tree",
  "truck",
  "trumpet",
  "umbrella",
  "violin",
  "watch",
  "watermelon",
  "whale",
  "wind",
  "window",
  "wolf",
  "woman",
  "womanshoes",
  "zebra",
  "zebraa",
  "zzebra"
];
const INLINE_WORDS = ["airport",
  "apple", "armchair", "baby", "bag", "ball", "banana", "bathroom", "bear",
  "bed", "bee", "bike", "bird", "board", "boat", "book", "boots", "box",
  "boy", "bread", "bridge", "bus", "cake", "camel", "car", "carrot", "cat",
  "chair", "cheese", "chicken", "child", "children", "cloud", "clown",
  "coat", "computer", "cow", "crown", "cup", "dancer", "dog", "doll",
  "door", "dress", "drums", "duck", "egg", "elephant", "family", "fire",
  "fireman", "fish", "flower", "fridge", "frog", "garden", "girafe",
  "girl", "glass", "gloves", "goat", "grapes", "guitar", "hare", "hat",
  "hedgehog", "hippo", "horse", "house", "jacket", "kangaroo", "king",
  "kitchen", "lamp", "laptop", "leopard", "lion", "man", "meat", "mobile",
  "monkey", "moon", "mountain", "mouse", "octopus", "orange", "park",
  "parrot", "pasta", "pen", "pencil", "penguin", "people", "pig", "pizza",
  "plane", "plate", "police", "potato", "queen", "rabbit", "rain", "rainbow",
  "rhino", "river", "road", "ruler", "scarf", "school", "sea", "shark",
  "sheep", "ship", "shirt", "shoes", "shorts", "skirt", "sky", "slide",
  "snow", "socks", "sofa", "soup", "spoon", "squarrel", "star", "station",
  "street", "student", "sun", "swan", "sweater", "swing", "t-shirt",
  "table", "taxi", "teacher", "ticket", "tiger", "tomato", "tortule",
  "toucan", "train", "tree", "truck", "trumpet", "umbrella", "violin",
  "watch", "watermelon", "whale", "wind", "window", "wolf", "woman",
  "zebra"
];

const FALLBACK = {
  imageIds: [...INLINE_IMAGES],
  words: ["airport", "apple", "baby", "bag", "banana", "bathroom", "bear", "bed", "bike", "bird", "board", "boat", "book", "boots", "boy", "bread", "bridge", "brother", "bus", "car", "cat", "chair", "cheese", "chicken", "child", "clock", "cloud", "coat", "computer", "cow", "cup", "desk", "dog", "door", "dress", "egg", "elephant", "family", "father", "fire", "fish", "flower", "fridge", "friend", "frog", "garden", "girl", "gloves", "hat", "horse", "house", "jacket", "juice", "kitchen", "lamp", "lion", "man", "map", "meat", "metro", "milk", "monkey", "moon", "mother", "mountain", "notebook", "orange", "paper", "pasta", "pen", "pencil", "people", "phone", "picture", "pig", "plane", "plate", "rabbit", "rain", "rice", "river", "road", "room", "ruler", "scarf", "school", "sea", "sheep", "ship", "shirt", "shoes", "shorts", "sister", "skirt", "sky", "snow", "socks", "sofa", "soup", "spoon", "star", "station", "street", "student", "sun", "sweater", "t-shirt", "table", "taxi", "teacher", "tiger", "train", "tree", "trousers", "truck", "water", "wind", "window", "woman"]
};

const ASSETS = {
  imagesIndexUrl: "assets/images/images.json",
  wordsUrl: "assets/words/words.json",
  imagePath: (id)=>`assets/images/${id}.png`,
  wordPath:  (id)=>`assets/words/${id}.png`
};
// ---- Sounds (final screen) ----
const SOUNDS = {
  triumph: new Audio('assets/sounds/triumf.mp3')
};

// Prime audio on first user gesture to avoid autoplay restrictions
document.addEventListener('click', unlockAudio, {once:true});
document.addEventListener('touchstart', unlockAudio, {once:true, passive:true});


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

function renderCard(el, card){
  if(!card){
    el.innerHTML = '';
    return;
  }
  if (card.type === 'img'){
    el.innerHTML = `<img src="${ASSETS.imagePath(card.value)}" alt="${card.value}" style="width:100%;height:100%;object-fit:contain;">`;
  } else if (card.type === 'word'){
    // В кадре используем картинку слова, но гарантируем масштабирование
    el.innerHTML = `<img src="${ASSETS.wordPath(card.value)}" alt="${card.value}" style="width:100%;height:100%;object-fit:contain;">`;
  }
}
function renderFrame(targetEl, card){
  targetEl.innerHTML = "";
  if (card) renderCard(targetEl, card);
}

// Fit helpers (используются только для текстовых .word вариантов в опциях)
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
  return Math.floor(lo * 0.9);
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
  const modeLabel = translations[currentLang].modes[State.mode];
  UI.play.meta.textContent = `Пара ${State.index+1}/${State.pairs.length} • Режим: ${modeLabel}`;
}

function showScreen(name){
  if (name==='results') {
    try { SOUNDS.triumph.currentTime = 0; SOUNDS.triumph.play().catch(()=>{}); } catch(_) {}
  }
  for (const [k,el] of Object.entries(UI.screens)){
    if(!el) continue;
    el.classList.toggle("hidden", k!==name);
  }
}

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
    const k = clamp(count, 2, Math.floor(State.images.length/2));
    const chosen = sample(State.images, 2*k);
    const lefts  = chosen.slice(0, k);
    const rights = chosen.slice(k, 2*k);
    State.pairs = lefts.map((lid, i)=> ({
      left:  {type:"img", value: lid},
      right: {type:"img", value: rights[i]}
    }));

  } else if(mode === "word-word"){
    const k = clamp(count, 2, Math.floor(State.words.length/2));
    const chosen = sample(State.words, 2*k);
    const lefts  = chosen.slice(0, k);
    const rights = chosen.slice(k, 2*k);
    State.pairs = lefts.map((w, i)=> ({
      left:  {type:"word", value: w},
      right: {type:"word", value: rights[i]}
    }));

  } else if(mode === "img-word"){
    const k = clamp(count, 2, Math.min(State.images.length, State.words.length));
    const lefts  = sample(State.images, k);
    const rights = sample(State.words, k);
    State.pairs = lefts.map((lid, i)=> ({
      left:  {type:"img", value: lid},
      right: {type:"word", value: rights[i]}
    }));
  }

  // нижний лоток с правыми элементами
  State.tray = shuffle(State.pairs.map(p => p.right));
  State.index = 0;
  State.answeredRightByIndex = {};
  State.correct = 0;
  State.wrong = 0;
}

function renderMemory(){
  updateMemoryMeta();
  const pair = State.pairs[State.index];
  renderFrame(UI.memory.left, pair.left);
  renderFrame(UI.memory.right, pair.right);
  // Для текстовых (.word) в будущем можно адаптировать fit — сейчас в кадре картинки
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
  if (State.answeredRightByIndex[i]) renderFrame(UI.play.right, pair.right);

  UI.play.options.innerHTML = "";
  const used = new Set(Object.values(State.answeredRightByIndex));
  State.tray.forEach(card=>{
    const key = keyOf(card); if(used.has(key)) return;
    const el = createElement('div', {class:"option", draggable:"true"});
    if(card.type==="img"){
      el.appendChild(createElement("img",{src:ASSETS.imagePath(card.value),alt:card.value, style:"width:100%;height:100%;object-fit:contain;"}));
    } else {
      // В опциях показываем текст слова — он читабелен и масштабируется
      el.appendChild(createElement("div",{class:"word"}, card.value));
    }
    el.dataset.key = key;
    el.addEventListener("dragstart", e=> e.dataTransfer.setData("text/plain", key));
    UI.play.options.appendChild(el);
  });

  // Подстройка размера шрифта только для текстовых .word в опциях
  requestAnimationFrame(()=>{
    UI.play.options.querySelectorAll('.option .word').forEach(w=>{
      const parent = w.closest('.option');
      if (parent) w.style.fontSize = computeFitFontSize(w, parent) + 'px';
    });
  });
}

function nextIndex(){ State.index = (State.index+1) % State.pairs.length; }
function prevIndex(){ State.index = (State.index-1+State.pairs.length) % State.pairs.length; }

// ---------- DnD / Pointer Events (мобильные и десктоп) ----------
function rectContainsPoint(rect, x, y){
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function attachDnD(){
  const drop = UI.play.right;

  // --- Desktop drag & drop (как было) ---
  drop.addEventListener("dragover",(e)=>{
    if(State.answeredRightByIndex[State.index]) return;
    e.preventDefault();
    drop.classList.add("over");
  });
  drop.addEventListener("dragleave",()=> drop.classList.remove("over"));
  drop.addEventListener("drop", async (e)=>{
    if(State.answeredRightByIndex[State.index]) return;
    e.preventDefault(); drop.classList.remove("over");
    const givenKey = e.dataTransfer.getData("text/plain");
    await handleDrop(givenKey);
  });

  // --- Pointer Events (универсально для мобильных) ---
  const supportsPointer = window.PointerEvent != null;

  if (supportsPointer) {
    let activeKey = null;
    let draggingEl = null;

    UI.play.options.addEventListener('pointerdown', (e)=>{
      const opt = e.target.closest(".option");
      if(!opt) return;
      activeKey = opt.dataset.key;
      draggingEl = opt;
      // увеличиваем hit-зону для тача
      draggingEl.classList.add('dragging');
      draggingEl.setPointerCapture?.(e.pointerId);
    });

    UI.play.options.addEventListener('pointermove', (e)=>{
      if(!activeKey) return;
      const rect = drop.getBoundingClientRect();
      if (rectContainsPoint(rect, e.clientX, e.clientY)) {
        drop.classList.add('over');
      } else {
        drop.classList.remove('over');
      }
    });

    UI.play.options.addEventListener('pointerup', async (e)=>{
      if(!activeKey) return;
      const rect = drop.getBoundingClientRect();
      const inside = rectContainsPoint(rect, e.clientX, e.clientY);
      drop.classList.remove('over');
      draggingEl && draggingEl.classList.remove('dragging');
      const key = activeKey;
      activeKey = null;
      draggingEl = null;
      if(inside){
        await handleDrop(key);
      }
    });

    // Предотвращаем «скролл во время перетаскивания» на андроиде/ios для области опций
    UI.play.options.style.touchAction = 'manipulation';
    drop.style.touchAction = 'manipulation';
  } else {
    // --- Fallback Touch (старые браузеры) ---
    let touchKey = null;

    UI.play.options.addEventListener("touchstart",(e)=>{
      const opt = e.target.closest(".option");
      if(!opt) return;
      touchKey = opt.dataset.key;
    }, {passive:true});

    UI.play.options.addEventListener("touchmove",(e)=>{
      const touch = e.changedTouches[0];
      const dropRect = drop.getBoundingClientRect();
      if(rectContainsPoint(dropRect, touch.clientX, touch.clientY)){
        drop.classList.add('over');
      } else {
        drop.classList.remove('over');
      }
    }, {passive:true});

    UI.play.options.addEventListener("touchend", async (e)=>{
      if(!touchKey) return;
      const touch = e.changedTouches[0];
      const dropRect = drop.getBoundingClientRect();
      const inside = rectContainsPoint(dropRect, touch.clientX, touch.clientY);
      drop.classList.remove('over');
      const key = touchKey;
      touchKey = null;
      if(inside){
        await handleDrop(key);
      }
    });
  }
}

async function handleDrop(givenKey){
  if(State.answeredRightByIndex[State.index]) return;
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
    UI.play.right.appendChild(overlay);
    await sleep(2000);
    overlay.remove();
    nextIndex(); renderPlay();
  }
}

// Кнопки выхода (если функция где-то определена отдельно — обернулись)
if (typeof bindExitButtons === 'function') {
  bindExitButtons();
}

// DnD setup
attachDnD();
// === ENABLE BUTTONS & NAV ===
// Безопасная привязка обработчиков ко всем кнопкам, чтобы они работали и на мобилках, и на десктопе.
(function bindUIButtons(){
  // helper
  const on = (el, ev, fn) => { if (el) el.addEventListener(ev, fn, {passive:false}); };

  // START screen
  on(UI.start.btnStart, 'click', (e)=>{
    e.preventDefault();
    removeMascot(); // на всякий случай, чтобы overlay не перекрывал клики
    startGame();
  });

  // MEMORY screen
  on(UI.memory.btnPrev, 'click', (e)=>{ e.preventDefault(); State.index = (State.index-1+State.pairs.length)%State.pairs.length; renderMemory(); });
  on(UI.memory.btnNext, 'click', (e)=>{ e.preventDefault(); State.index = (State.index+1)%State.pairs.length; renderMemory(); });
  on(UI.memory.btnDone, 'click', (e)=>{
    e.preventDefault();
    showScreen('play');
    renderPlay();
    stopTimer();
    startTimer();
  });
  on(UI.memory.btnExit, 'click', (e)=>{ e.preventDefault(); stopTimer(); showScreen('start'); });

  // PLAY screen
  on(UI.play.btnPrev, 'click', (e)=>{ e.preventDefault(); prevIndex(); renderPlay(); });
  on(UI.play.btnNext, 'click', (e)=>{ e.preventDefault(); nextIndex(); renderPlay(); });
  on(UI.play.btnExit, 'click', (e)=>{ e.preventDefault(); stopTimer(); showScreen('start'); });

  // RESULTS screen
  on(UI.results.btnRepeat, 'click', (e)=>{
    e.preventDefault();
    // повтор раунда с теми же настройками
    buildPairs();
    renderMemory();
    showScreen('memory');
  });
  on(UI.results.btnNew, 'click', (e)=>{
    e.preventDefault();
    stopTimer();
    showScreen('start');
  });

  // На всякий случай убедимся, что «маскот» не блокирует клики, если он где-то остался
  const maybeOverlay = document.getElementById('leoMascot') || document.getElementById('leoMessage') || document.getElementById('leoPraise');
  if (maybeOverlay) removeMascot();
})();

try{ window.startGame = startGame; }catch(_){ }
