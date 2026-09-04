(function(){
  if(!window.fetch)return;
  var baseFetch=window.fetch.bind(window),extraPromise=null;
  function pathOf(input){var u=typeof input==='string'?input:(input&&input.url)||'';try{return new URL(u,location.href).pathname.split('/').pop()}catch(e){return u.split('?')[0].split('/').pop()}}
  function jsonFetch(input,init){return baseFetch(input,init).then(function(r){if(!r.ok)throw new Error(pathOf(input));return r.json()})}
  function extra(){if(!extraPromise)extraPromise=jsonFetch('pc_tier_extra.json?v='+Date.now(),{cache:'no-store'}).catch(function(){return{candidates:[],items:{},specs:{},tiers:{high:[],middle:[],standard:[]}}});return extraPromise}
  function tierOf(id,e){var out='';['high','middle','standard'].some(function(t){if(((e.tiers||{})[t]||[]).indexOf(id)>=0){out=t;return true}return false});return out}
  function mergeCatalog(base,e){base=base||{products:[]};var p=(base.products||[]).find(function(x){return x.id==='pc'});if(!p){p={id:'pc',candidates:[]};base.products.push(p)}var map={};(p.candidates||[]).forEach(function(c){map[c.id]=c});(e.candidates||[]).forEach(function(c){map[c.id]=c});p.candidates=Object.keys(map).map(function(k){return map[k]});return base}
  function mergeFilters(base,e){base=base||{products:{}};base.products=base.products||{};var p=base.products.pc||{axes:[],items:{},compareRows:[]};p.items=p.items||{};Object.keys(e.items||{}).forEach(function(id){p.items[id]=e.items[id]});var hasTier=(p.axes||[]).some(function(a){return a.key==='tier'});if(!hasTier)(p.axes=p.axes||[]).push({key:'tier',label:'グレード',optional:true,options:[{value:'standard',label:'ボトム'},{value:'middle',label:'ミドル'},{value:'high',label:'ハイ'}]});Object.keys(p.items).forEach(function(id){var t=tierOf(id,e);if(t)p.items[id].tier=[t]});base.products.pc=p;return base}
  function mergeSpecs(base,e){base=base||{pc:{}};base.pc=base.pc||{};Object.keys(e.specs||{}).forEach(function(id){base.pc[id]=e.specs[id]});return base}
  function mergeTiers(base,e){base=base||{products:{},labels:{}};base.products=base.products||{};var p=base.products.pc||{high:[],middle:[],standard:[]};['high','middle','standard'].forEach(function(t){var seen={},out=[];(p[t]||[]).concat(((e.tiers||{})[t]||[])).forEach(function(id){if(!seen[id]){seen[id]=1;out.push(id)}});p[t]=out});base.products.pc=p;return base}
  window.fetch=function(input,init){
    var name=pathOf(input);
    if(name==='maker_series_catalog_pc_recent.json')return Promise.all([jsonFetch(input,init),extra()]).then(function(a){return new Response(JSON.stringify(mergeCatalog(a[0],a[1])),{status:200,headers:{'Content-Type':'application/json'}})});
    if(name==='maker_series_filters_pc_recent.json')return Promise.all([jsonFetch(input,init),extra()]).then(function(a){return new Response(JSON.stringify(mergeFilters(a[0],a[1])),{status:200,headers:{'Content-Type':'application/json'}})});
    if(name==='maker_series_pc_specs.json')return Promise.all([jsonFetch(input,init),extra()]).then(function(a){return new Response(JSON.stringify(mergeSpecs(a[0],a[1])),{status:200,headers:{'Content-Type':'application/json'}})});
    if(name==='model_tiers.json')return Promise.all([jsonFetch(input,init),extra()]).then(function(a){return new Response(JSON.stringify(mergeTiers(a[0],a[1])),{status:200,headers:{'Content-Type':'application/json'}})});
    return baseFetch(input,init)
  };
})();