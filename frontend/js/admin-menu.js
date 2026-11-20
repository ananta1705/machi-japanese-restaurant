/**
 * MACHI Japanese Restaurant: Admin Menu Management Script
 * Connects admin-menu.html to NestJS REST API (http://localhost:3000/menus)
 * using native Fetch API (GET, POST, PATCH, DELETE).
 */
(function () {
  'use strict';

  const API_BASE_URL = 'http://localhost:3000/menus';

  const state = {
    menus: [],
    editingId: null,
    deletingId: null,
    selectedCategory: 'ALL',
    searchQuery: '',
    isLoading: false,
    isSubmitting: false,
  };

  // DOM Elements
  const els = {
    apiStatus: document.getElementById('api-status-badge'),
    statTotal: document.getElementById('stat-total-menus'),
    statAvailable: document.getElementById('stat-available-menus'),
    statCategories: document.getElementById('stat-categories-count'),

    form: document.getElementById('menu-form'),
    formTitle: document.getElementById('form-mode-title'),
    formSubtitle: document.getElementById('form-mode-subtitle'),
    formErrorBox: document.getElementById('form-error-box'),
    formErrorTitle: document.getElementById('form-error-title'),
    formErrorList: document.getElementById('form-error-list'),

    inputName: document.getElementById('menu-name'),
    inputDescription: document.getElementById('menu-description'),
    inputPrice: document.getElementById('menu-price'),
    inputCategory: document.getElementById('menu-category'),
    inputAvailable: document.getElementById('menu-available'),
    btnSubmit: document.getElementById('btn-submit-menu'),
    btnCancelEdit: document.getElementById('btn-cancel-edit'),

    filterCategory: document.getElementById('filter-category'),
    searchInput: document.getElementById('search-menu'),
    btnRefresh: document.getElementById('btn-refresh-menus'),

    listLoading: document.getElementById('list-loading-state'),
    listError: document.getElementById('list-error-state'),
    listErrorText: document.getElementById('list-error-text'),
    btnRetryLoad: document.getElementById('btn-retry-load'),
    listEmpty: document.getElementById('list-empty-state'),
    menuList: document.getElementById('admin-menu-list'),
    resultCount: document.getElementById('list-result-count'),

    toastRegion: document.getElementById('admin-toast-region'),
    deleteDialog: document.getElementById('delete-confirm-dialog'),
    deleteTargetName: document.getElementById('delete-target-name'),
    btnConfirmDelete: document.getElementById('btn-confirm-delete'),
    btnCancelDelete: document.getElementById('btn-cancel-delete'),
  };

  // =========================================================================
  // HELPERS
  // =========================================================================

  function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  }

  function formatDate(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = String(value ?? '');
    return div.innerHTML;
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const typeClass =
      type === 'error'
        ? 'admin-toast-error'
        : type === 'info'
          ? 'admin-toast-info'
          : 'admin-toast-success';

    const label = type === 'error' ? 'Gagal' : type === 'info' ? 'Info' : 'Berhasil';
    toast.className = `admin-toast ${typeClass} flex items-start justify-between gap-3`;
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
      <div>
        <strong class="font-heading font-extrabold uppercase text-[11px] tracking-wider block">${label}</strong>
        <span>${escapeHtml(message)}</span>
      </div>
      <button type="button" class="font-bold px-2 py-0.5 rounded hover:bg-black/10" aria-label="Tutup notifikasi">✕</button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => toast.remove());

    els.toastRegion.appendChild(toast);
    setTimeout(() => {
      if (toast.isConnected) toast.remove();
    }, 4500);
  }

  function setApiStatus(connected, text) {
    if (!els.apiStatus) return;
    if (connected) {
      els.apiStatus.className = 'admin-badge admin-badge-available';
      els.apiStatus.textContent = text || 'API Terhubung (Port 3000)';
    } else {
      els.apiStatus.className = 'admin-badge admin-badge-unavailable';
      els.apiStatus.textContent = text || 'API Tidak Terjangkau';
    }
  }

  function clearFormErrors() {
    els.formErrorBox.classList.add('hidden');
    els.formErrorTitle.textContent = '';
    els.formErrorList.innerHTML = '';
  }

  function showFormErrors(title, messages) {
    els.formErrorTitle.textContent = title;
    els.formErrorList.innerHTML = '';
    const list = Array.isArray(messages) ? messages : [messages];
    list.forEach((msg) => {
      const li = document.createElement('li');
      li.textContent = msg;
      els.formErrorList.appendChild(li);
    });
    els.formErrorBox.classList.remove('hidden');
    els.formErrorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  async function parseApiError(response) {
    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    const rawMessage = payload && payload.message ? payload.message : null;
    const messages = Array.isArray(rawMessage)
      ? rawMessage
      : rawMessage
        ? [rawMessage]
        : [`Permintaan gagal dengan status HTTP ${response.status}.`];

    if (response.status === 400) {
      return {
        status: 400,
        title: 'Validasi Data Gagal (HTTP 400)',
        messages,
      };
    }
    if (response.status === 404) {
      return {
        status: 404,
        title: 'Data Tidak Ditemukan (HTTP 404)',
        messages,
      };
    }
    if (response.status === 409) {
      return {
        status: 409,
        title: 'Konflik Nama Menu (HTTP 409)',
        messages,
      };
    }
    return {
      status: response.status,
      title: `Terjadi Kesalahan Server (HTTP ${response.status})`,
      messages,
    };
  }

  // =========================================================================
  // RENDERING & STATES
  // =========================================================================

  function updateSummaryStats() {
    const total = state.menus.length;
    const available = state.menus.filter((item) => item.isAvailable).length;
    const categories = new Set(state.menus.map((item) => item.category)).size;

    els.statTotal.textContent = String(total);
    els.statAvailable.textContent = String(available);
    els.statCategories.textContent = String(categories);
  }

  function getFilteredMenus() {
    return state.menus.filter((item) => {
      const matchCategory =
        state.selectedCategory === 'ALL' || item.category === state.selectedCategory;
      const q = state.searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }

  function setListView(mode, errorText = '') {
    els.listLoading.classList.toggle('hidden', mode !== 'loading');
    els.listError.classList.toggle('hidden', mode !== 'error');
    els.listEmpty.classList.toggle('hidden', mode !== 'empty');
    els.menuList.classList.toggle('hidden', mode !== 'list');

    if (mode === 'error') {
      els.listErrorText.textContent = errorText;
    }
  }

  function renderMenus() {
    updateSummaryStats();
    const filtered = getFilteredMenus();
    els.resultCount.textContent = `Menampilkan ${filtered.length} dari ${state.menus.length} menu`;

    if (filtered.length === 0) {
      setListView('empty');
      return;
    }

    setListView('list');
    els.menuList.innerHTML = filtered
      .map((menu) => {
        const isEditing = state.editingId === menu.id;
        const statusBadge = menu.isAvailable
          ? '<span class="admin-badge admin-badge-available">Tersedia</span>'
          : '<span class="admin-badge admin-badge-unavailable">Habis</span>';

        return `
          <article class="admin-menu-card ${isEditing ? 'is-editing' : ''}" data-menu-id="${menu.id}">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <span class="text-xs font-heading font-extrabold text-sumi/60">#${menu.id}</span>
                  <span class="admin-badge admin-badge-category">${escapeHtml(menu.category)}</span>
                  ${statusBadge}
                </div>
                <h3 class="font-heading font-black text-lg text-sumi leading-snug">${escapeHtml(menu.name)}</h3>
                <p class="text-sm text-sumi/80 mt-1 leading-relaxed">${escapeHtml(menu.description)}</p>
                <div class="flex flex-wrap items-center gap-4 mt-3 text-xs text-sumi/70">
                  <strong class="font-heading font-black text-base text-aka-deep">${formatRupiah(menu.price)}</strong>
                  <span>Dibuat: ${formatDate(menu.createdAt)}</span>
                </div>
              </div>
              <div class="flex sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-sumi/10">
                <button type="button" class="admin-btn admin-btn-navy text-xs flex-1 sm:flex-none" data-action="edit" data-id="${menu.id}">
                  Edit
                </button>
                <button type="button" class="admin-btn admin-btn-danger text-xs flex-1 sm:flex-none" data-action="delete" data-id="${menu.id}">
                  Hapus
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join('');
  }

  function setFormMode(menu = null) {
    clearFormErrors();
    if (menu) {
      state.editingId = menu.id;
      els.formTitle.textContent = `Edit Menu #${menu.id}`;
      els.formSubtitle.textContent = 'Perbarui data yang diperlukan lalu simpan perubahan ke backend NestJS.';
      els.inputName.value = menu.name;
      els.inputDescription.value = menu.description;
      els.inputPrice.value = String(menu.price);
      els.inputCategory.value = menu.category;
      els.inputAvailable.checked = Boolean(menu.isAvailable);
      els.btnSubmit.textContent = 'Simpan Perubahan (PATCH)';
      els.btnCancelEdit.classList.remove('hidden');
      els.inputName.focus();
    } else {
      state.editingId = null;
      els.formTitle.textContent = 'Tambah Menu Baru';
      els.formSubtitle.textContent = 'Data baru dikirim langsung ke POST http://localhost:3000/menus.';
      els.form.reset();
      els.inputAvailable.checked = true;
      els.btnSubmit.textContent = 'Tambah Menu (POST)';
      els.btnCancelEdit.classList.add('hidden');
    }
    if (state.menus.length > 0) {
      renderMenus();
    }
  }

  function setSubmitting(submitting) {
    state.isSubmitting = submitting;
    els.btnSubmit.disabled = submitting;
    els.btnCancelEdit.disabled = submitting;
    if (submitting) {
      els.btnSubmit.textContent = state.editingId ? 'Menyimpan...' : 'Mengirim...';
    } else {
      els.btnSubmit.textContent = state.editingId
        ? 'Simpan Perubahan (PATCH)'
        : 'Tambah Menu (POST)';
    }
  }

  // =========================================================================
  // API OPERATIONS (FETCH API)
  // =========================================================================

  async function fetchMenus() {
    state.isLoading = true;
    setListView('loading');
    els.btnRefresh.disabled = true;

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const err = await parseApiError(response);
        setApiStatus(false, `HTTP ${err.status}`);
        setListView('error', `${err.title}: ${err.messages.join(' ')}`);
        return;
      }

      const data = await response.json();
      state.menus = Array.isArray(data) ? data : [];
      setApiStatus(true, 'API Terhubung (Port 3000)');
      renderMenus();
    } catch {
      setApiStatus(false, 'Backend Tidak Aktif');
      setListView(
        'error',
        'Tidak dapat terhubung ke http://localhost:3000/menus. Pastikan server NestJS (backend/) sedang berjalan dan CORS sudah aktif.',
      );
    } finally {
      state.isLoading = false;
      els.btnRefresh.disabled = false;
    }
  }

  async function submitMenuForm(event) {
    event.preventDefault();
    if (state.isSubmitting) return;

    clearFormErrors();
    setSubmitting(true);

    const payload = {
      name: els.inputName.value.trim(),
      description: els.inputDescription.value.trim(),
      price: Number(els.inputPrice.value),
      category: els.inputCategory.value,
      isAvailable: Boolean(els.inputAvailable.checked),
    };

    const isEdit = state.editingId !== null;
    const url = isEdit ? `${API_BASE_URL}/${state.editingId}` : API_BASE_URL;
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await parseApiError(response);
        showFormErrors(err.title, err.messages);
        showToast(`${err.title}: ${err.messages[0]}`, 'error');
        if (err.status === 404 && isEdit) {
          setFormMode(null);
          await fetchMenus();
        }
        return;
      }

      const savedMenu = await response.json();
      showToast(
        isEdit
          ? `Menu "${savedMenu.name}" (#${savedMenu.id}) berhasil diperbarui.`
          : `Menu "${savedMenu.name}" (#${savedMenu.id}) berhasil ditambahkan.`,
        'success',
      );

      setFormMode(null);
      await fetchMenus();
    } catch {
      showFormErrors('Koneksi Gagal', [
        'Gagal mengirim data ke http://localhost:3000/menus. Periksa apakah server NestJS aktif.',
      ]);
      showToast('Gagal terhubung ke backend NestJS.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  function openDeleteDialog(menuId) {
    const target = state.menus.find((m) => m.id === menuId);
    if (!target) {
      showToast(`Menu dengan ID ${menuId} tidak ditemukan.`, 'error');
      return;
    }

    state.deletingId = menuId;
    els.deleteTargetName.textContent = `${target.name} (#${target.id})`;
    if (typeof els.deleteDialog.showModal === 'function') {
      els.deleteDialog.showModal();
    } else {
      executeDelete(menuId);
    }
  }

  async function executeDelete(menuId) {
    els.btnConfirmDelete.disabled = true;
    els.btnConfirmDelete.textContent = 'Menghapus...';

    try {
      const response = await fetch(`${API_BASE_URL}/${menuId}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const err = await parseApiError(response);
        showToast(`${err.title}: ${err.messages[0]}`, 'error');
        await fetchMenus();
        return;
      }

      const result = await response.json();
      showToast(result.message || `Menu #${menuId} berhasil dihapus.`, 'success');

      if (state.editingId === menuId) {
        setFormMode(null);
      }
      await fetchMenus();
    } catch {
      showToast('Gagal menghapus menu. Periksa koneksi backend NestJS.', 'error');
    } finally {
      state.deletingId = null;
      els.btnConfirmDelete.disabled = false;
      els.btnConfirmDelete.textContent = 'Ya, Hapus Menu';
      if (els.deleteDialog.open) {
        els.deleteDialog.close();
      }
    }
  }

  // =========================================================================
  // EVENT LISTENERS
  // =========================================================================

  els.form.addEventListener('submit', submitMenuForm);
  els.btnCancelEdit.addEventListener('click', () => setFormMode(null));
  els.btnRefresh.addEventListener('click', fetchMenus);
  els.btnRetryLoad.addEventListener('click', fetchMenus);

  els.filterCategory.addEventListener('change', (e) => {
    state.selectedCategory = e.target.value;
    if (!state.isLoading) renderMenus();
  });

  els.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    if (!state.isLoading) renderMenus();
  });

  els.menuList.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    const id = Number(button.dataset.id);
    if (!Number.isInteger(id)) return;

    if (action === 'edit') {
      const menu = state.menus.find((item) => item.id === id);
      if (menu) {
        setFormMode(menu);
      }
    } else if (action === 'delete') {
      openDeleteDialog(id);
    }
  });

  els.btnCancelDelete.addEventListener('click', () => {
    state.deletingId = null;
    if (els.deleteDialog.open) els.deleteDialog.close();
  });

  els.btnConfirmDelete.addEventListener('click', () => {
    if (state.deletingId !== null) {
      executeDelete(state.deletingId);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.editingId !== null && !els.deleteDialog.open) {
      setFormMode(null);
    }
  });

  // Initial Load
  fetchMenus();
})();
