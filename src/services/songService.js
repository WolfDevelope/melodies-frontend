import api from './api';

/**
 * Song API Service
 */
const songService = {
  /**
   * Lấy danh sách bài hát
   * @param {Object} params - Query parameters (page, limit, search, status, genre)
   * @returns {Promise}
   */
  getAllSongs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/songs${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Lấy bài hát theo ID
   * @param {string} id - Song ID
   * @returns {Promise}
   */
  getSongById: (id) => {
    return api.get(`/songs/${id}`);
  },

  /**
   * Tạo bài hát mới
   * @param {Object} songData - Song data
   * @returns {Promise}
   */
  createSong: (songData) => {
    return api.post('/songs', songData);
  },

  /**
   * Cập nhật bài hát
   * @param {string} id - Song ID
   * @param {Object} songData - Updated song data
   * @returns {Promise}
   */
  updateSong: (id, songData) => {
    return api.put(`/songs/${id}`, songData);
  },

  /**
   * Xóa bài hát
   * @param {string} id - Song ID
   * @returns {Promise}
   */
  deleteSong: (id) => {
    return api.delete(`/songs/${id}`);
  },

  /**
   * Tăng lượt nghe
   * @param {string} id - Song ID
   * @returns {Promise}
   */
  incrementPlays: (id) => {
    return api.post(`/songs/${id}/play`, {});
  },

  /**
   * Toggle like
   * @param {string} id - Song ID
   * @param {boolean} increment - true to like, false to unlike
   * @returns {Promise}
   */
  toggleLike: (id, increment = true) => {
    return api.post(`/songs/${id}/like`, { increment });
  },

  /**
   * Lấy thống kê
   * @returns {Promise}
   */
  getStatistics: () => {
    return api.get('/songs/statistics');
  },
};

export default songService;
