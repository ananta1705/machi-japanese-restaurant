# Machi Ramen & Matcha - Sistem Pengelolaan Katalog Menu Kuliner Jepang

Aplikasi React untuk tugas Week 6 React Dasar. Aplikasi ini dipakai untuk mengelola katalog menu kuliner Jepang di kedai Machi Ramen & Matcha dengan state lokal, tanpa backend.

Identitas visual Machi tetap dipertahankan: latar washi, aksen vermilion, dan hijau matcha.

---

## 1. Fitur

- State katalog menu disimpan di `src/App.jsx` memakai `useState` sebagai satu sumber data.
- Lima komponen UI: `AppHeader`, `MenuStats`, `MenuForm`, `MenuList`, dan `MenuCard`.
- Form tambah menu terkontrol (input, select, textarea) dengan validasi nama, kategori, harga angka positif, dan deskripsi.
- Menu baru langsung muncul di urutan teratas katalog, lalu form kembali kosong.
- Hapus menu per item lewat tombol hapus pada kartu menu, berdasarkan ID unik menu.
- Statistik dihitung otomatis dari state: total menu, varian Ramen, dan varian Matcha.
- Conditional rendering: teks `Belum ada data Menu` tampil ketika katalog kosong.
- Layout responsif: form di kiri dan katalog di kanan pada desktop, tersusun satu kolom pada layar kecil.

---

## 2. Struktur Proyek

```text
machi-frontend/
├── src/
│   ├── components/
│   │   ├── AppHeader.jsx    # Identitas aplikasi Machi
│   │   ├── MenuStats.jsx    # Statistik total menu, varian Ramen, varian Matcha
│   │   ├── MenuForm.jsx     # Form tambah menu (controlled component)
│   │   ├── MenuList.jsx     # Render daftar menu dan kondisi kosong
│   │   └── MenuCard.jsx     # Kartu satu hidangan dan tombol hapus
│   ├── App.jsx              # State katalog menu dan handler tambah/hapus
│   ├── App.css              # Tema visual Machi dan layout responsif
│   ├── index.css            # Reset dasar CSS
│   └── main.jsx             # Entry point React
├── index.html
├── package.json
└── README.md
```

---

## 3. Cara Menjalankan

Prasyarat: Node.js versi modern (20.19+ atau 22.12+). Semua perintah dijalankan dari folder `machi-frontend`.

- `npm install` untuk memasang dependensi.
- `npm run dev` untuk menjalankan Vite dev server, buka `http://localhost:5173`.
- `npm run build` untuk membuat build produksi.
- `npm run lint` untuk memeriksa kode dengan oxlint.

---

## 4. Catatan

- Data awal berisi 3 menu contoh: Signature Tonkotsu Ramen, Spicy Tantanmen Tokyo, dan Uji Matcha Latte.
- Aplikasi ini murni frontend. Tidak ada backend, API, atau database.
