# Status Fix QA — FERE POS Web
Update terakhir: 20 April 2026

---

## Dashboard (DS)

| ID | Skenario | Status QA | Status Fix | Keterangan |
|----|----------|-----------|------------|------------|
| DS-001 | Switch dark/light mode | Pass | — | Tidak ada masalah |
| DS-002 | Button titik tiga | Risk | ✅ FIXED | Button dihapus (tidak ada fungsi) |
| DS-003 | Notifikasi bisa diklik ke detail | Fail | ❌ BELUM | Butuh navigasi ke halaman detail transaksi — perlu diskusi struktur URL dengan BE |
| DS-004 | Search tidak menemukan "Dine In" | Fail | ✅ FIXED | Search sekarang cocokkan ke label ("Dine In") bukan hanya raw value ("DINE_IN") |

---

## Pengaturan / Profil Toko (PG)

| ID | Skenario | Status QA | Status Fix | Keterangan |
|----|----------|-----------|------------|------------|
| PG-001 | Salin URL toko | Risk | ❌ BELUM | Web order URL belum bisa diakses — bukan FE |
| PG-002 | Button Lihat Toko | Fail | ❌ BELUM | Same as PG-001 |
| PG-003 | Button Bagi Link | Pass | — | Tidak ada masalah |
| PG-004 | Cetak & sebarkan QR Code | Pass | — | Tidak ada masalah |
| PG-005 | Scan QR Code | Risk | ❌ BELUM | Same as PG-001 |
| PG-006 | Halaman Tema | Pass | — | Tidak ada masalah |
| PG-007 | Ubah warna & simpan | Pass | ✅ Solved 04/04 | |
| PG-008 | Cek ke web order | — | — | Belum bisa ditest |
| PG-009 | Ubah data informasi outlet | Pass | ✅ Solved 16/04 | Payload update outlet disesuaikan |
| PG-010 | Tambah outlet | Pass | — | Tidak ada masalah |
| PG-011 | Ganti outlet | Pass | — | Tidak ada masalah |
| PG-012 | Nonaktifkan outlet | Pass | — | Tidak ada masalah |
| PG-013 | Hapus outlet | Pass | — | Error loading solved |
| PG-014 | UI Manajemen Meja | Pass | ✅ Solved 04/04 | Warna font area meja diperbaiki |
| PG-015 | Tambah meja | Pass | ✅ Solved 04/04 | |
| PG-016 | Update status meja | Pass | ✅ Solved 04/04 | |
| PG-017 | Ubah data meja | Pass | ✅ Solved 04/04 | |
| PG-018 | Regenerate QR meja | Pass | ✅ Solved 04/04 | |
| PG-019 | Hapus meja | Pass | ✅ Solved 04/04 | |
| PG-020 | Tambah area meja | Pass | — | Tidak ada masalah |
| PG-021 | Tambah pajak (persen) | Fail | ✅ Solved | API sudah ada |
| PG-022 | Tambah pajak (nominal) | Fail | ✅ Solved | API sudah ada |
| PG-023 | UI Pajak & Biaya Tambahan | Pass | ✅ Solved | API sudah ada |
| PG-024 | Non-aktifkan pajak | Fail | ✅ Solved | API sudah ada |
| PG-025 | Aktifkan pajak | Fail | ✅ Solved | API sudah ada |
| PG-026 | Ubah Pajak PPN | Fail | ❌ BELUM | PPN 11% harusnya statis/tidak bisa diubah — perlu konfirmasi BE untuk disable field |
| PG-027 | Tambah voucher & promo | Pass | — | Tidak ada masalah |
| PG-028 | Ubah kuota voucher | Pass | — | Tidak ada masalah |
| PG-029 | Ubah tanggal voucher | Pass | — | Tidak ada masalah |
| PG-030 | Hentikan voucher | Pass | — | Tidak ada masalah |
| PG-031 | Hapus permanen voucher | Pass | — | Tidak ada masalah |
| PG-032 | Update metode pembayaran | Fail | ❌ BELUM | API dari BE belum ada |
| PG-033 | Pengaturan struk/print | Pass | — | Tidak ada masalah |
| PG-034 | Integrasi EDC | Pending | — | Tidak ada perangkat |
| PG-035 | Edit informasi pribadi | Pass | — | Tidak ada masalah |
| PG-036 | Ubah PIN | Pass | ✅ Solved 05/04 | |
| PG-037 | Ubah kata sandi | Pass | — | Tidak ada masalah |
| PG-038 | Verifikasi identitas | Pass | — | Tidak ada masalah |
| PG-039 | UI Pusat Bantuan & search | Pass | ✅ Solved 05/04 | |
| PG-040 | Ketentuan layanan | Pass | — | Tidak ada masalah |
| PG-041 | Kebijakan privasi | Pass | — | Tidak ada masalah |
| PG-042 | Logout | Pass | — | Tidak ada masalah |
| PG-043 | Tambah staff | Pass | — | Tidak ada masalah |
| PG-044 | Edit nama staff | Pass | — | Tidak ada masalah |
| PG-045 | Edit no HP staff | Pass | ✅ Solved | |
| PG-046 | Hapus staff | Pass | — | Tidak ada masalah |
| PG-047 | Tambah kategori | Pass | — | Tidak ada masalah |
| PG-048 | Hapus kategori | Pass | — | Tidak ada masalah |
| PG-049 | Edit kategori | Pass | — | Tidak ada masalah |

---

## Profile (PRFL)

| ID | Skenario | Status QA | Status Fix | Keterangan |
|----|----------|-----------|------------|------------|
| PRFL-001 | Update data profil | Fail | ❌ BELUM | Data tidak terupdate, tidak bisa ubah foto profil — kemungkinan masalah BE endpoint |
| PRFL-002 | Ubah password | Pass | — | Tidak ada masalah |

---

## Shift (SHFT)

| ID | Skenario | Status QA | Status Fix | Keterangan |
|----|----------|-----------|------------|------------|
| SHFT-001 | UI Shift | Pass | — | Tidak ada masalah |

---

## Wallet (WLT)

| ID | Skenario | Status QA | Status Fix | Keterangan |
|----|----------|-----------|------------|------------|
| WLT-001 | Filter periode | Pass | — | Tidak ada masalah |
| WLT-002 | Filter riwayat transaksi | Pass | — | Tidak ada masalah |
| WLT-003 | UI nominal minus ambigu | Risk | ✅ FIXED | Simbol minus dihapus — warna merah sudah cukup sebagai penanda transaksi keluar |

---

## Ringkasan

| Kategori | Jumlah |
|----------|--------|
| ✅ Fixed (sesi ini) | 3 (DS-002, DS-004, WLT-003) |
| ✅ Solved sebelumnya | ~15 item |
| ❌ Belum fix — butuh BE | DS-003, PG-001/002/005, PG-026, PG-032, PRFL-001 |
| Pass / Tidak ada masalah | Sisanya |
