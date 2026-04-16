/**
 * REPOSITORIES.JS - Repositories Page Logic
 */

import { searchRepos } from './api.js';
import { renderRepoCard, renderErrorToast, renderPagination } from './render.js';
import { getMaxPages } from './utils.js';

let currentPage = 1;
let currentLanguage = '';

const languagePills = document.querySelectorAll('.language-pills .pill');
const sortSelect = document.getElementById('sort-select');
const grid = document.getElementById('repositories-grid');
const pagination = document.getElementById('pagination');
const resultCount = document.getElementById('result-count');

async function loadRepos() {
  grid.innerHTML = '<div class="skeleton skeleton-card"></div>'.repeat(6);
  
  try {
    const sort = sortSelect?.value || 'stars';
    const { repos, totalCount } = await searchRepos('Africa', currentLanguage, sort, currentPage, 12);
    
    grid.innerHTML = repos.map(r => renderRepoCard(r)).join('');
    resultCount.textContent = `${totalCount} repositories found`;
    
    const maxPages = getMaxPages(totalCount, 12);
    pagination.innerHTML = renderPagination(currentPage, maxPages, (page) => {
      currentPage = page;
      loadRepos();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  } catch (error) {
    renderErrorToast('Failed to load repositories');
  }
}

languagePills.forEach(pill => {
  pill.addEventListener('click', () => {
    languagePills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    currentLanguage = pill.getAttribute('data-language') || '';
    currentPage = 1;
    loadRepos();
  });
});

sortSelect?.addEventListener('change', () => {
  currentPage = 1;
  loadRepos();
});

document.querySelector('.navbar-toggle')?.addEventListener('click', function() {
  document.querySelector('.nav-links').classList.toggle('open');
  this.setAttribute('aria-expanded', document.querySelector('.nav-links').classList.contains('open'));
});

loadRepos();
