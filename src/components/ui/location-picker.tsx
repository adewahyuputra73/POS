import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Search, X, Check, Loader2, Navigation, LocateFixed } from "lucide-react";

export interface PickedLocation {
  lat: number;
  lng: number;
  address?: string;
}

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  class: string;
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
 * - Autocomplete saran lokasi real-time saat mengetik (debounced 400ms)
 * - Klik saran → langsung pindah peta ke lokasi tersebut
 * - Klik peta untuk pasang/pindah pin
 * - Drag pin untuk presisi
 * - Reverse geocoding otomatis via Nominatim
 * - Tombol "Lokasi Saya"
 */
export function LocationPicker({ initialLat, initialLng, onConfirm, onClose }: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(
    initialLat != null && initialLng != null ? { lat: initialLat, lng: initialLng } : null
  );
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [locatingMe, setLocatingMe] = useState(false);

  // ── Tutup dropdown jika klik di luar ────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      // ignore
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
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const L = (await import("leaflet")).default;
      if (!mounted || !mapContainerRef.current) return;

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

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = e.latlng;
        placeMarker(lat, lng, L);
        setShowSuggestions(false);
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

  // ── Autocomplete: fetch saran saat query berubah (debounced 400ms) ───────────
  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsFetchingSuggestions(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=7&addressdetails=0`,
        { headers: { "Accept-Language": "id" } }
      );
      const data: NominatimResult[] = await res.json();
      setSuggestions(data ?? []);
      setShowSuggestions((data ?? []).length > 0);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsFetchingSuggestions(false);
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 400);
  };

  // ── Pilih satu saran dari dropdown ───────────────────────────────────────────
  const handleSelectSuggestion = async (item: NominatimResult) => {
    const latNum = parseFloat(item.lat);
    const lngNum = parseFloat(item.lon);

    setSearchQuery(item.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    setPicked({ lat: latNum, lng: lngNum });
    setAddress(item.display_name);

    if (leafletMapRef.current) {
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
    }
  };

  // ── Lokasi saya ──────────────────────────────────────────────────────────────
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

  // ── Icon kecil per tipe tempat ───────────────────────────────────────────────
  const getPlaceIcon = (cls: string) => {
    const icons: Record<string, string> = {
      amenity: "🏪",
      building: "🏢",
      highway: "🛣️",
      place: "📍",
      boundary: "🗺️",
      landuse: "🌿",
      natural: "🌳",
      shop: "🛍️",
      tourism: "🏛️",
      railway: "🚉",
    };
    return icons[cls] ?? "📌";
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
                Ketik untuk mencari, atau klik langsung pada peta
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

        {/* ── Search bar + autocomplete dropdown ── */}
        <div
          className="flex items-center gap-2 px-4 py-3 border-b shrink-0"
          style={{ borderColor: "rgba(28,10,0,0.08)" }}
        >
          {/* Wrapper relatif untuk dropdown */}
          <div ref={searchWrapperRef} className="relative flex-1">
            {/* Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") { setShowSuggestions(false); }
                }}
                placeholder="Cari nama tempat, jalan, kecamatan..."
                className="w-full h-10 pl-9 pr-8 rounded-xl border text-sm font-medium outline-none transition-colors"
                style={{
                  backgroundColor: "#FFF8EE",
                  borderColor: showSuggestions ? "#F59E0B" : "rgba(124,74,30,0.18)",
                  color: "#1C0A00",
                  borderBottomLeftRadius: showSuggestions ? "4px" : undefined,
                  borderBottomRightRadius: showSuggestions ? "4px" : undefined,
                }}
                autoComplete="off"
              />
              {/* Loading spinner di dalam input */}
              {isFetchingSuggestions && (
                <Loader2
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin"
                  style={{ color: "#D97706" }}
                />
              )}
              {/* Clear button */}
              {searchQuery && !isFetchingSuggestions && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              )}
            </div>

            {/* ── Dropdown saran ── */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 top-full z-[500] rounded-b-xl shadow-xl border overflow-hidden"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#F59E0B",
                  borderTop: "none",
                  maxHeight: "260px",
                  overflowY: "auto",
                }}
              >
                {suggestions.map((item, idx) => (
                  <button
                    key={item.place_id}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-amber-50 border-b last:border-b-0"
                    style={{
                      borderColor: "rgba(28,10,0,0.05)",
                      backgroundColor: idx === 0 ? "#FFFBF0" : "#FFFFFF",
                    }}
                  >
                    {/* Ikon tipe tempat */}
                    <span className="text-base shrink-0 mt-0.5 leading-none">
                      {getPlaceIcon(item.class)}
                    </span>
                    <div className="min-w-0 flex-1">
                      {/* Baris pertama: nama utama (potong dari display_name) */}
                      <p className="text-sm font-semibold leading-tight truncate" style={{ color: "#1C0A00" }}>
                        {item.display_name.split(",")[0]}
                      </p>
                      {/* Baris kedua: detail lokasi (sisanya) */}
                      <p className="text-xs mt-0.5 line-clamp-1 leading-relaxed" style={{ color: "#9C7D58" }}>
                        {item.display_name.split(",").slice(1).join(",").trim()}
                      </p>
                    </div>
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#D97706" }} />
                  </button>
                ))}

                {/* Footer nominatim credit */}
                <div
                  className="flex items-center justify-end px-3 py-1.5 text-[10px]"
                  style={{ backgroundColor: "#FAFAFA", color: "#9CA3AF" }}
                >
                  Powered by{" "}
                  <a
                    href="https://nominatim.openstreetmap.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 underline"
                  >
                    Nominatim / OpenStreetMap
                  </a>
                </div>
              </div>
            )}

            {/* Tidak ditemukan */}
            {showSuggestions && !isFetchingSuggestions && suggestions.length === 0 && searchQuery.trim().length >= 2 && (
              <div
                className="absolute left-0 right-0 top-full z-[500] rounded-b-xl shadow-xl border px-4 py-3"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#F59E0B", borderTop: "none" }}
              >
                <p className="text-sm text-gray-400">
                  Tidak ditemukan — coba kata kunci yang lebih spesifik
                </p>
              </div>
            )}
          </div>

          {/* Tombol lokasi saya */}
          <button
            type="button"
            onClick={handleMyLocation}
            disabled={locatingMe}
            title="Gunakan lokasi saya"
            className="h-10 w-10 rounded-xl flex items-center justify-center border transition-colors hover:bg-amber-50 disabled:opacity-50 shrink-0"
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
        <div className="relative flex-1" style={{ minHeight: "340px" }}>
          <div ref={mapContainerRef} className="absolute inset-0" />

          {!mapReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 gap-3 z-10">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D97706" }} />
              <p className="text-sm font-medium text-gray-500">Memuat peta...</p>
            </div>
          )}

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
