/* ============================================================
   TAMMIA ONLINE - Main JS
   ============================================================ */

/* ---------- Shared product catalog ---------- */
const TAMMIA_PRODUCTS = [
  { name: 'Sonia Miller Transparent Travel Case Pouch', brand: 'Sonia Miller', price: 599940, was: 999900, category: 'Beauty Cases', rating: 4.9, svg: 'case' },
  { name: 'Tammia Professional 1310 Deluxe Duo Brow Brush', brand: 'Tammia', price: 95310, was: 105900, category: 'Makeup Brushes', rating: 4.8, svg: 'brush' },
  { name: 'Tammia Professional PCUS52 Cushion Sponge (2pc)', brand: 'Tammia', price: 46900, category: 'Makeup Sponges', rating: 4.9, svg: 'sponge' },
  { name: 'D-UP Lash Focus Eyelash K-POP Idol Edition', brand: 'D-UP', price: 249900, category: 'Eyelash', rating: 5.0, svg: 'lash' },
  { name: 'Real Techniques Everyday Essentials Brush Set', brand: 'Real Techniques', price: 425000, category: 'Makeup Brushes', rating: 4.8, svg: 'brush' },
  { name: 'Tweezerman Slant Tweezer Stainless Steel', brand: 'Tweezerman', price: 285000, category: 'Tweezers', rating: 4.9, svg: 'tweezer' },
  { name: 'Ardell Wispies Natural False Lashes', brand: 'Ardell', price: 75650, was: 89000, category: 'Eyelash', rating: 4.7, svg: 'lash' },
  { name: 'Ecotools Bamboo Buffer Block 4-Way', brand: 'Ecotools', price: 65000, category: 'Nail Care', rating: 4.5, svg: 'nail' },
  { name: 'Tangle Teezer Original Detangler Pink', brand: 'Tangle Teezer', price: 175000, category: 'Hair Tools', rating: 4.8, svg: 'hair' },
  { name: 'Tammia Professional 5-Piece Brush Set Rose Gold', brand: 'Tammia', price: 385000, category: 'Makeup Brushes', rating: 4.9, svg: 'brush' },
  { name: 'Real Techniques Miracle Complexion Sponge (2pk)', brand: 'Real Techniques', price: 145000, category: 'Makeup Sponges', rating: 4.9, svg: 'sponge' },
  { name: 'China Glaze Nail Lacquer - Limited Color Sunset', brand: 'China Glaze', price: 62400, was: 78000, category: 'Nail Care', rating: 4.6, svg: 'nail' },
  { name: 'Goody Quick Style Boar Bristle Brush', brand: 'Goody', price: 195000, category: 'Hair Tools', rating: 4.7, svg: 'hair' },
  { name: 'DUO Brush-On Lash Adhesive (Clear)', brand: 'DUO', price: 115000, category: 'Eyelash Glue', rating: 4.8, svg: 'lash' },
  { name: 'Andrea ModLash #21 Triple Pack', brand: 'Andrea', price: 95000, category: 'Eyelash', rating: 4.6, svg: 'lash' },
  { name: 'Hollywood Fashion Secrets Fashion Tape', brand: 'Hollywood Secrets', price: 125000, category: 'Bath Accessories', rating: 4.7, svg: 'case' },
  { name: 'Mapepe Foundation Sponge Set (4 pcs)', brand: 'Mapepe', price: 55000, category: 'Makeup Sponges', rating: 4.5, svg: 'sponge' },
  { name: 'Tammia Pro Contour Brush 1245 Angled', brand: 'Tammia', price: 125000, category: 'Makeup Brushes', rating: 4.8, svg: 'brush' },
  { name: 'Tweezerman Mini Slant Tweezer Pink', brand: 'Tweezerman', price: 189200, was: 215000, category: 'Tweezers', rating: 4.9, svg: 'tweezer' },
  { name: 'Naturactor Cover Face Foundation Sponge', brand: 'Naturactor', price: 68000, category: 'Makeup Sponges', rating: 4.7, svg: 'sponge' }
];

/* ---------- Helpers ---------- */
function tammiaFormatPrice(n) {
  return 'Rp ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/* ---------- Custom confirm modal (replaces window.confirm) ---------- */
function tammiaConfirm({ title = 'Konfirmasi', message = '', confirmText = 'OK', cancelText = 'Batal', danger = false, onConfirm = null, onCancel = null } = {}) {
  // Remove any stray prior instance
  const prior = document.getElementById('tammiaConfirmModal');
  if (prior) prior.remove();

  const wrap = document.createElement('div');
  wrap.id = 'tammiaConfirmModal';
  wrap.className = 'tammia-confirm-wrap';
  wrap.innerHTML = `
    <div class="tammia-confirm-backdrop"></div>
    <div class="tammia-confirm-box" role="dialog" aria-modal="true" aria-labelledby="tammiaConfirmTitle">
      <div class="tammia-confirm-icon ${danger ? 'danger' : ''}">
        <i class="bi ${danger ? 'bi-trash3' : 'bi-question-circle'}"></i>
      </div>
      <h4 class="tammia-confirm-title" id="tammiaConfirmTitle">${title}</h4>
      <p class="tammia-confirm-message">${message}</p>
      <div class="tammia-confirm-actions">
        <button type="button" class="btn-ghost-confirm" data-confirm-cancel>${cancelText}</button>
        <button type="button" class="btn-action-confirm ${danger ? 'danger' : ''}" data-confirm-ok>${confirmText}</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  // Lock scroll
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  function close() {
    wrap.classList.remove('open');
    setTimeout(() => {
      wrap.remove();
      document.body.style.overflow = prevOverflow;
    }, 220);
    document.removeEventListener('keydown', onKey);
  }
  function confirm() {
    close();
    if (typeof onConfirm === 'function') onConfirm();
  }
  function cancel() {
    close();
    if (typeof onCancel === 'function') onCancel();
  }
  function onKey(e) {
    if (e.key === 'Escape') cancel();
    else if (e.key === 'Enter') confirm();
  }

  wrap.querySelector('[data-confirm-ok]').addEventListener('click', confirm);
  wrap.querySelector('[data-confirm-cancel]').addEventListener('click', cancel);
  wrap.querySelector('.tammia-confirm-backdrop').addEventListener('click', cancel);
  document.addEventListener('keydown', onKey);

  // Animate in
  requestAnimationFrame(() => wrap.classList.add('open'));

  // Auto-focus confirm button for keyboard users
  setTimeout(() => {
    const btn = wrap.querySelector('[data-confirm-ok]');
    if (btn) btn.focus();
  }, 220);
}

function tammiaSearchSvg(type) {
  switch (type) {
    case 'brush':
      return '<svg viewBox="0 0 100 100"><rect x="46" y="14" width="8" height="50" rx="2" fill="#1a1a1a"/><ellipse cx="50" cy="74" rx="14" ry="18" fill="#e8a0a8"/></svg>';
    case 'sponge':
      return '<svg viewBox="0 0 100 100"><path d="M50,10 C28,10 12,32 14,58 C16,84 36,92 50,92 C64,92 84,84 86,58 C88,32 72,10 50,10 Z" fill="#f4d4c4"/></svg>';
    case 'lash':
      return '<svg viewBox="0 0 140 60"><path d="M10,40 Q70,52 130,40" stroke="#1a1a1a" stroke-width="2.5" fill="none"/><line x1="40" y1="44" x2="38" y2="6" stroke="#1a1a1a" stroke-width="2.5"/><line x1="70" y1="46" x2="70" y2="2" stroke="#1a1a1a" stroke-width="2.7"/><line x1="100" y1="44" x2="102" y2="6" stroke="#1a1a1a" stroke-width="2.5"/></svg>';
    case 'case':
      return '<svg viewBox="0 0 100 100"><rect x="20" y="30" width="60" height="50" rx="4" fill="#1a1a1a"/><rect x="24" y="34" width="52" height="42" rx="3" fill="#fdeef0"/><rect x="38" y="22" width="24" height="12" rx="3" fill="#1a1a1a"/></svg>';
    case 'tweezer':
      return '<svg viewBox="0 0 100 100"><path d="M40,12 L48,80 L52,80 L60,12 L56,10 L50,72 L44,10 Z" fill="#1a1a1a"/><circle cx="50" cy="86" r="6" fill="#e8a0a8"/></svg>';
    case 'nail':
      return '<svg viewBox="0 0 100 100"><rect x="36" y="24" width="28" height="56" rx="6" fill="#c8553d"/><rect x="42" y="18" width="16" height="10" rx="3" fill="#1a1a1a"/></svg>';
    case 'hair':
      return '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="32" ry="20" fill="#1a1a1a"/><rect x="44" y="68" width="12" height="22" rx="2" fill="#1a1a1a"/></svg>';
    default:
      return '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="#e8a0a8"/></svg>';
  }
}

/* ---------- Toast helper ---------- */
function tammiaToast(message, icon) {
  let toast = document.getElementById('tammiaToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'tammiaToast';
    toast.className = 'tammia-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = (icon ? `<i class="bi ${icon}"></i>` : '') + `<span>${message}</span>`;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ---------- Wishlist storage ---------- */
function tammiaGetWishlist() {
  try { return JSON.parse(localStorage.getItem('tammia_wishlist') || '[]'); }
  catch (e) { return []; }
}
function tammiaSaveWishlist(list) {
  localStorage.setItem('tammia_wishlist', JSON.stringify(list));
  tammiaUpdateWishlistBadge();
}
function tammiaUpdateWishlistBadge() {
  const list = tammiaGetWishlist();
  document.querySelectorAll('.wishlist-badge').forEach(b => {
    b.textContent = list.length;
    b.setAttribute('data-count', String(list.length));
  });
}

/* ---------- User storage ---------- */
function tammiaGetUser() {
  try { return JSON.parse(localStorage.getItem('tammia_user') || 'null'); }
  catch (e) { return null; }
}
function tammiaSaveUser(user) {
  if (user) localStorage.setItem('tammia_user', JSON.stringify(user));
  else localStorage.removeItem('tammia_user');
}

/* ---------- Cart storage + helpers (localStorage-backed) ---------- */
function getCart() {
  try { return JSON.parse(localStorage.getItem('tammia_cart') || '[]'); }
  catch (e) { return []; }
}
function setCart(arr) {
  localStorage.setItem('tammia_cart', JSON.stringify(arr || []));
  renderCartDrawer();
  tammiaUpdateCartBadge();
  document.dispatchEvent(new CustomEvent('tammia:cart-changed'));
}
function tammiaUpdateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((s, it) => s + (parseInt(it.qty, 10) || 0), 0);
  document.querySelectorAll('.cart-badge').forEach(b => {
    if (b.classList.contains('wishlist-badge')) return;
    b.textContent = count;
    b.style.display = count > 0 ? '' : 'none';
  });
}
function tammiaSvgForProductName(name) {
  const p = TAMMIA_PRODUCTS.find(p => p.name === name);
  return p ? p.svg : 'brush';
}
function addToCart(product) {
  if (!product || !product.name) return;
  const cart = getCart();
  const existing = cart.find(i => i.name === product.name);
  const addedQty = parseInt(product.qty, 10) || 1;
  if (existing) {
    existing.qty = (parseInt(existing.qty, 10) || 0) + addedQty;
  } else {
    cart.push({
      name: product.name,
      brand: product.brand || '',
      price: parseInt(product.price, 10) || 0,
      was: product.was ? parseInt(product.was, 10) : null,
      qty: addedQty,
      svg: product.svg || tammiaSvgForProductName(product.name),
    });
  }
  setCart(cart);
}
function removeFromCart(name) {
  const cart = getCart().filter(i => i.name !== name);
  setCart(cart);
}
function updateCartQty(name, qty) {
  const cart = getCart();
  const item = cart.find(i => i.name === name);
  if (!item) return;
  const q = parseInt(qty, 10);
  if (!q || q <= 0) {
    setCart(cart.filter(i => i.name !== name));
  } else {
    item.qty = q;
    setCart(cart);
  }
}

/* Render the cart drawer body from current localStorage cart. */
function renderCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const body = drawer.querySelector('.drawer-body');
  const foot = drawer.querySelector('.drawer-foot');
  const headCount = drawer.querySelector('.drawer-head h5 span');
  if (!body) return;

  const cart = getCart();
  const totalQty = cart.reduce((s, it) => s + (parseInt(it.qty, 10) || 0), 0);
  const subtotal = cart.reduce((s, it) => s + (parseInt(it.price, 10) || 0) * (parseInt(it.qty, 10) || 0), 0);

  if (headCount) headCount.textContent = `(${totalQty})`;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="drawer-empty" style="text-align:center; padding:48px 16px;">
        <div style="font-size:48px; margin-bottom:12px; opacity:0.4;"><i class="bi bi-bag"></i></div>
        <div style="font-family:'Fraunces',serif; font-size:20px; margin-bottom:6px;">Keranjang masih kosong</div>
        <div style="color:var(--muted); font-size:14px; margin-bottom:20px;">Yuk pilih beauty tools favoritmu.</div>
        <a href="shop.html" class="btn btn-peach btn-sm">Mulai Belanja</a>
      </div>`;
    if (foot) foot.style.display = 'none';
    return;
  }

  if (foot) foot.style.display = '';
  body.innerHTML = cart.map(it => `
    <div class="drawer-item" data-name="${it.name.replace(/"/g, '&quot;')}" style="position:relative;">
      <div class="drawer-item-img">${tammiaSearchSvg(it.svg || 'brush')}</div>
      <div>
        <div class="drawer-item-name">${it.name}</div>
        <div class="drawer-item-brand">${it.brand || ''}</div>
        <div class="drawer-item-price">${tammiaFormatPrice(it.price)}</div>
      </div>
      <div class="qty-stepper">
        <button class="qty-minus" type="button">−</button>
        <input type="text" value="${it.qty}" readonly>
        <button class="qty-plus" type="button">+</button>
      </div>
      <button class="drawer-item-remove" type="button" aria-label="Hapus produk"
        style="background:transparent; border:none; padding:6px; color:var(--muted); cursor:pointer; transition:color .15s ease; position:absolute; top:8px; right:8px; border-radius:6px; line-height:1;">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  `).join('');

  // Update subtotal in footer
  const totalVal = drawer.querySelector('.drawer-total .val');
  if (totalVal) totalVal.textContent = tammiaFormatPrice(subtotal);

  // Wire item interactions
  body.querySelectorAll('.drawer-item').forEach(item => {
    const name = item.dataset.name;
    const minus = item.querySelector('.qty-minus');
    const plus = item.querySelector('.qty-plus');
    const rm = item.querySelector('.drawer-item-remove');
    if (minus) minus.addEventListener('click', () => {
      const current = (getCart().find(i => i.name === name) || {}).qty || 1;
      if (current > 1) {
        updateCartQty(name, current - 1);
      } else {
        tammiaConfirm({
          title: 'Hapus dari Keranjang?',
          message: `<strong>${name}</strong> akan dihapus dari keranjang kamu.`,
          confirmText: 'Hapus',
          cancelText: 'Batal',
          danger: true,
          onConfirm: () => removeFromCart(name),
        });
      }
    });
    if (plus) plus.addEventListener('click', () => {
      const current = (getCart().find(i => i.name === name) || {}).qty || 1;
      updateCartQty(name, current + 1);
    });
    if (rm) {
      rm.addEventListener('mouseenter', () => { rm.style.color = 'var(--rouge)'; });
      rm.addEventListener('mouseleave', () => { rm.style.color = 'var(--muted)'; });
      rm.addEventListener('click', () => {
        tammiaConfirm({
          title: 'Hapus dari Keranjang?',
          message: `<strong>${name}</strong> akan dihapus dari keranjang kamu.`,
          confirmText: 'Hapus',
          cancelText: 'Batal',
          danger: true,
          onConfirm: () => removeFromCart(name),
        });
      });
    }
  });
}

/* ---------- Custom select component ---------- */
function initCustomSelect(selectEl) {
  if (!selectEl || selectEl.dataset.cinit === '1') return;
  selectEl.dataset.cinit = '1';
  const isFull = selectEl.classList.contains('custom-select-full');
  const wrap = document.createElement('div');
  wrap.className = 'custom-select-wrap' + (isFull ? ' full' : '');
  selectEl.parentNode.insertBefore(wrap, selectEl);
  wrap.appendChild(selectEl);
  selectEl.style.display = 'none';

  const btn = document.createElement('div');
  btn.className = 'custom-select';
  btn.setAttribute('tabindex', '0');
  btn.setAttribute('role', 'combobox');
  btn.setAttribute('aria-expanded', 'false');

  const list = document.createElement('ul');
  list.className = 'custom-select-list';
  list.setAttribute('role', 'listbox');

  function syncLabel() {
    const opt = selectEl.options[selectEl.selectedIndex];
    btn.textContent = opt ? opt.text : '';
  }
  function buildList() {
    list.innerHTML = '';
    Array.from(selectEl.options).forEach((opt, idx) => {
      const li = document.createElement('li');
      li.textContent = opt.text;
      li.setAttribute('role', 'option');
      if (idx === selectEl.selectedIndex) li.classList.add('selected');
      li.addEventListener('mousedown', e => { e.preventDefault(); });
      li.addEventListener('click', () => {
        selectEl.selectedIndex = idx;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        syncLabel();
        Array.from(list.children).forEach(c => c.classList.remove('selected'));
        li.classList.add('selected');
        close();
      });
      list.appendChild(li);
    });
  }
  syncLabel();
  buildList();
  wrap.appendChild(btn);
  wrap.appendChild(list);

  function open() {
    btn.classList.add('open');
    list.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
  function close() {
    btn.classList.remove('open');
    list.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
  function toggle() {
    if (btn.classList.contains('open')) close();
    else open();
  }
  btn.addEventListener('click', e => { e.stopPropagation(); toggle(); });
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    if (e.key === 'Escape') close();
  });
  document.addEventListener('click', e => {
    if (!wrap.contains(e.target)) close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  // Re-sync if select changed externally
  selectEl.addEventListener('change', () => {
    syncLabel();
    Array.from(list.children).forEach((c, i) => {
      c.classList.toggle('selected', i === selectEl.selectedIndex);
    });
  });
}

/* ---------- Login modal builder ---------- */
function tammiaBuildAuthModal() {
  if (document.getElementById('tammiaAuthModal')) return;
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop-custom';
  backdrop.id = 'tammiaAuthBackdrop';

  const modal = document.createElement('div');
  modal.className = 'auth-modal';
  modal.id = 'tammiaAuthModal';
  const realAuth = !!window.TAMMIA_USE_REAL_AUTH;
  modal.innerHTML = `
    <div class="auth-modal-head">
      <h5>Masuk / <em style="font-style:italic; color:var(--rouge);">Daftar</em></h5>
      <button class="auth-modal-close" data-close-auth aria-label="Tutup"><i class="bi bi-x-lg"></i></button>
    </div>
    ${realAuth ? '' : `
    <div class="auth-demo-banner">
      <i class="bi bi-info-circle"></i>
      <span><strong>Demo Mode</strong> — Real OAuth requires Supabase setup. See <code>SUPABASE-SETUP.md</code></span>
    </div>`}
    <div class="auth-tabs">
      <button class="auth-tab active" data-auth-tab="login">Masuk</button>
      <button class="auth-tab" data-auth-tab="register">Daftar</button>
    </div>
    <div class="auth-pane active" data-auth-pane="login">
      <div class="auth-field">
        <label>Email</label>
        <input type="email" placeholder="email@kamu.com" id="authLoginEmail" required>
      </div>
      <div class="auth-field">
        <label>Password</label>
        <input type="password" placeholder="••••••••" id="authLoginPass" required>
      </div>
      <div class="auth-row-between">
        <span></span>
        <a href="#" data-auth-forgot>Lupa password?</a>
      </div>
      <button class="btn btn-peach auth-submit" data-auth-action="login">Masuk <i class="bi bi-arrow-right"></i></button>

      <div class="auth-divider">atau</div>
      <div class="auth-social-row">
        <button class="auth-social-btn" data-auth-social="google">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
          Lanjut dengan Google
        </button>
        <button class="auth-social-btn" data-auth-social="facebook">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12c0-6.63-5.37-12-12-12S0 5.37 0 12c0 5.99 4.39 10.95 10.13 11.85V15.47H7.08V12h3.05V9.36c0-3 1.79-4.66 4.53-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.93-1.95 1.88V12h3.33l-.53 3.47h-2.8v8.38C19.61 22.95 24 17.99 24 12z"/></svg>
          Lanjut dengan Facebook
        </button>
      </div>
      <div class="auth-bottom-link">Belum punya akun? <a data-auth-switch="register">Daftar di sini</a></div>
    </div>
    <div class="auth-pane" data-auth-pane="register">
      <div class="auth-field">
        <label>Nama Lengkap</label>
        <input type="text" placeholder="Marshella Eunike" id="authRegName" required>
      </div>
      <div class="auth-field">
        <label>Email</label>
        <input type="email" placeholder="email@kamu.com" id="authRegEmail" required>
      </div>
      <div class="auth-field">
        <label>No. WhatsApp</label>
        <input type="tel" placeholder="+62 812 xxxx xxxx" id="authRegPhone">
      </div>
      <div class="auth-field">
        <label>Password</label>
        <input type="password" placeholder="••••••••" id="authRegPass" required>
      </div>
      <div class="auth-field">
        <label>Konfirmasi Password</label>
        <input type="password" placeholder="••••••••" id="authRegConfirm" required>
      </div>
      <label class="auth-terms">
        <input type="checkbox" id="authRegTerms" required>
        <span>Saya setuju dengan <a href="#">Syarat &amp; Ketentuan</a> dan <a href="#">Kebijakan Privasi</a> Tammia Online.</span>
      </label>
      <button class="btn btn-peach auth-submit" data-auth-action="register">Buat Akun <i class="bi bi-arrow-right"></i></button>
      <div class="auth-divider">atau</div>
      <div class="auth-social-row">
        <button class="auth-social-btn" data-auth-social="google">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
          Lanjut dengan Google
        </button>
        <button class="auth-social-btn" data-auth-social="facebook">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12c0-6.63-5.37-12-12-12S0 5.37 0 12c0 5.99 4.39 10.95 10.13 11.85V15.47H7.08V12h3.05V9.36c0-3 1.79-4.66 4.53-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.93-1.95 1.88V12h3.33l-.53 3.47h-2.8v8.38C19.61 22.95 24 17.99 24 12z"/></svg>
          Lanjut dengan Facebook
        </button>
      </div>
      <div class="auth-bottom-link">Sudah punya akun? <a data-auth-switch="login">Masuk di sini</a></div>
    </div>
    <div class="auth-pane" data-auth-pane="forgot">
      <div class="auth-forgot-head">
        <h6 style="font-family:'Fraunces',serif; font-weight:400; font-size:22px; margin:0 0 6px;">Reset Password</h6>
        <p style="color:var(--muted); font-size:13px; margin:0 0 18px;">Masukkan email kamu, link reset akan dikirim.</p>
      </div>
      <div class="auth-field">
        <label>Email</label>
        <input type="email" placeholder="email@kamu.com" id="authForgotEmail" required>
      </div>
      <button class="btn btn-peach auth-submit" data-auth-action="forgot">Kirim Link Reset <i class="bi bi-send"></i></button>
      <div class="auth-bottom-link" style="margin-top:18px;"><a data-auth-switch="login"><i class="bi bi-arrow-left"></i> Kembali ke Masuk</a></div>
      <div class="auth-forgot-success" data-forgot-success style="display:none; text-align:center; padding:18px 0 4px;">
        <div style="
          width:56px; height:56px; border-radius:50%;
          background:var(--pink-tint); color:var(--rouge);
          display:flex; align-items:center; justify-content:center;
          font-size:28px; margin:0 auto 14px;">
          <i class="bi bi-check-lg"></i>
        </div>
        <div style="font-family:'Fraunces',serif; font-size:20px; margin-bottom:6px;">Link reset telah dikirim</div>
        <div style="color:var(--muted); font-size:13px;" data-forgot-success-body>Periksa inbox dan folder spam.</div>
        <div class="auth-bottom-link" style="margin-top:18px;"><a data-auth-switch="login"><i class="bi bi-arrow-left"></i> Kembali ke Masuk</a></div>
      </div>
    </div>`;

  document.body.appendChild(backdrop);
  document.body.appendChild(modal);

  function openAuth() {
    backdrop.classList.add('open');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeAuth() {
    backdrop.classList.remove('open');
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  backdrop.addEventListener('click', closeAuth);
  modal.querySelectorAll('[data-close-auth]').forEach(b => b.addEventListener('click', closeAuth));
  modal.querySelectorAll('.auth-tab').forEach(t => {
    t.addEventListener('click', () => {
      modal.querySelectorAll('.auth-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const target = t.dataset.authTab;
      modal.querySelectorAll('.auth-pane').forEach(p => p.classList.toggle('active', p.dataset.authPane === target));
    });
  });
  modal.querySelectorAll('[data-auth-switch]').forEach(a => {
    a.addEventListener('click', () => {
      const target = a.dataset.authSwitch;
      switchPane(target);
    });
  });

  // Helper to switch to a pane that has no tab (forgot)
  function switchPane(target) {
    modal.querySelectorAll('.auth-tab').forEach(x => x.classList.toggle('active', x.dataset.authTab === target));
    modal.querySelectorAll('.auth-pane').forEach(p => p.classList.toggle('active', p.dataset.authPane === target));
    // Reset forgot pane success view when switching away from it
    if (target !== 'forgot') {
      const succ = modal.querySelector('[data-forgot-success]');
      const formBits = modal.querySelectorAll('[data-auth-pane="forgot"] .auth-field, [data-auth-pane="forgot"] .auth-forgot-head, [data-auth-pane="forgot"] [data-auth-action="forgot"]');
      if (succ) succ.style.display = 'none';
      formBits.forEach(b => b.style.display = '');
      const bottom = modal.querySelector('[data-auth-pane="forgot"] > .auth-bottom-link');
      if (bottom) bottom.style.display = '';
    }
  }

  // Forgot link triggers switch to forgot pane
  modal.querySelectorAll('[data-auth-forgot]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      switchPane('forgot');
    });
  });

  function authComplete(name, email) {
    tammiaSaveUser({ name: name || 'Tammia Lover', email: email || 'tammia@example.com', loggedIn: true });
    closeAuth();
    tammiaRefreshAuthUi();
    tammiaToast(`Halo, ${name || 'kamu'}! Selamat berbelanja.`, 'bi-check-circle-fill');
  }

  function setBtnBusy(btn, busy, label) {
    if (!btn) return;
    if (busy) {
      btn.dataset.origHtml = btn.dataset.origHtml || btn.innerHTML;
      btn.innerHTML = `<span class="auth-spinner"></span> ${label || 'Memproses...'}`;
      btn.disabled = true;
    } else {
      btn.innerHTML = btn.dataset.origHtml || btn.innerHTML;
      btn.disabled = false;
    }
  }
  function showAuthError(btn, msg) {
    // Toast for now (keeps modal tidy)
    tammiaToast(msg, 'bi-exclamation-triangle-fill');
  }

  modal.querySelector('[data-auth-action="login"]').addEventListener('click', async e => {
    e.preventDefault();
    const btn = e.currentTarget;
    const email = modal.querySelector('#authLoginEmail').value.trim();
    const pass = modal.querySelector('#authLoginPass').value;
    if (tammiaUseRealAuth()) {
      if (!email || !pass) { showAuthError(btn, 'Email dan password wajib diisi.'); return; }
      setBtnBusy(btn, true);
      try {
        const { data, error } = await window.tammiaSupabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
        // onAuthStateChange will sync localStorage + UI
        const name = (data.user && data.user.user_metadata && data.user.user_metadata.full_name) || email.split('@')[0];
        closeAuth();
        tammiaToast(`Halo, ${name}! Selamat berbelanja.`, 'bi-check-circle-fill');
      } catch (err) {
        showAuthError(btn, err.message || 'Login gagal. Cek email/password.');
      } finally {
        setBtnBusy(btn, false);
      }
      return;
    }
    // Demo mode
    const demoEmail = email || 'tammia@example.com';
    const name = (demoEmail.split('@')[0] || 'Sayang');
    authComplete(name.charAt(0).toUpperCase() + name.slice(1), demoEmail);
  });

  modal.querySelector('[data-auth-action="register"]').addEventListener('click', async e => {
    e.preventDefault();
    const btn = e.currentTarget;
    const name = modal.querySelector('#authRegName').value.trim() || 'Tammia Lover';
    const email = modal.querySelector('#authRegEmail').value.trim();
    const phone = modal.querySelector('#authRegPhone').value.trim();
    const pass = modal.querySelector('#authRegPass').value;
    const confirm = modal.querySelector('#authRegConfirm').value;
    if (tammiaUseRealAuth()) {
      if (!email || !pass) { showAuthError(btn, 'Email dan password wajib diisi.'); return; }
      if (pass !== confirm) { showAuthError(btn, 'Password dan konfirmasi tidak cocok.'); return; }
      setBtnBusy(btn, true);
      try {
        const { error } = await window.tammiaSupabase.auth.signUp({
          email,
          password: pass,
          options: { data: { full_name: name, phone } }
        });
        if (error) throw error;
        closeAuth();
        tammiaToast(`Akun dibuat. Cek email untuk konfirmasi, ${name}!`, 'bi-check-circle-fill');
      } catch (err) {
        showAuthError(btn, err.message || 'Pendaftaran gagal.');
      } finally {
        setBtnBusy(btn, false);
      }
      return;
    }
    // Demo mode
    authComplete(name, email || 'tammia@example.com');
  });

  modal.querySelectorAll('[data-auth-social]').forEach(b => {
    b.addEventListener('click', async e => {
      e.preventDefault();
      const provider = b.dataset.authSocial; // 'google' or 'facebook'
      if (tammiaUseRealAuth()) {
        setBtnBusy(b, true, 'Mengarahkan...');
        try {
          const { error } = await window.tammiaSupabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: window.location.href }
          });
          if (error) throw error;
          // Redirect happens automatically
        } catch (err) {
          showAuthError(b, err.message || 'OAuth gagal.');
          setBtnBusy(b, false);
        }
        return;
      }
      // Demo
      const name = provider === 'google' ? 'Marshella' : 'Eunike';
      authComplete(name, `${name.toLowerCase()}@${provider}.com`);
    });
  });

  // Forgot password
  modal.querySelector('[data-auth-action="forgot"]').addEventListener('click', async e => {
    e.preventDefault();
    const btn = e.currentTarget;
    const email = modal.querySelector('#authForgotEmail').value.trim();
    if (!tammiaIsValidEmail(email)) {
      showAuthError(btn, 'Email tidak valid.');
      return;
    }
    if (tammiaUseRealAuth()) {
      setBtnBusy(btn, true);
      try {
        const { error } = await window.tammiaSupabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + window.location.pathname,
        });
        if (error) throw error;
      } catch (err) {
        showAuthError(btn, err.message || 'Tidak bisa kirim email reset.');
        setBtnBusy(btn, false);
        return;
      } finally {
        setBtnBusy(btn, false);
      }
    } else {
      tammiaToast('Link reset terkirim. Cek email kamu.', 'bi-envelope-check-fill');
    }
    // Show success view in pane
    const succ = modal.querySelector('[data-forgot-success]');
    const formBits = modal.querySelectorAll('[data-auth-pane="forgot"] .auth-field, [data-auth-pane="forgot"] .auth-forgot-head, [data-auth-pane="forgot"] [data-auth-action="forgot"]');
    const bottom = modal.querySelector('[data-auth-pane="forgot"] > .auth-bottom-link');
    const body = modal.querySelector('[data-forgot-success-body]');
    if (body) body.textContent = `Link reset telah dikirim ke ${email}. Periksa inbox dan folder spam.`;
    if (succ) succ.style.display = 'block';
    formBits.forEach(b => b.style.display = 'none');
    if (bottom) bottom.style.display = 'none';
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeAuth();
  });

  // Expose openers
  window.tammiaOpenAuth = openAuth;
  window.tammiaCloseAuth = closeAuth;
}

/* ---------- Refresh navbar user UI ---------- */
function tammiaRefreshAuthUi() {
  const user = tammiaGetUser();
  document.querySelectorAll('.nav-icons').forEach(navIcons => {
    // Find existing account slot
    let slot = navIcons.querySelector('.nav-account-slot');
    if (!slot) {
      // Locate the static person-icon link
      const personIcon = navIcons.querySelector('i.bi-person');
      if (personIcon) {
        slot = personIcon.closest('a, button, div');
        if (slot) slot.classList.add('nav-account-slot');
      }
    }
    if (!slot) return;

    if (user && user.loggedIn) {
      const initials = (user.name || '?').split(' ').map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
      const newSlot = document.createElement('div');
      newSlot.className = 'profile-wrap nav-account-slot';
      newSlot.innerHTML = `
        <button class="profile-avatar" type="button" aria-haspopup="true">${initials || 'U'}</button>
        <div class="profile-menu">
          <div class="profile-menu-greet">
            <div class="name">Halo, ${user.name || 'Tammia'}</div>
            <div class="email">${user.email || ''}</div>
          </div>
          <a href="account.html"><i class="bi bi-person"></i> Akun Saya</a>
          <a href="orders.html"><i class="bi bi-bag-check"></i> Pesanan Saya</a>
          <a href="#" data-open-wishlist><i class="bi bi-heart"></i> Wishlist <span class="badge-mini" data-wishlist-count>0</span></a>
          <a href="contact.html"><i class="bi bi-question-circle"></i> Bantuan</a>
          <div class="divider"></div>
          <button type="button" data-logout><i class="bi bi-box-arrow-right"></i> Keluar</button>
        </div>`;
      slot.replaceWith(newSlot);
      const avatar = newSlot.querySelector('.profile-avatar');
      const menu = newSlot.querySelector('.profile-menu');
      avatar.addEventListener('click', e => {
        e.stopPropagation();
        menu.classList.toggle('open');
      });
      document.addEventListener('click', e => {
        if (!newSlot.contains(e.target)) menu.classList.remove('open');
      });
      newSlot.querySelector('[data-logout]').addEventListener('click', async () => {
        if (tammiaUseRealAuth()) {
          try { await window.tammiaSupabase.auth.signOut(); } catch (e) {}
        }
        tammiaSaveUser(null);
        tammiaToast('Berhasil keluar dari akun.', 'bi-box-arrow-right');
        tammiaRefreshAuthUi();
      });
      const wishLink = newSlot.querySelector('[data-open-wishlist]');
      if (wishLink) {
        wishLink.addEventListener('click', e => {
          e.preventDefault();
          menu.classList.remove('open');
          const wd = document.getElementById('wishlistDrawer');
          if (wd) {
            if (wd._render) wd._render();
            wd.classList.add('open');
            document.getElementById('drawerBackdrop').classList.add('open');
            document.body.style.overflow = 'hidden';
          }
        });
      }
      const wc = newSlot.querySelector('[data-wishlist-count]');
      if (wc) wc.textContent = tammiaGetWishlist().length;
    } else {
      // Build a fresh person-icon button that opens auth modal
      const newSlot = document.createElement('button');
      newSlot.type = 'button';
      newSlot.className = 'nav-icon-btn nav-account-slot';
      newSlot.setAttribute('aria-label', 'Masuk / Daftar');
      newSlot.innerHTML = '<i class="bi bi-person"></i>';
      newSlot.addEventListener('click', e => {
        e.preventDefault();
        if (window.tammiaOpenAuth) window.tammiaOpenAuth();
      });
      slot.replaceWith(newSlot);
    }
  });
}

/* ---------- Wishlist drawer builder ---------- */
function tammiaBuildWishlistDrawer() {
  if (document.getElementById('wishlistDrawer')) return;
  const drawer = document.createElement('aside');
  drawer.className = 'wishlist-drawer';
  drawer.id = 'wishlistDrawer';
  drawer.innerHTML = `
    <div class="drawer-head">
      <h5>Wishlist <span style="font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted);" data-wishlist-count-h>(0)</span></h5>
      <button class="drawer-close" data-close-wishlist><i class="bi bi-x-lg"></i></button>
    </div>
    <div class="drawer-body" id="wishlistBody"></div>
    <div class="drawer-foot">
      <div class="drawer-actions">
        <a href="shop.html" class="btn btn-ghost">Lihat Semua Produk</a>
        <a href="cart.html" class="btn btn-peach">Lihat Keranjang</a>
      </div>
    </div>`;
  document.body.appendChild(drawer);

  function close() {
    drawer.classList.remove('open');
    const bd = document.getElementById('drawerBackdrop');
    if (bd) bd.classList.remove('open');
    document.body.style.overflow = '';
  }
  drawer.querySelector('[data-close-wishlist]').addEventListener('click', close);

  // Render content
  function render() {
    const list = tammiaGetWishlist();
    const body = drawer.querySelector('#wishlistBody');
    const head = drawer.querySelector('[data-wishlist-count-h]');
    head.textContent = `(${list.length})`;
    if (list.length === 0) {
      body.innerHTML = `
        <div class="wishlist-empty">
          <div class="big-heart"><i class="bi bi-heart"></i></div>
          <p>Wishlist kamu kosong.<br>Suka produk dengan ❤️ untuk simpan di sini.</p>
        </div>`;
      return;
    }
    body.innerHTML = list.slice(0, 10).map(name => {
      const product = TAMMIA_PRODUCTS.find(p => p.name === name);
      if (!product) return '';
      const priceHtml = product.was
        ? `${tammiaFormatPrice(product.price)}`
        : `${tammiaFormatPrice(product.price)}`;
      return `
        <div class="wishlist-item" data-name="${product.name}">
          <div class="wishlist-item-img">${tammiaSearchSvg(product.svg)}</div>
          <div class="wishlist-item-meta">
            <div class="br">${product.brand}</div>
            <div class="nm">${product.name}</div>
            <div class="pr">${priceHtml}</div>
          </div>
          <div class="wishlist-item-actions">
            <button data-move-cart>Ke Keranjang</button>
            <button class="wishlist-remove" data-remove>Hapus</button>
          </div>
        </div>`;
    }).join('') + (list.length > 6 ? '<div style="text-align:center; padding:14px 0;"><a href="#" style="font-family:\'JetBrains Mono\',monospace; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; color:var(--rouge);">Lihat Semua</a></div>' : '');

    body.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.wishlist-item');
        const name = item.dataset.name;
        const list = tammiaGetWishlist().filter(n => n !== name);
        tammiaSaveWishlist(list);
        // Sync hearts on page
        document.querySelectorAll(`.product-wish[data-name="${CSS.escape(name)}"]`).forEach(h => h.classList.remove('liked'));
        render();
        tammiaToast('Dihapus dari wishlist.', 'bi-heart');
      });
    });
    body.querySelectorAll('[data-move-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.wishlist-item');
        tammiaToast('Dipindahkan ke keranjang.', 'bi-bag-check-fill');
        // Open cart drawer
        const cd = document.getElementById('cartDrawer');
        if (cd) {
          close();
          cd.classList.add('open');
          document.getElementById('drawerBackdrop').classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }
  drawer._render = render;
  render();
}

/* ---------- Mobile nav drawer ---------- */
function tammiaBuildMobileNav() {
  if (document.getElementById('mobileNavDrawer')) return;
  const drawer = document.createElement('aside');
  drawer.className = 'mobile-nav-drawer';
  drawer.id = 'mobileNavDrawer';
  const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  drawer.innerHTML = `
    <div class="mobile-nav-head">
      <a href="index.html" class="brand-logo">tammia<span class="dot-online">.online</span></a>
      <button class="drawer-close" data-close-mobile-nav><i class="bi bi-x-lg"></i></button>
    </div>
    <div class="mobile-nav-body">
      <div class="mobile-nav-search">
        <i class="bi bi-search"></i>
        <input type="text" placeholder="Cari produk, brand..." id="mobileSearchInput">
      </div>
      <ul class="mobile-nav-links">
        <li><a href="shop.html"${currentPage === 'shop.html' ? ' class="active"' : ''}>Shop</a></li>
        <li><a href="about.html"${currentPage === 'about.html' ? ' class="active"' : ''}>About</a></li>
        <li><a href="contact.html"${currentPage === 'contact.html' ? ' class="active"' : ''}>Contact</a></li>
      </ul>
    </div>`;
  document.body.appendChild(drawer);
  drawer.querySelector('[data-close-mobile-nav]').addEventListener('click', () => closeMobileNav());

  // Mobile search wire to same shop search flow
  const inp = drawer.querySelector('#mobileSearchInput');
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = inp.value.trim();
      if (q) location.href = 'shop.html?q=' + encodeURIComponent(q);
    }
  });
}

function openMobileNav() {
  const drawer = document.getElementById('mobileNavDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (drawer) drawer.classList.add('open');
  if (bd) bd.classList.add('open');
  document.body.classList.add('nav-drawer-open');
}
function closeMobileNav() {
  const drawer = document.getElementById('mobileNavDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (drawer) drawer.classList.remove('open');
  if (bd) bd.classList.remove('open');
  document.body.classList.remove('nav-drawer-open');
}

/* ---------- Inject wishlist nav button + badge ---------- */
function tammiaInjectWishlistNavButton() {
  document.querySelectorAll('.nav-icons').forEach(navIcons => {
    // skip if exists
    if (navIcons.querySelector('[data-open-wishlist-drawer]')) return;
    // Find existing static heart link <a href="#" class="nav-icon-btn"><i class="bi bi-heart"></i></a>
    const existingHearts = navIcons.querySelectorAll('a.nav-icon-btn');
    let staticHeart = null;
    existingHearts.forEach(a => {
      const i = a.querySelector('i.bi-heart');
      if (i && a.getAttribute('href') === '#') staticHeart = a;
    });
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-icon-btn';
    btn.setAttribute('data-open-wishlist-drawer', '');
    btn.innerHTML = '<i class="bi bi-heart"></i><span class="cart-badge wishlist-badge" data-count="0">0</span>';
    if (staticHeart) staticHeart.replaceWith(btn);
    else {
      // insert before cart
      const cartBtn = navIcons.querySelector('[data-open-cart]');
      if (cartBtn) navIcons.insertBefore(btn, cartBtn);
      else navIcons.appendChild(btn);
    }
    btn.addEventListener('click', () => {
      const wd = document.getElementById('wishlistDrawer');
      const bd = document.getElementById('drawerBackdrop');
      if (wd) {
        if (wd._render) wd._render();
        wd.classList.add('open');
        if (bd) bd.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  tammiaUpdateWishlistBadge();
}

/* ---------- Inject mobile filter trigger on shop page ---------- */
function tammiaInjectMobileFilterTrigger() {
  const toolbar = document.querySelector('.shop-toolbar');
  const sidebar = document.getElementById('filterSidebar');
  if (!toolbar || !sidebar) return;
  if (toolbar.querySelector('.mobile-filter-trigger')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'mobile-filter-trigger';
  btn.innerHTML = '<i class="bi bi-funnel"></i> Filter';
  toolbar.insertBefore(btn, toolbar.firstChild);

  // Add close button to sidebar
  if (!sidebar.querySelector('.filter-sidebar-close')) {
    const cl = document.createElement('button');
    cl.type = 'button';
    cl.className = 'filter-sidebar-close';
    cl.innerHTML = '<i class="bi bi-x-lg"></i>';
    sidebar.insertBefore(cl, sidebar.firstChild);
    cl.addEventListener('click', () => closeSidebar());
  }
  function openSidebar() {
    sidebar.classList.add('open');
    const bd = document.getElementById('drawerBackdrop');
    if (bd) bd.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    const bd = document.getElementById('drawerBackdrop');
    if (bd) bd.classList.remove('open');
    document.body.style.overflow = '';
  }
  btn.addEventListener('click', openSidebar);
}

/* ---------- Inject wishlist hearts onto product cards ---------- */
function tammiaInjectProductHearts() {
  document.querySelectorAll('.product-card').forEach(card => {
    if (card.querySelector('.product-wish')) return;
    const img = card.querySelector('.product-img');
    if (!img) return;
    const nameEl = card.querySelector('.product-name');
    const name = nameEl ? nameEl.textContent.trim() : '';
    const wished = tammiaGetWishlist().includes(name);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'product-wish' + (wished ? ' liked' : '');
    btn.setAttribute('data-name', name);
    btn.setAttribute('aria-label', 'Tambah ke wishlist');
    btn.innerHTML = wished ? '<i class="bi bi-heart-fill"></i>' : '<i class="bi bi-heart"></i>';
    img.appendChild(btn);
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const list = tammiaGetWishlist();
      const idx = list.indexOf(name);
      if (idx >= 0) {
        list.splice(idx, 1);
        btn.classList.remove('liked');
        btn.innerHTML = '<i class="bi bi-heart"></i>';
        tammiaToast('Dihapus dari wishlist.', 'bi-heart');
      } else {
        list.push(name);
        btn.classList.add('liked');
        btn.innerHTML = '<i class="bi bi-heart-fill"></i>';
        tammiaToast('Ditambahkan ke wishlist.', 'bi-heart-fill');
      }
      tammiaSaveWishlist(list);
      // Sync other instances
      document.querySelectorAll(`.product-wish[data-name="${CSS.escape(name)}"]`).forEach(other => {
        if (other === btn) return;
        const isLiked = tammiaGetWishlist().includes(name);
        other.classList.toggle('liked', isLiked);
        other.innerHTML = isLiked ? '<i class="bi bi-heart-fill"></i>' : '<i class="bi bi-heart"></i>';
      });
      const wd = document.getElementById('wishlistDrawer');
      if (wd && wd._render) wd._render();
    });
  });
}

/* ============================================================
   MAIN BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky navbar shrink ---------- */
  const navWrap = document.querySelector('.nav-wrap');
  if (navWrap) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) navWrap.classList.add('scrolled');
      else navWrap.classList.remove('scrolled');
    });
  }

  /* ---------- Cart drawer ---------- */
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const openCartBtns = document.querySelectorAll('[data-open-cart]');
  const closeCartBtns = document.querySelectorAll('[data-close-cart]');

  function openCart() {
    if (drawer) drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeAllDrawers() {
    if (drawer) drawer.classList.remove('open');
    const wd = document.getElementById('wishlistDrawer');
    if (wd) wd.classList.remove('open');
    const mn = document.getElementById('mobileNavDrawer');
    if (mn) mn.classList.remove('open');
    const fs = document.getElementById('filterSidebar');
    if (fs && window.innerWidth <= 991) fs.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
    document.body.classList.remove('nav-drawer-open');
  }
  openCartBtns.forEach(b => b.addEventListener('click', e => { e.preventDefault(); openCart(); }));
  closeCartBtns.forEach(b => b.addEventListener('click', closeAllDrawers));
  if (backdrop) backdrop.addEventListener('click', closeAllDrawers);

  /* ---------- Quick-add buttons on product cards ---------- */
  document.querySelectorAll('.product-quick').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      // Read product data from the nearest cell or card
      const cell = btn.closest('.product-cell, .product-card');
      let name = '', brand = '', price = 0, was = null, svg = 'brush';
      if (cell) {
        // Prefer dataset (shop.html), else fallback to inner text (index.html etc.)
        if (cell.dataset.name) {
          name = cell.dataset.name;
          brand = cell.dataset.brand || '';
          price = parseInt(cell.dataset.price, 10) || 0;
          was = cell.dataset.was ? parseInt(cell.dataset.was, 10) : null;
        } else {
          const nameEl = cell.querySelector('.product-name');
          const brandEl = cell.querySelector('.product-brand');
          const priceEl = cell.querySelector('.product-price.sale, .product-price');
          const wasEl = cell.querySelector('.product-price-was');
          if (nameEl) name = nameEl.textContent.trim();
          if (brandEl) brand = brandEl.textContent.trim();
          if (priceEl) price = parseInt(priceEl.textContent.replace(/[^\d]/g, ''), 10) || 0;
          if (wasEl) was = parseInt(wasEl.textContent.replace(/[^\d]/g, ''), 10) || null;
        }
        svg = tammiaSvgForProductName(name);
      }
      if (!name) {
        // Nothing identifiable -> just open the drawer
        openCart();
        return;
      }
      addToCart({ name, brand, price, was, svg });
      tammiaToast('Ditambahkan ke keranjang', 'bi-bag-check-fill');
      openCart();
    });
  });

  /* ---------- Generic qty steppers (non-cart, non-drawer) ---------- */
  document.querySelectorAll('.qty-stepper').forEach(stepper => {
    // Skip if it's a cart row stepper or a cart-drawer item stepper
    if (stepper.closest('[data-cart-row]')) return;
    if (stepper.closest('.drawer-item')) return;
    const minus = stepper.querySelector('.qty-minus');
    const plus = stepper.querySelector('.qty-plus');
    const input = stepper.querySelector('input');
    if (!input) return;
    if (minus) minus.addEventListener('click', () => {
      let v = parseInt(input.value || '1');
      if (v > 1) input.value = v - 1;
    });
    if (plus) plus.addEventListener('click', () => {
      let v = parseInt(input.value || '1');
      input.value = v + 1;
    });
  });

  /* ---------- Product detail page: Tambah ke Keranjang ---------- */
  document.querySelectorAll('[data-pd-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const info = btn.closest('.pd-info') || document.querySelector('.pd-info[data-product-name]');
      if (!info) { openCart(); return; }
      const qtyInput = document.querySelector('.pd-variant-block .qty-stepper input');
      const qty = parseInt(qtyInput ? qtyInput.value : '1', 10) || 1;
      const name = info.dataset.productName || '';
      const brand = info.dataset.productBrand || '';
      const price = parseInt(info.dataset.productPrice, 10) || 0;
      const was = info.dataset.productWas ? parseInt(info.dataset.productWas, 10) : null;
      const svg = info.dataset.productSvg || tammiaSvgForProductName(name);
      if (!name) { openCart(); return; }
      addToCart({ name, brand, price, was, svg, qty });
      tammiaToast(`${qty}× ditambahkan ke keranjang`, 'bi-bag-check-fill');
      openCart();
    });
  });

  /* ---------- Cart drawer: render from localStorage (empty by default) ---------- */
  // This wipes any hardcoded HTML items and re-renders from tammia_cart.
  renderCartDrawer();
  tammiaUpdateCartBadge();

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (q) q.addEventListener('click', () => item.classList.toggle('open'));
  });

  /* ---------- Filter toggle switches ---------- */
  document.querySelectorAll('.toggle-switch').forEach(t => {
    t.addEventListener('click', () => t.classList.toggle('on'));
  });

  /* ---------- Product detail tabs ---------- */
  document.querySelectorAll('.pd-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pd-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.querySelectorAll('.pd-tab-content').forEach(c => {
        c.style.display = c.dataset.tab === target ? 'block' : 'none';
      });
    });
  });

  /* ---------- Product detail thumbs ---------- */
  document.querySelectorAll('.pd-thumb').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.pd-thumb').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const main = document.querySelector('.pd-main');
      const inner = t.querySelector('svg');
      if (main && inner) main.innerHTML = inner.outerHTML;
    });
  });

  /* ---------- Product detail variants ---------- */
  document.querySelectorAll('.pd-variants').forEach(group => {
    group.querySelectorAll('.pd-variant').forEach(v => {
      v.addEventListener('click', () => {
        group.querySelectorAll('.pd-variant').forEach(x => x.classList.remove('active'));
        v.classList.add('active');
      });
    });
  });

  /* ---------- Shipping/payment option selection ---------- */
  document.querySelectorAll('[data-option-group]').forEach(group => {
    const name = group.dataset.optionGroup;
    document.querySelectorAll(`[data-option-of="${name}"]`).forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll(`[data-option-of="${name}"]`).forEach(x => x.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });
  });

  /* ---------- Checkout step navigation ---------- */
  document.querySelectorAll('[data-step-next]').forEach(b => {
    b.addEventListener('click', () => {
      const next = parseInt(b.dataset.stepNext);
      goToStep(next);
    });
  });
  document.querySelectorAll('[data-step-back]').forEach(b => {
    b.addEventListener('click', () => {
      const prev = parseInt(b.dataset.stepBack);
      goToStep(prev);
    });
  });
  function goToStep(n) {
    document.querySelectorAll('.checkout-step').forEach(s => {
      s.style.display = parseInt(s.dataset.step) === n ? 'block' : 'none';
    });
    document.querySelectorAll('.step-item').forEach(s => {
      const idx = parseInt(s.dataset.stepIndex);
      s.classList.remove('active', 'done');
      if (idx === n) s.classList.add('active');
      else if (idx < n) s.classList.add('done');
    });
    window.scrollTo({ top: 200, behavior: 'smooth' });
  }

  /* ---------- GSAP reveals ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    /* Hero floating SVGs */
    gsap.utils.toArray('.hero-svg-float').forEach((el, i) => {
      gsap.to(el, {
        y: i % 2 === 0 ? -18 : 14,
        rotate: i % 2 === 0 ? 4 : -3,
        duration: 4 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }

  /* ---------- Newsletter submit with validation + storage ---------- */
  document.querySelectorAll('.newsletter-form, .footer-newsletter').forEach(form => {
    tammiaInitNewsletterForm(form);
  });

  /* ---------- Contact form submit ---------- */
  document.querySelectorAll('.contact-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = 'Pesan Terkirim ✓';
        btn.disabled = true;
        btn.style.background = 'var(--rouge)';
        btn.style.color = '#fff';
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.color = '';
          form.reset();
        }, 2500);
      }
    });
  });

  /* ---------- Live search dropdown (navbar) ---------- */
  document.querySelectorAll('.nav-search').forEach(wrap => {
    const input = wrap.querySelector('input[type="text"]');
    if (!input) return;

    // Inject dropdown shell
    const dropdown = document.createElement('div');
    dropdown.className = 'search-results-dropdown';
    wrap.appendChild(dropdown);

    let debounceTimer = null;
    let mousedownInside = false;

    function renderResults(query) {
      const q = query.trim().toLowerCase();
      if (!q) {
        dropdown.classList.remove('open');
        dropdown.innerHTML = '';
        return;
      }
      const matches = TAMMIA_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      ).slice(0, 6);

      let html = '';
      if (matches.length === 0) {
        html = '<div class="search-empty">Tidak ada produk yang cocok</div>';
      } else {
        matches.forEach(m => {
          const priceHtml = m.was
            ? `<span class="sr-price sale">${tammiaFormatPrice(m.price)}</span> <span class="sr-was">${tammiaFormatPrice(m.was)}</span>`
            : `<span class="sr-price">${tammiaFormatPrice(m.price)}</span>`;
          html += `
            <a class="search-result-row" href="product.html">
              <span class="sr-thumb">${tammiaSearchSvg(m.svg)}</span>
              <span class="sr-meta">
                <span class="sr-brand">${m.brand}</span>
                <span class="sr-name">${m.name}</span>
                <span class="sr-price-row">${priceHtml}</span>
              </span>
            </a>`;
        });
        html += `<a class="search-see-all" href="shop.html?q=${encodeURIComponent(query.trim())}">Lihat semua hasil <i class="bi bi-arrow-right"></i></a>`;
      }
      dropdown.innerHTML = html;
      dropdown.classList.add('open');
    }

    input.addEventListener('input', e => {
      clearTimeout(debounceTimer);
      const val = e.target.value;
      debounceTimer = setTimeout(() => renderResults(val), 150);
    });

    input.addEventListener('focus', () => {
      if (input.value.trim()) renderResults(input.value);
    });

    // FIX: prevent blur from killing click via mousedown trap on dropdown
    dropdown.addEventListener('mousedown', e => {
      mousedownInside = true;
      // Prevent input from losing focus before click registers
      e.preventDefault();
    });
    dropdown.addEventListener('mouseup', () => {
      mousedownInside = false;
    });

    input.addEventListener('blur', () => {
      // Skip blur-hide if user clicked inside dropdown
      if (mousedownInside) return;
      setTimeout(() => {
        if (!mousedownInside) dropdown.classList.remove('open');
      }, 120);
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        dropdown.classList.remove('open');
        input.blur();
      } else if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) {
          e.preventDefault();
          window.location.href = 'shop.html?q=' + encodeURIComponent(q);
        }
      }
    });
  });

  /* ---------- Shop page: live filtering ---------- */
  const grid = document.getElementById('productGrid');
  const sidebar = document.getElementById('filterSidebar');
  if (grid && sidebar) {
    const cells = Array.from(grid.querySelectorAll('.product-cell'));
    const countEl = document.getElementById('shopCount');
    const emptyEl = document.getElementById('shopEmpty');
    const pagEl = document.getElementById('paginationWrap');
    const priceRange = document.getElementById('priceRange');
    const priceMaxLabel = document.getElementById('priceMaxLabel');
    const sortSelect = document.getElementById('sortSelect');
    const saleToggle = document.getElementById('saleOnlyToggle');
    const resetBtn = document.getElementById('resetAllFilters');
    const emptyResetBtn = document.getElementById('emptyResetBtn');

    function getState() {
      const cats = Array.from(sidebar.querySelectorAll('input[data-filter="cat"]:checked')).map(i => i.value);
      const brands = Array.from(sidebar.querySelectorAll('input[data-filter="brand"]:checked')).map(i => i.value);
      const priceMax = priceRange ? parseInt(priceRange.value, 10) : Infinity;
      const ratingInput = sidebar.querySelector('input[data-filter="rating"]:checked');
      const minRating = ratingInput ? parseFloat(ratingInput.value) : 0;
      const saleOnly = saleToggle && saleToggle.classList.contains('on');
      const sort = sortSelect ? sortSelect.value : 'featured';
      return { cats, brands, priceMax, minRating, saleOnly, sort };
    }

    function applyFilters() {
      const s = getState();
      if (priceMaxLabel && priceRange) {
        priceMaxLabel.textContent = tammiaFormatPrice(parseInt(priceRange.value, 10));
      }

      // Filter
      const visible = [];
      cells.forEach(cell => {
        const cat = cell.dataset.cat || '';
        const brand = cell.dataset.brand || '';
        const price = parseInt(cell.dataset.price, 10) || 0;
        const rating = parseFloat(cell.dataset.rating) || 0;
        const isSale = cell.dataset.sale === '1';

        let show = true;
        if (s.cats.length && !s.cats.includes(cat)) show = false;
        if (s.brands.length && !s.brands.includes(brand)) show = false;
        if (price > s.priceMax) show = false;
        if (s.minRating && rating < s.minRating) show = false;
        if (s.saleOnly && !isSale) show = false;

        if (show) visible.push(cell);
        else cell.style.display = 'none';
      });

      // Sort visible
      visible.sort((a, b) => {
        const pa = parseInt(a.dataset.price, 10) || 0;
        const pb = parseInt(b.dataset.price, 10) || 0;
        const ra = parseFloat(a.dataset.rating) || 0;
        const rb = parseFloat(b.dataset.rating) || 0;
        const na = (a.dataset.name || '').toLowerCase();
        const nb = (b.dataset.name || '').toLowerCase();
        switch (s.sort) {
          case 'price-asc': return pa - pb;
          case 'price-desc': return pb - pa;
          case 'name': return na.localeCompare(nb);
          case 'rating': return rb - ra;
          default: return 0; // featured = stable original order
        }
      });

      // Brief fade on grid
      grid.style.transition = 'opacity 200ms ease';
      grid.style.opacity = '0.4';
      // Re-attach visible cells in sorted order
      visible.forEach(c => { c.style.display = ''; grid.appendChild(c); });
      // Hidden cells get re-appended at the end so they stay in DOM
      cells.forEach(c => { if (!visible.includes(c)) grid.appendChild(c); });

      setTimeout(() => { grid.style.opacity = '1'; }, 30);

      // Update count and empty state
      const total = cells.length;
      const shown = visible.length;
      if (countEl) countEl.textContent = `Menampilkan ${shown} dari ${total} produk`;
      if (emptyEl) emptyEl.style.display = shown === 0 ? 'block' : 'none';
      if (pagEl) pagEl.style.display = shown === 0 ? 'none' : '';
    }

    function resetAll() {
      sidebar.querySelectorAll('input[type="checkbox"][data-filter]').forEach(cb => { cb.checked = false; });
      const semuaRating = sidebar.querySelector('input[data-filter="rating"][value="0"]');
      if (semuaRating) semuaRating.checked = true;
      if (priceRange) priceRange.value = priceRange.max;
      if (saleToggle) saleToggle.classList.remove('on');
      if (sortSelect) {
        sortSelect.value = 'featured';
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
      applyFilters();
    }

    // Wire up changes
    sidebar.querySelectorAll('input[data-filter]').forEach(inp => {
      inp.addEventListener('change', applyFilters);
    });
    if (priceRange) priceRange.addEventListener('input', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
    if (saleToggle) {
      saleToggle.addEventListener('click', () => applyFilters());
    }
    if (resetBtn) resetBtn.addEventListener('click', resetAll);
    if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAll);

    // Pre-apply URL query: ?q=, ?cat=, ?sale=
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    if (catParam) {
      const map = { brush: 'Makeup Brushes', sponge: 'Makeup Sponges', lash: 'Eyelash', case: 'Beauty Cases', tweezer: 'Tweezers', nail: 'Nail Care', hair: 'Hair Tools', bath: 'Bath Accessories' };
      const target = map[catParam];
      if (target) {
        const cb = sidebar.querySelector(`input[data-filter="cat"][value="${target}"]`);
        if (cb) cb.checked = true;
      }
    }
    if (params.get('sale') === '1' && saleToggle) saleToggle.classList.add('on');
    const q = params.get('q');
    if (q) {
      const searchInput = document.querySelector('.nav-search input');
      if (searchInput) searchInput.value = q;
    }

    applyFilters();
  }

  /* ---------- TASK 3: Init custom selects ---------- */
  document.querySelectorAll('select.custom-select-source').forEach(initCustomSelect);

  /* ---------- TASK 5: Auth modal + nav UI ---------- */
  tammiaBuildAuthModal();
  tammiaRefreshAuthUi();
  tammiaInitSupabaseAuthSync();

  /* ---------- TASK 6: Wishlist drawer + nav button + product hearts ---------- */
  tammiaBuildWishlistDrawer();
  tammiaInjectWishlistNavButton();
  tammiaInjectProductHearts();
  tammiaUpdateWishlistBadge();

  /* ---------- TASK 8: Mobile nav drawer ---------- */
  tammiaBuildMobileNav();
  document.querySelectorAll('.nav-mobile-toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openMobileNav();
      const bd = document.getElementById('drawerBackdrop');
      if (bd) bd.classList.add('open');
    });
  });

  /* ---------- TASK 8: Mobile filter trigger on shop page ---------- */
  tammiaInjectMobileFilterTrigger();

  /* ---------- TASK 4: Cart page interactions ---------- */
  tammiaInitCartPage();

  /* ---------- TASK 5: Orders page (orders.html) ---------- */
  tammiaInitOrdersPage();

  /* ---------- TASK 7: Reviews on product page ---------- */
  tammiaInitReviewSection();

  /* ---------- TASK 8: Checkout summary collapsible on mobile ---------- */
  tammiaInitOrderSummaryCollapsible();

}); // End DOMContentLoaded

/* ============================================================
   TASK 4 — Cart page logic (localStorage-driven)
   ============================================================ */
function tammiaInitCartPage() {
  const table = document.querySelector('.cart-table');
  if (!table) return;

  const SHIPPING_FREE_THRESHOLD = 150000;
  const SHIPPING_COST = 18000;
  const tbody = table.querySelector('tbody');
  const tableWrapper = table.parentElement; // overflow-x wrapper

  function renderRows() {
    const cart = getCart();
    if (!tbody) return;

    // Empty state
    const existingEmpty = tableWrapper.querySelector('.cart-empty-state');
    if (cart.length === 0) {
      table.style.display = 'none';
      if (!existingEmpty) {
        const empty = document.createElement('div');
        empty.className = 'cart-empty-state';
        empty.innerHTML = `
          <div class="icon-big"><i class="bi bi-bag-x"></i></div>
          <h3>Keranjang kamu masih kosong</h3>
          <p>Yuk, isi keranjang dengan beauty tools pilihan kamu.</p>
          <a href="shop.html" class="btn btn-peach">Lihat Produk <i class="bi bi-arrow-right"></i></a>`;
        tableWrapper.appendChild(empty);
      }
      recalc();
      return;
    }
    if (existingEmpty) existingEmpty.remove();
    table.style.display = '';

    tbody.innerHTML = cart.map(it => {
      const safeName = (it.name || '').replace(/"/g, '&quot;');
      const wasHtml = it.was
        ? `<div style="font-size:12px; color:var(--muted); text-decoration:line-through;">${tammiaFormatPrice(it.was)}</div>`
        : '';
      const priceColor = it.was ? 'color:var(--rouge);' : '';
      return `
        <tr data-cart-row data-name="${safeName}" data-price="${it.price}" data-qty="${it.qty}">
          <td>
            <div class="cart-item-cell">
              <div class="cart-item-img">${tammiaSearchSvg(it.svg || 'brush')}</div>
              <div>
                <div class="mono-label">${it.brand || ''}</div>
                <div style="font-weight:500; font-size:15px; margin: 6px 0;">
                  <a href="product.html" style="color:var(--ink);">${it.name}</a>
                </div>
              </div>
            </div>
          </td>
          <td>
            <div style="font-family:'Fraunces',serif; font-weight:500; font-size:16px; ${priceColor}">${tammiaFormatPrice(it.price)}</div>
            ${wasHtml}
          </td>
          <td>
            <div class="qty-stepper">
              <button class="qty-minus" type="button">−</button>
              <input type="text" value="${it.qty}" readonly>
              <button class="qty-plus" type="button">+</button>
            </div>
          </td>
          <td>
            <div style="font-family:'Fraunces',serif; font-size:18px; font-weight:500;">${tammiaFormatPrice(it.price * it.qty)}</div>
          </td>
          <td>
            <button class="cart-remove" type="button" aria-label="Hapus"><i class="bi bi-x-lg"></i></button>
          </td>
        </tr>`;
    }).join('');

    // Wire row controls
    tbody.querySelectorAll('tr[data-cart-row]').forEach(row => {
      const name = row.dataset.name;
      const minus = row.querySelector('.qty-minus');
      const plus = row.querySelector('.qty-plus');
      const removeBtn = row.querySelector('.cart-remove');

      function askRemove() {
        tammiaConfirm({
          title: 'Hapus dari Keranjang?',
          message: `<strong>${name}</strong> akan dihapus dari keranjang kamu.`,
          confirmText: 'Hapus',
          cancelText: 'Batal',
          danger: true,
          onConfirm: () => {
            row.classList.add('removing');
            setTimeout(() => {
              removeFromCart(name); // triggers re-render via setCart
            }, 260);
          },
        });
      }

      if (minus) minus.addEventListener('click', () => {
        const cart = getCart();
        const item = cart.find(i => i.name === name);
        if (!item) return;
        if (item.qty > 1) {
          updateCartQty(name, item.qty - 1);
        } else {
          askRemove();
        }
      });
      if (plus) plus.addEventListener('click', () => {
        const cart = getCart();
        const item = cart.find(i => i.name === name);
        if (!item) return;
        updateCartQty(name, item.qty + 1);
      });
      if (removeBtn) removeBtn.addEventListener('click', askRemove);
    });

    recalc();
  }

  function recalc() {
    const cart = getCart();
    let subtotal = 0;
    let totalQty = 0;
    cart.forEach(it => {
      subtotal += (parseInt(it.price, 10) || 0) * (parseInt(it.qty, 10) || 0);
      totalQty += parseInt(it.qty, 10) || 0;
    });
    const shipping = subtotal === 0 ? 0 : (subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST);

    // Update order-summary
    const summary = document.querySelector('.order-summary');
    let extraDeductions = 0;
    if (summary) {
      const rows = summary.querySelectorAll('.summary-row');
      if (rows[0]) {
        rows[0].innerHTML = `<span>Subtotal (${totalQty} item)</span><span>${tammiaFormatPrice(subtotal)}</span>`;
      }
      summary.querySelectorAll('.summary-row:not(.total)').forEach((srow, idx) => {
        if (idx === 0) return;
        const lbl = srow.querySelector('span:first-child');
        if (!lbl) return;
        if (/Pengiriman/i.test(lbl.textContent)) {
          srow.innerHTML = shipping === 0
            ? `<span>Pengiriman</span><span><i class="bi bi-check-circle-fill" style="color:#2d9b5e;"></i> Gratis</span>`
            : `<span>Pengiriman</span><span>${tammiaFormatPrice(shipping)}</span>`;
        } else {
          const val = srow.querySelector('span:last-child');
          if (val) {
            const m = val.textContent.match(/(\d[\d.]*)/);
            if (m) {
              const n = parseInt(m[1].replace(/\./g, ''), 10);
              const sign = /[-−]/.test(val.textContent) ? -1 : 1;
              extraDeductions += sign * n;
            }
          }
        }
      });
      const totalRow = summary.querySelector('.summary-row.total');
      if (totalRow) {
        const total = Math.max(0, subtotal + shipping + extraDeductions);
        totalRow.innerHTML = `<span>Total</span><span>${tammiaFormatPrice(total)}</span>`;
      }
    }

    // Shipping progress bar
    const progress = document.querySelector('.shipping-progress');
    if (progress) {
      const remaining = Math.max(0, SHIPPING_FREE_THRESHOLD - subtotal);
      const pct = Math.min(100, (subtotal / SHIPPING_FREE_THRESHOLD) * 100);
      const fill = progress.querySelector('.shipping-progress-fill');
      if (fill) fill.style.width = pct + '%';
      const headRow = progress.querySelector('.d-flex');
      if (headRow) {
        if (remaining <= 0) {
          headRow.innerHTML = `<div><strong style="font-family:'Fraunces',serif; font-size:18px;">Yay! Kamu dapat gratis ongkir</strong> <span style="color:var(--muted); font-size:14px;">untuk pesanan ini.</span></div>
          <span class="mono-label">${tammiaFormatPrice(subtotal)} / ${tammiaFormatPrice(SHIPPING_FREE_THRESHOLD)}</span>`;
        } else {
          headRow.innerHTML = `<div><strong style="font-family:'Fraunces',serif; font-size:18px;">Belanja ${tammiaFormatPrice(remaining)} lagi</strong> <span style="color:var(--muted); font-size:14px;">untuk gratis ongkir!</span></div>
          <span class="mono-label">${tammiaFormatPrice(subtotal)} / ${tammiaFormatPrice(SHIPPING_FREE_THRESHOLD)}</span>`;
        }
      }
    }

    // Update cart count badge in header
    const headerCount = document.querySelector('h1 [style*="0.6em"]');
    if (headerCount) headerCount.textContent = `(${totalQty} item)`;
  }

  // Re-render whenever the global cart changes (from drawer, etc.)
  document.addEventListener('tammia:cart-changed', renderRows);

  renderRows();
}

/* ============================================================
   TASK 7 — Review section enhancements
   ============================================================ */
function tammiaInitReviewSection() {
  const tabContent = document.querySelector('.pd-tab-content[data-tab="review"]');
  if (!tabContent) return;
  // If we've already enhanced this, skip
  if (tabContent.dataset.enhanced === '1') return;
  tabContent.dataset.enhanced = '1';

  // Build new content
  tabContent.innerHTML = `
    <div class="review-summary">
      <div>
        <div class="big-rating">4.9<sub>/5</sub></div>
        <div class="stars-row">★★★★★</div>
        <div class="meta">124 verified reviews</div>
      </div>
      <div class="review-bars">
        <div class="review-bar-row"><span class="star-num">5★</span><div class="track"><div class="fill" style="width:87%"></div></div><span class="pct">87%</span></div>
        <div class="review-bar-row"><span class="star-num">4★</span><div class="track"><div class="fill" style="width:10%"></div></div><span class="pct">10%</span></div>
        <div class="review-bar-row"><span class="star-num">3★</span><div class="track"><div class="fill" style="width:2%"></div></div><span class="pct">2%</span></div>
        <div class="review-bar-row"><span class="star-num">2★</span><div class="track"><div class="fill" style="width:1%"></div></div><span class="pct">1%</span></div>
        <div class="review-bar-row"><span class="star-num">1★</span><div class="track"><div class="fill" style="width:0%"></div></div><span class="pct">0%</span></div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3" style="margin-bottom:18px;">
      <div class="review-filter-row" id="reviewFilterRow">
        <button class="review-filter-btn active" data-rfilter="all">Semua</button>
        <button class="review-filter-btn" data-rfilter="5star">Berbintang 5</button>
        <button class="review-filter-btn" data-rfilter="photo">Dengan Foto</button>
        <button class="review-filter-btn" data-rfilter="verified">Terverifikasi</button>
      </div>
      <button class="btn btn-peach btn-sm" id="openReviewForm"><i class="bi bi-pencil"></i> Tulis Review</button>
    </div>

    <div class="review-form-wrap" id="reviewFormWrap">
      <h5 style="font-family:'Fraunces',serif; font-weight:400; font-size:20px; margin-bottom:6px;">Tulis ulasan kamu</h5>
      <p style="color:var(--muted); font-size:13px; margin-bottom:14px;">Bantu beauty enthusiast lain dengan pengalamanmu.</p>
      <label>Rating Kamu</label>
      <div class="star-picker" data-picker>
        <span class="star" data-star="1">★</span>
        <span class="star" data-star="2">★</span>
        <span class="star" data-star="3">★</span>
        <span class="star" data-star="4">★</span>
        <span class="star" data-star="5">★</span>
      </div>
      <label>Nama</label>
      <input type="text" placeholder="Marshella E.">
      <label>Headline Review</label>
      <input type="text" placeholder="Worth banget!">
      <label>Ulasan Lengkap</label>
      <textarea placeholder="Ceritakan pengalaman kamu..."></textarea>
      <label>Foto Produk (opsional)</label>
      <div class="upload-zone"><i class="bi bi-image"></i> Tap atau drag foto di sini · maks 5 foto</div>
      <button type="button" class="btn btn-peach" id="submitReview">Kirim Review</button>
    </div>

    <div id="reviewList">
      <div class="review-card polished" data-review-rating="5" data-review-photo="1" data-review-verified="1">
        <div class="review-head">
          <div class="testimonial-avatar">F</div>
          <div style="flex:1;">
            <strong style="font-size:14px;">Fitri R.</strong>
            <span class="verified-pill"><i class="bi bi-patch-check-fill"></i> Verified</span>
            <div class="mono-label" style="font-size:9px; margin-top:2px;">Pembelian Terverifikasi</div>
          </div>
          <div class="stars" style="color:#e8b04a;">★★★★★</div>
        </div>
        <h4 class="review-headline">Worth banget pas sale!</h4>
        <p class="review-body">Pouchnya super luas, semua brush kit aku muat plus masih ada space untuk sponge dan lipstick. PVC-nya tebel banget, kelihatan awet. Repacking dari Tammia juga rapi banget, sampai dalam kondisi sempurna.</p>
        <div class="review-footer">Surabaya · 12 Mei 2026</div>
      </div>

      <div class="review-card polished" data-review-rating="5" data-review-photo="0" data-review-verified="1">
        <div class="review-head">
          <div class="testimonial-avatar">A</div>
          <div style="flex:1;">
            <strong style="font-size:14px;">Adelia P.</strong>
            <span class="verified-pill"><i class="bi bi-patch-check-fill"></i> Verified</span>
            <div class="mono-label" style="font-size:9px; margin-top:2px;">Pembelian Terverifikasi</div>
          </div>
          <div class="stars" style="color:#e8b04a;">★★★★★</div>
        </div>
        <h4 class="review-headline">Perfect untuk wedding job mobile</h4>
        <p class="review-body">Pakai buat wedding job mobile, gampang banget cek isi tanpa buka semua zipper karena transparan. Resleting halus, packaging dari Tammia juga rapi. Repeat buyer fix.</p>
        <div class="review-footer">Jakarta · 28 April 2026</div>
      </div>

      <div class="review-card polished" data-review-rating="4" data-review-photo="1" data-review-verified="1">
        <div class="review-head">
          <div class="testimonial-avatar">M</div>
          <div style="flex:1;">
            <strong style="font-size:14px;">Mawar S.</strong>
            <span class="verified-pill"><i class="bi bi-patch-check-fill"></i> Verified</span>
            <div class="mono-label" style="font-size:9px; margin-top:2px;">Pembelian Terverifikasi</div>
          </div>
          <div class="stars" style="color:#e8b04a;">★★★★<span style="color:var(--line);">★</span></div>
        </div>
        <h4 class="review-headline">Kualitas oke, ukuran sedikit kecil</h4>
        <p class="review-body">Kualitas oke, cuma menurut aku ukuran M agak kekecilan kalau bawa brush set lengkap. Next time mau coba size L. Tapi overall puas, harga sale juga ramah.</p>
        <div class="review-footer">Bandung · 14 April 2026</div>
      </div>
    </div>

    <div style="text-align:center; padding: 28px 0 0;">
      <a href="#" style="font-family:'JetBrains Mono', monospace; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; color:var(--rouge);">Lihat semua 124 review <i class="bi bi-arrow-right"></i></a>
    </div>
  `;

  // Filter buttons
  tabContent.querySelectorAll('.review-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tabContent.querySelectorAll('.review-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.rfilter;
      tabContent.querySelectorAll('#reviewList .review-card').forEach(c => {
        let show = true;
        if (f === '5star') show = c.dataset.reviewRating === '5';
        if (f === 'photo') show = c.dataset.reviewPhoto === '1';
        if (f === 'verified') show = c.dataset.reviewVerified === '1';
        c.style.display = show ? '' : 'none';
      });
    });
  });

  // Star picker
  const picker = tabContent.querySelector('[data-picker]');
  if (picker) {
    let chosen = 0;
    picker.querySelectorAll('.star').forEach(star => {
      star.addEventListener('mouseenter', () => {
        const v = parseInt(star.dataset.star, 10);
        picker.querySelectorAll('.star').forEach(s => s.classList.toggle('lit', parseInt(s.dataset.star, 10) <= v));
      });
      star.addEventListener('click', () => {
        chosen = parseInt(star.dataset.star, 10);
        picker.dataset.value = chosen;
      });
    });
    picker.addEventListener('mouseleave', () => {
      picker.querySelectorAll('.star').forEach(s => s.classList.toggle('lit', parseInt(s.dataset.star, 10) <= chosen));
    });
  }

  // Open form
  const formWrap = tabContent.querySelector('#reviewFormWrap');
  const openBtn = tabContent.querySelector('#openReviewForm');
  if (openBtn && formWrap) {
    openBtn.addEventListener('click', () => {
      formWrap.classList.toggle('open');
      if (formWrap.classList.contains('open')) formWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Fake submit
  const submitBtn = tabContent.querySelector('#submitReview');
  if (submitBtn) submitBtn.addEventListener('click', () => {
    submitBtn.innerHTML = 'Review Terkirim ✓';
    submitBtn.disabled = true;
    submitBtn.style.background = '#2d9b5e';
    submitBtn.style.color = '#fff';
    setTimeout(() => {
      formWrap.classList.remove('open');
      submitBtn.innerHTML = 'Kirim Review';
      submitBtn.disabled = false;
      submitBtn.style.background = '';
      submitBtn.style.color = '';
      tammiaToast('Review berhasil dikirim. Terima kasih!', 'bi-check-circle-fill');
    }, 1800);
  });
}

/* ============================================================
   TASK 8 — Order summary collapsible on mobile
   ============================================================ */
function tammiaInitOrderSummaryCollapsible() {
  const summary = document.querySelector('.order-summary');
  if (!summary) return;
  // Only on checkout page (look for step progress)
  if (!document.querySelector('.step-progress')) return;
  summary.classList.add('collapsible');
  // Wrap existing children into toggle/content
  const original = Array.from(summary.children);
  const heading = original[0];
  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'summary-toggle';
  toggleBtn.innerHTML = `<span style="font-family:'Fraunces',serif; font-size:22px;">Ringkasan Pesanan</span><i class="bi bi-chevron-down chevron"></i>`;
  const content = document.createElement('div');
  content.className = 'summary-content';
  original.forEach((el, i) => {
    if (i === 0) return; // skip heading h5 (we replaced with toggle text)
    content.appendChild(el);
  });
  // Remove heading h5 since we used its text in toggle
  if (heading) heading.remove();
  summary.appendChild(toggleBtn);
  summary.appendChild(content);

  // Open by default on desktop
  function syncOpen() {
    if (window.innerWidth > 991) summary.classList.add('open');
  }
  syncOpen();
  window.addEventListener('resize', syncOpen);
  toggleBtn.addEventListener('click', () => {
    summary.classList.toggle('open');
  });
}

/* ============================================================
   TASK 4 — Newsletter form (validation + storage + success card)
   ============================================================ */
function tammiaIsValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim());
}
function tammiaGetNewsletter() {
  try { return JSON.parse(localStorage.getItem('tammia_newsletter') || '[]'); }
  catch (e) { return []; }
}
function tammiaSaveNewsletter(list) {
  localStorage.setItem('tammia_newsletter', JSON.stringify(list || []));
}
function tammiaInitNewsletterForm(form) {
  if (!form || form.dataset.nlInit === '1') return;
  form.dataset.nlInit = '1';

  const isFooter = form.classList.contains('footer-newsletter');
  const input = form.querySelector('input[type="email"], input[type="text"], input');
  const btn = form.querySelector('button');
  if (!input || !btn) return;

  // Inline error helper
  let errorEl = form.querySelector('.newsletter-error');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'newsletter-error';
    errorEl.style.cssText = `
      display: none;
      width: 100%;
      margin-top: 8px;
      font-size: 12px;
      color: ${isFooter ? '#ff9a9a' : 'var(--rouge)'};
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.04em;
    `;
    form.appendChild(errorEl);
  }
  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
    input.style.borderColor = isFooter ? '#ff9a9a' : 'var(--rouge)';
  }
  function clearError() {
    errorEl.style.display = 'none';
    errorEl.textContent = '';
    input.style.borderColor = '';
  }
  input.addEventListener('input', clearError);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = (input.value || '').trim();
    if (!tammiaIsValidEmail(email)) {
      showError('Email tidak valid. Coba lagi.');
      return;
    }
    const list = tammiaGetNewsletter();
    if (list.includes(email.toLowerCase())) {
      showSuccess(form, isFooter, 'Email kamu sudah terdaftar', 'Kami sudah punya emailmu — kamu akan terus dapat info Friday Flash Sale tiap minggu.');
      return;
    }
    list.push(email.toLowerCase());
    tammiaSaveNewsletter(list);

    // Optional: send to Supabase
    if (window.TAMMIA_USE_REAL_AUTH && window.tammiaSupabase) {
      window.tammiaSupabase
        .from('newsletter_subscribers')
        .insert({ email })
        .then(() => {}, err => console.warn('Newsletter insert failed:', err));
    }
    showSuccess(form, isFooter);
  });

  function showSuccess(form, isFooter, title = 'Terima kasih sudah subscribe!', body = 'Kamu akan dapat info flash sale, produk baru, dan promo eksklusif setiap minggu.') {
    if (form.dataset.original) return; // already showing
    form.dataset.original = form.innerHTML;
    const tintBg = isFooter ? 'rgba(255,255,255,0.08)' : 'var(--cream-1)';
    const ringColor = isFooter ? '#fff' : 'var(--pink)';
    const titleColor = isFooter ? '#fff' : 'var(--ink)';
    const bodyColor = isFooter ? '#bbb' : 'var(--ink-soft)';
    form.style.display = 'block';
    form.innerHTML = `
      <div class="newsletter-success" style="
        display:flex; align-items:center; gap:14px;
        background:${tintBg};
        border:1px solid ${ringColor === '#fff' ? 'rgba(255,255,255,0.18)' : 'var(--pink)'};
        border-radius:14px; padding:18px 20px;">
        <div style="
          width:44px; height:44px; flex:0 0 44px; border-radius:50%;
          background:${isFooter ? 'rgba(232,160,168,0.25)' : 'var(--pink-tint)'};
          color:${isFooter ? '#f4c7cd' : 'var(--rouge)'};
          display:flex; align-items:center; justify-content:center;
          font-size:20px;
        "><i class="bi bi-check-lg"></i></div>
        <div style="flex:1; min-width:0;">
          <div style="font-family:'Fraunces',serif; font-size:18px; line-height:1.2; color:${titleColor};">${title}</div>
          <div style="font-size:13px; color:${bodyColor}; margin-top:4px;">${body}</div>
        </div>
        <button type="button" class="newsletter-close" style="
          background:transparent; border:1px solid ${ringColor === '#fff' ? 'rgba(255,255,255,0.25)' : 'var(--line)'};
          color:${titleColor}; border-radius:10px; padding:8px 14px;
          font-family:'JetBrains Mono',monospace; font-size:11px;
          letter-spacing:0.16em; text-transform:uppercase; cursor:pointer;
          flex-shrink:0;
        ">Tutup</button>
      </div>`;
    const closeBtn = form.querySelector('.newsletter-close');
    function revert() {
      if (!form.dataset.original) return;
      form.innerHTML = form.dataset.original;
      delete form.dataset.original;
      form.style.display = '';
      // Re-init in case event listeners need re-binding
      delete form.dataset.nlInit;
      tammiaInitNewsletterForm(form);
    }
    if (closeBtn) closeBtn.addEventListener('click', revert);
    setTimeout(revert, 4000);
  }
}

/* ============================================================
   TASK 1 — Supabase auth helpers
   ============================================================ */
function tammiaUseRealAuth() {
  return !!(window.TAMMIA_USE_REAL_AUTH && window.tammiaSupabase);
}

/* Sync the Supabase session to localStorage so existing UI works. */
function tammiaSyncSupabaseSessionToLocal(session) {
  if (!session || !session.user) {
    tammiaSaveUser(null);
    return;
  }
  const u = session.user;
  const meta = u.user_metadata || {};
  const name = meta.full_name || meta.name || (u.email ? u.email.split('@')[0] : 'Tammia');
  tammiaSaveUser({
    name: (name + '').charAt(0).toUpperCase() + (name + '').slice(1),
    email: u.email || '',
    loggedIn: true,
    supabaseId: u.id,
  });
}

function tammiaInitSupabaseAuthSync() {
  if (!tammiaUseRealAuth()) return;
  const sb = window.tammiaSupabase;
  // Hydrate from existing session (returns a Promise)
  sb.auth.getSession().then(({ data }) => {
    tammiaSyncSupabaseSessionToLocal(data && data.session);
    tammiaRefreshAuthUi();
  }, () => {});
  sb.auth.onAuthStateChange((event, session) => {
    tammiaSyncSupabaseSessionToLocal(session);
    tammiaRefreshAuthUi();
  });
}

/* ============================================================
   TASK 5 — Orders page (status filters + tracking + buy again)
   ============================================================ */
function tammiaInitOrdersPage() {
  const list = document.getElementById('ordersList');
  if (!list) return;

  const filterRow = document.getElementById('ordersFilterRow');
  const emptyEl = document.getElementById('ordersEmpty');
  const cards = Array.from(list.querySelectorAll('.order-card'));

  function applyFilter(filter) {
    let visible = 0;
    cards.forEach(c => {
      const show = filter === 'all' || c.dataset.orderStatus === filter;
      c.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (emptyEl) {
      if (visible === 0) {
        emptyEl.style.display = '';
        list.style.display = 'none';
      } else {
        emptyEl.style.display = 'none';
        list.style.display = '';
      }
    }
  }

  if (filterRow) {
    filterRow.querySelectorAll('[data-order-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        filterRow.querySelectorAll('[data-order-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.orderFilter);
      });
    });
  }

  // Tracking timeline toggle
  list.querySelectorAll('[data-tracking-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.order-card');
      if (!card) return;
      card.classList.toggle('tracking-open');
    });
  });

  // Buy again — add product to cart by product name lookup
  list.querySelectorAll('[data-buy-again]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.buyAgain;
      const product = TAMMIA_PRODUCTS.find(p => p.name === name);
      if (!product) {
        tammiaToast('Produk tidak ditemukan di katalog.', 'bi-exclamation-triangle-fill');
        return;
      }
      addToCart({
        name: product.name,
        brand: product.brand,
        price: product.price,
        was: product.was || null,
        svg: product.svg,
      });
      tammiaToast('Ditambahkan ke keranjang', 'bi-bag-check-fill');
      const drawer = document.getElementById('cartDrawer');
      const bd = document.getElementById('drawerBackdrop');
      if (drawer) drawer.classList.add('open');
      if (bd) bd.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Initial: show all
  applyFilter('all');
}
