// hero-3d.js — THREE.JS 3D Animated Hero Background
// Dramatic floating geometry + undulating fabric + dynamic lighting + mouse interaction

(function () {
  'use strict';

  const hero = document.getElementById('home');
  if (!hero) return;

  // ═══════════════════════════════════════════════════════════════
  // SETUP THREE.JS SCENE
  // ═══════════════════════════════════════════════════════════════
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0a, 0.015);

  const camera = new THREE.PerspectiveCamera(60, hero.clientWidth / hero.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(hero.clientWidth, hero.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.id = 'hero-3d-canvas';
  renderer.domElement.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;';

  // Insert canvas right after hero-bg
  const heroBg = hero.querySelector('.hero-bg');
  if (heroBg && heroBg.nextSibling) {
    hero.insertBefore(renderer.domElement, heroBg.nextSibling);
  } else {
    hero.prepend(renderer.domElement);
  }

  // ═══════════════════════════════════════════════════════════════
  // NO MOUSE TRACKING
  // ═══════════════════════════════════════════════════════════════
  const autoMouse = { x: 0, y: 0 };

  // ═══════════════════════════════════════════════════════════════
  // LIGHTING — Dynamic (Grayscale)
  // ═══════════════════════════════════════════════════════════════
  const ambientLight = new THREE.AmbientLight(0x222222, 0.5);
  scene.add(ambientLight);

  // Main directional — warm white
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);

  // Accent point lights that follow mouse
  const pointLight1 = new THREE.PointLight(0xaaaaaa, 1.5, 15);
  pointLight1.position.set(-3, 2, 3);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffffff, 1.2, 15);
  pointLight2.position.set(3, -1, 4);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0x888888, 0.8, 12);
  pointLight3.position.set(0, 3, 2);
  scene.add(pointLight3);

  // ═══════════════════════════════════════════════════════════════
  // 1. UNDULATING FABRIC / WAVE MESH
  // ═══════════════════════════════════════════════════════════════
  const fabricGeometry = new THREE.PlaneGeometry(120, 60, 200, 100);
  const fabricMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    metalness: 0.7,
    roughness: 0.3,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    side: THREE.DoubleSide,
    wireframe: false,
    transparent: true,
    opacity: 0.6,
  });
  const fabric = new THREE.Mesh(fabricGeometry, fabricMaterial);
  fabric.rotation.x = -Math.PI * 0.35;
  fabric.position.set(0, -2, -4);
  scene.add(fabric);

  // Wireframe overlay for the fabric
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x555555,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  });
  const fabricWireframe = new THREE.Mesh(fabricGeometry, wireframeMaterial);
  fabricWireframe.rotation.copy(fabric.rotation);
  fabricWireframe.position.copy(fabric.position);
  scene.add(fabricWireframe);



  // ═══════════════════════════════════════════════════════════════
  // 3. PARTICLE FIELD — Floating stars/dust
  // ═══════════════════════════════════════════════════════════════
  const particleCount = 40;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);
  const particlePhases = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 20;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    particleSizes[i] = Math.random() * 3 + 1;
    particlePhases[i] = Math.random() * Math.PI * 2;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.04,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // ═══════════════════════════════════════════════════════════════
  // 4. CONNECTING LINES — Constellation effect
  // ═══════════════════════════════════════════════════════════════
  const lineCount = 30;
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x777777,
    transparent: true,
    opacity: 0.06,
    blending: THREE.AdditiveBlending,
  });

  const lineGroup = new THREE.Group();
  for (let i = 0; i < lineCount; i++) {
    const points = [];
    const startIdx = Math.floor(Math.random() * particleCount);
    const endIdx = Math.floor(Math.random() * particleCount);
    points.push(new THREE.Vector3(
      particlePositions[startIdx * 3],
      particlePositions[startIdx * 3 + 1],
      particlePositions[startIdx * 3 + 2]
    ));
    points.push(new THREE.Vector3(
      particlePositions[endIdx * 3],
      particlePositions[endIdx * 3 + 1],
      particlePositions[endIdx * 3 + 2]
    ));
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeo, lineMaterial);
    lineGroup.add(line);
  }
  scene.add(lineGroup);

  // ═══════════════════════════════════════════════════════════════
  // 5. GLOWING ORB — Central ambient glow
  // ═══════════════════════════════════════════════════════════════
  const glowSpriteMap = createGlowTexture();
  const glowMaterial = new THREE.SpriteMaterial({
    map: glowSpriteMap,
    color: 0x666666,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending,
  });
  const glow = new THREE.Sprite(glowMaterial);
  glow.scale.set(8, 8, 1);
  glow.position.set(0, 0, -3);
  scene.add(glow);

  // Smaller accent glow
  const glowMaterial2 = new THREE.SpriteMaterial({
    map: glowSpriteMap,
    color: 0x888888,
    transparent: true,
    opacity: 0.05,
    blending: THREE.AdditiveBlending,
  });
  const glow2 = new THREE.Sprite(glowMaterial2);
  glow2.scale.set(5, 5, 1);
  glow2.position.set(3, 1, -2);
  scene.add(glow2);

  function createGlowTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(150, 150, 150, 0.5)');
    gradient.addColorStop(0.7, 'rgba(100, 100, 100, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // ═══════════════════════════════════════════════════════════════
  // ANIMATION LOOP
  // ═══════════════════════════════════════════════════════════════
  let time = 0;
  let animationId;

  function animate() {
    animationId = requestAnimationFrame(animate);
    time += 0.005;

    // Automatic smooth movement without mouse
    autoMouse.x = Math.sin(time * 0.5) * 0.5;
    autoMouse.y = Math.cos(time * 0.3) * 0.5;

    // ── Camera subtle parallax ──
    camera.position.x = autoMouse.x * 0.5;
    camera.position.y = autoMouse.y * 0.3;
    camera.lookAt(0, 0, 0);

    // ── Animate Fabric Wave ──
    const fabricPos = fabricGeometry.attributes.position;
    for (let i = 0; i < fabricPos.count; i++) {
      const x = fabricPos.getX(i);
      const y = fabricPos.getY(i);
      const wave1 = Math.sin(x * 0.5 + time * 0.8) * 0.3;
      const wave2 = Math.sin(y * 0.8 + time * 0.6) * 0.2;
      const wave3 = Math.sin((x + y) * 0.3 + time * 1.2) * 0.15;
      
      fabricPos.setZ(i, wave1 + wave2 + wave3);
    }
    fabricPos.needsUpdate = true;
    fabricGeometry.computeVertexNormals();

    // Sync wireframe
    fabricWireframe.geometry.attributes.position.copy(fabricPos);
    fabricWireframe.geometry.attributes.position.needsUpdate = true;

    // ── Animate Particles ──
    const pPos = particleGeometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      let y = pPos.getY(i);
      y += 0.0015;
      if (y > 6) y = -6;
      pPos.setY(i, y);

      // Subtle horizontal drift
      let x = pPos.getX(i);
      x += Math.sin(time + particlePhases[i]) * 0.001;
      pPos.setX(i, x);
    }
    pPos.needsUpdate = true;

    // Rotate particle field slowly
    particles.rotation.y = time * 0.025;

    // ── Animate Lights smoothly ──
    pointLight1.position.x = -3 + autoMouse.x * 4;
    pointLight1.position.y = 2 + autoMouse.y * 2;
    pointLight1.intensity = 1.5 + Math.sin(time * 2) * 0.3;

    pointLight2.position.x = 3 + autoMouse.x * 2;
    pointLight2.position.y = -1 + autoMouse.y * 1.5;

    // Animate glows
    glow.position.x = autoMouse.x * 1.5;
    glow.position.y = autoMouse.y * 1.0;
    glow.material.opacity = 0.2 + Math.sin(time * 1.5) * 0.08;

    glow2.position.x = 3 - autoMouse.x * 1.0;
    glow2.position.y = 1 - autoMouse.y * 0.5;

    // ── Rotate constellation lines slowly ──
    lineGroup.rotation.y = time * 0.03;
    lineGroup.rotation.x = time * 0.02;

    renderer.render(scene, camera);
  }

  // ═══════════════════════════════════════════════════════════════
  // RESIZE
  // ═══════════════════════════════════════════════════════════════
  function onResize() {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', function () {
    clearTimeout(window._hero3dResize);
    window._hero3dResize = setTimeout(onResize, 150);
  });

  // ═══════════════════════════════════════════════════════════════
  // PERFORMANCE — Only animate when visible
  // ═══════════════════════════════════════════════════════════════
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!animationId) animate();
      } else {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    });
  }, { threshold: 0.05 });

  observer.observe(hero);

  // Start
  animate();

})();
