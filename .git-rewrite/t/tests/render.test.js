/**
 * RENDER.TEST.JS - Unit tests for rendering functions
 */

import {
  renderDevCard,
  renderRepoCard,
  renderActivityCard,
  renderSkeletonCards,
  renderEmptyState
} from '../js/render.js';

describe('render.js', () => {
  test('renderDevCard contains username', () => {
    const user = {
      login: 'testuser',
      name: 'Test User',
      avatar_url: 'http://example.com/avatar.jpg',
      followers: 100,
      public_repos: 50,
      bio: ''
    };
    const html = renderDevCard(user);
    expect(html).toContain('testuser');
  });

  test('renderDevCard includes onerror fallback', () => {
    const user = {
      login: 'test',
      avatar_url: 'http://example.com/avatar.jpg',
      followers: 0,
      public_repos: 0,
      bio: ''
    };
    const html = renderDevCard(user);
    expect(html).toContain('onerror');
    expect(html).toContain('default-avatar.png');
  });

  test('renderDevCard sanitizes input', () => {
    const user = {
      login: '<script>alert(1)</script>',
      name: 'Test',
      avatar_url: 'http://example.com/avatar.jpg',
      followers: 0,
      public_repos: 0,
      bio: ''
    };
    const html = renderDevCard(user);
    expect(html).not.toContain('<script>');
  });

  test('renderRepoCard contains repo info', () => {
    const repo = {
      full_name: 'user/repo',
      name: 'repo',
      description: 'A great repo',
      language: 'JavaScript',
      stargazers_count: 100,
      forks_count: 10,
      updated_at: '2023-01-15T10:00:00Z',
      html_url: 'http://github.com/user/repo',
      owner: { login: 'user', avatar_url: 'http://example.com/avatar.jpg' }
    };
    const html = renderRepoCard(repo);
    expect(html).toContain('repo');
    expect(html).toContain('A great repo');
  });

  test('renderRepoCard includes language', () => {
    const repo = {
      full_name: 'user/repo',
      name: 'repo',
      language: 'Python',
      description: 'Test',
      stargazers_count: 50,
      forks_count: 5,
      updated_at: '2023-01-15T10:00:00Z',
      html_url: 'http://github.com/user/repo',
      owner: { login: 'user', avatar_url: 'http://example.com/avatar.jpg' }
    };
    const html = renderRepoCard(repo);
    expect(html).toContain('Python');
  });

  test('renderActivityCard renders event data', () => {
    const event = {
      type: 'PushEvent',
      created_at: '2023-01-15T10:00:00Z',
      actor: {
        login: 'testuser',
        avatar_url: 'http://example.com/avatar.jpg'
      },
      repo: {
        name: 'user/repo'
      },
      payload: {}
    };
    const html = renderActivityCard(event);
    expect(html).toContain('testuser');
    expect(html).toContain('user/repo');
  });

  test('renderActivityCard sanitizes data', () => {
    const event = {
      type: 'IssuesEvent',
      created_at: '2023-01-15T10:00:00Z',
      actor: {
        login: '<script>alert(1)</script>',
        avatar_url: 'http://example.com/avatar.jpg'
      },
      repo: {
        name: 'user/repo'
      },
      payload: {}
    };
    const html = renderActivityCard(event);
    expect(html).not.toContain('<script>');
  });

  test('renderSkeletonCards returns correct count', () => {
    const html = renderSkeletonCards(6);
    const count = (html.match(/skeleton-card/g) || []).length;
    expect(count).toBe(6);
  });

  test('renderSkeletonCards uses default count', () => {
    const html = renderSkeletonCards();
    const count = (html.match(/skeleton-card/g) || []).length;
    expect(count).toBe(6);
  });

  test('renderEmptyState contains message', () => {
    const html = renderEmptyState('No results found.');
    expect(html).toContain('No results found.');
  });
});
