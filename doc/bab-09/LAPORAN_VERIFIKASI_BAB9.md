# LAPORAN VERIFIKASI AKHIR - BAB 9 NESTJS DASAR + STRUKTUR MVC
**Proyek:** MACHI Japanese Restaurant

---

## 1. Identitas Aplikasi
- **Nama Aplikasi**: MACHI Japanese Restaurant (Website Pengunjung & Dashboard Admin Katalog Menu)
- **Struktur Proyek**:
  - `frontend/` : HTML5, CSS3, Tailwind CSS v4 (`4.3.3`), JavaScript, jQuery `3.7.1`
  - `backend/` : NestJS `12.0.x`, TypeScript `6.0.x`, `class-validator`, `class-transformer`
- **Lingkungan Terverifikasi**: Node.js `v24.14.0`, npm `11.9.0`, NestJS CLI `12.0.13`
- **Base URL API**: `http://localhost:3000/menus`
- **URL Halaman Admin**: `http://127.0.0.1:5500/admin-menu.html` (atau `http://localhost:5500/admin-menu.html`)

---

## 2. Data Utama yang Dikelola
Data utama yang dikelola pada tugas BAB 9 adalah **Katalog Menu (`menus`)** makanan dan minuman MACHI Japanese Restaurant.
- Penyimpanan sementara: **Array in-memory** di dalam `MenusService` (tanpa database, sesuai ketentuan praktikum).
- Data awal: 4 menu bawaan (*Signature Tonkotsu Ramen*, *Spicy Tantanmen Tokyo*, *Uji Ceremonial Matcha Latte*, *Crispy Pan-Fried Gyoza*) dengan `nextId = 5`.

---

## 3. Struktur MVC
Resource `menus` dihasilkan menggunakan Nest CLI (`nest g resource menus --type rest --crud`) dengan pemisahan peran MVC/Modular NestJS:
- **Module**: `backend/src/menus/menus.module.ts` (didaftarkan di `backend/src/app.module.ts`).
- **Model / Entity**: `backend/src/menus/entities/menu.entity.ts`.
- **DTO (Validasi Input)**: `backend/src/menus/dto/create-menu.dto.ts` dan `backend/src/menus/dto/update-menu.dto.ts`.
- **Service (Business Logic & Data)**: `backend/src/menus/menus.service.ts`.
- **Controller (Routing HTTP)**: `backend/src/menus/menus.controller.ts` (menggunakan Dependency Injection `constructor(private readonly menusService: MenusService) {}`).
- **View / Client Frontend**: `frontend/admin-menu.html`, `frontend/css/admin-menu.css`, `frontend/js/admin-menu.js`.

---

## 4. Entity (`backend/src/menus/entities/menu.entity.ts`)
Memiliki 7 field dengan tipe data bervariasi (`number`, `string`, `boolean`, `Date`):
- `id: number`
- `name: string`
- `description: string`
- `price: number`
- `category: string`
- `isAvailable: boolean`
- `createdAt: Date`

---

## 5. Service CRUD (`backend/src/menus/menus.service.ts`)
- `create(createMenuDto)`: validasi nama unik (`ConflictException` jika duplikat *case-insensitive*), generate `id` otomatis, default `isAvailable = true`, set `createdAt = new Date()`, simpan ke array.
- `findAll()`: mengembalikan seluruh array `this.menus`.
- `findOne(id)`: mencari berdasarkan `id`, melempar `NotFoundException` jika tidak ditemukan.
- `update(id, updateMenuDto)`: memastikan data ada (`findOne`), cek duplikasi nama terhadap item lain (`ConflictException`), lalu memperbarui sebagian atau seluruh field.
- `remove(id)`: menghapus item dari array berdasarkan `id` dan mengembalikan pesan konfirmasi beserta data yang dihapus (`NotFoundException` jika tidak ada).

---

## 6. Controller dan Endpoint (`backend/src/menus/menus.controller.ts`)
Seluruh endpoint memanggil `MenusService` melalui Dependency Injection dan menggunakan `ParseIntPipe` pada `:id`:
- `GET /menus` -> `findAll()`
- `GET /menus/:id` -> `findOne(id)`
- `POST /menus` -> `create(createMenuDto)`
- `PATCH /menus/:id` -> `update(id, updateMenuDto)`
- `DELETE /menus/:id` -> `remove(id)`

---

## 7. DTO dan Validasi
- **`CreateMenuDto`**:
  - `name`: `@IsString()`, `@IsNotEmpty()`, `@MinLength(3)`
  - `description`: `@IsString()`, `@IsNotEmpty()`, `@MinLength(10)`
  - `price`: `@Type(() => Number)`, `@IsNumber()`, `@Min(1000)`
  - `category`: `@IsString()`, `@IsIn(['Ramen', 'Sushi', 'Donburi', 'Matcha', 'Minuman', 'Sampingan', 'Dessert'])`
  - `isAvailable`: `@IsOptional()`, `@IsBoolean()`
- **`UpdateMenuDto`**: `PartialType(CreateMenuDto)` untuk mendukung pembaruan sebagian field.
- **Global `ValidationPipe`** (`backend/src/main.ts`): `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`.

---

## 8. Exception
- **`NotFoundException` (HTTP 404)**: saat `id` menu tidak ditemukan pada `GET /menus/:id`, `PATCH /menus/:id`, atau `DELETE /menus/:id`.
- **`ConflictException` (HTTP 409)**: saat `name` menu duplikat pada `POST /menus` atau `PATCH /menus/:id`.
- **`BadRequestException` (HTTP 400)**: otomatis oleh `ValidationPipe` dan `ParseIntPipe` saat input DTO atau ID tidak valid.

---

## 9. Pengujian REST Client (`backend/menus.http`) - TERVERIFIKASI LIVE
Seluruh 8 skenario dijalankan langsung terhadap server aktif `http://localhost:3000/menus`:

| No | Skenario | Method & Endpoint | Status Aktual | Hasil |
| :--- | :--- | :--- | :--- | :--- |
| 1 | GET seluruh menu | `GET /menus` | **200 OK** | 4 data awal tampil |
| 2 | GET detail menu | `GET /menus/1` | **200 OK** | Detail *Signature Tonkotsu Ramen* tampil |
| 3 | POST tambah menu | `POST /menus` (*Chicken Katsu Don*) | **201 Created** | Terbuat dengan `id: 5` |
| 4 | PATCH ubah menu | `PATCH /menus/5` (`45000`, `false`) | **200 OK** | Harga & status terbarui |
| 5 | DELETE hapus menu | `DELETE /menus/5` | **200 OK** | Menu ID `5` terhapus |
| 6 | Uji `NotFoundException` | `GET /menus/999` | **404 Not Found** | Pesan ID `999` tidak ditemukan |
| 7 | Uji `ConflictException` | `POST /menus` (*Signature Tonkotsu Ramen*) | **409 Conflict** | Pesan nama duplikat sudah terdaftar |
| 8 | Uji validasi DTO | `POST /menus` (`name: "A"`, `price: 500`, `category: "Unknown"`) | **400 Bad Request** | Daftar error validasi `class-validator` |

---

## 10. Integrasi Frontend-Backend (`frontend/admin-menu.html`)
- **Sumber Data**: Murni Fetch API ke `http://localhost:3000/menus` (tanpa mock data dan tanpa `localStorage`).
- **CORS**: Aktif di `backend/src/main.ts` dengan pola `^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$` untuk method `GET, POST, PATCH, DELETE, OPTIONS` dan header `Content-Type, Accept`.
- **Halaman Frontend**: `GET http://127.0.0.1:5500/admin-menu.html` merespons **HTTP 200**.

---

## 11. Hasil Pengujian CRUD & Pemisahan Verifikasi

### A. Hasil yang Benar-Benar Dijalankan & Lulus (Otomatis / Live HTTP)
- **Backend Build (`npm --prefix backend run build`)**: **LULUS** (0 error).
- **Backend E2E Test (`npm --prefix backend run test:e2e`)**: **LULUS** (5/5 test, `257ms`).
- **Simulasi Payload Frontend (`Origin: http://127.0.0.1:5500`)**:
  - `POST /menus` (*Chicken Katsu Test*, `42000`, `Donburi`, `true`) -> **HTTP 201** (`id: 6`).
  - `PATCH /menus/6` (`45000`, `false`) -> **HTTP 200**.
  - `DELETE /menus/6` -> **HTTP 200**.
  - `GET /menus/6` setelah dihapus -> **HTTP 404**.

### B. Bagian yang Memerlukan Verifikasi Visual & Screenshot Manual di Browser
Karena otomasi browser Chrome tidak dapat terhubung (`DevToolsActivePort` belum aktif pada mesin lokal), klik antarmuka browser dan pengambilan screenshot dilakukan manual dan disimpan ke folder yang sudah disiapkan:

1. **`doc/bab-09/01-rest-client/`** (via VS Code REST Client pada `backend/menus.http`):
   - `GET-all-menus.png` (status `200`)
   - `GET-menu-detail.png` (status `200`)
   - `POST-create-menu.png` (status `201`)
   - `PATCH-update-menu.png` (status `200`)
   - `DELETE-remove-menu.png` (status `200`)
   - `ERROR-404.png` (status `404`)
   - `ERROR-409.png` (status `409`)
   - `ERROR-400.png` (status `400`)

2. **`doc/bab-09/02-frontend-integration/`** (buka `http://127.0.0.1:5500/admin-menu.html` dengan DevTools `F12` → tab **Network**):
   - `admin-menu-page.png` (tampilan awal halaman + badge `API Terhubung`)
   - `get-menu-display.png` (daftar menu awal dari `GET /menus`)
   - `post-create-menu.png` (tambah *Chicken Katsu Test*, `42000`, `Donburi`, `Available` -> muncul di daftar & status `201`)
   - `patch-update-menu.png` (edit ke `45000` & tidak tersedia -> tampilan berubah `Habis` & status `200`)
   - `delete-remove-menu.png` (hapus menu uji -> hilang dari daftar & status `200`)

---

## 12. Kesimpulan
Seluruh 8 persyaratan praktikum **BAB 9 - NestJS Dasar + Struktur MVC** pada proyek **MACHI Japanese Restaurant** telah terimplementasi lengkap dan terverifikasi pada level build, E2E test, REST API live (termasuk `400`, `404`, `409`, dan CORS), serta halaman administrasi frontend. Langkah terakhir yang tersisa hanyalah pengambilan 13 screenshot bukti manual ke folder `doc/bab-09/` untuk dilampirkan pada laporan praktikum.
