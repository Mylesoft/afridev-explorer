/**
 * DEVELOPERS.JS - Developers Page Logic with Advanced Filters
 */

import { searchUsers, searchDevelopersByTech, searchCofounders, searchJobSeekers } from './api.js';
import { renderDevCard, renderErrorToast, renderPagination } from './render.js';
import { debounce, getQueryParam, getMaxPages } from './utils.js';

let currentPage = 1;
let currentCountry = '';
let currentSearch = '';
let currentFilter = 'search'; // 'search', 'tech', 'cofounders', 'jobs'
let currentTech = '';

// Date filters
let currentDateFrom = '';
let currentDateTo = '';
let currentTechDateFrom = '';
let currentTechDateTo = '';
let currentCofounderDateFrom = '';
let currentCofounderDateTo = '';
let currentJobDateFrom = '';
let currentJobDateTo = '';

// Additional filters for each tab
let currentTechSearch = '';
let currentCofounderSearch = '';
let currentJobSearch = '';
let currentTechSort = 'followers';
let currentCofounderSort = 'followers';
let currentJobSort = 'followers';

const countrySelect = document.getElementById('country-select');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const grid = document.getElementById('developers-grid');
const pagination = document.getElementById('pagination');
const resultCount = document.getElementById('result-count');

// Date inputs for search tab
const searchDateFrom = document.getElementById('search-date-from');
const searchDateTo = document.getElementById('search-date-to');

// Filter tabs
const filterTabs = document.querySelectorAll('.filter-tab');
const filterContents = document.querySelectorAll('.filter-content');

// Technology filters
const techSelect = document.getElementById('tech-select');
const techCountry = document.getElementById('tech-country');
const techDateFrom = document.getElementById('tech-date-from');
const techDateTo = document.getElementById('tech-date-to');
const techSearchInput = document.getElementById('tech-search-input');
const techSortSelect = document.getElementById('tech-sort-select');

// Cofounders filters
const cofoundersCountry = document.getElementById('cofounder-country');
const cofoundersDateFrom = document.getElementById('cofounder-date-from');
const cofoundersDateTo = document.getElementById('cofounder-date-to');
const cofoundersSearchInput = document.getElementById('cofounder-search-input');
const cofoundersSortSelect = document.getElementById('cofounder-sort-select');

// Jobs filters
const jobsCountry = document.getElementById('jobs-country');
const jobsDateFrom = document.getElementById('jobs-date-from');
const jobsDateTo = document.getElementById('jobs-date-to');
const jobsSearchInput = document.getElementById('jobs-search-input');
const jobsSortSelect = document.getElementById('jobs-sort-select');

// Load developers based on current filters
async function loadDevelopers() {
  const query = currentSearch || currentCountry || currentTech || 'Kenya';
  grid.innerHTML = '<div class="skeleton skeleton-card"></div>'.repeat(6);
  
  try {
    let result;
    
    // Helper function to build date query
    function buildDateQuery(dateFrom, dateTo) {
      let dateQuery = '';
      if (dateFrom) dateQuery += ` created:>=${dateFrom}`;
      if (dateTo) dateQuery += ` created:<=${dateTo}`;
      return dateQuery;
    }
    
    if (currentFilter === 'tech') {
      // Search by technology with optional refining search
      const dateQuery = buildDateQuery(currentTechDateFrom, currentTechDateTo);
      const searchQuery = currentTechSearch ? currentTechSearch : (currentTech || query);
      console.log(`Searching developers by tech: ${currentTech}, search: ${currentTechSearch}`);
      result = await searchDevelopersByTech(
        currentTech || searchQuery, 
        techCountry?.value || '', 
        currentPage, 
        12,
        dateQuery
      );
    } else if (currentFilter === 'cofounders') {
      // Search cofounders with optional refining search
      const dateQuery = buildDateQuery(currentCofounderDateFrom, currentCofounderDateTo);
      console.log(`Searching cofounders...`);
      result = await searchCofounders(
        cofoundersCountry?.value || '', 
        currentPage, 
        12,
        dateQuery
      );
    } else if (currentFilter === 'jobs') {
      // Search job seekers with optional refining search
      const dateQuery = buildDateQuery(currentJobDateFrom, currentJobDateTo);
      console.log(`Searching job seekers...`);
      result = await searchJobSeekers(
        jobsCountry?.value || '', 
        currentPage, 
        12,
        dateQuery
      );
    } else {
      // Default search (username or location)
      const searchType = currentSearch ? 'username' : 'location';
      const dateQuery = buildDateQuery(currentDateFrom, currentDateTo);
      console.log(`Searching by ${searchType}: ${query}`);
      result = await searchUsers(
        query, 
        currentPage, 
        12, 
        searchType,
        dateQuery
      );
    }
    
    console.log('Users found:', result);
    
    grid.innerHTML = result.users.map(u => renderDevCard(u)).join('');
    
    resultCount.textContent = `${result.totalCount} developers found`;
    
    const maxPages = getMaxPages(result.totalCount, 12);
    pagination.innerHTML = renderPagination(currentPage, maxPages, (page) => {
      currentPage = page;
      loadDevelopers();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Add click handlers
    document.querySelectorAll('.dev-card').forEach(card => {
      card.addEventListener('click', () => {
        const username = card.querySelector('.username').textContent.replace('@', '');
        window.location.href = `profile.html?user=${username}`;
      });
    });
  } catch (error) {
    console.error('Error loading developers:', error);
    renderErrorToast('Failed to load developers');
  }
}

// Filter tab switching
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.getAttribute('data-tab');
    currentFilter = tabName;
    currentPage = 1;
    
    // Update active tab styles
    filterTabs.forEach(t => {
      t.style.borderColor = '#D8DEE8';
      t.style.color = '#5A6478';
    });
    tab.style.borderColor = '#C79639';
    tab.style.color = '#C79639';
    
    // Show/hide filter contents
    filterContents.forEach(content => {
      content.style.display = 'none';
    });
    document.getElementById(`filter-${tabName}`)?.style?.setProperty('display', 'block');
    
    loadDevelopers();
  });
});

// Technology dropdown
techSelect?.addEventListener('change', (e) => {
  currentTech = e.target.value;
  currentPage = 1;
  if (currentTech) loadDevelopers();
});

// Technology country filter
techCountry?.addEventListener('change', () => {
  currentPage = 1;
  if (currentTech) loadDevelopers();
});

// Technology date filters
techDateFrom?.addEventListener('change', (e) => {
  currentTechDateFrom = e.target.value;
  currentPage = 1;
  if (currentTech) loadDevelopers();
});

techDateTo?.addEventListener('change', (e) => {
  currentTechDateTo = e.target.value;
  currentPage = 1;
  if (currentTech) loadDevelopers();
});

// Country select for regular search
countrySelect?.addEventListener('change', (e) => {
  currentCountry = e.target.value;
  currentSearch = '';
  currentPage = 1;
  loadDevelopers();
});

// Search input for regular search
searchInput?.addEventListener('input', debounce((e) => {
  currentSearch = e.target.value;
  currentCountry = '';
  currentPage = 1;
  if (currentSearch) loadDevelopers();
}, 500));

// Search date filters
searchDateFrom?.addEventListener('change', (e) => {
  currentDateFrom = e.target.value;
  currentPage = 1;
  loadDevelopers();
});

searchDateTo?.addEventListener('change', (e) => {
  currentDateTo = e.target.value;
  currentPage = 1;
  loadDevelopers();
});

// Co-founders country filter
cofoundersCountry?.addEventListener('change', () => {
  currentPage = 1;
  loadDevelopers();
});

// Cofounders date filters
cofoundersDateFrom?.addEventListener('change', (e) => {
  currentCofounderDateFrom = e.target.value;
  currentPage = 1;
  loadDevelopers();
});

cofoundersDateTo?.addEventListener('change', (e) => {
  currentCofounderDateTo = e.target.value;
  currentPage = 1;
  loadDevelopers();
});

// Jobs country filter
jobsCountry?.addEventListener('change', () => {
  currentPage = 1;
  loadDevelopers();
});

// Jobs date filters
jobsDateFrom?.addEventListener('change', (e) => {
  currentJobDateFrom = e.target.value;
  currentPage = 1;
  loadDevelopers();
});

jobsDateTo?.addEventListener('change', (e) => {
  currentJobDateTo = e.target.value;
  currentPage = 1;
  loadDevelopers();
});

// Technology tab search input
techSearchInput?.addEventListener('input', debounce((e) => {
  currentTechSearch = e.target.value;
  currentPage = 1;
  if (currentTech) loadDevelopers();
}, 500));

// Technology tab sort select
techSortSelect?.addEventListener('change', () => {
  currentTechSort = techSortSelect.value;
  currentPage = 1;
  if (currentTech) loadDevelopers();
});

// Cofounders search input
cofoundersSearchInput?.addEventListener('input', debounce((e) => {
  currentCofounderSearch = e.target.value;
  currentPage = 1;
  loadDevelopers();
}, 500));

// Cofounders sort select
cofoundersSortSelect?.addEventListener('change', () => {
  currentCofounderSort = cofoundersSortSelect.value;
  currentPage = 1;
  loadDevelopers();
});

// Jobs search input
jobsSearchInput?.addEventListener('input', debounce((e) => {
  currentJobSearch = e.target.value;
  currentPage = 1;
  loadDevelopers();
}, 500));

// Jobs sort select
jobsSortSelect?.addEventListener('change', () => {
  currentJobSort = jobsSortSelect.value;
  currentPage = 1;
  loadDevelopers();
});

// Hamburger menu
document.querySelector('.navbar-toggle')?.addEventListener('click', function() {
  document.querySelector('.nav-links').classList.toggle('open');
  this.setAttribute('aria-expanded', document.querySelector('.nav-links').classList.contains('open'));
});

// Initial load
const searchParam = getQueryParam('search');
const countryParam = getQueryParam('country');

if (searchParam) {
  currentSearch = searchParam;
  if (searchInput) searchInput.value = searchParam;
  currentFilter = 'search';
} else if (countryParam) {
  currentCountry = countryParam;
  if (countrySelect) countrySelect.value = countryParam;
  currentFilter = 'search';
} else {
  currentCountry = 'Kenya';
  if (countrySelect) countrySelect.value = 'Kenya';
  currentFilter = 'search';
}

loadDevelopers();
