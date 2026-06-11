/**
 * @file
 * Tammia theme behaviors — DEWY design language.
 * Blob canvas background, navbar scroll state, reveal animations, qty steppers.
 */
(function (Drupal, once) {
  'use strict';

  /* ---------- DEWY blob canvas (Tammia brand tints) ---------- */
  Drupal.behaviors.tammiaBlobCanvas = {
    attach(context) {
      once('tammia-blob', '#bg-canvas', context).forEach((canvas) => {
        const ctx = canvas.getContext('2d');
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let bubbles = [];
        const mouse = { x: -1000, y: -1000 };

        function resize() {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = window.innerWidth * dpr;
          canvas.height = window.innerHeight * dpr;
          canvas.style.width = window.innerWidth + 'px';
          canvas.style.height = window.innerHeight + 'px';
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function pickColor() {
          const palette = [
            [240, 194, 196],
            [230, 207, 160],
            [248, 241, 226],
            [247, 222, 223],
            [235, 138, 143]
          ];
          return palette[Math.floor(Math.random() * palette.length)];
        }

        function createBubbles() {
          const w = window.innerWidth, h = window.innerHeight;
          const count = w < 768 ? 10 : 18;
          bubbles = [];
          for (let i = 0; i < count; i++) {
            bubbles.push({
              x: Math.random() * w,
              y: Math.random() * h + h * 0.2,
              r: 30 + Math.random() * 90,
              vy: -(0.12 + Math.random() * 0.35),
              vx: 0,
              phase: Math.random() * Math.PI * 2,
              speed: 0.001 + Math.random() * 0.002,
              amp: 0.3 + Math.random() * 0.7,
              alpha: 0.18 + Math.random() * 0.35,
              color: pickColor(),
              pushX: 0, pushY: 0
            });
          }
        }

        function draw() {
          const w = window.innerWidth, h = window.innerHeight;
          if (canvas.width === 0 && w > 0) { resize(); createBubbles(); }
          ctx.clearRect(0, 0, w, h);
          bubbles.forEach((b) => {
            b.phase += b.speed * 16;
            b.vx = Math.sin(b.phase) * b.amp;
            const dx = b.x - mouse.x, dy = b.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200 && dist > 0) {
              const force = (200 - dist) / 200;
              b.pushX += (dx / dist) * force * 4;
              b.pushY += (dy / dist) * force * 4;
            }
            b.pushX *= 0.92;
            b.pushY *= 0.92;
            b.x += b.vx + b.pushX;
            b.y += b.vy + b.pushY;
            if (b.y + b.r < 0) { b.y = h + b.r; b.x = Math.random() * w; }
            if (b.x < -b.r) b.x = w + b.r;
            if (b.x > w + b.r) b.x = -b.r;
            const c = b.color;
            const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
            grad.addColorStop(0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + b.alpha + ')');
            grad.addColorStop(1, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
          });
          if (!reduced) requestAnimationFrame(draw);
        }

        window.addEventListener('resize', () => { resize(); createBubbles(); });
        window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
        resize();
        createBubbles();
        draw();
      });
    }
  };

  /* ---------- Navbar scroll state ---------- */
  Drupal.behaviors.tammiaNavScroll = {
    attach(context) {
      once('tammia-nav', '.nav-wrap', context).forEach((nav) => {
        const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      });
    }
  };

  /* ---------- Reveal on scroll (GSAP, optional) ---------- */
  Drupal.behaviors.tammiaReveal = {
    attach(context) {
      if (typeof gsap === 'undefined') return;
      if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
      once('tammia-reveal', '.reveal', context).forEach((el) => {
        gsap.fromTo(el,
          { y: 28, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' }
          });
      });
    }
  };

  /* ---------- Quantity steppers (Commerce add-to-cart forms) ---------- */
  Drupal.behaviors.tammiaQtyStepper = {
    attach(context) {
      once('tammia-qty', '.qty-stepper', context).forEach((wrap) => {
        const input = wrap.querySelector('input');
        if (!input) return;
        wrap.addEventListener('click', (e) => {
          const minus = e.target.closest('.qty-minus');
          const plus = e.target.closest('.qty-plus');
          if (!minus && !plus) return;
          e.preventDefault();
          const v = parseInt(input.value, 10) || 1;
          input.value = plus ? v + 1 : Math.max(1, v - 1);
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
    }
  };

})(Drupal, once);
