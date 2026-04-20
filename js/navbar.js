import { initTheme } from './theme.js';

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

function ensureShortcutsModal() {
  if (document.querySelector('.shortcuts-modal')) {
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'shortcuts-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="shortcuts-modal__backdrop" data-close-shortcuts="true"></div>
    <div class="shortcuts-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="shortcuts-title">
      <div class="shortcuts-modal__header">
        <h2 id="shortcuts-title">Keyboard shortcuts</h2>
        <button type="button" class="shortcuts-modal__close" data-close-shortcuts="true" aria-label="Close shortcuts">close</button>
      </div>
      <div class="shortcuts-list">
        <div class="shortcuts-item"><kbd>/</kbd><span>Focus search</span></div>
        <div class="shortcuts-item"><kbd>d</kbd><span>Open developers</span></div>
        <div class="shortcuts-item"><kbd>r</kbd><span>Open repositories</span></div>
        <div class="shortcuts-item"><kbd>a</kbd><span>Open activity</span></div>
        <div class="shortcuts-item"><kbd>?</kbd><span>Toggle shortcuts</span></div>
        <div class="shortcuts-item"><kbd>Esc</kbd><span>Close dialogs</span></div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', (event) => {
    if (event.target.closest('[data-close-shortcuts="true"]')) {
      closeShortcutsModal();
    }
  });
}

function openShortcutsModal() {
  const modal = document.querySelector('.shortcuts-modal');
  if (!modal) {
    return;
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeShortcutsModal() {
  const modal = document.querySelector('.shortcuts-modal');
  if (!modal) {
    return;
  }

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function closeMenu() {
  navLinks?.classList.remove('nav-open');
  if (menuToggle) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '|||';
  }
}

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('nav-open');
  menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  menuToggle.textContent = isOpen ? '×' : '|||';
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.navbar')) {
    closeMenu();
  }
});

const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach((link) => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
    return;
  }

  const shortcuts = {
    '/': () => document.querySelector('.search-input, #hero-search-input')?.focus(),
    d: () => { window.location.href = 'developers.html'; },
    r: () => { window.location.href = 'repositories.html'; },
    a: () => { window.location.href = 'activity.html'; },
    '?': () => {
      const modal = document.querySelector('.shortcuts-modal');
      if (modal?.classList.contains('open')) {
        closeShortcutsModal();
      } else {
        openShortcutsModal();
      }
    },
    Escape: () => {
      closeMenu();
      closeShortcutsModal();
      document.querySelector('.readme-preview.active')?.classList.remove('active');
    }
  };

  const handler = shortcuts[event.key];
  if (handler) {
    event.preventDefault();
    handler();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  ensureShortcutsModal();
});
