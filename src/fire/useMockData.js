/**
 * Conditional wrapper for mock vs Firebase data
 * Routes to mock data when VITE_USE_MOCK_DATA environment variable is true
 */

// Check if we should use mock data
export const useMockData = () => {
  return import.meta.env.VITE_USE_MOCK_DATA === 'true'
}

/**
 * Wrapper function that routes to mock or real implementation
 * @param {Function} mockFn - Mock implementation
 * @param {Function} realFn - Real Firebase implementation
 * @returns {Function} - The appropriate function based on environment
 */
export const withMockData = (mockFn, realFn) => {
  return (...args) => {
    if (useMockData()) {
      return mockFn(...args)
    }
    return realFn(...args)
  }
}



