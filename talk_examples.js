(function(){
document.getElementById('header').innerHTML=KadenSite.nav('talk');
var genre=document.getElementById('genre'),type=document.getElementById('type'),level=document.getElementById('level'),search=document.getElementById('search'),target=document.getElementById('items'),all=[],selected=new Set(),printMode='';
function updateSelectedCount(){document.getElementById('selectedCount').textContent=selected.size+'件選択中';}
function render(){
 var q=search.value.toLowerCase();
 var found=all.filter(function(x){return(!genre.value||x.genre===genre.value)&&(!type.value||x.type===type.value)&&(!level.value||x.level===level.value)&&(!q||JSON.stringify(x).toLowerCase().includes(q))});
 document.getElementById('count').textContent=found.length+'件';
 target.replaceChildren();
 found.forEach(function(x){
  var index=all.indexOf(x),d=document.createElement('details');d.className='talkCard';d.dataset.index=index;
  var pick=document.createElement('label');pick.className='talkPick';var cb=document.createElement('input');cb.type='checkbox';cb.checked=selected.has(index);cb.addEventListener('change',function(){if(cb.checked)selected.add(index);else selected.delete(index);updateSelectedCount()});pick.appendChild(cb);var pickText=document.createElement('span');pickText.textContent='印刷対象';pick.appendChild(pickText);d.appendChild(pick);
  var s=document.createElement('summary');s.textContent='['+x.level+'] '+x.genre+' / '+x.title+' ('+x.type+')';d.appendChild(s);
  var p=document.createElement('p');p.textContent='お客様の悩み：'+x.need;d.appendChild(p);
  var b=document.createElement('blockquote');b.textContent=x.talk;d.appendChild(b);
  var n=document.createElement('p');n.textContent='確認：'+x.point;d.appendChild(n);
  target.appendChild(d);
 });
 updateSelectedCount();
}
function printCards(mode){
 var cards=Array.from(target.querySelectorAll('.talkCard'));
 var eligible=mode==='selected'?cards.filter(function(c){return selected.has(Number(c.dataset.index))}):cards;
 if(!eligible.length){alert(mode==='selected'?'印刷する項目を選択してください。':'印刷する項目がありません。');return;}
 printMode=mode;
 cards.forEach(function(c){c.classList.toggle('printTarget',eligible.indexOf(c)>=0);c.open=true});
 document.body.classList.add('talkPrinting');
 window.print();
}
document.getElementById('printSelected').addEventListener('click',function(){printCards('selected')});
document.getElementById('printVisible').addEventListener('click',function(){printCards('visible')});
document.getElementById('clearSelected').addEventListener('click',function(){selected.clear();render()});
window.addEventListener('afterprint',function(){document.body.classList.remove('talkPrinting');target.querySelectorAll('.talkCard').forEach(function(c){c.classList.remove('printTarget');c.open=false});printMode=''});
Promise.all([fetch('talk_examples.json').then(function(r){return r.json()}),fetch('talk_examples_washer.json').then(function(r){return r.ok?r.json():[]}).catch(function(){return[]}),fetch('talk_examples_expansion_20261113.json').then(function(r){return r.ok?r.json():[]}).catch(function(){return[]})]).then(function(parts){
 var xs=parts[0].concat(parts[1],parts[2]);all=xs;
 ['genre','type'].forEach(function(k){var el=k==='genre'?genre:type;Array.from(new Set(xs.map(function(x){return x[k]}))).sort().forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=v;el.appendChild(o)})});
 render();
}).catch(function(){target.textContent='読み込みに失敗しました'});
[genre,type,level,search].forEach(function(el){el.addEventListener('input',render)});
})();