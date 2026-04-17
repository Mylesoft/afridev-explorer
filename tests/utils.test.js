/**
 * UTILS.JS TESTS
 * Unit tests for utility functions
 */

import {
  sanitize,
  debounce,
  formatNumber,
  timeAgo,
  getLanguageColor,
  getQueryParam,
  getMaxPages,
  buildDateFilter,
  getSearchHistory,
  addToSearchHistory,
  removeFromSearchHistory,
  clearSearchHistory,
  displaySearchHistory,
  getBookmark,
  addBookmark,
  removeBookmark,
  isBookmarked,
  toggleBookmark,
  exportBookmarks,
  copyProfileLink,
  setCache,
  getCache,
  updateRateLimitBar
} from '../js/utils.js';

describe('Utility Functions', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('sanitize', () => {
    test('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello World';
      const result = sanitize(input);
      expect(result).toBe('Hello World');
    });

    test('should handle null/undefined input', () => {
      expect(sanitize(null)).toBe('');
      expect(sanitize(undefined)).toBe('');
      expect(sanitize('')).toBe('');
    });

    test('should handle special characters', () => {
      const input = '&lt;script&gt;alert("xss")&lt;/script&gt;';
      const result = sanitize(input);
      expect(result).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
    });

    test('should preserve safe text', () => {
      const input = 'Hello, World! 123';
      const result = sanitize(input);
      expect(result).toBe('Hello, World! 123');
    });
  });

  describe('debounce', () => {
    test('should delay function execution', (done) => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();

      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledWith('test');
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 150);
    });

    test('should cancel previous calls', (done) => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      debouncedFn('second');

      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledWith('second');
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 150);
    });

    test('should handle immediate execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 0);

      debouncedFn('test');
      expect(mockFn).toHaveBeenCalledWith('test');
    });
  });

  describe('formatNumber', () => {
    test('should format large numbers with K suffix', () => {
      expect(formatNumber(1500)).toBe('1.5k');
      expect(formatNumber(1000)).toBe('1k');
      expect(formatNumber(999)).toBe('999');
    });

    test('should format very large numbers with M suffix', () => {
      expect(formatNumber(1500000)).toBe('1.5M');
      expect(formatNumber(1000000)).toBe('1M');
      expect(formatNumber(999999)).toBe('999.9k');
    });

    test('should handle edge cases', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(null)).toBe('0');
      expect(formatNumber(undefined)).toBe('0');
      expect(formatNumber('not a number')).toBe('0');
      expect(formatNumber(NaN)).toBe('0');
    });

    test('should remove decimal zeros', () => {
      expect(formatNumber(1000)).toBe('1k');
      expect(formatNumber(2000)).toBe('2k');
      expect(formatNumber(1000000)).toBe('1M');
    });
  });

  describe('timeAgo', () => {
    beforeEach(() => {
      // Mock current time
      jest.spyOn(Date, 'now').mockReturnValue(new Date('2023-01-01T12:00:00Z').getTime());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should format seconds ago', () => {
      const date = new Date('2023-01-01T11:59:30Z');
      expect(timeAgo(date.toISOString())).toBe('30 seconds ago');
    });

    test('should format minutes ago', () => {
      const date = new Date('2023-01-01T11:58:00Z');
      expect(timeAgo(date.toISOString())).toBe('2 minutes ago');
    });

    test('should format hours ago', () => {
      const date = new Date('2023-01-01T10:00:00Z');
      expect(timeAgo(date.toISOString())).toBe('2 hours ago');
    });

    test('should format days ago', () => {
      const date = new Date('2022-12-30T12:00:00Z');
      expect(timeAgo(date.toISOString())).toBe('2 days ago');
    });

    test('should format months ago', () => {
      const date = new Date('2022-11-01T12:00:00Z');
      expect(timeAgo(date.toISOString())).toBe('2 months ago');
    });

    test('should format years ago', () => {
      const date = new Date('2021-01-01T12:00:00Z');
      expect(timeAgo(date.toISOString())).toBe('2 years ago');
    });

    test('should handle invalid dates', () => {
      expect(timeAgo('invalid date')).toBe('Invalid date');
      expect(timeAgo(null)).toBe('Invalid date');
      expect(timeAgo(undefined)).toBe('Invalid date');
    });
  });

  describe('getLanguageColor', () => {
    test('should return correct colors for known languages', () => {
      expect(getLanguageColor('JavaScript')).toBe('#f1e05a');
      expect(getLanguageColor('Python')).toBe('#3572A5');
      expect(getLanguageColor('Java')).toBe('#b07219');
      expect(getLanguageColor('Go')).toBe('#00ADD8');
      expect(getLanguageColor('Rust')).toBe('#dea584');
    });

    test('should return default color for unknown languages', () => {
      expect(getLanguageColor('UnknownLanguage')).toBe('#ccc');
      expect(getLanguageColor('')).toBe('#ccc');
      expect(getLanguageColor(null)).toBe('#ccc');
      expect(getLanguageColor(undefined)).toBe('#ccc');
    });

    test('should handle case insensitive input', () => {
      expect(getLanguageColor('javascript')).toBe('#f1e05a');
      expect(getLanguageColor('PYTHON')).toBe('#3572A5');
    });
  });

  describe('getQueryParam', () => {
    beforeEach(() => {
      // Mock window.location.search
      Object.defineProperty(window, 'location', {
        value: {
          search: '?user=testuser&page=2&sort=stars'
        },
        writable: true
      });
    });

    test('should get query parameter value', () => {
      expect(getQueryParam('user')).toBe('testuser');
      expect(getQueryParam('page')).toBe('2');
      expect(getQueryParam('sort')).toBe('stars');
    });

    test('should return null for missing parameter', () => {
      expect(getQueryParam('missing')).toBeNull();
    });

    test('should handle empty query string', () => {
      window.location.search = '';
      expect(getQueryParam('user')).toBeNull();
    });
  });

  describe('getMaxPages', () => {
    test('should calculate maximum pages correctly', () => {
      expect(getMaxPages(100, 10)).toBe(10);
      expect(getMaxPages(95, 10)).toBe(10);
      expect(getMaxPages(101, 10)).toBe(11);
      expect(getMaxPages(0, 10)).toBe(0);
    });

    test('should handle edge cases', () => {
      expect(getMaxPages(-1, 10)).toBe(0);
      expect(getMaxPages(100, 0)).toBe(0);
      expect(getMaxPages(null, 10)).toBe(0);
      expect(getMaxPages(100, null)).toBe(0);
    });
  });

  describe('buildDateFilter', () => {
    test('should build date filter string', () => {
      const result = buildDateFilter('2023-01-01', '2023-12-31');
      expect(result).toBe('created:2023-01-01..2023-12-31');
    });

    test('should handle missing dates', () => {
      expect(buildDateFilter('', '2023-12-31')).toBe('');
      expect(buildDateFilter('2023-01-01', '')).toBe('');
      expect(buildDateFilter('', '')).toBe('');
    });

    test('should handle null/undefined dates', () => {
      expect(buildDateFilter(null, '2023-12-31')).toBe('');
      expect(buildDateFilter('2023-01-01', null)).toBe('');
      expect(buildDateFilter(null, null)).toBe('');
    });
  });

  describe('Search History Functions', () => {
    test('getSearchHistory should return empty array initially', () => {
      const history = getSearchHistory();
      expect(history).toEqual([]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('afridev_search_history');
    });

    test('addToSearchHistory should add search term', () => {
      addToSearchHistory('test search');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'afridev_search_history',
        JSON.stringify(['test search'])
      );
    });

    test('addToSearchHistory should limit history size', () => {
      // Mock existing history with 10 items
      localStorageMock.getItem.mockReturnValue(JSON.stringify(
        Array.from({ length: 10 }, (_, i) => `search ${i + 1}`)
      ));

      addToSearchHistory('new search');
      
      const setCall = localStorageMock.setItem.mock.calls.find(call => 
        call[0] === 'afridev_search_history'
      );
      
      const savedHistory = JSON.parse(setCall[1]);
      expect(savedHistory).toHaveLength(10);
      expect(savedHistory[0]).toBe('new search');
    });

    test('removeFromSearchHistory should remove specific term', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['search1', 'search2', 'search3']));
      
      removeFromSearchHistory('search2');
      
      const setCall = localStorageMock.setItem.mock.calls.find(call => 
        call[0] === 'afridev_search_history'
      );
      
      const savedHistory = JSON.parse(setCall[1]);
      expect(savedHistory).toEqual(['search1', 'search3']);
    });

    test('clearSearchHistory should clear all history', () => {
      clearSearchHistory();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('afridev_search_history');
    });
  });

  describe('Bookmark Functions', () => {
    test('getBookmark should return bookmark data', () => {
      const mockBookmark = { username: 'testuser', timestamp: Date.now() };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockBookmark));
      
      const result = getBookmark('testuser');
      expect(result).toEqual(mockBookmark);
    });

    test('addBookmark should add bookmark', () => {
      addBookmark('testuser', 'Test User');
      
      const setCall = localStorageMock.setItem.mock.calls.find(call => 
        call[0].startsWith('afridev_bookmark_')
      );
      
      expect(setCall).toBeDefined();
      const bookmark = JSON.parse(setCall[1]);
      expect(bookmark.username).toBe('testuser');
      expect(bookmark.name).toBe('Test User');
    });

    test('removeBookmark should remove bookmark', () => {
      removeBookmark('testuser');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('afridev_bookmark_testuser');
    });

    test('isBookmarked should check bookmark status', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ username: 'testuser' }));
      
      expect(isBookmarked('testuser')).toBe(true);
      expect(isBookmarked('nonexistent')).toBe(false);
    });

    test('toggleBookmark should toggle bookmark status', () => {
      // Test adding bookmark
      localStorageMock.getItem.mockReturnValue(null);
      const result1 = toggleBookmark('testuser');
      expect(result1).toBe(true);
      
      // Test removing bookmark
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ username: 'testuser' }));
      const result2 = toggleBookmark('testuser');
      expect(result2).toBe(false);
    });

    test('exportBookmarks should export all bookmarks', () => {
      const mockBookmarks = [
        { username: 'user1', name: 'User One' },
        { username: 'user2', name: 'User Two' }
      ];
      
      // Mock multiple bookmark keys
      Object.keys(localStorageMock.store || {}).forEach(key => {
        if (key.startsWith('afridev_bookmark_')) {
          localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(
            mockBookmarks.find(b => key === `afridev_bookmark_${b.username}`)
          ));
        }
      });
      
      // Mock Object.keys to return bookmark keys
      const originalKeys = Object.keys;
      Object.keys = jest.fn(() => ['afridev_bookmark_user1', 'afridev_bookmark_user2']);
      
      const result = exportBookmarks();
      expect(result).toHaveLength(2);
      expect(result[0].username).toBe('user1');
      expect(result[1].username).toBe('user2');
      
      Object.keys = originalKeys;
    });
  });

  describe('copyProfileLink', () => {
    test('should copy profile link to clipboard', async () => {
      const mockWriteText = jest.fn().mockResolvedValue();
      global.navigator.clipboard = {
        writeText: mockWriteText
      };

      await copyProfileLink('testuser');
      expect(mockWriteText).toHaveBeenCalledWith('https://github.com/testuser');
    });

    test('should handle clipboard errors', async () => {
      global.navigator.clipboard = {
        writeText: jest.fn().mockRejectedValue(new Error('Clipboard error'))
      };

      await expect(copyProfileLink('testuser')).rejects.toThrow('Clipboard error');
    });
  });

  describe('Cache Functions', () => {
    test('setCache should store data with timestamp', () => {
      const testData = { key: 'value' };
      setCache('test_key', testData, 60000);
      
      const setCall = localStorageMock.setItem.mock.calls.find(call => 
        call[0] === 'afridev_cache_test_key'
      );
      
      expect(setCall).toBeDefined();
      const cached = JSON.parse(setCall[1]);
      expect(cached.data).toEqual(testData);
      expect(cached.timestamp).toBeDefined();
      expect(cached.expiry).toBeDefined();
    });

    test('getCache should return cached data if not expired', () => {
      const mockCache = {
        data: { key: 'value' },
        timestamp: Date.now(),
        expiry: Date.now() + 60000
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCache));
      
      const result = getCache('test_key');
      expect(result).toEqual({ key: 'value' });
    });

    test('getCache should return null for expired cache', () => {
      const mockCache = {
        data: { key: 'value' },
        timestamp: Date.now() - 120000,
        expiry: Date.now() - 60000
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCache));
      
      const result = getCache('test_key');
      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('afridev_cache_test_key');
    });

    test('getCache should return null for missing cache', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = getCache('missing_key');
      expect(result).toBeNull();
    });
  });

  describe('updateRateLimitBar', () => {
    test('should update rate limit bar correctly', () => {
      const mockFillElement = { style: { width: '' } };
      const mockLabelElement = { textContent: '' };
      
      document.getElementById = jest.fn((id) => {
        if (id === 'rate-limit-fill') return mockFillElement;
        if (id === 'rate-limit-label') return mockLabelElement;
        return null;
      });

      updateRateLimitBar(4500, 5000);
      
      expect(mockFillElement.style.width).toBe('90%');
      expect(mockLabelElement.textContent).toBe('4500/5000 API calls');
    });

    test('should handle missing DOM elements', () => {
      document.getElementById = jest.fn(() => null);
      
      expect(() => updateRateLimitBar(4500, 5000)).not.toThrow();
    });

    test('should handle zero denominator', () => {
      const mockFillElement = { style: { width: '' } };
      const mockLabelElement = { textContent: '' };
      
      document.getElementById = jest.fn((id) => {
        if (id === 'rate-limit-fill') return mockFillElement;
        if (id === 'rate-limit-label') return mockLabelElement;
        return null;
      });

      updateRateLimitBar(100, 0);
      
      expect(mockFillElement.style.width).toBe('0%');
      expect(mockLabelElement.textContent).toBe('100/0 API calls');
    });
  });

  describe('displaySearchHistory', () => {
    test('should display search history in DOM', () => {
      const mockContainer = { innerHTML: '' };
      document.getElementById = jest.fn(() => mockContainer);
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['search1', 'search2']));
      
      displaySearchHistory();
      
      expect(mockContainer.innerHTML).toContain('search1');
      expect(mockContainer.innerHTML).toContain('search2');
    });

    test('should handle empty search history', () => {
      const mockContainer = { innerHTML: '' };
      document.getElementById = jest.fn(() => mockContainer);
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify([]));
      
      displaySearchHistory();
      
      expect(mockContainer.innerHTML).toContain('No recent searches');
    });

    test('should handle missing container', () => {
      document.getElementById = jest.fn(() => null);
      
      expect(() => displaySearchHistory()).not.toThrow();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => getSearchHistory()).not.toThrow();
      expect(() => addToSearchHistory('test')).not.toThrow();
      expect(() => isBookmarked('test')).not.toThrow();
    });

    test('should handle malformed JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      expect(() => getSearchHistory()).not.toThrow();
      expect(() => getBookmark('test')).not.toThrow();
      expect(() => getCache('test')).not.toThrow();
    });

    test('should handle invalid date inputs', () => {
      expect(() => timeAgo('not a date')).not.toThrow();
      expect(() => buildDateFilter('invalid', 'invalid')).not.toThrow();
    });

    test('should handle negative numbers', () => {
      expect(formatNumber(-1000)).toBe('-1k');
      expect(getMaxPages(-100, 10)).toBe(0);
    });
  });
});
