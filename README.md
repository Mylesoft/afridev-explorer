# AfriDev Explorer 🌍

> Discover African software developers and open-source repositories via GitHub.

[![Deploy to GitHub Pages](https://github.com/Mylesoft/afridev-explorer/workflows/Deploy/badge.svg)](https://github.com/Mylesoft/afridev-explorer/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Table of Contents

1. [Live Site](#live-site)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Project Structure](#project-structure)
5. [GitHub API](#github-api)
6. [Pages & Functionality](#pages--functionality)
7. [Design System](#design-system)
8. [Contributing](#contributing)
9. [Author](#author)
10. [License](#license)

---

## Live Site

🚀 **https://Mylesoft.github.io/afridev-explorer/**

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Markup** | HTML5 | — |
| **Styles** | Vanilla CSS | — |
| **Scripts** | Vanilla JavaScript | ES2022+ |
| **Fonts** | Google Fonts | — |
| **API** | GitHub REST API v3 | — |
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
- **Developer Bookmarks** - Save and export your favorite developers as JSON
- **Search History** - Autocomplete suggestions from previous searches
- **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- **Accessible** - WCAG AA compliant with semantic HTML, ARIA labels, and keyboard navigation

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
