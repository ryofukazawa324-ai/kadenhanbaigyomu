(function(){
if(!/sales_challenge\.html$/.test(location.pathname))return;
var state={selected:{},signature:'',pending:null,busy:false};
var catalog={
 '洗濯機':[
  {id:'washer_mat',label:'防水パン・設置寸法確認',keywords:['防水パン','設置スペース','奥行','コンパクト'],critical:true},
  {id:'washer_riser',label:'かさ上げ台',keywords:['排水','奥行が厳しい','コンパクト'],critical:true},
  {id:'washer_hose',label:'給水栓・排水ホース対応',keywords:['設置スペース','蛇口','排水'],critical:true}
 ],
 '冷蔵庫':[
  {id:'fridge_mat',label:'床保護マット',keywords:['設置スペース','幅60cm','幅65cm','68.5cm'],critical:false},
  {id:'fridge_route',label:'搬入経路・ドア幅確認',keywords:['設置スペース','幅60cm','幅65cm','68.5cm'],critical:true},
  {id:'fridge_door',label:'扉開き方向確認',keywords:['設置スペース'],critical:true}
 ],
 'テレビ':[
  {id:'tv_hdd',label:'録画用USB HDD',keywords:['録画','地デジ・録画'],critical:true},
  {id:'tv_hdmi',label:'HDMIケーブル',keywords:['ゲーム','ゲーム機能'],critical:false},
  {id:'tv_mount',label:'壁掛け金具・壁掛け工事',keywords:['壁掛け'],critical:true}
 ],
 'パソコン':[
  {id:'pc_office',label:'Office',keywords:['office','文書','仕事'],critical:true},
  {id:'pc_setup',label:'初期設定・データ移行',keywords:['使いやすさ','買い替え','移行'],critical:false},
  {id:'pc_mouse',label:'マウス・周辺機器',keywords:['使いやすさ'],critical:false}
 ],
 'Wi-Fiルーター':[
  {id:'wifi_lan',label:'LANケーブル',keywords:['有線','10g','10G'],critical:false},
  {id:'wifi_mesh',label:'メッシュ子機・追加ルーター',keywords:['広い','複数階','電波','多台数'],critical:true}
 ],
 'プリンター':[
  {id:'printer_ink',label:'予備インク・トナー',keywords:['大量','写真','文書'],critical:false},
  {id:'printer_cable',label:'USBケーブル',keywords:['usb','有線'],critical:false},
  {id:'printer_fax',label:'FAX用電話線・接続確認',keywords:['fax','FAX'],critical:true}
 ],
 'エアコン':[
  {id:'aircon_install',label:'標準工事・配管確認',keywords:['設置','工事','畳'],critical:true,alwaysWhenAsked:true},
  {id:'aircon_voltage',label:'専用回路・電圧/コンセント確認',keywords:['設置','工事','畳'],critical:true,alwaysWhenAsked:true},
  {id:'aircon_cover',label:'配管化粧カバー',keywords:['設置','工事'],critical:false}
 ]
};
function esc(v){return window.KadenSite?KadenSite.esc(v):String(v)}
function productLabel(){var e=document.querySelector('.challengeHero .eyebrow');if(!e)return'';var t=(e.textContent||'').split('/')[0].trim();return t}
function allAnswers(){return Array.prototype.map.call(document.querySelectorAll('.answerLog'),function(x){return x.textContent||''}).join(' ')}
function profileSig(){var p=document.querySelector('.profile');return p?(p.textContent||'').replace(/\s+/g,' ').trim():''}
function relevantOptions(label){var text=allAnswers(),low=text.toLowerCase(),list=catalog[label]||[];return list.filter(function(o){return (o.keywords||[]).some(function(k){return low.indexOf(String(k).toLowerCase())>=0})})}
function inject(){var label=productLabel(),box=document.querySelector('.challengeBox .modelGrid');if(!label||!box||!catalog[label])return;var sig=profileSig();if(sig&&state.signature&&sig!==state.signature){state.selected={};state.pending=null}if(sig)state.signature=sig;if(document.getElementById('challengeOptions'))return;
 var host=box.closest('.challengeBox'),opts=catalog[label],relevant=relevantOptions(label),div=document.createElement('div');div.id='challengeOptions';div.style.margin='18px 0';div.innerHTML='<h3>付帯品・オプションを提案</h3><p style="margin-top:4px">ヒアリング内容から必要だと思うものを追加してください。必要条件を聞けているのに付け忘れると大幅減点になります。</p><div class="choiceGrid">'+opts.map(function(o){var rel=relevant.some(function(r){return r.id===o.id}),sel=!!state.selected[o.id];return'<button type="button" class="askBtn '+(sel?'asked':'')+'" data-addon="'+esc(o.id)+'"><b>'+esc(o.label)+'</b><br><small>'+(rel?'今回のヒアリング内容に関連':'必要なら追加')+'</small></button>'}).join('')+'</div>';
 host.insertBefore(div,box);Array.prototype.forEach.call(div.querySelectorAll('[data-addon]'),function(b){b.onclick=function(){var id=b.getAttribute('data-addon');state.selected[id]=!state.selected[id];div.remove();inject()}});
 Array.prototype.forEach.call(host.querySelectorAll('.modelBtn'),function(b){if(b.dataset.addonWrapped)return;b.dataset.addonWrapped='1';b.addEventListener('click',function(){var req=relevantOptions(label),missing=req.filter(function(o){return !state.selected[o.id]});state.pending={label:label,required:req,missing:missing,selected:Object.keys(state.selected).filter(function(k){return state.selected[k]})}},true)})
}
function patchResult(){if(!state.pending||!document.querySelector('.scoreNum')||document.querySelector('[data-addon-result]'))return;var p=state.pending,scoreEl=document.querySelector('.scoreNum'),score=parseInt(scoreEl.textContent,10)||0,penalty=0;p.missing.forEach(function(o){penalty+=o.critical?25:12});score=Math.max(0,score-penalty);scoreEl.textContent=score+'点';scoreEl.classList.remove('good','mid','bad');scoreEl.classList.add(score>=80?'good':score>=60?'mid':'bad');
 var buy=document.querySelector('.buy');if(p.missing.some(function(o){return o.critical})&&buy){buy.textContent='今回は保留';buy.classList.remove('good');buy.classList.add('bad')}
 var section=document.querySelector('.challengeBox');if(!section)return;var d=document.createElement('div');d.setAttribute('data-addon-result','1');d.innerHTML='<h3>付帯品・オプション採点</h3>'+(p.required.length?p.required.map(function(o){var miss=p.missing.some(function(m){return m.id===o.id});return'<div class="reason"><b class="'+(miss?'bad':'good')+'">'+(miss?'△ ':'✓ ')+(miss?'必要なのに追加していない：':'追加済み：')+esc(o.label)+(miss?'（'+(o.critical?'−25点':'−12点')+'）':'')+'</b></div>'}).join(''):'<div class="reason">今回のヒアリング内容から必須と判定された付帯品はありません。</div>');section.appendChild(d);state.pending=null
}
function run(){if(state.busy)return;state.busy=true;setTimeout(function(){state.busy=false;inject();patchResult()},0)}
new MutationObserver(run).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});run();
})();