(function(){
  var tiers=null,busy=false;
  function pid(){return new URLSearchParams(location.search).get('product')||''}
  function rank(id,p){if((p.high||[]).indexOf(id)>=0)return 0;if((p.middle||[]).indexOf(id)>=0)return 1;if((p.standard||[]).indexOf(id)>=0)return 2;return 3}
  function apply(){var box=document.getElementById('candidatePicker'),id=pid();if(!box||!tiers||!id)return;var p=(tiers.products||{})[id]||{},cards=Array.prototype.slice.call(box.querySelectorAll('.pickCard[data-pick]'));if(cards.length<2)return;cards.sort(function(a,b){var ra=rank(a.getAttribute('data-pick'),p),rb=rank(b.getAttribute('data-pick'),p);if(ra!==rb)return ra-rb;return(a.textContent||'').localeCompare(b.textContent||'','ja')});var frag=document.createDocumentFragment();cards.forEach(function(c){frag.appendChild(c)});box.appendChild(frag)}
  function run(){if(busy)return;busy=true;setTimeout(function(){busy=false;apply()},0)}
  fetch('model_tiers.json?v='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.json():{products:{}}}).then(function(d){tiers=d||{products:{}};run();var root=document.getElementById('app')||document.body;new MutationObserver(run).observe(root,{childList:true,subtree:true});window.addEventListener('popstate',run)}).catch(function(){})
})();