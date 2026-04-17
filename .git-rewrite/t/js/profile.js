/**
 * PROFILE.JS - Profile Page Logic
 */

import { getUser, getUserRepos } from './api.js';
import { renderProfileHeader, renderRepoCard, renderErrorToast } from './render.js';
import { getQueryParam } from './utils.js';

const username = getQueryParam('user');
const profileHeader = document.getElementById('profile-header');
const profileReposGrid = document.getElementById('profile-repos-grid');
const notFound = document.getElementById('not-found');

async function loadProfile() {
  if (!username) {
    notFound.style.display = 'block';
    return;
  }
  
  try {
    const { user } = await getUser(username);
    const { repos } = await getUserRepos(username, 'stars', 6);
    
    profileHeader.innerHTML = renderProfileHeader(user);
    profileReposGrid.innerHTML = repos.map(r => renderRepoCard(r)).join('');
  } catch (error) {
    notFound.style.display = 'block';
    renderErrorToast('Developer not found');
  }
}

document.querySelector('.navbar-toggle')?.addEventListener('click', function() {
  document.querySelector('.nav-links').classList.toggle('open');
  this.setAttribute('aria-expanded', document.querySelector('.nav-links').classList.contains('open'));
});

loadProfile();
