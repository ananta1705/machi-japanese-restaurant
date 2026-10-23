// Kartu satu hidangan: foto bulat dengan cap hanko, badge kategori, harga, dan tombol hapus.
export default function MenuCard({ menu, onDelete }) {
  // Kelas badge mengikuti kategori hidangan.
  const getBadgeClass = (category) => {
    switch (category) {
      case 'Ramen':
        return 'badge-ramen';
      case 'Matcha':
        return 'badge-matcha';
      case 'Sushi':
        return 'badge-sushi';
      default:
        return 'badge-sidedish';
    }
  };

  // Cap hanko kanji sebagai penanda kategori pada foto.
  const getHankoTag = (category) => {
    switch (category) {
      case 'Ramen':
        return '名物';
      case 'Matcha':
        return '抹茶';
      case 'Sushi':
        return '寿司';
      default:
        return '小皿';
    }
  };

  // Harga tampil dalam format rupiah, contoh: Rp 58.000
  const priceLabel = `Rp ${Number(menu.price).toLocaleString('id-ID')}`;

  return (
    <article className="popular-menu-card" aria-label={menu.name}>
      <figure className="card-figure-circle">
        <img
          src={menu.image}
          alt=""
          loading="lazy"
          className="card-circle-img"
        />
        <span className="hanko-stamp-square" lang="ja" aria-hidden="true">
          {getHankoTag(menu.category)}
        </span>
      </figure>

      <div className="card-info-content">
        <div className="card-title-row">
          <h3 className="card-title-text" title={menu.name}>
            {menu.name}
          </h3>
          <span className={`category-pill-badge ${getBadgeClass(menu.category)}`}>
            {menu.category}
          </span>
        </div>

        <p className="card-desc-text">{menu.description}</p>

        <div className="card-action-row">
          <data value={menu.price} className="card-price-value">
            {priceLabel}
          </data>
          <button
            type="button"
            className="btn-delete-circle"
            onClick={() => onDelete(menu.id)}
            aria-label={`Hapus ${menu.name}`}
            title={`Hapus ${menu.name}`}
          >
            &times;
          </button>
        </div>
      </div>
    </article>
  );
}
