// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// GSAP Setup
gsap.registerPlugin(ScrollTrigger);

// Cursor Logic
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX - 5,
        y: e.clientY - 5,
        duration: 0.1
    });
    gsap.to(follower, {
        x: e.clientX - 20,
        y: e.clientY - 20,
        duration: 0.3
    });
});

// Hero Animations
const heroTl = gsap.timeline();
heroTl
    .from('.hero-title .line', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out'
    })
    .from('.hero-desc', {
        opacity: 0,
        y: 20,
        duration: 1
    }, '-=0.5')
    .from('.vision-stack span', {
        opacity: 0,
        x: 20,
        stagger: 0.1,
        duration: 0.8
    }, '-=0.8');

// Stats Counter Animation
const stats = document.querySelectorAll('.stat-num');
stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-val'));
    ScrollTrigger.create({
        trigger: stat,
        start: 'top 80%',
        onEnter: () => {
            gsap.to(stat, {
                innerHTML: target,
                duration: 2,
                snap: { innerHTML: 1 },
                onUpdate: function () {
                    stat.innerHTML = Math.ceil(this.targets()[0].innerHTML) + '+';
                }
            });
        }
    });
});

// Service Hover Effect
const services = document.querySelectorAll('.service-item');
services.forEach(service => {
    service.addEventListener('mouseenter', () => {
        gsap.to(follower, { scale: 2, borderColor: '#5D3FD3' });
    });
    service.addEventListener('mouseleave', () => {
        gsap.to(follower, { scale: 1, borderColor: 'rgba(255,255,255,0.5)' });
    });
});

// Process Accordion
const steps = document.querySelectorAll('.process-step');
steps.forEach(step => {
    step.addEventListener('click', () => {
        // Remove active class from all
        steps.forEach(s => s.classList.remove('active'));
        // Add to clicked
        step.classList.add('active');
    });
});

// FAQ Accordion
const faqs = document.querySelectorAll('.faq-item');
faqs.forEach(faq => {
    faq.addEventListener('click', () => {
        faq.classList.toggle('active');
    });
});

// Section Reveal
const sections = document.querySelectorAll('.section');
sections.forEach(section => {
    gsap.from(section.querySelector('.container'), {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: 'top 70%',
        }
    });
});
