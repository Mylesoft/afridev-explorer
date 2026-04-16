# AfriDev Explorer
## Technical Specification — v3.0

**Author:** Jonathan Ayany (Myles)
**Contact:** ayany004@gmail.com · 0743 993 715
**Version:** 3.0 — Full Platform Specification
**Status:** In Development
**Last Updated:** 2025

---

> **How to read this document**
>
> This specification is structured in three phases. Each phase builds directly on the previous one — do not skip phases. Read the entire document before writing a single line of code. Every section is written so that any developer picking up this project can understand what to build, why it exists, and exactly how to implement it.

---

## Table of Contents

### Phase 1 — Explorer (Static Foundation)
- [1. Phase 1 Overview](#1-phase-1-overview)
- [2. Architecture Decision — Phase 1](#2-architecture-decision--phase-1)
- [3. Tech Stack — Phase 1](#3-tech-stack--phase-1)
- [4. File & Folder Structure — Phase 1](#4-file--folder-structure--phase-1)
- [5. Design System](#5-design-system)
- [6. HTML Head — Required Tags](#6-html-head--required-tags)
- [7. GitHub API Integration](#7-github-api-integration)
- [8. JavaScript Architecture — Phase 1](#8-javascript-architecture--phase-1)
- [9. CSS Architecture](#9-css-architecture)
- [10. Page Specifications — Phase 1](#10-page-specifications--phase-1)
- [11. Unit Testing — Phase 1](#11-unit-testing--phase-1)
- [12. GitHub Actions CI/CD](#12-github-actions-cicd)
- [13. Git Strategy](#13-git-strategy)
- [14. Local Development — Phase 1](#14-local-development--phase-1)
- [15. Accessibility & Performance](#15-accessibility--performance)
- [16. Phase 1 Deliverables Checklist](#16-phase-1-deliverables-checklist)

### Phase 2 — Community (Backend Integration)
- [17. Phase 2 Overview](#17-phase-2-overview)
- [18. Architecture Decision — Phase 2](#18-architecture-decision--phase-2)
- [19. Tech Stack — Phase 2](#19-tech-stack--phase-2)
- [20. Convex Backend — Schema & Data Model](#20-convex-backend--schema--data-model)
- [21. WorkOS Authentication](#21-workos-authentication)
- [22. File & Folder Structure — Phase 2](#22-file--folder-structure--phase-2)
- [23. Convex Functions Reference](#23-convex-functions-reference)
- [24. Page Specifications — Phase 2](#24-page-specifications--phase-2)
- [25. Developer Profile System](#25-developer-profile-system)
- [26. Employer Accounts & Job Board](#26-employer-accounts--job-board)
- [27. Co-Founder Board](#27-co-founder-board)
- [28. Community Feed](#28-community-feed)
- [29. Bookmarks & Saved Items](#29-bookmarks--saved-items)
- [30. Notifications System — Phase 2](#30-notifications-system--phase-2)
- [31. Unit Testing — Phase 2](#31-unit-testing--phase-2)
- [32. Deployment — Phase 2](#32-deployment--phase-2)
- [33. Phase 2 Deliverables Checklist](#33-phase-2-deliverables-checklist)

### Phase 3 — Platform (Full Product)
- [34. Phase 3 Overview](#34-phase-3-overview)
- [35. Architecture Decision — Phase 3](#35-architecture-decision--phase-3)
- [36. Tech Stack — Phase 3](#36-tech-stack--phase-3)
- [37. Extended Convex Schema — Phase 3](#37-extended-convex-schema--phase-3)
- [38. Advanced Features](#38-advanced-features)
- [39. Messaging System](#39-messaging-system)
- [40. Mentorship Programme](#40-mentorship-programme)
- [41. Events Board](#41-events-board)
- [42. African Tech Report](#42-african-tech-report)
- [43. Developer Growth Tracker](#43-developer-growth-tracker)
- [44. Skill Gap Heatmap](#44-skill-gap-heatmap)
- [45. Talent Search — Employer View](#45-talent-search--employer-view)
- [46. Recruitment Pipeline](#46-recruitment-pipeline)
- [47. Startup Showcase](#47-startup-showcase)
- [48. Trust & Safety](#48-trust--safety)
- [49. Monetisation Layer](#49-monetisation-layer)
- [50. Advanced Notifications & Email](#50-advanced-notifications--email)
- [51. Deployment — Phase 3](#51-deployment--phase-3)
- [52. Phase 3 Deliverables Checklist](#52-phase-3-deliverables-checklist)

### Appendices
- [A. Environment Variables Reference](#a-environment-variables-reference)
- [B. README Specification](#b-readme-specification)
- [C. Master Commit Roadmap](#c-master-commit-roadmap)
- [D. Security Hardening Checklist](#d-security-hardening-checklist)

---

---

# PHASE 1 — EXPLORER
## Static Foundation · GitHub API · GitHub Pages

---

## 1. Phase 1 Overview

### What Gets Built

Phase 1 is a fully static, multi-page web application. No backend. No database. No user accounts. Every piece of data comes from the public GitHub REST API. The site is deployed to GitHub Pages via GitHub Actions.

### Goal

Demonstrate mastery of Vanilla HTML, CSS, and JavaScript. Build a beautiful, fast, and functional African developer discovery platform that works entirely in the browser.

### Pages Delivered in Phase 1

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Landing — hero, live stats, featured devs, trending repos, tech leaderboard, live activity feed |
| Developers | `developers.html` | 4-tab developer search: All / By Technology / Co-Founders / Hiring |
| Repositories | `repositories.html` | Repo browser with language filter pills and sort controls |
| Profile | `profile.html` | Dynamic individual developer profile loaded from `?user=` URL param |
| Activity | `activity.html` | Full-page live GitHub event feed from African developers |
| About | `about.html` | About AfriDev Explorer and its author |
| 404 | `404.html` | Custom branded not-found page |

---

## 2. Architecture Decision — Phase 1

### Static-Only Architecture

Phase 1 uses zero backend infrastructure. The architecture is:

```
Browser → GitHub REST API (https://api.github.com)
Browser → sessionStorage (caching layer)
Browser → localStorage (bookmarks, dark mode preference, search history)
GitHub Actions → GitHub Pages (deployment)
```

No Node.js server, no database, no authentication. All API calls are made directly from client-side JavaScript using `fetch()`.

### JavaScript Module Strategy

**Decision: `type="module"` on all page-level script tags.**

This enables clean ES6 `import/export` between files. All shared functions live in dedicated modules (`api.js`, `render.js`, `utils.js`) and are imported by page-level scripts.

```html
<!-- Bottom of <body> in every HTML page -->
<script type="module" src="js/home.js"></script>
```

**Consequence:** `type="module"` does not work on the `file://` protocol. You must use a local dev server. See [Section 14](#14-local-development--phase-1).

### Routing

No JavaScript router. All navigation uses standard `<a href="...">` anchor tags. The profile page reads its data from the `?user=` URL query parameter.

---

## 3. Tech Stack — Phase 1

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Markup | HTML5 | — | Semantic page structure |
| Styles | Vanilla CSS | — | All styling, animations, responsive layout |
| Scripts | Vanilla JavaScript | ES2022 | API calls, DOM rendering, state management |
| Fonts | Google Fonts | — | Inter, JetBrains Mono |
| API | GitHub REST API v3 | — | Developer and repository data |
| Testing | Jest + jest-environment-jsdom | ^29 | Unit testing |
| CI/CD | GitHub Actions | — | Automated test + deploy pipeline |
| Hosting | GitHub Pages | — | Static site hosting |

---

## 4. File & Folder Structure — Phase 1

```
afridev-explorer/
│
├── index.html                        # Home / Landing page
├── developers.html                   # 4-tab developer search page
├── repositories.html                 # Repository browser page
├── profile.html                      # Individual developer profile page
├── activity.html                     # Live GitHub activity feed page
├── about.html                        # About page
├── 404.html                          # Custom 404 page
│
├── assets/
│   ├── default-avatar.png            # Fallback when GitHub avatar fails to load
│   ├── favicon.svg                   # SVG favicon (modern browsers)
│   ├── favicon.png                   # PNG favicon (fallback, 32x32)
│   ├── og-image.png                  # Open Graph social share image (1200x630)
│   └── africa-map.svg                # SVG map of Africa (54 country paths, each with id="XX" country code)
│
├── css/
│   ├── reset.css                     # CSS reset — browser default normalisation
│   ├── variables.css                 # Design tokens — colours, fonts, spacing, dark mode
│   ├── main.css                      # Global layout: body, navbar, hero, footer
│   ├── components.css                # Cards, buttons, inputs, modals, toasts, skeletons
│   └── responsive.css                # All media queries — tablet and mobile breakpoints
│
├── js/
│   ├── api.js                        # All GitHub API fetch functions
│   ├── render.js                     # DOM rendering — builds HTML strings from data
│   ├── utils.js                      # Pure utility functions — format, sanitize, cache, debounce
│   ├── theme.js                      # Dark mode toggle with localStorage persistence
│   ├── navbar.js                     # Shared navbar hamburger toggle, active link detection
│   ├── home.js                       # Logic for index.html
│   ├── developers.js                 # Logic for developers.html — tab state, filters
│   ├── repositories.js               # Logic for repositories.html
│   ├── profile.js                    # Logic for profile.html
│   └── activity.js                   # Logic for activity.html — live feed with auto-refresh
│
├── tests/
│   ├── api.test.js                   # Unit tests for api.js
│   ├── render.test.js                # Unit tests for render.js
│   └── utils.test.js                 # Unit tests for utils.js
│
├── .github/
│   └── workflows/
│       └── deploy.yml                # Test + deploy pipeline
│
├── .gitignore                        # node_modules, .env, .DS_Store, logs, coverage/
├── package.json                      # Jest config and dev dependencies
└── README.md                         # Project description, live URL, local setup
```

---

## 5. Design System

### 5.1 Colour Palette

Three core complementary colours. Navy and Gold are warm analogous complements. White provides clean base contrast. All other shades are derived tints — they do not count as additional palette colours.

| CSS Token | Hex | Role | Applied To |
|---|---|---|---|
| `--color-primary` | `#1A395B` | Navy — brand anchor | Navbar bg, headings, section headers, footer, card borders on hover |
| `--color-accent` | `#C79639` | Gold — action colour | CTAs, dividers, active states, badges, highlights, hover rings |
| `--color-white` | `#FFFFFF` | White — base surface | Page background, card surfaces, text on dark backgrounds |
| `--color-bg` | `#F4F6F9` | Ice (derived) | Body background, alternating table rows |
| `--color-surface` | `#FFFFFF` | Card surface | Developer cards, repo cards, modals |
| `--color-text` | `#1A1A2E` | Near-black (derived) | All body text |
| `--color-text-muted` | `#5A6478` | Muted (derived) | Captions, subtext, placeholders |
| `--color-border` | `#D8DEE8` | Border (derived) | Input borders, card dividers, skeleton lines |
| `--color-success` | `#16A34A` | Green | "Open to Work" badge, success toasts |
| `--color-danger` | `#DC2626` | Red | Error toasts, destructive actions |

### 5.2 Dark Mode Colour Overrides

Applied via `[data-theme="dark"]` on `<html>`. Core colours (Navy, Gold, White) remain the same — only surface and background tints change.

```css
[data-theme="dark"] {
  --color-bg:           #0D1117;
  --color-surface:      #161B22;
  --color-text:         #C9D1D9;
  --color-text-muted:   #8B949E;
  --color-border:       #30363D;
  --color-primary:      #1A395B;   /* unchanged */
  --color-accent:       #C79639;   /* unchanged */
}
```

### 5.3 Typography

| Font | Variable | Weights | Fallback Stack | Role |
|---|---|---|---|---|
| Georgia | `--font-heading` | Regular, Bold | `'Times New Roman', serif` | H1–H4, logo wordmark, section titles |
| Inter | `--font-body` | 300, 400, 500, 600, 700 | `system-ui, -apple-system, BlinkMacSystemFont, sans-serif` | All body, nav, labels, paragraphs |
| JetBrains Mono | `--font-mono` | 400, 600 | `'Courier New', Courier, monospace` | Stats, counts, language badges, code |

**Google Fonts URL (copy into every HTML `<head>`):**
```
https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap
```

### 5.4 Spacing Scale

All spacing uses multiples of 4px (0.25rem base unit):

| Token | Value | Pixels |
|---|---|---|
| `--space-xs` | `0.25rem` | 4px |
| `--space-sm` | `0.5rem` | 8px |
| `--space-md` | `1rem` | 16px |
| `--space-lg` | `1.5rem` | 24px |
| `--space-xl` | `2rem` | 32px |
| `--space-2xl` | `3rem` | 48px |
| `--space-3xl` | `4rem` | 64px |
| `--space-4xl` | `6rem` | 96px |

### 5.5 Layout

- **Max content width:** `1200px`, centred with `margin: 0 auto`
- **Section padding:** `4rem` top/bottom desktop · `2rem` mobile
- **Card grids:** `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
- **Navbar height:** `70px`, `position: sticky; top: 0; z-index: 100`
- **Breakpoints:** `1024px` tablet · `768px` mobile-md · `480px` mobile-sm

### 5.6 UI Components

| Component | Description |
|---|---|
| **Navbar** | Sticky top, hamburger on mobile, active link gold indicator, dark mode toggle, rate limit indicator |
| **Developer Card** | Avatar (with `onerror` fallback + `loading="lazy"`), name, username, location, followers, top language, up to 4 badge types, bookmark star |
| **Repo Card** | Repo name, description, owner avatar, language badge, star count, fork count, last updated via `timeAgo()` |
| **Activity Card** | Event type icon, actor avatar, event description, repo name, timestamp, country label |
| **Buttons** | `btn--primary` (gold fill), `btn--secondary` (navy fill), `btn--outline` (gold border), `btn--ghost` (transparent) |
| **Search Bar** | Input + button pair, debounced, gold focus ring, search history dropdown on focus |
| **Filter Pills** | Single-select or multi-select tags, active state navy fill + white text |
| **Tech Pills** | Grouped into Languages and Frameworks rows, active = gold |
| **Tab Bar** | 4-tab horizontal bar with active gold underline, switches content without page reload |
| **Date Range** | Two `<input type="date">` fields side by side with a label |
| **Loading Spinner** | Pure CSS `@keyframes` spin animation, centred overlay |
| **Skeleton Loader** | Shimmer placeholder cards matching card dimensions |
| **Empty State** | Icon + heading + subtext + optional CTA button, centred |
| **Toast** | Slide in from top-right, auto-dismiss after 4s, manual close button |
| **Modal** | Full overlay with `backdrop-filter: blur(4px)`, close on Escape or outside click |
| **Pagination** | Prev · 1 2 3 … · Next, active page gold, capped at GitHub's 1000-result ceiling |
| **Keyboard Shortcut Modal** | Triggered by `?` key, lists all shortcuts |
| **Africa Map** | SVG of Africa, 54 paths each with `id="KE"` country code, fills based on developer density |
| **Tech Leaderboard** | CSS bar chart, 8 bars, widths set via `style="width: X%"`, no JS chart library |
| **Badge System** | 4 badge types: Open to Work (green), Co-Founder (navy), Hiring (gold), Language (muted) |
| **Bookmark Star** | Toggle star icon on cards, persists to `localStorage` |
| **Share Button** | Copies `profile.html?user=username` to clipboard via `navigator.clipboard.writeText()` |
| **Rate Limit Bar** | Thin progress bar in navbar showing `X-RateLimit-Remaining` out of 60 |
| **Contribution Heatmap** | `<img src="https://ghchart.rshah.org/{username}" />` embedded on Profile page |
| **Dark Mode Toggle** | Moon/sun icon in navbar, saves to `localStorage`, applies `[data-theme]` to `<html>` |

---

## 6. HTML Head — Required Tags

### 6.1 Common Head Block

Every HTML page must include this full `<head>` block. Replace bracketed values per page (see Section 6.2).

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#1A395B" />

  <!-- SEO -->
  <meta name="description" content="[PAGE_DESCRIPTION]" />
  <meta name="author" content="Jonathan Ayany" />
  <meta name="keywords" content="African developers, GitHub Africa, open source Africa, AfriDev Explorer" />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph -->
  <meta property="og:type"        content="website" />
  <meta property="og:site_name"   content="AfriDev Explorer" />
  <meta property="og:title"       content="[PAGE_OG_TITLE]" />
  <meta property="og:description" content="[PAGE_DESCRIPTION]" />
  <meta property="og:image"       content="https://[username].github.io/afridev-explorer/assets/og-image.png" />
  <meta property="og:url"         content="https://[username].github.io/afridev-explorer/[page]" />

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="[PAGE_OG_TITLE]" />
  <meta name="twitter:description" content="[PAGE_DESCRIPTION]" />
  <meta name="twitter:image"       content="https://[username].github.io/afridev-explorer/assets/og-image.png" />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg" />
  <link rel="icon" type="image/png"     href="assets/favicon.png" />

  <!-- Preconnect for performance -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preconnect" href="https://api.github.com" />

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />

  <!-- CSS (always in this order) -->
  <link rel="stylesheet" href="css/reset.css" />
  <link rel="stylesheet" href="css/variables.css" />
  <link rel="stylesheet" href="css/main.css" />
  <link rel="stylesheet" href="css/components.css" />
  <link rel="stylesheet" href="css/responsive.css" />

  <title>[PAGE_TITLE] — AfriDev Explorer</title>
</head>
```

### 6.2 Per-Page Meta Values

| Page | `PAGE_TITLE` | `PAGE_OG_TITLE` | `PAGE_DESCRIPTION` |
|---|---|---|---|
| `index.html` | `AfriDev Explorer — Discover African Developers` | `AfriDev Explorer` | `Discover software developers and open-source projects from across Africa via GitHub.` |
| `developers.html` | `African Developers` | `Browse African Developers` | `Search and explore GitHub developers from 54 African nations by technology, co-founder status, and hiring.` |
| `repositories.html` | `African Open Source` | `African Open Source Repos` | `Discover trending open-source repositories built by African developers on GitHub.` |
| `profile.html` | `Developer Profile` | `Developer Profile` | `View GitHub profile, repositories, contribution history, and stats for African developers.` |
| `activity.html` | `Live Activity` | `Live African Dev Activity` | `Watch African developers push code, open PRs, and star repos in real time.` |
| `about.html` | `About` | `About AfriDev Explorer` | `AfriDev Explorer is built to make African developer talent more visible globally.` |
| `404.html` | `Page Not Found` | `404 — Not Found` | `The page you are looking for does not exist on AfriDev Explorer.` |

---

## 7. GitHub API Integration

### 7.1 Base URL & Headers

```js
// api.js — top of file
const BASE_URL = 'https://api.github.com';

// Optional GitHub PAT for higher rate limits (5000/hr vs 60/hr)
// NEVER hardcode a real token here — use environment approach described below
const GITHUB_TOKEN = '';

const AUTH_HEADERS = GITHUB_TOKEN
  ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
  : {};

const DEFAULT_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...AUTH_HEADERS,
};
```

### 7.2 All Endpoints Used

| Function | Method + Endpoint | Used On | Purpose |
|---|---|---|---|
| `searchUsers` | `GET /search/users` | Home, Developers (All tab) | Search users by location |
| `searchByTech` | `GET /search/users` | Developers (By Technology tab) | Filter users by programming language |
| `searchByBioKeyword` | `GET /search/users` | Developers (Co-Founders + Hiring tabs) | Find users by bio keywords |
| `getUser` | `GET /users/{username}` | Profile | Full user profile data |
| `getUserRepos` | `GET /users/{username}/repos` | Profile | User's public repositories |
| `getUserEvents` | `GET /users/{username}/events/public` | Activity feed | Recent public GitHub events |
| `searchRepos` | `GET /search/repositories` | Home, Repositories | Search repos by location and language |
| `getRepoReadme` | `GET /repos/{owner}/{repo}/readme` | Repositories (hover preview) | Fetch README content (base64) |

### 7.3 GitHub API Rate Limits

| Scenario | Limit | Strategy |
|---|---|---|
| Unauthenticated | 60 requests / hour / IP | Show rate limit bar, warn at 10 remaining |
| Authenticated (PAT) | 5,000 requests / hour | Recommended for development |
| Search API | 10 requests / minute (unauth) · 30/min (auth) | Debounce all search inputs at 500ms |
| GitHub Pages Search hard cap | 1,000 results max | Cap pagination via `getMaxPages()` |

### 7.4 Token Strategy — Development vs Production

**Development (local machine):**
1. Generate a GitHub Fine-Grained Personal Access Token
   - GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained
   - Permissions: Public Repositories (read-only) only
   - Expiry: 90 days
2. Create `.env` file in project root (`.gitignore`d — never commit this)
3. Paste token into `api.js` locally when needed, remove before committing

**Production (GitHub Pages):**
For a static site on GitHub Pages, there is no secure way to use a server-side token. The live site runs unauthenticated (60 req/hr). This is acceptable because real users have different IPs and sessions.

### 7.5 Implementing `api.js` — Complete Function Reference

```js
// ─────────────────────────────────────────────────────────────
// CORE FETCH WRAPPER
// ─────────────────────────────────────────────────────────────

async function apiFetch(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: DEFAULT_HEADERS,
  });
  // Store rate limit info globally for the UI bar
  window.__rateLimitRemaining = parseInt(
    response.headers.get('X-RateLimit-Remaining') || '60'
  );
  window.__rateLimitReset = parseInt(
    response.headers.get('X-RateLimit-Reset') || '0'
  );
  updateRateLimitBar();   // updates the navbar rate bar
  if (!response.ok) handleApiError(response);
  return response.json();
}

// ─────────────────────────────────────────────────────────────
// USER SEARCH FUNCTIONS
// ─────────────────────────────────────────────────────────────

// All Developers tab
async function searchUsers(location = 'Africa', page = 1, sort = 'followers') {
  const q = encodeURIComponent(`location:"${location}"`);
  return apiFetch(`/search/users?q=${q}&sort=${sort}&per_page=12&page=${page}`);
}

// By Technology tab — language-based user search
async function searchByTech(tech, country = '', page = 1) {
  const locationPart = country ? `+location:"${country}"` : '';
  const q = encodeURIComponent(`language:${tech}${locationPart}`);
  return apiFetch(`/search/users?q=${q}&per_page=12&page=${page}`);
}

// By Technology tab — framework-based (via repo topics)
async function searchByFramework(framework, country = '', page = 1) {
  const locationPart = country ? `+location:"${country}"` : '';
  const q = encodeURIComponent(`topic:${framework}${locationPart}`);
  const data = await apiFetch(
    `/search/repositories?q=${q}&per_page=30&page=${page}`
  );
  // Deduplicate owners
  const seen = new Map();
  data.items.forEach(repo => {
    if (!seen.has(repo.owner.login)) seen.set(repo.owner.login, repo.owner);
  });
  return { items: [...seen.values()], total_count: data.total_count };
}

// Co-Founders tab
async function searchCoFounders(country = '', dateFrom = '', page = 1) {
  const locationPart = country ? `+location:"${country}"` : '';
  const datePart = dateFrom ? `+created:${dateFrom}..*` : '';
  const keywords = `"co-founder" OR "cofounder" OR "looking to build" OR "seeking co-founder"`;
  const q = encodeURIComponent(`${keywords}${locationPart}${datePart}`);
  return apiFetch(`/search/users?q=${q}&per_page=12&page=${page}`);
}

// Hiring tab
async function searchHiring(country = '', dateFrom = '', page = 1) {
  const locationPart = country ? `+location:"${country}"` : '';
  const datePart = dateFrom ? `+created:${dateFrom}..*` : '';
  const keywords = `"hiring" OR "we're hiring" OR "join my team" OR "open roles" OR "join us"`;
  const q = encodeURIComponent(`${keywords}${locationPart}${datePart}`);
  return apiFetch(`/search/users?q=${q}&per_page=12&page=${page}`);
}

// ─────────────────────────────────────────────────────────────
// INDIVIDUAL USER
// ─────────────────────────────────────────────────────────────

async function getUser(username) {
  return apiFetch(`/users/${encodeURIComponent(username)}`);
}

async function getUserRepos(username, sort = 'stars', perPage = 6) {
  return apiFetch(
    `/users/${encodeURIComponent(username)}/repos?sort=${sort}&per_page=${perPage}`
  );
}

async function getUserEvents(username, perPage = 10) {
  return apiFetch(
    `/users/${encodeURIComponent(username)}/events/public?per_page=${perPage}`
  );
}

// ─────────────────────────────────────────────────────────────
// REPOSITORIES
// ─────────────────────────────────────────────────────────────

async function searchRepos(location = 'Africa', lang = '', sort = 'stars', page = 1) {
  const langPart = lang ? `+language:${lang}` : '';
  const q = encodeURIComponent(`location:"${location}"${langPart}`);
  return apiFetch(
    `/search/repositories?q=${q}&sort=${sort}&per_page=12&page=${page}`
  );
}

async function getRepoReadme(owner, repo) {
  const data = await apiFetch(`/repos/${owner}/${repo}/readme`);
  // Readme content is base64-encoded
  return atob(data.content.replace(/\n/g, ''));
}

// ─────────────────────────────────────────────────────────────
// ERROR HANDLING
// ─────────────────────────────────────────────────────────────

function handleApiError(response) {
  const errors = {
    403: 'Rate limit exceeded. Try again later.',
    404: 'Resource not found.',
    422: 'Invalid search query.',
    500: 'GitHub is having issues. Try again shortly.',
    503: 'GitHub API unavailable. Try again shortly.',
  };
  throw new Error(errors[response.status] || `Unexpected error: ${response.status}`);
}
```

---

## 8. JavaScript Architecture — Phase 1

### 8.1 `utils.js` — Complete Reference

```js
// ─── XSS Prevention ───────────────────────────────────────────
export function sanitize(str) {
  if (!str) return '';
  const el = document.createElement('div');
  el.textContent = str;
  return el.innerHTML;
}

// ─── Number Formatting ────────────────────────────────────────
export function formatNumber(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

// ─── Relative Time ────────────────────────────────────────────
export function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours   = Math.floor(diff / 3_600_000);
  const days    = Math.floor(diff / 86_400_000);
  if (minutes < 1)  return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours   < 24) return `${hours}h ago`;
  if (days    < 30) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString();
}

// ─── URL Params ───────────────────────────────────────────────
export function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

// ─── sessionStorage Cache ─────────────────────────────────────
export function setCache(key, data, ttl = 300_000) {
  sessionStorage.setItem(key, JSON.stringify({ data, expires: Date.now() + ttl }));
}

export function getCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, expires } = JSON.parse(raw);
    return Date.now() < expires ? data : null;
  } catch {
    return null;
  }
}

// ─── Debounce ─────────────────────────────────────────────────
export function debounce(fn, delay = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ─── GitHub Pagination Cap ────────────────────────────────────
export function getMaxPages(totalCount, perPage) {
  return Math.ceil(Math.min(totalCount, 1000) / perPage);
}

// ─── GitHub Language Colours ──────────────────────────────────
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Go: '#00ADD8', Rust: '#dea584', Java: '#b07219', PHP: '#4F5D95',
  'C++': '#f34b7d', Ruby: '#701516', Swift: '#F05138',
  Kotlin: '#A97BFF', Dart: '#00B4AB', Shell: '#89e051',
  'C#': '#178600', Elixir: '#6e4a7e', Haskell: '#5e5086',
};

export function getLanguageColor(lang) {
  return LANGUAGE_COLORS[lang] || '#5A6478';
}

// ─── Bio Keyword Detection ────────────────────────────────────
export function detectBioKeywords(bio = '') {
  const lower = bio.toLowerCase();
  return {
    isOpenToWork:  /open to work|available for hire|seeking opportunities|freelance|contractor/.test(lower),
    isCoFounder:   /co-?founder|cofounder|looking to build|seeking co-?founder/.test(lower),
    isHiring:      /hiring|we'?re hiring|join my team|open roles|join us/.test(lower),
  };
}

// ─── Bookmarks (localStorage) ─────────────────────────────────
export function getBookmarks() {
  return JSON.parse(localStorage.getItem('afridev_bookmarks') || '[]');
}

export function toggleBookmark(username) {
  const saved = getBookmarks();
  const updated = saved.includes(username)
    ? saved.filter(u => u !== username)
    : [...saved, username];
  localStorage.setItem('afridev_bookmarks', JSON.stringify(updated));
  return updated.includes(username);
}

export function isBookmarked(username) {
  return getBookmarks().includes(username);
}

// ─── Export Bookmarks as JSON ─────────────────────────────────
export function exportBookmarks() {
  const bookmarks = getBookmarks();
  const data = JSON.stringify(bookmarks, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'afridev-bookmarks.json';
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Date Filter Builder ──────────────────────────────────────
export function buildDateFilter(from, to) {
  if (!from) return '';
  const end = to || new Date().toISOString().split('T')[0];
  return `+created:${from}..${end}`;
}

// ─── Search History (localStorage) ───────────────────────────
export function getSearchHistory() {
  return JSON.parse(localStorage.getItem('afridev_search_history') || '[]');
}

export function addToSearchHistory(term) {
  if (!term.trim()) return;
  const history = getSearchHistory().filter(h => h !== term);
  history.unshift(term);
  localStorage.setItem('afridev_search_history', JSON.stringify(history.slice(0, 10)));
}

// ─── Clipboard Share ──────────────────────────────────────────
export async function copyProfileLink(username) {
  const url = `${window.location.origin}/afridev-explorer/profile.html?user=${username}`;
  await navigator.clipboard.writeText(url);
}

// ─── Rate Limit Bar Update ────────────────────────────────────
export function updateRateLimitBar() {
  const bar   = document.querySelector('.rate-limit-fill');
  const label = document.querySelector('.rate-limit-label');
  if (!bar) return;
  const remaining = window.__rateLimitRemaining ?? 60;
  const pct = (remaining / 60) * 100;
  bar.style.width = `${pct}%`;
  bar.style.background = pct > 40 ? 'var(--color-success)'
    : pct > 15 ? 'var(--color-accent)'
    : 'var(--color-danger)';
  if (label) label.textContent = `${remaining}/60 API calls`;
}
```

### 8.2 `render.js` — Complete Reference

All API data **must** go through `sanitize()` before insertion. Every avatar `img` must have `onerror` and `loading="lazy"`.

```js
import { sanitize, formatNumber, timeAgo, getLanguageColor, detectBioKeywords, isBookmarked } from './utils.js';

// ─── Developer Card ───────────────────────────────────────────
export function renderDevCard(user) {
  const bio      = detectBioKeywords(user.bio || '');
  const bookmarked = isBookmarked(user.login);

  const badges = [
    bio.isOpenToWork ? `<span class="badge badge--open">🟢 Open to Work</span>` : '',
    bio.isCoFounder  ? `<span class="badge badge--cofounder">🤝 Co-Founder</span>` : '',
    bio.isHiring     ? `<span class="badge badge--hiring">💼 Hiring</span>` : '',
    user.top_language ? `<span class="badge badge--lang">${sanitize(user.top_language)}</span>` : '',
  ].filter(Boolean).join('');

  return `
    <article class="dev-card" data-username="${sanitize(user.login)}">
      <div class="dev-card__header">
        <img
          src="${sanitize(user.avatar_url)}"
          alt="Avatar of ${sanitize(user.login)}"
          class="dev-card__avatar"
          loading="lazy"
          onerror="this.src='assets/default-avatar.png'"
        />
        <div class="dev-card__actions">
          <button class="btn-icon bookmark-btn ${bookmarked ? 'bookmarked' : ''}"
                  data-user="${sanitize(user.login)}"
                  aria-label="${bookmarked ? 'Remove bookmark' : 'Bookmark'} ${sanitize(user.login)}">
            ${bookmarked ? '★' : '☆'}
          </button>
          <button class="btn-icon share-btn"
                  data-user="${sanitize(user.login)}"
                  aria-label="Copy profile link for ${sanitize(user.login)}">
            🔗
          </button>
        </div>
      </div>
      <div class="dev-card__body">
        <h3 class="dev-card__name">${sanitize(user.name || user.login)}</h3>
        <p class="dev-card__username">@${sanitize(user.login)}</p>
        ${user.location ? `<p class="dev-card__location">📍 ${sanitize(user.location)}</p>` : ''}
        <div class="dev-card__badges">${badges}</div>
      </div>
      <div class="dev-card__footer">
        <span class="dev-card__stat">
          <span class="mono">${formatNumber(user.followers)}</span> followers
        </span>
        <span class="dev-card__stat">
          <span class="mono">${formatNumber(user.public_repos)}</span> repos
        </span>
        <a href="profile.html?user=${sanitize(user.login)}" class="btn btn--outline btn--sm">
          View Profile
        </a>
      </div>
    </article>
  `;
}

// ─── Repo Card ────────────────────────────────────────────────
export function renderRepoCard(repo) {
  const color = getLanguageColor(repo.language);
  return `
    <article class="repo-card">
      <div class="repo-card__header">
        <img
          src="${sanitize(repo.owner.avatar_url)}"
          alt="Avatar of ${sanitize(repo.owner.login)}"
          class="repo-card__avatar"
          loading="lazy"
          onerror="this.src='assets/default-avatar.png'"
        />
        <div>
          <h3 class="repo-card__name">${sanitize(repo.full_name)}</h3>
          ${repo.language ? `
          <span class="lang-badge" style="border-left: 3px solid ${color}">
            ${sanitize(repo.language)}
          </span>` : ''}
        </div>
      </div>
      <p class="repo-card__desc">${sanitize(repo.description || 'No description provided.')}</p>
      <div class="repo-card__footer">
        <span class="mono">⭐ ${formatNumber(repo.stargazers_count)}</span>
        <span class="mono">🍴 ${formatNumber(repo.forks_count)}</span>
        <span class="repo-card__updated">${timeAgo(repo.updated_at)}</span>
        <a href="${sanitize(repo.html_url)}" target="_blank" rel="noopener noreferrer"
           class="btn btn--outline btn--sm">
          View Repo ↗
        </a>
      </div>
    </article>
  `;
}

// ─── Activity Card ────────────────────────────────────────────
const EVENT_ICONS = {
  PushEvent:        { icon: '🔨', label: 'pushed commits to' },
  PullRequestEvent: { icon: '🔀', label: 'opened a PR in' },
  IssuesEvent:      { icon: '🐛', label: 'opened an issue in' },
  WatchEvent:       { icon: '⭐', label: 'starred' },
  ForkEvent:        { icon: '🍴', label: 'forked' },
  CreateEvent:      { icon: '🚀', label: 'created' },
  DeleteEvent:      { icon: '🗑️', label: 'deleted branch in' },
  ReleaseEvent:     { icon: '📦', label: 'released in' },
};

export function renderActivityCard(event) {
  const { icon, label } = EVENT_ICONS[event.type] || { icon: '⚡', label: 'did something in' };
  return `
    <div class="activity-card">
      <span class="activity-card__icon">${icon}</span>
      <img
        src="${sanitize(event.actor.avatar_url)}"
        alt="${sanitize(event.actor.login)}"
        class="activity-card__avatar"
        loading="lazy"
        onerror="this.src='assets/default-avatar.png'"
      />
      <div class="activity-card__body">
        <p>
          <a href="profile.html?user=${sanitize(event.actor.login)}" class="link--navy">
            ${sanitize(event.actor.login)}
          </a>
          ${label}
          <a href="https://github.com/${sanitize(event.repo.name)}" target="_blank"
             rel="noopener noreferrer" class="link--accent">
            ${sanitize(event.repo.name)}
          </a>
        </p>
        <span class="activity-card__time">${timeAgo(event.created_at)}</span>
      </div>
    </div>
  `;
}

// ─── Skeleton Cards ───────────────────────────────────────────
export function renderSkeletonCards(n = 6) {
  return Array.from({ length: n }, () => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton skeleton--avatar"></div>
      <div class="skeleton skeleton--title"></div>
      <div class="skeleton skeleton--text"></div>
      <div class="skeleton skeleton--text short"></div>
    </div>
  `).join('');
}

// ─── Empty State ──────────────────────────────────────────────
export function renderEmptyState(message = 'No results found.', tips = []) {
  const tipsList = tips.length
    ? `<ul class="empty-state__tips">${tips.map(t => `<li>${sanitize(t)}</li>`).join('')}</ul>`
    : '';
  return `
    <div class="empty-state">
      <span class="empty-state__icon">🌍</span>
      <h3 class="empty-state__title">${sanitize(message)}</h3>
      ${tipsList}
    </div>
  `;
}

// ─── Error Toast ──────────────────────────────────────────────
export function renderErrorToast(message, type = 'error') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span>${sanitize(message)}</span>
    <button class="toast__close" aria-label="Close notification">✕</button>
  `;
  document.body.appendChild(toast);
  toast.querySelector('.toast__close').addEventListener('click', () => toast.remove());
  setTimeout(() => toast?.remove(), 5000);
}

// ─── Pagination ───────────────────────────────────────────────
export function renderPagination(current, maxPages, onPageChange) {
  if (maxPages <= 1) return '';
  const pages = [];
  const createBtn = (label, page, disabled = false, active = false) =>
    `<button class="page-btn ${active ? 'active' : ''}" ${disabled ? 'disabled' : ''}
             data-page="${page}">${label}</button>`;

  pages.push(createBtn('← Prev', current - 1, current === 1));
  const range = [1, 2, current - 1, current, current + 1, maxPages - 1, maxPages]
    .filter(p => p >= 1 && p <= maxPages);
  [...new Set(range)].sort((a, b) => a - b).forEach((p, i, arr) => {
    if (i > 0 && arr[i - 1] !== p - 1) pages.push(`<span class="page-ellipsis">…</span>`);
    pages.push(createBtn(p, p, false, p === current));
  });
  pages.push(createBtn('Next →', current + 1, current === maxPages));

  const container = document.createElement('div');
  container.className = 'pagination';
  container.innerHTML = pages.join('');
  container.addEventListener('click', e => {
    const btn = e.target.closest('.page-btn:not([disabled])');
    if (btn) onPageChange(parseInt(btn.dataset.page));
  });
  return container;
}
```

### 8.3 `theme.js` — Dark Mode

```js
// theme.js — import this in every page BEFORE other scripts
const root   = document.documentElement;
const toggle = document.querySelector('.dark-toggle');

// Apply saved preference on every page load
const saved = localStorage.getItem('afridev_theme') || 'light';
root.setAttribute('data-theme', saved);
updateToggleIcon(saved);

toggle?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('afridev_theme', next);
  updateToggleIcon(next);
});

function updateToggleIcon(theme) {
  if (!toggle) return;
  toggle.textContent   = theme === 'dark' ? '☀️' : '🌙';
  toggle.ariaLabel     = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}
```

### 8.4 `navbar.js` — Shared Navbar Logic

```js
// navbar.js — shared across all pages
const menuToggle = document.querySelector('.menu-toggle');
const navLinks   = document.querySelector('.nav-links');

// Hamburger toggle
menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('nav-open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  menuToggle.textContent = isOpen ? '✕' : '☰';
});

// Close nav when clicking outside
document.addEventListener('click', e => {
  if (!e.target.closest('.navbar')) navLinks?.classList.remove('nav-open');
});

// Highlight active page in navbar
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const shortcuts = {
    '/': () => document.querySelector('.search-input')?.focus(),
    'd': () => { window.location.href = 'developers.html'; },
    'r': () => { window.location.href = 'repositories.html'; },
    'a': () => { window.location.href = 'activity.html'; },
    'b': () => { window.location.href = 'developers.html#bookmarks'; },
    '?': () => document.querySelector('.shortcuts-modal')?.classList.toggle('open'),
    'Escape': () => {
      document.querySelector('.modal.open')?.classList.remove('open');
      document.querySelector('.shortcuts-modal.open')?.classList.remove('open');
    },
  };
  const handler = shortcuts[e.key];
  if (handler) { e.preventDefault(); handler(); }
});
```

### 8.5 `developers.js` — Tab State Architecture

```js
// developers.js
import { searchUsers, searchByTech, searchByFramework, searchCoFounders, searchHiring } from './api.js';
import { renderDevCard, renderSkeletonCards, renderEmptyState, renderErrorToast, renderPagination } from './render.js';
import { debounce, getMaxPages, setCache, getCache, toggleBookmark, copyProfileLink, exportBookmarks } from './utils.js';

// ─── Shared State Object ──────────────────────────────────────
const state = {
  activeTab:  'all',      // 'all' | 'tech' | 'cofounders' | 'hiring'
  query:      '',
  country:    '',
  tech:       '',
  techType:   'language', // 'language' | 'framework'
  dateFrom:   '',
  dateTo:     '',
  sort:       'followers',
  page:       1,
  totalCount: 0,
};

// ─── On tab switch ────────────────────────────────────────────
function switchTab(tab) {
  state.activeTab = tab;
  state.page = 1;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
    btn.setAttribute('aria-selected', btn.dataset.tab === tab);
  });
  // Show/hide tab-specific filter controls
  document.querySelectorAll('[data-tab-controls]').forEach(el => {
    el.hidden = el.dataset.tabControls !== tab;
  });
  fetchForActiveTab();
}

// ─── Dispatcher ───────────────────────────────────────────────
async function fetchForActiveTab() {
  showLoading();
  try {
    let data;
    const { country, tech, dateFrom, dateTo, sort, page } = state;
    switch (state.activeTab) {
      case 'all':
        data = await searchUsers(country || 'Africa', page, sort); break;
      case 'tech':
        data = tech
          ? (state.techType === 'framework'
            ? await searchByFramework(tech, country, page)
            : await searchByTech(tech, country, page))
          : { items: [], total_count: 0 };
        break;
      case 'cofounders':
        data = await searchCoFounders(country, dateFrom, page); break;
      case 'hiring':
        data = await searchHiring(country, dateFrom, page); break;
    }
    state.totalCount = data.total_count;
    renderResults(data.items);
    renderPaginationBar();
  } catch (err) {
    renderErrorToast(err.message);
  }
}
```

---

## 9. CSS Architecture

### 9.1 `reset.css`

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; font-size: 16px; }
body { min-height: 100vh; line-height: 1.6; -webkit-font-smoothing: antialiased; }
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; border: none; outline: none; background: none; }
button { cursor: pointer; }
a { text-decoration: none; color: inherit; }
ul, ol { list-style: none; }
p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
```

### 9.2 `variables.css`

Declare all tokens on `:root`. Include full dark mode overrides on `[data-theme="dark"]`. (Full token list given in Section 5.)

### 9.3 `main.css`

Covers: `body`, `.container`, `.site-header`, `.navbar`, `.logo`, `.nav-links`, `.nav-link`, `.menu-toggle`, `.dark-toggle`, `.rate-limit-bar`, `.hero`, `.hero-title`, `.hero-search`, `.country-tags`, `.stats-strip`, `.featured-section`, `.cta-banner`, `.site-footer`, `.shortcuts-modal`.

### 9.4 `components.css`

Covers every component listed in Section 5.6. Key rules:

- `.dev-card:hover` → `transform: translateY(-4px); box-shadow: var(--shadow-lg)`
- `.skeleton` → `@keyframes shimmer` with animated `background-position` from `-200px` to `200px`
- `.toast` → `@keyframes slideIn` from `transform: translateX(120%)` to `translateX(0)`
- `.badge--open` → `background: var(--color-success); color: white`
- `.badge--cofounder` → `background: var(--color-primary); color: white`
- `.badge--hiring` → `background: var(--color-accent); color: white`
- `.tab-btn.active` → `border-bottom: 2px solid var(--color-accent); color: var(--color-accent)`
- `.leaderboard-bar` → `height: 24px; background: var(--color-primary); transition: width 0.6s ease`
- `.map-country` → `fill: var(--color-bg); transition: fill 0.3s ease; cursor: pointer`
- `.map-country:hover` → `fill: var(--color-accent)`
- `.map-country.density-low` → `fill: #C7D7EF`
- `.map-country.density-med` → `fill: var(--color-primary-light)`
- `.map-country.density-high` → `fill: var(--color-primary)`

### 9.5 `responsive.css`

```css
@media (max-width: 1024px) { /* tablet adjustments */ }
@media (max-width: 768px)  {
  .nav-links { display: none; flex-direction: column; }
  .nav-links.nav-open { display: flex; }
  .menu-toggle { display: block; }
  .hero { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .container { padding: 0 var(--space-md); }
  .btn { width: 100%; justify-content: center; }
}
```

---

## 10. Page Specifications — Phase 1

### 10.1 `index.html` — Home

**Sections (top to bottom):**

1. **Navbar** — logo, nav links (Home · Developers · Repositories · Activity · About), dark mode toggle, rate limit bar, hamburger on mobile
2. **Hero** — H1 `"Discover African Developers"`, subtitle, search bar (redirects to `developers.html?q=term`), country quick-filter pills (🇰🇪 Kenya · 🇳🇬 Nigeria · 🇬🇭 Ghana · 🇿🇦 South Africa · 🇪🇬 Egypt · 🇪🇹 Ethiopia · 🇷🇼 Rwanda · 🇹🇿 Tanzania), animated globe SVG
3. **Live Stats Strip** — `54 Countries` · `100K+ Developers` · `500K+ Repos` · `∞ Opportunities` — navy background, JetBrains Mono font
4. **Featured Developers** — 6 dev cards from `searchUsers('Kenya')`, "View All Developers →" link
5. **Developer Map** — Africa SVG map coloured by developer density (country code → colour class), click any country → `developers.html?country=XX`, low/med/high legend
6. **Tech Leaderboard** — 8-language CSS bar chart: JavaScript, Python, TypeScript, PHP, Go, Java, C++, Ruby. Bars animate in on scroll via `IntersectionObserver`.
7. **Trending Repos** — 6 repo cards from `searchRepos('Africa')`, "View All Repos →" link
8. **Live Activity Feed** — 6 activity cards from `getUserEvents()` across a curated list of 5 active African devs, auto-refreshes every 60s, animated green "LIVE" dot
9. **African Dev of the Week** — Static hardcoded spotlight card: avatar, name, one-liner, GitHub link
10. **CTA Banner** — "Browse Developers" + "Explore Repos" on navy background
11. **Footer** — logo, nav links, GitHub link, copyright, author credit

### 10.2 `developers.html` — Developers

**Layout:**

```
[Page Header]
[Shared Filter Bar: country dropdown | search input | date-from | date-to | sort]
[Tab Bar: All Developers | By Technology | Co-Founders | Hiring]
[Tab-Specific Controls (shown/hidden per tab)]
[Results Grid / Results Count]
[Pagination]
[Bookmarks Section (visible when bookmarks exist)]
```

**Tab: All Developers**
- Country dropdown (54 African nations, "All Africa" default)
- Search input (debounced 500ms, adds `?q=` to search query)
- Sort dropdown: Most Followers · Most Repos · Newest
- Results: developer cards with all 4 badges
- Pagination capped at `getMaxPages(totalCount, 12)`

**Tab: By Technology**
- Language pills: JavaScript · TypeScript · Python · Go · Rust · Java · PHP · C++ · Ruby · Swift · Kotlin · Dart · Shell · C# · Elixir
- Framework pills: React · Vue · Django · Laravel · Spring · Flutter · Rails · Next.js · Express · FastAPI · Angular
- One pill active at a time. Language pills → `searchByTech()`. Framework pills → `searchByFramework()`
- Country dropdown and date range persist from shared state

**Tab: Co-Founders**
- Date range filter (from / to)
- Country filter
- Results: developer cards with 🤝 Co-Founder badge prominent
- Note in UI: *"Results based on GitHub bio keywords"*

**Tab: Hiring**
- Same as Co-Founders tab but queries hiring keywords
- Cards show 💼 Hiring badge

**Bookmarks Section**
- Appears below results when `getBookmarks().length > 0`
- Header: "Saved Developers (N)" with "Export as JSON" button
- Shows bookmarked usernames as chips with "View Profile" links
- "Clear All" button

### 10.3 `repositories.html` — Repositories

```
[Page Header: "African Open Source"]
[Filter Bar: Language pills | Country dropdown | Sort dropdown]
[Results Grid: Repo cards]
[Hover: README preview tooltip — fetches and truncates README on mouseenter]
[Pagination]
```

**Language pills:** JavaScript · TypeScript · Python · Go · Rust · Java · PHP · C++ · Ruby · Swift · Kotlin · Dart · Shell · C#

**Sort options:** Most Stars · Most Forks · Recently Updated

**README Preview:** On hover over a repo card, fetch `getRepoReadme(owner, repo)`, decode from base64, truncate to first 300 characters, show in a tooltip. Debounced 300ms to avoid excessive calls.

### 10.4 `profile.html` — Individual Developer

On load: read `?user=` param via `getQueryParam('user')`. If missing → redirect to `404.html`. Call `getUser(username)` and `getUserRepos(username)` in parallel via `Promise.all()`.

**Sections:**

1. **Back button** — `← Back` using `history.back()`
2. **Profile Hero** — large avatar (200px), name, @username, location, website, bio, joined date, verified checkmark if `site_admin`
3. **Stats Row** — Public Repos · Followers · Following — all in JetBrains Mono
4. **Badge Row** — detected bio badges (Open to Work, Co-Founder, Hiring)
5. **Action Row** — "View on GitHub ↗" · "Copy Profile Link" · "Bookmark ★"
6. **Contribution Heatmap** — `<img src="https://ghchart.rshah.org/{username}" alt="Contribution heatmap for {username}" loading="lazy" />`
7. **Top Repositories** — 6 repo cards sorted by stars
8. **Similar Developers** — fetch `searchByTech(topLanguage, location, 1)`, show 3 cards excluding the current user
9. **404 state** — if `getUser()` throws 404, show empty state with "Search Again" button

### 10.5 `activity.html` — Live Activity Feed

**Architecture:**
- On load, call `getUserEvents()` for a curated list of 10 active African developers in parallel via `Promise.allSettled()`
- Merge all event arrays, sort by `created_at` descending
- Render top 20 events as activity cards
- Auto-refresh every 60 seconds via `setInterval(refreshFeed, 60000)`

**Filter controls:**
- Event type multi-select: Push · PR · Issue · Star · Fork · Create · Release
- Country filter (maps username to country based on their GitHub location field)

**Live dot:**
```html
<span class="live-dot" aria-label="Live feed"></span>
<span>LIVE</span>
```
```css
.live-dot {
  display: inline-block;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--color-success);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(1.3); }
}
```

### 10.6 `about.html` — About

Static page — zero API calls.

1. Hero: "About AfriDev Explorer" + mission statement
2. Why section: short essay on African developer visibility
3. Tech stack: cards for HTML5 · Vanilla CSS · JavaScript · GitHub API · GitHub Actions · Jest
4. Author: Jonathan Ayany (Myles), bio, GitHub link (`github.com/Mylesoft`), email
5. CTA: "Browse Developers" + "Explore Repos"

### 10.7 `404.html` — Not Found

- Full site design (same navbar, footer, CSS)
- Large `404` in Georgia font, navy colour
- Message: `"This page doesn't exist — yet."`
- Buttons: "Go Home" + "Browse Developers"
- No API calls

---

## 11. Unit Testing — Phase 1

### 11.1 Setup

```json
// package.json
{
  "name": "afridev-explorer",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "jest --experimental-vm-modules",
    "test:watch": "jest --experimental-vm-modules --watch",
    "test:coverage": "jest --experimental-vm-modules --coverage"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "testMatch": ["**/tests/**/*.test.js"],
    "extensionsToTreatAsEsm": [".js"],
    "moduleNameMapper": { "^(\\.{1,2}/.*)\\.js$": "$1" }
  }
}
```

### 11.2 Test Coverage Targets

| File | Min Tests | Functions Covered |
|---|---|---|
| `tests/utils.test.js` | 18 | `sanitize`, `formatNumber`, `timeAgo`, `getQueryParam`, `setCache`, `getCache`, `debounce`, `getMaxPages`, `getLanguageColor`, `detectBioKeywords`, `buildDateFilter`, `toggleBookmark`, `getBookmarks`, `isBookmarked`, `addToSearchHistory`, `getSearchHistory` |
| `tests/render.test.js` | 10 | `renderDevCard`, `renderRepoCard`, `renderActivityCard`, `renderSkeletonCards`, `renderEmptyState` |
| `tests/api.test.js` | 10 | `searchUsers`, `searchByTech`, `searchCoFounders`, `searchHiring`, `getUser`, `getUserRepos`, `handleApiError` |

### 11.3 Critical Test Cases

```js
// utils.test.js — key assertions
test('sanitize strips script tags', () => {
  expect(sanitize('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
});
test('sanitize returns empty string for null', () => {
  expect(sanitize(null)).toBe('');
});
test('formatNumber 1234 returns 1.2k', () => {
  expect(formatNumber(1234)).toBe('1.2k');
});
test('getMaxPages caps at 1000 results', () => {
  expect(getMaxPages(5000, 12)).toBe(84);  // Math.ceil(1000/12)
});
test('detectBioKeywords identifies co-founder', () => {
  expect(detectBioKeywords('I am a co-founder looking to build').isCoFounder).toBe(true);
});
test('toggleBookmark adds then removes', () => {
  toggleBookmark('torvalds');
  expect(isBookmarked('torvalds')).toBe(true);
  toggleBookmark('torvalds');
  expect(isBookmarked('torvalds')).toBe(false);
});

// api.test.js — always mock fetch
beforeEach(() => {
  global.fetch = jest.fn();
});
test('searchUsers calls correct URL', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    headers: { get: () => '60' },
    json: async () => ({ items: [], total_count: 0 }),
  });
  await searchUsers('Kenya', 1);
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining('location%3A%22Kenya%22'),
    expect.any(Object)
  );
});
```

---

## 12. GitHub Actions CI/CD

### 12.1 `.gitignore`

```
node_modules/
.env
.DS_Store
*.log
coverage/
dist/
.cache/
```

### 12.2 `deploy.yml`

```yaml
# .github/workflows/deploy.yml

name: Test and Deploy AfriDev Explorer

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  test:
    name: Run Jest Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test

  deploy:
    name: Deploy to GitHub Pages
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Required setup:** Repo → Settings → Pages → Source → **GitHub Actions**

---

## 13. Git Strategy

### 13.1 Branching

| Branch | Purpose |
|---|---|
| `main` | Production — live site deploys from here |
| `develop` | Integration branch — feature branches merge here first |
| `feat/navbar` | Individual features, named descriptively |
| `fix/avatar-fallback` | Bug fixes |

**Workflow:** `feat/xxx` → PR to `develop` → tests run → merge → PR `develop` to `main` → deploy.

### 13.2 Phase 1 Commit Roadmap (30 commits)

| # | Commit Message |
|---|---|
| 1 | `chore: initialize project structure and folder layout` |
| 2 | `chore: add gitignore for node_modules env files and OS artifacts` |
| 3 | `chore: add GitHub Actions test and deploy workflow` |
| 4 | `chore: configure Jest with ES module support in package.json` |
| 5 | `style: add CSS reset and root design tokens with dark mode variables` |
| 6 | `feat: build responsive navbar with hamburger dark mode toggle and rate limit bar` |
| 7 | `feat: build shared footer and keyboard shortcut modal` |
| 8 | `feat: create hero section with search bar and country filter pills` |
| 9 | `style: implement hero globe SVG animation with CSS keyframes` |
| 10 | `feat: implement GitHub API core fetch wrapper with rate limit parsing` |
| 11 | `feat: implement searchUsers searchByTech searchCoFounders searchHiring in api.js` |
| 12 | `feat: implement getUser getUserRepos getUserEvents searchRepos getRepoReadme` |
| 13 | `feat: add sanitize detectBioKeywords and XSS prevention utilities` |
| 14 | `feat: add formatNumber timeAgo getQueryParam debounce getMaxPages utilities` |
| 15 | `feat: add bookmark system with localStorage persistence and export` |
| 16 | `feat: add search history autocomplete with localStorage` |
| 17 | `feat: build developer card with badge system bookmark star and share button` |
| 18 | `feat: build repo card with language badge and README hover preview` |
| 19 | `feat: build activity card and skeleton loader and empty state components` |
| 20 | `feat: build pagination component with GitHub 1000 result cap` |
| 21 | `feat: wire up home page featured devs tech leaderboard and live feed` |
| 22 | `feat: implement Africa SVG map with country density colours and click filter` |
| 23 | `feat: build developers page with 4-tab architecture and shared state` |
| 24 | `feat: implement By Technology tab with language and framework pills` |
| 25 | `feat: implement Co-Founders and Hiring tabs with date range filter` |
| 26 | `feat: build repositories page with language pills sort and README preview` |
| 27 | `feat: build dynamic profile page with heatmap similar devs and actions` |
| 28 | `feat: build live activity feed page with 60s auto-refresh and event filter` |
| 29 | `feat: build about page and custom 404 page` |
| 30 | `test: write unit tests for api render and utils covering all functions` |

---

## 14. Local Development — Phase 1

### Prerequisites

- Node.js v18+ — `node --version`
- npm v9+ — `npm --version`
- VS Code (recommended) with "Live Server" extension

### Setup

```bash
# Clone and enter
git clone https://github.com/Mylesoft/afridev-explorer.git
cd afridev-explorer

# Install Jest (only dev dependency in Phase 1)
npm install

# Start local server (required for type="module" scripts)
npx live-server
# Opens at http://127.0.0.1:8080

# Alternatively (serves at http://localhost:3000)
npx serve .
```

### Run Tests

```bash
npm test                # run all tests once
npm run test:watch      # watch mode
npm run test:coverage   # coverage report
```

### Optional: GitHub Token for Higher Rate Limits

```bash
# Create .env (never commit this)
echo "GITHUB_TOKEN=ghp_your_token_here" > .env
```
Paste the token value directly into `api.js` locally when you hit rate limits during development. Remove it before committing.

---

## 15. Accessibility & Performance

### Accessibility Requirements

- All `img` elements: descriptive `alt` attribute — never empty on meaningful images
- All buttons: visible `:focus-visible` style — never `outline: none` without a replacement
- Hamburger button: `aria-label="Toggle navigation"` + `aria-expanded` updated by JS
- Tab bar: `role="tablist"`, each tab has `role="tab"` and `aria-selected`
- Results grid: `role="list"` with each card as `role="listitem"`
- Toasts: `role="alert"` for screen readers
- Colour contrast: WCAG AA minimum (4.5:1 normal text, 3:1 large text)
- Keyboard navigable: all interactive elements reachable via Tab, operable via Enter/Space
- `<noscript>` message on `profile.html` and `activity.html`
- Semantic HTML throughout: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`

### Performance Requirements

- Google Fonts: `display=swap` + `preconnect` hints
- API results: cached in `sessionStorage` with 5-minute TTL
- Avatar images: `loading="lazy"` on all `img` tags
- Search debounce: 500ms on all search inputs
- `IntersectionObserver` for lazy-loading the tech leaderboard and map sections
- Activity feed auto-refresh: 60-second interval, paused when page is hidden (`document.visibilityState`)
- Target page weight: under 500KB (excluding GitHub CDN avatar images)
- `<link rel="preconnect" href="https://api.github.com" />` in every `<head>`

---

## 16. Phase 1 Deliverables Checklist

### Setup
- [ ] `.gitignore` created before first `npm install`
- [ ] `package.json` with Jest ES module config
- [ ] `deploy.yml` in `.github/workflows/`
- [ ] `assets/` folder: `default-avatar.png`, `favicon.svg`, `favicon.png`, `og-image.png`, `africa-map.svg`

### Pages (7 total)
- [ ] `index.html` — all 10 sections present and functional
- [ ] `developers.html` — 4-tab layout with shared state
- [ ] `repositories.html` — language pills, sort, README preview
- [ ] `profile.html` — dynamic load, heatmap, similar devs
- [ ] `activity.html` — live feed with 60s refresh
- [ ] `about.html` — static content
- [ ] `404.html` — custom branded

### CSS (5 files)
- [ ] All 5 CSS files linked in correct order on every page
- [ ] Dark mode via `[data-theme="dark"]` with localStorage persistence
- [ ] All 4 badge types styled
- [ ] Africa map country density classes styled
- [ ] Tech leaderboard bars styled and animate on scroll
- [ ] Mobile responsive at 768px and 480px

### JavaScript
- [ ] `sanitize()` applied to all API strings in `render.js`
- [ ] All `img` tags have `onerror` fallback + `loading="lazy"`
- [ ] `utils.js` — all functions including `sanitize`, `detectBioKeywords`, `getMaxPages`, bookmarks, search history
- [ ] `api.js` — all 8 functions with centralised error handling and rate limit parsing
- [ ] `render.js` — all 7 render functions
- [ ] `theme.js` — dark mode toggle with localStorage
- [ ] `navbar.js` — hamburger, active link, keyboard shortcuts
- [ ] `developers.js` — 4-tab shared state architecture
- [ ] `activity.js` — 60s auto-refresh, pauses when hidden
- [ ] `profile.js` — redirects to 404 if `?user=` missing
- [ ] Pagination capped via `getMaxPages()`
- [ ] Rate limit bar updating in navbar
- [ ] Bookmarks: add, remove, export as JSON
- [ ] Search history: save, show on focus, max 10 items
- [ ] Similar Developers section on profile page
- [ ] Share button copies profile link to clipboard
- [ ] Keyboard shortcuts: `/`, `d`, `r`, `a`, `b`, `?`, `Escape`

### Tests
- [ ] `tests/utils.test.js` — 18+ tests passing
- [ ] `tests/render.test.js` — 10+ tests passing
- [ ] `tests/api.test.js` — 10+ tests passing
- [ ] `npm test` exits with code 0

### Git & Deployment
- [ ] 30 commits with conventional messages
- [ ] Working on `develop`, merging to `main` via PRs
- [ ] GitHub Pages live URL accessible
- [ ] GitHub Actions green tick on latest `main` push
- [ ] `README.md` complete

---
---

# PHASE 2 — COMMUNITY
## Convex Backend · WorkOS Auth · Profiles · Job Board · Co-Founder Board

---

## 17. Phase 2 Overview

### What Changes in Phase 2

Phase 2 introduces a real backend and real user accounts. The site transitions from a static GitHub browser into a community platform where developers can create profiles, post skills, find jobs, and connect with co-founders.

### New Capabilities

| Capability | Technology |
|---|---|
| User authentication | WorkOS AuthKit |
| Real-time database | Convex |
| File storage | Convex file storage |
| Realtime updates | Convex subscriptions |
| Server-side functions | Convex queries, mutations, actions |

### Phase 2 Pages Added

| Page | File | Purpose |
|---|---|---|
| Sign Up / Sign In | `/auth/login.html` | WorkOS-powered authentication |
| Dashboard | `/dashboard/index.html` | Authenticated developer dashboard |
| Edit Profile | `/dashboard/profile.html` | Create and edit AfriDev profile |
| Job Board | `jobs.html` | Browse and post job listings |
| Post a Job | `/dashboard/post-job.html` | Employer: create a job listing |
| Co-Founder Board | `cofounders.html` | Browse and post co-founder requests |
| Post Co-Founder Request | `/dashboard/post-cofounder.html` | Developer: create co-founder listing |
| Community Feed | `community.html` | Short-form developer posts |
| Bookmarks (auth) | `/dashboard/bookmarks.html` | Saved developers and jobs (synced to Convex) |

---

## 18. Architecture Decision — Phase 2

### Hosting Changes

Phase 2 can no longer be served purely from GitHub Pages because Convex requires calling a real backend. Options:

| Host | Cost | Notes |
|---|---|---|
| **Vercel** (recommended) | Free tier generous | Automatic deploys from GitHub, env vars supported, custom domain |
| **Netlify** | Free tier generous | Similar to Vercel, good for static + functions |
| GitHub Pages | Still free | Works for static pages, but cannot securely call Convex from sensitive operations |

**Decision: Deploy to Vercel.** Keep GitHub Actions for running tests. Add Vercel deployment step or connect Vercel's GitHub integration for auto-deploy.

### Data Flow — Phase 2

```
Browser
  │
  ├──▶ GitHub REST API (public data — still used)
  │
  └──▶ Convex Backend
        ├── Convex Queries (read data, realtime subscribed)
        ├── Convex Mutations (write data)
        └── Convex Actions (call external APIs server-side, send emails)
              │
              └──▶ WorkOS AuthKit (verify session tokens)
```

---

## 19. Tech Stack — Phase 2

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| All of Phase 1 | — | — | Everything from Phase 1 carries forward |
| Backend | Convex | Latest | Real-time database, server functions, file storage |
| Auth | WorkOS AuthKit | Latest | User authentication, session management |
| Deployment | Vercel | — | Hosting with environment variables |
| Email | WorkOS (built-in) OR Resend | — | Auth emails. Resend for custom notifications in Phase 3 |

---

## 20. Convex Backend — Schema & Data Model

### 20.1 Setup

```bash
# Install Convex
npm install convex

# Initialise Convex project
npx convex dev   # connects to Convex cloud, creates convex/ directory
```

This creates:
```
afridev-explorer/
├── convex/
│   ├── _generated/          # auto-generated, never edit manually
│   ├── schema.ts            # database schema
│   ├── users.ts             # user queries and mutations
│   ├── profiles.ts          # developer profile functions
│   ├── jobs.ts              # job board functions
│   ├── cofounders.ts        # co-founder board functions
│   ├── posts.ts             # community feed functions
│   ├── bookmarks.ts         # bookmark functions
│   └── notifications.ts     # notification functions
```

### 20.2 Full Schema — `convex/schema.ts`

```typescript
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({

  // ─── Users ────────────────────────────────────────────────────
  users: defineTable({
    workosUserId:   v.string(),           // WorkOS user ID (primary external key)
    email:          v.string(),
    name:           v.string(),
    username:       v.string(),           // unique slug, used in URLs
    avatarUrl:      v.optional(v.string()),
    role:           v.union(             // account type
      v.literal('developer'),
      v.literal('employer'),
      v.literal('admin')
    ),
    githubUsername: v.optional(v.string()),
    isVerified:     v.boolean(),          // email or domain verified
    createdAt:      v.number(),           // Unix timestamp
    lastActiveAt:   v.number(),
  })
  .index('by_workos_id',  ['workosUserId'])
  .index('by_username',   ['username'])
  .index('by_email',      ['email']),

  // ─── Developer Profiles ───────────────────────────────────────
  developerProfiles: defineTable({
    userId:           v.id('users'),
    headline:         v.string(),         // 150-char elevator pitch
    bio:              v.optional(v.string()),
    location:         v.optional(v.string()),
    country:          v.optional(v.string()),  // ISO 3166-1 alpha-2
    skills:           v.array(v.string()),     // self-reported tech skills
    languages:        v.array(v.string()),     // spoken languages
    availabilityStatus: v.union(
      v.literal('open_to_work'),
      v.literal('freelance'),
      v.literal('co_founder'),
      v.literal('hiring'),
      v.literal('not_available')
    ),
    preferredWorkType: v.union(
      v.literal('remote'), v.literal('hybrid'), v.literal('onsite'), v.literal('any')
    ),
    hourlyRateMin:    v.optional(v.number()),  // USD
    hourlyRateMax:    v.optional(v.number()),  // USD
    salaryExpMin:     v.optional(v.number()),  // USD/year
    salaryExpMax:     v.optional(v.number()),  // USD/year
    portfolioUrl:     v.optional(v.string()),
    websiteUrl:       v.optional(v.string()),
    linkedinUrl:      v.optional(v.string()),
    twitterUrl:       v.optional(v.string()),
    cvStorageId:      v.optional(v.id('_storage')),   // Convex file storage
    isPublic:         v.boolean(),
    updatedAt:        v.number(),
  })
  .index('by_user',          ['userId'])
  .index('by_country',       ['country'])
  .index('by_availability',  ['availabilityStatus'])
  .index('by_updated',       ['updatedAt']),

  // ─── Skill Endorsements ───────────────────────────────────────
  endorsements: defineTable({
    fromUserId:   v.id('users'),          // who gave the endorsement
    toUserId:     v.id('users'),          // who received it
    skill:        v.string(),             // the skill being endorsed
    createdAt:    v.number(),
  })
  .index('by_recipient',         ['toUserId'])
  .index('by_recipient_skill',   ['toUserId', 'skill']),

  // ─── Job Listings ─────────────────────────────────────────────
  jobs: defineTable({
    employerId:     v.id('users'),
    title:          v.string(),
    company:        v.string(),
    companyLogoId:  v.optional(v.id('_storage')),
    description:    v.string(),           // markdown
    requirements:   v.array(v.string()),
    techStack:      v.array(v.string()),
    jobType:        v.union(
      v.literal('full_time'), v.literal('part_time'),
      v.literal('contract'),  v.literal('internship')
    ),
    workType:       v.union(
      v.literal('remote'), v.literal('hybrid'), v.literal('onsite')
    ),
    location:       v.optional(v.string()),
    country:        v.optional(v.string()),
    salaryMin:      v.optional(v.number()),
    salaryMax:      v.optional(v.number()),
    salaryCurrency: v.optional(v.string()),
    applyUrl:       v.optional(v.string()),  // external apply link
    deadline:       v.optional(v.number()),  // Unix timestamp
    status:         v.union(
      v.literal('pending'),   // awaiting admin approval
      v.literal('active'),
      v.literal('closed'),
      v.literal('rejected')
    ),
    viewCount:      v.number(),
    createdAt:      v.number(),
    updatedAt:      v.number(),
  })
  .index('by_employer',  ['employerId'])
  .index('by_status',    ['status'])
  .index('by_country',   ['country'])
  .index('by_created',   ['createdAt']),

  // ─── Job Applications ─────────────────────────────────────────
  applications: defineTable({
    jobId:       v.id('jobs'),
    applicantId: v.id('users'),
    coverNote:   v.optional(v.string()),   // short cover note
    cvStorageId: v.optional(v.id('_storage')),
    status:      v.union(
      v.literal('applied'),
      v.literal('shortlisted'),
      v.literal('interviewing'),
      v.literal('offered'),
      v.literal('rejected')
    ),
    createdAt:   v.number(),
  })
  .index('by_job',       ['jobId'])
  .index('by_applicant', ['applicantId']),

  // ─── Co-Founder Listings ──────────────────────────────────────
  cofounderListings: defineTable({
    authorId:          v.id('users'),
    title:             v.string(),          // e.g. "Looking for CTO co-founder"
    description:       v.string(),          // what you're building
    stage:             v.union(
      v.literal('idea'), v.literal('prototype'),
      v.literal('mvp'),  v.literal('revenue')
    ),
    skillsNeeded:      v.array(v.string()),
    equityOffered:     v.optional(v.string()),  // e.g. "20-30%"
    commitment:        v.union(
      v.literal('full_time'), v.literal('part_time'), v.literal('evenings')
    ),
    location:          v.optional(v.string()),
    country:           v.optional(v.string()),
    contactPreference: v.union(
      v.literal('platform'), v.literal('email'), v.literal('whatsapp')
    ),
    status:            v.union(v.literal('open'), v.literal('closed')),
    viewCount:         v.number(),
    createdAt:         v.number(),
  })
  .index('by_author',  ['authorId'])
  .index('by_status',  ['status'])
  .index('by_country', ['country'])
  .index('by_created', ['createdAt']),

  // ─── Community Posts ──────────────────────────────────────────
  posts: defineTable({
    authorId:  v.id('users'),
    content:   v.string(),               // max 500 chars
    hashtags:  v.array(v.string()),      // extracted from content
    postType:  v.union(
      v.literal('general'), v.literal('question'), v.literal('job'),
      v.literal('event'),   v.literal('win'),       v.literal('looking_to_build')
    ),
    likeCount:    v.number(),
    commentCount: v.number(),
    createdAt:    v.number(),
    updatedAt:    v.number(),
  })
  .index('by_author',   ['authorId'])
  .index('by_created',  ['createdAt'])
  .index('by_hashtag',  ['hashtags']),

  // ─── Post Likes ───────────────────────────────────────────────
  postLikes: defineTable({
    postId:    v.id('posts'),
    userId:    v.id('users'),
    createdAt: v.number(),
  })
  .index('by_post',            ['postId'])
  .index('by_post_and_user',   ['postId', 'userId']),

  // ─── Post Comments ────────────────────────────────────────────
  postComments: defineTable({
    postId:    v.id('posts'),
    authorId:  v.id('users'),
    content:   v.string(),
    createdAt: v.number(),
  })
  .index('by_post',    ['postId'])
  .index('by_created', ['createdAt']),

  // ─── Bookmarks ────────────────────────────────────────────────
  bookmarks: defineTable({
    userId:       v.id('users'),
    itemType:     v.union(
      v.literal('developer'), v.literal('job'),
      v.literal('cofounder'), v.literal('post')
    ),
    itemId:       v.string(),    // github username OR Convex document ID
    createdAt:    v.number(),
  })
  .index('by_user',           ['userId'])
  .index('by_user_and_type',  ['userId', 'itemType'])
  .index('by_user_and_item',  ['userId', 'itemId']),

  // ─── Notifications ────────────────────────────────────────────
  notifications: defineTable({
    userId:     v.id('users'),          // recipient
    type:       v.string(),             // 'endorsement' | 'job_match' | 'message' etc.
    title:      v.string(),
    body:       v.string(),
    actionUrl:  v.optional(v.string()),
    isRead:     v.boolean(),
    createdAt:  v.number(),
  })
  .index('by_user',          ['userId'])
  .index('by_user_unread',   ['userId', 'isRead']),

});
```

---

## 21. WorkOS Authentication

### 21.1 Setup

```bash
npm install @workos-inc/authkit-js
```

### 21.2 WorkOS Dashboard Configuration

1. Go to [workos.com](https://workos.com) → Create an account
2. Create a new application: "AfriDev Explorer"
3. Under **AuthKit** → Enable Email + Password and Social (GitHub OAuth)
4. Set **Redirect URI:** `https://afridev-explorer.vercel.app/auth/callback.html`
5. Set **Sign-in URL:** `https://afridev-explorer.vercel.app/auth/login.html`
6. Copy: `WORKOS_CLIENT_ID` and `WORKOS_API_KEY` to environment variables

### 21.3 Auth Flow

```
User clicks "Sign Up" / "Sign In"
    │
    ▼
WorkOS AuthKit hosted UI (or embedded)
    │
    ▼ (on success)
Redirect to /auth/callback.html?code=XXX
    │
    ▼
callback.html exchanges code for session token (server-side via Convex Action)
    │
    ▼
Session token stored in httpOnly cookie (or sessionStorage for SPA)
    │
    ▼
User redirected to /dashboard/index.html
    │
    ▼
Every subsequent request to Convex includes the session token in headers
Convex Actions verify token with WorkOS before executing mutations
```

### 21.4 `auth/login.html`

```html
<!-- auth/login.html -->
<!-- WorkOS AuthKit renders the sign-in form automatically -->
<div id="authkit-container"></div>
<script type="module">
  import { createClient } from '@workos-inc/authkit-js';

  const client = createClient(import.meta.env.VITE_WORKOS_CLIENT_ID);
  const user   = await client.getUser();

  if (user) {
    // Already signed in — redirect to dashboard
    window.location.href = '/dashboard/index.html';
  } else {
    await client.signIn({
      container: '#authkit-container',
      onSuccess: () => { window.location.href = '/dashboard/index.html'; },
    });
  }
</script>
```

### 21.5 Session Verification in Convex

Every Convex mutation that requires authentication uses a context helper:

```typescript
// convex/lib/auth.ts
import { QueryCtx, MutationCtx } from './_generated/server';

export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Not authenticated');

  const user = await ctx.db
    .query('users')
    .withIndex('by_workos_id', q => q.eq('workosUserId', identity.subject))
    .unique();

  if (!user) throw new Error('User profile not found');
  return user;
}
```

---

## 22. File & Folder Structure — Phase 2

Phase 2 adds to the Phase 1 structure. New directories and files only:

```
afridev-explorer/
│
├── convex/                         # NEW — Convex backend
│   ├── _generated/                 # auto-generated, never edit
│   ├── schema.ts                   # full schema (Section 20.2)
│   ├── lib/
│   │   └── auth.ts                 # requireAuth helper
│   ├── users.ts                    # user CRUD
│   ├── profiles.ts                 # developer profile CRUD
│   ├── jobs.ts                     # job board CRUD
│   ├── cofounders.ts               # co-founder board CRUD
│   ├── posts.ts                    # community feed CRUD
│   ├── bookmarks.ts                # bookmark CRUD
│   └── notifications.ts            # notification CRUD
│
├── auth/                           # NEW — auth pages
│   ├── login.html                  # WorkOS sign-in page
│   ├── callback.html               # OAuth callback handler
│   └── logout.html                 # Sign out + redirect
│
├── dashboard/                      # NEW — authenticated pages
│   ├── index.html                  # Developer dashboard home
│   ├── profile.html                # Edit AfriDev profile
│   ├── post-job.html               # Employer: create job listing
│   ├── post-cofounder.html         # Developer: create co-founder listing
│   └── bookmarks.html              # Saved items (synced to Convex)
│
├── jobs.html                       # NEW — public job board
├── cofounders.html                 # NEW — public co-founder board
├── community.html                  # NEW — public community feed
│
└── js/
    ├── convex-client.js            # NEW — Convex client singleton
    ├── auth.js                     # NEW — WorkOS auth helpers
    ├── dashboard.js                # NEW — dashboard page logic
    ├── edit-profile.js             # NEW — profile edit form logic
    ├── jobs.js                     # NEW — job board page logic
    ├── post-job.js                 # NEW — job posting form logic
    ├── cofounders-page.js          # NEW — co-founder board logic
    ├── community.js                # NEW — community feed logic
    └── bookmarks-page.js           # NEW — bookmarks page logic
```

---

## 23. Convex Functions Reference

### 23.1 `convex/users.ts`

```typescript
// Create or update user on first login
export const upsertUser = mutation({
  args: {
    workosUserId: v.string(),
    email:        v.string(),
    name:         v.string(),
    username:     v.string(),
    role:         v.union(v.literal('developer'), v.literal('employer')),
    avatarUrl:    v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('users')
      .withIndex('by_workos_id', q => q.eq('workosUserId', args.workosUserId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { lastActiveAt: Date.now() });
      return existing._id;
    }
    return await ctx.db.insert('users', {
      ...args, isVerified: false,
      createdAt: Date.now(), lastActiveAt: Date.now(),
    });
  },
});

// Get current user
export const getMe = query({
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    return user;
  },
});
```

### 23.2 `convex/profiles.ts`

```typescript
// Get developer profile by userId
export const getProfile = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return ctx.db.query('developerProfiles')
      .withIndex('by_user', q => q.eq('userId', userId))
      .unique();
  },
});

// List public profiles with filters
export const listProfiles = query({
  args: {
    country:            v.optional(v.string()),
    availabilityStatus: v.optional(v.string()),
    skill:              v.optional(v.string()),
    cursor:             v.optional(v.string()),
    limit:              v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query('developerProfiles')
      .withIndex('by_updated')
      .filter(q => q.eq(q.field('isPublic'), true));
    if (args.country) {
      q = q.filter(q => q.eq(q.field('country'), args.country));
    }
    // paginate
    return q.paginate({ cursor: args.cursor ?? null, numItems: args.limit ?? 12 });
  },
});

// Create or update developer profile
export const upsertProfile = mutation({
  args: {
    headline:           v.string(),
    bio:                v.optional(v.string()),
    location:           v.optional(v.string()),
    country:            v.optional(v.string()),
    skills:             v.array(v.string()),
    languages:          v.array(v.string()),
    availabilityStatus: v.string(),
    preferredWorkType:  v.string(),
    hourlyRateMin:      v.optional(v.number()),
    hourlyRateMax:      v.optional(v.number()),
    portfolioUrl:       v.optional(v.string()),
    websiteUrl:         v.optional(v.string()),
    linkedinUrl:        v.optional(v.string()),
    twitterUrl:         v.optional(v.string()),
    isPublic:           v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const existing = await ctx.db.query('developerProfiles')
      .withIndex('by_user', q => q.eq('userId', user._id))
      .unique();
    const data = { ...args, userId: user._id, updatedAt: Date.now() };
    if (existing) return ctx.db.patch(existing._id, data);
    return ctx.db.insert('developerProfiles', data);
  },
});

// Upload CV
export const generateCvUploadUrl = mutation({
  handler: async (ctx) => {
    await requireAuth(ctx);
    return ctx.storage.generateUploadUrl();
  },
});

export const saveCvStorageId = mutation({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, { storageId }) => {
    const user = await requireAuth(ctx);
    const profile = await ctx.db.query('developerProfiles')
      .withIndex('by_user', q => q.eq('userId', user._id))
      .unique();
    if (profile) await ctx.db.patch(profile._id, { cvStorageId: storageId });
  },
});
```

### 23.3 `convex/jobs.ts`

```typescript
// List active jobs with filters
export const listJobs = query({
  args: {
    country:   v.optional(v.string()),
    techStack: v.optional(v.string()),
    workType:  v.optional(v.string()),
    jobType:   v.optional(v.string()),
    cursor:    v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query('jobs')
      .withIndex('by_created')
      .filter(q => q.eq(q.field('status'), 'active'));
    if (args.country)  q = q.filter(q => q.eq(q.field('country'), args.country));
    if (args.workType) q = q.filter(q => q.eq(q.field('workType'), args.workType));
    return q.paginate({ cursor: args.cursor ?? null, numItems: 12 });
  },
});

// Create job listing (employers only)
export const createJob = mutation({
  args: {
    title:       v.string(),
    company:     v.string(),
    description: v.string(),
    requirements:v.array(v.string()),
    techStack:   v.array(v.string()),
    jobType:     v.string(),
    workType:    v.string(),
    location:    v.optional(v.string()),
    country:     v.optional(v.string()),
    salaryMin:   v.optional(v.number()),
    salaryMax:   v.optional(v.number()),
    applyUrl:    v.optional(v.string()),
    deadline:    v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    if (user.role !== 'employer' && user.role !== 'admin') {
      throw new Error('Only employers can post jobs');
    }
    return ctx.db.insert('jobs', {
      ...args, employerId: user._id,
      status: 'pending',  // admin must approve before going live
      viewCount: 0,
      salaryCurrency: 'USD',
      createdAt: Date.now(), updatedAt: Date.now(),
    });
  },
});

// Increment view count
export const incrementJobView = mutation({
  args: { jobId: v.id('jobs') },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.db.get(jobId);
    if (job) await ctx.db.patch(jobId, { viewCount: job.viewCount + 1 });
  },
});

// Apply to job (sends CV from profile)
export const applyToJob = mutation({
  args: { jobId: v.id('jobs'), coverNote: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    // Check not already applied
    const existing = await ctx.db.query('applications')
      .withIndex('by_applicant', q => q.eq('applicantId', user._id))
      .filter(q => q.eq(q.field('jobId'), args.jobId))
      .unique();
    if (existing) throw new Error('Already applied to this job');
    // Get CV from profile
    const profile = await ctx.db.query('developerProfiles')
      .withIndex('by_user', q => q.eq('userId', user._id))
      .unique();
    return ctx.db.insert('applications', {
      jobId: args.jobId,
      applicantId: user._id,
      coverNote: args.coverNote,
      cvStorageId: profile?.cvStorageId,
      status: 'applied',
      createdAt: Date.now(),
    });
  },
});
```

### 23.4 `convex/cofounders.ts`

```typescript
// List open co-founder listings
export const listListings = query({
  args: {
    stage:   v.optional(v.string()),
    country: v.optional(v.string()),
    cursor:  v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query('cofounderListings')
      .withIndex('by_created')
      .filter(q => q.eq(q.field('status'), 'open'));
    if (args.country) q = q.filter(q => q.eq(q.field('country'), args.country));
    if (args.stage)   q = q.filter(q => q.eq(q.field('stage'), args.stage));
    return q.paginate({ cursor: args.cursor ?? null, numItems: 12 });
  },
});

// Create co-founder listing
export const createListing = mutation({
  args: {
    title:             v.string(),
    description:       v.string(),
    stage:             v.string(),
    skillsNeeded:      v.array(v.string()),
    equityOffered:     v.optional(v.string()),
    commitment:        v.string(),
    location:          v.optional(v.string()),
    country:           v.optional(v.string()),
    contactPreference: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    return ctx.db.insert('cofounderListings', {
      ...args, authorId: user._id,
      status: 'open', viewCount: 0, createdAt: Date.now(),
    });
  },
});
```

### 23.5 `convex/posts.ts`

```typescript
// List community posts (realtime subscription)
export const listPosts = query({
  args: { cursor: v.optional(v.string()), postType: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let q = ctx.db.query('posts').withIndex('by_created').order('desc');
    if (args.postType) q = q.filter(q => q.eq(q.field('postType'), args.postType));
    return q.paginate({ cursor: args.cursor ?? null, numItems: 20 });
  },
});

// Create post
export const createPost = mutation({
  args: { content: v.string(), postType: v.string() },
  handler: async (ctx, args) => {
    if (args.content.length > 500) throw new Error('Post exceeds 500 characters');
    const user = await requireAuth(ctx);
    // Extract hashtags from content
    const hashtags = [...args.content.matchAll(/#(\w+)/g)].map(m => m[1].toLowerCase());
    return ctx.db.insert('posts', {
      ...args, authorId: user._id,
      hashtags, likeCount: 0, commentCount: 0,
      createdAt: Date.now(), updatedAt: Date.now(),
    });
  },
});

// Like / unlike post
export const toggleLike = mutation({
  args: { postId: v.id('posts') },
  handler: async (ctx, { postId }) => {
    const user = await requireAuth(ctx);
    const existing = await ctx.db.query('postLikes')
      .withIndex('by_post_and_user', q => q.eq('postId', postId).eq('userId', user._id))
      .unique();
    const post = await ctx.db.get(postId);
    if (!post) throw new Error('Post not found');
    if (existing) {
      await ctx.db.delete(existing._id);
      await ctx.db.patch(postId, { likeCount: Math.max(0, post.likeCount - 1) });
    } else {
      await ctx.db.insert('postLikes', { postId, userId: user._id, createdAt: Date.now() });
      await ctx.db.patch(postId, { likeCount: post.likeCount + 1 });
    }
  },
});
```

### 23.6 `convex/bookmarks.ts`

```typescript
// Toggle bookmark
export const toggleBookmark = mutation({
  args: {
    itemType: v.string(),
    itemId:   v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const existing = await ctx.db.query('bookmarks')
      .withIndex('by_user_and_item', q => q.eq('userId', user._id).eq('itemId', args.itemId))
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    } else {
      await ctx.db.insert('bookmarks', {
        ...args, userId: user._id, createdAt: Date.now(),
      });
      return true;
    }
  },
});

// Get user's bookmarks by type
export const getBookmarks = query({
  args: { itemType: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    let q = ctx.db.query('bookmarks').withIndex('by_user', q => q.eq('userId', user._id));
    if (args.itemType) {
      q = q.filter(q => q.eq(q.field('itemType'), args.itemType));
    }
    return q.collect();
  },
});
```

### 23.7 `convex/notifications.ts`

```typescript
// Get unread notifications for current user (realtime)
export const getUnread = query({
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    return ctx.db.query('notifications')
      .withIndex('by_user_unread', q => q.eq('userId', user._id).eq('isRead', false))
      .order('desc')
      .take(20);
  },
});

// Mark all as read
export const markAllRead = mutation({
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    const unread = await ctx.db.query('notifications')
      .withIndex('by_user_unread', q => q.eq('userId', user._id).eq('isRead', false))
      .collect();
    await Promise.all(unread.map(n => ctx.db.patch(n._id, { isRead: true })));
  },
});

// Create notification (called internally from other mutations)
export const createNotification = internalMutation({
  args: {
    userId:    v.id('users'),
    type:      v.string(),
    title:     v.string(),
    body:      v.string(),
    actionUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('notifications', {
      ...args, isRead: false, createdAt: Date.now(),
    });
  },
});
```

---

## 24. Page Specifications — Phase 2

### 24.1 `jobs.html` — Public Job Board

```
[Page Header: "African Tech Jobs"]
[Filter Bar: Country | Tech Stack | Work Type (Remote/Hybrid/Onsite) | Job Type | Salary Range]
[Results: Job cards]
[Load More button (Convex pagination cursor)]
```

**Job Card Contains:**
- Company logo + company name + verified badge
- Job title + location + work type badge
- Tech stack tags
- Salary range (if provided) + currency
- Posted date + deadline (if set)
- "Apply Now" button → external URL or in-app apply if user is authenticated
- Bookmark star (authenticated users only)

**Auth Gate:** Applying to a job requires authentication. "Apply Now" for guests → redirect to sign-in.

### 24.2 `/dashboard/post-job.html` — Post a Job

Only accessible to `employer` role accounts. Form fields map exactly to the `jobs` table schema.

**Validation:**
- Title: 10–100 characters
- Description: 100–5000 characters, Markdown supported
- At least one tech stack tag
- If applyUrl provided: must be a valid URL
- Company name: required

On submit → `createJob` mutation → job enters `pending` status → admin approves before it goes live.

### 24.3 `cofounders.html` — Co-Founder Board

```
[Page Header: "Find Your Co-Founder"]
[Filter Bar: Stage | Country | Skills Needed | Commitment Level]
[Results: Co-Founder listing cards]
```

**Listing Card Contains:**
- Author avatar + name
- Title (e.g. "Looking for CTO, building fintech for East Africa")
- Stage badge: Idea / Prototype / MVP / Revenue
- Skills Needed tags
- Equity Offered (if shown)
- Commitment level
- "I'm Interested" button → authenticated only → sends platform notification to author

### 24.4 `community.html` — Community Feed

```
[New Post Box (authenticated users) — 500 char limit + Post Type selector]
[Post Type Filters: All | Questions | Looking to Build | Events | Wins | Jobs]
[Posts Feed — realtime via Convex subscription]
```

**Post Contains:**
- Author avatar + name + role badge
- Post content with hashtag links (#ReactKE, #NairobiDevs)
- Post type badge
- Like button + count
- Comment count → click to expand comments
- Timestamp via `timeAgo()`

**Realtime:** Use Convex `useQuery` equivalent in vanilla JS — poll `listPosts` every 10 seconds for new posts and prepend to top. (Full WebSocket subscription available in Phase 3 with a bundler.)

### 24.5 `/dashboard/index.html` — Developer Dashboard

Requires authentication. Redirects to `auth/login.html` if not signed in.

**Sections:**
- Welcome header with user name and avatar
- Profile completion progress bar (% of profile fields filled)
- Quick stats: Applications sent · Jobs saved · Posts made · Endorsements received
- Quick links: Edit Profile · View My Profile · Post to Community · Browse Jobs
- Recent notifications (last 5, unread highlighted)
- Recent activity: applications, posts, bookmarks

---

## 25. Developer Profile System

### 25.1 Profile Edit Form — `dashboard/profile.html`

Uses `upsertProfile` mutation. All fields are optional except `headline` and `availabilityStatus`.

**Form Sections:**

1. **Identity** — headline (150 chars, required), bio (500 chars)
2. **Location** — location text, country dropdown (54 African nations)
3. **Availability** — status dropdown + work type toggle
4. **Skills** — tag input (type skill, press Enter to add, max 20)
5. **Spoken Languages** — multi-select (English, French, Swahili, Arabic, Amharic, Portuguese, Hausa, Yoruba, Igbo, Zulu, other)
6. **Compensation** — hourly rate range + annual salary range (both optional, private by default)
7. **Links** — portfolio, website, LinkedIn, Twitter/X
8. **CV Upload** — PDF upload via Convex `generateUploadUrl()` + `saveCvStorageId()`
9. **Visibility** — toggle: Public / Private (private profiles won't appear in search)

### 25.2 CV Upload Flow

```js
// edit-profile.js
async function uploadCv(file) {
  // Step 1: Get upload URL from Convex
  const uploadUrl = await convex.mutation('profiles:generateCvUploadUrl');

  // Step 2: PUT file directly to Convex storage
  const result = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  const { storageId } = await result.json();

  // Step 3: Save storageId to profile
  await convex.mutation('profiles:saveCvStorageId', { storageId });
}
```

### 25.3 Skill Endorsements

On any public developer profile page, authenticated users see an "Endorse" button next to each listed skill.

- Clicking endorse calls `endorseSkill(toUserId, skill)` mutation
- Cannot endorse your own skills
- Cannot endorse the same skill twice
- Endorsement count shown as a small badge: `Python (12 endorsements)`
- Endorsing creates a notification for the recipient

---

## 26. Employer Accounts & Job Board

### 26.1 Employer Signup

During sign-up, users choose: "I'm a Developer" or "I'm an Employer / Recruiter". This sets `role` to `developer` or `employer` in the `users` table.

Employers must also provide:
- Company name
- Company website
- Work email (must match company domain — validated server-side)

### 26.2 Job Approval Flow

1. Employer creates job → `status: 'pending'`
2. Admin receives notification in their dashboard
3. Admin reviews and approves → `status: 'active'`
4. Employer notified when job goes live
5. Job automatically expires after `deadline` date (Convex scheduled function in Phase 3)

### 26.3 Apply to Job — In-App Application

When a developer clicks "Apply" on a job:
1. Auth check — if not signed in, redirect to login
2. `applyToJob` mutation runs — creates application record
3. Developer's CV (from profile) is attached automatically
4. Employer receives notification: "New application for [Job Title]"
5. Developer sees application status in their dashboard

---

## 27. Co-Founder Board

### 27.1 Matching Logic (Simple — Phase 2)

After a user saves their `skillsNeeded` on a co-founder listing, the system scores other developers:

```typescript
// convex/cofounders.ts — internal match scorer
function scoreMatch(listing: CofounderListing, profile: DeveloperProfile): number {
  const skillOverlap = listing.skillsNeeded.filter(s => profile.skills.includes(s)).length;
  const locationMatch = listing.country === profile.country ? 1 : 0;
  return (skillOverlap * 2) + locationMatch;
}
```

"Suggested Matches" section shows on each co-founder listing — top 3 developers with `availabilityStatus === 'co_founder'` scored by `scoreMatch`.

---

## 28. Community Feed

### 28.1 Hashtag System

Hashtags extracted automatically from post content via regex: `/#(\w+)/g`

Clicking a hashtag in any post filters the feed to show only posts with that hashtag. Hashtag filter adds `?tag=nairobidevs` to the URL — shareable links.

### 28.2 Post Character Counter

```html
<textarea id="post-content" maxlength="500" placeholder="What are you building?"></textarea>
<span id="char-count">0 / 500</span>
```

```js
document.getElementById('post-content').addEventListener('input', (e) => {
  document.getElementById('char-count').textContent = `${e.target.value.length} / 500`;
});
```

---

## 29. Bookmarks & Saved Items

Phase 2 bookmarks are stored in Convex (synced across devices) instead of just `localStorage`. The `toggleBookmark` mutation handles add/remove. The `getBookmarks` query is subscribed realtime.

**Bookmark Types:**

| Type | Item | What's Stored |
|---|---|---|
| `developer` | GitHub profile | GitHub username string |
| `job` | Job listing | Convex `jobs` document ID |
| `cofounder` | Co-founder listing | Convex `cofounderListings` document ID |
| `post` | Community post | Convex `posts` document ID |

---

## 30. Notifications System — Phase 2

### Notification Types

| Type | Triggered When |
|---|---|
| `endorsement` | Someone endorses your skill |
| `job_match` | A new job matches your listed skills |
| `cofounder_interest` | Someone expresses interest in your co-founder listing |
| `application_update` | Your job application status changes |
| `new_follower` | Someone bookmarks your developer profile |
| `post_like` | Someone likes your community post |
| `post_comment` | Someone comments on your community post |

### Notification Bell UI

```html
<button class="notification-bell" aria-label="Notifications">
  🔔
  <span class="notification-badge" id="notif-count" hidden>0</span>
</button>
```

Unread count badge polls `getUnread` every 30 seconds. Clicking the bell opens a dropdown panel showing the last 10 notifications.

---

## 31. Unit Testing — Phase 2

Phase 2 adds tests for Convex functions. Use Convex's built-in test utilities:

```bash
npm install --save-dev @convex-dev/test
```

```typescript
// tests/convex/jobs.test.ts
import { convexTest } from '@convex-dev/test';
import schema from '../convex/schema';

test('createJob requires employer role', async () => {
  const t = convexTest(schema);
  // Create a developer user
  const devUser = await t.run(async (ctx) => {
    return ctx.db.insert('users', {
      workosUserId: 'dev1', email: 'dev@test.com',
      name: 'Dev User', username: 'devuser', role: 'developer',
      isVerified: false, createdAt: Date.now(), lastActiveAt: Date.now(),
    });
  });
  // Attempt to create job as developer — should throw
  await expect(
    t.mutation('jobs:createJob', {
      title: 'Test Job', company: 'Test Co', description: 'A job',
      requirements: [], techStack: ['JS'], jobType: 'full_time', workType: 'remote',
    })
  ).rejects.toThrow('Only employers can post jobs');
});
```

---

## 32. Deployment — Phase 2

### Environment Variables (Vercel)

```
VITE_CONVEX_URL=https://your-project.convex.cloud
VITE_WORKOS_CLIENT_ID=client_XXXXXXXX
WORKOS_API_KEY=sk_XXXXXXXX                 # server-side only, never exposed to client
```

### Vercel Setup

1. Import GitHub repo into Vercel
2. Add all environment variables in Vercel Dashboard → Project → Settings → Environment Variables
3. Set **Root Directory** to `/` (project root)
4. Build command: `npm run build` (or leave empty for static)
5. Output directory: `.` (root, since it's static HTML)

### GitHub Actions — Phase 2 Update

Add a test step for Convex functions alongside the existing Jest tests:

```yaml
- name: Run frontend tests
  run: npm test

- name: Run Convex tests
  run: npx convex test
  env:
    CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
```

---

## 33. Phase 2 Deliverables Checklist

### Backend (Convex)
- [ ] `convex/schema.ts` — all 12 tables defined with correct indexes
- [ ] `convex/users.ts` — `upsertUser`, `getMe`
- [ ] `convex/profiles.ts` — `getProfile`, `listProfiles`, `upsertProfile`, `generateCvUploadUrl`, `saveCvStorageId`
- [ ] `convex/jobs.ts` — `listJobs`, `createJob`, `incrementJobView`, `applyToJob`
- [ ] `convex/cofounders.ts` — `listListings`, `createListing`
- [ ] `convex/posts.ts` — `listPosts`, `createPost`, `toggleLike`
- [ ] `convex/bookmarks.ts` — `toggleBookmark`, `getBookmarks`
- [ ] `convex/notifications.ts` — `getUnread`, `markAllRead`, `createNotification`

### Auth (WorkOS)
- [ ] `auth/login.html` — WorkOS AuthKit embedded sign-in
- [ ] `auth/callback.html` — OAuth code exchange
- [ ] `auth/logout.html` — session destruction + redirect
- [ ] `requireAuth` helper in `convex/lib/auth.ts`

### Pages
- [ ] `jobs.html` — public job board with filters
- [ ] `cofounders.html` — public co-founder board
- [ ] `community.html` — community feed with post creation
- [ ] `dashboard/index.html` — authenticated dashboard
- [ ] `dashboard/profile.html` — profile edit form with CV upload
- [ ] `dashboard/post-job.html` — job posting form (employers)
- [ ] `dashboard/post-cofounder.html` — co-founder listing form

### Features
- [ ] Job approval flow (pending → active via admin)
- [ ] In-app job application with CV attachment
- [ ] Skill endorsements on profiles
- [ ] Hashtag extraction and filtering in community feed
- [ ] Convex-synced bookmarks replacing localStorage
- [ ] Notification bell with unread count badge
- [ ] Co-founder skill match scoring

---
---

# PHASE 3 — PLATFORM
## Full Product · Advanced Features · Monetisation · Scale

---

## 34. Phase 3 Overview

Phase 3 completes AfriDev Explorer as a fully realised African developer platform. It adds real-time messaging, mentorship, events, advanced analytics, a recruiter pipeline, startup showcase, trust and safety systems, and a monetisation layer.

### New Capabilities in Phase 3

| Capability | Technology |
|---|---|
| Real-time WebSocket messaging | Convex subscriptions |
| Email notifications | Resend API |
| Scheduled jobs | Convex cron + scheduled functions |
| Advanced search | Convex full-text search |
| File previews | Convex file storage with serving |
| Admin dashboard | Separate `/admin/` page set |
| Analytics | Convex aggregates + chart rendering |
| Payments | Stripe (for premium features) |

---

## 35. Architecture Decision — Phase 3

### Bundler Introduction

Phase 3's complexity (real-time subscriptions, component reuse, advanced state) benefits from a build tool. Introduce **Vite** as a lightweight bundler — it supports vanilla JS and requires zero framework adoption.

```bash
npm install --save-dev vite
```

Update `package.json`:
```json
{
  "scripts": {
    "dev":   "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  }
}
```

Vite enables:
- `import.meta.env` for environment variables
- Hot module replacement in development
- Bundled, minified output for production
- Convex real-time WebSocket subscriptions work correctly

### Convex Real-Time Subscriptions

Replace polling with true WebSocket subscriptions in Phase 3:

```js
// js/convex-client.js — Phase 3
import { ConvexClient } from 'convex/browser';
const convex = new ConvexClient(import.meta.env.VITE_CONVEX_URL);
export default convex;

// Usage: subscribe to realtime data
const unsubscribe = convex.onUpdate(
  api.posts.listPosts, {},
  (posts) => renderFeed(posts)
);
// Call unsubscribe() to stop listening
```

---

## 36. Tech Stack — Phase 3

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| All of Phase 1 + 2 | — | — | Everything carries forward |
| Build Tool | Vite | ^5 | Bundler, dev server, HMR |
| Real-time | Convex subscriptions | — | WebSocket-based live updates |
| Email | Resend | Latest | Transactional + digest emails |
| Payments | Stripe | Latest | Premium subscriptions |
| Testing | Vitest | ^1 | Replaces Jest — Vite-native |
| Admin | Custom `/admin/` pages | — | Content moderation, analytics |

---

## 37. Extended Convex Schema — Phase 3

Additional tables added to `convex/schema.ts`:

```typescript
// ─── Direct Messages ──────────────────────────────────────────
messageThreads: defineTable({
  participantIds: v.array(v.id('users')),   // exactly 2 users per thread
  lastMessageAt:  v.number(),
  lastMessagePreview: v.string(),
})
.index('by_participant', ['participantIds']),

messages: defineTable({
  threadId:   v.id('messageThreads'),
  senderId:   v.id('users'),
  content:    v.string(),
  fileId:     v.optional(v.id('_storage')),
  isRead:     v.boolean(),
  createdAt:  v.number(),
})
.index('by_thread',         ['threadId'])
.index('by_thread_created', ['threadId', 'createdAt']),

// ─── Mentorship ───────────────────────────────────────────────
mentorProfiles: defineTable({
  userId:          v.id('users'),
  expertiseAreas:  v.array(v.string()),
  hoursPerMonth:   v.number(),
  bio:             v.string(),
  isAccepting:     v.boolean(),
  totalSessions:   v.number(),
  rating:          v.optional(v.number()),     // 1.0 – 5.0
  createdAt:       v.number(),
})
.index('by_user',      ['userId'])
.index('by_accepting', ['isAccepting']),

mentorshipRequests: defineTable({
  mentorId:    v.id('users'),
  menteeId:    v.id('users'),
  topic:       v.string(),
  message:     v.string(),
  status:      v.union(
    v.literal('pending'), v.literal('accepted'),
    v.literal('rejected'), v.literal('completed')
  ),
  createdAt:   v.number(),
})
.index('by_mentor', ['mentorId'])
.index('by_mentee', ['menteeId']),

mentorReviews: defineTable({
  mentorId:   v.id('users'),
  menteeId:   v.id('users'),
  rating:     v.number(),          // 1 – 5
  review:     v.string(),
  createdAt:  v.number(),
})
.index('by_mentor', ['mentorId']),

// ─── Events ───────────────────────────────────────────────────
events: defineTable({
  organizerId:   v.id('users'),
  title:         v.string(),
  description:   v.string(),
  eventType:     v.union(
    v.literal('hackathon'), v.literal('meetup'),
    v.literal('conference'), v.literal('workshop'), v.literal('bootcamp')
  ),
  format:        v.union(v.literal('virtual'), v.literal('in_person'), v.literal('hybrid')),
  location:      v.optional(v.string()),
  country:       v.optional(v.string()),
  virtualLink:   v.optional(v.string()),
  startDate:     v.number(),
  endDate:       v.number(),
  registrationUrl: v.optional(v.string()),
  prizePool:     v.optional(v.string()),
  rsvpCount:     v.number(),
  status:        v.union(v.literal('upcoming'), v.literal('ongoing'), v.literal('past')),
  createdAt:     v.number(),
})
.index('by_start',   ['startDate'])
.index('by_country', ['country'])
.index('by_status',  ['status']),

eventRsvps: defineTable({
  eventId:   v.id('events'),
  userId:    v.id('users'),
  createdAt: v.number(),
})
.index('by_event', ['eventId'])
.index('by_user',  ['userId']),

// ─── Startups ─────────────────────────────────────────────────
startups: defineTable({
  founderId:     v.id('users'),
  name:          v.string(),
  mission:       v.string(),
  stage:         v.union(
    v.literal('idea'), v.literal('prototype'),
    v.literal('mvp'),  v.literal('seed'),
    v.literal('series_a_plus')
  ),
  industry:      v.array(v.string()),
  country:       v.optional(v.string()),
  techStack:     v.array(v.string()),
  teamMembers:   v.array(v.id('users')),
  websiteUrl:    v.optional(v.string()),
  pitchDeckId:   v.optional(v.id('_storage')),
  isHiring:      v.boolean(),
  openRoles:     v.array(v.string()),
  createdAt:     v.number(),
})
.index('by_founder',  ['founderId'])
.index('by_stage',    ['stage'])
.index('by_country',  ['country']),

// ─── Reports (moderation) ─────────────────────────────────────
reports: defineTable({
  reporterId:   v.id('users'),
  contentType:  v.string(),   // 'user' | 'post' | 'job' | 'comment'
  contentId:    v.string(),
  reason:       v.string(),
  status:       v.union(
    v.literal('pending'), v.literal('resolved'), v.literal('dismissed')
  ),
  createdAt:    v.number(),
})
.index('by_status', ['status']),

// ─── Premium Subscriptions ────────────────────────────────────
subscriptions: defineTable({
  userId:         v.id('users'),
  plan:           v.union(v.literal('developer_pro'), v.literal('employer_premium')),
  stripeSubId:    v.string(),
  status:         v.union(
    v.literal('active'), v.literal('cancelled'), v.literal('past_due')
  ),
  currentPeriodEnd: v.number(),
  createdAt:      v.number(),
})
.index('by_user',   ['userId'])
.index('by_stripe', ['stripeSubId']),

// ─── Developer Stats (GitHub sync cache) ──────────────────────
developerStats: defineTable({
  userId:          v.id('users'),
  githubUsername:  v.string(),
  totalStars:      v.number(),
  totalForks:      v.number(),
  totalRepos:      v.number(),
  followers:       v.number(),
  topLanguage:     v.optional(v.string()),
  commitCount30d:  v.optional(v.number()),
  lastSyncedAt:    v.number(),
})
.index('by_user',   ['userId'])
.index('by_github', ['githubUsername']),
```

---

## 38. Advanced Features

### 38.1 Full-Text Search

Convex supports full-text search on string fields. Add search indexes to `schema.ts`:

```typescript
// In developerProfiles table definition:
.searchIndex('search_profiles', {
  searchField: 'headline',
  filterFields: ['country', 'availabilityStatus'],
})

// In jobs table:
.searchIndex('search_jobs', {
  searchField: 'title',
  filterFields: ['country', 'workType', 'status'],
})

// In posts table:
.searchIndex('search_posts', {
  searchField: 'content',
  filterFields: ['postType'],
})
```

Usage in a query:

```typescript
// convex/profiles.ts
export const searchProfiles = query({
  args: { query: v.string(), country: v.optional(v.string()) },
  handler: async (ctx, args) => {
    return ctx.db.query('developerProfiles')
      .withSearchIndex('search_profiles', q => {
        let s = q.search('headline', args.query);
        if (args.country) s = s.eq('country', args.country);
        return s;
      })
      .take(12);
  },
});
```

---

## 39. Messaging System

### 39.1 Starting a Conversation

A developer or employer can message any user who has "open to messages" enabled or who they've connected with (bookmarked profile, applied to job, expressed co-founder interest).

```typescript
// convex/messages.ts

export const startOrGetThread = mutation({
  args: { otherUserId: v.id('users') },
  handler: async (ctx, { otherUserId }) => {
    const user = await requireAuth(ctx);
    // Check for existing thread between these two users
    const threads = await ctx.db.query('messageThreads').collect();
    const existing = threads.find(t =>
      t.participantIds.includes(user._id) && t.participantIds.includes(otherUserId)
    );
    if (existing) return existing._id;
    return ctx.db.insert('messageThreads', {
      participantIds: [user._id, otherUserId],
      lastMessageAt: Date.now(),
      lastMessagePreview: '',
    });
  },
});

export const sendMessage = mutation({
  args: {
    threadId: v.id('messageThreads'),
    content:  v.string(),
    fileId:   v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    // Verify sender is a participant
    const thread = await ctx.db.get(args.threadId);
    if (!thread?.participantIds.includes(user._id)) throw new Error('Not a participant');
    // Insert message
    await ctx.db.insert('messages', {
      threadId: args.threadId, senderId: user._id,
      content: args.content, fileId: args.fileId,
      isRead: false, createdAt: Date.now(),
    });
    // Update thread preview
    await ctx.db.patch(args.threadId, {
      lastMessageAt: Date.now(),
      lastMessagePreview: args.content.slice(0, 60),
    });
    // Notify the other participant
    const otherId = thread.participantIds.find(id => id !== user._id);
    if (otherId) {
      await ctx.runMutation(internal.notifications.createNotification, {
        userId: otherId, type: 'message',
        title: `New message from ${user.name}`,
        body: args.content.slice(0, 80),
        actionUrl: `/dashboard/messages.html?thread=${args.threadId}`,
      });
    }
  },
});

// Realtime subscription for thread messages
export const getMessages = query({
  args: { threadId: v.id('messageThreads') },
  handler: async (ctx, { threadId }) => {
    const user = await requireAuth(ctx);
    const thread = await ctx.db.get(threadId);
    if (!thread?.participantIds.includes(user._id)) throw new Error('Access denied');
    return ctx.db.query('messages')
      .withIndex('by_thread_created', q => q.eq('threadId', threadId))
      .order('asc')
      .collect();
  },
});
```

### 39.2 Messages UI — `dashboard/messages.html`

```
[Sidebar: Thread list with avatars and last message preview]
[Main Panel: Active thread messages]
[Input area: textarea + send button + file attachment]
```

Messages use Convex real-time subscription — new messages appear instantly without polling.

```js
// dashboard/messages.js
import convex from '../js/convex-client.js';
import { api } from '../convex/_generated/api.js';

const threadId = getQueryParam('thread');

// Subscribe to real-time messages
const unsubscribe = convex.onUpdate(
  api.messages.getMessages, { threadId },
  (messages) => renderMessages(messages)
);

// Cleanup on page leave
window.addEventListener('beforeunload', unsubscribe);
```

---

## 40. Mentorship Programme

### 40.1 Mentor Discovery Page — `mentorship.html`

```
[Page Header: "AfriDev Mentors"]
[Filter: Expertise Area | Availability | Country]
[Results: Mentor cards — expertise tags, hours/month, rating, total sessions]
[CTA: "Become a Mentor" (authenticated devs)]
```

### 40.2 Mentorship Request Flow

1. Mentee clicks "Request Mentorship" on a mentor's card
2. Modal appears: topic input + message (max 300 chars)
3. `createMentorshipRequest` mutation creates record with `status: 'pending'`
4. Mentor receives notification
5. Mentor goes to their dashboard → Mentorship tab → Accept or Decline
6. If accepted → both parties can message each other
7. After session → mentee can leave a rating and review

### 40.3 Mentor Rating Aggregation

After a review is submitted, recalculate the mentor's average rating:

```typescript
// convex/mentorship.ts
export const submitReview = mutation({
  args: { mentorId: v.id('users'), rating: v.number(), review: v.string() },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    // Insert review
    await ctx.db.insert('mentorReviews', {
      ...args, menteeId: user._id, createdAt: Date.now(),
    });
    // Recalculate average rating for mentor
    const reviews = await ctx.db.query('mentorReviews')
      .withIndex('by_mentor', q => q.eq('mentorId', args.mentorId))
      .collect();
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const mentorProfile = await ctx.db.query('mentorProfiles')
      .withIndex('by_user', q => q.eq('userId', args.mentorId))
      .unique();
    if (mentorProfile) await ctx.db.patch(mentorProfile._id, { rating: avg });
  },
});
```

---

## 41. Events Board

### 41.1 Public Events Page — `events.html`

```
[Page Header: "African Tech Events"]
[Filter: Event Type | Format | Country | Date Range]
[Results: Event cards — sorted by start date ascending]
[Create Event button (authenticated)]
```

**Event Card:**
- Event type badge + format badge (Virtual / In-Person / Hybrid)
- Title, organiser, location
- Date range (formatted: "Jan 15 – 17, 2026")
- RSVP count + "RSVP" button (authenticated)
- Prize pool (hackathons only)
- Registration URL link

### 41.2 Scheduled Function — Auto-close Past Events

```typescript
// convex/crons.ts
import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

// Run daily at midnight UTC
crons.daily('close-past-events', { hourUTC: 0, minuteUTC: 0 }, async (ctx) => {
  const now = Date.now();
  const pastEvents = await ctx.db.query('events')
    .withIndex('by_status', q => q.eq('status', 'upcoming'))
    .filter(q => q.lt(q.field('endDate'), now))
    .collect();
  await Promise.all(pastEvents.map(e => ctx.db.patch(e._id, { status: 'past' })));
});

// Also: auto-close expired job listings daily
crons.daily('close-expired-jobs', { hourUTC: 1, minuteUTC: 0 }, async (ctx) => {
  const now = Date.now();
  const expired = await ctx.db.query('jobs')
    .withIndex('by_status', q => q.eq('status', 'active'))
    .filter(q => q.lt(q.field('deadline'), now))
    .collect();
  await Promise.all(expired.map(j => ctx.db.patch(j._id, { status: 'closed' })));
});

export default crons;
```

---

## 42. African Tech Report

### 42.1 Purpose

A public, auto-generated statistics page (`/report.html`) that updates weekly. It becomes a PR asset for AfriDev Explorer — shareable, tweetable, linkable.

### 42.2 Data Sources

| Metric | Source |
|---|---|
| Most popular languages | GitHub API repo search aggregated by language + country |
| Fastest-growing communities | Compare developer count week-over-week (stored in `developerStats`) |
| Top employers | Count of active jobs per employer in Convex `jobs` table |
| Most starred African repos | GitHub API `searchRepos('Africa', '', 'stars', 1)` |
| Top hiring locations | Aggregate `country` field from active `jobs` |

### 42.3 Weekly Sync — Convex Scheduled Function

```typescript
// convex/crons.ts (addition)
crons.weekly('sync-tech-report', { dayOfWeek: 'monday', hourUTC: 6, minuteUTC: 0 }, async (ctx) => {
  // Call GitHub API server-side via Convex Action
  await ctx.runAction(internal.report.syncReportData);
});
```

```typescript
// convex/report.ts
export const syncReportData = internalAction(async (ctx) => {
  const topLangs = ['JavaScript', 'Python', 'TypeScript', 'PHP', 'Go', 'Java', 'C++', 'Ruby'];
  const counts: Record<string, number> = {};

  for (const lang of topLangs) {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=location:Africa+language:${lang}&per_page=1`,
      { headers: { Accept: 'application/vnd.github+json' } }
    );
    const data = await res.json();
    counts[lang] = data.total_count ?? 0;
  }

  // Store in a singleton config document or a dedicated reportData table
  await ctx.runMutation(internal.report.saveReportData, { languageCounts: counts });
});
```

---

## 43. Developer Growth Tracker

### 43.1 Purpose

Opted-in developers see a private dashboard tracking their GitHub stats over time. Requires syncing GitHub data periodically via a Convex Action.

### 43.2 Sync Flow

```typescript
// convex/stats.ts
export const syncMyStats = action({
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    if (!user.githubUsername) throw new Error('No GitHub username linked');

    // Fetch from GitHub API server-side (no rate limit concerns on server)
    const [profile, repos] = await Promise.all([
      fetch(`https://api.github.com/users/${user.githubUsername}`, {
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      }).then(r => r.json()),
      fetch(`https://api.github.com/users/${user.githubUsername}/repos?sort=stars&per_page=100`, {
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      }).then(r => r.json()),
    ]);

    const totalStars = repos.reduce((s: number, r: any) => s + r.stargazers_count, 0);
    const langCounts: Record<string, number> = {};
    repos.forEach((r: any) => { if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1; });
    const topLanguage = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    await ctx.runMutation(internal.stats.saveStats, {
      userId: user._id,
      githubUsername: user.githubUsername,
      totalStars, totalForks: repos.reduce((s: number, r: any) => s + r.forks_count, 0),
      totalRepos: profile.public_repos,
      followers: profile.followers,
      topLanguage,
      lastSyncedAt: Date.now(),
    });
  },
});
```

### 43.3 Growth Dashboard UI

Private section in `/dashboard/index.html`:

```
[Stats Cards: Stars This Month | New Followers | Repos Created | Profile Views]
[Line chart: followers over time — rendered with canvas API, no library]
[Top Language badge]
[Last synced: X hours ago + "Sync Now" button]
```

---

## 44. Skill Gap Heatmap

### 44.1 Purpose

Cross-reference skills employers request in job listings against skills developers have in their profiles. Show a heatmap of high-demand / low-supply skills by country.

### 44.2 Data Aggregation

```typescript
// convex/insights.ts
export const getSkillGap = query({
  args: { country: v.optional(v.string()) },
  handler: async (ctx, { country }) => {
    // Demand: aggregate techStack from active jobs
    const jobs = await ctx.db.query('jobs')
      .withIndex('by_status', q => q.eq('status', 'active'))
      .collect();
    const demand: Record<string, number> = {};
    jobs
      .filter(j => !country || j.country === country)
      .forEach(j => j.techStack.forEach(s => { demand[s] = (demand[s] || 0) + 1; }));

    // Supply: aggregate skills from public developer profiles
    const profiles = await ctx.db.query('developerProfiles')
      .filter(q => q.eq(q.field('isPublic'), true))
      .collect();
    const supply: Record<string, number> = {};
    profiles
      .filter(p => !country || p.country === country)
      .forEach(p => p.skills.forEach(s => { supply[s] = (supply[s] || 0) + 1; }));

    // Gap score = demand - supply (positive = gap exists)
    return Object.keys(demand).map(skill => ({
      skill,
      demand:   demand[skill]  || 0,
      supply:   supply[skill]  || 0,
      gap:      (demand[skill] || 0) - (supply[skill] || 0),
    })).sort((a, b) => b.gap - a.gap).slice(0, 20);
  },
});
```

### 44.3 Heatmap UI — `insights.html`

```
[Page Header: "African Tech Skill Insights"]
[Country dropdown filter]
[Heatmap table: Skill | Demand | Supply | Gap Score | Recommendation]
[Colour: red = high gap, amber = medium, green = balanced]
[CTA for developers: "This week's top skill to learn: [X]"]
```

---

## 45. Talent Search — Employer View

### 45.1 Access

Only users with `role: 'employer'` can access `/dashboard/talent.html`.

### 45.2 Advanced Filters

```typescript
// convex/profiles.ts
export const searchTalent = query({
  args: {
    availabilityStatus: v.optional(v.string()),
    country:            v.optional(v.string()),
    skill:              v.optional(v.string()),
    hourlyRateMax:      v.optional(v.number()),
    preferredWorkType:  v.optional(v.string()),
    spokenLanguage:     v.optional(v.string()),
    cursor:             v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    if (user.role !== 'employer' && user.role !== 'admin') throw new Error('Employers only');

    let q = ctx.db.query('developerProfiles')
      .withIndex('by_updated')
      .filter(q => q.eq(q.field('isPublic'), true));

    if (args.availabilityStatus)
      q = q.filter(q => q.eq(q.field('availabilityStatus'), args.availabilityStatus));
    if (args.country)
      q = q.filter(q => q.eq(q.field('country'), args.country));
    if (args.hourlyRateMax)
      q = q.filter(q => q.lte(q.field('hourlyRateMin'), args.hourlyRateMax));
    if (args.preferredWorkType)
      q = q.filter(q => q.eq(q.field('preferredWorkType'), args.preferredWorkType));

    return q.paginate({ cursor: args.cursor ?? null, numItems: 12 });
  },
});
```

---

## 46. Recruitment Pipeline

### 46.1 Purpose

Employers have a private kanban board to manage candidates across their job listings.

### 46.2 Schema

Applications already have a `status` field with 5 stages:
`applied → shortlisted → interviewing → offered → rejected`

### 46.3 Kanban UI — `/dashboard/pipeline.html`

```
[Job selector dropdown]
[5 columns: Applied | Shortlisted | Interviewing | Offered | Rejected]
[Each column: list of applicant cards with avatar, name, top skill, applied date]
[Drag card between columns → updateApplicationStatus mutation]
[Click card → opens applicant profile modal with CV download button]
[Add private note → saved to application record]
```

### 46.4 CV Download

```typescript
// convex/jobs.ts
export const getCvUrl = query({
  args: { applicationId: v.id('applications') },
  handler: async (ctx, { applicationId }) => {
    const user = await requireAuth(ctx);
    const application = await ctx.db.get(applicationId);
    if (!application) throw new Error('Application not found');
    // Verify requester is the employer who owns the job
    const job = await ctx.db.get(application.jobId);
    if (job?.employerId !== user._id && user.role !== 'admin') {
      throw new Error('Access denied');
    }
    if (!application.cvStorageId) return null;
    return ctx.storage.getUrl(application.cvStorageId);
  },
});
```

---

## 47. Startup Showcase

### 47.1 Public Page — `startups.html`

```
[Page Header: "African Startups"]
[Filter: Stage | Industry | Country | Is Hiring]
[Results: Startup cards]
```

**Startup Card:**
- Company name + logo
- Mission (one-liner)
- Stage badge + industry tags
- Team member avatars (linked to AfriDev profiles)
- Tech stack tags
- "We're Hiring" badge + open roles
- Website link + Pitch Deck download (if public)

### 47.2 Create / Edit Startup — `/dashboard/startup.html`

Any authenticated developer can create a startup profile. They can invite team members (search by AfriDev username — creates a notification to accept/decline).

---

## 48. Trust & Safety

### 48.1 Report System

Report button appears on: user profiles, job listings, community posts, co-founder listings.

```typescript
// convex/moderation.ts
export const reportContent = mutation({
  args: {
    contentType: v.string(),
    contentId:   v.string(),
    reason:      v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    return ctx.db.insert('reports', {
      ...args, reporterId: user._id,
      status: 'pending', createdAt: Date.now(),
    });
  },
});
```

### 48.2 Admin Dashboard — `/admin/`

Access restricted to `role: 'admin'`. Sections:

| Section | Purpose |
|---|---|
| `/admin/index.html` | Stats overview: new users today/week, active jobs, pending approvals |
| `/admin/jobs.html` | Review pending job listings — Approve / Reject with reason |
| `/admin/reports.html` | Review flagged content — Resolve / Dismiss |
| `/admin/users.html` | Search users, view profiles, suspend accounts |
| `/admin/cofounders.html` | Review co-founder listings |

### 48.3 Block System

```typescript
// convex/users.ts
blockedUsers: defineTable({
  blockerId:  v.id('users'),
  blockedId:  v.id('users'),
  createdAt:  v.number(),
})
.index('by_blocker', ['blockerId']),

export const blockUser = mutation({
  args: { blockedId: v.id('users') },
  handler: async (ctx, { blockedId }) => {
    const user = await requireAuth(ctx);
    // Check not already blocked
    const existing = await ctx.db.query('blockedUsers')
      .withIndex('by_blocker', q => q.eq('blockerId', user._id))
      .filter(q => q.eq(q.field('blockedId'), blockedId))
      .unique();
    if (!existing) {
      await ctx.db.insert('blockedUsers', {
        blockerId: user._id, blockedId, createdAt: Date.now(),
      });
    }
  },
});
```

Blocked users are filtered out of all queries that return user profiles or posts.

---

## 49. Monetisation Layer

### 49.1 Stripe Integration

```bash
npm install stripe @stripe/stripe-js
```

```typescript
// convex/stripe.ts
export const createCheckoutSession = action({
  args: { plan: v.string() },
  handler: async (ctx, { plan }) => {
    const user = await requireAuth(ctx);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const prices: Record<string, string> = {
      developer_pro:     process.env.STRIPE_DEVELOPER_PRO_PRICE_ID!,
      employer_premium:  process.env.STRIPE_EMPLOYER_PREMIUM_PRICE_ID!,
    };

    const session = await stripe.checkout.sessions.create({
      mode:               'subscription',
      payment_method_types: ['card'],
      line_items:         [{ price: prices[plan], quantity: 1 }],
      success_url:        `${process.env.APP_URL}/dashboard/?upgrade=success`,
      cancel_url:         `${process.env.APP_URL}/pricing.html`,
      customer_email:     user.email,
      metadata:           { convexUserId: user._id, plan },
    });

    return session.url;
  },
});
```

### 49.2 Stripe Webhook Handler — Convex HTTP Action

```typescript
// convex/http.ts
import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import Stripe from 'stripe';

const http = httpRouter();

http.route({
  path: '/stripe-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const sig = request.headers.get('stripe-signature')!;
    const body = await request.text();

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch {
      return new Response('Webhook Error', { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await ctx.runMutation(internal.stripe.activateSubscription, {
        stripeSubId: session.subscription as string,
        userId:      session.metadata!.convexUserId,
        plan:        session.metadata!.plan,
      });
    }

    return new Response('OK', { status: 200 });
  }),
});

export default http;
```

### 49.3 Plan Benefits

| Feature | Free | Developer Pro | Employer Premium |
|---|---|---|---|
| Browse developers | ✅ | ✅ | ✅ |
| Public AfriDev profile | ✅ | ✅ | ✅ |
| Apply to jobs | ✅ | ✅ | ✅ |
| Community posts | ✅ | ✅ | ✅ |
| Bookmarks | 20 max | Unlimited | Unlimited |
| Profile views analytics | ❌ | ✅ | ✅ |
| Priority in talent search | ❌ | ✅ | — |
| CV builder | ❌ | ✅ | — |
| Post job listings | ❌ | — | 5/month |
| Advanced talent filters | ❌ | — | ✅ |
| Recruitment pipeline | ❌ | — | ✅ |
| Featured job listings | ❌ | — | ✅ |
| Monthly price | Free | $5/mo | $29/mo |
| Annual price | Free | $48/yr | $290/yr |

---

## 50. Advanced Notifications & Email

### 50.1 Resend Integration

```bash
npm install resend
```

```typescript
// convex/emails.ts
import { Resend } from 'resend';

export const sendWeeklyDigest = internalAction(async (ctx, args: { userId: Id<'users'> }) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const user = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
  if (!user) return;

  // Build digest content: new jobs, co-founder requests, top posts
  const [matchingJobs, newCofounderRequests] = await Promise.all([
    ctx.runQuery(internal.jobs.getMatchingJobsForUser, { userId: args.userId }),
    ctx.runQuery(internal.cofounders.getNewListings, { country: user.country }),
  ]);

  await resend.emails.send({
    from:    'AfriDev Explorer <hello@afridev.co>',
    to:      user.email,
    subject: `Your AfriDev Weekly Digest — ${new Date().toDateString()}`,
    html:    buildDigestEmail({ user, matchingJobs, newCofounderRequests }),
  });
});
```

### 50.2 Weekly Digest Cron

```typescript
// convex/crons.ts (addition)
crons.weekly('send-weekly-digest', { dayOfWeek: 'friday', hourUTC: 8, minuteUTC: 0 }, async (ctx) => {
  // Get all users opted in to digest
  const users = await ctx.db.query('users').collect();
  for (const user of users) {
    await ctx.scheduler.runAfter(0, internal.emails.sendWeeklyDigest, { userId: user._id });
  }
});
```

---

## 51. Deployment — Phase 3

### Environment Variables — Complete Reference

See [Appendix A](#a-environment-variables-reference) for the full list.

### Production Infrastructure

| Service | Purpose | Cost |
|---|---|---|
| Vercel | Frontend hosting | Free / Pro $20/mo |
| Convex | Backend + database + real-time | Free / Pro $25/mo |
| WorkOS | Authentication | Free up to 1M MAU |
| Resend | Email delivery | Free 3,000/mo / $20/mo after |
| Stripe | Payments | 2.9% + $0.30 per transaction |
| GitHub | Source control + CI | Free |

### Vite Build Config — `vite.config.js`

```js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main:          'index.html',
        developers:    'developers.html',
        repositories:  'repositories.html',
        profile:       'profile.html',
        activity:      'activity.html',
        about:         'about.html',
        jobs:          'jobs.html',
        cofounders:    'cofounders.html',
        community:     'community.html',
        events:        'events.html',
        startups:      'startups.html',
        insights:      'insights.html',
        report:        'report.html',
        pricing:       'pricing.html',
        '404':         '404.html',
      },
    },
  },
});
```

---

## 52. Phase 3 Deliverables Checklist

### Backend Extensions
- [ ] Extended schema with all Phase 3 tables
- [ ] Full-text search indexes on profiles, jobs, posts
- [ ] `convex/messages.ts` — complete messaging system
- [ ] `convex/mentorship.ts` — mentor profiles, requests, reviews
- [ ] `convex/events.ts` — events CRUD + RSVP
- [ ] `convex/startups.ts` — startup profiles + team invites
- [ ] `convex/moderation.ts` — reports, admin approval
- [ ] `convex/stripe.ts` — checkout sessions + webhook handler
- [ ] `convex/emails.ts` — Resend integration for digest + notifications
- [ ] `convex/crons.ts` — all scheduled jobs (digest, close-past, sync-stats, close-expired-jobs)
- [ ] `convex/stats.ts` — GitHub stats sync action
- [ ] `convex/insights.ts` — skill gap aggregation
- [ ] `convex/report.ts` — African Tech Report data sync
- [ ] `convex/http.ts` — Stripe webhook HTTP action
- [ ] Block system in schema and mutations
- [ ] Admin-only functions with role guard

### Pages (Phase 3 additions)
- [ ] `mentorship.html` — mentor discovery
- [ ] `events.html` — events board
- [ ] `startups.html` — startup showcase
- [ ] `insights.html` — skill gap heatmap
- [ ] `report.html` — African Tech Report
- [ ] `pricing.html` — plan comparison + Stripe checkout
- [ ] `dashboard/messages.html` — real-time messaging
- [ ] `dashboard/pipeline.html` — employer recruitment kanban
- [ ] `dashboard/talent.html` — advanced talent search (employers)
- [ ] `dashboard/startup.html` — create/edit startup profile
- [ ] `/admin/index.html`, `/admin/jobs.html`, `/admin/reports.html`, `/admin/users.html`

### Features
- [ ] Real-time WebSocket subscriptions via Convex (messages, community feed)
- [ ] Mentor rating recalculation after every review
- [ ] Cron: auto-close past events + expired jobs daily
- [ ] Cron: weekly digest email to opted-in users
- [ ] Cron: weekly African Tech Report data sync
- [ ] Stripe checkout + subscription activation via webhook
- [ ] CV download access control (employer only, own job applications only)
- [ ] Block system filtering blocked users from all queries
- [ ] Full-text search on profiles, jobs, posts
- [ ] Skill gap heatmap with demand vs supply calculation
- [ ] Growth tracker: GitHub stats sync + trend display
- [ ] Startup team invites via notification

---
---

# APPENDICES

---

## A. Environment Variables Reference

| Variable | Phase | Where | Description |
|---|---|---|---|
| `VITE_CONVEX_URL` | 2+ | Client + Vercel | Convex deployment URL |
| `VITE_WORKOS_CLIENT_ID` | 2+ | Client + Vercel | WorkOS client ID (public) |
| `WORKOS_API_KEY` | 2+ | Convex env | WorkOS secret key (server-only) |
| `GITHUB_TOKEN` | 1 local, 3 server | Local `.env` + Convex env | GitHub PAT for higher rate limits |
| `STRIPE_SECRET_KEY` | 3 | Convex env | Stripe secret key (server-only) |
| `STRIPE_WEBHOOK_SECRET` | 3 | Convex env | Stripe webhook signing secret |
| `STRIPE_DEVELOPER_PRO_PRICE_ID` | 3 | Convex env | Stripe price ID for Developer Pro |
| `STRIPE_EMPLOYER_PREMIUM_PRICE_ID` | 3 | Convex env | Stripe price ID for Employer Premium |
| `RESEND_API_KEY` | 3 | Convex env | Resend API key for emails |
| `APP_URL` | 3 | Convex env | Production URL for Stripe redirects |
| `CONVEX_DEPLOY_KEY` | 2+ | GitHub Actions secret | For `npx convex deploy` in CI |

**Never commit any of these to git.** All must be in `.env` (gitignored) locally and in Vercel / Convex environment dashboards in production.

---

## B. README Specification

The `README.md` must contain:

```markdown
# AfriDev Explorer 🌍

> Discover, connect, and build with African developers.

## Live Site
https://afridev-explorer.vercel.app

## Screenshots
[Home page screenshot]
[Developers page screenshot]

## Tech Stack
Phase 1: HTML5 · Vanilla CSS · JavaScript · GitHub API · Jest · GitHub Actions
Phase 2: + Convex · WorkOS AuthKit
Phase 3: + Vite · Resend · Stripe

## Features
- Discover African GitHub developers by country and technology
- Browse trending African open-source repositories
- 4-tab developer search: All / By Technology / Co-Founders / Hiring
- Live GitHub activity feed with auto-refresh
- Interactive Africa developer map
- AfriDev community profiles
- Job board with in-app applications
- Co-founder matching board
- Community feed with real-time updates
- Mentor-mentee programme
- Direct messaging
- African Tech Report (weekly)

## Local Setup
git clone https://github.com/Mylesoft/afridev-explorer.git
cd afridev-explorer
npm install
cp .env.example .env   # fill in your values
npm run dev            # starts Vite dev server + Convex dev backend

## Running Tests
npm test               # Phase 1+2: Vitest
npx convex test        # Convex function tests

## Author
Jonathan Ayany (Myles)
ayany004@gmail.com
github.com/Mylesoft
```

---

## C. Master Commit Roadmap

### Phase 1 (Commits 1–30) — see [Section 13.2](#132-phase-1-commit-roadmap-30-commits)

### Phase 2 (Commits 31–50)

| # | Commit Message |
|---|---|
| 31 | `chore: install and initialise Convex backend` |
| 32 | `chore: install and configure WorkOS AuthKit` |
| 33 | `feat: define full Convex schema with all Phase 2 tables and indexes` |
| 34 | `feat: implement requireAuth helper and users upsert and getMe functions` |
| 35 | `feat: implement developer profile CRUD with CV upload via Convex storage` |
| 36 | `feat: implement job board queries and mutations with employer role guard` |
| 37 | `feat: implement co-founder listings CRUD with skill match scoring` |
| 38 | `feat: implement community posts with hashtag extraction like and comment` |
| 39 | `feat: implement Convex-synced bookmarks replacing localStorage` |
| 40 | `feat: implement notifications system with unread count and mark all read` |
| 41 | `feat: build WorkOS login callback and auth flow pages` |
| 42 | `feat: build authenticated developer dashboard with profile completion bar` |
| 43 | `feat: build profile edit form with all fields and CV upload` |
| 44 | `feat: build public job board page with Convex filters and pagination` |
| 45 | `feat: build job posting form with employer role gate and admin approval flow` |
| 46 | `feat: build co-founder board page and listing creation form` |
| 47 | `feat: build community feed page with post creation hashtag filter and realtime` |
| 48 | `feat: add skill endorsement system on developer profile pages` |
| 49 | `feat: deploy Phase 2 to Vercel with environment variable configuration` |
| 50 | `test: add Convex function tests for users profiles jobs and posts` |

### Phase 3 (Commits 51–80)

| # | Commit Message |
|---|---|
| 51 | `chore: install Vite as build tool and migrate from GitHub Pages to Vite build` |
| 52 | `chore: install Resend and configure email action in Convex` |
| 53 | `chore: install Stripe and configure checkout and webhook handler` |
| 54 | `feat: extend Convex schema with Phase 3 tables` |
| 55 | `feat: add full-text search indexes on profiles jobs and posts` |
| 56 | `feat: implement real-time WebSocket subscriptions via Convex client` |
| 57 | `feat: implement direct messaging system with thread and message mutations` |
| 58 | `feat: build messages dashboard page with realtime subscription` |
| 59 | `feat: implement mentorship profiles requests and review with rating aggregation` |
| 60 | `feat: build mentorship discovery page and dashboard mentorship section` |
| 61 | `feat: implement events CRUD with RSVP and auto-close past events cron` |
| 62 | `feat: build events board page with type format and country filters` |
| 63 | `feat: implement startup showcase with team invite notifications` |
| 64 | `feat: build startup browse page and create startup dashboard page` |
| 65 | `feat: implement skill gap heatmap aggregation query` |
| 66 | `feat: build insights page with skill gap table and country filter` |
| 67 | `feat: implement GitHub stats sync action with Convex scheduled weekly cron` |
| 68 | `feat: build developer growth tracker in dashboard with stats trend display` |
| 69 | `feat: implement African Tech Report data sync cron and public report page` |
| 70 | `feat: implement employer talent search with advanced filters` |
| 71 | `feat: build employer recruitment pipeline kanban board` |
| 72 | `feat: implement CV download with employer-only access control` |
| 73 | `feat: implement report and block system for trust and safety` |
| 74 | `feat: build admin dashboard with pending jobs reports and user management` |
| 75 | `feat: implement Stripe checkout session and subscription activation via webhook` |
| 76 | `feat: build pricing page with plan comparison and checkout redirect` |
| 77 | `feat: implement weekly digest email cron with Resend` |
| 78 | `feat: add block system filtering to all user-facing queries` |
| 79 | `chore: configure Vite multi-page build with all HTML entry points` |
| 80 | `test: add Phase 3 tests covering messaging mentorship and stripe webhook` |

---

## D. Security Hardening Checklist

### Input Validation
- [ ] All user input sanitized via `sanitize()` before any DOM insertion
- [ ] Post content max 500 chars enforced both client-side and server-side (Convex mutation)
- [ ] File uploads: type check (PDF only for CVs), size limit 5MB enforced in Convex action
- [ ] URL fields: validated as valid URLs before saving to database
- [ ] No `eval()` or `innerHTML` with unsanitized content anywhere in the codebase

### Authentication & Authorization
- [ ] Every Convex mutation that writes data calls `requireAuth(ctx)`
- [ ] Role checks enforced server-side (never trust client-sent role)
- [ ] Employer-only functions check `user.role === 'employer'`
- [ ] Admin-only functions check `user.role === 'admin'`
- [ ] CV download verifies requester is the job's employer

### Secret Management
- [ ] `.env` in `.gitignore` — confirmed not committed
- [ ] No tokens or API keys in any committed file
- [ ] `WORKOS_API_KEY` and `STRIPE_SECRET_KEY` only in Convex server environment
- [ ] `VITE_` prefix only on variables that are safe to expose to the client
- [ ] GitHub Actions secrets set in repository Settings, not hardcoded in YAML

### API Safety
- [ ] GitHub API calls: all user data passed through `sanitize()` before render
- [ ] Rate limit bar shown to users with colour warning below 15 remaining
- [ ] Convex mutations: all string inputs validated for expected length and format
- [ ] Stripe webhook: signature verified with `webhooks.constructEvent()` before processing

### Content Safety
- [ ] Job listings require admin approval before going live
- [ ] Report system in place for users, posts, jobs, co-founder listings
- [ ] Block system filters blocked users from all queries
- [ ] `<noscript>` messages on JS-dependent pages

---

*AfriDev Explorer · Built by Jonathan Ayany (Myles) · ayany004@gmail.com · 2025*
*This document is the single source of truth for the AfriDev Explorer platform. All implementation decisions must be consistent with this specification. Update this document when architectural decisions change.*
