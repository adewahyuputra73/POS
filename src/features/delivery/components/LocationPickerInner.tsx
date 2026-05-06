// Di-load secara dynamic (no SSR) agar tidak error karena window
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

export interface PickedLocation {
  lat: number;
  lng: number;
  address?: string; // reverse geocode result (display_name)
  district?: string; // kecamatan
  village?: string; // kelurahan / desa
  city?: string; // kota / kabupaten
  province?: string; // provinsi
  postalCode?: string;
}

interface Props {
  initialLat?: number;
  initialLng?: number;
  onPick: (loc: PickedLocation) => void;
}

// Reverse geocode via Nominatim (OpenStreetMap) — kembalikan structured address
async function reverseGeocode(
  lat: number,
  lng: number
): Promise<Omit<PickedLocation, "lat" | "lng">> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=id&addressdetails=1`,
      { headers: { "Accept-Language": "id" } }
    );
    const json = await res.json();
    const a = json.address ?? {};
    // Nominatim di Indonesia: kecamatan biasanya di suburb / city_district / county / municipality
    const district =
      a.city_district ||
      a.suburb ||
      a.municipality ||
      a.county ||
      a.state_district ||
      "";
    const village = a.village || a.hamlet || a.neighbourhood || a.quarter || "";
    const city = a.city || a.town || a.regency || "";
    const province = a.state || "";
    const postalCode = a.postcode || "";
    return {
      address: json.display_name ?? "",
      district,
      village,
      city,
      province,
      postalCode,
    };
  } catch {
    return { address: "" };
  }
}

export default function LocationPickerInner({ initialLat, initialLng, onPick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      // Fix icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const defaultLat = initialLat ?? -6.2088;
      const defaultLng = initialLng ?? 106.8456;

      const map = L.map(containerRef.current!, {
        center: [defaultLat, defaultLng],
        zoom: initialLat ? 16 : 12,
        zoomControl: true,
        scrollWheelZoom: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom pin icon
      const pinIcon = L.divIcon({
        className: "",
        html: `<div style="
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
        </div>`,
        iconSize: [32, 44],
        iconAnchor: [16, 44],
        popupAnchor: [0, -44],
      });

      // Jika ada initial koordinat, taruh marker langsung
      if (initialLat && initialLng) {
        const marker = L.marker([initialLat, initialLng], { icon: pinIcon, draggable: true }).addTo(map);
        markerRef.current = marker;

        marker.on("dragend", async () => {
          const pos = marker.getLatLng();
          setLoadingAddress(true);
          const info = await reverseGeocode(pos.lat, pos.lng);
          setLoadingAddress(false);
          onPick({ lat: pos.lat, lng: pos.lng, ...info });
        });
      }

      // Instruction overlay — gunakan L.Control class untuk kompatibilitas TypeScript
      const InfoControl = L.Control.extend({
        onAdd() {
          const div = L.DomUtil.create("div");
          div.innerHTML = `<div style="
            background:rgba(28,10,0,0.82);
            color:#FEF3C7;
            padding:8px 12px;
            border-radius:12px;
            font-size:11px;
            font-weight:700;
            max-width:160px;
            line-height:1.4;
            box-shadow:0 4px 12px rgba(0,0,0,0.3);
          ">📍 Ketuk peta untuk<br/>tentukan titik antar</div>`;
          return div;
        },
      });
      new InfoControl({ position: "topright" }).addTo(map);

      // Click to place / move marker
      map.on("click", async (e) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          const marker = L.marker([lat, lng], { icon: pinIcon, draggable: true }).addTo(map);
          markerRef.current = marker;

          marker.on("dragend", async () => {
            const pos = marker.getLatLng();
            setLoadingAddress(true);
            const info = await reverseGeocode(pos.lat, pos.lng);
            setLoadingAddress(false);
            onPick({ lat: pos.lat, lng: pos.lng, ...info });
          });
        }

        setLoadingAddress(true);
        const info = await reverseGeocode(lat, lng);
        setLoadingAddress(false);
        onPick({ lat, lng, ...info });
      });

      // Jika browser support geolocation & belum ada initial, zoom ke lokasi user
      if (!initialLat && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (!cancelled && mapRef.current) {
              map.setView([pos.coords.latitude, pos.coords.longitude], 15);
            }
          },
          () => {} // tolak → tetap di default
        );
      }
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={containerRef} style={{ height: 280, width: "100%", borderRadius: "16px", overflow: "hidden" }} />
      {loadingAddress && (
        <div
          className="flex items-center gap-2 mt-2 text-xs font-bold"
          style={{ color: "#D97706" }}
        >
          <div className="h-3 w-3 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          Mendapatkan alamat...
        </div>
      )}
    </>
  );
}
