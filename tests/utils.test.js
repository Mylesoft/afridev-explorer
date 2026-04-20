/**
 * UTILS.JS TESTS
 * Tests aligned with the current helper implementations.
 */

import {
  addToSearchHistory,
  buildDateFilter,
  clearSearchHistory,
  copyProfileLink,
  debounce,
  displaySearchHistory,
  exportBookmarks,
  formatNumber,
  getBookmarks,
  getCache,
  getLanguageColor,
  getMaxPages,
  getQueryParam,
  getSearchHistory,
  isBookmarked,
  removeFromSearchHistory,
  sanitize,
  setCache,
  timeAgo,
  toggleBookmark,
  updateRateLimitBar
} from '../js/utils.js';

describe('Utility Functions', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('sanitize', () => {
    test('escapes raw HTML instead of rendering it', () => {
      expect(sanitize('<script>alert("xss")</script>Hello')).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;Hello');
    });

    test('returns an empty string for nullish input', () => {
      expect(sanitize(null)).toBe('');
      expect(sanitize(undefined)).toBe('');
      expect(sanitize('')).toBe('');
    });
  });

  describe('debounce', () => {
    test('delays execution and keeps only the latest call', (done) => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 50);

      debouncedFn('first');
      debouncedFn('second');

      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith('second');
        done();
      }, 90);
    });
  });

  describe('formatNumber', () => {
    test('formats thousands and millions', () => {
      expect(formatNumber(1500)).toBe('1.5k');
      expect(formatNumber(1000)).toBe('1k');
      expect(formatNumber(1500000)).toBe('1.5M');
      expect(formatNumber(999999)).toBe('1000k');
    });

    test('returns 0 for invalid input', () => {
      expect(formatNumber(null)).toBe('0');
      expect(formatNumber(undefined)).toBe('0');
      expect(formatNumber('not a number')).toBe('0');
    });
  });

  describe('timeAgo', () => {
    beforeEach(() => {
      jest.spyOn(Date, 'now').mockReturnValue(new Date('2023-01-01T12:00:00Z').getTime());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('returns just now for sub-minute intervals', () => {
      expect(timeAgo('2023-01-01T11:59:30Z')).toBe('just now');
    });

    test('formats larger intervals', () => {
      expect(timeAgo('2023-01-01T11:58:00Z')).toBe('2 minutes ago');
      expect(timeAgo('2023-01-01T10:00:00Z')).toBe('2 hours ago');
      expect(timeAgo('2022-12-30T12:00:00Z')).toBe('2 days ago');
    });
  });

  describe('getLanguageColor', () => {
    test('returns known language colors and the current fallback', () => {
      expect(getLanguageColor('JavaScript')).toBe('#f1e05a');
      expect(getLanguageColor('Python')).toBe('#3572A5');
      expect(getLanguageColor('unknown')).toBe('#858585');
      expect(getLanguageColor(undefined)).toBe('#858585');
    });
  });

  describe('getQueryParam', () => {
    test('reads query params from the current URL', () => {
      window.location.search = '?user=testuser&page=2';

      expect(getQueryParam('user')).toBe('testuser');
      expect(getQueryParam('page')).toBe('2');
      expect(getQueryParam('missing')).toBeNull();
    });
  });

  describe('getMaxPages', () => {
    test('caps results at GitHubs 1000 result limit', () => {
      expect(getMaxPages(100, 10)).toBe(10);
      expect(getMaxPages(1200, 100)).toBe(10);
      expect(getMaxPages(0, 10)).toBe(0);
    });
  });

  describe('buildDateFilter', () => {
    test('builds the current created date filter string', () => {
      expect(buildDateFilter('2023-01-01', '2023-12-31')).toBe('+created:2023-01-01..2023-12-31');
    });

    test('fills in the end date when only from is provided', () => {
      const result = buildDateFilter('2023-01-01', '');
      expect(result).toMatch(/^\+created:2023-01-01\.\.\d{4}-\d{2}-\d{2}$/);
    });

    test('returns empty when no start date is provided', () => {
      expect(buildDateFilter('', '2023-12-31')).toBe('');
    });
  });

  describe('search history', () => {
    test('adds, reads, removes, and clears search history', () => {
      addToSearchHistory('react');
      addToSearchHistory('vue');

      expect(getSearchHistory()).toEqual(['vue', 'react']);

      removeFromSearchHistory('react');
      expect(getSearchHistory()).toEqual(['vue']);

      clearSearchHistory();
      expect(getSearchHistory()).toEqual([]);
    });
  });

  describe('bookmarks', () => {
    test('toggles bookmarks in localStorage', () => {
      expect(getBookmarks()).toEqual([]);
      expect(toggleBookmark('testuser')).toBe(true);
      expect(isBookmarked('testuser')).toBe(true);
      expect(getBookmarks()).toEqual(['testuser']);
      expect(toggleBookmark('testuser')).toBe(false);
      expect(isBookmarked('testuser')).toBe(false);
    });

    test('exports the current bookmark list as a download', () => {
      const objectUrl = 'blob:test';
      URL.createObjectURL = URL.createObjectURL || (() => objectUrl);
      URL.revokeObjectURL = URL.revokeObjectURL || (() => {});
      const createObjectURL = jest.spyOn(URL, 'createObjectURL').mockReturnValue(objectUrl);
      const revokeObjectURL = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
      const click = jest.fn();
      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        const element = originalCreateElement(tagName);
        if (tagName === 'a') {
          element.click = click;
        }
        return element;
      });

      toggleBookmark('user1');
      toggleBookmark('user2');
      exportBookmarks();

      expect(createObjectURL).toHaveBeenCalled();
      expect(click).toHaveBeenCalled();
      expect(revokeObjectURL).toHaveBeenCalledWith(objectUrl);
    });
  });

  describe('copyProfileLink', () => {
    test('copies the current profile URL to the clipboard', async () => {
      const writeText = jest.fn().mockResolvedValue();
      navigator.clipboard.writeText = writeText;
      window.location.origin = 'http://localhost:8080';
      window.location.pathname = '/developers.html';

      await copyProfileLink('testuser');

      expect(writeText).toHaveBeenCalledWith('http://localhost:8080/profile.html?user=testuser');
    });
  });

  describe('cache helpers', () => {
    test('stores and retrieves session cache entries', () => {
      setCache('test_key', { key: 'value' }, 60000);
      expect(getCache('test_key')).toEqual({ key: 'value' });
    });

    test('removes expired cache entries', () => {
      sessionStorage.setItem('expired', JSON.stringify({
        value: { key: 'value' },
        expiry: Date.now() - 1000
      }));

      expect(getCache('expired')).toBeNull();
      expect(sessionStorage.getItem('expired')).toBeNull();
    });
  });

  describe('updateRateLimitBar', () => {
    test('updates the shared rate limit bar from window state', () => {
      document.body.innerHTML = `
        <div class="rate-limit-fill"></div>
        <div class="rate-limit-label"></div>
      `;
      window.__rateLimitRemaining = 45;

      updateRateLimitBar();

      expect(document.querySelector('.rate-limit-fill').style.width).toBe('75%');
      expect(document.querySelector('.rate-limit-label').textContent).toBe('45/60 API calls');
    });
  });

  describe('displaySearchHistory', () => {
    test('renders a dropdown when history exists', () => {
      addToSearchHistory('react');
      addToSearchHistory('python');

      const input = document.createElement('input');
      document.body.appendChild(input);

      displaySearchHistory(input, jest.fn());

      const dropdown = document.querySelector('.search-history-dropdown');
      expect(dropdown).toBeTruthy();
      expect(dropdown.textContent).toContain('react');
      expect(dropdown.textContent).toContain('python');
    });
  });
});
