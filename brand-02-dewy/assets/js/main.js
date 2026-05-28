/* ===========================================
   DEWY — main.js
   Canvas bubbles, GSAP reveals, cart, toasts, BA slider
   =========================================== */

/* ===========================================
   1. Bubble background canvas
   =========================================== */
(function bubbleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  let bubbles = [];
  const mouse = { x: -1000, y: -1000, active: false };

  function resize() {
    W = canvas.width = window.innerWidth * window.devicePixelRatio;
    H = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function createBubbles(count) {
    bubbles = [];
    const w = window.innerWidth, h = window.innerHeight;
    for (let i = 0; i < count; i++) {
      bubbles.push({
        x: Math.random() * w,
        y: Math.random() * h + h * 0.2,
        r: 30 + Math.random() * 90,
        vy: -(0.15 + Math.random() * 0.4),
        vx: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.001 + Math.random() * 0.002,
        amp: 0.3 + Math.random() * 0.7,
        alpha: 0.25 + Math.random() * 0.45,
        color: pickColor(),
        pushX: 0,
        pushY: 0
      });
    }
  }

  function pickColor() {
    const palette = [
      [255, 217, 196],  // peach
      [255, 181, 181],  // pink
      [247, 138, 161],  // rose
      [255, 234, 219]   // cream
    ];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  function draw() {
    const w = window.innerWidth, h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    bubbles.forEach(b => {
      // sine drift
      b.phase += b.speed * 16;
      b.vx = Math.sin(b.phase) * b.amp;

      // mouse repulsion
      const dx = b.x - mouse.x;
      const dy = b.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200 && dist > 0) {
        const force = (200 - dist) / 200;
        b.pushX += (dx / dist) * force * 4;
        b.pushY += (dy / dist) * force * 4;
      }

      // decay push
      b.pushX *= 0.92;
      b.pushY *= 0.92;

      b.x += b.vx + b.pushX;
      b.y += b.vy + b.pushY;

      // wrap
      if (b.y + b.r < 0) {
        b.y = h + b.r;
        b.x = Math.random() * w;
      }
      if (b.x < -b.r) b.x = w + b.r;
      if (b.x > w + b.r) b.x = -b.r;

      // radial gradient bubble
      const g = ctx.createRadialGradient(
        b.x - b.r * 0.25, b.y - b.r * 0.3, b.r * 0.1,
        b.x, b.y, b.r
      );
      const [r, gC, bC] = b.color;
      g.addColorStop(0, `rgba(255,255,255,${b.alpha * 0.9})`);
      g.addColorStop(0.4, `rgba(${r},${gC},${bC},${b.alpha * 0.6})`);
      g.addColorStop(1, `rgba(${r},${gC},${bC},0)`);

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  function onMouse(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }
  function onLeave() {
    mouse.x = -1000;
    mouse.y = -1000;
  }

  resize();
  const count = window.innerWidth < 600 ? 18 : 32;
  createBubbles(count);
  window.addEventListener('resize', () => { resize(); createBubbles(count); });
  window.addEventListener('mousemove', onMouse, { passive: true });
  window.addEventListener('mouseleave', onLeave);
  draw();
})();

/* ===========================================
   2. Navbar scroll blur
   =========================================== */
(function navScroll() {
  const nav = document.querySelector('.dewy-nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ===========================================
   3. GSAP hero letter reveal + section fades
   =========================================== */
window.addEventListener('load', () => {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  // Hero letter reveal
  document.querySelectorAll('[data-reveal-letters]').forEach(el => {
    const words = el.textContent.trim().split(' ');
    el.innerHTML = words.map(w => {
      const isAccent = w.startsWith('*');
      const clean = w.replace(/\*/g, '');
      const letters = clean.split('').map(l =>
        `<span class="hero-letter"${isAccent ? ' style="font-style:italic;color:var(--rose-deep)"' : ''}>${l === ' ' ? '&nbsp;' : l}</span>`
      ).join('');
      return `<span class="hero-word">${letters}</span>`;
    }).join(' ');

    gsap.to(el.querySelectorAll('.hero-letter'), {
      y: 0,
      duration: 0.9,
      stagger: 0.03,
      ease: 'power3.out',
      delay: 0.2
    });
  });

  // Fade-up sections
  document.querySelectorAll('[data-fade]').forEach(el => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
      }
    });
  });

  // Stagger children
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const kids = parent.children;
    gsap.from(kids, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: parent,
        start: 'top 85%',
      }
    });
  });

  // Floating droplets
  document.querySelectorAll('.dewy-drop').forEach((d, i) => {
    gsap.to(d, {
      y: -20 - Math.random() * 25,
      x: 10 - Math.random() * 20,
      duration: 4 + Math.random() * 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: i * 0.3
    });
  });

  // Step counter animation
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('id-ID'); }
    });
  });
});

/* ===========================================
   4. Before/After slider
   =========================================== */
(function baSlider() {
  const slider = document.querySelector('.ba-slider');
  if (!slider) return;
  const after = slider.querySelector('.ba-after');
  const handle = slider.querySelector('.ba-handle');
  const divider = slider.querySelector('.ba-divider');
  let dragging = false;

  function setPos(x) {
    const rect = slider.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    divider.style.left = pct + '%';
    handle.style.left = pct + '%';
  }

  const onDown = (e) => {
    dragging = true;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setPos(x);
  };
  const onMove = (e) => {
    if (!dragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setPos(x);
  };
  const onUp = () => { dragging = false; };

  slider.addEventListener('mousedown', onDown);
  slider.addEventListener('touchstart', onDown, { passive: true });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchend', onUp);
})();

/* ===========================================
   5. FAQ accordion
   =========================================== */
(function faq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
})();

/* ===========================================
   6. Cart drawer + toast + confetti
   =========================================== */
(function cartLogic() {
  const drawer = document.querySelector('.cart-drawer');
  const backdrop = document.querySelector('.cart-drawer-backdrop');
  const openBtns = document.querySelectorAll('[data-open-cart]');
  const closeBtns = document.querySelectorAll('[data-close-cart]');

  openBtns.forEach(b => b.addEventListener('click', (e) => {
    e.preventDefault();
    if (drawer) drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
  }));
  closeBtns.forEach(b => b.addEventListener('click', () => {
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  }));
  if (backdrop) backdrop.addEventListener('click', () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
  });

  // toast
  function toast(msg) {
    let t = document.querySelector('.dewy-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'dewy-toast';
      t.innerHTML = `<span class="ic"><i class="bi bi-check-lg"></i></span><span class="msg"></span>`;
      document.body.appendChild(t);
    }
    t.querySelector('.msg').textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  // confetti
  function confetti(x, y) {
    const colors = ['#ffd9c4', '#ffb5b5', '#f78aa1', '#fff5ee'];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      const size = 6 + Math.random() * 10;
      p.style.width = p.style.height = size + 'px';
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(p);
      if (typeof gsap !== 'undefined') {
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 120;
        gsap.to(p, {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 30,
          opacity: 0,
          scale: 0.4,
          duration: 0.9 + Math.random() * 0.4,
          ease: 'power2.out',
          onComplete: () => p.remove()
        });
      } else {
        setTimeout(() => p.remove(), 1000);
      }
    }
  }

  // add to bag
  document.querySelectorAll('[data-add-bag]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const rect = btn.getBoundingClientRect();
      confetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      toast('Ditambahkan ke tas — yay!');

      // bump cart badge
      document.querySelectorAll('.cart-badge').forEach(b => {
        let n = parseInt(b.textContent) || 0;
        b.textContent = n + 1;
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(b, { scale: 1.4 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
        }
      });
    });
  });
})();

/* ===========================================
   7. Qty steppers
   =========================================== */
(function qty() {
  document.querySelectorAll('.qty-stepper').forEach(stepper => {
    const span = stepper.querySelector('span');
    const minus = stepper.querySelector('button.minus');
    const plus = stepper.querySelector('button.plus');
    if (!span || !minus || !plus) return;
    minus.addEventListener('click', () => {
      let v = parseInt(span.textContent) || 1;
      if (v > 1) span.textContent = v - 1;
    });
    plus.addEventListener('click', () => {
      let v = parseInt(span.textContent) || 1;
      span.textContent = v + 1;
    });
  });
})();

/* ===========================================
   8. Filter chips toggle (shop page)
   =========================================== */
(function chips() {
  document.querySelectorAll('[data-chip-group]').forEach(group => {
    group.querySelectorAll('.chip').forEach(c => {
      c.addEventListener('click', (e) => {
        e.preventDefault();
        group.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
      });
    });
  });
})();

/* ===========================================
   9. Gallery thumb switch (product page)
   =========================================== */
(function gallery() {
  const thumbs = document.querySelectorAll('.gallery-thumb');
  if (!thumbs.length) return;
  thumbs.forEach(t => {
    t.addEventListener('click', () => {
      thumbs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
    });
  });
})();

/* ===========================================
   10. Checkout step toggle (visual only)
   =========================================== */
(function checkout() {
  const steps = document.querySelectorAll('[data-step]');
  if (!steps.length) return;
  steps.forEach(s => {
    s.addEventListener('click', () => {
      document.querySelectorAll('.checkout-step').forEach(el => el.classList.remove('active'));
      const target = s.dataset.step;
      const node = document.querySelector(`.checkout-step[data-step-num="${target}"]`);
      if (node) node.classList.add('active');
    });
  });

  // payment select
  document.querySelectorAll('.pay-method').forEach(p => {
    p.addEventListener('click', () => {
      document.querySelectorAll('.pay-method').forEach(x => x.classList.remove('selected'));
      p.classList.add('selected');
    });
  });
})();
