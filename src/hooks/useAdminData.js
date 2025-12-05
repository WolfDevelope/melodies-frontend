import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';

/**
 * Custom hook for admin data management with caching and optimization
 * @param {Function} fetchFunction - API function to fetch data
 * @param {Object} options - Configuration options
 * @returns {Object} - State and functions for data management
 */
const useAdminData = (fetchFunction, options = {}) => {
  const {
    cacheKey = '',
    cacheTTL = 5 * 60 * 1000, // 5 minutes default
    debounceDelay = 500,
    initialPageSize = 10,
    errorMessage = 'Không thể tải dữ liệu',
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: initialPageSize,
    total: 0,
  });

  // Refs for optimization
  const debounceTimerRef = useRef(null);
  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);

  /**
   * Fetch data with caching
   */
  const fetchData = useCallback(async (params = {}) => {
    try {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setLoading(true);

      // Generate cache key
      const fullCacheKey = `${cacheKey}_${JSON.stringify({
        page: pagination.current,
        pageSize: pagination.pageSize,
        search: searchText,
        ...params,
      })}`;

      // Check cache
      const cachedData = cacheRef.current.get(fullCacheKey);
      const now = Date.now();

      if (cachedData && (now - cachedData.timestamp) < cacheTTL) {
        console.log('📦 Using cached data for:', fullCacheKey);
        setData(cachedData.data);
        setPagination(prev => ({
          ...prev,
          total: cachedData.total,
        }));
        setLoading(false);
        return;
      }

      // Fetch fresh data
      console.log('🔄 Fetching fresh data...');
      const response = await fetchFunction({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
        ...params,
      });

      const responseData = response.data || response.songs || response.albums || response.artists || [];
      const total = response.pagination?.total || response.total || 0;

      setData(responseData);
      setPagination(prev => ({
        ...prev,
        total,
      }));

      // Cache the result
      cacheRef.current.set(fullCacheKey, {
        data: responseData,
        total,
        timestamp: now,
      });

      // Limit cache size to 20 entries
      if (cacheRef.current.size > 20) {
        const firstKey = cacheRef.current.keys().next().value;
        cacheRef.current.delete(firstKey);
      }

      console.log('✅ Data loaded successfully');
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching data:', error);
        message.error(error.message || errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, cacheKey, cacheTTL, pagination.current, pagination.pageSize, searchText, errorMessage]);

  /**
   * Debounced search
   */
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      // Reset to page 1 when searching
      setPagination(prev => ({ ...prev, current: 1 }));
      fetchData();
    }, debounceDelay);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchText, debounceDelay]);

  /**
   * Fetch when pagination changes
   */
  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    console.log('🗑️ Cache cleared');
  }, []);

  /**
   * Refresh data (bypass cache)
   */
  const refresh = useCallback(() => {
    clearCache();
    fetchData();
  }, [clearCache, fetchData]);

  /**
   * Handle table change
   */
  const handleTableChange = useCallback((newPagination, filters, sorter) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  }, []);

  /**
   * Handle search
   */
  const handleSearch = useCallback((value) => {
    setSearchText(value);
  }, []);

  return {
    data,
    loading,
    searchText,
    pagination,
    setSearchText: handleSearch,
    setPagination,
    fetchData,
    refresh,
    clearCache,
    handleTableChange,
  };
};

export default useAdminData;
