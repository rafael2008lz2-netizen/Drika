// particles.js - Premium Interactive Canvas Background
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    canvas.id = "hero-canvas";
    
    // Select the hero section and insert canvas before hero-overlay
    const hero = document.getElementById("home");
    if(!hero) return;
    
    const overlay = hero.querySelector('.hero-overlay');
    hero.insertBefore(canvas, overlay);

    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Mouse properties
    const mouse = {
        x: null,
        y: null,
        radius: 180
    };

    // Make canvas responsive to resize
    function resize() {
        width = hero.clientWidth;
        height = hero.clientHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    // Track mouse over the hero section specifically
    hero.addEventListener('mousemove', function(event) {
        const rect = hero.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', function() {
        mouse.x = null;
        mouse.y = null;
    });
    
    window.addEventListener('resize', resize);

    // Particle class
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Check canvas boundaries
            if (this.x > width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Interactive mouse collision detection
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            // Magic numbers for repel effect
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            
            // If mouse is close enough, repel the particles
            if (distance < mouse.radius) {
                this.x -= forceDirectionX * force * this.density * 0.6;
                this.y -= forceDirectionY * force * this.density * 0.6;
            } else {
                // Gently return to original path
                if(this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 50;
                }
                if(this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 50;
                }
            }

            // Normal movement
            this.x += this.directionX;
            this.y += this.directionY;

            this.draw();
        }
    }

    function initParticles() {
        particles = [];
        // Adjust density based on screen size
        let numberOfParticles = (width * height) / 9000;
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 1.5) + 0.5;
            let x = (Math.random() * ((width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = 'rgba(255, 255, 255, 0.4)'; // Subtle silver/white
            
            particles.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Draw lines between nearby particles
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) + 
                               ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                if (distance < (width/7) * (height/7)) {
                    opacityValue = 1 - (distance / 15000);
                    ctx.strokeStyle = 'rgba(255, 255, 255, ' + opacityValue * 0.15 + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        connect();
    }

    // Initialize
    resize();
    animate();
});
