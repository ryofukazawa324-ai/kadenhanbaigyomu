(function(){
  if(!window.fetch)return;
  var baseFetch=window.fetch.bind(window);
  function canonical(v){
    if(v==='パナソニック')return'Panasonic';
    if(v==='パナソニック VIERA'||v==='パナソニックVIERA')return'Panasonic VIERA';
    return v;
  }
  function normalize(value,key){
    if(Array.isArray(value)){
      var arr=value.map(function(v){return normalize(v,key)});
      if(key==='makers'){
        var seen={};
        arr=arr.filter(function(v){
          if(!v||typeof v!=='object'||!v.name)return true;
          var k=canonical(v.name);
          v.name=k;
          if(seen[k])return false;
          seen[k]=true;
          return true;
        });
      }
      return arr;
    }
    if(value&&typeof value==='object'){
      Object.keys(value).forEach(function(k){
        if((k==='name'||k==='maker')&&typeof value[k]==='string')value[k]=canonical(value[k]);
        else value[k]=normalize(value[k],k);
      });
      return value;
    }
    return value;
  }
  function isJson(input){
    var u=typeof input==='string'?input:(input&&input.url)||'';
    return /\.json(?:\?|$)/i.test(u);
  }
  window.fetch=function(input,init){
    return baseFetch(input,init).then(function(r){
      if(!isJson(input)||!r.ok)return r;
      return r.clone().json().then(function(data){
        var headers=new Headers(r.headers);headers.set('Content-Type','application/json');
        return new Response(JSON.stringify(normalize(data,'')),{status:r.status,statusText:r.statusText,headers:headers});
      }).catch(function(){return r});
    });
  };
})();