/**
 * PROFILE.JS - Profile Page Logic
 */

import { getUser, getUserRepos, searchUsers } from './api.js';
import { renderProfileHeader, renderRepoCard, renderErrorToast, renderDevCard, attachCardActionHandlers, showToast } from './render.js';
import { bindReadmePreviewHandlers } from './repositories.js';
import { getQueryParam, toggleBookmark, copyProfileLink } from './utils.js';

const username = getQueryParam('user');
let profileHeader, profileReposGrid, similarDevelopersGrid, heatmapContainer, notFound;

async function loadProfile() {
  if (!username) {
    notFound.style.display = 'block';
    return;
  }
  
  try {
    const { user } = await getUser(username);
    const { repos } = await getUserRepos(username, 'stars', 6);
    
    // Load profile header with bookmark/share functionality
    profileHeader.innerHTML = renderProfileHeader(user);
    notFound.style.display = 'none';
    
    // Load repositories
    profileReposGrid.innerHTML = repos.length
      ? repos.map(r => renderRepoCard(r)).join('')
      : '<p>No public repositories available yet.</p>';
    
    // Load contribution heatmap
    await loadContributionHeatmap(username);
    
    // Load similar developers
    await loadSimilarDevelopers(username, user.location);

    attachCardActionHandlers(profileReposGrid);
    attachCardActionHandlers(similarDevelopersGrid);
    bindReadmePreviewHandlers(profileReposGrid);
  } catch (error) {
    console.error('Error loading profile:', error);
    notFound.style.display = 'block';
    renderErrorToast(error.message || 'Developer not found');
  }
}

// Load contribution heatmap
async function loadContributionHeatmap(username) {
  if (!heatmapContainer) {
    console.error('Heatmap container not found');
    return;
  }

  heatmapContainer.innerHTML = `
    <img
      class="heatmap-image"
      src="https://ghchart.rshah.org/C79639/${encodeURIComponent(username)}"
      alt="${username}'s contribution heatmap"
      loading="lazy"
    >
    <p class="heatmap-note">Contribution history powered by public GitHub data.</p>
  `;
}

// Load similar developers
async function loadSimilarDevelopers(username, location) {
  similarDevelopersGrid.innerHTML = '<div class="skeleton skeleton-card"></div>'.repeat(6);
  
  try {
    const candidateUsers = [];

    if (location) {
      const locationResult = await searchUsers(location, 1, 12, 'location');
      candidateUsers.push(...(locationResult.users || []));
    }

    if (candidateUsers.length < 6) {
      const usernameResult = await searchUsers(username, 1, 12, 'username');
      candidateUsers.push(...(usernameResult.users || []));
    }

    const uniqueUsers = Array.from(
      new Map(
        candidateUsers
          .filter((user) => user?.login && user.login.toLowerCase() !== username.toLowerCase())
          .map((user) => [user.login.toLowerCase(), user])
      ).values()
    ).slice(0, 6);

    if (uniqueUsers.length === 0) {
      similarDevelopersGrid.innerHTML = '<p>No similar developers available right now.</p>';
      return;
    }

    similarDevelopersGrid.innerHTML = uniqueUsers.map(dev => renderDevCard(dev)).join('');
  } catch (error) {
    console.error('Error loading similar developers:', error);
    similarDevelopersGrid.innerHTML = '<p>Failed to load similar developers.</p>';
  }
}

// Setup bookmark and share button handlers
function setupProfileActions() {
  const profileHeader = document.getElementById('profile-header');
  
  if (profileHeader) {
    profileHeader.addEventListener('click', (e) => {
      const bookmarkBtn = e.target.closest('.bookmark-btn');
      const shareBtn = e.target.closest('.share-btn');
      
      if (bookmarkBtn) {
        e.preventDefault();
        e.stopPropagation();
        const username = bookmarkBtn.dataset.username;
        if (username) {
          const isNowBookmarked = toggleBookmark(username);
          bookmarkBtn.classList.toggle('bookmarked', isNowBookmarked);
          bookmarkBtn.textContent = isNowBookmarked ? 'star' : 'star_border';
          bookmarkBtn.setAttribute('aria-label', isNowBookmarked ? 'Remove bookmark' : 'Add bookmark');
          showToast(
            isNowBookmarked ? 'Profile saved to bookmarks.' : 'Profile removed from bookmarks.',
            'success'
          );
        }
      }
      
      if (shareBtn) {
        e.preventDefault();
        e.stopPropagation();
        const username = shareBtn.dataset.username;
        if (username) {
          copyProfileLink(username).then(() => {
            showToast('Profile link copied to clipboard!', 'success');
          }).catch(() => {
            showToast('Failed to copy profile link.', 'error');
          });
        }
      }
    });
  }
}

// Initialize profile page
document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  profileHeader = document.getElementById('profile-header');
  profileReposGrid = document.getElementById('profile-repos-grid');
  similarDevelopersGrid = document.getElementById('similar-developers-grid');
  heatmapContainer = document.getElementById('contribution-heatmap');
  notFound = document.getElementById('not-found');
  
  loadProfile();
  setupProfileActions();
});
