import api from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

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

  uploadAudio: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/songs/upload-audio`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Không thể upload file nhạc');
    }

    const audioUrlPath = data?.data?.audioUrl;
    if (!audioUrlPath) {
      throw new Error('Upload thành công nhưng không nhận được audioUrl');
    }

    return {
      ...data,
      data: {
        ...data.data,
        audioUrl: audioUrlPath.startsWith('http')
          ? audioUrlPath
          : `${SERVER_BASE_URL}${audioUrlPath}`,
      },
    };
  },
};

export default songService;
