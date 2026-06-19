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
  scene.fog = new THREE.FogExp2(0x0a0a0a, 0.035);

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
  // MOUSE TRACKING
  // ═══════════════════════════════════════════════════════════════
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  hero.style.pointerEvents = 'auto';
  hero.addEventListener('mousemove', function (e) {
    const rect = hero.getBoundingClientRect();
    mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  });

  // ═══════════════════════════════════════════════════════════════
  // LIGHTING — Dynamic
  // ═══════════════════════════════════════════════════════════════
  const ambientLight = new THREE.AmbientLight(0x222233, 0.5);
  scene.add(ambientLight);

  // Main directional — warm white
  const dirLight = new THREE.DirectionalLight(0xffeedd, 0.8);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);

  // Accent point lights that follow mouse
  const pointLight1 = new THREE.PointLight(0x8888ff, 1.5, 15);
  pointLight1.position.set(-3, 2, 3);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffffff, 1.2, 15);
  pointLight2.position.set(3, -1, 4);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0xaaaaff, 0.8, 12);
  pointLight3.position.set(0, 3, 2);
  scene.add(pointLight3);

  // ═══════════════════════════════════════════════════════════════
  // 1. UNDULATING FABRIC / WAVE MESH
  // ═══════════════════════════════════════════════════════════════
  const fabricGeometry = new THREE.PlaneGeometry(16, 10, 80, 50);
  const fabricMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x111122,
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
  fabric.position.set(0, -1.5, -2);
  scene.add(fabric);

  // Wireframe overlay for the fabric
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x4444aa,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  });
  const fabricWireframe = new THREE.Mesh(fabricGeometry, wireframeMaterial);
  fabricWireframe.rotation.copy(fabric.rotation);
  fabricWireframe.position.copy(fabric.position);
  scene.add(fabricWireframe);

  // ═══════════════════════════════════════════════════════════════
  // 2. FLOATING 3D GEOMETRIC SHAPES
  // ═══════════════════════════════════════════════════════════════
  const shapes = [];
  const shapeMaterials = [
    new THREE.MeshPhysicalMaterial({
      color: 0xccccdd,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.35,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0x8888bb,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 0.8,
      transparent: true,
      opacity: 0.25,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xaaaacc,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 0.6,
      transparent: true,
      opacity: 0.3,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.05,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.2,
    }),
  ];

  const geometries = [
    new THREE.IcosahedronGeometry(0.4, 0),     // diamond shape
    new THREE.OctahedronGeometry(0.35, 0),      // octahedron
    new THREE.TorusGeometry(0.3, 0.08, 8, 24),  // ring
    new THREE.TetrahedronGeometry(0.35, 0),      // pyramid
    new THREE.DodecahedronGeometry(0.3, 0),      // 12-sided
    new THREE.TorusKnotGeometry(0.25, 0.08, 48, 8, 2, 3), // knot
    new THREE.ConeGeometry(0.25, 0.5, 6),       // hexagonal cone
    new THREE.BoxGeometry(0.35, 0.35, 0.35),     // cube
  ];

  function createFloatingShape(i) {
    const geo = geometries[i % geometries.length];
    const mat = shapeMaterials[i % shapeMaterials.length].clone();
    const mesh = new THREE.Mesh(geo, mat);

    // Wireframe edges
    const edges = new THREE.EdgesGeometry(geo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
    });
    const edgeLines = new THREE.LineSegments(edges, edgeMat);
    mesh.add(edgeLines);

    // Random spread position
    const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.5;
    const radius = 2 + Math.random() * 4;
    mesh.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 5 - 1
    );

    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    const data = {
      mesh: mesh,
      basePos: mesh.position.clone(),
      rotSpeed: {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.015,
        z: (Math.random() - 0.5) * 0.008,
      },
      floatSpeed: 0.3 + Math.random() * 0.7,
      floatAmplitude: 0.15 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      scale: 0.5 + Math.random() * 1.2,
    };

    mesh.scale.setScalar(data.scale);
    scene.add(mesh);
    shapes.push(data);
  }

  // Create 14 floating shapes
  for (let i = 0; i < 14; i++) {
    createFloatingShape(i);
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. PARTICLE FIELD — Floating stars/dust
  // ═══════════════════════════════════════════════════════════════
  const particleCount = 400;
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
    color: 0x6666aa,
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
    color: 0x6666cc,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
  });
  const glow = new THREE.Sprite(glowMaterial);
  glow.scale.set(8, 8, 1);
  glow.position.set(0, 0, -3);
  scene.add(glow);

  // Smaller accent glow
  const glowMaterial2 = new THREE.SpriteMaterial({
    map: glowSpriteMap,
    color: 0x9999ff,
    transparent: true,
    opacity: 0.15,
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
    gradient.addColorStop(0.3, 'rgba(150, 150, 255, 0.5)');
    gradient.addColorStop(0.7, 'rgba(100, 100, 200, 0.1)');
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

    // Smooth mouse
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // ── Camera subtle parallax ──
    camera.position.x = mouse.x * 0.5;
    camera.position.y = mouse.y * 0.3;
    camera.lookAt(0, 0, 0);

    // ── Animate Fabric Wave ──
    const fabricPos = fabricGeometry.attributes.position;
    for (let i = 0; i < fabricPos.count; i++) {
      const x = fabricPos.getX(i);
      const y = fabricPos.getY(i);
      const wave1 = Math.sin(x * 0.5 + time * 2) * 0.3;
      const wave2 = Math.sin(y * 0.8 + time * 1.5) * 0.2;
      const wave3 = Math.sin((x + y) * 0.3 + time * 3) * 0.15;
      
      // Mouse ripple on fabric
      const dx = (x / 8) - mouse.x;
      const dy = (y / 5) - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const mouseWave = Math.sin(dist * 3 - time * 4) * Math.max(0, 0.4 - dist * 0.3);
      
      fabricPos.setZ(i, wave1 + wave2 + wave3 + mouseWave);
    }
    fabricPos.needsUpdate = true;
    fabricGeometry.computeVertexNormals();

    // Sync wireframe
    fabricWireframe.geometry.attributes.position.copy(fabricPos);
    fabricWireframe.geometry.attributes.position.needsUpdate = true;

    // ── Animate Floating Shapes ──
    for (let i = 0; i < shapes.length; i++) {
      const s = shapes[i];
      const m = s.mesh;

      // Rotate
      m.rotation.x += s.rotSpeed.x;
      m.rotation.y += s.rotSpeed.y;
      m.rotation.z += s.rotSpeed.z;

      // Float up/down
      m.position.y = s.basePos.y + Math.sin(time * s.floatSpeed + s.phase) * s.floatAmplitude;
      m.position.x = s.basePos.x + Math.sin(time * s.floatSpeed * 0.7 + s.phase + 1) * s.floatAmplitude * 0.5;

      // Mouse repulsion
      const dx = m.position.x - mouse.x * 3;
      const dy = m.position.y - mouse.y * 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2.5) {
        const force = (1 - dist / 2.5) * 0.3;
        m.position.x += (dx / dist) * force;
        m.position.y += (dy / dist) * force;
      }

      // Pulse opacity based on proximity to camera
      const camDist = m.position.distanceTo(camera.position);
      m.material.opacity = Math.max(0.1, Math.min(0.4, 0.5 - camDist * 0.03));
    }

    // ── Animate Particles ──
    const pPos = particleGeometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      let y = pPos.getY(i);
      y += 0.003;
      if (y > 6) y = -6;
      pPos.setY(i, y);

      // Subtle horizontal drift
      let x = pPos.getX(i);
      x += Math.sin(time + particlePhases[i]) * 0.002;
      pPos.setX(i, x);
    }
    pPos.needsUpdate = true;

    // Rotate particle field slowly
    particles.rotation.y = time * 0.05;

    // ── Animate Lights following mouse ──
    pointLight1.position.x = -3 + mouse.x * 4;
    pointLight1.position.y = 2 + mouse.y * 2;
    pointLight1.intensity = 1.5 + Math.sin(time * 2) * 0.3;

    pointLight2.position.x = 3 + mouse.x * 2;
    pointLight2.position.y = -1 + mouse.y * 1.5;

    // Animate glows
    glow.position.x = mouse.x * 1.5;
    glow.position.y = mouse.y * 1.0;
    glow.material.opacity = 0.2 + Math.sin(time * 1.5) * 0.08;

    glow2.position.x = 3 - mouse.x * 1.0;
    glow2.position.y = 1 - mouse.y * 0.5;

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
