(function(){
  if(!window.KadenSite||!window.KadenSite.loadKnowledge)return;
  var baseLoad=window.KadenSite.loadKnowledge;
  window.KadenSite.loadKnowledge=function(){
    return Promise.all([
      baseLoad(),
      fetch('knowledge_audio_compat.json?v='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.json():[]}).catch(function(){return[]})
    ]).then(function(parts){return (parts[0]||[]).concat(parts[1]||[])})
  };
})();