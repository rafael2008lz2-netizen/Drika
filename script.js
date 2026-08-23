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
  const productCards = document.querySelectorAll('.product-grid .product-card');

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

  // ── Card Image Navigation (Mobile & Desktop Arrows + Swipe) ─────
  productCards.forEach(card => {
    const rawDataImages = card.getAttribute('data-images');
    if (!rawDataImages) return;
    const imageList = rawDataImages.split(',').map(s => s.trim()).filter(Boolean);
    if (imageList.length > 1) {
      const container = card.querySelector('.product-card-image');
      if (container) {
        let currentIndex = 0;
        const primaryImg = container.querySelector('img');
        if (!primaryImg) return;
        primaryImg.classList.add('img-primary');

        // Create hover image for desktop
        const hoverImg = document.createElement('img');
        hoverImg.src = imageList[1];
        hoverImg.alt = primaryImg.alt || '';
        hoverImg.classList.add('img-hover');
        if (primaryImg.getAttribute('style')) {
          hoverImg.setAttribute('style', primaryImg.getAttribute('style'));
        }
        container.appendChild(hoverImg);

        // Create Previous Button
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'card-nav-btn prev-btn';
        prevBtn.setAttribute('aria-label', 'Imagem anterior');
        prevBtn.innerHTML = '❮';

        // Create Next Button
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'card-nav-btn next-btn';
        nextBtn.setAttribute('aria-label', 'Próxima imagem');
        nextBtn.innerHTML = '❯';

        // Create Dots Container
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'card-nav-dots';
        imageList.forEach((_, idx) => {
          const dot = document.createElement('span');
          dot.className = 'dot' + (idx === 0 ? ' active' : '');
          dotsContainer.appendChild(dot);
        });

        const updateImage = (newIndex) => {
          currentIndex = newIndex;
          primaryImg.src = imageList[currentIndex];
          const dots = dotsContainer.querySelectorAll('.dot');
          dots.forEach((d, i) => {
            d.classList.toggle('active', i === currentIndex);
          });
        };

        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          const newIdx = (currentIndex - 1 + imageList.length) % imageList.length;
          updateImage(newIdx);
        });

        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          const newIdx = (currentIndex + 1) % imageList.length;
          updateImage(newIdx);
        });

        // Touch swipe support on mobile
        let touchStartX = 0;
        let touchEndX = 0;
        container.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          const diffX = touchStartX - touchEndX;
          if (Math.abs(diffX) > 35) {
            if (diffX > 0) {
              updateImage((currentIndex + 1) % imageList.length);
            } else {
              updateImage((currentIndex - 1 + imageList.length) % imageList.length);
            }
          }
        }, { passive: true });

        container.appendChild(prevBtn);
        container.appendChild(nextBtn);
        container.appendChild(dotsContainer);
      }
    }
  });

  // ── Product Search ─────────────────────────────────────────────
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      // To play nicely with categories, we check which category is active
      const activeBtn = document.querySelector('.filter-btn.active');
      const activeFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'todos';

      productCards.forEach(card => {
        const name = card.querySelector('.product-card-name').textContent.toLowerCase();
        const category = card.getAttribute('data-category');
        
        const matchesSearch = name.includes(searchTerm);
        const matchesCategory = (activeFilter === 'todos' || category === activeFilter);

        if (matchesSearch && matchesCategory) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }

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
        if (descEl) descText = descEl.innerHTML;
        
        const ctaHref = card.querySelector('.product-cta').href;

        let images = [];
        const dataImages = card.getAttribute('data-images');
        if (dataImages) {
          images = dataImages.split(',').map(s => s.trim());
        } else {
          images = [img];
        }

        modalImage.src = images[0];
        modalTitle.textContent = name;
        if(modalPrice) modalPrice.textContent = priceText;
        modalDesc.innerHTML = descText;
        modalCta.href = ctaHref;

        const modalThumbnails = document.getElementById('modalThumbnails');
        if (modalThumbnails) {
          modalThumbnails.innerHTML = '';
          if (images.length > 1) {
            images.forEach((src, idx) => {
              const thumb = document.createElement('img');
              thumb.src = src;
              thumb.className = 'modal-thumbnail-img' + (idx === 0 ? ' active' : '');
              thumb.addEventListener('click', () => {
                modalImage.src = src;
                modalThumbnails.querySelectorAll('.modal-thumbnail-img').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
              });
              modalThumbnails.appendChild(thumb);
            });
            modalThumbnails.style.display = 'flex';
          } else {
            modalThumbnails.style.display = 'none';
          }
        }
        try {
          if (window.location.hash !== '#produto') {
            history.pushState({ modalOpen: true }, "", "#produto");
          }
        } catch(e) {}
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Clear any running animations
        if (window.modalTimeline) {
          window.modalTimeline.pause();
        }
        const animTargets = [modal, '.modal-content', '.modal-gallery', '.modal-title', '.modal-price-box', '.modal-meta', '.modal-desc-box', '.modal-actions'];
        anime.remove(animTargets);

        // Force reset inline styles to prevent stuck states
        animTargets.forEach(target => {
          const els = typeof target === 'string' ? document.querySelectorAll(target) : [target];
          els.forEach(el => { if(el) el.removeAttribute('style'); });
        });

        const isMobile = window.innerWidth <= 640;
        anime.set('.modal-content', { translateY: isMobile ? '100%' : 40, scale: isMobile ? 1 : 0.95, opacity: 0 });
        anime.set(modal, { opacity: 0 });
        anime.set(['.modal-gallery', '.modal-title', '.modal-price-box', '.modal-meta', '.modal-desc-box', '.modal-actions'], { opacity: 0, translateY: 20 });

        // AnimeJS Intro Timeline
        window.modalTimeline = anime.timeline({
          easing: 'easeOutQuad',
        });
        
        window.modalTimeline.add({
          targets: modal,
          opacity: [0, 1],
          duration: 200,
        })
        .add({
          targets: '.modal-content',
          opacity: [0, 1],
          translateY: [isMobile ? '100%' : 40, 0],
          scale: [isMobile ? 1 : 0.95, 1],
          duration: 400,
          easing: 'easeOutCubic'
        }, '-=100')
        .add({
          targets: ['.modal-gallery', '.modal-title', '.modal-price-box', '.modal-meta', '.modal-desc-box', '.modal-actions'],
          translateY: [20, 0],
          opacity: [0, 1],
          delay: anime.stagger(40),
          duration: 400,
          easing: 'easeOutCubic'
        }, '-=300');
      });
    });

    const executeCloseModal = () => {
      const animTargets = [modal, '.modal-content', '.modal-gallery', '.modal-title', '.modal-price-box', '.modal-meta', '.modal-desc-box', '.modal-actions'];
      const isMobile = window.innerWidth <= 640;
      
      if (window.modalTimeline) {
        window.modalTimeline.pause();
      }
      anime.remove(animTargets);

      anime({
        targets: modal,
        opacity: [1, 0],
        duration: 250,
        easing: 'easeOutQuad',
        complete: () => {
          modal.classList.remove('active');
          document.body.style.overflow = '';
          animTargets.forEach(target => {
            const els = typeof target === 'string' ? document.querySelectorAll(target) : [target];
            els.forEach(el => { if(el) el.removeAttribute('style'); });
          });
        }
      });
      anime({
        targets: '.modal-content',
        translateY: isMobile ? '100%' : 40,
        scale: isMobile ? 1 : 0.95,
        opacity: 0,
        duration: 250,
        easing: 'easeOutQuad'
      });
    };

    const closeModal = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      executeCloseModal();
      try {
        if (window.location.hash === '#produto') {
          history.replaceState(null, null, ' ');
        }
      } catch(err) {}
    };

    window.addEventListener('popstate', () => {
      if (modal.classList.contains('active')) {
        executeCloseModal();
      }
    });

    modalClose.addEventListener('click', closeModal);
    if(modalCancel) modalCancel.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(e);
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ── Smart Quote Modal Logic ──────────────────────────────────
  const quoteModal = document.getElementById('quoteModal');
  const openQuoteBtns = document.querySelectorAll('.open-smart-quote');
  const closeQuoteBtn = document.getElementById('closeModal');
  const quoteForm = document.getElementById('quoteForm');
  const steps = Array.from(document.querySelectorAll('.modal-step'));
  const stepIndicators = Array.from(document.querySelectorAll('.progress-steps .step'));
  const nextBtns = document.querySelectorAll('.next-step');
  const prevBtns = document.querySelectorAll('.prev-step');
  const quoteProductSelect = document.getElementById('quoteProduct');
  const fallbackContainer = document.getElementById('quoteFallback');
  const copyQuoteBtn = document.getElementById('copyQuoteBtn');
  
  let currentStep = 0;

  // Function to open modal
  const openSmartModal = (e) => {
    if(e) e.preventDefault();
    if(quoteModal) {
      quoteModal.classList.add('active');
      quoteModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      // Check if opened from a specific product
      if (e && e.currentTarget && e.currentTarget.hasAttribute('data-product')) {
        const prodName = e.currentTarget.getAttribute('data-product');
        
        // We try to match the product name to an option, or select "Outro"
        let found = false;
        if(quoteProductSelect) {
            Array.from(quoteProductSelect.options).forEach(opt => {
              if(prodName.toLowerCase().includes(opt.value.toLowerCase()) && opt.value !== "") {
                quoteProductSelect.value = opt.value;
                found = true;
              }
            });
            if(!found && prodName) {
              quoteProductSelect.value = "Outro";
            }
        }
      }
      
      // Restore session storage state if available
      restoreFormState();
      
      // Focus Trap setup
      const focusableElements = quoteModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if(focusableElements.length) {
        focusableElements[0].focus();
      }
    }
  };

  // Function to close modal
  const closeSmartModalFn = () => {
    if(quoteModal) {
      quoteModal.classList.remove('active');
      quoteModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  openQuoteBtns.forEach(btn => btn.addEventListener('click', openSmartModal));
  if(closeQuoteBtn) closeQuoteBtn.addEventListener('click', closeSmartModalFn);
  
  // Close on outside click
  window.addEventListener('click', (e) => {
    if (e.target === quoteModal) {
      closeSmartModalFn();
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quoteModal && quoteModal.classList.contains('active')) {
      closeSmartModalFn();
    }
  });

  // Step navigation
  const updateSteps = () => {
    steps.forEach((step, index) => {
      step.classList.toggle('active', index === currentStep);
    });
    
    stepIndicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentStep);
      indicator.classList.toggle('completed', index < currentStep);
    });
  };

  const validateStep = (stepIndex) => {
    if(!steps[stepIndex]) return true;
    const currentStepEl = steps[stepIndex];
    const requiredInputs = currentStepEl.querySelectorAll('[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
      if (!input.value) {
        isValid = false;
        input.style.borderColor = 'red';
        input.addEventListener('change', () => {
          if(input.value) input.style.borderColor = '';
        }, { once: true });
      }
    });
    
    return isValid;
  };

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        saveFormState();
        currentStep++;
        updateSteps();
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      saveFormState();
      currentStep--;
      updateSteps();
      if(fallbackContainer) fallbackContainer.style.display = 'none'; // hide fallback if user goes back
    });
  });

  // Form Submission
  if(quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateStep(currentStep)) return;
      
      saveFormState();
      
      // Gather data
      const formData = new FormData(quoteForm);
      const msg = `Olá, Drika! Gostaria de solicitar um orçamento.

*Detalhes do Pedido*
- Produto: ${formData.get('produto')}
- Quantidade: ${formData.get('quantidade')}
- Personalização: ${formData.get('personalizacao')}
- Já possui logo?: ${formData.get('logo')}
- Prazo desejado: ${formData.get('prazo')}

*Contato*
- Nome: ${formData.get('nome')}
${formData.get('empresa') ? '- Empresa: ' + formData.get('empresa') : ''}

Gostaria de receber mais informações.`;

      const encodedMsg = encodeURIComponent(msg);
      const waUrl = `https://wa.me/5516988336070?text=${encodedMsg}`;
      
      // Store final message in a data attribute for the copy button
      if(copyQuoteBtn) copyQuoteBtn.setAttribute('data-msg', msg);
      
      // Show fallback
      if(fallbackContainer) fallbackContainer.style.display = 'block';
      
      // Attempt to open WA
      window.open(waUrl, '_blank');
    });
  }

  if(copyQuoteBtn) {
    copyQuoteBtn.addEventListener('click', () => {
      const msg = copyQuoteBtn.getAttribute('data-msg');
      if(navigator.clipboard && msg) {
        navigator.clipboard.writeText(msg).then(() => {
          const originalText = copyQuoteBtn.innerText;
          copyQuoteBtn.innerText = 'Copiado!';
          setTimeout(() => copyQuoteBtn.innerText = originalText, 2000);
        });
      }
    });
  }

  // Session Storage handling
  const saveFormState = () => {
    if(!quoteForm) return;
    const formData = new FormData(quoteForm);
    const data = Object.fromEntries(formData.entries());
    sessionStorage.setItem('quoteDraft', JSON.stringify({ data, step: currentStep }));
  };

  const restoreFormState = () => {
    const draftStr = sessionStorage.getItem('quoteDraft');
    if (draftStr && quoteForm) {
      try {
        const draft = JSON.parse(draftStr);
        if (draft.data) {
          Object.keys(draft.data).forEach(key => {
            const input = quoteForm.elements[key];
            if (input) {
              input.value = draft.data[key];
            }
          });
        }
      } catch(e) {
        console.error('Error restoring draft', e);
      }
    }
  };
  
  // Save state on any change
  if(quoteForm) {
    quoteForm.addEventListener('change', saveFormState);
  }

  // ==========================================
  // SIMPLE QUOTE FORM (Orçamento)
  // ==========================================
  const quoteOverlay = document.getElementById('quoteModalOverlay');
  const quoteCloseBtn = document.getElementById('quoteModalClose');
  const quoteFormSimple = document.getElementById('quoteFormSimple');

  // Open quote modal from any .open-smart-quote or .open-quote-modal button
  document.querySelectorAll('.open-smart-quote, .open-quote-modal, .nav-cta').forEach(btn => {
    // Only hijack nav-cta if it's the "Orçamento" button in navbar
    if (btn.classList.contains('nav-cta') && !btn.textContent.includes('Orçamento')) return;
    // Skip if it's a direct WhatsApp link
    if (btn.href && btn.href.includes('wa.me') && !btn.classList.contains('open-smart-quote')) return;
  });

  function openQuoteModal(productName) {
    if (!quoteOverlay) return;
    quoteOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (productName) {
      const prodInput = document.getElementById('qProduct');
      if (prodInput) prodInput.value = productName;
    }
  }

  function closeQuoteModal() {
    if (!quoteOverlay) return;
    quoteOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (quoteCloseBtn) {
    quoteCloseBtn.addEventListener('click', closeQuoteModal);
  }

  if (quoteOverlay) {
    quoteOverlay.addEventListener('click', function(e) {
      if (e.target === quoteOverlay) closeQuoteModal();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && quoteOverlay && quoteOverlay.classList.contains('active')) {
      closeQuoteModal();
    }
  });

  if (quoteFormSimple) {
    quoteFormSimple.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('qName')?.value || '';
      const whatsapp = document.getElementById('qWhatsApp')?.value || '';
      const email = document.getElementById('qEmail')?.value || '';
      const type = document.getElementById('qType')?.value || '';
      const company = document.getElementById('qCompany')?.value || '';
      const product = document.getElementById('qProduct')?.value || '';
      const qty = document.getElementById('qQty')?.value || '';
      const custom = document.getElementById('qCustom')?.value || '';
      const message = document.getElementById('qMessage')?.value || '';

      let msg = 'Olá, Drika! Gostaria de solicitar um orçamento.\n\n';
      if (name) msg += '*Nome:* ' + name + '\n';
      if (whatsapp) msg += '*WhatsApp:* ' + whatsapp + '\n';
      if (email) msg += '*E-mail:* ' + email + '\n';
      if (type) msg += '*Tipo de cliente:* ' + type + '\n';
      if (company) msg += '*Empresa:* ' + company + '\n';
      if (product) msg += '*Produto:* ' + product + '\n';
      if (qty) msg += '*Quantidade:* ' + qty + '\n';
      if (custom) msg += '*Personalização:* ' + custom + '\n';
      if (message) msg += '*Mensagem:* ' + message + '\n';

      const encoded = encodeURIComponent(msg);
      window.open('https://wa.me/5516988336070?text=' + encoded, '_blank');
      closeQuoteModal();
    });
  }

});


// ── Hide Elfsight Watermarks & Title Overrides ───────────────────────────────────
function cleanAllElfsight() {
  const hideCSS = `
    a[href*="elfsight"],
    a[href*="apps.elfsight.com"],
    .eapps-link,
    [class*="eapps-link"],
    [class*="Badge__"],
    [class*="badge__"],
    [class*="FloatingBadge"],
    [class*="FreeLink"],
    [class*="free-link"],
    [class*="WidgetTitle"],
    [class*="Header__Title"],
    [class*="Title__Container"],
    [class*="Title__TitleComponent"],
    [class*="Title-sc"],
    [class*="es-widget-title"],
    [class*="es-header-title"],
    [class*="es-badge"] {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      height: 0 !important;
      max-height: 0 !important;
      overflow: hidden !important;
      margin: 0 !important;
      padding: 0 !important;
      pointer-events: none !important;
    }
  `;

  // Inject CSS into all shadow roots
  function injectIntoShadows(root) {
    if (!root) return;
    if (root.shadowRoot) {
      if (!root.shadowRoot.querySelector('#elfsight-safe-cleaner')) {
        const st = document.createElement('style');
        st.id = 'elfsight-safe-cleaner';
        st.textContent = hideCSS;
        root.shadowRoot.appendChild(st);
      }
      injectIntoShadows(root.shadowRoot);
    }
    
    // Also safely hide specific elements without touching parents
    if (root.querySelectorAll) {
      root.querySelectorAll('[class*="elfsight-app"]').forEach(widget => {
         // Only search INSIDE the widget
         const walker = document.createTreeWalker(widget, NodeFilter.SHOW_TEXT, null, false);
         let n;
         while(n = walker.nextNode()) {
           if (n.nodeValue.includes("What Our Customers Say") || n.nodeValue.includes("Free Google Reviews") || n.nodeValue.includes("Reviews Widget")) {
              if (n.parentElement && n.parentElement.tagName !== 'BODY') {
                  n.parentElement.style.setProperty('display', 'none', 'important');
              }
           }
         }
         
         // If widget has shadowRoot, search there too safely
         if (widget.shadowRoot) {
           const sWalker = document.createTreeWalker(widget.shadowRoot, NodeFilter.SHOW_TEXT, null, false);
           let sn;
           while(sn = sWalker.nextNode()) {
             if (sn.nodeValue.includes("What Our Customers Say") || sn.nodeValue.includes("Free Google Reviews") || sn.nodeValue.includes("Reviews Widget")) {
                if (sn.parentElement && sn.parentElement.tagName !== 'BODY') {
                    sn.parentElement.style.setProperty('display', 'none', 'important');
                }
             }
           }
         }
      });
    }

    if (root.childNodes) {
      root.childNodes.forEach(child => injectIntoShadows(child));
    }
  }

  injectIntoShadows(document.body || document.documentElement);
}

// Run immediately
cleanAllElfsight();

// Run frequently during page lifecycle
const elfsightInterval = setInterval(cleanAllElfsight, 250);
setTimeout(() => {
  clearInterval(elfsightInterval);
  setInterval(cleanAllElfsight, 1500);
}, 8000);

// Observer for any new DOM insertions
const elfsightObserver = new MutationObserver(function() {
  cleanAllElfsight();
});
elfsightObserver.observe(document.documentElement, { childList: true, subtree: true });


