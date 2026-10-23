import { useState } from 'react';
import Header from './components/Header';
import RingkasanMenu from './components/RingkasanMenu';
import FormTambahMenu from './components/FormTambahMenu';
import DaftarMenu from './components/DaftarMenu';
import './App.css';

const INITIAL_MENU = [
  {
    id: 1,
    nama: 'Signature Tonkotsu',
    kategori: 'Ramen',
    harga: 58000,
    deskripsi: 'Kaldu 18 jam, chashu bakar lembut, telur ajitama, dan mi segar buatan tangan.',
    gambar: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    nama: 'Spicy Tantanmen',
    kategori: 'Ramen',
    harga: 62000,
    deskripsi: 'Kuah wijen pekat gurih, chili oil aromatik buatan sendiri, dan daging cincang pedas.',
    gambar: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3,
    nama: 'Uji Matcha Latte',
    kategori: 'Matcha',
    harga: 38000,
    deskripsi: 'Matcha murni Uji Kyoto grade seremonial dipadu susu segar gurih creamy alami.',
    gambar: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 4,
    nama: 'Crispy Gyoza',
    kategori: 'Side Dish',
    harga: 34000,
    deskripsi: 'Gyoza panggang renyah berpadu isian daging ayam cincang gurih dan saus celup ponzu.',
    gambar: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=300&q=80',
  },
];

export default function App() {
  const [menuList, setMenuList] = useState(INITIAL_MENU);

  // Menambahkan menu baru ke urutan teratas
  const handleTambahMenu = (itemBaru) => {
    setMenuList((prevList) => [itemBaru, ...prevList]);
  };

  // Menghapus menu berdasarkan ID
  const handleHapusMenu = (id) => {
    setMenuList((prevList) => prevList.filter((item) => item.id !== id));
  };

  return (
    <div className="machi-page-wrapper">
      <Header />

      {/* Hero Banner persis seperti pada index.html */}
      <section className="machi-hero-banner" aria-labelledby="hero-title">
        <div className="hero-content-wrapper">
          <div className="hero-pill-badge">
            <span className="hero-pill-dot" aria-hidden="true"></span>
            <span>✦ MENYAJIKAN KEBAHAGIAAN SEJAK 2015</span>
          </div>

          <h1 id="hero-title" className="hero-giant-title">
            BAWA CITA RASA{' '}
            <span className="hero-inline-icon" aria-hidden="true">
              🍜
            </span>{' '}
            JEPANG KE RUMAHMU
            <span className="hero-hanko-stamp" lang="ja">
              町 • 一期一会
            </span>
          </h1>

          <p className="hero-description">
            <strong>Machi Ramen &amp; Matcha</strong> (町) menghadirkan kehangatan cita rasa
            kampung halaman Jepang ke Senopati. Kuah kaldu kolagen 18 jam, mi kenyal buatan
            fajar, dan ceremonial matcha murni pilihan perkebunan Uji, Kyoto.
          </p>

          <div className="hero-trust-bar">
            <div className="trust-item">
              <span className="trust-stars">★★★★★</span>
              <strong>4.9/5</strong> (2.8k+ Ulasan)
            </div>
            <span className="trust-separator">|</span>
            <div className="trust-item">
              <strong>100% Halal</strong> Ingredients
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive App Area */}
      <main className="machi-container">
        <RingkasanMenu menuList={menuList} />
        
        <div className="machi-main-grid">
          <aside className="machi-sidebar-col">
            <FormTambahMenu onTambahMenu={handleTambahMenu} />
          </aside>
          <section className="machi-content-col">
            <DaftarMenu menuList={menuList} onHapusMenu={handleHapusMenu} />
          </section>
        </div>
      </main>

      {/* Footer persis gaya index.html */}
      <footer className="machi-site-footer">
        <p>
          &copy; 2026 Machi Ramen &amp; Matcha &bull; Senopati, Jakarta Selatan &bull; Buka 10.00 &ndash; 22.00 WIB
        </p>
      </footer>
    </div>
  );
}
