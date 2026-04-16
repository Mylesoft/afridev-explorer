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
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

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
  return colors[lang] || '#999999';
}

/**
 * Calculate max pages capped at GitHub's 1,000 result limit
 * @param {number} totalCount - Total results from API
 * @param {number} per Page
   - Results per page
 * @returns {number} - Maximum page number
 */
export function getMaxPages(totalCount, perPage = 12) {
  const cappedTotal = Math.min(totalCount, 1000);
  return Math.ceil(cappedTotal / perPage);
}
