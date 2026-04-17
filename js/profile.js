/**
 * PROFILE.JS - Profile Page Logic
 */

import { getUser, getUserRepos } from './api.js';
import { renderProfileHeader, renderRepoCard, renderErrorToast, renderDevCard } from './render.js';
import { getQueryParam, isBookmarked, toggleBookmark, copyProfileLink } from './utils.js';

const username = getQueryParam('user');
const profileHeader = document.getElementById('profile-header');
const profileReposGrid = document.getElementById('profile-repos-grid');
const similarDevelopersGrid = document.getElementById('similar-developers-grid');
const heatmapContainer = document.getElementById('contribution-heatmap');
const notFound = document.getElementById('not-found');

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
    
    // Load repositories
    profileReposGrid.innerHTML = repos.map(r => renderRepoCard(r)).join('');
    
    // Load contribution heatmap
    await loadContributionHeatmap(username);
    
    // Load similar developers
    await loadSimilarDevelopers(username, user.location);
  } catch (error) {
    notFound.style.display = 'block';
    renderErrorToast('Developer not found');
  }
}

// Load contribution heatmap
async function loadContributionHeatmap(username) {
  heatmapContainer.innerHTML = '<div class="heatmap-loading">Loading contribution data...</div>';
  
  try {
    // Mock contribution data (in real implementation, this would come from GitHub API)
    const contributions = generateMockContributions();
    renderContributionHeatmap(contributions);
  } catch (error) {
    heatmapContainer.innerHTML = '<p>Failed to load contribution data.</p>';
  }
}

// Generate mock contribution data
function generateMockContributions() {
  const contributions = [];
  const today = new Date();
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const level = Math.floor(Math.random() * 8);
    contributions.push({
      date: date.toISOString().split('T')[0],
      count: level,
      level: level
    });
  }
  
  return contributions;
}

// Render contribution heatmap
function renderContributionHeatmap(contributions) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  let html = '<div class="contribution-graph">';
  
  for (let week = 0; week < 53; week++) {
    for (let day = 0; day < 7; day++) {
      const index = week * 7 + day;
      if (index < contributions.length) {
        const contrib = contributions[index];
        const date = new Date(contrib.date);
        const dayName = days[date.getDay()];
        const monthName = months[date.getMonth()];
        const dayNum = date.getDate();
        
        html += `
          <div class="contribution-day" data-level="${contrib.level}" title="${monthName} ${dayNum}, ${dayName} - ${contrib.count} contributions">
            <div class="contribution-level-${contrib.level}"></div>
          </div>
        `;
      } else {
        html += '<div class="contribution-day"></div>';
      }
    }
  }
  
  html += '</div>';
  heatmapContainer.innerHTML = html;
}

// Load similar developers
async function loadSimilarDevelopers(username, location) {
  similarDevelopersGrid.innerHTML = '<div class="skeleton skeleton-card"></div>'.repeat(6);
  
  try {
    // Mock similar developers (in real implementation, this would use GitHub API)
    const similarDevelopers = [
      {
        login: 'kelvinkamau',
        name: 'Kelvin Kamau',
        avatar_url: 'https://avatars.githubusercontent.com/u/1182366?v=4',
        followers: 1250,
        public_repos: 45
      },
      {
        login: 'njerimuriuki',
        name: 'Njeri Muriuki',
        avatar_url: 'https://avatars.githubusercontent.com/u/1234567?v=4',
        followers: 890,
        public_repos: 32
      },
      {
        login: 'mikekagiri',
        name: 'Mike Kagiri',
        avatar_url: 'https://avatars.githubusercontent.com/u/2345678?v=4',
        followers: 567,
        public_repos: 28
      },
      {
        login: 'wanjohikibui',
        name: 'Wanjohi Kibui',
        avatar_url: 'https://avatars.githubusercontent.com/u/3456789?v=4',
        followers: 445,
        public_repos: 19
      },
      {
        login: 'daviesk',
        name: 'Davies K',
        avatar_url: 'https://avatars.githubusercontent.com/u/4567890?v=4',
        followers: 334,
        public_repos: 15
      },
      {
        login: 'calebokoli',
        name: 'Caleb Okoli',
        avatar_url: 'https://avatars.githubusercontent.com/u/5678901?v=4',
        followers: 223,
        public_repos: 11
      }
    ];
    
    similarDevelopersGrid.innerHTML = similarDevelopers.map(dev => renderDevCard(dev)).join('');
  } catch (error) {
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
        }
      }
      
      if (shareBtn) {
        e.preventDefault();
        e.stopPropagation();
        const username = shareBtn.dataset.username;
        if (username) {
          copyProfileLink(username).then(() => {
            // Show success message (in real implementation, this would use toast)
            alert('Profile link copied to clipboard!');
          }).catch(() => {
            alert('Failed to copy profile link');
          });
        }
      }
    });
  }
}

document.querySelector('.navbar-toggle')?.addEventListener('click', function() {
  document.querySelector('.nav-links').classList.toggle('open');
  this.setAttribute('aria-expanded', document.querySelector('.nav-links').classList.contains('open'));
});

// Initialize profile page
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  setupProfileActions();
});
