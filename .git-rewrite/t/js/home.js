/**
 * HOME.JS - Home Page Logic
 */

import { searchUsers, searchRepos, getUserEvents } from './api.js';
import { renderDevCard, renderRepoCard, renderActivityCard, renderErrorToast } from './render.js';
import { sanitize, debounce, setCache, getCache } from './utils.js';

const heroSearchBtn = document.querySelector('.search-bar .btn');
const heroSearchInput = document.getElementById('hero-search');
const countryPills = document.querySelectorAll('.country-pills .pill');
const featuredDevsGrid = document.getElementById('featured-devs');
const trendingReposGrid = document.getElementById('trending-repos');
const liveActivityGrid = document.getElementById('live-activity');

// Curated list of active African developers for live feed
const ACTIVE_DEVELOPERS = [
  'kelvinkamau', 'njerimuriuki', 'mikekagiri', 'wanjohikibui', 'daviesk',
  'calebokoli', 'sylvance', 'paulkinuthia', 'sammykay', 'mwanakijiji'
];

// Load featured developers on page load
async function loadFeaturedDevelopers() {
  try {
    const cacheKey = 'featured_devs';
    const cached = getCache(cacheKey);
    
    if (cached) {
      featuredDevsGrid.innerHTML = cached.map(u => renderDevCard(u)).join('');
      attachDevCardHandlers();
      return;
    }

    const result = await searchUsers('Kenya', 1, 6, 'location');
    
    if (!result.users || result.users.length === 0) {
      featuredDevsGrid.innerHTML = '<p>No developers found</p>';
      return;
    }
    
    const html = result.users.map(u => renderDevCard(u)).join('');
    featuredDevsGrid.innerHTML = html;
    
    // Cache for 10 minutes
    setCache(cacheKey, result.users, 600_000);
    
    attachDevCardHandlers();
  } catch (error) {
    console.error('Error loading featured developers:', error);
    renderErrorToast('Failed to load featured developers');
  }
}

// Load trending repositories on page load
async function loadTrendingRepos() {
  try {
    const cacheKey = 'trending_repos';
    const cached = getCache(cacheKey);
    
    if (cached) {
      trendingReposGrid.innerHTML = cached.map(r => renderRepoCard(r)).join('');
      return;
    }

    const result = await searchRepos('Africa', '', 'stars', 1, 6);
    
    if (!result.repos || result.repos.length === 0) {
      trendingReposGrid.innerHTML = '<p>No repositories found</p>';
      return;
    }
    
    trendingReposGrid.innerHTML = result.repos.map(r => renderRepoCard(r)).join('');
    
    // Cache for 15 minutes
    setCache(cacheKey, result.repos, 900_000);
  } catch (error) {
    console.error('Error loading trending repos:', error);
    renderErrorToast('Failed to load trending repositories');
  }
}

// Load live activity feed
async function loadLiveActivity() {
  try {
    const cacheKey = 'live_activity';
    const cached = getCache(cacheKey);
    
    if (cached) {
      liveActivityGrid.innerHTML = cached.slice(0, 6).map(event => renderActivityCard(event)).join('');
      return;
    }

    // Fetch events from all active developers in parallel
    const eventPromises = ACTIVE_DEVELOPERS.map(dev => 
      getUserEvents(dev, 10).catch(() => ({ items: [] }))
    );
    
    const results = await Promise.allSettled(eventPromises);
    const allEvents = [];
    
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.items) {
        allEvents.push(...result.value.items);
      }
    });
    
    // Sort by created_at descending
    allEvents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Cache for 2 minutes
    setCache(cacheKey, allEvents, 120_000);
    
    // Show top 6 events
    const topEvents = allEvents.slice(0, 6);
    liveActivityGrid.innerHTML = topEvents.map(event => renderActivityCard(event)).join('');
    
  } catch (error) {
    console.error('Error loading live activity:', error);
    renderErrorToast('Failed to load activity feed');
  }
}

// Attach click handlers to developer cards
function attachDevCardHandlers() {
  document.querySelectorAll('#featured-devs .dev-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const username = card.querySelector('.username').textContent.replace('@', '');
      window.location.href = `profile.html?user=${username}`;
    });
  });
}

// Country pill clicks
countryPills.forEach(pill => {
  pill.addEventListener('click', () => {
    const country = pill.getAttribute('data-country');
    window.location.href = `developers.html?country=${encodeURIComponent(country)}`;
  });
});

// Hero search
if (heroSearchBtn) {
  heroSearchBtn.addEventListener('click', () => {
    const query = heroSearchInput.value.trim();
    if (query) {
      window.location.href = `developers.html?search=${encodeURIComponent(query)}`;
    }
  });
}

// Hero search input enter key
if (heroSearchInput) {
  heroSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = heroSearchInput.value.trim();
      if (query) {
        window.location.href = `developers.html?search=${encodeURIComponent(query)}`;
      }
    }
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedDevelopers();
  loadTrendingRepos();
  loadLiveActivity();
  
  // Refresh live activity every 2 minutes
  setInterval(loadLiveActivity, 120_000);
});
