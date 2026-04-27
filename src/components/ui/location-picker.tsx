"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Search, X, Check, Loader2, Navigation, LocateFixed } from "lucide-react";

export interface PickedLocation {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationPickerProps {
  initialLat?: number | null;
  initialLng?: number | null;
  onConfirm: (loc: PickedLocation) => void;
  onClose: () => void;
}

/** Default center: Jakarta */
const DEFAULT_LAT = -6.2;
const DEFAULT_LNG = 106.8166;

/**
 * OpenStreetMap location picker modal.
 * - Klik peta untuk pasang pin
 * - Drag pin untuk presisi
 * - Reverse geocoding otomatis via Nominatim
 * - Search alamat (forward geocoding)
 * - Tombol "Lokasi Saya"
 */
export function LocationPicker({ initialLat, initialLng, onConfirm, onClose }: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);

  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(
    initialLat != null && initialLng != null ? { lat: initialLat, lng: initialLng } : null
  );
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [locatingMe, setLocatingMe] = useState(false);

  // ── Reverse geocode ──────────────────────────────────────────────────────────
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setIsGeocoding(true);
    setAddress("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "Accept-Language": "id" } }
      );
      const data = await res.json();
      if (data?.display_name) setAddress(data.display_name);
    } catch {
      // ignore network errors
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  // ── Place / move marker ──────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const placeMarker = useCallback(async (lat: number, lng: number, L: any) => {
    setPicked({ lat, lng });
    reverseGeocode(lat, lng);

    if (!leafletMapRef.current) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const marker = L.marker([lat, lng], { draggable: true }).addTo(leafletMapRef.current);
      markerRef.current = marker;
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        setPicked({ lat: pos.lat, lng: pos.lng });
        reverseGeocode(pos.lat, pos.lng);
      });
    }
  }, [reverseGeocode]);

  // ── Init Leaflet map ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || leafletMapRef.current) return;

    let mounted = true;

    const initMap = async () => {
      // Inject Leaflet CSS once
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const L = (await import("leaflet")).default;
      if (!mounted || !mapContainerRef.current) return;

      // Fix default icon URLs (broken by bundlers)
      // @ts-expect-error – internal property
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const centerLat = initialLat ?? DEFAULT_LAT;
      const centerLng = initialLng ?? DEFAULT_LNG;
      const zoom = initialLat != null ? 15 : 12;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Place initial marker if coords provided
      if (initialLat != null && initialLng != null) {
        const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
        markerRef.current = marker;
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          setPicked({ lat: pos.lat, lng: pos.lng });
          reverseGeocode(pos.lat, pos.lng);
        });
        reverseGeocode(initialLat, initialLng);
      }

      // Click anywhere to pin
      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = e.latlng;
        placeMarker(lat, lng, L);
      });

      leafletMapRef.current = map;
      if (mounted) setMapReady(true);
    };

    initMap();

    return () => {
      mounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Search (forward geocode) ─────────────────────────────────────────────────
  const handleSearch = async () => {
    if (!searchQuery.trim() || !leafletMapRef.current) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`,
        { headers: { "Accept-Language": "id" } }
      );
      const data = await res.json();
      if (data?.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lon);

        const L = (await import("leaflet")).default;
        leafletMapRef.current.setView([latNum, lngNum], 16);

        if (markerRef.current) {
          markerRef.current.setLatLng([latNum, lngNum]);
        } else {
          const marker = L.marker([latNum, lngNum], { draggable: true }).addTo(leafletMapRef.current);
          markerRef.current = marker;
          marker.on("dragend", () => {
            const pos = marker.getLatLng();
            setPicked({ lat: pos.lat, lng: pos.lng });
            reverseGeocode(pos.lat, pos.lng);
          });
        }

        setPicked({ lat: latNum, lng: lngNum });
        setAddress(display_name ?? "");
      }
    } catch {
      // ignore
    } finally {
      setIsSearching(false);
    }
  };

  // ── Use my location ──────────────────────────────────────────────────────────
  const handleMyLocation = () => {
    if (!navigator.geolocation || !leafletMapRef.current) return;
    setLocatingMe(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const L = (await import("leaflet")).default;
        leafletMapRef.current?.setView([latitude, longitude], 17);
        placeMarker(latitude, longitude, L);
        setLocatingMe(false);
      },
      () => setLocatingMe(false),
      { timeout: 10000 }
    );
  };

  // ── Confirm ──────────────────────────────────────────────────────────────────
  const handleConfirm = () => {
    if (!picked) return;
    onConfirm({ lat: picked.lat, lng: picked.lng, address: address || undefined });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: "#FFFFFF", maxHeight: "92vh" }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: "rgba(28,10,0,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#FEF3C7" }}
            >
              <MapPin className="h-5 w-5" style={{ color: "#D97706" }} />
            </div>
            <div>
              <h2 className="text-base font-black leading-tight" style={{ color: "#1C0A00" }}>
                Pilih Lokasi
              </h2>
              <p className="text-xs" style={{ color: "#9C7D58" }}>
                Klik peta atau cari alamat untuk memasang pin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* ── Search bar ── */}
        <div
          className="flex items-center gap-2 px-4 py-3 border-b shrink-0"
          style={{ borderColor: "rgba(28,10,0,0.08)" }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Cari alamat, nama tempat..."
              className="w-full h-10 pl-9 pr-3 rounded-xl border text-sm font-medium outline-none transition-colors"
              style={{
                backgroundColor: "#FFF8EE",
                borderColor: "rgba(124,74,30,0.18)",
                color: "#1C0A00",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#F59E0B")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(124,74,30,0.18)")}
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="h-10 px-4 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#1C0A00", color: "#FFFFFF" }}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Cari
          </button>

          <button
            type="button"
            onClick={handleMyLocation}
            disabled={locatingMe}
            title="Gunakan lokasi saya"
            className="h-10 w-10 rounded-xl flex items-center justify-center border transition-colors hover:bg-amber-50 disabled:opacity-50"
            style={{ borderColor: "rgba(124,74,30,0.18)" }}
          >
            {locatingMe ? (
              <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#D97706" }} />
            ) : (
              <LocateFixed className="h-4 w-4" style={{ color: "#D97706" }} />
            )}
          </button>
        </div>

        {/* ── Map ── */}
        <div className="relative flex-1" style={{ minHeight: "360px" }}>
          <div ref={mapContainerRef} className="absolute inset-0" />

          {/* Loading overlay */}
          {!mapReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 gap-3 z-10">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D97706" }} />
              <p className="text-sm font-medium text-gray-500">Memuat peta...</p>
            </div>
          )}

          {/* Hint badge */}
          {mapReady && !picked && (
            <div
              className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm pointer-events-none"
              style={{ color: "#6B7280" }}
            >
              Klik pada peta untuk memilih lokasi
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className="px-6 py-4 border-t shrink-0 space-y-3"
          style={{ borderColor: "rgba(28,10,0,0.08)" }}
        >
          {/* Picked location info */}
          {picked ? (
            <div
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{ backgroundColor: "#FFF8EE" }}
            >
              <div
                className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: "#FEF3C7" }}
              >
                <Navigation className="h-3.5 w-3.5" style={{ color: "#D97706" }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black tabular-nums" style={{ color: "#D97706" }}>
                  {picked.lat.toFixed(6)}, {picked.lng.toFixed(6)}
                </p>
                {isGeocoding ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                    <span className="text-xs text-gray-400">Mengambil nama alamat...</span>
                  </div>
                ) : address ? (
                  <p className="text-xs mt-0.5 leading-relaxed line-clamp-2" style={{ color: "#6B7280" }}>
                    {address}
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 p-3 rounded-xl"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <p className="text-xs text-gray-400">Belum ada lokasi yang dipilih</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl text-sm font-bold border transition-colors hover:bg-gray-50"
              style={{ borderColor: "rgba(28,10,0,0.15)", color: "#1C0A00" }}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!picked}
              className="flex-1 h-11 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#1C0A00", color: "#FFFFFF" }}
            >
              <Check className="h-4 w-4" />
              Konfirmasi Lokasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
