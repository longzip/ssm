if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let c=Promise.resolve();return i[e]||(c=new Promise(async c=>{if("document"in self){const i=document.createElement("script");i.src=e,document.head.appendChild(i),i.onload=c}else importScripts(e),c()})),c.then(()=>{if(!i[e])throw new Error(`Module ${e} didn’t register its module`);return i[e]})},c=(c,i)=>{Promise.all(c.map(e)).then(e=>i(1===e.length?e[0]:e))},i={require:Promise.resolve(c)};self.define=(c,n,o)=>{i[c]||(i[c]=Promise.resolve().then(()=>{let i={};const s={uri:location.origin+c.slice(1)};return Promise.all(n.map(c=>{switch(c){case"exports":return i;case"module":return s;default:return e(c)}})).then(e=>{const c=o(...e);return i.default||(i.default=c),i})}))}}define("./service-worker.js",["./workbox-e170c028"],(function(e){"use strict";e.setCacheNameDetails({prefix:"quasar-gvc"}),self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),e.precacheAndRoute([{url:"CNAME",revision:"5b2385c1d51139aefbbebd0598559796"},{url:"css/2.8c3bb1e9.css",revision:"cbc218fcef0b61a9fdae8e15de5eb942"},{url:"css/3.8c3bb1e9.css",revision:"cbc218fcef0b61a9fdae8e15de5eb942"},{url:"css/4.e3093f0d.css",revision:"76bf146cffe226c3fe2baf18e476a59d"},{url:"css/app.0e433876.css",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"css/vendor.e5e4539f.css",revision:"8191e9870e230aaa3bd1e7d9ad7fb049"},{url:"favicon.ico",revision:"27b09b8231a01953b3557d4e56fe1353"},{url:"fonts/KFOkCnqEu92Fr1MmgVxIIzQ.a45108d3.woff",revision:"5cb7edfceb233100075dc9a1e12e8da3"},{url:"fonts/KFOlCnqEu92Fr1MmEU9fBBc-.cea99d3e.woff",revision:"87284894879f5b1c229cb49c8ff6decc"},{url:"fonts/KFOlCnqEu92Fr1MmSU5fBBc-.865f928c.woff",revision:"b00849e00f4c2331cddd8ffb44a6720b"},{url:"fonts/KFOlCnqEu92Fr1MmWUlfBBc-.2267169e.woff",revision:"adcde98f1d584de52060ad7b16373da3"},{url:"fonts/KFOlCnqEu92Fr1MmYUtfBBc-.bac8362e.woff",revision:"bb1e4dc6333675d11ada2e857e7f95d7"},{url:"fonts/KFOmCnqEu92Fr1Mu4mxM.49ae34d4.woff",revision:"60fa3c0614b8fb2f394fa29944c21540"},{url:"fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.88e9c0a1.woff",revision:"faf8cf1dfc1041c90658f00660a13ed3"},{url:"fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.b8c10426.woff2",revision:"f981396cef4edf9567e88e792cf6dba6"},{url:"icons/android-icon-144x144.png",revision:"c6d3bdacff8f58be7bee97c8945e79e7"},{url:"icons/android-icon-192x192.png",revision:"a65078bf3ee77af188746f7e2b262e9d"},{url:"icons/android-icon-36x36.png",revision:"dae9bab35a7b425e737b49551d8af129"},{url:"icons/android-icon-48x48.png",revision:"58acfe20978f5625a1220673528045a2"},{url:"icons/android-icon-72x72.png",revision:"02f227f6284464c8cf88cb49583334ec"},{url:"icons/android-icon-96x96.png",revision:"2b96c29bbed8a2187f2859936761d6b8"},{url:"icons/apple-icon-114x114.png",revision:"bcdd6ecc266051c04836b0319f52daef"},{url:"icons/apple-icon-120x120.png",revision:"50a77e79c0df76d483308cf00ba0b692"},{url:"icons/apple-icon-144x144.png",revision:"c6d3bdacff8f58be7bee97c8945e79e7"},{url:"icons/apple-icon-152x152.png",revision:"3feccfaa0873667145d0dd9a7ac9bc72"},{url:"icons/apple-icon-167x167.png",revision:"751d5b2ff7fd2b9932d77ef4a7d1454c"},{url:"icons/apple-icon-180x180.png",revision:"d7efe249f8527b78f8aa89db7e04c79e"},{url:"icons/apple-icon-57x57.png",revision:"4e62c3e8908ba0cc24f3fefc92b9eca0"},{url:"icons/apple-icon-60x60.png",revision:"d1855fab0f541894738da66403f454b4"},{url:"icons/apple-icon-72x72.png",revision:"02f227f6284464c8cf88cb49583334ec"},{url:"icons/apple-icon-76x76.png",revision:"c3c8eae936052a1407417b00bcc9bfe7"},{url:"icons/apple-icon-precomposed.png",revision:"fc454d0339439a6ea1b5c79f5673700d"},{url:"icons/apple-icon.png",revision:"fc454d0339439a6ea1b5c79f5673700d"},{url:"icons/apple-launch-1125x2436.png",revision:"1f0dbcc2a02df2f5eb72ded57b31ea8d"},{url:"icons/apple-launch-1170x2532.png",revision:"1d2efc87a494e9dbce1ab4b6f9abc038"},{url:"icons/apple-launch-1242x2208.png",revision:"25a3d526c38cbd331d004ae600c2609e"},{url:"icons/apple-launch-1242x2688.png",revision:"c17830ea6092730c9b3cc8e466618657"},{url:"icons/apple-launch-1284x2778.png",revision:"1c0522b33c0ab5e69b01a4b8b8bf7a58"},{url:"icons/apple-launch-1536x2048.png",revision:"cf947f37c4d2bfed40aa7e9d0e5ee734"},{url:"icons/apple-launch-1620x2160.png",revision:"adb456df7fc3319d0bf140598be8c840"},{url:"icons/apple-launch-1668x2224.png",revision:"c04925039632d21160a376f7188496e3"},{url:"icons/apple-launch-1668x2388.png",revision:"076a0f1e083735c6a0637b00b7edb56c"},{url:"icons/apple-launch-2048x2732.png",revision:"f137244684e67808dd4c9b263fe41ff1"},{url:"icons/apple-launch-640x1136.png",revision:"254bf3f67110c6670152ac2235ebc48d"},{url:"icons/apple-launch-750x1334.png",revision:"896ecc2f16bc96fc8ddf87d4dae1071c"},{url:"icons/apple-launch-828x1792.png",revision:"ef3864a5812c26ff746495757a4509f4"},{url:"icons/favicon-128x128.png",revision:"09125a3ea77066caf537eeb8ee3b114c"},{url:"icons/favicon-16x16.png",revision:"8185710a70e213d321bdf3ab176d6cb8"},{url:"icons/favicon-32x32.png",revision:"b155fa47ae89d49898e502d5626f00cc"},{url:"icons/favicon-96x96.png",revision:"2b96c29bbed8a2187f2859936761d6b8"},{url:"icons/favicon.ico",revision:"512de2b8a14f51e0e98872b4290adea7"},{url:"icons/icon-128x128.png",revision:"09125a3ea77066caf537eeb8ee3b114c"},{url:"icons/icon-192x192.png",revision:"98b6b1c674e1cb71349e63edb2855d10"},{url:"icons/icon-256x256.png",revision:"3d9621486196d6ba3f0cbaba1f11b4ae"},{url:"icons/icon-384x384.png",revision:"ab739b3e0b111772787b815d678c9d31"},{url:"icons/icon-512x512.png",revision:"553feccf4b37d48b8f6f1577657f96e4"},{url:"icons/ms-icon-144x144.png",revision:"c6d3bdacff8f58be7bee97c8945e79e7"},{url:"icons/ms-icon-150x150.png",revision:"c3762a4ddfb634a8ac8471fa8d648793"},{url:"icons/ms-icon-310x310.png",revision:"7e54cb2ee9790703ce2af563b3e3b128"},{url:"icons/ms-icon-70x70.png",revision:"3e6970c1e4a35ea476dcc8fcd0ea1c96"},{url:"icons/safari-pinned-tab.svg",revision:"b21b713e9844283be94a043b1f23ba33"},{url:"index.html",revision:"af150746922a94117dc2d0c5760112b9"},{url:"js/2.a844afec.js",revision:"9259da2e2ba2baf34b73c296bda21adc"},{url:"js/3.ed69f436.js",revision:"8912dc3d5e04f37f90451931e877084d"},{url:"js/4.639384e4.js",revision:"981550e3336637ae272a454320839aa7"},{url:"js/5.7df25792.js",revision:"9b7e2ede33a8ba0f197e59946572511a"},{url:"js/6.642a8413.js",revision:"ba78da65d2f79ba38bbc075573c7d5d8"},{url:"js/7.d77051f3.js",revision:"1f6116142e1fa5804979d315a1db035b"},{url:"js/app.d36deb2c.js",revision:"51e74ea2e7de41787be7291dc66523eb"},{url:"js/vendor.8d112576.js",revision:"3634091d4047f458db84f3e664211596"},{url:"logo.png",revision:"ea8e8339ed27333b5a7cbc953ba7f478"},{url:"manifest.json",revision:"dfb677be49c0fc47ef91b8952b0aa7e4"}],{}),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{denylist:[/service-worker\.js$/,/workbox-(.)*\.js$/]}))}));
