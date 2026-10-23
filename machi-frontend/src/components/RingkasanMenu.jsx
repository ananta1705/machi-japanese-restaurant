export default function RingkasanMenu({ menuList }) {
  const totalMenu = menuList.length;
  const totalRamen = menuList.filter((item) => item.kategori === 'Ramen').length;
  const totalMatcha = menuList.filter((item) => item.kategori === 'Matcha').length;

  return (
    <section className="machi-summary-section" aria-label="Ringkasan Statistik Menu">
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon-box">
            <span className="summary-emoji" aria-hidden="true">🍱</span>
          </div>
          <div className="summary-text-block">
            <span className="summary-label">TOTAL MENU AKTIF</span>
            <div className="summary-value-row">
              <span className="summary-number">{totalMenu}</span>
              <span className="summary-unit">Varian</span>
            </div>
          </div>
          <span className="summary-hanko" lang="ja">全品</span>
        </div>

        <div className="summary-card summary-ramen-card">
          <div className="summary-icon-box summary-ramen-icon">
            <span className="summary-emoji" aria-hidden="true">🍜</span>
          </div>
          <div className="summary-text-block">
            <span className="summary-label">VARIAN RAMEN</span>
            <div className="summary-value-row">
              <span className="summary-number text-aka">{totalRamen}</span>
              <span className="summary-unit">Menu</span>
            </div>
          </div>
          <span className="summary-hanko hanko-aka" lang="ja">拉麺</span>
        </div>

        <div className="summary-card summary-matcha-card">
          <div className="summary-icon-box summary-matcha-icon">
            <span className="summary-emoji" aria-hidden="true">🍵</span>
          </div>
          <div className="summary-text-block">
            <span className="summary-label">VARIAN MATCHA</span>
            <div className="summary-value-row">
              <span className="summary-number text-matcha">{totalMatcha}</span>
              <span className="summary-unit">Menu</span>
            </div>
          </div>
          <span className="summary-hanko hanko-matcha" lang="ja">宇治</span>
        </div>
      </div>
    </section>
  );
}
