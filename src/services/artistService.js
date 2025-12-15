import api from './api';

/**
 * Artist API Service
 */
const artistService = {
  /**
   * Lấy danh sách nghệ sĩ
   * @param {Object} params - Query parameters (page, limit, search, status, genre, verified)
   * @returns {Promise}
   */
  getAllArtists: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/artists${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Lấy nghệ sĩ theo ID
   * @param {string} id - Artist ID
   * @returns {Promise}
   */
  getArtistById: (id) => {
    return api.get(`/artists/${id}`);
  },

  /**
   * Tạo nghệ sĩ mới
   * @param {Object} artistData - Artist data
   * @returns {Promise}
   */
  createArtist: (artistData) => {
    return api.post('/artists', artistData);
  },

  /**
   * Cập nhật nghệ sĩ
   * @param {string} id - Artist ID
   * @param {Object} artistData - Updated artist data
   * @returns {Promise}
   */
  updateArtist: (id, artistData) => {
    return api.put(`/artists/${id}`, artistData);
  },

  /**
   * Xóa nghệ sĩ
   * @param {string} id - Artist ID
   * @returns {Promise}
   */
  deleteArtist: (id) => {
    return api.delete(`/artists/${id}`);
  },

  /**
   * Follow nghệ sĩ
   * @param {string} id - Artist ID
   * @returns {Promise}
   */
  followArtist: (id) => {
    return api.post(`/artists/${id}/follow`, {});
  },

  /**
   * Unfollow nghệ sĩ
   * @param {string} id - Artist ID
   * @returns {Promise}
   */
  unfollowArtist: (id) => {
    return api.post(`/artists/${id}/unfollow`, {});
  },

  /**
   * Lấy danh sách nghệ sĩ đã theo dõi
   * @returns {Promise}
   */
  getFollowedArtists: () => {
    return api.get('/artists/followed');
  },

  /**
   * Lấy thống kê
   * @returns {Promise}
   */
  getStatistics: () => {
    return api.get('/artists/statistics');
  },
};

export default artistService;
