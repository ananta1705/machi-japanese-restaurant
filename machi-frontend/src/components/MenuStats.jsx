export default function MenuStats({ menus }) {
  const totalMenu = menus.length;
  const totalRamen = menus.filter((menu) => menu.category === 'Ramen').length;
  const totalMatcha = menus.filter((menu) => menu.category === 'Matcha').length;

  return (
    <section className="machi-summary-section" aria-label="Ringkasan Statistik Menu">
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon-box">
            <span className="summary-icon-kanji" aria-hidden="true">品</span>
          </div>
          <div className="summary-text-block">
            <span className="summary-label">TOTAL MENU</span>
            <div className="summary-value-row">
              <span className="summary-number">{totalMenu}</span>
              <span className="summary-unit">Hidangan</span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box summary-ramen-icon">
            <span className="summary-icon-kanji" aria-hidden="true">麺</span>
          </div>
          <div className="summary-text-block">
            <span className="summary-label">VARIAN RAMEN</span>
            <div className="summary-value-row">
              <span className="summary-number text-aka">{totalRamen}</span>
              <span className="summary-unit">Menu</span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box summary-matcha-icon">
            <span className="summary-icon-kanji" aria-hidden="true">茶</span>
          </div>
          <div className="summary-text-block">
            <span className="summary-label">VARIAN MATCHA</span>
            <div className="summary-value-row">
              <span className="summary-number text-matcha">{totalMatcha}</span>
              <span className="summary-unit">Menu</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
