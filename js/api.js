/**
 * API.JS - GitHub API Integration
 * All API fetch functions and error handling
 */

const BASE_URL = 'https://api.github.com';
const GITHUB_TOKEN = ''; // Set via .env locally

const headers = GITHUB_TOKEN
  ? { Authorization: `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' }
  : { 'Accept': 'application/vnd.github.v3+json' };

/**
 * Handle API errors
 * @param {Response} response - The fetch response
 * @throws {Error} - Throws an error with a message
 */
export function handleApiError(response) {
  if (response.status === 403 || response.status === 429) {
    throw new Error('Rate limit exceeded. Please try again later.');
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
    console.error('Error searching users:', error);
    throw error;
  }
}

/**
 * Get a single user's profile
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} - User profile data and rate limit info
 */
export async function getUser(username) {
  const url = `${BASE_URL}/users/${encodeURIComponent(username)}`;

  try {
    const response = await fetch(url, { headers });
    handleApiError(response);

    const data = await response.json();
    return {
      user: data,
      rateLimit: checkRateLimit(response.headers)
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
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

  try {
    const response = await fetch(url, { headers });
    handleApiError(response);

    const data = await response.json();
    return {
      repos: Array.isArray(data) ? data : [],
      rateLimit: checkRateLimit(response.headers)
    };
  } catch (error) {
    console.error('Error fetching user repos:', error);
    throw error;
  }
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
export async function searchRepos(location = 'Africa', language = '', sort = 'stars', page = 1, perPage = 12) {
  let query = `location:${location}`;
  if (language) query += `+language:${language}`;

  const url = `${BASE_URL}/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&per_page=${perPage}&page=${page}`;

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
    console.error('Error searching repos:', error);
    throw error;
  }
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
