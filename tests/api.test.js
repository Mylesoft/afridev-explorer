/**
 * API.JS TESTS
 * Focused tests for the current GitHub API helpers.
 */

import {
  apiFetchWithRateLimit,
  clearGitHubToken,
  getGitHubToken,
  getRepoReadme,
  getUser,
  getUserEvents,
  getUserRepos,
  handleApiError,
  searchByFramework,
  searchCofounders,
  searchDevelopersByTech,
  searchJobSeekers,
  searchRepos,
  searchUsers,
  setGitHubToken,
  updateRateLimitDisplay
} from '../js/api.js';

global.fetch = jest.fn();

describe('API Functions', () => {
  beforeEach(() => {
    fetch.mockReset();
    localStorage.clear();
    sessionStorage.clear();
    delete window.AFRIDEV_GITHUB_TOKEN;
    delete window.__rateLimitInfo;
    document.body.innerHTML = `
      <div class="rate-limit-fill"></div>
      <div class="rate-limit-label"></div>
    `;
  });

  describe('token helpers', () => {
    test('stores and clears a persistent token', () => {
      setGitHubToken('ghp_test_token');

      expect(getGitHubToken()).toBe('ghp_test_token');
      expect(localStorage.getItem('afridev_github_token')).toBe('ghp_test_token');

      clearGitHubToken();

      expect(getGitHubToken()).toBe('');
      expect(localStorage.getItem('afridev_github_token')).toBeNull();
    });

    test('can store a session-only token', () => {
      setGitHubToken('ghp_session_token', false);

      expect(getGitHubToken()).toBe('ghp_session_token');
      expect(sessionStorage.getItem('afridev_github_token')).toBe('ghp_session_token');
      expect(localStorage.getItem('afridev_github_token')).toBeNull();
    });
  });

  describe('handleApiError', () => {
    test('throws a 404 message for missing resources', () => {
      expect(() => handleApiError({ status: 404, ok: false })).toThrow('Not found.');
    });

    test('includes token guidance on rate limit errors when no token is set', () => {
      const response = {
        status: 403,
        ok: false,
        headers: new Headers({
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Reset': '1893456000'
        })
      };

      expect(() => handleApiError(response)).toThrow(/Add a token with window\.AfriDevExplorer\.setGitHubToken/);
    });
  });

  describe('apiFetchWithRateLimit', () => {
    test('fetches JSON and updates the shared rate limit UI', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
        headers: new Headers({
          'X-RateLimit-Remaining': '45',
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Reset': '1893456000'
        })
      });

      const result = await apiFetchWithRateLimit('/test');

      expect(result).toEqual({ ok: true });
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: 'application/vnd.github.v3+json'
          })
        })
      );
      expect(document.querySelector('.rate-limit-fill').style.width).toBe('75%');
      expect(document.querySelector('.rate-limit-label').textContent).toBe('45/60 API calls');
    });

    test('sends the stored token when one exists', async () => {
      setGitHubToken('ghp_header_token');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
        headers: new Headers()
      });

      await apiFetchWithRateLimit('/secure');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/secure',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'token ghp_header_token'
          })
        })
      );
    });
  });

  describe('resource helpers', () => {
    test('getUser fetches a profile', async () => {
      const mockUser = { login: 'testuser', followers: 100 };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
        headers: new Headers()
      });

      const result = await getUser('testuser');

      expect(result.user).toEqual(mockUser);
      expect(fetch).toHaveBeenCalledWith('https://api.github.com/users/testuser', expect.any(Object));
    });

    test('getUserRepos fetches repositories', async () => {
      const mockRepos = [{ name: 'repo1' }, { name: 'repo2' }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
        headers: new Headers()
      });

      const result = await getUserRepos('testuser', 'updated', 4);

      expect(result.repos).toEqual(mockRepos);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser/repos?sort=updated&per_page=4',
        expect.any(Object)
      );
    });

    test('getUserEvents fetches a user activity feed', async () => {
      const mockEvents = [{ type: 'PushEvent' }];
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

    test('getRepoReadme decodes the GitHub readme payload', async () => {
      const readme = '# Test Repository';
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: btoa(readme) }),
        headers: new Headers()
      });

      await expect(getRepoReadme('owner', 'repo')).resolves.toBe(readme);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo/readme',
        expect.any(Object)
      );
    });

    test('getRepoReadme returns a friendly fallback for missing files', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: new Headers()
      });

      await expect(getRepoReadme('owner', 'repo')).resolves.toBe('No README found for this repository.');
    });
  });

  describe('search helpers', () => {
    test('searchUsers builds a location search by default', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [{ login: 'user1' }], total_count: 1 }),
        headers: new Headers()
      });

      const result = await searchUsers('Kenya', 2, 5);

      expect(result.users).toEqual([{ login: 'user1' }]);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/search/users?q=location%3AKenya&sort=followers&per_page=5&page=2',
        expect.any(Object)
      );
    });

    test('searchUsers supports username searches when requested', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [], total_count: 0 }),
        headers: new Headers()
      });

      await searchUsers('octocat', 1, 12, 'username');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/search/users?q=octocat&sort=followers&per_page=12&page=1',
        expect.any(Object)
      );
    });

    test('searchRepos builds user-owned repository queries', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [{ name: 'repo1' }], total_count: 1 }),
        headers: new Headers()
      });

      const result = await searchRepos('Africa', 'JavaScript', 'stars', 1, 10, 'octocat');

      expect(result.repos).toEqual([{ name: 'repo1' }]);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/search/repositories?q=user%3Aoctocat%2Blanguage%3AJavaScript&sort=stars&per_page=10&page=1',
        expect.any(Object)
      );
    });

    test('searchDevelopersByTech returns unique repo owners', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            { owner: { login: 'dev1' } },
            { owner: { login: 'dev1' } },
            { owner: { login: 'dev2' } }
          ],
          total_count: 3
        }),
        headers: new Headers()
      });

      const result = await searchDevelopersByTech('javascript', 'nigeria', 1, 10);

      expect(result.users).toEqual([{ login: 'dev1' }, { login: 'dev2' }]);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/search/repositories?q=language:javascript location:nigeria&sort=stars&per_page=10&page=1',
        expect.any(Object)
      );
    });

    test('searchByFramework returns unique repository owners', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            { owner: { login: 'dev1' } },
            { owner: { login: 'dev2' } }
          ],
          total_count: 2
        }),
        headers: new Headers()
      });

      const result = await searchByFramework('react', 'kenya', 1, 10);

      expect(result.users).toEqual([{ login: 'dev1' }, { login: 'dev2' }]);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/search/repositories?q=topic:react location:kenya&sort=stars&per_page=10&page=1',
        expect.any(Object)
      );
    });

    test('searchCofounders searches bios with location context', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [{ login: 'founder1' }], total_count: 1 }),
        headers: new Headers()
      });

      const result = await searchCofounders('south africa', 1, 10);

      expect(result.users).toEqual([{ login: 'founder1' }]);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/search/users?q=cofounder OR co-founder OR "looking for cofounder" in:bio location:south%20africa&sort=followers&per_page=10&page=1',
        expect.any(Object)
      );
    });

    test('searchJobSeekers searches for hire-related bios', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [{ login: 'seeker1' }], total_count: 1 }),
        headers: new Headers()
      });

      const result = await searchJobSeekers('ghana', 1, 10);

      expect(result.users).toEqual([{ login: 'seeker1' }]);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/search/users?q=hiring OR "looking for work" OR "available for hire" OR "open to work" in:bio location:ghana&sort=followers&per_page=10&page=1',
        expect.any(Object)
      );
    });
  });

  describe('updateRateLimitDisplay', () => {
    test('renders the saved rate limit info into the navbar bar', () => {
      window.__rateLimitInfo = { remaining: 30, limit: 60 };

      updateRateLimitDisplay();

      expect(document.querySelector('.rate-limit-fill').style.width).toBe('50%');
      expect(document.querySelector('.rate-limit-label').textContent).toBe('30/60 API calls');
    });
  });
});
