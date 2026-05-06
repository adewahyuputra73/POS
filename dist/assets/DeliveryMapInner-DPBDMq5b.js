const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/leaflet-src-CFMLeaWk.js","assets/index-B3xzwNcZ.js","assets/index-DD3WbJsn.css"])))=>i.map(i=>d[i]);
import{r as u,_ as f,j as p}from"./index-B3xzwNcZ.js";function g({driverLat:o,driverLng:n,destinationLat:l,destinationLng:s,destinationAddress:d}){const r=u.useRef(null),a=u.useRef(null);return u.useEffect(()=>{if(a.current)return f(()=>import("./leaflet-src-CFMLeaWk.js").then(e=>e.l),__vite__mapDeps([0,1,2])).then(e=>{if(delete e.Icon.Default.prototype._getIconUrl,e.Icon.Default.mergeOptions({iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"}),r.current)return;const m=o??l??-6.2,h=n??s??106.816,t=e.map(a.current,{center:[m,h],zoom:14,zoomControl:!0,scrollWheelZoom:!1});r.current=t,e.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(t);const c=[];if(o!=null&&n!=null){const i=e.divIcon({className:"",html:`<div style="
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
          ">🛵</div>`,iconSize:[36,36],iconAnchor:[18,18]});e.marker([o,n],{icon:i}).addTo(t).bindPopup("<b>Driver</b>").openPopup(),c.push([o,n])}if(l!=null&&s!=null){const i=e.divIcon({className:"",html:`<div style="
            background:#EF4444;
            border:3px solid #7F1D1D;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            width:30px;
            height:30px;
            box-shadow:0 4px 12px rgba(0,0,0,0.3);
          "></div>`,iconSize:[30,30],iconAnchor:[15,30]});e.marker([l,s],{icon:i}).addTo(t).bindPopup(`<b>Tujuan</b>${d?`<br/>${d}`:""}`),c.push([l,s])}c.length===2&&t.fitBounds(c,{padding:[50,50]})}),()=>{r.current&&(r.current.remove(),r.current=null)}},[]),p.jsxs(p.Fragment,{children:[p.jsx("link",{rel:"stylesheet",href:"https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"}),p.jsx("div",{ref:a,className:"w-full rounded-2xl overflow-hidden",style:{height:280}})]})}export{g as default};
