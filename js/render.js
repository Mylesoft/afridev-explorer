/**
 * RENDER.JS - DOM Rendering Functions
 * Builds and injects HTML for cards, profiles, and UI elements
 */

import {
  sanitize,
  formatNumber,
  timeAgo,
  getLanguageColor,
  isBookmarked,
  toggleBookmark,
  copyProfileLink
} from './utils.js';

/**
 * Render a developer card
 * @param {Object} user - GitHub user object
 * @returns {string} - HTML string for dev card
 */
export function renderDevCard(user) {
  user = user || {};
  const login = user.login || 'unknown-user';
  const avatarUrl = user.avatar_url || 'assets/default-avatar.png';
  const repositoriesUrl = `repositories.html?owner=${encodeURIComponent(login)}`;

  const stats = [
    { label: 'Followers', value: formatNumber(user.followers || 0) },
    { label: 'Repos', value: formatNumber(user.public_repos || 0) },
    { label: 'Following', value: formatNumber(user.following || 0) }
  ];

  const bookmarked = isBookmarked(login);

  return `
    <article class="card dev-card" data-username="${sanitize(login)}">
      <div class="card-header">
        <img src="${sanitize(avatarUrl)}" alt="${sanitize(user.name || login)}" class="card-avatar" loading="lazy" onerror="this.src='assets/default-avatar.png'">
        <div>
          <h3 class="card-title">${sanitize(user.name || login)}</h3>
          <p class="card-subtitle">@${sanitize(login)}</p>
        </div>
        <div class="card-bookmarks">
          <button class="bookmark-btn ${bookmarked ? 'bookmarked' : ''}" data-username="${sanitize(login)}" aria-label="${bookmarked ? 'Remove bookmark' : 'Add bookmark'}">
            ${bookmarked ? 'star' : 'star_border'}
          </button>
          <button class="share-btn" data-username="${sanitize(login)}" aria-label="Share profile">
            share
          </button>
        </div>
      </div>
      <div class="card-content">
        <p class="card-description">${sanitize(user.bio || 'Passionate developer contributing to the African tech ecosystem.')}</p>
        <div class="card-stats">
          ${stats.map(s => `
            <div class="card-stat">
              <div class="card-stat-value">${s.value}</div>
              <div class="card-stat-label">${s.label}</div>
            </div>
          `).join('')}
        </div>
        <div class="card-tags">
          <span class="card-tag">JavaScript</span>
          <span class="card-tag">Open Source</span>
        </div>
      </div>
      <div class="card-footer">
        <div class="card-meta">
          <span>${user.location ? sanitize(user.location) : 'Location not specified'}</span>
        </div>
        <div class="card-actions">
          <a href="profile.html?user=${sanitize(login)}" class="card-link view-profile-btn">View Profile</a>
          <a href="${sanitize(repositoriesUrl)}" class="card-link">View Repositories</a>
          <a href="${sanitize(user.html_url || '#')}" target="_blank" rel="noopener noreferrer" class="card-link">GitHub</a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render a repository card
 * @param {Object} repo - GitHub repository object
 * @returns {string} - HTML string for repo card
 */
export function renderRepoCard(repo) {
  repo = repo || {};
  const owner = repo.owner || {};
  const ownerLogin = owner.login || '';
  const repoName = repo.name || '';
  const repoUrl = repo.html_url || (ownerLogin && repoName ? `https://github.com/${ownerLogin}/${repoName}` : '#');
  const lang = repo.language || 'Other';
  const color = getLanguageColor(lang);

  const stats = [
    { label: 'Stars', value: formatNumber(repo.stargazers_count || 0) },
    { label: 'Forks', value: formatNumber(repo.forks_count || 0) },
    { label: 'Issues', value: formatNumber(repo.open_issues_count || 0) }
  ];

  return `
    <article class="card repo-card" data-owner="${sanitize(ownerLogin)}" data-repo="${sanitize(repoName)}">
      <div class="card-header">
        <img src="${sanitize(owner.avatar_url || 'assets/default-avatar.png')}" alt="${sanitize(ownerLogin || 'Repository owner')}" class="card-avatar" loading="lazy" onerror="this.src='assets/default-avatar.png'">
        <div>
          <h3 class="card-title">${sanitize(repoName || 'Untitled repository')}</h3>
          <p class="card-subtitle">${sanitize(ownerLogin || 'Unknown owner')}</p>
        </div>
        <div class="card-actions">
          <button class="readme-btn" data-owner="${sanitize(ownerLogin)}" data-repo="${sanitize(repoName)}">README</button>
        </div>
      </div>
      <div class="card-content">
        <p class="card-description">${sanitize(repo.description || 'No description available')}</p>
        <div class="card-stats">
          ${stats.map(s => `
            <div class="card-stat">
              <div class="card-stat-value">${s.value}</div>
              <div class="card-stat-label">${s.label}</div>
            </div>
          `).join('')}
        </div>
        <div class="card-tags">
          ${lang ? `<span class="card-tag" style="background-color: ${color}; border-color: ${color};">${sanitize(lang)}</span>` : ''}
          ${repo.topics ? repo.topics.slice(0, 3).map(topic => `<span class="card-tag">${sanitize(topic)}</span>`).join('') : ''}
        </div>
      </div>
      <div class="card-footer">
        <div class="card-meta">
          <span>${timeAgo(repo.updated_at)}</span>
        </div>
        <div class="card-actions">
          <a href="${sanitize(repoUrl)}" target="_blank" rel="noopener noreferrer" class="card-link">View Repository</a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render a profile header
 * @param {Object} user - GitHub user object
 * @returns {string} - HTML string for the profile header
 */
export function renderProfileHeader(user = {}) {
  const login = user.login || 'unknown-user';
  const displayName = user.name || login;
  const bookmarked = isBookmarked(login);
  const repositoriesUrl = `repositories.html?owner=${encodeURIComponent(login)}`;

  return `
    <div class="container">
      <div class="profile-card">
        <div class="profile-card__media">
          <img
            src="${sanitize(user.avatar_url || 'assets/default-avatar.png')}"
            alt="${sanitize(displayName)}"
            class="profile-avatar"
            loading="lazy"
            onerror="this.src='assets/default-avatar.png'"
          >
        </div>
        <div class="profile-card__body">
          <div class="profile-card__top">
            <div>
              <h1 class="profile-name">${sanitize(displayName)}</h1>
              <p class="profile-username">@${sanitize(login)}</p>
            </div>
            <div class="profile-actions">
              <button
                class="bookmark-btn ${bookmarked ? 'bookmarked' : ''}"
                data-username="${sanitize(login)}"
                aria-label="${bookmarked ? 'Remove bookmark' : 'Add bookmark'}"
              >
                ${bookmarked ? 'star' : 'star_border'}
              </button>
              <button class="share-btn" data-username="${sanitize(login)}" aria-label="Share profile">
                share
              </button>
            </div>
          </div>
          <p class="profile-bio">${sanitize(user.bio || 'Passionate developer contributing to the African tech ecosystem.')}</p>
          <div class="profile-stats">
            <div class="profile-stat">
              <span class="profile-stat__value">${formatNumber(user.followers || 0)}</span>
              <span class="profile-stat__label">Followers</span>
            </div>
            <div class="profile-stat">
              <span class="profile-stat__value">${formatNumber(user.public_repos || 0)}</span>
              <span class="profile-stat__label">Repositories</span>
            </div>
            <div class="profile-stat">
              <span class="profile-stat__value">${formatNumber(user.following || 0)}</span>
              <span class="profile-stat__label">Following</span>
            </div>
          </div>
          <div class="profile-meta">
            <span>${sanitize(user.location || 'Location not specified')}</span>
            ${user.blog ? `<a href="${sanitize(user.blog)}" target="_blank" rel="noopener noreferrer">Website</a>` : ''}
            <a href="${sanitize(repositoriesUrl)}">View Repositories</a>
            ${user.html_url ? `<a href="${sanitize(user.html_url)}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render spotlight developer card
 * @param {Object} user - GitHub user object
 * @returns {string} - HTML string for spotlight card
 */
export function renderSpotlightDeveloper(user) {
  user = user || {};
  const login = user.login || 'unknown-user';
  const repositoriesUrl = `repositories.html?owner=${encodeURIComponent(login)}`;
  return `
    <div class="spotlight-card">
      <div class="spotlight-avatar">
        <img src="${sanitize(user.avatar_url || 'assets/default-avatar.png')}" alt="${sanitize(user.name || user.login || 'Developer')}" onerror="this.src='assets/default-avatar.png'">
      </div>
      <div class="spotlight-info">
        <h3 class="spotlight-name">${sanitize(user.name || login || 'Unknown developer')}</h3>
        <p class="spotlight-username">@${sanitize(login)}</p>
        <p class="spotlight-bio">${sanitize(user.bio || 'Passionate developer contributing to African tech ecosystem.')}</p>
        <p class="spotlight-location">${sanitize(user.location || 'Location not specified')}</p>
        <div class="spotlight-stats">
          <span class="spotlight-stat">${formatNumber(user.followers || 0)} followers</span>
          <span class="spotlight-stat">${formatNumber(user.public_repos || 0)} repos</span>
          <span class="spotlight-stat">${formatNumber(user.following || 0)} following</span>
        </div>
        <div class="spotlight-actions">
          <a href="profile.html?user=${sanitize(login)}" class="spotlight-link">View Profile</a>
          <a href="${sanitize(repositoriesUrl)}" class="spotlight-link">View Repositories</a>
          <a href="${sanitize(user.html_url || '#')}" target="_blank" rel="noopener noreferrer" class="spotlight-link">GitHub</a>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render country density grid
 * @param {Array} countries - Array of country data with developer counts
 * @returns {string} - HTML string for country density grid
 */
export function renderCountryDensity(countries) {
  return countries.map(country => `
    <article class="card country-card">
      <div class="card-header">
        <h3 class="card-title">${sanitize(country.name)}</h3>
      </div>
      <div class="card-content">
        <div class="country-stats">
          <div class="country-stat">
            <div class="country-stat-value">${formatNumber(country.developerCount || country.count || 0)}</div>
            <div class="country-stat-label">Developers</div>
          </div>
          <div class="country-percentage">${country.percentage || 0}%</div>
        </div>
      </div>
      <div class="card-footer">
        <a href="developers.html?country=${encodeURIComponent(country.name)}" class="card-link">Explore Developers</a>
      </div>
    </article>
  `).join('');
}

/**
 * Render tech leaderboard
 * @param {Array} technologies - Array of technology data with usage percentages
 * @returns {string} - HTML string for tech leaderboard
 */
export function renderTechLeaderboard(technologies) {
  return technologies.map(tech => `
    <div class="leaderboard-item">
      <div class="leaderboard-label">${sanitize(tech.name)}</div>
      <div class="leaderboard-bar">
        <div class="leaderboard-fill" style="width: ${tech.percentage || 0}%"></div>
      </div>
      <div class="leaderboard-percentage">${tech.percentage || 0}%</div>
    </div>
  `).join('');
}

/**
 * Render tech insights grid
 * @param {Array} insights - Array of tech insight data
 * @returns {string} - HTML string for tech insights grid
 */
export function renderTechInsights(insights) {
  return insights.map(insight => `
    <article class="insight-card">
      <div class="insight-icon">
        <span class="insight-icon-text">${sanitize(insight.icon)}</span>
      </div>
      <div class="insight-content">
        <h3 class="insight-title">${sanitize(insight.title)}</h3>
        <p class="insight-description">${sanitize(insight.description)}</p>
        <div class="insight-stats">
          ${insight.stats ? insight.stats.map(stat => `<div class="insight-stat">${sanitize(stat)}</div>`).join('') : ''}
        </div>
      </div>
    </article>
  `).join('');
}

/**
 * Render skeleton loading cards
 * @param {number} count - Number of skeletons to render
 * @returns {string} - HTML string for skeleton cards
 */
export function renderSkeletonCards(count = 6) {
  return Array(count)
    .fill(0)
    .map(() => '<div class="skeleton skeleton-card"></div>')
    .join('');
}

/**
 * Render empty state message
 * @param {string} message - The message to display
 * @returns {string} - HTML string for empty state
 */
export function renderEmptyState(message = 'No results found', suggestions = []) {
  return `
    <div class="empty-state">
      <h3>No Results</h3>
      <p>${sanitize(message)}</p>
      ${suggestions.map(suggestion => `<p>${sanitize(suggestion)}</p>`).join('')}
    </div>
  `;
}

/**
 * Render error toast notification
 * @param {string} message - Error message
 * @param {string} type - Type: 'error', 'success', 'warning' (default 'error')
 * @param {number} duration - Duration in ms (default 5000)
 */
export function renderErrorToast(message, type = 'error', duration = 5000) {
  const container = document.getElementById('toast-container');
  if (!container) {
    return `<div class="toast ${type}">${sanitize(message)}</div>`;
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = sanitize(message);

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);

  return toast.outerHTML;
}

/**
 * Render an activity card
 * @param {Object} event - GitHub event object
 * @returns {string} - HTML string for activity card
 */
export function renderActivityCard(event) {
  event = event || {};
  const eventType = event.type || 'Activity';
  const actor = event.actor || {};
  const repo = event.repo || {};
  
  return `
    <div class="activity-card">
      <div class="activity-header">
        <img src="${sanitize(actor.avatar_url)}" alt="Avatar of ${sanitize(actor.login)}" onerror="this.src='assets/default-avatar.png'" class="activity-avatar" loading="lazy" />
        <div class="activity-meta">
          <a href="profile.html?user=${sanitize(actor.login)}" class="activity-user">${sanitize(actor.login)}</a>
          <span class="activity-time">${timeAgo(event.created_at)}</span>
        </div>
        <span class="activity-type">${eventType}</span>
      </div>
      <div class="activity-content">
        <p class="activity-description">
          <span class="activity-user">${sanitize(actor.login)}</span> 
          ${getActivityDescription(event)}
          <a href="https://github.com/${sanitize(repo.name)}" class="activity-repo" target="_blank" rel="noopener noreferrer">${sanitize(repo.name)}</a>
        </p>
      </div>
    </div>
  `;
}

/**
 * Get human-readable description for GitHub event type
 * @param {Object} event - GitHub event object
 * @returns {string} - Description of event
 */
function getActivityDescription(event) {
  const descriptions = {
    'PushEvent': 'pushed to',
    'PullRequestEvent': 'opened a pull request in',
    'IssuesEvent': 'opened an issue in',
    'WatchEvent': 'starred',
    'ForkEvent': 'forked',
    'CreateEvent': 'created',
    'ReleaseEvent': 'released a new version of'
  };
  
  const action = descriptions[event.type] || 'performed an action in';
  const repo = event.repo ? event.repo.name : 'a repository';
  
  return `${action} ${repo}`;
}

/**
 * Render pagination controls
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {Function} onPageChange - Callback for page change
 * @returns {string} - HTML for pagination
 */
export function renderPagination(currentPage, totalPages, onPageChange) {
  if (totalPages <= 1) return '';

  let pagination = '<div class="pagination">';
  
  // Previous button
  if (currentPage > 1) {
    pagination += `<button class="pagination-btn" data-page="${currentPage - 1}">Previous</button>`;
  }
  
  // Page numbers
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  
  if (startPage > 1) {
    pagination += '<button class="pagination-btn" data-page="1">1</button>';
    if (startPage > 2) pagination += '<span class="pagination-ellipsis">...</span>';
  }
  
  for (let i = startPage; i <= endPage; i++) {
    const activeClass = i === currentPage ? 'active' : '';
    pagination += `<button class="pagination-btn ${activeClass}" data-page="${i}">${i}</button>`;
  }
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pagination += '<span class="pagination-ellipsis">...</span>';
    pagination += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
  }
  
  // Next button
  if (currentPage < totalPages) {
    pagination += `<button class="pagination-btn" data-page="${currentPage + 1}">Next</button>`;
  }
  
  pagination += '</div>';
  return pagination;
}

/**
 * Attach bookmark and share button event handlers
 * @param {HTMLElement} container - Container element with cards
 */
export function attachCardActionHandlers(container = document.querySelector('.card-grid, .pagination, #featured-devs, #developers-grid, #repositories-grid')) {
  if (!container) {
    return;
  }

  if (container.dataset?.cardActionsBound === 'true') {
    return;
  }

  if (container.dataset) {
    container.dataset.cardActionsBound = 'true';
  }

  // Bookmark buttons
  container.addEventListener('click', async (e) => {
    const paginationBtn = e.target.closest('.pagination-btn[data-page]');
    if (paginationBtn && typeof window.__afridevOnPageChange === 'function') {
      e.preventDefault();
      window.__afridevOnPageChange(Number(paginationBtn.dataset.page));
      return;
    }

    const bookmarkBtn = e.target.closest('.bookmark-btn');
    if (bookmarkBtn) {
      e.preventDefault();
      e.stopPropagation();
      const username = bookmarkBtn.dataset.username;
      if (typeof toggleBookmark !== 'function') {
        return;
      }

      toggleBookmark(username);
      
      // Update button state
      const isBookmarkedState = isBookmarked(username);
      bookmarkBtn.classList.toggle('bookmarked', isBookmarkedState);
      bookmarkBtn.textContent = isBookmarkedState ? 'star' : 'star_border';
      return;
    }

    // Share buttons
    const shareBtn = e.target.closest('.share-btn');
    if (shareBtn) {
      e.preventDefault();
      e.stopPropagation();
      const username = shareBtn.dataset.username;
      try {
        if (typeof copyProfileLink !== 'function') {
          throw new Error('Share is unavailable');
        }
        await copyProfileLink(username);
        showToast('Profile link copied to clipboard!', 'success');
      } catch (error) {
        showToast('Failed to copy profile link.', 'error');
      }
      return;
    }
  });
}

/**
 * Show toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type: 'success', 'error', 'info'
 */
export function showToast(message, type = 'info') {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span class="toast-message">${sanitize(message)}</span>
    <button class="toast-close" aria-label="Close notification">close</button>
  `;

  // Add to DOM
  document.body.appendChild(toast);

  // Handle close button
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 5000);
}
