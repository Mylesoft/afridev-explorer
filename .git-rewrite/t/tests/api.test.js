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

global.fetch = jest.fn();

describe('api.js', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('searchUsers calls fetch with location query', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        items: [{ login: 'test' }],
        total_count: 100
      }),
      headers: new Headers({ 'x-ratelimit-remaining': '4999' })
    });

    const result = await searchUsers('Kenya', 1, 12, 'location');
    expect(result.users).toHaveLength(1);
    expect(result.totalCount).toBe(100);
  });

  test('searchUsers handles pagination params', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [], total_count: 0 }),
      headers: new Headers({ 'x-ratelimit-remaining': '4999' })
    });

    await searchUsers('Africa', 2, 12, 'location');
    const url = fetch.mock.calls[0][0];
    expect(url).toContain('page=2');
    expect(url).toContain('per_page=12');
  });

  test('getUser fetches user profile', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        login: 'testuser',
        name: 'Test User'
      }),
      headers: new Headers({ 'x-ratelimit-remaining': '4999' })
    });

    const result = await getUser('testuser');
    expect(result.user.login).toBe('testuser');
  });

  test('getUserRepos fetches user repos', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { name: 'repo1' },
        { name: 'repo2' }
      ]),
      headers: new Headers({ 'x-ratelimit-remaining': '4999' })
    });

    const result = await getUserRepos('testuser');
    expect(result.repos).toHaveLength(2);
  });

  test('searchRepos searches repositories', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        items: [{ name: 'test-repo' }],
        total_count: 50
      }),
      headers: new Headers({ 'x-ratelimit-remaining': '4999' })
    });

    const result = await searchRepos('Africa', 'Python');
    expect(result.repos).toHaveLength(1);
  });

  test('checkRateLimit parses headers', () => {
    const headers = new Headers({
      'x-ratelimit-remaining': '4999',
      'x-ratelimit-limit': '5000',
      'x-ratelimit-reset': '1234567890'
    });

    const result = checkRateLimit(headers);
    expect(result.remaining).toBe(4999);
    expect(result.limit).toBe(5000);
  });

  test('handleApiError throws for 403', () => {
    const response = { status: 403 };
    expect(() => handleApiError(response)).toThrow('Rate limit exceeded');
  });

  test('handleApiError throws for 404', () => {
    const response = { status: 404 };
    expect(() => handleApiError(response)).toThrow('Not found');
  });

  test('handleApiError throws for 422', () => {
    const response = { status: 422 };
    expect(() => handleApiError(response)).toThrow('Invalid search query');
  });
});
