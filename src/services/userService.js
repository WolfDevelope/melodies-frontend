import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

/**
 * Get all users with filters
 */
export const getAllUsers = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};

/**
 * Update user role
 */
export const updateUserRole = async (userId, role) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user role');
  }
};

/**
 * Update user status
 */
export const updateUserStatus = async (userId, isActive) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}/status`, { isActive });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user status');
  }
};

/**
 * Delete user
 */
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

/**
 * Get user statistics
 */
export const getUserStatistics = async () => {
  try {
    const response = await axios.get(`${API_URL}/statistics`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getUserStatistics,
};
