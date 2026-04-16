/**
 * RENDER.TEST.JS - Unit tests for rendering functions
 */

import {
  renderDevCard,
  renderRepoCard,
  renderProfileHeader,
  renderSkeletonCards,
  renderEmptyState,
  renderErrorToast,
  renderPagination,
  renderActivityCard
} from '../js/render.js';

describe('render.js', () => {
  describe('renderDevCard', () => {
    test('should render developer card with user data', () => {
      const user = {
        login: 'testuser',
        name: 'Test User',
        avatar_url: 'http://example.com/avatar.jpg',
        location: 'Kenya',
        followers: 100,
        public_repos: 50
      };

      const html = renderDevCard(user);

      expect(html).toContain('testuser');
      expect(html).toContain('Test User');
      expect(html).toContain('Kenya');
      expect(html).toContain('100');
      expect(html).toContain('50');
    });

    test('should include onerror fallback for avatar', () => {
      const user = {
        login: 'test',
        avatar_url: 'http://example.com/avatar.jpg',
        name: 'Test'
      };

      const html = renderDevCard(user);

      expect(html).toContain('onerror');
      expect(html).toContain('default-avatar.png');
    });

    test('should sanitize user input', () => {
      const user = {
        login: '<script>alert(1)</script>',
        name: 'Test',
        avatar_url: 'http://example.com/avatar.jpg'
      };

      const html = renderDevCard(user);

      expect(html).not.toContain('<script>');
    });

    test('should handle missing name gracefully', () => {
      const user = {
        login: 'testuser',
        avatar_url: 'http://example.com/avatar.jpg'
      };

      const html = renderDevCard(user);

      expect(html).toContain('testuser');
    });
  });

  describe('renderRepoCard', () => {
    test('should render repository card', () => {
      const repo = {
        full_name: 'user/repo',
        name: 'repo',
        description: 'A great repo',
        language: 'JavaScript',
        stargazers_count: 100,
        owner: { login: 'user', avatar_url: 'http://example.com/avatar.jpg' }
      };

      const html = renderRepoCard(repo);

      expect(html).toContain('repo');
      expect(html).toContain('A great repo');
      expect(html).toContain('JavaScript');
      expect(html).toContain('100');
    });

    test('should include language badge', () => {
      const repo = {
        full_name: 'user/repo',
        name: 'repo',
        language: 'Python',
        stargazers_count: 50,
        owner: { login: 'user', avatar_url: 'http://example.com/avatar.jpg' }
      };

      const html = renderRepoCard(repo);

      expect(html).toContain('Python');
    });

    test('should handle null description', () => {
      const repo = {
        full_name: 'user/repo',
        name: 'repo',
        description: null,
        language: 'Go',
        stargazers_count: 25,
        owner: { login: 'user', avatar_url: 'http://example.com/avatar.jpg' }
      };

      const html = renderRepoCard(repo);

      expect(html).toContain('repo');
    });
  });

  describe('renderProfileHeader', () => {
    test('should render profile header with user stats', () => {
      const user = {
        login: 'testuser',
        name: 'Test User',
        avatar_url: 'http://example.com/avatar.jpg',
        bio: 'Developer',
        followers: 150,
        following: 50,
        public_repos: 100
      };

      const html = renderProfileHeader(user);

      expect(html).toContain('Test User');
      expect(html).toContain('150');
      expect(html).toContain('50');
      expect(html).toContain('100');
    });

    test('should include profile links', () => {
      const user = {
        login: 'testuser',
        name: 'Test',
        avatar_url: 'http://example.com/avatar.jpg',
        html_url: 'http://github.com/testuser',
        blog: 'http://example.com',
        twitter_username: 'testuser',
        followers: 100,
        following: 50,
        public_repos: 75
      };

      const html = renderProfileHeader(user);

      expect(html).toContain('github.com/testuser');
    });
  });

  describe('renderSkeletonCards', () => {
    test('should generate correct number of skeletons', () => {
      const html = renderSkeletonCards(6);
      const skeletons = html.split('class="skeleton').length - 1;

      expect(skeletons).toBe(6);
    });

    test('should have default count of 6', () => {
      const html = renderSkeletonCards();
      const skeletons = html.split('class="skeleton').length - 1;

      expect(skeletons).toBe(6);
    });

    test('should generate valid HTML divs', () => {
      const html = renderSkeletonCards(3);

      expect(html).toContain('<div');
      expect(html).toContain('skeleton');
    });
  });

  describe('renderEmptyState', () => {
    test('should render empty state with message', () => {
      const html = renderEmptyState('No developers found');

      expect(html).toContain('No developers found');
      expect(html).toContain('empty-state');
    });

    test('should include proper styling', () => {
      const html = renderEmptyState('No results');

      expect(html).toContain('empty-state');
      expect(html).toContain('No Results');
    });
  });

  describe('renderErrorToast', () => {
    beforeEach(() => {
      // Clean up any existing toast container
      const existingContainer = document.getElementById('toast-container');
      if (existingContainer) {
        existingContainer.remove();
      }
    });

    test('should create error toast element', () => {
      const container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);

      renderErrorToast('Error message');

      const toast = container.querySelector('.toast');
      expect(toast).toBeTruthy();
      expect(toast.textContent).toContain('Error message');
    });

    test('should set error type by default', () => {
      const container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);

      renderErrorToast('Error');

      const toast = container.querySelector('.toast');
      expect(toast.className).toContain('error');
    });

    test('should accept custom duration', (done) => {
      const container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);

      renderErrorToast('Test', 'success', 100);

      setTimeout(() => {
        const toast = container.querySelector('.toast');
        expect(toast.style.opacity).toBe('0');
        done();
      }, 150);
    });
  });

  describe('renderActivityCard', () => {
    test('should render activity card with event data', () => {
      const event = {
        type: 'PushEvent',
        created_at: '2023-01-15T10:00:00Z',
        actor: {
          login: 'testuser',
          avatar_url: 'http://example.com/avatar.jpg'
        },
        repo: {
          name: 'user/repo'
        }
      };

      const html = renderActivityCard(event);

      expect(html).toContain('testuser');
      expect(html).toContain('user/repo');
      expect(html).toContain('Push');
      expect(html).toContain('activity-card');
    });

    test('should include proper activity card structure', () => {
      const event = {
        type: 'WatchEvent',
        created_at: '2023-01-15T10:00:00Z',
        actor: {
          login: 'developer',
          avatar_url: 'http://example.com/avatar.jpg'
        },
        repo: {
          name: 'owner/project'
        }
      };

      const html = renderActivityCard(event);

      expect(html).toContain('activity-header');
      expect(html).toContain('activity-avatar');
      expect(html).toContain('activity-meta');
      expect(html).toContain('activity-content');
      expect(html).toContain('activity-type');
    });

    test('should sanitize event data', () => {
      const event = {
        type: 'IssuesEvent',
        created_at: '2023-01-15T10:00:00Z',
        actor: {
          login: '<script>alert(1)</script>',
          avatar_url: 'http://example.com/avatar.jpg'
        },
        repo: {
          name: 'user/repo'
        }
      };

      const html = renderActivityCard(event);

      expect(html).not.toContain('<script>');
      expect(html).toContain('activity-user');
    });

    test('should include onerror fallback for avatar', () => {
      const event = {
        type: 'CreateEvent',
        created_at: '2023-01-15T10:00:00Z',
        actor: {
          login: 'user',
          avatar_url: 'http://example.com/avatar.jpg'
        },
        repo: {
          name: 'owner/repo'
        }
      };

      const html = renderActivityCard(event);

      expect(html).toContain('onerror');
      expect(html).toContain('default-avatar.png');
    });

    test('should handle different event types', () => {
      const eventTypes = ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'WatchEvent', 'ForkEvent'];
      
      eventTypes.forEach(eventType => {
        const event = {
          type: eventType,
          created_at: '2023-01-15T10:00:00Z',
          actor: {
            login: 'user',
            avatar_url: 'http://example.com/avatar.jpg'
          },
          repo: {
            name: 'owner/repo'
          }
        };

        const html = renderActivityCard(event);
        const expectedType = eventType.replace('Event', '');
        
        expect(html).toContain(expectedType);
      });
    });

    test('should include profile link for user', () => {
      const event = {
        type: 'ReleaseEvent',
        created_at: '2023-01-15T10:00:00Z',
        actor: {
          login: 'developer',
          avatar_url: 'http://example.com/avatar.jpg'
        },
        repo: {
          name: 'owner/project'
        }
      };

      const html = renderActivityCard(event);

      expect(html).toContain('profile.html?user=developer');
      expect(html).toContain('activity-user');
    });

    test('should include GitHub repo link', () => {
      const event = {
        type: 'CreateEvent',
        created_at: '2023-01-15T10:00:00Z',
        actor: {
          login: 'user',
          avatar_url: 'http://example.com/avatar.jpg'
        },
        repo: {
          name: 'owner/repository'
        }
      };

      const html = renderActivityCard(event);

      expect(html).toContain('https://github.com/owner/repository');
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noopener noreferrer"');
    });
  });

  describe('renderPagination', () => {
  beforeEach(() => {
    // Setup global jest mock
    global.jest = {
      fn: () => {
        const mockFn = (...args) => {
          mockFn.calls.push(args);
          return mockFn.mockReturnValue;
        };
        mockFn.calls = [];
        mockFn.mockReturnValue = undefined;
        mockFn.mockImplementation = (impl) => {
          mockFn.mockImpl = impl;
          return mockFn;
        };
        return mockFn;
      }
    };
  });

    test('should render pagination buttons', () => {
      const html = renderPagination(1, 5, () => {});

      expect(html).toContain('data-page="1"');
      expect(html).toContain('data-page="2"');
    });

    test('should mark current page as active', () => {
      const html = renderPagination(3, 5, () => {});

      expect(html).toContain('data-page="3"');
      expect(html).toContain('active');
    });

    test('should generate correct number of pages', () => {
      const html = renderPagination(1, 3, () => {});
      const buttons = html.split('data-page=').length - 1;

      expect(buttons).toBeGreaterThanOrEqual(3);
    });

    test('should call callback with page number on click', (done) => {
      const callback = global.jest.fn();
      const container = document.createElement('div');
      container.innerHTML = renderPagination(1, 3, callback);
      document.body.appendChild(container);

      setTimeout(() => {
        const button = container.querySelector('[data-page="2"]');
        button?.click();

        setTimeout(() => {
          expect(callback.calls).toContainEqual([2]);
          document.body.removeChild(container);
          done();
        }, 50);
      }, 50);
    });
  });
});
