"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Input harga dalam Rupiah.
 * - Menampilkan titik ribuan otomatis: 50000 → "50.000"
 * - Saat fokus dan nilai 0 → field kosong, langsung bisa ketik
 * - Menggunakan inputMode="numeric" (bukan type="number") agar
 *   tidak ada arrow spin & tidak ada masalah "0" di depan
 */

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value: number;
  onChange: (value: number) => void;
}

/** Tambahkan titik setiap 3 digit — tidak bergantung locale browser */
function toDisplay(num: number): string {
  if (!num || num === 0) return "";
  return String(Math.round(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function fromDisplay(str: string): number {
  const digits = str.replace(/\./g, "").replace(/[^0-9]/g, "");
  return digits === "" ? 0 : parseInt(digits, 10);
}

export function CurrencyInput({
  value,
  onChange,
  className,
  placeholder = "0",
  disabled,
  ...rest
}: CurrencyInputProps) {
  const [focused, setFocused] = useState(false);
  const [display, setDisplay] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    // Saat fokus: tampilkan angka tanpa titik agar mudah diedit,
    // tapi jika 0 biarkan kosong sehingga langsung bisa ketik
    setDisplay(value === 0 ? "" : String(value));
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
    const num = fromDisplay(display);
    onChange(num);
    setDisplay("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Hapus semua karakter non-digit
    const digits = raw.replace(/[^0-9]/g, "");
    // Simpan sebagai angka murni tanpa leading zero
    const num = digits === "" ? 0 : parseInt(digits, 10);
    setDisplay(digits === "" ? "" : String(num));
    onChange(num);
  };

  // Nilai yang ditampilkan:
  // - Saat fokus: angka murni (tanpa titik) supaya cursor tidak loncat
  // - Saat blur: format dengan titik ribuan
  const shownValue = focused ? display : toDisplay(value);

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      value={shownValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      {...rest}
    />
  );
}
