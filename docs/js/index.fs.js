!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/assets/",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);const o=new Array,r=new Array;let s="";const l=e=>null!=e&&null!=e.localName&&"input"===e.localName,i=e=>e.style.display="none",c=e=>e.style.display="block";let a=window.localStorage,d=document,u="reg";const m={},g=e=>m[e],p=e=>{if(l(e)){return e.value}return e.innerText},f=(e,t)=>{if(null!=e){if(l(e)){e.value=t}e.innerText=t,L(e,w)}else console.error("Cannot set "+t+" as element is null")},y=e=>null==e?"":e.getAttribute("name")||"";function h(e){const t=y(e);if(""===t)return console.error("NO name in element !!!!? ",e),m;const n=g(t),o={currentValue:p(e),elements:[e]},r=n||o;r.currentValue=p(e),r.elements=r.elements.map(e=>(f(e,r.currentValue),e)),r.elements.find(t=>t.id===e.id)||r.elements.push(e),m[t]=r;const s={};Object.keys(m).forEach(e=>{s[e]=m[e].currentValue});const l=JSON.stringify(s);return a.setItem(u,l),m}function I(e=Array(),t="reg"){u=t,i(d.getElementsByTagName("BODY")[0]);for(const e in m)delete m[e];M();const n=e.map(e=>e(V)),o=d.querySelectorAll("*");let r=new Array;o.forEach(e=>{r=O(e,n,r)}),console.log("Detected....."),r.forEach(e=>console.log(e.name+" - "+e.qty)),console.log("............."),c(d.getElementsByTagName("BODY")[0])}const v=new Map,w=new Map,E=new Map,M=()=>{console.log("Binder getting data from '"+u+"' in local storage");const e=a.getItem(u);if(k(),e)try{const t=JSON.parse(e);Object.keys(t).forEach(e=>m[e]={currentValue:t[e],elements:[]})}catch(t){console.error("cannot parse",e),console.error(typeof e),console.error(t)}},b=(e,t)=>{if(null==e.target)return;const n=e.target;L(n,t)},L=(e,t)=>{const n=e.id,o=t.get(n);null!=o&&o.forEach(t=>t(e))},B=(e,t,n=v)=>{const o=n.get(e),r=o||new Array;r.push(t),n.set(e,r)},k=()=>{d.addEventListener("change",e=>b(e,v)),d.addEventListener("onpaste",e=>b(e,v)),d.addEventListener("keyup",e=>b(e,v)),d.addEventListener("onin",e=>b(e,v)),d.addEventListener("statechange",e=>b(e,w)),d.addEventListener("click",e=>((e,t)=>{if(null==e.target)return;const n=e.target.id,o=t.get(n);null!=o?o(e):console.error("ACTION: no action for "+n)})(e,E))},A=(e,t=new Array)=>{if(e.id?-1===t.indexOf(e.id)&&t.push(e.id):console.error("no id, no click listener",e),0===e.childNodes.length)return t;for(var n=0,o=e.childNodes.length;n<o;n++){const o=e.childNodes[n];o instanceof HTMLElement&&(t=A(o,t))}return t},x=(e,t)=>{const n=e.findIndex(e=>e.name===t);if(-1===n)return e.push({name:t,qty:1}),e;const o={name:t,qty:e[n].qty+1};return e[n]=o,e},O=(e,t=Array(),n)=>{if(null==e)return n;n=((e,t)=>(0===t.length&&x(e,"total"),t.forEach(t=>{const n=t.attributes[0];x(e,n)}),e))(n,P(e,t));for(var o=0,r=e.childNodes.length;o<r;o++){const r=e.childNodes[o];if(r instanceof HTMLElement)return O(r,t,n)}return n},T=(e,t)=>{if(e.id&&void 0!==e.id)return e;const n=D(t," ","-"),r=D(n,",","-")+"-"+o.length;e.id=r;const s=l(e)?"input":"None input";return console.error("No id for "+s+" element so, generating one: ",e.id),e},N=e=>{const t=s+"";return s=e,t},V={put:h,get:g,getValue:p,setValue:f,clickListener:(e,t,n=[])=>{const o=e=>{(e=>0===e.length?(console.log("No mode list set"),!0):0===s.length?(console.log("No mode set"),!0):e.indexOf(s)>-1?(console.log("Mode in list"),!0):(console.warn("'"+s+"' is not in mode list ",e),!1))(n)&&t(e)};A(e).filter(e=>!E.has(e)).forEach(e=>E.set(e,o))},stateListener:(e,t)=>{B(e,e=>t(e),w)},fixID:T},D=(e,t,n)=>e.split(t).join(n),P=(e,t=Array())=>{const n=y(e);return n&&(T(e,n),C(e,n)),((e,t)=>e.filter(e=>((e,t)=>void 0!==e.attributes.find(e=>t.hasAttribute(e)))(e,t)))(t,e).filter(t=>{const n=t.attributes.map(t=>e.getAttribute(t)).find(e=>null!=e)||"",o=n||t.attributes[0];return T(e,o),S(e,t,o)})},S=(e,t,n)=>{if(r.some(n=>n===e.id+"::"+t.attributes[0]))return!1;return r.push(e.id+"::"+t.attributes[0]),t.process(e,n)},C=(e,t)=>!o.some(t=>t===e.id)&&(o.push(e.id),j(e,t),l(e)&&((e,t)=>{B(e.id,e=>t(e))})(e,e=>h(e)),!0),j=(e,t)=>{const n=g(t);(n?n.elements:[]).push(e);const o=n?n.currentValue:p(e);f(e,o),h(e)},W=new Array;let F;const Y=(e,t)=>n=>{console.log(n.id+" ACTION clicked"),null==F&&(F=((e,t)=>{const n=W.map(e=>e+"-"+t.dataIDpostFix).map(e=>document.getElementById(e)).filter(t=>{if(null==t)return!1;const n=e.getValue(t);return console.log("VALUE IS ------"+n+"======"),null!=n&&n.length>0});return console.log("FOUND ",n),0===n.length?null:n[0]})(e,t));const o=n.id+"-"+t.dataIDpostFix,r=document.getElementById(o);null!=r?(console.log(o+", element is ",r),e.setValue(r,t.data),e.put(r),null!=F&&(e.setValue(F,""),e.put(F)),F=r):console.error("Swap move action - "+o+" does not exist in DOM?!")},J=(e,t,n)=>{-1===W.indexOf(n)&&W.push(n);const o=Y(e,t);return{id:t.actionID,callback:o}};let q=window.localStorage;let U,H=document;const _=new Array,R=new Array,$=(e,t)=>{const n=(e=>{if(null!=e.getAttribute("swapper-action"))return!1;const t=e.getAttribute("swapper");return null!=t&&t})(t);n&&R.filter(e=>e.group===n).forEach(n=>{(e=>{_.push(e)})(J(e,n,t.id))})},G=(e,t)=>{const n=q.getItem("swap-"+t);if(null==q.getItem("swap-action-"+t)&&null==n)return void((e,t)=>{e.classList.add("swap-selected"),q.setItem("swap-action-"+t,e.id)})(e,t);if(q.removeItem("swap-action-"+t),null==n)return void console.log("Nothing selected for action yet");q.removeItem("swap-"+t),e.classList.remove("swap-selected");const o=H.getElementById(n);if(null==o)return void console.error(n+" is missing??");o.classList.remove("swap-selected");const r=_.find(t=>t.id===e.id);null!=r?r.callback(o):console.error("No id action registered for "+e.id)},K=e=>{const t=e.getAttribute("swapper");if(null==t)return void(e=>{const t=e.getAttribute("swapper-action");null!=t?G(e,t):console.error("swapper action has no group? ",e)})(e);const n=q.getItem("swap-"+t);if(!n)return void((e,t)=>{e.classList.add("swap-selected"),q.setItem("swap-"+t,e.id);const n=q.getItem("swap-action-"+t);if(null==n)return;const o=H.getElementById(n);null!=o?G(o,t):console.error(n+" action is missing??")})(e,t);q.removeItem("swap-"+t);const o=H.getElementById(n);if(null==o)return void console.error(n+" is missing ???!");if(o.classList.remove("swap-selected"),n===e.id)return void console.error("what are you doing swap with itself???!");const r=U.getValue(o)+"",s=U.getValue(e);s!==r?(U.setValue(e,r+""),U.setValue(o,s+""),U.put(e),U.put(o)):console.log("Don't swap to itself '"+s+"'")};let X;const z=e=>{const t=(e.getAttribute("toggle")||"").split(/,/).map(e=>e.trim()),n=X.getValue(e),o=t.map((e,t)=>{return e.trim()===n&&t}).find(e=>!1!==e);if(void 0===o)return console.error("Cannot find element with value '"+n+"'"),X.setValue(e,t[0]),void X.put(e);const r=t.length>o+1?o+1:0;X.setValue(e,t[r]),X.put(e)};let Q=document;const Z={},ee=(e,t,n)=>(e.clickListener(n,()=>te(t)),!0),te=e=>{Z[e].forEach(e=>re(e))},ne=(e,t)=>{const n=Z[e],o=void 0===n?[]:n;o.push(t),Z[e]=o},oe=()=>{var e=Q.createElement("style");e.type="text/css",e.innerHTML=".hide { display: none; } ",Q.getElementsByTagName("head")[0].appendChild(e)},re=e=>{e.classList.contains("hide")?e.classList.remove("hide"):e.classList.add("hide")};let se=document;const le=(e,t)=>{const n=se.getElementById(t);return null==n?ie(e,t):e.getValue(n)},ie=(e,t)=>{const n=e.get(t);return null==n?null:n.currentValue},ce=()=>{var e=se.createElement("style");e.type="text/css",e.innerHTML=".hide { display: none; } ",se.getElementsByTagName("head")[0].appendChild(e)},ae=e=>null!=e&&(null!=e&&e.trim().length>0),de=(e,t)=>{console.log(e.id+" >>",t,"<< "+ae(t)),ae(t)?(console.log("IFP - removing "+e.id+" hiding"),e.classList.remove("hide")):(console.log("IFP - "+e.id+" hiding"),e.classList.add("hide")),console.log("")};const ue=(e,t,n)=>()=>{const o=parseInt(t.innerText)+1;o>59?ge(e,t,n):t.innerText=o<10?`0${o}`:o},me=(e,t)=>()=>{t.innerText="00",t.classList.remove("red"),e.innerText="00",e.classList.remove("red")};const ge=(e,t,n)=>{t.innerText=0;const o=parseInt(e.innerText)+1;o<n?e.innerText="0"+o:(e.innerText=pe(o),t.classList.add("red"),e.classList.add("red"))},pe=e=>e<10?"0"+e:e;let fe=[];const ye=e=>(t,n="score")=>{const o=e.getElementById(n);o.innerText=parseInt(o.innerText)+t},he=(e,t,n=1)=>{if(n<1?t.element.classList.add("crossout"):t.element.classList.remove("crossout"),null==t.state)return;e(n,"concide"===t.state?"vrsScore":"score")},Ie=e=>t=>{t.crossedOut=!t.crossedOut;const n=t.crossedOut?-1:1;he(e,t,n)},ve=(e,t)=>{const n=fe.find(t=>t.detail===e);n.element.innerText=""+t,n.detail=""+t};const we=(e,t,n,o)=>r=>{r.time=function(e=new Date){return`${pe(e.getHours())}:${pe(e.getMinutes())}:${pe(e.getSeconds())}`}();const s=e.createElement("div");s.createName="time",s.classList.add("result"),s.innerText=r.time;const l=e.createElement("div");l.createName="result",l.classList.add("result"),l.innerText=r.detail,r.element=l;const i=e.createElement("button");return i.createName="deleteToggle",i.classList.add("result"),i.innerText="X",i.addEventListener("click",()=>n(r)),r.id=fe.length,r.crossedOut=!1,t.appendChild(s),t.appendChild(l),t.appendChild(i),fe.push(r),null!=r.state&&he(o,r,1),r},Ee=e=>()=>{const t=new Date;let n="";fe.filter(e=>!e.crossedOut).forEach(e=>{n=n+e.time+", "+e.detail+"\n"});const o=t+".csv",r=new Blob([n],{type:"csv"});if(window.navigator.msSaveOrOpenBlob)return void window.navigator.msSaveOrOpenBlob(r,o);const s=e.createElement("a"),l=URL.createObjectURL(r);s.href=l,s.download=o,e.body.appendChild(s),s.click(),setTimeout(()=>{e.body.removeChild(s),window.URL.revokeObjectURL(l)},0)};let Me=window.localStorage,be=document;const Le=new Array,Be="swap-parent-id-for-",ke=new Array,Ae=new Array;const xe=(e,t)=>{const n=Te(e,t);if(!n)return!1;const o={currentParentID:n,originParentID:n},r=Me.getItem(Be+e.id);if(r){const t=JSON.parse(r);return Oe(e,t),t}return o},Oe=(e,t)=>{const n=Le.findIndex(e=>t.originParentID===e.pids.originParentID||t.currentParentID===e.pids.originParentID||t.originParentID===e.pids.currentParentID||t.currentParentID===e.pids.currentParentID);if(-1===n)return void Le.push({element:e,pids:t});const o=Le.splice(n,1);Ne(e),Ne(o[0].element)},Te=(e,t)=>{const n=e.parentElement;return null!=n&&t.fixID(n,Be+e.id).id},Ne=e=>{const t=e.getAttribute("swap");if(null==t)return void De(e);const n="swapall"+t,o=Me.getItem(n);if(!o)return void Ce(e,t,n);Me.removeItem(n);const r=be.getElementById(o);if(null==r)return void console.error(o+" is missing ???!");if(r.classList.remove("swap-selected"),o===e.id)return void console.error("what are you doing swap with itself???!");const s=r.parentElement,l=e.parentElement;l&&s&&(l.removeChild(e),s.removeChild(r),l.appendChild(r),s.appendChild(e),Ve(r,l.id),Ve(e,s.id))},Ve=(e,t)=>{const n=Be+e.id,o=Me.getItem(n);if(null==o)return!1;const r=JSON.parse(o);r.currentParentID=t,r.originParentID===r.currentParentID?Me.removeItem(n):Me.setItem(n,JSON.stringify(r))},De=e=>{const t=e.getAttribute("swap-action");null!=t?Pe(e,t):console.error("swap action has no group? ",e)},Pe=(e,t)=>{const n=Me.getItem("swap-action-"+t),o="swapall"+t,r=Me.getItem(o);if(null==n&&null==r)return void((e,t)=>{e.classList.add("swap-selected"),Me.setItem("swap-action-"+t,e.id)})(e,t);if(Me.removeItem("swap-action-"+t),null==r)return void console.log("Nothing selected for action yet");Me.removeItem(o),e.classList.remove("swap-selected");const s=be.getElementById(r);if(null==s)return void console.error(r+" is missing??");s.classList.remove("swap-selected");const l=ke.find(t=>t.id===e.id);null!=l?l.callback(s):console.error("No id action registered for "+e.id)},Se=(e,t)=>{const n=(e=>{if(null!=e.getAttribute("swap-action"))return!1;const t=e.getAttribute("swap");return null!=t&&t})(t);n&&Ae.filter(e=>e.group===n).forEach(n=>{(e=>ke.push(e))(J(e,n,t.id))})},Ce=(e,t,n)=>{e.classList.add("swap-selected"),Me.setItem(n,e.id);const o=Me.getItem("swap-action-"+t);if(null==o)return;const r=be.getElementById(o);null!=r?Pe(r,t):console.error(o+" action is missing??")};(e=>Ae.push(e))({group:"swaps",actionID:"captain-butt",data:"- Captian -",dataIDpostFix:"data"});let je=null;const We=document.getElementById("results"),Fe=function(e,t){const n=ye(e),o=Ie(n),r=we(e,t,o,n),s=Ee(e);return{changeScore:n,post:r,replacePost:ve,download:s}}(document,We),Ye=document.getElementById("seconds"),Je=function(e,t,n=10){return{increment:ue(e,t,n),reset:me(e,t,n)}}(document.getElementById("minutes"),Ye);document.getElementById("reset").addEventListener("click",()=>Re()),document.getElementById("playon").addEventListener("click",()=>$e()),document.getElementById("whistle").addEventListener("click",()=>Ge()),document.getElementById("finished").addEventListener("click",e=>Ke(e)),document.getElementById("kickoff").addEventListener("click",()=>Ue()),document.getElementById("vrsScore").addEventListener("click",()=>Xe()),document.getElementById("updateInfo").addEventListener("click",()=>ot()),document.getElementById("updateInfo2").addEventListener("click",()=>ot()),document.getElementById("where").addEventListener("click",()=>_e());console.log(""),console.log("     ,...                                                             ,,    ,,"),console.log('   .d\'""                  mm                                        `7MM  `7MM '),console.log("   dM`                    MM                                          MM    MM  "),console.log('  mMMmm,pW"Wq.   ,pW"Wq.mmMMmm     ,pP"Ybd `7M\'    ,A    `MF\'.gP"Ya   MM    MM  '),console.log("   MM 6W'   `Wb 6W'   `Wb MM       8I   `\"   VA   ,VAA   ,V ,M'   Yb  MM    MM  "),console.log('   MM 8M     M8 8M     M8 MM       `YMMMa.    VA ,V  VA ,V  8M""""""  MM    MM  '),console.log("   MM YA.   ,A9 YA.   ,A9 MM       L.   I8     VVV    VVV   YM.    ,  MM    MM  "),console.log(" .JMML.`Ybmd9'   `Ybmd9'  `Mbmo    M9mmmP'      W      W     `Mbmmd'.JMML..JMML."),console.log(""),I([e=>({attributes:["swap","swap-action"],process:(t,n)=>{const o=xe(t,e);return!!o&&(Se(e,t),Me.setItem(Be+t.id,JSON.stringify(o)),n?e.clickListener(t,e=>Ne(t),[n]):console.error("SWAP PLUGIN:No group name??! ",t),!0)}}),e=>(U=e,{attributes:["swapper","swapper-action"],process:t=>($(e,t),e.clickListener(t,e=>K(t)),!0)}),e=>(X=e,{attributes:["toggle"],process:(t,n)=>(e.clickListener(t,e=>z(t)),!0)}),e=>(oe(),{attributes:["showhide","showhide-trigger"],process:(t,n)=>{const o=t.getAttribute("showhide");return o?(o.split(",").forEach(e=>ne(e.trim(),t)),!0):ee(e,n,t)}}),e=>(ce(),{attributes:["if"],process:(t,n)=>{const o=t.getAttribute("if");if(!o)return!1;console.log("IFP - "+o+" has an if.... "),e.stateListener(o,n=>{const r=le(e,o);de(t,r)});const r=le(e,o);return de(t,r),!0}})]),(()=>{for(let e=1;e<22;e++){const t=document.getElementById("slot"+e+"b");try{t.addEventListener("click",e=>qe(e))}catch(t){console.error(e+". failed is it in the markup?"),console.error(t)}}})();const qe=e=>{if("kickoff"!==(()=>s)())return;const t=e.target,n=Ze(t);if(!n)return void console.error(t.name+" ("+t.id+") has no player defined!");Fe.post({detail:"Goal by "+n,state:"scored"});const o=document.getElementById("scored");o.innerText="!!! "+n+" scored !!!",o.classList.remove("hide"),h(o),setTimeout(()=>{document.getElementById("scored").classList.add("hide")},3e3)},Ue=()=>{N("kickoff"),document.getElementById("kickoff-grid").style.display="none",document.getElementById("finished").classList.remove("hide"),fe=[];const e=He();Fe.post({detail:e}),document.getElementById("score").innerText="0",document.getElementById("vrsScore").innerText="0",$e()},He=(e=!1)=>{const t=document.getElementById("where").innerText;return"Kick off "+(e?"HOME"===t?"away":"home":t.toLowerCase())+" vrs "+document.getElementById("opposition").value},_e=()=>{const e=He(),t=He(!0);Fe.replacePost(e,t)},Re=()=>{Fe.post({detail:"New quarter"}),Je.reset()},$e=()=>{N("kickoff"),je=setInterval(Je.increment,1e3),document.getElementById("whistle").classList.remove("hide"),document.getElementById("stateblock").style.display="none"},Ge=()=>{N(""),document.getElementById("whistle").classList.add("hide"),document.getElementById("stateblock").style.display="grid",clearInterval(je),je=null},Ke=e=>{Ge();const t=document.getElementById("vrsScore").innerText,n=document.getElementById("score").innerText,o=document.getElementById("opposition").value,r=document.getElementById("teamName").value;Fe.post({detail:"Final Whistle- "+r+":"+n+" vrs "+o+": "+t}),Fe.download(),document.getElementById("kickoff").style.display="block",e.target.style.display="none"},Xe=()=>{const e=document.getElementById("opposition").value;Fe.post({detail:"Conceded a goal from "+e,state:"concide"})},ze=e=>{const t=document.getElementById(e);return null==t?(console.error(e+" doesn't exist?!"),null):Qe(t)},Qe=(e,t=[])=>{const n=e.getAttribute("name");if(null!=n&&t.push(n),e.children.length>0)for(let n=0;n<e.children.length;n++)t=Qe(e.children[n],t);return t},Ze=e=>{const t=Qe(e);return et(t)},et=e=>{const t=e.find(e=>-1==e.indexOf("data"));return null==t?null:g(t).currentValue},tt=(e,t=1,n="")=>{if(t>5)return n;const o=e+"-"+t,r=ze(o),s=et(r),l=(e=>{const t=e.find(e=>e.indexOf("data")>-1);return null!=t&&g(t).currentValue.length>0})(r)?"(Captain)":"";if(null==s)console.error(o+" has no player name ?!!");else{const e=s+l;n=""===n?e:n+", "+e}return tt(e,t+1,n)},nt=(e,t)=>{const n=tt(t,1,"");return n?e+": "+n+". ":""},ot=()=>{const e="Formation-  "+nt("Up front","front")+nt("Mid field","mid")+nt("Back","back")+(()=>{const e=ze("goalie");return"Goalie: "+et(e)})();console.log("FORMATION ",e),Fe.post({detail:e})}}]);
//# sourceMappingURL=index.fs.js.map