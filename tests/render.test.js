/**
 * RENDER.JS TESTS
 * Unit tests for rendering functions
 */

import {
  renderDevCard,
  renderRepoCard,
  renderProfileHeader,
  renderActivityCard,
  renderPagination,
  renderSkeletonCards,
  renderEmptyState,
  renderErrorToast,
  renderTechInsights,
  renderCountryDensity,
  renderSpotlightDeveloper,
  attachCardActionHandlers
} from '../js/render.js';

// Mock utility functions
jest.mock('../js/utils.js', () => ({
  sanitize: jest.fn((str) => str),
  formatNumber: jest.fn((num) => num.toString()),
  timeAgo: jest.fn((date) => '2 days ago'),
  getLanguageColor: jest.fn((lang) => '#f1e05a'),
  isBookmarked: jest.fn(() => false),
  getMaxPages: jest.fn(() => 10)
}));

// Mock DOM methods
document.createElement = jest.fn();
document.getElementById = jest.fn();

describe('Render Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('renderDevCard', () => {
    test('should render developer card with all required fields', () => {
      const mockUser = {
        login: 'testuser',
        name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'Test bio',
        followers: 100,
        public_repos: 50,
        following: 25,
        location: 'Nairobi, Kenya',
        html_url: 'https://github.com/testuser'
      };

      const result = renderDevCard(mockUser);

      expect(result).toContain('testuser');
      expect(result).toContain('Test User');
      expect(result).toContain('Test bio');
      expect(result).toContain('100');
      expect(result).toContain('50');
      expect(result).toContain('25');
      expect(result).toContain('Nairobi, Kenya');
      expect(result).toContain('profile.html?user=testuser');
      expect(result).toContain('github.com/testuser');
      expect(result).toContain('data-username="testuser"');
    });

    test('should handle missing user data gracefully', () => {
      const mockUser = {
        login: 'minimaluser',
        avatar_url: 'https://example.com/avatar.jpg',
        followers: 0,
        public_repos: 0,
        following: 0
      };

      const result = renderDevCard(mockUser);

      expect(result).toContain('minimaluser');
      expect(result).toContain('0');
      expect(result).toContain('Location not specified');
      expect(result).toContain('Passionate developer contributing to the African tech ecosystem');
    });

    test('should sanitize user data', () => {
      const mockUser = {
        login: 'test<script>alert("xss")</script>user',
        name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        followers: 100,
        public_repos: 50,
        following: 25,
        bio: 'Test bio with <script>alert("xss")</script>',
        location: 'Nairobi, Kenya',
        html_url: 'https://github.com/testuser'
      };

      const result = renderDevCard(mockUser);

      // Should call sanitize function
      expect(require('../js/utils.js').sanitize).toHaveBeenCalled();
    });
  });

  describe('renderRepoCard', () => {
    test('should render repository card with all required fields', () => {
      const mockRepo = {
        name: 'test-repo',
        owner: { login: 'testuser' },
        description: 'Test repository description',
        language: 'JavaScript',
        stargazers_count: 100,
        forks_count: 25,
        open_issues_count: 5,
        updated_at: '2023-01-01T00:00:00Z',
        html_url: 'https://github.com/testuser/test-repo',
        topics: ['react', 'nodejs']
      };

      const result = renderRepoCard(mockRepo);

      expect(result).toContain('test-repo');
      expect(result).toContain('testuser');
      expect(result).toContain('Test repository description');
      expect(result).toContain('JavaScript');
      expect(result).toContain('100');
      expect(result).toContain('25');
      expect(result).toContain('5');
      expect(result).toContain('react');
      expect(result).toContain('nodejs');
      expect(result).toContain('github.com/testuser/test-repo');
      expect(result).toContain('README');
    });

    test('should handle missing repository data gracefully', () => {
      const mockRepo = {
        name: 'minimal-repo',
        owner: { login: 'testuser' },
        stargazers_count: 0,
        forks_count: 0,
        open_issues_count: 0,
        updated_at: '2023-01-01T00:00:00Z',
        html_url: 'https://github.com/testuser/minimal-repo'
      };

      const result = renderRepoCard(mockRepo);

      expect(result).toContain('minimal-repo');
      expect(result).toContain('testuser');
      expect(result).toContain('Other');
      expect(result).toContain('No description available');
      expect(result).toContain('0');
    });

    test('should include README button with correct data attributes', () => {
      const mockRepo = {
        name: 'test-repo',
        owner: { login: 'testuser' },
        stargazers_count: 100,
        forks_count: 25,
        open_issues_count: 5,
        updated_at: '2023-01-01T00:00:00Z',
        html_url: 'https://github.com/testuser/test-repo'
      };

      const result = renderRepoCard(mockRepo);

      expect(result).toContain('data-owner="testuser"');
      expect(result).toContain('data-repo="test-repo"');
    });
  });

  describe('renderProfileHeader', () => {
    test('should render profile header with all required fields', () => {
      const mockUser = {
        login: 'testuser',
        name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'Test bio',
        followers: 100,
        public_repos: 50,
        following: 25,
        html_url: 'https://github.com/testuser'
      };

      const result = renderProfileHeader(mockUser);

      expect(result).toContain('testuser');
      expect(result).toContain('Test User');
      expect(result).toContain('Test bio');
      expect(result).toContain('100');
      expect(result).toContain('50');
      expect(result).toContain('25');
      expect(result).toContain('github.com/testuser');
      expect(result).toContain('bookmark-btn');
      expect(result).toContain('share-btn');
    });

    test('should show bookmark state correctly', () => {
      const mockUser = {
        login: 'testuser',
        name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        followers: 100,
        public_repos: 50,
        following: 25,
        html_url: 'https://github.com/testuser'
      };

      // Mock isBookmarked to return true
      require('../js/utils.js').isBookmarked.mockReturnValue(true);

      const result = renderProfileHeader(mockUser);

      expect(result).toContain('bookmarked');
      expect(result).toContain('star');
    });
  });

  describe('renderActivityCard', () => {
    test('should render activity card with event data', () => {
      const mockEvent = {
        type: 'PushEvent',
        created_at: '2023-01-01T00:00:00Z',
        actor: {
          login: 'testuser',
          avatar_url: 'https://example.com/avatar.jpg',
          html_url: 'https://github.com/testuser'
        },
        repo: {
          name: 'testuser/test-repo',
          html_url: 'https://github.com/testuser/test-repo'
        },
        payload: {
          commits: [{ message: 'Initial commit' }]
        }
      };

      const result = renderActivityCard(mockEvent);

      expect(result).toContain('testuser');
      expect(result).toContain('testuser/test-repo');
      expect(result).toContain('PushEvent');
      expect(result).toContain('2 days ago');
    });

    test('should handle different event types', () => {
      const mockEvent = {
        type: 'PullRequestEvent',
        created_at: '2023-01-01T00:00:00Z',
        actor: {
          login: 'testuser',
          avatar_url: 'https://example.com/avatar.jpg',
          html_url: 'https://github.com/testuser'
        },
        repo: {
          name: 'testuser/test-repo',
          html_url: 'https://github.com/testuser/test-repo'
        },
        payload: {
          action: 'opened',
          pull_request: { title: 'Add new feature' }
        }
      };

      const result = renderActivityCard(mockEvent);

      expect(result).toContain('PullRequestEvent');
      expect(result).toContain('opened');
    });
  });

  describe('renderPagination', () => {
    test('should render pagination with correct page numbers', () => {
      const onPageChange = jest.fn();
      const result = renderPagination(2, 10, onPageChange);

      expect(result).toContain('1');
      expect(result).toContain('2');
      expect(result).toContain('3');
      expect(result).toContain('10');
      expect(result).toContain('active');
    });

    test('should handle single page', () => {
      const onPageChange = jest.fn();
      const result = renderPagination(1, 1, onPageChange);

      expect(result).toBe('');
    });

    test('should handle large page numbers with ellipsis', () => {
      const onPageChange = jest.fn();
      const result = renderPagination(5, 20, onPageChange);

      expect(result).toContain('...');
    });
  });

  describe('renderSkeletonCards', () => {
    test('should render correct number of skeleton cards', () => {
      const result = renderSkeletonCards(5);
      
      expect(result).toContain('skeleton skeleton-card');
      // Should have 5 skeleton cards
      expect((result.match(/skeleton skeleton-card/g) || []).length).toBe(5);
    });

    test('should use default count when not specified', () => {
      const result = renderSkeletonCards();
      
      expect((result.match(/skeleton skeleton-card/g) || []).length).toBe(6);
    });
  });

  describe('renderEmptyState', () => {
    test('should render empty state with title and message', () => {
      const result = renderEmptyState('No Results', ['Try again', 'Check filters']);

      expect(result).toContain('No Results');
      expect(result).toContain('Try again');
      expect(result).toContain('Check filters');
    });

    test('should handle empty suggestions array', () => {
      const result = renderEmptyState('No Results', []);

      expect(result).toContain('No Results');
      expect(result).not.toContain('Try again');
    });
  });

  describe('renderErrorToast', () => {
    test('should render error toast with message', () => {
      const result = renderErrorToast('Error occurred');

      expect(result).toContain('Error occurred');
      expect(result).toContain('toast');
    });
  });

  describe('renderTechInsights', () => {
    test('should render tech insights cards', () => {
      const mockInsights = [
        {
          icon: 'icon1',
          title: 'JavaScript',
          description: 'Popular language',
          stats: ['1000 repos', '500 devs']
        },
        {
          icon: 'icon2',
          title: 'React',
          description: 'Popular framework',
          stats: ['500 repos', '250 devs']
        }
      ];

      const result = renderTechInsights(mockInsights);

      expect(result).toContain('JavaScript');
      expect(result).toContain('React');
      expect(result).toContain('1000 repos');
      expect(result).toContain('500 devs');
      expect(result).toContain('icon1');
      expect(result).toContain('icon2');
    });
  });

  describe('renderCountryDensity', () => {
    test('should render country density cards', () => {
      const mockCountries = [
        { name: 'Kenya', count: 1000, percentage: 25 },
        { name: 'Nigeria', count: 800, percentage: 20 }
      ];

      const result = renderCountryDensity(mockCountries);

      expect(result).toContain('Kenya');
      expect(result).toContain('Nigeria');
      expect(result).toContain('1000');
      expect(result).toContain('800');
      expect(result).toContain('25%');
      expect(result).toContain('20%');
      expect(result).toContain('developers.html');
    });
  });

  describe('renderSpotlightDeveloper', () => {
    test('should render spotlight developer card', () => {
      const mockUser = {
        login: 'testuser',
        name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'Test bio',
        location: 'Nairobi, Kenya',
        followers: 100,
        public_repos: 50,
        following: 25,
        html_url: 'https://github.com/testuser'
      };

      const result = renderSpotlightDeveloper(mockUser);

      expect(result).toContain('Test User');
      expect(result).toContain('testuser');
      expect(result).toContain('Test bio');
      expect(result).toContain('Nairobi, Kenya');
      expect(result).toContain('100');
      expect(result).toContain('50');
      expect(result).toContain('25');
      expect(result).toContain('github.com/testuser');
      expect(result).toContain('profile.html?user=testuser');
    });
  });

  describe('attachCardActionHandlers', () => {
    test('should attach event handlers to card actions', () => {
      // Mock DOM elements
      const mockContainer = {
        addEventListener: jest.fn(),
        querySelectorAll: jest.fn(() => [
          { classList: { contains: jest.fn() }, dataset: { username: 'testuser' } }
        ])
      };

      // Mock document.querySelector
      document.querySelector = jest.fn(() => mockContainer);

      attachCardActionHandlers();

      expect(mockContainer.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });

    test('should handle bookmark clicks', () => {
      const mockContainer = {
        addEventListener: jest.fn(),
        querySelectorAll: jest.fn(() => [
          { 
            classList: { contains: jest.fn().mockReturnValue(true) }, 
            dataset: { username: 'testuser' },
            textContent: 'star_border',
            classList: { toggle: jest.fn() }
          }
        ])
      };

      document.querySelector = jest.fn(() => mockContainer);
      
      // Mock toggleBookmark
      jest.doMock('../js/utils.js', () => ({
        ...jest.requireActual('../js/utils.js'),
        toggleBookmark: jest.fn()
      }));

      attachCardActionHandlers();

      const clickHandler = mockContainer.addEventListener.mock.calls[0][1];
      const mockEvent = {
        target: { closest: jest.fn().mockReturnValue({ 
          classList: { contains: jest.fn().mockReturnValue(true) }, 
          dataset: { username: 'testuser' },
          textContent: 'star_border',
          classList: { toggle: jest.fn() }
        })},
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      };

      clickHandler(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('should handle null/undefined inputs', () => {
      expect(() => renderDevCard(null)).not.toThrow();
      expect(() => renderRepoCard(null)).not.toThrow();
      expect(() => renderProfileHeader(null)).not.toThrow();
      expect(() => renderActivityCard(null)).not.toThrow();
    });

    test('should handle empty object inputs', () => {
      expect(() => renderDevCard({})).not.toThrow();
      expect(() => renderRepoCard({})).not.toThrow();
      expect(() => renderProfileHeader({})).not.toThrow();
      expect(() => renderActivityCard({})).not.toThrow();
    });

    test('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const mockUser = {
        login: longString,
        name: longString,
        bio: longString,
        avatar_url: 'https://example.com/avatar.jpg',
        followers: 100,
        public_repos: 50,
        following: 25,
        location: longString,
        html_url: 'https://github.com/testuser'
      };

      const result = renderDevCard(mockUser);
      expect(result).toContain(longString);
    });
  });
});
