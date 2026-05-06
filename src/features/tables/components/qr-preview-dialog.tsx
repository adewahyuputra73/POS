import { useState } from "react";
import { Copy, Check, ExternalLink, X, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui";
import type { Table } from "../types";

interface QrPreviewDialogProps {
  table: Table;
  onClose: () => void;
}

export function QrPreviewDialog({ table, onClose }: QrPreviewDialogProps) {
  const [copied, setCopied] = useState(false);

  const orderUrl = `${window.location.origin}/order?t=${table.qr_token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(orderUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const svg = document.getElementById("qr-svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${table.name}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm p-6 relative animate-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-disabled hover:text-text-secondary"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-lg font-semibold text-text-primary mb-1">
          QR Code — {table.name}
        </h3>
        <p className="text-xs text-text-secondary mb-5">
          {table.area?.name || ""} · {table.capacity} kursi
        </p>

        {/* QR Code */}
        <div className="mx-auto w-fit bg-white rounded-xl border border-border p-3 mb-5">
          <QRCodeSVG
            id="qr-svg"
            value={orderUrl}
            size={176}
            level="M"
            includeMargin={false}
          />
        </div>

        {/* URL */}
        <div className="mb-5">
          <p className="text-[11px] font-black uppercase tracking-widest text-text-disabled mb-1.5">
            URL Customer Order
          </p>
          <div className="p-3 rounded-xl bg-background border border-border">
            <p className="text-xs font-mono text-text-secondary break-all leading-relaxed">
              {orderUrl}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-2 text-sm"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Tersalin!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Salin URL
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="gap-2 text-sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            className="flex-1 gap-2 text-sm"
            onClick={() => window.open(orderUrl, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            Buka & Tes
          </Button>
        </div>
      </div>
    </div>
  );
}
