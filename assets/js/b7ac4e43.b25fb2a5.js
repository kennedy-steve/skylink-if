(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[554],{7757:function(t,e,n){t.exports=n(5666)},9349:function(t,e,n){"use strict";n.r(e),n.d(e,{contentTitle:function(){return v},default:function(){return x},frontMatter:function(){return m},metadata:function(){return b},toc:function(){return k}});var r=n(7462),i=n(3366),a=n(7294),o=n(3905),s=n(5068);function l(t,e,n,r,i,a,o){try{var s=t[a](o),l=s.value}catch(c){return void n(c)}s.done?e(l):Promise.resolve(l).then(r,i)}function c(t){return function(){var e=this,n=arguments;return new Promise((function(r,i){var a=t.apply(e,n);function o(t){l(a,r,i,o,s,"next",t)}function s(t){l(a,r,i,o,s,"throw",t)}o(void 0)}))}}function u(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function h(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(n)return(n=n.call(t)).next.bind(n);if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return u(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?u(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0;return function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var p=n(7757),d=n.n(p),f=function(){function t(t,e){void 0===t&&(t="#termynal"),void 0===e&&(e={}),this.container="string"==typeof t?document.querySelector(t):t,this.pfx="data-"+(e.prefix||"ty"),this.originalStartDelay=this.startDelay=e.startDelay||parseFloat(this.container.getAttribute(this.pfx+"-startDelay"))||600,this.originalTypeDelay=this.typeDelay=e.typeDelay||parseFloat(this.container.getAttribute(this.pfx+"-typeDelay"))||90,this.originalLineDelay=this.lineDelay=e.lineDelay||parseFloat(this.container.getAttribute(this.pfx+"-lineDelay"))||1500,this.progressLength=e.progressLength||parseFloat(this.container.getAttribute(this.pfx+"-progressLength"))||40,this.progressChar=e.progressChar||this.container.getAttribute(this.pfx+"-progressChar")||"\u2588",this.progressPercent=e.progressPercent||parseFloat(this.container.getAttribute(this.pfx+"-progressPercent"))||100,this.cursor=e.cursor||this.container.getAttribute(this.pfx+"-cursor")||"\u258b",this.lineData=this.lineDataToElements(e.lineData||[]),this.loadLines(),e.noInit||this.init()}var e=t.prototype;return e.loadLines=function(){var t=this.generateFinish();t.style.visibility="hidden",this.container.appendChild(t),this.lines=Array.from(this.container.querySelectorAll("["+this.pfx+"]")).concat(this.lineData);for(var e=0;e<this.lines.length;e++)this.lines[e].style.visibility="hidden",this.container.appendChild(this.lines[e]);var n=this.generateRestart();n.style.visibility="hidden",this.container.appendChild(n),this.container.setAttribute("data-termynal","")},e.init=function(){var t=getComputedStyle(this.container);this.container.style.width="0px"!==t.width?t.width:void 0,this.container.style.minHeight="0px"!==t.height?t.height:void 0,this.container.setAttribute("data-termynal",""),this.container.innerHTML="";for(var e,n=h(this.lines);!(e=n()).done;){e.value.style.visibility="visible"}this.start()},e.start=function(){var t=c(d().mark((function t(){var e,n,r,i,a;return d().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.addFinish(),t.next=3,this._wait(this.startDelay);case 3:e=h(this.lines);case 4:if((n=e()).done){t.next=29;break}if(r=n.value,i=r.getAttribute(this.pfx),a=r.getAttribute(this.pfx+"-delay")||this.lineDelay,"input"!=i){t.next=16;break}return r.setAttribute(this.pfx+"-cursor",this.cursor),t.next=12,this.type(r);case 12:return t.next=14,this._wait(a);case 14:t.next=26;break;case 16:if("progress"!=i){t.next=23;break}return t.next=19,this.progress(r);case 19:return t.next=21,this._wait(a);case 21:t.next=26;break;case 23:return this.container.appendChild(r),t.next=26,this._wait(a);case 26:r.removeAttribute(this.pfx+"-cursor");case 27:t.next=4;break;case 29:this.addRestart(),this.finishElement.style.visibility="hidden",this.lineDelay=this.originalLineDelay,this.typeDelay=this.originalTypeDelay,this.startDelay=this.originalStartDelay;case 34:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}(),e.generateRestart=function(){var t=this,e=document.createElement("a");return e.onclick=function(e){e.preventDefault(),t.container.innerHTML="",t.init()},e.href="#",e.setAttribute("data-terminal-control",""),e.innerHTML="restart \u21bb",e},e.generateFinish=function(){var t=this,e=document.createElement("a");return e.onclick=function(e){e.preventDefault(),t.lineDelay=0,t.typeDelay=0,t.startDelay=0},e.href="#",e.setAttribute("data-terminal-control",""),e.innerHTML="fast \u2192",this.finishElement=e,e},e.addRestart=function(){var t=this.generateRestart();this.container.appendChild(t)},e.addFinish=function(){var t=this.generateFinish();this.container.appendChild(t)},e.type=function(){var t=c(d().mark((function t(e){var n,r,i,a,o;return d().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n=Array.from(e.textContent),e.textContent="",this.container.appendChild(e),r=0,i=n;case 4:if(!(r<i.length)){t.next=13;break}return a=i[r],o=e.getAttribute(this.pfx+"-typeDelay")||this.typeDelay,t.next=9,this._wait(o);case 9:e.textContent+=a;case 10:r++,t.next=4;break;case 13:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}(),e.progress=function(){var t=c(d().mark((function t(e){var n,r,i,a,o,s;return d().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n=e.getAttribute(this.pfx+"-progressLength")||this.progressLength,r=e.getAttribute(this.pfx+"-progressChar")||this.progressChar,i=r.repeat(n),a=e.getAttribute(this.pfx+"-progressPercent")||this.progressPercent,e.textContent="",this.container.appendChild(e),o=1;case 7:if(!(o<i.length+1)){t.next=17;break}return t.next=10,this._wait(this.typeDelay);case 10:if(s=Math.round(o/i.length*100),e.textContent=i.slice(0,o)+" "+s+"%",!(s>a)){t.next=14;break}return t.abrupt("break",17);case 14:o++,t.next=7;break;case 17:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}(),e._wait=function(t){return new Promise((function(e){return setTimeout(e,t)}))},e.lineDataToElements=function(t){var e=this;return t.map((function(t){var n=document.createElement("div");return n.innerHTML="<span "+e._attributes(t)+">"+(t.value||"")+"</span>",n.firstElementChild}))},e._attributes=function(t){var e="";for(var n in t)"class"!==n?"type"===n?e+=this.pfx+'="'+t[n]+'" ':"value"!==n&&(e+=this.pfx+"-"+n+'="'+t[n]+'" '):e+=" class="+t[n]+" ";return e},t}(),y=function(t){function e(){return t.apply(this,arguments)||this}(0,s.Z)(e,t);var n=e.prototype;return n.componentDidMount=function(){new f(this.t,{typeDelay:40,lineDelay:700})},n.render=function(){var t=this;return a.createElement("div",null,a.createElement("div",{"data-terminal":!0,style:this.props.style,ref:function(e){return t.t=e}},this.props.children))},e}(a.Component),g=["components"],m={sidebar_position:1},v="Installation",b={unversionedId:"contributing/getting-started/installation",id:"contributing/getting-started/installation",isDocsHomePage:!1,title:"Installation",description:"UNDER CONSTRUCTION",source:"@site/docs/contributing/getting-started/installation.mdx",sourceDirName:"contributing/getting-started",slug:"/contributing/getting-started/installation",permalink:"/docs/contributing/getting-started/installation",editUrl:"https://github.com/kennedy-steve/skylink-if/tree/development/packages/website/docs/contributing/getting-started/installation.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Introduction",permalink:"/docs/contributing/intro"},next:{title:"Installation",permalink:"/docs/contributing/adding-documentation/installation"}},k=[{value:"Clone the repository",id:"clone-the-repository",children:[],level:2},{value:"Install dependencies",id:"install-dependencies",children:[],level:2},{value:"Create /config/config.json",id:"create-configconfigjson",children:[],level:2},{value:"Register /slash commands",id:"register-slash-commands",children:[],level:2},{value:"Run the bot",id:"run-the-bot",children:[],level:2}],w={toc:k};function x(t){var e=t.components,n=(0,i.Z)(t,g);return(0,o.kt)("wrapper",(0,r.Z)({},w,n,{components:e,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"installation"},"Installation"),(0,o.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"caution")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"UNDER CONSTRUCTION"))),(0,o.kt)("h2",{id:"clone-the-repository"},"Clone the repository"),(0,o.kt)("p",null,"If you're new to git, cloning is kind of like downloading."),(0,o.kt)("p",null,"In your terminal, navigate to where you want to store this, and future, projects. Then, ",(0,o.kt)("inlineCode",{parentName:"p"},"git clone")," the repository."),(0,o.kt)(y,{mdxType:"ReactTermynal"},(0,o.kt)("span",{"data-ty":"input"},"git clone https://github.com/kennedy-steve/skylink-if.git"),(0,o.kt)("span",{"data-ty":"progress"}),(0,o.kt)("span",{"data-ty":"input"},"cd skylink-if"),(0,o.kt)("span",{"data-ty":!0},"\ud83d\ude0a You are now in the skylink-if codebase")),(0,o.kt)("p",null,"Alternatively, you could use VSCode to clone and open skylink-if."),(0,o.kt)("h2",{id:"install-dependencies"},"Install dependencies"),(0,o.kt)("p",null,"I like to use ",(0,o.kt)("inlineCode",{parentName:"p"},"yarn")," for dependency management, but you can use ",(0,o.kt)("inlineCode",{parentName:"p"},"npm")," if you prefer."),(0,o.kt)(y,{mdxType:"ReactTermynal"},(0,o.kt)("span",{"data-ty":"input"},"yarn install"),(0,o.kt)("span",{"data-ty":!0},"Resolving packages..."),(0,o.kt)("span",{"data-ty":"progress"})),(0,o.kt)("h2",{id:"create-configconfigjson"},"Create /config/config.json"),(0,o.kt)("p",null,"The easiest thing to do is contact a maintainer of the project and ask them to create a config file for you. But if you're on your own, follow these instructions:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("a",{parentName:"li",href:"https://discordapp.com/developers/applications/me"},"Create a discord bot")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("a",{parentName:"li",href:"https://discordjs.guide/preparations/setting-up-a-bot-application.html"},"Create a bot token")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("a",{parentName:"li",href:"hhttps://infiniteflight.com/guide/developer-reference/live-api/overview#obtaining-an-api-key"},"Get an Infinite Flight Live API Key")),(0,o.kt)("li",{parentName:"ol"},"Copy the ",(0,o.kt)("inlineCode",{parentName:"li"},"config.example.json")," file and name it ",(0,o.kt)("inlineCode",{parentName:"li"},"config.json"),"."),(0,o.kt)("li",{parentName:"ol"},"Populate all fields named ",(0,o.kt)("inlineCode",{parentName:"li"},"<field>")," with the appropriate values.")),(0,o.kt)("h2",{id:"register-slash-commands"},"Register /slash commands"),(0,o.kt)("p",null,"Discord slash commands are a new way to create commands for your Discord bot. They are new and Discord has made it clear that they want slash commands to be used as much as possible. You can read more about them ",(0,o.kt)("a",{parentName:"p",href:"https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ"},"here"),"."),(0,o.kt)(y,{mdxType:"ReactTermynal"},(0,o.kt)("span",{"data-ty":"input"},"yarn run register"),(0,o.kt)("span",{"data-ty":!0},"INFO: Registering commands: 'dev', 'get-pilot', 'help', 'infinite-flight-status', 'info', 'link', 'register-me', 'test', 'translate'."),(0,o.kt)("span",{"data-ty":!0},"INFO: Commands registered."),(0,o.kt)("span",{"data-ty":!0},"Done in 1.23s.")),(0,o.kt)("h2",{id:"run-the-bot"},"Run the bot"),(0,o.kt)("p",null,"Running the bot isn't just about making it active and listening for commands, it also starts running scheduled jobs such as notifications for active Infinite Flight users."),(0,o.kt)(y,{mdxType:"ReactTermynal"},(0,o.kt)("span",{"data-ty":"input"},"yarn start:dev"),(0,o.kt)("span",{"data-ty":!0},"INFO: Client logged in as 'Skylink IF Beta#3584'."),(0,o.kt)("span",{"data-ty":!0},"INFO: Scheduled job 'Notify Active Infinite Flight Users' for '0 */1 * * * *'."),(0,o.kt)("span",{"data-ty":!0},"INFO: Client is ready!")),(0,o.kt)("p",null,"If you want to play with the bot, create a test server and ",(0,o.kt)("a",{parentName:"p",href:"https://discordjs.guide/preparations/adding-your-bot-to-servers.html"},"invite your bot to it"),"."))}x.isMDXComponent=!0},5666:function(t){var e=function(t){"use strict";var e,n=Object.prototype,r=n.hasOwnProperty,i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",o=i.asyncIterator||"@@asyncIterator",s=i.toStringTag||"@@toStringTag";function l(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(j){l=function(t,e,n){return t[e]=n}}function c(t,e,n,r){var i=e&&e.prototype instanceof g?e:g,a=Object.create(i.prototype),o=new T(r||[]);return a._invoke=function(t,e,n){var r=h;return function(i,a){if(r===d)throw new Error("Generator is already running");if(r===f){if("throw"===i)throw a;return I()}for(n.method=i,n.arg=a;;){var o=n.delegate;if(o){var s=D(o,n);if(s){if(s===y)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(r===h)throw r=f,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r=d;var l=u(t,e,n);if("normal"===l.type){if(r=n.done?f:p,l.arg===y)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(r=f,n.method="throw",n.arg=l.arg)}}}(t,n,o),a}function u(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(j){return{type:"throw",arg:j}}}t.wrap=c;var h="suspendedStart",p="suspendedYield",d="executing",f="completed",y={};function g(){}function m(){}function v(){}var b={};l(b,a,(function(){return this}));var k=Object.getPrototypeOf,w=k&&k(k(A([])));w&&w!==n&&r.call(w,a)&&(b=w);var x=v.prototype=g.prototype=Object.create(b);function N(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function C(t,e){function n(i,a,o,s){var l=u(t[i],t,a);if("throw"!==l.type){var c=l.arg,h=c.value;return h&&"object"==typeof h&&r.call(h,"__await")?e.resolve(h.__await).then((function(t){n("next",t,o,s)}),(function(t){n("throw",t,o,s)})):e.resolve(h).then((function(t){c.value=t,o(c)}),(function(t){return n("throw",t,o,s)}))}s(l.arg)}var i;this._invoke=function(t,r){function a(){return new e((function(e,i){n(t,r,e,i)}))}return i=i?i.then(a,a):a()}}function D(t,n){var r=t.iterator[n.method];if(r===e){if(n.delegate=null,"throw"===n.method){if(t.iterator.return&&(n.method="return",n.arg=e,D(t,n),"throw"===n.method))return y;n.method="throw",n.arg=new TypeError("The iterator does not provide a 'throw' method")}return y}var i=u(r,t.iterator,n.arg);if("throw"===i.type)return n.method="throw",n.arg=i.arg,n.delegate=null,y;var a=i.arg;return a?a.done?(n[t.resultName]=a.value,n.next=t.nextLoc,"return"!==n.method&&(n.method="next",n.arg=e),n.delegate=null,y):a:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,y)}function L(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function E(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function T(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(L,this),this.reset(!0)}function A(t){if(t){var n=t[a];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var i=-1,o=function n(){for(;++i<t.length;)if(r.call(t,i))return n.value=t[i],n.done=!1,n;return n.value=e,n.done=!0,n};return o.next=o}}return{next:I}}function I(){return{value:e,done:!0}}return m.prototype=v,l(x,"constructor",v),l(v,"constructor",m),m.displayName=l(v,s,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===m||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,v):(t.__proto__=v,l(t,s,"GeneratorFunction")),t.prototype=Object.create(x),t},t.awrap=function(t){return{__await:t}},N(C.prototype),l(C.prototype,o,(function(){return this})),t.AsyncIterator=C,t.async=function(e,n,r,i,a){void 0===a&&(a=Promise);var o=new C(c(e,n,r,i),a);return t.isGeneratorFunction(n)?o:o.next().then((function(t){return t.done?t.value:o.next()}))},N(x),l(x,s,"Generator"),l(x,a,(function(){return this})),l(x,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},t.values=A,T.prototype={constructor:T,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(E),!t)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var n=this;function i(r,i){return s.type="throw",s.arg=t,n.next=r,i&&(n.method="next",n.arg=e),!!i}for(var a=this.tryEntries.length-1;a>=0;--a){var o=this.tryEntries[a],s=o.completion;if("root"===o.tryLoc)return i("end");if(o.tryLoc<=this.prev){var l=r.call(o,"catchLoc"),c=r.call(o,"finallyLoc");if(l&&c){if(this.prev<o.catchLoc)return i(o.catchLoc,!0);if(this.prev<o.finallyLoc)return i(o.finallyLoc)}else if(l){if(this.prev<o.catchLoc)return i(o.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return i(o.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var i=this.tryEntries[n];if(i.tryLoc<=this.prev&&r.call(i,"finallyLoc")&&this.prev<i.finallyLoc){var a=i;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var o=a?a.completion:{};return o.type=t,o.arg=e,a?(this.method="next",this.next=a.finallyLoc,y):this.complete(o)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),y},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),E(n),y}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var i=r.arg;E(n)}return i}}throw new Error("illegal catch attempt")},delegateYield:function(t,n,r){return this.delegate={iterator:A(t),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=e),y}},t}(t.exports);try{regeneratorRuntime=e}catch(n){"object"==typeof globalThis?globalThis.regeneratorRuntime=e:Function("r","regeneratorRuntime = r")(e)}}}]);