import { Phone, User, Star, Bike } from "lucide-react";
import type { BiteshipDriver } from "../types";

interface Props {
  driver: BiteshipDriver;
  courierCompany?: string;
}

export function DriverInfoCard({ driver, courierCompany }: Props) {
  const handleCall = () => {
    if (driver.phone) {
      window.open(`tel:${driver.phone}`, "_self");
    }
  };

  const handleWhatsApp = () => {
    if (driver.phone) {
      // Normalize phone number to international format
      const phone = driver.phone.replace(/^0/, "62").replace(/\D/g, "");
      window.open(`https://wa.me/${phone}?text=Halo, saya ingin menanyakan status pesanan saya`, "_blank");
    }
  };

  return (
    <div
      className="rounded-[22px] p-5"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1.5px solid rgba(124,74,30,0.1)",
        boxShadow: "0 2px 12px rgba(28,10,0,0.04)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#FEF3C7" }}
        >
          <Bike className="h-3.5 w-3.5" style={{ color: "#D97706" }} />
        </div>
        <span
          className="text-[13px] font-black uppercase tracking-wider"
          style={{ color: "#1C0A00" }}
        >
          Informasi Driver
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className="h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"
          style={{ backgroundColor: "#F3F4F6" }}
        >
          {driver.photo_url ? (
            <img
              src={driver.photo_url}
              alt={driver.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-8 w-8" style={{ color: "#9CA3AF" }} />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-black truncate" style={{ color: "#1C0A00" }}>
            {driver.name || "Driver"}
          </p>

          {courierCompany && (
            <p className="text-xs font-bold mt-0.5" style={{ color: "#9C7D58" }}>
              {courierCompany}
            </p>
          )}

          {driver.vehicle_type && (
            <div className="flex items-center gap-1.5 mt-1">
              <Bike className="h-3 w-3 shrink-0" style={{ color: "#D97706" }} />
              <span className="text-[11px] font-bold" style={{ color: "#6B4C2A" }}>
                {driver.vehicle_type}
                {driver.vehicle_license_plate && ` · ${driver.vehicle_license_plate}`}
              </span>
            </div>
          )}

          {typeof driver.rating === "number" && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-black" style={{ color: "#D97706" }}>
                {driver.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {driver.phone && (
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={handleCall}
            className="flex-1 h-11 rounded-2xl flex items-center justify-center gap-2 font-black text-sm transition-all active:scale-95 border-2"
            style={{
              backgroundColor: "#FFF8EE",
              borderColor: "rgba(124,74,30,0.18)",
              color: "#1C0A00",
            }}
          >
            <Phone className="h-4 w-4" />
            Telepon
          </button>
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex-1 h-11 rounded-2xl flex items-center justify-center gap-2 font-black text-sm transition-all active:scale-95"
            style={{ backgroundColor: "#25D366", color: "#FFFFFF" }}
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
