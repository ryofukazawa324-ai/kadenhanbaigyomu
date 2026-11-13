(function(){
  var header=document.getElementById('header');
  if(header&&window.KadenSite)header.innerHTML=KadenSite.nav('hearing');
  var data=[],genre=document.getElementById('genre'),search=document.getElementById('search'),items=document.getElementById('items'),count=document.getElementById('count');
  function esc(v){return KadenSite.esc(String(v==null?'':v))}
  function render(){
    var q=search.value.trim().toLowerCase();
    var rows=data.filter(function(x){return(!genre.value||x.genre===genre.value)&&(!q||[x.genre,x.scene,x.purpose,x.first,x.point].concat(x.follow||[]).join(' ').toLowerCase().indexOf(q)>=0)});
    count.textContent=rows.length+'件のヒアリング項目';
    items.innerHTML=rows.map(function(x){
      return '<details class="hearingCard"><summary><span class="hearingGenre">'+esc(x.genre)+'</span><b>'+esc(x.scene)+'</b><span class="hearingPurpose">'+esc(x.purpose)+'</span></summary><div class="hearingBody"><div class="hearingLabel">最初に聞く質問</div><blockquote>'+esc(x.first)+'</blockquote><div class="hearingLabel">追加で確認すること</div><ul>'+x.follow.map(function(v){return '<li>'+esc(v)+'</li>'}).join('')+'</ul><div class="hearingNote"><b>提案につなげるポイント</b><p>'+esc(x.point)+'</p></div><button type="button" class="copyQuestion">質問文をコピー</button></div></details>';
    }).join('')||'<div class="empty">該当するヒアリング項目はありません。</div>';
  }
  items.addEventListener('click',function(ev){var b=ev.target.closest('.copyQuestion');if(!b)return;var card=b.closest('.hearingCard'),q=card.querySelector('blockquote').textContent; if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(q).then(function(){b.textContent='コピーしました'}).catch(function(){b.textContent='コピーできませんでした'})}else{b.textContent='コピーに非対応です'}});
  genre.addEventListener('change',render);search.addEventListener('input',render);
  fetch('hearing_data.json?v=20261114',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('load');return r.json()}).then(function(rows){data=rows;Array.from(new Set(data.map(function(x){return x.genre}))).forEach(function(g){var o=document.createElement('option');o.value=g;o.textContent=g;genre.appendChild(o)});render()}).catch(function(){items.textContent='ヒアリング項目を読み込めませんでした。ページを再読み込みしてください。'});
})();