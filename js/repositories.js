/**
 * REPOSITORIES.JS - Repositories Page Logic
 */

import { searchRepos, getRepoReadme } from './api.js';
import { renderRepoCard, renderErrorToast, renderPagination } from './render.js';
import { getMaxPages, sanitize } from './utils.js';

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
    
    // Add README hover preview functionality
    const repoCards = grid.querySelectorAll('.repo-card');
    repoCards.forEach(card => {
      const readmeBtn = card.querySelector('.readme-btn');
      if (readmeBtn) {
        readmeBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const owner = card.dataset.owner;
          const repo = card.dataset.repo;
          await showReadmePreview(owner, repo);
        });
      }
    });
    
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

// Show README preview modal
async function showReadmePreview(owner, repo) {
  const preview = document.getElementById('readme-preview');
  const title = document.getElementById('readme-title');
  const body = document.getElementById('readme-body');
  const closeBtn = document.querySelector('.readme-close');
  
  // Show preview
  preview.classList.add('active');
  title.textContent = `${owner}/${repo} README`;
  body.innerHTML = '<div class="skeleton skeleton-card"></div>';
  
  try {
    const readme = await getRepoReadme(owner, repo);
    body.innerHTML = sanitize(readme);
  } catch (error) {
    body.innerHTML = '<p>Failed to load README content.</p>';
  }
  
  // Close handlers
  const closePreview = () => {
    preview.classList.remove('active');
  };
  
  closeBtn.addEventListener('click', closePreview);
  preview.addEventListener('click', (e) => {
    if (e.target === preview) {
      closePreview();
    }
  });
  
  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closePreview();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
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
