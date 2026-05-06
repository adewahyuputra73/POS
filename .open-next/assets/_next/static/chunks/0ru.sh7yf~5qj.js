(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,16230,e=>{"use strict";var t=e.i(43476),r=e.i(71645);e.s(["default",0,function({initialLat:n,initialLng:a,onPick:o}){let l=(0,r.useRef)(null),i=(0,r.useRef)(null),s=(0,r.useRef)(null),[d,c]=(0,r.useState)(!1);async function p(e,t){try{let r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${e}&lon=${t}&format=json&accept-language=id`,{headers:{"Accept-Language":"id"}});return(await r.json()).display_name??""}catch{return""}}return(0,r.useEffect)(()=>{if(l.current&&!i.current)return e.A(71400).then(e=>{delete e.Icon.Default.prototype._getIconUrl,e.Icon.Default.mergeOptions({iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"});let t=e.map(l.current,{center:[n??-6.2088,a??106.8456],zoom:n?16:12,zoomControl:!0,scrollWheelZoom:!0});i.current=t,e.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',maxZoom:19}).addTo(t);let r=e.divIcon({className:"",html:`<div style="
          position:relative;
          display:flex;
          flex-direction:column;
          align-items:center;
        ">
          <div style="
            background:#F59E0B;
            border:3px solid #1C0A00;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            width:32px;
            height:32px;
            box-shadow:0 4px 12px rgba(0,0,0,0.35);
          "></div>
          <div style="
            width:8px;
            height:8px;
            background:#1C0A00;
            border-radius:50%;
            margin-top:2px;
            opacity:0.4;
          "></div>
        </div>`,iconSize:[32,44],iconAnchor:[16,44],popupAnchor:[0,-44]});if(n&&a){let l=e.marker([n,a],{icon:r,draggable:!0}).addTo(t);s.current=l,l.on("dragend",async()=>{let e=l.getLatLng();c(!0);let t=await p(e.lat,e.lng);c(!1),o({lat:e.lat,lng:e.lng,address:t})})}new(e.Control.extend({onAdd(){let t=e.DomUtil.create("div");return t.innerHTML=`<div style="
            background:rgba(28,10,0,0.82);
            color:#FEF3C7;
            padding:8px 12px;
            border-radius:12px;
            font-size:11px;
            font-weight:700;
            max-width:160px;
            line-height:1.4;
            box-shadow:0 4px 12px rgba(0,0,0,0.3);
          ">📍 Ketuk peta untuk<br/>tentukan titik antar</div>`,t}}))({position:"topright"}).addTo(t),t.on("click",async n=>{let{lat:a,lng:l}=n.latlng;if(s.current)s.current.setLatLng([a,l]);else{let n=e.marker([a,l],{icon:r,draggable:!0}).addTo(t);s.current=n,n.on("dragend",async()=>{let e=n.getLatLng();c(!0);let t=await p(e.lat,e.lng);c(!1),o({lat:e.lat,lng:e.lng,address:t})})}c(!0);let i=await p(a,l);c(!1),o({lat:a,lng:l,address:i})}),!n&&navigator.geolocation&&navigator.geolocation.getCurrentPosition(e=>{t.setView([e.coords.latitude,e.coords.longitude],15)},()=>{})}),()=>{i.current&&(i.current.remove(),i.current=null,s.current=null)}},[]),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("link",{rel:"stylesheet",href:"https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"}),(0,t.jsx)("div",{ref:l,style:{height:280,width:"100%",borderRadius:"16px",overflow:"hidden"}}),d&&(0,t.jsxs)("div",{className:"flex items-center gap-2 mt-2 text-xs font-bold",style:{color:"#D97706"},children:[(0,t.jsx)("div",{className:"h-3 w-3 rounded-full border-2 border-amber-400 border-t-transparent animate-spin"}),"Mendapatkan alamat..."]})]})}])},83632,e=>{e.n(e.i(16230))},71400,e=>{e.v(t=>Promise.all(["static/chunks/06r9_3ub2r-4z.js"].map(t=>e.l(t))).then(()=>t(32322)))}]);