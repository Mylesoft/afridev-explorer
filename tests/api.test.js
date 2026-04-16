/**
 * API.TEST.JS - Unit tests for GitHub API functions
 */

import {
  handleApiError,
  checkRateLimit
} from '../js/api.js';

describe('api.js', () => {
  test('checkRateLimit parses headers correctly', () => {
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

  test('handleApiError throws for 403 rate limit', () => {
    const response = { status: 403 };
    expect(() => handleApiError(response)).toThrow('Rate limit exceeded');
  });

  test('handleApiError throws for 404 not found', () => {
    const response = { status: 404 };
    expect(() => handleApiError(response)).toThrow('Not found');
  });

  test('handleApiError throws for 422 invalid query', () => {
    const response = { status: 422 };
    expect(() => handleApiError(response)).toThrow('Invalid search query');
  });

  test('handleApiError throws generic error for 500', () => {
    const response = { status: 500, ok: false };
    expect(() => handleApiError(response)).toThrow('GitHub API error');
  });
});
