// This file is loaded dynamically (no SSR) to avoid leaflet window errors.
import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";

interface Props {
  driverLat?: number;
  driverLng?: number;
  destinationLat?: number;
  destinationLng?: number;
  destinationAddress?: string;
}

export default function DeliveryMapInner({
  driverLat,
  driverLng,
  destinationLat,
  destinationLng,
  destinationAddress,
}: Props) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamically import leaflet (browser only)
    import("leaflet").then((L) => {
      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (mapRef.current) {
        // Map already initialized — just update markers
        return;
      }

      // Determine center
      const centerLat = driverLat ?? destinationLat ?? -6.2;
      const centerLng = driverLng ?? destinationLng ?? 106.816;

      const map = L.map(containerRef.current!, {
        center: [centerLat, centerLng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false,
      });
      mapRef.current = map;

      // OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const bounds: [number, number][] = [];

      // Driver marker (amber)
      if (driverLat != null && driverLng != null) {
        const driverIcon = L.divIcon({
          className: "",
          html: `<div style="
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
          ">🛵</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });
        L.marker([driverLat, driverLng], { icon: driverIcon })
          .addTo(map)
          .bindPopup("<b>Driver</b>")
          .openPopup();
        bounds.push([driverLat, driverLng]);
      }

      // Destination marker (red)
      if (destinationLat != null && destinationLng != null) {
        const destIcon = L.divIcon({
          className: "",
          html: `<div style="
            background:#EF4444;
            border:3px solid #7F1D1D;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            width:30px;
            height:30px;
            box-shadow:0 4px 12px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });
        L.marker([destinationLat, destinationLng], { icon: destIcon })
          .addTo(map)
          .bindPopup(`<b>Tujuan</b>${destinationAddress ? `<br/>${destinationAddress}` : ""}`);
        bounds.push([destinationLat, destinationLng]);
      }

      // Fit bounds if both markers exist
      if (bounds.length === 2) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div
        ref={containerRef}
        className="w-full rounded-2xl overflow-hidden"
        style={{ height: 280 }}
      />
    </>
  );
}
