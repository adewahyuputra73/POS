"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import { Button, Badge, useToast } from "@/components/ui";
import { DataTable } from "@/features/reports/components/data-table";
import { 
  Plus, 
  Mail, 
  Search, 
  X, 
  Calendar, 
  Clock, 
  Edit2, 
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type ScheduleStatus = "ACTIVE" | "INACTIVE";
type ScheduleFormat = "DAILY" | "WEEKLY" | "MONTHLY";

interface ReportSchedule {
  id: number;
  name: string;
  type: string;
  format: ScheduleFormat;
  scheduleTime: string;
  scheduleDay?: string;
  emails: string[];
  status: ScheduleStatus;
}

// Mock data
const mockSchedules: ReportSchedule[] = [
  {
    id: 1,
    name: "Laporan Penjualan Harian",
    type: "Ekspor Berdasarkan Pesanan",
    format: "DAILY",
    scheduleTime: "07:00",
    emails: ["owner@store.com", "admin@store.com"],
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Laporan Stok Mingguan",
    type: "Laporan Saldo",
    format: "WEEKLY",
    scheduleTime: "08:00",
    scheduleDay: "Senin",
    emails: ["inventory@store.com"],
    status: "ACTIVE",
  },
  {
    id: 3,
    name: "Laporan Bulanan Owner",
    type: "Ekspor Berdasarkan Item",
    format: "MONTHLY",
    scheduleTime: "09:00",
    scheduleDay: "1",
    emails: ["owner@store.com"],
    status: "INACTIVE",
  },
  {
    id: 4,
    name: "Rekap Produk Harian",
    type: "Penjualan Harian Berdasarkan Produk",
    format: "DAILY",
    scheduleTime: "23:00",
    emails: ["marketing@store.com", "sales@store.com"],
    status: "ACTIVE",
  },
];

const reportTypes = [
  "Ekspor Berdasarkan Pesanan",
  "Laporan Saldo",
  "Ekspor Berdasarkan Item",
  "Penjualan Harian Berdasarkan Produk",
];

const formatLabels: Record<ScheduleFormat, string> = {
  DAILY: "Harian",
  WEEKLY: "Mingguan",
  MONTHLY: "Bulanan",
};

export default function SendReportPage() {
  const [schedules, setSchedules] = useState<ReportSchedule[]>(mockSchedules);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ScheduleStatus>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ReportSchedule | null>(null);
  const { showToast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: reportTypes[0],
    format: "DAILY" as ScheduleFormat,
    scheduleTime: "07:00",
    scheduleDay: "",
    emails: "",
  });

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.emails.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [schedules, searchQuery, statusFilter]);

  const handleToggleStatus = (id: number) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
          : s
      )
    );
  };

  const handleEdit = (schedule: ReportSchedule) => {
    setEditingSchedule(schedule);
    setFormData({
      name: schedule.name,
      type: schedule.type,
      format: schedule.format,
      scheduleTime: schedule.scheduleTime,
      scheduleDay: schedule.scheduleDay || "",
      emails: schedule.emails.join(", "),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleAddNew = () => {
    setEditingSchedule(null);
    setFormData({
      name: "",
      type: reportTypes[0],
      format: "DAILY",
      scheduleTime: "07:00",
      scheduleDay: "",
      emails: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSchedule: ReportSchedule = {
      id: editingSchedule?.id || Date.now(),
      name: formData.name,
      type: formData.type,
      format: formData.format,
      scheduleTime: formData.scheduleTime,
      scheduleDay: formData.scheduleDay || undefined,
      emails: formData.emails.split(",").map((e) => e.trim()).filter(Boolean),
      status: editingSchedule?.status || "ACTIVE",
    };

    if (editingSchedule) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === editingSchedule.id ? newSchedule : s))
      );
    } else {
      setSchedules((prev) => [...prev, newSchedule]);
    }

    setIsModalOpen(false);
    showToast(
      editingSchedule ? "Penjadwalan berhasil diperbarui" : "Berhasil membuat penjadwalan baru",
      "success"
    );
  };

  const columns = [
    {
      key: "name",
      header: "Nama Laporan",
      sortable: true,
      render: (row: ReportSchedule) => (
        <div>
          <p className="font-semibold text-text-primary">{row.name}</p>
          <p className="text-xs text-text-secondary">{row.type}</p>
        </div>
      ),
    },
    {
      key: "format",
      header: "Format",
      sortable: true,
      render: (row: ReportSchedule) => (
        <Badge variant="secondary" size="sm">
          {formatLabels[row.format]}
        </Badge>
      ),
    },
    {
      key: "scheduleTime",
      header: "Waktu Kirim",
      render: (row: ReportSchedule) => (
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-text-secondary" />
          <span>
            {row.scheduleDay && `${row.scheduleDay}, `}
            {row.scheduleTime}
          </span>
        </div>
      ),
    },
    {
      key: "emails",
      header: "Email Tujuan",
      render: (row: ReportSchedule) => (
        <div className="flex flex-wrap gap-1">
          {row.emails.slice(0, 2).map((email, i) => (
            <Badge key={i} variant="secondary" size="sm" className="text-xs">
              {email}
            </Badge>
          ))}
          {row.emails.length > 2 && (
            <Badge variant="secondary" size="sm" className="text-xs">
              +{row.emails.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: ReportSchedule) => (
        <button
          onClick={() => handleToggleStatus(row.id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            row.status === "ACTIVE" ? "bg-success" : "bg-border"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-surface transition-transform ${
              row.status === "ACTIVE" ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      className: "text-right",
      render: (row: ReportSchedule) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 text-text-secondary hover:text-error hover:bg-error-light rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Kirim Laporan"
        description="Kelola jadwal pengiriman laporan otomatis via email"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Laporan", href: "/reports" },
          { label: "Kirim Laporan" },
        ]}
        actions={
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Penjadwalan
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-surface rounded-xl border border-border">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl flex-1 max-w-sm">
          <Search className="h-4 w-4 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama laporan atau email..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-text-secondary"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X className="h-4 w-4 text-text-secondary" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | ScheduleStatus)}
          className="px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">Semua Status</option>
          <option value="ACTIVE">Aktif</option>
          <option value="INACTIVE">Tidak Aktif</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface p-6 rounded-xl border border-border">
        <DataTable
          data={filteredSchedules}
          columns={columns}
          emptyMessage="Belum ada jadwal pengiriman laporan"
          pageSize={10}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-text-primary mb-6">
                {editingSchedule ? "Edit Penjadwalan" : "Tambah Penjadwalan"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Nama Laporan
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Laporan Penjualan Harian"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Jenis Laporan
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {reportTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Format Pengiriman
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) =>
                      setFormData({ ...formData, format: e.target.value as ScheduleFormat })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="DAILY">Harian</option>
                    <option value="WEEKLY">Mingguan</option>
                    <option value="MONTHLY">Bulanan</option>
                  </select>
                </div>

                {/* Schedule Day (for Weekly/Monthly) */}
                {formData.format !== "DAILY" && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                      {formData.format === "WEEKLY" ? "Hari" : "Tanggal"}
                    </label>
                    {formData.format === "WEEKLY" ? (
                      <select
                        value={formData.scheduleDay}
                        onChange={(e) =>
                          setFormData({ ...formData, scheduleDay: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="Senin">Senin</option>
                        <option value="Selasa">Selasa</option>
                        <option value="Rabu">Rabu</option>
                        <option value="Kamis">Kamis</option>
                        <option value="Jumat">Jumat</option>
                        <option value="Sabtu">Sabtu</option>
                        <option value="Minggu">Minggu</option>
                      </select>
                    ) : (
                      <select
                        value={formData.scheduleDay}
                        onChange={(e) =>
                          setFormData({ ...formData, scheduleDay: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="1">Tanggal 1</option>
                        <option value="15">Tanggal 15</option>
                        <option value="end">Akhir Bulan</option>
                      </select>
                    )}
                  </div>
                )}

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Jam Kirim
                  </label>
                  <input
                    type="time"
                    value={formData.scheduleTime}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduleTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>

                {/* Emails */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Email Tujuan
                  </label>
                  <input
                    type="text"
                    value={formData.emails}
                    onChange={(e) => setFormData({ ...formData, emails: e.target.value })}
                    placeholder="email1@example.com, email2@example.com"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Pisahkan beberapa email dengan koma
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit">
                    {editingSchedule ? "Simpan Perubahan" : "Tambah"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
