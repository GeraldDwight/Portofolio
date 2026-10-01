document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  root.classList.add('js');

  const header = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  // Menu mobile
  const setMenu = (open) => {
    if (!menuToggle || !navLinks) return;
    navLinks.classList.toggle('active', open);
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  };
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('active')));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    document.addEventListener('click', e => { if (!header.contains(e.target)) setMenu(false); });
  }

  // Bayangan tipis pada navbar saat halaman digulir
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Tandai menu sesuai bagian yang sedang dibaca
  if (navLinks && 'IntersectionObserver' in window) {
    const links = [...navLinks.querySelectorAll('a[href^="#"]')];
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(a => a.classList.toggle('current', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    links.forEach(a => {
      const sec = document.querySelector(a.getAttribute('href'));
      if (sec) spy.observe(sec);
    });
  }

  // Munculkan proyek dan baris pengalaman perlahan saat digulir
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('in'));
  }

  // Gambar proyek: coba file lokal, lalu tangkapan layar otomatis, terakhir tampilkan nama proyek
  document.querySelectorAll('img[data-fb]').forEach(img => {
    const next = () => {
      if (!img.dataset.t) { img.dataset.t = '1'; img.src = img.dataset.fb; }
      else { img.remove(); }
    };
    img.addEventListener('error', next);
    if (img.complete && img.naturalWidth === 0) next();
  });

  // Tahun otomatis di footer
  const year = document.getElementById('currentYear');
  if (year) year.textContent = new Date().getFullYear();
});
