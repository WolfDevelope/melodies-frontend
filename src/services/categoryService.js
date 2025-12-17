import axios from 'axios';

const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = String(RAW_API_BASE_URL).replace(/\/+$/, '');
const API_URL = `${API_BASE_URL}/categories`;

/**
 * Get all categories with filters
 */
export const getAllCategories = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch categories');
  }
};

/**
 * Get category by ID
 */
export const getCategoryById = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/${categoryId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch category');
  }
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/slug/${slug}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch category');
  }
};

/**
 * Create new category
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(API_URL, categoryData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create category');
  }
};

/**
 * Update category
 */
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await axios.put(`${API_URL}/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update category');
  }
};

/**
 * Delete category
 */
export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`${API_URL}/${categoryId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete category');
  }
};

/**
 * Add songs to category
 */
export const addSongsToCategory = async (categoryId, songIds) => {
  try {
    const response = await axios.post(`${API_URL}/${categoryId}/songs`, { songIds });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add songs');
  }
};

/**
 * Remove songs from category
 */
export const removeSongsFromCategory = async (categoryId, songIds) => {
  try {
    const response = await axios.delete(`${API_URL}/${categoryId}/songs`, { data: { songIds } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove songs');
  }
};

/**
 * Add albums to category
 */
export const addAlbumsToCategory = async (categoryId, albumIds) => {
  try {
    const response = await axios.post(`${API_URL}/${categoryId}/albums`, { albumIds });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add albums');
  }
};

/**
 * Remove albums from category
 */
export const removeAlbumsFromCategory = async (categoryId, albumIds) => {
  try {
    const response = await axios.delete(`${API_URL}/${categoryId}/albums`, { data: { albumIds } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove albums');
  }
};

/**
 * Add artists to category
 */
export const addArtistsToCategory = async (categoryId, artistIds) => {
  try {
    const response = await axios.post(`${API_URL}/${categoryId}/artists`, { artistIds });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add artists');
  }
};

/**
 * Remove artists from category
 */
export const removeArtistsFromCategory = async (categoryId, artistIds) => {
  try {
    const response = await axios.delete(`${API_URL}/${categoryId}/artists`, { data: { artistIds } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove artists');
  }
};

/**
 * Increment view count
 */
export const incrementViewCount = async (categoryId) => {
  try {
    const response = await axios.put(`${API_URL}/${categoryId}/view`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to increment view count');
  }
};

/**
 * Get category statistics
 */
export const getCategoryStatistics = async () => {
  try {
    const response = await axios.get(`${API_URL}/statistics`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
  }
};

export default {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  addSongsToCategory,
  removeSongsFromCategory,
  addAlbumsToCategory,
  removeAlbumsFromCategory,
  addArtistsToCategory,
  removeArtistsFromCategory,
  incrementViewCount,
  getCategoryStatistics,
};
