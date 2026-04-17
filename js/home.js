/**
 * HOME.JS - Home Page Logic
 */

import { searchUsers, searchRepos, getUserEvents } from './api.js';
import { renderDevCard, renderRepoCard, renderActivityCard, renderSpotlightDeveloper, renderCountryDensity, renderTechLeaderboard, renderTechInsights, renderErrorToast, attachCardActionHandlers } from './render.js';
import { sanitize, debounce, setCache, getCache, formatNumber, displaySearchHistory, addToSearchHistory } from './utils.js';

const heroSearchBtn = document.getElementById('hero-search-btn');
const heroSearchInput = document.getElementById('hero-search-input');
const countryPills = document.querySelectorAll('.country-pill');
const searchSuggestions = document.getElementById('search-suggestions');
const featuredDevsGrid = document.getElementById('featured-devs');
const trendingReposGrid = document.getElementById('trending-repos');
const liveActivityGrid = document.getElementById('live-activity');
const spotlightDeveloper = document.getElementById('spotlight-developer');
const countryDensity = document.getElementById('country-density');
const techLeaderboard = document.getElementById('tech-leaderboard');
const techInsights = document.getElementById('tech-insights');

// Curated list of active African developers for live feed
const ACTIVE_DEVELOPERS = [
  'kelvinkamau', 'njerimuriuki', 'mikekagiri', 'wanjohikibui', 'daviesk',
  'calebokoli', 'sylvance', 'paulkinuthia', 'sammykay', 'mwanakijiji'
];

// Hero search functionality
function setupHeroSearch() {
  if (!heroSearchInput || !heroSearchBtn) return;

  // Search on button click
  heroSearchBtn.addEventListener('click', performSearch);

  // Search on Enter key
  heroSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  // Show search history on focus
  heroSearchInput.addEventListener('focus', () => {
    displaySearchHistory(heroSearchInput, (term) => {
      heroSearchInput.value = term;
      performSearch();
    });
  });

  // Hide search history on blur (with delay to allow clicks)
  heroSearchInput.addEventListener('blur', () => {
    setTimeout(() => {
      const dropdown = document.querySelector('.search-history-dropdown');
      if (dropdown) dropdown.remove();
    }, 200);
  });
}

// Perform search and navigate to results
function performSearch() {
  const query = heroSearchInput.value.trim();
  if (!query) return;

  // Add to search history
  addToSearchHistory(query);

  // Navigate to developers page with search query
  window.location.href = `developers.html?q=${encodeURIComponent(query)}`;
}

// Country pills functionality
function setupCountryPills() {
  countryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const country = pill.dataset.country;
      if (country) {
        // Navigate to developers page filtered by country
        window.location.href = `developers.html?country=${encodeURIComponent(country)}`;
      }
    });
  });
}

// Load featured developers on page load
async function loadFeaturedDevelopers() {
  try {
    const cacheKey = 'featured_devs';
    const cached = getCache(cacheKey);
    
    if (cached) {
      featuredDevsGrid.innerHTML = cached.map(u => renderDevCard(u)).join('');
      attachCardActionHandlers(featuredDevsGrid);
      return;
    }

    const result = await searchUsers('Kenya', 1, 6, 'location');
    
    if (!result.users || result.users.length === 0) {
      featuredDevsGrid.innerHTML = '<p>No developers found</p>';
      return;
    }
    
    const html = result.users.map(u => renderDevCard(u)).join('');
    featuredDevsGrid.innerHTML = html;
    
    // Attach event handlers
    attachCardActionHandlers(featuredDevsGrid);
    
    // Cache for 10 minutes
    setCache(cacheKey, result.users, 600_000);
    
    setupCardClickHandlers();
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

// Load spotlight developer of the week
async function loadSpotlightDeveloper() {
  try {
    const cacheKey = 'spotlight_developer';
    const cached = getCache(cacheKey);
    
    if (cached && spotlightDeveloper) {
      spotlightDeveloper.innerHTML = renderSpotlightDeveloper(cached);
      return;
    }

    // Get a featured African developer - rotate through a curated list
    const spotlightUsers = ['Mylesoft', 'kelvinkamau', 'njerimuriuki', 'mikekagiri', 'wanjohikibui'];
    const randomUser = spotlightUsers[Math.floor(Math.random() * spotlightUsers.length)];
    
    // Fetch user data
    const result = await searchUsers(randomUser, 1, 1, 'username');
    
    if (!result.users || result.users.length === 0) {
      if (spotlightDeveloper) {
        spotlightDeveloper.innerHTML = '<p>No spotlight developer available</p>';
      }
      return;
    }
    
    const user = result.users[0];
    
    if (spotlightDeveloper) {
      spotlightDeveloper.innerHTML = renderSpotlightDeveloper(user);
    }
    
    // Cache for 1 hour
    setCache(cacheKey, user, 3_600_000);
    
  } catch (error) {
    console.error('Error loading spotlight developer:', error);
    if (spotlightDeveloper) {
      spotlightDeveloper.innerHTML = '<p>Failed to load spotlight developer</p>';
    }
    renderErrorToast('Failed to load spotlight developer');
  }
}

// Load country density data
async function loadCountryDensity() {
  try {
    const cacheKey = 'country_density';
    const cached = getCache(cacheKey);
    
    if (cached && countryDensity) {
      countryDensity.innerHTML = renderCountryDensity(cached);
      return;
    }

    // Fetch developers from major African countries
    const countries = [
      { name: 'Nigeria', query: 'Nigeria' },
      { name: 'Kenya', query: 'Kenya' },
      { name: 'South Africa', query: 'South Africa' },
      { name: 'Egypt', query: 'Egypt' },
      { name: 'Ghana', query: 'Ghana' },
      { name: 'Morocco', query: 'Morocco' },
      { name: 'Tunisia', query: 'Tunisia' },
      { name: 'Ethiopia', query: 'Ethiopia' }
    ];

    const countryPromises = countries.map(async (country) => {
      try {
        const result = await searchUsers(country.query, 1, 100, 'location');
        return {
          name: country.name,
          developerCount: result.total_count || 0,
          repositories: Math.floor((result.total_count || 0) * 2.5), // Estimated repos per developer
          percentage: 0 // Will be calculated
        };
      } catch (error) {
        console.error(`Error fetching data for ${country.name}:`, error);
        return {
          name: country.name,
          developerCount: 0,
          repositories: 0,
          percentage: 0
        };
      }
    });

    const countryData = await Promise.all(countryPromises);
    
    // Calculate percentages
    const totalDevelopers = countryData.reduce((sum, country) => sum + country.developerCount, 0);
    countryData.forEach(country => {
      country.percentage = totalDevelopers > 0 ? (country.developerCount / totalDevelopers) * 100 : 0;
    });

    // Sort by developer count
    countryData.sort((a, b) => b.developerCount - a.developerCount);

    if (countryDensity) {
      countryDensity.innerHTML = renderCountryDensity(countryData);
    }
    
    // Cache for 30 minutes
    setCache(cacheKey, countryData, 1_800_000);
    
  } catch (error) {
    console.error('Error loading country density:', error);
    if (countryDensity) {
      countryDensity.innerHTML = '<p>Failed to load country density data</p>';
    }
    renderErrorToast('Failed to load country density data');
  }
}

// Load tech leaderboard data
async function loadTechLeaderboard() {
  try {
    const cacheKey = 'tech_leaderboard';
    const cached = getCache(cacheKey);
    
    if (cached && techLeaderboard) {
      techLeaderboard.innerHTML = renderTechLeaderboard(cached);
      return;
    }

    // Analyze languages from trending repositories
    const result = await searchRepos('', '', 'stars', 1, 100);
    
    if (!result.repos || result.repos.length === 0) {
      if (techLeaderboard) {
        techLeaderboard.innerHTML = '<p>No technology data available</p>';
      }
      return;
    }

    // Count language occurrences
    const languageCounts = {};
    result.repos.forEach(repo => {
      const lang = repo.language || 'Other';
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
    });

    // Convert to array and calculate percentages
    const totalRepos = result.repos.length;
    const technologies = Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalRepos) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 8); // Top 8 technologies

    if (techLeaderboard) {
      techLeaderboard.innerHTML = renderTechLeaderboard(technologies);
    }
    
    // Cache for 1 hour
    setCache(cacheKey, technologies, 3_600_000);
    
  } catch (error) {
    console.error('Error loading tech leaderboard:', error);
    if (techLeaderboard) {
      techLeaderboard.innerHTML = '<p>Failed to load technology data</p>';
    }
    renderErrorToast('Failed to load technology data');
  }
}

// Load tech insights data
async function loadTechInsights() {
  try {
    const cacheKey = 'tech_insights';
    const cached = getCache(cacheKey);
    
    if (cached && techInsights) {
      techInsights.innerHTML = renderTechInsights(cached);
      return;
    }

    // Fetch data for insights calculation
    const [userResult, repoResult] = await Promise.allSettled([
      searchUsers('Africa', 1, 100, 'location'),
      searchRepos('', '', 'stars', 1, 200)
    ]);

    const users = userResult.status === 'fulfilled' ? userResult.value : { users: [], total_count: 0 };
    const repos = repoResult.status === 'fulfilled' ? repoResult.value : { repos: [] };

    // Calculate insights based on real data
    const totalDevelopers = users.total_count || 0;
    const totalRepos = repos.repos?.length || 0;
    const totalStars = repos.repos?.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0) || 0;
    const totalForks = repos.repos?.reduce((sum, repo) => sum + (repo.forks_count || 0), 0) || 0;

    // Generate dynamic insights
    const insights = [
      {
        title: 'Developer Community Growth',
        description: `African developer community showing strong growth with ${formatNumber(totalDevelopers)} active developers contributing to ${formatNumber(totalRepos)} repositories across the continent.`,
        stats: [
          `${formatNumber(totalDevelopers)} Active Developers`,
          `${formatNumber(totalRepos)} Open Source Projects`,
          `${formatNumber(totalStars)} Total Stars`
        ],
        icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>`
      },
      {
        title: 'Open Source Impact',
        description: `African developers making significant impact with ${formatNumber(totalStars)} stars and ${formatNumber(totalForks)} forks on their repositories, showing strong community engagement.`,
        stats: [
          `${formatNumber(totalStars)} Total Stars`,
          `${formatNumber(totalForks)} Total Forks`,
          `${Math.round(totalStars / totalRepos)} Avg Stars/Repo`
        ],
        icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>`
      },
      {
        title: 'Repository Activity',
        description: `High activity level with ${formatNumber(totalRepos)} repositories maintained by African developers, demonstrating consistent contributions to global tech ecosystem.`,
        stats: [
          `${formatNumber(totalRepos)} Active Repositories`,
          `${Math.round(totalForks / totalRepos)} Avg Forks/Repo`,
          `${formatNumber(totalStars + totalForks)} Total Interactions`
        ],
        icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>`
      },
      {
        title: 'Community Engagement',
        description: `Strong community engagement with ${formatNumber(totalForks)} forks showing collaborative development and knowledge sharing across African tech community.`,
        stats: [
          `${formatNumber(totalForks)} Community Forks`,
          `${Math.round((totalForks / totalStars) * 100)}% Fork Rate`,
          `${formatNumber(totalDevelopers)} Contributors`
        ],
        icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>`
      }
    ];

    if (techInsights) {
      techInsights.innerHTML = renderTechInsights(insights);
    }
    
    // Cache for 2 hours
    setCache(cacheKey, insights, 7_200_000);
    
  } catch (error) {
    console.error('Error loading tech insights:', error);
    if (techInsights) {
      techInsights.innerHTML = '<p>Failed to load tech insights data</p>';
    }
    renderErrorToast('Failed to load tech insights data');
  }
}

// Event delegation for card clicks - more reliable approach
function setupCardClickHandlers() {
  // Use event delegation on the container
  const container = document.getElementById('featured-devs');
  if (!container) return;
  
  container.addEventListener('click', (e) => {
    // Check if click is on a developer card but not on a link/button
    const card = e.target.closest('.dev-card');
    if (!card) return;
    
    // Don't navigate if clicking on a link or button
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    
    // Get username from data attribute or subtitle
    const username = card.dataset.username || card.querySelector('.card-subtitle')?.textContent?.replace('@', '');
    if (username) {
      console.log('Navigating to profile:', username);
      window.location.href = `profile.html?user=${username}`;
    }
  });
  
  // Make cards visually clickable
  const style = document.createElement('style');
  style.textContent = `
    .dev-card {
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .dev-card:hover {
      transform: translateY(-2px);
    }
    .dev-card .card-link {
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
}

// Simple function to attach handlers (kept for compatibility)
function attachDevCardHandlers() {
  setupCardClickHandlers();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Setup interactive elements
  setupHeroSearch();
  setupCountryPills();
  
  // Load content sections
  loadFeaturedDevelopers();
  loadTrendingRepos();
  loadLiveActivity();
  loadSpotlightDeveloper();
  loadCountryDensity();
  loadTechLeaderboard();
  loadTechInsights();
  
  // Refresh live activity every 2 minutes
  setInterval(loadLiveActivity, 120_000);
  
  // Refresh spotlight developer every hour
  setInterval(loadSpotlightDeveloper, 3_600_000);
  
  // Refresh country density every 30 minutes
  setInterval(loadCountryDensity, 1_800_000);
  
  // Refresh tech leaderboard every hour
  setInterval(loadTechLeaderboard, 3_600_000);
  
  // Refresh tech insights every 2 hours
  setInterval(loadTechInsights, 7_200_000);
});
