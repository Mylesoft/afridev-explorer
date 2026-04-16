// navbar.js - shared across all pages
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Hamburger toggle
menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('nav-open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  menuToggle.textContent = isOpen ? '×' : '|||';
});

// Close nav when clicking outside
document.addEventListener('click', e => {
  if (!e.target.closest('.navbar')) navLinks?.classList.remove('nav-open');
});

// Highlight active page in navbar
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const shortcuts = {
    '/': () => document.querySelector('.search-input')?.focus(),
    'd': () => { window.location.href = 'developers.html'; },
    'r': () => { window.location.href = 'repositories.html'; },
    'a': () => { window.location.href = 'activity.html'; },
    'b': () => { window.location.href = 'developers.html#bookmarks'; },
    '?': () => document.querySelector('.shortcuts-modal')?.classList.toggle('open'),
    'Escape': () => {
      document.querySelector('.modal.open')?.classList.remove('open');
      document.querySelector('.shortcuts-modal.open')?.classList.remove('open');
    },
  };
  const handler = shortcuts[e.key];
  if (handler) { e.preventDefault(); handler(); }
});
