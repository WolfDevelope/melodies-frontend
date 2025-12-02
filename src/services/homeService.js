import axios from 'axios';

const API_URL = 'http://localhost:5000/api/home';

/**
 * Get homepage data with featured categories and content
 */
export const getHomePageData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get personalized recommendations
 */
export const getRecommendations = async () => {
  try {
    const response = await axios.get(`${API_URL}/recommendations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get category details with its content
 */
export const getCategoryWithContent = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category content:', error);
    throw error.response?.data || error;
  }
};

export default {
  getHomePageData,
  getRecommendations,
  getCategoryWithContent,
};
