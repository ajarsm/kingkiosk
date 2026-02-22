/* ============================================
   KingKiosk Marketing Website - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initNavigation();
    initActiveSection();
    initCounters();
    initFeatureTabs();
    initMockClock();
});

/* === Scroll Reveal === */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animations for elements within the same section
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Add stagger delays to grouped elements
    document.querySelectorAll('.problem-grid .reveal, .platform-grid .reveal, .widget-grid .reveal, .server-features .reveal, .security-grid .reveal').forEach((el, i) => {
        el.dataset.delay = (i % 4) * 80;
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* === Navigation === */
function initNavigation() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        nav.classList.toggle('scrolled', scrollY > 50);
        lastScroll = scrollY;
    }, { passive: true });

    // Mobile toggle
    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
        toggle.classList.toggle('active');
    });

    // Close mobile menu on link click
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

/* === Active Section Tracking === */
function initActiveSection() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = [];

    // Build a map of nav links to their target sections
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const section = document.querySelector(href);
            if (section) {
                sections.push({ id: href.slice(1), el: section, link });
            }
        }
    });

    if (sections.length === 0) return;

    // Use IntersectionObserver with a rootMargin that considers the nav height.
    // A section is "active" when its top crosses into the upper portion of the viewport.
    // We track which sections are currently visible and pick the topmost one.
    const visibleSections = new Set();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            if (entry.isIntersecting) {
                visibleSections.add(id);
            } else {
                visibleSections.delete(id);
            }
        });

        // Of all visible sections, pick the one closest to the top of the viewport
        let activeId = null;
        let bestTop = Infinity;

        visibleSections.forEach(id => {
            const section = sections.find(s => s.id === id);
            if (section) {
                const rect = section.el.getBoundingClientRect();
                // Prefer the section whose top is closest to (but above) the viewport center
                const distance = Math.abs(rect.top);
                if (distance < bestTop) {
                    bestTop = distance;
                    activeId = id;
                }
            }
        });

        // Update nav links
        navLinks.forEach(link => link.classList.remove('active'));
        if (activeId) {
            const match = sections.find(s => s.id === activeId);
            if (match) match.link.classList.add('active');
        }
    }, {
        // Trigger when a section enters/leaves the top 30% of the viewport
        rootMargin: '-80px 0px -65% 0px',
        threshold: 0
    });

    sections.forEach(s => observer.observe(s.el));
}

/* === Counter Animation === */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

/* === Feature Tabs === */
function initFeatureTabs() {
    const tabs = document.querySelectorAll('.feature-tab');
    const panels = document.querySelectorAll('.feature-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = `panel-${tab.dataset.tab}`;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            panels.forEach(p => {
                p.classList.remove('active');
                if (p.id === targetId) {
                    p.classList.add('active');
                    // Re-trigger animations for tile boxes
                    p.querySelectorAll('.tile-box').forEach((tile, i) => {
                        tile.style.opacity = '0';
                        tile.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            tile.style.transition = 'all 0.4s ease';
                            tile.style.opacity = '1';
                            tile.style.transform = 'scale(1)';
                        }, i * 80);
                    });
                }
            });
        });
    });
}

/* === Mock Clock === */
function initMockClock() {
    const clockEl = document.getElementById('mockTime');
    if (!clockEl) return;

    function updateClock() {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes().toString().padStart(2, '0');
        const h12 = h % 12 || 12;
        clockEl.textContent = `${h12}:${m}`;
    }

    updateClock();
    setInterval(updateClock, 30000);
}

/* === Particle / Ambient Effects === */
(function initAmbient() {
    // Subtle mouse-follow glow on hero
    const hero = document.getElementById('hero');
    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        hero.style.setProperty('--mx', `${x}%`);
        hero.style.setProperty('--my', `${y}%`);
    });
})();
