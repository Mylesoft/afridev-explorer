import { initTheme } from './theme.js';
import { getGitHubToken, setGitHubToken, clearGitHubToken } from './api.js';
import { showToast } from './render.js';

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

function ensureTokenModal() {
  if (document.querySelector('.token-modal')) {
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'token-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="token-modal__backdrop" data-close-token="true"></div>
    <div class="token-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="token-title">
      <div class="token-modal__header">
        <h2 id="token-title">GitHub Token</h2>
        <button type="button" class="token-modal__close" data-close-token="true" aria-label="Close token settings">close</button>
      </div>
      <p class="token-modal__copy">Save a personal access token here to increase GitHub API limits for this browser.</p>
      <label class="token-modal__label" for="github-token-input">Personal access token</label>
      <input id="github-token-input" class="token-modal__input" type="password" placeholder="ghp_..." autocomplete="off">
      <div class="token-modal__actions">
        <button type="button" class="btn btn--accent" data-save-token="true">Save Token</button>
        <button type="button" class="btn btn--outline" data-clear-token="true">Remove Token</button>
      </div>
      <p class="token-modal__status"></p>
    </div>
  `;

  document.body.appendChild(modal);

  const input = modal.querySelector('#github-token-input');
  const status = modal.querySelector('.token-modal__status');
  if (input) {
    input.value = getGitHubToken();
  }
  if (status) {
    status.textContent = getGitHubToken() ? 'A token is currently saved in this browser.' : 'No token saved yet.';
  }

  modal.addEventListener('click', (event) => {
    if (event.target.closest('[data-close-token="true"]')) {
      closeTokenModal();
      return;
    }

    if (event.target.closest('[data-save-token="true"]')) {
      const token = input?.value || '';
      if (!token.trim()) {
        showToast('Enter a GitHub token first.', 'error');
        return;
      }
      setGitHubToken(token, true);
      if (status) {
        status.textContent = 'Token saved. Refresh the page to retry requests with the new limit.';
      }
      showToast('GitHub token saved in this browser.', 'success');
      return;
    }

    if (event.target.closest('[data-clear-token="true"]')) {
      clearGitHubToken();
      if (input) {
        input.value = '';
      }
      if (status) {
        status.textContent = 'Saved token removed from this browser.';
      }
      showToast('GitHub token removed.', 'success');
    }
  });
}

function openTokenModal() {
  const modal = document.querySelector('.token-modal');
  if (!modal) {
    return;
  }

  const input = modal.querySelector('#github-token-input');
  const status = modal.querySelector('.token-modal__status');
  if (input) {
    input.value = getGitHubToken();
  }
  if (status) {
    status.textContent = getGitHubToken() ? 'A token is currently saved in this browser.' : 'No token saved yet.';
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  input?.focus();
}

function closeTokenModal() {
  const modal = document.querySelector('.token-modal');
  if (!modal) {
    return;
  }

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
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

function ensureTokenButton() {
  const navbar = document.querySelector('.navbar');
  if (!navbar || navbar.querySelector('.token-toggle')) {
    return;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'token-toggle';
  button.setAttribute('aria-label', 'Open GitHub token settings');
  button.innerHTML = '<span aria-hidden="true">⌘</span>';
  button.addEventListener('click', openTokenModal);
  navbar.insertBefore(button, navbar.querySelector('.rate-limit-bar'));
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
      closeTokenModal();
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
  ensureTokenButton();
  ensureShortcutsModal();
  ensureTokenModal();
});
