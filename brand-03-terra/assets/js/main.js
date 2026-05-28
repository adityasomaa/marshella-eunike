/* ============================================
   TERRA BOTANICA — main.js
   Canvas BG (leaves), cursor, animations, interactions
   ============================================ */

(function () {
  'use strict';

  /* ---------- Canvas Botanical Background ---------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr = window.devicePixelRatio || 1;
    const leaves = [];
    const COUNT = window.innerWidth < 768 ? 26 : 44;
    const COLORS = ['#6b7a4f', '#87794e', '#c4956c', '#2d3b2c'];
    let mouse = { x: -9999, y: -9999, active: false };

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function createLeaf() {
      const size = rand(8, 28);
      return {
        x: rand(0, w),
        y: rand(0, h),
        size: size,
        baseSize: size,
        angle: rand(0, Math.PI * 2),
        rotSpeed: rand(-0.012, 0.012),
        swaySpeed: rand(0.0015, 0.004),
        swayAmp: rand(0.4, 1.2),
        swayPhase: rand(0, Math.PI * 2),
        vx: rand(-0.12, 0.12),
        vy: rand(-0.25, -0.06),
        alpha: rand(0.3, 0.8),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: Math.random() > 0.55 ? 'leaf' : 'spore',
      };
    }

    function init() {
      resize();
      leaves.length = 0;
      for (let i = 0; i < COUNT; i++) leaves.push(createLeaf());
    }

    function drawLeaf(l) {
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.angle);
      ctx.globalAlpha = l.alpha;

      if (l.shape === 'leaf') {
        // Organic leaf blob using bezier
        ctx.beginPath();
        ctx.moveTo(0, -l.size);
        ctx.bezierCurveTo(l.size * 0.7, -l.size * 0.7, l.size * 0.7, l.size * 0.7, 0, l.size);
        ctx.bezierCurveTo(-l.size * 0.7, l.size * 0.7, -l.size * 0.7, -l.size * 0.7, 0, -l.size);
        ctx.closePath();
        ctx.fillStyle = l.color;
        ctx.fill();

        // Central vein
        ctx.beginPath();
        ctx.moveTo(0, -l.size);
        ctx.lineTo(0, l.size);
        ctx.strokeStyle = 'rgba(26,33,24,0.18)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      } else {
        // Spore particle with gradient feel
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, l.size);
        grad.addColorStop(0, l.color);
        grad.addColorStop(0.6, l.color + '88');
        grad.addColorStop(1, l.color + '00');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, l.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function update(t) {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < leaves.length; i++) {
        const l = leaves[i];

        // Sine sway
        const sway = Math.sin(t * l.swaySpeed + l.swayPhase) * l.swayAmp;

        l.x += l.vx + sway * 0.15;
        l.y += l.vy;
        l.angle += l.rotSpeed;

        // Mouse swirl interaction
        if (mouse.active) {
          const dx = l.x - mouse.x;
          const dy = l.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 250) {
            const force = (250 - dist) / 250;
            // Perpendicular vector for swirl
            const perpX = -dy / (dist || 1);
            const perpY = dx / (dist || 1);
            l.x += perpX * force * 1.3;
            l.y += perpY * force * 1.3;
            l.angle += force * 0.04;
          }
        }

        // Wrap around screen
        if (l.x < -50) l.x = w + 50;
        if (l.x > w + 50) l.x = -50;
        if (l.y < -50) l.y = h + 50;
        if (l.y > h + 50) l.y = -50;

        drawLeaf(l);
      }
    }

    function loop(t) {
      update(t);
      requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => {
      resize();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    window.addEventListener('mouseout', () => { mouse.active = false; });

    init();
    requestAnimationFrame(loop);
  }

  /* ---------- Custom Cursor (desktop only) ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'tb-cursor';
    cursor.innerHTML = `
      <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 2 C 14 5, 14 15, 10 18 C 6 15, 6 5, 10 2 Z" fill="#6b7a4f" opacity="0.85"/>
        <path d="M10 2 L 10 18" stroke="#2d3b2c" stroke-width="0.4"/>
      </svg>`;
    document.body.appendChild(cursor);

    let cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
    });
    function tick() {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      cursor.style.transform = `translate(${cx - 9}px, ${cy - 9}px) rotate(${Math.sin(Date.now() * 0.001) * 8}deg)`;
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.querySelector('.tb-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  /* ---------- Fade in on scroll (IntersectionObserver) ---------- */
  const fadeEls = document.querySelectorAll('[data-fade]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    fadeEls.forEach((el) => io.observe(el));
  } else {
    fadeEls.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Counter animation ---------- */
  function animateCounter(el, target, duration = 2200, decimals = 0) {
    const start = performance.now();
    const initial = 0;
    function step(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - t, 3);
      const val = initial + (target - initial) * ease;
      el.textContent = decimals > 0
        ? val.toFixed(decimals)
        : Math.floor(val).toLocaleString('id-ID');
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const t = parseFloat(e.target.dataset.counter);
          const dec = parseInt(e.target.dataset.dec || '0', 10);
          animateCounter(e.target, t, 2200, dec);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.45 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------- Ingredient deck accordions (product page) ---------- */
  document.querySelectorAll('.ingredient-deck-item').forEach((item) => {
    item.querySelector('.head').addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    item.querySelector('.q').addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });

  /* ---------- Cart drawer ---------- */
  const openCartBtns = document.querySelectorAll('[data-open-cart]');
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  const closeBtn = document.getElementById('cart-close');

  function openDrawer() {
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openCartBtns.forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  }));
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  /* ---------- Qty steppers ---------- */
  document.querySelectorAll('.qty-stepper').forEach((stepper) => {
    const input = stepper.querySelector('input');
    const minus = stepper.querySelector('[data-qty="minus"]');
    const plus = stepper.querySelector('[data-qty="plus"]');
    if (minus) minus.addEventListener('click', () => {
      const v = Math.max(1, parseInt(input.value, 10) - 1);
      input.value = v;
    });
    if (plus) plus.addEventListener('click', () => {
      input.value = parseInt(input.value, 10) + 1;
    });
  });

  /* ---------- Eco toggle (cart) ---------- */
  document.querySelectorAll('.eco-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      const tree = toggle.querySelector('.tree-visual');
      if (tree && toggle.classList.contains('active')) {
        const count = parseInt(tree.dataset.count || '0', 10);
        if (!tree.dataset.populated) {
          tree.innerHTML = '';
          for (let i = 0; i < 8; i++) {
            const t = document.createElement('div');
            t.style.cssText = `
              display:inline-block; width:14px; height:30px;
              margin-right:6px; background:linear-gradient(to top, #87794e 0%, #6b7a4f 60%, #2d3b2c 100%);
              clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
              opacity:0; transform:translateY(10px);
              transition: opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms;
            `;
            tree.appendChild(t);
            requestAnimationFrame(() => {
              t.style.opacity = '1';
              t.style.transform = 'translateY(0)';
            });
          }
          tree.dataset.populated = '1';
        }
      }
    });
  });

  /* ---------- Checkout steps ---------- */
  document.querySelectorAll('.checkout-step').forEach((step, idx, all) => {
    step.addEventListener('click', () => {
      all.forEach((s, i) => {
        s.classList.toggle('active', i === idx);
        s.classList.toggle('done', i < idx);
      });
      document.querySelectorAll('[data-checkout-panel]').forEach((p, i) => {
        p.style.display = i === idx ? '' : 'none';
      });
    });
  });

  /* ---------- Shipping option select ---------- */
  document.querySelectorAll('.shipping-option').forEach((opt) => {
    opt.addEventListener('click', () => {
      opt.parentElement.querySelectorAll('.shipping-option').forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  /* ---------- GSAP scroll-triggered SVG path draw + hero entrance ---------- */
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const heroEls = document.querySelectorAll('[data-hero-anim]');
    if (heroEls.length) {
      gsap.from(heroEls, {
        y: 40,
        opacity: 0,
        duration: 1.4,
        stagger: 0.12,
        ease: 'power3.out',
      });
    }

    // SVG draw animations
    document.querySelectorAll('.svg-draw path').forEach((path) => {
      const length = path.getTotalLength ? path.getTotalLength() : 1000;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: path.closest('.svg-draw'),
          start: 'top 80%',
        },
      });
    });

    // Subtle parallax on hero art
    const heroArt = document.querySelector('.hero-art');
    if (heroArt) {
      gsap.to(heroArt, {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: heroArt,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
  }

  /* ---------- Currency formatter helper ---------- */
  window.formatIDR = function (v) {
    return 'Rp ' + Math.round(v).toLocaleString('id-ID');
  };

})();
