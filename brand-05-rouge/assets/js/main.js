/* ============================================
   ROUGE — Editorial Motion + Interactivity
   ============================================ */

(function () {
  'use strict';

  /* ---------- 1. Canvas distortion grid ---------- */
  const canvas = document.getElementById('bg-canvas');
  let ctx, dots = [], mouse = { x: -9999, y: -9999 };
  const SPACING = 18;
  const RADIUS = 180;
  const PUSH = 12;

  function initCanvas() {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    buildDots();
    requestAnimationFrame(drawDots);
  }

  function resizeCanvas() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildDots();
  }

  function buildDots() {
    dots = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let x = 0; x <= w; x += SPACING) {
      for (let y = 0; y <= h; y += SPACING) {
        dots.push({ x: x, y: y, ox: x, oy: y });
      }
    }
  }

  function drawDots() {
    if (!ctx) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      const dx = d.ox - mouse.x;
      const dy = d.oy - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        const force = (1 - dist / RADIUS);
        const angle = Math.atan2(dy, dx);
        const tx = d.ox + Math.cos(angle) * force * PUSH;
        const ty = d.oy + Math.sin(angle) * force * PUSH;
        d.x += (tx - d.x) * 0.18;
        d.y += (ty - d.y) * 0.18;
        ctx.fillStyle = 'rgba(196, 30, 58, ' + (0.08 + force * 0.4) + ')';
      } else {
        d.x += (d.ox - d.x) * 0.08;
        d.y += (d.oy - d.y) * 0.08;
        ctx.fillStyle = 'rgba(26, 26, 26, 0.10)';
      }

      ctx.beginPath();
      ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(drawDots);
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', function () {
    mouse.x = -9999; mouse.y = -9999;
  });

  /* ---------- 2. Navbar scroll effect ---------- */
  const navbar = document.querySelector('.navbar-rouge');
  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ---------- 3. Hero headline character split + reveal ---------- */
  function splitChars() {
    const targets = document.querySelectorAll('[data-split]');
    targets.forEach(function (el) {
      const text = el.textContent;
      el.innerHTML = '';
      const words = text.split(' ');
      words.forEach(function (word, wi) {
        const wrap = document.createElement('span');
        wrap.style.display = 'inline-block';
        wrap.style.whiteSpace = 'nowrap';
        for (let i = 0; i < word.length; i++) {
          const c = document.createElement('span');
          c.className = 'char';
          c.textContent = word[i];
          wrap.appendChild(c);
        }
        el.appendChild(wrap);
        if (wi < words.length - 1) {
          el.appendChild(document.createTextNode(' '));
        }
      });
    });
  }

  function animateChars() {
    if (typeof gsap === 'undefined') return;
    gsap.to('[data-split] .char', {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.018,
      delay: 0.2,
    });
  }

  /* ---------- 4. Fade-up on scroll ---------- */
  function setupFadeUp() {
    const els = document.querySelectorAll('.fade-up');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- 5. Page number indicator (scroll-based) ---------- */
  function setupPageNumber() {
    const indicator = document.querySelector('.page-number .num');
    if (!indicator) return;
    const sections = document.querySelectorAll('[data-page]');
    if (!sections.length) return;

    function update() {
      let current = sections[0].dataset.page;
      const y = window.scrollY + window.innerHeight / 3;
      sections.forEach(function (s) {
        if (s.offsetTop <= y) current = s.dataset.page;
      });
      indicator.textContent = current;
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------- 6. Cart drawer ---------- */
  function setupCartDrawer() {
    const openers = document.querySelectorAll('[data-open-cart]');
    const drawer = document.querySelector('.cart-drawer');
    const backdrop = document.querySelector('.cart-drawer-backdrop');
    const closers = document.querySelectorAll('[data-close-cart]');

    function open(e) {
      if (e) e.preventDefault();
      if (drawer) drawer.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      if (drawer) drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    openers.forEach(function (o) { o.addEventListener('click', open); });
    closers.forEach(function (c) { c.addEventListener('click', close); });
    if (backdrop) backdrop.addEventListener('click', close);
  }

  /* ---------- 7. Quantity steppers ---------- */
  function setupSteppers() {
    document.querySelectorAll('.qty-stepper').forEach(function (s) {
      const input = s.querySelector('input');
      const minus = s.querySelector('[data-qty="minus"]');
      const plus = s.querySelector('[data-qty="plus"]');
      if (!input) return;
      if (minus) minus.addEventListener('click', function () {
        const v = Math.max(1, parseInt(input.value || '1', 10) - 1);
        input.value = v;
      });
      if (plus) plus.addEventListener('click', function () {
        const v = parseInt(input.value || '1', 10) + 1;
        input.value = v;
      });
    });
  }

  /* ---------- 8. Shade swatch picker ---------- */
  function setupShadePicker() {
    const picker = document.querySelector('.shade-picker');
    if (!picker) return;
    const swatches = picker.querySelectorAll('.shade-swatch');
    const label = document.querySelector('[data-shade-label]');
    swatches.forEach(function (s) {
      s.addEventListener('click', function () {
        swatches.forEach(function (x) { x.classList.remove('active'); });
        s.classList.add('active');
        if (label) label.textContent = s.dataset.shade || '';
      });
    });
  }

  /* ---------- 9. Detail tabs (product page) ---------- */
  function setupDetailTabs() {
    document.querySelectorAll('.detail-tab-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const body = btn.nextElementSibling;
        if (!body) return;
        body.classList.toggle('open');
        const icon = btn.querySelector('.toggle-icon');
        if (icon) icon.textContent = body.classList.contains('open') ? '−' : '+';
      });
    });
  }

  /* ---------- 10. FAQ accordion ---------- */
  function setupFAQ() {
    document.querySelectorAll('.faq-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const body = btn.nextElementSibling;
        if (!body) return;
        body.classList.toggle('open');
        const icon = btn.querySelector('.icon');
        if (icon) icon.textContent = body.classList.contains('open') ? '−' : '+';
      });
    });
  }

  /* ---------- 11. Gift wrap toggle ---------- */
  function setupGiftToggle() {
    document.querySelectorAll('.gift-toggle .switch').forEach(function (sw) {
      sw.addEventListener('click', function () { sw.classList.toggle('on'); });
    });
  }

  /* ---------- 12. Payment method radio styling ---------- */
  function setupPaymentMethods() {
    const methods = document.querySelectorAll('.payment-method');
    methods.forEach(function (m) {
      m.addEventListener('click', function () {
        methods.forEach(function (x) { x.classList.remove('selected'); });
        m.classList.add('selected');
        const r = m.querySelector('input[type=radio]');
        if (r) r.checked = true;
      });
    });
  }

  /* ---------- 13. Marquee text duplication ---------- */
  function setupMarquees() {
    document.querySelectorAll('.marquee-bg .marquee-inner').forEach(function (m) {
      const original = m.innerHTML;
      m.innerHTML = original + original;
    });
  }

  /* ---------- 14. Active nav link ---------- */
  function highlightActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link-rouge').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === path) link.classList.add('active');
    });
  }

  /* ---------- 15. ScrollTrigger fade for sections (if GSAP available) ---------- */
  function setupScrollTriggers() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    /* Parallax hero image */
    gsap.utils.toArray('[data-parallax]').forEach(function (el) {
      gsap.to(el, {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initCanvas();
    setupMarquees();
    splitChars();
    animateChars();
    setupFadeUp();
    setupPageNumber();
    setupCartDrawer();
    setupSteppers();
    setupShadePicker();
    setupDetailTabs();
    setupFAQ();
    setupGiftToggle();
    setupPaymentMethods();
    highlightActiveNav();
    setupScrollTriggers();
    handleScroll();
  });
})();
