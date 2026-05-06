(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,15480,e=>{"use strict";var t=e.i(43476),r=e.i(71645);e.s(["default",0,function({driverLat:o,driverLng:n,destinationLat:l,destinationLng:i,destinationAddress:s}){let a=(0,r.useRef)(null),c=(0,r.useRef)(null);return(0,r.useEffect)(()=>{if(c.current)return e.A(71400).then(e=>{if(delete e.Icon.Default.prototype._getIconUrl,e.Icon.Default.mergeOptions({iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"}),a.current)return;let t=e.map(c.current,{center:[o??l??-6.2,n??i??106.816],zoom:14,zoomControl:!0,scrollWheelZoom:!1});a.current=t,e.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(t);let r=[];if(null!=o&&null!=n){let l=e.divIcon({className:"",html:`<div style="
            background:#F59E0B;
            border:3px solid #1C0A00;
            border-radius:50%;
            width:36px;
            height:36px;
            display:flex;
            align-items:center;
            justify-content:center;
            box-shadow:0 4px 12px rgba(0,0,0,0.3);
            font-size:18px;
          ">🛵</div>`,iconSize:[36,36],iconAnchor:[18,18]});e.marker([o,n],{icon:l}).addTo(t).bindPopup("<b>Driver</b>").openPopup(),r.push([o,n])}if(null!=l&&null!=i){let o=e.divIcon({className:"",html:`<div style="
            background:#EF4444;
            border:3px solid #7F1D1D;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            width:30px;
            height:30px;
            box-shadow:0 4px 12px rgba(0,0,0,0.3);
          "></div>`,iconSize:[30,30],iconAnchor:[15,30]});e.marker([l,i],{icon:o}).addTo(t).bindPopup(`<b>Tujuan</b>${s?`<br/>${s}`:""}`),r.push([l,i])}2===r.length&&t.fitBounds(r,{padding:[50,50]})}),()=>{a.current&&(a.current.remove(),a.current=null)}},[]),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("link",{rel:"stylesheet",href:"https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"}),(0,t.jsx)("div",{ref:c,className:"w-full rounded-2xl overflow-hidden",style:{height:280}})]})}])},2428,e=>{e.n(e.i(15480))},71400,e=>{e.v(t=>Promise.all(["static/chunks/06r9_3ub2r-4z.js"].map(t=>e.l(t))).then(()=>t(32322)))}]);