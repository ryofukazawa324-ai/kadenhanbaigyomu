(function(){
  var pages=[['sales_challenge.html','接客挑戦モード'],['sales_mode.html','接客モード'],['consult.html','商品コンサル'],['compare.html','商品比較'],['qa.html','QA暗記'],['basics.html','基礎知識'],['maker_basics.html','メーカー基礎'],['makers.html','メーカー比較'],['memo.html','端末メモ']];
  function current(){var p=(location.pathname.split('/').pop()||'index.html').toLowerCase();if(p==='index.html'||p==='')return 'sales_challenge.html';return p}
  function sync(){var nav=document.querySelector('.siteHeader .nav');if(!nav)return;var cur=current();var html=pages.map(function(p){return '<a'+(cur===p[0]?' class="active"':'')+' href="'+p[0]+'">'+p[1]+'</a>'}).join('');if(nav.innerHTML!==html)nav.innerHTML=html}
  function run(){sync();setTimeout(sync,60);setTimeout(sync,300)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  window.addEventListener('pageshow',run);
})();

(function(){
  if(!/qa\.html$/i.test(location.pathname))return;
  var STORE='kadenQaMasteryV1';
  function load(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch(e){return{}}}
  function save(v){try{localStorage.setItem(STORE,JSON.stringify(v))}catch(e){}}
  function qkey(x){return String((x&&x.genre)||'')+'||'+String((x&&x.q)||'')}
  function record(x,ok){if(!x)return;var m=load(),k=qkey(x),v=m[k]||{correct:0,wrong:0};if(ok){v.correct=Math.min(8,(v.correct||0)+1)}else{v.wrong=(v.wrong||0)+1;v.correct=Math.max(0,(v.correct||0)-2)}m[k]=v;save(m)}
  function chance(x){var v=load()[qkey(x)]||{},c=v.correct||0;if(c>=5)return .08;if(c>=3)return .18;if(c>=2)return .35;if(c>=1)return .6;return 1}
  function adaptiveBuild(){if(typeof filtered!=='function'||typeof shuffle!=='function')return;var src=filtered(),picked=src.filter(function(x){return Math.random()<chance(x)});if(!picked.length&&src.length)picked=[src[Math.floor(Math.random()*src.length)]];pool=shuffle(picked);idx=correct=answered=0}
  function install(){if(typeof window.build!=='function'||typeof window.render!=='function'||!window.data)return setTimeout(install,100);window.build=adaptiveBuild;adaptiveBuild();if(typeof genres==='function')genres();render();document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('.qaChoice[data-c]');if(!b||b.disabled)return;var x=pool&&pool.length?pool[idx%pool.length]:null;if(!x)return;var ok=typeof norm==='function'&&typeof answer==='function'?norm(b.dataset.c)===norm(answer(x)):b.classList.contains('correct');record(x,ok)},true)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(install,150)});else setTimeout(install,150);
})();

(function(){
  if(!/qa\.html$/i.test(location.pathname))return;
  var MARK='kadenQaReviewMarksV1';
  function read(){try{var a=JSON.parse(localStorage.getItem(MARK)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
  function currentKey(){try{var x=pool&&pool.length?pool[idx]:null;return x?(String(x.genre||'')+'||'+String(x.q||'')):''}catch(e){return''}}
  function marked(k){return read().indexOf(k)>=0}
  function toggle(k){var a=read(),i=a.indexOf(k);if(i>=0)a.splice(i,1);else a.push(k);localStorage.setItem(MARK,JSON.stringify(a))}
  function addButton(){
    var result=document.getElementById('result');
    if(!result||!result.querySelector('.qaResult'))return;
    var old=document.querySelector('.qaActions [data-action="mark"]');if(old)old.style.display='none';
    if(result.querySelector('.qaReviewAfterAnswer'))return;
    var k=currentKey();if(!k)return;
    var wrap=document.createElement('div');wrap.className='qaActions qaReviewAfterAnswer';
    var b=document.createElement('button');b.type='button';b.className='qaBtn'+(marked(k)?' marked':'');b.textContent=marked(k)?'○ 復習マーク済み':'○ あとで見返す';
    b.addEventListener('click',function(){toggle(k);var on=marked(k);b.classList.toggle('marked',on);b.textContent=on?'○ 復習マーク済み':'○ あとで見返す'});
    wrap.appendChild(b);result.appendChild(wrap)
  }
  function watch(){var c=document.getElementById('content');if(!c)return setTimeout(watch,100);new MutationObserver(function(){setTimeout(addButton,0)}).observe(c,{childList:true,subtree:true});document.addEventListener('click',function(){setTimeout(addButton,0)},true)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
})();