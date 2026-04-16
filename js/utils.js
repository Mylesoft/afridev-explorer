/**
 * UTILS.JS - Utility Functions
 * Helpers: debounce, cache, sanitize, format, pagination
 */

/**
 * Sanitize a string to prevent XSS attacks
 * @param {string} str - The string to sanitize
 * @returns {string} - Sanitized string with HTML tags escaped
 */
export function sanitize(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Debounce a function
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Format a number to human-readable format
 * @param {number} n - The number to format
 * @returns {string} - Formatted number (1000 -> '1k', 1200000 -> '1.2M')
 */
export function formatNumber(n) {
  if (n === null || n === undefined || isNaN(n)) return '0';
  const num = parseInt(n, 10);
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
}

/**
 * Convert ISO date to "time ago" format
 * @param {string} dateString - ISO date string
 * @returns {string} - Human-readable time difference (e.g., '3 days ago')
 */
export function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = Date.now();
  const seconds = Math.floor((now - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval === 1 ? '1 year ago' : interval + ' years ago';

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval === 1 ? '1 month ago' : interval + ' months ago';

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval === 1 ? '1 day ago' : interval + ' days ago';

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval === 1 ? '1 hour ago' : interval + ' hours ago';

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval === 1 ? '1 minute ago' : interval + ' minutes ago';

  return 'just now';
}

/**
 * Get a query parameter from the URL
 * @param {string} key - The parameter key
 * @returns {string | null} - The parameter value or null
 */
export function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

/**
 * Set data in sessionStorage with TTL
 * @param {string} key - The key
 * @param {any} data - The data to store (will be JSON stringified)
 * @param {number} ttl - Time to live in milliseconds
 */
export function setCache(key, data, ttl = 3600000) {
  const item = {
    value: data,
    expiry: Date.now() + ttl
  };
  sessionStorage.setItem(key, JSON.stringify(item));
}

/**
 * Get data from sessionStorage
 * @param {string} key - The key
 * @returns {any | null} - The stored data or null if expired/missing
 */
export function getCache(key) {
  const item = sessionStorage.getItem(key);
  if (!item) return null;

  const parsed = JSON.parse(item);
  if (Date.now() > parsed.expiry) {
    sessionStorage.removeItem(key);
    return null;
  }

  return parsed.value;
}

/**
 * Get the color associated with a programming language
 * @param {string} lang - The language name
 * @returns {string} - Hex color code
 */
export function getLanguageColor(lang) {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    PHP: '#777bb4',
    C: '#555555',
    'C++': '#f34b7d',
    Ruby: '#701516',
    Swift: '#fa7343',
    Kotlin: '#7f52ff',
  };
  return colors[lang] || '#858585';
}

/**
 * Calculate max pages capped at GitHub's 1,000 result limit
 * @param {number} totalCount - Total results from API
 * @param {number} perPage - Results per page
 * @returns {number} - Maximum page number
 */
export function getMaxPages(totalCount, perPage = 12) {
  const cappedTotal = Math.min(totalCount, 1000);
  return Math.ceil(cappedTotal / perPage);
}

/**
 * Detect keywords in bio to identify developer types
 * @param {string} bio - GitHub bio text
 * @returns {Object} - Keywords found (isOpenToWork, isCoFounder, isHiring)
 */
export function detectBioKeywords(bio = '') {
  const lower = bio.toLowerCase();
  return {
    isOpenToWork: /open to work|available for hire|seeking opportunities|freelance|contractor/.test(lower),
    isCoFounder:  /co-?founder|cofounder|looking to build|seeking co-?founder/.test(lower),
    isHiring:     /hiring|we'?re hiring|join my team|open roles|join us/.test(lower),
  };
}

/**
 * Get bookmarked developers from localStorage
 * @returns {Array} - Array of bookmarked usernames
 */
export function getBookmarks() {
  return JSON.parse(localStorage.getItem('afridev_bookmarks') || '[]');
}

/**
 * Toggle bookmark for a developer
 * @param {string} username - GitHub username
 * @returns {boolean} - True if bookmarked, false if removed
 */
export function toggleBookmark(username) {
  const saved   = getBookmarks();
  const updated = saved.includes(username)
    ? saved.filter(u => u !== username)
    : [...saved, username];
  localStorage.setItem('afridev_bookmarks', JSON.stringify(updated));
  return updated.includes(username);
}

/**
 * Check if a developer is bookmarked
 * @param {string} username - GitHub username
 * @returns {boolean} - True if bookmarked
 */
export function isBookmarked(username) {
  return getBookmarks().includes(username);
}

/**
 * Export bookmarks as JSON file
 * Downloads a JSON file with array of bookmarked usernames
 */
export function exportBookmarks() {
  const bookmarks = getBookmarks();
  const data = JSON.stringify(bookmarks, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'afridev-bookmarks.json';
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Copy profile link to clipboard
 * @param {string} username - GitHub username
 */
export async function copyProfileLink(username) {
  const url = `${window.location.origin}/afridev-explorer/profile.html?user=${username}`;
  await navigator.clipboard.writeText(url);
}

/**
 * Get search history from localStorage
 * @returns {Array} - Array of recent search terms
 */
export function getSearchHistory() {
  return JSON.parse(localStorage.getItem('afridev_search_history') || '[]');
}

/**
 * Add term to search history
 * @param {string} term - Search term to add
 */
export function addToSearchHistory(term) {
  if (!term.trim()) return;
  const history = getSearchHistory().filter(h => h !== term);
  history.unshift(term);
  localStorage.setItem('afridev_search_history', JSON.stringify(history.slice(0, 10)));
}

/**
 * Build date filter string for API query
 * @param {string} from - Start date (YYYY-MM-DD)
 * @param {string} to - End date (YYYY-MM-DD)
 * @returns {string} - Formatted date filter for API
 */
export function buildDateFilter(from, to) {
  if (!from) return '';
  const end = to || new Date().toISOString().split('T')[0];
  return `+created:${from}..${end}`;
}

/**
 * Update rate limit bar display
 * Shows remaining API calls with color coding
 */
export function updateRateLimitBar() {
  const bar   = document.querySelector('.rate-limit-fill');
  const label = document.querySelector('.rate-limit-label');
  if (!bar) return;
  const remaining = window.__rateLimitRemaining ?? 60;
  const pct = (remaining / 60) * 100;
  bar.style.width      = `${pct}%`;
  bar.style.background = pct > 40 ? 'var(--color-success)'
    : pct > 15 ? 'var(--color-accent)' : 'var(--color-danger)';
  if (label) label.textContent = `${remaining}/60 API calls`;
}
