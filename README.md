# TemanTani — React.js

Aplikasi frontend React 19 dengan JavaScript (JSX), CSS, dan Vite. Tampilan mengikuti desain TemanTani yang sudah dibuat.

## Menjalankan

Gunakan Node.js 22.12+ atau Node.js 24. Buka terminal di folder proyek:

```sh
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite, biasanya http://127.0.0.1:5173.

Versi React harus dijalankan melalui server Vite; jangan membuka `index.html` langsung dari File Explorer.

```sh
npm test          # tes tanggal, validasi data, dan normalisasi varietas
npm run build    # hasil produksi di dist/
npm run preview  # pratinjau hasil build
```

## Struktur kode

```text
src/
  main.jsx          # createRoot dan StrictMode
  App.jsx           # state aplikasi, navigasi hash, dan notifikasi
  Components.jsx    # Header, Footer, Calendar, Journey, kartu panduan, dialog
  Pages.jsx         # Beranda, Rencana, Dashboard, Cuaca, Panduan, Tentang
  data.js           # data contoh dan isi panduan
  lib.js            # tanggal, validasi, dan penyimpanan browser
  lib.test.js       # tes fungsi utama
  styles.css        # tampilan responsif
public/assets/      # gambar, SVG, font Inter, dan lisensi font
```

Form menggunakan state React, komponen kalender berbagi data melalui props, dan data tersimpan menggunakan localStorage. Kunci penyimpanan versi sebelumnya dipertahankan. Data lama dapat dibaca jika dibuka dari origin browser yang sama (protokol, host, dan port yang sama). Data dari file:// tidak otomatis berpindah ke localhost.

## Fitur

- Kalender interaktif, navigasi bulan, tanggal semai, dan simulasi perkiraan panen.
- Validasi form lahan, komoditas, varietas, luas, dan tanggal.
- Simpan, ubah, batal, dan catatan lahan dengan penyimpanan browser.
- Panduan dengan pencarian, kategori, dan halaman bacaan.
- Cuaca contoh dengan pilihan lokasi.
- Navigasi seluler, keyboard, dialog, dan tata letak responsif.

## Batasan

Cuaca adalah contoh tetap 12–14 November 2026. Mengubah lokasi tidak mengambil data terbaru. Umur varietas adalah nilai simulasi yang perlu disesuaikan dengan label benih. Belum ada backend, akun, sinkronisasi perangkat, atau kontak/media sosial aktif.

Beranda, Rencana Tanam, dan Ubah Rencana berasal dari konteks desain Figma yang tersedia. Detail layar Cuaca, Panduan, dan Panduan Padi belum terverifikasi terhadap desain lengkap karena kuota Figma MCP habis. Ketiganya dikembangkan dari komponen dan isi Beranda. Dashboard melengkapi alur penyimpanan lokal.

## Verifikasi migrasi

Tiga tes fungsi utama dan build produksi lulus. Pengujian browser mencakup pembaruan kalender, simpan dan muat ulang, ubah dan batal rencana, hasil pencarian kosong, dialog, menu seluler, dan lebar halaman tanpa overflow. Tidak ada error atau warning konsol pada pengujian akhir.

Repository tujuan: https://github.com/adityanurarif9-ai/teman_tani
