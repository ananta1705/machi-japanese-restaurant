import MenuCard from './MenuCard';

// Katalog menu: menampilkan seluruh card, atau pesan kondisi kosong bila belum ada data.
export default function MenuList({ menus, onDeleteMenu }) {
  return (
    <section className="machi-list-section" aria-labelledby="catalog-heading">
      <div className="popular-header-bar">
        <div>
          <h2 id="catalog-heading" className="popular-main-title">
            Katalog Menu
          </h2>
        </div>
        <span className="popular-counter-badge">{menus.length} Hidangan Aktif</span>
      </div>

      {menus.length === 0 ? (
        <div className="empty-state-card" role="status">
          <div className="empty-hanko-circle" aria-hidden="true" lang="ja">
            空
          </div>
          <p className="empty-state-message">Belum ada data Menu</p>
          <p className="empty-state-help">
            Isi formulir Tambah Menu Baru untuk menambahkan hidangan pertama.
          </p>
        </div>
      ) : (
        <div className="popular-menu-list">
          {menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} onDelete={onDeleteMenu} />
          ))}
        </div>
      )}
    </section>
  );
}
