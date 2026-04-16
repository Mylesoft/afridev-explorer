/**
 * API.TEST.JS - Unit tests for GitHub API functions
 */

import {
  searchUsers,
  getUser,
  getUserRepos,
  searchRepos,
  handleApiError,
  checkRateLimit
} from '../js/api.js';

// Mock global fetch
global.fetch = jest.fn();

describe('api.js', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('searchUsers', () => {
    test('should fetch users with location query', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          items: [{ login: 'test', avatar_url: 'http://example.com/avatar.jpg' }],
          total_count: 100
        }),
        headers: new Headers({ 'x-ratelimit-remaining': '4999', 'x-ratelimit-limit': '5000' })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await searchUsers('Kenya', 1, 12, 'location');
      
      expect(result.users).toHaveLength(1);
      expect(result.users[0].login).toBe('test');
      expect(result.totalCount).toBe(100);
      expect(result.rateLimit.remaining).toBe('4999');
    });

    test('should handle pagination', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ items: [], total_count: 0 }),
        headers: new Headers({ 'x-ratelimit-remaining': '4999', 'x-ratelimit-limit': '5000' })
      };
      fetch.mockResolvedValue(mockResponse);

      await searchUsers('Africa', 2, 12, 'location');
      
      const url = fetch.mock.calls[0][0];
      expect(url).toContain('page=2');
      expect(url).toContain('per_page=12');
    });

    test('should search by username', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          items: [{ login: 'testuser', avatar_url: 'http://example.com/avatar.jpg' }],
          total_count: 1
        }),
        headers: new Headers({ 'x-ratelimit-remaining': '4999', 'x-ratelimit-limit': '5000' })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await searchUsers('testuser', 1, 12, 'username');
      
      expect(result.users).toHaveLength(1);
      expect(result.users[0].login).toBe('testuser');
      
      const url = fetch.mock.calls[0][0];
      expect(url).not.toContain('location:');
    });
  });

  describe('getUser', () => {
    test('should fetch user by username', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          login: 'testuser',
          name: 'Test User',
          bio: 'Test bio'
        }),
        headers: new Headers({ 'x-ratelimit-remaining': '4999', 'x-ratelimit-limit': '5000' })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await getUser('testuser');
      
      expect(result.user.login).toBe('testuser');
      expect(result.user.name).toBe('Test User');
    });

    test('should throw error for 404', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not Found' })
      };
      fetch.mockResolvedValue(mockResponse);

      await expect(getUser('nonexistent')).rejects.toThrow();
    });
  });

  describe('getUserRepos', () => {
    test('should fetch user repositories', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([
          { name: 'repo1', stars: 10 },
          { name: 'repo2', stars: 5 }
        ]),
        headers: new Headers({ 'x-ratelimit-remaining': '4999', 'x-ratelimit-limit': '5000' })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await getUserRepos('testuser', 'stars', 6);
      
      expect(result.repos).toHaveLength(2);
      expect(result.repos[0].name).toBe('repo1');
    });

    test('should apply sort parameter', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([]),
        headers: new Headers({ 'x-ratelimit-remaining': '4999', 'x-ratelimit-limit': '5000' })
      };
      fetch.mockResolvedValue(mockResponse);

      await getUserRepos('testuser', 'updated');
      
      const url = fetch.mock.calls[0][0];
      expect(url).toContain('sort=updated');
    });
  });

  describe('searchRepos', () => {
    test('should search repositories with location and language', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          items: [{ name: 'test-repo', language: 'JavaScript' }],
          total_count: 50
        }),
        headers: new Headers({ 'x-ratelimit-remaining': '4999', 'x-ratelimit-limit': '5000' })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await searchRepos('Africa', 'Python', 'stars', 1, 12);
      
      expect(result.repos).toHaveLength(1);
      expect(result.totalCount).toBe(50);
    });

    test('should handle language filter', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ items: [], total_count: 0 }),
        headers: new Headers({ 'x-ratelimit-remaining': '4999', 'x-ratelimit-limit': '5000' })
      };
      fetch.mockResolvedValue(mockResponse);

      await searchRepos('Africa', 'Go');
      
      const url = fetch.mock.calls[0][0];
      expect(url).toContain('language:Go');
    });
  });

  describe('checkRateLimit', () => {
    test('should parse rate limit headers', () => {
      const headers = new Headers({
        'x-ratelimit-remaining': '4999',
        'x-ratelimit-limit': '5000',
        'x-ratelimit-reset': '1234567890'
      });

      const result = checkRateLimit(headers);
      
      expect(result.remaining).toBe(4999);
      expect(result.limit).toBe(5000);
      expect(result.reset).toBe(1234567890);
    });
  });

  describe('handleApiError', () => {
    test('should throw rate limit error for 403', () => {
      const response = {
        status: 403
      };

      expect(() => handleApiError(response)).toThrow('Rate limit exceeded');
    });

    test('should throw not found error for 404', () => {
      const response = {
        status: 404
      };

      expect(() => handleApiError(response)).toThrow('Not found');
    });

    test('should throw invalid query error for 422', () => {
      const response = {
        status: 422
      };

      expect(() => handleApiError(response)).toThrow('Invalid search query');
    });

    test('should throw generic error for other status codes', () => {
      const response = {
        status: 500,
        ok: false
      };

      expect(() => handleApiError(response)).toThrow('GitHub API error');
    });
  });
});
