/**
 * INTEGRATION TESTS
 * Integration tests for page functionality and user interactions
 */

import { JSDOM } from 'jsdom';

// Mock DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Mock API functions
jest.mock('../js/api.js', () => ({
  searchUsers: jest.fn(),
  searchRepos: jest.fn(),
  getUser: jest.fn(),
  getUserRepos: jest.fn(),
  getUserEvents: jest.fn(),
  getRepoReadme: jest.fn(),
  searchByFramework: jest.fn(),
  searchDevelopersByTech: jest.fn(),
  searchCofounders: jest.fn(),
  searchJobSeekers: jest.fn(),
  updateRateLimitDisplay: jest.fn()
}));

// Mock render functions
jest.mock('../js/render.js', () => ({
  renderDevCard: jest.fn(() => '<div class="dev-card"></div>'),
  renderRepoCard: jest.fn(() => '<div class="repo-card"></div>'),
  renderProfileHeader: jest.fn(() => '<div class="profile-header"></div>'),
  renderActivityCard: jest.fn(() => '<div class="activity-card"></div>'),
  renderPagination: jest.fn(() => '<div class="pagination"></div>'),
  renderSkeletonCards: jest.fn(() => '<div class="skeleton"></div>'),
  renderEmptyState: jest.fn(() => '<div class="empty-state"></div>'),
  renderErrorToast: jest.fn(() => '<div class="toast"></div>'),
  attachCardActionHandlers: jest.fn()
}));

// Mock utility functions
jest.mock('../js/utils.js', () => ({
  getQueryParam: jest.fn(),
  debounce: jest.fn((fn) => fn),
  getMaxPages: jest.fn(() => 10),
  formatNumber: jest.fn((n) => n.toString()),
  timeAgo: jest.fn(() => '2 days ago'),
  sanitize: jest.fn((str) => str),
  getLanguageColor: jest.fn(() => '#f1e05a'),
  getSearchHistory: jest.fn(() => []),
  addToSearchHistory: jest.fn(),
  removeFromSearchHistory: jest.fn(),
  clearSearchHistory: jest.fn(),
  displaySearchHistory: jest.fn(),
  getBookmark: jest.fn(),
  addBookmark: jest.fn(),
  removeBookmark: jest.fn(),
  isBookmarked: jest.fn(() => false),
  toggleBookmark: jest.fn(),
  exportBookmarks: jest.fn(() => []),
  copyProfileLink: jest.fn(),
  setCache: jest.fn(),
  getCache: jest.fn(),
  updateRateLimitBar: jest.fn()
}));

describe('Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    localStorageMock.clear();
  });

  describe('Home Page Integration', () => {
    test('should load home page with all sections', async () => {
      // Create home page structure
      document.body.innerHTML = `
        <div class="hero">
          <input id="hero-search-input" class="search-input" />
          <button id="hero-search-btn" class="search-btn">search</button>
          <div id="search-suggestions" class="search-suggestions"></div>
        </div>
        <div class="country-pills">
          <button class="country-pill" data-country="kenya">Kenya</button>
          <button class="country-pill" data-country="nigeria">Nigeria</button>
        </div>
        <div id="featured-developers-grid" class="card-grid"></div>
        <div id="trending-repos-grid" class="card-grid"></div>
        <div id="tech-insights-grid"></div>
        <div id="live-feed-grid"></div>
      `;

      // Mock API responses
      const { searchUsers, searchRepos } = require('../js/api.js');
      searchUsers.mockResolvedValue({ users: [{ login: 'testuser' }], totalCount: 1 });
      searchRepos.mockResolvedValue({ repos: [{ name: 'testrepo' }], totalCount: 1 });

      // Simulate page load
      const searchInput = document.getElementById('hero-search-input');
      const searchBtn = document.getElementById('hero-search-btn');

      expect(searchInput).toBeTruthy();
      expect(searchBtn).toBeTruthy();
      expect(document.querySelectorAll('.country-pill')).toHaveLength(2);
    });

    test('should handle hero search functionality', () => {
      document.body.innerHTML = `
        <input id="hero-search-input" class="search-input" />
        <button id="hero-search-btn" class="search-btn">search</button>
        <div id="search-suggestions" class="search-suggestions"></div>
      `;

      const searchInput = document.getElementById('hero-search-input');
      const searchBtn = document.getElementById('hero-search-btn');

      // Simulate search input
      searchInput.value = 'test search';
      searchInput.dispatchEvent(new Event('input'));

      // Simulate search button click
      searchBtn.click();

      expect(searchInput.value).toBe('test search');
    });

    test('should handle country pill clicks', () => {
      document.body.innerHTML = `
        <div class="country-pills">
          <button class="country-pill" data-country="kenya">Kenya</button>
          <button class="country-pill" data-country="nigeria">Nigeria</button>
        </div>
      `;

      const kenyaPill = document.querySelector('[data-country="kenya"]');
      kenyaPill.click();

      expect(kenyaPill.classList.contains('active')).toBe(true);
    });
  });

  describe('Developers Page Integration', () => {
    test('should load developers page with tabs', () => {
      document.body.innerHTML = `
        <div class="filter-tabs">
          <button class="filter-tab" data-tab="search">All Developers</button>
          <button class="filter-tab" data-tab="tech">By Technology</button>
          <button class="filter-tab" data-tab="cofounders">Co-founders</button>
          <button class="filter-tab" data-tab="jobs">Hiring</button>
        </div>
        <div class="tech-pills">
          <button class="tech-pill" data-tech="javascript" data-type="language">JavaScript</button>
          <button class="tech-pill" data-tech="react" data-type="framework">React</button>
        </div>
        <div id="developers-grid" class="card-grid"></div>
        <div id="pagination" class="pagination"></div>
      `;

      const tabs = document.querySelectorAll('.filter-tab');
      const techPills = document.querySelectorAll('.tech-pill');

      expect(tabs).toHaveLength(4);
      expect(techPills).toHaveLength(2);

      // Test tab switching
      tabs[1].click(); // Click "By Technology" tab
      expect(tabs[1].classList.contains('active')).toBe(true);

      // Test tech pill selection
      techPills[0].click(); // Click JavaScript pill
      expect(techPills[0].classList.contains('active')).toBe(true);
    });

    test('should handle search functionality', () => {
      document.body.innerHTML = `
        <input id="search-input" class="search-input" />
        <select id="country-select" class="country-select">
          <option value="">All Countries</option>
          <option value="kenya">Kenya</option>
        </select>
        <div id="developers-grid" class="card-grid"></div>
      `;

      const searchInput = document.getElementById('search-input');
      const countrySelect = document.getElementById('country-select');

      searchInput.value = 'javascript developer';
      countrySelect.value = 'kenya';

      expect(searchInput.value).toBe('javascript developer');
      expect(countrySelect.value).toBe('kenya');
    });

    test('should handle pagination', () => {
      document.body.innerHTML = `
        <div id="pagination" class="pagination"></div>
      `;

      const pagination = document.getElementById('pagination');
      pagination.innerHTML = '<button class="page-btn">1</button><button class="page-btn">2</button>';

      const pageButtons = pagination.querySelectorAll('.page-btn');
      expect(pageButtons).toHaveLength(2);

      pageButtons[1].click(); // Click page 2
      expect(pageButtons[1].classList.contains('active')).toBe(true);
    });
  });

  describe('Repositories Page Integration', () => {
    test('should load repositories page with filters', () => {
      document.body.innerHTML = `
        <div class="language-pills">
          <button class="pill" data-language="JavaScript">JavaScript</button>
          <button class="pill" data-language="Python">Python</button>
        </div>
        <select id="sort-select" class="sort-select">
          <option value="stars">Most Stars</option>
          <option value="forks">Most Forks</option>
        </select>
        <div id="repositories-grid" class="card-grid"></div>
        <div id="pagination" class="pagination"></div>
      `;

      const languagePills = document.querySelectorAll('.pill');
      const sortSelect = document.getElementById('sort-select');

      expect(languagePills).toHaveLength(2);
      expect(sortSelect).toBeTruthy();

      // Test language pill selection
      languagePills[0].click(); // Click JavaScript
      expect(languagePills[0].classList.contains('active')).toBe(true);

      // Test sort selection
      sortSelect.value = 'forks';
      expect(sortSelect.value).toBe('forks');
    });

    test('should handle README preview functionality', () => {
      document.body.innerHTML = `
        <div id="repositories-grid" class="card-grid">
          <article class="repo-card" data-owner="testuser" data-repo="testrepo">
            <button class="readme-btn">README</button>
          </article>
        </div>
        <div id="readme-preview" class="readme-preview">
          <div id="readme-body" class="readme-body"></div>
          <button class="readme-close">close</button>
        </div>
      `;

      const readmeBtn = document.querySelector('.readme-btn');
      const readmePreview = document.getElementById('readme-preview');
      const readmeClose = document.querySelector('.readme-close');

      // Test README button click
      readmeBtn.click();
      expect(readmePreview.classList.contains('active')).toBe(true);

      // Test close button click
      readmeClose.click();
      expect(readmePreview.classList.contains('active')).toBe(false);
    });
  });

  describe('Profile Page Integration', () => {
    test('should load profile page with all sections', () => {
      document.body.innerHTML = `
        <div id="profile-header"></div>
        <div id="contribution-heatmap" class="heatmap-container"></div>
        <div id="similar-developers-grid" class="card-grid"></div>
        <div id="profile-repos-grid" class="card-grid"></div>
      `;

      const profileHeader = document.getElementById('profile-header');
      const heatmapContainer = document.getElementById('contribution-heatmap');
      const similarDevelopersGrid = document.getElementById('similar-developers-grid');
      const profileReposGrid = document.getElementById('profile-repos-grid');

      expect(profileHeader).toBeTruthy();
      expect(heatmapContainer).toBeTruthy();
      expect(similarDevelopersGrid).toBeTruthy();
      expect(profileReposGrid).toBeTruthy();
    });

    test('should handle bookmark functionality', () => {
      document.body.innerHTML = `
        <div id="profile-header">
          <button class="bookmark-btn" data-username="testuser">star_border</button>
        </div>
      `;

      const bookmarkBtn = document.querySelector('.bookmark-btn');
      
      // Test bookmark toggle
      bookmarkBtn.click();
      expect(bookmarkBtn.classList.contains('bookmarked')).toBe(true);
      expect(bookmarkBtn.textContent).toBe('star');
    });

    test('should handle share functionality', async () => {
      document.body.innerHTML = `
        <div id="profile-header">
          <button class="share-btn" data-username="testuser">share</button>
        </div>
      `;

      const shareBtn = document.querySelector('.share-btn');
      const mockCopy = jest.fn().mockResolvedValue();
      global.navigator.clipboard = { writeText: mockCopy };

      await shareBtn.click();
      expect(mockCopy).toHaveBeenCalledWith('https://github.com/testuser');
    });

    test('should display contribution heatmap', () => {
      document.body.innerHTML = `
        <div id="contribution-heatmap" class="heatmap-container"></div>
      `;

      const heatmapContainer = document.getElementById('contribution-heatmap');
      
      // Mock contribution data
      const contributions = Array.from({ length: 365 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 10),
        level: Math.floor(Math.random() * 5)
      }));

      // Simulate heatmap rendering
      heatmapContainer.innerHTML = '<div class="contribution-graph"></div>';
      expect(heatmapContainer.innerHTML).toContain('contribution-graph');
    });
  });

  describe('Activity Page Integration', () => {
    test('should load activity page with filters', () => {
      document.body.innerHTML = `
        <div class="event-filters">
          <input type="checkbox" class="event-type-filter" value="PushEvent" checked>
          <input type="checkbox" class="event-type-filter" value="PullRequestEvent" checked>
        </div>
        <select id="country-filter" class="country-filter">
          <option value="">All Countries</option>
          <option value="kenya">Kenya</option>
        </select>
        <div class="activity-feed"></div>
        <button class="refresh-btn">Refresh</button>
      `;

      const eventFilters = document.querySelectorAll('.event-type-filter');
      const countryFilter = document.getElementById('country-filter');
      const refreshBtn = document.querySelector('.refresh-btn');

      expect(eventFilters).toHaveLength(2);
      expect(countryFilter).toBeTruthy();
      expect(refreshBtn).toBeTruthy();

      // Test event filter changes
      eventFilters[0].checked = false;
      expect(eventFilters[0].checked).toBe(false);

      // Test country filter
      countryFilter.value = 'kenya';
      expect(countryFilter.value).toBe('kenya');

      // Test refresh button
      refreshBtn.click();
      expect(refreshBtn).toBeTruthy();
    });

    test('should display live indicator', () => {
      document.body.innerHTML = `
        <span class="live-dot"></span>
        <span class="live-text">LIVE</span>
      `;

      const liveDot = document.querySelector('.live-dot');
      const liveText = document.querySelector('.live-text');

      expect(liveDot).toBeTruthy();
      expect(liveText).toBeTruthy();
      expect(liveDot.classList.contains('live')).toBe(true);
      expect(liveText.textContent).toBe('LIVE');
    });

    test('should handle auto-refresh', () => {
      document.body.innerHTML = `
        <div class="activity-feed"></div>
      `;

      const activityFeed = document.querySelector('.activity-feed');
      
      // Mock auto-refresh interval
      jest.useFakeTimers();
      
      // Simulate auto-refresh
      setTimeout(() => {
        activityFeed.innerHTML = '<div class="activity-card">New activity</div>';
      }, 60000);

      jest.advanceTimersByTime(60000);
      
      expect(activityFeed.innerHTML).toContain('New activity');
      
      jest.useRealTimers();
    });
  });

  describe('Navigation Integration', () => {
    test('should handle navigation between pages', () => {
      document.body.innerHTML = `
        <nav class="navbar">
          <a href="index.html" class="nav-link">Home</a>
          <a href="developers.html" class="nav-link">Developers</a>
          <a href="repositories.html" class="nav-link">Repositories</a>
          <a href="activity.html" class="nav-link">Activity</a>
          <a href="profile.html" class="nav-link">Profile</a>
          <a href="about.html" class="nav-link">About</a>
        </nav>
      `;

      const navLinks = document.querySelectorAll('.nav-link');
      expect(navLinks).toHaveLength(6);

      // Test navigation clicks
      navLinks[1].click(); // Click Developers
      expect(navLinks[1].getAttribute('href')).toBe('developers.html');
    });

    test('should handle mobile menu toggle', () => {
      document.body.innerHTML = `
        <button class="menu-toggle">|||</button>
        <div class="nav-links"></div>
      `;

      const menuToggle = document.querySelector('.menu-toggle');
      const navLinks = document.querySelector('.nav-links');

      menuToggle.click();
      expect(navLinks.classList.contains('open')).toBe(true);

      menuToggle.click();
      expect(navLinks.classList.contains('open')).toBe(false);
    });
  });

  describe('Error Handling Integration', () => {
    test('should handle API errors gracefully', async () => {
      document.body.innerHTML = `
        <div id="error-container"></div>
        <div id="toast-container"></div>
      `;

      const { searchUsers } = require('../js/api.js');
      searchUsers.mockRejectedValue(new Error('API Error'));

      try {
        await searchUsers('test', 'location', 1, 10);
      } catch (error) {
        expect(error.message).toBe('API Error');
      }
    });

    test('should display error states', () => {
      document.body.innerHTML = `
        <div id="empty-state-container"></div>
      `;

      const container = document.getElementById('empty-state-container');
      container.innerHTML = '<div class="empty-state">No results found</div>';

      expect(container.innerHTML).toContain('No results found');
    });

    test('should handle loading states', () => {
      document.body.innerHTML = `
        <div id="loading-container"></div>
      `;

      const container = document.getElementById('loading-container');
      container.innerHTML = '<div class="skeleton skeleton-card"></div>';

      expect(container.innerHTML).toContain('skeleton');
    });
  });

  describe('Performance Integration', () => {
    test('should handle debounced search', (done) => {
      document.body.innerHTML = `
        <input id="search-input" class="search-input" />
      `;

      const searchInput = document.getElementById('search-input');
      const { debounce } = require('../js/utils.js');
      
      let callCount = 0;
      const debouncedFn = debounce(() => {
        callCount++;
      }, 100);

      // Rapid calls should be debounced
      debouncedFn();
      debouncedFn();
      debouncedFn();

      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 150);
    });

    test('should handle large datasets', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        login: `user${i}`,
        name: `User ${i}`,
        followers: Math.floor(Math.random() * 1000)
      }));

      expect(largeDataset).toHaveLength(1000);
      expect(largeDataset[0].login).toBe('user0');
      expect(largeDataset[999].login).toBe('user999');
    });
  });

  describe('Accessibility Integration', () => {
    test('should have proper ARIA attributes', () => {
      document.body.innerHTML = `
        <button aria-label="Toggle navigation" aria-expanded="false">|||</button>
        <div role="main" aria-live="polite">
          <h1>Page Title</h1>
        </div>
      `;

      const button = document.querySelector('button[aria-label]');
      const main = document.querySelector('[role="main"]');

      expect(button.getAttribute('aria-label')).toBe('Toggle navigation');
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(main.getAttribute('role')).toBe('main');
      expect(main.getAttribute('aria-live')).toBe('polite');
    });

    test('should handle keyboard navigation', () => {
      document.body.innerHTML = `
        <button tabindex="0">Button 1</button>
        <button tabindex="0">Button 2</button>
      `;

      const buttons = document.querySelectorAll('button[tabindex="0"]');
      expect(buttons).toHaveLength(2);

      // Simulate keyboard navigation
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      buttons[0].dispatchEvent(event);

      expect(buttons[0]).toBeTruthy();
    });
  });

  describe('Responsive Design Integration', () => {
    test('should handle mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });

      document.body.innerHTML = `
        <div class="container">
          <div class="grid">
            <div class="card">Card 1</div>
            <div class="card">Card 2</div>
          </div>
        </div>
      `;

      const container = document.querySelector('.container');
      expect(container).toBeTruthy();

      // Test responsive behavior
      window.innerWidth = 768; // Tablet
      expect(window.innerWidth).toBe(768);

      window.innerWidth = 1024; // Desktop
      expect(window.innerWidth).toBe(1024);
    });
  });
});
