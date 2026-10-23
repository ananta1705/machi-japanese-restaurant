import { useState } from 'react';

// Pilihan kategori yang tersedia di katalog Machi
const KATEGORI_OPSI = ['Ramen', 'Matcha', 'Sushi', 'Side Dish'];

export default function MenuForm({ onAddMenu }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Ramen');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Sembunyikan pesan error begitu pengguna mulai memperbaiki isian
  const clearError = () => {
    if (error) setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validasi berurutan, tampilkan pesan pertama yang gagal
    if (!name.trim()) {
      setError('Nama menu wajib diisi.');
      return;
    }

    if (!KATEGORI_OPSI.includes(category)) {
      setError('Pilih kategori yang tersedia.');
      return;
    }

    if (!price || !Number.isFinite(Number(price)) || Number(price) <= 0) {
      setError('Harga harus berupa angka lebih besar dari 0.');
      return;
    }

    if (!description.trim()) {
      setError('Deskripsi menu wajib diisi.');
      return;
    }

    onAddMenu({
      name: name.trim(),
      category,
      price: Number(price),
      description: description.trim(),
    });

    // Kembalikan form ke kondisi awal setelah berhasil ditambahkan
    setName('');
    setCategory('Ramen');
    setPrice('');
    setDescription('');
    setError('');
  };

  return (
    <section className="form-bento-card" aria-labelledby="form-heading">
      <div className="form-card-header">
        <h2 id="form-heading" className="form-main-title">
          Tambah Menu Baru
        </h2>
        <p className="form-sub-text">
          Lengkapi data hidangan untuk menambahkannya ke katalog Machi.
        </p>
      </div>

      {error && (
        <div className="form-alert-error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="machi-entry-form" noValidate>
        <div className="field-block">
          <label htmlFor="input-nama">Nama Hidangan *</label>
          <input
            id="input-nama"
            type="text"
            placeholder="Contoh: Signature Tonkotsu Ramen"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearError();
            }}
            required
          />
        </div>

        <div className="field-block">
          <label htmlFor="select-kategori">Kategori *</label>
          <select
            id="select-kategori"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              clearError();
            }}
            required
          >
            {KATEGORI_OPSI.map((kategori) => (
              <option key={kategori} value={kategori}>
                {kategori}
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
            value={price}
            onChange={(event) => {
              setPrice(event.target.value);
              clearError();
            }}
            required
          />
        </div>

        <div className="field-block">
          <label htmlFor="input-deskripsi">Deskripsi Bahan &amp; Sajian *</label>
          <textarea
            id="input-deskripsi"
            rows="3"
            placeholder="Tuliskan komposisi bahan atau keunikan sajian..."
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              clearError();
            }}
            required
          />
        </div>

        <button type="submit" className="btn-machi-submit">
          + Tambah Menu
        </button>
      </form>
    </section>
  );
}
