/**
 * RENDER.JS - DOM Rendering Functions
 * Builds and injects HTML for cards, profiles, and UI elements
 */

import { sanitize, formatNumber, timeAgo, getLanguageColor, isBookmarked } from './utils.js';

/**
 * Render a developer card
 * @param {Object} user - GitHub user object
 * @returns {string} - HTML string for dev card
 */
export function renderDevCard(user) {
  const stats = [
    { label: 'Followers', value: formatNumber(user.followers || 0) },
    { label: 'Repos', value: formatNumber(user.public_repos || 0) },
    { label: 'Following', value: formatNumber(user.following || 0) }
  ];

  const bookmarked = isBookmarked(user.login);

  return `
    <article class="card dev-card" data-username="${sanitize(user.login)}">
      <div class="card-header">
        <img src="${sanitize(user.avatar_url)}" alt="${sanitize(user.name || user.login)}" class="card-avatar" loading="lazy" onerror="this.src='assets/default-avatar.png'">
        <div>
          <h3 class="card-title">${sanitize(user.name || user.login)}</h3>
          <p class="card-subtitle">@${sanitize(user.login)}</p>
        </div>
        <div class="card-bookmarks">
          <button class="bookmark-btn ${bookmarked ? 'bookmarked' : ''}" data-username="${sanitize(user.login)}" aria-label="${bookmarked ? 'Remove bookmark' : 'Add bookmark'}">
            ${bookmarked ? 'star' : 'star_border'}
          </button>
          <button class="share-btn" data-username="${sanitize(user.login)}" aria-label="Share profile">
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
          <a href="profile.html?user=${sanitize(user.login)}" class="card-link view-profile-btn">View Profile</a>
          <a href="${sanitize(user.html_url)}" target="_blank" rel="noopener noreferrer" class="card-link">GitHub</a>
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
  const lang = repo.language || 'Other';
  const color = getLanguageColor(lang);

  const stats = [
    { label: 'Stars', value: formatNumber(repo.stargazers_count || 0) },
    { label: 'Forks', value: formatNumber(repo.forks_count || 0) },
    { label: 'Issues', value: formatNumber(repo.open_issues_count || 0) }
  ];

  return `
    <article class="card repo-card">
      <div class="card-header">
        <div>
          <h3 class="card-title">${sanitize(repo.name)}</h3>
          <p class="card-subtitle">${sanitize(repo.owner.login)} / ${sanitize(repo.name)}</p>
        </div>
      </div>
      <div class="card-content">
        <p class="card-description">${sanitize(repo.description || 'No description available for this repository.')}</p>
        <div class="card-stats">
          ${stats.map(s => `
            <div class="card-stat">
              <div class="card-stat-value">${s.value}</div>
              <div class="card-stat-label">${s.label}</div>
            </div>
          `).join('')}
        </div>
        <div class="card-tags">
          <span class="card-tag">${sanitize(lang)}</span>
          ${repo.topics && repo.topics.length > 0 ? repo.topics.slice(0, 2).map(topic => `<span class="card-tag">${sanitize(topic)}</span>`).join('') : ''}
        </div>
      </div>
      <div class="card-footer">
        <div class="card-meta">
          <span>Updated ${timeAgo(repo.updated_at)}</span>
        </div>
        <div class="card-actions">
          <button class="readme-btn card-link" data-owner="${sanitize(repo.owner.login)}" data-repo="${sanitize(repo.name)}">README</button>
          <a href="${sanitize(repo.html_url)}" target="_blank" rel="noopener noreferrer" class="card-link">View on GitHub</a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render spotlight developer card
 * @param {Object} user - GitHub user object
 * @returns {string} - HTML string for spotlight card
 */
export function renderSpotlightDeveloper(user) {
  return `
    <div class="spotlight-card">
      <div class="spotlight-avatar">
        <img src="${sanitize(user.avatar_url)}" alt="${sanitize(user.name || user.login)}" loading="lazy" onerror="this.src='assets/default-avatar.png'">
      </div>
      <div class="spotlight-content">
        <h3>${sanitize(user.name || user.login)}</h3>
        <p class="spotlight-location">${user.location ? sanitize(user.location) : 'Location not specified'}</p>
        <p class="spotlight-bio">${sanitize(user.bio || 'Passionate developer contributing to the African tech ecosystem and building innovative solutions.')}</p>
        <div class="spotlight-stats">
          <span class="stat-item"><strong>${formatNumber(user.followers || 0)}</strong> followers</span>
          <span class="stat-item"><strong>${formatNumber(user.public_repos || 0)}</strong> repos</span>
          <span class="stat-item"><strong>${formatNumber(user.following || 0)}</strong> following</span>
        </div>
        <div class="spotlight-actions">
          <a href="${sanitize(user.html_url)}" target="_blank" rel="noopener noreferrer" class="btn btn--primary">View on GitHub</a>
          <a href="profile.html?user=${sanitize(user.login)}" class="btn btn--outline">View Profile</a>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render country density cards
 * @param {Array} countries - Array of country data with developer counts
 * @returns {string} - HTML string for country density grid
 */
export function renderCountryDensity(countries) {
  return countries.map(country => `
    <article class="card country-card">
      <div class="card-header">
        <h3 class="card-title">${sanitize(country.name)}</h3>
        <p class="card-subtitle">${formatNumber(country.developerCount)} developers</p>
      </div>
      <div class="card-content">
        <div class="country-stats">
          <div class="country-stat">
            <div class="country-stat-value">${formatNumber(country.developerCount)}</div>
            <div class="country-stat-label">Developers</div>
          </div>
          <div class="country-stat">
            <div class="country-stat-value">${formatNumber(country.repositories || 0)}</div>
            <div class="country-stat-label">Repositories</div>
          </div>
        </div>
        <div class="density-indicator">
          <div class="density-bar" style="width: ${country.percentage}%"></div>
          <span class="density-label">${country.percentage.toFixed(1)}% of African developers</span>
        </div>
      </div>
      <div class="card-footer">
        <div class="card-actions">
          <a href="developers.html?country=${encodeURIComponent(country.name)}" class="card-link">Explore Developers</a>
        </div>
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
      <div class="leaderboard-bar" style="width: ${tech.percentage}%"></div>
      <div class="leaderboard-value">${tech.percentage}%</div>
    </div>
  `).join('');
}

/**
 * Render tech insights cards
 * @param {Array} insights - Array of tech insight data
 * @returns {string} - HTML string for tech insights grid
 */
export function renderTechInsights(insights) {
  return insights.map(insight => `
    <article class="insight-card">
      <div class="insight-icon">
        ${insight.icon}
      </div>
      <h3 class="insight-title">${sanitize(insight.title)}</h3>
      <p class="insight-description">${sanitize(insight.description)}</p>
      <div class="insight-stats">
        ${insight.stats.map(stat => `<span class="insight-stat">${sanitize(stat)}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

/**
 * Render a profile header
 * @param {Object} user - GitHub user object
 * @returns {string} - HTML string for profile hero
 */
export function renderProfileHeader(user) {
  const bookmarked = isBookmarked(user.login);
  
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
      
      <div class="profile-actions">
        <button class="bookmark-btn ${bookmarked ? 'bookmarked' : ''}" data-username="${sanitize(user.login)}" aria-label="${bookmarked ? 'Remove bookmark' : 'Add bookmark'}">
          ${bookmarked ? 'star' : 'star_border'}
        </button>
        <button class="share-btn" data-username="${sanitize(user.login)}" aria-label="Share profile">
          share
        </button>

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
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total pages
 * @param {Function} onPageChange - Callback for page change
 * @returns {string} - HTML for pagination
 */
export function renderPagination(currentPage, totalPages, onPageChange) {
  if (totalPages <= 1) return '';

  let pagination = '<div class="pagination">';
  
  // Previous button
  if (currentPage > 1) {
    pagination += `<button class="pagination-btn" onclick="${onPageChange}(${currentPage - 1})">Previous</button>`;
  }
  
  // Page numbers
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  
  if (startPage > 1) {
    pagination += `<button class="pagination-btn" onclick="${onPageChange}(1)">1</button>`;
    if (startPage > 2) pagination += '<span class="pagination-ellipsis">...</span>';
  }
  
  for (let i = startPage; i <= endPage; i++) {
    const activeClass = i === currentPage ? 'active' : '';
    pagination += `<button class="pagination-btn ${activeClass}" onclick="${onPageChange}(${i})">${i}</button>`;
  }
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pagination += '<span class="pagination-ellipsis">...</span>';
    pagination += `<button class="pagination-btn" onclick="${onPageChange}(${totalPages})">${totalPages}</button>`;
  }
  
  // Next button
  if (currentPage < totalPages) {
    pagination += `<button class="pagination-btn" onclick="${onPageChange}(${currentPage + 1})">Next</button>`;
  }
  
  pagination += '</div>';
  return pagination;
}

/**
 * Attach bookmark and share button event handlers
 * @param {HTMLElement} container - Container element with cards
 */
export function attachCardActionHandlers(container) {
  // Bookmark buttons
  container.addEventListener('click', (e) => {
    const bookmarkBtn = e.target.closest('.bookmark-btn');
    if (bookmarkBtn) {
      e.preventDefault();
      const username = bookmarkBtn.dataset.username;
      if (username) {
        import('./utils.js').then(({ toggleBookmark, isBookmarked }) => {
          const isNowBookmarked = toggleBookmark(username);
          bookmarkBtn.classList.toggle('bookmarked', isNowBookmarked);
          bookmarkBtn.textContent = isNowBookmarked ? 'star' : 'star_border';
          bookmarkBtn.setAttribute('aria-label', isNowBookmarked ? 'Remove bookmark' : 'Add bookmark');
        });
      }
    }

    // Share buttons
    const shareBtn = e.target.closest('.share-btn');
    if (shareBtn) {
      e.preventDefault();
      const username = shareBtn.dataset.username;
      if (username) {
        import('./utils.js').then(({ copyProfileLink }) => {
          copyProfileLink(username).then(() => {
            showToast('Profile link copied to clipboard!', 'success');
          }).catch(() => {
            showToast('Failed to copy link', 'error');
          });
        });
      }
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
