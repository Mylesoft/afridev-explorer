/**
 * API.JS TESTS
 * Unit tests for GitHub API integration functions
 */

import {
  apiFetch,
  getUser,
  searchUsers,
  searchRepos,
  getUserRepos,
  getUserEvents,
  getRepoReadme,
  searchByFramework,
  searchDevelopersByTech,
  searchCofounders,
  searchJobSeekers,
  updateRateLimitDisplay
} from '../js/api.js';

// Mock fetch globally
global.fetch = jest.fn();

// Mock DOM elements for rate limit display
document.getElementById = jest.fn((id) => {
  if (id === 'rate-limit-fill') {
    return { style: { width: '' } };
  }
  if (id === 'rate-limit-label') {
    return { textContent: '' };
  }
  return null;
});

describe('API Functions', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorageMock.clear();
  });

  describe('apiFetch', () => {
    test('should make successful API request', async () => {
      const mockResponse = { data: 'test' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({
          'x-ratelimit-remaining': '5000',
          'x-ratelimit-limit': '5000'
        })
      });

      const result = await apiFetch('/test');
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': expect.stringContaining('token')
          })
        })
      );
    });

    test('should handle API errors correctly', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(apiFetch('/test')).rejects.toThrow('Not Found');
    });

    test('should handle rate limiting', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden'
      });

      await expect(apiFetch('/test')).rejects.toThrow('Rate limit exceeded');
    });

    test('should update rate limit display', async () => {
      const mockResponse = { data: 'test' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({
          'x-ratelimit-remaining': '4500',
          'x-ratelimit-limit': '5000'
        })
      });

      await apiFetch('/test');
      
      const fillElement = document.getElementById('rate-limit-fill');
      const labelElement = document.getElementById('rate-limit-label');
      
      expect(fillElement.style.width).toBe('90%');
      expect(labelElement.textContent).toBe('4500/5000 API calls');
    });
  });

  describe('getUser', () => {
    test('should fetch user data successfully', async () => {
      const mockUser = {
        login: 'testuser',
        name: 'Test User',
        followers: 100,
        public_repos: 50
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
        headers: new Headers()
      });

      const result = await getUser('testuser');
      expect(result.user).toEqual(mockUser);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser',
        expect.any(Object)
      );
    });

    test('should handle user not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(getUser('nonexistent')).rejects.toThrow('Not Found');
    });
  });

  describe('searchUsers', () => {
    test('should search users with query', async () => {
      const mockResponse = {
        items: [
          { login: 'user1', name: 'User One' },
          { login: 'user2', name: 'User Two' }
        ],
        total_count: 2
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers()
      });

      const result = await searchUsers('test query', 'location', 1, 10);
      expect(result.users).toEqual(mockResponse.items);
      expect(result.totalCount).toBe(2);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search/users?q=test query+location:location'),
        expect.any(Object)
      );
    });

    test('should handle empty search results', async () => {
      const mockResponse = { items: [], total_count: 0 };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers()
      });

      const result = await searchUsers('noresults', 'location', 1, 10);
      expect(result.users).toEqual([]);
      expect(result.totalCount).toBe(0);
    });
  });

  describe('searchRepos', () => {
    test('should search repositories with filters', async () => {
      const mockResponse = {
        items: [
          { name: 'repo1', stargazers_count: 100 },
          { name: 'repo2', stargazers_count: 50 }
        ],
        total_count: 2
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers()
      });

      const result = await searchRepos('test', 'language', 'stars', 1, 10);
      expect(result.repos).toEqual(mockResponse.items);
      expect(result.totalCount).toBe(2);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search/repositories?q=test+language:language'),
        expect.any(Object)
      );
    });
  });

  describe('getUserRepos', () => {
    test('should fetch user repositories', async () => {
      const mockRepos = [
        { name: 'repo1', stargazers_count: 100 },
        { name: 'repo2', stargazers_count: 50 }
      ];
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
        headers: new Headers()
      });

      const result = await getUserRepos('testuser', 'stars', 10);
      expect(result.repos).toEqual(mockRepos);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser/repos?sort=stars&per_page=10',
        expect.any(Object)
      );
    });
  });

  describe('getUserEvents', () => {
    test('should fetch user events', async () => {
      const mockEvents = [
        { type: 'PushEvent', created_at: '2023-01-01T00:00:00Z' },
        { type: 'IssuesEvent', created_at: '2023-01-02T00:00:00Z' }
      ];
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
        headers: new Headers()
      });

      const result = await getUserEvents('testuser', 10);
      expect(result.items).toEqual(mockEvents);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser/events?per_page=10',
        expect.any(Object)
      );
    });
  });

  describe('getRepoReadme', () => {
    test('should fetch repository README', async () => {
      const mockReadme = '# Test Repository\nThis is a test README.';
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: btoa(mockReadme) }),
        headers: new Headers()
      });

      const result = await getRepoReadme('owner', 'repo');
      expect(result).toBe(mockReadme);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo/contents/README.md',
        expect.any(Object)
      );
    });

    test('should handle README not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(getRepoReadme('owner', 'repo')).rejects.toThrow('Not Found');
    });
  });

  describe('searchByFramework', () => {
    test('should search by framework topic', async () => {
      const mockResponse = {
        items: [
          { login: 'dev1', name: 'Developer One' },
          { login: 'dev2', name: 'Developer Two' }
        ],
        total_count: 2
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers()
      });

      const result = await searchByFramework('react', 'kenya', 1, 10);
      expect(result.users).toEqual(mockResponse.items);
      expect(result.totalCount).toBe(2);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search/users?q=react+location:kenya'),
        expect.any(Object)
      );
    });
  });

  describe('searchDevelopersByTech', () => {
    test('should search developers by technology', async () => {
      const mockResponse = {
        items: [
          { login: 'dev1', name: 'Developer One' }
        ],
        total_count: 1
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers()
      });

      const result = await searchDevelopersByTech('javascript', 'nigeria', 1, 10);
      expect(result.users).toEqual(mockResponse.items);
      expect(result.totalCount).toBe(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search/users?q=javascript+location:nigeria'),
        expect.any(Object)
      );
    });
  });

  describe('searchCofounders', () => {
    test('should search for co-founders', async () => {
      const mockResponse = {
        items: [
          { login: 'founder1', name: 'Founder One' }
        ],
        total_count: 1
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers()
      });

      const result = await searchCofounders('south africa', 1, 10);
      expect(result.users).toEqual(mockResponse.items);
      expect(result.totalCount).toBe(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search/users?q+location:south africa'),
        expect.any(Object)
      );
    });
  });

  describe('searchJobSeekers', () => {
    test('should search for job seekers', async () => {
      const mockResponse = {
        items: [
          { login: 'seeker1', name: 'Job Seeker One' }
        ],
        total_count: 1
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers()
      });

      const result = await searchJobSeekers('ghana', 1, 10);
      expect(result.users).toEqual(mockResponse.items);
      expect(result.totalCount).toBe(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search/users?q+location:ghana'),
        expect.any(Object)
      );
    });
  });

  describe('updateRateLimitDisplay', () => {
    test('should update rate limit display correctly', () => {
      const mockHeaders = {
        get: jest.fn()
      };
      mockHeaders.get.mockReturnValueOnce('4500').mockReturnValueOnce('5000');

      updateRateLimitDisplay(mockHeaders);

      const fillElement = document.getElementById('rate-limit-fill');
      const labelElement = document.getElementById('rate-limit-label');
      
      expect(fillElement.style.width).toBe('90%');
      expect(labelElement.textContent).toBe('4500/5000 API calls');
    });

    test('should handle missing rate limit headers', () => {
      const mockHeaders = {
        get: jest.fn().mockReturnValue(null)
      };

      expect(() => updateRateLimitDisplay(mockHeaders)).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiFetch('/test')).rejects.toThrow('Network error');
    });

    test('should handle malformed JSON', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
        headers: new Headers()
      });

      await expect(apiFetch('/test')).rejects.toThrow('Invalid JSON');
    });

    test('should handle unauthorized requests', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      });

      await expect(apiFetch('/test')).rejects.toThrow('Unauthorized');
    });
  });

  describe('Retry Mechanism', () => {
    test('should retry on rate limit errors', async () => {
      // First call fails with rate limit
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests'
      });
      
      // Second call succeeds
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'success' }),
        headers: new Headers()
      });

      // Mock setTimeout for retry delay
      jest.useFakeTimers();
      
      const promise = apiFetch('/test');
      
      // Fast-forward past the retry delay
      jest.advanceTimersByTime(2000);
      
      const result = await promise;
      expect(result).toEqual({ data: 'success' });
      expect(fetch).toHaveBeenCalledTimes(2);
      
      jest.useRealTimers();
    });
  });
});
