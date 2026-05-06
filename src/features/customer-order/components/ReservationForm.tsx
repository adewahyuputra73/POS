import { useState } from "react";
import { ArrowLeft, CalendarClock, Check, Users } from "lucide-react";
import type { Table } from "@/features/tables/types";

interface ReservationFormProps {
    table: Table;
    onBack: () => void;
    onSubmit: (data: ReservationData) => void;
}

export interface ReservationData {
    table: Table;
    customerName: string;
    customerPhone: string;
    date: string;
    time: string;
    guests: number;
    notes?: string;
}

export function ReservationForm({ table, onBack, onSubmit }: ReservationFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [guests, setGuests] = useState(2);
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const today = new Date().toISOString().split("T")[0];

    const canSubmit = name.trim() && phone.trim() && date && time && guests > 0;

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setSubmitting(true);
        // Simulate — no API yet
        await new Promise((r) => setTimeout(r, 1000));
        onSubmit({ table, customerName: name, customerPhone: phone, date, time, guests, notes: notes || undefined });
        setSubmitting(false);
    };

    return (
        <div className="w-full max-w-lg mx-auto space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="h-10 w-10 rounded-xl flex items-center justify-center transition-all active:scale-90 border shrink-0"
                    style={{ backgroundColor: "#13182B", borderColor: "rgba(34,213,92,0.22)", color: "#9CA3B5" }}
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h2 className="text-lg font-black tracking-tight font-[family-name:var(--font-fraunces)]" style={{ color: "#F8FAFC" }}>
                        Form Reservasi
                    </h2>
                    <p className="text-xs font-medium" style={{ color: "#9CA3B5" }}>
                        Isi data untuk memesan meja
                    </p>
                </div>
            </div>

            {/* Selected Table Badge */}
            <div
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ backgroundColor: "#0E6B30", borderColor: "#FCD34D" }}
            >
                <CalendarClock className="h-5 w-5 shrink-0" style={{ color: "#92400E" }} />
                <div className="flex-1">
                    <p className="text-sm font-black" style={{ color: "#F8FAFC" }}>
                        {table.name} — {table.area?.name ?? ""}
                    </p>
                    <p className="text-xs font-medium flex items-center gap-1" style={{ color: "#92400E" }}>
                        <Users className="h-3 w-3" /> Kapasitas {table.capacity} kursi
                    </p>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: "#9CA3B5" }}>Nama</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nama lengkap"
                        className="w-full h-11 px-4 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2"
                        style={{
                            backgroundColor: "#13182B",
                            borderColor: "rgba(34,213,92,0.22)",
                            color: "#F8FAFC",
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#22D55C"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(34,213,92,0.18)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(34,213,92,0.22)"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: "#9CA3B5" }}>No. HP</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        className="w-full h-11 px-4 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2"
                        style={{
                            backgroundColor: "#13182B",
                            borderColor: "rgba(34,213,92,0.22)",
                            color: "#F8FAFC",
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#22D55C"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(34,213,92,0.18)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(34,213,92,0.22)"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold mb-1.5" style={{ color: "#9CA3B5" }}>Tanggal</label>
                        <input
                            type="date"
                            value={date}
                            min={today}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2"
                            style={{
                                backgroundColor: "#13182B",
                                borderColor: "rgba(34,213,92,0.22)",
                                color: "#F8FAFC",
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "#22D55C"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(34,213,92,0.18)"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(34,213,92,0.22)"; e.currentTarget.style.boxShadow = "none"; }}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold mb-1.5" style={{ color: "#9CA3B5" }}>Jam</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2"
                            style={{
                                backgroundColor: "#13182B",
                                borderColor: "rgba(34,213,92,0.22)",
                                color: "#F8FAFC",
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "#22D55C"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(34,213,92,0.18)"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(34,213,92,0.22)"; e.currentTarget.style.boxShadow = "none"; }}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: "#9CA3B5" }}>Jumlah Tamu</label>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setGuests((g) => Math.max(1, g - 1))}
                            className="h-10 w-10 rounded-xl border flex items-center justify-center text-lg font-bold transition-all"
                            style={{ backgroundColor: "#13182B", borderColor: "rgba(34,213,92,0.22)", color: "#9CA3B5" }}
                        >
                            −
                        </button>
                        <span className="text-base font-black w-8 text-center" style={{ color: "#F8FAFC" }}>{guests}</span>
                        <button
                            onClick={() => setGuests((g) => Math.min(table.capacity ?? 20, g + 1))}
                            className="h-10 w-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all"
                            style={{ backgroundColor: "#22D55C", color: "#F8FAFC" }}
                        >
                            +
                        </button>
                        <span className="text-xs font-medium" style={{ color: "#9CA3B5" }}>
                            maks. {table.capacity} kursi
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: "#9CA3B5" }}>
                        Catatan <span className="font-normal opacity-60">(opsional)</span>
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Contoh: meja dekat jendela, ulang tahun, dll"
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 resize-none"
                        style={{
                            backgroundColor: "#13182B",
                            borderColor: "rgba(34,213,92,0.22)",
                            color: "#F8FAFC",
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#22D55C"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(34,213,92,0.18)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(34,213,92,0.22)"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                </div>
            </div>

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="w-full h-13 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                style={{ backgroundColor: "#22D55C", color: "#F8FAFC", boxShadow: "0 8px 28px rgba(245,158,11,0.28)" }}
            >
                {submitting ? (
                    <div className="h-5 w-5 rounded-full border-2 border-[#F8FAFC] border-t-transparent animate-spin" />
                ) : (
                    <>
                        <Check className="h-4 w-4" />
                        Konfirmasi Reservasi
                    </>
                )}
            </button>
        </div>
    );
}
