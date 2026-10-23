# TASK: PERBAIKI PROJECT MACHI RAMEN & MATCHA AGAR SESUAI TUGAS WEEK 6 REACT DASAR

Bertindaklah sebagai Senior React Developer yang memahami React dasar, component architecture, state management, controlled forms, dan responsive UI.

Saya memiliki project aplikasi **Machi Ramen & Matcha**, yaitu aplikasi pengelolaan katalog menu kuliner Jepang. Project sebelumnya sudah dibuat menggunakan Antigravity, tetapi hasil implementasinya perlu diperbaiki agar memenuhi seluruh ketentuan tugas perkuliahan Week 6 React Dasar.

Saya akan memberikan:
1. Screenshot tampilan aplikasi yang sekarang.
2. File `index.html` dan file project lainnya.
3. PDF instruksi tugas Week 6 React Dasar.

Tugasmu adalah memeriksa project yang sudah ada, memperbaiki implementasinya secara langsung, dan mempertahankan identitas visual aplikasi. Jangan hanya memberikan contoh kode atau tutorial. Lakukan perubahan pada file project yang relevan.

## 1. BACA DAN AUDIT PROJECT TERLEBIH DAHULU

Sebelum mengubah kode:

- Periksa struktur folder project.
- Baca `package.json`, `index.html`, `src/main.jsx`, `src/App.jsx`, seluruh komponen yang sudah ada, dan file CSS.
- Identifikasi framework, dependency, entry point, serta konfigurasi Vite yang sedang digunakan.
- Periksa apakah project sudah menggunakan React atau masih berupa website HTML statis.
- Periksa apakah Tailwind CSS menggunakan konfigurasi Vite/PostCSS atau CDN.
- Periksa struktur Git dan perubahan yang belum di-commit.
- Gunakan PDF tugas Week 6 sebagai acuan utama pengerjaan.

Jangan mengasumsikan struktur folder sebelum memeriksanya. Jangan menghapus konfigurasi atau file penting tanpa alasan teknis yang jelas.

## 2. PERTAHANKAN DESAIN MACHI RAMEN & MATCHA

Gunakan screenshot yang diberikan sebagai acuan visual utama untuk halaman pengelolaan katalog menu.

Identitas desain yang wajib dipertahankan:

- Nama aplikasi: Machi Ramen & Matcha.
- Subjudul: Sistem Pengelolaan Katalog Menu Kuliner Jepang.
- Background krem/washi: `#FFF4EA`.
- Warna utama merah vermilion: `#E8401C`.
- Warna hijau matcha: `#7A9E3B`.
- Warna teks utama: `#1A1A1A`.
- Font modern dan bersih, menggunakan Inter atau Plus Jakarta Sans jika tersedia.
- Card putih dengan border tipis, sudut membulat, dan bayangan lembut.
- Tombol utama berwarna merah vermilion.
- Layout modern, minimalis, rapi, dan responsif.

Jangan mengubahnya menjadi dashboard generik. Jangan mengganti desain dengan tema gelap, warna dominan biru, atau desain baru yang tidak sesuai screenshot.

### Layout yang harus dipertahankan

**A. Header aplikasi**
- Logo bergaya Jepang dengan karakter `町`.
- Judul Machi Ramen & Matcha.
- Subjudul sistem pengelolaan katalog menu.

**B. Ringkasan data**
Tampilkan tiga kartu statistik:
- Total Menu.
- Varian Ramen.
- Varian Matcha.

Angka harus dihitung dari state menu yang sebenarnya, bukan ditulis secara statis.

**C. Form Tambah Menu Baru**
Form berada di sisi kiri pada desktop dan berisi:
- Nama Hidangan.
- Kategori.
- Harga (Rp).
- Deskripsi Bahan & Sajian.
- Tombol `+ Tambah Menu`.

Pilihan kategori minimal Ramen dan Matcha.

**D. Katalog Menu**
Area katalog berada di sebelah kanan form pada desktop. Setiap menu ditampilkan sebagai card yang berisi:
- Badge kategori.
- Nama hidangan.
- Harga dalam format rupiah.
- Deskripsi menu.
- Tombol hapus yang jelas dan dapat digunakan.

Pada layar kecil, layout berubah menjadi satu kolom tanpa horizontal overflow.

Gunakan tiga data awal yang realistis dan konsisten dengan screenshot:
1. Signature Tonkotsu Ramen — Ramen — Rp58.000.
2. Spicy Tantanmen Tokyo — Ramen — Rp62.000.
3. Uji Matcha Latte — Matcha — Rp38.000.

Deskripsi ketiga menu harus sesuai dengan hidangannya.

Catatan: tampilan screenshot merupakan halaman pengelolaan katalog, bukan landing page promosi restoran. Prioritaskan halaman pengelolaan katalog tersebut.

## 3. IMPLEMENTASIKAN MINIMAL 5 REACT COMPONENT

Semua komponen UI utama harus dibuat sebagai file terpisah di `src/components/`.

Gunakan struktur yang jelas seperti berikut. Sesuaikan apabila project sudah mempunyai struktur yang lebih baik.

```text
src/
├── components/
│   ├── AppHeader.jsx
│   ├── MenuStats.jsx
│   ├── MenuForm.jsx
│   ├── MenuList.jsx
│   └── MenuCard.jsx
├── App.jsx
├── main.jsx
└── index.css
```

Ketentuan setiap component:

1. `AppHeader.jsx`
   - Menampilkan identitas aplikasi.
   - Tidak menyimpan state katalog menu.

2. `MenuStats.jsx`
   - Menerima data atau jumlah menu melalui props.
   - Menghitung atau menampilkan total menu, jumlah ramen, dan jumlah matcha berdasarkan data aktual.

3. `MenuForm.jsx`
   - Menyediakan input nama, kategori, harga, dan deskripsi.
   - Menggunakan controlled component.
   - Menerima callback melalui props untuk menambahkan menu.

4. `MenuList.jsx`
   - Menerima array menu melalui props.
   - Merender daftar menu menggunakan `.map()`.
   - Menampilkan pesan ketika array kosong.

5. `MenuCard.jsx`
   - Menerima satu objek menu dan callback hapus melalui props.
   - Menampilkan nama, kategori, harga, dan deskripsi.
   - Memiliki tombol hapus yang berfungsi.

Boleh menambahkan component lain jika dibutuhkan, tetapi jangan membuat component terpisah yang tidak digunakan.

Pastikan semua component benar-benar diimpor dan digunakan dalam aplikasi. Jangan hanya membuat lima file kosong demi memenuhi persyaratan.

## 4. IMPLEMENTASIKAN STATE DI App.jsx

Simpan daftar menu sebagai array state menggunakan `useState` di `App.jsx`.

Contoh struktur objek menu:

```js
{
  id: "menu-1",
  name: "Signature Tonkotsu Ramen",
  category: "Ramen",
  price: 58000,
  description: "Kaldu ayam dan tulang gurih dimasak perlahan..."
}
```

Gunakan ID unik untuk setiap menu. Jangan menggunakan indeks array sebagai `key`.

Ketentuan implementasi:

- `App.jsx` menjadi sumber utama state katalog menu.
- Gunakan `useState` untuk menyimpan daftar menu.
- Gunakan `.map()` untuk menampilkan daftar menu.
- Setiap item harus menggunakan `key` unik, misalnya `key={menu.id}`.
- Gunakan callback props untuk komunikasi antara `App.jsx` dan komponen anak.
- Gunakan `setMenus` dengan pendekatan immutable.
- Jangan memindahkan sumber utama state katalog ke masing-masing `MenuCard`.
- Jangan menggunakan data hardcoded terpisah untuk statistik.

## 5. IMPLEMENTASIKAN FORM CONTROLLED COMPONENT

Form tambah menu wajib benar-benar interaktif.

Gunakan state untuk mengontrol nilai setiap input. Terapkan `value` dan `onChange` pada input, select, serta textarea yang relevan.

Ketika pengguna menekan tombol `+ Tambah Menu`:

1. Validasi nama hidangan tidak kosong.
2. Validasi kategori sesuai pilihan yang tersedia.
3. Validasi harga berupa angka positif.
4. Validasi deskripsi tidak kosong.
5. Jika valid, buat ID unik dan tambahkan objek menu ke array state.
6. Form kembali kosong setelah berhasil ditambahkan.
7. Menu baru langsung muncul di katalog.
8. Statistik otomatis diperbarui berdasarkan state terbaru.
9. Jika input tidak valid, tampilkan pesan validasi yang jelas.

Gunakan `event.preventDefault()` ketika diperlukan agar form tidak me-refresh halaman.

Jangan menggunakan manipulasi DOM manual untuk menambahkan card.

## 6. CONDITIONAL RENDERING DAN HAPUS MENU

Implementasikan conditional rendering dengan ketentuan berikut:

- Jika katalog kosong, tampilkan teks persis: `Belum ada data Menu`.
- Jika katalog memiliki data, tampilkan seluruh menu.
- Ketika menu dihapus, menu tersebut langsung hilang dari UI.
- Statistik ikut diperbarui setelah penghapusan.
- Jika seluruh menu dihapus, tampilkan pesan kondisi kosong.
- Tombol hapus harus menggunakan ID menu yang benar, bukan indeks array.

Sediakan mekanisme yang memungkinkan kondisi kosong diuji dengan menghapus semua menu atau mengosongkan state untuk pengujian. Tidak perlu membuat tombol debug tambahan di tampilan final.

## 7. PERTAHANKAN KUALITAS IMPLEMENTASI

- Gunakan React functional components.
- Gunakan JSX yang valid.
- Gunakan JavaScript dan React sesuai struktur project yang sudah ada.
- Jangan menambahkan backend, API, database, atau Supabase untuk tugas ini. Fokus pada frontend React dan state lokal sesuai instruksi Week 6.
- Jangan menambahkan dependency baru jika fitur bisa dikerjakan dengan dependency yang sudah tersedia.
- Jangan mengganti Vite atau membuat project baru jika project saat ini sudah bisa diperbaiki.
- Jangan menulis seluruh aplikasi di `index.html`.
- Jangan mengandalkan script HTML statis untuk merender katalog.
- Jangan membuat file CSS atau komponen duplikat yang tidak digunakan.
- Jangan menghapus fitur atau konfigurasi lain yang tidak berkaitan dengan perbaikan.
- Jangan menampilkan data palsu pada statistik.
- Pastikan kode mudah dipahami mahasiswa yang sedang mempelajari React dasar.

`index.html` hanya digunakan sebagai entry HTML untuk aplikasi React, sedangkan UI harus dirender melalui `src/main.jsx`, `src/App.jsx`, dan komponen-komponen React.

Jika terdapat konfigurasi Tailwind CDN dari website sebelumnya, evaluasi apakah kelas CSS benar-benar berfungsi dalam setup React/Vite saat ini. Pastikan styling yang digunakan tetap bekerja setelah aplikasi dijalankan.

## 8. RESPONSIVE DESIGN

Pastikan hasil tetap nyaman digunakan pada:
- Desktop.
- Tablet.
- Smartphone.

Pada desktop, form berada di sebelah kiri dan katalog di sebelah kanan, dengan ringkasan statistik di bagian atas.

Pada layar kecil, semua bagian disusun vertikal. Card, input, tombol, dan teks tidak boleh terpotong. Tombol hapus tetap mudah dijangkau.

## 9. PENGUJIAN WAJIB

Setelah implementasi selesai:

1. Jalankan pemeriksaan build menggunakan script yang tersedia di `package.json`, misalnya `npm run build`.
2. Pastikan tidak ada syntax error atau import yang gagal.
3. Pastikan aplikasi dapat dijalankan melalui `npm run dev` pada Vite.
4. Uji penambahan menu baru.
5. Uji validasi form kosong dan harga tidak valid.
6. Uji penghapusan menu.
7. Uji pembaruan statistik setelah penambahan dan penghapusan.
8. Uji kondisi kosong dengan menghapus seluruh menu.
9. Pastikan seluruh lima component digunakan.
10. Pastikan desain tetap mendekati screenshot awal.

Jika ada error, perbaiki terlebih dahulu dan ulangi pengujian. Jangan mengklaim pengujian berhasil jika belum dijalankan.

## 10. COMMIT DAN PUSH GITHUB

Setelah implementasi dan pengujian berhasil:

- Periksa `git status` dan remote repository yang sudah terpasang.
- Pertahankan seluruh perubahan pengguna yang tidak terkait.
- Pastikan file sensitif dan folder `node_modules` tidak ikut di-commit.
- Periksa riwayat commit yang sudah ada.
- Pastikan repository memiliki minimal dua commit yang terlihat sesuai persyaratan tugas.
- Jangan menghapus atau menulis ulang riwayat Git yang sudah ada.
- Lakukan commit akhir dengan pesan yang jelas, misalnya:

`Tambah component katalog menu, state, dan form input React`

- Lakukan push ke remote repository yang benar jika akses dan autentikasi tersedia.

Jangan membuat repository baru, mengganti remote, melakukan force push, atau mengubah akun GitHub tanpa persetujuan saya. Jika push tidak bisa dilakukan karena autentikasi atau konfigurasi remote, jelaskan penyebabnya dan berikan perintah yang perlu saya jalankan.

## 11. HASIL AKHIR YANG SAYA INGINKAN

Saya ingin mendapatkan:

1. Project React yang sudah diperbaiki langsung pada file project yang ada.
2. Struktur minimal lima component yang benar dan benar-benar digunakan.
3. UI yang mempertahankan desain Machi Ramen & Matcha pada screenshot.
4. Form tambah menu yang interaktif dan menggunakan controlled component.
5. Render list dengan `.map()` dan key unik.
6. Conditional rendering untuk kondisi katalog kosong.
7. Statistik yang selalu sesuai dengan state katalog.
8. Hasil build dan pengujian yang sudah diperiksa.
9. Commit dan push akhir jika memungkinkan.
10. Ringkasan file yang diubah, hasil pengujian, status Git, dan kendala yang masih tersisa.

Prioritas pengerjaan adalah **memenuhi instruksi PDF Week 6, menjaga desain yang sudah ada, serta memastikan seluruh interaktivitas React benar-benar berjalan**.

Mulai dengan mengaudit project yang tersedia, kemudian implementasikan perbaikannya. Jangan berhenti pada tahap analisis atau hanya memberikan potongan kode.