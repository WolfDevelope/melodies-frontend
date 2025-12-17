/**
 * Base API configuration
 */
const RAW_API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = String(RAW_API_BASE_URL).replace(/\/+$/, '');

/**
 * API request wrapper with error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  const safeEndpoint = String(endpoint || '');
  const path = safeEndpoint.startsWith('/') ? safeEndpoint : `/${safeEndpoint}`;
  const url = `${API_BASE_URL}${path}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Đã có lỗi xảy ra');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * API methods
 */
const api = {
  get: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      method: 'GET',
      ...options,
    });
  },

  post: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  },

  put: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  },

  delete: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      method: 'DELETE',
      ...options,
    });
  },
};

export default api;
