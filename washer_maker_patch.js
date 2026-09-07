(function(){
  if(!window.fetch)return;
  var baseFetch=window.fetch.bind(window);
  var additions=[
    {"name":"日立","one":"お手入れの少なさ・シワ低減・洗浄力で比較しやすい","strength":"ビッグドラムのらくメンテ、風アイロン系のシワ低減、ナイアガラ洗浄。タテ型ビートウォッシュは衣類長もち高濃度洗浄や洗濯槽自動おそうじも比較軸。","fit":"乾燥フィルターなど日々のお手入れを減らしたい、シャツのシワを抑えたい、タテ型でも洗浄力を重視したい人。","check":"ドラムはSTX/SX/SW/SV/CXなどで乾燥方式・容量・機能差がある。タテ型はBW-X/BW-Vなどで自動投入や容量差を確認。","series":"ビッグドラムはSTX/SXが上位、SW/SVが比較候補、CXがコンパクト系。タテ型はBW-Xが自動投入対応の上位寄り、BW-Vがシンプルな主力。","official":"https://kadenfan.hitachi.co.jp/wash/"},
    {"name":"SHARP","one":"穴なし槽・節水・清潔性とコンパクトなドラムで比較しやすい","strength":"タテ型は穴なし槽・穴なしサイクロン洗浄で節水と清潔性を訴求しやすい。ドラムはヒートポンプ乾燥、プラズマクラスター、AIoT/COCORO WASH対応機種などが比較軸。","fit":"洗濯槽の清潔性や節水を重視する、設置奥行を抑えたい、スマホ連携やダウンロードコースも使いたい人。","check":"自動投入・AIoT・乾燥方式は機種ごとに異なる。穴なし槽は主にタテ型の強みなので、ドラム式と混同しない。","series":"2026年タテ型はSW11L/SW10L、SV8L/SV7L、GV系など。ドラムはES-12X2/12P2、10L2、8L2などを容量・乾燥方式・奥行で比較。","official":"https://jp.sharp/sentaku/"}
  ];
  function patch(data){
    if(!data||!Array.isArray(data.products))return data;
    var p=data.products.find(function(x){return x&&x.id==='washer'});
    if(!p)return data;
    p.makers=p.makers||[];
    additions.forEach(function(m){
      var i=p.makers.findIndex(function(x){return x&&x.name===m.name});
      if(i>=0)p.makers[i]=m;else p.makers.push(m);
    });
    return data;
  }
  function isTarget(input){
    var u=typeof input==='string'?input:(input&&input.url)||'';
    return /(?:^|\/)maker_basics\.json(?:\?|$)/i.test(u);
  }
  window.fetch=function(input,init){
    return baseFetch(input,init).then(function(r){
      if(!isTarget(input)||!r.ok)return r;
      return r.clone().json().then(function(data){
        var headers=new Headers(r.headers);headers.set('Content-Type','application/json');
        return new Response(JSON.stringify(patch(data)),{status:r.status,statusText:r.statusText,headers:headers});
      }).catch(function(){return r});
    });
  };
})();