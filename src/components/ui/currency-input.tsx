import { useRef } from "react";

/**
 * Input harga Rupiah dengan format titik ribuan real-time.
 * - Ketik 15000 → langsung tampil "15.000" saat mengetik
 * - Nilai 0 → field kosong (placeholder tampil), langsung bisa ketik
 * - Cursor dipertahankan di posisi yang benar setelah titik disisipkan
 * - Pakai inputMode="numeric" — keyboard angka di mobile, tanpa arrow spin
 */

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value: number;
  onChange: (value: number) => void;
}

function addDots(num: number): string {
  if (!num || num === 0) return "";
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function CurrencyInput({
  value,
  onChange,
  className,
  placeholder = "0",
  disabled,
  ...rest
}: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const rawValue = input.value;           // apa yang ada di input sekarang (belum diformat ulang)
    const cursorPos = input.selectionStart ?? rawValue.length;

    // Hitung berapa digit yang ada SEBELUM cursor di nilai yang baru diketik
    const digitsBeforeCursor = rawValue
      .slice(0, cursorPos)
      .replace(/[^0-9]/g, "").length;

    // Ambil hanya digit
    const digits = rawValue.replace(/[^0-9]/g, "");
    const num = digits === "" ? 0 : parseInt(digits, 10);

    // Format dengan titik
    const formatted = addDots(num);

    // Update state di parent
    onChange(num);

    // Setelah React re-render (karena value berubah), kembalikan cursor ke posisi yang tepat
    requestAnimationFrame(() => {
      if (!inputRef.current) return;

      if (digitsBeforeCursor === 0) {
        inputRef.current.setSelectionRange(0, 0);
        return;
      }

      // Cari posisi setelah digit ke-N di string yang sudah terformat
      let digitsSeen = 0;
      let newPos = formatted.length; // default: ujung string

      for (let i = 0; i < formatted.length; i++) {
        if (/[0-9]/.test(formatted[i])) {
          digitsSeen++;
          if (digitsSeen === digitsBeforeCursor) {
            newPos = i + 1;
            break;
          }
        }
      }

      inputRef.current.setSelectionRange(newPos, newPos);
    });
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      value={addDots(value)}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      {...rest}
    />
  );
}
