/*!
 * iro.js v5.5.0
 * 2016-2021 James Daniel
 * Licensed under MPL 2.0
 * github.com/jaames/iro.js
 */

(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.iro = factory());
}(this, (function () { 'use strict';

  var n,u,i,t,o,r,f={},e=[],c=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function s(n,l){for(var u in l){ n[u]=l[u]; }return n}function a(n){var l=n.parentNode;l&&l.removeChild(n);}function h(n,l,u){var i,t,o,r=arguments,f={};for(o in l){ "key"==o?i=l[o]:"ref"==o?t=l[o]:f[o]=l[o]; }if(arguments.length>3){ for(u=[u],o=3;o<arguments.length;o++){ u.push(r[o]); } }if(null!=u&&(f.children=u),"function"==typeof n&&null!=n.defaultProps){ for(o in n.defaultProps){ void 0===f[o]&&(f[o]=n.defaultProps[o]); } }return v(n,f,i,t,null)}function v(l,u,i,t,o){var r={type:l,props:u,key:i,ref:t,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:o};return null==o&&(r.__v=r),null!=n.vnode&&n.vnode(r),r}function p(n){return n.children}function d(n,l){this.props=n,this.context=l;}function _(n,l){if(null==l){ return n.__?_(n.__,n.__.__k.indexOf(n)+1):null; }for(var u;l<n.__k.length;l++){ if(null!=(u=n.__k[l])&&null!=u.__e){ return u.__e; } }return "function"==typeof n.type?_(n):null}function w(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++){ if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break} }return w(n)}}function k(l){(!l.__d&&(l.__d=!0)&&u.push(l)&&!g.__r++||t!==n.debounceRendering)&&((t=n.debounceRendering)||i)(g);}function g(){for(var n;g.__r=u.length;){ n=u.sort(function(n,l){return n.__v.__b-l.__v.__b}),u=[],n.some(function(n){var l,u,i,t,o,r,f;n.__d&&(r=(o=(l=n).__v).__e,(f=l.__P)&&(u=[],(i=s({},o)).__v=i,t=$(f,o,i,l.__n,void 0!==f.ownerSVGElement,null!=o.__h?[r]:null,u,null==r?_(o):r,o.__h),j(u,o),t!=r&&w(o)));}); }}function m(n,l,u,i,t,o,r,c,s,h){var y,d,w,k,g,m,b,A=i&&i.__k||e,P=A.length;for(s==f&&(s=null!=r?r[0]:P?_(i,0):null),u.__k=[],y=0;y<l.length;y++){ if(null!=(k=u.__k[y]=null==(k=l[y])||"boolean"==typeof k?null:"string"==typeof k||"number"==typeof k?v(null,k,null,null,k):Array.isArray(k)?v(p,{children:k},null,null,null):null!=k.__e||null!=k.__c?v(k.type,k.props,k.key,null,k.__v):k)){if(k.__=u,k.__b=u.__b+1,null===(w=A[y])||w&&k.key==w.key&&k.type===w.type){ A[y]=void 0; }else { for(d=0;d<P;d++){if((w=A[d])&&k.key==w.key&&k.type===w.type){A[d]=void 0;break}w=null;} }g=$(n,k,w=w||f,t,o,r,c,s,h),(d=k.ref)&&w.ref!=d&&(b||(b=[]),w.ref&&b.push(w.ref,null,k),b.push(d,k.__c||g,k)),null!=g?(null==m&&(m=g),s=x(n,k,w,A,r,g,s),h||"option"!=u.type?"function"==typeof u.type&&(u.__d=s):n.value=""):s&&w.__e==s&&s.parentNode!=n&&(s=_(w));} }if(u.__e=m,null!=r&&"function"!=typeof u.type){ for(y=r.length;y--;){ null!=r[y]&&a(r[y]); } }for(y=P;y--;){ null!=A[y]&&L(A[y],A[y]); }if(b){ for(y=0;y<b.length;y++){ I(b[y],b[++y],b[++y]); } }}function x(n,l,u,i,t,o,r){var f,e,c;if(void 0!==l.__d){ f=l.__d,l.__d=void 0; }else if(t==u||o!=r||null==o.parentNode){ n:if(null==r||r.parentNode!==n){ n.appendChild(o),f=null; }else {for(e=r,c=0;(e=e.nextSibling)&&c<i.length;c+=2){ if(e==o){ break n; } }n.insertBefore(o,r),f=r;} }return void 0!==f?f:o.nextSibling}function A(n,l,u,i,t){var o;for(o in u){ "children"===o||"key"===o||o in l||C(n,o,null,u[o],i); }for(o in l){ t&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||C(n,o,l[o],u[o],i); }}function P(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||c.test(l)?u:u+"px";}function C(n,l,u,i,t){var o,r,f;if(t&&"className"==l&&(l="class"),"style"===l){ if("string"==typeof u){ n.style.cssText=u; }else {if("string"==typeof i&&(n.style.cssText=i=""),i){ for(l in i){ u&&l in u||P(n.style,l,""); } }if(u){ for(l in u){ i&&u[l]===i[l]||P(n.style,l,u[l]); } }} }else { "o"===l[0]&&"n"===l[1]?(o=l!==(l=l.replace(/Capture$/,"")),(r=l.toLowerCase())in n&&(l=r),l=l.slice(2),n.l||(n.l={}),n.l[l+o]=u,f=o?N:z,u?i||n.addEventListener(l,f,o):n.removeEventListener(l,f,o)):"list"!==l&&"tagName"!==l&&"form"!==l&&"type"!==l&&"size"!==l&&"download"!==l&&"href"!==l&&!t&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u&&!/^ar/.test(l)?n.removeAttribute(l):n.setAttribute(l,u)); }}function z(l){this.l[l.type+!1](n.event?n.event(l):l);}function N(l){this.l[l.type+!0](n.event?n.event(l):l);}function T(n,l,u){var i,t;for(i=0;i<n.__k.length;i++){ (t=n.__k[i])&&(t.__=n,t.__e&&("function"==typeof t.type&&t.__k.length>1&&T(t,l,u),l=x(u,t,t,n.__k,null,t.__e,l),"function"==typeof n.type&&(n.__d=l))); }}function $(l,u,i,t,o,r,f,e,c){var a,h,v,y,_,w,k,g,b,x,A,P=u.type;if(void 0!==u.constructor){ return null; }null!=i.__h&&(c=i.__h,e=u.__e=i.__e,u.__h=null,r=[e]),(a=n.__b)&&a(u);try{n:if("function"==typeof P){if(g=u.props,b=(a=P.contextType)&&t[a.__c],x=a?b?b.props.value:a.__:t,i.__c?k=(h=u.__c=i.__c).__=h.__E:("prototype"in P&&P.prototype.render?u.__c=h=new P(g,x):(u.__c=h=new d(g,x),h.constructor=P,h.render=M),b&&b.sub(h),h.props=g,h.state||(h.state={}),h.context=x,h.__n=t,v=h.__d=!0,h.__h=[]),null==h.__s&&(h.__s=h.state),null!=P.getDerivedStateFromProps&&(h.__s==h.state&&(h.__s=s({},h.__s)),s(h.__s,P.getDerivedStateFromProps(g,h.__s))),y=h.props,_=h.state,v){ null==P.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),null!=h.componentDidMount&&h.__h.push(h.componentDidMount); }else {if(null==P.getDerivedStateFromProps&&g!==y&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(g,x),!h.__e&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(g,h.__s,x)||u.__v===i.__v){h.props=g,h.state=h.__s,u.__v!==i.__v&&(h.__d=!1),h.__v=u,u.__e=i.__e,u.__k=i.__k,h.__h.length&&f.push(h),T(u,e,l);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(g,h.__s,x),null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(y,_,w);});}h.context=x,h.props=g,h.state=h.__s,(a=n.__r)&&a(u),h.__d=!1,h.__v=u,h.__P=l,a=h.render(h.props,h.state,h.context),h.state=h.__s,null!=h.getChildContext&&(t=s(s({},t),h.getChildContext())),v||null==h.getSnapshotBeforeUpdate||(w=h.getSnapshotBeforeUpdate(y,_)),A=null!=a&&a.type==p&&null==a.key?a.props.children:a,m(l,Array.isArray(A)?A:[A],u,i,t,o,r,f,e,c),h.base=u.__e,u.__h=null,h.__h.length&&f.push(h),k&&(h.__E=h.__=null),h.__e=!1;}else { null==r&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=H(i.__e,u,i,t,o,r,f,c); }(a=n.diffed)&&a(u);}catch(l$1){u.__v=null,(c||null!=r)&&(u.__e=e,u.__h=!!c,r[r.indexOf(e)]=null),n.__e(l$1,u,i);}return u.__e}function j(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u);});}catch(l$1){n.__e(l$1,u.__v);}});}function H(n,l,u,i,t,o,r,c){var s,a,h,v,y,p=u.props,d=l.props;if(t="svg"===l.type||t,null!=o){ for(s=0;s<o.length;s++){ if(null!=(a=o[s])&&((null===l.type?3===a.nodeType:a.localName===l.type)||n==a)){n=a,o[s]=null;break} } }if(null==n){if(null===l.type){ return document.createTextNode(d); }n=t?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type,d.is&&{is:d.is}),o=null,c=!1;}if(null===l.type){ p===d||c&&n.data===d||(n.data=d); }else {if(null!=o&&(o=e.slice.call(n.childNodes)),h=(p=u.props||f).dangerouslySetInnerHTML,v=d.dangerouslySetInnerHTML,!c){if(null!=o){ for(p={},y=0;y<n.attributes.length;y++){ p[n.attributes[y].name]=n.attributes[y].value; } }(v||h)&&(v&&(h&&v.__html==h.__html||v.__html===n.innerHTML)||(n.innerHTML=v&&v.__html||""));}A(n,d,p,t,c),v?l.__k=[]:(s=l.props.children,m(n,Array.isArray(s)?s:[s],l,u,i,"foreignObject"!==l.type&&t,o,r,f,c)),c||("value"in d&&void 0!==(s=d.value)&&(s!==n.value||"progress"===l.type&&!s)&&C(n,"value",s,p.value,!1),"checked"in d&&void 0!==(s=d.checked)&&s!==n.checked&&C(n,"checked",s,p.checked,!1));}return n}function I(l,u,i){try{"function"==typeof l?l(u):l.current=u;}catch(l$1){n.__e(l$1,i);}}function L(l,u,i){var t,o,r;if(n.unmount&&n.unmount(l),(t=l.ref)&&(t.current&&t.current!==l.__e||I(t,null,u)),i||"function"==typeof l.type||(i=null!=(o=l.__e)),l.__e=l.__d=void 0,null!=(t=l.__c)){if(t.componentWillUnmount){ try{t.componentWillUnmount();}catch(l$1){n.__e(l$1,u);} }t.base=t.__P=null;}if(t=l.__k){ for(r=0;r<t.length;r++){ t[r]&&L(t[r],u,i); } }null!=o&&a(o);}function M(n,l,u){return this.constructor(n,u)}function O(l,u,i){var t,r,c;n.__&&n.__(l,u),r=(t=i===o)?null:i&&i.__k||u.__k,l=h(p,null,[l]),c=[],$(u,(t?u:i||u).__k=l,r||f,f,void 0!==u.ownerSVGElement,i&&!t?[i]:r?null:u.childNodes.length?e.slice.call(u.childNodes):null,c,i||f,t),j(c,l);}n={__e:function(n,l){for(var u,i,t,o=l.__h;l=l.__;){ if((u=l.__c)&&!u.__){ try{if((i=u.constructor)&&null!=i.getDerivedStateFromError&&(u.setState(i.getDerivedStateFromError(n)),t=u.__d),null!=u.componentDidCatch&&(u.componentDidCatch(n),t=u.__d),t){ return l.__h=o,u.__E=u }}catch(l$1){n=l$1;} } }throw n}},d.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=s({},this.state),"function"==typeof n&&(n=n(s({},u),this.props)),n&&s(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),k(this));},d.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),k(this));},d.prototype.render=p,u=[],i="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,g.__r=0,o=f,r=0;//# sourceMappingURL=preact.module.js.map

  function t$1(){return (t$1=Object.assign||function(t){
  var arguments$1 = arguments;
  for(var r=1;r<arguments.length;r++){var n=arguments$1[r];for(var e in n){ Object.prototype.hasOwnProperty.call(n,e)&&(t[e]=n[e]); }}return t}).apply(this,arguments)}var r$1="(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)",n$1="[\\s|\\(]+("+r$1+")[,|\\s]+("+r$1+")[,|\\s]+("+r$1+")\\s*\\)?",e$1="[\\s|\\(]+("+r$1+")[,|\\s]+("+r$1+")[,|\\s]+("+r$1+")[,|\\s]+("+r$1+")\\s*\\)?",i$1=new RegExp("rgb"+n$1),a$1=new RegExp("rgba"+e$1),h$1=new RegExp("hsl"+n$1),s$1=new RegExp("hsla"+e$1),o$1=new RegExp("^(?:#?|0x?)([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$"),u$1=new RegExp("^(?:#?|0x?)([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$"),c$1=new RegExp("^(?:#?|0x?)([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$"),l=new RegExp("^(?:#?|0x?)([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$"),g$1=Math.log,d$1=Math.round,f$1=Math.floor;function v$1(t,r,n){return Math.min(Math.max(t,r),n)}function b(t,r){var n=t.indexOf("%")>-1,e=parseFloat(t);return n?r/100*e:e}function w$1(t){return parseInt(t,16)}function x$1(t){return t.toString(16).padStart(2,"0")}var y=function(){function r(r,n){this.$={h:0,s:0,v:0,a:1},r&&this.set(r),this.onChange=n,this.initialValue=t$1({},this.$);}var n,e=r.prototype;return e.set=function(t){if("string"==typeof t){ /^(?:#?|0x?)[0-9a-fA-F]{3,8}$/.test(t)?this.hexString=t:/^rgba?/.test(t)?this.rgbString=t:/^hsla?/.test(t)&&(this.hslString=t); }else {if("object"!=typeof t){ throw new Error("Invalid color value"); }t instanceof r?this.hsv=t.hsv:"r"in t&&"g"in t&&"b"in t?this.rgb=t:"h"in t&&"s"in t&&"v"in t?this.hsv=t:"h"in t&&"s"in t&&"l"in t?this.hsl=t:"kelvin"in t&&(this.kelvin=t.kelvin);}},e.setChannel=function(r,n,e){var i;this[r]=t$1({},this[r],((i={})[n]=e,i));},e.reset=function(){this.hsva=this.initialValue;},e.clone=function(){return new r(this)},e.unbind=function(){this.onChange=void 0;},r.hsvToRgb=function(t){var r=t.h/60,n=t.s/100,e=t.v/100,i=f$1(r),a=r-i,h=e*(1-n),s=e*(1-a*n),o=e*(1-(1-a)*n),u=i%6,c=[o,e,e,s,h,h][u],l=[h,h,o,e,e,s][u];return {r:v$1(255*[e,s,h,h,o,e][u],0,255),g:v$1(255*c,0,255),b:v$1(255*l,0,255)}},r.rgbToHsv=function(t){var r=t.r/255,n=t.g/255,e=t.b/255,i=Math.max(r,n,e),a=Math.min(r,n,e),h=i-a,s=0,o=i,u=0===i?0:h/i;switch(i){case a:s=0;break;case r:s=(n-e)/h+(n<e?6:0);break;case n:s=(e-r)/h+2;break;case e:s=(r-n)/h+4;}return {h:60*s%360,s:v$1(100*u,0,100),v:v$1(100*o,0,100)}},r.hsvToHsl=function(t){var r=t.s/100,n=t.v/100,e=(2-r)*n,i=e<=1?e:2-e;return {h:t.h,s:v$1(100*(i<1e-9?0:r*n/i),0,100),l:v$1(50*e,0,100)}},r.hslToHsv=function(t){var r=2*t.l,n=t.s*(r<=100?r:200-r)/100;return {h:t.h,s:v$1(100*(r+n<1e-9?0:2*n/(r+n)),0,100),v:v$1((r+n)/2,0,100)}},r.kelvinToRgb=function(t){var r,n,e,i=t/100;return i<66?(r=255,n=-155.25485562709179-.44596950469579133*(n=i-2)+104.49216199393888*g$1(n),e=i<20?0:.8274096064007395*(e=i-10)-254.76935184120902+115.67994401066147*g$1(e)):(r=351.97690566805693+.114206453784165*(r=i-55)-40.25366309332127*g$1(r),n=325.4494125711974+.07943456536662342*(n=i-50)-28.0852963507957*g$1(n),e=255),{r:v$1(f$1(r),0,255),g:v$1(f$1(n),0,255),b:v$1(f$1(e),0,255)}},r.rgbToKelvin=function(t){for(var n,e=t.r,i=t.b,a=2e3,h=4e4;h-a>.4;){var s=r.kelvinToRgb(n=.5*(h+a));s.b/s.r>=i/e?h=n:a=n;}return n},(n=[{key:"hsv",get:function(){var t=this.$;return {h:t.h,s:t.s,v:t.v}},set:function(r){var n=this.$;if(r=t$1({},n,r),this.onChange){var e={h:!1,v:!1,s:!1,a:!1};for(var i in n){ e[i]=r[i]!=n[i]; }this.$=r,(e.h||e.s||e.v||e.a)&&this.onChange(this,e);}else { this.$=r; }}},{key:"hsva",get:function(){return t$1({},this.$)},set:function(t){this.hsv=t;}},{key:"hue",get:function(){return this.$.h},set:function(t){this.hsv={h:t};}},{key:"saturation",get:function(){return this.$.s},set:function(t){this.hsv={s:t};}},{key:"value",get:function(){return this.$.v},set:function(t){this.hsv={v:t};}},{key:"alpha",get:function(){return this.$.a},set:function(r){this.hsv=t$1({},this.hsv,{a:r});}},{key:"kelvin",get:function(){return r.rgbToKelvin(this.rgb)},set:function(t){this.rgb=r.kelvinToRgb(t);}},{key:"red",get:function(){return this.rgb.r},set:function(r){this.rgb=t$1({},this.rgb,{r:r});}},{key:"green",get:function(){return this.rgb.g},set:function(r){this.rgb=t$1({},this.rgb,{g:r});}},{key:"blue",get:function(){return this.rgb.b},set:function(r){this.rgb=t$1({},this.rgb,{b:r});}},{key:"rgb",get:function(){var t=r.hsvToRgb(this.$),n=t.g,e=t.b;return {r:d$1(t.r),g:d$1(n),b:d$1(e)}},set:function(n){this.hsv=t$1({},r.rgbToHsv(n),{a:void 0===n.a?1:n.a});}},{key:"rgba",get:function(){return t$1({},this.rgb,{a:this.alpha})},set:function(t){this.rgb=t;}},{key:"hsl",get:function(){var t=r.hsvToHsl(this.$),n=t.s,e=t.l;return {h:d$1(t.h),s:d$1(n),l:d$1(e)}},set:function(n){this.hsv=t$1({},r.hslToHsv(n),{a:void 0===n.a?1:n.a});}},{key:"hsla",get:function(){return t$1({},this.hsl,{a:this.alpha})},set:function(t){this.hsl=t;}},{key:"rgbString",get:function(){var t=this.rgb;return "rgb("+t.r+", "+t.g+", "+t.b+")"},set:function(t){var r,n,e,h,s=1;if((r=i$1.exec(t))?(n=b(r[1],255),e=b(r[2],255),h=b(r[3],255)):(r=a$1.exec(t))&&(n=b(r[1],255),e=b(r[2],255),h=b(r[3],255),s=b(r[4],1)),!r){ throw new Error("Invalid rgb string"); }this.rgb={r:n,g:e,b:h,a:s};}},{key:"rgbaString",get:function(){var t=this.rgba;return "rgba("+t.r+", "+t.g+", "+t.b+", "+t.a+")"},set:function(t){this.rgbString=t;}},{key:"hexString",get:function(){var t=this.rgb;return "#"+x$1(t.r)+x$1(t.g)+x$1(t.b)},set:function(t){var r,n,e,i,a=255;if((r=o$1.exec(t))?(n=17*w$1(r[1]),e=17*w$1(r[2]),i=17*w$1(r[3])):(r=u$1.exec(t))?(n=17*w$1(r[1]),e=17*w$1(r[2]),i=17*w$1(r[3]),a=17*w$1(r[4])):(r=c$1.exec(t))?(n=w$1(r[1]),e=w$1(r[2]),i=w$1(r[3])):(r=l.exec(t))&&(n=w$1(r[1]),e=w$1(r[2]),i=w$1(r[3]),a=w$1(r[4])),!r){ throw new Error("Invalid hex string"); }this.rgb={r:n,g:e,b:i,a:a/255};}},{key:"hex8String",get:function(){var t=this.rgba;return "#"+x$1(t.r)+x$1(t.g)+x$1(t.b)+x$1(f$1(255*t.a))},set:function(t){this.hexString=t;}},{key:"hslString",get:function(){var t=this.hsl;return "hsl("+t.h+", "+t.s+"%, "+t.l+"%)"},set:function(t){var r,n,e,i,a=1;if((r=h$1.exec(t))?(n=b(r[1],360),e=b(r[2],100),i=b(r[3],100)):(r=s$1.exec(t))&&(n=b(r[1],360),e=b(r[2],100),i=b(r[3],100),a=b(r[4],1)),!r){ throw new Error("Invalid hsl string"); }this.hsl={h:n,s:e,l:i,a:a};}},{key:"hslaString",get:function(){var t=this.hsla;return "hsl("+t.h+", "+t.s+"%, "+t.l+"%, "+t.a+")"},set:function(t){this.hslString=t;}}])&&function(t,r){for(var n=0;n<r.length;n++){var e=r[n];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e);}}(r.prototype,n),r}(),p$1={sliderShape:"bar",sliderType:"value",minTemperature:2200,maxTemperature:11e3};function k$1(t){var r,n=t.width,e=t.sliderSize,i=t.handleRadius,a=t.padding,h="horizontal"===t.layoutDirection;return e=null!=(r=e)?r:2*a+2*i,"circle"===t.sliderShape?{handleStart:t.padding+t.handleRadius,handleRange:n-2*a-2*i,width:n,height:n,cx:n/2,cy:n/2,radius:n/2-t.borderWidth/2}:{handleStart:e/2,handleRange:n-e,radius:e/2,x:0,y:0,width:h?e:n,height:h?n:e}}function m$1(t,r){var n=r.hsva,e=r.rgb;switch(t.sliderType){case"red":return e.r/2.55;case"green":return e.g/2.55;case"blue":return e.b/2.55;case"alpha":return 100*n.a;case"kelvin":var i=t.minTemperature;return Math.max(0,Math.min((r.kelvin-i)/(t.maxTemperature-i)*100,100));case"hue":return n.h/=3.6;case"saturation":return n.s;case"value":default:return n.v}}function T$1(t,r,n){var e,i=k$1(t),a=i.handleRange,h=i.handleStart;e="horizontal"===t.layoutDirection?-1*n+a+h:r-h,e=Math.max(Math.min(e,a),0);var s=Math.round(100/a*e);switch(t.sliderType){case"kelvin":var o=t.minTemperature;return o+s/100*(t.maxTemperature-o);case"alpha":return s/100;case"hue":return 3.6*s;case"red":case"blue":case"green":return 2.55*s;default:return s}}function R(t,r){var n=k$1(t),e=n.handleRange,i=n.handleStart,a="horizontal"===t.layoutDirection,h=a?n.width/2:n.height/2,s=i+m$1(t,r)/100*e;return a&&(s=-1*s+e+2*i),{x:a?h:s,y:a?s:h}}function S(t,r){var n=r.hsv,e=r.rgb;switch(t.sliderType){case"red":return [[0,"rgb(0,"+e.g+","+e.b+")"],[100,"rgb(255,"+e.g+","+e.b+")"]];case"green":return [[0,"rgb("+e.r+",0,"+e.b+")"],[100,"rgb("+e.r+",255,"+e.b+")"]];case"blue":return [[0,"rgb("+e.r+","+e.g+",0)"],[100,"rgb("+e.r+","+e.g+",255)"]];case"alpha":return [[0,"rgba("+e.r+","+e.g+","+e.b+",0)"],[100,"rgb("+e.r+","+e.g+","+e.b+")"]];case"kelvin":for(var i=[],a=t.minTemperature,h=t.maxTemperature,s=h-a,o=a,u=0;o<h;o+=s/8,u+=1){var c=y.kelvinToRgb(o);i.push([12.5*u,"rgb("+c.r+","+c.g+","+c.b+")"]);}return i;case"hue":return [[0,"#f00"],[16.666,"#ff0"],[33.333,"#0f0"],[50,"#0ff"],[66.666,"#00f"],[83.333,"#f0f"],[100,"#f00"]];case"saturation":var l=y.hsvToHsl({h:n.h,s:0,v:n.v}),g=y.hsvToHsl({h:n.h,s:100,v:n.v});return [[0,"hsl("+l.h+","+l.s+"%,"+l.l+"%)"],[100,"hsl("+g.h+","+g.s+"%,"+g.l+"%)"]];case"value":default:var d=y.hsvToHsl({h:n.h,s:n.s,v:100});return [[0,"#000"],[100,"hsl("+d.h+","+d.s+"%,"+d.l+"%)"]]}}var W,$$1=2*Math.PI,F=function(t,r){return Math.sqrt(t*t+r*r)};function P$1(t){return t.width/2-t.padding-t.handleRadius-t.borderWidth}function D(t,r,n){var e=E(t),i=t.width/2;return F(e.cx-r,e.cy-n)<i}function E(t){var r=t.width/2;return {width:t.width,radius:r-t.borderWidth,cx:r,cy:r}}function I$1(t,r,n){var e=t.wheelAngle,i=t.wheelDirection;return n&&"clockwise"===i?r=e+r:"clockwise"===i?r=360-e+r:n&&"anticlockwise"===i?r=e+180-r:"anticlockwise"===i&&(r=e-r),(r%360+360)%360}function H$1(t,r){var n=r.hsv,e=E(t),i=e.cx,a=e.cy,h=P$1(t),s=(180+I$1(t,n.h,!0))*($$1/360),o=n.s/100*h,u="clockwise"===t.wheelDirection?-1:1;return {x:i+o*Math.cos(s)*u,y:a+o*Math.sin(s)*u}}function z$1(t,r,n){var e=E(t),i=e.cx,a=e.cy,h=P$1(t);r=i-r,n=a-n;var s=I$1(t,Math.atan2(-n,-r)*(360/$$1)),o=Math.min(F(r,n),h);return {h:Math.round(s),s:Math.round(100/h*o)}}function C$1(t){var r=t.width/2,n=7*r/8,e=3*n/2,i=3*n/Math.sqrt(3);return {width:t.width,radius:r-t.borderWidth,trianglePoints:[{x:r,y:r/8},{x:r-i/2,y:r/8+e},{x:r+i/2,y:r/8+e}],cx:r,cy:r}}function j$1(t,r,n){var e=t.wheelAngle,i=t.wheelDirection;return ((r=!n&&"clockwise"===i||n&&"anticlockwise"===i?(n?180:360)-(e-r):e+r)%360+360)%360}function O$1(t,r){var n=r.hsv,e=C$1(t),i=e.radius,a=e.cx,h=e.cy,s=(180+j$1(t,n.h,!0))*(Math.PI/180),o="clockwise"===t.wheelDirection?-1:1;return {x:a+(i-t.padding)*Math.cos(s)*o,y:h+(i-t.padding)*Math.sin(s)*o}}function L$1(t){var r=t.width/2;return {width:t.width,radius:r-t.borderWidth,ringWidth:t.ringWidth||2*(t.padding+t.handleRadius+t.borderWidth),cx:r,cy:r,borderWidth:t.borderWidth}}function K(t,r,n){var e=t.wheelAngle,i=t.wheelDirection;return ((r=!n&&"clockwise"===i||n&&"anticlockwise"===i?(n?180:360)-(e-r):e+r)%360+360)%360}function V(t,r){var n=r.hsv,e=L$1(t),i=e.radius,a=e.cx,h=e.cy,s=(180+K(t,n.h,!0))*(Math.PI/180),o="clockwise"===t.wheelDirection?-1:1,u=t.ringWidth?t.ringWidth:2*(t.padding+t.handleRadius+t.borderWidth);return {x:a+(i-u/2)*Math.cos(s)*o,y:h+(i-u/2)*Math.sin(s)*o}}function B(t,r,n){var e=L$1(t);r=e.cx-r,n=e.cy-n;var i=K(t,Math.atan2(-n,-r)*(180/Math.PI));return {h:Math.round(i)}}function N$1(t){var r=t.width/2,n=t.width*Math.sqrt(3)/2;return {width:t.width,height:n,radius:r-t.borderWidth,trianglePoints:[{x:t.width/2,y:0},{x:0,y:n},{x:t.width,y:n}],cx:r,cy:r,borderWidth:t.borderWidth}}function G(t,r,n){var e=t.wheelAngle,i=t.wheelDirection;return ((r=!n&&"clockwise"===i||n&&"anticlockwise"===i?(n?180:360)-(e-r):e+r)%360+360)%360}function J(t,r){var n=r.hsv,e=N$1(t),i=e.height,a=e.width;return G(t,n.h,!0),{x:a*(1+n.v*(n.s-200)/2e4),y:i*(1-n.s*n.v/1e4)}}function Q(t,r,n){var e,i=N$1(t),a=i.width,h=i.height,s=i.cx,o=i.cy,u=t.rotation?t.rotation*Math.PI/180:0,c=r,l=n;if(t.rotation){var g=Math.sin(-1*u),d=Math.cos(-1*u),f=r-s-g*d*15,v=n-o-g*d*15;c=f*d-v*g,l=f*g+v*d,c+=s,l+=o;}return e=50*(3-l/h-2*c/a),{s:Math.min(100,Math.max(0,Math.round(200*a*(h-l)/(3*h*a-2*h*c-a*l)))),v:Math.min(100,Math.max(0,Math.round(e)))}}function U(t,r){return [[[0,"#fff"],[100,"hsl("+r.hue+",100%,50%)"]],[[0,"rgba(0,0,0,0)"],[100,"#000"]]]}function Y(t){var r=t.width,n=t.boxHeight;return {width:r,height:null!=n?n:r,radius:t.padding+t.handleRadius}}function Z(t,r,n){var e=Y(t),i=e.radius,a=(n-i)/(e.height-2*i)*100;return {s:Math.max(0,Math.min((r-i)/(e.width-2*i)*100,100)),v:Math.max(0,Math.min(100-a,100))}}function _$1(t,r){var n=Y(t),e=n.radius,i=r.hsv,a=n.height-2*e;return {x:e+i.s/100*(n.width-2*e),y:e+(a-i.v/100*a)}}function tt(t,r){return [[[0,"#fff"],[100,"hsl("+r.hue+",100%,50%)"]],[[0,"rgba(0,0,0,0)"],[100,"#000"]]]}function rt(t){W||(W=document.getElementsByTagName("base"));var r=window.navigator.userAgent,n=/^((?!chrome|android).)*safari/i.test(r),e=/iPhone|iPod|iPad/i.test(r),i=window.location;return (n||e)&&W.length>0?i.protocol+"//"+i.host+i.pathname+i.search+t:t}function nt(t,r,n,e,i){var a=i-e<=180?0:1;return e*=Math.PI/180,i*=Math.PI/180,"M "+(t+n*Math.cos(i))+" "+(r+n*Math.sin(i))+" A "+n+" "+n+" 0 "+a+" 0 "+(t+n*Math.cos(e))+" "+(r+n*Math.sin(e))}function et(t,r,n,e){for(var i=0;i<e.length;i++){var a=e[i].x-r,h=e[i].y-n;if(Math.sqrt(a*a+h*h)<t.handleRadius){ return i }}return null}function it(t){return {boxSizing:"border-box",border:t.borderWidth+"px solid "+t.borderColor}}function at(t,r,n){return t+"-gradient("+r+", "+n.map(function(t){return t[1]+" "+t[0]+"%"}).join(",")+")"}function ht(t){return "string"==typeof t?t:t+"px"}var st={width:300,height:300,color:"#fff",colors:[],padding:6,layoutDirection:"vertical",borderColor:"#fff",borderWidth:0,handleRadius:8,activeHandleRadius:null,handleSvg:null,handleProps:{x:0,y:0},wheelLightness:!0,wheelAngle:0,wheelDirection:"anticlockwise",sliderSize:null,sliderMargin:12,boxHeight:null};//# sourceMappingURL=iro-core.es.js.map

  var SECONDARY_EVENTS = ["mousemove" /* MouseMove */, "touchmove" /* TouchMove */, "mouseup" /* MouseUp */, "touchend" /* TouchEnd */];
  // Base component class for iro UI components
  // This extends the Preact component class to allow them to react to mouse/touch input events by themselves
  var IroComponentWrapper = /*@__PURE__*/(function (Component) {
      function IroComponentWrapper(props) {
          Component.call(this, props);
          // Generate unique ID for the component
          // This can be used to generate unique IDs for gradients, etc
          this.uid = (Math.random() + 1).toString(36).substring(5);
      }

      if ( Component ) IroComponentWrapper.__proto__ = Component;
      IroComponentWrapper.prototype = Object.create( Component && Component.prototype );
      IroComponentWrapper.prototype.constructor = IroComponentWrapper;
      IroComponentWrapper.prototype.render = function render (props) {
          var eventHandler = this.handleEvent.bind(this);
          var rootProps = {
              onMouseDown: eventHandler,
              // https://github.com/jaames/iro.js/issues/126
              // https://github.com/preactjs/preact/issues/2113#issuecomment-553408767
              ontouchstart: eventHandler,
          };
          var isHorizontal = props.layoutDirection === 'horizontal';
          var margin = props.margin === null ? props.sliderMargin : props.margin;
          var rootStyles = {
              overflow: 'visible',
              display: isHorizontal ? 'inline-block' : 'block'
          };
          // first component shouldn't have any margin
          if (props.index > 0) {
              rootStyles[isHorizontal ? 'marginLeft' : 'marginTop'] = margin;
          }
          return (h(p, null, props.children(this.uid, rootProps, rootStyles)));
      };
      // More info on handleEvent:
      // https://medium.com/@WebReflection/dom-handleevent-a-cross-platform-standard-since-year-2000-5bf17287fd38
      // TL;DR this lets us have a single point of entry for multiple events, and we can avoid callback/binding hell
      IroComponentWrapper.prototype.handleEvent = function handleEvent (e) {
          var this$1 = this;

          var inputHandler = this.props.onInput;
          // Get the screen position of the component
          var bounds = this.base.getBoundingClientRect();
          // Prefect default browser action
          e.preventDefault();
          // Detect if the event is a touch event by checking if it has the `touches` property
          // If it is a touch event, use the first touch input
          var point = e.touches ? e.changedTouches[0] : e;
          var x = point.clientX - bounds.left;
          var y = point.clientY - bounds.top;
          switch (e.type) {
              case "mousedown" /* MouseDown */:
              case "touchstart" /* TouchStart */:
                  var result = inputHandler(x, y, 0 /* Start */);
                  if (result !== false) {
                      SECONDARY_EVENTS.forEach(function (event) {
                          document.addEventListener(event, this$1, { passive: false });
                      });
                  }
                  break;
              case "mousemove" /* MouseMove */:
              case "touchmove" /* TouchMove */:
                  inputHandler(x, y, 1 /* Move */);
                  break;
              case "mouseup" /* MouseUp */:
              case "touchend" /* TouchEnd */:
                  inputHandler(x, y, 2 /* End */);
                  SECONDARY_EVENTS.forEach(function (event) {
                      document.removeEventListener(event, this$1, { passive: false });
                  });
                  break;
          }
      };

      return IroComponentWrapper;
  }(d));
  //# sourceMappingURL=ComponentWrapper.js.map

  function IroHandle(props) {
      var radius = props.r;
      var url = props.url;
      return (h("svg", { className: ("IroHandle IroHandle--" + (props.index) + " " + (props.isActive ? 'IroHandle--isActive' : '')), style: {
              top: ht(props.y),
              left: ht(props.x),
              width: '1px',
              height: '1px',
              position: 'absolute',
              overflow: 'visible'
          } },
          url && (h("use", Object.assign({ xlinkHref: rt(url) }, props.props))),
          !url && (h("circle", { r: radius, fill: "none", "stroke-width": 2, stroke: "#000" })),
          !url && (h("circle", { r: radius - 2, fill: props.fill, "stroke-width": 2, stroke: "#fff" }))));
  }
  IroHandle.defaultProps = {
      fill: 'none',
      x: 0,
      y: 0,
      r: 8,
      url: null,
      props: { x: 0, y: 0 }
  };
  //# sourceMappingURL=Handle.js.map

  function IroSlider(props) {
      var activeIndex = props.activeIndex;
      var activeColor = (activeIndex !== undefined && activeIndex < props.colors.length) ? props.colors[activeIndex] : props.color;
      var ref = k$1(props);
      var width = ref.width;
      var height = ref.height;
      var radius = ref.radius;
      var handlePos = R(props, activeColor);
      var gradient = S(props, activeColor);
      function handleInput(x, y, type) {
          var value = T$1(props, x, y);
          props.parent.inputActive = true;
          activeColor[props.sliderType] = value;
          props.onInput(type, props.id);
      }
      return (h(IroComponentWrapper, Object.assign({}, props, { onInput: handleInput }), function (uid, rootProps, rootStyles) { return (h("div", Object.assign({}, rootProps, { className: "IroSlider", style: Object.assign({}, {position: 'relative',
              width: ht(width),
              height: ht(height),
              borderRadius: ht(radius),
              // checkered bg to represent alpha
              background: "conic-gradient(#ccc 25%, #fff 0 50%, #ccc 0 75%, #fff 0)",
              backgroundSize: '8px 8px'},
              rootStyles) }),
          h("div", { className: "IroSliderGradient", style: Object.assign({}, {position: 'absolute',
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: ht(radius),
                  background: at('linear', props.layoutDirection === 'horizontal' ? 'to top' : 'to right', gradient)},
                  it(props)) }),
          h(IroHandle, { isActive: true, index: activeColor.index, r: props.handleRadius, url: props.handleSvg, props: props.handleProps, x: handlePos.x, y: handlePos.y }))); }));
  }
  IroSlider.defaultProps = Object.assign({}, p$1);
  //# sourceMappingURL=Slider.js.map

  function IroBox(props) {
      var ref = Y(props);
      var width = ref.width;
      var height = ref.height;
      var radius = ref.radius;
      var colors = props.colors;
      var colorPicker = props.parent;
      var activeIndex = props.activeIndex;
      var activeColor = (activeIndex !== undefined && activeIndex < props.colors.length) ? props.colors[activeIndex] : props.color;
      var gradients = tt(props, activeColor);
      var handlePositions = colors.map(function (color) { return _$1(props, color); });
      function handleInput(x, y, inputType) {
          if (inputType === 0 /* Start */) {
              // getHandleAtPoint() returns the index for the handle if the point 'hits' it, or null otherwise
              var activeHandle = et(props, x, y, handlePositions);
              // If the input hit a handle, set it as the active handle, but don't update the color
              if (activeHandle !== null) {
                  colorPicker.setActiveColor(activeHandle);
              }
              // If the input didn't hit a handle, set the currently active handle to that position
              else {
                  colorPicker.inputActive = true;
                  activeColor.hsv = Z(props, x, y);
                  props.onInput(inputType, props.id);
              }
          }
          // move is fired when the user has started dragging
          else if (inputType === 1 /* Move */) {
              colorPicker.inputActive = true;
              activeColor.hsv = Z(props, x, y);
          }
          // let the color picker fire input:start, input:move or input:end events
          props.onInput(inputType, props.id);
      }
      return (h(IroComponentWrapper, Object.assign({}, props, { onInput: handleInput }), function (uid, rootProps, rootStyles) { return (h("div", Object.assign({}, rootProps, { className: "IroBox", style: Object.assign({}, {width: ht(width),
              height: ht(height),
              position: 'relative'},
              rootStyles) }),
          h("div", { className: "IroBox", style: Object.assign({}, {width: '100%',
                  height: '100%',
                  borderRadius: ht(radius)},
                  it(props),
                  {background: at('linear', 'to bottom', gradients[1])
                      + ',' +
                      at('linear', 'to right', gradients[0])}) }),
          colors.filter(function (color) { return color !== activeColor; }).map(function (color) { return (h(IroHandle, { isActive: false, index: color.index, fill: color.hslString, r: props.handleRadius, url: props.handleSvg, props: props.handleProps, x: handlePositions[color.index].x, y: handlePositions[color.index].y })); }),
          h(IroHandle, { isActive: true, index: activeColor.index, fill: activeColor.hslString, r: props.activeHandleRadius || props.handleRadius, url: props.handleSvg, props: props.handleProps, x: handlePositions[activeColor.index].x, y: handlePositions[activeColor.index].y }))); }));
  }
  //# sourceMappingURL=Box.js.map

  var HUE_GRADIENT_CLOCKWISE = 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)';
  var HUE_GRADIENT_ANTICLOCKWISE = 'conic-gradient(red, magenta, blue, aqua, lime, yellow, red)';
  function IroWheel(props) {
      var ref = E(props);
      var width = ref.width;
      var colors = props.colors;
      var borderWidth = props.borderWidth;
      var colorPicker = props.parent;
      var activeColor = props.color;
      var hsv = activeColor.hsv;
      var handlePositions = colors.map(function (color) { return H$1(props, color); });
      var circleStyles = {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          boxSizing: 'border-box'
      };
      function handleInput(x, y, inputType) {
          if (inputType === 0 /* Start */) {
              // input hitbox is a square,
              // so we want to ignore any initial clicks outside the circular shape of the wheel
              if (!D(props, x, y)) {
                  // returning false will cease all event handling for this interaction
                  return false;
              }
              // getHandleAtPoint() returns the index for the handle if the point 'hits' it, or null otherwise
              var activeHandle = et(props, x, y, handlePositions);
              // If the input hit a handle, set it as the active handle, but don't update the color
              if (activeHandle !== null) {
                  colorPicker.setActiveColor(activeHandle);
              }
              // If the input didn't hit a handle, set the currently active handle to that position
              else {
                  colorPicker.inputActive = true;
                  activeColor.hsv = z$1(props, x, y);
                  props.onInput(inputType, props.id);
              }
          }
          // move is fired when the user has started dragging
          else if (inputType === 1 /* Move */) {
              colorPicker.inputActive = true;
              activeColor.hsv = z$1(props, x, y);
          }
          // let the color picker fire input:start, input:move or input:end events
          props.onInput(inputType, props.id);
      }
      return (h(IroComponentWrapper, Object.assign({}, props, { onInput: handleInput }), function (uid, rootProps, rootStyles) { return (h("div", Object.assign({}, rootProps, { className: "IroWheel", style: Object.assign({}, {width: ht(width),
              height: ht(width),
              position: 'relative'},
              rootStyles) }),
          h("div", { className: "IroWheelHue", style: Object.assign({}, circleStyles,
                  {transform: ("rotateZ(" + (props.wheelAngle + 90) + "deg)"),
                  background: props.wheelDirection === 'clockwise' ? HUE_GRADIENT_CLOCKWISE : HUE_GRADIENT_ANTICLOCKWISE}) }),
          h("div", { className: "IroWheelSaturation", style: Object.assign({}, circleStyles,
                  {background: 'radial-gradient(circle closest-side, #fff, transparent)'}) }),
          props.wheelLightness && (h("div", { className: "IroWheelLightness", style: Object.assign({}, circleStyles,
                  {background: '#000',
                  opacity: 1 - hsv.v / 100}) })),
          h("div", { className: "IroWheelBorder", style: Object.assign({}, circleStyles,
                  it(props)) }),
          colors.filter(function (color) { return color !== activeColor; }).map(function (color) { return (h(IroHandle, { isActive: false, index: color.index, fill: color.hslString, r: props.handleRadius, url: props.handleSvg, props: props.handleProps, x: handlePositions[color.index].x, y: handlePositions[color.index].y })); }),
          h(IroHandle, { isActive: true, index: activeColor.index, fill: activeColor.hslString, r: props.activeHandleRadius || props.handleRadius, url: props.handleSvg, props: props.handleProps, x: handlePositions[activeColor.index].x, y: handlePositions[activeColor.index].y }))); }));
  }
  //# sourceMappingURL=Wheel.js.map

  function createWidget(WidgetComponent) {
      var widgetFactory = function (parent, props) {
          var widget; // will become an instance of the widget component class
          var widgetRoot = document.createElement('div');
          // Render widget into a temp DOM node
          O(h(WidgetComponent, Object.assign({}, {ref: function (ref) { return widget = ref; }},
              props)), widgetRoot);
          function mountWidget() {
              var container = parent instanceof Element ? parent : document.querySelector(parent);
              container.appendChild(widget.base);
              widget.onMount(container);
          }
          // Mount it into the DOM when the page document is ready
          if (document.readyState !== 'loading') {
              mountWidget();
          }
          else {
              document.addEventListener('DOMContentLoaded', mountWidget);
          }
          return widget;
      };
      // Allow the widget factory to inherit component prototype + static class methods
      // This makes it easier for plugin authors to extend the base widget component
      widgetFactory.prototype = WidgetComponent.prototype;
      Object.assign(widgetFactory, WidgetComponent);
      // Add reference to base component too
      widgetFactory.__component = WidgetComponent;
      return widgetFactory;
  }
  //# sourceMappingURL=createWidget.js.map

  var IroColorPicker = /*@__PURE__*/(function (Component) {
      function IroColorPicker(props) {
          var this$1 = this;

          Component.call(this, props);
          this.colors = [];
          this.inputActive = false;
          this.events = {};
          this.activeEvents = {};
          this.deferredEvents = {};
          this.id = props.id;
          var colors = props.colors.length > 0 ? props.colors : [props.color];
          colors.forEach(function (colorValue) { return this$1.addColor(colorValue); });
          this.setActiveColor(0);
          // Pass all the props into the component's state,
          // Except we want to add the color object and make sure that refs aren't passed down to children
          this.state = Object.assign({}, props,
              {color: this.color,
              colors: this.colors,
              layout: props.layout});
      }

      if ( Component ) IroColorPicker.__proto__ = Component;
      IroColorPicker.prototype = Object.create( Component && Component.prototype );
      IroColorPicker.prototype.constructor = IroColorPicker;
      // Plubic multicolor API
      /**
      * @desc Add a color to the color picker
      * @param color new color to add
      * @param index optional color index
      */
      IroColorPicker.prototype.addColor = function addColor (color, index) {
          if ( index === void 0 ) index = this.colors.length;

          // Create a new iro.Color
          // Also bind it to onColorChange, so whenever the color changes it updates the color picker
          var newColor = new y(color, this.onColorChange.bind(this));
          // Insert color @ the given index
          this.colors.splice(index, 0, newColor);
          // Reindex colors
          this.colors.forEach(function (color, index) { return color.index = index; });
          // Update picker state if necessary
          if (this.state) {
              this.setState({ colors: this.colors });
          }
          // Fire color init event
          this.deferredEmit('color:init', newColor);
      };
      /**
       * @desc Remove a color from the color picker
       * @param index color index
       */
      IroColorPicker.prototype.removeColor = function removeColor (index) {
          var color = this.colors.splice(index, 1)[0];
          // Destroy the color object -- this unbinds it from the color picker
          color.unbind();
          // Reindex colors
          this.colors.forEach(function (color, index) { return color.index = index; });
          // Update picker state if necessary
          if (this.state) {
              this.setState({ colors: this.colors });
          }
          // If the active color was removed, default active color to 0
          if (color.index === this.color.index) {
              this.setActiveColor(0);
          }
          // Fire color remove event
          this.emit('color:remove', color);
      };
      /**
       * @desc Set the currently active color
       * @param index color index
       */
      IroColorPicker.prototype.setActiveColor = function setActiveColor (index) {
          this.color = this.colors[index];
          if (this.state) {
              this.setState({ color: this.color });
          }
          // Fire color switch event
          this.emit('color:setActive', this.color);
      };
      /**
       * @desc Replace all of the current colorPicker colors
       * @param newColorValues list of new colors to add
       */
      IroColorPicker.prototype.setColors = function setColors (newColorValues, activeColorIndex) {
          var this$1 = this;
          if ( activeColorIndex === void 0 ) activeColorIndex = 0;

          // Unbind color events
          this.colors.forEach(function (color) { return color.unbind(); });
          // Destroy old colors
          this.colors = [];
          // Add new colors
          newColorValues.forEach(function (colorValue) { return this$1.addColor(colorValue); });
          // Reset active color
          this.setActiveColor(activeColorIndex);
          this.emit('color:setAll', this.colors);
      };
      // Public ColorPicker events API
      /**
       * @desc Set a callback function for an event
       * @param eventList event(s) to listen to
       * @param callback - Function called when the event is fired
       */
      IroColorPicker.prototype.on = function on (eventList, callback) {
          var this$1 = this;

          var events = this.events;
          // eventList can be an eventType string or an array of eventType strings
          (!Array.isArray(eventList) ? [eventList] : eventList).forEach(function (eventType) {
              // Add event callback
              (events[eventType] || (events[eventType] = [])).push(callback);
              // Call deferred events
              // These are events that can be stored until a listener for them is added
              if (this$1.deferredEvents[eventType]) {
                  // Deffered events store an array of arguments from when the event was called
                  this$1.deferredEvents[eventType].forEach(function (args) {
                      callback.apply(null, args);
                  });
                  // Clear deferred events
                  this$1.deferredEvents[eventType] = [];
              }
          });
      };
      /**
       * @desc Remove a callback function for an event added with on()
       * @param eventList - event(s) to listen to
       * @param callback - original callback function to remove
       */
      IroColorPicker.prototype.off = function off (eventList, callback) {
          var this$1 = this;

          (!Array.isArray(eventList) ? [eventList] : eventList).forEach(function (eventType) {
              var callbackList = this$1.events[eventType];
              // this.emitHook('event:off', eventType, callback);
              if (callbackList)
                  { callbackList.splice(callbackList.indexOf(callback), 1); }
          });
      };
      /**
       * @desc Emit an event
       * @param eventType event to emit
       */
      IroColorPicker.prototype.emit = function emit (eventType) {
          var this$1 = this;
          var args = [], len = arguments.length - 1;
          while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

          var activeEvents = this.activeEvents;
          var isEventActive = activeEvents.hasOwnProperty(eventType) ? activeEvents[eventType] : false;
          // Prevent event callbacks from firing if the event is already active
          // This stops infinite loops if something in an event callback causes the same event to be fired again
          // (e.g. setting the color inside a color:change callback)
          if (!isEventActive) {
              activeEvents[eventType] = true;
              var callbackList = this.events[eventType] || [];
              callbackList.forEach(function (fn) { return fn.apply(this$1, args); });
              activeEvents[eventType] = false;
          }
      };
      /**
       * @desc Emit an event now, or save it for when the relevent event listener is added
       * @param eventType - The name of the event to emit
       */
      IroColorPicker.prototype.deferredEmit = function deferredEmit (eventType) {
          var ref;

          var args = [], len = arguments.length - 1;
          while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
          var deferredEvents = this.deferredEvents;
          (ref = this).emit.apply(ref, [ eventType ].concat( args ));
          (deferredEvents[eventType] || (deferredEvents[eventType] = [])).push(args);
      };
      // Public utility methods
      IroColorPicker.prototype.setOptions = function setOptions (newOptions) {
          this.setState(newOptions);
      };
      /**
       * @desc Resize the color picker
       * @param width - new width
       */
      IroColorPicker.prototype.resize = function resize (width) {
          this.setOptions({ width: width });
      };
      /**
       * @desc Reset the color picker to the initial color provided in the color picker options
       */
      IroColorPicker.prototype.reset = function reset () {
          this.colors.forEach(function (color) { return color.reset(); });
          this.setState({ colors: this.colors });
      };
      /**
       * @desc Called by the createWidget wrapper when the element is mounted into the page
       * @param container - the container element for this ColorPicker instance
       */
      IroColorPicker.prototype.onMount = function onMount (container) {
          this.el = container;
          this.deferredEmit('mount', this);
      };
      // Internal methods
      /**
       * @desc React to a color update
       * @param color - current color
       * @param changes - shows which h,s,v,a color channels changed
       */
      IroColorPicker.prototype.onColorChange = function onColorChange (color, changes) {
          this.setState({ color: this.color });
          if (this.inputActive) {
              this.inputActive = false;
              this.emit('input:change', color, changes);
          }
          this.emit('color:change', color, changes);
      };
      /**
       * @desc Handle input from a UI control element
       * @param type - event type
       */
      IroColorPicker.prototype.emitInputEvent = function emitInputEvent (type, originId) {
          if (type === 0 /* Start */) {
              this.emit('input:start', this.color, originId);
          }
          else if (type === 1 /* Move */) {
              this.emit('input:move', this.color, originId);
          }
          else if (type === 2 /* End */) {
              this.emit('input:end', this.color, originId);
          }
      };
      IroColorPicker.prototype.render = function render (props, state) {
          var this$1 = this;

          var layout = state.layout;
          // use layout shorthands
          if (!Array.isArray(layout)) {
              switch (layout) {
                  // TODO: implement some?
                  default:
                      layout = [
                          { component: IroWheel },
                          { component: IroSlider } ];
              }
              // add transparency slider to the layout
              if (state.transparency) {
                  layout.push({
                      component: IroSlider,
                      options: {
                          sliderType: 'alpha'
                      }
                  });
              }
          }
          return (h("div", { class: "IroColorPicker", id: state.id, style: {
                  display: state.display
              } }, layout.map(function (ref, componentIndex) {
                  var UiComponent = ref.component;
                  var options = ref.options;

                  return (h(UiComponent, Object.assign({}, state, options, { ref: undefined, onInput: this$1.emitInputEvent.bind(this$1), parent: this$1, index: componentIndex })));
          })));
      };

      return IroColorPicker;
  }(d));
  IroColorPicker.defaultProps = Object.assign({}, st,
      {colors: [],
      display: 'block',
      id: null,
      layout: 'default',
      margin: null});
  var IroColorPickerWidget = createWidget(IroColorPicker);
  //# sourceMappingURL=ColorPicker.js.map

  var HUE_STEPS = Array.apply(null, { length: 360 }).map(function (_, index) { return index; });
  function IroHueRing(props) {
      var ref = L$1(props);
      var width = ref.width;
      var radius = ref.radius;
      var cx = ref.cx;
      var cy = ref.cy;
      var ringWidth = ref.ringWidth;
      var borderWidth = ref.borderWidth;
      var colors = props.colors;
      var colorPicker = props.parent;
      var activeColor = props.color;
      var handlePositions = colors.map(function (color) { return V(props, color); });
      console.log(handlePositions[activeColor.index]);
      function handleInput(x, y, inputType) {
          if (inputType === 0 /* Start */) {
              // getHandleAtPoint() returns the index for the handle if the point 'hits' it, or null otherwise
              var activeHandle = et(props, x, y, handlePositions);
              // If the input hit a handle, set it as the active handle, but don't update the color
              if (activeHandle !== null) {
                  colorPicker.setActiveColor(activeHandle);
              }
              // If the input didn't hit a handle, set the currently active handle to that position
              else {
                  colorPicker.inputActive = true;
                  activeColor.hsv = B(props, x, y);
                  props.onInput(inputType, props.id);
              }
          }
          // move is fired when the user has started dragging
          else if (inputType === 1 /* Move */) {
              colorPicker.inputActive = true;
              activeColor.hsv = B(props, x, y);
          }
          // let the color picker fire input:start, input:move or input:end events
          props.onInput(inputType, props.id);
      }
      return (h(IroComponentWrapper, Object.assign({}, props, { onInput: handleInput }), function (uid, rootProps, rootStyles) { return (h("div", Object.assign({}, rootProps, { className: "IroHueRing", width: width, height: width, style: Object.assign({}, rootStyles, {position: "relative"}) }),
          h("svg", { className: "IroHueRingSvg", width: width, height: width, style: rootStyles },
              h("g", { className: "IroHueRingGroup", "stroke-width": ringWidth, fill: "none" }, HUE_STEPS.map(function (angle) { return (h("path", { key: angle, d: nt(cx, cy, radius - ringWidth / 2, angle, angle + 1.5), stroke: ("hsl(" + (K(props, angle)) + ", 100%, 50%)") })); })),
              h("circle", { className: "IroHueRingBorder", cx: cx, cy: cy, r: radius, fill: "none", stroke: props.borderColor, "stroke-width": borderWidth }),
              h("circle", { className: "IroHueRingBorder", cx: cx, cy: cy, r: radius - ringWidth, fill: "none", stroke: props.borderColor, "stroke-width": borderWidth })),
          h(IroHandle, { isActive: true, index: activeColor.index, fill: ("hsl(" + (activeColor.hsl.h) + ", 100%, 50%)"), r: props.activeHandleRadius || props.handleRadius, url: props.handleSvg, props: props.handleProps, x: handlePositions[activeColor.index].x, y: handlePositions[activeColor.index].y }))); }));
  }

  function IroTriangle(props) {
      var ref = N$1(props);
      var width = ref.width;
      var trianglePoints = ref.trianglePoints;
      var colors = props.colors;
      var colorPicker = props.parent;
      var activeColor = props.color;
      var gradients = U(props, activeColor);
      var handlePositions = colors.map(function (color) { return J(props, color); });
      var trianglePointsString = "\n           " + (trianglePoints[0].x) + " " + (trianglePoints[0].y) + ",\n           " + (trianglePoints[1].x) + " " + (trianglePoints[1].y) + ",\n           " + (trianglePoints[2].x) + " " + (trianglePoints[2].y) + "\n         ";
      function handleInput(x, y, inputType) {
          if (inputType === 0 /* Start */) {
              // getHandleAtPoint() returns the index for the handle if the point 'hits' it, or null otherwise
              var activeHandle = et(props, x, y, handlePositions);
              // If the input hit a handle, set it as the active handle, but don't update the color
              if (activeHandle !== null) {
                  colorPicker.setActiveColor(activeHandle);
              }
              // If the input didn't hit a handle, set the currently active handle to that position
              else {
                  colorPicker.inputActive = true;
                  activeColor.hsv = Q(props, x, y);
                  props.onInput(inputType, props.id);
              }
          }
          // move is fired when the user has started dragging
          else if (inputType === 1 /* Move */) {
              colorPicker.inputActive = true;
              activeColor.hsv = Q(props, x, y);
          }
          // let the color picker fire input:start, input:move or input:end events
          props.onInput(inputType, props.id);
      }
      return (h(IroComponentWrapper, Object.assign({}, props, { onInput: handleInput }), function (uid, rootProps, rootStyles) { return (h("div", Object.assign({}, rootProps, { className: "IroWheel", width: width, height: width, style: Object.assign({}, rootStyles, {position: "relative", borderRadius: "50%", transform: ("rotate(" + (props.rotation) + "deg)"), transformOrigin: ((props.width / 2) + "px " + ((props.width * Math.sqrt(3) / 3) * 1) + "px")}) }),
          h("svg", { width: width, height: width },
              h("defs", null,
                  h("linearGradient", { id: 's' + uid, x1: "0%", y1: "86%", x2: "0%", y2: "0%", gradientTransform: "rotate(0)" }, gradients[0].map(function (ref) {
                      var offset = ref[0];
                      var color = ref[1];

                      return (h("stop", { offset: (offset + "%"), "stop-color": color }));
          })),
                  h("linearGradient", { id: 'l' + uid, x1: "0%", y1: "45%", x2: "0%", y2: "130%", gradientTransform: "rotate(-60)" }, gradients[1].map(function (ref) {
                      var offset = ref[0];
                      var color = ref[1];

                      return (h("stop", { offset: (offset + "%"), "stop-color": color }));
          })),
                  h("pattern", { id: 'f' + uid, width: "100%", height: "100%" },
                      h("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: ("url(" + (rt('#s' + uid)) + ")") }),
                      h("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: ("url(" + (rt('#l' + uid)) + ")") }))),
              h("polygon", { points: trianglePointsString, fill: ("url(" + (rt('#f' + uid)) + ")"), "stroke-width": props.borderWidth, stroke: props.borderColor })),
          h(IroHandle, { isActive: true, index: activeColor.index, fill: activeColor.hslString, r: props.activeHandleRadius || props.handleRadius, url: props.handleSvg, props: props.handleProps, x: handlePositions[activeColor.index].x, y: handlePositions[activeColor.index].y }))); }));
  }
  //# sourceMappingURL=Triangle.js.map

  var HUE_STEPS$1 = Array.apply(null, { length: 360 }).map(function (_, index) { return index; });
  function IroTriangleWheel(props) {
      var ref = C$1(props);
      var trianglePoints = ref.trianglePoints;
      var colors = props.colors;
      var borderWidth = props.borderWidth;
      var colorPicker = props.parent;
      var activeColor = props.color;
      var hsv = activeColor.hsv;
      var gradients = U(props, activeColor);
      var handlePositions = colors.map(function (color) { return O$1(props, color); });
      var trianglePointsString = "\n           " + (trianglePoints[0].x) + " " + (trianglePoints[0].y) + ",\n           " + (trianglePoints[1].x) + " " + (trianglePoints[1].y) + ",\n           " + (trianglePoints[2].x) + " " + (trianglePoints[2].y) + "\n         ";
      var ref$1 = L$1(props);
      var width = ref$1.width;
      var ringWidth = ref$1.ringWidth;
      var dWidth = 2 * ringWidth + 4 * borderWidth;
      return (h("div", { style: { position: "relative", display: "inline-block" } },
          h(IroHueRing, Object.assign({}, props)),
          h("div", { style: { position: "absolute",
                  left: dWidth / 2 + (width - dWidth - (width - dWidth) * 1.5 / Math.sqrt(3)) / 2,
                  top: dWidth / 2,
                  right: dWidth / 2,
                  bottom: dWidth / 2,
                  borderRadius: "50%",
              } },
              h(IroTriangle, Object.assign({}, props, { width: (width - dWidth) * 1.5 / Math.sqrt(3), rotation: 180 + hsv.h })))));
  }

  var iro;
  (function (iro) {
      iro.version = "5.5.0"; // replaced by @rollup/plugin-replace; see rollup.config.js
      iro.Color = y;
      iro.ColorPicker = IroColorPickerWidget;
      var ui;
      (function (ui) {
          ui.h = h;
          ui.ComponentBase = IroComponentWrapper;
          ui.Handle = IroHandle;
          ui.Slider = IroSlider;
          ui.Wheel = IroWheel;
          ui.TriangleWheel = IroTriangleWheel;
          ui.HueRing = IroHueRing;
          ui.Triangle = IroTriangle;
          ui.Box = IroBox;
      })(ui = iro.ui || (iro.ui = {}));
  })(iro || (iro = {}));
  var iro$1 = iro;

  return iro$1;

})));
//# sourceMappingURL=iro.js.map
