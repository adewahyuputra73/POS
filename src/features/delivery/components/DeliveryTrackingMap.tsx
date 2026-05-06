import { lazy, Suspense } from "react";
import { MapPin } from "lucide-react";

const DeliveryMapInner = lazy(() => import("./DeliveryMapInner"));

interface Props {
  driverLat?: number;
  driverLng?: number;
  destinationLat?: number;
  destinationLng?: number;
  destinationAddress?: string;
}

export function DeliveryTrackingMap(props: Props) {
  const hasCoordinates =
    (props.driverLat != null && props.driverLng != null) ||
    (props.destinationLat != null && props.destinationLng != null);

  if (!hasCoordinates) {
    return (
      <div
        className="w-full rounded-2xl flex flex-col items-center justify-center gap-3"
        style={{ height: 200, backgroundColor: "#F9FAFB", border: "2px dashed #E5E7EB" }}
      >
        <MapPin className="h-8 w-8" style={{ color: "#D97706" }} />
        <div className="text-center">
          <p className="text-sm font-black" style={{ color: "#6B7280" }}>
            Lokasi belum tersedia
          </p>
          <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
            Driver belum memiliki data koordinat
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div
        className="w-full rounded-2xl flex items-center justify-center"
        style={{ height: 280, backgroundColor: "#F3F4F6" }}
      >
        <div className="text-center">
          <MapPin className="h-8 w-8 mx-auto mb-2" style={{ color: "#D97706" }} />
          <p className="text-sm font-bold" style={{ color: "#9C7D58" }}>
            Memuat peta...
          </p>
        </div>
      </div>
    }>
      <DeliveryMapInner {...props} />
    </Suspense>
  );
}
