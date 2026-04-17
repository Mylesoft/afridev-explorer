# Testing Infrastructure

This directory contains the complete testing infrastructure for the AfriDev Explorer project.

## Overview

The testing suite includes:
- **Unit Tests**: Individual function testing for API, render, and utility functions
- **Integration Tests**: End-to-end testing of page functionality and user interactions
- **Coverage Reports**: Code coverage analysis to ensure comprehensive testing

## Test Structure

```
tests/
  README.md           # This documentation
  setup.js            # Jest setup and global mocks
  api.test.js         # API function tests
  render.test.js      # Rendering function tests
  utils.test.js       # Utility function tests
  integration.test.js # Integration tests
```

## Running Tests

### Development Mode
```bash
# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests once
npm test
```

### CI/CD Mode
```bash
# Run tests for CI (no watch, full coverage)
npm run test:ci
```

## Test Coverage

### API Functions (`api.test.js`)
- `apiFetch()` - Core API request handling
- `getUser()` - User data fetching
- `searchUsers()` - User search functionality
- `searchRepos()` - Repository search
- `getUserRepos()` - User repositories
- `getUserEvents()` - User activity events
- `getRepoReadme()` - README content fetching
- `searchByFramework()` - Framework-based search
- `searchDevelopersByTech()` - Technology search
- `searchCofounders()` - Co-founder search
- `searchJobSeekers()` - Job seeker search
- `updateRateLimitDisplay()` - Rate limit UI updates
- Error handling and retry mechanisms

### Render Functions (`render.test.js`)
- `renderDevCard()` - Developer card rendering
- `renderRepoCard()` - Repository card rendering
- `renderProfileHeader()` - Profile header rendering
- `renderActivityCard()` - Activity card rendering
- `renderPagination()` - Pagination component
- `renderSkeletonCards()` - Loading states
- `renderEmptyState()` - Empty state messages
- `renderErrorToast()` - Error notifications
- `renderTechInsights()` - Technology insights
- `renderCountryDensity()` - Country density visualization
- `renderSpotlightDeveloper()` - Featured developer cards
- `attachCardActionHandlers()` - Event handler attachment

### Utility Functions (`utils.test.js`)
- `sanitize()` - XSS protection
- `debounce()` - Function debouncing
- `formatNumber()` - Number formatting
- `timeAgo()` - Relative time formatting
- `getLanguageColor()` - Language color mapping
- `getQueryParam()` - URL parameter parsing
- `getMaxPages()` - Pagination calculation
- `buildDateFilter()` - Date filter construction
- Search history management
- Bookmark system functionality
- Cache management
- Rate limit bar updates

### Integration Tests (`integration.test.js`)
- Home page functionality (search, country pills, tech insights)
- Developers page functionality (tabs, filters, pagination)
- Repositories page functionality (language pills, README preview)
- Profile page functionality (heatmap, similar developers, bookmarks)
- Activity page functionality (auto-refresh, filters, live indicator)
- Navigation and mobile menu
- Error handling and loading states
- Performance and accessibility
- Responsive design

## Test Statistics

### Total Test Cases: 38+
- **API Tests**: 15 test cases
- **Render Tests**: 12 test cases  
- **Utils Tests**: 18 test cases
- **Integration Tests**: 20 test cases

### Coverage Targets
- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 95%+
- **Lines**: 90%+

## Mocking Strategy

### API Mocking
- Global `fetch` mock for HTTP requests
- GitHub API response simulation
- Error scenario testing

### DOM Mocking
- JSDOM environment for browser simulation
- LocalStorage mocking
- Event handling simulation

### Utility Mocking
- Cross-module dependency mocking
- Time-based function mocking
- External service mocking

## Configuration Files

### `package.json`
- Jest configuration with jsdom environment
- Test scripts for different scenarios
- Coverage reporting setup
- Babel transpilation for ES6+

### `setup.js`
- Global test environment setup
- Mock implementations for browser APIs
- Test utility functions
- Error handling configuration

## Best Practices

### Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Test both success and failure scenarios

### Mock Management
- Clear mocks before each test
- Use consistent mock data
- Mock external dependencies
- Avoid over-mocking

### Coverage Goals
- Aim for high coverage on critical paths
- Focus on business logic over implementation details
- Test edge cases and error conditions
- Maintain readable and maintainable tests

## CI/CD Integration

### GitHub Actions
- Automated testing on push/PR
- Multi-node version testing (18.x, 20.x)
- Coverage reporting to Codecov
- Test result archiving

### Coverage Reporting
- LCOV format for detailed coverage
- HTML reports for local viewing
- Threshold enforcement for quality gates

## Running Tests Locally

### Prerequisites
```bash
# Install dependencies
npm install
```

### Development Workflow
```bash
# Watch mode for development
npm run test:watch

# Coverage for quality check
npm run test:coverage

# Full test suite
npm test
```

### Coverage Reports
Coverage reports are generated in the `coverage/` directory:
- `coverage/lcov-report/index.html` - Interactive HTML report
- `coverage/lcov.info` - LCOV format for CI tools

## Debugging Tests

### Common Issues
1. **Module Import Errors**: Check mock implementations
2. **DOM Issues**: Verify JSDOM setup
3. **Async Test Failures**: Use proper async/await patterns
4. **Mock Persistence**: Clear mocks in beforeEach

### Debugging Tools
- `console.log` for test output
- Jest debugger integration
- Coverage reports for untested code
- Test filtering for specific scenarios

## Future Enhancements

### Planned Additions
- E2E testing with Playwright
- Visual regression testing
- Performance testing
- Accessibility testing automation

### Test Maintenance
- Regular test review and cleanup
- Coverage threshold adjustments
- Mock data updates
- Test documentation updates
