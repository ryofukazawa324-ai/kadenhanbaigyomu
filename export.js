(function(){
  document.getElementById('header').innerHTML=KadenSite.nav('compare');
  var data={products:[],filters:{products:{}},catalog:{products:[]},sales:{products:[]},tiers:{products:{}}};
  function get(f,fb){return fetch(f+'?v='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.json():fb}).catch(function(){return fb})}
  function esc(v){return KadenSite.esc(v)}
  function mergeProducts(base,extra){(extra.products||[]).forEach(function(p){var old=base.products.find(function(x){return x.id===p.id});if(!old)base.products.push(p);else{if(p.label)old.label=p.label;if(p.makers)old.makers=p.makers}});return base}
  function mergeFilters(base,extra){Object.keys((extra||{}).products||{}).forEach(function(id){var a=base.products[id]||(base.products[id]={items:{}}),b=extra.products[id];a.items=a.items||{};Object.keys(b.items||{}).forEach(function(k){a.items[k]=b.items[k]});if(b.compareRows)a.compareRows=b.compareRows});return base}
  function mergeCatalog(base,extra){(extra.products||[]).forEach(function(p){var old=base.products.find(function(x){return x.id===p.id});if(!old)base.products.push(p);else{var m={};(old.candidates||[]).forEach(function(c){m[c.id]=c});(p.candidates||[]).forEach(function(c){m[c.id]=c});old.candidates=Object.keys(m).map(function(k){return m[k]})}});return base}
  function genres(){return data.products.filter(function(p){return candidates(p.id).length})}
  function candidates(id){var map={};data.sales.products.filter(function(p){return p.id===id}).forEach(function(p){(p.candidates||[]).forEach(function(c){map[c.id]=c})});data.catalog.products.filter(function(p){return p.id===id}).forEach(function(p){(p.candidates||[]).forEach(function(c){map[c.id]=c})});var meta=(data.filters.products[id]||{}).items||{};return Object.keys(meta).filter(function(k){return map[k]}).map(function(k){return {c:map[k],m:meta[k]}}).concat(Object.keys(map).filter(function(k){return !meta[k]}).map(function(k){return {c:map[k],m:{}}})).filter(function(x,i,a){return a.findIndex(function(y){return y.c.id===x.c.id})===i}).sort(function(a,b){return String(a.m.maker||'').localeCompare(String(b.m.maker||''),'ja')||String(a.c.name).localeCompare(String(b.c.name),'ja')})}
  function render(){var pick=document.getElementById('genreSelect').value,gs=genres().filter(function(g){return pick==='all'||g.id===pick}),html='<div class="exportToc"><h2>目次</h2><ol>'+gs.map(function(g){return '<li><a href="#genre-'+esc(g.id)+'">'+esc(g.label)+'</a> <span>('+candidates(g.id).length+'機種)</span> <a class="jumpCompare" href="compare.html?product='+encodeURIComponent(g.id)+'">比較ツールを開く</a></li>'}).join('')+'</ol></div>';
  gs.forEach(function(g){var list=candidates(g.id),rows=(data.filters.products[g.id]||{}).compareRows||[];html+='<section class="exportGenre" id="genre-'+esc(g.id)+'"><div class="genreHeading"><div><p>PRODUCT CATEGORY</p><h2>'+esc(g.label)+'</h2></div><a href="compare.html?product='+encodeURIComponent(g.id)+'">このジャンルを比較する ↗</a></div><p class="genreSummary">収録候補 '+list.length+'機種。仕様・構成・販売状況は型番や時期で変わるため、店頭マスタープライスとメーカー公式仕様で最終確認してください。</p>';
  if(!list.length){html+='<p>このジャンルの機種データはまだ登録されていません。</p>'}else{html+='<table><thead><tr><th>メーカー</th><th>シリーズ・機種例</th><th>基本情報</th><th>特徴・向いている用途</th></tr></thead><tbody>'+list.map(function(x){return '<tr><td>'+esc(x.m.maker||'—')+'</td><td><strong>'+esc(x.c.name||'—')+'</strong><br><small>'+esc(x.c.tag||'')+'</small></td><td>'+esc(x.m.spec||'—')+'</td><td>'+esc(x.c.summary||x.c.strength||x.c.watch||'店頭のマスタープライス・公式仕様を確認')+'</td></tr>'}).join('')+'</tbody></table>'}
  if(rows.length)html+='<h3>比較で見る項目</h3><div class="rowChips">'+rows.map(function(x){return '<span>'+esc(x.label||x.key)+'</span>'}).join('')+'</div>';
  html+='<p class="backTop"><a href="#top" onclick="window.scrollTo({top:0,behavior:\'smooth\'})">目次・上部へ戻る ↑</a></p></section>'});
  document.getElementById('exportDocument').innerHTML=html;
  }
  document.getElementById('exportPdf').onclick=function(){window.print()};
  document.getElementById('genreSelect').onchange=render;
  Promise.all([
    get('maker_basics.json',{products:[]}),get('maker_basics_override.json',{products:[]}),get('maker_basics_extra.json',{products:[]}),get('maker_basics_pc_recent.json',{products:[]}),get('maker_basics_coffee.json',{products:[]}),
    get('maker_series_filters.json',{products:{}}),get('maker_series_filters_extra.json',{products:{}}),get('maker_series_filters_pc_recent.json',{products:{}}),get('maker_series_filters_camera_recent.json',{products:{}}),get('maker_series_filters_vaio_t.json',{products:{}}),get('maker_series_filters_coffee.json',{products:{}}),
    get('maker_series_catalog.json',{products:[]}),get('maker_series_catalog_pc_recent.json',{products:[]}),get('maker_series_catalog_camera_recent.json',{products:[]}),get('maker_series_catalog_vaio_t.json',{products:[]}),get('maker_series_catalog_tv_2026.json',{products:[]}),get('maker_series_catalog_coffee.json',{products:[]}),get('sales_mode.json',{products:[]}),get('model_tiers.json',{products:{}})
  ]).then(function(p){
    [0,1,2,3,4].forEach(function(i){mergeProducts(data,i===0?p[i]:p[i])});
    data.filters=mergeFilters(data.filters,p[5]);[6,7,8,9,10].forEach(function(i){mergeFilters(data.filters,p[i])});
    [11,12,13,14,15,16].forEach(function(i){mergeCatalog(data.catalog,p[i])});data.sales=p[17]||{products:[]};data.tiers=p[18]||{products:{}};
    var s=document.getElementById('genreSelect');genres().forEach(function(g){var o=document.createElement('option');o.value=g.id;o.textContent=g.label;s.appendChild(o)});render();
  }).catch(function(){document.getElementById('exportDocument').innerHTML='<p>データを読み込めませんでした。ページを再読み込みしてください。</p>'});
})();