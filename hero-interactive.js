// hero-interactive.js — Premium Interactive Hero Background
// Features: Interactive mesh gradient, aurora waves, floating particles with mouse repulsion,
// gradient orbs that follow cursor, and parallax depth effect

(function () {
  'use strict';

  const hero = document.getElementById('home');
  if (!hero) return;

  // ═══════════════════════════════════════════════════════════════
  // 1. INTERACTIVE CANVAS — Mesh Grid + Particles + Aurora
  // ═══════════════════════════════════════════════════════════════
  const canvas = document.createElement('canvas');
  canvas.id = 'hero-interactive-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;';
  
  const overlay = hero.querySelector('.hero-overlay');
  if (overlay) {
    hero.insertBefore(canvas, overlay);
  } else {
    hero.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  let W, H;
  let animationId;
  let time = 0;

  // Mouse state
  const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth;
    H = hero.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
    initMeshPoints();
  }

  // ── Mouse Tracking ──
  hero.addEventListener('mousemove', function (e) {
    const rect = hero.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
    mouse.active = true;
  });

  hero.addEventListener('mouseleave', function () {
    mouse.active = false;
  });

  // Smooth mouse interpolation
  function updateMouse() {
    const ease = 0.08;
    mouse.x += (mouse.targetX - mouse.x) * ease;
    mouse.y += (mouse.targetY - mouse.y) * ease;
  }

  // ── Mesh Grid Points ──
  let meshPoints = [];
  const MESH_COLS = 12;
  const MESH_ROWS = 8;

  function initMeshPoints() {
    meshPoints = [];
    const stepX = W / (MESH_COLS - 1);
    const stepY = H / (MESH_ROWS - 1);
    for (let row = 0; row < MESH_ROWS; row++) {
      for (let col = 0; col < MESH_COLS; col++) {
        meshPoints.push({
          baseX: col * stepX,
          baseY: row * stepY,
          x: col * stepX,
          y: row * stepY,
          offsetX: 0,
          offsetY: 0,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.5,
          amplitude: 8 + Math.random() * 12
        });
      }
    }
  }

  function updateMesh() {
    for (let i = 0; i < meshPoints.length; i++) {
      const p = meshPoints[i];
      // Organic wave motion
      p.offsetX = Math.sin(time * p.speed + p.phase) * p.amplitude;
      p.offsetY = Math.cos(time * p.speed * 0.7 + p.phase + 1.5) * p.amplitude * 0.8;

      // Mouse influence — attraction/distortion
      if (mouse.active) {
        const dx = mouse.x - p.baseX;
        const dy = mouse.y - p.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 250;
        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * 30;
          p.offsetX += (dx / dist) * force;
          p.offsetY += (dy / dist) * force;
        }
      }

      p.x = p.baseX + p.offsetX;
      p.y = p.baseY + p.offsetY;
    }
  }

  function drawMesh() {
    ctx.save();
    // Draw subtle mesh lines
    for (let row = 0; row < MESH_ROWS; row++) {
      for (let col = 0; col < MESH_COLS; col++) {
        const idx = row * MESH_COLS + col;
        const p = meshPoints[idx];

        // Horizontal connections
        if (col < MESH_COLS - 1) {
          const next = meshPoints[idx + 1];
          const dx = mouse.x - (p.x + next.x) / 2;
          const dy = mouse.y - (p.y + next.y) / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const glow = mouse.active ? Math.max(0, 1 - dist / 300) * 0.15 : 0;
          
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.025 + glow})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // Vertical connections
        if (row < MESH_ROWS - 1) {
          const below = meshPoints[idx + MESH_COLS];
          const dx = mouse.x - (p.x + below.x) / 2;
          const dy = mouse.y - (p.y + below.y) / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const glow = mouse.active ? Math.max(0, 1 - dist / 300) * 0.15 : 0;
          
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(below.x, below.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.025 + glow})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // Mesh node dots — glow near mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = mouse.active ? Math.max(0, 1 - dist / 200) : 0;
        
        if (proximity > 0.1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5 + proximity * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${proximity * 0.5})`;
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  // ── Floating Particles ──
  let particles = [];
  const PARTICLE_COUNT_BASE = 60;

  function initParticles() {
    particles = [];
    const count = Math.min(PARTICLE_COUNT_BASE, Math.floor((W * H) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      baseX: 0,
      baseY: 0,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 0.8 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.4,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.5 + Math.random() * 1.5
    };
  }

  function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Pulse opacity
      p.opacity = 0.15 + Math.sin(time * p.pulseSpeed + p.pulsePhase) * 0.15;

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Mouse repulsion
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 150;
        if (dist < repelRadius && dist > 0) {
          const force = (1 - dist / repelRadius) * 2;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      // Wrap around
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;
    }
  }

  function drawParticles() {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.fill();
    }

    // Draw connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.08;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // ── Aurora Waves ──
  function drawAurora() {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    
    // 3 layered aurora waves
    const colors = [
      { r: 100, g: 100, b: 140, a: 0.04 },
      { r: 80, g: 120, b: 160, a: 0.03 },
      { r: 140, g: 140, b: 180, a: 0.025 }
    ];

    for (let w = 0; w < colors.length; w++) {
      const c = colors[w];
      const waveOffset = w * 0.7;
      
      ctx.beginPath();
      ctx.moveTo(0, H);
      
      for (let x = 0; x <= W; x += 4) {
        const normalX = x / W;
        const y = H * 0.3 +
          Math.sin(normalX * 3 + time * 0.3 + waveOffset) * (H * 0.12) +
          Math.sin(normalX * 5 + time * 0.5 + waveOffset * 2) * (H * 0.06) +
          Math.sin(normalX * 7 + time * 0.2 + waveOffset * 3) * (H * 0.03);
        
        // Mouse influence on wave
        if (mouse.active) {
          const dx = x - mouse.x;
          const distX = Math.abs(dx);
          if (distX < 300) {
            const influence = (1 - distX / 300) * 40;
            const dy = mouse.y - H * 0.5;
            ctx.lineTo(x, y + (dy > 0 ? influence : -influence));
            continue;
          }
        }
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(W, H);
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, H * 0.2, 0, H);
      gradient.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`);
      gradient.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a * 0.5})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    ctx.restore();
  }

  // ── Mouse Glow Spotlight ──
  function drawMouseGlow() {
    if (!mouse.active) return;
    
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    
    // Outer glow
    const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 300);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
    gradient.addColorStop(0.4, 'rgba(200, 200, 220, 0.02)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    
    // Inner bright spot
    const innerGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80);
    innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
    innerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = innerGlow;
    ctx.fillRect(mouse.x - 80, mouse.y - 80, 160, 160);
    
    ctx.restore();
  }

  // ── Vignette Effect ──
  function drawVignette() {
    const gradient = ctx.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.8);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. PARALLAX DEPTH LAYERS (CSS-driven via JS)
  // ═══════════════════════════════════════════════════════════════
  const parallaxLayers = hero.querySelectorAll('.hero-parallax-layer');
  
  function updateParallax() {
    if (!mouse.active || parallaxLayers.length === 0) return;
    
    const cx = (mouse.x / W - 0.5) * 2; // -1 to 1
    const cy = (mouse.y / H - 0.5) * 2;
    
    parallaxLayers.forEach(function(layer) {
      const depth = parseFloat(layer.dataset.depth) || 0.05;
      const moveX = cx * depth * 40;
      const moveY = cy * depth * 40;
      layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. MAIN ANIMATION LOOP
  // ═══════════════════════════════════════════════════════════════
  function animate() {
    animationId = requestAnimationFrame(animate);
    time += 0.01;
    
    ctx.clearRect(0, 0, W, H);
    
    updateMouse();
    
    // Draw layers in order (back to front)
    drawAurora();
    updateMesh();
    drawMesh();
    updateParticles();
    drawParticles();
    drawMouseGlow();
    drawVignette();
    updateParallax();
  }

  // ═══════════════════════════════════════════════════════════════
  // 4. CSS ORB MOUSE FOLLOW (for the ambient orbs)
  // ═══════════════════════════════════════════════════════════════
  const orbs = hero.querySelectorAll('.ambient-orb');
  
  hero.addEventListener('mousemove', function (e) {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    orbs.forEach(function(orb, i) {
      const intensity = 20 + i * 10;
      const dx = (x - 0.5) * intensity;
      const dy = (y - 0.5) * intensity;
      orb.style.transition = 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
      orb.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  });

  hero.addEventListener('mouseleave', function () {
    orbs.forEach(function(orb) {
      orb.style.transform = 'translate(0, 0)';
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 5. INIT
  // ═══════════════════════════════════════════════════════════════
  
  // Intersection Observer — only animate when visible
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!animationId) {
          resize();
          animate();
        }
      } else {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    });
  }, { threshold: 0.1 });

  observer.observe(hero);

  window.addEventListener('resize', function () {
    clearTimeout(window._heroResizeTimer);
    window._heroResizeTimer = setTimeout(resize, 200);
  });

  // Initial setup
  resize();
  animate();

})();
