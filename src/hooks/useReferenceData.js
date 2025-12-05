import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for fetching reference data (albums, artists, etc.) with caching
 * @param {Function} fetchFunction - API function to fetch data
 * @param {Object} options - Configuration options
 * @returns {Object} - State and functions for reference data
 */
const useReferenceData = (fetchFunction, options = {}) => {
  const {
    cacheKey = '',
    cacheTTL = 10 * 60 * 1000, // 10 minutes for reference data
    autoFetch = false,
    limit = 100,
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef(null);
  const timestampRef = useRef(null);

  /**
   * Fetch reference data with caching
   */
  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      // Check cache
      const now = Date.now();
      if (!forceRefresh && cacheRef.current && timestampRef.current && 
          (now - timestampRef.current) < cacheTTL) {
        console.log('📦 Using cached reference data:', cacheKey);
        setData(cacheRef.current);
        return cacheRef.current;
      }

      setLoading(true);
      console.log('🔄 Fetching reference data:', cacheKey);

      const response = await fetchFunction({
        limit,
        status: 'active',
      });

      // Handle different response structures
      let responseData = [];
      if (response.data) {
        responseData = response.data;
      } else if (response.artists) {
        responseData = response.artists;
      } else if (response.albums) {
        responseData = response.albums;
      } else if (response.songs) {
        responseData = response.songs;
      } else if (Array.isArray(response)) {
        responseData = response;
      }

      // Cache the data
      cacheRef.current = responseData;
      timestampRef.current = now;
      setData(responseData);

      console.log('✅ Reference data loaded:', cacheKey, responseData.length, 'items');
      return responseData;
    } catch (error) {
      console.error('Error fetching reference data:', error);
      setData([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, cacheKey, cacheTTL, limit]);

  /**
   * Auto-fetch on mount if enabled
   */
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    cacheRef.current = null;
    timestampRef.current = null;
    console.log('🗑️ Reference cache cleared:', cacheKey);
  }, [cacheKey]);

  /**
   * Refresh data (bypass cache)
   */
  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return {
    data,
    loading,
    fetchData,
    refresh,
    clearCache,
  };
};

export default useReferenceData;
