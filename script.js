// MindWorld Memory — логика игры
const grid = document.getElementById('grid');
const timeEl = document.getElementById('time');
const movesEl = document.getElementById('moves');
const bestEl = document.getElementById('best');
const restartBtn = document.getElementById('restart');
const winDialog = document.getElementById('winDialog');
const finalTimeEl = document.getElementById('finalTime');
const finalMovesEl = document.getElementById('finalMoves');
const playAgainBtn = document.getElementById('playAgain');

// Набор эмодзи — тематически под MindWorld
const ICONS = ['🦁','🧠','🧮','📚','✏️','🧩','🎯','⭐️']; // 8 пар = 16 карт
let deck = [];
let first = null;
let lock = false;
let moves = 0;
let matchedPairs = 0;
let timerId = null;
let seconds = 0;

function formatTime(s){
  const m = Math.floor(s/60).toString().padStart(2,'0');
  const r = (s%60).toString().padStart(2,'0');
  return `${m}:${r}`;
}

function updateTime(){
  seconds++;
  timeEl.textContent = formatTime(seconds);
}

function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeck(){
  const pairs = ICONS.flatMap(i => [i, i]);
  return shuffle(pairs);
}

function cardTemplate(icon, idx){
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('role', 'gridcell');
  card.dataset.icon = icon;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Открыть карту');
  btn.addEventListener('click', () => onFlip(card, btn));

  const front = document.createElement('div');
  front.className = 'face front';
  front.textContent = '❓';

  const back = document.createElement('div');
  back.className = 'face back';
  back.textContent = icon;

  btn.appendChild(front);
  btn.appendChild(back);
  card.appendChild(btn);
  return card;
}

function onFlip(card, btn){
  if (lock) return;
  if (card.classList.contains('revealed')) return;

  // стартуем таймер на первом действии
  if (moves === 0 && seconds === 0 && !timerId) {
    timerId = setInterval(updateTime, 1000);
  }

  card.classList.add('revealed');

  if (!first) {
    first = card;
    return;
  }

  moves++;
  movesEl.textContent = moves.toString();

  const same = first.dataset.icon === card.dataset.icon;
  if (same) {
    card.classList.add('matched');
    first.classList.add('matched');
    first = null;
    matchedPairs++;

    if (matchedPairs === ICONS.length) {
      // победа
      if (timerId) clearInterval(timerId);
      const best = Number(localStorage.getItem('mws-memory-best-time') || 0);
      const better = !best || seconds < best;
      if (better) localStorage.setItem('mws-memory-best-time', String(seconds));
      finalTimeEl.textContent = formatTime(seconds);
      finalMovesEl.textContent = moves.toString();
      requestAnimationFrame(() => winDialog.showModal());
      renderBest();
    }
    return;
  }

  // не совпало — закрываем через паузу
  lock = true;
  setTimeout(() => {
    card.classList.remove('revealed');
    first.classList.remove('revealed');
    first = null;
    lock = false;
  }, 650);
}

function renderBest(){
  const best = Number(localStorage.getItem('mws-memory-best-time') || 0);
  bestEl.textContent = best ? formatTime(best) : '—';
}

function mount(){
  // сброс
  grid.innerHTML = '';
  first = null;
  lock = false;
  moves = 0;
  matchedPairs = 0;
  seconds = 0;
  if (timerId) clearInterval(timerId);
  timerId = null;
  timeEl.textContent = '00:00';
  movesEl.textContent = '0';

  deck = buildDeck();
  deck.forEach((icon, idx) => grid.appendChild(cardTemplate(icon, idx)));
  renderBest();
}

restartBtn.addEventListener('click', mount);
playAgainBtn?.addEventListener('click', () => {
  winDialog.close();
  mount();
});

// клавиатурная навигация (стрелки)
grid.addEventListener('keydown', (e) => {
  const items = Array.from(grid.querySelectorAll('.card button'));
  const idx = items.indexOf(document.activeElement);
  if (idx === -1) return;
  const cols = 4;
  let next = idx;
  switch(e.key){
    case 'ArrowRight': next = (idx + 1) % items.length; break;
    case 'ArrowLeft':  next = (idx - 1 + items.length) % items.length; break;
    case 'ArrowDown':  next = (idx + cols) % items.length; break;
    case 'ArrowUp':    next = (idx - cols + items.length) % items.length; break;
    default: return;
  }
  items[next].focus();
  e.preventDefault();
});

// старт
mount();
