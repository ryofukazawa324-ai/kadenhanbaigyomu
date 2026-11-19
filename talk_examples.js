(function(){
document.getElementById('header').innerHTML=KadenSite.nav('talk');
var genre=document.getElementById('genre'),type=document.getElementById('type'),level=document.getElementById('level'),search=document.getElementById('search'),target=document.getElementById('items'),all=[],selected=new Set(),printMode='';
var productMap={
 'PC':'パソコン','パソコン':'パソコン','PCサポート':'PCサポート','ゲーム機':'ゲーム機',
 'テレビ':'テレビ','洗濯機':'洗濯機','冷蔵庫':'冷蔵庫','エアコン':'エアコン','炊飯器':'炊飯器','プリンター':'プリンター','Wi-Fi':'Wi-Fi','コーヒーメーカー':'コーヒーメーカー','保証・サービス':'保証・サービス','カメラ':'カメラ','掃除機・クリーナー':'クリーナー','空気清浄機':'空気清浄機','加湿器':'加湿器','シェーバー':'シェーバー','AirPods':'AirPods','電子レンジ':'電子レンジ','モニター':'モニター','ドライヤー':'ドライヤー','食器洗い乾燥機':'食器洗い乾燥機','スマートフォン':'携帯・スマホ','携帯・スマホ':'携帯・スマホ','暖房器具':'暖房器具','価格・販売制度':'価格・販売制度','照明・シーリング':'シーリング','シーリング':'シーリング'
};
var departmentMap={
 'ゲーム機':'家電部門','コーヒーメーカー':'家電部門','シェーバー':'家電部門','ドライヤー':'家電部門','冷蔵庫':'家電部門','クリーナー':'家電部門','洗濯機':'家電部門','炊飯器':'家電部門','シーリング':'家電部門','電子レンジ':'家電部門','食器洗い乾燥機':'家電部門',
 'エアコン':'季節AV部門','テレビ':'季節AV部門','空気清浄機':'季節AV部門','加湿器':'季節AV部門','暖房器具':'季節AV部門',
 'パソコン':'情報部門','Wi-Fi':'情報部門','カメラ':'情報部門','モニター':'情報部門','タブレット':'情報部門','PCサポート':'情報部門','プリンター':'情報部門',
 'イヤホン':'通信部門','AirPods':'通信部門','携帯・スマホ':'通信部門',
 '価格・販売制度':'サービス','保証・サービス':'サービス'
};
function normalizeItem(x){
 var product=productMap[x.genre]||x.genre;
 return Object.assign({},x,{talkType:x.type,product:product,department:departmentMap[product]||'情報部門'});
}
function updateSelectedCount(){document.getElementById('selectedCount').textContent=selected.size+'件選択中';}
function render(){
 var q=search.value.toLowerCase();
 var found=all.filter(function(x){return(!genre.value||x.department===genre.value)&&(!type.value||x.product===type.value)&&(!level.value||x.level===level.value)&&(!q||JSON.stringify(x).toLowerCase().includes(q))});
 document.getElementById('count').textContent=found.length+'件';
 target.replaceChildren();
 found.forEach(function(x){
  var index=all.indexOf(x),d=document.createElement('details');d.className='talkCard';d.dataset.index=index;
  var pick=document.createElement('label');pick.className='talkPick';var cb=document.createElement('input');cb.type='checkbox';cb.checked=selected.has(index);cb.addEventListener('change',function(){if(cb.checked)selected.add(index);else selected.delete(index);updateSelectedCount()});pick.appendChild(cb);var pickText=document.createElement('span');pickText.textContent='印刷対象';pick.appendChild(pickText);d.appendChild(pick);
  var s=document.createElement('summary');s.textContent='['+x.level+'] '+x.department+' / '+x.product+' / '+x.title;d.appendChild(s);
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
Promise.all([fetch('talk_examples.json?v=20261117-detail').then(function(r){return r.json()}),fetch('talk_examples_washer.json').then(function(r){return r.ok?r.json():[]}).catch(function(){return[]}),fetch('talk_examples_expansion_20261113.json').then(function(r){return r.ok?r.json():[]}).catch(function(){return[]})]).then(function(parts){
 var xs=parts[0].concat(parts[1],parts[2]).map(normalizeItem);all=xs;
 ['家電部門','季節AV部門','情報部門','通信部門','サービス'].forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=v;genre.appendChild(o)});
 ['コーヒーメーカー','シェーバー','ドライヤー','冷蔵庫','クリーナー','洗濯機','炊飯器','シーリング','電子レンジ','食器洗い乾燥機','エアコン','テレビ','空気清浄機','加湿器','暖房器具','パソコン','Wi-Fi','カメラ','モニター','タブレット','PCサポート','プリンター','イヤホン','AirPods','携帯・スマホ','価格・販売制度','保証・サービス'].forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=v;type.appendChild(o)});
 render();
}).catch(function(){target.textContent='読み込みに失敗しました'});
[genre,type,level,search].forEach(function(el){el.addEventListener('input',render)});
})();