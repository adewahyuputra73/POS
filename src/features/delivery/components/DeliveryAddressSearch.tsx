import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { biteshipService } from "../services/biteship-service";
import type { BiteshipArea } from "../types";

interface Props {
  label?: string;
  placeholder?: string;
  value: BiteshipArea | null;
  onChange: (area: BiteshipArea | null) => void;
}

export function DeliveryAddressSearch({
  label = "Kecamatan/Kelurahan Tujuan",
  placeholder = "Cari kecamatan atau kelurahan...",
  value,
  onChange,
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BiteshipArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length < 3) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const areas = await biteshipService.searchAreas(val);
      setResults(areas.slice(0, 8));
      setLoading(false);
    }, 500);
  };

  const handleSelect = (area: BiteshipArea) => {
    onChange(area);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
    setResults([]);
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label
          className="block text-[11px] font-black uppercase tracking-widest mb-1.5"
          style={{ color: "#9C7D58" }}
        >
          {label}
        </label>
      )}

      {/* Selected state */}
      {value ? (
        <div
          className="flex items-center gap-3 h-12 px-4 rounded-2xl border-2"
          style={{
            backgroundColor: "#ECFDF5",
            borderColor: "#059669",
          }}
        >
          <MapPin className="h-4 w-4 shrink-0" style={{ color: "#059669" }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black truncate" style={{ color: "#065F46" }}>
              {value.administrative_division_level_3_name || value.name}
            </p>
            <p className="text-[10px] font-medium truncate" style={{ color: "#6B7280" }}>
              {[
                value.administrative_division_level_2_name,
                value.administrative_division_level_1_name,
              ]
                .filter(Boolean)
                .join(", ")}{" "}
              {value.postal_code && `· ${value.postal_code}`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90"
            style={{ backgroundColor: "rgba(5,150,105,0.15)", color: "#059669" }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <>
          {/* Search input */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
              style={{ color: "#9C7D58" }}
            />
            {loading && (
              <Loader2
                className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin pointer-events-none"
                style={{ color: "#D97706" }}
              />
            )}
            <input
              type="text"
              placeholder={placeholder}
              className="w-full h-12 pl-10 pr-10 rounded-2xl text-sm font-medium border-2 outline-none transition-colors"
              style={{
                backgroundColor: "#FFF8EE",
                borderColor: open ? "#F59E0B" : "rgba(124,74,30,0.18)",
                color: "#1C0A00",
              }}
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={() => setOpen(true)}
            />
          </div>

          {/* Dropdown results */}
          {open && results.length > 0 && (
            <div
              className="absolute z-50 w-full mt-2 rounded-2xl overflow-hidden shadow-xl border"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "rgba(124,74,30,0.12)",
                boxShadow: "0 8px 32px rgba(28,10,0,0.12)",
              }}
            >
              {results.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => handleSelect(area)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-amber-50 border-b last:border-b-0"
                  style={{ borderColor: "rgba(124,74,30,0.07)" }}
                >
                  <MapPin
                    className="h-4 w-4 mt-0.5 shrink-0"
                    style={{ color: "#D97706" }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: "#1C0A00" }}>
                      {area.administrative_division_level_3_name || area.name}
                    </p>
                    <p className="text-[11px] font-medium" style={{ color: "#9C7D58" }}>
                      {[
                        area.administrative_division_level_4_name,
                        area.administrative_division_level_2_name,
                        area.administrative_division_level_1_name,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                      {area.postal_code && ` · ${area.postal_code}`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {open && query.length >= 3 && !loading && results.length === 0 && (
            <div
              className="absolute z-50 w-full mt-2 rounded-2xl px-4 py-5 text-center shadow-lg border"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "rgba(124,74,30,0.12)",
              }}
            >
              <p className="text-sm font-bold" style={{ color: "#9C7D58" }}>
                Tidak ada area ditemukan
              </p>
              <p className="text-xs mt-1" style={{ color: "#9C7D58" }}>
                Coba kata kunci lain, misal: Kebon Jeruk
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
