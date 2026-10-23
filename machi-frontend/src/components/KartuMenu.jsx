export default function KartuMenu({ item, onHapus }) {
  const getBadgeClass = (kategori) => {
    switch (kategori) {
      case 'Matcha':
        return 'badge-matcha';
      case 'Ramen':
        return 'badge-ramen';
      case 'Sushi':
        return 'badge-sushi';
      default:
        return 'badge-sidedish';
    }
  };

  const getHankoTag = (kategori) => {
    switch (kategori) {
      case 'Matcha':
        return '抹茶';
      case 'Ramen':
        return '名物';
      case 'Sushi':
        return '寿司';
      default:
        return '小皿';
    }
  };

  const hargaRupiah = `Rp ${Number(item.harga).toLocaleString('id-ID')}`;

  return (
    <article className="popular-menu-card group" aria-label={item.nama}>
      {/* Gambar Lingkaran Otentik persis seperti di index.html (Menu Terpopuler) */}
      <figure className="card-figure-circle">
        <img
          src={item.gambar}
          alt={item.nama}
          loading="lazy"
          className="card-circle-img"
        />
        <span className="hanko-stamp-square" lang="ja">
          {getHankoTag(item.kategori)}
        </span>
      </figure>

      {/* Konten Keterangan Item */}
      <div className="card-info-content">
        <div className="card-title-row">
          <h3 className="card-title-text" title={item.nama}>
            {item.nama}
          </h3>
          <span className={`category-pill-badge ${getBadgeClass(item.kategori)}`}>
            {item.kategori}
          </span>
        </div>

        <p className="card-desc-text">
          {item.deskripsi}
        </p>

        {/* Bar Bawah: Harga & Tombol Hapus */}
        <div className="card-action-row">
          <data value={item.harga} className="card-price-value">
            {hargaRupiah}
          </data>
          <button
            type="button"
            className="btn-delete-circle"
            onClick={() => onHapus(item.id)}
            aria-label={`Hapus ${item.nama}`}
            title={`Hapus ${item.nama}`}
          >
            &times;
          </button>
        </div>
      </div>
    </article>
  );
}
