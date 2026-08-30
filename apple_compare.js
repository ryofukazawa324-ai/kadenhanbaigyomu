(function(){
  if(!/sales_mode\.html$/.test(location.pathname))return;
  var busy=false,lastSignature='';
  function esc(v){return String(v||'').replace(/[&<>"']/g,function(x){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]})}
  function productId(){var q=window.KadenSite?KadenSite.qs('product'):'';if(q)return q;var e=document.querySelector('.modeHero .eyebrow'),t=e?(e.textContent||''):'';var map={'テレビ':'tv','冷蔵庫':'refrigerator','洗濯機':'washer','パソコン':'pc','エアコン':'aircon','Wi-Fi':'wifi','プリンター':'printer'};var found='';Object.keys(map).some(function(k){if(t.indexOf(k)>=0){found=map[k];return true}return false});return found}
  function dlMap(card){var out={};Array.prototype.forEach.call(card.querySelectorAll('dl dt'),function(dt){var dd=dt.nextElementSibling;if(dd)out[(dt.textContent||'').trim()]=(dd.textContent||'').trim()});return out}
  function firstLine(el){if(!el)return'';var t=(el.innerText||el.textContent||'').trim();return t.split(/\n+/)[0].trim()}
  function colorText(card){var el=card.querySelector('[data-pc-colors]');if(!el)return'';var t=firstLine(el);return t.replace(/^.*?[：:]/,'').trim()}
  function sizeText(card){var found='';Array.prototype.some.call(card.querySelectorAll('.matchReason'),function(el){var t=(el.textContent||'').trim();if(/^サイズ展開[：:]/.test(t)){found=t.replace(/^サイズ展開[：:]\s*/,'');return true}return false});return found}
  function tierText(card){var el=card.querySelector('.tierBadge');return el?(el.textContent||'').trim():''}
  function tierClass(v){if(/ハイ/.test(v))return'tier-high';if(/ミドル/.test(v))return'tier-middle';if(/スタンダード/.test(v))return'tier-standard';return''}
  function cardData(card,index){var map=dlMap(card),link=card.querySelector('.officialLink');return{
    rank:((card.querySelector('.resultRank')||{}).textContent||('候補 '+(index+1))).trim(),
    name:((card.querySelector('h3')||{}).textContent||'').trim(),
    tag:((card.querySelector('.resultTag')||{}).textContent||'').trim(),
    grade:tierText(card),
    fit:map['今回残った理由']||map['向いている人']||'',
    strength:map['比較で伝える強み']||map['強み']||'',
    watch:map['最後に確認']||map['確認点']||'',
    sizes:sizeText(card),
    colors:colorText(card),
    official:link?link.getAttribute('href')||'':''
  }}
  function sameValues(vals){var clean=vals.map(function(v){return String(v||'').replace(/\s+/g,' ').trim()}).filter(Boolean);if(clean.length<2)return true;return clean.every(function(v){return v===clean[0]})}
  function row(label,key,data,primary){var vals=data.map(function(d){return d[key]||''}),diff=!sameValues(vals);return '<div class="appleCompareCell appleCompareLabel">'+esc(label)+'</div>'+data.map(function(d){var v=d[key]||'';return '<div class="appleCompareCell appleCompareValue '+(diff?'diff ':'')+(key==='grade'?tierClass(v):'')+'">'+(v?(primary?'<strong class="comparePrimary">'+esc(v)+'</strong>':esc(v)):'<span class="appleCompareEmpty">—</span>')+'</div>'}).join('')}
  function build(data,pid){var extra='';if(pid==='tv'&&data.some(function(d){return d.sizes}))extra+=row('サイズ展開','sizes',data,true);if(pid==='pc'&&data.some(function(d){return d.colors}))extra+=row('カラー展開','colors',data,false);return '<section class="appleCompare" id="appleCompare"><div class="appleCompareHead"><div><h2>同じ項目で比較</h2><p>候補ごとの違いを横並びで確認。差がある項目は薄く強調しています。</p></div><div class="appleCompareHint">横にスクロールして比較</div></div><div class="appleCompareScroller"><div class="appleCompareGrid" style="--compare-count:'+data.length+'"><div class="appleCompareCell appleCompareLabel">候補</div>'+data.map(function(d){return '<div class="appleCompareCell appleCompareProduct"><div class="compareRank">'+esc(d.rank)+'</div><h3>'+esc(d.name)+'</h3><div class="compareTag">'+esc(d.tag)+'</div>'+(d.grade?'<div class="compareGrade">'+esc(d.grade)+'</div>':'')+(d.official?'<a class="compareOfficial" target="_blank" rel="noopener" href="'+esc(d.official)+'">公式を見る</a>':'')+'</div>'}).join('')+row('グレード','grade',data,true)+row('立ち位置','tag',data,false)+extra+row('向いている人','fit',data,false)+row('主な強み','strength',data,false)+row('注意点','watch',data,false)+'</div></div></section>'}
  function inject(){var wrap=document.querySelector('.compareWrap'),grid=document.querySelector('.resultGrid');if(!wrap||!grid)return;var cards=Array.prototype.slice.call(grid.querySelectorAll('.resultCard'));if(cards.length<2)return;var data=cards.map(cardData),pid=productId();var sig=pid+'|'+data.map(function(d){return[d.name,d.tag,d.grade,d.fit,d.strength,d.watch,d.sizes,d.colors].join('~')}).join('||');if(sig===lastSignature&&document.getElementById('appleCompare'))return;lastSignature=sig;var old=document.getElementById('appleCompare');if(old)old.remove();wrap.classList.add('appleCompareLegacy');wrap.insertAdjacentHTML('beforebegin',build(data,pid))}
  function run(){if(busy)return;busy=true;setTimeout(function(){busy=false;inject()},0)}
  var root=document.getElementById('app')||document.body;new MutationObserver(run).observe(root,{childList:true,subtree:true,characterData:true});run();
})();