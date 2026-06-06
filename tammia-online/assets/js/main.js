/* ============================================================
   TAMMIA ONLINE — Main JS
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
});
