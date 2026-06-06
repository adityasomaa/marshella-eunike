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
  function closeCart() {
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
  openCartBtns.forEach(b => b.addEventListener('click', e => { e.preventDefault(); openCart(); }));
  closeCartBtns.forEach(b => b.addEventListener('click', closeCart));
  if (backdrop) backdrop.addEventListener('click', closeCart);

  /* ---------- Quick-add buttons on product cards ---------- */
  document.querySelectorAll('.product-quick').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      openCart();
    });
  });

  /* ---------- Qty steppers ---------- */
  document.querySelectorAll('.qty-stepper').forEach(stepper => {
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

  /* ---------- Newsletter pretend submit ---------- */
  document.querySelectorAll('.newsletter-form, .footer-newsletter').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button');
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = 'Tersimpan ✓';
        btn.disabled = true;
        setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; form.reset(); }, 2200);
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
    let blurTimer = null;

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
      clearTimeout(blurTimer);
      if (input.value.trim()) renderResults(input.value);
    });

    input.addEventListener('blur', () => {
      blurTimer = setTimeout(() => {
        dropdown.classList.remove('open');
      }, 200);
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
      if (sortSelect) sortSelect.value = 'featured';
      applyFilters();
    }

    // Wire up changes
    sidebar.querySelectorAll('input[data-filter]').forEach(inp => {
      inp.addEventListener('change', applyFilters);
    });
    if (priceRange) priceRange.addEventListener('input', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
    if (saleToggle) {
      // Generic toggle-switch listener (registered earlier) flips the .on class first; we then re-filter.
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
});
