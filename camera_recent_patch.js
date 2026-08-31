(function(){
  if(!window.fetch)return;
  var baseFetch=window.fetch.bind(window);
  function pathOf(input){var u=typeof input==='string'?input:(input&&input.url)||'';try{return new URL(u,location.href).pathname.split('/').pop()}catch(e){return u.split('?')[0].split('/').pop()}}
  function json(url,init){return baseFetch(url,init).then(function(r){if(!r.ok)throw new Error(url);return r.json()})}
  function mergeBasics(base,extra){base=base||{products:[]};(extra.products||[]).forEach(function(ep){var bp=(base.products||[]).find(function(p){return p.id===ep.id});if(!bp){base.products.push(ep);return}if(ep.label)bp.label=ep.label;if(ep.lead)bp.lead=ep.lead;var makers=(bp.makers||[]).slice();(ep.makers||[]).forEach(function(em){var i=makers.findIndex(function(m){return m.name===em.name});if(i>=0)makers[i]=em;else makers.push(em)});bp.makers=makers});return base}
  function mergeCatalog(base,extra){base=base||{products:[]};(extra.products||[]).forEach(function(ep){var bp=(base.products||[]).find(function(p){return p.id===ep.id});if(!bp){base.products.push(ep);return}var map={};(bp.candidates||[]).forEach(function(c){map[c.id]=c});(ep.candidates||[]).forEach(function(c){map[c.id]=c});bp.candidates=Object.keys(map).map(function(k){return map[k]})});return base}
  window.fetch=function(input,init){
    var name=pathOf(input);
    if(name==='maker_basics_extra.json'){
      return Promise.all([json(input,init),json('maker_basics_camera_recent.json?v='+Date.now(),{cache:'no-store'}).catch(function(){return{products:[]}})]).then(function(all){return new Response(JSON.stringify(mergeBasics(all[0],all[1])),{status:200,headers:{'Content-Type':'application/json'}})})
    }
    if(name==='maker_series_filters_extra.json'){
      return Promise.all([json(input,init),json('maker_series_filters_camera_recent.json?v='+Date.now(),{cache:'no-store'}).catch(function(){return{products:{}}})]).then(function(all){var base=all[0]||{products:{}},extra=all[1]||{products:{}};base.products=base.products||{};Object.keys(extra.products||{}).forEach(function(id){base.products[id]=extra.products[id]});return new Response(JSON.stringify(base),{status:200,headers:{'Content-Type':'application/json'}})})
    }
    if(name==='maker_series_catalog.json'){
      return Promise.all([json(input,init),json('maker_series_catalog_camera_recent.json?v='+Date.now(),{cache:'no-store'}).catch(function(){return{products:[]}})]).then(function(all){return new Response(JSON.stringify(mergeCatalog(all[0],all[1])),{status:200,headers:{'Content-Type':'application/json'}})})
    }
    return baseFetch(input,init)
  };
})();