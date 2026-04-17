/**
 * THEME.JS - Dark Mode Toggle
 * Manages dark mode state and persistence
 */

const htmlElement = document.documentElement;
const darkToggle = document.querySelector('.dark-toggle');
const sunIcon = document.querySelector('.icon-sun');
const moonIcon = document.querySelector('.icon-moon');

// Initialize theme on page load
function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  setTheme(theme);
}

// Set theme
function setTheme(theme) {
  if (theme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
    sunIcon?.style.setProperty('display', 'none');
    moonIcon?.style.setProperty('display', 'inline');
  } else {
    htmlElement.removeAttribute('data-theme');
    sunIcon?.style.setProperty('display', 'inline');
    moonIcon?.style.setProperty('display', 'none');
  }
  localStorage.setItem('theme', theme);
}

// Toggle theme
if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    const current = htmlElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });
}

initTheme();
