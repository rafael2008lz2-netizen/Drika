// ambient.js - Premium Ambient Background Motion using Anime.js
document.addEventListener("DOMContentLoaded", () => {
    // Check if anime.js is loaded
    if (typeof anime === 'undefined') {
        console.error("Anime.js is not loaded.");
        return;
    }

    // Abstract fluid motion for Orb 1 (Top Left)
    anime({
        targets: '.orb-1',
        translateX: () => anime.random(-150, 150),
        translateY: () => anime.random(-150, 150),
        scale: () => anime.random(0.8, 1.4),
        duration: () => anime.random(8000, 12000),
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true
    });

    // Abstract fluid motion for Orb 2 (Right Center)
    anime({
        targets: '.orb-2',
        translateX: () => anime.random(-200, 100),
        translateY: () => anime.random(-200, 200),
        scale: () => anime.random(0.9, 1.5),
        duration: () => anime.random(9000, 14000),
        easing: 'easeInOutQuad',
        direction: 'alternate',
        loop: true
    });

    // Abstract fluid motion for Orb 3 (Bottom Left)
    anime({
        targets: '.orb-3',
        translateX: () => anime.random(-100, 300),
        translateY: () => anime.random(-200, 100),
        scale: () => anime.random(0.8, 1.2),
        duration: () => anime.random(10000, 15000),
        easing: 'easeInOutCubic',
        direction: 'alternate',
        loop: true
    });

    // Abstract fluid motion for Orb 4 (Center)
    anime({
        targets: '.orb-4',
        translateX: () => anime.random(-300, 300),
        translateY: () => anime.random(-300, 300),
        scale: () => anime.random(1, 2),
        opacity: [0.05, 0.2],
        duration: () => anime.random(12000, 18000),
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true
    });
});
