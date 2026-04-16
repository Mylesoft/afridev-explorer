/**
 * UTILS.TEST.JS - Unit tests for utility functions
 */

import {
  sanitize,
  debounce,
  formatNumber,
  timeAgo,
  getQueryParam,
  setCache,
  getCache,
  getLanguageColor,
  getMaxPages
} from '../js/utils.js';

describe('utils.js', () => {
  describe('sanitize', () => {
    test('should escape HTML tags', () => {
      const result = sanitize('<script>alert("xss")</script>');
      expect(result).not.toContain('<script>');
    });

    test('should handle null gracefully', () => {
      expect(sanitize(null)).toBe('');
    });

    test('should handle plain text', () => {
      const text = 'Hello World';
      expect(sanitize(text)).toBe(text);
    });

    test('should escape angle brackets', () => {
      const result = sanitize('<div>test</div>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    test('should delay function execution', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 100);
      debounced();
      expect(fn).not.toHaveBeenCalled();
      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('should cancel previous calls on new call', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 50);
      debounced();
      debounced();
      debounced();
      expect(fn).not.toHaveBeenCalled();
      jest.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.useRealTimers();
    });
  });

  describe('formatNumber', () => {
    test('should format thousands with k', () => {
      expect(formatNumber(1000)).toBe('1k');
      expect(formatNumber(1500)).toBe('1.5k');
    });

    test('should format millions with M', () => {
      expect(formatNumber(1000000)).toBe('1M');
      expect(formatNumber(1500000)).toBe('1.5M');
    });

    test('should handle numbers under 1000', () => {
      expect(formatNumber(999)).toBe('999');
      expect(formatNumber(100)).toBe('100');
    });

    test('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    test('should handle null and undefined', () => {
      expect(formatNumber(null)).toBe('0');
      expect(formatNumber(undefined)).toBe('0');
      expect(formatNumber(NaN)).toBe('0');
    });
  });

  describe('getMaxPages', () => {
    test('should cap at 1000 results', () => {
      const result = getMaxPages(5000, 12);
      expect(result).toBeLessThanOrEqual(Math.ceil(1000 / 12));
    });

    test('should calculate correct pages', () => {
      expect(getMaxPages(100, 10)).toBe(10);
      expect(getMaxPages(50, 12)).toBe(5);
    });

    test('should handle default perPage', () => {
      expect(getMaxPages(200)).toBe(Math.ceil(200 / 12));
    });
  });

  describe('getLanguageColor', () => {
    test('should return color for known languages', () => {
      expect(getLanguageColor('JavaScript')).toBe('#f1e05a');
      expect(getLanguageColor('Python')).toBe('#3572A5');
      expect(getLanguageColor('Go')).toBe('#00ADD8');
    });

    test('should return gray for unknown', () => {
      expect(getLanguageColor('UnknownLang')).toBe('#858585');
    });

    test('should handle case-insensitive', () => {
      expect(getLanguageColor('javascript')).toBe('#f1e05a');
      expect(getLanguageColor('PYTHON')).toBe('#3572A5');
    });
  });

  describe('timeAgo', () => {
    beforeEach(() => {
      // Mock Date.now to return a fixed timestamp
      jest.spyOn(Date, 'now').mockImplementation(() => new Date('2023-01-15T12:00:00Z').getTime());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should format seconds ago', () => {
      const result = timeAgo('2023-01-15T11:59:30Z');
      expect(result).toBe('just now');
    });

    test('should format minutes ago', () => {
      const result = timeAgo('2023-01-15T11:58:00Z');
      expect(result).toBe('2 minutes ago');
    });

    test('should format hours ago', () => {
      const result = timeAgo('2023-01-15T08:00:00Z');
      expect(result).toBe('4 hours ago');
    });

    test('should format days ago', () => {
      const result = timeAgo('2023-01-13T12:00:00Z');
      expect(result).toBe('2 days ago');
    });

    test('should format months ago', () => {
      const result = timeAgo('2022-12-15T12:00:00Z');
      expect(result).toBe('1 month ago');
    });

    test('should format years ago', () => {
      const result = timeAgo('2021-01-15T12:00:00Z');
      expect(result).toBe('2 years ago');
    });

    test('should handle singular forms', () => {
      const result1 = timeAgo('2023-01-14T12:00:00Z');
      expect(result1).toBe('1 day ago');
      
      const result2 = timeAgo('2022-01-15T12:00:00Z');
      expect(result2).toBe('1 year ago');
    });
  });

  describe('getQueryParam', () => {
    beforeEach(() => {
      // Mock URLSearchParams
      global.URLSearchParams = jest.fn().mockImplementation((query) => ({
        get: jest.fn((key) => {
          const params = new Map([
            ['user', 'testuser'],
            ['page', '2'],
            ['empty', '']
          ]);
          return params.get(key);
        })
      }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should return parameter value', () => {
      const result = getQueryParam('user');
      expect(result).toBe('testuser');
    });

    test('should return null for missing parameter', () => {
      const result = getQueryParam('nonexistent');
      expect(result).toBeNull();
    });

    test('should return empty string for empty parameter', () => {
      const result = getQueryParam('empty');
      expect(result).toBe('');
    });
  });

  describe('Cache functions', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    test('setCache and getCache should persist data', () => {
      setCache('testKey', { data: 'value' }, 1000);
      const result = getCache('testKey');
      expect(result).toEqual({ data: 'value' });
    });

    test('getCache should return null for expired data', (done) => {
      setCache('expireKey', { data: 'value' }, 100);
      setTimeout(() => {
        const result = getCache('expireKey');
        expect(result).toBeNull();
        done();
      }, 150);
    });

    test('getCache should return null for missing key', () => {
      expect(getCache('nonExistent')).toBeNull();
    });

    test('setCache should use default TTL', () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      
      setCache('defaultKey', 'test');
      const stored = sessionStorage.getItem('defaultKey');
      const parsed = JSON.parse(stored);
      
      expect(parsed.expiry).toBe(now + 3600000); // 1 hour default
      jest.restoreAllMocks();
    });
  });
});
