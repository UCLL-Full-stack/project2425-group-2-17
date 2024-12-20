module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Setup file for jest-dom
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
      '@styles/(.*)': '<rootDir>/styles/$1', // Map @styles alias
    },
  };
  