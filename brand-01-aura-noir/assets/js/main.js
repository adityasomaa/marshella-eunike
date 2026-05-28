/* ============================================================
   AURA NOIR — Interactive scripts
   Canvas particle BG, GSAP reveals, magnetic CTAs, cart drawer
   ============================================================ */

/* ---------- 1. Animated background canvas ---------- */
(function initParticleBG(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, particles = [];
  const mouse = { x: -1000, y: -1000, active: false };
  const PARTICLE_COUNT = window.innerWidth < 768 ? 36 : 70;
  const MAX_DIST = 130;

  function resize(){
    w = canvas.width = window.innerWidth * window.devicePixelRatio;
    h = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function Particle(){
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.r = Math.random() * 2 + 1;
    this.baseOpacity = Math.random() * 0.6 + 0.2;
    this.opacity = this.baseOpacity;
  }
  Particle.prototype.update = function(){
    // mouse attraction
    if (mouse.active) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 180) {
        const force = (180 - dist) / 180;
        this.vx += (dx / dist) * force * 0.04;
        this.vy += (dy / dist) * force * 0.04;
      }
    }
    // friction
    this.vx *= 0.985;
    this.vy *= 0.985;
    // gentle drift baseline
    this.vx += (Math.random() - 0.5) * 0.01;
    this.vy += (Math.random() - 0.5) * 0.01;

    this.x += this.vx;
    this.y += this.vy;

    // wrap
    if (this.x < 0) this.x = window.innerWidth;
    if (this.x > window.innerWidth) this.x = 0;
    if (this.y < 0) this.y = window.innerHeight;
    if (this.y > window.innerHeight) this.y = 0;
  };
  Particle.prototype.draw = function(){
    ctx.beginPath();
    ctx.fillStyle = 'rgba(212, 175, 122, ' + this.opacity + ')';
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  };

  function connect(){
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(212, 175, 122, ' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate(){
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(animate);
  }

  function init(){
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
    animate();
  }

  window.addEventListener('resize', () => {
    resize();
  });
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  window.addEventListener('mouseleave', () => mouse.active = false);

  init();
})();

/* ---------- 2. Navbar shrink ---------- */
(function navShrink(){
  const nav = document.querySelector('.navbar-aura');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) nav.classList.add('shrink');
    else nav.classList.remove('shrink');
  });
})();

/* ---------- 3. Mobile menu ---------- */
(function mobileMenu(){
  const toggle = document.querySelector('.mobile-nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
})();

/* ---------- 4. Magnetic cursor effect on .magnetic ---------- */
(function magnetic(){
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
})();

/* ---------- 5. GSAP reveals ---------- */
(function gsapReveals(){
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero headline letter reveal
  const headline = document.querySelector('.hero-headline');
  if (headline) {
    const text = headline.textContent.trim();
    headline.innerHTML = '';
    text.split(' ').forEach((word, wi) => {
      const wEl = document.createElement('span');
      wEl.className = 'word';
      word.split('').forEach(ch => {
        const cEl = document.createElement('span');
        cEl.className = 'char';
        cEl.textContent = ch;
        wEl.appendChild(cEl);
      });
      headline.appendChild(wEl);
    });
    gsap.to('.hero-headline .char', {
      opacity: 1, y: 0, duration: 1.1, ease: 'expo.out',
      stagger: 0.025, delay: 0.25
    });
  }

  // Generic reveals
  gsap.utils.toArray('.reveal-up').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
  gsap.utils.toArray('.reveal-fade').forEach(el => {
    gsap.to(el, {
      opacity: 1, duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });

  // Line dividers
  gsap.utils.toArray('.line-divider').forEach(line => {
    gsap.to(line.querySelector(':scope::after') || line, {});
    gsap.fromTo(line, { '--draw': 0 }, {
      scrollTrigger: { trigger: line, start: 'top 90%' },
      duration: 1.4, ease: 'expo.inOut',
      onStart: () => {
        const after = document.createElement('style');
        after.textContent = `.line-divider.draw::after{transform:scaleX(1);transition:transform 1.5s cubic-bezier(.65,0,.35,1)}`;
        if (!document.head.querySelector('style[data-line]')) {
          after.setAttribute('data-line', '1');
          document.head.appendChild(after);
        }
        line.classList.add('draw');
      }
    });
  });

  // Counters
  gsap.utils.toArray('.counter').forEach(el => {
    const end = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const counter = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: end, duration: 2.2, ease: 'expo.out',
          onUpdate: () => {
            el.textContent = Math.round(counter.val).toLocaleString('id-ID') + suffix;
          }
        });
      }
    });
  });
})();

/* ---------- 6. Cart drawer ---------- */
(function cartDrawer(){
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const openers = document.querySelectorAll('[data-open-cart]');
  const closers = document.querySelectorAll('[data-close-cart]');
  if (!drawer) return;
  const open = () => { drawer.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; };
  openers.forEach(b => b.addEventListener('click', e => { e.preventDefault(); open(); }));
  closers.forEach(b => b.addEventListener('click', close));
  if (overlay) overlay.addEventListener('click', close);

  // Cart badge counter increments on add-to-bag
  document.querySelectorAll('[data-add-to-bag]').forEach(b => {
    b.addEventListener('click', e => {
      e.preventDefault();
      const badge = document.querySelector('.icon-btn .badge-count');
      if (badge) badge.textContent = parseInt(badge.textContent || '0', 10) + 1;
      open();
    });
  });
})();

/* ---------- 7. Accordion ---------- */
(function accordions(){
  document.querySelectorAll('.accordion-aura').forEach(acc => {
    acc.querySelectorAll('.acc-item').forEach(item => {
      const head = item.querySelector('.acc-head');
      head.addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        acc.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    });
  });
})();

/* ---------- 8. Quantity controls ---------- */
(function qty(){
  document.querySelectorAll('.quantity-control').forEach(ctrl => {
    const input = ctrl.querySelector('input');
    const dec = ctrl.querySelector('.qty-dec');
    const inc = ctrl.querySelector('.qty-inc');
    if (dec) dec.addEventListener('click', () => {
      const v = parseInt(input.value, 10) || 1;
      if (v > 1) input.value = v - 1;
    });
    if (inc) inc.addEventListener('click', () => {
      const v = parseInt(input.value, 10) || 1;
      input.value = v + 1;
    });
  });
})();

/* ---------- 9. Radio cards ---------- */
(function radioCards(){
  document.querySelectorAll('.radio-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('input').name;
      document.querySelectorAll(`.radio-card input[name="${name}"]`).forEach(i => {
        i.closest('.radio-card').classList.remove('checked');
      });
      card.classList.add('checked');
      card.querySelector('input').checked = true;
    });
  });
  // pre-check first ones
  document.querySelectorAll('input[type="radio"]:checked').forEach(i => {
    i.closest('.radio-card')?.classList.add('checked');
  });
})();

/* ---------- 10. Checkout step toggle (single-page multi-step demo) ---------- */
(function checkoutSteps(){
  const next = document.querySelectorAll('[data-step-next]');
  next.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const target = btn.dataset.stepNext;
      document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.checkout-block').forEach(b => b.style.display = 'none');
      const stepNode = document.querySelector(`.checkout-step[data-step="${target}"]`);
      const blockNode = document.querySelector(`.checkout-block[data-step="${target}"]`);
      if (stepNode) stepNode.classList.add('active');
      if (blockNode) blockNode.style.display = 'block';
      window.scrollTo({ top: 200, behavior: 'smooth' });

      // mark prior steps done
      const order = ['shipping','payment','review'];
      const idx = order.indexOf(target);
      order.slice(0, idx).forEach(s => {
        document.querySelector(`.checkout-step[data-step="${s}"]`)?.classList.add('done');
      });
    });
  });
})();

/* ---------- 11. Product detail thumb swap (visual only) ---------- */
(function detailThumbs(){
  const thumbs = document.querySelectorAll('.thumb-list .thumb');
  thumbs.forEach(t => {
    t.addEventListener('click', () => {
      thumbs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
    });
  });
})();

/* ---------- 12. Testimonial dots (visual only) ---------- */
(function testiDots(){
  const dots = document.querySelectorAll('.testimonial-dots span');
  dots.forEach((d, i) => {
    d.addEventListener('click', () => {
      dots.forEach(x => x.classList.remove('active'));
      d.classList.add('active');
    });
  });
})();
