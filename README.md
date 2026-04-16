# AfriDev Explorer

> Discover African developers and open-source repositories via GitHub API

[![Test and Deploy](https://github.com/[username]/afridev-explorer/workflows/Test%20and%20Deploy/badge.svg)](https://github.com/[username]/afridev-explorer/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌍 Live Demo

[AfriDev Explorer](https://[username].github.io/afridev-explorer)

## ✨ Features

- **Search African Developers** - Browse developers from 54+ nations across Africa
- **Discover Repositories** - Explore trending open-source projects by language
- **Developer Profiles** - View detailed profiles with contributions and statistics
- **Dark Mode** - Toggle between light and dark themes with system preference support
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Data** - Integration with GitHub REST API for live developer statistics
- **Accessibility** - Semantic HTML, ARIA labels, and keyboard navigation support

## 🛠 Tech Stack

- **Frontend:** HTML5, Vanilla CSS, ES6+ JavaScript
- **API:** GitHub REST API v3
- **Testing:** Jest (unit tests)
- **Deployment:** GitHub Pages via GitHub Actions
- **Design System:** Custom CSS with variable theming

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Modern web browser
- (Optional) GitHub Personal Access Token for higher API rate limits

## 🚀 Getting Started

### Installation

```bash
# Clone repository
git clone https://github.com/[username]/afridev-explorer.git
cd afridev-explorer

# Install dependencies
npm install
```

### Local Development

```bash
# Start local development server (required for ES6 modules)
npx live-server

# Or use Python's built-in server
python3 -m http.server 8000

# Visit http://localhost:8000
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📁 Project Structure

```
afridev-explorer/
├── index.html              # Landing page
├── developers.html         # Developer search page
├── repositories.html       # Repository browse page
├── profile.html           # Individual developer profile
├── about.html             # About page
├── 404.html               # Error page
├── assets/                # Images and icons
├── css/
│   ├── reset.css          # Browser normalization
│   ├── variables.css      # Design tokens (colors, fonts, spacing)
│   ├── main.css           # Global layouts (navbar, hero, footer)
│   ├── components.css     # Reusable UI components
│   └── responsive.css     # Mobile-first breakpoints
├── js/
│   ├── api.js             # GitHub API integration
│   ├── render.js          # DOM rendering functions
│   ├── utils.js           # Utility functions
│   ├── theme.js           # Dark mode management
│   ├── home.js            # Home page logic
│   ├── developers.js      # Developers page logic
│   ├── repositories.js    # Repositories page logic
│   └── profile.js         # Profile page logic
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
