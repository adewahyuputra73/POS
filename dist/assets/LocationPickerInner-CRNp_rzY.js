const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/leaflet-src-CFMLeaWk.js","assets/index-B3xzwNcZ.js","assets/index-DD3WbJsn.css"])))=>i.map(i=>d[i]);
import{r as g,_ as R,j as d}from"./index-B3xzwNcZ.js";async function v(a,u){try{const s=await(await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${a}&lon=${u}&format=json&accept-language=id&addressdetails=1`,{headers:{"Accept-Language":"id"}})).json(),e=s.address??{},i=e.city_district||e.suburb||e.municipality||e.county||e.state_district||"",h=e.village||e.hamlet||e.neighbourhood||e.quarter||"",o=e.city||e.town||e.regency||"",p=e.state||"",t=e.postcode||"";return{address:s.display_name??"",district:i,village:h,city:o,province:p,postalCode:t}}catch{return{address:""}}}function C({initialLat:a,initialLng:u,onPick:m}){const s=g.useRef(null),e=g.useRef(null),i=g.useRef(null),[h,o]=g.useState(!1);return g.useEffect(()=>{if(!s.current||e.current)return;let p=!1;return R(()=>import("./leaflet-src-CFMLeaWk.js").then(t=>t.l),__vite__mapDeps([0,1,2])).then(t=>{if(p||!s.current||e.current)return;delete t.Icon.Default.prototype._getIconUrl,t.Icon.Default.mergeOptions({iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"});const b=a??-6.2088,w=u??106.8456,c=t.map(s.current,{center:[b,w],zoom:a?16:12,zoomControl:!0,scrollWheelZoom:!0});e.current=c,t.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',maxZoom:19}).addTo(c);const y=t.divIcon({className:"",html:`<div style="
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
        </div>`,iconSize:[32,44],iconAnchor:[16,44],popupAnchor:[0,-44]});if(a&&u){const r=t.marker([a,u],{icon:y,draggable:!0}).addTo(c);i.current=r,r.on("dragend",async()=>{const n=r.getLatLng();o(!0);const l=await v(n.lat,n.lng);o(!1),m({lat:n.lat,lng:n.lng,...l})})}const k=t.Control.extend({onAdd(){const r=t.DomUtil.create("div");return r.innerHTML=`<div style="
            background:rgba(28,10,0,0.82);
            color:#FEF3C7;
            padding:8px 12px;
            border-radius:12px;
            font-size:11px;
            font-weight:700;
            max-width:160px;
            line-height:1.4;
            box-shadow:0 4px 12px rgba(0,0,0,0.3);
          ">📍 Ketuk peta untuk<br/>tentukan titik antar</div>`,r}});new k({position:"topright"}).addTo(c),c.on("click",async r=>{const{lat:n,lng:l}=r.latlng;if(i.current)i.current.setLatLng([n,l]);else{const x=t.marker([n,l],{icon:y,draggable:!0}).addTo(c);i.current=x,x.on("dragend",async()=>{const f=x.getLatLng();o(!0);const j=await v(f.lat,f.lng);o(!1),m({lat:f.lat,lng:f.lng,...j})})}o(!0);const _=await v(n,l);o(!1),m({lat:n,lng:l,..._})}),!a&&navigator.geolocation&&navigator.geolocation.getCurrentPosition(r=>{!p&&e.current&&c.setView([r.coords.latitude,r.coords.longitude],15)},()=>{})}),()=>{p=!0,e.current&&(e.current.remove(),e.current=null,i.current=null)}},[]),d.jsxs(d.Fragment,{children:[d.jsx("link",{rel:"stylesheet",href:"https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"}),d.jsx("div",{ref:s,style:{height:280,width:"100%",borderRadius:"16px",overflow:"hidden"}}),h&&d.jsxs("div",{className:"flex items-center gap-2 mt-2 text-xs font-bold",style:{color:"#D97706"},children:[d.jsx("div",{className:"h-3 w-3 rounded-full border-2 border-amber-400 border-t-transparent animate-spin"}),"Mendapatkan alamat..."]})]})}export{C as default};
