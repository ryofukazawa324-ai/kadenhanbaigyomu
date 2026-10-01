(function(){
  if(!/qa\.html$/i.test(location.pathname))return;
  var originalFetch=window.fetch.bind(window);
  window.fetch=function(input,init){
    var url=typeof input==='string'?input:(input&&input.url)||'';
    if(/qa_expansion_09\.json(?:\?|$)/.test(url)){
      return Promise.all([originalFetch(input,init),originalFetch('qa_expansion_10.json?v=20261001-pack10',{cache:'no-store'}),originalFetch('qa_expansion_11.json?v=20261001-camera-audio',{cache:'no-store'}),originalFetch('qa_expansion_12.json?v=20261001-pack12',{cache:'no-store'})]).then(function(rs){
        return Promise.all(rs.map(function(r){return r.ok?r.json():[]})).then(function(parts){
          var merged=[];parts.forEach(function(a){if(Array.isArray(a))merged=merged.concat(a)});
          return new Response(JSON.stringify(merged),{status:200,headers:{'Content-Type':'application/json'}})
        })
      })
    }
    return originalFetch(input,init)
  }
})();

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
  var MARK='kadenQaReviewMarksV1';
  function read(name){try{var a=JSON.parse(localStorage.getItem(name)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
  function currentItem(){try{return pool&&pool.length?pool[idx]:null}catch(e){return null}}
  function currentKey(){var x=currentItem();return x?(String(x.genre||'')+'||'+String(x.q||'')):''}
  function marked(k){return read(MARK).indexOf(k)>=0}
  function toggleMark(k){var a=read(MARK),i=a.indexOf(k);if(i>=0)a.splice(i,1);else a.push(k);localStorage.setItem(MARK,JSON.stringify(a))}
  function installAnswerActions(){
    var result=document.getElementById('result');
    if(!result||!result.querySelector('.qaResult'))return;
    var topMark=document.querySelector('.qaActions [data-action="mark"]');if(topMark)topMark.style.display='none';
    var topRemove=document.querySelector('.qaActions [data-action="remove"]');if(topRemove)topRemove.style.display='none';
    if(result.querySelector('.qaAfterAnswerActions'))return;
    var x=currentItem(),k=currentKey();if(!x||!k)return;
    var wrap=document.createElement('div');wrap.className='qaActions qaAfterAnswerActions';wrap.style.cssText='display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;padding-top:14px;border-top:3px solid #d8dde7;';
    var mark=document.createElement('button');mark.type='button';mark.className='qaBtn'+(marked(k)?' marked':'');mark.textContent=marked(k)?'○ 復習マーク済み':'○ 復習に追加';
    mark.addEventListener('click',function(){toggleMark(k);var on=marked(k);mark.classList.toggle('marked',on);mark.textContent=on?'○ 復習マーク済み':'○ 復習に追加'});
    var hide=document.createElement('button');hide.type='button';hide.className='qaBtn';hide.textContent='この問題を非表示';hide.style.cssText='border-color:#efb0ad;color:#b42318;';
    hide.addEventListener('click',function(){if(typeof saveHidden==='function'){saveHidden(x)}else{var store='kadenQaHiddenV1',a=read(store),kk=k;if(a.indexOf(kk)<0)a.push(kk);localStorage.setItem(store,JSON.stringify(a));location.reload()}});
    wrap.appendChild(mark);wrap.appendChild(hide);result.appendChild(wrap)
  }
  function hidePreAnswerActions(){var m=document.querySelector('.qaActions [data-action="mark"]'),r=document.querySelector('.qaActions [data-action="remove"]');if(m)m.style.display='none';if(r)r.style.display='none'}
  function watch(){var c=document.getElementById('content');if(!c)return setTimeout(watch,100);new MutationObserver(function(){hidePreAnswerActions();setTimeout(installAnswerActions,0)}).observe(c,{childList:true,subtree:true});document.addEventListener('click',function(){setTimeout(function(){hidePreAnswerActions();installAnswerActions()},0)},true);hidePreAnswerActions()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
})();