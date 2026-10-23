import { useState } from 'react';
import AppHeader from './components/AppHeader';
import MenuStats from './components/MenuStats';
import MenuForm from './components/MenuForm';
import MenuList from './components/MenuList';
import './App.css';

// Data awal katalog menu
const INITIAL_MENUS = [
  {
    id: 'menu-1',
    name: 'Signature Tonkotsu Ramen',
    category: 'Ramen',
    price: 58000,
    description:
      'Kuah kaldu gurih yang dimasak perlahan selama 18 jam, chashu panggang lembut, telur ajitama, dan mi segar buatan tangan.',
    image:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'menu-2',
    name: 'Spicy Tantanmen Tokyo',
    category: 'Ramen',
    price: 62000,
    description:
      'Kuah wijen pekat gurih, chili oil aromatik buatan sendiri, dan daging cincang pedas.',
    image:
      'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'menu-3',
    name: 'Uji Matcha Latte',
    category: 'Matcha',
    price: 38000,
    description:
      'Matcha murni Uji Kyoto grade seremonial dipadu susu segar gurih creamy alami.',
    image:
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=300&q=80',
  },
];

// Gambar default per kategori untuk menu yang baru ditambahkan
const DEFAULT_IMAGE = {
  Ramen:
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=300&q=80',
  Matcha:
    'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=300&q=80',
  Sushi:
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=300&q=80',
  'Side Dish':
    'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=300&q=80',
};

export default function App() {
  // Sumber utama state katalog menu
  const [menus, setMenus] = useState(INITIAL_MENUS);

  // Tambah menu baru di urutan paling atas (immutable)
  const handleAddMenu = (menuData) => {
    const id = crypto?.randomUUID?.() ?? `menu-${Date.now()}`;
    setMenus((prev) => [
      { ...menuData, id, image: DEFAULT_IMAGE[menuData.category] },
      ...prev,
    ]);
  };

  // Hapus menu berdasarkan id
  const handleDeleteMenu = (id) => {
    setMenus((prev) => prev.filter((menu) => menu.id !== id));
  };

  return (
    <div className="machi-page-wrapper">
      <AppHeader />
      <main className="machi-container">
        <MenuStats menus={menus} />
        <div className="machi-main-grid">
          <aside>
            <MenuForm onAddMenu={handleAddMenu} />
          </aside>
          <section>
            <MenuList menus={menus} onDeleteMenu={handleDeleteMenu} />
          </section>
        </div>
      </main>
      <footer className="machi-site-footer">
        <p>&copy; 2026 Machi Ramen &amp; Matcha &bull; Senopati, Jakarta Selatan &bull; Buka 10.00 &ndash; 22.00 WIB</p>
      </footer>
    </div>
  );
}
