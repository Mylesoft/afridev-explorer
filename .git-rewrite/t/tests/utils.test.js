/**
 * UTILS.TEST.JS - Unit tests for utility functions
 */

import {
  sanitize,
  debounce,
  formatNumber,
  getMaxPages,
  getLanguageColor
} from '../js/utils.js';

describe('utils.js', () => {
  test('sanitize strips script tags', () => {
    const result = sanitize('<script>alert(1)</script>');
    expect(result).not.toContain('<script>');
  });

  test('sanitize returns empty string for null', () => {
    expect(sanitize(null)).toBe('');
  });

  test('formatNumber formats thousands with k', () => {
    expect(formatNumber(1234)).toBe('1.2k');
  });

  test('formatNumber formats millions with M', () => {
    expect(formatNumber(1234567)).toBe('1.2M');
  });

  test('formatNumber returns string for small numbers', () => {
    expect(formatNumber(999)).toBe('999');
  });

  test('getMaxPages caps at 1000 results', () => {
    const result = getMaxPages(5000, 12);
    expect(result).toBeLessThanOrEqual(Math.ceil(1000 / 12));
  });

  test('getMaxPages handles smaller totals', () => {
    expect(getMaxPages(200, 12)).toBe(Math.ceil(200 / 12));
  });

  test('getLanguageColor returns color for known languages', () => {
    expect(getLanguageColor('JavaScript')).toBe('#f1e05a');
    expect(getLanguageColor('Python')).toBe('#3572A5');
  });

  test('getLanguageColor returns default for unknown', () => {
    expect(getLanguageColor('UnknownLang')).toBe('#858585');
  });

  test('debounce delays function execution', () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const debounced = debounce(fn, 100);
    debounced();
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  test('debounce cancels previous calls', () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const debounced = debounce(fn, 50);
    debounced();
    debounced();
    debounced();
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
