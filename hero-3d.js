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
  // 6. STICKMEN (CUTTER & SEWER)
  // ═══════════════════════════════════════════════════════════════
  function createStickman(color, isCutter) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.5 });
    
    // Head
    const headGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const head = new THREE.Mesh(headGeo, mat);
    head.position.z = 1.8;
    group.add(head);
    
    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2);
    const body = new THREE.Mesh(bodyGeo, mat);
    body.rotation.x = Math.PI / 2;
    body.position.z = 1.0;
    group.add(body);
    
    // Limbs
    const limbGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.8);
    limbGeo.translate(0, -0.4, 0); // Pivot at the top
    
    const armL = new THREE.Mesh(limbGeo, mat);
    armL.position.set(-0.25, 0, 1.4);
    const armR = new THREE.Mesh(limbGeo, mat);
    armR.position.set(0.25, 0, 1.4);
    group.add(armL, armR);
    
    const legL = new THREE.Mesh(limbGeo, mat);
    legL.position.set(-0.15, 0, 0.8);
    const legR = new THREE.Mesh(limbGeo, mat);
    legR.position.set(0.15, 0, 0.8);
    group.add(legL, legR);
    
    if (isCutter) {
      // Scissors
      const scisMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 });
      const bladeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8);
      bladeGeo.translate(0, -0.2, 0);
      const blade1 = new THREE.Mesh(bladeGeo, scisMat);
      blade1.rotation.z = 0.2;
      const blade2 = new THREE.Mesh(bladeGeo, scisMat);
      blade2.rotation.z = -0.2;
      const scissors = new THREE.Group();
      scissors.add(blade1, blade2);
      scissors.position.set(0, -0.7, 0);
      armR.add(scissors);
      group.scissors = scissors;
    } else {
      // Needle
      const needleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 });
      const needleGeo = new THREE.ConeGeometry(0.03, 0.5);
      needleGeo.translate(0, -0.25, 0);
      const needle = new THREE.Mesh(needleGeo, needleMat);
      needle.position.set(0, -0.7, 0);
      armR.add(needle);
      group.needle = needle;
    }
    
    group.updateAnimation = function(t, speed) {
      const cycle = t * speed;
      legL.rotation.x = Math.sin(cycle) * 0.8;
      legR.rotation.x = Math.sin(cycle + Math.PI) * 0.8;
      
      armL.rotation.x = Math.sin(cycle + Math.PI) * 0.6;
      armR.rotation.x = Math.sin(cycle) * 0.6;
      
      if (isCutter && group.scissors) {
         // Snip snip
         const snip = Math.abs(Math.sin(cycle * 2)) * 0.3;
         group.scissors.children[0].rotation.z = 0.1 + snip;
         group.scissors.children[1].rotation.z = -0.1 - snip;
      }
    };
    
    return group;
  }

  const stickman1 = createStickman(0xffffff, true);
  stickman1.scale.set(0.3, 0.3, 0.3);
  const stickman2 = createStickman(0xdddddd, false);
  stickman2.scale.set(0.3, 0.3, 0.3);
  scene.add(stickman1, stickman2);

  // Array to hold active stitches
  const stitches = [];
  const stitchMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });
  const stitchGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.6);
  stitchGeometry.rotateY(Math.PI / 2); // align across the tear
  
  let lastStitchTime = 0;
  let stickmanPathTime = 0;

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

    // ── Stickman Pathing (Tag / Pega-pega slow) ──
    stickmanPathTime += 0.008; // Normal slow walk speed
    
    // Stickman 1 walks on a wide, slow curve
    let s1X = Math.sin(stickmanPathTime * 0.7) * 20 + Math.cos(stickmanPathTime * 0.3) * 10;
    let s1Y = Math.cos(stickmanPathTime * 0.5) * 12 + Math.sin(stickmanPathTime * 0.4) * 6;
    
    // Stickman 2 follows closely behind
    let t2 = stickmanPathTime - 0.2; // smaller delay because they move slower
    let s2X = Math.sin(t2 * 0.7) * 20 + Math.cos(t2 * 0.3) * 10;
    let s2Y = Math.cos(t2 * 0.5) * 12 + Math.sin(t2 * 0.4) * 6;
    
    // Rotations (facing direction based on velocity)
    let dx1 = 0.7 * 20 * Math.cos(stickmanPathTime * 0.7) - 0.3 * 10 * Math.sin(stickmanPathTime * 0.3);
    let dy1 = -0.5 * 12 * Math.sin(stickmanPathTime * 0.5) + 0.4 * 6 * Math.cos(stickmanPathTime * 0.4);
    stickman1.rotation.z = Math.atan2(dy1, dx1);
    
    let dx2 = 0.7 * 20 * Math.cos(t2 * 0.7) - 0.3 * 10 * Math.sin(t2 * 0.3);
    let dy2 = -0.5 * 12 * Math.sin(t2 * 0.5) + 0.4 * 6 * Math.cos(t2 * 0.4);
    stickman2.rotation.z = Math.atan2(dy2, dx2);

    stickman1.updateAnimation(time, 10); // Walk normal speed
    stickman2.updateAnimation(time, 10);
    
    // Get Z height for stickmen
    function getWaveZ(x, y, t) {
      const w1 = Math.sin(x * 0.5 + t * 0.8) * 0.3;
      const w2 = Math.sin(y * 0.8 + t * 0.6) * 0.2;
      const w3 = Math.sin((x + y) * 0.3 + t * 1.2) * 0.15;
      return w1 + w2 + w3;
    }
    
    stickman1.position.set(s1X, s1Y, getWaveZ(s1X, s1Y, time));
    stickman2.position.set(s2X, s2Y, getWaveZ(s2X, s2Y, time));

    // ── Animate Fabric Wave & Tear ──
    const fabricPos = fabricGeometry.attributes.position;
    
    const tearDx = s1X - s2X;
    const tearDy = s1Y - s2Y;
    const tearLenSq = tearDx*tearDx + tearDy*tearDy;

    for (let i = 0; i < fabricPos.count; i++) {
      const x = fabricPos.getX(i);
      const y = fabricPos.getY(i);
      const baseZ = getWaveZ(x, y, time);
      
      let cutOffset = 0;
      
      // Calculate tear gap
      const vx = x - s2X;
      const vy = y - s2Y;
      const t = Math.max(0, Math.min(1, (vx * tearDx + vy * tearDy) / tearLenSq));
      
      const projX = s2X + t * tearDx;
      const projY = s2Y + t * tearDy;
      const dist = Math.sqrt((x - projX)**2 + (y - projY)**2);
      
      if (dist < 0.6) {
         const endTaper = Math.sin(t * Math.PI); // Smooth fade at start and end of tear
         cutOffset = -3 * endTaper * (1 - dist/0.6); // Deep plunge for black tear
      }
      
      fabricPos.setZ(i, baseZ + cutOffset);
    }
    fabricPos.needsUpdate = true;
    fabricGeometry.computeVertexNormals();

    // ── Manage Stitches ──
    // Drop a stitch behind stickman2
    if (time - lastStitchTime > 0.1) {
      const stitch = new THREE.Mesh(stitchGeometry, stitchMaterial.clone());
      stitch.position.set(s2X, s2Y, getWaveZ(s2X, s2Y, time) + 0.1);
      stitch.rotation.z = stickman2.rotation.z + Math.PI/2; // Crosses the tear
      // Randomize angle a bit for a hand-stitched look
      stitch.rotation.x = (Math.random() - 0.5) * 0.5;
      stitch.rotation.y = (Math.random() - 0.5) * 0.5;
      stitch.userData = { spawnTime: time };
      scene.add(stitch);
      stitches.push(stitch);
      lastStitchTime = time;
    }
    
    // Fade and remove old stitches
    for (let i = stitches.length - 1; i >= 0; i--) {
      const st = stitches[i];
      const age = time - st.userData.spawnTime;
      if (age > 2) { // Fade out fast
        scene.remove(st);
        st.material.dispose();
        stitches.splice(i, 1);
      } else if (age > 1) {
        st.material.opacity = 1 - (age - 1);
      }
    }

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
