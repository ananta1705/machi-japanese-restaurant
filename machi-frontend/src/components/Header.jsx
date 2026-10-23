export default function Header() {
  return (
    <header className="machi-header-wrapper">
      {/* Sticky Main Navbar persis seperti pada index.html */}
      <div className="machi-navbar">
        <div className="navbar-container">
          {/* Brand Logo & Kanji Machi */}
          <div className="brand-link">
            <div className="brand-logo-badge" aria-hidden="true">
              町
            </div>
            <div className="brand-text">
              <span className="brand-title">
                MACHI <span className="brand-kana" lang="ja">マチ</span>
              </span>
              <span className="brand-sub">RAMEN &amp; MATCHA</span>
            </div>
          </div>

          {/* Nav Links Desktop */}
          <nav className="desktop-nav" aria-label="Navigasi Utama">
            <span className="nav-item nav-active">BERANDA</span>
            <span className="nav-item">MENU</span>
            <span className="nav-item">PROMO</span>
            <span className="nav-item">TENTANG</span>
            <span className="nav-item">KONTAK</span>
          </nav>

          {/* Tagline Resmi Sistem Pengelolaan */}
          <div className="nav-tagline-wrapper">
            <span className="nav-tagline-pill">
              Sistem Pengelolaan Katalog Menu Kuliner Jepang
            </span>
          </div>
        </div>
      </div>

      {/* Running Marquee Strip persis seperti pada index.html */}
      <div className="machi-marquee-strip" aria-hidden="true">
        <div className="marquee-content">
          <span lang="ja">ラーメン • MACHI RAMEN</span>
          <span>✦</span>
          <span lang="ja">宇治抹茶 • CEREMONIAL MATCHA</span>
          <span>✦</span>
          <span lang="ja">焼き餃子 • CRISPY GYOZA</span>
          <span>✦</span>
          <span>18H SLOW COOKED BROTH</span>
          <span>✦</span>
          <span lang="ja">一期一会 • ICHIGO ICHIE</span>
          <span>✦</span>
          <span lang="ja">ラーメン • MACHI RAMEN</span>
          <span>✦</span>
          <span lang="ja">宇治抹茶 • CEREMONIAL MATCHA</span>
          <span>✦</span>
          <span lang="ja">焼き餃子 • CRISPY GYOZA</span>
          <span>✦</span>
          <span>18H SLOW COOKED BROTH</span>
          <span>✦</span>
          <span lang="ja">一期一会 • ICHIGO ICHIE</span>
        </div>
      </div>
    </header>
  );
}
