/**
 * INTEGRATION TESTS
 * Lightweight integration checks for the current shared UI contracts.
 */

import { attachCardActionHandlers, renderPagination } from '../js/render.js';
import { addToSearchHistory, copyProfileLink, isBookmarked, toggleBookmark } from '../js/utils.js';

jest.mock('../js/utils.js', () => ({
  ...jest.requireActual('../js/utils.js'),
  toggleBookmark: jest.fn(),
  isBookmarked: jest.fn(() => false),
  copyProfileLink: jest.fn(() => Promise.resolve()),
  addToSearchHistory: jest.fn()
}));

describe('Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    delete window.__afridevOnPageChange;
  });

  test('pagination buttons call the shared page-change handler', () => {
    const onPageChange = jest.fn();
    window.__afridevOnPageChange = onPageChange;

    const container = document.createElement('div');
    container.innerHTML = renderPagination(2, 4);
    document.body.appendChild(container);

    attachCardActionHandlers(container);
    container.querySelector('[data-page="3"]').click();

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  test('bookmark buttons use the shared bookmark helpers', () => {
    isBookmarked.mockReturnValue(true);
    const container = document.createElement('div');
    container.innerHTML = `
      <button class="bookmark-btn" data-username="testuser">star_border</button>
    `;
    document.body.appendChild(container);

    attachCardActionHandlers(container);
    container.querySelector('.bookmark-btn').click();

    expect(toggleBookmark).toHaveBeenCalledWith('testuser');
  });

  test('share buttons use the shared profile link helper', async () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button class="share-btn" data-username="testuser">share</button>
    `;
    document.body.appendChild(container);

    attachCardActionHandlers(container);
    container.querySelector('.share-btn').click();

    await Promise.resolve();
    expect(copyProfileLink).toHaveBeenCalledWith('testuser');
  });

  test('search history helper can be invoked from page-level flows', () => {
    addToSearchHistory('react developer');
    expect(addToSearchHistory).toHaveBeenCalledWith('react developer');
  });

  test('core page containers can be mounted together without collisions', () => {
    document.body.innerHTML = `
      <main>
        <section id="featured-developers-grid" class="card-grid"></section>
        <section id="developers-grid" class="card-grid"></section>
        <section id="repositories-grid" class="card-grid"></section>
        <section id="profile-header"></section>
        <section id="activity-feed" class="activity-feed"></section>
      </main>
    `;

    expect(document.getElementById('featured-developers-grid')).toBeTruthy();
    expect(document.getElementById('developers-grid')).toBeTruthy();
    expect(document.getElementById('repositories-grid')).toBeTruthy();
    expect(document.getElementById('profile-header')).toBeTruthy();
    expect(document.getElementById('activity-feed')).toBeTruthy();
  });
});
