# Machi Frontend: Aplikasi Pengelolaan Katalog Menu Restoran Jepang

Proyek web frontend berbasis **React** dan **Vite** untuk tugas kuliah frontend, dirancang khusus untuk kedai **Machi Ramen & Matcha**. Aplikasi ini memungkinkan pengelola restoran mengelola katalog menu kuliner Jepang (Ramen, Matcha, Sushi, Side Dish) dengan interaktivitas penuh, validasi form, dan ringkasan metrik dinamis.

---

## 1. Fitur Utama

- **Katalog Menu Interaktif**: Menampilkan daftar hidangan lengkap dengan badge kategori, nama hidangan, harga berformat Rupiah (`id-ID`), dan deskripsi bahan.
- **Form Tambah Menu (Controlled Component)**: Menambahkan menu baru ke urutan teratas secara real-time dengan validasi input.
- **Ringkasan Dinamis (Metric Cards)**: Menghitung secara otomatis total seluruh menu, varian Ramen, dan varian Matcha yang sedang aktif.
- **Conditional Rendering**: Menampilkan pesan `"Belum ada data Menu"` ketika seluruh data dihapus atau daftar kosong.
- **Penghapusan Menu**: Setiap kartu menu dilengkapi tombol hapus (`×`) untuk menghapus data berdasarkan ID unik.
- **Desain Otentik Khas Machi**: Menggunakan palet warna Washi (`#FFF4EA`), Sumi (`#1A1A1A`), Aka (`#E8401C`), dan Matcha (`#7A9E3B`) dengan tata letak dua kolom responsif.

---

## 2. Struktur Proyek

```text
machi-frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Identitas kedai, logo kanji 町, dan tagline
│   │   ├── RingkasanMenu.jsx    # Perhitungan metrik total menu, ramen, matcha
│   │   ├── FormTambahMenu.jsx   # Controlled component penambahan menu
│   │   ├── DaftarMenu.jsx       # Conditional rendering & list render (.map)
│   │   └── KartuMenu.jsx        # Komponen kartu item hidangan individual
│   ├── App.jsx                  # State utama, initial data, handler fungsi
│   ├── App.css                  # Tema visual Machi & layout responsif
│   ├── index.css                # Reset dasar CSS
│   └── main.jsx                 # Entry point React
├── package.json
└── README.md
```

---

## 3. Langkah Menjalankan Aplikasi

1. Masuk ke direktori proyek:
   ```bash
   cd machi-frontend
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```

4. Buka peramban di URL:
   ```text
   http://localhost:5173
   ```
