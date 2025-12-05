/**
 * Cache utility functions for managing sessionStorage
 */

const CACHE_KEYS = {
  HOME_PAGE_DATA: 'homePageData',
  HOME_PAGE_TIMESTAMP: 'homePageDataTimestamp',
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached data if valid
 * @param {string} key - Cache key
 * @returns {any|null} - Cached data or null if invalid/expired
 */
export const getCachedData = (key) => {
  try {
    const data = sessionStorage.getItem(key);
    const timestamp = sessionStorage.getItem(`${key}Timestamp`);
    
    if (!data || !timestamp) return null;
    
    const now = Date.now();
    if (now - parseInt(timestamp) > CACHE_DURATION) {
      // Cache expired
      clearCache(key);
      return null;
    }
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

/**
 * Set cached data with timestamp
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
export const setCachedData = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
    sessionStorage.setItem(`${key}Timestamp`, Date.now().toString());
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

/**
 * Clear specific cache
 * @param {string} key - Cache key
 */
export const clearCache = (key) => {
  try {
    sessionStorage.removeItem(key);
    sessionStorage.removeItem(`${key}Timestamp`);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Clear all cache
 */
export const clearAllCache = () => {
  try {
    Object.values(CACHE_KEYS).forEach(key => {
      clearCache(key);
    });
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
};

export { CACHE_KEYS };
