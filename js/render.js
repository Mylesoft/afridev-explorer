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
          <span>${user.company ? sanitize(user.company) : 'Individual Developer'}</span>
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
 * @param {Object} repo - Repository object from GitHub API
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
    { icon: 'star', value: formatNumber(repo.stargazers_count || 0) },
    { icon: 'code-fork', value: formatNumber(repo.forks_count || 0) }
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
        <div class="card-language">
          <span class="language-badge" style="background: ${color}">${sanitize(lang)}</span>
        </div>
      </div>
      <div class="card-footer">
        <div class="card-meta">
          ${stats.map(s => `<span class="material-icons">${s.icon}</span><span>${s.value}</span>`).join('')}
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
 * Render country density chart
 * @param {Array} countries - Array of country objects
 * @returns {string} - HTML string for country density section
 */
export function renderCountryDensity(countries) {
  return countries.map(country => `
    <article class="card country-card">
      <div class="card-content">
        <div class="country-stats">
          <div class="country-stat">
            <div class="country-stat-value">${formatNumber(country.developerCount || country.count || 0)}</div>
            <div class="country-stat-label">Developers</div>
          </div>
          <div class="country-percentage">${country.percentage || 0}%</div>
        </div>
        <h3 class="card-title">${sanitize(country.name || 'Unknown')}</h3>
      </div>
    </article>
  `).join('');
}

/**
 * Render skeleton loading cards
 * @param {number} count - Number of skeleton cards to render
 * @returns {string} - HTML string for skeleton cards
 */
export function renderSkeletonCards(count = 6) {
  return Array(count)
    .fill(0)
    .map(() => '<div class="skeleton skeleton-card" aria-hidden="true"></div>')
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
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type of toast: 'success', 'error', 'info'
 * @param {number} duration - Duration to show in ms
 * @returns {HTMLElement} - The toast element
 */
export function showToast(message, type = 'info', duration = 5000) {
  const container = document.getElementById('toast-container');
  if (!container) {
    return document.createElement('div');
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = sanitize(message);
  toast.setAttribute('role', 'alert');
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);

  return toast;
}

/**
 * Render error toast (legacy, uses showToast)
 * @param {string} message - The message to display
 * @param {string} type - The type of message
 * @param {number} duration - Duration to display
 * @returns {string} - HTML string for error toast
 */
export function renderErrorToast(message, type = 'error', duration = 5000) {
  const container = document.getElementById('toast-container');
  if (!container) {
    return `<div class="toast ${type}">${sanitize(message)}</div>`;
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = sanitize(message);
  toast.setAttribute('role', 'alert');
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);

  return toast.outerHTML;
}

/**
 * Render activity card
 * @param {Object} event - Activity event object
 * @returns {string} - HTML string for activity card
 */
export function renderActivityCard(event) {
  event = event || {};
  const eventType = event.type || 'Activity';
  const actor = event.actor || {};
  const repo = event.repo || {};
  
  return `
    <div class="activity-card">
      <img src="${sanitize(actor.avatar_url || 'assets/default-avatar.png')}" alt="${sanitize(actor.login || 'User')}" class="activity-avatar" onerror="this.src='assets/default-avatar.png'">
      <div class="activity-details">
        <p class="activity-text">
          <strong>${sanitize(actor.login || 'Unknown')}</strong>
          ${eventType.toLowerCase().replace('event', '')} on
          <strong>${sanitize(repo.name || 'Unknown repo')}</strong>
        </p>
        <p class="activity-time">${timeAgo(event.created_at || new Date().toISOString())}</p>
      </div>
    </div>
  `;
}

/**
 * Render pagination controls
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {Function} onPageChange - Callback when page changes
 * @returns {string} - HTML string for pagination
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
      bookmarkBtn.classList.toggle('bookmarked');
      const isNowBookmarked = bookmarkBtn.classList.contains('bookmarked');
      bookmarkBtn.textContent = isNowBookmarked ? 'star' : 'star_border';
      bookmarkBtn.setAttribute('aria-label', isNowBookmarked ? 'Remove bookmark' : 'Add bookmark');
      
      showToast(
        isNowBookmarked ? 'Profile saved to bookmarks.' : 'Profile removed from bookmarks.',
        'success'
      );
      return;
    }

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
