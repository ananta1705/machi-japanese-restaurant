# AUDIT SISTEM LENGKAP - MACHI JAPANESE RESTAURANT

Dokumen ini merangkum seluruh hasil audit, perubahan arsitektur, implementasi fitur, perbaikan bug, serta hasil verifikasi sistem **MACHI Japanese Restaurant** dari instruksi awal hingga kondisi akhir saat ini.

---

## 1. Ringkasan Status Sistem Saat Ini

| Komponen | Lokasi | Teknologi | Status Verifikasi |
| :--- | :--- | :--- | :--- |
| **Frontend Pengunjung & Admin** | `frontend/` | HTML5, CSS3, Tailwind CSS v4 (`4.3.3`), JavaScript, jQuery `3.7.1` | Build lulus (`npm --prefix frontend run build`) |
| **Backend REST API** | `backend/` | NestJS `12.0.x`, TypeScript `6.0.x`, `class-validator`, `class-transformer` | Build lulus (`nest build`), E2E test **5/5 lulus** |
| **Penyimpanan Data Menu** | `backend/src/menus/menus.service.ts` | Array in-memory (sesuai ketentuan BAB 9) | CRUD (`GET`, `POST`, `PATCH`, `DELETE`) & error `400/404/409` teruji |
| **Penyimpanan Data Pesanan** | `backend/data/orders.json` | JSON persisten melalui `OrdersModule` (`POST/GET /orders`) | `OPTIONS 204`, `POST 201`, `GET 200` teruji |
| **Dokumentasi Penggunaan** | `README.md` | Markdown | Tersedia di root proyek |

---

## 2. Kronologi Lengkap Audit & Pengembangan (Tahap 1 s.d. Tahap 10)

### Tahap 1: Audit Struktur & Penghapusan Proyek Lama (`machi-frontend/`)
- **Temuan Audit**: Folder `machi-frontend/` merupakan proyek React + Vite terpisah dari tugas sebelumnya dan tidak direferensikan oleh satu pun file di website utama.
- **Tindakan**: Menghapus seluruh folder `machi-frontend/` beserta sisa file biner `rolldown-binding.win32-x64-msvc.node` yang sempat terkunci proses Windows, lalu memverifikasi build Tailwind CSS tetap berjalan normal.

### Tahap 2: Audit Visual & Pengembangan Halaman Home (`frontend/index.html`)
- **Temuan Antislop (DURING Mode)**:
  - Ditemukan konflik variabel warna `--color-washi` antara `input.css` (`#FFF4EA`) dan `custom.css` (`#FFFFFF`).
  - Hero lama memakai eyebrow pill badge generik, glow orb `blur-3xl`, dan angka ulasan tanpa sumber (`4.9/5 • 2.8k+`).
  - Section keunggulan memakai 4 kartu identik (*copy-paste cards*) dan section testimoni berisi ulasan fiktif.
- **Tindakan**:
  - Merancang dan menerapkan gaya **Japanese Bento Editorial** dengan palet presisi: Warm Cream (`#FFF3E8`), Sumi (`#191919`), Vermilion Red (`#D93612`), Mustard Yellow (`#E9AC38`), dan Deep Indigo (`#20358F`).
  - Mengubah Hero menjadi komposisi 2 kolom (40% tipografi editorial + 3 metrik faktual kedai, 60% **Interactive Bento Box** 4 kompartemen asimetris + strip detail bawah).
  - Mengubah *Menu Terpopuler* menjadi layout asimetris `1 + 2`, *Filosofi Dapur* menjadi split foto kedai + daftar bernomor `01`–`04`, *Uji Matcha* ke pita Deep Indigo, serta mengganti testimoni fiktif dengan galeri dapur berbasis aset nyata.

### Tahap 3: Interaksi Drag & Drop Bento Box
- **Tindakan**: Menambahkan interaksi **Pointer Drag & Drop** pada 4 kompartemen `#hero-bento-grid` di `frontend/js/main.js` dan animasi swap/drop target di `frontend/css/custom.css`, lengkap dengan dukungan **Keyboard Arrow Swap** (aksesibilitas R-32), klik untuk memperbarui *Tasting Bar*, dan tombol **Reset**.

### Tahap 4: Perbaikan Bug Header Dark Mode & Konflik Tailwind CDN
- **Temuan Bug**:
  - Saat halaman di-scroll > 30px, `js/main.js` menambahkan `dark:bg-[#14110f]/95` ke header sehingga teks navigasi gelap tidak terbaca pada perangkat dengan OS dark mode.
  - Script `<script src="https://cdn.tailwindcss.com"></script>` (Tailwind v3) bentrok dengan `./css/output.css` (Tailwind v4) dan menyebabkan Hero bertumpuk 1 kolom.
- **Perbaikan**: Menghapus `dark:bg-[#14110f]/95` di `js/main.js`, menghapus CDN Tailwind v3 dari `index.html`, dan mengompilasi ulang `css/output.css`.

### Tahap 5: Animasi Scroll di Seluruh Halaman
- **Tindakan**: Menambahkan `#scroll-progress-bar`, `IntersectionObserver` (`[data-reveal]` dengan `.reveal-up`, `.reveal-left`, `.reveal-right`, dan staggered delay), serta parallax halus pada watermark kanji Hero, dengan dukungan penuh `prefers-reduced-motion: reduce`. Diterapkan ke `index.html`, `menu.html`, `promo.html`, `about.html`, `contact.html`, dan `404.html`.

### Tahap 6: Setup Backend NestJS & Implementasi CRUD `/menus` (BAB 9)
- **Lingkungan Terverifikasi**: Node.js `v24.14.0`, npm `11.9.0`, NestJS CLI `12.0.13`.
- **Implementasi**:
  - Resource `menus` dengan struktur MVC: `Menu` entity (`id`, `name`, `description`, `price`, `category`, `isAvailable`, `createdAt`), `CreateMenuDto` (`@IsString`, `@IsNotEmpty`, `@MinLength`, `@IsNumber`, `@Min`, `@IsIn`, `@IsOptional`, `@IsBoolean`), dan `UpdateMenuDto` (`PartialType`).
  - `MenusService` berbasis array in-memory dengan 4 data awal, auto-increment ID, `ConflictException` (409) untuk nama duplikat, dan `NotFoundException` (404) untuk ID tidak ditemukan.
  - `MenusController` dengan Dependency Injection `MenusService` dan `ParseIntPipe` pada parameter `:id`.
  - Global `ValidationPipe` (`whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`) di `main.ts`.
  - Pengujian E2E (`vitest` + `supertest`): **5/5 test lulus**.

### Tahap 7: Pengujian REST Client (`backend/menus.http`)
- **Tindakan**: Membuat file `menus.http` berisi 8 skenario pengujian (`A`–`H`) dan mengujinya langsung ke server port `3000`:
  - `GET /menus` (`200`), `GET /menus/1` (`200`), `POST /menus` (`201`), `PATCH /menus/5` (`200`), `DELETE /menus/5` (`200`), `GET /menus/999` (`404`), duplikat `POST /menus` (`409`), dan DTO tidak valid (`400`).

### Tahap 8: Integrasi Frontend-Backend (`frontend/admin-menu.html`)
- **Tindakan**:
  - Membuat halaman administrasi khusus `admin-menu.html`, `css/admin-menu.css`, dan `js/admin-menu.js` dengan Fetch API murni ke `http://localhost:3000/menus`.
  - Dilengkapi status koneksi API, statistik ringkas berbasis data riil, pencarian & filter kategori, state *loading/empty/error*, dialog konfirmasi hapus, serta penanganan pesan error informatif HTTP `400`, `404`, dan `409`.
  - Mengaktifkan konfigurasi CORS di `backend/src/main.ts`.

### Tahap 9: Restrukturisasi Proyek (`frontend/` & `backend/`)
- **Tindakan**:
  - Memindahkan seluruh file frontend (`assets/`, `components/`, `css/`, `doc/`, `js/`, 7 file HTML, `package.json`, `package-lock.json`) ke `frontend/`.
  - Mengubah nama `machi-backend/` menjadi `backend/`.
  - Memasang dependensi terpisah di `frontend/`, memverifikasi build `frontend/`, build `backend/`, E2E test, serta integrasi langsung antar server `5500` dan `3000`, baru kemudian menghapus `node_modules/` lama di root.
  - Menambahkan `backend/dist/` ke `.gitignore`.

### Tahap 10: Penyederhanaan Alur Pemesanan & Penyimpanan Pesanan ke Backend (`OrdersModule`)
- **Masalah Awal**: Tombol *Pesan* pada setiap item menu membuka form tunggal yang memaksa pengguna mengisi form berulang kali dan langsung diarahkan keluar ke WhatsApp.
- **Solusi**:
  - Membuat **Keranjang Pesanan Terpadu 2 Langkah (`MachiCart`)** di `frontend/js/main.js` (bisa tambah banyak menu, atur jumlah `+`/`-`, hitung total otomatis, dan tersimpan di `sessionStorage`).
  - Membuat modul baru **`OrdersModule`** (`backend/src/orders/`) dengan endpoint `POST /orders`, `GET /orders`, dan `GET /orders/:id` yang menyimpan pesanan secara persisten ke **`backend/data/orders.json`**.
  - Mengubah tombol checkout menjadi **Konfirmasi & Buat Pesanan** yang mengirim langsung ke `POST /orders`, menampilkan notifikasi sukses + struk kode pesanan (`#MCH-XXXX`) di dalam drawer tanpa pindah ke WhatsApp.
  - Memperbaiki kebijakan CORS di `backend/src/main.ts` ke pola regex `^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$` agar semua port lokal (termasuk Live Server `5501`, `5502`, dll.) berjalan lancar sementara domain eksternal tetap ditolak.
  - Membuat dokumentasi operasional lengkap di `README.md`.

---

## 3. Audit Keamanan, Aksesibilitas & Kualitas Kode

- **Keamanan & Validasi**:
  - CORS dibatasi ketat hanya untuk origin lokal (`localhost` / `127.0.0.1`), tidak menggunakan wildcard `*`.
  - Global `ValidationPipe` mengaktifkan `whitelist: true` dan `forbidNonWhitelisted: true` untuk mencegah *mass assignment* / properti ilegal.
  - Render data dinamis di frontend (`admin-menu.js` dan `main.js`) menggunakan `escapeHtml()` untuk mencegah XSS.
- **Aksesibilitas & Antislop**:
  - Seluruh tombol interaktif utama memiliki ukuran minimal `44px` (*tap target*).
  - Drawer & dialog mendukung penutupan dengan tombol `Escape` serta atribut `aria-live`, `aria-labelledby`, dan `role="alert"`.
  - Animasi CSS & scroll-reveal mematuhi `@media (prefers-reduced-motion: reduce)`.
  - Tidak ada data statistik atau testimoni fiktif pada halaman Home maupun Admin.

---

## 4. Catatan & Rekomendasi Tahap Berikutnya

1. **Git Commit**: Seluruh perubahan restrukturisasi (`frontend/`, `backend/`, `README.md`, `AUDIT_SISTEM.md`) belum di-commit sesuai ketentuan. Lakukan `git add .` dan `git commit` bila sudah siap menyimpan versi ini.
2. **Database Permanen untuk `/menus`**: Saat ini `/orders` sudah persisten di `backend/data/orders.json`, sedangkan `/menus` masih menggunakan array in-memory sesuai spesifikasi BAB 9. Pada bab database selanjutnya, keduanya dapat dimigrasikan ke PostgreSQL/MySQL menggunakan Prisma atau TypeORM.
3. **Warning Engine Node.js**: Terdapat peringatan minor `EBADENGINE` saat `npm install` di `backend/` (`@nestjs/schematics@12.0.13` menyarankan Node `^24.15.0`, terpasang `v24.14.0`). Tidak menghambat build maupun runtime saat ini.
4. **Sinkronisasi Katalog Pengunjung**: Halaman `frontend/menu.html` saat ini masih memuat daftar 52 menu statis HTML, sedangkan `frontend/admin-menu.html` terhubung langsung ke REST API `/menus`. Ke depan, `menu.html` dapat dihubungkan agar juga membaca daftar menu secara dinamis dari `GET /menus`.
