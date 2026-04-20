/**
 * REPOSITORIES.JS - Repositories Page Logic
 */

import { searchRepos, getRepoReadme, getUserRepos } from './api.js';
import { renderRepoCard, renderErrorToast, renderPagination, attachCardActionHandlers } from './render.js';
import { getMaxPages, getQueryParam } from './utils.js';

let currentPage = 1;
let currentLanguage = '';
let currentOwner = '';
let languagePills, sortSelect, grid, pagination, resultCount, emptyState;
let pageTitle, pageDescription, emptyStateLink;
let readmePreviewBound = false;

async function loadRepos() {
  if (!grid || !pagination || !resultCount) {
    return;
  }

  grid.innerHTML = '<div class="skeleton skeleton-card"></div>'.repeat(6);
  if (emptyState) {
    emptyState.style.display = 'none';
  }
  
  try {
    const sort = sortSelect?.value || 'stars';
    let repos = [];
    let totalCount = 0;

    if (currentOwner) {
      const result = await getUserRepos(currentOwner, sort, 100);
      repos = filterReposByLanguage(result.repos || []);
      totalCount = repos.length;

      const startIndex = (currentPage - 1) * 12;
      repos = repos.slice(startIndex, startIndex + 12);
    } else {
      const result = await searchRepos('Africa', currentLanguage, sort, currentPage, 12);
      repos = result.repos || [];
      totalCount = result.totalCount || 0;
    }
    
    if (repos.length === 0) {
      grid.innerHTML = '';
      pagination.innerHTML = '';
      if (emptyState) {
        emptyState.style.display = 'block';
      }
      resultCount.textContent = currentOwner
        ? `0 repositories found for ${currentOwner}`
        : '0 repositories found';
      return;
    }

    grid.innerHTML = repos.map(r => renderRepoCard(r)).join('');
    
    bindReadmePreviewHandlers(grid);
    
    resultCount.textContent = currentOwner
      ? `${totalCount} repositories found for ${currentOwner}`
      : `${totalCount} repositories found`;
    
    const maxPages = getMaxPages(totalCount, 12);
    window.__afridevOnPageChange = (page) => {
      currentPage = page;
      loadRepos();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    pagination.innerHTML = renderPagination(currentPage, maxPages, (page) => {
      currentPage = page;
      loadRepos();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    attachCardActionHandlers(pagination);
  } catch (error) {
    console.error('Error loading repositories:', error);
    grid.innerHTML = '';
    pagination.innerHTML = '';
    if (emptyState) {
      emptyState.style.display = 'block';
    }
    renderErrorToast('Failed to load repositories');
  }
}

function filterReposByLanguage(repos) {
  if (!currentLanguage) {
    return repos;
  }

  return repos.filter((repo) => (repo.language || '').toLowerCase() === currentLanguage.toLowerCase());
}

function updateRepositoryViewCopy() {
  if (pageTitle) {
    pageTitle.textContent = currentOwner
      ? `${currentOwner}'s Repositories`
      : 'African Open Source';
  }

  if (pageDescription) {
    pageDescription.textContent = currentOwner
      ? `Browse repositories published by ${currentOwner} on AfriDev Explorer`
      : 'Discover trending open-source repositories from African developers';
  }

  if (emptyStateLink) {
    emptyStateLink.href = currentOwner ? `profile.html?user=${encodeURIComponent(currentOwner)}` : 'repositories.html';
    emptyStateLink.textContent = currentOwner ? 'Back to Profile' : 'Reset Filters';
  }
}

// Show README preview modal
export async function showReadmePreview(owner, repo) {
  const preview = document.getElementById('readme-preview');
  const title = document.getElementById('readme-title');
  const body = document.getElementById('readme-body');
  const closeBtn = document.querySelector('.readme-close');
  if (!preview || !title || !body || !closeBtn) {
    return;
  }
  
  // Show preview
  preview.classList.add('active');
  title.textContent = `${owner}/${repo} README`;
  body.textContent = 'Loading README...';
  
  try {
    const readme = await getRepoReadme(owner, repo);
    body.textContent = readme;
  } catch (error) {
    body.textContent = 'Failed to load README content.';
  }
}

export function bindReadmePreviewHandlers(container = document) {
  if (!container || container.dataset?.readmeBound === 'true') {
    return;
  }

  if (container.dataset) {
    container.dataset.readmeBound = 'true';
  }

  container.addEventListener('click', async (event) => {
    const readmeBtn = event.target.closest('.readme-btn');
    if (!readmeBtn) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const owner = readmeBtn.dataset.owner || readmeBtn.closest('.repo-card')?.dataset.owner;
    const repo = readmeBtn.dataset.repo || readmeBtn.closest('.repo-card')?.dataset.repo;
    if (owner && repo) {
      await showReadmePreview(owner, repo);
    }
  });
}

function setupReadmePreviewCloseHandlers() {
  if (readmePreviewBound) {
    return;
  }

  const preview = document.getElementById('readme-preview');
  const closeBtn = document.querySelector('.readme-close');
  if (!preview || !closeBtn) {
    return;
  }

  const closePreview = () => {
    preview.classList.remove('active');
  };

  closeBtn.addEventListener('click', closePreview);
  preview.addEventListener('click', (event) => {
    if (event.target === preview) {
      closePreview();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePreview();
    }
  });

  readmePreviewBound = true;
}

// Initialize DOM elements and event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  languagePills = document.querySelectorAll('.language-pills .pill');
  sortSelect = document.getElementById('sort-select');
  grid = document.getElementById('repositories-grid');
  pagination = document.getElementById('pagination');
  resultCount = document.getElementById('result-count');
  emptyState = document.getElementById('empty-state');
  pageTitle = document.querySelector('.page-header h1');
  pageDescription = document.querySelector('.page-header p');
  emptyStateLink = document.querySelector('#empty-state a');
  currentOwner = getQueryParam('owner') || '';
  setupReadmePreviewCloseHandlers();
  if (!grid || !pagination || !resultCount) {
    return;
  }

  updateRepositoryViewCopy();
  bindReadmePreviewHandlers(grid);
  
  // Setup event listeners
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

  // Initial load
  loadRepos();
});
