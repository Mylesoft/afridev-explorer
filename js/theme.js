const THEME_KEY = 'afridev-theme';

function getPreferredTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme = getPreferredTheme()) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute('content', theme === 'dark' ? '#0f172a' : '#1A395B');
  }

  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    const isDark = theme === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.innerHTML = `
      <span class="theme-toggle__icon" aria-hidden="true">${isDark ? 'sunny' : 'dark_mode'}</span>
      <span class="theme-toggle__label">${isDark ? 'Light' : 'Dark'}</span>
    `;
  }
}

export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

export function ensureThemeToggle() {
  const navbar = document.querySelector('.navbar');
  if (!navbar || navbar.querySelector('.theme-toggle')) {
    return;
  }

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'theme-toggle';
  toggle.addEventListener('click', toggleTheme);
  navbar.insertBefore(toggle, navbar.querySelector('.rate-limit-bar'));
  applyTheme(document.documentElement.getAttribute('data-theme') || getPreferredTheme());
}

export function initTheme() {
  applyTheme(getPreferredTheme());
  ensureThemeToggle();
}
