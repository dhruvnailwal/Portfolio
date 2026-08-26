// ===== Dhruv Nailwal Portfolio — shared behavior for all pages =====

// Loader (present on Home only; guarded so other pages are unaffected)
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hide');
    setTimeout(() => loader.remove(), 500);
  }, 1600);
});

// Navbar + scroll progress + back-to-top visibility
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('progress');
const scrollTopBtn = document.getElementById('scrolltop');

function onScroll() {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 400);
  if (progressBar) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Mobile nav =====
// Single hamburger control: toggles an animated full-screen overlay,
// swaps its own icon, locks page scroll while open.
const mobileNav = document.getElementById('mobileNav');
const navToggle = document.getElementById('navToggle');

function setMenu(open) {
  if (!mobileNav || !navToggle) return;
  mobileNav.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.textContent = open ? '\u2715' : '\u2630'; // ✕ / ☰
  document.body.classList.toggle('menu-open', open);
}

if (mobileNav && navToggle) {
  navToggle.addEventListener('click', () => {
    setMenu(!mobileNav.classList.contains('open'));
  });

  // Close when a menu link is tapped
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });

  // Close with Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      setMenu(false);
      navToggle.focus();
    }
  });

  // Auto-close if resized up to the desktop breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mobileNav.classList.contains('open')) setMenu(false);
  }, { passive: true });
}

// Typing animation (Home hero only)
(function () {
  const typEl = document.getElementById('typingText');
  if (!typEl) return;

  const texts = ['Computer Science Student', 'Aspiring Software Developer', 'C/C++ Programmer', 'Open Source Contributor', 'Tech Enthusiast', 'Problem Solver'];
  let ti = 0, ci = 0, del = false;

  function type() {
    const cur = texts[ti];
    if (!del) {
      typEl.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { del = true; setTimeout(type, 1800); return; }
      setTimeout(type, 70);
    } else {
      typEl.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; ti = (ti + 1) % texts.length; setTimeout(type, 300); return; }
      setTimeout(type, 35);
    }
  }
  type();
})();

// Scroll-reveal animations (+ skill bars / counters when present)
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      e.target.querySelectorAll('.skill-fill').forEach(b => {
        b.style.width = b.dataset.pct + '%';
      });
      e.target.querySelectorAll('.counter').forEach(c => {
        const target = +c.dataset.target;
        let cur = 0;
        const step = Math.ceil(target / 50);
        const interval = setInterval(() => {
          cur = Math.min(cur + step, target);
          c.textContent = cur + (target >= 100 ? '+' : '');
          if (cur >= target) clearInterval(interval);
        }, 30);
      });
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in,.fade-left').forEach(el => obs.observe(el));
document.querySelectorAll('section,#stats').forEach(s => obs.observe(s));

// Back to top
function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
