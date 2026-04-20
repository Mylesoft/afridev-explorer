// activity.js - live activity feed page logic
import { getUserEvents } from './api.js';
import { searchUsers } from './api.js';
import { renderActivityCard, renderSkeletonCards, renderEmptyState, renderErrorToast } from './render.js';
import { setCache, getCache, debounce } from './utils.js';

const ACTIVITY_SEED_COUNTRIES = [
  'Kenya',
  'Nigeria',
  'South Africa',
  'Ghana',
  'Egypt',
  'Rwanda',
  'Uganda',
  'Morocco'
];

let refreshInterval;
let isPaused = false;

async function getActiveDevelopers(limit = 10) {
  const cacheKey = `activity_seed_developers_${limit}`;
  const cached = getCache(cacheKey);
  if (cached?.length) {
    return cached;
  }

  const searches = await Promise.allSettled(
    ACTIVITY_SEED_COUNTRIES.map((country) => searchUsers(country, 1, 3, 'location'))
  );

  const developers = [];
  const seen = new Set();

  searches.forEach((result, index) => {
    if (result.status !== 'fulfilled') {
      return;
    }

    (result.value.users || []).forEach((user) => {
      if (!user?.login || seen.has(user.login.toLowerCase()) || developers.length >= limit) {
        return;
      }

      seen.add(user.login.toLowerCase());
      developers.push({
        login: user.login,
        country: ACTIVITY_SEED_COUNTRIES[index]
      });
    });
  });

  setCache(cacheKey, developers, 900_000);
  return developers;
}

// Initialize activity feed
async function initActivityFeed() {
  showLoading();
  await loadActivityFeed();
  startAutoRefresh();
  setupEventFilters();
  setupCountryFilter();
}

// Show loading skeleton
function showLoading() {
  const container = document.querySelector('.activity-feed');
  if (container) {
    container.innerHTML = renderSkeletonCards(8);
  }
}

// Load activity feed from API
async function loadActivityFeed() {
  try {
    const cacheKey = 'activity_feed';
    const cached = getCache(cacheKey);
    
    if (cached) {
      renderActivityFeed(cached);
      return;
    }

    const activeDevelopers = await getActiveDevelopers(10);
    const eventPromises = activeDevelopers.map((developer) =>
      getUserEvents(developer.login, 20)
        .then((response) => ({
          items: (response.items || []).map((event) => ({
            ...event,
            __country: developer.country
          }))
        }))
        .catch(() => ({ items: [] }))
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
    
    // Cache for 5 minutes
    setCache(cacheKey, allEvents, 300_000);
    renderActivityFeed(allEvents);
    
  } catch (error) {
    renderErrorToast('Failed to load activity feed');
    console.error('Activity feed error:', error);
  }
}

// Render activity feed
function renderActivityFeed(events) {
  const container = document.querySelector('.activity-feed');
  if (!container) return;
  
  const filteredEvents = filterEvents(events);
  
  if (filteredEvents.length === 0) {
    container.innerHTML = renderEmptyState('No activity found', [
      'Try adjusting the filters',
      'Activity updates every 60 seconds'
    ]);
    return;
  }
  
  // Show top 20 events
  const topEvents = filteredEvents.slice(0, 20);
  container.innerHTML = topEvents.map(event => renderActivityCard(event)).join('');
  
  // Update live indicator
  updateLiveIndicator();
}

// Filter events based on selected filters
function filterEvents(events) {
  const selectedTypes = getSelectedEventTypes();
  const selectedCountry = getSelectedCountry();
  
  return events.filter(event => {
    // Filter by event type
    if (selectedTypes.length > 0 && !selectedTypes.includes(event.type)) {
      return false;
    }
    
    // Filter by country (based on developer location)
    if (selectedCountry && !isFromCountry(event, selectedCountry)) {
      return false;
    }
    
    return true;
  });
}

// Get selected event types from checkboxes
function getSelectedEventTypes() {
  const checkboxes = document.querySelectorAll('.event-type-filter:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

// Get selected country from dropdown
function getSelectedCountry() {
  const select = document.querySelector('.country-filter');
  return select ? select.value : '';
}

// Check if developer is from specified country
function isFromCountry(event, country) {
  return (event.__country || '').toLowerCase() === country.toLowerCase();
}

// Setup event type filters
function setupEventFilters() {
  const checkboxes = document.querySelectorAll('.event-type-filter');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', debounce(() => {
      loadActivityFeed();
    }, 300));
  });
}

// Setup country filter
function setupCountryFilter() {
  const select = document.querySelector('.country-filter');
  if (select) {
    select.addEventListener('change', debounce(() => {
      loadActivityFeed();
    }, 300));
  }
}

// Start auto-refresh every 60 seconds
function startAutoRefresh() {
  refreshInterval = setInterval(() => {
    if (!isPaused && !document.hidden) {
      loadActivityFeed();
    }
  }, 60000);
  
  // Pause when page is hidden
  document.addEventListener('visibilitychange', () => {
    isPaused = document.hidden;
  });
}

// Update live indicator
function updateLiveIndicator() {
  const liveDot = document.querySelector('.live-dot');
  const liveText = document.querySelector('.live-text');
  
  if (liveDot) {
    liveDot.classList.add('live');
  }
  
  if (liveText) {
    liveText.textContent = 'LIVE';
  }
}

// Stop auto-refresh
function stopAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
}

// Manual refresh button
function setupManualRefresh() {
  const refreshBtn = document.querySelector('.refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      showLoading();
      loadActivityFeed();
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initActivityFeed();
  setupManualRefresh();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  stopAutoRefresh();
});
