# AfriDev Explorer 🌍

> Discover African software developers and open-source repositories via GitHub.

[![Test and Deploy](https://github.com/Mylesoft/afridev-explorer/workflows/Test%20and%20Deploy/badge.svg)](https://github.com/Mylesoft/afridev-explorer/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Table of Contents

1. [Live Site](#live-site)
2. [Screenshot](#screenshot)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [Installation](#installation)
6. [Local Development](#local-development)
7. [Running Tests](#running-tests)
8. [Project Structure](#project-structure)
9. [GitHub API](#github-api)
10. [Pages & Functionality](#pages--functionality)
11. [Design System](#design-system)
12. [Keyboard Shortcuts](#keyboard-shortcuts)
13. [Contributing](#contributing)
14. [Author](#author)
15. [License](#license)

---

## Live Site

🚀 **https://Mylesoft.github.io/afridev-explorer/**

---

## Screenshot

![AfriDev Explorer screenshot](assets/og-image.png)

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Markup** | HTML5 | — |
| **Styles** | Vanilla CSS | — |
| **Scripts** | Vanilla JavaScript | ES2022+ |
| **Fonts** | Google Fonts | — |
| **API** | GitHub REST API v3 | — |
| **Testing** | Jest + jest-environment-jsdom | ^29 |
| **CI/CD** | GitHub Actions | — |
| **Hosting** | GitHub Pages | — |

---

## Features

- **Search African Developers** - Browse developers from 54+ nations across Africa by country, technology, co-founder status, and hiring intent
- **Discover Repositories** - Explore trending open-source repositories with language filtering and sorting controls
- **Developer Profiles** - View detailed profiles with contribution heatmap, repositories, and similar developers
- **Live Activity Feed** - Watch African developers push code, open PRs, and star repos in real-time with 60-second auto-refresh
- **Interactive Africa Map** - Visualize developer density across 54 African countries with clickable filtering
- **Tech Leaderboard** - Top 8 programming languages used by African developers with animated bar chart
- **Dark Mode** - Toggle between light and dark themes with system preference persistence
- **Developer Bookmarks** - Save and export your favorite developers as JSON
- **Search History** - Autocomplete suggestions from previous searches
- **Keyboard Shortcuts** - Use `?` to view all available shortcuts
- **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- **Accessible** - WCAG AA compliant with semantic HTML, ARIA labels, and keyboard navigation

---

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Modern web browser
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/Mylesoft/afridev-explorer.git
cd afridev-explorer

# Install dependencies
npm install
```

---

## Local Development

### Start a local server (required for ES6 modules)

```bash
# Using live-server
npx live-server

# Or using Python
python3 -m http.server 8000

# Or using Node.js http-server
npx http-server -p 8000
```

Visit **http://localhost:8000** in your browser.

### Optional: GitHub Personal Access Token

For higher API rate limits (5,000 requests/hour instead of 60):

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Create a fine-grained token with "Public Repositories (read-only)" permission
3. Create `.env` file in project root:
   ```
   GITHUB_TOKEN=ghp_your_token_here
   ```
4. Paste the token into `js/api.js` temporarily during local development
5. **Always remove before committing!**

---

## Running Tests

```bash
# Run all tests once
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Coverage targets:**
- `api.js` — minimum 10 tests
- `render.js` — minimum 10 tests
- `utils.js` — minimum 18 tests

---

## Project Structure

```
afridev-explorer/
│
├── index.html                     # Home / Landing page
├── developers.html                # 4-tab developer search page
├── repositories.html              # Repository browser page
├── profile.html                   # Individual developer profile (dynamic)
├── activity.html                  # Live GitHub activity feed page
├── about.html                     # About page
├── 404.html                       # Custom 404 not-found page
│
├── assets/
│   ├── default-avatar.png         # Fallback when GitHub avatar fails
│   ├── favicon.svg                # SVG favicon (modern browsers)
│   ├── favicon.png                # PNG favicon (fallback, 32x32)
│   ├── og-image.png               # Open Graph social share image (1200x630px)
│   └── africa-map.svg             # SVG map of Africa (54 country paths)
│
├── css/
│   ├── reset.css                  # CSS reset — normalise browser defaults
│   ├── variables.css              # Design tokens (colours, fonts, spacing, dark mode)
│   ├── main.css                   # Global layout (navbar, hero, footer)
│   ├── components.css             # Reusable UI components
│   └── responsive.css             # Mobile-first media queries
│
├── js/
│   ├── api.js                     # GitHub API fetch functions
│   ├── render.js                  # DOM rendering — builds HTML from data
│   ├── utils.js                   # Pure utility functions
│   ├── theme.js                   # Dark mode with localStorage
│   ├── navbar.js                  # Shared navbar logic
│   ├── home.js                    # Home page logic
│   ├── developers.js              # Developers page (4-tab state machine)
│   ├── repositories.js            # Repositories page logic
│   ├── profile.js                 # Profile page logic
│   └── activity.js                # Live activity feed logic
│
├── tests/
│   ├── api.test.js                # Unit tests for api.js
│   ├── render.test.js             # Unit tests for render.js
│   └── utils.test.js              # Unit tests for utils.js
│
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions CI/CD
│
├── .gitignore
├── package.json                   # Project metadata and dependencies
└── README.md                      # This file
```

---

## GitHub API

### Base Configuration

- **Base URL:** `https://api.github.com`
- **Version:** v3
- **Authentication:** Optional (unauthenticated is 60 requests/hour per IP)

### Rate Limits

| Scenario | Limit | Mitigation |
|---|---|---|
| Unauthenticated | 60 req/hour | Show rate limit warning at ≤10 remaining |
| Authenticated (PAT) | 5,000 req/hour | Use during local development |
| Search API (unauth) | 10 req/minute | Debounce search inputs at 500ms |
| Search results cap | 1,000 max | Use `getMaxPages()` to cap pagination |

### API Endpoints Used

| Endpoint | Purpose |
|---|---|
| `GET /search/users` | Search developers by location, tech, keywords |
| `GET /users/{username}` | Fetch user profile data |
| `GET /users/{username}/repos` | Get user's public repositories |
| `GET /users/{username}/events/public` | Fetch recent public events |
| `GET /search/repositories` | Search repositories by language, location |
| `GET /repos/{owner}/{repo}/readme` | Fetch README (base64 encoded) |

---

## Pages & Functionality

### Home (`index.html`)
- Featured African developers
- Trending repositories
- Interactive Africa developer density map
- Tech leaderboard (8 languages)
- Live activity feed (6 recent events)
- Developer of the week spotlight
- Call-to-action banner

### Developers (`developers.html`)
**4 independent tabs:**
1. **All Developers** — Search by location
2. **By Technology** — Filter by language or framework
3. **Co-Founders** — Find co-founder keywords in bio
4. **Hiring** — Find teams that are hiring

Features:
- Country filter dropdown (54 nations)
- Search with debounce (500ms)
- Date range filters
- Sort by followers/repos/joined
- Pagination with 1,000 result cap
- Saved bookmarks section

### Repositories (`repositories.html`)
- Language filter pills (interactive)
- Sort controls (Stars, Forks, Updated)
- README hover preview
- Pagination with 1,000 result cap
- Repository cards with stats

### Profile (`profile.html`)
- Dynamic load via `?user=username` query parameter
- Large avatar with user details
- GitHub heatmap (contribution graph)
- Top repositories sorted by stars
- Similar developers by language
- Action buttons: View on GitHub, Copy Link, Bookmark

### Activity (`activity.html`)
- Live event feed (auto-refreshes every 60 seconds)
- Pauses when tab is hidden
- Event type filtering
- Country filtering
- Green "LIVE" indicator with pulsing animation

### About (`about.html`)
- Project mission and vision
- Tech stack overview
- Author information and contact
- Call-to-action buttons

### 404 (`404.html`)
- Branded error page
- Navigation back to site
- Suggested actions

---

## Design System

### Colour Palette

| Token | Color | Usage |
|---|---|---|
| `--color-primary` | `#1A395B` | Navy — navbar, headings, footer |
| `--color-accent` | `#C79639` | Gold — buttons, active states, highlights |
| `--color-white` | `#FFFFFF` | Card backgrounds, white text on dark |
| `--color-text` | `#1A1A2E` | Body text (near-black) |
| `--color-success` | `#16A34A` | Green — "Open to Work" badge |
| `--color-danger` | `#DC2626` | Red — error states, destructive actions |

**Dark mode:** Flips backgrounds and text while keeping primary/accent colours

### Typography

| Font | Usage |
|---|---|
| **Georgia** | Headings (H1–H4), logo |
| **Inter** | Body text, labels, navigation |
| **JetBrains Mono** | Stats, badges, code snippets |

### Spacing Scale (multiples of 4px)

- `--space-xs`: 4px
- `--space-sm`: 8px
- `--space-md`: 16px
- `--space-lg`: 24px
- `--space-xl`: 32px
- `--space-2xl`: 48px
- `--space-3xl`: 64px
- `--space-4xl`: 96px

### Responsive Breakpoints

- **Desktop:** default (1200px max-width)
- **Tablet:** 1024px and down
- **Mobile (large):** 768px and down
- **Mobile (small):** 480px and down

---

## Keyboard Shortcuts

Press `?` on any page to view all shortcuts:

| Key | Action |
|---|---|
| `/` | Focus search input |
| `d` | Go to Developers page |
| `r` | Go to Repositories page |
| `a` | Go to Activity page |
| `b` | Go to Bookmarks |
| `?` | Show shortcuts modal |
| `Escape` | Close modals |

---

## Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: description"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

### Development Workflow

```bash
# Create develop branch
git checkout -b develop

# Create feature branch from develop
git checkout -b feat/feature-name

# Make changes, test locally
npm test

# Commit and push
git push origin feat/feature-name

# Open PR to develop
# Once merged, create PR from develop to main
```

### Commit Message Convention

```
type: description

feat:    new feature
fix:     bug fix
style:   formatting changes
test:    test additions
chore:   build, deps, config
docs:    documentation
refactor: code restructuring
```

---

## Author

**Jonathan Ayany (Myles)**

- Email: ayany004@gmail.com
- Phone: +254 743 993 715
- GitHub: [@Mylesoft](https://github.com/Mylesoft)

---

## License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

*AfriDev Explorer — Phase 1: Explorer*  
*Discover African developers and open-source repositories via GitHub.*  
*Built with HTML5, Vanilla CSS, and Vanilla JavaScript.*
├── tests/
│   ├── api.test.js        # API module tests
│   ├── render.test.js     # Render module tests
│   └── utils.test.js      # Utils module tests
├── .github/workflows/
│   └── deploy.yml         # CI/CD pipeline
├── package.json           # Project metadata & dependencies
├── .gitignore            # Git exclusions
└── README.md             # This file
```

## 🔐 Security

### XSS Prevention
- All GitHub API strings are sanitized before HTML injection
- `sanitize()` function escapes HTML entities using textContent/innerHTML trick
- Image tags include `onerror` fallbacks to prevent loading errors

### API Token Safety
- GitHub tokens are never committed to repository
- Use `.env` file (excluded by `.gitignore`) for local development
- No credentials hardcoded in any source files

### Rate Limiting
- GitHub API limits enforced (1,000 results maximum per search)
- Rate limit headers tracked and displayed to users
- Error handling for 403 (rate limit) responses

## 📊 API Reference

### GitHub REST API Endpoints Used

```javascript
// Search developers by location
GET /search/users?q=location:{location}&page={page}&per_page={count}

// Get user details
GET /users/{username}

// Get user repositories
GET /users/{username}/repos?sort={sort}&per_page={count}

// Search repositories by location and language
GET /search/repositories?q=location:{location} language:{language}&sort={sort}&page={page}&per_page={count}
```

### Rate Limits
- **Authenticated (with token):** 5,000 requests/hour
- **Unauthenticated:** 60 requests/hour
- Maximum 1,000 results per search query

## 🧪 Test Coverage

Test files include:

- **utils.test.js** (13 tests)
  - sanitize(), debounce(), formatNumber()
  - getQueryParam(), cache functions
  - getLanguageColor(), getMaxPages()
  - timeAgo() date formatting

- **api.test.js** (12 tests)
  - searchUsers(), getUser(), getUserRepos()
  - searchRepos() with filters
  - Error handling (403, 404, 422, 500)
  - Rate limit header parsing

- **render.test.js** (18 tests)
  - renderDevCard(), renderRepoCard()
  - renderProfileHeader(), renderSkeletonCards()
  - renderEmptyState(), renderErrorToast()
  - renderPagination() with click handlers

Run tests with:
```bash
npm test
npm run test:coverage  # with coverage report
```

## 🎨 Design System

### Colors
- **Primary Navy:** `#1A395B`
- **Accent Gold:** `#C79639`
- **Base White:** `#FFFFFF`
- **Background:** `#F4F6F9` (light mode)
- **Dark Background:** `#0F1419` (dark mode)

### Typography
- **Headings:** Georgia (serif)
- **Body:** Inter (sans-serif)
- **Monospace:** JetBrains Mono (stats/code)

### Spacing Scale
- Base unit: 4px
- Range: xs (4px) to 4xl (96px)

### Responsive Breakpoints
- **Desktop:** 1200px+
- **Tablet:** 1024px - 1199px
- **Mobile-md:** 768px - 1023px
- **Mobile-sm:** 480px - 767px

## 🌙 Dark Mode

Dark mode is controlled by:
1. User preference via toggle button (persists in localStorage)
2. System preference fallback (prefers-color-scheme media query)
3. CSS variable overrides with `[data-theme="dark"]` attribute

## 📝 Development Workflow

1. **Feature Branch:** Create feature branch from `main`
2. **Local Testing:** Run `npm test` to ensure tests pass
3. **Code Review:** Submit pull request (CI/CD will run tests)
4. **Merge:** Once tests pass, merge to `main`
5. **Deploy:** GitHub Actions automatically deploys to GitHub Pages

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/description`
3. Make changes and test: `npm test`
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature/description`
6. Submit pull request

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

## 👤 Author

**Jonathan Ayany (Myles)**
- Email: jonathan@example.com
- Phone: +1-234-567-8900
- GitHub: [@myles](https://github.com/myles)
- Website: https://myles.dev

## 🙏 Acknowledgments

- [GitHub REST API](https://docs.github.com/en/rest) for developer data
- [Mdn Web Docs](https://developer.mozilla.org/) for technical references
- All African developers making open-source contributions

## 📞 Support

Found a bug or have a feature request? [Create an issue](https://github.com/[username]/afridev-explorer/issues)

---

**Happy exploring! 🚀 Discover African tech talent and celebrate innovation across the continent.**
