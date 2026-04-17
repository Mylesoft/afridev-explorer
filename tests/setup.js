// Jest setup file
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: jest.fn((key) => localStorageMock.store[key] ?? null),
  setItem: jest.fn((key, value) => {
    localStorageMock.store[key] = String(value);
  }),
  removeItem: jest.fn((key) => {
    delete localStorageMock.store[key];
  }),
  clear: jest.fn(() => {
    localStorageMock.store = {};
  }),
};
global.localStorage = localStorageMock;
global.localStorageMock = localStorageMock;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock fetch API
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock DOM APIs that might not be available in jsdom
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:8080',
    origin: 'http://localhost:8080',
    protocol: 'http:',
    host: 'localhost:8080',
    hostname: 'localhost',
    port: '8080',
    pathname: '/',
    search: '',
    hash: '',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
  },
  writable: true,
});

// Mock scrollTo
global.scrollTo = jest.fn();

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
