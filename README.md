# MACHI Japanese Restaurant - Panduan Penggunaan, Backend, Frontend & Terminal

Dokumentasi operasional untuk menjalankan, menggunakan, dan menguji aplikasi **MACHI Japanese Restaurant** (Frontend HTML/CSS/Tailwind v4/JS + Backend REST API NestJS).

---

## 1. Struktur Proyek

```text
machi-japanese-restaurant/
├── frontend/                  # Website pengunjung & dashboard admin
│   ├── index.html             # Beranda (Japanese Bento Editorial)
│   ├── menu.html              # Daftar 52 menu + keranjang pesanan
│   ├── promo.html             # Promo & kupon
│   ├── about.html             # Tentang kedai Machi
│   ├── contact.html           # Reservasi & kontak
│   ├── admin-menu.html        # Halaman CRUD Katalog Menu (terhubung ke NestJS)
│   ├── 404.html               # Halaman tidak ditemukan
│   ├── css/                   # input.css, output.css, custom.css, admin-menu.css
│   ├── js/                    # main.js, admin-menu.js, jquery-3.7.1.min.js
│   ├── assets/                # Gambar & ikon
│   └── package.json           # Script build Tailwind CSS v4
│
└── backend/                   # REST API NestJS + TypeScript (MVC)
    ├── src/
    │   ├── menus/             # Resource CRUD /menus (array in-memory)
    │   ├── orders/            # Resource /orders (tersimpan ke data/orders.json)
    │   ├── app.module.ts
    │   └── main.ts            # Global ValidationPipe + CORS localhost
    ├── data/orders.json       # Penyimpanan permanen pesanan pelanggan
    ├── test/app.e2e-spec.ts   # Pengujian E2E Vitest + Supertest
    ├── menus.http             # File pengujian REST Client VS Code
    └── package.json           # Script NestJS
```

---

## 2. Cara Menjalankan Backend (BE) dan Frontend (FE)

Buka **2 terminal PowerShell terpisah** di folder root proyek: `D:\machi-japanese-restaurant`.

### A. Menjalankan Backend (NestJS, Port `3000`)
**Dari folder root:**
```powershell
npm --prefix backend run start:dev
```
**Atau masuk ke folder `backend/` terlebih dahulu:**
```powershell
cd backend
npm run start:dev
```
Jika berhasil, muncul log `Nest application successfully started` dan API aktif di:
- Daftar Menu: `http://localhost:3000/menus`
- Daftar Pesanan: `http://localhost:3000/orders`

### B. Menjalankan Frontend (Port `5500`)
Pilih salah satu cara berikut (wajib dibuka lewat server HTTP lokal, **bukan** klik dua kali `file://`):

- **Cara 1 (Lewat Terminal dari folder root):**
  ```powershell
  npx serve frontend -l 5500
  ```
- **Cara 2 (VS Code Live Server):**
  Klik kanan file `frontend/index.html` atau `frontend/admin-menu.html` lalu pilih **Open with Live Server**.

### C. Build Tailwind CSS (Saat Mengedit Tampilan Frontend)
Jika Anda mengubah class Tailwind pada file HTML di `frontend/`:
```powershell
# Build sekali (produksi / minify)
npm --prefix frontend run build

# Mode watch (otomatis kompilasi saat file disimpan)
npm --prefix frontend run dev
```

### D. Alamat Halaman di Browser
- **Beranda**: `http://localhost:5500/index.html`
- **Daftar Menu**: `http://localhost:5500/menu.html`
- **Admin Katalog Menu (CRUD)**: `http://localhost:5500/admin-menu.html`
- **Promo**: `http://localhost:5500/promo.html`
- **Tentang**: `http://localhost:5500/about.html`
- **Kontak & Reservasi**: `http://localhost:5500/contact.html`

---

## 3. Cara Menggunakan Alur Pemesanan (Pelanggan)

1. Pastikan **Backend (`port 3000`)** dan **Frontend (`port 5500`)** keduanya aktif.
2. Buka `http://localhost:5500/index.html` atau `http://localhost:5500/menu.html`.
3. **Langkah 1 - Pilih Menu**:
   - Klik tombol **+ Tambah** atau **Pesan** pada hidangan yang diinginkan (bisa memilih lebih dari satu menu).
   - Bar keranjang otomatis muncul di bawah layar (`Jumlah Item • Total Harga`) dan angka badge bertambah di ikon tas header.
4. **Langkah 2 - Cek Keranjang**:
   - Klik **Lihat Pesanan** (di bar bawah) atau ikon tas di header.
   - Atur jumlah porsi dengan tombol `+` / `-`, atau klik **Kosongkan** jika ingin mengulang.
   - Klik **Lanjut Isi Data**.
5. **Langkah 3 - Isi Data & Konfirmasi**:
   - Isi **Nama Pemesan** (minimal 2 karakter) dan **Nomor WhatsApp** (minimal 8 digit).
   - Pilih cara pengambilan: **Dine-in** (isi Nomor Meja), **Takeaway**, atau **Delivery** (wajib isi Alamat).
   - Pilih **Metode Pembayaran** (`QRIS`, `Transfer Bank`, atau `Tunai di Kasir`) dan catatan bila perlu.
   - Klik **Konfirmasi & Buat Pesanan**.
6. **Hasil**:
   - Pesanan dikirim ke `POST http://localhost:3000/orders` tanpa keluar ke WhatsApp.
   - Muncul notifikasi sukses dan **Struk Nomor Pesanan** (misal `#MCH-0001`, status `DIPROSES`).
   - Data pesanan otomatis tersimpan ke file `backend/data/orders.json`.

---

## 4. Cara Menggunakan Admin Katalog Menu (CRUD)

Buka `http://localhost:5500/admin-menu.html` saat backend aktif:
- **Lihat Menu (`GET`)**: Daftar menu otomatis termuat dari `http://localhost:3000/menus`. Gunakan kolom pencarian, filter kategori, atau tombol **Muat Ulang (GET)**.
- **Tambah Menu (`POST`)**: Isi Nama (min 3 karakter, tidak boleh duplikat), Deskripsi (min 10 karakter), Harga (min `1000`), Kategori, dan centang Ketersediaan, lalu klik **Tambah Menu (POST)**.
- **Edit Menu (`PATCH`)**: Klik tombol **Edit** pada kartu menu, ubah field yang diinginkan, lalu klik **Simpan Perubahan (PATCH)**.
- **Hapus Menu (`DELETE`)**: Klik tombol **Hapus** pada kartu menu, lalu konfirmasi di dialog **Ya, Hapus Menu**.

---

## 5. Panduan Terminal: Perintah Penting & Cara Mengecek Data

Seluruh perintah di bawah ini dijalankan dari folder root `D:\machi-japanese-restaurant>`.

### A. Instalasi, Build, dan Pengujian Otomatis
```powershell
# Instalasi dependensi (cukup sekali atau saat package.json berubah)
npm --prefix frontend install
npm --prefix backend install

# Build frontend & backend
npm --prefix frontend run build
npm --prefix backend run build

# Menjalankan E2E test backend (uji GET, POST, PATCH, DELETE, 400, 404, 409)
npm --prefix backend run test:e2e
```

### B. Mengecek Data API Langsung lewat Terminal PowerShell

1. **Cek seluruh data Menu (`GET /menus`)**:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:3000/menus" -Method GET
   ```

2. **Cek detail 1 Menu (`GET /menus/1`)**:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:3000/menus/1" -Method GET
   ```

3. **Tambah Menu baru (`POST /menus`)**:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:3000/menus" -Method POST -ContentType "application/json" -Body '{"name":"Chicken Katsu Don","description":"Japanese rice bowl with crispy chicken katsu","price":42000,"category":"Donburi","isAvailable":true}'
   ```

4. **Edit Menu (`PATCH /menus/5`)**:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:3000/menus/5" -Method PATCH -ContentType "application/json" -Body '{"price":45000,"isAvailable":false}'
   ```

5. **Hapus Menu (`DELETE /menus/5`)**:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:3000/menus/5" -Method DELETE
   ```

6. **Cek seluruh Pesanan yang masuk (`GET /orders`)**:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:3000/orders" -Method GET
   ```

7. **Cek isi file database lokal pesanan (`orders.json`)**:
   ```powershell
   Get-Content backend\data\orders.json
   ```

### C. Mengecek lewat Browser & VS Code
- **Browser**: Buka `http://localhost:3000/menus` atau `http://localhost:3000/orders` lalu tekan `F5` setelah melakukan perubahan.
- **Browser DevTools**: Tekan `F12` → buka tab **Network** → filter **Fetch/XHR** untuk melihat status HTTP (`200`, `201`, `400`, `404`, `409`), payload, dan response JSON.
- **VS Code REST Client**: Buka `backend/menus.http` lalu klik **Send Request** pada tiap blok pengujian.

---

## 6. Troubleshooting Singkat

- **`ENOENT ... backend\backend\package.json`**: Anda menjalankan `npm --prefix backend ...` saat terminal sudah berada di dalam folder `backend/`. Cukup ketik `npm run start:dev` langsung, atau kembali ke root dengan `cd D:\machi-japanese-restaurant`.
- **`404 The requested path could not be found` di `localhost:5500`**: `npx serve frontend -l 5500` dijalankan dari dalam folder `backend/`. Hentikan (`Ctrl + C`), ketik `cd D:\machi-japanese-restaurant`, lalu jalankan ulang.
- **`Gagal terhubung ke backend`**: Pastikan server backend (`npm --prefix backend run start:dev`) sedang aktif di port `3000` dan halaman frontend dibuka lewat `http://localhost:...` atau `http://127.0.0.1:...` (bukan `file://`).
- **Port `3000` atau `5500` sudah dipakai (`EADDRINUSE`)**: Tutup terminal lama yang masih menjalankan server tersebut dengan `Ctrl + C`.
