/**
 * SD Inpres 168 Romangtanngaya — Main JavaScript
 * Handles: Sidebar toggle, scroll animations, nav highlighting, back-to-top
 */

import './styles/index.css';

document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebarClose = document.getElementById('sidebar-close');
    const navLinks = document.querySelectorAll('.navbar__link');
    const sidebarLinks = document.querySelectorAll('.sidebar__link');
    const backToTop = document.getElementById('back-to-top');
    const header = document.getElementById('header');
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero, .stats');
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const statNumbers = document.querySelectorAll('.stats__number');


    // === Sidebar Toggle (Mobile) ===
    function openSidebar() {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        hamburgerBtn.classList.add('active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburgerBtn.addEventListener('click', () => {
        if (sidebar.classList.contains('active')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    // Close sidebar on link click
    sidebarLinks.forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    // Close sidebar on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });


    // === Sticky Header Logic ===
    let lastScroll = 0;

    function handleHeaderScroll() {
        const currentScroll = window.scrollY;
        const headerHeight = header.offsetHeight;

        if (currentScroll > headerHeight) {
            // Past header — stick navbar at top
            navbar.style.top = '0';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            // At top — navbar below header
            navbar.style.top = '';
            navbar.style.boxShadow = '';
        }

        // Back to top button
        if (currentScroll > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        lastScroll = currentScroll;
    }


    // === Active Nav Highlighting ===
    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const sectionId = section.getAttribute('id');
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Update navbar links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-nav') === sectionId) {
                        link.classList.add('active');
                    }
                });

                // Update sidebar links
                sidebarLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-nav') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }


    // === Scroll Animations (Intersection Observer) ===
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15,
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => scrollObserver.observe(el));


    // === Animated Counter ===
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        const statsSection = document.getElementById('stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;

            statNumbers.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'), 10);
                const duration = 2000;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out quad
                    const easedProgress = 1 - (1 - progress) * (1 - progress);
                    const current = Math.floor(easedProgress * target);

                    counter.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                }

                requestAnimationFrame(updateCounter);
            });
        }
    }


    // === Back to Top ===
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // === Scroll Event (throttled) ===
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleHeaderScroll();
                updateActiveNav();
                animateCounters();
                ticking = false;
            });
            ticking = true;
        }
    });


    // === Smooth Scroll for Nav Links ===
    const allNavLinks = [...navLinks, ...sidebarLinks];
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetEl = document.querySelector(href);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });


    // === Initial calls ===
    handleHeaderScroll();
    updateActiveNav();
});
