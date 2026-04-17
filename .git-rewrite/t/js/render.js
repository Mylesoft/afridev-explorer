/**
 * RENDER.JS - DOM Rendering Functions
 * Builds and injects HTML for cards, profiles, and UI elements
 */

import { sanitize, formatNumber, timeAgo, getLanguageColor } from './utils.js';

/**
 * Render a developer card
 * @param {Object} user - GitHub user object
 * @returns {string} - HTML string for dev card
 */
export function renderDevCard(user) {
  const stats = [
    { label: 'Followers', value: formatNumber(user.followers || 0) },
    { label: 'Repos', value: formatNumber(user.public_repos || 0) }
  ];

  return `
    <div class="dev-card">
      <img src="${sanitize(user.avatar_url)}" alt="Avatar of ${sanitize(user.login)}"
           onerror="this.src='assets/default-avatar.png'" loading="lazy" />
      <h3>${sanitize(user.name || user.login)}</h3>
      <p class="username">@${sanitize(user.login)}</p>
      ${user.location ? `<p class="location">${sanitize(user.location)}</p>` : ''}
      <div class="stats">
        ${stats.map(s => `<div class="stat-item"><span class="stat-value">${s.value}</span><span class="stat-label">${s.label}</span></div>`).join('')}
      </div>
    </div>
  `;
}

/**
 * Render a repository card
 * @param {Object} repo - GitHub repository object
 * @returns {string} - HTML string for repo card
 */
export function renderRepoCard(repo) {
  const lang = repo.language || 'Other';
  const color = getLanguageColor(lang);

  return `
    <div class="repo-card">
      <div class="owner">
        <img src="${sanitize(repo.owner.avatar_url)}" alt="Avatar of ${sanitize(repo.owner.login)}"
             onerror="this.src='assets/default-avatar.png'" loading="lazy" />
        <span>${sanitize(repo.owner.login)}</span>
      </div>
      <h3><a href="${sanitize(repo.html_url)}" target="_blank" rel="noopener noreferrer">${sanitize(repo.name)}</a></h3>
      <p class="description">${sanitize(repo.description || 'No description')}</p>
      <div class="language-badge" style="background-color: ${color}30; color: ${color};">
        ● ${sanitize(lang)}
      </div>
      <div class="repo-stats">
        <span>⭐ ${formatNumber(repo.stargazers_count || 0)}</span>
        <span>🍴 ${formatNumber(repo.forks_count || 0)}</span>
        <span>Updated ${timeAgo(repo.updated_at)}</span>
      </div>
    </div>
  `;
}

/**
 * Render a profile header
 * @param {Object} user - GitHub user object
 * @returns {string} - HTML string for profile hero
 */
export function renderProfileHeader(user) {
  return `
    <div class="profile-header">
      <img src="${sanitize(user.avatar_url)}" alt="Avatar of ${sanitize(user.login)}"
           onerror="this.src='assets/default-avatar.png'" class="profile-avatar" loading="lazy" />
      <h1 class="profile-name">${sanitize(user.name || user.login)}</h1>
      <p class="profile-username">@${sanitize(user.login)}</p>
      ${user.bio ? `<p class="profile-bio">${sanitize(user.bio)}</p>` : ''}
      
      <div class="profile-stats">
        <div class="profile-stat">
          <span class="profile-stat-value">${formatNumber(user.public_repos || 0)}</span>
          <span class="profile-stat-label">Repositories</span>
        </div>
        <div class="profile-stat">
          <span class="profile-stat-value">${formatNumber(user.followers || 0)}</span>
          <span class="profile-stat-label">Followers</span>
        </div>
        <div class="profile-stat">
          <span class="profile-stat-value">${formatNumber(user.following || 0)}</span>
          <span class="profile-stat-label">Following</span>
        </div>
      </div>

      <div class="profile-links">
        <a href="${sanitize(user.html_url)}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        ${user.blog ? `<a href="${sanitize(user.blog)}" target="_blank" rel="noopener noreferrer">Website</a>` : ''}
        ${user.twitter_username ? `<a href="https://twitter.com/${sanitize(user.twitter_username)}" target="_blank" rel="noopener noreferrer">Twitter</a>` : ''}
      </div>
    </div>
  `;
}

/**
 * Render skeleton loaders
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
 * Render an empty state message
 * @param {string} message - The message to display
 * @returns {string} - HTML string for empty state
 */
export function renderEmptyState(message = 'No results found') {
  return `
    <div class="empty-state">
      <h3>No Results</h3>
      <p>${sanitize(message)}</p>
    </div>
  `;
}

/**
 * Render a toast notification
 * @param {string} message - Toast message
 * @param {string} type - Type: 'error', 'success', 'warning' (default 'error')
 * @param {number} duration - Duration in ms (default 5000)
 */
export function renderErrorToast(message, type = 'error', duration = 5000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = sanitize(message);

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Render an activity card
 * @param {Object} event - GitHub event object
 * @returns {string} - HTML string for activity card
 */
export function renderActivityCard(event) {
  const eventType = event.type.replace('Event', '');
  const actor = event.actor;
  const repo = event.repo;
  
  return `
    <div class="activity-card">
      <div class="activity-header">
        <img src="${sanitize(actor.avatar_url)}" alt="Avatar of ${sanitize(actor.login)}"
             onerror="this.src='assets/default-avatar.png'" class="activity-avatar" loading="lazy" />
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
 * @returns {string} - Description of the event
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
  
  return descriptions[event.type] || 'performed an action on';
}

/**
 * Render pagination controls
 * @param {number} current - Current page
 * @param {number} total - Total number of pages
 * @param {Function} onPageChange - Callback when page changes
 * @returns {string} - HTML string for pagination
 */
export function renderPagination(current, total, onPageChange) {
  if (total <= 1) return '';

  let html = `<div class="pagination">`;

  // Previous button
  if (current > 1) {
    html += `<button data-page="${current - 1}" class="btn btn--secondary">Previous</button>`;
  }

  // Page numbers
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    const activeClass = i === current ? 'active' : '';
    html += `<button data-page="${i}" class="btn ${activeClass}">${i}</button>`;
  }

  // Next button
  if (current < total) {
    html += `<button data-page="${current + 1}" class="btn btn--secondary">Next</button>`;
  }

  html += '</div>';

  // Attach event listeners
  setTimeout(() => {
    document.querySelectorAll('.pagination button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = parseInt(e.target.getAttribute('data-page'));
        if (onPageChange) onPageChange(page);
      });
    });
  }, 0);

  return html;
}
