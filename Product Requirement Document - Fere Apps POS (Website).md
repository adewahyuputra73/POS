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
4. **Arus Stok**  
5. **Laba Kotor**  
6. **Pembatalan/ Void**  
7. **Kirim Laporan**  
8. **Unduh Laporan**  
9. **Riwayat Pesanan**

**B. Menu**  
**C. Inventory**  
**D. Pelanggan**  
**E. Manajemen Meja**  
**F. Integrasi**