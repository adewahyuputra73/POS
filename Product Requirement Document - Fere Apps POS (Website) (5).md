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

   ## **3.1. Requirement Fungsional**

   ### **A. Halaman List Kategori**

   Fungsi:  
* Menampilkan daftar kategori  
* Filter berdasarkan:  
  * Aktif  
  * Tidak Aktif  
  * Semua  
* Pencarian berdasarkan nama kategori

  Data yang ditampilkan:

* Nama kategori  
* Jumlah produk terkait  
* Status (aktif / tidak aktif)  
* Aksi: Edit

  Aturan:

* Toggle Aktif / Tidak Aktif hanya mengubah status kategori  
* Produk di dalam kategori tidak ikut berubah status  
* Default sorting: kategori aktif lebih dulu

  ### **B. Tambah Kategori**

  Field:  
* Nama Kategori (mandatory)  
* Pilih Produk untuk Kategori (opsional, multi-select)

  Aturan:

* Minimal boleh menyimpan kategori tanpa produk  
* Produk dipilih via modal “Tambah Produk”  
* Produk bisa berasal dari kategori lain (many-to-many)

  Default Value:

* Status kategori: Aktif  
* Produk baru ditambahkan → langsung aktif di kategori

  ### **C. Edit Kategori**

  Behavior:  
* Halaman & komponen sama persis dengan Tambah Kategori  
* Data terisi dari existing category  
* Bisa:  
  * Ubah nama kategori  
  * Tambah / hapus produk dari kategori  
  * Ubah status aktif / non-aktif kategori

  ## **3.2. Flow Pengguna**

  ### **Flow List Kategori**

1. User buka Menu → Kategori  
2. Sistem load kategori by outlet  
3. User:  
   * Filter status  
   * Cari kategori  
   * Toggle aktif / tidak aktif  
   * Klik edit

   ### **Flow Tambah Kategori**

1. Klik Tambah Kategori  
2. Input nama kategori  
3. (Opsional) Klik Tambah Produk  
4. Modal produk muncul → user pilih produk → Tambah  
5. Klik Simpan  
6. Sistem simpan kategori \+ relasi produk  
7. Redirect ke list kategori

   ### **Flow Edit Kategori**

1. Klik icon edit pada kategori  
2. Sistem load detail kategori \+ produk terkait  
3. User ubah data  
4. Klik Simpan  
5. Data ter-update, status default tetap aktif kecuali diubah

   ## **3.3. Source Value & Data Model**

   ### Tabel `categories`

   `categories`  
   `├── id`  
   `├── outlet_id`  
   `├── name`  
   `├── is_active`  
   `├── created_at`  
   `├── updated_at`

     
   **Source Value:**  
* `name` → input user

* `is_active` → toggle (default: true)

  ### **Tabel `products`**

  `products`  
  `├── id`  
  `├── outlet_id`  
  `├── name`  
  `├── base_price`  
  `├── is_active`

  **Source Value:**  
* Digunakan sebagai master produk  
* Harga ditarik dari produk, bukan dari kategori

  ### **Tabel Relasi `category_products`**

  `category_products`  
  `├── id`  
  `├── category_id`  
  `├── product_id`  
  `├── created_at`

  **Source Value:**  
* Dibentuk saat user pilih produk di modal  
* 1 produk bisa ada di banyak kategori  
* Hapus produk dari kategori → hanya delete relasi, produk tetap ada

  ## **3.4. Aturan Status (Penting)**

* Kategori non-aktif  
  * Tidak ditampilkan di menu customer  
  * Relasi produk tetap disimpan  
* Produk non-aktif  
  * Tidak tampil walaupun kategorinya aktif  
* Status kategori ≠ status produk (dipisah jelas)

  ## **3.5. Notes**

* Kategori \= grouping logic  
* Produk \= sumber harga & availability  
* Relasi kategori–produk \= many-to-many  
* Tambah & Edit pakai form yang sama  
* Default kategori baru: aktif  
    
4. **Master Produk**  
   Fitur ini digunakan untuk mengelola Master Produk yang bisa:  
* Dibuat baru  
* Diimpor dari outlet lain  
* Digunakan ulang oleh satu atau banyak outlet  
* Menjadi dasar untuk Produk jualan \+ Vari**an**

## **4.1. Requirement Fungsional**

### **A. List Master Produk**

* Menampilkan daftar master produk  
* Filter:  
  * Semua  
  * Aktif  
  * Tidak Aktif  
* Search by nama produk  
* Informasi ditampilkan:  
  * Foto  
  * Nama produk  
  * Harga aktif  
  * Jumlah outlet terkait  
  * Terakhir diubah  
  * Status (Dijual / Tidak dijual)  
* Aksi:  
  * Toggle aktif/nonaktif  
  * Edit produk

  ### **B. Tambah Master Produk**

  User klik Tambah Produk → pilih salah satu opsi:

1. Tambah Baru Master Produk  
2. Impor Produk dari Outlet (gambar ke-8)

   ### **C. Form Tambah / Edit Master Produk**

   Halaman Edit \= sama persis dengan Tambah  
    Default produk baru: Aktif

   #### **Field Wajib**

* Foto Produk (max 5, max 5MB)  
* Nama Produk  
* Harga Produk (default/base price)

  #### **Field Opsional**

* Deskripsi Produk  
* Harga Coret  
* Harga GoFood  
* Harga GrabFood  
* Harga ShopeeFood

  #### **Relasi & Pengaturan**

* Pilih Outlet (multi-select)  
* Pilih Kategori  
* Pilih Varian (default: Tanpa Varian)

  #### **Lainnya (Toggle)**

* Hitung Dimensi Pengiriman  
* Aktifkan Batas Stok  
* Aktifkan Pajak  
* Aktifkan Service Fee  
* Aktifkan Biaya Bawa Pulang

  ### **D. Impor Master Produk dari Outlet**

* Pilih outlet sumber  
* Pilih produk (multi-select)  
* Produk yang diimpor:  
  * Disalin sebagai Master Produk baru  
  * Status default: Aktif  
* Setelah sukses:  
  * CTA: Tambah Produk ke Outlet  
  * CTA: Kembali ke Halaman Utama

  ## **4.2. Flow Utama**

  ### **Flow 1 — Tambah Master Produk Baru**

1. User buka Master Produk  
2. Klik Tambah Produk  
3. Pilih Tambah Baru Master Produk  
4. Isi form  
5. Klik Simpan  
6. Produk tersimpan → muncul di list master produk (status: Aktif)

   ### **Flow 2 — Edit Master Produk**

1. User klik icon Edit  
2. Form terbuka (value existing ter-load)  
3. User ubah data  
4. Klik Simpan  
5. Data ter-update di master produk & outlet terkait

   ### **Flow 3 — Impor Produk dari Outlet**

1. Klik Tambah Produk  
2. Pilih Impor Produk dari Outlet  
3. Pilih outlet sumber  
4. Pilih produk  
5. Klik Impor Produk  
6. Sistem:  
   * Copy data produk → master produk  
   * Set status aktif  
7. Tampilkan modal sukses

   ## **4.3. Source Value (Paling Penting)**

   ### **A. Master Produk (Core)**

   Sumber utama semua data produk.  
   Tabel: `master_products`  
* `id`  
* `name`  
* `description`  
* `is_active`  
* `created_at`  
* `updated_at`

  ### **B. Harga Produk**

  Harga disimpan terpisah per channel.  
  Tabel: `master_product_prices`  
* `master_product_id`  
* `channel`  
   (`default`, `coret`, `gofood`, `grabfood`, `shopeefood`)  
* `price`  
  Form harga diambil & disimpan dari tabel ini

  ### **C. Foto Produk**

  Tabel: `master_product_images`  
* `master_product_id`  
* `image_url`  
* `order`

  ### **D. Relasi Outlet**

  Tabel: `master_product_outlets`  
* `master_product_id`  
* `outlet_id`  
* `status`  
  Dipakai untuk:  
* Hitung “Outlet Terkait”  
* Menentukan produk aktif di outlet mana

  ### **E. Kategori**

  Tabel: `master_product_categories`  
* `master_product_id`  
* `category_id`

  ### **F. Varian**

  Tabel: `master_product_variants`  
* `master_product_id`  
* `variant_group_id`

  ### **G. Toggle / Lainnya**

  Tabel: `master_product_settings`  
* `master_product_id`  
* `use_stock_limit`  
* `use_tax`  
* `use_service_fee`  
* `use_takeaway_fee`  
* `use_dimension`

  ## **4.4. Notes**

* Produk baru & hasil impor → default aktif  
* Edit master → berdampak ke semua outlet terkait

5. **Master Varian**

   ### **4.1. Requirement**

   ## Fungsi

* ## Mengelola varian global yang bisa diterapkan ke produk.

* ## Varian bisa dibuat baru atau diimpor dari outlet.

  ## **Field Wajib**

* ## Nama Varian

* ## Wajib / Tidak Wajib

  ## **Field Opsional**

* ## Batas maksimal pilihan

* ## Opsi varian (custom / dari menu)

  ## **Aturan Penting**

* ## Opsi form tidak bisa diubah setelah disimpan

* ## Varian belum aktif ke produk sampai diterapkan

  ### **4.2. Flow Master Varian**

  #### **Tambah Master Varian**

1. ## User klik Tambah Varian

2. ## Muncul modal:

   * ## Tambah Master Varian

   * ## Impor Varian Dari Outlet

   #### **Tambah Master Varian Baru**

1. ## User isi:

   * ## Nama varian

   * ## Wajib / tidak

   * ## Batas opsi

2. ## Pilih Opsi Form:

   * ## Buat opsi sendiri

   * ## Pilih dari buku menu

3. ## Klik Simpan

4. ## Sistem:

   * ## Simpan sebagai Master Varian

   * ## Status Aktif

   * ## Penerapan produk \= Belum Diterapkan

   #### **Impor Varian Dari Outlet (gambar ke-7)**

1. ## User pilih outlet sumber

2. ## Pilih varian (single / multi)

3. ## Klik Impor Varian

4. ## Sistem:

   * ## Menyalin data varian

   * ## AUTO AKTIF

   * ## Langsung tersedia di Master Varian

5. ## Tampilkan notifikasi sukses

   ### **4.3. Source Value Master Varian**

| Field | Source |
| ----- | ----- |
| Nama Varian | Input user / outlet |
| Wajib | Data outlet / input |
| Batas Pilihan | Data outlet / input |
| Opsi Varian | Custom / Buku Menu |
| Outlet | Dari master produk |
| Status | Aktif (auto saat impor) |
| Penerapan Produk | Manual (setelah apply ke produk) |

   ## **4.4. Notes**

* ## Produk & varian hasil impor → otomatis aktif

* ## Varian tidak otomatis diterapkan ke produk

* ## Outlet pada varian mengikuti outlet di master produk

* ## Status aktif/nonaktif tidak menghapus data

* ## Edit varian tidak boleh ubah tipe opsi

6. **Master Kategori**

   ## **6.1. Requirement**

   ### **6.1.1 Umum**

* Sistem mendukung Master Kategori (bukan kategori per outlet).  
* 1 Master Kategori bisa:  
  * Digunakan di banyak outlet  
  * Berisi banyak Master Produk  
* Status default:  
  * Aktif \= true  
* Master Kategori tidak tergantung outlet saat dibuat.

  ### **6.1.2 Fitur yang Wajib Ada**

* List Master Kategori:  
  * Tab: Aktif / Tidak Aktif / Semua  
  * Search by nama  
* Tambah Master Kategori:  
  * Buat baru  
  * Impor dari outlet  
* Edit nama kategori  
* Toggle aktif / nonaktif

  ## **6.2 Flow**

  ### **6.2.1 Tambah Master Kategori (Buat Baru)**

1. User klik Tambah Master Kategori  
2. Pilih Tambah Master Kategori  
3. User isi:  
   * Nama Master Kategori  
4. (Opsional) Pilih Master Produk  
5. Klik Simpan  
6. Sistem:  
   * Simpan kategori  
   * Set `is_active = true`

   ### **6.2.2 Tambah Master Kategori (Impor dari Outlet)**

1. User klik Tambah Master Kategori  
2. Pilih Impor Kategori dari Outlet  
3. User pilih:  
   * Outlet sumber  
   * Satu / banyak kategori  
4. Klik Impor  
5. Sistem:  
   * Clone kategori ke Master Kategori  
   * Clone relasi produk (jika ada)  
   * Set `is_active = true`

   Notes: Kategori hasil impor langsung aktif (auto aktif) tanpa toggle manual.

   ### **6.2.3 Assign Produk ke Master Kategori**

1. Dari halaman Tambah / Edit Master Kategori  
2. Klik \+ Tambah pada section *Pilih Master Produk*  
3. Pilih Master Produk  
4. Simpan → relasi tersimpan

   ### **6.2.4 Penerapan ke Outlet**

* Master Kategori tidak langsung terikat outlet  
* Kategori akan ikut diterapkan ke outlet saat:  
  * Master Produk yang menggunakan kategori tersebut  
  * Ditambahkan ke outlet

  ## **6.3 Source Value (Data Mapping)**

| Field | Source |
| ----- | ----- |
| Nama Master Kategori | Input user / outlet source |
| Status Aktif | Auto `true` |
| Produk Terkait | Master Produk (manual select) |
| Outlet | Turunan dari Master Produk |
| Terakhir Diperbarui | System timestamp |

  ## **6.4. Rules**

* Master Kategori tidak bisa dihapus jika masih dipakai produk  
* Boleh dinonaktifkan  
* Jika Master Kategori nonaktif:  
  * Tidak muncul di pilihan kategori produk  
  * Tidak menghapus relasi existing  
* Impor kategori:  
  * Selalu auto aktif  
  * Nama boleh duplikat → dibedakan oleh ID

  ## **6.5 Relasi Data (Sederhana)**

    `Master Kategori`

     `└── Master Produk (N)`

           `└── Outlet (N)`

**C. Inventory**

1. **Bahan Dasar**

   # **1.1 DEFINISI & SCOPE MODUL**

   ## **1.1.1 Modul: Inventory – Bahan Dasar**

   Bahan Dasar adalah master inventory yang merepresentasikan:  
* Bahan Mentah (Raw / Mentah)  
* Bahan Setengah Jadi  
  Digunakan oleh:  
* Resep  
* Produksi  
* Perhitungan HPP  
* Arus Stok  
* Pembelian (via Supplier)

## **1.2 DATA MASTER & RELASI (SOURCE UTAMA)**

| Entitas | Sumber |
| ----- | ----- |
| Supplier | Fitur Supplier / Master Supplier |
| Kategori | Fitur Kategori / Master Kategori |
| Bahan Mentah | Detail Bahan Mentah (Raw Material) |
| Unit & Konversi | Fitur Konversi Unit |
| Resep | Fitur Resep |

# **1.3 REQUIREMENT SISTEM**

## **1.3.1 Bahan Dasar – List Page**

### Functional Requirement

User dapat:

* Melihat list Bahan Dasar  
* Switch tab:  
  * Raw (Mentah)  
  * Setengah Jadi  
* Search berdasarkan nama bahan  
* Filter:  
  * Kategori  
  * Status stok (Semua / Masih Ada / Menipis / Habis)  
* Export Master Data (.xls)

  ### **Field yang ditampilkan**

| Field | Source |
| ----- | ----- |
| Nama Bahan Dasar | Bahan Mentah / Setengah Jadi |
| Kategori | Master Kategori |
| Total Harga | Kalkulasi stok × harga |
| Terakhir Diperbarui | Transaksi stok terakhir |
| Stok Saat Ini | Akumulasi stok |
| Status | Auto (rule stok) |
| Aksi | Edit / Detail |

  ## **1.3.2 Status Stok (Auto Rule)**

| Status | Rule |
| ----- | ----- |
| Masih Ada | Stok \> batas bawah |
| Menipis | Stok ≤ batas bawah |
| Habis | Stok \= 0 |

  Batas bawah diambil dari field *Batas Bawah* pada bahan.

  ## **1.3.3 Tambah / Ubah Bahan Dasar (Raw & Setengah Jadi)**

  ### **Field Requirement**

| Field | Mandatory | Source |
| ----- | ----- | ----- |
| Nama Item | ✅ | Input user |
| Kategori | ✅ | Master Kategori |
| Estimasi Produksi per Resep | Opsional | Input user |
| Batas Bawah | Opsional | Input user |
| Unit Dasar | ✅ | Konversi Unit |
| Status Unit (Base / Transfer / Purchase) | ✅ | Konversi Unit |


  ## **1.3.4 Konversi Unit**

  ### Functional Requirement

* Set unit dasar (Base)  
* Set unit Sedang (Transfer) dan Besar (Purchase)  
* Nilai konversi otomatis dipakai di:  
  * Pembelian  
  * Resep  
  * Pengurangan stok

  ### **Source Value**

| Field | Source |
| ----- | ----- |
| Unit | Master Konversi Unit |
| Nilai Konversi | Master Konversi Unit |


  ## **1.3.5 Detail Bahan Dasar – Stok**

  ### **Functional Requirement**

    User dapat:

* Menambah stok  
* Mengurangi stok  
* Melihat histori arus stok

  ### **Modal Tambah Stok**

| Field | Source |
| ----- | ----- |
| Jumlah | Input user |
| Harga | Input user |
| Supplier | Master Supplier |
| Unit | Auto dari konversi |
| Keterangan | Input user |

  ### **Business Rule**

* Stok bertambah → nilai stok bertambah  
* Harga tersimpan sebagai harga beli histori  
* Supplier wajib dipilih saat penambahan stok

  ## **1.3.6 Arus Stok (Log)**

  ### **Field Log**

| Field | Source |
| ----- | ----- |
| Deskripsi | Sistem |
| Keterangan | Input user |
| Harga Beli | Input |
| Jumlah | Input |
| Stok Baru | Kalkulasi |
| Nilai Stok Sekarang | Kalkulasi |
| Tanggal | System timestamp |
| User | Session user |


  # **1.4. BAHAN SETENGAH JADI – RESEP**

  ## **1.4.1 Resep Bahan Setengah Jadi**

  ### **Functional Requirement**

* Menambahkan bahan mentah ke resep setengah jadi  
* Perubahan auto-save  
* HPP dihitung realtime

  ### **Field Resep**

| Field | Source |
| ----- | ----- |
| Bahan Dasar | Detail Bahan Mentah |
| Jumlah | Input user |
| Unit | Auto dari konversi |
| Total Harga | Auto (HPP × jumlah) |

  ## **1.4.2 Modal Pilih Bahan Dasar**

* Data diambil dari Bahan Mentah (Raw)  
* Bisa multi-select  
* Searchable

  ## **1.4.3 Perhitungan HPP**

  HPP \= Σ (Harga Bahan × Qty / Konversi)

* HPP disimpan di:  
  * Bahan Setengah Jadi  
  * Digunakan oleh menu / produk

    # **1.5 FLOW END-TO-END**

    ## **1.5.1 Flow Tambah Bahan Mentah**

1. User → Inventory → Bahan Dasar  
2. Klik Tambah Bahan Dasar  
3. Isi form  
4. Pilih kategori  
5. Set unit & konversi  
6. Simpan → bahan aktif

   ## **1.5.2 Flow Penambahan Stok**

1. Buka detail bahan  
2. Klik Tambah  
3. Isi jumlah & harga  
4. Pilih supplier  
5. Simpan  
6. Sistem:  
   * Update stok  
   * Update nilai stok  
   * Simpan histori

     ## **1.5.3 Flow Bahan Setengah Jadi**

1. Buat bahan setengah jadi  
2. Set estimasi produksi  
3. Tambah resep  
4. Pilih bahan mentah  
5. Input jumlah  
6. Sistem hitung HPP otomatis  
7. Simpan

   ## **1.6 SOURCE VALUE – RINGKASAN**

| Field | Source |
| ----- | ----- |
| Supplier | Master Supplier |
| Kategori | Master Kategori |
| Bahan | Detail Bahan Mentah |
| Unit | Konversi Unit |
| Harga | Input \+ histori |
| Stok | Transaksi sistem |
| HPP | Kalkulasi resep |

   ## **1.7 OUTPUT KE MODUL LAIN**

* Resep Produk  
* Menu  
* Laporan HPP  
* Arus Stok  
* Pembelian  
* Inventory Report  
    
2. **Arus Stock**

   ## **2.1 Arus Stok – Pembelian**

   Fitur untuk mencatat penambahan stok bahan dasar akibat transaksi pembelian dari supplier.  
   Tujuan:  
* Menambah stok bahan dasar  
* Mengupdate harga rata-rata (HPP bahan)  
* Membuat histori arus stok  
* Menjadi dasar kalkulasi resep

  # **2.1.1 REQUIREMENT**

  ## Entry Point

  Dari:  
  Inventory → Arus Stok → Tambah Arus Stok → Pembelian

# **2.1.2 HALAMAN PEMBELIAN**

## **Header Section**

### **Field**

| Field | Mandatory | Source |
| ----- | ----- | ----- |
| Supplier | ✅ | Master Supplier |
| Total Item Terpilih | Auto | Sistem |
| Total Harga | Auto | Sistem |

### Business Rule

* Supplier wajib dipilih dulu  
* Jika belum pilih supplier → list bahan tidak aktif  
* Total item & harga real-time

# **2.1.3 DAFTAR BAHAN YANG BISA DIBELI**

**Setelah supplier dipilih:**

## Filtering Logic

Menampilkan hanya:

* Bahan dasar yang terhubung dengan supplier tersebut

  Relasi:

  Supplier ↔ Supplier\_Bahan ↔ Bahan Dasar

## **2.1.4 Struktur Input Pembelian**

| Field | Mandatory | Source |
| ----- | ----- | ----- |
| Nama Bahan Dasar | Auto | Master Bahan |
| Jumlah Pembelian | ✅ | Input user |
| Satuan | Auto | Supplier\_Bahan |
| Total Harga | ✅ | Input user |

# **2.1.5 SOURCE VALUE DETAIL**

## **Supplier**

Diambil dari:

Master Supplier

Relasi:

* Supplier punya banyak bahan  
* Supplier punya harga per unit

## **Nama Bahan Dasar**

Diambil dari:

Master Bahan Dasar

Filter berdasarkan:

Supplier\_id

## **Satuan (Dropdown)**

Source:

Supplier\_Bahan.satuan\_beli

Contoh:

* cup  
* kg  
* liter  
* Box

  ## **Jumlah Pembelian**

  Input numeric  
  Rule:  
* ≥ 0  
* Decimal allowed

## **Total Harga**

Input manual oleh user  
Format:

* Currency  
* Tidak boleh negatif

# **2.1.6 FLOW SISTEM (END-TO-END)**

## **Flow Normal Pembelian**

- User klik Tambah Arus Stok  
- Pilih Pembelian  
- Pilih Supplier  
- Sistem load bahan sesuai supplier  
- User input:  
  Jumlah pembelian  
  Total harga  
  \- Klik Perbarui Stok  
  \- Sistem:

  ### Step Internal:

  FOR setiap bahan:  
      konversi ke base unit  
      tambah stok  
      update harga rata-rata (jika pakai average method)  
      insert ke arus\_stok

# **2.1.7 LOGIKA UPDATE STOK**

## **Konversi Unit**

Contoh:

* Supplier jual: 1 cup  
* Base unit: gram  
* 1 cup \= 200 gram  
  Jika beli 100 cup:  
  100 × 200 gr \= 20.000 gr  
    
  Masuk ke stok:  
  stok\_base \+= 20.000

## **Update Harga Rata-Rata (Weighted Average)**

Jika sebelumnya:

Stok lama: 10.000 gr  
Harga lama: Rp5.000

Beli:

20.000 gr  
Rp1.000

Maka:

Harga rata-rata baru \=  
(total nilai lama \+ nilai baru) /  
(total qty lama \+ qty baru)

# **2.1.8 DATA YANG DIBUAT SISTEM**

Saat klik Perbarui Stok:

### Insert ke:

## **Table: arus\_stok**

| Field | Value |
| ----- | ----- |
| Tipe | Pembelian |
| Supplier | supplier\_id |
| Total Bahan | count item |
| Total Harga | sum |
| Tanggal | now |
| Status | Selesai |

## **Table: arus\_stok\_detail**

| Field | Value |
| ----- | ----- |
| bahan\_id | id |
| qty\_supplier | input |
| qty\_base | hasil konversi |
| harga\_total | input |

## **Table: bahan\_stok**

Update:

stok \+= qty\_base  
harga\_rata\_rata update

# **2.1.9 TAMPILAN DI LIST ARUS STOK**

**Field:**

| Field | Source |
| ----- | ----- |
| Tipe Transfer | arus\_stok.tipe |
| Outlet/Supplier | arus\_stok.supplier |
| Total Bahan | count detail |
| Total Harga | sum detail |
| Tanggal | created\_at |
| Status | system |
| Aksi | View detail |

# **2.1.10 EDGE CASE PENTING**

* Supplier tidak punya bahan → tampil empty  
* Jumlah \> 0 tapi harga 0 → valid (promo / gratis)  
* Harga ada tapi jumlah 0 → invalid  
* Tidak boleh submit jika semua jumlah \= 0  
* Multi outlet → stok per outlet

# **2.1.11 VALIDASI WAJIB**

Sebelum submit:

* Supplier harus dipilih  
* Minimal 1 bahan qty \> 0  
* Total harga ≥ 0  
* Tidak boleh negative value

# **2.1.12 RELASI DENGAN FITUR LAIN**

| Modul | Dampak |
| ----- | ----- |
| Bahan Dasar | Update stok |
| Resep | Pengaruh HPP |
| Supplier | Source harga |
| Konversi Unit | Konversi base |
| Laporan | Cost & inventory report |

# **2.1.13 Notes:**

Pembelian adalah:

INPUT:  
Supplier \+ Qty \+ Harga

PROSES:  
Konversi → Update Stok → Update HPP

OUTPUT:  
Arus Stok Record

# **2.2 Arus Stock \- Pengeluaran**

Fitur Pengeluaran digunakan untuk:

* Mengurangi stok bahan dasar  
* Mencatat alasan pengurangan  
* Mencatat histori arus stok tipe *Pengeluaran*  
* Mengontrol shrinkage (rusak, hilang, expired, dll)

# **2.2.1 REQUIREMENT**

## **A. General Requirement**

### 1\. Scope

* Berlaku per Outlet  
* Berlaku untuk:  
  * Bahan Dasar → Mentah  
  * Bahan Dasar → Setengah Jadi

## **B. UI Requirement**

### **Tab Filter**

* Mentah  
* Setengah Jadi

  ### **Search**

* Cari bahan dasar berdasarkan nama

  ### **Sidebar Kategori**

  Source:  
* Master Kategori  
  Fungsi:  
* Filter bahan berdasarkan kategori

## **C. Data Table Requirement**

| Field | Keterangan |
| ----- | ----- |
| Nama Bahan Dasar | Dari Master Bahan |
| Stok Saat Ini | Dari stok inventory current |
| Jumlah Pengeluaran | Input numeric |
| Unit | Default dari unit utama bahan |
| Alasan | Dropdown mandatory |

## **D. Alasan Pengeluaran (Mandatory)**

Source:

* Master Alasan Pengeluaran (harus ada tabel khusus)  
  Contoh value:  
* Rusak  
* Hilang  
* Kadaluarsa  
* Uji Coba  
* Sampling  
* Lainnya  
  ⚠ Wajib dipilih jika qty \> 0

  ## **E. Validation Rules**

1. Qty tidak boleh \> stok saat ini  
2. Qty tidak boleh negatif  
3. Jika qty \> 0 → alasan wajib  
4. Minimal 1 item harus ada qty \> 0 sebelum tombol aktif  
5. Tombol "Perbarui Stok" disable jika tidak ada perubahan

# **2.2.2 FLOW PROSES**

## **FLOW 1 — Create Pengeluaran**

User klik Arus Stok  
→ Klik Tambah Arus Stok  
→ Pilih Pengeluaran  
→ Masuk halaman Pengeluaran

## **FLOW 2 — Input Pengeluaran**

User pilih tab (Mentah / Setengah Jadi)  
→ Pilih kategori  
→ Input qty pengeluaran  
→ Pilih alasan  
→ Klik Perbarui Stok

## **FLOW 3 — System Processing**

Saat klik "Perbarui Stok":

Untuk setiap item qty \> 0:

new\_stock \= current\_stock \- qty\_pengeluaran

**System melakukan:**

1️⃣ Update stok bahan  
2️⃣ Insert ke table arus\_stok  
3️⃣ Insert ke table arus\_stok\_detail  
4️⃣ Generate nomor transaksi

Contoh:

EX/K56432/2026/02/11/1

Status default: Selesai

## **FLOW 4 — After Success**

Redirect ke:

Arus Stok → Tab Pengeluaran

Record tampil dengan:

* Tipe Transfer: Pengeluaran  
* Total Bahan: jumlah item  
* Total Harga: \-  
* Status: Selesai  
* Tanggal: created\_at

# **2.2.3 SOURCE VALUE (DATA MAPPING)**

## **Nama Bahan Dasar**

Source:

inventory\_bahan\_dasar

Filter:

* outlet\_id  
* kategori\_id  
* tipe (mentah / setengah jadi)

  ## **Stok Saat Ini**

  Source:  
  inventory\_stock.current\_qty  
    
  Logic:  
  sum(pembelian)  
  \- sum(pengeluaran)  
  \- sum(pakai resep)  
  \+ sum(stok opname adjustment)  
  \+ sum(transfer masuk)  
  \- sum(transfer keluar)

  ## **Unit**

  Source:  
  inventory\_bahan\_dasar.default\_unit

  ## **Alasan**

  Source:  
  master\_alasan\_pengeluaran  
  Disarankan struktur:  
  id  
  nama\_alasan  
  is\_active  
  created\_at

  ## **Nomor Transaksi**

  Generated format:  
  EX/{kodeOutlet}/{YYYY}/{MM}/{DD}/{running\_number}

  ## **Total Bahan**

  Count:  
  jumlah item dengan qty \> 0

  ## **Total Harga**

  Untuk pengeluaran:  
  NULL atau "-"  
    
  (Karena ini bukan transaksi pembelian)

# **2.2.4 Gambaran Database Design**

## **Table: arus\_stok**

id  
outlet\_id  
type ENUM (pembelian, pengeluaran, stok\_opname, transfer)  
reference\_number  
total\_item  
total\_value (nullable)  
status  
created\_by  
created\_at

## **Table: arus\_stok\_detail**

id  
arus\_stok\_id  
bahan\_id  
qty  
unit  
reason\_id (nullable kecuali pengeluaran)  
Created\_at

# **2.2.5 Notes**

* Jika stok \= 0 → tidak bisa input qty \> 0  
* Jika user cancel → tidak ada perubahan  
* Jika 2 user update bersamaan → perlu locking / transaction DB  
* Pengeluaran tidak boleh menghasilkan stok minus

| Modul | Keterkaitan |
| ----- | ----- |
| Bahan Dasar | Ambil stok & unit |
| Kategori | Filter bahan |
| Resep | Resep juga kurangi stok (beda trigger) |
| Laporan Arus Stok | Record muncul di history |
| Laba Kotor | Tidak terpengaruh langsung |

# **2.3 Arus Stok \- Stok Opname**

# **2.3.1 REQUIREMENT**

## **A. Scope**

* Per Outlet  
* Berlaku untuk:  
  * Mentah  
  * Setengah Jadi

  ## **B. UI Requirement**

    ### **Tab**

* Mentah  
* Setengah Jadi

  ### **Search**

  Cari bahan dasar berdasarkan nama

  ### **Filter Kategori**

  Source:

  Master\_kategori

## **C. Tabel Input**

| Field | Keterangan |
| ----- | ----- |
| Nama Bahan Dasar | Dari master bahan |
| Stok Terbaru | Input angka aktual fisik |
| Unit | Default dari unit utama bahan |

**Tidak ada field alasan (beda dengan pengeluaran)**

## **D. Validation Rules**

1. Stok terbaru tidak boleh negatif  
2. Minimal 1 item harus berubah  
3. Jika tidak ada perubahan → tombol disable  
4. Input hanya numeric  
5. Unit bisa diganti (jika ada konversi)

   # **2.3.2 FLOW PROSES**

   ## **FLOW 1 — Create Stok Opname**

   User → Arus Stok  
   → Klik Tambah Arus Stok  
   → Pilih Stok Opname  
   → Masuk halaman Stok Opname

   ## **FLOW 2 — Input Penyesuaian**

   User pilih kategori  
   → Input stok fisik aktual  
   → Klik Perbarui Stok

   ## **FLOW 3 — System Calculation Logic**

   Untuk setiap item yang diubah:  
   selisih \= stok\_terbaru \- stok\_saat\_ini  
   Jika:  
* selisih \> 0 → stok bertambah  
* selisih \< 0 → stok berkurang

  ## **FLOW 4 — Update Database**

  System melakukan dalam 1 transaction:  
* Update stok bahan  
* Insert ke arus\_stok (type \= stok\_opname)  
* Insert ke arus\_stok\_detail

  # **2.3.3 SOURCE VALUE (DATA MAPPING)**

  ## **Nama Bahan**

  Source:  
  inventory\_bahan\_dasar  
  Filter:  
* outlet\_id  
* kategori\_id  
* tipe (mentah/setengah jadi)

  ## **Stok Saat Ini**

  Source:  
  inventory\_stock.current\_qty  
  Didapat dari perhitungan seluruh arus stok sebelumnya.

## **Stok Terbaru (Input)**

Source:

user input

Disimpan sebagai:

Final\_stock

## Jumlah (di Detail Arus Stok)

Disimpan sebagai:

qty\_adjustment \= selisih

| Stok Lama | Stok Baru | Selisih |
| ----- | ----- | ----- |
| 10000 gr | 100 gr | \-9900 gr |
| 190 cup | 100 cup | \-90 cup |

## **Harga Penyesuaian**

Source:

bahan.average\_cost

Logic:

harga\_penyesuaian \= selisih \* average\_cost

Jika selisih negatif:

nilai minus

Contoh:

* \-90 cup  
* avg\_cost \= 10  
* total\_adjustment \= \-900

  Itu yang muncul sebagai:

  \-Rp900

## **Nomor Transaksi**

**Format:**

SO/{kodeOutlet}/{YYYY}/{MM}/{DD}/{running\_number}

Contoh:

SO/K56432/2026/02/11/1

# **2.3.4 Gambaran Database Structure**

## **Table: arus\_stok**

id

outlet\_id

type ENUM (pembelian, pengeluaran, stok\_opname, transfer)

reference\_number

total\_item

total\_value

status

created\_by

Created\_at

## **Table: arus\_stok\_detail**

id

arus\_stok\_id

bahan\_id

qty\_adjustment

unit

cost\_per\_unit

total\_adjustment\_value

final\_stock

created\_at

# **2.3.5 DETAIL ARUS STOK PAGE**

Berdasarkan screenshot Detail Arus Stok:

Menampilkan:

| Field | Source |
| ----- | ----- |
| Nama Bahan | master bahan |
| Kategori | master kategori |
| Tipe Bahan | mentah / setengah jadi |
| Jumlah | qty\_adjustment |
| Harga Penyesuaian | total\_adjustment\_value |
| Stok Terbaru | final\_stock |

# **2.3.6 Notes**

* Jika stok sistem 0 dan user isi 100 → selisih \+100  
* Jika stok sistem 100 dan user isi 100 → tidak dicatat  
* Harus pakai DB transaction  
* Tidak boleh stok akhir negatif

| Modul | Pengaruh |
| ----- | ----- |
| Laba Kotor | Bisa mempengaruhi COGS |
| Laporan Arus Stok | Tercatat sebagai SO |
| Pengeluaran | Berbeda logika |
| Pembelian | Tidak terkait |

**2.4 Arus Stock \- Transfer Bahan**

# **2.4.1 REQUIREMENT**

## **A. Functional Requirement**

### **1\. Buat Transfer Baru**

User harus bisa:

* Pilih Jenis Transaksi  
  * Pengiriman Bahan  
  * Permintaan Bahan  
* Pilih Outlet Tujuan  
* Sistem otomatis membaca:  
  * Outlet asal \= outlet yang sedang aktif (dropdown header)

  ### **2\. Input Item Transfer**

  User harus bisa:

* Search bahan  
* Filter:  
  * Mentah  
  * Setengah Jadi  
* Filter status stok:  
  * Semua  
  * Masih Ada  
  * Menipis  
  * Habis  
* Pilih kategori  
* Input:  
  * Jumlah kirim  
  * Unit  
  * Harga kirim (opsional/auto)

  ### **3\. Validasi**

  Sistem harus:

* Tidak boleh kirim \> stok saat ini  
* Tidak boleh kirim bahan dengan stok 0  
* Wajib isi outlet tujuan  
* Wajib isi minimal 1 bahan

  ### **4\. Submit Transfer**

  Saat klik Kirim Transfer:  
  Sistem harus:  
* Generate nomor transaksi (contoh: TR/K56432/2026/02/11/1)  
* Kurangi stok outlet asal  
* Tambahkan stok ke outlet tujuan  
* Catat harga transfer  
* Set status awal:  
  * Dikirim

  ### **5\. Tracking Status**

  Status flow:

* Dikirim  
* Selesai

  ### **6\. List Transfer**

  Menu Arus Stok → Tab Transfer harus menampilkan:  
* Tipe Transfer  
* Nomor transaksi  
* Outlet tujuan  
* Total bahan  
* Total harga  
* Tanggal  
* Status  
* Aksi (lihat detail)

  ### **7\. Detail Transfer**

  Menampilkan:  
  Header:  
* Nomor transfer  
* Status timeline  
* User  
* Tanggal  
* Total bahan  
* Total harga  
  Detail item:  
* Nama bahan  
* Tipe bahan  
* Kategori  
* Jumlah dikirim  
* Harga dikirim

  ## **B. Non Functional Requirement**

* Real-time update stok  
* Multi outlet aware  
* Tidak boleh race condition (harus transactional DB)  
* Harus audit trail (siapa kirim, kapan)

# **2.4.2 FLOW PROSES**

## **FLOW 1 — Pengiriman Transfer**

Pilih Jenis Transaksi

↓

Pilih Outlet Tujuan

↓

Input Item & Jumlah

↓

Validasi stok cukup

↓

Klik Kirim Transfer

↓

System:

  \- Generate nomor

  \- Kurangi stok outlet asal

  \- Tambah stok outlet tujuan

  \- Simpan transaksi

  \- Set status \= Dikirim

↓

Redirect ke Detail Transfer

## **FLOW 2 — Status Transfer**

Dikirim

↓

(Saat diterima outlet tujuan)

↓

Selesai

# **2.4.3 SOURCE OF VALUE (SUMBER NILAI DATA)**

**Berikut mapping value tiap field:**

## **A. Header Transfer**

| Field | Source Value |
| ----- | ----- |
| Nomor Transfer | Auto generate backend |
| Tanggal | created\_at |
| User | logged in user |
| Outlet Asal | header outlet dropdown |
| Outlet Tujuan | dropdown pilihan |
| Total Bahan | COUNT item detail |
| Total Harga | SUM(harga\_transfer) |
| Status | enum |

## **B. Item Transfer**

| Field | Source |
| ----- | ----- |
| Nama Bahan | master\_bahan |
| Tipe Bahan | bahan.type (Mentah/Setengah Jadi) |
| Kategori | bahan.category\_id |
| Stok Saat Ini | stok table (by outlet\_id) |
| Jumlah Kirim | user input |
| Unit | bahan.default\_unit |
| Harga Kirim | bisa dari harga beli terakhir |

# **2.4.4 Gambaran Database Design**

## **Tabel transfer\_header**

id

transfer\_number

outlet\_from\_id

outlet\_to\_id

transaction\_type (pengiriman/permintaan)

status (dikirim/selesai)

total\_item

total\_price

created\_by

Created\_at

## **Tabel transfer\_detail**

id

transfer\_id

bahan\_id

qty

unit

price

Subtotal

## **Stok update logic**

Saat submit:

UPDATE stok

SET qty \= qty \- transfer\_qty

WHERE outlet\_id \= outlet\_from

INSERT OR UPDATE stok

WHERE outlet\_id \= outlet\_to

SET qty \= qty \+ transfer\_qty

Harus dalam 1 database transaction.

# **2.4.5 IMPACT KE LAPORAN**

Transfer mempengaruhi:

* Laporan Arus Stok  
* Laporan Nilai Persediaan  
* Stok per outlet  
* Costing outlet

**2.5 Arus Stock \- Purchase Order (PO)**

# **2.5.1 REQUIREMENT**

## **A. Functional Requirement**

## **1\. Buat Purchase Order**

User harus bisa:

* Pilih Supplier  
* Pilih Tanggal Pengiriman  
* Pilih bahan berdasarkan:  
  * Kategori  
  * Search bahan  
  * Filter status stok (Semua / Masih Ada / Menipis / Habis)  
* Input:  
  * Jumlah Diminta  
  * Unit

  ## **2\. Submit PO (Kirim Permintaan)**

  Saat klik Kirim Permintaan:

  Sistem harus:

* Generate nomor PO  
  Contoh: `PO/K56432/2026/02/11/1`  
* Simpan detail bahan  
* Set status \= Diminta  
* Masuk ke tab Arus Stok → Purchase Order

  ## **3\. List Purchase Order**

  Tab: Arus Stok → Purchase Order  
  Menampilkan:  
* Tipe \= Purchase Order  
* Nomor PO  
* Supplier  
* Total Bahan  
* Total Harga (kosong jika belum diterima)  
* Tanggal  
* Status (Diminta / Selesai)  
* Aksi (Lihat detail)

  ## **4\. Detail Purchase Order**

  Menampilkan:

  ### Header:

* Nomor PO  
* Supplier  
* Outlet  
* User  
* Tanggal  
* Status timeline (Diminta → Selesai)

  ### Detail Item:

* Nama bahan  
* Kategori  
* Jumlah Diminta  
* Harga Diminta  
* Jumlah Diterima  
* Harga Diterima  
* Jumlah Ditolak  
* Alasan Ditolak

  ## **5\. Proses Penerimaan Barang**

  User bisa:  
* Input:  
  * Jumlah Diterima  
  * Harga Diterima  
  * Jumlah Ditolak  
  * Alasan Ditolak  
* Upload foto bukti penerimaan (max 10 foto, max 5MB)

  ## **6\. Terima Barang**

  Saat klik Terima Barang:  
  Sistem harus:  
* Generate nomor GR  
  Contoh: `GR/K56432/2026/02/11/1`  
* Tambahkan stok sesuai jumlah diterima  
* Simpan harga diterima sebagai harga pembelian  
* Update status \= Selesai  
* Update nilai persediaan  
* Catat arus stok sebagai Pembelian

  ## **7\. Unduh Purchase Order**

  User bisa:  
* Unduh PO dalam format .xlsx  
* Data yang diunduh:  
  * Header PO  
  * Detail bahan  
  * Supplier  
  * Jumlah & harga

  # **2.5.2 FLOW PROSES**

  # **FLOW 1 — Create PO**

    Pilih Supplier

    ↓

    Pilih Tanggal Pengiriman

    ↓

    Pilih Bahan

    ↓

    Input Jumlah Diminta

    ↓

    Klik Kirim Permintaan

    ↓

    System:

      \- Generate nomor PO

      \- Simpan header

      \- Simpan detail

      \- Status \= Diminta

  # **FLOW 2 — Terima Barang**

    Buka Detail PO

    ↓

    Input:

      \- Jumlah Diterima

      \- Harga Diterima

      \- Jumlah Ditolak

      \- Alasan

      \- Upload Foto

    ↓

    Klik Terima Barang

    ↓

    System:

      \- Generate nomor GR

      \- Tambah stok

      \- Update harga beli terakhir

      \- Status \= Selesai

      \- Catat arus stok pembelian

# **2.5.3 STATUS FLOW**

| Status | Artinya |
| ----- | ----- |
| Diminta | PO dibuat, belum diterima |
| Selesai | Barang sudah diterima & stok masuk |

# **2.5.4 SOURCE OF VALUE (SUMBER DATA)**

## **A. Header PO**

| Field | Source |
| ----- | ----- |
| Nomor PO | Auto generate backend |
| Supplier | Master Supplier |
| Outlet | Outlet aktif di header |
| User | Logged in user |
| Tanggal | created\_at |
| Total Bahan | count detail |
| Total Harga | sum harga diterima |

## **B. Detail PO**

| Field | Source |
| ----- | ----- |
| Nama Bahan | master\_bahan |
| Kategori | master\_kategori |
| Jumlah Diminta | user input |
| Harga Diminta | default 0 |
| Jumlah Diterima | user input |
| Harga Diterima | user input |
| Jumlah Ditolak | system calc / user input |
| Alasan Ditolak | master alasan |

## **C. Update Stok**

Saat Selesai:

stok.qty \= stok.qty \+ jumlah\_diterima  
stok.harga\_terakhir \= harga\_diterima

# **2.5.5 Gambaran Database Design**

## **Tabel purchase\_orders**

id  
po\_number  
supplier\_id  
outlet\_id  
status (diminta/selesai)  
total\_item  
total\_price  
created\_by  
Created\_at

## **Tabel purchase\_order\_details**

id  
po\_id  
bahan\_id  
qty\_requested  
price\_requested  
qty\_received  
price\_received  
qty\_rejected  
Reject\_reason

## **Tabel goods\_receipt**

id  
gr\_number  
po\_id  
received\_by  
Received\_at

## **Tabel stok**

id  
bahan\_id  
outlet\_id  
qty  
Last\_price

# **2.5.6 Impact ke Laporan**

Purchase Order mempengaruhi:

* Laporan Arus Stok → Pembelian  
* Nilai Persediaan  
* Harga Pokok Produksi (HPP)  
* Stok per outlet  
* Audit pembelian

**2.6 Arus Stock \- Purchase Order (Multi Supplier)**

## **2.6.1 Master Kategori**

### **Requirement**

* **User dapat:**  
  * Create kategori  
  * Edit kategori  
  * Delete kategori  
  * Set parent–child (opsional jika support sub kategori)  
* **Field:**  
  * Nama kategori  
  * Deskripsi (opsional)  
  * Status aktif/nonaktif  
* **Kategori harus bisa di-relasikan ke:**  
  * Bahan Dasar  
  * Report Arus Stok

  ### **Flow**

1. User buka Inventory → Kategori  
2. Klik Tambah Kategori  
3. Isi nama kategori  
4. Simpan  
5. Kategori muncul di dropdown:  
   * Bahan Dasar  
   * Purchase Order  
   * Report stok

   ### **Source of Value**

* Struktur stok lebih rapi  
* Reporting per kategori  
* Analisa cost per kategori  
* Kontrol pembelian berdasarkan grup bahan

## **2.6.2 Assign Kategori ke Bahan Dasar**

### **Requirement**

* Setiap bahan wajib memiliki 1 kategori  
* Tidak boleh bahan tanpa kategori

  ### **Flow**

1. User buat/edit bahan dasar  
2. Pilih kategori  
3. Simpan

   ### **Source of Value**

* PO bisa filter berdasarkan kategori  
* Dashboard stok bisa aggregasi by kategori  
* Cegah bahan “nyasar”

## **2.6.3  Filter & Search Kategori**

### **Requirement**

* Search by nama kategori  
* Filter aktif/nonaktif

  ### **Flow**

1. User ketik di search bar  
2. Sistem filter real-time

   ### **Source of Value**

* Scaling saat kategori \>50  
* Cepat saat audit

## **2.6.4 Soft Delete & Validasi**

### **Requirement**

* Tidak boleh delete kategori jika:  
  * Masih dipakai oleh bahan  
* Sistem harus tampilkan warning

  ### **Flow**

1. Klik hapus  
2. Jika dipakai → tampil error  
3. Jika tidak → nonaktifkan

   ### **Source of Value**

* Data integrity  
* Tidak merusak histori transaksi

## **2.6.5 Integrasi dengan PO & Stock Movement**

### **Requirement**

* Saat buat PO:  
  * Kategori otomatis muncul berdasarkan bahan  
* Tidak bisa ubah kategori di PO (read-only)

  ### **Flow**

1. Pilih bahan  
2. Sistem auto-fetch kategori dari master

   ### **Source of Value**

* Konsistensi data  
* Hindari manipulasi klasifikasi biaya

# **2.6.6 ARUS STOK → PURCHASE ORDER (MULTI SUPPLIER)**

# **2.6.6.1 FUNCTIONAL REQUIREMENT**

## **Create PO Multi Supplier**

### Field Header:

* Outlet (aktif)  
* Tanggal Pengiriman  
* Auto Generate PO Number

  ### Field Detail (Grid):

* Nama Bahan Dasar (dropdown)  
* Kategori (auto)  
* Nama Supplier (dropdown)  
* Kuantitas  
* Satuan  
* Harga per satuan  
* Subtotal (auto)

  ### Summary:

* Total Supplier (distinct count)  
* Total PO (jumlah supplier unik)  
* Total Belanja (sum subtotal)

# **2.6.6.2 FLOW (END-TO-END)**

## **Step 1 — Input Item**

1. User pilih bahan  
2. Sistem auto:  
   * Kategori  
   * Default supplier (jika ada)  
   * Harga terakhir  
3. User isi:  
   * Supplier (boleh beda untuk tiap baris)  
   * Qty  
   * Harga

   Sistem hitung:  
     subtotal \= qty × harga

   ## **Step 2 — Multi Supplier Split Logic**

   Jika dalam 1 halaman terdapat:

| Bahan | Supplier |
| ----- | ----- |
| A | S1 |
| B | S1 |
| C | S2 |

   Maka sistem akan generate:

* PO-001 → Supplier S1 (A \+ B)  
* PO-002 → Supplier S2 (C)

  ## **Step 3 — Simpan**

  Saat klik Simpan:  
1. Sistem group by supplier  
2. Generate 1 PO per supplier  
3. Status default: "Diminta"  
4. Buat record:  
   * purchase\_orders  
   * purchase\_order\_items  
5. Buat arus stok type: PURCHASE\_ORDER (pending)

   ## **Step 4 — Optional Action (Modal)**

   User bisa:  
* Unduh Purchase Order (.xlsx)  
  (Sesuai request → WA tidak dibahas)

# **2.6.6.3 UNDuh PURCHASE ORDER (Multi Supplier)**

**Jika ada 2 supplier:**  
→ Generate 2 file  
atau  
→ 1 file dengan multi sheet per supplier

### **Format minimal:**

**Header:**

* PO Number  
* Supplier  
* Outlet  
* Tanggal Pengiriman  
  **Body:**  
* Bahan  
* Qty  
* Harga  
* Subtotal  
  **Footer:**  
* Total

# **2.6.6.4 SOURCE OF VALUE (PO MULTI SUPPLIER)**

## **Efisiensi Operasional**

* Tidak perlu buat PO satu per satu  
* Satu halaman bisa handle banyak supplier

  ## **Kontrol Cost**

* Real-time total belanja  
* Bisa compare harga antar supplier

  ## **Data Driven Procurement**

* Bisa track:  
  * Supplier mana paling sering dipakai  
  * Harga fluktuasi  
  * Cost per kategori

  ## **Audit & Compliance**

* PO number auto generate  
* Tidak bisa edit kategori manual  
* Harga tercatat per transaksi

  ## **Scalability untuk Chain**

  Karena ada:  
* Outlet selector  
* Multi supplier split  
  **Fitur ini scalable untuk:**  
* Multi cabang  
* Central purchasing

# **2.6.6.5 DATABASE SOURCE OF VALUE (Mapping Teknis)**

| Field UI | Source |
| ----- | ----- |
| Nama Bahan | master\_bahan\_dasar |
| Kategori | master\_kategori |
| Supplier | master\_supplier |
| Harga default | last\_purchase\_price |
| Qty | user input |
| Subtotal | computed |
| Total Belanja | SUM(subtotal) |
| Total Supplier | COUNT(DISTINCT supplier\_id) |
| Total PO | COUNT(DISTINCT supplier\_id) |

3. **Supplier**  
   Supplier tidak menyimpan stok, tetapi terhubung langsung ke:  
* Bahan Dasar  
* Arus Stok (penambahan)  
* Purchase / pembelian  
* HPP

# **3.1 RELASI DATA (HIGH LEVEL)**

Supplier  
   ↓  
Supplier \- Bahan Dasar (pricing & purchase rule)  
   ↓  
Pembelian / Penambahan Stok  
   ↓  
Inventory & HPP

Satu Supplier:

* Bisa memasok banyak Bahan Dasar  
  Satu Bahan Dasar:  
* Bisa punya lebih dari 1 Supplier (opsional, future-ready)

# **3.2 REQUIREMENT SISTEM**

## **3.2.1 List Supplier**

### Functional Requirement

User dapat:

* Melihat daftar supplier  
* Menambahkan supplier baru  
* Edit supplier  
* Masuk ke detail supplier

  ### Field List

| Field | Source |
| ----- | ----- |
| Nama Supplier | Master Supplier |
| No. Telp | Master Supplier |
| Alamat | Master Supplier |
| Aksi | Sistem |

## **3.2.2 Tambah / Ubah Supplier (Master Supplier)**

### Field Requirement

| Field | Mandatory | Source |
| ----- | ----- | ----- |
| Nama Supplier | ✅ | Input user |
| No. Telp | Opsional | Input user |
| Pinpoint Lokasi | Opsional | Google Maps |
| Alamat | Opsional | Maps reverse geocode |
| Tempo Pembayaran | Opsional | Dropdown |
| Tipe Pembayaran | Opsional | Cash / Transfer |

### Business Rule

* Nama supplier unik per outlet  
* No. telp valid format negara  
* Lokasi tidak wajib (supplier non-fisik allowed)

  ## **3.2.3 Detail Supplier**

  ### Informasi Umum

  Menampilkan:  
* Nama  
* Kontak  
* Alamat  
* Tipe & tempo pembayaran  
* Total produk (bahan dasar) yang dipasok

## **3.2.4 Supplier → Bahan Dasar (Purchase Rule)**

### Functional Requirement

Di dalam Detail Supplier, user dapat:

* Menambahkan bahan dasar yang dipasok supplier  
* Menentukan rule pembelian per bahan

  ### Field Supplier–Bahan Dasar

| Field | Mandatory | Source |
| ----- | ----- | ----- |
| Nama Bahan Dasar | ✅ | Detail Bahan Mentah |
| Kategori | Auto | Master Kategori |
| Jumlah Pembelian | ✅ | Input user |
| Satuan Pembelian | ✅ | Konversi Unit (Purchase) |
| Harga per Jumlah/Satuan | ✅ | Input user |
| Min. Jumlah Order | Opsional | Input user |
| MOV | Opsional | Input user |
| Waktu Tunggu | Opsional | Input user |
| Supplier Utama | Opsional | Checkbox |
| PPN | Opsional | Checkbox |

## **3.2.5 Validasi Supplier–Bahan**

| Rule | Keterangan |
| ----- | ----- |
| Bahan wajib ada | Ambil dari master bahan |
| Satuan pembelian valid | Harus role Purchase |
| Harga \> 0 | Valid |
| Min order ≤ jumlah beli | Validasi |
| Supplier utama max 1 | Per bahan |

# **3.3 FLOW SISTEM**

## **3.3.1 Flow Tambah Supplier**

1. User → Inventory → Supplier  
2. Klik Tambah Supplier  
3. Isi data supplier  
4. Simpan  
5. Supplier aktif & bisa dipakai

   ## **3.3.2 Flow Edit Supplier**

1. User buka detail supplier  
2. Klik edit  
3. Ubah data  
4. Simpan  
5. Update ke seluruh relasi

   ## **3.3.3 Flow Tambah Bahan ke Supplier**

1. User buka Detail Supplier  
2. Klik Tambah  
3. Pilih bahan dasar  
4. Set:  
   * Qty pembelian  
   * Satuan (purchase unit)  
   * Harga  
   * Min order / MOV  
5. Simpan  
6. Sistem:  
   * Simpan pricing rule  
   * Siap dipakai untuk pembelian & stok

   ## **3.3.4 Flow Penambahan Stok via Supplier**

1. User tambah stok bahan  
2. Pilih supplier  
3. Sistem:  
   * Ambil harga & unit supplier  
   * Konversi ke base unit  
4. Update stok & nilai stok

   # **3.4 SOURCE VALUE (SUMBER DATA)**

   ## **3.4.1 Mapping Field → Source**

| Field | Source |
| ----- | ----- |
| Nama Supplier | Input user |
| No Telp | Input user |
| Alamat | Maps / Input |
| Tempo Pembayaran | Input user |
| Tipe Pembayaran | Input user |
| Bahan Dasar | Detail Bahan Mentah |
| Kategori | Master Kategori |
| Satuan Pembelian | Konversi Unit (Purchase) |
| Harga | Input user |
| Min Order | Input user |
| MOV | Input user |
| PPN | Input user |

   # **3.5 DAMPAK KE MODUL LAIN**

   ## Dipakai oleh:

* Bahan Dasar → penambahan stok  
* Arus Stok → histori supplier  
* HPP → harga beli  
* Purchase (future) → PO otomatis  
  Jika supplier diubah:  
* Harga baru tidak mengubah histori  
* Dipakai untuk transaksi selanjutnya

  # **3.6 Notes**

* Supplier dihapus tapi sudah dipakai → ❌ (soft delete)  
* Supplier tanpa bahan → allowed  
* Bahan tanpa supplier → allowed (manual price)  
* Banyak supplier satu bahan → allowed  
* Supplier utama → 1 per bahan

4. **Kategori**

   # **4.1 RELASI DATA**

   Kategori  
      ↓  
   Bahan Dasar  
      ↓  
   Resep / Stok / Supplier  
     
   Satu Kategori:  
* Bisa dipakai banyak Bahan Dasar  
  Satu Bahan Dasar:  
* Wajib punya 1 Kategori  
* Default fallback → Tanpa Kategori

# **4.2 REQUIREMENT SISTEM**

## **4.2.1 List Kategori**

### Functional Requirement

User dapat:

* Melihat daftar kategori inventory  
* Menambahkan kategori baru  
* Mengubah nama kategori  
* Melihat kategori default Tanpa Kategori

### Field List

| Field | Source |
| ----- | ----- |
| Nama Kategori | Master Kategori |
| Aksi (Ubah) | Sistem |

Tidak ada tombol hapus untuk mencegah data orphan

## **4.2.2 Tambah Kategori**

### **Modal Tambah Kategori**

| Field | Mandatory | Source |
| ----- | ----- | ----- |
| Nama Kategori | ✅ | Input user |

### Business Rule

* Panjang max 50 karakter  
* Nama kategori unik per outlet  
* Case-insensitive (`Bahan Kering` \= `bahan kering`)  
* Tidak boleh kosong

  ## **4.2.3 Ubah Kategori**

  ### **Modal Ubah Kategori**

| Field | Mandatory | Source |
| ----- | ----- | ----- |
| Nama Kategori | ✅ | Input user |

  ### Business Rule

* Update nama langsung mempengaruhi:  
  * Bahan Dasar  
  * Supplier → Bahan  
  * Filter inventory  
* Tidak mengubah histori transaksi

  ## **4.2.4 Kategori Default – “Tanpa Kategori”**

  ### Rule

* Sistem otomatis menyediakan Tanpa Kategori  
* Tidak bisa:  
  * Dihapus  
  * Diubah nama  
* Dipakai jika:  
  * Bahan dibuat tanpa kategori  
  * Kategori lama dihapus (future)

  # **4.3 FLOW SISTEM**

  ## **4.3.1 Flow Tambah Kategori**

1. User buka Inventory → Kategori  
2. Klik Tambah Kategori  
3. Input nama kategori  
4. Klik Tambah  
5. Sistem:  
   * Validasi unik  
   * Simpan  
   * Kategori aktif & bisa dipakai

   ## **4.3.2 Flow Ubah Kategori**

1. User klik ikon Ubah  
2. Modal edit muncul  
3. Ubah nama kategori  
4. Klik Ubah  
5. Sistem:  
   * Update master kategori  
   * Propagate ke semua relasi

   ## **4.3.3 Flow Pemakaian Kategori**

* Saat:  
  * Tambah Bahan Dasar  
  * Edit Bahan Dasar  
  * Tambah Supplier → Bahan  
* User memilih kategori dari Master Kategori

  # **4.4 SOURCE VALUE (SUMBER DATA)**

  ## **4.4.1 Mapping Field → Source**

| Field | Source |
| ----- | ----- |
| Nama Kategori | Input user |
| Relasi ke Bahan | Sistem |
| Dipakai di Supplier | Auto dari bahan |
| Dipakai di Resep | Auto dari bahan |
| Dipakai di Report | Sistem |

# **4.5 DAMPAK KE MODUL LAIN**

| Modul | Dampak |
| ----- | ----- |
| Bahan Dasar | Wajib kategori |
| Supplier | Menampilkan kategori bahan |
| Resep | Grouping & filtering |
| Arus Stok | Filtering laporan |
| Inventory Report | Analisa stok per kategori |

# **4.6 Notes**

* Kategori di-rename → histori aman  
* Kategori tidak boleh dihapus  
* Bahan tanpa kategori → auto fallback  
* Multi outlet → kategori per outlet  
* Tidak ada hierarki (flat category)

5. **Resep**

   # **5.1 DEFINISI & PERAN MODUL RESEP**

   ## **5.1.1 Resep**

   Resep adalah definisi komposisi bahan untuk:  
* Menu utama (produk)  
* Varian menu  
  Resep digunakan untuk:  
* Menghitung HPP otomatis  
* Mengurangi stok bahan dasar  
* Menentukan biaya produksi per menu

  # **5.1.2 STRUKTUR & RELASI DATA**

  Menu / Varian  
     ↓  
  Resep  
     ↓  
  Resep Detail  
     ↓  
  Bahan Dasar  
     ↓  
  Konversi Unit  
     ↓  
  Stok & HPP  
    
  Relasi penting:  
* 1 Menu → 1 Resep Menu  
* 1 Varian → 1 Resep Varian  
* 1 Resep → banyak Bahan Dasar  
* Bahan Dasar bisa:  
  * Mentah  
  * Setengah Jadi (hasil resep lain)

# **5.2 REQUIREMENT SISTEM**

## **5.2.1 List Resep – Tab Menu**

### **Functional Requirement**

User dapat:

* Melihat daftar menu  
* Melihat status resep  
* Melihat HPP total  
* Edit resep menu

### **Field List**

| Field | Source |
| ----- | ----- |
| Nama Produk | Master Produk |
| Kategori | Master Kategori |
| HPP | Kalkulasi Resep |
| Jumlah Bahan | Resep Detail |
| Terakhir Diperbarui | Sistem |
| Status | Resep |

## **5.2.2 List Resep – Tab Varian**

### **Functional Requirement**

User dapat:

* Melihat resep per varian  
* Melihat total harga (HPP varian)  
* Edit resep varian

  ### **Field List**

| Field | Source |
| ----- | ----- |
| Nama Opsi Varian | Master Varian |
| Varian | Master Varian |
| Total Harga | Kalkulasi Resep |
| Jumlah Bahan | Resep Detail |
| Terakhir Diperbarui | Sistem |

  # **5.3 DETAIL RESEP (MENU / VARIAN)**

  ## **5.3.1 Header Informasi**

  Menampilkan:

* Nama menu / varian  
* Kategori  
* Total HPP (auto)  
* Jumlah bahan dasar

## **5.3.2 Daftar Bahan Resep**

### **Field Resep Detail**

| Field | Mandatory | Source |
| ----- | ----- | ----- |
| Nama Bahan Dasar | ✅ | Master Bahan Dasar |
| Pemakaian | ✅ | Input user |
| Satuan | Auto | Konversi Unit (Base) |
| Harga | Auto | Kalkulasi |
| Aksi | Sistem |  |

# **5.4 TAMBAH BAHAN KE RESEP**

## **5.4.1 Modal “Pilih Opsi dari Bahan Dasar”**

### **Functional Requirement**

User dapat:

* Mencari bahan dasar  
* Memilih:  
  * Mentah  
  * Setengah Jadi  
* Multi-select bahan  
* Terapkan ke resep

### **Source Data**

| Data | Source |
| ----- | ----- |
| List Bahan Mentah | Master Bahan Dasar |
| List Setengah Jadi | Resep lain |
| Kategori | Master Kategori |
| Unit | Konversi Unit |

## **5.4.2 Rule Pemilihan**

* Bahan yang sudah dipakai → tidak bisa dipilih ulang  
* Setengah jadi \= output resep lain  
* Satu bahan \= satu baris di resep

  # **5.5 INPUT PEMAKAIAN & HARGA**

  ## **5.5.1 Pemakaian Bahan**

| Rule | Keterangan |
| ----- | ----- |
| Nilai ≥ 0 | Valid |
| Satuan base | Auto |
| Unit konversi | Sistem |

  ### Contoh:

* Beli gula: 1 kg  
* Base unit: gr  
* Pakai di resep: 50 gr

  ## **5.5.2 Harga Bahan**

  Harga dihitung otomatis:  
  Harga Bahan \=  
  (pemakaian / base unit supplier) × harga beli  
    
  Tidak bisa diinput manual ❌  
  (Read-only)

# **5.6 FLOW SISTEM**

## **5.6.1 Flow Tambah Resep Menu**

1. User buka Resep → Menu  
2. Pilih menu  
3. Masuk Detail Resep Menu  
4. Klik Tambah Bahan Dasar  
5. Pilih bahan  
6. Input pemakaian  
7. Simpan  
8. Sistem hitung:  
   * Harga per bahan  
   * Total HPP

   ## **5.6.2 Flow Tambah Resep Varian**

   Sama dengan menu, tetapi:

* Terikat ke varian  
* HPP berdiri sendiri (override menu jika ada)

  ## **5.6.3 Flow Update Resep**

1. Edit pemakaian bahan  
2. Simpan  
3. Sistem:  
   * Recalculate HPP  
   * Update timestamp

   ## **5.6.4 Flow Pengurangan Stok (Downstream)**

   Saat transaksi terjadi:

1. Menu/Varian terjual  
2. Sistem cek resep  
3. Kurangi stok bahan dasar  
4. Catat di Arus Stok

# **5.7 SOURCE VALUE (SUMBER DATA)**

## **5.7.1 Mapping Field → Source**

| Field | Source |
| ----- | ----- |
| Menu | Master Produk |
| Varian | Master Varian |
| Bahan Dasar | Master Bahan Dasar |
| Tipe Bahan | Mentah / Setengah Jadi |
| Pemakaian | Input user |
| Satuan | Konversi Unit |
| Harga Beli | Supplier |
| Harga Resep | Kalkulasi |
| HPP Total | Kalkulasi |

# **5.8 Notes**

* Resep boleh kosong → HPP \= 0  
* Setengah jadi:  
  * Ambil HPP dari resep lain  
* Bahan dihapus → resep invalid (warning)  
* Resep tidak mengubah histori transaksi  
* Multi outlet → resep per outlet

6. **Konversi Unit**

   # **6.1. DEFINISI & TUJUAN MODUL**

   ## **1.1.1 Konversi Unit**

   Konversi Unit adalah master data yang mendefinisikan:  
* Hubungan antar satuan (misalnya: kg → g, liter → ml)  
* Peran satuan dalam proses inventory:  
  * Base → satuan dasar stok & HPP  
  * Sedang (Transfer) → satuan internal / produksi  
  * Besar (Purchase) → satuan pembelian dari supplier

  Modul ini tidak berdiri sendiri, tapi dipakai oleh:

* Bahan Dasar  
* Resep  
* Arus Stok  
* Pembelian (Supplier)

  # **6.2. DATA & RELASI**

  ## **6.2.1 Relasi Utama**

  Konversi Unit  
        ↓  
  Bahan Dasar  
        ↓  
  Resep / Stok / Purchase  
    
  Satu Konversi Unit bisa dipakai oleh banyak Bahan Dasar  
  Satu Bahan Dasar wajib punya 1 Base Unit

# **6.3. REQUIREMENT SISTEM**

## **6.3.1 List Konversi Unit**

### **Functional Requirement**

User dapat:

* Melihat daftar konversi unit  
* Search berdasarkan nama konversi  
* Melihat:  
  * Total unit konversi  
  * Jumlah bahan dasar yang terhubung  
  * Terakhir diperbarui  
* Aksi:  
  * View detail  
  * Edit  
  * Hapus (dengan validasi)

  ### **Field List**

| Field | Source |
| ----- | ----- |
| Nama Konversi Unit | Input user |
| Total Unit Konversi | Count detail unit |
| Bahan Dasar Terhubung | Relasi ke bahan |
| Terakhir Diperbarui | System timestamp |
| Aksi | Sistem |

  ## **6.3.2 Tambah / Ubah Konversi Unit**

  ### **6.3.2.1 Header**

| Field | Mandatory | Source |
| ----- | ----- | ----- |
| Nama Konversi Unit | ✅ | Input user |

  Contoh:

* Satuan Berat  
* Satuan Cairan  
* Satuan Takaran

### **6.3.2.2 Detail Unit Konversi**

User dapat menambahkan lebih dari 1 unit dalam satu konversi.

| Field | Mandatory | Source |
| ----- | ----- | ----- |
| Nama Unit | ✅ | Input user |
| Nilai Konversi | ✅ | Input user |
| Per UOM | ✅ | Pilih dari unit |
| Role Unit | ✅ | Radio (Base / Sedang / Besar) |

### **6.3.2.3 Role Unit (Business Rule)**

| Role | Rule |
| ----- | ----- |
| Base | Wajib 1 per konversi |
| Sedang (Transfer) | Opsional |
| Besar (Purchase) | Opsional |
| Duplikasi Role | ❌ Tidak boleh |

Sistem wajib validasi:  
❌ Tidak bisa simpan jika tidak ada Base unit

## **6.3.3 Validasi & Constraint**

| Rule | Keterangan |
| ----- | ----- |
| Nama konversi unik | Tidak boleh sama |
| Minimal 1 unit | Wajib |
| Base unit wajib | 1 saja |
| Nilai konversi \> 0 | Validasi |
| Tidak bisa hapus | Jika sudah dipakai bahan |

# **6.4. FLOW SISTEM**

## **6.4.1 Flow Tambah Konversi Unit**

1. User buka Inventory → Konversi Unit  
2. Klik Tambah Konversi Unit  
3. Isi:  
   * Nama konversi  
   * Unit \+ nilai konversi  
4. Tentukan:  
   * Base unit  
   * (Opsional) Transfer / Purchase  
5. Klik Simpan  
6. Sistem:  
   * Validasi base unit  
   * Simpan master  
   * Siap dipakai bahan dasar

   ## **6.4.2 Flow Edit Konversi Unit**

1. User klik Edit  
2. Ubah unit / nilai / role  
3. Simpan  
4. Sistem:  
   * Update konversi  
   * Update seluruh bahan terkait  
   * Recalculate HPP jika diperlukan

## **6.4.3 Flow Pemakaian di Bahan Dasar**

1. User buat / edit bahan dasar  
2. Pilih Konversi Unit  
3. Sistem:  
   * Ambil Base unit → stok & HPP  
   * Ambil Purchase unit → pembelian  
   * Ambil Transfer unit → produksi

   ## **6.4.4 Flow di Resep & Stok**

* Input jumlah boleh pakai unit apapun  
* Sistem:  
  Jumlah Input × Nilai Konversi → Base Unit  
* Semua perhitungan HPP & stok selalu pakai Base Unit

# **6.5. SOURCE VALUE (SUMBER DATA)**

## **6.5.1 Mapping Field → Source**

| Field | Source |
| ----- | ----- |
| Nama Konversi Unit | Input user |
| Unit | Input user |
| Nilai Konversi | Input user |
| Per UOM | Input user |
| Role Unit | Input user |
| Terhubung ke Bahan | Relasi sistem |
| Digunakan di Resep | Kalkulasi sistem |
| Digunakan di Purchase | Kalkulasi sistem |

# **6.6. DAMPAK KE MODUL LAIN**

## Dipakai oleh:

* Bahan Dasar → stok & batas bawah  
* Resep → HPP  
* Arus Stok → normalisasi unit  
* Supplier / Purchase → konversi pembelian  
  Jika konversi diubah:  
* Semua HPP harus direcalculate  
* Stok tetap aman karena disimpan dalam base unit

  # **6.7. Notes**

* Unit dihapus tapi masih dipakai bahan  
* Base unit diganti → trigger recalculation  
* Konversi tidak konsisten (0 atau negatif)  
* Multiple bahan pakai konversi yang sama

**D. Pelanggan**

1. **Pelanggan**

   # **1.1 REQUIREMENT FITUR**

   ## **A. Halaman List Pelanggan**

   ### **1\. Header Section**

* Title: Pelanggan  
* Tombol: Ekspor (Export to Excel)

  ### **2\. Search & Filter Bar**

  #### **Search**

  Field: `Cari nama atau nomor telepon`  
* Search by:  
  * Nama pelanggan  
  * Nomor telepon  
* Real-time filtering

#### **Filter Chips**

| Filter | Fungsi |
| ----- | ----- |
| Tipe | Segmentasi pelanggan (Boil, Hot, Warm) |
| Terakhir Datang | Filter berdasarkan last visit |
| Ulang Tahun | Filter berdasarkan tanggal ulang tahun |
| Total Belanja | Filter berdasarkan nominal transaksi |
| Produk | Filter berdasarkan produk yang pernah dibeli |

## **B. Tabel Data Pelanggan**

### **Kolom:**

| Kolom | Deskripsi |
| ----- | ----- |
| Tipe | Badge segment (Hot / Warm / Boil) |
| Nama Pelanggan | Nama \+ nomor HP |
| Total Reservasi | Jumlah reservasi |
| Transaksi Sukses | Jumlah transaksi sukses |
| Nilai Transaksi | Total belanja |
| Ulang Tahun | Tanggal ulang tahun |
| Produk Disukai | Jumlah favorit |
| Jumlah Koin | Loyalty coin |
| Terakhir Datang | Last visit date |
| Aksi | View detail \+ WhatsApp |

## **C. Detail Pelanggan**

Ketika klik icon 👁

### **Section Ringkasan**

* Ulang Tahun  
* Total Belanja  
* Reservasi  
* Produk Favorit  
* Ulasan  
* Sisa Koin

  ### **Tab:**

* Ringkasan  
* Pesanan  
* Reservasi  
* Ulasan

  ## **D. Export Excel**

  File Excel berisi:

| Field | Mapping |
| ----- | ----- |
| Outlet | Nama outlet |
| Tipe | Segment |
| Nama | customer.name |
| Nomor Telepon | customer.phone |
| Terakhir Datang | last\_transaction\_date |
| Reservasi | count(reservations) |
| Order Total | count(orders) |
| Order Berhasil | count(success\_orders) |
| Total Belanja | sum(order.amount) |
| Ulang Tahun | customer.birthdate |
| Produk Disukai | count(favorite\_products) |
| Jumlah Koin | loyalty\_coin |

# **1.2 FLOW SISTEM**

## **FLOW 1 — Load Halaman Pelanggan**

User buka Menu → Pelanggan  
↓  
System ambil outlet\_id aktif  
↓  
Query semua customer berdasarkan outlet\_id  
↓  
Hitung agregasi:  
   \- total transaksi  
   \- total reservasi  
   \- total belanja  
   \- last visit  
↓  
Render tabel

## **FLOW 2 — Filter Tipe**

User klik "Tipe"  
↓  
Pilih Boil / Hot / Warm  
↓  
System filter berdasarkan field segment  
↓  
Reload tabel

## **FLOW 3 — Filter Terakhir Datang**

Filter options:

* Diantara  
* Sebelum tanggal  
* Sesudah tanggal  
  Query:  
  WHERE last\_transaction\_date BETWEEN X AND Y

  ## **FLOW 4 — Filter Ulang Tahun**

  User pilih:  
* Tanggal  
* Bulan  
* Tahun  
  Query:  
  WHERE DAY(birthdate) \= X  
  AND MONTH(birthdate) \= Y  
    
  Use case:  
  → Campaign birthday promo

  ## **FLOW 5 — Filter Total Belanja**

  User pilih operator:  
* \<  
* \=  
  Query:  
  HAVING SUM(order.amount) \> X

  ## **FLOW 6 — Filter Produk**

  User buka modal produk  
  ↓  
  Pilih kategori  
  ↓  
  Pilih produk  
  ↓  
  System filter customer yang pernah beli produk tsb  
  Query logic:  
  JOIN order\_items  
  JOIN products  
  WHERE products.id IN (...)  
  GROUP BY customer\_id

  ## **FLOW 7 — Detail Pelanggan**

  Klik icon View  
  ↓  
  Ambil detail berdasarkan customer\_id  
  ↓  
  Query:  
     \- Order history  
     \- Reservasi  
     \- Review  
     \- Loyalty  
  ↓  
  Render tabs

  ## **FLOW 8 — Export Excel**

  User klik Export  
  ↓  
  System generate file .xlsx  
  ↓  
  Data sesuai filter aktif  
  ↓  
  Download file

  # **1.3 SOURCE VALUE (ASAL DATA)**

  Berikut mapping data dari database:

## **customers**

| Field | Digunakan untuk |
| ----- | ----- |
| id | primary key |
| outlet\_id | filter outlet |
| name | nama pelanggan |
| phone | nomor |
| birthdate | ulang tahun |
| segment | tipe (Hot/Warm/Boil) |
| created\_at | first visit |

## **orders**

| Field | Digunakan untuk |
| ----- | ----- |
| id | order id |
| customer\_id | relasi |
| outlet\_id | filter outlet |
| status | sukses / batal |
| total\_amount | nilai transaksi |
| created\_at | last visit |

## **reservations**

| Field | Digunakan untuk |
| ----- | ----- |
| id | reservasi id |
| customer\_id | relasi |
| outlet\_id | filter |
| status | valid |
| reservation\_date | tanggal reservasi |

## **order\_items**

Digunakan untuk:

* Produk yang dibeli  
* Filter produk

  ## **favorite\_products**

  Digunakan untuk:  
* Produk disukai  
* Summary detail

  ## **loyalty\_transactions**

  Digunakan untuk:  
* Hitung sisa koin

  # **1.4 LOGIC SEGMENTASI (Tipe Pelanggan)**

  Contoh rule (asumsi umum CRM):

| Segment | Rule |
| ----- | ----- |
| Hot | ≥ 3 transaksi dalam 30 hari |
| Warm | 1–2 transaksi dalam 30 hari |
| Boil | Tidak transaksi \> 30 hari |

  Bisa juga berdasarkan:

* Recency  
* Frequency  
* Monetary (RFM model)

  # **1.5 BUSINESS VALUE FITUR**

  Fitur ini dipakai untuk:  
* Campaign targeting  
* Birthday promo automation  
* High spender detection  
* Identify loyal customer  
* Identify churn customer  
* Marketing performance analysis  
* Export untuk Meta Ads Custom Audience

# **1.6 VALIDATION RULES**

| Field | Validation |
| ----- | ----- |
| Phone | Unique per outlet |
| Birthdate | Optional |
| Segment | Auto calculated |
| Total Belanja | SUM only transaksi sukses |
| Last Visit | MAX(order.created\_at) |

# **1.7 Notes**

* Customer tanpa transaksi → tetap muncul  
* Customer tanpa birthdate → tidak masuk filter ulang tahun  
* Customer dengan transaksi gagal → tidak masuk nilai transaksi  
* Multi outlet → filter by outlet\_id aktif

2. **Reviews**

   # **2.1 REQUIREMENT SISTEM**

   ## **A. Admin Side (Dashboard)**

   ### **1\. Halaman List Reviews**

   Admin dapat:  
* Melihat daftar review  
* Melihat:  
  * Nama pelanggan  
  * Tanggal review  
  * Komentar  
  * Produk yang dibeli  
* Melihat rating (jika ada)  
* Filter berdasarkan outlet (auto dari outlet aktif)  
  Tidak ada:  
* Edit review  
* Hapus review (seharusnya read-only)

  ### **2\. Pengaturan Ulasan**

  Admin dapat:  
* Menambahkan pertanyaan custom  
* Menghapus pertanyaan  
* Mengubah pertanyaan  
* Maksimal rating: 1–5 bintang  
  Contoh pertanyaan:  
* Bagaimana rasa makanan kami?  
* Bagaimana pelayanan kami?  
* Bagaimana pengalaman order?  
  Constraint:  
* Pertanyaan berlaku per outlet  
* Maksimal misalnya 5 pertanyaan aktif  
* Tidak boleh kosong

  ## **B. Customer Side (Frontend)**

  Review hanya muncul jika:  
* Order status \= sukses  
* Order belum pernah direview  
  Customer dapat:  
* Memberi rating bintang 1–5  
* Mengisi komentar (optional)  
* Menjawab pertanyaan rating tambahan

  # **2.2 FLOW SISTEM**

  ## **FLOW 1 — Generate Request Review**

  Customer melakukan transaksi  
  ↓  
  Order status \= SUCCESS  
  ↓  
  System cek:  
    apakah review sudah ada?  
  ↓  
  Jika belum:  
    tampilkan tombol "Beri Ulasan"  
    atau kirim link review via WA/email  
  Trigger bisa dari:  
* Halaman struk digital  
* Halaman success checkout

  ## **FLOW 2 — Customer Submit Review**

  Customer buka halaman review  
  ↓  
  System load:  
    \- order\_id  
    \- produk yang dibeli  
    \- pertanyaan aktif dari outlet  
  ↓  
  Customer isi:  
    \- rating utama (1–5)  
    \- jawaban rating per pertanyaan  
    \- komentar  
  ↓  
  Klik submit  
  ↓  
  System simpan review  
  ↓  
  Order.is\_reviewed \= true

  ## **FLOW 3 — Admin Melihat Review**

  Admin buka Dashboard → Reviews  
  ↓  
  System query review berdasarkan outlet\_id  
  ↓  
  Join:  
    \- customers  
    \- orders  
    \- order\_items  
  ↓  
  Render list review

  ## **FLOW 4 — Admin Atur Pertanyaan**

  Admin buka Pengaturan Ulasan  
  ↓  
  Tambah / edit pertanyaan  
  ↓  
  Klik Simpan  
  ↓  
  System update review\_questions  
    
  Perubahan hanya berlaku untuk review berikutnya.

  # **2.3 SOURCE VALUE (SUMBER DATA)**

  ## **orders**

| Field | Digunakan untuk |
| ----- | ----- |
| id | relasi review |
| customer\_id | relasi customer |
| outlet\_id | filter outlet |
| status | hanya SUCCESS |
| created\_at | tanggal transaksi |

## **customers**

| Field | Digunakan untuk |
| ----- | ----- |
| id | relasi |
| name | nama reviewer |
| phone | kontak |

## **order\_items**

Digunakan untuk:

* Menampilkan produk yang dibeli pada review

## **review\_questions**

| Field | Fungsi |
| ----- | ----- |
| id | question id |
| outlet\_id | scope outlet |
| question\_text | pertanyaan |
| is\_active | aktif/tidak |

## **reviews**

| Field | Fungsi |
| ----- | ----- |
| id | review id |
| outlet\_id | filter |
| customer\_id | relasi |
| order\_id | relasi transaksi |
| rating | rating utama |
| comment | komentar |
| created\_at | tanggal review |

## **Review\_answers**

Digunakan jika ada multi pertanyaan:

| Field | Fungsi |
| ----- | ----- |
| review\_id | relasi |
| question\_id | pertanyaan |
| rating\_value | 1–5 |

# **2.4 VALIDATION RULES**

| Rule | Penjelasan |
| ----- | ----- |
| 1 order \= 1 review | Tidak boleh double review |
| Order harus SUCCESS | Tidak boleh review order batal |
| Rating wajib 1–5 | Tidak boleh kosong |
| Komentar optional | Boleh kosong |
| Review immutable | Tidak bisa diubah setelah submit |

# 

# **2.5 Notes**

* Customer tidak isi komentar → tetap valid  
* Customer buka link review setelah lama → tetap bisa selama order valid  
* Customer coba submit dua kali → ditolak  
* Pertanyaan dihapus → review lama tetap tampil

  # **Flow Sederhana**

  Orders (SUCCESS)  
     ↓  
  Trigger Review Request  
     ↓  
  Customer Submit Review  
     ↓  
  Stored in reviews \+ review\_answers  
     ↓  
  Dashboard Aggregation

  # **Ringkasan**

| Layer | Fungsi |
| ----- | ----- |
| Customer Side | Submit review |
| Review Engine | Validasi & simpan |
| CRM Dashboard | Monitoring |
| Settings Layer | Custom pertanyaan |

3. **Pesan Massal**  
4. **Voucher**  
5. **Koin**

**E. Manajemen Meja**  
**F. Integrasi**