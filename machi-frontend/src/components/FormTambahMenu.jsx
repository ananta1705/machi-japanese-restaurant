import { useState } from 'react';

const KATEGORI_OPSI = ['Ramen', 'Matcha', 'Sushi', 'Side Dish'];

const DEFAULT_GAMBAR = {
  Ramen: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=300&q=80',
  Matcha: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=300&q=80',
  Sushi: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=300&q=80',
  'Side Dish': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=300&q=80',
};

export default function FormTambahMenu({ onTambahMenu }) {
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('Ramen');
  const [harga, setHarga] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [gambarUrl, setGambarUrl] = useState('');
  const [pesanError, setPesanError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanNama = nama.trim();
    const cleanDeskripsi = deskripsi.trim();
    const numericHarga = Number(harga);

    if (!cleanNama) {
      setPesanError('Nama menu wajib diisi.');
      return;
    }

    if (!harga || isNaN(numericHarga) || numericHarga <= 0) {
      setPesanError('Harga harus berupa angka lebih besar dari 0.');
      return;
    }

    const itemBaru = {
      id: Date.now(),
      nama: cleanNama,
      kategori,
      harga: numericHarga,
      deskripsi: cleanDeskripsi || 'Penyajian istimewa dengan bahan segar pilihan dari dapur Machi.',
      gambar: gambarUrl.trim() || DEFAULT_GAMBAR[kategori],
    };

    onTambahMenu(itemBaru);

    // Reset nilai form
    setNama('');
    setKategori('Ramen');
    setHarga('');
    setDeskripsi('');
    setGambarUrl('');
    setPesanError('');
  };

  return (
    <section className="form-bento-card" aria-labelledby="form-heading">
      <div className="form-card-header">
        <div className="form-eyebrow">
          <span className="eyebrow-dot">●</span>
          <span>INPUT KATALOG</span>
        </div>
        <h2 id="form-heading" className="form-main-title">Tambah Menu</h2>
        <p className="form-sub-text">
          Tambahkan varian hidangan baru ke dalam katalog Machi.
        </p>
      </div>

      {pesanError && (
        <div className="form-alert-error" role="alert">
          {pesanError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="machi-entry-form" noValidate>
        <div className="field-block">
          <label htmlFor="input-nama">Nama Hidangan *</label>
          <input
            id="input-nama"
            type="text"
            placeholder="Contoh: Signature Tonkotsu"
            value={nama}
            onChange={(e) => {
              setNama(e.target.value);
              if (pesanError) setPesanError('');
            }}
            required
          />
        </div>

        <div className="field-block">
          <label htmlFor="select-kategori">Kategori *</label>
          <select
            id="select-kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
          >
            {KATEGORI_OPSI.map((kat) => (
              <option key={kat} value={kat}>
                {kat}
              </option>
            ))}
          </select>
        </div>

        <div className="field-block">
          <label htmlFor="input-harga">Harga (Rp) *</label>
          <input
            id="input-harga"
            type="number"
            min="1000"
            step="500"
            placeholder="Contoh: 58000"
            value={harga}
            onChange={(e) => {
              setHarga(e.target.value);
              if (pesanError) setPesanError('');
            }}
            required
          />
        </div>

        <div className="field-block">
          <label htmlFor="input-deskripsi">Deskripsi Bahan &amp; Sajian</label>
          <textarea
            id="input-deskripsi"
            rows="3"
            placeholder="Tuliskan komposisi bahan atau keunikan sajian..."
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
          />
        </div>

        <div className="field-block">
          <label htmlFor="input-gambar">URL Foto Sajian (Opsional)</label>
          <input
            id="input-gambar"
            type="url"
            placeholder="https://... (otomatis foto Unsplash jika kosong)"
            value={gambarUrl}
            onChange={(e) => setGambarUrl(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-machi-submit">
          <span>+ Tambah Menu</span>
          <span className="btn-arrow" aria-hidden="true">❯</span>
        </button>
      </form>
    </section>
  );
}
