/* ============================================================
   DRIKA ATELIÊ — Premium Virtual Store Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar Scroll ────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('nav-scrolled', window.scrollY > 60);
  }, { passive: true });

  // ── Mobile Menu ──────────────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
      navToggle.setAttribute('aria-expanded', isActive);
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Smooth Scroll ────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  // ── Scroll Reveal (IntersectionObserver) ─────────────────────
  const revealElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-in');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ── Product Catalog Filters ──────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'todos' || category === filter) {
          card.classList.remove('hidden');
          // Re-trigger fade-in animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(30px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ── 3D Tilt Effect (Testimonials) ────────────────────────────
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });

  // ── Parallax Hero ────────────────────────────────────────────
  const parallaxEl = document.querySelector('[data-parallax]');
  if (parallaxEl) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          parallaxEl.style.transform = `translateY(${window.scrollY * 0.3}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Magnetic Hover on Diff Icons ─────────────────────────────
  document.querySelectorAll('.diff-card').forEach(card => {
    const icon = card.querySelector('.diff-icon');
    if (!icon) return;

    card.addEventListener('mousemove', (e) => {
      const rect = icon.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) * 0.15;
      const dy = (e.clientY - rect.top - rect.height / 2) * 0.15;
      icon.style.transform = `translate(${dx}px, ${dy}px) scale(1.1)`;
      icon.style.transition = 'transform 0.2s ease';
    });

    card.addEventListener('mouseleave', () => {
      icon.style.transform = 'translate(0, 0) scale(1)';
      icon.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });

  // ── WhatsApp Float Visibility ────────────────────────────────
  const whatsappFloat = document.getElementById('whatsappFloat');
  if (whatsappFloat) {
    whatsappFloat.style.opacity = '0';
    whatsappFloat.style.pointerEvents = 'none';
    whatsappFloat.style.transition = 'opacity 0.4s ease';

    window.addEventListener('scroll', () => {
      const show = window.scrollY > window.innerHeight * 0.5;
      whatsappFloat.style.opacity = show ? '1' : '0';
      whatsappFloat.style.pointerEvents = show ? 'auto' : 'none';
    }, { passive: true });
  }

  // ── Keyboard: Escape closes mobile menu ──────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });

});

// ── Hide Elfsight Watermarks ───────────────────────────────────
setInterval(() => {
  // Hide standard links and toolbars
  document.querySelectorAll('a[href*="elfsight.com"], .eapps-link, [class*="eapps-widget-toolbar"]').forEach(el => {
    el.style.setProperty('display', 'none', 'important');
    el.style.setProperty('opacity', '0', 'important');
  });
  
  // Pierce shadow DOM if Elfsight uses it
  document.querySelectorAll('[class*="elfsight-app"]').forEach(app => {
    if (app.shadowRoot) {
      const style = document.createElement('style');
      style.innerHTML = 'a[href*="elfsight.com"], .eapps-link, [class*="eapps-widget-toolbar"] { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }';
      // Append style only if it's not already there
      if (!app.shadowRoot.querySelector('style[data-hide-elfsight]')) {
        style.setAttribute('data-hide-elfsight', 'true');
        app.shadowRoot.appendChild(style);
      }
      
      app.shadowRoot.querySelectorAll('a[href*="elfsight.com"], .eapps-link, [class*="eapps-widget-toolbar"]').forEach(el => {
        el.style.setProperty('display', 'none', 'important');
      });
    }
  });
}, 500);
