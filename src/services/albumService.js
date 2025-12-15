import api from './api';

/**
 * Album API Service
 */
const albumService = {
  /**
   * Lấy danh sách albums
   * @param {Object} params - Query parameters (page, limit, search, status, genre)
   * @returns {Promise}
   */
  getAllAlbums: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/albums${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Lấy album theo ID
   * @param {string} id - Album ID
   * @returns {Promise}
   */
  getAlbumById: (id) => {
    return api.get(`/albums/${id}`);
  },

  /**
   * Tạo album mới
   * @param {Object} albumData - Album data
   * @returns {Promise}
   */
  createAlbum: (albumData) => {
    return api.post('/albums', albumData);
  },

  /**
   * Cập nhật album
   * @param {string} id - Album ID
   * @param {Object} albumData - Updated album data
   * @returns {Promise}
   */
  updateAlbum: (id, albumData) => {
    return api.put(`/albums/${id}`, albumData);
  },

  /**
   * Xóa album
   * @param {string} id - Album ID
   * @returns {Promise}
   */
  deleteAlbum: (id) => {
    return api.delete(`/albums/${id}`);
  },

  /**
   * Tăng lượt phát
   * @param {string} id - Album ID
   * @returns {Promise}
   */
  incrementPlays: (id) => {
    return api.post(`/albums/${id}/play`, {});
  },

  /**
   * Toggle like
   * @param {string} id - Album ID
   * @returns {Promise}
   */
  toggleLike: (id) => {
    return api.post(`/albums/${id}/like`, {});
  },

  /**
   * Lấy danh sách album yêu thích
   * @returns {Promise}
   */
  getFavoriteAlbums: () => {
    return api.get('/albums/favorites');
  },

  /**
   * Thêm album vào thư viện (yêu thích)
   * @param {string} id - Album ID
   * @returns {Promise}
   */
  favoriteAlbum: (id) => {
    return api.post(`/albums/${id}/favorite`, {});
  },

  /**
   * Xóa album khỏi thư viện (yêu thích)
   * @param {string} id - Album ID
   * @returns {Promise}
   */
  unfavoriteAlbum: (id) => {
    return api.post(`/albums/${id}/unfavorite`, {});
  },

  /**
   * Lấy thống kê
   * @returns {Promise}
   */
  getStatistics: () => {
    return api.get('/albums/statistics');
  },
};

export default albumService;
