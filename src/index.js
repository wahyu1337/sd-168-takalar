/**
 * SD Inpres 168 Romangtanngaya — Main JavaScript
 * Multi-page: sidebar toggle, URL-based nav highlighting,
 * scroll animations, back-to-top, galeri filter, counter animation
 */

import './styles/index.css';

// === Preloader ===
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('preloader--hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebarClose = document.getElementById('sidebar-close');
    const navLinks = document.querySelectorAll('.navbar__link');
    const sidebarLinks = document.querySelectorAll('.sidebar__link');
    const backToTop = document.getElementById('back-to-top');
    const navbar = document.getElementById('navbar');
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const statNumbers = document.querySelectorAll('.stats__number');


    // === URL-Based Active Nav Highlighting ===
    function setActiveNavByURL() {
        const path = window.location.pathname;

        // Determine current page from URL
        let currentPage = 'home';
        if (path.includes('/profil')) currentPage = 'profil';
        else if (path.includes('/visi')) currentPage = 'visi';
        else if (path.includes('/staff')) currentPage = 'staff';
        else if (path.includes('/informasi')) currentPage = 'informasi';
        else if (path.includes('/galeri')) currentPage = 'galeri';
        else if (path.includes('/kontak')) currentPage = 'kontak';

        // Highlight navbar links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === currentPage) {
                link.classList.add('active');
            }
        });

        // Highlight sidebar links
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    setActiveNavByURL();


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

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            if (sidebar.classList.contains('active')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });


    // === Sticky Navbar ===
    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar shadow on scroll
        if (navbar) {
            if (scrollY > 100) {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = '';
            }
        }

        // Back to top button
        if (backToTop) {
            if (scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
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


    // === Animated Counter (Home page stats) ===
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated || statNumbers.length === 0) return;

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
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // === Galeri Filter (Galeri page) ===
    const filterBtns = document.querySelectorAll('.galeri-filter__btn');
    const galeriItems = document.querySelectorAll('.galeri__item[data-category]');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter items
                galeriItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }


    // === Scroll Event (throttled) ===
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                animateCounters();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
    handleScroll();
});
