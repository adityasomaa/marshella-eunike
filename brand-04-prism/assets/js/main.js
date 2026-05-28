/* ====================================================
   PRISM — HOLOGRAPHIC BEAUTY · MAIN.JS
   ==================================================== */

(function () {
  'use strict';

  /* ============ BACKGROUND CANVAS — iridescent orbs ============ */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    const orbColors = [
      ['#d8b4ff', '#94c2ff'],
      ['#ffb4d6', '#d8b4ff'],
      ['#94c2ff', '#b4ffe8'],
      ['#b4ffe8', '#ffb4d6'],
      ['#d8b4ff', '#ffb4d6']
    ];
    const orbs = [];

    function buildOrbs() {
      orbs.length = 0;
      const count = window.innerWidth < 768 ? 3 : 5;
      for (let i = 0; i < count; i++) {
        orbs.push({
          x: Math.random() * W,
          y: Math.random() * H,
          tx: Math.random() * W,
          ty: Math.random() * H,
          r: 220 + Math.random() * 280,
          c: orbColors[i % orbColors.length],
          phase: Math.random() * Math.PI * 2,
          speed: 0.0004 + Math.random() * 0.0006,
          mouseAffinity: 0.05 + Math.random() * 0.08
        });
      }
    }

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildOrbs();
    }

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    window.addEventListener('mousemove', (e) => {
      mouse.tx = e.clientX; mouse.ty = e.clientY;
    });
    window.addEventListener('resize', resize);
    resize();

    function lerp(a, b, t) { return a + (b - a) * t; }

    function render(t) {
      // background fill
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#0d0d12';
      ctx.fillRect(0, 0, W, H);

      // spring mouse
      mouse.x = lerp(mouse.x, mouse.tx, 0.18);
      mouse.y = lerp(mouse.y, mouse.ty, 0.18);

      ctx.globalCompositeOperation = 'screen';

      orbs.forEach((o, i) => {
        // drift along sine path
        o.phase += o.speed;
        const baseTx = (W * 0.5) + Math.cos(o.phase + i) * (W * 0.35);
        const baseTy = (H * 0.5) + Math.sin(o.phase * 1.3 + i * 0.7) * (H * 0.35);

        // mouse pull (only nearest few)
        const dx = mouse.x - o.x;
        const dy = mouse.y - o.y;
        const dist = Math.hypot(dx, dy);
        const pull = Math.max(0, 1 - dist / 500) * o.mouseAffinity;
        const targetX = baseTx + dx * pull;
        const targetY = baseTy + dy * pull;

        // spring/damped follow
        o.tx = lerp(o.tx, targetX, 0.04);
        o.ty = lerp(o.ty, targetY, 0.04);
        o.x = lerp(o.x, o.tx, 0.06);
        o.y = lerp(o.y, o.ty, 0.06);

        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, o.c[0] + '88');
        grad.addColorStop(0.5, o.c[1] + '44');
        grad.addColorStop(1, '#0d0d1200');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  /* ============ CUSTOM CURSOR ============ */
  const cRing = document.querySelector('.cursor-ring');
  const cDot = document.querySelector('.cursor-dot');
  if (cRing && cDot && window.innerWidth >= 992) {
    let rx = -50, ry = -50, dx = -50, dy = -50, tx = -50, ty = -50;
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    function tick() {
      dx += (tx - dx) * 0.85; dy += (ty - dy) * 0.85;
      rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
      cDot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      cRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    tick();

    document.querySelectorAll('a, button, .chip, .swatch-big, .gallery-cell, .drop-card, .product-card, .faq-item, .product-thumb, .pay-card, .toggle-switch, .cstep').forEach(el => {
      el.addEventListener('mouseenter', () => cRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cRing.classList.remove('hover'));
    });
  }

  /* ============ MAGNETIC BUTTONS ============ */
  document.querySelectorAll('.btn-prism, .cart-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ============ NAV SCROLL ============ */
  const nav = document.querySelector('.navbar-prism');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    });
  }
  const menuBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  /* ============ TILT ON PRODUCT CARDS ============ */
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ============ LIVE COUNTDOWN ============ */
  const liveTimers = document.querySelectorAll('[data-countdown]');
  if (liveTimers.length) {
    let s = 4 * 3600 + 23 * 60 + 11;
    setInterval(() => {
      s = s > 0 ? s - 1 : 0;
      const hh = String(Math.floor(s / 3600)).padStart(2, '0');
      const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      const ss = String(s % 60).padStart(2, '0');
      liveTimers.forEach(el => { el.textContent = `${hh}:${mm}:${ss}`; });
    }, 1000);
  }

  /* ============ SCRAMBLE REVEAL ============ */
  const scrambleChars = '!<>-_\\/[]{}—=+*^?#0123456789';
  function scramble(el, finalText, duration = 1200) {
    const len = finalText.length;
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      let out = '';
      for (let i = 0; i < len; i++) {
        const reveal = i / len;
        if (t > reveal) out += finalText[i];
        else out += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const finalText = el.getAttribute('data-scramble');
    let triggered = false;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting && !triggered) {
          triggered = true;
          scramble(el, finalText, 1400);
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
  });

  /* ============ GSAP REVEALS ============ */
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('[data-reveal]').forEach((el, i) => {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        delay: (i % 4) * 0.05
      });
    });

    gsap.utils.toArray('[data-fade]').forEach(el => {
      gsap.from(el, {
        opacity: 0, duration: 1.2, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    // hero entrance
    const heroT = document.querySelector('.hero-title');
    if (heroT) {
      gsap.from('.hero-title .row-1', { y: 80, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.1 });
      gsap.from('.hero-title .row-2', { y: 80, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.25 });
      gsap.from('.hero-top, .hero-bottom > *', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.6 });
    }
  }

  /* ============ FAQ ACCORDION ============ */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });

  /* ============ SWATCH PICKER (product page) ============ */
  const heroBox = document.querySelector('.product-hero');
  if (heroBox) {
    const swatches = document.querySelectorAll('.swatch-big');
    swatches.forEach(sw => {
      sw.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
        const grad = sw.getAttribute('data-grad');
        if (grad) heroBox.style.background = grad;
      });
    });
  }

  /* ============ FINISH TOGGLE ============ */
  document.querySelectorAll('.finish-toggle').forEach(group => {
    group.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  /* ============ QTY STEPPERS ============ */
  document.querySelectorAll('.qty-stepper').forEach(stp => {
    const minus = stp.querySelector('[data-minus]');
    const plus = stp.querySelector('[data-plus]');
    const val = stp.querySelector('span');
    if (minus && plus && val) {
      minus.addEventListener('click', () => { let n = parseInt(val.textContent); if (n > 1) val.textContent = n - 1; });
      plus.addEventListener('click', () => { let n = parseInt(val.textContent); val.textContent = n + 1; });
    }
  });

  /* ============ FILTER CHIPS ============ */
  document.querySelectorAll('.chip-row').forEach(row => {
    row.querySelectorAll('.chip').forEach(c => {
      c.addEventListener('click', () => {
        row.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
      });
    });
  });

  /* ============ CART / CONFETTI ============ */
  const giftCheck = document.getElementById('gift-wrap');
  if (giftCheck) {
    giftCheck.addEventListener('change', () => {
      if (giftCheck.checked) launchConfetti();
    });
  }
  function launchConfetti() {
    const palette = ['#d8b4ff', '#94c2ff', '#ffb4d6', '#b4ffe8', '#f0f0f5'];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.background = palette[Math.floor(Math.random() * palette.length)];
      p.style.left = (50 + (Math.random() - 0.5) * 30) + '%';
      p.style.top = '40%';
      document.body.appendChild(p);
      const angle = Math.random() * Math.PI * 2;
      const dist = 200 + Math.random() * 300;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist + 150;
      if (window.gsap) {
        gsap.to(p, {
          x, y, rotation: Math.random() * 720, opacity: 0,
          duration: 1.5, ease: 'power2.out',
          onComplete: () => p.remove()
        });
      } else {
        p.style.transition = 'transform 1.4s ease-out, opacity 1.4s ease-out';
        p.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random()*720}deg)`;
        p.style.opacity = 0;
        setTimeout(() => p.remove(), 1500);
      }
    }
  }

  /* ============ CHECKOUT STEPS ============ */
  document.querySelectorAll('.cstep').forEach((step, i) => {
    step.addEventListener('click', () => {
      goToStep(i);
    });
  });
  document.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => {
    const cur = document.querySelector('.cstep.active');
    if (!cur) return;
    const idx = Array.from(cur.parentNode.children).indexOf(cur);
    goToStep(Math.min(idx + 1, 3));
  }));
  document.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => {
    const cur = document.querySelector('.cstep.active');
    if (!cur) return;
    const idx = Array.from(cur.parentNode.children).indexOf(cur);
    goToStep(Math.max(idx - 1, 0));
  }));
  function goToStep(i) {
    const steps = document.querySelectorAll('.cstep');
    const sections = document.querySelectorAll('.checkout-section');
    steps.forEach((s, j) => {
      s.classList.toggle('active', j === i);
      s.classList.toggle('done', j < i);
    });
    sections.forEach((sec, j) => sec.classList.toggle('active', j === i));
  }

  /* ============ TOGGLE SWITCH ============ */
  document.querySelectorAll('.toggle-switch').forEach(t => {
    t.addEventListener('click', () => t.classList.toggle('on'));
  });

  /* ============ PAY CARDS ============ */
  document.querySelectorAll('.pay-options').forEach(group => {
    group.querySelectorAll('.pay-card').forEach(c => {
      c.addEventListener('click', () => {
        group.querySelectorAll('.pay-card').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
      });
    });
  });

})();
