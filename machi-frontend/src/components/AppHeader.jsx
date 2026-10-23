export default function AppHeader() {
  return (
    <header className="machi-header-wrapper">
      <div className="machi-navbar">
        <div className="navbar-container">
          <div className="brand-link">
            <div className="brand-logo-badge" aria-hidden="true">町</div>
            <div className="brand-text">
              <span className="brand-title">MACHI <span className="brand-kana" lang="ja">マチ</span></span>
              <span className="brand-sub">RAMEN &amp; MATCHA</span>
            </div>
          </div>
          <div className="nav-tagline-wrapper">
            <span className="nav-tagline-pill">Sistem Pengelolaan Katalog Menu Kuliner Jepang</span>
          </div>
        </div>
      </div>
    </header>
  );
}
