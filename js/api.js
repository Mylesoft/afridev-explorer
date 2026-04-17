/**
 * API.JS - GitHub API Integration
 * All API fetch functions and error handling
 */

const BASE_URL = 'https://api.github.com';
const GITHUB_TOKEN = window.AFRIDEV_GITHUB_TOKEN || '';

const headers = GITHUB_TOKEN
  ? { Authorization: `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' }
  : { 'Accept': 'application/vnd.github.v3+json' };

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise} - Result of the function
 */
export async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on non-rate-limit errors
      if (!error.message.includes('Rate limit') && !error.message.includes('403') && !error.message.includes('429')) {
        throw error;
      }
      
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff with jitter
      const backoffDelay = delay * Math.pow(2, i) + Math.random() * 1000;
      console.log(`Rate limit hit, retrying in ${Math.round(backoffDelay)}ms (attempt ${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  
  throw lastError;
}

/**
 * Handle API errors
 * @param {Response} response - The fetch response
 * @throws {Error} - Throws an error with a message
 */
export function handleApiError(response) {
  if (response.status === 403 || response.status === 429) {
    const rateLimitInfo = checkRateLimit(response.headers);
    const resetTime = rateLimitInfo.reset ? new Date(rateLimitInfo.reset * 1000).toLocaleTimeString() : 'unknown';
    throw new Error(`Rate limit exceeded. Resets at ${resetTime}. Please try again later.`);
  }
  if (response.status === 404) {
    throw new Error('Not found.');
  }
  if (response.status === 422) {
    throw new Error('Invalid search query. Please check your parameters.');
  }
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  return response;
}

/**
 * Parse rate limit info from response headers
 * @param {Headers} responseHeaders - Response headers
 * @returns {Object} - Rate limit info
 */
export function checkRateLimit(responseHeaders) {
  return {
    remaining: parseInt(responseHeaders.get('X-RateLimit-Remaining')) || 0,
    limit: parseInt(responseHeaders.get('X-RateLimit-Limit')) || 60,
    reset: parseInt(responseHeaders.get('X-RateLimit-Reset')) || 0
  };
}

/**
 * Search GitHub users by location or username
 * @param {string} query - Search query (location like 'Kenya' or username like 'john')
 * @param {string} type - Search type: 'location' or 'username' (default 'location')
 * @param {number} page - Page number (default 1)
 * @param {number} perPage - Results per page (default 12)
 * @param {string} dateQuery - Optional date filter query (e.g., " created:>=2020-01-01 created:<=2021-12-31")
 * @returns {Promise<Object>} - Search results and rate limit info
 */
export async function searchUsers(query, page = 1, perPage = 12, type = 'location', dateQuery = '') {
  let searchQuery;
  
  if (type === 'username') {
    // Search by username
    searchQuery = encodeURIComponent(`${query}${dateQuery}`);
  } else {
    // Search by location (default)
    searchQuery = encodeURIComponent(`location:${query}${dateQuery}`);
  }
  
  const url = `${BASE_URL}/search/users?q=${searchQuery}&sort=followers&per_page=${perPage}&page=${page}`;

  return retryWithBackoff(async () => {
    const response = await fetch(url, { headers });
    handleApiError(response);

    const data = await response.json();
    return {
      users: data.items || [],
      totalCount: data.total_count || 0,
      rateLimit: checkRateLimit(response.headers)
    };
  }, 3, 1000);
}

/**
 * Get a single user's profile
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} - User profile data and rate limit info
 */
export async function getUser(username) {
  const url = `${BASE_URL}/users/${encodeURIComponent(username)}`;

  return retryWithBackoff(async () => {
    const response = await fetch(url, { headers });
    handleApiError(response);

    const data = await response.json();
    return {
      user: data,
      rateLimit: checkRateLimit(response.headers)
    };
  }, 3, 1000);
}

/**
 * Get a user's public repositories
 * @param {string} username - GitHub username
 * @param {string} sort - Sort by 'stars', 'forks', or 'updated' (default 'stars')
 * @param {number} perPage - Results per page (default 6)
 * @returns {Promise<Object>} - Repository list and rate limit info
 */
export async function getUserRepos(username, sort = 'stars', perPage = 6) {
  const url = `${BASE_URL}/users/${encodeURIComponent(username)}/repos?sort=${sort}&per_page=${perPage}`;

  return retryWithBackoff(async () => {
    const response = await fetch(url, { headers });
    handleApiError(response);

    const data = await response.json();
    return {
      repos: Array.isArray(data) ? data : [],
      rateLimit: checkRateLimit(response.headers)
    };
  }, 3, 1000);
}

/**
 * Search open-source repositories
 * @param {string} location - Geographic location (e.g., 'Africa')
 * @param {string} language - Programming language (optional)
 * @param {string} sort - Sort by 'stars', 'forks', or 'updated'
 * @param {number} page - Page number
 * @param {number} perPage - Results per page
 * @returns {Promise<Object>} - Repository search results and rate limit info
 */
export async function searchRepos(location = 'Africa', language = '', sort = 'stars', page = 1, perPage = 12, owner = '') {
  let query = owner ? `user:${owner}` : `location:${location}`;
  if (language) query += `+language:${language}`;

  const url = `${BASE_URL}/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&per_page=${perPage}&page=${page}`;

  return retryWithBackoff(async () => {
    const response = await fetch(url, { headers });
    handleApiError(response);

    const data = await response.json();
    return {
      repos: data.items || [],
      totalCount: data.total_count || 0,
      rateLimit: checkRateLimit(response.headers)
    };
  }, 3, 1000);
}

/**
 * Search developers by technology/language in their repos
 * @param {string} tech - Technology/language name (e.g., 'JavaScript', 'Python')
 * @param {string} location - Optional location filter
 * @param {number} page - Page number
 * @param {number} perPage - Results per page
 * @param {string} dateQuery - Optional date filter query
 * @returns {Promise<Object>} - Developers and rate limit info
 */
export async function searchDevelopersByTech(tech, location = '', page = 1, perPage = 12, dateQuery = '') {
  let query = `language:${encodeURIComponent(tech)}`;
  if (location) {
    query += ` location:${encodeURIComponent(location)}`;
  }
  query += dateQuery;
  
  const url = `${BASE_URL}/search/repositories?q=${query}&sort=stars&per_page=${perPage}&page=${page}`;

  try {
    const response = await fetch(url, { headers });
    handleApiError(response);

    const data = await response.json();
    
    // Extract unique developers from repositories
    const developerSet = new Set();
    const developers = [];
    
    (data.items || []).forEach(repo => {
      if (repo.owner && !developerSet.has(repo.owner.login)) {
        developerSet.add(repo.owner.login);
        developers.push(repo.owner);
      }
    });

    return {
      users: developers,
      totalCount: data.total_count || 0,
      rateLimit: checkRateLimit(response.headers)
    };
  } catch (error) {
    console.error('Error searching developers by tech:', error);
    throw error;
  }
}

/**
 * Search developers looking for co-founders
 * @param {string} location - Optional location filter
 * @param {number} page - Page number
 * @param {number} perPage - Results per page
 * @param {string} dateQuery - Optional date filter query
 * @returns {Promise<Object>} - Matching developers
 */
export async function searchCofounders(location = '', page = 1, perPage = 12, dateQuery = '') {
  let query = 'cofounder OR co-founder OR "looking for cofounder" in:bio';
  if (location) {
    query += ` location:${encodeURIComponent(location)}`;
  }
  query += dateQuery;
  
  const url = `${BASE_URL}/search/users?q=${query}&sort=followers&per_page=${perPage}&page=${page}`;

  try {
    const response = await fetch(url, { headers });
    handleApiError(response);

    const data = await response.json();
    return {
      users: data.items || [],
      totalCount: data.total_count || 0,
      rateLimit: checkRateLimit(response.headers)
    };
  } catch (error) {
    console.error('Error searching cofounders:', error);
    throw error;
  }
}

/**
 * Search developers looking for jobs/hiring
 * @param {string} location - Optional location filter
 * @param {number} page - Page number
 * @param {number} perPage - Results per page
 * @param {string} dateQuery - Optional date filter query
 * @returns {Promise<Object>} - Matching developers
 */
export async function searchJobSeekers(location = '', page = 1, perPage = 12, dateQuery = '') {
  let query = 'hiring OR "looking for work" OR "available for hire" OR "open to work" in:bio';
  if (location) {
    query += ` location:${encodeURIComponent(location)}`;
  }
  query += dateQuery;
  
  const url = `${BASE_URL}/search/users?q=${query}&sort=followers&per_page=${perPage}&page=${page}`;

  try {
    const response = await fetch(url, { headers });
    handleApiError(response);

    const data = await response.json();
    return {
      users: data.items || [],
      totalCount: data.total_count || 0,
      rateLimit: checkRateLimit(response.headers)
    };
  } catch (error) {
    console.error('Error searching job seekers:', error);
    throw error;
  }
}

/**
 * Get trending issues from African developers
 * @param {number} page - Page number
 * @param {number} perPage - Results per page
 * @returns {Promise<Object>} - Trending issues
 */
export async function getTrendingIssues(page = 1, perPage = 8) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const dateString = oneMonthAgo.toISOString().split('T')[0];
  
  const query = encodeURIComponent(`created:>${dateString} label:"good first issue" is:open`);
  const url = `${BASE_URL}/search/issues?q=${query}&sort=stars&per_page=${perPage}&page=${page}`;

  try {
    const response = await fetch(url, { headers });
    handleApiError(response);

    const data = await response.json();
    return {
      issues: (data.items || []).map(issue => ({
        title: issue.title,
        repo: issue.repository_url.split('/').pop(),
        author: issue.user.login,
        url: issue.html_url,
        labels: issue.labels.map(l => l.name),
        createdAt: issue.created_at
      })),
      totalCount: data.total_count || 0,
      rateLimit: checkRateLimit(response.headers)
    };
  } catch (error) {
    console.error('Error fetching trending issues:', error);
    throw error;
  }
}

/**
 * Get user events (activity feed)
 * @param {string} username - GitHub username
 * @param {number} perPage - Results per page (default 20)
 * @returns {Promise<Object>} - User events and rate limit info
 */
export async function getUserEvents(username, perPage = 20) {
  const url = `${BASE_URL}/users/${encodeURIComponent(username)}/events?per_page=${perPage}`;

  try {
    const response = await fetch(url, { headers });
    handleApiError(response);

    const data = await response.json();
    return {
      items: Array.isArray(data) ? data : [],
      rateLimit: checkRateLimit(response.headers)
    };
  } catch (error) {
    console.error('Error fetching user events:', error);
    throw error;
  }
}

/**
 * Get trending repositories
 * @param {string} language - Optional language filter
 * @param {number} page - Page number
 * @param {number} perPage - Results per page
 * @returns {Promise<Object>} - Trending repositories
 */
export async function getTrendingRepositories(language = '', page = 1, perPage = 8) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const dateString = oneWeekAgo.toISOString().split('T')[0];
  
  let query = encodeURIComponent(`stars:>100 created:>${dateString} is:public`);
  if (language) {
    query = encodeURIComponent(`language:${language} stars:>100 created:>${dateString} is:public`);
  }
  
  const url = `${BASE_URL}/search/repositories?q=${query}&sort=stars&per_page=${perPage}&page=${page}`;

  try {
    const response = await fetch(url, { headers });
    handleApiError(response);

    const data = await response.json();
    return {
      repos: data.items || [],
      totalCount: data.total_count || 0,
      rateLimit: checkRateLimit(response.headers)
    };
  } catch (error) {
    console.error('Error fetching trending repositories:', error);
    throw error;
  }
}

/**
 * Get repository README content
 * @param {string} owner - Repository owner username
 * @param {string} repo - Repository name
 * @returns {Promise<string>} - README content as plain text
 */
export async function getRepoReadme(owner, repo) {
  const url = `${BASE_URL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`;
  
  try {
    const response = await fetch(url, { headers });
    if (response.status === 404) {
      return 'No README found for this repository.';
    }
    handleApiError(response);

    const data = await response.json();
    
    // Decode base64 content
    if (data.content) {
      return atob(data.content.replace(/\n/g, ''));
    }
    
    return 'README content could not be loaded.';
  } catch (error) {
    console.error('Error fetching README:', error);
    return 'Failed to load README content.';
  }
}

/**
 * Search developers by framework (via repository topics)
 * @param {string} framework - Framework name (e.g., 'React', 'Vue', 'Django')
 * @param {string} location - Optional location filter
 * @param {number} page - Page number
 * @param {number} perPage - Results per page
 * @returns {Promise<Object>} - Developers and rate limit info
 */
export async function searchByFramework(framework, location = '', page = 1, perPage = 12) {
  let query = `topic:${encodeURIComponent(framework)}`;
  if (location) {
    query += ` location:${encodeURIComponent(location)}`;
  }
  
  const url = `${BASE_URL}/search/repositories?q=${query}&sort=stars&per_page=${perPage}&page=${page}`;

  try {
    const response = await fetch(url, { headers });
    handleApiError(response);

    const data = await response.json();
    
    // Extract unique developers from repositories
    const developerSet = new Set();
    const developers = [];
    
    (data.items || []).forEach(repo => {
      if (repo.owner && !developerSet.has(repo.owner.login)) {
        developerSet.add(repo.owner.login);
        developers.push(repo.owner);
      }
    });

    return {
      users: developers,
      totalCount: data.total_count || 0,
      rateLimit: checkRateLimit(response.headers)
    };
  } catch (error) {
    console.error('Error searching by framework:', error);
    throw error;
  }
}

/**
 * Update rate limit display in navbar
 */
export function updateRateLimitDisplay() {
  const rateLimitBar = document.querySelector('.rate-limit-fill');
  const rateLimitLabel = document.querySelector('.rate-limit-label');
  
  if (window.__rateLimitInfo && rateLimitBar && rateLimitLabel) {
    const { remaining, limit } = window.__rateLimitInfo;
    const percentage = (remaining / limit) * 100;
    
    rateLimitBar.style.width = `${percentage}%`;
    rateLimitLabel.textContent = `${remaining}/${limit} API calls`;
    
    // Color coding based on remaining requests
    if (percentage > 40) {
      rateLimitBar.style.background = 'var(--color-success)';
    } else if (percentage > 15) {
      rateLimitBar.style.background = 'var(--color-accent)';
    } else {
      rateLimitBar.style.background = 'var(--color-danger)';
    }
  }
}

/**
 * Enhanced API fetch with rate limit tracking
 * @param {string} endpoint - API endpoint
 * @returns {Promise} - JSON response
 */
export async function apiFetchWithRateLimit(endpoint) {
  const url = `${BASE_URL}${endpoint}`;
  
  return retryWithBackoff(async () => {
    const response = await fetch(url, { headers });
    
    // Store rate limit information for UI display
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    const limit = response.headers.get('X-RateLimit-Limit');
    
    if (remaining && reset && limit) {
      window.__rateLimitInfo = {
        remaining: parseInt(remaining),
        reset: parseInt(reset) * 1000, // Convert to milliseconds
        limit: parseInt(limit),
        resetTime: new Date(parseInt(reset) * 1000).toLocaleTimeString()
      };
      updateRateLimitDisplay();
    }
    
    if (!response.ok) {
      const error = new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      throw error;
    }
    
    return response.json();
  });
}
