document.addEventListener('DOMContentLoaded', () => {
    const themePage = document.querySelector('.landing-body, .portfolio-body');
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = themeToggle?.querySelector('.theme-label');

    if (themePage && themeToggle && themeLabel) {
        const setTheme = (isNight) => {
            themePage.classList.toggle('is-night', isNight);
            themeToggle.setAttribute('aria-pressed', String(isNight));
            themeToggle.setAttribute('aria-label', isNight ? 'Aktifkan tema terang' : 'Aktifkan tema gelap');
            themeLabel.textContent = isNight ? 'Mode terang' : 'Mode malam';
        };

        setTheme(localStorage.getItem('landing-theme') === 'night');
        themeToggle.addEventListener('click', () => {
            const isNight = !themePage.classList.contains('is-night');
            setTheme(isNight);
            localStorage.setItem('landing-theme', isNight ? 'night' : 'day');
        });
    }

    const localTime = document.getElementById('localTime');
    if (localTime) {
        const updateLocalTime = () => {
            localTime.textContent = new Intl.DateTimeFormat('id-ID', {
                timeZone: 'Asia/Jakarta',
                hour: '2-digit',
                minute: '2-digit',
                hourCycle: 'h23'
            }).format(new Date());
        };

        updateLocalTime();
        window.setInterval(updateLocalTime, 60000);
    }

    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        const setMenuOpen = (isOpen) => {
            navLinks.classList.toggle('active', isOpen);
            menuToggle.classList.toggle('open', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
        };

        menuToggle.addEventListener('click', () => setMenuOpen(!navLinks.classList.contains('active')));

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenuOpen(false));
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') setMenuOpen(false);
        });
    }

    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(element => revealObserver.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add('active'));
    }

    document.querySelectorAll('.preview-screen img').forEach(image => {
        const useFallback = () => {
            const fallback = image.dataset.fallback;
            if (fallback && !image.dataset.fallbackAttempted) {
                image.dataset.fallbackAttempted = 'true';
                image.src = fallback;
                return;
            }

            image.closest('.preview-screen')?.classList.add('is-unavailable');
            image.hidden = true;
        };

        image.addEventListener('error', useFallback);
        if (image.complete && image.naturalWidth === 0) useFallback();
    });

    const readingProgress = document.getElementById('readingProgress');
    const backToTop = document.getElementById('backToTop');
    let scrollUpdateQueued = false;

    const updateScrollFeatures = () => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

        if (readingProgress) readingProgress.style.width = `${Math.min(progress, 100)}%`;
        if (backToTop) backToTop.classList.toggle('is-visible', window.scrollY > 420);
        scrollUpdateQueued = false;
    };

    window.addEventListener('scroll', () => {
        if (!scrollUpdateQueued) {
            window.requestAnimationFrame(updateScrollFeatures);
            scrollUpdateQueued = true;
        }
    }, { passive: true });
    updateScrollFeatures();

    backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const sectionLinks = [...document.querySelectorAll('.portfolio-nav a[href^="#"]')];
    if (sectionLinks.length && 'IntersectionObserver' in window) {
        const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                sectionLinks.forEach(link => {
                    const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
                    link.classList.toggle('is-current', isCurrent);
                    if (isCurrent) link.setAttribute('aria-current', 'location');
                    else link.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-25% 0px -65% 0px' });

        sections.forEach(section => sectionObserver.observe(section));
    }

    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
