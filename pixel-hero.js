/**
 * Pixel Canvas Engine (Vanilla JS)
 * Translated from the React PixelHero component to run natively without a framework.
 */

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("pixelCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Colors based on Drika Catalogo theme (Gold/White/Neutral)
  const colors = ["#c89635", "#e8c468", "#fcf0c0", "rgba(255, 255, 255, 0.4)", "rgba(200, 150, 53, 0.3)"];
  const gap = 6;
  const speed = 30;
  
  let pixels = [];
  let animationRef = 0;
  let lastFrame = performance.now();
  let isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const createPixel = (x, y, color, baseSpeed, delay) => {
    const rand = (min, max) => Math.random() * (max - min) + min;
    const p = {
      x, y, color, ctx,
      speed: rand(0.08, 0.4) * baseSpeed,
      size: 0,
      sizeStep: rand(0.12, 0.28),
      minSize: 0.5,
      maxSizeInt: 2,
      maxSize: rand(0.5, 2),
      delay,
      counter: 0,
      counterStep: rand(1.8, 3.2) + (canvas.width + canvas.height) * 0.008,
      isIdle: false,
      isReverse: false,
      isShimmer: false,
      draw() {
        const offset = p.maxSizeInt * 0.5 - p.size * 0.5;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x + offset, p.y + offset, p.size, p.size);
      },
      appear() {
        p.isIdle = false;
        if (p.counter <= p.delay) {
          p.counter += p.counterStep;
          return;
        }
        if (p.size >= p.maxSize) p.isShimmer = true;
        if (p.isShimmer) p.shimmer();
        else p.size += p.sizeStep;
        p.draw();
      },
      disappear() {
        p.isShimmer = false;
        p.counter = 0;
        if (p.size <= 0) {
          p.isIdle = true;
          return;
        }
        p.size -= 0.1;
        p.draw();
      },
      shimmer() {
        if (p.size >= p.maxSize) p.isReverse = true;
        else if (p.size <= p.minSize) p.isReverse = false;
        if (p.isReverse) p.size -= p.speed;
        else p.size += p.speed;
      }
    };
    return p;
  };

  const init = () => {
    const wrap = canvas.parentElement;
    const { width, height } = wrap.getBoundingClientRect();
    const w = Math.floor(width);
    const h = Math.floor(height);
    
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const effectiveSpeed = isReducedMotion ? 0 : Math.min(speed, 100) * 0.001;
    pixels = [];

    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dx = x - w / 2;
        const dy = y - h / 2;
        const delay = isReducedMotion ? 0 : Math.sqrt(dx * dx + dy * dy) * 0.65;
        pixels.push(createPixel(x, y, color, effectiveSpeed, delay));
      }
    }
  };

  const animate = (mode) => {
    cancelAnimationFrame(animationRef);
    const frameInterval = 1000 / 60;

    const loop = () => {
      animationRef = requestAnimationFrame(loop);

      const now = performance.now();
      const elapsed = now - lastFrame;
      if (elapsed < frameInterval) return;
      lastFrame = now - (elapsed % frameInterval);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const pixel of pixels) {
        pixel[mode]();
      }

      if (pixels.every((p) => p.isIdle)) {
        cancelAnimationFrame(animationRef);
      }
    };

    animationRef = requestAnimationFrame(loop);
  };

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        cancelAnimationFrame(animationRef);
        init();
        animate("appear");
    }, 150);
  });

  // Initialize and start animation
  init();
  animate("appear");
});
