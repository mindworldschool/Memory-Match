
// Memory Match — версия с барабаном (исправленный рендер слов и вариантов)
const screens={start:document.getElementById('start-screen'),memorize:document.getElementById('memorize-screen'),play:document.getElementById('game-screen'),result:document.getElementById('result-screen')};
function show(n){Object.values(screens).forEach(s=>s.classList.remove('active'));screens[n].classList.add('active');}
const els={pairType:document.getElementById('pairType'),pairsCount:document.getElementById('pairsCount'),timerSeconds:document.getElementById('timerSeconds'),timerMode:()=>document.querySelector('input[name="timerMode"]:checked')?.value||'none',startBtn:document.getElementById('startBtn'),beginPlayBtn:document.getElementById('beginPlayBtn'),backToSettings:document.getElementById('backToSettings'),leftFrameMem:document.getElementById('leftFrameMem'),rightFrameMem:document.getElementById('rightFrameMem'),prevPair:document.getElementById('prevPair'),nextPair:document.getElementById('nextPair'),memIndex:document.getElementById('memIndex'),memTotal:document.getElementById('memTotal'),leftFramePlay:document.getElementById('leftFramePlay'),rightFramePlay:document.getElementById('rightFramePlay'),choices:document.getElementById('choices'),gameIndex:document.getElementById('gameIndex'),gameTotal:document.getElementById('gameTotal'),modeLabel:document.getElementById('modeLabel'),timerBoxPlay:document.getElementById('timerBoxPlay'),timeLeftPlay:document.getElementById('timeLeftPlay'),result:document.getElementById('result'),retryBtn:document.getElementById('retryBtn'),newBtn:document.getElementById('newBtn')};

// Fallback data (works under file://)
const FALLBACK_WORDS=["apple","banana","dog","cat","car","tree","milk","book","train","flower"];
const FALLBACK_IMAGES=[
  {"id":"sun","src":"assets/images/sun.png"},
  {"id":"car","src":"assets/images/car.png"},
  {"id":"heart","src":"assets/images/heart.png"},
  {"id":"star","src":"assets/images/star.png"},
  {"id":"tree","src":"assets/images/tree.png"},
  {"id":"ball","src":"assets/images/ball.png"},
  {"id":"cat","src":"assets/images/cat.png"},
  {"id":"dog","src":"assets/images/dog.png"},
  {"id":"book","src":"assets/images/book.png"},
  {"id":"train","src":"assets/images/train.png"}
];

async function loadWords(){try{if(location.protocol==='file:')return FALLBACK_WORDS;const r=await fetch('assets/words/words.json',{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json()}catch(e){console.warn('words.json load failed',e);return FALLBACK_WORDS}}
async function loadImages(){try{if(location.protocol==='file:')return FALLBACK_IMAGES;const r=await fetch('assets/images/images.json',{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);const ids=await r.json();return ids.map(id=>({id,src:`assets/images/${id}.png`}))}catch(e){console.warn('images.json load failed',e);return FALLBACK_IMAGES}}

function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function sampleUnique(arr,n){const c=arr.slice();shuffle(c);return c.slice(0,Math.min(n,c.length))}
function derangeAgainst(leftIds, poolIds){
  const n=leftIds.length;let right=poolIds.slice();shuffle(right);right=right.slice(0,n);
  let tries=0;while(tries++<400){
    let ok=true;for(let i=0;i<n;i++){if(right[i]===leftIds[i]){ok=false;break}}
    if(ok)return right;right.push(right.shift());
  }
  for(let i=0;i<n;i++){if(right[i]===leftIds[i]){const j=(i+1)%n;[right[i],right[j]]=[right[j],right[i]]}}
  return right;
}

function buildPairs(words,images,type,count){
  if(type==='image-image'){
    const leftObjs=sampleUnique(images,count);const leftIds=leftObjs.map(o=>o.id);
    const allIds=images.map(o=>o.id);const rightIds=derangeAgainst(leftIds,allIds);
    return leftObjs.map((L,i)=>({id:L.id+'|'+rightIds[i],left:{type:'image',id:L.id,src:L.src},right:{type:'image',id:rightIds[i],src:images.find(x=>x.id===rightIds[i]).src}}));
  }
  if(type==='word-word'){
    const left=sampleUnique(words,count);const right=derangeAgainst(left,words.slice());
    return left.map((L,i)=>({id:L+'|'+right[i],left:{type:'word',id:L,text:L},right:{type:'word',id:right[i],text:right[i]}}));
  }
  const n=Math.min(count,images.length,words.length);
  const leftObjs=sampleUnique(images,n);const rightWords=sampleUnique(words,n);shuffle(rightWords);
  return leftObjs.map((L,i)=>({id:L.id+'|'+rightWords[i],left:{type:'image',id:L.id,src:L.src},right:{type:'word',id:rightWords[i],text:rightWords[i]}}));
}

// --- исправленный рендер слов ---
function renderCard(el,card){
  if(!card){el.innerHTML='';return}
  if(card.type==='image'){el.innerHTML=`<img src="${card.src}" alt="">`}
  else{
    el.innerHTML=`<div style="font-size:90%;font-weight:bold;word-break:break-word;line-height:1.1;text-align:center;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">${card.text}</div>`;
  }
}
function renderChoice(card){
  const btn=document.createElement('button');btn.className='choice-card';
  if(card.type==='image'){
    btn.innerHTML=`<img src="${card.src}" alt="">`;
  }else{
    btn.innerHTML=`<div style="font-size:90%;font-weight:bold;word-break:break-word;line-height:1.1;text-align:center;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">${card.text}</div>`;
  }
  return btn;
}

// Timer
let timerId=null;
function stopTimer(){if(timerId){clearInterval(timerId);timerId=null}}
function startTimer(seconds,onTick,onEnd){stopTimer();let t=seconds;onTick(t);timerId=setInterval(()=>{t--;onTick(t);if(t<=0){stopTimer();onEnd()}},1000)}

// State
const state={words:[],images:[],pairs:[],memIdx:0,playIdx:0,correct:0,errors:0,pairType:'image-image',pairsCount:6,timerMode:'none',timerSeconds:120};

els.startBtn.addEventListener('click',async()=>{
  state.pairType=els.pairType.value;
  state.pairsCount=Math.max(2,Math.min(24,parseInt(els.pairsCount.value)||6));
  state.timerSeconds=Math.max(10,Math.min(600,parseInt(els.timerSeconds.value)||120));
  state.timerMode=els.timerMode();

  state.words=await loadWords();
  state.images=await loadImages();

  if(state.pairType==='image-image') state.pairsCount=Math.min(state.pairsCount,state.images.length);
  if(state.pairType==='word-word') state.pairsCount=Math.min(state.pairsCount,state.words.length);
  if(state.pairType==='image-word') state.pairsCount=Math.min(state.pairsCount,state.images.length,state.words.length);

  if(state.pairsCount<2){alert('Недостаточно элементов для выбранного режима');return}

  state.pairs=buildPairs(state.words,state.images,state.pairType,state.pairsCount);
  state.memIdx=0;state.playIdx=0;state.correct=0;state.errors=0;
  document.getElementById('memTotal').textContent=String(state.pairs.length);
  renderMem();show('memorize');
});

els.prevPair.addEventListener('click',()=>{state.memIdx=(state.memIdx-1+state.pairs.length)%state.pairs.length;renderMem()});
els.nextPair.addEventListener('click',()=>{state.memIdx=(state.memIdx+1)%state.pairs.length;renderMem()});
els.beginPlayBtn.addEventListener('click',()=>{startPlay()});
els.backToSettings.addEventListener('click',()=>{stopTimer();show('start')});

function renderMem(){
  const p=state.pairs[state.memIdx];
  document.getElementById('memIndex').textContent=String(state.memIdx+1);
  renderCard(els.leftFrameMem,p.left);renderCard(els.rightFrameMem,p.right);
}

function startPlay(){
  show('play');
  document.getElementById('modeLabel').textContent=(state.pairType==='image-image'?'Картинка–Картинка':state.pairType==='image-word'?'Картинка–Слово':'Слово–Слово');
  document.getElementById('gameTotal').textContent=String(state.pairs.length);
  state.playIdx=0;state.correct=0;state.errors=0;

  if(state.timerMode==='with'){document.getElementById('timerBoxPlay').style.visibility='visible';startTimer(state.timerSeconds,(s)=>{document.getElementById('timeLeftPlay').textContent=String(s)},()=>{alert('Время раунда истекло');show('start')});}
  else{document.getElementById('timerBoxPlay').style.visibility='hidden';stopTimer();}

  renderPlay();
}

function renderPlay(){
  if(state.playIdx>=state.pairs.length){finishRound();return}
  const p=state.pairs[state.playIdx];
  document.getElementById('gameIndex').textContent=String(state.playIdx+1);
  renderCard(els.leftFramePlay,p.left);els.rightFramePlay.innerHTML='';

  const options=shuffle(state.pairs.map(x=>x.right));
  els.choices.innerHTML='';
  options.forEach(opt=>{
    const btn=renderChoice(opt);
    btn.addEventListener('click',()=>{
      const ok=(opt.type===p.right.type)&&((opt.id||opt.src||opt.text)===(p.right.id||p.right.src||p.right.text));
      if(ok){renderCard(els.rightFramePlay,opt);state.correct++;setTimeout(()=>{state.playIdx++;renderPlay()},450)}
      else{btn.classList.add('error');state.errors++;setTimeout(()=>{state.playIdx++;renderPlay()},550)}
    });
    els.choices.appendChild(btn);
  });
}

function finishRound(){stopTimer();show('result');els.result.innerHTML=`<div><b>Правильно:</b> ${state.correct}</div><div><b>Ошибки:</b> ${state.errors}</div>`}
els.retryBtn.addEventListener('click',()=>{state.pairs=buildPairs(state.words,state.images,state.pairType,state.pairsCount);state.memIdx=0;renderMem();show('memorize')});
els.newBtn.addEventListener('click',()=>{stopTimer();show('start')});

