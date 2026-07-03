/* ============================================================
   TAMMIA ONLINE - Admin Panel JS
   ============================================================
   Stage 3: Products CRUD against Supabase.
   Depends on:
     - window.tammiaSupabase  (from supabase-config.js)
     - tammiaConfirm, tammiaToast, tammiaFormatPrice,
       tammiaSearchSvg, tammiaCalcSalePercent, initCustomSelect (from main.js)
   ============================================================ */

const TAMMIA_CATEGORIES = [
  'Makeup Brushes',
  'Makeup Sponges',
  'Eyelash',
  'Eyelash Glue',
  'Beauty Cases',
  'Tweezers',
  'Nail Care',
  'Hair Tools',
  'Bath Accessories',
];

const TAMMIA_SVG_TYPES = [
  { value: 'brush', label: 'Brush' },
  { value: 'sponge', label: 'Sponge' },
  { value: 'lash', label: 'Lash' },
  { value: 'case', label: 'Case' },
  { value: 'tweezer', label: 'Tweezer' },
  { value: 'nail', label: 'Nail' },
  { value: 'hair', label: 'Hair' },
];

const TAMMIA_KNOWN_BRANDS = [
  'Tammia', 'Real Techniques', 'Tweezerman', 'Ecotools', 'Ardell', 'D-UP',
  'DUO', 'Sonia Miller', 'Tangle Teezer', 'Andrea', 'Goody', 'China Glaze',
  'Hollywood Secrets', 'Mapepe', 'Meiko', 'Naturactor',
];

let adminAllProducts = [];
let adminFilteredProducts = [];
let adminSelectedIds = new Set();
let adminCurrentPage = 1;
const ADMIN_PAGE_SIZE = 20;
let adminCurrentStatus = 'all';
let adminCurrentQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(adminBoot, 0); // run after main.js DOMContentLoaded inits
});

async function adminBoot() {
  if (!window.tammiaSupabase) {
    showDenied('Supabase client tidak siap. Pastikan koneksi internet aktif.');
    return;
  }
  // If real auth is off, deny with a special message
  if (!window.TAMMIA_USE_REAL_AUTH) {
    showDenied('Admin panel butuh real auth (Supabase). Mode demo tidak mendukung admin.');
    return;
  }
  try {
    const { data: { session } } = await window.tammiaSupabase.auth.getSession();
    const role = session && session.user && session.user.user_metadata && session.user.user_metadata.role;
    if (role !== 'admin') {
      showDenied(session ? 'Akun ini bukan akun admin.' : 'Halaman ini hanya untuk admin Tammia. Masuk dengan akun admin untuk melanjutkan.');
      return;
    }
    // Granted — show content
    document.getElementById('adminDenied').style.display = 'none';
    document.getElementById('adminContent').style.display = '';
    const greet = document.getElementById('adminGreeting');
    if (greet) {
      const name = (session.user.user_metadata && (session.user.user_metadata.full_name || session.user.user_metadata.username)) || 'Admin';
      greet.textContent = `Halo, ${name}. Kelola produk Tammia Online — tambah, edit, dan kontrol stok.`;
    }
    await adminInitProducts();
    adminWireToolbar();
    adminWireTabs();
  } catch (e) {
    console.error('Admin boot failed:', e);
    showDenied('Gagal verifikasi sesi. Coba refresh halaman.');
  }
}

function showDenied(msg) {
  document.getElementById('adminContent').style.display = 'none';
  const wrap = document.getElementById('adminDenied');
  wrap.style.display = '';
  const msgEl = document.getElementById('adminDeniedMsg');
  if (msgEl && msg) msgEl.textContent = msg;
  const loginBtn = document.getElementById('adminDeniedLogin');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      if (window.tammiaOpenAuth) window.tammiaOpenAuth();
    });
  }
}

async function adminInitProducts() {
  await adminFetchProducts();
  adminRenderTable();
}

async function adminFetchProducts() {
  const tbody = document.getElementById('adminTableBody');
  tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:60px 12px; color:var(--muted);"><i class="bi bi-hourglass-split"></i> Memuat produk...</td></tr>`;
  try {
    const { data, error } = await window.tammiaSupabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    adminAllProducts = data || [];
  } catch (e) {
    console.error('Admin fetch failed:', e);
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:60px 12px; color:var(--rouge);"><i class="bi bi-exclamation-triangle"></i> Gagal memuat: ${e.message || e}</td></tr>`;
    adminAllProducts = [];
  }
}

function adminApplyFilters() {
  const q = adminCurrentQuery.toLowerCase();
  adminFilteredProducts = adminAllProducts.filter(p => {
    if (adminCurrentStatus === 'active' && !p.is_active) return false;
    if (adminCurrentStatus === 'inactive' && p.is_active) return false;
    if (adminCurrentStatus === 'featured' && !p.is_featured) return false;
    if (adminCurrentStatus === 'sale' && !(p.was_price && p.was_price > p.price)) return false;
    if (q) {
      const name = (p.name || '').toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      if (!name.includes(q) && !brand.includes(q)) return false;
    }
    return true;
  });
}

function adminRenderTable() {
  adminApplyFilters();
  const tbody = document.getElementById('adminTableBody');
  const total = adminFilteredProducts.length;

  document.getElementById('adminProductCount').textContent = `(${total})`;

  if (total === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:60px 12px; color:var(--muted);"><i class="bi bi-inbox"></i> Tidak ada produk yang cocok.</td></tr>`;
    document.getElementById('adminPageInfo').textContent = `Halaman 0`;
    document.getElementById('adminPrevPage').disabled = true;
    document.getElementById('adminNextPage').disabled = true;
    return;
  }

  const pageCount = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  if (adminCurrentPage > pageCount) adminCurrentPage = pageCount;
  const start = (adminCurrentPage - 1) * ADMIN_PAGE_SIZE;
  const slice = adminFilteredProducts.slice(start, start + ADMIN_PAGE_SIZE);

  tbody.innerHTML = slice.map(p => {
    const isSelected = adminSelectedIds.has(p.id);
    const stock = p.stock || 0;
    let stockClass = 'high', stockLabel = stock + ' unit';
    if (stock < 10) { stockClass = 'low'; stockLabel = stock + ' unit · LOW'; }
    else if (stock <= 50) { stockClass = 'mid'; stockLabel = stock + ' unit'; }
    const statusPills = [];
    statusPills.push(p.is_active
      ? `<span class="admin-status-pill active">Aktif</span>`
      : `<span class="admin-status-pill inactive">Nonaktif</span>`);
    if (p.is_featured) statusPills.push(`<span class="admin-status-pill featured">Featured</span>`);
    const wasHtml = (p.was_price && p.was_price > p.price)
      ? `<div class="row-was">${tammiaFormatPrice(p.was_price)}</div>`
      : '';
    const img = p.image_url
      ? `<img src="${p.image_url}" alt="${(p.name || '').replace(/"/g, '&quot;')}">`
      : tammiaSearchSvg(p.svg_type || 'brush');
    const safeName = (p.name || '').replace(/</g, '&lt;');
    const safeBrand = (p.brand || '').replace(/</g, '&lt;');
    return `
      <tr data-id="${p.id}">
        <td><input type="checkbox" class="admin-row-check" data-id="${p.id}" ${isSelected ? 'checked' : ''}></td>
        <td><div class="row-img">${img}</div></td>
        <td>
          <div class="row-name">${safeName}</div>
          <div class="row-brand">${safeBrand}</div>
        </td>
        <td>${(p.category || '-')}</td>
        <td>
          <div style="font-family:'Comfortaa',sans-serif; font-weight:500;">${tammiaFormatPrice(p.price)}</div>
          ${wasHtml}
        </td>
        <td><span class="admin-stock-pill ${stockClass}">${stockLabel}</span></td>
        <td>${statusPills.join(' ')}</td>
        <td>
          <button class="admin-action-btn" data-admin-edit="${p.id}" title="Edit"><i class="bi bi-pencil"></i></button>
          <button class="admin-action-btn danger" data-admin-delete="${p.id}" title="Hapus"><i class="bi bi-trash3"></i></button>
        </td>
      </tr>`;
  }).join('');

  // Pagination
  document.getElementById('adminPageInfo').textContent = `Halaman ${adminCurrentPage} dari ${pageCount} (${total} produk)`;
  document.getElementById('adminPrevPage').disabled = adminCurrentPage <= 1;
  document.getElementById('adminNextPage').disabled = adminCurrentPage >= pageCount;

  // Wire row actions
  tbody.querySelectorAll('[data-admin-edit]').forEach(btn => {
    btn.addEventListener('click', () => adminOpenEditModal(btn.dataset.adminEdit));
  });
  tbody.querySelectorAll('[data-admin-delete]').forEach(btn => {
    btn.addEventListener('click', () => adminAskDelete(btn.dataset.adminDelete));
  });
  tbody.querySelectorAll('.admin-row-check').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.id;
      if (cb.checked) adminSelectedIds.add(id);
      else adminSelectedIds.delete(id);
      adminSyncBulkbar();
    });
  });
  adminSyncBulkbar();
}

function adminSyncBulkbar() {
  const bar = document.getElementById('adminBulkbar');
  const count = adminSelectedIds.size;
  document.getElementById('adminBulkCount').textContent = String(count);
  bar.classList.toggle('show', count > 0);
}

function adminWireToolbar() {
  // Status filter pills
  document.querySelectorAll('#adminStatusFilters [data-status-filter]').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#adminStatusFilters [data-status-filter]').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      adminCurrentStatus = b.dataset.statusFilter;
      adminCurrentPage = 1;
      adminRenderTable();
    });
  });

  // Search
  const searchInp = document.getElementById('adminSearchInput');
  let t = null;
  searchInp.addEventListener('input', e => {
    clearTimeout(t);
    t = setTimeout(() => {
      adminCurrentQuery = e.target.value.trim();
      adminCurrentPage = 1;
      adminRenderTable();
    }, 150);
  });

  // Pagination
  document.getElementById('adminPrevPage').addEventListener('click', () => {
    if (adminCurrentPage > 1) { adminCurrentPage--; adminRenderTable(); }
  });
  document.getElementById('adminNextPage').addEventListener('click', () => {
    const pc = Math.max(1, Math.ceil(adminFilteredProducts.length / ADMIN_PAGE_SIZE));
    if (adminCurrentPage < pc) { adminCurrentPage++; adminRenderTable(); }
  });

  // Select all
  document.getElementById('adminSelectAll').addEventListener('change', e => {
    const checked = e.target.checked;
    document.querySelectorAll('.admin-row-check').forEach(cb => {
      cb.checked = checked;
      const id = cb.dataset.id;
      if (checked) adminSelectedIds.add(id);
      else adminSelectedIds.delete(id);
    });
    adminSyncBulkbar();
  });

  // Bulk apply
  document.getElementById('adminBulkApply').addEventListener('click', () => {
    const action = document.getElementById('adminBulkAction').value;
    if (!action) { tammiaToast('Pilih bulk action dulu.', 'bi-exclamation-circle'); return; }
    adminApplyBulk(action);
  });

  // Add product
  document.getElementById('adminAddBtn').addEventListener('click', () => adminOpenAddModal());
}

async function adminApplyBulk(action) {
  const ids = Array.from(adminSelectedIds);
  if (!ids.length) return;
  if (action === 'delete') {
    tammiaConfirm({
      title: 'Hapus produk?',
      message: `<strong>${ids.length} produk</strong> akan dihapus permanen dari database. Tindakan ini tidak bisa dibatalkan.`,
      confirmText: 'Hapus Semua',
      cancelText: 'Batal',
      danger: true,
      onConfirm: async () => {
        try {
          const { error } = await window.tammiaSupabase.from('products').delete().in('id', ids);
          if (error) throw error;
          tammiaToast(`${ids.length} produk dihapus`, 'bi-trash3');
          adminSelectedIds.clear();
          await adminFetchProducts();
          adminRenderTable();
        } catch (e) {
          tammiaToast('Gagal hapus: ' + (e.message || e), 'bi-exclamation-triangle-fill');
        }
      },
    });
    return;
  }
  const updates = action === 'activate' ? { is_active: true } : { is_active: false };
  try {
    const { error } = await window.tammiaSupabase.from('products').update(updates).in('id', ids);
    if (error) throw error;
    tammiaToast(`${ids.length} produk di-${action === 'activate' ? 'aktifkan' : 'nonaktifkan'}`, 'bi-check-circle-fill');
    adminSelectedIds.clear();
    await adminFetchProducts();
    adminRenderTable();
  } catch (e) {
    tammiaToast('Gagal: ' + (e.message || e), 'bi-exclamation-triangle-fill');
  }
}

/* ----------------- Add / Edit modal ----------------- */
function adminBuildModal() {
  if (document.getElementById('adminProductModal')) return;
  const bd = document.createElement('div');
  bd.className = 'modal-backdrop-custom';
  bd.id = 'adminProductBackdrop';
  const m = document.createElement('div');
  m.className = 'admin-modal';
  m.id = 'adminProductModal';
  const catOptions = TAMMIA_CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('');
  const svgOptions = TAMMIA_SVG_TYPES.map(s => `<option value="${s.value}">${s.label}</option>`).join('');
  const brandOptions = TAMMIA_KNOWN_BRANDS.map(b => `<option value="${b}">`).join('');
  m.innerHTML = `
    <div class="admin-modal-head">
      <h5 id="adminModalTitle">Tambah Produk</h5>
      <button class="auth-modal-close" data-admin-modal-close aria-label="Tutup"><i class="bi bi-x-lg"></i></button>
    </div>
    <div class="admin-modal-body">
      <input type="hidden" id="adminFieldId">
      <div class="admin-grid-2">
        <div class="admin-field">
          <label>Nama Produk *</label>
          <input type="text" id="adminFieldName" required>
        </div>
        <div class="admin-field">
          <label>Brand *</label>
          <input type="text" id="adminFieldBrand" list="adminBrandList" required>
          <datalist id="adminBrandList">${brandOptions}</datalist>
        </div>
      </div>
      <div class="admin-grid-2">
        <div class="admin-field">
          <label>Kategori *</label>
          <select id="adminFieldCategory" required>${catOptions}</select>
        </div>
        <div class="admin-field">
          <label>Slug (auto)</label>
          <input type="text" id="adminFieldSlug" placeholder="auto-generate dari nama">
        </div>
      </div>
      <div class="admin-grid-2">
        <div class="admin-field">
          <label>Harga (IDR) *</label>
          <input type="number" id="adminFieldPrice" min="0" required>
        </div>
        <div class="admin-field">
          <label>Harga Coret (Was) — opsional</label>
          <input type="number" id="adminFieldWas" min="0" placeholder="kosongkan jika tidak sale">
        </div>
      </div>
      <div class="admin-grid-2">
        <div class="admin-field">
          <label>Stok</label>
          <input type="number" id="adminFieldStock" min="0" value="100">
        </div>
        <div class="admin-field">
          <label>SVG Fallback</label>
          <select id="adminFieldSvg">${svgOptions}</select>
        </div>
      </div>
      <div class="admin-field">
        <label>Short Description (≤ 200 karakter)</label>
        <textarea id="adminFieldShort" maxlength="200" placeholder="Tagline singkat untuk preview produk..."></textarea>
      </div>

      <!-- ===== PRODUCT DETAILS (struktur mutlak — tampil di tab produk) ===== -->
      <div class="admin-section-label">Product Details</div>
      <div class="admin-field">
        <label>Deskripsi Heading *</label>
        <input type="text" id="adminFieldDescHeading" placeholder="Judul singkat di tab deskripsi, mis. 'Travel-ready beauty case...'">
      </div>
      <div class="admin-field">
        <label>Deskripsi *</label>
        <textarea id="adminFieldDescription" placeholder="Paragraf deskripsi produk..."></textarea>
      </div>
      <div class="admin-grid-2">
        <div class="admin-field">
          <label>Material</label>
          <input type="text" id="adminFieldMaterial" placeholder="mis. Premium PVC + nylon lining">
        </div>
        <div class="admin-field">
          <label>Dimensi</label>
          <input type="text" id="adminFieldDimensi" placeholder="mis. 24 x 16 x 8 cm">
        </div>
      </div>
      <div class="admin-grid-2">
        <div class="admin-field">
          <label>Berat</label>
          <input type="text" id="adminFieldBerat" placeholder="mis. 320 gram">
        </div>
        <div class="admin-field">
          <label>Kompartemen</label>
          <input type="text" id="adminFieldKompartemen" placeholder="mis. 3 main pockets + 2 brush slots">
        </div>
      </div>
      <div class="admin-grid-2">
        <div class="admin-field">
          <label>Compliant</label>
          <input type="text" id="adminFieldCompliant" placeholder="mis. TSA-approved, cruelty-free">
        </div>
        <div class="admin-field">
          <label>Country</label>
          <input type="text" id="adminFieldCountry" placeholder="mis. Made in Japan">
        </div>
      </div>
      <div class="admin-field">
        <label>Cocok Untuk</label>
        <textarea id="adminFieldCocok" style="min-height:60px;" placeholder="mis. MUA freelance yang sering travel, beauty content creator..."></textarea>
      </div>
      <div class="admin-field">
        <label>Heading Cara Pakai</label>
        <input type="text" id="adminFieldHowtoHeading" placeholder="mis. 'Tips merawat travel case'">
      </div>
      <div class="admin-field">
        <label>Detail Cara Pakai <span style="color:var(--muted); font-weight:400;">(1 langkah per baris)</span></label>
        <textarea id="adminFieldHowto" style="min-height:120px;" placeholder="Langkah 1&#10;Langkah 2&#10;Langkah 3"></textarea>
      </div>
      <div class="admin-field">
        <label>Pengiriman &amp; Garansi</label>
        <textarea id="adminFieldShipping" placeholder="Info kurir, estimasi, dan garansi..."></textarea>
      </div>
      <!-- ===== /PRODUCT DETAILS ===== -->

      <div class="admin-grid-2">
        <div class="admin-field">
          <label>Rating (0-5)</label>
          <input type="number" id="adminFieldRating" min="0" max="5" step="0.1" value="4.5">
        </div>
        <div class="admin-field">
          <label>Jumlah Review</label>
          <input type="number" id="adminFieldReviewCount" min="0" value="0">
        </div>
      </div>
      <div class="admin-field">
        <label>Foto Produk</label>
        <div class="admin-drop-zone" id="adminDropZone">
          <img class="preview" id="adminImagePreview" style="display:none;">
          <div id="adminDropMsg"><i class="bi bi-cloud-upload"></i> Klik atau drag foto di sini (JPG/PNG/WebP)</div>
          <input type="file" id="adminFieldImage" accept="image/*" style="display:none;">
        </div>
        <div style="font-size:12px; color:var(--muted); margin-top:6px;" id="adminCurrentImageInfo"></div>
      </div>
      <div class="admin-field">
        <label>Status</label>
        <div class="admin-toggle-row">
          <label><input type="checkbox" id="adminFieldActive" checked> Aktif</label>
          <label><input type="checkbox" id="adminFieldFeatured"> Featured</label>
        </div>
      </div>
    </div>
    <div class="admin-modal-foot">
      <button type="button" class="btn btn-ghost" data-admin-modal-close>Batal</button>
      <button type="button" class="btn btn-peach" id="adminFieldSubmit">Simpan</button>
    </div>`;
  document.body.appendChild(bd);
  document.body.appendChild(m);

  // Slug auto-generate on name blur
  const nameInp = m.querySelector('#adminFieldName');
  const slugInp = m.querySelector('#adminFieldSlug');
  nameInp.addEventListener('blur', () => {
    if (!slugInp.value && nameInp.value) {
      slugInp.value = adminSlugify(nameInp.value);
    }
  });

  // Drop-zone wiring
  const dz = m.querySelector('#adminDropZone');
  const fileInp = m.querySelector('#adminFieldImage');
  const preview = m.querySelector('#adminImagePreview');
  const dropMsg = m.querySelector('#adminDropMsg');
  dz.addEventListener('click', () => fileInp.click());
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag'));
  dz.addEventListener('drop', e => {
    e.preventDefault();
    dz.classList.remove('drag');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      fileInp.files = e.dataTransfer.files;
      adminPreviewImage(fileInp.files[0]);
    }
  });
  fileInp.addEventListener('change', () => {
    if (fileInp.files && fileInp.files[0]) adminPreviewImage(fileInp.files[0]);
  });
  function adminPreviewImage(file) {
    const url = URL.createObjectURL(file);
    preview.src = url;
    preview.style.display = 'block';
    dropMsg.innerHTML = `<i class="bi bi-check-circle-fill" style="color:#2d9b5e;"></i> ${file.name}`;
  }

  // Close
  m.querySelectorAll('[data-admin-modal-close]').forEach(b => b.addEventListener('click', adminCloseModal));
  bd.addEventListener('click', adminCloseModal);

  // Submit
  m.querySelector('#adminFieldSubmit').addEventListener('click', adminSubmitForm);
}

function adminSlugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function adminOpenModal() {
  adminBuildModal();
  const bd = document.getElementById('adminProductBackdrop');
  const m = document.getElementById('adminProductModal');
  bd.classList.add('open');
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function adminCloseModal() {
  const bd = document.getElementById('adminProductBackdrop');
  const m = document.getElementById('adminProductModal');
  if (bd) bd.classList.remove('open');
  if (m) m.classList.remove('open');
  document.body.style.overflow = '';
}

function adminClearForm() {
  const m = document.getElementById('adminProductModal');
  if (!m) return;
  m.querySelector('#adminFieldId').value = '';
  m.querySelector('#adminFieldName').value = '';
  m.querySelector('#adminFieldBrand').value = '';
  m.querySelector('#adminFieldCategory').value = TAMMIA_CATEGORIES[0];
  m.querySelector('#adminFieldSlug').value = '';
  m.querySelector('#adminFieldPrice').value = '';
  m.querySelector('#adminFieldWas').value = '';
  m.querySelector('#adminFieldStock').value = '100';
  m.querySelector('#adminFieldSvg').value = 'brush';
  m.querySelector('#adminFieldShort').value = '';
  ['DescHeading', 'Description', 'Material', 'Dimensi', 'Berat', 'Kompartemen',
   'Compliant', 'Country', 'Cocok', 'HowtoHeading', 'Howto', 'Shipping']
    .forEach(k => { const el = m.querySelector('#adminField' + k); if (el) el.value = ''; });
  m.querySelector('#adminFieldRating').value = '4.5';
  m.querySelector('#adminFieldReviewCount').value = '0';
  m.querySelector('#adminFieldImage').value = '';
  m.querySelector('#adminFieldActive').checked = true;
  m.querySelector('#adminFieldFeatured').checked = false;
  const preview = m.querySelector('#adminImagePreview');
  preview.src = '';
  preview.style.display = 'none';
  m.querySelector('#adminDropMsg').innerHTML = '<i class="bi bi-cloud-upload"></i> Klik atau drag foto di sini (JPG/PNG/WebP)';
  m.querySelector('#adminCurrentImageInfo').textContent = '';
}

function adminOpenAddModal() {
  adminOpenModal();
  adminClearForm();
  document.getElementById('adminModalTitle').textContent = 'Tambah Produk';
}

function adminOpenEditModal(id) {
  adminOpenModal();
  adminClearForm();
  const p = adminAllProducts.find(x => x.id === id);
  if (!p) return;
  document.getElementById('adminModalTitle').textContent = 'Edit Produk';
  const m = document.getElementById('adminProductModal');
  m.querySelector('#adminFieldId').value = p.id;
  m.querySelector('#adminFieldName').value = p.name || '';
  m.querySelector('#adminFieldBrand').value = p.brand || '';
  m.querySelector('#adminFieldCategory').value = p.category || TAMMIA_CATEGORIES[0];
  m.querySelector('#adminFieldSlug').value = p.slug || '';
  m.querySelector('#adminFieldPrice').value = p.price || 0;
  m.querySelector('#adminFieldWas').value = p.was_price || '';
  m.querySelector('#adminFieldStock').value = (p.stock != null) ? p.stock : 100;
  m.querySelector('#adminFieldSvg').value = p.svg_type || 'brush';
  m.querySelector('#adminFieldShort').value = p.short_description || '';
  // Prefill Product Details dari kolom details (jsonb); fallback deskripsi lama
  const d = p.details || {};
  m.querySelector('#adminFieldDescHeading').value = d.desc_heading || '';
  m.querySelector('#adminFieldDescription').value = d.description || p.description || '';
  m.querySelector('#adminFieldMaterial').value = d.material || '';
  m.querySelector('#adminFieldDimensi').value = d.dimensi || '';
  m.querySelector('#adminFieldBerat').value = d.berat || '';
  m.querySelector('#adminFieldKompartemen').value = d.kompartemen || '';
  m.querySelector('#adminFieldCompliant').value = d.compliant || '';
  m.querySelector('#adminFieldCountry').value = d.country || '';
  m.querySelector('#adminFieldCocok').value = d.cocok || '';
  m.querySelector('#adminFieldHowtoHeading').value = d.howto_heading || '';
  m.querySelector('#adminFieldHowto').value = Array.isArray(d.howto) ? d.howto.join('\n') : (d.howto || '');
  m.querySelector('#adminFieldShipping').value = d.shipping || '';
  m.querySelector('#adminFieldRating').value = p.rating || 4.5;
  m.querySelector('#adminFieldReviewCount').value = p.review_count || 0;
  m.querySelector('#adminFieldActive').checked = !!p.is_active;
  m.querySelector('#adminFieldFeatured').checked = !!p.is_featured;
  // Show existing image
  const preview = m.querySelector('#adminImagePreview');
  const info = m.querySelector('#adminCurrentImageInfo');
  if (p.image_url) {
    preview.src = p.image_url;
    preview.style.display = 'block';
    m.querySelector('#adminDropMsg').innerHTML = `<i class="bi bi-image"></i> Gambar saat ini (klik untuk ganti)`;
    info.textContent = 'Pilih file baru untuk mengganti gambar.';
  } else {
    info.textContent = 'Belum ada gambar. SVG fallback akan dipakai.';
  }
}

async function adminSubmitForm() {
  const m = document.getElementById('adminProductModal');
  const submitBtn = m.querySelector('#adminFieldSubmit');
  const origLabel = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="auth-spinner"></span> Menyimpan...';

  try {
    const id = m.querySelector('#adminFieldId').value;
    const name = m.querySelector('#adminFieldName').value.trim();
    const brand = m.querySelector('#adminFieldBrand').value.trim();
    const category = m.querySelector('#adminFieldCategory').value;
    let slug = m.querySelector('#adminFieldSlug').value.trim();
    const price = parseInt(m.querySelector('#adminFieldPrice').value, 10);
    const wasRaw = m.querySelector('#adminFieldWas').value.trim();
    const was = wasRaw ? parseInt(wasRaw, 10) : null;
    const stock = parseInt(m.querySelector('#adminFieldStock').value, 10) || 0;
    const svg = m.querySelector('#adminFieldSvg').value;
    const shortD = m.querySelector('#adminFieldShort').value.trim();
    // Product Details terstruktur
    const gv = k => (m.querySelector('#adminField' + k) || { value: '' }).value.trim();
    const description = gv('Description');
    const details = {
      desc_heading: gv('DescHeading'),
      description: description,
      material: gv('Material'),
      dimensi: gv('Dimensi'),
      berat: gv('Berat'),
      kompartemen: gv('Kompartemen'),
      compliant: gv('Compliant'),
      country: gv('Country'),
      cocok: gv('Cocok'),
      howto_heading: gv('HowtoHeading'),
      howto: gv('Howto').split('\n').map(s => s.trim()).filter(Boolean),
      shipping: gv('Shipping'),
    };
    const rating = parseFloat(m.querySelector('#adminFieldRating').value) || 0;
    const reviewCount = parseInt(m.querySelector('#adminFieldReviewCount').value, 10) || 0;
    const isActive = m.querySelector('#adminFieldActive').checked;
    const isFeatured = m.querySelector('#adminFieldFeatured').checked;
    const file = m.querySelector('#adminFieldImage').files[0];

    if (!name) throw new Error('Nama produk wajib diisi.');
    if (!brand) throw new Error('Brand wajib diisi.');
    if (!Number.isFinite(price) || price < 0) throw new Error('Harga tidak valid.');
    if (!slug) slug = adminSlugify(name);

    // Upload image (if any)
    let imageUrl = null;
    if (file) {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const path = `${slug || 'product'}-${Date.now()}.${ext}`;
      const { error: upErr } = await window.tammiaSupabase
        .storage.from('product-images')
        .upload(path, file, { upsert: false, cacheControl: '3600' });
      if (upErr) throw new Error('Upload gagal: ' + upErr.message);
      const { data: pub } = window.tammiaSupabase
        .storage.from('product-images')
        .getPublicUrl(path);
      imageUrl = pub.publicUrl;
    }

    // Build payload (preserve existing image_url on edit when no new file)
    const payload = {
      name, brand, category, slug,
      price,
      was_price: was || null,
      stock,
      svg_type: svg,
      short_description: shortD || null,
      description: description || null,
      details: details,
      rating, review_count: reviewCount,
      is_active: isActive, is_featured: isFeatured,
    };
    if (imageUrl) payload.image_url = imageUrl;

    if (id) {
      const { error } = await window.tammiaSupabase
        .from('products').update(payload).eq('id', id);
      if (error) throw error;
      tammiaToast('Produk diperbarui', 'bi-check-circle-fill');
    } else {
      // Use a new sort_order at end
      const maxSort = adminAllProducts.reduce((m, p) => Math.max(m, p.sort_order || 0), 0);
      payload.sort_order = maxSort + 1;
      const { error } = await window.tammiaSupabase
        .from('products').insert(payload);
      if (error) throw error;
      tammiaToast('Produk ditambahkan', 'bi-check-circle-fill');
    }

    adminCloseModal();
    await adminFetchProducts();
    adminRenderTable();
  } catch (e) {
    console.error(e);
    tammiaToast(e.message || 'Gagal menyimpan.', 'bi-exclamation-triangle-fill');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = origLabel;
  }
}

function adminAskDelete(id) {
  const p = adminAllProducts.find(x => x.id === id);
  if (!p) return;
  tammiaConfirm({
    title: 'Hapus Produk?',
    message: `<strong>${p.name}</strong> akan dihapus permanen dari katalog. Tindakan ini tidak bisa dibatalkan.`,
    confirmText: 'Hapus',
    cancelText: 'Batal',
    danger: true,
    onConfirm: async () => {
      try {
        const { error } = await window.tammiaSupabase
          .from('products').delete().eq('id', id);
        if (error) throw error;
        tammiaToast('Produk dihapus', 'bi-trash3');
        adminSelectedIds.delete(id);
        await adminFetchProducts();
        adminRenderTable();
      } catch (e) {
        tammiaToast('Gagal hapus: ' + (e.message || e), 'bi-exclamation-triangle-fill');
      }
    },
  });
}

/* ============================================================
   Tabs: Produk / Pesanan / Pelanggan / Newsletter
   ============================================================ */
function adminWireTabs() {
  document.querySelectorAll('[data-admin-tab]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const tab = link.dataset.adminTab;
      document.querySelectorAll('[data-admin-tab]').forEach(l => l.classList.toggle('active', l === link));
      document.querySelectorAll('[data-admin-section]').forEach(sec => {
        sec.style.display = sec.dataset.adminSection === tab ? '' : 'none';
      });
      if (tab === 'pesanan') adminLoadOrders();
      if (tab === 'pelanggan') adminLoadCustomers();
      if (tab === 'newsletter') adminLoadSubs();
    });
  });
}

const adminEsc = s => (s == null ? '' : String(s)).replace(/</g, '&lt;');
const adminDateLabel = ts => {
  const d = new Date(ts);
  return isNaN(d) ? '-' : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

/* ----------------- PESANAN ----------------- */
let adminOrders = [];
let adminOrderFilter = 'all';
const ADMIN_ORDER_STATUSES = ['diproses', 'dikirim', 'selesai', 'dibatalkan'];

async function adminLoadOrders() {
  const tbody = document.getElementById('adminOrdersBody');
  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:60px 12px; color:var(--muted);"><i class="bi bi-hourglass-split"></i> Memuat pesanan...</td></tr>`;
  try {
    const { data, error } = await window.tammiaSupabase
      .from('tammia_orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    adminOrders = data || [];
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:60px 12px; color:var(--rouge);"><i class="bi bi-exclamation-triangle"></i> Gagal memuat: ${adminEsc(e.message || e)}</td></tr>`;
    return;
  }
  adminWireOrderFilters();
  adminRenderOrders();
}

function adminWireOrderFilters() {
  const row = document.getElementById('adminOrderFilters');
  if (!row || row.dataset.wired === '1') return;
  row.dataset.wired = '1';
  row.querySelectorAll('[data-order-status-filter]').forEach(b => {
    b.addEventListener('click', () => {
      row.querySelectorAll('[data-order-status-filter]').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      adminOrderFilter = b.dataset.orderStatusFilter;
      adminRenderOrders();
    });
  });
}

function adminRenderOrders() {
  const tbody = document.getElementById('adminOrdersBody');
  const list = adminOrders.filter(o => adminOrderFilter === 'all' || o.status === adminOrderFilter);
  document.getElementById('adminOrderCount').textContent = `(${list.length})`;
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:60px 12px; color:var(--muted);"><i class="bi bi-inbox"></i> Tidak ada pesanan.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(o => {
    const items = Array.isArray(o.items) ? o.items : [];
    const itemLabel = items.length
      ? `${adminEsc(items[0].name)}${items.length > 1 ? ` <span style="color:var(--muted);">+${items.length - 1} lainnya</span>` : ''}`
      : '-';
    const options = ADMIN_ORDER_STATUSES.map(s =>
      `<option value="${s}" ${s === o.status ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('');
    return `
      <tr data-id="${o.id}">
        <td><div class="row-name" style="font-family:'JetBrains Mono',monospace; font-size:13px;">${adminEsc(o.order_no)}</div></td>
        <td>${adminDateLabel(o.created_at)}</td>
        <td>
          <div class="row-name">${adminEsc(o.customer_name || '-')}</div>
          <div class="row-brand">${adminEsc(o.customer_wa || '')}</div>
        </td>
        <td style="max-width:260px;">${itemLabel}</td>
        <td style="font-family:'Comfortaa',sans-serif; font-weight:500;">${tammiaFormatPrice(o.total)}</td>
        <td><select class="admin-status-select status-${o.status}" data-order-status-id="${o.id}">${options}</select></td>
        <td><button class="admin-action-btn danger" data-order-delete="${o.id}" title="Hapus"><i class="bi bi-trash3"></i></button></td>
      </tr>`;
  }).join('');

  // Ubah status inline
  tbody.querySelectorAll('[data-order-status-id]').forEach(sel => {
    sel.addEventListener('change', async () => {
      const id = sel.dataset.orderStatusId;
      const status = sel.value;
      try {
        const { error } = await window.tammiaSupabase
          .from('tammia_orders').update({ status }).eq('id', id);
        if (error) throw error;
        const o = adminOrders.find(x => x.id === id);
        if (o) o.status = status;
        sel.className = `admin-status-select status-${status}`;
        tammiaToast(`Status ${o ? o.order_no : ''} → ${status}`, 'bi-check-circle-fill');
        if (adminOrderFilter !== 'all') adminRenderOrders();
      } catch (e) {
        tammiaToast('Gagal ubah status: ' + (e.message || e), 'bi-exclamation-triangle-fill');
        adminRenderOrders(); // balikin tampilan
      }
    });
  });
  // Hapus pesanan
  tbody.querySelectorAll('[data-order-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      const o = adminOrders.find(x => x.id === btn.dataset.orderDelete);
      if (!o) return;
      tammiaConfirm({
        title: 'Hapus pesanan?',
        message: `Pesanan <strong>${adminEsc(o.order_no)}</strong> akan dihapus permanen dari daftar.`,
        confirmText: 'Hapus',
        cancelText: 'Batal',
        danger: true,
        onConfirm: async () => {
          try {
            const { error } = await window.tammiaSupabase
              .from('tammia_orders').delete().eq('id', o.id);
            if (error) throw error;
            adminOrders = adminOrders.filter(x => x.id !== o.id);
            tammiaToast('Pesanan dihapus', 'bi-trash3');
            adminRenderOrders();
          } catch (e) {
            tammiaToast('Gagal hapus: ' + (e.message || e), 'bi-exclamation-triangle-fill');
          }
        },
      });
    });
  });
}

/* ----------------- PELANGGAN ----------------- */
async function adminLoadCustomers() {
  const tbody = document.getElementById('adminCustomersBody');
  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:60px 12px; color:var(--muted);"><i class="bi bi-hourglass-split"></i> Memuat pelanggan...</td></tr>`;
  try {
    const { data, error } = await window.tammiaSupabase.rpc('tammia_list_customers');
    if (error) throw error;
    const users = data || [];
    document.getElementById('adminCustomerCount').textContent = `(${users.length})`;
    if (!users.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:60px 12px; color:var(--muted);"><i class="bi bi-inbox"></i> Belum ada pelanggan.</td></tr>`;
      return;
    }
    tbody.innerHTML = users.map(u => {
      const isAdmin = u.role === 'admin';
      const email = (u.email || '').endsWith('@tammia.users.id')
        ? `<span style="color:var(--muted);">(username only)</span>` : adminEsc(u.email);
      return `
        <tr>
          <td><div class="row-name" style="font-family:'JetBrains Mono',monospace; font-size:13px;">@${adminEsc(u.username || '-')}</div></td>
          <td>${adminEsc(u.full_name || '-')}</td>
          <td>${email}</td>
          <td><span class="admin-status-pill ${isAdmin ? 'featured' : 'active'}">${isAdmin ? 'Admin' : 'Customer'}</span></td>
          <td>${adminDateLabel(u.created_at)}</td>
        </tr>`;
    }).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:60px 12px; color:var(--rouge);"><i class="bi bi-exclamation-triangle"></i> Gagal memuat: ${adminEsc(e.message || e)}</td></tr>`;
  }
}

/* ----------------- NEWSLETTER ----------------- */
let adminSubs = [];
async function adminLoadSubs() {
  const tbody = document.getElementById('adminSubsBody');
  tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:60px 12px; color:var(--muted);"><i class="bi bi-hourglass-split"></i> Memuat subscriber...</td></tr>`;
  try {
    const { data, error } = await window.tammiaSupabase
      .from('tammia_newsletter').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    adminSubs = data || [];
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:60px 12px; color:var(--rouge);"><i class="bi bi-exclamation-triangle"></i> Gagal memuat: ${adminEsc(e.message || e)}</td></tr>`;
    return;
  }
  adminWireSubExport();
  adminRenderSubs();
}

function adminRenderSubs() {
  const tbody = document.getElementById('adminSubsBody');
  document.getElementById('adminSubCount').textContent = `(${adminSubs.length})`;
  if (!adminSubs.length) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:60px 12px; color:var(--muted);"><i class="bi bi-inbox"></i> Belum ada subscriber.</td></tr>`;
    return;
  }
  tbody.innerHTML = adminSubs.map(s => `
    <tr>
      <td><div class="row-name">${adminEsc(s.email)}</div></td>
      <td>${adminDateLabel(s.created_at)}</td>
      <td><button class="admin-action-btn danger" data-sub-delete="${s.id}" title="Hapus"><i class="bi bi-trash3"></i></button></td>
    </tr>`).join('');
  tbody.querySelectorAll('[data-sub-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = adminSubs.find(x => x.id === btn.dataset.subDelete);
      if (!s) return;
      tammiaConfirm({
        title: 'Hapus subscriber?',
        message: `<strong>${adminEsc(s.email)}</strong> akan dihapus dari daftar newsletter.`,
        confirmText: 'Hapus',
        cancelText: 'Batal',
        danger: true,
        onConfirm: async () => {
          try {
            const { error } = await window.tammiaSupabase
              .from('tammia_newsletter').delete().eq('id', s.id);
            if (error) throw error;
            adminSubs = adminSubs.filter(x => x.id !== s.id);
            tammiaToast('Subscriber dihapus', 'bi-trash3');
            adminRenderSubs();
          } catch (e) {
            tammiaToast('Gagal hapus: ' + (e.message || e), 'bi-exclamation-triangle-fill');
          }
        },
      });
    });
  });
}

function adminWireSubExport() {
  const btn = document.getElementById('adminSubExport');
  if (!btn || btn.dataset.wired === '1') return;
  btn.dataset.wired = '1';
  btn.addEventListener('click', () => {
    if (!adminSubs.length) { tammiaToast('Belum ada subscriber untuk diexport.', 'bi-exclamation-circle'); return; }
    const csv = 'email,subscribed_at\n' + adminSubs.map(s => `${s.email},${s.created_at}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tammia-newsletter-subscribers.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    tammiaToast('CSV terdownload', 'bi-download');
  });
}
