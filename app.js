// === Translations (merged) ===
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
    pair_word: "Пара",
    mode_word: "Режим",
    praise: ["Молодец!", "Отлично!"],
    modes: {
      "img-img": "Картинка–Картинка",
      "word-word": "Слово–Слово",
      "img-word": "Картинка–Слово"
    }
  },
  ua: {
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
    pair_word: "Пара",
    mode_word: "Режим",
    praise: ["Молодець!", "Чудово!"],
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
    pair_word: "Pair",
    mode_word: "Mode",
    praise: ["Well done!", "You are great!"],
    modes: {
      "img-img": "Image–Image",
      "word-word": "Word–Word",
      "img-word": "Image–Word"
    }
  }
};

// === АВТО-ОПРЕДЕЛЕНИЕ ЯЗЫКА (URL > Saved > Browser) ===
// 1. Читаем ?lang=... из ссылки
const urlParams = new URLSearchParams(window.location.search);
const urlLang = urlParams.get('lang');

// 2. Логика приоритетов: Ссылка -> Сохраненный -> Браузер -> UA
let currentLang = 'ua'; // Значение по умолчанию

if (urlLang && ['en', 'ru', 'ua', 'es'].includes(urlLang)) {
  currentLang = urlLang; // Ссылка главнее всего!
} else {
  currentLang =
    localStorage.getItem("mm_lang") ||
    (document.getElementById("langSelect")?.value) ||
    ((navigator.language || "").startsWith("ru") ? "ru" :
     (navigator.language || "").startsWith("ua") ? "ua" : "en") || "ua";
}
// =======================================================
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

  // "Тип пар"
  const modeSelect = document.getElementById("mode");
  if (modeSelect) {
    [...modeSelect.options].forEach(opt => {
      opt.textContent = t.modes[opt.value];
    });
  }

  document.querySelector("#btnExitMemory").textContent = t.exit;
  document.querySelector("#btnMemoryDone").textContent = t.memorized_start;
  document.querySelector("#screen-memory .badge").textContent = t.memory_screen;

  document.querySelector("#btnExitPlay").textContent = t.exit;

  document.querySelector("#screen-results h2").textContent = t.results;
  document.querySelector("#screen-results .stat:nth-child(1)").childNodes[0].textContent = t.correct + " ";
  document.querySelector("#screen-results .stat:nth-child(2)").childNodes[0].textContent = t.mistakes + " ";
  document.querySelector("#btnRepeat").textContent = t.repeat_round;
  document.querySelector("#btnNew").textContent = t.new_game;

  document.querySelector("#exitModal h3").textContent = t.confirm_end;
  document.querySelector("#exitModal p.meta").textContent = t.unsaved;
  document.querySelector("#exitYes").textContent = t.yes_exit;
  document.querySelector("#exitNo").textContent = t.cancel;
}

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("langSelect");
  if (select) {
    select.value = currentLang;
    select.addEventListener("change", (e) => {
      currentLang = e.target.value;
      localStorage.setItem("mm_lang", currentLang);
      applyTranslations();
      if (typeof updateMemoryMeta === 'function') updateMemoryMeta();
      if (typeof updatePlayMeta === 'function') updatePlayMeta();
    });
  }
  applyTranslations();
  localStorage.setItem("mm_lang", currentLang);
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
  imageIds: ["airport",
  "apple", "armchair", "baby", "bag", "ball", "banana", "bathroom", "bear", "bed", "bee",
  "bike", "bird", "board", "boat", "book", "boots", "box", "boy", "bread", "bridge",
  "bus", "cake", "camel", "car", "carrot", "cat", "chair", "cheese", "chicken",
  "child", "childboy", "children", "climbingframe", "cloud", "clown", "coat",
  "computer", "cow", "crown", "cup", "dancer", "dog", "doll", "door", "dress",
  "drums", "duck", "egg", "elephant", "family", "fire", "fireman", "fish", "fishh",
  "flower", "fridge", "frog", "garden", "gglass", "girafe", "girl", "glass",
  "glass_of_juic", "glass_of_milk", "gloves", "goat", "grandma", "grandpa",
  "grapes", "guitar", "hare", "hat", "hedgehog", "hippo", "horse", "house",
  "housee", "jacket", "kangaroo", "king", "kitchen", "lamp", "laptop", "leopard",
  "lion", "lion_simba", "man", "meat", "mobile", "monkey", "monkeyy", "moon",
  "mountain", "mouse", "objec", "octopus", "orange", "park", "parrot", "pasta",
  "pen", "pencil", "penguin", "people", "pig", "pizza", "plane", "plate", "platee",
  "police", "potato", "pplate", "queen", "rabbit", "rabbitt", "rain", "rainbow",
  "rhino", "river", "road", "ruler", "scarf", "school", "schooll", "sea", "shark",
  "sheep", "ship", "shirt", "shoes", "shorts", "skirt", "sky", "slide", "snow",
  "socks", "sofa", "sofaa", "soup", "spoon", "spoonn", "squarrel", "star",
  "station", "street", "student", "sun", "sunglasses", "swan", "sweater", "swing",
  "t-shirt", "table", "taxi", "teacher", "ticket", "tiger", "tomato", "tortule",
  "toucan", "train", "tree", "truck", "trumpet", "umbrella", "violin", "watch",
  "watermelon", "whale", "wind", "window", "wolf", "woman", "womanshoes",
  "zebra", "zebraa", "zzebra"
],
  words: ["airport", "apple", "baby", "bag", "banana", "bathroom", "bear", "bed", "bike", "bird",
  "board", "boat", "book", "boots", "boy", "bread", "bridge", "brother", "bus", "car",
  "cat", "chair", "cheese", "chicken", "child", "clock", "cloud", "coat", "computer",
  "cow", "cup", "desk", "dog", "door", "dress", "egg", "elephant", "family", "father",
  "fire", "fish", "flower", "fridge", "friend", "frog", "garden", "girl", "gloves",
  "hat", "horse", "house", "jacket", "juice", "kitchen", "lamp", "lion", "man", "map",
  "meat", "metro", "milk", "monkey", "moon", "mother", "mountain", "notebook", "orange",
  "paper", "pasta", "pen", "pencil", "people", "phone", "picture", "pig", "plane",
  "plate", "rabbit", "rain", "rice", "river", "road", "room", "ruler", "scarf", "school",
  "sea", "sheep", "ship", "shirt", "shoes", "shorts", "sister", "skirt", "sky", "snow",
  "socks", "sofa", "soup", "spoon", "star", "station", "street", "student", "sun",
  "sweater", "t-shirt", "table", "taxi", "teacher", "tiger", "train", "tree", "trousers",
  "truck", "water", "wind", "window", "woman"]
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

/* ===== Touch DnD fallback (mobile) ===== */
function isPointInside(el, x, y){
  const r = el.getBoundingClientRect();
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}
function enableTouchDrag(optionEl, dropEl, onDrop){
  let dragging = false;
  let ghost = null;
  let lastX = 0, lastY = 0;

  function onTouchStart(e){
    if (dragging) return;
    const t = e.touches && e.touches[0]; if (!t) return;
    dragging = true;
    lastX = t.clientX; lastY = t.clientY;

    optionEl.classList.add('dragging');

    ghost = optionEl.cloneNode(true);
    ghost.style.position = 'fixed';
    ghost.style.left = (lastX - 40) + 'px';
    ghost.style.top  = (lastY - 40) + 'px';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '9999';
    ghost.style.opacity = '0.9';
    document.body.appendChild(ghost);

    dropEl.classList.toggle('over', isPointInside(dropEl, lastX, lastY));
    e.preventDefault();
  }
  function onTouchMove(e){
    if (!dragging) return;
    const t = e.touches && e.touches[0]; if (!t) return;
    lastX = t.clientX; lastY = t.clientY;
    if (ghost){
      ghost.style.left = (lastX - 40) + 'px';
      ghost.style.top  = (lastY - 40) + 'px';
    }
    dropEl.classList.toggle('over', isPointInside(dropEl, lastX, lastY));
    e.preventDefault();
  }
  async function onTouchEnd(e){
    if (!dragging) return;
    const over = isPointInside(dropEl, lastX, lastY);
    cleanup();
    if (over && typeof onDrop === 'function'){
      await onDrop();
    }
    e.preventDefault();
  }
  function cleanup(){
    dragging = false;
    optionEl.classList.remove('dragging');
    dropEl.classList.remove('over');
    if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
    ghost = null;
  }

  optionEl.addEventListener('touchstart', onTouchStart, {passive:false});
  optionEl.addEventListener('touchmove',  onTouchMove,  {passive:false});
  optionEl.addEventListener('touchend',   onTouchEnd,   {passive:false});
  optionEl.addEventListener('touchcancel',onTouchEnd,   {passive:false});
}

function renderCard(el, card){
  if(!card){
    el.innerHTML = '';
    return;
  }
  if (card.type === 'img'){
    el.innerHTML = `<img src="${ASSETS.imagePath(card.value)}" alt="${card.value}">`;
  } else if (card.type === 'word'){
    el.innerHTML = `<img src="${ASSETS.wordPath(card.value)}" alt="${card.value}">`;
  }
}
function renderFrame(targetEl, card){
  targetEl.innerHTML = "";
  if (card) renderCard(targetEl, card);
}

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
   return Math.floor(lo * 0.9);
}
function applyEqualWordSize(leftWordEl, leftFrame, rightWordEl, rightFrame){
  const fsL = computeFitFontSize(leftWordEl, leftFrame);
  const fsR = computeFitFontSize(rightWordEl, rightFrame);
  const fs = Math.min(fsL, fsR);
  leftWordEl.style.fontSize = fs + 'px';
  rightWordEl.style.fontSize = fs + 'px';
}

function updateMemoryMeta(){
  const t = translations[currentLang];
  UI.memory.meta.textContent = `${t.pair_word} ${State.index+1}/${State.pairs.length}`;
}
function updatePlayMeta(){
  const t = translations[currentLang];
  const modeLabel = t.modes[State.mode];
  UI.play.meta.textContent = `${t.pair_word} ${State.index+1}/${State.pairs.length} • ${t.mode_word}: ${modeLabel}`;
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
    // Для N пар берём сразу 2*N уникальных картинок
    const k = clamp(count, 2, Math.floor(State.images.length/2));
    const chosen = sample(State.images, 2*k);
    const lefts  = chosen.slice(0, k);
    const rights = chosen.slice(k, 2*k);
    State.pairs = lefts.map((lid, i)=> ({
      left:  {type:"img", value: lid},
      right: {type:"img", value: rights[i]}
    }));

  } else if(mode === "word-word"){
    // Для N пар берём сразу 2*N уникальных слов
    const k = clamp(count, 2, Math.floor(State.words.length/2));
    const chosen = sample(State.words, 2*k);
    const lefts  = chosen.slice(0, k);
    const rights = chosen.slice(k, 2*k);
    State.pairs = lefts.map((w, i)=> ({
      left:  {type:"word", value: w},
      right: {type:"word", value: rights[i]}
    }));

  } else if(mode === "img-word"){
    // Для N пар берём N уникальных картинок и N уникальных слов
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
  if (State.answeredRightByIndex[i]) renderFrame(UI.play.right, pair.right);
  UI.play.options.innerHTML = "";
  const used = new Set(Object.values(State.answeredRightByIndex));

  State.tray.forEach(card=>{
    const key = keyOf(card); if(used.has(key)) return;

    const el = createElement('div', {class:"option", draggable:"true"});
    if(card.type==="img"){
      el.appendChild(createElement("img",{src:ASSETS.imagePath(card.value),alt:card.value}));
    } else {
      el.appendChild(createElement("div",{class:"word"}, card.value));
    }
    el.dataset.key = key;

    // HTML5 DnD (десктоп)
    el.addEventListener("dragstart", e=> e.dataTransfer.setData("text/plain", key));

    // Touch DnD (мобилки) — используем ту же проверку, что в drop
    enableTouchDrag(el, UI.play.right, async ()=>{
      if (State.answeredRightByIndex[State.index]) return;
      const givenKey = key;
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
    });

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

  const t = translations[currentLang];
  const phrases = t.praise || ['Well done!','You are great!'];
  const pText = phrases[ State.praiseFlip % phrases.length ];
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
