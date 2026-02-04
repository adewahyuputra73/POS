**Product Requirement Document**  
Kodeka x DigitaLink

**Fere Apps POS (Website)**

1. **Laporan**  
1. **Ringkasan Penjualan**

   ### **1.1 Functional Requirement**

   1. User dapat mengunduh laporan penjualan dalam format `.xlsx`  
   2. Data yang diekspor mengikuti filter aktif:  
      1. Periode tanggal  
      2. Outlet (satu / semua outlet)  
   3. File export berisi seluruh rincian laporan, bukan hanya ringkasan kartu  
   4. Struktur data di file rapi & mudah dibaca (siap dipakai accounting / owner)  
   5. Nama file otomatis:  
       `sales-summary_{outlet}_{startDate}_{endDate}.xlsx`

      ### **1.2 Non-Functional Requirement**

1. Waktu generate \< 5 detik untuk range normal  
2. Format angka currency konsisten (Rp, tanpa desimal)  
3. Aman (tidak expose data outlet lain tanpa izin)

   ## **1.3 Flow (User & System)**

   ### **User Flow**

1. User buka Laporan → Ringkasan Penjualan  
2. User pilih:  
   * Outlet  
   * Rentang tanggal  
3. User klik tombol Ekspor  
    Registration  
4. Sistem langsung mengunduh file `.xlsx`

   ### **System Flow**

1. Frontend kirim request:  
    `GET /reports/sales-summary/export`

    dengan query:

   * `start_date`  
   * `end_date`  
   * `outlet_id`  
2. Backend:  
   * Validasi role & parameter  
   * Query seluruh data laporan  
   * Generate file XLSX  
3. Backend kirim response berupa file download

   ## **1.4 Struktur Data XLSX (Isi File)**

   ### **Sheet 1 – Metadata**

| Field | Value |
| ----- | ----- |
| Tipe Laporan | Ringkasan Penjualan |
| Periode | 31 Jan 2026 – 31 Jan 2026 |
| Outlet | Nama Toko |
| Generated At | timestamp |

   ### **Sheet 2 – Ringkasan Utama**

| Field | Value |
| ----- | ----- |
| Item Terjual | 43 |
| Total Pesanan | 22 |
| Rata-rata / Transaksi | Rp75.590 |
| Total Penjualan | Rp1.663.000 |
| Total Makan di Tempat | Rp0 |
| Total Pesanan QR | Rp933.000 |
| Total Pesan Antar | Rp730.000 |

   ### **Sheet 3 – Rincian Penjualan**

| Keterangan | Nominal |
| ----- | ----- |
| Total Faktur | Rp1.663.000 |
| Down Payment | Rp0 |
| Penjualan Kotor | Rp1.663.000 |
| Diskon Harga Coret | Rp0 |
| Diskon Complimentary | Rp0 |
| Diskon Voucher | Rp0 |
| Refund | Rp0 |
| Net Produk | Rp1.663.000 |
| Pajak | Rp0 |
| Service Fee | Rp0 |
| Biaya MDR | Rp0 |
| Biaya Layanan | Rp0 |
| Pembulatan | Rp0 |

   ### **Sheet 4 – Metode Pembayaran**

| Metode | Jumlah Pesanan | Total |
| ----- | ----- | ----- |
| Tunai | 25 | Rp1.402.000 |
| Transfer | 5 | Rp529.000 |
| Cashless | 99 | Rp9.003.000 |
| EDC | 0 | Rp0 |
| GoFood | 0 | Rp0 |
| GrabFood | 0 | Rp0 |
| ShopeeFood | 0 | Rp0 |

		  
			**Notes: Value full dari db, samakan dengan di mobile**

## **1.5 Source Code (Contoh – Backend [Express.js](http://Express.js))**

**Library**

`npm install exceljs`

### **Controller**

`const ExcelJS = require("exceljs");`

`exports.exportSalesSummary = async (req, res) => {`  
  `const { start_date, end_date, outlet_id } = req.query;`

  `// 1. Ambil data laporan (pseudo)`  
  `const report = await getSalesSummary({`  
    `start_date,`  
    `end_date,`  
    `outlet_id,`  
  `});`

  `// 2. Buat workbook`  
  `const workbook = new ExcelJS.Workbook();`

  `// Sheet: Metadata`  
  `const meta = workbook.addWorksheet("Metadata");`  
  `meta.addRows([`  
    `["Tipe Laporan", "Ringkasan Penjualan"],`  
    ``["Periode", `${start_date} - ${end_date}`],``  
    `["Outlet", report.outlet_name],`  
    `["Generated At", new Date().toISOString()],`  
  `]);`

  `// Sheet: Ringkasan`  
  `const summary = workbook.addWorksheet("Ringkasan");`  
  `summary.addRows([`  
    `["Item Terjual", report.item_sold],`  
    `["Total Pesanan", report.total_order],`  
    `["Total Penjualan", report.total_sales],`  
  `]);`

  `// Sheet: Pembayaran`  
  `const payment = workbook.addWorksheet("Metode Pembayaran");`  
  `payment.columns = [`  
    `{ header: "Metode", key: "method" },`  
    `{ header: "Pesanan", key: "count" },`  
    `{ header: "Total", key: "amount" },`  
  `];`  
  `payment.addRows(report.payments);`

  `// 3. Response`  
  `res.setHeader(`  
    `"Content-Type",`  
    `"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"`  
  `);`  
  `res.setHeader(`  
    `"Content-Disposition",`  
    `` `attachment; filename="sales-summary.xlsx"` ``  
  `);`  
  `await workbook.xlsx.write(res);`  
  `res.end();`  
`};`

2. **Penjualan Produk**

		**1\.Requirement**

### **1.1 Fungsional**

* User dapat melihat laporan Penjualan Produk di website.  
* User dapat melakukan filter laporan berdasarkan:  
  * Rentang tanggal  
  * Outlet  
  * Produk (multi-select)  
  * Variant  
  * Kategori  
  * Mode agregasi waktu:  
     `Total | Per Jam | Per Hari | Per Minggu | Per Bulan`  
  * Shift (default: *Tidak Ada Shift*)  
* Sistem menampilkan:  
  * Item Terjual (total qty)  
  * Total Penjualan Kotor  
  * Grafik tren penjualan produk  
  * Tabel detail penjualan per produk  
* User dapat menekan tombol Ekspor untuk mengunduh laporan dalam format .xlsx

  ### **1.2 Non-Fungsional**

* File export menggunakan format Excel (.xlsx).  
* Struktur file konsisten dengan tampilan di web.  
* Data yang diekspor mengikuti filter aktif.  
* Waktu generate file \< 5 detik (normal dataset).

  ## **2\. Flow**

  ### **2.1 Flow Tampilan Data**

1. User membuka menu Laporan → Penjualan Produk  
2. Sistem memuat data default:  
   * Tanggal: hari ini  
   * Produk: semua  
   * Kategori: semua  
   * Variant: semua  
   * Mode: Total  
   * Shift: Tidak Ada Shift  
3. Sistem menampilkan:  
   * KPI:  
     * Item Terjual  
     * Total Penjualan Kotor  
   * Grafik penjualan per produk (line chart)  
   * Tabel detail penjualan produk

     ### **2.2 Flow Filter**

1. User mengubah satu atau lebih filter  
2. User menekan Apply / otomatis refresh  
3. Frontend mengirim parameter filter ke backend  
4. Backend menghitung ulang agregasi  
5. UI diperbarui sesuai filter

   ### **2.3 Flow Export XLSX**

1. User klik tombol Ekspor  
2. Frontend mengirim request dengan:  
   * Semua parameter filter aktif  
   * Tipe laporan \= `penjualan_produk`  
3. Backend:  
   * Query data sesuai filter  
   * Generate file `.xlsx`  
4. File otomatis ter-download oleh browser

   ## **3\. Struktur File XLSX (Output)**

   ### **3.1 Header Ringkasan (Atas)**

| Field | Keterangan |
| ----- | ----- |
| Tipe Laporan | Penjualan Produk |
| Tanggal | Range tanggal terpilih |
| Outlet | Outlet terpilih / Semua Outlet |
| Item Terjual | Total qty |
| Total Penjualan | Total penjualan kotor |

   ### **3.2 Tabel Detail Penjualan Produk**

### 

| Outlet | Nama Produk | Kategori | Item Terjual | Total Penjualan |
| ----- | ----- | ----- | ----- | ----- |
| Toko A | Produk A | Soft | 144 | 5.616.000 |
| Toko A | Produk B | Pluffy | 32 | 1.440.000 |
| ... | ... | ... | ... | ... |

   ### Struktur ini 1:1 dengan tabel di UI, tanpa data tambahan yang tidak ditampilkan.

   ## **4\. Source Value (Data Source)**

   ### **4.1 Data Utama**

* orders  
* order\_items  
* products  
* product\_variants  
* categories  
* outlets  
* shifts (opsional)

  ### **4.2 Field yang Digunakan**

* `order.created_at`  
* `order.outlet_id`  
* `order.shift_id`  
* `order_item.product_id`  
* `order_item.variant_id`  
* `order_item.qty`  
* `order_item.subtotal`  
* `product.name`  
* `category.name`

  ### **4.3 Rumus Utama**

* Item Terjual  
   → `SUM(order_item.qty)`

* Total Penjualan Kotor  
   → `SUM(order_item.subtotal)`

  **4.4 Notes**

- Export tidak menyertakan grafik, hanya data numerik.  
- Sorting default: Item Terjual DESC.  
- Jika data kosong → tetap generate file dengan header.

3. **Kategori Produk**

   Menampilkan performa penjualan berdasarkan kategori produk dalam periode tertentu, agar merchant bisa:

* Mengetahui kategori paling laku  
* Membandingkan kontribusi tiap kategori  
* Mengevaluasi strategi produk & stok

  ## **3.1 Requirement Fungsional**

  ### Filter & Kontrol:

1. Outlet  
   * Single select  
   * Default: outlet aktif user  
2. Rentang Tanggal  
   * Preset: Hari ini, Kemarin, 7/30/60/90 hari terakhir, Bulan ini  
   * Custom date range  
3. Aksi  
   * Tombol Ekspor (Excel)

     ### **3.2 Summary Data (Implicit)**

     Tidak perlu card summary terpisah seperti “Item Terjual”, karena fokusnya per kategori (Data total sudah terwakili di grafik & tabel).

     ### **3.3 Grafik Penjualan**

* Tipe: Line chart  
* X-axis: Tanggal  
* Y-axis: Total Penjualan Kotor (Rp)  
* Series:  
  * 1 line \= 1 kategori  
  * Termasuk kategori “Tanpa Kategori” jika ada  
* Tooltip:  
  * Nama kategori  
  * Tanggal  
  * Total penjualan

  ### **3.4 Tabel Penjualan per Kategori**

    Kolom:

1. No  
2. Nama Kategori  
3. Item Terjual  
4. Total Penjualan Kotor

   Sorting:

* Default: Total Penjualan Kotor (desc)

  ### **3.5 Ekspor Laporan (Excel)**

  Isi file:

* Metadata:  
  * Tipe Laporan: *Penjualan Produk Berdasarkan Kategori*  
  * Periode Tanggal  
* Data utama:  
  * Outlet  
  * Nama Kategori  
  * Item Terjual  
  * Total Penjualan

  ## **3.6 Flow Pengguna**

1. User buka Laporan → Kategori Produk  
2. Sistem load data default:  
   * Outlet aktif  
   * Rentang tanggal default  
3. Sistem:  
   * Ambil transaksi sukses  
   * Group by kategori produk  
   * Hitung:  
     * Total item terjual  
     * Total penjualan kotor  
4. Data ditampilkan:  
   * Grafik tren per kategori  
   * Tabel ringkasan kategori  
5. User opsional:  
   * Ubah rentang tanggal  
   * Ekspor laporan ke Excel

     ## **3.7 Flow Sistem (Data)**

1. Ambil `orders` (status: paid / completed)  
2. Join:  
   * order\_items  
   * products  
   * categories (LEFT JOIN → handle *Tanpa Kategori*)  
3. Group by:  
   * kategori  
   * tanggal (untuk grafik)  
4. Aggregate:  
   * `SUM(quantity)`  
   * `SUM(subtotal)`

   ## **3.8 Source Value (Data Source)**

| Data | Source |
| ----- | ----- |
| Outlet | `outlets` |
| Transaksi | `orders` |
| Item pesanan | `order_items` |
| Produk | `products` |
| Kategori | `categories` |
| Item Terjual | `SUM(order_items.qty)` |
| Total Penjualan | `SUM(order_items.subtotal)` |
| Tanpa Kategori | `products.category_id IS NULL` |

4. **Arus Stok**

   ## **4.1 Requirement**

   ### **A. Functional Requirement**

1. User dapat melihat laporan arus stok berdasarkan:  
   * Outlet (default: outlet aktif)  
   * Rentang tanggal  
   * Kategori bahan dasar  
   * Mode tampilan: Satuan atau Harga (Rupiah)  
2. Sistem menampilkan data per bahan dasar.  
3. Sistem menghitung otomatis:  
   * Stok Awal  
   * Total Penjualan/Pemakaian  
   * Total Penambahan Stok  
   * Total Pengeluaran Stok  
   * Penyesuaian Stok Opname  
   * Stok Akhir  
4. User dapat mengekspor laporan ke file (Excel).  
5. Jika tidak ada data, tampilkan state “Tidak Ada Data”.

   ### **B. Non-Functional Requirement**

1. Perhitungan harus konsisten dengan histori mutasi stok.  
2. Performa tetap stabil untuk data periode panjang.  
3. Angka dibulatkan & diformat sesuai satuan atau rupiah.  
4. Akses dibatasi sesuai role (owner/admin).

   ## **4.2. Flow**

   ### **Flow Utama**

1. User membuka menu Laporan → Arus Stok.  
2. Sistem load default:  
   * Outlet aktif  
   * Periode: 7 hari terakhir  
   * Kategori: Semua  
   * Tampilan: Satuan  
3. User dapat mengubah filter:  
   * Tanggal  
   * Kategori bahan dasar  
   * Mode tampilan (Satuan / Harga)  
4. Sistem memproses data mutasi stok sesuai filter.  
5. Tabel laporan ditampilkan.  
6. User dapat klik Ekspor untuk unduh laporan.

   ### **Flow Ekspor**

1. User klik tombol Ekspor.  
2. Sistem generate file Excel.  
3. File berisi:  
   * Header laporan  
   * Informasi outlet & tanggal  
   * Tabel arus stok  
4. File otomatis terunduh.

   ## **4.3. Source Value (Data Source)**

   ### **A. Data Utama**

* **Bahan Dasar**  
  * `id`  
  * `nama_bahan`  
  * `tipe_bahan`  
  * `kategori`  
  * `satuan`  
* **Mutasi Stok**  
  * `tanggal`  
  * `bahan_id`  
  * `tipe_mutasi` (penjualan, penambahan, pengeluaran, opname)  
  * `qty`  
  * `harga_satuan` (opsional, untuk mode harga)  
* **Outlet**  
  * `outlet_id`

    ### **B. Perhitungan**

* **Stok Awal**  
   → akumulasi stok sebelum tanggal mulai  
* **Penjualan**  
   → mutasi tipe `penjualan`  
* **Penambahan**  
   → mutasi tipe `penambahan`  
* **Pengeluaran**  
   → mutasi tipe `pengeluaran`  
* **Stok Opname**  
   → selisih hasil opname  
* **Stok Akhir**  
   → stok awal \+ penambahan − pengeluaran ± opname

  ### **C. Mode Tampilan**

* **Satuan** → tampilkan dalam qty  
* **Harga (Rupiah)** → `qty × harga_satuan`

  ## **4.4. Output (Tampilan & Ekspor)**

  ### **Kolom Tabel**

* Nama Bahan Dasar  
* Tipe Bahan Dasar  
* Kategori  
* Satuan  
* Mulai  
* Penjualan  
* Penambahan  
* Pengeluaran  
* Stok Opname  
* Akhir

  Pada mode **Harga**, kolom nilai ditampilkan dalam Rupiah.

5. **Laba Kotor**

   Menampilkan laba kotor berdasarkan:

* Menu  
* Varian  
* Kategori

  Dalam rentang tanggal & outlet tertentu, lengkap dengan filter dan export.

  **5.1 Requirement**

  ### **A. Filter (Input)**

  Wajib:

* Outlet (default: outlet aktif user)  
* Rentang tanggal (start\_date – end\_date)

  Opsional:

* Tab view: `Menu | Varian | Kategori`  
* Dropdown:  
  * Menu / Varian / Kategori (multi-select, default: Semua)  
* Filter Margin Laba Kotor:  
  * Operator: `<=`, `>=`, `=`  
  * Nilai persen (%)

    ### **B. KPI Summary (Top Card)**

    Dihitung berdasarkan filter aktif  
* Penjualan Kotor  
* Penjualan Bersih  
* Laba Kotor  
* Total Terjual  
   (menu / varian / kategori sesuai tab)

  ### **C. Tabel Data**

  #### **Tab Menu**

  Kolom:

* Nama Produk  
* Kategori  
* Terjual  
* Penjualan Kotor  
* Penjualan Bersih  
* HPP  
* Laba Kotor  
* Margin Laba Kotor (%)

  #### **Tab Varian**

  Kolom:

* Nama Opsi Varian  
* Nama Varian  
* Terjual  
* Penjualan Kotor  
* Penjualan Bersih  
* HPP  
* Laba Kotor  
* Margin Laba Kotor (%)

  #### **Tab Kategori**

  Kolom:

* Nama Kategori  
* Terjual  
* Penjualan Kotor  
* Penjualan Bersih  
* HPP  
* Laba Kotor  
* Margin Laba Kotor (%)

  ### **D. Export**

* Format: Excel (.xlsx)  
* Isi:  
  * Header (tipe laporan, outlet, tanggal)  
  * Data sesuai tab aktif  
  * Nilai tanpa formatting UI (raw number)  
    **5.2 Flow Sistem**

    ### **Flow Data Utama**

1. User buka Laporan → Laba Kotor  
2. Sistem load:  
   * Outlet aktif  
   * Default tanggal (7 hari terakhir)  
   * Tab `Menu`  
3. User ubah filter (tanggal / tab / dropdown / margin)  
4. Frontend hit API laporan  
5. Backend:  
   * Query transaksi  
   * Hitung agregasi  
   * Return summary \+ table  
6. Frontend render:  
   * KPI  
   * Tabel  
7. User klik Export  
8. Backend generate Excel → download

   **5.3 Rumus Perhitungan (Wajib Konsisten)**

   `Penjualan Kotor = SUM(qty * harga)`

   `Penjualan Bersih = Penjualan Kotor - diskon`

   `HPP = SUM(qty * hpp)`

   `Laba Kotor = Penjualan Bersih - HPP`

   `Margin Laba Kotor (%) = (Laba Kotor / Penjualan Bersih) * 100`

   Jika `Penjualan Bersih = 0` → margin \= 0

   **5.4 Struktur Data (Minimal)**

   **orders**

   `- id`

   `- outlet_id`

   `- order_date`

   `- status`

   **order\_items**

   `- order_id`

   `- product_id`

   `- variant_id`

   `- category_id`

   `- qty`

   `- price`

   `- hpp`

   `- discount`

   **5.5 Contoh API Spec**

   ### **Endpoint**

   `GET /api/reports/gross-profit`

   ### **Query Params**

   `outlet_id`

   `start_date`

   `end_date`

   `view=menu|variant|category`

   `ids[]=optional (menu/variant/category)`

   `margin_op=<=|>=|=`

   `margin_value=number`

   **5.6 Contoh Query SQL (Ringkas)**

   ### **View: Menu**

   `SELECT`

     `p.name AS product_name,`

     `c.name AS category_name,`

     `SUM(oi.qty) AS terjual,`

     `SUM(oi.qty * oi.price) AS penjualan_kotor,`

     `SUM(oi.qty * oi.price - oi.discount) AS penjualan_bersih,`

     `SUM(oi.qty * oi.hpp) AS hpp,`

     `SUM((oi.qty * oi.price - oi.discount) - (oi.qty * oi.hpp)) AS laba_kotor`

   `FROM order_items oi`

   `JOIN orders o ON o.id = oi.order_id`

   `JOIN products p ON p.id = oi.product_id`

   `LEFT JOIN categories c ON c.id = oi.category_id`

   `WHERE o.outlet_id = :outlet_id`

     `AND o.order_date BETWEEN :start AND :end`

   `GROUP BY p.id, c.id;`

   **Margin dihitung di backend layer (biar aman dari divide by zero).**

   **5.7. Contoh Backend Logic (Pseudo JS)**

   `data.map(row => {`

     `const margin =`

       `row.penjualan_bersih > 0`

         `? (row.laba_kotor / row.penjualan_bersih) * 100`

         `: 0;`

   

     `return {`

       `...row,`

       `margin_laba_kotor: Number(margin.toFixed(2))`

     `};`

   `});`

   **5.8 Notes**

- Summary & table wajib dari source query yang sama  
- Filter margin setelah agregasi  
- Export pakai data final (bukan hit ulang)  
- Tab Menu / Varian / Kategori hanya beda GROUP BY

6. **Pembatalan/ Void**

   ## **6.1. Requirement Fitur – Laporan Pembatalan / Void**

   Memberikan visibilitas ke merchant terkait:

* Jumlah transaksi yang dibatalkan (void)  
* Total nominal kerugian akibat void  
* Detail transaksi void untuk audit & evaluasi operasional

  ### Aktor

* Owner  
* Admin  
* Supervisor  
   (dengan akses laporan)

  ### Komponen UI

1. Filter  
   * Rentang tanggal (date range \+ preset: hari ini, 7 hari terakhir, dll)  
   * Staff (single / multi-select, default: Semua Staff)  
   * Mode tampilan:  
     * Total View → agregasi total  
     * Date View → breakdown per tanggal  
2. Summary Card  
   * Total Void (jumlah item / transaksi)  
   * Jumlah Nominal Void (Rp)  
3. Chart  
   * Visualisasi nominal void  
   * Menyesuaikan mode:  
     * Total View → agregat  
     * Date View → per tanggal  
4. Tabel Detail  
   * Tanggal  
   * Jam  
   * Nama Staff (atau N/A)  
   * Produk  
   * Kategori  
   * Jumlah  
   * Harga (nominal void)  
5. Export  
   * Format Excel  
   * Mengikuti filter & mode aktif

     ## **6\. 2\. Flow Fitur (End-to-End)**

     ### Flow Utama

1. User membuka menu Laporan → Pembatalan / Void  
2. Sistem set default:  
   * Date range: 7 hari terakhir  
   * Staff: Semua Staff  
   * Mode: Total View  
3. Frontend request data ke backend sesuai filter  
4. Backend:  
   * Ambil data transaksi dengan status `VOID`  
   * Filter berdasarkan outlet, tanggal, dan staff  
   * Hitung agregasi & detail  
5. Frontend menampilkan:  
   * Summary card  
   * Chart  
   * Tabel detail

     ### Flow Ganti Filter

1. User ubah tanggal / staff  
2. Klik Total View atau Date View  
3. Frontend kirim request ulang  
4. Data diperbarui secara real-time

   ### Flow Export

1. User klik Ekspor  
2. Backend generate file Excel berdasarkan:  
   * Filter aktif  
   * Mode tampilan (Total / Date)  
3. File di-download oleh user

   ## **6.3. Source Data/ Source of Truth**

   ### **Sumber Utama**

* Tabel Transaksi / Orders  
  * status \= `VOID` / `CANCELLED`  
  * created\_at / voided\_at  
  * outlet\_id  
  * staff\_id (nullable)  
* Tabel Order Items  
  * product\_name  
  * category\_name  
  * qty  
  * price  
* Tabel Users / Staff  
  * staff\_id  
  * staff\_name

    ### Field Penting (Logical)

* void\_at → tanggal & jam  
* staff\_name → fallback `N/A`  
* qty  
* price  
* subtotal \= qty × price

  ## **6.4. Struktur Data Response (Simplified)**

  ### **Summary**

  `{`

    `"total_void": 3,`

    `"total_nominal_void": 55000`

  `}`

  ### **Detail List**

  `[`

    `{`

      `"date": "2026-02-01",`

      `"time": "14:43",`

      `"staff_name": "N/A",`

      `"product_name": "The Og Bits Fullbox",`

      `"category": "Kukibits",`

      `"qty": 1,`

      `"price": 45000`

    `}`

  `]`

  ## **6.5. Catatan Penting**

* Void dihitung per item, bukan hanya per transaksi  
* Tidak ada perhitungan laba → murni nominal pembatalan  
* Tidak butuh source eksternal (gratis, internal system only)  
* Konsisten dengan laporan lain (Laba Kotor, Penjualan)  
7. **Kirim Laporan**

   ## **7.1. REQUIREMENT**

   ### **A. Functional Requirement**

   #### **List Kirim Laporan**

* Menampilkan daftar laporan terjadwal  
* Kolom:  
  * Nama Laporan  
  * Jenis Laporan  
     (mis: Ekspor Berdasarkan Pesanan, Item, Void, dll)  
  * Format: Harian / Mingguan / Bulanan  
  * Waktu Kirim  
  * Email Tujuan  
  * Status: Aktif / Tidak Aktif  
  * Aksi: Edit | Nonaktifkan / Aktifkan

    #### **Tambah Penjadwalan**

    Field wajib:  
* Email Tujuan (multiple, dipisah `,`)  
* Jenis Laporan  
* Format:  
  * Harian → Jam  
  * Mingguan → Hari \+ Jam  
  * Bulanan → Tanggal (1 / 15 / Akhir Bulan) \+ Jam  
* Nama Laporan

  Behaviour:

* Setelah simpan → popup “Berhasil membuat laporan”  
* Laporan auto aktif (default aktif)

  #### **Edit Penjadwalan**

* Semua field bisa diubah  
* Status tidak berubah kecuali user ubah manual

  #### **Aktif / Nonaktif**

* Toggle status di row  
* Jika nonaktif → laporan tidak dikirim via email

  #### **Filter & Search**

* Search: nama laporan / email  
* Filter status: Semua | Aktif | Tidak Aktif

  ### **B. Non-Functional Requirement**

* Scheduler berjalan otomatis (cron / background job)  
* Email terkirim walau user tidak login  
* Aman (validasi email & role)

  ## **7.2. FLOW SISTEM**

  ### **A. Flow Tambah Kirim Laporan**

1. User buka Kirim Laporan  
2. Klik Tambah Penjadwalan  
3. Isi form  
4. Klik Simpan  
5. Backend:  
   * Simpan ke DB  
   * Status \= `ACTIVE`  
6. Frontend:  
   * Tampilkan popup sukses  
   * Redirect ke list  
7. Scheduler otomatis membaca config ini

   ### **B. Flow Pengiriman Otomatis Email**

1. Scheduler jalan (tiap menit / jam)  
2. Cari laporan:  
   * status \= ACTIVE  
   * waktu kirim \= sekarang  
3. Generate laporan (query DB)  
4. Export file (Excel / CSV)  
5. Kirim ke email tujuan  
6. Simpan log pengiriman (opsional)

   ### **C. Flow Nonaktifkan Laporan**

1. User klik toggle Nonaktif  
2. Status di DB → `INACTIVE`  
3. Scheduler skip laporan tersebut

   ## **7.3. STRUKTUR DATABASE (SIMPLE)**

   `report_schedules`

   `- id`

   `- outlet_id`

   `- report_type        -- order / item / void / dll`

   `- format             -- daily | weekly | monthly`

   `- schedule_day       -- mon / tue / 1 / 15 / end`

   `- schedule_time      -- 07:00`

   `- emails             -- text (comma separated)`

   `- report_name`

   `- status             -- ACTIVE | INACTIVE`

   `- created_at`

   `- updated_at`

   ## **7.4. CONTOH SOURCE CODE (Backend – Express)**

   ### **A. Create Schedule**

   `POST /api/report-schedules`

   

   `req.body = {`

     `reportType: "ORDER",`

     `format: "MONTHLY",`

     `scheduleDay: "1",`

     `scheduleTime: "07:00",`

     `emails: "a@gmail.com,b@gmail.com",`

     `reportName: "Laporan Penjualan Bulanan"`

   `}`

   

   `await ReportSchedule.create({`

     `outlet_id,`

     `report_type,`

     `format,`

     `schedule_day,`

     `schedule_time,`

     `emails,`

     `report_name,`

     `status: 'ACTIVE'`

   `});`

   ### **B. Toggle Status**

   `PATCH /api/report-schedules/:id/status`

   

   `schedule.status =`

     `schedule.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';`

   `await schedule.save();`

   ### **C. Scheduler (Cron Job)**

   `cron.schedule('* * * * *', async () => {`

     `const schedules = await ReportSchedule.findAll({`

       `where: { status: 'ACTIVE' }`

     `});`

   

     `for (const s of schedules) {`

       `if (isTimeToSend(s)) {`

         `const file = await generateReport(s);`

         `await sendEmail(s.emails, file);`

       `}`

     `}`

   `});`

   ### **D. Kirim Email**

   `await transporter.sendMail({`

     `to: emails.split(','),`

     `subject: report_name,`

     `attachments: [{ filename: 'report.xlsx', content: file }]`

   `});`

   ## **7.5. Notes**

* Mungkin bisa pakai pakai email SMTP biar gratis kirim ke gmail nya(?)

8. **Unduh Laporan**

   ## **8.1 REQUIREMENT (Unduh Laporan)**

   ### **A. Functional Requirement**

1. User bisa pilih:  
   * Range tanggal (maks. 90 hari)  
   * Tipe laporan:  
     * Ekspor Berdasarkan Pesanan  
     * Laporan Saldo  
     * Ekspor Berdasarkan Item  
     * Penjualan Harian Berdasarkan Produk  
2. Sistem generate file Excel (.xlsx) sesuai tipe laporan  
3. File:  
   * Bisa langsung di-download dari device yang digunakan  
4. Validasi:  
   * Tanggal wajib diisi  
   * Tipe laporan wajib dipilih  
   * Disable tombol ekspor kalau belum lengkap

     ### **B. Non-Functional Requirement**

* File aman (readonly / protected view)  
* Nama file konsisten & jelas  
* Proses async (user gak nunggu lama di UI)  
* Bisa handle data besar (ribuan row)

  ## **8.2 FLOW (Unduh Laporan)**

  ### **Flow Utama**

1. **User buka menu Unduh Laporan**  
2. User pilih:  
   * Range tanggal  
   * Tipe laporan  
3. User klik Ekspor Laporan  
4. Backend:  
   * Ambil data sesuai filter  
   * Generate Excel  
5. Sistem:  
   * ⬇️ Download otomatis

     ### **Flow Teknis (Backend)**

     **`Request Ekspor`**  
     `→ Validasi input`  
     `→ Query DB`  
     `→ Generate Excel`  
     `→ Simpan`  
     `→ Response sukses`

     ## **8.3 SOURCE VALUE / DATA SOURCE**

     **Source value full dari database transaksi.**

     ### Data Utama:

* Outlet  
* Order / Invoice  
* Order Item  
* Payment  
* Staff / Kasir  
* Shift  
* Void / Refund  
* Saldo (Cash, EDC, dll)

  ## **TIAP TIPE LAPORAN (Excel)**

  ### **A. Ekspor Berdasarkan Pesanan**

  1 baris \= 1 order

  Contoh kolom penting:

* Outlet  
* Nomor Faktur  
* Tanggal & Waktu  
* Status Pesanan  
* Metode Pembayaran  
* Total Penjualan  
* Diskon  
* Refund  
* Net Product  
* Nama Pelanggan  
* Nomor Telepon  
* Nama Kasir  
* Shift

  ### **B. Ekspor Berdasarkan Item**

  1 baris \= 1 item dalam order

  Kolom:

* Outlet  
* Nomor Faktur  
* Item  
* SKU  
* Variant  
* Kategori  
* Kuantitas  
* Harga Produk  
* Diskon  
* Net Product

  ### **C. Laporan Saldo**

  1 baris \= aktivitas saldo

  Kolom:

* Outlet  
* Tipe (Buka Kasir / Ganti Kasir)  
* Waktu  
* Metode Pembayaran  
* Total Pencatatan  
* Deskripsi

  ### **D. Penjualan Harian Berdasarkan Produk**

  Aggregate per hari \+ produk

  Kolom:

* Tanggal  
* Produk  
* Total Terjual  
* Total Pendapatan  
9. **Riwayat Pesanan**

   ## **9.1 Functional Requirements**

   ### A. Data yang Ditampilkan (List View)

   Setiap baris pesanan menampilkan:

* Pelanggan (Nama \+ No Telp)  
* Nomor Order (unique)  
* Tipe Pemenuhan  
   (Makan Ditempat, GrabExpress, GoFood, dll)  
* Tanggal Pesanan  
* Total Harga  
* Metode Pembayaran  
   (Tunai, QRIS, E-Wallet, dll)  
* Status  
   (Belum Dibayar, Siap Diproses, Sudah Dikirim, Selesai, Gagal)  
* Action:  
  * 👁 Lihat Detail  
  * 🗑 Hapus (dengan validasi)

    ### B. Filter & Pencarian

    Filter yang tersedia:

* Search: Nama / No Telp / Nomor Order  
* Status Pesanan (multi option)  
* Metode Pembayaran (multi option)  
* Tipe Pemenuhan (multi option)  
* Range Tanggal

  Default:

* Semua filter \= “Semua”  
* Tanggal \= hari ini

  ### C. Detail Pesanan

  Menampilkan:

* Informasi pelanggan  
* Status \+ tanggal selesai  
* Kurir (jika ada)  
* Metode pembayaran  
* Daftar item \+ qty \+ harga  
* Subtotal, diskon, ongkir, total  
* Alamat & catatan pelanggan  
* Link invoice

  ### D. Ubah Tanggal Pesanan

  Rules:

* HANYA bisa untuk pesanan berstatus **`Selesai`**  
* Bisa multi-select  
* User memilih:  
  * Tanggal  
  * Jam  
* Setelah simpan:  
  * Update `completed_at`  
  * Muncul toast sukses

    Validasi:

* Jika ada pesanan belum selesai → disable / error message

  ### E. Hapus Pesanan

  Rules & Validasi:

* Bisa single atau multi-select  
* Wajib konfirmasi:  
   “Pesanan yang dihapus tidak dapat dikembalikan”  
* Validasi:  
  * Tidak boleh hapus pesanan `Belum Dibayar` / `Siap Diproses`  
  * Boleh hapus `Selesai` / `Gagal`  
* Sistem menyimpan:  
  * deleted\_by  
  * deleted\_at  
  * alasan (optional)

    ## **9.2 Flow Sistem (End-to-End)**

    ### **Flow Utama**

1. User buka Laporan → Riwayat Pesanan  
2. Sistem load data default (hari ini)  
3. User:  
   * Filter / search  
   * Lihat detail  
   * Pilih pesanan (checkbox)  
4. Action:  
   * Ubah Tanggal → validasi status → simpan  
   * Hapus Pesanan → konfirmasi → soft delete

     ### **Flow Validasi Hapus**

     `User klik Hapus`

     `→ Sistem cek status`

     `→ Jika status tidak valid → error`

     `→ Jika valid → modal konfirmasi`

     `→ Soft delete`

     `→ Refresh list`

     ## **9.3 Notes**

* Hapus \= soft delete  
* Ubah tanggal \= update `completed_at`  
* Semua action dicatat di audit log

**B. Menu**

1. **Produk**

   ## **1.1 REQUIREMENT (Fungsional)**

   ### **A. Halaman Produk (List)**

   **Fungsi utama**  
* Menampilkan daftar produk per outlet  
* Filter:  
  * Tab status: Aktif / Tidak Aktif / Semua  
  * Search by nama produk  
* Aksi per produk:  
  * Ubah produk  
  * Toggle status jual (Dijual/ Tidak Dijual)  
* Informasi ditampilkan:  
  * Foto utama  
  * Nama produk  
  * Kategori  
  * Harga  
  * Harga coret (opsional)  
  * Status jual  
  * Sisa stok  
  * Status stok (aktif / tidak)  
    **Validasi**  
* Produk Tidak Dijual tidak muncul di POS / checkout  
* Produk stok habis tidak bisa dipesan (jika stok diaktifkan)  
* Produk bisa di nonaktifkan dengan fitur edit/ubah

  ### **B. Tambah / Ubah Produk**

  **UI & field IDENTIK, beda di:**

* Tambah → insert data  
* Ubah → update data

  **Field-field:**

* Nama Produk  
* Harga Produk  
* Kategori  
* Status jual (aktif/tidak)  
* Foto produk (max 5\)  
* Deskripsi  
* Harga coret  
* Harga per channel (GoFood / GrabFood / ShopeeFood)  
* Barcode  
* SKU (Stock Keeping Unit)  
* Varian  
* Pajak  
* Service fee  
* Biaya bawa pulang  
* Stok & batas stok  
* Dimensi pengiriman

  **Validasi**

* Nama produk unik per outlet  
* Harga \> 0  
* Jika stok aktif → qty wajib  
* Tidak bisa hapus produk jika:  
  * Pernah dipakai di transaksi (soft delete)

  ## **1.2. FLOW (Alur Singkat)**

    ### **A. Flow List Produk**

    `User buka Menu Produk`

    `→ System load produk by outlet`

    `→ Filter tab (aktif/tidak/semua)`

    `→ User search / toggle status`

    `→ Update langsung ke DB`

    ### **B. Flow Tambah Produk**

    `Klik "Tambah Produk"`

    `→ Isi form (sama dengan edit)`

    `→ Validasi field`

    `→ Simpan`

    `→ Produk muncul di list`

    ### **C. Flow Ubah Produk**

    `Klik icon edit`

    `→ Load data produk`

    `→ User ubah field`

    `→ Simpan`

    `→ Update data produk`

    ### **D. Flow Hapus Produk**

    `Klik "Hapus Produk"`

    `→ Validasi:`

       `- Jika sudah ada transaksi → tidak boleh hard delete`

    `→ Soft delete (is_active = false)`

    `→ Produk pindah ke tab Tidak Aktif`

  ## **1.3. SOURCE VALUE (Mapping Data ke Tabel)**

  ### **A. products**

| Field UI | Source |
| ----- | ----- |
| Nama Produk | products.name |
| Deskripsi | products.description |
| Harga | products.price |
| Harga Coret | products.compare\_price |
| Status Dijual | products.is\_active |
| Barcode | products.barcode |
| SKU | products.sku |
| Hitung Dimensi | products.use\_dimension |
| Aktifkan Stok | products.use\_stock |
| Batas Stok | products.stock\_limit |
| Pajak Aktif | products.tax\_id |
| Service Fee Aktif | products.service\_fee\_id |
| Biaya Bawa Pulang | products.takeaway\_fee |

  ### **B. product\_images**

| UI | Source |
| ----- | ----- |
| Foto Produk | product\_images.url |
| Foto Utama | product\_images.is\_primary |

  ### **C. categories**

| UI | Source |
| ----- | ----- |
| Kategori Produk | categories.name |

  (relasi: `product_categories.product_id`)

  ### **D. product\_prices (multi channel)**

| UI | Source |
| ----- | ----- |
| Harga Default | product\_prices.price (channel \= POS) |
| Harga GoFood | product\_prices.price (channel \= gofood) |
| Harga GrabFood | product\_prices.price (channel \= grabfood) |
| Harga ShopeeFood | product\_prices.price (channel \= shopeefood) |

  ### **E. product\_stock**

| UI | Source |
| ----- | ----- |
| Sisa Stok | product\_stock.quantity |
| Status Stok | product\_stock.is\_active |

  ### **F. variants (jika ada)**

| UI | Source |
| ----- | ----- |
| Nama Varian | variants.name |
| Harga Varian | variant\_options.price |

  ## **1.4. Notes**

* Tambah & Ubah \= 1 form, 1 schema  
* Jangan hard delete produk → audit & laporan aman  
* Harga per channel override, bukan replace harga utama  
* Produk non-aktif tetap muncul di laporan  
2. **Varian**

   ## **2.1. Goals**

   Menu Varian digunakan untuk mengelola opsi tambahan produk (contoh: topping, ukuran, paket) yang nantinya diterapkan ke Produk, baik dibuat custom maupun mengambil dari Buku Menu (Produk).

   ## **2.2. Halaman dalam Menu Varian**

1. Daftar Varian  
2. Tambah Varian  
3. Ubah Varian

   ## **2.3. Requirement Fungsional**

   ### **2.3.1 Daftar Varian**

   Menampilkan daftar seluruh varian yang tersedia.  
   **Kolom di halaman depan:**  
* Nama Varian  
* Status:  
  * Wajib / Tidak Wajib  
* Total Opsi  
* Penerapan Produk:  
  * Belum Diterapkan  
  * Sudah Diterapkan  
* Aktif  
* Aksi:  
  * Edit  
  * Hapus

    **Fitur tambahan:**

* Search varian  
* Toggle aktif / non-aktif (dengan aturan tertentu, lihat poin 6\)

  ### **2.3.2 Tambah / Ubah Varian – Informasi Dasar**

  Field:

* Nama Varian \*  
* Batas maksimal opsi:  
  * Tidak ada batas  
  * Dibatasi (angka)  
* Status pemilihan:  
  * Wajib  
  * Tidak Wajib

  ## **2.4. Pilih Opsi Form (WAJIB)**

    User wajib memilih satu sumber opsi, dan tidak bisa diubah setelah varian disimpan.

    ### Opsi:

1. Buat Opsi Varian Sendiri  
2. Pilih Opsi dari Buku Menu

   Info helper:  
    *Pilihan opsi yang dipilih tidak dapat diubah setelah melakukan penyimpanan.*

   ## **2.5. Behaviour Berdasarkan Sumber Opsi**

   ### **2.5.1 Opsi Varian Sendiri**

   Opsi dibuat dan dikelola langsung di menu varian.

   Field per opsi:

* Nama opsi  
* Harga  
* Harga per channel:  
  * GrabFood  
  * GoFood  
  * ShopeeFood  
* Pengaturan stok:  
  * Aktifkan batas stok  
  * Sisa stok  
* Status aktif

  Hak Akses:

* Bisa aktif / non-aktif langsung di halaman varian  
* Bisa edit harga & stok  
* Bisa hapus opsi

  ### **2.5.2 Opsi dari Buku Menu**

  Opsi diambil dari Produk yang sudah ada.

  Sumber data:

* Nama opsi → Nama produk  
* Harga → Harga produk  
* Harga channel → Harga produk per channel  
* Status aktif → Status produk

  Behaviour khusus:

* Toggle aktif DISABLED  
* Harga READ ONLY

  Pesan helper (wajib):

  *Opsi ini berasal dari Menu Produk.*  
   *Untuk mengubah status aktif/non-aktif, silakan kelola dari Menu Produk.*

  ## **2.6. Aturan Aktif / Non-Aktif (IMPORTANT)**

| Kondisi | Perilaku |
| ----- | ----- |
| Opsi varian buatan sendiri | Bisa aktif / non-aktif di menu varian |
| Opsi dari buku menu | Tidak bisa diubah (disabled) |
| Produk non-aktif | Otomatis non-aktif sebagai opsi |
| Varian non-aktif | Tidak tampil di menu penjualan |
| Varian sudah diterapkan | Tidak boleh ganti source opsi |

  ## **2.7. Flow Utama**

  ### Flow Tambah Varian

1. User klik Tambah Varian  
2. Isi informasi dasar  
3. Pilih Opsi Form  
4. Tambah / pilih opsi  
5. Klik Simpan  
6. Varian masuk ke daftar → status Aktif

   ### **Flow Terapkan Varian ke Produk**

1. Masuk ke Menu Produk  
2. Edit produk  
3. Pilih varian  
4. Simpan  
5. Varian tampil di menu penjualan

   ## **2.8. Source Value (Teknis)**

| Data | Source |
| ----- | ----- |
| Varian | `variants` |
| Opsi manual | `variant_options` |
| Opsi dari produk | `products` |
| Relasi produk-varian | `product_variants` |
| Status aktif | `is_active` |
| Stok opsi | `variant_option_stocks` |

   

   ## **2.9. Notes:**

1. Source opsi tidak bisa diubah setelah simpan  
2. Opsi dari produk read-only  
3. Produk adalah single source of truth  
4. Non-aktif produk → non-aktif opsi otomatis  
5. Varian non-aktif → tidak muncul di menu  
3. **Kategori**  
4. **Master Produk**  
5. **Master Varian**  
6. **Master Kategori**

**C. Inventory**  
**D. Pelanggan**  
**E. Manajemen Meja**  
**F. Integrasi**