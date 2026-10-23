import KartuMenu from './KartuMenu';

export default function DaftarMenu({ menuList, onHapusMenu }) {
  return (
    <section className="machi-list-section" aria-labelledby="popular-heading">
      <div className="popular-header-bar">
        <div>
          <div className="section-eyebrow">
            <span className="eyebrow-dot">●</span>
            <span>FAVORIT PELANGGAN</span>
          </div>
          <h2 id="popular-heading" className="popular-main-title">
            MENU TERPOPULER MACHI
          </h2>
        </div>
        <span className="popular-counter-badge">
          {menuList.length} Hidangan Aktif
        </span>
      </div>

      {menuList.length === 0 ? (
        <div className="empty-state-card" role="status">
          <div className="empty-hanko-circle" aria-hidden="true" lang="ja">
            空
          </div>
          <p className="empty-state-message">Belum ada data Menu</p>
          <p className="empty-state-help">
            Silakan masukkan data sajian baru melalui formulir di sebelah kiri.
          </p>
        </div>
      ) : (
        <div className="popular-menu-list">
          {menuList.map((item) => (
            <KartuMenu
              key={item.id}
              item={item}
              onHapus={onHapusMenu}
            />
          ))}
        </div>
      )}
    </section>
  );
}
