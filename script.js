// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Parallax & Text Reveal
const heroTimeline = gsap.timeline();

heroTimeline
    .to('.hero-img', {
        scale: 1,
        duration: 1.5,
        ease: 'power2.out'
    })
    .from('h1', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=1')
    .to('.subtitle', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.5');

// Parallax effect on scroll for hero image
gsap.to('.hero-img', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// Text Reveal for Intro
const splitText = document.querySelectorAll('.big-text');
splitText.forEach((char, i) => {
    gsap.from(char, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: char,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Project Cards Animation
const projects = document.querySelectorAll('.project-card');
projects.forEach((project, i) => {
    gsap.from(project, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: project,
            start: 'top 85%',
        }
    });
});

// Custom Cursor Logic
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX - 10,
        y: e.clientY - 10,
        duration: 0.1,
        ease: 'power2.out'
    });
});

// Hover effects for cursor
const hoverLinks = document.querySelectorAll('a, .project-card');
hoverLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
            scale: 2,
            backgroundColor: '#D95D39', // Accent color
            duration: 0.3
        });
    });
    link.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
            scale: 1,
            backgroundColor: '#D95D39',
            duration: 0.3
        });
    });
});
