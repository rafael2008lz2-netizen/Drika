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

  // ── Parallax Background Typography ────────────────────────────
  const parallaxTexts = document.querySelectorAll('.parallax-text');
  if (parallaxTexts.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxTexts.forEach(text => {
        const speed = text.getAttribute('data-speed') || 0.1;
        const yPos = -(scrollY * speed);
        // The texts already have translateY(-50%), we add the parallax offset
        text.style.transform = `translateY(calc(-50% + ${yPos}px)) ${text.classList.contains('left') ? 'rotate(-90deg)' : text.classList.contains('right') ? 'rotate(90deg)' : ''}`;
      });
    }, { passive: true });
  }


  // ── Global Particles Generator ────────────────────────────────
  const particlesContainer = document.getElementById('particles-container');
  if (particlesContainer) {
    const particleCount = 20; // Quantity of particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Random properties
      const size = Math.random() * 4 + 2; // 2px to 6px
      const posX = Math.random() * 100; // 0% to 100%
      const delay = Math.random() * 15; // 0s to 15s
      const duration = Math.random() * 20 + 15; // 15s to 35s
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      
      particlesContainer.appendChild(particle);
    }
  }

  // ── Ripple Effect on Click ────────────────────────────────────
  document.addEventListener('click', function(e) {
    const target = e.target.closest('.product-cta, .filter-btn');
    if (!target) return;
    
    const circle = document.createElement('span');
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;

    const rect = target.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    const existingRipple = target.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }

    target.appendChild(circle);
  });

  // ── Magnetic Buttons ──────────────────────────────────────────
  if (window.matchMedia("(pointer: fine)").matches) {
    const magnets = document.querySelectorAll('.filter-btn, .whatsapp-float');
    magnets.forEach(magnet => {
      magnet.addEventListener('mousemove', (e) => {
        const rect = magnet.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const maxMove = 15;
        const moveX = (x / (rect.width/2)) * maxMove;
        const moveY = (y / (rect.height/2)) * maxMove;
        
        magnet.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
      magnet.addEventListener('mouseleave', () => {
        magnet.style.transform = `translate3d(0, 0, 0)`;
      });
    });
  }

  // ── Product Modal Logic ──────────────────────────────────────────
  const modal = document.getElementById('productModal');
  const modalClose = document.getElementById('modalClose');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalDesc = document.getElementById('modalDesc');
  const modalCta = document.getElementById('modalCta');
  const modalCancel = document.getElementById('modalCancel');

  if (modal) {
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent modal if CTA is clicked directly
        if (e.target.closest('.product-cta')) return;

        const img = card.querySelector('.product-card-image img').src;
        const name = card.querySelector('.product-card-name').textContent;
        
        // Handle price correctly, removing 'R$' if present to keep format clean
        let priceText = card.querySelector('.product-price').textContent.trim();
        if (priceText.startsWith('R$')) priceText = priceText.replace('R$', '').trim();
        
        let descText = "";
        const descEl = card.querySelector('.product-card-desc');
        if (descEl) descText = descEl.textContent;
        
        const ctaHref = card.querySelector('.product-cta').href;

        modalImage.src = img;
        modalTitle.textContent = name;
        if(modalPrice) modalPrice.textContent = priceText;
        modalDesc.textContent = descText;
        modalCta.href = ctaHref;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);
    if(modalCancel) modalCancel.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

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
